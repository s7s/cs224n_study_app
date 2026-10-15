/* Lecture 12: Natural Language Generation
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L12 fig: autoregressive loop */
function genFig(){
  var s='',C=['&lt;s&gt;','The','cat'],P=[['sat',0.55],['ran',0.25],['is',0.15],['ate',0.05]],i,x,y;
  for(i=0;i<3;i++){x=14+i*56;s+=RECT(x,14,50,26,'var(--sf)','var(--ln)',6,1.5)+T(x+25,32,C[i],'','middle','font-size:11px');}
  s+=RECT(182,14,56,26,'none','var(--ok)',6,1.6).replace('style="','style="stroke-dasharray:4 3;')+T(210,32,'?','tm','middle','font-size:11px');
  s+=AL(95,42,95,64,'ac','mA');
  s+=RECT(20,66,150,32,'var(--acs)','var(--ac)',8,1.8)+T(95,86,'language model','tb','middle','font-size:11.5px');
  s+=AL(95,100,95,122,'ac','mA');
  for(i=0;i<4;i++){
    y=126+i*18;
    s+=T(20,y+11,P[i][0],i===0?'tb':'tm','start','font-size:10.5px');
    s+=RECT(54,y,Math.round(P[i][1]/0.55*110),14,i===0?'var(--ok)':'var(--sf)',i===0?'var(--ok)':'var(--ln)',3,1.4);
    s+=T(54+Math.round(P[i][1]/0.55*110)+6,y+11,P[i][1].toFixed(2),'tm','start','font-size:10px');
  }
  s+=AL(196,138,246,152,'ok','mG');
  s+=T(214,128,'pick','tb','start','font-size:10.5px;fill:var(--ok)');
  s+=RECT(248,142,56,26,'var(--okbg)','var(--ok)',6,1.8)+T(276,160,'sat','tb','middle','font-size:11px');
  s+='<path d="M276 140 V27 H244" style="fill:none;stroke:var(--ok);stroke-width:2;stroke-dasharray:5 4" marker-end="url(#mG)"/>';
  s+=T(284,92,'append','tb','start','font-size:10.5px;fill:var(--ok)')+T(284,106,'and repeat','tm','start','font-size:10px');
  return s;
}

var FIG_GEN=fig(206,genFig(),
  B('الموديل بيطلّع توزيع احتمالات على الـ token الجاي، وطريقة الاختيار (decoding) هي اللي بتقرر. الـ token المختار بيتضاف للنص ونكرر.',
    'The model outputs a probability distribution over the next token, and the decoding method decides which one to pick. The chosen token is appended and we repeat.'));

/* L12 fig: beam search tree, k = 2 */
function beamFig(){
  var s='';
  function node(x,cy,w,txt,kept,best){
    return RECT(x,cy-12,w,24,best?'var(--okbg)':'var(--sf)',kept?'var(--ok)':'var(--mu)',6,kept?1.8:1.2).replace('style="',kept?'style="':'style="stroke-dasharray:4 3;')+
           T(x+w/2,cy+4,txt,best?'tb':(kept?'':'tm'),'middle','font-size:10.5px');
  }
  s+=node(8,100,50,'&lt;s&gt;',true,false);
  s+=AL(58,100,106,64,'ok','mG')+AL(58,100,106,138,'ok','mG');
  s+=node(108,62,76,'the · 0.50',true,false)+node(108,138,76,'a · 0.40',true,false);
  s+=AL(184,62,236,34,'ok','mG')+AL(184,62,236,82,'mu','mM',true);
  s+=AL(184,138,236,124,'ok','mG')+AL(184,138,236,170,'mu','mM',true);
  s+=node(238,34,106,'cat · 0.20',true,false)+node(238,82,106,'dog · 0.15',false,false);
  s+=node(238,124,106,'good · 0.36',true,true)+node(238,170,106,'nice · 0.02',false,false);
  s+=T(10,198,'greedy path: the → cat = 0.20','tb','start','font-size:10.5px;fill:var(--no)');
  s+=T(10,214,'best beam:   a → good = 0.36','tb','start','font-size:10.5px;fill:var(--ok)');
  s+=T(350,198,'solid = kept','tm','end','font-size:10px')+T(350,214,'dashed = pruned','tm','end','font-size:10px');
  return s;
}

var FIG_BEAM=fig(224,beamFig(),
  B('الـ beam search (k = 2) بيحتفظ بمسارين في كل خطوة. الـ greedy كان هيقفل على the → cat باحتمال 0.20، بس المسار a → good احتماله 0.36 وأحسن. الأرقام توضيحية.',
    'Beam search (k = 2) keeps two paths at every step. Greedy would lock onto the → cat with probability 0.20, but the path a → good has 0.36 and is better. The numbers are illustrative.'));

/* L12 fig: temperature */
function tempFig(){
  var s='',G=[['T = 0.5','sharper',[0.867,0.117,0.016]],['T = 1','original',[0.665,0.245,0.090]],['T = 2','flatter',[0.506,0.307,0.186]]],base=140,g,i,x0,h;
  s+='<line x1="8" y1="'+base+'" x2="352" y2="'+base+'" style="stroke:var(--mu);stroke-width:1.3"/>';
  for(g=0;g<3;g++){
    x0=16+g*118;
    for(i=0;i<3;i++){
      h=Math.max(Math.round(G[g][2][i]*110),2);
      s+=RECT(x0+i*32,base-h,24,h,i===0?'var(--ac)':'var(--acs)','var(--ac)',3,1.3);
      s+=T(x0+i*32+12,base-h-5,G[g][2][i].toFixed(3),'tm','middle','font-size:9px');
      s+=T(x0+i*32+12,base+14,['cat','dog','car'][i],'tm','middle','font-size:9.5px');
    }
    s+=T(x0+48,base+34,G[g][0],'tb','middle','font-size:11.5px')+T(x0+48,base+50,G[g][1],'tm','middle','font-size:10.5px');
  }
  s+=T(10,14,'logits = [2, 1, 0]','tm','start','font-size:10.5px');
  return s;
}

var FIG_TEMP=fig(204,tempFig(),
  B('نفس الـ logits بـ temperature مختلفة. T واطية بتخلي التوزيع أحدّ والأعلى يسيطر، و T عالية بتسطّحه وبتدي فرصة أكبر للكلمات الضعيفة.',
    'The same logits at different temperatures. A low T makes the distribution sharper so the top token dominates; a high T flattens it and gives weaker tokens a bigger chance.'));

/* L12 fig: top-k and top-p */
function toppFig(){
  var s='',W=['cat','dog','bird','fish','fox'],P=[0.50,0.30,0.10,0.05,0.05],C=['0.50','0.80','0.90','0.95','1.00'],base=130,i,x,h,keep;
  s+='<line x1="12" y1="'+base+'" x2="348" y2="'+base+'" style="stroke:var(--mu);stroke-width:1.3"/>';
  for(i=0;i<5;i++){
    x=24+i*64;h=Math.round(P[i]*180);keep=(i<3);
    s+=RECT(x,base-h,40,h,keep?'var(--ok)':'var(--sf)',keep?'var(--ok)':'var(--mu)',3,1.4).replace('style="',keep?'style="':'style="stroke-dasharray:4 3;');
    s+=T(x+20,base-h-6,P[i].toFixed(2),keep?'tb':'tm','middle','font-size:10.5px');
    s+=T(x+20,base+16,W[i],keep?'':'tm','middle','font-size:10.5px');
    s+=T(x+20,base+34,C[i],'tm','middle','font-size:10px');
  }
  s+=T(10,14,'sorted probabilities, with cumulative sum below','tm','start','font-size:10px');
  s+='<path d="M24 182 V188 H128 V182" style="fill:none;stroke:var(--ac);stroke-width:1.6"/>'+T(76,204,'top-k = 2','tb','middle','font-size:10.5px;fill:var(--ac)');
  s+='<path d="M24 216 V222 H192 V216" style="fill:none;stroke:var(--ok);stroke-width:1.6"/>'+T(108,238,'top-p = 0.9 keeps 3','tb','middle','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_TOPP=fig(248,toppFig(),
  B('الـ top-k بيقص عند عدد ثابت (هنا 2)، والـ top-p بيقص عند أول نقطة المجموع التراكمي فيها يوصل 0.9، فالحجم بيتغيّر حسب شكل التوزيع.',
    'Top-k cuts at a fixed count (here 2), while top-p cuts at the first point where the cumulative sum reaches 0.9, so its size adapts to the shape of the distribution.'));

/* L12 fig: constrained decoding (logit masking) */
function constrFig(){
  var s='',R=[['&quot;',0.40,false],['2',0.30,true],['3',0.20,true],['{',0.10,false]],i,y,w,k;
  s+=T(10,16,'next token after  {&quot;age&quot;: ','tb','start','font-size:10.5px');
  s+=T(10,32,'model probabilities','tm','start','font-size:10px')+T(224,32,'after mask + renorm.','tm','start','font-size:10px');
  for(i=0;i<4;i++){
    y=42+i*30;k=R[i][2];w=Math.round(R[i][1]*150);
    s+=T(12,y+15,R[i][0],'tb','start','font-size:12px');
    s+=RECT(30,y,w,20,k?'var(--sf)':'var(--nobg)',k?'var(--ln)':'var(--no)',4,1.4).replace('style="',k?'style="':'style="stroke-dasharray:4 3;');
    s+=T(30+w+6,y+14,R[i][1].toFixed(2),'tm','start','font-size:10px');
    if(!k){s+=T(128,y+14,'masked (-inf)','tb','start','font-size:10px;fill:var(--no)');}
    else{
      s+=AL(124,y+10,220,y+10,'ok','mG');
      s+=T(230,y+15,R[i][0],'tb','start','font-size:12px');
      s+=RECT(244,y,Math.round(R[i][1]/0.5*100),20,'var(--okbg)','var(--ok)',4,1.5);
      s+=T(244+Math.round(R[i][1]/0.5*100)+6,y+14,(R[i][1]/0.5).toFixed(2),'tb','start','font-size:10px;fill:var(--ok)');
    }
  }
  s+=T(10,176,'masked = logit -inf, so its probability is exactly 0','tm','start','font-size:10px');
  s+=T(10,192,'valid mass 0.30 + 0.20 = 0.50, so we divide by 0.50','tb','start','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_CONSTRAINED=fig(204,constrFig(),
  B('الـ constrained decoding بيشيل الـ tokens اللي هتكسر الشكل (بتتحط logits بتاعتها -inf)، وبعدين الاحتمالات الباقية بتتظبط تاني لتجمع على 1. الأرقام توضيحية.',
    'Constrained decoding removes the tokens that would break the format (their logits become -inf), then the remaining probabilities are renormalized to sum to 1. The numbers are illustrative.'));

/* L12 fig: KV cache */
function kvFig(){
  var s='',i,x;
  for(i=0;i<5;i++){
    x=10+i*50;
    s+=RECT(x,14,44,24,'var(--sf)','var(--ln)',6,1.4)+T(x+22,30,'t'+(i+1),'','middle','font-size:11px');
    s+=RECT(x,46,44,22,'var(--okbg)','var(--ok)',5,1.4)+T(x+22,61,'K','','middle','font-size:10.5px');
    s+=RECT(x,74,44,22,'var(--okbg)','var(--ok)',5,1.4)+T(x+22,89,'V','','middle','font-size:10.5px');
  }
  s+=RECT(278,14,70,24,'var(--acs)','var(--ac)',6,1.8)+T(313,30,'t6 (new)','tb','middle','font-size:10.5px');
  s+=RECT(278,46,70,22,'var(--acs)','var(--ac)',5,1.6)+T(313,61,'Q','tb','middle','font-size:10.5px');
  s+=RECT(278,74,70,22,'var(--acs)','var(--ac)',5,1.6)+T(313,89,'K, V','tb','middle','font-size:10.5px');
  s+=AL(276,57,262,57,'ac','mA')+AL(276,85,262,85,'ac','mA');
  s+='<path d="M10 106 V112 H258 V106" style="fill:none;stroke:var(--ok);stroke-width:1.5"/>';
  s+=T(134,130,'cached: read, never recomputed','tm','middle','font-size:10.5px');
  s+=T(313,112,'computed','tm','middle','font-size:10px')+T(313,126,'once','tm','middle','font-size:10px');
  s+=T(10,156,'per token: 2 x 32 x 4096 x 2 B = 512 KB','tb','start','font-size:11px');
  s+=T(10,174,'x 4096 tokens = 2 GB per sequence','tb','start','font-size:11px;fill:var(--no)');
  return s;
}

var FIG_KV=fig(186,kvFig(),
  B('الـ token الجديد بيحسب Q و K و V بتوعه بس، ويقرا الـ K و V المخزّنة للـ tokens القديمة. الـ cache بيوفّر حساب بس بياخد ذاكرة. الأرقام لموديل 7B بـ multi-head attention عادي.',
    'The new token computes only its own Q, K and V, and reads the stored K and V of earlier tokens. The cache saves compute but costs memory. Numbers are for a 7B model with plain multi-head attention.'));

/* L12 fig: speculative decoding */
function specFig(){
  var s='',i,x,ok,D=['t1','t2','t3','t4'];
  s+=T(10,14,'draft model (small, fast) proposes 4 tokens','tm','start','font-size:10.5px');
  for(i=0;i<4;i++){
    x=10+i*66;ok=(i<3);
    s+=RECT(x,22,58,26,ok?'var(--okbg)':'var(--nobg)',ok?'var(--ok)':'var(--no)',6,1.6).replace('style="',ok?'style="':'style="stroke-dasharray:4 3;')+T(x+29,39,D[i],ok?'':'tb','middle','font-size:11px'+(ok?'':';fill:var(--no)'));
  }
  s+=T(276,39,'rejected','tb','start','font-size:10px;fill:var(--no)');
  s+=AL(138,50,138,70,'ac','mA');
  s+=RECT(10,72,256,30,'var(--acs)','var(--ac)',8,1.8)+T(138,91,'big model: ONE forward pass checks all 4','tb','middle','font-size:10.5px');
  s+=AL(138,104,138,124,'ac','mA');
  for(i=0;i<4;i++){
    x=10+i*66;ok=(i<3);
    s+=RECT(x,126,58,26,ok?'var(--okbg)':'var(--acs)',ok?'var(--ok)':'var(--ac)',6,1.6)+T(x+29,143,ok?D[i]:"t4'",'tb','middle','font-size:11px');
  }
  s+=T(276,143,'+ 1 fixed','tb','start','font-size:10px;fill:var(--ac)');
  s+=T(10,172,'3 accepted + 1 fixed = 4 tokens per big-model pass','tb','start','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_SPEC=fig(184,specFig(),
  B('الـ draft بيقترح 4 tokens، والموديل الكبير بيتحقق منهم كلهم في pass واحد: 3 اتقبلوا والرابع اتصحّح، فطلعنا بـ 4 tokens بدل 1.',
    'The draft proposes 4 tokens and the big model checks all of them in one pass: 3 are accepted and the fourth is corrected, so we get 4 tokens instead of 1.'));

/* L12 fig: n-gram overlap */
function overlapFig(){
  var R=['the','cat','sat','on','the','mat'],C=['the','cat','is','on','the','mat'],s='',i,x,m;
  s+=T(8,16,'reference (above)','tm','start','font-size:10.5px')+T(8,140,'candidate (below)','tm','start','font-size:10.5px');
  for(i=0;i<6;i++){
    x=8+i*58;m=(R[i]===C[i]);
    s+=RECT(x,24,52,26,'var(--sf)','var(--ln)',6,1.4)+T(x+26,41,R[i],'','middle','font-size:11px');
    s+=RECT(x,96,52,26,m?'var(--okbg)':'var(--nobg)',m?'var(--ok)':'var(--no)',6,1.6)+T(x+26,113,C[i],m?'':'tb','middle','font-size:11px'+(m?'':';fill:var(--no)'));
    s+='<line x1="'+(x+26)+'" y1="52" x2="'+(x+26)+'" y2="94" style="stroke:'+(m?'var(--ok)':'var(--no)')+';stroke-width:1.5;stroke-dasharray:3 3"/>';
  }
  s+=T(10,166,'5 of 6 match: precision = 5/6 = 0.83','tb','start','font-size:10.5px;fill:var(--ok)');
  s+=T(10,188,'paraphrase: a feline rested on the rug','tm','start','font-size:10.5px');
  s+=T(10,204,'2 of 6 match: precision = 2/6 = 0.33','tb','start','font-size:10.5px;fill:var(--no)');
  return s;
}

var FIG_OVERLAP=fig(214,overlapFig(),
  B('مقياس الـ overlap بيعدّ الكلمات المتطابقة مع المرجع. الجملة التانية معناها صح بس بتاخد درجة واطية لأنها استخدمت كلمات تانية.',
    'An overlap metric counts words that match the reference. The second sentence is correct in meaning but scores low because it uses different words.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:12,t:B("Natural Language Generation","Natural Language Generation"),cards:[

{id:"l12-tokenbytoken",t:B("الموديل بيولّد token ورا token","The model generates one token at a time"),
 b:cat(B('<p>الـ language model بيعمل حاجة واحدة بس: بياخد النص اللي قدامه وبيطلّع <mark>توزيع احتمالات</mark> على الـ token الجاي. التوليد هو إننا نكرر ده في loop: نختار token، نضيفه للنص، ونسأل الموديل تاني. الاسم: <mark>autoregressive generation</mark>.</p>'+
         '<div class="m">P(y_1 ... y_T) = P(y_1) * P(y_2 | y_1) * ... * P(y_T | y_1 ... y_(T-1))\nevery step: logits -> softmax -> P(next token)</div>',
         '<p>A language model does one thing only: it takes the text so far and outputs a <mark>probability distribution</mark> over the next token. Generation is repeating that in a loop: pick a token, append it to the text, and ask the model again. The name: <mark>autoregressive generation</mark>.</p>'+
         '<div class="m">P(y_1 ... y_T) = P(y_1) * P(y_2 | y_1) * ... * P(y_T | y_1 ... y_(T-1))\nevery step: logits -> softmax -> P(next token)</div>'),
       FIG_GEN,
       B('<p>نقطة مهمة: الموديل نفسه بيطلّع احتمالات بس. <mark>طريقة اختيار الـ token</mark> (الـ decoding algorithm) قرار منفصل، وهو اللي بيحدد جودة النص. نفس الموديل ونفس الـ prompt ممكن يدّوك كلام ممتاز أو كلام مكرر ومملّ حسب الـ decoding.</p>'+
         '<p>ليه مش بنجرّب كل التسلسلات ونختار الأحسن؟ لو الـ vocabulary فيها 50,000 token ونص من 200 token، عدد التسلسلات الممكنة هو <code>50,000^200</code>. لوغاريتمه: <code>200 * log10(50,000) = 200 * 4.7 = 940</code>، يعني حوالي <code>10^940</code> احتمال. مستحيل نعدّهم، فمحتاجين طريقة ذكية.</p>'+
         '<p>وفي نوعين من المهام بيحتاجوا قرارات مختلفة: <mark>مهام مقفولة</mark> (ترجمة، تلخيص) فيها إجابات صح قليلة، فبنفضّل الأعلى احتمالًا. و<mark>مهام مفتوحة</mark> (قصة، حوار) فيها إجابات كتير مقبولة، فبنفضّل التنوع. الكروت الجاية بتغطي الاتنين.</p>',
         '<p>An important point: the model itself only outputs probabilities. <mark>How we pick the token</mark> (the decoding algorithm) is a separate decision, and it determines text quality. The same model with the same prompt can give excellent text or repetitive, dull text depending on the decoding.</p>'+
         '<p>Why not try every sequence and keep the best? With a 50,000-token vocabulary and a 200-token text, the number of possible sequences is <code>50,000^200</code>. Its logarithm: <code>200 * log10(50,000) = 200 * 4.7 = 940</code>, so about <code>10^940</code> possibilities. We cannot count them, so we need a smart method.</p>'+
         '<p>And two kinds of tasks need different choices: <mark>closed-ended tasks</mark> (translation, summarization) have few right answers, so we prefer the highest probability. <mark>Open-ended tasks</mark> (stories, dialogue) have many acceptable answers, so we prefer diversity. The next cards cover both.</p>')),
 q:[CQ("ليه مش ممكن نجرّب كل التسلسلات الممكنة ونختار أعلى احتمال؟","Why can we not try every possible sequence and keep the highest probability?",
      [["لأن عددهم ضخم جدًا (حوالي V^T)","Because there are far too many (about V^T)"],["الموديل بيطلّع احتمال واحد بس","Because the model outputs only one probability"],["لأن الـ softmax مش بيجمع على 1","Because the softmax does not sum to 1"],["لأن الـ tokenizer بيمنع ده","Because the tokenizer prevents it"]],
      0,"مع vocabulary من 50,000 ونص من 200 token بنوصل لحوالي 10^940 تسلسل.","With a 50,000 vocabulary and a 200-token text we reach about 10^940 sequences."),
    CQ("الـ vocabulary فيها 1,000 token ونص من 3 tokens. كام تسلسل ممكن؟","The vocabulary has 1,000 tokens and the text has 3 tokens. How many sequences are possible?",
   [["3,000","3,000"],["1,000,000","1,000,000"],["1,000,000,000","1,000,000,000"],["6","6"]],
   2,"V^T = 1,000^3 = 10^9. وبيكبر أُسّيًا مع الطول، عشان كده مش بنعدّهم.","V^T = 1,000^3 = 10^9. It grows exponentially with the length, which is why we do not enumerate them.")],
 f:[CF("إيه هو الـ autoregressive generation؟","What is autoregressive generation?",
      "الموديل بيطلّع توزيع احتمالات على الـ token الجاي، نختار token بـ decoding algorithm، نضيفه للنص ونكرر. الاحتمال الكلي حاصل ضرب P(y_t | y_&lt;t).","The model outputs a distribution over the next token, we pick one with a decoding algorithm, append it and repeat. The total probability is the product of P(y_t | y_&lt;t)."),
    CF("كام تسلسل ممكن لو الـ vocabulary 50,000 والنص 200 token؟","How many sequences are possible with a 50,000-token vocabulary and a 200-token text?",
   "حوالي 10^940 (لأن 200 * log10(50,000) ≈ 940). عدد مهول مينفعش نعدّه، عشان كده بنستخدم decoding algorithm.",
   "About 10^940 (since 200 * log10(50,000) is about 940). Far too many to count, so we use a decoding algorithm.")],},


{id:"l12-greedybeam",t:B("Greedy و Beam search","Greedy and beam search"),
 b:cat(B('<p>أبسط decoding هو <mark>greedy</mark>: في كل خطوة ناخد الـ token الأعلى احتمالًا. سريع، بس <mark>قراره محلي</mark>: ممكن يختار token كويس دلوقتي يوديك لتكملة وحشة.</p>'+
         '<div class="m">y_t = argmax_w P(w | y_1 ... y_(t-1))</div>',
         '<p>The simplest decoding is <mark>greedy</mark>: at every step take the highest-probability token. It is fast, but its <mark>decision is local</mark>: a token that looks good now can lead to a bad continuation.</p>'+
         '<div class="m">y_t = argmax_w P(w | y_1 ... y_(t-1))</div>'),
       FIG_BEAM,
       B('<p>الحل الجزئي: <mark>beam search</mark>. بنحتفظ بـ k مسار (الـ beam) بدل مسار واحد. في كل خطوة بنوسّع كل مسار، وبنسيب أعلى k حسب مجموع الـ log probabilities:</p>'+
         '<div class="m">score(y_1 ... y_t) = sum over i of log P(y_i | y_1 ... y_(i-1))</div>'+
         '<p>في الرسم: الـ greedy اختار the (0.50) وبعدها cat (0.40) فالاحتمال الكلي <code>0.5 * 0.4 = 0.20</code>. الـ beam حافظ على a (0.40) كمان، وطلع المسار a → good بـ <code>0.4 * 0.9 = 0.36</code>. بالـ log: <code>ln 0.20 = -1.61</code> و <code>ln 0.36 = -1.02</code>، فالتاني أحسن.</p>',
         '<p>The partial fix: <mark>beam search</mark>. We keep k paths (the beam) instead of one. At each step we expand every path and keep the top k by the sum of log probabilities:</p>'+
         '<div class="m">score(y_1 ... y_t) = sum over i of log P(y_i | y_1 ... y_(i-1))</div>'+
         '<p>In the figure: greedy picked the (0.50) and then cat (0.40), so the total probability is <code>0.5 * 0.4 = 0.20</code>. Beam also kept a (0.40), and the path a → good scores <code>0.4 * 0.9 = 0.36</code>. In logs: <code>ln 0.20 = -1.61</code> and <code>ln 0.36 = -1.02</code>, so the second is better.</p>')),
 q:[
  CQ("ليه قرار greedy ممكن يضيّع أحسن تسلسل؟","Why can the greedy decision miss the best sequence?",
     [["لأنه بيختار أحسن token دلوقتي من غير ما يشوف التكملة، فممكن يدخل مسار احتماله الكلي أقل","Because it picks the best token now without seeing the continuation, so it may enter a path with a lower total probability"],["لأنه بيختار token عشوائي","Because it picks a random token"],["لأنه بيحتفظ بـ k مسار","Because it keeps k paths"],["لأن الـ softmax مش بيجمع على 1","Because the softmax does not sum to 1"]],
     0,"القرار محلي: الـ token الأعلى دلوقتي ممكن يوصّل لتكملة وحشة، زي the ثم cat (0.20) قدام a ثم good (0.36).","The decision is local: the top token now can lead to a bad continuation, like the then cat (0.20) versus a then good (0.36)."),
  CQ("في أول خطوة: A بـ 0.6 و B بـ 0.4. أحسن token تاني بعد A احتماله 0.3، وبعد B احتماله 0.7. إيه الاحتمال الكلي للمسار اللي greedy بيختاره، وهل في مسار أحسن؟","At step one: A has 0.6 and B has 0.4. The best second token after A has probability 0.3, and after B it has 0.7. What is the total probability of the path greedy picks, and is there a better path?",
     [["0.18، ومفيش مسار أحسن","0.18, and there is no better path"],["0.90، وفي مسار أحسن","0.90, and there is a better path"],["0.18، وفي مسار أحسن (0.4 * 0.7 = 0.28)","0.18, and there is a better path (0.4 * 0.7 = 0.28)"],["0.28، ومفيش مسار أحسن","0.28, and there is no better path"]],
     2,"greedy بيختار A: 0.6 * 0.3 = 0.18. المسار B: 0.4 * 0.7 = 0.28، وهو أحسن.","Greedy picks A: 0.6 * 0.3 = 0.18. The B path scores 0.4 * 0.7 = 0.28, which is better.")
],
 f:[CF("إيه الفرق بين greedy و beam search؟","What is the difference between greedy and beam search?",
      "Greedy بياخد الأعلى احتمالًا في كل خطوة (قرار محلي). Beam بيحتفظ بـ k مسار ويسيب أعلى k حسب مجموع الـ log probabilities، فبيلاقي تسلسلات أحسن غالبًا، بتكلفة k مرة.","Greedy takes the highest probability at each step (a local decision). Beam keeps k paths and retains the top k by the sum of log probabilities, so it usually finds better sequences, at k times the cost."),
    CF("إيه معنى k في الـ beam search؟","What does k mean in beam search?",
   "عدد المسارات اللي بنحتفظ بيها في كل خطوة. لما k = 1 بنرجع لـ greedy، وكل ما k يكبر التكلفة بتزيد حوالي k مرة.",
   "The number of paths we keep at each step. With k = 1 we are back to greedy, and the larger k is, the more the cost grows, roughly k times.")],
 terms:[
  {t:B("Greedy decoding","Greedy decoding"),
 d:B("في كل خطوة بناخد الـ token الأعلى احتمالًا. سريع، بس قراره محلي.",
     "At every step, take the highest-probability token. Fast, but the decision is local.")},
{t:B("Beam search","Beam search"),
 d:B("بنحتفظ بـ k مسار، وفي كل خطوة بنسيب أعلى k حسب مجموع الـ log probabilities.",
     "Keep k paths, and at every step retain the top k by the sum of log probabilities.")}
]},


{id:"l12-lengthnorm",t:B("الـ length normalization وحدود الـ beam","Length normalization and the limits of beam search"),
 b:B('<p>ملاحظتين:<br>• الـ beam مش بيضمن أحسن تسلسل، بس بيقرّب منه بتكلفة k مرة.<br>• كل log سالب، فالمجموع بيصغّر كل ما الجملة تطول، والـ beam بيفضّل الجمل القصيرة. الحل: <mark>length normalization</mark> بالقسمة على الطول. مثال: جملة من 3 tokens مجموعها <code>-3.0</code> وجملة من 6 tokens مجموعها <code>-4.8</code>. من غير normalization القصيرة تكسب (-3.0 أعلى من -4.8). بالقسمة: <code>-3.0/3 = -1.0</code> مقابل <code>-4.8/6 = -0.8</code>، فالطويلة تكسب.</p>'+
         '<p>في المهام المقفولة (ترجمة، تلخيص) beam صغير (حوالي 4 إلى 5) بيشتغل كويس. لكن في المهام المفتوحة beam كبير بيدّي نص عام ومكرر، وده موضوع الكروت الجاية.</p>',
         '<p>Two notes:<br>• Beam does not guarantee the best sequence, it only gets closer at k times the cost.<br>• Every log is negative, so the sum shrinks as the sentence grows, and beam favors short sentences. The fix: <mark>length normalization</mark>, dividing by the length. Example: a 3-token sentence sums to <code>-3.0</code> and a 6-token sentence sums to <code>-4.8</code>. Without normalization the short one wins (-3.0 is higher than -4.8). After dividing: <code>-3.0/3 = -1.0</code> versus <code>-4.8/6 = -0.8</code>, so the long one wins.</p>'+
         '<p>For closed-ended tasks (translation, summarization) a small beam (about 4 to 5) works well. But for open-ended tasks a large beam gives generic, repetitive text, which is the topic of the next cards.</p>'),
 q:[CQ("ليه بنقسم score الـ beam على طول الجملة؟","Why do we divide the beam score by the sentence length?",
      [["عشان نسرّع الـ GPU","To speed up the GPU"],["لأن مجموع الـ log probabilities بيصغّر كل ما الجملة تطول، فالجمل القصيرة بتتفضّل بدون وجه حق","Because the sum of log probabilities shrinks as the sentence grows, so short sentences are unfairly favored"],["عشان الـ softmax يجمع على 1","So the softmax sums to 1"],["عشان نمنع التكرار","To prevent repetition"]],
      1,"كل log سالب، فكل token زيادة بينقص المجموع. القسمة على الطول بتعادل ده.","Every log is negative, so each extra token lowers the sum. Dividing by length compensates for that."),
    CQ("جملتين: واحدة 4 tokens مجموع الـ log probabilities بتاعها -2.0، والتانية 8 tokens ومجموعها -3.2. مين بتكسب بعد length normalization؟","Two sentences: one has 4 tokens with a log-probability sum of -2.0, the other has 8 tokens with a sum of -3.2. Which wins after length normalization?",
   [["القصيرة (-0.5 مقابل -0.4)","The short one (-0.5 versus -0.4)"],["الطويلة (-0.4 مقابل -0.5)","The long one (-0.4 versus -0.5)"],["بيتعادلوا","They tie"],["مش ممكن نحسب من غير الـ vocabulary","We cannot compute it without the vocabulary"]],
   1,"-2.0/4 = -0.5 و -3.2/8 = -0.4، والأعلى بيكسب (-0.4). من غير normalization كانت القصيرة هتكسب (-2.0 أعلى من -3.2).","-2.0/4 = -0.5 and -3.2/8 = -0.4, and the higher value wins (-0.4). Without normalization the short one would have won (-2.0 is higher than -3.2).")],
 f:[
  CF("إيه هو الـ length normalization؟","What is length normalization?",
     "بنقسم مجموع الـ log probabilities على طول الجملة، لأن كل token زيادة بيضيف log سالب فالجمل الطويلة كانت هتتظلم.",
     "We divide the sum of log probabilities by the sentence length, because every extra token adds a negative log and long sentences would otherwise be penalized unfairly."),
  CF("امتى beam صغير بيناسب وامتى لأ؟","When does a small beam fit and when does it not?",
     "في المهام المقفولة (ترجمة، تلخيص) beam حوالي 4 إلى 5 بيشتغل كويس. في المهام المفتوحة beam كبير بيدّي نص عام ومكرر.",
     "For closed-ended tasks (translation, summarization) a beam of about 4 to 5 works well. For open-ended tasks a large beam gives generic, repetitive text.")
],
 terms:[
  {t:B("Length normalization","Length normalization"),
 d:B("قسمة السكور على طول الجملة عشان الجمل الطويلة ماتتظلمش.","Dividing the score by the sentence length so long sentences are not penalized.")}
]},

{id:"l12-sampling",t:B("Sampling و Temperature","Sampling and temperature"),
 b:cat(B('<p>بدل ما ناخد الأعلى دايمًا، بنعمل <mark>sampling</mark>: نسحب token عشوائي حسب التوزيع. ده بيدي تنوع، ومناسب للمهام المفتوحة. وبنتحكم في شكل التوزيع بـ <mark>temperature T</mark>: بنقسم الـ logits على T قبل الـ softmax.</p>'+
         '<div class="m">P(w) = exp(z_w / T) / sum over v of exp(z_v / T)</div>',
         '<p>Instead of always taking the top token, we do <mark>sampling</mark>: draw a random token according to the distribution. That gives diversity, which suits open-ended tasks. And we control the shape of the distribution with <mark>temperature T</mark>: we divide the logits by T before the softmax.</p>'+
         '<div class="m">P(w) = exp(z_w / T) / sum over v of exp(z_v / T)</div>'),
       FIG_TEMP,
       B('<p>مثال: logits = <code>[2, 1, 0]</code>.</p>'+
         '<div class="m">T = 1    ->  [0.665, 0.245, 0.090]\nT = 0.5  ->  [0.867, 0.117, 0.016]   (sharper)\nT = 2    ->  [0.506, 0.307, 0.186]   (flatter)</div>'+
         '<p>لما T تقل، الأعلى بياخد كل الاحتمال تقريبًا. لما T → 0 بنوصل لـ greedy. ولما T تكبر، التوزيع بيقرب من uniform (كل الكلمات احتمالها متقارب)، والكلمات الغريبة بتاخد فرصة. لاحظ إن الـ temperature <mark>مش بتغيّر الترتيب</mark>، بتغيّر الحدّة بس.</p>'+
         '<p>قاعدة تقريبية للبداية: T واطية (حوالي 0.2 إلى 0.7) للمهام اللي محتاجة دقة زي الكود واستخراج المعلومات، و T أعلى (حوالي 0.8 إلى 1.0) للكتابة الإبداعية. دي قيم للتجربة مش قواعد ثابتة، وكل موديل ليه سلوكه.</p>'+
         '<p>مشكلة الـ sampling الصافي: التوزيع عنده <mark>tail طويل</mark> من آلاف الـ tokens احتمال كل واحد صغير، لكن مجموعهم كبير. فبنسحب كلمة تافهة كل شوية. ده سبب الكارت الجاي.</p>',
         '<p>An example: logits = <code>[2, 1, 0]</code>.</p>'+
         '<div class="m">T = 1    ->  [0.665, 0.245, 0.090]\nT = 0.5  ->  [0.867, 0.117, 0.016]   (sharper)\nT = 2    ->  [0.506, 0.307, 0.186]   (flatter)</div>'+
         '<p>As T falls, the top token takes almost all the probability. As T → 0 we reach greedy. As T grows, the distribution approaches uniform (all words get similar probability) and odd words get a chance. Note that temperature <mark>does not change the ranking</mark>, only the sharpness.</p>'+
         '<p>A rough starting rule: low T (about 0.2 to 0.7) for tasks that need precision like code and information extraction, and higher T (about 0.8 to 1.0) for creative writing. These are values to experiment with, not fixed rules, and every model behaves differently.</p>'+
         '<p>The problem with pure sampling: the distribution has a <mark>long tail</mark> of thousands of tokens, each with a small probability but a large total. So we draw a nonsense word every so often. That is the reason for the next card.</p>')),
 q:[CQ("رفعنا الـ temperature من 1 لـ 2. إيه اللي بيحصل للتوزيع؟","We raise the temperature from 1 to 2. What happens to the distribution?",
      [["بيبقى أحدّ والكلمة الأولى بتسيطر","It gets sharper and the top word dominates"],["ترتيب الكلمات بيتغيّر","The ranking of the words changes"],["بيبقى أسطح وفرصة الكلمات قليلة الاحتمال بتزيد","It gets flatter and low-probability words get a bigger chance"],["الموديل بيتدرّب أكتر","The model trains more"]],
      2,"قسمة الـ logits على T أكبر من 1 بتقرّب القيم من بعض، فالـ softmax بيدّي توزيع أقرب للـ uniform. الترتيب ثابت.","Dividing the logits by T above 1 brings the values closer together, so the softmax gives a distribution closer to uniform. The ranking stays the same."),
    CQ("الـ logits = [2, 0] و T = 1. كام تقريبًا احتمال الـ token الأول بعد الـ softmax؟","The logits are [2, 0] and T = 1. Roughly what is the probability of the first token after the softmax?",
   [["0.50","0.50"],["0.73","0.73"],["0.88","0.88"],["0.99","0.99"]],
   2,"exp(2) / (exp(2) + exp(0)) = 7.39 / 8.39 = 0.88.","exp(2) / (exp(2) + exp(0)) = 7.39 / 8.39 = 0.88.")],
 f:[CF("إيه تأثير الـ temperature على التوليد؟","What does temperature do to generation?",
      "بتقسم الـ logits على T قبل الـ softmax. T واطية = توزيع أحدّ (أقرب لـ greedy)، T عالية = توزيع أسطح وتنوع أكبر ومخاطرة أكبر. الترتيب ما بيتغيّرش.","It divides the logits by T before the softmax. Low T = a sharper distribution (closer to greedy); high T = a flatter distribution with more diversity and more risk. The ranking does not change."),
    CF("لو logits = [2, 1, 0] و T = 0.5، إيه الاحتمالات؟","If logits = [2, 1, 0] and T = 0.5, what are the probabilities?",
   "[0.867, 0.117, 0.016]. أحدّ من T = 1 ([0.665, 0.245, 0.090]) والترتيب زي ما هو.",
   "[0.867, 0.117, 0.016]. Sharper than T = 1 ([0.665, 0.245, 0.090]) and the ranking is unchanged.")],
 terms:[
  {t:B("Temperature","Temperature"),
 d:B("رقم T بنقسم عليه الـ logits قبل الـ softmax. T واطية = توزيع أحدّ، T عالية = توزيع أسطح. الترتيب ما بيتغيّرش.",
     "A number T that divides the logits before the softmax. Low T = a sharper distribution, high T = a flatter one. The ranking does not change.")}
]},


{id:"l12-topkp",t:B("Top-k و Top-p ومشكلة التكرار","Top-k, top-p and the repetition problem"),
 b:cat(B('<p>الحل لمشكلة الـ tail: <mark>نقص الـ tail</mark> قبل السحب.<br>• <mark>Top-k</mark>: نفضل أعلى k token ونعمل renormalize. عيبه إن k ثابت مهما كان شكل التوزيع. لو token واحد احتماله 0.95، k = 50 بيدخّل 49 token تافهة. ولو التوزيع مسطّح، k = 5 ممكن يقص كلمات كويسة.<br>• <mark>Top-p</mark> (أو nucleus): نفضل أصغر مجموعة مجموع احتمالاتها على الأقل p. الحجم بيتغيّر مع شكل التوزيع.</p>',
         '<p>The fix for the tail problem: <mark>cut the tail</mark> before drawing.<br>• <mark>Top-k</mark>: keep the top k tokens and renormalize. Its flaw is that k is fixed regardless of the distribution. If one token has probability 0.95, k = 50 lets in 49 junk tokens. And if the distribution is flat, k = 5 may cut good words.<br>• <mark>Top-p</mark> (or nucleus): keep the smallest set whose probabilities sum to at least p. Its size changes with the shape of the distribution.</p>'),
       FIG_TOPP,
       B('<p>مثال: الاحتمالات <code>[0.50, 0.30, 0.10, 0.05, 0.05]</code>.</p>'+
         '<div class="m">top-k = 2:  keep 0.50, 0.30  (sum 0.80)\n           renormalize -> 0.625, 0.375\ntop-p = 0.9: cumulative 0.50, 0.80, 0.90 -> stop\n           keep 3 (sum 0.90)\n           renormalize -> 0.556, 0.333, 0.111</div>'+
         '<p>ليه كل ده بدل الـ beam؟ دراسة <mark>neural text degeneration</mark> (Holtzman وآخرين، وفيها اتقدّم الـ nucleus sampling) لاحظت إن <mark>النص البشري مش دايمًا الأعلى احتمالًا</mark>. الـ greedy والـ beam بيطلّعوا نص مكرر بيلف في نفس الجملة. والسبب إن التكرار <mark>بيعزّز نفسه</mark>: كل مرة تتكرر الجملة، احتمال تكرارها تاني بيزيد.</p>'+
         '<p>الإعداد الشائع للمهام المفتوحة: top-p حوالي 0.9 إلى 0.95 مع temperature متوسطة. وفي كمان <mark>repetition penalty</mark> (نخفّض logits الـ tokens اللي ظهرت قبل كده) ومنع تكرار الـ n-gram. وكلهم تحايل على المشكلة مش حل جذري.</p>',
         '<p>An example: probabilities <code>[0.50, 0.30, 0.10, 0.05, 0.05]</code>.</p>'+
         '<div class="m">top-k = 2:  keep 0.50, 0.30  (sum 0.80)\n           renormalize -> 0.625, 0.375\ntop-p = 0.9: cumulative 0.50, 0.80, 0.90 -> stop\n           keep 3 (sum 0.90)\n           renormalize -> 0.556, 0.333, 0.111</div>'+
         '<p>Why all this instead of beam? The <mark>neural text degeneration</mark> study (Holtzman and others, which introduced nucleus sampling) observed that <mark>human text is not always the highest-probability text</mark>. Greedy and beam produce repetitive text that loops over the same sentence. The reason is that repetition <mark>reinforces itself</mark>: every time a sentence repeats, the probability of repeating it again goes up.</p>'+
         '<p>A common setup for open-ended tasks: top-p around 0.9 to 0.95 with a moderate temperature. There is also a <mark>repetition penalty</mark> (lowering the logits of tokens that already appeared) and n-gram blocking. All of these work around the problem rather than solve it at the root.</p>')),
 q:[CQ("التوزيع حاد جدًا: token واحد احتماله 0.97. إيه اللي بيعمله top-p = 0.9؟","The distribution is very sharp: one token has probability 0.97. What does top-p = 0.9 do?",
      [["بيحتفظ بـ 50 token","It keeps 50 tokens"],["بيختار عشوائي من الـ vocabulary كلها","It picks randomly from the whole vocabulary"],["بيرفع الـ temperature","It raises the temperature"],["بيحتفظ بالـ token ده لوحده تقريبًا","It keeps essentially that one token alone"]],
      3,"أول token لوحده بيوصّل المجموع التراكمي لـ 0.97 وهو أكبر من 0.9، فنقف عنده.","The first token alone brings the cumulative sum to 0.97, which exceeds 0.9, so we stop there."),
    CQ("الاحتمالات [0.6, 0.2, 0.1, 0.1] و top-k = 2. بعد الـ renormalize، كام احتمال أول token؟","The probabilities are [0.6, 0.2, 0.1, 0.1] and top-k = 2. After renormalizing, what is the probability of the first token?",
   [["0.60","0.60"],["0.75","0.75"],["0.80","0.80"],["0.50","0.50"]],
   1,"بنحتفظ بـ 0.6 و 0.2 (مجموعهم 0.8)، و 0.6 / 0.8 = 0.75.","We keep 0.6 and 0.2 (sum 0.8), and 0.6 / 0.8 = 0.75.")],
 f:[CF("إيه الفرق بين top-k و top-p؟","What is the difference between top-k and top-p?",
      "Top-k بيفضّل عدد ثابت k من الـ tokens. Top-p بيفضّل أصغر مجموعة مجموع احتمالاتها على الأقل p، فحجمها بيتغيّر حسب شكل التوزيع.","Top-k keeps a fixed number k of tokens. Top-p keeps the smallest set whose probabilities sum to at least p, so its size adapts to the shape of the distribution."),
    CF("الاحتمالات [0.50, 0.30, 0.10, 0.05, 0.05] و top-p = 0.9. كام token بنفضّل وإيه احتمالاتهم بعد الـ renormalize؟",
   "The probabilities are [0.50, 0.30, 0.10, 0.05, 0.05] and top-p = 0.9. How many tokens do we keep, and what are their probabilities after renormalizing?",
   "3 tokens (المجموع التراكمي 0.50 ثم 0.80 ثم 0.90). بعد الـ renormalize: [0.556, 0.333, 0.111].",
   "3 tokens (cumulative sum 0.50, then 0.80, then 0.90). After renormalizing: [0.556, 0.333, 0.111].")],
 terms:[
  {t:B("Top-k sampling","Top-k sampling"),
 d:B("بنفضّل أعلى k tokens بس، نعمل renormalize ونسحب منهم. الـ k ثابت مهما كان شكل التوزيع.",
     "Keep only the top k tokens, renormalize and sample from them. k is fixed whatever the shape of the distribution.")},
{t:B("Top-p (nucleus) sampling","Top-p (nucleus) sampling"),
 d:B("بنفضّل أصغر مجموعة tokens مجموع احتمالاتها على الأقل p ونسحب منها. حجمها بيتكيّف مع شكل التوزيع.",
     "Keep the smallest set of tokens whose probabilities sum to at least p and sample from it. Its size adapts to the shape of the distribution.")}
]},


{id:"l12-constrained",t:B("Constrained decoding: ضمان شكل الـ output","Constrained decoding: guaranteeing the output format"),
 b:cat(
  B('<p>أوقات الـ output لازم يمشي على شكل محدد بالظبط: JSON لـ API call أو SQL query. إنك تطلب الشكل في الـ prompt بيشتغل غالبًا، بس قوس ناقص واحد بيكسر الـ parser. الـ <mark>constrained decoding</mark> بيفرض الشكل <mark>وقت الـ decoding</mark>، فالـ output صالح بالتصميم.</p>',
    '<p>Sometimes the output must follow an exact format: JSON for an API call or a SQL query. Asking for the format in the prompt works most of the time, but one missing brace breaks the parser. <mark>Constrained decoding</mark> enforces the format <mark>during decoding</mark>, so the output is valid by construction.</p>'),
  FIG_CONSTRAINED,
  B('<p>الفكرة من نفس عيلة top-k و top-p: نعدّل التوزيع قبل السحب، بس هنا بنقص حسب <mark>الصلاحية</mark> مش حسب الاحتمال. في كل خطوة:</p>'+
    '<div class="m">1. grammar or JSON schema -> the set of valid next tokens\n2. logits of every other token = -inf   (logit masking)\n3. softmax, then greedy or sampling as usual</div>'+
    '<p>مثال: بعد <code>{"age": </code> الصالح رقم بس. الموديل أدّى <code>"</code> بـ 0.40 و <code>2</code> بـ 0.30 و <code>3</code> بـ 0.20 و <code>{</code> بـ 0.10. بنعمل mask لـ <code>"</code> و <code>{</code>، فالمتبقي 0.50 ونعمل renormalize: <code>2</code> = 0.30/0.50 = 0.60 و <code>3</code> = 0.20/0.50 = 0.40.</p>'+
    '<p>غلطة شائعة: القيد بيضمن <mark>الشكل</mark> مش <mark>صحة المحتوى</mark>. الـ JSON هيتعمله parse بنجاح والعمر ممكن يبقى غلط. وكتير من الـ APIs بتقدّم ده باسم JSON mode أو structured outputs.</p>',
    '<p>The idea is in the same family as top-k and top-p: edit the distribution before the draw, but here we cut by <mark>validity</mark> instead of by probability. At every step:</p>'+
    '<div class="m">1. grammar or JSON schema -> the set of valid next tokens\n2. logits of every other token = -inf   (logit masking)\n3. softmax, then greedy or sampling as usual</div>'+
    '<p>Example: after <code>{"age": </code> only a number is valid. The model gave <code>"</code> 0.40, <code>2</code> 0.30, <code>3</code> 0.20 and <code>{</code> 0.10. We mask <code>"</code> and <code>{</code>, so 0.50 remains and we renormalize: <code>2</code> = 0.30/0.50 = 0.60 and <code>3</code> = 0.20/0.50 = 0.40.</p>'+
    '<p>Common mistake: the constraint guarantees the <mark>format</mark>, not the <mark>correctness of the content</mark>. The JSON will parse and the age can still be wrong. Many APIs offer this as JSON mode or structured outputs.</p>')),
 q:[
  CQ("إزاي بيضمن الـ constrained decoding إن الـ JSON يطلع صالح؟","How does constrained decoding guarantee that the JSON comes out valid?",
     [["بإننا نطلب الشكل بأدب في الـ prompt","By asking for the format politely in the prompt"],["بإننا نعمل mask لـ logits الـ tokens اللي هتكسر الشكل قبل الـ softmax","By masking the logits of tokens that would break the format before the softmax"],["بإننا نعيد تدريب الموديل بعد كل request","By retraining the model after every request"],["بإننا نخلي الـ temperature صفر","By setting the temperature to zero"]],
     1,"الـ tokens غير الصالحة احتمالها بيبقى 0 بالظبط، فمش ممكن تتسحب. والـ temperature صفر لوحدها مش بتضمن الشكل.","Invalid tokens get probability exactly 0, so they can never be drawn. A temperature of zero alone does not guarantee the format."),
  CQ("الموديل أدّى: 7 بـ 0.30 و 8 بـ 0.10 و ok بـ 0.60. الصالح أرقام بس. بعد الـ mask والـ renormalize، كام احتمال 7؟","The model gave: 7 at 0.30, 8 at 0.10 and ok at 0.60. Only digits are valid. After masking and renormalizing, what is the probability of 7?",
     [["0.30","0.30"],["0.50","0.50"],["0.75","0.75"],["0.25","0.25"]],
     2,"بنشيل ok (0.60) فالمتبقي 0.30 + 0.10 = 0.40، و 0.30 / 0.40 = 0.75.","We remove ok (0.60), leaving 0.30 + 0.10 = 0.40, and 0.30 / 0.40 = 0.75.")
],
 f:[
  CF("إيه هو الـ constrained decoding؟","What is constrained decoding?",
     "في كل خطوة بنعمل mask لـ logits الـ tokens اللي هتكسر الشكل المطلوب (grammar أو JSON schema) قبل الـ softmax، فالـ output صالح الشكل بالتصميم.",
     "At every step we mask the logits of tokens that would break the required format (a grammar or JSON schema) before the softmax, so the output is valid by construction."),
  CF("إيه اللي الـ constrained decoding مبيضمنوش؟","What does constrained decoding not guarantee?",
     "بيضمن الشكل (syntax) بس مش صحة المحتوى: الـ JSON ممكن يتعمله parse بنجاح والقيمة غلط.",
     "It guarantees the syntax but not the correctness of the content: the JSON can parse fine while the value is wrong.")
],
 terms:[
  {t:B("Constrained decoding","Constrained decoding"),
   d:B("تقييد التوليد عشان الـ output يمشي دايمًا على شكل مطلوب (grammar أو JSON schema) بإخفاء الـ tokens غير الصالحة في كل خطوة.",
       "Restricting generation so the output always follows a required format (a grammar or JSON schema), by hiding the invalid tokens at every step.")},
  {t:B("Logit masking","Logit masking"),
   d:B("بنحط logits الـ tokens الممنوعة = -inf قبل الـ softmax، فاحتمالها بيبقى 0 والباقي بيتظبط ليجمع على 1.",
       "Setting the logits of disallowed tokens to -inf before the softmax, so their probability becomes 0 and the rest renormalizes to sum to 1.")},
  {t:B("JSON schema","JSON schema"),
   d:B("وصف للشكل المسموح لـ JSON object: الحقول وأنواعها والحقول الإجبارية.",
       "A description of the allowed structure of a JSON object: its fields, their types and which are required.")}
]},

{id:"l12-kvcache",t:B("الـ KV cache وسرعة التوليد","The KV cache and generation speed"),
 b:cat(B('<p>التوليد بطيء لأنه <mark>متسلسل</mark>: كل token جديد محتاج forward pass. والـ attention محتاج لكل token: الـ <mark>Query</mark> بتاعه، و<mark>Keys و Values</mark> لكل الـ tokens السابقة. الموديل causal، فالـ K و V للـ tokens القديمة <mark>ما بتتغيّرش</mark> لما نضيف token جديد. فبنخزّنهم: ده الـ <mark>KV cache</mark>.</p>'+
         '<p>كل خطوة بقت: نحسب Q و K و V للـ token الجديد بس، نضيف K و V للـ cache، ونعمل attention على الـ cache كله.</p>',
         '<p>Generation is slow because it is <mark>sequential</mark>: every new token needs a forward pass. And attention needs, for each token, its <mark>Query</mark> and the <mark>Keys and Values</mark> of all earlier tokens. The model is causal, so the K and V of old tokens <mark>do not change</mark> when we add a new token. So we store them: that is the <mark>KV cache</mark>.</p>'+
         '<p>Each step becomes: compute Q, K and V for the new token only, append K and V to the cache, and run attention over the whole cache.</p>'),
       FIG_KV,
       B('<p>التمن هو <mark>الذاكرة</mark>. لموديل 7B (32 layer، و d_model = 4096، بدقة 16 bit):</p>'+
         '<div class="m">per token = 2 (K and V) * 32 layers * 4096 * 2 bytes\n          = 524,288 bytes = 0.5 MB\n4096 tokens -> 2,147,483,648 bytes = 2 GB</div>',
         '<p>The price is <mark>memory</mark>. For a 7B model (32 layers, d_model = 4096, 16-bit precision):</p>'+
         '<div class="m">per token = 2 (K and V) * 32 layers * 4096 * 2 bytes\n          = 524,288 bytes = 0.5 MB\n4096 tokens -> 2,147,483,648 bytes = 2 GB</div>')),
 q:[CQ("ليه نقدر نخزّن K و V للـ tokens القديمة ونعيد استخدامهم؟","Why can we store the K and V of old tokens and reuse them?",
      [["لأن الـ GPU مش بتقدر تحسبهم تاني","Because the GPU cannot recompute them"],["لأن الموديل causal، فالـ tokens القديمة مش بتتأثر بالجديدة وقيمها ثابتة","Because the model is causal, so old tokens are not affected by new ones and their values are fixed"],["لأن الـ softmax مش محتاج الـ keys","Because the softmax does not need the keys"],["لأن الـ Query بتاعهم ثابت","Because their Query is fixed"]],
      1,"كل token بيشوف اللي قبله بس، فتمثيله ما بيتغيّرش لما نضيف token بعده.","Each token sees only what comes before it, so its representation does not change when we add a token after it."),
    CQ("موديل فيه 16 layer و d_model = 2048 بدقة 16 bit. كام الـ KV cache لـ token واحد؟","A model has 16 layers, d_model = 2048 and 16-bit precision. How big is the KV cache for one token?",
   [["64 KB","64 KB"],["128 KB","128 KB"],["256 KB","256 KB"],["512 KB","512 KB"]],
   1,"2 (K و V) * 16 * 2048 * 2 bytes = 131,072 bytes = 128 KB.","2 (K and V) * 16 * 2048 * 2 bytes = 131,072 bytes = 128 KB.")],
 f:[CF("إيه هو الـ KV cache وتمنه إيه؟","What is the KV cache and what does it cost?",
      "تخزين الـ Keys والـ Values للـ tokens السابقة عشان ما نعيدش حسابهم. بيوفّر حساب بس بياخد ذاكرة: لموديل 7B حوالي 0.5 MB لكل token، يعني 2 GB لـ 4096 token لكل request.","Storing the Keys and Values of earlier tokens so we do not recompute them. It saves compute but costs memory: for a 7B model about 0.5 MB per token, so 2 GB for 4096 tokens per request."),
    CF("إزاي بنحسب حجم الـ KV cache لـ token واحد؟","How do we compute the KV cache size for one token?",
   "2 (K و V) * عدد الـ layers * d_model * bytes لكل رقم. مثال: 24 layer و d_model = 2048 و16-bit: 2 * 24 * 2048 * 2 = 196,608 bytes = 192 KB.",
   "2 (K and V) * layers * d_model * bytes per number. Example: 24 layers, d_model = 2048, 16-bit: 2 * 24 * 2048 * 2 = 196,608 bytes = 192 KB.")],
 terms:[
  {t:B("KV cache","KV cache"),
 d:B("تخزين الـ Keys والـ Values للـ tokens السابقة عشان ما نحسبهاش تاني في كل خطوة. بيوفّر حساب وبيكلّف ذاكرة.",
     "Storing the Keys and Values of earlier tokens so we do not recompute them at every step. It saves compute and costs memory.")}
]},


{id:"l12-speculative",t:B("ضغط الذاكرة و Speculative decoding","Memory pressure and speculative decoding"),
 b:cat(B('<p>وده لـ request واحد. لو بتخدم 50 مستخدم في نفس الوقت: <code>50 * 2 GB = 100 GB</code> كاش بس. عشان كده الـ serving بيتقيّد بالذاكرة مش بالحساب، وعشان كده ظهرت تقنيات زي <mark>grouped-query attention</mark> اللي بتخلي الـ heads تتشارك K و V فالـ cache يصغر.</p>'+
         '<p>حيلة تانية للسرعة: <mark>speculative decoding</mark>. موديل صغير سريع (draft) بيقترح k token، والموديل الكبير بيتحقق منهم كلهم في forward pass واحد، فيقبل المطابق لتوزيعه ويرفض الباقي ويصحّح. النتيجة <mark>نفس توزيع الموديل الكبير بالظبط</mark> بس أسرع. مثال: الـ draft اقترح 4 tokens وتقبّل منهم 3: بنطلع بـ 3 + token مصحّح = 4 tokens بـ pass واحد من الكبير بدل 1.</p>',
         '<p>And that is for one request. Serving 50 users at once: <code>50 * 2 GB = 100 GB</code> for the cache alone. That is why serving is limited by memory rather than compute, and why techniques like <mark>grouped-query attention</mark> appeared, letting heads share K and V so the cache shrinks.</p>'+
         '<p>Another speed trick: <mark>speculative decoding</mark>. A small fast model (the draft) proposes k tokens, and the big model verifies all of them in one forward pass, accepting those that match its distribution and rejecting and correcting the rest. The result is <mark>exactly the big model\'s distribution</mark>, only faster. Example: the draft proposed 4 tokens and 3 were accepted: we get 3 + one corrected token = 4 tokens from a single pass of the big model instead of 1.</p>'),
       FIG_SPEC),
 q:[
  CQ("إيه الضمان اللي بيقدّمه الـ speculative decoding؟","What guarantee does speculative decoding give?",
     [["جودة أعلى من الموديل الكبير","Higher quality than the big model"],["ذاكرة أقل للـ KV cache","A smaller KV cache"],["نفس توزيع الموديل الكبير بالظبط لكن أسرع","Exactly the big model distribution, only faster"],["الـ draft model بيبقى هو الموديل النهائي","The draft model becomes the final model"]],
     2,"الموديل الكبير بيتحقق من اقتراحات الـ draft ويقبل أو يرفض ويصحّح، فالنتيجة بنفس توزيعه هو.","The big model verifies the draft proposals, accepting or rejecting and correcting, so the result follows its own distribution."),
  CQ("الـ draft اقترح 6 tokens والموديل الكبير قبل 2 منهم. حسب حساب الكارت، كام token بنطلع بيهم من pass واحد؟","The draft proposed 6 tokens and the big model accepted 2 of them. By the counting in the card, how many tokens do we get from one pass?",
     [["2","2"],["3","3"],["6","6"],["7","7"]],
     1,"2 مقبولين + token واحد مصحّح = 3 tokens، بدل token واحد من غير speculative decoding.","2 accepted + 1 corrected token = 3 tokens, instead of 1 without speculative decoding.")
],
 f:[
  CF("إيه هو الـ speculative decoding؟","What is speculative decoding?",
     "موديل صغير سريع (draft) بيقترح k token والموديل الكبير بيتحقق منهم كلهم في forward pass واحد، فيقبل المطابق ويصحّح الباقي. النتيجة نفس توزيع الموديل الكبير بس أسرع.",
     "A small fast model (the draft) proposes k tokens and the big model verifies all of them in one forward pass, accepting the matching ones and correcting the rest. The result follows the big model distribution, only faster."),
  CF("ليه الـ serving بيتقيّد بالذاكرة؟","Why is serving limited by memory?",
     "الـ KV cache لكل request بياخد GBs (حوالي 2 GB لـ 4096 token في موديل 7B)، فعدد المستخدمين في نفس الوقت بيتحدد بالذاكرة مش بالحساب.",
     "Each request has a KV cache of several GB (about 2 GB for 4096 tokens in a 7B model), so the number of simultaneous users is set by memory rather than compute.")
],
 terms:[
  {t:B("Speculative decoding","Speculative decoding"),
   d:B("موديل صغير سريع بيقترح كذا token والموديل الكبير بيتحقق منهم في pass واحد، فالتوزيع بيفضل توزيع الموديل الكبير والسرعة بتزيد.",
       "A small fast model proposes several tokens and the big model verifies them in one pass, so the distribution stays the big model one while speed goes up.")},
  {t:B("Draft model","Draft model"),
   d:B("الموديل الصغير السريع اللي بيقترح tokens في الـ speculative decoding.",
       "The small fast model that proposes tokens in speculative decoding.")}
]},

{id:"l12-eval",t:B("تقييم النص المولّد","Evaluating generated text"),
 b:cat(B('<p>أول مقياس: <mark>perplexity</mark>. بيقيس قد إيه الموديل "متفاجئ" بنص حقيقي:</p>'+
         '<div class="m">PPL = exp( -(1/N) * sum over i of log P(y_i | y_1 ... y_(i-1)) )</div>'+
         '<p>مثال بالـ bits (log أساس 2): 4 tokens احتمالاتها <code>0.5, 0.25, 0.125, 0.5</code>، يعني <code>1, 2, 3, 1</code> bits. المتوسط <code>7/4 = 1.75</code> bits، و <code>PPL = 2^1.75 = 3.36</code>. معناها: الموديل كأنه بيتردد بين 3.4 اختيارات متساوية في كل خطوة. الأقل أحسن، بس بتتقارن بس لما الـ tokenizer والداتا نفسهم. وهي بتقيس <mark>الموديل</mark> مش جودة نص مولّد معيّن.</p>',
         '<p>The first metric: <mark>perplexity</mark>. It measures how "surprised" the model is by real text:</p>'+
         '<div class="m">PPL = exp( -(1/N) * sum over i of log P(y_i | y_1 ... y_(i-1)) )</div>'+
         '<p>An example in bits (log base 2): 4 tokens with probabilities <code>0.5, 0.25, 0.125, 0.5</code>, which is <code>1, 2, 3, 1</code> bits. The average is <code>7/4 = 1.75</code> bits, and <code>PPL = 2^1.75 = 3.36</code>. It means the model acts as if it were choosing between 3.4 equally likely options at every step. Lower is better, but it is comparable only when the tokenizer and data are the same. And it measures the <mark>model</mark>, not the quality of a particular generated text.</p>'),
       FIG_OVERLAP,
       B('<p>لتقييم نص مولّد قدام مرجع: <mark>BLEU</mark> (بيعتمد على precision للـ n-grams، شائع في الترجمة) و <mark>ROUGE</mark> (بيعتمد على recall، شائع في التلخيص). المثال في الرسم بيستخدم unigram precision: عدد الكلمات المتطابقة على عدد كلمات الـ candidate.</p>'+
         '<p>المشكلة واضحة: <mark>الـ paraphrase الصح بياخد درجة واطية</mark> (0.33 في المثال) لأن المقياس بيعدّ كلمات مش معنى. وفي المهام المفتوحة مفيش مرجع واحد أصلًا. فظهرت بدايل:<br>• مقاييس بالـ embeddings زي <mark>BERTScore</mark> بتقارن المعنى.<br>• <mark>LLM-as-a-judge</mark>: موديل بيقيّم المخرجات حسب معايير مكتوبة.<br>• <mark>التقييم البشري</mark>: الأدق، بس غالي وبيحتاج معايير واضحة (طلاقة، صحة معلومات، صلة) وأكتر من مقيّم.</p>'+
         '<p>التقييم والـ benchmarks هيتفصّلوا في محاضرة Evaluation. الفكرة هنا: <mark>ما تقيّمش التوليد بمقياس واحد</mark>، وافحص عيّنات بنفسك.</p>',
         '<p>To score generated text against a reference: <mark>BLEU</mark> (based on n-gram precision, common in translation) and <mark>ROUGE</mark> (based on recall, common in summarization). The figure uses unigram precision: matching words divided by the number of candidate words.</p>'+
         '<p>The problem is clear: <mark>a correct paraphrase gets a low score</mark> (0.33 in the example) because the metric counts words, not meaning. And in open-ended tasks there is no single reference anyway. So alternatives appeared:<br>• Embedding-based metrics like <mark>BERTScore</mark> compare meaning.<br>• <mark>LLM-as-a-judge</mark>: a model scores outputs against written criteria.<br>• <mark>Human evaluation</mark>: the most accurate, but costly and it needs clear criteria (fluency, factuality, relevance) and more than one rater.</p>'+
         '<p>Evaluation and benchmarks are covered in detail in the Evaluation lecture. The idea here: <mark>do not judge generation with a single metric</mark>, and inspect samples yourself.</p>')),
 q:[CQ("المرجع: the cat sat on the mat. الموديل ولّد: a feline rested on the rug (معناها صح). الـ unigram precision طلعت 0.33. إيه الاستنتاج؟","Reference: the cat sat on the mat. The model produced: a feline rested on the rug (correct meaning). The unigram precision came out 0.33. What is the conclusion?",
      [["الجملة غلط","The sentence is wrong"],["لازم نرفع الـ temperature","We must raise the temperature"],["مقاييس الـ overlap بتعاقب الـ paraphrase حتى لو المعنى صح","Overlap metrics penalize a paraphrase even when the meaning is right"],["الـ perplexity لازم تبقى صفر","The perplexity must be zero"]],
      2,"المقياس بيعدّ الكلمات المتطابقة بس (on و the)، فبيتجاهل إن المعنى واحد.","The metric counts matching words only (on and the), so it ignores that the meaning is the same."),
    CQ("موديل بيدّي كل token في النص احتمال 0.25 بالظبط. كام الـ perplexity؟","A model gives every token in the text a probability of exactly 0.25. What is the perplexity?",
   [["2","2"],["4","4"],["0.25","0.25"],["16","16"]],
   1,"كل token = 2 bits، المتوسط 2، و 2^2 = 4: كأن الموديل بيختار بين 4 اختيارات متساوية.","Each token is 2 bits, the average is 2, and 2^2 = 4: as if the model were choosing between 4 equally likely options.")],
 f:[CF("إيه هي الـ perplexity وإيه حدودها؟","What is perplexity and what are its limits?",
      "PPL = exp(متوسط سالب الـ log probability للـ tokens). الأقل أحسن، وبتقيس الموديل على نص حقيقي، مش جودة نص مولّد معيّن، وبتتقارن بس لنفس الـ tokenizer والداتا.","PPL = exp(the average negative log probability of the tokens). Lower is better. It measures the model on real text, not the quality of a particular generated text, and is comparable only for the same tokenizer and data."),
    CF("إيه الفرق بين BLEU و ROUGE؟","What is the difference between BLEU and ROUGE?",
   "BLEU مبني على precision لـ n-grams (شائع في الترجمة)، و ROUGE مبني على recall (شائع في التلخيص). الاتنين بيعدّوا كلمات مش معنى، فالـ paraphrase الصح بياخد سكور واطي.",
   "BLEU is based on n-gram precision (common in translation) and ROUGE on recall (common in summarization). Both count words, not meaning, so a correct paraphrase gets a low score.")],
 terms:[
  {t:B("BLEU","BLEU"),
 d:B("مقياس بيحسب precision للـ n-grams بين النص المولّد والمرجع. شائع في الترجمة.",
     "A metric based on n-gram precision between the generated text and the reference. Common in translation.")},
{t:B("ROUGE","ROUGE"),
 d:B("مقياس بيحسب recall للـ n-grams مقابل المرجع. شائع في التلخيص.",
     "A metric based on n-gram recall against the reference. Common in summarization.")},
{t:B("BERTScore","BERTScore"),
 d:B("مقياس بيقارن النص المولّد بالمرجع بتشابه الـ embeddings بدل تطابق الكلمات، فبيلقط المعنى أكتر.",
     "A metric that compares generated text and reference by embedding similarity instead of exact word matches, so it captures meaning better.")}
]},


{id:"l12-recap",t:B("Recap: توليد النص","Recap: text generation"),
 b:B('<p>5 نقاط تفضل معاك:<br>• التوليد loop: الموديل بيطلّع توزيع على الـ token الجاي، والـ <mark>decoding</mark> هو اللي بيختار.<br>• المهام المقفولة: greedy أو beam صغير مع length normalization. المهام المفتوحة: sampling مع temperature وtop-p.<br>• الـ temperature بتغيّر الحدّة مش الترتيب. top-k بيقص عدد ثابت، وtop-p بيقص حسب المجموع التراكمي.<br>• الـ constrained decoding بيعمل mask للـ tokens اللي هتكسر الشكل، فالـ JSON يطلع صالح، بس الشكل هو المضمون مش المعنى.<br>• الـ KV cache بيوفّر حساب بتمن ذاكرة، والـ speculative decoding بيسرّع بنفس التوزيع، ومفيش مقياس واحد يحكم على التوليد.</p>'+
  '<div class="m">P(y_1 ... y_T) = product over t of P(y_t | y_1 ... y_(t-1))\nP(w) = exp(z_w / T) / sum over v of exp(z_v / T)\nbeam score = (1/length) * sum over i of log P(y_i | y_1 ... y_(i-1))\nKV cache per token = 2 * layers * d_model * bytes\nPPL = exp( -(1/N) * sum over i of log P(y_i | y_1 ... y_(i-1)) )</div>'+
  '<p>قبل المحاضرة اللي بعدها لازم تعرف تحسب: softmax بـ temperature، وtop-p على توزيع صغير، وحجم الـ KV cache. ولازم تفرّق بين اللي الموديل بيحدده (الاحتمالات) واللي الـ decoding بيحدده (الاختيار).</p>',
  '<p>Five points to keep:<br>• Generation is a loop: the model outputs a distribution over the next token, and the <mark>decoding</mark> method picks it.<br>• Closed-ended tasks: greedy or a small beam with length normalization. Open-ended tasks: sampling with temperature and top-p.<br>• Temperature changes sharpness, not ranking. Top-k cuts a fixed count; top-p cuts by cumulative probability.<br>• Constrained decoding masks tokens that break the format, so JSON comes out valid, but the format is what is guaranteed, not the meaning.<br>• The KV cache saves compute at a memory price, speculative decoding speeds things up with the same distribution, and no single metric judges generation.</p>'+
  '<div class="m">P(y_1 ... y_T) = product over t of P(y_t | y_1 ... y_(t-1))\nP(w) = exp(z_w / T) / sum over v of exp(z_v / T)\nbeam score = (1/length) * sum over i of log P(y_i | y_1 ... y_(i-1))\nKV cache per token = 2 * layers * d_model * bytes\nPPL = exp( -(1/N) * sum over i of log P(y_i | y_1 ... y_(i-1)) )</div>'+
  '<p>Before the next lecture you should be able to compute a softmax with temperature, apply top-p to a small distribution, and size a KV cache. And you should separate what the model decides (the probabilities) from what the decoding decides (the choice).</p>'),
 q:[
  CQ("مهمة تلخيص (مقفولة) ومهمة كتابة قصة (مفتوحة). إيه الـ decoding الأنسب لكل واحدة؟","A summarization task (closed-ended) and a story-writing task (open-ended). Which decoding fits each?",
     [["top-p للتلخيص و beam كبير للقصة","Top-p for summarization and a large beam for the story"],["temperature عالية للاتنين","High temperature for both"],["beam صغير للتلخيص و top-p مع temperature متوسطة للقصة","A small beam for summarization and top-p with a moderate temperature for the story"],["greedy للاتنين","Greedy for both"]],
     2,"المقفولة محتاجة الأعلى احتمالًا، والمفتوحة محتاجة تنوع من غير tail تافه.","Closed-ended tasks need the highest probability; open-ended ones need diversity without the junk tail."),
  CQ("الاحتمالات [0.50, 0.30, 0.10, 0.05, 0.05] و top-p = 0.8. كام token بنحتفظ بيهم؟","The probabilities are [0.50, 0.30, 0.10, 0.05, 0.05] and top-p = 0.8. How many tokens do we keep?",
     [["1","1"],["2","2"],["3","3"],["5","5"]],
     1,"المجموع التراكمي 0.50 ثم 0.80، فنقف عند التاني: token اتنين.","The cumulative sum is 0.50 then 0.80, so we stop at the second: two tokens.")
],
 f:[
  CF("إيه الـ decoding المناسب لكل نوع مهمة؟","Which decoding fits each kind of task?",
     "مقفولة (ترجمة، تلخيص): greedy أو beam صغير. مفتوحة (قصة، حوار): sampling مع top-p وtemperature متوسطة. ولو الشكل لازم يبقى مضمون (JSON): constrained decoding.",
     "Closed-ended (translation, summarization): greedy or a small beam. Open-ended (stories, dialogue): sampling with top-p and a moderate temperature. If the format must be guaranteed (JSON): constrained decoding."),
  CF("إيه الـ trade-off في الـ KV cache والـ speculative decoding؟","What is the trade-off in the KV cache and in speculative decoding?",
     "KV cache: حساب أقل بذاكرة أكتر. Speculative decoding: أسرع بنفس توزيع الموديل الكبير، بس محتاج draft model.",
     "KV cache: less compute for more memory. Speculative decoding: faster with the same big-model distribution, but it needs a draft model.")
]}
]}
);

})();
