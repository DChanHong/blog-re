const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const puppeteer = require("puppeteer-core");
const base = "http://127.0.0.1:3101";
const out = "doc/projects-reorganization/baseline/plan03";
const buildDir = JSON.parse(fs.readFileSync(out + "/build-workspace.json")).dir;
const article = Object.keys(JSON.parse(fs.readFileSync(path.join(buildDir,".next/prerender-manifest.json"))).routes).find(p => p.startsWith("/blog/"));
const results = [], errors = [], aiRequests = [], contrasts = [];
const browsers = new Set();
const only = process.env.PLAN03_CHECK || "";
async function check(name, fn) {
    if (only && !name.includes(only)) return;
    try { const detail = await fn(); results.push({ name, pass: true, detail }); console.log("PASS " + name); }
    catch (e) { results.push({ name, pass: false, error: e.message }); console.log("FAIL " + name + ": " + e.message); }
}
async function pageFor(theme = "light", width = 390, height = 844) {
    const browser = await puppeteer.launch({ headless: true, executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--no-sandbox", "--disable-gpu"] });
    browsers.add(browser);
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }]);
    await page.evaluateOnNewDocument(()=>{
        window.__fontLayoutShift=0;
        window.__layoutShiftSources=[];
        new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){
            window.__fontLayoutShift+=e.value;
            window.__layoutShiftSources.push({value:e.value,fonts:document.fonts.status,nodes:(e.sources||[]).map(s=>s.node?.className||s.node?.nodeName)});
        }}).observe({type:"layout-shift",buffered:true});
    });
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (/hydration|did not match/i.test(m.text())) errors.push(m.text()); });
    page.on("request", r => { if (r.url().includes("/api/chatbot/")) aiRequests.push(r.url()); });
    page.close = async () => { await browser.close(); browsers.delete(browser); };
    return page;
}
async function goto(page, route) {
    await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForSelector("button.theme-toggle");
    if(route === "/writing") await page.waitForSelector('main a[href^="/blog/"]');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForNetworkIdle({ idleTime: 300, concurrency: 2, timeout: 15000 });
}
async function screenshot(page, name, fullPage = true) { await page.screenshot({ path: path.join(out, name + ".png"), fullPage }); }
async function layout(page) {
    return page.evaluate(() => {
        const rect = el => { const r = el.getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom }; };
        const header = document.querySelector(".site-header");
        return {
            overflow: document.documentElement.scrollWidth > innerWidth,
            main: document.querySelectorAll("main").length,
            header: rect(header),
            footerPosition: getComputedStyle(document.querySelector("footer")).position,
            containers: [...document.querySelectorAll(".portfolio-container")].map(rect),
            nav: [...header.querySelectorAll("a,button")].map(el=>({ ...rect(el), text:el.textContent, visible:getComputedStyle(el).display!=="none" })),
            background: getComputedStyle(document.body).backgroundColor,
            font: getComputedStyle(document.body).fontFamily,
            layoutShift: window.__fontLayoutShift,
            layoutShiftSources: window.__layoutShiftSources,
            reveal: [...document.querySelectorAll("[data-reveal]")].map(el=>getComputedStyle(el).opacity),
            animation: [...document.querySelectorAll(".animate-pulse,.animate-bounce")].map(el=>getComputedStyle(el).animationName),
        };
    });
}
async function contrast(page, name) {
    const samples = await page.evaluate(() => {
        const rgb = s => (s.match(/[\d.]+/g)||[]).map(Number);
        const lum = c => c.slice(0,3).map(v => { v/=255; return v<=.04045?v/12.92:((v+.055)/1.055)**2.4; }).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
        const ratio = (a,b) => (Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
        const bg = el => {
            for(let node=el;node;node=node.parentElement) {
                const c=rgb(getComputedStyle(node).backgroundColor);
                if(c.length===3 || c[3]===1) return c;
            }
            return rgb(getComputedStyle(document.documentElement).backgroundColor);
        };
        const records=[];
        for(const el of document.querySelectorAll("body *")) {
            if(["SCRIPT","STYLE","SVG","PATH"].includes(el.tagName) || el.closest('[aria-hidden="true"],svg')) continue;
            if(![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()) && el.tagName!=="INPUT") continue;
            const s=getComputedStyle(el);
            if(!el.getClientRects().length || s.visibility==="hidden" || +s.opacity<1 || el.closest('[aria-disabled="true"]')) continue;
            const front=rgb(s.color), back=bg(el);
            const large=parseFloat(s.fontSize)>=24 || (parseFloat(s.fontSize)>=18.66 && +s.fontWeight>=700);
            records.push({text:(el.textContent||el.getAttribute("placeholder")||"").trim().slice(0,55),color:s.color,background:back.slice(0,3),ratio:+ratio(front,back).toFixed(2),required:large?3:4.5});
            if(el.tagName==="INPUT") {
                const p=getComputedStyle(el,"::placeholder");
                records.push({text:"placeholder",color:p.color,background:back.slice(0,3),ratio:+ratio(rgb(p.color),back).toFixed(2),required:4.5});
            }
        }
        return records;
    });
    contrasts.push({ name, samples });
    const bad=samples.filter(s=>s.ratio<s.required);
    assert.deepEqual(bad, [], "contrast failures: "+JSON.stringify(bad.slice(0,8)));
    return { samples:samples.length, minimum:Math.min(...samples.map(s=>s.ratio)) };
}
(async()=>{
    const screens=[["home","/"],["work","/work"],["project","/project/realtime-support"],["resume","/resume"],["writing","/writing"],["blog",article],["404","/project/does-not-exist"]];
    for(const theme of ["light","dark"]) {
        for(const [width,height,size] of [[390,844,"mobile"],[1440,900,"desktop"]]) {
            for(const [name,route] of screens) await check(theme+" "+name+" "+size,async()=>{
                const page=await pageFor(theme,width,height);
                try {
                    await goto(page,route);
                    const ui=await layout(page);
                    assert.equal(ui.overflow,false);
                    assert.equal(ui.main,1);
                    assert.equal(ui.footerPosition,"static");
                    assert.ok(ui.font.includes("Pretendard"));
                    assert.ok(ui.containers.every(r=>r.width<=1152.1));
                    assert.ok(ui.nav.every(r=>r.x>=0&&r.right<=width&&r.y>=0&&r.bottom<=ui.header.bottom));
                    assert.ok(ui.reveal.every(v=>v==="1"));
                    assert.ok(ui.animation.every(v=>v==="none"));
                    assert.equal(await page.$eval("html",el=>el.classList.contains("dark")),theme==="dark");
                    if(name==="blog") assert.ok(await page.$eval("article",el=>el.getBoundingClientRect().width<=640));
                    await screenshot(page,theme+"-"+name+"-"+size);
                    await screenshot(page,theme+"-"+name+"-"+size+"-top",false);
                    const colors=await contrast(page,theme+" "+name+" "+size);
                    return {ui,colors};
                } finally { await page.close(); }
            });
        }
        for(const slug of ["snn-cms","erp-groupware","legal-platform"]) await check(theme+" remaining project "+slug,async()=>{
            const page=await pageFor(theme);
            try { await goto(page,"/project/"+slug); assert.equal((await layout(page)).overflow,false); await screenshot(page,theme+"-"+slug); return await contrast(page,theme+" "+slug); }
            finally { await page.close(); }
        });
        for(const width of [320,768,1024]) await check(theme+" boundary "+width,async()=>{
            const page=await pageFor(theme,width,900);
            try {
                const all=[];
                for(const [name,route] of screens) {
                    await goto(page,route);
                    const ui=await layout(page); all.push({name,ui});
                    assert.equal(ui.overflow,false,name);
                    assert.ok(ui.nav.every(r=>r.x>=0&&r.right<=width&&r.bottom<=ui.header.bottom),name);
                    await screenshot(page,theme+"-"+name+"-"+width,false);
                }
                return all;
            } finally { await page.close(); }
        });
    }
    await check("theme system persistence keyboard and initial paint",async()=>{
        const page=await pageFor("dark");
        try {
            await page.evaluateOnNewDocument(()=>{
                window.__firstPaintThemes=[];
                const observer=new PerformanceObserver(list=>{
                    for(const e of list.getEntries()) window.__firstPaintThemes.push({name:e.name,theme:document.documentElement.className});
                });
                observer.observe({type:"paint",buffered:true});
            });
            await goto(page,"/");
            assert.equal(await page.evaluate(()=>localStorage.getItem("theme")),null);
            assert.equal(await page.$eval("html",el=>el.className),"dark");
            const first=await page.evaluate(()=>window.__firstPaintThemes);
            assert.ok(first.length&&first.every(e=>e.theme==="dark"));
            await page.emulateMediaFeatures([{name:"prefers-color-scheme",value:"light"}]);
            await page.waitForFunction(()=>document.documentElement.classList.contains("light"));
            await page.focus("button.theme-toggle");
            await page.keyboard.press("Space");
            await page.waitForFunction(()=>localStorage.theme==="dark");
            await page.keyboard.press("Enter");
            await page.waitForFunction(()=>localStorage.theme==="light");
            await page.emulateMediaFeatures([{name:"prefers-color-scheme",value:"dark"}]);
            assert.equal(await page.$eval("html",el=>el.className),"light");
            await page.click('header a[href="/work"]');
            await page.waitForFunction(()=>location.pathname==="/work");
            await page.reload({waitUntil:"networkidle0"});
            assert.equal(await page.$eval("html",el=>el.className),"light");
            await page.keyboard.press("Tab");
            await page.focus(".skip-link");
            assert.ok(await page.$eval(".skip-link",el=>el.getBoundingClientRect().top>=0));
            await page.keyboard.press("Enter");
            assert.equal(await page.evaluate(()=>document.activeElement.id),"main-content");
            await page.keyboard.press("Tab");
            assert.ok(await page.evaluate(()=>document.activeElement.getAttribute("href").startsWith("/project/")));
            const focus=await page.evaluate(()=>({outline:getComputedStyle(document.activeElement).outline,shadow:getComputedStyle(document.activeElement).boxShadow,visible:document.activeElement.matches(":focus-visible")}));
            assert.ok(focus.visible && (!focus.outline.includes("none") || focus.shadow!=="none"));
            await screenshot(page,"keyboard-skip-project",false);
            await page.keyboard.down("Shift"); await page.keyboard.press("Tab"); await page.keyboard.up("Shift");
            return {first,focus};
        } finally { await page.close(); }
    });
    await check("storage blocked",async()=>{
        const page=await pageFor("light");
        try {
            await page.evaluateOnNewDocument(()=>{
                Object.defineProperty(window,"localStorage",{get(){throw new DOMException("blocked","SecurityError");}});
            });
            await goto(page,"/");
            await page.click("button.theme-toggle");
            await page.waitForFunction(()=>document.documentElement.classList.contains("dark"));
            await page.click('header a[href="/work"]');
            await page.waitForFunction(()=>location.pathname==="/work");
        } finally { await page.close(); }
    });
    await check("font real rendering and fallback",async()=>{
        const page=await pageFor();
        try {
            await goto(page,"/");
            const cdp=await page.createCDPSession();
            await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
            const doc=await cdp.send("DOM.getDocument");
            const {nodeId}=await cdp.send("DOM.querySelector",{nodeId:doc.root.nodeId,selector:"h1"});
            const actual=await cdp.send("CSS.getPlatformFontsForNode",{nodeId});
            assert.ok(actual.fonts.some(f=>f.familyName.includes("Pretendard")&&f.isCustomFont));
            const requests=await page.evaluate(()=>performance.getEntriesByType("resource").filter(r=>r.name.includes("/fonts/pretendard/")).map(r=>({name:r.name.split("/").at(-1),bytes:r.encodedBodySize})));
            assert.ok(requests.length>0&&requests.length<92);
            await page.setRequestInterception(true);
            page.on("request",r=>r.url().includes("/fonts/pretendard/")?r.abort():r.continue());
            await page.setCacheEnabled(false); await page.reload({waitUntil:"networkidle0"});
            const doc2=await cdp.send("DOM.getDocument");
            const node2=await cdp.send("DOM.querySelector",{nodeId:doc2.root.nodeId,selector:"h1"});
            const fallback=await cdp.send("CSS.getPlatformFontsForNode",{nodeId:node2.nodeId});
            assert.ok(fallback.fonts.length&&fallback.fonts.every(f=>!f.isCustomFont));
            assert.equal((await layout(page)).overflow,false);
            await screenshot(page,"font-fallback",false);
            return {actual,requests,totalBytes:requests.reduce((n,r)=>n+r.bytes,0),fallback};
        } finally { await page.close(); }
    });
    await check("200 percent text and layout zoom",async()=>{
        const page=await pageFor("dark",720,450);
        try {
            await goto(page,"/resume");
            // 1440x900 at browser 200% yields a 720x450 CSS layout viewport.
            let ui=await layout(page); assert.equal(ui.overflow,false);
            await screenshot(page,"zoom200-layout",false);
            await page.setViewport({width:390,height:844});
            await page.addStyleTag({content:"html { font-size: 200%; }"});
            ui=await layout(page);
            await screenshot(page,"zoom200-text",false);
            assert.equal(ui.overflow,false,JSON.stringify(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll("body *")].filter(el=>el.getBoundingClientRect().right>innerWidth&&!el.closest(".resume-section-nav")).map(el=>({tag:el.tagName,className:el.className,right:el.getBoundingClientRect().right})).slice(0,15)}))));
            assert.ok(ui.nav.every(r=>r.right<=390&&r.bottom<=ui.header.bottom));
            await screenshot(page,"zoom200-text",false);
            return ui;
        } finally { await page.close(); }
    });
    await check("article code table fixture",async()=>{
        for(const theme of ["light","dark"]) {
            const page=await pageFor(theme);
            try {
                await goto(page,article);
                await page.$eval(".velog-crawled-content",el=>el.insertAdjacentHTML("beforeend",'<h2>로컬 검증 표와 코드</h2><p>인라인 <code>const value = 1</code> 표시</p><blockquote>인용문 검증</blockquote><table><thead><tr><th>항목</th><th>길게 표시되는 제목</th></tr></thead><tbody><tr><td>본문</td><td>테마 표 검증</td></tr></tbody></table><pre><code><span style="color:#111">const veryLongLine = "'+"x".repeat(180)+'";</span></code></pre>'));
                const code=await page.$eval(".velog-crawled-content pre:last-child",el=>({font:getComputedStyle(el.querySelector("code")).fontFamily,scroll:el.scrollWidth>el.clientWidth}));
                assert.ok(code.font.toLowerCase().includes("mono")&&code.scroll);
                assert.equal((await layout(page)).overflow,false);
                await contrast(page,theme+" article fixture");
                await page.$eval(".velog-crawled-content pre:last-child",el=>el.scrollIntoView({block:"center"}));
                await screenshot(page,theme+"-code-table",false);
            } finally { await page.close(); }
        }
    });
    await check("writing states and keyboard retry",async()=>{
        for(const theme of ["light","dark"]) {
            const page=await pageFor(theme);
            try {
                let fail=true;
                await page.setRequestInterception(true);
                page.on("request",r=>{
                    if(new URL(r.url()).pathname==="/api/blog/posts"&&fail) setTimeout(()=>r.respond({status:500,contentType:"application/json",body:'{"result":{"success":false},"data":null}'}).catch(()=>{}),1800);
                    else r.continue().catch(()=>{});
                });
                await page.goto(base+"/writing",{waitUntil:"domcontentloaded"});
                await page.waitForSelector('[role="status"]');
                await page.$eval('[role="status"]',el=>el.scrollIntoView({block:"center"}));
                await screenshot(page,theme+"-loading",false);
                assert.ok((await layout(page)).animation.every(n=>n==="none"));
                await page.waitForSelector('[role="alert"]');
                await contrast(page,theme+" error");
                await page.$eval('[role="alert"]',el=>el.scrollIntoView({block:"center"}));
                await screenshot(page,theme+"-error",false);
                fail=false;
                await page.focus('[role="alert"] button'); await page.keyboard.press("Enter");
                await page.waitForSelector('main a[href^="/blog/"]');
                await page.focus('input[name="search"]'); await page.type('input[name="search"]',"plan03-no-results-928348");
                await page.keyboard.press("Enter");
                await page.waitForFunction(()=>document.body.textContent.includes("검색 조건에 맞는 포스트가 없습니다."));
                await page.$$eval("main h3",els=>els.find(el=>el.textContent.includes("포스트가 없습니다"))?.scrollIntoView({block:"center"}));
                await contrast(page,theme+" empty"); await screenshot(page,theme+"-empty",false);
            } finally { await page.close(); }
        }
    });
    await check("missing article body rendered from real component",async()=>{
        const ts=require("typescript"),vm=require("node:vm"),React=require("react"),{renderToStaticMarkup}=require("react-dom/server");
        const exports={};
        const source=fs.readFileSync("src/app/blog/[slug]/page.tsx","utf8");
        const post={slug:"local-fixture",title:"로컬 본문 없음 검증",intro:"읽기 상태 검증용 임시 글",tags:[],created_at:"2026-09-29",content_html:null,content_text:null};
        const seo={SEO_CONFIG:{description:"검증",defaultOgImage:{path:"/favicon.ico"}},cleanDescription:x=>x};
        for(const name of ["absoluteUrl","createArticleJsonLd","createBreadcrumbJsonLd","createImageObjectJsonLd","createOrganizationJsonLd","getCanonicalUrl"])seo[name]=()=>null;
        vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,{
            exports,require:id=>{
                if(id==="@/lib/services/velogService")return {getPostBySlug:async()=>post};
                if(id==="@/lib/seo")return seo;
                if(id==="@/components/seo/JsonLdScript")return {JsonLdScript:()=>null};
                if(id==="@/components/layout/PageContainer")return {__esModule:true,default:({children})=>React.createElement("div",null,children)};
                return require(id);
            }
        });
        const markup=renderToStaticMarkup(await exports.default({params:Promise.resolve({slug:post.slug})}));
        assert.ok(markup.includes("아직 상세 본문이 크롤링되지 않았습니다."));
        for(const theme of ["light","dark"]) {
            const page=await pageFor(theme);
            try{
                await goto(page,article);
                await page.$eval("main .page-content",(el,html)=>{el.innerHTML=html;},markup);
                assert.ok((await page.$eval("main",el=>el.textContent)).includes(post.title));
                assert.equal((await layout(page)).overflow,false);
                await contrast(page,theme+" missing article");
                await screenshot(page,theme+"-article-empty",false);
            }finally{await page.close();}
        }
    });
    await check("keyboard filter pagination and reverse tab",async()=>{
        const page=await pageFor("dark");
        try{
            await goto(page,"/writing");
            await page.focus('button[aria-controls="category-panel"]');
            await page.keyboard.press("Space");
            assert.equal(await page.$eval('button[aria-controls="category-panel"]',el=>el.getAttribute("aria-expanded")),"true");
            await page.keyboard.press("Tab");
            assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),"전체");
            await page.keyboard.press("Tab");
            const category=await page.evaluate(()=>document.activeElement.textContent.trim());
            await page.keyboard.press("Enter");
            await page.waitForFunction(c=>new URL(location.href).searchParams.get("category")===c,{},category);
            await goto(page,"/writing");
            await page.focus('nav[aria-label="페이지네이션"] a[href="/writing?page=2"]');
            await page.keyboard.press("Enter");
            await page.waitForFunction(()=>new URL(location.href).searchParams.get("page")==="2");
            await page.waitForSelector('nav[aria-label="페이지네이션"] [aria-current="page"]');
            await page.focus("button.theme-toggle");
            await page.keyboard.down("Shift");await page.keyboard.press("Tab");await page.keyboard.up("Shift");
            assert.equal(await page.evaluate(()=>document.activeElement.getAttribute("href")),"/resume");
            await screenshot(page,"keyboard-reverse-nav",false);
        }finally{await page.close();}
    });
    await check("control contrast and footer scope",async()=>{
        const samples=[];
        for(const theme of ["light","dark"]) {
            const page=await pageFor(theme);
            try{
                await goto(page,"/writing");
                const info=await page.evaluate(()=>{
                    const rgb=s=>(s.match(/[\d.]+/g)||[]).map(Number);
                    const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
                    const ratio=(a,b)=>(Math.max(lum(rgb(a)),lum(rgb(b)))+.05)/(Math.min(lum(rgb(a)),lum(rgb(b)))+.05);
                    const input=document.querySelector("input");
                    input.focus();
                    const s=getComputedStyle(input),body=getComputedStyle(document.body);
                    const footer=document.querySelector("footer");
                    return {border:ratio(s.borderColor,s.backgroundColor),focus:ratio(s.outlineColor,body.backgroundColor),footerLinks:[...footer.querySelectorAll("a")].map(a=>a.getAttribute("href")),footerText:footer.textContent,positions:{footer:footer.getBoundingClientRect().top+scrollY,main:document.querySelector("main").getBoundingClientRect().bottom+scrollY}};
                });
                assert.ok(info.border>=3&&info.focus>=3,JSON.stringify(info));
                assert.deepEqual(info.footerLinks,["/work","/writing","/resume","https://github.com/DChanHong","https://velog.io/@hongchee/posts"]);
                assert.ok(!/mailto:|LinkedIn|bkn367/.test(info.footerText));
                assert.ok(info.positions.footer>=info.positions.main-1);
                samples.push({theme,...info});
            }finally{await page.close();}
        }
        return samples;
    });
    assert.deepEqual(aiRequests,[]);
    fs.writeFileSync(path.join(out,only?"design-partial.json":"design-checks.json"),JSON.stringify({results,errors,aiRequests,contrasts},null,2)+"\n");
    console.log(JSON.stringify({passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,errors}));
    if(results.some(r=>!r.pass)||errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{for(const b of browsers)await b.close();});
