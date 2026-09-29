// Keep the user's port-3000 development output untouched during production QA.
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const cp = require("node:child_process");
const root = process.cwd();
const record = path.join(root, "doc/projects-reorganization/baseline/plan03/build-workspace.json");
const mode = process.argv[2] || "build";
if (mode === "build") {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-plan03-"));
    for (const name of ["src", "public", "styles", "package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "postcss.config.mjs", "eslint.config.mjs"]) {
        if (fs.existsSync(path.join(root,name))) fs.cpSync(path.join(root,name), path.join(dir,name), {recursive:true});
    }
    fs.symlinkSync(path.join(root,"node_modules"),path.join(dir,"node_modules"),"dir");
    // Reuse local build credentials without reading, logging or copying their contents.
    for(const name of fs.readdirSync(root).filter(n=>/^\.env($|\.)/.test(n)&&fs.statSync(path.join(root,n)).isFile())) fs.symlinkSync(path.join(root,name),path.join(dir,name));
    fs.writeFileSync(record,JSON.stringify({dir,created:new Date().toISOString()},null,2)+"\n");
    console.log("Isolated production workspace: "+dir);
    const result=cp.spawnSync("npm",["run","build"],{cwd:dir,stdio:"inherit"});
    process.exitCode=result.status??1;
} else {
    const {dir}=JSON.parse(fs.readFileSync(record));
    if(!path.basename(dir).startsWith("portfolio-plan03-"))throw new Error("Unexpected build directory");
    const args=mode==="start"?["run","start","--","-p","3101"]:["exec","--","tsc","--noEmit"];
    const child=cp.spawn("npm",args,{cwd:dir,stdio:"inherit"});
    for(const signal of ["SIGINT","SIGTERM"])process.on(signal,()=>child.kill(signal));
    child.on("exit",code=>process.exitCode=code??0);
}
