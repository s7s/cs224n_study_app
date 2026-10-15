/* App engine: state, views, actions, UI strings. Shared by index.html and every lecture page. */
(function(){
var UI={
ar:{tag:"دروس قصيرة تفتحها في أي وقت",streak:"أيام متتالية",due:"للمراجعة",soon:"قريبًا",lectures:"المحاضرات",review:"المراجعة",
 back:"رجوع",card:function(a,b){return "كارت "+a+" من "+b;},next:"التالي",prev:"السابق",finish:"خلّصت المحاضرة",
 right:"صح.",wrong:"غلط.",show:"اظهر الإجابة",knew:"عرفتها",again:"لسه مش متأكد",
 none:"مفيش كروت للمراجعة دلوقتي.",noneHint:"خلّص كروت من أي محاضرة وهتظهر هنا.",practice:"راجع كل الكروت اللي خلصتها",
 left:function(n){return "باقي "+n+" كارت";},done:"خلصت المراجعة.",backup:"نسخة احتياطية للتقدم",bkTitle:"نسخة احتياطية",bkCopy:"انسخ النص ده واحفظه في مكان آمن (مثلًا في ملاحظات). لو غيّرت ملف الصفحة أو مسحت بيانات المتصفح، ارجع الصقه هنا في خانة الاسترجاع.",bkPaste:"الصق النسخة هنا للاسترجاع",bkRestore:"استرجاع",bkOk:"اتسترجع التقدم بنجاح.",bkBad:"النص ده مش نسخة صالحة.",
 glossary:"المصطلحات",glCount:function(n){return n+" مصطلح";},glNone:"مفيش مصطلحات لسه.",glNoneHint:"المصطلحات بتتجمع من كروت المحاضرات أول ما تتضاف.",
 mistakes:"الأخطاء",mixed:"اختبار متنوّع",srch:"ابحث في الكروت والمصطلحات",srNone:"مفيش نتايج.",
 qn:function(a,b){return "سؤال "+a+" من "+b;},nextQ:"السؤال التالي",seeRes:"شوف النتيجة",result:"النتيجة",
 score:function(a,b){return a+" من "+b+" صح";},lecScore:function(a,b){return a+"/"+b+" صح";},
 mkNone:"مفيش أخطاء دلوقتي.",mkNoneHint:"أي سؤال هتغلط فيه هيظهر هنا لحد ما تجاوبه صح.",mkAllDone:"خلّصت كل الأخطاء.",
 mxNone:"لسه مفيش أسئلة تكفي لاختبار.",mxNoneHint:"خلّص كروت من أي محاضرة وجاوب أسئلتها وهتتجمع هنا.",
 retry:function(n){return "راجع الأخطاء الباقية ("+n+")";},newMix:"اختبار جديد",toHome:"الرئيسية"},
en:{tag:"Short lessons, open any time",streak:"day streak",due:"due for review",soon:"Soon",lectures:"Lectures",review:"Review",
 back:"Back",card:function(a,b){return "Card "+a+" of "+b;},next:"Next",prev:"Previous",finish:"Finish lecture",
 right:"Correct.",wrong:"Not quite.",show:"Show answer",knew:"Got it",again:"Not sure yet",
 none:"Nothing due for review right now.",noneHint:"Finish cards in any lecture and they will appear here.",practice:"Practice all finished cards",
 left:function(n){return n+" left";},done:"Review complete.",backup:"Back up progress",bkTitle:"Backup",bkCopy:"Copy this text and keep it somewhere safe (for example in a notes app). If you replace the page file or clear browser data, paste it back here in the restore box.",bkPaste:"Paste a backup here to restore",bkRestore:"Restore",bkOk:"Progress restored.",bkBad:"That text is not a valid backup.",
 glossary:"Glossary",glCount:function(n){return n+(n===1?" term":" terms");},glNone:"No terms yet.",glNoneHint:"Terms are collected from the lecture cards as they are added.",
 mistakes:"Mistakes",mixed:"Mixed quiz",srch:"Search cards and terms",srNone:"No results.",
 qn:function(a,b){return "Question "+a+" of "+b;},nextQ:"Next question",seeRes:"See result",result:"Result",
 score:function(a,b){return a+" of "+b+" correct";},lecScore:function(a,b){return a+"/"+b+" correct";},
 mkNone:"No mistakes right now.",mkNoneHint:"Any question you get wrong will appear here until you answer it correctly.",mkAllDone:"All mistakes cleared.",
 mxNone:"Not enough questions for a quiz yet.",mxNoneHint:"Finish cards in any lecture and answer their questions; they will be collected here.",
 retry:function(n){return "Review remaining mistakes ("+n+")";},newMix:"New quiz",toHome:"Home"}
};

/* ---------- State ---------- */
var KEY="cs224n_v1";
var S={lang:"ar",done:{},fc:{},q:{},streak:{last:0,n:0}};
try{var r=JSON.parse(localStorage.getItem(KEY)||"null");if(r)S=Object.assign(S,r);}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

/* ---------- Card ids and progress keys ----------
   S.q[cardId+"@"+qi] = {ok,d}      (qi = index of the question inside card.q; latest result only, d = day number)
   S.done[cardId] = true            (cardId = card.id, e.g. "l3-chainrule")
   S.fc[cardId+"#"+n] = {box,due}   (n = index of the flashcard inside card.f, which may be one object or an array)
   Old format "lectureNumber:cardIndex" (e.g. "3:2") is migrated to the new keys on load and on backup restore. */
function cleanQ(q){
  var o={};if(!q||typeof q!=="object"||Array.isArray(q))return o;
  Object.keys(q).forEach(function(k){var v=q[k];
    if(/^.+@\d+$/.test(k)&&v&&typeof v==="object"&&typeof v.ok==="boolean")o[k]={ok:v.ok,d:(typeof v.d==="number"&&isFinite(v.d))?v.d:0};});
  return o;
}
function cid(l,j){return l.cards[j].id||("l"+l.id+"-c"+(j+1));}
function fcKeys(l,j){var id=cid(l,j);return asList(l.cards[j].f).map(function(_,n){return id+"#"+n;});}
var IDX={};
LECS.forEach(function(l){(l.cards||[]).forEach(function(c,j){IDX[cid(l,j)]={lec:l,card:c,i:j};});});
var OLDK=/^(\d+):(\d+)$/;
function migrate(done,fc){
  var nd={},nf={},ch=false;
  function conv(k,suf){
    var m=OLDK.exec(k);if(!m)return k;
    var l=lecById(m[1]);if(!l||!l.cards)return k;   /* lecture not loaded on this page: keep the old key until index.html */
    if(!l.cards[+m[2]]){ch=true;return null;}        /* card no longer exists: drop */
    ch=true;return cid(l,+m[2])+suf;
  }
  Object.keys(done).forEach(function(k){if(!OLDK.test(k))nd[k]=done[k];});
  Object.keys(fc).forEach(function(k){if(!OLDK.test(k))nf[k]=fc[k];});
  Object.keys(done).forEach(function(k){if(!OLDK.test(k))return;var n=conv(k,"");if(n!==null&&!(n in nd))nd[n]=done[k];});
  Object.keys(fc).forEach(function(k){if(!OLDK.test(k))return;var n=conv(k,"#0");if(n!==null&&!(n in nf))nf[n]=fc[k];});
  return {done:nd,fc:nf,changed:ch};
}
(function(){
  if(!S.done||typeof S.done!=="object")S.done={};
  if(!S.fc||typeof S.fc!=="object")S.fc={};
  S.q=cleanQ(S.q);
  var m=migrate(S.done,S.fc);if(m.changed){S.done=m.done;S.fc=m.fc;save();}
})();

var V={view:"home",lec:0,idx:0,pick:{},q:[],show:false,practice:false,reviewed:false,sq:"",ss:null};
/* multi-page: index.html shows all lectures; each lectures/lecture-NN.html sets window.PAGE={lec:N} and opens straight on its lecture */
var PG=window.PAGE||{};
if(PG.lec){var l0=LECS[0],s0=0;for(var j0=0;j0<l0.cards.length;j0++){if(!S.done[cid(l0,j0)]){s0=j0;break;}}var mh=/^#card=(.+)$/.exec(location.hash||"");
  if(mh){try{var want=decodeURIComponent(mh[1]);for(var k0=0;k0<l0.cards.length;k0++){if(cid(l0,k0)===want){s0=k0;break;}}
    history.replaceState(null,"",location.pathname+location.search);}catch(e){}}
  V.view="lec";V.lec=0;V.idx=s0;}
else if(location.hash==="#review"){V.view="review";V.q=dueKeys();try{history.replaceState(null,"",location.pathname+location.search);}catch(e){}}
else if(location.hash==="#glossary"){V.view="glossary";try{history.replaceState(null,"",location.pathname+location.search);}catch(e){}}
function goHome(){if(PG.lec){location.href="../index.html";}else{V.view="home";V.ss=null;render();top();}}
var INT=[1,3,7,14,30];
function today(){return Math.floor(Date.now()/864e5);}
function streakNow(){return S.streak.last>=today()-1?S.streak.n:0;}
function touchStreak(){var d=today();if(S.streak.last===d)return;S.streak.n=(S.streak.last===d-1)?S.streak.n+1:1;S.streak.last=d;}
/* a flashcard key is usable if its card still exists (or its lecture is not loaded on this page, so we cannot tell) */
function fcOk(key){
  var p=String(key).split("#"),e=IDX[p[0]];
  if(e)return !!asList(e.card.f)[+p[1]];
  var m=/^l(\d+)-/.exec(p[0]);
  return !!m&&!lecById(m[1]);
}
function fcKeysAll(){return Object.keys(S.fc).filter(fcOk);}
function dueKeys(){var d=today();return fcKeysAll().filter(function(k){return S.fc[k].due<=d;});}
function lecById(id){for(var i=0;i<LECS.length;i++)if(String(LECS[i].id)===String(id))return LECS[i];}
function fcOf(key){var p=key.split("#"),e=IDX[p[0]];return e?(asList(e.card.f)[+p[1]]||null):null;}
function allAnswered(c){return asList(c.q).every(function(_,qi){return V.pick[qi]!==undefined;});}
function markDone(l,j){S.done[cid(l,j)]=true;fcKeys(l,j).forEach(function(k){if(!S.fc[k])S.fc[k]={box:0,due:today()+1};});}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function $(s){return document.querySelector(s);}
function esc(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function langBtn(){return '<button class="lang" data-act="lang" aria-label="language">'+(S.lang==="ar"?"EN":"ع")+'</button>';}

/* ---------- Questions: results, mistakes, mixed quiz, search ---------- */
function qkey(id,qi){return id+"@"+qi;}
function qOf(key){var p=String(key).split("@"),e=IDX[p[0]];if(!e)return null;var q=asList(e.card.q)[+p[1]];return q?{q:q,e:e}:null;}
function allQKeys(done){
  var out=[];
  LECS.forEach(function(l){(l.cards||[]).forEach(function(c,j){
    if(done&&!S.done[cid(l,j)])return;
    asList(c.q).forEach(function(_,qi){out.push(qkey(cid(l,j),qi));});
  });});
  return out;
}
function mistakeKeys(){return allQKeys(false).filter(function(k){return S.q[k]&&S.q[k].ok===false;});}
function mixedKeys(){
  var wrong=shuffle(mistakeKeys()),seen={};
  wrong.forEach(function(k){seen[k]=1;});
  var rest=shuffle(allQKeys(true).filter(function(k){return !seen[k];}));
  return wrong.concat(rest).slice(0,10);
}
function startSess(mode){
  var keys=mode==="mistakes"?mistakeKeys():mixedKeys();
  V.view="sess";V.ss={mode:mode,keys:keys,i:0,ok:0,p:undefined,res:[]};
}
function lecScore(l){
  var x=0,y=0;
  (l.cards||[]).forEach(function(c,j){asList(c.q).forEach(function(_,qi){var r=S.q[qkey(cid(l,j),qi)];if(r){y++;if(r.ok)x++;}});});
  return {x:x,y:y};
}
function lecUrl(l){return "lectures/lecture-"+(l.id<10?"0":"")+l.id+".html";}
function plain(t){return String(t==null?"":t).replace(/<[^>]*>/g,"");}
function txt(t){return plain(t).replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");}
function escA(t){return esc(t).replace(/"/g,"&quot;");}
function norm(s){return String(s).toLowerCase().replace(/[\u064B-\u065F\u0670\u0640]/g,"").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه");}
function searchCards(q){
  var toks=norm(q).split(/\s+/).filter(Boolean),out=[];
  if(!toks.length)return out;
  function has(h,t){return h.indexOf(t)>=0;}
  LECS.forEach(function(l,i){(l.cards||[]).forEach(function(c,j){
    var th=norm(txt(c.t&&c.t.ar)+" "+txt(c.t&&c.t.en)),terms=asList(c.terms);
    var tt=terms.map(function(tm){return norm(txt(tm.t&&tm.t.ar)+" "+txt(tm.t&&tm.t.en));});
    var all=th+" "+tt.join(" ");
    if(!toks.every(function(t){return has(all,t);}))return;
    var inTitle=toks.every(function(t){return has(th,t);}),hit=null;
    if(!inTitle){
      for(var k=0;k<terms.length&&!hit;k++)if(toks.every(function(t){return has(tt[k],t);}))hit=terms[k];
      for(var k2=0;k2<terms.length&&!hit;k2++)if(toks.some(function(t){return has(tt[k2],t);}))hit=terms[k2];
    }
    out.push({lec:l,i:i,id:cid(l,j),title:c.t,hit:hit,rank:inTitle?0:1});
  });});
  out.sort(function(a,b){return a.rank-b.rank;});
  return out.slice(0,30);
}
function searchHtml(ui){
  var q=(V.sq||"").trim();if(!q)return "";
  var r=searchCards(q),L=S.lang,O=L==="ar"?"en":"ar";
  if(!r.length)return '<p class="cnt">'+ui.srNone+'</p>';
  return '<div class="list">'+r.map(function(x){
    var sub="";
    if(x.hit){var a=txt(x.hit.t[L]),b=txt(x.hit.t[O]);sub='<small>'+esc(a)+(b&&b!==a?' · '+esc(b):'')+'</small>';}
    return '<button class="lec" data-act="goto" data-i="'+x.i+'" data-id="'+escA(x.id)+'"><span class="num">'+x.lec.id+'</span>'+
           '<span class="lt">'+esc(txt(x.title[L]))+sub+'</span></button>';
  }).join('')+'</div>';
}
/* one question block, same look everywhere (lecture card, Mistakes, Mixed quiz) */
function qBlock(q,p,L,ui,act,qi){
  var h='<section class="quiz"><p class="qq">'+q.q[L]+'</p>';
  q.o.forEach(function(o,j){
    var cls="opt";
    if(p!==undefined){if(j===q.a)cls+=" ok";else if(j===p)cls+=" no";}
    h+='<button class="'+cls+'" data-act="'+act+'"'+(qi===undefined?'':' data-qi="'+qi+'"')+' data-j="'+j+'"'+(p!==undefined?' disabled':'')+'>'+o[L]+'</button>';
  });
  if(p!==undefined){
    var ok=p===q.a;
    h+='<p class="why '+(ok?'g':'b')+'"><b>'+(ok?ui.right:ui.wrong)+'</b> '+q.w[L]+'</p>';
  }
  return h+'</section>';
}

/* ---------- Views ---------- */
function home(ui){
  var h='<header class="top"><div><div class="brand">CS224N</div><div class="sub">'+ui.tag+'</div></div>'+langBtn()+'</header>';
  h+='<div class="stats"><div><b>'+streakNow()+'</b><span>'+ui.streak+'</span></div><div><b>'+dueKeys().length+'</b><span>'+ui.due+'</span></div></div>';
  h+='<input id="sq" class="sq" type="search" dir="auto" enterkeyhint="search" autocomplete="off" placeholder="'+escA(ui.srch)+'" aria-label="'+escA(ui.srch)+'" value="'+escA(V.sq)+'">';
  h+='<div id="sr">'+searchHtml(ui)+'</div>';
  h+='<div class="list" id="ll"'+(V.sq.trim()?' hidden':'')+'>';
  LECS.forEach(function(l,i){
    var n=l.cards?l.cards.length:0,d=0,sc=lecScore(l);
    if(n)l.cards.forEach(function(_,j){if(S.done[cid(l,j)])d++;});
    h+='<button class="lec'+(n?'':' off')+'" data-act="open" data-i="'+i+'"'+(n?'':' disabled')+'>'+
       '<span class="num">'+l.id+'</span><span class="lt">'+l.t[S.lang]+'</span>'+
       '<span class="st">'+(n?d+'/'+n+(sc.y?'<span class="sc'+(sc.x===sc.y?' all':'')+'">'+ui.lecScore(sc.x,sc.y)+'</span>':''):ui.soon)+'</span>'+
       (n?'<span class="bar" style="width:'+Math.round(d/n*100)+'%"></span>':'')+'</button>';
  });
  h+='</div>';
  var mk=mistakeKeys().length;
  h+='<div class="acts"><button class="btn pri wide" data-act="mixed">'+ui.mixed+'</button>'+
     '<button class="bk" data-act="glossary">'+ui.glossary+'</button>'+
     '<button class="bk" data-act="mistakes">'+ui.mistakes+(mk?'<span class="badge">'+mk+'</span>':'')+'</button></div>';
  h+='<button class="bk" data-act="backup">'+ui.backup+'</button>';
  return h;
}

function bkView(ui){
  var h='<header class="top"><button class="back" data-act="home">'+ui.back+'</button><span class="cnt">'+ui.bkTitle+'</span>'+langBtn()+'</header>';
  h+='<p>'+ui.bkCopy+'</p><textarea class="ta" readonly onfocus="this.select()">'+esc(JSON.stringify({done:S.done,fc:S.fc,q:S.q,streak:S.streak}))+'</textarea>';
  h+='<p style="margin-top:18px">'+ui.bkPaste+'</p><textarea id="rs" class="ta"></textarea>';
  h+='<div class="navrow"><button class="btn pri" data-act="restore">'+ui.bkRestore+'</button></div>';
  if(V.msg)h+='<p class="why '+(V.msgOk?'g':'b')+'">'+V.msg+'</p>';
  return h;
}

function lecView(ui){
  var l=LECS[V.lec],c=l.cards[V.idx],n=l.cards.length,L=S.lang;
  var h='<header class="top"><button class="back" data-act="home">'+ui.back+'</button><span class="cnt">'+ui.card(V.idx+1,n)+'</span>'+langBtn()+'</header>';
  h+='<div class="rail">'+l.cards.map(function(_,j){return '<i class="'+(S.done[cid(l,j)]?'d':'')+(j===V.idx?' c':'')+'"></i>';}).join('')+'</div>';
  h+='<article class="card"><h2>'+c.t[L]+'</h2><div class="body">'+c.b[L]+'</div></article>';
  asList(c.q).forEach(function(q,qi){h+=qBlock(q,V.pick[qi],L,ui,"pick",qi);});
  h+='<div class="navrow"><button class="btn" data-act="prev"'+(V.idx===0?' disabled':'')+'>'+ui.prev+'</button>'+
     '<button class="btn'+(allAnswered(c)?' pri':'')+'" data-act="next">'+(V.idx===n-1?ui.finish:ui.next)+'</button></div>';
  return h;
}

function revView(ui){
  var h='<header class="top"><div class="brand">'+ui.review+'</div>'+langBtn()+'</header>';
  if(!V.q.length){
    var any=fcKeysAll().length>0;
    h+='<div class="empty"><p class="big">'+(V.reviewed?ui.done:ui.none)+'</p>';
    h+=any?'<button class="btn pri" style="width:100%" data-act="practice">'+ui.practice+'</button>':'<p>'+ui.noneHint+'</p>';
    return h+'</div>';
  }
  while(V.q.length&&!fcOf(V.q[0]))V.q.shift();
  if(!V.q.length)return revView(ui);
  var f=fcOf(V.q[0]),L=S.lang;
  h+='<p class="cnt">'+ui.left(V.q.length)+'</p>';
  h+='<article class="card"><h2>'+f.q[L]+'</h2>';
  if(V.show)h+='<div class="body"><p>'+f.a[L]+'</p></div>';
  h+='</article><div class="navrow">';
  if(!V.show)h+='<button class="btn pri" data-act="show">'+ui.show+'</button>';
  else h+='<button class="btn" data-act="again">'+ui.again+'</button><button class="btn pri" data-act="knew">'+ui.knew+'</button>';
  return h+'</div>';
}

function glossary(){
  var map={},list=[];
  LECS.forEach(function(l){(l.cards||[]).forEach(function(c){asList(c.terms).forEach(function(tm){
    var k=String(tm.t.en).trim().toLowerCase(),e=map[k];
    if(!e){e=map[k]={t:tm.t,d:tm.d,src:[]};list.push(e);}
    if(e.src.indexOf(l.id)<0)e.src.push(l.id);
  });});});
  list.sort(function(a,b){return a.t.en.localeCompare(b.t.en,"en",{sensitivity:"base"});});
  return list;
}

function glView(ui){
  var g=glossary(),L=S.lang,O=L==="ar"?"en":"ar";
  var h='<header class="top"><div class="brand">'+ui.glossary+'</div>'+langBtn()+'</header>';
  if(!g.length)return h+'<div class="empty"><p class="big">'+ui.glNone+'</p><p>'+ui.glNoneHint+'</p></div>';
  h+='<p class="cnt">'+ui.glCount(g.length)+'</p>';
  g.forEach(function(e){
    h+='<article class="card gl"><h3>'+e.t[L]+'</h3>';
    if(e.t[O]!==e.t[L])h+='<div class="alt">'+e.t[O]+'</div>';
    h+='<div class="body"><p>'+e.d[L]+'</p></div><div class="src">'+e.src.map(function(n){return "L"+n;}).join(" · ")+'</div></article>';
  });
  return h;
}

function sessRail(ss){
  var n=ss.keys.length;
  if(n>20){var dn=ss.i+(ss.p!==undefined?1:0);return '<div class="rail"><i class="d" style="flex:0 0 '+Math.round(dn/n*100)+'%"></i><i></i></div>';}
  return '<div class="rail">'+ss.keys.map(function(_,j){
    var cls=ss.res[j]===true?'d':ss.res[j]===false?'x':'';
    if(j===ss.i&&ss.res[j]===undefined)cls+=' c';
    return '<i class="'+cls+'"></i>';
  }).join('')+'</div>';
}
function sessView(ui){
  var ss=V.ss,L=S.lang,n=ss.keys.length,mk=ss.mode==="mistakes";
  while(ss.i<n&&!qOf(ss.keys[ss.i]))ss.i++;
  var fin=ss.i>=n;
  var h='<header class="top"><button class="back" data-act="home">'+ui.back+'</button><span class="cnt">'+
    (!n?(mk?ui.mistakes:ui.mixed):fin?ui.result:ui.qn(ss.i+1,n))+'</span>'+langBtn()+'</header>';
  if(!n)return h+'<div class="empty"><p class="big">'+(mk?ui.mkNone:ui.mxNone)+'</p><p>'+(mk?ui.mkNoneHint:ui.mxNoneHint)+'</p></div>';
  if(fin){
    var left=mistakeKeys().length;
    h+='<div class="empty"><p class="big">'+ui.score(ss.ok,n)+'</p>'+(mk&&!left?'<p>'+ui.mkAllDone+'</p>':'')+'</div>';
    if(left)h+='<button class="btn pri" style="width:100%;margin-bottom:10px" data-act="mistakes">'+ui.retry(left)+'</button>';
    if(!mk)h+='<button class="btn'+(left?'':' pri')+'" style="width:100%;margin-bottom:10px" data-act="mixed">'+ui.newMix+'</button>';
    return h+'<button class="btn" style="width:100%" data-act="home">'+ui.toHome+'</button>';
  }
  var r=qOf(ss.keys[ss.i]);
  h+=sessRail(ss);
  h+='<p class="qsrc">L'+r.e.lec.id+' · '+plain(r.e.card.t[L])+'</p>';
  h+=qBlock(r.q,ss.p,L,ui,"spick");
  if(ss.p!==undefined)h+='<div class="navrow"><button class="btn pri" data-act="snext">'+(ss.i===n-1?ui.seeRes:ui.nextQ)+'</button></div>';
  return h;
}

function nav(ui){
  var d=dueKeys().length;
  return '<nav class="tabs"><button class="'+(V.view!=="review"&&V.view!=="glossary"?'on':'')+'" data-act="tabhome">'+ui.lectures+'</button>'+
         '<button class="'+(V.view==="review"?'on':'')+'" data-act="tabrev">'+ui.review+(d?'<span class="badge">'+d+'</span>':'')+'</button>'+
         '<button class="'+(V.view==="glossary"?'on':'')+'" data-act="tabglos">'+ui.glossary+'</button></nav>';
}

function render(){
  var ui=UI[S.lang],rt=document.documentElement;
  rt.lang=S.lang;rt.dir=S.lang==="ar"?"rtl":"ltr";
  var h=V.view==="home"?home(ui):V.view==="lec"?lecView(ui):V.view==="backup"?bkView(ui):V.view==="glossary"?glView(ui):V.view==="sess"?sessView(ui):revView(ui);
  $("#app").innerHTML=h;
  var old=document.querySelector(".tabs");if(old)old.remove();
  document.body.insertAdjacentHTML("beforeend",nav(ui));
}
function top(){window.scrollTo(0,0);}

/* ---------- Actions ---------- */
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-act]");if(!b||b.disabled)return;
  var a=b.getAttribute("data-act");
  if(a==="lang"){S.lang=S.lang==="ar"?"en":"ar";save();render();}
  else if(a==="open"){
    var i=+b.getAttribute("data-i"),l=LECS[i];
    location.href=lecUrl(l);
  }
  else if(a==="goto"){
    location.href=lecUrl(LECS[+b.getAttribute("data-i")])+"#card="+encodeURIComponent(b.getAttribute("data-id"));
  }
  else if(a==="pick"){
    var l2=LECS[V.lec],c2=l2.cards[V.idx],qi2=+b.getAttribute("data-qi"),pj=+b.getAttribute("data-j"),q2=asList(c2.q)[qi2];
    V.pick[qi2]=pj;
    if(q2)S.q[qkey(cid(l2,V.idx),qi2)]={ok:pj===q2.a,d:today()};   /* latest result only */
    if(allAnswered(c2))markDone(l2,V.idx);
    touchStreak();save();render();
  }
  else if(a==="next"){
    var l3=LECS[V.lec],n=l3.cards.length;
    if(!asList(l3.cards[V.idx].q).length){markDone(l3,V.idx);save();}
    if(V.idx<n-1){V.idx++;V.pick={};render();top();}else{goHome();}
  }
  else if(a==="prev"){if(V.idx>0){V.idx--;V.pick={};render();top();}}
  else if(a==="home"||a==="tabhome"){goHome();}
  else if(a==="tabrev"){if(PG.lec){location.href="../index.html#review";return;}V.view="review";V.q=dueKeys();V.show=false;V.practice=false;V.reviewed=false;render();top();}
  else if(a==="tabglos"||a==="glossary"){if(PG.lec){location.href="../index.html#glossary";return;}V.view="glossary";render();top();}
  else if(a==="mistakes"||a==="mixed"){startSess(a);render();top();}
  else if(a==="spick"){
    var ss=V.ss,sk=ss&&ss.keys[ss.i],sr=sk&&qOf(sk);
    if(!sr||ss.p!==undefined)return;
    var sj=+b.getAttribute("data-j"),sok=sj===sr.q.a;
    ss.p=sj;ss.res[ss.i]=sok;if(sok)ss.ok++;
    S.q[sk]={ok:sok,d:today()};touchStreak();save();render();
  }
  else if(a==="snext"){var ss2=V.ss;if(ss2&&ss2.p!==undefined){ss2.i++;ss2.p=undefined;render();top();}}
  else if(a==="practice"){V.q=shuffle(fcKeysAll());V.practice=true;V.show=false;V.reviewed=false;render();top();}
  else if(a==="backup"){V.view="backup";V.msg="";render();top();}
  else if(a==="restore"){
    var box=$("#rs"),ui2=UI[S.lang];
    try{var o=JSON.parse(box.value);if(!o||typeof o!=="object"||!o.done||!o.fc||typeof o.done!=="object"||typeof o.fc!=="object")throw 1;
      if(o.q!=null&&(typeof o.q!=="object"||Array.isArray(o.q)))throw 1;
      var mg=migrate(o.done,o.fc);   /* accepts both old ("3:2") and new (card id) backups */
      S.done=mg.done;S.fc=mg.fc;
      if(o.q!=null)S.q=cleanQ(o.q);  /* backups made before q existed have none: keep the current results */
      if(o.streak)S.streak=o.streak;save();V.msg=ui2.bkOk;V.msgOk=true;}
    catch(err){V.msg=ui2.bkBad;V.msgOk=false;}
    render();
  }
  else if(a==="show"){V.show=true;render();}
  else if(a==="knew"||a==="again"){
    var key=V.q.shift(),f=S.fc[key];
    if(!V.practice&&f){
      if(a==="knew"){f.box=Math.min(f.box+1,INT.length-1);f.due=today()+INT[f.box];}
      else{f.box=0;f.due=today()+1;}
      touchStreak();save();
    }
    V.show=false;V.reviewed=true;render();top();
  }
});
document.addEventListener("input",function(e){
  var t=e.target;if(!t||t.id!=="sq")return;
  V.sq=t.value;
  var sr=$("#sr"),ll=$("#ll");
  if(sr)sr.innerHTML=searchHtml(UI[S.lang]);
  if(ll)ll.hidden=!!V.sq.trim();
});
render();
})();
