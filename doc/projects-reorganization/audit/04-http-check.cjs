const fs=require('node:fs'),{load}=require('cheerio');
const out='doc/projects-reorganization/baseline/plan04/http.json',base='http://127.0.0.1:3101';
const checks=[];function check(name,ok,detail){checks.push({name,ok:!!ok,detail});if(!ok)console.error('FAIL '+name,detail);}
(async()=>{
  const ids=['realtime-support','snn-cms','erp-groupware','legal-platform'];
  const home=await fetch(base);const html=await home.text();const $=load(html);
  check('Home HTTP 200',home.status===200);
  check('Home semantic structure',$('main').length===1&&$('h1').length===1&&$('main section').length===7);
  check('Home section order',JSON.stringify($('main section').map((_,e)=>$(e).attr('aria-labelledby')).get())===JSON.stringify(['home-title','home-capabilities','home-path','home-work','home-toolkit','home-writing','home-more']));
  check('Four capabilities',$('[aria-labelledby="home-capabilities"] ol>li').length===4);
  check('Four growth steps',$('[aria-labelledby="home-path"] ol>li').length===4);
  check('Four outcome metrics',$('[aria-labelledby="home-work"]>div>dl>div').length===4);
  check('Project order',JSON.stringify($('[aria-labelledby="home-work"] ul>li>a').map((_,e)=>$(e).attr('href')).get())===JSON.stringify(ids.map(id=>'/project/'+id)));
  check('On-hold status remains',$('[aria-labelledby="home-work"] ul').text().includes('출시 보류'));
  check('Two text-only recent articles',$('[aria-labelledby="home-writing"] li').length===2&&$('main img').length===0);
  check('No AI/locale controls',$('a[href^="/ask"],button[aria-label="English"],button[aria-label="Korean"]').length===0);
  check('No reference identity',!$('body').text().match(/Daehan Lim|Deloitte|CPA|daehanlim1/));
  check('Footer public links only',JSON.stringify($('footer a[href^="http"]').map((_,e)=>$(e).attr('href')).get())===JSON.stringify(['https://github.com/DChanHong','https://velog.io/@hongchee/posts']));
  check('No newly exposed mail link',$('a[href^="mailto:"]').length===0);
  const article=$('[aria-labelledby="home-writing"] li a').first().attr('href');
  for(const route of ['/work',...ids.map(id=>'/project/'+id),'/resume','/writing',article]){
    const r=await fetch(base+route),text=await r.text(),doc=load(text);
    check('Route '+route,r.status===200);
    check('SEO '+route,doc('title').text().length>0&&!!doc('meta[name="description"]').attr('content')&&!!doc('link[rel="canonical"]').attr('href')&&!!doc('meta[property="og:title"]').attr('content')&&!!doc('meta[name="twitter:card"]').attr('content'));
    check('Shell '+route,doc('.site-header').length===1&&doc('.site-footer').length===1&&doc('main').length===1);
  }
  for(const [route,dest] of [['/career','/resume'],['/blog?page=2&tag=Next.js&search=Next','/writing?page=2&tag=Next.js&search=Next']]){
    const r=await fetch(base+route,{redirect:'manual'});check('Redirect '+route,r.status===308&&r.headers.get('location')===dest,r.headers.get('location'));
  }
  for(const route of ['/ask','/project/not-a-project','/api/velog/crawl','/api/velog/test-detail','/api-docs','/api-docs/v1']){
    const r=await fetch(base+route);check('Protected/missing '+route,r.status===404,r.status);
  }
  for(const [route,expected] of [['/api/velog/crawl',404],['/api/chatbot/faqs',405]]){
    const r=await fetch(base+route,{method:'POST'});check('POST '+route,r.status===expected,r.status);
  }
  const sitemap=await(await fetch(base+'/sitemap.xml')).text();check('Sitemap',ids.every(id=>sitemap.includes('/project/'+id))&&sitemap.includes('/writing')&&!sitemap.includes('/ask'));
  const robots=await(await fetch(base+'/robots.txt')).text();check('Robots API protection',robots.includes('/api/'));
  check('Home JSON-LD',$('script[type="application/ld+json"]').length>0);
  for(const state of ['empty','one','two','error','loading']){
    const r=await fetch('http://127.0.0.1:3102/fixture?state='+state);check('Rendered fixture '+state,r.status===200);
  }
  const states=JSON.parse(fs.readFileSync('doc/projects-reorganization/baseline/plan04/states.json'));check('Real component fixture assertions',states.every(s=>s.pass),states);
  const result={date:new Date().toISOString(),base,passed:checks.filter(c=>c.ok).length,failed:checks.filter(c=>!c.ok).length,checks};
  fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log({passed:result.passed,failed:result.failed});if(result.failed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
