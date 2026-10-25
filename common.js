const WB={
 DEF:{pts:[10,7,5],stars:[3,2,1],bonus:3},
 cfg(){try{return Object.assign({},this.DEF,JSON.parse(localStorage.getItem('wb_cfg')||'{}'))}catch(e){return this.DEF}},
 async words(){try{const l=JSON.parse(localStorage.getItem('wb_words')||'null');if(Array.isArray(l))return l}catch(e){}return this.fileWords()},
 async fileWords(){const r=await fetch('data/words.json');return (await r.json()).words},
 clean:w=>String(w||'').toUpperCase().replace(/[^A-Z]/g,''),
 rng(seed){let h=7;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;return()=>(h=(h*1103515245+12345)>>>0)/4294967296},
 distractors(word,n){const r=this.rng(word),p='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(c=>!word.includes(c)),o=[];while(o.length<n&&p.length)o.push(p.splice(Math.floor(r()*p.length),1)[0]);return o},
 tiles(word){const d=[...new Set(word)];if(d.length>=4)return d.slice(0,4);return this.shuffle(d.concat(this.distractors(word,4-d.length)),word)},
 shuffle(a,seed){const r=seed?this.rng(seed+'s'):Math.random,b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b},
 validate(w,all){const c=this.clean(w.word),e=[];if(!c)e.push('Enter a word using letters A-Z.');else{if(c.length<2||c.length>8)e.push('Use 2 to 8 letters.');if(all&&all.some(x=>x!==w&&this.clean(x.word)===c))e.push('This word already exists.')}
  if(c&&new Set(c).size>4)e.push('Note: more than 4 different letters, so tiles will refresh as the child plays.');return e},
 speak(w,onFail){const say=()=>{if(!('speechSynthesis'in window)){onFail&&onFail('No voice available. Add an audio file for this word.');return}
   speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(w.word.toLowerCase());u.lang='en-US';u.rate=.8;u.pitch=1.2;speechSynthesis.speak(u)};
  if(w.audio){const a=new Audio(w.audio);a.onerror=()=>{onFail&&onFail('Audio file not found, using voice instead.');say()};a.play().catch(e=>{if(e.name==='NotAllowedError')onFail&&onFail('Tap the speaker to hear the word.');else{say()}})}else say()}
};
