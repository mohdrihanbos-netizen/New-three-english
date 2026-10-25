(()=>{const $=i=>document.getElementById(i),ls=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const LV=[[1,'Level 1','Easy 3-letter words','#ff6b8b'],[2,'Level 2','More 3-letter words','#ff9a1f'],[3,'Level 3','4-letter words','#2bb673'],[4,'Level 4','Mixed words','#4f9dff'],[5,'Level 5','My custom words','#9b6bff']];
const PRAISE=['Great Job!','Amazing!','Super Star!','Excellent Work!'],RETRY=['Almost there!','Try Again!','You Can Do It!'];
let all=[],P=ls('wb_progress',{stars:0,best:{}}),S=ls('wb_set',{sound:true,calm:false}),C=WB.cfg(),g=null,ac;
const beep=(f,d=.15,t=0)=>{if(!S.sound)return;try{ac=ac||new AudioContext();const o=ac.createOscillator(),v=ac.createGain();o.frequency.value=f;v.gain.value=.12;o.connect(v);v.connect(ac.destination);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+d)}catch(e){}};
const show=id=>['home','game','done'].forEach(s=>$(s).hidden=s!==id);
function pick(l){const ok=w=>w.active!==false&&WB.clean(w.word).length>=2;return all.filter(w=>ok(w)&&(l===4?w.level<=3:w.level===l))}
function home(){show('home');$('levels').innerHTML='';LV.forEach(([n,t,d,c])=>{const k=pick(n).length,b=document.createElement('button');b.className='lvl';b.style.background=c;b.disabled=!k;b.innerHTML=`${t}<small>${d}</small><small>${k?k+' words · best '+(P.best[n]||0)+' pts':'No words yet'}</small>`;b.onclick=()=>start(n);$('levels').append(b)});
 $('totals').textContent=`Total stars: ${P.stars}`;$('sound').textContent=S.sound?'🔊 Sound on':'🔇 Sound off';$('sound').setAttribute('aria-pressed',S.sound);$('calm').textContent='🌀 Calm animations: '+(S.calm?'on':'off');$('calm').setAttribute('aria-pressed',S.calm);document.body.classList.toggle('calm',S.calm)}
function start(l){C=WB.cfg();const q=WB.shuffle(pick(l)).slice(0,8);g={l,q,i:0,score:0,stars:0};sv('wb_progress',P);show('game');load()}
function load(){const w=g.q[g.i],word=WB.clean(w.word);Object.assign(g,{w,word,slots:Array(word.length).fill(null),tries:0,hints:0,done:false,set:WB.tiles(word),dyn:new Set(word).size>4});
 $('msg').textContent='';$('reveal').hidden=true;$('next').hidden=true;$('progfill').style.width=g.i/g.q.length*100+'%';$('prog').setAttribute('aria-valuenow',Math.round(g.i/g.q.length*100));$('q').textContent=`Word ${g.i+1} of ${g.q.length}. Listen and spell it!`;draw();say(true)}
const used=l=>g.slots.filter(x=>x===l).length,total=l=>[...g.word].filter(x=>x===l).length;
function tileList(){if(!g.dyn)return g.set;const need=[...new Set(g.word)].filter(l=>total(l)-used(l)>0).slice(0,4);return need.concat(WB.distractors(g.word,4-need.length))}
function draw(hl){$('stars').textContent='⭐ '+g.stars;$('score').textContent=g.score+' pts';const s=$('slots');s.innerHTML='';
 g.slots.forEach((l,i)=>{const b=document.createElement('button');b.className='slot'+(l?' full':'');b.textContent=l||'';b.setAttribute('aria-label',l?`Letter ${i+1}: ${l}. Press to remove`:`Empty slot ${i+1}`);b.onclick=()=>{if(!g.done&&l){g.slots[i]=null;draw()}};
  b.ondragover=e=>{e.preventDefault();b.classList.add('over')};b.ondragleave=()=>b.classList.remove('over');b.ondrop=e=>{e.preventDefault();place(e.dataTransfer.getData('text'),i)};s.append(b)});
 const t=$('tiles');t.innerHTML='';tileList().forEach(l=>{const left=Math.max(0,total(l)-used(l)),b=document.createElement('button');b.className='tile'+(hl===l?' hint':'');b.textContent=l;b.disabled=g.done||used(l)>=Math.max(total(l),1);if(total(l)>1&&left>0)b.insertAdjacentHTML('beforeend',`<b aria-hidden="true">×${left}</b>`);b.setAttribute('aria-label',`Letter ${l}`);b.draggable=true;b.ondragstart=e=>e.dataTransfer.setData('text',l);b.onclick=()=>place(l);t.append(b)})}
function place(l,i){if(g.done||!l)return;if(i==null||g.slots[i])i=g.slots.indexOf(null);if(i<0)return;if(used(l)>=Math.max(total(l),1))return;g.slots[i]=l;beep(520+i*60,.08);draw();if(!g.slots.includes(null))check()}
function check(){const ok=g.slots.join('')===g.word;g.tries++;if(ok)win();else{const sl=[...document.querySelectorAll('.slot')];sl.forEach((e,i)=>g.slots[i]!==g.word[i]&&e.classList.add('bad'));beep(260,.25);
  $('msg').textContent=RETRY[(g.tries-1)%3]+(g.tries>=2?' Try the 💡 Hint.':'');g.lock=true;setTimeout(()=>{g.slots=g.slots.map((l,i)=>l===g.word[i]?l:null);draw()},900)}}
function win(){g.done=true;const i=Math.min(g.tries,3)-1,pts=C.pts[i]+(g.hints?0:C.bonus);g.score+=pts;g.stars+=C.stars[i];P.stars+=C.stars[i];sv('wb_progress',P);
 document.querySelectorAll('.slot').forEach(e=>e.classList.add('ok'));$('msg').textContent='✅ '+PRAISE[Math.floor(Math.random()*4)]+` +${pts} pts · ${'⭐'.repeat(C.stars[i])}`;
 const w=g.w;$('reveal').innerHTML=`${w.image?`<img src="${w.image}" alt="${w.word}">`:''}<div class="word">${g.word}</div>${w.sentence?`<div>${w.sentence}</div>`:''}`;$('reveal').hidden=false;$('next').hidden=false;$('next').textContent=g.i+1<g.q.length?'Next →':'Finish ✓';$('next').focus();
 [523,659,784,1047].forEach((f,k)=>beep(f,.18,k*.12));confetti();draw()}
function confetti(){const f=$('fx');for(let i=0;i<28;i++){const s=document.createElement('span');s.textContent=['🎈','⭐','🎉','✨','💖'][i%5];s.style.left=Math.random()*95+'%';s.style.animationDelay=Math.random()*.6+'s';f.append(s);setTimeout(()=>s.remove(),3400)}}
function say(auto){const b=$('speak');b.classList.add('on');setTimeout(()=>b.classList.remove('on'),1600);WB.speak(g.w,m=>{if(!auto||!/Tap/.test(m))$('msg').textContent=m;else $('msg').textContent='👆 '+m})}
function hint(){if(g.done)return;g.hints++;let i=g.slots.findIndex((l,k)=>l!==g.word[k]);if(i<0)return;if(g.slots[i]){g.slots[i]=null}draw(g.word[i]);$('msg').textContent=`💡 Look for the glowing letter!`}
function finish(){P.best[g.l]=Math.max(P.best[g.l]||0,g.score);sv('wb_progress',P);show('done');$('summary').textContent=`You scored ${g.score} points and won ${g.stars} stars! ${g.stars>=g.q.length*2?'You are a spelling superstar!':'Every word makes you stronger!'}`;confetti();[523,659,784,1047].forEach((f,k)=>beep(f,.2,k*.15))}
$('speak').onclick=()=>say();$('hint').onclick=hint;$('reset').onclick=()=>{if(!g.done){g.slots.fill(null);draw()}};$('next').onclick=()=>{g.i++;g.i<g.q.length?load():finish()};
$('quit').onclick=()=>{speechSynthesis&&speechSynthesis.cancel();home()};$('menu').onclick=home;$('again').onclick=()=>start(g.l);
$('sound').onclick=()=>{S.sound=!S.sound;sv('wb_set',S);home()};$('calm').onclick=()=>{S.calm=!S.calm;sv('wb_set',S);home()};
document.addEventListener('keydown',e=>{if($('game').hidden||!g||e.ctrlKey||e.metaKey)return;if(e.key==='Backspace'){const i=g.slots.map(x=>x!=null).lastIndexOf(true);if(i>=0&&!g.done){g.slots[i]=null;draw()}}else if(/^[a-z]$/i.test(e.key)){const l=e.key.toUpperCase();if(tileList().includes(l)){place(l)}}});
WB.words().then(w=>{all=w;home()}).catch(()=>{$('home').insertAdjacentHTML('beforeend','<p class="warn">Could not load words. Serve the folder with a web server (see README).</p>')});
})();
