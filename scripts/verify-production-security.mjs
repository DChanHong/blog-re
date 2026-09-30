import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
    if (!existsSync(".env")) return;
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const separator = trimmed.indexOf("=");
        if (separator < 1) continue;
        const key = trimmed.slice(0, separator).trim();
        if (process.env[key]) continue;
        let value = trimmed.slice(separator + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        process.env[key] = value;
    }
}

loadLocalEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = (process.env.SECURITY_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("security verification: required Supabase environment variables are missing");
    process.exit(1);
}

const expectedCounts = {
    velog: process.env.SECURITY_EXPECTED_VELOG_COUNT,
    chatbot_faq: process.env.SECURITY_EXPECTED_FAQ_COUNT,
    chatbot_rate_limit: process.env.SECURITY_EXPECTED_RATE_LIMIT_COUNT,
    chatbot_conversations: process.env.SECURITY_EXPECTED_CONVERSATION_COUNT,
    chatbot_settings: process.env.SECURITY_EXPECTED_SETTINGS_COUNT,
};

let failures = 0;

function report(ok, label, detail) {
    console.log(`${ok ? "PASS" : "FAIL"} ${label}: ${detail}`);
    if (!ok) failures += 1;
}

async function request(url, options = {}) {
    return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(15_000),
        redirect: "manual",
    });
}

function countFromResponse(response) {
    const contentRange = response.headers.get("content-range") || "";
    const match = contentRange.match(/\/(\d+|\*)$/);
    return match && match[1] !== "*" ? Number(match[1]) : null;
}

function countMatches(table, count) {
    if (!Number.isInteger(count) || count < 0) return false;
    const expected = expectedCounts[table];
    return expected === undefined || count === Number(expected);
}

async function tableCount(table, key) {
    const response = await request(`${supabaseUrl}/rest/v1/${table}?select=id`, {
        method: "HEAD",
        headers: {
            apikey: key,
            authorization: `Bearer ${key}`,
            prefer: "count=exact",
        },
    });
    return { status: response.status, count: countFromResponse(response) };
}

for (const table of ["velog", "chatbot_faq"]) {
    const result = await tableCount(table, anonKey);
    report(
        result.status === 200 && countMatches(table, result.count),
        `anon ${table} read`,
        `status=${result.status} count=${result.count ?? "unavailable"}`,
    );
}

for (const table of ["chatbot_rate_limit", "chatbot_conversations", "chatbot_settings"]) {
    const anonResult = await tableCount(table, anonKey);
    const anonBlocked =
        anonResult.status === 401 ||
        anonResult.status === 403 ||
        (anonResult.status === 200 && anonResult.count === 0);
    report(
        anonBlocked,
        `anon ${table} blocked`,
        `status=${anonResult.status} count=${anonResult.count ?? "unavailable"}`,
    );

    const serviceResult = await tableCount(table, serviceRoleKey);
    report(
        serviceResult.status === 200 && countMatches(table, serviceResult.count),
        `service role ${table} read`,
        `status=${serviceResult.status} count=${serviceResult.count ?? "unavailable"}`,
    );
}

if (process.env.SECURITY_SKIP_ROUTES !== "1") {
    const routeChecks = [
        ["GET", "/api/velog/crawl", 404],
        ["POST", "/api/velog/crawl", 404],
        ["GET", "/api/velog/test-detail", 404],
        ["POST", "/api/chatbot/faqs", 405],
        ["GET", "/api-docs", 404],
        ["GET", "/api-docs/v1", 404],
        ["GET", "/api/chatbot/faqs", 200],
    ];

    for (const [method, path, expectedStatus] of routeChecks) {
        const response = await request(`${baseUrl}${path}`, { method });
        report(
            response.status === expectedStatus,
            `${method} ${path}`,
            `status=${response.status} expected=${expectedStatus}`,
        );
    }
}

if (failures > 0) {
    console.error(`security verification failed: ${failures} check(s)`);
    process.exit(1);
}

console.log("security verification passed");
