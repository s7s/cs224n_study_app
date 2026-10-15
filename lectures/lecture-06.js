/* Lecture 6: LSTMs, Seq2Seq & Machine Translation
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L6 fig: LSTM cell schematic */
function lstmFig(){
  var s='',bx=[46,134,222,310],lab=['forget f','input i','candidate','output o'],cap=['erase old','write new','new info','reveal'];
  s+=AL(8,36,352,36,'ac','mA')+T(8,24,'c_t-1','tb','start','fill:var(--ac)')+T(352,24,'c_t','tb','end','fill:var(--ac)');
  s+='<circle cx="46" cy="36" r="11" style="fill:var(--sf);stroke:var(--ac);stroke-width:1.8"/>'+T(46,41,'×','tb','middle')+
     '<circle cx="178" cy="36" r="11" style="fill:var(--sf);stroke:var(--ac);stroke-width:1.8"/>'+T(178,41,'+','tb','middle');
  bx.forEach(function(x,i){
    s+=RECT(x-38,106,76,34,'var(--sf)','var(--ok)',8,1.8)+T(x,127,lab[i],'','middle','font-size:11.5px')+T(x,158,cap[i],'tm','middle','font-size:10.5px');
  });
  s+=AL(46,104,46,49,'ok','mG')+AL(134,104,171,46,'ok','mG')+AL(222,104,185,46,'ok','mG')+AL(310,104,310,84,'ok','mG')+
     T(352,76,'h_t = o × tanh(c_t)','tm','end','font-size:11px');
  return s;
}

var FIG_LSTM=fig(168,lstmFig(),
  B('الخط الأزرق هو الـ cell state، الشريط اللي بيشيل الذاكرة. الـ forget gate بتمسح منه، والـ input gate بتكتب فيه معلومة جديدة، والـ output gate بتقرر إيه اللي يظهر.',
    'The blue line is the cell state, the tape that carries memory. The forget gate erases from it, the input gate writes new information into it, and the output gate decides what to reveal.'));

/* L6 fig: encoder-decoder */
function s2sFig(){
  var W1=['she','eats','an','apple'],W2=['&lt;s&gt;','elle','mange','une'],O=['elle','mange','une','pomme'],s='',i,x,c,enc;
  s+=T(6,16,'encoder','tb','start','fill:var(--ac)')+T(182,16,'decoder','tb','start','fill:var(--ok)');
  for(i=0;i<8;i++){
    x=6+i*44;c=x+17;enc=i<4;
    s+=RECT(x,80,34,34,'var(--sf)',enc?'var(--ac)':'var(--ok)',7,1.8)+T(c,131,enc?W1[i]:W2[i-4],'','middle','font-size:10.5px');
    if(!enc)s+=AL(c,78,c,58,'ok','mG')+T(c,50,O[i-4],'tb','middle','font-size:10.5px');
    if(i<7)s+=AL(x+34,97,x+44,97,i===3?'no':(enc?'ac':'ok'),i===3?'mN':(enc?'mA':'mG'));
  }
  s+='<line x1="177" y1="104" x2="177" y2="142" style="stroke:var(--no);stroke-width:1.5;stroke-dasharray:3 3"/>'+
     T(177,158,'the only link: one vector','tb','middle','fill:var(--no)')+T(177,176,'the whole source must fit inside it','tm','middle');
  return s;
}

var FIG_S2S=fig(184,s2sFig(),
  B('الـ encoder بيقرا she eats an apple ويطلّع state أخير، والـ decoder بيبدأ منه ويولّد الترجمة كلمة كلمة. الرابط الوحيد بينهم vector واحد (الـ bottleneck).',
    'The encoder reads she eats an apple and produces a final state; the decoder starts from it and generates the translation word by word. The only link between them is one vector (the bottleneck).'));

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

/* NOTE: in the original single page, lecture 6 and lecture 12 both declared beamFig / FIG_BEAM.
   The later one (lecture 12) won, so the original page showed that figure inside lecture 6 too.
   It is kept above exactly as it was and is now used by l6-beamex (the worked example).
   Lecture 6's own figure below matches the l6-beam text (was / hit) and is used by l6-beam. */
/* L6 fig: beam search tree, k = 2 */
function beamFigL6(){
  var N=[
    {x:4,y:76,w:60,t:'START',k:1},
    {x:104,y:36,w:84,t:'he −0.7',k:1},{x:104,y:116,w:84,t:'I −0.9',k:1},
    {x:236,y:8,w:84,t:'hit −1.7',k:1},{x:236,y:52,w:84,t:'struck −2.9',k:0},
    {x:236,y:96,w:84,t:'was −1.6',k:1},{x:236,y:140,w:84,t:'got −1.8',k:0}],
    E=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],s='';
  E.forEach(function(e){
    var a=N[e[0]],b=N[e[1]],d=!b.k;
    s+=AL(a.x+a.w,a.y+14,b.x-1,b.y+14,d?'mu':'ac',d?'mM':'mA',d);
  });
  N.forEach(function(n){
    s+=n.k?RECT(n.x,n.y,n.w,28,'var(--acs)','var(--ac)',8,1.8)+T(n.x+n.w/2,n.y+18,n.t,'tb','middle','font-size:11.5px')
          :'<rect x="'+n.x+'" y="'+n.y+'" width="'+n.w+'" height="28" rx="8" style="fill:none;stroke:var(--mu);stroke-width:1.5;stroke-dasharray:4 3"/>'+T(n.x+n.w/2,n.y+18,n.t,'tm','middle','font-size:11.5px');
  });
  s+=RECT(8,186,12,12,'var(--acs)','var(--ac)',3,1.5)+T(26,196,'kept (top k = 2)','','start','font-size:11px')+
     '<rect x="176" y="186" width="12" height="12" rx="3" style="fill:none;stroke:var(--mu);stroke-width:1.5;stroke-dasharray:3 2"/>'+T(194,196,'dropped','tm','start','font-size:11px');
  return s;
}

var FIG_BEAM_L6=fig(206,beamFigL6(),
  B('الرقم جنب كل كلمة هو مجموع الـ log probability لحد الخطوة دي. في الخطوة التانية بنحتفظ بأعلى 2 بس (was و hit).',
    'The number next to each word is the sum of log probabilities so far. At step two we keep only the top 2 (was and hit).'));

/* L6 fig: one LSTM step with numbers */
function lstmStepFig(){
  var s='',x=[4,100,196,292],lab=['c_t-1','after f','c_t','h_t'],val=['2.00','1.76','1.97','0.70'],i;
  for(i=0;i<4;i++){
    s+=RECT(x[i],34,64,38,'var(--sf)',i===3?'var(--ok)':'var(--ac)',8,1.8)+
       T(x[i]+32,49,lab[i],'tm','middle','font-size:10px')+T(x[i]+32,65,val[i],'tb','middle','font-size:13px');
  }
  s+=AL(68,53,98,53,'ac','mA')+AL(164,53,194,53,'ac','mA')+AL(260,53,290,53,'ac','mA');
  s+=T(83,28,'× 0.88','tb','middle','font-size:10.5px')+T(179,28,'+ 0.21','tb','middle','font-size:10.5px')+T(275,28,'tanh, × 0.73','tb','middle','font-size:10.5px');
  s+=RECT(118,104,124,36,'var(--sf)','var(--ok)',8,1.8)+T(180,119,'write: i × c~','tm','middle','font-size:10px')+
     T(180,133,'0.27 × 0.76 = 0.21','tb','middle','font-size:10.5px')+AL(180,104,180,58,'ok','mG');
  s+=T(6,114,'f = 0.88','tm','start','font-size:10.5px')+T(6,128,'i = 0.27','tm','start','font-size:10.5px')+
     T(354,114,'o = 0.73','tm','end','font-size:10.5px')+T(354,128,'c~ = 0.76','tm','end','font-size:10.5px');
  return s;
}

var FIG_LSTMSTEP=fig(146,lstmStepFig(),
  B('الخطوة بالأرقام: الذاكرة القديمة 2.00 بتتضرب في forget = 0.88 فتبقى 1.76، وبنجمع عليها المكتوب الجديد 0.21 فتبقى c_t = 1.97، وبعدين الـ output gate بتطلّع h_t = 0.70.',
    'The step in numbers: the old memory 2.00 is multiplied by forget = 0.88 to give 1.76, the newly written 0.21 is added to give c_t = 1.97, and then the output gate produces h_t = 0.70.'));

/* L6 fig: the seq2seq bottleneck */
function bottleFig(){
  var W=['she','eats','an','apple'],tx=[132,166,194,228],s='',i,cx;
  for(i=0;i<4;i++){
    cx=66+i*76;
    s+=RECT(cx-30,14,60,28,'var(--sf)','var(--ac)',7,1.8)+T(cx,32,W[i],'','middle','font-size:11px')+AL(cx,42,tx[i],82,'ac','mA');
  }
  s+=RECT(106,84,148,30,'var(--sf)','var(--no)',7,1.8)+T(180,103,'one fixed-size vector','tb','middle','font-size:10.5px;fill:var(--no)');
  s+=AL(180,114,180,136,'no','mN');
  s+=RECT(130,138,100,28,'var(--sf)','var(--ok)',7,1.8)+T(180,156,'decoder → pomme','tb','middle','font-size:10.5px');
  s+=AL(294,44,234,150,'ok','mG',true)+T(262,132,'wish: look','tb','start','font-size:10px;fill:var(--ok)')+T(262,145,'at apple only','tm','start','font-size:10px');
  return s;
}

var FIG_BOTTLE=fig(176,bottleFig(),
  B('كل كلمات المصدر بتتضغط في vector واحد ثابت الحجم قبل ما توصل للـ decoder. وهو بيكتب pomme نفسه محتاج كلمة apple تحديدًا، لكن معاه الملخص بس (الخط المنقّط هو اللي كنا نتمناه).',
    'All the source words are squeezed into one fixed-size vector before reaching the decoder. To write pomme it needs the word apple specifically, but it only has the summary (the dashed line is what we would wish for).'));

/* L6 fig: BLEU matches for a worked example */
function bleuFig(){
  var R=['the','cat','sat','on','the','mat'],M=['the','cat','sat','on','a','mat'],s='',i,x,hit;
  s+=T(10,16,'reference','tm','start','font-size:10.5px')+T(10,136,'model','tm','start','font-size:10.5px');
  for(i=0;i<6;i++){
    x=10+i*58;hit=(M[i]!=='a');
    s+=RECT(x,22,50,26,'var(--sf)','var(--ac)',6,1.6)+T(x+25,39,R[i],'','middle','font-size:11px');
    if(hit){
      s+=RECT(x,92,50,26,'var(--okbg)','var(--ok)',6,1.8)+T(x+25,109,M[i],'tb','middle','font-size:11px')+AL(x+25,50,x+25,90,'ok','mG');
    }else{
      s+='<rect x="'+x+'" y="92" width="50" height="26" rx="6" style="fill:none;stroke:var(--no);stroke-width:1.8;stroke-dasharray:4 3"/>'+
         T(x+25,109,M[i],'tm','middle','font-size:11px')+AL(x+25,50,x+25,90,'no','mN',true);
    }
  }
  s+=T(10,156,'1-grams: 5/6 = 0.83','tb','start','font-size:11px')+T(350,156,'2-grams: 3/5 = 0.60','tb','end','font-size:11px');
  return s;
}

var FIG_BLEU=fig(164,bleuFig(),
  B('المربعات الخضرا هي كلمات الموديل الموجودة في المرجع (5 من 6)، والمربع الأحمر المنقّط كلمة مش في المرجع. الأرقام تحت هي الـ precision للـ 1-grams والـ 2-grams.',
    'Green boxes are model words found in the reference (5 of 6), and the dashed red box is a word that is not in the reference. The numbers below are the 1-gram and 2-gram precision.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:6,t:B("LSTMs و Seq2Seq و الترجمة","LSTMs, Seq2Seq & Machine Translation"),cards:[

{id:"l6-lstm",t:B("LSTM: الذاكرة والبوابات","LSTM: memory and gates"),
 b:cat(B('<p>الـ RNN العادي بيعيد كتابة الـ hidden state كله في كل خطوة، فالمعلومة القديمة بتضيع بسهولة. الـ <mark>LSTM</mark> (Hochreiter و Schmidhuber، 1997) بيضيف <mark>cell state</mark> زي "شريط ذاكرة" بيعدّي على الخطوات، وبيتحكم فيه بـ <mark>gates</mark> (بوابات).</p>',
         '<p>A plain RNN rewrites its whole hidden state at every step, so old information is easily lost. The <mark>LSTM</mark> (Hochreiter and Schmidhuber, 1997) adds a <mark>cell state</mark>, a kind of memory tape that runs through the steps, controlled by <mark>gates</mark>.</p>'),
       FIG_LSTM,
       B('<p>البوابة بتطلّع رقم بين 0 و1 لكل عنصر: 0 معناها "امنع" و1 معناها "عدّي". فيه 3 بوابات: <mark>forget</mark> بتقرر إيه اللي يتمسح من الذاكرة، <mark>input</mark> بتقرر إيه اللي يتكتب فيها، و<mark>output</mark> بتقرر إيه اللي يظهر كـ hidden state.</p>',
         '<p>A gate outputs a number between 0 and 1 for each element: 0 means "block" and 1 means "let through". There are 3 gates: <mark>forget</mark> decides what to erase from memory, <mark>input</mark> decides what to write into it, and <mark>output</mark> decides what to reveal as the hidden state.</p>')),
 q:[CQ("البوابة (gate) في LSTM بتطلّع إيه؟","What does a gate in an LSTM output?",
      [["أرقام بين 0 و1 بتتحكم في كام من المعلومة يعدّي","Numbers between 0 and 1 controlling how much information passes"],["كلمة جديدة","A new word"],["قيمة الـ loss","The loss value"],["ترجمة الجملة","The translation of the sentence"]],
      0,"البوابة sigmoid، فبتدي قيم بين 0 (امنع) و1 (عدّي).","A gate is a sigmoid, so it gives values between 0 (block) and 1 (pass)."),
   CQ("لو الـ forget gate طلعت 0.1 لعنصر معين، إيه اللي يحصل لقيمته القديمة في الـ cell state؟","If the forget gate is 0.1 for some element, what happens to its old value in the cell state?",
   [["بتتضاعف 10 مرات","It is multiplied by 10"],["بتفضل زي ما هي","It stays unchanged"],["بتتضرب في 0.1 فبتتمسح تقريبًا","It is multiplied by 0.1, so it is almost erased"],["بتتحول لـ 1","It becomes 1"]],
   2,"الـ cell state القديمة بتتضرب في f، فمع f = 0.1 بيفضل 10% بس منها.","The old cell state is multiplied by f, so with f = 0.1 only 10% of it is left.")
 ],
 f:[CF("إيه هي البوابات التلاتة في LSTM ووظيفة كل واحدة؟","What are the three LSTM gates and what does each do?",
      "Forget: تمسح من الذاكرة. Input: تكتب معلومة جديدة. Output: تقرر إيه يظهر كـ hidden state.","Forget: erases from memory. Input: writes new information. Output: decides what to reveal as the hidden state."),
   CF("إيه هو الـ cell state في LSTM؟","What is the cell state in an LSTM?",
   "شريط الذاكرة اللي بيعدّي عبر الخطوات. بيتحدّث بالبوابات بدل ما يتعاد كتابته كله في كل خطوة.","The memory tape running through the steps. The gates update it instead of rewriting all of it at each step.")
 ],
 terms:[
   {t:B("LSTM","LSTM"),
 d:B("Long Short-Term Memory: RNN بيضيف cell state وبوابات عشان يحافظ على المعلومة لمدى أطول.","Long Short-Term Memory: an RNN that adds a cell state and gates to keep information over longer spans.")},
{t:B("Cell state","Cell state"),
 d:B("شريط الذاكرة جوه الـ LSTM، بيتحدّث بالبوابات.","The memory tape inside an LSTM, updated through the gates.")},
{t:B("Gate","Gate"),
 d:B("رقم بين 0 و1 (sigmoid) بيتحكم في كام من المعلومة يعدّي.","A number between 0 and 1 (a sigmoid) that controls how much information passes.")},
{t:B("Forget gate","Forget gate"),
 d:B("بتقرر إيه اللي يتمسح من الـ cell state.","Decides what to erase from the cell state.")},
{t:B("Input gate","Input gate"),
 d:B("بتقرر إيه اللي يتكتب في الـ cell state.","Decides what to write into the cell state.")},
{t:B("Output gate","Output gate"),
 d:B("بتقرر كام من الـ cell state يظهر كـ hidden state.","Decides how much of the cell state is revealed as the hidden state.")}
 ]},

{id:"l6-lstmeq",t:B("معادلات الـ LSTM","The LSTM equations"),
 b:cat(B('<p>في كل خطوة بنحسب البوابات من الـ hidden state السابق والمدخل الحالي (بـ sigmoid فالناتج بين 0 و1):</p>'+
     '<div class="m">f_t = σ(W_f [h_{t-1}, x_t] + b_f)   forget\ni_t = σ(W_i [h_{t-1}, x_t] + b_i)   input\no_t = σ(W_o [h_{t-1}, x_t] + b_o)   output\nc~_t = tanh(W_c [h_{t-1}, x_t] + b_c)   new content</div>'+
     '<p>وبعدين نحدّث الذاكرة والـ hidden state:</p>'+
     '<div class="m">c_t = f_t * c_{t-1} + i_t * c~_t\nh_t = o_t * tanh(c_t)</div>'+
     '<p>العلامة <code>*</code> ضرب عنصر بعنصر. لاحظ إن تحديث الذاكرة <mark>بالجمع</mark>: بنحتفظ بجزء من القديم ونضيف جزء جديد.</p>',
     '<p>At each step we compute the gates from the previous hidden state and the current input (with a sigmoid, so the result is between 0 and 1):</p>'+
     '<div class="m">f_t = σ(W_f [h_{t-1}, x_t] + b_f)   forget\ni_t = σ(W_i [h_{t-1}, x_t] + b_i)   input\no_t = σ(W_o [h_{t-1}, x_t] + b_o)   output\nc~_t = tanh(W_c [h_{t-1}, x_t] + b_c)   new content</div>'+
     '<p>Then we update the memory and the hidden state:</p>'+
     '<div class="m">c_t = f_t * c_{t-1} + i_t * c~_t\nh_t = o_t * tanh(c_t)</div>'+
     '<p>The sign <code>*</code> is element-wise multiplication. Note that the memory update is <mark>additive</mark>: we keep part of the old and add part of the new.</p>'),
       B('<p><mark>غلطة شائعة:</mark> الخلط بين <code>c_t</code> و <code>h_t</code>. الـ <code>c_t</code> ذاكرة داخلية، والـ <code>h_t</code> هو اللي بيطلع بعد الـ output gate وبيستخدمه باقي الشبكة.</p>',
  '<p><mark>Common mistake:</mark> mixing up <code>c_t</code> and <code>h_t</code>. The <code>c_t</code> is internal memory, and <code>h_t</code> is what comes out after the output gate and what the rest of the network uses.</p>')),
 q:[CQ("لو الـ forget gate كلها 1 والـ input gate كلها 0، إيه اللي يحصل للـ cell state؟","If the forget gate is all 1s and the input gate is all 0s, what happens to the cell state?",
      [["بتفضل زي ما هي: c_t = c_{t-1}","It stays unchanged: c_t = c_{t-1}"],["بتتمسح","It is erased"],["بتتضاعف","It doubles"],["بتبقى عشوائية","It becomes random"]],
      0,"c_t = 1 * c_{t-1} + 0 * c~_t = c_{t-1}.","c_t = 1 * c_{t-1} + 0 * c~_t = c_{t-1}."),
   CQ("لو f = 0.5 و c_{t-1} = 4 و i = 0.5 و c~ = 1، كام c_t؟","If f = 0.5, c_{t-1} = 4, i = 0.5 and c~ = 1, what is c_t?",
   [["4.5","4.5"],["2","2"],["2.5","2.5"],["5","5"]],
   2,"c_t = 0.5 * 4 + 0.5 * 1 = 2 + 0.5 = 2.5.","c_t = 0.5 * 4 + 0.5 * 1 = 2 + 0.5 = 2.5.")
 ],
 f:[CF("إيه معادلة تحديث الـ cell state في LSTM؟","What is the LSTM cell state update equation?",
      "c_t = f_t * c_{t-1} + i_t * c~_t. جمع جزء من القديم (forget) وجزء من الجديد (input).","c_t = f_t * c_{t-1} + i_t * c~_t. It adds part of the old (forget) and part of the new (input)."),
   CF("إيه معادلة الـ hidden state في LSTM وإيه معناها؟","What is the LSTM hidden state equation and what does it mean?",
   "h_t = o_t * tanh(c_t). الـ output gate بتقرر كام من الذاكرة (بعد tanh) يظهر كـ hidden state.","h_t = o_t * tanh(c_t). The output gate decides how much of the memory (after tanh) is revealed as the hidden state.")
 ],
 terms:[
   {t:B("Element-wise product","Element-wise product"),
 d:B("ضرب عنصر في عنصر بنفس الموضع في vectorين. الرمز ⊙ (أو <code>*</code> في الكود).","Multiplying two vectors position by position. Written ⊙ (or <code>*</code> in code).")}
 ]},

{id:"l6-lstmstep",t:B("خطوة LSTM كاملة بأرقام","One LSTM step, worked with numbers"),
 b:cat(
   B('<p>خلّينا نمشي خطوة LSTM واحدة بالأرقام، بـ hidden size = 1. افترض <code>c_{t-1} = 2.00</code>، والقيم قبل الـ activation (الناتجة من <code>W[h_{t-1}, x_t] + b</code>) هي: forget = 2 و input = -1 و output = 1 و candidate = 1.</p>'+
     '<div class="m">f = σ(2) = 0.88    keep 88% of the old memory\ni = σ(-1) = 0.27   write 27% of the new content\no = σ(1) = 0.73    reveal 73% of the memory\nc~ = tanh(1) = 0.76   the candidate content</div>',
     '<p>Let us run one LSTM step with numbers, using hidden size = 1. Say <code>c_{t-1} = 2.00</code>, and the pre-activation values (from <code>W[h_{t-1}, x_t] + b</code>) are: forget = 2, input = -1, output = 1, candidate = 1.</p>'+
     '<div class="m">f = σ(2) = 0.88    keep 88% of the old memory\ni = σ(-1) = 0.27   write 27% of the new content\no = σ(1) = 0.73    reveal 73% of the memory\nc~ = tanh(1) = 0.76   the candidate content</div>'),
   FIG_LSTMSTEP,
   B('<div class="m">c_t = 0.88 * 2.00 + 0.27 * 0.76 = 1.76 + 0.21 = 1.97\nh_t = 0.73 * tanh(1.97) = 0.73 * 0.96 = 0.70</div>'+
     '<p>الذاكرة القديمة اتحفظ أغلبها. ولو الـ forget كانت 0.1 بدل كده، يبقى <code>c_t = 0.2 + 0.21 = 0.41</code>: الذاكرة القديمة بتتمسح تقريبًا.</p>'+
     '<p><mark>غلطة شائعة:</mark> إن البوابة مفتاح تشغيل وإيقاف قاطع. البوابات أرقام ناعمة بين 0 و1، فالذاكرة بتتحفظ جزئيًا وبتتكتب جزئيًا.</p>',
     '<div class="m">c_t = 0.88 * 2.00 + 0.27 * 0.76 = 1.76 + 0.21 = 1.97\nh_t = 0.73 * tanh(1.97) = 0.73 * 0.96 = 0.70</div>'+
     '<p>Most of the old memory survived. With forget = 0.1 instead, <code>c_t = 0.2 + 0.21 = 0.41</code>: the old memory is almost erased.</p>'+
     '<p><mark>Common mistake:</mark> thinking a gate is a hard on/off switch. Gates are soft numbers between 0 and 1, so memory is partly kept and partly written.</p>')),
 q:[
   CQ("في المثال، لو الـ input gate كانت 0 بدل 0.27، كام يبقى c_t؟","In the example, if the input gate were 0 instead of 0.27, what would c_t be?",
      [["1.97","1.97"],["1.76","1.76"],["2.00","2.00"],["0.76","0.76"]],
      1,"c_t = 0.88 * 2.00 + 0 * 0.76 = 1.76: بنحتفظ بجزء من القديم من غير ما نكتب جديد.","c_t = 0.88 * 2.00 + 0 * 0.76 = 1.76: we keep part of the old memory and write nothing new."),
   CQ("لو الـ output gate طلعت 0 في خطوة معينة، إيه اللي يحصل؟","If the output gate is 0 at some step, what happens?",
      [["h_t = c_t","h_t = c_t"],["الـ c_t بتتمسح كمان","c_t is erased too"],["h_t = 0 لكن الـ c_t بتفضل محفوظة","h_t = 0 but c_t is still stored"],["الـ forget gate بتبقى 0","The forget gate becomes 0"]],
      2,"h_t = 0 * tanh(c_t) = 0، لكن الـ c_t مش اتمسحت، فالذاكرة لسه موجودة للخطوات الجاية.","h_t = 0 * tanh(c_t) = 0, but c_t is not erased, so the memory is still there for later steps.")
 ],
 f:[
   CF("إيه ترتيب حساب خطوة LSTM واحدة؟","In what order do we compute one LSTM step?",
      "بنحسب البوابات f و i و o والـ candidate c~ من h_{t-1} و x_t. بعدين c_t = f * c_{t-1} + i * c~. وبعدين h_t = o * tanh(c_t).","We compute the gates f, i, o and the candidate c~ from h_{t-1} and x_t. Then c_t = f * c_{t-1} + i * c~. Then h_t = o * tanh(c_t)."),
   CF("لو f = 0.88 و c_{t-1} = 2 و i = 0.27 و c~ = 0.76، كام c_t؟","If f = 0.88, c_{t-1} = 2, i = 0.27 and c~ = 0.76, what is c_t?",
      "c_t = 0.88 * 2 + 0.27 * 0.76 = 1.76 + 0.21 = 1.97.","c_t = 0.88 * 2 + 0.27 * 0.76 = 1.76 + 0.21 = 1.97.")
 ]},

{id:"l6-gru",t:B("ليه LSTM بيساعد، و GRU والتوسعات","Why LSTM helps, plus GRU and extensions"),
 b:cat(B('<p>لأن تحديث الـ cell state بالجمع، فلو الـ forget gate قريبة من 1 المعلومة والـ gradient بيعدّوا عبر خطوات كتير تقريبًا من غير ما يتضربوا في مصفوفات صغيرة. يعني فيه "طريق مختصر" للمعلومة.</p>'+
     '<p>ده مش بيحل المشكلة بشكل مضمون، لكن LSTM بيتعامل مع الاعتماد الطويل أحسن بكتير من RNN عادي.</p>'+
     '<p><mark>GRU</mark> نسخة أبسط ببوابتين (update و reset) ومن غير cell state منفصل، وأداؤها غالبًا قريب من LSTM.</p>'+
     '<p>وفيه توسعات: <mark>bidirectional RNN</mark> بيقرا الجملة في الاتجاهين ويدمج النتيجتين (مناسب لما نشوف الجملة كلها، مش للـ language modeling)، و<mark>multi-layer RNN</mark> بيرص طبقات فوق بعض.</p>',
     '<p>Because the cell state update is additive, if the forget gate is close to 1, information and the gradient pass through many steps almost without being multiplied by small matrices. That gives information a shortcut.</p>'+
     '<p>This does not guarantee a fix, but the LSTM handles long dependencies far better than a plain RNN.</p>'+
     '<p>The <mark>GRU</mark> is a simpler variant with two gates (update and reset) and no separate cell state, and it often performs close to the LSTM.</p>'+
     '<p>Extensions: a <mark>bidirectional RNN</mark> reads the sentence in both directions and combines the results (suited to cases where we see the whole sentence, not to language modeling), and a <mark>multi-layer RNN</mark> stacks layers on top of each other.</p>'),
       B('<p><mark>غلطة شائعة:</mark> افتراض إن GRU أحسن من LSTM دايمًا، أو العكس. مفيش واحد أحسن في كل الحالات، والاختيار تجريبي. الـ GRU عدد الـ parameters فيه أقل (3 كتل weights مقابل 4 في الـ LSTM)، فكل خطوة أرخص شوية.</p>',
  '<p><mark>Common mistake:</mark> assuming the GRU is always better than the LSTM, or the reverse. There is no consistent winner, so the choice is empirical. The GRU has fewer parameters (3 weight blocks versus 4 in the LSTM), so each step is a bit cheaper.</p>')),
 q:[CQ("ليه الـ bidirectional RNN مش مناسب للـ language modeling؟","Why is a bidirectional RNN unsuitable for language modeling?",
      [["لأنه بيشوف الكلمات الجاية اللي المفروض نتنبأ بيها","Because it sees the future words we are supposed to predict"],["لأنه بطيء بس","Because it is only slow"],["لأنه ملوش hidden state","Because it has no hidden state"],["لأنه بيحتاج GRU","Because it requires a GRU"]],
      0,"في الـ LM مفيش مستقبل متاح، والاتجاه العكسي بيغش بقراءة الكلمة الجاية.","In an LM the future is unavailable, and the backward direction would cheat by reading the next word."),
   CQ("إيه الصح عن الـ GRU مقارنة بالـ LSTM؟","Which statement about the GRU compared with the LSTM is correct?",
   [["بـ 3 بوابات وفيه cell state منفصل","It has three gates and a separate cell state"],["من غير أي بوابات","It has no gates"],["بيشتغل بس في الاتجاهين","It works only bidirectionally"],["ببوابتين (update و reset) ومن غير cell state منفصل","It has two gates (update and reset) and no separate cell state"]],
   3,"الـ GRU نسخة أبسط: بوابتين ومن غير cell state منفصل.","The GRU is the simpler variant: two gates and no separate cell state.")
 ],
 f:[CF("ليه الـ LSTM بيتعامل مع الاعتماد الطويل أحسن من RNN عادي؟","Why does the LSTM handle long dependencies better than a plain RNN?",
      "تحديث الـ cell state بالجمع بيدي طريق مختصر للمعلومة والـ gradient لما الـ forget gate قريبة من 1.","The additive cell state update gives information and gradients a shortcut when the forget gate is near 1."),
   CF("إيه هو الـ bidirectional RNN ومتى منقدرش نستخدمه؟","What is a bidirectional RNN and when can we not use it?",
   "بيقرا الجملة في الاتجاهين ويدمج الـ hidden states. مش بنستخدمه في الـ language modeling أو التوليد لأن الاتجاه العكسي محتاج الكلمات الجاية.","It reads the sentence in both directions and combines the hidden states. We cannot use it for language modeling or generation, because the backward direction needs the future words.")
 ],
 terms:[
   {t:B("GRU","GRU"),
 d:B("Gated Recurrent Unit: نسخة أبسط من LSTM ببوابتين (update و reset) ومن غير cell state منفصل.","Gated Recurrent Unit: a simpler LSTM variant with two gates (update and reset) and no separate cell state.")},
{t:B("Bidirectional RNN","Bidirectional RNN"),
 d:B("RNN أمامي وRNN خلفي، وبنلصق الـ hidden states بتاعتهم عند كل موضع. مش بيناسب التوليد.","A forward and a backward RNN whose hidden states are concatenated at each position. It does not fit generation.")},
{t:B("Multi-layer RNN","Multi-layer RNN"),
 d:B("RNN بطبقات متكدسة: الـ hidden states بتاعة طبقة هي مدخل الطبقة اللي فوقها.","An RNN with stacked layers: the hidden states of one layer are the input of the layer above.")}
 ]},

{id:"l6-seq2seq",t:B("Seq2seq: الترجمة بـ encoder و decoder","Seq2seq: translation with an encoder and a decoder"),
 b:cat(B('<p><mark>Machine translation</mark> مهمة تحويل تسلسل لتسلسل. الحل (Sutskever وآخرين، 2014) هو <mark>seq2seq</mark>: شبكتين RNN.</p>'+
         '<p>الـ <mark>encoder</mark> بيقرا الجملة المصدر ويطلّع hidden state أخير يلخصها. الـ <mark>decoder</mark> بيبدأ من الـ state ده وبيولّد الجملة الهدف كلمة كلمة، وكل كلمة بيتنبأ بيها بتتغذى كمدخل للخطوة الجاية، لحد ما يولّد رمز النهاية.</p>',
         '<p><mark>Machine translation</mark> is a sequence-to-sequence task. The solution (Sutskever et al., 2014) is <mark>seq2seq</mark>: two RNNs.</p>'+
         '<p>The <mark>encoder</mark> reads the source sentence and produces a final hidden state that summarizes it. The <mark>decoder</mark> starts from that state and generates the target sentence word by word, feeding each predicted word back as the next input, until it produces an end token.</p>'),
       FIG_S2S,
       B('<p>الـ decoder هنا هو language model مشروط بالجملة المصدر: <code>P(y_t | y_1..y_{t-1}, x)</code>. وعيبه الواضح إن الجملة كلها لازم تتضغط في vector واحد (<mark>bottleneck</mark>)، وده اللي هنحله بالـ attention.</p>',
         '<p>The decoder is a language model conditioned on the source sentence: <code>P(y_t | y_1..y_{t-1}, x)</code>. Its obvious weakness is that the whole sentence must be squeezed into one vector (the <mark>bottleneck</mark>), which attention will fix.</p>')),
 q:[CQ("إيه الـ bottleneck في seq2seq الأساسي؟","What is the bottleneck in a basic seq2seq model?",
      [["الجملة المصدر كلها متلخصة في vector واحد بين الـ encoder والـ decoder","The whole source sentence is summarized in one vector between encoder and decoder"],["الـ decoder بطيء","The decoder is slow"],["مفيش embeddings","There are no embeddings"],["الـ vocabulary صغير","The vocabulary is small"]],
      0,"كل المعلومة لازم تعدّي من state واحد، فالجمل الطويلة بتتأثر.","All the information must pass through a single state, so long sentences suffer."),
   CQ("وقت الترجمة، إيه اللي بيتغذى للـ decoder كمدخل في الخطوة التانية؟","At translation time, what is fed to the decoder as input at its second step?",
   [["الكلمة اللي هو نفسه ولّدها في الخطوة الأولى","The word it generated itself at the first step"],["الجملة المصدر كلها من جديد","The whole source sentence again"],["الترجمة المرجعية","The reference translation"],["رقم عشوائي","A random number"]],
   0,"الـ decoder بيتغذى بآخر كلمة ولّدها، وبيبدأ من الـ state الأخير بتاع الـ encoder.","The decoder is fed the last word it generated, and it starts from the encoder's final state.")
 ],
 f:[CF("إزاي seq2seq بيشتغل وإيه عيبه الأساسي؟","How does seq2seq work and what is its main weakness?",
      "Encoder بيلخص المصدر في state أخير، والـ decoder بيولّد الهدف كلمة كلمة منه. العيب: bottleneck لأن كل حاجة في vector واحد.","An encoder summarizes the source into a final state, and the decoder generates the target word by word from it. Weakness: a bottleneck, since everything sits in one vector."),
   CF("الـ decoder في seq2seq هو أي نوع موديل؟","What kind of model is the decoder in seq2seq?",
   "language model مشروط بالجملة المصدر: P(y_t | y_1..y_{t-1}, x).","A language model conditioned on the source sentence: P(y_t | y_1..y_{t-1}, x).")
 ],
 terms:[
   {t:B("Machine translation","Machine translation"),
 d:B("مهمة ترجمة جملة من لغة لتانية، وهي مهمة تسلسل لتسلسل.","The task of translating a sentence from one language to another, a sequence-to-sequence task.")},
{t:B("Seq2seq","Seq2seq"),
 d:B("موديل تسلسل لتسلسل من شبكتين RNN: encoder بيلخص المصدر و decoder بيولّد الهدف.","A sequence-to-sequence model made of two RNNs: an encoder that summarizes the source and a decoder that generates the target.")},
{t:B("Encoder","Encoder"),
 d:B("الجزء اللي بيقرا الجملة المصدر ويطلّع منها hidden state بيلخصها.","The part that reads the source sentence and produces a hidden state that summarizes it.")},
{t:B("Decoder","Decoder"),
 d:B("الجزء اللي بيولّد الجملة الهدف كلمة كلمة، وبيبدأ من الـ state بتاع الـ encoder.","The part that generates the target sentence word by word, starting from the encoder's state.")}
 ]},

{id:"l6-bottleneck",t:B("الـ bottleneck: ليه vector واحد مش كفاية","The bottleneck: why one vector is not enough"),
 b:cat(
   B('<p>في seq2seq الأساسي، الـ decoder بيشوف المصدر من خلال <mark>الـ hidden state الأخير</mark> للـ encoder بس. الـ vector ده حجمه ثابت (مثلًا 512 رقم) سواء الجملة 5 كلمات أو 50.</p>',
     '<p>In basic seq2seq, the decoder sees the source only through the encoder\'s <mark>final hidden state</mark>. That vector has a fixed size (say 512 numbers) whether the sentence has 5 words or 50.</p>'),
   FIG_BOTTLE,
   B('<p>تخيّل تلخّص صفحة كاملة في ملاحظة طولها ثابت: كل ما الصفحة تطول تفاصيل أكتر بتضيع. بالتقريب 512 رقم لـ 5 كلمات يعني حوالي 100 رقم للكلمة، لكن لـ 50 كلمة حوالي 10 بس. ده حدس وليس قانون دقيق للسعة.</p>'+
     '<p>والضرر من ناحيتين. الكلمات الأولى لازم تعدّي خطوات RNN كتير قبل الـ state الأخير. والـ decoder محتاج أجزاء <mark>مختلفة</mark> من المصدر في لحظات مختلفة: عشان يكتب <code>pomme</code> محتاج <code>apple</code>، لكن معاه الملخص المطموس بس.</p>'+
     '<p>عمليًا جودة الترجمة بتقل مع طول الجملة المصدر (Cho وآخرين، 2014؛ Bahdanau وآخرين، 2015). وتكبير الـ vector بيفيد جزئيًا بس، لأنه لسه ملخص واحد.</p>'+
     '<p>الحل في المحاضرة الجاية: <mark>attention</mark>. نخلّي الـ decoder يبص على <mark>كل</mark> حالات الـ encoder، مش آخر واحدة بس.</p>',
     '<p>Think of summarizing a whole page in a note of fixed length: the longer the page, the more detail is lost. Roughly, 512 numbers for 5 words is about 100 numbers per word, but for 50 words only about 10. This is an intuition, not an exact capacity law.</p>'+
     '<p>It hurts in two ways. The early words must survive many RNN steps before the final state. And the decoder needs <mark>different</mark> parts of the source at different moments: to write <code>pomme</code> it needs <code>apple</code>, but it only has the blurred summary.</p>'+
     '<p>Empirically, translation quality drops as the source sentence gets longer (Cho et al., 2014; Bahdanau et al., 2015). Enlarging the vector helps only partly, since it is still one summary.</p>'+
     '<p>The fix, in the next lecture: <mark>attention</mark>. Let the decoder look at <mark>all</mark> the encoder states, not only the last one.</p>')),
 q:[
   CQ("في seq2seq الأساسي، لجملة من 5 كلمات ولجملة من 50 كلمة، حجم الـ vector اللي بيوصل للـ decoder...","In basic seq2seq, for a 5-word sentence and a 50-word sentence, the size of the vector that reaches the decoder is...",
      [["بيزيد مع طول الجملة","grows with the sentence length"],["ثابت في الحالتين","the same fixed size in both cases"],["بيصغر مع طول الجملة","shrinks with the sentence length"],["صفر، الـ decoder بيشوف الكلمات مباشرة","zero: the decoder sees the words directly"]],
      1,"الـ state الأخير حجمه ثابت، فالجملة الطويلة بتتضغط في نفس المساحة.","The final state has a fixed size, so a long sentence is squeezed into the same space."),
   CQ("إيه الفكرة اللي هتحل الـ bottleneck في المحاضرة الجاية؟","What idea will fix the bottleneck in the next lecture?",
      [["نشيل الـ encoder","Remove the encoder"],["نصغّر الـ vocabulary","Shrink the vocabulary"],["نستخدم greedy decoding بس","Use greedy decoding only"],["نخلّي الـ decoder يبص على كل حالات الـ encoder (attention)","Let the decoder look at all the encoder states (attention)"]],
      3,"الـ attention بيدي الـ decoder وصول لكل حالات الـ encoder في كل خطوة.","Attention gives the decoder access to all encoder states at every step.")
 ],
 f:[
   CF("ليه الـ bottleneck بيضر الجمل الطويلة؟","Why does the bottleneck hurt long sentences?",
      "لأن الجملة كلها لازم تتضغط في vector ثابت الحجم، فالتفاصيل بتضيع والـ decoder مبيقدرش يرجع لكلمة معينة في المصدر.","Because the whole sentence must be squeezed into a fixed-size vector, so details are lost and the decoder cannot go back to a specific source word."),
   CF("إيه الحل اللي هنشوفه للـ bottleneck؟","What is the fix for the bottleneck that we will see?",
      "Attention: الـ decoder بيبص على كل حالات الـ encoder في كل خطوة، مش آخر state بس.","Attention: at every step the decoder looks at all the encoder states, not only the last one.")
 ],
 terms:[
   {t:B("Bottleneck","Bottleneck"),
    d:B("نقطة ضيقة بتعدّي منها المعلومة كلها. في seq2seq الأساسي هي الـ vector الواحد بين الـ encoder والـ decoder.","A narrow point that all the information must pass through. In basic seq2seq it is the single vector between the encoder and the decoder.")},
   {t:B("Final hidden state","Final hidden state"),
    d:B("الـ hidden state بتاع الـ encoder بعد آخر كلمة في المصدر، وهو الرابط الوحيد للـ decoder في seq2seq الأساسي.","The encoder's hidden state after the last source word; in basic seq2seq it is the only link to the decoder.")}
 ]},

{id:"l6-beam",t:B("Decoding: greedy و beam search","Decoding: greedy and beam search"),
 b:cat(B('<p>بعد التدريب، إزاي نولّد الترجمة؟ الأبسط <mark>greedy decoding</mark>: في كل خطوة ناخد الكلمة الأعلى احتمالًا. عيبه إن كلمة كويسة دلوقتي ممكن توصلنا لجملة وحشة بعد كده، ومفيش رجوع.</p>'+
         '<p><mark>Beam search</mark>: بنحتفظ بـ <code>k</code> فرضيات (جمل جزئية) في كل خطوة، وبنقيّم كل فرضية بمجموع الـ log probabilities:</p>'+
         '<div class="m">score(y_1..y_t) = sum_i log P(y_i | y_1..y_{i-1}, x)</div>',
         '<p>After training, how do we generate the translation? The simplest is <mark>greedy decoding</mark>: at each step take the most probable word. Its weakness is that a word that looks good now can lead to a bad sentence later, with no way back.</p>'+
         '<p><mark>Beam search</mark>: we keep <code>k</code> hypotheses (partial sentences) at each step, and score each by the sum of log probabilities:</p>'+
         '<div class="m">score(y_1..y_t) = sum_i log P(y_i | y_1..y_{i-1}, x)</div>'),
       FIG_BEAM_L6,
       B('<p>في المثال k = 2. في الخطوة التانية فيه 4 احتمالات، بنحتفظ بأعلى 2 (was و hit) ونرمي الباقي. الـ k الشائع من 5 لـ 10. بنوقف لما الفرضية تولّد رمز النهاية، وبنعمل normalize للـ score على الطول عشان الجمل الطويلة ماتتظلمش (كل كلمة بتنقص السكور).</p>',
         '<p>In the example k = 2. At step two there are 4 options; we keep the top 2 (was and hit) and drop the rest. Typical k is 5 to 10. We stop when a hypothesis produces the end token, and normalize the score by length so long sentences are not penalized (every word lowers the score).</p>')),
 q:[CQ("في beam search بـ k = 2، كام فرضية بنحتفظ بيها بعد كل خطوة؟","In beam search with k = 2, how many hypotheses do we keep after each step?",
      [["2","2"],["1","1"],["4","4"],["كلها","All of them"]],
      0,"k هو عدد الفرضيات اللي بنحتفظ بيها: أعلى 2 score.","k is the number of hypotheses we keep: the top 2 by score."),
   CQ("ليه بنعمل normalize للـ score على طول الجملة في beam search؟","Why do we normalize the score by sentence length in beam search?",
   [["عشان نسرّع الحساب","To speed up the computation"],["لأن كل كلمة بتضيف log probability سالب، فالجمل الطويلة بتاخد سكور أقل ظلمًا","Because every word adds a negative log probability, so long sentences get an unfairly lower score"],["عشان نحذف الكلمات النادرة","To remove rare words"],["عشان k يبقى أكبر","To make k larger"]],
   1,"الـ log probability سالبة، فكل كلمة بتنقص المجموع. من غير normalize الموديل بيفضّل الجمل القصيرة.","Log probabilities are negative, so each word lowers the sum. Without normalization the model prefers short sentences.")
 ],
 f:[CF("إيه الفرق بين greedy decoding و beam search؟","What is the difference between greedy decoding and beam search?",
      "Greedy بياخد أعلى كلمة كل خطوة ومفيش رجوع. Beam search بيحتفظ بـ k فرضيات بأعلى مجموع log probability.","Greedy takes the top word at each step with no way back. Beam search keeps k hypotheses with the highest summed log probability."),
   CF("إيه الـ k الشائع في beam search، وإيه اللي بيتغير لو كبّرناه؟","What is a typical k in beam search, and what changes if we increase it?",
   "عادة من 5 لـ 10. k أكبر بيفحص فرضيات أكتر (ممكن يلاقي جملة بسكور أعلى) لكن بيكلّف حساب أكتر.","Usually 5 to 10. A larger k explores more hypotheses (and can find a higher-scoring sentence) but costs more computation.")
 ],
 terms:[
   {t:B("Greedy decoding","Greedy decoding"),
 d:B("في كل خطوة بنختار الكلمة الأعلى احتمالًا، ومفيش رجوع.","At each step we pick the most probable word, with no way back.")},
{t:B("Beam search","Beam search"),
 d:B("بنحتفظ بـ k فرضيات جزئية في كل خطوة ونقيّمها بمجموع الـ log probabilities.","We keep k partial hypotheses at each step and score them by the sum of log probabilities.")},
{t:B("Hypothesis","Hypothesis"),
 d:B("جملة جزئية (أو كاملة) بنحتفظ بيها أثناء الـ beam search ومعاها السكور بتاعها.","A partial (or complete) sentence kept during beam search, together with its score.")},
{t:B("Length normalization","Length normalization"),
 d:B("قسمة السكور على طول الجملة عشان الجمل الطويلة ماتتظلمش.","Dividing the score by the sentence length so long sentences are not penalized.")}
 ]},

{id:"l6-beamex",t:B("مثال beam search بـ k = 2 خطوة بخطوة","Beam search with k = 2, step by step"),
 b:cat(
   B('<p>الـ beam search بـ <code>k = 2</code>. الـ greedy بيمشي في مسار واحد، والـ beam بيحافظ على أحسن جملتين جزئيتين. الأرقام تحت هي احتمال المسار كله لحد دلوقتي (توضيحية).</p>',
     '<p>Beam search with <code>k = 2</code>. Greedy follows a single path, while beam keeps the 2 best partial sentences alive. The numbers below are the probability of the whole path so far (illustrative).</p>'),
   FIG_BEAM,
   B('<div class="m">step 1: the = 0.50, a = 0.40      keep both (k = 2)\nstep 2: the cat = 0.50 * 0.40 = 0.20\n        the dog = 0.50 * 0.30 = 0.15   pruned\n        a good  = 0.40 * 0.90 = 0.36\n        a nice  = 0.40 * 0.05 = 0.02   pruned\nkeep: a good (0.36), the cat (0.20)</div>'+
     '<p>الـ greedy اختار <code>the</code> (0.50) في الأول، فأقصى حاجة يوصلها <code>the cat</code> = 0.20. الـ beam حافظ على <code>a</code> كمان، ولقى <code>a good</code> = 0.36.</p>'+
     '<p>عمليًا بنجمع الـ log probabilities: (-0.92) + (-0.11) = -1.02، وده نفسه log 0.36.</p>'+
     '<p><mark>غلطة شائعة:</mark> إن الـ beam بيعمل بحثين منفصلين. في كل خطوة بعد الأولى بنحسب سكور كل الامتدادات <code>k * V</code> مع بعض (V حجم الـ vocabulary) ونحتفظ بأحسن k منهم. وكمان مش مضمون يلاقي أحسن جملة على الإطلاق.</p>',
     '<div class="m">step 1: the = 0.50, a = 0.40      keep both (k = 2)\nstep 2: the cat = 0.50 * 0.40 = 0.20\n        the dog = 0.50 * 0.30 = 0.15   pruned\n        a good  = 0.40 * 0.90 = 0.36\n        a nice  = 0.40 * 0.05 = 0.02   pruned\nkeep: a good (0.36), the cat (0.20)</div>'+
     '<p>Greedy took <code>the</code> (0.50) first, so the best it can reach is <code>the cat</code> = 0.20. Beam also kept <code>a</code>, and found <code>a good</code> = 0.36.</p>'+
     '<p>In practice we add log probabilities: (-0.92) + (-0.11) = -1.02, which is exactly log 0.36.</p>'+
     '<p><mark>Common mistake:</mark> thinking beam runs two separate searches. At each step after the first we score all <code>k * V</code> continuations together (V is the vocabulary size) and keep the best k overall. It is also not guaranteed to find the single best sentence.</p>')),
 q:[
   CQ("في المثال، ليه greedy ماوصلش لـ a good؟","In the example, why did greedy never reach a good?",
      [["لأنه اختار the (الأعلى) في الخطوة الأولى وماحتفظش بـ a","Because it picked the (the highest) at step one and did not keep a"],["لأن good كلمة نادرة","Because good is a rare word"],["لأن k كان 3","Because k was 3"],["لأن a good احتماله أقل من the cat","Because a good has a lower probability than the cat"]],
      0,"الـ greedy بيحتفظ بمسار واحد بس، فبعد ما اختار the مفيش رجوع لـ a.","Greedy keeps only one path, so after choosing the there is no way back to a."),
   CQ("لو k = 2 والـ vocabulary 3 كلمات، كام امتداد بنحسب سكوره في الخطوة التانية؟","With k = 2 and a 3-word vocabulary, how many continuations do we score at step two?",
      [["3","3"],["2","2"],["6","6"],["9","9"]],
      2,"2 فرضيات * 3 كلمات = 6 امتدادات، وبنحتفظ بأعلى 2 منهم.","2 hypotheses * 3 words = 6 continuations, and we keep the top 2 of them.")
 ],
 f:[
   CF("إزاي beam search بـ k = 2 بيختار الفرضيات في كل خطوة؟","How does beam search with k = 2 pick hypotheses at each step?",
      "بيحسب سكور كل امتداد لكل فرضية محتفَظ بيها (k * V اختيار)، وبيحتفظ بأعلى 2 بس ويرمي الباقي.","It scores every continuation of every kept hypothesis (k * V options), keeps only the top 2 and drops the rest."),
   CF("ليه beam search ممكن يلاقي ترجمة أحسن من greedy؟","Why can beam search find a better translation than greedy?",
      "لأنه بيسيب مسارات تانية عايشة. مسار بدايته أقل احتمالًا (a = 0.40) ممكن يطلع أعلى في الآخر (a good = 0.36 مقابل the cat = 0.20).","Because it keeps other paths alive. A path that starts less probable (a = 0.40) can end higher (a good = 0.36 versus the cat = 0.20).")
 ]},

{id:"l6-bleu",t:B("BLEU: تقييم الترجمة","BLEU: evaluating translation"),
 b:cat(B('<p>إزاي نقيّم ترجمة آلية؟ بنقارنها بترجمة بشرية مرجعية. الـ <mark>BLEU</mark> بيحسب <mark>n-gram precision</mark>: كام نسبة من الـ n-grams (من كلمة لـ 4 كلمات) في ترجمة الموديل موجودة في المرجع.</p>'+
     '<p>ومن غير علاج، موديل ممكن يطلّع ترجمة قصيرة جدًا كلها كلمات صح ويغش السكور. عشان كده فيه <mark>brevity penalty</mark> بتعاقب الترجمة القصيرة.</p>'+
     '<div class="m">reference: the cat sat on the mat\nmodel:     the cat sat\nunigram precision = 3/3 = 100%\n(but too short, so BLEU is penalized)</div>'+
     '<p>BLEU مفيد وسريع، بس محدود: مش بيفهم المعنى ولا المرادفات. ترجمة صحيحة بكلمات مختلفة بتاخد سكور أقل.</p>',
     '<p>How do we evaluate a machine translation? We compare it with a human reference translation. <mark>BLEU</mark> computes <mark>n-gram precision</mark>: the share of n-grams (1 to 4 words) in the model\'s translation that also appear in the reference.</p>'+
     '<p>Without a fix, a model could output a very short translation made only of correct words and game the score. That is why there is a <mark>brevity penalty</mark> that punishes short output.</p>'+
     '<div class="m">reference: the cat sat on the mat\nmodel:     the cat sat\nunigram precision = 3/3 = 100%\n(but too short, so BLEU is penalized)</div>'+
     '<p>BLEU is useful and fast but limited: it understands neither meaning nor synonyms. A correct translation with different words gets a lower score.</p>'),
       B('<p><mark>غلطة شائعة:</mark> استخدام BLEU على جملة واحدة. هو مصمم للحساب على مجموعة كبيرة من الجمل، وعلى جملة واحدة بيبقى غير مستقر.</p>',
  '<p><mark>Common mistake:</mark> using BLEU on a single sentence. It is designed to be computed over a large set of sentences, and on one sentence it is unstable.</p>')),
 q:[CQ("ليه BLEU فيه brevity penalty؟","Why does BLEU include a brevity penalty?",
      [["عشان الترجمة القصيرة ماتاخدش precision عالية بالغش","So short outputs cannot get high precision by cheating"],["عشان تسرّع الحساب","To speed up computation"],["عشان تحذف الكلمات النادرة","To remove rare words"],["عشان تحسب الـ perplexity","To compute perplexity"]],
      0,"ترجمة من كلمتين صح ممكن تاخد precision 100% من غير ما تترجم الجملة.","A two-word correct output could get 100% precision without translating the sentence."),
   CQ("ترجمة صحيحة تمامًا بس بكلمات مرادفة مش موجودة في المرجع. BLEU هيعمل إيه؟","A fully correct translation uses synonyms that are not in the reference. What will BLEU do?",
   [["هيديها سكور أعلى","Give it a higher score"],["هيفهم إنها مرادفات ويديها السكور الكامل","Understand the synonyms and give the full score"],["هيديها سكور أقل من اللي تستحقه","Give it a lower score than it deserves"],["هيرفضها","Reject it"]],
   2,"BLEU بيعدّ n-grams المتطابقة بس، مش بيفهم المعنى.","BLEU only counts matching n-grams and does not understand meaning.")
 ],
 f:[CF("إيه هو BLEU وإيه حدوده؟","What is BLEU and what are its limits?",
      "بيقيس n-gram precision مقابل مرجع بشري مع brevity penalty. حدوده: مش بيفهم المعنى ولا المرادفات.","It measures n-gram precision against a human reference with a brevity penalty. Limits: it understands neither meaning nor synonyms."),
   CF("ليه مينفعش نثق في BLEU على جملة واحدة؟","Why should we not rely on BLEU for a single sentence?",
   "BLEU مصمم لحساب على مجموعة كبيرة من الجمل. على جملة واحدة بيبقى غير مستقر (لو مفيش 4-gram واحد متطابق السكور بيبقى 0).","BLEU is designed to be computed over a large set of sentences. On a single sentence it is unstable (if no 4-gram matches, the score is 0).")
 ],
 terms:[
   {t:B("BLEU","BLEU"),
 d:B("مقياس تقييم للترجمة الآلية: n-gram precision مقابل مرجع بشري، مع brevity penalty.","A machine translation metric: n-gram precision against a human reference, with a brevity penalty.")},
{t:B("n-gram","n-gram"),
 d:B("تسلسل من n كلمات متتالية (1-gram كلمة واحدة، 2-gram كلمتين...).","A sequence of n consecutive words (a 1-gram is one word, a 2-gram is two words, and so on).")},
{t:B("n-gram precision","n-gram precision"),
 d:B("نسبة الـ n-grams في ترجمة الموديل اللي موجودة في المرجع.","The share of the n-grams in the model's translation that also appear in the reference.")},
{t:B("Brevity penalty","Brevity penalty"),
 d:B("عقوبة في BLEU للترجمة الأقصر من المرجع، علشان القصيرة ماتغشش في الـ precision.","A BLEU penalty for output shorter than the reference, so short output cannot game the precision.")},
{t:B("Reference translation","Reference translation"),
 d:B("ترجمة بشرية بنقارن بيها ترجمة الموديل.","A human translation we compare the model's translation against.")}
 ]},

{id:"l6-bleunum",t:B("حساب BLEU بالأرقام","Computing BLEU with numbers"),
 b:cat(
   B('<p>خلّينا نحسب BLEU على مثال. المرجع: <code>the cat sat on the mat</code>. الموديل: <code>the cat sat on a mat</code>.</p>',
     '<p>Let us compute BLEU on an example. Reference: <code>the cat sat on the mat</code>. Model: <code>the cat sat on a mat</code>.</p>'),
   FIG_BLEU,
   B('<div class="m">1-grams: 5 of 6 match      p1 = 5/6 = 0.83\n2-grams: 3 of 5 match      p2 = 3/5 = 0.60\n  (the cat, cat sat, sat on)\nsame length, so BP = 1\nBLEU-2 = 1 * sqrt(0.83 * 0.60) = 0.71</div>'+
     '<p>BLEU الحقيقي بيستخدم عادة n من 1 لـ 4: <code>BLEU = BP * (p1 p2 p3 p4)^(1/4)</code>. الـ BP بتساوي 1 لو الموديل أطول من المرجع أو بنفس طوله، وغير كده <code>exp(1 - r/c)</code> (c طول الموديل و r طول المرجع).</p>'+
     '<p>الموديل القصير <code>the cat sat</code> فيه p1 = 3/3، لكن c = 3 و r = 6، فـ BP = exp(1 - 2) = 0.37، و BLEU-1 = 0.37.</p>'+
     '<p><mark>غلطة شائعة:</mark> تكرار كلمة عشان ترفع الـ precision. BLEU بيقصّ عدد تكرار كل n-gram عند عدده في المرجع (clipping): <code>the the the the the the</code> بتاخد 2/6 مش 6/6.</p>',
     '<div class="m">1-grams: 5 of 6 match      p1 = 5/6 = 0.83\n2-grams: 3 of 5 match      p2 = 3/5 = 0.60\n  (the cat, cat sat, sat on)\nsame length, so BP = 1\nBLEU-2 = 1 * sqrt(0.83 * 0.60) = 0.71</div>'+
     '<p>Real BLEU usually uses n from 1 to 4: <code>BLEU = BP * (p1 p2 p3 p4)^(1/4)</code>. BP is 1 if the model is at least as long as the reference, otherwise <code>exp(1 - r/c)</code> (c is the model length and r the reference length).</p>'+
     '<p>The short model <code>the cat sat</code> has p1 = 3/3, but c = 3 and r = 6, so BP = exp(1 - 2) = 0.37, and BLEU-1 = 0.37.</p>'+
     '<p><mark>Common mistake:</mark> repeating a word to inflate precision. BLEU clips each n-gram count at its count in the reference (clipping): <code>the the the the the the</code> gets 2/6, not 6/6.</p>')),
 q:[
   CQ("ترجمة طولها 4 كلمات والمرجع 8 كلمات. كام الـ brevity penalty؟","A translation has 4 words and the reference has 8. What is the brevity penalty?",
      [["1.0","1.0"],["0.5","0.5"],["0.0","0.0"],["0.37","0.37"]],
      3,"BP = exp(1 - r/c) = exp(1 - 8/4) = exp(-1) = 0.37.","BP = exp(1 - r/c) = exp(1 - 8/4) = exp(-1) = 0.37."),
   CQ("الموديل طلّع <code>the the the the</code> والمرجع فيه <code>the</code> مرتين بس. كام الـ 1-gram precision بعد الـ clipping؟","The model outputs <code>the the the the</code> and the reference contains <code>the</code> only twice. What is the 1-gram precision after clipping?",
      [["1.0","1.0"],["0.5","0.5"],["0.25","0.25"],["0.75","0.75"]],
      1,"بنقصّ العدد عند 2: precision = 2/4 = 0.5.","We clip the count at 2: precision = 2/4 = 0.5.")
 ],
 f:[
   CF("إيه هي صيغة BLEU وإيه الـ brevity penalty؟","What is the BLEU formula and what is the brevity penalty?",
      "BLEU = BP * (p1 p2 p3 p4)^(1/4). الـ BP = min(1, exp(1 - r/c)): c طول الموديل و r طول المرجع.","BLEU = BP * (p1 p2 p3 p4)^(1/4). BP = min(1, exp(1 - r/c)), where c is the model length and r the reference length."),
   CF("إيه هو الـ clipping في BLEU؟","What is clipping in BLEU?",
      "بنقصّ عدد تكرار كل n-gram عند أقصى عدد ظهر بيه في المرجع، عشان تكرار كلمة صح مايرفعش الـ precision.","We cap each n-gram's count at the most times it appears in the reference, so repeating a correct word does not raise the precision.")
 ],
 terms:[
   {t:B("Clipped precision","Clipped precision"),
    d:B("الـ n-gram precision بعد قص عدد تكرار كل n-gram عند عدده في المرجع.","The n-gram precision after capping each n-gram's count at its count in the reference.")}
 ]},

{id:"l6-recap",t:B("Recap: ملخص المحاضرة 6","Recap: lecture 6 summary"),
 b:B('<p><mark>5 نقاط:</mark></p>'+
     '<p>1. الـ <mark>LSTM</mark> بيضيف cell state و3 بوابات sigmoid (forget و input و output) للتحكم في الذاكرة.</p>'+
     '<p>2. التحديث بالجمع بيدي المعلومة والـ gradient طريق مختصر. بيساعد لكن مش ضمان. والـ GRU نسخة أخف.</p>'+
     '<p>3. <mark>Seq2seq</mark>: encoder بيلخص المصدر و decoder بيولّد الهدف كلمة كلمة. الـ vector الواحد هو الـ bottleneck.</p>'+
     '<p>4. التوليد: greedy بياخد أعلى كلمة كل خطوة، و beam search بيحتفظ بـ k فرضيات بمجموع الـ log probability.</p>'+
     '<p>5. <mark>BLEU</mark> = n-gram precision مع brevity penalty. سريع لكن مش بيفهم المعنى.</p>'+
     '<div class="m">c_t = f * c_{t-1} + i * c~\nh_t = o * tanh(c_t)\nscore(y_1..y_t) = sum_i log P(y_i | y_1..y_{i-1}, x)\nBLEU = BP * (p1 p2 p3 p4)^(1/4)</div>'+
     '<p><mark>قبل المحاضرة 7:</mark> لازم تقدر تحسب خطوة LSTM بإيدك، وتشرح ليه vector واحد بيحدّ من الجمل الطويلة، وتنفّذ beam search بـ k = 2. الجاي: نشيل الـ bottleneck بالـ attention.</p>',
     '<p><mark>5 points:</mark></p>'+
     '<p>1. The <mark>LSTM</mark> adds a cell state and 3 sigmoid gates (forget, input, output) to control memory.</p>'+
     '<p>2. The additive update gives information and gradients a shortcut. It helps but is no guarantee. The GRU is a lighter variant.</p>'+
     '<p>3. <mark>Seq2seq</mark>: an encoder summarizes the source and a decoder generates the target word by word. The single vector is the bottleneck.</p>'+
     '<p>4. Decoding: greedy takes the top word at each step, and beam search keeps k hypotheses by summed log probability.</p>'+
     '<p>5. <mark>BLEU</mark> = n-gram precision with a brevity penalty. Fast, but blind to meaning.</p>'+
     '<div class="m">c_t = f * c_{t-1} + i * c~\nh_t = o * tanh(c_t)\nscore(y_1..y_t) = sum_i log P(y_i | y_1..y_{i-1}, x)\nBLEU = BP * (p1 p2 p3 p4)^(1/4)</div>'+
     '<p><mark>Before lecture 7:</mark> be able to compute an LSTM step by hand, explain why one vector limits long sentences, and run beam search with k = 2. Next: we remove the bottleneck with attention.</p>'),
 q:[
   CQ("إيه العلاقة الصح بين الـ cell state والـ hidden state في LSTM؟","Which relation between the cell state and the hidden state of an LSTM is correct?",
      [["h_t = o_t * tanh(c_t)","h_t = o_t * tanh(c_t)"],["h_t = f_t * c_t","h_t = f_t * c_t"],["c_t = o_t * h_t","c_t = o_t * h_t"],["h_t = c_{t-1}","h_t = c_{t-1}"]],
      0,"الـ output gate بتضرب tanh(c_t) فبتطلّع الـ hidden state.","The output gate multiplies tanh(c_t) to produce the hidden state."),
   CQ("beam search بـ k = 1 بيبقى مكافئ لإيه؟","Beam search with k = 1 is equivalent to what?",
      [["BLEU","BLEU"],["GRU","GRU"],["greedy decoding","greedy decoding"],["bidirectional RNN","bidirectional RNN"]],
      2,"بنحتفظ بفرضية واحدة بس وناخد أعلى كلمة كل خطوة، يعني greedy.","We keep a single hypothesis and take the top word at each step, which is greedy decoding.")
 ],
 f:[
   CF("لخّص المحاضرة 6 في 3 جمل","Summarize lecture 6 in 3 sentences",
      "الـ LSTM بيحمي الذاكرة بـ cell state وبوابات. الـ seq2seq بيترجم بـ encoder و decoder لكن بيتخنق في vector واحد. بنولّد بـ beam search ونقيّم بـ BLEU.","The LSTM protects memory with a cell state and gates. Seq2seq translates with an encoder and a decoder but chokes on a single vector. We decode with beam search and evaluate with BLEU."),
   CF("إيه اللي لازم تعرفه قبل المحاضرة 7 (attention)؟","What should you know before lecture 7 (attention)?",
      "إزاي الـ encoder-decoder بيشتغل، وليه الـ vector الواحد bottleneck، وإزاي نحسب خطوة LSTM وbeam search بالأرقام.","How an encoder-decoder works, why one vector is a bottleneck, and how to compute an LSTM step and beam search with numbers.")
 ]}
]}
);

})();
