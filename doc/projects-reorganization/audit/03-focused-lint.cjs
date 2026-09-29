const { ESLint } = require("eslint");
const { FlatCompat } = require("@eslint/eslintrc");
const cp = require("node:child_process");
const fs = require("node:fs");
(async () => {
    const changed = cp.execFileSync("git", ["diff", "--no-renames", "b213173", "--name-only", "--diff-filter=AM"], { encoding: "utf8" });
    const added = cp.execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { encoding: "utf8" });
    const files = [...new Set((changed + added).split("\n"))].filter(p => p.startsWith("src/") && /\.tsx?$/.test(p));
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: new FlatCompat({ baseDirectory: process.cwd() }).extends("next/core-web-vitals", "next/typescript") });
    const results = await eslint.lintFiles(files);
    const report = { files, errors: results.reduce((n,r)=>n+r.errorCount,0), warnings: results.reduce((n,r)=>n+r.warningCount,0), messages: results.filter(r=>r.messages.length).map(r=>({file:r.filePath,messages:r.messages})) };
    fs.writeFileSync("doc/projects-reorganization/baseline/plan03/lint.json", JSON.stringify(report,null,2)+"\n");
    console.log(JSON.stringify(report));
    if(report.errors) process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
