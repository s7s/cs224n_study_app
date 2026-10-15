/* Lecture 9: Pretraining: BERT, T5 & GPT
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L9 fig: pretrain then fine-tune pipeline */
function preFig(){
  var s='';
  s+=RECT(10,30,100,60,'var(--sf)','var(--mu)',10,1.8)+T(60,56,'huge','tb','middle','font-size:11.5px')+T(60,72,'unlabeled text','tm','middle','font-size:10.5px');
  s+=AL(110,60,134,60,'ac','mA');
  s+=RECT(136,30,90,60,'var(--acs)','var(--ac)',10,1.8)+T(181,56,'pretrain','tb','middle','font-size:11.5px')+T(181,72,'predict words','tm','middle','font-size:10.5px');
  s+=AL(226,60,250,60,'ac','mA');
  s+=RECT(252,30,98,60,'var(--sf)','var(--ok)',10,1.8)+T(301,56,'general','tb','middle','font-size:11.5px')+T(301,72,'language model','tm','middle','font-size:10.5px');
    s+=RECT(10,128,100,60,'var(--sf)','var(--mu)',10,1.8)+T(60,154,'small','tb','middle','font-size:11.5px')+T(60,170,'labeled data','tm','middle','font-size:10.5px');
  s+=AL(110,158,134,158,'ac','mA');
  s+=RECT(136,128,90,60,'var(--acs)','var(--ac)',10,1.8)+T(181,154,'adapt','tb','middle','font-size:11.5px')+T(181,170,'tune / prompt','tm','middle','font-size:10.5px');
  s+='<path d="M301 90 V158 H230" style="fill:none;stroke:var(--ok);stroke-width:2" marker-end="url(#mG)"/>';
  s+=T(180,18,'stage 1','tm','middle','font-size:11px')+T(180,208,'stage 2','tm','middle','font-size:11px');
  return s;
}

var FIG_PRE=fig(222,preFig(),
  B('المرحلة الأولى: الموديل بيتعلم اللغة من نص ضخم من غير labels. المرحلة التانية (<mark>fine-tuning</mark>): بنكيّفه لمهمة معينة ببيانات قليلة.',
    'Stage one: the model learns language from a huge unlabeled text. Stage two (<mark>fine-tuning</mark>): we adapt it to a specific task with little data.'));

/* L9 fig: three architectures attention patterns */
function archFig(){
  var s='',c=18,i,j,g,GX=[14,134,254],T3=['Encoder','Decoder','Enc-Dec'],S3=['BERT','GPT','T5'],y0=44,ok;
  for(g=0;g<3;g++){
    s+=T(GX[g]+2*c,16,T3[g],'tb','middle','font-size:11.5px')+T(GX[g]+2*c,30,S3[g],'tm','middle','font-size:10.5px');
    for(i=0;i<4;i++)for(j=0;j<4;j++){
      if(g===0)ok=true;
      else if(g===1)ok=(j<=i);
      else ok=(j<2)||(i>=2&&j<=i);
      s+=RECT(GX[g]+j*c,y0+i*c,c,c,ok?'var(--acs)':'var(--sf)','var(--ln)',0,1);
      if(ok)s+=DOT(GX[g]+j*c+c/2,y0+i*c+c/2,'ac',3);
    }
  }
  s+=T(GX[0]+2*c,y0+4*c+16,'both sides','tm','middle','font-size:10.5px')+T(GX[1]+2*c,y0+4*c+16,'past only','tm','middle','font-size:10.5px')+T(GX[2]+2*c,y0+4*c+16,'both + past','tm','middle','font-size:10.5px');
  return s;
}

var FIG_ARCH=fig(160,archFig(),
  B('النقط الزرقا هي الكلمات اللي كل صف يقدر يبص عليها. الـ encoder بيشوف الاتجاهين، والـ decoder بيشوف الماضي بس، والـ encoder-decoder بيجمع الاتنين.',
    'The blue dots are the words each row can attend to. The encoder sees both directions, the decoder sees only the past, and the encoder-decoder combines both.'));

/* L9 fig: BERT masked language modeling */
function mlmFig(){
  var W=['the','cat','[MASK]','on','the','mat'],s='',i,x,w=54,gap=3;
  for(i=0;i<6;i++){
    x=10+i*(w+gap);
    var m=(i===2);
    s+=RECT(x,24,w,30,m?'var(--nobg)':'var(--sf)',m?'var(--no)':'var(--ln)',6,1.6)+T(x+w/2,43,W[i],m?'tb':'','middle','font-size:'+(m?'10':'11.5')+'px'+(m?';fill:var(--no)':''));
  }
  s+=RECT(10,84,w*6+gap*5,34,'var(--acs)','var(--ac)',9,1.8)+T(180,106,'Transformer encoder (reads both sides)','tb','middle','font-size:11.5px');
  for(i=0;i<6;i++){x=10+i*(w+gap)+w/2;s+=AL(x,54,x,84,'mu','mM');}
  s+=AL(10+2*(w+gap)+w/2,118,10+2*(w+gap)+w/2,148,'ok','mG');
  s+=RECT(10+2*(w+gap)-8,150,w+16,30,'var(--okbg)','var(--ok)',8,1.8)+T(10+2*(w+gap)+w/2,170,'sat','tb','middle','font-size:12px;fill:var(--ok)');
  s+=T(10+3*(w+gap),170,'← predict the masked word','tm','start','font-size:11px');
  return s;
}

var FIG_MLM=fig(194,mlmFig(),
  B('بنخفي كلمة (MASK) والـ encoder بيشوف الكلمات اللي قبلها وبعدها، وبيتنبأ بالكلمة المخفية. الـ loss بيتحسب على الخانات المخفية بس.',
    'We hide a word (MASK) and the encoder, seeing the words before and after it, predicts the hidden word. The loss is computed only on the hidden positions.'));

/* L9 fig: knowledge distillation (teacher soft labels -> student) */
function distillFig(){
  var s='',base=160,i,x,h,PT=[0.55,0.33,0.12],PS=[0.45,0.35,0.20],L=['cat','dog','car'];
  s+=RECT(10,12,130,34,'var(--sf)','var(--mu)',8,1.6)+T(75,34,'Teacher (large)','tb','middle','font-size:11.5px');
  s+=RECT(220,12,130,34,'var(--acs)','var(--ac)',8,1.8)+T(285,34,'Student (small)','tb','middle','font-size:11.5px');
  s+=AR(75,46,75,76,'mu','mM')+AR(285,46,285,76,'ac','mA');
  for(i=0;i<3;i++){
    x=25+i*40;h=PT[i]*100;
    s+=RECT(x,base-h,28,h,'var(--sf)','var(--mu)',3,1.4)+T(x+14,base-h-5,PT[i].toFixed(2),'tm','middle','font-size:10px')+T(x+14,base+14,L[i],'tm','middle','font-size:10px');
    x=235+i*40;h=PS[i]*100;
    s+=RECT(x,base-h,28,h,'var(--acs)','var(--ac)',3,1.4)+T(x+14,base-h-5,PS[i].toFixed(2),'tm','middle','font-size:10px')+T(x+14,base+14,L[i],'tm','middle','font-size:10px');
  }
  s+=T(180,112,'student learns','tm','middle','font-size:10px')+T(180,125,'to match','tm','middle','font-size:10px');
  s+=AL(146,138,214,138,'ok','mG',true);
  s+=T(180,190,'soft labels (T = 2)','tm','middle','font-size:10px');
  return s;
}

var FIG_DISTILL=fig(198,distillFig(),
  B('الـ teacher الكبير بيطلّع احتمالات ناعمة (soft)، والـ student الصغير بيتدرّب إن توزيعه يقرّب منها. الأرقام توضيحية.',
    'The large teacher produces soft probabilities, and the small student is trained to bring its own distribution close to them. The numbers are illustrative.'));

/* L9 fig: GPT next-token prediction */
function clmFig(){
  var IN=['the','cat','sat','on'],OUT=['cat','sat','on','the'],s='',i,x,w=62,gap=26;
  s+=T(8,16,'input','tm','start','font-size:11px');
  for(i=0;i<4;i++){
    x=14+i*(w+gap);
    s+=RECT(x,24,w,28,'var(--sf)','var(--ln)',6,1.6)+T(x+w/2,43,IN[i],'tb','middle','font-size:11.5px');
    s+=AL(x+w/2,52,x+w/2,92,'mu','mM');
    s+=RECT(x,94,w,28,'var(--acs)','var(--ac)',8,1.8)+T(x+w/2,112,'decoder','tb','middle','font-size:10.5px');
    s+=AL(x+w/2,122,x+w/2,160,'ok','mG');
    s+=RECT(x,162,w,28,'var(--okbg)','var(--ok)',6,1.6)+T(x+w/2,181,OUT[i],'tb','middle','font-size:11.5px;fill:var(--ok)');
    if(i<3)s+=AL(x+w,108,x+w+gap,108,'ac','mA',true);
  }
  s+=T(8,206,'target = the next word','tm','start','font-size:11px');
  return s;
}

var FIG_CLM=fig(216,clmFig(),
  B('كل موضع بيتنبأ بالكلمة اللي بعده. الأسهم المقطّعة هي الـ causal masking: كل موضع بيشوف اللي قبله بس.',
    'Each position predicts the word after it. The dashed arrows are the causal masking: each position sees only what comes before.'));

/* L9 fig: T5 span corruption */
function t5Fig(){
  var s='';
  s+=T(10,18,'original','tm','start','font-size:11px')+T(10,36,'Thank you for inviting me to your party last week .','','start','font-size:10.5px');
  s+=T(10,70,'encoder input','tm','start','font-size:11px')+T(10,88,'Thank you &lt;X&gt; me to your party &lt;Y&gt; week .','tb','start','font-size:10.5px');
  s+=AL(180,96,180,122,'ac','mA');
  s+=RECT(90,124,180,30,'var(--acs)','var(--ac)',9,1.8)+T(180,143,'encoder → decoder','tb','middle','font-size:11.5px');
  s+=AL(180,154,180,180,'ok','mG');
  s+=T(10,198,'decoder target','tm','start','font-size:11px')+T(10,216,'&lt;X&gt; for inviting &lt;Y&gt; last &lt;Z&gt;','tb','start','font-size:10.5px;fill:var(--ok)');
  s+=T(10,242,'&lt;X&gt; &lt;Y&gt; &lt;Z&gt; = sentinel tokens (one per span)','tm','start','font-size:10px');
  return s;
}

var FIG_T5=fig(254,t5Fig(),
  B('الـ span corruption: كل جزء متتالي مخفي بيتبدّل بـ sentinel واحد في المدخل، والـ decoder بيولّد الأجزاء المحذوفة بترتيبها.',
    'Span corruption: each hidden consecutive span is replaced by one sentinel in the input, and the decoder generates the dropped spans in order.'));

/* L9 fig: scaling law on log-log axes */
function scaleFig(){
  var s='',x0=48,y0=190,W=290,H=150,i,P=[[0,0.12],[1,0.34],[2,0.52],[3,0.70],[4,0.86]];
  s+='<line x1="'+x0+'" y1="'+y0+'" x2="'+(x0+W)+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>'+
     '<line x1="'+x0+'" y1="'+(y0-H)+'" x2="'+x0+'" y2="'+y0+'" style="stroke:var(--mu);stroke-width:1.5"/>';
  s+='<line x1="'+(x0+10)+'" y1="'+(y0-H+10)+'" x2="'+(x0+W-14)+'" y2="'+(y0-16)+'" style="stroke:var(--ac);stroke-width:2.4"/>';
  for(i=0;i<5;i++){
    var px=x0+10+i*(W-24)/4,py=(y0-H+10)+i*(H-26)/4+((i===1)?-4:(i===3)?5:0);
    s+=DOT(px,py,'ok',5);
  }
  s+=T(x0+W,y0+16,'compute (log) →','tm','end','font-size:11px')+T(x0+4,y0-H-6,'loss (log)','tm','start','font-size:11px');
  s+=T(x0+W-6,y0-H+30,'straight line =','tb','end','font-size:11px')+T(x0+W-6,y0-H+46,'power law','tb','end','font-size:11px');
  return s;
}

var FIG_SCALE=fig(222,scaleFig(),
  B('على محورين log، الـ loss بينزل في خط مستقيم تقريبًا مع زيادة الحساب. ده معنى إنه power law. الأرقام توضيحية.',
    'On log-log axes the loss falls roughly along a straight line as compute grows. That is what a power law means. The numbers are illustrative.'));

/* L9 fig: pretraining data pipeline (funnel) */
function dataFig(){
  var s='',R=[['raw crawl',100,'var(--sf)','var(--ln)'],['text + language',50,'var(--sf)','var(--ln)'],['quality filters',20,'var(--acs)','var(--ac)'],['dedup',10,'var(--okbg)','var(--ok)']],i,y,w;
  for(i=0;i<4;i++){
    y=14+i*40;w=R[i][1]*1.7;
    s+=T(8,y+19,R[i][0],'tm','start','font-size:10.5px');
    s+=RECT(124,y,w,28,R[i][2],R[i][3],6,1.6);
    s+=T(124+w+8,y+19,R[i][1]+'%','tb','start','font-size:11px');
  }
  s+=T(8,184,'% of the raw tokens kept (illustrative)','tm','start','font-size:10px');
  return s;
}

var FIG_DATA=fig(196,dataFig(),
  B('كل مرحلة بتشيل جزء من النص الخام، وفي الآخر ممكن يفضل حوالي 10% بس. النسب توضيحية.',
    'Each stage removes part of the raw text, and in the end only about 10% may remain. The percentages are illustrative.'));

/* L9 fig: fine-tuning vs in-context learning */
function iclFig(){
  var s='';
  s+=T(10,18,'Fine-tuning','tb','start','font-size:11.5px');
  s+=RECT(10,26,100,44,'var(--sf)','var(--ln)',8,1.4)+T(60,52,'labeled set','tm','middle','font-size:11px');
  s+=AL(110,48,148,48,'ac','mA');
  s+=RECT(150,26,100,44,'var(--acs)','var(--ac)',8,1.8)+T(200,45,'model','tb','middle','font-size:11.5px')+T(200,60,'θ → θ\'','tm','middle','font-size:10.5px');
  s+=T(262,52,'weights change','tm','start','font-size:10.5px');
  s+='<line x1="10" y1="92" x2="350" y2="92" style="stroke:var(--ln);stroke-width:1.2"/>';
  s+=T(10,114,'In-context learning','tb','start','font-size:11.5px');
  s+=RECT(10,124,160,64,'var(--sf)','var(--ok)',8,1.8)+
     T(18,142,'great → positive','','start','font-size:10.5px')+T(18,157,'awful → negative','','start','font-size:10.5px')+T(18,177,'fine → ?','tb','start','font-size:10.5px');
  s+=AL(160,156,184,156,'ok','mG');
  s+=RECT(186,134,84,44,'var(--acs)','var(--ac)',8,1.8)+T(228,153,'frozen model','tb','middle','font-size:10px')+T(228,168,'θ unchanged','tm','middle','font-size:10px');
  s+=AL(270,156,292,156,'ok','mG');
  s+=T(296,160,'positive','tb','start','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_ICL=fig(204,iclFig(),
  B('الـ fine-tuning بيغيّر أوزان الموديل بـ gradient descent. الـ in-context learning بيسيب الأوزان زي ما هي، والأمثلة بتتحط في الـ prompt نفسه.',
    'Fine-tuning changes the model weights with gradient descent. In-context learning leaves the weights as they are, and the examples are placed in the prompt itself.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:9,t:B("Pretraining: BERT و T5 و GPT","Pretraining: BERT, T5 & GPT"),cards:[

{id:"l9-why3arch",t:B("ليه Pretraining؟ وتلات معماريات","Why pretraining? Three architectures"),
 b:cat(B('<p>في word2vec كل كلمة ليها vector واحد ثابت مهما كان السياق (\"bank\" ليها نفس الـ vector في \"river bank\" وفي \"bank account\"). الـ <mark>pretraining</mark> بيدرّب شبكة كاملة تطلّع تمثيل <mark>contextual</mark> لكل كلمة حسب جملتها. وبنتعلم ده من نص من غير labels (<mark>self-supervised</mark>): الـ label بيجي من النص نفسه، زي الكلمة اللي بعدها.</p>',
         '<p>In word2vec each word has one fixed vector no matter the context (\"bank\" has the same vector in \"river bank\" and in \"bank account\"). <mark>Pretraining</mark> trains a whole network to produce a <mark>contextual</mark> representation of each word according to its sentence. We learn this from text with no labels (<mark>self-supervised</mark>): the label comes from the text itself, such as the next word.</p>'),
       FIG_PRE,
       B('<p>الفكرة هي <mark>transfer learning</mark>: اللغة معرفة مشتركة بين كل المهام، فنتعلمها مرة واحدة من نص ضخم ونعيد استخدامها في مهام كتير بأمثلة قليلة. وحسب نوع الـ Transformer اللي بنستخدمه فيه 3 معماريات:</p>',
         '<p>The idea is <mark>transfer learning</mark>: language is knowledge shared by all tasks, so we learn it once from huge text and reuse it for many tasks with few examples. Depending on the kind of Transformer we use, there are 3 architectures:</p>'),
       FIG_ARCH,
       B('<p>1. <mark>Encoders</mark> (BERT): بيشوفوا الاتجاهين، ممتازين في الفهم (classification و tagging)، بس مش مناسبين لتوليد النص.<br>2. <mark>Decoders</mark> (GPT): بيشوفوا الماضي بس، بيولّدوا نص كلمة كلمة، وهم أساس النماذج اللغوية الكبيرة.<br>3. <mark>Encoder-decoders</mark> (T5 و BART): الـ encoder بيفهم المدخل والـ decoder بيولّد المخرج، مناسبين للترجمة والتلخيص.</p>',
         '<p>1. <mark>Encoders</mark> (BERT): see both directions, excellent at understanding (classification and tagging), but not suited to generating text.<br>2. <mark>Decoders</mark> (GPT): see only the past and generate text word by word; they are the basis of large language models.<br>3. <mark>Encoder-decoders</mark> (T5 and BART): the encoder understands the input and the decoder generates the output, suited to translation and summarization.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين الـ encoder والـ decoder في الـ pretraining؟","What is the main difference between an encoder and a decoder in pretraining?",
      [["الـ encoder بيشوف الكلمات قبل وبعد الموضع، والـ decoder بيشوف اللي قبله بس","The encoder sees the words before and after a position; the decoder sees only those before it"],["الـ decoder بيشوف الاتجاهين والـ encoder بيشوف اللي قبله بس","The decoder sees both directions; the encoder sees only the past"],["الـ encoder مفيهوش attention","The encoder has no attention"],["مفيش فرق، هما نفس الشيء","There is no difference; they are the same thing"]],
      0,"الـ causal mask هو اللي بيحدد الفرق: من غيره الموضع بيشوف الاتجاهين (encoder)، ومعاه بيشوف الماضي بس (decoder).","The causal mask makes the difference: without it a position sees both directions (encoder); with it, only the past (decoder)."),
   CQ("عايز تصنّف مراجعات منتجات (positive / negative) وتحتاج تمثيل قوي للجملة من الاتجاهين. أنهي معمارية الأنسب؟","You want to classify product reviews (positive / negative) and need a strong representation of the sentence from both directions. Which architecture fits best?",
   [["Decoder بس، لأنه بيولّد نص","A decoder only, because it generates text"],["word2vec، لأنه الأسرع","word2vec, because it is the fastest"],["Encoder زي BERT","An encoder such as BERT"],["Encoder-decoder، لأن لازم نولّد ملخص الأول","An encoder-decoder, because we must generate a summary first"]],
   2,"التصنيف فهم مش توليد، والـ encoder بيشوف الاتجاهين فبيطلّع تمثيل أقوى للجملة.","Classification is understanding, not generation, and the encoder sees both directions so it builds a stronger representation of the sentence.")
 ],
 f:[
   CF("إيه التلات معماريات للـ pretraining وإيه استخدام كل واحدة؟","What are the three pretraining architectures and what is each used for?",
      "Encoder (BERT): فهم وتصنيف. Decoder (GPT): توليد نص. Encoder-decoder (T5): ترجمة وتلخيص وكل مهام نص-لنص.","Encoder (BERT): understanding and classification. Decoder (GPT): text generation. Encoder-decoder (T5): translation, summarization and other text-to-text tasks."),
   CF("إيه الفرق بين word2vec والتمثيل الـ contextual؟","What is the difference between word2vec and a contextual representation?",
   "word2vec: vector واحد ثابت لكل كلمة. Contextual: vector مختلف لنفس الكلمة حسب جملتها (bank في river bank غير bank في bank account).","word2vec: one fixed vector per word. Contextual: a different vector for the same word depending on its sentence (bank in river bank differs from bank in bank account).")
 ],
 terms:[
   {t:B("Pretraining","Pretraining"),
    d:B("تدريب شبكة كاملة على نص ضخم من غير labels علشان تطلّع تمثيلات للغة، وبعدين نكيّفها للمهام.","Training a whole network on huge unlabeled text so it produces representations of language, then adapting it to tasks.")},
   {t:B("Self-supervised learning","Self-supervised learning"),
    d:B("تعلّم الـ label بتاعه بييجي من النص نفسه، زي الكلمة اللي بعدها.","Learning where the label comes from the text itself, such as the next word.")},
   {t:B("Contextual representation","Contextual representation"),
    d:B("vector للكلمة بيتغيّر حسب الجملة اللي هي فيها، عكس word2vec.","A word vector that changes with the sentence the word is in, unlike word2vec.")},
   {t:B("Transfer learning","Transfer learning"),
    d:B("نتعلم معرفة مشتركة مرة واحدة (اللغة) ونعيد استخدامها في مهام كتير.","Learning shared knowledge once (language) and reusing it for many tasks.")},
   {t:B("Encoder-only model","Encoder-only model"),
 d:B("Transformer بيشوف الاتجاهين (زي BERT)، ممتاز في الفهم والتصنيف.","A Transformer that sees both directions (like BERT), excellent at understanding and classification.")},
   
   {t:B("Encoder-decoder","Encoder-decoder"),
    d:B("الـ encoder بيفهم المدخل والـ decoder بيولّد المخرج (زي T5 و BART).","The encoder understands the input and the decoder generates the output (like T5 and BART).")},
{t:B("Fine-tuning","Fine-tuning"),
 d:B("نكمّل تدريب الموديل (كل الأوزان أو جزء) على أمثلة معنونة للمهمة.","Continuing to train the model (all weights or some) on labeled examples of the task.")}
 ]},

{id:"l9-bert",t:B("BERT: الـ masked language modeling","BERT: masked language modeling"),
 b:cat(B('<p>BERT (2018) هو encoder بس. المشكلة: لو الموديل بيشوف الاتجاهين مينفعش يتنبأ بالكلمة اللي بعدها (هيشوفها!). الحل: <mark>masked language modeling (MLM)</mark>. بنخبّي حوالي 15% من الـ tokens، والموديل بيتنبأ بيها من السياق في الاتجاهين.</p>',
         '<p>BERT (2018) is an encoder only. The problem: if the model sees both directions it cannot predict the next word (it would see it!). The fix: <mark>masked language modeling (MLM)</mark>. We hide about 15% of the tokens, and the model predicts them from context in both directions.</p>'),
       FIG_MLM,
       B('<div class="m">loss = - sum over masked i of log P(x_i | all unmasked words)</div>'+
         '<p>من الـ 15% اللي اتختاروا للتنبؤ: <mark>80%</mark> بنبدّلهم بـ <code>[MASK]</code>، و<mark>10%</mark> بنبدّلهم بكلمة عشوائية، و<mark>10%</mark> بنسيبهم زي ما هم. ليه كده؟ لأن <code>[MASK]</code> مش بيظهر وقت الـ fine-tuning، فلو دايمًا بدّلنا بيه هيبقى فيه mismatch. والـ 20% التانيين بيجبروا الموديل يبني تمثيل كويس لكل كلمة حتى لو شكلها طبيعي.</p>'+
         '<p>مثال: جملة من 100 token. بيتختار 15 منهم للتنبؤ: حوالي 12 يبقوا <code>[MASK]</code>، وحوالي 1 إلى 2 عشوائيين، وحوالي 1 إلى 2 سليمين.</p>',
         '<div class="m">loss = - sum over masked i of log P(x_i | all unmasked words)</div>'+
         '<p>Of the 15% chosen for prediction: <mark>80%</mark> are replaced with <code>[MASK]</code>, <mark>10%</mark> are replaced with a random word, and <mark>10%</mark> are left unchanged. Why? Because <code>[MASK]</code> never appears at fine-tuning time, so always using it would create a mismatch. The other 20% force the model to build a good representation of every word, even one that looks normal.</p>'+
         '<p>An example: a sentence of 100 tokens. 15 of them are chosen for prediction: about 12 become <code>[MASK]</code>, about 1 to 2 become random words, and about 1 to 2 stay intact.</p>')),
 q:[
   CQ("ليه BERT بيستخدم masked LM مش next-word prediction؟","Why does BERT use masked LM rather than next-word prediction?",
      [["لأن الـ masked LM أسرع في الحساب","Because masked LM is faster to compute"],["لأن BERT مفيهوش attention","Because BERT has no attention"],["لأنه بيشوف الاتجاهين، فلو اتنبأ بالكلمة التالية هيشوفها","Because it sees both directions, so predicting the next word would let it see the answer"],["لأن الـ next-word مش بيحتاج labels","Because next-word needs no labels"]],
      2,"التنبؤ بالكلمة التالية محتاج منع الرؤية للمستقبل، وBERT بيشوف الاتجاهين، فبنخبّي كلمات ونتنبأ بيها.","Next-word prediction requires blocking the future, and BERT sees both directions, so we hide words and predict them."),
   CQ("جملة من 200 token، و BERT اختار 15% للتنبؤ. تقريبًا كام token هيتبدّل بـ [MASK]؟","In a sentence of 200 tokens, BERT picks 15% for prediction. Roughly how many tokens become [MASK]?",
   [["30","30"],["24","24"],["6","6"],["160","160"]],
   1,"15% من 200 = 30 token مختارين، و80% منهم = 24 بيبقوا [MASK]، وحوالي 3 عشوائيين و3 سليمين.","15% of 200 = 30 chosen tokens, and 80% of those = 24 become [MASK], with about 3 random and 3 unchanged.")
 ],
 f:[
   CF("إيه خطوات الـ masked LM في BERT؟","What are the steps of masked LM in BERT?",
      "نختار 15% من الـ tokens: 80% بـ [MASK]، 10% كلمة عشوائية، 10% سليمين. الـ encoder بيتنبأ بالكلمات الأصلية من الاتجاهين، والـ loss على المواضع دي بس.","Pick 15% of the tokens: 80% become [MASK], 10% a random word, 10% unchanged. The encoder predicts the original words from both directions, and the loss is on those positions only."),
   CF("ليه BERT بيسيب 10% سليمين و10% عشوائيين؟","Why does BERT leave 10% unchanged and replace 10% with random words?",
   "لأن [MASK] مش بيظهر وقت الـ fine-tuning، فبنسيب جزء من المواضع المختارة بكلمة سليمة أو عشوائية علشان ما يحصلش mismatch، ولازم الموديل يبني تمثيل كويس لكل كلمة.","Because [MASK] never appears at fine-tuning time, so part of the chosen positions keep the original or a random word to avoid a mismatch, and the model must build a good representation of every word.")
 ],
 terms:[
   {t:B("Masked language modeling (MLM)","Masked language modeling (MLM)"),
    d:B("هدف BERT: نخبّي حوالي 15% من الـ tokens والموديل يتنبأ بيها من السياق في الاتجاهين.","BERT objective: hide about 15% of the tokens and let the model predict them from context in both directions.")},
   {t:B("[MASK] token","[MASK] token"),
    d:B("token خاص بيبدّل الكلمة المخفية في التدريب، ومش بيظهر وقت الـ fine-tuning.","A special token that replaces the hidden word in training and does not appear at fine-tuning time.")}
 ]},

{id:"l9-bert-variants",t:B("BERT عمليًا: الأحجام و RoBERTa وأخواتها","BERT in practice: sizes, RoBERTa and friends"),
 b:cat(B('<p>الأحجام: BERT-base فيه 12 طبقة وبُعد 768 و 12 head (حوالي 110M parameter)، و BERT-large فيه 24 طبقة وبُعد 1024 (حوالي 340M). وللـ fine-tuning بنحط token خاص <code>[CLS]</code> في أول الجملة ونستخدم تمثيله للتصنيف. النسخة الأولى اتدربت كمان على next sentence prediction، وRoBERTa بعدها أثبت إنها مش ضرورية.</p>'+
         '<p>بعد BERT الباحثين غيّروا وصفة التدريب مش المعمارية. <mark>RoBERTa</mark> (2019) نفس المعمارية، بس من غير next sentence prediction، وبنص أكتر بحوالي 10 مرات (حوالي 160GB بدل 16GB)، و batches أكبر وتدريب أطول، و<mark>dynamic masking</mark>: قناع جديد كل مرة الجملة بتتشاف. <mark>ALBERT</mark> بيشارك الـ parameters بين الطبقات علشان يصغّر الموديل. و<mark>ELECTRA</mark> بيتعلم من كل موضع: generator صغير بيبدّل كلمات، والموديل الأساسي بيحدد كل token أصلي ولا مبدّل.</p>'+
         '<p>غلطة شائعة: إن RoBERTa معمارية جديدة. هو BERT بوصفة أحسن، وده بيبيّن إن البيانات والهدف وطول التدريب بيفرقوا زي المعمارية. مثال: الـ MLM العادي بيتعلم من 15 موضع من كل 100، و ELECTRA من الـ 100 كلهم.</p>',
         '<p>Sizes: BERT-base has 12 layers, dimension 768 and 12 heads (about 110M parameters), and BERT-large has 24 layers and dimension 1024 (about 340M). For fine-tuning we put a special token <code>[CLS]</code> at the start of the sentence and use its representation for classification. The first version also trained on next sentence prediction, and RoBERTa later showed it is not necessary.</p>'+
         '<p>After BERT, researchers changed the training recipe, not the architecture. <mark>RoBERTa</mark> (2019) keeps the architecture but drops next sentence prediction, uses about 10 times more text (about 160GB instead of 16GB), larger batches and longer training, and <mark>dynamic masking</mark>: a new mask each time a sentence is seen. <mark>ALBERT</mark> shares parameters across layers to shrink the model. <mark>ELECTRA</mark> learns from every position: a small generator swaps some words, and the main model labels each token as original or replaced.</p>'+
         '<p>Common mistake: thinking RoBERTa is a new architecture. It is BERT with a better recipe, which shows that data, objective and training length matter as much as the architecture. Example: plain MLM learns from 15 of every 100 positions; ELECTRA learns from all 100.</p>')),
 q:[
   CQ("إيه الجديد في RoBERTa مقارنة بـ BERT؟","What is new in RoBERTa compared with BERT?",
      [["معمارية Transformer جديدة بالكامل","A completely new Transformer architecture"],["بيستخدم decoder بدل encoder","It uses a decoder instead of an encoder"],["بيشتغل من غير pretraining","It works without pretraining"],["نفس المعمارية بوصفة تدريب أحسن: بيانات أكتر، من غير NSP، و dynamic masking","The same architecture with a better training recipe: more data, no NSP, and dynamic masking"]],
      3,"RoBERTa مش معمارية جديدة: هو BERT بوصفة تدريب أحسن.","RoBERTa is not a new architecture: it is BERT with a better training recipe."),
   CQ("جملة من 500 token ونسبة التخبئة 15%. كام موضع بيتعلم منه الـ loss في MLM العادي، وفي ELECTRA؟","A sequence of 500 tokens and a 15% masking rate. How many positions does the loss learn from in plain MLM, and in ELECTRA?",
      [["75 في MLM و 500 في ELECTRA","75 in MLM and 500 in ELECTRA"],["500 في MLM و 75 في ELECTRA","500 in MLM and 75 in ELECTRA"],["75 في الاتنين","75 in both"],["15 في MLM و 500 في ELECTRA","15 in MLM and 500 in ELECTRA"]],
      0,"15% من 500 = 75 موضع في MLM. أما ELECTRA فبيحدد لكل token أصلي ولا مبدّل، فبيتعلم من الـ 500 كلهم.","15% of 500 = 75 positions in MLM. ELECTRA labels every token as original or replaced, so it learns from all 500.")
 ],
 f:[
   CF("إيه اللي اتغيّر في RoBERTa عن BERT؟","What changed in RoBERTa compared with BERT?",
      "نفس المعمارية بوصفة أحسن: من غير NSP، بيانات أكتر (حوالي 160GB)، batches أكبر وتدريب أطول، و dynamic masking.","The same architecture with a better recipe: no NSP, more data (about 160GB), larger batches and longer training, and dynamic masking."),
   CF("إيه فكرة ELECTRA؟","What is the idea of ELECTRA?",
      "generator صغير بيبدّل كلمات، والموديل الأساسي بيحدد كل token أصلي ولا مبدّل، فبيتعلم من كل المواضع مش 15% بس.","A small generator swaps some words, and the main model labels each token as original or replaced, so it learns from every position, not only 15%.")
 ],
 terms:[
   {t:B("[CLS] token","[CLS] token"),
    d:B("token خاص في أول الجملة في BERT، وبنستخدم تمثيله للتصنيف.","A special token at the start of the sentence in BERT; its representation is used for classification.")},
   {t:B("Next sentence prediction (NSP)","Next sentence prediction (NSP)"),
    d:B("هدف تدريب إضافي في BERT الأول: هل الجملة التانية بتيجي بعد الأولى؟ RoBERTa أثبت إنه مش ضروري.","An extra training objective in the first BERT: does the second sentence follow the first? RoBERTa showed it is not necessary.")},
   {t:B("RoBERTa","RoBERTa"),
    d:B("نفس معمارية BERT بوصفة تدريب أحسن: بيانات أكتر، تدريب أطول، من غير NSP، و dynamic masking.","The same architecture as BERT with a better training recipe: more data, longer training, no NSP, and dynamic masking.")},
   {t:B("Dynamic masking","Dynamic masking"),
    d:B("اختيار قناع جديد كل مرة الجملة بتتشاف في التدريب، بدل قناع ثابت.","Choosing a new mask each time a sentence is seen in training, instead of one fixed mask.")},
   {t:B("ALBERT","ALBERT"),
    d:B("نسخة من BERT بتشارك الـ parameters بين الطبقات علشان تصغّر الموديل.","A BERT variant that shares parameters across layers to shrink the model.")},
   {t:B("ELECTRA","ELECTRA"),
    d:B("generator صغير بيبدّل كلمات، والموديل الأساسي بيحدد كل token أصلي ولا مبدّل، فبيتعلم من كل المواضع.","A small generator swaps some words, and the main model labels each token as original or replaced, so it learns from every position.")}
 ]},

{id:"l9-distill",t:B("الـ Distillation: موديل صغير يقلّد كبير","Distillation: a small model imitates a large one"),
 b:cat(B('<p><mark>Knowledge distillation</mark> بيدرّب موديل صغير (<mark>student</mark>) يقلّد موديل كبير (<mark>teacher</mark>). الـ hard label بيقول بس: الإجابة cat. أما الـ teacher فبيدّي توزيع كامل، والـ <mark>soft labels</mark> دي بتقول للـ student كمان إن dog أقرب لـ cat من car. وفي الـ language model التوزيع بيبقى على الـ vocabulary كله (الكلمة التالية).</p>',
         '<p><mark>Knowledge distillation</mark> trains a small <mark>student</mark> model to imitate a large <mark>teacher</mark>. A hard label only says: the answer is cat. The teacher gives a full distribution, and these <mark>soft labels</mark> also tell the student that dog is closer to cat than car is. For a language model the distribution is over the whole vocabulary (the next word).</p>'),
       FIG_DISTILL,
       B('<div class="m">loss = a * CE(true label, student) + (1 - a) * T^2 * KL(teacher_T || student_T)</div>'+
         '<p>الـ <mark>temperature</mark> T لو أكبر من 1 بتسطّح الـ softmax، softmax(z / T)، فالاحتمالات الصغيرة تبان للـ student.</p>'+
         '<p>مثال: logits الـ teacher هي (4, 3, 1) لـ cat و dog و car. مع T = 1 الاحتمالات حوالي 0.71 و 0.26 و 0.04. ومع T = 2 بتبقى حوالي 0.55 و 0.33 و 0.12، فالعلاقات بين الأصناف بتظهر. و<mark>DistilBERT</mark> (2019) طبّق الفكرة على BERT: 6 طبقات بدل 12، أصغر بحوالي 40% وأسرع بحوالي 60%، وبيحافظ على حوالي 97% من أداء BERT.</p>',
         '<div class="m">loss = a * CE(true label, student) + (1 - a) * T^2 * KL(teacher_T || student_T)</div>'+
         '<p>The <mark>temperature</mark> T above 1 flattens the softmax, softmax(z / T), so the small probabilities become visible to the student.</p>'+
         '<p>Example: the teacher logits are (4, 3, 1) for cat, dog, car. At T = 1 the probabilities are about 0.71, 0.26, 0.04. At T = 2 they are about 0.55, 0.33, 0.12, so the relations between classes show up. <mark>DistilBERT</mark> (2019) applied the idea to BERT: 6 layers instead of 12, about 40% smaller and 60% faster, keeping about 97% of the performance of BERT.</p>')),
 q:[
   CQ("إيه ميزة الـ soft labels من الـ teacher على الـ hard label؟","What is the advantage of the teacher soft labels over a hard label?",
      [["بتخلي الـ student أكبر من الـ teacher","They make the student larger than the teacher"],["بتلغي الحاجة للـ pretraining","They remove the need for pretraining"],["بتوضّح العلاقات بين الأصناف (مثلًا dog أقرب لـ cat من car)","They show the relations between classes (for example dog is closer to cat than car)"],["بتزوّد عدد الـ parameters","They increase the number of parameters"]],
      2,"التوزيع الكامل فيه معلومات أكتر من label واحد، وده بيساعد الـ student يتعلم أسرع.","A full distribution carries more information than a single label, which helps the student learn faster."),
   CQ("logits الـ teacher لكلمتين هي (2, 0). مع T = 2، احتمال الكلمة الأولى حوالي كام؟","The teacher logits for two words are (2, 0). With T = 2, the probability of the first word is about?",
      [["0.88","0.88"],["0.50","0.50"],["0.27","0.27"],["0.73","0.73"]],
      3,"z / T = (1, 0)، فالاحتمال = e / (e + 1) = 2.72 / 3.72 = 0.73. (مع T = 1 كان 0.88، يعني أقل نعومة.)","z / T = (1, 0), so the probability = e / (e + 1) = 2.72 / 3.72 = 0.73. (With T = 1 it was 0.88, so less soft.)")
 ],
 f:[
   CF("إيه هي الـ knowledge distillation؟","What is knowledge distillation?",
      "تدريب موديل صغير (student) يقلّد التوزيع اللي بيطلّعه موديل كبير (teacher) بدل label واحد.","Training a small model (student) to imitate the distribution produced by a large model (teacher) instead of a single label."),
   CF("إيه وظيفة الـ temperature T في الـ distillation؟","What does the temperature T do in distillation?",
      "بيقسم الـ logits قبل الـ softmax. T أكبر من 1 بيسطّح التوزيع فالاحتمالات الصغيرة تظهر للـ student.","It divides the logits before the softmax. T above 1 flattens the distribution so the small probabilities become visible to the student.")
 ],
 terms:[
   {t:B("Knowledge distillation","Knowledge distillation"),
 d:B("تدريب موديل صغير (student) يقلّد مخرجات موديل كبير (teacher).","Training a small model (the student) to imitate the outputs of a large model (the teacher).")},
   {t:B("Teacher model","Teacher model"),
    d:B("الموديل الكبير اللي مخرجاته هي الهدف في الـ distillation.","The large model whose outputs are the target in distillation.")},
   {t:B("Student model","Student model"),
    d:B("الموديل الصغير اللي بيتدرّب يقلّد الـ teacher.","The small model trained to imitate the teacher.")},
   {t:B("Soft labels","Soft labels"),
    d:B("التوزيع الكامل للاحتمالات اللي بيطلّعه الـ teacher بدل label واحد.","The full probability distribution produced by the teacher instead of a single label.")},
   {t:B("Temperature","Temperature"),
 d:B("رقم T بيقسم الـ logits قبل الـ softmax. T أكبر من 1 بيسطّح التوزيع ويبيّن الاحتمالات الصغيرة، و T أصغر من 1 بيحدّه.","A number T that divides the logits before the softmax. T above 1 flattens the distribution and shows the small probabilities; T below 1 sharpens it.")},
   {t:B("DistilBERT","DistilBERT"),
    d:B("نسخة مصغّرة من BERT (6 طبقات) متدرّبة بالـ distillation: أصغر بحوالي 40% وأسرع بحوالي 60%.","A smaller BERT (6 layers) trained with distillation: about 40% smaller and 60% faster.")}
 ]},

{id:"l9-gpt",t:B("GPT: الـ causal language modeling","GPT: causal language modeling"),
 b:cat(B('<p>GPT هو decoder بس، وبيتدرّب على <mark>causal language modeling</mark>: يتنبأ بالكلمة التالية، من غير ما نخبّي حاجة. ده نفس الـ language model بتاع المحاضرة 5 بس بـ Transformer بدل الـ RNN:</p>'+
         '<div class="m">loss = - sum_t log P(x_t | x_1, ..., x_(t-1))</div>',
         '<p>GPT is a decoder only, trained with <mark>causal language modeling</mark>: predict the next word, with nothing hidden. This is the same language model as lecture 5, but with a Transformer instead of an RNN:</p>'+
         '<div class="m">loss = - sum_t log P(x_t | x_1, ..., x_(t-1))</div>'),
       FIG_CLM,
       B('<p>فيه ميزتين كبار. أولًا: أي نص على الإنترنت هو بيانات تدريب (كل كلمة هي الـ label للي قبلها)، فمفيش حاجة لتعنون. تانيًا: الموديل بيتدرّب على التوليد بالظبط، فبيعرف يولّد نص. وفي الطريق بيتعلم نحو ومعلومات عن العالم، لأن التنبؤ الكويس بيحتاجها.</p>'+
         '<p>تطور GPT: GPT-1 (2018) حوالي 117M parameter، و GPT-2 (2019) حوالي 1.5B، و GPT-3 (2020) حوالي 175B. ومع GPT-2 و GPT-3 ظهر إن الموديل الكبير بيحل مهام كتير من غير fine-tuning، بـ prompt بس. ده موضوع الكروت الجاية.</p>',
         '<p>There are two big advantages. First: any text on the internet is training data (each word is the label for the words before it), so there is nothing to annotate. Second: the model trains on exactly the thing it must do, generation, so it can generate text. Along the way it learns grammar and facts about the world, because predicting well requires them.</p>'+
         '<p>The GPT progression: GPT-1 (2018) had about 117M parameters, GPT-2 (2019) about 1.5B, and GPT-3 (2020) about 175B. With GPT-2 and GPT-3 it appeared that a large model solves many tasks without fine-tuning, with just a prompt. That is the topic of the next cards.</p>')),
 q:[
   CQ("إيه هدف التدريب في GPT؟","What is the training objective in GPT?",
      [["التنبؤ بالكلمة التالية من الكلمات اللي قبلها","Predict the next word from the words before it"],["التنبؤ بالكلمات المخفية من الاتجاهين","Predict masked words from both directions"],["تصنيف الجملة","Classify the sentence"],["ترجمة الجملة","Translate the sentence"]],
      0,"الـ causal LM: كل موضع بيتنبأ بالكلمة اللي بعده وبيشوف الماضي بس.","Causal LM: each position predicts the word after it, seeing only the past."),
   CQ("لما GPT بيتنبأ بالكلمة رقم 4 في نص، أنهي كلمات بيقدر يشوفها؟","When GPT predicts word number 4 of a text, which words can it see?",
   [["الكلمات 1 لـ 5 كلها","All words 1 to 5"],["الكلمات 1 و2 و3 بس","Words 1, 2 and 3 only"],["الكلمة 4 نفسها وما بعدها","Word 4 itself and the ones after it"],["الكلمات 5 وما بعدها بس","Words 5 and later only"]],
   1,"الـ causal mask بيخبّي المستقبل، فالموضع بيشوف الكلمات اللي قبله بس.","The causal mask hides the future, so a position sees only the words before it.")
 ],
 f:[
   CF("إيه الفرق بين هدف BERT وهدف GPT؟","How do the objectives of BERT and GPT differ?",
      "BERT: يتنبأ بكلمات مخفية من الاتجاهين (encoder). GPT: يتنبأ بالكلمة التالية من الماضي بس (decoder)، وده اللي بيخليه يولّد نص.","BERT: predicts hidden words from both directions (encoder). GPT: predicts the next word from the past only (decoder), which lets it generate text."),
   CF("إيه ميزتين التدريب بـ causal LM؟","What are the two advantages of training with a causal LM?",
   "أي نص على الإنترنت بيبقى بيانات تدريب من غير تعنون، والموديل بيتدرّب على التوليد نفسه فبيعرف يولّد نص.","Any internet text becomes training data with no annotation, and the model trains on generation itself so it can generate text.")
 ],
 terms:[
   {t:B("Causal language modeling","Causal language modeling"),
    d:B("هدف GPT: التنبؤ بالكلمة التالية من الكلمات اللي قبلها، من غير ما نخبّي حاجة.","GPT objective: predict the next word from the words before it, with nothing hidden.")},
   {t:B("Causal mask","Causal mask"),
 d:B("بنحط <code>-inf</code> في خانات المستقبل قبل الـ softmax، فكل كلمة بتشوف نفسها والسابقين بس.","We put <code>-inf</code> in the future cells before the softmax, so each word sees only itself and the words before it.")}
 ]},

{id:"l9-t5",t:B("T5: نص إلى نص و span corruption","T5: text-to-text and span corruption"),
 b:cat(B('<p>T5 (Text-to-Text Transfer Transformer) هو encoder-decoder، وفكرته إن <mark>كل مهمة</mark> تتحول لنص داخل ونص خارج، فنفس الموديل ونفس الـ loss لكل المهام:</p>'+
         '<div class="m">translate English to German: That is good.  ->  Das ist gut.\nsummarize: (article text)  ->  (summary)\nsentiment: I loved it  ->  positive</div>'+
         '<p>الـ pretraining في T5 هو <mark>span corruption</mark>: بنخبّي أجزاء متتالية (spans) بدل كلمات مفردة، وكل span بيتبدّل بـ <mark>sentinel token</mark> واحد (<code>&lt;X&gt;</code> و <code>&lt;Y&gt;</code> ...). الـ encoder بياخد النص المشوّه، والـ decoder بيولّد الأجزاء المحذوفة بترتيبها، كل جزء بعد الـ sentinel بتاعه:</p>',
         '<p>T5 (Text-to-Text Transfer Transformer) is an encoder-decoder, and its idea is that <mark>every task</mark> becomes text in and text out, so the same model and the same loss serve all tasks:</p>'+
         '<div class="m">translate English to German: That is good.  ->  Das ist gut.\nsummarize: (article text)  ->  (summary)\nsentiment: I loved it  ->  positive</div>'+
         '<p>Pretraining in T5 is <mark>span corruption</mark>: we hide consecutive spans instead of single words, and each span is replaced by one <mark>sentinel token</mark> (<code>&lt;X&gt;</code>, <code>&lt;Y&gt;</code> ...). The encoder takes the corrupted text, and the decoder generates the dropped spans in order, each after its own sentinel:</p>'),
       FIG_T5,
       B('<p>في T5 بيتشوّه حوالي 15% من الـ tokens، بمتوسط طول span حوالي 3. ليه spans مش كلمات؟ الـ target بيبقى أقصر (الأجزاء المحذوفة بس) فالتدريب أرخص، وبيتعلم الموديل يكمّل عبارات مش كلمات مفردة.</p>'+
         '<p>أكبر T5 حجمه 11B parameter، واتدرّب على C4 وهي نسخة منظّفة من web crawl. ونفس الفكرة (encoder-decoder بتشويه النص) في BART، اللي بيستخدم أنواع تشويه تانية زي حذف tokens وخلط ترتيب الجمل.</p>',
         '<p>In T5 about 15% of the tokens are corrupted, with an average span length of about 3. Why spans instead of words? The target becomes shorter (only the dropped parts), so training is cheaper, and the model learns to complete phrases rather than single words.</p>'+
         '<p>The largest T5 has 11B parameters and was trained on C4, a cleaned version of a web crawl. The same idea (an encoder-decoder with corrupted text) appears in BART, which uses other kinds of corruption such as deleting tokens and shuffling the order of sentences.</p>')),
 q:[
   CQ("في span corruption بتاع T5، الـ decoder بيولّد إيه؟","In T5 span corruption, what does the decoder generate?",
      [["الجملة الأصلية كلها من الأول","The whole original sentence from scratch"],["تصنيف الجملة","The sentence label"],["الأجزاء المحذوفة بترتيبها، كل جزء بعد الـ sentinel بتاعه","The dropped spans in order, each after its sentinel"],["الـ sentinels بس","Only the sentinels"]],
      2,"الـ target قصير: sentinel ثم الجزء المحذوف، وهكذا، وده بيخلّي التدريب أرخص.","The target is short: a sentinel then the dropped span, and so on, which makes training cheaper."),
   CQ("جملة: we like this red apple a lot. لو خبّينا الجزء like this والجزء a lot، إيه الـ target اللي الـ decoder بيولّده؟","Sentence: we like this red apple a lot. If we hide the span like this and the span a lot, what target does the decoder generate?",
   [["we &lt;X&gt; red apple &lt;Y&gt;","we &lt;X&gt; red apple &lt;Y&gt;"],["like this a lot","like this a lot"],["&lt;X&gt; &lt;Y&gt;","&lt;X&gt; &lt;Y&gt;"],["&lt;X&gt; like this &lt;Y&gt; a lot &lt;Z&gt;","&lt;X&gt; like this &lt;Y&gt; a lot &lt;Z&gt;"]],
   3,"الـ target = sentinel ثم الجزء المحذوف، وهكذا، وبيتقفل بـ sentinel أخير. أما مدخل الـ encoder فهو we &lt;X&gt; red apple &lt;Y&gt;.","The target = a sentinel then the dropped span, and so on, closed by a final sentinel. The encoder input is we &lt;X&gt; red apple &lt;Y&gt;.")
 ],
 f:[
   CF("إيه هي فكرة T5 وإيه الـ pretraining فيه؟","What is the idea of T5 and what is its pretraining?",
      "Encoder-decoder وكل المهام نص-لنص بـ prefix يوصّف المهمة. الـ pretraining بـ span corruption: spans بتتبدّل بـ sentinels والـ decoder بيولّد المحذوف.","An encoder-decoder with every task as text-to-text using a prefix that describes the task. Pretraining uses span corruption: spans replaced by sentinels, and the decoder generates the missing parts."),
   CF("ليه T5 بيخبّي spans مش كلمات مفردة؟","Why does T5 hide spans instead of single words?",
   "الـ target بيبقى أقصر (الأجزاء المحذوفة بس) فالتدريب أرخص، والموديل بيتعلم يكمّل عبارات مش كلمات مفردة.","The target becomes shorter (only the dropped parts) so training is cheaper, and the model learns to complete phrases rather than single words.")
 ],
 terms:[
   {t:B("Text-to-text","Text-to-text"),
    d:B("كل مهمة بتتحول لنص داخل ونص خارج، فنفس الموديل ونفس الـ loss لكل المهام (T5).","Every task becomes text in and text out, so the same model and loss serve all tasks (T5).")},
   {t:B("Span corruption","Span corruption"),
    d:B("هدف T5: أجزاء متتالية بتتبدّل بـ sentinel والـ decoder بيولّد الأجزاء المحذوفة بترتيبها.","T5 objective: consecutive spans are replaced by a sentinel and the decoder generates the dropped spans in order.")},
   {t:B("Sentinel token","Sentinel token"),
    d:B("token خاص زي <code>&lt;X&gt;</code> بيحل محل span محذوف في المدخل.","A special token such as <code>&lt;X&gt;</code> that stands in for a dropped span in the input.")},
   {t:B("C4","C4"),
    d:B("نسخة منظّفة من web crawl اتدرّب عليها T5.","A cleaned version of a web crawl that T5 was trained on.")}
 ]},

{id:"l9-scaling",t:B("الـ scaling laws","Scaling laws"),
 b:cat(B('<p>اكتشاف مهم (Kaplan وآخرين، 2020): الـ loss بتاع الـ language model بينزل بشكل <mark>power law</mark> متوقع لما نكبّر 3 حاجات: عدد الـ parameters (N)، وحجم البيانات (D)، وحجم الحساب (C):</p>'+
         '<div class="m">L(N) = (N_c / N) ^ alpha_N      alpha_N is about 0.076</div>',
         '<p>An important discovery (Kaplan et al., 2020): the language-model loss falls along a predictable <mark>power law</mark> as we scale 3 things: the number of parameters (N), the data size (D), and the compute (C):</p>'+
         '<div class="m">L(N) = (N_c / N) ^ alpha_N      alpha_N is about 0.076</div>'),
       FIG_SCALE,
       B('<p>مثال: لو كبّرنا الموديل 10 مرات، الـ loss بيتضرب في <code>10^(-0.076)</code> يعني حوالي 0.84، فبينزل حوالي 16%. التحسن ثابت ومتوقع، فنقدر نخمّن أداء موديل ضخم من تجارب صغيرة قبل ما ندرّبه.</p>'+
         '<p>السؤال بعد كده: بحساب ثابت، أكبّر الموديل ولا أزوّد البيانات؟ دراسة <mark>Chinchilla</mark> (2022) لقت إن موديلات زي GPT-3 كانت <mark>under-trained</mark>: كبيرة والبيانات قليلة. القاعدة التقريبية: حوالي <mark>20 token لكل parameter</mark>. وحساب التدريب تقريبًا:</p>'+
         '<div class="m">C = 6 * N * D  FLOPs\nChinchilla: N = 70B, D = 1.4T\nC = 6 * 70e9 * 1.4e12 = about 6e23</div>',
         '<p>An example: if we make the model 10 times larger, the loss is multiplied by <code>10^(-0.076)</code>, about 0.84, so it drops about 16%. The improvement is steady and predictable, so we can estimate the performance of a huge model from small experiments before training it.</p>'+
         '<p>The next question: with a fixed compute budget, do we grow the model or add data? The <mark>Chinchilla</mark> study (2022) found that models like GPT-3 were <mark>under-trained</mark>: large, with too little data. The rough rule: about <mark>20 tokens per parameter</mark>. And the training compute is roughly:</p>'+
         '<div class="m">C = 6 * N * D  FLOPs\nChinchilla: N = 70B, D = 1.4T\nC = 6 * 70e9 * 1.4e12 = about 6e23</div>')),
 q:[
   CQ("موديل حجمه 10B، حسب قاعدة Chinchilla محتاج كام token تقريبًا؟","A model with 10B parameters needs roughly how many tokens according to the Chinchilla rule?",
      [["20B token","20B tokens"],["10B token","10B tokens"],["2T token","2T tokens"],["200B token","200B tokens"]],
      3,"20 token لكل parameter: 20 × 10B = 200B.","20 tokens per parameter: 20 × 10B = 200B."),
   CQ("الموديل كبر 100 مرة. حسب L(N) = (N_c / N)^0.076، الـ loss بيتضرب في حوالي كام؟","The model grows 100 times. By L(N) = (N_c / N)^0.076, the loss is multiplied by about how much?",
   [["0.84","0.84"],["0.50","0.50"],["0.70","0.70"],["0.99","0.99"]],
   2,"100^(-0.076) = 10^(-0.152) وده حوالي 0.70، يعني الـ loss بينزل حوالي 30%. (0.84 هو ناتج 10 مرات بس.)","100^(-0.076) = 10^(-0.152), which is about 0.70, so the loss drops about 30%. (0.84 is the result for 10 times only.)")
 ],
 f:[
   CF("إيه اللي بتقوله الـ scaling laws ودراسة Chinchilla؟","What do scaling laws and the Chinchilla study say?",
      "الـ loss بينزل بـ power law مع N و D و C. Chinchilla: بحساب ثابت لازم نزوّد البيانات مع الموديل، حوالي 20 token لكل parameter.","The loss falls as a power law in N, D and C. Chinchilla: with fixed compute we must grow the data along with the model, about 20 tokens per parameter."),
   CF("إيه معنى C = 6 * N * D؟","What does C = 6 * N * D mean?",
   "حساب التدريب التقريبي بالـ FLOPs = 6 × عدد الـ parameters × عدد الـ tokens. مثلًا 70B و 1.4T بيدوا حوالي 6e23.","The approximate training compute in FLOPs = 6 × parameters × tokens. For example 70B and 1.4T give about 6e23.")
 ],
 terms:[
   {t:B("Scaling law","Scaling law"),
 d:B("علاقة منتظمة: الـ loss بينزل بشكل متوقع لما نكبّر الـ parameters والبيانات والحساب.","A regular relation: the loss falls predictably as we grow parameters, data and compute.")},
   {t:B("Power law","Power law"),
 d:B("علاقة على شكل <code>y = c * x^a</code>، بتطلع خط مستقيم على محورين log.","A relation of the form <code>y = c * x^a</code>, which appears as a straight line on log-log axes.")},
   {t:B("Chinchilla scaling","Chinchilla scaling"),
 d:B("دراسة (2022) لقت إن بحساب ثابت لازم نزوّد البيانات مع الموديل: حوالي 20 token لكل parameter.","A 2022 study finding that with fixed compute we must grow data along with the model: about 20 tokens per parameter.")},
   {t:B("Under-trained model","Under-trained model"),
    d:B("موديل كبير متدرّب على بيانات أقل من اللي المفروض بالنسبة لحجمه (زي GPT-3 حسب Chinchilla).","A large model trained on less data than its size warrants (like GPT-3 according to Chinchilla).")},
   {t:B("FLOPs","FLOPs"),
 d:B("عدد العمليات الحسابية العشرية. الـ multiply-add الواحد بيتحسب بـ 2.","The number of floating-point operations. One multiply-add counts as 2.")},
{t:B("Tokens per parameter","Tokens per parameter"),
 d:B("نسبة D / N. حوالي 20 في Chinchilla، وأكتر بكتير في موديلات بتتدرّب للاستخدام.","The ratio D / N. About 20 in Chinchilla, and far higher in models trained for serving.")}
 ]},

{id:"l9-data",t:B("بيانات الـ pretraining: جمع وتصفية و dedup","Pretraining data: collection, filtering and dedup"),
 b:cat(B('<p>قوانين الـ scaling بتقول إن البيانات مهمة قد حجم الموديل، فمحتاجين تريليونات الـ tokens. بس الكمية لوحدها مش كفاية: <mark>الجودة</mark> مهمة كمان.</p>'+
         '<p>Chinchilla (70B) غلب Gopher (280B) اللي اتدرّب بحساب مشابه تقريبًا. بس النماذج الحديثة بتتدرب على tokens أكتر بكتير من 20 لكل parameter، لأن تكلفة الاستخدام (inference) بتتوزع على طلبات كتير، فبنفضّل موديل أصغر متدرّب أكتر.</p>',
         '<p>Scaling laws say that data matters as much as model size, so we need trillions of tokens. But raw volume is not enough: <mark>quality</mark> matters too.</p>'+
         '<p>Chinchilla (70B) beat Gopher (280B), which was trained with roughly similar compute. But modern models train on far more than 20 tokens per parameter, because the cost of use (inference) is spread over many requests, so we prefer a smaller model trained longer.</p>'),
       FIG_DATA,
       B('<p>النص بيجي منين؟ أغلبه من <mark>web crawl</mark> (Common Crawl)، ومعاه كتب و Wikipedia وكود وأبحاث. الـ crawl الخام فيه نص كتير ضعيف، فبنمرّره على pipeline: استخراج النص، تحديد اللغة، <mark>فلاتر جودة</mark> (قواعد بسيطة و classifier متدرّب يميّز النص الكويس)، وبعدين <mark>dedup</mark>: حذف المستندات المتطابقة وشبه المتطابقة، لأن النص المتكرر بيتحفظ وبيضيّع حساب.</p>'+
         '<p>مثال: لو حوالي 10% بس من الـ tokens الخام بتعدي، فللحصول على 1.4T token نضيف (زي Chinchilla) محتاجين حوالي 14T خام. وأخيرًا بنعمل <mark>mixture</mark> بأوزان للمصادر: في GPT-3 ويكيبيديا اتشافت حوالي 3.4 مرة، بينما Common Crawl المفلتر اتشاف أقل من مرة.</p>',
         '<p>Where does the text come from? Mostly a <mark>web crawl</mark> (Common Crawl), plus books, Wikipedia, code and papers. The raw crawl holds a lot of weak text, so a pipeline cleans it: extract the text, detect the language, apply <mark>quality filters</mark> (simple rules and a classifier trained to recognize good text), then <mark>dedup</mark>: remove exact and near-duplicate documents, because repeated text gets memorized and wastes compute.</p>'+
         '<p>Example: if only about 10% of the raw tokens survive, getting 1.4T clean tokens (as in Chinchilla) needs about 14T raw tokens. Finally the sources are <mark>mixed</mark> with weights: in GPT-3 Wikipedia was seen about 3.4 times, while filtered Common Crawl was seen less than once.</p>')),
 q:[
   CQ("ليه بنعمل deduplication على بيانات الـ pretraining؟","Why do we deduplicate pretraining data?",
      [["علشان نصغّر الـ vocabulary","To shrink the vocabulary"],["النص المتكرر بيتحفظ (memorization) وبيضيّع حساب على نفس المحتوى","Repeated text gets memorized and wastes compute on the same content"],["علشان نحوّل النص لـ labels","To turn the text into labels"],["علشان نزوّد عدد الـ parameters","To increase the number of parameters"]],
      1,"المستندات المتكررة بتخلي الموديل يحفظ بدل ما يعمّم، وبتاخد جزء من الحساب على محتوى مكرر.","Repeated documents make the model memorize instead of generalize, and they use part of the compute on repeated content."),
   CQ("عايزين 2T token نضيف، ونسبة اللي بيعدي من الفلترة حوالي 10%. محتاجين كام token خام؟","We want 2T clean tokens, and about 10% of the raw tokens survive filtering. How many raw tokens do we need?",
      [["200B","200B"],["2.2T","2.2T"],["200T","200T"],["20T","20T"]],
      3,"2T / 0.10 = 20T token خام.","2T / 0.10 = 20T raw tokens.")
 ],
 f:[
   CF("إيه مراحل تنضيف بيانات الـ pretraining؟","What are the stages of cleaning pretraining data?",
      "استخراج النص، تحديد اللغة، فلاتر جودة (قواعد + classifier)، dedup (مطابق وشبه مطابق)، وبعدها خلط المصادر بأوزان.","Extract the text, detect the language, apply quality filters (rules + a classifier), dedup (exact and near-duplicate), then mix the sources with weights."),
   CF("إيه هو الـ data mixture وليه بنستخدمه؟","What is the data mixture and why do we use it?",
      "أوزان للمصادر: المصادر عالية الجودة زي Wikipedia بتتشاف أكتر من مرة والـ crawl الخام أقل. في GPT-3 ويكيبيديا حوالي 3.4 مرة وCommon Crawl المفلتر 0.44.","Weights for the sources: high-quality sources such as Wikipedia are seen more than once and the raw crawl less. In GPT-3 Wikipedia was seen about 3.4 times and filtered Common Crawl 0.44.")
 ],
 terms:[
   {t:B("Common Crawl","Common Crawl"),
    d:B("أرشيف ضخم مفتوح من صفحات الويب، بيتستخدم كمصدر رئيسي لبيانات الـ pretraining.","A huge open archive of web pages, used as a main source of pretraining data.")},
   {t:B("Quality filtering","Quality filtering"),
    d:B("إزالة النص الضعيف من الـ crawl بقواعد بسيطة و classifier متدرّب يميّز النص الكويس.","Removing weak text from the crawl using simple rules and a classifier trained to recognize good text.")},
   {t:B("Deduplication","Deduplication"),
    d:B("حذف المستندات المتطابقة وشبه المتطابقة علشان الموديل ما يحفظش المكرر.","Removing exact and near-duplicate documents so the model does not memorize repeated text.")},
   {t:B("Data mixture","Data mixture"),
    d:B("الأوزان اللي بنختار بيها المصادر المختلفة وقت التدريب.","The weights with which the different sources are sampled during training.")}
 ]},

{id:"l9-ftvsicl",t:B("Fine-tuning مقابل in-context learning","Fine-tuning versus in-context learning"),
 b:cat(B('<p>بعد الـ pretraining فيه طريقتين نستخدم بيهم الموديل في مهمة:</p>'+
         '<p>1. <mark>Fine-tuning</mark>: نكمّل تدريب الموديل (كل الأوزان أو جزء منها) على أمثلة المهمة المعنونة. بيدي أداء عالي، بس محتاج بيانات معنونة ونسخة من الموديل لكل مهمة.<br>2. <mark>In-context learning (ICL)</mark>: نكتب في الـ prompt وصف المهمة ومعاه أمثلة، والموديل يكمّل، <mark>من غير ما أي وزن يتغير</mark>.</p>',
         '<p>After pretraining there are two ways to use the model for a task:</p>'+
         '<p>1. <mark>Fine-tuning</mark>: continue training the model (all weights or some) on labeled examples of the task. It gives high accuracy, but needs labeled data and a copy of the model for each task.<br>2. <mark>In-context learning (ICL)</mark>: we write in the prompt a description of the task with examples, and the model continues, <mark>without any weight changing</mark>.</p>'),
       FIG_ICL,
       B('<p>أنواع الـ ICL: <mark>zero-shot</mark> (وصف المهمة بس)، و<mark>one-shot</mark> (مثال واحد)، و<mark>few-shot</mark> (أمثلة كتير، في GPT-3 عادة من 10 لـ 100). GPT-3 (2020) أثبت إن الأداء بيتحسن مع حجم الموديل ومع عدد الأمثلة في الـ prompt.</p>'+
         '<p>متى نستخدم إيه؟ <mark>ICL</mark>: سريع ومن غير تدريب، مناسب لما البيانات قليلة أو المهام كتير ومتغيرة. عيوبه: الأمثلة بتاكل من طول السياق وبتتكرر في كل طلب، والنتيجة حساسة لصياغة الـ prompt وترتيب الأمثلة. <mark>Fine-tuning</mark>: أدق في مهمة محددة لما يبقى فيه بيانات كفاية، وبيقصّر الـ prompt، بس محتاج تدريب وصيانة.</p>'+
         '<p>والاتنين بيتكاملوا: النماذج الحديثة بتتدرب بعد الـ pretraining على اتباع التعليمات (المحاضرة 10)، وده بيحسّن الـ ICL جدًا.</p>',
         '<p>Types of ICL: <mark>zero-shot</mark> (task description only), <mark>one-shot</mark> (one example), and <mark>few-shot</mark> (many examples, usually 10 to 100 in GPT-3). GPT-3 (2020) showed that performance improves with model size and with the number of examples in the prompt.</p>'+
         '<p>When to use which? <mark>ICL</mark>: fast and training-free, suited to little data or many changing tasks. Drawbacks: the examples eat context length and are repeated in every request, and the result is sensitive to the prompt wording and example order. <mark>Fine-tuning</mark>: more accurate on one specific task when there is enough data, and it shortens the prompt, but it needs training and maintenance.</p>'+
         '<p>The two complement each other: modern models are trained after pretraining to follow instructions (lecture 10), which greatly improves ICL.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين fine-tuning و in-context learning؟","What is the main difference between fine-tuning and in-context learning?",
      [["الـ ICL محتاج بيانات معنونة أكتر","ICL needs more labeled data"],["الـ fine-tuning بيغيّر أوزان الموديل، والـ ICL بيسيبها والأمثلة في الـ prompt","Fine-tuning changes the model weights; ICL leaves them and puts the examples in the prompt"],["مفيش فرق في النتيجة أبدًا","There is never a difference in results"],["الـ fine-tuning بيشتغل من غير pretraining بس","Fine-tuning only works without pretraining"]],
      1,"الـ ICL بيتعلّم المهمة وقت الاستدعاء من الأمثلة في الـ prompt، من غير gradient descent.","ICL picks up the task at call time from the examples in the prompt, with no gradient descent."),
   CQ("prompt فيه 20 مثال، كل مثال 100 token، وبعتّ 1000 طلب. كام token زيادة بسبب الأمثلة بس؟","A prompt has 20 examples of 100 tokens each, and you send 1000 requests. How many extra tokens come from the examples alone?",
   [["2M token","2M tokens"],["2K token","2K tokens"],["100K token","100K tokens"],["20M token","20M tokens"]],
   0,"20 × 100 = 2000 token في كل طلب، × 1000 طلب = 2,000,000 (2M). الأمثلة بتتكرر في كل طلب.","20 × 100 = 2000 tokens per request, × 1000 requests = 2,000,000 (2M). The examples are repeated in every request.")
 ],
 f:[
   CF("إيه الفرق بين zero-shot و one-shot و few-shot؟ ومتى نختار ICL؟","What are zero-shot, one-shot and few-shot, and when do we choose ICL?",
      "zero-shot: وصف بس، one-shot: مثال واحد، few-shot: أمثلة كتير في الـ prompt. ICL مناسب لما البيانات قليلة والمهام متغيرة، و fine-tuning لما نحتاج دقة أعلى في مهمة ثابتة.","Zero-shot: description only; one-shot: one example; few-shot: many examples in the prompt. ICL suits little data and changing tasks; fine-tuning suits higher accuracy on a fixed task."),
   CF("إيه عيوب الـ ICL؟","What are the drawbacks of ICL?",
   "الأمثلة بتاكل من طول السياق وبتتكرر في كل طلب، والنتيجة حساسة لصياغة الـ prompt وترتيب الأمثلة.","The examples eat context length and are repeated in every request, and the result is sensitive to the prompt wording and example order.")
 ],
 terms:[
   
   {t:B("In-context learning (ICL)","In-context learning (ICL)"),
    d:B("نكتب وصف المهمة وأمثلة في الـ prompt والموديل يكمّل، من غير ما أي وزن يتغير.","We write the task description and examples in the prompt and the model continues, with no weight changing.")},
   {t:B("Zero-shot","Zero-shot"),
    d:B("الـ prompt فيه وصف المهمة بس، من غير أمثلة.","The prompt holds only the task description, with no examples.")},
   {t:B("One-shot","One-shot"),
    d:B("الـ prompt فيه مثال واحد.","The prompt holds one example.")},
   {t:B("Few-shot prompting","Few-shot prompting"),
 d:B("بنحط k أمثلة محلولة في الـ prompt قبل المدخل الحقيقي (في GPT-3 عادة من 10 لـ 100).","We put k solved examples in the prompt before the real input (usually 10 to 100 in GPT-3).")},
   {t:B("Prompt","Prompt"),
    d:B("النص اللي بندّيه للموديل: وصف المهمة وأمثلة لو فيه.","The text we give the model: the task description and examples if any.")}
 ]},

{id:"l9-recap",t:B("Recap: ملخص المحاضرة 9","Recap: lecture 9 summary"),
 b:B('<p><mark>5 نقاط:</mark><br>1. الـ pretraining تعلّم self-supervised لتمثيلات contextual من نص ضخم من غير labels، وبعدين نكيّف الموديل للمهمة.<br>2. تلات معماريات: encoder (BERT، MLM، الاتجاهين)، decoder (GPT، الكلمة التالية، causal mask)، encoder-decoder (T5، span corruption).<br>3. الـ loss بينزل بـ power law مع N و D و C، و Chinchilla بتقول حوالي 20 token لكل parameter.<br>4. جودة البيانات (فلترة، dedup، mixture) ووصفة التدريب (RoBERTa) بيفرقوا زي الحجم.<br>5. الـ fine-tuning بيغيّر الأوزان، والـ ICL لأ، والـ distillation بيضغط teacher في student.</p>'+
       '<div class="m">MLM: loss = - sum over masked i of log P(x_i | unmasked words)\nCLM: loss = - sum_t log P(x_t | x_1, ..., x_(t-1))\nScaling: L(N) = (N_c / N) ^ alpha_N,   C = 6 * N * D\nDistill: loss = a * CE + (1 - a) * T^2 * KL(teacher || student)</div>'+
       '<p>قبل المحاضرة 10: الموديل المتدرّب بس بيكمّل النص. المحاضرة 10 بتشرح إزاي النماذج الحديثة بتتدرب بعد كده على اتباع التعليمات.</p>',
       '<p><mark>Five points:</mark><br>1. Pretraining is self-supervised learning of contextual representations from huge unlabeled text, then we adapt the model to the task.<br>2. Three architectures: encoder (BERT, MLM, both directions), decoder (GPT, next word, causal mask), encoder-decoder (T5, span corruption).<br>3. The loss falls as a power law in N, D and C, and Chinchilla says about 20 tokens per parameter.<br>4. Data quality (filtering, dedup, mixture) and the training recipe (RoBERTa) matter as much as size.<br>5. Fine-tuning changes the weights, ICL does not, and distillation squeezes a teacher into a student.</p>'+
       '<div class="m">MLM: loss = - sum over masked i of log P(x_i | unmasked words)\nCLM: loss = - sum_t log P(x_t | x_1, ..., x_(t-1))\nScaling: L(N) = (N_c / N) ^ alpha_N,   C = 6 * N * D\nDistill: loss = a * CE + (1 - a) * T^2 * KL(teacher || student)</div>'+
       '<p>Before lecture 10: a pretrained model only continues text. Lecture 10 covers how modern models are trained afterwards to follow instructions.</p>'),
 q:[
   CQ("أنهي موديل بيستخدم span corruption كهدف pretraining؟","Which model uses span corruption as its pretraining objective?",
      [["BERT","BERT"],["GPT","GPT"],["word2vec","word2vec"],["T5","T5"]],
      3,"T5 (encoder-decoder) بيبدّل الـ spans بـ sentinels والـ decoder بيولّد المحذوف.","T5 (an encoder-decoder) replaces spans with sentinels and the decoder generates the missing parts."),
   CQ("موديل 7B اتدرّب على 140B token. حسب C = 6 * N * D، حوالي كام FLOPs؟","A 7B model was trained on 140B tokens. By C = 6 * N * D, about how many FLOPs?",
      [["6e20","6e20"],["6e21","6e21"],["6e22","6e22"],["1e21","1e21"]],
      1,"6 × 7e9 × 1.4e11 = 5.88e21، يعني حوالي 6e21. (وده كمان 20 token لكل parameter.)","6 × 7e9 × 1.4e11 = 5.88e21, so about 6e21. (This is also 20 tokens per parameter.)")
 ],
 f:[
   CF("لخّص التلات معماريات وهدف كل واحدة.","Summarize the three architectures and the objective of each.",
      "Encoder (BERT): يتنبأ بكلمات مخفية من الاتجاهين. Decoder (GPT): يتنبأ بالكلمة التالية بـ causal mask. Encoder-decoder (T5): يولّد الأجزاء المحذوفة (span corruption).","Encoder (BERT): predicts hidden words from both directions. Decoder (GPT): predicts the next word with a causal mask. Encoder-decoder (T5): generates the dropped spans (span corruption)."),
   CF("إيه اللي لازم تعرفه قبل المحاضرة 10؟","What should you know before lecture 10?",
      "الموديل المتدرّب بس بيكمّل النص ومش بيتّبع التعليمات. المحاضرة 10 بتشرح تدريبه بعد الـ pretraining على اتباع التعليمات.","A pretrained model only continues text and does not follow instructions. Lecture 10 covers how it is trained after pretraining to follow instructions.")
 ]}
]}
);

})();
