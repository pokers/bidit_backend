const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
// const RegExp = require('RegExp');

// const functionsDir = `src/resolvers`;
// const outDir = `dist/resolvers/`;
// const filterReg = new RegExp('\Resolver.ts$', 'i')
const functionsDir = `dist/resolvers`;
const outDir = `bundle/`;
const filterReg = new RegExp('\Resolver.js$', 'i')
const entryPoints = fs
  .readdirSync(path.join(__dirname, functionsDir))
  .map(entry => {
    // console.log(entry)
    if(filterReg.test(entry)){
      return `${functionsDir}/${entry}`;
    }
  }).filter(item=>item !== undefined);

console.log(entryPoints)
esbuild
  .build({
    entryPoints,
    bundle: true,
    outdir: path.join(__dirname, outDir),
    outbase: functionsDir, 
    platform: 'node',
    sourcemap: 'inline',
});