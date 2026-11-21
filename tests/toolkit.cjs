const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');const root=path.resolve(__dirname,'..');
function setup(entry='index.html',url='https://example.com/diffora/'){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'dist',entry),'utf8'),{url,runScripts:'outside-only'}),w=dom.window;
 w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.HTMLElement.prototype.scrollIntoView=function(){};
 for(const file of ['viewer-preview.js','viewer-core.js','diff.js','i18n.js','app.js','viewer.js','codec-core.js','codec.js','toolkit.js'])w.eval(fs.readFileSync(path.join(root,'dist',file),'utf8'));
 return {dom,w,el:id=>w.document.getElementById(id)};
}
test('Root opens comparison and stable tool links never accumulate nested paths',()=>{
 const s=setup();assert.equal(s.w.location.pathname,'/diffora/compare/');assert.equal(s.el('compare-panel').hidden,false);assert.equal(s.el('tab-compare').getAttribute('aria-current'),'page');
 for(let i=0;i<4;i++){s.el('tab-viewer').click();assert.equal(s.w.location.pathname,'/diffora/viewer/');assert.equal(s.el('tab-viewer').getAttribute('aria-current'),'page');assert.equal(s.el('tab-compare').hasAttribute('aria-current'),false);s.el('tab-compare').click();assert.equal(s.w.location.pathname,'/diffora/compare/');}
 assert.equal(s.w.document.querySelector('header .brand').href,'https://example.com/diffora/');s.dom.window.close();
});
test('All nested entry pages resolve assets to the app root and select the correct tool',()=>{
 for(const name of ['compare','viewer','codec','timestamp','regex']){for(const ending of ['/','/index.html']){const s=setup(name+'/index.html','https://example.com/diffora/'+name+ending);assert.equal(s.w.document.baseURI,'https://example.com/diffora/');assert.equal(s.w.location.pathname,'/diffora/'+name+'/');assert.equal(s.el('viewer-panel').hidden,name!=='viewer');assert.equal(s.el('tab-viewer').href,'https://example.com/diffora/viewer/');assert.match(s.w.document.title,/Developer Toolkit/);s.dom.window.close();}}
});
test('Legacy hash links are canonicalized and query strings remain intact',()=>{
 for(const [hash,name] of [['#viewer','viewer'],['#compare','compare']]){const s=setup('index.html','https://example.com/diffora/?source=bookmark'+hash);assert.equal(s.w.location.pathname,'/diffora/'+name+'/');assert.equal(s.w.location.hash,'');assert.equal(s.w.location.search,'?source=bookmark');s.dom.window.close();}
});
test('Browser back and forward restore selected tool without losing either input',async()=>{
 const s=setup();s.el('a').value='original file';s.el('v-source').value='{"kept":true}';s.el('tab-viewer').click();
 const back=new Promise(resolve=>s.w.addEventListener('popstate',resolve,{once:true}));s.w.history.back();await back;
 assert.equal(s.el('compare-panel').hidden,false);assert.equal(s.el('a').value,'original file');assert.equal(s.el('v-source').value,'{"kept":true}');
 const forward=new Promise(resolve=>s.w.addEventListener('popstate',resolve,{once:true}));s.w.history.forward();await forward;
 assert.equal(s.el('viewer-panel').hidden,false);assert.equal(s.el('v-source').value,'{"kept":true}');s.dom.window.close();
});
test('Language changes retain selected tool, accessible navigation and toolkit title',()=>{
 const s=setup('viewer/index.html','https://example.com/diffora/viewer/');s.el('language').value='en';s.el('language').dispatchEvent(new s.w.Event('change'));
 assert.equal(s.el('tool-navigation').getAttribute('aria-label'),'TOOLS');assert.equal(s.el('tab-compare').querySelector('strong').textContent,'Comparison');assert.equal(s.el('tab-viewer').getAttribute('aria-current'),'page');assert.equal(s.w.document.title,'Diffora · JSON / XML Viewer — Developer Toolkit');
 s.el('tab-compare').click();assert.equal(s.w.document.title,'Diffora · Comparison — Developer Toolkit');s.dom.window.close();
});
