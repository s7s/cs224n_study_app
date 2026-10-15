/* Lecture 15: Evaluation & Benchmarks
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L15 fig: cost versus realism of evaluation methods */
function l15SpecFig(){
  var R=[['multiple choice',0.15,0.30],['unit tests',0.30,0.50],['LLM judge',0.50,0.70],['human votes',1.0,1.0]],s='',i,y;
  s+=T(150,16,'cost','tm','start','font-size:10.5px')+T(258,16,'realism','tm','start','font-size:10.5px');
  for(i=0;i<4;i++){
    y=30+i*34;
    s+=T(10,y+14,R[i][0],'tb','start','font-size:10.5px');
    s+=RECT(150,y,90,18,'var(--sf)','var(--ln)',4,1.2)+RECT(150,y,Math.round(90*R[i][1]),18,'var(--no)','none',4,1);
    s+=RECT(258,y,90,18,'var(--sf)','var(--ln)',4,1.2)+RECT(258,y,Math.round(90*R[i][2]),18,'var(--ok)','none',4,1);
  }
  s+=T(180,186,'illustrative: cheaper usually means further from real use','tm','middle','font-size:10px');
  return s;
}

var FIG_L15_SPEC=fig(196,l15SpecFig(),
  B('كل طريقة تقييم بتوازن بين التكلفة والواقعية. الأرقام في الرسم تقريبية للتوضيح بس.',
    'Every evaluation method trades cost against realism. The values in the figure are rough and only illustrative.'));

/* L15 fig: confidence intervals */
function l15CiFig(){
  function X(v){return 40+(v-70)/20*300;}
  function eb(y,m,col,label){
    return '<line x1="'+X(m-2.5)+'" y1="'+y+'" x2="'+X(m+2.5)+'" y2="'+y+'" style="stroke:var(--'+col+');stroke-width:2.4"/>'+
      '<line x1="'+X(m-2.5)+'" y1="'+(y-6)+'" x2="'+X(m-2.5)+'" y2="'+(y+6)+'" style="stroke:var(--'+col+');stroke-width:2.4"/>'+
      '<line x1="'+X(m+2.5)+'" y1="'+(y-6)+'" x2="'+X(m+2.5)+'" y2="'+(y+6)+'" style="stroke:var(--'+col+');stroke-width:2.4"/>'+
      DOT(X(m),y,col,5)+T(X(m),y-12,label,'tb','middle','font-size:10.5px');
  }
  var s='',v;
  s+=RECT(X(78.5),30,X(82.5)-X(78.5),94,'var(--acs)','none',0,1);
  s+=eb(62,80,'ac','model A: 80.0 \u00b1 2.5')+eb(102,81,'ok','model B: 81.0 \u00b1 2.5');
  s+='<line x1="40" y1="134" x2="340" y2="134" style="stroke:var(--mu);stroke-width:1.4"/>';
  for(v=70;v<=90;v+=5){s+='<line x1="'+X(v)+'" y1="134" x2="'+X(v)+'" y2="139" style="stroke:var(--mu);stroke-width:1.4"/>'+T(X(v),153,v+'%','tm','middle','font-size:10px');}
  s+=T(180,178,'ranges overlap: a 1-point gap is noise','tb','middle','font-size:10.5px;fill:var(--no)');
  return s;
}

var FIG_L15_CI=fig(190,l15CiFig(),
  B('موديلين على 1000 سؤال: 80.0% و81.0%. هامش الخطأ (95%) حوالي ±2.5 نقطة لكل واحد، والمنطقتين متداخلتين، فالفرق ممكن يكون ضجيج.',
    'Two models on 1000 questions: 80.0% and 81.0%. The 95% margin is about ±2.5 points for each, and the ranges overlap, so the gap may be noise.'));

/* L15 fig: pass@k */
function l15PassFig(){
  var s='',i,x;
  s+=T(10,16,'n = 10 samples, c = 3 pass the tests','tm','start','font-size:10.5px');
  for(i=0;i<10;i++){
    x=10+i*34;
    s+=RECT(x,26,30,30,i<3?'var(--okbg)':'var(--nobg)',i<3?'var(--ok)':'var(--no)',6,1.6)+T(x+15,46,i<3?'ok':'x','tb','middle','font-size:11px');
  }
  s+=T(10,86,'pass@1','tb','start','font-size:10.5px')+RECT(70,72,Math.round(0.30*220),18,'var(--ac)','none',4,1)+T(70+66+8,86,'0.30','tb','start','font-size:10.5px');
  s+=T(10,116,'pass@5','tb','start','font-size:10.5px')+RECT(70,102,Math.round(0.9167*220),18,'var(--ok)','none',4,1)+T(70+202+8,116,'0.92','tb','start','font-size:10.5px');
  s+=T(180,150,'pass@k = 1 - C(n-c, k) / C(n, k)','tm','middle','font-size:10.5px');
  s+=T(180,168,'more attempts, higher pass@k','tb','middle','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_L15_PASS=fig(180,l15PassFig(),
  B('10 حلول اتولّدت لمسألة، 3 منهم عدّوا الـ tests. احتمال إن حل واحد صح هو 0.30، واحتمال إن واحد على الأقل من 5 صح هو 0.92.',
    'Ten solutions were generated for a problem and 3 passed the tests. The chance that one solution is right is 0.30, and the chance that at least one of 5 is right is 0.92.'));

/* L15 fig: Elo win probability */
function l15EloFig(){
  var s='',pts=[],d,p;
  for(d=-400;d<=400;d+=20){p=1/(1+Math.pow(10,-d/400));pts.push((30+(d+400)/800*310).toFixed(1)+','+(160-p*120).toFixed(1));}
  s+='<line x1="30" y1="160" x2="340" y2="160" style="stroke:var(--mu);stroke-width:1.4"/><line x1="30" y1="40" x2="30" y2="160" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+='<line x1="30" y1="100" x2="340" y2="100" style="stroke:var(--ln);stroke-width:1.2;stroke-dasharray:4 4"/>';
  s+='<polyline points="'+pts.join(' ')+'" style="fill:none;stroke:var(--ac);stroke-width:2.6"/>';
  s+='<line x1="262.5" y1="69" x2="262.5" y2="160" style="stroke:var(--ok);stroke-width:1.6;stroke-dasharray:4 4"/>'+DOT(262.5,68.8,'ok',5);
  s+=T(252,56,'gap 200: 76% win','tb','end','font-size:10.5px;fill:var(--ok)');
  s+=T(30,32,'P(A beats B)','tm','start','font-size:10.5px');
  s+=T(24,44,'1.0','tm','end','font-size:9.5px')+T(24,104,'0.5','tm','end','font-size:9.5px')+T(24,164,'0','tm','end','font-size:9.5px');
  s+=T(30,176,'-400','tm','middle','font-size:9.5px')+T(185,176,'0','tm','middle','font-size:9.5px')+T(340,176,'+400','tm','middle','font-size:9.5px');
  s+=T(185,194,'rating gap (R_A - R_B)','tm','middle','font-size:10.5px');
  return s;
}

var FIG_L15_ELO=fig(204,l15EloFig(),
  B('احتمال إن A يكسب B بيزيد مع فرق التقييم بمنحنى logistic. عند فرق 200 نقطة الاحتمال حوالي 76%.',
    'The chance that A beats B grows with the rating gap along a logistic curve. At a gap of 200 points the probability is about 76%.'));

/* L15 fig: judge position swap */
function l15JudgeFig(){
  var s='';
  function row(y,first,second,res){
    return RECT(10,y,108,30,'var(--sf)','var(--ln)',7,1.5)+T(64,y+19,first+' then '+second,'','middle','font-size:10px')+
      AL(118,y+15,150,y+15,'mu','mM')+RECT(152,y,70,30,'var(--acs)','var(--ac)',7,1.7)+T(187,y+19,'judge','tb','middle','font-size:10.5px')+
      AL(222,y+15,254,y+15,'mu','mM')+RECT(256,y,94,30,'var(--sf)','var(--ln)',7,1.5)+T(303,y+19,res,'tb','middle','font-size:10px');
  }
  s+=row(16,'A','B','winner: A')+row(62,'B','A','winner: B');
  s+=T(180,124,'the winner flips when the order flips','tb','middle','font-size:10.5px;fill:var(--no)');
  s+=T(180,142,'position bias: count it as a tie','tm','middle','font-size:10.5px');
  return s;
}

var FIG_L15_JUDGE=fig(156,l15JudgeFig(),
  B('بنعرض نفس الإجابتين للحكم مرتين بترتيب مختلف. لو الفايز اتغيّر مع الترتيب يبقى الحكم متأثر بالموضع، فبنعتبرها تعادل.',
    'We show the judge the same two answers twice in different orders. If the winner changes with the order, the judge is swayed by position, so we count it as a tie.'));

/* L15 fig: overall score hides a weak slice */
function l15SliceFig(){
  var R=[['overall: 85.4%',0.854,'ac'],['easy slice (70% of data): 92%',0.92,'ok'],['hard slice (30% of data): 70%',0.70,'no']],s='',i,y;
  for(i=0;i<3;i++){
    y=14+i*46;
    s+=T(10,y+10,R[i][0],'tb','start','font-size:10.5px')+RECT(10,y+16,340,14,'var(--sf)','var(--ln)',4,1.2)+RECT(10,y+16,Math.round(340*R[i][1]),14,'var(--'+R[i][2]+')','none',4,1);
  }
  s+=T(180,168,'0.7 x 92 + 0.3 x 70 = 85.4','tm','middle','font-size:10.5px');
  s+=T(180,186,'one number hides where the model is weak','tb','middle','font-size:10.5px;fill:var(--no)');
  return s;
}

var FIG_L15_SLICE=fig(198,l15SliceFig(),
  B('الإجمالي 85.4% بيخبّي إن الجزء الصعب (30% من الأسئلة) دقته 70% بس. التقييم لازم يتقسّم على slices.',
    'The overall 85.4% hides that the hard part (30% of the questions) is only 70% accurate. Evaluation should be split into slices.'));

/* L15 fig: a group gap and its 95% range */
function l15FairFig(){
  function X(v){return 40+(v+10)/40*300;}
  var s='',v;
  s+=T(10,22,'group A: 90%','tb','start','font-size:10.5px')+RECT(10,28,340,14,'var(--sf)','var(--ln)',4,1.2)+RECT(10,28,Math.round(340*0.90),14,'var(--ok)','none',4,1);
  s+=T(10,64,'group B: 78%','tb','start','font-size:10.5px')+RECT(10,70,340,14,'var(--sf)','var(--ln)',4,1.2)+RECT(10,70,Math.round(340*0.78),14,'var(--no)','none',4,1);
  s+='<line x1="'+X(0)+'" y1="100" x2="'+X(0)+'" y2="146" style="stroke:var(--mu);stroke-width:1.4;stroke-dasharray:4 4"/>';
  s+='<line x1="'+X(2)+'" y1="124" x2="'+X(22)+'" y2="124" style="stroke:var(--ac);stroke-width:2.4"/>';
  s+='<line x1="'+X(2)+'" y1="118" x2="'+X(2)+'" y2="130" style="stroke:var(--ac);stroke-width:2.4"/>';
  s+='<line x1="'+X(22)+'" y1="118" x2="'+X(22)+'" y2="130" style="stroke:var(--ac);stroke-width:2.4"/>';
  s+=DOT(X(12),124,'ac',5)+T(X(12),112,'gap 12 +- 10','tb','middle','font-size:10.5px');
  s+='<line x1="40" y1="146" x2="340" y2="146" style="stroke:var(--mu);stroke-width:1.4"/>';
  for(v=-10;v<=30;v+=10){s+='<line x1="'+X(v)+'" y1="146" x2="'+X(v)+'" y2="151" style="stroke:var(--mu);stroke-width:1.4"/>'+T(X(v),163,''+v,'tm','middle','font-size:10px');}
  s+=T(180,184,'zero is outside the range: the gap is probably real','tb','middle','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_L15_FAIR=fig(194,l15FairFig(),
  B('نفس الموديل دقته 90% لمجموعة A و78% لمجموعة B (100 مثال لكل مجموعة). الفرق 12 نقطة، ومداه (95%) حوالي ±10 ومش بيشمل الصفر.',
    'The same model scores 90% for group A and 78% for group B (100 examples each). The gap is 12 points, and its 95% range (about ±10) does not include zero.'));

/* L15 fig: evaluation harness pipeline */
var FIG_L15_HARNESS=fig(110,
  RECT(13,30,64,38,'var(--sf)','var(--ln)',8)+T(45,53,'Prompt','tb','middle')+
  AR(77,49,103,49,'ac','mA')+
  RECT(103,30,64,38,'var(--sf)','var(--ln)',8)+T(135,53,'Generate','tb','middle')+
  AR(167,49,193,49,'ac','mA')+
  RECT(193,30,64,38,'var(--ac)','none',8)+T(225,53,'Parse','tb','middle','fill:var(--bg)')+
  AR(257,49,283,49,'ac','mA')+
  RECT(283,30,64,38,'var(--sf)','var(--ln)',8)+T(315,53,'Score','tb','middle')+
  T(225,92,'unparsed = wrong','tm','middle','font-size:10.5px'),
  B(`الـ harness أربع خطوات، وأي رد الـ parser مش قادر يقراه بيتحسب غلط ومش بيتحذف.`,
    `The harness has four steps, and any output the parser cannot read counts as wrong rather than being dropped.`));

/* L15 fig: dual-use */
var FIG_L15_DUAL=fig(130,
  RECT(10,47,96,36,'var(--sf)','var(--ln)',8)+T(58,70,'Capability','tb','middle')+
  AR(106,58,236,30,'ok','mG')+
  AR(106,72,236,100,'no','mN')+
  RECT(236,12,114,36,'var(--sf)','var(--ok)',8)+T(293,35,'Helpful use','tb','middle')+
  RECT(236,82,114,36,'var(--sf)','var(--no)',8)+T(293,105,'Harmful use','tb','middle')+
  T(150,104,'safeguards','tm','middle','font-size:10.5px'),
  B(`نفس القدرة ممكن تخدم استخدام نافع أو ضار، والـ safeguards بتحاول تقلّل الضار من غير ما تضر النافع.`,
    `The same capability can serve a helpful or a harmful use, and safeguards try to cut the harmful one without hurting the helpful one.`));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:15,t:B("Evaluation و Benchmarks","Evaluation & Benchmarks"),cards:[

{id:"l15-whyhard",t:B("ليه التقييم صعب وإيه أنواعه","Why evaluation is hard and what kinds exist"),
 b:cat(
       B('<p>في التصنيف التقليدي الإجابة الصح واحدة والدقة بتتحسب بسهولة. في الـ LLMs الإجابة <mark>نص حر</mark>، وممكن يبقى في كذا إجابة صح بصياغات مختلفة، فالتقييم نفسه بقى مشكلة. وفي <mark>قانون Goodhart</mark>: لما مقياس يبقى هو الهدف، بيبطّل يكون مقياس كويس (شفنا ده في reward hacking). عشان كده مفيش مقياس واحد يكفي.</p>',
         '<p>In classic classification there is one correct answer and accuracy is easy to compute. With LLMs the answer is <mark>free text</mark>, and several correct answers with different wording can exist, so evaluation itself became a problem. And there is <mark>Goodhart\'s law</mark>: when a measure becomes the target, it stops being a good measure (we saw this in reward hacking). That is why no single metric is enough.</p>'),
       FIG_L15_SPEC,
       B('<p>أنواع أساسية:<br>• <mark>Multiple choice</mark> (زي MMLU): رخيص وآلي والإجابة معروفة، بس بعيد عن الاستخدام الحقيقي لأن المستخدم مش بيختار A أو B.<br>• <mark>Execution-based</mark> (unit tests للكود): موضوعي، بس للمهام اللي ليها verifier.<br>• <mark>LLM-as-judge</mark>: موديل قوي بيقيّم إجابات مفتوحة. قابل للتوسّع، بس ليه biases.<br>• <mark>Human preference</mark> (زي Chatbot Arena): أقرب للواقع، وأغلى وأبطأ.</p>'+
         '<p>وفي تمييز تاني مهم: <mark>intrinsic evaluation</mark> يقيس جودة الموديل نفسه من غير مهمة محددة (زي الـ perplexity اللي شفناه مع الـ language models)، مقابل <mark>extrinsic evaluation</mark> يقيس الأداء على مهمة فعلية. الـ perplexity مفيد أثناء الـ pretraining، بس مش بيقولك لو الموديل هيفيد مستخدم فعلًا.</p>'+
         '<p>السؤال الأول في أي تقييم: <mark>إيه القرار اللي هناخده بالنتيجة؟</mark> (ننشر الموديل؟ نختار بين اتنين؟ نكتشف ضعف؟). القرار هو اللي بيحدد المقياس، مش العكس.</p>',
         '<p>The main kinds:<br>• <mark>Multiple choice</mark> (such as MMLU): cheap, automatic, with a known answer, but far from real use because a user does not pick A or B.<br>• <mark>Execution-based</mark> (unit tests for code): objective, but only for tasks that have a verifier.<br>• <mark>LLM-as-judge</mark>: a strong model grades open answers. Scalable, but it has biases.<br>• <mark>Human preference</mark> (such as Chatbot Arena): closest to reality, and costlier and slower.</p>'+
         '<p>Another important distinction: <mark>intrinsic evaluation</mark> measures the quality of the model itself with no specific task (like the perplexity we saw with language models), versus <mark>extrinsic evaluation</mark>, which measures performance on an actual task. Perplexity is useful during pretraining, but it does not tell you whether the model will actually help a user.</p>'+
         '<p>The first question in any evaluation: <mark>what decision will we make with the result?</mark> (Ship the model? Choose between two? Find a weakness?) The decision determines the metric, not the other way around.</p>')),
 q:[
   CQ("إيه أكبر عيب لـ multiple choice كمقياس وحيد لموديل شات؟","What is the biggest weakness of multiple choice as the only metric for a chat model?",
      [["غالي جدًا","Very expensive"],["بعيد عن الاستخدام الحقيقي، لأن الموديل في الواقع بيكتب نص حر","Far from real use, because in practice the model writes free text"],["مش آلي ومحتاج مراجعين","Not automatic and needs reviewers"],["مش بيدّي أرقام","It gives no numbers"]],
      1,"الـ multiple choice رخيص وآلي، بس مش بيقيس جودة الكتابة أو اتباع التعليمات أو الحوار.","Multiple choice is cheap and automatic, but it does not measure writing quality, instruction following or conversation."),
   CQ("الـ perplexity بتاع موديل نزل من 12 لـ 10 أثناء الـ pretraining. إيه اللي نقدر نستنتجه؟","A model's perplexity dropped from 12 to 10 during pretraining. What can we conclude?",
   [["الموديل بقى أحسن في توقّع النص، بس ده لوحده مش بيثبت إنه هيفيد المستخدم فعلًا","The model got better at predicting text, but that alone does not prove it will help users"],["الموديل أكيد بقى أحسن في كل المهام","The model is certainly better on every task"],["الـ extrinsic evaluation بقى مش لازم","Extrinsic evaluation is no longer needed"],["الـ benchmark اتلوّث","The benchmark got contaminated"]],
   0,"الـ perplexity مقياس intrinsic مفيد أثناء الـ pretraining، بس الأداء على مهمة فعلية بيتقاس بـ extrinsic evaluation.","Perplexity is an intrinsic metric that is useful during pretraining, but performance on an actual task is measured with extrinsic evaluation.")],
 f:[
   CF("إيه الفرق بين intrinsic و extrinsic evaluation؟","What is the difference between intrinsic and extrinsic evaluation?",
      "الـ intrinsic بيقيس الموديل نفسه من غير مهمة (زي الـ perplexity)، والـ extrinsic بيقيس الأداء على مهمة فعلية. والقرار اللي هنتخده بالنتيجة هو اللي بيحدد المقياس.","Intrinsic measures the model itself with no task (like perplexity), and extrinsic measures performance on an actual task. The decision we will make with the result determines the metric."),
   CF("إيه هو قانون Goodhart؟","What is Goodhart's law?",
   "لما مقياس يبقى هو الهدف، بيبطّل يكون مقياس كويس. عشان كده مفيش مقياس واحد يكفي.","When a measure becomes the target, it stops being a good measure. That is why no single metric is enough.")],
 terms:[
   {t:B("Goodhart's law","Goodhart's law"),
 d:B("لما مقياس يتحوّل لهدف بيبطّل يكون مقياس كويس.","When a measure becomes a target it stops being a good measure.")},
   {t:B("Intrinsic evaluation","Intrinsic evaluation"),
 d:B("تقييم الـ vectors نفسها (analogies، similarity) من غير مهمة نهائية.","Evaluating the vectors themselves (analogies, similarity) without a downstream task.")},
   {t:B("Extrinsic evaluation","Extrinsic evaluation"),
 d:B("تقييم الـ vectors من خلال أداء مهمة حقيقية زي NER.","Evaluating the vectors through performance on a real task such as NER.")},
   {t:B("Execution-based evaluation","Execution-based evaluation"),
 d:B("تقييم بتشغيل الناتج (زي unit tests للكود) بدل مقارنته بنص.","Evaluation by running the output (such as unit tests for code) instead of comparing it with text.")}]},

{id:"l15-mc",t:B("Multiple choice وعدم اليقين الإحصائي","Multiple choice and statistical uncertainty"),
 b:cat(
       B('<p><mark>MMLU</mark> بنك أسئلة اختيار من متعدد (حوالي 14,000 سؤال في 57 مجال)، كل سؤال فيه 4 اختيارات، فالتخمين العشوائي بيدّي 25%. المقياس هو الـ accuracy. المشكلة الأولى: الرقم ده <mark>مش دقيق بالكامل</mark> لأنه محسوب من عينة. الخطأ المعياري:</p>'+
         '<div class="m">SE = sqrt( p (1 - p) / n )\n\np = 0.80, n = 1000 : SE = sqrt(0.16 / 1000) = 0.0126\n95% interval = 1.96 * SE = +-2.5 points\n\np = 0.80, n = 100  : SE = 0.04 -> +-7.8 points</div>',
         '<p><mark>MMLU</mark> is a bank of multiple-choice questions (about 14,000 questions across 57 subjects), each with 4 options, so random guessing gives 25%. The metric is accuracy. The first problem: this number is <mark>not fully precise</mark> because it is computed from a sample. The standard error:</p>'+
         '<div class="m">SE = sqrt( p (1 - p) / n )\n\np = 0.80, n = 1000 : SE = sqrt(0.16 / 1000) = 0.0126\n95% interval = 1.96 * SE = +-2.5 points\n\np = 0.80, n = 100  : SE = 0.04 -> +-7.8 points</div>'),
       FIG_L15_CI,
       B('<p>يعني موديل A بـ 80.0% وموديل B بـ 81.0% على 1000 سؤال: الفرق نقطة واحدة وهامش الخطأ ±2.5 لكل واحد، فالفرق ده <mark>ممكن يكون ضجيج</mark>. (لو الاتنين اتقاسوا على نفس الأسئلة بنستخدم اختبار paired وبيبقى أحسّ شوية، بس المبدأ ثابت: الفروق الصغيرة محتاجة error bars.) وكل ما الأسئلة قلّت، الهامش كبر.</p>',
         '<p>So model A at 80.0% and model B at 81.0% on 1000 questions: a 1-point gap and a margin of ±2.5 for each, so this gap <mark>may be noise</mark>. (If both are measured on the same questions we use a paired test, which is a bit more sensitive, but the principle holds: small differences need error bars.) And the fewer the questions, the bigger the margin.</p>')),
 q:[
   CQ("موديل على 400 سؤال بـ accuracy = 0.5. إيه الخطأ المعياري SE تقريبًا؟","A model on 400 questions with accuracy = 0.5. What is the standard error SE, roughly?",
      [["0.0025","0.0025"],["0.25","0.25"],["0.05","0.05"],["0.025","0.025"]],
      3,"SE = sqrt(0.5 × 0.5 / 400) = sqrt(0.000625) = 0.025، يعني حوالي ±4.9 نقطة عند 95%.","SE = sqrt(0.5 × 0.5 / 400) = sqrt(0.000625) = 0.025, so about ±4.9 points at 95%."),
   CQ("موديل A بـ 80.0% وموديل B بـ 81.0% على نفس الـ 1000 سؤال، وهامش الخطأ ±2.5 لكل واحد. أنسب استنتاج؟","Model A scores 80.0% and model B 81.0% on the same 1000 questions, each with a ±2.5 margin. What is the best conclusion?",
   [["B أحسن بالتأكيد","B is definitely better"],["الفرق ممكن يكون ضجيج، ومحتاجين بيانات أكتر أو اختبار paired","The gap may be noise, and we need more data or a paired test"],["A أحسن لأن رقمه أقل","A is better because its number is lower"],["الـ benchmark غلط","The benchmark is wrong"]],
   1,"فرق نقطة واحدة أصغر بكتير من هامش الخطأ، فمش دليل.","A 1-point gap is much smaller than the margin of error, so it is not evidence.")],
 f:[
   CF("ليه فرق نقطة واحدة بين موديلين على benchmark مش دليل؟","Why is a 1-point gap between two models on a benchmark not evidence?",
      "لأن الدقة محسوبة من عينة، وهامش الخطأ (95%) على 1000 سؤال حوالي ±2.5 نقطة. SE = sqrt(p(1-p)/n). فالفروق الصغيرة ممكن تكون ضجيج، ولازم error bars وإعداد تقييم ثابت.","Because accuracy is computed from a sample, and the 95% margin on 1000 questions is about ±2.5 points. SE = sqrt(p(1-p)/n). So small gaps may be noise, and we need error bars and a fixed evaluation setup."),
   CF("إيه هو MMLU؟","What is MMLU?",
   "بنك أسئلة اختيار من متعدد (حوالي 14,000 سؤال في 57 مجال) بـ 4 اختيارات، فالتخمين العشوائي بيدّي 25%.","A bank of multiple-choice questions (about 14,000 across 57 subjects) with 4 options, so random guessing gives 25%.")],
 terms:[
   {t:B("MMLU","MMLU"),
 d:B("بنك أسئلة اختيار من متعدد (حوالي 14,000 سؤال في 57 مجال).","A multiple-choice question bank (about 14,000 questions across 57 subjects).")},
   {t:B("Standard error (SE)","Standard error (SE)"),
 d:B("هامش عدم اليقين في الـ accuracy المحسوبة من عينة: <code>sqrt(p(1-p)/n)</code>.","The uncertainty of an accuracy computed from a sample: <code>sqrt(p(1-p)/n)</code>.")}]},

{id:"l15-mc-pitfalls",t:B("مشاكل الـ multiple choice وإعداد تقييم صح","Multiple-choice pitfalls and a sound setup"),
 b:cat(
       B('<p>مشاكل تانية:<br>• <mark>حساسية لصيغة الـ prompt</mark>: ترتيب الاختيارات، شكل الـ template، 0-shot مقابل 5-shot. فنتيجتك ممكن تختلف عن رقم الـ leaderboard.<br>• <mark>أسئلة غلط أو غامضة</mark> في الداتا نفسها.<br>• الـ accuracy الإجمالي <mark>بيخبّي نوع الأخطاء</mark>.</p>'+
         '<p>القاعدة: اكتب إعداد التقييم بالتفصيل (الـ prompt وعدد الأمثلة وطريقة استخراج الإجابة)، واعرض الـ error bars، وقارن الموديلات بنفس الإعداد بالظبط. وإجابات الـ multiple choice بتتحسب إما من اختيار الحرف اللي الموديل ولّده، أو من أعلى log-probability بين الاختيارات، والطريقتين ممكن تدّي أرقام مختلفة.</p>',
         '<p>Other problems:<br>• <mark>Sensitivity to prompt format</mark>: the order of options, the template shape, 0-shot versus 5-shot. So your result may differ from the leaderboard number.<br>• <mark>Wrong or ambiguous questions</mark> in the data itself.<br>• Overall accuracy <mark>hides the kind of errors</mark>.</p>'+
         '<p>The rule: write down the evaluation setup in detail (the prompt, the number of examples, how the answer is extracted), show error bars, and compare models under exactly the same setup. Also, multiple-choice answers are scored either from the letter the model generates or from the highest log-probability among the options, and the two methods can give different numbers.</p>'),
       B('<p>مثال توضيحي: نفس الموديل ممكن ياخد 71% بـ 0-shot و75% بـ 5-shot. الفرق 4 نقط، أكبر من ضجيج ±2.5 اللي فات، فبنقارن بنفس الإعداد بس.</p>',
  '<p>An illustrative example: the same model may get 71% with 0-shot and 75% with 5-shot. That 4-point gap is larger than the ±2.5 noise above, so we compare only under the same setup.</p>')),
 q:[
   CQ("إزاي بنحسب إجابة multiple choice من الـ log-probability؟","How is a multiple-choice answer scored from log-probability?",
   [["بناخد الاختيار اللي ليه أعلى log-probability من الموديل","We take the option with the highest log-probability under the model"],["بناخد أطول اختيار","We take the longest option"],["بنختار عشوائيًا","We pick at random"],["بنسأل بشر","We ask humans"]],
   0,"البديل إننا نخلّي الموديل يولّد الحرف ونقرأه، والطريقتين ممكن تدّي أرقام مختلفة.","The alternative is to let the model generate the letter and read it, and the two methods can give different numbers."),
   CQ("نفس الموديل ياخد 71% بـ 0-shot و75% بـ 5-shot. ده بيوضّح إيه؟","The same model gets 71% with 0-shot and 75% with 5-shot. What does this show?",
   [["الـ benchmark ملوّث","The benchmark is contaminated"],["النتيجة بتعتمد على إعداد التقييم، فلازم نقارن بنفس الإعداد","The result depends on the evaluation setup, so we must compare under the same setup"],["الموديل بيتعلّم أثناء الاختبار","The model learns during the test"],["الـ SE غلط","The SE is wrong"]],
   1,"الـ prompt وعدد الأمثلة بيأثروا على الرقم، فمقارنة موديلين بإعدادين مختلفين مش عادلة.","The prompt and the number of examples affect the number, so comparing two models under different setups is not fair.")],
 f:[
   CF("إيه اللي لازم يتكتب مع أي رقم benchmark؟","What must be reported with any benchmark number?",
   "إعداد التقييم بالتفصيل (الـ prompt وعدد الأمثلة وطريقة استخراج الإجابة) وerror bars، وبنقارن الموديلات بنفس الإعداد بالظبط.","The evaluation setup in detail (the prompt, the number of examples, how the answer is extracted) and error bars, and we compare models under exactly the same setup."),
   CF("إيه الفرق بين scoring بالحرف المولَّد وبالـ log-probability؟","What is the difference between scoring by the generated letter and by log-probability?",
   "الأولى بنقرا الحرف اللي الموديل ولّده، والتانية بناخد الاختيار الأعلى log-probability. والطريقتين ممكن تدّي أرقام مختلفة.","The first reads the letter the model generates, and the second takes the option with the highest log-probability. The two can give different numbers.")],
 terms:[
   {t:B("Prompt sensitivity","Prompt sensitivity"),
 d:B("تغيّر النتيجة مع صيغة الـ prompt وترتيب الاختيارات وعدد الأمثلة.","Results change with the prompt wording, the order of options and the number of examples.")},
   {t:B("Log-probability scoring","Log-probability scoring"),
 d:B("اختيار الإجابة اللي ليها أعلى log-probability بدل ما الموديل يولّد حرف.","Choosing the answer with the highest log-probability instead of letting the model generate a letter.")}]},

{id:"l15-passk",t:B("تقييم الكود: pass@k","Evaluating code: pass@k"),
 b:cat(
       B('<p>الكود ليه ميزة: <mark>نشغّله ونشوف</mark>. في <mark>HumanEval</mark> (164 مسألة، كل واحدة دالة من وصف + unit tests) بنولّد n حل، ونعد c اللي عدّوا كل الـ tests. مقياس <mark>pass@k</mark> هو احتمال إن <mark>على الأقل واحد</mark> من k حل بنسحبهم عشوائيًا من الـ n يكون صح. التقدير غير المنحاز:</p>'+
         '<div class="m">pass@k = 1 - C(n-c, k) / C(n, k)</div>',
         '<p>Code has an advantage: we <mark>run it and see</mark>. In <mark>HumanEval</mark> (164 problems, each a function from a description plus unit tests) we generate n solutions and count the c that pass all the tests. The <mark>pass@k</mark> metric is the probability that <mark>at least one</mark> of k solutions drawn at random from the n is correct. The unbiased estimator:</p>'+
         '<div class="m">pass@k = 1 - C(n-c, k) / C(n, k)</div>'),
       FIG_L15_PASS,
       B('<p>مثال: <code>n = 10</code> و <code>c = 3</code>:</p>'+
         '<div class="m">k = 1: 1 - C(7,1)/C(10,1) = 1 - 7/10   = 0.30\nk = 5: 1 - C(7,5)/C(10,5) = 1 - 21/252 = 0.92</div>'+
         '<p>الـ <mark>pass@1</mark> هو متوسط نجاح محاولة واحدة (بيحاكي إن المستخدم بياخد أول رد)، والـ pass@k الأعلى بيحاكي وجود طريقة اختيار (tests أو مراجعة). بنحسب المتوسط على كل المسائل. ولما k = 1 المعادلة بتبسّط لـ <code>c / n</code>. ليه n أكبر من k؟ لأن تقدير pass@k من k عينات بس بيتذبذب كتير، والـ n الأكبر بيدّي تقدير أثبت.</p>',
         '<p>An example: <code>n = 10</code> and <code>c = 3</code>:</p>'+
         '<div class="m">k = 1: 1 - C(7,1)/C(10,1) = 1 - 7/10   = 0.30\nk = 5: 1 - C(7,5)/C(10,5) = 1 - 21/252 = 0.92</div>'+
         '<p><mark>pass@1</mark> is the average success of a single attempt (it mimics a user taking the first reply), and the higher pass@k mimics having a selection method (tests or review). We average over all problems. And when k = 1 the formula simplifies to <code>c / n</code>. Why is n larger than k? Because estimating pass@k from just k samples fluctuates a lot, and a larger n gives a steadier estimate.</p>')),
 q:[
   CQ("n = 4 حل اتولّدوا وc = 1 عدّى الـ tests. إيه pass@1؟","n = 4 solutions were generated and c = 1 passed the tests. What is pass@1?",
      [["0.25","0.25"],["0.50","0.50"],["0.75","0.75"],["1.00","1.00"]],
      0,"pass@1 = 1 - C(3,1)/C(4,1) = 1 - 3/4 = 0.25، وهي نفسها c / n.","pass@1 = 1 - C(3,1)/C(4,1) = 1 - 3/4 = 0.25, which is simply c / n."),
   CQ("n = 5 حل وc = 2 عدّوا الـ tests. إيه pass@2؟","n = 5 solutions and c = 2 pass the tests. What is pass@2?",
   [["0.40","0.40"],["0.60","0.60"],["0.70","0.70"],["0.90","0.90"]],
   2,"pass@2 = 1 - C(3,2)/C(5,2) = 1 - 3/10 = 0.70. لاحظ إنها أعلى من c / n = 0.40.","pass@2 = 1 - C(3,2)/C(5,2) = 1 - 3/10 = 0.70. Note that it is higher than c / n = 0.40.")],
 f:[
   CF("إيه هو pass@k وليه بنولّد n أكبر من k؟","What is pass@k and why do we generate n larger than k?",
      "احتمال إن على الأقل واحد من k حل صح، والتقدير غير المنحاز 1 - C(n-c,k)/C(n,k). بنولّد n أكبر من k عشان التقدير يبقى أثبت من عينة k بس.","The probability that at least one of k solutions is correct, with the unbiased estimator 1 - C(n-c,k)/C(n,k). We generate n larger than k so the estimate is steadier than one from just k samples."),
   CF("إيه هو HumanEval؟","What is HumanEval?",
   "164 مسألة، كل واحدة دالة من وصف مع unit tests. بنولّد n حل ونعد c اللي عدّوا.","164 problems, each a function from a description plus unit tests. We generate n solutions and count the c that pass.")],
 terms:[
   {t:B("pass@k","pass@k"),
 d:B("احتمال إن على الأقل واحد من k حل صح: <code>1 - C(n-c,k)/C(n,k)</code>.","The probability that at least one of k solutions is correct: <code>1 - C(n-c,k)/C(n,k)</code>.")},
   {t:B("HumanEval","HumanEval"),
 d:B("benchmark من 164 مسألة كود، كل واحدة بوصف وunit tests.","A benchmark of 164 coding problems, each with a description and unit tests.")}]},

{id:"l15-passk-limits",t:B("حدود pass@k وتشغيل الكود بأمان","Limits of pass@k and running code safely"),
 b:cat(
       B('<p>الحدود:<br>• الـ unit tests <mark>ناقصة</mark> أحيانًا، فحل غلط ممكن يعدّي (false pass).<br>• مسائل صغيرة زي HumanEval بعيدة عن شغل مهندس حقيقي على مشروع كبير. عشان كده في benchmarks أقرب للواقع زي <mark>SWE-bench</mark> (تعديل مشروع كامل لحل issue حقيقي، والنجاح بالـ tests).<br>• والمقياس بيتأثر بالـ <mark>contamination</mark> اللي هنشرحه في كارت جاي.</p>'+
         '<p>وتقييم الكود بيفتح سؤال أمان عملي: تشغيل كود ولّده موديل لازم يتم جوه <mark>sandbox</mark> معزول، لأن الكود ممكن يمسح ملفات أو يكلّم الشبكة.</p>',
         '<p>The limits:<br>• Unit tests are sometimes <mark>incomplete</mark>, so a wrong solution can pass (a false pass).<br>• Small problems like HumanEval are far from a real engineer\'s work on a large project. That is why there are benchmarks closer to reality such as <mark>SWE-bench</mark> (changing a whole project to resolve a real issue, with success judged by tests).<br>• The metric is affected by the <mark>contamination</mark> covered in a later card.</p>'+
         '<p>And code evaluation raises a practical safety question: running model-generated code must happen inside an isolated <mark>sandbox</mark>, because the code can delete files or talk to the network.</p>'),
       B('<p>غلطة شائعة: مقارنة pass@10 لموديل بـ pass@1 لموديل تاني. المقارنة العادلة بنفس الـ k ونفس الـ prompt.</p>',
  '<p>A common mistake: comparing the pass@10 of one model with the pass@1 of another. A fair comparison uses the same k and the same prompt.</p>')),
 q:[
   CQ("ليه حل غلط ممكن يعدّي كل الـ unit tests؟","Why can a wrong solution pass all the unit tests?",
   [["لأن الـ tests ممكن تبقى ناقصة ومتغطّيش كل الحالات","Because the tests may be incomplete and not cover every case"],["لأن الـ pass@k غلط رياضيًا","Because pass@k is mathematically wrong"],["لأن الكود بيتشغّل مرتين","Because the code is run twice"],["لأن الموديل بيشوف الـ tests","Because the model sees the tests"]],
   0,"ده الـ false pass، وبيخلّي النتيجة أعلى من الحقيقة.","This is a false pass, and it makes the score higher than the truth."),
   CQ("ليه بنشغّل الكود اللي الموديل ولّده جوه sandbox؟","Why do we run model-generated code inside a sandbox?",
   [["عشان يشتغل أسرع","So it runs faster"],["عشان الكود ممكن يمسح ملفات أو يكلّم الشبكة","Because the code may delete files or talk to the network"],["عشان نحسب pass@k","To compute pass@k"],["عشان نقلّل الـ contamination","To reduce contamination"]],
   1,"الـ sandbox بيعزل الكود غير الموثوق عن النظام الحقيقي.","The sandbox isolates untrusted code from the real system.")],
 f:[
   CF("إيه حدود الـ unit tests كمقياس لجودة الكود؟","What are the limits of unit tests as a measure of code quality?",
   "ممكن تبقى ناقصة فحل غلط يعدّي (false pass)، والمسائل الصغيرة بعيدة عن شغل حقيقي فبنستخدم SWE-bench، وبنشغّل الكود جوه sandbox.","They may be incomplete so a wrong solution passes (a false pass), small problems are far from real work so we use SWE-bench, and we run the code inside a sandbox."),
   CF(`ليه مقارنة pass@10 لموديل بـ pass@1 لموديل تاني مش عادلة؟`,`Why is it unfair to compare one model's pass@10 with another model's pass@1?`,
   `لأن pass@k بيزيد مع k، فلازم نفس الـ k ونفس الـ prompt.`,`Because pass@k grows with k, so we need the same k and the same prompt.`)],
 terms:[
   {t:B("SWE-bench","SWE-bench"),
 d:B("benchmark بيدّي الـ agent issue حقيقي من مشروع مفتوح المصدر، والنجاح إن الـ tests تعدّي بعد التعديل.","A benchmark that gives the agent a real issue from an open-source project; success means the tests pass after the change.")},
   {t:B("Sandbox","Sandbox"),
 d:B("بيئة معزولة بينفّذ فيها الـ agent الأكواد والأفعال، فلو حصلت غلطة مبتأثّرش على باقي النظام.","An isolated environment where the agent runs code and actions, so a mistake cannot affect the rest of the system.")}]},

{id:"l15-code-evalharness",
 t:B(`harness تقييم بسيط: من الـ prompt لحد الـ accuracy و pass@k`,`A minimal evaluation harness: from prompt to accuracy and pass@k`),
 b:cat(
   B(`<p>الـ <mark>evaluation harness</mark> حلقة صغيرة: نبني الـ <mark>prompt</mark>، ونعمل <mark>generate</mark> للرد، ونعمل <mark>parse</mark> للإجابة من النص، ونحسب <mark>الدرجة</mark>. الرد اللي الـ parser مش قادر يقراه بيتحسب غلط. لو حذفناه الـ accuracy هتبان أعلى من الحقيقة.</p>`,
     `<p>An <mark>evaluation harness</mark> is a small loop: build the <mark>prompt</mark>, <mark>generate</mark> the output, <mark>parse</mark> the answer out of the text, and <mark>score</mark> it. An output the parser cannot read counts as wrong. If we drop it, accuracy looks higher than it is.</p>`),
   FIG_L15_HARNESS,
   B(`<div class="m">import math, re

PAT = re.compile(r"Answer:\\s*([ABCD])")

# data: list of {"q": str, "gold": str}
# generate: str -&gt; str (model output)
def run(data, generate):
    ok = []
    for ex in data:
        prompt = ex["q"] + " Answer:"
        out = generate(prompt)
        m = PAT.search(out)
        pred = m.group(1) if m else None
        ok.append(pred == ex["gold"])
    n = len(ok)
    p = sum(ok) / n
    se = math.sqrt(p * (1 - p) / n)
    return p, se, 1.96 * se

# n samples, c correct, k drawn
# unbiased: 1 - C(n-c,k) / C(n,k)
def pass_at_k(n, c, k):
    bad = math.comb(n - c, k)
    return 1 - bad / math.comb(n, k)</div>`,`<div class="m">import math, re

PAT = re.compile(r"Answer:\\s*([ABCD])")

# data: list of {"q": str, "gold": str}
# generate: str -&gt; str (model output)
def run(data, generate):
    ok = []
    for ex in data:
        prompt = ex["q"] + " Answer:"
        out = generate(prompt)
        m = PAT.search(out)
        pred = m.group(1) if m else None
        ok.append(pred == ex["gold"])
    n = len(ok)
    p = sum(ok) / n
    se = math.sqrt(p * (1 - p) / n)
    return p, se, 1.96 * se

# n samples, c correct, k drawn
# unbiased: 1 - C(n-c,k) / C(n,k)
def pass_at_k(n, c, k):
    bad = math.comb(n - c, k)
    return 1 - bad / math.comb(n, k)</div>`),
   B(`<p>مثال: موديل تجريبي صح في 172 من 200 سؤال: <code>p = 0.860</code> و<code>SE = 0.0245</code> وهامش الخطأ ±4.8 نقطة. وللكود بنولّد n = 20 حل للمسألة: لو c = 4 يبقى <code>pass@1 = 0.200</code> و<code>pass@5 = 0.718</code>، ولو c = 0 الاتنين صفر، فمتوسط الـ pass@5 للمسألتين 0.359.</p><p>هامش الخطأ على pass@k بييجي من التشتت بين المسائل، لأن عينات المسألة الواحدة مترابطة. غلطة شائعة: نستخدم prompt أو parser مختلف لكل موديل. وفي Assignment 4، أي مرة هتعرض رقم تقييم لموديل أو نظام: ثبّت الـ prompt، واختبر الـ parser على كام ناتج، واكتب هامش خطأ جنب الرقم.</p>`,
     `<p>Example: a fake model is right on 172 of 200 questions: <code>p = 0.860</code>, <code>SE = 0.0245</code>, and the margin is ±4.8 points. For code we draw n = 20 solutions per problem: with c = 4, <code>pass@1 = 0.200</code> and <code>pass@5 = 0.718</code>; with c = 0 both are zero, so the mean pass@5 over the two problems is 0.359.</p><p>The margin on pass@k comes from the spread across problems, because samples of one problem are correlated. A common mistake: using a different prompt or parser for each model. In Assignment 4, any time you report an evaluation number for a model or system, fix the prompt, test the parser on a few outputs, and print a margin next to the number.</p>`)),
 q:[
   CQ(`ليه الرد اللي الـ parser مش قادر يقراه بيتحسب غلط ومش بيتحذف؟`,`Why is an output the parser cannot read counted as wrong instead of dropped?`,
      [[`لأن حذفه بيرفع الـ accuracy بشكل مضلّل، وهو في الحقيقة فشل في اتباع الصيغة`,`Because dropping it inflates accuracy, and it is really a failure to follow the format`],
       [`لأن الـ parser دايمًا غلط`,`Because the parser is always wrong`],
       [`لأن الحذف بيصغّر الـ SE`,`Because dropping shrinks the SE to zero`],
       [`مفيش فرق بين الاتنين`,`There is no difference between the two`]],
      0,`الرد اللي مش بصيغة الإجابة المطلوبة فشل حقيقي، فحذفه بيخفي الفشل ويرفع الرقم.`,`An output not in the required answer format is a real failure, so dropping it hides the failure and raises the number.`),
   CQ(`موديل صح في 172 من 200 سؤال. كام هامش الخطأ 95%؟`,`A model is right on 172 of 200 questions. What is the 95% margin?`,
      [[`±4.8 نقطة`,`±4.8 points`],[`±2.5 نقطة`,`±2.5 points`],[`±9.6 نقطة`,`±9.6 points`],[`±6.8 نقطة`,`±6.8 points`]],
      0,`SE = sqrt(p(1-p)/n) = 0.0245، وبنضربه في 1.96 فيطلع ±4.8 نقطة. 2.5 ده الـ SE من غير 1.96، و6.8 لو استخدمنا n غلط.`,`SE = sqrt(p(1-p)/n) = 0.0245, times 1.96 gives ±4.8 points. 2.5 is the SE without the 1.96, and 6.8 comes from using the wrong n.`)
 ],
 f:[
   CF(`إيه خطوات الـ evaluation harness؟`,`What are the steps of an evaluation harness?`,
      `نبني الـ prompt، ونعمل generate للرد، ونعمل parse للإجابة، ونحسب الدرجة مع هامش خطأ.`,`Build the prompt, generate the output, parse the answer, and score it with a margin of error.`),
   CF(`كام قيمة pass@k لما n - c أقل من k، وليه؟`,`What is pass@k when n - c is less than k, and why?`,
      `بيساوي 1، لأن C(n-c, k) = 0: أي k عينات لازم فيها حل صح.`,`It equals 1, because C(n-c, k) = 0: any k samples must contain a correct solution.`)
 ],
 terms:[
   {t:B(`Evaluation harness`,`Evaluation harness`),
    d:B(`كود بيدير حلقة التقييم: prompt، generate، parse، وحساب الدرجة.`,`Code that runs the evaluation loop: prompt, generate, parse, and score.`)},
   {t:B(`Output parser`,`Output parser`),
    d:B(`الجزء اللي بيطلّع الإجابة من نص الرد. اللي مش بيقراه بيتحسب غلط.`,`The part that extracts the answer from the output text. What it cannot read counts as wrong.`)}
 ]},

{id:"l15-elo",t:B("التفضيل البشري و Elo","Human preference and Elo"),
 b:cat(
       B('<p>في <mark>Chatbot Arena</mark> المستخدم بيسأل سؤال، بيشوف إجابتين من موديلين مجهولين جنب بعض، وبيصوّت للأحسن. من آلاف المقارنات دي بيطلع ترتيب. الفكرة الرياضية هي نموذج <mark>Elo</mark>: كل موديل ليه تقييم R، واحتمال إن A يكسب B:</p>'+
         '<div class="m">E_A = 1 / (1 + 10^((R_B - R_A) / 400))\n\nR_A(new) = R_A + K * (S_A - E_A)\n(S_A = 1 win, 0 loss, 0.5 tie)</div>',
         '<p>In <mark>Chatbot Arena</mark> a user asks a question, sees two answers from anonymous models side by side, and votes for the better one. From thousands of such comparisons a ranking emerges. The mathematical idea is the <mark>Elo</mark> model: each model has a rating R, and the probability that A beats B is:</p>'+
         '<div class="m">E_A = 1 / (1 + 10^((R_B - R_A) / 400))\n\nR_A(new) = R_A + K * (S_A - E_A)\n(S_A = 1 win, 0 loss, 0.5 tie)</div>'),
       FIG_L15_ELO,
       B('<p>مثال: <code>R_A = 1200</code> و <code>R_B = 1000</code>، الفرق 200: <code>E_A = 1 / (1 + 10^(-0.5)) = 1 / 1.316 = 0.76</code>. بـ <code>K = 32</code>:<br>• لو A كسب: <code>+32 × (1 - 0.76) = +7.7</code>. مكسب صغير لأنه متوقع.<br>• لو A خسر: <code>32 × (0 - 0.76) = -24.3</code>. خسارة كبيرة لأنها مفاجأة.</p>',
         '<p>An example: <code>R_A = 1200</code> and <code>R_B = 1000</code>, a gap of 200: <code>E_A = 1 / (1 + 10^(-0.5)) = 1 / 1.316 = 0.76</code>. With <code>K = 32</code>:<br>• If A wins: <code>+32 × (1 - 0.76) = +7.7</code>. A small gain because it was expected.<br>• If A loses: <code>32 × (0 - 0.76) = -24.3</code>. A big loss because it is a surprise.</p>')),
 q:[
   CQ("A = 1400 و B = 1000 (فرق 400). إيه احتمال إن A يكسب تقريبًا؟","A = 1400 and B = 1000 (a gap of 400). What is the chance that A wins, roughly?",
      [["0.50","0.50"],["0.75","0.75"],["0.91","0.91"],["0.99","0.99"]],
      2,"E_A = 1 / (1 + 10^(-1)) = 1 / 1.1 = 0.91.","E_A = 1 / (1 + 10^(-1)) = 1 / 1.1 = 0.91."),
   CQ("R_A = 1200 و R_B = 1000 و K = 32. لو A خسر، إيه تقييمه الجديد تقريبًا؟","R_A = 1200, R_B = 1000 and K = 32. If A loses, what is its new rating, roughly?",
   [["1176","1176"],["1224","1224"],["1168","1168"],["1200","1200"]],
   0,"E_A = 0.76، فالتغيير = 32 × (0 - 0.76) = -24.3، يعني 1200 - 24.3 ≈ 1176.","E_A = 0.76, so the change = 32 × (0 - 0.76) = -24.3, meaning 1200 - 24.3 ≈ 1176.")],
 f:[
   CF("إزاي Elo بيحسب احتمال الفوز وإيه عيوب التصويت البشري؟","How does Elo compute win probability and what are the weaknesses of human voting?",
      "E_A = 1 / (1 + 10^((R_B - R_A)/400))، والتقييم بيتحدّث بـ K × (S - E). العيوب: تحيّز للطول والتنسيق، وتوزيع المستخدمين، وإمكانية التلاعب، وهو ترتيب نسبي مش جودة مطلقة.","E_A = 1 / (1 + 10^((R_B - R_A)/400)), and the rating updates by K × (S - E). Weaknesses: bias toward length and formatting, the user population, possible gaming, and it is a relative ranking, not absolute quality."),
   CF("ليه A بياخد نقط قليلة لما يكسب وهو متوقّع يكسب؟","Why does A gain few points when it wins and was expected to win?",
   "لأن التحديث K × (S - E) والفرق بين النتيجة والمتوقع صغير. الخسارة المفاجئة بتدّي تغيير أكبر.","Because the update is K × (S - E) and the gap between the result and the expectation is small. A surprising loss gives a bigger change.")],
 terms:[
   {t:B("Elo rating","Elo rating"),
 d:B("تقييم لكل موديل، وفرق التقييم بيحدد احتمال الفوز: <code>1 / (1 + 10^((R_B - R_A)/400))</code>.","A rating per model, where the rating gap sets the win probability: <code>1 / (1 + 10^((R_B - R_A)/400))</code>.")},
   {t:B("Chatbot Arena","Chatbot Arena"),
 d:B("منصة بيصوّت فيها المستخدمين بين إجابتين من موديلين مجهولين.","A platform where users vote between two answers from anonymous models.")}]},

{id:"l15-elo-bias",t:B("Bradley-Terry وعيوب التصويت البشري","Bradley-Terry and the weaknesses of human voting"),
 b:cat(
       B('<p>عمليًا الترتيب الحديث بيتحسب بنموذج <mark>Bradley-Terry</mark> (نفس معادلة الاحتمال، بس بتتظبط على كل المقارنات مرة واحدة) مع confidence intervals. نقاط القوة: أسئلة حقيقية ومتنوعة، ومفيش إجابة مرجعية لازم حد يكتبها.</p>'+
         '<p>العيوب:<br>• <mark>Length bias</mark> والتنسيق: إجابة أطول ومنسّقة بالـ markdown بتكسب أكتر حتى لو مش أدق.<br>• <mark>توزيع المستخدمين</mark> مش بالضرورة بيمثّل الناس كلها، وكتير بيصوّتوا من غير ما يتحققوا من الحقائق.<br>• إمكانية <mark>التلاعب</mark> بالتصويت أو تحسين الموديل للمنصة نفسها.<br>• بعض المنصات بتضيف <mark>style control</mark>: تعديل إحصائي لتأثير الطول والتنسيق.</p>'+
         '<p>وأهم نقطة: الـ Elo بيدّي <mark>ترتيب نسبي</mark> بين موديلات اتقارنت، مش جودة مطلقة، ومش بيقولك لو موديل مناسب لمهمتك أنت.</p>',
         '<p>In practice modern rankings are computed with a <mark>Bradley-Terry</mark> model (the same probability formula, but fitted to all comparisons at once) with confidence intervals. Strengths: real, varied questions, and no reference answer that someone has to write.</p>'+
         '<p>Weaknesses:<br>• <mark>Length bias</mark> and formatting: a longer answer formatted with markdown wins more, even when it is not more accurate.<br>• The <mark>user population</mark> does not necessarily represent everyone, and many vote without checking facts.<br>• The possibility of <mark>gaming</mark> the votes or tuning a model to the platform itself.<br>• Some platforms add <mark>style control</mark>: a statistical adjustment for the effect of length and formatting.</p>'+
         '<p>And the most important point: Elo gives a <mark>relative ranking</mark> among the models that were compared, not absolute quality, and it does not tell you whether a model suits your task.</p>')),
 q:[
   CQ("إيه من عيوب التصويت البشري في منصة زي Chatbot Arena؟","Which is a weakness of human voting on a platform like Chatbot Arena?",
   [["الإجابة الأطول والمنسّقة بتكسب أكتر حتى لو مش أدق","A longer, well-formatted answer wins more even when it is not more accurate"],["مفيش أسئلة حقيقية","There are no real questions"],["محتاجة إجابة مرجعية لكل سؤال","It needs a reference answer for every question"],["مش بتنتج ترتيب","It does not produce a ranking"]],
   0,"ده الـ length والتنسيق bias، وبعض المنصات بتضيف style control لتعديله.","This is the length and formatting bias, and some platforms add style control to adjust for it."),
   CQ("موديل في أول ترتيب Arena. هل ده بيثبت إنه الأحسن لمهمة تحليل عقود قانونية عندك؟","A model tops the Arena ranking. Does that prove it is best for your legal-contract analysis task?",
   [["أيوه، الترتيب مطلق","Yes, the ranking is absolute"],["لأ، ده ترتيب نسبي على أسئلة عامة، ولازم نختبره على eval من بياناتنا","No, it is a relative ranking on general questions, and we must test it on an eval from our own data"],["أيوه لأن Elo بيقيس الدقة القانونية","Yes, because Elo measures legal accuracy"],["لأ لأن Elo غلط رياضيًا","No, because Elo is mathematically wrong"]],
   1,"الـ Elo بيقارن الموديلات ببعض ومش بيقيس الملاءمة لمهمتك.","Elo compares models with each other and does not measure fitness for your task.")],
 f:[
   CF("إيه الفرق بين Bradley-Terry و Elo المتتالي؟","What is the difference between Bradley-Terry and sequential Elo?",
   "نفس معادلة الاحتمال، بس Bradley-Terry بتتظبط على كل المقارنات مرة واحدة ومعاها confidence intervals.","The same probability formula, but Bradley-Terry is fitted to all comparisons at once, with confidence intervals."),
   CF("إيه هو style control؟","What is style control?",
   "تعديل إحصائي لتأثير الطول والتنسيق على التصويت.","A statistical adjustment for the effect of length and formatting on the votes.")],
 terms:[
   {t:B("Bradley-Terry model","Bradley-Terry model"),
 d:B("نموذج احتمالي للمقارنات: <code>P(A beats B) = sigmoid(r_A - r_B)</code>.","A probabilistic model of comparisons: <code>P(A beats B) = sigmoid(r_A - r_B)</code>.")},
   {t:B("Style control","Style control"),
 d:B("تعديل إحصائي لتأثير طول الإجابة وتنسيقها على التصويت.","A statistical adjustment for the effect of answer length and formatting on votes.")}]},

{id:"l15-judge",t:B("LLM-as-a-judge","LLM-as-a-judge"),
 b:cat(
       B('<p>تقييم الإجابات المفتوحة بالبشر غالي وبطيء. الحل الشائع: <mark>موديل قوي بيعمل دور الحكم</mark>. في شكلين: <mark>pairwise</mark> (أنهي إجابة أحسن، A ولا B؟) و<mark>pointwise بـ rubric</mark> (درجة من 1 لـ 5 حسب معايير مكتوبة). ميزته إنه رخيص وسريع وقابل للتوسّع، وفي دراسات أولية زي MT-Bench لوحظ اتفاق مع تفضيلات البشر حوالي 80% أو أكتر.</p>'+
         '<p>بس عنده <mark>biases</mark> معروفة:<br>• <mark>Position bias</mark>: بيفضّل الإجابة الأولى (أو التانية) بغض النظر عن الجودة.<br>• <mark>Verbosity bias</mark>: بيحب الإجابات الطويلة.<br>• <mark>Self-preference</mark>: بيميل لأسلوب موديل من نفس العائلة.<br>• ضعيف في الحكم على الحقائق الدقيقة والرياضيات لو ما اتدّاش إجابة مرجعية.</p>',
         '<p>Evaluating open answers with humans is expensive and slow. The common fix: a <mark>strong model acts as the judge</mark>. There are two forms: <mark>pairwise</mark> (which answer is better, A or B?) and <mark>pointwise with a rubric</mark> (a score from 1 to 5 by written criteria). Its advantage is that it is cheap, fast and scalable, and early studies such as MT-Bench observed agreement with human preferences of about 80% or more.</p>'+
         '<p>But it has known <mark>biases</mark>:<br>• <mark>Position bias</mark>: it prefers the first (or the second) answer regardless of quality.<br>• <mark>Verbosity bias</mark>: it likes long answers.<br>• <mark>Self-preference</mark>: it leans toward the style of a model from the same family.<br>• It is weak at judging precise facts and math when not given a reference answer.</p>'),
       FIG_L15_JUDGE),
 q:[
   CQ("ليه بنشغّل الحكم مرتين بترتيب الإجابتين المتبدّل؟","Why do we run the judge twice with the order of the two answers swapped?",
      [["عشان نوفّر فلوس","To save money"],["عشان نكشف الـ position bias ونقلّله","To detect and reduce position bias"],["عشان نطوّل الإجابات","To make the answers longer"],["عشان نغيّر الـ rubric","To change the rubric"]],
      1,"لو الفايز اتغيّر لما الترتيب اتغيّر، يبقى الحكم متأثر بالموضع مش بالجودة.","If the winner changes when the order changes, the judge is swayed by position, not quality."),
   CQ("الحكم بيفضّل دايمًا الإجابة الأطول حتى لما الاتنين صح بنفس القدر. ده أنهي bias؟","The judge always prefers the longer answer even when both are equally correct. Which bias is this?",
   [["Position bias","Position bias"],["Verbosity bias","Verbosity bias"],["Self-preference","Self-preference"],["Contamination","Contamination"]],
   1,"الـ verbosity bias هو ميل الحكم للإجابات الطويلة.","Verbosity bias is the judge's leaning toward long answers.")],
 f:[
   CF("إيه biases الـ LLM-as-judge وإزاي نخفّفها؟","What are the biases of LLM-as-judge and how do we mitigate them?",
      "position bias و verbosity bias و self-preference. بنخفّفها بتبديل الترتيب، rubric وإجابة مرجعية، تعليل قبل الحكم، وبنعايِر الحكم على عينة بشرية بـ Cohen's kappa.","Position bias, verbosity bias and self-preference. We mitigate them by swapping the order, a rubric and a reference answer, a justification before the verdict, and calibrating the judge on a human sample with Cohen's kappa."),
   CF("إيه الفرق بين pairwise و pointwise judging؟","What is the difference between pairwise and pointwise judging?",
   "Pairwise: أنهي إجابة أحسن، A ولا B؟ Pointwise: درجة من 1 لـ 5 حسب rubric مكتوب.","Pairwise: which answer is better, A or B? Pointwise: a score from 1 to 5 by a written rubric.")],
 terms:[
   {t:B("LLM-as-a-judge","LLM-as-a-judge"),
 d:B("موديل قوي بيقيّم إجابات مفتوحة، pairwise أو pointwise بـ rubric.","A strong model that grades open answers, pairwise or pointwise with a rubric.")},
   {t:B("Position bias","Position bias"),
 d:B("ميل الحكم لإجابة بسبب موضعها (الأولى أو التانية) مش جودتها.","The judge favoring an answer because of its position (first or second), not its quality.")},
   {t:B("Verbosity bias","Verbosity bias"),
 d:B("ميل الحكم للإجابات الطويلة.","The judge's tendency to prefer long answers.")},
   {t:B("Self-preference","Self-preference"),
 d:B("ميل الحكم لأسلوب موديل من نفس عائلته.","The judge's tendency to favor the style of a model from its own family.")}]},

{id:"l15-judge-kappa",t:B("تخفيف biases الحكم ومعايرته بـ kappa","Mitigating judge bias and calibrating with kappa"),
 b:cat(
       B('<p>التخفيف:<br>• <mark>بدّل الترتيب</mark> وشغّل الحكم مرتين، ولو الفايز اتغيّر اعتبرها تعادل (الرسم في الكارت اللي فات).<br>• اديه <mark>rubric</mark> واضح و<mark>إجابة مرجعية</mark> لو موجودة.<br>• اطلب <mark>تعليل قصير</mark> قبل الحكم النهائي.<br>• استخدم حكم من عائلة مختلفة عن الموديل اللي بتقيّمه لو أمكن.</p>'+
         '<p>والأهم: <mark>عايِر الحكم على عينة بشرية</mark> قبل ما تثق فيه. بنحسب الاتفاق مع البشر، بس الاتفاق الخام ممكن يضلّل لأن الصدفة لوحدها بتدّي اتفاق، فبنستخدم <mark>Cohen\'s kappa</mark>:</p>'+
         '<div class="m">kappa = (p_o - p_e) / (1 - p_e)\n\np_o = 0.85  (observed agreement)\np_e = 0.50  (agreement by chance)\nkappa = 0.35 / 0.50 = 0.70</div>'+
         '<p>الـ kappa = 1 اتفاق كامل، و0 يعني مفيش أحسن من الصدفة. بعدين الحكم المعايَر بيتستخدم على آلاف الأمثلة، والعينة البشرية الصغيرة بتفضل تتراجع دوريًا عشان نكتشف لو الحكم اتغيّر أو الداتا اتغيّرت. وللمهام اللي ليها إجابة قابلة للتحقق (رياضة، كود) استخدم verifier مباشر بدل الحكم.</p>',
         '<p>Mitigation:<br>• <mark>Swap the order</mark> and run the judge twice, and if the winner changes count it as a tie (the figure on the previous card).<br>• Give it a clear <mark>rubric</mark> and a <mark>reference answer</mark> when one exists.<br>• Ask for a <mark>short justification</mark> before the final verdict.<br>• Use a judge from a different family than the model being evaluated, if possible.</p>'+
         '<p>And most important: <mark>calibrate the judge on a human sample</mark> before trusting it. We compute agreement with humans, but raw agreement can mislead because chance alone produces some agreement, so we use <mark>Cohen\'s kappa</mark>:</p>'+
         '<div class="m">kappa = (p_o - p_e) / (1 - p_e)\n\np_o = 0.85  (observed agreement)\np_e = 0.50  (agreement by chance)\nkappa = 0.35 / 0.50 = 0.70</div>'+
         '<p>A kappa of 1 is perfect agreement, and 0 means no better than chance. Then the calibrated judge is used on thousands of examples, and a small human sample keeps being re-checked periodically to catch the judge or the data drifting. And for tasks with a verifiable answer (math, code) use a direct verifier instead of a judge.</p>')),
 q:[
   CQ("اتفاق الحكم مع البشر p_o = 0.90 واتفاق الصدفة p_e = 0.50. إيه الـ kappa؟","The judge's agreement with humans is p_o = 0.90 and chance agreement is p_e = 0.50. What is kappa?",
   [["0.40","0.40"],["0.80","0.80"],["0.90","0.90"],["0.50","0.50"]],
   1,"kappa = (0.90 - 0.50) / (1 - 0.50) = 0.40 / 0.50 = 0.80.","kappa = (0.90 - 0.50) / (1 - 0.50) = 0.40 / 0.50 = 0.80."),
   CQ("ليه مش بنكتفي بنسبة الاتفاق الخام بين الحكم والبشر؟","Why not rely only on the raw agreement between the judge and humans?",
   [["لأنها بتحتاج وقت أطول","Because it takes longer"],["لأن الصدفة لوحدها بتدّي اتفاق، فالرقم ممكن يضلّل","Because chance alone produces some agreement, so the number can mislead"],["لأنها دايمًا 100%","Because it is always 100%"],["لأنها بتعتمد على الـ rubric بس","Because it depends only on the rubric"]],
   1,"الـ kappa بيشيل الاتفاق اللي بيحصل بالصدفة.","Kappa removes the agreement that happens by chance.")],
 f:[
   CF("إيه هو Cohen's kappa وليه بنستخدمه؟","What is Cohen's kappa and why do we use it?",
   "kappa = (p_o - p_e) / (1 - p_e): الاتفاق بعد خصم اللي بيحصل بالصدفة. 1 اتفاق كامل و0 زي الصدفة.","kappa = (p_o - p_e) / (1 - p_e): agreement after removing what happens by chance. 1 is perfect agreement and 0 is no better than chance."),
   CF("إمتى نستخدم verifier مباشر بدل الحكم؟","When do we use a direct verifier instead of a judge?",
   "لما الإجابة قابلة للتحقق، زي الرياضة والكود.","When the answer is verifiable, such as math and code.")],
 terms:[
   {t:B("Cohen's kappa","Cohen's kappa"),
 d:B("اتفاق بين مقيّمين بعد خصم اتفاق الصدفة: <code>(p_o - p_e) / (1 - p_e)</code>.","Agreement between raters after removing chance agreement: <code>(p_o - p_e) / (1 - p_e)</code>.")},
   {t:B("Judge calibration","Judge calibration"),
 d:B("قياس اتفاق الحكم مع عينة بشرية قبل الوثوق فيه، وإعادة الفحص دوريًا.","Measuring the judge's agreement with a human sample before trusting it, and re-checking periodically.")}]},

{id:"l15-contamination",t:B("Contamination و saturation","Contamination and saturation"),
 b:cat(
       B('<p><mark>Contamination</mark>: لو أسئلة الـ benchmark كانت في بيانات الـ pretraining (والويب مليان نسخ منها)، الموديل ممكن <mark>يكون حفظها</mark> فدرجته بتبقى أعلى من قدرته الحقيقية.<br>• الكشف: تطابق n-gram بين الاختبار والـ training data، وفحص هل الموديل بيكمّل أسئلة الاختبار حرفيًا، ومقارنة الأداء على نسخة معدّلة (أرقام أو صياغة مختلفة).<br>• التقليل: <mark>test sets خاصة</mark> غير منشورة، و<mark>benchmarks حيّة</mark> بتتجدد بأسئلة بعد تاريخ معيّن (زي LiveCodeBench)، و<mark>canary strings</mark> في الداتا عشان تتفلتر من الـ training.</p>'+
         '<p>وفي <mark>saturation</mark>: لما الموديلات توصل لقرب 90% أو أكتر، المقياس بيبطّل يفرّق بينها، فبتظهر benchmarks أصعب (زي MMLU-Pro و GPQA و Humanity\'s Last Exam)، ومع الوقت هي كمان بتشبع.</p>',
         '<p><mark>Contamination</mark>: if the benchmark questions were in the pretraining data (and the web is full of copies), the model may have <mark>memorized them</mark>, so its score is higher than its true ability.<br>• Detection: n-gram overlap between the test and the training data, checking whether the model completes test questions verbatim, and comparing performance on a modified version (different numbers or wording).<br>• Reduction: <mark>private test sets</mark> that are unpublished, <mark>live benchmarks</mark> refreshed with questions after a certain date (like LiveCodeBench), and <mark>canary strings</mark> in the data so it gets filtered out of training.</p>'+
         '<p>And there is <mark>saturation</mark>: when models reach around 90% or more, the metric stops separating them, so harder benchmarks appear (such as MMLU-Pro, GPQA and Humanity\'s Last Exam), and over time those saturate too.</p>')),
 q:[
   CQ("موديل بيجيب 95% على benchmark عام، و70% على benchmark جديد مكتوب حديثًا بنفس الصعوبة. أرجح سبب؟","A model scores 95% on a public benchmark but 70% on a freshly written one of the same difficulty. What is the most likely cause?",
   [["Contamination: الموديل ممكن يكون شاف أسئلة الـ benchmark العام وحفظها","Contamination: the model may have seen and memorized the public benchmark questions"],["الـ SE صغير","The SE is small"],["الحكم عنده position bias","The judge has position bias"],["الـ benchmark الجديد أسهل","The new benchmark is easier"]],
   0,"الفرق الكبير على نسخة جديدة بنفس الصعوبة علامة كلاسيكية على الـ contamination.","A big drop on a fresh version of the same difficulty is a classic sign of contamination."),
   CQ("إيه معنى إن benchmark بقى saturated؟","What does it mean that a benchmark is saturated?",
   [["الموديلات وصلت لقرب 90%+ فبقى مش بيفرّق بينها","Models reached about 90%+ so it no longer separates them"],["الأسئلة اتسرّبت","The questions leaked"],["الداتا ناقصة","The data is incomplete"],["الـ benchmark بقى حي","The benchmark became live"]],
   0,"عشان كده بتظهر benchmarks أصعب، ومع الوقت هي كمان بتشبع.","That is why harder benchmarks appear, and over time they saturate too.")],
 f:[
   CF("إيه هو الـ contamination والـ saturation، وإزاي نتعامل معاهم؟","What are contamination and saturation, and how do we deal with them?",
      "Contamination: أسئلة الاختبار كانت في الـ training فالموديل حفظها. نكشفه بتطابق n-gram ونقلّله بـ test sets خاصة وbenchmarks حيّة. Saturation: الموديلات توصل لقرب 90%+ فالمقياس بيبطّل يفرّق، فنحتاج benchmarks أصعب.","Contamination: the test questions were in training, so the model memorized them. We detect it with n-gram overlap and reduce it with private test sets and live benchmarks. Saturation: models reach about 90%+ so the metric stops separating them, and we need harder benchmarks."),
   CF("إيه هي canary strings؟","What are canary strings?",
   "علامات مميزة بتتحط في بيانات الـ benchmark عشان تتفلتر من الـ training.","Distinctive markers placed in benchmark data so it gets filtered out of training.")],
 terms:[
   {t:B("Benchmark contamination","Benchmark contamination"),
 d:B("أسئلة الاختبار كانت في بيانات الـ training فالموديل ممكن يكون حفظها.","The test questions were in the training data, so the model may have memorized them.")},
   {t:B("Benchmark saturation","Benchmark saturation"),
 d:B("الموديلات توصل لقرب 90%+ فالمقياس بيبطّل يفرّق بينها.","Models reach about 90%+ and the metric stops separating them.")},
   {t:B("Live benchmark","Live benchmark"),
 d:B("benchmark بيتجدد بأسئلة بعد تاريخ معيّن عشان يقلّل الـ contamination.","A benchmark refreshed with questions after a certain date to reduce contamination.")},
   {t:B("Canary string","Canary string"),
 d:B("علامة مميزة في بيانات الاختبار عشان تتفلتر من الـ training.","A distinctive marker in test data so it gets filtered out of training.")}]},

{id:"l15-slice",t:B("Slice analysis: الرقم الإجمالي بيخبّي","Slice analysis: the overall number hides things"),
 b:cat(
       FIG_L15_SLICE,
       B('<p><mark>Slice analysis</mark>: الرقم الإجمالي بيخبّي. في الرسم: 70% من الأسئلة سهلة بدقة 92%، و30% صعبة بدقة 70%. الإجمالي <code>0.7 × 92 + 0.3 × 70 = 85.4%</code>. لو موديل جديد حسّن الإجمالي وقلّل أداء الجزء الصعب، مش هتلاحظ إلا لو قسّمت النتايج.</p>',
         '<p><mark>Slice analysis</mark>: the overall number hides things. In the figure: 70% of the questions are easy with 92% accuracy, and 30% are hard with 70% accuracy. The overall is <code>0.7 × 92 + 0.3 × 70 = 85.4%</code>. If a new model improves the overall while hurting the hard part, you will only notice if you split the results.</p>'),
       B('<p>مثال تاني: موديل جديد سهله 95% وصعبه 64%. الإجمالي <code>0.7 × 95 + 0.3 × 64 = 85.7%</code>، أعلى من 85.4% رغم إن الجزء الصعب نزل 6 نقط. وخلي الـ slice كبيرة كفاية، لأن slice من 30 سؤال بس هامش خطئها كبير.</p>',
  '<p>Another example: a new model scores 95% on the easy part and 64% on the hard part. The overall is <code>0.7 × 95 + 0.3 × 64 = 85.7%</code>, higher than 85.4% even though the hard part dropped 6 points. And keep each slice large enough, because a slice of only 30 questions has a big margin of error.</p>')),
 q:[
   CQ("موديل جديد إجماليه أعلى بنقطتين، بس أداؤه نزل على slice مهمة. أنسب تصرف؟","A new model has an overall score 2 points higher, but its performance dropped on an important slice. What is the best move?",
      [["ننشره فورًا لأن الإجمالي أعلى","Ship it immediately because the overall is higher"],["نشيل الـ slice من الـ eval","Remove the slice from the eval"],["نفحص حجم الـ slice وأهميتها وهل النزول أكبر من الضجيج قبل ما نقرر","Check the slice's size and importance and whether the drop exceeds the noise before deciding"],["نرفض الموديل الجديد تلقائيًا","Automatically reject the new model"]],
      2,"الإجمالي بيخبّي. القرار بيعتمد على أهمية الـ slice للمستخدمين ومدى كبر النزول مقارنةً بهامش الخطأ.","The overall hides things. The decision depends on how important the slice is to users and how large the drop is compared with the margin of error."),
   CQ("80% من الأسئلة سهلة بدقة 90%، و20% صعبة بدقة 60%. إيه الدقة الإجمالية؟","80% of the questions are easy with 90% accuracy, and 20% are hard with 60% accuracy. What is the overall accuracy?",
   [["75%","75%"],["84%","84%"],["90%","90%"],["78%","78%"]],
   1,"0.8 × 90 + 0.2 × 60 = 72 + 12 = 84%. الرقم ده بيخبّي إن الجزء الصعب ضعيف.","0.8 × 90 + 0.2 × 60 = 72 + 12 = 84%. This number hides that the hard part is weak.")],
 f:[
   CF("إيه هو slice analysis؟","What is slice analysis?",
   "تقسيم النتايج على أجزاء (زي سهل وصعب) عشان نشوف الضعف اللي الرقم الإجمالي بيخبّيه. مثال: 0.7 × 92 + 0.3 × 70 = 85.4%.","Splitting results into parts (such as easy and hard) to see the weakness the overall number hides. Example: 0.7 × 92 + 0.3 × 70 = 85.4%."),
   CF(`إزاي الـ overall accuracy ممكن يزيد والموديل يبقى أسوأ؟`,`How can overall accuracy go up while the model gets worse?`,
   `الـ overall متوسط مرجّح للـ slices. تحسّن صغير في slice كبير سهل بيغطّي على هبوط في slice صغير صعب. مثال: 0.7 × 95 + 0.3 × 64 = 85.7% ضد 0.7 × 92 + 0.3 × 70 = 85.4%.`,`The overall is a weighted average of the slices. A small gain on a large easy slice can hide a drop on a small hard slice. Example: 0.7 × 95 + 0.3 × 64 = 85.7% vs 0.7 × 92 + 0.3 × 70 = 85.4%.`)],
 terms:[
   {t:B("Slice analysis","Slice analysis"),
 d:B("تقسيم نتايج التقييم على أجزاء من الداتا عشان نكشف الضعف اللي الرقم الإجمالي بيخبّيه.","Splitting evaluation results across parts of the data to expose the weakness the overall number hides.")}]},

{id:"l15-fairness",t:B("تقييم الـ fairness والـ bias والـ toxicity","Evaluating fairness, bias and toxicity"),
 b:cat(
       B('<p>الموديل ممكن يبقى كويس في الإجمالي وأسوأ مع مجموعات معيّنة. <mark>تقييم الـ bias</mark> بيسأل: لو اتغيّر بس مصطلح المجموعة (اسم، ضمير، جنسية)، هل السلوك بيتغيّر؟ الأداة المعتادة هي <mark>counterfactual prompts</mark>: نفس الـ prompt مرتين بعد تبديل المصطلح، ونقارن الدقة والرفض والـ sentiment والـ toxicity. مثلًا BBQ بيفحص الاعتماد على الصور النمطية في الـ question answering.</p>'+
  '<p>وتقييم الـ <mark>toxicity</mark> شبهه: benchmark زي RealToxicityPrompts بيدّي الموديل prompts ويقيس كام مرة الاستكمال بيطلع سام، غالبًا بـ classifier. بس الـ classifier موديل كمان، وممكن يعلّم كلام بريء بس لأنه بيذكر هوية أو بلهجة معيّنة.</p>',
  '<p>A model can look good overall and still be worse for some groups. <mark>Bias evaluation</mark> asks: if only a group term changes (a name, a pronoun, a nationality), does the behavior change? The usual tool is <mark>counterfactual prompts</mark>: the same prompt twice after swapping the term, then compare accuracy, refusals, sentiment and toxicity. For example, BBQ checks reliance on stereotypes in question answering.</p>'+
  '<p><mark>Toxicity</mark> evaluation is similar: a benchmark like RealToxicityPrompts gives the model prompts and measures how often its continuations are toxic, with a classifier. But the classifier is a model too, and it can flag harmless text just because it mentions an identity or uses a certain dialect.</p>'),
       FIG_L15_FAIR,
       B('<p>مثال:</p>'+
  '<div class=\"m\">gap = 90 - 78 = 12 points\nSE = sqrt(0.9 x 0.1 / 100 + 0.78 x 0.22 / 100) = 0.051\n95% margin = 1.96 x 0.051 = +-10 points</div>'+
  '<p>غلطات شائعة: نعتبر الـ fairness رقم واحد (المقاييس ممكن تتعارض)، ونفتكر إن حذف كلمة المجموعة كفاية (كلمات تانية بتبقى بديل ليها)، ونقفل الفجوة برفض أي prompt بيذكر مجموعة، وده over-refusal وظلم هو كمان.</p>',
  '<p>Example:</p>'+
  '<div class=\"m\">gap = 90 - 78 = 12 points\nSE = sqrt(0.9 x 0.1 / 100 + 0.78 x 0.22 / 100) = 0.051\n95% margin = 1.96 x 0.051 = +-10 points</div>'+
  '<p>Common mistakes: treating fairness as one number (the metrics can conflict), assuming that removing the group word is enough (other words act as proxies), and closing a gap by refusing every prompt that mentions a group, which is over-refusal and unfair itself.</p>')),
 q:[
   CQ("الـ classifier بتاع الـ toxicity بيعلّم نص بريء بس لأنه بيذكر هوية معيّنة. ده معناه إيه لتقييم الـ toxicity؟","A toxicity classifier flags harmless text just because it mentions a certain identity. What does this mean for toxicity evaluation?",
   [["الـ classifier نفسه ممكن يبقى biased، فدرجاته مش حقيقة مطلقة","The classifier itself may be biased, so its scores are not absolute truth"],["الـ toxicity مش بتتقاس","Toxicity cannot be measured"],["الموديل أكيد سام","The model is certainly toxic"],["مفيش حاجة نعملها","There is nothing to do"]],
   0,"لازم نراجع أمثلة بشرية ونقيّم الـ classifier على المجموعات المختلفة.","We need to review human examples and evaluate the classifier across different groups."),
   CQ("دقة 95% لمجموعة A و91% لمجموعة B (100 مثال لكل واحدة). الفرق 4 نقط وهامش الفرق حوالي ±7. إيه الاستنتاج؟","Accuracy is 95% for group A and 91% for group B (100 examples each). The gap is 4 points and the margin of the gap is about ±7. What is the conclusion?",
   [["فرق حقيقي أكيد","A definitely real gap"],["الفرق جوه هامش الخطأ، فمش واضح إنه حقيقي ومحتاجين بيانات أكتر","The gap is inside the margin of error, so it is not clearly real and we need more data"],["مفيش bias خالص","There is no bias at all"],["نشيل المجموعة B","Remove group B"]],
   1,"SE للفرق = sqrt(0.95 × 0.05 / 100 + 0.91 × 0.09 / 100) = 0.036، و1.96 × 0.036 ≈ 7 نقط.","SE of the gap = sqrt(0.95 × 0.05 / 100 + 0.91 × 0.09 / 100) = 0.036, and 1.96 × 0.036 ≈ 7 points.")],
 f:[
   CF("إيه هي counterfactual prompts في تقييم الـ bias؟","What are counterfactual prompts in bias evaluation?",
   "نفس الـ prompt مرتين بعد تبديل مصطلح المجموعة بس (اسم، ضمير، جنسية)، ونقارن سلوك الموديل.","The same prompt twice after swapping only the group term (a name, a pronoun, a nationality), then comparing the model's behavior."),
   CF("ليه تقليل الـ toxicity برفض أي prompt بيذكر مجموعة مش حل؟","Why is reducing toxicity by refusing every prompt that mentions a group not a fix?",
   "ده over-refusal وهو ظلم كمان، والـ fairness مش رقم واحد.","It is over-refusal and unfair too, and fairness is not a single number.")],
 terms:[
   {t:B("Bias evaluation","Bias evaluation"),
 d:B("فحص هل سلوك الموديل بيتغيّر لما مصطلح المجموعة بس بيتغيّر.","Checking whether the model's behavior changes when only the group term changes.")},
   {t:B("Counterfactual prompts","Counterfactual prompts"),
 d:B("نفس الـ prompt بعد تبديل مصطلح المجموعة، لمقارنة المخرجات.","The same prompt after swapping the group term, to compare outputs.")},
   {t:B("Toxicity evaluation","Toxicity evaluation"),
 d:B("قياس كام مرة الموديل بيولّد كلام سام، غالبًا بـ classifier ممكن يكون biased.","Measuring how often the model generates toxic text, usually with a classifier that can itself be biased.")},
   {t:B("Over-refusal","Over-refusal"),
 d:B("رفض طلب بريء شكله خطير.","Refusing a harmless request that only looks dangerous.")}]},

{id:"l15-risks-misuse",
 t:B(`المخاطر الاجتماعية (1): misinformation و misuse و dual-use`,`Social risks (1): misinformation, misuse and dual-use`),
 b:cat(
   B(`<p>تلات مخاطر اجتماعية للموديلات، ولكل واحد مثال وتخفيف.</p><p><mark>Misinformation</mark>: الموديل بيقول كلام غلط بثقة ومن غير أي شخص ناوي يأذي. مثال: بيألّف مرجع علمي مش موجود. التخفيف: نربط الإجابة بمصادر مسترجعة مع citations، ونخلّي الموديل يقول "مش عارف"، ونحط مراجعة بشرية لو الغلطة مكلفة.</p><p><mark>Misuse</mark>: حد بيستخدم الموديل لهدف ضار عن قصد. مثال: كتابة رسائل phishing مقنعة أو spam بكميات كبيرة. التخفيف: safety training علشان الموديل يرفض الإساءة الواضحة، وسياسات استخدام مع monitoring وrate limits، وred teaming قبل الإطلاق.</p><p><mark>Dual-use</mark>: نفس القدرة بتخدم الخير والشر. مثال: مساعدة الكود بتسرّع المطوّرين وممكن كمان تساعد في كتابة malware. التخفيف: نقيّم القدرات الخطرة قبل الإطلاق، ونديّ الوصول على مستويات، ونوازن كل safeguard مقابل الـ over-refusal اللي بيضر المستخدم الشرعي.</p>`,
     `<p>Three social risks of language models, each with an example and a mitigation.</p><p><mark>Misinformation</mark>: the model states false things confidently, with no bad actor needed. Example: it invents a reference that does not exist. Mitigation: ground answers in retrieved sources with citations, let the model say "I don't know", and keep a human check where mistakes are costly.</p><p><mark>Misuse</mark>: someone uses the model for a harmful goal on purpose. Example: writing convincing phishing messages or spam at scale. Mitigation: safety training so the model refuses clear abuse, usage policies with monitoring and rate limits, and red teaming before release.</p><p><mark>Dual-use</mark>: the same capability serves good and harm. Example: code help speeds up developers and can also help write malware. Mitigation: evaluate dangerous capabilities before release, give access in tiers, and weigh each safeguard against over-refusal, which hurts legitimate users.</p>`),
   FIG_L15_DUAL,
   B(`<p>غلطة شائعة: نفتكر إن فلتر واحد بيحل التلاتة. الـ misinformation مش محتاجة شخص سيّئ النية، والـ misuse فيها قصد، والـ dual-use إن نفس القدرة بتخدم الاتنين.</p>`,
     `<p>A common mistake: thinking one filter solves all three. Misinformation needs no bad actor, misuse involves intent, and dual-use means the same ability serves both sides.</p>`)),
 q:[
   CQ(`إيه الفرق بين misuse و dual-use؟`,`What is the difference between misuse and dual-use?`,
      [[`الـ misuse استخدام ضار متعمّد، والـ dual-use إن نفس القدرة ممكن تخدم استخدام نافع وضار`,`Misuse is deliberate harmful use, while dual-use means the same capability can serve a helpful or a harmful use`],
       [`الـ misuse بيحصل بالغلط، والـ dual-use بيحصل بقصد`,`Misuse happens by accident, and dual-use happens on purpose`],
       [`الاتنين نفس المعنى`,`They mean the same thing`],
       [`الـ dual-use معناه موديلين بيشتغلوا مع بعض`,`Dual-use means two models working together`]],
      0,`الـ misuse فيها قصد ضار. والـ dual-use صفة في القدرة نفسها: نفس الشيء ينفع وممكن يضر.`,`Misuse involves harmful intent. Dual-use is a property of the capability itself: the same thing can help or harm.`),
   CQ(`موديل بيألّف مرجع علمي مش موجود ويقدّمه بثقة. أنسب تخفيف مباشر؟`,`A model invents a scientific reference that does not exist and presents it confidently. What is the most direct mitigation?`,
      [[`نربط الإجابة بمصادر مسترجعة مع citations ونسمح للموديل يقول مش عارف`,`Ground the answer in retrieved sources with citations and let the model say it does not know`],
       [`نحط rate limit على الـ API`,`Put a rate limit on the API`],
       [`نخلّي الموديل يرفض أي سؤال عن مراجع`,`Make the model refuse every question about references`],
       [`نكبّر طول الـ prompt`,`Make the prompt longer`]],
      0,`ده misinformation مش misuse، فالتخفيف المباشر هو الـ grounding والاعتراف بعدم المعرفة. الـ rate limit للـ misuse، والرفض الكامل over-refusal.`,`This is misinformation, not misuse, so the direct mitigation is grounding and admitting uncertainty. A rate limit targets misuse, and refusing everything is over-refusal.`)
 ],
 f:[
   CF(`إيه الفرق بين misinformation و misuse و dual-use؟`,`What is the difference between misinformation, misuse and dual-use?`,
      `Misinformation: كلام غلط بثقة من غير قصد ضار. Misuse: استخدام ضار متعمّد. Dual-use: نفس القدرة بتخدم الخير والشر.`,`Misinformation: confident falsehood with no harmful intent. Misuse: deliberate harmful use. Dual-use: the same capability serves good and harm.`),
   CF(`ليه لازم نوازن أي safeguard مقابل الـ over-refusal؟`,`Why must we weigh every safeguard against over-refusal?`,
      `لأن الرفض الزيادة بيضر المستخدم الشرعي، فالـ safeguard المثالي بيقلّل الضار من غير ما يمنع النافع.`,`Because too much refusal hurts legitimate users, so a good safeguard cuts the harm without blocking the benefit.`)
 ],
 terms:[
   {t:B(`Misinformation`,`Misinformation`),
    d:B(`معلومات غلط بيطلّعها الموديل بثقة، من غير ما حد يقصد الأذى.`,`False information the model states confidently, without anyone intending harm.`)},
   {t:B(`Misuse`,`Misuse`),
    d:B(`استخدام الموديل لهدف ضار عن قصد.`,`Using the model for a harmful goal on purpose.`)},
   {t:B(`Dual-use`,`Dual-use`),
    d:B(`قدرة واحدة ممكن تخدم استخدام نافع وضار.`,`A single capability that can serve a helpful or a harmful use.`)}
 ]},

{id:"l15-risks-society",
 t:B(`المخاطر الاجتماعية (2): الخصوصية والـ memorization، العمل، البيئة، وتركّز القوة`,`Social risks (2): privacy and memorization, work, environment, and concentration of power`),
 b:B(`<p><mark>الخصوصية والـ memorization</mark>: الموديل ممكن <mark>يحفظ</mark> نص نادر من التدريب ويعيده. مثال: لو اديناه بداية مستند شافه في التدريب يكمّله بنفس النص، وده ممكن يشمل بيانات شخصية. التخفيف: نشيل النسخ المكررة والبيانات الشخصية من بيانات التدريب، ونختبر بـ extraction probes، ولو لزم نتدرّب بـ <mark>differential privacy</mark> وده بيكلّف شوية جودة.</p><p><mark>أثر على العمل</mark>: الموديلات غالبًا بتأتمت أجزاء من الوظائف أكتر من وظائف كاملة. مثال: كتابة ردود أو كود شخص بيراجعه بعد كده. الأثر الصافي على التوظيف لسه محل نقاش. التخفيف: نصمّم للاستخدام مع إنسان في الحلقة، ونقيس على مهام حقيقية مش benchmarks بس، ونخطط لإعادة التدريب المهني.</p><p><mark>التكلفة البيئية</mark>: التدريب بيستهلك طاقة كبيرة مرة واحدة، والتشغيل بيستهلك طاقة مع كل طلب، فبيتراكم مع عدد المستخدمين. التخفيف: موديلات أصغر أو distilled لما تكفي، وhardware وتشغيل أكفأ، وطاقة أنضف، والإفصاح عن استهلاك الطاقة.</p><p><mark>تركّز القوة والوصول</mark>: تدريب موديلات الحدود بياخد compute وبيانات عند جهات قليلة، والجودة مش متساوية بين اللغات. التخفيف: <mark>open-weight models</mark> وcompute بحثي مشترك، وبيانات وتقييم أفضل للغات المتعددة، ومراجعة مستقلة. والـ open weights بتصعّب التحكم في الـ dual-use، فده تنازل.</p>`,
     `<p><mark>Privacy and memorization</mark>: a model can <mark>memorize</mark> rare training text and repeat it. Example: given the start of a document seen in training, it continues with the exact text, which may include personal details. Mitigation: remove duplicates and personal data from the training set, test with extraction probes, and where needed train with <mark>differential privacy</mark>, which costs some quality.</p><p><mark>Impact on work</mark>: models often automate parts of jobs more than whole jobs. Example: drafting replies or code that a person then reviews. The net effect on employment is still debated. Mitigation: design for a human in the loop, measure on real tasks and not only benchmarks, and plan for retraining.</p><p><mark>Environmental cost</mark>: training uses a lot of energy once, and serving uses energy on every request, so it adds up with users. Mitigation: smaller or distilled models when they are enough, more efficient hardware and serving, cleaner energy, and reporting energy use.</p><p><mark>Concentration of power and access</mark>: training frontier models needs compute and data that few organizations have, and quality is uneven across languages. Mitigation: <mark>open-weight models</mark> and shared research compute, better multilingual data and evaluation, and independent audits. Open weights also make dual-use controls harder, so this is a trade-off.</p>`),
 q:[
   CQ(`ليه الـ memorization خطر على الخصوصية؟`,`Why is memorization a privacy risk?`,
      [[`لأن الموديل ممكن يعيد نص حقيقي من التدريب، ومنه بيانات شخصية`,`Because the model can repeat real training text, including personal data`],
       [`لأنه بيبطّأ التدريب`,`Because it slows down training`],
       [`لأنه بيخلّي الموديل ينسى`,`Because it makes the model forget`],
       [`لأنه بيكبّر الـ vocabulary`,`Because it enlarges the vocabulary`]],
      0,`الحفظ الحرفي معناه إن الموديل ممكن يطلّع نص نادر كان في التدريب، ولو فيه بيانات شخصية بتتسرّب.`,`Verbatim memorization means the model can output rare training text, and any personal data in it leaks.`),
   CQ(`عايز تختبر لو موديلك بيسرّب نص من التدريب. إيه الاختبار الأنسب؟`,`You want to test whether your model leaks training text. Which test fits best?`,
      [[`نديه بداية مستندات من التدريب ونشوف لو بيكمّلها حرفيًا`,`Give it the start of training documents and see whether it continues them verbatim`],
       [`نقيس الـ accuracy على MMLU`,`Measure accuracy on MMLU`],
       [`نحسب الـ Elo بتاعه`,`Compute its Elo`],
       [`نحسب kappa بين judge وبشر`,`Compute kappa between a judge and humans`]],
      0,`ده اختبار extraction: لو الاستكمال طابق النص الأصلي حرفيًا فالموديل حافظه. الباقي بيقيس حاجات تانية.`,`This is an extraction test: if the continuation matches the original text verbatim, the model memorized it. The others measure other things.`)
 ],
 f:[
   CF(`إيه هو الـ memorization وإزاي نقلّله؟`,`What is memorization and how do we reduce it?`,
      `إن الموديل يحفظ نص نادر من التدريب ويعيده حرفيًا. بنقلّله بإزالة المكرر والبيانات الشخصية، وبـ differential privacy لو لزم.`,`The model stores rare training text and repeats it verbatim. We reduce it by removing duplicates and personal data, and with differential privacy if needed.`),
   CF(`إزاي الـ open weights بتخفّف تركّز القوة، وإيه التنازل؟`,`How do open weights reduce concentration of power, and what is the trade-off?`,
      `ناس أكتر تقدر تدرسه وتستخدمه، بس التحكم في الـ dual-use بيبقى أصعب.`,`More people can study and use it, but controlling dual-use becomes harder.`)
 ],
 terms:[
   {t:B(`Memorization`,`Memorization`),
    d:B(`حفظ الموديل لنص نادر من التدريب وإعادته حرفيًا.`,`The model storing rare training text and repeating it verbatim.`)},
   {t:B(`Differential privacy`,`Differential privacy`),
    d:B(`طريقة تدريب بتضيف ضوضاء علشان أثر أي مثال فردي يبقى صغير. بتكلّف شوية جودة.`,`A training method that adds noise so the effect of any single example is small. It costs some quality.`)},
   {t:B(`Open-weight model`,`Open-weight model`),
    d:B(`موديل أوزانه متاحة للناس تنزّلها وتشغّلها بنفسها.`,`A model whose weights are released so people can download and run it themselves.`)}
 ]},

{id:"l15-checklist",t:B("قائمة عملية لتقييم نظامك","A practical checklist for evaluating your system"),
 b:cat(
       B('<p>قائمة عملية لتقييم نظامك:<br>1. ابدأ من <mark>القرار</mark> (هتنشر؟ هتختار بين موديلين؟).<br>2. ابني <mark>eval set من بياناتك أنت</mark>: مئات الأمثلة الحقيقية أحسن من الاعتماد على leaderboard عام.<br>3. استخدم أكتر من مقياس (آلي + حكم + عينة بشرية).<br>4. اعرض <mark>error bars</mark> وقسّم النتايج على slices.<br>5. شغّل الـ evals كـ <mark>regression tests</mark> مع كل تغيير في الـ prompt أو الموديل.<br>6. اقرا أمثلة فعلية من الأخطاء، مش الأرقام بس.</p>'+
         '<p>وده بيربط كل اللي فات: التقييم هو اللي بيقولك هل الـ RAG محتاج retriever أحسن (محاضرة 13)، وهل الـ reasoning الأطول بيفيد فعلًا (محاضرة 14)، وهل الـ fine-tuning أحسن من الـ prompting (محاضرة 11). من غير تقييم كويس، كل قرار تاني تخمين.</p>',
         '<p>A practical checklist for evaluating your system:<br>1. Start from the <mark>decision</mark> (will you ship? choose between two models?).<br>2. Build an <mark>eval set from your own data</mark>: hundreds of real examples beat relying on a general leaderboard.<br>3. Use more than one metric (automatic + judge + a human sample).<br>4. Show <mark>error bars</mark> and split the results into slices.<br>5. Run the evals as <mark>regression tests</mark> with every change to the prompt or the model.<br>6. Read actual error examples, not just the numbers.</p>'+
         '<p>And this ties together everything before it: evaluation is what tells you whether the RAG needs a better retriever (lecture 13), whether longer reasoning really helps (lecture 14), and whether fine-tuning beats prompting (lecture 11). Without good evaluation, every other decision is a guess.</p>')),
 q:[
   CQ("إيه أول خطوة في قائمة تقييم نظامك؟","What is the first step in the checklist for evaluating your system?",
   [["نختار أكبر benchmark","Pick the biggest benchmark"],["نبدأ من القرار اللي هنتخده بالنتيجة","Start from the decision we will make with the result"],["نعمل fine-tuning","Fine-tune the model"],["نحسب perplexity","Compute perplexity"]],
   1,"القرار هو اللي بيحدد المقياس.","The decision determines the metric."),
   CQ("ليه بنشغّل الـ evals كـ regression tests مع كل تغيير؟","Why do we run the evals as regression tests with every change?",
   [["عشان نكتشف لو تغيير في الـ prompt أو الموديل وطّى الجودة","To catch it when a change to the prompt or the model lowers quality"],["عشان نغيّر الـ benchmark","To change the benchmark"],["عشان نحذف الـ slices","To remove the slices"],["عشان نوفّر الـ error bars","To save on error bars"]],
   0,"من غير فحص مستمر ممكن تحسين في جانب يكسر جانب تاني من غير ما تلاحظ.","Without continuous checks an improvement in one area can break another unnoticed.")],
 f:[
   CF("إيه خطوات تقييم نظامك؟","What are the steps for evaluating your system?",
   "نبدأ من القرار، نبني eval من بياناتنا، نستخدم أكتر من مقياس، نعرض error bars وslices، نشغّل regression tests، ونقرا أمثلة الأخطاء.","Start from the decision, build an eval from our own data, use more than one metric, show error bars and slices, run regression tests, and read actual error examples."),
   CF(`ليه بنشغّل الـ evals كـ regression tests مع كل تغيير؟`,`Why do we run evals as regression tests with every change?`,
   `علشان نكتشف لو تغيير في الـ prompt أو الموديل حسّن حاجة وكسر حاجة تانية من غير ما نلاحظ.`,`To catch a change to the prompt or model that improves one thing and silently breaks another.`)],
 terms:[
   {t:B("Eval regression test","Eval regression test"),
 d:B("تشغيل نفس الـ eval مع كل تغيير في الـ prompt أو الموديل لاكتشاف أي تراجع.","Running the same eval after every change to the prompt or the model to catch any drop.")}]},

{id:"l15-recap",t:B("Recap: محاضرة 15","Recap: Lecture 15"),
 b:cat(
       B('<p>الـ Recap، 5 نقاط:<br>1. مفيش مقياس واحد يكفي: كل طريقة بتوازن بين التكلفة والواقعية، وقانون Goodhart بيحذّر من تحسين رقم واحد.<br>2. أي رقم benchmark ليه هامش خطأ، والفروق الصغيرة ممكن تبقى ضجيج.<br>3. الكود بيتقاس بـ pass@k، والتفضيل البشري بـ Elo أو Bradley-Terry.<br>4. الحكم بـ LLM لازم يتعايِر بـ kappa، وبنخفّف الـ biases بتبديل الترتيب وrubric.<br>5. بنحمي النتيجة من contamination وsaturation، وبنقسّمها على slices (منها المجموعات) عشان نكشف الـ bias.</p>'+
  '<p>أهم المعادلات:</p>'+
  '<div class=\"m\">SE = sqrt( p (1 - p) / n )\npass@k = 1 - C(n-c, k) / C(n, k)\nE_A = 1 / (1 + 10^((R_B - R_A) / 400))\nkappa = (p_o - p_e) / (1 - p_e)</div>'+
  '<p>قبل المحاضرة اللي بعدها لازم تعرف: تقرا رقم benchmark ومعاه error bars، وتفرّق بين الطرق الأربع، وتحدد القرار اللي التقييم بيخدمه.</p>',
  '<p>The recap, 5 points:<br>1. No single metric is enough: each method trades cost against realism, and Goodhart\'s law warns against optimizing one number.<br>2. Every benchmark number has a margin of error, and small gaps may be noise.<br>3. Code is measured with pass@k, and human preference with Elo or Bradley-Terry.<br>4. An LLM judge must be calibrated with kappa, and we reduce its biases by swapping the order and using a rubric.<br>5. We protect results from contamination and saturation, and split them into slices (groups included) to catch bias.</p>'+
  '<p>The key equations:</p>'+
  '<div class=\"m\">SE = sqrt( p (1 - p) / n )\npass@k = 1 - C(n-c, k) / C(n, k)\nE_A = 1 / (1 + 10^((R_B - R_A) / 400))\nkappa = (p_o - p_e) / (1 - p_e)</div>'+
  '<p>Before the next lecture you should be able to: read a benchmark number together with its error bars, tell the four methods apart, and name the decision the evaluation serves.</p>')),
 q:[
   CQ("إيه اللي بيتحسب بالمعادلة 1 - C(n-c, k) / C(n, k)؟","What does the formula 1 - C(n-c, k) / C(n, k) compute?",
   [["الخطأ المعياري","The standard error"],["احتمال إن على الأقل واحد من k حل صح (pass@k)","The probability that at least one of k solutions is correct (pass@k)"],["احتمال فوز A على B","The probability that A beats B"],["الـ kappa","Kappa"]],
   1,"ولما k = 1 بتبسّط لـ c / n.","And when k = 1 it simplifies to c / n."),
   CQ("قبل ما نثق في LLM judge على آلاف الأمثلة، إيه اللي لازم نعمله؟","Before trusting an LLM judge on thousands of examples, what must we do?",
   [["نعايره على عينة بشرية ونقيس الاتفاق بـ kappa","Calibrate it on a human sample and measure agreement with kappa"],["نخلّيه يحكم على نفسه","Let it judge itself"],["نستخدم أطول rubric","Use the longest rubric"],["نشيل الإجابة المرجعية","Remove the reference answer"]],
   0,"وبنفضل نراجع عينة بشرية صغيرة دوريًا.","And we keep re-checking a small human sample periodically.")],
 f:[
   CF("إيه التلات حاجات اللي لازم نعرفها عن أي رقم benchmark؟","What three things must we know about any benchmark number?",
   "حجم العينة وهامش الخطأ، وإعداد التقييم (prompt وعدد الأمثلة)، واحتمال الـ contamination أو الـ saturation.","The sample size and margin of error, the evaluation setup (prompt and number of examples), and the chance of contamination or saturation."),
   CF("إيه الطريقة المناسبة لكل نوع مهمة؟","Which method suits which kind of task?",
   "كود: unit tests وpass@k. إجابات مفتوحة: LLM judge معايَر بـ kappa. تفضيل المستخدمين: Elo أو Bradley-Terry.","Code: unit tests and pass@k. Open answers: an LLM judge calibrated with kappa. User preference: Elo or Bradley-Terry.")]}
]}
);

})();
