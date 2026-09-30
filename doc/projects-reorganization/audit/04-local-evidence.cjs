// Local-only component state fixtures and browser-captured evidence sink.
// No application route, database write, credential access, or browser automation.
const fs=require('node:fs'), path=require('node:path'), http=require('node:http');
const ts=require('typescript'), React=require('react'), {renderToStaticMarkup}=require('react-dom/server');
const root=process.cwd(), out=path.join(root,'doc/projects-reorganization/baseline/plan04');
fs.mkdirSync(out,{recursive:true});
const results=[];
function componentLoader(getRecentPosts) {
  const cache=new Map();
  function load(file) {
    if(file.endsWith('.css'))return new Proxy({},{get:(_,key)=>key==='__esModule'?false:String(key)});
    if(cache.has(file))return cache.get(file).exports;
    const mod={exports:{}};cache.set(file,mod);
    const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const req=id=>{
      if(id==='@/lib/services/velogService')return {getRecentPosts};
      if(id==='next/link')return function Link({children,...props}){return React.createElement('a',props,children);};
      if(!id.startsWith('.')&&!id.startsWith('@/'))return require(id);
      const base=id.startsWith('@/')?path.join(root,'src',id.slice(2)):path.resolve(path.dirname(file),id);
      const resolved=[base,base+'.tsx',base+'.ts',path.join(base,'index.tsx'),path.join(base,'index.ts')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
      if(!resolved)throw new Error('Module not found: '+id);return load(resolved);
    };
    new Function('require','module','exports',source)(req,mod,mod.exports);return mod.exports;
  }
  return load;
}
async function fixture(state,theme,zoom,motion) {
  let called;
  const sample={id:1,title:'로컬 상태 검증용 글',intro:'실제 컴포넌트의 글 개수와 표시 상태를 검증하는 로컬 자료입니다.',slug:'fixture-post',detail_link:'/fixture',created_at:'2026-09-29',tags:['검증']};
  const rows=state==='empty'?[]:state==='one'?[sample]:[sample,{...sample,id:2,slug:null,source_url:'https://velog.io/@hongchee/posts',title:'외부 링크 대체 경로 검증'}];
  const load=componentLoader(async limit=>{called=limit;if(state==='error')throw new Error('Local fixture');return rows;});
  const blog=load(path.join(root,'src/components/home/BlogContainer.tsx')).default;
  const skeleton=load(path.join(root,'src/components/skeletons/BlogSkeleton.tsx')).default;
  const home=load(path.join(root,'src/components/domain/home/ReferenceHome.tsx')).default;
  const footer=load(path.join(root,'src/components/layout/SiteLayout/parts/Footer.tsx')).default;
  const writing=state==='loading'?React.createElement(skeleton):await blog();
  const body=renderToStaticMarkup(React.createElement(React.Fragment,null,React.createElement('main',null,React.createElement(home,{writingSlot:writing})),React.createElement(footer)));
  const {load:html}=require('cheerio');const $=html(body);
  const preview=$('[aria-labelledby="home-writing"]');
  const checks={state,limit:called,rows:preview.find('li').length,noImages:preview.find('img').length===0,empty:preview.text().includes('아직 공개된 글'),error:preview.text().includes('불러오지 못했습니다'),loading:preview.find('[aria-busy="true"]').length===1,allLink:preview.find('a[href="/writing"]').length===1};
  checks.pass=checks.noImages&&checks.allLink&&(state==='loading'?checks.loading:called===2)&&(state==='empty'?checks.empty:state==='error'?checks.error:state==='loading'?true:checks.rows===(state==='one'?1:2));
  results.push(checks);fs.writeFileSync(path.join(out,'states.json'),JSON.stringify(results,null,2)+'\n');
  const files=['src/styles/portfolio-tokens.css','src/app/globals.css','src/components/domain/home/home-reference.module.css'];
  const css=files.map(f=>fs.readFileSync(f,'utf8').replace(/^@import.*$/gm,'')).join('\n');
  return `<!doctype html><html lang="ko" class="${theme==='dark'?'dark':''}"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/font.css"><style>*{box-sizing:border-box}body,h1,h2,h3,p,ol,ul,dl,dt,dd{margin:0}ol,ul{padding:0;list-style:none}a{color:inherit;text-decoration:none}${css}${zoom?'html{zoom:2}':''}${motion?'*,*::before,*::after{animation:none!important;transition:none!important;transform:none!important}':''}</style></head><body>${body}</body></html>`;
}
const form=`<!doctype html><html lang="ko"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><h1>Plan 04 로컬 증거 저장</h1><form method="post" action="/capture"><label>파일명<input name="name" required></label><label>형식<select name="format"><option>png</option><option>json</option></select></label><label>캡처 데이터<textarea name="data" required></textarea></label><button type="submit">저장</button></form><p id="result" role="status"></p><p>이 서버는 127.0.0.1에만 바인딩되며 Plan 04 증거 폴더에만 저장합니다.</p><script>document.querySelector('form').onsubmit=async e=>{e.preventDefault();const r=await fetch('/capture',{method:'POST',body:new URLSearchParams(new FormData(e.target))});document.getElementById('result').textContent=await r.text();};</script></body></html>`;
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1:3102');
    if(req.method==='POST'&&url.pathname==='/capture') {
      let body='';for await(const chunk of req){body+=chunk;if(body.length>30000000)throw new Error('Too large');}
      const data=new URLSearchParams(body), name=data.get('name'),format=data.get('format');
      if(!/^[a-z0-9-]+$/.test(name)||!['png','json'].includes(format))throw new Error('Invalid target');
      const value=format==='png'?Buffer.from(data.get('data'),'base64'):JSON.stringify(JSON.parse(data.get('data')),null,2)+'\n';
      const jpeg=format==='png'&&value[0]===255&&value[1]===216;
      if(format==='png'&&!jpeg&&!value.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error('Not screenshot');
      const extension=jpeg?'jpg':format;
      const dest=path.join(out,name+'.'+extension);if(fs.existsSync(dest))throw new Error('Evidence already exists');
      fs.writeFileSync(dest,value);res.setHeader('Content-Type','text/plain; charset=utf-8');res.end(`저장 완료: ${name}.${extension}`);return;
    }
    if(url.pathname==='/font.css'){res.setHeader('Content-Type','text/css');res.end(fs.readFileSync('src/styles/pretendard.css'));return;}
    if(/^\/fonts\/pretendard\/[\w.-]+\.woff2$/.test(url.pathname)){res.end(fs.readFileSync(path.join(root,'public',url.pathname)));return;}
    res.setHeader('Content-Type','text/html; charset=utf-8');
    if(url.pathname==='/fixture')res.end(await fixture(url.searchParams.get('state'),url.searchParams.get('theme'),url.searchParams.has('zoom'),url.searchParams.has('motion')));
    else res.end(form);
  }catch(e){res.statusCode=500;res.end('Local evidence error: '+e.message);}
}).listen(3102,'127.0.0.1',()=>console.log('Local evidence / fixture UI: http://127.0.0.1:3102'));
