// Local-only baseline, isolated build and source preservation evidence.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = process.cwd();
const out = path.join(root, 'doc/projects-reorganization/baseline/plan05');
fs.mkdirSync(out, { recursive: true });
const mode = process.argv[2];
function hashes(dir, prefix = '') {
  return Object.fromEntries(fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const rel = path.join(prefix, e.name), full = path.join(dir, e.name);
    return e.isDirectory() ? Object.entries(hashes(full, rel)) : [[rel, crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex')]];
  }));
}
function save(name, value) { fs.writeFileSync(path.join(out, name + '.json'), JSON.stringify(value, null, 2) + '\n'); }
if (mode === 'baseline') {
  if (fs.existsSync(path.join(out, 'before.json'))) throw Error('Baseline already exists');
  save('before', { date: new Date().toISOString(), head: cp.execFileSync('git', ['rev-parse', 'HEAD'], {encoding:'utf8'}).trim(), files: hashes('src', 'src') });
} else if (mode === 'build') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-plan05-build-'));
  for (const name of ['src', 'public', 'styles', 'package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs', 'eslint.config.mjs']) {
    if (fs.existsSync(name)) fs.cpSync(name, path.join(dir, name), {recursive:true});
  }
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'dir');
  for (const name of fs.readdirSync(root).filter(n => /^\.env($|\.)/.test(n) && fs.statSync(n).isFile())) fs.symlinkSync(path.join(root, name), path.join(dir, name));
  save('build-workspace', {dir});
  const r = cp.spawnSync('npm', ['run', 'build'], {cwd:dir, encoding:'utf8'});
  fs.writeFileSync(path.join(out, 'build.log'), r.stdout + r.stderr);
  console.log(r.stdout + r.stderr); process.exitCode = r.status ?? 1;
} else if (mode === 'lint') {
  (async () => {
    const {ESLint} = require('eslint'), {FlatCompat} = require('@eslint/eslintrc');
    const e = new ESLint({overrideConfigFile:true, overrideConfig:new FlatCompat({baseDirectory:root}).extends('next/core-web-vitals','next/typescript')});
    const results = await e.lintFiles(['src/app/writing/**/*.tsx']);
    const report = {files:results.map(r => path.relative(root,r.filePath)), errors:results.reduce((n,r)=>n+r.errorCount,0), warnings:results.reduce((n,r)=>n+r.warningCount,0), messages:results.flatMap(r=>r.messages)};
    save('lint', report); console.log(report); if(report.errors || report.warnings) process.exitCode=1;
  })().catch(e=>{console.error(e);process.exitCode=1;});
} else if (mode === 'preserve') {
  const before = JSON.parse(fs.readFileSync(path.join(out,'before.json'))).files, after = hashes('src','src');
  const changed = Object.keys({...before,...after}).filter(p=>before[p]!==after[p]);
  const violations = changed.filter(p=>!p.startsWith('src/app/writing/'));
  const built = hashes(path.join(JSON.parse(fs.readFileSync(path.join(out,'build-workspace.json'))).dir,'src'),'src');
  const buildMismatches = Object.keys({...built,...after}).filter(p=>built[p]!==after[p]);
  save('preservation',{changed,violations,buildMismatches}); console.log({changed,violations,buildMismatches});
  if(violations.length || buildMismatches.length) process.exitCode=1;
} else throw Error('Use baseline/build/lint/preserve');
