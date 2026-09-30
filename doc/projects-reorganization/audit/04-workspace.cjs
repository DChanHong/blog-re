// Plan 04 local-only snapshots and isolated production checks. Never print credentials.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = process.cwd();
const out = path.join(root, 'doc/projects-reorganization/baseline/plan04');
fs.mkdirSync(out, {recursive:true});
const mode = process.argv[2];
const record = name => path.join(out, name + '.json');
function hashes(dir, prefix = '') {
  return Object.fromEntries(fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => {
    const rel=path.join(prefix,e.name), full=path.join(dir,e.name);
    return e.isDirectory()?Object.entries(hashes(full,rel)):[[rel,crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex')]];
  }));
}
function snapshot(prefix) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),prefix));
  for (const name of ['src','public','styles','package.json','package-lock.json','next.config.ts','tsconfig.json','postcss.config.mjs','eslint.config.mjs']) {
    if(fs.existsSync(name))fs.cpSync(name,path.join(dir,name),{recursive:true});
  }
  return dir;
}
if(mode==='baseline') {
  if(fs.existsSync(record('before')))throw new Error('Preserve existing baseline');
  const dir=snapshot('portfolio-plan04-before-');
  const files=hashes(path.join(root,'src'),'src');
  fs.writeFileSync(record('before'),JSON.stringify({dir,date:new Date().toISOString(),git:cp.execFileSync('git',['status','--short'],{encoding:'utf8'}),files},null,2)+'\n');
  console.log('Plan 04 source baseline saved: '+dir);
} else if(mode==='build') {
  const dir=snapshot('portfolio-plan04-build-');
  fs.symlinkSync(path.join(root,'node_modules'),path.join(dir,'node_modules'),'dir');
  for(const name of fs.readdirSync(root).filter(n=>/^\.env($|\.)/.test(n)&&fs.statSync(n).isFile()))fs.symlinkSync(path.join(root,name),path.join(dir,name));
  fs.writeFileSync(record('build-workspace'),JSON.stringify({dir,date:new Date().toISOString()},null,2)+'\n');
  console.log('Isolated build: '+dir);
  const r=cp.spawnSync('npm',['run','build'],{cwd:dir,encoding:'utf8'});
  fs.writeFileSync(path.join(out,'build.log'),r.stdout+r.stderr);
  console.log(r.stdout+r.stderr);process.exitCode=r.status??1;
} else if(mode==='typecheck'||mode==='start') {
  const {dir}=JSON.parse(fs.readFileSync(record('build-workspace')));
  if(!path.basename(dir).startsWith('portfolio-plan04-build-'))throw new Error('Unexpected workspace');
  const r=cp.spawn('npm',mode==='start'?['run','start','--','-p','3101']:['exec','--','tsc','--noEmit'],{cwd:dir,stdio:'inherit'});
  for(const s of ['SIGINT','SIGTERM'])process.on(s,()=>r.kill(s));
  r.on('exit',code=>process.exitCode=code??1);
} else if(mode==='preserve') {
  const before=JSON.parse(fs.readFileSync(record('before')));
  const after=hashes(path.join(root,'src'),'src');
  const changed=Object.keys({...before.files,...after}).filter(p=>before.files[p]!==after[p]);
  const protectedPaths=['src/data/','src/types/','src/lib/','src/app/api/','src/components/domain/blog/','src/components/domain/home/ProjectShowcase/'];
  const violations=changed.filter(p=>protectedPaths.some(x=>p.startsWith(x)));
  const build=JSON.parse(fs.readFileSync(record('build-workspace')));
  const built=hashes(path.join(build.dir,'src'),'src');
  const mismatches=Object.keys({...built,...after}).filter(p=>built[p]!==after[p]);
  const result={changed,protectedViolations:violations,buildMismatches:mismatches};
  fs.writeFileSync(record('preservation'),JSON.stringify(result,null,2)+'\n');
  console.log(result);if(violations.length||mismatches.length)process.exitCode=1;
} else if(mode==='lint') {
  (async()=>{
    const {ESLint}=require('eslint');const {FlatCompat}=require('@eslint/eslintrc');
    const before=JSON.parse(fs.readFileSync(record('before')));const current=hashes(path.join(root,'src'),'src');
    const files=Object.keys(current).filter(p=>current[p]!==before.files[p]&&/\.tsx?$/.test(p));
    const eslint=new ESLint({overrideConfigFile:true,overrideConfig:new FlatCompat({baseDirectory:root}).extends('next/core-web-vitals','next/typescript')});
    const results=await eslint.lintFiles(files);const report={files,errors:results.reduce((n,r)=>n+r.errorCount,0),warnings:results.reduce((n,r)=>n+r.warningCount,0),messages:results.flatMap(r=>r.messages)};
    fs.writeFileSync(record('lint'),JSON.stringify(report,null,2)+'\n');console.log(report);if(report.errors)process.exitCode=1;
  })().catch(e=>{console.error(e);process.exitCode=1;});
} else throw new Error('Use baseline/build/typecheck/start/preserve/lint');
