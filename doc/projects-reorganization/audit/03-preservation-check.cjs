const fs=require("node:fs"),cp=require("node:child_process"),assert=require("node:assert/strict"),ts=require("typescript");
const paths=["src/app/layout.tsx","src/app/work/page.tsx","src/app/project/[slug]/page.tsx","src/app/resume/page.tsx","src/app/writing/page.tsx","src/app/blog/[slug]/page.tsx"];
function declarations(source) {
    const file=ts.createSourceFile("page.tsx",source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const printer=ts.createPrinter();
    return file.statements.filter(s=>{
        if(ts.isFunctionDeclaration(s))return ["generateMetadata","generateStaticParams"].includes(s.name?.text);
        return ts.isVariableStatement(s)&&s.declarationList.declarations.some(d=>["metadata","title","description","canonical","canonicalUrl","image","ogImageUrl","revalidate","dynamic","dynamicParams"].includes(d.name.getText(file)));
    }).map(s=>printer.printNode(ts.EmitHint.Unspecified,s,file));
}
for(const p of paths)assert.deepEqual(declarations(fs.readFileSync(p,"utf8")),declarations(cp.execFileSync("git",["show","b213173:"+p],{encoding:"utf8"})),p+" metadata/static params changed");
const retained=["src/data","src/lib","src/actions","src/types","src/app/api","migrations","package.json","package-lock.json","next.config.ts","tsconfig.json","src/app/sitemap.ts","src/app/robots.ts","src/app/career/page.tsx","src/app/blog/page.tsx"];
assert.equal(cp.execFileSync("git",["diff","b213173","--",...retained],{encoding:"utf8"}),"");
const buildDir=JSON.parse(fs.readFileSync("doc/projects-reorganization/baseline/plan03/build-workspace.json")).dir;
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+"/"+e.name):[dir+"/"+e.name]);
const files=["src","styles","public"].flatMap(walk);
for(const p of files)assert.ok(fs.readFileSync(p).equals(fs.readFileSync(buildDir+"/"+p)),"build snapshot differs: "+p);
fs.writeFileSync("doc/projects-reorganization/baseline/plan03/preservation.json",JSON.stringify({metadataPaths:paths,unchangedAreas:retained,buildSnapshotMatches:files.length},null,2)+"\n");
console.log("PASS metadata, routes, data, API, DB, dependencies and exact build source snapshot");
