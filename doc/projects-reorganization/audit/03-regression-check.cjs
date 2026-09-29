const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.cwd();
const puppeteer = require(path.join(root, 'node_modules/puppeteer-core'));
const cheerio = require(path.join(root, 'node_modules/cheerio'));
const ts = require(path.join(root, 'node_modules/typescript'));
const base = 'http://127.0.0.1:3101';
const out = path.join(root, 'doc/projects-reorganization/baseline/plan03');
fs.mkdirSync(out, { recursive: true });
const results = [];
const pageErrors = [];
const aiRequests = [];
async function check(name, fn) {
    try { const detail = await fn(); results.push({ name, pass: true, detail }); console.log('PASS ' + name); }
    catch (error) { results.push({ name, pass: false, error: error.message }); console.log('FAIL ' + name + ': ' + error.message); }
}
const get = (p, method = 'GET') => fetch(base + p, { method, redirect: 'manual', signal: AbortSignal.timeout(20000) });
function data(source) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports });
    return JSON.parse(JSON.stringify(exports));
}

(async () => {
    const before = data(cp.execFileSync('git', ['show', '8c03538:src/data/careerData.ts'], { encoding: 'utf8' }));
    const projects = data(fs.readFileSync('src/data/projects.ts', 'utf8')).projectsData;
    await check('exact content preservation', () => assert.deepEqual({ ...data(fs.readFileSync('src/data/careerData.ts', 'utf8')), projectsData: projects }, before));
    const buildDir = JSON.parse(fs.readFileSync(path.join(out, 'build-workspace.json'))).dir;
    const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, '.next/prerender-manifest.json'), 'utf8'));
    const article = Object.keys(manifest.routes).find(p => p.startsWith('/blog/'));
    assert.ok(article);
    const routes = ['/', '/work', '/resume', '/writing', ...projects.map(p => '/project/' + p.id), article];
    for (const route of routes) await check('200 ' + route, async () => assert.equal((await get(route)).status, 200));
    function strings(value) {
        if (typeof value === 'string') return [value];
        if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
        return [];
    }
    for (const project of projects) await check('all project fields rendered ' + project.id, async () => {
        const $ = cheerio.load(await (await get('/project/' + project.id)).text());
        const content = $('main').text();
        const { id, featured, ...fields } = project;
        for (const value of strings(fields)) assert.ok(content.includes(value), value);
    });
    await check('home and work project order', async () => {
        for (const route of ['/', '/work']) {
            const $ = cheerio.load(await (await get(route)).text());
            const links = $('a[href^="/project/"]').toArray().map(el => $(el).attr('href'));
            assert.deepEqual(links, projects.map(p => '/project/' + p.id));
        }
    });
    for (const [route, target] of [['/career', '/resume'], ['/blog', '/writing'], ['/blog?page=2&tag=Next.js&search=Next&category=한글', '/writing']]) {
        await check('308 ' + route, async () => {
            const response = await get(route);
            assert.equal(response.status, 308);
            const location = new URL(response.headers.get('location'), base);
            assert.equal(location.pathname, target);
            assert.deepEqual([...location.searchParams].sort(), [...new URL(base + route).searchParams].sort());
        });
    }
    for (const [method, route, status] of [
        ['GET', '/project/not-a-real-project', 404], ['GET', '/ask', 404],
        ['GET', '/api/velog/crawl', 404], ['POST', '/api/velog/crawl', 404],
        ['GET', '/api/velog/test-detail', 404], ['GET', '/api-docs', 404],
        ['GET', '/api-docs/v1', 404], ['POST', '/api/chatbot/faqs', 405],
    ]) await check(method + ' ' + route, async () => assert.equal((await get(route, method)).status, status));

    for (const route of routes) await check('SEO ' + route, async () => {
        const $ = cheerio.load(await (await get(route)).text());
        const canonical = new URL($('link[rel=canonical]').attr('href'));
        assert.equal(decodeURIComponent(canonical.pathname), decodeURIComponent(route));
        assert.equal($('html').attr('lang'), 'ko');
        assert.ok($('title').text());
        assert.ok($('meta[name=description]').attr('content'));
        assert.equal(new URL($('meta[property="og:url"]').attr('content')).href, canonical.href);
        assert.ok($('meta[property="og:title"]').attr('content'));
        assert.ok($('meta[property="og:description"]').attr('content'));
        assert.ok($('meta[property="og:image"]').attr('content'));
        assert.ok($('meta[name="twitter:title"]').attr('content'));
        assert.ok($('meta[name="twitter:description"]').attr('content'));
        assert.ok($('meta[name="twitter:image"]').attr('content'));
        const graphs = $('script[type="application/ld+json"]').toArray().flatMap(el => JSON.parse($(el).text())['@graph'] ?? []);
        const breadcrumb = graphs.find(g => g['@type'] === 'BreadcrumbList');
        assert.ok(breadcrumb);
        assert.equal(decodeURIComponent(new URL(breadcrumb.itemListElement.at(-1).item).pathname), decodeURIComponent(route));
        if (route === article) assert.ok(graphs.find(g => g['@type'] === 'Article'));
        if (route.startsWith('/project/')) assert.ok(graphs.find(g => g['@type'] === 'WebPage'));
        if (route === '/work' || route === '/writing') assert.ok(graphs.find(g => g['@type'] === 'CollectionPage'));
    });
    await check('sitemap and robots', async () => {
        const xml = cheerio.load(await (await get('/sitemap.xml')).text(), { xmlMode: true });
        const urls = xml('loc').toArray().map(el => decodeURIComponent(new URL(xml(el).text()).pathname));
        for (const route of routes) assert.ok(urls.includes(decodeURIComponent(route)), route);
        for (const removed of ['/career', '/blog', '/ask']) assert.ok(!urls.includes(removed));
        assert.equal(urls.filter(p => p.startsWith('/project/')).length, 4);
        const oldArticles = cp.execFileSync('git', ['show', '8c03538:src/app/blog/[slug]/page.tsx'], { encoding: 'utf8' });
        assert.ok(oldArticles.includes('`/blog/${post.slug || decodedSlug}`'));
        const robots = await (await get('/robots.txt')).text();
        assert.ok(robots.includes('Disallow: /api/'));
        assert.ok(robots.includes('Allow: /writing?page='));
        assert.ok(robots.includes('Disallow: /writing?page=0'));
        assert.ok(!robots.includes('/blog?page=') && !robots.includes('/api-docs'));
        return { articles: urls.filter(p => p.startsWith('/blog/')).length };
    });

    const browsers = new Set();
    async function newPage(width = 1440, height = 900) {
        const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox', '--disable-gpu'] });
        browsers.add(browser);
        const page = await browser.newPage();
        const closePage = page.close.bind(page);
        page.close = async () => { await closePage(); await browser.close(); browsers.delete(browser); };
        await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: width === 390, hasTouch: width === 390 });
        page.on('request', r => { if (r.url().includes('/api/chatbot/')) aiRequests.push(new URL(r.url()).pathname); });
        page.on('pageerror', e => pageErrors.push(e.message));
        return page;
    }
    try {
        const screens = [['home', '/'], ['work', '/work'], ['project', '/project/realtime-support'], ['resume', '/resume'], ['writing', '/writing'], ['blog', article]];
        for (const [width, height, size] of [[390,844,'mobile'],[1440,900,'desktop']]) {
            for (const [name, route] of screens) await check('UI ' + name + ' ' + size, async () => {
                const page = await newPage(width, height);
                try {
                    await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 15000 });
                    await page.waitForNetworkIdle({ timeout: 15000 });
                    if (name === 'writing') await page.waitForSelector('main a[href^="/blog/"]', { timeout: 15000 });
                    if (name === 'home') {
                        await page.evaluate(() => {
                            const cta = [...document.querySelectorAll('a[href="/writing"]')].find(a => a.textContent.includes('전체 글'));
                            cta.scrollIntoView({ block: 'start' });
                        });
                        await page.waitForFunction(() => {
                            const link = [...document.querySelectorAll('a[href="/writing"]')].find(a => a.textContent.includes('전체 글'));
                            for (let el = link; el; el = el.parentElement) if (getComputedStyle(el).opacity === '0') return false;
                            return true;
                        });
                        await page.screenshot({ path: path.join(out, `home-writing-${size}.png`) });
                        await page.evaluate(() => scrollTo(0, 0));
                    }
                    const ui = await page.evaluate(() => ({
                        overflow: document.documentElement.scrollWidth > innerWidth,
                        h1: document.querySelector('h1')?.textContent,
                        oldLinks: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(p => p === '/blog' || p === '/career' || p.startsWith('/blog?') || p.startsWith('/career#') || p === '/ask'),
                        ai: !!document.querySelector('button[aria-label="Open chatbot"], [aria-label="Close chatbot"]'),
                        locale: [...document.querySelectorAll('button')].some(b => /^(EN|KO)$/.test(b.textContent.trim())),
                    }));
                    assert.equal(ui.overflow, false);
                    assert.ok(ui.h1);
                    assert.deepEqual(ui.oldLinks, []);
                    assert.equal(ui.ai, false);
                    assert.equal(ui.locale, false);
                    const activeHref = name === 'project' || name === 'work' ? '/work' : name === 'blog' || name === 'writing' ? '/writing' : name === 'resume' ? '/resume' : null;
                    if (activeHref) assert.ok(await page.$(`header nav a[aria-current="page"][href="${activeHref}"]`));
                    const links = await page.$$eval('.site-header nav a', els => els.map(a => a.textContent.trim()));
                    assert.deepEqual(links, ['프로젝트','글','이력서']);
                    assert.equal(await page.$$eval('main', els => els.length), 1);
                    await page.screenshot({ path: path.join(out, `${name}-${size}.png`), fullPage: true });
                    return ui;
                } finally { await page.close(); }
            });
        }
        await check('project link keyboard navigation and previous/next', async () => {
            const page = await newPage();
            try {
                await page.goto(base + '/work', { waitUntil: 'networkidle0' });
                await page.focus('a[href="/project/realtime-support"]');
                assert.equal(await page.evaluate(() => document.activeElement.matches(':focus-visible')), true);
                await Promise.all([page.waitForNavigation(), page.keyboard.press('Enter')]);
                assert.equal(new URL(page.url()).pathname, '/project/realtime-support');
                assert.ok(await page.$('nav[aria-label="프로젝트 이전 다음 탐색"] a[href="/project/snn-cms"]'));
                await page.goto(base + '/project/legal-platform', { waitUntil: 'networkidle0' });
                assert.ok(await page.$('nav[aria-label="프로젝트 이전 다음 탐색"] a[href="/project/erp-groupware"]'));
                assert.ok((await page.$eval('main', el => el.innerText)).includes(before.projectsData[3].scopeNote));
                assert.equal(await page.$$eval('nav[aria-label="프로젝트 이전 다음 탐색"] a', els => els.length), 1);
            } finally { await page.close(); }
        });
        await check('legacy career fragment', async () => {
            const page = await newPage(390,844);
            try {
                await page.goto(base + '/career#realtime-support', { waitUntil: 'networkidle0' });
                assert.equal(new URL(page.url()).pathname, '/resume');
                assert.equal(new URL(page.url()).hash, '#realtime-support');
                assert.ok(await page.$('#realtime-support a[href="/project/realtime-support"]'));
                for (const id of ['overview','experience','projects','capabilities','education',...projects.map(p=>p.id)]) assert.ok(await page.$('#'+id));
                const y = await page.$eval('#realtime-support', el => el.getBoundingClientRect().top);
                assert.ok(y >= 70 && y < 844, 'fragment visible below menu: ' + y);
            } finally { await page.close(); }
        });
        await check('writing pagination and combined filters', async () => {
            const page = await newPage();
            try {
                await page.goto(base + '/writing', { waitUntil:'networkidle0' });
                await page.waitForSelector('main a[href^="/blog/"]');
                await page.click('nav[aria-label="페이지네이션"] a[href="/writing?page=2"]');
                await page.waitForFunction(() => location.search.includes('page=2'));
                await page.waitForNetworkIdle();
                assert.ok(await page.$('nav[aria-label="페이지네이션"] a[aria-current="page"][href="/writing?page=2"]'));
                await page.goto(base + '/writing?category=Next.js&tag=React&search=Next', { waitUntil:'networkidle0' });
                const href = await page.$eval('#category-panel a', el => el.getAttribute('href'));
                assert.equal(new URL(href, base).searchParams.get('tag'), 'React');
                assert.equal(new URL(href, base).searchParams.get('search'), 'Next');
                await page.$eval('input[name=search]', el => { el.value = ''; });
                await page.type('input[name=search]', 'plan02-no-results-983742');
                await page.click('button[aria-label="검색 실행"]');
                await page.waitForFunction(() => location.search.includes('plan02-no-results'));
                await page.waitForNetworkIdle();
                assert.equal(new URL(page.url()).searchParams.get('category'), 'Next.js');
                assert.equal(new URL(page.url()).searchParams.get('tag'), 'React');
                await page.waitForFunction(() => document.body.innerText.includes('검색 조건에 맞는 포스트가 없습니다.'));
                await page.screenshot({ path: path.join(out, 'writing-empty.png') });
            } finally { await page.close(); }
        });
        await check('writing category/tag clicks and article return', async () => {
            const page = await newPage();
            try {
                await page.goto(base + '/writing', { waitUntil: 'networkidle0' });
                await page.waitForSelector('#category-panel a:nth-child(2)');
                const category = await page.$eval('#category-panel a:nth-child(2)', el => el.textContent.trim());
                await page.click('#category-panel a:nth-child(2)');
                await page.waitForFunction(value => new URL(location.href).searchParams.get('category') === value, {}, category);
                await page.waitForNetworkIdle();
                const tagSelector = 'aside a[href*="tag="]';
                await page.waitForSelector(tagSelector);
                const tag = await page.$eval(tagSelector, el => new URL(el.href).searchParams.get('tag'));
                await page.click(tagSelector);
                await page.waitForFunction(value => new URL(location.href).searchParams.get('tag') === value, {}, tag);
                await page.waitForNetworkIdle();
                assert.equal(new URL(page.url()).searchParams.get('category'), category);
                const selected = await page.$$('aside a');
                for (const link of selected) if (await link.evaluate((el, value) => el.textContent.trim() === '#' + value, tag)) { await link.click(); break; }
                await page.waitForFunction(() => !new URL(location.href).searchParams.has('tag'));
                assert.equal(new URL(page.url()).searchParams.get('category'), category);
                await page.goto(base + article, { waitUntil: 'networkidle0' });
                const back = await page.$$('a[href="/writing"]');
                let clicked = false;
                for (const link of back) if (await link.evaluate(el => el.textContent.includes('목록'))) { await link.click(); clicked = true; break; }
                assert.ok(clicked, 'article list return link');
                await page.waitForFunction(() => location.pathname === '/writing');
                await page.waitForSelector('main a[href^="/blog/"]');
            } finally { await page.close(); }
        });
        await check('writing loading and error states', async () => {
            const page = await newPage(390,844);
            try {
                await page.setRequestInterception(true);
                page.on('request', request => {
                    if (new URL(request.url()).pathname === '/api/blog/posts') {
                        setTimeout(() => request.respond({ status:500, contentType:'application/json', body:'{"result":{"success":false},"data":null}' }).catch(()=>{}), 2000);
                    } else request.continue().catch(()=>{});
                });
                await page.goto(base + '/writing', { waitUntil:'domcontentloaded' });
                await page.waitForSelector('[role=status][aria-label="글을 불러오는 중"]');
                await page.screenshot({ path: path.join(out, 'writing-loading.png') });
                await page.waitForSelector('[role=alert]');
                assert.ok((await page.$eval('[role=alert]', el=>el.textContent)).includes('글을 불러오지 못했습니다'));
                await page.screenshot({ path: path.join(out, 'writing-error.png') });
            } finally { await page.close(); }
        });
        await check('no automatic AI requests across all pages', () => assert.deepEqual(aiRequests, []));
    } finally { for (const browser of browsers) await browser.close(); }
    const report = { base, date:new Date().toISOString(), results, pageErrors:[...new Set(pageErrors)], aiRequests };
    fs.writeFileSync(path.join(out, 'regression.json'), JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,pageErrors:report.pageErrors}));
    if (results.some(r=>!r.pass) || report.pageErrors.length) process.exitCode=1;
})().catch(error => { console.error(error.message); process.exitCode=1; });
