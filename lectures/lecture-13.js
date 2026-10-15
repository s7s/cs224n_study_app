/* Lecture 13: Question Answering
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L13 fig: three QA setups */
function qaSetupFig(){
  var s='';
  function box(x,y,w,txt,fill,stroke){return RECT(x,y,w,26,fill,stroke,7,1.6)+T(x+w/2,y+17,txt,'','middle','font-size:10.5px');}
  s+=T(10,16,'closed-book','tb','start','font-size:11px');
  s+=box(10,24,74,'question','var(--sf)','var(--ln)')+AL(84,37,128,37,'mu','mM')+box(130,24,100,'model weights','var(--acs)','var(--ac)')+AL(230,37,268,37,'mu','mM')+box(270,24,70,'answer','var(--okbg)','var(--ok)');
  s+=T(10,82,'reading comprehension','tb','start','font-size:11px');
  s+=box(10,90,112,'question+passage','var(--sf)','var(--ln)')+AL(122,103,148,103,'mu','mM')+box(150,90,80,'reader','var(--acs)','var(--ac)')+AL(230,103,268,103,'mu','mM')+box(270,90,70,'span','var(--okbg)','var(--ok)');
  s+=T(10,148,'open-domain','tb','start','font-size:11px');
  s+=box(10,156,64,'question','var(--sf)','var(--ln)')+AL(74,169,96,169,'mu','mM')+box(98,156,68,'retriever','var(--okbg)','var(--ok)')+AL(166,169,186,169,'mu','mM')+box(188,156,60,'reader','var(--acs)','var(--ac)')+AL(248,169,268,169,'mu','mM')+box(270,156,70,'answer','var(--okbg)','var(--ok)');
  s+=T(132,200,'corpus: millions of passages','tm','middle','font-size:10px');
  return s;
}

var FIG_QASETUP=fig(210,qaSetupFig(),
  B('التلات إعدادات. الفرق هو مصدر المعلومة: أوزان الموديل نفسها، أو نص معطى مع السؤال، أو corpus ضخم لازم النظام يبحث فيه.',
    'The three setups. The difference is where the information comes from: the model weights themselves, a passage given with the question, or a huge corpus the system must search.'));

/* L13 fig: span prediction */
function spanFig(){
  var T7=['played','in','Santa','Clara',',','California'],S=[0.02,0.04,0.80,0.05,0.03,0.06],E=[0.01,0.02,0.04,0.78,0.06,0.09],s='',i,x,cx,h,hit;
  for(i=0;i<6;i++){
    x=10+i*57;cx=x+28;hit=(i===2||i===3);
    s+=RECT(x,14,56,26,hit?'var(--acs)':'var(--sf)',hit?'var(--ac)':'var(--ln)',6,hit?1.8:1.3)+T(cx,31,T7[i],hit?'tb':'','middle','font-size:9px');
    h=Math.max(Math.round(S[i]*50),2);
    s+=RECT(cx-11,100-h,22,h,'var(--ac)','var(--ac)',2,1.2);
    h=Math.max(Math.round(E[i]*50),2);
    s+=RECT(cx-11,172-h,22,h,'var(--ok)','var(--ok)',2,1.2);
  }
  s+='<line x1="8" y1="100" x2="352" y2="100" style="stroke:var(--mu);stroke-width:1.2"/><line x1="8" y1="172" x2="352" y2="172" style="stroke:var(--mu);stroke-width:1.2"/>';
  s+=T(10,62,'P(start)','tb','start','font-size:10.5px;fill:var(--ac)')+T(10,134,'P(end)','tb','start','font-size:10.5px;fill:var(--ok)');
  s+=T(10+2*57+28,54,'0.80','tb','middle','font-size:10px')+T(10+3*57+28,126,'0.78','tb','middle','font-size:10px');
  s+='<path d="M124 182 V188 H237 V182" style="fill:none;stroke:var(--ac);stroke-width:1.6"/>'+T(180,204,'answer span','tb','middle','font-size:10.5px;fill:var(--ac)');
  return s;
}

var FIG_SPAN=fig(214,spanFig(),
  B('لكل token في الـ passage الموديل بيطلّع احتمال إنه بداية الإجابة واحتمال إنه نهايتها. أعلى بداية عند Santa وأعلى نهاية عند Clara، فالإجابة Santa Clara.',
    'For every passage token the model outputs a probability of being the answer start and of being the answer end. The top start is Santa and the top end is Clara, so the answer is Santa Clara.'));

/* L13 fig: F1 token overlap */
function f1Fig(){
  var s='';
  s+=T(8,34,'gold','tm','start','font-size:10.5px')+T(8,86,'pred','tm','start','font-size:10.5px');
  s+=RECT(60,18,100,26,'var(--sf)','var(--ln)',6,1.4)+T(110,35,'Denver','','middle','font-size:11px');
  s+=RECT(168,18,100,26,'var(--okbg)','var(--ok)',6,1.8)+T(218,35,'Broncos','tb','middle','font-size:11px');
  s+=RECT(168,70,100,26,'var(--okbg)','var(--ok)',6,1.8)+T(218,87,'Broncos','tb','middle','font-size:11px');
  s+='<line x1="218" y1="46" x2="218" y2="68" style="stroke:var(--ok);stroke-width:1.6;stroke-dasharray:3 3"/>';
  s+=T(10,128,'precision = 1/1 = 1.00','','start','font-size:11px')+T(10,146,'recall    = 1/2 = 0.50','','start','font-size:11px');
  s+=T(10,166,'F1 = 2 x 1.00 x 0.50 / 1.50 = 0.67','tb','start','font-size:11px;fill:var(--ok)')+T(10,184,'EM = 0','tb','start','font-size:11px;fill:var(--no)');
  return s;
}

var FIG_F1=fig(196,f1Fig(),
  B('الإجابة المتوقعة Broncos جزء من الإجابة الصح Denver Broncos. الـ EM بيدّي صفر، لكن الـ F1 بيدّي درجة جزئية 0.67.',
    'The prediction Broncos is part of the correct answer Denver Broncos. EM gives zero, while F1 gives partial credit of 0.67.'));

/* L13 fig: retrieval funnel */
function funnelFig(){
  var s='';
  s+=RECT(10,14,340,34,'var(--sf)','var(--ln)',8,1.5)+T(180,36,'corpus: 21,000,000 passages','tb','middle','font-size:11px');
  s+=AL(180,50,180,78,'ok','mG')+T(192,68,'retriever: fast, rough','tm','start','font-size:10.5px');
  s+=RECT(80,80,200,30,'var(--okbg)','var(--ok)',8,1.8)+T(180,100,'top-20 passages','tb','middle','font-size:11px');
  s+=AL(180,112,180,138,'ac','mA')+T(192,130,'reader: slow, accurate','tm','start','font-size:10.5px');
  s+=RECT(120,140,120,30,'var(--acs)','var(--ac)',8,1.8)+T(180,160,'answer','tb','middle','font-size:11px');
  return s;
}

var FIG_FUNNEL=fig(184,funnelFig(),
  B('الـ retriever الرخيص بيقلّل الملايين لعشرات، والـ reader الغالي بيشتغل على العشرات دي بس.',
    'The cheap retriever cuts millions down to dozens, and the expensive reader works only on those few.'));

/* L13 fig: dual encoder */
function dprFig(){
  var s='',i;
  s+=RECT(10,14,110,26,'var(--sf)','var(--ln)',6,1.4)+T(65,31,'question','','middle','font-size:11px');
  s+=AL(65,42,65,62,'ac','mA')+RECT(10,64,110,30,'var(--acs)','var(--ac)',8,1.8)+T(65,83,'E_Q (BERT)','tb','middle','font-size:10.5px');
  s+=AL(65,96,65,112,'ac','mA');
  s+=RECT(240,14,110,26,'var(--sf)','var(--ln)',6,1.4)+T(295,31,'passage','','middle','font-size:11px');
  s+=AL(295,42,295,62,'ok','mG')+RECT(240,64,110,30,'var(--okbg)','var(--ok)',8,1.8)+T(295,83,'E_P (BERT)','tb','middle','font-size:10.5px');
  s+=AL(295,96,295,112,'ok','mG');
  for(i=0;i<4;i++){
    s+=RECT(10+i*26,114,24,24,'var(--acs)','var(--ac)',4,1.4);
    s+=RECT(246+i*26,114,24,24,'var(--okbg)','var(--ok)',4,1.4);
  }
  s+=AL(116,126,160,126,'mu','mM')+AL(244,126,200,126,'mu','mM');
  s+=T(180,122,'sim','tb','middle','font-size:10.5px')+T(180,136,'q · p','tb','middle','font-size:10.5px');
  s+=T(180,164,'passage vectors: computed once, offline','tm','middle','font-size:10.5px');
  s+=T(180,182,'question vector: computed at query time','tm','middle','font-size:10.5px');
  return s;
}

var FIG_DPR=fig(194,dprFig(),
  B('encoder للسؤال وencoder للـ passage، كل واحد بيطلّع vector، والـ score هو الـ dot product. الـ passages بتتحوّل لـ vectors مرة واحدة مقدمًا.',
    'One encoder for the question and one for the passage, each producing a vector, and the score is their dot product. Passages are turned into vectors once, in advance.'));

/* L13 fig: RAG error chain */
function ragFig(){
  var s='';
  function box(x,w,txt,fill,stroke){return RECT(x,18,w,34,fill,stroke,8,1.7)+T(x+w/2,39,txt,'tb','middle','font-size:10.5px');}
  s+=box(10,96,'retrieve','var(--okbg)','var(--ok)')+AL(106,35,134,35,'mu','mM')+box(136,96,'generate','var(--acs)','var(--ac)')+AL(232,35,258,35,'mu','mM')+box(260,90,'answer','var(--sf)','var(--ln)');
  s+=T(58,76,'recall@5 = 0.80','tb','middle','font-size:10.5px;fill:var(--ok)')+T(184,76,'faithful = 0.90','tb','middle','font-size:10.5px;fill:var(--ac)')+T(305,76,'0.80 x 0.90','tb','middle','font-size:10.5px');
  s+=T(58,100,'misses the','tm','middle','font-size:10px')+T(58,113,'right passage','tm','middle','font-size:10px');
  s+=T(184,100,'ignores or','tm','middle','font-size:10px')+T(184,113,'distorts it','tm','middle','font-size:10px');
  s+=T(305,100,'correct only','tm','middle','font-size:10px')+T(305,113,'about 72%','tb','middle','font-size:10.5px;fill:var(--no)');
  s+=T(180,150,'errors multiply: fix the weakest link first','tb','middle','font-size:10.5px');
  return s;
}

var FIG_RAGCHAIN=fig(164,ragFig(),
  B('الإجابة الصح محتاجة الـ retriever يجيب الـ passage الصح والـ generator يستخدمه بأمانة. الأخطاء بتتضرب في بعض (تقريب بيفترض استقلال).',
    'A correct answer needs the retriever to fetch the right passage and the generator to use it faithfully. The errors multiply (an approximation that assumes independence).'));

/* L13 fig: multi-hop (two retrievals joined by a bridge entity) */
function multihopFig(){
  var s='';
  function box(x,y,w,txt,fill,stroke){return RECT(x,y,w,26,fill,stroke,7,1.6)+T(x+w/2,y+17,txt,'','middle','font-size:10.5px');}
  s+=box(10,8,340,'In which country was the author of Don Quixote born?','var(--sf)','var(--ln)');
  s+=AL(180,36,180,52,'mu','mM');
  s+=box(10,54,112,'retrieve #1','var(--okbg)','var(--ok)')+AL(122,67,146,67,'mu','mM')+box(148,54,202,'...written by Cervantes','var(--sf)','var(--ln)');
  s+=AL(180,82,180,100,'ac','mA');
  s+=RECT(10,102,340,28,'var(--acs)','var(--ac)',8,1.8)+T(180,121,'bridge entity = Cervantes: new query','tb','middle','font-size:10.5px');
  s+=AL(180,132,180,148,'ac','mA');
  s+=box(10,150,112,'retrieve #2','var(--okbg)','var(--ok)')+AL(122,163,146,163,'mu','mM')+box(148,150,202,'...born in Alcal\u00e1, Spain','var(--sf)','var(--ln)');
  s+=AL(180,178,180,194,'ok','mG');
  s+=RECT(120,196,120,26,'var(--okbg)','var(--ok)',7,1.8)+T(180,213,'Spain','tb','middle','font-size:11px');
  return s;
}

var FIG_MULTIHOP=fig(230,multihopFig(),
  B('خطوتين: أول retrieval بيجيب المؤلف (الـ bridge entity)، وبحث تاني مبني عليه بيجيب الإجابة.',
    'Two hops: the first retrieval finds the author (the bridge entity), and a second search built from it finds the answer.'));

/* L13 fig: lost in the middle (illustrative shape, not measured numbers) */
function lostMiddleFig(){
  var s='';
  s+='<line x1="40" y1="20" x2="40" y2="140" style="stroke:var(--mu);stroke-width:1.2"/><line x1="40" y1="140" x2="340" y2="140" style="stroke:var(--mu);stroke-width:1.2"/>';
  s+='<path d="M40 36 Q190 184 340 36" style="fill:none;stroke:var(--ac);stroke-width:2.4"/>';
  s+=DOT(40,36,'ok',5)+DOT(190,110,'no',5)+DOT(340,36,'ok',5);
  s+=T(8,16,'accuracy','tb','start','font-size:10.5px')+T(352,16,'illustrative shape','tm','end','font-size:10px');
  s+=T(190,128,'lost in the middle','tb','middle','font-size:10.5px;fill:var(--no)');
  s+=T(40,156,'start','tm','middle','font-size:10.5px')+T(190,156,'middle','tm','middle','font-size:10.5px')+T(340,156,'end','tm','middle','font-size:10.5px');
  s+=T(190,174,'where the relevant fact sits in the context','tm','middle','font-size:10.5px');
  return s;
}

var FIG_LOSTMIDDLE=fig(184,lostMiddleFig(),
  B('شكل توضيحي (مش أرقام مقاسة): الدقة أعلى لما المعلومة المهمة في بداية السياق أو نهايته، وبتقل لما تبقى في النص.',
    'Illustrative shape, not measured numbers: accuracy is higher when the key fact is at the start or end of the context, and drops in the middle.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:13,t:B("Question Answering","Question Answering"),cards:[

{id:"l13-setups",t:B("إجابة الأسئلة: التلات إعدادات","Question answering: the three setups"),
 b:cat(
   B('<p><mark>Question Answering</mark> هو إننا نجاوب سؤال بلغة طبيعية. الفرق الجوهري بين الأنظمة هو <mark>الإجابة جاية منين</mark>:<br>• <mark>Reading comprehension</mark>: السؤال ومعاه نص (passage)، والإجابة جزء من النص. أسهل إعداد، وأشهر داتا ليه هي SQuAD.<br>• <mark>Open-domain</mark>: السؤال بس، والنظام لازم يلاقي المعلومة بنفسه من corpus ضخم (Wikipedia، الويب، مستندات شركة). بيتكوّن من retriever و reader.<br>• <mark>Closed-book</mark>: السؤال بس، والموديل بيجاوب من اللي حفظه في أوزانه وقت الـ pretraining. من غير أي بحث.</p>',
         '<p><mark>Question Answering</mark> means answering a natural-language question. The core difference between systems is <mark>where the answer comes from</mark>:<br>• <mark>Reading comprehension</mark>: the question comes with a passage, and the answer is part of it. The easiest setup, and its best-known dataset is SQuAD.<br>• <mark>Open-domain</mark>: only the question, and the system must find the information itself in a huge corpus (Wikipedia, the web, company documents). It consists of a retriever and a reader.<br>• <mark>Closed-book</mark>: only the question, and the model answers from what it memorized in its weights during pretraining. No search at all.</p>'),
   FIG_QASETUP,
   B('<p>الـ closed-book بسيط وسريع، بس ليه تلات مشاكل: المعرفة <mark>ثابتة</mark> عند تاريخ الـ pretraining، ومفيش <mark>مصدر</mark> نرجعله نتأكد منه، والموديل ممكن <mark>يهلوس (hallucinate)</mark>: يدّي إجابة واثقة وغلط. الـ open-domain بيدّي معلومة محدّثة ومصدر قابل للمراجعة، وبيكلّف بنية أكتر.</p>',
         '<p>Closed-book is simple and fast, but has three problems: the knowledge is <mark>frozen</mark> at the pretraining date, there is no <mark>source</mark> to go back to and verify, and the model can <mark>hallucinate</mark>: give a confident, wrong answer. Open-domain gives fresh information and a checkable source, and costs more infrastructure.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين reading comprehension و open-domain QA؟","What is the core difference between reading comprehension and open-domain QA?",
      [["في الأول مفيش سؤال","In the first there is no question"],["الأول بيستخدم الصور والتاني النص","The first uses images and the second uses text"],["في الأول النص المناسب بيتدّي مع السؤال، وفي التاني النظام لازم يلاقيه بنفسه","In the first the right passage is given with the question; in the second the system must find it itself"],["التاني مش بيستخدم موديل","The second does not use a model"]],
      2,"الـ open-domain بيضيف مرحلة البحث (retriever) قبل ما الـ reader يقرا.","Open-domain adds a search stage (the retriever) before the reader reads."),
   CQ("بوت لازم يجاوب عن سياسات داخلية في شركة وبتتغيّر كل شهر. أنسب إعداد إيه؟","A bot must answer questions about a company's internal policies, which change every month. Which setup fits best?",
   [["closed-book، لأنه أبسط","Closed-book, because it is simplest"],["open-domain (retriever + reader/LLM) على مستندات الشركة المحدّثة","Open-domain (retriever + reader/LLM) over the company's up-to-date documents"],["reading comprehension من غير أي passage","Reading comprehension with no passage at all"],["الموديل يتدرّب من الأول كل شهر عشان يحفظها","Retrain the model from scratch every month so it memorizes them"]],
   1,"المعرفة خاصة ومتغيرة، ومعرفة الـ closed-book ثابتة عند تاريخ الـ pretraining ومن غير مصدر. الـ open-domain بيجيب المستند المحدّث ويقدر يرجع له.","The knowledge is private and changing, while closed-book knowledge is frozen at the pretraining date with no source. Open-domain fetches the current document and can point back to it.")
 ],
 f:[
   CF("إيه التلات إعدادات الأساسية لـ QA؟","What are the three core QA setups?",
      "Reading comprehension (نص معطى مع السؤال)، open-domain (retriever + reader على corpus ضخم)، و closed-book (الموديل بيجاوب من أوزانه من غير بحث).","Reading comprehension (a passage given with the question), open-domain (retriever + reader over a huge corpus), and closed-book (the model answers from its weights with no search)."),
   CF("إيه المشاكل التلاتة في الـ closed-book QA؟","What are the three problems of closed-book QA?",
   "المعرفة ثابتة عند تاريخ الـ pretraining، ومفيش مصدر نتأكد منه، والموديل ممكن يهلوس (يدّي إجابة واثقة وغلط).","The knowledge is frozen at the pretraining date, there is no source to verify, and the model can hallucinate (give a confident, wrong answer).")
 ],
 terms:[
   {t:B("Question Answering (QA)","Question Answering (QA)"),
 d:B("إجابة سؤال بلغة طبيعية. الفرق بين الأنظمة هو مصدر الإجابة.","Answering a natural-language question. Systems differ in where the answer comes from.")},
   {t:B("Reading comprehension","Reading comprehension"),
 d:B("إعداد QA فيه passage معطى مع السؤال، والإجابة جزء منه.","A QA setup where a passage is given with the question and the answer is part of it.")},
   {t:B("Open-domain QA","Open-domain QA"),
 d:B("السؤال بس، والنظام بيلاقي المعلومة في corpus ضخم بـ retriever و reader.","Only the question; the system finds the information in a huge corpus with a retriever and a reader.")},
   {t:B("Closed-book QA","Closed-book QA"),
 d:B("الموديل بيجاوب من اللي في أوزانه من غير أي بحث.","The model answers from what is in its weights, with no search.")}
 ]},

{id:"l13-qtypes",t:B("أنواع الأسئلة وخريطة المحاضرة","Question types and the lecture map"),
 b:cat(
   B('<p>الفكرة قديمة: نظام IBM Watson كسب في مسابقة Jeopardy! سنة 2011 بنظام فيه استرجاع وتقييم مرشّحين كتير. النهارده الاتجاه الغالب هو <mark>RAG</mark>: retriever مع LLM بيولّد الإجابة.</p>',
         '<p>The idea is old: IBM Watson won the Jeopardy! quiz show in 2011 with a system that retrieved and scored many candidates. Today the dominant direction is <mark>RAG</mark>: a retriever plus an LLM that generates the answer.</p>'),
   B('<p>ترتيب المحاضرة: نبدأ بالـ reader، بعدين نضيف الـ retriever، وبعدها RAG. وفي الآخر بنتناول حالتين أصعب هما <mark>multi-hop</mark> والـ <mark>long-context</mark>، وبنختم بملخص.</p>'+
         '<p>وفي أنواع أسئلة تانية، وكل نوع ليه تحدياته:<br>• <mark>factoid</mark> (مين، فين، إمتى): إجابة قصيرة زي "Who wrote Hamlet؟". أغلب أسئلة SQuAD و Natural Questions (أسئلة بحث حقيقية من Google) من النوع ده.<br>• <mark>multi-hop</mark> (محتاج تجمع أكتر من معلومة): زي "In which country was the author of Don Quixote born؟". لازم تعرف المؤلف الأول، وبعدين مكان ميلاده.<br>• <mark>long-form</mark> (إجابة فقرة): زي "Why did the Roman Republic fall؟". مفيش إجابة واحدة نطابق معاها حرفيًا، فالتقييم أصعب بكتير.</p>',
         '<p>The lecture order: we start with the reader, then add the retriever, and then RAG. At the end we cover two harder cases, <mark>multi-hop</mark> and <mark>long-context</mark>, and close with a recap.</p>'+
         '<p>There are other question types too, each with its own challenges:<br>• <mark>factoid</mark> (who, where, when): a short answer such as "Who wrote Hamlet?". Most SQuAD and Natural Questions (real Google search queries) questions are of this type.<br>• <mark>multi-hop</mark> (you must combine more than one fact): such as "In which country was the author of Don Quixote born?". You first need the author, then the birthplace.<br>• <mark>long-form</mark> (a paragraph-length answer): such as "Why did the Roman Republic fall?". There is no single string to match exactly, so evaluation is much harder.</p>')),
 q:[
   CQ("أي سؤال من دول multi-hop؟","Which of these questions is multi-hop?",
   [["Who wrote Hamlet?","Who wrote Hamlet?"],["In which country was the author of Don Quixote born?","In which country was the author of Don Quixote born?"],["When did World War II end?","When did World War II end?"],["Where is the Eiffel Tower?","Where is the Eiffel Tower?"]],
   1,"محتاج خطوتين: مين المؤلف، وبعدين فين اتولد. الباقي معلومة واحدة مباشرة.","It needs two steps: who the author is, then where he was born. The others are a single direct fact."),
   CQ("ليه تقييم الـ long-form QA أصعب من الـ factoid؟","Why is long-form QA harder to evaluate than factoid QA?",
   [["لأن الإجابة طويلة ومفيش نص واحد صح نطابق معاه حرفيًا","Because the answer is long and there is no single correct string to match exactly"],["لأن الأسئلة أقصر","Because the questions are shorter"],["لأن الـ EM بيشتغل على الأرقام بس","Because EM only works on numbers"],["لأن مفيش داتا ليه","Because there is no data for it"]],
   0,"الإجابة الطويلة ممكن تتصاغ بطرق صح كتيرة، فالمطابقة الحرفية مش كفاية.","A long answer can be phrased correctly in many ways, so exact matching is not enough.")
 ],
 f:[
   CF("إيه الفرق بين factoid و multi-hop و long-form؟","What is the difference between factoid, multi-hop and long-form questions?",
   "factoid: معلومة قصيرة (مين، فين، إمتى). multi-hop: لازم تجمع أكتر من معلومة. long-form: إجابة بطول فقرة.","Factoid: a short fact (who, where, when). Multi-hop: you must combine more than one fact. Long-form: a paragraph-length answer."),
   CF("إيه اتجاه الـ QA الغالب النهارده؟","What is the dominant direction in QA today?",
   "RAG: retriever مع LLM بيولّد الإجابة. (Watson كسب Jeopardy! سنة 2011 بنظام استرجاع وتقييم مرشّحين.)","RAG: a retriever plus an LLM that generates the answer. (Watson won Jeopardy! in 2011 with a system that retrieved and scored candidates.)")
 ],
 terms:[
   {t:B("Factoid question","Factoid question"),
 d:B("سؤال إجابته معلومة قصيرة (مين، فين، إمتى).","A question whose answer is a short fact (who, where, when).")},
   {t:B("Long-form question","Long-form question"),
 d:B("سؤال إجابته فقرة، ومفيش إجابة واحدة نطابق معاها حرفيًا.","A question whose answer is a paragraph, with no single string to match exactly.")}
 ]},

{id:"l13-extractive",t:B("الـ Extractive QA: بداية ونهاية","Extractive QA: predicting a start and an end"),
 b:cat(
   B('<p>في SQuAD (أكتر من 100,000 سؤال على مقالات Wikipedia) الإجابة دايمًا <mark>span متتالي</mark> من الـ passage. فبدل ما نولّد نص، بنختار <mark>بداية ونهاية</mark>. الإدخال لـ BERT بالشكل ده: <code>[CLS] question [SEP] passage [SEP]</code>. كل token في الـ passage بيطلع له vector <code>h_i</code>، ونتعلّم vector للبداية <code>w_s</code> و vector للنهاية <code>w_e</code>:</p>'+
         '<div class="m">P_start(i) = softmax_i( w_s . h_i )\nP_end(j)   = softmax_j( w_e . h_j )\nloss = -log P_start(a) - log P_end(b)    (a, b = gold span)</div>',
         '<p>In SQuAD (over 100,000 questions on Wikipedia articles) the answer is always a <mark>contiguous span</mark> of the passage. So instead of generating text, we choose a <mark>start and an end</mark>. The input to BERT looks like this: <code>[CLS] question [SEP] passage [SEP]</code>. Every passage token gets a vector <code>h_i</code>, and we learn a start vector <code>w_s</code> and an end vector <code>w_e</code>:</p>'+
         '<div class="m">P_start(i) = softmax_i( w_s . h_i )\nP_end(j)   = softmax_j( w_e . h_j )\nloss = -log P_start(a) - log P_end(b)    (a, b = gold span)</div>'),
   FIG_SPAN,
   B('<p>مثال: السؤال "Where was Super Bowl 50 played؟" والـ passage فيه "... was played in Santa Clara, California". الرسم بيوضّح إن أعلى start عند Santa (0.80) وأعلى end عند Clara (0.78).</p>',
         '<p>An example: the question "Where was Super Bowl 50 played?" and a passage containing "... was played in Santa Clara, California". The figure shows the top start at Santa (0.80) and the top end at Clara (0.78).</p>')),
 q:[
   CQ("في الـ extractive QA، الموديل بيطلّع إيه لكل token في الـ passage؟","In extractive QA, what does the model output for each passage token?",
   [["احتمال إنه بداية الإجابة واحتمال إنه نهايتها","A probability of being the answer start and a probability of being the answer end"],["الكلمة اللي بعده","The next word"],["ترجمة الـ token","A translation of the token"],["نعم أو لا بس","Only yes or no"]],
   0,"الـ w_s و w_e بيطلّعوا score للبداية وscore للنهاية، والـ softmax بيحوّلهم لاحتمالات.","w_s and w_e produce a start score and an end score, and softmax turns them into probabilities."),
   CQ("للـ gold span: P_start = 0.8 و P_end = 0.5. كام الـ loss (log طبيعي)؟","For the gold span, P_start = 0.8 and P_end = 0.5. What is the loss (natural log)?",
   [["0.92","0.92"],["1.30","1.30"],["0.40","0.40"],["0.22","0.22"]],
   0,"-ln 0.8 - ln 0.5 = 0.223 + 0.693 = 0.916، يعني حوالي 0.92.","-ln 0.8 - ln 0.5 = 0.223 + 0.693 = 0.916, so about 0.92.")
 ],
 f:[
   CF("إزاي الـ extractive QA بيجاوب سؤال؟","How does extractive QA answer a question?",
      "BERT بياخد question + passage، وبيطلّع لكل token احتمال إنه بداية وإنه نهاية الإجابة. بنختار (i, j) بأعلى s_i + e_j بشرط i ≤ j وطول محدود، والإجابة هي الـ span ده.","BERT takes question + passage and outputs for every token a probability of being the answer start and the answer end. We pick (i, j) with the highest s_i + e_j under i ≤ j and a length limit, and that span is the answer."),
   CF("إيه شكل الإدخال لـ BERT في الـ extractive QA؟","What does the BERT input look like in extractive QA?",
   "[CLS] question [SEP] passage [SEP]. كل token في الـ passage بياخد vector، وبيتحوّل لاحتمال بداية واحتمال نهاية.","[CLS] question [SEP] passage [SEP]. Each passage token gets a vector, which is turned into a start probability and an end probability.")
 ],
 terms:[
   {t:B("Extractive QA","Extractive QA"),
 d:B("الإجابة span متتالي من الـ passage، والموديل بيتنبأ ببدايته ونهايته.","The answer is a contiguous span of the passage, and the model predicts its start and end.")},
   {t:B("SQuAD","SQuAD"),
 d:B("داتا reading comprehension: أكتر من 100,000 سؤال على مقالات Wikipedia.","A reading-comprehension dataset: over 100,000 questions on Wikipedia articles.")}
 ]},

{id:"l13-extractive-decoding",t:B("اختيار الـ span والـ sliding windows","Choosing the span and sliding windows"),
 b:cat(
   B('<p>وقت الاختبار بنختار الزوج <code>(i, j)</code> اللي بيعظّم <code>s_i + e_j</code> بشرطين: <code>i &lt;= j</code> وطول الـ span معقول (مثلًا <code>j - i + 1 &lt;= 30</code>). ليه مش نختار أعلى start وأعلى end كل واحد لوحده؟ لأن ممكن النهاية تطلع قبل البداية. عدد الأزواج اللي بنفحصها لـ passage من 400 token بحد 30: <code>400 * 30 = 12,000</code> بس، مش 400 × 400.</p>'+
         '<p>لو الـ passage أطول من حد الـ BERT (512 token)، بنقسمه لنوافذ متداخلة (sliding windows) ونختار أحسن إجابة من كل النوافذ. والحدود: الـ extractive مش بيقدر يجاوب بـ yes/no ولا يركّب إجابة من جملتين مختلفتين، لأنه بيقتطع بس.</p>',
         '<p>At test time we choose the pair <code>(i, j)</code> that maximizes <code>s_i + e_j</code> under two conditions: <code>i &lt;= j</code> and a reasonable span length (say <code>j - i + 1 &lt;= 30</code>). Why not pick the top start and top end independently? Because the end could land before the start. The number of pairs we check for a 400-token passage with a limit of 30: <code>400 * 30 = 12,000</code> only, not 400 × 400.</p>'+
         '<p>If the passage is longer than BERT\'s limit (512 tokens), we split it into overlapping windows (sliding windows) and take the best answer across windows. The limits: extractive QA cannot answer yes/no or compose an answer from two different sentences, because it only cuts out a span.</p>')),
 q:[
   CQ("ليه بنشترط i ≤ j وحد أقصى لطول الـ span؟","Why do we require i ≤ j and a maximum span length?",
      [["عشان نتجنب span نهايته قبل بدايته أو طويل بشكل غير منطقي، ونقلّل الأزواج اللي بنفحصها","To avoid a span that ends before it starts or is unreasonably long, and to reduce the pairs we check"],["عشان الـ BERT مش بيقبل غير كده","Because BERT accepts nothing else"],["عشان نزوّد الـ loss","To increase the loss"],["عشان الإجابة لازم تبقى كلمة واحدة","Because the answer must be one word"]],
      0,"البداية والنهاية بيتحسبوا منفصلين، فلازم قيد على الزوج.","Start and end are computed separately, so the pair needs a constraint."),
   CQ("الـ scores: s_2 = 1 و s_7 = 4، و e_4 = 5 و e_9 = 3 و e_7 = 2 (الباقي صفر). أنهي span بيتختار بشرط i ≤ j؟","Scores: s_2 = 1 and s_7 = 4, and e_4 = 5, e_9 = 3 and e_7 = 2 (all others zero). Which span is chosen under i ≤ j?",
   [["(7, 4)","(7, 4)"],["(2, 4)","(2, 4)"],["(7, 9)","(7, 9)"],["(7, 7)","(7, 7)"]],
   2,"(7, 4) أعلى مجموع (9) بس نهايته قبل بدايته فمرفوض. باقي المرشحين: (7, 9) = 4 + 3 = 7، و(2, 4) = 1 + 5 = 6، و(7, 7) = 4 + 2 = 6. فالأفضل (7, 9).","(7, 4) has the top sum (9) but ends before it starts, so it is rejected. The rest: (7, 9) = 4 + 3 = 7, (2, 4) = 1 + 5 = 6, (7, 7) = 4 + 2 = 6. So (7, 9) wins.")
 ],
 f:[
   CF("إزاي بنتعامل مع passage أطول من حد الـ BERT (512 token)؟","How do we handle a passage longer than BERT's 512-token limit?",
   "بنقسمه لنوافذ متداخلة (sliding windows) وبنختار أحسن إجابة من كل النوافذ.","We split it into overlapping windows (sliding windows) and take the best answer across windows."),
   CF("إيه حدود الـ extractive QA؟","What are the limits of extractive QA?",
   "مش بيقدر يجاوب yes/no ولا يركّب إجابة من جملتين مختلفتين، لأنه بيقتطع span بس.","It cannot answer yes/no or compose an answer from two different sentences, because it only cuts out a span.")
 ],
 terms:[
   {t:B("Sliding window (long passages)","Sliding window (long passages)"),
 d:B("تقسيم passage طويل لنوافذ متداخلة واختيار أحسن إجابة من كل النوافذ.","Splitting a long passage into overlapping windows and taking the best answer across them.")}
 ]},

{id:"l13-emf1",t:B("مقاييس EM و F1","EM and F1"),
 b:cat(
   B('<p><mark>Exact Match (EM)</mark>: بيدّي 1 لو الإجابة المتوقعة بتطابق إحدى الإجابات المرجعية بعد normalization (lowercase، شيل علامات الترقيم والـ articles زي a و an و the)، وإلا 0. <mark>F1</mark>: بيحسب التطابق على مستوى الـ tokens:</p>'+
         '<div class="m">precision = overlap / len(pred)\nrecall    = overlap / len(gold)\nF1 = 2 * P * R / (P + R)</div>',
         '<p><mark>Exact Match (EM)</mark>: gives 1 if the predicted answer matches one of the reference answers after normalization (lowercase, strip punctuation and articles like a, an, the), otherwise 0. <mark>F1</mark>: computes the match at the token level:</p>'+
         '<div class="m">precision = overlap / len(pred)\nrecall    = overlap / len(gold)\nF1 = 2 * P * R / (P + R)</div>'),
   FIG_F1,
   B('<p>مثال: gold = <code>Denver Broncos</code> و pred = <code>Broncos</code>. التطابق token واحد. <code>P = 1/1 = 1.0</code> و <code>R = 1/2 = 0.5</code> و <code>F1 = 2 * 1.0 * 0.5 / 1.5 = 0.67</code>. لكن EM = 0. أما <code>the Denver Broncos</code> مع <code>Denver Broncos</code> فبعد الـ normalization EM = 1. SQuAD بيدّي كذا إجابة مرجعية للسؤال الواحد ونأخد أعلى درجة، والرقم النهائي متوسط على كل الأسئلة.</p>',
         '<p>An example: gold = <code>Denver Broncos</code> and pred = <code>Broncos</code>. One token matches. <code>P = 1/1 = 1.0</code>, <code>R = 1/2 = 0.5</code>, <code>F1 = 2 * 1.0 * 0.5 / 1.5 = 0.67</code>. But EM = 0. As for <code>the Denver Broncos</code> versus <code>Denver Broncos</code>, after normalization EM = 1. SQuAD gives several reference answers per question and we take the highest score; the final number is the average over all questions.</p>')),
 q:[
   CQ("pred = Denver و gold = Denver Broncos. إيه الدرجات الصح؟","pred = Denver and gold = Denver Broncos. What are the correct scores?",
      [["EM = 1 و F1 = 1","EM = 1 and F1 = 1"],["EM = 0 و F1 = 0.5","EM = 0 and F1 = 0.5"],["EM = 0.5 و F1 = 1","EM = 0.5 and F1 = 1"],["EM = 0 و F1 ≈ 0.67","EM = 0 and F1 ≈ 0.67"]],
      3,"التطابق token واحد: P = 1/1 = 1.0 و R = 1/2 = 0.5، فـ F1 = 2 × 1.0 × 0.5 / 1.5 ≈ 0.67، والـ EM صفر لأن النص مش متطابق.","One token matches: P = 1/1 = 1.0 and R = 1/2 = 0.5, so F1 = 2 × 1.0 × 0.5 / 1.5 ≈ 0.67, and EM is zero because the text does not match exactly."),
   CQ("gold = the Denver Broncos و pred = denver broncos. كام الـ EM؟","gold = the Denver Broncos and pred = denver broncos. What is the EM?",
   [["0، لأن الحروف مختلفة","0, because the letters differ"],["1، لأن الـ normalization بتشيل the وبتوحّد الحروف الصغيرة","1, because normalization removes the and lowercases"],["0.5","0.5"],["مش بيتحسب","It cannot be computed"]],
   1,"بعد lowercase وشيل the الاتنين بيبقوا denver broncos، فالتطابق تام.","After lowercasing and removing the, both become denver broncos, so the match is exact.")
 ],
 f:[
   CF("إيه الفرق بين EM و F1، وإزاي SQuAD 2.0 بيتعامل مع الأسئلة اللي ملهاش إجابة؟","What is the difference between EM and F1, and how does SQuAD 2.0 handle unanswerable questions?",
      "EM = تطابق تام بعد normalization (0 أو 1). F1 = تطابق جزئي على مستوى الـ tokens (من precision و recall). في SQuAD 2.0 النظام لازم يرجّع no-answer لو درجة [CLS] تفوق أحسن span بعتبة tau.","EM = exact match after normalization (0 or 1). F1 = partial token-level overlap (from precision and recall). In SQuAD 2.0 the system must return no-answer when the [CLS] score beats the best span by a threshold tau."),
   CF("إزاي بنحسب precision و recall جوه F1 في الـ QA؟","How do we compute precision and recall inside F1 for QA?",
   "precision = overlap / len(pred)، و recall = overlap / len(gold)، و F1 = 2PR / (P + R).","precision = overlap / len(pred), recall = overlap / len(gold), and F1 = 2PR / (P + R).")
 ],
 terms:[
   {t:B("Exact Match (EM)","Exact Match (EM)"),
 d:B("1 لو الإجابة المتوقعة بتطابق إجابة مرجعية بعد normalization، وإلا 0.","1 if the prediction matches a reference answer after normalization, otherwise 0.")},
   {t:B("F1 (token overlap)","F1 (token overlap)"),
 d:B("تطابق جزئي على مستوى الـ tokens: <code>F1 = 2PR / (P + R)</code>.","Partial token-level overlap: <code>F1 = 2PR / (P + R)</code>.")}
 ]},

{id:"l13-noanswer",t:B("SQuAD 2.0: الأسئلة اللي ملهاش إجابة","SQuAD 2.0: unanswerable questions"),
 b:cat(
   B('<p>مشكلة: النظام بيجاوب حتى لو الإجابة مش موجودة في النص. <mark>SQuAD 2.0</mark> أضاف أكتر من 50,000 سؤال <mark>ملهاش إجابة</mark> في الـ passage، والنظام لازم يمتنع. الحل: نعتبر "no answer" هو span عند <code>[CLS]</code>، ونقارنه بأحسن span حقيقي:</p>'+
         '<div class="m">predict no-answer  if\n(s_CLS + e_CLS) - max over (i,j) of (s_i + e_j) &gt; tau</div>'+
         '<p>العتبة <code>tau</code> بتتظبط على الـ dev set. الدرس العام: <mark>النظام المفيد لازم يعرف يقول "مش عارف"</mark>، وده نفس الموضوع اللي هيرجع في الـ RAG والهلوسة.</p>',
         '<p>A problem: the system answers even when the answer is not in the text. <mark>SQuAD 2.0</mark> added over 50,000 questions with <mark>no answer</mark> in the passage, and the system must abstain. The fix: treat "no answer" as the span at <code>[CLS]</code> and compare it with the best real span:</p>'+
         '<div class="m">predict no-answer  if\n(s_CLS + e_CLS) - max over (i,j) of (s_i + e_j) &gt; tau</div>'+
         '<p>The threshold <code>tau</code> is tuned on the dev set. The general lesson: <mark>a useful system must be able to say "I do not know"</mark>, which is the same theme that returns with RAG and hallucination.</p>'),
   B('<p>مثال: درجة <code>s_CLS + e_CLS = 3.0</code> وأحسن span حقيقي درجته <code>2.2</code>، فالفرق 0.8. لو <code>tau = 0.5</code> فالفرق أكبر منها، والنظام بيرجّع no-answer. ولو <code>tau = 1.0</code> بيجاوب بالـ span. رفع الـ tau بيخلّي النظام يجاوب أكتر، وتقليلها بيخليه يمتنع أكتر.</p>',
         '<p>An example: the score <code>s_CLS + e_CLS = 3.0</code> and the best real span scores <code>2.2</code>, so the gap is 0.8. With <code>tau = 0.5</code> the gap is larger, and the system returns no-answer. With <code>tau = 1.0</code> it answers with the span. Raising tau makes the system answer more, and lowering it makes it abstain more.</p>')),
 q:[
   CQ("إيه المشكلة اللي SQuAD 2.0 بيكشفها؟","What problem does SQuAD 2.0 expose?",
   [["الموديلات بتجاوب حتى لو الإجابة مش موجودة في الـ passage","Models answer even when the answer is not in the passage"],["الـ passages قصيرة جدًا","The passages are too short"],["الـ F1 مش بيشتغل","F1 does not work"],["مفيش أسئلة كفاية","There are not enough questions"]],
   0,"الأسئلة اللي ملهاش إجابة بتجبر النظام يمتنع بدل ما يخمّن.","Unanswerable questions force the system to abstain instead of guessing."),
   CQ("درجة no-answer = 2.6 وأحسن span = 2.4 و tau = 0.5. إيه القرار؟","The null score is 2.6, the best span scores 2.4 and tau = 0.5. What is the decision?",
   [["no-answer، لأن 2.6 أكبر من 2.4","No-answer, because 2.6 is larger than 2.4"],["بنجاوب بالـ span، لأن الفرق 0.2 أقل من tau","Answer with the span, because the gap 0.2 is below tau"],["مستحيل نقرر","Impossible to decide"],["no-answer، لأن tau موجبة","No-answer, because tau is positive"]],
   1,"الشرط إن الفرق (null - best) يزيد عن tau. هنا 0.2 أقل من 0.5 فبنرجّع الـ span.","The rule is that the gap (null - best) must exceed tau. Here 0.2 is below 0.5, so we return the span.")
 ],
 f:[
   CF("إزاي النظام بيقرر no-answer في SQuAD 2.0؟","How does a system decide no-answer in SQuAD 2.0?",
   "بيقارن درجة span الـ [CLS] بأحسن span حقيقي: لو (s_CLS + e_CLS) - max(s_i + e_j) أكبر من tau يرجّع no-answer. والـ tau بتتظبط على الـ dev set.","It compares the [CLS] span score with the best real span: if (s_CLS + e_CLS) - max(s_i + e_j) is greater than tau it returns no-answer. tau is tuned on the dev set."),
   CF("إيه أثر رفع الـ tau؟","What does raising tau do?",
   "النظام بيمتنع أقل ويجاوب أكتر. تقليلها بيخليه يمتنع أكتر.","The system abstains less and answers more. Lowering it makes it abstain more.")
 ],
 terms:[
   {t:B("SQuAD 2.0","SQuAD 2.0"),
 d:B("نسخة من SQuAD فيها أكتر من 50,000 سؤال ملهاش إجابة في الـ passage.","A version of SQuAD with over 50,000 questions that have no answer in the passage.")},
   {t:B("No-answer threshold (tau)","No-answer threshold (tau)"),
 d:B("عتبة بنقارن بيها درجة [CLS] بأحسن span؛ لو الفرق أكبر منها نرجّع no-answer.","A threshold applied to the gap between the [CLS] score and the best span; if the gap exceeds it we return no-answer.")}
 ]},

{id:"l13-opendomain",t:B("Open-domain QA: الـ retriever والـ reader","Open-domain QA: the retriever and the reader"),
 b:cat(
   B('<p>لو مفيش passage معطى، بنبني نظام من <mark>مرحلتين</mark> (زي DrQA سنة 2017): <mark>retriever</mark> يختار أحسن k passage من corpus بالملايين، و<mark>reader</mark> (زي اللي شفناه) يستخرج الإجابة منهم. ليه مرحلتين؟ لأن الـ reader غالي (موديل كبير على كل passage)، ومستحيل نشغّله على 21 مليون passage، فالـ retriever لازم يكون <mark>رخيص</mark> ويقلّل لعشرات.</p>',
         '<p>If no passage is given, we build a system with <mark>two stages</mark> (like DrQA in 2017): a <mark>retriever</mark> picks the best k passages from a corpus of millions, and a <mark>reader</mark> (like the one we saw) extracts the answer from them. Why two stages? Because the reader is expensive (a big model on every passage), and we cannot run it over 21 million passages, so the retriever must be <mark>cheap</mark> and cut the set down to dozens.</p>'),
   FIG_FUNNEL,
   B('<p>الـ retriever الكلاسيكي <mark>sparse</mark>: TF-IDF أو BM25. كل passage بيتمثّل بـ vector طوله حجم الـ vocabulary، معظمه أصفار، والـ score بيتحسب من الكلمات المشتركة مع السؤال. وزن الكلمة:</p>'+
         '<div class="m">tf-idf(w, d) = tf(w, d) * log10(N / df(w))</div>',
         '<p>The classic retriever is <mark>sparse</mark>: TF-IDF or BM25. Each passage is represented by a vector the length of the vocabulary, mostly zeros, and the score comes from words shared with the question. The word weight:</p>'+
         '<div class="m">tf-idf(w, d) = tf(w, d) * log10(N / df(w))</div>')),
 q:[
   CQ("ليه ما بنشغّلش الـ reader على كل الـ corpus؟","Why do we not run the reader over the whole corpus?",
      [["لأن الـ reader مش بيفهم اللغة","Because the reader does not understand language"],["لأنه غالي جدًا على ملايين الـ passages، فلازم retriever رخيص يقلّل العدد الأول","Because it is far too expensive over millions of passages, so a cheap retriever must cut the number first"],["لأن الـ corpus لازم يبقى مرتب","Because the corpus must be sorted"],["لأن الـ TF-IDF بيطلب كده","Because TF-IDF requires it"]],
      1,"الـ reader موديل كبير بيشتغل على كل passage، فالتكلفة بتتضرب في عدد الـ passages.","The reader is a large model run on every passage, so the cost multiplies with the number of passages."),
   CQ("افترض إن الـ reader بياخد 0.05 ثانية لكل passage. تقريبًا كام يوم لتشغيله على 21 مليون passage؟","Assume the reader takes 0.05 s per passage. Roughly how many days to run it over 21 million passages?",
   [["حوالي 12 يوم","About 12 days"],["حوالي ساعة","About one hour"],["حوالي 20 دقيقة","About 20 minutes"],["حوالي 120 يوم","About 120 days"]],
   0,"21,000,000 × 0.05 = 1,050,000 ثانية، يعني حوالي 12.2 يوم. مع الـ top-20 بس هتبقى حوالي ثانية واحدة.","21,000,000 × 0.05 = 1,050,000 seconds, about 12.2 days. With only the top-20 it takes about one second.")
 ],
 f:[
   CF("إيه هو الـ vocabulary mismatch وإزاي بيأثّر على الـ sparse retrieval؟","What is vocabulary mismatch and how does it hurt sparse retrieval?",
      "إن السؤال والـ passage يعبّروا عن نفس المعنى بكلمات مختلفة (founded مقابل established)، فالـ TF-IDF و BM25 اللي بيعتمدوا على الكلمات المشتركة بيفوّتوا الـ passage الصح.","When the question and passage express the same meaning with different words (founded versus established), so TF-IDF and BM25, which rely on shared words, miss the right passage."),
   CF("ليه الـ open-domain QA بيستخدم مرحلتين؟","Why does open-domain QA use two stages?",
   "الـ reader غالي فمينفعش يشتغل على ملايين الـ passages، فالـ retriever الرخيص بيقلّلهم لعشرات الأول.","The reader is expensive and cannot run over millions of passages, so a cheap retriever first cuts them down to dozens.")
 ],
 terms:[
   {t:B("Retriever","Retriever"),
 d:B("مرحلة رخيصة بتختار أحسن k passage من corpus بالملايين.","A cheap stage that picks the best k passages from a corpus of millions.")},
   {t:B("Reader","Reader"),
 d:B("مرحلة غالية بتستخرج الإجابة من الـ passages اللي جابها الـ retriever.","An expensive stage that extracts the answer from the passages the retriever returned.")},
   {t:B("Sparse retrieval","Sparse retrieval"),
 d:B("بحث بالكلمات المشتركة (TF-IDF أو BM25) بـ vectors طولها الـ vocabulary ومعظمها أصفار.","Search by shared words (TF-IDF or BM25) with vocabulary-length vectors that are mostly zeros.")},
   {t:B("TF-IDF","TF-IDF"),
 d:B("وزن الكلمة: <code>tf * log10(N / df)</code>. الكلمة النادرة وزنها أعلى.","Word weight: <code>tf * log10(N / df)</code>. Rare words get a higher weight.")}
 ]},

{id:"l13-sparse",t:B("TF-IDF بمثال: القوة والـ vocabulary mismatch","TF-IDF by example: strengths and vocabulary mismatch"),
 b:cat(
   B('<p>نفتكر وزن الكلمة في الـ sparse retrieval: <code>tf-idf(w, d) = tf(w, d) * log10(N / df(w))</code>.</p>',
         '<p>Recall the word weight in sparse retrieval: <code>tf-idf(w, d) = tf(w, d) * log10(N / df(w))</code>.</p>'),
   B('<p>مثال: N = 1,000,000 passage. كلمة <code>the</code> موجودة في 900,000 منهم: <code>log10(1,000,000 / 900,000) = 0.05</code>، وزن شبه صفر. كلمة <code>Broncos</code> في 1,000 بس: <code>log10(1,000,000 / 1,000) = 3</code>، وزن عالي. يعني الكلمة النادرة هي اللي بتحدد. الـ <mark>BM25</mark> نفس الفكرة بس بيحدّ من تأثير تكرار الكلمة وبيعدّل حسب طول الـ passage.</p>'+
         '<p>مميزاته: سريع، ومش محتاج تدريب، وممتاز لما الكلمة الدقيقة مهمة (أسماء، أكواد، مصطلحات). عيبه الأساسي <mark>vocabulary mismatch</mark>: سؤال "who founded the company" والـ passage بيقول "established by" ما فيهمش كلمات مشتركة كتير، فالـ retriever بيفوّته. وأخطاء الـ retriever <mark>سقف</mark> للنظام كله: لو الـ passage الصح مش في الـ top-k، الـ reader ما يقدرش يعمل حاجة. وده اللي بيحلّه الكارت الجاي.</p>',
         '<p>An example: N = 1,000,000 passages. The word <code>the</code> appears in 900,000 of them: <code>log10(1,000,000 / 900,000) = 0.05</code>, a near-zero weight. The word <code>Broncos</code> appears in only 1,000: <code>log10(1,000,000 / 1,000) = 3</code>, a high weight. So the rare word is what decides. <mark>BM25</mark> is the same idea but limits the effect of repeated words and adjusts for passage length.</p>'+
         '<p>Its strengths: fast, needs no training, and excellent when the exact word matters (names, codes, terms). Its main weakness is <mark>vocabulary mismatch</mark>: the question "who founded the company" and a passage saying "established by" share few words, so the retriever misses it. And retriever errors are a <mark>ceiling</mark> for the whole system: if the right passage is not in the top-k, the reader can do nothing. The next card addresses that.</p>')),
 q:[
   CQ("N = 1,000,000 وكلمة موجودة في 10,000 passage. كام الـ idf (log10)؟","N = 1,000,000 and a word appears in 10,000 passages. What is the idf (log10)?",
   [["2","2"],["4","4"],["100","100"],["0.01","0.01"]],
   0,"log10(1,000,000 / 10,000) = log10(100) = 2.","log10(1,000,000 / 10,000) = log10(100) = 2."),
   CQ("سؤال فيه كود منتج دقيق زي AX-4471. أنسب retriever؟","A question contains an exact product code like AX-4471. Which retriever is the better fit?",
   [["sparse (BM25)، لأن الكلمة الدقيقة هي المهمة","Sparse (BM25), because the exact token matters"],["dense بس، لأنه بيفهم المعنى","Dense only, because it understands meaning"],["مفيش فرق خالص","There is no difference at all"],["الاتنين بيفشلوا","Both fail"]],
   0,"الـ BM25 ممتاز لما الكلمة النادرة الدقيقة هي المفتاح (أسماء، أكواد). الـ dense ممكن يطمّسها.","BM25 is excellent when the rare exact token is the key (names, codes). A dense model may blur it.")
 ],
 f:[
   CF("إيه نقاط قوة الـ sparse retrieval؟","What are the strengths of sparse retrieval?",
   "سريع، ومش محتاج تدريب، وممتاز لما الكلمة الدقيقة مهمة (أسماء، أكواد، مصطلحات).","Fast, needs no training, and excellent when the exact word matters (names, codes, terms)."),
   CF("ليه أخطاء الـ retriever سقف للنظام كله؟","Why are retriever errors a ceiling for the whole system?",
   "لو الـ passage الصح مش في الـ top-k، الـ reader ما يقدرش يعمل حاجة.","If the right passage is not in the top-k, the reader can do nothing.")
 ],
 terms:[
   {t:B("BM25","BM25"),
 d:B("نسخة من TF-IDF بتحدّ من تأثير تكرار الكلمة وبتعدّل حسب طول الـ passage.","A TF-IDF variant that limits the effect of repeated words and adjusts for passage length.")},
   {t:B("Vocabulary mismatch","Vocabulary mismatch"),
 d:B("السؤال والـ passage يعبّروا عن نفس المعنى بكلمات مختلفة، فالـ sparse retrieval بيفوّته.","The question and passage express the same meaning with different words, so sparse retrieval misses it.")}
 ]},

{id:"l13-dpr",t:B("Dense retrieval و DPR","Dense retrieval and DPR"),
 b:cat(
   B('<p>الفكرة: بدل ما نطابق كلمات، نطابق <mark>معنى</mark>. بنستخدم encoder للسؤال <code>E_Q</code> و encoder للـ passage <code>E_P</code> (عادة BERT لكل واحد)، وكل واحد بيطلّع vector (مثلًا 768 بُعد). الـ score هو الـ dot product:</p>'+
         '<div class="m">sim(q, p) = E_Q(q) . E_P(p)</div>',
         '<p>The idea: instead of matching words, match <mark>meaning</mark>. We use an encoder for the question <code>E_Q</code> and an encoder for the passage <code>E_P</code> (usually a BERT for each), and each outputs a vector (say 768 dimensions). The score is the dot product:</p>'+
         '<div class="m">sim(q, p) = E_Q(q) . E_P(p)</div>'),
   FIG_DPR,
   B('<p>الميزة: vectors الـ passages بتتحسب <mark>مرة واحدة offline</mark> ونخزّنها. وقت السؤال بنحسب vector السؤال بس ونبحث عن أقرب vectors. حجم التخزين: <code>21,000,000 * 768 * 4 bytes = 64.5 GB</code> (بدقة 32 bit). فبنستخدم <mark>ANN</mark> (approximate nearest neighbor، زي مكتبة FAISS) وضغط للـ vectors عشان البحث يبقى بالمللي ثانية بدل ما نقارن مع كل الـ 21 مليون.</p>',
         '<p>The advantage: the passage vectors are computed <mark>once, offline</mark>, and stored. At query time we compute only the question vector and search for the nearest vectors. The storage size: <code>21,000,000 * 768 * 4 bytes = 64.5 GB</code> (at 32-bit precision). So we use <mark>ANN</mark> (approximate nearest neighbor, such as the FAISS library) and vector compression so that search takes milliseconds instead of comparing against all 21 million.</p>')),
 q:[
   CQ("ليه vectors الـ passages بتتحسب offline؟","Why are passage vectors computed offline?",
   [["علشان وقت السؤال نحسب vector السؤال بس ونبحث عن أقرب vectors","So at query time we compute only the question vector and search for the nearest vectors"],["علشان نقلّل التخزين","To reduce storage"],["علشان الـ BERT مش بيشتغل online","Because BERT cannot run online"],["علشان نتجنب الـ dot product","To avoid the dot product"]],
   0,"الـ passages ثابتة، فنحسبها مرة واحدة ونوفّر الوقت وقت السؤال.","The passages are fixed, so we compute them once and save time at query time."),
   CQ("10 مليون passage، وكل vector بـ 768 بُعد بدقة 32 bit (4 bytes). كام التخزين تقريبًا؟","10 million passages, each vector 768 dimensions at 32-bit precision (4 bytes). Roughly how much storage?",
   [["حوالي 30.7 GB","About 30.7 GB"],["حوالي 3.1 GB","About 3.1 GB"],["حوالي 307 GB","About 307 GB"],["حوالي 7.7 GB","About 7.7 GB"]],
   0,"10,000,000 × 768 × 4 = 30,720,000,000 bytes، يعني حوالي 30.7 GB.","10,000,000 × 768 × 4 = 30,720,000,000 bytes, about 30.7 GB.")
 ],
 f:[
   CF("إزاي الـ dense retrieval (DPR) بيشتغل وبيتدرّب؟","How does dense retrieval (DPR) work and train?",
      "encoder للسؤال وencoder للـ passage بيطلّعوا vectors، والـ score هو الـ dot product. الـ passage vectors بتتحسب offline وبيتبحث فيها بـ ANN. التدريب بـ contrastive loss مع in-batch negatives (القطر positives وباقي المصفوفة negatives) وhard negatives.","A question encoder and a passage encoder produce vectors, and the score is the dot product. Passage vectors are computed offline and searched with ANN. Training uses a contrastive loss with in-batch negatives (the diagonal are positives and the rest of the matrix negatives) plus hard negatives."),
   CF("إيه الميزة الأساسية للـ dense retrieval بالمقارنة بالـ sparse؟","What is the main advantage of dense retrieval over sparse retrieval?",
   "بيطابق المعنى مش الكلمات، فبيلقط الـ passage حتى لو كلماته مختلفة عن السؤال (بيعالج vocabulary mismatch).","It matches meaning rather than words, so it finds a passage even when its wording differs from the question (it addresses vocabulary mismatch).")
 ],
 terms:[
   {t:B("Dense retrieval","Dense retrieval"),
 d:B("بحث بالمعنى: encoder للسؤال وencoder للـ passage بيطلّعوا vectors، والـ score هو الـ dot product.","Search by meaning: a question encoder and a passage encoder produce vectors, and the score is their dot product.")},
   {t:B("DPR (Dense Passage Retriever)","DPR (Dense Passage Retriever)"),
 d:B("dense retriever بـ BERT للسؤال وBERT للـ passage، بيتدرّب بـ contrastive loss.","A dense retriever with one BERT for the question and one for the passage, trained with a contrastive loss.")},
   {t:B("ANN (approximate nearest neighbor)","ANN (approximate nearest neighbor)"),
 d:B("بحث تقريبي سريع عن أقرب vectors (زي FAISS) بدل المقارنة بكل الـ vectors.","Fast approximate search for the nearest vectors (such as FAISS) instead of comparing against all of them.")}
 ]},

{id:"l13-dpr-training",t:B("تدريب الـ DPR: contrastive loss والـ hybrid","Training DPR: contrastive loss and hybrid retrieval"),
 b:cat(
   B('<p>التدريب: <mark>contrastive loss</mark> مع <mark>in-batch negatives</mark>. batch من B سؤال، ومع كل سؤال الـ passage الصح بتاعه. بنحسب مصفوفة B × B من الـ scores. القطر هو الـ positives وباقي الخانات negatives:</p>'+
         '<div class="m">      p1    p2    p3    p4\nq1   [s11]  s12   s13   s14\nq2    s21  [s22]  s23   s24\nq3    s31   s32  [s33]  s34\nq4    s41   s42   s43  [s44]\n\nloss_i = -log( exp(s_ii) / sum over j of exp(s_ij) )</div>'+
         '<p>مع B = 4 كل سؤال بياخد 3 negatives <mark>مجانًا</mark> من غير حساب إضافي، وكل ما B كبر الـ negatives زادت. وبتتحسّن النتيجة بإضافة <mark>hard negatives</mark>: passages بتشبه السؤال (مثلًا من BM25) بس مش فيها الإجابة.</p>'+
         '<p>الـ dense أحسن في الأسئلة الطبيعية اللي بتختلف كلماتها عن الـ passage، والـ sparse أحسن في الكلمات النادرة والدقيقة. عشان كده كتير من الأنظمة بتدمج الاتنين (<mark>hybrid</mark>).</p>',
         '<p>Training: <mark>contrastive loss</mark> with <mark>in-batch negatives</mark>. A batch of B questions, each with its own correct passage. We compute a B × B matrix of scores. The diagonal holds the positives and the other cells are negatives:</p>'+
         '<div class="m">      p1    p2    p3    p4\nq1   [s11]  s12   s13   s14\nq2    s21  [s22]  s23   s24\nq3    s31   s32  [s33]  s34\nq4    s41   s42   s43  [s44]\n\nloss_i = -log( exp(s_ii) / sum over j of exp(s_ij) )</div>'+
         '<p>With B = 4 each question gets 3 negatives <mark>for free</mark> with no extra computation, and a bigger B gives more negatives. Results improve by adding <mark>hard negatives</mark>: passages that resemble the question (for example from BM25) but do not contain the answer.</p>'+
         '<p>Dense is better on natural questions whose wording differs from the passage, and sparse is better on rare, exact words. That is why many systems combine the two (<mark>hybrid</mark>).</p>')),
 q:[
   CQ("في in-batch negatives، إيه الـ negatives للسؤال q2؟","In in-batch negatives, what are the negatives for question q2?",
      [["الـ passage p2 بس","Only passage p2"],["الأسئلة التانية في الـ batch","The other questions in the batch"],["الـ passages التانية في الـ batch (p1 و p3 و p4)","The other passages in the batch (p1, p3 and p4)"],["passages من خارج الـ batch","Passages from outside the batch"]],
      2,"p2 هو الـ positive لـ q2 (القطر)، وأي passage تاني في الـ batch بيتعامل كـ negative مجانًا.","p2 is the positive for q2 (the diagonal), and every other passage in the batch is treated as a negative for free."),
   CQ("الـ batch حجمه 8. كام negative مجانًا بياخد كل سؤال بـ in-batch negatives؟","The batch size is 8. How many free negatives does each question get with in-batch negatives?",
   [["7","7"],["8","8"],["1","1"],["64","64"]],
   0,"من الـ 8 passages واحد هو الـ positive للسؤال، فيفضل 7 negatives.","Of the 8 passages one is the positive for the question, leaving 7 negatives.")
 ],
 f:[
   CF("إيه هي الـ hard negatives؟","What are hard negatives?",
   "passages بتشبه السؤال (مثلًا من BM25) بس مش فيها الإجابة، وبتحسّن النتيجة لما تتضاف للتدريب.","Passages that resemble the question (for example from BM25) but do not contain the answer; adding them to training improves results."),
   CF("ليه بندمج الـ dense والـ sparse (hybrid)؟","Why combine dense and sparse retrieval (hybrid)?",
   "الـ dense أحسن لما كلمات السؤال بتختلف عن الـ passage، والـ sparse أحسن في الكلمات النادرة الدقيقة، فدمجهم بيغطي الحالتين.","Dense is better when wording differs from the passage, sparse is better on rare exact words, so combining them covers both cases.")
 ],
 terms:[
   {t:B("In-batch negatives","In-batch negatives"),
 d:B("الـ passages التانية في نفس الـ batch بتتعامل كـ negatives مجانًا.","The other passages in the same batch are treated as negatives for free.")},
   {t:B("Hard negatives","Hard negatives"),
 d:B("passages بتشبه السؤال بس مش فيها الإجابة.","Passages that resemble the question but do not contain the answer.")},
   {t:B("Hybrid retrieval","Hybrid retrieval"),
 d:B("دمج الـ sparse والـ dense retrieval.","Combining sparse and dense retrieval.")},
{t:B("Contrastive loss","Contrastive loss"),
 d:B("loss بيقرّب الأزواج الصح (positives) وبيبعّد الأزواج الغلط (negatives) في الـ batch.","A loss that pulls matching pairs (positives) together and pushes wrong pairs (negatives) apart within the batch.")}
 ]},

{id:"l13-rag",t:B("RAG والـ LLMs في الـ QA","RAG and LLMs for QA"),
 b:cat(
   B('<p>النهارده الشائع هو <mark>RAG</mark> (retrieval-augmented generation): الـ retriever يجيب أحسن k قطعة (chunks)، ونحطهم في الـ prompt مع السؤال، والـ LLM بيولّد إجابة مبنية عليهم. بدل الـ extractive reader، الـ generator بيقدر يلخّص ويجمع من أكتر من قطعة ويشرح. وبنقدر نطلب منه <mark>يستشهد بالمصدر</mark> ويقول "مش عارف" لو السياق مش كفاية:</p>'+
         '<div class="m">Context:\n[1] ...chunk 1...\n[2] ...chunk 2...\nQuestion: ...\nAnswer using only the context and cite [n].\nIf the context is not enough, say you do not know.</div>',
         '<p>Today the common setup is <mark>RAG</mark> (retrieval-augmented generation): the retriever fetches the best k chunks, we put them in the prompt with the question, and the LLM generates an answer based on them. Instead of an extractive reader, the generator can summarize, combine several chunks and explain. And we can ask it to <mark>cite the source</mark> and say "I do not know" when the context is not enough:</p>'+
         '<div class="m">Context:\n[1] ...chunk 1...\n[2] ...chunk 2...\nQuestion: ...\nAnswer using only the context and cite [n].\nIf the context is not enough, say you do not know.</div>'),
   B('<p><mark>Chunking</mark>: بنقسّم المستندات لقطع (مثلًا من 200 لـ 500 token مع تداخل صغير). القطعة الكبيرة بتشتّت الـ retriever والصغيرة بتفقد السياق. الأرقام دي نقطة بداية للتجربة مش قاعدة. وبيتحط في كل قطعة ما يلزم من عنوان المستند عشان تفضل مفهومة لوحدها.</p>',
         '<p><mark>Chunking</mark>: we split documents into chunks (say 200 to 500 tokens with a small overlap). A large chunk distracts the retriever and a small one loses context. These numbers are a starting point for experiments, not a rule. And we put into each chunk whatever it needs, such as the document title, so it stays understandable on its own.</p>')),
 q:[
   CQ("في prompt الـ RAG، نطلب من الـ LLM يعمل إيه لو السياق مش كفاية؟","In a RAG prompt, what do we ask the LLM to do when the context is not enough?",
   [["يقول إنه مش عارف بدل ما يخمّن","Say it does not know instead of guessing"],["يخترع إجابة منطقية","Invent a plausible answer"],["يتجاهل السياق","Ignore the context"],["يكرر السؤال","Repeat the question"]],
   0,"ده بيقلّل الهلوسة، وبنطلب منه كمان يستشهد بالقطعة [n].","This reduces hallucination, and we also ask it to cite the chunk [n]."),
   CQ("مستند 2,000 token، والقطع 500 token بتداخل 100 token. كام قطعة؟","A document has 2,000 tokens, with 500-token chunks and a 100-token overlap. How many chunks?",
   [["4","4"],["5","5"],["6","6"],["8","8"]],
   1,"كل قطعة جديدة بتتقدم 400 token: بدايات 0 و400 و800 و1200 و1600، والأخيرة بتوصل لـ 2000. يعني 5 قطع.","Each new chunk advances 400 tokens: starts at 0, 400, 800, 1200 and 1600, and the last one reaches 2000. That is 5 chunks.")
 ],
 f:[
   CF("إيه هو الـ RAG وإزاي بنقيّمه؟","What is RAG and how do we evaluate it?",
      "بنجيب أحسن k قطعة بالـ retriever ونحطها في الـ prompt، والـ LLM بيولّد إجابة مبنية عليها (ويستشهد). بنقيّم الحلقتين منفصلتين: recall@k للـ retriever و faithfulness للـ generator، وبنبدأ بتحسين الأضعف.","The retriever fetches the best k chunks and we put them in the prompt, and the LLM generates an answer based on them (and cites). We evaluate the two links separately: recall@k for the retriever and faithfulness for the generator, and we start by improving the weaker one."),
   CF("إيه هو الـ chunking وليه حجم القطعة مهم؟","What is chunking and why does chunk size matter?",
   "تقسيم المستندات لقطع (مثلًا من 200 لـ 500 token بتداخل صغير). الكبيرة بتشتّت الـ retriever والصغيرة بتفقد السياق.","Splitting documents into chunks (say 200 to 500 tokens with a small overlap). A large chunk distracts the retriever and a small one loses context.")
 ],
 terms:[
   {t:B("RAG","RAG"),
 d:B("Retrieval-Augmented Generation: بنجيب المقاطع المناسبة من مصدر خارجي ونحطها في الـ prompt.","Retrieval-Augmented Generation: we fetch the relevant passages from an external source and put them in the prompt.")},
   {t:B("Chunking","Chunking"),
 d:B("تقسيم المستندات لقطع قبل الفهرسة (مثلًا من 200 لـ 500 token بتداخل صغير).","Splitting documents into chunks before indexing (say 200 to 500 tokens with a small overlap).")}
 ]},

{id:"l13-rag-eval",t:B("أماكن فشل الـ RAG وإزاي نقيّمه","Where RAG fails and how to evaluate it"),
 b:cat(
   B('<p>أماكن الفشل:<br>• <mark>Retrieval miss</mark>: الإجابة مش في الـ top-k.<br>• الـ LLM <mark>يتجاهل السياق</mark> أو يخلطه بمعرفته القديمة.<br>• <mark>Lost in the middle</mark>: دراسات لاحظت إن الموديلات بتستفيد أقل من معلومة في نص سياق طويل مقارنة ببدايته ونهايته.<br>• سياق <mark>متعارض أو قديم</mark>.</p>',
         '<p>The places where it fails:<br>• <mark>Retrieval miss</mark>: the answer is not in the top-k.<br>• The LLM <mark>ignores the context</mark> or mixes it with its old knowledge.<br>• <mark>Lost in the middle</mark>: studies observed that models benefit less from information in the middle of a long context than from its start and end.<br>• <mark>Conflicting or outdated</mark> context.</p>'),
   FIG_RAGCHAIN,
   B('<p>عشان كده <mark>بنقيّم الحلقتين منفصلتين</mark>: <mark>recall@k</mark> للـ retriever (نسبة الأسئلة اللي الـ passage الصح ظهر في الـ top-k) و<mark>faithfulness</mark> للـ generator (هل الإجابة مدعومة بالسياق؟). لو recall@5 = 0.80 والـ generator صح بنسبة 0.90 لما السياق صح، فالنتيجة تقريبًا <code>0.80 * 0.90 = 0.72</code> (تقريب بيفترض استقلال). والتحسين بيبدأ بأضعف حلقة: لو الـ recall واطي، تحسين الـ prompt مش هيفيد.</p>'+
         '<p>وزي ما شفنا في محاضرة Fine-tuning: RAG هو الحل لما المشكلة <mark>معرفة ناقصة أو متغيرة أو خاصة</mark>، و closed-book مناسب للمعرفة العامة الثابتة لما السرعة والبساطة أهم من المصدر.</p>',
         '<p>That is why we <mark>evaluate the two links separately</mark>: <mark>recall@k</mark> for the retriever (the fraction of questions where the right passage appeared in the top-k) and <mark>faithfulness</mark> for the generator (is the answer supported by the context?). If recall@5 = 0.80 and the generator is right 0.90 of the time when the context is right, the result is roughly <code>0.80 * 0.90 = 0.72</code> (an approximation that assumes independence). And improvement starts with the weakest link: if recall is low, improving the prompt will not help.</p>'+
         '<p>And as we saw in the Fine-tuning lecture: RAG is the answer when the problem is <mark>missing, changing or private knowledge</mark>, while closed-book suits stable general knowledge when speed and simplicity matter more than a source.</p>')),
 q:[
   CQ("نظام RAG: recall@5 = 0.60 والـ generator صح 0.95 لما السياق صح. أنسب خطوة أولى للتحسين؟","A RAG system: recall@5 = 0.60 and the generator is right 0.95 of the time when the context is right. What is the best first improvement?",
      [["تحسين الـ retriever لأنه الحلقة الأضعف","Improve the retriever because it is the weakest link"],["إعادة صياغة الـ prompt","Rewrite the prompt"],["رفع الـ temperature","Raise the temperature"],["تكبير الـ generator","Make the generator bigger"]],
      0,"النتيجة تقريبًا 0.60 × 0.95 = 0.57، والـ retriever هو اللي بيضيّع معظم الأسئلة. الـ generator كويس أصلًا.","The result is roughly 0.60 × 0.95 = 0.57, and the retriever is where most questions are lost. The generator is already good."),
   CQ("الـ generator بيدّي إجابة مش مدعومة بالـ passages اللي جابها الـ retriever. أنهي مقياس بيكشف ده؟","The generator gives an answer that the retrieved passages do not support. Which metric catches this?",
   [["recall@k","recall@k"],["faithfulness","faithfulness"],["EM على الـ retriever","EM on the retriever"],["حجم الـ batch","Batch size"]],
   1,"الـ faithfulness بيقيس هل الإجابة مدعومة بالسياق. الـ recall@k بيقيس الـ retriever بس.","Faithfulness measures whether the answer is supported by the context. recall@k measures only the retriever.")
 ],
 f:[
   CF("إيه الفرق بين recall@k و faithfulness؟","What is the difference between recall@k and faithfulness?",
   "recall@k للـ retriever: نسبة الأسئلة اللي الـ passage الصح ظهر في الـ top-k. faithfulness للـ generator: هل الإجابة مدعومة بالسياق.","recall@k is for the retriever: the fraction of questions whose right passage appeared in the top-k. Faithfulness is for the generator: is the answer supported by the context?"),
   CF("إمتى RAG هو الحل ومتى closed-book؟","When is RAG the right answer and when is closed-book?",
   "RAG لما المشكلة معرفة ناقصة أو متغيرة أو خاصة. closed-book للمعرفة العامة الثابتة لما السرعة والبساطة أهم من المصدر.","RAG when the problem is missing, changing or private knowledge. Closed-book for stable general knowledge when speed and simplicity matter more than a source.")
 ],
 terms:[
   {t:B("recall@k","recall@k"),
 d:B("نسبة الأسئلة اللي الـ passage الصح ظهر في الـ top-k بتاعها.","The fraction of questions whose right passage appeared in the top-k.")},
   {t:B("Faithfulness (RAG)","Faithfulness (RAG)"),
 d:B("هل إجابة الـ generator مدعومة بالسياق اللي اتجاب؟","Is the generator's answer supported by the retrieved context?")},
   {t:B("Lost in the middle","Lost in the middle"),
 d:B("الموديلات بتستفيد أقل من المعلومة في نص السياق الطويل مقارنة ببدايته ونهايته.","Models benefit less from information in the middle of a long context than from its start and end.")}
 ]},

{id:"l13-multihop",
 t:B("الـ Multi-hop QA: لما الإجابة محتاجة أكتر من خطوة","Multi-hop QA: when the answer needs more than one step"),
 b:cat(
   B('<p>الـ <mark>Multi-hop QA</mark> هو سؤال محتاج معلومات من <mark>أكتر من passage</mark>. مثال: "In which country was the author of Don Quixote born؟". الخطوة 1: مين المؤلف؟ (Cervantes). الخطوة 2: اتولد فين؟ (Spain). اسم Cervantes مش في السؤال، وهو اللي بيربط الخطوتين، واسمه <mark>bridge entity</mark>.</p>',
     '<p><mark>Multi-hop QA</mark> needs facts from <mark>more than one passage</mark>. Example: "In which country was the author of Don Quixote born?". Hop 1: who is the author? (Cervantes). Hop 2: where was he born? (Spain). Cervantes is not in the question; it links the hops and is the <mark>bridge entity</mark>.</p>'),
   FIG_MULTIHOP,
   B('<p>الـ retrieval الواحد غالبًا بيفشل: الـ passage اللي فيه الإجابة ممكن يشارك السؤال كلمات قليلة، فالوصول له بيتم عن طريق الـ bridge entity بس.</p>'+
     '<p>الحلول الشائعة:<br>• <mark>Iterative retrieval</mark>: نبحث ونقرا ونكوّن query جديد فيه الـ bridge entity ونبحث تاني.<br>• <mark>Question decomposition</mark>: الـ LLM يقسّم السؤال لأسئلة فرعية نجاوبها بالترتيب.</p>'+
     '<p>الأخطاء بتتراكم: لو الـ recall في كل خطوة 0.8 فخطوتين بيدّوا تقريبًا <code>0.8 * 0.8 = 0.64</code> (بافتراض الاستقلال)، وتلات خطوات <code>0.8^3 = 0.51</code>. غلطة شائعة: نفتكر إن زيادة k كفاية. دي بتزوّد الضجيج، والـ passage التاني ممكن ما يتجابش من غير الـ bridge entity. وداتا زي <mark>HotpotQA</mark> بتطلب كمان الجمل الداعمة، فالنظام ما يقدرش يخمّن بس.</p>',
     '<p>One retrieval often fails: the passage with the answer may share few words with the question, so it is reachable only through the bridge entity.</p>'+
     '<p>Common fixes:<br>• <mark>Iterative retrieval</mark>: search, read, build a new query containing the bridge entity, and search again.<br>• <mark>Question decomposition</mark>: an LLM splits the question into sub-questions answered in order.</p>'+
     '<p>Errors accumulate: if the recall of each hop is 0.8, two hops give roughly <code>0.8 * 0.8 = 0.64</code> (assuming independence), and three give <code>0.8^3 = 0.51</code>. A common mistake is to think a larger k is enough. It adds noise, and the second passage may not be retrieved without the bridge entity. Datasets like <mark>HotpotQA</mark> also ask for the supporting sentences, so a system cannot just guess.</p>')),
 q:[
   CQ("إيه اللي بيخلّي السؤال multi-hop؟","What makes a question multi-hop?",
      [["إجابته محتاجة معلومات من أكتر من passage بتتربط ببعض","Its answer needs facts from more than one passage, linked together"],["إنه طويل","That it is long"],["إنه بالعربي","That it is in Arabic"],["إجابته رقم","That its answer is a number"]],
      0,"المعلومة التانية بتتوصل بالأولى عن طريق الـ bridge entity.","The second fact is reached through the first one via the bridge entity."),
   CQ("الـ recall في كل hop = 0.9 والسؤال 3 hops. كام احتمال نجيب كل الـ passages الصح (بافتراض الاستقلال)؟","The recall of each hop is 0.9 and the question has 3 hops. What is the probability of retrieving all the right passages (assuming independence)?",
      [["0.90","0.90"],["0.81","0.81"],["0.73","0.73"],["0.27","0.27"]],
      2,"0.9 × 0.9 × 0.9 = 0.729، يعني حوالي 0.73. كل hop بيقلّل الاحتمال.","0.9 × 0.9 × 0.9 = 0.729, about 0.73. Every extra hop lowers the probability.")
 ],
 f:[
   CF("إيه هو الـ multi-hop QA وليه retrieval واحد بيصعب عليه؟","What is multi-hop QA and why is a single retrieval not enough?",
      "سؤال محتاج معلومات من أكتر من passage. الـ passage اللي فيه الإجابة ممكن يتربط بالسؤال عن طريق الـ bridge entity بس، فبحث واحد بكلمات السؤال بيفوّته.","A question that needs facts from more than one passage. The passage with the answer may be tied to the question only through the bridge entity, so one search with the question words misses it."),
   CF("إزاي بيشتغل الـ iterative retrieval؟","How does iterative retrieval work?",
      "نبحث ونقرا، نطلّع الـ bridge entity، ونكوّن query جديد بيه، ونبحث تاني لحد ما نوصل للإجابة.","Search and read, extract the bridge entity, build a new query with it, and search again until we reach the answer.")
 ],
 terms:[
   {t:B("Multi-hop QA","Multi-hop QA"),
    d:B("سؤال محتاج تجمع معلومات من أكتر من passage.","A question that needs you to combine facts from more than one passage.")},
   {t:B("Bridge entity","Bridge entity"),
    d:B("الكيان الوسيط اللي بيربط خطوات الـ multi-hop (زي Cervantes).","The intermediate entity that links the hops of a multi-hop question (such as Cervantes).")},
   {t:B("Iterative retrieval","Iterative retrieval"),
    d:B("بحث متكرر: كل query جديد بيتبني على اللي اتقرا في الخطوة اللي فاتت.","Repeated search where each new query is built from what was read in the previous step.")},
   {t:B("Question decomposition","Question decomposition"),
    d:B("تقسيم السؤال المعقّد لأسئلة فرعية بتتجاوب بالترتيب.","Splitting a complex question into sub-questions answered in order.")}
 ]},

{id:"l13-longcontext",
 t:B("الـ Long-context: نحط المستند كله في الـ prompt؟","Long context: why not put the whole document in the prompt?"),
 b:cat(
   B('<p>الموديلات الحديثة بتقبل سياق طويل جدًا (لحد مليون token في بعضها). فليه ما نستغناش عن الـ retriever ونحط المستند كله في الـ prompt؟ ده <mark>long-context QA</mark>. مفيش retriever يفوّت الـ passage الصح، ومناسب للأسئلة اللي محتاجة المستند ككل زي التلخيص.</p>',
     '<p>Modern LLMs accept very long contexts (up to a million tokens in some models). Why not skip the retriever and put the whole document in the prompt? This is <mark>long-context QA</mark>. No retriever can miss the right passage, and it suits questions that need the document as a whole, such as summaries.</p>'),
   FIG_LOSTMIDDLE,
   B('<p>لكن كل سؤال بيعالج السياق كله. مستند 200,000 token مقابل RAG بـ 5 قطع × 400 token (يعني 2,000 token) فالفرق <code>200,000 / 2,000 = 100</code> ضعف، بتكلفة و latency أعلى. والدقة ممكن تقل بسبب <mark>lost in the middle</mark>. واختبار <mark>needle in a haystack</mark> (نخبّي جملة في نص طويل ونسأل عنها) بتنجح فيه موديلات كتير، لكن ده مش بيثبت إنها بتستنتج من السياق كله.</p>'+
     '<p>نستخدم إيه؟ الـ long-context لو المستندات قليلة أو الأسئلة على المستند كله. الـ RAG لو الـ corpus كبير أو بيتغيّر (21 مليون passage حوالي 2 مليار كلمة، أكتر بكتير من أي نافذة)، أو محتاجين مصدر وتكلفة أقل. وكتير من الأنظمة بتدمجهم: نجيب قطع كتير ونحط الأهم في الأول. غلطة شائعة: "الـ long-context بيلغي الـ RAG".</p>',
     '<p>But every question processes the entire context. A 200,000-token document against RAG with 5 chunks of 400 tokens (2,000 tokens) means <code>200,000 / 2,000 = 100</code> times more tokens, with higher cost and latency. Accuracy can also drop: <mark>lost in the middle</mark>. And the <mark>needle in a haystack</mark> test (hide one sentence in a long text and ask about it) is passed by many models, but that does not prove reasoning over the whole context.</p>'+
     '<p>Which to use? Long context for a few documents or whole-document questions. RAG for a large or changing corpus (21 million passages are roughly 2 billion words, far more than any window), or when we need a source and a lower cost. Many systems combine them: retrieve many chunks and put the most relevant first. A common mistake: "long context makes RAG obsolete".</p>')),
 q:[
   CQ("إيه معنى lost in the middle؟","What does lost in the middle mean?",
      [["الموديل بيستفيد أقل من المعلومة اللي في نص السياق الطويل مقارنة ببدايته ونهايته","The model benefits less from information in the middle of a long context than from its start and end"],["الموديل بيضيّع الـ prompt","The model loses the prompt"],["الـ retriever بيرجّع passages ناقصة","The retriever returns incomplete passages"],["الـ tokens اللي في النص بتتحذف","Tokens in the middle are deleted"]],
      0,"الدقة بتبقى أعلى لما المعلومة في الأول أو الآخر.","Accuracy is higher when the fact is at the start or the end."),
   CQ("مستند 300,000 token، و RAG بيدّي 3 قطع كل واحدة 500 token. السياق الكامل بيعالج كام ضعف تقريبًا؟","A document has 300,000 tokens, and RAG supplies 3 chunks of 500 tokens each. About how many times more tokens does the full-context approach process?",
      [["200 ضعف","200 times"],["100 ضعف","100 times"],["20 ضعف","20 times"],["600 ضعف","600 times"]],
      0,"RAG = 3 × 500 = 1,500 token. 300,000 / 1,500 = 200.","RAG = 3 × 500 = 1,500 tokens. 300,000 / 1,500 = 200.")
 ],
 f:[
   CF("إمتى نختار RAG بدل الـ long context؟","When do we choose RAG over long context?",
      "لما الـ corpus كبير أو بيتغيّر، ولما عايزين مصدر وتكلفة أقل لكل سؤال. الـ long-context مناسب لمستندات قليلة أو أسئلة محتاجة المستند كله.","When the corpus is large or changing, and when we want a source and a lower cost per question. Long context suits a few documents or questions that need the whole document."),
   CF("إيه هو اختبار needle in a haystack؟","What is the needle in a haystack test?",
      "بنخبّي جملة في نص طويل ونسأل عنها. النجاح فيه مش بيثبت إن الموديل بيستنتج من السياق كله.","We hide one sentence in a long text and ask about it. Passing it does not prove the model can reason over the whole context.")
 ],
 terms:[
   {t:B("Long-context QA","Long-context QA"),
    d:B("بنحط المستند كله في الـ prompt بدل ما نسترجع قطع منه.","Putting the whole document in the prompt instead of retrieving chunks from it.")},
   {t:B("Needle in a haystack","Needle in a haystack"),
    d:B("اختبار بنخبّي فيه جملة في نص طويل ونسأل عنها.","A test that hides one sentence in a long text and asks about it.")}
 ]},

{id:"l13-recap",
 t:B("Recap: ملخص محاضرة الـ Question Answering","Recap: Question Answering"),
 b:cat(
   B('<p><mark>5 نقاط:</mark><br>1. الفرق بين الإعدادات هو مصدر المعلومة: closed-book (الأوزان)، reading comprehension (passage معطى)، open-domain (corpus ضخم).<br>2. الـ extractive reader بيتنبأ ببداية ونهاية، والتقييم بـ EM و F1، وSQuAD 2.0 بيضيف no-answer بعتبة tau.<br>3. الـ open-domain = retriever رخيص + reader غالي. الـ sparse (BM25) بيقع في vocabulary mismatch، والـ dense (DPR) بيطابق المعنى.<br>4. الـ RAG بيحط القطع في الـ prompt، وبنقيّم الـ retriever (recall@k) والـ generator (faithfulness) منفصلين.<br>5. الحالات الصعبة: الـ multi-hop محتاج retrieval متكرر، والـ long-context عنده lost in the middle وتكلفة أعلى.</p>'+
     '<div class="m">P_start(i) = softmax_i( w_s . h_i )\nF1 = 2PR / (P + R)\ntf-idf = tf * log10(N / df)\nsim(q, p) = E_Q(q) . E_P(p)\naccuracy ~ recall@k * faithfulness</div>'+
     '<p><mark>قبل المحاضرة اللي بعدها:</mark> لازم تعرف تحسب F1 لإجابتين، وتشرح ليه الـ retriever سقف للنظام، وتفرّق بين RAG والـ long-context.</p>',
     '<p><mark>Five points:</mark><br>1. The setups differ in where the information comes from: closed-book (the weights), reading comprehension (a given passage), open-domain (a huge corpus).<br>2. The extractive reader predicts a start and an end, evaluation uses EM and F1, and SQuAD 2.0 adds no-answer with a threshold tau.<br>3. Open-domain = cheap retriever + expensive reader. Sparse (BM25) suffers from vocabulary mismatch, and dense (DPR) matches meaning.<br>4. RAG puts chunks in the prompt, and we evaluate the retriever (recall@k) and the generator (faithfulness) separately.<br>5. The hard cases: multi-hop needs repeated retrieval, and long context has lost in the middle and a higher cost.</p>'+
     '<div class="m">P_start(i) = softmax_i( w_s . h_i )\nF1 = 2PR / (P + R)\ntf-idf = tf * log10(N / df)\nsim(q, p) = E_Q(q) . E_P(p)\naccuracy ~ recall@k * faithfulness</div>'+
     '<p><mark>Before the next lecture:</mark> you should be able to compute F1 for two answers, explain why the retriever is a ceiling for the system, and tell RAG and long context apart.</p>')),
 q:[
   CQ("إيه اللي بيحدّ أقصى دقة نظام open-domain حتى لو الـ reader ممتاز؟","What caps the accuracy of an open-domain system even when the reader is excellent?",
      [["الـ recall بتاع الـ retriever: لو الـ passage الصح مش في الـ top-k","The retriever's recall: if the right passage is not in the top-k"],["حجم الـ batch","The batch size"],["الـ learning rate","The learning rate"],["لغة الإجابة","The language of the answer"]],
      0,"الـ reader بيشتغل على اللي الـ retriever جابه بس.","The reader works only on what the retriever returned."),
   CQ("نظام RAG: recall@5 = 0.9 و faithfulness = 0.6. إيه الدقة التقريبية وأول حلقة نحسّنها؟","A RAG system: recall@5 = 0.9 and faithfulness = 0.6. What is the rough accuracy and which link do we improve first?",
      [["حوالي 0.54، وبنبدأ بالـ generator","About 0.54, and we start with the generator"],["حوالي 0.54، وبنبدأ بالـ retriever","About 0.54, and we start with the retriever"],["حوالي 0.75، وبنبدأ بالـ generator","About 0.75, and we start with the generator"],["حوالي 1.5، ومفيش حاجة نحسّنها","About 1.5, and nothing to improve"]],
      0,"0.9 × 0.6 = 0.54، والـ faithfulness هي الحلقة الأضعف.","0.9 × 0.6 = 0.54, and faithfulness is the weakest link.")
 ],
 f:[
   CF("لخّص المحاضرة في جملتين.","Summarize the lecture in two sentences.",
      "الإجابة في الـ QA جاية من أوزان الموديل أو passage معطى أو retrieval من corpus. الـ RAG بيجمع retriever و LLM وبنقيّم كل حلقة لوحدها، والحالات الصعبة هي multi-hop و long-context.","QA answers come from the model weights, a given passage, or retrieval from a corpus. RAG combines a retriever and an LLM and we evaluate each link separately, and the hard cases are multi-hop and long context."),
   CF("إيه المعادلات الأساسية في المحاضرة؟","What are the key equations of the lecture?",
      "F1 = 2PR / (P + R)، و tf-idf = tf * log10(N / df)، و sim(q, p) = E_Q(q) . E_P(p)، والدقة الكلية تقريبًا recall@k * faithfulness.","F1 = 2PR / (P + R), tf-idf = tf * log10(N / df), sim(q, p) = E_Q(q) . E_P(p), and the overall accuracy is roughly recall@k * faithfulness.")
 ]}
]}
);

})();
