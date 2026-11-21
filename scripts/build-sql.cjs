const path=require('node:path'),fs=require('node:fs'),{buildSync}=require('esbuild');
const root=path.resolve(__dirname,'..');
buildSync({entryPoints:[path.join(__dirname,'vendor/sql-engine.mjs')],outfile:path.join(root,'dist/vendor/sql-engine.js'),bundle:true,minify:true,format:'iife',globalName:'DifforaSqlEngine',platform:'browser',target:['es2020'],legalComments:'eof',banner:{js:'/* sql-formatter 15.10.0 (MIT) — bundled PostgreSQL / Transact-SQL. See sql-formatter.LICENSE.txt. */'},footer:{js:'globalThis.DifforaSqlEngine=DifforaSqlEngine;if(typeof module!=="undefined")module.exports=DifforaSqlEngine;'}});
fs.copyFileSync(path.join(root,'node_modules/sql-formatter/LICENSE'),path.join(root,'dist/vendor/sql-formatter.LICENSE.txt'));
fs.copyFileSync(path.join(root,'node_modules/nearley/LICENSE.txt'),path.join(root,'dist/vendor/nearley.LICENSE.txt'));
console.log('Built local PostgreSQL / T-SQL formatter engine.');
