/* Lecture 4: Dependency Parsing
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L4 fig: a dependency parse */
var FIG_DEP1=fig(150,
  [['She',36],['saw',104],['the',168],['video',238],['lecture',315]].map(function(w){return T(w[1],136,w[0],'tb','middle');}).join('')+
  AL(104,8,104,104,'mu','mM')+T(114,20,'root','tm','start','font-size:11px')+
  ARC(104,36,44,'nsubj','ac','mA',112,1)+
  ARC(104,315,130,'obj','ac','mA',112,1)+
  ARC(315,168,84,'det','ac','mA',112,1)+
  ARC(315,238,34,'compound','ac','mA',112,1,true),
  B('كل سهم بيطلع من الـ head للـ dependent وعليه اسم العلاقة. الجذر (root) هو الفعل saw.',
    'Each arrow goes from the head to its dependent, labeled with the relation. The root is the verb saw.'));

/* L4 fig: attachment ambiguity */
var FIG_AMB=fig(192,
  [['I',20],['saw',62],['the',108],['man',152],['with',204],['a',246],['telescope',310]].map(function(w){return T(w[1],100,w[0],'tb','middle');}).join('')+
  ARC(62,204,64,'','ok','mG',88,1)+ARC(204,310,34,'','mu','mM',88,1)+ARC(152,204,40,'','ac','mA',108,-1)+
  RECT(8,150,10,10,'var(--ok)','none',2)+T(24,159,'saw → with: I used the telescope')+
  RECT(8,170,10,10,'var(--ac)','none',2)+T(24,179,'man → with: the man has the telescope'),
  B('نفس الجملة، تركيبين ممكنين: with بتتعلق بـ saw (الأخضر) أو بـ man (الأزرق). كل تركيب بيدي معنى مختلف.',
    'Same sentence, two possible structures: with attaches to saw (green) or to man (blue). Each gives a different meaning.'));

/* L4 fig: a non-projective parse (crossing arrows) */
var FIG_NONPROJ=fig(172,
  [['give',40],['a',86],['talk',122],['tomorrow',190],['on',250],['parsing',312]].map(function(w){return T(w[1],108,w[0],'tb','middle');}).join('')+
  ARC(40,122,36,'','mu','mM',82,1)+ARC(122,86,22,'','mu','mM',82,1)+ARC(312,250,24,'','mu','mM',82,1)+
  ARC(40,190,70,'','ok','mG',82,1)+ARC(122,312,104,'','no','mN',82,1)+
  RECT(8,134,10,10,'var(--ok)','none',2)+T(24,143,'give → tomorrow')+
  RECT(8,152,10,10,'var(--no)','none',2)+T(24,161,'talk → parsing'),
  B('السهمين الأخضر والأحمر بيتقاطعوا: tomorrow بتوصف give، لكن parsing بتوصف talk من فوقها. ده parse مش projective.',
    'The green and red arrows cross: tomorrow describes give, but parsing describes talk over it. This parse is not projective.'));

/* L4 fig: the parse produced by the 6-word trace */
var FIG_TREE6=fig(150,
  [['The',24],['student',78],['read',138],['a',196],['long',238],['paper',300]].map(function(w){return T(w[1],136,w[0],'tb','middle');}).join('')+
  AL(138,8,138,104,'mu','mM')+T(148,20,'root','tm','start','font-size:11px')+
  ARC(138,78,44,'nsubj','ac','mA',112,1)+
  ARC(78,24,30,'det','ac','mA',112,1)+
  ARC(138,300,120,'obj','ac','mA',112,1)+
  ARC(300,196,60,'det','ac','mA',112,1)+
  ARC(300,238,28,'amod','ac','mA',112,1,true),
  B('الـ parse اللي طلع من الـ trace: كل كلمة ليها head واحد، والجذر هو read.',
    'The parse produced by the trace: every word has one head, and the root is read.'));

/* L4 fig: neural parser network */
function parserFig(){
  var L=['embeddings: words, POS tags, arc labels','concatenate into one vector','hidden layer: h = ReLU(W x + b)','softmax: SHIFT / LEFT-ARC / RIGHT-ARC'],s='',i;
  for(i=0;i<4;i++){
    var y=12+i*58,last=(i===3);
    s+=RECT(30,y,300,36,'var(--sf)',last?'var(--ok)':'var(--ac)',9,1.8)+T(180,y+23,L[i],last?'tb':'','middle','font-size:11.5px');
    if(i<3)s+=AL(180,y+38,180,y+56,'mu','mM');
  }
  return s;
}

var FIG_PARSER=fig(234,parserFig(),
  B('في كل خطوة الشبكة بتاخد features من الـ stack والـ buffer وبتدي احتمال لكل action.',
    'At each step the network takes features from the stack and buffer and outputs a probability for each action.'));

/* L4 fig: graph-based arc scores */
function scoreFig(){
  var H=['ROOT','I','ate','fish'],R=[['I',[1,'-',9,2],2],['ate',[8,1,'-',3],0],['fish',[1,0,7,'-'],2]],
      s=T(214,12,'candidate head','tm','middle','font-size:10.5px')+T(8,32,'dependent','tm','start','font-size:10px'),i,j,x,y,v,best;
  for(j=0;j<4;j++)s+=T(115+j*66,32,H[j],'tm','middle','font-size:11px');
  for(i=0;i<3;i++){
    y=40+i*38;
    s+=T(10,y+21,R[i][0],'tb');
    for(j=0;j<4;j++){
      x=84+j*66;v=R[i][1][j];best=(j===R[i][2]);
      s+=RECT(x,y,62,32,best?'var(--ok)':'var(--sf)',best?'none':'var(--ln)',7)+T(x+31,y+21,v,best?'tb':'tm','middle',best?'fill:var(--bg)':'');
    }
  }
  return s;
}

var FIG_SCORES=fig(160,scoreFig(),
  B('كل خانة هي score لسهم ممكن (العمود هو الـ head والصف هو الـ dependent). الأخضر هو أعلى score في كل صف.',
    'Each cell is the score of a possible arc (column = head, row = dependent). Green marks the highest score in each row.'));

/* ================= extra material for the existing cards ================= */

/* ---------- Lecture content ---------- */
(window.LECS=window.LECS||[]).push(
{id:4,t:B("Dependency Parsing","Dependency Parsing"),cards:[

{id:"l4-structure",t:B("Dependency structure: مين بيعتمد على مين","Dependency structure: who depends on whom"),
 b:cat(cat(B('<p>بدل ما نقسّم الجملة لعبارات متداخلة (constituency)، الـ <mark>dependency structure</mark> بيربط كل كلمة بالكلمة اللي بتعتمد عليها. الكلمة الأساسية اسمها <mark>head</mark>، والتابعة اسمها <mark>dependent</mark>، والسهم بيطلع من الـ head للـ dependent وعليه اسم العلاقة.</p>',
         '<p>Instead of splitting a sentence into nested phrases (constituency), a <mark>dependency structure</mark> links each word to the word it depends on. The main word is the <mark>head</mark>, the other is the <mark>dependent</mark>, and the arrow goes from head to dependent, labeled with the relation.</p>'),
       FIG_DEP1,
       B('<p>في المثال: <code>saw</code> هي الجذر (root). <code>She</code> هي الفاعل (nsubj) و <code>lecture</code> هي المفعول (obj) للفعل saw، و <code>the</code> و <code>video</code> بيوصفوا <code>lecture</code>.</p>',
         '<p>In the example: <code>saw</code> is the root. <code>She</code> is its subject (nsubj) and <code>lecture</code> is its object (obj), while <code>the</code> and <code>video</code> modify <code>lecture</code>.</p>')),
       B('<p>غلطة شائعة: الاتجاه بيتلخبط. السهم <code>saw → She</code> معناه إن saw هي الـ head و She هي الـ dependent، مش العكس. كل كلمة ليها head واحد بس، لكن الـ head الواحدة ممكن يبقى ليها dependents كتير (saw عندها اتنين هنا).</p>',
  '<p>A common mistake is mixing up the direction. The arrow <code>saw → She</code> means saw is the head and She is the dependent, not the other way around. Every word has only one head, but one head can have many dependents (saw has two here).</p>')),
 q:[
   CQ("في dependency structure، السهم بيطلع من...","In a dependency structure, the arrow goes from...",
      [["الـ head للـ dependent","The head to the dependent"],["الـ dependent للـ head","The dependent to the head"],["أول كلمة لآخر كلمة","The first word to the last word"],["الفاعل للمفعول دايمًا","The subject to the object, always"]],
      0,"السهم بيبدأ من الكلمة الأساسية (head) وبينتهي عند التابعة (dependent).","The arrow starts at the main word (head) and ends at the dependent."),
   CQ("في She saw the video lecture، كام dependent مباشر عند saw؟","In She saw the video lecture, how many direct dependents does saw have?",
   [["1","1"],["2 (She و lecture)","2 (She and lecture)"],["3","3"],["4","4"]],
   1,"saw ليها سهمين طالعين منها: nsubj لـ She و obj لـ lecture. أما the و video فتابعين لـ lecture.","saw has two arrows leaving it: nsubj to She and obj to lecture. The and video depend on lecture instead.")
 ],
 f:[
   CF("إيه هو الـ head والـ dependent في dependency parsing؟","What are the head and the dependent in dependency parsing?",
      "الـ head هي الكلمة الأساسية والـ dependent التابعة ليها. السهم بيطلع من الـ head للـ dependent وعليه نوع العلاقة.","The head is the main word and the dependent is the word attached to it. The arrow goes from head to dependent, labeled with the relation type."),
   CF("إيه الفرق بين dependency و constituency؟","What is the difference between dependency and constituency structure?",
   "الـ constituency بتقسّم الجملة لعبارات متداخلة. الـ dependency بتربط كل كلمة بالكلمة اللي بتعتمد عليها بسهم.","Constituency splits a sentence into nested phrases. Dependency links each word to the word it depends on with an arrow.")
 ],
 terms:[
   {t:B("Dependency structure","Dependency structure"),
 d:B("ربط كل كلمة في الجملة بالكلمة اللي بتعتمد عليها، بأسهم عليها أسماء العلاقات.","Linking each word in a sentence to the word it depends on, using labeled arrows.")},
{t:B("Head","Head"),
 d:B("الكلمة الأساسية في العلاقة. السهم بيطلع منها.","The main word in a relation. The arrow starts at it.")},
{t:B("Dependent","Dependent"),
 d:B("الكلمة التابعة للـ head. السهم بيوصل لها.","The word attached to the head. The arrow ends at it.")},
{t:B("Constituency structure","Constituency structure"),
 d:B("تقسيم الجملة لعبارات متداخلة بدل ربط الكلمات ببعض مباشرة.","Splitting a sentence into nested phrases instead of linking words directly.")}
 ]},

{id:"l4-ambiguity",t:B("ليه الـ syntax مهمة: الغموض","Why syntax matters: ambiguity"),
 b:cat(cat(B('<p>الجملة الواحدة ممكن يبقى ليها أكتر من تركيب، وكل تركيب معناه مختلف. أشهر مثال اسمه <mark>prepositional phrase attachment</mark>:</p>'+
         '<div class="m">I saw the man with a telescope</div>',
         '<p>One sentence can have more than one structure, and each structure means something different. The classic example is <mark>prepositional phrase attachment</mark>:</p>'+
         '<div class="m">I saw the man with a telescope</div>'),
       FIG_AMB,
       B('<p>العبارة <code>with a telescope</code> ممكن تتعلق بـ <code>saw</code> (أنا استخدمت التلسكوب)، أو بـ <code>man</code> (الراجل هو اللي معاه التلسكوب). ولما الجملة تبقى فيها عبارات كتير زي دي، عدد التراكيب الممكنة بيزيد بسرعة، وده اللي بيخلي الـ parsing صعب.</p>',
         '<p>The phrase <code>with a telescope</code> can attach to <code>saw</code> (I used the telescope) or to <code>man</code> (the man has the telescope). With many such phrases in a sentence, the number of possible structures grows quickly, which is what makes parsing hard.</p>')),
       B('<p>الأرقام بتزيد بسرعة: لو بعد <code>saw the man</code> فيه عبارة واحدة زي with a telescope يبقى فيه 2 تركيب ممكن. ولو فيه عبارتين (كمان <code>on the hill</code>) من غير أسهم متقاطعة يبقى 5، وتلاتة يبقى 14. علشان كده الـ parser محتاج طريقة ذكية تختار التركيب الصح.</p>',
  '<p>The numbers grow fast: if <code>saw the man</code> is followed by one phrase like with a telescope, there are 2 possible structures. With two phrases (also <code>on the hill</code>) and no crossing arrows there are 5, and with three there are 14. That is why a parser needs a smart way to pick the right structure.</p>')),
 q:[
   CQ("إيه سبب الغموض في I saw the man with a telescope؟","What causes the ambiguity in I saw the man with a telescope?",
      [["with a telescope ممكن تتعلق بـ saw أو بـ man","with a telescope can attach to saw or to man"],["كلمة saw ليها معنيين بس","The word saw has two meanings only"],["مفيش فعل في الجملة","There is no verb in the sentence"],["الجملة ناقصة","The sentence is incomplete"]],
      0,"اختلاف الكلمة اللي بتتعلق بيها العبارة بيغيّر المعنى.","Which word the phrase attaches to changes the meaning."),
   CQ("بعد saw the man لو فيه عبارة واحدة يبقى فيه 2 تركيب ممكن. لو ضفنا عبارة تانية (on the hill) من غير أسهم متقاطعة، يبقى كام تركيب؟","After saw the man, one phrase gives 2 possible structures. If we add a second phrase (on the hill) with no crossing arrows, how many structures are there?",
   [["4","4"],["3","3"],["5","5"],["6","6"]],
   2,"عدد التراكيب بيزيد أسرع من الجمع البسيط: 2 بعد عبارة، و 5 بعد عبارتين، و 14 بعد تلاتة.","The count grows faster than simple addition: 2 after one phrase, 5 after two, 14 after three.")
 ],
 f:[
   CF("إيه هو prepositional phrase attachment ambiguity؟","What is prepositional phrase attachment ambiguity?",
      "لما عبارة زي with a telescope تنفع تتعلق بأكتر من كلمة في الجملة، وكل اختيار بيدي معنى مختلف.","When a phrase like with a telescope can attach to more than one word in the sentence, each choice giving a different meaning."),
   CF("ليه عدد التراكيب بيزيد بسرعة لما العبارات تكتر؟","Why does the number of structures grow so fast as phrases are added?",
   "لأن كل عبارة جديدة ممكن تتعلق بأكتر من كلمة، فالاحتمالات بتزيد أسرع بكتير من الجمع: 2 ثم 5 ثم 14.","Because each new phrase can attach to several words, so the possibilities grow much faster than addition: 2, then 5, then 14.")
 ],
 terms:[
   {t:B("Prepositional phrase attachment","Prepositional phrase attachment"),
 d:B("لما عبارة جار ومجرور (زي with a telescope) تنفع تتعلق بأكتر من كلمة، وكل اختيار بيغيّر المعنى.","When a prepositional phrase (like with a telescope) can attach to more than one word, and each choice changes the meaning.")}
 ]},

{id:"l4-treerules",t:B("قواعد الشجرة","The rules of the tree"),
 b:cat(B('<p>الـ dependency parse الصحيح بيبقى <mark>شجرة</mark>:</p>'+
     '<p>1. كل كلمة ليها <mark>head واحد بالظبط</mark>.<br>2. مفيش دوائر (cycles).<br>3. بنضيف كلمة وهمية <code>ROOT</code> عشان الجذر الحقيقي كمان يبقى ليه head.</p>'+
     '<p>وبنقول إن الـ parse <mark>projective</mark> لو ما فيهوش أسهم بتتقاطع لما نرسمها فوق الجملة. أغلب الجمل الإنجليزية projective، لكن لغات تانية وبعض التراكيب مش كده.</p>'+
     '<p>نتيجة مفيدة: عدد الأسهم في الـ parse يساوي عدد كلمات الجملة (كل كلمة ليها سهم داخل عليها، والجذر سهمه جاي من ROOT).</p>',
     '<p>A valid dependency parse is a <mark>tree</mark>:</p>'+
     '<p>1. Every word has <mark>exactly one head</mark>.<br>2. There are no cycles.<br>3. We add a fake word <code>ROOT</code> so the real root also has a head.</p>'+
     '<p>A parse is <mark>projective</mark> if no arrows cross when drawn above the sentence. Most English sentences are projective, but other languages and some constructions are not.</p>'+
     '<p>A useful consequence: the number of arrows in a parse equals the number of words (every word has one arrow entering it, and the root\'s arrow comes from ROOT).</p>'),
       B('<p>تحقق بسرعة من الأرقام: <code>She saw the video lecture</code> فيها 5 كلمات، فالـ parse فيه 5 أسهم: ROOT → saw، و saw → She، و saw → lecture، و lecture → the، و lecture → video. لو لقيت كلمة من غير سهم داخل عليها، أو كلمة عليها سهمين داخلين، يبقى ده مش parse صحيح.</p>',
  '<p>A quick check of the numbers: <code>She saw the video lecture</code> has 5 words, so its parse has 5 arrows: ROOT → saw, saw → She, saw → lecture, lecture → the, and lecture → video. If a word has no arrow entering it, or has two arrows entering it, the result is not a valid parse.</p>')),
 q:[
   CQ("جملة من 8 كلمات، كام سهم في الـ dependency parse (بحساب ROOT)؟","A sentence has 8 words. How many arrows are in its dependency parse (counting ROOT)?",
      [["8","8"],["7","7"],["9","9"],["16","16"]],
      0,"كل كلمة ليها head واحد، يعني سهم واحد داخل عليها: 8 أسهم.","Every word has one head, so one arrow enters it: 8 arrows."),
   CQ("أنهي من دول بيكسر قواعد الشجرة في She saw the video lecture؟","Which of these breaks the tree rules for She saw the video lecture?",
   [["ROOT → saw","ROOT → saw"],["saw → She","saw → She"],["lecture → the","lecture → the"],["video ليها اتنين heads: saw و lecture","video has two heads: saw and lecture"]],
   3,"كل كلمة لازم يبقى ليها head واحد بالظبط. باقي الاختيارات أسهم عادية في الـ parse.","Every word must have exactly one head. The other options are ordinary arrows of the parse.")
 ],
 f:[
   CF("إيه شروط الـ dependency parse الصحيح؟","What makes a dependency parse valid?",
      "شجرة: كل كلمة ليها head واحد بالظبط، مفيش cycles، وفيه ROOT وهمي للجذر. ولو مفيش أسهم متقاطعة يبقى projective.","A tree: every word has exactly one head, no cycles, and a fake ROOT for the root word. If no arrows cross it is projective."),
   CF("ليه عدد الأسهم يساوي عدد الكلمات؟","Why does the number of arrows equal the number of words?",
   "لأن كل كلمة ليها head واحد بالظبط، يعني سهم واحد داخل عليها، والجذر سهمه جاي من ROOT.","Because every word has exactly one head, so exactly one arrow enters it, and the root's arrow comes from ROOT.")
 ],
 terms:[
   {t:B("Dependency tree","Dependency tree"),
 d:B("parse صحيح: كل كلمة ليها head واحد بالظبط، ومفيش cycles، وفيه ROOT.","A valid parse: every word has exactly one head, there are no cycles, and there is a ROOT.")},
{t:B("ROOT token","ROOT token"),
 d:B("كلمة وهمية بنضيفها عشان الجذر الحقيقي كمان يبقى ليه head.","A fake word we add so that the real root also has a head.")}
 ]},

{id:"l4-projective",
 t:B("Projective مقابل non-projective","Projective vs non-projective parses"),
 b:cat(B('<p>خلّينا نحدد الفكرة بدقة. السهم بيبقى <mark>projective</mark> لو كل كلمة واقعة بين الـ head والـ dependent تابعة للـ head دي (مباشرة أو غير مباشرة). والـ parse بيبقى projective لو كل أسهمه كده، وده نفسه إن مفيش أسهم بتتقاطع. أما لو فيه سهمين بيتقاطعوا يبقى <mark>non-projective</mark>.</p>',
         '<p>Let us make the idea precise. An arc is <mark>projective</mark> if every word between the head and the dependent hangs below that head (directly or indirectly). A parse is projective when all of its arcs are, which is the same as having no crossing arrows. A parse with two crossing arrows is <mark>non-projective</mark>.</p>'),
       FIG_NONPROJ,
       B('<p>في <code>Give a talk tomorrow on parsing</code>: العبارة <code>on parsing</code> بتوصف <code>talk</code>، لكن <code>tomorrow</code> واقفة بينهم وبتوصف <code>give</code>، فالسهمين بيتقاطعوا.</p>'+
         '<div class="m">give=1  a=2  talk=3  tomorrow=4  on=5  parsing=6\ngive → tomorrow: 1 to 4\ntalk → parsing: 3 to 6\n3 is inside 1-4, 6 is outside: they cross</div>'+
         '<p>ليه ده مهم؟ لأن آلة arc-standard (SHIFT / LEFT-ARC / RIGHT-ARC، هنشرحها في الكارت الجاي) مش بتنتج غير parses projective. وللغات اللي ترتيب الكلمات فيها حر، زي التشيكية، بنحتاج أكشن زيادة (زي SWAP) أو طريقة تانية.</p>',
         '<p>In <code>Give a talk tomorrow on parsing</code>, the phrase <code>on parsing</code> describes <code>talk</code>, but <code>tomorrow</code> stands in between and describes <code>give</code>, so the two arrows cross.</p>'+
         '<div class="m">give=1  a=2  talk=3  tomorrow=4  on=5  parsing=6\ngive → tomorrow: 1 to 4\ntalk → parsing: 3 to 6\n3 is inside 1-4, 6 is outside: they cross</div>'+
         '<p>Why does it matter? The arc-standard machine (SHIFT / LEFT-ARC / RIGHT-ARC, explained in the next card) can only produce projective parses. For languages with freer word order, such as Czech, we need an extra action (like SWAP) or a different method.</p>')),
 q:[
   CQ("إيه معنى إن الـ parse non-projective؟","What does it mean for a parse to be non-projective?",
      [["فيه كلمة من غير head","A word has no head"],["الجملة مفيهاش فعل","The sentence has no verb"],["فيه سهمين على الأقل بيتقاطعوا","At least two arrows cross"],["عدد الأسهم أقل من عدد الكلمات","There are fewer arrows than words"]],
      2,"الـ non-projective معناه إن فيه أسهم متقاطعة لما نرسم الـ parse فوق الجملة.","Non-projective means some arrows cross when the parse is drawn above the sentence."),
   CQ("كلمات جملة مرقّمة من 1 لـ 6. فيه سهم من 2 لـ 5 وسهم من 4 لـ 6. هل بيتقاطعوا؟","The words of a sentence are numbered 1 to 6. One arrow goes from 2 to 5 and another from 4 to 6. Do they cross?",
      [["أيوه: 4 جوه المدى 2-5 و 6 برّاه","Yes: 4 is inside the range 2-5 and 6 is outside it"],["لأ: لأن 5 أصغر من 6","No: because 5 is smaller than 6"],["لأ: لأن السهمين داخلين على كلمات مختلفة","No: because the arrows enter different words"],["مش ممكن نعرف من غير أسماء العلاقات","We cannot tell without the relation labels"]],
      0,"السهمين بيتقاطعوا لما طرف من السهم التاني يبقى جوه مدى الأول والطرف التاني برّاه: 4 جوه 2-5 و 6 برّاه.","Two arrows cross when one end of the second lies inside the range of the first and the other end lies outside: 4 is inside 2-5 and 6 is outside.")
 ],
 f:[
   CF("إيه الـ projective parse؟","What is a projective parse?",
      "parse مفيهوش أسهم متقاطعة: كل كلمة بين الـ head والـ dependent تابعة للـ head دي.","A parse with no crossing arrows: every word between a head and its dependent hangs below that head."),
   CF("إيه حدود الـ arc-standard بالنسبة للـ non-projective؟","What is the arc-standard limit regarding non-projective parses?",
      "بينتج parses projective بس. لو الـ parse non-projective محتاجين أكشن زيادة زي SWAP أو طريقة تانية.","It can only produce projective parses. For non-projective parses we need an extra action like SWAP or a different method.")
 ],
 terms:[
   {t:B("Projective parse","Projective parse"),
    d:B("parse مفيهوش أسهم متقاطعة: كل كلمة بين الـ head والـ dependent تابعة للـ head دي.","A parse with no crossing arrows: every word between a head and its dependent hangs below that head.")},
   {t:B("Non-projective parse","Non-projective parse"),
    d:B("parse فيه سهمين على الأقل بيتقاطعوا لما نرسمه فوق الجملة.","A parse where at least two arrows cross when drawn above the sentence.")}
 ]},

{id:"l4-transition",t:B("Transition-based parsing","Transition-based parsing"),
 b:B('<p>بدل ما نجرّب كل الأشجار الممكنة، بنبني الـ parse خطوة خطوة بآلة صغيرة فيها <mark>stack</mark> و <mark>buffer</mark>. في البداية الـ stack فيها ROOT والـ buffer فيها كل كلمات الجملة. وفيه 3 أكشنز:</p>'+
     '<p><code>SHIFT</code>: انقل أول كلمة من الـ buffer للـ stack.<br><code>LEFT-ARC</code>: الكلمة التانية في الـ stack تبقى dependent للكلمة اللي فوقها، وتتشال.<br><code>RIGHT-ARC</code>: الكلمة اللي فوق الـ stack تبقى dependent للتانية، وتتشال.</p>'+
     '<p>مثال على الجملة <code>I ate fish</code>:</p>'+
     '<div class="m">stack            buffer         action\n[ROOT]           [I ate fish]   SHIFT\n[ROOT I]         [ate fish]     SHIFT\n[ROOT I ate]     [fish]         LEFT-ARC   (ate → I)\n[ROOT ate]       [fish]         SHIFT\n[ROOT ate fish]  []             RIGHT-ARC  (ate → fish)\n[ROOT ate]       []             RIGHT-ARC  (ROOT → ate)\n[ROOT]           []             done</div>'+
     '<p>عدد الخطوات = 2 × عدد الكلمات، فالـ parsing سريع (خطي).</p>',
     '<p>Instead of trying every possible tree, we build the parse step by step with a small machine that has a <mark>stack</mark> and a <mark>buffer</mark>. At the start the stack holds ROOT and the buffer holds all the words. There are 3 actions:</p>'+
     '<p><code>SHIFT</code>: move the first word of the buffer onto the stack.<br><code>LEFT-ARC</code>: the second word on the stack becomes a dependent of the top word, and is removed.<br><code>RIGHT-ARC</code>: the top word becomes a dependent of the second one, and is removed.</p>'+
     '<p>An example on the sentence <code>I ate fish</code>:</p>'+
     '<div class="m">stack            buffer         action\n[ROOT]           [I ate fish]   SHIFT\n[ROOT I]         [ate fish]     SHIFT\n[ROOT I ate]     [fish]         LEFT-ARC   (ate → I)\n[ROOT ate]       [fish]         SHIFT\n[ROOT ate fish]  []             RIGHT-ARC  (ate → fish)\n[ROOT ate]       []             RIGHT-ARC  (ROOT → ate)\n[ROOT]           []             done</div>'+
     '<p>The number of steps is 2 × the number of words, so parsing is fast (linear).</p>'),
 q:[
   CQ("في I ate fish، لما الـ stack تبقى [ROOT ate fish]، أنهي أكشن بيربط ate بـ fish؟","In I ate fish, when the stack is [ROOT ate fish], which action links ate to fish?",
      [["RIGHT-ARC","RIGHT-ARC"],["LEFT-ARC","LEFT-ARC"],["SHIFT","SHIFT"],["ROOT","ROOT"]],
      0,"fish هي الكلمة اللي فوق الـ stack وبتبقى dependent للتانية (ate)، ده RIGHT-ARC.","fish is the top word and becomes a dependent of the second word (ate), which is RIGHT-ARC."),
   CQ("الـ stack هي [ROOT I ate]. إيه اللي يفضل فيها بعد LEFT-ARC؟","The stack is [ROOT I ate]. What is left in it after a LEFT-ARC?",
   [["[ROOT I]","[ROOT I]"],["[ROOT]","[ROOT]"],["[ROOT ate]","[ROOT ate]"],["[I ate]","[I ate]"]],
   2,"LEFT-ARC بيخلّي الكلمة التانية (I) dependent للي فوقها (ate) وبيشيلها من الـ stack.","LEFT-ARC makes the second word (I) a dependent of the top word (ate) and removes it from the stack.")
 ],
 f:[
   CF("إيه الأكشنز التلاتة في arc-standard parser؟","What are the three actions of the arc-standard parser?",
      "SHIFT ينقل كلمة من الـ buffer للـ stack. LEFT-ARC: التانية dependent للي فوق. RIGHT-ARC: اللي فوق dependent للتانية.","SHIFT moves a word from buffer to stack. LEFT-ARC: the second word becomes a dependent of the top. RIGHT-ARC: the top becomes a dependent of the second."),
   CF("إيه حالة البداية والنهاية للآلة؟","What are the start and end states of the machine?",
   "البداية: الـ stack فيها ROOT بس والـ buffer فيها كل الكلمات. النهاية: الـ buffer فاضية والـ stack فيها ROOT بس.","Start: the stack holds only ROOT and the buffer holds all the words. End: the buffer is empty and the stack holds only ROOT.")
 ],
 terms:[
   {t:B("Transition-based parsing","Transition-based parsing"),
 d:B("بناء الـ parse خطوة خطوة بأكشنز على stack و buffer، بدل ما نجرّب كل الأشجار.","Building the parse step by step with actions on a stack and a buffer, instead of trying every tree.")},
{t:B("Stack and buffer","Stack and buffer"),
 d:B("الـ stack فيها الكلمات اللي شغالين عليها، والـ buffer فيها الكلمات اللي لسه ما دخلتش.","The stack holds the words we are working on, and the buffer holds the words not yet processed.")},
{t:B("Arc-standard","Arc-standard"),
 d:B("نظام الـ transition الأساسي: 3 أكشنز (SHIFT و LEFT-ARC و RIGHT-ARC)، وبينتج parses projective بس.","The basic transition system: 3 actions (SHIFT, LEFT-ARC, RIGHT-ARC), producing only projective parses.")},
{t:B("SHIFT","SHIFT"),
 d:B("بينقل أول كلمة من الـ buffer للـ stack.","Moves the first word of the buffer onto the stack.")},
{t:B("LEFT-ARC","LEFT-ARC"),
 d:B("الكلمة التانية في الـ stack تبقى dependent للكلمة اللي فوقها، وتتشال.","The second word on the stack becomes a dependent of the top word, and is removed.")},
{t:B("RIGHT-ARC","RIGHT-ARC"),
 d:B("الكلمة اللي فوق الـ stack تبقى dependent للتانية، وتتشال.","The top word on the stack becomes a dependent of the second one, and is removed.")}
 ]},

{id:"l4-trace",
 t:B("Trace كامل لـ arc-standard على 6 كلمات","A full arc-standard trace on a 6-word sentence"),
 b:cat(B('<p>خلّينا نشغّل الـ arc-standard على جملة من 6 كلمات. الـ buffer في الأول فيها كل الكلمات، وكل SHIFT بياخد الكلمة اللي بعدها. القاعدة المهمة: الكلمة ما بتتشالش من الـ stack غير لما تاخد كل الـ dependents بتوعها.</p>'+
         '<div class="m">buffer at start: The student read a long paper\n #  action                      stack after\n 1  SHIFT                       [ROOT The]\n 2  SHIFT                       [ROOT The student]\n 3  LEFT-ARC  (student → The)   [ROOT student]\n 4  SHIFT                       [ROOT student read]\n 5  LEFT-ARC  (read → student)  [ROOT read]\n 6  SHIFT                       [ROOT read a]\n 7  SHIFT                       [ROOT read a long]\n 8  SHIFT                       [ROOT read a long paper]\n 9  LEFT-ARC  (paper → long)    [ROOT read a paper]\n10  LEFT-ARC  (paper → a)       [ROOT read paper]\n11  RIGHT-ARC (read → paper)    [ROOT read]\n12  RIGHT-ARC (ROOT → read)     [ROOT]</div>',
         '<p>Let us run arc-standard on a 6-word sentence. The buffer starts with all the words and each SHIFT takes the next one. The key rule: a word leaves the stack only after it has collected all its dependents.</p>'+
         '<div class="m">buffer at start: The student read a long paper\n #  action                      stack after\n 1  SHIFT                       [ROOT The]\n 2  SHIFT                       [ROOT The student]\n 3  LEFT-ARC  (student → The)   [ROOT student]\n 4  SHIFT                       [ROOT student read]\n 5  LEFT-ARC  (read → student)  [ROOT read]\n 6  SHIFT                       [ROOT read a]\n 7  SHIFT                       [ROOT read a long]\n 8  SHIFT                       [ROOT read a long paper]\n 9  LEFT-ARC  (paper → long)    [ROOT read a paper]\n10  LEFT-ARC  (paper → a)       [ROOT read paper]\n11  RIGHT-ARC (read → paper)    [ROOT read]\n12  RIGHT-ARC (ROOT → read)     [ROOT]</div>'),
       FIG_TREE6,
       B('<p>الحساب: 6 SHIFT + 6 ARC = 12 خطوة = 2 × 6. لاحظ إن <code>paper</code> فضلت في الـ stack لحد ما خدت <code>long</code> و <code>a</code>، وبعدين بس اتعمل <code>RIGHT-ARC</code>.</p>'+
         '<p>غلطات شائعة: RIGHT-ARC قبل ما الكلمة تخلّص dependents بتوعها (مش هتاخد حاجة بعد كده)، أو LEFT-ARC والكلمة التانية هي ROOT (الـ ROOT عمره ما يبقى dependent).</p>',
         '<p>The count: 6 SHIFT + 6 ARC = 12 steps = 2 × 6. Notice that <code>paper</code> stayed on the stack until it had collected <code>long</code> and <code>a</code>, and only then came the <code>RIGHT-ARC</code>.</p>'+
         '<p>Common mistakes: a RIGHT-ARC before the word has all its dependents (it cannot take any later), or a LEFT-ARC when the second word is ROOT (ROOT is never a dependent).</p>')),
 q:[
   CQ("بعد الخطوة 8 الـ stack هي [ROOT read a long paper] والـ buffer فاضية. إيه الأكشن الجاي؟","After step 8 the stack is [ROOT read a long paper] and the buffer is empty. What is the next action?",
      [["SHIFT","SHIFT"],["RIGHT-ARC (long → paper)","RIGHT-ARC (long → paper)"],["RIGHT-ARC (read → paper)","RIGHT-ARC (read → paper)"],["LEFT-ARC (paper → long)","LEFT-ARC (paper → long)"]],
      3,"الـ buffer فاضية فمفيش SHIFT. و long هي التانية في الـ stack، فبتبقى dependent لـ paper (اللي فوق): LEFT-ARC.","The buffer is empty, so SHIFT is impossible. long is the second word on the stack, so it becomes a dependent of paper (the top): LEFT-ARC."),
   CQ("جملة من 9 كلمات، كام خطوة يحتاجها arc-standard parser؟","A sentence has 9 words. How many steps does an arc-standard parser need?",
      [["9","9"],["10","10"],["27","27"],["18","18"]],
      3,"9 أكشنز SHIFT + 9 أكشنز ARC = 18 = 2 × 9.","9 SHIFT actions + 9 ARC actions = 18 = 2 × 9.")
 ],
 f:[
   CF("إيه الشرط قبل ما نشيل كلمة من الـ stack بـ ARC؟","What condition must hold before we remove a word from the stack with an ARC action?",
      "لازم تكون خدت كل الـ dependents بتوعها، لأنها بعد ما تتشال مش بتاخد حاجة تانية.","It must already have collected all of its dependents, because once removed it cannot take any more."),
   CF("جملة من n كلمة، كام خطوة في arc-standard؟","For a sentence of n words, how many steps does arc-standard take?",
      "2n: عدد n من SHIFT وعدد n من ARC (آخر واحد بيربط الجذر بـ ROOT).","2n: n SHIFT actions and n ARC actions (the last one links the root to ROOT).")
 ]},

{id:"l4-neuralparser",t:B("Neural dependency parser","The neural dependency parser"),
 b:cat(cat(B('<p>السؤال في كل خطوة: أعمل SHIFT ولا LEFT-ARC ولا RIGHT-ARC؟ بنسيب <mark>neural classifier</mark> يقرر (Chen و Manning، 2014). المدخلات: كلمات وأجزاء الكلام (POS tags) وعلاقات موجودة، من مواضع في الـ stack والـ buffer، وكلها بتتحول لـ dense embeddings.</p>',
         '<p>The question at each step: SHIFT, LEFT-ARC or RIGHT-ARC? We let a <mark>neural classifier</mark> decide (Chen and Manning, 2014). Its inputs: words, part-of-speech tags and existing arc labels from certain positions in the stack and buffer, all turned into dense embeddings.</p>'),
       FIG_PARSER,
       B('<p>الميزة: الـ dense embeddings بتعرف التشابه بين الكلمات (بعكس الـ sparse features القديمة)، فالـ parser بقى أدق وأسرع. الشبكة بتطلّع احتمال لكل action وبنختار الأعلى.</p>',
         '<p>The advantage: dense embeddings capture similarity between words (unlike the old sparse features), so the parser became both more accurate and faster. The network outputs a probability per action and we pick the highest.</p>')),
       B('<p>ملاحظة على عدد الأكشنز: لو الـ parser بيحط اسم العلاقة كمان، يبقى فيه <code>LEFT-ARC</code> و <code>RIGHT-ARC</code> لكل علاقة. فمع 37 علاقة (زي Universal Dependencies) بيبقى عندنا 2 × 37 + 1 = 75 اختيار بدل 3. والـ classifier مش بيبني الشجرة بنفسه، هو بس بيختار الأكشن، والـ stack والـ buffer هما اللي بيبنوا الـ parse.</p>',
  '<p>A note on the number of actions: if the parser also predicts the relation name, there is a <code>LEFT-ARC</code> and a <code>RIGHT-ARC</code> for every relation. With 37 relations (as in Universal Dependencies) we get 2 × 37 + 1 = 75 choices instead of 3. The classifier does not build the tree itself, it only picks the action, and the stack and buffer build the parse.</p>')),
 q:[
   CQ("إيه المهمة اللي بيحلها الـ classifier في الـ neural parser؟","What task does the classifier solve in the neural parser?",
      [["يختار الأكشن الجاي (SHIFT أو LEFT-ARC أو RIGHT-ARC)","Picks the next action (SHIFT, LEFT-ARC or RIGHT-ARC)"],["يترجم الجملة","Translates the sentence"],["يولّد كلمة جديدة","Generates a new word"],["يحسب الـ perplexity","Computes perplexity"]],
      0,"في كل خطوة بيتنبأ بالأكشن الأنسب من حالة الـ stack والـ buffer.","At each step it predicts the best action from the stack and buffer state."),
   CQ("الـ parser بيحط اسم العلاقة مع كل LEFT-ARC و RIGHT-ARC، وعنده 37 علاقة. كام اختيار عند الـ classifier؟","The parser labels every LEFT-ARC and RIGHT-ARC and has 37 relations. How many choices does the classifier have?",
   [["39","39"],["75","75"],["111","111"],["3","3"]],
   1,"37 LEFT-ARC + 37 RIGHT-ARC + SHIFT = 2 × 37 + 1 = 75.","37 LEFT-ARC + 37 RIGHT-ARC + SHIFT = 2 × 37 + 1 = 75.")
 ],
 f:[
   CF("إزاي الـ neural dependency parser بيشتغل؟","How does the neural dependency parser work?",
      "classifier بياخد embeddings لكلمات وtags وعلاقات من الـ stack والـ buffer، وبيدي احتمال لكل action (SHIFT/LEFT-ARC/RIGHT-ARC).","A classifier takes embeddings of words, tags and arc labels from the stack and buffer, and outputs a probability for each action (SHIFT/LEFT-ARC/RIGHT-ARC)."),
   CF("ليه الـ dense embeddings أحسن من الـ sparse features في الـ parser؟","Why are dense embeddings better than sparse features in the parser?",
   "لأنها بتعرف التشابه بين الكلمات، فالـ parser بقى أدق وأسرع.","Because they capture similarity between words, so the parser became more accurate and faster.")
 ],
 terms:[
   {t:B("Neural dependency parser","Neural dependency parser"),
 d:B("parser بيستخدم classifier عصبي يختار الأكشن الجاي من embeddings (Chen و Manning، 2014).","A parser that uses a neural classifier to pick the next action from embeddings (Chen and Manning, 2014).")},
{t:B("POS tag","POS tag"),
 d:B("نوع الكلمة في الجملة (اسم، فعل، صفة...) زي NOUN و VERB.","The word class in a sentence (noun, verb, adjective...) such as NOUN and VERB.")}
 ]},

{id:"l4-graphbased",
 t:B("Graph-based parsing: score لكل سهم ممكن","Graph-based parsing: score every possible arc"),
 b:cat(B('<p>الطريقة التانية بتبص على الجملة كلها مرة واحدة. بدل ما نبني الـ parse بأكشنز، بنحسب <mark>score</mark> لكل سهم ممكن (head → dependent) بين أي كلمتين (وبين ROOT وأي كلمة)، وبعدين نختار الشجرة اللي مجموع scores بتاعتها أعلى ما يمكن. دي اسمها <mark>graph-based parsing</mark>.</p>',
         '<p>The second approach looks at the whole sentence at once. Instead of building the parse with actions, we compute a <mark>score</mark> for every possible arc (head → dependent) between any two words (and between ROOT and any word), then choose the tree whose total score is as high as possible. This is <mark>graph-based parsing</mark>.</p>'),
       FIG_SCORES,
       B('<p>في الجدول: كل صف كلمة بدور dependent، وكل عمود head محتمل. أعلى رقم في كل صف أخضر. الاختيارات هنا (ate → I و ROOT → ate و ate → fish) بتكوّن شجرة صحيحة، ومجموعها 9 + 8 + 7 = 24.</p>'+
         '<p>لو أعلى اختيار لكل كلمة لوحدها طلّع cycle أو مش شجرة، بنستخدم خوارزمية <mark>maximum spanning tree</mark> (زي Chu-Liu/Edmonds) علشان نلاقي أحسن شجرة صحيحة. وفي الـ parsers الحديثة الـ scores بتتحسب بشبكة عصبية (مثلًا biaffine عند Dozat و Manning، 2017).</p>',
         '<p>In the table, each row is a word acting as the dependent and each column is a candidate head. The highest number in each row is green. The choices here (ate → I, ROOT → ate, ate → fish) form a valid tree with total score 9 + 8 + 7 = 24.</p>'+
         '<p>If the best choice for each word on its own creates a cycle or is not a tree, we use a <mark>maximum spanning tree</mark> algorithm (such as Chu-Liu/Edmonds) to find the best valid tree. In modern parsers the scores come from a neural network (for example the biaffine scorer of Dozat and Manning, 2017).</p>')),
 q:[
   CQ("إيه اللي بيحسبه الـ graph-based parser؟","What does a graph-based parser compute?",
      [["الأكشن الجاي (SHIFT أو ARC)","The next action (SHIFT or ARC)"],["الـ perplexity للجملة","The perplexity of the sentence"],["عدد الكلمات في الجملة","The number of words in the sentence"],["score لكل سهم ممكن (head → dependent)","A score for every possible arc (head → dependent)"]],
      3,"بيدي score لكل سهم ممكن وبعدين بيختار الشجرة الصحيحة اللي مجموعها أعلى.","It scores every possible arc and then picks the valid tree with the highest total."),
   CQ("لكلمة X، الـ scores للـ heads المحتملة: ROOT = 2 و A = 6 و B = 4. أنهي head هيتختار لو بنبص على الصف ده لوحده؟","For a word X the scores of its candidate heads are: ROOT = 2, A = 6, B = 4. Which head is picked if we look at this row alone?",
      [["ROOT","ROOT"],["A","A"],["B","B"],["مفيش واحد","None of them"]],
      1,"أعلى score هو 6 وهو للـ head A.","The highest score is 6, which belongs to head A.")
 ],
 f:[
   CF("إيه الفكرة في graph-based parsing؟","What is the idea of graph-based parsing?",
      "بنحسب score لكل سهم ممكن (head → dependent) وبنختار الشجرة الصحيحة اللي مجموع scores بتاعتها أعلى.","We compute a score for every possible arc (head → dependent) and choose the valid tree with the highest total score."),
   CF("إمتى بنحتاج maximum spanning tree؟","When do we need a maximum spanning tree?",
      "لما أعلى اختيار لكل كلمة لوحدها مش بيكوّن شجرة صحيحة (مثلًا فيه cycle).","When the best choice for each word on its own does not form a valid tree (for example it contains a cycle).")
 ],
 terms:[
   {t:B("Graph-based parsing","Graph-based parsing"),
    d:B("إعطاء score لكل سهم ممكن واختيار الشجرة اللي مجموع scores بتاعتها أعلى.","Scoring every possible arc and choosing the tree with the highest total score.")},
   {t:B("Maximum spanning tree","Maximum spanning tree"),
    d:B("أحسن شجرة صحيحة (مجموع scores أعلى ما يمكن) من بين كل الأشجار الممكنة على الكلمات.","The best valid tree (highest total score) among all possible trees over the words.")}
 ]},

{id:"l4-compare",
 t:B("Transition-based مقابل graph-based","Transition-based vs graph-based parsing"),
 b:B('<p>الاتنين بيطلّعوا نفس النوع من الـ parse، لكن بيفكروا بشكل مختلف:</p>'+
     '<p><mark>Transition-based</mark>: بيبني الشجرة خطوة خطوة بقرارات محلية. سريع جدًا (خطي، 2n خطوة)، لكن الغلطة المبكرة ممكن تعدّي على اللي بعدها (<mark>error propagation</mark>)، والـ arc-standard بيطلّع projective بس.</p>'+
     '<p><mark>Graph-based</mark>: بيدي score لكل الأسهم الممكنة ويختار أحسن شجرة كاملة، فبيبص على الجملة كلها، وممكن يطلّع non-projective لو استخدمنا MST. أبطأ وأغلى.</p>'+
     '<div class="m">20-word sentence\ntransition-based: 2 x 20 = 40 steps\ngraph-based:      20 x 20 = 400 arc scores</div>'+
     '<p>غلطة شائعة: تفتكر إن واحدة منهم دايمًا أدق. مع الشبكات العصبية الحديثة الاتنين غالبًا قريبين من بعض، والاختيار بيبقى مقايضة بين السرعة والبساطة ونظرة شاملة على الجملة.</p>',
     '<p>Both produce the same kind of parse, but they think differently:</p>'+
     '<p><mark>Transition-based</mark>: builds the tree step by step with local decisions. Very fast (linear, 2n steps), but an early mistake can carry over to later steps (<mark>error propagation</mark>), and arc-standard only produces projective parses.</p>'+
     '<p><mark>Graph-based</mark>: scores all possible arcs and picks the best complete tree, so it sees the whole sentence, and it can produce non-projective parses with MST. Slower and more expensive.</p>'+
     '<div class="m">20-word sentence\ntransition-based: 2 x 20 = 40 steps\ngraph-based:      20 x 20 = 400 arc scores</div>'+
     '<p>A common mistake is to assume one of them is always more accurate. With modern neural networks the two are often close, and the choice is a trade-off between speed and simplicity versus a global view of the sentence.</p>'),
 q:[
   CQ("إيه ميزة الـ graph-based مقارنةً بالـ transition-based؟","What is an advantage of graph-based over transition-based parsing?",
      [["بيبص على الجملة كلها ويختار أحسن شجرة كاملة","It looks at the whole sentence and picks the best complete tree"],["أسرع دايمًا","It is always faster"],["مش محتاج scores","It does not need scores"],["بيحتاج stack و buffer","It needs a stack and a buffer"]],
      0,"الـ graph-based بيقارن الأشجار الكاملة بدل قرارات محلية، لكنه أبطأ.","Graph-based compares complete trees instead of local decisions, but it is slower."),
   CQ("جملة من 30 كلمة: كام خطوة للـ transition-based (arc-standard) وكام arc score للـ graph-based؟","A 30-word sentence: how many steps for transition-based (arc-standard) and how many arc scores for graph-based?",
      [["30 خطوة و 30 score","30 steps and 30 scores"],["900 خطوة و 60 score","900 steps and 60 scores"],["60 خطوة و 60 score","60 steps and 60 scores"],["60 خطوة و 900 score","60 steps and 900 scores"]],
      3,"2 × 30 = 60 خطوة، و 30 × 30 = 900 score.","2 × 30 = 60 steps, and 30 × 30 = 900 scores.")
 ],
 f:[
   CF("إيه هو الـ error propagation في transition-based؟","What is error propagation in transition-based parsing?",
      "غلطة في قرار مبكر بتبوّظ القرارات اللي بعدها، لأن كل قرار بيعتمد على الحالة اللي قبله.","A mistake in an early decision spoils later decisions, because each decision depends on the state before it."),
   CF("إيه المقايضة الأساسية بين transition-based و graph-based؟","What is the main trade-off between transition-based and graph-based parsing?",
      "الأول سريع وبسيط (خطي) بقرارات محلية، والتاني بيبص على الجملة كلها لكن أبطأ (حوالي n² score).","The first is fast and simple (linear) with local decisions, the second sees the whole sentence but is slower (about n² scores).")
 ],
 terms:[
   {t:B("Error propagation","Error propagation"),
    d:B("غلطة في قرار مبكر بتأثر على القرارات اللي بعدها.","A mistake in an early decision that affects later decisions.")}
 ]},

{id:"l4-uaslas",t:B("تقييم الـ parser: UAS و LAS","Evaluating a parser: UAS and LAS"),
 b:cat(B('<p>بنقارن الـ parse اللي طلع بالـ parse الصحيح من <mark>treebank</mark> (جمل اتعلّمت يدويًا، زي Universal Dependencies).</p>'+
     '<p><mark>UAS</mark> (Unlabeled Attachment Score): نسبة الكلمات اللي الـ head بتاعها طلع صح.<br><mark>LAS</mark> (Labeled Attachment Score): نسبة الكلمات اللي الـ head <mark>واسم العلاقة</mark> بتوعها طلعوا صح.</p>'+
     '<div class="m">10-word sentence\n8 correct heads            -> UAS = 80%\n7 correct head + label      -> LAS = 70%</div>'+
     '<p>الـ LAS دايمًا أقل من أو يساوي الـ UAS لأنها أصعب.</p>',
     '<p>We compare the predicted parse with the gold parse from a <mark>treebank</mark> (sentences annotated by hand, such as Universal Dependencies).</p>'+
     '<p><mark>UAS</mark> (Unlabeled Attachment Score): the share of words whose head is correct.<br><mark>LAS</mark> (Labeled Attachment Score): the share of words whose head <mark>and relation label</mark> are both correct.</p>'+
     '<div class="m">10-word sentence\n8 correct heads            -> UAS = 80%\n7 correct head + label      -> LAS = 70%</div>'+
     '<p>LAS is always less than or equal to UAS because it is harder.</p>'),
       B('<p>مثال كامل على <code>She saw the video lecture</code> (5 كلمات):</p>'+
  '<div class="m">word     gold head  predicted  head  label\nShe      saw        saw        ok    ok\nsaw      ROOT       ROOT       ok    ok\nthe      lecture    lecture    ok    ok\nvideo    lecture    saw        no    -\nlecture  saw        saw        ok    no (nmod, not obj)\nUAS = 4/5 = 80%     LAS = 3/5 = 60%</div>'+
  '<p>ملاحظة: بعض إعدادات التقييم بتتجاهل علامات الترقيم، فاتأكد من الإعداد قبل ما تقارن أرقام.</p>',
  '<p>A full example on <code>She saw the video lecture</code> (5 words):</p>'+
  '<div class="m">word     gold head  predicted  head  label\nShe      saw        saw        ok    ok\nsaw      ROOT       ROOT       ok    ok\nthe      lecture    lecture    ok    ok\nvideo    lecture    saw        no    -\nlecture  saw        saw        ok    no (nmod, not obj)\nUAS = 4/5 = 80%     LAS = 3/5 = 60%</div>'+
  '<p>Note: some evaluation setups ignore punctuation tokens, so check the setup before comparing numbers.</p>')),
 q:[
   CQ("parse لجملة فيها 20 كلمة، 17 head طلعوا صح. كام الـ UAS؟","A parse of a 20-word sentence gets 17 heads right. What is the UAS?",
      [["85%","85%"],["17%","17%"],["20%","20%"],["15%","15%"]],
      0,"17 ÷ 20 = 0.85.","17 ÷ 20 = 0.85."),
   CQ("ليه الـ LAS دايمًا أقل من أو يساوي الـ UAS؟","Why is LAS always less than or equal to UAS?",
   [["لأن الـ LAS بتتحسب على كلمات أقل","Because LAS is computed on fewer words"],["لأن الـ LAS بتتجاهل الـ heads","Because LAS ignores the heads"],["لأنها بتشترط الـ head والـ label الاتنين صح، وده شرط أصعب","Because it requires both the head and the label to be correct, which is harder"],["لأن الـ UAS بتعدّ ROOT مرتين","Because UAS counts ROOT twice"]],
   2,"أي كلمة محسوبة صح في الـ LAS لازم تكون محسوبة صح في الـ UAS كمان، لكن العكس مش بالضرورة.","Any word counted correct in LAS is also correct in UAS, but not the other way around.")
 ],
 f:[
   CF("إيه الفرق بين UAS و LAS؟","What is the difference between UAS and LAS?",
      "UAS: نسبة الـ heads الصح. LAS: نسبة الكلمات اللي الـ head واسم العلاقة صح. LAS ≤ UAS.","UAS: share of correct heads. LAS: share of words with both the head and the label correct. LAS ≤ UAS."),
   CF("إيه الـ treebank؟","What is a treebank?",
   "مجموعة جمل اتعلّم عليها الـ parse الصحيح يدويًا، وبنقارن بيها ناتج الـ parser.","A collection of sentences with hand-annotated gold parses, which we compare the parser output against.")
 ],
 terms:[
   {t:B("Treebank","Treebank"),
 d:B("مجموعة جمل اتعلّم عليها الـ parse الصحيح يدويًا، زي Universal Dependencies.","A collection of sentences with hand-annotated gold parses, such as Universal Dependencies.")},
{t:B("UAS","UAS"),
 d:B("Unlabeled Attachment Score: نسبة الكلمات اللي الـ head بتاعها صح.","Unlabeled Attachment Score: the share of words whose head is correct.")},
{t:B("LAS","LAS"),
 d:B("Labeled Attachment Score: نسبة الكلمات اللي الـ head واسم العلاقة بتوعها صح.","Labeled Attachment Score: the share of words whose head and relation label are both correct.")}
 ]},

{id:"l4-recap",
 t:B("Recap: Dependency Parsing","Recap: Dependency Parsing"),
 b:B('<p><mark>5 نقاط:</mark><br>1. الـ parse شجرة: كل كلمة ليها head واحد، ومفيش cycles، وفيه ROOT.<br>2. projective يعني مفيش أسهم متقاطعة، والـ arc-standard بيطلّع projective بس.<br>3. الـ transition-based بيستخدم stack و buffer وأكشنز SHIFT و LEFT-ARC و RIGHT-ARC، في 2n خطوة.<br>4. الـ neural parser بيختار الأكشن من embeddings، والـ graph-based بيدي score لكل سهم ويختار أحسن شجرة.<br>5. بنقيّم بـ UAS (الـ head بس) و LAS (الـ head والـ label)، و LAS ≤ UAS.</p>'+
     '<p><mark>أهم الأرقام والمعادلات:</mark></p>'+
     '<div class="m">arrows  = n       (n words, with the ROOT arrow)\nsteps   = 2n      (n SHIFT + n ARC)\nUAS = correct heads / n\nLAS = correct heads and labels / n\nlabeled actions = 2 x labels + 1\ngraph-based: n x n arc scores</div>'+
     '<p><mark>قبل المحاضرة الجاية (L5):</mark> اتأكد إنك فاهم الـ word vectors (L1) والـ softmax والـ cross-entropy (L2) والـ neural networks (L3)، لأن المحاضرة الجاية بتبني عليهم.</p>',
     '<p><mark>5 points:</mark><br>1. A parse is a tree: every word has one head, there are no cycles, and there is a ROOT.<br>2. Projective means no crossing arrows, and arc-standard only produces projective parses.<br>3. Transition-based parsing uses a stack, a buffer and the actions SHIFT, LEFT-ARC and RIGHT-ARC, in 2n steps.<br>4. The neural parser picks the action from embeddings, and the graph-based parser scores every arc and picks the best tree.<br>5. We evaluate with UAS (head only) and LAS (head and label), and LAS ≤ UAS.</p>'+
     '<p><mark>Key numbers and equations:</mark></p>'+
     '<div class="m">arrows  = n       (n words, with the ROOT arrow)\nsteps   = 2n      (n SHIFT + n ARC)\nUAS = correct heads / n\nLAS = correct heads and labels / n\nlabeled actions = 2 x labels + 1\ngraph-based: n x n arc scores</div>'+
     '<p><mark>Before the next lecture (L5):</mark> make sure you are comfortable with word vectors (L1), softmax and cross-entropy (L2), and neural networks (L3), because the next lecture builds on them.</p>'),
 q:[
   CQ("أنهي جملة صح عن الـ arc-standard parser؟","Which statement about the arc-standard parser is correct?",
      [["بينتج parses non-projective بس","It produces non-projective parses only"],["بينتج parses projective بس","It produces projective parses only"],["بيحتاج n × n score","It needs n × n scores"],["مش بيستخدم stack","It does not use a stack"]],
      1,"الـ arc-standard بيبني parses من غير أسهم متقاطعة، يعني projective.","Arc-standard builds parses without crossing arrows, which means projective."),
   CQ("10 كلمات: 8 head صح، و 6 كلمات الـ head والـ label بتوعها صح. كام UAS و LAS؟","10 words: 8 heads are correct, and 6 words have both head and label correct. What are UAS and LAS?",
      [["80% و 60%","80% and 60%"],["60% و 80%","60% and 80%"],["80% و 80%","80% and 80%"],["8% و 6%","8% and 6%"]],
      0,"UAS = 8 ÷ 10 = 80%، و LAS = 6 ÷ 10 = 60%.","UAS = 8 ÷ 10 = 80%, and LAS = 6 ÷ 10 = 60%.")
 ],
 f:[
   CF("إيه الفرق بين transition-based و graph-based في جملة واحدة؟","What is the difference between transition-based and graph-based parsing in one sentence?",
      "الأول بيبني الشجرة بأكشنز خطوة خطوة (سريع)، والتاني بيدي score لكل سهم ويختار أحسن شجرة كاملة.","The first builds the tree with actions step by step (fast), the second scores every arc and picks the best complete tree."),
   CF("إيه المعادلات الأساسية في الـ dependency parsing؟","What are the key numbers in dependency parsing?",
      "عدد الأسهم = n، وخطوات arc-standard = 2n، و UAS = heads صح ÷ n، و LAS = heads و labels صح ÷ n.","Arrows = n, arc-standard steps = 2n, UAS = correct heads ÷ n, LAS = correct heads and labels ÷ n.")
 ]}
]}
);

})();
