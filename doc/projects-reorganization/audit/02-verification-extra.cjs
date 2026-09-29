// Additional final-verification checks. Run from repository root with port 3101 active.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require(path.join(process.cwd(), 'node_modules/puppeteer-core'));
const base = 'http://127.0.0.1:3101';
const out = 'doc/projects-reorganization/baseline/plan02';
const results = [];
async function check(name, action) {
    const browser = await puppeteer.launch({ headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        page.setDefaultTimeout(15000);
        await page.setViewport({ width: 390, height: 844 });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
        const detail = await action(page);
        results.push({ name, pass: true, detail });
        console.log('PASS ' + name);
    } catch (error) {
        results.push({ name, pass: false, error: error.message });
        console.log('FAIL ' + name + ': ' + error.message);
    } finally { await browser.close(); }
}
(async () => {
    await check('unknown project Korean 404 and recovery', async page => {
        const response = await page.goto(base + '/project/no-such-project', { waitUntil: 'networkidle0' });
        assert.equal(response.status(), 404);
        assert.equal(await page.$eval('h1', el => el.textContent.trim()), '페이지를 찾을 수 없습니다');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await page.screenshot({ path: path.join(out, 'verified-not-found-mobile.png') });
        const links = await page.$$('a[href="/"]');
        for (const link of links) if (await link.evaluate(el => el.textContent.includes('홈으로'))) { await link.click(); break; }
        await page.waitForFunction(() => location.pathname === '/');
    });
    await check('mobile reduced-motion keyboard menu and project links', async page => {
        await page.goto(base + '/work', { waitUntil: 'networkidle0' });
        await page.focus('button[aria-controls="mobile-site-menu"]');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), '프로젝트');
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-controls')), 'mobile-site-menu');
        await page.focus('a[href="/project/legal-platform"]');
        try {
            await page.waitForFunction(() => getComputedStyle(document.activeElement).boxShadow.includes('0px 0px 0px 2px'));
        } catch (error) {
            console.log(JSON.stringify(await page.evaluate(() => {
                const el = document.activeElement, style = getComputedStyle(el);
                return { tag: el.tagName, href: el.getAttribute('href'), visible: el.matches(':focus-visible'), classes: el.className, shadow: style.boxShadow, ring: style.getPropertyValue('--tw-ring-shadow'), offset: style.getPropertyValue('--tw-ring-offset-width'), color: style.getPropertyValue('--tw-ring-color'), inset: style.getPropertyValue('--tw-ring-inset') };
            })));
            await page.screenshot({ path: path.join(out, 'verified-focus-failure-mobile.png') });
            throw error;
        }
        const focus = await page.evaluate(() => {
            const el = document.activeElement;
            const rect = el.getBoundingClientRect();
            const x = Math.max(1, Math.min(innerWidth - 1, rect.x + rect.width / 2));
            const y = Math.max(100, Math.min(innerHeight - 130, rect.y + rect.height / 2));
            return { visible: el.matches(':focus-visible'), shadow: getComputedStyle(el).boxShadow, hit: el.contains(document.elementFromPoint(x, y)) };
        });
        assert.ok(focus.visible && focus.shadow !== 'none' && focus.hit);
        await page.screenshot({ path: path.join(out, 'verified-focus-mobile.png') });
        await page.keyboard.press('Enter');
        await page.waitForFunction(() => location.pathname === '/project/legal-platform');
        assert.ok((await page.$eval('main', el => el.textContent)).includes('출시 보류'));
        return focus;
    });
    await check('writing error retry recovers without external mutation', async page => {
        let fail = true;
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (fail && new URL(request.url()).pathname === '/api/blog/posts') request.respond({ status: 500, contentType: 'application/json', body: '{"result":{"success":false},"data":null}' }).catch(() => {});
            else request.continue().catch(() => {});
        });
        await page.goto(base + '/writing', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[role=alert]');
        fail = false;
        await page.click('[role=alert] button');
        await page.waitForSelector('main a[href^="/blog/"]');
        assert.equal(await page.$('[role=alert]'), null);
    });
    await check('repeated and encoded legacy query values', async () => {
        const query = '?tag=React&tag=Next.js&search=%ED%95%9C%EA%B8%80%20%26%20%2B&page=2';
        const response = await fetch(base + '/blog' + query, { redirect: 'manual' });
        assert.equal(response.status, 308);
        const target = new URL(response.headers.get('location'), base);
        assert.equal(target.pathname, '/writing');
        assert.deepEqual([...target.searchParams], [...new URL(base + '/blog' + query).searchParams]);
    });
    fs.writeFileSync(path.join(out, 'verification-extra.json'), JSON.stringify({ date: new Date().toISOString(), results }, null, 2) + '\n');
    if (results.some(r => !r.pass)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
