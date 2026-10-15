/* Lecture 10: Post-training: Instruction Tuning & RLHF
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L10 fig: pretrained model to assistant */
function postFig(){
  var s='',Y=[14,84,154],TT=['pretrained LM','SFT','RLHF / DPO'],SU=['next-word prediction','demonstrations','human preferences'],NO=['knows language','follows instructions','helpful and safer'],i;
  for(i=0;i<3;i++){
    s+=RECT(14,Y[i],180,46,i===0?'var(--sf)':'var(--acs)',i===0?'var(--mu)':'var(--ac)',10,1.8)+
       T(104,Y[i]+20,TT[i],'tb','middle','font-size:12px')+T(104,Y[i]+36,SU[i],'tm','middle','font-size:10.5px');
    s+=T(206,Y[i]+27,NO[i],i===2?'tb':'tm','start','font-size:11px'+(i===2?';fill:var(--ok)':''));
    if(i<2)s+=AL(104,Y[i]+46,104,Y[i+1]-1,'ac','mA');
  }
  return s;
}

var FIG_POST=fig(214,postFig(),
  B('المراحل الثلاثة: الـ pretraining بيدي الموديل اللغة والمعرفة، والـ SFT بيعلّمه يتبع التعليمات، والـ preference tuning بيخلّي إجاباته أفيد وأأمن.',
    'The three stages: pretraining gives the model language and knowledge, SFT teaches it to follow instructions, and preference tuning makes its answers more helpful and safer.'));

/* L10 fig: SFT loss mask */
function sftFig(){
  var P=['Capital','of','France','?'],R=['Paris','.','&lt;eos&gt;'],s='',i,x;
  s+=T(14,18,'prompt: no loss','tm','start','font-size:11px');
  for(i=0;i<4;i++){x=14+i*80;s+=RECT(x,26,72,32,'var(--sf)','var(--ln)',7,1.6)+T(x+36,47,P[i],'tm','middle','font-size:11px');}
  s+=T(14,92,'response: loss computed','tb','start','font-size:11px;fill:var(--ok)');
  for(i=0;i<3;i++){x=14+i*80;s+=RECT(x,100,72,32,'var(--okbg)','var(--ok)',7,1.8)+T(x+36,121,R[i],'tb','middle','font-size:11px');}
  s+=RECT(14,150,332,34,'var(--sf)','var(--ln)',8,1.2)+T(180,171,'loss = mean over response tokens only','tb','middle','font-size:11px');
  return s;
}

var FIG_SFT=fig(198,sftFig(),
  B('بنحسب الـ loss على كلمات الإجابة بس. كلمات السؤال بتدخل كسياق من غير loss.',
    'The loss is computed on the answer tokens only. The question tokens enter as context with no loss.'));

/* L10 fig: reward model on a preference pair */
function rmFig(){
  var s='';
  s+=RECT(10,20,110,40,'var(--okbg)','var(--ok)',9,1.8)+T(65,37,'answer A','tb','middle','font-size:11.5px')+T(65,52,'(preferred)','tm','middle','font-size:10px');
  s+=RECT(10,86,110,40,'var(--nobg)','var(--no)',9,1.8)+T(65,103,'answer B','tb','middle','font-size:11.5px')+T(65,118,'(rejected)','tm','middle','font-size:10px');
  s+=RECT(150,46,80,60,'var(--acs)','var(--ac)',10,1.8)+T(190,72,'reward','tb','middle','font-size:11.5px')+T(190,88,'model','tb','middle','font-size:11.5px');
  s+=AL(120,40,148,64,'mu','mM')+AL(120,106,148,88,'mu','mM');
  s+=AL(232,64,262,42,'ok','mG')+AL(232,88,262,108,'no','mN');
  s+=T(266,46,'r_A = 2.0','tb','start','font-size:11.5px;fill:var(--ok)')+T(266,116,'r_B = 0.5','tb','start','font-size:11.5px;fill:var(--no)');
  s+=RECT(10,148,340,46,'var(--sf)','var(--ln)',8,1.2)+T(180,168,'P(A &gt; B) = sigmoid(2.0 - 0.5) = 0.82','tb','middle','font-size:11px')+T(180,185,'loss = -log(0.82) = 0.20','tm','middle','font-size:11px');
  return s;
}

var FIG_RM=fig(206,rmFig(),
  B('الـ reward model بياخد كل إجابة ويطلّع درجة. بنتدرّب بحيث درجة الإجابة المفضّلة تبقى أعلى من المرفوضة.',
    'The reward model takes each answer and outputs a score. We train it so the preferred answer scores higher than the rejected one.'));

/* L10 fig: RLHF loop */
function rlhfFig(){
  var s='';
  s+=RECT(10,16,72,30,'var(--sf)','var(--ln)',8,1.6)+T(46,35,'prompt x','tb','middle','font-size:11px');
  s+=AL(82,31,120,31,'mu','mM');
  s+=RECT(122,16,104,30,'var(--acs)','var(--ac)',8,1.8)+T(174,35,'policy π_θ','tb','middle','font-size:11px');
  s+=AL(226,31,262,31,'mu','mM');
  s+=RECT(264,16,86,30,'var(--sf)','var(--ln)',8,1.6)+T(307,35,'response y','tb','middle','font-size:11px');
  s+=AL(307,46,307,92,'mu','mM');
  s+=RECT(264,94,86,30,'var(--sf)','var(--ok)',8,1.8)+T(307,113,'reward r','tb','middle','font-size:11px');
  s+=RECT(122,94,104,30,'var(--sf)','var(--no)',8,1.8)+T(174,113,'ref π_ref','tb','middle','font-size:11px');
  s+=AL(268,46,214,92,'mu','mM',true);
  s+=RECT(100,166,160,30,'var(--sf)','var(--ac)',8,1.8)+T(180,185,'r - β KL','tb','middle','font-size:11.5px');
  s+=AL(296,124,250,166,'ok','mG')+AL(174,124,174,166,'no','mN');
  s+='<path d="M100 181 H18 V64 H150 V48" style="fill:none;stroke:var(--ac);stroke-width:2" marker-end="url(#mA)"/>';
  s+=T(26,128,'update θ','tm','start','font-size:10.5px')+T(26,142,'(PPO)','tm','start','font-size:10.5px');
  return s;
}

var FIG_RLHF=fig(212,rlhfFig(),
  B('الـ policy بيولّد إجابة، والـ reward model بيدّيها درجة، والـ reference model بيقيس قد إيه الـ policy بعد عنه (KL). الصافي (reward ناقص KL) هو اللي بيحدّث الـ policy.',
    'The policy generates an answer, the reward model scores it, and the reference model measures how far the policy has drifted (KL). The net (reward minus KL) updates the policy.'));

/* L10 fig: RLHF versus DPO pipelines */
function dpoFig(){
  var s='',L=['1. train reward model','2. sample from policy','3. PPO loop + KL'],R=['fixed preference pairs','one supervised loss','frozen reference model'],i,y;
  s+=T(90,18,'RLHF (PPO)','tb','middle','font-size:12px')+T(270,18,'DPO','tb','middle','font-size:12px');
  for(i=0;i<3;i++){
    y=30+i*44;
    s+=RECT(10,y,160,34,'var(--sf)','var(--no)',8,1.6)+T(90,y+21,L[i],'','middle','font-size:10.5px');
    s+=RECT(190,y,160,34,'var(--sf)','var(--ok)',8,1.6)+T(270,y+21,R[i],'','middle','font-size:10.5px');
  }
  s+=T(90,172,'4 models in memory','tm','middle','font-size:11px')+T(270,172,'2 models, no sampling','tb','middle','font-size:11px;fill:var(--ok)');
  return s;
}

var FIG_DPO=fig(188,dpoFig(),
  B('الـ RLHF محتاج reward model وعينات من الـ policy وحلقة PPO. الـ DPO بيعمل loss واحد على أزواج التفضيل الثابتة.',
    'RLHF needs a reward model, samples from the policy and a PPO loop. DPO applies a single loss to fixed preference pairs.'));

/* L10 fig: reward hacking (Goodhart) */
function goodFig(){
  var s='',x0=44,y0=190,W=296,H=150,i,t,pr=[],tr=[],f=function(v){return (y0-v/0.9*H*0.92).toFixed(1);};
  s+='<line x1="'+x0+'" y1="'+y0+'" x2="'+(x0+W)+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>'+
     '<line x1="'+x0+'" y1="'+(y0-H)+'" x2="'+x0+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>';
  for(i=0;i<=40;i++){
    t=i/40;
    pr.push((x0+t*W).toFixed(1)+','+f(0.9*Math.sqrt(t)));
    tr.push((x0+t*W).toFixed(1)+','+f(0.9*Math.sqrt(t)-0.75*t));
  }
  s+='<polyline points="'+pr.join(' ')+'" style="fill:none;stroke:var(--ac);stroke-width:2.4"/>';
  s+='<polyline points="'+tr.join(' ')+'" style="fill:none;stroke:var(--ok);stroke-width:2.4"/>';
  s+=DOT(x0+0.36*W,f(0.27),'ink',4.5)+T(x0+0.36*W+8,+f(0.27)-8,'best point','tb','start','font-size:11px');
  s+=T(x0+8,y0-H+10,'reward model score','tb','start','font-size:11px;fill:var(--ac)')+T(x0+8,y0-H+26,'true quality','tb','start','font-size:11px;fill:var(--ok)');
  s+=T(x0+W,y0+16,'KL from reference →','tm','end','font-size:11px')+T(x0+4,y0-H-6,'score','tm','start','font-size:11px');
  s+=T(x0+W-4,+f(0.45)+4,'reward hacking','tb','end','font-size:11px;fill:var(--no)');
  return s;
}

var FIG_GOOD=fig(222,goodFig(),
  B('كل ما الـ policy يبعد عن الـ reference، درجة الـ reward model بتفضل تطلع، لكن الجودة الحقيقية بتوصل لقمة وبعدين بتنزل. الشكل توضيحي.',
    'As the policy drifts from the reference, the reward model score keeps rising, but true quality peaks and then falls. The shape is illustrative.'));

/* L10 fig: length bias (illustrative numbers) */
function lenFig(){
  var s='';
  s+=T(180,34,'model B writes answers about 2x longer','tm','middle','font-size:10.5px');
  s+='<line x1="30" y1="130" x2="340" y2="130" style="stroke:var(--mu);stroke-width:1.5"/>';
  s+=RECT(70,66,80,64,'var(--ac)','none',6)+T(110,103,'64%','tb','middle','fill:var(--bg);font-size:13px');
  s+=RECT(210,79,80,51,'var(--ok)','none',6)+T(250,109,'51%','tb','middle','fill:var(--bg);font-size:13px');
  s+='<line x1="30" y1="80" x2="340" y2="80" style="stroke:var(--mu);stroke-width:1.4;stroke-dasharray:5 4"/>';
  s+=T(338,73,'50% = equal quality','tm','end','font-size:10px');
  s+=T(110,148,'raw win rate','tm','middle','font-size:11px')+T(250,148,'length-controlled','tm','middle','font-size:11px');
  return s;
}

var FIG_LEN=fig(160,lenFig(),
  B('أرقام توضيحية: الموديل B كسب 64% في الـ win rate العادي، لكن لما ضبطنا تأثير الطول نزلت النسبة لـ 51%، يعني تقريبًا كل الفرق كان طول مش جودة.',
    'Illustrative numbers: model B wins 64% in the raw win rate, but once we control for length the rate drops to 51%, so almost all of the gap was length, not quality.'));

/* L10 fig: red-teaming loop */
function safeFig(){
  var s='',X=[10,134,258],W=92,H=38,Y1=22,Y2=100;
  function bx(x,y,l1,l2,st,fl){return RECT(x,y,W,H,fl,st,9,1.8)+T(x+W/2,y+16,l1,'tb','middle','font-size:11px')+T(x+W/2,y+30,l2,'tm','middle','font-size:10px');}
  s+=bx(X[0],Y1,'red team','humans + LMs','var(--no)','var(--sf)');
  s+=bx(X[1],Y1,'model','answers','var(--ac)','var(--acs)');
  s+=bx(X[2],Y1,'harm check','raters / judge','var(--ln)','var(--sf)');
  s+=bx(X[2],Y2,'new data','refusals, pairs','var(--ok)','var(--okbg)');
  s+=bx(X[1],Y2,'retrain','SFT, DPO, RLHF','var(--ac)','var(--acs)');
  s+=bx(X[0],Y2,'safer model','repeat attacks','var(--ok)','var(--okbg)');
  s+=AR(X[0]+W,Y1+H/2,X[1],Y1+H/2,'mu','mM')+AR(X[1]+W,Y1+H/2,X[2],Y1+H/2,'mu','mM');
  s+=AR(X[2]+W/2,Y1+H,X[2]+W/2,Y2,'mu','mM');
  s+=AR(X[2],Y2+H/2,X[1]+W,Y2+H/2,'mu','mM')+AR(X[1],Y2+H/2,X[0]+W,Y2+H/2,'mu','mM');
  s+=AR(X[0]+W/2,Y2,X[0]+W/2,Y1+H,'no','mN');
  s+=T(X[0]+W/2+10,Y1+H+(Y2-Y1-H)/2+4,'attack again','tm','start','font-size:10px');
  s+=RECT(10,152,340,30,'var(--sf)','var(--ln)',8,1.2)+T(180,171,'refuse harmful requests, answer harmless ones','tb','middle','font-size:10.5px');
  return s;
}

var FIG_SAFE=fig(190,safeFig(),
  B('حلقة الـ red-teaming: بنهاجم الموديل، بنقيّم الردود، بنحوّل الهجمات الناجحة لداتا تدريب، وبعدين بنهاجم النسخة الأحدث تاني.',
    'The red-teaming loop: attack the model, judge the responses, turn successful attacks into training data, then attack the new version again.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:10,t:B("Post-training: Instruction Tuning و RLHF","Post-training: Instruction Tuning & RLHF"),cards:[

{id:"l10-assistant",t:B("من pretrained model لـ assistant","From a pretrained model to an assistant"),
 b:cat(B('<p>الموديل بعد الـ pretraining اتعلّم حاجة واحدة: يكمّل النص. لو كتبت له \"اشرحلي الجاذبية لطفل\" ممكن يكمّل بسؤال تاني شبهه (كأنه بيكمّل ورقة امتحان) بدل ما يجاوب، لأن ده الأرجح إحصائيًا في النصوص اللي اتدرّب عليها. يعني <mark>عنده المعرفة بس مش بيعرف إنت عايز إيه</mark>.</p>'+
         '<p>الـ <mark>post-training</mark> هو اللي بيحوّله لـ assistant بيتبع التعليمات وبيجاوب بشكل مفيد وأمين وآمن (<mark>helpful, honest, harmless</mark>). بيتم على مرحلتين بعد الـ pretraining:</p>',
         '<p>After pretraining, the model has learned one thing: continue the text. If you write \"explain gravity to a child\" it may continue with another similar question (as if completing an exam sheet) instead of answering, because that is statistically the most likely continuation in its training text. So <mark>it has the knowledge but does not know what you want</mark>.</p>'+
         '<p><mark>Post-training</mark> turns it into an assistant that follows instructions and answers in a helpful, honest and safe way (<mark>helpful, honest, harmless</mark>). It happens in two stages after pretraining:</p>'),
       FIG_POST,
       B('<p>1. <mark>SFT</mark> (supervised fine-tuning): نتدرّب على أمثلة إجابات كويسة مكتوبة.<br>2. <mark>Preference tuning</mark> (RLHF أو DPO): نتدرّب على تفضيلات البشر بين إجابتين.</p>'+
         '<p>أشهر نتيجة جات من ورقة <mark>InstructGPT</mark> (2022): موديل 1.3B بعد الـ post-training فضّله المقيّمون على GPT-3 بحجم 175B على الـ prompts اللي اتجرّبت، رغم إنه أصغر بأكتر من 100 مرة. وكمان تكلفة الـ post-training كانت جزء صغير من حساب الـ pretraining (حوالي 2% في الورقة). يعني مش بنضيف معرفة جديدة كتير، بنغيّر <mark>السلوك</mark>.</p>',
         '<p>1. <mark>SFT</mark> (supervised fine-tuning): train on examples of good written answers.<br>2. <mark>Preference tuning</mark> (RLHF or DPO): train on human preferences between two answers.</p>'+
         '<p>The best-known result came from the <mark>InstructGPT</mark> paper (2022): a 1.3B model after post-training was preferred by raters over the 175B GPT-3 on the tested prompts, even though it was more than 100 times smaller. And the post-training compute was a small part of the pretraining compute (about 2% in the paper). So we do not add much new knowledge; we change the <mark>behavior</mark>.</p>')),
 q:[
   CQ("ليه الـ pretrained model لوحده مش assistant كويس؟","Why is a pretrained model alone not a good assistant?",
      [["لأنه ملوش attention","Because it has no attention"],["لأنه اتدرّب يكمّل النص، مش يتبع التعليمات","Because it was trained to continue text, not to follow instructions"],["لأنه صغير جدًا دايمًا","Because it is always too small"],["لأنه مش بيعرف لغة","Because it does not know language"]],
      1,"هدف التدريب هو الكلمة التالية، فالإجابة اللي بتحقق التعليمات مش بالضرورة هي الأرجح.","The training objective is the next word, so the answer that satisfies the instruction is not necessarily the most likely one."),
   CQ("موديل pretrained اتسأل 'Translate to French: cheese' فكمّل بـ 'Translate to German: bread'. أنهي مرحلة بتصلّح السلوك ده؟","A pretrained model was asked 'Translate to French: cheese' and continued with 'Translate to German: bread'. Which stage fixes this behavior?",
   [["pretraining لفترة أطول بس","Just pretraining for longer"],["تصغير الـ vocabulary","Shrinking the vocabulary"],["SFT على أزواج (تعليمة، إجابة)","SFT on (instruction, answer) pairs"],["تقليل الـ learning rate","Lowering the learning rate"]],
   2,"الموديل بيكمّل النص الأرجح. الـ SFT بيعلّمه إن بعد التعليمة بييجي تنفيذها.","The model continues the most likely text. SFT teaches it that an instruction is followed by carrying it out.")
 ],
 f:[
   CF("إيه مراحل الـ post-training؟","What are the stages of post-training?",
      "SFT على أمثلة إجابات كويسة، وبعدها preference tuning (RLHF أو DPO) على تفضيلات البشر. بيغيّر السلوك مش المعرفة.","SFT on examples of good answers, then preference tuning (RLHF or DPO) on human preferences. It changes behavior, not knowledge."),
   CF("ليه الـ pretrained model ممكن يكمّل السؤال بسؤال تاني؟","Why might a pretrained model continue a question with another question?",
   "لأنه اتدرّب يتنبأ بالكلمة التالية، والتكملة الأرجح إحصائيًا مش بالضرورة إجابة. عنده المعرفة بس مش عارف المطلوب.","Because it was trained to predict the next word, and the statistically likeliest continuation is not necessarily an answer. It has the knowledge but does not know what is wanted.")
 ],
 terms:[
   {t:B("Post-training","Post-training"),
    d:B("المراحل اللي بعد الـ pretraining (SFT و preference tuning) وبتحوّل الموديل لـ assistant بيتبع التعليمات.","The stages after pretraining (SFT and preference tuning) that turn the model into an assistant that follows instructions.")},
   {t:B("Preference tuning","Preference tuning"),
    d:B("تدريب على تفضيلات البشر بين إجابتين (RLHF أو DPO).","Training on human preferences between two answers (RLHF or DPO).")},
   {t:B("HHH (helpful, honest, harmless)","HHH (helpful, honest, harmless)"),
    d:B("هدف الـ assistant: يساعد، يكون أمين، وما يضرّش.","The assistant goal: be helpful, honest and harmless.")}
 ]},

{id:"l10-sft",t:B("Instruction tuning (الـ SFT)","Instruction tuning (SFT)"),
 b:cat(B('<p>الـ <mark>instruction tuning</mark> هو fine-tuning عادي على أزواج <code>(instruction, response)</code>. نفس الـ loss بتاع الـ language model، بس بنحسبه على <mark>كلمات الإجابة بس</mark>، وكلمات السؤال بتدخل كسياق من غير loss:</p>'+
         '<div class="m">loss = - (1 / |response|) * sum over response tokens\n      log P(token | instruction, previous tokens)</div>',
         '<p><mark>Instruction tuning</mark> is ordinary fine-tuning on <code>(instruction, response)</code> pairs. It uses the same language-model loss, but computed on the <mark>answer tokens only</mark>, while the question tokens enter as context with no loss:</p>'+
         '<div class="m">loss = - (1 / |response|) * sum over response tokens\n      log P(token | instruction, previous tokens)</div>'),
       FIG_SFT,
       B('<p>مثال: السؤال 4 tokens والإجابة 3 tokens، فالـ loss هو متوسط على الـ 3 بس.</p>'+
         '<p>الداتا بتيجي من 3 مصادر:<br>• <mark>بشر بيكتبوا</mark> (InstructGPT استخدمت حوالي 13 ألف مثال): جودة عالية وتكلفة عالية.<br>• <mark>تحويل مهام NLP موجودة</mark> لصيغة تعليمات (FLAN و T0، آلاف المهام): التدريب على مهام كتير بيخلّي الموديل يعمّم على مهام ما شافهاش.<br>• <mark>داتا اصطناعية</mark> من موديل أقوى (Self-Instruct و Alpaca): رخيصة بس بتورّث أخطاء الموديل اللي ولّدها.</p>'+
         '<p>ورقة <mark>LIMA</mark> لقت إن حوالي 1,000 مثال مختارة بعناية كانت كفاية لموديل كويس. الفكرة المقترحة: المعرفة جاية من الـ pretraining، والـ SFT بيعلّم <mark>الشكل والأسلوب</mark> بس.</p>'+
         '<p>حدود الـ SFT: بيتعلم يقلّد. لو بنتدرّب على إجابات فيها معلومات الموديل ما يعرفهاش، بيتعلم يألّف إجابات بنفس الثقة (<mark>hallucination</mark>). وكمان كتابة إجابات مثالية صعبة ومكلفة، بينما <mark>المقارنة بين إجابتين أسهل</mark>، وده اللي بيمهّد للكارت الجاي.</p>',
         '<p>An example: the question has 4 tokens and the answer 3 tokens, so the loss is the average over the 3 only.</p>'+
         '<p>The data comes from 3 sources:<br>• <mark>Humans writing</mark> (InstructGPT used about 13 thousand examples): high quality, high cost.<br>• <mark>Converting existing NLP tasks</mark> to instruction format (FLAN and T0, thousands of tasks): training on many tasks makes the model generalize to tasks it has not seen.<br>• <mark>Synthetic data</mark> from a stronger model (Self-Instruct and Alpaca): cheap, but it inherits the errors of the model that generated it.</p>'+
         '<p>The <mark>LIMA</mark> paper found that about 1,000 carefully chosen examples were enough for a good model. The suggested idea: knowledge comes from pretraining, and SFT teaches only the <mark>format and style</mark>.</p>'+
         '<p>The limits of SFT: it learns to imitate. If we train on answers containing facts the model does not know, it learns to make up answers with the same confidence (<mark>hallucination</mark>). Also, writing ideal answers is hard and expensive, while <mark>comparing two answers is easier</mark>, which leads to the next card.</p>')),
 q:[
   CQ("في الـ SFT، الـ loss بيتحسب على إيه؟","In SFT, what is the loss computed on?",
      [["كل الـ tokens في السؤال والإجابة","All tokens in the question and the answer"],["كلمات السؤال بس","The question tokens only"],["أول token بس","Only the first token"],["كلمات الإجابة بس","The answer tokens only"]],
      3,"الموديل بيتعلم يولّد الإجابة، فبنعمل mask لكلمات السؤال وبنحسب الـ loss على الإجابة.","The model learns to generate the answer, so we mask the question tokens and compute the loss on the answer."),
   CQ("الـ log-probs السالبة على tokens الإجابة الأربعة مجموعها 6.0 (والسؤال 10 tokens). كام الـ loss المتوسط في الـ SFT؟","The negative log-probs on the 4 answer tokens sum to 6.0 (the question has 10 tokens). What is the SFT mean loss?",
   [["1.5","1.5"],["0.43","0.43"],["0.6","0.6"],["6.0","6.0"]],
   0,"بنقسم على عدد tokens الإجابة بس: 6.0 / 4 = 1.5. لو قسمنا على الـ 14 كلها هنغلط (0.43).","We divide by the answer tokens only: 6.0 / 4 = 1.5. Dividing by all 14 would be wrong (0.43).")
 ],
 f:[
   CF("إيه هو الـ instruction tuning وإيه حدوده؟","What is instruction tuning and what are its limits?",
      "fine-tuning على أزواج (تعليمة، إجابة) بـ loss على الإجابة بس. بيعلّم الشكل والأسلوب، لكنه بيقلّد، وممكن يعلّم الموديل يألّف لو الإجابات برا معرفته.","Fine-tuning on (instruction, answer) pairs with the loss on the answer only. It teaches format and style, but it imitates, and can teach the model to make things up if answers are beyond its knowledge."),
   CF("إيه مصادر داتا الـ SFT التلاتة؟","What are the three sources of SFT data?",
   "بشر بيكتبوا (جودة وتكلفة عاليتين)، تحويل مهام NLP موجودة لتعليمات (FLAN و T0)، وداتا اصطناعية من موديل أقوى (Self-Instruct و Alpaca).","Humans writing (high quality and cost), converting existing NLP tasks to instructions (FLAN and T0), and synthetic data from a stronger model (Self-Instruct and Alpaca).")
 ],
 terms:[
   {t:B("SFT (supervised fine-tuning)","SFT (supervised fine-tuning)"),
    d:B("تدريب بإشراف على أمثلة إجابات كويسة مكتوبة.","Supervised training on written examples of good answers.")},
   {t:B("Instruction tuning","Instruction tuning"),
    d:B("SFT على أزواج <code>(instruction, response)</code> علشان الموديل يتبع التعليمات.","SFT on <code>(instruction, response)</code> pairs so the model follows instructions.")},
   {t:B("Loss masking","Loss masking"),
    d:B("كلمات السؤال بتدخل كسياق من غير loss، والـ loss بيتحسب على الإجابة بس.","The question tokens enter as context with no loss, and the loss is computed on the answer only.")},
   {t:B("Hallucination","Hallucination"),
    d:B("الموديل بيألّف إجابة غلط بنفس ثقة الإجابة الصح.","The model makes up a wrong answer with the same confidence as a right one.")}
 ]},

{id:"l10-rewardmodel",t:B("بيانات التفضيل والـ reward model","Preference data and the reward model"),
 b:cat(B('<p>بدل ما نطلب من البشر يكتبوا الإجابة المثالية، بنطلب منهم <mark>يقارنوا</mark>: بنولّد إجابتين (أو أكتر) لنفس الـ prompt، والمقيّم يختار الأحسن. بنطلع بأزواج <code>(x, y_w, y_l)</code>: الـ prompt، والإجابة الأفضل (winner)، والأسوأ (loser). المقيّمين مش دايمًا متفقين، فالـ labels فيها ضوضاء.</p>'+
         '<p>بنتدرّب <mark>reward model</mark> يطلّع درجة واحدة لأي إجابة. بنبدأ من الـ SFT model ونبدّل الـ LM head بطبقة خطية بتطلّع رقم واحد (scalar). والـ loss مبني على نموذج <mark>Bradley-Terry</mark>:</p>'+
         '<div class="m">P(y_w beats y_l) = sigmoid( r(x, y_w) - r(x, y_l) )\nloss = - log sigmoid( r(x, y_w) - r(x, y_l) )</div>',
         '<p>Instead of asking humans to write the ideal answer, we ask them to <mark>compare</mark>: we generate two (or more) answers for the same prompt, and the rater picks the better one. We get pairs <code>(x, y_w, y_l)</code>: the prompt, the winning answer, and the losing one. Raters do not always agree, so the labels are noisy.</p>'+
         '<p>We train a <mark>reward model</mark> that outputs one score for any answer. We start from the SFT model and replace the LM head with a linear layer that outputs a single number (a scalar). The loss is based on the <mark>Bradley-Terry</mark> model:</p>'+
         '<div class="m">P(y_w beats y_l) = sigmoid( r(x, y_w) - r(x, y_l) )\nloss = - log sigmoid( r(x, y_w) - r(x, y_l) )</div>'),
       FIG_RM,
       B('<p>مثال بأرقام: لو <code>r_w = 2.0</code> و <code>r_l = 0.5</code> يبقى الفرق 1.5 و <code>sigmoid(1.5) = 0.82</code> والـ loss هو <code>-log(0.82) = 0.20</code>. لو الموديل بيدي الاتنين نفس الدرجة: الاحتمال 0.5 والـ loss هو <code>0.69</code>. ولو الترتيب معكوس (<code>r_w = 0.5</code> و <code>r_l = 2.0</code>) الـ loss بيطلع حوالي 1.70، يعني عقاب كبير على الغلط.</p>'+
         '<p>لاحظ إن الـ reward model بيتعلم <mark>الترتيب</mark> مش قيمة مطلقة: الفرق بين الدرجتين هو اللي مهم.</p>',
         '<p>A numeric example: if <code>r_w = 2.0</code> and <code>r_l = 0.5</code> the difference is 1.5, <code>sigmoid(1.5) = 0.82</code> and the loss is <code>-log(0.82) = 0.20</code>. If the model gives both the same score: the probability is 0.5 and the loss is <code>0.69</code>. And if the order is reversed (<code>r_w = 0.5</code> and <code>r_l = 2.0</code>) the loss is about 1.70, a large penalty for being wrong.</p>'+
         '<p>Note that the reward model learns the <mark>ranking</mark>, not an absolute value: the difference between the two scores is what matters.</p>')),
 q:[
   CQ("لو الـ reward model أدّى نفس الدرجة للإجابتين، احتمال إن الأولى أحسن بيطلع كام؟","If the reward model gives both answers the same score, what probability does it assign to the first being better?",
      [["0.5","0.5"],["0","0"],["1","1"],["0.82","0.82"]],
      0,"sigmoid(0) = 0.5: الموديل مش قادر يفرّق بينهم.","sigmoid(0) = 0.5: the model cannot tell them apart."),
   CQ("الـ reward model أدّى r_w = 1.0 و r_l = 3.0 (ترتيب غلط). الـ loss تقريبًا كام؟","The reward model gave r_w = 1.0 and r_l = 3.0 (the wrong order). Roughly what is the loss?",
   [["0.13","0.13"],["0.69","0.69"],["0.88","0.88"],["2.13","2.13"]],
   3,"الفرق -2 و sigmoid(-2) = 0.12 فالـ loss = -log(0.12) = 2.13. ولو الترتيب كان صح (+2) كان هيبقى 0.13.","The difference is -2, sigmoid(-2) = 0.12, so the loss is -log(0.12) = 2.13. With the right order (+2) it would be 0.13.")
 ],
 f:[
   CF("إزاي بنتدرّب الـ reward model؟","How do we train the reward model?",
      "من أزواج تفضيل (winner, loser) بـ loss = -log sigmoid(r_w - r_l)، فدرجة الإجابة الأفضل تبقى أعلى.","From preference pairs (winner, loser) with loss = -log sigmoid(r_w - r_l), so the better answer gets a higher score."),
   CF("إيه شكل الـ reward model وإزاي بنبنيه؟","What does the reward model look like and how do we build it?",
   "بنبدأ من الـ SFT model ونبدّل الـ LM head بطبقة خطية بتطلّع رقم واحد (scalar) لكل إجابة.","We start from the SFT model and replace the LM head with a linear layer that outputs a single number (a scalar) for each answer.")
 ],
 terms:[
   {t:B("Reward model","Reward model"),
    d:B("موديل بياخد prompt وإجابة ويطلّع درجة واحدة (scalar) بتعبّر عن تفضيل البشر.","A model that takes a prompt and an answer and outputs one score (a scalar) that reflects human preference.")},
   {t:B("Preference pair","Preference pair"),
    d:B("<code>(x, y_w, y_l)</code>: الـ prompt، والإجابة الأفضل (winner)، والأسوأ (loser).","<code>(x, y_w, y_l)</code>: the prompt, the winning answer and the losing answer.")},
   {t:B("Bradley-Terry model","Bradley-Terry model"),
 d:B("نموذج احتمالي للمقارنات: <code>P(A beats B) = sigmoid(r_A - r_B)</code>.","A probabilistic model of comparisons: <code>P(A beats B) = sigmoid(r_A - r_B)</code>.")}
 ]},

{id:"l10-ppo",t:B("RLHF بـ PPO","RLHF with PPO"),
 b:cat(B('<p>دلوقتي عندنا reward model نقدر نستخدمه كمعلّم. الـ <mark>RLHF</mark> بيعدّل الـ policy (الموديل نفسه، <code>pi_theta</code>) عشان يطلّع إجابات بدرجة أعلى. لو كبّرنا الـ reward بس، الموديل هيلاقي إجابات غريبة بتخدع الـ reward model. فبنضيف <mark>عقوبة KL</mark> بتبقّيه قريب من الـ reference (الـ SFT model):</p>'+
         '<div class="m">maximize  E [ r(x, y) - beta * log( pi_theta(y|x) / pi_ref(y|x) ) ]</div>',
         '<p>Now we have a reward model we can use as a teacher. <mark>RLHF</mark> adjusts the policy (the model itself, <code>pi_theta</code>) so it produces answers with higher scores. If we only maximize the reward, the model will find strange answers that fool the reward model. So we add a <mark>KL penalty</mark> that keeps it close to the reference (the SFT model):</p>'+
         '<div class="m">maximize  E [ r(x, y) - beta * log( pi_theta(y|x) / pi_ref(y|x) ) ]</div>'),
       FIG_RLHF,
       B('<p>مثال: <code>r = 3.0</code> و <code>beta = 0.1</code> وlog النسبة بين الـ policy والـ reference هو 5. الصافي <code>3.0 - 0.1 * 5 = 2.5</code>. لو الموديل بعد كتير عن الـ reference (log النسبة 40) الصافي <code>3.0 - 4.0 = -1.0</code>: العقوبة أكبر من المكسب. وكمان الـ KL بيحافظ على سلاسة اللغة.</p>'+
         '<p>التحديث نفسه بيتم بـ <mark>PPO</mark> (policy gradient بخطوات محسوبة). بنحسب <mark>advantage</mark> A: قد إيه الإجابة أحسن من المتوقع، وبنقصّ نسبة التغيير:</p>'+
         '<div class="m">ratio = pi_new(y|x) / pi_old(y|x)\nL = min( ratio * A , clip(ratio, 1-eps, 1+eps) * A )</div>'+
         '<p>مثال: <code>ratio = 1.5</code> و <code>A = 2</code> و <code>eps = 0.2</code> يعني <code>min(3.0, 1.2 * 2 = 2.4) = 2.4</code>: التحديث اتقصّ عشان ما نبعدش كتير مرة واحدة.</p>',
         '<p>An example: <code>r = 3.0</code>, <code>beta = 0.1</code> and the log ratio between policy and reference is 5. The net is <code>3.0 - 0.1 * 5 = 2.5</code>. If the model drifts far (log ratio 40) the net is <code>3.0 - 4.0 = -1.0</code>: the penalty outweighs the gain. The KL also preserves fluent language.</p>'+
         '<p>The update itself uses <mark>PPO</mark> (policy gradient with controlled steps). We compute the <mark>advantage</mark> A: how much better the answer is than expected, and we clip the size of the change:</p>'+
         '<div class="m">ratio = pi_new(y|x) / pi_old(y|x)\nL = min( ratio * A , clip(ratio, 1-eps, 1+eps) * A )</div>'+
         '<p>An example: <code>ratio = 1.5</code>, <code>A = 2</code> and <code>eps = 0.2</code> gives <code>min(3.0, 1.2 * 2 = 2.4) = 2.4</code>: the update was clipped so we do not move too far at once.</p>')),
 q:[
   CQ("إيه وظيفة عقوبة الـ KL في الـ RLHF؟","What does the KL penalty do in RLHF?",
      [["بتسرّع التوليد","It speeds up generation"],["بتزوّد الـ reward دايمًا","It always increases the reward"],["بتخلّي الـ policy قريب من الـ reference فما يخدعش الـ reward model","It keeps the policy near the reference so it does not fool the reward model"],["بتحذف الـ reward model","It removes the reward model"]],
      2,"من غيرها الموديل بيبعد ويلاقي إجابات بتاخد درجة عالية بس مش كويسة فعلًا.","Without it the model drifts and finds answers that score high but are not actually good."),
   CQ("r = 2.0 و beta = 0.05 و log النسبة بين الـ policy والـ reference = 20. كام الصافي (reward ناقص KL)؟","r = 2.0, beta = 0.05 and the log ratio between the policy and the reference = 20. What is the net (reward minus KL)?",
   [["2.0","2.0"],["1.0","1.0"],["-18","-18"],["1.95","1.95"]],
   1,"2.0 - 0.05 * 20 = 2.0 - 1.0 = 1.0.","2.0 - 0.05 * 20 = 2.0 - 1.0 = 1.0.")
 ],
 f:[
   CF("إيه هدف الـ RLHF وإيه عيبه العملي؟","What is the RLHF objective and its practical drawback?",
      "نكبّر reward ناقص beta * KL من الـ reference بـ PPO. العيب: 4 موديلات في الذاكرة، وتوليد أثناء التدريب، وضبط حساس.","Maximize reward minus beta * KL from the reference using PPO. The drawback: 4 models in memory, generation during training, and sensitive tuning."),
   CF("إيه معنى الـ clipping في PPO؟","What does clipping mean in PPO?",
   "بنقصّ نسبة pi_new / pi_old جوه المدى [1 - eps, 1 + eps] علشان التحديث الواحد ما يبعدش كتير عن الـ policy القديم.","We clip the ratio pi_new / pi_old into the range [1 - eps, 1 + eps] so a single update does not move too far from the old policy.")
 ],
 terms:[
   {t:B("RLHF","RLHF"),
    d:B("Reinforcement Learning from Human Feedback: تعديل الـ policy علشان يكبّر درجة الـ reward model مع عقوبة KL.","Reinforcement Learning from Human Feedback: adjusting the policy to maximize the reward model score with a KL penalty.")},
   {t:B("Policy","Policy"),
    d:B("الموديل اللي بنحدّثه (<code>pi_theta</code>): بيختار الكلمة التالية، وبالتالي الإجابة.","The model we update (<code>pi_theta</code>): it picks the next word, and so the answer.")},
   {t:B("Reference model","Reference model"),
    d:B("نسخة متجمّدة (غالبًا الـ SFT model) بنقيس بُعد الـ policy عنها.","A frozen copy (usually the SFT model) used to measure how far the policy has drifted.")},
   {t:B("KL penalty","KL penalty"),
    d:B("عقوبة بتتخصم من الـ reward بقدر بُعد الـ policy عن الـ reference: <code>beta * log(pi / pi_ref)</code>.","A penalty subtracted from the reward in proportion to how far the policy is from the reference: <code>beta * log(pi / pi_ref)</code>.")},
   {t:B("PPO","PPO"),
    d:B("Proximal Policy Optimization: policy gradient بيقصّ نسبة التغيير علشان الخطوات تفضل صغيرة.","Proximal Policy Optimization: a policy gradient method that clips the change ratio to keep steps small.")},
   {t:B("Advantage","Advantage"),
    d:B("قد إيه الإجابة أحسن من المتوقع.","How much better an answer is than expected.")}
 ]},

{id:"l10-dpo",t:B("الـ DPO: التفضيل من غير RL","DPO: preferences without RL"),
 b:cat(B('<p>الـ <mark>DPO</mark> (Direct Preference Optimization) بيتجاوز الـ reward model والـ RL. الفكرة: الهدف بتاع RLHF ليه حل مغلق (closed form):</p>'+
         '<div class="m">pi*(y|x) = pi_ref(y|x) * exp( r(x,y) / beta ) / Z(x)\nso:  r(x,y) = beta * log( pi*(y|x) / pi_ref(y|x) ) + beta * log Z(x)</div>'+
         '<p>يعني الـ reward ممكن نعبّر عنه بالـ policy نفسه. لو عوّضنا في Bradley-Terry، الـ <code>Z(x)</code> بيتشال لأنه نفسه للإجابتين، ونطلع بـ loss واحد على الـ policy:</p>'+
         '<div class="m">L = - log sigmoid( beta * [ log(pi(y_w|x) / pi_ref(y_w|x))\n                   - log(pi(y_l|x) / pi_ref(y_l|x)) ] )</div>',
         '<p><mark>DPO</mark> (Direct Preference Optimization) skips the reward model and RL. The idea: the RLHF objective has a closed-form solution:</p>'+
         '<div class="m">pi*(y|x) = pi_ref(y|x) * exp( r(x,y) / beta ) / Z(x)\nso:  r(x,y) = beta * log( pi*(y|x) / pi_ref(y|x) ) + beta * log Z(x)</div>'+
         '<p>So the reward can be expressed through the policy itself. Plugging this into Bradley-Terry, <code>Z(x)</code> cancels because it is the same for both answers, and we get a single loss on the policy:</p>'+
         '<div class="m">L = - log sigmoid( beta * [ log(pi(y_w|x) / pi_ref(y_w|x))\n                   - log(pi(y_l|x) / pi_ref(y_l|x)) ] )</div>'),
       FIG_DPO,
       B('<p>الـ loss بيرفع احتمال الإجابة الأفضل بالنسبة للـ reference ويخفّض احتمال الأسوأ. مثال: <code>beta = 0.1</code>، وlog النسبة للأفضل هو <code>+2</code> وللأسوأ <code>-1</code>. الفرق 3، فالمدخل للـ sigmoid هو <code>0.3</code> و <code>sigmoid(0.3) = 0.574</code> والـ loss هو <code>0.554</code>. في البداية (policy = reference) الفرق صفر والـ loss هو <code>log 2 = 0.693</code>. كل ما الفرق يكبر الـ loss بينزل.</p>',
         '<p>The loss raises the probability of the better answer relative to the reference and lowers that of the worse one. An example: <code>beta = 0.1</code>, the log ratio for the better answer is <code>+2</code> and for the worse <code>-1</code>. The difference is 3, so the sigmoid input is <code>0.3</code>, <code>sigmoid(0.3) = 0.574</code> and the loss is <code>0.554</code>. At the start (policy = reference) the difference is zero and the loss is <code>log 2 = 0.693</code>. The larger the difference, the lower the loss.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين DPO و RLHF بـ PPO؟","What is the main difference between DPO and RLHF with PPO?",
      [["الـ DPO محتاج reward model أكبر","DPO needs a bigger reward model"],["الـ DPO بيتدرّب على أزواج التفضيل بـ loss واحد من غير reward model ولا sampling","DPO trains on preference pairs with a single loss, with no reward model or sampling"],["الـ DPO مفيهوش reference model","DPO has no reference model"],["الـ DPO بيستخدم SFT بس","DPO uses SFT only"]],
      1,"الـ reward بيتعبّر عنه ضمنيًا بنسبة الـ policy للـ reference، فمفيش حاجة لـ reward model ولا RL.","The reward is expressed implicitly through the policy-to-reference ratio, so there is no need for a reward model or RL."),
   CQ("beta = 0.1، وlog النسبة للإجابة الأفضل +3 وللأسوأ -2. الـ loss تقريبًا كام؟","beta = 0.1, the log ratio is +3 for the better answer and -2 for the worse. Roughly what is the loss?",
   [["0.69","0.69"],["0.62","0.62"],["0.47","0.47"],["0.13","0.13"]],
   2,"الفرق 5 فالمدخل 0.1 * 5 = 0.5، sigmoid(0.5) = 0.622 والـ loss = -log(0.622) = 0.47.","The difference is 5, so the input is 0.1 * 5 = 0.5, sigmoid(0.5) = 0.622 and the loss is -log(0.622) = 0.47.")
 ],
 f:[
   CF("إيه فكرة الـ DPO ومميزاتها وعيوبها؟","What is the idea of DPO, and its pros and cons?",
      "نعبّر عن الـ reward بنسبة الـ policy للـ reference فنطلع بـ loss واحد على أزواج التفضيل. بسيط وأرخص، بس offline وحساس لـ beta.","Express the reward as the policy-to-reference ratio, giving a single loss on preference pairs. Simple and cheaper, but offline and sensitive to beta."),
   CF("ليه الـ Z(x) بيتشال في الـ DPO؟","Why does Z(x) cancel in DPO?",
   "لأنه نفسه للإجابتين، فبيتلغي لما نطرح reward الإجابة الأسوأ من الأفضل جوه الـ sigmoid.","Because it is the same for both answers, so it cancels when we subtract the reward of the worse answer from the better one inside the sigmoid.")
 ],
 terms:[
   {t:B("DPO","DPO"),
    d:B("Direct Preference Optimization: تدريب الـ policy مباشرة على أزواج التفضيل بـ loss واحد، من غير reward model ولا RL.","Direct Preference Optimization: training the policy directly on preference pairs with a single loss, with no reward model or RL.")},
   {t:B("Implicit reward","Implicit reward"),
    d:B("الـ reward معبَّر عنه بالـ policy نفسه: <code>beta * log(pi / pi_ref)</code> (بعد ما <code>Z(x)</code> بيتشال).","The reward expressed through the policy itself: <code>beta * log(pi / pi_ref)</code> (once <code>Z(x)</code> cancels).")}
 ]},

{id:"l10-dpo-tradeoffs",t:B("RLHF مقابل DPO: التكلفة والمقايضات","RLHF vs DPO: cost and trade-offs"),
 b:cat(B('<p><mark>RLHF بـ PPO.</mark> العيب العملي: محتاج <mark>4 موديلات</mark> في الذاكرة (policy و reference و reward و value للـ advantage)، وتوليد عينات أثناء التدريب، وضبطه حساس وصعب.</p>'+
         '<p><mark>DPO.</mark> المميزات: بسيط (زي classification loss)، ومحتاج موديلين بس (policy و reference متجمّد)، ومفيش sampling ولا reward model. العيوب: بيتدرّب على بيانات ثابتة (<mark>offline</mark>) مش على إجابات الـ policy الحالية، وممكن ينزّل احتمال الإجابتين مع بعض، وحساس لـ beta. في تجارب كتير بيطلع قريب من PPO بتكلفة أقل، بس النتيجة بتختلف حسب البيانات. وفيه نسخ بتعالج عيوبه زي IPO و KTO و SimPO.</p>'+
         '<p>مثال على الذاكرة: لو كل موديل 7B بـ bf16، النسخة الواحدة حوالي 14 GB وزن بس. يعني 4 نسخ = 56 GB ونسختين = 28 GB، قبل الـ optimizer states والـ activations.</p>'+
         '<p><mark>غلطة شائعة:</mark> إن الـ DPO مفيهوش reference. لأ، لسه محتاج reference متجمّد. والـ <mark>online / iterative DPO</mark> بيولّد أزواج جديدة من الـ policy الحالي ويقيّمها.</p>',
         '<p><mark>RLHF with PPO.</mark> The practical drawback: it needs <mark>4 models</mark> in memory (policy, reference, reward, and a value model for the advantage), sampling during training, and it is sensitive and hard to tune.</p>'+
         '<p><mark>DPO.</mark> Advantages: simple (like a classification loss), needs only two models (the policy and a frozen reference), and no sampling or reward model. Drawbacks: it trains on fixed data (<mark>offline</mark>) rather than on the current policy\'s answers, it can lower the probability of both answers together, and it is sensitive to beta. In many experiments it comes close to PPO at lower cost, but results vary with the data. There are variants that address its weaknesses, such as IPO, KTO and SimPO.</p>'+
         '<p>A memory example: if every model is 7B in bf16, one copy is about 14 GB of weights alone. So 4 copies = 56 GB and 2 copies = 28 GB, before optimizer states and activations.</p>'+
         '<p><mark>Common mistake:</mark> thinking DPO needs no reference model. It still needs a frozen one. And <mark>online / iterative DPO</mark> generates fresh pairs from the current policy and labels them.</p>')),
 q:[
   CQ("أنهي جملة صح عن الـ DPO؟","Which statement about DPO is correct?",
      [["مفيهوش reference model خالص","It has no reference model at all"],["بيولّد إجابات جديدة من الـ policy في كل خطوة","It generates new answers from the policy at every step"],["محتاج 4 موديلات زي PPO","It needs 4 models like PPO"],["محتاج reference متجمّد من غير reward model منفصل","It needs a frozen reference but no separate reward model"]],
      3,"الـ loss بيقارن الـ policy بالـ reference المتجمّد، والنسخة الأساسية مفيهاش reward model منفصل ولا sampling.","The loss compares the policy to the frozen reference, and the basic version has no separate reward model or sampling."),
   CQ("لو كل موديل 7B بـ bf16 (14 GB للنسخة)، كام GB وزن بس لـ RLHF بـ PPO بـ 4 موديلات؟","If every model is 7B in bf16 (14 GB per copy), how many GB of weights alone does RLHF with PPO need for its 4 models?",
      [["28","28"],["56","56"],["14","14"],["112","112"]],
      1,"4 * 14 = 56 GB، قبل الـ optimizer states والـ activations.","4 * 14 = 56 GB, before optimizer states and activations.")
 ],
 f:[
   CF("إيه الفرق بين الـ DPO العادي والـ online / iterative DPO؟","What is the difference between plain DPO and online / iterative DPO?",
      "الـ DPO العادي بيتدرّب على أزواج تفضيل ثابتة (offline). النسخة online بتولّد أزواج جديدة من الـ policy الحالي وتقيّمها، فبتقرّب من الـ RLHF.","Plain DPO trains on fixed preference pairs (offline). The online version generates fresh pairs from the current policy and labels them, which moves it closer to RLHF."),
   CF("ليه الـ PPO أتقل من الـ DPO في الذاكرة؟","Why is PPO heavier than DPO in memory?",
      "محتاج 4 موديلات (policy و reference و reward و value) مقابل موديلين (policy و reference) في الـ DPO، وكمان توليد عينات أثناء التدريب.","It needs 4 models (policy, reference, reward, value) versus two (policy and reference) for DPO, plus sampling during training.")
 ],
 terms:[
   {t:B("Offline preference learning","Offline preference learning"),
    d:B("التدريب على أزواج تفضيل ثابتة اتجمّعت قبل التدريب (زي الـ DPO العادي).","Training on fixed preference pairs collected before training (like plain DPO).")},
   {t:B("Online / iterative DPO","Online / iterative DPO"),
    d:B("DPO بيولّد أزواج جديدة من الـ policy الحالي ويقيّمها كل دورة.","DPO that generates fresh pairs from the current policy and labels them in each round.")}
 ]},

{id:"l10-problems",t:B("المشاكل: reward hacking وغيرها","The problems: reward hacking and more"),
 b:cat(B('<p>الـ reward model هو <mark>تقريب</mark> لتفضيل البشر، مش التفضيل الحقيقي. وفيه قانون معروف (<mark>Goodhart</mark>): لما مقياس يتحوّل لهدف بيبطّل يكون مقياس كويس. لو دفعنا الـ policy لأقصى درجة، بيلاقي ثغرات في الـ reward model:</p>',
         '<p>The reward model is an <mark>approximation</mark> of human preference, not the true preference. And there is a known law (<mark>Goodhart</mark>): when a measure becomes a target it stops being a good measure. If we push the policy to the maximum score, it finds loopholes in the reward model:</p>'),
       FIG_GOOD,
       B('<p><mark>Reward hacking / over-optimization</mark> هو أول شكل للمشكلة: الدرجة بتطلع والجودة الحقيقية بتنزل.</p>'+
         '<p>طرق التخفيف: عقوبة الـ KL، والـ early stopping، وتدريب reward models أحسن (أكتر داتا وتنوّع، أو ensemble)، وخلط جزء من الـ pretraining في التدريب. وفيه اتجاهين مهمين:</p>'+
         '<p>• <mark>RLAIF / Constitutional AI</mark>: موديل بيقيّم الإجابات بناءً على مبادئ مكتوبة بدل البشر، لتوفير التكلفة وتوضيح القيم.<br>• <mark>Verifiable rewards</mark>: في الرياضيات والكود نقدر نتحقق من الإجابة آليًا (اختبارات أو نتيجة معروفة)، فمفيش reward model نخدعه. هنشوف ده في محاضرة Reasoning.</p>',
         '<p><mark>Reward hacking / over-optimization</mark> is the first form of the problem: the score rises while true quality falls.</p>'+
         '<p>Ways to mitigate: the KL penalty, early stopping, better reward models (more and more diverse data, or an ensemble), and mixing some pretraining data into training. There are two important directions:</p>'+
         '<p>• <mark>RLAIF / Constitutional AI</mark>: a model judges answers based on written principles instead of humans, to save cost and make the values explicit.<br>• <mark>Verifiable rewards</mark>: in math and code we can check the answer automatically (tests or a known result), so there is no reward model to fool. We will see this in the Reasoning lecture.</p>')),
 q:[
   CQ("درجة الـ reward model بتطلع لكن الجودة الحقيقية بتنزل. إيه اسم المشكلة؟","The reward model score rises but true quality falls. What is this problem called?",
      [["Underfitting","Underfitting"],["Vanishing gradient","Vanishing gradient"],["Tokenization error","Tokenization error"],["Reward hacking (over-optimization)","Reward hacking (over-optimization)"]],
      3,"الـ policy بيستغل ثغرات في الـ reward model اللي هو تقريب للتفضيل الحقيقي.","The policy exploits loopholes in the reward model, which is only an approximation of the true preference."),
   CQ("بنتدرّب RLHF، ودرجة الـ reward model لسه بتطلع لكن تقييم البشر بدأ ينزل. أنسب إجراء؟","We are training with RLHF, and the reward model score still rises but human ratings have started to fall. What is the best action?",
   [["نوقّف مبكرًا أو نزوّد beta علشان الـ policy يفضل قريب من الـ reference","Stop early or raise beta so the policy stays close to the reference"],["نكمّل لحد ما الدرجة توصل لأقصاها","Continue until the score reaches its maximum"],["نشيل عقوبة الـ KL","Remove the KL penalty"],["نصغّر الـ reward model","Shrink the reward model"]],
   0,"ده reward hacking: الدرجة طالعة والجودة الحقيقية نازلة، فبنقرّب الـ policy من الـ reference أو نوقّف.","This is reward hacking: the score rises while true quality falls, so we pull the policy back toward the reference or stop.")
 ],
 f:[
   CF("إيه هو الـ reward hacking وإزاي بنخففه؟","What is reward hacking and how do we mitigate it?",
      "الـ policy بيستغل ثغرات في الـ reward model فالدرجة بتطلع والجودة بتنزل. التخفيف: عقوبة KL، early stopping، reward models أحسن، RLAIF، وverifiable rewards.","The policy exploits loopholes in the reward model so the score rises while quality falls. Mitigation: a KL penalty, early stopping, better reward models, RLAIF, and verifiable rewards."),
   CF("إيه هو قانون Goodhart؟","What is Goodhart's law?",
   "لما مقياس يتحوّل لهدف بيبطّل يكون مقياس كويس. مثال: الـ policy بيحسّن درجة الـ reward model مش الجودة الحقيقية.","When a measure becomes a target it stops being a good measure. Example: the policy optimizes the reward model score, not the true quality.")
 ],
 terms:[
   {t:B("Reward hacking","Reward hacking"),
    d:B("الـ policy بيستغل ثغرات في الـ reward model: الدرجة بتطلع والجودة الحقيقية بتنزل (over-optimization).","The policy exploits loopholes in the reward model: the score rises while true quality falls (over-optimization).")},
   {t:B("Goodhart's law","Goodhart's law"),
 d:B("لما مقياس يتحوّل لهدف بيبطّل يكون مقياس كويس.","When a measure becomes a target it stops being a good measure.")},
   {t:B("RLAIF","RLAIF"),
    d:B("Reinforcement Learning from AI Feedback: موديل بيقيّم الإجابات بدل البشر.","Reinforcement Learning from AI Feedback: a model judges the answers instead of humans.")},
   {t:B("Constitutional AI","Constitutional AI"),
    d:B("RLAIF بيستخدم مبادئ مكتوبة (constitution) يقيّم بيها الموديل الإجابات.","RLAIF that uses written principles (a constitution) for the model to judge answers.")},
   {t:B("Verifiable rewards","Verifiable rewards"),
    d:B("reward بيتحسب آليًا من نتيجة قابلة للتحقق (اختبارات كود أو إجابة رياضية معروفة)، فمفيش reward model نخدعه.","A reward computed automatically from a checkable result (code tests or a known math answer), so there is no reward model to fool.")}
 ]},

{id:"l10-length-sycophancy",t:B("Length bias و sycophancy","Length bias and sycophancy"),
 b:cat(B('<p>ونفس المشكلة ليها أشكال تانية:<br>• <mark>Length bias</mark>: المقيّمين غالبًا بيحبوا الإجابات الطويلة، فالموديل بيطوّل من غير فايدة.<br>• <mark>Sycophancy</mark>: الموديل بيوافق المستخدم حتى لو غلطان لأن الموافقة بتاخد درجات أعلى.<br>• <mark>Alignment tax</mark>: ممكن الأداء ينزل في بعض المهام.</p>'+
         '<p>وفي التقييم: بنقارن الموديلين بـ <mark>win rate</mark> (نسبة المرات اللي إجابة موديل بتتفضّل على التاني) بتقييم بشر أو موديل-قاضي، وهنفصّل ده في محاضرة Evaluation.</p>'+
         '<p>المشكلة إن القاضي كمان بيحب الطول. لو موديل B بيكتب أطول بضعف وكسب 64%، إزاي نفصل الجودة عن الطول؟ الـ <mark>length-controlled win rate</mark> بيقدّر النسبة لو الإجابتين بنفس الطول:</p>',
         '<p>The same problem has other forms:<br>• <mark>Length bias</mark>: raters often like long answers, so the model pads without benefit.<br>• <mark>Sycophancy</mark>: the model agrees with the user even when wrong because agreement scores higher.<br>• <mark>Alignment tax</mark>: performance may drop on some tasks.</p>'+
         '<p>For evaluation: we compare two models by <mark>win rate</mark> (the fraction of times one model\'s answer is preferred over the other), judged by humans or a judge model, which we detail in the Evaluation lecture.</p>'+
         '<p>The catch is that the judge also likes length. If model B writes twice as long and wins 64%, how do we separate quality from length? The <mark>length-controlled win rate</mark> estimates the rate as if both answers had the same length:</p>'),
       FIG_LEN,
       B('<p>مثال على الـ sycophancy: المستخدم بيقول "أنا متأكد إن 7 × 8 = 54، صح؟" والموديل المجامل بيرد "صح"، رغم إن الصح 56. ورقة Sharma وزمايله (2023) لقت إن داتا التفضيل والـ reward models بتفضّل أحيانًا الإجابة المجاملة المقنعة على الصح. ومن الحلول: داتا بتكافئ الإجابة الصح حتى لو المستخدم معترض.</p>',
         '<p>A sycophancy example: the user says "I am sure 7 x 8 = 54, right?" and the flattering model replies "right", although the answer is 56. The Sharma et al. paper (2023) found that preference data and reward models sometimes prefer the convincing flattering answer over the correct one. One fix is data that rewards the correct answer even when the user pushes back.</p>')),
 q:[
   CQ("ليه الـ length bias بيظهر بعد الـ RLHF؟","Why does length bias show up after RLHF?",
      [["لأن عقوبة الـ KL بتشجّع الطول","Because the KL penalty encourages length"],["لأن الـ tokenizer بيقسّم الكلمات","Because the tokenizer splits words"],["لأن المقيّمين غالبًا بيفضّلوا الإجابات الطويلة فالـ reward model بيكافئها","Because raters often prefer longer answers, so the reward model rewards them"],["لأن الـ SFT بيمنع الإجابات القصيرة","Because SFT forbids short answers"]],
      2,"الـ reward model بيتعلم من تفضيلات البشر، فلو الطول بيتفضّل بيتعلم يكافئه، والـ policy بيستغل ده.","The reward model learns from human preferences, so if length is preferred it learns to reward it, and the policy exploits that."),
   CQ("الموديل B كسب 64% في الـ win rate العادي و51% في الـ length-controlled. الاستنتاج؟","Model B wins 64% in the raw win rate and 51% in the length-controlled one. What is the conclusion?",
      [["B أحسن بكتير فعلًا","B is truly much better"],["الفرق جاي من الـ tokenizer","The gap comes from the tokenizer"],["الـ length-controlled دايمًا أقل بسبب bug","Length-controlled is always lower because of a bug"],["تقريبًا كل الفرق كان طول مش جودة","Almost all of the gap was length, not quality"]],
      3,"51% قريبة من 50% (تعادل)، يعني بعد ضبط الطول مفيش ميزة حقيقية تقريبًا.","51% is close to 50% (a tie), so after controlling for length there is almost no real advantage.")
 ],
 f:[
   CF("إيه هو الـ sycophancy؟","What is sycophancy?",
      "الموديل بيوافق المستخدم أو بيجامله حتى لو غلطان، لأن الموافقة بتاخد تقييم أعلى. مثال: بيوافق على 7 × 8 = 54.","The model agrees with or flatters the user even when the user is wrong, because agreement gets a higher rating. Example: it agrees that 7 x 8 = 54."),
   CF("إيه هو الـ length-controlled win rate ولازمته إيه؟","What is the length-controlled win rate and why do we need it?",
      "نسبة الكسب بعد ضبط تأثير طول الإجابة، علشان ما نخلطش الجودة بالطول.","The win rate after controlling for the effect of answer length, so we do not confuse quality with length.")
 ],
 terms:[
   {t:B("Length bias","Length bias"),
    d:B("ميل المقيّمين (والـ reward model) لتفضيل الإجابة الأطول، فالـ policy بيطوّل من غير فايدة.","The tendency of raters (and the reward model) to prefer the longer answer, so the policy pads without benefit.")},
   {t:B("Sycophancy","Sycophancy"),
    d:B("الموديل بيوافق المستخدم أو بيجامله حتى لو غلطان.","The model agrees with or flatters the user even when the user is wrong.")},
   {t:B("Alignment tax","Alignment tax"),
    d:B("نزول الأداء في بعض المهام بعد الـ preference tuning.","A drop in performance on some tasks after preference tuning.")},
   {t:B("Win rate","Win rate"),
    d:B("نسبة المرات اللي إجابة موديل بتتفضّل فيها على موديل تاني، بتقييم بشر أو موديل-قاضي.","The fraction of times one model\'s answer is preferred over another model\'s, judged by humans or a judge model.")},
   {t:B("Length-controlled win rate","Length-controlled win rate"),
    d:B("الـ win rate بعد ضبط تأثير طول الإجابة.","The win rate after controlling for the effect of answer length.")}
 ]},

{id:"l10-safety",t:B("الـ safety و red-teaming و toxicity","Safety, red-teaming and toxicity"),
 b:cat(B('<p>الـ helpful لوحده مش كفاية: الـ assistant ممكن يساعد في طلب ضار. الـ <mark>safety training</mark> بيعلّمه يرفض الطلبات الضارة ويفضل مفيد في الباقي، بأدوات الـ post-training: SFT على أمثلة رفض، وأزواج تفضيل (الرد الآمن أفضل من الضار)، وreward model للـ safety.</p>'+
         '<p>الـ <mark>red-teaming</mark>: فريق (بشر أو موديل تاني) بيحاول يلاقي prompts تخلّي الموديل يطلّع حاجة ضارة قبل المستخدمين، والهجمات الناجحة بتتحوّل لداتا تدريب. والـ <mark>jailbreak</mark> هو prompt مصمَّم يتجاوز التدريب (مثلًا role-play أو صياغة غريبة)، فالعملية بتتكرر مع كل نسخة جديدة:</p>',
         '<p>Helpful alone is not enough: an assistant may help with a harmful request. <mark>Safety training</mark> teaches it to refuse harmful requests and stay useful for the rest, using post-training tools: SFT on refusal examples, preference pairs (the safe reply beats the harmful one), and a safety reward model.</p>'+
         '<p><mark>Red-teaming</mark>: a team (humans or another model) tries to find prompts that make the model produce harmful output before users do, and the successful attacks become training data. A <mark>jailbreak</mark> is a prompt designed to get around the training (for example role-play or odd phrasing), so it repeats with every new version:</p>'),
       FIG_SAFE,
       B('<p>الـ <mark>toxicity</mark> (كلام مسيء أو عدائي) بتتقاس بـ classifier على مخرجات الموديل لما نديله prompts من مجموعات زي RealToxicityPrompts. وبنقيس الاتجاهين: الرفض على الطلبات الضارة، والـ <mark>over-refusal</mark> وهو رفض طلب بريء شكله خطير (زي "ازاي أقتل process؟"). مثال: رفض 940 من 1000 طلب ضار = 94%، ورفض 40 من 500 بريء = 8% over-refusal.</p>'+
         '<p>الأمان والفايدة بيتشدّوا عكس بعض، فبعض الفرق بتدرّب reward models منفصلة (Llama 2: واحد للـ helpfulness وواحد للـ safety) وبتضيف classifier زي Llama Guard حوالين الموديل.</p>',
         '<p><mark>Toxicity</mark> (abusive or hostile text) is measured with a classifier on the model\'s outputs on prompts from sets like RealToxicityPrompts. We measure both directions: refusal on harmful requests, and <mark>over-refusal</mark>, refusing a harmless request that only looks dangerous (like "how do I kill a process?"). Example: refusing 940 of 1000 harmful requests = 94%, and 40 of 500 harmless ones = 8% over-refusal.</p>'+
         '<p>Safety and helpfulness pull in opposite directions, so some teams train separate reward models (Llama 2: one for helpfulness and one for safety) and add a classifier such as Llama Guard around the model.</p>')),
 q:[
   CQ("إيه هو الـ red-teaming؟","What is red-teaming?",
      [["تدريب الموديل على داتا أكبر","Training the model on more data"],["محاولة منظّمة (بشر أو موديل) للعثور على prompts تخلّي الموديل يطلّع حاجة ضارة","A systematic attempt (by humans or a model) to find prompts that make the model produce harmful output"],["حذف الـ reward model بعد التدريب","Deleting the reward model after training"],["مقياس لسرعة التوليد","A measure of generation speed"]],
      1,"بنكتشف الثغرات قبل المستخدمين، وبنحوّل الهجمات الناجحة لداتا تدريب.","We discover the weaknesses before users do, and turn the successful attacks into training data."),
   CQ("الموديل رفض 940 من 1000 طلب ضار، ورفض 40 من 500 طلب بريء. كام نسبة الـ over-refusal؟","The model refused 940 of 1000 harmful requests and 40 of 500 harmless ones. What is the over-refusal rate?",
      [["94%","94%"],["6%","6%"],["4%","4%"],["8%","8%"]],
      3,"الـ over-refusal بتتحسب على الطلبات البريئة: 40 / 500 = 8%.","Over-refusal is computed on the harmless requests: 40 / 500 = 8%.")
 ],
 f:[
   CF("إيه الفرق بين الـ jailbreak والـ red-teaming؟","What is the difference between a jailbreak and red-teaming?",
      "الـ jailbreak هو prompt بيتجاوز تدريب الأمان. الـ red-teaming هو العملية اللي بندوّر بيها على jailbreaks وهجمات تانية قبل المستخدمين.","A jailbreak is a prompt that gets around safety training. Red-teaming is the process of searching for jailbreaks and other attacks before users do."),
   CF("إيه هو الـ over-refusal وليه بنقيسه؟","What is over-refusal and why do we measure it?",
      "رفض طلب بريء شكله خطير. بنقيسه جنب نسبة الرفض على الطلبات الضارة علشان الأمان ما ييجيش على حساب الفايدة.","Refusing a harmless request that only looks dangerous. We measure it next to the refusal rate on harmful requests so that safety does not come at the cost of helpfulness.")
 ],
 terms:[
   {t:B("Red-teaming","Red-teaming"),
    d:B("محاولة منظّمة لإيجاد prompts تخلّي الموديل يطلّع حاجة ضارة، قبل المستخدمين.","A systematic attempt to find prompts that make the model produce harmful output, before users do.")},
   {t:B("Jailbreak","Jailbreak"),
    d:B("prompt مصمَّم يتجاوز تدريب الأمان (مثلًا بـ role-play أو صياغة غريبة).","A prompt designed to get around safety training (for example with role-play or odd phrasing).")},
   {t:B("Toxicity","Toxicity"),
    d:B("كلام مسيء أو عدائي في مخرجات الموديل، بتتقاس بـ classifier.","Abusive or hostile text in the model output, measured with a classifier.")},
   {t:B("Over-refusal","Over-refusal"),
 d:B("رفض طلب بريء شكله خطير.","Refusing a harmless request that only looks dangerous.")},
   {t:B("Safety classifier","Safety classifier"),
    d:B("موديل بيصنّف المدخلات أو المخرجات (آمنة ولا ضارة)، زي Llama Guard.","A model that labels inputs or outputs as safe or harmful, such as Llama Guard.")}
 ]},

{id:"l10-recap",t:B("Recap: ملخص المحاضرة","Recap: lecture summary"),
 b:cat(B('<p><mark>5 نقاط:</mark><br>1. الـ pretrained model بيكمّل النص، والـ post-training بيغيّر السلوك مش المعرفة.<br>2. الـ SFT: loss على كلمات الإجابة بس، بيعلّم الشكل والأسلوب وبيقلّد.<br>3. الـ reward model بيتدرّب على أزواج تفضيل ويطلّع درجة واحدة.<br>4. الـ RLHF بيكبّر reward ناقص KL بـ PPO، والـ DPO بيوصل لنفس الهدف بـ loss واحد.<br>5. الـ reward model تقريب، فبيظهر reward hacking و length bias و sycophancy، والـ safety محتاج red-teaming وتوازن مع الفايدة.</p>'+
         '<p><mark>أهم المعادلات:</mark></p>'+
         '<div class="m">SFT:   loss = -(1/|y|) * sum log P(y_t | x, y_&lt;t)\nRM:    loss = -log sigmoid( r_w - r_l )\nRLHF:  max E[ r - beta * log(pi / pi_ref) ]\nDPO:   L = -log sigmoid( beta * (rho_w - rho_l) )\n       rho = log( pi(y|x) / pi_ref(y|x) )</div>'+
         '<p><mark>قبل المحاضرة اللي بعدها:</mark> لازم تقدر تحسب loss الـ reward model والـ DPO من أرقام، وتشرح ليه الـ KL بيمنع الـ reward hacking، وتفرّق بين الـ reward model والـ verifiable reward.</p>',
         '<p><mark>5 points:</mark><br>1. A pretrained model continues text, and post-training changes behavior, not knowledge.<br>2. SFT: loss on the answer tokens only; it teaches format and style, and it imitates.<br>3. The reward model trains on preference pairs and outputs one score.<br>4. RLHF maximizes reward minus KL with PPO, and DPO reaches the same goal with a single loss.<br>5. The reward model is an approximation, so reward hacking, length bias and sycophancy appear, and safety needs red-teaming and a balance with helpfulness.</p>'+
         '<p><mark>Key equations:</mark></p>'+
         '<div class="m">SFT:   loss = -(1/|y|) * sum log P(y_t | x, y_&lt;t)\nRM:    loss = -log sigmoid( r_w - r_l )\nRLHF:  max E[ r - beta * log(pi / pi_ref) ]\nDPO:   L = -log sigmoid( beta * (rho_w - rho_l) )\n       rho = log( pi(y|x) / pi_ref(y|x) )</div>'+
         '<p><mark>Before the next lecture:</mark> you should be able to compute the reward-model and DPO losses from numbers, explain why the KL penalty limits reward hacking, and tell a reward model apart from a verifiable reward.</p>')),
 q:[
   CQ("إيه الترتيب الصح لمراحل تدريب الـ assistant؟","What is the right order of the stages for training an assistant?",
      [["pretraining ثم preference tuning ثم SFT","pretraining, then preference tuning, then SFT"],["SFT ثم pretraining ثم preference tuning","SFT, then pretraining, then preference tuning"],["pretraining ثم SFT ثم preference tuning","pretraining, then SFT, then preference tuning"],["preference tuning ثم SFT ثم pretraining","preference tuning, then SFT, then pretraining"]],
      2,"الموديل بيتعلم اللغة الأول، وبعدين يتعلم يتبع التعليمات، وبعدين نظبط الإجابات على تفضيلات البشر.","The model first learns language, then learns to follow instructions, then its answers are tuned to human preferences."),
   CQ("عندك أزواج تفضيل ثابتة وميزانية GPU محدودة ومفيش وقت لضبط PPO. أنسب اختيار؟","You have fixed preference pairs, a limited GPU budget and no time to tune PPO. What is the best fit?",
      [["الـ DPO","DPO"],["PPO بـ 4 موديلات","PPO with 4 models"],["pretraining من الأول","Pretraining from scratch"],["حذف الـ reference model والـ KL","Dropping the reference model and the KL term"]],
      0,"الـ DPO بسيط، بيحتاج موديلين بس، وبيتدرّب على أزواج التفضيل الثابتة بـ loss واحد.","DPO is simple, needs only two models, and trains on fixed preference pairs with a single loss.")
 ],
 f:[
   CF("لخّص الـ post-training في جملة.","Summarize post-training in one sentence.",
      "بعد الـ pretraining بنعمل SFT علشان يتبع التعليمات، وبعدين preference tuning (RLHF أو DPO) علشان إجاباته تبقى أفيد وأأمن، من غير ما نضيف معرفة كتير.","After pretraining we run SFT so the model follows instructions, then preference tuning (RLHF or DPO) so its answers are more helpful and safer, without adding much knowledge."),
   CF("إيه الفرق بين الـ RLHF والـ DPO في سطر؟","What is the difference between RLHF and DPO in one line?",
      "الـ RLHF بيدرّب reward model وبعدين بيحدّث الـ policy بـ PPO. الـ DPO بيدرّب الـ policy مباشرة على أزواج التفضيل بـ loss واحد.","RLHF trains a reward model and then updates the policy with PPO. DPO trains the policy directly on preference pairs with a single loss.")
 ]}
]}
);

})();
