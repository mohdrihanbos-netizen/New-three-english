(()=>{const $=i=>document.getElementById(i);let L=[],ed=-1,sortAsc=true,cfg=WB.cfg();
const save=()=>{try{localStorage.setItem('wb_words',JSON.stringify(L))}catch(e){$('err').textContent='Storage full. Use file paths instead of uploads.'}};
const rd=f=>new Promise(r=>{const x=new FileReader();x.onload=()=>r(x.result);x.readAsDataURL(f)});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function cur(){return{word:WB.clean($('w').value),category:$('cat').value.trim(),level:+$('lv').value,audio:$('au').value.trim(),image:$('im').value.trim(),sentence:$('se').value.trim(),notes:$('no').value.trim(),active:$('ac').checked}}
function prev(){const w=cur(),m=WB.validate(w,L.filter((_,i)=>i!==ed));$('pv').innerHTML=w.word?`<div class="pv">${[...w.word].map(()=>'<span></span>').join('')}</div>`:'';
 const t=w.word?WB.tiles(w.word):[];$('pm').innerHTML=t.length?`<div class="pv" style="margin-top:.5rem">${t.map(x=>`<b>${x}</b>`).join('')}</div>`:'';
 $('pvi').innerHTML=w.word?`${w.word.length} slots · required: ${[...new Set(w.word)].join(', ')}`+(m.length?`<br><span class="warn">${m.map(esc).join('<br>')}</span>`:'<br><span class="ok">Looks good.</span>'):'Type a word to preview.'}
function render(){const q=$('q').value.toLowerCase(),fl=$('fl').value;$('cnt').textContent=`(${L.length})`;$('cats').innerHTML=[...new Set(L.map(w=>w.category))].map(c=>`<option value="${esc(c)}">`).join('');
 const rows=L.map((w,i)=>({w,i})).filter(({w})=>(!fl||w.level==fl)&&(!q||(w.word+w.category).toLowerCase().includes(q))).sort((a,b)=>(a.w.level-b.w.level||a.w.word.localeCompare(b.w.word))*(sortAsc?1:-1));
 $('tb').innerHTML=rows.map(({w,i})=>`<tr><td><b>${esc(w.word)}</b></td><td>${WB.clean(w.word).length}</td><td>${w.level}</td><td>${esc(w.category||'')}</td><td>${w.active!==false?'Yes':'No'}</td><td><button class="btn" data-a="e${i}">Edit</button> <button class="btn" data-a="d${i}">Duplicate</button> <button class="btn" data-a="x${i}">Delete</button></td></tr>`).join('')||'<tr><td colspan="6">No words match. Add one with the form.</td></tr>'}
function fill(w){$('w').value=w.word;$('cat').value=w.category||'';$('lv').value=w.level;$('au').value=w.audio||'';$('im').value=w.image||'';$('se').value=w.sentence||'';$('no').value=w.notes||'';$('ac').checked=w.active!==false;prev()}
function clear(){ed=-1;$('ft').textContent='Add a word';fill({word:'',level:1,active:true});$('err').textContent='';$('auf').value='';$('imf').value=''}
$('f').onsubmit=async e=>{e.preventDefault();const w=cur(),m=WB.validate(w,L.filter((_,i)=>i!==ed)).filter(x=>!x.startsWith('Note'));if(m.length){$('err').textContent=m.join(' ');$('err').className='warn';return}
 if($('auf').files[0])w.audio=await rd($('auf').files[0]);if($('imf').files[0])w.image=await rd($('imf').files[0]);ed>=0?L[ed]=w:L.push(w);save();clear();render();$('err').className='ok';$('err').textContent='Saved.'};
$('f').oninput=prev;$('cancel').onclick=clear;$('q').oninput=$('fl').onchange=render;$('sl').onclick=()=>{sortAsc=!sortAsc;render()};
$('tb').onclick=e=>{const a=e.target.dataset.a;if(!a)return;const i=+a.slice(1),k=a[0];if(k==='e'){ed=i;$('ft').textContent='Edit word';fill(L[i]);$('w').focus()}
 else if(k==='d'){ed=-1;$('ft').textContent='Duplicate: change the word, then save';fill(Object.assign({},L[i],{word:''}));$('w').focus()}
 else if(confirm(`Delete "${L[i].word}"? This cannot be undone.`)){L.splice(i,1);save();clear();render()}};
$('pa').onclick=()=>{const w=cur();w.word?WB.speak(w,m=>$('err').textContent=m):$('err').textContent='Enter a word first.'};
$('exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({words:L},null,1)],{type:'application/json'}));a.download='words.json';a.click()};
$('imp').onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text()),a=Array.isArray(j)?j:j.words;if(!Array.isArray(a))throw 0;let n=0;a.forEach(w=>{w.word=WB.clean(w.word);if(w.word&&!L.some(x=>x.word===w.word)){L.push(Object.assign({category:'',level:1,audio:'',image:'',sentence:'',notes:'',active:true},w));n++}});save();render();$('err').className='ok';$('err').textContent=`Imported ${n} new word(s).`}catch(x){$('err').className='warn';$('err').textContent='Invalid JSON. Expected {"words":[...]}.'}e.target.value=''};
$('rs').onclick=async()=>{if(confirm('Discard local changes and reload data/words.json?')){localStorage.removeItem('wb_words');L=await WB.fileWords();clear();render()}};
const set=()=>{['p1','p2','p3'].forEach((k,i)=>$(k).value=cfg.pts[i]);$('bn').value=cfg.bonus};
$('sc').onclick=()=>{cfg.pts=[+$('p1').value,+$('p2').value,+$('p3').value];cfg.bonus=+$('bn').value;localStorage.setItem('wb_cfg',JSON.stringify(cfg));$('err').className='ok';$('err').textContent='Scoring saved.'};
WB.words().then(w=>{L=w;set();clear();render()});
})();
