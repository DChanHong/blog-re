const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');
const out = path.resolve('doc/projects-reorganization/baseline/plan05');
const origin = process.env.WRITING_TEST_ORIGIN || 'http://localhost:3000';
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const checks = [];
function ok(name, value, detail) { checks.push({name,pass:!!value,detail}); if(!value)throw Error(name+': '+JSON.stringify(detail)); }
const rows = '[data-writing-row]';
async function waitRows(page) { await page.waitForSelector(rows); }
async function clickText(page, selector, text) {
  const found = await page.evaluate((selector,text)=>{
    const e=[...document.querySelectorAll(selector)].find(e=>e.textContent.trim()===text); e?.click(); return !!e;
  },selector,text);
  assert(found, 'Missing control '+text);
}
async function seo(page) {
  return page.evaluate(()=>({title:document.title,meta:[...document.querySelectorAll('meta[name],meta[property],link[rel=canonical]')].map(e=>e.outerHTML).sort(),json:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>e.textContent).sort()}));
}
(async()=>{
  const browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try {
    const page=await browser.newPage();
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    if(process.argv[2] !== 'fixtures') {
    for(const theme of ['light','dark']) {
      await page.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
      for(const width of [1440,390,320,640,768,1024,720]) {
        await page.setViewport({width,height:900});
        await page.goto(origin+'/writing',{waitUntil:'networkidle2'}); await waitRows(page);
        const measured=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,images:document.querySelectorAll('main img').length,rows:document.querySelectorAll('[data-writing-row]').length,headline:getComputedStyle(document.querySelector('h1')).fontSize,secondary:getComputedStyle(document.querySelector('h1 span')).color,primary:getComputedStyle(document.querySelector('h1')).color,summary:getComputedStyle(document.querySelector('[data-writing-row] p')).fontSize}));
        ok(`layout ${theme} ${width}`,!measured.overflow&&measured.h1===1&&measured.main===1&&measured.images===0&&measured.rows===9&&measured.secondary!==measured.primary,measured);
        if(width===1440||width===390) {
          await page.screenshot({path:path.join(out,`result-${theme}-${width}.png`)});
          await page.screenshot({path:path.join(out,`result-${theme}-${width}-full.png`),fullPage:true});
        }
        await page.click('[aria-controls="writing-filters"]');
        ok(`filters fit ${theme} ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&!document.querySelector('#writing-filters').hidden));
        if(width===390) await page.screenshot({path:path.join(out,`filters-${theme}-390.png`)});
      }
    }
    await page.setViewport({width:1440,height:900});
    await page.goto(origin+'/writing',{waitUntil:'networkidle2'});await waitRows(page);
    const before=JSON.parse(fs.readFileSync(path.join(out,'seo-before.json')));
    const after=await seo(page);
    ok('metadata and JSON-LD preserved',JSON.stringify({title:before.title,meta:before.meta,json:before.json})===JSON.stringify(after));
    const article=await page.$eval(rows+' a',e=>e.getAttribute('href'));
    for(const route of ['/sitemap.xml','/robots.txt']) {
      const body=await(await page.goto(origin+route)).text();
      // Sitemap lastmod uses request time for fixed pages; compare all other content.
      const normalize=s=>s.replace(/<lastmod>.*?<\/lastmod>/g,'<lastmod/>');
      ok(route+' preserved',normalize(body)===normalize(before[route]));
    }
    for(const route of ['/','/work','/resume',article]) {
      const response=await page.goto(origin+route,{waitUntil:'networkidle2'});
      ok('smoke '+route,response.status()===200&&await page.$$eval('main',es=>es.length===1));
    }
    await page.goto(origin+'/blog?page=2&tag=AI+Agent&search=RAG',{waitUntil:'networkidle2'});
    ok('legacy redirect query',new URL(page.url()).pathname==='/writing'&&new URL(page.url()).searchParams.get('page')==='2'&&new URL(page.url()).searchParams.get('tag')==='AI Agent');
    const redirect=await fetch(origin+'/blog?page=2&tag=AI+Agent',{redirect:'manual'});
    ok('legacy status 308',redirect.status===308);
    await page.goto(origin+'/writing',{waitUntil:'networkidle2'});await waitRows(page);
    await page.focus('[aria-controls="writing-filters"]');await page.keyboard.press('Enter');
    ok('keyboard filter expands',await page.$eval('[aria-controls="writing-filters"]',e=>e.getAttribute('aria-expanded')==='true'));
    await page.keyboard.press('Tab');
    ok('keyboard focus visible',await page.evaluate(()=>document.activeElement.matches('#writing-filters a')&&getComputedStyle(document.activeElement).outlineStyle!=='none'));
    await clickText(page,'#writing-filters a','AI Agent');
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('category')==='AI Agent');await waitRows(page);
    await page.waitForFunction(()=>!document.querySelector('[aria-label="글을 불러오는 중"]'));
    ok('category results',await page.$$eval('[data-writing-row]',es=>es.every(e=>e.textContent.includes('AI Agent'))));
    await clickText(page,'#writing-filters a','#AI Agent');
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('tag')==='AI Agent');
    await page.type('input[name=search]','RAG');await page.keyboard.press('Enter');
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('search')==='RAG');await waitRows(page);
    await page.waitForFunction(()=>!document.querySelector('[aria-label="글을 불러오는 중"]'));
    ok('combined filters query',new URL(page.url()).searchParams.get('category')==='AI Agent'&&new URL(page.url()).searchParams.get('tag')==='AI Agent'&&!new URL(page.url()).searchParams.has('page'));
    ok('search results',await page.$$eval(rows,es=>es.every(e=>/rag/i.test(e.textContent))));
    await clickText(page,'main a','전체 초기화');await page.waitForFunction(()=>!location.search);await waitRows(page);
    await clickText(page,'nav[aria-label="페이지네이션"] a','2');
    await page.waitForFunction(()=>new URL(location.href).searchParams.get('page')==='2');await waitRows(page);
    await page.waitForFunction(()=>!document.querySelector('[aria-label="글을 불러오는 중"]'));
    const second=await page.$eval(rows+' h2',e=>e.textContent);
    await page.goBack({waitUntil:'networkidle2'});await waitRows(page);
    ok('pagination and back',!new URL(page.url()).searchParams.has('page')&&second!==await page.$eval(rows+' h2',e=>e.textContent));
    ok('runtime errors',errors.length===0,errors);
    }

    // Fixtures are browser-only responses, never DB writes.
    const fixture=await browser.newPage();let mode='nine', failMeta=false, delay=0;
    await fixture.setViewport({width:390,height:844});
    await fixture.setRequestInterception(true);
    fixture.on('request',async request=>{
      const u=new URL(request.url());
      if(!u.pathname.startsWith('/api/blog/'))return request.continue();
      if(delay)await sleep(delay);
      if(u.pathname.endsWith('/posts')) {
        if(mode==='error')return request.respond({status:200,contentType:'application/json',body:JSON.stringify({result:{success:false},data:null})});
        const count=mode==='empty'?0:mode==='one'?1:9;
        const posts=Array.from({length:count},(_,i)=>({id:String(i),title:`${u.searchParams.get('search')||'배움'} ${i+1} `+(mode==='one'?'긴제목'.repeat(40):'새로운 개념을 적용한 기록'),intro:'직접 적용하고 배운 경험을 기록합니다. '.repeat(12),tags:mode==='one'?['LongTag'.repeat(30)]:['React'],slug:mode==='one'?null:'fixture-'+i,source_url:'https://velog.io/@hongchee/example',detail_link:'/example',img_src:'',created_at:'2026-09-29'}));
        return request.respond({status:200,contentType:'application/json',body:JSON.stringify({result:{success:true},data:{posts,pagination:{currentPage:Number(u.searchParams.get('page')||1),totalPages:count?2:0,totalPosts:count?18:0,limit:9}}})});
      }
      return request.respond({status:200,contentType:'application/json',body:JSON.stringify(failMeta?{result:{success:false},data:null}:{result:{success:true},data:['React','LongTag'.repeat(30)]})});
    });
    delay=1500;
    await fixture.goto(origin+'/writing',{waitUntil:'domcontentloaded'});
    await fixture.waitForSelector('[aria-label="글을 불러오는 중"]');
    ok('loading state not zero',!(await fixture.$eval('main',e=>e.textContent)).includes('총 0개의 글'));
    await fixture.click('[aria-controls="writing-filters"]');
    ok('metadata loading',await fixture.$eval('#writing-filters',e=>e.textContent.includes('불러오는 중')));
    await waitRows(fixture); await sleep(180);
    const animated=await fixture.$$eval(rows,es=>es.map(e=>({opacity:Number(getComputedStyle(e).opacity),y:getComputedStyle(e).transform})));
    ok('initial sequential entrance',animated[0].opacity>animated[4].opacity&&animated[4].opacity<1,animated);
    await fixture.focus(rows+' a');
    await fixture.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const focused=await fixture.$$eval(rows,es=>es.map(e=>({opacity:getComputedStyle(e).opacity,style:e.getAttribute('style')})));
    ok('focus reveals all rows',focused.every(e=>e.opacity==='1'),focused);
    delay=100;
    await fixture.type('input[name=search]','changed');await fixture.keyboard.press('Enter');
    await fixture.waitForFunction(()=>document.querySelector('[data-writing-row] h2')?.textContent.startsWith('changed'));
    ok('query update no entrance',await fixture.$$eval(rows,es=>es.every(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none')));
    await fixture.waitForSelector('nav[aria-label="페이지네이션"]');
    await clickText(fixture,'nav[aria-label="페이지네이션"] a','2');
    await fixture.waitForFunction(()=>new URL(location.href).searchParams.get('page')==='2');
    await fixture.waitForFunction(()=>!document.querySelector('[aria-label="글을 불러오는 중"]'));await waitRows(fixture);
    ok('page update no entrance',await fixture.$$eval(rows,es=>es.every(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none')));
    mode='empty';await fixture.goto(origin+'/writing?search=missing',{waitUntil:'networkidle2'});
    ok('empty search state',await fixture.$eval('main',e=>e.textContent.includes('검색 조건에 맞는 글이 없습니다.')));
    await fixture.screenshot({path:path.join(out,'empty.png')});
    await fixture.goto(origin+'/writing',{waitUntil:'networkidle2'});
    await fixture.waitForFunction(()=>document.querySelector('main')?.textContent.includes('아직 작성된 글이 없습니다.'));
    ok('empty archive state',await fixture.$eval('main',e=>e.textContent.includes('아직 작성된 글이 없습니다.')));
    mode='error';failMeta=true;await fixture.goto(origin+'/writing',{waitUntil:'networkidle2'});
    await fixture.waitForSelector('[role=alert]');
    ok('error distinct from empty',await fixture.$eval('main',e=>e.textContent.includes('글을 불러오지 못했습니다.')&&!e.textContent.includes('총 0개의 글')));
    await fixture.click('[aria-controls="writing-filters"]');
    ok('metadata errors',await fixture.$$eval('#writing-filters [role=alert]',es=>es.length===2));
    mode='one';failMeta=false;
    await fixture.$$eval('[role=alert] button',es=>es.forEach(e=>e.click()));await waitRows(fixture);
    await fixture.waitForSelector('#writing-filters a');await sleep(800);
    ok('retry restores rows and metadata',await fixture.$$eval(rows,es=>es.length===1)&&await fixture.$$eval('#writing-filters [role=alert]',es=>es.length===0));
    const fallback=await fixture.$eval(rows+' a',e=>({href:e.href,target:e.target,rel:e.rel}));
    ok('source fallback',fallback.href==='https://velog.io/@hongchee/example'&&fallback.target==='_blank'&&fallback.rel.includes('noopener'),fallback);
    for(const width of [320,390,720,1440]) {
      await fixture.setViewport({width,height:900});
      ok('long title/tag reflow '+width,await fixture.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    }
    await fixture.setViewport({width:390,height:844});
    await fixture.screenshot({path:path.join(out,'long-content.png')});
    mode='nine';await fixture.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
    await fixture.goto(origin+'/writing',{waitUntil:'domcontentloaded'});await waitRows(fixture);
    ok('reduced motion rows',await fixture.$$eval(rows,es=>es.every(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none')));
    ok('reduced motion hero',await fixture.$eval('h1',e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none'));

    const reference=await browser.newPage();
    for(const theme of ['light','dark'])for(const width of [1440,390]) {
      await reference.emulateMediaFeatures([{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'reduce'}]);
      await reference.setViewport({width,height:900});await reference.goto('https://daehanportfolio.vercel.app/writing',{waitUntil:'networkidle2'});
      await reference.screenshot({path:path.join(out,`reference-${theme}-${width}.png`),fullPage:true});
    }
  } finally {
    fs.writeFileSync(path.join(out,process.argv[2]==='fixtures'?'fixture-checks.json':'browser-checks.json'),JSON.stringify(checks,null,2)+'\n');
    console.log(JSON.stringify(checks,null,2));await browser.close();
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
