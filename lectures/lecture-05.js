/* Lecture 5: Language Models & RNNs
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L5 fig: next word distribution */
function lmFig(){
  var R=[['books',0.43],['laptops',0.27],['exams',0.18],['minds',0.09],['zoo',0.03]],s=T(8,20,'the students opened their ___','tb');
  R.forEach(function(r,i){
    var y=38+i*30;
    s+=T(84,y+15,r[0],'','end')+RECT(92,y,r[1]*480,22,'var(--ac)','none',4)+T(92+r[1]*480+6,y+15,Math.round(r[1]*100)+'%','tm');
  });
  return s;
}

var FIG_LM=fig(194,lmFig(),
  B('توزيع احتمالات توضيحي (أرقام افتراضية) للكلمة اللي جاية بعد الجملة دي.',
    'An illustrative probability distribution (made-up numbers) for the word that follows.'));

/* L5 fig: unrolled RNN */
function rnnFig(){
  var cx=[60,145,230,315],W=['the','students','opened','their'],s='';
  cx.forEach(function(x,i){
    s+=RECT(x-28,92,56,34,'var(--sf)','var(--ac)',8,1.8)+T(x,113,'h'+(i+1),'tb','middle');
    s+=AL(x,164,x,128,'mu','mM')+T(x,182,W[i],'','middle','font-size:11.5px');
    s+=AL(x,90,x,66,'ok','mG')+T(x,58,'ŷ'+(i+1),'tb','middle','fill:var(--ok)');
    if(i<3)s+=AL(x+28,109,cx[i+1]-28,109,'ac','mA');
    if(i===0)s+=T(102,102,'W_h','tm','middle','font-size:10px');
  });
  s+=T(180,20,'same weights at every step','tm','middle');
  return s;
}

var FIG_RNN=fig(194,rnnFig(),
  B('الـ RNN مفرود على 4 خطوات: كل h بياخد h اللي قبله والكلمة الحالية، وكل خطوة بتتنبأ بالكلمة الجاية (ŷ).',
    'An RNN unrolled over 4 steps: each h takes the previous h and the current word, and each step predicts the next word (ŷ).'));

/* L5 fig: vanishing gradient */
function vanFig(){
  var s='',i,h;
  for(i=0;i<9;i++){
    h=120*Math.pow(0.6,i);
    s+=RECT(30+i*34,140-h,26,h,'var(--ac)','none',3)+T(43+i*34,156,String(i),'tm','middle','font-size:11px');
  }
  s+='<line x1="24" y1="140" x2="340" y2="140" style="stroke:var(--mu);stroke-width:1.2"/>'+T(30,14,'gradient size','tm')+T(180,176,'steps back from the loss','tm','middle');
  return s;
}

var FIG_VAN=fig(186,vanFig(),
  B('كل خطوة رجوع بتضرب الـ gradient في رقم أقل من 1 (هنا 0.6)، فبعد كام خطوة الإشارة بتقرب من الصفر. الأرقام توضيحية.',
    'Each step back multiplies the gradient by a number below 1 (here 0.6), so after a few steps the signal approaches zero. Numbers are illustrative.'));

/* L5 fig: teacher forcing vs generation */
function tfFig(){
  var X=[24,108,192,276],A=['the','students','opened','their'],G=['the','students','opened','there'],s='';
  s+=T(8,18,'training: the input is the true word','tb');
  s+=T(8,98,'generation: the input is its own prediction','tb');
  X.forEach(function(x,i){
    var bad=(i===3);
    s+=RECT(x,28,56,30,'var(--sf)','var(--ac)',7,1.8)+T(x+28,48,A[i],'','middle','font-size:11px');
    s+=RECT(x,108,56,30,'var(--sf)',bad?'var(--no)':'var(--ac)',7,1.8)+T(x+28,128,G[i],'','middle','font-size:11px'+(bad?';fill:var(--no)':''));
    if(i<3){
      s+=AL(x+56,43,X[i+1],43,'ac','mA');
      s+=AL(x+56,123,X[i+1],123,i===2?'no':'ac',i===2?'mN':'mA');
    }
  });
  s+=T(8,166,'one wrong word = a prefix unseen in training','tm');
  return s;
}

var FIG_TF=fig(180,tfFig(),
  B('فوق: وقت التدريب كل مدخل هو الكلمة الحقيقية. تحت: وقت التوليد لو الموديل غلط في كلمة (there بدل their) الخطوة اللي بعدها بتبدأ من سياق عمره ما شافه.',
    'Top: in training every input is the true word. Bottom: in generation, if the model slips on one word (there instead of their), the next step starts from a context it has never seen.'));

/* L5 fig: sequence tagging */
function tagFig(){
  var cx=[60,145,230,315],W=['Sara','works','at','Google'],G=['B-PER','O','O','B-ORG'],s='';
  cx.forEach(function(x,i){
    var ent=(G[i]!=='O'),col=ent?'ok':'mu',mk=ent?'mG':'mM';
    s+=RECT(x-28,92,56,34,'var(--sf)','var(--ac)',8,1.8)+T(x,113,'h'+(i+1),'tb','middle');
    s+=AL(x,164,x,128,'mu','mM')+T(x,182,W[i],'','middle','font-size:11.5px');
    s+=AL(x,90,x,66,col,mk)+T(x,58,G[i],'tb','middle','fill:var(--'+col+')');
    if(i<3)s+=AL(x+28,109,cx[i+1]-28,109,'ac','mA');
  });
  s+=T(180,20,'one tag per word','tm','middle');
  return s;
}

var FIG_TAG=fig(194,tagFig(),
  B('الـ RNN بيطلّع tag واحد لكل كلمة: B-PER بداية اسم شخص، B-ORG بداية اسم جهة، و O يعني مش كيان.',
    'The RNN outputs one tag per word: B-PER begins a person name, B-ORG begins an organization, and O means not an entity.'));

/* L5 fig: bidirectional context */
function biFig(){
  var cx=[36,108,180,252,324],W=['the','movie','was','terribly','exciting'],s='',st='stroke-width:2.2';
  cx.forEach(function(x,i){
    var hot=(i===3);
    s+=RECT(x-30,84,60,30,hot?'var(--ac)':'var(--sf)','var(--ln)',7)+T(x,104,W[i],hot?'tb':'','middle','font-size:11px'+(hot?';fill:var(--bg)':''));
  });
  s+='<line x1="36" y1="84" x2="36" y2="62" style="stroke:var(--ac);'+st+'"/><line x1="36" y1="62" x2="252" y2="62" style="stroke:var(--ac);'+st+'"/>'+AL(252,62,252,82,'ac','mA');
  s+='<line x1="324" y1="114" x2="324" y2="136" style="stroke:var(--ok);'+st+'"/><line x1="324" y1="136" x2="252" y2="136" style="stroke:var(--ok);'+st+'"/>'+AL(252,136,252,116,'ok','mG');
  s+=T(144,52,'forward RNN: left context','tm','middle')+T(240,158,'backward RNN: right context','tm','middle');
  return s;
}

var FIG_BI=fig(170,biFig(),
  B('عند كلمة terribly: الـ RNN الأمامي شاف الكلمات اللي قبلها، والخلفي شاف اللي بعدها (exciting)، فالـ hidden state الأخيرة بتجمع الاتنين.',
    'At the word terribly: the forward RNN has read the words before it, the backward RNN has read the words after it (exciting), so the final hidden state combines both.'));

/* L5 fig: stacked RNN */
function stackFig(){
  var cx=[100,190,280],W=['the','students','opened'],s='';
  cx.forEach(function(x,i){
    s+=RECT(x-28,112,56,32,'var(--sf)','var(--ac)',8,1.8)+T(x,133,'h(1)','tb','middle');
    s+=RECT(x-28,58,56,32,'var(--sf)','var(--ok)',8,1.8)+T(x,79,'h(2)','tb','middle');
    s+=AL(x,170,x,146,'mu','mM')+T(x,188,W[i],'','middle','font-size:11.5px');
    s+=AL(x,110,x,92,'ac','mA');
    s+=AL(x,56,x,36,'ok','mG');
    if(i<2)s+=AL(x+28,128,cx[i+1]-28,128,'ac','mA')+AL(x+28,74,cx[i+1]-28,74,'ok','mG');
  });
  s+=T(6,132,'layer 1','tm','start','font-size:10px')+T(6,78,'layer 2','tm','start','font-size:10px')+T(190,24,'prediction from the top layer','tm','middle');
  return s;
}

var FIG_STACK=fig(198,stackFig(),
  B('طبقتين من الـ RNN: الـ hidden state بتاعة الطبقة الأولى عند كل خطوة هي مدخل الطبقة التانية، والتنبؤ بيطلع من الطبقة العليا.',
    'Two RNN layers: the hidden state of layer 1 at each step is the input of layer 2, and the prediction comes from the top layer.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:5,t:B("Language Models و RNNs","Language Models & RNNs"),cards:[

{id:"l5-lm",t:B("Language model: نتنبأ بالكلمة الجاية","Language model: predicting the next word"),
 b:cat(B('<p>الـ <mark>language model (LM)</mark> بيتنبأ بالكلمة الجاية بناءً على اللي قبلها: <code>P(x_{t+1} | x_1, ..., x_t)</code>. زي الـ autocomplete في الكيبورد.</p>',
         '<p>A <mark>language model (LM)</mark> predicts the next word given the words before it: <code>P(x_{t+1} | x_1, ..., x_t)</code>. Think of keyboard autocomplete.</p>'),
       FIG_LM,
       B('<p>وكمان بيدي احتمال لأي جملة كاملة بضرب احتمالات كل كلمة:</p>'+
         '<div class="m">P(x_1, ..., x_T) = product_t P(x_t | x_1, ..., x_{t-1})</div>'+
         '<p>الـ LM هو أساس أغلب الموديلات الكبيرة اللي بنشوفها دلوقتي، زي GPT.</p>',
         '<p>It also assigns a probability to any full sentence by multiplying the probability of each word:</p>'+
         '<div class="m">P(x_1, ..., x_T) = product_t P(x_t | x_1, ..., x_{t-1})</div>'+
         '<p>The LM is the foundation of most large models we see today, such as GPT.</p>')),
 q:[CQ("الـ language model بيحسب...","A language model computes...",
      [["احتمال الكلمة الجاية بعد السياق","The probability of the next word given the context"],["ترجمة الجملة","The translation of the sentence"],["الـ head لكل كلمة","The head of each word"],["حجم الـ vocabulary","The vocabulary size"]],
      0,"الـ LM بيدي توزيع احتمالات على الكلمة الجاية.","An LM gives a probability distribution over the next word."),
   CQ("لجملة من 3 كلمات، الاحتمالات الشرطية 0.5 و0.2 و0.1. إيه الاحتمال اللي الـ LM بيدّيه للجملة كلها؟","A sentence has 3 words with conditional probabilities 0.5, 0.2 and 0.1. What probability does the LM assign to the whole sentence?",
   [["0.01","0.01"],["0.8","0.8"],["0.1","0.1"],["0.27","0.27"]],
   0,"بنضرب الاحتمالات: 0.5 * 0.2 * 0.1 = 0.01.","We multiply them: 0.5 * 0.2 * 0.1 = 0.01.")],
 f:[CF("إيه هو الـ language model؟","What is a language model?",
      "موديل بيتنبأ بتوزيع احتمالات الكلمة الجاية من الكلمات اللي قبلها، وبيدي احتمال لأي نص بضرب احتمالات كلماته.","A model that predicts the probability distribution of the next word from the words before it, and assigns a probability to any text by multiplying its word probabilities."),
   CF("إزاي الـ LM بيحسب احتمال جملة كاملة؟","How does an LM compute the probability of a full sentence?",
   "بيضرب احتمال كل كلمة بشرط الكلمات اللي قبلها: P(x_1..x_T) = product_t P(x_t | x_1..x_{t-1}).","It multiplies the probability of each word given the words before it: P(x_1..x_T) = product_t P(x_t | x_1..x_{t-1}).")],
 terms:[
   {t:B("Language model (LM)","Language model (LM)"),
    d:B("موديل بيدّي توزيع احتمالات للكلمة الجاية بناءً على اللي قبلها، وبالتالي احتمال لأي نص.","A model that gives a probability distribution over the next word given the words before it, and so a probability for any text.")}
 ]},

{id:"l5-ngram",t:B("n-gram language models","n-gram language models"),
 b:B('<p>الطريقة القديمة قبل الـ neural nets اسمها <mark>n-gram</mark>. بنفترض إن الكلمة الجاية بتعتمد بس على آخر <code>n-1</code> كلمة (<mark>Markov assumption</mark>) وبنعدّ من نص كبير:</p>'+
     '<div class="m">P(w | students opened their) =\n  count(students opened their w) / count(students opened their)</div>'+
     '<p>المشاكل:</p>'+
     '<p><mark>Sparsity</mark>: لو التتابع ده ماظهرش قبل كده في النص، احتماله صفر (ومحتاجين smoothing و backoff). <mark>التخزين</mark>: كل ما n يكبر الجدول بيتضخم. <mark>السياق قصير</mark>: n صغير، فبنفقد الاعتماد على كلمات بعيدة.</p>',
     '<p>The old method before neural nets is the <mark>n-gram</mark>. We assume the next word depends only on the last <code>n-1</code> words (the <mark>Markov assumption</mark>) and count from a large text:</p>'+
     '<div class="m">P(w | students opened their) =\n  count(students opened their w) / count(students opened their)</div>'+
     '<p>The problems:</p>'+
     '<p><mark>Sparsity</mark>: if a sequence never appeared in the text, its probability is zero (so we need smoothing and backoff). <mark>Storage</mark>: the table explodes as n grows. <mark>Short context</mark>: n is small, so we lose long-range dependencies.</p>'),
 q:[CQ("ليه صعب نزوّد n في الـ n-gram؟","Why is it hard to increase n in an n-gram model?",
      [["الجدول بيتضخم والتتابعات النادرة احتمالها صفر","The table explodes and rare sequences get zero probability"],["بيبطّأ الـ GPU بس","It only slows down the GPU"],["بيتحول لـ RNN","It turns into an RNN"],["بيقلل السياق","It shortens the context"]],
      0,"كل ما n يكبر، التتابعات الممكنة بتزيد جدًا ومعظمها ماظهرش في النص.","As n grows the possible sequences multiply and most never appear in the text."),
   CQ("في n-gram: count(students opened their) = 200 و count(students opened their books) = 50. كام P(books | students opened their)؟","In an n-gram model: count(students opened their) = 200 and count(students opened their books) = 50. What is P(books | students opened their)?",
   [["0.25","0.25"],["4","4"],["0.5","0.5"],["0.05","0.05"]],
   0,"50 / 200 = 0.25.","50 / 200 = 0.25.")],
 f:[CF("إيه عيوب الـ n-gram language model؟","What are the drawbacks of an n-gram language model?",
      "Sparsity (احتمال صفر لتتابعات ماظهرتش)، التخزين بيتضخم مع n، والسياق قصير.","Sparsity (zero probability for unseen sequences), storage that explodes with n, and a short context."),
   CF("إيه هي الـ Markov assumption في الـ n-gram؟","What is the Markov assumption in an n-gram model?",
   "إن الكلمة الجاية بتعتمد بس على آخر n-1 كلمة، مش على الجملة كلها.","That the next word depends only on the last n-1 words, not on the whole sentence.")],
 terms:[
   {t:B("n-gram language model","n-gram language model"),
    d:B("LM بيحسب احتمال الكلمة الجاية بعدّ ظهور آخر n-1 كلمة من نص كبير.","An LM that estimates the next-word probability by counting occurrences of the last n-1 words in a large text.")},
   {t:B("Markov assumption","Markov assumption"),
    d:B("افتراض إن الكلمة الجاية بتعتمد بس على آخر n-1 كلمة.","The assumption that the next word depends only on the last n-1 words.")},
   {t:B("Sparsity (n-gram)","Sparsity (n-gram)"),
    d:B("تتابعات كتير ماظهرتش في النص فاحتمالها صفر، وده بيحتاج smoothing وbackoff.","Many sequences never appear in the text so their probability is zero, which calls for smoothing and backoff.")}
 ]},

{id:"l5-fixedwindow",t:B("Fixed-window neural LM","Fixed-window neural LM"),
 b:B('<p>Bengio وآخرين (2003): ناخد آخر k كلمات، نحوّل كل كلمة لـ embedding، نلصقهم ببعض، ونمررهم على hidden layer وبعدها softmax على الـ vocabulary.</p>'+
     '<div class="m">e = [e_1; e_2; e_3; e_4]\nh = f(W e + b)\ny = softmax(U h + c)</div>'+
     '<p>ده حل مشكلة الـ sparsity (كلمات متشابهة ليها embeddings متشابهة) ومش محتاجين نخزن n-grams. لكن لسه فيه مشاكل: النافذة <mark>ثابتة</mark> وصغيرة، وكل موضع في النافذة ليه أوزان مختلفة في <code>W</code> فمفيش تشارك (الكلمة بتتعامل بشكل مختلف حسب موضعها). عايزين شبكة تقبل مدخل بأي طول.</p>',
     '<p>Bengio et al. (2003): take the last k words, turn each into an embedding, concatenate them, and pass them through a hidden layer and then a softmax over the vocabulary.</p>'+
     '<div class="m">e = [e_1; e_2; e_3; e_4]\nh = f(W e + b)\ny = softmax(U h + c)</div>'+
     '<p>This fixes sparsity (similar words have similar embeddings) and we no longer store n-grams. But problems remain: the window is <mark>fixed</mark> and small, and each position in the window has its own weights in <code>W</code>, so nothing is shared (a word is treated differently depending on where it sits). We want a network that accepts input of any length.</p>'),
 q:[CQ("إيه عيب الـ fixed-window LM؟","What is a drawback of the fixed-window LM?",
      [["النافذة ثابتة وصغيرة وكل موضع ليه أوزان لوحده","The window is small and fixed, and each position has its own weights"],["محتاج تخزين n-grams","It needs to store n-grams"],["مفيهوش embeddings","It has no embeddings"],["بيدي احتمال صفر","It gives zero probability"]],
      0,"مش بيقبل سياق أطول من النافذة، وأوزان المواضع مش متشاركة.","It cannot use context beyond the window, and weights are not shared across positions."),
   CQ("fixed-window LM نافذته k = 4 وكل embedding حجمه 100. كام حجم المدخل للـ hidden layer؟","A fixed-window LM has window k = 4 and each embedding has size 100. What is the input size of the hidden layer?",
   [["400","400"],["100","100"],["4","4"],["104","104"]],
   0,"بنلصق (concatenate) 4 embeddings: 4 * 100 = 400.","We concatenate 4 embeddings: 4 * 100 = 400.")],
 f:[CF("إيه اللي حلّه الـ fixed-window neural LM وإيه اللي فضل؟","What did the fixed-window neural LM fix, and what remained?",
      "حل الـ sparsity والتخزين. فضل: النافذة ثابتة وصغيرة، والأوزان مش متشاركة بين المواضع.","It fixed sparsity and storage. Remaining: the window is small and fixed, and weights are not shared across positions."),
   CF("ليه الأوزان مش متشاركة بين المواضع في الـ fixed-window LM؟","Why are weights not shared across positions in a fixed-window LM?",
   "لأن الـ embeddings بتتلصق في vector واحد وكل جزء منه بيتضرب في جزء مختلف من W، فنفس الكلمة بتتعامل بشكل مختلف حسب موضعها.","Because the embeddings are concatenated into one vector and each part is multiplied by a different slice of W, so the same word is treated differently depending on its position.")],
 terms:[
   {t:B("Fixed-window neural LM","Fixed-window neural LM"),
    d:B("LM بياخد آخر k كلمات كـ embeddings ملصوقة ويمررهم على hidden layer وsoftmax. النافذة ثابتة والأوزان مش متشاركة بين المواضع.","An LM that takes the last k words as concatenated embeddings and passes them through a hidden layer and a softmax. The window is fixed and weights are not shared across positions.")}
 ]},

{id:"l5-rnn",t:B("RNN: نفس الأوزان في كل خطوة","RNN: the same weights at every step"),
 b:cat(B('<p>الـ <mark>RNN</mark> بيمشي على الجملة كلمة كلمة وبيحتفظ بـ <mark>hidden state</mark> بيلخص اللي فات. وبيستخدم <mark>نفس الأوزان</mark> في كل خطوة:</p>'+
         '<div class="m">h_t = f(W_h h_{t-1} + W_e e_t + b)\ny_t = softmax(U h_t + c)</div>',
         '<p>An <mark>RNN</mark> moves through the sentence word by word and keeps a <mark>hidden state</mark> that summarizes what came before. It uses the <mark>same weights</mark> at every step:</p>'+
         '<div class="m">h_t = f(W_h h_{t-1} + W_e e_t + b)\ny_t = softmax(U h_t + c)</div>'),
       FIG_RNN,
       B('<p>المميزات: بيقبل أي طول، وحجم الموديل ثابت مهما طالت الجملة، والأوزان متشاركة. العيوب: الحساب <mark>تتابعي</mark> (مش بيتوازى)، وعمليًا صعب يوصل لمعلومة بعيدة جدًا.</p>',
         '<p>Advantages: it accepts any length, the model size stays fixed however long the sentence is, and weights are shared. Disadvantages: computation is <mark>sequential</mark> (it cannot be parallelized), and in practice it struggles to reach information from very far back.</p>')),
 q:[CQ("إيه اللي بيميز الـ RNN؟","What characterizes an RNN?",
      [["نفس الأوزان بتتطبق في كل خطوة","The same weights are applied at every step"],["أوزان مختلفة لكل كلمة","Different weights for each word"],["محتاج نافذة ثابتة","It needs a fixed window"],["مفيهوش hidden state","It has no hidden state"]],
      0,"ده اللي بيخليه يقبل أي طول من غير ما الموديل يكبر.","That is what lets it handle any length without the model growing."),
   CQ("لو الـ RNN اشتغل على جملة من 10 كلمات وبعدين على جملة من 100 كلمة، إيه اللي بيحصل لعدد الأوزان؟","If an RNN runs on a 10-word sentence and then on a 100-word sentence, what happens to its number of weights?",
   [["بيفضل زي ما هو","It stays the same"],["بيتضاعف 10 مرات","It grows 10 times"],["بيتضاعف مرتين","It doubles"],["بيقل","It decreases"]],
   0,"نفس W_h وW_e بيتكرر استخدامهم في كل خطوة.","The same W_h and W_e are reused at every step.")],
 f:[CF("إيه الصيغة الأساسية للـ RNN وإيه أهم ميزة فيه؟","What is the basic RNN formula and its key advantage?",
      "h_t = f(W_h h_{t-1} + W_e e_t + b). الميزة: نفس الأوزان في كل خطوة، فبيقبل أي طول من غير ما الموديل يكبر.","h_t = f(W_h h_{t-1} + W_e e_t + b). Key advantage: the same weights at every step, so it handles any length without the model growing."),
   CF("ليه حساب الـ RNN مش بيتوازى على الخطوات؟","Why can an RNN not be parallelized across steps?",
   "لأن h_t محتاج h_{t-1}، فلازم نحسب الخطوات واحدة ورا التانية.","Because h_t needs h_{t-1}, so the steps must be computed one after another.")],
 terms:[
   {t:B("Recurrent neural network (RNN)","Recurrent neural network (RNN)"),
    d:B("شبكة بتقرا المدخل خطوة خطوة وبتطبّق نفس الأوزان في كل خطوة، وبتحتفظ بـ hidden state بيلخص اللي فات.","A network that reads the input step by step, applies the same weights at every step, and keeps a hidden state that summarizes what came before.")},
   {t:B("Hidden state","Hidden state"),
    d:B("الـ vector اللي الـ RNN بيحدّثه في كل خطوة علشان يلخص الكلمات اللي فاتت.","The vector an RNN updates at every step to summarize the words seen so far.")}
 ]},

{id:"l5-perplexity",t:B("تدريب الـ RNN LM والـ perplexity","Training an RNN LM and perplexity"),
 b:B('<p>في كل خطوة t الموديل بيتنبأ بالكلمة الجاية، وبنحسب <mark>cross-entropy</mark> مقابل الكلمة الحقيقية، وبنعمل متوسط على كل الخطوات:</p>'+
     '<div class="m">J = (1/T) * sum_t -log P(x_{t+1} | x_1..x_t)</div>'+
     '<p>وأثناء التدريب بنغذّي الموديل بالكلمة <mark>الحقيقية</mark> السابقة مش اللي هو توقعها (اسمها <mark>teacher forcing</mark>). والـ gradients بتتجمع من كل الخطوات (<mark>backpropagation through time</mark>).</p>'+
     '<p>المقياس الشائع هو <mark>perplexity</mark>:</p>'+
     '<div class="m">perplexity = exp(J)</div>'+
     '<p>كل ما قلّ كان أحسن. لو الموديل بيدي الكلمة الحقيقية احتمال 1/10 في المتوسط، الـ perplexity = 10، يعني كأنه محتار بين 10 اختيارات.</p>',
     '<p>At each step t the model predicts the next word, we compute <mark>cross-entropy</mark> against the true word, and average over all steps:</p>'+
     '<div class="m">J = (1/T) * sum_t -log P(x_{t+1} | x_1..x_t)</div>'+
     '<p>During training we feed the model the <mark>true</mark> previous word, not its own prediction (called <mark>teacher forcing</mark>). Gradients are accumulated over all steps (<mark>backpropagation through time</mark>).</p>'+
     '<p>The standard metric is <mark>perplexity</mark>:</p>'+
     '<div class="m">perplexity = exp(J)</div>'+
     '<p>Lower is better. If the model gives the true word a probability of 1/10 on average, perplexity = 10, as if it were choosing among 10 options.</p>'),
 q:[CQ("لو الموديل بيدي الكلمة الحقيقية احتمال 1/50 في المتوسط، الـ perplexity تقريبًا...","If the model gives the true word an average probability of 1/50, the perplexity is about...",
      [["50","50"],["1/50","1/50"],["5","5"],["500","500"]],
      0,"perplexity = exp(-log(1/50)) = 50.","perplexity = exp(-log(1/50)) = 50."),
   CQ("الـ W_h متشاركة في كل الخطوات. إزاي بنحسب gradient الـ loss بالنسبة لها في الـ BPTT؟","W_h is shared across all steps. How is the gradient of the loss with respect to it computed in BPTT?",
   [["بنجمع مساهمتها من كل الخطوات","We sum its contributions from every step"],["بناخد آخر خطوة بس","We take only the last step"],["بنضرب المساهمات في بعض","We multiply the contributions together"],["كل خطوة ليها W_h لوحدها","Each step has its own W_h"]],
   0,"نفس الوزن اتستخدم في كل خطوة، فمساهماته بتتجمع.","The same weight was used at every step, so its contributions add up.")],
 f:[CF("إيه هو الـ perplexity؟","What is perplexity?",
      "exp(J) حيث J هو متوسط cross-entropy. كل ما قلّ كان أحسن، وبيمثل عدد الاختيارات اللي الموديل محتار بينها تقريبًا.","exp(J) where J is the average cross-entropy. Lower is better, and it roughly represents how many options the model is torn between."),
   CF("إيه هو الـ backpropagation through time؟","What is backpropagation through time?",
   "الـ backprop على الـ RNN المفرود: الـ gradient بيرجع خطوة خطوة، ومساهمات الوزن المتشارك بتتجمع.","Backprop on the unrolled RNN: the gradient flows back step by step, and the contributions to a shared weight are summed.")],
 terms:[
   {t:B("Perplexity","Perplexity"),
    d:B("exp(J) حيث J متوسط cross-entropy. كل ما قلّت كان الموديل أحسن، وبتمثل تقريبًا عدد الاختيارات اللي الموديل محتار بينها.","exp(J) where J is the average cross-entropy. Lower is better, and it roughly represents how many options the model is torn between.")},
   {t:B("Teacher forcing","Teacher forcing"),
    d:B("وقت التدريب بنغذّي الموديل بالكلمة الحقيقية السابقة مش بتوقعه هو.","During training we feed the model the true previous word instead of its own prediction.")},
   {t:B("Backpropagation through time (BPTT)","Backpropagation through time (BPTT)"),
    d:B("الـ backprop على الـ RNN المفرود عبر الزمن، ومساهمات الأوزان المتشاركة بتتجمع من كل الخطوات.","Backprop on the RNN unrolled over time, where the contributions to shared weights are summed over all steps.")}
 ]},

{id:"l5-perplexity-calc",t:B("مثال حساب الـ perplexity بالأرقام","A worked perplexity example"),
 b:B('<p>الـ perplexity بتجاوب على سؤال: الموديل محتار بين كام كلمة متساوية الاحتمال في كل خطوة؟ هي <mark>geometric mean</mark> لمقلوب احتمالات الكلمات الحقيقية (<code>P_t</code> هو احتمال الكلمة الحقيقية رقم t):</p>'+
     '<div class="m">perplexity = ( product_t 1 / P_t ) ^ (1/T) = exp(J)</div>'+
     '<p>خد الكلمات الحقيقية students وopened وtheir وbooks، والموديل أدّاها الاحتمالات دي (أرقام افتراضية):</p>'+
     '<div class="m">P:    0.5   0.25   0.125   0.25\n1/P:  2     4      8       4\nproduct = 256, T = 4\nperplexity = 256^(1/4) = 4\n\ncheck with J:\nJ = (ln2 + ln4 + ln8 + ln4) / 4 = 1.386\nexp(1.386) = 4</div>'+
     '<p>يعني الموديل محتار تقريبًا زي واحد بيختار عشوائيًا من 4 كلمات. الموديل المثالي perplexity بتاعه 1، والموديل اللي بيخمّن بالتساوي على vocabulary حجمه V بياخد V.</p>'+
     '<p>غلطة شائعة: نعمل متوسط الاحتمالات الأول (0.28، فتطلع حوالي 3.6) بدل الـ geometric mean. وكمان مقارنة perplexity بين موديلين مش عادلة إلا لو نفس الـ vocabulary ونفس النص.</p>',
     '<p>Perplexity answers the question: how many equally likely words is the model torn between at each step? It is the <mark>geometric mean</mark> of the inverse probabilities of the true words (<code>P_t</code> is the probability of the t-th true word):</p>'+
     '<div class="m">perplexity = ( product_t 1 / P_t ) ^ (1/T) = exp(J)</div>'+
     '<p>Take the true words students, opened, their and books, where the model gave them these probabilities (made-up numbers):</p>'+
     '<div class="m">P:    0.5   0.25   0.125   0.25\n1/P:  2     4      8       4\nproduct = 256, T = 4\nperplexity = 256^(1/4) = 4\n\ncheck with J:\nJ = (ln2 + ln4 + ln8 + ln4) / 4 = 1.386\nexp(1.386) = 4</div>'+
     '<p>So the model is about as unsure as someone picking at random among 4 words. A perfect model gets 1, and a model that guesses uniformly over a vocabulary of V words gets V.</p>'+
     '<p>Common mistake: averaging the probabilities first (0.28, which gives about 3.6) instead of taking the geometric mean. Also, comparing perplexities is only fair when the models share the same vocabulary and the same text.</p>'),
 q:[
   CQ("موديل مثالي بيدّي الكلمة الحقيقية احتمال 1 في كل خطوة. الـ perplexity بتاعه...","A perfect model gives the true word probability 1 at every step. Its perplexity is...",
      [["1","1"],["0","0"],["لانهاية","Infinity"],["حجم الـ vocabulary","The vocabulary size"]],
      0,"exp(-log 1) = exp(0) = 1، يعني مفيش حيرة خالص.","exp(-log 1) = exp(0) = 1, meaning no uncertainty at all."),
   CQ("الموديل أدّى 4 كلمات حقيقية الاحتمالات 0.5 و0.5 و0.25 و0.25. الـ perplexity تقريبًا...","The model gave 4 true words the probabilities 0.5, 0.5, 0.25 and 0.25. The perplexity is about...",
      [["2.83","2.83"],["3","3"],["2","2"],["4","4"]],
      0,"1/P = 2 و2 و4 و4، حاصل الضرب 64، والجذر الرابع لـ 64 = 2.83. المتوسط العادي (3) غلط.","1/P = 2, 2, 4, 4; the product is 64 and its 4th root is 2.83. The plain average (3) is wrong.")
 ],
 f:[
   CF("إزاي بنحسب الـ perplexity من الاحتمالات مباشرة؟","How do we compute perplexity directly from the probabilities?",
      "geometric mean لمقلوب احتمالات الكلمات الحقيقية: (product 1/P_t)^(1/T). ده نفس exp(J).","The geometric mean of the inverse probabilities of the true words: (product 1/P_t)^(1/T). It equals exp(J)."),
   CF("إيه أقل قيمة للـ perplexity، وإيه قيمة التخمين المتساوي؟","What is the lowest perplexity, and what is the value for uniform guessing?",
      "الأقل 1 (موديل متأكد ومصيب). التخمين المتساوي على vocabulary حجمه V بيدّي V.","The lowest is 1 (a model that is certain and right). Uniform guessing over a vocabulary of V words gives V.")
 ]},

{id:"l5-exposure",t:B("Teacher forcing و exposure bias","Teacher forcing and exposure bias"),
 b:cat(B('<p>وقت التدريب الموديل بيشوف دايمًا الكلمات <mark>الحقيقية</mark> اللي قبل الكلمة المطلوبة. لكن وقت توليد النص بيشوف <mark>توقعاته هو</mark> للكلمات اللي فاتت. الفجوة دي اسمها <mark>exposure bias</mark>.</p>',
         '<p>During training the model always sees the <mark>true</mark> words before the one it must predict. When it generates text, it sees its <mark>own</mark> earlier predictions instead. This gap is called <mark>exposure bias</mark>.</p>'),
       FIG_TF,
       B('<p>ليه ده مشكلة: الموديل عمره ما اتدرّب إنه يكمّل من غلطة عملها بنفسه. لو كتب <code>the students opened there</code> بدل <code>their</code>، السياق ده ماظهرش في التدريب، فالتنبؤ اللي بعده أقل اعتمادية، والأخطاء ممكن تتراكم خطوة بعد خطوة.</p>'+
         '<p>من الحلول <mark>scheduled sampling</mark>: أحيانًا وقت التدريب نغذّي الموديل بتوقعه هو بدل الكلمة الحقيقية، وبنزوّد النسبة مع الوقت. لكن teacher forcing لسه هو الأساس لأنه بسيط ومستقر.</p>'+
         '<p>غلطة شائعة: teacher forcing حيلة للتدريب بس. وقت الاختبار مفيش كلمة حقيقية نغذّي بيها الموديل.</p>',
         '<p>Why this is a problem: the model was never trained to continue from a mistake of its own. If it writes <code>the students opened there</code> instead of <code>their</code>, that context never appeared in training, so the next prediction is less reliable and errors can compound step after step.</p>'+
         '<p>One fix is <mark>scheduled sampling</mark>: during training we sometimes feed the model its own prediction instead of the true word, more often as training goes on. Teacher forcing is still the standard because it is simple and stable.</p>'+
         '<p>Common mistake: teacher forcing is a training trick only. At test time there is no true word to feed the model.</p>')),
 q:[
   CQ("إيه هو الـ exposure bias؟","What is exposure bias?",
      [["الفرق بين التدريب (سياق حقيقي) والتوليد (سياق من توقعات الموديل)","The gap between training (true context) and generation (context made of the model's own predictions)"],["الـ bias term في معادلة الـ RNN","The bias term in the RNN equation"],["إن الموديل بيفضّل الكلمات الشائعة","The model preferring frequent words"],["إن الـ vocabulary صغير","A vocabulary that is too small"]],
      0,"الموديل بيتدرب على سياق حقيقي لكن بيتولّد من سياقه هو.","The model trains on true context but generates from its own."),
   CQ("وقت توليد جملة جديدة، إيه اللي بنغذّي بيه الموديل في الخطوة اللي بعد كده؟","When generating a new sentence, what do we feed the model at the next step?",
      [["الكلمة اللي هو اتنبأ بيها (أو اخترناها) في الخطوة اللي فاتت","The word it predicted (or we picked) at the previous step"],["الكلمة الحقيقية الجاية","The true next word"],["vector أصفار","A zero vector"],["كلمة عشوائية","A random word"]],
      0,"مفيش كلمة حقيقية وقت التوليد، فبنعتمد على اللي الموديل طلّعه.","There is no true word at generation time, so we rely on what the model produced.")
 ],
 f:[
   CF("إيه الفرق بين المدخل وقت التدريب ووقت التوليد؟","What is the difference between the input in training and in generation?",
      "التدريب (teacher forcing): الكلمة الحقيقية السابقة. التوليد: توقع الموديل نفسه في الخطوة السابقة.","Training (teacher forcing): the true previous word. Generation: the model's own prediction from the previous step."),
   CF("إيه هو الـ scheduled sampling؟","What is scheduled sampling?",
      "حيلة تدريب بتغذّي الموديل أحيانًا بتوقعه هو بدل الكلمة الحقيقية، علشان يقلل exposure bias.","A training trick that sometimes feeds the model its own prediction instead of the true word, to reduce exposure bias.")
 ],
 terms:[
   {t:B("Exposure bias","Exposure bias"),
    d:B("الفجوة بين التدريب (سياق حقيقي) والتوليد (سياق من توقعات الموديل نفسه).","The gap between training (true context) and generation (context made of the model's own predictions).")},
   {t:B("Scheduled sampling","Scheduled sampling"),
    d:B("تغذية الموديل أحيانًا بتوقعه هو وقت التدريب علشان يتعود على سياقه.","Sometimes feeding the model its own prediction during training so it gets used to its own context.")}
 ]},

{id:"l5-tagging",t:B("Sequence tagging و NER بالـ RNN","Sequence tagging and NER with an RNN"),
 b:cat(B('<p>الـ language model بيتنبأ بكلمة لسه مش موجودة. في <mark>sequence tagging</mark> الجملة كلها معانا، والـ RNN بيطلّع label لكل كلمة بيقراها. مثال كلاسيكي: <mark>named entity recognition (NER)</mark>، يعني نلاقي الأشخاص والجهات والأماكن في النص.</p>',
         '<p>A language model predicts a word that does not exist yet. In <mark>sequence tagging</mark> the whole sentence is given, and the RNN outputs one label for each word it reads. A classic example is <mark>named entity recognition (NER)</mark>: finding people, organizations and places in text.</p>'),
       FIG_TAG,
       B('<p>في كل خطوة نفس طبقة الـ softmax بتختار tag من مجموعة صغيرة، والـ loss هو cross-entropy عند كل موضع بنعمل له متوسط على الجملة. الـ tags بتتكتب غالبًا بنظام <mark>BIO</mark>: B بداية كيان، I جوه نفس الكيان، O برا أي كيان.</p>'+
         '<div class="m">Sara   Ali    works  at  Google  in  Cairo\nB-PER  I-PER  O      O   B-ORG   O   B-LOC</div>'+
         '<p>نقطة مهمة: الـ RNN في اتجاه واحد بيشوف الكلمات اللي على شماله بس، لكن الـ tag كتير بيعتمد على اللي بعد الكلمة. علشان كده الـ tagging غالبًا بيستخدم bidirectional RNN، وده الكارت الجاي.</p>',
         '<p>At each step the same softmax layer picks a tag from a small tag set, and the loss is the cross-entropy at each position, averaged over the sentence. Tags are usually written in the <mark>BIO</mark> scheme: B begins an entity, I is inside the same entity, O is outside any entity.</p>'+
         '<div class="m">Sara   Ali    works  at  Google  in  Cairo\nB-PER  I-PER  O      O   B-ORG   O   B-LOC</div>'+
         '<p>One catch: a one-direction RNN only sees the words on its left, but a tag often depends on what comes after the word. That is why tagging usually uses a bidirectional RNN, which is the next card.</p>')),
 q:[
   CQ("إيه الفرق الأساسي بين sequence tagging والـ language modeling؟","What is the main difference between sequence tagging and language modeling?",
      [["في الـ tagging بنطلّع label لكل كلمة موجودة في المدخل، وفي الـ LM بنتنبأ بكلمة لسه مش موجودة","In tagging we output a label for each word already in the input; in an LM we predict a word that is not there yet"],["الـ tagging مش بيستخدم softmax","Tagging does not use a softmax"],["الـ LM بيحتاج hidden state والـ tagging لأ","An LM needs a hidden state and tagging does not"],["مفيش فرق","There is no difference"]],
      0,"الـ tagging بيشوف الجملة كلها كمدخل ومعاه هدف لكل كلمة.","Tagging sees the whole sentence as input and has a target for every word."),
   CQ("في جملة Sara Ali works at Google، إيه الـ tag الصح لكلمة Ali بنظام BIO؟","In Sara Ali works at Google, what is the correct BIO tag for the word Ali?",
      [["I-PER","I-PER"],["B-PER","B-PER"],["O","O"],["B-ORG","B-ORG"]],
      0,"Ali تكملة لاسم Sara الشخصي، فهي جوه نفس الكيان (I).","Ali continues the person name that began with Sara, so it is inside the same entity (I).")
 ],
 f:[
   CF("إيه معنى B و I و O في الـ NER؟","What do B, I and O mean in NER?",
      "B: بداية كيان. I: جوه نفس الكيان. O: برا أي كيان.","B: begins an entity. I: inside the same entity. O: outside any entity."),
   CF("إزاي بنحسب الـ loss في الـ sequence tagging؟","How is the loss computed in sequence tagging?",
      "cross-entropy بين الـ tag المتوقع والحقيقي عند كل كلمة، وبنعمل متوسط على الجملة.","Cross-entropy between the predicted and true tag at each word, averaged over the sentence.")
 ],
 terms:[
   {t:B("Sequence tagging","Sequence tagging"),
    d:B("مهمة بنديها label لكل كلمة في الجملة، زي NER.","A task that assigns a label to every word of a sentence, such as NER.")},
   {t:B("Named entity recognition (NER)","Named entity recognition (NER)"),
 d:B("Named Entity Recognition: تحديد الأسماء في النص وتصنيفها (شخص، مكان، منظمة).","Named Entity Recognition: finding names in text and labeling them (person, place, organization).")},
   {t:B("BIO tags","BIO tags"),
    d:B("نظام تسمية: B بداية كيان، I جوه الكيان، O برا أي كيان.","A labeling scheme: B begins an entity, I is inside it, O is outside any entity.")}
 ]},

{id:"l5-bidirectional",t:B("Bidirectional RNN","Bidirectional RNN"),
 b:cat(B('<p>في الجملة <code>the movie was terribly exciting</code> كلمة <mark>terribly</mark> لوحدها شكلها سلبي، لكن الكلمة اللي بعدها بتقلب المعنى. الـ RNN العادي عند الكلمة دي شاف الشمال بس. الـ <mark>bidirectional RNN</mark> بيضيف RNN تاني بيقرا من اليمين للشمال.</p>',
         '<p>In <code>the movie was terribly exciting</code>, the word <mark>terribly</mark> alone sounds negative, but the word after it flips the meaning. A normal RNN at that word has seen only the left side. A <mark>bidirectional RNN</mark> adds a second RNN that reads from right to left.</p>'),
       FIG_BI,
       B('<p>بنشغّل الاتنين ونلصق الـ hidden states عند كل موضع:</p>'+
         '<div class="m">h_t(fwd) = RNN_fwd(h_{t-1}(fwd), e_t)\nh_t(bwd) = RNN_bwd(h_{t+1}(bwd), e_t)\nh_t = [h_t(fwd) ; h_t(bwd)]</div>'+
         '<p>دلوقتي كل h_t بيلخص الجملة كلها حوالين الكلمة t. لو كل اتجاه فيه 128 وحدة، يبقى h_t حجمه 256.</p>'+
         '<p>القيد: محتاج المدخل كله مقدمًا، فبيناسب الـ tagging والـ classification والـ encoders، لكن <mark>مش الـ language modeling ولا التوليد</mark>: الـ RNN الخلفي هيشوف نفس الكلمات اللي المفروض نتنبأ بيها.</p>',
         '<p>We run both and concatenate their hidden states at every position:</p>'+
         '<div class="m">h_t(fwd) = RNN_fwd(h_{t-1}(fwd), e_t)\nh_t(bwd) = RNN_bwd(h_{t+1}(bwd), e_t)\nh_t = [h_t(fwd) ; h_t(bwd)]</div>'+
         '<p>Now each h_t summarizes the whole sentence around word t. If each direction has 128 units, h_t has size 256.</p>'+
         '<p>The limit: it needs the full input in advance, so it fits tagging, classification and encoders, but <mark>not language modeling or generation</mark>: the backward RNN would see the very words we are trying to predict.</p>')),
 q:[
   CQ("ليه الـ bidirectional RNN ما ينفعش لـ language modeling؟","Why can a bidirectional RNN not be used for language modeling?",
      [["الاتجاه الخلفي هيشوف الكلمات اللي المفروض نتنبأ بيها","The backward direction would see the words we are supposed to predict"],["عدد أوزانه كبير جدًا","It has too many weights"],["مفيهوش hidden state","It has no hidden state"],["مش بيقبل جمل طويلة","It cannot handle long sentences"]],
      0,"التنبؤ بالكلمة الجاية بيفقد معناه لو الموديل شاف الكلمة دي أصلًا.","Next-word prediction loses its meaning if the model has already seen that word."),
   CQ("كل اتجاه في bidirectional RNN فيه hidden state حجمها 128. كام حجم h_t بعد اللصق؟","Each direction of a bidirectional RNN has a hidden state of size 128. What is the size of h_t after concatenation?",
      [["256","256"],["128","128"],["512","512"],["64","64"]],
      0,"بنلصق (concatenate) الاتنين: 128 + 128 = 256.","We concatenate both: 128 + 128 = 256.")
 ],
 f:[
   CF("إيه هو الـ bidirectional RNN وإمتى نستخدمه؟","What is a bidirectional RNN and when do we use it?",
      "RNN أمامي وRNN خلفي بنلصق حالاتهم. بنستخدمه لما المدخل كله متاح (tagging، classification، encoder)، مش للتوليد.","A forward and a backward RNN whose states are concatenated. We use it when the whole input is available (tagging, classification, encoder), not for generation."),
   CF("إزاي بنكوّن الـ hidden state في الـ bidirectional RNN؟","How is the hidden state formed in a bidirectional RNN?",
      "h_t = [h_t(fwd) ; h_t(bwd)]: لصق حالة الاتجاه الأمامي وحالة الاتجاه الخلفي عند نفس الموضع.","h_t = [h_t(fwd) ; h_t(bwd)]: the concatenation of the forward and backward states at the same position.")
 ],
 terms:[
   {t:B("Bidirectional RNN","Bidirectional RNN"),
 d:B("RNN أمامي وRNN خلفي، وبنلصق الـ hidden states بتاعتهم عند كل موضع. مش بيناسب التوليد.","A forward and a backward RNN whose hidden states are concatenated at each position. It does not fit generation.")}
 ]},

{id:"l5-multilayer",t:B("Multi-layer RNN","Multi-layer RNN"),
 b:cat(B('<p>نقدر نكدّس طبقات RNN فوق بعض: الـ hidden states بتاعة طبقة بتبقى هي المدخل للطبقة اللي فوقها. ده اسمه <mark>multi-layer RNN</mark> (أو stacked RNN). الطبقات الواطية بتميل تلقط أنماط محلية، والعالية أنماط أكتر تجريدًا.</p>',
         '<p>We can stack RNN layers: the hidden states of one layer become the inputs of the layer above it. This is a <mark>multi-layer RNN</mark> (also called a stacked RNN). Lower layers tend to capture more local patterns and higher layers more abstract ones.</p>'),
       FIG_STACK,
       B('<div class="m">h_t(1) = f(W1 h_{t-1}(1) + V1 e_t + b1)\nh_t(2) = f(W2 h_{t-1}(2) + V2 h_t(1) + b2)</div>'+
         '<p>كل طبقة ليها أوزانها، لكن جوه الطبقة الأوزان لسه متشاركة عبر الزمن. التنبؤ بيطلع من الطبقة العليا. لجملة من 20 كلمة و3 طبقات، الشبكة بتعمل 60 تحديث للـ cell.</p>'+
         '<p>عمليًا 2 لـ 4 طبقات شائعة في الـ RNNs. التكديس العميق جدًا صعب في التدريب لأن الـ gradients بتتلاشى (هنشرح ده في كارت الـ vanishing gradient)، فبيحتاج وصلات اختصار (skip connections).</p>'+
         '<p>ممكن نجمع الفكرتين: طبقات bidirectional فوق بعض، وكل طبقة بتمرر الحالات الملصوقة للي بعدها.</p>',
         '<div class="m">h_t(1) = f(W1 h_{t-1}(1) + V1 e_t + b1)\nh_t(2) = f(W2 h_{t-1}(2) + V2 h_t(1) + b2)</div>'+
         '<p>Each layer has its own weights, but inside a layer the weights are still shared across time. The prediction comes from the top layer. For a sentence of 20 words and 3 layers, the network performs 60 cell updates.</p>'+
         '<p>In practice 2 to 4 layers are common for RNNs. Very deep stacks are hard to train because gradients vanish (we explain this in the vanishing gradient card), so they need extra shortcut (skip) connections.</p>'+
         '<p>You can combine both ideas: a stack of bidirectional layers, where each layer passes its concatenated states to the next.</p>')),
 q:[
   CQ("RNN بـ 3 طبقات بيشتغل على جملة من 20 كلمة. كام تحديث للـ cell بيحصل؟","A 3-layer RNN runs over a 20-word sentence. How many cell updates happen?",
      [["60","60"],["20","20"],["23","23"],["3","3"]],
      0,"كل طبقة بتعمل تحديث لكل كلمة: 3 * 20 = 60.","Each layer performs one update per word: 3 * 20 = 60."),
   CQ("ليه مش بنكدّس 50 طبقة RNN وخلاص؟","Why do we not simply stack 50 RNN layers?",
      [["التدريب بيبقى صعب لأن الـ gradients بتتلاشى، ومحتاجين skip connections","Training gets hard because gradients vanish, and we would need skip connections"],["الـ RNN مش بيقبل أكتر من طبقة","An RNN cannot have more than one layer"],["الأوزان بتبقى متشاركة بين الطبقات","The weights become shared across layers"],["الـ perplexity بتبقى صفر","The perplexity becomes zero"]],
      0,"العمق بيزوّد مشكلة الـ vanishing gradient اللي في الـ RNN أصلًا.","Depth adds to the vanishing gradient problem that RNNs already have.")
 ],
 f:[
   CF("إيه هو الـ multi-layer RNN؟","What is a multi-layer RNN?",
      "RNN بطبقات متكدسة: hidden states الطبقة اللي تحت هي مدخل الطبقة اللي فوقها، والتنبؤ من الطبقة العليا.","An RNN with stacked layers: the hidden states of the lower layer are the input of the layer above, and the prediction comes from the top layer."),
   CF("كام طبقة عادةً بنستخدم في الـ RNN وليه؟","How many layers do we usually use in an RNN, and why?",
      "2 لـ 4 عادةً. أعمق من كده صعب في التدريب بسبب الـ vanishing gradient من غير skip connections.","Usually 2 to 4. Deeper is hard to train because of vanishing gradients unless skip connections are added.")
 ],
 terms:[
   {t:B("Multi-layer RNN","Multi-layer RNN"),
 d:B("RNN بطبقات متكدسة: الـ hidden states بتاعة طبقة هي مدخل الطبقة اللي فوقها.","An RNN with stacked layers: the hidden states of one layer are the input of the layer above.")}
 ]},

{id:"l5-vanishing",t:B("Vanishing و exploding gradients","Vanishing and exploding gradients"),
 b:cat(B('<p>الـ gradient لما يرجع لورا عبر الخطوات، بيتضرب في نفس المصفوفة <code>W_h</code> مرة بعد مرة. لو تأثيرها أقل من 1 الإشارة بتتلاشى، وده اسمه <mark>vanishing gradient</mark>.</p>',
         '<p>When the gradient flows back through the steps, it is multiplied by the same matrix <code>W_h</code> again and again. If its effect is below 1, the signal fades away: this is the <mark>vanishing gradient</mark>.</p>'),
       FIG_VAN,
       B('<p>النتيجة: الموديل مش بيتعلم علاقات بين كلمات بعيدة عن بعض، لأن الخطأ اللي عند الآخر مابيوصلش للأول. والعكس: لو أكبر من 1 الإشارة بتنفجر (<mark>exploding gradient</mark>)، والحل السريع هو <mark>gradient clipping</mark>: لو حجم الـ gradient عدّى حد معين، نصغّره لنفس الاتجاه.</p>'+
         '<p>مشكلة الـ vanishing محتاجة تصميم أحسن للشبكة، وده اللي هنشوفه مع LSTM في المحاضرة الجاية.</p>',
         '<p>The result: the model cannot learn relations between words that are far apart, because the error at the end never reaches the beginning. The opposite: if it is above 1 the signal blows up (<mark>exploding gradient</mark>), and the quick fix is <mark>gradient clipping</mark>: if the gradient norm passes a threshold, scale it down while keeping its direction.</p>'+
         '<p>The vanishing problem needs a better network design, which is what we will see with the LSTM in the next lecture.</p>')),
 q:[CQ("إيه اللي بيحصل في الـ vanishing gradient؟","What happens with a vanishing gradient?",
      [["إشارة الخطأ بتضعف كل ما نرجع لورا، فالموديل مش بيتعلم الاعتماد البعيد","The error signal weakens as we go back, so the model cannot learn long-range dependencies"],["الـ loss بيبقى NaN","The loss becomes NaN"],["الموديل بيحفظ البيانات","The model memorizes the data"],["الـ learning rate بيزيد","The learning rate increases"]],
      0,"الضرب المتكرر في أرقام أصغر من 1 بيقرّب الـ gradient من الصفر.","Repeated multiplication by numbers below 1 pushes the gradient toward zero."),
   CQ("الـ gradient بيتضرب في 0.5 مع كل خطوة رجوع. بعد 10 خطوات بيبقى تقريبًا...","The gradient is multiplied by 0.5 at every step back. After 10 steps it is roughly...",
   [["0.001","0.001"],["0.05","0.05"],["0.5","0.5"],["5","5"]],
   0,"0.5^10 = 1/1024، يعني حوالي 0.001.","0.5^10 = 1/1024, so about 0.001.")],
 f:[CF("إيه الفرق بين vanishing و exploding gradients وإيه حل الـ exploding؟","What is the difference between vanishing and exploding gradients, and the fix for exploding?",
      "Vanishing: الـ gradient بيتلاشى فمفيش تعلم للاعتماد البعيد. Exploding: بيكبر جدًا. الحل السريع: gradient clipping.","Vanishing: the gradient fades so long-range dependencies are not learned. Exploding: it grows too large. Quick fix: gradient clipping."),
   CF("ليه الـ vanishing gradient بيخلي الـ RNN يتعلم من الكلمات القريبة أكتر؟","Why does the vanishing gradient make an RNN learn mostly from nearby words?",
   "لأن gradient الكلمات البعيدة بيوصل صغير جدًا، فتحديث الأوزان بيتأثر بالكلمات القريبة.","Because the gradient from distant words arrives tiny, so the weight updates are driven by nearby words.")],
 terms:[
   {t:B("Vanishing gradient","Vanishing gradient"),
    d:B("الـ gradient بيصغر مع كل خطوة رجوع عبر الزمن لحد ما يقرّب من الصفر، فالـ RNN مش بيتعلم الاعتماد البعيد.","The gradient shrinks at each step back in time until it is near zero, so the RNN does not learn long-range dependencies.")},
   {t:B("Exploding gradient","Exploding gradient"),
    d:B("الـ gradient بيكبر جدًا مع الرجوع عبر الزمن، والحل السريع gradient clipping.","The gradient grows very large when flowing back in time; the quick fix is gradient clipping.")},
   {t:B("Gradient clipping","Gradient clipping"),
    d:B("لو حجم الـ gradient عدّى حد معين نصغّره لنفس الاتجاه.","If the gradient norm passes a threshold, scale it down while keeping its direction.")}
 ]},

{id:"l5-recap",t:B("Recap: ملخص المحاضرة","Recap: lecture summary"),
 b:B('<p>خمس نقاط تفضل معاك:</p>'+
     '<p>1) الـ LM بيتنبأ بتوزيع الكلمة الجاية. الـ n-gram بيعدّ لكن بيعاني من الـ sparsity، والـ fixed-window بيحلها لكن نافذته صغيرة وأوزانه مش متشاركة.</p>'+
     '<p>2) الـ RNN بيعيد استخدام نفس الأوزان في كل خطوة وبيقبل أي طول، لكن حسابه تتابعي.</p>'+
     '<p>3) بندرّب بـ teacher forcing وبنقيس بـ perplexity = exp(J)، ووقت التوليد بيظهر exposure bias.</p>'+
     '<p>4) غير الـ LM: tagging (label لكل كلمة)، وbidirectional (مش للتوليد)، وmulti-layer RNN.</p>'+
     '<p>5) الـ gradients بتتلاشى أو بتنفجر عبر الزمن، والـ clipping بيحل الانفجار بس.</p>'+
     '<div class="m">h_t = f(W_h h_{t-1} + W_e e_t + b)\nJ = (1/T) * sum_t -log P(x_{t+1} | x_1..x_t)\nperplexity = exp(J)\nh_t = [h_t(fwd) ; h_t(bwd)]</div>'+
     '<p>قبل المحاضرة الجاية لازم تعرف: ليه الضرب المتكرر في W_h ممكن يقرّب الـ gradient من الصفر (هنحتاج تصميم خلايا أحسن اسمه LSTM)، وإن الترجمة هتحتاج encoder وdecoder.</p>',
     '<p>Five points to keep:</p>'+
     '<p>1) An LM predicts the next-word distribution. An n-gram counts but suffers from sparsity; a fixed-window net fixes that but has a small window and unshared weights.</p>'+
     '<p>2) An RNN reuses the same weights at every step and accepts any length, but its computation is sequential.</p>'+
     '<p>3) We train with teacher forcing and measure with perplexity = exp(J); at generation time exposure bias appears.</p>'+
     '<p>4) Beyond LMs: tagging (a label per word), bidirectional RNNs (not for generation) and multi-layer RNNs.</p>'+
     '<p>5) Gradients vanish or explode through time, and clipping only fixes the exploding case.</p>'+
     '<div class="m">h_t = f(W_h h_{t-1} + W_e e_t + b)\nJ = (1/T) * sum_t -log P(x_{t+1} | x_1..x_t)\nperplexity = exp(J)\nh_t = [h_t(fwd) ; h_t(bwd)]</div>'+
     '<p>Before the next lecture you should know: why repeated multiplication by W_h can push the gradient toward zero (we will need a better cell design called the LSTM), and that translation will need an encoder and a decoder.</p>'),
 q:[
   CQ("إيه المشكلة اللي بتمهّد للـ LSTM في المحاضرة الجاية؟","Which problem sets up the LSTM in the next lecture?",
      [["الـ vanishing gradient عبر الخطوات","The vanishing gradient across steps"],["حجم الـ vocabulary","The vocabulary size"],["الـ teacher forcing","Teacher forcing"],["عدد الـ tags في الـ NER","The number of tags in NER"]],
      0,"الـ RNN العادي صعب يتعلم الاعتماد البعيد بسبب تلاشي الـ gradient.","A plain RNN struggles with long-range dependencies because the gradient fades."),
   CQ("موديل A perplexity بتاعه 20 وموديل B بتاعه 35 على نفس النص ونفس الـ vocabulary. أنهي أحسن؟","Model A has perplexity 20 and model B has 35 on the same text and vocabulary. Which is better?",
      [["A","A"],["B","B"],["نفسهم","They are equal"],["مينفعش نقارن","We cannot compare"]],
      0,"perplexity أقل = حيرة أقل = موديل أحسن، طالما نفس النص والـ vocabulary.","Lower perplexity means less uncertainty and a better model, as long as the text and vocabulary are the same.")
 ],
 f:[
   CF("لخّص محاضرة 5 في جملتين.","Summarize lecture 5 in two sentences.",
      "الـ LM بيتنبأ بالكلمة الجاية، والـ RNN بيعمله بنفس الأوزان في كل خطوة وبيتدرب بـ teacher forcing ويتقاس بـ perplexity. مشكلته الأساسية الـ vanishing gradient.","An LM predicts the next word, and an RNN does it with the same weights at every step, trained with teacher forcing and measured with perplexity. Its main problem is the vanishing gradient."),
   CF("إيه اللي لازم أعرفه قبل محاضرة 6؟","What should I know before lecture 6?",
      "ليه الضرب المتكرر في W_h ممكن يخلي الـ gradient يتلاشى، وإن الترجمة محتاجة encoder وdecoder.","Why repeated multiplication by W_h can make the gradient vanish, and that translation needs an encoder and a decoder.")
 ]}
]}
);

})();
