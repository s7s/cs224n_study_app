/* Lecture 8: Transformers
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L8 fig: BPE merges replayed on an unseen word */
function bpeFig(){
  var s='',x0=110,c=36,i,j,x,tk,w,
      rows=[
        {y:24,lab:'start',tk:[['l',1],['o',1],['w',1],['e',1],['s',1],['t',1]]},
        {y:90,lab:'merge (w,e)',tk:[['l',1],['o',1],['we',2],['s',1],['t',1]]},
        {y:156,lab:'merge (l,o)',tk:[['lo',2],['we',2],['s',1],['t',1]]}
      ];
  for(i=0;i<rows.length;i++){
    s+=T(14,rows[i].y+20,rows[i].lab,'tm','start','font-size:10.5px');
    x=x0;
    for(j=0;j<rows[i].tk.length;j++){
      tk=rows[i].tk[j];w=tk[1]*c;
      s+=RECT(x+1,rows[i].y,w-2,32,tk[1]>1?'var(--acs)':'var(--sf)',tk[1]>1?'var(--ac)':'var(--ln)',7,1.6)+
         T(x+w/2,rows[i].y+21,tk[0],'tb','middle','font-size:12.5px');
      x+=w;
    }
    if(i<rows.length-1)s+=AR(x0+3*c,rows[i].y+32,x0+3*c,rows[i+1].y,'mu','mM');
  }
  return s;
}

var FIG_BPE=fig(200,bpeFig(),
  B('نطبّق الدمجات المتعلَّمة بالترتيب على كلمة جديدة (lowest): الأول (w,e) وبعدين (l,o)، والنتيجة 4 tokens من غير OOV.',
    'We replay the learned merges in order on a new word (lowest): first (w,e), then (l,o), giving 4 tokens with no OOV.'));

/* L8 fig: scaled dot-product attention pipeline */
function sdpaFig(){
  var s='',i;
  var BX=[['Q K^T',20],['÷ √d_k',104],['softmax',188],['× V',272]];
  s+=T(180,18,'Attention(Q,K,V) = softmax(Q K^T / √d_k) V','tb','middle','font-size:11.5px');
  for(i=0;i<4;i++){
    s+=RECT(BX[i][1],52,68,38,i===1?'var(--acs)':'var(--sf)',i===1?'var(--ac)':'var(--ok)',9,1.8)+T(BX[i][1]+34,76,BX[i][0],'tb','middle','font-size:11.5px');
    if(i<3)s+=AL(BX[i][1]+68,71,BX[i+1][1]-1,71,'ac','mA');
  }
  s+=T(54,116,'n × n','tm','middle','font-size:11px')+T(138,116,'scale','tm','middle','font-size:11px')+
     T(222,116,'rows → 1','tm','middle','font-size:11px')+T(306,116,'n × d_v','tm','middle','font-size:11px');
  s+=RECT(20,140,320,56,'var(--sf)','var(--ln)',8,1.2)+
     T(30,160,'Q = X W_Q','','start','font-size:11.5px')+T(135,160,'K = X W_K','','start','font-size:11.5px')+T(240,160,'V = X W_V','','start','font-size:11.5px')+
     T(30,180,'X: n × d   (one row per word)','tm','start','font-size:11px');
  return s;
}

var FIG_SDPA=fig(212,sdpaFig(),
  B('الـ scaled dot-product attention على مراحل: ضرب Q في K^T، قسمة على الجذر التربيعي لـ d_k، softmax، وبعدين الضرب في V. كلهم عمليات مصفوفات بتتحسب مرة واحدة لكل الكلمات.',
    'Scaled dot-product attention in stages: multiply Q by K^T, divide by the square root of d_k, apply softmax, then multiply by V. All are matrix operations computed once for all words.'));

/* L8 fig: multi-head attention */
function mhaFig(){
  var s='',i,HX=[20,132,244],CE=[140,180,220];
  s+=RECT(110,10,140,28,'var(--sf)','var(--ac)',8,1.8)+T(180,29,'x  (n × d)','tb','middle','font-size:11.5px');
  for(i=0;i<3;i++){
    s+=AL(180,38,HX[i]+48,70,'mu','mM');
    s+=RECT(HX[i],72,96,38,'var(--acs)','var(--ac)',9,1.8)+T(HX[i]+48,89,'head '+(i+1),'tb','middle','font-size:11.5px')+T(HX[i]+48,103,'d_k = d / h','tm','middle','font-size:10.5px');
    s+=AL(HX[i]+48,110,CE[i],141,'ok','mG');
  }
  s+=RECT(100,142,160,28,'var(--sf)','var(--ok)',8,1.8)+T(180,161,'concat → (n × d)','tb','middle','font-size:11.5px');
  s+=AL(180,170,180,190,'ac','mA');
  s+=RECT(100,192,160,28,'var(--sf)','var(--ac)',8,1.8)+T(180,211,'× W_O → (n × d)','tb','middle','font-size:11.5px');
  return s;
}

var FIG_MHA=fig(232,mhaFig(),
  B('كل head بيشتغل على جزء أصغر من البُعد (d_k = d / h) وبيدوّر على علاقة مختلفة. النواتج بتتلصق وبتعدّي على W_O.',
    'Each head works on a smaller slice of the dimension (d_k = d / h) and looks for a different relation. The outputs are concatenated and passed through W_O.'));

/* L8 fig: MHA vs GQA vs MQA */
function gqaFig(){
  var s='',CX=[60,180,300],NM=['MHA','GQA (g = 2)','MQA'],KV=[4,2,1],LB=['4 K/V sets','2 K/V sets','1 K/V set'],
      k,i,n,gw,gx,qx;
  s+=T(180,34,'dots = query heads,  boxes = K/V heads','tm','middle','font-size:10.5px');
  for(k=0;k<3;k++){
    n=KV[k];gw=88/n;
    s+=T(CX[k],16,NM[k],'tb','middle','font-size:11.5px');
    for(i=0;i<n;i++){
      gx=CX[k]-44+gw*(i+0.5);
      s+=RECT(gx-gw/2+2,124,gw-4,26,'var(--okbg)','var(--ok)',6,1.6);
    }
    for(i=0;i<4;i++){
      qx=CX[k]-33+i*22;
      gx=CX[k]-44+gw*(Math.floor(i/(4/n))+0.5);
      s+='<line x1="'+qx+'" y1="69" x2="'+gx.toFixed(1)+'" y2="124" style="stroke:var(--mu);stroke-width:1.3"/>';
    }
    for(i=0;i<4;i++)s+=DOT(CX[k]-33+i*22,62,'ac',7);
    s+=T(CX[k],170,LB[k],'tm','middle','font-size:10.5px');
  }
  return s;
}

var FIG_GQA=fig(184,gqaFig(),
  B('الدواير هي الـ query heads والمربعات هي الـ K/V heads. كل ما نقلّل عدد الـ K/V sets الـ KV cache بيصغر، ولسه عندنا 4 query heads.',
    'The dots are query heads and the boxes are K/V heads. The fewer K/V sets, the smaller the KV cache, while we still have 4 query heads.'));

/* L8 fig: sinusoidal positional encodings */
function peFig(){
  var s='',x0=40,y0=76,W=300,H=18,N=240,i,k,pts,col=['ac','ok','no'],per=[8,24,80],lab=['dim pair 0 (fast)','dim pair 1','dim pair 2 (slow)'],yy,xl;
  for(k=0;k<3;k++){
    yy=y0+k*70;
    s+='<line x1="'+x0+'" y1="'+yy+'" x2="'+(x0+W)+'" y2="'+yy+'" style="stroke:var(--ln);stroke-width:1"/>';
    pts=[];
    for(i=0;i<=N;i++)pts.push((x0+i*W/N).toFixed(1)+','+(yy-Math.sin(2*Math.PI*(i*64/N)/per[k])*H).toFixed(1));
    s+='<polyline points="'+pts.join(' ')+'" style="fill:none;stroke:var(--'+col[k]+');stroke-width:2"/>';
    s+=T(x0,yy-26,lab[k],'tm','start','font-size:10.5px');
  }
  s+=T(x0,18,'sin(pos / 10000^(2i/d))','tb','start','font-size:11.5px')+T(x0+W,18,'pos →','tm','end','font-size:11px');
  xl=x0+32*W/64;
  s+='<line x1="'+xl+'" y1="36" x2="'+xl+'" y2="236" style="stroke:var(--mu);stroke-width:1;stroke-dasharray:3 3"/>'+T(xl+4,250,'one position','tm','start','font-size:10.5px');
  return s;
}

var FIG_PE=fig(262,peFig(),
  B('كل زوج أبعاد بيتذبذب بسرعة مختلفة (سريع، متوسط، بطيء). مجموع القيم عند أي موضع بيطلع بصمة فريدة للموضع ده.',
    'Each pair of dimensions oscillates at a different speed (fast, medium, slow). Together, the values at any position form a unique fingerprint for that position.'));

/* L8 fig: pre-LN Transformer block */
function blockFig(){
  var s='',cx=150;
  function box(y,t,f,st){return RECT(cx-60,y,120,30,f,st,8,1.8)+T(cx,y+20,t,'tb','middle','font-size:11.5px');}
  function plus(y){return '<circle cx="'+cx+'" cy="'+y+'" r="11" style="fill:var(--sf);stroke:var(--ok);stroke-width:2"/>'+T(cx,y+5,'+','tb','middle');}
  s+=T(cx,14,'x','tb','middle');
  s+=AL(cx,18,cx,40,'mu','mM');
  s+=box(42,'LayerNorm','var(--sf)','var(--mu)');
  s+=AL(cx,72,cx,90,'mu','mM');
  s+=box(92,'Multi-head attn','var(--acs)','var(--ac)');
  s+=AL(cx,122,cx,141,'mu','mM');
  s+=plus(152);
  s+=AL(cx,163,cx,180,'mu','mM');
  s+=box(182,'LayerNorm','var(--sf)','var(--mu)');
  s+=AL(cx,212,cx,230,'mu','mM');
  s+=box(232,'FFN','var(--acs)','var(--ac)');
  s+=AL(cx,262,cx,281,'mu','mM');
  s+=plus(292);
  s+=AL(cx,303,cx,320,'mu','mM');
  s+=T(cx,336,'output','tb','middle');
  /* residual skip connections */
  s+='<path d="M'+cx+' 30 H'+(cx+105)+' V152 H'+(cx+11)+'" style="fill:none;stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4" marker-end="url(#mG)"/>';
  s+='<path d="M'+cx+' 170 H'+(cx+105)+' V292 H'+(cx+11)+'" style="fill:none;stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4" marker-end="url(#mG)"/>';
  s+=T(cx+112,100,'skip','tm','start','font-size:10.5px');
  s+=T(cx+112,230,'skip','tm','start','font-size:10.5px');
  return s;
}

var FIG_BLOCK=fig(346,blockFig(),
  B('الـ block: LayerNorm ثم attention ثم جمع مع المدخل (residual)، وبعدين LayerNorm ثم FFN ثم residual تاني. الخط المقطّع هو الـ skip connection.',
    'The block: LayerNorm, then attention, then add the input back (residual), then LayerNorm, then FFN, then another residual. The dashed line is the skip connection.'));

/* L8 fig: Post-LN vs Pre-LN */
function normFig(){
  var s='',a=90,b=270;
  function box(cx,y,t,f,st){return RECT(cx-45,y,90,28,f,st,8,1.8)+T(cx,y+19,t,'tb','middle','font-size:11.5px');}
  function plus(cx,y){return '<circle cx="'+cx+'" cy="'+y+'" r="11" style="fill:var(--sf);stroke:var(--ok);stroke-width:2"/>'+T(cx,y+5,'+','tb','middle');}
  function skip(cx,y){return '<path d="M'+cx+' 46 H'+(cx+62)+' V'+y+' H'+(cx+11)+'" style="fill:none;stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4" marker-end="url(#mG)"/>';}
  /* Post-LN: x -> Attention -> + -> LayerNorm */
  s+=T(a,14,'Post-LN','tb','middle','font-size:11.5px')+T(a,36,'x','tb','middle');
  s+=AL(a,40,a,56,'mu','mM')+box(a,58,'Attention','var(--acs)','var(--ac)');
  s+=AL(a,86,a,106,'mu','mM')+plus(a,118);
  s+=AL(a,129,a,146,'mu','mM')+box(a,148,'LayerNorm','var(--sf)','var(--mu)');
  s+=AL(a,176,a,190,'mu','mM')+T(a,204,'out','tb','middle');
  s+=skip(a,118);
  s+=T(a,224,'LN on the main path','tm','middle','font-size:10.5px');
  /* Pre-LN: x -> LayerNorm -> Attention -> + */
  s+=T(b,14,'Pre-LN','tb','middle','font-size:11.5px')+T(b,36,'x','tb','middle');
  s+=AL(b,40,b,56,'mu','mM')+box(b,58,'LayerNorm','var(--sf)','var(--mu)');
  s+=AL(b,86,b,104,'mu','mM')+box(b,106,'Attention','var(--acs)','var(--ac)');
  s+=AL(b,134,b,150,'mu','mM')+plus(b,162);
  s+=AL(b,173,b,190,'mu','mM')+T(b,204,'out','tb','middle');
  s+=skip(b,162);
  s+=T(b,224,'clean skip path','tm','middle','font-size:10.5px');
  return s;
}

var FIG_NORM=fig(236,normFig(),
  B('Post-LN: الـ LayerNorm بعد الجمع، فبيقع على المسار الرئيسي. Pre-LN: الـ LayerNorm جوه الفرع بس، فمسار الـ skip من المدخل للمخرج نضيف.',
    'Post-LN: the LayerNorm comes after the addition, so it sits on the main path. Pre-LN: the LayerNorm is only inside the branch, so the skip path from input to output stays clean.'));

/* L8 fig: causal mask */
function maskFig(){
  var W=['the','cat','sat','on','mat'],s='',c=40,x0=108,y0=44,i,j;
  s+=T(x0+2.5*c,16,'keys (attended to) →','tm','middle','font-size:11px');
  for(j=0;j<5;j++)s+=T(x0+j*c+c/2,y0-8,W[j],'tb','middle','font-size:11px');
  for(i=0;i<5;i++){
    s+=T(x0-8,y0+i*c+c/2+4,W[i],'tb','end','font-size:11px');
    for(j=0;j<5;j++){
      var x=x0+j*c,y=y0+i*c,ok=(j<=i);
      s+=RECT(x,y,c,c,ok?'var(--okbg)':'var(--nobg)','var(--ln)',0,1)+T(x+c/2,y+c/2+4,ok?'ok':'-∞',ok?'tb':'tm','middle','font-size:11px'+(ok?';fill:var(--ok)':';fill:var(--no)'));
    }
  }
  s+=T(20,y0-8,'query ↓','tm','start','font-size:11px');
  return s;
}

var FIG_MASK=fig(254,maskFig(),
  B('الـ causal mask: كل كلمة (صف) بتشوف نفسها والكلمات اللي قبلها بس. الخانات الحمرا بتتحط فيها -∞ قبل الـ softmax فوزنها بيبقى صفر.',
    'The causal mask: each word (row) sees itself and the words before it only. The red cells get -∞ before the softmax, so their weight becomes zero.'));

/* L8 fig: cost, attention n^2 d vs FFN n d^2 */
function costFig(){
  var s='',x0=44,y0=190,W=290,H=150,i,a=[],f=[],n,u;
  s+='<line x1="'+x0+'" y1="'+y0+'" x2="'+(x0+W)+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>'+
     '<line x1="'+x0+'" y1="'+(y0-H)+'" x2="'+x0+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>';
  for(i=0;i<=40;i++){
    n=i/40*2;
    a.push((x0+n/2*W).toFixed(1)+','+(y0-Math.min(n*n,4)/4*H).toFixed(1));
    f.push((x0+n/2*W).toFixed(1)+','+(y0-n/4*H).toFixed(1));
  }
  s+='<polyline points="'+f.join(' ')+'" style="fill:none;stroke:var(--ok);stroke-width:2.4"/>';
  s+='<polyline points="'+a.join(' ')+'" style="fill:none;stroke:var(--no);stroke-width:2.4"/>';
  u=x0+W/2;
  s+='<line x1="'+u+'" y1="'+y0+'" x2="'+u+'" y2="'+(y0-H/4)+'" style="stroke:var(--mu);stroke-width:1;stroke-dasharray:3 3"/>'+DOT(u,y0-H/4,'ink',4);
  s+=T(u,y0+16,'n = d','tb','middle','font-size:11px')+T(x0+W,y0+16,'n →','tm','end','font-size:11px')+T(x0+4,y0-H-4,'cost','tm','start','font-size:11px');
  s+=T(x0+14,y0-H+10,'attention: n² d','tb','start','font-size:11px;fill:var(--no)')+T(x0+14,y0-H+26,'FFN: n d²','tb','start','font-size:11px;fill:var(--ok)');
  return s;
}

var FIG_COST=fig(222,costFig(),
  B('تكلفة الـ attention بتزيد بالتربيع مع طول الجملة n، وتكلفة الـ FFN بتزيد خطيًا. الاتنين بيتساووا لما n = d، وبعد كده الـ attention هو اللي بيحكم.',
    'Attention cost grows quadratically with sequence length n, while FFN cost grows linearly. They are equal at n = d, and beyond that attention dominates.'));

/* L8 additions: numbers and figures. Every number shown in the new cards is computed here. */
function l8fmt(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function l8esc(c){return c.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function l8utf8(s){var n=0,i,c;for(i=0;i<s.length;i++){c=s.charCodeAt(i);n+=c<128?1:(c<2048?2:3);}return n;}

/* fertility example (assumed illustrative values, not a measured tokenizer) */
var L8F=(function(){
  var o={words:6,tokA:9,tokB:18,ctx:8192,price:2};
  o.fA=o.tokA/o.words;o.fB=o.tokB/o.words;o.ratio=o.fB/o.fA;
  o.costA=o.fA*o.price;o.costB=o.fB*o.price;
  o.fitA=Math.floor(o.ctx/o.fA);o.fitB=Math.floor(o.ctx/o.fB);
  return o;
})();

/* learning-rate schedule: linear warmup then cosine decay to a floor */
var L8LR={peak:3e-4,warm:2000,total:100000,minF:0.1};
function l8lr(s){
  var P=L8LR,m=P.peak*P.minF,p;
  if(s<P.warm)return P.peak*s/P.warm;
  p=(s-P.warm)/(P.total-P.warm);
  return m+0.5*(P.peak-m)*(1+Math.cos(Math.PI*p));
}

/* gradient clipping example */
var L8G=(function(){
  var g=[3,4],c=1,n=Math.sqrt(g[0]*g[0]+g[1]*g[1]),f=Math.min(1,c/n);
  return {n:n,c:c,f:f,out:[g[0]*f,g[1]*f]};
})();

var L8S={
  fA:L8F.fA.toFixed(1),fB:L8F.fB.toFixed(1),ratio:String(L8F.ratio),
  cA:'$'+L8F.costA.toFixed(2),cB:'$'+L8F.costB.toFixed(2),
  ctx:l8fmt(L8F.ctx),fitA:l8fmt(L8F.fitA),fitB:l8fmt(L8F.fitB),
  ctxX:l8fmt(L8F.ctx*L8F.fB),fitHalf:l8fmt(L8F.fitB/2),
  price:String(L8F.price),
  by1:String(l8utf8('hello')),by2:String(l8utf8('مرحبا')),by3:String(l8utf8('你好')),
  pk:L8LR.peak.toExponential(0),fl:(L8LR.peak*L8LR.minF).toExponential(0),warm:l8fmt(L8LR.warm),tot:l8fmt(L8LR.total),
  l500:l8lr(500).toExponential(1),l1000:l8lr(1000).toExponential(1),l2000:l8lr(2000).toExponential(0),
  lmid:l8lr((L8LR.warm+L8LR.total)/2).toExponential(2),mid:l8fmt((L8LR.warm+L8LR.total)/2),
  lend:l8lr(L8LR.total).toExponential(0),linv:(L8LR.peak*L8LR.warm/500).toExponential(1),
  gn:String(L8G.n),gf:String(L8G.f),go:'['+L8G.out[0].toFixed(1)+', '+L8G.out[1].toFixed(1)+']',
  mhaP:l8fmt(4*512*512)
};

/* L8 fig: fertility, the same sentence as tokens in two languages */
function fertFig(){
  var s='',x0=12,fs='font-size:11px';
  function row(y,lab,per){
    var x=x0,w,k;
    s+=T(x0,y-8,lab,'tb','start',fs);
    for(w=0;w<per.length;w++){
      for(k=0;k<per[w];k++){s+=RECT(x,y,13,15,w%2?'var(--ac)':'var(--sf)','var(--ln)',3,1);x+=14;}
      x+=7;
    }
  }
  row(34,'Language A: '+L8F.tokA+' tokens / '+L8F.words+' words = '+L8S.fA,[2,1,2,1,2,1]);
  row(84,'Language B: '+L8F.tokB+' tokens / '+L8F.words+' words = '+L8S.fB,[3,3,3,3,3,3]);
  s+=T(x0,130,'same meaning, '+L8S.ratio+'x the tokens in B','tm','start',fs);
  return s;
}

var FIG_FERT=fig(146,fertFig(),
  B('نفس الجملة ('+L8F.words+' كلمات): بتتقسم لـ '+L8F.tokA+' tokens في لغة A و '+L8F.tokB+' token في لغة B. كل لون بيمثّل كلمة. الأرقام افتراضية للتوضيح.',
    'The same '+L8F.words+'-word sentence becomes '+L8F.tokA+' tokens in language A and '+L8F.tokB+' tokens in language B. Each colour is one word. The numbers are illustrative.'));

/* L8 fig: learning-rate schedule, warmup then cosine decay */
function lrFig(){
  var s='',x0=44,y0=160,W=290,H=110,i,pts=[],P=L8LR,fs='font-size:11px',xw=x0+P.warm/P.total*W;
  s+='<line x1="'+x0+'" y1="'+y0+'" x2="'+(x0+W)+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>'+
     '<line x1="'+x0+'" y1="'+(y0-H)+'" x2="'+x0+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>';
  for(i=0;i<=100;i++)pts.push((x0+i*1000/P.total*W).toFixed(1)+','+(y0-l8lr(i*1000)/P.peak*H).toFixed(1));
  s+='<polyline points="'+pts.join(' ')+'" style="fill:none;stroke:var(--ac);stroke-width:2.4"/>';
  s+='<line x1="'+xw.toFixed(1)+'" y1="'+y0+'" x2="'+xw.toFixed(1)+'" y2="'+(y0-H)+'" style="stroke:var(--mu);stroke-width:1;stroke-dasharray:3 3"/>'+DOT(xw.toFixed(1),y0-H,'ink',4);
  s+=T(xw+8,y0-H+4,'peak '+L8S.pk,'tb','start',fs);
  s+=T(x0+W,y0-P.minF*H-8,'floor '+L8S.fl,'tm','end',fs);
  s+=T(xw+4,y0+16,'warmup '+L8S.warm,'tb','start',fs)+T(x0+W,y0+16,'step →','tm','end',fs)+T(x0+4,y0-H-8,'lr','tm','start',fs);
  return s;
}

var FIG_LR=fig(184,lrFig(),
  B('جدول الـ learning rate: بيطلع خطيًا من الصفر لحد القمة في أول '+l8fmt(L8LR.warm)+' step، وبعدين بينزل على شكل cosine لحد أرضية قيمتها '+(L8LR.minF*100)+'% من القمة.',
    'The learning-rate schedule: it rises linearly from zero to the peak over the first '+l8fmt(L8LR.warm)+' steps, then falls along a cosine to a floor of '+(L8LR.minF*100)+'% of the peak.'));

/* code shown in the two code cards (the exact text is what gets tested) */
var L8CODE_ATTN=[
'import math, torch',
'import torch.nn as nn',
'import torch.nn.functional as F',
'',
'class Head(nn.Module):',
'  def __init__(self, d, dk):',
'    super().__init__()',
'    self.qkv = nn.Linear(d, 3*dk, bias=False)',
'    self.dk = dk',
'',
'  def forward(self, x):   # (B, T, d)',
'    B, T, _ = x.shape',
'    q, k, v = self.qkv(x).chunk(3, -1)',
'    s = q @ k.transpose(-2, -1)  # (B,T,T)',
'    s = s / math.sqrt(self.dk)',
'    f = torch.ones(T, T, device=x.device)',
'    m = f.triu(1) > 0     # future cells',
'    s = s.masked_fill(m, -torch.inf)',
'    a = F.softmax(s, dim=-1)   # (B,T,T)',
'    return a @ v               # (B,T,dk)'
].join('\n');

var L8CODE_MHA=[
'class MHA(nn.Module):',
'  def __init__(self, d, h):',
'    super().__init__()',
'    self.h, self.dk = h, d // h',
'    self.qkv = nn.Linear(d, 3*d, bias=False)',
'    self.o = nn.Linear(d, d, bias=False)',
'',
'  def split(self, t):     # (B, T, d)',
'    B, T, _ = t.shape',
'    t = t.reshape(B, T, self.h, self.dk)',
'    return t.transpose(1, 2)  # (B,h,T,dk)',
'',
'  def forward(self, x):   # (B, T, d)',
'    B, T, d = x.shape',
'    q, k, v = self.qkv(x).chunk(3, -1)',
'    q, k, v = map(self.split, (q, k, v))',
'    s = q @ k.transpose(-2, -1)  # (B,h,T,T)',
'    s = s / math.sqrt(self.dk)',
'    f = torch.ones(T, T, device=x.device)',
'    m = f.triu(1) > 0',
'    s = s.masked_fill(m, -torch.inf)',
'    y = F.softmax(s, -1) @ v    # (B,h,T,dk)',
'    y = y.transpose(1, 2)       # (B,T,h,dk)',
'    return self.o(y.reshape(B, T, d))'
].join('\n');

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:8,t:B("Transformers","Transformers"),cards:[

{id:"l8-tokenization",t:B("الـ tokenization: من النص لـ tokens","Tokenization: from text to tokens"),
 b:cat(B('<p>قبل أي attention لازم النص يتحوّل لـ <mark>tokens</mark>: قطع من vocabulary ثابتة والموديل بيتعامل معاها كـ IDs. لو الـ token هو الكلمة الكاملة، الـ vocabulary بتبقى ضخمة وأي كلمة جديدة بتتحوّل لـ <code>&lt;unk&gt;</code> (مشكلة الـ <mark>OOV</mark>). ولو هو الحرف، مفيش OOV بس الجملة بتطول جدًا، وتكلفة الـ attention بتزيد بـ n². الحل الوسط: <mark>subword tokenization</mark>: الكلمات الشائعة تفضل كاملة والنادرة تتقطّع لقطع أصغر.</p>',
         '<p>Before any attention, text must become <mark>tokens</mark>: pieces from a fixed vocabulary that the model handles as IDs. If a token is a whole word, the vocabulary gets huge and any new word becomes <code>&lt;unk&gt;</code> (the <mark>OOV</mark> problem). If it is a character, there is no OOV but sequences get very long, and attention cost grows with n². The middle path is <mark>subword tokenization</mark>: common words stay whole and rare words are split into smaller pieces.</p>'),
       FIG_BPE,
       B('<p>أشهر طريقة هي <mark>BPE</mark> (Byte Pair Encoding): نبدأ من الحروف، ونكرر دمج أكتر زوج متجاور تكرارًا في token جديد. مثال: <code>low</code> ×5 و <code>lower</code> ×2 و <code>newest</code> ×6 و <code>wider</code> ×3:</p>'+
         '<div class="m">(w,e): 8 times  -> we\n(l,o): 7 times  -> lo</div>'+
         '<p>الدمجات بتتطبّق بنفس الترتيب على أي نص جديد، فكلمة <code>lowest</code> اللي مش في الداتا بتتقسّم لـ <code>[lo, we, s, t]</code>. الـ <mark>WordPiece</mark> (في BERT) شبهها بس بتختار الدمج اللي بيزوّد الـ likelihood. والـ <mark>SentencePiece</mark> مكتبة بتشتغل على النص الخام (المسافة رمز عادي) وبتدعم BPE. و GPT-2 بيطبّق BPE على الـ bytes فمفيش OOV. والـ vocabularies الشائعة فيها من 30 ألف لـ 100 ألف token.</p>',
         '<p>The most popular method is <mark>BPE</mark> (Byte Pair Encoding): start from characters and repeatedly merge the most frequent adjacent pair into a new token. Example: <code>low</code> ×5, <code>lower</code> ×2, <code>newest</code> ×6 and <code>wider</code> ×3:</p>'+
         '<div class="m">(w,e): 8 times  -> we\n(l,o): 7 times  -> lo</div>'+
         '<p>The merges are replayed in the same order on any new text, so the unseen word <code>lowest</code> is split into <code>[lo, we, s, t]</code>. <mark>WordPiece</mark> (in BERT) is similar but picks the merge that raises the likelihood. <mark>SentencePiece</mark> is a library that works on raw text (the space is an ordinary symbol) and supports BPE. GPT-2 applies BPE to bytes, so it has no OOV. Typical vocabularies hold 30 to 100 thousand tokens.</p>')),
 q:[
   CQ("ليه بنستخدم subword tokenization بدل الكلمات الكاملة؟","Why use subword tokenization instead of whole words?",
      [["عشان نكبّر الـ vocabulary لملايين الكلمات","To grow the vocabulary to millions of words"],["عشان نمنع الموديل من قراءة الأرقام","To stop the model from reading numbers"],["عشان نستغنى عن الـ positional encodings","To get rid of positional encodings"],["عشان نتخلص من الـ OOV من غير ما الجمل تطول زي الحروف","To avoid OOV without making sequences as long as with characters"]],
      3,"القطع الصغيرة بتغطي أي كلمة جديدة، والكلمات الشائعة بتفضل كاملة فالجملة ما بتطولش.","Small pieces cover any new word, and common words stay whole so the sequence does not get long."),
   CQ("لو دمجات BPE المتعلَّمة بالترتيب هي (w,e) وبعدين (l,o)، الكلمة lowest بتتقسّم لإيه؟","If the learned BPE merges are (w,e) then (l,o), how is the word lowest split?",
      [["[low, est]","[low, est]"],["[l, o, w, e, s, t]","[l, o, w, e, s, t]"],["[lo, we, s, t]","[lo, we, s, t]"],["[lowest]","[lowest]"]],
      2,"الدمج الأول بيحوّل w و e لـ we، والتاني بيحوّل l و o لـ lo، و s و t بيفضلوا زي ما هم.","The first merge turns w and e into we, the second turns l and o into lo, and s and t stay as they are.")
 ],
 f:[
   CF("إيه فكرة الـ BPE؟","What is the idea of BPE?",
      "نبدأ من الحروف ونكرر دمج أكتر زوج متجاور تكرارًا في token جديد، وبنطبّق الدمجات بنفس الترتيب على أي نص جديد.","Start from characters and repeatedly merge the most frequent adjacent pair into a new token; replay the merges in the same order on any new text."),
   CF("إيه الفرق بين BPE و WordPiece و SentencePiece؟","How do BPE, WordPiece and SentencePiece differ?",
      "BPE بتدمج الزوج الأكتر تكرارًا. WordPiece بتختار الدمج اللي بيزوّد الـ likelihood. SentencePiece مكتبة بتشتغل على النص الخام وبتدعم BPE.","BPE merges the most frequent pair. WordPiece picks the merge that raises the likelihood. SentencePiece is a library that works on raw text and supports BPE.")
 ],
 terms:[
   {t:B("Token","Token"),
    d:B("قطعة من الـ vocabulary بيشتغل عليها الموديل. مش لازم تكون كلمة: ممكن تكون جزء من كلمة أو رقم أو رمز.","A piece from the vocabulary that the model works on. It is not always a word: it can be part of a word, a digit or a symbol.")},
   {t:B("OOV (out-of-vocabulary)","OOV (out-of-vocabulary)"),
 d:B("Out-of-vocabulary: كلمة مش موجودة في الـ vocabulary، فمالهاش vector.","Out-of-vocabulary: a word that is not in the vocabulary, so it has no vector.")},
   {t:B("Subword tokenization","Subword tokenization"),
    d:B("تقطيع النص لقطع أصغر من الكلمة: الشائع يفضل كامل والنادر يتقسّم.","Splitting text into pieces smaller than a word: common words stay whole and rare ones are split.")},
   {t:B("BPE (Byte Pair Encoding)","BPE (Byte Pair Encoding)"),
 d:B("Byte Pair Encoding: بندمج أكتر زوج رموز متجاور تكرارًا لحد حجم vocabulary معيّن.","Byte Pair Encoding: repeatedly merge the most frequent adjacent symbol pair until the vocabulary reaches a chosen size.")},
   {t:B("WordPiece","WordPiece"),
    d:B("شبه BPE بس بتختار الدمج اللي بيزوّد الـ likelihood. مستخدمة في BERT.","Similar to BPE but picks the merge that raises the likelihood. Used in BERT.")},
   {t:B("SentencePiece","SentencePiece"),
    d:B("مكتبة tokenization بتشتغل على النص الخام (المسافة رمز عادي) وبتدعم BPE.","A tokenization library that works on raw text (the space is an ordinary symbol) and supports BPE.")}
 ]},

{id:"l8-multilingual-tok",t:B("الـ tokenization ومتعدد اللغات: الـ fertility والتكلفة","Multilingual tokenization: fertility and cost"),
 b:cat(B('<p>نفس الجملة مش بتتكلف نفس عدد الـ tokens في كل لغة. المقياس اسمه <mark>fertility</mark>: متوسط عدد الـ tokens للكلمة الواحدة. الـ tokenizer اللي دمجاته اتعلّمت أغلبها من إنجليزي بيسيب الكلمات الإنجليزي كاملة، لكن بيقطّع اللغات التانية لقطع صغيرة كتير.</p>'+
         '<p>وده مهم لتلات أسباب: (1) <mark>التكلفة</mark>: الـ APIs بتحاسب بالـ token. (2) <mark>الـ latency</mark>: token واحد في كل خطوة، فـ tokens أكتر يعني خطوات أكتر. (3) <mark>السياق</mark>: الـ window بيتعدّ بالـ tokens، فكلمات أقل بتتسع، وتكلفة الـ attention بتزيد بـ n².</p>',
         '<p>The same sentence does not cost the same number of tokens in every language. The measure is <mark>fertility</mark>: the average number of tokens per word. A tokenizer whose merges were learned mostly from English keeps English words whole, but splits other languages into many small pieces.</p>'+
         '<p>This matters for three reasons: (1) <mark>cost</mark>: APIs charge per token. (2) <mark>latency</mark>: one token per step, so more tokens means more steps. (3) <mark>context</mark>: the window counts tokens, so fewer words fit, and attention cost grows with n².</p>'),
       FIG_FERT,
       B('<p>مثال بأرقام افتراضية (مش مقاسة): اللغة A لها fertility = '+L8S.fA+' واللغة B لها '+L8S.fB+'، يعني B محتاجة '+L8S.ratio+'× الـ tokens. بسعر '+L8S.price+' دولار لكل مليون token، مليون كلمة بتتكلف '+L8S.cA+' مقابل '+L8S.cB+'. وفي window حجمه '+L8S.ctx+' token بتتسع حوالي '+L8S.fitA+' كلمة مقابل '+L8S.fitB+'. </p>'+
         '<p><mark>Byte-level fallback</mark>: الـ vocabulary فيها الـ 256 قيمة بايت، فأي حرف مالوش token بيتشفّر كبايتات الـ UTF-8 ومفيش OOV. الـ UTF-8 بيستخدم بايت واحد للحرف الإنجليزي و2 لـ 3 بايت لكتير من الكتابات التانية: <code>hello</code> فيها '+L8S.by1+' بايت، و<code>مرحبا</code> فيها '+L8S.by2+'، و<code>你好</code> فيها '+L8S.by3+'. ومن غير دمجات متعلَّمة، كل بايت بيبقى token.</p>'+
         '<p>الـ vocabulary ميزانية ثابتة (مثلًا 100 ألف token) بتتقسم على كل اللغات: دمجات أكتر للغة معناها أقل للباقي. ونفس الشد في الموديل: <mark>curse of multilinguality</mark>. مع سعة ثابتة، زيادة اللغات بتفيد في الأول بالـ transfer وبعدين بتضر كل لغة. الحلول: vocabulary وموديل أكبر، وداتا متوازنة لتدريب الـ tokenizer.</p>'+
         '<p><mark>غلطة شائعة:</mark> نفترض إن الـ window الأكبر بيساع نفس النص في كل اللغات. هو بيتعدّ بالـ tokens مش بالكلمات.</p>',
         '<p>An example with assumed numbers (illustrative, not measured): language A has fertility = '+L8S.fA+' and language B has '+L8S.fB+', so B needs '+L8S.ratio+'x the tokens. At '+L8S.price+' dollars per million tokens, a million words cost '+L8S.cA+' versus '+L8S.cB+'. In a '+L8S.ctx+'-token window about '+L8S.fitA+' words fit versus '+L8S.fitB+'. </p>'+
         '<p><mark>Byte-level fallback</mark>: the vocabulary includes the 256 raw byte values, so any character without its own token is encoded as UTF-8 bytes and nothing is OOV. UTF-8 uses 1 byte for an English letter but 2 to 3 for many other scripts: <code>hello</code> is '+L8S.by1+' bytes, <code>مرحبا</code> is '+L8S.by2+', and <code>你好</code> is '+L8S.by3+'. Without learned merges, each byte is a token.</p>'+
         '<p>The vocabulary is a fixed budget (say 100K tokens) shared by all languages: more merges for one language leaves fewer for the others. The model has the same tension, the <mark>curse of multilinguality</mark>: with fixed capacity, adding languages first helps through transfer, then hurts each language. Fixes: a larger vocabulary and model, and balanced tokenizer training data.</p>'+
         '<p><mark>Common mistake:</mark> assuming a bigger window holds the same text in every language. It counts tokens, not words.</p>')),
 q:[
   CQ("إيه اللي بيخلّي الـ fertility عالية للغة معيّنة؟","What makes the fertility of a language high?",
      [["إن اللغة دي بتتكتب من اليمين لليسار","That the language is written right to left"],["إن الموديل أصغر من اللازم","That the model is too small"],["إن الـ tokenizer اتعلّم دمجات قليلة للغة دي، فكلماتها بتتقطّع لقطع صغيرة كتير","That the tokenizer learned few merges for it, so its words are cut into many small pieces"],["إن الـ attention بيتحسب بشكل مختلف للغة دي","That attention is computed differently for it"]],
      2,"الدمجات اتعلّمت من داتا أغلبها لغات تانية، فكلمات اللغة دي بتفضل قطع صغيرة (أو bytes).","The merges were learned from data dominated by other languages, so this language keeps many small pieces (or bytes)."),
   CQ("لو fertility = "+L8S.fB+" والـ window = "+L8S.ctx+" token، كام كلمة بتتسع تقريبًا؟","If fertility = "+L8S.fB+" and the window = "+L8S.ctx+" tokens, about how many words fit?",
      [[L8S.ctx,L8S.ctx],[L8S.fitB,L8S.fitB],[L8S.ctxX,L8S.ctxX],[L8S.fitHalf,L8S.fitHalf]],
      1,L8S.ctx+" ÷ "+L8S.fB+" ≈ "+L8S.fitB+" (بنقسم مش بنضرب، لأن كل كلمة بتاخد "+L8S.fB+" token).",L8S.ctx+" ÷ "+L8S.fB+" ≈ "+L8S.fitB+" (we divide, not multiply, because each word takes "+L8S.fB+" tokens).")
 ],
 f:[
   CF("إيه هو الـ fertility وليه بيهم؟","What is fertility and why does it matter?",
      "متوسط عدد الـ tokens للكلمة. كل ما زاد، التكلفة والـ latency زادوا وكلمات أقل بتتسع في الـ context window.","The average number of tokens per word. The higher it is, the higher the cost and latency, and the fewer words fit in the context window."),
   CF("إيه هو الـ curse of multilinguality؟","What is the curse of multilinguality?",
      "مع سعة موديل (و vocabulary) ثابتة، زيادة عدد اللغات بتفيد في الأول بالـ transfer وبعدين بتضر جودة كل لغة.","With fixed model (and vocabulary) capacity, adding languages first helps through transfer and then hurts the quality of each language.")
 ],
 terms:[
   {t:B("Fertility","Fertility"),
    d:B("متوسط عدد الـ tokens للكلمة الواحدة. بتختلف من لغة للتانية حسب الـ tokenizer.","The average number of tokens per word. It differs between languages for a given tokenizer.")},
   {t:B("Byte-level fallback","Byte-level fallback"),
    d:B("الـ vocabulary فيها الـ 256 بايت، فأي حرف مالوش token بيتشفّر كبايتات الـ UTF-8 بتاعته ومفيش OOV.","The vocabulary includes the 256 raw bytes, so a character with no token of its own is encoded as its UTF-8 bytes and nothing is OOV.")},
   {t:B("Curse of multilinguality","Curse of multilinguality"),
    d:B("مع سعة ثابتة، زيادة اللغات بتضر جودة كل لغة بعد حد معيّن.","With fixed capacity, adding more languages eventually hurts the quality of each language.")}
 ]},

{id:"l8-sdpa",t:B("الـ scaled dot-product attention","Scaled dot-product attention"),
 b:cat(B('<p>في المحاضرة اللي فاتت شفنا الـ query والـ key والـ value. الـ Transformer بيعمل نفس الحاجة لكل الكلمات <mark>مرة واحدة</mark> بمصفوفات: الـ <code>X</code> فيها صف لكل كلمة (n × d)، وبنطلّع منها التلات مصفوفات بأوزان متعلَّمة:</p>'+
         '<div class="m">Q = X W_Q\nK = X W_K\nV = X W_V\nAttention(Q,K,V) = softmax(Q K^T / sqrt(d_k)) V</div>',
         '<p>In the last lecture we met the query, key and value. The Transformer does the same thing for all words <mark>at once</mark> using matrices: <code>X</code> has one row per word (n × d), and from it we compute the three matrices with learned weights:</p>'+
         '<div class="m">Q = X W_Q\nK = X W_K\nV = X W_V\nAttention(Q,K,V) = softmax(Q K^T / sqrt(d_k)) V</div>'),
       FIG_SDPA,
       B('<p>الـ <code>Q K^T</code> بيطلّع مصفوفة n × n: الخانة (i, j) هي مدى اهتمام الكلمة i بالكلمة j. وبعدين بنقسم على <mark>sqrt(d_k)</mark>. السبب: لما d_k يكبر، الـ dot product قيمته بتكبر (تباينه تقريبًا d_k لو عناصر الـ vectors مستقلة بتباين 1)، فالـ softmax بيبقى حاد جدًا ويقرّب من one-hot، والـ gradient بيقرّب من الصفر.</p>'+
         '<p>مثال بأرقام: <code>q = [1, 2]</code> و <code>k1 = [1, 0]</code> و <code>k2 = [0, 1]</code> (يعني d_k = 2)، والـ scores هي <code>[1, 2]</code>:</p>'+
         '<div class="m">no scale:   softmax([1, 2])       = [0.27, 0.73]\nwith scale: softmax([0.71, 1.41]) = [0.33, 0.67]</div>'+
         '<p>الفرق هنا صغير لأن d_k صغير. مع d_k = 64 (الحجم الحقيقي) من غير القسمة الـ softmax بيتشبّع تقريبًا على كلمة واحدة.</p>',
         '<p>The <code>Q K^T</code> product gives an n × n matrix: cell (i, j) says how much word i attends to word j. Then we divide by <mark>sqrt(d_k)</mark>. The reason: as d_k grows, the dot product gets larger (its variance is roughly d_k if the vector entries are independent with variance 1), so the softmax becomes very sharp, close to one-hot, and the gradient approaches zero.</p>'+
         '<p>A numeric example: <code>q = [1, 2]</code>, <code>k1 = [1, 0]</code> and <code>k2 = [0, 1]</code> (so d_k = 2), and the scores are <code>[1, 2]</code>:</p>'+
         '<div class="m">no scale:   softmax([1, 2])       = [0.27, 0.73]\nwith scale: softmax([0.71, 1.41]) = [0.33, 0.67]</div>'+
         '<p>The difference is small here because d_k is small. With d_k = 64 (a realistic size) and no division, the softmax saturates almost entirely on one word.</p>')),
 q:[
   CQ("ليه بنقسم على sqrt(d_k) في الـ attention؟","Why do we divide by sqrt(d_k) in attention?",
      [["عشان نصغّر حجم الموديل","To shrink the model"],["عشان الـ softmax ما يبقاش حاد جدًا لما d_k يكبر وتضيع الـ gradients","So the softmax does not become too sharp as d_k grows and the gradients do not vanish"],["عشان نخلي كل الـ scores سالبة","To make all the scores negative"],["عشان نحافظ على ترتيب الكلمات","To preserve word order"]],
      1,"الـ dot products الكبيرة بتدفع الـ softmax للتشبّع، والقسمة بتخلّي تباينها قريب من 1.","Large dot products push the softmax into saturation, and the division keeps their variance near 1."),
   CQ("لو d_k = 64، الـ scores بتتقسم على كام قبل الـ softmax؟","If d_k = 64, what are the scores divided by before the softmax?",
   [["64","64"],["8","8"],["4,096","4,096"],["32","32"]],
   1,"sqrt(64) = 8.","sqrt(64) = 8.")
 ],
 f:[
   CF("إيه معادلة الـ scaled dot-product attention وليه الـ scaling؟","What is the scaled dot-product attention formula, and why the scaling?",
      "softmax(Q K^T / sqrt(d_k)) V. القسمة بتمنع الـ dot products الكبيرة من إنها تخلّي الـ softmax حاد وتقتل الـ gradient.","softmax(Q K^T / sqrt(d_k)) V. The division stops large dot products from making the softmax sharp and killing the gradient."),
   CF("إيه أشكال Q و K و V وناتج Q K^T؟","What are the shapes of Q, K, V and of Q K^T?",
   "Q و K بيطلعوا n × d_k، و V بيطلع n × d_v، كلهم من X (n × d) بأوزان متعلَّمة. و Q K^T بيطلع n × n.","Q and K are n × d_k and V is n × d_v, all computed from X (n × d) with learned weights. Q K^T is n × n.")
 ],
 terms:[
   {t:B("Scaled dot-product attention","Scaled dot-product attention"),
 d:B("<code>softmax(Q K^T / sqrt(d_k)) V</code>: مقارنة كل query بكل key، وبعدين خليط مرجّح من الـ values.","<code>softmax(Q K^T / sqrt(d_k)) V</code>: compare every query with every key, then take a weighted blend of the values.")},
   {t:B("Softmax saturation","Softmax saturation"),
 d:B("لما المدخلات تكبر، الـ softmax بيقرّب من one-hot والـ gradient بيقرّب من الصفر.","When the inputs get large, the softmax gets close to one-hot and the gradient gets close to zero.")}
 ]},

{id:"l8-multihead",t:B("Multi-head attention","Multi-head attention"),
 b:cat(B('<p>الـ head الواحد بيطلّع <mark>خليط واحد</mark> بس لكل كلمة، فبيضطر يحط كل العلاقات (نحو، ضمير بيرجع لمين، موضوع) في توزيع أوزان واحد. الحل: <mark>multi-head attention</mark>. نشغّل h من الـ heads بالتوازي، كل واحد بـ <code>W_Q</code> و <code>W_K</code> و <code>W_V</code> خاصة بيه، وبيشتغل على بُعد أصغر <code>d_k = d / h</code>.</p>',
         '<p>A single head produces only <mark>one blend</mark> per word, so it must squeeze every relation (syntax, who a pronoun refers to, topic) into one set of weights. The fix: <mark>multi-head attention</mark>. We run h heads in parallel, each with its own <code>W_Q</code>, <code>W_K</code> and <code>W_V</code>, each working on a smaller dimension <code>d_k = d / h</code>.</p>'),
       FIG_MHA,
       B('<div class="m">head_i = Attention(X W_Q^i, X W_K^i, X W_V^i)\nMHA(X) = concat(head_1, ..., head_h) W_O</div>'+
         '<p>مهم: التكلفة الحسابية تقريبًا نفس تكلفة head واحد بالبُعد الكامل d، لأن كل head أصغر h مرة. يعني بناخد تنوّع في العلاقات تقريبًا ببلاش.</p>'+
         '<p>مثال من الـ Transformer الأصلي: <code>d = 512</code> و <code>h = 8</code>، فكل head بُعده <code>d_k = 64</code>. وعدد الـ parameters في طبقة الـ attention هو 4 مصفوفات (W_Q و W_K و W_V و W_O)، كل واحدة d × d:</p>'+
         '<div class="m">4 * 512 * 512 = 1,048,576 parameters</div>'+
         '<p>الأبحاث لقت إن بعض الـ heads بيتخصص في حاجات واضحة (زي الكلمة السابقة أو العلاقات النحوية)، وإن ممكن نشيل نسبة كبيرة منهم بعد التدريب من غير خسارة كبيرة.</p>',
         '<div class="m">head_i = Attention(X W_Q^i, X W_K^i, X W_V^i)\nMHA(X) = concat(head_1, ..., head_h) W_O</div>'+
         '<p>Important: the compute cost is roughly the same as one head at the full dimension d, because each head is h times smaller. So we get a variety of relations almost for free.</p>'+
         '<p>An example from the original Transformer: <code>d = 512</code> and <code>h = 8</code>, so each head has <code>d_k = 64</code>. The number of parameters in an attention layer is 4 matrices (W_Q, W_K, W_V and W_O), each d × d:</p>'+
         '<div class="m">4 * 512 * 512 = 1,048,576 parameters</div>'+
         '<p>Studies found that some heads specialize in clear roles (such as the previous word or syntactic relations), and that a large fraction can be removed after training without a big loss.</p>')),
 q:[
   CQ("لو d = 768 و h = 12، بُعد كل head يساوي كام؟","If d = 768 and h = 12, what is the dimension of each head?",
      [["12","12"],["768","768"],["9,216","9,216"],["64","64"]],
      3,"d_k = d / h = 768 / 12 = 64.","d_k = d / h = 768 / 12 = 64."),
   CQ("ليه نستخدم أكتر من head بدل head واحد كبير؟","Why use several heads instead of one big head?",
   [["عشان الـ attention يبقى أرخص h مرة","So that attention becomes h times cheaper"],["عشان نستغنى عن الـ FFN","To get rid of the FFN"],["كل head بيتعلم علاقة مختلفة بالتوازي، والـ head الواحد ليه خليط واحد بس","Each head learns a different relation in parallel, while a single head has only one blend"],["عشان نستغنى عن الـ positional encodings","To get rid of the positional encodings"]],
   2,"الـ head الواحد بيحط كل العلاقات في توزيع أوزان واحد. والـ heads أصغر h مرة فالتكلفة تقريبًا زي ما هي.","A single head puts every relation into one set of weights. The heads are h times smaller, so the cost stays about the same.")
 ],
 f:[
   CF("إيه فايدة الـ multi-head attention؟","What is the benefit of multi-head attention?",
      "كل head بيتعلم نوع علاقة مختلف بالتوازي على بُعد أصغر (d_k = d / h)، والنواتج بتتلصق وبتعدّي على W_O، بنفس التكلفة تقريبًا.","Each head learns a different kind of relation in parallel on a smaller dimension (d_k = d / h); the outputs are concatenated and passed through W_O, at about the same cost."),
   CF("إيه اللي بيختلف بين الـ heads؟","What differs between the heads?",
   "كل head له W_Q و W_K و W_V خاصين بيه، فبيدوّر على علاقة مختلفة، بس كلهم بيقروا نفس المدخل X.","Each head has its own W_Q, W_K and W_V, so it looks for a different relation, but all of them read the same input X.")
 ],
 terms:[
   {t:B("Multi-head attention","Multi-head attention"),
 d:B("h من الـ attention heads بالتوازي، كل واحد بُعده d / h، والنواتج بتتلصق وبتعدّي على <code>W_O</code>.","h attention heads in parallel, each of dimension d / h, with the outputs concatenated and passed through <code>W_O</code>.")}
 ]},

{id:"l8-gqa",t:B("الـ GQA و MQA: تصغير الـ KV cache","GQA and MQA: shrinking the KV cache"),
 b:cat(B('<p>وقت التوليد الموديل بيحتفظ بالـ keys والـ values للكلمات اللي فاتت (الـ <mark>KV cache</mark>) وبيقراهم تاني في كل خطوة، فالعنق هو <mark>الذاكرة</mark> مش الحساب. الـ multi-head بيحتفظ بـ h نسخة (K و V لكل head). الحلول:</p>'+
         '<p>• <mark>MQA</mark> (Multi-Query Attention): كل الـ query heads بتتشارك K و V واحد.<br>'+
         '• <mark>GQA</mark> (Grouped-Query Attention): الـ heads بتتقسم لـ g مجموعة، وكل مجموعة بتتشارك K و V. (g = h يبقى MHA، و g = 1 يبقى MQA.)</p>',
         '<p>At generation time the model keeps the keys and values of past words (the <mark>KV cache</mark>) and re-reads them at every step, so the bottleneck is <mark>memory</mark>, not compute. Multi-head attention keeps h copies (one K and V per head). Fixes:</p>'+
         '<p>• <mark>MQA</mark> (Multi-Query Attention): all query heads share a single K and V.<br>'+
         '• <mark>GQA</mark> (Grouped-Query Attention): the heads are split into g groups, and each group shares one K and V. (g = h is MHA; g = 1 is MQA.)</p>'),
       FIG_GQA,
       B('<p>حجم الـ KV cache لكل token ولكل طبقة: <code>2 * g * d_k * bytes</code> (2 لـ K و V). مثال بحجم 7B: <code>d_k = 128</code> و <code>h = 32</code> و 32 طبقة و fp16 (2 bytes):</p>'+
         '<div class="m">MHA (g=32): 2*32*128*2 = 16 KB per layer per token\n  x 32 layers x 4,096 tokens = 2 GB\nGQA (g=8):  0.5 GB\nMQA (g=1):  64 MB</div>'+
         '<p>Llama 2 70B: 8 KV heads و 64 query heads. غلطة شائعة: GQA بيقلّل الـ K/V heads بس، مش الـ query heads، فحساب الـ attention تقريبًا زي ما هو، والتوفير في الذاكرة وعرض النطاق. والجودة قريبة من MHA.</p>',
         '<p>The KV cache size per token and per layer is <code>2 * g * d_k * bytes</code> (2 for K and V). A 7B-size example: <code>d_k = 128</code>, <code>h = 32</code>, 32 layers and fp16 (2 bytes):</p>'+
         '<div class="m">MHA (g=32): 2*32*128*2 = 16 KB per layer per token\n  x 32 layers x 4,096 tokens = 2 GB\nGQA (g=8):  0.5 GB\nMQA (g=1):  64 MB</div>'+
         '<p>Llama 2 70B: 8 KV heads and 64 query heads. A common mistake: GQA reduces only the K/V heads, not the query heads, so attention compute stays about the same; the savings are memory and bandwidth. The quality is close to MHA.</p>')),
 q:[
   CQ("لو h = 32 و g = 4 في GQA، الـ KV cache بيصغر كام مرة مقارنة بـ MHA؟","With h = 32 and g = 4 in GQA, how many times smaller is the KV cache than in MHA?",
      [["4 مرات","4 times"],["8 مرات","8 times"],["16 مرة","16 times"],["32 مرة","32 times"]],
      1,"MHA عنده 32 K/V head و GQA عنده 4، فالنسبة 32 ÷ 4 = 8.","MHA has 32 K/V heads and GQA has 4, so the ratio is 32 / 4 = 8."),
   CQ("إيه اللي بيوفّره GQA أساسًا؟","What does GQA mainly save?",
      [["عدد الـ query heads","The number of query heads"],["حجم الـ vocabulary","The vocabulary size"],["ذاكرة الـ KV cache وعرض النطاق وقت التوليد","KV cache memory and bandwidth at generation time"],["الحاجة للـ positional encodings","The need for positional encodings"]],
      2,"بيقلّل عدد الـ K/V heads المخزّنة، فالقراءة من الذاكرة في كل خطوة بتقل.","It reduces the number of stored K/V heads, so there is less memory to read at every step.")
 ],
 f:[
   CF("إيه الفرق بين MHA و MQA و GQA؟","How do MHA, MQA and GQA differ?",
      "MHA: كل head له K/V خاص. MQA: كل الـ heads بتتشارك K/V واحد. GQA: g مجموعات، كل مجموعة K/V واحد (g = h يبقى MHA، و g = 1 يبقى MQA).","MHA: every head has its own K/V. MQA: all heads share one K/V. GQA: g groups, each with one K/V (g = h gives MHA, g = 1 gives MQA)."),
   CF("ليه GQA بيسرّع التوليد؟","Why does GQA speed up generation?",
      "لأن الـ KV cache بيصغر h/g مرة، فالقراءة من الذاكرة في كل خطوة بتقل، من غير ما نقلّل الـ query heads.","Because the KV cache becomes h/g times smaller, so there is less memory to read at each step, without reducing the query heads.")
 ],
 terms:[
   {t:B("MQA (Multi-Query Attention)","MQA (Multi-Query Attention)"),
    d:B("كل الـ query heads بتتشارك K و V واحد، فالـ KV cache بيصغر h مرة.","All query heads share a single K and V, so the KV cache becomes h times smaller.")},
   {t:B("GQA (Grouped-Query Attention)","GQA (Grouped-Query Attention)"),
    d:B("الـ heads بتتقسم لـ g مجموعة وكل مجموعة بتتشارك K و V. وسط بين MHA و MQA.","The heads are split into g groups and each group shares K and V. A middle ground between MHA and MQA.")},
{t:B("KV cache","KV cache"),
 d:B("الـ keys والـ values المخزّنة للكلمات اللي فاتت وقت التوليد، علشان ما تتحسبش تاني.","The stored keys and values of past words at generation time, so they are not recomputed.")}
 ]},

{id:"l8-posenc",t:B("الـ positional encodings","Positional encodings"),
 b:cat(B('<p>الـ self-attention مش بيعرف الترتيب: لو بدّلت أماكن الكلمات، النواتج بتتبدّل بنفس الطريقة بس قيمها ما بتتغيرش (<mark>permutation-equivariant</mark>). يعني \"الكلب عض الراجل\" و\"الراجل عض الكلب\" شبه بعض بالنسبة له! فبنضيف لتمثيل كل كلمة vector بيمثّل موضعها:</p>'+
         '<div class="m">x_i = e_i + p_i</div>'+
         '<p>الـ Transformer الأصلي استخدم <mark>sinusoidal encodings</mark>:</p>'+
         '<div class="m">PE(pos, 2i)   = sin(pos / 10000^(2i/d))\nPE(pos, 2i+1) = cos(pos / 10000^(2i/d))</div>',
         '<p>Self-attention does not know order: if you shuffle the words, the outputs shuffle the same way but their values do not change (<mark>permutation-equivariant</mark>). So \"dog bites man\" and \"man bites dog\" look alike to it! We therefore add to each word representation a vector that represents its position:</p>'+
         '<div class="m">x_i = e_i + p_i</div>'+
         '<p>The original Transformer used <mark>sinusoidal encodings</mark>:</p>'+
         '<div class="m">PE(pos, 2i)   = sin(pos / 10000^(2i/d))\nPE(pos, 2i+1) = cos(pos / 10000^(2i/d))</div>'),
       FIG_PE,
       B('<p>ليه sin و cos بترددات مختلفة؟ زي عدّاد: الأبعاد السريعة بتفرّق بين المواضع القريبة، والبطيئة بتفرّق بين البعيدة، والمجموع بصمة فريدة لكل موضع. وكمان الإزاحة بـ k موضع بتتمثّل كتحويل خطي ثابت، فسهل على الموديل يتعلم \"الكلمة اللي قبلي بـ 3\".</p>'+
         '<p>مثال: عند <code>pos = 1</code> وأول زوج أبعاد القيم هي <code>[sin(1), cos(1)] = [0.84, 0.54]</code>، وعند <code>pos = 0</code> هي <code>[0, 1]</code>.</p>'+
         '<p>البدائل: <mark>learned absolute embeddings</mark> (زي BERT و GPT-2): جدول متعلَّم لكل موضع، بس مش بيعمّم لأطوال أكبر من اللي اتدرّب عليها. و<mark>relative encodings</mark> زي RoPE و ALiBi: بتشفّر المسافة بين كلمتين بدل الموضع المطلق، وهي الأشهر في النماذج الحديثة.</p>',
         '<p>Why sin and cos at different frequencies? Like an odometer: fast dimensions separate nearby positions, slow ones separate distant positions, and together they form a unique fingerprint for each position. Also, a shift by k positions is a fixed linear transformation, so it is easy for the model to learn \"the word 3 before me\".</p>'+
         '<p>An example: at <code>pos = 1</code> the first pair of dimensions is <code>[sin(1), cos(1)] = [0.84, 0.54]</code>, and at <code>pos = 0</code> it is <code>[0, 1]</code>.</p>'+
         '<p>Alternatives: <mark>learned absolute embeddings</mark> (as in BERT and GPT-2): a learned table with one row per position, but it does not generalize to lengths longer than seen in training. And <mark>relative encodings</mark> such as RoPE and ALiBi: they encode the distance between two words instead of the absolute position, and are the most common in modern models.</p>')),
 q:[
   CQ("ليه محتاجين positional encodings؟","Why do we need positional encodings?",
      [["لتقليل تكلفة الحساب","To reduce compute cost"],["لتحويل الكلمات لـ vectors","To turn words into vectors"],["لأن الـ self-attention مش بيعرف ترتيب الكلمات","Because self-attention does not know word order"],["لمنع الرؤية للمستقبل","To block seeing the future"]],
      2,"من غيرها الجملة بتتعامل كأنها مجموعة كلمات من غير ترتيب.","Without them the sentence is treated as a set of words with no order."),
   CQ("لو d = 4، إيه قيمة PE عند pos = 0؟","If d = 4, what is PE at pos = 0?",
   [["[0, 0, 0, 0]","[0, 0, 0, 0]"],["[0, 1, 0, 1]","[0, 1, 0, 1]"],["[1, 0, 1, 0]","[1, 0, 1, 0]"],["[1, 1, 1, 1]","[1, 1, 1, 1]"]],
   1,"sin(0) = 0 و cos(0) = 1، فالأبعاد الزوجية 0 والفردية 1.","sin(0) = 0 and cos(0) = 1, so the even dimensions are 0 and the odd ones are 1.")
 ],
 f:[
   CF("إيه الفرق بين الـ sinusoidal والـ learned والـ relative positional encodings؟","How do sinusoidal, learned and relative positional encodings differ?",
      "Sinusoidal: دوال sin و cos بترددات مختلفة. Learned: جدول متعلَّم لكل موضع ومش بيعمّم لأطوال أطول. Relative (RoPE, ALiBi): بتشفّر المسافة بين الكلمتين.","Sinusoidal: sin and cos functions at different frequencies. Learned: a learned table per position that does not generalize to longer lengths. Relative (RoPE, ALiBi): encode the distance between two words."),
   CF("يعني إيه permutation-equivariant؟","What does permutation-equivariant mean?",
   "لو بدّلت ترتيب الكلمات في المدخل، النواتج بتتبدّل بنفس الترتيب وقيمها ما بتتغيرش، فالـ self-attention لوحده مش شايف الترتيب.","If you shuffle the input words, the outputs shuffle the same way and their values do not change, so self-attention alone cannot see order.")
 ],
 terms:[
   {t:B("Positional encoding","Positional encoding"),
 d:B("معلومة موضع كل كلمة بتتضاف لتمثيلها، علشان الـ self-attention يعرف الترتيب.","The position of each word, added to its representation so that self-attention can know the order.")},
   {t:B("Permutation-equivariant","Permutation-equivariant"),
 d:B("لو بدّلنا ترتيب المدخلات، النواتج بتتبدّل بنفس الترتيب من غير ما قيمها تتغير.","If we shuffle the inputs, the outputs shuffle the same way without their values changing.")},
   {t:B("RoPE (Rotary Position Embedding)","RoPE (Rotary Position Embedding)"),
 d:B("بتدوّر الـ query والـ key بزاوية بتعتمد على الموضع، فالـ dot product بيعتمد على المسافة النسبية.","Rotates the query and key by an angle that depends on position, so their dot product depends on the relative distance.")},
   {t:B("ALiBi","ALiBi"),
 d:B("بتضيف عقوبة خطية بتزيد مع المسافة على الـ attention scores.","Adds a linear penalty that grows with distance to the attention scores.")}
 ]},

{id:"l8-block",t:B("الـ Transformer block","The Transformer block"),
 b:cat(B('<p>بنحط الـ attention جوه <mark>block</mark> فيه 3 إضافات بتخلّي تدريب شبكة بعشرات الطبقات ممكن:</p>'+
         '<p>1. <mark>Feed-forward network (FFN)</mark>: شبكة صغيرة بتتطبّق على كل كلمة لوحدها، بتضيف الـ non-linearity اللي ناقصة. بتوسّع البُعد لـ 4d وترجّعه:</p>'+
         '<div class="m">FFN(x) = W2 GELU(W1 x + b1) + b2\nW1: d -> 4d     W2: 4d -> d</div>'+
         '<p>2. <mark>Residual connection</mark>: بنجمع المدخل مع الناتج <code>x + f(x)</code>. ده بيدي الـ gradient طريق مباشر لورا، وكل طبقة بتتعلم \"تعديل\" على اللي قبلها.</p>'+
         '<p>3. <mark>Layer normalization</mark>: بنطبّع كل vector على أبعاده هو (متوسط 0 وتباين 1)، وبعدين نضرب في <code>gamma</code> ونجمع <code>beta</code> المتعلَّمين. بيثبّت التدريب. مثال: <code>x = [2, 4, 6]</code> متوسطه 4 وانحرافه المعياري 1.63، فالناتج <code>[-1.22, 0, 1.22]</code>.</p>',
         '<p>We wrap attention in a <mark>block</mark> with 3 additions that make training a network with dozens of layers possible:</p>'+
         '<p>1. <mark>Feed-forward network (FFN)</mark>: a small network applied to each word separately, adding the missing non-linearity. It expands the dimension to 4d and brings it back:</p>'+
         '<div class="m">FFN(x) = W2 GELU(W1 x + b1) + b2\nW1: d -> 4d     W2: 4d -> d</div>'+
         '<p>2. <mark>Residual connection</mark>: we add the input to the output, <code>x + f(x)</code>. This gives the gradient a direct path backward, and each layer learns an \"edit\" of what came before.</p>'+
         '<p>3. <mark>Layer normalization</mark>: we normalize each vector across its own dimensions (mean 0, variance 1), then multiply by a learned <code>gamma</code> and add a learned <code>beta</code>. It stabilizes training. Example: <code>x = [2, 4, 6]</code> has mean 4 and standard deviation 1.63, so the output is <code>[-1.22, 0, 1.22]</code>.</p>'),
       FIG_BLOCK,
       B('<p>مكان الـ LayerNorm (قبل الـ sub-layer ولا بعده) بيفرق في ثبات التدريب، وده موضوع الكارت اللي جاي.</p>',
  '<p>Where the LayerNorm goes (before or after the sub-layer) matters for training stability, and that is the topic of the next card.</p>')),
 q:[
   CQ("إيه وظيفة الـ residual connection؟","What does the residual connection do?",
      [["بيصغّر حجم الـ embeddings","It shrinks the embeddings"],["بيمنع الرؤية للمستقبل","It blocks seeing the future"],["بيضيف معلومة الموضع","It adds position information"],["بيدي الـ gradient طريق مباشر وكل طبقة بتتعلم تعديل على مدخلها","It gives the gradient a direct path and each layer learns an edit of its input"]],
      3,"الجمع x + f(x) بيخلّي الـ gradient يمشي مباشرة عبر الـ skip، فتدريب الشبكات العميقة بيبقى أسهل.","The sum x + f(x) lets the gradient flow directly through the skip, so deep networks train more easily."),
   CQ("لو d = 512، بُعد الطبقة المخفية في الـ FFN يساوي كام؟","If d = 512, what is the hidden dimension of the FFN?",
   [["512","512"],["1,024","1,024"],["2,048","2,048"],["4,096","4,096"]],
   2,"الـ FFN بتوسّع لـ 4d: 4 × 512 = 2,048.","The FFN expands to 4d: 4 × 512 = 2,048.")
 ],
 f:[
   CF("إيه مكونات الـ Transformer block؟","What are the components of a Transformer block?",
      "Multi-head attention، و FFN بتوسّع لـ 4d، و residual connection حوالين كل واحد فيهم، و LayerNorm (قبلهم في Pre-LN).","Multi-head attention, an FFN that expands to 4d, a residual connection around each of them, and LayerNorm (before them in Pre-LN)."),
   CF("إيه معادلة الـ layer normalization؟","What is the layer normalization formula?",
   "بنطرح المتوسط ونقسم على الانحراف المعياري على أبعاد الـ vector نفسه، وبعدين نضرب في gamma ونجمع beta.","Subtract the mean and divide by the standard deviation across the dimensions of the vector itself, then multiply by gamma and add beta.")
 ],
 terms:[
   {t:B("Feed-forward network (FFN)","Feed-forward network (FFN)"),
 d:B("شبكة صغيرة بتتطبّق على كل كلمة لوحدها: توسّع البُعد لـ 4d وترجّعه، وبينهم non-linearity.","A small network applied to each word separately: it expands the dimension to 4d and brings it back, with a non-linearity in between.")},
   {t:B("Residual connection","Residual connection"),
 d:B("بنجمع المدخل مع الناتج <code>x + f(x)</code>، فالـ gradient ليه طريق مباشر لورا.","We add the input to the output, <code>x + f(x)</code>, so the gradient has a direct path backward.")},
   {t:B("Layer normalization","Layer normalization"),
 d:B("تطبيع كل vector على أبعاده (متوسط 0 وتباين 1) وبعدين ضرب في gamma وجمع beta المتعلَّمين.","Normalizing each vector across its own dimensions (mean 0, variance 1), then multiplying by a learned gamma and adding a learned beta.")}
 ]},

{id:"l8-pre-norm",t:B("Pre-LN مقابل Post-LN، وعدّ الـ parameters والـ FLOPs","Pre-LN vs Post-LN, and counting parameters and FLOPs"),
 b:cat(FIG_NORM,
       B('<p>الترتيب الحديث اسمه <mark>Pre-LN</mark>: الـ LayerNorm قبل كل sub-layer (زي الرسم). الـ Transformer الأصلي استخدم Post-LN (بعد الجمع)، بس Pre-LN أثبت في تدريب الشبكات العميقة:</p>'+
         '<div class="m">x = x + MHA(LN(x))\nx = x + FFN(LN(x))</div>'+
         '<p>وبنكرر الـ block ده L مرة (12 في BERT-base). ملاحظة: الـ FFN فيها تقريبًا ثلثين الـ parameters في الـ block (8d² مقابل 4d² للـ attention).</p>',
         '<p>The modern arrangement is called <mark>Pre-LN</mark>: LayerNorm before each sub-layer (as in the figure). The original Transformer used Post-LN (after the addition), but Pre-LN proved more stable for training deep networks:</p>'+
         '<div class="m">x = x + MHA(LN(x))\nx = x + FFN(LN(x))</div>'+
         '<p>We repeat this block L times (12 in BERT-base). Note: the FFN holds about two thirds of the parameters in the block (8d² versus 4d² for attention).</p>'),
       B('<p>مسار الـ residual من المدخل للمخرج في Pre-LN مفيهوش LayerNorm، فالـ gradient بيرجع لورا نضيف (والـ Post-LN غالبًا بيحتاج warmup للـ learning rate).</p>'+
         '<p>عدّ الـ parameters (من غير الـ biases والـ LayerNorm): الـ attention فيه 4d² والـ FFN فيه 8d²، يعني <mark>12d²</mark> للـ block. في BERT-base (d = 768): 12 × 768² ≈ 7.1M لكل block، وحوالي 85M لـ 12 block (معظم الباقي من الـ 110M هو الـ embeddings).</p>'+
         '<p>الـ FLOPs (multiply-add = 2): حوالي 24d² لكل token، زائد 4nd للجزء n × n. الاتنين بيتساووا عند n = 6d مش n = d (الـ O() بتخفي الثوابت). في BERT-base (n = 512) حوالي 10% من الـ FLOPs رايحة للجزء n × n.</p>',
         '<p>In Pre-LN the residual path from input to output has no LayerNorm on it, so the gradient flows back cleanly (Post-LN usually needs a learning-rate warmup).</p>'+
         '<p>Counting parameters (ignoring biases and LayerNorm): attention has 4d² and the FFN 8d², so a block has <mark>12d²</mark>. For BERT-base (d = 768): 12 × 768² ≈ 7.1M per block, about 85M for 12 blocks (most of the rest of its 110M is the embeddings).</p>'+
         '<p>FLOPs (multiply-add = 2): about 24d² per token, plus 4nd for the n × n part. The two are equal at n = 6d, not n = d (O() hides constants). In BERT-base (n = 512) about 10% of FLOPs go to the n × n part.</p>')),
 q:[
   CQ("إيه الفرق بين Pre-LN و Post-LN؟","What is the difference between Pre-LN and Post-LN?",
      [["Pre-LN بتستخدم FFN و Post-LN بتستخدم attention بس","Pre-LN uses an FFN and Post-LN uses attention only"],["Pre-LN: الـ LayerNorm قبل الـ sub-layer. Post-LN: بعد الجمع مع الـ residual","Pre-LN: LayerNorm before the sub-layer. Post-LN: after the addition with the residual"],["Pre-LN من غير residual connections","Pre-LN has no residual connections"],["مفيش فرق في ترتيب العمليات","There is no difference in the order of operations"]],
      1,"Post-LN: x = LN(x + f(x)). Pre-LN: x = x + f(LN(x)).","Post-LN: x = LN(x + f(x)). Pre-LN: x = x + f(LN(x))."),
   CQ("لو d = 1024، كام parameter في block واحد (من غير biases)؟","If d = 1024, how many parameters are in one block (ignoring biases)?",
      [["4,194,304","4,194,304"],["8,388,608","8,388,608"],["12,582,912","12,582,912"],["16,777,216","16,777,216"]],
      2,"12d² = 12 × 1,048,576 = 12,582,912 (4d² للـ attention و 8d² للـ FFN).","12d² = 12 × 1,048,576 = 12,582,912 (4d² for attention and 8d² for the FFN).")
 ],
 f:[
   CF("إيه معادلة الـ Pre-LN والـ Post-LN؟","What are the Pre-LN and Post-LN equations?",
      "Post-LN: x = LN(x + f(x)). Pre-LN: x = x + f(LN(x)). في Pre-LN مسار الـ residual نضيف فالتدريب أثبت.","Post-LN: x = LN(x + f(x)). Pre-LN: x = x + f(LN(x)). In Pre-LN the residual path stays clean, so training is more stable."),
   CF("كام parameter و FLOPs في block؟","How many parameters and FLOPs does a block have?",
      "حوالي 12d² parameters (4d² attention و 8d² FFN). الـ FLOPs لكل token حوالي 24d² زائد 4nd.","About 12d² parameters (4d² attention and 8d² FFN). FLOPs per token are about 24d² plus 4nd.")
 ],
 terms:[
   {t:B("Pre-LN / Post-LN","Pre-LN / Post-LN"),
    d:B("Post-LN: الـ LayerNorm بعد الجمع مع الـ residual. Pre-LN: الـ LayerNorm قبل الـ sub-layer، وده الأثبت للشبكات العميقة.","Post-LN: LayerNorm after the addition with the residual. Pre-LN: LayerNorm before the sub-layer, which is more stable for deep networks.")},
   {t:B("FLOPs","FLOPs"),
 d:B("عدد العمليات الحسابية العشرية. الـ multiply-add الواحد بيتحسب بـ 2.","The number of floating-point operations. One multiply-add counts as 2.")}
 ]},

{id:"l8-train-recipe",t:B("وصفة تدريب الـ Transformer","The Transformer training recipe"),
 b:cat(B('<p>الـ Transformer بيتدرّب بثبات مع كام مكوّن قياسي: <mark>AdamW</mark>، وwarmup بعده cosine decay، وgradient clipping، وbf16 mixed precision.</p>'+
         '<p><mark>AdamW</mark>: في Adam مع L2 بنضيف <code>λw</code> للـ gradient، وبعدين Adam بيقسم على <code>sqrt(v)</code>، فالعقوبة بتتغيّر حسب كل parameter: الأوزان ذات الـ gradients الكبيرة بتتقلّل أقل. AdamW بيفصل الاتنين وبيصغّر الأوزان مباشرة:</p>'+
         '<div class="m">Adam+L2: g = grad + lam*w (inside Adam)\nAdamW:   w = w - lr*(adam_step + lam*w)</div>'+
         '<p><mark>Warmup + cosine decay</mark>: نبدأ بـ learning rate صغير جدًا ونرفعه خطيًا لحد القمة في أول W step (إحصائيات Adam في الأول مش مستقرة)، وبعدين بينزل على cosine لحد أرضية. مثال: القمة '+L8S.pk+'، و W = '+L8S.warm+'، و '+L8S.tot+' step، والأرضية 10% من القمة:</p>'+
         '<div class="m">step 500: '+L8S.l500+' (warmup)\nstep '+L8S.warm+': '+L8S.l2000+' (peak)\nstep '+L8S.mid+': '+L8S.lmid+' (halfway)\nstep '+L8S.tot+': '+L8S.lend+' (floor)</div>',
         '<p>A Transformer trains reliably with a few standard ingredients: <mark>AdamW</mark>, warmup followed by cosine decay, gradient clipping, and bf16 mixed precision.</p>'+
         '<p><mark>AdamW</mark>: in Adam with L2 we add <code>λw</code> to the gradient, and then Adam divides by <code>sqrt(v)</code>, so the penalty is rescaled per parameter: weights with large gradients are decayed less. AdamW decouples the two and shrinks the weights directly:</p>'+
         '<div class="m">Adam+L2: g = grad + lam*w (inside Adam)\nAdamW:   w = w - lr*(adam_step + lam*w)</div>'+
         '<p><mark>Warmup + cosine decay</mark>: start with a tiny learning rate and raise it linearly to the peak over the first W steps (early Adam statistics are unstable), then decay along a cosine to a floor. Example: peak '+L8S.pk+', W = '+L8S.warm+', '+L8S.tot+' steps, floor 10% of the peak:</p>'+
         '<div class="m">step 500: '+L8S.l500+' (warmup)\nstep '+L8S.warm+': '+L8S.l2000+' (peak)\nstep '+L8S.mid+': '+L8S.lmid+' (halfway)\nstep '+L8S.tot+': '+L8S.lend+' (floor)</div>'),
       FIG_LR,
       B('<p><mark>Gradient clipping</mark>: لو الـ norm الكلي للـ gradients عدّى حد c (غالبًا 1.0)، بنضرب كل الـ gradients في <code>c / norm</code>. ده بيحتوي الـ batches الوحشة. مثال: <code>g = [3, 4]</code> الـ norm بتاعه '+L8S.gn+'، ومع c = 1 بنضرب في '+L8S.gf+' فيطلع '+L8S.go+'.</p>'+
         '<p><mark>bf16 mixed precision</mark>: الـ bfloat16 ليه نفس مدى الـ exponent بتاع fp32 (8 bits) بس 7 bits للـ mantissa. الـ fp16 ليه 5 bits للـ exponent فبيعمل overflow بسهولة ومحتاج loss scaling. الـ matmuls بتشتغل بـ bf16، والـ master weights وحالات الـ optimizer بتفضل fp32. ده بيقلّل ذاكرة الـ activations تقريبًا للنص وبيسرّع الـ matmuls.</p>'+
         '<p><mark>غلطة شائعة:</mark> نحط weight decay على الـ biases وأوزان الـ LayerNorm. غالبًا بتتشال من الـ decay.</p>',
         '<p><mark>Gradient clipping</mark>: if the global gradient norm exceeds a threshold c (often 1.0), multiply all gradients by <code>c / norm</code>. This tames bad batches. Example: <code>g = [3, 4]</code> has norm '+L8S.gn+'; with c = 1 we multiply by '+L8S.gf+' and get '+L8S.go+'.</p>'+
         '<p><mark>bf16 mixed precision</mark>: bfloat16 has the same exponent range as fp32 (8 bits) but only 7 mantissa bits. fp16 has 5 exponent bits, so it overflows easily and needs loss scaling. Matmuls run in bf16; master weights and optimizer states stay in fp32. This roughly halves activation memory and speeds up the matmuls.</p>'+
         '<p><mark>Common mistake:</mark> applying weight decay to biases and LayerNorm weights. They are usually excluded from decay.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين Adam مع L2 و AdamW؟","What is the main difference between Adam with L2 and AdamW?",
      [["AdamW بتستغنى عن الـ momentum","AdamW drops the momentum"],["AdamW بتطبّق الـ weight decay على الأوزان مباشرة، بره الـ scaling التكيّفي بـ sqrt(v)","AdamW applies weight decay directly to the weights, outside the adaptive sqrt(v) scaling"],["AdamW بتستخدم learning rate ثابت","AdamW uses a constant learning rate"],["AdamW بتحسب الـ gradients بالـ bf16 بس","AdamW computes gradients in bf16 only"]],
      1,"في Adam مع L2 الـ λw جوه الـ gradient فبيتقسم على sqrt(v). في AdamW الـ decay بيتطبّق على الأوزان مباشرة.","In Adam with L2 the λw sits inside the gradient and gets divided by sqrt(v). In AdamW the decay is applied to the weights directly."),
   CQ("القمة "+L8S.pk+" و warmup = "+L8S.warm+" step خطي من الصفر. كام الـ learning rate عند step 500؟","Peak = "+L8S.pk+" and warmup = "+L8S.warm+" steps, linear from zero. What is the learning rate at step 500?",
      [[L8S.l1000,L8S.l1000],[L8S.l2000,L8S.l2000],[L8S.l500,L8S.l500],[L8S.linv,L8S.linv]],
      2,"في الـ warmup: lr = peak × step / W = "+L8S.pk+" × 500 / "+L8S.warm+" = "+L8S.l500+".","During warmup: lr = peak × step / W = "+L8S.pk+" × 500 / "+L8S.warm+" = "+L8S.l500+".")
 ],
 f:[
   CF("إيه الفرق بين Adam+L2 و AdamW؟","How do Adam+L2 and AdamW differ?",
      "Adam+L2 بيحط λw جوه الـ gradient فبيتقسم على sqrt(v). AdamW بيطبّق الـ decay على الأوزان مباشرة: w = w - lr*(adam_step + lam*w).","Adam+L2 puts λw inside the gradient, so it gets divided by sqrt(v). AdamW applies the decay to the weights directly: w = w - lr*(adam_step + lam*w)."),
   CF("إيه مكونات وصفة تدريب الـ Transformer؟","What are the ingredients of the Transformer training recipe?",
      "AdamW، وwarmup ثم cosine decay، وgradient clipping (غالبًا 1.0)، وbf16 mixed precision مع master weights بـ fp32.","AdamW, warmup then cosine decay, gradient clipping (often 1.0), and bf16 mixed precision with fp32 master weights.")
 ],
 terms:[
   {t:B("AdamW","AdamW"),
    d:B("Adam مع weight decay مفصول: بيصغّر الأوزان مباشرة بدل ما يضيف L2 للـ gradient، فالـ decay ما بيتقسمش على sqrt(v).","Adam with decoupled weight decay: it shrinks the weights directly instead of adding L2 to the gradient, so the decay is not divided by sqrt(v).")},
   {t:B("Learning-rate warmup","Learning-rate warmup"),
    d:B("رفع الـ learning rate خطيًا من الصفر لحد القمة في أول عدد قليل من الـ steps علشان التدريب يبدأ ثابت.","Raising the learning rate linearly from zero to the peak over the first few steps so training starts stably.")},
   {t:B("Cosine decay","Cosine decay"),
    d:B("تقليل الـ learning rate من القمة لأرضية على شكل نص موجة cosine.","Lowering the learning rate from the peak to a floor along half a cosine wave.")},
   {t:B("Gradient clipping","Gradient clipping"),
    d:B("لو norm الـ gradients عدّى حد c بنضربها في c / norm علشان الـ norm يبقى c.","If the gradient norm exceeds a threshold c, scale the gradients by c / norm so the norm becomes c.")},
   {t:B("bf16 mixed precision","bf16 mixed precision"),
    d:B("حسابات بـ bfloat16 (نفس مدى الـ exponent بتاع fp32) مع master weights بـ fp32. أسرع وأخف في الذاكرة.","Computation in bfloat16 (same exponent range as fp32) with fp32 master weights. Faster and lighter on memory.")}
 ]},

{id:"l8-decoder",t:B("الـ decoder: masking و cross-attention","The decoder: masking and cross-attention"),
 b:cat(B('<p>في الـ language modeling والتوليد، الكلمة رقم i ممنوع تشوف الكلمات اللي بعدها (دي اللي بنتنبأ بيها!). الحل: <mark>masked (causal) self-attention</mark>. قبل الـ softmax بنحط <code>-inf</code> في خانات المستقبل، فوزنها بيبقى صفر:</p>'+
         '<div class="m">score_ij = q_i . k_j / sqrt(d_k)   if j <= i\nscore_ij = -inf                    if j > i</div>',
         '<p>In language modeling and generation, word i must not see the words after it (those are what we are predicting!). The fix: <mark>masked (causal) self-attention</mark>. Before the softmax we put <code>-inf</code> in the future cells, so their weight becomes zero:</p>'+
         '<div class="m">score_ij = q_i . k_j / sqrt(d_k)   if j <= i\nscore_ij = -inf                    if j > i</div>'),
       FIG_MASK,
       B('<p>مثال: صف كلمة <code>cat</code> فيه scores <code>[1, 2, -inf, -inf, -inf]</code>، فالـ softmax بيطلّع <code>[0.27, 0.73, 0, 0, 0]</code>. وفايدة كبيرة: وقت التدريب بنعدّي الجملة كلها مرة واحدة، والـ mask بيخلّي كل موضع يتنبأ كأنه ما شافش المستقبل، فكل المواضع بتتدرب <mark>بالتوازي</mark>.</p>'+
         '<p>الـ decoder في الـ Transformer الأصلي (للترجمة مثلًا) كل طبقة فيه 3 أجزاء: (1) masked self-attention، (2) <mark>cross-attention</mark>، (3) FFN. في الـ cross-attention الـ <mark>queries</mark> جاية من الـ decoder، والـ <mark>keys و values</mark> جاية من مخرجات الـ encoder. ده نفس فكرة المحاضرة 7: الـ decoder بيبص على جملة المصدر.</p>'+
         '<p>الموديلات الحديثة زي GPT بتستغنى عن الـ encoder والـ cross-attention وبتبقى <mark>decoder-only</mark>: طبقات masked self-attention و FFN بس.</p>',
         '<p>An example: the row for the word <code>cat</code> has scores <code>[1, 2, -inf, -inf, -inf]</code>, so the softmax gives <code>[0.27, 0.73, 0, 0, 0]</code>. A big benefit: at training time we pass the whole sentence at once, and the mask makes each position predict as if it had not seen the future, so all positions train <mark>in parallel</mark>.</p>'+
         '<p>In the original Transformer decoder (for translation, say) each layer has 3 parts: (1) masked self-attention, (2) <mark>cross-attention</mark>, (3) an FFN. In cross-attention the <mark>queries</mark> come from the decoder, and the <mark>keys and values</mark> come from the encoder outputs. This is the same idea as lecture 7: the decoder looks at the source sentence.</p>'+
         '<p>Modern models such as GPT drop the encoder and the cross-attention and become <mark>decoder-only</mark>: just masked self-attention layers and FFNs.</p>')),
 q:[
   CQ("في الـ cross-attention، الـ keys والـ values بتيجي منين؟","In cross-attention, where do the keys and values come from?",
      [["من الـ decoder نفسه","From the decoder itself"],["من مخرجات الـ encoder","From the encoder outputs"],["من الـ mask","From the mask"],["من positional encodings بس","From the positional encodings only"]],
      1,"الـ queries من الـ decoder، والـ keys والـ values من مخرجات الـ encoder، فالـ decoder بيبص على المصدر.","The queries come from the decoder, and the keys and values from the encoder outputs, so the decoder looks at the source."),
   CQ("لو scores صف كلمة هي [2, 2, -inf]، الـ softmax بيطلّع كام؟","If a word's scores row is [2, 2, -inf], what does the softmax give?",
   [["[0.33, 0.33, 0.33]","[0.33, 0.33, 0.33]"],["[1, 1, 0]","[1, 1, 0]"],["[0.5, 0.5, 0.5]","[0.5, 0.5, 0.5]"],["[0.5, 0.5, 0]","[0.5, 0.5, 0]"]],
   3,"القيمتين الأولانيين متساويتين و e^-inf = 0، فالتوزيع [0.5, 0.5, 0] ومجموعه 1.","The first two values are equal and e^-inf = 0, so the distribution is [0.5, 0.5, 0] and it sums to 1.")
 ],
 f:[
   CF("إيه الفرق بين masked self-attention والـ cross-attention؟","How do masked self-attention and cross-attention differ?",
      "Masked self-attention: الـ Q و K و V كلها من الـ decoder مع -inf للمستقبل. Cross-attention: الـ Q من الـ decoder والـ K و V من مخرجات الـ encoder.","Masked self-attention: Q, K and V all come from the decoder, with -inf for the future. Cross-attention: Q comes from the decoder, and K and V from the encoder outputs."),
   CF("إيه هو الـ decoder-only model؟","What is a decoder-only model?",
   "نموذج من غير encoder ولا cross-attention، طبقاته masked self-attention و FFN بس، زي GPT.","A model with no encoder and no cross-attention; its layers are just masked self-attention and FFN, like GPT.")
 ],
 terms:[
   {t:B("Causal mask","Causal mask"),
 d:B("بنحط <code>-inf</code> في خانات المستقبل قبل الـ softmax، فكل كلمة بتشوف نفسها والسابقين بس.","We put <code>-inf</code> in the future cells before the softmax, so each word sees only itself and the words before it.")},
   {t:B("Cross-attention","Cross-attention"),
 d:B("الـ queries من الـ decoder والـ keys والـ values من مخرجات الـ encoder.","The queries come from the decoder, and the keys and values from the encoder outputs.")},
   {t:B("Decoder-only model","Decoder-only model"),
 d:B("موديل من masked self-attention و FFN بس، من غير encoder. زي GPT.","A model made of just masked self-attention and FFN layers, with no encoder. Like GPT.")}
 ]},

{id:"l8-code-attn",t:B("كود: causal self-attention بـ head واحد","Code: single-head causal self-attention"),
 b:cat(B('<p>نحوّل المعادلة لكود. ده head واحد causal في PyTorch، والـ shapes في التعليقات (B = الـ batch، T = طول الجملة، d = بُعد الموديل، dk = بُعد الـ head). ده نفس الـ building block اللي محتاجه في Assignment 3 (self-attention وTransformers).</p>'+
         '<div class="m">'+l8esc(L8CODE_ATTN)+'</div>'+
         '<p>الـ <code>x</code> شكله (B, T, d)، والـ q و k و v شكلهم (B, T, dk)، والـ scores شكلها (B, T, T)، والمخرج (B, T, dk). الـ softmax على آخر محور (الـ keys) فكل صف مجموعه 1. تجربة بـ B = 2 و T = 5 و d = 16 و dk = 8: المخرج (2, 5, 8)، وأول صف في الـ attention هو <code>[1, 0, 0, 0, 0]</code> لأن الموضع 0 مش بيشوف غير نفسه.</p>'+
         '<p><mark>غلطة شائعة:</mark> softmax على المحور الغلط (<code>dim=1</code>) أو نسيان القسمة على sqrt(dk).</p>',
         '<p>Let us turn the formula into code. This is a single causal head in PyTorch, with the shapes in the comments (B = batch, T = sequence length, d = model dimension, dk = head dimension). It is the same building block you need in Assignment 3 (self-attention and Transformers).</p>'+
         '<div class="m">'+l8esc(L8CODE_ATTN)+'</div>'+
         '<p><code>x</code> is (B, T, d); q, k and v are (B, T, dk); the scores are (B, T, T) and the output is (B, T, dk). The softmax runs over the last axis (the keys), so each row sums to 1. A test with B = 2, T = 5, d = 16 and dk = 8: the output is (2, 5, 8), and the first attention row is <code>[1, 0, 0, 0, 0]</code> because position 0 can only see itself.</p>'+
         '<p><mark>Common mistake:</mark> a softmax over the wrong axis (<code>dim=1</code>) or forgetting to divide by sqrt(dk).</p>')),
 q:[
   CQ("ليه بنحط -inf مش 0 في خانات المستقبل قبل الـ softmax؟","Why put -inf and not 0 in the future cells before the softmax?",
      [["عشان 0 بيخلّي الـ gradient صفر","Because 0 makes the gradient zero"],["عشان e^0 = 1 فالخانة هتفضل ليها وزن موجب، لكن e^-inf = 0","Because e^0 = 1 so the cell would keep a positive weight, while e^-inf = 0"],["عشان -inf بيصغّر حجم الـ tensor","Because -inf shrinks the tensor"],["مفيش فرق بين الاتنين","There is no difference between the two"]],
      1,"الـ softmax بيعمل exp لكل خانة. exp(0) = 1 يعني الكلمة لسه بتشوف المستقبل، و exp(-inf) = 0.","The softmax takes exp of every cell. exp(0) = 1 means the word still sees the future, and exp(-inf) = 0."),
   CQ("لو x شكله (4, 10, 64) و dk = 16، شكل الـ scores بعد <code>q @ k.transpose(-2, -1)</code>؟","If x is (4, 10, 64) and dk = 16, what is the shape of the scores after <code>q @ k.transpose(-2, -1)</code>?",
      [["(4, 10, 16)","(4, 10, 16)"],["(4, 16, 16)","(4, 16, 16)"],["(4, 10, 10)","(4, 10, 10)"],["(10, 10)","(10, 10)"]],
      2,"q و k شكلهم (4, 10, 16)، فالضرب (4, 10, 16) @ (4, 16, 10) = (4, 10, 10): T × T لكل عنصر في الـ batch.","q and k are (4, 10, 16), so (4, 10, 16) @ (4, 16, 10) = (4, 10, 10): T × T for each batch element.")
 ],
 f:[
   CF("إيه خطوات الـ causal attention بالترتيب مع الـ shapes؟","What are the steps of causal attention, in order, with shapes?",
      "(1) qkv من x (B,T,d). (2) scores = q @ k^T بشكل (B,T,T). (3) قسمة على sqrt(dk). (4) -inf للمستقبل. (5) softmax على آخر محور. (6) @ v بيطلّع (B,T,dk).","(1) qkv from x (B,T,d). (2) scores = q @ k^T with shape (B,T,T). (3) divide by sqrt(dk). (4) -inf for the future. (5) softmax over the last axis. (6) @ v gives (B,T,dk)."),
   CF("الـ softmax بيتحسب على أنهي محور في الـ attention؟","Over which axis is the softmax computed in attention?",
      "آخر محور (الـ keys)، علشان كل صف (query) تبقى أوزانه مجموعها 1.","The last axis (the keys), so that each row (query) has weights that sum to 1.")
 ]},

{id:"l8-code-mha",t:B("كود: تحويل الـ head لـ multi-head بالـ reshape","Code: turning the head into multi-head with reshape"),
 b:cat(B('<p>علشان نبقى multi-head بنفس الرياضيات، بنقسم البُعد d لـ h heads حجم كل واحد dk = d / h، وبنشغّلهم كلهم مرة واحدة كمحور زيادة في الـ tensor. الحيلة: reshape لـ (B, T, h, dk) الأول وبعدين transpose لـ (B, h, T, dk). (بنفس الـ imports بتاعة الكارت اللي فات.) ده الجزء التاني من نفس الـ building block في Assignment 3.</p>'+
         '<div class="m">'+l8esc(L8CODE_MHA)+'</div>'+
         '<p>أرقام: d = 512 و h = 8 يدّوا dk = 64، والـ q بعد الـ split شكله (B, 8, T, 64) والـ scores (B, 8, T, T). الطبقة فيها 4 × 512² = '+L8S.mhaP+' parameter (qkv و o)، نفس العدد في كارت الـ multi-head.</p>'+
         '<p><mark>غلطة شائعة:</mark> reshape مباشر لـ (B, h, T, dk). ده بيخلط الـ tokens مع الـ features من غير أي error. اعمل (B, T, h, dk) وبعدين transpose. وفي الآخر العكس: transpose راجع، reshape لـ (B, T, d)، وبعدين W_O.</p>',
         '<p>To go multi-head with the same math, we split the dimension d into h heads of size dk = d / h and run them all at once as an extra tensor axis. The trick: reshape to (B, T, h, dk) first and only then transpose to (B, h, T, dk). (Same imports as the previous card.) This is the second half of the same building block in Assignment 3.</p>'+
         '<div class="m">'+l8esc(L8CODE_MHA)+'</div>'+
         '<p>Numbers: d = 512 and h = 8 give dk = 64; q after the split is (B, 8, T, 64) and the scores are (B, 8, T, T). The layer has 4 × 512² = '+L8S.mhaP+' parameters (qkv and o), the same count as in the multi-head card.</p>'+
         '<p><mark>Common mistake:</mark> reshaping straight to (B, h, T, dk). It mixes tokens with features without any error. Go to (B, T, h, dk), then transpose. At the end do the reverse: transpose back, reshape to (B, T, d), then apply W_O.</p>')),
 q:[
   CQ("ليه بنعمل reshape لـ (B, T, h, dk) الأول وبعدين transpose، مش reshape مباشرة لـ (B, h, T, dk)؟","Why reshape to (B, T, h, dk) first and then transpose, instead of reshaping straight to (B, h, T, dk)?",
      [["عشان الـ transpose أسرع من الـ reshape","Because transpose is faster than reshape"],["عشان الـ reshape المباشر بيخلط الـ tokens مع الـ features من غير error","Because a direct reshape mixes tokens with features without any error"],["عشان PyTorch مش بتدعم 4 أبعاد","Because PyTorch does not support 4 dimensions"],["مفيش فرق في النتيجة","The result is the same"]],
      1,"الـ reshape بيقرا الداتا بالترتيب. (B, T, d) بيتقسم صح لـ (B, T, h, dk)، والـ transpose بس بيبدّل المحاور.","Reshape reads the data in order. (B, T, d) splits correctly into (B, T, h, dk), and the transpose just swaps the axes."),
   CQ("لو B = 2 و T = 10 و d = 512 و h = 8، شكل <code>F.softmax(s, -1) @ v</code>؟","If B = 2, T = 10, d = 512 and h = 8, what is the shape of <code>F.softmax(s, -1) @ v</code>?",
      [["(2, 10, 8, 64)","(2, 10, 8, 64)"],["(2, 8, 10, 10)","(2, 8, 10, 10)"],["(2, 8, 10, 64)","(2, 8, 10, 64)"],["(2, 10, 512)","(2, 10, 512)"]],
      2,"الـ weights (2, 8, 10, 10) @ v (2, 8, 10, 64) = (2, 8, 10, 64). الـ transpose بعدها بيطلّع (2, 10, 8, 64).","The weights (2, 8, 10, 10) @ v (2, 8, 10, 64) = (2, 8, 10, 64). The transpose after it gives (2, 10, 8, 64).")
 ],
 f:[
   CF("إزاي نحوّل head واحد لـ multi-head بالـ reshape؟","How do we turn one head into multi-head with reshape?",
      "من (B,T,d): reshape لـ (B,T,h,dk) وبعدين transpose لـ (B,h,T,dk). بعد الـ attention: transpose راجع، reshape لـ (B,T,d)، وبعدين W_O.","From (B,T,d): reshape to (B,T,h,dk), then transpose to (B,h,T,dk). After attention: transpose back, reshape to (B,T,d), then W_O."),
   CF("إيه شكل الـ scores في الـ multi-head؟","What is the shape of the scores in multi-head attention?",
      "(B, h, T, T): مصفوفة T × T لكل head ولكل عنصر في الـ batch.","(B, h, T, T): a T × T matrix for each head and each batch element.")
 ]},

{id:"l8-cost",t:B("التكلفة O(n²)","The O(n²) cost"),
 b:cat(B('<p>الـ attention بيقارن كل كلمة بكل كلمة، فمصفوفة الـ scores حجمها <mark>n × n</mark>. مقارنة التكلفة (d هو بُعد الموديل):</p>'+
         '<div class="m">attention: O(n^2 * d) time, O(n^2) memory\nFFN:       O(n * d^2) time\nRNN:       O(n * d^2) but n sequential steps</div>',
         '<p>Attention compares every word with every word, so the scores matrix is <mark>n × n</mark>. A cost comparison (d is the model dimension):</p>'+
         '<div class="m">attention: O(n^2 * d) time, O(n^2) memory\nFFN:       O(n * d^2) time\nRNN:       O(n * d^2) but n sequential steps</div>'),
       FIG_COST,
       B('<p>مثال: لو طول الجملة زاد 10 مرات (من 1,000 لـ 10,000) تكلفة الـ attention بتزيد <mark>100 مرة</mark>. ومصفوفة scores واحدة لطول 4,096 فيها حوالي 16.8 مليون خانة، يعني حوالي 32 MB بدقة fp16 لكل head ولكل طبقة لو اتخزّنت كاملة.</p>'+
         '<p>لما n أقل من d (جمل قصيرة) الـ FFN هو الأغلب في التكلفة، ولما n أكبر من d الـ attention بيبقى عنق الزجاجة. عشان كده السياق الطويل محتاج حلول:</p>'+
         '<p>• <mark>FlashAttention</mark>: نفس النتيجة بالظبط (exact) من غير تخزين مصفوفة n × n كاملة في الذاكرة البطيئة للـ GPU، بيقسّم الحساب blocks في الذاكرة السريعة.<br>'+
         '• <mark>Sparse / sliding-window attention</mark>: كل كلمة بتبص على نافذة محلية بس.<br>'+
         '• <mark>Linear attention</mark> وتقريبات تانية: تكلفة خطية، بس أحيانًا بتضحّي بالجودة.<br>'+
         '• <mark>KV cache</mark> وقت التوليد: بنخزّن الـ keys والـ values للكلمات اللي فاتت عشان ما نحسبهاش تاني.</p>',
         '<p>An example: if the sequence length grows 10 times (from 1,000 to 10,000) the attention cost grows <mark>100 times</mark>. And one scores matrix for length 4,096 has about 16.8 million cells, about 32 MB in fp16 per head and per layer if stored in full.</p>'+
         '<p>When n is below d (short sequences) the FFN dominates the cost; when n is above d attention becomes the bottleneck. That is why long context needs fixes:</p>'+
         '<p>• <mark>FlashAttention</mark>: exactly the same result without storing the full n × n matrix in the slow GPU memory, computing in blocks in fast memory.<br>'+
         '• <mark>Sparse / sliding-window attention</mark>: each word looks only at a local window.<br>'+
         '• <mark>Linear attention</mark> and other approximations: linear cost, but sometimes at a quality loss.<br>'+
         '• <mark>KV cache</mark> at generation time: we store the keys and values of past words so we do not recompute them.</p>')),
 q:[
   CQ("لو طول الجملة زاد من 1,000 لـ 3,000 tokens، تكلفة الـ attention بتزيد تقريبًا كام مرة؟","If the sequence grows from 1,000 to 3,000 tokens, roughly how many times does the attention cost grow?",
      [["3 مرات","3 times"],["27 مرة","27 times"],["9 مرات","9 times"],["ما بتتغيرش","It does not change"]],
      2,"التكلفة بتزيد بالتربيع: 3 × 3 = 9.","The cost grows quadratically: 3 × 3 = 9."),
   CQ("ليه الـ FlashAttention بتدّي نفس النتيجة بالظبط وبرضه أسرع؟","Why does FlashAttention give exactly the same result and still run faster?",
   [["بتقرّب الـ softmax بحساب أبسط","It approximates the softmax with a simpler computation"],["بتحسب الـ attention على blocks في الذاكرة السريعة من غير تخزين مصفوفة n × n كاملة","It computes attention in blocks in fast memory without storing the full n × n matrix"],["بتشيل نص الكلمات من الجملة","It drops half of the words from the sentence"],["بتقلّل عدد الـ heads","It reduces the number of heads"]],
   1,"نفس الرياضيات، لكن القراءة والكتابة في الذاكرة البطيئة أقل بكتير.","Same math, but far fewer reads and writes to the slow memory.")
 ],
 f:[
   CF("ليه تكلفة الـ self-attention هي O(n²)؟ وإيه الحلول؟","Why is self-attention cost O(n²), and what are the fixes?",
      "لأن كل كلمة بتتقارن بكل كلمة (مصفوفة n × n). الحلول: FlashAttention (exact ومحسّن للذاكرة)، sparse و sliding-window، linear attention، و KV cache وقت التوليد.","Because every word is compared with every word (an n × n matrix). Fixes: FlashAttention (exact and memory-efficient), sparse and sliding-window attention, linear attention, and a KV cache at generation time."),
   CF("إيه هو الـ KV cache؟","What is the KV cache?",
   "وقت التوليد بنخزّن الـ keys والـ values للكلمات اللي فاتت علشان ما نحسبهاش من الأول في كل خطوة.","At generation time we store the keys and values of past words so we do not recompute them from scratch at every step.")
 ],
 terms:[
   
   {t:B("FlashAttention","FlashAttention"),
 d:B("حساب attention دقيق (exact) على blocks في الذاكرة السريعة من غير تخزين مصفوفة n × n كاملة.","Exact attention computed in blocks in fast memory without storing the full n × n matrix.")},
   {t:B("Sliding-window attention","Sliding-window attention"),
 d:B("كل كلمة بتبص على نافذة محلية من الكلمات اللي حواليها بس.","Each word attends only to a local window of nearby words.")}
 ]},

{id:"l8-recap",t:B("Recap: الـ Transformer في صفحة","Recap: the Transformer on one page"),
 b:B('<p><mark>5 نقاط:</mark></p>'+
     '<p>1. الـ subword tokenization (BPE) بيشيل الـ OOV وبيخلّي طول الجملة معقول.<br>'+
     '2. الـ attention بمصفوفات، والـ multi-head بيقسّم البُعد على h، و GQA و MQA بيتشاركوا K/V لتصغير الـ KV cache.<br>'+
     '3. الـ attention مش بيعرف الترتيب، فبنضيف positional encodings (sinusoidal أو learned أو relative زي RoPE).<br>'+
     '4. الـ block: LayerNorm، attention، residual، وبعدين LayerNorm، FFN، residual (Pre-LN). حوالي 12d² parameters، ثلثينهم في الـ FFN.<br>'+
     '5. الـ decoder بيستخدم causal mask فكل المواضع بتتدرّب بالتوازي. والتكلفة O(n²d) محتاجة FlashAttention و KV cache.</p>'+
     '<div class="m">Attention = softmax(Q K^T / sqrt(d_k)) V\nd_k = d / h\nx = x + MHA(LN(x));  x = x + FFN(LN(x))\nparams per block = 12 d^2</div>'+
     '<p><mark>قبل المحاضرة الجاية:</mark> لازم تعرف تحسب <code>d_k = d / h</code> وعدد الـ parameters في block، وتشرح ليه الـ mask بيخلّي التدريب متوازي. المحاضرة الجاية بتبني على كده: الـ pretraining لـ Transformers على نصوص ضخمة.</p>',
     '<p><mark>Five takeaways:</mark></p>'+
     '<p>1. Subword tokenization (BPE) removes OOV and keeps sequences a reasonable length.<br>'+
     '2. Attention runs on matrices, multi-head splits the dimension across h heads, and GQA and MQA share K/V to shrink the KV cache.<br>'+
     '3. Attention does not know order, so we add positional encodings (sinusoidal, learned or relative such as RoPE).<br>'+
     '4. The block: LayerNorm, attention, residual, then LayerNorm, FFN, residual (Pre-LN). About 12d² parameters, two thirds of them in the FFN.<br>'+
     '5. The decoder uses a causal mask so all positions train in parallel. The O(n²d) cost calls for FlashAttention and a KV cache.</p>'+
     '<div class="m">Attention = softmax(Q K^T / sqrt(d_k)) V\nd_k = d / h\nx = x + MHA(LN(x));  x = x + FFN(LN(x))\nparams per block = 12 d^2</div>'+
     '<p><mark>Before the next lecture:</mark> you should be able to compute <code>d_k = d / h</code> and the parameters in a block, and explain why the mask makes training parallel. The next lecture builds on this: pretraining Transformers on huge amounts of text.</p>'),
 q:[
   CQ("إيه اللي بيخلّي الـ Transformer decoder يتدرّب على الجملة كلها مرة واحدة من غير ما يشوف المستقبل؟","What lets a Transformer decoder train on the whole sentence at once without seeing the future?",
      [["الـ positional encodings","The positional encodings"],["الـ layer normalization","Layer normalization"],["الـ tokenization","Tokenization"],["الـ causal mask","The causal mask"]],
      3,"الـ mask بيحط -inf في خانات المستقبل، فكل موضع بيتنبأ لوحده والمواضع كلها بتتحسب بالتوازي.","The mask puts -inf in the future cells, so each position predicts on its own and all positions are computed in parallel."),
   CQ("لو d = 512، كام parameter في الـ FFN لـ block واحد (من غير biases)؟","If d = 512, how many parameters are in the FFN of one block (ignoring biases)?",
      [["262,144","262,144"],["1,048,576","1,048,576"],["2,097,152","2,097,152"],["524,288","524,288"]],
      2,"الـ FFN فيها 8d² = 8 × 262,144 = 2,097,152 (d × 4d و 4d × d).","The FFN has 8d² = 8 × 262,144 = 2,097,152 (d × 4d and 4d × d).")
 ],
 f:[
   CF("إيه مراحل الـ decoder-only Transformer من النص للمخرج؟","What are the stages of a decoder-only Transformer from text to output?",
      "Tokens، وبعدين embeddings + positional information، وبعدين L من الـ blocks (masked attention و FFN مع residual و LayerNorm)، وبعدين طبقة المخرج اللي بتتنبأ بالـ token الجاي.","Tokens, then embeddings + positional information, then L blocks (masked attention and FFN with residuals and LayerNorm), then an output layer that predicts the next token."),
   CF("إيه معادلة الـ attention وعدد parameters الـ block؟","What are the attention formula and the parameter count of a block?",
      "softmax(Q K^T / sqrt(d_k)) V، وحوالي 12d² parameters لكل block (4d² attention و 8d² FFN).","softmax(Q K^T / sqrt(d_k)) V, and about 12d² parameters per block (4d² attention and 8d² FFN).")
 ]}
]}
);

})();
