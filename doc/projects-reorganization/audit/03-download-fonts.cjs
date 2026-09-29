// Download only the pinned official font binaries referenced by the local CSS.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const css = fs.readFileSync("src/styles/pretendard.css", "utf8");
const names = [...new Set(css.match(/PretendardVariable\.subset\.\d+\.woff2/g))];
const base = "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2-dynamic-subset/";
async function main() {
    const records = [];
    for (let start = 0; start < names.length; start += 6) {
        await Promise.all(names.slice(start, start + 6).map(async (name) => {
            const response = await fetch(base + name);
            if (!response.ok) throw new Error(name + ": " + response.status);
            const data = Buffer.from(await response.arrayBuffer());
            if (data.subarray(0, 4).toString() !== "wOF2") throw new Error("Invalid WOFF2: " + name);
            fs.writeFileSync(path.join("public/fonts/pretendard", name), data);
            records.push({ name, bytes: data.length, sha256: crypto.createHash("sha256").update(data).digest("hex") });
        }));
    }
    records.sort((a, b) => a.name.localeCompare(b.name));
    fs.mkdirSync("doc/projects-reorganization/baseline/plan03", { recursive: true });
    fs.writeFileSync("doc/projects-reorganization/baseline/plan03/fonts.json", JSON.stringify({ version: "1.3.9", totalBytes: records.reduce((sum, r) => sum + r.bytes, 0), records }, null, 2) + "\n");
    console.log(names.length + " official subsets downloaded.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
