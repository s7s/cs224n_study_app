/* Lecture 3: Backpropagation & Neural Networks
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L3 fig: linear vs non-linear boundary */
function boundaryFig(){
  var s='',panels=[90,270],A=[[-14,-8],[10,-12],[-6,12],[14,8],[0,0]],k;
  for(k=0;k<2;k++){
    var cx=panels[k],cy=89;
    s+=RECT(cx-84,6,168,166,'none','var(--ln)',10,1.5);
    A.forEach(function(p){s+=DOT(cx+p[0],cy+p[1],'ac',5);});
    for(var a=0;a<8;a++){
      var ang=a*Math.PI/4,bx=cx+Math.cos(ang)*60,by=cy+Math.sin(ang)*60;
      s+=RECT(bx-4.5,by-4.5,9,9,'var(--ok)','none',2);
    }
  }
  s+='<line x1="'+(panels[0]-70)+'" y1="'+(89+52)+'" x2="'+(panels[0]+70)+'" y2="'+(89-52)+'" style="stroke:var(--no);stroke-width:2.2;stroke-dasharray:6 4"/>';
  s+='<circle cx="'+panels[1]+'" cy="89" r="36" style="fill:none;stroke:var(--ok);stroke-width:2.2;stroke-dasharray:6 4"/>';
  s+=T(panels[0],190,'linear boundary','tb','middle','fill:var(--no)')+T(panels[1],190,'non-linear boundary','tb','middle','fill:var(--ok)');
  return s;
}

var FIG_BOUNDARY=fig(200,boundaryFig(),
  B('الدواير الزرقا جوه والمربعات الخضرا حواليها. أي خط مستقيم هيغلط، لكن حد منحني (على اليمين) بيفصلهم بسهولة.',
    'Blue dots inside, green squares around them. Any straight line will misclassify some, but a curved boundary (right) separates them easily.'));

/* L3 fig: activation functions */
function actFig(){
  var xv=function(x){return 190+x*37.5;},yv=function(v){return 150-(v+1.2)/3.4*130;};
  var sg=[],th=[],rl=[],x;
  for(x=-4;x<=4.001;x+=0.2){
    sg.push(xv(x).toFixed(1)+','+yv(1/(1+Math.exp(-x))).toFixed(1));
    th.push(xv(x).toFixed(1)+','+yv(Math.tanh(x)).toFixed(1));
  }
  for(x=-4;x<=2.201;x+=0.2){rl.push(xv(x).toFixed(1)+','+yv(Math.max(0,x)).toFixed(1));}
  return '<line x1="40" y1="'+yv(0)+'" x2="340" y2="'+yv(0)+'" style="stroke:var(--mu);stroke-width:1.2"/>'+
    '<line x1="190" y1="20" x2="190" y2="150" style="stroke:var(--mu);stroke-width:1.2"/>'+
    '<polyline points="'+sg.join(' ')+'" style="fill:none;stroke:var(--ac);stroke-width:2.4"/>'+
    '<polyline points="'+th.join(' ')+'" style="fill:none;stroke:var(--ok);stroke-width:2.4"/>'+
    '<polyline points="'+rl.join(' ')+'" style="fill:none;stroke:var(--no);stroke-width:2.4"/>'+
    RECT(46,26,10,10,'var(--ac)','none',2)+T(62,35,'sigmoid','tb')+
    RECT(46,42,10,10,'var(--ok)','none',2)+T(62,51,'tanh','tb')+
    RECT(46,58,10,10,'var(--no)','none',2)+T(62,67,'ReLU','tb');
}

var FIG_ACT=fig(166,actFig(),
  B('sigmoid بتضغط الناتج بين 0 و1، و tanh بين -1 و1، و ReLU صفر للسالب والقيمة نفسها للموجب.',
    'sigmoid squashes to between 0 and 1, tanh to between -1 and 1, and ReLU gives zero for negatives and the value itself for positives.'));

/* L3 fig: computation graph, forward and backward */
function graphFig(){
  var s='',bx=[4,128,252],lab=['x · w','+ b','σ'],i;
  for(i=0;i<3;i++){s+=RECT(bx[i],28,80,56,'var(--sf)','var(--ac)',10,1.8)+T(bx[i]+40,61,lab[i],'tb','middle','font-size:14px');}
  s+=AL(84,48,128,48,'ac','mA')+T(106,42,'a','tm','middle')+
     AL(208,48,252,48,'ac','mA')+T(230,42,'z','tm','middle')+
     AL(332,48,356,48,'ac','mA')+T(344,42,'y','tm','middle')+
     AL(128,68,84,68,'ok','mG',true)+T(106,82,'dL/da','tm','middle','font-size:11px')+
     AL(252,68,208,68,'ok','mG',true)+T(230,82,'dL/dz','tm','middle','font-size:11px')+
     AL(356,68,332,68,'ok','mG',true)+T(340,102,'dL/dy','tm','middle','font-size:11px')+
     AL(168,6,168,26,'mu','mM')+T(178,16,'b','tm')+
     T(4,14,'forward','tb','start','fill:var(--ac)')+T(4,102,'backward','tb','start','fill:var(--ok)');
  return s;
}

var FIG_GRAPH=fig(112,graphFig(),
  B('الأسهم الزرقا (forward) بتحسب القيم لحد الـ loss، والأسهم الخضرا (backward) بترجع بالـ gradients خطوة خطوة بالعكس.',
    'Blue arrows (forward) compute the values up to the loss; green arrows (backward) carry the gradients back step by step in reverse.'));

/* L3 fig: a tiny 2-layer network with numbers, forward values and backward gradients */
function netFig(){
  var s='',i,
      N=[[6,26,48,'x1=1','var(--ac)'],[6,86,48,'x2=2','var(--ac)'],
         [110,26,48,'h1=0','var(--no)'],[110,86,48,'h2=2','var(--ac)'],
         [214,56,48,'y=2','var(--ac)'],[298,56,54,'L=0.5','var(--ac)']];
  s+=AR(54,40,110,40,'ac','mA')+AR(54,40,110,100,'ac','mA')+AR(54,100,110,40,'ac','mA')+AR(54,100,110,100,'ac','mA')+
     AR(158,40,214,70,'ac','mA')+AR(158,100,214,70,'ac','mA')+AR(262,70,298,70,'ac','mA');
  for(i=0;i<N.length;i++){
    s+=RECT(N[i][0],N[i][1],N[i][2],28,'var(--sf)',N[i][4],8,1.8)+T(N[i][0]+N[i][2]/2,N[i][1]+19,N[i][3],'tb','middle');
  }
  s+=T(134,16,'ReLU blocks','tm','middle','fill:var(--no);font-size:11px')+
     T(134,134,'dL/dz = [0, 1]','tb','middle','fill:var(--ok);font-size:12px')+
     T(238,106,'dL/dy = 1','tb','middle','fill:var(--ok);font-size:12px');
  return s;
}

var FIG_NET=fig(150,netFig(),
  B('الأسهم الزرقا هي الـ forward، والأرقام الخضرا هي الـ gradients الراجعة. الـ ReLU بتقفل gradient الـ neuron الأول لأن z1 سالبة.',
    'Blue arrows are the forward pass; the green numbers are the gradients coming back. ReLU blocks the gradient of the first hidden neuron because z1 is negative.'));

/* L3 fig: SGD zig-zag versus momentum on an elongated valley */
function optFig(){
  var zz=[[96,22],[130,134],[164,38],[198,122],[230,52],[258,106],[280,70],[298,82]],
      pts=zz.map(function(p){return p[0]+','+p[1];}).join(' ');
  return ell(300,82,18,9,'mu')+ell(300,82,36,18,'mu')+ell(300,82,54,27,'mu')+
    '<polyline points="'+pts+'" style="fill:none;stroke:var(--no);stroke-width:2"/>'+
    '<path d="M96 22 C 150 70, 220 96, 292 82" style="fill:none;stroke:var(--ac);stroke-width:2.4" marker-end="url(#mA)"/>'+
    DOT(300,82,'ok',5)+
    RECT(8,8,10,10,'var(--no)','none',2)+T(24,17,'SGD','tb')+
    RECT(8,24,10,10,'var(--ac)','none',2)+T(24,33,'momentum','tb')+
    T(300,126,'minimum','tm','middle');
}

var FIG_OPT=fig(150,optFig(),
  B('الـ SGD بيتذبذب في الاتجاه الحاد ويتقدم ببطء، والـ momentum بيمسّح الذبذبة ويقرّب أسرع من الـ minimum.',
    'Plain SGD oscillates across the steep direction and makes slow progress; momentum smooths the oscillation and gets to the minimum faster.'));

/* L3 fig: dropout, a hidden layer with some neurons dropped */
function dropFig(){
  var s='',iy=[35,75,115],hy=[22,57,92,127],on=[true,false,true,false],i,j;
  for(i=0;i<3;i++){for(j=0;j<4;j++){if(on[j])s+='<line x1="68" y1="'+iy[i]+'" x2="172" y2="'+hy[j]+'" style="stroke:var(--ln);stroke-width:1.2"/>';}}
  for(j=0;j<4;j++){if(on[j])s+='<line x1="188" y1="'+hy[j]+'" x2="292" y2="75" style="stroke:var(--ac);stroke-width:1.6"/>';}
  for(i=0;i<3;i++)s+=DOT(60,iy[i],'mu',8);
  for(j=0;j<4;j++){
    if(on[j])s+=DOT(180,hy[j],'ac',11);
    else s+='<circle cx="180" cy="'+hy[j]+'" r="11" style="fill:none;stroke:var(--mu);stroke-width:1.6;stroke-dasharray:3 3"/>'+
      '<line x1="174" y1="'+(hy[j]-6)+'" x2="186" y2="'+(hy[j]+6)+'" style="stroke:var(--no);stroke-width:2"/>'+
      '<line x1="186" y1="'+(hy[j]-6)+'" x2="174" y2="'+(hy[j]+6)+'" style="stroke:var(--no);stroke-width:2"/>';
  }
  return s+DOT(300,75,'ok',11)+T(60,160,'input','tm','middle')+T(180,160,'hidden, p = 0.5','tm','middle')+T(300,160,'output','tm','middle');
}

var FIG_DROP=fig(170,dropFig(),
  B('الدواير الزرقا neurons شغالة، والمنقّطة اتعمل لها dropout في الخطوة دي. في كل خطوة بيتختار set عشوائي مختلف.',
    'Solid blue neurons are active; dashed ones were dropped in this step. A different random set is dropped on every step.'));

/* L3 fig: relative error scale for gradient checking */
var FIG_RELERR=fig(116,
  RECT(20,50,116.4,20,'var(--ok)','none',4)+RECT(136.4,50,116.4,20,'var(--mu)','none',4)+RECT(252.7,50,87.3,20,'var(--no)','none',4)+DOT(31.4,40,'ac',6)+T(31.4,26,'ok','tb','middle')+DOT(335.7,40,'ac',6)+T(335.7,26,'bug','tb','middle')+T(136.4,86,'1e-7','tm','middle')+T(252.7,86,'1e-3','tm','middle')+T(49.1,86,'1e-10','tm','middle')+T(340,86,'1','tm','end')+T(78.2,106,'great','tm','middle')+T(194.5,106,'check','tm','middle')+T(296.4,106,'bug','tm','middle'),
  B('الـ relative error (scale لوغاريتمي): الأخضر صح والأحمر bug.',
    'Relative error (log scale): green is right, red is a bug.'));

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:3,t:B("Backpropagation و Neural Networks","Backpropagation & Neural Networks"),cards:[

{id:"l3-whynn",t:B("ليه محتاجين neural networks","Why we need neural networks"),
 b:cat(B('<p>الـ softmax classifier بيرسم خط مستقيم يفصل الـ classes. لو البيانات مش قابلة للفصل بخط مستقيم (زي مجموعة جوه حلقة من مجموعة تانية) هيغلط مهما دربناه.</p>',
         '<p>A softmax classifier draws a straight line between classes. If the data cannot be separated by a straight line (like one group sitting inside a ring of another), it will make mistakes no matter how long we train.</p>'),
       FIG_BOUNDARY,
       B('<p>الحل: نضيف <mark>طبقة مخفية (hidden layer)</mark> مع <mark>non-linearity</mark>، فالشبكة تقدر ترسم حدود منحنية. وكمان الشبكة بتتعلم <mark>features</mark> بنفسها بدل ما ندوّر عليها يدويًا.</p>',
         '<p>The fix: add a <mark>hidden layer</mark> with a <mark>non-linearity</mark>, so the network can draw curved boundaries. The network also learns its own <mark>features</mark> instead of us hand-crafting them.</p>'),
       B('<p>الـ hidden layer بتحوّل المدخلات لتمثيل جديد الـ classes فيه بتتفصل بخط مستقيم، وبعدين الـ softmax بترسم الخط ده. غلطة شائعة: نفتكر إن تدريب أطول أو بيانات أكتر هتحل المشكلة. العيب في شكل النموذج نفسه (حد خطي) مش في التدريب.</p>',
  '<p>The hidden layer maps the input into a new representation where the classes can be separated by a straight line, and then the softmax draws that line. Common mistake: thinking that longer training or more data will fix this. The limit is the shape of the model itself (a linear boundary), not the training.</p>')),
 q:[
   CQ("ليه الـ softmax classifier لوحده مش كفاية أحيانًا؟","Why is a softmax classifier alone sometimes not enough?",
      [["حد الفصل بتاعه خطي","Its decision boundary is linear"],["بطيء جدًا","It is far too slow"],["مش بيدي احتمالات","It does not output probabilities"],["محتاج فيديو","It needs video"]],
      0,"مش هيقدر يفصل بيانات محتاجة حد منحني.","It cannot separate data that needs a curved boundary."),
   CQ("عايزين نفصل نقط جوه حلقة عن نقط بره منها. أنهي نموذج يقدر يعمل كده؟","We want to separate points inside a ring from points outside it. Which model can do that?",
   [["hidden layer مع non-linearity","A hidden layer with a non-linearity"],["softmax لوحده","A softmax alone"],["softmax بتدريب أطول","A softmax with longer training"],["softmax بـ learning rate أكبر","A softmax with a larger learning rate"]],
   0,"الحد المنحني محتاج non-linearity، والتدريب الأطول مش بيغيّر إن حد الـ softmax خطي.","A curved boundary needs a non-linearity; longer training does not change the fact that the softmax boundary is linear.")
 ],
 f:[
   CF("إيه اللي بتضيفه الطبقة المخفية مع non-linearity؟","What does a hidden layer with a non-linearity add?",
      "بتخلي الشبكة ترسم حدود فصل منحنية وتتعلم features بنفسها.","It lets the network draw curved decision boundaries and learn its own features."),
   CF("إيه هي الـ features في الشبكة؟","What are the features in a network?",
   "التمثيلات اللي الـ hidden layer بتطلعها، والشبكة بتتعلمها بنفسها بدل ما نصممها يدويًا.","The representations the hidden layer produces; the network learns them itself instead of us hand-crafting them.")
 ],
 terms:[
   {t:B("Hidden layer","Hidden layer"),
 d:B("طبقة في النص بين المدخلات والمخرجات، بتحوّل المدخلات لتمثيل جديد.","A layer between the input and the output that turns the input into a new representation.")},
{t:B("Non-linearity","Non-linearity"),
 d:B("دالة غير خطية (زي ReLU) بتتحط بين الطبقات علشان الشبكة ترسم حدود منحنية.","A non-linear function (such as ReLU) placed between layers so the network can draw curved boundaries.")},
{t:B("Features","Features"),
 d:B("التمثيلات اللي الشبكة بتتعلمها بنفسها من المدخلات.","The representations the network learns from the input by itself.")}
 ]},

{id:"l3-neuron",t:B("الـ neuron والطبقة","The neuron and the layer"),
 b:cat(B('<p>الـ neuron الواحد بياخد مدخلات، يضربها في أوزان، يجمعها مع bias، ويمرر النتيجة في <mark>activation function</mark> اسمها <code>f</code>:</p>'+
         '<div class="m">h = f(w . x + b)</div>'+
         '<p>الطبقة (layer) هي مجموعة neurons بتتحسب مرة واحدة بالمصفوفات:</p>'+
         '<div class="m">h = f(W x + b)</div>',
         '<p>A single neuron takes inputs, multiplies them by weights, adds a bias, and passes the result through an <mark>activation function</mark> <code>f</code>:</p>'+
         '<div class="m">h = f(w . x + b)</div>'+
         '<p>A layer is a group of neurons computed at once with matrices:</p>'+
         '<div class="m">h = f(W x + b)</div>'),
       FIG_ACT,
       B('<p>أشهر الـ activations: <mark>sigmoid</mark> و <mark>tanh</mark> و <mark>ReLU</mark>. الـ ReLU شائعة جدًا لأنها بسيطة وسريعة.</p>',
         '<p>The common activations: <mark>sigmoid</mark>, <mark>tanh</mark> and <mark>ReLU</mark>. ReLU is very popular because it is simple and fast.</p>'),
       B('<p>مثال بأرقام: <code>w = [2, -1]</code> و <code>x = [3, 4]</code> و <code>b = 1</code>:</p><div class="m">w . x + b = 6 - 4 + 1 = 3\nReLU(3) = 3,  sigmoid(3) ≈ 0.95</div>',
  '<p>A numeric example: <code>w = [2, -1]</code>, <code>x = [3, 4]</code> and <code>b = 1</code>:</p><div class="m">w . x + b = 6 - 4 + 1 = 3\nReLU(3) = 3,  sigmoid(3) ≈ 0.95</div>')),
 q:[
   CQ("كام ReLU(-3)؟","What is ReLU(-3)?",
      [["0","0"],["-3","-3"],["3","3"],["1","1"]],
      0,"ReLU بتطلع صفر لأي قيمة سالبة.","ReLU outputs zero for any negative input."),
   CQ("w = [1, 2] و x = [3, -1] و b = 0.5. كام ناتج الـ neuron لو الـ activation هي ReLU؟","w = [1, 2], x = [3, -1] and b = 0.5. What does the neuron output with a ReLU activation?",
   [["1.5","1.5"],["0","0"],["2.5","2.5"],["5.5","5.5"]],
   0,"1*3 + 2*(-1) + 0.5 = 1.5، وهو موجب فـ ReLU بتسيبه زي ما هو.","1*3 + 2*(-1) + 0.5 = 1.5, which is positive, so ReLU leaves it unchanged.")
 ],
 f:[
   CF("إيه الصيغة الرياضية للطبقة؟","What is the formula for a layer?",
      "h = f(W x + b) حيث f هي الـ activation function.","h = f(W x + b) where f is the activation function."),
   CF("إيه هي الـ ReLU؟","What is ReLU?",
   "ReLU(x) = max(0, x): صفر للسالب والقيمة نفسها للموجب.","ReLU(x) = max(0, x): zero for negatives and the value itself for positives.")
 ],
 terms:[
   {t:B("Activation function","Activation function"),
 d:B("دالة بتتطبق على w . x + b علشان نضيف non-linearity.","A function applied to w . x + b to add a non-linearity.")},
{t:B("ReLU","ReLU"),
 d:B("ReLU(x) = max(0, x): صفر للسالب والقيمة نفسها للموجب.","ReLU(x) = max(0, x): zero for negatives, the value itself for positives.")},

{t:B("tanh","tanh"),
 d:B("بتضغط أي رقم لقيمة بين -1 و1.","Squashes any number to a value between -1 and 1.")}
 ]},

{id:"l3-nonlinearity",t:B("ليه لازم non-linearity؟","Why we need a non-linearity"),
 b:cat(B('<p>لو رصّينا طبقتين من غير activation:</p>'+
     '<div class="m">h = W1 x\ny = W2 h = (W2 W1) x = W x</div>'+
     '<p>حاصل ضرب مصفوفتين هو مصفوفة واحدة، فالشبكة كلها بتبقى <mark>تحويل خطي</mark> واحد مهما زودنا طبقات. الـ non-linearity هي اللي بتدي الشبكة القدرة على تمثيل دوال معقدة.</p>'+
     '<p>وللأبعاد: لو <code>x</code> فيه d رقم و <code>h</code> فيه n neuron، يبقى <code>W</code> شكلها n × d و <code>b</code> فيه n رقم.</p>',
     '<p>If we stack two layers without an activation:</p>'+
     '<div class="m">h = W1 x\ny = W2 h = (W2 W1) x = W x</div>'+
     '<p>The product of two matrices is just one matrix, so the whole network is a single <mark>linear transformation</mark> no matter how many layers we add. The non-linearity is what lets the network represent complex functions.</p>'+
     '<p>On shapes: if <code>x</code> has d numbers and <code>h</code> has n neurons, then <code>W</code> is n × d and <code>b</code> has n numbers.</p>'),
       B('<p>مثال بأرقام (scalars): بـ W1 = 2 و W2 = 3 الشبكة بقت <code>y = 6x</code>، يعني خط مستقيم. لو حطينا ReLU بينهم <code>y = 3 · ReLU(2x)</code> الشكل بينكسر: x = -1 بتدي 0، و x = 1 بتدي 6، و x = 2 بتدي 12.</p>',
  '<p>A scalar example: with W1 = 2 and W2 = 3 the network is just <code>y = 6x</code>, a straight line. Put a ReLU in between, <code>y = 3 · ReLU(2x)</code>, and it bends: x = -1 gives 0, x = 1 gives 6, x = 2 gives 12.</p>')),
 q:[
   CQ("إيه اللي يحصل لشبكة من 5 طبقات كلها من غير activation؟","What happens to a 5-layer network with no activations at all?",
      [["تبقى تحويل خطي واحد","It collapses into one linear transformation"],["تبقى أقوى 5 مرات","It becomes 5 times more powerful"],["بتتعلم أسرع","It learns faster"],["بترسم حدود منحنية","It draws curved boundaries"]],
      0,"ضرب المصفوفات ورا بعض بيدي مصفوفة واحدة.","Multiplying the matrices together gives a single matrix."),
   CQ("في الشبكة y = 3 · ReLU(2x)، كام y لما x = -1؟","In the network y = 3 · ReLU(2x), what is y when x = -1?",
   [["0","0"],["-6","-6"],["6","6"],["-1","-1"]],
   0,"2x = -2 و ReLU(-2) = 0، يبقى y = 3 × 0 = 0. (من غير ReLU كانت هتبقى -6.)","2x = -2 and ReLU(-2) = 0, so y = 3 × 0 = 0. (Without the ReLU it would be -6.)")
 ],
 f:[
   CF("ليه الشبكة من غير activation ملهاش لازمة؟","Why is a network without activations pointless?",
      "الطبقات المتتالية بتتجمع في مصفوفة واحدة، فالشبكة كلها تحويل خطي واحد.","Consecutive layers merge into one matrix, so the whole network is a single linear transformation."),
   CF("لو x فيه d رقم و h فيه n neuron، إيه شكل W؟","If x has d numbers and h has n neurons, what is the shape of W?",
   "n × d، والـ b فيه n رقم.","n × d, and b has n numbers.")
 ],
 terms:[
   {t:B("Linear transformation","Linear transformation"),
 d:B("تحويل بيتعمل بضرب في مصفوفة (وممكن جمع bias). تركيب أكتر من واحد منهم يفضل تحويل خطي واحد.","A transformation done by multiplying with a matrix (plus an optional bias). Composing several of them is still one linear transformation.")}
 ]},

{id:"l3-chainrule",t:B("الـ chain rule و computation graph","The chain rule and the computation graph"),
 b:cat(B('<p>الشبكة عبارة عن سلسلة عمليات بسيطة. بنرسمها كـ <mark>computation graph</mark>: كل عقدة عملية، وكل سهم قيمة بتعدي.</p>',
         '<p>A network is a chain of simple operations. We draw it as a <mark>computation graph</mark>: each node is an operation and each arrow is a value passing through.</p>'),
       FIG_GRAPH,
       B('<p>لما نحسب الـ loss <code>L</code>، عايزين gradient كل وزن. الـ <mark>chain rule</mark> بتقول إن مشتقة سلسلة دوال هي حاصل ضرب مشتقاتها:</p>'+
         '<div class="m">dL/dz = dL/dy * dy/dz\ndL/da = dL/dz * dz/da</div>',
         '<p>Once we compute the loss <code>L</code>, we need the gradient for every weight. The <mark>chain rule</mark> says the derivative of a chain of functions is the product of their derivatives:</p>'+
         '<div class="m">dL/dz = dL/dy * dy/dz\ndL/da = dL/dz * dz/da</div>'),
       B('<p>مثال بأرقام: <code>z = 3x</code> و <code>y = z²</code> و <code>L = y</code>. عند x = 2:</p><div class="m">z = 6\ndy/dz = 2z = 12\ndz/dx = 3\ndL/dx = 12 * 3 = 36</div><p>غلطة شائعة: نجمع المشتقات بدل ما نضربها.</p>',
  '<p>A numeric example: <code>z = 3x</code>, <code>y = z²</code> and <code>L = y</code>. At x = 2:</p><div class="m">z = 6\ndy/dz = 2z = 12\ndz/dx = 3\ndL/dx = 12 * 3 = 36</div><p>Common mistake: adding the derivatives instead of multiplying them.</p>')),
 q:[
   CQ("حسب الـ chain rule، dL/dz يساوي...","By the chain rule, dL/dz equals...",
      [["dL/dy * dy/dz","dL/dy * dy/dz"],["dL/dy + dy/dz","dL/dy + dy/dz"],["dy/dz بس","dy/dz only"],["dz/dy","dz/dy"]],
      0,"بنضرب مشتقات الحلقات المتتالية في بعض.","We multiply the derivatives of consecutive links."),
   CQ("لو z = 3x و y = z² و x = 1، كام dy/dx؟","If z = 3x and y = z² and x = 1, what is dy/dx?",
   [["18","18"],["9","9"],["6","6"],["3","3"]],
   0,"z = 3 فـ dy/dz = 2z = 6، و dz/dx = 3، يبقى 6 × 3 = 18. (9 هتطلع لو جمعنا بدل الضرب.)","z = 3 so dy/dz = 2z = 6, and dz/dx = 3, giving 6 × 3 = 18. (9 would come from adding instead of multiplying.)")
 ],
 f:[
   CF("إيه هي الـ chain rule؟","What is the chain rule?",
      "مشتقة سلسلة دوال = حاصل ضرب مشتقاتها. مثلًا dL/dz = dL/dy * dy/dz.","The derivative of a chain of functions is the product of their derivatives, e.g. dL/dz = dL/dy * dy/dz."),
   CF("إيه الغلطة الشائعة في الـ chain rule؟","What is the common mistake with the chain rule?",
   "نجمع المشتقات بدل ما نضربها.","Adding the derivatives instead of multiplying them.")
 ],
 terms:[
   {t:B("Chain rule","Chain rule"),
 d:B("مشتقة سلسلة دوال = حاصل ضرب مشتقاتها.","The derivative of a chain of functions is the product of their derivatives.")},
{t:B("Computation graph","Computation graph"),
 d:B("رسم للعمليات والقيم اللي بتعدي بينها: كل عقدة عملية وكل سهم قيمة.","A graph of the operations and the values passing between them: each node is an operation and each arrow is a value.")}
 ]},

{id:"l3-jacobian",t:B("الـ Jacobian وأشكال الـ gradients","The Jacobian and gradient shapes"),
 b:B('<p>لما الدالة بتاخد vector وترجّع vector، مشتقتها مش رقم واحد. الـ <mark>Jacobian</mark> مصفوفة فيها مشتقة كل ناتج بالنسبة لكل مدخل. لو <code>h = W x</code> و x فيه d رقم و h فيه n رقم:</p>'+
     '<div class="m">dh_i / dx_j = W_ij   =>   Jacobian = W  (n × d)</div>'+
     '<p>ولو الـ activation بتشتغل على كل عنصر لوحده (<code>h = f(z)</code>)، الـ Jacobian بيبقى قطري وعلى القطر f\'(z)، فعمليًا بنضرب عنصر في عنصر.</p>'+
     '<p><mark>قاعدة الشكل</mark>: gradient الـ loss بالنسبة لأي parameter له نفس شكل الـ parameter. تجربة بأرقام بـ W = [[1, 0], [2, 3]] و x = [1, 2] والـ upstream dL/dh = [2, 1]:</p>'+
     '<div class="m">dL/dx = W^T . dL/dh = [4, 3]       (shape 2)\ndL/dW = dL/dh . x^T = [[2, 4], [1, 2]]   (shape 2 × 2, like W)</div>'+
     '<p>غلطة شائعة: لو شكل الـ gradient طلع غلط يبقى غالبًا نسيت transpose. راجع الأشكال قبل القيم.</p>',
     '<p>When a function takes a vector and returns a vector, its derivative is not one number. The <mark>Jacobian</mark> is a matrix holding the derivative of every output with respect to every input. For <code>h = W x</code>, where x has d numbers and h has n:</p>'+
     '<div class="m">dh_i / dx_j = W_ij   =>   Jacobian = W  (n × d)</div>'+
     '<p>For an element-wise activation (<code>h = f(z)</code>) the Jacobian is diagonal, with f\'(z) on the diagonal, so in practice we multiply element by element.</p>'+
     '<p>The <mark>shape rule</mark>: the gradient of the loss with respect to any parameter has the same shape as that parameter. A numeric check with W = [[1, 0], [2, 3]], x = [1, 2] and upstream dL/dh = [2, 1]:</p>'+
     '<div class="m">dL/dx = W^T . dL/dh = [4, 3]       (shape 2)\ndL/dW = dL/dh . x^T = [[2, 4], [1, 2]]   (shape 2 × 2, like W)</div>'+
     '<p>Common mistake: a gradient with the wrong shape usually means a missing transpose. Check shapes before values.</p>'),
 q:[
   CQ("إيه الـ Jacobian لـ h = W x بالنسبة لـ x؟","What is the Jacobian of h = W x with respect to x?",
      [["W","W"],["W^T","W^T"],["x","x"],["b","b"]],
      0,"dh_i/dx_j = W_ij، يعني الـ Jacobian هو W نفسها.","dh_i/dx_j = W_ij, so the Jacobian is W itself."),
   CQ("لو W شكلها 3 × 4، شكل dL/dW يبقى كام؟","If W has shape 3 × 4, what is the shape of dL/dW?",
      [["3 × 4","3 × 4"],["4 × 3","4 × 3"],["3 × 3","3 × 3"],["4 × 4","4 × 4"]],
      0,"الـ gradient بيبقى له نفس شكل الـ parameter.","The gradient has the same shape as the parameter."),
   CQ('W شكلها 5 × 3 و X (8 أمثلة في أعمدة) شكلها 3 × 8، و Z = W X. إيه شكل Z وشكل dL/dW؟','W has shape 5 × 3 and X (8 examples as columns) has shape 3 × 8, with Z = W X. What are the shapes of Z and dL/dW?',
      [['Z: 5 × 8، و dL/dW: 5 × 3','Z: 5 × 8, dL/dW: 5 × 3'],['Z: 3 × 8، و dL/dW: 3 × 5','Z: 3 × 8, dL/dW: 3 × 5'],['Z: 5 × 8، و dL/dW: 5 × 8','Z: 5 × 8, dL/dW: 5 × 8'],['Z: 8 × 5، و dL/dW: 3 × 5','Z: 8 × 5, dL/dW: 3 × 5']],
      0,'Z = (5×3)(3×8) = 5×8. و dL/dW = dL/dZ X^T = (5×8)(8×3) = 5×3، نفس شكل W.','Z = (5×3)(3×8) = 5×8, and dL/dW = dL/dZ X^T = (5×8)(8×3) = 5×3, the same shape as W.')
 ],
 f:[
   CF("إيه هو الـ Jacobian؟","What is a Jacobian?",
      "مصفوفة مشتقات كل ناتج بالنسبة لكل مدخل. لـ h = W x هي W نفسها.","A matrix of the derivatives of every output with respect to every input. For h = W x it is W itself."),
   CF("إيه قاعدة الشكل للـ gradients؟","What is the shape rule for gradients?",
      "gradient الـ loss بالنسبة لأي parameter له نفس شكل الـ parameter.","The gradient of the loss with respect to any parameter has the same shape as that parameter.")
 ],
 terms:[
   {t:B("Jacobian","Jacobian"),
    d:B("مصفوفة مشتقات كل ناتج بالنسبة لكل مدخل. لـ <code>h = W x</code> هي W.","A matrix of the derivatives of every output with respect to every input. For <code>h = W x</code> it is W.")},
   {t:B("Shape rule","Shape rule"),
    d:B("الـ gradient بيبقى له نفس شكل الـ parameter اللي بنشتق بالنسبة له.","The gradient has the same shape as the parameter it is taken with respect to.")}
 ]},

{id:"l3-backprop",t:B("Backprop: upstream × local","Backprop: upstream × local"),
 b:cat(B('<p>في backprop كل عقدة بتعمل حاجة بسيطة: بتستقبل <mark>upstream gradient</mark> (اللي جاي من ناحية الـ loss) وبتضربه في <mark>local gradient</mark> (مشتقة العملية بتاعتها هي)، وتبعت الناتج لورا.</p>'+
     '<div class="m">downstream = upstream * local</div>'+
     '<p>مثال بأرقام: <code>a = x * w</code> بـ x = 3 و w = 2، فـ a = 6. لو الـ upstream gradient على a هو 5:</p>'+
     '<div class="m">dL/dw = 5 * x = 15\ndL/dx = 5 * w = 10</div>'+
     '<p>قاعدة سريعة: عملية الضرب بتبدّل، يعني gradient كل مدخل = upstream × المدخل التاني. وعملية الجمع بتوزّع الـ upstream زي ما هو على المدخلين.</p>',
     '<p>In backprop every node does something simple: it receives an <mark>upstream gradient</mark> (coming from the loss side), multiplies it by its <mark>local gradient</mark> (the derivative of its own operation), and passes the result backward.</p>'+
     '<div class="m">downstream = upstream * local</div>'+
     '<p>A numeric example: <code>a = x * w</code> with x = 3 and w = 2, so a = 6. If the upstream gradient on a is 5:</p>'+
     '<div class="m">dL/dw = 5 * x = 15\ndL/dx = 5 * w = 10</div>'+
     '<p>A quick rule: a multiply node swaps, so each input\'s gradient = upstream × the other input. An add node copies the upstream gradient unchanged to both inputs.</p>'),
       B('<p>غلطة شائعة: لو قيمة بتدخل في عمليتين، الـ gradients بتاعتها من المسارين <mark>بتتجمع</mark> مش بتتضرب. مثلًا x داخلة في <code>a = x * w</code> (upstream = 5 و w = 2) وفي <code>b = x + 2</code> (upstream = 1):</p><div class="m">dL/dx = 5 * 2 + 1 * 1 = 11</div>',
  '<p>Common mistake: if a value feeds into two operations, its gradients from the two paths are <mark>added</mark>, not multiplied. For example x feeds into <code>a = x * w</code> (upstream = 5, w = 2) and into <code>b = x + 2</code> (upstream = 1):</p><div class="m">dL/dx = 5 * 2 + 1 * 1 = 11</div>')),
 q:[
   CQ("لو a = x * w و x = 4 و w = 3، والـ upstream gradient على a هو 2، كام dL/dw؟","If a = x * w with x = 4 and w = 3, and the upstream gradient on a is 2, what is dL/dw?",
      [["8","8"],["6","6"],["12","12"],["2","2"]],
      0,"dL/dw = upstream × x = 2 × 4 = 8.","dL/dw = upstream × x = 2 × 4 = 8."),
   CQ("x داخلة في a = x * w (upstream = 5 و w = 2) وفي b = x + 2 (upstream = 3). كام dL/dx؟","x feeds into a = x * w (upstream = 5, w = 2) and into b = x + 2 (upstream = 3). What is dL/dx?",
   [["13","13"],["10","10"],["30","30"],["8","8"]],
   0,"المسار الأول: 5 × 2 = 10، والتاني: 3 × 1 = 3، وبنجمعهم: 13.","Path one: 5 × 2 = 10; path two: 3 × 1 = 3; we add them: 13.")
 ],
 f:[
   CF("إيه قاعدة الـ backprop عند كل عقدة؟","What is the backprop rule at each node?",
      "downstream = upstream × local. وعقدة الضرب بتبدّل المدخلين، وعقدة الجمع بتوزّع الـ upstream زي ما هو.","downstream = upstream × local. A multiply node swaps its inputs; an add node passes the upstream gradient unchanged."),
   CF("لو قيمة بتدخل في عمليتين، إيه اللي بيحصل للـ gradients؟","When a value feeds into two operations, what happens to its gradients?",
   "بتتجمع (+) من المسارين، مش بتتضرب.","They are summed (+) over the two paths, not multiplied.")
 ],
 terms:[
   {t:B("Backpropagation","Backpropagation"),
 d:B("حساب gradient كل وزن بالـ chain rule، بنرجع من الـ loss لورا عقدة عقدة.","Computing the gradient of every weight with the chain rule, going from the loss backward node by node.")},
{t:B("Upstream gradient","Upstream gradient"),
 d:B("الـ gradient اللي جاي للعقدة من ناحية الـ loss.","The gradient arriving at a node from the loss side.")},
{t:B("Local gradient","Local gradient"),
 d:B("مشتقة عملية العقدة نفسها بالنسبة لمدخلاتها.","The derivative of the node's own operation with respect to its inputs.")}
 ]},

{id:"l3-backprop-net",t:B("Backprop على شبكة بطبقتين (بأرقام)","Backprop on a two-layer network (with numbers)"),
 b:cat(B('<p>شبكة صغيرة: x = [1, 2]، و<code>z = W1 x</code>، و<code>h = ReLU(z)</code>، و<code>y = w2 . h</code>، والـ loss هو <code>L = ½ (y - t)²</code> بـ t = 1. خد W1 = [[1, -1], [2, 0]] و w2 = [3, 1].</p>'+
         '<div class="m">forward:  z = [-1, 2]   h = [0, 2]   y = 2   L = 0.5</div>',
         '<p>A tiny network: x = [1, 2], <code>z = W1 x</code>, <code>h = ReLU(z)</code>, <code>y = w2 . h</code>, and the loss <code>L = ½ (y - t)²</code> with t = 1. Take W1 = [[1, -1], [2, 0]] and w2 = [3, 1].</p>'+
         '<div class="m">forward:  z = [-1, 2]   h = [0, 2]   y = 2   L = 0.5</div>'),
       FIG_NET,
       B('<p>وبنرجع خطوة خطوة (كل خطوة = upstream × local، والرمز ⊙ معناه ضرب عنصر في عنصر):</p>'+
         '<div class="m">dL/dy = y - t = 1\ndL/dw2 = 1 * h = [0, 2]\ndL/dh = 1 * w2 = [3, 1]\ndL/dz = [3, 1] ⊙ ReLU\'(z) = [0, 1]\ndL/dW1 = dL/dz . x^T = [[0, 0], [1, 2]]</div>'+
         '<p>لاحظ إن z1 كانت سالبة، فـ ReLU قفلت الـ gradient بتاعها: الـ neuron الأول ما بياخدش update من المثال ده.</p>',
         '<p>Now backward, one step at a time (each step is upstream × local, and ⊙ means element-wise product):</p>'+
         '<div class="m">dL/dy = y - t = 1\ndL/dw2 = 1 * h = [0, 2]\ndL/dh = 1 * w2 = [3, 1]\ndL/dz = [3, 1] ⊙ ReLU\'(z) = [0, 1]\ndL/dW1 = dL/dz . x^T = [[0, 0], [1, 2]]</div>'+
         '<p>Notice that z1 was negative, so ReLU blocked its gradient: the first neuron gets no update from this example.</p>')),
 q:[
   CQ("ليه الـ neuron الأول ما خدش update في المثال؟","Why did the first neuron get no update in the example?",
      [["z1 سالبة فـ ReLU'(z1) = 0","z1 is negative so ReLU'(z1) = 0"],["الـ loss بيساوي صفر","The loss is zero"],["w2 صغيرة","w2 is small"],["لأنه أول neuron","Because it is the first neuron"]],
      0,"ReLU بتقفل الـ gradient لما z تكون سالبة.","ReLU blocks the gradient when z is negative."),
   CQ("لو غيّرنا الهدف لـ t = 3 (والباقي زي ما هو)، كام dL/dy؟","If we change the target to t = 3 (everything else the same), what is dL/dy?",
      [["-1","-1"],["1","1"],["2","2"],["0.5","0.5"]],
      0,"dL/dy = y - t = 2 - 3 = -1.","dL/dy = y - t = 2 - 3 = -1.")
 ],
 f:[
   CF("إيه خطوات الـ backward في الشبكة دي؟","What are the backward steps in this network?",
      "dL/dy = y - t، وبعدين dL/dh = dL/dy * w2، وبعدين نضرب في ReLU'(z)، وفي الآخر dL/dW1 = dL/dz . x^T.","dL/dy = y - t, then dL/dh = dL/dy * w2, then multiply by ReLU'(z), and finally dL/dW1 = dL/dz . x^T."),
   CF("إيه هي ReLU'(z)؟","What is ReLU'(z)?",
      "1 لو z موجبة، و0 لو z سالبة. يعني بتقفل الـ gradient للـ neurons السالبة.","1 if z is positive and 0 if z is negative, so it blocks the gradient of negative neurons.")
 ],
 terms:[
   {t:B("Element-wise product","Element-wise product"),
 d:B("ضرب عنصر في عنصر بنفس الموضع في vectorين. الرمز ⊙ (أو <code>*</code> في الكود).","Multiplying two vectors position by position. Written ⊙ (or <code>*</code> in code).")},
   {t:B("Dead ReLU","Dead ReLU"),
    d:B("neuron بتفضل z بتاعته سالبة، فالـ gradient بتاعها 0 وبتوقف تتعلم.","A neuron whose z stays negative, so its gradient is 0 and it stops learning.")}
 ]},

{id:"l3-training",t:B("حلقة التدريب والـ optimizers","The training loop and optimizers"),
 b:cat(B('<p>التدريب كله حلقة واحدة بتتكرر:</p>'+
         '<div class="m">1. forward: compute the loss\n2. backward: compute gradients\n3. update: theta = theta - lr * gradient</div>'+
         '<p><code>lr</code> هو الـ <mark>learning rate</mark>. لو كبير أوي الـ loss بيتذبذب، ولو صغير أوي التدريب بطيء. وبنستخدم <mark>mini-batches</mark> صغيرة بدل كل البيانات في كل خطوة (ده هو SGD).</p>',
         '<p>All of training is one loop that repeats:</p>'+
         '<div class="m">1. forward: compute the loss\n2. backward: compute gradients\n3. update: theta = theta - lr * gradient</div>'+
         '<p><code>lr</code> is the <mark>learning rate</mark>. If it is too big the loss oscillates; if it is too small training is slow. We use small <mark>mini-batches</mark> instead of all the data at each step (that is SGD).</p>'),
       FIG_OPT,
       B('<p>الـ <mark>Momentum</mark> بيحتفظ بمجموع متناقص للـ gradients اللي فاتت، فالخطوات في الاتجاه الثابت بتسرع والذبذبة بتتلغي. والـ <mark>Adam</mark> بيدي كل parameter حجم خطوة خاص بيه: لو الـ gradients الأخيرة بتاعته كبيرة الخطوة بتصغر. مثال بـ lr = 0.1 و theta = 2 وgradient ثابت = 4:</p>'+
         '<div class="m">momentum: v = 0.9 * v + gradient;  theta = theta - lr * v\nSGD:      2 -> 1.6 -> 1.2\nmomentum: 2 -> 1.6 -> 0.84</div>'+
         '<p>غلطة شائعة: نستخدم نفس الـ lr مع SGD وAdam. الـ Adam غالبًا بيحتاج lr أصغر بكتير (حوالي 0.001).</p>',
         '<p><mark>Momentum</mark> keeps a decaying sum of past gradients, so steps in a consistent direction speed up and zig-zags cancel out. <mark>Adam</mark> also gives each parameter its own step size: when its recent gradients are large, its steps get smaller. Example with lr = 0.1, theta = 2 and a constant gradient of 4:</p>'+
         '<div class="m">momentum: v = 0.9 * v + gradient;  theta = theta - lr * v\nSGD:      2 -> 1.6 -> 1.2\nmomentum: 2 -> 1.6 -> 0.84</div>'+
         '<p>Common mistake: using the same lr for SGD and Adam. Adam usually needs a much smaller one (around 0.001).</p>')),
 q:[
   CQ("إيه فايدة الـ momentum؟","What is momentum good for?",
      [["بيمسّح الذبذبة ويسرّع الحركة في الاتجاه الثابت","It smooths oscillation and speeds up movement in a consistent direction"],["بيحذف الـ mini-batches","It removes the mini-batches"],["بيعمل gradient check","It performs a gradient check"],["بيخلي الـ learning rate صفر","It sets the learning rate to zero"]],
      0,"بيحتفظ بمجموع الـ gradients اللي فاتت، فالاتجاه الثابت بيتقوّى والذبذبة بتتلاشى.","It keeps a sum of past gradients, so a consistent direction is reinforced and oscillation fades."),
   CQ("SGD بـ lr = 0.1، و theta = 2 والـ gradient = 4. كام theta بعد الخطوة؟","SGD with lr = 0.1, theta = 2 and gradient = 4. What is theta after the step?",
      [["1.6","1.6"],["2.4","2.4"],["0.4","0.4"],["-2","-2"]],
      0,"theta = 2 - 0.1 × 4 = 1.6.","theta = 2 - 0.1 × 4 = 1.6.")
 ],
 f:[
   CF("إيه خطوات حلقة التدريب؟","What are the steps of the training loop?",
      "forward لحساب الـ loss، وbackward لحساب الـ gradients، وupdate: theta = theta - lr * gradient.","forward to compute the loss, backward to compute the gradients, and update: theta = theta - lr * gradient."),
   CF("إيه الفرق بين SGD والـ momentum والـ Adam؟","What is the difference between SGD, momentum and Adam?",
      "SGD بيمشي عكس الـ gradient الحالي بس. الـ momentum بيحتفظ بمجموع الـ gradients اللي فاتت. والـ Adam بيضيف حجم خطوة لكل parameter.","SGD only follows the current gradient. Momentum keeps a sum of past gradients. Adam adds a step size per parameter.")
 ],
 terms:[
   {t:B("Learning rate","Learning rate"),
    d:B("حجم خطوة التحديث: <code>theta = theta - lr * gradient</code>.","The size of the update step: <code>theta = theta - lr * gradient</code>.")},
   {t:B("Mini-batch","Mini-batch"),
    d:B("مجموعة صغيرة من البيانات بنحسب عليها الـ gradient في كل خطوة.","A small group of examples used to compute the gradient at each step.")},
   {t:B("SGD","SGD"),
    d:B("Stochastic gradient descent: تحديث الأوزان بـ gradient محسوب على mini-batch.","Stochastic gradient descent: updating the weights with a gradient computed on a mini-batch.")},
   {t:B("Momentum","Momentum"),
    d:B("بيحتفظ بمجموع متناقص للـ gradients اللي فاتت علشان يمسّح الذبذبة ويسرّع.","Keeps a decaying sum of past gradients to smooth oscillation and speed up.")},
   {t:B("Adam","Adam"),
    d:B("optimizer بيجمع momentum مع حجم خطوة مختلف لكل parameter.","An optimizer that combines momentum with a separate step size for each parameter.")}
 ]},

{id:"l3-gradcheck",t:B("فحص الـ gradient","Gradient checking"),
 b:B('<p>الفكرة: المشتقة هي ميل (slope)، فبنحرّك x حركة صغيرة في الاتجاهين ونقيس f اتغيرت قد إيه.</p>'+
     '<p>ولو عايز تتأكد إنك كتبت backprop صح، بتعمل <mark>gradient check</mark>: بتقارن الـ gradient بتاعك بتقدير رقمي:</p>'+
     '<div class="m">(f(x + h) - f(x - h)) / (2h)</div>'+
     '<p>الفحص ده بطيء، فبنستخدمه للتأكد بس، مش أثناء التدريب.</p>'+
     '<p>مثال: لـ <code>f(x) = x²</code> عند x = 3 و h = 0.01:</p>'+
     '<div class="m">(3.01² - 2.99²) / 0.02 = (9.0601 - 8.9401) / 0.02 = 6</div>'+
     '<p>وده بيطابق الـ gradient التحليلي 2x = 6. لو الرقمين اختلفوا، غالبًا السبب transpose ناقص، أو حد ناقص لما قيمة بتتستخدم مرتين، أو علامة غلط. غلطة شائعة: نسيب الفحص شغال أثناء التدريب، وهو محتاج forward pass مرتين لكل parameter.</p>',
     '<p>The idea: a derivative is a slope, so we nudge x a tiny bit in both directions and measure how much f changes.</p>'+
     '<p>To check that your backprop is correct, do a <mark>gradient check</mark>: compare your gradient with a numerical estimate:</p>'+
     '<div class="m">(f(x + h) - f(x - h)) / (2h)</div>'+
     '<p>This check is slow, so we use it only for verification, not during training.</p>'+
     '<p>Example: for <code>f(x) = x²</code> at x = 3 with h = 0.01:</p>'+
     '<div class="m">(3.01² - 2.99²) / 0.02 = (9.0601 - 8.9401) / 0.02 = 6</div>'+
     '<p>That matches the analytic gradient 2x = 6. If the two numbers disagree, the usual suspects are a missing transpose, a missing term where a value is used twice, or a wrong sign. Common mistake: leaving the check on during training, when it needs two forward passes for every single parameter.</p>'),
 q:[
   CQ("ليه بنعمل gradient check؟","Why do we do a gradient check?",
      [["عشان نتأكد إن الـ backprop مكتوب صح","To verify the backprop code is correct"],["عشان نسرّع التدريب","To speed up training"],["عشان نزود الـ learning rate","To raise the learning rate"],["عشان نحذف طبقات","To remove layers"]],
      0,"بنقارن الـ gradient التحليلي بتقدير رقمي للتأكد إن مفيش غلطة.","We compare the analytic gradient to a numerical estimate to catch mistakes."),
   CQ("لـ f(x) = x² عند x = 2 و h = 0.1، كام التقدير الرقمي للـ gradient؟","For f(x) = x² at x = 2 and h = 0.1, what is the numerical gradient estimate?",
      [["4","4"],["2","2"],["0.8","0.8"],["8","8"]],
      0,"(2.1² - 1.9²) / 0.2 = (4.41 - 3.61) / 0.2 = 4.","(2.1² - 1.9²) / 0.2 = (4.41 - 3.61) / 0.2 = 4.")
 ],
 f:[
   CF("إيه هو الـ gradient check ومتى بنستخدمه؟","What is a gradient check and when do we use it?",
      "مقارنة الـ gradient بتاعنا بتقدير رقمي (f(x+h)-f(x-h))/2h. بنستخدمه للتأكد بس لأنه بطيء.","Comparing our gradient with a numerical estimate (f(x+h)-f(x-h))/2h. We use it only for verification because it is slow."),
   CF("لو الـ gradient check فشل، إيه الأسباب المحتملة؟","If a gradient check fails, what are the likely causes?",
      "transpose ناقص، أو حد ناقص لما قيمة بتتستخدم مرتين، أو علامة غلط.","A missing transpose, a missing term where a value is used twice, or a wrong sign.")
 ],
 terms:[
   {t:B("Gradient check","Gradient check"),
    d:B("مقارنة الـ gradient بتاع backprop بتقدير رقمي <code>(f(x+h) - f(x-h)) / 2h</code>. بطيء، فللتأكد بس.","Comparing the backprop gradient with a numerical estimate <code>(f(x+h) - f(x-h)) / 2h</code>. Slow, so for verification only.")}
 ]},

{id:"l3-code-gradcheck",
 t:B('كود: backprop يدوي و gradient check بـ NumPy','Code: manual backprop and gradient check in NumPy'),
 b:cat(
   B('<p>الـ backprop اليدوي سهل يغلط، فبنقارنه بإجابة مستقلة من الـ <mark>finite differences</mark>. شبكة بطبقتين (ReLU وsoftmax) وشكل كل tensor في التعليقات:</p>',
     '<p>Hand-written backprop is easy to get wrong, so we compare it with <mark>finite differences</mark>. Two-layer net (ReLU, softmax), shapes in comments:</p>'),
   B('<div class="m">import numpy as np\ndef fwd(W1, W2, X, y):  # X:(d,N)\n    Z = W1 @ X            # (h,N)\n    H = np.maximum(0, Z)\n    S = W2 @ H            # (C,N)\n    E = np.exp(S - S.max(0))\n    Q = E / E.sum(0)      # (C,N)\n    L = -np.log(Q[y, range(len(y))]).mean()\n    return L, (X, Z, H, Q)\ndef bwd(W1, W2, y, c):\n    X, Z, H, Q = c\n    dS = Q.copy()         # (C,N)\n    dS[y, range(len(y))] -= 1\n    dS /= len(y)\n    dW2 = dS @ H.T        # (C,h)\n    dZ = (W2.T @ dS) * (Z &gt; 0)  # (h,N)\n    return dZ @ X.T, dW2  # (h,d), (C,h)\ndef numgrad(f, W, e=1e-5):\n    G = np.zeros_like(W)\n    for i in np.ndindex(*W.shape):\n        w = W[i]; W[i] = w + e\n        Lp = f(); W[i] = w - e\n        Lm = f(); W[i] = w\n        G[i] = (Lp - Lm) / (2 * e)\n    return G\nn = np.linalg.norm\nrel = lambda a, b: n(a-b) / (n(a)+n(b))\nrng = np.random.default_rng(0)\nX = rng.normal(size=(4, 6))\ny = rng.integers(0, 3, 6)\nW1 = rng.normal(size=(5, 4))\nW2 = rng.normal(size=(3, 5))\nf = lambda: fwd(W1, W2, X, y)[0]\nc = fwd(W1, W2, X, y)[1]\ng1, g2 = bwd(W1, W2, y, c)\nprint(\'W1 rel = %.1e\' % rel(g1, numgrad(f, W1)))\nprint(\'W2 rel = %.1e\' % rel(g2, numgrad(f, W2)))</div>',
     '<div class="m">import numpy as np\ndef fwd(W1, W2, X, y):  # X:(d,N)\n    Z = W1 @ X            # (h,N)\n    H = np.maximum(0, Z)\n    S = W2 @ H            # (C,N)\n    E = np.exp(S - S.max(0))\n    Q = E / E.sum(0)      # (C,N)\n    L = -np.log(Q[y, range(len(y))]).mean()\n    return L, (X, Z, H, Q)\ndef bwd(W1, W2, y, c):\n    X, Z, H, Q = c\n    dS = Q.copy()         # (C,N)\n    dS[y, range(len(y))] -= 1\n    dS /= len(y)\n    dW2 = dS @ H.T        # (C,h)\n    dZ = (W2.T @ dS) * (Z &gt; 0)  # (h,N)\n    return dZ @ X.T, dW2  # (h,d), (C,h)\ndef numgrad(f, W, e=1e-5):\n    G = np.zeros_like(W)\n    for i in np.ndindex(*W.shape):\n        w = W[i]; W[i] = w + e\n        Lp = f(); W[i] = w - e\n        Lm = f(); W[i] = w\n        G[i] = (Lp - Lm) / (2 * e)\n    return G\nn = np.linalg.norm\nrel = lambda a, b: n(a-b) / (n(a)+n(b))\nrng = np.random.default_rng(0)\nX = rng.normal(size=(4, 6))\ny = rng.integers(0, 3, 6)\nW1 = rng.normal(size=(5, 4))\nW2 = rng.normal(size=(3, 5))\nf = lambda: fwd(W1, W2, X, y)[0]\nc = fwd(W1, W2, X, y)[1]\ng1, g2 = bwd(W1, W2, y, c)\nprint(\'W1 rel = %.1e\' % rel(g1, numgrad(f, W1)))\nprint(\'W2 rel = %.1e\' % rel(g2, numgrad(f, W2)))</div>'),
   B('<p>اقرا الـ <mark>relative error</mark> <code>rel = ||a-b|| / (||a|| + ||b||)</code>. قاعدة تقريبية: أقل من 1e-7 ممتاز، من 1e-4 لـ 1e-2 مشبوه، وأكتر من 1e-2 يبقى bug.</p>',
     '<p>Read the <mark>relative error</mark> <code>rel = ||a-b|| / (||a|| + ||b||)</code>. Rough guide: below 1e-7 is great, 1e-4 to 1e-2 is suspicious, above 1e-2 is a bug.</p>'),
   B('<div class="m">W1 rel = 2.5e-11\nW2 rel = 3.2e-11\n# no dS /= N: rel = 0.71</div>',
     '<div class="m">W1 rel = 2.5e-11\nW2 rel = 3.2e-11\n# no dS /= N: rel = 0.71</div>'),
   FIG_RELERR,
   B('<p>غلطة شائعة: float32 أو h غلط. استخدم float64 و h حوالي 1e-5.</p>',
     '<p>Common mistake: float32 or a bad h. Use float64 and h near 1e-5.</p>')),
 q:[
   CQ('إيه الـ relative error اللي يدل إن الـ backward صح (float64)؟','Which relative error suggests the backward pass is correct (float64)?',
      [['1e-9','1e-9'],['1e-2','1e-2'],['0.3','0.3'],['1','1']],
      0,'الأقل من 1e-7 معناه إن الـ gradient التحليلي والرقمي متطابقين تقريبًا.','Below 1e-7 means the analytic and numerical gradients agree almost exactly.'),
   CQ('الـ gradient التحليلي a = [3, 4] والرقمي b = [3, 4.1]. كام الـ rel = ||a-b|| / (||a|| + ||b||)؟','The analytic gradient is a = [3, 4] and the numerical one is b = [3, 4.1]. What is rel = ||a-b|| / (||a|| + ||b||)?',
      [['0.0992','0.0992'],['0.0099','0.0099'],['0.0010','0.0010'],['0.1','0.1']],
      1,'||a-b|| = 0.1 و ||a|| + ||b|| ≈ 10.08، يعني rel ≈ 0.0099، وده في منطقة المشبوه فلازم تدور على غلطة.','||a-b|| = 0.1 and ||a|| + ||b|| is about 10.08, so rel is about 0.0099: in the suspicious zone, so look for a bug.')
 ],
 f:[
   CF('إزاي بتقرا نتيجة الـ gradient check؟','How do you read the result of a gradient check?',
      'بتحسب rel = ||a-b|| / (||a|| + ||b||). أقل من 1e-7 ممتاز، وأكتر من 1e-2 يبقى فيه bug.','Compute rel = ||a-b|| / (||a|| + ||b||). Below 1e-7 is great and above 1e-2 means a bug.'),
   CF('إيه shape الـ gradient لـ W1 في الكود (h=5، d=4)؟','What is the shape of the W1 gradient in the code (h=5, d=4)?',
      'نفس شكل W1: (5, 4)، لأن dZ @ X.T هو (h,N) @ (N,d).','The same as W1: (5, 4), because dZ @ X.T is (h,N) @ (N,d).')
 ],
 terms:[
   {t:B('Finite differences','Finite differences'),
    d:B('تقدير المشتقة بالفرق بين قيمتين متقاربتين: <code>(f(x+h) - f(x-h)) / 2h</code>.','Estimating a derivative from two nearby values: <code>(f(x+h) - f(x-h)) / 2h</code>.')},
   {t:B('Relative error','Relative error'),
    d:B('مقياس لحجم الفرق بين gradientين نسبةً لحجمهم: <code>||a-b|| / (||a|| + ||b||)</code>.','The size of the difference between two gradients relative to their size: <code>||a-b|| / (||a|| + ||b||)</code>.')}
 ]},

{id:"l3-init",t:B("الـ Initialization: ليه مش أصفار","Initialization: why not zeros"),
 b:B('<p>قبل التدريب لازم نختار قيم البداية للأوزان. لو كلها متساوية (زي الأصفار) كل neuron في الطبقة هيحسب نفس الحاجة وياخد نفس الـ gradient، فيفضلوا متطابقين للأبد. الحل إننا نبدأ بـ <mark>قيم عشوائية صغيرة</mark> علشان نكسر الـ symmetry.</p>'+
     '<p>بس العشوائي لوحده مش كفاية، الحجم مهم: لو كبير أوي الـ activations بتنفجر، ولو صغير أوي بتصغر طبقة ورا طبقة لحد ما تقرب من صفر. الـ <mark>Xavier initialization</mark> بيختار الحجم من أبعاد الطبقة علشان الإشارة تفضل ثابتة تقريبًا:</p>'+
     '<div class="m">Var(W) = 2 / (n_in + n_out)\nW ~ Uniform(-r, r),  r = sqrt(6 / (n_in + n_out))</div>'+
     '<p>مثال: طبقة n_in = 300 و n_out = 100، يبقى r = sqrt(6 / 400) ≈ 0.12، فالأوزان بتبدأ بين -0.12 و0.12. الـ biases ممكن تبدأ بصفر. (مع ReLU بيتستخدم غالبًا variant اسمه He initialization.)</p>',
     '<p>Before training we must pick starting values for the weights. If they are all equal (for example zeros), every neuron in a layer computes the same thing and gets the same gradient, so they stay identical forever. The fix is to start from <mark>small random values</mark> to break this symmetry.</p>'+
     '<p>But random alone is not enough, the scale matters: too large and the activations blow up; too small and they shrink layer after layer toward zero. <mark>Xavier initialization</mark> picks the scale from the layer sizes so the signal stays roughly stable:</p>'+
     '<div class="m">Var(W) = 2 / (n_in + n_out)\nW ~ Uniform(-r, r),  r = sqrt(6 / (n_in + n_out))</div>'+
     '<p>Example: a layer with n_in = 300 and n_out = 100 gives r = sqrt(6 / 400) ≈ 0.12, so weights start between -0.12 and 0.12. Biases can start at zero. (With ReLU, a variant called He initialization is common.)</p>'),
 q:[
   CQ("ليه مينفعش نبدأ كل الأوزان بأصفار؟","Why can we not start all the weights at zero?",
      [["كل الـ neurons في الطبقة هتتعلم نفس الحاجة","Every neuron in a layer would learn the same thing"],["الـ loss هيبقى صفر دايمًا","The loss would always be zero"],["الـ softmax مش هيشتغل","The softmax would not work"],["التدريب هيبقى أسرع","Training would be faster"]],
      0,"التماثل (symmetry) بيخلي كل الـ neurons ياخدوا نفس الـ gradient ويفضلوا متطابقين.","The symmetry gives every neuron the same gradient, so they stay identical."),
   CQ("طبقة n_in = 50 و n_out = 50، كام Var(W) بـ Xavier؟","A layer with n_in = 50 and n_out = 50: what is Var(W) under Xavier?",
      [["0.02","0.02"],["0.01","0.01"],["0.04","0.04"],["2","2"]],
      0,"2 / (50 + 50) = 0.02.","2 / (50 + 50) = 0.02.")
 ],
 f:[
   CF("إيه هو الـ Xavier initialization؟","What is Xavier initialization?",
      "Var(W) = 2 / (n_in + n_out)، علشان حجم الإشارة يفضل ثابت تقريبًا بين الطبقات.","Var(W) = 2 / (n_in + n_out), so the scale of the signal stays roughly stable between layers."),
   CF("ليه بنبدأ الأوزان عشوائي؟","Why do we start the weights at random?",
      "علشان نكسر الـ symmetry: لو كلها متساوية كل الـ neurons هتتعلم نفس الحاجة.","To break the symmetry: if they were all equal, every neuron would learn the same thing.")
 ],
 terms:[
   {t:B("Xavier initialization","Xavier initialization"),
    d:B("بداية الأوزان بحجم مبني على أبعاد الطبقة: <code>Var(W) = 2 / (n_in + n_out)</code>.","Starting the weights at a scale based on the layer sizes: <code>Var(W) = 2 / (n_in + n_out)</code>.")},
   {t:B("Symmetry breaking","Symmetry breaking"),
    d:B("البداية بأوزان عشوائية علشان الـ neurons في الطبقة ما تفضلش متطابقة.","Starting from random weights so the neurons in a layer do not stay identical.")}
 ]},

{id:"l3-regularization",t:B("الـ Regularization: L2 و dropout","Regularization: L2 and dropout"),
 b:cat(B('<p>الشبكة الكبيرة ممكن تعمل <mark>overfitting</mark>: تحفظ بيانات التدريب وتغلط في بيانات جديدة. الـ <mark>regularization</mark> بيحارب ده. أشهر أداتين:</p>'+
         '<p><mark>L2 / weight decay</mark> بيضيف للـ loss عقوبة على الأوزان الكبيرة، فالأوزان بتفضل صغيرة:</p>'+
         '<div class="m">L_total = L + (lambda / 2) * sum(w^2)\nw = w - lr * (gradient + lambda * w)</div>',
         '<p>A big network can <mark>overfit</mark>: it memorizes the training set and does badly on new data. <mark>Regularization</mark> fights this. Two common tools:</p>'+
         '<p><mark>L2 / weight decay</mark> adds a penalty on large weights to the loss, so the weights stay small:</p>'+
         '<div class="m">L_total = L + (lambda / 2) * sum(w^2)\nw = w - lr * (gradient + lambda * w)</div>'),
       FIG_DROP,
       B('<p><mark>Dropout</mark> بيصفّر ناتج كل neuron باحتمال p وقت التدريب بس، فمفيش neuron يعتمد على neuron معين. مثال بـ p = 0.5: نص الـ neurons تقريبًا بيتصفّر في كل خطوة، والباقيين بيتضربوا في 1/(1-p) = 2 علشان المتوسط يفضل زي ما هو. وقت الـ test الـ dropout بيتقفل وكل الـ neurons بتشتغل.</p>'+
         '<p>غلطة شائعة: نسيب الـ dropout شغال وقت الـ test، فالتوقعات بتبقى مش ثابتة.</p>',
         '<p><mark>Dropout</mark> sets each neuron\'s output to zero with probability p, during training only, so no neuron can rely on one specific partner. Example with p = 0.5: about half the neurons are zeroed at each step, and the kept ones are multiplied by 1/(1-p) = 2 so the expected value stays the same. At test time dropout is turned off and all neurons are used.</p>'+
         '<p>Common mistake: leaving dropout on at test time, which makes the predictions noisy.</p>')),
 q:[
   CQ("إيه اللي بيحصل للـ dropout وقت الـ test؟","What happens to dropout at test time?",
      [["بيتقفل وكل الـ neurons بتشتغل","It is turned off and all neurons are used"],["بيصفّر نص الـ neurons","It zeroes half of the neurons"],["بيزود p","It increases p"],["بيتكرر مرتين","It is repeated twice"]],
      0,"الـ dropout للتدريب بس، وقت الـ test بنستخدم الشبكة كاملة.","Dropout is for training only; at test time we use the whole network."),
   CQ("w = 4 و lr = 0.1 و lambda = 0.5، والـ gradient بتاع الـ loss = 0. كام w بعد خطوة weight decay؟","w = 4, lr = 0.1, lambda = 0.5 and the loss gradient is 0. What is w after one weight-decay step?",
      [["3.8","3.8"],["4.2","4.2"],["3.6","3.6"],["0.2","0.2"]],
      0,"w = 4 - 0.1 × (0 + 0.5 × 4) = 4 - 0.2 = 3.8.","w = 4 - 0.1 × (0 + 0.5 × 4) = 4 - 0.2 = 3.8.")
 ],
 f:[
   CF("إيه هو الـ overfitting وإيه علاجه؟","What is overfitting and how do we fight it?",
      "النموذج بيحفظ بيانات التدريب ويغلط في بيانات جديدة. من الحلول: L2 و dropout.","The model memorizes the training data and does badly on new data. Remedies include L2 and dropout."),
   CF("إزاي بيشتغل الـ dropout؟","How does dropout work?",
      "بيصفّر كل neuron باحتمال p وقت التدريب بس، ووقت الـ test كل الـ neurons شغالة.","It zeroes each neuron with probability p during training only; at test time all neurons are active.")
 ],
 terms:[
   {t:B("Overfitting","Overfitting"),
    d:B("النموذج بيحفظ بيانات التدريب ويغلط في بيانات جديدة.","The model memorizes the training data and does badly on new data.")},
   {t:B("Regularization","Regularization"),
    d:B("أي أسلوب بيقلل الـ overfitting، زي L2 و dropout.","Any technique that reduces overfitting, such as L2 and dropout.")},
   {t:B("L2 / weight decay","L2 / weight decay"),
    d:B("عقوبة على الأوزان الكبيرة: <code>L + (lambda / 2) * sum(w^2)</code>.","A penalty on large weights: <code>L + (lambda / 2) * sum(w^2)</code>.")},
   {t:B("Dropout","Dropout"),
    d:B("تصفير neurons عشوائيًا باحتمال p وقت التدريب بس.","Randomly zeroing neurons with probability p during training only.")}
 ]},

{id:"l3-debug-training",
 t:B('نصايح عملية لو التدريب مش شغال','Practical tips when training does not work'),
 b:cat(
   B('<p>لما التدريب مش شغال متخمنش: جرّب كام فحص رخيص بالترتيب ده.</p>',
     '<p>When training fails, do not guess: run a few cheap checks, in this order.</p>'),
   B('<p><mark>1) اعمل overfit على batch صغير</mark>: درّب على 8 أمثلة بس. الشبكة الصح لازم تحفظهم، والـ loss ينزل لقرب الصفر. لو ما نزلش يبقى فيه bug.</p>',
     '<p><mark>1) Overfit a tiny batch</mark>: train on only 8 examples. A correct network memorizes them and the loss goes close to zero. If it does not, there is a bug.</p>'),
   B('<p><mark>2) الـ loss في الأول</mark>: softmax على V كلمة بأوزان صغيرة بيطلع تقريبًا توزيع منتظم، فالـ loss ≈ <code>log V</code>. مثلًا V = 10,000 يدي 9.21، و V = 50,000 يدي 10.82. لو بدأ أعلى بكتير (زي 30) يبقى الأوزان كبيرة أوي.</p>',
     '<p><mark>2) The initial loss</mark>: a softmax over V words with small weights is close to uniform, so the loss is about <code>log V</code>. For example V = 10,000 gives 9.21 and V = 50,000 gives 10.82. If it starts far above (say 30), the weights are too big.</p>'),
   B('<p><mark>3) الـ shapes</mark>: اطبع shape كل tensor وكل gradient. الـ gradient لازم يطابق شكل الـ parameter.</p>',
     '<p><mark>3) Shapes</mark>: print the shape of every tensor and every gradient. A gradient must match the shape of its parameter.</p>'),
   B('<p><mark>4) الـ learning rate أول حاجة تتغير</mark>: جرّب 1e-1 و1e-2 و1e-3 و1e-4 (كل مرة ÷10). لو الـ loss بيطلع أو بيتذبذب يبقى lr كبير، ولو بيتحرك بالعافية يبقى صغير.</p>',
     '<p><mark>4) The learning rate is the first thing to change</mark>: try 1e-1, 1e-2, 1e-3, 1e-4 (divide by 10 each time). A loss that rises or oscillates means lr is too big; one that barely moves means it is too small.</p>'),
   B('<p><mark>5) الـ gradient norm</mark> لكل طبقة: لو بيصغر ناحية الطبقات الأولى فهو بيختفي (10 طبقات كل واحدة بتضرب في 0.25 تدي 0.25^10 ≈ 9.5e-07)، ولو بيكبر فهو بينفجر (1.5^10 ≈ 57.7، أو الـ loss يطلع inf).</p>',
     '<p><mark>5) The gradient norm</mark> of each layer: if it shrinks toward the first layers it is vanishing (10 layers that each multiply by 0.25 give 0.25^10 ≈ 9.5e-07); if it grows it is exploding (1.5^10 ≈ 57.7, or the loss becomes inf).</p>'),
   B('<p>غلطة شائعة: تدرّب على الداتا كلها قبل ما تتأكد إن الشبكة قادرة تعمل overfit على 8 أمثلة.</p>',
     '<p>Common mistake: training on the full dataset before checking that the network can overfit 8 examples.</p>')),
 q:[
   CQ('درّبت شبكة سليمة على 8 أمثلة بس. المفروض الـ loss يعمل إيه؟','You train a correct network on only 8 examples. What should the loss do?',
      [['ينزل لقرب الصفر','Go close to zero'],['يفضل عند log V','Stay at log V'],['يطلع باستمرار','Keep growing'],['يبقى عشوائي','Stay random']],
      0,'الشبكة بتحفظ عدد صغير من الأمثلة، فلو الـ loss ما نزلش يبقى فيه bug.','The network memorizes a tiny set, so if the loss does not drop there is a bug.'),
   CQ('softmax على V = 1000 كلمة بأوزان صغيرة. كام الـ loss المتوقع في أول خطوة؟','A softmax over V = 1000 words with small weights. What loss do you expect at the first step?',
      [['1000','1000'],['6.91','6.91'],['0.69','0.69'],['3','3']],
      1,'التوزيع تقريبًا منتظم، فالـ loss ≈ log V = log 1000 ≈ 6.91.','The distribution is close to uniform, so the loss ≈ log V = log 1000 ≈ 6.91.')
 ],
 f:[
   CF('إيه الـ loss المتوقع في الأول لـ softmax على V كلمة؟','What initial loss do you expect for a softmax over V words?',
      'تقريبًا log V. مثلًا V = 10,000 يدي 9.21.','About log V. For example V = 10,000 gives 9.21.'),
   CF('الشبكة مش بتتعلم، أول فحص تعمله إيه؟','The network is not learning. What is the first check?',
      'اعمل overfit على batch صغير (حوالي 8 أمثلة): لو الـ loss ما نزلش لقرب الصفر يبقى فيه bug.','Overfit a tiny batch (about 8 examples): if the loss does not go close to zero there is a bug.')
 ],
 terms:[
   {t:B('Overfit-a-batch test','Overfit-a-batch test'),
    d:B('فحص: درّب على batch صغير جدًا. الشبكة السليمة لازم تحفظه والـ loss ينزل لقرب الصفر.','A check: train on a very small batch. A correct network must memorize it and the loss goes close to zero.')},
   {t:B('Initial loss','Initial loss'),
    d:B('الـ loss قبل أي تدريب. لـ softmax على V فئة بأوزان صغيرة بيبقى تقريبًا <code>log V</code>.','The loss before any training. For a softmax over V classes with small weights it is about <code>log V</code>.')},
   {t:B('Gradient norm','Gradient norm'),
    d:B('حجم الـ gradient (norm) لطبقة. بنراقبه علشان نكتشف الاختفاء أو الانفجار.','The size (norm) of a layer\'s gradient. We monitor it to spot vanishing or exploding gradients.')}
 ]},

{id:"l3-recap",t:B("Recap: ملخص المحاضرة","Recap: lecture summary"),
 b:B('<p><mark>5 نقاط:</mark></p>'+
     '<p>1. الـ linear classifier مش بيرسم حدود منحنية، لكن hidden layer مع non-linearity بتقدر.</p>'+
     '<p>2. من غير non-linearity الطبقات المرصوصة بتتجمع في مصفوفة واحدة.</p>'+
     '<p>3. Backprop هو الـ chain rule على الـ computation graph: downstream = upstream × local، والـ gradients بتتجمع لما القيمة بتتستخدم مرتين.</p>'+
     '<p>4. الـ gradient له شكل الـ parameter، وبنتأكد منه بـ gradient check.</p>'+
     '<p>5. بنتدرب بـ mini-batch SGD أو Adam، مع Xavier init وregularization (L2 وdropout).</p>'+
     '<div class="m">h = f(W x + b)\ndownstream = upstream * local\ndL/dW has the same shape as W\ntheta = theta - lr * gradient</div>'+
     '<p><mark>قبل L4</mark> (Dependency Parsing): الـ parser بيختار خطوة بعد خطوة، وأي classifier عصبي بيتحط فيه هو <code>h = f(W x + b)</code> وبعده softmax. تأكد إنك فاهم الاتنين، وفاهم إزاي بيتدرب بالـ cross-entropy والـ gradient descent.</p>',
     '<p><mark>Five points:</mark></p>'+
     '<p>1. A linear classifier cannot draw curved boundaries, but a hidden layer with a non-linearity can.</p>'+
     '<p>2. Without a non-linearity, stacked layers collapse into one matrix.</p>'+
     '<p>3. Backprop is the chain rule on the computation graph: downstream = upstream × local, and gradients add when a value is used twice.</p>'+
     '<p>4. A gradient has the shape of its parameter, and we verify it with a gradient check.</p>'+
     '<p>5. We train with mini-batch SGD or Adam, with Xavier init and regularization (L2 and dropout).</p>'+
     '<div class="m">h = f(W x + b)\ndownstream = upstream * local\ndL/dW has the same shape as W\ntheta = theta - lr * gradient</div>'+
     '<p><mark>Before L4</mark> (Dependency Parsing): the parser chooses step after step, and any neural classifier plugged into it is <code>h = f(W x + b)</code> followed by a softmax. Make sure you understand both, and how it is trained with cross-entropy and gradient descent.</p>'),
 q:[
   CQ("إيه اللي بيمنع شبكة من 3 طبقات إنها تبقى تحويل خطي واحد؟","What stops a 3-layer network from being a single linear transformation?",
      [["non-linearity بين الطبقات","A non-linearity between the layers"],["طبقات أكتر","More layers"],["learning rate أكبر","A larger learning rate"],["إننا نحسب gradient check","Running a gradient check"]],
      0,"من غير non-linearity بتتجمع المصفوفات في واحدة، وزيادة الطبقات مش بتغيّر ده.","Without a non-linearity the matrices merge into one, and adding layers does not change that."),
   CQ("a = x * w و x = 2 و w = 5، والـ upstream على a هو 3. كام dL/dx؟","a = x * w with x = 2 and w = 5, and the upstream on a is 3. What is dL/dx?",
      [["15","15"],["6","6"],["10","10"],["8","8"]],
      0,"dL/dx = upstream × w = 3 × 5 = 15. (6 هتطلع لو ضربنا في x بالغلط.)","dL/dx = upstream × w = 3 × 5 = 15. (6 would come from multiplying by x by mistake.)")
 ],
 f:[
   CF("لخّص الـ backprop في جملة.","Summarize backprop in one sentence.",
      "بنحسب الـ loss في الـ forward وبعدين نرجع بالـ chain rule: كل عقدة بتضرب الـ upstream في الـ local gradient.","We compute the loss in the forward pass, then go back with the chain rule: each node multiplies the upstream gradient by its local gradient."),
   CF("إيه أدوات التدريب الأربعة اللي اتعلمناها؟","What are the four training tools we learned?",
      "mini-batch SGD أو Adam، وXavier init، وregularization (L2 و dropout)، وgradient check.","Mini-batch SGD or Adam, Xavier init, regularization (L2 and dropout), and gradient check.")
 ]}
]}
);

})();
