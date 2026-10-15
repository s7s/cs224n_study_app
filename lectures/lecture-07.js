/* Lecture 7: Attention
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L7 fig: attention as weighted average of encoder states */
function attFig(){
  var W=['she','eats','an','apple'],wt=[0.05,0.85,0.05,0.05],cx=[50,130,210,290],s='',i;
  for(i=0;i<4;i++){
    s+='<line x1="'+cx[i]+'" y1="148" x2="170" y2="108" style="stroke:var(--ok);stroke-width:'+(1+wt[i]*7).toFixed(1)+';stroke-opacity:'+(0.25+wt[i]*0.75).toFixed(2)+'"/>';
    s+=RECT(cx[i]-30,150,60,32,'var(--sf)','var(--ac)',8,1.8)+T(cx[i],171,W[i],'','middle')+T(cx[i],202,'α = '+wt[i],'tm','middle','font-size:11px');
  }
  s+='<circle cx="170" cy="96" r="13" style="fill:var(--sf);stroke:var(--ok);stroke-width:2"/>'+T(170,101,'Σ','tb','middle')+
     T(190,93,'context a_t','tm','start','font-size:11px')+
     AL(170,82,170,58,'ok','mG')+RECT(120,20,100,36,'var(--sf)','var(--ok)',9,1.8)+T(170,43,'decoder s_t','tb','middle')+
     T(232,42,'predicts: mange','tm','start','font-size:11px');
  return s;
}

var FIG_ATT=fig(212,attFig(),
  B('عند توليد كلمة mange، الـ decoder بيدي كل كلمة مصدر وزن. الخط السميك هو الوزن الكبير (eats)، والـ context هو متوسط مرجّح لكل حالات الـ encoder.',
    'When generating mange, the decoder gives every source word a weight. The thick line is the large weight (eats), and the context is a weighted average of all encoder states.'));

/* L7 fig: alignment heatmap */
function heatFig(){
  var S=['she','eats','an','apple'],Tg=['elle','mange','une','pomme'],
      Wm=[[0.85,0.05,0.05,0.05],[0.05,0.85,0.05,0.05],[0.05,0.10,0.75,0.10],[0.03,0.03,0.14,0.80]],
      s='',i,j,c=46,x0=100,y0=44;
  s+=T(x0+2*c,16,'source →','tm','middle','font-size:11px')+T(x0-8,y0-10,'target ↓','tm','end','font-size:11px');
  for(j=0;j<4;j++)s+=T(x0+j*c+c/2,y0-10,S[j],'tb','middle','font-size:11.5px');
  for(i=0;i<4;i++){
    s+=T(x0-8,y0+i*c+c/2+4,Tg[i],'tb','end','font-size:11.5px');
    for(j=0;j<4;j++){
      var w=Wm[i][j],x=x0+j*c,y=y0+i*c;
      s+=RECT(x,y,c,c,'var(--sf)','var(--ln)',0,1)+'<rect x="'+x+'" y="'+y+'" width="'+c+'" height="'+c+'" style="fill:var(--ac);fill-opacity:'+w+'"/>'+
         T(x+c/2,y+c/2+4,w.toFixed(2),w>0.5?'tb':'tm','middle',w>0.8?'font-size:11px;fill:var(--bg)':(w>0.5?'font-size:11px;fill:var(--ink)':'font-size:11px'));
    }
  }
  return s;
}

var FIG_HEAT=fig(240,heatFig(),
  B('كل صف هو كلمة مترجمة وكل عمود كلمة مصدر. اللون الأغمق وزن attention أكبر. الجدول بيطلّع alignment بين اللغتين لوحده. الأرقام توضيحية.',
    'Each row is a translated word and each column a source word. Darker means a larger attention weight. The table reveals the alignment between languages on its own. Numbers are illustrative.'));

/* L7 fig: path length RNN vs self-attention */
function pathFig(){
  var X=[40,110,180,250,320],s=T(8,18,'RNN: 4 steps from word 1 to word 5','tb'),i;
  for(i=0;i<5;i++){
    s+='<circle cx="'+X[i]+'" cy="52" r="14" style="fill:var(--sf);stroke:var(--ac);stroke-width:1.8"/>'+T(X[i],56,'w'+(i+1),'tb','middle','font-size:11.5px');
    if(i<4)s+=AL(X[i]+14,52,X[i+1]-15,52,'ac','mA');
  }
  s+=T(8,112,'Self-attention: direct link in 1 step','tb');
  for(i=0;i<5;i++)s+='<circle cx="'+X[i]+'" cy="190" r="14" style="fill:var(--sf);stroke:var(--ok);stroke-width:1.8"/>'+T(X[i],194,'w'+(i+1),'tb','middle','font-size:11.5px');
  [[4,3,24],[4,2,44],[4,1,64],[4,0,84]].forEach(function(a){s+=ARC(X[a[0]],X[a[1]],a[2],'','ok','mG',175,1);});
  return s;
}

var FIG_PATH=fig(214,pathFig(),
  B('في الـ RNN المعلومة بتعدّي كلمة كلمة، وفي الـ self-attention أي كلمة بتوصل لأي كلمة مباشرةً.',
    'In an RNN information passes word by word; in self-attention any word reaches any other directly.'));

/* L7 fig: one attention step in numbers (scores -> softmax weights) */
function numFig(){
  var sc=[2,1,0],wt=[0.67,0.24,0.09],xs=[30,76,122],xw=[216,262,308],base=130,s='',i,h;
  s+=T(76,22,'scores e','tb','middle')+T(262,22,'weights α','tb','middle');
  s+='<line x1="16" y1="'+base+'" x2="150" y2="'+base+'" style="stroke:var(--ln);stroke-width:1.5"/>'+
     '<line x1="202" y1="'+base+'" x2="336" y2="'+base+'" style="stroke:var(--ln);stroke-width:1.5"/>';
  for(i=0;i<3;i++){
    h=Math.max(sc[i]*34,2);
    s+=RECT(xs[i]-13,base-h,26,h,'var(--ac)','none',4)+T(xs[i],base-h-6,String(sc[i]),'tb','middle','font-size:11.5px')+T(xs[i],base+16,'h'+(i+1),'tm','middle','font-size:11px');
    h=Math.max(wt[i]*100,2);
    s+=RECT(xw[i]-13,base-h,26,h,'var(--ok)','none',4)+T(xw[i],base-h-6,wt[i].toFixed(2),'tb','middle','font-size:11.5px')+T(xw[i],base+16,'h'+(i+1),'tm','middle','font-size:11px');
  }
  s+=AR(158,78,196,78,'ac','mA')+T(177,68,'softmax','tm','middle','font-size:11px');
  return s;
}

var FIG_NUM=fig(156,numFig(),
  B('الشمال: الـ scores. اليمين: الأوزان بعد الـ softmax، كلها موجبة ومجموعها 1.',
    'Left: the scores. Right: the weights after the softmax, all positive and summing to 1.'));

/* L7 fig: alignment with word reordering (the black cat -> le chat noir) */
function reordFig(){
  var S=['the','black','cat','sleeps'],Tg=['le','chat','noir','dort'],xs=[48,128,208,298],link=[0,2,1,3],s='',i,cross;
  s+=T(8,14,'source (EN)','tm','start','font-size:11px')+T(8,180,'target (FR)','tm','start','font-size:11px');
  for(i=0;i<4;i++){
    s+=RECT(xs[i]-34,24,68,28,'var(--sf)','var(--ln)',8,1.8)+T(xs[i],43,S[i],'tb','middle');
    s+=RECT(xs[i]-34,132,68,28,'var(--sf)','var(--ac)',8,1.8)+T(xs[i],151,Tg[i],'tb','middle');
  }
  for(i=0;i<4;i++){
    cross=(link[i]!==i);
    s+=AR(xs[i],132,xs[link[i]],52,cross?'ac':'mu',cross?'mA':'mM');
  }
  return s;
}

var FIG_REORD=fig(190,reordFig(),
  B('كل سهم بيروح من كلمة مترجمة لكلمة المصدر اللي بتبص عليها. السهمين المتقاطعين هما اللي ترتيبهم اتعكس (cat و black).',
    'Each arrow goes from a translated word to the source word it attends to. The two crossing arrows are where the order is swapped (cat and black).'));

/* L7 fig: the attention pipeline, with the score function as the swappable part */
function pipeFig(){
  var s='';
  s+=RECT(4,26,28,28,'var(--sf)','var(--ac)',8,1.8)+T(18,45,'q','tb','middle')+
     RECT(4,82,28,28,'var(--sf)','var(--ac)',8,1.8)+T(18,101,'k_i','tb','middle')+
     AR(32,44,64,60,'ac','mA')+AR(32,92,64,76,'ac','mA')+
     RECT(64,44,64,48,'var(--ac)','none',9)+T(96,64,'score','tb','middle','fill:var(--bg)')+T(96,81,'q, k_i','tm','middle','fill:var(--bg);font-size:11px')+
     AR(128,68,164,68,'ac','mA')+T(146,58,'e_i','tm','middle','font-size:11px')+
     RECT(164,44,60,48,'var(--sf)','var(--ln)',9,1.8)+T(194,73,'softmax','tb','middle','font-size:11.5px')+
     AR(224,68,264,68,'ac','mA')+T(244,58,'α_i','tm','middle','font-size:11px')+
     RECT(264,44,86,48,'var(--sf)','var(--ok)',9,1.8)+T(307,73,'Σ α_i v_i','tb','middle','font-size:11.5px')+
     T(307,36,'output','tm','middle','font-size:11px')+
     RECT(291,132,32,28,'var(--sf)','var(--ac)',8,1.8)+T(307,151,'v_i','tb','middle')+
     AR(307,132,307,92,'ac','mA')+
     T(8,150,'score: dot, multiplicative or additive','tm','start','font-size:11px');
  return s;
}

var FIG_QKV=fig(170,pipeFig(),
  B('المسار الكامل: الـ query بيتقارن بكل key في دالة الـ score (الجزء اللي نقدر نبدّله)، بعدين softmax، وبعدين متوسط مرجّح للـ values.',
    'The full pipeline: the query is compared with every key by a score function (the part we can swap), then a softmax, then a weighted average of the values.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:7,t:B("Attention","Attention"),cards:[

{id:"l7-idea",t:B("فكرة الـ attention","The idea of attention"),
 b:cat(B('<p>بدل ما الـ decoder يعتمد على vector واحد ملخّص، <mark>attention</mark> بيسيبه يرجع ويبص على <mark>كل</mark> حالات الـ encoder في كل خطوة، ويركّز على الأنسب. زي ما انت بتترجم جملة وبترجع تبص على الكلمة المصدر اللي بتترجمها دلوقتي.</p>',
         '<p>Instead of relying on one summary vector, <mark>attention</mark> lets the decoder look back at <mark>all</mark> the encoder states at every step and focus on the most relevant. Like when you translate a sentence and glance back at the source word you are translating right now.</p>'),
       FIG_ATT,
       B('<p>الفكرة: نحسب <mark>وزن</mark> لكل كلمة مصدر (مجموع الأوزان 1)، وناخد <mark>متوسط مرجّح</mark> لحالات الـ encoder. الوزن الكبير معناه "المصدر ده مهم للخطوة دي". في الرسم، وانت بتولّد mange، الوزن الأكبر على eats.</p>',
         '<p>The idea: compute a <mark>weight</mark> for each source word (the weights sum to 1) and take a <mark>weighted average</mark> of the encoder states. A large weight means "this source word matters for this step". In the picture, when generating mange, the largest weight is on eats.</p>')),
 q:[
   CQ("الـ attention بيدي الـ decoder إيه؟","What does attention give the decoder?",
      [["وصول مباشر لكل حالات الـ encoder مع تركيز على الأنسب","Direct access to all encoder states, focusing on the most relevant"],["vector أصغر","A smaller vector"],["بوابات إضافية","Extra gates"],["كلمات جديدة","New words"]],
      0,"بدل الـ vector الواحد، الـ decoder بيوزّن كل الحالات حسب أهميتها.","Instead of one vector, the decoder weighs every state by its relevance."),
   CQ("أوزان الـ attention على 3 كلمات مصدر طلعت [0.5, 0.3, 0.3]. إيه المشكلة؟","The attention weights over three source words came out as [0.5, 0.3, 0.3]. What is wrong?",
   [["مجموعها 1.1 مش 1، فمش طالعة من softmax","They sum to 1.1, not 1, so they did not come from a softmax"],["مفيش مشكلة","Nothing is wrong"],["لازم تكون كلها متساوية","They must all be equal"],["لازم أكبر وزن يبقى 1","The largest weight must be 1"]],
   0,"الأوزان بتطلع من softmax فمجموعها لازم يبقى 1، وهنا 0.5 + 0.3 + 0.3 = 1.1.","Weights come from a softmax, so they must sum to 1, and here 0.5 + 0.3 + 0.3 = 1.1.")
 ],
 f:[
   CF("إيه فكرة الـ attention في الترجمة؟","What is the idea of attention in translation?",
      "الـ decoder بيحسب وزن لكل حالة encoder ويأخد متوسط مرجّح منها في كل خطوة بدل الاعتماد على vector واحد.","At each step the decoder computes a weight for every encoder state and takes a weighted average instead of relying on a single vector."),
   CF("إيه المشكلة في الاعتماد على vector واحد في seq2seq؟","What is the problem with relying on a single vector in seq2seq?",
   "إنه bottleneck: معنى الجملة المصدر كله لازم يتضغط في vector واحد، والـ attention بيحل ده.","It is a bottleneck: the whole meaning of the source sentence must squeeze into one vector, and attention solves that.")
 ],
 terms:[
   {t:B("Attention","Attention"),
    d:B("الـ decoder بيوزّن كل حالات الـ encoder ويأخد متوسط مرجّح منها في كل خطوة بدل الاعتماد على vector واحد.","At each step the decoder weighs every encoder state and takes a weighted average instead of relying on a single vector.")}
 ]},

{id:"l7-steps",t:B("حساب الـ attention خطوة خطوة","Computing attention step by step"),
 b:cat(B('<p>عندنا encoder states <code>h_1..h_N</code>، وعند الخطوة t الـ decoder state هو <code>s_t</code>:</p>'+
     '<p>1. <mark>scores</mark>: نقيس تشابه s_t مع كل h_i بـ dot product.<br>2. <mark>weights</mark>: نطبّق softmax على الـ scores.<br>3. <mark>context</mark>: متوسط مرجّح لـ h_i.<br>4. نلصق الـ context مع s_t ونتنبأ بالكلمة.</p>'+
     '<div class="m">e_i = s_t . h_i\nalpha = softmax(e)\na_t = sum_i alpha_i * h_i\ny_t = predict([a_t ; s_t])</div>'+
     '<p>مثال بأرقام: لو الـ scores هي <code>[2, 1, 0]</code>:</p>'+
     '<div class="m">softmax([2, 1, 0]) = [0.67, 0.24, 0.09]</div>'+
     '<p>يعني 67% من الـ context جاي من الحالة الأولى، والباقي موزع على الاتنين التانيين.</p>',
     '<p>We have encoder states <code>h_1..h_N</code>, and at step t the decoder state is <code>s_t</code>:</p>'+
     '<p>1. <mark>scores</mark>: measure the similarity of s_t with each h_i using a dot product.<br>2. <mark>weights</mark>: apply a softmax to the scores.<br>3. <mark>context</mark>: a weighted average of the h_i.<br>4. Concatenate the context with s_t and predict the word.</p>'+
     '<div class="m">e_i = s_t . h_i\nalpha = softmax(e)\na_t = sum_i alpha_i * h_i\ny_t = predict([a_t ; s_t])</div>'+
     '<p>A numeric example: if the scores are <code>[2, 1, 0]</code>:</p>'+
     '<div class="m">softmax([2, 1, 0]) = [0.67, 0.24, 0.09]</div>'+
     '<p>So 67% of the context comes from the first state, and the rest is split between the other two.</p>'),
       B('<p><mark>غلطة شائعة:</mark> الـ softmax بيتطبّق على <mark>مواضع المصدر</mark> (توزيع واحد لكل خطوة في الـ decoder)، مش على الـ vocabulary. توزيع الـ vocabulary بيتحسب في الآخر من <code>[a_t ; s_t]</code>.</p>',
  '<p><mark>Common mistake:</mark> this softmax runs over the <mark>source positions</mark> (one distribution per decoder step), not over the vocabulary. The vocabulary distribution is computed at the end from <code>[a_t ; s_t]</code>.</p>')),
 q:[
   CQ("لو الـ scores كلها [0, 0, 0]، الأوزان بتبقى؟","If the scores are all [0, 0, 0], the weights are...",
      [["متساوية: 1/3 لكل واحدة","Equal: 1/3 each"],["[1, 0, 0]","[1, 0, 0]"],["كلها صفر","All zero"],["عشوائية","Random"]],
      0,"softmax على قيم متساوية بيدي احتمالات متساوية.","A softmax over equal values gives equal probabilities."),
   CQ("لو ضفنا 10 لكل الـ scores، أوزان الـ softmax بتبقى...","If we add 10 to every score, the softmax weights...",
   [["زي ما هي من غير تغيير","Stay exactly the same"],["بتكبر 10 أضعاف","Become 10 times bigger"],["بتبقى متساوية","Become equal"],["بتبقى [1, 0, 0]","Become [1, 0, 0]"]],
   0,"الـ softmax بيعتمد على الفرق بين الـ scores بس، فإضافة نفس الرقم للكل بتتلغي.","The softmax depends only on the differences between the scores, so adding the same number to all of them cancels out.")
 ],
 f:[
   CF("إيه خطوات حساب الـ attention؟","What are the steps of computing attention?",
      "scores بـ dot product، بعدين softmax للأوزان، بعدين context كمتوسط مرجّح للـ encoder states، ونلصقه مع s_t للتنبؤ.","Scores by dot product, then a softmax for the weights, then the context as a weighted average of encoder states, concatenated with s_t to predict."),
   CF("إيه معادلات الـ attention بالـ dot product؟","What are the attention equations with a dot product?",
   "e_i = s_t . h_i، بعدين alpha = softmax(e)، وبعدين a_t = sum_i alpha_i * h_i.","e_i = s_t . h_i, then alpha = softmax(e), then a_t = sum_i alpha_i * h_i.")
 ],
 terms:[
   {t:B("Attention scores","Attention scores"),
    d:B("قيم بتقيس تشابه الـ decoder state مع كل encoder state (مثلًا بـ dot product) قبل الـ softmax.","Values measuring how similar the decoder state is to each encoder state (for example by a dot product), before the softmax.")},
   {t:B("Attention weights","Attention weights"),
    d:B("الـ scores بعد الـ softmax: أرقام موجبة مجموعها 1.","The scores after the softmax: positive numbers that sum to 1.")},
   {t:B("Context vector","Context vector"),
    d:B("المتوسط المرجّح لحالات الـ encoder بأوزان الـ attention، وبيتلصق مع <code>s_t</code> للتنبؤ.","The weighted average of the encoder states using the attention weights; it is concatenated with <code>s_t</code> to predict.")}
 ]},

{id:"l7-numeric",t:B("مثال attention بأرقام","An attention example with numbers"),
 b:cat(B('<p>خلّينا نحسب خطوة attention كاملة بإيدينا. عندنا 3 encoder states ببعدين: <code>h_1 = [1, 0]</code> و <code>h_2 = [0, 1]</code> و <code>h_3 = [1, -2]</code>، والـ decoder state هو <code>s_t = [2, 1]</code>. الأول الـ scores بالـ dot product (هتطلع نفس <code>[2, 1, 0]</code> بتاعة الكارت اللي فات):</p>'+
         '<div class="m">e_1 = 2*1 + 1*0 = 2\ne_2 = 2*0 + 1*1 = 1\ne_3 = 2*1 + 1*(-2) = 0</div>',
         '<p>Let us compute one full attention step by hand. We have three 2-D encoder states: <code>h_1 = [1, 0]</code>, <code>h_2 = [0, 1]</code> and <code>h_3 = [1, -2]</code>, and the decoder state is <code>s_t = [2, 1]</code>. First, the scores by dot product (they come out as the same <code>[2, 1, 0]</code> as in the previous card):</p>'+
         '<div class="m">e_1 = 2*1 + 1*0 = 2\ne_2 = 2*0 + 1*1 = 1\ne_3 = 2*1 + 1*(-2) = 0</div>'),
       FIG_NUM,
       B('<p>بعدين الـ softmax بيحوّل الـ scores لأوزان، والـ context هو المتوسط المرجّح:</p>'+
         '<div class="m">alpha = softmax([2, 1, 0]) = [0.67, 0.24, 0.09]\na_t = 0.67*[1, 0] + 0.24*[0, 1] + 0.09*[1, -2]\na_t = [0.76, 0.06]</div>'+
         '<p>الـ context قريب من <code>h_1</code> لأنها خدت أكبر وزن. وحجمه (ببعدين) زي أي encoder state، مهما كانت الجملة طويلة.</p>'+
         '<p><mark>غلطة شائعة:</mark> مجموع الأوزان لازم يبقى 1 (0.67 + 0.24 + 0.09 = 1). لو مطلعش 1، يبقى الـ softmax اتنسى.</p>',
         '<p>Then the softmax turns the scores into weights, and the context is the weighted average:</p>'+
         '<div class="m">alpha = softmax([2, 1, 0]) = [0.67, 0.24, 0.09]\na_t = 0.67*[1, 0] + 0.24*[0, 1] + 0.09*[1, -2]\na_t = [0.76, 0.06]</div>'+
         '<p>The context lands close to <code>h_1</code> because it received the largest weight. Its size (two numbers) is the same as any encoder state, however long the sentence is.</p>'+
         '<p><mark>Common mistake:</mark> the weights must sum to 1 (0.67 + 0.24 + 0.09 = 1). If they do not, the softmax step was forgotten.</p>')),
 q:[
   CQ("ليه الـ context vector بنفس حجم الـ encoder state الواحدة؟","Why does the context vector have the same size as a single encoder state?",
      [["لأنه متوسط مرجّح لحالات الـ encoder","Because it is a weighted average of encoder states"],["لأن الـ softmax بيصغّر الـ vector","Because the softmax shrinks the vector"],["لأنه بياخد أول حالة بس","Because it takes only the first state"],["لأن الـ decoder بيضيف أصفار","Because the decoder pads it with zeros"]],
      0,"المتوسط المرجّح لـ vectors بنفس البعد بيطلع vector بنفس البعد.","A weighted average of vectors of the same size is a vector of that same size."),
   CQ("الأوزان [0.5, 0.5] على h_1 = [2, 0] و h_2 = [0, 4]. الـ context يساوي؟","The weights are [0.5, 0.5] over h_1 = [2, 0] and h_2 = [0, 4]. What is the context?",
      [["[1, 2]","[1, 2]"],["[2, 4]","[2, 4]"],["[0.5, 0.5]","[0.5, 0.5]"],["[1, 4]","[1, 4]"]],
      0,"0.5*[2, 0] + 0.5*[0, 4] = [1, 0] + [0, 2] = [1, 2].","0.5*[2, 0] + 0.5*[0, 4] = [1, 0] + [0, 2] = [1, 2].")
 ],
 f:[
   CF("إزاي بنحسب الـ context من الـ scores؟","How do we compute the context from the scores?",
      "softmax على الـ scores بيدي أوزان مجموعها 1، وبنضرب كل وزن في الـ encoder state بتاعه ونجمع.","A softmax over the scores gives weights that sum to 1; multiply each weight by its encoder state and add them up."),
   CF("لو الـ scores [2, 1, 0]، إيه الأوزان؟","If the scores are [2, 1, 0], what are the weights?",
      "تقريبًا [0.67, 0.24, 0.09].","Approximately [0.67, 0.24, 0.09].")
 ]},

{id:"l7-alignment",t:B("الأوزان = alignment","Weights = alignment"),
 b:cat(cat(B('<p>لو رسمنا الأوزان في جدول (صف لكل كلمة مترجمة، وعمود لكل كلمة مصدر) بنشوف <mark>alignment</mark> بين اللغتين، من غير ما حد يعلّم الموديل ده:</p>',
         '<p>If we plot the weights in a table (a row for each translated word, a column for each source word) we see the <mark>alignment</mark> between the languages, without anyone teaching the model this:</p>'),
       FIG_HEAT,
       B('<p>الفوائد: بتحسّن الترجمة بشكل كبير خصوصًا للجمل الطويلة، وبتحل مشكلة الـ bottleneck، وبتدي <mark>طريق مختصر</mark> للـ gradient (بتخفف vanishing gradient)، وبتدي <mark>تفسير</mark> جزئي لقرارات الموديل.</p>',
         '<p>Benefits: it greatly improves translation, especially for long sentences, solves the bottleneck problem, gives the gradient a <mark>shortcut</mark> (easing vanishing gradients), and offers partial <mark>interpretability</mark> of the model\'s decisions.</p>')),
       B('<p>إزاي نقرا الجدول: كل صف مجموعه 1 (softmax واحد لكل كلمة بتتولّد). مثلًا صف <code>mange</code> هو <code>[0.05, 0.85, 0.05, 0.05]</code>، يعني 85% من الـ context وانت بتولّد mange جاي من <code>eats</code>.</p>'+
    '<p><mark>غلطة شائعة:</mark> نفتكر إن العمود كمان لازم مجموعه 1. لأ، الـ softmax بيتطبّق على الصفوف بس.</p>',
  '<p>How to read the table: each row sums to 1 (one softmax per generated word). For example, the row of <code>mange</code> is <code>[0.05, 0.85, 0.05, 0.05]</code>, so 85% of the context used to generate mange comes from <code>eats</code>.</p>'+
    '<p><mark>Common mistake:</mark> assuming each column must also sum to 1. It does not: the softmax runs over the rows only.</p>')),
 q:[
   CQ("إيه اللي بيعبّر عنه الـ heatmap؟","What does the heatmap express?",
      [["أوزان الـ attention بين الكلمة المترجمة وكلمات المصدر","Attention weights between the translated word and the source words"],["قيمة الـ loss","The loss value"],["عدد الكلمات","The number of words"],["الـ embeddings","The embeddings"]],
      0,"كل خلية هي وزن الـ attention لكلمة مصدر عند توليد كلمة معينة.","Each cell is the attention weight on a source word when generating a particular word."),
   CQ("في الـ heatmap، صف pomme هو [0.03, 0.03, 0.14, 0.80] على she و eats و an و apple. أنهي كلمة مصدر متحاذية معاه؟","In the heatmap, the row of pomme is [0.03, 0.03, 0.14, 0.80] over she, eats, an and apple. Which source word is it aligned with?",
   [["apple","apple"],["an","an"],["eats","eats"],["she","she"]],
   0,"أكبر وزن (0.80) على apple.","The largest weight (0.80) is on apple.")
 ],
 f:[
   CF("إيه فوائد الـ attention؟","What are the benefits of attention?",
      "يحسّن الترجمة، يحل الـ bottleneck، يدي طريق مختصر للـ gradient، ويدي تفسير جزئي (alignment).","It improves translation, solves the bottleneck, gives the gradient a shortcut, and offers partial interpretability (alignment)."),
   CF("ليه كل صف في الـ heatmap مجموعه 1؟","Why does each row of the heatmap sum to 1?",
   "لأن كل صف هو ناتج softmax واحد، لخطوة توليد كلمة واحدة.","Because each row is the output of one softmax, for one word-generation step.")
 ],
 terms:[
   {t:B("Alignment","Alignment"),
    d:B("ربط كل كلمة مترجمة بكلمات المصدر اللي بتعتمد عليها، وبيظهر في أوزان الـ attention.","Linking each translated word to the source words it depends on; it shows up in the attention weights.")}
 ]},

{id:"l7-reorder",t:B("الـ attention واختلاف ترتيب الكلمات","Attention and word reordering"),
 b:cat(B('<p>في الـ heatmap اللي فات، الخلايا الغامقة طلعت على القطر لأن الجملتين بنفس الترتيب. بس اللغات كتير بتغيّر الترتيب: الفرنسي بيحط الصفة بعد الاسم، فـ <code>the black cat</code> بتبقى <code>le chat noir</code>.</p>',
         '<p>In the previous heatmap the dark cells fell on the diagonal because both sentences share the same word order. But languages often reorder: French puts the adjective after the noun, so <code>the black cat</code> becomes <code>le chat noir</code>.</p>'),
       FIG_REORD,
       B('<p>لما الـ decoder بيولّد <code>chat</code> بيبص على <code>cat</code>، وفي الخطوة اللي بعدها بيرجع يبص على <code>black</code> اللي كانت قبلها. محدش كتب له قاعدة بالترتيب ده: الـ attention بيقدر يبص على أي مكان في المصدر، فبيتعلمه من الداتا.</p>'+
         '<p>وكمان الـ alignment مش واحد لواحد: كلمة مصدر ممكن تغذّي أكتر من كلمة هدف، وممكن كلمة ما ياخدش عليها حد تقريبًا أي attention.</p>'+
         '<p><mark>غلطة شائعة:</mark> نفتكر إن الـ attention دايمًا قطري. ده بيحصل بس لما الترتيب متشابه.</p>',
         '<p>When the decoder generates <code>chat</code> it looks at <code>cat</code>, and at the next step it jumps back to <code>black</code>, which came before it. No one wrote a rule for this order: attention can look anywhere in the source, so the model learns it from the data.</p>'+
         '<p>The alignment is also not one-to-one: one source word can feed several target words, and some source words may get almost no attention.</p>'+
         '<p><mark>Common mistake:</mark> assuming attention is always diagonal. It is only so when the word order is similar.</p>')),
 q:[
   CQ("ليه الـ attention مش دايمًا بيطلع قطري؟","Why is attention not always diagonal?",
      [["لأن ترتيب الكلمات بيختلف بين اللغات والـ attention بيقدر يبص على أي مكان","Because word order differs between languages and attention can look anywhere"],["لأن الـ softmax عشوائي","Because the softmax is random"],["لأن الـ encoder بيحذف كلمات","Because the encoder deletes words"],["لأن الـ decoder مبيشوفش المصدر","Because the decoder cannot see the source"]],
      0,"الـ attention مش مقيّد بمكان معين، فبيتبع المعنى مش الترتيب.","Attention is not tied to a fixed position, so it follows meaning rather than order."),
   CQ("وانت بتولّد chat في le chat noir، أنهي كلمة مصدر المفروض ياخد أكبر وزن؟","When generating chat in le chat noir, which source word should get the largest weight?",
      [["cat","cat"],["black","black"],["the","the"],["sleeps","sleeps"]],
      0,"chat هي ترجمة cat، حتى لو black واقفة قبلها في المصدر.","chat is the translation of cat, even though black stands before it in the source.")
 ],
 f:[
   CF("ليه الـ attention مفيد لما ترتيب الكلمات بيختلف بين اللغتين؟","Why is attention useful when word order differs between two languages?",
      "لأن الـ decoder بيقدر يبص على أي كلمة في المصدر في أي خطوة، فبيتعلم القفزات (زي black بعد chat) من الداتا.","Because the decoder can look at any source word at any step, so it learns the jumps (like black after chat) from the data."),
   CF("هل الـ alignment بالـ attention لازم يبقى واحد لواحد؟","Does attention alignment have to be one-to-one?",
      "لأ. كلمة مصدر ممكن تغذّي أكتر من كلمة هدف، والأوزان موزعة بشكل ناعم (soft).","No. One source word can feed several target words, and the weights are spread softly.")
 ]},

{id:"l7-qkv",t:B("Query و key و value","Query, key and value"),
 b:B('<p>الـ attention فكرة أعم من الترجمة. عندنا <mark>query</mark> واحد وقايمة من أزواج <mark>key</mark> و <mark>value</mark>. الـ query بيتقارن بكل key عشان يطلع الوزن، والناتج متوسط مرجّح للـ values:</p>'+
     '<div class="m">alpha_i = softmax_i(q . k_i)\noutput  = sum_i alpha_i * v_i</div>'+
     '<p>فكّر فيها زي قاموس "ناعم": بدل ما تلاقي key واحد مطابق وترجّع الـ value بتاعه، بترجّع خليط من كل الـ values حسب التشابه.</p>'+
     '<p>في seq2seq بالـ attention: الـ query هو <code>s_t</code> (حالة الـ decoder)، والـ keys والـ values هما حالات الـ encoder <code>h_i</code>.</p>'+
     '<p>وفيه طرق تانية للـ scoring غير الـ dot product: <mark>multiplicative</mark> (q^T W k) و <mark>additive</mark> (v^T tanh(W1 k + W2 q)).</p>',
     '<p>Attention is more general than translation. We have one <mark>query</mark> and a list of <mark>key</mark> and <mark>value</mark> pairs. The query is compared with every key to get a weight, and the output is a weighted average of the values:</p>'+
     '<div class="m">alpha_i = softmax_i(q . k_i)\noutput  = sum_i alpha_i * v_i</div>'+
     '<p>Think of it as a "soft" dictionary: instead of finding the one matching key and returning its value, it returns a blend of all the values according to similarity.</p>'+
     '<p>In seq2seq with attention: the query is <code>s_t</code> (the decoder state), and the keys and values are the encoder states <code>h_i</code>.</p>'+
     '<p>There are other scoring methods besides the dot product: <mark>multiplicative</mark> (q^T W k) and <mark>additive</mark> (v^T tanh(W1 k + W2 q)).</p>'),
 q:[
   CQ("في attention، الـ output بيتحسب إزاي؟","In attention, how is the output computed?",
      [["متوسط مرجّح للـ values بأوزان من تشابه الـ query مع الـ keys","A weighted average of the values, with weights from query-key similarity"],["أكبر key بس","Only the largest key"],["مجموع الـ queries","The sum of the queries"],["ضرب الـ values ببعض","Multiplying the values together"]],
      0,"الـ softmax على q . k_i بيدي الأوزان، وبنضربها في الـ values ونجمع.","The softmax over q . k_i gives the weights, which multiply the values and are summed."),
   CQ("بـ dot product: q = [3, 0] و k_1 = [1, 0] و k_2 = [0, 1]. أنهي value ياخد وزن أكبر؟","With a dot product, q = [3, 0], k_1 = [1, 0] and k_2 = [0, 1]. Which value gets the larger weight?",
   [["v_1","v_1"],["v_2","v_2"],["الاتنين نفس الوزن","Both get the same weight"],["مفيش وزن لأي واحد","Neither gets any weight"]],
   0,"الـ scores هي [3, 0]، فالـ softmax بيدي v_1 وزن أكبر بكتير (حوالي 0.95).","The scores are [3, 0], so the softmax gives v_1 a much larger weight (about 0.95).")
 ],
 f:[
   CF("إيه هي الـ query والـ key والـ value؟","What are the query, key and value?",
      "الـ query بيتقارن بكل key لحساب الأوزان (softmax)، والـ output هو متوسط مرجّح للـ values.","The query is compared with every key to compute the weights (softmax), and the output is a weighted average of the values."),
   CF("إيه الفرق بين الـ key والـ value؟","What is the difference between a key and a value?",
   "الـ key بيحدد قد إيه نبص على العنصر، والـ value هو اللي بيتقرا فعلًا ويتجمع في الـ output.","The key decides how much to look at an item; the value is what actually gets read and added to the output.")
 ],
 terms:[
   {t:B("Query","Query"),
    d:B("اللي بنسأل بيه: بيتقارن بكل key لحساب الأوزان.","What we ask with: it is compared with every key to compute the weights.")},
   {t:B("Key","Key"),
    d:B("عنوان كل عنصر: بيتقارن بالـ query لحساب الـ score.","The label of each item: it is compared with the query to compute the score.")},
   {t:B("Value","Value"),
    d:B("المحتوى اللي بيتجمع في الـ output بأوزان الـ attention.","The content that gets summed into the output using the attention weights.")}
 ]},

{id:"l7-scoring",t:B("طرق حساب الـ score","Ways to compute the score"),
 b:cat(B('<p>الـ <mark>score</mark> هو الجزء اللي نقدر نبدّله في الـ attention. الباقي (softmax وبعدين المتوسط المرجّح للـ values) بيفضل زي ما هو:</p>',
         '<p>The <mark>score</mark> is the part of attention we can swap. The rest (a softmax, then a weighted average of the values) stays the same:</p>'),
       FIG_QKV,
       B('<p>فيه 3 طرق شائعة: الـ <mark>dot product</mark>، وطريقتين تانيين غيره هما <mark>multiplicative</mark> و <mark>additive</mark>:</p>'+
         '<div class="m">dot: q^T k\nmultiplicative: q^T W k\nadditive: v^T tanh(W1 k + W2 q)</div>'+
         '<p>الـ dot من غير parameters، بس لازم q و k يبقوا بنفس البعد. الـ multiplicative بيضيف مصفوفة <code>W</code> متعلَّمة، فبيقبل أبعاد مختلفة. الـ additive شبكة صغيرة (<code>W1</code> و <code>W2</code> و <code>v</code> متعلَّمين) وغالبًا أبطأ.</p>'+
         '<p>مثال: <code>q = [1, 2]</code> و <code>k = [3, 1]</code>. الـ dot = 1*3 + 2*1 = 5. ولو <code>W = diag(1, 0.5)</code> يبقى q^T W k = 1*3 + 2*0.5*1 = 4.</p>'+
         '<p><mark>غلطة شائعة:</mark> نفتكر إن تغيير الـ score بيغيّر فكرة الـ attention. اللي بيتغيّر بس طريقة حساب الأوزان. وللعلم، الـ dot هو حالة خاصة من الـ multiplicative لما W = I.</p>',
         '<p>There are 3 common choices: the <mark>dot product</mark>, and two others, <mark>multiplicative</mark> and <mark>additive</mark>:</p>'+
         '<div class="m">dot: q^T k\nmultiplicative: q^T W k\nadditive: v^T tanh(W1 k + W2 q)</div>'+
         '<p>The dot product has no parameters, but q and k must have the same size. Multiplicative adds a learned matrix <code>W</code>, so it accepts different sizes. Additive is a small network (<code>W1</code>, <code>W2</code> and <code>v</code> are learned) and is usually slower.</p>'+
         '<p>Example: <code>q = [1, 2]</code> and <code>k = [3, 1]</code>. The dot = 1*3 + 2*1 = 5. With <code>W = diag(1, 0.5)</code>, q^T W k = 1*3 + 2*0.5*1 = 4.</p>'+
         '<p><mark>Common mistake:</mark> thinking that changing the score changes what attention is. Only the way the weights are computed changes. Note that the dot product is a special case of multiplicative when W = I.</p>')),
 q:[
   CQ("أنهي طريقة score من غير parameters متعلَّمة؟","Which scoring method has no learned parameters?",
      [["الـ dot product","The dot product"],["الـ multiplicative","Multiplicative"],["الـ additive","Additive"],["كلهم عندهم parameters","All of them have parameters"]],
      0,"الـ dot product مجرد ضرب وجمع، فمفيش W.","The dot product is just multiply-and-add, so there is no W."),
   CQ("q = [2, 1] و k = [1, 4] و W = diag(3, 1). كام q^T W k؟","q = [2, 1], k = [1, 4] and W = diag(3, 1). What is q^T W k?",
      [["10","10"],["6","6"],["12","12"],["7","7"]],
      0,"W k = [3, 4]، وبعدين q . [3, 4] = 6 + 4 = 10.","W k = [3, 4], then q . [3, 4] = 6 + 4 = 10.")
 ],
 f:[
   CF("إيه الفرق بين dot و multiplicative و additive؟","What is the difference between dot, multiplicative and additive?",
      "dot: q^T k من غير parameters. multiplicative: q^T W k بمصفوفة متعلَّمة. additive: v^T tanh(W1 k + W2 q) بشبكة صغيرة.","dot: q^T k with no parameters. multiplicative: q^T W k with a learned matrix. additive: v^T tanh(W1 k + W2 q) with a small network."),
   CF("امتى الـ dot product يبقى حالة خاصة من الـ multiplicative؟","When is the dot product a special case of multiplicative attention?",
      "لما W = I (مصفوفة الوحدة).","When W = I (the identity matrix).")
 ],
 terms:[
   {t:B("Multiplicative attention","Multiplicative attention"),
    d:B("الـ score بيتحسب بالشكل <code>q^T W k</code> بمصفوفة W متعلَّمة، فالـ query والـ key ممكن يبقوا بأبعاد مختلفة.","The score is computed as <code>q^T W k</code> with a learned matrix W, so the query and key can have different sizes.")},
   {t:B("Additive attention","Additive attention"),
    d:B("الـ score بيتحسب بشبكة صغيرة: <code>v^T tanh(W1 k + W2 q)</code>.","The score is computed by a small network: <code>v^T tanh(W1 k + W2 q)</code>.")}
 ]},

{id:"l7-vsrnn",t:B("Self-attention مقابل الـ RNN","Self-attention versus the RNN"),
 b:cat(cat(B('<p>لو الـ query والـ keys والـ values كلها من <mark>نفس الجملة</mark>، ده اسمه <mark>self-attention</mark>: كل كلمة بتبص على باقي كلمات الجملة وبتبني تمثيلها من خليط الكل.</p>',
         '<p>If the query, keys and values all come from the <mark>same sentence</mark>, this is <mark>self-attention</mark>: each word looks at the other words in the sentence and builds its representation from a blend of them all.</p>'),
       FIG_PATH,
       B('<p>الـ RNN محتاج n خطوة عشان معلومة توصل من أول كلمة لآخر كلمة، وبيحسب خطوة بعد خطوة (مش بيتوازى). الـ self-attention بيوصّل أي كلمتين مباشرةً في خطوة واحدة، وكل الكلمات بتتحسب <mark>بالتوازي</mark> على الـ GPU. التكلفة: عدد الأزواج n × n، فبتزيد بالتربيع مع طول الجملة.</p>',
         '<p>An RNN needs about n steps to carry information from the first word to the last, and computes step after step (no parallelism). Self-attention connects any two words directly in one step, and all words are computed <mark>in parallel</mark> on the GPU. The cost: n × n pairs, so it grows quadratically with sentence length.</p>')),
       B('<p>مثال: جملة من 10 كلمات. في الـ RNN المعلومة من أول كلمة لآخر كلمة بتعدّي على 9 خطوات ورا بعض. في الـ self-attention خطوة واحدة، بس بنحسب 10 × 10 = 100 score.</p>',
  '<p>Example: a sentence of 10 words. In an RNN, information from the first word to the last passes through 9 sequential steps. In self-attention it takes 1 step, but we compute 10 × 10 = 100 scores.</p>')),
 q:[
   CQ("إيه ميزة الـ self-attention على الـ RNN؟","What is the advantage of self-attention over an RNN?",
      [["أي كلمتين بيتواصلوا مباشرةً والحساب بيتوازى","Any two words interact directly and computation is parallel"],["حجمه أقل دايمًا","It is always smaller"],["مش محتاج تدريب","It needs no training"],["بيحتاج تسلسل خطوة بخطوة","It needs step-by-step sequencing"]],
      0,"مفيش مسافة تسلسلية بين الكلمات، وكل حاجة بتتحسب مرة واحدة.","There is no sequential distance between words, and everything is computed at once."),
   CQ("جملة من 100 كلمة. كام score زوجي بيحسبه الـ self-attention في طبقة واحدة؟","A sentence has 100 words. How many pairwise scores does self-attention compute in one layer?",
   [["10,000","10,000"],["100","100"],["200","200"],["1,000,000","1,000,000"]],
   0,"n × n = 100 × 100 = 10,000.","n × n = 100 × 100 = 10,000.")
 ],
 f:[
   CF("إيه الفرق بين self-attention والـ RNN في طريقة نقل المعلومة؟","How do self-attention and an RNN differ in passing information?",
      "الـ RNN بينقل كلمة كلمة (n خطوة). الـ self-attention بيربط أي كلمتين مباشرةً وبيتوازى، لكن تكلفته n² .","An RNN passes it word by word (n steps). Self-attention links any two words directly and runs in parallel, but costs n²."),
   CF("إيه عيب الـ self-attention اللي بيزيد مع طول الجملة؟","What drawback of self-attention grows with sentence length?",
   "تكلفته n²: لو الجملة بقت ضعف الطول، الشغل بيبقى 4 أضعاف.","Its cost is n²: doubling the sentence length quadruples the work.")
 ],
 terms:[
   {t:B("Self-attention","Self-attention"),
    d:B("attention اللي الـ query والـ keys والـ values فيه كلهم من نفس الجملة، فكل كلمة بتبني تمثيلها من خليط باقي الكلمات.","Attention where the query, keys and values all come from the same sentence, so each word builds its representation from a blend of the other words.")}
 ]},

{id:"l7-missing",t:B("اللي ناقص في self-attention","What self-attention is missing"),
 b:cat(B('<p>الـ self-attention لوحده مش كفاية كـ building block. فيه 3 حاجات ناقصة، وحلولها هي قلب الـ Transformer:</p>'+
     '<p>1. <mark>مفيش إحساس بالترتيب</mark>: الـ self-attention مش بيعرف مين قبل مين، فمحتاجين <mark>positional encodings</mark> تضيف موضع كل كلمة.<br>2. <mark>مفيش non-linearity</mark>: الأوزان بس بتخلط قيم بشكل خطي، فنضيف <mark>feed-forward network</mark> بعد كل attention.<br>3. <mark>ممنوع نبص على المستقبل</mark> في الـ language modeling: نعمل <mark>masking</mark> للكلمات الجاية.</p>'+
     '<p>هنشوف الحلول دي كلها مع بعض في المحاضرة الجاية.</p>',
     '<p>Self-attention alone is not enough as a building block. Three things are missing, and their fixes are the heart of the Transformer:</p>'+
     '<p>1. <mark>No sense of order</mark>: self-attention does not know which word comes before which, so we need <mark>positional encodings</mark> to add each word\'s position.<br>2. <mark>No non-linearity</mark>: the weights only blend values linearly, so we add a <mark>feed-forward network</mark> after each attention layer.<br>3. <mark>No peeking at the future</mark> in language modeling: we <mark>mask</mark> the upcoming words.</p>'+
     '<p>We will see all these fixes together in the next lecture.</p>'),
       B('<p>تفصيلة صغيرة: الـ masking بيتعمل بإن الـ score للكلمة الجاية بيتحط عليه <code>-inf</code> قبل الـ softmax، فوزنها بيبقى 0 بالظبط. وبعد كل attention، الـ feed-forward network بيشتغل على كل كلمة لوحدها وبيضيف الـ non-linearity.</p>',
  '<p>A small detail: masking works by setting the score of each upcoming word to <code>-inf</code> before the softmax, so its weight becomes exactly 0. And after each attention layer, the feed-forward network processes each word on its own and adds the non-linearity.</p>')),
 q:[
   CQ("إيه اللي بيحل مشكلة إن self-attention مش بيعرف ترتيب الكلمات؟","What fixes the fact that self-attention does not know word order?",
      [["Positional encodings","Positional encodings"],["Masking","Masking"],["Softmax","Softmax"],["Dropout","Dropout"]],
      0,"بنضيف معلومة الموضع لتمثيل كل كلمة.","We add position information to each word's representation."),
   CQ("من غير positional encodings، إيه اللي بيحصل للجملتين dog bites man و man bites dog؟","Without positional encodings, what happens to the sentences dog bites man and man bites dog?",
   [["كل كلمة بتاخد نفس التمثيل في الجملتين، فالترتيب بيضيع","Each word gets the same representation in both, so the order is lost"],["الموديل بيفرّق بينهم بالترتيب","The model tells them apart by their order"],["الـ attention بيدي bites وزن صفر","Attention gives bites a weight of zero"],["التدريب بيفشل","Training fails"]],
   0,"الـ self-attention بيشوف الكلمات كمجموعة من غير ترتيب، فالجملتين فيهم نفس الكلمات.","Self-attention sees the words as a set with no order, and both sentences contain the same words.")
 ],
 f:[
   CF("إيه التلات حاجات الناقصة في self-attention؟","What are the three things missing from self-attention?",
      "ترتيب الكلمات (positional encodings)، non-linearity (feed-forward network)، ومنع الرؤية للمستقبل (masking).","Word order (positional encodings), non-linearity (feed-forward network), and blocking the future (masking)."),
   CF("إيه وظيفة الـ masking في الـ language modeling؟","What is masking for in language modeling?",
   "بيمنع الكلمة من رؤية الكلمات الجاية، فالموديل مبيغشّش وهو بيتنبأ بالكلمة التالية.","It stops a word from seeing the upcoming words, so the model cannot cheat while predicting the next word.")
 ],
 terms:[
   {t:B("Positional encoding","Positional encoding"),
 d:B("معلومة موضع كل كلمة بتتضاف لتمثيلها، علشان الـ self-attention يعرف الترتيب.","The position of each word, added to its representation so that self-attention can know the order.")},
   {t:B("Masking","Masking"),
    d:B("إخفاء الكلمات الجاية عن الـ attention في الـ language modeling.","Hiding the upcoming words from attention in language modeling.")}
 ]},

{id:"l7-recap",t:B("Recap: ملخص المحاضرة","Recap: lecture summary"),
 b:B('<p><mark>الخلاصة في 5 نقاط:</mark></p>'+
     '<p>1. الـ attention بيخلّي الـ decoder يبص على كل حالات الـ encoder بدل vector واحد.<br>2. الخطوات: scores، بعدين softmax للأوزان، بعدين متوسط مرجّح.<br>3. الأوزان مجموعها 1، وبتطلّع alignment بين اللغتين حتى لو الترتيب اتغيّر.<br>4. التعميم: query و keys و values، وفيه أكتر من طريقة للـ score.<br>5. الـ self-attention بيربط أي كلمتين مباشرةً وبالتوازي، لكن تكلفته n².</p>'+
     '<div class="m">e_i = score(q, k_i)\nalpha = softmax(e)\noutput = sum_i alpha_i * v_i</div>'+
     '<p><mark>قبل المحاضرة الجاية:</mark> اتأكد إنك تقدر تحسب softmax والـ context بإيدك، وتشرح ليه الـ self-attention محتاج positional encodings و feed-forward network و masking.</p>',
     '<p><mark>The summary in 5 points:</mark></p>'+
     '<p>1. Attention lets the decoder look at all the encoder states instead of a single vector.<br>2. The steps: scores, then a softmax for the weights, then a weighted average.<br>3. The weights sum to 1, and they reveal the alignment between the languages even when the order changes.<br>4. The generalization: query, keys and values, with more than one way to compute the score.<br>5. Self-attention links any two words directly and in parallel, but its cost is n².</p>'+
     '<div class="m">e_i = score(q, k_i)\nalpha = softmax(e)\noutput = sum_i alpha_i * v_i</div>'+
     '<p><mark>Before the next lecture:</mark> make sure you can compute a softmax and a context by hand, and explain why self-attention needs positional encodings, a feed-forward network and masking.</p>'),
 q:[
   CQ("إيه الترتيب الصح لخطوات الـ attention؟","What is the correct order of the attention steps?",
      [["scores، بعدين softmax، بعدين متوسط مرجّح","Scores, then softmax, then a weighted average"],["softmax، بعدين scores، بعدين متوسط مرجّح","Softmax, then scores, then a weighted average"],["متوسط مرجّح، بعدين scores، بعدين softmax","A weighted average, then scores, then softmax"],["scores، بعدين متوسط مرجّح، بعدين softmax","Scores, then a weighted average, then softmax"]],
      0,"الـ softmax محتاج scores جاهزة، والمتوسط المرجّح محتاج الأوزان اللي طلعت من الـ softmax.","The softmax needs the scores first, and the weighted average needs the weights that the softmax produced."),
   CQ("الأوزان [0.1, 0.7, 0.2] على 3 encoder states. إزاي توصف الـ context؟","The weights are [0.1, 0.7, 0.2] over three encoder states. How would you describe the context?",
      [["خليط من التلاتة وأقرب للحالة التانية","A blend of all three, closest to the second state"],["نفس الحالة التانية بالظبط","Exactly the second state"],["مجموع التلاتة من غير أوزان","The plain sum of the three"],["الحالة الأولى بس","The first state only"]],
      0,"متوسط مرجّح بوزن 0.7 للحالة التانية، فهو أقرب ليها بس فيه شوية من الباقي.","A weighted average with 0.7 on the second state, so it is closest to it but still has a bit of the others.")
 ],
 f:[
   CF("لخّص الـ attention في جملة.","Summarize attention in one sentence.",
      "الـ query بيتقارن بالـ keys لحساب أوزان (softmax)، والـ output هو متوسط مرجّح للـ values.","The query is compared with the keys to compute weights (softmax), and the output is a weighted average of the values."),
   CF("إيه اللي لازم تعرفه قبل الـ Transformer؟","What should you know before the Transformer?",
      "إزاي الـ attention بيتحسب، والـ query و key و value، وإن الـ self-attention ناقصه ترتيب و non-linearity و masking.","How attention is computed, query, key and value, and that self-attention lacks order, non-linearity and masking.")
 ]}
]}
);

})();
