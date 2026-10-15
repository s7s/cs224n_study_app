/* Lecture 2: GloVe, Word Senses & Neural Classifiers
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L2 fig: co-occurrence matrix */
function matrixFig(){
  var MW=['I','like','enjoy','deep','learning','NLP','flying'];
  var MX=[[0,2,1,0,0,0,0],[2,0,0,1,0,1,0],[1,0,0,0,0,0,1],[0,1,0,0,1,0,0],[0,0,0,1,0,0,0],[0,1,0,0,0,0,0],[0,0,1,0,0,0,0]];
  var s='',c=34,x0=92,y0=62,i,j;
  for(i=0;i<7;i++){
    var cx=x0+i*c+c/2;
    s+='<text x="'+cx+'" y="'+(y0-8)+'" class="t tm" style="font-size:11px" transform="rotate(-35 '+cx+' '+(y0-8)+')">'+MW[i]+'</text>';
    s+=T(x0-8,y0+i*c+c/2+4,MW[i],'tm','end','font-size:11px');
  }
  for(i=0;i<7;i++)for(j=0;j<7;j++){
    var v=MX[i][j],x=x0+j*c,y=y0+i*c;
    s+=RECT(x,y,c,c,'var(--sf)','var(--ln)',0,1);
    if(v>0)s+='<rect x="'+x+'" y="'+y+'" width="'+c+'" height="'+c+'" style="fill:var(--ac);fill-opacity:'+(v===2?0.6:0.28)+'"/>';
    s+=T(x+c/2,y+c/2+4.5,String(v),v>0?'tb':'tm','middle');
  }
  return s;
}

var FIG_MATRIX=fig(306,matrixFig(),
  B('الجدول ده من الجمل: I like deep learning / I like NLP / I enjoy flying بنافذة حجمها 1. كل خانة هي عدد مرات ظهور الكلمتين جنب بعض.',
    'Counts from the sentences I like deep learning / I like NLP / I enjoy flying, with window size 1. Each cell is how often the two words appear side by side.'));

/* L2 fig: probability ratios on a log axis */
function ratioFig(){
  var X=function(r){return 20+(Math.log(r)/Math.LN10+1.5)/3*320;};
  return '<line x1="20" y1="90" x2="340" y2="90" style="stroke:var(--mu);stroke-width:1.5"/>'+
    '<line x1="'+X(1)+'" y1="44" x2="'+X(1)+'" y2="112" style="stroke:var(--mu);stroke-width:1.2;stroke-dasharray:4 4"/>'+
    T(X(1),126,'ratio = 1','tm','middle')+
    T(20,28,'closer to steam','tm')+T(340,28,'closer to ice','tm','end')+
    DOT(X(0.085),90,'ok',6)+T(X(0.085),76,'gas','tb','middle')+T(X(0.085),112,'≈ 0.09','tm','middle')+
    DOT(X(0.96),90,'mu',6)+T(X(0.96)-4,72,'fashion','tb','end')+
    DOT(X(1.36),90,'mu',6)+T(X(1.36)+4,112,'water','tb','start')+
    DOT(X(8.9),90,'ac',6)+T(X(8.9),76,'solid','tb','middle')+T(X(8.9),112,'≈ 8.9','tm','middle')+
    T(180,152,'P(k|ice) / P(k|steam)  (log scale)','tm','middle');
}

var FIG_RATIO=fig(164,ratioFig(),
  B('النسبة بين احتمال ظهور الكلمة k مع ice ومع steam (قيم تقريبية من ورقة GloVe). solid ونسبتها كبيرة، gas ونسبتها صغيرة، أما water و fashion فنسبتهم حوالين 1.',
    'The ratio of how likely word k is to appear with ice versus steam (approximate values from the GloVe paper). solid has a large ratio, gas a small one, while water and fashion sit near 1.'));

/* L2 fig: one vector for many senses */
function senseFig(){
  var s='';
  s+=ell(68,55,64,32,'ok')+pt(40,40,'trout','ok')+pt(95,70,'salmon','ok');
  s+=ell(75,182,68,28,'ac')+pt(40,175,'turnpike','ac')+pt(110,192,'highway','ac');
  s+=ell(280,58,64,32,'no')+pt(260,40,'spear','no')+pt(300,75,'lance','no');
  [[68,55],[75,182],[280,58]].forEach(function(p){s+='<line x1="150" y1="104" x2="'+p[0]+'" y2="'+p[1]+'" style="stroke:var(--mu);stroke-width:1;stroke-dasharray:3 4;opacity:.7"/>';});
  s+=DOT(150,104,'ink',7)+T(150,132,'pike','tb','middle');
  return s;
}

var FIG_SENSE=fig(226,senseFig(),
  B('كلمة pike ليها معاني: سمكة، طريق سريع، سلاح. الـ vector الواحد بيقع في النص بين المعاني كلها، أقرب للمعنى الأكثر تكرارًا.',
    'The word pike has several meanings: a fish, a road, a weapon. A single vector lands in the middle of all of them, closer to the most frequent sense.'));

/* L2 fig: natural log of the ratios in the worked example */
function logRatioFig(){
  var rows=[['solid',2.30,'ac'],['gas',-2.30,'ok'],['water',0.18,'mu'],['fashion',0,'mu']],s='',X0=180,K=50,i,y,v,w,pos;
  s+='<line x1="'+X0+'" y1="22" x2="'+X0+'" y2="176" style="stroke:var(--mu);stroke-width:1.5"/>';
  for(i=0;i<rows.length;i++){
    y=34+i*36;v=rows[i][1];w=Math.abs(v)*K;pos=v>=0;
    if(w>0)s+=RECT(pos?X0:X0-w,y,w,22,'var(--'+rows[i][2]+')','none',4);
    s+=T(pos?X0-8:X0+8,y+16,rows[i][0],'tb',pos?'end':'start');
    s+=T(v>0?X0+w+6:(v<0?X0-w-6:X0+6),y+16,v===0?'0':(v>0?'+':'')+v.toFixed(2),'tm',v<0?'end':'start');
  }
  s+=T(180,198,'ln( P(k|ice) / P(k|steam) )','tm','middle');
  return s;
}

var FIG_LOGRATIO=fig(210,logRatioFig(),
  B('الأعمدة هي log طبيعي لنسب المثال. الموجب معناه أقرب لـ ice، والسالب أقرب لـ steam، والقريب من الصفر مش بيفرّق.',
    'The bars are the natural log of the example ratios. Positive means closer to ice, negative means closer to steam, and near zero does not discriminate.'));

/* L2 fig: character trigrams of two related words */
function chip(x,y,txt,hot){
  return RECT(x,y,40,26,hot?'var(--ac)':'var(--sf)','var(--ln)',6)+T(x+20,y+17.5,txt,hot?'tb':'tm','middle',hot?'fill:var(--bg)':'');
}
function ngramFig(){
  var A=['&lt;le','lea','ear','arn','rni','nin','ing','ng&gt;'],Bn=['&lt;le','lea','ear','arn','rne','ned','ed&gt;'],s='',i;
  s+=T(10,26,'learning','tb');
  for(i=0;i<A.length;i++)s+=chip(10+i*43,32,A[i],i<4);
  s+=T(10,92,'learned','tb');
  for(i=0;i<Bn.length;i++)s+=chip(10+i*43,98,Bn[i],i<4);
  s+=T(10,152,'4 shared trigrams are filled','tm');
  return s;
}

var FIG_NGRAM=fig(164,ngramFig(),
  B('كلمتي learning و learned بيشتركوا في 4 trigrams، فالـ vectors بتاعتهم (مجموع الـ n-grams) بتطلع قريبة من بعض.',
    'The words learning and learned share 4 trigrams, so their vectors (sums of n-gram vectors) end up close to each other.'));

/* L2 fig: softmax probabilities and the loss */
function softmaxFig(){
  var cls=[['positive',0.659,'ok'],['negative',0.242,'mu'],['neutral',0.099,'mu']],s='',X0=92,K=230,i,y,w;
  s+='<line x1="'+X0+'" y1="18" x2="'+X0+'" y2="120" style="stroke:var(--mu);stroke-width:1.5"/>';
  for(i=0;i<cls.length;i++){
    y=26+i*34;w=cls[i][1]*K;
    s+=T(X0-8,y+16,cls[i][0],'tm','end')+RECT(X0,y,w,22,'var(--'+cls[i][2]+')','none',4)+T(X0+w+6,y+16,cls[i][1].toFixed(2),'tb');
  }
  s+=T(8,146,'softmax of logits [2.0, 1.0, 0.1]','tm');
  s+=T(8,166,'true class = positive:  loss = 0.42','tb');
  return s;
}

var FIG_SOFTMAX=fig(178,softmaxFig(),
  B('الـ softmax حوّل الـ logits [2.0, 1.0, 0.1] لاحتمالات. لو الـ class الصح positive الـ loss صغير (0.42)، ولو كان neutral الـ loss يبقى حوالي 2.3.',
    'The softmax turned the logits [2.0, 1.0, 0.1] into probabilities. If the true class is positive the loss is small (0.42); if it were neutral the loss would be about 2.3.'));

/* L2 fig: window classification */
function windowFig(){
  var W=['museums','in','Paris','are','amazing'],s='',i,x;
  for(i=0;i<W.length;i++){
    x=13+i*68;
    s+=RECT(x,14,62,30,i===2?'var(--ac)':'var(--sf)','var(--ln)',6)+T(x+31,34,W[i],i===2?'tb':'tm','middle',i===2?'fill:var(--bg)':'');
    s+=AR(x+31,46,x+31,76,'mu','mM');
  }
  s+=RECT(13,78,334,30,'var(--sf)','var(--ln)',8)+T(180,98,'concat: [x1; x2; x3; x4; x5]','tb','middle');
  s+=AR(180,110,180,138,'ac','mA');
  s+=RECT(110,140,140,30,'var(--ac)','none',8)+T(180,160,'softmax: LOC','tb','middle','fill:var(--bg)');
  return s;
}

var FIG_WINDOW=fig(184,windowFig(),
  B('نافذة حجمها 2 حوالين الكلمة اللي في النص (Paris). بنضم vectors الـ 5 كلمات ورا بعض ونديهم للـ classifier.',
    'A window of size 2 around the center word (Paris). The 5 word vectors are concatenated and fed to the classifier.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:2,t:B("GloVe ومعاني الكلمة و Neural Classifiers","GloVe, Word Senses & Neural Classifiers"),cards:[

{id:"l2-cooccurrence",t:B("Co-occurrence matrix: نعدّ بدل ما نتنبأ","Co-occurrence matrix: counting instead of predicting"),
 b:cat(B('<p>فيه طريقة تانية غير Word2Vec: <mark>نعدّ</mark> كام مرة كل كلمتين ظهروا جنب بعض في نافذة صغيرة. النتيجة جدول اسمه <mark>co-occurrence matrix</mark>.</p>',
         '<p>There is another approach besides Word2Vec: <mark>count</mark> how often each pair of words appears together within a small window. The result is a table called the <mark>co-occurrence matrix</mark>.</p>'),
       FIG_MATRIX,
       B('<p>كل صف هو vector للكلمة. المشكلة: الجدول ضخم (V × V) ومعظمه أصفار، والكلمات الشائعة زي <code>the</code> بتسيطر على الأرقام. حل قديم: نطبّق <mark>SVD</mark> ونحتفظ بأكبر k بُعد، فنطلع بـ dense vectors قصيرة.</p>'+
         '<p>الفرق: Word2Vec بيتعلم بالتنبؤ على نصوص كتير، وطرق العد بتستفيد من الإحصائيات الكلية كلها مرة واحدة. GloVe بيجمع الفكرتين.</p>',
         '<p>Each row is a vector for its word. Problems: the table is huge (V × V), mostly zeros, and frequent words like <code>the</code> dominate the counts. An old fix is to apply <mark>SVD</mark> and keep the top k dimensions, giving short dense vectors.</p>'+
         '<p>The difference: Word2Vec learns by prediction over lots of text, while count-based methods use all the global statistics at once. GloVe combines the two ideas.</p>')),
 q:[
   CQ("إيه مشكلة الـ co-occurrence matrix الخام؟","What is the problem with a raw co-occurrence matrix?",
         [["ضخمة ومعظمها أصفار، والكلمات الشائعة بتسيطر","Huge, mostly zeros, and frequent words dominate"],["صغيرة جدًا ومش بتكفي","Too small to be useful"],["مش بتحتوي على أي إحصائيات","Contains no statistics"],["بتحتاج labels يدوية","Needs manual labels"]],
         0,"الجدول V × V ومعظم خاناته أصفار، وكلمات زي the بتظهر مع كل حاجة فبتطغى على الأرقام.","The table is V × V and mostly zeros, and words like the co-occur with everything so they swamp the numbers."),
   CQ("لو الـ vocabulary فيه 50,000 كلمة، كام خانة في الـ co-occurrence matrix؟","If the vocabulary has 50,000 words, how many cells are in the co-occurrence matrix?",
      [["2.5 مليار","2.5 billion"],["50 ألف","50 thousand"],["100 ألف","100 thousand"],["250 مليون","250 million"]],
      0,"الجدول V × V، يعني 50,000 × 50,000 = 2,500,000,000 خانة.","The table is V × V, so 50,000 × 50,000 = 2,500,000,000 cells.")
 ],
 f:[
   CF("إيه مشكلة الـ co-occurrence matrix الخام وإزاي نحلها؟","What is wrong with a raw co-occurrence matrix and how can it be fixed?",
         "ضخمة ومعظمها أصفار والكلمات الشائعة بتسيطر. حل قديم: SVD وناخد أكبر k بُعد للحصول على dense vectors.","It is huge, mostly zeros, and frequent words dominate. An old fix: SVD, keeping the top k dimensions to get dense vectors."),
   CF("إيه معنى window size = 1 في الـ co-occurrence matrix؟","What does window size = 1 mean in a co-occurrence matrix?",
      "نعدّ بس الكلمة اللي قبل والكلمة اللي بعد الكلمة المركزية.","We count only the word immediately before and the word immediately after the center word.")
 ],
 terms:[
   {t:B("Co-occurrence matrix","Co-occurrence matrix"),
    d:B("جدول V × V بيعدّ كام مرة كل كلمتين ظهروا جنب بعض في نافذة صغيرة.","A V × V table counting how often each pair of words appears together within a small window.")},
   {t:B("SVD","SVD"),
    d:B("Singular Value Decomposition: تحليل مصفوفة، وبنحتفظ بأكبر k بُعد منها علشان نضغطها لـ dense vectors.","Singular Value Decomposition: a matrix factorization; we keep the top k dimensions to compress it into dense vectors.")}
 ]},

{id:"l2-ratios",t:B("النسب بتكشف المعنى","Ratios reveal meaning"),
 b:cat(B('<p>فكرة GloVe الأساسية (Pennington وآخرين، 2014): مش الاحتمالات نفسها هي المهمة، لكن <mark>النسبة بينها</mark>. خد الكلمتين <code>ice</code> و <code>steam</code> وقارن احتمال ظهور كلمة k جنب كل واحدة:</p>',
         '<p>GloVe\'s key idea (Pennington et al., 2014): the probabilities themselves are not what matters, but the <mark>ratio between them</mark>. Take the words <code>ice</code> and <code>steam</code> and compare how likely a word k is to appear next to each:</p>'),
       FIG_RATIO,
       B('<p>الكلمة <code>solid</code> نسبتها كبيرة (قريبة من ice)، و <code>gas</code> نسبتها صغيرة (قريبة من steam). أما <code>water</code> (مرتبطة بالاتنين) و <code>fashion</code> (مش مرتبطة بأي منهم) فنسبتهم حوالين 1. يعني النسبة بتفصل بين أبعاد المعنى وبتشيل الضجيج.</p>'+
         '<p>عايزين vectors بحيث الفرق بينهم يعبّر عن النسبة دي.</p>',
         '<p><code>solid</code> has a large ratio (closer to ice) and <code>gas</code> a small one (closer to steam). <code>water</code> (related to both) and <code>fashion</code> (related to neither) are both near 1. So the ratio separates dimensions of meaning and cancels out noise.</p>'+
         '<p>We want vectors whose differences express these ratios.</p>')),
 q:[
   CQ("لو النسبة P(k|ice) / P(k|steam) قريبة من 1، الكلمة k غالبًا...","If the ratio P(k|ice) / P(k|steam) is close to 1, the word k is probably...",
         [["مرتبطة بالاتنين أو مش مرتبطة بأي منهم","Related to both or to neither"],["مرتبطة بـ ice بس","Related to ice only"],["مرتبطة بـ steam بس","Related to steam only"],["مش موجودة في النص","Absent from the text"]],
         0,"نسبة قريبة من 1 معناها إن الكلمة مش بتفرّق بين ice و steam.","A ratio near 1 means the word does not discriminate between ice and steam."),
   CQ("لو P(k|ice) = 0.006 و P(k|steam) = 0.002، كام النسبة والكلمة k أقرب لمين؟","If P(k|ice) = 0.006 and P(k|steam) = 0.002, what is the ratio and which word is k closer to?",
      [["3، أقرب لـ ice","3, closer to ice"],["3، أقرب لـ steam","3, closer to steam"],["0.33، أقرب لـ ice","0.33, closer to ice"],["0.33، أقرب لـ steam","0.33, closer to steam"]],
      0,"النسبة = 0.006 / 0.002 = 3، وهي أكبر من 1 فالكلمة أقرب لـ ice.","The ratio is 0.006 / 0.002 = 3, which is above 1, so the word is closer to ice.")
 ],
 f:[
   CF("ليه GloVe بيهتم بنسبة الاحتمالات مش الاحتمالات نفسها؟","Why does GloVe care about ratios of probabilities rather than the probabilities?",
         "النسبة P(k|a)/P(k|b) كبيرة أو صغيرة لما k بتميّز بين a و b، وقريبة من 1 لما لا. فبتفصل أبعاد المعنى.","The ratio P(k|a)/P(k|b) is large or small when k discriminates between a and b, and near 1 otherwise, so it isolates dimensions of meaning."),
   CF("إيه معنى نسبة كبيرة زي 8.9 لكلمة solid؟","What does a large ratio like 8.9 for the word solid mean?",
      "solid بتظهر مع ice أكتر بكتير من steam، فهي كلمة بتميّز ice.","solid appears with ice far more often than with steam, so it is a word that characterizes ice.")
 ],
 terms:[
   {t:B("Probability ratio","Probability ratio"),
    d:B("P(k|a) / P(k|b): نسبة احتمال ظهور k مع a لاحتمال ظهورها مع b. بتكشف الكلمات اللي بتفرّق بينهم.","P(k|a) / P(k|b): how likely k is to appear with a versus with b. It reveals the words that tell them apart.")}
 ]},

{id:"l2-ratio-example",t:B("مثال رقمي: النسبة بتبقى فرق","Worked example: the ratio becomes a difference"),
 b:cat(B('<p>نجرّب النسبة بأرقام صغيرة. نفترض إن <code>ice</code> و <code>steam</code> ظهر مع كل واحدة 10,000 كلمة سياق، ودي عدد مرات ظهور كل كلمة k:</p>'+
         '<div class="m">k        ice  steam  ratio\nsolid     40      4  10\ngas        5     50  0.1\nwater    300    250  1.2\nfashion    2      2  1</div>'+
         '<p>لأن عدد السياقات متساوي، النسبة P(k|ice) / P(k|steam) هي نفسها نسبة العدّ. GloVe عايز الفرق بين vectorين يعبّر عن النسبة، فبياخد <mark>log</mark> وبتتحول لطرح. بشكل مبسّط:</p>'+
         '<div class="m">(w_ice - w_steam) . w~_k ≈ ln P(k|ice) - ln P(k|steam)</div>',
         '<p>Let us try the ratio with small numbers. Suppose <code>ice</code> and <code>steam</code> each appeared with 10,000 context words, and these are the counts of each word k:</p>'+
         '<div class="m">k        ice  steam  ratio\nsolid     40      4  10\ngas        5     50  0.1\nwater    300    250  1.2\nfashion    2      2  1</div>'+
         '<p>Since the context totals are equal, the ratio P(k|ice) / P(k|steam) is just the ratio of the counts. GloVe wants the difference between two vectors to express the ratio, so it takes the <mark>log</mark> and the ratio becomes a subtraction. In simplified form:</p>'+
         '<div class="m">(w_ice - w_steam) . w~_k ≈ ln P(k|ice) - ln P(k|steam)</div>'),
       FIG_LOGRATIO,
       B('<p>الـ context vector بتاع <code>solid</code> بيشاور في نفس اتجاه (w_ice - w_steam)، وبتاع <code>gas</code> عكسه، وبتاع <code>fashion</code> عمودي عليه تقريبًا.</p>'+
         '<p><mark>غلطة شائعة:</mark> نفتكر إن النسبة القريبة من 1 معناها إن الكلمة مش مرتبطة. <code>water</code> مرتبطة بالاتنين جدًا، لكن النسبة مش بتفرّق بينهم.</p>',
         '<p>The context vector of <code>solid</code> points in the same direction as (w_ice - w_steam), that of <code>gas</code> points the opposite way, and that of <code>fashion</code> is roughly perpendicular to it.</p>'+
         '<p><mark>Common mistake:</mark> reading a ratio near 1 as "unrelated". <code>water</code> is strongly related to both words; the ratio just cannot tell them apart.</p>')),
 q:[
   CQ("ليه GloVe بياخد log للنسبة؟","Why does GloVe take the log of the ratio?",
      [["عشان النسبة تتحول لفرق، ونقدر نعبّر عنه بالفرق بين vectorين","So the ratio becomes a difference, which can be expressed by the difference of two vectors"],["عشان كل القيم تبقى موجبة","So all values become positive"],["عشان نحذف الكلمات النادرة","To remove rare words"],["عشان نكبّر حجم الـ vocabulary","To enlarge the vocabulary"]],
      0,"log(a / b) = log a - log b، فالنسبة بتبقى طرح، والطرح بيتمثل بالفرق بين vectorين.","log(a / b) = log a - log b, so the ratio becomes a subtraction, and a subtraction can be represented by the difference between two vectors."),
   CQ("كلمة k ظهرت 20 مرة مع ice و 80 مرة مع steam (10,000 سياق لكل واحدة). كام ln النسبة تقريبًا؟","A word k appeared 20 times with ice and 80 times with steam (10,000 contexts each). What is ln of the ratio, roughly?",
      [["-1.39","-1.39"],["+1.39","+1.39"],["0.25","0.25"],["4","4"]],
      0,"النسبة = 20 / 80 = 0.25، و ln 0.25 ≈ -1.39. السالب معناه إن k أقرب لـ steam.","The ratio is 20 / 80 = 0.25, and ln 0.25 ≈ -1.39. Negative means k is closer to steam.")
 ],
 f:[
   CF("إزاي GloVe بيحوّل النسبة لحاجة نقدر نمثلها بـ vectors؟","How does GloVe turn the ratio into something vectors can represent?",
      "بياخد log فالنسبة بتبقى فرق: ln P_ik - ln P_jk، وبنخلي (w_i - w_j) . w~_k يقرّب الفرق ده.","It takes the log so the ratio becomes a difference, ln P_ik - ln P_jk, and makes (w_i - w_j) . w~_k approximate it."),
   CF("إيه معنى نسبة قريبة من 1 لكلمة زي water؟","What does a ratio near 1 mean for a word like water?",
      "الكلمة مش بتميّز بين ice و steam (مش إنها غير مرتبطة)، فمش بتحمل معلومة عن الفرق بينهم.","The word does not discriminate between ice and steam (not that it is unrelated), so it carries no information about the difference between them.")
 ]},

{id:"l2-glove",t:B("GloVe: الهدف","GloVe: the objective"),
 b:cat(B('<p>GloVe بيحاول يخلي <mark>dot product</mark> بين vectorين يقرّب <mark>log</mark> عدد مرات ظهورهم مع بعض:</p>'+
     '<div class="m">w_i . w~_j + b_i + b~_j ≈ log X_ij</div>'+
     '<p><code>X_ij</code> هو عدد مرات ظهور الكلمة j في سياق الكلمة i. والـ loss هو مجموع المربعات:</p>'+
     '<div class="m">J = sum_{i,j} f(X_ij) * (w_i . w~_j + b_i + b~_j - log X_ij)^2</div>'+
     '<p>الدالة <code>f</code> بتدي وزن صغير للأزواج النادرة، وبتثبت عند سقف للأزواج الشائعة جدًا (زي the)، فمتسيطرش على الـ loss. الـ <code>b</code> حدود ثابتة (bias) لكل كلمة. بعد التدريب بناخد <code>w + w~</code> كـ vector نهائي.</p>',
     '<p>GloVe tries to make the <mark>dot product</mark> of two vectors approximate the <mark>log</mark> of how often they co-occur:</p>'+
     '<div class="m">w_i . w~_j + b_i + b~_j ≈ log X_ij</div>'+
     '<p><code>X_ij</code> is how often word j appears in the context of word i. The loss is a sum of squares:</p>'+
     '<div class="m">J = sum_{i,j} f(X_ij) * (w_i . w~_j + b_i + b~_j - log X_ij)^2</div>'+
     '<p>The function <code>f</code> gives small weight to rare pairs and caps the weight of very frequent pairs (like the), so they do not dominate the loss. The <code>b</code> terms are per-word biases. After training we take <code>w + w~</code> as the final vector.</p>'),
       B('<p>ليه <code>log</code>؟ لأنه بيحوّل النسبة لفرق وبيصغّر الأرقام الضخمة للكلمات الشائعة (الـ log هنا طبيعي <code>ln</code>). ودي دالة الوزن في الورقة:</p>'+
  '<div class="m">f(x) = (x / x_max)^0.75  if x &lt; x_max, else 1</div>'+
  '<p>وقيمة <code>x_max</code> فيها 100.</p>',
  '<p>Why <code>log</code>? It turns a ratio into a difference and shrinks the huge counts of frequent words (the log here is the natural <code>ln</code>). In the paper, the weighting function is:</p>'+
  '<div class="m">f(x) = (x / x_max)^0.75  if x &lt; x_max, else 1</div>'+
  '<p>with <code>x_max</code> set to 100.</p>')),
 q:[
   CQ("ليه بنضرب في f(X_ij) في الـ loss؟","Why do we multiply by f(X_ij) in the loss?",
         [["عشان الأزواج الشائعة جدًا ما تسيطرش على الـ loss","So very frequent pairs do not dominate the loss"],["عشان نحذف الكلمات النادرة تمامًا","To remove rare words completely"],["عشان نحوّل الـ vectors لـ one-hot","To turn vectors into one-hot"],["عشان نضاعف حجم الـ vocabulary","To double the vocabulary size"]],
         0,"f بتحط سقف للوزن، فأزواج زي (the, of) مبتطغاش على باقي الأزواج.","f caps the weight, so pairs like (the, of) do not overwhelm the rest."),
   CQ("لو w_i . w~_j + b_i + b~_j ≈ 4.6 (log طبيعي)، X_ij حوالي كام؟","If w_i . w~_j + b_i + b~_j ≈ 4.6 (natural log), roughly what is X_ij?",
      [["100","100"],["4.6","4.6"],["46","46"],["10","10"]],
      0,"الموديل بيقرّب log X_ij، فـ X_ij ≈ e^4.6 ≈ 100.","The model approximates log X_ij, so X_ij ≈ e^4.6 ≈ 100.")
 ],
 f:[
   CF("إيه هدف GloVe؟","What is the GloVe objective?",
         "نخلي w_i . w~_j + b_i + b~_j يقرّب log X_ij، بمجموع مربعات موزون بالدالة f(X_ij).","Make w_i . w~_j + b_i + b~_j approximate log X_ij, using a sum of squares weighted by f(X_ij)."),
   CF("إيه شكل دالة الوزن f في GloVe؟","What does the GloVe weighting function f look like?",
      "f(x) = (x / x_max)^0.75 لو x أقل من x_max (في الورقة 100)، وإلا بتبقى 1.","f(x) = (x / x_max)^0.75 when x is below x_max (100 in the paper), otherwise it is 1."),
   CF("ليه بناخد w + w~ كـ vector نهائي؟","Why do we take w + w~ as the final vector?",
      "الاتنين بيلعبوا نفس الدور (الجدول متماثل)، فجمعهم عادة بيدّي تحسين بسيط.","The two play the same role (the matrix is symmetric), so adding them usually gives a small boost.")
 ],
 terms:[
   {t:B("GloVe","GloVe"),
    d:B("Global Vectors: بيتعلم word vectors من إحصائيات الـ co-occurrence الكلية بـ loss مربعات موزون.","Global Vectors: learns word vectors from global co-occurrence statistics with a weighted least-squares loss.")},
   {t:B("Weighting function f","Weighting function f"),
    d:B("دالة في loss الـ GloVe بتصغّر وزن الأزواج النادرة وبتحط سقف لوزن الشائعة.","A function in the GloVe loss that down-weights rare pairs and caps the weight of frequent ones.")}
 ]},

{id:"l2-evaluation",t:B("إزاي نقيّم الـ word vectors","How to evaluate word vectors"),
 b:B('<p>فيه نوعين تقييم:</p>'+
     '<p><mark>Intrinsic</mark>: نقيس الـ vectors نفسها، زي حل الـ analogies (man : woman :: king : ?) أو نقارن الـ cosine similarity بأحكام بشر على تشابه الكلمات. سريع، لكن مش شرط يفيد في مهمة حقيقية.</p>'+
     '<p><mark>Extrinsic</mark>: نستخدم الـ vectors في مهمة حقيقية (زي named entity recognition) ونشوف الدقة اتحسنت ولا لأ. أبطأ لكنه اللي يهم فعلًا.</p>'+
     '<p>حل الـ analogy: بنحسب <code>x_king - x_man + x_woman</code> وندوّر على أقرب vector بالـ <mark>cosine similarity</mark> من غير الكلمات الأصلية الثلاثة. والـ cosine هو الـ dot product بعد القسمة على طولي الـ vectors، فبيقيس الزاوية مش الحجم.</p>'+
         '<p>ملاحظات عملية: حوالي 300 بُعد غالبًا كفاية، وكل ما البيانات أكتر الـ vectors بتبقى أحسن.</p>',
     '<p>There are two kinds of evaluation:</p>'+
     '<p><mark>Intrinsic</mark>: measure the vectors themselves, e.g. solving analogies (man : woman :: king : ?) or comparing cosine similarity to human judgments of word similarity. Fast, but not guaranteed to help on a real task.</p>'+
     '<p><mark>Extrinsic</mark>: plug the vectors into a real task (like named entity recognition) and see whether accuracy improves. Slower, but it is what actually matters.</p>'+
     '<p>Solving an analogy: compute <code>x_king - x_man + x_woman</code> and look for the nearest vector by <mark>cosine similarity</mark>, excluding the three original words. Cosine is the dot product divided by the lengths of the vectors, so it measures the angle, not the size.</p>'+
         '<p>Practical notes: around 300 dimensions is usually enough, and more data gives better vectors.</p>'),
 q:[
   CQ("حل analogy زي king - man + woman هو تقييم...","Solving an analogy like king - man + woman is an evaluation that is...",
         [["Intrinsic","Intrinsic"],["Extrinsic","Extrinsic"],["مش تقييم أصلًا","Not an evaluation at all"],["تدريب للموديل","Training the model"]],
         0,"بنقيس جودة الـ vectors نفسها من غير مهمة نهائية، فده intrinsic.","We measure the vectors directly without a downstream task, so it is intrinsic."),
   CQ("كام الـ cosine similarity بين vectorين متعامدين (زاوية 90 درجة)؟","What is the cosine similarity between two perpendicular vectors (90 degrees)?",
      [["0","0"],["1","1"],["-1","-1"],["0.5","0.5"]],
      0,"cos 90° = 0، يعني مفيش تشابه في الاتجاه.","cos 90° = 0, meaning no similarity in direction.")
 ],
 f:[
   CF("إيه الفرق بين intrinsic و extrinsic evaluation؟","What is the difference between intrinsic and extrinsic evaluation?",
         "Intrinsic: نقيس الـ vectors مباشرة (analogies، similarity). Extrinsic: نقيسها من خلال أداء مهمة حقيقية.","Intrinsic: measure the vectors directly (analogies, similarity). Extrinsic: measure them through performance on a real task."),
   CF("إزاي بنحل analogy زي man : woman :: king : ؟","How do we solve an analogy like man : woman :: king : ?",
      "نحسب x_king - x_man + x_woman وندوّر على أقرب vector بالـ cosine similarity، من غير الكلمات الأصلية.","Compute x_king - x_man + x_woman and look for the nearest vector by cosine similarity, excluding the original words.")
 ],
 terms:[
   {t:B("Intrinsic evaluation","Intrinsic evaluation"),
 d:B("تقييم الـ vectors نفسها (analogies، similarity) من غير مهمة نهائية.","Evaluating the vectors themselves (analogies, similarity) without a downstream task.")},
   {t:B("Extrinsic evaluation","Extrinsic evaluation"),
 d:B("تقييم الـ vectors من خلال أداء مهمة حقيقية زي NER.","Evaluating the vectors through performance on a real task such as NER.")},
   {t:B("Cosine similarity","Cosine similarity"),
 d:B("مقياس تشابه بين vectors: الـ dot product مقسوم على حاصل ضرب الأطوال. قيمته بين -1 و 1.","A similarity measure between vectors: the dot product divided by the product of the lengths. Its value is between -1 and 1.")}
 ]},

{id:"l2-wordsenses",t:B("الكلمة الواحدة ليها معاني كتير","One word, many senses"),
 b:cat(B('<p>كلمة زي <code>pike</code> ليها معاني: سمكة، سلاح، طريق سريع. لكن vector واحد لكل كلمة معناه إن كل المعاني اتخلطت في نقطة واحدة.</p>',
         '<p>A word like <code>pike</code> has several meanings: a fish, a weapon, a road. But one vector per word means all senses get blended into a single point.</p>'),
       FIG_SENSE,
       B('<p>فكرة (Arora وآخرين، 2018): الـ vector اللي اتعلمناه تقريبًا <mark>متوسط مرجّح</mark> لـ vectors المعاني، والوزن حسب تكرار كل معنى. وكمان ممكن نفصل المعاني دي بأسلوب اسمه sparse coding.</p>'+
         '<p>بشكل أدق، وزن كل معنى هو نسبة تكراره: <code>a_i = f_i / (f_1 + f_2 + f_3)</code>. لو المعاني ظهرت 600 و 300 و 100 مرة:</p>'+'<div class="m">v_pike = 0.6 v_fish + 0.3 v_road + 0.1 v_weapon</div>'+
         '<p>لاحقًا في الـ Transformers هنشوف vectors بتتغير حسب السياق، وده بيحل المشكلة دي بشكل أحسن.</p>',
         '<p>An idea (Arora et al., 2018): the learned vector is roughly a <mark>weighted average</mark> of the sense vectors, weighted by how frequent each sense is. The senses can even be separated with a technique called sparse coding.</p>'+
         '<p>More precisely, the weight of each sense is its share of the frequency: <code>a_i = f_i / (f_1 + f_2 + f_3)</code>. If the senses appeared 600, 300 and 100 times:</p>'+'<div class="m">v_pike = 0.6 v_fish + 0.3 v_road + 0.1 v_weapon</div>'+
         '<p>Later, with Transformers, we will see vectors that change with context, which solves this problem much better.</p>')),
 q:[
   CQ("vector واحد لكلمة ليها معاني متعددة بيبقى...","A single vector for a word with several senses is roughly...",
         [["متوسط مرجّح لمعانيها","A weighted average of its senses"],["معنى واحد بس من معانيها","Only one of its senses"],["صفر","Zero"],["عشوائي تمامًا","Completely random"]],
         0,"المعاني بتتخلط، والمعنى الأكثر تكرارًا بياخد وزن أكبر.","The senses blend together, and the more frequent sense gets more weight."),
   CQ("لو معاني pike ظهرت 600 و 300 و 100 مرة، كام وزن المعنى التاني في الـ vector؟","If the senses of pike appeared 600, 300 and 100 times, what is the weight of the second sense in the vector?",
      [["0.3","0.3"],["0.5","0.5"],["0.1","0.1"],["300","300"]],
      0,"الوزن = 300 / (600 + 300 + 100) = 0.3.","The weight is 300 / (600 + 300 + 100) = 0.3.")
 ],
 f:[
   CF("إيه اللي بيحصل لكلمة متعددة المعاني في word vector واحد؟","What happens to a multi-sense word in a single word vector?",
         "الـ vector بيبقى تقريبًا متوسط مرجّح لـ vectors المعاني، بوزن حسب تكرار كل معنى.","The vector becomes roughly a weighted average of the sense vectors, weighted by how frequent each sense is."),
   CF("إيه فايدة الـ sparse coding مع الـ word vectors؟","What is sparse coding useful for with word vectors?",
      "بيفصل الـ vector المتوسط لـ vectors المعاني اللي اتخلطت فيه.","It separates the averaged vector back into the sense vectors that were blended into it.")
 ],
 terms:[
   {t:B("Polysemy","Polysemy"),
    d:B("كلمة ليها أكتر من معنى (زي pike: سمكة، طريق، سلاح).","A word that has more than one meaning (like pike: a fish, a road, a weapon).")},
   {t:B("Sparse coding","Sparse coding"),
    d:B("أسلوب بيفصل vector الكلمة لخليط من vectors المعاني.","A technique that separates a word vector into a mixture of sense vectors.")}
 ]},

{id:"l2-oov",t:B("كلمات مش في الـ vocabulary: OOV و subwords","Out-of-vocabulary words and subwords"),
 b:cat(B('<p>أي vocabulary ثابت ليه حدود. أي كلمة جديدة أو غلطة إملائية (زي <code>learnin</code>) بتبقى <mark>OOV</mark> (out-of-vocabulary)، بتاخد رمز <code>&lt;UNK&gt;</code> ومالهاش vector حقيقي. والمشكلة أكبر في لغات زي العربي، لأن الجذر الواحد بيطلع أشكال كتير وكل شكل نادر لوحده.</p>'+
         '<p>الحل: نبني الكلمة من أجزائها. في <mark>FastText</mark> الكلمة هي مجموع vectors الـ <mark>character n-grams</mark> بتاعتها (عادة من 3 لـ 6 حروف) بعد ما نحط علامتي بداية ونهاية، وبنضيف الكلمة كلها كرمز إضافي. كلمة <code>learning</code> بـ n = 3:</p>'+
         '<div class="m">&lt;le, lea, ear, arn, rni, nin, ing, ng&gt;</div>',
         '<p>Any fixed vocabulary has limits. A new word or a typo (like <code>learnin</code>) is <mark>OOV</mark> (out-of-vocabulary): it gets the <code>&lt;UNK&gt;</code> symbol and no real vector. It is worse in languages like Arabic, where one root produces many forms and each form is rare on its own.</p>'+
         '<p>The fix: build the word from its pieces. In <mark>FastText</mark> a word is the sum of the vectors of its <mark>character n-grams</mark> (usually 3 to 6 characters) after adding start and end markers, plus the whole word as one extra symbol. The word <code>learning</code> with n = 3:</p>'+
         '<div class="m">&lt;le, lea, ear, arn, rni, nin, ing, ng&gt;</div>'),
       FIG_NGRAM,
       B('<p>كده <code>learned</code> بتشارك <code>learning</code> في n-grams كتير فـ vectors قريبة، وكلمة ما شفناهاش قبل كده بياخد vector من n-grams بتاعتها.</p>'+
         '<p>الطريقة التانية <mark>BPE</mark>: نبدأ بالحروف وندمج أكتر زوج متجاور تكرارًا في رمز جديد، ونكرر لحد حجم vocabulary معيّن. الكلمات الشائعة بتفضل كاملة والنادرة بتتقسم لقطع. هنرجع لها بالتفصيل لاحقًا.</p>',
         '<p>So <code>learned</code> shares many n-grams with <code>learning</code> and gets a close vector, and a word we never saw gets its vector from its n-grams.</p>'+
         '<p>The other way is <mark>BPE</mark>: start from characters and keep merging the most frequent adjacent pair into a new symbol until the vocabulary reaches a chosen size. Frequent words stay whole and rare words split into pieces. We will come back to it in detail later.</p>')),
 q:[
   CQ("إيه اللي بيحصل لكلمة OOV في word vectors عادية (word2vec أو GloVe)؟","What happens to an OOV word with ordinary word vectors (word2vec or GloVe)?",
      [["بتاخد رمز UNK ومفيش vector يعبّر عنها","It gets the UNK symbol and no vector that represents it"],["بيتعلملها vector تلقائيًا","A vector is learned for it automatically"],["بتتحول لأقرب كلمة في الـ vocabulary","It is turned into the nearest word in the vocabulary"],["بيتدرب الموديل من الأول","The model is retrained from scratch"]],
      0,"الـ vocabulary ثابت، فأي كلمة برّاه بتتحوّل لـ UNK.","The vocabulary is fixed, so any word outside it becomes UNK."),
   CQ("كلمة cat بعد علامتي البداية والنهاية (&lt;cat&gt;) بـ n = 3، كام trigram فيها (من غير الكلمة كاملة)؟","The word cat with start and end markers (&lt;cat&gt;) and n = 3 has how many trigrams (not counting the whole word)?",
      [["3","3"],["2","2"],["5","5"],["4","4"]],
      0,"&lt;cat&gt; فيها 5 رموز، يعني 5 - 3 + 1 = 3 trigrams: <code>&lt;ca, cat, at&gt;</code>.","&lt;cat&gt; has 5 symbols, so 5 - 3 + 1 = 3 trigrams: <code>&lt;ca, cat, at&gt;</code>.")
 ],
 f:[
   CF("إيه هي الـ character n-grams في FastText وإزاي بتحل مشكلة OOV؟","What are character n-grams in FastText and how do they solve OOV?",
      "بنقسم الكلمة (بعد علامتي بداية ونهاية) لقطع من 3 لـ 6 حروف، وvector الكلمة = مجموع vectors القطع. فكلمة جديدة بتاخد vector من قطعها.","We split the word (after start and end markers) into pieces of 3 to 6 characters, and the word vector is the sum of the piece vectors. So a new word gets a vector from its pieces."),
   CF("إزاي بيشتغل الـ BPE؟","How does BPE work?",
      "نبدأ بالحروف وندمج أكتر زوج متجاور تكرارًا في رمز جديد، ونكرر لحد حجم الـ vocabulary المطلوب.","Start from characters and repeatedly merge the most frequent adjacent pair into a new symbol, until the vocabulary reaches the target size.")
 ],
 terms:[
   {t:B("OOV (out-of-vocabulary)","OOV (out-of-vocabulary)"),
 d:B("Out-of-vocabulary: كلمة مش موجودة في الـ vocabulary، فمالهاش vector.","Out-of-vocabulary: a word that is not in the vocabulary, so it has no vector.")},
   {t:B("Character n-gram","Character n-gram"),
    d:B("قطعة من n حروف متتالية من الكلمة (مع علامتي بداية ونهاية).","A piece of n consecutive characters of a word (with start and end markers).")},
   {t:B("FastText","FastText"),
    d:B("طريقة بتمثّل الكلمة بمجموع vectors الـ character n-grams بتاعتها.","A method that represents a word as the sum of the vectors of its character n-grams.")},
   {t:B("BPE (Byte Pair Encoding)","BPE (Byte Pair Encoding)"),
 d:B("Byte Pair Encoding: بندمج أكتر زوج رموز متجاور تكرارًا لحد حجم vocabulary معيّن.","Byte Pair Encoding: repeatedly merge the most frequent adjacent symbol pair until the vocabulary reaches a chosen size.")}
 ]},

{id:"l2-classifier",t:B("من vectors لـ classifier","From vectors to a classifier"),
 b:cat(B('<p>عايزين نصنّف مثلًا جملة (إيجابي أو سلبي) أو كلمة (اسم شخص أو مكان). بنبدأ بـ <mark>softmax classifier</mark>: لكل class فيه صف في مصفوفة <code>W</code>:</p>'+
     '<div class="m">P(y | x) = exp(W_y . x) / sum_c exp(W_c . x)</div>'+
     '<p>الأرقام <code>W_c . x</code> قبل الـ softmax اسمها <mark>logits</mark>، والـ softmax بيحوّلها لاحتمالات مجموعها 1.</p>'+
         '<p>والـ loss هو <mark>cross-entropy</mark>: سالب log احتمال الـ class الصح:</p>'+
     '<div class="m">loss = -log P(y_true | x)</div>'+
     '<p>لو الموديل متأكد من الإجابة الصح، الـ loss بيقرّب من صفر.</p>'+
     '<p>المشكلة إن حد الفصل في الـ softmax classifier <mark>خطي</mark> (خط مستقيم بين الـ classes)، وده مش كفاية لبيانات معقدة. وده اللي بتحله الـ neural networks في المحاضرة الجاية.</p>',
     '<p>Say we want to classify a sentence (positive or negative) or a word (person or place). We start with a <mark>softmax classifier</mark>: each class has a row in a matrix <code>W</code>:</p>'+
     '<div class="m">P(y | x) = exp(W_y . x) / sum_c exp(W_c . x)</div>'+
     '<p>The numbers <code>W_c . x</code> before the softmax are called <mark>logits</mark>, and the softmax turns them into probabilities that sum to 1.</p>'+
         '<p>The loss is <mark>cross-entropy</mark>: minus the log probability of the correct class:</p>'+
     '<div class="m">loss = -log P(y_true | x)</div>'+
     '<p>If the model is confident in the right answer, the loss approaches zero.</p>'+
     '<p>The catch: the decision boundary of a softmax classifier is <mark>linear</mark> (a straight line between classes), which is not enough for complex data. Neural networks fix that in the next lecture.</p>'),
       B('<p>وفي الـ neural networks الـ softmax هيفضل الطبقة الأخيرة، واللي هيتغيّر هو كل اللي قبله.</p>',
  '<p>In neural networks the softmax stays as the final layer; what changes is everything before it.</p>')),
 q:[
   CQ("في cross-entropy، لو P(y_true | x) = 1 يبقى الـ loss...","In cross-entropy, if P(y_true | x) = 1 the loss is...",
         [["0","0"],["1","1"],["-1","-1"],["لانهائي","Infinite"]],
         0,"سالب log واحد يساوي صفر.","Minus the log of 1 is zero."),
   CQ("لو الـ logits لـ 3 classes هي [1, 1, 1]، كام الاحتمال اللي الـ softmax بيدّيه لكل class؟","If the logits of 3 classes are [1, 1, 1], what probability does the softmax give each class?",
      [["1/3","1/3"],["1","1"],["0","0"],["e","e"]],
      0,"الـ logits متساوية فالـ exp متساوي، والاحتمالات لازم مجموعها 1، يعني 1/3 لكل class.","Equal logits give equal exps, and the probabilities must sum to 1, so each class gets 1/3.")
 ],
 f:[
   CF("إيه هو الـ cross-entropy loss وإيه حدود الـ softmax classifier؟","What is the cross-entropy loss, and what limits a softmax classifier?",
         "cross-entropy = -log احتمال الـ class الصح. وحد الفصل بتاع الـ softmax classifier خطي بس.","cross-entropy = -log of the correct class's probability. The softmax classifier's decision boundary is linear only."),
   CF("إيه هي الـ logits؟","What are logits?",
      "الأرقام W_c . x (score لكل class) قبل ما الـ softmax يحوّلها لاحتمالات.","The numbers W_c . x (a score per class) before the softmax turns them into probabilities.")
 ],
 terms:[
   {t:B("Softmax classifier","Softmax classifier"),
    d:B("classifier بيحوّل score كل class لاحتمال بالمعادلة <code>exp(W_c . x) / sum_c exp(W_c . x)</code>.","A classifier that turns each class score into a probability with <code>exp(W_c . x) / sum_c exp(W_c . x)</code>.")},
   {t:B("Cross-entropy loss","Cross-entropy loss"),
    d:B("سالب log احتمال الـ class الصح: <code>-log P(y_true | x)</code>.","Minus the log of the probability of the correct class: <code>-log P(y_true | x)</code>.")},
   {t:B("Logits","Logits"),
 d:B("الـ scores الخام قبل الـ softmax، واحد لكل class (أو لكل كلمة). في Skip-gram هو الـ dot product <code>u_w . v_c</code>.","The raw scores before the softmax, one per class (or per word). In Skip-gram it is the dot product <code>u_w . v_c</code>.")},
   {t:B("Decision boundary","Decision boundary"),
    d:B("الحد اللي بيفصل بين الـ classes في فضاء الـ input. في الـ softmax classifier بيبقى خطي.","The border that separates classes in input space. For a softmax classifier it is linear.")}
 ]},

{id:"l2-softmax-example",t:B("مثال رقمي: softmax و cross-entropy","Worked example: softmax and cross-entropy"),
 b:cat(B('<p>نحسب بأرقام. classifier بيدّي 3 logits لـ 3 classes (positive / negative / neutral):</p>'+
         '<div class="m">z          = [2.0, 1.0, 0.1]\nexp(z)     = [7.39, 2.72, 1.11]   sum = 11.21\nsoftmax(z) = [0.659, 0.242, 0.099]</div>',
         '<p>Let us compute with numbers. A classifier outputs 3 logits for 3 classes (positive / negative / neutral):</p>'+
         '<div class="m">z          = [2.0, 1.0, 0.1]\nexp(z)     = [7.39, 2.72, 1.11]   sum = 11.21\nsoftmax(z) = [0.659, 0.242, 0.099]</div>'),
       FIG_SOFTMAX,
       B('<p>لو الـ class الصح هو positive: <code>loss = -ln(0.659) = 0.42</code>. لو الصح neutral: <code>loss = -ln(0.099) ≈ 2.3</code>. الموديل ادّى الـ class الصح احتمال حوالي 10% بس، فالعقوبة كبيرة.</p>'+
         '<p>والـ gradient على الـ logits بسيط جدًا: <mark>p - y</mark>، يعني الاحتمالات المتوقعة ناقص one-hot للإجابة الصح:</p>'+
         '<div class="m">[0.659 - 1, 0.242, 0.099] = [-0.341, 0.242, 0.099]</div>'+
         '<p>الـ class الصح بيتشدّ لفوق (الـ gradient بتاعه سالب، فالـ gradient descent بيزوّده) والباقي بيتشدّ لتحت.</p>',
         '<p>If the true class is positive: <code>loss = -ln(0.659) = 0.42</code>. If it is neutral: <code>loss = -ln(0.099) ≈ 2.3</code>. The model gave the correct class only about 10%, so the penalty is large.</p>'+
         '<p>The gradient on the logits is very simple: <mark>p - y</mark>, the predicted probabilities minus the one-hot of the correct answer:</p>'+
         '<div class="m">[0.659 - 1, 0.242, 0.099] = [-0.341, 0.242, 0.099]</div>'+
         '<p>The correct class is pushed up (its gradient entry is negative, so gradient descent increases it) and the others are pushed down.</p>')),
 q:[
   CQ("لو الـ logits [0, 0] لـ class-ين والصح هو الأول، كام الـ loss تقريبًا؟","If the logits are [0, 0] for two classes and the correct one is the first, what is the loss, roughly?",
      [["0.69","0.69"],["0","0"],["1","1"],["0.5","0.5"]],
      0,"الاحتمالان 0.5 و 0.5، و -ln(0.5) = ln 2 ≈ 0.69.","Both probabilities are 0.5, and -ln(0.5) = ln 2 ≈ 0.69."),
   CQ("إيه اللي بيحصل للـ loss لما احتمال الـ class الصح يقرّب من صفر؟","What happens to the loss as the probability of the correct class approaches zero?",
      [["بيكبر جدًا (يقرّب من اللانهاية)","It grows very large (approaches infinity)"],["بيقرّب من صفر","It approaches zero"],["بيبقى 1","It becomes 1"],["بيبقى سالب","It becomes negative"]],
      0,"-ln(p) بيكبر بسرعة لما p تصغر، فالغلطة الواثقة بتتعاقب بشدة.","-ln(p) grows quickly as p shrinks, so a confident mistake is punished heavily.")
 ],
 f:[
   CF("إيه الـ gradient بتاع softmax مع cross-entropy بالنسبة للـ logits؟","What is the gradient of softmax with cross-entropy with respect to the logits?",
      "p - y: الاحتمالات المتوقعة ناقص one-hot للإجابة الصح.","p - y: the predicted probabilities minus the one-hot of the correct answer."),
   CF("إزاي نحسب softmax خطوة خطوة؟","How do we compute softmax step by step?",
      "نعمل exp لكل logit، ونقسم كل واحد على مجموع الـ exp، فنطلع احتمالات مجموعها 1.","Apply exp to each logit and divide each by the sum of the exps, giving probabilities that sum to 1.")
 ]},

{id:"l2-window-ner",t:B("Window classification و NER","Window classification and NER"),
 b:cat(B('<p>في <mark>NER</mark> (Named Entity Recognition) بنحدد الأسماء في النص ونصنّفها: شخص (<code>PER</code>)، مكان (<code>LOC</code>)، منظمة (<code>ORG</code>)، أو ولا حاجة (<code>O</code>). الكلمة لوحدها مش كفاية: <code>Paris</code> ممكن تكون مدينة أو جزء من اسم <code>Paris Hilton</code>، فلازم السياق.</p>'+
         '<p><mark>Window classification</mark>: نصنّف الكلمة اللي في النص بالاعتماد على الكلمات اللي حواليها. بنضم (<mark>concatenate</mark>) vectors كلمات النافذة ورا بعض ونديهم لـ softmax classifier، وبنحرّك النافذة على كل كلمة في الجملة:</p>',
         '<p>In <mark>NER</mark> (Named Entity Recognition) we find names in a text and label them: person (<code>PER</code>), place (<code>LOC</code>), organization (<code>ORG</code>), or nothing (<code>O</code>). A word alone is not enough: <code>Paris</code> can be a city or part of the name <code>Paris Hilton</code>, so we need context.</p>'+
         '<p><mark>Window classification</mark>: label the center word using the words around it. We <mark>concatenate</mark> the vectors of the window words and feed them to a softmax classifier, sliding the window over every word of the sentence:</p>'),
       FIG_WINDOW,
       B('<div class="m">window = 2  =>  5 words  =>  x_window has 5d numbers</div>'+
         '<p>لو d = 300 و 4 classes، المصفوفة <code>W</code> حجمها 4 × 1500 يعني 6000 وزن. ليه ضم مش متوسط؟ لأن المتوسط بيضيّع الترتيب (مين قبل مين)، والضم بيحافظ عليه.</p>',
         '<div class="m">window = 2  =>  5 words  =>  x_window has 5d numbers</div>'+
         '<p>With d = 300 and 4 classes, the matrix <code>W</code> is 4 × 1500, which is 6000 weights. Why concatenate instead of averaging? Averaging loses the order (who comes before whom), and concatenation keeps it.</p>')),
 q:[
   CQ("ليه بنستخدم window بدل vector الكلمة لوحدها في NER؟","Why use a window instead of the word vector alone in NER?",
      [["لأن معنى الكلمة بيتحدد من سياقها (Paris مدينة ولا اسم شخص)","Because the meaning of a word depends on its context (Paris the city or a person name)"],["عشان نقلل حجم الـ vocabulary","To reduce the vocabulary size"],["عشان نتخلص من الـ softmax","To get rid of the softmax"],["عشان نحذف الكلمات الشائعة","To remove frequent words"]],
      0,"نفس الكلمة ممكن تتصنّف بشكل مختلف حسب اللي حواليها.","The same word can get a different label depending on its neighbors."),
   CQ("window = 1 و d = 100، كام رقم في x_window؟","With window = 1 and d = 100, how many numbers are in x_window?",
      [["300","300"],["100","100"],["200","200"],["400","400"]],
      0,"النافذة 1 معناها 3 كلمات (واحدة قبل، المركزية، واحدة بعد) × 100 = 300.","Window 1 means 3 words (one before, the center, one after) × 100 = 300.")
 ],
 f:[
   CF("إيه هو الـ window classification؟","What is window classification?",
      "تصنيف كلمة بالاعتماد على vectors الكلمات اللي حواليها، مضمومة ورا بعض ومتداية لـ classifier.","Classifying a word using the vectors of the words around it, concatenated and fed to a classifier."),
   CF("ليه بنضم الـ vectors بدل ما نعمل متوسط؟","Why concatenate the vectors instead of averaging them?",
      "المتوسط بيضيّع الترتيب والموضع، والضم بيحافظ عليهم.","Averaging loses order and position, while concatenation keeps them.")
 ],
 terms:[
   {t:B("Named entity recognition (NER)","Named entity recognition (NER)"),
 d:B("Named Entity Recognition: تحديد الأسماء في النص وتصنيفها (شخص، مكان، منظمة).","Named Entity Recognition: finding names in text and labeling them (person, place, organization).")},
   {t:B("Window classification","Window classification"),
    d:B("تصنيف كلمة من vectors كلمات النافذة اللي حواليها مضمومة ورا بعض.","Classifying a word from the concatenated vectors of the words in a window around it.")}
 ]},

{id:"l2-recap",t:B("Recap: المحاضرة التانية","Recap: lecture 2"),
 b:B('<p><mark>أهم 5 نقاط:</mark></p>'+
     '<p>1. الـ co-occurrence matrix بتعدّ الكلمات اللي بتظهر مع بعض، وهي ضخمة ومعظمها أصفار، والـ SVD بيضغطها.</p>'+
     '<p>2. GloVe: الـ dot product بين vectorين يقرّب log الـ co-occurrence، والنسبة بين الاحتمالات هي اللي بتحمل المعنى.</p>'+
     '<p>3. بنقيّم الـ vectors intrinsic (analogies) و extrinsic (مهمة حقيقية)، وvector واحد لكل كلمة بيخلط معانيها.</p>'+
     '<p>4. الـ subwords (character n-grams و BPE) بتدّي vector للكلمات اللي مش في الـ vocabulary.</p>'+
     '<p>5. softmax مع cross-entropy بيصنّف كلمة أو window (NER)، لكن حد الفصل خطي.</p>'+
     '<p><mark>أهم المعادلات:</mark></p>'+
     '<div class="m">J = sum f(X_ij) (w_i . w~_j + b_i + b~_j - log X_ij)^2\nP(y|x) = exp(W_y . x) / sum_c exp(W_c . x)\nloss = -log P(y_true | x)\ngradient on logits = p - y</div>'+
     '<p><mark>قبل المحاضرة الجاية:</mark> اتأكد إنك تقدر تحسب softmax و cross-entropy بإيدك وتفهم ليه الـ gradient على الـ logits هو p - y. وافتكر إن المشتقة بتتحسب بالـ chain rule، لأنك هتحتاجها في backpropagation.</p>',
     '<p><mark>Five key points:</mark></p>'+
     '<p>1. The co-occurrence matrix counts words that appear together; it is huge and mostly zeros, and SVD compresses it.</p>'+
     '<p>2. GloVe: the dot product of two vectors approximates the log co-occurrence, and the ratio of probabilities is what carries meaning.</p>'+
     '<p>3. We evaluate vectors intrinsically (analogies) and extrinsically (a real task), and one vector per word blends its senses.</p>'+
     '<p>4. Subwords (character n-grams and BPE) give vectors to words outside the vocabulary.</p>'+
     '<p>5. Softmax with cross-entropy classifies a word or a window (NER), but its boundary is linear.</p>'+
     '<p><mark>Key equations:</mark></p>'+
     '<div class="m">J = sum f(X_ij) (w_i . w~_j + b_i + b~_j - log X_ij)^2\nP(y|x) = exp(W_y . x) / sum_c exp(W_c . x)\nloss = -log P(y_true | x)\ngradient on logits = p - y</div>'+
     '<p><mark>Before the next lecture:</mark> make sure you can compute softmax and cross-entropy by hand and understand why the gradient on the logits is p - y. Also remember that derivatives are computed with the chain rule, because you will need it for backpropagation.</p>'),
 q:[
   CQ("أنهي تقنية بتدّي vector لكلمة جديدة ما اتشافتش في التدريب؟","Which technique gives a vector to a new word never seen in training?",
      [["character n-grams (FastText)","Character n-grams (FastText)"],["SVD على الـ co-occurrence matrix","SVD on the co-occurrence matrix"],["الدالة f(X_ij) في GloVe","The function f(X_ij) in GloVe"],["الـ cross-entropy","Cross-entropy"]],
      0,"الكلمة الجديدة بتتبني من n-grams بتاعتها اللي ليها vectors.","A new word is built from its n-grams, which do have vectors."),
   CQ("الـ gradient بتاع softmax مع cross-entropy بالنسبة للـ logits يساوي...","The gradient of softmax with cross-entropy with respect to the logits equals...",
      [["p - y","p - y"],["y - p","y - p"],["p . y","p . y"],["p + y","p + y"]],
      0,"الاحتمالات المتوقعة ناقص one-hot للإجابة الصح.","The predicted probabilities minus the one-hot of the correct answer.")
 ],
 f:[
   CF("إيه أهم 3 معادلات في المحاضرة دي؟","What are the 3 key equations of this lecture?",
      "GloVe loss (مجموع مربعات موزون)، و softmax: P(y|x) = exp(W_y . x) / sum_c exp(W_c . x)، و cross-entropy: -log P(y_true | x).","The GloVe loss (weighted sum of squares), softmax: P(y|x) = exp(W_y . x) / sum_c exp(W_c . x), and cross-entropy: -log P(y_true | x)."),
   CF("إزاي الـ word vectors بتتربط بالـ classifier؟","How do word vectors connect to the classifier?",
      "الـ vector (أو window من vectors مضمومة) هو الـ input للـ softmax classifier.","The vector (or a window of concatenated vectors) is the input of the softmax classifier.")
 ]}
]}
);

})();
