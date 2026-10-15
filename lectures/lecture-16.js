/* Lecture 16: Multimodal & Vision-Language
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L16 fig: every modality becomes a sequence of vectors */
function l16ModFig(){
  var R=[['image','continuous pixels','ViT encoder'],['text','discrete tokens','embed table'],['audio','waveform samples','audio encoder']],s='',i,y;
  s+=T(60,14,'input','tm','middle','font-size:10px')+T(200,14,'encoder','tm','middle','font-size:10px')+T(314,14,'output','tm','middle','font-size:10px');
  for(i=0;i<3;i++){
    y=24+i*56;
    s+=RECT(10,y,100,40,'var(--sf)','var(--ln)',6,1.4)+T(60,y+17,R[i][0],'tb','middle','font-size:11px')+T(60,y+31,R[i][1],'tm','middle','font-size:9px');
    s+=AL(112,y+20,148,y+20,'mu','mM');
    s+=RECT(150,y,100,40,'var(--sf)','var(--ln)',6,1.4)+T(200,y+24,R[i][2],'tm','middle','font-size:10.5px');
    s+=AL(252,y+20,276,y+20,'ac','mA');
    s+=RECT(278,y,72,40,'var(--acs)','var(--ac)',6,1.4)+T(314,y+17,'vectors','tb','middle','font-size:10.5px')+T(314,y+31,'size d','tm','middle','font-size:9.5px');
  }
  s+=T(180,196,'same size d for all, then one Transformer','tb','middle','font-size:10.5px;fill:var(--ok)');
  return s;
}

var FIG_L16_MOD=fig(208,l16ModFig(),
  B('كل modality بيعدّي على encoder يطلّعله sequence من vectors بنفس البُعد d. بعد كده نفس الـ Transformer بيقرا الكل.',
    'Each modality passes through an encoder that outputs a sequence of vectors of the same size d. After that, the same Transformer reads them all.'));

/* L16 fig: ViT patches */
function l16PatchFig(){
  var s='',i,j,n=0,x,y,L=['CLS','p1','p2','p3','...','p196'];
  s+=T(10,14,'image','tm','start','font-size:10px');
  for(i=0;i<4;i++)for(j=0;j<4;j++){
    n++;x=16+j*22;y=22+i*22;
    s+=RECT(x,y,22,22,n===1?'var(--ac)':'var(--acs)','var(--ln)',0,1.2)+T(x+11,y+15,String(n),n===1?'tb':'tm','middle','font-size:9.5px'+(n===1?';fill:var(--bg)':''));
  }
  s+=AL(108,66,148,66,'ac','mA');
  s+=RECT(152,32,198,22,'var(--sf)','var(--ln)',5,1.2)+T(251,47,'16 x 16 x 3 = 768 numbers','tm','middle','font-size:10px');
  s+=AL(251,55,251,70,'mu','mM');
  s+=RECT(152,72,198,22,'var(--acs)','var(--ln)',5,1.2)+T(251,87,'linear: 768 -> d','tb','middle','font-size:10px');
  s+=T(10,126,'one token per patch, plus position embeddings','tm','start','font-size:10px');
  for(i=0;i<6;i++){
    x=10+i*57;
    s+=RECT(x,134,52,26,i===0?'var(--okbg)':'var(--acs)',i===0?'var(--ok)':'var(--ln)',5,1.3)+T(x+26,151,L[i],'tb','middle','font-size:10.5px');
  }
  s+=AL(180,162,180,176,'mu','mM');
  s+=RECT(10,178,340,26,'var(--sf)','var(--ac)',6,1.5)+T(180,195,'Transformer encoder (as in lecture 8)','tb','middle','font-size:10.5px');
  return s;
}

var FIG_L16_PATCH=fig(216,l16PatchFig(),
  B('الصورة بتتقسّم لـ patches. كل patch بيتفرد ويتضرب في مصفوفة فيبقى token، وبنضيف [CLS] وposition embeddings، وبعدين Transformer encoder عادي.',
    'The image is cut into patches. Each patch is flattened and multiplied by a matrix to become a token, we add [CLS] and position embeddings, and then a regular Transformer encoder runs.'));

/* L16 fig: CLIP similarity matrix */
function l16ClipFig(){
  var CAP=['a dog','a car','the sea','a cake'],V=[[0.9,0.2,0.1,0.3],[0.1,0.8,0.2,0.1],[0.3,0.1,0.9,0.2],[0.2,0.2,0.1,0.8]];
  var s='',c=40,x0=84,y0=56,i,j,cx,x,y;
  for(i=0;i<4;i++){
    cx=x0+i*c+c/2;
    s+='<text x="'+cx+'" y="'+(y0-8)+'" class="t tm" style="font-size:11px" transform="rotate(-35 '+cx+' '+(y0-8)+')">'+CAP[i]+'</text>';
    s+=T(x0-8,y0+i*c+c/2+4,'img '+(i+1),'tm','end','font-size:11px');
  }
  for(i=0;i<4;i++)for(j=0;j<4;j++){
    x=x0+j*c;y=y0+i*c;
    s+=RECT(x,y,c,c,'var(--sf)','var(--ln)',0,1);
    s+='<rect x="'+x+'" y="'+y+'" width="'+c+'" height="'+c+'" style="fill:var(--'+(i===j?'ok':'no')+');fill-opacity:'+(i===j?0.5:0.16)+'"/>';
    s+=T(x+c/2,y+c/2+4.5,V[i][j].toFixed(1),i===j?'tb':'tm','middle');
  }
  s+=T(180,238,'diagonal: matching pairs (pull together)','tb','middle','font-size:10px;fill:var(--ok)');
  s+=T(180,254,'the rest: negatives (push apart)','tb','middle','font-size:10px;fill:var(--no)');
  return s;
}

var FIG_L16_CLIP=fig(266,l16ClipFig(),
  B('مصفوفة التشابه بين 4 صور و4 captions. القطر هو الأزواج الصح ونزوّد قيمته، وباقي الخانات negatives ونقلّل قيمتها. الأرقام للتوضيح بس.',
    'The similarity matrix between 4 images and 4 captions. The diagonal holds the matching pairs and we raise it, and the other cells are negatives and we lower them. The numbers are only illustrative.'));

/* L16 fig: vision encoder + projector + LLM */
function l16LlavaFig(){
  var s='';
  s+=T(136,14,'frozen','tm','middle','font-size:9.5px')+T(242,14,'trained','tb','middle','font-size:9.5px;fill:var(--ok)');
  s+=RECT(10,22,64,34,'var(--sf)','var(--ln)',6,1.4)+T(42,43,'image','tb','middle','font-size:10.5px');
  s+=AL(74,39,90,39,'mu','mM');
  s+=RECT(92,22,88,34,'var(--sf)','var(--ln)',6,1.4)+T(136,43,'ViT encoder','tm','middle','font-size:10.5px');
  s+=AL(180,39,196,39,'mu','mM');
  s+=RECT(198,22,88,34,'var(--okbg)','var(--ok)',6,1.4)+T(242,43,'projector','tb','middle','font-size:10.5px');
  s+=AL(242,57,242,96,'ac','mA');
  s+=RECT(10,98,170,28,'var(--sf)','var(--ln)',6,1.4)+T(95,116,'text tokens (prompt)','tm','middle','font-size:10.5px');
  s+=RECT(184,98,166,28,'var(--acs)','var(--ac)',6,1.4)+T(267,116,'visual tokens x 576','tb','middle','font-size:10.5px');
  s+=AL(95,127,95,150,'mu','mM')+AL(267,127,267,150,'mu','mM');
  s+=RECT(10,152,340,34,'var(--sf)','var(--ac)',6,1.6)+T(180,173,'LLM (decoder Transformer)','tb','middle','font-size:11px');
  s+=AL(180,187,180,206,'ok','mG');
  s+=T(180,222,'answer text','tb','middle','font-size:11px;fill:var(--ok)');
  return s;
}

var FIG_L16_LLAVA=fig(232,l16LlavaFig(),
  B('الـ ViT بيطلّع features للصورة، والـ projector بيحوّلها لـ visual tokens بنفس بُعد الـ LLM، وبتتحط مع tokens السؤال في sequence واحدة.',
    'The ViT outputs features for the image, the projector turns them into visual tokens of the LLM embedding size, and they sit with the question tokens in a single sequence.'));

/* L16 fig: diffusion forward and reverse */
function l16DiffFig(){
  var s='',k,d,px,rx,ry,N=[0,12,26,44,64],O=[1,0.78,0.52,0.26,0],LB=['x_0','x_1','...','x_T-1','x_T'];
  function rnd(n){return ((n*9301+49297)%233280)/233280;}
  s+=T(180,12,'forward: add noise (fixed, no learning)','tm','middle','font-size:10px');
  s+=AL(14,22,346,22,'mu','mM');
  for(k=0;k<5;k++){
    px=10+k*70;
    s+=RECT(px,36,52,52,'var(--sf)','var(--ln)',4,1.3);
    s+='<circle cx="'+(px+26)+'" cy="62" r="15" style="fill:var(--ac);fill-opacity:'+O[k]+'"/>';
    for(d=0;d<N[k];d++){
      rx=px+3+Math.floor(rnd(k*97+d*13+1)*45);
      ry=39+Math.floor(rnd(k*57+d*29+7)*45);
      s+='<rect x="'+rx+'" y="'+ry+'" width="3" height="3" style="fill:var(--mu);fill-opacity:0.7"/>';
    }
    s+=T(px+26,101,LB[k],'tm','middle','font-size:10px');
  }
  s+=AL(346,112,14,112,'ok','mG');
  s+=T(180,128,'reverse: the network removes noise step by step (learned)','tb','middle','font-size:9.5px;fill:var(--ok)');
  s+=T(180,150,'train: predict the noise that was added','tb','middle','font-size:10.5px');
  s+=T(180,166,'loss = || eps - eps_theta(x_t, t, text) ||^2','tm','middle','font-size:10px');
  return s;
}

var FIG_L16_DIFF=fig(178,l16DiffFig(),
  B('في الـ forward بنضيف ضجيج على الصورة لحد ما تبقى ضجيج خالص. الشبكة بتتعلم تعمل العكس: تتنبأ بالضجيج وتشيله خطوة خطوة.',
    'In the forward direction we add noise to the image until it is pure noise. The network learns to do the reverse: predict the noise and remove it step by step.'));

/* L16 fig: visual token budget (log scale) */
function l16TokFig(){
  var R=[['one sentence',20,'ok','~20'],['one image',576,'ac','576'],['10 s video',5760,'ac','5,760'],['60 s video',34560,'no','34,560']],s='',i,y,w,xe,v,TK=[1,10,100,1000,10000,100000],TL=['1','10','100','1k','10k','100k'];
  function X(n){return 120+Math.log(n)/Math.LN10/5*220;}
  for(i=0;i<6;i++){
    s+='<line x1="'+X(TK[i]).toFixed(1)+'" y1="20" x2="'+X(TK[i]).toFixed(1)+'" y2="158" style="stroke:var(--ln);stroke-width:1;stroke-dasharray:3 4"/>';
    s+=T(X(TK[i]),174,TL[i],'tm','middle','font-size:9.5px');
  }
  for(i=0;i<4;i++){
    y=28+i*32;
    xe=X(R[i][1]);w=Math.round(xe-120);
    s+=T(10,y+14,R[i][0],'tb','start','font-size:10.5px');
    s+=RECT(120,y,w,20,'var(--'+R[i][2]+')','none',4,1);
    if(w>90)s+=T(xe-6,y+14,R[i][3],'tb','end','font-size:10px;fill:var(--bg)');
    else s+=T(xe+6,y+14,R[i][3],'tb','start','font-size:10px');
  }
  s+='<line x1="120" y1="158" x2="340" y2="158" style="stroke:var(--mu);stroke-width:1.4"/>';
  s+=T(230,192,'tokens in the sequence (log scale)','tm','middle','font-size:10px');
  s+=T(10,192,'1 fps, 576 per frame','tm','start','font-size:9px');
  return s;
}

var FIG_L16_TOK=fig(200,l16TokFig(),
  B('عدد الـ tokens بالمقياس اللوغاريتمي. الصورة الواحدة بـ 576 token، والفيديو بيضرب العدد في عدد الـ frames. (فيديو بمعدل frame في الثانية و576 token لكل frame.)',
    'Token counts on a log scale. One image is 576 tokens, and video multiplies the count by the number of frames. (Video at one frame per second and 576 tokens per frame.)'));

/* L16 fig: patch size vs number of tokens and attention entries */
function l16PsizeFig(){
  var R=[['P = 32',49,'2,401','ac'],['P = 16',196,'38,416','ac'],['P = 8',784,'614,656','no']],s='',i,y,w,xe;
  s+=T(180,14,'224 x 224 image: patch size vs tokens','tm','middle','font-size:10px');
  for(i=0;i<3;i++){
    y=26+i*46;
    w=Math.max(6,Math.round(R[i][1]/784*200));xe=62+w;
    s+=T(10,y+14,R[i][0],'tb','start','font-size:10.5px');
    s+=RECT(62,y,w,20,'var(--'+R[i][3]+')','none',4,1);
    s+=T(xe+6,y+14,R[i][1]+' tokens','tb','start','font-size:10px');
    s+=T(62,y+35,'attention: '+R[i][1]+' x '+R[i][1]+' = '+R[i][2],'tm','start','font-size:9.5px');
  }
  return s;
}

var FIG_L16_PSIZE=fig(166,l16PsizeFig(),
  B('كل مرة بنقسم حجم الـ patch على 2: الـ tokens بتزيد 4 أضعاف، وحجم الـ attention matrix بيزيد 16 ضعف. (من غير [CLS] للتبسيط.)',
    'Each time the patch size is halved, the tokens grow 4 times and the attention matrix grows 16 times. (Without [CLS], for simplicity.)'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:16,t:B("Multimodal و Vision-Language","Multimodal & Vision-Language"),cards:[

{id:"l16-why",t:B("ليه multimodal وإيه المشكلة","Why multimodal, and what is the problem"),
 b:cat(B('<p>الموديلات اللي شفناها لحد دلوقتي بتقرا <mark>نص بس</mark>. بس الدنيا مش نص: screenshot لخطأ في برنامج، رسم بياني في تقرير، روشتة مكتوبة بخط اليد، صورة منتج. لو الموديل يقرا الحاجات دي مع النص، بيحل مهام أكتر بكتير. وفي كمان فكرة <mark>grounding</mark>: ربط الكلمات بالحاجات الحقيقية اللي بتشاور عليها، لأن كلمة زي "أحمر" أو "فوق" معناها مرتبط بالإدراك البصري مش بالنص لوحده.</p>'+
         '<p>الـ <mark>modality</mark> هي نوع البيانات: نص، صورة، صوت، فيديو. والتحدي إن النص <mark>منفصل (discrete)</mark>: كل token رقم من vocabulary محدودة، وبنجيب الـ embedding بتاعه من جدول. أما الصورة فهي شبكة من قيم <mark>مستمرة (continuous)</mark>، ومفيش "كلمات" جاهزة فيها.</p>',
         '<p>The models we have seen so far read <mark>text only</mark>. But the world is not text: a screenshot of a program error, a chart in a report, a handwritten prescription, a product photo. If a model can read these along with text, it solves far more tasks. There is also the idea of <mark>grounding</mark>: tying words to the real things they point at, because a word like "red" or "above" is tied to visual perception, not to text alone.</p>'+
         '<p>A <mark>modality</mark> is a type of data: text, image, audio, video. The challenge is that text is <mark>discrete</mark>: each token is a number from a finite vocabulary, and we fetch its embedding from a table. An image is a grid of <mark>continuous</mark> values, and it has no ready-made "words".</p>'),
       FIG_L16_MOD,
       B('<p>الفكرة العامة اللي هتتكرر في المحاضرة كلها: <mark>نحوّل كل modality لـ sequence of vectors</mark> بنفس البُعد d، وندّيها لنفس الـ Transformer من غير تغيير في المعمارية. الاختلاف بين الموديلات هو في ثلاث حاجات: إزاي نعمل الـ encoder، وإزاي نربط الـ vectors دي باللغة، وإزاي نولّد صور.</p>',
         '<p>The general idea that repeats through the whole lecture: <mark>turn every modality into a sequence of vectors</mark> of the same size d, and feed them to the same Transformer with no change to the architecture. Models differ in three things: how we build the encoder, how we connect these vectors to language, and how we generate images.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين النص والصورة من ناحية الـ tokens؟","What is the key difference between text and an image in terms of tokens?",
   [["النص مستمر والصورة منفصلة","Text is continuous and an image is discrete"],
    ["النص tokens منفصلة من vocabulary محدودة، والصورة قيم مستمرة ومفيهاش كلمات جاهزة","Text is discrete tokens from a finite vocabulary, while an image is continuous values with no ready-made words"],
    ["مفيش فرق، الاتنين بيتحوّلوا بنفس الجدول","There is no difference, both are converted by the same table"],
    ["الصورة دايمًا أقصر من النص","An image is always shorter than text"]],
   1,"كل token في النص رقم من vocabulary محدودة وله embedding في جدول. أما الصورة فشبكة قيم مستمرة.","Each text token is a number from a finite vocabulary with an embedding in a table. An image is a grid of continuous values."),
CQ("عايز تدّي نفس الـ Transformer صورة وصوت ونص. إيه اللي بنغيّره؟","You want to feed the same Transformer an image, audio and text. What do we change?",
   [["بنحوّل الصورة والصوت لنص الأول","We first turn the image and audio into text"],
    ["بنعامل كل رقم في الصورة كأنه token","We treat every number in the image as a token"],
    ["الـ encoder بس: لكل modality encoder يطلّع vectors بنفس البُعد d","Only the encoder: each modality gets an encoder that outputs vectors of the same size d"],
    ["معمارية الـ Transformer لكل modality","The Transformer architecture for each modality"]],
   2,"الـ Transformer بيفضل زي ما هو، والاختلاف في الـ encoder اللي بيحوّل المدخل لـ vectors.","The Transformer stays as it is, and the difference is in the encoder that turns the input into vectors.")
 ],
 f:[
   CF("إزاي بنخلّي الـ Transformer يتعامل مع الصور والصوت؟","How do we make a Transformer work with images and audio?",
      "بنحوّل كل modality لـ sequence من vectors بنفس البُعد d، وبعدين ندّيها لنفس الـ Transformer. الاختلاف في إزاي نعمل الـ encoder، وإزاي نربطه باللغة (CLIP أو LLM)، وإزاي نولّد صور (diffusion).","We turn each modality into a sequence of vectors of the same size d and then feed it to the same Transformer. The differences are how we build the encoder, how we connect it to language (CLIP or an LLM), and how we generate images (diffusion)."),
   CF("إيه الفرق بين الـ discrete والـ continuous modality؟","What is the difference between a discrete and a continuous modality?",
   "النص discrete: كل token رقم من vocabulary محدودة وله embedding في جدول. الصورة continuous: شبكة قيم مستمرة ومفيش فيها كلمات جاهزة.","Text is discrete: each token is a number from a finite vocabulary with an embedding in a table. An image is continuous: a grid of continuous values with no ready-made words."),
CF("يعني إيه grounding؟","What is grounding?",
   "ربط الكلمات بالحاجات الحقيقية اللي بتشاور عليها، لأن معنى كلمة زي أحمر أو فوق مرتبط بالإدراك البصري مش بالنص لوحده.","Tying words to the real things they point at, because the meaning of a word like red or above is tied to visual perception, not to text alone.")
 ],
 terms:[
   {t:B("Modality","Modality"),
 d:B("نوع البيانات: نص أو صورة أو صوت أو فيديو.","A type of data: text, image, audio or video.")},
{t:B("Grounding","Grounding"),
 d:B("ربط الكلمات بالحاجات الحقيقية اللي بتشاور عليها، زي الإدراك البصري.","Tying words to the real things they point at, such as through visual perception.")},
{t:B("Discrete vs continuous data","Discrete vs continuous data"),
 d:B("النص discrete (tokens من vocabulary محدودة). الصورة والصوت continuous (قيم مستمرة).","Text is discrete (tokens from a finite vocabulary). Images and audio are continuous (real-valued).")}
 ]},

{id:"l16-pixels",t:B("كام رقم في الصورة والصوت، وخريطة المحاضرة","How many numbers in an image or audio, and the lecture map"),
 b:cat(B('<p>صورة <code>224 × 224</code> بـ 3 قنوات لون فيها <code>224 × 224 × 3 = 150,528</code> رقم. وأغلبها <mark>redundant</mark> لأن البكسلات المتجاورة شبه بعض. والصوت أسوأ: 16,000 قياس في الثانية الواحدة. لو عاملنا كل رقم كأنه token، الـ self-attention (تكلفتها بتزيد بتربيع الطول، محاضرة 8) هتنفجر.</p>'+
         '<p>بالأرقام: لو الـ <code>150,528</code> رقم اللي في الصورة بقوا tokens، الـ attention هتحسب <code>150,528² ≈ 22.7</code> مليار score لكل head في كل layer. والصوت كمان: 5 ثواني بس هي <code>5 × 16,000 = 80,000</code> رقم، يعني <code>80,000² = 6.4</code> مليار. أما صورة في ViT فهي <code>197² ≈ 38,800</code> بس (في الكارت اللي بعده).</p>'+
         '<p>خريطة المحاضرة:<br>• كروت 3–4: <mark>ViT</mark> بيحوّل الصورة لـ tokens.<br>• كروت 5–6: <mark>CLIP</mark> بيربط الصورة والنص في فضاء واحد.<br>• كروت 7–8: توصيل الـ vision encoder بـ <mark>LLM</mark> (زي LLaVA).<br>• كروت 9–10: <mark>diffusion</mark> لتوليد الصور.<br>• كروت 11–12: التقييم والأخطاء الشائعة والتكلفة.<br>• كارت 13: الـ Recap.</p>',
         '<p>A <code>224 × 224</code> image with 3 color channels holds <code>224 × 224 × 3 = 150,528</code> numbers. Most of them are <mark>redundant</mark> because neighboring pixels look alike. Audio is worse: 16,000 samples per second. If we treated every number as a token, self-attention (whose cost grows with the square of the length, lecture 8) would blow up.</p>'+
         '<p>In numbers: if the <code>150,528</code> numbers of the image became tokens, attention would compute <code>150,528² ≈ 22.7</code> billion scores per head in every layer. Audio is similar: just 5 seconds is <code>5 × 16,000 = 80,000</code> numbers, which gives <code>80,000² = 6.4</code> billion. A ViT image, by comparison, is only <code>197² ≈ 38,800</code> (in the next card).</p>'+
         '<p>The map of the lecture:<br>• Cards 3–4: <mark>ViT</mark> turns an image into tokens.<br>• Cards 5–6: <mark>CLIP</mark> links image and text in one space.<br>• Cards 7–8: connecting a vision encoder to an <mark>LLM</mark> (like LLaVA).<br>• Cards 9–10: <mark>diffusion</mark> for generating images.<br>• Cards 11–12: evaluation, common failures and cost.<br>• Card 13: the recap.</p>')),
 q:[
   CQ("صورة RGB حجمها 224 × 224. كام رقم فيها؟","An RGB image of size 224 × 224. How many numbers does it contain?",
      [["50,176","50,176"],["150,528","150,528"],["224","224"],["672","672"]],
      1,"224 × 224 = 50,176 بكسل، وكل بكسل فيه 3 قنوات (R وG وB)، فالمجموع 150,528 رقم.","224 × 224 = 50,176 pixels, and each pixel has 3 channels (R, G and B), so the total is 150,528 numbers."),
   CQ("5 ثواني صوت بمعدل 16,000 قياس في الثانية. كام رقم فيها؟","5 seconds of audio at 16,000 samples per second. How many numbers does it hold?",
   [["16,000","16,000"],["80,000","80,000"],["5,000","5,000"],["3,200","3,200"]],
   1,"5 × 16,000 = 80,000 رقم.","5 × 16,000 = 80,000 numbers.")
 ],
 f:[
   CF("ليه مينفعش نعامل كل رقم في الصورة كأنه token؟","Why can't we treat every number in an image as a token?",
   "لأن صورة 224 × 224 × 3 فيها 150,528 رقم أغلبها redundant، والـ self-attention تكلفتها بتزيد بتربيع الطول، فهتنفجر (حوالي 22.7 مليار score لكل head).","Because a 224 × 224 × 3 image has 150,528 numbers, mostly redundant, and self-attention cost grows with the square of the length, so it would blow up (about 22.7 billion scores per head)."),
CF("كام رقم في ثانية صوت واحدة؟","How many numbers are in one second of audio?",
   "16,000 قياس (sample) في الثانية.","16,000 samples per second.")
 ]},

{id:"l16-vit",t:B("Vision Transformer: الصورة كأنها كلمات","Vision Transformer: an image as words"),
 b:cat(B('<p>فكرة <mark>Vision Transformer (ViT)</mark> بسيطة: ماتعملش حاجة خاصة بالصور، بس <mark>قطّع الصورة لقطع (patches)</mark> وعاملها كأنها كلمات. الخطوات:<br>1. قسّم الصورة لـ patches مربعة بحجم <code>P × P</code> من غير تداخل.<br>2. افرد كل patch لـ vector طوله <code>P × P × 3</code>.<br>3. اضربه في مصفوفة (<mark>linear projection</mark>) تحوّله لبُعد d. ده بيشتغل زي الـ embedding lookup للكلمات.<br>4. ضيف <mark>position embedding</mark> متعلَّم لكل مكان، لأن الـ attention لوحدها مبتعرفش الترتيب.<br>5. حط token إضافي <mark>[CLS]</mark> في الأول (زي BERT في محاضرة 9)، وناتجه النهائي بيمثّل الصورة كلها.<br>6. مرّر الكل في <mark>Transformer encoder</mark> عادي، من غير mask، فكل patch بيشوف كل الباقي.</p>',
         '<p>The idea of the <mark>Vision Transformer (ViT)</mark> is simple: do nothing special for images, just <mark>cut the image into patches</mark> and treat them like words. The steps:<br>1. Split the image into square, non-overlapping patches of size <code>P × P</code>.<br>2. Flatten each patch into a vector of length <code>P × P × 3</code>.<br>3. Multiply it by a matrix (a <mark>linear projection</mark>) that maps it to size d. This works like the embedding lookup for words.<br>4. Add a learned <mark>position embedding</mark> for each location, because attention alone does not know order.<br>5. Put an extra <mark>[CLS]</mark> token first (like BERT in lecture 9), whose final output represents the whole image.<br>6. Run everything through a regular <mark>Transformer encoder</mark>, with no mask, so every patch sees all the others.</p>'),
       FIG_L16_PATCH,
       B('<p>الأرقام:</p>'+
         '<div class="m">N = (H / P) * (W / P)\n\n224 x 224, P = 16 : N = 14 * 14 = 196\npatch dim = 16 * 16 * 3 = 768\nsequence  = 196 + 1 (CLS) = 197 tokens</div>',
         '<p>The numbers:</p>'+
         '<div class="m">N = (H / P) * (W / P)\n\n224 x 224, P = 16 : N = 14 * 14 = 196\npatch dim = 16 * 16 * 3 = 768\nsequence  = 196 + 1 (CLS) = 197 tokens</div>')),
 q:[
   CQ("صورة 320 × 320 وPatch حجمها 16 × 16. كام patch بتطلع (من غير CLS)؟","A 320 × 320 image with 16 × 16 patches. How many patches result (not counting CLS)?",
      [["20","20"],["400","400"],["1,600","1,600"],["256","256"]],
      1,"320 / 16 = 20 في كل اتجاه، فعدد الـ patches 20 × 20 = 400.","320 / 16 = 20 in each direction, so the number of patches is 20 × 20 = 400."),
   CQ("ليه بنضيف position embedding لكل patch؟","Why do we add a position embedding to each patch?",
   [["علشان نقلّل عدد الـ patches","To reduce the number of patches"],
    ["علشان نحوّل البكسلات لـ vectors","To turn pixels into vectors"],
    ["لأن الـ attention لوحدها مبتعرفش ترتيب الـ patches","Because attention alone does not know the order of the patches"],
    ["علشان نستغنى عن [CLS]","To make [CLS] unnecessary"]],
   2,"من غير position embedding الـ Transformer هيشوف الـ patches كأنها مجموعة من غير ترتيب.","Without position embeddings the Transformer would see the patches as an unordered set.")
 ],
 f:[
   CF("إزاي ViT بيحوّل صورة لـ sequence، وليه الـ patch الأصغر أغلى؟","How does ViT turn an image into a sequence, and why is a smaller patch costlier?",
      "بيقسّمها لـ patches P × P، يفردها (P·P·3)، يعمل linear projection لبُعد d، يضيف position embeddings وtoken [CLS]، ويمرّرها لـ Transformer encoder. الـ patch الأصغر معناها tokens أكتر، والـ attention تكلفتها بتزيد بتربيع عدد الـ tokens.","It splits the image into P × P patches, flattens them (P·P·3), applies a linear projection to size d, adds position embeddings and a [CLS] token, and runs a Transformer encoder. A smaller patch means more tokens, and attention cost grows with the square of the number of tokens."),
   CF("إيه وظيفة الـ [CLS] token في ViT؟","What does the [CLS] token do in ViT?",
   "token إضافي بيتحط في أول الـ sequence، وناتجه النهائي من الـ encoder بيمثّل الصورة كلها.","An extra token placed at the start of the sequence, whose final output from the encoder represents the whole image.")
 ],
 terms:[
   {t:B("Vision Transformer (ViT)","Vision Transformer (ViT)"),
 d:B("Transformer encoder عادي بياخد الصورة كـ sequence من patches، كل patch بيتحوّل لـ token.","A regular Transformer encoder that reads an image as a sequence of patches, each patch turned into a token.")},
{t:B("Image patch","Image patch"),
 d:B("قطعة مربعة <code>P × P</code> من الصورة، بتتفرد وتتضرب في مصفوفة فتبقى token.","A square <code>P × P</code> piece of the image, flattened and multiplied by a matrix to become a token.")},
{t:B("Positional encoding","Positional encoding"),
 d:B("معلومة موضع كل كلمة بتتضاف لتمثيلها، علشان الـ self-attention يعرف الترتيب.","The position of each word, added to its representation so that self-attention can know the order.")}
 ]},

{id:"l16-vit-scale",t:B("ViT: تكلفة الـ patch ومقارنة بالـ CNN","ViT: patch cost and comparison with CNNs"),
 b:cat(B('<p>في ViT-Base الـ <code>d = 768</code> كمان، فالـ projection بتبقى <code>768 → 768</code>. وحجم الـ attention matrix هو <code>197 × 197 ≈ 38,800</code> لكل head في كل layer.</p>'+
         '<p>وده بيوضّح الـ trade-off: لو صغّرت الـ patch أو كبّرت الصورة، الـ tokens بتزيد. نفس الـ patch 16 على صورة <code>448 × 448</code> بيدّي <code>28 × 28 = 784</code> token، يعني 4 أضعاف الـ tokens و<mark>16 ضعف</mark> حجم الـ attention matrix. الـ patch الأصغر بيشوف تفاصيل أدق، بس بتكلفة أعلى.</p>',
         '<p>In ViT-Base, <code>d = 768</code> too, so the projection is <code>768 → 768</code>. And the attention matrix is <code>197 × 197 ≈ 38,800</code> entries per head in every layer.</p>'+
         '<p>This shows the trade-off: if you shrink the patch or enlarge the image, the tokens grow. The same patch 16 on a <code>448 × 448</code> image gives <code>28 × 28 = 784</code> tokens, which is 4 times the tokens and <mark>16 times</mark> the attention matrix. A smaller patch sees finer detail, but at a higher cost.</p>'),
       FIG_L16_PSIZE,
       B('<p>مقارنة بالـ CNN: الـ CNN عنده <mark>inductive bias</mark> مبني فيه (الأنماط محلية، ونفس الفلتر بيتطبّق على كل مكان). الـ ViT معندوش الافتراضات دي، فبيتعلمها من البيانات. النتيجة: على بيانات صغيرة (ImageNet-1k لوحده) الـ CNN بيكسب، لكن مع بيانات ضخمة (زي JFT-300M) الـ ViT بيلحقه ويعدّيه. وده نفس درس الـ pretraining في محاضرة 9: الحجم بيعوّض عن الافتراضات المبنية.</p>',
         '<p>Compared with a CNN: a CNN has an <mark>inductive bias</mark> built in (patterns are local, and the same filter is applied everywhere). ViT lacks these assumptions, so it learns them from data. The result: on small data (ImageNet-1k alone) the CNN wins, but with huge data (such as JFT-300M) ViT catches up and passes it. This is the same lesson as pretraining in lecture 9: scale makes up for built-in assumptions.</p>')),
 q:[
   CQ("صورة 112 × 112 وPatch حجمها 8 × 8. كام patch بتطلع؟","A 112 × 112 image with 8 × 8 patches. How many patches result?",
   [["196","196"],["784","784"],["14","14"],["49","49"]],
   0,"112 / 8 = 14 في كل اتجاه، فالعدد 14 × 14 = 196.","112 / 8 = 14 in each direction, so the count is 14 × 14 = 196."),
CQ("على بيانات صغيرة (ImageNet-1k لوحده)، مين بيكسب عادة؟","On small data (ImageNet-1k alone), who usually wins?",
   [["الـ ViT دايمًا","ViT, always"],
    ["الـ CNN، لأن عنده inductive bias مبني فيه","The CNN, because it has a built-in inductive bias"],
    ["بيتعادلوا","They tie"],
    ["مفيش مقارنة بينهم","There is no comparison between them"]],
   1,"الـ CNN عنده افتراضات (أنماط محلية، نفس الفلتر في كل مكان)، والـ ViT محتاج بيانات ضخمة علشان يتعلمها.","The CNN has built-in assumptions (local patterns, the same filter everywhere), and ViT needs huge data to learn them.")
 ],
 f:[
   CF("إيه اللي بيحصل لو صغّرنا الـ patch؟","What happens if we shrink the patch?",
   "الـ tokens بتزيد وبنشوف تفاصيل أدق، بس التكلفة بتزيد لأن الـ attention matrix بتكبر بتربيع عدد الـ tokens.","The tokens increase and we see finer detail, but the cost rises because the attention matrix grows with the square of the number of tokens."),
CF("إيه هو الـ inductive bias وإيه علاقته بـ ViT والـ CNN؟","What is inductive bias and how does it relate to ViT and CNNs?",
   "افتراضات مبنية في المعمارية. الـ CNN عنده (محلية ونفس الفلتر) فبيكسب على بيانات صغيرة، والـ ViT معندوش فبيتعلمها من بيانات ضخمة.","Assumptions built into the architecture. The CNN has them (locality and shared filters) so it wins on small data, while ViT lacks them and learns them from huge data.")
 ],
 terms:[
   {t:B("Inductive bias","Inductive bias"),
 d:B("افتراضات مبنية في المعمارية (زي إن الأنماط محلية في الـ CNN) بتساعد على التعلّم من بيانات قليلة.","Assumptions built into an architecture (such as locality in a CNN) that help it learn from little data.")}
 ]},

{id:"l16-clip",t:B("CLIP: الصورة والنص في فضاء واحد","CLIP: image and text in one space"),
 b:cat(B('<p><mark>CLIP</mark> (من OpenAI) بيتعلم من <mark>400 مليون زوج (صورة، caption)</mark> مجمّعين من الويب، من غير أي labels يدوية. فيه encoder للصورة (ViT مثلًا) و encoder للنص (Transformer). كل واحد بيطلّع vector، بنحوّلهم لنفس البُعد ونعمل لهم <mark>L2 normalization</mark>، فالـ dot product بيبقى هو الـ cosine similarity.</p>'+
         '<p>التدريب بـ <mark>contrastive loss</mark>، نفس الفكرة اللي شفناها في الـ dense retrieval (محاضرة 13). في batch فيه N زوج، بنحسب مصفوفة <code>N × N</code> من الـ similarities:</p>'+
         '<div class="m">S_ij = (v_i . t_j) / tau\n\nimage -> text (row i):\n  -log( exp(S_ii) / sum_j exp(S_ij) )\ntext -> image (column i):\n  -log( exp(S_ii) / sum_j exp(S_ji) )\n\nloss = average of both, over the batch</div>',
         '<p><mark>CLIP</mark> (from OpenAI) learns from <mark>400 million (image, caption) pairs</mark> collected from the web, with no manual labels. It has an image encoder (a ViT, for example) and a text encoder (a Transformer). Each outputs a vector, we map both to the same size and apply <mark>L2 normalization</mark>, so the dot product is the cosine similarity.</p>'+
         '<p>Training uses a <mark>contrastive loss</mark>, the same idea we saw in dense retrieval (lecture 13). For a batch of N pairs, we compute an <code>N × N</code> matrix of similarities:</p>'+
         '<div class="m">S_ij = (v_i . t_j) / tau\n\nimage -> text (row i):\n  -log( exp(S_ii) / sum_j exp(S_ij) )\ntext -> image (column i):\n  -log( exp(S_ii) / sum_j exp(S_ji) )\n\nloss = average of both, over the batch</div>'),
       FIG_L16_CLIP,
       B('<p>القطر (<code>i = j</code>) هو الأزواج الصح (positives)، وباقي المصفوفة <mark>negatives</mark>. لكل صورة فيه <code>N - 1</code> caption غلط، وفي CLIP الـ batch كان <mark>32,768</mark>، يعني كل صورة بتتقارن بـ 32,767 caption غلط في خطوة واحدة.</p>',
         '<p>The diagonal (<code>i = j</code>) holds the correct pairs (positives), and the rest of the matrix is <mark>negatives</mark>. Each image has <code>N - 1</code> wrong captions, and in CLIP the batch was <mark>32,768</mark>, so each image is compared against 32,767 wrong captions in a single step.</p>')),
 q:[
   CQ("batch فيه N = 4 أزواج. كام خانة negative (زوج غلط) في مصفوفة الـ similarity كلها؟","A batch has N = 4 pairs. How many negative cells (wrong pairs) are in the whole similarity matrix?",
      [["4","4"],["8","8"],["12","12"],["16","16"]],
      2,"المصفوفة 4 × 4 = 16 خانة، منها 4 على القطر (positives)، فالـ negatives هي N² - N = 12.","The matrix is 4 × 4 = 16 cells, 4 of them on the diagonal (positives), so the negatives are N² - N = 12."),
   CQ("إيه اللي بيعمله الـ contrastive loss في CLIP؟","What does the contrastive loss do in CLIP?",
   [["بيقلّل حجم الصورة","It shrinks the image"],
    ["بيولّد caption جديد للصورة","It generates a new caption for the image"],
    ["بيصنّف الصورة في 1000 class ثابتة","It classifies the image into 1000 fixed classes"],
    ["بيقرّب الصورة من caption بتاعها وبيبعّدها عن باقي الـ captions في الـ batch","It pulls an image toward its own caption and pushes it away from the other captions in the batch"]],
   3,"القطر (الأزواج الصح) بنزوّد قيمته، وباقي الخانات (negatives) بنقلّل قيمتها.","We raise the diagonal (the matching pairs) and lower the other cells (the negatives).")
 ],
 f:[
   CF("إزاي CLIP بيتدرّب، وإزاي بيعمل zero-shot classification؟","How is CLIP trained, and how does it do zero-shot classification?",
      "بيتدرّب بـ contrastive loss متماثل على مصفوفة N × N من الـ similarities: القطر positives وباقي المصفوفة negatives. للـ zero-shot بنكتب جملة لكل class (a photo of a ...) ونختار الـ class اللي جملته أقرب cosine للصورة.","It is trained with a symmetric contrastive loss on an N × N matrix of similarities: the diagonal are positives and the rest negatives. For zero-shot we write a sentence for each class (a photo of a ...) and pick the class whose sentence is closest in cosine to the image."),
   CF("إيه هي الـ positives والـ negatives في مصفوفة CLIP؟","What are the positives and negatives in CLIP's matrix?",
   "الـ positives هي القطر (الأزواج الصح)، وباقي المصفوفة negatives. في batch فيه N زوج: N positives و N² - N negatives.","The positives are the diagonal (the matching pairs) and the rest of the matrix is negatives. In a batch of N pairs: N positives and N² - N negatives.")
 ],
 terms:[
   {t:B("CLIP","CLIP"),
 d:B("موديل من OpenAI بيتدرّب على 400 مليون زوج (صورة، caption) علشان الصورة والنص يبقوا في فضاء vectors واحد.","An OpenAI model trained on 400 million (image, caption) pairs so that images and text live in one vector space.")},

{t:B("Positive and negative pairs","Positive and negative pairs"),
 d:B("الـ positive زوج صح (صورة وcaption بتاعها). الـ negative أي زوج غلط في نفس الـ batch.","A positive is a correct pair (an image and its caption). A negative is any wrong pair in the same batch.")}
 ]},

{id:"l16-clip-zeroshot",t:B("CLIP: الـ temperature والـ zero-shot وحدوده","CLIP: temperature, zero-shot and limits"),
 b:cat(B('<p>الـ <code>tau</code> هي الـ temperature (زي اللي في الـ sampling)، وفي CLIP هي <mark>parameter بيتعلّم</mark>. الـ tau الصغيرة بتخلّي الـ softmax حادة.</p>'+
         '<p><mark>Zero-shot classification</mark> من غير تدريب على المهمة:<br>1. لكل class اكتب جملة زي <code>a photo of a dog</code>، <code>a photo of a car</code>، وهكذا.<br>2. اعمل encode للجمل دي مرة واحدة.<br>3. اعمل encode للصورة، وخد الـ class اللي جملته أعلى cosine similarity.</p>'+
         '<p>CLIP وصل لدقة حوالي 76% على ImageNet بالطريقة دي، مساوية تقريبًا لـ ResNet-50 المتدرّب على 1.28 مليون صورة مصنّفة، من غير ما يشوف ولا label منها. الحدود:<br>• حساس لصياغة الـ prompt.<br>• ضعيف في <mark>العدّ</mark> والعلاقات المكانية ("مكعب أحمر فوق أزرق" مقابل العكس)، لأنه أحيانًا بيتصرف زي bag of words.<br>• بيورّث تحيّزات الويب.</p>'+
         '<p>وقيمة CLIP الأكبر إنه بقى <mark>مكوّن</mark> في أنظمة تانية: بحث الصور بالنص، والـ vision encoder في موديلات زي LLaVA (كارت 7)، والـ text encoder في بعض موديلات توليد الصور (كارت 9).</p>',
         '<p>The <code>tau</code> is the temperature (like the one in sampling), and in CLIP it is a <mark>learned parameter</mark>. A small tau makes the softmax sharp.</p>'+
         '<p><mark>Zero-shot classification</mark> with no training on the task:<br>1. For each class write a sentence such as <code>a photo of a dog</code>, <code>a photo of a car</code>, and so on.<br>2. Encode these sentences once.<br>3. Encode the image, and take the class whose sentence has the highest cosine similarity.</p>'+
         '<p>CLIP reached about 76% on ImageNet this way, roughly equal to a ResNet-50 trained on 1.28 million labeled images, without seeing a single one of those labels. The limits:<br>• Sensitive to the wording of the prompt.<br>• Weak at <mark>counting</mark> and spatial relations ("a red cube on a blue one" versus the reverse), because it sometimes behaves like a bag of words.<br>• It inherits web biases.</p>'+
         '<p>CLIP\'s biggest value is that it became a <mark>component</mark> in other systems: text-to-image search, the vision encoder in models like LLaVA (card 7), and the text encoder in some image generators (card 9).</p>')),
 q:[
   CQ("في zero-shot classification بـ CLIP، إزاي بنختار الـ class؟","In zero-shot classification with CLIP, how do we pick the class?",
   [["بندرّب classifier جديد على صور المهمة","We train a new classifier on the task images"],
    ["بنولّد caption للصورة ونقرأه","We generate a caption for the image and read it"],
    ["بنختار الـ class اللي جملته (a photo of a ...) أعلى cosine similarity مع الصورة","We pick the class whose sentence (a photo of a ...) has the highest cosine similarity with the image"],
    ["بنختار الـ class الأكتر ظهورًا في الـ batch","We pick the most frequent class in the batch"]],
   2,"بنعمل encode لجمل الـ classes مرة واحدة، وبنقارنها بـ vector الصورة.","We encode the class sentences once and compare them with the image vector."),
CQ("إيه نقطة الضعف المعروفة في CLIP؟","Which weakness of CLIP is well known?",
   [["العدّ والعلاقات المكانية، زي مكعب أحمر فوق أزرق مقابل العكس","Counting and spatial relations, such as a red cube on a blue one versus the reverse"],
    ["مبيفهمش الصور الملوّنة","It cannot understand color images"],
    ["بيحتاج labels يدوية لكل صورة","It needs manual labels for every image"],
    ["مبيشتغلش مع النص خالص","It does not work with text at all"]],
   0,"لأنه أحيانًا بيتصرف زي bag of words.","Because it sometimes behaves like a bag of words.")
 ],
 f:[
   CF("إيه هي الـ tau في CLIP؟","What is tau in CLIP?",
   "الـ temperature، وهي parameter بيتعلّم. الـ tau الصغيرة بتخلّي الـ softmax حادة.","The temperature, a learned parameter. A small tau makes the softmax sharp."),
CF("إزاي نعمل zero-shot classification بـ CLIP؟","How do we do zero-shot classification with CLIP?",
   "نكتب جملة لكل class (a photo of a dog)، نعمل لها encode مرة واحدة، نعمل encode للصورة، ونختار الـ class اللي جملته أعلى cosine similarity.","Write a sentence for each class (a photo of a dog), encode them once, encode the image, and pick the class whose sentence has the highest cosine similarity.")
 ],
 terms:[
   {t:B("Zero-shot classification","Zero-shot classification"),
 d:B("تصنيف من غير تدريب على المهمة: بنقارن الصورة بجملة لكل class ونختار الأقرب cosine.","Classifying with no training on the task: we compare the image with a sentence for each class and pick the closest by cosine.")},
{t:B("Temperature in CLIP (tau)","Temperature in CLIP (tau)"),
 d:B("parameter متعلَّم بيقسم الـ similarities قبل الـ softmax. الصغير بيخلّي الـ softmax حادة.","A learned parameter that divides the similarities before the softmax. A small one makes the softmax sharp.")}
 ]},

{id:"l16-connect",t:B("نوصّل الصورة بـ LLM","Connecting vision to an LLM"),
 b:cat(B('<p>الفكرة: بدل ما نعمل موديل جديد من الصفر، نوصّل <mark>vision encoder</mark> جاهز بـ <mark>LLM</mark> جاهز. ده أسلوب <mark>LLaVA</mark> وأمثاله. الأجزاء التلاتة:<br>• <mark>Vision encoder</mark>: غالبًا CLIP ViT متدرّب مسبقًا (بيطلّع vector لكل patch).<br>• <mark>Projector</mark>: طبقة linear أو MLP صغيرة بتحوّل vectors الصورة لنفس بُعد الـ embeddings بتاعة الـ LLM.<br>• <mark>LLM</mark>: decoder زي اللي في محاضرة 9 و10.</p>'+
         '<p>الـ vectors اللي بتطلع من الـ projector بنسمّيها <mark>visual tokens</mark>، وبنحطها في نفس الـ sequence مع tokens الـ prompt. الـ LLM مبيعرفش إنها جاية من صورة، بيشوفها كأنها tokens عادية، والـ self-attention بتخلّي كلمات السؤال تشوف أجزاء الصورة.</p>',
         '<p>The idea: instead of building a new model from scratch, connect a ready <mark>vision encoder</mark> to a ready <mark>LLM</mark>. This is the <mark>LLaVA</mark> approach and its relatives. The three parts:<br>• <mark>Vision encoder</mark>: usually a pretrained CLIP ViT (it outputs one vector per patch).<br>• <mark>Projector</mark>: a linear layer or a small MLP that maps the image vectors to the embedding size of the LLM.<br>• <mark>LLM</mark>: a decoder like the ones in lectures 9 and 10.</p>'+
         '<p>The vectors that come out of the projector are called <mark>visual tokens</mark>, and we place them in the same sequence as the prompt tokens. The LLM does not know they came from an image, it sees them as ordinary tokens, and self-attention lets the words of the question look at parts of the image.</p>'),
       FIG_L16_LLAVA,
       B('<p>عدد الـ visual tokens هو عدد الـ patches:</p>'+
         '<div class="m">image 336 x 336, patch 14\n  336 / 14 = 24\n  24 * 24 = 576 visual tokens</div>'+
         '<p>يعني صورة واحدة بتاخد 576 مكان من الـ context window.</p>',
         '<p>The number of visual tokens is the number of patches:</p>'+
         '<div class="m">image 336 x 336, patch 14\n  336 / 14 = 24\n  24 * 24 = 576 visual tokens</div>'+
         '<p>So a single image takes 576 slots of the context window.</p>')),
 q:[
   CQ("صورة 448 × 448 وpatch حجمها 14. كام visual token بتطلع؟","A 448 × 448 image with patch size 14. How many visual tokens result?",
      [["576","576"],["1,024","1,024"],["448","448"],["3,136","3,136"]],
      1,"448 / 14 = 32 في كل اتجاه، فالعدد 32 × 32 = 1,024 token.","448 / 14 = 32 in each direction, so the count is 32 × 32 = 1,024 tokens."),
   CQ("إيه وظيفة الـ projector في LLaVA؟","What is the projector's job in LLaVA?",
   [["بيولّد الإجابة النهائية","It generates the final answer"],
    ["بيحوّل vectors الصورة لنفس بُعد embeddings الـ LLM علشان تتحط مع tokens السؤال","It maps the image vectors to the LLM's embedding size so they can sit with the question tokens"],
    ["بيصغّر الصورة قبل الـ ViT","It shrinks the image before the ViT"],
    ["بيمسح الـ prompt","It deletes the prompt"]],
   1,"الـ projector هو الحلقة اللي بتخلّي الـ LLM يستقبل الصورة كأنها tokens عادية.","The projector is the link that lets the LLM receive the image as ordinary tokens.")
 ],
 f:[
   CF("إيه مراحل تدريب موديل زي LLaVA، وإيه اللي بيتدرّب في كل مرحلة؟","What are the training stages of a model like LLaVA, and what is trained in each?",
      "المرحلة 1 (alignment) على صور وcaptions: الـ projector بس بيتدرّب والـ ViT والـ LLM مجمّدين. المرحلة 2 (visual instruction tuning) على محادثات صور: الـ projector والـ LLM بيتدرّبوا، والـ loss على tokens الإجابة بس.","Stage 1 (alignment) on images and captions: only the projector is trained, with the ViT and the LLM frozen. Stage 2 (visual instruction tuning) on image conversations: the projector and the LLM are trained, with the loss on the answer tokens only."),
   CF("يعني إيه visual tokens؟","What are visual tokens?",
   "vectors طالعة من الـ projector بنحطها في نفس sequence الـ prompt، والـ LLM بيشوفها كأنها tokens عادية. عددها هو عدد الـ patches، مثلًا (336 / 14)² = 576.","Vectors coming out of the projector that we place in the same sequence as the prompt, and the LLM sees them as ordinary tokens. Their number is the number of patches, for example (336 / 14)² = 576.")
 ],
 terms:[
   {t:B("Visual tokens","Visual tokens"),
 d:B("vectors طالعة من الـ projector بتتحط في sequence الـ LLM مع tokens النص.","Vectors coming out of the projector that are placed in the LLM sequence together with the text tokens.")},
{t:B("Projector (vision-language)","Projector (vision-language)"),
 d:B("طبقة linear أو MLP صغيرة بتحوّل features الصورة لبُعد embeddings الـ LLM.","A linear layer or small MLP that maps image features to the LLM embedding size.")},
{t:B("LLaVA","LLaVA"),
 d:B("موديل vision-language بيوصّل CLIP ViT مجمّد بـ LLM عن طريق projector.","A vision-language model that connects a frozen CLIP ViT to an LLM through a projector.")}
 ]},

{id:"l16-llava-train",t:B("تدريب LLaVA والبدائل","Training LLaVA, and the alternatives"),
 b:cat(B('<p><mark>التدريب على مرحلتين</mark>:<br>1. <mark>Alignment</mark>: على بيانات صور وcaptions، بنتدرّب الـ projector بس، والـ ViT والـ LLM <mark>مجمّدين</mark>. هدفها إن الـ LLM يفهم "لغة" الـ vectors دي.<br>2. <mark>Visual instruction tuning</mark>: على محادثات (صورة، سؤال، إجابة)، بنتدرّب الـ projector والـ LLM (كامل أو بـ LoRA من محاضرة 11).</p>'+
         '<p>الـ loss هو next-token prediction <mark>على tokens الإجابة بس</mark>، زي الـ SFT في محاضرة 10. الـ visual tokens والسؤال مدخلات، مش أهداف.</p>'+
         '<p>بدائل لنفس المشكلة:<br>• <mark>Q-Former</mark> (في BLIP-2): 32 query متعلَّمة بتعمل cross-attention على features الصورة، فالـ LLM بياخد 32 token بس.<br>• <mark>Perceiver resampler + gated cross-attention</mark> (في Flamingo): الصورة مش داخلة في الـ sequence، لكن بنضيف طبقات cross-attention جوه LLM مجمّد.<br>• <mark>Native multimodal</mark>: تدريب من الصفر على نصوص وصور مختلطة كلها tokens (مثلًا Chameleon).</p>'+
         '<p>الـ trade-off: الـ visual tokens في الـ sequence أبسط وأحسن في التفاصيل الدقيقة زي قراءة النص، بس تكلفتها في الـ context عالية. الضغط لـ 32 token أرخص، بس ممكن يضيّع تفاصيل.</p>',
         '<p><mark>Training in two stages</mark>:<br>1. <mark>Alignment</mark>: on image and caption data, we train only the projector, with the ViT and the LLM <mark>frozen</mark>. The goal is for the LLM to understand the "language" of these vectors.<br>2. <mark>Visual instruction tuning</mark>: on conversations (image, question, answer), we train the projector and the LLM (fully or with LoRA from lecture 11).</p>'+
         '<p>The loss is next-token prediction <mark>on the answer tokens only</mark>, like SFT in lecture 10. The visual tokens and the question are inputs, not targets.</p>'+
         '<p>Alternatives for the same problem:<br>• <mark>Q-Former</mark> (in BLIP-2): 32 learned queries cross-attend to the image features, so the LLM receives only 32 tokens.<br>• <mark>Perceiver resampler + gated cross-attention</mark> (in Flamingo): the image does not enter the sequence, but cross-attention layers are added inside a frozen LLM.<br>• <mark>Native multimodal</mark>: training from scratch on mixed text and images, all as tokens (for example Chameleon).</p>'+
         '<p>The trade-off: visual tokens in the sequence are simpler and better for fine detail such as reading text, but they cost a lot of context. Compressing to 32 tokens is cheaper, but may lose detail.</p>')),
 q:[
   CQ("في مرحلة الـ alignment في LLaVA، إيه اللي بيتدرّب؟","In LLaVA's alignment stage, what is trained?",
   [["الـ LLM بس","Only the LLM"],
    ["الـ ViT بس","Only the ViT"],
    ["الـ projector بس","Only the projector"],
    ["الـ ViT والـ LLM والـ projector كلهم","The ViT, the LLM and the projector, all together"]],
   2,"الـ ViT والـ LLM مجمّدين، والهدف إن الـ LLM يفهم لغة الـ vectors دي.","The ViT and the LLM are frozen, and the goal is for the LLM to understand the language of these vectors."),
CQ("الـ loss في visual instruction tuning بيتحسب على أنهي tokens؟","In visual instruction tuning, on which tokens is the loss computed?",
   [["tokens الإجابة بس","The answer tokens only"],
    ["كل الـ tokens بما فيها الـ visual tokens","All tokens, including the visual tokens"],
    ["الـ visual tokens بس","The visual tokens only"],
    ["tokens السؤال بس","The question tokens only"]],
   0,"الـ visual tokens والسؤال مدخلات، مش أهداف.","The visual tokens and the question are inputs, not targets.")
 ],
 f:[
   CF("إيه الفرق بين الـ visual tokens في الـ sequence وبين Q-Former؟","What is the difference between visual tokens in the sequence and a Q-Former?",
   "في الـ sequence: كل patch token، أحسن للتفاصيل زي قراءة النص بس بيكلّف context كتير. الـ Q-Former: 32 query متعلَّمة بتعمل cross-attention على الصورة فالـ LLM ياخد 32 token بس، أرخص وممكن يضيّع تفاصيل.","In the sequence: every patch is a token, better for detail such as reading text but it costs a lot of context. The Q-Former: 32 learned queries cross-attend to the image so the LLM gets only 32 tokens, cheaper but it may lose detail."),
CF("إيه الفرق بين Flamingo والـ native multimodal؟","What is the difference between Flamingo and a native multimodal model?",
   "Flamingo بيضيف طبقات cross-attention جوه LLM مجمّد والصورة مش داخلة في الـ sequence. الـ native multimodal بيتدرّب من الصفر على نصوص وصور مختلطة كلها tokens (مثلًا Chameleon).","Flamingo adds cross-attention layers inside a frozen LLM and the image does not enter the sequence. A native multimodal model trains from scratch on mixed text and images, all as tokens (for example Chameleon).")
 ],
 terms:[
   {t:B("Visual instruction tuning","Visual instruction tuning"),
 d:B("المرحلة التانية في LLaVA: تدريب الـ projector والـ LLM على محادثات (صورة، سؤال، إجابة).","The second stage in LLaVA: training the projector and the LLM on (image, question, answer) conversations.")},
{t:B("Q-Former","Q-Former"),
 d:B("في BLIP-2: 32 query متعلَّمة بتعمل cross-attention على features الصورة وبتدّي الـ LLM 32 token بس.","In BLIP-2: 32 learned queries cross-attend to the image features and give the LLM only 32 tokens.")},
{t:B("Perceiver resampler","Perceiver resampler"),
 d:B("في Flamingo: بيلخّص features الصورة، وطبقات gated cross-attention جوه LLM مجمّد بتقراها.","In Flamingo: it summarizes the image features, and gated cross-attention layers inside a frozen LLM read them.")},
{t:B("Native multimodal model","Native multimodal model"),
 d:B("موديل بيتدرّب من الصفر على نصوص وصور مختلطة، كلها tokens (مثلًا Chameleon).","A model trained from scratch on mixed text and images, all as tokens (for example Chameleon).")}
 ]},

{id:"l16-diffusion",t:B("توليد الصور: diffusion","Generating images: diffusion"),
 b:cat(B('<p>CLIP بيفهم الصور، لكن مبيولّدهاش. توليد الصور من نص (text-to-image) بيتعمل في الغالب بـ <mark>diffusion</mark>. الفكرة عكس الـ LLM: الـ LLM بيولّد token ورا token من الشمال لليمين، أما الـ diffusion فبيبدأ من <mark>ضجيج خالص</mark> وبيحسّن الصورة كلها مع بعض على خطوات.</p>'+
         '<p><mark>Forward process</mark> (ثابتة، من غير تعلّم): ناخد صورة نضيفة x_0 ونضيف عليها ضجيج Gaussian على T خطوة. وفي أي خطوة t نقدر نقفز لها مباشرة:</p>'+
         '<div class="m">x_t = sqrt(abar_t) * x_0\n      + sqrt(1 - abar_t) * eps\neps ~ Normal(0, I)\n\nabar_t starts near 1 (clean image)\nand falls toward 0 (pure noise) at t = T</div>'+
         '<p>لما abar_t تقرب من 1 الصورة بتبقى نضيفة تقريبًا، ولما تقرب من 0 الصورة بتبقى ضجيج.</p>',
         '<p>CLIP understands images but does not generate them. Text-to-image generation is mostly done with <mark>diffusion</mark>. The idea is the opposite of an LLM: an LLM generates one token after another from left to right, while diffusion starts from <mark>pure noise</mark> and refines the whole image together over steps.</p>'+
         '<p>The <mark>forward process</mark> (fixed, no learning): take a clean image x_0 and add Gaussian noise over T steps. And at any step t we can jump to it directly:</p>'+
         '<div class="m">x_t = sqrt(abar_t) * x_0\n      + sqrt(1 - abar_t) * eps\neps ~ Normal(0, I)\n\nabar_t starts near 1 (clean image)\nand falls toward 0 (pure noise) at t = T</div>'+
         '<p>When abar_t is near 1 the image is almost clean, and when it is near 0 the image is noise.</p>'),
       FIG_L16_DIFF,
       B('<p><mark>التدريب</mark>: نسحب صورة x_0 ورقم t وضجيج eps عشوائيين، نبني x_t بالمعادلة، ونخلّي شبكة (U-Net أو Transformer) <mark>تتنبأ بالضجيج</mark> اللي اتضاف:</p>'+
         '<div class="m">loss = || eps - eps_theta(x_t, t, c) ||^2</div>',
         '<p><mark>Training</mark>: draw a random image x_0, a number t and noise eps, build x_t with the equation, and make a network (a U-Net or a Transformer) <mark>predict the noise</mark> that was added:</p>'+
         '<div class="m">loss = || eps - eps_theta(x_t, t, c) ||^2</div>')),
 q:[
   CQ("لو abar_t = 0.64، إيه معامل الصورة sqrt(abar_t) ومعامل الضجيج sqrt(1 - abar_t)؟","If abar_t = 0.64, what are the image coefficient sqrt(abar_t) and the noise coefficient sqrt(1 - abar_t)?",
      [["0.64 و 0.36","0.64 and 0.36"],["0.8 و 0.6","0.8 and 0.6"],["0.8 و 0.2","0.8 and 0.2"],["0.6 و 0.8","0.6 and 0.8"]],
      1,"sqrt(0.64) = 0.8، و sqrt(1 - 0.64) = sqrt(0.36) = 0.6. يعني الصورة لسه الأقوى (0.8) والضجيج 0.6.","sqrt(0.64) = 0.8, and sqrt(1 - 0.64) = sqrt(0.36) = 0.6. So the image is still the stronger part (0.8) and the noise is 0.6."),
   CQ("إيه اللي الشبكة بتتدرّب تتنبأ بيه في diffusion؟","What is the network trained to predict in diffusion?",
   [["الكلمة الجاية","The next word"],
    ["الضجيج eps اللي اتضاف على x_0","The noise eps that was added to x_0"],
    ["الـ caption بتاع الصورة","The caption of the image"],
    ["حجم الصورة","The size of the image"]],
   1,"الـ loss هو MSE بين eps الحقيقي وتنبؤ الشبكة eps_theta(x_t, t, c).","The loss is the MSE between the true eps and the network prediction eps_theta(x_t, t, c).")
 ],
 f:[
   CF("إيه اللي الشبكة بتتنبأ بيه في diffusion، وإيه هو classifier-free guidance؟","What does the network predict in diffusion, and what is classifier-free guidance?",
      "الشبكة بتتنبأ بالضجيج eps اللي اتضاف على x_0 (loss = MSE بينه وبين eps_theta(x_t, t, c)). الـ guidance بيجمع تنبؤين: eps_hat = eps_none + w × (eps_text - eps_none). الـ w الأكبر بتزوّد الالتزام بالنص وبتقلّل التنوّع.","The network predicts the noise eps that was added to x_0 (the loss is the MSE between it and eps_theta(x_t, t, c)). Guidance combines two predictions: eps_hat = eps_none + w × (eps_text - eps_none). A larger w increases adherence to the text and reduces diversity."),
   CF("إيه الـ forward process في diffusion؟","What is the forward process in diffusion?",
   "عملية ثابتة من غير تعلّم: بنضيف ضجيج Gaussian على الصورة على T خطوة، وبنقدر نقفز لأي خطوة t مباشرة بالمعادلة x_t = sqrt(abar_t) × x_0 + sqrt(1 - abar_t) × eps.","A fixed process with no learning: we add Gaussian noise to the image over T steps, and we can jump straight to any step t with the equation x_t = sqrt(abar_t) × x_0 + sqrt(1 - abar_t) × eps.")
 ],
 terms:[
   {t:B("Diffusion model","Diffusion model"),
 d:B("موديل توليد بيبدأ من ضجيج خالص وبيشيل الضجيج خطوة خطوة لحد ما تطلع الصورة.","A generative model that starts from pure noise and removes noise step by step until the image emerges.")},
{t:B("Forward (noising) process","Forward (noising) process"),
 d:B("عملية ثابتة بتضيف ضجيج Gaussian على الصورة على T خطوة، من غير تعلّم.","A fixed process that adds Gaussian noise to the image over T steps, with no learning.")},
{t:B("Noise prediction","Noise prediction"),
 d:B("هدف التدريب في diffusion: الشبكة تتنبأ بالضجيج eps اللي اتضاف، والـ loss هو MSE.","The training goal in diffusion: the network predicts the noise eps that was added, and the loss is the MSE.")}
 ]},

{id:"l16-diffusion-guide",t:B("diffusion: الشرط والتوليد والـ guidance","Diffusion: conditioning, generation and guidance"),
 b:cat(B('<p>الـ <code>c</code> هو الشرط، يعني الـ text embedding بتاع الـ prompt (من encoder زي CLIP أو T5). بيدخل الشبكة بـ <mark>cross-attention</mark>: الـ queries من features الصورة، والـ keys والـ values من النص (محاضرة 7 و8).</p>'+
         '<p><mark>التوليد</mark>: نبدأ من ضجيج خالص x_T، ونكرر: الشبكة تتنبأ بالضجيج، نشيل جزء منه، فتبقى الصورة أنضف شوية. بعد 20 لـ 50 خطوة (بـ samplers سريعة زي DDIM) بتطلع الصورة. (الـ DDPM الأصلي كان محتاج حوالي 1000 خطوة.)</p>'+
         '<p><mark>Latent diffusion</mark> (زي Stable Diffusion): بدل ما نشتغل على البكسلات، autoencoder بيضغط الصورة الأول:</p>'+
         '<div class="m">512 x 512 x 3 = 786,432 numbers\n  -> latent 64 x 64 x 4 = 16,384 numbers\n  = 48x fewer, so much cheaper</div>'+
         '<p><mark>Classifier-free guidance</mark> بيقوّي التزام الصورة بالنص. بنتدرّب أحيانًا (حوالي 10% من الوقت) من غير النص، فالشبكة تتعلم الحالتين، وبعدين وقت التوليد:</p>'+
         '<div class="m">eps_hat = eps_none + w * (eps_text - eps_none)\n\neps_none = 0.20, eps_text = 0.50, w = 4\neps_hat = 0.20 + 4 * 0.30 = 1.40</div>'+
         '<p>w = 1 معناها الـ conditional العادي. الـ w الأكبر بتخلّي الصورة أقرب للـ prompt، بس <mark>تنوّع</mark> الصور بيقلّ.</p>',
         '<p>The <code>c</code> is the condition, meaning the text embedding of the prompt (from an encoder such as CLIP or T5). It enters the network through <mark>cross-attention</mark>: the queries come from the image features, and the keys and values from the text (lectures 7 and 8).</p>'+
         '<p><mark>Generation</mark>: start from pure noise x_T and repeat: the network predicts the noise, we remove a part of it, and the image gets a bit cleaner. After 20 to 50 steps (with fast samplers such as DDIM) the image emerges. (The original DDPM needed about 1000 steps.)</p>'+
         '<p><mark>Latent diffusion</mark> (like Stable Diffusion): instead of working on pixels, an autoencoder first compresses the image:</p>'+
         '<div class="m">512 x 512 x 3 = 786,432 numbers\n  -> latent 64 x 64 x 4 = 16,384 numbers\n  = 48x fewer, so much cheaper</div>'+
         '<p><mark>Classifier-free guidance</mark> makes the image follow the text more strongly. We sometimes train (about 10% of the time) with no text, so the network learns both cases, and then at generation time:</p>'+
         '<div class="m">eps_hat = eps_none + w * (eps_text - eps_none)\n\neps_none = 0.20, eps_text = 0.50, w = 4\neps_hat = 0.20 + 4 * 0.30 = 1.40</div>'+
         '<p>w = 1 means the plain conditional. A larger w makes the image closer to the prompt, but the <mark>diversity</mark> of images drops.</p>')),
 q:[
   CQ("eps_none = 0.1 و eps_text = 0.4 و w = 3. كام eps_hat في classifier-free guidance؟","With eps_none = 0.1, eps_text = 0.4 and w = 3, what is eps_hat in classifier-free guidance?",
   [["1.3","1.3"],["0.7","0.7"],["1.0","1.0"],["1.2","1.2"]],
   2,"eps_hat = 0.1 + 3 × (0.4 - 0.1) = 0.1 + 0.9 = 1.0.","eps_hat = 0.1 + 3 × (0.4 - 0.1) = 0.1 + 0.9 = 1.0."),
CQ("autoencoder بيضغط صورة 256 × 256 × 3 لـ latent 32 × 32 × 4. الـ latent أصغر بكام ضعف؟","An autoencoder compresses a 256 × 256 × 3 image into a 32 × 32 × 4 latent. How many times smaller is the latent?",
   [["24","24"],["48","48"],["96","96"],["192","192"]],
   1,"256 × 256 × 3 = 196,608، و 32 × 32 × 4 = 4,096، والنسبة 196,608 / 4,096 = 48.","256 × 256 × 3 = 196,608, and 32 × 32 × 4 = 4,096, so the ratio is 196,608 / 4,096 = 48.")
 ],
 f:[
   CF("إيه اللي بيعمله الـ w الأكبر في classifier-free guidance؟","What does a larger w do in classifier-free guidance?",
   "بيخلّي الصورة أقرب للـ prompt، بس تنوّع الصور بيقلّ. w = 1 معناها الـ conditional العادي.","It makes the image closer to the prompt, but the diversity of images drops. w = 1 means the plain conditional."),
CF("إيه هو latent diffusion وليه أرخص؟","What is latent diffusion and why is it cheaper?",
   "بدل ما نشتغل على البكسلات، autoencoder بيضغط الصورة الأول لـ latent أصغر بكتير (512 × 512 × 3 لـ 64 × 64 × 4، يعني 48 ضعف أقل)، والـ diffusion بيشتغل عليه.","Instead of working on pixels, an autoencoder first compresses the image into a much smaller latent (512 × 512 × 3 into 64 × 64 × 4, which is 48 times fewer numbers), and diffusion runs on it.")
 ],
 terms:[
   {t:B("Latent diffusion","Latent diffusion"),
 d:B("diffusion بيشتغل على latent مضغوط من autoencoder بدل البكسلات، فهو أرخص (زي Stable Diffusion).","Diffusion that runs on a compressed latent from an autoencoder instead of on pixels, which is cheaper (as in Stable Diffusion).")},
{t:B("Classifier-free guidance","Classifier-free guidance"),
 d:B("بنجمع تنبؤين: <code>eps_none + w × (eps_text - eps_none)</code>. الـ w الأكبر بتزوّد الالتزام بالـ prompt وبتقلّل التنوّع.","We combine two predictions: <code>eps_none + w × (eps_text - eps_none)</code>. A larger w increases adherence to the prompt and lowers diversity.")}
 ]},

{id:"l16-evalcost",t:B("التقييم والأخطاء الشائعة","Evaluation and common failures"),
 b:cat(B('<p>إزاي نعرف إن موديل الصور والنص كويس؟ زي ما شفنا في محاضرة 15، مفيش مقياس واحد:<br>• <mark>VQA</mark> (visual question answering): سؤال عن صورة، والإجابة بتتقارن بإجابات بشر.<br>• <mark>Captioning</mark>: مقاييس زي CIDEr بتقارن بـ captions مرجعية، وبتفضل محدودة لأن الوصف الصح مش واحد.<br>• <mark>OCR وفهم المستندات والرسوم</mark> (زي DocVQA و ChartQA).<br>• <mark>MMMU</mark>: أسئلة بمستوى الجامعة في تخصصات كتير، محتاجة صورة وتفكير، حوالي 11,500 سؤال.<br>• للتوليد: <mark>FID</mark> (المسافة بين توزيع الصور المولّدة والحقيقية، الأقل أحسن) و<mark>CLIPScore</mark> (تشابه الصورة بالـ prompt) والتفضيل البشري.</p>'+
         '<p>أشهر المشاكل:<br>• <mark>Hallucination</mark>: الموديل بيوصف حاجة مش في الصورة. بيتقاس بأسئلة نعم/لا زي "في كلب في الصورة؟" (benchmark اسمه POPE).<br>• <mark>Language prior</mark>: الموديل بيجاوب من معلومات اللغة وبيتجاهل الصورة. اختبار سريع: ادّيله صورة فاضية أو مش مظبوطة. لو الإجابة ما اتغيّرتش، هو مش بيستخدم الصورة.<br>• <mark>العدّ والعلاقات المكانية</mark> والتفاصيل الصغيرة (نص صغير في الصورة)، لأن الصورة اتصغّرت واتحوّلت لعدد محدود من الـ tokens.</p>',
         '<p>How do we know a vision-language model is good? As we saw in lecture 15, there is no single metric:<br>• <mark>VQA</mark> (visual question answering): a question about an image, with the answer compared to human answers.<br>• <mark>Captioning</mark>: metrics such as CIDEr compare against reference captions, and they stay limited because the right description is not unique.<br>• <mark>OCR and document and chart understanding</mark> (such as DocVQA and ChartQA).<br>• <mark>MMMU</mark>: college-level questions across many subjects, needing an image and reasoning, about 11,500 questions.<br>• For generation: <mark>FID</mark> (the distance between the distribution of generated and real images, lower is better), <mark>CLIPScore</mark> (image-prompt similarity) and human preference.</p>'+
         '<p>The most common problems:<br>• <mark>Hallucination</mark>: the model describes something that is not in the image. It is measured with yes/no questions such as "is there a dog in the image?" (a benchmark called POPE).<br>• <mark>Language prior</mark>: the model answers from language knowledge and ignores the image. A quick test: give it a blank or mismatched image. If the answer does not change, it is not using the image.<br>• <mark>Counting and spatial relations</mark> and small details (small text in the image), because the image was shrunk and turned into a limited number of tokens.</p>')),
 q:[
   CQ("أنهي مقياس بيقيس جودة الصور المولّدة، والأقل فيه أحسن؟","Which metric measures the quality of generated images, where lower is better?",
   [["VQA accuracy","VQA accuracy"],["CIDEr","CIDEr"],["FID","FID"],["CLIPScore","CLIPScore"]],
   2,"الـ FID هي المسافة بين توزيع الصور المولّدة والحقيقية. الـ CIDEr للـ captioning، والـ CLIPScore تشابه الصورة بالـ prompt.","FID is the distance between the distribution of generated and real images. CIDEr is for captioning, and CLIPScore is the image-prompt similarity."),
CQ("ادّيت الموديل صورة فاضية والإجابة ما اتغيّرتش عن الصورة الأصلية. معنى كده إيه؟","You gave the model a blank image and the answer did not change compared with the real image. What does that mean?",
   [["الموديل بيعتمد على الـ language prior ومبيستخدمش الصورة","The model relies on the language prior and does not use the image"],
    ["الموديل ممتاز في الـ grounding","The model is excellent at grounding"],
    ["الصورة الأصلية كانت فاضية","The original image was blank"],
    ["الموديل بيعمل hallucination أقل","The model hallucinates less"]],
   0,"لو الإجابة ما اتغيّرتش يبقى الموديل بيجاوب من معلومات اللغة بس.","If the answer does not change, the model is answering from language knowledge alone.")
 ],
 f:[
   CF("إيه أشهر مشاكل الـ vision-language models، وإزاي نكتشف إن الموديل بيتجاهل الصورة؟","What are the most common problems of vision-language models, and how do we detect that the model ignores the image?",
      "الـ hallucination (وصف حاجة مش في الصورة، بيتقاس بـ POPE)، والاعتماد على الـ language prior، وضعف العدّ والعلاقات المكانية والتفاصيل الصغيرة. للكشف عن تجاهل الصورة: نديه صورة فاضية أو مش مظبوطة، ولو الإجابة ما اتغيّرتش يبقى مش بيستخدمها.","Hallucination (describing something not in the image, measured with POPE), reliance on the language prior, and weakness at counting, spatial relations and small details. To detect that it ignores the image: give it a blank or mismatched image, and if the answer does not change it is not using it."),
   CF("إيه الفرق بين FID وCLIPScore؟","What is the difference between FID and CLIPScore?",
   "الـ FID هي المسافة بين توزيع الصور المولّدة والحقيقية (الأقل أحسن). الـ CLIPScore بتقيس تشابه الصورة بالـ prompt.","FID is the distance between the distribution of generated and real images (lower is better). CLIPScore measures the similarity between the image and the prompt.")
 ],
 terms:[
   {t:B("VQA (visual question answering)","VQA (visual question answering)"),
 d:B("سؤال عن صورة، والإجابة بتتقارن بإجابات بشر.","A question about an image, with the answer compared to human answers.")},
{t:B("FID","FID"),
 d:B("مقياس لجودة الصور المولّدة: المسافة بين توزيع الصور المولّدة والحقيقية، والأقل أحسن.","A metric for generated images: the distance between the distribution of generated and real images, lower is better.")},
{t:B("CLIPScore","CLIPScore"),
 d:B("مقياس تشابه الصورة بالـ prompt باستخدام CLIP.","A metric for image-prompt similarity computed with CLIP.")},
{t:B("Language prior","Language prior"),
 d:B("الموديل بيجاوب من معلومات اللغة وبيتجاهل الصورة. بنكشفه بصورة فاضية أو مش مظبوطة.","The model answers from language knowledge and ignores the image. We detect it with a blank or mismatched image.")}
 ]},

{id:"l16-cost-audio",t:B("تكلفة الفيديو والصوت (Whisper)","The cost of video, and audio with Whisper"),
 b:cat(B('<p><mark>التكلفة</mark> (الرسم): الصورة بـ 576 token، والفيديو بناخد منه frames بمعدل مثلًا واحد في الثانية، فالـ tokens بتتضرب:</p>'+
         '<div class="m">10 s video, 1 frame/s, 576 tokens/frame\n  = 10 * 576 = 5,760 tokens\n60 s video = 60 * 576 = 34,560 tokens</div>',
         '<p><mark>Cost</mark> (the figure): an image is 576 tokens, and from a video we take frames at, say, one per second, so the tokens multiply:</p>'+
         '<div class="m">10 s video, 1 frame/s, 576 tokens/frame\n  = 10 * 576 = 5,760 tokens\n60 s video = 60 * 576 = 34,560 tokens</div>'),
       FIG_L16_TOK,
       B('<p>عشان كده الفيديو بيحتاج ضغط (tokens أقل لكل frame، أو اختيار أذكى للـ frames)، لأن الـ attention تكلفتها بتزيد بتربيع الطول.</p>'+
         '<p>والصوت؟ <mark>Whisper</mark> بياخد 30 ثانية صوت، ويحوّلها لـ <mark>log-Mel spectrogram</mark> (زي صورة: الزمن × التردد، 80 قناة تردد في النسخ الأصلية)، وبعدين encoder Transformer، وdecoder بيكتب النص. الـ 30 ثانية = 3,000 frame (واحد كل 10 ms)، وبعد طبقة conv بـ stride 2 بيبقى 1,500 موضع للـ encoder. يعني الصوت اتحوّل لـ "صورة" ورجعنا لنفس الفكرة.</p>',
         '<p>That is why video needs compression (fewer tokens per frame, or smarter frame selection), because attention cost grows with the square of the length.</p>'+
         '<p>And audio? <mark>Whisper</mark> takes 30 seconds of audio and turns it into a <mark>log-Mel spectrogram</mark> (like an image: time × frequency, 80 frequency channels in the original versions), then a Transformer encoder, and a decoder writes the text. The 30 seconds are 3,000 frames (one every 10 ms), and after a conv layer with stride 2 the encoder has 1,500 positions. So audio became an "image", and we are back to the same idea.</p>')),
 q:[
   CQ("فيديو 20 ثانية بمعدل frame في الثانية، وكل frame بـ 256 token. كام visual token كلها؟","A 20-second video at one frame per second, with 256 tokens per frame. How many visual tokens in total?",
      [["256","256"],["2,560","2,560"],["5,120","5,120"],["20,480","20,480"]],
      2,"20 frame × 256 token لكل frame = 5,120 token.","20 frames × 256 tokens per frame = 5,120 tokens."),
   CQ("في Whisper، الـ 30 ثانية بتبقى 3,000 frame وبعد conv بـ stride 2 بتبقى 1,500 موضع. لو نفس الحساب على 10 ثواني، كام موضع للـ encoder؟","In Whisper, 30 seconds become 3,000 frames and after a conv with stride 2 they become 1,500 positions. With the same calculation on 10 seconds, how many encoder positions?",
   [["1,000","1,000"],["2,000","2,000"],["500","500"],["250","250"]],
   2,"10 ثواني = 1,000 frame (واحد كل 10 ms)، وstride 2 بيقسمها على 2 فتبقى 500.","10 seconds = 1,000 frames (one every 10 ms), and stride 2 halves them to 500.")
 ],
 f:[
   CF("كام token في فيديو 60 ثانية بمعدل frame في الثانية و576 token لكل frame؟","How many tokens are in a 60-second video at one frame per second and 576 tokens per frame?",
   "60 × 576 = 34,560 token، فالفيديو محتاج ضغط (tokens أقل لكل frame أو اختيار أذكى للـ frames).","60 × 576 = 34,560 tokens, so video needs compression (fewer tokens per frame, or smarter frame selection)."),
CF("إزاي Whisper بيحوّل الصوت لحاجة الـ Transformer يقراها؟","How does Whisper turn audio into something a Transformer can read?",
   "بيحوّل 30 ثانية صوت لـ log-Mel spectrogram (زي صورة: الزمن × التردد)، وبعدين encoder Transformer، وdecoder بيكتب النص.","It turns 30 seconds of audio into a log-Mel spectrogram (like an image: time × frequency), then a Transformer encoder runs, and a decoder writes the text.")
 ],
 terms:[
   {t:B("Log-Mel spectrogram","Log-Mel spectrogram"),
 d:B("تمثيل للصوت زي الصورة: الزمن × التردد (80 قناة تردد في النسخ الأصلية من Whisper).","A representation of audio like an image: time × frequency (80 frequency channels in the original Whisper versions).")},
{t:B("Whisper","Whisper"),
 d:B("موديل تحويل صوت لنص: log-Mel spectrogram، وبعدين encoder Transformer، وdecoder بيكتب النص.","A speech-to-text model: a log-Mel spectrogram, then a Transformer encoder, and a decoder that writes the text.")}
 ]},

{id:"l16-recap",t:B("Recap: ملخص المحاضرة 16","Recap: lecture 16 summary"),
 b:cat(B('<p><mark>5 نقاط تفتكرها</mark>:<br>1. نحوّل كل modality لـ sequence من vectors بنفس البُعد d، وندّيها لنفس الـ Transformer.<br>2. <mark>ViT</mark> بيقطّع الصورة لـ patches، وكل patch بيبقى token.<br>3. <mark>CLIP</mark> بيربط الصورة والنص بـ contrastive loss، وده بيدّينا zero-shot classification.<br>4. <mark>LLaVA</mark> بيوصّل vision encoder بـ LLM عن طريق projector، وبيتدرّب على مرحلتين.<br>5. <mark>Diffusion</mark> بيولّد الصورة بإنه يشيل الضجيج اللي الشبكة بتتنبأ بيه، خطوة خطوة.</p>'+
         '<p>أهم المعادلات:</p>'+
         '<div class="m">N = (H / P) * (W / P)\nCLIP row i: -log( exp(S_ii) / sum_j exp(S_ij) )\nx_t = sqrt(abar_t) * x_0 + sqrt(1 - abar_t) * eps\nloss = || eps - eps_theta(x_t, t, c) ||^2\neps_hat = eps_none + w * (eps_text - eps_none)</div>'+
         '<p>الخلاصة العملية: قيّم على <mark>slices</mark> (نوع الصورة، وجود نص، عدّ)، واختبر بصورة فاضية، وجرّب تقصّ المنطقة المهمة وتكبّرها، وخلّي بالك من <mark>contamination</mark> لأن كتير من الـ benchmarks البصرية متاحة على الويب.</p>'+
         '<p><mark>قبل المحاضرة 17</mark>: المحاضرة الجاية (17) هنفتح فيها الموديل ونشوف جواه إيه، فتأكد إنك فاهم بلوك الـ Transformer (الـ attention والـ residual connections، محاضرة 8)، وإن كل modality هنا بتنتهي كـ vectors في نفس الـ sequence.</p>',
         '<p><mark>Five points to remember</mark>:<br>1. We turn every modality into a sequence of vectors of the same size d and feed it to the same Transformer.<br>2. <mark>ViT</mark> cuts an image into patches, and each patch becomes a token.<br>3. <mark>CLIP</mark> aligns images and text with a contrastive loss, which gives us zero-shot classification.<br>4. <mark>LLaVA</mark> connects a vision encoder to an LLM through a projector, and trains in two stages.<br>5. <mark>Diffusion</mark> generates an image by removing the predicted noise step by step.</p>'+
         '<p>The key equations:</p>'+
         '<div class="m">N = (H / P) * (W / P)\nCLIP row i: -log( exp(S_ii) / sum_j exp(S_ij) )\nx_t = sqrt(abar_t) * x_0 + sqrt(1 - abar_t) * eps\nloss = || eps - eps_theta(x_t, t, c) ||^2\neps_hat = eps_none + w * (eps_text - eps_none)</div>'+
         '<p>The practical takeaway: evaluate on <mark>slices</mark> (image type, presence of text, counting), test with a blank image, try cropping and zooming into the important region, and watch out for <mark>contamination</mark> because many visual benchmarks are on the web.</p>'+
         '<p><mark>Before lecture 17</mark>: the next lecture (17) opens the model and looks inside, so make sure you understand the Transformer block (attention and residual connections, lecture 8), and that every modality here ends up as vectors in the same sequence.</p>')),
 q:[
   CQ("أنهي موديل بيتدرّب على مصفوفة N × N من الـ similarities، القطر فيها positives والباقي negatives؟","Which model trains on an N × N matrix of similarities, with positives on the diagonal and the rest negatives?",
   [["ViT","ViT"],["CLIP","CLIP"],["Whisper","Whisper"],["Diffusion","Diffusion"]],
   1,"ده الـ contrastive loss بتاع CLIP على batch من أزواج (صورة، caption).","That is the contrastive loss of CLIP on a batch of (image, caption) pairs."),
CQ("فيديو 30 ثانية بمعدل frame في الثانية و576 token لكل frame. كام visual token كلها؟","A 30-second video at one frame per second and 576 tokens per frame. How many visual tokens in total?",
   [["576","576"],["5,760","5,760"],["30,000","30,000"],["17,280","17,280"]],
   3,"30 × 576 = 17,280 token.","30 × 576 = 17,280 tokens.")
 ],
 f:[
   CF("إزاي بنوصّل صورة بـ LLM، في خطوات؟","How do we connect an image to an LLM, in steps?",
   "ViT بيطلّع features، والـ projector بيحوّلها لـ visual tokens بنفس بُعد الـ LLM، وبتتحط مع tokens الـ prompt. المرحلة 1: الـ projector بس بيتدرّب. المرحلة 2: الـ projector والـ LLM، والـ loss على tokens الإجابة.","The ViT outputs features, the projector turns them into visual tokens of the LLM size, and they sit with the prompt tokens. Stage 1: only the projector trains. Stage 2: the projector and the LLM, with the loss on the answer tokens."),
CF("إيه اللي أعمله علشان أقيّم موديل vision-language بجد؟","What should I do to evaluate a vision-language model properly?",
   "أقيّم على slices (نوع الصورة، وجود نص، عدّ)، وأجرّب صورة فاضية، وأقصّ المنطقة المهمة وأكبّرها، وأخلّي بالي من الـ contamination.","Evaluate on slices (image type, presence of text, counting), try a blank image, crop and zoom into the important region, and watch out for contamination.")
 ]}
]}
);

})();
