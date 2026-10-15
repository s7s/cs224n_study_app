/* Lecture 1: Word Vectors & Word2Vec
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

var FIG1=fig(142,
  T(24,20,'hotel','tb')+cells(28,3)+T(24,72,'motel','tb')+cells(80,2)+T(24,128,'hotel · motel = 0','tb','start','fill:var(--no)'),
  B('كل كلمة vector كله أصفار إلا خانة واحدة. الواحد في مكان مختلف لكل كلمة، فالـ dot product صفر.',
    'Each word is a vector of zeros with a single 1. The 1 sits in a different place for each word, so the dot product is zero.'));

var FIG2=fig(230,
  ell(108,66,110,42,'ac')+pt(52,42,'banking','ac')+pt(150,62,'finance','ac')+pt(72,88,'money','ac')+
  ell(265,172,72,40,'ok')+pt(230,150,'hotel','ok')+pt(290,175,'motel','ok')+pt(250,195,'inn','ok')+
  ell(65,184,52,30,'mu')+pt(40,170,'dog','mu')+pt(85,198,'cat','mu'),
  B('كل كلمة نقطة في فراغ، والكلمات المتشابهة في المعنى بتتجمع جنب بعض. الرسم بُعدين للتبسيط، والحقيقي 100 إلى 300 بُعد.',
    'Each word is a point in space, and words with similar meanings cluster together. Shown in 2 dimensions for simplicity; the real space has 100 to 300.'));

/* Figure 3: skip-gram window */
function windowFig(){
  var W=['problems','turning','into','banking','crises'],s='';
  [0,1,3,4].forEach(function(i){
    var tx=8+i*70+32,cx=(180+tx)/2,cy=(i===0||i===4)?8:44;
    s+='<path d="M180 78 Q'+cx+' '+cy+' '+tx+' 78" style="fill:none;stroke:var(--ok);stroke-width:1.8" marker-end="url(#mG)"/>';
  });
  W.forEach(function(w,i){
    var x=8+i*70,c=(i===2);
    s+='<rect x="'+x+'" y="82" width="64" height="30" rx="6" style="fill:'+(c?'var(--ac)':'var(--sf)')+';stroke:'+(c?'var(--ac)':'var(--ok)')+';stroke-width:1.8"/>'+
       T(x+32,101,w,c?'tb':'','middle','font-size:11.5px;'+(c?'fill:var(--bg)':''))+
       T(x+32,130,c?'center':'context',c?'tb':'tm','middle','font-size:11.5px');
  });
  s+='<path d="M8 146 V152 H352 V146" style="fill:none;stroke:var(--mu);stroke-width:1.5"/>'+T(180,170,'window: m = 2','tm','middle');
  return s;
}

var FIG3=fig(178,windowFig(),
  B('الـ center هو into، والـ context هو الكلمات اللي في نافذة m = 2 حواليه (اتنين من كل ناحية). الأسهم بتوضح إن الموديل بيتنبأ بالسياق من الـ center.',
    'The center is into, and the context is the words within a window of m = 2 around it (two on each side). The arrows show that the model predicts the context from the center.'));

/* Figure 4: loss curve  -log p */
function lossFig(){
  var pts=[],p,l;
  for(p=0.03;p<=1.0001;p+=0.01){l=Math.min(-Math.log(p),4);pts.push((40+p*300).toFixed(1)+','+(180-l/4*160).toFixed(1));}
  return '<line x1="40" y1="180" x2="340" y2="180" style="stroke:var(--mu);stroke-width:1.5"/>'+
         '<line x1="40" y1="20" x2="40" y2="180" style="stroke:var(--mu);stroke-width:1.5"/>'+
         '<polyline points="'+pts.join(' ')+'" style="fill:none;stroke:var(--ac);stroke-width:2.6"/>'+
         DOT(70,88,'no',5)+T(80,84,'high loss','tb','start','fill:var(--no)')+
         DOT(310,176,'ok',5)+T(300,162,'low loss','tb','end','fill:var(--ok)')+
         T(44,14,'loss = -log P','tm')+T(190,208,'P(o | c)','tm','middle')+T(40,197,'0','tm','middle')+T(340,197,'1','tm','middle');
}

var FIG4=fig(218,lossFig(),
  B('الـ loss هو سالب log الاحتمال. لو الموديل بيدي احتمال واطي للكلمة الحقيقية الـ loss بيبقى عالي، ولو بيدي احتمال عالي الـ loss بيقل.',
    'The loss is minus the log probability. If the model gives the real word a low probability the loss is high; if it gives a high probability the loss drops.'));

/* Figure 5: gradient = observed - expected */
var FIG5=fig(200,
  AR(50,170,300,58,'ac','mA')+AR(50,170,200,150,'mu','mM')+AR(200,150,300,58,'ok','mG',true)+DOT(50,170,'ink',3.5)+
  T(292,44,'u_o (observed)','tb','end')+T(125,192,'expected','tm','middle')+
  T(238,124,'gradient','tb','start','fill:var(--ok)')+T(238,140,'= observed','tb','start','fill:var(--ok)')+T(238,156,'- expected','tb','start','fill:var(--ok)'),
  B('من نفس نقطة البداية: الـ observed هو u_o، والـ expected هو المتوسط اللي الموديل توقعه. الـ gradient هو الفرق بينهم (الرسم بُعدين للتبسيط).',
    'From the same starting point: observed is u_o, and expected is the average the model predicted. The gradient is the difference between them (drawn in 2 dimensions for simplicity).'));

/* Figure 6: analogy parallelogram */
var FIG6=fig(210,
  AR(60,150,240,170,'ac','mA')+AR(110,70,290,90,'ac','mA')+AR(60,150,110,70,'mu','mM',true)+AR(240,170,290,90,'mu','mM',true)+
  DOT(60,150,'ink')+DOT(110,70,'ink')+DOT(240,170,'ink')+DOT(290,90,'ink')+
  T(60,172,'man','tb','middle')+T(110,56,'woman','tb','middle')+T(240,192,'king','tb','middle')+T(290,76,'queen','tb','middle')+
  T(150,184,'royalty','tm','middle')+T(200,68,'royalty','tm','middle')+T(76,114,'gender','tm','end')+T(276,136,'gender','tm','start'),
  B('الفرق بين man و woman (gender) هو نفسه تقريبًا الفرق بين king و queen. عشان كده king - man + woman بتوصلنا لـ queen.',
    'The offset from man to woman (gender) is roughly the same as from king to queen. That is why king - man + woman lands near queen.'));

/* Figure 7: CBOW vs Skip-gram */
function cbowFig(){
  var W=['problems','turning','banking','crises'],s='',i;
  function row(y){
    var r='',k,bx;
    for(k=0;k<4;k++){bx=8+k*86;r+=RECT(bx,y,76,26,'var(--sf)','var(--ok)',6)+T(bx+38,y+17,W[k],'','middle','font-size:11.5px');}
    return r;
  }
  s+=T(8,14,'Skip-gram: center → context','tb');
  s+=row(24)+RECT(140,92,80,28,'var(--ac)','none',6)+T(180,110,'into','tb','middle','fill:var(--bg)');
  for(i=0;i<4;i++)s+=AR(180,92,8+i*86+38,50,'ok','mG');
  s+='<line x1="8" y1="134" x2="352" y2="134" style="stroke:var(--ln);stroke-width:1.2;stroke-dasharray:4 4"/>';
  s+=T(8,152,'CBOW: context → center','tb');
  s+=row(162)+RECT(140,230,80,28,'var(--ac)','none',6)+T(180,248,'into','tb','middle','fill:var(--bg)');
  for(i=0;i<4;i++)s+=AR(8+i*86+38,188,180,230,'ok','mG');
  return s;
}

var FIG7=fig(266,cbowFig(),
  B('فوق: Skip-gram بيتنبأ بكل كلمة من الـ 4 كلمات من الـ center (4 أزواج). تحت: CBOW بيجمع الـ 4 كلمات وبيتنبأ بالـ center مرة واحدة.',
    'Top: Skip-gram predicts each of the 4 context words from the center (4 pairs). Bottom: CBOW combines the 4 context words and predicts the center once.'));

/* Horizontal bars used by figures 8 and 9. rows = [label, value 0..1, value text, highlighted] */
function barRows(rows,x0,scale,y0){
  var s='';
  rows.forEach(function(r,i){
    var y=y0+i*34,w=Math.max(r[1]*scale,2);
    s+=T(8,y+16,r[0],r[3]?'tb':'','start','font-size:11.5px')+
       RECT(x0,y,w,24,r[3]?'var(--ac)':'var(--sf)',r[3]?'none':'var(--ln)',5)+
       T(x0+w+6,y+16,r[2],'tm','start','font-size:11.5px');
  });
  return s;
}

/* Figure 8: numeric softmax */
var FIG8=fig(172,
  T(8,16,'P(w | banking) = softmax of the scores','tm')+
  barRows([['crises (2.0)',0.644,'0.644',1],['turning (1.0)',0.237,'0.237',0],['money (0.0)',0.087,'0.087',0],['dog (-1.0)',0.032,'0.032',0]],110,230,28),
  B('الـ scores بتتحول لاحتمالات مجموعها 1. الـ bar الملون هو الكلمة الحقيقية crises، واحتمالها 0.644.',
    'The scores become probabilities that sum to 1. The colored bar is the real word, crises, with probability 0.644.'));

/* Figure 9: subsampling discard probability */
var FIG9=fig(172,
  T(8,16,'P(discard) = 1 - sqrt(t / f)','tm')+
  barRows([['f = 0.05',0.986,'98.6%',1],['f = 0.001',0.9,'90.0%',0],['f = 0.0001',0.684,'68.4%',0],['f = 0.00001',0,'0%',0]],100,180,28),
  B('كل ما الكلمة أشيع (f أكبر) احتمال رميها بيعلى. الكلمة اللي f بتاعتها أقل من t أو بتساويه مبتتشالش. هنا t = 0.00001.',
    'The more frequent a word is (larger f), the more likely it is to be dropped. A word with f at or below t is never dropped. Here t = 0.00001.'));

/* Figure 10: four stages of NLP, with the idea of each stage and what failed */
var FIG_HIST=fig(214,
  RECT(14,14,110,30,'var(--sf)','var(--ln)',8)+T(69,34,'Rules','tb','middle')+
  T(136,27,'hand-written grammars','tb','start','font-size:11px')+
  T(136,41,'brittle, misses exceptions','tm','start','font-size:11px;fill:var(--no)')+
  AR(69,44,69,68,'ac','mA')+
  RECT(14,68,110,30,'var(--sf)','var(--ln)',8)+T(69,88,'Statistical','tb','middle')+
  T(136,81,'n-gram counts, SMT','tb','start','font-size:11px')+
  T(136,95,'sparse data, short context','tm','start','font-size:11px;fill:var(--no)')+
  AR(69,98,69,122,'ac','mA')+
  RECT(14,122,110,30,'var(--sf)','var(--ln)',8)+T(69,142,'Neural','tb','middle')+
  T(136,135,'word2vec, seq2seq, attention','tb','start','font-size:11px')+
  T(136,149,'one vector per word, task data','tm','start','font-size:11px;fill:var(--no)')+
  AR(69,152,69,176,'ac','mA')+
  RECT(14,176,110,30,'var(--ac)','none',8)+T(69,196,'Pretrained','tb','middle','fill:var(--bg)')+
  T(136,189,'predict text, then adapt','tb','start','font-size:11px')+
  T(136,203,'hallucination, high cost','tm','start','font-size:11px;fill:var(--no)'),
  B('أربع مراحل: كل مرحلة بتصلّح فشل اللي قبلها (الفشل بالأحمر).',
    'Four stages: each one fixes the failure of the one before (failures in red).'));

/* Figure 11: the three assumptions in each stage */
var FIG_PARA=fig(150,
  RECT(4,6,352,24,'var(--sf)','none',6)+
  T(112,22,'Word','tb','middle')+T(200,22,'Context','tb','middle')+T(300,22,'Meaning','tb','middle')+
  T(10,52,'Rules','tb')+T(112,52,'symbol','tm','middle','font-size:11px')+T(200,52,'pattern','tm','middle','font-size:11px')+T(300,52,'hand-written','tm','middle','font-size:11px')+
  T(10,80,'n-gram','tb')+T(112,80,'symbol (ID)','tm','middle','font-size:11px')+T(200,80,'last n-1 words','tm','middle','font-size:11px')+T(300,80,'counts','tm','middle','font-size:11px')+
  T(10,108,'Neural','tb')+T(112,108,'vector','tb','middle','font-size:11px;fill:var(--ac)')+T(200,108,'window/sentence','tm','middle','font-size:11px')+T(300,108,'learned','tb','middle','font-size:11px;fill:var(--ac)')+
  T(10,136,'LLM','tb')+T(112,136,'vector','tb','middle','font-size:11px;fill:var(--ac)')+T(200,136,'long text','tm','middle','font-size:11px')+T(300,136,'from raw text','tb','middle','font-size:11px;fill:var(--ac)'),
  B('نفس الأسئلة التلاتة بإجابات مختلفة في كل مرحلة. الأزرق = اللي اتغيّر مع الـ vectors.',
    'The same three questions, answered differently in each stage. Blue = what changed with vectors.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:1,t:B("Word Vectors و Word2Vec","Word Vectors & Word2Vec"),cards:[

{id:"l1-history",t:B("تاريخ الـ NLP: أربع مراحل","A short history of NLP: four stages"),
 b:cat(B('<p>الـ NLP ما بدأش بالـ neural networks. مرّ بأربع مراحل، وكل مرحلة غيّرت افتراضنا عن اللغة علشان تصلّح فشل اللي قبلها.</p>',
         '<p>NLP did not start with neural networks. It went through four stages, and each one changed what we assume about language to fix the failure of the one before.</p>'),
       FIG_HIST,
       B('<p><mark>1. القواعد (symbolic).</mark> الخبراء بيكتبوا قواعد وقواميس بإيديهم. الافتراض: اللغة نظام رموز منفصلة بهيكل صريح. بتفشل لأن القواعد هشة: الاستثناءات واللبس والكلمات الجديدة بتكسرها.</p>'+
         '<p><mark>2. الإحصائية (statistical).</mark> نماذج الـ n-gram والترجمة الآلية الإحصائية (SMT) بتعدّ تسلسلات الكلمات في نص كبير. الافتراض: الكلمة الجاية بتعتمد على آخر كلمات قليلة بس، وكل كلمة لسه ID. بتفشل مع الداتا المتناثرة والسياق القصير.</p>'+
         '<p><mark>3. العصبية (neural).</mark> word2vec بيتعلم dense vector لكل كلمة، و seq2seq بيقرا ويكتب جمل كاملة، والـ attention بيخلي الخرج يرجع يبص على كل كلمة دخل. الافتراض: الكلمات في فراغ متصل والمعنى من السياق. بتفشل لأن كل مهمة محتاجة داتا معلّمة خاصة بيها، وكل كلمة ليها vector واحد مهما اتغير معناها.</p>'+
         '<p><mark>4. الـ LLMs المتدرّبة مسبقًا.</mark> موديل كبير واحد بيتعلم يتنبأ بالكلمات في نص خام، وبعدين نكيّفه بـ fine-tuning أو prompting. الافتراض: التنبؤ بالنص بيجبر الموديل يتعلم القواعد والمعلومات. بتفشل في إنه يألّف معلومات (hallucination) وفي التكلفة.</p>'+
         '<p>ليه العدّ بيفشل: مع vocabulary من 10,000 كلمة، عدد الـ trigrams الممكنة <code>10,000^3 = 1,000,000,000,000</code>. نص بمليار كلمة فيه مليار موضع trigram بس، فأقصى حاجة تتشاف <code>0.1%</code> منها.</p>'+
         '<p>غلطة شائعة: المراحل ما حلّتش محل بعض ببساطة. أفكارها لسه جوه الموديلات الحديثة (الـ language model لسه بيتنبأ بالكلمة الجاية زي الـ n-gram).</p>',
         '<p><mark>1. Rules (symbolic).</mark> Experts write grammars and dictionaries by hand. Assumption: language is a system of discrete symbols with explicit structure. It fails because rules are brittle: exceptions, ambiguity and new words break them.</p>'+
         '<p><mark>2. Statistical.</mark> N-gram models and statistical machine translation (SMT) count word sequences in large text. Assumption: the next word depends only on the last few words, and each word is still an ID. It fails on sparse data and short context.</p>'+
         '<p><mark>3. Neural.</mark> word2vec learns a dense vector per word, seq2seq reads and writes whole sentences, and attention lets the output look back at every input word. Assumption: words live in a continuous space and meaning comes from context. It fails because each task needs its own labeled data, and each word gets one vector whatever its sense.</p>'+
         '<p><mark>4. Pretrained LLMs.</mark> One large model learns to predict words in raw text, then we adapt it with fine-tuning or prompting. Assumption: predicting text forces the model to learn grammar and facts. It fails by making things up (hallucination) and by cost.</p>'+
         '<p>Why counting fails: with a 10,000-word vocabulary there are <code>10,000^3 = 1,000,000,000,000</code> possible trigrams. A corpus of one billion words has only one billion trigram positions, so at most <code>0.1%</code> of them can ever be seen.</p>'+
         '<p>Common mistake: the stages did not simply replace each other. Their ideas still live inside modern models (a language model still predicts the next word, as n-grams did).</p>')),
 q:[
   CQ("ليه موديلات الـ n-gram بتتعب مع السياق الطويل؟","Why do n-gram models struggle with long contexts?",
      [["معظم التسلسلات الطويلة عمرها ما ظهرت في نص التدريب (data sparsity)","Most long word sequences never appear in the training text (data sparsity)"],
       ["لأنها محتاجة GPU","Because they need a GPU"],
       ["لأنها مش بتعرف تعدّ","Because they cannot count"],
       ["لأنها بتستخدم attention","Because they use attention"]],
      0,"كل ما السياق يطول، عدد التسلسلات الممكنة بيكبر جدًا، فمعظمها عدّه صفر أو مش موثوق.","As the context grows, the number of possible sequences explodes, so most counts are zero or unreliable."),
   CQ("الـ vocabulary فيها 10,000 كلمة. كام trigram ممكن؟","A vocabulary has 10,000 words. How many possible trigrams are there?",
      [["1,000,000,000,000","1,000,000,000,000"],["100,000,000","100,000,000"],["30,000","30,000"],["10,000","10,000"]],
      0,"10,000^3 = 10^12. الرقم 100,000,000 هو عدد الـ bigrams (10,000^2).","10,000^3 = 10^12. The number 100,000,000 is the count of bigrams (10,000^2).")
 ],
 f:[
   CF("إيه المراحل الأربع للـ NLP في المحاضرة؟","What are the four stages of NLP in this lecture?",
      "القواعد (symbolic)، الإحصائية (n-gram وSMT)، العصبية (word2vec وseq2seq وattention)، والـ pretrained LLMs.",
      "Rules (symbolic), statistical (n-gram and SMT), neural (word2vec, seq2seq, attention), and pretrained LLMs."),
   CF("إيه هو الـ data sparsity؟","What is data sparsity?",
      "معظم تسلسلات الكلمات الممكنة عمرها ما ظهرت في نص التدريب، فعدّها صفر أو مش موثوق.",
      "Most possible word sequences never appear in the training text, so their counts are zero or unreliable.")
 ],
 terms:[
   {t:B("Symbolic NLP","Symbolic NLP"),
    d:B("NLP مبني على قواعد وقواميس بيكتبها الناس بإيديهم، واللغة فيه رموز منفصلة.","NLP built on hand-written rules and dictionaries, where language is treated as discrete symbols.")},
   {t:B("N-gram model","N-gram model"),
    d:B("language model بيقدّر الكلمة الجاية من عدّ آخر n-1 كلمة في نص كبير.","A language model that estimates the next word from counts of the last n-1 words in a large text.")},
   {t:B("Data sparsity","Data sparsity"),
    d:B("معظم تسلسلات الكلمات الممكنة ما بتظهرش في نص التدريب، فعدّها صفر أو مش موثوق.","Most possible word sequences never appear in the training text, so their counts are zero or unreliable.")},
   {t:B("Statistical machine translation (SMT)","Statistical machine translation (SMT)"),
    d:B("ترجمة آلية بتتعلم من العدّ في نصوص متوازية كبيرة، قبل ما الموديلات العصبية تظهر.","Machine translation that learns from counts in large parallel text, before neural models appeared.")},
   {t:B("Seq2seq","Seq2seq"),
    d:B("موديل عصبي بيقرا تسلسل دخل ويكتب تسلسل خرج، زي جملة وترجمتها.","A neural model that reads an input sequence and writes an output sequence, such as a sentence and its translation.")},
   {t:B("Attention","Attention"),
    d:B("آلية بتخلي الموديل يرجع يبص على كل كلمة دخل ويوزن أهميتها لخطوة الخرج الحالية.","A mechanism that lets the model look back at every input word and weigh how much each one matters for the current output step.")},
   {t:B("Pretrained language model","Pretrained language model"),
    d:B("موديل كبير بيتدرّب الأول على التنبؤ بالكلمات في نص خام، وبعدين بنكيّفه لمهمة بـ fine-tuning أو prompting.","A large model first trained to predict words in raw text, then adapted to a task by fine-tuning or prompting.")}
 ]},

{id:"l1-paradigms",t:B("افتراضاتنا عن اللغة بتحدد المتاح","Our assumptions about language set what is possible"),
 b:cat(B('<p>كل نظام NLP بيجاوب على تلات أسئلة عن اللغة، حتى لو محدش قالها بصوت عالي. الإجابات هي اللي بتحدد النظام يقدر يعمل إيه.</p>',
         '<p>Every NLP system answers three questions about language, even when nobody says them out loud. The answers decide what the system can do.</p>'),
       FIG_PARA,
       B('<p><mark>الكلمة رمز منفصل؟</mark> القواعد والـ n-gram بيقولوا آه: الكلمة <mark>discrete symbol</mark> (ID) ملهاش علاقة بباقي الكلمات. الموديلات العصبية بتقول لأ: الكلمة نقطة في فراغ متصل.</p>'+
         '<p><mark>قد إيه من السياق بيتحسب؟</mark> القاعدة بتشوف pattern، والـ n-gram بيشوف آخر n-1 كلمة، والموديل العصبي بيشوف window أو جملة كاملة، والـ LLM بيشوف نص طويل.</p>'+
         '<p><mark>المعنى ساكن فين؟</mark> في الأنظمة الرمزية الناس بتكتبه. في <mark>distributional semantics</mark>، الفكرة اللي المحاضرة بتبدأ بيها، المعنى ساكن في السياقات اللي الكلمة بتظهر فيها، فينفع يتعلّم من نص خام.</p>'+
         '<p>نفس الكلمات بافتراضين. رموز منفصلة: تشابه hotel و motel صفر. بـ vectors: <code>hotel = [0.8, 0.6, 0.1]</code> و <code>motel = [0.7, 0.7, 0.2]</code> و <code>banana = [0.0, 0.1, 0.9]</code>، الـ cosine بين hotel و motel <code>0.99</code>، وبين hotel و banana <code>0.16</code> بس.</p>'+
         '<p>غلطة شائعة: إن السياق معناه نفس الحاجة في كل مكان. سياق الـ n-gram آخر كلمات قليلة، وسياق الموديل المتدرّب مسبقًا ممكن يبقى آلاف الـ tokens.</p>',
         '<p><mark>Is a word a separate symbol?</mark> Rules and n-grams say yes: a word is a <mark>discrete symbol</mark> (an ID) with no relation to other words. Neural models say no: a word is a point in a continuous space.</p>'+
         '<p><mark>How much context counts?</mark> A rule sees a pattern, an n-gram sees the last n-1 words, a neural model sees a window or a whole sentence, and an LLM sees a long text.</p>'+
         '<p><mark>Where does meaning live?</mark> In symbolic systems people write it. In <mark>distributional semantics</mark>, the idea this lecture starts with, it lives in the contexts a word appears in, so it can be learned from raw text.</p>'+
         '<p>Same words, two assumptions. Separate symbols: the similarity of hotel and motel is 0. With vectors <code>hotel = [0.8, 0.6, 0.1]</code>, <code>motel = [0.7, 0.7, 0.2]</code> and <code>banana = [0.0, 0.1, 0.9]</code>, the cosine of hotel and motel is <code>0.99</code>, and of hotel and banana only <code>0.16</code>.</p>'+
         '<p>Common mistake: thinking context means the same thing everywhere. An n-gram context is the last few words, while a pretrained model context can be thousands of tokens.</p>')),
 q:[
   CQ("أنهي افتراض بيخلي word2vec يتعلم معنى الكلمة من نص خام من غير قاموس؟","Which assumption lets word2vec learn word meaning from raw text with no dictionary?",
      [["المعنى ساكن في السياقات اللي الكلمة بتظهر فيها","Meaning lives in the contexts a word appears in"],
       ["كل كلمة رمز منفصل","Every word is a separate symbol"],
       ["المعنى لازم الخبراء يكتبوه","Meaning must be written by experts"],
       ["آخر كلمتين بس هم المهمين","Only the last two words matter"]],
      0,"ده الـ distributional semantics: الكلمات اللي في سياقات متشابهة ليها معاني متشابهة، فالسياق نفسه هو الإشارة اللي بنتعلم منها.","This is distributional semantics: words in similar contexts have similar meanings, so the context itself is the signal we learn from."),
   CQ("بـ hotel = [0.8, 0.6, 0.1] و motel = [0.7, 0.7, 0.2]، كام الـ dot product؟","With hotel = [0.8, 0.6, 0.1] and motel = [0.7, 0.7, 0.2], what is the dot product?",
      [["1.00","1.00"],["0.00","0.00"],["0.56","0.56"],["1.30","1.30"]],
      0,"0.56 + 0.42 + 0.02 = 1.00. مع one-hot كان هيبقى صفر.","0.56 + 0.42 + 0.02 = 1.00. With one-hot it would have been 0.")
 ],
 f:[
   CF("إيه التلات أسئلة اللي بتحدد كل مرحلة في الـ NLP؟","What three questions define each stage of NLP?",
      "الكلمة رمز منفصل؟ قد إيه من السياق بيتحسب؟ والمعنى ساكن فين؟",
      "Is a word a separate symbol? How much context counts? Where does meaning live?"),
   CF("إيه الافتراض اللي بيضيفه distributional semantics؟","Which assumption does distributional semantics add?",
      "المعنى ساكن في السياقات اللي الكلمة بتظهر فيها، فينفع يتعلّم من نص خام.",
      "Meaning lives in the contexts a word appears in, so it can be learned from raw text.")
 ],
 terms:[
   {t:B("Discrete symbol","Discrete symbol"),
    d:B("كلمة معتبرة ID منفصل من غير علاقة جاهزة بباقي الكلمات، زي الـ one-hot vector.","A word treated as a separate ID with no built-in relation to other words, like a one-hot vector.")}
 ]},

{id:"l1-onehot",t:B("الكمبيوتر بيفهم أرقام مش كلمات","Computers understand numbers, not words"),
 b:cat(B('<p>أي موديل بيتعامل مع لغة لازم يحوّل كل كلمة لأرقام. أبسط طريقة اسمها <mark>one-hot vector</mark>.</p>'+
         '<p>لو الـ vocabulary فيها 500,000 كلمة، كل كلمة بتبقى vector طوله 500,000، كله أصفار إلا خانة واحدة بواحد.</p>',
         '<p>Any model that works with language must turn each word into numbers. The simplest way is a <mark>one-hot vector</mark>.</p>'+
         '<p>With a vocabulary of 500,000 words, each word becomes a vector of length 500,000: all zeros except a single 1.</p>'),
       FIG1,
       B('<p>المشكلة الأولى: الحجم ضخم. المشكلة التانية أهم: أي كلمتين مختلفتين الـ <mark>dot product</mark> بينهم صفر، فالموديل مش شايف إن <code>hotel</code> و <code>motel</code> قريبين في المعنى.</p>',
         '<p>Problem one: the size is huge. Problem two matters more: the <mark>dot product</mark> of any two different words is zero, so the model cannot see that <code>hotel</code> and <code>motel</code> are close in meaning.</p>'),
       B('<p>أرقام سريعة: الـ dense vector بطول 300 أقصر حوالي 1,667 مرة من one-hot لـ 500,000 كلمة. غلطة شائعة: المشكلة مش الحجم بس. حتى مع vocabulary صغيرة، أي كلمتين مختلفتين dot product بينهم صفر.</p>',
  '<p>Quick numbers: a 300-dimensional dense vector is about 1,667 times shorter than a one-hot vector for 500,000 words. Common mistake: the problem is not only the size. Even with a small vocabulary, any two different words still have dot product zero.</p>')),
 q:[
   {q:B("لو استخدمنا one-hot، الـ dot product بين hotel و motel بيساوي كام؟","With one-hot vectors, what is the dot product of hotel and motel?"),
    o:[B("1","1"),B("0","0"),B("0.5","0.5"),B("بيعتمد على حجم الـ vocabulary","It depends on the vocabulary size")],
    a:1,w:B("كل vector فيه واحد في خانة مختلفة، فحاصل الضرب صفر لأي كلمتين مختلفتين.","Each vector has its 1 in a different position, so the product is zero for any two different words.")},
   CQ("الـ vocabulary فيها 20,000 كلمة. كام قيمة في الـ one-hot vector لكلمة واحدة، وكام منهم بواحد؟","The vocabulary has 20,000 words. How many values does one one-hot vector hold, and how many of them are 1?",
   [["20,000 قيمة، كلهم واحد","20,000 values, all of them are 1"],["قيمة واحدة بس","A single value"],["20,000 قيمة، واحدة منهم بواحد","20,000 values, exactly one of them is 1"],["300 قيمة، واحدة منهم بواحد","300 values, exactly one of them is 1"]],
   2,"الطول بحجم الـ vocabulary، وخانة واحدة بس هي اللي فيها 1.","The length equals the vocabulary size, and only one position holds a 1.")
 ],
 f:[
   {q:B("إيه المشكلة الأساسية في one-hot vectors؟","What is the core problem with one-hot vectors?"),
    a:B("حجمها بحجم الـ vocabulary، وأي كلمتين مختلفتين dot product بينهم صفر، فمفيش مفهوم للتشابه.","Their size equals the vocabulary, and any two different words have dot product zero, so there is no notion of similarity.")},
   CF("الـ dense vector بطول 300 أصغر قد إيه من one-hot لـ vocabulary بـ 500,000 كلمة؟","How much smaller is a 300-long dense vector than a one-hot vector for a 500,000-word vocabulary?",
   "حوالي 1,667 مرة (500,000 / 300).","About 1,667 times smaller (500,000 / 300).")
 ],
 terms:[
   {t:B("One-hot vector","One-hot vector"),
 d:B("vector طوله بحجم الـ vocabulary، كله أصفار إلا خانة واحدة فيها 1.","A vector as long as the vocabulary, all zeros except a single 1.")},
{t:B("Vocabulary","Vocabulary"),
 d:B("مجموعة الكلمات اللي الموديل يعرفها، وكل كلمة فيها ليها vector.","The set of words the model knows, each with its own vector.")}
 ]},

{id:"l1-distributional",t:B("معنى الكلمة من الكلمات اللي حواليها","A word's meaning comes from its neighbors"),
 b:cat(B('<p>الفكرة اللي بنيت عليها المجال كله: <mark>معنى الكلمة بيتحدد من الكلمات اللي بتظهر حواليها</mark>. اسمها <mark>distributional semantics</mark>.</p>'+
         '<p>لو شفت <code>banking</code> آلاف المرات جوه جمل زي "the government regulates banking" و "banking crises", السياقات دي هي اللي بتوصف معناها.</p>'+
         '<p>فبدل one-hot، بنعمل لكل كلمة <mark>dense vector</mark> قصير (عادةً 100 إلى 300 رقم) بحيث الكلمات اللي بتظهر في سياقات متشابهة تبقى vectors بتاعتها قريبة من بعض. الاسم: <mark>word vectors</mark> أو <mark>word embeddings</mark>.</p>'+
         '<div class="m">banking = [0.29, 0.79, -0.18, -0.32, ...]</div>',
         '<p>The idea the whole field is built on: <mark>a word\'s meaning is determined by the words that appear around it</mark>. This is <mark>distributional semantics</mark>.</p>'+
         '<p>If you see <code>banking</code> thousands of times in sentences like "the government regulates banking" and "banking crises", those contexts describe its meaning.</p>'+
         '<p>So instead of one-hot, we give each word a short <mark>dense vector</mark> (usually 100 to 300 numbers) such that words in similar contexts get similar vectors. These are called <mark>word vectors</mark> or <mark>word embeddings</mark>.</p>'+
         '<div class="m">banking = [0.29, 0.79, -0.18, -0.32, ...]</div>'),
       FIG2,
       B('<p>غلطة شائعة: السياقات المتشابهة مش بتخلي الكلمتين متطابقتين. <code>hotel</code> و <code>motel</code> بياخدوا vectors قريبة مش نفس الـ vector، والموديل بيتعلم ده من النص لوحده من غير قاموس.</p>',
  '<p>Common mistake: similar contexts do not make two words identical. <code>hotel</code> and <code>motel</code> get close vectors, not the same vector, and the model learns this from raw text alone, with no dictionary.</p>')),
 q:[
   {q:B("في distributional semantics، إيه اللي بيحدد معنى الكلمة؟","In distributional semantics, what determines a word's meaning?"),
    o:[B("تعريفها في القاموس","Its dictionary definition"),B("السياق اللي بتظهر فيه","The contexts it appears in"),B("عدد حروفها","Its number of letters"),B("أول حرف فيها","Its first letter")],
    a:1,w:B("الكلمات المحيطة بيها في النصوص هي اللي بتحدد معناها.","The surrounding words in text are what define its meaning.")},
   CQ("كلمتين زي hotel و motel بتظهر في سياقات متشابهة جدًا. إيه المتوقع لـ vectors بتاعتهم؟","Two words such as hotel and motel appear in very similar contexts. What do we expect of their vectors?",
   [["قريبين من بعض","Close to each other"],["متعامدين (dot product صفر)","Orthogonal (dot product zero)"],["عكس بعض","Opposite to each other"],["متطابقين بالظبط","Exactly identical"]],
   0,"السياقات المتشابهة بتدي vectors قريبة، لكن مش متطابقة بالظبط.","Similar contexts give close vectors, though not exactly identical ones.")
 ],
 f:[
   {q:B("إيه هي distributional semantics؟","What is distributional semantics?"),
    a:B("فكرة إن معنى الكلمة بيتحدد من السياقات اللي بتظهر فيها، وعلى أساسها بنعمل dense vectors قصيرة للكلمات.","The idea that a word's meaning is defined by the contexts it appears in; on that basis we build short dense vectors for words.")},
   CF("مين الـ linguist المرتبط بفكرة إن الكلمة بتتفهم من الكلمات اللي حواليها؟","Which linguist is associated with the idea that a word is understood through the words around it?",
   "J. R. Firth، سنة 1957.","J. R. Firth, in 1957.")
 ],
 terms:[
   {t:B("Distributional semantics","Distributional semantics"),
 d:B("فكرة إن معنى الكلمة بيتحدد من السياقات اللي بتظهر فيها.","The idea that a word's meaning is determined by the contexts it appears in.")},
{t:B("Word embedding","Word embedding"),
 d:B("dense vector قصير (عادةً 100 إلى 300 رقم) لكل كلمة، والكلمات المتشابهة سياقيًا vectors بتاعتها قريبة. بيتسمى كمان word vector.","A short dense vector (usually 100 to 300 numbers) for each word, where words in similar contexts get close vectors. Also called a word vector.")},
{t:B("Dense vector","Dense vector"),
 d:B("vector قصير أغلب خاناته مش صفر، عكس الـ one-hot.","A short vector whose entries are mostly nonzero, the opposite of one-hot.")}
 ]},

{id:"l1-skipgram",t:B("Skip-gram: نتنبأ بالسياق","Skip-gram: predicting the context"),
 b:cat(B('<p><mark>Word2Vec</mark> (Mikolov وآخرين، 2013) طريقة تتعلم الـ word vectors من نص خام. النسخة اللي بندرسها اسمها <mark>Skip-gram</mark>.</p>'+
         '<p>بنمشي على النص كلمة كلمة. الكلمة في الموضع <code>t</code> هي الـ <mark>center word</mark> <code>c</code>، والكلمات اللي حواليها في نافذة حجمها <code>m</code> هي الـ <mark>context words</mark> <code>o</code>. الهدف إننا نتنبأ بالسياق من الـ center.</p>',
         '<p><mark>Word2Vec</mark> (Mikolov et al., 2013) learns word vectors from raw text. The version we study is <mark>Skip-gram</mark>.</p>'+
         '<p>We slide through the text word by word. The word at position <code>t</code> is the <mark>center word</mark> <code>c</code>, and the words around it within a window of size <code>m</code> are the <mark>context words</mark> <code>o</code>. The goal is to predict the context from the center.</p>'),
       FIG3,
       B('<p>لكل كلمة w بنتعلم vector اتنين: <code>v_w</code> لما تبقى center، و <code>u_w</code> لما تبقى context. والاحتمال بيتحسب بـ <mark>softmax</mark>:</p>'+
         '<div class="m">P(o | c) = exp(u_o . v_c) / sum_w exp(u_w . v_c)</div>'+
         '<p>الـ dot product بيقيس التشابه، والـ exp والقسمة بيحولوه لاحتمال.</p>',
         '<p>For each word w we learn two vectors: <code>v_w</code> when it is the center, and <code>u_w</code> when it is context. The probability is computed with a <mark>softmax</mark>:</p>'+
         '<div class="m">P(o | c) = exp(u_o . v_c) / sum_w exp(u_w . v_c)</div>'+
         '<p>The dot product measures similarity; exp and the division turn it into a probability.</p>')),
 q:[
   {q:B("في Skip-gram بنتنبأ بإيه؟","In Skip-gram, what do we predict?"),
    o:[B("الـ center من كلمات السياق","The center from its context words"),B("كلمات السياق من الـ center","The context words from the center"),B("الكلمة الجاية بس","Only the next word"),B("حروف الكلمة","The letters of the word")],
    a:1,w:B("Skip-gram بياخد الـ center word وبيتنبأ بالكلمات اللي حواليه.","Skip-gram takes the center word and predicts the words around it.")},
   CQ("الجملة problems turning into banking crises والـ center هو into، و m = 2. إيه الكلمات اللي بنتنبأ بيها؟","In the sentence problems turning into banking crises with center into and m = 2, which words do we predict?",
   [["banking و crises بس","Only banking and crises"],["problems و turning بس","Only problems and turning"],["into نفسها","into itself"],["problems و turning و banking و crises","problems, turning, banking and crises"]],
   3,"الـ window بتشمل اتنين من كل ناحية، يعني 4 كلمات.","The window covers two words on each side, so 4 words.")
 ],
 f:[
   {q:B("ليه بنتعلم vector اتنين لكل كلمة في Word2Vec؟","Why does Word2Vec learn two vectors per word?"),
    a:B("v_w لما الكلمة تبقى center، و u_w لما تبقى context. والاحتمال P(o|c) = softmax على u_o . v_c.","v_w when the word is the center, u_w when it is context. The probability P(o|c) is a softmax over u_o . v_c.")},
   CF("مين اللي قدّم Word2Vec وإمتى؟","Who introduced Word2Vec and when?",
   "Mikolov وآخرين، سنة 2013.","Mikolov et al., 2013.")
 ],
 terms:[
   {t:B("Word2Vec","Word2Vec"),
 d:B("طريقة (Mikolov وآخرين، 2013) بتتعلم word vectors من نص خام، ولها نسختين: Skip-gram و CBOW.","A method (Mikolov et al., 2013) that learns word vectors from raw text, in two versions: Skip-gram and CBOW.")},
{t:B("Skip-gram","Skip-gram"),
 d:B("موديل Word2Vec بيتنبأ بكلمات السياق من الـ center word باستخدام softmax على <code>u_o . v_c</code>.","A Word2Vec model that predicts the context words from the center word using a softmax over <code>u_o . v_c</code>.")},
{t:B("Center word","Center word"),
 d:B("الكلمة في الموضع t اللي بنتنبأ منها في Skip-gram.","The word at position t that Skip-gram predicts from.")},
{t:B("Context word","Context word"),
 d:B("الكلمات اللي حوالين الـ center جوه الـ window، وهي اللي بنتنبأ بيها.","The words around the center inside the window, which are the ones being predicted.")},
{t:B("Softmax","Softmax"),
 d:B("دالة بتحوّل scores لاحتمالات مجموعها 1: exp لكل score وقسمة على مجموع الـ exp.","A function that turns scores into probabilities that sum to 1: exp of each score, divided by the sum of the exps.")}
 ]},

{id:"l1-cbow",t:B("CBOW مقابل Skip-gram","CBOW versus Skip-gram"),
 b:cat(B('<p>Word2Vec ليه نسختين، كل واحدة عكس التانية. <mark>Skip-gram</mark> بيتنبأ بالسياق من الـ center. <mark>CBOW</mark> (Continuous Bag of Words) بيتنبأ بالـ center من السياق.</p>',
         '<p>Word2Vec comes in two versions, each the mirror of the other. <mark>Skip-gram</mark> predicts the context from the center. <mark>CBOW</mark> (Continuous Bag of Words) predicts the center from the context.</p>'),
       FIG7,
       B('<p>في CBOW بناخد متوسط vectors كلمات السياق ونحطه في softmax. (الـ <code>v</code> للكلمات اللي بتدخل الموديل، والـ <code>u</code> للكلمة اللي بنتنبأ بيها.)</p>'+
         '<div class="m">v_avg = (1/2m) * sum_{-m<=j<=m, j!=0} v_{w_{t+j}}\nP(c | context) = exp(u_c . v_avg) / sum_w exp(u_w . v_avg)</div>'+
         '<p>مثال بـ m = 2 والـ center هو <code>into</code>: Skip-gram بيطلّع <mark>4 أزواج</mark> تدريب، لكن CBOW بيطلّع <mark>تنبؤ واحد</mark> بس. عشان كده Skip-gram أبطأ، لكن كل كلمة بتاخد تحديثات أكتر، فهو أحسن مع الداتا الصغيرة والكلمات النادرة. CBOW أسرع وأحسن شوية مع الكلمات الشائعة.</p>'+
         '<p>غلطة شائعة: المتوسط بيشيل الترتيب، فـ CBOW مش بيعرف مين جه قبل مين.</p>',
         '<p>In CBOW we average the vectors of the context words and feed the average into a softmax. (<code>v</code> is for words that go into the model, and <code>u</code> is for the word being predicted.)</p>'+
         '<div class="m">v_avg = (1/2m) * sum_{-m<=j<=m, j!=0} v_{w_{t+j}}\nP(c | context) = exp(u_c . v_avg) / sum_w exp(u_w . v_avg)</div>'+
         '<p>Example with m = 2 and center <code>into</code>: Skip-gram produces <mark>4 training pairs</mark>, while CBOW produces only <mark>one prediction</mark>. That is why Skip-gram is slower, but each word gets more updates, so it does better on small data and rare words. CBOW is faster and slightly better on frequent words.</p>'+
         '<p>Common mistake: averaging throws away order, so CBOW does not know which context word came before which.</p>')),
 q:[
   CQ("CBOW بيتنبأ بإيه؟","What does CBOW predict?",
      [["كلمات السياق من الـ center","The context words from the center"],["الـ center من متوسط vectors كلمات السياق","The center from the average of its context word vectors"],["الكلمة الجاية بس","Only the next word"],["ترتيب الكلمات في الجملة","The order of the words in the sentence"]],
      1,"CBOW بيجمع السياق (بالمتوسط) وبيتنبأ بالـ center.","CBOW combines the context (by averaging) and predicts the center."),
   CQ("m = 3 والـ center في نص الجملة. كام زوج تدريب بيطلّع Skip-gram، وكام تنبؤ بيطلّع CBOW؟","With m = 3 and the center in the middle of the sentence, how many training pairs does Skip-gram produce, and how many predictions does CBOW produce?",
      [["1 و 6","1 and 6"],["3 و 1","3 and 1"],["6 و 1","6 and 1"],["6 و 6","6 and 6"]],
      2,"Skip-gram: 2m = 6 أزواج. CBOW: تنبؤ واحد بيجمع الـ 6 كلمات.","Skip-gram: 2m = 6 pairs. CBOW: one prediction that combines the 6 words.")
 ],
 f:[
   CF("إيه الفرق بين CBOW و Skip-gram؟","What is the difference between CBOW and Skip-gram?",
      "CBOW بيتنبأ بالـ center من متوسط vectors السياق (تنبؤ واحد لكل موضع). Skip-gram بيتنبأ بكل كلمة سياق من الـ center (2m زوج).",
      "CBOW predicts the center from the average of the context vectors (one prediction per position). Skip-gram predicts each context word from the center (2m pairs)."),
   CF("امتى تفضّل Skip-gram على CBOW؟","When would you prefer Skip-gram over CBOW?",
      "لما الداتا صغيرة أو الكلمات النادرة مهمة، لأنه بيدي كل كلمة تحديثات أكتر. CBOW أسرع وأحسن شوية للكلمات الشائعة.",
      "When the data is small or rare words matter, because it gives each word more updates. CBOW is faster and slightly better for frequent words.")
 ],
 terms:[
   {t:B("CBOW","CBOW"),
    d:B("موديل Word2Vec بيتنبأ بالـ center من متوسط vectors كلمات السياق.","A Word2Vec model that predicts the center word from the average of its context word vectors.")}
 ]},

{id:"l1-window",t:B("حجم الـ window: m","The window size m"),
 b:cat(B('<p>الـ <mark>window size</mark> أو <code>m</code> هو اللي بيحدد يعني إيه سياق. كل ما <code>m</code> يكبر، كل center بيتنبأ بكلمات أكتر وأبعد عنه.</p>'+
         '<p>كل موضع بيطلّع لحد <code>2m</code> زوج (أقل عند أطراف النص)، يعني التكلفة بتزيد خطيًا مع <code>m</code>. لو <code>T</code> هو عدد كلمات النص:</p>'+
         '<div class="m">pairs ≈ T * 2m\nT = 1000, m = 2: about 4,000 pairs\nT = 1000, m = 5: about 10,000 pairs</div>'+
         '<p>الحجم كمان بيغيّر نوع التشابه اللي بيطلع. window صغير (1 إلى 2) بيدي كلمات متشابهة نحويًا ووظيفيًا. window أكبر (5 إلى 10) بيدي كلمات عن نفس الموضوع، زي <code>hospital</code> و <code>doctor</code>.</p>'+
         '<p>غلطة شائعة: Skip-gram بيستخدم نفس <code>P(o | c)</code> لأي كلمة سياق جوه الـ window، سواء كانت جنب الـ center أو بعيدة عنه. المسافة مش جزء من الموديل. (كود Word2Vec الأصلي بيسحب حجم الـ window عشوائيًا من 1 لـ <code>m</code> لكل center، فالكلمات القريبة بتتستخدم أكتر.)</p>',
         '<p>The <mark>window size</mark> <code>m</code> decides what counts as context. The larger <code>m</code> is, the more words, and the farther ones, each center predicts.</p>'+
         '<p>Each position produces up to <code>2m</code> pairs (fewer near the edges of the text), so the cost grows linearly with <code>m</code>. With <code>T</code> words in the text:</p>'+
         '<div class="m">pairs ≈ T * 2m\nT = 1000, m = 2: about 4,000 pairs\nT = 1000, m = 5: about 10,000 pairs</div>'+
         '<p>The size also changes the kind of similarity you get. A small window (1 to 2) gives words that are syntactically and functionally similar. A larger window (5 to 10) gives words about the same topic, such as <code>hospital</code> and <code>doctor</code>.</p>'+
         '<p>Common mistake: Skip-gram uses the same <code>P(o | c)</code> for every context word in the window, whether it sits next to the center or far from it. Distance is not part of the model. (The original Word2Vec code samples the window size from 1 to <code>m</code> for each center, so nearby words are used more often.)</p>')),
 q:[
   CQ("عايز vectors بتجمّع كلمات عن نفس الموضوع (زي hospital و doctor). تستخدم window...","You want vectors that group words about the same topic (like hospital and doctor). Which window do you use?",
      [["أصغر (1 إلى 2)","A smaller one (1 to 2)"],["الحجم ملوش تأثير","The size has no effect"],["حجمه صفر","Size zero"],["أكبر (5 إلى 10)","A larger one (5 to 10)"]],
      3,"الـ window الأكبر بيلقط ارتباط الموضوع، والأصغر بيلقط التشابه النحوي والوظيفي.","A larger window captures topical relatedness; a smaller one captures syntactic and functional similarity."),
   CQ("نص فيه 2,000 كلمة و m = 3. كام زوج تدريب تقريبًا؟","A text has 2,000 words and m = 3. About how many training pairs is that?",
      [["6,000","6,000"],["2,000","2,000"],["12,000","12,000"],["3,000","3,000"]],
      2,"2m = 6 أزواج لكل موضع، و 2,000 * 6 = 12,000.","2m = 6 pairs per position, and 2,000 * 6 = 12,000.")
 ],
 f:[
   CF("إيه تأثير تكبير الـ window؟","What happens when you enlarge the window?",
      "عدد الأزواج (2m لكل موضع) والتكلفة بيزيدوا، والـ vectors بتميل لتشابه الموضوع بدل التشابه النحوي.",
      "The number of pairs (2m per position) and the cost grow, and the vectors lean toward topical similarity instead of syntactic similarity."),
   CF("كام زوج تدريب بيطلّع الموضع الواحد؟","How many training pairs does one position produce?",
      "لحد 2m زوج (center, context)، وأقل عند أطراف النص.",
      "Up to 2m (center, context) pairs, fewer near the edges of the text.")
 ],
 terms:[
   {t:B("Window size (m)","Window size (m)"),
    d:B("عدد الكلمات على كل ناحية من الـ center اللي بنعتبرها سياق.","The number of words on each side of the center that count as its context.")}
 ]},

{id:"l1-loss",t:B("الـ loss اللي بنقلله","The loss we minimize"),
 b:cat(B('<p>عايزين نظبط الـ vectors بحيث احتمال الكلمات اللي ظهرت فعلًا في السياق يبقى عالي. بنعرّف الـ loss كمتوسط الـ <mark>negative log likelihood</mark> على كل مواضع النص:</p>'+
         '<div class="m">J(theta) = -(1/T) * sum_t sum_{-m<=j<=m, j!=0} log P(w_{t+j} | w_t)</div>'+
         '<p><code>T</code> عدد كلمات النص، و <code>theta</code> هي كل الـ vectors (الـ u والـ v لكل الكلمات). بنقلل <code>J</code> بـ <mark>gradient descent</mark>، وعمليًا بـ SGD (stochastic gradient descent) على دفعات صغيرة.</p>',
         '<p>We want to tune the vectors so that words that actually appeared in the context get high probability. We define the loss as the average <mark>negative log likelihood</mark> over all positions in the text:</p>'+
         '<div class="m">J(theta) = -(1/T) * sum_t sum_{-m<=j<=m, j!=0} log P(w_{t+j} | w_t)</div>'+
         '<p><code>T</code> is the number of words in the text, and <code>theta</code> is all the vectors (u and v for every word). We minimize <code>J</code> with <mark>gradient descent</mark>, in practice SGD (stochastic gradient descent) on small batches.</p>'),
       FIG4,
       B('<p>لما الموديل يدي احتمال عالي للكلمات الحقيقية، الـ loss بيقل.</p>',
         '<p>When the model gives high probability to the real words, the loss goes down.</p>'),
       B('<p>مثال صغير: احتمال 0.5 لكلمة سياق حقيقية بيدي loss = -ln(0.5) ≈ 0.69، واحتمال 0.9 بيدي ≈ 0.11. الـ loss عمره ما بينزل تحت صفر، وبيوصل لصفر لما الاحتمال يبقى 1 بس.</p>',
  '<p>Small example: probability 0.5 for a real context word gives loss = -ln(0.5) ≈ 0.69, and probability 0.9 gives ≈ 0.11. The loss never goes below zero, and it reaches zero only when the probability is 1.</p>')),
 q:[
   {q:B("عشان الـ loss يقل، الموديل لازم...","For the loss to go down, the model must..."),
    o:[B("يدي احتمال عالي لكلمات السياق الحقيقية","Give high probability to the real context words"),B("يدي احتمال واطي لكلمات السياق الحقيقية","Give low probability to the real context words"),B("يكبّر حجم الـ vocabulary","Enlarge the vocabulary"),B("يستخدم window أكبر","Use a bigger window")],
    a:0,w:B("الـ loss هو سالب log الاحتمال، فكل ما الاحتمال يعلى الـ loss يقل.","The loss is minus the log probability, so the higher the probability, the lower the loss.")},
   CQ("الموديل أدّى للكلمة الحقيقية احتمال 0.5. الـ loss بالتقريب كام؟","The model gave the real word probability 0.5. What is the loss, approximately?",
   [["0.5","0.5"],["0.69","0.69"],["1.0","1.0"],["2.0","2.0"]],
   1,"-ln(0.5) ≈ 0.69.","-ln(0.5) ≈ 0.69.")
 ],
 f:[
   {q:B("إيه هو الـ loss في Skip-gram؟","What is the Skip-gram loss?"),
    a:B("متوسط negative log likelihood لكلمات السياق الحقيقية على كل مواضع النص، وبنقلله بـ gradient descent.","The average negative log likelihood of the real context words over all text positions, minimized with gradient descent.")},
   CF("ليه بنجمع log الاحتمالات بدل ما نضربها؟","Why do we sum log probabilities instead of multiplying probabilities?",
   "حاصل ضرب آلاف الاحتمالات الصغيرة بيقرّب من صفر. الـ log بيحوّله لمجموع، وده أسهل في الحساب والاشتقاق.",
   "A product of thousands of small probabilities shrinks toward zero. The log turns it into a sum, which is easier to compute and differentiate.")
 ],
 terms:[
   {t:B("Negative log likelihood","Negative log likelihood"),
 d:B("الـ loss = سالب log احتمال الكلمات الحقيقية. كل ما الاحتمال أعلى، الـ loss أقل.","The loss = minus the log probability of the real words. The higher the probability, the lower the loss.")}
 ]},

{id:"l1-softmax-example",t:B("مثال رقمي: softmax والـ loss","Worked example: softmax and the loss"),
 b:cat(B('<p>نحسب <code>P(o | c)</code> بإيدينا. الـ vocabulary 4 كلمات بس، والـ center هو <code>banking</code>. الـ <mark>scores</mark> (الـ dot products <code>u_w . v_c</code>) كالتالي:</p>'+
         '<div class="m">crises: 2.0   turning: 1.0   money: 0.0   dog: -1.0</div>'+
         '<p>أولًا exp لكل score، وبعدين نقسم على المجموع:</p>'+
         '<div class="m">exp: 7.389  2.718  1.000  0.368   sum = 11.475\nP:   0.644  0.237  0.087  0.032</div>',
         '<p>Let us compute <code>P(o | c)</code> by hand. The vocabulary has only 4 words, and the center is <code>banking</code>. The <mark>scores</mark> (the dot products <code>u_w . v_c</code>) are:</p>'+
         '<div class="m">crises: 2.0   turning: 1.0   money: 0.0   dog: -1.0</div>'+
         '<p>First exp of each score, then divide by the sum:</p>'+
         '<div class="m">exp: 7.389  2.718  1.000  0.368   sum = 11.475\nP:   0.644  0.237  0.087  0.032</div>'),
       FIG8,
       B('<p>لو الكلمة الحقيقية <code>crises</code>: loss = -ln(0.644) ≈ <mark>0.44</mark>. ولو كانت <code>dog</code>: loss = -ln(0.032) ≈ <mark>3.44</mark>. الموديل بيتعاقب أكتر لما يدي احتمال واطي للكلمة الحقيقية.</p>'+
         '<p>الـ gradient بتاع الـ loss على الـ scores هو <code>P - one-hot</code>. لـ crises: 0.644 - 1 = -0.356، والسالب معناه إن الـ gradient descent هيرفع الـ score بتاعها. غلطة شائعة: الاحتمالات مجموعها 1 دايمًا، فرفع score كلمة بينزّل احتمال الباقي.</p>',
         '<p>If the real word is <code>crises</code>: loss = -ln(0.644) ≈ <mark>0.44</mark>. If it were <code>dog</code>: loss = -ln(0.032) ≈ <mark>3.44</mark>. The model is punished more when it gives the real word a low probability.</p>'+
         '<p>The gradient of the loss with respect to the scores is <code>P - one-hot</code>. For crises: 0.644 - 1 = -0.356, and the negative sign means gradient descent will raise its score. Common mistake: the probabilities always sum to 1, so raising one score lowers the probability of the others.</p>')),
 q:[
   CQ("لو رفعنا score كلمة واحدة وسبنا الباقي زي ما هو، احتمال باقي الكلمات...","If we raise one word's score and leave the rest unchanged, the probability of the other words..."
      ,[["بيقل","goes down"],["بيزيد","goes up"],["بيفضل زي ما هو","stays the same"],["بيبقى سالب","becomes negative"]],
      0,"المجموع لازم يفضل 1، فلما احتمال كلمة يزيد باقي الاحتمالات بتقل.","The sum must stay 1, so when one word's probability goes up, the others go down."),
   CQ("كل الـ scores متساوية في vocabulary من 4 كلمات. لو الكلمة الحقيقية واحدة منهم، الـ loss بالتقريب كام؟","All scores are equal in a vocabulary of 4 words. If the real word is one of them, what is the loss, approximately?",
      [["0.25","0.25"],["2.5","2.5"],["4","4"],["1.39","1.39"]],
      3,"الاحتمال 1/4 = 0.25، و -ln(0.25) ≈ 1.39.","The probability is 1/4 = 0.25, and -ln(0.25) ≈ 1.39.")
 ],
 f:[
   CF("إزاي بنحسب softmax خطوة بخطوة؟","How do we compute softmax step by step?",
      "exp لكل score، وبعدين نقسم كل واحد على مجموع الـ exp. النتيجة احتمالات مجموعها 1.",
      "Take exp of each score, then divide each by the sum of the exps. The result is probabilities that sum to 1."),
   CF("إيه الـ gradient بتاع الـ loss على الـ scores؟","What is the gradient of the loss with respect to the scores?",
      "P - one-hot: احتمال كل كلمة، ونطرح 1 من الكلمة الحقيقية.",
      "P - one-hot: each word's probability, minus 1 for the real word.")
 ],
 terms:[
   {t:B("Logits","Logits"),
 d:B("الـ scores الخام قبل الـ softmax، واحد لكل class (أو لكل كلمة). في Skip-gram هو الـ dot product <code>u_w . v_c</code>.","The raw scores before the softmax, one per class (or per word). In Skip-gram it is the dot product <code>u_w . v_c</code>.")}
 ]},

{id:"l1-gradient",t:B("الـ gradient: الواقع ناقص المتوقع","The gradient: observed minus expected"),
 b:cat(B('<p>لما نشتق log الاحتمال بالنسبة للـ center vector بنلاقي:</p>'+
         '<div class="m">d log P(o|c) / d v_c = u_o - sum_w P(w|c) * u_w</div>'+
         '<p>الطرف الأول هو vector الكلمة اللي <mark>فعلًا</mark> ظهرت (observed). الطرف التاني هو المتوسط اللي الموديل <mark>كان متوقعه</mark> (expected). يعني الـ gradient = <mark>observed - expected</mark>.</p>',
         '<p>Differentiating the log probability with respect to the center vector gives:</p>'+
         '<div class="m">d log P(o|c) / d v_c = u_o - sum_w P(w|c) * u_w</div>'+
         '<p>The first term is the vector of the word that <mark>actually</mark> appeared (observed). The second is the average the model <mark>expected</mark>. So the gradient is <mark>observed - expected</mark>.</p>'),
       FIG5,
       B('<p>كل خطوة تقرّب <code>v_c</code> من الـ context الحقيقي وتبعده عن المتوسط اللي الموديل توقعه. ولما التوقع يطابق الواقع، الـ gradient يبقى صفر.</p>',
         '<p>Each step pulls <code>v_c</code> toward the true context and away from what the model expected. When expectation matches reality, the gradient is zero.</p>'),
       B('<p>مثال صغير: observed u_o = [1, 0] و expected = [0.4, 0.2] بيدوا gradient = [0.6, -0.2]، يعني التحديث بيرفع أول خانة في <code>v_c</code> وبيخفض التانية.</p>'+
  '<p>غلطة شائعة: ده gradient الـ log P، فبنمشي في اتجاهه عشان نرفع الاحتمال. أما الـ loss (سالب log P) فالإشارة بتتعكس وبنطرح الـ gradient.</p>',
  '<p>Small example: observed u_o = [1, 0] and expected = [0.4, 0.2] give gradient = [0.6, -0.2], so the update raises the first entry of <code>v_c</code> and lowers the second.</p>'+
  '<p>Common mistake: this is the gradient of log P, so we move along it to raise the probability. For the loss (minus log P) the sign flips and we subtract the gradient.</p>')),
 q:[
   {q:B("الـ gradient بالنسبة لـ v_c بيساوي...","The gradient with respect to v_c equals..."),
    o:[B("observed - expected","observed - expected"),B("expected - observed","expected - observed"),B("observed + expected","observed + expected"),B("observed * expected","observed * expected")],
    a:0,w:B("u_o هو الـ observed، والمجموع الموزون بالاحتمالات هو الـ expected.","u_o is the observed part, and the probability-weighted sum is the expected part.")},
   CQ("الـ observed هو u_o = [0, 1] والـ expected = [0.3, 0.5]. الـ gradient لـ log P بيساوي كام؟","With observed u_o = [0, 1] and expected = [0.3, 0.5], what is the gradient of log P?",
   [["[0.3, -0.5]","[0.3, -0.5]"],["[0.3, 1.5]","[0.3, 1.5]"],["[-0.3, 0.5]","[-0.3, 0.5]"],["[0, 0.5]","[0, 0.5]"]],
   2,"observed - expected = [0 - 0.3, 1 - 0.5] = [-0.3, 0.5].","observed - expected = [0 - 0.3, 1 - 0.5] = [-0.3, 0.5].")
 ],
 f:[
   {q:B("إيه معنى الـ gradient في Skip-gram بشكل حدسي؟","What does the Skip-gram gradient mean intuitively?"),
    a:B("observed - expected: بنقرّب v_c من الـ context الحقيقي ونبعده عن متوسط توقع الموديل.","observed - expected: we pull v_c toward the true context and away from the model's average expectation.")},
   CF("إزاي بنحدّث v_c بعد ما نحسب الـ gradient؟","How do we update v_c once we have the gradient?",
   "v_c ← v_c + η * (u_o - sum_w P(w | c) * u_w). بنتحرك في اتجاه observed - expected، و η هو الـ learning rate.",
   "v_c ← v_c + η * (u_o - sum_w P(w | c) * u_w). We move in the direction of observed - expected, and η is the learning rate.")
 ]},

{id:"l1-negsampling",t:B("Negative sampling والنتيجة","Negative sampling and the result"),
 b:cat(B('<p>مشكلة الـ softmax: المقام بيجمع على كل الـ vocabulary (مئات الآلاف) في كل خطوة، وده بطيء جدًا.</p>'+
         '<p>الحل: <mark>negative sampling</mark>. الزوج الحقيقي (center, context) بنعتبره positive، وبنسحب <code>k</code> كلمات عشوائية كـ negatives، وبنستخدم الـ sigmoid <code>σ</code> (بتضغط أي رقم لقيمة بين 0 و1):</p>'+
         '<div class="m">J = -log σ(u_o . v_c) - sum_k log σ(-u_k . v_c)</div>'+
         '<p>الهدف: dot product عالي للزوج الحقيقي وواطي للأزواج العشوائية. التكلفة بقت مرتبطة بـ <code>k</code> (كلمات قليلة) مش بحجم الـ vocabulary.</p>'+
         '<p>النتيجة إن الـ vectors بتعكس المعنى: الكلمات المتشابهة قريبة بالـ <mark>cosine similarity</mark>، وبتظهر علاقات زي:</p>'+
         '<div class="m">king - man + woman ≈ queen</div>',
         '<p>The softmax problem: the denominator sums over the whole vocabulary (hundreds of thousands of words) at every step, which is very slow.</p>'+
         '<p>The fix: <mark>negative sampling</mark>. The real (center, context) pair is a positive; we draw <code>k</code> random words as negatives and use the sigmoid <code>σ</code> (it squashes any number into a value between 0 and 1):</p>'+
         '<div class="m">J = -log σ(u_o . v_c) - sum_k log σ(-u_k . v_c)</div>'+
         '<p>Goal: a high dot product for the real pair and a low one for random pairs. The cost now depends on <code>k</code> (a few words), not on the vocabulary size.</p>'+
         '<p>The result: vectors that reflect meaning. Similar words are close under <mark>cosine similarity</mark>, and relations such as this appear:</p>'+
         '<div class="m">king - man + woman ≈ queen</div>'),
       FIG6),
 q:[
   {q:B("ليه بنستخدم negative sampling؟","Why do we use negative sampling?"),
    o:[B("عشان نتفادى الجمع على كل الـ vocabulary في الـ softmax","To avoid summing over the whole vocabulary in the softmax"),B("عشان نكبّر حجم الـ vectors","To make the vectors larger"),B("عشان نلغي الـ context","To remove the context"),B("عشان نرجع لـ one-hot","To go back to one-hot")],
    a:0,w:B("بنقارن الزوج الحقيقي بـ k أزواج عشوائية بس، فالتكلفة بتقل جدًا.","We compare the real pair to only k random pairs, so the cost drops a lot.")},
   CQ("k = 5 والـ vocabulary 500,000 كلمة. كام sigmoid بنحسب لكل زوج حقيقي في negative sampling؟","With k = 5 and a vocabulary of 500,000, how many sigmoids do we compute for each real pair in negative sampling?",
   [["5","5"],["6 (positive واحد و 5 negatives)","6 (one positive and 5 negatives)"],["500,000","500,000"],["500,001","500,001"]],
   1,"1 positive + 5 negatives = 6، بدل 500,000 في الـ softmax الكامل.","1 positive + 5 negatives = 6, instead of 500,000 in the full softmax.")
 ],
 f:[
   {q:B("إيه هو negative sampling؟","What is negative sampling?"),
    a:B("بدل softmax على كل الـ vocabulary، الزوج الحقيقي positive و k كلمات عشوائية negatives، ونستخدم sigmoid عشان الحساب يبقى رخيص.","Instead of a softmax over the whole vocabulary, the real pair is positive and k random words are negatives, using a sigmoid so the computation is cheap.")},
   CF("كام negative sample (k) بنستخدم عادةً؟","How many negative samples (k) are usually used?",
   "حوالي 5 إلى 20 للداتا الصغيرة، و 2 إلى 5 للداتا الكبيرة (Mikolov وآخرين).",
   "About 5 to 20 for small datasets and 2 to 5 for large ones (Mikolov et al.)."),
CF("الـ negatives بتتسحب من انهي توزيع؟","Which distribution are the negatives drawn from?",
   "توزيع تكرار الكلمات (unigram) مرفوع للأس 3/4، فالكلمات النادرة بتتسحب أكتر شوية والشائعة أقل.",
   "The word frequency (unigram) distribution raised to the power 3/4, so rare words are drawn a bit more often and frequent words less.")
 ],
 terms:[
   {t:B("Negative sampling","Negative sampling"),
 d:B("بدل softmax على كل الـ vocabulary، الزوج الحقيقي positive و <code>k</code> كلمات عشوائية negatives، مع sigmoid.","Instead of a softmax over the whole vocabulary, the real pair is positive and <code>k</code> random words are negatives, with a sigmoid.")},
{t:B("Cosine similarity","Cosine similarity"),
 d:B("مقياس تشابه بين vectors: الـ dot product مقسوم على حاصل ضرب الأطوال. قيمته بين -1 و 1.","A similarity measure between vectors: the dot product divided by the product of the lengths. Its value is between -1 and 1.")},
{t:B("Sigmoid","Sigmoid"),
 d:B("بتضغط أي رقم لقيمة بين 0 و1.","Squashes any number to a value between 0 and 1.")}
 ]},

{id:"l1-code-sgns",t:B("Skip-gram مع negative sampling بالكود","Skip-gram with negative sampling in code"),
 b:B('<p>خطوة تدريب واحدة من <mark>SGNS</mark> (skip-gram مع negative sampling) لزوج واحد: center vector واحد، و context vector حقيقي، و <code>k</code> negatives. الـ shapes في التعليقات.</p>'+
     '<div class="m">import numpy as np\nsig = lambda x: 1/(1+np.exp(-x))\n\ndef sgns(v, u_o, U_neg):\n    # v: (d,)  u_o: (d,)  U_neg: (k,d)\n    s_o = u_o @ v          # scalar\n    s_k = U_neg @ v        # (k,)\n    pos = -np.log(sig(s_o))\n    neg = -np.log(sig(-s_k)).sum()\n    a, b = sig(s_o) - 1, sig(s_k)\n    g_v = a*u_o + b @ U_neg  # (d,)\n    g_uo = a * v           # (d,)\n    g_U = np.outer(b, v)   # (k,d)\n    return pos + neg, g_v, g_uo, g_U</div>'+
     '<p><code>a = σ(s_o) - 1</code> هو الخطأ على الزوج الحقيقي، و <code>b = σ(s_k)</code> هو الخطأ على كل negative. كل gradient هو الخطأ مضروب في الـ vector التاني.</p>'+
     '<p>مثال صغير (<code>d = 2</code> و <code>k = 2</code>):</p>'+
     '<div class="m">v = [0.5, 1.0]\nu_o = [1.0, 0.5]\nU_neg = [[1, -1], [-1, 0.5]]\ns_o = 1.0,  s_k = [-0.5, 0.0]\nloss = 0.313 + 0.474 + 0.693 = 1.480\ng_v = [-0.391, -0.262]\ng_uo = [-0.134, -0.269]</div>'+
     '<p>غلطة شائعة: الـ <code>k</code> negative vectors كمان بياخدوا gradient (<code>g_U</code>)، مش الـ center والـ context الحقيقي بس.</p>',
     '<p>One training step of <mark>SGNS</mark> (skip-gram with negative sampling) for a single pair: one center vector, one real context vector and <code>k</code> negatives. Shapes are in the comments.</p>'+
     '<div class="m">import numpy as np\nsig = lambda x: 1/(1+np.exp(-x))\n\ndef sgns(v, u_o, U_neg):\n    # v: (d,)  u_o: (d,)  U_neg: (k,d)\n    s_o = u_o @ v          # scalar\n    s_k = U_neg @ v        # (k,)\n    pos = -np.log(sig(s_o))\n    neg = -np.log(sig(-s_k)).sum()\n    a, b = sig(s_o) - 1, sig(s_k)\n    g_v = a*u_o + b @ U_neg  # (d,)\n    g_uo = a * v           # (d,)\n    g_U = np.outer(b, v)   # (k,d)\n    return pos + neg, g_v, g_uo, g_U</div>'+
     '<p><code>a = σ(s_o) - 1</code> is the error on the real pair and <code>b = σ(s_k)</code> is the error on each negative. Each gradient is that error times the other vector.</p>'+
     '<p>A small example (<code>d = 2</code> and <code>k = 2</code>):</p>'+
     '<div class="m">v = [0.5, 1.0]\nu_o = [1.0, 0.5]\nU_neg = [[1, -1], [-1, 0.5]]\ns_o = 1.0,  s_k = [-0.5, 0.0]\nloss = 0.313 + 0.474 + 0.693 = 1.480\ng_v = [-0.391, -0.262]\ng_uo = [-0.134, -0.269]</div>'+
     '<p>Common mistake: the <code>k</code> negative vectors also get a gradient (<code>g_U</code>), not only the center and the real context word.</p>'),
 q:[
   CQ("لما الزوج الحقيقي يكون score بتاعه عالي أصلًا (s_o كبير)، إيه اللي بيحصل لـ g_uo؟","When the real pair already has a high score (large s_o), what happens to g_uo?",
      [["بيقرب من الصفر: مفيش كتير لسه يتعلّم","It gets close to zero: little left to learn"],
       ["بيكبر من غير حد","It grows without limit"],
       ["بيقلب الإشارة","It flips sign"],
       ["بيساوي 1","It equals 1"]],
      0,"a = σ(s_o) - 1 بيقرب من 0 لما σ(s_o) يقرب من 1، فالتحديث بيبقى صغير جدًا.","a = σ(s_o) - 1 goes to 0 as σ(s_o) goes to 1, so the update becomes tiny."),
   CQ("في المثال s_o = 1.0. كام a = σ(1.0) - 1؟","In the example s_o = 1.0. What is a = σ(1.0) - 1?",
      [["-0.269","-0.269"],["0.269","0.269"],["-0.731","-0.731"],["0.731","0.731"]],
      0,"σ(1.0) ≈ 0.731، فـ a = 0.731 - 1 = -0.269.","σ(1.0) ≈ 0.731, so a = 0.731 - 1 = -0.269.")
 ],
 f:[
   CF("إيه هو SGNS؟","What is SGNS?",
      "Skip-gram مع negative sampling: كلمة context حقيقية (positive) و k كلمات عشوائية (negatives)، والـ score بيعدّي على sigmoid.",
      "Skip-gram with negative sampling: one real context word (positive) and k random words (negatives), with each score passed through a sigmoid."),
   CF("كام الـ gradient بتاع الـ loss بالنسبة لـ score الكلمة الحقيقية؟","What is the gradient of the SGNS loss with respect to the real word's score?",
      "σ(s_o) - 1. وبالنسبة لـ score أي negative هو σ(s_k).",
      "σ(s_o) - 1. For a negative word's score it is σ(s_k).")
 ],
 terms:[
   {t:B("SGNS","SGNS"),
    d:B("اختصار skip-gram مع negative sampling: الصيغة العملية لـ Word2Vec، زوج حقيقي و <code>k</code> negatives.","Short for skip-gram with negative sampling: the practical form of Word2Vec, one real pair and <code>k</code> negatives.")}
 ]},

{id:"l1-subsampling",t:B("Subsampling للكلمات الشائعة","Subsampling frequent words"),
 b:cat(B('<p>كلمات زي <code>the</code> و <code>of</code> بتظهر مع تقريبًا كل كلمة، فبتولّد أزواج تدريب كتير وقليلة الفايدة. الحل: <mark>subsampling</mark>، يعني نرمي بعض ظهورات الكلمة الشائعة عشوائيًا قبل التدريب.</p>'+
         '<p>في طريقة Mikolov (2013) كل ظهور للكلمة <code>w</code> بيتشال باحتمال:</p>'+
         '<div class="m">P(discard w) = 1 - sqrt(t / f(w))</div>'+
         '<p>الـ <code>f(w)</code> هو نسبة الكلمة من كل كلمات النص، و <code>t</code> عتبة (حوالي 0.00001). الكلمة اللي <code>f(w)</code> بتاعتها أقل من <code>t</code> أو بتساويه مبتتشالش أبدًا.</p>',
         '<p>Words like <code>the</code> and <code>of</code> appear with almost every word, so they create many low-value training pairs. The fix is <mark>subsampling</mark>: randomly drop some occurrences of a frequent word before training.</p>'+
         '<p>In Mikolov\'s method (2013), each occurrence of word <code>w</code> is removed with probability:</p>'+
         '<div class="m">P(discard w) = 1 - sqrt(t / f(w))</div>'+
         '<p><code>f(w)</code> is the word\'s share of all the words in the text, and <code>t</code> is a threshold (about 0.00001). A word whose <code>f(w)</code> is at or below <code>t</code> is never dropped.</p>'),
       FIG9,
       B('<p>مثال: <code>the</code> نسبتها حوالي 5% (<code>f = 0.05</code>):</p>'+
         '<div class="m">1 - sqrt(0.00001 / 0.05) = 1 - 0.014 = 0.986</div>'+
         '<p>يعني بنرمي حوالي 98.6% من ظهورات <code>the</code>.</p>'+
         '<p>غلطة شائعة: ده مش حذف stop words من الـ vocabulary. <code>the</code> لسه ليها vector وبتظهر أحيانًا. ومش هو negative sampling: الـ subsampling بتقلل كلمات النص نفسه، و negative sampling بتسحب كلمات غلط جوه الـ loss.</p>',
         '<p>Example: <code>the</code> makes up about 5% of the text (<code>f = 0.05</code>):</p>'+
         '<div class="m">1 - sqrt(0.00001 / 0.05) = 1 - 0.014 = 0.986</div>'+
         '<p>So about 98.6% of the occurrences of <code>the</code> are dropped.</p>'+
         '<p>Common mistake: this is not removing stop words from the vocabulary. <code>the</code> still has a vector and still appears sometimes. It is also not negative sampling: subsampling thins out the words of the text itself, while negative sampling draws wrong words inside the loss.</p>')),
 q:[
   CQ("ليه بنرمي بعض ظهورات الكلمات الشائعة زي the؟","Why do we drop some occurrences of frequent words like the?",
      [["عشان نصغّر الـ vocabulary","To shrink the vocabulary"],["بتظهر مع كل الكلمات تقريبًا، فبتولّد أزواج كتير وقليلة الفايدة","They appear with almost every word, so they create many low-value pairs"],["عشان نكبّر الـ window","To enlarge the window"],["عشان نرجع لـ one-hot","To go back to one-hot"]],
      1,"الكلمة الشائعة مبتقولش حاجة كتير عن الـ center، وعددها ضخم.","A frequent word says little about the center, and there are a huge number of such pairs."),
   CQ("f(w) = 0.0001 و t = 0.00001. احتمال رمي ظهور الكلمة كام؟","f(w) = 0.0001 and t = 0.00001. What is the probability of dropping an occurrence of the word?",
      [["0.32","0.32"],["0.10","0.10"],["0.68","0.68"],["0","0"]],
      2,"1 - sqrt(0.00001 / 0.0001) = 1 - sqrt(0.1) = 1 - 0.316 ≈ 0.68.","1 - sqrt(0.00001 / 0.0001) = 1 - sqrt(0.1) = 1 - 0.316 ≈ 0.68.")
 ],
 f:[
   CF("إيه معادلة subsampling؟","What is the subsampling formula?",
      "P(discard w) = 1 - sqrt(t / f(w))، حيث f(w) نسبة الكلمة في النص و t عتبة حوالي 0.00001.",
      "P(discard w) = 1 - sqrt(t / f(w)), where f(w) is the word's share of the text and t is a threshold around 0.00001."),
   CF("إيه الفرق بين subsampling و negative sampling؟","How does subsampling differ from negative sampling?",
      "Subsampling بترمي كلمات شائعة من النص قبل التدريب. Negative sampling بتسحب كلمات عشوائية كـ negatives جوه الـ loss.",
      "Subsampling drops frequent words from the text before training. Negative sampling draws random words as negatives inside the loss.")
 ],
 terms:[
   {t:B("Subsampling","Subsampling"),
    d:B("رمي بعض ظهورات الكلمات الشائعة عشوائيًا قبل التدريب، باحتمال <code>1 - sqrt(t / f(w))</code>.","Randomly dropping some occurrences of frequent words before training, with probability <code>1 - sqrt(t / f(w))</code>.")}
 ]},

{id:"l1-recap",t:B("Recap: Word2Vec في صفحة","Recap: Word2Vec on one page"),
 b:cat(B('<p>خمس نقاط من المحاضرة:</p>'+
         '<p>1. الـ one-hot كبير ومفيهوش تشابه (dot product = 0)، فبنتعلم <mark>dense vector</mark> لكل كلمة من سياقها. وده الانتقال من الـ NLP الرمزي والمبني على العد للـ NLP العصبي.</p>'+
         '<p>2. <mark>Skip-gram</mark> بيتنبأ بالسياق من الـ center، و CBOW بيعمل العكس. كل كلمة ليها <code>v</code> و <code>u</code>.</p>'+
         '<p>3. الـ loss هو متوسط negative log likelihood، والـ gradient على <code>v_c</code> هو observed - expected.</p>'+
         '<p>4. الـ softmax الكامل غالي، فبنستخدم <mark>negative sampling</mark>: positive واحد و <code>k</code> negatives.</p>'+
         '<p>5. الـ window بيحدد نوع التشابه، والـ subsampling بيقلل الكلمات الشائعة.</p>'+
         '<div class="m">P(o | c) = exp(u_o . v_c) / sum_w exp(u_w . v_c)\nJ = -log P(o | c)   (one pair)\nJ_neg = -log σ(u_o . v_c) - sum_k log σ(-u_k . v_c)</div>'+
         '<p>قبل المحاضرة الجاية لازم تعرف تحسب softmax والـ loss بإيدك، وتفرّق بين <code>u</code> و <code>v</code>، وتشرح ليه الـ softmax الكامل غالي. المحاضرة الجاية بتبني عليهم: vectors مبنية على العد (GloVe)، والكلمات اللي برا الـ vocabulary، واستخدام الـ vectors في تصنيف الكلمات.</p>',
         '<p>Five points from the lecture:</p>'+
         '<p>1. One-hot is huge and has no similarity (dot product = 0), so we learn a <mark>dense vector</mark> for each word from its contexts. This is the step from symbolic and count-based NLP to neural NLP.</p>'+
         '<p>2. <mark>Skip-gram</mark> predicts the context from the center, and CBOW does the reverse. Each word has a <code>v</code> and a <code>u</code>.</p>'+
         '<p>3. The loss is the average negative log likelihood, and the gradient on <code>v_c</code> is observed - expected.</p>'+
         '<p>4. The full softmax is expensive, so we use <mark>negative sampling</mark>: one positive and <code>k</code> negatives.</p>'+
         '<p>5. The window sets the kind of similarity, and subsampling thins out frequent words.</p>'+
         '<div class="m">P(o | c) = exp(u_o . v_c) / sum_w exp(u_w . v_c)\nJ = -log P(o | c)   (one pair)\nJ_neg = -log σ(u_o . v_c) - sum_k log σ(-u_k . v_c)</div>'+
         '<p>Before the next lecture you should be able to compute a softmax and its loss by hand, tell <code>u</code> from <code>v</code>, and explain why the full softmax is expensive. The next lecture builds on these: count-based vectors (GloVe), words outside the vocabulary, and using the vectors to classify words.</p>')),
 q:[
   CQ("اختار الجملة الصح:","Pick the correct statement:",
      [["كل كلمة ليها vector واحد بس","Each word has only one vector"],["كل كلمة ليها vector لما تبقى center و vector تاني لما تبقى context","Each word has one vector as a center and another vector as a context word"],["الـ one-hot بيدي تشابه بين hotel و motel","One-hot gives similarity between hotel and motel"],["الـ loss بيزيد لما احتمال الكلمة الحقيقية يزيد","The loss grows when the probability of the real word grows"]],
      1,"Word2Vec بيتعلم u و v لكل كلمة.","Word2Vec learns a u and a v for every word."),
   CQ("الـ scores لكلمتين هي [3, 0]. احتمال الكلمة الأولى بالتقريب كام؟","The scores of two words are [3, 0]. What is the probability of the first word, approximately?",
      [["0.75","0.75"],["0.5","0.5"],["0.99","0.99"],["0.95","0.95"]],
      3,"e^3 ≈ 20.09، فالاحتمال = 20.09 / (20.09 + 1) ≈ 0.95.","e^3 ≈ 20.09, so the probability = 20.09 / (20.09 + 1) ≈ 0.95.")
 ],
 f:[
   CF("اكتب احتمال Skip-gram.","Write the Skip-gram probability.",
      "P(o | c) = exp(u_o . v_c) / sum_w exp(u_w . v_c)",
      "P(o | c) = exp(u_o . v_c) / sum_w exp(u_w . v_c)"),
   CF("ليه الـ softmax الكامل غالي؟","Why is the full softmax expensive?",
      "المقام بيجمع على كل الـ vocabulary (مئات الآلاف) في كل خطوة. الحل: negative sampling.",
      "The denominator sums over the whole vocabulary (hundreds of thousands of words) at every step. The fix: negative sampling.")
 ]}
]}
);

})();
