const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(__dirname+'/../dist/diff.js','utf8');
const sparseContext=vm.createContext({});vm.runInContext(source.replace('(n+1)*(m+1)>12000000','(n+1)*(m+1)>0'),sparseContext);
let seed=973;const rnd=()=>((seed=(seed*1664525+1013904223)>>>0)/2**32);
function optimal(a,b){let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let next=[i];for(let j=1;j<=b.length;j++)next[j]=a[i-1]===b[j-1]?prev[j-1]:Math.min(prev[j],next[j-1])+1;prev=next;}return prev[b.length];}
for(let n=0;n<1000;n++){let a=Array.from({length:1+Math.floor(rnd()*25)},()=>['a','b','c',''][Math.floor(rnd()*4)]),b=Array.from({length:1+Math.floor(rnd()*25)},()=>['a','b','c',''][Math.floor(rnd()*4)]);const aa=a.join('\n'),bb=b.join('\n'),r=sparseContext.compareLines(aa,bb);assert.equal(r.filter(x=>x.an).map(x=>x.a).join('\n'),aa);assert.equal(r.filter(x=>x.bn).map(x=>x.b).join('\n'),bb);assert.equal(r.reduce((total,x)=>total+(x.same?0:(x.an?1:0)+(x.bn?1:0)),0),optimal(aa===''?[]:a,bb===''?[]:b));}
console.log('PASS: 1000 bounded Myers cases preserve both texts and produce an optimal edit count.');
const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',innerHTML:'',dataset:{},checked:false,disabled:false,scrollTop:0,offsetTop:0,addEventListener(){},replaceChildren(){this.innerHTML=''},querySelector(){return this.innerHTML.includes('class="row"')?{}:null}});return nodes.get(id)};
let selected=[];
const document={
 getElementById:node,
 addEventListener(){},
 querySelectorAll(){return []},
 querySelector(selector){
  const m=selector.match(/data-i="(\d+)"/);
  if(!m)return null;
  return {offsetTop:Number(m[1])*26,classList:{add(){selected.push(Number(m[1]))}}};
 }
};
const ctx=vm.createContext({document,t:s=>s,applyLanguage(){},localStorage:{},language:'tr',console});vm.runInContext(source,ctx);vm.runInContext(fs.readFileSync(__dirname+'/../dist/app.js','utf8'),ctx);
node('a').value='a\nb\nc\nd\ne';node('b').value='A\nb\nC\nd\nE';ctx.compare();ctx.navigate(-1);assert.equal(node('position').textContent,'3 / 3');assert.equal(selected.at(-1),4);ctx.navigate(1);assert.equal(node('position').textContent,'1 / 3');console.log('PASS: initial previous selects last group and next wraps to first.');
node('a').value='a  b\n c';node('b').value='ab\nc';node('spaces').checked=true;ctx.compare();assert.match(node('stats').textContent,/2 aynı/);assert(!node('diff').innerHTML.includes('<mark>'));console.log('PASS: ignored whitespace has no red highlighting.');
node('a').value=Array.from({length:3500},(_,i)=>'a'+i).join('\n');node('b').value=Array.from({length:3500},(_,i)=>'b'+i).join('\n');ctx.compare();assert.match(node('error').textContent,/işlem sınır/);assert.equal(node('diff').innerHTML,'');assert.equal(node('position').textContent,'0 / 0');assert.equal(node('stats').textContent,'Henüz karşılaştırma yok');assert(node('prev').disabled&&node('next').disabled);assert.equal(vm.runInContext('rows.length',ctx),0);ctx.refreshLanguage();assert.equal(node('stats').textContent,'Henüz karşılaştırma yok');console.log('PASS: capacity error clears old rows, counts, navigation and state.');
