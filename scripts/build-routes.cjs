// GitHub Pages serves these static directories without rewrite rules.
const fs=require('node:fs');const path=require('node:path');
const dist=path.resolve(__dirname,'../dist');const source=fs.readFileSync(path.join(dist,'index.html'),'utf8');
if(!source.includes('<head>'))throw Error('Missing HTML head');
for(const route of ['compare','viewer','codec','timestamp']){const directory=path.join(dist,route);fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'index.html'),source.replace('<head>','<head><base href="../">'));}
console.log('Generated comparison, viewer, codec and timestamp entry pages.');
