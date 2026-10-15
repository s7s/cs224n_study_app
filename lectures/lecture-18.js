/* Lecture 18: Scaling & Mixture of Experts
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L18 fig 1: scaling law on log-log axes, with an extrapolated point */
function l18LawFig(){
  var s='',i,x,y,Ls=[],xs=[],ys=[],lg=function(v){return Math.log(v)/Math.LN10;};
  var tk=['1e8','1e9','1e10','1e11','1e12'];
  for(i=0;i<5;i++){
    xs.push(64+i*68);
    Ls.push(2.0*Math.pow(Math.pow(10,i),-0.076));
  }
  for(i=0;i<5;i++){
    ys.push(36+(lg(2.0)-lg(Ls[i]))*(100/(lg(2.0)-lg(Ls[4]))));
  }
  s+='<line x1="40" y1="20" x2="40" y2="150" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+='<line x1="40" y1="150" x2="350" y2="150" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+=T(46,16,'loss (log scale)','tm','start','font-size:9.5px');
  for(i=0;i<4;i++){
    s+='<line x1="'+xs[i]+'" y1="'+ys[i]+'" x2="'+xs[i+1]+'" y2="'+ys[i+1]+'" style="stroke:var(--ac);stroke-width:2.2;'+(i===3?'stroke-dasharray:5 4;':'')+'"/>';
  }
  for(i=0;i<5;i++){
    if(i<4)s+=DOT(xs[i].toFixed(1),ys[i].toFixed(1),'ac',5);
    else s+='<circle cx="'+xs[i]+'" cy="'+ys[i].toFixed(1)+'" r="5.5" style="fill:var(--bg);stroke:var(--ok);stroke-width:2;stroke-dasharray:3 2"/>';
    s+=T(xs[i],(ys[i]-10).toFixed(1),Ls[i].toFixed(2),i===4?'tb':'tm','middle','font-size:9.5px'+(i===4?';fill:var(--ok)':''));
    s+=T(xs[i],164,tk[i],'tm','middle','font-size:9.5px');
  }
  s+=T(195,180,'parameters N (log scale)','tm','middle','font-size:10px');
  s+=T(316,106,'predicted','tb','middle','font-size:9.5px;fill:var(--ok)');
  s+=T(120,128,'measured on small runs','tm','middle','font-size:9.5px');
  s+=T(180,200,'each x10 in N  ->  loss x 0.84','tb','middle','font-size:10.5px');
  return s;
}

var FIG_L18_LAW=fig(210,l18LawFig(),
  B('على محورين log النقط بتقع على خط مستقيم ميله -alpha. بنقيس على موديلات صغيرة (الأزرق) ونمدّ الخط عشان نتوقّع loss الموديل الكبير (الأخضر) قبل ما ندرّبه. الأرقام توضيحية.',
    'On log-log axes the points fall on a straight line with slope -alpha. We measure small runs (blue) and extend the line to predict the loss of the big model (green) before training it. The numbers are illustrative.'));

/* L18 fig 2: where 6 N D comes from */
function l18FlopsFig(){
  var s='';
  s+=T(180,16,'FLOPs per token = (multiplier) x N','tm','middle','font-size:10px');
  s+=RECT(30,28,100,38,'var(--acs)','var(--ac)',6,1.6)+T(80,52,'2 N','tb','middle','font-size:12px');
  s+=RECT(130,28,100,38,'var(--okbg)','var(--ok)',6,1.6)+T(180,52,'2 N','tb','middle','font-size:12px');
  s+=RECT(230,28,100,38,'var(--okbg)','var(--ok)',6,1.6)+T(280,52,'2 N','tb','middle','font-size:12px');
  s+=T(80,82,'forward','tm','middle','font-size:9.5px');
  s+=T(180,82,'bwd: dL/dh','tm','middle','font-size:9.5px');
  s+=T(280,82,'bwd: dL/dW','tm','middle','font-size:9.5px');
  s+='<line x1="30" y1="92" x2="330" y2="92" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+=T(180,114,'total = 6 N per token  ->  C = 6 N D','tb','middle','font-size:11.5px');
  s+=T(180,136,'7B x 2T tokens = 8.4e22 FLOPs','tm','middle','font-size:10px');
  s+=T(180,152,'at 312e12 x 40% per GPU: 187k GPU-hours','tm','middle','font-size:10px');
  return s;
}

var FIG_L18_FLOPS=fig(166,l18FlopsFig(),
  B('كل token بيمرّ على كل parameter: الـ forward بـ 2 FLOPs، والـ backward ضعف الـ forward (gradient للـ activations وgradient للأوزان). المجموع 6 لكل parameter.',
    'Every token passes through every parameter: the forward costs 2 FLOPs, and the backward costs twice the forward (a gradient for the activations and a gradient for the weights). The total is 6 per parameter.'));

/* L18 fig 3: IsoFLOP U-shaped curve */
function l18IsoFig(){
  var s='',x,y,pts=[];
  s+='<line x1="36" y1="24" x2="36" y2="162" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+='<line x1="36" y1="162" x2="344" y2="162" style="stroke:var(--mu);stroke-width:1.4"/>';
  for(x=48;x<=324;x+=6){
    y=128-0.0032*(x-186)*(x-186);
    pts.push(x+','+y.toFixed(1));
  }
  s+='<polyline points="'+pts.join(' ')+'" style="fill:none;stroke:var(--ac);stroke-width:2.3"/>';
  s+='<line x1="186" y1="134" x2="186" y2="162" style="stroke:var(--ok);stroke-width:1.5;stroke-dasharray:4 4"/>';
  s+=DOT(186,128,'ok',6);
  s+=T(186,112,'D* = 20 N*','tb','middle','font-size:10.5px;fill:var(--ok)');
  s+=T(48,36,'N too small','tm','start','font-size:9.5px')+T(48,48,'(D huge)','tm','start','font-size:9.5px');
  s+=T(336,36,'N too big','tm','end','font-size:9.5px')+T(336,48,'(D tiny)','tm','end','font-size:9.5px');
  s+=T(46,20,'loss','tm','start','font-size:9.5px');
  s+=T(190,180,'model size N  (D = C / 6N, C fixed)','tm','middle','font-size:10px');
  s+=T(190,198,'N* = sqrt(C / 120)','tb','middle','font-size:10.5px');
  return s;
}

var FIG_L18_ISO=fig(206,l18IsoFig(),
  B('منحنى IsoFLOP: بنثبّت الحساب C ونغيّر حجم الموديل (والبيانات بتتغيّر عكسه). الـ loss على شكل U، وقاع الـ U هو التوزيع الأمثل بين الحجم والبيانات. الشكل توضيحي.',
    'An IsoFLOP curve: we fix the compute C and vary the model size (the data changes in the opposite direction). The loss is U-shaped, and the bottom of the U is the best split between size and data. The shape is illustrative.'));

/* L18 fig 4: one MoE layer, top-2 routing of one token */
function l18MoeFig(){
  var s='',r=[1.0,2.0,0.5,1.5],X=[10,98,186,274],cx=[48,136,224,312],ye=96,i,
      a=Math.exp(r[1]),b=Math.exp(r[3]),g2=(a/(a+b)).toFixed(2),g4=(b/(a+b)).toFixed(2),act;
  s+=RECT(130,194,100,24,'var(--sf)','var(--ln)',6,1.4)+T(180,210,'token x','tb','middle','font-size:10.5px');
  s+=AL(180,194,180,178,'mu','mM');
  s+=RECT(110,150,140,26,'var(--acs)','var(--ac)',6,1.6)+T(180,167,'router: W_r x','tb','middle','font-size:10.5px');
  for(i=0;i<4;i++){
    act=(i===1||i===3);
    s+=RECT(X[i],ye,76,34,act?'var(--okbg)':'var(--sf)',act?'var(--ok)':'var(--ln)',6,act?1.8:1.3);
    s+=T(cx[i],ye+15,'E'+(i+1),act?'tb':'tm','middle','font-size:11px');
    s+=T(cx[i],ye+28,'r = '+r[i].toFixed(1),'tm','middle','font-size:9px');
    s+=AL(180,150,cx[i],ye+36,act?'ok':'mu',act?'mG':'mM',!act);
  }
  s+=AL(136,ye,176,57,'ok','mG')+AL(312,ye,187,57,'ok','mG');
  s+=T(148,78,'x'+g2,'tb','end','font-size:9.5px;fill:var(--ok)');
  s+=T(262,78,'x'+g4,'tb','start','font-size:9.5px;fill:var(--ok)');
  s+='<circle cx="180" cy="46" r="11" style="fill:var(--sf);stroke:var(--ok);stroke-width:1.6"/>'+T(180,50,'+','tb','middle','font-size:12px');
  s+=AL(180,35,180,22,'ok','mG');
  s+=T(180,12,'y = '+g2+' E2(x) + '+g4+' E4(x)','tb','middle','font-size:10.5px');
  return s;
}

var FIG_L18_MOE=fig(226,l18MoeFig(),
  B('الـ router بيدّي كل expert درجة r. بنختار أعلى 2 (الأخضر)، وبنطبّق softmax عليهم عشان نطلّع أوزان الـ gates، وبنجمع ناتجهم. الـ experts التانيين مش بيشتغلوا لـ token ده.',
    'The router gives each expert a score r. We keep the top 2 (green), apply a softmax to just those to get the gate weights, and add their outputs. The other experts do not run for this token.'));

/* L18 fig 5: expert load, collapsed vs balanced, with capacity */
function l18LoadFig(){
  var s='',yb=170,k=1.2,cap=31,capY=yb-cap*k,L=[70,20,5,5],R=[25,25,25,25],i,v,x,pass;
  s+=T(90,18,'collapsed','tb','middle','font-size:11px')+T(270,18,'balanced','tb','middle','font-size:11px');
  s+=T(90,32,'39 tokens dropped','tm','middle','font-size:9.5px;fill:var(--no)');
  s+=T(270,32,'0 tokens dropped','tm','middle','font-size:9.5px;fill:var(--ok)');
  s+='<line x1="180" y1="40" x2="180" y2="192" style="stroke:var(--ln);stroke-width:1"/>';
  s+='<line x1="16" y1="'+capY+'" x2="170" y2="'+capY+'" style="stroke:var(--mu);stroke-width:1.2;stroke-dasharray:4 3"/>';
  s+='<line x1="196" y1="'+capY+'" x2="350" y2="'+capY+'" style="stroke:var(--mu);stroke-width:1.2;stroke-dasharray:4 3"/>';
  s+=T(170,(capY-4).toFixed(1),'capacity 31','tm','end','font-size:9px');
  s+=T(198,(capY-4).toFixed(1),'capacity 31','tm','start','font-size:9px');
  for(pass=0;pass<2;pass++){
    for(i=0;i<4;i++){
      v=pass?R[i]:L[i];x=(pass?204:24)+i*36;
      if(v>cap){
        s+=RECT(x,yb-cap*k,24,cap*k,'var(--ac)','none',2,1);
        s+=RECT(x,yb-v*k,24,(v-cap)*k,'var(--no)','none',2,1);
      }else s+=RECT(x,yb-v*k,24,v*k,'var(--ac)','none',2,1);
      s+=(v>=25&&v<=cap)?T(x+12,(yb-v*k+19).toFixed(1),v,'tb','middle','font-size:9.5px;fill:var(--bg)'):T(x+12,(yb-v*k-4).toFixed(1),v,'tb','middle','font-size:9.5px');
      s+=T(x+12,186,'E'+(i+1),'tm','middle','font-size:9.5px');
    }
  }
  s+=T(180,206,'100 tokens, top-1 routing, capacity factor 1.25','tm','middle','font-size:9.5px');
  return s;
}

var FIG_L18_LOAD=fig(214,l18LoadFig(),
  B('لو الـ router اتّجه لـ expert واحد، الـ tokens اللي فوق السعة (الأحمر) بتتسقط، والـ GPU بتاعته بيستناها الباقي. مع التوازن كل expert واخد حصة قريبة من 25.',
    'If the router collapses onto one expert, the tokens above its capacity (red) are dropped, and every other GPU waits for that one. With balance each expert gets a share close to 25.'));

/* L18 fig 6: active fraction of parameters per token */
function l18ActiveFig(){
  var s='',R=[['dense model: every parameter active',1.0,'100%','ac'],['Mixtral 8x7B: 12.9B of 46.7B',12.9/46.7,'28%','ok'],['DeepSeek-V3: 37B of 671B',37/671,'5.5%','ok']],i,y,w;
  for(i=0;i<3;i++){
    y=24+i*58;w=300*R[i][1];
    s+=T(30,y-6,R[i][0],'tm','start','font-size:10px');
    s+=RECT(30,y,300,22,'var(--sf)','var(--ln)',5,1.3);
    s+=RECT(30,y,w.toFixed(1),22,'var(--'+R[i][3]+')','none',5,1);
    if(i===0)s+=T(324,y+15,R[i][2],'tb','end','font-size:10.5px;fill:var(--bg)');
    else s+=T((30+w+8).toFixed(1),y+15,R[i][2],'tb','start','font-size:10.5px');
  }
  s+=T(180,186,'filled part = active per token, full bar = stored','tm','middle','font-size:9.5px');
  return s;
}

var FIG_L18_ACTIVE=fig(194,l18ActiveFig(),
  B('الـ MoE بيخزّن parameters كتير بس بيشغّل جزء صغير منها لكل token. الجزء الملوّن هو اللي بيتحسب، والبار كله هو اللي لازم يتخزّن في الذاكرة.',
    'An MoE stores many parameters but runs only a small part of them for each token. The colored part is what is computed, and the whole bar is what must sit in memory.'));

/* L18 fig 7: FlashAttention tiling between HBM and SRAM */
function l18FlashFig(){
  var s='',i,L=['Q','K','V','O'];
  s+=RECT(110,18,140,46,'var(--acs)','var(--ac)',8,1.6)+T(180,37,'SRAM: fast, ~20 MB','tb','middle','font-size:10.5px')+T(180,54,'one tile of Q, K, V','tm','middle','font-size:9.5px');
  s+=RECT(268,18,76,46,'var(--sf)','var(--no)',8,1.4)+T(306,37,'T x T scores','tm','middle','font-size:9.5px')+T(306,54,'never stored','tb','middle','font-size:9.5px;fill:var(--no)');
  s+=RECT(16,98,328,54,'var(--sf)','var(--ln)',8,1.4)+T(180,114,'HBM: slow, large (80 GB)','tm','middle','font-size:10px');
  for(i=0;i<4;i++){
    s+=RECT(34+i*76,122,56,22,i===3?'var(--okbg)':'var(--sf)',i===3?'var(--ok)':'var(--ln)',5,1.3)+T(62+i*76,137,L[i],'tb','middle','font-size:11px');
  }
  s+=AR(110,121,150,66,'ac','mA')+AR(186,121,170,66,'ac','mA');
  s+=AR(214,66,262,121,'ok','mG');
  s+=T(180,174,'load tiles -> running softmax -> write only O','tm','middle','font-size:10px');
  return s;
}

var FIG_L18_FLASH=fig(184,l18FlashFig(),
  B('الـ FlashAttention بيحمّل tile صغير من Q وK وV في الـ SRAM السريعة، ويحسب الـ softmax بشكل تراكمي، ويكتب الناتج O بس في الـ HBM. المصفوفة T x T مبتتخزّنش أبدًا.',
    'FlashAttention loads one small tile of Q, K and V into the fast SRAM, computes the softmax incrementally, and writes only the output O back to HBM. The T x T matrix is never stored.'));

/* L18 fig 8: weight memory of Mixtral at 16, 8 and 4 bits against one 80 GB GPU */
function l18QuantFig(){
  var s='',R=[['bf16 (16 bit): 93 GB',46.7*2,'no'],['int8 (8 bit): 47 GB',46.7,'ac'],['int4 (4 bit): 23 GB',46.7/2,'ok']],i,y,w,x0=30,k=2.8;
  s+=T(180,14,'Mixtral 8x7B weights, 46.7B parameters','tm','middle','font-size:10px');
  for(i=0;i<3;i++){
    y=34+i*38;w=R[i][1]*k;
    s+=T(x0,y-5,R[i][0],'tm','start','font-size:10px');
    s+=RECT(x0,y,w.toFixed(1),20,'var(--'+R[i][2]+')','none',5,1);
  }
  s+='<line x1="'+(x0+80*k)+'" y1="22" x2="'+(x0+80*k)+'" y2="140" style="stroke:var(--mu);stroke-width:1.5;stroke-dasharray:4 3"/>';
  s+=T(x0+80*k,154,'one 80 GB GPU','tb','middle','font-size:9.5px');
  return s;
}

var FIG_L18_QUANT=fig(162,l18QuantFig(),
  B('نفس الموديل بـ 16 و8 و4 bit. الـ bf16 أكبر من GPU واحدة 80 GB (الخط المنقّط)، والـ int8 والـ int4 بيدخلوا. الأرقام للأوزان بس، من غير الـ KV cache والـ activations.',
    'The same model at 16, 8 and 4 bits. The bf16 version is larger than one 80 GB GPU (the dashed line), while int8 and int4 fit. The numbers are for the weights only, without the KV cache and the activations.'));

/* L18 fig 9: attention looks at the whole past, an SSM carries one fixed-size state */
function l18SsmFig(){
  var s='',i,x,xs=[];
  for(i=0;i<5;i++)xs.push(30+i*62);
  s+=T(180,14,'attention: every token looks at all previous tokens','tb','middle','font-size:10px');
  for(i=0;i<5;i++){
    s+=RECT(xs[i],44,40,22,i===4?'var(--acs)':'var(--sf)',i===4?'var(--ac)':'var(--ln)',5,1.3)+T(xs[i]+20,59,'t'+(i+1),'tm','middle','font-size:10px');
  }
  for(i=0;i<4;i++){
    s+='<path d="M'+(xs[4]+20)+' 44 Q'+((xs[4]+xs[i])/2+20)+' '+(18+(3-i)*2)+' '+(xs[i]+20)+' 44" style="fill:none;stroke:var(--ac);stroke-width:1.5;stroke-dasharray:4 3" marker-end="url(#mA)"/>';
  }
  s+=T(180,86,'time O(T^2), the KV cache grows with T','tm','middle','font-size:9.5px');
  s+='<line x1="20" y1="98" x2="340" y2="98" style="stroke:var(--ln);stroke-width:1"/>';
  s+=T(180,116,'SSM: one fixed-size state, updated per token','tb','middle','font-size:10px');
  for(i=0;i<5;i++){
    s+=RECT(xs[i],130,40,22,'var(--okbg)','var(--ok)',5,1.4)+T(xs[i]+20,145,'h'+(i+1),'tb','middle','font-size:10px');
    if(i<4)s+=AR(xs[i]+40,141,xs[i+1],141,'ok','mG');
  }
  s+=T(180,174,'time O(T), constant memory at inference','tm','middle','font-size:9.5px');
  return s;
}

var FIG_L18_SSM=fig(184,l18SsmFig(),
  B('فوق: الـ attention بيربط كل token بكل اللي قبله. تحت: الـ SSM بيمرّر حالة h بحجم ثابت من token للي بعده، فالذاكرة مبتكبرش مع الطول.',
    'Top: attention links every token to everything before it. Bottom: an SSM passes a hidden state h of fixed size from one token to the next, so the memory does not grow with the length.'));

/* ---------- Lecture content ---------- */
/* Numbers for the open-questions card, computed here and never typed by hand. */
var OQ=(function(){
  function clean(x){return Number(x.toPrecision(6));}
  function sci(x){return clean(x).toExponential().replace('e+','e');}
  function tok(x){return x>=1e12?clean(x/1e12)+'T':clean(x/1e9)+'B';}
  var N1=1e12,D1=20*N1,C1=6*N1*D1;      /* body example: 1T parameters */
  var N2=3e11,D2=20*N2,C2=6*N2*D2;      /* quiz: 300B parameters */
  return {
    n1:tok(N1)+' parameters', d1:sci(D1), d1t:tok(D1), c1:sci(C1),
    n2:tok(N2), d2:sci(D2), d2t:tok(D2), c2:sci(C2),
    wrong6N:tok(6*N2), wrong10D:tok(10*D2), wrong2N:tok(2*N2)
  };
})();

(window.LECS=window.LECS||[]).push(
{id:18,t:B("Scaling و Mixture of Experts","Scaling & Mixture of Experts"),cards:[

{id:"l18-lawsscaling",t:B("قوانين الـ scaling: الأداء بيتحسّن بانتظام","Scaling laws: performance improves predictably"),
 b:cat(B('<p>في محاضرة 9 شفنا إن الـ loss بينزل في خط مستقيم تقريبًا على محورين log. هنا نفهم ده بالتفصيل، لأنه هو اللي خلّى الشركات تصرف ملايين على تدريب موديل <mark>قبل</mark> ما تعرف نتيجته. دراسة Kaplan وزمايله (OpenAI، 2020) لقت إن الـ test loss بيتبع <mark>power law</mark> في تلات حاجات، طالما واحدة بس فيهم هي العنق:<br>• <code>N</code>: عدد الـ parameters (من غير الـ embeddings).<br>• <code>D</code>: عدد الـ tokens في التدريب.<br>• <code>C</code>: الحساب بالـ FLOPs.</p>'+
         '<div class="m">L(N) = (N_c / N)^alpha_N    alpha_N ~ 0.076\nL(D) = (D_c / D)^alpha_D    alpha_D ~ 0.095\nL(C) = (C_c / C)^alpha_C    alpha_C ~ 0.050</div>'+
         '<p>الأسس دي تقريبية وصغيرة، يعني التحسّن بطيء بس <mark>منتظم</mark> على أكتر من 7 مراتب حجم. ولو أخدنا log للطرفين بنحصل على خط مستقيم:</p>'+
         '<div class="m">log L = alpha * log N_c - alpha * log N\n\nstraight line, slope = -alpha</div>',
         '<p>In lecture 9 we saw that the loss falls roughly along a straight line on log-log axes. Here we look at it in detail, because it is what lets companies spend millions on training a model <mark>before</mark> they know the result. Kaplan et al. (OpenAI, 2020) found that the test loss follows a <mark>power law</mark> in three quantities, as long as only one of them is the bottleneck:<br>• <code>N</code>: the number of parameters (excluding embeddings).<br>• <code>D</code>: the number of training tokens.<br>• <code>C</code>: the compute in FLOPs.</p>'+
         '<div class="m">L(N) = (N_c / N)^alpha_N    alpha_N ~ 0.076\nL(D) = (D_c / D)^alpha_D    alpha_D ~ 0.095\nL(C) = (C_c / C)^alpha_C    alpha_C ~ 0.050</div>'+
         '<p>These exponents are approximate and small, so the improvement is slow but <mark>steady</mark> across more than 7 orders of magnitude. Taking the log of both sides gives a straight line:</p>'+
         '<div class="m">log L = alpha * log N_c - alpha * log N\n\nstraight line, slope = -alpha</div>'),
       FIG_L18_LAW,
       B('<p>إزاي نستخدمها؟</p>',
         '<p>How do we use it?</p>')),
 q:[
   CQ("لو alpha_N = 0.076، لما نكبّر عدد الـ parameters 10 أضعاف، الـ loss بيتضرب في تقريبًا كام؟","If alpha_N = 0.076, when we make the parameter count 10 times larger, the loss is multiplied by roughly what?",
      [["0.10","0.10"],["0.50","0.50"],["0.84","0.84"],["1.19","1.19"]],
      2,"الحساب: 10 أس (-0.076) = 0.84، يعني الـ loss بيقل حوالي 16% مع كل 10 أضعاف. الاختيار 1.19 هو 10 أس (+0.076) وده غلط في الإشارة.","The calculation: 10 to the power -0.076 = 0.84, so the loss falls about 16% for every 10x. The option 1.19 is 10 to the power +0.076, a sign error."),
   CQ("على محورين log، الـ power law بتظهر على شكل...","On log-log axes, a power law shows up as...", [["منحنى U","a U-shaped curve"],["دايرة","a circle"],["خط مستقيم ميله -alpha","a straight line with slope -alpha"],["خط أفقي","a horizontal line"]], 2,"لو أخدنا log للطرفين في L = (N_c / N)^alpha بنحصل على log L = alpha log N_c - alpha log N، وده خط مستقيم ميله -alpha.","Taking the log of both sides of L = (N_c / N)^alpha gives log L = alpha log N_c - alpha log N, a straight line with slope -alpha.")
 ],
 f:[
   CF("إيه هو الـ scaling law وإزاي نستخدمه قبل التدريب؟","What is a scaling law, and how do we use it before training?",
      "الـ loss بيتبع power law في N و D و C: L = (N_c / N)^alpha، فعلى محورين log بيبقى خط مستقيم ميله -alpha. بندرّب موديلات صغيرة، نعمل regression على الـ log، ونمدّ الخط عشان نتوقّع loss الموديل الكبير. الحدود: الـ loss مش هو القدرة، وفيه irreducible loss.","The loss follows a power law in N, D and C: L = (N_c / N)^alpha, so on log-log axes it is a straight line with slope -alpha. We train small models, regress on the logs, and extend the line to predict the loss of the big model. Limits: loss is not ability, and there is an irreducible loss."),
   CF("إيه معنى N وD وC في قوانين الـ scaling؟","What do N, D and C mean in scaling laws?",
   "N عدد الـ parameters (من غير الـ embeddings)، D عدد الـ tokens في التدريب، C الحساب بالـ FLOPs. الـ test loss بيتبع power law في كل واحد منهم لما يكون هو العنق.","N is the number of parameters (excluding embeddings), D the number of training tokens, and C the compute in FLOPs. The test loss follows a power law in each of them when it is the bottleneck.")
 ],
 terms:[
   {t:B("Scaling law","Scaling law"),
 d:B("علاقة منتظمة: الـ loss بينزل بشكل متوقع لما نكبّر الـ parameters والبيانات والحساب.","A regular relation: the loss falls predictably as we grow parameters, data and compute.")},
{t:B("Power law","Power law"),
 d:B("علاقة على شكل <code>y = c * x^a</code>، بتطلع خط مستقيم على محورين log.","A relation of the form <code>y = c * x^a</code>, which appears as a straight line on log-log axes.")}
 ]},

{id:"l18-scaling-use",
 t:B("نستخدم الـ scaling law: التوقّع وحدوده","Using a scaling law: prediction and its limits"),
 b:cat(B('<p>نفترض إننا درّبنا موديلات صغيرة وقسنا الـ loss، ونفرض إن موديل 100M parameter طلع <code>L = 2.00</code>. وقيمة <code>alpha_N = 0.076</code>:</p>'+
         '<div class="m">10x params -> loss x 10^(-0.076)\n                    = x 0.84\n\nN = 1e8   L = 2.00\nN = 1e9   L = 2.00 * 0.84 = 1.68\nN = 1e10  L = 1.41\nN = 1e11  L = 1.18\nN = 1e12  L = 0.99   (predicted)</div>'+
         '<p>الخطوات عمليًا: ندرّب 4 أو 5 موديلات صغيرة، نعمل <mark>linear regression</mark> على الـ log، نقرا الميل، ونمدّ الخط. الأرقام فوق توضيحية، والـ loss الحقيقي له حد أدنى. عشان كده الصيغة الواقعية <code>L = E + A / N^alpha</code>، حيث <mark>E</mark> هو الـ irreducible loss (عشوائية النص نفسه) والجزء اللي بينزل هو الباقي.</p>'+
         '<p>تحفظات مهمة:<br>• الـ loss مش هو القدرة. loss أقل بيتوافق مع أداء أحسن على أغلب الـ benchmarks، بس مش بشكل سلس دايمًا.<br>• فيه نقاش حوالين <mark>emergent abilities</mark> (Wei وزمايله، 2022): قدرات بتظهر فجأة مع الحجم. Schaeffer وزمايله (2023) قالوا إن جزء كبير من الفجأة دي سببه مقاييس صح/غلط زي exact match، والمسألة لسه فيها خلاف.<br>• Kaplan لقى إن شكل الموديل (عمق أو عرض) تأثيره بسيط بالنسبة للحجم الكلي.</p>',
         '<p>Suppose we trained small models and measured the loss, and a 100M-parameter model gave <code>L = 2.00</code>. With <code>alpha_N = 0.076</code>:</p>'+
         '<div class="m">10x params -> loss x 10^(-0.076)\n                    = x 0.84\n\nN = 1e8   L = 2.00\nN = 1e9   L = 2.00 * 0.84 = 1.68\nN = 1e10  L = 1.41\nN = 1e11  L = 1.18\nN = 1e12  L = 0.99   (predicted)</div>'+
         '<p>In practice: train 4 or 5 small models, run a <mark>linear regression</mark> on the logs, read the slope, and extend the line. The numbers above are illustrative, and a real loss has a floor. That is why the realistic form is <code>L = E + A / N^alpha</code>, where <mark>E</mark> is the irreducible loss (the randomness of the text itself) and the part that falls is the rest.</p>'+
         '<p>Important caveats:<br>• Loss is not ability. A lower loss goes with better performance on most benchmarks, but not always smoothly.<br>• There is a debate about <mark>emergent abilities</mark> (Wei et al., 2022): abilities that appear suddenly with scale. Schaeffer et al. (2023) argued that much of the suddenness comes from all-or-nothing metrics like exact match, and the question is still disputed.<br>• Kaplan found that the shape of the model (depth or width) matters little compared with its total size.</p>')),
 q:[
  CQ("موديل 100M parameter طلع L = 2.00، و alpha_N = 0.076. الـ loss المتوقع لموديل 10B parameter تقريبًا؟","A 100M-parameter model gave L = 2.00, and alpha_N = 0.076. About what loss do we predict for a 10B-parameter model?", [["1.41","1.41"],["1.68","1.68"],["1.18","1.18"],["0.84","0.84"]], 0,"من 100M لـ 10B هو 100 ضعف، يعني خطوتين كل واحدة 10 أضعاف. كل خطوة بتضرب الـ loss في 0.84، فالنتيجة 2.00 × 0.84 × 0.84 = 1.41. الاختيار 1.68 خطوة واحدة بس.","From 100M to 10B is 100x, so two steps of 10x. Each step multiplies the loss by 0.84, so the result is 2.00 × 0.84 × 0.84 = 1.41. The option 1.68 is only one step."),
  CQ("ليه الصيغة الواقعية L = E + A / N^alpha فيها الحد E؟","Why does the realistic form L = E + A / N^alpha include the term E?", [["لأن E هو عدد الـ experts","Because E is the number of experts"],["عشان نصلّح الـ overfitting","To fix overfitting"],["عشان الخط يبقى مستقيم على محور عادي","To make the line straight on a normal axis"],["لأن الـ loss مبيوصلش صفر: E هو الـ irreducible loss، يعني عشوائية النص نفسه","Because the loss never reaches zero: E is the irreducible loss, the randomness of the text itself"]], 3,"حتى موديل ضخم جدًا مش هيتنبّأ بالنص بالظبط لأن النص نفسه فيه عشوائية. الجزء اللي بينزل مع الحجم هو الباقي بعد E.","Even a huge model cannot predict text exactly, because the text itself is random. The part that falls with size is what remains above E.")
 ],
 f:[
  CF("إيه حدود الـ scaling law؟","What are the limits of a scaling law?",
     "الـ loss مش هو القدرة، وفيه irreducible loss (حد أدنى)، والنقاش لسه قايم حوالين الـ emergent abilities (جزء منها سببه مقاييس صح/غلط). وشكل الموديل تأثيره بسيط قدام الحجم الكلي.","Loss is not ability, there is an irreducible loss (a floor), and the debate about emergent abilities continues (part of it comes from all-or-nothing metrics). The shape of the model matters little next to its total size."),
  CF("إزاي نتوقّع loss موديل كبير قبل ما ندرّبه؟","How do we predict the loss of a big model before training it?",
     "ندرّب 4 أو 5 موديلات صغيرة، نعمل linear regression على الـ log، نقرا الميل، ونمدّ الخط. كل 10 أضعاف في N بتضرب الـ loss في 10^(-alpha).","Train 4 or 5 small models, run a linear regression on the logs, read the slope, and extend the line. Every 10x in N multiplies the loss by 10^(-alpha).")
 ],
 terms:[
  {t:B("Irreducible loss","Irreducible loss"),d:B("الحد الأدنى للـ loss (الحد E): عشوائية النص نفسه، ومهما كبّرنا الموديل مبينزلش تحته.","The floor of the loss (the term E): the randomness of the text itself, which no model size can go below.")},
  {t:B("Emergent abilities","Emergent abilities"),d:B("قدرات بتظهر فجأة مع الحجم. فيه خلاف إن جزء منها سببه مقاييس صح/غلط زي exact match.","Abilities that seem to appear suddenly with scale. It is disputed, since part of it comes from all-or-nothing metrics like exact match.")}
 ]},

{id:"l18-compute",t:B("حساب الـ compute: ليه C = 6ND","Compute accounting: why C = 6ND"),
 b:cat(B('<p>عشان نخطّط لتدريب لازم نحوّل (N, D) لـ FLOPs ووقت GPU. القاعدة بتيجي من العدّ البسيط: كل token بيمرّ على كل parameter في الـ forward مرة، بضرب وجمع، يعني <mark>2 FLOPs لكل parameter</mark>. الـ backward بيحسب حاجتين: gradient بالنسبة للـ activations (عشان نكمّل رجوع) وgradient بالنسبة للأوزان. كل واحدة بتكلّف تقريبًا زي الـ forward، فالـ backward حوالي <mark>4 FLOPs</mark>.</p>'+
         '<div class="m">forward   2 N D\nbackward  4 N D\n\nC ~ 6 N D</div>',
         '<p>To plan a training run we must turn (N, D) into FLOPs and GPU time. The rule comes from simple counting: every token passes through every parameter once in the forward pass, with a multiply and an add, so <mark>2 FLOPs per parameter</mark>. The backward pass computes two things: the gradient with respect to the activations (to keep going backward) and the gradient with respect to the weights. Each costs about the same as the forward, so the backward is about <mark>4 FLOPs</mark>.</p>'+
         '<div class="m">forward   2 N D\nbackward  4 N D\n\nC ~ 6 N D</div>'),
       FIG_L18_FLOPS,
       B('<p>التقريب بيتجاهل تكلفة الـ attention على الـ sequences الطويلة، وده صغير لو الـ context قصير. بعد كده بنحوّل FLOPs لوقت:</p>'+
         '<div class="m">time = C / (n_gpu * peak * MFU)\n\nMFU = achieved FLOPs / peak FLOPs\n      usually 30% to 50%</div>'+
         '<p>الـ <mark>MFU</mark> (Model FLOPs Utilization) هو النسبة اللي بنستفيد بيها فعلًا من أقصى سرعة للـ GPU، والباقي بيضيع في الاتصال بين الـ GPUs وانتظار الذاكرة.</p>',
         '<p>The approximation ignores the cost of attention on long sequences, which is small when the context is short. Then we turn FLOPs into time:</p>'+
         '<div class="m">time = C / (n_gpu * peak * MFU)\n\nMFU = achieved FLOPs / peak FLOPs\n      usually 30% to 50%</div>'+
         '<p><mark>MFU</mark> (Model FLOPs Utilization) is the fraction of the GPU peak speed we actually use, and the rest is lost to communication between GPUs and waiting on memory.</p>')),
 q:[
   CQ("موديل 3B اتدرّب على 600B token. الحساب C تقريبًا بيساوي كام؟","A 3B model is trained on 600B tokens. About how much is the compute C?",
      [["1.8e21 FLOPs","1.8e21 FLOPs"],["1.08e22 FLOPs","1.08e22 FLOPs"],["3.6e21 FLOPs","3.6e21 FLOPs"],["2.16e22 FLOPs","2.16e22 FLOPs"]],
      1,"C = 6 × 3e9 × 6e11 = 1.08e22. الاختيار 3.6e21 هو الـ forward بس (2ND)، و 1.8e21 هو N × D من غير معامل.","C = 6 × 3e9 × 6e11 = 1.08e22. The option 3.6e21 is the forward pass only (2ND), and 1.8e21 is N × D with no multiplier."),
   CQ("الـ MFU بيقيس إيه؟","What does MFU measure?", [["حجم الـ batch","The batch size"],["نسبة الـ FLOPs اللي الموديل بيستفيد بيها فعلًا من أقصى سرعة للـ GPU","The fraction of the GPU peak FLOPs that the model actually uses"],["عدد الـ parameters","The number of parameters"],["نسبة الـ tokens اللي اتسقطت","The fraction of tokens dropped"]], 1,"MFU = achieved FLOPs / peak FLOPs. الباقي بيضيع في الاتصال بين الـ GPUs وانتظار الذاكرة، وغالبًا بيبقى 30 لـ 50%.","MFU = achieved FLOPs / peak FLOPs. The rest is lost to communication between GPUs and waiting on memory, and it is usually 30 to 50%.")
 ],
 f:[
   CF("منين جت 6 في C = 6ND، وإزاي نحوّلها لوقت؟","Where does the 6 in C = 6ND come from, and how do we turn it into time?",
      "الـ forward بـ 2 FLOPs لكل parameter لكل token، والـ backward ضعفه (4) لأنه بيحسب gradient للـ activations وللأوزان. الوقت = C / (عدد الـ GPUs × peak × MFU)، والـ MFU غالبًا 30 لـ 50%.","The forward costs 2 FLOPs per parameter per token, and the backward costs twice that (4) because it computes a gradient for the activations and for the weights. Time = C / (n_gpu × peak × MFU), and MFU is usually 30 to 50%."),
   CF("إيه هو الـ MFU؟","What is MFU?",
   "Model FLOPs Utilization: النسبة اللي بنستخدمها فعلًا من أقصى FLOPs للـ GPU. غالبًا 30 لـ 50%، والوقت = C / (n_gpu × peak × MFU).","Model FLOPs Utilization: the fraction of the GPU peak FLOPs we actually use. Usually 30 to 50%, and time = C / (n_gpu × peak × MFU).")
 ],
 terms:[
   {t:B("MFU (Model FLOPs Utilization)","MFU (Model FLOPs Utilization)"),d:B("النسبة اللي الموديل بيستخدمها فعلًا من أقصى FLOPs للـ GPU. غالبًا 30 لـ 50%.","The fraction of the GPU peak FLOPs that the model actually uses. Usually 30 to 50%.")},
{t:B("Compute budget (C)","Compute budget (C)"),d:B("إجمالي الحساب بالـ FLOPs لتدريب موديل، بنقدّره بـ <code>C = 6 N D</code>.","The total compute in FLOPs to train a model, estimated as <code>C = 6 N D</code>.")}
 ]},

{id:"l18-compute-gpus",
 t:B("تكلفة التدريب بالـ GPU-hours وتوزيعه على أكتر من GPU","Training cost in GPU-hours, and splitting it across GPUs"),
 b:cat(B('<p>مثال: موديل 7B على 2T token:</p>'+
         '<div class="m">C = 6 * 7e9 * 2e12 = 8.4e22 FLOPs\n\nA100 bf16 peak = 312e12\nat MFU 40%  -> 1.25e14 per GPU\n\nGPU-seconds = 8.4e22 / 1.25e14\n            = 6.7e8\nGPU-hours   = ~187,000\non 1024 GPUs = ~183 hours\n             = ~7.6 days</div>'+
         '<p>الرقم قريب من اللي Meta نشرته لـ Llama 2 7B (حوالي 184 ألف A100-hour). ودي طريقة تقدّر بيها التكلفة قبل ما تبدأ.</p>'+
         '<p>ليه بنحتاج أكتر من GPU؟ زي ما شفنا في محاضرة 11، التدريب بـ Adam بيحتاج حوالي 16 byte لكل parameter، يعني 7B بتاخد 112 GB، أكتر من ذاكرة GPU واحدة (80 GB) قبل الـ activations. فبنوزّع الشغل بتلات طرق أساسية:</p>'+
         '<div class="m">data parallel    split the batch,\n                 average gradients\nFSDP / ZeRO      shard weights, grads and\n                 optimizer states\ntensor parallel  split each matrix across\n                 GPUs (needs fast links)\npipeline         split layers into stages,\n                 feed micro-batches</div>'+
         '<p>الأنظمة الكبيرة بتدمج أكتر من طريقة مع بعض. وفي الـ MoE هتتضاف طريقة رابعة (expert parallelism) في كارت مقايضات الـ MoE.</p>',
         '<p>Example: a 7B model on 2T tokens:</p>'+
         '<div class="m">C = 6 * 7e9 * 2e12 = 8.4e22 FLOPs\n\nA100 bf16 peak = 312e12\nat MFU 40%  -> 1.25e14 per GPU\n\nGPU-seconds = 8.4e22 / 1.25e14\n            = 6.7e8\nGPU-hours   = ~187,000\non 1024 GPUs = ~183 hours\n             = ~7.6 days</div>'+
         '<p>This is close to what Meta reported for Llama 2 7B (about 184 thousand A100-hours). It is how you estimate the cost before you start.</p>'+
         '<p>Why more than one GPU? As we saw in lecture 11, training with Adam needs about 16 bytes per parameter, so 7B takes 112 GB, more than one GPU holds (80 GB) before activations. So we split the work in three main ways:</p>'+
         '<div class="m">data parallel    split the batch,\n                 average gradients\nFSDP / ZeRO      shard weights, grads and\n                 optimizer states\ntensor parallel  split each matrix across\n                 GPUs (needs fast links)\npipeline         split layers into stages,\n                 feed micro-batches</div>'+
         '<p>Large systems combine several of these. With MoE a fourth way (expert parallelism) is added in the MoE trade-offs card.</p>')),
 q:[
  CQ("موديل 13B على 1T token، A100 بـ peak = 312e12 وMFU = 40%. عدد الـ GPU-hours تقريبًا؟","A 13B model on 1T tokens, an A100 with peak = 312e12 and MFU = 40%. About how many GPU-hours?", [["87,000","87,000"],["347,000","347,000"],["174,000","174,000"],["625,000","625,000"]], 2,"C = 6 × 13e9 × 1e12 = 7.8e22. السرعة الفعلية = 312e12 × 0.4 = 1.25e14. الثواني = 7.8e22 / 1.25e14 = 6.2e8، يعني حوالي 174 ألف ساعة. الاختيار 625,000 بيطلع لو قسمنا الثواني على 1000 بدل 3600.","C = 6 × 13e9 × 1e12 = 7.8e22. The achieved speed = 312e12 × 0.4 = 1.25e14. Seconds = 7.8e22 / 1.25e14 = 6.2e8, which is about 174 thousand hours. The option 625,000 comes from dividing the seconds by 1000 instead of 3600."),
  CQ("ليه موديل 7B متدرّب بـ Adam مبيتدرّبش على GPU واحدة 80 GB؟","Why can a 7B model trained with Adam not be trained on one 80 GB GPU?", [["لأن الأوزان + الـ gradients + حالة الـ optimizer حوالي 16 byte لكل parameter، يعني 112 GB قبل الـ activations","Because the weights + gradients + optimizer state take about 16 bytes per parameter, so 112 GB before the activations"],["لأن الـ GPU مش بتدعم الـ backward","Because the GPU does not support the backward pass"],["لأن 7B أكبر من الـ vocabulary","Because 7B is larger than the vocabulary"],["لأن الـ MFU بيبقى صفر","Because the MFU is zero"]], 0,"16 byte × 7e9 = 112 GB، أكتر من 80 GB. عشان كده بنوزّع الأوزان وحالة الـ optimizer (FSDP / ZeRO) أو بنقسم الموديل.","16 bytes × 7e9 = 112 GB, more than 80 GB. That is why we shard the weights and the optimizer state (FSDP / ZeRO) or split the model.")
 ],
 f:[
  CF("إيه طرق توزيع التدريب على أكتر من GPU؟","What are the ways to split training across GPUs?",
     "Data parallel (نقسم الـ batch)، FSDP / ZeRO (نقسم الأوزان والـ gradients وحالة الـ optimizer)، tensor parallel (نقسم كل مصفوفة)، pipeline (نقسم الـ layers على مراحل). وفي الـ MoE بيتضاف expert parallelism.","Data parallel (split the batch), FSDP / ZeRO (shard the weights, gradients and optimizer state), tensor parallel (split each matrix), pipeline (split the layers into stages). With MoE, expert parallelism is added."),
  CF("إزاي نقدّر GPU-hours لتدريب موديل؟","How do we estimate the GPU-hours of a training run?",
     "نحسب C = 6ND، وبعدين GPU-seconds = C / (peak × MFU)، ونقسم على 3600 علشان نجيب الساعات.",
     "We compute C = 6ND, then GPU-seconds = C / (peak × MFU), and divide by 3600 to get hours.")
 ],
 terms:[
  {t:B("Data parallelism","Data parallelism"),d:B("كل GPU عندها نسخة كاملة من الموديل وبتاخد جزء من الـ batch، وبنعمل متوسط للـ gradients.","Every GPU holds a full copy of the model and takes part of the batch, and the gradients are averaged.")},
  {t:B("FSDP / ZeRO","FSDP / ZeRO"),d:B("بنقسم (shard) الأوزان والـ gradients وحالة الـ optimizer على الـ GPUs بدل ما كل GPU تشيلهم كلهم.","The weights, gradients and optimizer state are sharded across GPUs instead of every GPU holding all of them.")},
  {t:B("Tensor parallelism","Tensor parallelism"),d:B("بنقسم كل مصفوفة أوزان على أكتر من GPU، وبتحتاج روابط سريعة بينهم.","Each weight matrix is split across several GPUs, which needs fast links between them.")},
  {t:B("Pipeline parallelism","Pipeline parallelism"),d:B("بنقسم الـ layers لمراحل، وكل مرحلة على GPU، وبنغذّيها بـ micro-batches.","The layers are split into stages, one stage per GPU, fed with micro-batches.")}
 ]},

{id:"l18-flashattn",
 t:B("الـ attention والـ context الطويل: FlashAttention وـ KV cache","Attention and long context: FlashAttention and the KV cache"),
 b:cat(
   B('<p>قاعدة 6ND بتتجاهل الـ attention، وتكلفته بتكبر بمربع طول الـ sequence <code>T</code>. مصفوفة الـ scores فيها <code>T^2</code> خانة لكل head: عند T = 32,768 دي حوالي 1.07e9 خانة، يعني حوالي 2 GB بـ fp16 لو اتخزّنت. والعنق غالبًا مش الـ FLOPs، لكن نقل المصفوفة دي بين الـ HBM البطيئة والـ SRAM السريعة جوه الشريحة.</p>',
     '<p>The 6ND rule ignores attention, whose cost grows with the square of the sequence length <code>T</code>. The score matrix has <code>T^2</code> entries per head: at T = 32,768 that is about 1.07e9 entries, roughly 2 GB in fp16 if stored. The bottleneck is usually not the FLOPs but moving this matrix between the slow HBM and the fast on-chip SRAM.</p>'),
   FIG_L18_FLASH,
   B('<p><mark>FlashAttention</mark> (Dao وزمايله، 2022) بيحسب الـ attention على tiles ومحتفظ بـ softmax تراكمي، فالناتج <mark>دقيق</mark> (مش تقريب) والذاكرة بتنزل من O(T^2) لـ O(T). مثال: scores = 1, 2 وبعدين 4:</p>'+
     '<div class="m">block 1: m = 2, l = e^-1 + e^0 = 1.368\nblock 2: m = 4\n  l = e^(2-4) * 1.368 + e^0\n    = 0.135 * 1.368 + 1 = 1.185</div>'+
     '<p>نفس مقام الـ softmax الكامل (مضروب في e^-4). تاني حاجة: الـ <mark>KV cache</mark> بيكبر مع T: حوالي <code>2 × layers × d × bytes</code> لكل token. لموديل 7B (32 layer، d = 4096، fp16) ده 0.5 MB لكل token، فـ T = 32k بتاخد حوالي 17 GB لكل sequence.</p>',
     '<p><mark>FlashAttention</mark> (Dao et al., 2022) computes attention in tiles with a running softmax, so the result is <mark>exact</mark> (not an approximation) and memory falls from O(T^2) to O(T). Example: scores = 1, 2 and then 4:</p>'+
     '<div class="m">block 1: m = 2, l = e^-1 + e^0 = 1.368\nblock 2: m = 4\n  l = e^(2-4) * 1.368 + e^0\n    = 0.135 * 1.368 + 1 = 1.185</div>'+
     '<p>This equals the full softmax denominator (scaled by e^-4). Second cost: the <mark>KV cache</mark> grows with T, about <code>2 × layers × d × bytes</code> per token. For a 7B model (32 layers, d = 4096, fp16) that is 0.5 MB per token, so T = 32k takes about 17 GB per sequence.</p>')),
 q:[
  CQ("إيه اللي FlashAttention بيغيّره؟","What does FlashAttention change?", [["بيحسب attention تقريبي على tokens أقل","It computes an approximate attention over fewer tokens"],["بيشيل الـ softmax","It removes the softmax"],["بيحوّل الـ attention لـ RNN","It turns attention into an RNN"],["بيحسب نفس الـ attention بالظبط من غير ما يكتب مصفوفة T x T في الـ HBM","It computes exactly the same attention without writing the T x T matrix to HBM"]], 3,"الناتج هو نفسه بالظبط. الفرق في ترتيب الحساب: tiles في الـ SRAM وsoftmax تراكمي، فنقل الذاكرة بينزل جدًا.","The output is exactly the same. The difference is the order of computation: tiles in SRAM and an incremental softmax, so memory traffic drops a lot."),
  CQ("موديل 7B (32 layer، d = 4096، fp16): حجم الـ KV cache لـ sequence طولها 8,192 تقريبًا؟","For a 7B model (32 layers, d = 4096, fp16), about how large is the KV cache for a sequence of length 8,192?", [["1 GB","1 GB"],["4.3 GB","4.3 GB"],["17 GB","17 GB"],["69 GB","69 GB"]], 1,"لكل token: 2 × 32 × 4096 × 2 byte = 524,288 byte (0.5 MB). × 8,192 = 4.3 GB. الاختيار 17 GB هو T = 32k.","Per token: 2 × 32 × 4096 × 2 bytes = 524,288 bytes (0.5 MB). × 8,192 = 4.3 GB. The option 17 GB is T = 32k.")
 ],
 f:[
  CF("ليه FlashAttention أسرع مع إنه نفس الـ FLOPs؟","Why is FlashAttention faster with the same FLOPs?",
     "لأن العنق نقل الذاكرة مش الحساب. بيحسب على tiles في الـ SRAM السريعة وبيدمج الـ softmax، فبيتجنّب كتابة وقراية مصفوفة T x T من الـ HBM. والناتج دقيق.","Because the bottleneck is memory traffic, not compute. It works on tiles in fast SRAM and fuses the softmax, so it avoids writing and reading a T x T matrix in HBM. The result is exact."),
  CF("إيه هو الـ KV cache وإزاي بيكبر؟","What is the KV cache and how does it grow?",
     "الـ K وV المحفوظين لكل token سابق في كل layer عشان مانعيدش حسابهم. بيكبر خطيًا مع T والـ batch: حوالي 2 × layers × d × bytes لكل token.","The stored K and V of every previous token in every layer so we do not recompute them. It grows linearly with T and the batch: about 2 × layers × d × bytes per token.")
 ],
 terms:[
  {t:B("FlashAttention","FlashAttention"),
 d:B("حساب attention دقيق (exact) على blocks في الذاكرة السريعة من غير تخزين مصفوفة n × n كاملة.","Exact attention computed in blocks in fast memory without storing the full n × n matrix.")},
  {t:B("KV cache","KV cache"),
 d:B("الـ keys والـ values المخزّنة للكلمات اللي فاتت وقت التوليد، علشان ما تتحسبش تاني.","The stored keys and values of past words at generation time, so they are not recomputed.")},
  {t:B("HBM / SRAM","HBM / SRAM"),d:B("HBM ذاكرة الـ GPU الكبيرة والبطيئة، والـ SRAM ذاكرة صغيرة وسريعة جوه الشريحة.","HBM is the large, slower GPU memory, and SRAM is the small, fast memory on the chip.")}
 ]},

{id:"l18-chinchilla",t:B("Chinchilla: نوزّع الحساب بين الحجم والبيانات","Chinchilla: splitting compute between size and data"),
 b:cat(B('<p>في محاضرة 9 شفنا القاعدة (حوالي 20 token لكل parameter). هنا نفهم منين جت. دراسة <mark>Chinchilla</mark> (Hoffmann وزمايله، DeepMind، 2022) درّبت أكتر من 400 موديل بأحجام وبيانات مختلفة، وسألت: لو عندي ميزانية حساب C ثابتة، أختار N و D بكام عشان أوصل لأقل loss؟ إحدى الطرق اسمها <mark>IsoFLOP</mark>: نثبّت C، ونجرّب أحجام مختلفة (والبيانات <code>D = C / 6N</code> بتتغيّر عكسها)، ونرسم الـ loss.</p>'+
         '<p>الشكل بيطلع حرف U: موديل صغير جدًا مهما اتدرّب على بيانات كتير مش هيستوعبها، وموديل كبير جدًا مش هنلحق نغذّيه ببيانات كفاية. قاع الـ U هو الأمثل. وكمان قدروا يفرضوا صيغة <code>L(N,D) = E + A / N^a + B / D^b</code>.</p>',
         '<p>In lecture 9 we saw the rule (about 20 tokens per parameter). Here we see where it comes from. The <mark>Chinchilla</mark> study (Hoffmann et al., DeepMind, 2022) trained more than 400 models of different sizes and data amounts, and asked: with a fixed compute budget C, how should I choose N and D to reach the lowest loss? One method is called <mark>IsoFLOP</mark>: fix C, try different model sizes (the data <code>D = C / 6N</code> changes in the opposite direction), and plot the loss.</p>'+
         '<p>The shape is a U: a model that is too small cannot absorb a lot of data, and a model that is too large cannot be fed enough data. The bottom of the U is the best choice. They also fitted the form <code>L(N,D) = E + A / N^a + B / D^b</code>.</p>'),
       FIG_L18_ISO,
       B('<p>النتيجة: الـ N الأمثل والـ D الأمثل بيكبروا <mark>بنفس المعدّل</mark> مع C (كل واحد تقريبًا بجذر C). ده بيختلف عن Kaplan اللي كان بيميل لتكبير الموديل أكتر.</p>',
         '<p>The result: the optimal N and the optimal D grow <mark>at the same rate</mark> with C (each roughly as the square root of C). This differs from Kaplan, who leaned toward growing the model more.</p>')),
 q:[
   CQ("منحنى IsoFLOP بيثبّت إيه؟","What does an IsoFLOP curve hold fixed?", [["حجم الموديل N","The model size N"],["كمية البيانات D","The data amount D"],["الحساب C","The compute C"],["الـ learning rate","The learning rate"]], 2,"بنثبّت C ونغيّر N، والـ D بيتغيّر عكسه (D = C / 6N). بعد كده بنرسم الـ loss.","We fix C and vary N, and D changes in the opposite direction (D = C / 6N). Then we plot the loss."),
CQ("الحساب C ثابت. لو ضاعفنا N، الـ D (= C / 6N) بيبقى...","The compute C is fixed. If we double N, the data D (= C / 6N) becomes...", [["النص","half"],["الضعف","double"],["نفسه","the same"],["الربع","a quarter"]], 0,"D = C / 6N، فلما N يتضاعف D بينزل للنص. عشان كده الـ loss على شكل U: موديل أكبر بيعني بيانات أقل.","D = C / 6N, so when N doubles D halves. That is why the loss is U-shaped: a bigger model means less data.")
 ],
 f:[
   CF("إيه نتيجة Chinchilla، وليه الموديلات الحديثة بتتدرّب أكتر منها؟","What was the Chinchilla result, and why do modern models train beyond it?",
      "لحساب C ثابت، الـ N والـ D الأمثل بيكبروا بنفس المعدّل (D حوالي 20N، و N = sqrt(C/120)). بس ده بيقلل تكلفة التدريب بس، وفي الاستخدام كل token بيكلّف 2N، فبنفضّل موديل أصغر متدرّب على tokens أكتر بكتير.","For a fixed compute C, the optimal N and D grow at the same rate (D about 20N, and N = sqrt(C/120)). But that only minimizes training cost, and at serving time each token costs 2N, so we prefer a smaller model trained on far more tokens."),
   CF("إيه هو منحنى IsoFLOP؟","What is an IsoFLOP curve?",
   "منحنى بنثبّت فيه الحساب C ونغيّر حجم الموديل N (والبيانات D = C / 6N بتتغيّر عكسه). الـ loss بيطلع على شكل U، وقاع الـ U هو التوزيع الأمثل.","A curve where we fix the compute C and vary the model size N (the data D = C / 6N changes in the opposite direction). The loss is U-shaped, and the bottom of the U is the best split.")
 ],
 terms:[
   {t:B("IsoFLOP","IsoFLOP"),d:B("طريقة بتثبّت الحساب C وبتغيّر N والـ D عكسه، وبترسم الـ loss على شكل U.","A method that fixes the compute C and varies N, with D changing in the opposite direction, and plots a U-shaped loss.")},
{t:B("Chinchilla scaling","Chinchilla scaling"),
 d:B("دراسة (2022) لقت إن بحساب ثابت لازم نزوّد البيانات مع الموديل: حوالي 20 token لكل parameter.","A 2022 study finding that with fixed compute we must grow data along with the model: about 20 tokens per parameter.")}
 ]},

{id:"l18-chinchilla-optimal",
 t:B("Chinchilla-optimal: الأرقام وليه بنتخطّاه","Chinchilla-optimal: the numbers, and why we go past it"),
 b:cat(B('<p>لو استخدمنا قاعدة 20 token لكل parameter:</p>'+
         '<div class="m">C = 6 N D,   D = 20 N\nC = 120 N^2\n\nN* = sqrt(C / 120)\nD* = 20 N*\n\nC = 1e23   -> N* = 29B,  D* = 578B\nC = 5.9e23 -> N* = 70B,  D* = 1.4T</div>'+
         '<p>يعني لو ضاعفنا الحساب 100 مرة، الموديل والبيانات بيكبروا 10 مرات لكل واحد. التطبيق: Gopher (280B على 300B token) و Chinchilla (70B على 1.4T token) استخدموا حساب قريب (حوالي 5e23 FLOPs)، وChinchilla كسب على أغلب الـ benchmarks. نسبة الـ tokens لكل parameter كانت حوالي 1.1 في Gopher و 1.7 في GPT-3، مقابل 20 في Chinchilla.</p>'+
         '<p>بس الـ Chinchilla-optimal مش دايمًا هو الأنسب. هو بيقلل <mark>تكلفة التدريب</mark> لهدف loss معيّن، ومش بيحسب تكلفة الاستخدام. الموديل بعد التدريب بيخدم مليارات الـ tokens وكل token بيكلّف حوالي 2N FLOPs، فموديل أصغر متدرّب أكتر أرخص في الاستخدام. Llama 3 8B اتدرّب على حوالي 15T token، يعني حوالي 1,900 token لكل parameter، أكتر من 90 ضعف نسبة Chinchilla. والعائد بيقل مع الوقت، وكمان البيانات الجيدة محدودة، فتكرار البيانات لعدة epochs ممكن يفيد لحد حد.</p>',
         '<p>Using the rule of 20 tokens per parameter:</p>'+
         '<div class="m">C = 6 N D,   D = 20 N\nC = 120 N^2\n\nN* = sqrt(C / 120)\nD* = 20 N*\n\nC = 1e23   -> N* = 29B,  D* = 578B\nC = 5.9e23 -> N* = 70B,  D* = 1.4T</div>'+
         '<p>So if we multiply the compute by 100, the model and the data each grow 10 times. In practice: Gopher (280B on 300B tokens) and Chinchilla (70B on 1.4T tokens) used similar compute (about 5e23 FLOPs), and Chinchilla won on most benchmarks. The tokens per parameter were about 1.1 for Gopher and 1.7 for GPT-3, against 20 for Chinchilla.</p>'+
         '<p>But Chinchilla-optimal is not always the best choice. It minimizes <mark>training cost</mark> for a target loss, and does not count the cost of serving. After training the model serves billions of tokens, each costing about 2N FLOPs, so a smaller model trained longer is cheaper to serve. Llama 3 8B was trained on about 15T tokens, roughly 1,900 tokens per parameter, more than 90 times the Chinchilla ratio. Returns shrink over time, and good data is limited, so repeating data for a few epochs can help up to a point.</p>')),
 q:[
  CQ("ميزانية C = 4.8e22 FLOPs. حسب D = 20N، الـ N* الأمثل تقريبًا؟","With a budget of C = 4.8e22 FLOPs and D = 20N, roughly what is the optimal N*?",
      [["2B","2B"],["6.9B","6.9B"],["200B","200B"],["20B","20B"]],
      3,"C = 120 N^2، يعني N^2 = 4.8e22 / 120 = 4e20، و N = 2e10 = 20B، و D = 20N = 4e11 (400B token).","C = 120 N^2, so N^2 = 4.8e22 / 120 = 4e20, N = 2e10 = 20B, and D = 20N = 4e11 (400B tokens)."),
  CQ("ليه فريق ممكن يدرّب موديل أصغر على tokens أكتر بكتير من اللي Chinchilla بيقترحه؟","Why might a team train a smaller model on far more tokens than Chinchilla suggests?", [["عشان التدريب أرخص دايمًا","Because training is always cheaper"],["عشان الـ scaling law بتقول كده","Because the scaling law says so"],["عشان الـ MFU بيزيد","Because the MFU goes up"],["عشان الموديل الأصغر أرخص في الاستخدام (كل token بـ 2N FLOPs)","Because a smaller model is cheaper to serve (each token costs 2N FLOPs)"]], 3,"Chinchilla بيقلل تكلفة التدريب بس. الموديل بيخدم مليارات الـ tokens بعد كده، فبندفع تدريب أكتر مرة واحدة عشان نوفّر في كل استخدام.","Chinchilla minimizes training cost only. The model then serves billions of tokens, so we pay more training once to save on every use.")
 ],
 f:[
  CF("Gopher وChinchilla: إيه اللي اتقارن وإيه النتيجة؟","Gopher and Chinchilla: what was compared, and what was the result?",
     "نفس الحساب تقريبًا (حوالي 5e23 FLOPs): Gopher 280B على 300B token، وChinchilla 70B على 1.4T token. Chinchilla كسب على أغلب الـ benchmarks.","About the same compute (around 5e23 FLOPs): Gopher 280B on 300B tokens, and Chinchilla 70B on 1.4T tokens. Chinchilla won on most benchmarks."),
  CF("ليه الـ Chinchilla-optimal مش دايمًا الأحسن؟","Why is Chinchilla-optimal not always the best choice?",
     "لأنه بيقلل تكلفة التدريب بس ومبيحسبش تكلفة الاستخدام. كل token في الـ serving بياخد حوالي 2N FLOPs، فالموديل الأصغر المتدرّب أطول أرخص في الاستخدام.",
     "It minimizes training cost only and ignores the cost of serving. Each served token costs about 2N FLOPs, so a smaller model trained longer is cheaper to use.")
 ],
 terms:[
  {t:B("Chinchilla-optimal","Chinchilla-optimal"),d:B("توزيع الحساب اللي بيقلل تكلفة التدريب لهدف loss معيّن: D حوالي 20N، و <code>N = sqrt(C / 120)</code>.","The compute split that minimizes training cost for a target loss: D about 20N, and <code>N = sqrt(C / 120)</code>.")}
 ]},

{id:"l18-distill",
 t:B("Distillation: موديل صغير بيتعلّم من موديل كبير","Distillation: a small model learns from a big one"),
 b:cat(
   B('<p>طريقة تانية للحصول على موديل رخيص في الاستخدام: <mark>knowledge distillation</mark> (Hinton وزمايله، 2015). الـ <mark>student</mark> الصغير بيتدرّب يطابق توزيع احتمالات الـ <mark>teacher</mark> الكبير، مش الـ token الصح بس. احتمالات الـ teacher فيها معلومات أكتر: بتقول أنهي كلمات غلط \"قريبة من الصح\". بنستخدم <mark>temperature</mark> T لتنعيم التوزيع:</p>'+
     '<div class="m">p^T = softmax(z / T)\nL = (1-alpha) * CE(y, p_s) + alpha * T^2 * KL(p_t^T || p_s^T)\n\nteacher logits z = (4, 2, 0)\nT = 1 -> (0.87, 0.12, 0.02)\nT = 2 -> (0.67, 0.24, 0.09)</div>'+
     '<p>الـ T الأكبر بيبيّن العلاقات بين الكلمات الغلط. في الـ LLMs فيه شكلين: <mark>logit distillation</mark> (محتاج توزيع الـ teacher، وغالبًا بنخزّن top-k بس لأن الـ vocabulary كبير)، و<mark>sequence-level</mark>: بندرّب الـ student على نص ولّده الـ teacher، ومش محتاجين الـ logits. أمثلة: DistilBERT (أصغر 40% وبيحتفظ بحوالي 97% من فهم BERT)، وموديلات Gemma 2 بحجم 2B و9B اتدرّبوا بالـ distillation. الحد: الـ student نادرًا بيتخطّى الـ teacher.</p>',
     '<p>Another way to get a model that is cheap to serve: <mark>knowledge distillation</mark> (Hinton et al., 2015). A small <mark>student</mark> is trained to match the probability distribution of a large <mark>teacher</mark>, not only the correct token. The teacher probabilities carry more information: they say which wrong words are "almost right". We use a <mark>temperature</mark> T to soften the distribution:</p>'+
     '<div class="m">p^T = softmax(z / T)\nL = (1-alpha) * CE(y, p_s) + alpha * T^2 * KL(p_t^T || p_s^T)\n\nteacher logits z = (4, 2, 0)\nT = 1 -> (0.87, 0.12, 0.02)\nT = 2 -> (0.67, 0.24, 0.09)</div>'+
     '<p>A larger T reveals the relations between the wrong words. For LLMs there are two forms: <mark>logit distillation</mark> (needs the teacher distribution, and we often store only the top-k because the vocabulary is large), and <mark>sequence-level</mark>: train the student on text generated by the teacher, with no logits needed. Examples: DistilBERT (40% smaller and keeping about 97% of BERT understanding), and Gemma 2 at 2B and 9B were trained with distillation. The limit: the student rarely surpasses the teacher.</p>')),
 q:[
  CQ("ليه بنستخدم temperature T > 1 في الـ distillation؟","Why do we use a temperature T > 1 in distillation?", [["عشان نسرّع الـ GPU","To speed up the GPU"],["عشان ننعّم توزيع الـ teacher فتبان الاحتمالات الصغيرة للكلمات القريبة","To soften the teacher distribution so the small probabilities of near words become visible"],["عشان نصغّر الـ vocabulary","To shrink the vocabulary"],["عشان نشيل الـ softmax","To remove the softmax"]], 1,"الـ softmax على z / T بيقرّب الاحتمالات من بعض، فالـ student بيشوف إن كلمة غلط معيّنة أقرب للصح من غيرها.","The softmax over z / T pulls the probabilities closer together, so the student sees that a particular wrong word is closer to correct than others."),
  CQ("الـ teacher logits = (4, 2, 0) و T = 2. احتمال أول token تقريبًا؟","The teacher logits are (4, 2, 0) and T = 2. About what is the probability of the first token?", [["0.87","0.87"],["0.50","0.50"],["0.67","0.67"],["0.33","0.33"]], 2,"z / T = (2, 1, 0)، فـ e^2 = 7.39 و e^1 = 2.72 و e^0 = 1 والمجموع 11.1. الاحتمال = 7.39 / 11.1 = 0.67. الاختيار 0.87 هو T = 1.","z / T = (2, 1, 0), so e^2 = 7.39, e^1 = 2.72, e^0 = 1 and the sum is 11.1. The probability = 7.39 / 11.1 = 0.67. The option 0.87 is T = 1.")
 ],
 f:[
  CF("إيه هو الـ distillation؟","What is distillation?",
     "student صغير بيتدرّب يطابق توزيع احتمالات teacher كبير (بـ temperature T) بدل الـ token الصح بس. بيدّي موديل رخيص في الاستخدام، والـ student نادرًا بيتخطّى الـ teacher.","A small student is trained to match the probability distribution of a large teacher (with a temperature T) instead of only the correct token. It gives a model that is cheap to serve, and the student rarely surpasses the teacher."),
  CF("إيه الفرق بين logit distillation وsequence-level distillation؟","What is the difference between logit distillation and sequence-level distillation?",
     "الأولى بتطابق توزيع الـ teacher (محتاجة logits، وغالبًا top-k). التانية بتدرّب الـ student على نص ولّده الـ teacher، ومش محتاجة logits.","The first matches the teacher distribution (needs logits, often top-k). The second trains the student on text generated by the teacher, and needs no logits.")
 ],
 terms:[
  {t:B("Knowledge distillation","Knowledge distillation"),
 d:B("تدريب موديل صغير (student) يقلّد مخرجات موديل كبير (teacher).","Training a small model (the student) to imitate the outputs of a large model (the teacher).")}
 ]},

{id:"l18-moe",t:B("Mixture of Experts: parameters أكتر من غير حساب أكتر","Mixture of Experts: more parameters without more compute per token"),
 b:cat(B('<p>في الـ Transformer block (محاضرة 8) الـ FFN فيها حوالي ثلثين الـ parameters. فكرة الـ <mark>Mixture of Experts (MoE)</mark>: بدل FFN واحدة، الـ layer فيها E شبكات FFN بنفس الشكل اسمها <mark>experts</mark>، ومعاها <mark>router</mark> صغير. لكل token الـ router بيختار k experts بس (غالبًا k = 1 أو 2)، والباقي مش بيشتغل. ده اسمه <mark>conditional computation</mark> أو sparse activation. الفكرة جاية من Shazeer وزمايله (2017)، ومتطوّرة في GShard (2020) وSwitch Transformer (2021) اللي استخدم k = 1.</p>'+
         '<div class="m">r = W_r x              E scores\nS = top-k(r)           k indices\ng_i = softmax(r_S)_i   over the k only\n\ny = sum over i in S: g_i * FFN_i(x)</div>'+
         '<p>مثال بأرقام: E = 4 و k = 2، والـ router طلّع <code>r = (1.0, 2.0, 0.5, 1.5)</code>. أعلى اتنين هما E2 (2.0) و E4 (1.5). الـ softmax عليهم: <code>e^2.0 = 7.39</code> و <code>e^1.5 = 4.48</code>، فـ <code>g = (0.62, 0.38)</code>، والناتج <code>y = 0.62 FFN_2(x) + 0.38 FFN_4(x)</code>.</p>',
         '<p>In a Transformer block (lecture 8) the FFN holds about two thirds of the parameters. The idea of <mark>Mixture of Experts (MoE)</mark>: instead of one FFN, the layer has E FFNs of the same shape called <mark>experts</mark>, plus a small <mark>router</mark>. For each token the router picks only k experts (usually k = 1 or 2), and the rest do not run. This is called <mark>conditional computation</mark> or sparse activation. The idea comes from Shazeer et al. (2017), and was developed in GShard (2020) and Switch Transformer (2021), which used k = 1.</p>'+
         '<div class="m">r = W_r x              E scores\nS = top-k(r)           k indices\ng_i = softmax(r_S)_i   over the k only\n\ny = sum over i in S: g_i * FFN_i(x)</div>'+
         '<p>A numeric example: E = 4 and k = 2, and the router outputs <code>r = (1.0, 2.0, 0.5, 1.5)</code>. The top two are E2 (2.0) and E4 (1.5). The softmax over them: <code>e^2.0 = 7.39</code> and <code>e^1.5 = 4.48</code>, so <code>g = (0.62, 0.38)</code>, and the output is <code>y = 0.62 FFN_2(x) + 0.38 FFN_4(x)</code>.</p>')),
 q:[
   CQ("scores الـ router = (3, 1, 2, 0) وk = 2. أوزان الـ gates للـ experts المختارين تقريبًا؟","The router scores are (3, 1, 2, 0) and k = 2. About what are the gate weights of the chosen experts?", [["(0.73, 0.27)","(0.73, 0.27)"],["(0.50, 0.50)","(0.50, 0.50)"],["(0.88, 0.12)","(0.88, 0.12)"],["(0.67, 0.33)","(0.67, 0.33)"]], 0,"أعلى اتنين هما 3 و 2. e^3 = 20.1 و e^2 = 7.39 والمجموع 27.5، فالأوزان (0.73, 0.27). الاختيار (0.88, 0.12) هو softmax على 3 و 1، وده مش top-2.","The top two are 3 and 2. e^3 = 20.1 and e^2 = 7.39 and the sum is 27.5, so the weights are (0.73, 0.27). The option (0.88, 0.12) is a softmax over 3 and 1, which is not the top-2."),
CQ("إيه اللي الـ router بيقرّره في MoE layer؟","What does the router decide in an MoE layer?", [["حجم الـ batch","The batch size"],["عدد الـ layers","The number of layers"],["الـ learning rate","The learning rate"],["أنهي k experts بيشتغلوا لكل token وبأي وزن","Which k experts run for each token, and with what weight"]], 3,"الـ router بيدّي كل expert score لكل token، بيختار الـ top-k، وبيطبّق softmax على الـ k دول عشان يطلّع أوزان الـ gates.","The router gives each expert a score for each token, keeps the top-k, and applies a softmax over those k to get the gate weights.")
 ],
 f:[
   CF("إيه الفرق بين total و active parameters في الـ MoE؟","What is the difference between total and active parameters in an MoE?",
      "Total هو كل الـ experts المخزّنة (بتحدد الذاكرة والـ capacity). Active هو اللي بيشتغل لـ token واحد بعد ما الـ router يختار top-k (بيحدد الـ FLOPs، حوالي 2 × active). فنكبّر الـ capacity من غير ما نكبّر الحساب لكل token.","Total is all the stored experts (setting memory and capacity). Active is what runs for one token after the router picks the top-k (setting the FLOPs, about 2 × active). So we grow capacity without growing compute per token."),
   CF("إزاي الـ router بيحسب ناتج MoE layer؟","How does the router compute the output of an MoE layer?",
   "r = W_r x، بنختار top-k، بنطبّق softmax على الـ k بس عشان نطلّع g_i، والناتج y = مجموع g_i × FFN_i(x) على الـ experts المختارين.","r = W_r x, pick the top-k, apply a softmax over just those k to get g_i, and the output is y = the sum of g_i × FFN_i(x) over the chosen experts.")
 ],
 terms:[
   {t:B("Mixture of Experts (MoE)","Mixture of Experts (MoE)"),d:B("layer فيها E شبكات FFN (experts) ومعاها router بيختار k منهم لكل token بس.","A layer with E FFNs (experts) and a router that picks only k of them for each token.")},
{t:B("Router","Router"),d:B("layer خطي صغير بيدّي كل expert score لكل token وبيختار الـ top-k.","A small linear layer that scores each expert for each token and picks the top-k.")},
{t:B("Conditional computation","Conditional computation"),d:B("بيشتغل جزء من الموديل بس لكل مدخل (sparse activation) بدل الموديل كله.","Only part of the model runs for each input (sparse activation) instead of the whole model.")}
 ]},

{id:"l18-moe-params",
 t:B("الـ MoE: total مقابل active parameters","MoE: total versus active parameters"),
 b:cat(FIG_L18_MOE,
       B('<p>نقط مهمة:<br>• الاختيار بيتم <mark>لكل token ولكل layer</mark> لوحده، مش لكل جملة.<br>• الـ router مجرد linear layer بيتدرّب مع باقي الموديل. اختيار top-k نفسه مش قابل للاشتقاق، بس قيم الـ gates <code>g_i</code> قابلة، وبالتالي الـ router بيتعلّم منها.<br>• لازم نفرّق بين <mark>total parameters</mark> و <mark>active parameters</mark>. الأولى بتحدد الذاكرة والـ capacity، والتانية بتحدد الحساب: حوالي <code>2 × active</code> FLOPs لكل token.<br>• الـ experts مش بالضرورة "خبير رياضة" و"خبير تاريخ". تقرير Mixtral لقى إن الـ routing مرتبط بالـ syntax والمواضع أكتر من الموضوع، وتحليلات تانية لقت تخصّص جزئي. متتوقعش تقسيم نظيف.</p>'+
         '<div class="m">dense FFN        params P, FLOPs 2P\nMoE (E=8, k=2)  params 8P, FLOPs 2*(2P) = 4P\n\n8x the parameters,\nonly 2x the FFN compute</div>'+
         '<p>يعني بنشتري <mark>capacity</mark> بسعر ذاكرة، مش بسعر حساب. والسؤال الجاي: إزاي نخلّي الـ experts كلهم يتستخدموا؟</p>',
         '<p>Key points:<br>• The choice is made <mark>per token and per layer</mark> on its own, not per sentence.<br>• The router is just a linear layer trained with the rest of the model. The top-k choice itself is not differentiable, but the gate values <code>g_i</code> are, so the router learns through them.<br>• We must separate <mark>total parameters</mark> from <mark>active parameters</mark>. The first sets memory and capacity, and the second sets the compute: about <code>2 × active</code> FLOPs per token.<br>• Experts are not necessarily a "math expert" and a "history expert". The Mixtral report found that routing relates more to syntax and position than to topic, and other analyses found partial specialization. Do not expect a clean split.</p>'+
         '<div class="m">dense FFN        params P, FLOPs 2P\nMoE (E=8, k=2)  params 8P, FLOPs 2*(2P) = 4P\n\n8x the parameters,\nonly 2x the FFN compute</div>'+
         '<p>So we buy <mark>capacity</mark> with memory, not with compute. The next question: how do we make sure all the experts get used?</p>')),
 q:[
  CQ("في MoE layer فيها 8 experts و top-2، كل expert حجمه P. الـ FLOPs لكل token في الـ layer دي تقريبًا زي FFN dense حجمها...","An MoE layer has 8 experts with top-2, each of size P. The per-token FLOPs of this layer are roughly those of a dense FFN of size...",
      [["2P","2P"],["8P","8P"],["P","P"],["10P","10P"]],
      0,"بيشتغل expert اتنين بس لكل token، فالحساب زي 2P. الـ parameters الكلية 8P بس دي بتأثر على الذاكرة مش على الـ FLOPs.","Only two experts run per token, so the compute is like 2P. The total parameters are 8P, but that affects memory, not FLOPs."),
  CQ("الـ top-k نفسه مش قابل للاشتقاق. إزاي الـ router بيتعلّم؟","The top-k choice itself is not differentiable. How does the router learn?", [["مبيتعلّمش، بيتحدّد عشوائي","It does not learn, it is set at random"],["من قيم الـ gates g_i اللي قابلة للاشتقاق","Through the gate values g_i, which are differentiable"],["من الـ vocabulary","From the vocabulary"],["من الـ capacity factor","From the capacity factor"]], 1,"الـ gates g_i = softmax على الـ k المختارين، ودي دالة قابلة للاشتقاق في الـ scores، فالـ gradient بيوصل للـ router.","The gates g_i are a softmax over the chosen k, which is differentiable in the scores, so the gradient reaches the router.")
 ],
 f:[
  CF("هل كل expert بيتخصّص في موضوع (رياضة، تاريخ)؟","Does each expert specialize in a topic (math, history)?",
     "مش بالضرورة. تقرير Mixtral لقى إن الـ routing مرتبط بالـ syntax والمواضع أكتر من الموضوع، وتحليلات تانية لقت تخصّص جزئي. متتوقعش تقسيم نظيف.","Not necessarily. The Mixtral report found that routing relates more to syntax and position than to topic, and other analyses found partial specialization. Do not expect a clean split."),
  CF("إيه الفرق بين الـ total والـ active parameters، وكل واحد بيحدد إيه؟","What is the difference between total and active parameters, and what does each set?",
     "الـ total بيحدد الذاكرة والـ capacity، والـ active بيحدد الحساب: حوالي 2 × active FLOPs لكل token.",
     "Total sets the memory and capacity, and active sets the compute: about 2 × active FLOPs per token.")
 ],
 terms:[
  {t:B("Total parameters","Total parameters"),d:B("كل الـ parameters المخزّنة (كل الـ experts). بتحدد الذاكرة والـ capacity.","All the stored parameters (all the experts). They set the memory and the capacity.")},
  {t:B("Active parameters","Active parameters"),d:B("اللي بيشتغل لـ token واحد بعد اختيار الـ top-k. بتحدد الـ FLOPs: حوالي 2 × active.","What runs for one token after the top-k choice. They set the FLOPs: about 2 × active.")}
 ]},

{id:"l18-balance",t:B("توزيع الحمل بين الـ experts","Load balancing across experts"),
 b:cat(B('<p>المشكلة الأساسية في تدريب MoE هي <mark>routing collapse</mark>: expert اتحسّن شوية، فالـ router يبعتله tokens أكتر، فيتدرّب أكتر ويتحسّن أكتر، والباقي بيتجوّع ومبيتعلّمش. وكمان على الـ hardware: لو expert واحد واخد 70% من الـ tokens، كل الـ GPUs التانية بتستناه.</p>'+
         '<p>الحل الكلاسيكي (Shazeer 2017، Switch 2021) هو <mark>auxiliary load-balancing loss</mark> بتتضاف للـ loss الأساسي:</p>'+
         '<div class="m">f_i = fraction of tokens sent to expert i   (hard count)\nP_i = mean router probability of expert i  (soft)\n\nL_aux = alpha * N * sum_i f_i * P_i\n\nbalanced: f_i = P_i = 1/N\n          sum = 1/N, L_aux = alpha</div>'+
         '<p>مثال: N = 4، والـ router بعت الـ tokens بنسب <code>f = (0.70, 0.20, 0.05, 0.05)</code>، ومتوسط احتمالاته <code>P = (0.60, 0.25, 0.10, 0.05)</code>:</p>'+
         '<div class="m">sum f_i P_i = 0.42 + 0.05 + 0.005\n             + 0.0025 = 0.4775\nN * sum = 4 * 0.4775 = 1.91\n\nbalanced case: 4 * 0.25 = 1.00</div>'+
         '<p>القيمة الأقل (1.0) هي التوزيع المتساوي.</p>',
         '<p>The core problem in training an MoE is <mark>routing collapse</mark>: an expert improves a little, so the router sends it more tokens, so it trains more and improves more, while the others starve and never learn. And on the hardware: if one expert gets 70% of the tokens, all the other GPUs wait for it.</p>'+
         '<p>The classic fix (Shazeer 2017, Switch 2021) is an <mark>auxiliary load-balancing loss</mark> added to the main loss:</p>'+
         '<div class="m">f_i = fraction of tokens sent to expert i   (hard count)\nP_i = mean router probability of expert i  (soft)\n\nL_aux = alpha * N * sum_i f_i * P_i\n\nbalanced: f_i = P_i = 1/N\n          sum = 1/N, L_aux = alpha</div>'+
         '<p>Example: N = 4, and the router sent tokens in proportions <code>f = (0.70, 0.20, 0.05, 0.05)</code> with mean probabilities <code>P = (0.60, 0.25, 0.10, 0.05)</code>:</p>'+
         '<div class="m">sum f_i P_i = 0.42 + 0.05 + 0.005\n             + 0.0025 = 0.4775\nN * sum = 4 * 0.4775 = 1.91\n\nbalanced case: 4 * 0.25 = 1.00</div>'+
         '<p>The lowest value (1.0) is the uniform split.</p>'),
       FIG_L18_LOAD),
 q:[
   CQ("لو توزيع الـ tokens والاحتمالات متساوي تمامًا على N = 4 experts (f_i = P_i = 0.25)، قيمة N × sum(f_i × P_i) بتساوي...","If the tokens and probabilities are perfectly uniform over N = 4 experts (f_i = P_i = 0.25), the value of N × sum(f_i × P_i) equals...",
      [["0.25","0.25"],["2.0","2.0"],["1.0","1.0"],["4.0","4.0"]],
      2,"المجموع = 4 × (0.25 × 0.25) = 0.25، ولما نضربه في N = 4 بنحصل على 1.0. ده أقل قيمة، وأي اختلال بيرفعها.","The sum = 4 × (0.25 × 0.25) = 0.25, and multiplying by N = 4 gives 1.0. This is the lowest value, and any imbalance raises it."),
   CQ("ليه بيحصل routing collapse؟","Why does routing collapse happen?", [["لأن الـ vocabulary صغير","Because the vocabulary is small"],["لأن الـ batch كبير","Because the batch is large"],["حلقة تعزيز: expert اتحسّن شوية فاتبعتله tokens أكتر فاتدرّب أكتر، والباقي اتجوّع","A feedback loop: an expert improves a little, gets more tokens, trains more, and the others starve"],["لأن الـ experts متشابهين في الحجم","Because the experts have the same size"]], 2,"الحلقة دي بتخلّي الـ router يفضّل شوية experts، والباقي مبيتعلّمش، وكمان GPU واحدة بتبقى مزدحمة وباقي الـ GPUs بتستنى.","This loop makes the router favor a few experts while the rest never learn, and one GPU becomes crowded while the other GPUs wait.")
 ],
 f:[
   CF("إيه هو routing collapse وإزاي بنمنعه؟","What is routing collapse, and how do we prevent it?",
      "الـ router بيفضّل شوية experts وهي بتتدرّب أكتر وبتتحسّن، فيزداد الاختيار ليها والباقي بيتجوّع. بنمنعه بـ aux loss = alpha × N × sum(f_i × P_i)، و capacity factor بيسقط الزايد، و z-loss للثبات، أو bias لكل expert زي DeepSeek-V3.","The router favors a few experts, which train more and improve, so they get picked even more while the rest starve. We prevent it with an aux loss = alpha × N × sum(f_i × P_i), a capacity factor that drops overflow, a z-loss for stability, or a per-expert bias as in DeepSeek-V3."),
   CF("إيه هي الـ auxiliary load-balancing loss؟","What is the auxiliary load-balancing loss?",
   "L_aux = alpha × N × sum(f_i × P_i)، حيث f_i نسبة الـ tokens (عدّ صلب) وP_i متوسط احتمال الـ router (soft). أقل قيمة (alpha) عند التوزيع المتساوي.","L_aux = alpha × N × sum(f_i × P_i), where f_i is the fraction of tokens (a hard count) and P_i the mean router probability (soft). The lowest value (alpha) is at the uniform split.")
 ],
 terms:[
   {t:B("Routing collapse","Routing collapse"),d:B("الـ router بيبعت أغلب الـ tokens لشوية experts والباقي بيتجوّع ومبيتعلّمش.","The router sends most tokens to a few experts and the rest starve and never learn.")},
{t:B("Auxiliary load-balancing loss","Auxiliary load-balancing loss"),d:B("loss إضافية بتتضاف للـ loss الأساسي وبتزيد لما توزيع الـ tokens على الـ experts يبقى غير متساوي.","An extra loss added to the main loss that grows when the tokens are spread unevenly across the experts.")}
 ]},

{id:"l18-balance-tools",
 t:B("أدوات التوازن: capacity factor وz-loss وبدون aux loss","Balancing tools: capacity factor, z-loss and no aux loss"),
 b:cat(B('<p>وليه حاصل ضرب f و P؟ لأن <code>f</code> عدّ صلب مش قابل للاشتقاق، و <code>P</code> قابلة، فالـ gradient على <code>P_i</code> يساوي <code>alpha N f_i</code>: الـ expert المزدحم (f كبير) بياخد دفعة أقوى لتقليل احتماله. قيمة alpha في Switch كانت حوالي 0.01.</p>'+
         '<p>أدوات تانية:<br>• <mark>Capacity factor</mark>: سعة كل expert = <code>CF × (tokens / E)</code>. في مثالنا 100 token و E = 4 و CF = 1.25، فالسعة 31. الـ tokens اللي فوق السعة <mark>بتتسقط</mark> (dropped): بتعدّي على الـ residual connection من غير ما FFN تتطبّق عليها. في الـ collapse ده معناه 39 token من 100 ضايعين.<br>• <mark>Router z-loss</mark> (ST-MoE، 2022): بتعاقب الـ logits الكبيرة عشان الـ router يفضل مستقر عدديًا.<br>• <mark>بدون aux loss</mark> (DeepSeek-V3): الـ aux loss الكبيرة ممكن تأثر على جودة الموديل، فبيضيفوا <mark>bias لكل expert</mark> على الـ scores لاختيار top-k بس. بعد كل step الـ bias بيزيد للـ expert قليل الحمل وبيقل للمزدحم، وقيم الـ gates بتفضل من الـ scores الأصلية. (مع loss صغيرة جدًا على مستوى الـ sequence.)</p>'+
         '<p>القاعدة: التوازن مطلوب للـ hardware والتعلّم، بس لو الضغط عليه زيادة بيخسّر الموديل مرونة اختيار الـ expert الأنسب لكل token.</p>',
         '<p>Why a product of f and P? Because <code>f</code> is a hard count and not differentiable, while <code>P</code> is, so the gradient on <code>P_i</code> is <code>alpha N f_i</code>: a crowded expert (large f) gets a stronger push to lower its probability. Switch used alpha of about 0.01.</p>'+
         '<p>Other tools:<br>• <mark>Capacity factor</mark>: the capacity of each expert is <code>CF × (tokens / E)</code>. In our example 100 tokens, E = 4 and CF = 1.25, so the capacity is 31. Tokens above capacity are <mark>dropped</mark>: they pass through the residual connection without the FFN being applied. In the collapse case that means 39 of 100 tokens are lost.<br>• <mark>Router z-loss</mark> (ST-MoE, 2022): penalizes large logits so the router stays numerically stable.<br>• <mark>No aux loss</mark> (DeepSeek-V3): a large aux loss can hurt model quality, so they add a <mark>bias per expert</mark> to the scores used only for the top-k choice. After each step the bias rises for an underloaded expert and falls for a crowded one, and the gate values still come from the original scores. (Plus a very small loss at the sequence level.)</p>'+
         '<p>The rule: balance is needed for the hardware and for learning, but pushing too hard on it costs the model the freedom to choose the best expert for each token.</p>')),
 q:[
  CQ("100 token وE = 4 experts وcapacity factor = 1.25. سعة كل expert تقريبًا؟","With 100 tokens, E = 4 experts and a capacity factor of 1.25, what is the capacity of each expert?", [["31","31"],["25","25"],["40","40"],["125","125"]], 0,"السعة = CF × (tokens / E) = 1.25 × 25 = 31.25، يعني حوالي 31. الاختيار 25 هو من غير الـ capacity factor.","Capacity = CF × (tokens / E) = 1.25 × 25 = 31.25, so about 31. The option 25 is without the capacity factor."),
  CQ("إيه اللي بيحصل للـ token اللي جه فوق سعة الـ expert؟","What happens to a token that arrives above the capacity of an expert?", [["بيتكرّر في expert تاني","It is repeated in another expert"],["بيتحذف من الـ batch","It is removed from the batch"],["بيتحوّل لـ padding","It becomes padding"],["بيتسقط: بيعدّي على الـ residual connection من غير FFN","It is dropped: it passes through the residual connection without the FFN"]], 3,"الـ token بيفضل في الـ sequence بس بيعدّي من غير حساب الـ FFN في الـ layer دي. في الـ collapse ده معناه 39 من 100 token.","The token stays in the sequence but skips the FFN in that layer. In the collapse case that means 39 of 100 tokens.")
 ],
 f:[
  CF("إيه هو الـ capacity factor والـ token dropping؟","What are the capacity factor and token dropping?",
     "سعة كل expert = CF × (tokens / E). الـ tokens اللي فوق السعة بتتسقط: بتعدّي على الـ residual من غير الـ FFN.","The capacity of each expert = CF × (tokens / E). Tokens above capacity are dropped: they pass through the residual without the FFN."),
  CF("إزاي DeepSeek-V3 بيوزّن الحمل من غير aux loss كبيرة؟","How does DeepSeek-V3 balance the load without a large aux loss?",
     "بيضيف bias لكل expert على الـ scores لاختيار top-k بس: بيزيد للـ expert قليل الحمل وبيقل للمزدحم بعد كل step، وقيم الـ gates بتفضل من الـ scores الأصلية.","It adds a bias per expert to the scores used only for the top-k choice: it rises for an underloaded expert and falls for a crowded one after each step, and the gate values still come from the original scores.")
 ],
 terms:[
  {t:B("Capacity factor","Capacity factor"),d:B("معامل بيحدد سعة كل expert: <code>CF × (tokens / E)</code>. الـ tokens الزايدة بتتسقط.","A factor that sets each expert capacity: <code>CF × (tokens / E)</code>. Extra tokens are dropped.")},
  {t:B("Router z-loss","Router z-loss"),d:B("loss بتعاقب الـ logits الكبيرة عشان الـ router يفضل مستقر عدديًا.","A loss that penalizes large logits so the router stays numerically stable.")}
 ]},

{id:"l18-practice",t:B("الـ MoE عمليًا: Mixtral و DeepSeek والمقايضات","MoE in practice: Mixtral, DeepSeek and the trade-offs"),
 b:cat(B('<p>مثال حقيقي: <mark>Mixtral 8x7B</mark> (Mistral، 2023) فيه 32 layer، وفي كل layer 8 experts و top-2. بأبعاد <code>d = 4096</code> و <code>d_ff = 14336</code> والـ FFN بتلات مصفوفات (SwiGLU):</p>'+
         '<div class="m">expert per layer = 3 * 4096 * 14336\n                = 176.2M\n8 experts * 32 layers = 45.1B\nattention + embeddings = ~1.6B\n\ntotal  = 46.7B\nactive = 2 experts * 32 layers\n         = 11.3B + 1.6B = 12.9B</div>'+
         '<p>يعني بيتحسب لكل token بتكلفة موديل حوالي 13B، وبيخزّن 46.7B. ولاحظ إن الاسم 8x7B مش معناه 56B، لأن الـ attention والـ embeddings مشتركة بين الـ experts. وحسب تقرير Mistral، جودته قريبة أو أحسن من Llama 2 70B على أغلب الـ benchmarks بتكلفة حساب أقل بكتير لكل token.</p>'+
         '<p><mark>DeepSeekMoE</mark> (2024) أضاف فكرتين:<br>• <mark>Fine-grained experts</mark>: بدل 8 experts كبار، نقسم كل واحد لأجزاء أصغر ونختار عدد أكبر. عدد التوليفات الممكنة بيكبر جدًا: <code>C(8,2) = 28</code> مقابل <code>C(32,8) = 10,518,300</code> (لو قسمنا كل expert لـ 4 واخترنا 8 بدل 2، بنفس الحساب تقريبًا). فكل token ممكن ياخد خليط أدق.<br>• <mark>Shared experts</mark>: expert أو أكتر شغّالين دايمًا لكل token، بيلتقطوا المعرفة العامة، فالـ routed experts تتخصص أكتر.</p>',
         '<p>A real example: <mark>Mixtral 8x7B</mark> (Mistral, 2023) has 32 layers, and each layer has 8 experts with top-2. With dimensions <code>d = 4096</code> and <code>d_ff = 14336</code> and an FFN of three matrices (SwiGLU):</p>'+
         '<div class="m">expert per layer = 3 * 4096 * 14336\n                = 176.2M\n8 experts * 32 layers = 45.1B\nattention + embeddings = ~1.6B\n\ntotal  = 46.7B\nactive = 2 experts * 32 layers\n         = 11.3B + 1.6B = 12.9B</div>'+
         '<p>So each token is computed at the cost of a model of about 13B, while 46.7B is stored. Note that the name 8x7B does not mean 56B, because the attention and the embeddings are shared across experts. According to the Mistral report, its quality is close to or better than Llama 2 70B on most benchmarks, at a much lower compute cost per token.</p>'+
         '<p><mark>DeepSeekMoE</mark> (2024) added two ideas:<br>• <mark>Fine-grained experts</mark>: instead of 8 large experts, split each into smaller pieces and pick more of them. The number of possible combinations grows a lot: <code>C(8,2) = 28</code> against <code>C(32,8) = 10,518,300</code> (splitting each expert into 4 and picking 8 instead of 2, at about the same compute). So each token can get a finer mix.<br>• <mark>Shared experts</mark>: one or more experts that always run for every token, capturing general knowledge, so the routed experts can specialize more.</p>')),
 q:[
   CQ("إيه الصح عن Mixtral 8x7B؟","Which statement about Mixtral 8x7B is correct?",
      [["الحساب لكل token زي موديل dense حجمه 46.7B","The per-token compute is that of a dense 46.7B model"],["الحساب لكل token زي موديل حوالي 13B، بس لازم نخزّن 46.7B في الذاكرة","The per-token compute is that of about a 13B model, but 46.7B must be stored in memory"],["الذاكرة المطلوبة 12.9B بس","Only 12.9B of memory is needed"],["كل token بيعدّي على الـ 8 experts","Every token passes through all 8 experts"]],
      1,"بيشتغل expert اتنين من 8 لكل token، فالحساب لحوالي 12.9B active. بس الـ router ممكن يختار أي expert، فلازم الـ 46.7B كلها تكون في الذاكرة.","Two of the 8 experts run per token, so the compute is for about 12.9B active. But the router may pick any expert, so all 46.7B must be in memory."),
   CQ("إيه دور الـ shared experts في DeepSeekMoE؟","What is the role of shared experts in DeepSeekMoE?", [["بيخزّنوا الـ KV cache","They store the KV cache"],["بيشتغلوا دايمًا لكل token ويلتقطوا المعرفة العامة، فالـ routed experts تتخصص أكتر","They always run for every token and capture general knowledge, so the routed experts can specialize more"],["بيحسبوا الـ aux loss","They compute the aux loss"],["بيشتغلوا لما الـ batch كبير بس","They run only when the batch is large"]], 1,"فيه expert أو أكتر شغّالين دايمًا (shared)، والباقي (routed) بيختارهم الـ router. كده التكرار في المعرفة العامة بيقل.","One or more experts always run (shared), and the others (routed) are chosen by the router. This reduces duplication of general knowledge.")
 ],
 f:[
   CF("إيه مقايضات الـ MoE مقارنة بالـ dense، وإيه اللي أضافه DeepSeekMoE؟","What are the trade-offs of MoE compared with dense, and what did DeepSeekMoE add?",
      "MoE: capacity أكتر لكل FLOP، بس ذاكرة أكبر (كل الـ parameters لازم تتخزّن) واتصال all-to-all وتدريب أصعب. DeepSeekMoE: fine-grained experts (توليفات أكتر) و shared experts شغّالين دايمًا، والـ V3 بـ 671B total و 37B active.","MoE: more capacity per FLOP, but more memory (all parameters must be stored), all-to-all communication and harder training. DeepSeekMoE: fine-grained experts (more combinations) and shared experts that always run; V3 has 671B total and 37B active."),
   CF("إيه هي fine-grained وshared experts؟","What are fine-grained and shared experts?",
   "Fine-grained: نقسم كل expert لأجزاء أصغر ونختار عدد أكبر، فالتوليفات بتكبر (C(8,2) = 28 مقابل C(32,8) = 10,518,300). Shared: expert أو أكتر شغّالين دايمًا لكل token.","Fine-grained: split each expert into smaller pieces and pick more of them, so the combinations grow (C(8,2) = 28 against C(32,8) = 10,518,300). Shared: one or more experts that always run for every token.")
 ],
 terms:[
   {t:B("Fine-grained experts","Fine-grained experts"),d:B("experts أصغر وأكتر، بنختار عدد أكبر منهم لكل token، فالتوليفات الممكنة بتكبر.","Smaller and more numerous experts, with more of them chosen per token, so the possible combinations grow.")},
{t:B("Shared experts","Shared experts"),d:B("experts شغّالين دايمًا لكل token بيلتقطوا المعرفة العامة.","Experts that always run for every token and capture general knowledge.")}
 ]},

{id:"l18-practice-tradeoffs",
 t:B("مقايضات الـ MoE: الذاكرة والاتصال والـ serving","MoE trade-offs: memory, communication and serving"),
 b:cat(B('<p>DeepSeek-V3 فيه 671B total و 37B active (5.5%)، بـ 256 routed expert و 1 shared، وبيختار 8 routed لكل token.</p>',
         '<p>DeepSeek-V3 has 671B total and 37B active (5.5%), with 256 routed experts and 1 shared, and it picks 8 routed experts per token.</p>'),
       FIG_L18_ACTIVE,
       B('<p>المقايضات:<br>• <mark>الذاكرة</mark>: لازم تخزّن كل الـ parameters. Mixtral بـ bf16 هياخد <code>46.7e9 × 2 = 93 GB</code> للأوزان بس، أكتر من GPU 80 GB، رغم إن حسابه زي 13B.<br>• <mark>Expert parallelism</mark>: كل GPU شايلة شوية experts، والـ tokens بتتبعت للـ GPU الصح وترجع (all-to-all مرتين في كل MoE layer). الاتصال ممكن يبقى هو العنق.<br>• <mark>الـ serving</mark>: لو الـ batch صغير كل token بيقرا 2 experts بس، لكن مع batch كبير تقريبًا كل الـ experts بتتفعّل، فبنقرا كل الأوزان من الذاكرة والسرعة بتتحدد بـ memory bandwidth.<br>• التدريب أصعب: الـ balance والـ stability محتاجين انتباه.</p>'+
         '<div class="m">dense: params = active\n       simple, memory ~ compute\nMoE:   params >> active\n       more capacity per FLOP,\n       more memory + communication</div>'+
         '<p>الخلاصة: على نفس الـ FLOPs لكل token الـ MoE غالبًا بيوصل لـ loss أقل من الـ dense، والتمن هو ذاكرة وتعقيد أكبر في الـ infrastructure.</p>',
         '<p>The trade-offs:<br>• <mark>Memory</mark>: you must store all the parameters. Mixtral in bf16 takes <code>46.7e9 × 2 = 93 GB</code> for weights alone, more than one 80 GB GPU, even though its compute is like 13B.<br>• <mark>Expert parallelism</mark>: each GPU holds a few experts, and tokens are sent to the right GPU and back (two all-to-all steps per MoE layer). Communication can become the bottleneck.<br>• <mark>Serving</mark>: with a small batch each token reads only 2 experts, but with a large batch nearly all experts are active, so we read all the weights from memory and speed is set by memory bandwidth.<br>• Training is harder: balance and stability need attention.</p>'+
         '<div class="m">dense: params = active\n       simple, memory ~ compute\nMoE:   params >> active\n       more capacity per FLOP,\n       more memory + communication</div>'+
         '<p>The summary: at the same FLOPs per token, an MoE usually reaches a lower loss than a dense model, and the price is more memory and more complex infrastructure.</p>')),
 q:[
  CQ("Mixtral بـ bf16 (2 byte لكل parameter): ذاكرة الأوزان بس تقريبًا؟ وهل بتدخل في GPU واحدة 80 GB؟","Mixtral in bf16 (2 bytes per parameter): about how much memory for the weights alone, and does it fit one 80 GB GPU?", [["13 GB، بتدخل","13 GB, it fits"],["47 GB، بتدخل","47 GB, it fits"],["93 GB، مبتدخلش","93 GB, it does not fit"],["187 GB، مبتدخلش","187 GB, it does not fit"]], 2,"46.7e9 × 2 byte = 93 GB، أكتر من 80 GB. الحساب زي 13B بس الذاكرة لازم تشيل كل الـ experts.","46.7e9 × 2 bytes = 93 GB, more than 80 GB. The compute is like 13B but the memory must hold all the experts."),
  CQ("ليه الـ serving بـ batch كبير بيقرا تقريبًا كل أوزان الـ MoE؟","Why does serving with a large batch read nearly all the MoE weights?", [["لأن كل expert بيتفعّل بـ token واحد على الأقل من الـ batch","Because every expert is activated by at least one token of the batch"],["لأن الـ router بيتعطّل","Because the router is turned off"],["لأن الـ experts بتتدمج","Because the experts get merged"],["لأن الـ KV cache بيتمسح","Because the KV cache is cleared"]], 0,"كل token بيروح لـ experts مختلفين، فمع batch كبير تقريبًا كل الـ experts بتتفعّل، والسرعة بتتحدد بـ memory bandwidth.","Each token goes to different experts, so with a large batch nearly all experts are active, and speed is set by memory bandwidth.")
 ],
 f:[
  CF("إيه مقايضات الـ MoE؟","What are the trade-offs of MoE?",
     "ذاكرة أكبر (كل الـ parameters لازم تتخزّن)، اتصال all-to-all مرتين في كل MoE layer مع expert parallelism، serving محكوم بالـ memory bandwidth مع batch كبير، وتدريب أصعب (balance وstability).","More memory (all the parameters must be stored), two all-to-all steps per MoE layer with expert parallelism, serving limited by memory bandwidth with a large batch, and harder training (balance and stability)."),
  CF("ليه الـ MoE في الـ serving بيبقى محكوم بالـ memory bandwidth مع batch كبير؟","Why is MoE serving limited by memory bandwidth with a large batch?",
     "لأن الـ tokens بتتوزّع على experts مختلفة، فمع batch كبير تقريبًا كل الـ experts بتشتغل، وبنقرا كل الأوزان من الذاكرة.",
     "The tokens go to different experts, so with a large batch nearly all experts are active, and all the weights are read from memory.")
 ],
 terms:[
  {t:B("Expert parallelism","Expert parallelism"),d:B("كل GPU شايلة شوية experts، والـ tokens بتتبعت للـ GPU الصح وترجع.","Each GPU holds a few experts, and tokens are sent to the right GPU and back.")},
  {t:B("All-to-all","All-to-all"),d:B("اتصال بيبعت فيه كل GPU بيانات لكل GPU تانية. بيتكرر مرتين في كل MoE layer.","Communication where every GPU sends data to every other GPU. It happens twice per MoE layer.")}
 ]},

{id:"l18-quant",
 t:B("Quantization: bits أقل لكل parameter","Quantization: fewer bits per parameter"),
 b:cat(
   B('<p><mark>Quantization</mark> بتخزّن الأوزان بـ bits أقل، فالموديل بياخد ذاكرة أقل واتحميله أسرع. الـ serving غالبًا memory-bound: كل خطوة بتقرا الأوزان الشغّالة، فـ bytes أقل لكل وزن بتعني سرعة أكبر. الذاكرة = <code>N × bits / 8</code>، يعني موديل 7B بيبقى 14 GB بـ 16 bit و 7 GB بـ 8 bit و 3.5 GB بـ 4 bit.</p>',
     '<p><mark>Quantization</mark> stores the weights in fewer bits, so the model takes less memory and loads faster. Serving is usually memory-bound: each step reads the active weights, so fewer bytes per weight means more speed. Memory = <code>N × bits / 8</code>, so a 7B model is 14 GB at 16 bits, 7 GB at 8 bits and 3.5 GB at 4 bits.</p>'),
   FIG_L18_QUANT,
   B('<p>أبسط طريقة: <mark>absmax</mark> int8. بنقسم على scale <code>s = max|w| / 127</code> ونقرّب:</p>'+
     '<div class="m">w  = (0.426, -1.27, 0.031)\ns  = 1.27 / 127 = 0.01\nq  = round(w / s) = (43, -127, 3)\nw^ = q * s = (0.43, -1.27, 0.03)</div>'+
     '<p>الخطأ صغير هنا. بس قيمة شاذة واحدة (outlier) بتكبّر s وتضيّع دقة باقي الأوزان، فبنستخدم scale لكل مجموعة (مثلًا كل 64 أو 128 وزن). عادةً بنعمل الـ quantization بعد التدريب (PTQ: GPTQ وAWQ). الـ 4 bit بتخسّر جودة قليلة، والـ 2 لـ 3 bit بتأثر أكتر. والـ KV cache ممكن يتـ quantize كمان.</p>',
     '<p>The simplest method: <mark>absmax</mark> int8. We divide by a scale <code>s = max|w| / 127</code> and round:</p>'+
     '<div class="m">w  = (0.426, -1.27, 0.031)\ns  = 1.27 / 127 = 0.01\nq  = round(w / s) = (43, -127, 3)\nw^ = q * s = (0.43, -1.27, 0.03)</div>'+
     '<p>The error is small here. But a single outlier inflates s and wastes the precision of the other weights, so we use a scale per group (for example every 64 or 128 weights). We usually quantize after training (PTQ: GPTQ and AWQ). 4 bits loses little quality, while 2 to 3 bits hurts more. The KV cache can be quantized too.</p>')),
 q:[
  CQ("ليه الـ quantization بتسرّع الـ serving غالبًا؟","Why does quantization often speed up serving?", [["لأن الـ FLOPs بتنزل للصفر","Because the FLOPs drop to zero"],["لأن الـ vocabulary بيصغر","Because the vocabulary shrinks"],["لأن الـ attention بيتشال","Because attention is removed"],["لأن الـ serving memory-bound، وbytes أقل لكل وزن معناها قراية أقل من الذاكرة","Because serving is memory-bound, and fewer bytes per weight means less to read from memory"]], 3,"في كل خطوة توليد بنقرا الأوزان من الذاكرة، والسرعة بتتحدد بالـ bandwidth. لو الأوزان نص الحجم القراية بتبقى نص.","At every generation step we read the weights from memory, and speed is set by the bandwidth. If the weights are half the size, the reading is halved."),
  CQ("موديل 70B بـ 4 bit لكل parameter: ذاكرة الأوزان تقريبًا؟","A 70B model at 4 bits per parameter: about how much memory for the weights?", [["140 GB","140 GB"],["35 GB","35 GB"],["70 GB","70 GB"],["17.5 GB","17.5 GB"]], 1,"الذاكرة = N × bits / 8 = 70e9 × 4 / 8 = 35e9 byte = 35 GB. الاختيار 140 GB هو 16 bit، و 70 GB هو 8 bit.","Memory = N × bits / 8 = 70e9 × 4 / 8 = 35e9 bytes = 35 GB. The option 140 GB is 16 bits, and 70 GB is 8 bits.")
 ],
 f:[
  CF("إزاي بتشتغل absmax int8، وليه الـ outliers مشكلة؟","How does absmax int8 work, and why are outliers a problem?",
     "s = max|w| / 127، و q = round(w / s)، و w^ = q × s. قيمة شاذة كبيرة بتكبّر s فباقي الأوزان بتتقرّب بدقة أقل، فبنستخدم scale لكل مجموعة أوزان.","s = max|w| / 127, q = round(w / s), w^ = q × s. A large outlier inflates s, so the other weights are rounded less precisely, which is why we use a scale per group of weights."),
  CF("حجم الموديل بالـ GB بعد الـ quantization؟","How large is a model in GB after quantization?",
     "N × bits / 8. مثلًا 7B: 14 GB بـ 16 bit، 7 GB بـ 8 bit، 3.5 GB بـ 4 bit (للأوزان بس).","N × bits / 8. For example 7B: 14 GB at 16 bits, 7 GB at 8 bits, 3.5 GB at 4 bits (weights only).")
 ],
 terms:[
  {t:B("Quantization","Quantization"),
 d:B("تخزين كل وزن بعدد bits أقل (8 أو 4 بدل 16) لتصغير الموديل، والتمن خطأ تقريب.","Storing each weight with fewer bits (8 or 4 instead of 16) to shrink the model, at the price of rounding error.")},
  {t:B("Post-training quantization (PTQ)","Post-training quantization (PTQ)"),d:B("الـ quantization بعد ما التدريب يخلص، من غير إعادة تدريب كاملة (زي GPTQ وAWQ).","Quantizing after training is finished, without full retraining (such as GPTQ and AWQ).")},
  {t:B("Quantization scale","Quantization scale"),d:B("المعامل <code>s</code> اللي بنقسم عليه الأوزان قبل التقريب. absmax: <code>s = max|w| / 127</code>.","The factor <code>s</code> by which we divide the weights before rounding. For absmax: <code>s = max|w| / 127</code>.")}
 ]},

{id:"l18-ssm",
 t:B("State Space Models: حالة ثابتة بدل الـ attention","State Space Models: a fixed state instead of attention"),
 b:cat(
   B('<p>الـ attention محتاج الماضي كله: وقت O(T^2) والـ KV cache بيكبر. الـ <mark>State Space Model (SSM)</mark> بيشيل حالة <code>h</code> بحجم ثابت وبيحدّثها مع كل token، زي RNN بس بمعادلة خطية:</p>'+
     '<div class="m">h_t = A h_(t-1) + B x_t\ny_t = C h_t\n\nscalar A = 0.9, B = 1, x = (1, 0, 0)\nh = 1, 0.9, 0.81 ...</div>',
     '<p>Attention needs the whole past: O(T^2) time and a growing KV cache. A <mark>State Space Model (SSM)</mark> keeps a state <code>h</code> of fixed size and updates it at every token, like an RNN but with a linear equation:</p>'+
     '<div class="m">h_t = A h_(t-1) + B x_t\ny_t = C h_t\n\nscalar A = 0.9, B = 1, x = (1, 0, 0)\nh = 1, 0.9, 0.81 ...</div>'),
   FIG_L18_SSM,
   B('<p>المعادلة الخطية ليها شكلين: تسلسلي (في الاستخدام: O(1) لكل token وذاكرة ثابتة)، أو convolution على الـ sequence كلها (تدريب متوازي). <mark>S4</mark> (Gu وزمايله، 2021) خلّاها تشتغل على sequences طويلة. و<mark>Mamba</mark> (Gu وDao، 2023) خلّت A وB وC تعتمد على المدخل (<mark>selective</mark>) فالموديل يختار إيه يفتكره ويفضّل، وبتستخدم scan متوازي بدل الـ convolution.</p>'+
     '<p>الحد: حالة بحجم ثابت لازم تضغط الماضي كله، فالاسترجاع الدقيق (ننسخ token معيّن) أضعف من الـ attention. عشان كده فيه موديلات <mark>hybrid</mark> بتخلط طبقات SSM وattention، زي Jamba (2024).</p>',
     '<p>The linear equation has two forms: sequential (at inference: O(1) per token and constant memory), or a convolution over the whole sequence (parallel training). <mark>S4</mark> (Gu et al., 2021) made it work on long sequences. <mark>Mamba</mark> (Gu and Dao, 2023) made A, B and C depend on the input (<mark>selective</mark>), so the model chooses what to remember and forget, and it uses a parallel scan instead of the convolution.</p>'+
     '<p>The limit: a state of fixed size must compress the whole past, so exact recall (copying a specific token) is weaker than with attention. That is why there are <mark>hybrid</mark> models that mix SSM and attention layers, such as Jamba (2024).</p>')),
 q:[
  CQ("إيه أهم ميزة للـ SSM وقت الاستخدام مقارنة بالـ attention؟","What is the main inference-time advantage of an SSM over attention?", [["بيخزّن KV cache أكبر","It stores a larger KV cache"],["بيعمل attention أدق","It makes attention more exact"],["حالة بحجم ثابت: ذاكرة ثابتة ووقت O(1) لكل token","A fixed-size state: constant memory and O(1) time per token"],["بيحتاج parameters أكتر","It needs more parameters"]], 2,"الـ SSM بيلخّص الماضي في h بحجم ثابت، فمبيكبرش مع الطول. التمن: الاسترجاع الدقيق أضعف.","An SSM summarizes the past in a fixed-size h, so it does not grow with the length. The price: exact recall is weaker."),
  CQ("h_t = 0.9 h_(t-1) + x_t و x = (1, 0, 0) و h_0 = 0. قيمة h_3؟","With h_t = 0.9 h_(t-1) + x_t, x = (1, 0, 0) and h_0 = 0, what is h_3?", [["0.81","0.81"],["1.0","1.0"],["0.9","0.9"],["0.73","0.73"]], 0,"h_1 = 1، و h_2 = 0.9 × 1 + 0 = 0.9، و h_3 = 0.9 × 0.9 = 0.81. المدخل الأول بيتلاشى بمعدّل 0.9 كل خطوة.","h_1 = 1, h_2 = 0.9 × 1 + 0 = 0.9, and h_3 = 0.9 × 0.9 = 0.81. The first input fades by a factor of 0.9 each step.")
 ],
 f:[
  CF("إيه الفرق بين SSM وattention؟","What is the difference between an SSM and attention?",
     "الـ attention بيربط كل token بكل اللي قبله (وقت O(T^2) وKV cache بيكبر). الـ SSM بيمرّر حالة h بحجم ثابت (وقت O(T) وذاكرة ثابتة)، بس الاسترجاع الدقيق أضعف.","Attention links every token to everything before it (O(T^2) time and a growing KV cache). An SSM passes a fixed-size state h (O(T) time and constant memory), but exact recall is weaker."),
  CF("إيه اللي أضافه Mamba، وليه الـ hybrids؟","What did Mamba add, and why hybrids?",
     "Mamba خلّت A وB وC تعتمد على المدخل (selective) فبتختار إيه تفتكره. والـ hybrids (زي Jamba) بتخلط SSM وattention عشان تاخد كفاءة الأول ودقة الاسترجاع في التاني.","Mamba made A, B and C depend on the input (selective), so it chooses what to keep. Hybrids (like Jamba) mix SSM and attention to get the efficiency of the first and the exact recall of the second.")
 ],
 terms:[
  {t:B("State Space Model (SSM)","State Space Model (SSM)"),d:B("موديل بيمرّر حالة <code>h</code> بحجم ثابت ويحدّثها بمعادلة خطية: <code>h_t = A h_(t-1) + B x_t</code>.","A model that passes a fixed-size state <code>h</code> and updates it with a linear equation: <code>h_t = A h_(t-1) + B x_t</code>.")},
  {t:B("Mamba","Mamba"),d:B("SSM بتعتمد فيه A وB وC على المدخل (selective)، فبيختار إيه يفتكره.","An SSM where A, B and C depend on the input (selective), so it chooses what to remember.")},
  {t:B("Hybrid model","Hybrid model"),d:B("موديل بيخلط طبقات SSM وطبقات attention.","A model that mixes SSM layers and attention layers.")}
 ]},

{id:"l18-open-questions",
 t:B("أسئلة مفتوحة في الـ NLP: إيه اللي لسه مش محسوم؟","Open questions in NLP: what is not settled yet"),
 b:cat(
   B('<p>الـ <mark>open question</mark> هو سؤال الباحثين لسه مختلفين فيه أو معندهمش إجابة متجرّبة. نبدأ بالداتا، بقاعدة Chinchilla (D = 20N):</p>'+
     '<div class="m">N = 1e12 ('+OQ.n1+')\nD = 20 N = '+OQ.d1+' ('+OQ.d1t+' tokens)\nC = 6 N D = '+OQ.c1+' FLOPs</div>'+
     '<p>كل ما نكبّر الموديل 10 مرات، بيطلب 10 أضعاف الـ tokens. فلحد إمتى النص الكويس يكفي؟</p>',
     '<p>An <mark>open question</mark> is one where researchers still disagree or have no tested answer. Start with data, using the Chinchilla rule (D = 20N):</p>'+
     '<div class="m">N = 1e12 ('+OQ.n1+')\nD = 20 N = '+OQ.d1+' ('+OQ.d1t+' tokens)\nC = 6 N D = '+OQ.c1+' FLOPs</div>'+
     '<p>Each 10x in model size needs 10x more tokens. How long can good text keep up?</p>'),
   B('<p><mark>الداتا والـ synthetic data</mark>: لو النص الكويس على الإنترنت قل، هل الموديلات لسه هتتحسّن؟<br>والداتا اللي موديل بيولّدها: بتضيف معرفة جديدة، ولا بتنسخ عادات الـ teacher بس؟</p>'+
     '<p><mark>موثوقية الـ reasoning</mark>: هل الـ chain of thought الطويلة تفكير حقيقي، ولا حكاية مقنعة بس؟<br>وإزاي نخلّي الإجابة الصح مضمونة مش بس محتملة؟</p>'+
     '<p><mark>الذاكرة والـ continual learning</mark>: هل الموديل يقدر يتعلّم حقايق جديدة بعد التدريب من غير ما ينسى القديم؟<br>والـ context الأطول بديل عن الذاكرة، ولا مجرد buffer أكبر؟</p>'+
     '<p><mark>سلامة الـ agents</mark>: إزاي نأمّن agent بيستخدم أدوات على مدى خطوات كتير؟<br>وإزاي نمسك الغلطات الصغيرة اللي بتتراكم ونحدّ من ضررها؟</p>'+
     '<p><mark>التقييم</mark>: إزاي نقيس القدرة لما <mark>benchmark contamination</mark> ممكن يحصل؟<br>وهل درجة الـ benchmark بتتنبّأ بالسلوك في الاستخدام الحقيقي؟</p>'+
     '<p><mark>بدائل المعمارية</mark>: هل SSM والـ hybrids تلحق الـ attention في الاسترجاع الدقيق على نطاق كبير؟<br>وهل فيه تصميم بقوة الـ Transformer ورخيص في الـ serving؟</p>'+
     '<p><mark>موديل واحد لكل الـ modalities</mark>: هل النص والصورة والصوت يتشاركوا موديل واحد وفضاء tokens واحد؟<br>وإضافة modalities بتحسّن اللغة، ولا بتنافسها على السعة؟</p>'+
     '<p>غلطة شائعة: نعتبر اتجاه واعد (synthetic data أو SSM) مشكلة اتحلّت. كل سطر فوق سؤال مش نتيجة.</p>',
     '<p><mark>Data and synthetic data</mark>: If good web text runs short, can models still keep improving?<br>Does model-generated data add new knowledge, or only copy the habits of the teacher?</p>'+
     '<p><mark>Reasoning reliability</mark>: Is a long chain of thought real reasoning, or only a plausible story?<br>How do we make a correct answer dependable, not just likely?</p>'+
     '<p><mark>Memory and continual learning</mark>: Can a model learn new facts after training without forgetting the old ones?<br>Is a longer context a substitute for memory, or only a bigger buffer?</p>'+
     '<p><mark>Agent safety</mark>: How do we keep an agent safe when it uses tools over many steps?<br>How do we catch small mistakes that compound, and limit their damage?</p>'+
     '<p><mark>Evaluation</mark>: How do we measure ability when <mark>benchmark contamination</mark> is possible?<br>Does a benchmark score predict behavior in real use?</p>'+
     '<p><mark>Architecture alternatives</mark>: Can SSMs or hybrids match attention on exact recall at scale?<br>Is there a design as strong as the Transformer and cheaper to serve?</p>'+
     '<p><mark>One model for all modalities</mark>: Should text, image and audio share one model and one token space?<br>Does adding modalities help language, or compete with it for capacity?</p>'+
     '<p>Common mistake: treating a promising direction (synthetic data, SSMs) as solved. Each line above is a question, not a result.</p>')),
 q:[
  CQ("إيه هو الـ benchmark contamination؟","What is benchmark contamination?",
     [["الاختبار صغير جدًا فالدرجة مش ثابتة","The test set is too small for a stable score"],
      ["أسئلة الاختبار أو إجاباتها دخلت في داتا التدريب، فالدرجة بتبالغ في القدرة","Test questions or their answers leaked into the training data, so the score overstates the ability"],
      ["الموديل اتدرّب على داتا أقل من اللازم","The model was trained on too little data"],
      ["الدرجة اتحسبت كمتوسط على مهام كتير","The score was averaged over too many tasks"]],
     1,"لو الموديل شاف الإجابات وقت التدريب، الدرجة العالية ممكن تعبّر عن حفظ مش قدرة. وعشان كده التقييم لسه سؤال مفتوح.",
     "If the model saw the answers during training, a high score may reflect memory, not ability. That is why evaluation is still an open question."),
  CQ("موديل بـ N = 300B parameter وقاعدة Chinchilla D = 20N. كام token بيطلب؟","A model has N = 300B parameters and the Chinchilla rule D = 20N. How many tokens does it want?",
     [[OQ.wrong6N,OQ.wrong6N],[OQ.d2t,OQ.d2t],[OQ.wrong10D,OQ.wrong10D],[OQ.wrong2N,OQ.wrong2N]],
     1,"D = 20 × 3e11 = "+OQ.d2+" = "+OQ.d2t+" tokens. الاختيار "+OQ.wrong6N+" هو 6N (استخدمنا مُضاعِف الحساب بالغلط). والحساب بعدها C = 6ND = "+OQ.c2+" FLOPs.",
     "D = 20 × 3e11 = "+OQ.d2+" = "+OQ.d2t+" tokens. The option "+OQ.wrong6N+" is 6N (the compute multiplier used by mistake). The compute is then C = 6ND = "+OQ.c2+" FLOPs.")
 ],
 f:[
  CF("إيه محاور الأسئلة المفتوحة السبعة في الكارت ده؟","Name the seven open-question areas in this card.",
     "الداتا والـ synthetic data، موثوقية الـ reasoning، الذاكرة والـ continual learning، سلامة الـ agents، التقييم، بدائل المعمارية، وتوحيد الـ modalities.",
     "Data and synthetic data, reasoning reliability, memory and continual learning, agent safety, evaluation, architecture alternatives, and unifying modalities."),
  CF("ليه الـ synthetic data سؤال مفتوح؟","Why is synthetic data an open question?",
     "لأنها ممكن تضيّق التنوّع وتنسخ الـ teacher بس (mode collapse)، ولسه محتاجين طرق نقيس بيها تنوّعها وجودتها.",
     "Because it may narrow the diversity and only copy the teacher (mode collapse), and we still need ways to measure its diversity and quality.")
 ],
 terms:[
  {t:B("Synthetic data","Synthetic data"),
   d:B("داتا بيولّدها موديل (مش بشر ولا الإنترنت) علشان تتدرّب عليها موديلات.","Data generated by a model, not by people or the web, and used to train models.")},
  {t:B("Continual learning","Continual learning"),
   d:B("إن الموديل يكمّل يتعلّم حاجات جديدة بعد التدريب من غير ما ينسى القديم.","A model keeps learning new things after training without forgetting the old ones.")},
  {t:B("Benchmark contamination","Benchmark contamination"),
   d:B("لما أسئلة الاختبار أو إجاباتها تكون اتشافت في داتا التدريب، فالدرجة بتبالغ في القدرة.","When test questions or answers were seen in the training data, so the score overstates the ability.")}
 ]},

{id:"l18-recap",
 t:B("Recap: الـ scaling والـ MoE والكفاءة","Recap: scaling, MoE and efficiency"),
 b:cat(
   B('<p>5 نقاط:<br>• الـ loss بيتبع power law في N وD وC، فنتوقّعه من موديلات صغيرة.<br>• الحساب <code>C = 6 N D</code>، والوقت = C / (GPUs × peak × MFU).<br>• Chinchilla: D حوالي 20N، بس للاستخدام بنتدرّب أكتر ونعمل distillation.<br>• MoE: parameters كتير، حساب active قليل، بشرط التوازن بين الـ experts.<br>• كفاءة الـ inference: FlashAttention وقلّة الـ KV cache، والـ quantization، والـ SSM.</p>'+
     '<div class="m">L = (N_c / N)^alpha     C = 6 N D\nN* = sqrt(C / 120)    D* = 20 N*\ny = sum g_i FFN_i(x)\nL_aux = alpha N sum f_i P_i\nmemory = N * bits / 8</div>'+
     '<p>قبل ما تكمّل: لازم تقدر تحسب C والـ GPU-hours لموديل، تحسب gates لـ top-2، وتقدّر ذاكرة موديل بعد الـ quantization. دي آخر محاضرة، فراجع الـ glossary.</p>',
     '<p>5 points:<br>• The loss follows a power law in N, D and C, so we predict it from small models.<br>• Compute is <code>C = 6 N D</code>, and time = C / (GPUs × peak × MFU).<br>• Chinchilla: D about 20N, but for serving we train longer and distill.<br>• MoE: many parameters, little active compute, as long as the experts stay balanced.<br>• Inference efficiency: FlashAttention and a smaller KV cache, quantization, and SSMs.</p>'+
     '<div class="m">L = (N_c / N)^alpha     C = 6 N D\nN* = sqrt(C / 120)    D* = 20 N*\ny = sum g_i FFN_i(x)\nL_aux = alpha N sum f_i P_i\nmemory = N * bits / 8</div>'+
     '<p>Before you move on: you should be able to compute C and the GPU-hours of a model, compute the gates for a top-2 router, and estimate a model memory after quantization. This is the last lecture, so review the glossary.</p>')),
 q:[
  CQ("موديل 1B اتدرّب على 20B token. الحساب C تقريبًا؟","A 1B model is trained on 20B tokens. About what is the compute C?", [["2e19 FLOPs","2e19 FLOPs"],["4e20 FLOPs","4e20 FLOPs"],["6e9 FLOPs","6e9 FLOPs"],["1.2e20 FLOPs","1.2e20 FLOPs"]], 3,"C = 6 × 1e9 × 2e10 = 1.2e20. الاختيار 2e19 هو N × D من غير معامل.","C = 6 × 1e9 × 2e10 = 1.2e20. The option 2e19 is N × D with no multiplier."),
  CQ("إيه الصح عن MoE مع quantization؟","Which statement about MoE and quantization is correct?", [["الـ MoE بيقلل الذاكرة لأن expert واحد بيشتغل","MoE reduces memory because one expert runs"],["الـ MoE بيقلل الحساب مش الذاكرة، والـ quantization بتقلل الذاكرة فبتساعد في تخزين كل الـ experts","MoE reduces compute, not memory, and quantization reduces memory, so it helps store all the experts"],["الـ quantization بتغيّر عدد الـ experts","Quantization changes the number of experts"],["الاتنين مالهمش علاقة بالـ serving","Neither relates to serving"]], 1,"الـ MoE لازم تخزّن كل الـ parameters (ذاكرة كبيرة)، والـ quantization بتصغّر كل وزن. مثلًا Mixtral من 93 GB بـ bf16 لحوالي 23 GB بـ int4.","MoE must store all the parameters (large memory), and quantization shrinks every weight. For example Mixtral goes from 93 GB in bf16 to about 23 GB in int4.")
 ],
 f:[
  CF("لخّص الأرقام الأساسية في المحاضرة.","Summarize the key formulas of the lecture.",
     "C = 6ND؛ N* = sqrt(C/120) و D* = 20N*؛ y = sum g_i FFN_i(x)؛ L_aux = alpha N sum f_i P_i؛ الذاكرة = N × bits / 8.","C = 6ND; N* = sqrt(C/120) and D* = 20N*; y = sum g_i FFN_i(x); L_aux = alpha N sum f_i P_i; memory = N × bits / 8."),
  CF("إيه اللي بيخلّي الموديل رخيص في الاستخدام؟","What makes a model cheap to serve?",
     "حجم صغير (تدريب أطول أو distillation)، MoE بحساب active قليل، quantization للذاكرة، وFlashAttention لنقل ذاكرة أقل، وSSM لحالة ثابتة.","A small size (longer training or distillation), an MoE with little active compute, quantization for memory, FlashAttention for less memory traffic, and an SSM for a constant state.")
 ]}
]}
);

})();
