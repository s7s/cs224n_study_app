/* Lecture 17: Model Analysis & Interpretability
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L17 fig: three levels of analysis */
function l17LevelsFig(){
  var s='',Y=[14,84,154],N=['1. behavior','2. representations','3. mechanisms'],
      D=['inputs and outputs only','hidden states, probing','components, circuits, edits'],
      G=['claim: what','claim: present','claim: how'],
      F=['var(--sf)','var(--sf)','var(--okbg)'],S=['var(--ln)','var(--ln)','var(--ok)'],i;
  s+=AL(22,26,22,196,'ac','mA');
  for(i=0;i<3;i++){
    s+=RECT(44,Y[i],306,48,F[i],S[i],8,1.5);
    s+=T(58,Y[i]+21,N[i],'tb','start','font-size:11.5px');
    s+=T(58,Y[i]+38,D[i],'tm','start','font-size:9.5px');
    s+=T(340,Y[i]+21,G[i],'tb','end','font-size:9.5px;fill:var(--ac)');
  }
  s+=AL(197,63,197,83,'mu','mM')+AL(197,133,197,153,'mu','mM');
  s+=T(180,222,'more access  =  stronger claims','tm','middle','font-size:10px');
  return s;
}

var FIG_L17_LEVELS=fig(232,l17LevelsFig(),
  B('التحليل على 3 مستويات. كل مستوى بيحتاج وصول أعمق للموديل، وبيسمح بادّعاء أقوى: من \"الموديل بيعمل كذا\" لحد \"الجزء ده هو اللي بيحسبه\".',
    'Analysis works at three levels. Each level needs deeper access to the model and allows a stronger claim: from \"the model does X\" to \"this part computes it\".'));

/* L17 fig: probing a frozen model */
function l17ProbeFig(){
  var s='',L=[['layer 12',22,0],['...',50,0],['layer l',78,1],['...',106,0],['layer 1',134,0]],i,c,x;
  s+=T(75,14,'frozen model','tm','middle','font-size:10px');
  for(i=0;i<5;i++){
    c=L[i];
    s+=RECT(20,c[1],110,22,c[2]?'var(--acs)':'var(--sf)',c[2]?'var(--ac)':'var(--ln)',5,c[2]?1.8:1.3);
    s+=T(75,c[1]+15,c[0],c[2]?'tb':'tm','middle','font-size:10.5px');
  }
  s+=AL(75,178,75,158,'mu','mM')+T(75,194,'input tokens','tm','middle','font-size:10px');
  s+=AL(130,89,160,89,'ac','mA');
  s+=T(190,74,'h_l','tb','middle','font-size:10.5px');
  for(i=0;i<4;i++){
    x=162+i*14;
    s+=RECT(x,79,14,20,i%2?'var(--acs)':'var(--ac)','var(--bg)',2,1);
  }
  s+=AL(222,89,240,89,'ac','mA');
  s+=RECT(242,66,108,46,'var(--okbg)','var(--ok)',6,1.6);
  s+=T(296,86,'linear probe','tb','middle','font-size:10.5px');
  s+=T(296,102,'W h + b','tm','middle','font-size:10px');
  s+=AL(296,113,296,136,'ok','mG');
  s+=RECT(256,138,80,24,'var(--sf)','var(--ok)',5,1.4);
  s+=T(296,154,'NOUN','tb','middle','font-size:10.5px;fill:var(--ok)');
  s+=T(296,180,'only W and b','tb','middle','font-size:9.5px;fill:var(--ok)');
  s+=T(296,194,'are trained','tb','middle','font-size:9.5px;fill:var(--ok)');
  return s;
}

var FIG_L17_PROBE=fig(204,l17ProbeFig(),
  B('الـ probe بياخد الـ hidden vector من طبقة معيّنة والموديل متجمّد. اللي بيتدرّب بس هو الـ classifier الصغير اللي فوق.',
    'The probe takes the hidden vector from one layer while the model stays frozen. Only the small classifier on top is trained.'));

/* L17 fig: probe vs control task, toy numbers from the probing card */
function l17SelectFig(){
  var s='',k=2.2,x0=92,R=[['linear',93,41,'ok'],['big MLP',97,90,'no']],i,r,y;
  s+=T(220,14,'accuracy %, toy numbers','tm','middle','font-size:10px');
  for(i=0;i<2;i++){
    r=R[i];y=26+i*68;
    s+=T(10,y+14,r[0],'tb','start','font-size:10.5px');
    s+=T(10,y+34,'selectivity '+(r[1]-r[2]),'tb','start','font-size:9.5px;fill:var(--'+r[3]+')');
    s+=RECT(x0,y,r[1]*k,18,'var(--ac)','none',3,1)+T(x0+r[1]*k+5,y+13,String(r[1]),'tb','start','font-size:10px');
    s+=RECT(x0,y+24,r[2]*k,18,'var(--mu)','none',3,1)+T(x0+r[2]*k+5,y+37,String(r[2]),'tb','start','font-size:10px');
  }
  s+=RECT(92,166,10,10,'var(--ac)','none',2,1)+T(108,175,'task','tm','start','font-size:9.5px');
  s+=RECT(160,166,10,10,'var(--mu)','none',2,1)+T(176,175,'control task','tm','start','font-size:9.5px');
  return s;
}

var FIG_L17_SELECT=fig(184,l17SelectFig(),
  B('الـ probe الخطي بيحافظ على selectivity عالية، والـ MLP الكبير غالبًا بيحفظ.',
    'The linear probe keeps a high selectivity; the big MLP mostly memorizes.'));

/* L17 fig: token attribution bars (gradient x input on a linear toy model) */
function l17AttrFig(){
  var W=[['great',2.1],['acting',0.3],['but',0.0],['boring',-1.8],['plot',-0.1]],s='',i,v,y,w,sum=0;
  var cx=196,k=40;
  s+=T(180,14,'gradient x input, per token','tm','middle','font-size:10px');
  for(i=0;i<5;i++){
    v=W[i][1];y=28+i*26;w=Math.abs(v)*k;sum+=v;
    s+=T(10,y+13,W[i][0],'tb','start','font-size:10.5px');
    if(w>0)s+=RECT(v>=0?cx:cx-w,y,w,18,v>=0?'var(--ok)':'var(--no)','none',3,1);
    if(v>0)s+=T(cx+w+6,y+13,'+'+v.toFixed(1),'tb','start','font-size:10px');
    else if(v<0)s+=T(cx-w-6,y+13,v.toFixed(1),'tb','end','font-size:10px');
    else s+=T(cx+6,y+13,'0.0','tb','start','font-size:10px');
  }
  s+='<line x1="'+cx+'" y1="22" x2="'+cx+'" y2="156" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+='<line x1="10" y1="162" x2="350" y2="162" style="stroke:var(--ln);stroke-width:1"/>';
  s+=T(180,180,'sum = '+(sum>=0?'+':'')+sum.toFixed(1)+'  =  f(x) - f(baseline)','tb','middle','font-size:10.5px');
  return s;
}

var FIG_L17_ATTR=fig(192,l17AttrFig(),
  B('مثال مبسّط على جملة \"great acting but boring plot\". الأخضر بيدفع النتيجة لفوق، والأحمر بيشدّها لتحت، ومجموع الـ attributions بيطلع فرق الـ output عن الـ baseline.',
    'A simplified example on the sentence \"great acting but boring plot\". Green pushes the score up, red pulls it down, and the attributions add up to the output difference from the baseline.'));

/* L17 fig: activation patching */
function l17PatchFig(){
  var s='',X=[8,80,140,200,260],i,ya=34,yb=130;
  s+=T(8,24,'clean run','tm','start','font-size:10px');
  s+=T(8,120,'corrupted run + patch','tm','start','font-size:10px');
  s+=RECT(X[0],ya,52,28,'var(--sf)','var(--ln)',5,1.3)+T(34,ya+18,'x_clean','tm','middle','font-size:9.5px');
  s+=RECT(X[0],yb,52,28,'var(--sf)','var(--ln)',5,1.3)+T(34,yb+18,'x_corr','tm','middle','font-size:9.5px');
  for(i=1;i<4;i++){
    s+=RECT(X[i],ya,40,28,'var(--sf)','var(--ln)',5,1.3)+T(X[i]+20,ya+18,'L'+i,'tb','middle','font-size:10.5px');
    s+=RECT(X[i],yb,40,28,i===2?'var(--okbg)':'var(--sf)',i===2?'var(--ok)':'var(--ln)',5,i===2?1.8:1.3)+T(X[i]+20,yb+18,i===2?'L2*':'L'+i,'tb','middle','font-size:10.5px');
  }
  s+=RECT(X[4],ya,92,28,'var(--sf)','var(--ok)',5,1.4)+T(306,ya+18,'P = 0.80','tb','middle','font-size:10.5px;fill:var(--ok)');
  s+=RECT(X[4],yb,92,28,'var(--sf)','var(--ac)',5,1.4)+T(306,yb+18,'P = 0.52','tb','middle','font-size:10.5px;fill:var(--ac)');
  s+=AL(60,ya+14,78,ya+14,'mu','mM')+AL(120,ya+14,138,ya+14,'mu','mM')+AL(180,ya+14,198,ya+14,'mu','mM')+AL(240,ya+14,258,ya+14,'mu','mM');
  s+=AL(60,yb+14,78,yb+14,'mu','mM')+AL(120,yb+14,138,yb+14,'mu','mM')+AL(180,yb+14,198,yb+14,'mu','mM')+AL(240,yb+14,258,yb+14,'mu','mM');
  s+=AL(160,64,160,128,'ok','mG');
  s+=T(168,100,'copy activation','tb','start','font-size:9.5px;fill:var(--ok)');
  s+=T(352,176,'(corrupted alone: 0.10)','tm','end','font-size:9px');
  s+=T(180,200,'effect = (0.52 - 0.10) / (0.80 - 0.10) = 0.60','tb','middle','font-size:10px');
  return s;
}

var FIG_L17_PATCH=fig(212,l17PatchFig(),
  B('بننسخ activation واحد من الـ clean run للـ corrupted run ونشوف الاحتمال الصح رجع قد إيه. الرقم بيقول إن الجزء ده مسؤول عن 60% من الفرق.',
    'We copy one activation from the clean run into the corrupted run and see how much of the correct probability comes back. The number says this part accounts for 60% of the difference.'));

/* L17 fig: induction circuit (previous-token head + induction head) */
function l17CircuitFig(){
  var s='',X=[14,74,134,194,276],Tk=['A','B','...','A','B'],i,last;
  for(i=0;i<5;i++){
    last=(i===4);
    s+=RECT(X[i],78,last?44:40,26,last?'var(--okbg)':'var(--sf)',last?'var(--ok)':'var(--ln)',5,last?1.8:1.3);
    s+=T(X[i]+(last?22:20),96,Tk[i],'tb','middle','font-size:11px'+(last?';fill:var(--ok)':''));
  }
  s+='<path d="M94 106 Q64 140 38 108" style="fill:none;stroke:var(--mu);stroke-width:1.9" marker-end="url(#mM)"/>';
  s+=T(66,152,'previous-token head','tb','middle','font-size:9.5px');
  s+='<path d="M214 76 Q154 20 98 74" style="fill:none;stroke:var(--ac);stroke-width:1.9" marker-end="url(#mA)"/>';
  s+=T(156,18,'induction head attends to B','tb','middle','font-size:9.5px;fill:var(--ac)');
  s+=AR(236,91,274,91,'ok','mG');
  s+=T(255,76,'copy','tb','middle','font-size:9.5px;fill:var(--ok)');
  s+=T(298,120,'predict B','tb','middle','font-size:9.5px;fill:var(--ok)');
  return s;
}

var FIG_L17_CIRCUIT=fig(162,l17CircuitFig(),
  B('دايرة الـ induction: head بتكتب إن اللي قبل B هو A، وhead تانية بتلاقيها وتنسخ B.',
    'The induction circuit: one head records that A came before B, and a second head finds it and copies B.'));

/* L17 fig: superposition, 5 features in 2 dimensions */
function l17SuperFig(){
  var s='',cx=104,cy=108,r=64,i,a,x2,y2,lx,ly,C=[['ac','mA'],['ok','mG'],['no','mN'],['mu','mM'],['ac','mA']],rad;
  s+='<line x1="'+(cx-r-6)+'" y1="'+cy+'" x2="'+(cx+r+6)+'" y2="'+cy+'" style="stroke:var(--ln);stroke-width:1"/>';
  s+='<line x1="'+cx+'" y1="'+(cy-r-6)+'" x2="'+cx+'" y2="'+(cy+r+6)+'" style="stroke:var(--ln);stroke-width:1"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" style="fill:none;stroke:var(--ln);stroke-width:1.2;stroke-dasharray:4 4"/>';
  for(i=0;i<5;i++){
    a=(90+72*i)*Math.PI/180;
    x2=cx+r*Math.cos(a);y2=cy-r*Math.sin(a);
    lx=cx+(r+14)*Math.cos(a);ly=cy-(r+14)*Math.sin(a);
    s+=AL(cx,cy,x2.toFixed(1),y2.toFixed(1),C[i][0],C[i][1]);
    s+=T(lx.toFixed(1),(ly+4).toFixed(1),'f'+(i+1),'tb','middle','font-size:10.5px');
  }
  s+=T(214,58,'2 dimensions','tb','start','font-size:11px');
  s+=T(214,78,'5 features','tb','start','font-size:11px');
  s+=T(214,104,'angle = 72 deg','tm','start','font-size:10px');
  s+=T(214,122,'cos 72 = 0.31','tm','start','font-size:10px');
  s+=T(214,148,'features are sparse:','tm','start','font-size:10px');
  s+=T(214,164,'rarely co-active','tm','start','font-size:10px');
  s+=T(104,200,'5 directions in a 2-D plane','tm','middle','font-size:10px');
  return s;
}

var FIG_L17_SUPER=fig(210,l17SuperFig(),
  B('الـ superposition: الموديل بيحط features أكتر من عدد الأبعاد في اتجاهات شبه متعامدة. الاتجاهين المتجاورين بينهم تداخل بسيط (cos = 0.31)، وده مقبول لأن الـ features نادرًا بتظهر مع بعض.',
    'Superposition: the model packs more features than dimensions into nearly orthogonal directions. Two neighbors overlap a little (cos = 0.31), which is tolerable because features rarely appear together.'));

/* L17 fig: sparse autoencoder, activation -> large sparse dictionary -> reconstruction */
function l17SaeFig(){
  var s='',i,x,hot;
  s+=RECT(130,12,100,24,'var(--sf)','var(--ln)',5,1.4)+T(180,28,'x  (d = 768)','tb','middle','font-size:10.5px');
  s+=AR(180,38,180,64,'ac','mA')+T(190,56,'W_e , ReLU','tm','start','font-size:9.5px');
  for(i=0;i<16;i++){
    x=36+i*18.5;hot=(i===3||i===11);
    s+=RECT(x,68,16,22,hot?'var(--ac)':'var(--sf)','var(--ln)',3,1.2)+T(x+8,83,hot?'1':'0',hot?'tb':'tm','middle',hot?'fill:var(--bg);font-size:9px':'font-size:9px');
  }
  s+=T(180,106,'f  (m = 12,288, only a few active)','tb','middle','font-size:10px');
  s+=AR(180,114,180,140,'ac','mA')+T(190,132,'W_d','tm','start','font-size:9.5px');
  s+=RECT(130,142,100,24,'var(--okbg)','var(--ok)',5,1.5)+T(180,158,'x_hat ~ x','tb','middle','font-size:10.5px');
  s+=T(180,184,'loss = reconstruction + lambda * L1(f)','tm','middle','font-size:9.5px');
  return s;
}

var FIG_L17_SAE=fig(196,l17SaeFig(),
  B('الـ SAE بيوسّع الـ activation لـ dictionary كبير أغلبه أصفار، وبعدين بيعيد بناءه.',
    'An SAE expands the activation into a large, mostly zero dictionary and then rebuilds it.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:17,t:B("Model Analysis و Interpretability","Model Analysis & Interpretability"),cards:[

{id:"l17-why",t:B("ليه نحلل الموديل ونفتح الـ black box","Why analyze a model and open the black box"),
 b:cat(
   B('<p>الموديلات اللي اتعلّمناها بتجاوب كويس، بس <mark>مش عارفين ليه</mark>. الـ accuracy العالي على test set مش دليل إن الموديل وصل للإجابة بالطريقة الصح. فيه قصة مشهورة اسمها <mark>Clever Hans</mark>: حصان في أوائل القرن العشرين كان باين عليه إنه بيحل مسائل حساب، بيدق بحافره بعدد الإجابة. وطلع إنه بيقرا إشارات جسم الشخص اللي بيسأله، مش بيحسب. ومع الموديلات بنسمّي ده <mark>shortcut</mark> أو <mark>spurious correlation</mark>: الموديل بيجاوب صح لأسباب غلط، وأول ما الظروف تتغيّر بيفشل.</p>' +
         '<p>ليه نحلل؟<br>• <mark>الثقة والأمان</mark>: قبل ما نستخدم موديل في قرار مهم لازم نعرف بيعتمد على إيه.<br>• <mark>الـ debugging</mark>: لو بيغلط، نفهم السبب بدل ما نجرّب بالعشوائي.<br>• <mark>العلم</mark>: موديل اتدرّب على نص بس وباين إنه بيلتقط قواعد اللغة، إزاي؟ ده بيعلّمنا حاجة عن اللغة نفسها.<br>• <mark>العدالة</mark>: نكشف لو قراره بيعتمد على صفات مش المفروض يعتمد عليها (زي الجنس أو الاسم).</p>',
         '<p>The models we trained answer well, but <mark>we do not know why</mark>. A high accuracy on a test set is not proof that the model reached the answer the right way. There is a famous story called <mark>Clever Hans</mark>: in the early 1900s a horse seemed to solve arithmetic problems by tapping its hoof the right number of times. It turned out to be reading the body cues of the person asking, not calculating. With models we call this a <mark>shortcut</mark> or a <mark>spurious correlation</mark>: the model is right for the wrong reasons, and it fails as soon as conditions change.</p>' +
         '<p>Why analyze?<br>• <mark>Trust and safety</mark>: before using a model in an important decision, we need to know what it relies on.<br>• <mark>Debugging</mark>: when it errs, we understand the cause instead of trying things at random.<br>• <mark>Science</mark>: a model trained only on text seems to pick up grammar; how? That teaches us something about language itself.<br>• <mark>Fairness</mark>: we can detect whether its decision relies on attributes it should not (like gender or a name).</p>')),
 q:[
   CQ("موديل وصل لـ 95% على test set. أنهي استنتاج من الدول مش مضمون؟","A model reaches 95% on a test set. Which of these conclusions is not guaranteed?",
      [["إنه بيجاوب صح على أغلب الأمثلة اللي من نفس توزيع الـ test set","It answers most examples from the same distribution as the test set correctly"],["إن نسبة الخطأ على نفس التوزيع حوالي 5%","The error rate on that same distribution is about 5%"],["إنه بيجاوب بنفس الأسباب اللي كان البشر هيستخدموها","It answers for the same reasons a human would use"],["إننا نقدر نقارنه بموديل تاني على نفس الـ test set","We can compare it with another model on the same test set"]],
      2,"الـ accuracy بتقيس النتيجة مش السبب. الموديل ممكن يكون معتمد على shortcut بينجح على الـ test set وبيفشل برّه التوزيع ده.","Accuracy measures the outcome, not the reason. The model may rely on a shortcut that works on the test set and fails outside that distribution."),
   CQ("موديل بيشخّص أشعة صدر وصل لـ 96% في مستشفى A، ولما اتجرّب في مستشفى B نزل لـ 70%. لاحظنا إن الحالات الخطيرة في A غالبًا عليها علامة ماكينة معيّنة. أنهي تفسير هو الأقرب؟",
     "A chest X-ray model reaches 96% at hospital A and drops to 70% at hospital B. We notice the serious cases at A often carry a particular machine tag. Which explanation is most likely?",
     [["الـ accuracy على A اتحسبت غلط","The accuracy at A was miscalculated"],
      ["الموديل عمل underfitting على A","The model underfit hospital A"],
      ["الموديل اتعلّم shortcut من علامة الماكينة مش من الأعراض","The model learned a shortcut from the machine tag, not from the symptoms"],
      ["مرضى B أكيد أقل خطورة","The patients at B are surely less serious"]],
     2,"دي spurious correlation: العلامة بتتنبأ بالـ label في A بس مالهاش علاقة بالمرض في B، فالأداء بيقع لما الظروف تتغيّر.",
     "This is a spurious correlation: the tag predicts the label at A but has nothing to do with the disease at B, so performance collapses when conditions change.")
 ],
 f:[
   CF("إيه المستويات التلاتة لتحليل الموديل، وإيه اللي بيميّز كل مستوى؟","What are the three levels of model analysis, and what distinguishes each?",
      "Behavior: مدخلات ومخرجات بس، وبيقول الموديل بيعمل إيه. Representations: الـ hidden states، وبيقول إن المعلومة موجودة. Mechanisms: تدخّل في الأجزاء الداخلية، وبيقول مين بيحسبها. كل ما الوصول أعمق الادّعاء أقوى، بس الارتباط مش سببية.","Behavior: inputs and outputs only, says what the model does. Representations: the hidden states, says the information is present. Mechanisms: intervening on internal parts, says what computes it. The deeper the access the stronger the claim, but correlation is not causation."),
   CF("إيه هو الـ Clever Hans والـ shortcut؟","What are Clever Hans and a shortcut?",
     "حصان بدا إنه بيحل حساب وهو بيقرا إشارات جسم السائل. والـ shortcut إن الموديل يجاوب صح بنمط سطحي (spurious correlation) فيفشل لما الظروف تتغيّر.",
     "A horse seemed to do arithmetic while reading its questioner's body cues. A shortcut is when a model answers correctly through a surface pattern (a spurious correlation) and fails when conditions change."),
  CF("إيه أسباب تحليل الموديل؟","Why do we analyze a model?",
     "الثقة والأمان، والـ debugging، والعلم (نفهم إزاي اتعلّم اللغة)، والعدالة (نكشف اعتماده على صفات مش المفروض يعتمد عليها).",
     "Trust and safety, debugging, science (understanding how it picked up language), and fairness (detecting reliance on attributes it should not use).")
 ],
 terms:[
  {t:B("Spurious correlation","Spurious correlation"),
   d:B("علاقة في البيانات بتتنبأ بالإجابة من غير ما تكون سببها الحقيقي، فالموديل اللي يعتمد عليها بيفشل لما الظروف تتغيّر.",
       "A pattern in the data that predicts the label without being its real cause, so a model relying on it fails when conditions change.")},
  {t:B("Shortcut","Shortcut"),
   d:B("إن الموديل يوصل لإجابة صح بإشارة سطحية بدل المعنى المقصود (زي حصان Clever Hans).",
       "Reaching the right answer through a surface cue instead of the intended reasoning (like the Clever Hans horse).")},
  {t:B("Interpretability","Interpretability"),
   d:B("فهم إزاي وليه الموديل بيجاوب، مش بس قد إيه بيجاوب صح.",
       "Understanding how and why a model answers, not only how often it is right.")}
 ]},

{id:"l17-levels",t:B("المستويات التلاتة لتحليل الموديل","The three levels of model analysis"),
 b:cat(
   FIG_L17_LEVELS,
       B('<p>عشان نرتّب الأسئلة دي بنفكّر في <mark>3 مستويات</mark>، وفي كل واحد بننزل لجوّه الموديل خطوة:</p>' +
         '<div class="m">behavior       inputs, outputs\n  claim: "the model does X"\nrepresentation hidden states\n  claim: "info about X is present"\nmechanism      weights, edits\n  claim: "this part computes X"</div>' +
         '<p>• <mark>Behavior</mark> (كارت 3 و 4): بنعامل الموديل كـ black box ونصمّم مدخلات تختبر فرضية معيّنة.<br>• <mark>Representations</mark> (كارت 5 و 6): بنبص على الـ hidden vectors ونسأل أنهي معلومات موجودة فيها (probing).<br>• <mark>Attribution</mark> (كارت 7 لـ 9): أنهي tokens أثّرت في الإجابة.<br>• <mark>Mechanisms</mark> (كارت 10 لـ 14): بنتدخّل في الأجزاء الداخلية فعليًا ونحاول نفهم الـ circuits والـ features.</p>' +
         '<p>وفيه قاعدة هتتكرر: <mark>الارتباط (correlation) مش سببية (causation)</mark>. إننا نلاقي معلومة موجودة جوه الموديل مش معناه إنه بيستخدمها. وإننا نشوف token مهم مش معناه إنه سبب القرار. كل ما الوصول للموديل يعمق نقدر نعمل ادّعاء أقوى، وكل مستوى ليه حدوده.</p>',
         '<p>To organize these questions we think in <mark>3 levels</mark>, and at each one we go one step deeper inside the model:</p>' +
         '<div class="m">behavior       inputs, outputs\n  claim: "the model does X"\nrepresentation hidden states\n  claim: "info about X is present"\nmechanism      weights, edits\n  claim: "this part computes X"</div>' +
         '<p>• <mark>Behavior</mark> (cards 3 and 4): we treat the model as a black box and design inputs that test a specific hypothesis.<br>• <mark>Representations</mark> (cards 5 and 6): we look at the hidden vectors and ask which information is in them (probing).<br>• <mark>Attribution</mark> (cards 7 to 9): which tokens influenced the answer.<br>• <mark>Mechanisms</mark> (cards 10 to 14): we actually intervene on internal parts and try to understand circuits and features.</p>' +
         '<p>One rule will keep coming back: <mark>correlation is not causation</mark>. Finding a piece of information inside the model does not mean the model uses it. Seeing that a token is important does not mean it caused the decision. The deeper our access, the stronger the claim we can make, and every level has its limits.</p>')),
 q:[
   CQ("أنهي ادّعاء بيحتاج أعمق وصول للموديل؟","Which claim needs the deepest access to the model?",
     [["الموديل بيعمل X (behavior)","The model does X (behavior)"],
      ["المعلومة X موجودة في الـ hidden states (representation)","Information X is present in the hidden states (representation)"],
      ["الجزء ده هو اللي بيحسب X (mechanism)","This part computes X (mechanism)"],
      ["الموديل بيجيب accuracy عالية","The model gets a high accuracy"]],
     2,"ادّعاء الـ mechanism هو الأقوى وبيحتاج تدخّل في الأجزاء الداخلية. كل ما الوصول أعمق الادّعاء أقوى.",
     "A mechanism claim is the strongest and needs intervention on internal parts. The deeper the access, the stronger the claim."),
  CQ("باحث دَرّب probe على الطبقة 6 ولقى إنه بيتنبأ بالـ POS بدقة 95%. أنهي ادّعاء يقدر يقوله بأمان؟",
     "A researcher trains a probe on layer 6 and gets 95% accuracy predicting POS. Which claim is safe to make?",
     [["معلومة الـ POS موجودة ومقروءة من الطبقة 6","POS information is present and readable at layer 6"],
      ["الموديل بيستخدم الـ POS من الطبقة 6 في قراره","The model uses the POS from layer 6 in its decision"],
      ["الطبقة 6 هي اللي بتحسب الـ POS","Layer 6 is what computes POS"],
      ["الموديل مش بيعتمد على shortcuts","The model does not rely on shortcuts"]],
     0,"الـ probing بيثبت وجود المعلومة بس (ارتباط). الاستخدام والسببية محتاجين تدخّل سببي.",
     "Probing only shows the information is present (correlation). Use and causation need a causal intervention.")
 ],
 f:[
   CF("إيه القاعدة اللي بتتكرر في كل مستويات التحليل؟","What rule keeps coming back at every level of analysis?",
     "الارتباط مش سببية: إننا نلاقي معلومة جوه الموديل أو token مهم مش معناه إن الموديل بيستخدمها أو إنها سبب القرار.",
     "Correlation is not causation: finding information inside the model, or an important token, does not mean the model uses it or that it caused the decision."),
  CF("كل مستوى من التلاتة بيجاوب على سؤال إيه؟","Which question does each of the three levels answer?",
     "Behavior: الموديل بيعمل إيه؟ Representations: المعلومة موجودة في الـ hidden states؟ Mechanisms: أنهي جزء بيحسبها؟ والـ attribution بيقول أنهي tokens أثّرت.",
     "Behavior: what does the model do? Representations: is the information present in the hidden states? Mechanisms: which part computes it? Attribution says which tokens mattered.")
 ],
 terms:[
  {t:B("Behavioral analysis","Behavioral analysis"),
   d:B("اختبار الموديل من مدخلاته ومخرجاته بس، بأمثلة متصمّمة تختبر فرضية معيّنة.",
       "Testing a model through its inputs and outputs only, with examples designed to test a specific hypothesis.")},
  {t:B("Correlation vs causation","Correlation vs causation"),
   d:B("إننا نلاقي معلومة جوه الموديل أو token مهم مش معناه إن الموديل بيستخدمها أو إنها سبب القرار.",
       "Finding information inside the model, or an important token, does not mean the model uses it or that it caused the decision.")}
 ]},

{id:"l17-behavior",t:B("تحليل السلوك: الـ shortcuts والـ challenge sets","Behavioral analysis: shortcuts and challenge sets"),
 b:cat(
   B('<p>أبسط مستوى: نتعامل مع الموديل كـ <mark>black box</mark> ونسأله أسئلة مصمّمة بعناية. الـ test set العادي بيقيس الأداء <mark>المتوسط</mark> على نفس توزيع الـ training، فمش بيكشف الـ shortcuts. عشان كده بنبني <mark>challenge sets</mark>: أمثلة متصمّمة بحيث الـ shortcut المتوقع يدّي إجابة غلط.</p>' +
         '<p>مثال من الـ NLI (هل الجملة التانية مترتّبة على الأولى؟):<br>• باحثين لقوا إن classifier بيشوف الـ <mark>hypothesis لوحدها</mark> من غير الـ premise بيتنبأ بالـ label صح في حوالي 67% من أمثلة SNLI، والصدفة 33%. السبب <mark>annotation artifacts</mark>: كلمات النفي زي not و never بتظهر مع contradiction أكتر من اللازم، لأن اللي كتبوا الأمثلة اتعوّدوا على نمط معيّن.<br>• في <mark>HANS</mark> (McCoy وزمايله، 2019): الموديلات بتعتمد على heuristics سطحية، أشهرها <mark>lexical overlap</mark>: لو كل كلمات الـ hypothesis موجودة في الـ premise، قول entailment.</p>' +
         '<div class="m">premise:    The doctor was paid by\n            the actor\nhypothesis: The doctor paid the actor\n\noverlap 100% -> heuristic: entailment\ntruth: NOT entailed (roles flipped)</div>' +
         '<p>الكلمات هي هي بالظبط، بس المعنى اتقلب: مين دفع لمين. موديل بيعتمد على الـ overlap هيغلط هنا، وموديل فاهم المعنى لأ.</p>',
         '<p>The simplest level: we treat the model as a <mark>black box</mark> and ask it carefully designed questions. An ordinary test set measures <mark>average</mark> performance on the same distribution as the training data, so it does not expose shortcuts. That is why we build <mark>challenge sets</mark>: examples designed so that the expected shortcut gives a wrong answer.</p>' +
         '<p>Examples from NLI (does the second sentence follow from the first?):<br>• Researchers found that a classifier that sees only the <mark>hypothesis</mark>, without the premise, predicts the label correctly on about 67% of SNLI examples, where chance is 33%. The cause is <mark>annotation artifacts</mark>: negation words like not and never appear with contradiction more than they should, because the people who wrote the examples fell into a pattern.<br>• In <mark>HANS</mark> (McCoy et al., 2019): models rely on shallow heuristics, the best known being <mark>lexical overlap</mark>: if every word of the hypothesis appears in the premise, say entailment.</p>' +
         '<div class="m">premise:    The doctor was paid by\n            the actor\nhypothesis: The doctor paid the actor\n\noverlap 100% -> heuristic: entailment\ntruth: NOT entailed (roles flipped)</div>' +
         '<p>The words are exactly the same, but the meaning flipped: who paid whom. A model that relies on overlap gets this wrong, and a model that understands the meaning does not.</p>')),
 q:[
   CQ("premise: The cat chased the dog. و hypothesis: The dog chased the cat. الـ lexical overlap heuristic هتتنبأ بإيه؟","premise: The cat chased the dog. and hypothesis: The dog chased the cat. What does the lexical overlap heuristic predict?",
      [["entailment","entailment"],["contradiction","contradiction"],["neutral","neutral"],["مفيش توقع","No prediction"]],
      0,"كل كلمات الـ hypothesis موجودة في الـ premise، فالـ heuristic بتقول entailment. بس الحقيقة إن الجملة التانية مش مترتّبة، لأن الفاعل والمفعول اتبدّلوا.","Every word of the hypothesis appears in the premise, so the heuristic says entailment. But the truth is that the second sentence does not follow, because subject and object are swapped."),
   CQ("classifier شايف الـ hypothesis بس من غير الـ premise وبيجيب حوالي 67% على SNLI (الصدفة 33%). ده معناه إيه؟",
     "A classifier that sees only the hypothesis, without the premise, gets about 67% on SNLI (chance is 33%). What does this mean?",
     [["الـ premise مش مهمة في أي NLI","The premise never matters in NLI"],
      ["فيه annotation artifacts في الـ hypotheses بتسرّب الـ label","Annotation artifacts in the hypotheses leak the label"],
      ["الموديل فاهم المعنى كويس","The model understands meaning well"],
      ["الـ SNLI سهل جدًا على البشر","SNLI is too easy for humans"]],
     1,"لو الـ hypothesis لوحدها كفاية تتنبأ بالـ label، يبقى أنماط زي كلمات النفي هي اللي بتدّي الإجابة مش العلاقة بين الجملتين.",
     "If the hypothesis alone predicts the label, patterns such as negation words give the answer, not the relation between the two sentences.")
 ],
 f:[
   CF("إيه هو الـ shortcut في NLI، وإزاي بنكشفه؟","What is a shortcut in NLI, and how do we expose it?",
      "إن الموديل يعتمد على نمط سطحي مش على المعنى، زي lexical overlap أو كلمات النفي. بنكشفه بـ challenge sets زي HANS (overlap كامل بس مفيش entailment)، أو بـ hypothesis-only classifier بيجيب نتيجة أعلى من الصدفة.","The model relies on a surface pattern instead of meaning, such as lexical overlap or negation words. We expose it with challenge sets like HANS (full overlap but no entailment), or with a hypothesis-only classifier that scores above chance."),
   CF("إيه هي الـ annotation artifacts؟","What are annotation artifacts?",
     "أنماط في أمثلة الـ dataset بسبب طريقة كتابتها (زي كلمات النفي مع contradiction) بتدّي الـ label من غير ما الموديل يفهم العلاقة.",
     "Patterns in dataset examples caused by how they were written (like negation words with contradiction) that reveal the label without understanding the relation.")
 ],
 terms:[
  {t:B("Challenge set","Challenge set"),
   d:B("أمثلة متصمّمة بحيث الـ shortcut المتوقع يدّي إجابة غلط، عشان نكشف لو الموديل بيعتمد عليه.",
       "Examples built so that the expected shortcut gives a wrong answer, to expose whether the model relies on it.")},
  {t:B("Annotation artifacts","Annotation artifacts"),
   d:B("أنماط سطحية في طريقة كتابة أمثلة الـ dataset بتسرّب الـ label (زي not مع contradiction).",
       "Surface patterns in how dataset examples were written that leak the label (like not with contradiction).")},
  {t:B("HANS","HANS"),
   d:B("challenge set لـ NLI (McCoy وزمايله، 2019) بيكشف الاعتماد على heuristics سطحية زي lexical overlap.",
       "An NLI challenge set (McCoy et al., 2019) that exposes reliance on shallow heuristics such as lexical overlap.")},
  {t:B("Lexical overlap heuristic","Lexical overlap heuristic"),
   d:B("قاعدة سطحية: لو كل كلمات الـ hypothesis موجودة في الـ premise قول entailment.",
       "A shallow rule: if every word of the hypothesis appears in the premise, say entailment.")}
 ]},

{id:"l17-behavior-tools",t:B("الـ spurious correlation وأدوات التحليل السلوكي","Spurious correlation and behavioral analysis tools"),
 b:cat(
   B('<p>مثال بأرقام (toy) على الـ spurious correlation:</p>' +
         '<div class="m">100 training examples\n33 are contradiction\n40 contain "not", 30 of them\nare contradiction\n\nP(contra)         = 33/100 = 0.33\nP(contra | "not") = 30/40  = 0.75\n\nrule "not -> contra" is 75% right\non those 40, without the premise</div>' +
         '<p>أدوات للتحليل السلوكي:<br>• <mark>Contrast sets / counterfactuals</mark>: بتعدّل مثال بتغيير صغير يقلب الإجابة الصح (من \"good\" لـ \"not good\")، وتشوف الموديل اتغيّر معاك ولا لأ.<br>• <mark>CheckList</mark> (Ribeiro وزمايله، 2020): اختبارات بتتصنّف لـ <mark>MFT</mark> (اختبار قدرة بسيطة بإجابة معروفة)، و<mark>INV</mark> (تغيير المفروض ميغيّرش الإجابة، زي تبديل اسم شخص)، و<mark>DIR</mark> (تغيير المفروض يحرّك الإجابة في اتجاه معروف).<br>• اختبار <mark>out-of-domain</mark>: نفس المهمة على نوع نص مختلف.</p>' +
         '<p>حدود المستوى ده: بيقولك الموديل <mark>بيفشل فين</mark> بس مش <mark>ليه</mark>. وكمان لو عدّى اختبار ممكن يكون عدّاه بـ shortcut تاني لسه ماجرّبناهوش.</p>',
         '<p>A toy numeric example of a spurious correlation:</p>' +
         '<div class="m">100 training examples\n33 are contradiction\n40 contain "not", 30 of them\nare contradiction\n\nP(contra)         = 33/100 = 0.33\nP(contra | "not") = 30/40  = 0.75\n\nrule "not -> contra" is 75% right\non those 40, without the premise</div>' +
         '<p>Tools for behavioral analysis:<br>• <mark>Contrast sets / counterfactuals</mark>: edit an example with a small change that flips the correct answer (from \"good\" to \"not good\") and see whether the model changes with you.<br>• <mark>CheckList</mark> (Ribeiro et al., 2020): tests are sorted into <mark>MFT</mark> (a simple capability test with a known answer), <mark>INV</mark> (a change that should not alter the answer, like swapping a person name), and <mark>DIR</mark> (a change that should move the answer in a known direction).<br>• <mark>Out-of-domain</mark> testing: the same task on a different kind of text.</p>' +
         '<p>The limit of this level: it tells you <mark>where</mark> the model fails but not <mark>why</mark>. And if it passes a test, it may have passed it with another shortcut we have not tried yet.</p>')),
 q:[
   CQ("في 80 مثال training، 50 منهم فيهم كلمة never، و40 من الـ 50 دول contradiction. كام P(contra | never)؟",
     "In 80 training examples, 50 contain the word never, and 40 of those 50 are contradiction. What is P(contra | never)?",
     [["0.80","0.80"],["0.50","0.50"],["0.625","0.625"],["0.40","0.40"]],
     0,"P(contra | never) = 40/50 = 0.80. بنقسم على الأمثلة اللي فيها never بس مش على الـ 80 كلها.",
     "P(contra | never) = 40/50 = 0.80. We divide by the examples that contain never, not by all 80."),
  CQ("بدّلنا اسم شخص في جملة sentiment من Anna لـ Omar والإجابة المفروض ما تتغيّرش. ده أنهي نوع في CheckList؟",
     "We swap a person name in a sentiment sentence from Anna to Omar and the answer should not change. Which CheckList test type is this?",
     [["MFT","MFT"],["INV","INV"],["DIR","DIR"],["Out-of-domain","Out-of-domain"]],
     1,"INV (invariance): تغيير المفروض ميغيّرش الإجابة. الـ MFT اختبار قدرة بسيطة، والـ DIR تغيير بيحرّك الإجابة في اتجاه معروف.",
     "INV (invariance): a change that should not alter the answer. MFT is a simple capability test, and DIR is a change that should move the answer in a known direction.")
 ],
 f:[
   CF("إيه الأنواع التلاتة في CheckList؟","What are the three test types in CheckList?",
     "MFT: اختبار قدرة بسيطة بإجابة معروفة. INV: تغيير المفروض ميغيّرش الإجابة. DIR: تغيير المفروض يحرّك الإجابة في اتجاه معروف.",
     "MFT: a simple capability test with a known answer. INV: a change that should not alter the answer. DIR: a change that should move the answer in a known direction."),
  CF("إيه حدود التحليل السلوكي؟","What are the limits of behavioral analysis?",
     "بيقولك الموديل بيفشل فين مش ليه، ولو عدّى اختبار ممكن يكون عدّاه بـ shortcut تاني لسه ماجرّبناهوش.",
     "It tells you where the model fails but not why, and a model that passes a test may have passed with another shortcut we have not tried yet.")
 ],
 terms:[
  {t:B("Contrast set","Contrast set"),
   d:B("أمثلة معدّلة بتغيير صغير بيقلب الإجابة الصح، عشان نشوف الموديل اتغيّر معاك ولا لأ.",
       "Examples edited with a small change that flips the correct answer, to see whether the model changes with you.")},
  {t:B("CheckList","CheckList"),
   d:B("إطار اختبارات سلوكية (Ribeiro وزمايله، 2020) بيصنّفها لـ MFT وINV وDIR.",
       "A behavioral testing framework (Ribeiro et al., 2020) that sorts tests into MFT, INV and DIR.")}
 ]},

{id:"l17-probing",t:B("Probing: إيه المعلومات اللي جوه الـ hidden states","Probing: what information sits inside the hidden states"),
 b:cat(
   B('<p>الـ <mark>probing</mark> بيسأل: لو خدنا الـ hidden vector <code>h_l</code> من طبقة <code>l</code>، هل ينفع نتنبأ منه بخاصية لغوية <code>y</code>، زي نوع الكلمة (POS) أو دورها في الجملة؟ الخطوات:<br>1. <mark>نجمّد</mark> الموديل (من غير ما نغيّر أي وزن فيه).<br>2. نمرّر جمل عليها labels ونسحب الـ <code>h_l</code> لكل token.<br>3. ندرّب <mark>classifier صغير</mark> (الـ probe) يتنبأ بالـ label من <code>h_l</code>.<br>4. لو الـ accuracy عالية، يبقى المعلومة <mark>موجودة ومقروءة</mark> من الطبقة دي.</p>' +
         '<div class="m">y_hat = softmax( W h_l + b )\n\ntrained: W, b only\nfrozen:  every Transformer weight</div>',
         '<p><mark>Probing</mark> asks: if we take the hidden vector <code>h_l</code> from layer <code>l</code>, can we predict a linguistic property <code>y</code> from it, such as the word type (POS) or its role in the sentence? The steps:<br>1. <mark>Freeze</mark> the model (change no weight in it).<br>2. Pass sentences that have labels and pull out <code>h_l</code> for each token.<br>3. Train a <mark>small classifier</mark> (the probe) to predict the label from <code>h_l</code>.<br>4. If accuracy is high, the information is <mark>present and readable</mark> at that layer.</p>' +
         '<div class="m">y_hat = softmax( W h_l + b )\n\ntrained: W, b only\nfrozen:  every Transformer weight</div>'),
       FIG_L17_PROBE,
       B('<p>اللي طلع من الأبحاث: Tenney وزمايله (2019) في <mark>BERT rediscovers the classical NLP pipeline</mark> لقوا إن معلومات زي POS بتبان في الطبقات الأولى، والـ parsing بعدها، وبعدين NER والـ semantic roles، وأخيرًا الـ coreference في الطبقات الأعمق. يعني تقريبًا نفس ترتيب الـ pipeline التقليدي (ده الاتجاه العام مش قاعدة صارمة). وHewitt وManning (2019) عملوا <mark>structural probe</mark>: مصفوفة <code>B</code> بتحوّل الـ vectors بحيث المسافة بين كلمتين تقارب المسافة بينهم في شجرة الـ parse:</p>' +
         '<div class="m">|| B(h_i - h_j) ||^2 ~ d_tree(i,j)</div>',
         '<p>What the research found: Tenney et al. (2019) in <mark>BERT rediscovers the classical NLP pipeline</mark> found that information like POS shows up in the early layers, then parsing, then NER and semantic roles, and finally coreference in the deeper layers. That is roughly the order of the traditional pipeline (a general trend, not a strict rule). And Hewitt and Manning (2019) built a <mark>structural probe</mark>: a matrix <code>B</code> that transforms the vectors so that the distance between two words approximates their distance in the parse tree:</p>' +
         '<div class="m">|| B(h_i - h_j) ||^2 ~ d_tree(i,j)</div>')),
 q:[
   CQ("probe خطي على hidden vector بُعده 768 بيصنّف لـ 5 classes. كام parameter بيتدرّب؟","A linear probe on a hidden vector of size 768 classifies into 5 classes. How many parameters are trained?",
      [["3,840","3,840"],["3,845","3,845"],["768","768"],["7,690","7,690"]],
      1,"المصفوفة W حجمها 5 × 768 = 3,840، والـ bias فيه 5 قيم، فالمجموع 3,845. الموديل نفسه متجمّد وميتحسبش.","The matrix W is 5 × 768 = 3,840 and the bias has 5 values, so the total is 3,845. The model itself is frozen and not counted."),
   CQ("ليه بنجمّد الموديل وإحنا بندرّب الـ probe؟","Why do we freeze the model while training the probe?",
     [["عشان نوفّر وقت الـ inference","To save inference time"],
      ["عشان نزوّد عدد الـ parameters","To increase the number of parameters"],
      ["عشان الـ accuracy تعكس معلومة موجودة فعلًا في الـ hidden states مش حاجة اتعلّمها الموديل أثناء الـ probing","So the accuracy reflects information already in the hidden states, not something learned during probing"],
      ["عشان الـ probe يحتاج gradients أكتر","Because the probe needs more gradients"]],
     2,"لو الموديل اتدرّب مع الـ probe مش هنعرف المعلومة كانت موجودة ولا اتعلّمت. التجميد بيخلّي الـ probe بيقرا اللي موجود بس.",
     "If the model were trained along with the probe, we could not tell whether the information was already there or was learned. Freezing makes the probe a reader of what is already present.")
 ],
 f:[
   CF("إيه هو الـ probing، وليه بنقارن بـ control task؟","What is probing, and why do we compare with a control task?",
      "بنجمّد الموديل وندرّب classifier بسيط على الـ hidden states عشان يتنبأ بخاصية لغوية، ولو نجح فالمعلومة موجودة. الـ control task (labels عشوائية لكل word type) بيكشف لو الـ probe بيحفظ: selectivity = task accuracy ناقص control accuracy. ونجاح الـ probe مش دليل إن الموديل بيستخدم المعلومة.","We freeze the model and train a simple classifier on the hidden states to predict a linguistic property; if it succeeds, the information is present. The control task (random labels per word type) reveals whether the probe is memorizing: selectivity = task accuracy minus control accuracy. A successful probe is not proof that the model uses the information."),
   CF("إيه اللي لقاه Tenney، وHewitt وManning؟","What did Tenney, and Hewitt and Manning find?",
     "Tenney: معلومات زي POS في الطبقات الأولى وبعدها الـ parsing وNER وأخيرًا الـ coreference (اتجاه عام مش قاعدة). Hewitt وManning: structural probe بيخلّي المسافة بين الكلمات تقارب مسافتها في شجرة الـ parse.",
     "Tenney: information like POS appears in early layers, then parsing, NER and finally coreference (a trend, not a rule). Hewitt and Manning: a structural probe whose distances between words approximate their distances in the parse tree.")
 ],
 terms:[
  {t:B("Probing","Probing"),
   d:B("تجميد الموديل وتدريب classifier بسيط على الـ hidden states عشان نشوف لو خاصية لغوية مقروءة منها.",
       "Freezing the model and training a simple classifier on its hidden states to see whether a linguistic property can be read from them.")},
  {t:B("Structural probe","Structural probe"),
   d:B("probe بيتعلّم مصفوفة B بحيث المسافة بين vectors الكلمات تقارب مسافتها في شجرة الـ parse.",
       "A probe that learns a matrix B so that distances between word vectors approximate their distances in the parse tree.")}
 ]},

{id:"l17-probe-control",t:B("الـ control task والـ selectivity","Control tasks and selectivity"),
 b:cat(
   B('<p>نتيجة الـ structural probe في الكارت اللي فات: شجرة الـ dependency (محاضرة 4) تقريبًا مخزّنة جوه الـ hidden states كـ geometry.</p>' +
         '<p>المشكلة: \"الـ probe شاطر\" مش بالضرورة يعني \"الموديل عارف\". Hewitt وLiang (2019) بيّنوا إن probe قوي (زي MLP كبير) ممكن يتعلّم المهمة بنفسه من الـ vectors حتى لو الموديل مبيستخدمهاش. الحل: <mark>control task</mark>: نفس الـ inputs بس بنديّ كل نوع كلمة label عشوائي ثابت، فالحل الوحيد هو الحفظ. وبنحسب:</p>' +
         '<div class="m">selectivity = task accuracy\n              - control accuracy</div>' +
         '<div class="m">linear probe, 768 -> 17 tags:\n 768*17 + 17 = 13,073 params\n\nMLP probe, 768 -> 1024 -> 17:\n 768*1024 + 1024\n + 1024*17 + 17 = 804,881 params\n\ntoy numbers   task  control  gap\nlinear        93%    41%     52 pts\nbig MLP       97%    90%      7 pts</div>',
         '<p>The result of the structural probe on the previous card: the dependency tree (lecture 4) is roughly stored inside the hidden states as geometry.</p>' +
         '<p>The problem: \"the probe does well\" does not necessarily mean \"the model knows\". Hewitt and Liang (2019) showed that a strong probe (like a big MLP) can learn the task by itself from the vectors even if the model never uses it. The fix is a <mark>control task</mark>: the same inputs, but each word type gets a fixed random label, so the only solution is memorizing. We then compute:</p>' +
         '<div class="m">selectivity = task accuracy\n              - control accuracy</div>' +
         '<div class="m">linear probe, 768 -> 17 tags:\n 768*17 + 17 = 13,073 params\n\nMLP probe, 768 -> 1024 -> 17:\n 768*1024 + 1024\n + 1024*17 + 17 = 804,881 params\n\ntoy numbers   task  control  gap\nlinear        93%    41%     52 pts\nbig MLP       97%    90%      7 pts</div>'),
       FIG_L17_SELECT,
       B('<p>الـ MLP الكبير بيجيب accuracy أعلى، بس معظمها حفظ (الـ control قريب من الـ task). عشان كده بنفضّل probes بسيطة وبنقارن بالـ control. وأهم نقطة: <mark>نجاح الـ probe معناه المعلومة موجودة، مش إن الموديل بيستخدمها</mark>. عشان نعرف بيستخدمها ولا لأ محتاجين تدخّل سببي (كارت 10).</p>',
         '<p>The big MLP gets higher accuracy, but most of it is memorization (the control is close to the task). That is why we prefer simple probes and compare against the control. The key point: <mark>a successful probe means the information is present, not that the model uses it</mark>. To know whether it uses it, we need a causal intervention (card 10).</p>')),
 q:[
   CQ("probe بيجيب 88% على المهمة الحقيقية و30% على الـ control task. كام الـ selectivity؟",
     "A probe gets 88% on the real task and 30% on the control task. What is the selectivity?",
     [["30 نقطة","30 points"],["118 نقطة","118 points"],["2.9 نقطة","2.9 points"],["58 نقطة","58 points"]],
     3,"selectivity = 88 - 30 = 58 نقطة. كل ما الفرق أكبر الـ probe بيحفظ أقل.",
     "selectivity = 88 - 30 = 58 points. The larger the gap, the less the probe is memorizing."),
  CQ("ليه الـ control task بتدّي كل word type label عشوائي ثابت؟","Why does the control task give each word type a fixed random label?",
     [["عشان الحل الوحيد يبقى الحفظ، فنقيس قدرة الـ probe على الحفظ","So the only solution is memorizing, which measures the probe's ability to memorize"],
      ["عشان نزوّد بيانات التدريب","To increase the training data"],
      ["عشان نعرف الموديل بيستخدم المعلومة ولا لأ","To learn whether the model uses the information"],
      ["عشان نخلّي المهمة أسهل","To make the task easier"]],
     0,"الـ labels العشوائية مالهاش علاقة باللغة، فأي accuracy عليها معناها إن الـ probe بيحفظ. ومش بتقيس إن الموديل بيستخدم المعلومة.",
     "Random labels have nothing to do with language, so any accuracy on them means the probe can memorize. They do not measure whether the model uses the information.")
 ],
 f:[
   CF("إيه هي الـ selectivity؟","What is selectivity?",
     "task accuracy ناقص control accuracy. بتقيس قد إيه الـ probe بيقرا المعلومة فعلًا بدل ما يحفظ.",
     "Task accuracy minus control accuracy. It measures how much the probe really reads the information instead of memorizing."),
  CF("ليه بنفضّل probes بسيطة؟","Why do we prefer simple probes?",
     "الـ probe القوي (زي MLP كبير) ممكن يتعلّم المهمة بنفسه حتى لو الموديل مبيستخدمهاش، فنتيجته دليل ضعيف. والـ probe الخطي (13,073 parameter) أصعب عليه الحفظ.",
     "A strong probe (like a big MLP) can learn the task by itself even if the model never uses it, so its score is weak evidence. A linear probe (13,073 parameters) has a harder time memorizing.")
 ],
 terms:[
  {t:B("Control task","Control task"),
   d:B("نفس الـ inputs بس كل word type ياخد label عشوائي ثابت، فالحل الوحيد هو الحفظ (Hewitt وLiang، 2019).",
       "The same inputs, but each word type gets a fixed random label, so the only solution is memorizing (Hewitt and Liang, 2019).")},
  {t:B("Selectivity","Selectivity"),
   d:B("task accuracy ناقص control accuracy. كل ما كانت أعلى، الـ probe بيقرا المعلومة أكتر بدل ما يحفظ.",
       "Task accuracy minus control accuracy. The higher it is, the more the probe reads the information instead of memorizing.")}
 ]},

{id:"l17-attribution",t:B("الـ attention weights: ليه مش تفسير كافي","Attention weights: why they are not a sufficient explanation"),
 b:cat(
   B('<p>أول فكرة بتيجي في بال أي حد: نرسم الـ <mark>attention weights</mark> ونقول \"الموديل بيبص على الكلمة دي\". الرسم ده مفيد للاستكشاف، بس فيه تحفّظات:<br>• الـ attention بتقول الـ head <mark>قرا</mark> من أنهي مكان، مش قد إيه المكان ده <mark>أثّر</mark> في الـ output النهائي. الـ value vectors بتختلف في الحجم، وفيه مئات الـ heads وطبقات كتير بتتجمّع في الـ residual stream (محاضرة 8).<br>• Jain وWallace (2019) في <mark>Attention is not Explanation</mark> وجدوا إن weights الـ attention مش دايمًا بتتوافق مع أهمية الـ tokens بالـ gradients، وإنك ممكن تلاقي attention مختلفة جدًا بتدّي نفس التنبؤ. وردّ عليهم Wiegreffe وPinter (2019) إن الإجابة بتعتمد على تعريفك لكلمة \"explanation\".<br>• الخلاصة: الـ attention دليل مساعد، مش تفسير سببي.</p>',
         '<p>The first idea that comes to anyone: plot the <mark>attention weights</mark> and say \"the model is looking at this word\". The plot is useful for exploring, but it has caveats:<br>• Attention says where a head <mark>read</mark> from, not how much that place <mark>influenced</mark> the final output. Value vectors differ in size, and hundreds of heads and many layers add up in the residual stream (lecture 8).<br>• Jain and Wallace (2019) in <mark>Attention is not Explanation</mark> found that attention weights do not always agree with token importance measured by gradients, and that you can find very different attention that gives the same prediction. Wiegreffe and Pinter (2019) replied that the answer depends on how you define \"explanation\".<br>• The takeaway: attention is a helpful clue, not a causal explanation.</p>')),
 q:[
   CQ("ليه الـ attention weights مش بالضرورة بتقيس تأثير token على الـ output؟",
     "Why do attention weights not necessarily measure a token's effect on the output?",
     [["لأن الـ attention بتتحسب بعد الـ output","Because attention is computed after the output"],
      ["لأنها بتقول الـ head قرا من أنهي مكان بس، والـ value vectors بتختلف في الحجم وفيه heads وطبقات كتير بتتجمّع","Because they only say where a head read from, value vectors differ in size, and many heads and layers add up"],
      ["لأن الـ softmax بيخلّي كل الـ weights صفر","Because the softmax makes all weights zero"],
      ["لأن الـ attention مش بتتدرّب","Because attention is not trained"]],
     1,"الـ weight بيقول إن الـ head قرا من مكان، مش قد إيه القراءة دي أثّرت في الـ output النهائي بعد ما اتجمّعت في الـ residual stream.",
     "A weight says a head read from a place, not how much that read affected the final output after being summed in the residual stream."),
  CQ("Jain وWallace لقوا إن ممكن نلاقي attention distributions مختلفة جدًا بتدّي نفس التنبؤ. أنهي استنتاج ده بيدعمه؟",
     "Jain and Wallace found that very different attention distributions can give the same prediction. Which conclusion does this support?",
     [["الـ attention لوحده مش تفسير سببي مضمون","Attention alone is not a guaranteed causal explanation"],
      ["الـ attention دايمًا غلط","Attention is always wrong"],
      ["الموديل مش بيستخدم الـ attention","The model does not use attention"],
      ["الـ gradients مفيهاش معلومة","Gradients carry no information"]],
     0,"لو توزيعات مختلفة بتدّي نفس التنبؤ، يبقى توزيع واحد مش بالضرورة هو السبب. وWiegreffe وPinter ردّوا إن الإجابة بتعتمد على تعريف explanation.",
     "If different distributions give the same prediction, one distribution is not necessarily the cause. Wiegreffe and Pinter replied that the answer depends on how you define explanation.")
 ],
 f:[
   CF("ليه الـ attention weights مش تفسير كافي، وإيه البديل الأحسن؟","Why are attention weights not a sufficient explanation, and what is the better alternative?",
      "لأنها بتبيّن مكان القراءة في head واحدة مش تأثير المكان على الـ output، ومش دايمًا بتتوافق مع الـ gradients. البديل feature attribution زي occlusion وIntegrated Gradients (completeness: المجموع = f(x) - f(baseline))، وبنقيّمها بالـ faithfulness: مسح الـ tokens المهمة المفروض يغيّر الـ output.","Because they show where one head reads from, not how that place affects the output, and they do not always agree with gradients. The alternative is feature attribution such as occlusion and Integrated Gradients (completeness: the sum equals f(x) - f(baseline)), evaluated by faithfulness: deleting the important tokens should change the output."),
   CF("إيه ردّ Wiegreffe وPinter على Attention is not Explanation؟","How did Wiegreffe and Pinter reply to Attention is not Explanation?",
     "قالوا إن الإجابة بتعتمد على تعريفك لكلمة explanation.",
     "They said the answer depends on how you define the word explanation.")
 ],
 terms:[
  {t:B("Attention is not Explanation","Attention is not Explanation"),
   d:B("ورقة (Jain وWallace، 2019) بتبيّن إن weights الـ attention مش دايمًا بتتوافق مع أهمية الـ tokens بالـ gradients.",
       "A paper (Jain and Wallace, 2019) showing that attention weights do not always agree with token importance measured by gradients.")}
 ]},

{id:"l17-attribution-methods",t:B("طرق الـ feature attribution","Feature attribution methods"),
 b:cat(
   B('<p>الأسلوب الأقوى هو <mark>feature attribution</mark>: إدّي كل token درجة بتقيس مساهمته في الـ output <code>f(x)</code> (مثلًا logit الـ class المتنبأ بيه). الطرق الشائعة:</p>' +
         '<div class="m">occlusion: f(x) - f(x minus token i)\nsaliency:  | df / de_i |\ngrad x in: e_i * df / de_i\nint.grad:  (e_i - b_i) * integral\n           of df(b + a(e-b))/de_i da\n           for a from 0 to 1</div>' +
         '<p>• <mark>Occlusion</mark>: امسح token وشوف الـ output اتغيّر قد إيه. بسيطة بس محتاجة forward pass لكل token.<br>• <mark>Gradient × input</mark>: مشتقة الـ output بالنسبة لـ embedding الـ token، مضروبة في الـ embedding نفسه. سريعة (backward pass واحد).<br>• <mark>Integrated Gradients</mark> (Sundararajan وزمايله، 2017): بدل مشتقة في نقطة واحدة، بنكامل المشتقة على الخط المستقيم من <mark>baseline</mark> (زي embedding صفري) لحد الـ input الحقيقي. وليها خاصية <mark>completeness</mark>: مجموع الـ attributions بيساوي <code>f(x) - f(baseline)</code> بالظبط.<br>• <mark>LIME</mark>: بنعمل نسخ معدّلة من الـ input ونطابق حواليه موديل خطي بسيط يقلّد سلوك الموديل محليًا.</p>',
         '<p>The stronger approach is <mark>feature attribution</mark>: give each token a score that measures its contribution to the output <code>f(x)</code> (for example the logit of the predicted class). Common methods:</p>' +
         '<div class="m">occlusion: f(x) - f(x minus token i)\nsaliency:  | df / de_i |\ngrad x in: e_i * df / de_i\nint.grad:  (e_i - b_i) * integral\n           of df(b + a(e-b))/de_i da\n           for a from 0 to 1</div>' +
         '<p>• <mark>Occlusion</mark>: remove a token and see how much the output changes. Simple, but it needs a forward pass per token.<br>• <mark>Gradient × input</mark>: the derivative of the output with respect to the token embedding, multiplied by the embedding itself. Fast (one backward pass).<br>• <mark>Integrated Gradients</mark> (Sundararajan et al., 2017): instead of a derivative at a single point, we integrate the derivative along the straight line from a <mark>baseline</mark> (like a zero embedding) to the real input. It has a <mark>completeness</mark> property: the attributions sum to exactly <code>f(x) - f(baseline)</code>.<br>• <mark>LIME</mark>: we create modified copies of the input and fit a simple linear model around it that imitates the model locally.</p>')),
 q:[
   CQ("في Integrated Gradients، f(x) = 0.9 و f(baseline) = 0.2. مجموع الـ attributions على كل الـ tokens بيساوي كام؟","In Integrated Gradients, f(x) = 0.9 and f(baseline) = 0.2. What do the attributions over all tokens sum to?",
      [["0.2","0.2"],["0.9","0.9"],["1.1","1.1"],["0.7","0.7"]],
      3,"خاصية الـ completeness: المجموع = f(x) - f(baseline) = 0.9 - 0.2 = 0.7.","The completeness property: the sum = f(x) - f(baseline) = 0.9 - 0.2 = 0.7."),
   CQ("جملة من 10 tokens. occlusion بيحتاج كام forward pass (شامل الـ pass الأصلي على الجملة كاملة)؟",
     "A sentence has 10 tokens. How many forward passes does occlusion need (including the original pass on the full sentence)?",
     [["1","1"],["10","10"],["11","11"],["20","20"]],
     2,"forward pass للجملة كاملة بنحسب بيه f(x)، و10 passes تانيين، واحد لكل token ممسوح. المجموع 11.",
     "One forward pass on the full sentence gives f(x), plus 10 more, one per deleted token. The total is 11.")
 ],
 f:[
   CF("إيه الفرق بين occlusion و gradient × input؟","What is the difference between occlusion and gradient × input?",
     "occlusion بيمسح token ويقيس تغيّر الـ output ومحتاج forward pass لكل token. gradient × input بياخد مشتقة الـ output بالنسبة لـ embedding الـ token ويضربها في الـ embedding، بـ backward pass واحد.",
     "Occlusion deletes a token and measures the output change, needing a forward pass per token. Gradient × input takes the derivative of the output with respect to the token embedding and multiplies it by the embedding, in a single backward pass."),
  CF("إيه هو الـ baseline في Integrated Gradients؟","What is the baseline in Integrated Gradients?",
     "نقطة مرجعية (زي embedding صفري) بنكامل المشتقة على الخط المستقيم منها لحد الـ input الحقيقي.",
     "A reference point (like a zero embedding) from which we integrate the derivative along the straight line to the real input.")
 ],
 terms:[
  {t:B("Feature attribution","Feature attribution"),
   d:B("إدّي كل token درجة بتقيس مساهمته في الـ output f(x) (مثلًا logit الـ class المتنبأ بيه).",
       "Giving each token a score that measures its contribution to the output f(x) (for example the logit of the predicted class).")},
  {t:B("Occlusion","Occlusion"),
   d:B("بنمسح token ونشوف الـ output اتغيّر قد إيه. بسيطة بس محتاجة forward pass لكل token.",
       "Deleting a token and seeing how much the output changes. Simple, but it needs a forward pass per token.")},
  {t:B("Gradient × input","Gradient × input"),
   d:B("مشتقة الـ output بالنسبة لـ embedding الـ token مضروبة في الـ embedding نفسه. سريعة (backward pass واحد).",
       "The derivative of the output with respect to the token embedding, multiplied by the embedding itself. Fast (one backward pass).")},
  {t:B("Integrated Gradients","Integrated Gradients"),
   d:B("بنكامل المشتقة على الخط المستقيم من الـ baseline لحد الـ input الحقيقي (Sundararajan وزمايله، 2017).",
       "Integrating the derivative along the straight line from the baseline to the real input (Sundararajan et al., 2017).")},
  {t:B("Baseline","Baseline"),
   d:B("input مرجعي (زي embedding صفري) بنقيس الـ attribution بالنسبة له.",
       "A reference input (like a zero embedding) that attributions are measured against.")},
  {t:B("Completeness","Completeness"),
   d:B("خاصية في Integrated Gradients: مجموع الـ attributions = f(x) - f(baseline).",
       "A property of Integrated Gradients: the attributions sum to f(x) - f(baseline).")},
  {t:B("LIME","LIME"),
   d:B("بنعمل نسخ معدّلة من الـ input ونطابق حواليه موديل خطي بسيط يقلّد سلوك الموديل محليًا.",
       "Creating modified copies of the input and fitting a simple linear model around it that imitates the model locally.")}
 ]},

{id:"l17-faithfulness",t:B("مثال رقمي والـ faithfulness","A numeric example and faithfulness"),
 b:cat(
   B('<p>مثال مبسّط: موديل sentiment خطي، لكل كلمة مساهمة، والـ baseline كله أصفار:</p>',
         '<p>A simplified example: a linear sentiment model, each word has a contribution, and the baseline is all zeros:</p>'),
       FIG_L17_ATTR,
       B('<div class="m">great 2.1, acting 0.3, but 0.0\nboring -1.8, plot -0.1\n\nsum = 2.1+0.3+0.0-1.8-0.1 = 0.5\nf(x) = 0.5, f(baseline) = 0\n0.5 - 0 = 0.5   (completeness)</div>' +
         '<p>لكن الـ attribution مش مضمونة. النتيجة بتتأثر باختيار الـ baseline، وممكن تتغيّر كتير بتغيير صغير جدًا في الـ input من غير ما التنبؤ يتغيّر (Ghorbani وزمايله، 2019). والاختبار الصح لأي طريقة هو <mark>faithfulness</mark>: امسح الـ tokens اللي الطريقة قالت إنها الأهم، ولو الـ output ما اتأثّرش يبقى الطريقة مش أمينة. بنقيس ده بـ <mark>comprehensiveness</mark> (مسح الـ tokens المهمة المفروض يضرّ الإجابة كتير) و<mark>sufficiency</mark> (الـ tokens المهمة لوحدها المفروض تكفي عشان الموديل يوصل لنفس الإجابة).</p>',
         '<div class="m">great 2.1, acting 0.3, but 0.0\nboring -1.8, plot -0.1\n\nsum = 2.1+0.3+0.0-1.8-0.1 = 0.5\nf(x) = 0.5, f(baseline) = 0\n0.5 - 0 = 0.5   (completeness)</div>' +
         '<p>But attribution is not guaranteed. The result depends on the choice of baseline, and it can change a lot from a tiny change in the input even when the prediction does not change (Ghorbani et al., 2019). The right test for any method is <mark>faithfulness</mark>: delete the tokens the method called most important, and if the output is not affected, the method is not faithful. We measure this with <mark>comprehensiveness</mark> (deleting the important tokens should hurt the answer a lot) and <mark>sufficiency</mark> (the important tokens alone should be enough for the model to reach the same answer).</p>')),
 q:[
   CQ("الـ attributions لـ 3 tokens هي +1.2 و+0.5 و-0.4، و f(baseline) = 0.2. بحسب الـ completeness، كام f(x)؟",
     "The attributions of 3 tokens are +1.2, +0.5 and -0.4, and f(baseline) = 0.2. By completeness, what is f(x)?",
     [["1.3","1.3"],["1.7","1.7"],["0.2","0.2"],["1.5","1.5"]],
     3,"completeness: مجموع الـ attributions = f(x) - f(baseline). المجموع = 1.2 + 0.5 - 0.4 = 1.3، فـ f(x) = 1.3 + 0.2 = 1.5.",
     "Completeness: the attributions sum to f(x) - f(baseline). The sum is 1.2 + 0.5 - 0.4 = 1.3, so f(x) = 1.3 + 0.2 = 1.5."),
  CQ("مسحنا الـ tokens اللي طريقة attribution قالت إنها الأهم، والـ output ما اتأثّرش. ده معناه إيه؟",
     "We delete the tokens an attribution method called most important and the output is unaffected. What does that mean?",
     [["الطريقة faithful جدًا","The method is very faithful"],
      ["الطريقة مش faithful","The method is not faithful"],
      ["الـ baseline لازم يبقى صفر","The baseline must be zero"],
      ["الـ comprehensiveness عالية","The comprehensiveness is high"]],
     1,"لو مسح الـ tokens المهمة ما أثّرش في الإجابة فالطريقة مش أمينة. المفروض الـ comprehensiveness تبقى عالية، يعني المسح يضرّ الإجابة.",
     "If deleting the important tokens does not affect the answer, the method is not faithful. Comprehensiveness should be high, meaning the deletion hurts the answer.")
 ],
 f:[
   CF("إيه الفرق بين comprehensiveness و sufficiency؟","What is the difference between comprehensiveness and sufficiency?",
     "comprehensiveness: مسح الـ tokens المهمة المفروض يضرّ الإجابة كتير. sufficiency: الـ tokens المهمة لوحدها المفروض تكفي عشان الموديل يوصل لنفس الإجابة.",
     "Comprehensiveness: deleting the important tokens should hurt the answer a lot. Sufficiency: the important tokens alone should be enough for the model to reach the same answer."),
  CF("إيه نقط ضعف الـ attribution؟","What are the weaknesses of attribution?",
     "النتيجة بتتأثر باختيار الـ baseline، وممكن تتغيّر كتير بتغيير صغير جدًا في الـ input من غير ما التنبؤ يتغيّر (Ghorbani وزمايله، 2019).",
     "The result depends on the choice of baseline and can change a lot with a tiny input change even when the prediction does not (Ghorbani et al., 2019).")
 ],
 terms:[
  {t:B("Faithfulness (attribution)","Faithfulness (attribution)"),
 d:B("اختبار إن طريقة الـ attribution أمينة: مسح الـ tokens اللي قالت إنها الأهم لازم يأثّر في الـ output.","A test that an attribution method is trustworthy: deleting the tokens it called most important must affect the output.")},
  {t:B("Comprehensiveness","Comprehensiveness"),
   d:B("مسح الـ tokens المهمة المفروض يضرّ الإجابة كتير.",
       "Deleting the important tokens should hurt the answer a lot.")},
  {t:B("Sufficiency","Sufficiency"),
   d:B("الـ tokens المهمة لوحدها المفروض تكفي عشان الموديل يوصل لنفس الإجابة.",
       "The important tokens alone should be enough for the model to reach the same answer.")}
 ]},

{id:"l17-interventions",t:B("Interventions: الـ activation patching","Interventions: activation patching"),
 b:cat(
   B('<p>الـ probing والـ attribution <mark>ارتباطية</mark>. عشان نثبت إن جزء بيستخدمه الموديل فعلًا لازم <mark>نتدخّل</mark>: نغيّر activation جوه الموديل ونشوف الـ output. أشهر طريقة: <mark>activation patching</mark> (واسمها كمان causal tracing أو causal mediation):<br>1. شغّل prompt <mark>clean</mark> يدّي الإجابة الصح (احتمالها <code>P_clean</code>).<br>2. شغّل prompt <mark>corrupted</mark> (غيّرنا فيه حاجة بتبوّظ الإجابة، زي اسم الموضوع) واحتمال الإجابة الصح فيه <code>P_corr</code>.<br>3. شغّل الـ corrupted تاني، بس في مكان واحد (طبقة <code>l</code> وموضع <code>t</code>) <mark>انسخ الـ activation من الـ clean run</mark>. الاحتمال الجديد <code>P_patch</code>.<br>4. قيس قد إيه الإجابة رجعت:</p>' +
         '<div class="m">effect = (P_patch - P_corr)\n       / (P_clean - P_corr)\n\nP_clean=0.80  P_corr=0.10\nP_patch=0.52\neffect = 0.42 / 0.70 = 0.60</div>',
         '<p>Probing and attribution are <mark>correlational</mark>. To prove that the model really uses a part, we have to <mark>intervene</mark>: change an activation inside the model and watch the output. The best-known method is <mark>activation patching</mark> (also called causal tracing or causal mediation):<br>1. Run a <mark>clean</mark> prompt that gives the right answer (its probability is <code>P_clean</code>).<br>2. Run a <mark>corrupted</mark> prompt (we changed something that ruins the answer, like the subject name), and the right answer has probability <code>P_corr</code>.<br>3. Run the corrupted prompt again, but at one place (layer <code>l</code>, position <code>t</code>) <mark>copy the activation from the clean run</mark>. The new probability is <code>P_patch</code>.<br>4. Measure how much of the answer came back:</p>' +
         '<div class="m">effect = (P_patch - P_corr)\n       / (P_clean - P_corr)\n\nP_clean=0.80  P_corr=0.10\nP_patch=0.52\neffect = 0.42 / 0.70 = 0.60</div>'),
       FIG_L17_PATCH),
 q:[
   CQ("في activation patching: P_clean = 0.9، P_corr = 0.2، P_patch = 0.55. كام الـ effect؟","In activation patching: P_clean = 0.9, P_corr = 0.2, P_patch = 0.55. What is the effect?",
      [["35%","35%"],["61%","61%"],["50%","50%"],["25%","25%"]],
      2,"effect = (0.55 - 0.20) / (0.90 - 0.20) = 0.35 / 0.70 = 0.50، يعني الـ patch رجّع نص الفرق.","effect = (0.55 - 0.20) / (0.90 - 0.20) = 0.35 / 0.70 = 0.50, so the patch recovered half of the difference."),
   CQ("ليه activation patching بيعتبر دليل سببي والـ probing لأ؟","Why is activation patching causal evidence while probing is not?",
     [["لأنه بيستخدم classifier أكبر","Because it uses a larger classifier"],
      ["لأنه بيدرّب الموديل من جديد","Because it retrains the model"],
      ["لأنه بيقيس الـ accuracy على test set","Because it measures accuracy on a test set"],
      ["لأننا بنغيّر activation جوه الموديل ونشوف الـ output اتغيّر ولا لأ","Because we change an activation inside the model and see whether the output changes"]],
     3,"في الـ patching بنتدخّل فعليًا ونشوف أثر التدخّل على الـ output. الـ probing بيقرا بس.",
     "In patching we actually intervene and see the effect of the intervention on the output. Probing only reads.")
 ],
 f:[
   CF("إزاي بنحسب effect في activation patching، وإيه اللي بيعمله الـ induction head؟","How do we compute the effect in activation patching, and what does an induction head do?",
      "effect = (P_patch - P_corr) / (P_clean - P_corr): بننسخ activation من الـ clean run للـ corrupted run ونقيس قد إيه الإجابة رجعت، وده سببي عكس الـ probing. الـ induction head دايرة من head للـ previous token وhead تانية بتنسخ: لو شاف A B ... A بيتنبأ B.","effect = (P_patch - P_corr) / (P_clean - P_corr): we copy an activation from the clean run into the corrupted run and measure how much of the answer came back, which is causal, unlike probing. An induction head is a circuit of a previous-token head plus a second head that copies: after seeing A B ... A it predicts B."),
   CF("إيه خطوات activation patching؟","What are the steps of activation patching?",
     "1) شغّل prompt clean. 2) شغّل prompt corrupted. 3) انسخ activation واحد من الـ clean run للـ corrupted run. 4) احسب effect = (P_patch - P_corr) / (P_clean - P_corr).",
     "1) Run a clean prompt. 2) Run a corrupted prompt. 3) Copy one activation from the clean run into the corrupted run. 4) Compute effect = (P_patch - P_corr) / (P_clean - P_corr).")
 ],
 terms:[
  {t:B("Activation patching","Activation patching"),
   d:B("بننسخ activation من clean run لـ corrupted run في مكان واحد ونقيس قد إيه الإجابة الصح رجعت (واسمها كمان causal tracing).",
       "Copying an activation from a clean run into a corrupted run at one place and measuring how much of the right answer comes back (also called causal tracing).")},
  {t:B("Corrupted prompt","Corrupted prompt"),
   d:B("prompt غيّرنا فيه حاجة بتبوّظ الإجابة (زي اسم الموضوع) عشان نقارن بيه الـ clean prompt.",
       "A prompt where we changed something that ruins the answer (like the subject name), used for comparison with the clean prompt.")}
 ]},

{id:"l17-rome-logit-lens",t:B("ROME والـ logit lens","ROME and the logit lens"),
 b:cat(
   B('<p>لو الـ effect (الرقم من كارت الـ patching اللي فات) قريب من 1 يبقى المكان ده <mark>كافي</mark> لاسترجاع الإجابة، ولو قريب من 0 يبقى مش مؤثّر. Meng وزمايله (2022) في ROME طبّقوا ده على الحقائق (زي \"The Eiffel Tower is in ...\") في GPT-2 XL، ولقوا إن الـ <mark>MLP layers</mark> في النص عند آخر token من اسم الـ subject مؤثّرة جدًا في استرجاع الحقيقة. (أبحاث جت بعدها شكّكت إن تحديد المكان ده بيقول لنا أنسب مكان لتعديل الحقيقة.)</p>' +
         '<p><mark>Logit lens</mark> (nostalgebraist، 2020): أداة بسيطة نشوف بيها الموديل \"كان هيتنبأ بإيه\" عند كل طبقة. بنطبّق الـ unembedding النهائي على الـ hidden state بتاع طبقة في النص:</p>' +
         '<div class="m">logits_l = W_U * LayerNorm(h_l)\n\nfor l = 1 ... L:\n  show top token of softmax(logits_l)</div>' +
         '<p>اللي بنلاحظه إن التنبؤ بيتحسّن تدريجيًا مع الطبقات. (الـ <mark>tuned lens</mark> بيتعلّم تحويل صغير لكل طبقة عشان يدّي قراءة أدق في الطبقات الأولى.)</p>',
         '<p>If the effect (the number from the previous patching card) is close to 1, that place is <mark>sufficient</mark> to recover the answer, and if it is close to 0 it does not matter. Meng et al. (2022) in ROME applied this to facts (like \"The Eiffel Tower is in ...\") in GPT-2 XL and found that the <mark>MLP layers</mark> in the middle, at the last token of the subject name, matter a lot for recalling the fact. (Later work questioned whether this localization tells us the best place to edit a fact.)</p>' +
         '<p>The <mark>logit lens</mark> (nostalgebraist, 2020): a simple tool to see what the model \"would predict\" at each layer. We apply the final unembedding to the hidden state of a middle layer:</p>' +
         '<div class="m">logits_l = W_U * LayerNorm(h_l)\n\nfor l = 1 ... L:\n  show top token of softmax(logits_l)</div>' +
         '<p>What we notice is that the prediction improves gradually through the layers. (The <mark>tuned lens</mark> learns a small transformation per layer to give a more accurate reading in the early layers.)</p>')),
 q:[
   CQ("في ROME على GPT-2 XL، أنهي جزء طلع مؤثّر جدًا في استرجاع حقيقة زي The Eiffel Tower is in؟",
     "In ROME on GPT-2 XL, which part mattered most for recalling a fact like The Eiffel Tower is in?",
     [["الـ embedding layer بس","The embedding layer only"],
      ["الـ MLP layers في النص عند آخر token من اسم الـ subject","The middle MLP layers at the last token of the subject name"],
      ["الـ softmax في آخر طبقة بس","The final softmax only"],
      ["الـ attention عند أول token","The attention at the first token"]],
     1,"Meng وزمايله (2022) لقوا إن الـ MLP layers في النص عند آخر token من الـ subject هي الأكتر تأثيرًا. وأبحاث جت بعدها شكّكت إن ده بيحدد أنسب مكان لتعديل الحقيقة.",
     "Meng et al. (2022) found that the middle MLP layers at the last subject token matter most. Later work questioned whether this tells us the best place to edit a fact."),
  CQ("إزاي بنحصل على توقّع طبقة l في الـ logit lens؟","How do we get the prediction of layer l in the logit lens?",
     [["بنطبّق الـ unembedding النهائي (بعد LayerNorm) على h_l","We apply the final unembedding (after LayerNorm) to h_l"],
      ["بنعيد تدريب الموديل لحد الطبقة l بس","We retrain the model up to layer l only"],
      ["بنمسح الطبقات اللي بعد l","We delete the layers after l"],
      ["بنجمّع attention weights بتاعة الطبقة l","We sum the attention weights of layer l"]],
     0,"logits_l = W_U * LayerNorm(h_l)، وبناخد top token من softmax. التنبؤ بيتحسّن تدريجيًا مع الطبقات.",
     "logits_l = W_U * LayerNorm(h_l), and we take the top token of the softmax. The prediction improves gradually through the layers.")
 ],
 f:[
   CF("إيه هو الـ logit lens؟","What is the logit lens?",
     "أداة بنطبّق فيها الـ unembedding النهائي على hidden state بتاع طبقة في النص عشان نشوف الموديل كان هيتنبأ بإيه عندها. الـ tuned lens بيتعلّم تحويل صغير لكل طبقة لقراءة أدق.",
     "A tool that applies the final unembedding to a middle layer's hidden state to see what the model would predict there. The tuned lens learns a small transformation per layer for a more accurate reading."),
  CF("إيه اللي ROME لقاه، وإيه التحفّظ عليه؟","What did ROME find, and what is the caveat?",
     "الـ MLP layers في النص عند آخر token من الـ subject مؤثّرة جدًا في استرجاع الحقيقة. وأبحاث جت بعدها شكّكت إن تحديد المكان ده بيقول لنا أنسب مكان لتعديل الحقيقة.",
     "Middle MLP layers at the last subject token matter a lot for recalling the fact. Later work questioned whether this localization tells us the best place to edit it.")
 ],
 terms:[
  {t:B("ROME","ROME"),
   d:B("عمل (Meng وزمايله، 2022) طبّق الـ patching على حقائق في GPT-2 XL ولقى إن الـ MLP layers في النص مهمة لاسترجاعها.",
       "Work (Meng et al., 2022) that applied patching to facts in GPT-2 XL and found that the middle MLP layers matter for recalling them.")},
  {t:B("Logit lens","Logit lens"),
   d:B("بنطبّق الـ unembedding النهائي على hidden state بتاع طبقة في النص عشان نشوف الموديل كان هيتنبأ بإيه عندها.",
       "Applying the final unembedding to a middle layer's hidden state to see what the model would predict there.")},
  {t:B("Tuned lens","Tuned lens"),
   d:B("نسخة من الـ logit lens بتتعلّم تحويل صغير لكل طبقة عشان تدّي قراءة أدق في الطبقات الأولى.",
       "A version of the logit lens that learns a small transformation per layer to give a more accurate reading in the early layers.")}
 ]},

{id:"l17-circuits",t:B("Mechanistic interpretability: الـ circuits والـ induction head","Mechanistic interpretability: circuits and the induction head"),
 b:cat(
   B('<p>الـ <mark>mechanistic interpretability</mark> بيحاول يعمل reverse-engineering للموديل لأجزاء ودوائر (<mark>circuits</mark>). المنظور المفيد: الـ <mark>residual stream</mark> هو مسار مشترك، وكل attention head وكل MLP بيقرا منه ويضيف عليه (<code>h_next = h + Attn(h) + MLP(h)</code>، محاضرة 8). وأشهر circuit مفهوم هو <mark>induction head</mark> (Olsson وزمايله، 2022):</p>' +
         '<div class="m">... A B ... A  ->  predict B\n\nhead 1 (previous-token head),\nat B: writes "previous token = A"\n\nhead 2 (induction head),\nat 2nd A: query "I am A" matches\nthe key at B ("previous = A"),\nattends to B, copies B to output</div>',
         '<p><mark>Mechanistic interpretability</mark> tries to reverse-engineer the model into parts and <mark>circuits</mark>. A useful view: the <mark>residual stream</mark> is a shared pathway, and every attention head and every MLP reads from it and adds to it (<code>h_next = h + Attn(h) + MLP(h)</code>, lecture 8). The best-understood circuit is the <mark>induction head</mark> (Olsson et al., 2022):</p>' +
         '<div class="m">... A B ... A  ->  predict B\n\nhead 1 (previous-token head),\nat B: writes "previous token = A"\n\nhead 2 (induction head),\nat 2nd A: query "I am A" matches\nthe key at B ("previous = A"),\nattends to B, copies B to output</div>'),
       FIG_L17_CIRCUIT,
       B('<p>الدايرة دي هي اللي بتخلّي الموديل <mark>ينسخ pattern</mark> شافه في السياق. وبتظهر أثناء التدريب فجأة (phase change)، تقريبًا في نفس الوقت اللي الـ <mark>in-context learning</mark> بيتحسّن بشكل واضح (محاضرة 11).</p>',
         '<p>This circuit is what lets the model <mark>copy a pattern</mark> it saw in the context. It appears suddenly during training (a phase change), at roughly the same time that <mark>in-context learning</mark> clearly improves (lecture 11).</p>')),
 q:[
   CQ("السياق: ... Paris Louvre ... Paris. بعد الـ Paris التانية، الـ induction head هتخلّي الموديل يتنبأ بإيه؟",
     "Context: ... Paris Louvre ... Paris. After the second Paris, what does an induction head push the model to predict?",
     [["Paris","Paris"],["London","London"],["Louvre","Louvre"],["مفيش توقع","No prediction"]],
     2,"الـ pattern هو A B ... A -> B. هنا A = Paris و B = Louvre، فالـ induction head بتنسخ الـ token اللي جه بعد Paris أول مرة.",
     "The pattern is A B ... A -> B. Here A = Paris and B = Louvre, so the induction head copies the token that followed Paris the first time."),
  CQ("إيه وظيفة الـ previous-token head في دايرة الـ induction؟","What does the previous-token head do in the induction circuit?",
     [["بتكتب عند B إن الـ token اللي قبله A، عشان الـ head التانية تلاقيه","At B it writes that the previous token is A, so the other head can find it"],
      ["بتنسخ B للـ output مباشرة","It copies B straight to the output"],
      ["بتحسب الـ loss","It computes the loss"],
      ["بتمسح الـ tokens القديمة","It deletes old tokens"]],
     0,"عند B بتكتب previous token = A. بعدين الـ induction head عند الـ A التانية بتطابق الـ query بتاعها مع الـ key ده وتنسخ B.",
     "At B it writes previous token = A. Then the induction head at the second A matches its query with that key and copies B.")
 ],
 f:[
   CF("إيه هي الـ circuit وإيه هو الـ residual stream؟","What is a circuit and what is the residual stream?",
     "circuit: دايرة من أجزاء (heads وMLPs) بتحسب حاجة معيّنة. الـ residual stream: مسار مشترك كل head وكل MLP بيقرا منه ويضيف عليه (h_next = h + Attn(h) + MLP(h)).",
     "A circuit: a set of parts (heads and MLPs) that computes something specific. The residual stream: a shared pathway that every head and MLP reads from and adds to (h_next = h + Attn(h) + MLP(h))."),
  CF("ليه الـ induction head مهمة؟","Why is the induction head important?",
     "هي اللي بتخلّي الموديل ينسخ pattern شافه في السياق، وبتظهر فجأة في التدريب (phase change) تقريبًا في نفس الوقت اللي الـ in-context learning بيتحسّن فيه.",
     "It is what lets the model copy a pattern it saw in the context, and it appears suddenly in training (a phase change) at roughly the time in-context learning improves.")
 ],
 terms:[
  {t:B("Mechanistic interpretability","Mechanistic interpretability"),
   d:B("محاولة عمل reverse-engineering للموديل لأجزاء ودوائر (circuits).",
       "Trying to reverse-engineer a model into parts and circuits.")},
  {t:B("Circuit","Circuit"),
   d:B("مجموعة أجزاء (heads وMLPs) بتشتغل مع بعض عشان تحسب حاجة معيّنة.",
       "A set of parts (heads and MLPs) that work together to compute something specific.")},
  {t:B("Residual stream","Residual stream"),
   d:B("مسار مشترك كل attention head وكل MLP بيقرا منه ويضيف عليه.",
       "A shared pathway that every attention head and every MLP reads from and adds to.")},
  {t:B("Induction head","Induction head"),
   d:B("head بتخلّي الموديل ينسخ pattern شافه في السياق: لو شاف A B ... A بيتنبأ B (Olsson وزمايله، 2022).",
       "A head that lets the model copy a pattern it saw in the context: after A B ... A it predicts B (Olsson et al., 2022).")},
  {t:B("Previous-token head","Previous-token head"),
   d:B("head بتكتب عند كل token إن الـ token اللي قبله هو إيه، وبتغذّي الـ induction head.",
       "A head that records at each token what the token before it was, feeding the induction head.")}
 ]},

{id:"l17-superposition",t:B("Superposition والـ polysemantic neurons","Superposition and polysemantic neurons"),
 b:cat(
   B('<p>لو بصّينا على <mark>neuron</mark> واحد، غالبًا مش بيمثّل مفهوم واحد نظيف. بيشتغل مع حاجات مالهاش علاقة ببعض، وده اسمه <mark>polysemantic</mark>. التفسير المقترح هو <mark>superposition hypothesis</mark> (Elhage وزمايله، 2022): الموديل عايز يمثّل <mark>features أكتر</mark> من عدد الأبعاد اللي عنده، فبيحطها في اتجاهات <mark>شبه متعامدة</mark> مش متعامدة تمامًا. وده بينفع لأن الـ features <mark>نادرة</mark> (sparse): قليل منها بس بيكون شغّال في نفس اللحظة، فالتداخل البسيط بينها بيبقى مقبول.</p>',
         '<p>If we look at a single <mark>neuron</mark>, it usually does not represent one clean concept. It fires for unrelated things, which is called <mark>polysemantic</mark>. The proposed explanation is the <mark>superposition hypothesis</mark> (Elhage et al., 2022): the model wants to represent <mark>more features</mark> than it has dimensions, so it places them in <mark>nearly orthogonal</mark> directions, not exactly orthogonal. This works because features are <mark>sparse</mark>: only a few of them are active at the same moment, so the small overlap between them is tolerable.</p>'),
       FIG_L17_SUPER,
       B('<p>الهندسة: في مستوى بُعدين نقدر نحط 5 اتجاهات بزاوية 72° بين كل اتنين متجاورين، و<code>cos 72° = 0.31</code>. لو feature واحد شغّال، القراءة لأي feature تاني بتطلع ضجيج بحجم 0.31 بدل صفر. وفي الأبعاد العالية (آلاف) نقدر نحط عدد أكبر بكتير من الاتجاهات الشبه متعامدة.</p>',
         '<p>The geometry: in a 2-D plane we can place 5 directions with 72° between neighbors, and <code>cos 72° = 0.31</code>. If one feature is active, the reading for any other feature is noise of size 0.31 instead of zero. And in high dimensions (thousands) we can place far more nearly orthogonal directions.</p>')),
 q:[
   CQ("ليه الـ neurons غالبًا polysemantic؟","Why are neurons often polysemantic?",
     [["لأن الـ learning rate عالي","Because the learning rate is high"],
      ["الموديل بيحط features أكتر من عدد الأبعاد في اتجاهات شبه متعامدة، فالـ neuron الواحد بيتأثر بأكتر من feature","The model packs more features than dimensions into nearly orthogonal directions, so one neuron is affected by more than one feature"],
      ["لأن الـ vocabulary صغير","Because the vocabulary is small"],
      ["لأن الـ dropout شغّال","Because dropout is on"]],
     1,"التفسير المقترح هو superposition: الموديل عايز features أكتر من الأبعاد، فبيحطها في اتجاهات شبه متعامدة، والـ neuron الواحد بيشارك في أكتر من feature.",
     "The proposed explanation is superposition: the model wants more features than dimensions, so it places them in nearly orthogonal directions, and one neuron takes part in more than one feature."),
  CQ("5 features في مستوى بُعدين بزاوية 72° بين كل اتنين متجاورين. لو f1 شغّال بقيمة 1 وباقي الـ features صفر، القراءة لـ feature جار بتطلع حوالي كام؟",
     "5 features in a 2-D plane with 72° between neighbors. If f1 is active with value 1 and the others are 0, what does the reading of a neighboring feature come out as?",
     [["صفر بالظبط","Exactly zero"],["1","1"],["حوالي 0.31 (ضجيج)","About 0.31 (noise)"],["0.72","0.72"]],
     2,"cos 72° = 0.31، فالتداخل ضجيج بحجم 0.31 بدل صفر. وده مقبول لأن الـ features نادرة ونادرًا بتظهر مع بعض.",
     "cos 72° = 0.31, so the overlap is noise of size 0.31 instead of zero. It is tolerable because features are sparse and rarely appear together.")
 ],
 f:[
   CF("إيه هو الـ superposition، وليه بنستخدم SAE؟","What is superposition, and why do we use an SAE?",
      "الموديل بيخزّن features أكتر من عدد الأبعاد في اتجاهات شبه متعامدة، لأن الـ features نادرة، فالـ neurons بتبقى polysemantic. الـ SAE بيتعلّم dictionary أكبر (m أكبر بكتير من d) بـ reconstruction loss زائد L1 sparsity، عشان يفكّ الـ activations لـ features أوضح.","The model stores more features than dimensions in nearly orthogonal directions, because features are sparse, so neurons end up polysemantic. The SAE learns a larger dictionary (m much larger than d) with a reconstruction loss plus L1 sparsity, to break the activations into clearer features."),
   CF("ليه الـ superposition بتنفع؟","Why does superposition work?",
     "لأن الـ features نادرة (sparse): قليل منها بس بيكون شغّال في نفس اللحظة، فالتداخل البسيط بين الاتجاهات الشبه متعامدة بيبقى مقبول.",
     "Because features are sparse: only a few are active at the same moment, so the small overlap between nearly orthogonal directions is tolerable.")
 ],
 terms:[
  {t:B("Polysemantic neuron","Polysemantic neuron"),
   d:B("neuron بيشتغل مع حاجات مالهاش علاقة ببعض، ومش بيمثّل مفهوم واحد نظيف.",
       "A neuron that fires for unrelated things instead of representing one clean concept.")},
  {t:B("Superposition hypothesis","Superposition hypothesis"),
   d:B("الموديل بيمثّل features أكتر من عدد الأبعاد في اتجاهات شبه متعامدة، لأن الـ features نادرة (Elhage وزمايله، 2022).",
       "The model represents more features than dimensions in nearly orthogonal directions, because features are sparse (Elhage et al., 2022).")}
 ]},

{id:"l17-sae",t:B("الـ sparse autoencoder (SAE)","The sparse autoencoder (SAE)"),
 b:cat(
   B('<p>الحل المقترح لفك الـ superposition هو <mark>sparse autoencoder (SAE)</mark>. بناخد activations <code>x</code> بُعدها <code>d</code> (مثلًا من الـ residual stream) ونتعلّم dictionary أكبر بكتير:</p>' +
         '<div class="m">f     = ReLU(W_e x + b_e)\nx_hat = W_d f + b_d\nf has m >> d entries\n\nloss = ||x - x_hat||^2\n       + lambda * ||f||_1\n\nd = 768, m = 16 * 768 = 12,288\nparams = 2*768*12,288\n         + 12,288 + 768\n       = 18,887,424 (~18.9M)</div>',
         '<p>The proposed way to undo superposition is a <mark>sparse autoencoder (SAE)</mark>. We take activations <code>x</code> of size <code>d</code> (for example from the residual stream) and learn a much larger dictionary:</p>' +
         '<div class="m">f     = ReLU(W_e x + b_e)\nx_hat = W_d f + b_d\nf has m >> d entries\n\nloss = ||x - x_hat||^2\n       + lambda * ||f||_1\n\nd = 768, m = 16 * 768 = 12,288\nparams = 2*768*12,288\n         + 12,288 + 768\n       = 18,887,424 (~18.9M)</div>'),
       FIG_L17_SAE,
       B('<p>الـ L1 penalty بتخلّي أغلب خانات <code>f</code> صفر لكل input، فكل feature بيتخصص في مفهوم أوضح. Anthropic (2024) كبّرت الطريقة دي على Claude 3 Sonnet ولقت features لمفاهيم محددة، وإن لو ثبّتّ feature معيّن على قيمة عالية (steering) سلوك الموديل بيتغيّر بشكل متوقع. الحدود: الـ SAE مش بيعيد بناء الـ activation بدقة كاملة (فيه reconstruction error)، وتدريبه مكلّف، ومش واضح إن الـ features اللي بيلاقيها هي \"الحقيقية\" للموديل.</p>',
         '<p>The L1 penalty makes most entries of <code>f</code> zero for each input, so each feature specializes in a clearer concept. Anthropic (2024) scaled this method to Claude 3 Sonnet and found features for specific concepts, and found that clamping a given feature to a high value (steering) changes the behavior of the model in a predictable way. The limits: the SAE does not rebuild the activation perfectly (there is reconstruction error), training it is expensive, and it is not clear that the features it finds are the \"true\" ones of the model.</p>')),
 q:[
   CQ("إيه وظيفة الـ L1 penalty في loss بتاع الـ sparse autoencoder؟","What is the role of the L1 penalty in the loss of a sparse autoencoder?",
      [["تخلّي أغلب الـ features صفر لكل input","Make most features zero for each input"],["تقلّل عدد طبقات الـ encoder","Reduce the number of encoder layers"],["تزوّد دقة إعادة بناء الـ activation","Increase the accuracy of rebuilding the activation"],["تخلّي الـ dictionary أصغر من بُعد الـ input","Make the dictionary smaller than the input size"]],
      0,"الـ L1 على f بتعاقب أي feature شغّال، فمعظمها بيتصفّر وبيفضل عدد قليل بس شغّال لكل input. ده اللي بيخلّي كل feature أوضح معنى. الـ dictionary في الحقيقة أكبر من الـ input مش أصغر.","The L1 on f penalizes every active feature, so most go to zero and only a few stay active for each input. That is what makes each feature clearer in meaning. The dictionary is actually larger than the input, not smaller."),
   CQ("SAE بياخد activation بُعده d = 512 وبيتعلّم dictionary بحجم m = 8 * 512 = 4,096. كام parameter فيه (W_e و W_d و b_e و b_d)؟",
     "An SAE takes an activation of size d = 512 and learns a dictionary of size m = 8 * 512 = 4,096. How many parameters does it have (W_e, W_d, b_e, b_d)?",
     [["4,194,304","4,194,304"],["4,198,912","4,198,912"],["2,099,456","2,099,456"],["8,392,704","8,392,704"]],
     1,"2*d*m = 2*512*4,096 = 4,194,304، وبنزوّد b_e بحجم m = 4,096 و b_d بحجم d = 512. المجموع 4,198,912.",
     "2*d*m = 2*512*4,096 = 4,194,304, plus b_e of size m = 4,096 and b_d of size d = 512. The total is 4,198,912.")
 ],
 f:[
   CF("إيه الـ loss بتاع الـ SAE؟","What is the SAE loss?",
     "reconstruction ||x - x_hat||² زائد lambda * ||f||_1. الـ L1 بتخلّي أغلب خانات f صفر لكل input.",
     "Reconstruction ||x - x_hat||² plus lambda * ||f||_1. The L1 makes most entries of f zero for each input."),
  CF("إيه هو الـ steering وإيه حدود الـ SAE؟","What is steering and what are the limits of an SAE?",
     "steering: تثبيت feature على قيمة عالية بيغيّر سلوك الموديل بشكل متوقع (Anthropic، 2024). الحدود: reconstruction error، وتدريب مكلّف، ومش واضح إن الـ features هي الحقيقية للموديل.",
     "Steering: clamping a feature to a high value changes the model's behavior in a predictable way (Anthropic, 2024). Limits: reconstruction error, expensive training, and it is unclear that the features are the model's true ones.")
 ],
 terms:[
  {t:B("Sparse autoencoder (SAE)","Sparse autoencoder (SAE)"),
   d:B("بيتعلّم dictionary أكبر بكتير من بُعد الـ activation بـ reconstruction loss زائد L1 sparsity، عشان يفكّ الـ activations لـ features أوضح.",
       "Learns a dictionary much larger than the activation size with a reconstruction loss plus L1 sparsity, to break activations into clearer features.")},
  {t:B("Steering","Steering"),
   d:B("تثبيت feature معيّن على قيمة عالية عشان نغيّر سلوك الموديل بشكل متوقع.",
       "Clamping a given feature to a high value to change the model's behavior in a predictable way.")}
 ]},

{id:"l17-limits",t:B("حدود التفسير: الـ rationalization وأنهي أداة لأنهي سؤال","Limits of explanation: rationalization and which tool for which question"),
 b:cat(
   B('<p>آخر نقطة: لو سألنا الموديل \"ليه جاوبت كده؟\" وكتب تفسير (أو chain of thought، محاضرة 14)، هل ده السبب الحقيقي؟ مش بالضرورة. Turpin وزمايله (2023) رتّبوا الـ few-shot examples بحيث الإجابة الصح دايمًا (A)، فالموديل اتحيّز لـ (A) وكتب chain of thought بيبرّر الإجابة من غير ما يذكر التحيّز ده. يعني التفسير المكتوب ممكن يبقى <mark>rationalization</mark> مش <mark>faithful</mark>.</p>' +
         '<p>الخلاصة: أنهي أداة لأنهي سؤال:</p>' +
         '<div class="m">where does it fail?\n  -> behavioral tests (what)\nis info Y in layer l?\n  -> probing (correlation)\nwhich tokens mattered?\n  -> attribution (approximate)\nis this part needed?\n  -> patching, ablation (causal)\nwhat is this feature?\n  -> SAE + steering (partial)</div>' +
         '<p>القاعدة: <mark>اجمع أكتر من نوع دليل</mark> قبل ما تقول إنك فهمت الموديل.</p>',
         '<p>One last point: if we ask the model \"why did you answer that?\" and it writes an explanation (or a chain of thought, lecture 14), is that the real reason? Not necessarily. Turpin et al. (2023) arranged the few-shot examples so the right answer was always (A), so the model became biased toward (A) and wrote a chain of thought justifying the answer without mentioning that bias. So a written explanation can be a <mark>rationalization</mark> rather than <mark>faithful</mark>.</p>' +
         '<p>The summary: which tool for which question:</p>' +
         '<div class="m">where does it fail?\n  -> behavioral tests (what)\nis info Y in layer l?\n  -> probing (correlation)\nwhich tokens mattered?\n  -> attribution (approximate)\nis this part needed?\n  -> patching, ablation (causal)\nwhat is this feature?\n  -> SAE + steering (partial)</div>' +
         '<p>The rule: <mark>gather more than one kind of evidence</mark> before saying you understand the model.</p>')),
 q:[
   CQ("ليه chain of thought اللي الموديل بيكتبه ممكن ميبقاش السبب الحقيقي؟","Why might the chain of thought a model writes not be its real reason?",
     [["لأن الـ chain of thought بيتحسب قبل الـ input","Because the chain of thought is computed before the input"],
      ["لأن الموديل مبيقدرش يكتب نص طويل","Because the model cannot write long text"],
      ["لأن الـ chain of thought بيمسح tokens","Because the chain of thought deletes tokens"],
      ["لأن الموديل ممكن يتحيّز لإجابة ويكتب تبرير من غير ما يذكر التحيّز (Turpin وزمايله)","Because the model can be biased toward an answer and write a justification without mentioning the bias (Turpin et al.)"]],
     3,"في تجربة Turpin وزمايله (2023) الإجابة الصح كانت دايمًا (A)، فالموديل اتحيّز لـ (A) وكتب تبرير من غير ما يذكر ده. يعني التفسير المكتوب ممكن يبقى rationalization مش faithful.",
     "In the experiment of Turpin et al. (2023) the right answer was always (A), so the model became biased toward (A) and wrote a justification without mentioning it. So a written explanation can be a rationalization rather than faithful."),
  CQ("عايز تعرف لو طبقة 8 لازمة فعلًا لإجابة معيّنة. أنهي أداة أنسب؟","You want to know whether layer 8 is really needed for a particular answer. Which tool fits best?",
     [["probing وبس","Probing only"],
      ["patching أو ablation (سببي)","Patching or ablation (causal)"],
      ["الـ attention weights وبس","Attention weights only"],
      ["اختبارات behavioral وبس","Behavioral tests only"]],
     1,"سؤال الجزء ده لازم ولا لأ محتاج تدخّل سببي: patching أو ablation. الـ probing ارتباطي، والـ behavioral بيقول الموديل بيفشل فين بس.",
     "The question of whether a part is needed calls for a causal intervention: patching or ablation. Probing is correlational, and behavioral tests only say where the model fails.")
 ],
 f:[
   CF("إيه الفرق بين rationalization و faithful explanation؟","What is the difference between a rationalization and a faithful explanation?",
     "faithful: التفسير بيعكس السبب الحقيقي للإجابة. rationalization: تبرير مكتوب بيطلع معقول من غير ما يكون هو السبب (زي CoT اللي مبيذكرش التحيّز).",
     "Faithful: the explanation reflects the real reason for the answer. Rationalization: a written justification that sounds reasonable without being the real reason (like a CoT that never mentions the bias)."),
  CF("إيه القاعدة لما نحلل موديل؟","What is the rule when analyzing a model?",
     "اجمع أكتر من نوع دليل: behavioral (إيه)، probing (ارتباط)، attribution (تقريبي)، patching وablation (سببي)، SAE وsteering (جزئي).",
     "Gather more than one kind of evidence: behavioral (what), probing (correlation), attribution (approximate), patching and ablation (causal), SAE and steering (partial).")
 ],
 terms:[
  {t:B("Rationalization","Rationalization"),
   d:B("تبرير مكتوب بيطلع معقول من غير ما يكون هو السبب الحقيقي للإجابة (عكس الـ faithful explanation).",
       "A written justification that sounds reasonable without being the real reason for the answer (the opposite of a faithful explanation).")},
  {t:B("Ablation","Ablation"),
   d:B("تعطيل أو إزالة جزء من الموديل ومراقبة أثر ده على الـ output.",
       "Disabling or removing a part of the model and observing the effect on the output.")}
 ]},

{id:"l17-recap",t:B("Recap: تحليل الموديل و Interpretability","Recap: model analysis and interpretability"),
 b:cat(
  B('<p><mark>5 نقاط لازم تفتكرها:</mark><br>1. الـ accuracy بتقيس النتيجة مش السبب: الـ shortcuts (زي Clever Hans) بتعدّي الـ test set وبتفشل برّاه.<br>2. 3 مستويات: behavior (إيه)، وrepresentations (موجود)، وmechanisms (بيحسب). كل ما الوصول أعمق الادّعاء أقوى، بس الارتباط مش سببية.<br>3. نجاح الـ probe معناه إن المعلومة موجودة، وبنتأكد بـ control task (selectivity). التدخّل السببي زي الـ patching هو اللي يثبت إن الموديل بيستخدمها.<br>4. الـ attribution (occlusion وgradient × input وIntegrated Gradients) تقريبية ولازم تعدّي اختبارات faithfulness. والـ attention دليل مش تفسير.<br>5. الـ neurons polysemantic بسبب الـ superposition، والـ SAEs بتحاول تطلّع features أوضح، والتفسير المكتوب ممكن يبقى rationalization.</p>'+
    '<p>أهم المعادلات:</p>'+
    '<div class="m">selectivity = task acc - control acc\n\neffect = (P_patch - P_corr)\n       / (P_clean - P_corr)\n\nsum of IG = f(x) - f(baseline)\n\nSAE loss = ||x - x_hat||^2\n           + lambda * ||f||_1</div>'+
    '<p>قبل المحاضرة اللي بعدها اتأكد إنك تقدر: تفرّق بين المستويات التلاتة والادّعاء اللي كل واحد بيسمح بيه، وتحسب الـ selectivity وeffect الـ patching ومجموع الـ IG على أرقام صغيرة، وتشرح ليه نوع دليل واحد عمره ما بيكفي.</p>',
    '<p><mark>5 points to remember:</mark><br>1. Accuracy measures the outcome, not the reason: shortcuts (like Clever Hans) pass the test set and fail outside it.<br>2. Three levels: behavior (what), representations (present), and mechanisms (computes). The deeper the access, the stronger the claim, but correlation is not causation.<br>3. A successful probe means the information is present, checked with a control task (selectivity). A causal intervention such as patching is what shows the model uses it.<br>4. Attribution (occlusion, gradient × input, Integrated Gradients) is approximate and must pass faithfulness tests. Attention is a clue, not an explanation.<br>5. Neurons are polysemantic because of superposition, SAEs try to recover clearer features, and a written explanation can be a rationalization.</p>'+
    '<p>Key equations:</p>'+
    '<div class="m">selectivity = task acc - control acc\n\neffect = (P_patch - P_corr)\n       / (P_clean - P_corr)\n\nsum of IG = f(x) - f(baseline)\n\nSAE loss = ||x - x_hat||^2\n           + lambda * ||f||_1</div>'+
    '<p>Before the next lecture, make sure you can: tell the three levels apart and the claim each one allows, compute selectivity, the patching effect and the IG sum on small numbers, and explain why one kind of evidence is never enough.</p>')),
 q:[
   CQ("أنهي أداة بتثبت إن الموديل بيستخدم جزء معيّن فعلًا؟","Which tool shows that the model actually uses a particular part?",
     [["Probing","Probing"],["الـ attention weights","Attention weights"],["Activation patching","Activation patching"],["الـ accuracy على الـ test set","Accuracy on the test set"]],
     2,"الـ patching تدخّل سببي: بننسخ activation ونشوف الـ output. الباقي ارتباطي أو بيقيس النتيجة بس.",
     "Patching is a causal intervention: we copy an activation and watch the output. The others are correlational or only measure the outcome."),
  CQ("في patching: P_clean = 0.8 و P_corr = 0.2 و P_patch = 0.65. كام الـ effect؟",
     "In patching: P_clean = 0.8, P_corr = 0.2 and P_patch = 0.65. What is the effect?",
     [["65%","65%"],["81%","81%"],["45%","45%"],["75%","75%"]],
     3,"effect = (0.65 - 0.20) / (0.80 - 0.20) = 0.45 / 0.60 = 0.75.",
     "effect = (0.65 - 0.20) / (0.80 - 0.20) = 0.45 / 0.60 = 0.75.")
 ],
 f:[
   CF("لخّص المستويات التلاتة وأداة كل مستوى.","Summarize the three levels and the tool of each.",
     "Behavior: challenge sets وCheckList. Representations: probing مع control task. Mechanisms: patching وablation وcircuits وSAEs. والـ attribution بيقول أنهي tokens أثّرت (تقريبي).",
     "Behavior: challenge sets and CheckList. Representations: probing with a control task. Mechanisms: patching, ablation, circuits and SAEs. Attribution says which tokens mattered (approximate)."),
  CF("إيه المعادلات الأربعة اللي لازم تفتكرها من المحاضرة؟","Which four equations should you remember from the lecture?",
     "selectivity = task acc - control acc. effect = (P_patch - P_corr) / (P_clean - P_corr). مجموع IG = f(x) - f(baseline). SAE loss = ||x - x_hat||² + lambda * ||f||_1.",
     "selectivity = task acc - control acc. effect = (P_patch - P_corr) / (P_clean - P_corr). The IG sum = f(x) - f(baseline). SAE loss = ||x - x_hat||² + lambda * ||f||_1.")
 ]}
]}
);

})();
