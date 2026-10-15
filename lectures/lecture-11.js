/* Lecture 11: Parameter-Efficient Fine-Tuning & Prompting
   Content of this lecture only: figures first, then the lecture object (cards, quizzes, flashcards).
   Shared helpers (B, fig, T, AR, ...) live in ../assets/helpers.js. */
(function(){

/* L11 fig: training memory, full fine-tuning vs LoRA (7B model) */
function memFig(){
  var s='',k=2.5,x0=14,xs;
  s+=T(14,16,'full fine-tuning (7B, Adam, mixed precision)','tm','start','font-size:10.5px');
  s+=RECT(x0,24,35,34,'var(--sf)','var(--mu)',0,1.5)+T(x0+17.5,45,'W 14','tb','middle','font-size:10px');
  s+=RECT(x0+35,24,35,34,'var(--okbg)','var(--ok)',0,1.5)+T(x0+52.5,45,'G 14','tb','middle','font-size:10px');
  s+=RECT(x0+70,24,210,34,'var(--nobg)','var(--no)',0,1.5)+T(x0+175,45,'optimizer + fp32: 84','tb','middle','font-size:10.5px');
  s+=T(x0+286,45,'112 GB','tb','start','font-size:11px');
  s+=T(14,90,'LoRA (same model)','tm','start','font-size:10.5px');
  s+=RECT(x0,98,35,34,'var(--sf)','var(--mu)',0,1.5)+T(x0+17.5,119,'W 14','tb','middle','font-size:10px');
  s+=RECT(x0+35,98,4,34,'var(--acs)','var(--ac)',0,1.5);
  s+=T(x0+48,119,'about 16 GB','tb','start','font-size:11px;fill:var(--ok)');
  s+=RECT(14,150,12,12,'var(--sf)','var(--mu)',3,1.5)+T(32,160,'weights','','start','font-size:10.5px');
  s+=RECT(100,150,12,12,'var(--okbg)','var(--ok)',3,1.5)+T(118,160,'gradients','','start','font-size:10.5px');
  s+=RECT(196,150,12,12,'var(--nobg)','var(--no)',3,1.5)+T(214,160,'optimizer','','start','font-size:10.5px');
  s+=RECT(286,150,12,12,'var(--acs)','var(--ac)',3,1.5)+T(304,160,'LoRA','','start','font-size:10.5px');
  s+=T(14,188,'activation memory not counted','tm','start','font-size:10.5px');
  return s;
}

var FIG_MEM=fig(200,memFig(),
  B('تدريب موديل 7B بالكامل بـ Adam محتاج حوالي 112 GB (الأوزان والـ gradients وحالات الـ optimizer). مع LoRA الأوزان متجمّدة والمتدرّب شريحة صغيرة جدًا، فالإجمالي حوالي 16 GB.',
    'Fully training a 7B model with Adam needs about 112 GB (weights, gradients and optimizer states). With LoRA the weights are frozen and the trained part is a tiny slice, so the total is about 16 GB.'));

/* L11 fig: LoRA */
function loraFig(){
  var s='';
  s+=RECT(8,88,44,28,'var(--sf)','var(--ln)',7,1.6)+T(30,106,'x','tb','middle');
  s+=RECT(96,22,110,44,'var(--sf)','var(--mu)',9,1.8)+T(151,41,'W (frozen)','tb','middle','font-size:11px')+T(151,57,'d × k','tm','middle','font-size:10.5px');
  s+=AL(52,96,94,48,'mu','mM');
  s+=RECT(96,128,44,40,'var(--acs)','var(--ac)',8,1.8)+T(118,146,'A','tb','middle','font-size:12px')+T(118,161,'r × k','tm','middle','font-size:10px');
  s+=RECT(166,128,44,40,'var(--acs)','var(--ac)',8,1.8)+T(188,146,'B','tb','middle','font-size:12px')+T(188,161,'d × r','tm','middle','font-size:10px');
  s+=AL(52,108,94,146,'mu','mM')+AL(140,148,165,148,'ac','mA');
  s+='<circle cx="262" cy="108" r="13" style="fill:var(--sf);stroke:var(--ok);stroke-width:2"/>'+T(262,113,'+','tb','middle');
  s+=AL(206,48,252,100,'mu','mM')+AL(210,150,252,116,'ac','mA');
  s+=AL(275,108,306,108,'ok','mG')+T(322,112,'h','tb','middle');
  s+=T(180,198,'h = W x + (alpha / r) B A x','tb','middle','font-size:11px');
  s+=T(180,214,'B = 0 at the start, so h = W x','tm','middle','font-size:10.5px');
  return s;
}

var FIG_LORA=fig(226,loraFig(),
  B('الـ W متجمّد. بنضيف فرع صغير من مصفوفتين A و B بـ rank صغير r، وده الوحيد اللي بيتدرّب. الفرعين بيتجمعوا في الناتج.',
    'W is frozen. We add a small branch of two matrices A and B with a small rank r, and that is the only part trained. The two branches are summed in the output.'));

/* L11 fig: quantization, bits per weight vs model size (7B) */
function quantFig(){
  var s='',R=[['16-bit',230,'var(--sf)','var(--mu)','14 GB'],['8-bit',115,'var(--acs)','var(--ac)','7 GB'],['4-bit',57,'var(--okbg)','var(--ok)','3.5 GB']],i,y;
  for(i=0;i<3;i++){
    y=14+i*40;
    s+=T(14,y+20,R[i][0],'tb','start','font-size:11px')+RECT(62,y,R[i][1],30,R[i][2],R[i][3],6,1.6)+T(62+R[i][1]+8,y+20,R[i][4],'tb','start','font-size:11px');
  }
  s+=T(14,146,'7B weights: 7e9 * bytes per weight','tm','start','font-size:10.5px');
  return s;
}

var FIG_QUANT=fig(158,quantFig(),
  B('نفس موديل 7B بدقة 16 و8 و4 bit: الحجم 14 و7 و3.5 GB.',
    'The same 7B model at 16, 8 and 4 bits: 14, 7 and 3.5 GB.'));

/* L11 fig: prompt tuning with soft prompts */
function softFig(){
  var s='',i,x,TK=['I','loved','it'],cx=[34,78,122,189,253,317];
  s+=T(14,16,'trained','tb','start','font-size:10.5px;fill:var(--ac)')+T(160,16,'frozen input embeddings','tm','start','font-size:10.5px');
  for(i=0;i<3;i++){x=14+i*44;s+=RECT(x,24,40,32,'var(--acs)','var(--ac)',7,1.8)+T(x+20,44,'p'+(i+1),'tb','middle','font-size:11px');}
  for(i=0;i<3;i++){x=160+i*64;s+=RECT(x,24,58,32,'var(--sf)','var(--mu)',7,1.6)+T(x+29,44,TK[i],'','middle','font-size:11px');}
  for(i=0;i<6;i++)s+=AL(cx[i],56,cx[i],92,'mu','mM');
  s+=RECT(14,94,332,40,'var(--sf)','var(--mu)',10,1.8)+T(180,119,'frozen language model','tb','middle','font-size:11.5px');
  s+=AL(180,134,180,158,'ok','mG');
  s+=RECT(130,160,100,28,'var(--okbg)','var(--ok)',8,1.8)+T(180,179,'positive','tb','middle','font-size:11px;fill:var(--ok)');
  s+=T(180,208,'only p1 ... pk receive updates','tm','middle','font-size:10.5px');
  return s;
}

var FIG_SOFT=fig(218,softFig(),
  B('في الـ prompt tuning بنحط k vectors متعلَّمة (p1 إلى pk) قبل الـ embeddings بتاعة الكلام. الموديل كله متجمّد وبس الـ vectors دي هي اللي بتتدرّب.',
    'In prompt tuning we put k learned vectors (p1 to pk) before the text embeddings. The whole model is frozen and only these vectors are trained.'));

/* L11 fig: anatomy of a prompt */
function promptFig(){
  var s='',R=[['instruction','Classify the sentiment.','var(--acs)','var(--ac)'],['context','(documents, if any)','var(--sf)','var(--ln)'],['examples','great → positive','var(--sf)','var(--ln)'],['input','fine → ?','var(--sf)','var(--ln)'],['output format','Answer: one word','var(--okbg)','var(--ok)']],i,y;
  for(i=0;i<5;i++){
    y=10+i*40;
    s+=RECT(14,y,332,32,R[i][2],R[i][3],8,1.6)+T(24,y+20,R[i][0],'tb','start','font-size:11px')+T(140,y+20,R[i][1],'','start','font-size:11px');
  }
  return s;
}

var FIG_PROMPT=fig(214,promptFig(),
  B('الـ prompt الكويس بيتكوّن من أجزاء: تعليمات، وسياق لو لازم، وأمثلة، والمدخل نفسه، وشكل المخرج المطلوب.',
    'A good prompt is made of parts: an instruction, context if needed, examples, the input itself, and the required output format.'));

/* L11 fig: chain of thought */
function cotFig(){
  var s='';
  s+=RECT(14,10,332,34,'var(--sf)','var(--ln)',8,1.4)+T(180,31,'Q: 5 balls + 2 cans of 3 balls. Total?','','middle','font-size:11px');
  s+=AL(89,44,89,60,'mu','mM')+AL(268,44,268,60,'mu','mM');
  s+=RECT(14,62,150,34,'var(--nobg)','var(--no)',8,1.8)+T(89,83,'A: 8 (wrong)','tb','middle','font-size:11.5px;fill:var(--no)');
  s+=T(89,116,'no intermediate steps','tm','middle','font-size:10.5px');
  s+=RECT(190,62,156,96,'var(--okbg)','var(--ok)',8,1.8)+T(200,80,'step by step','tb','start','font-size:11px')+
     T(200,99,'2 cans × 3 = 6','','start','font-size:11px')+T(200,116,'5 + 6 = 11','','start','font-size:11px')+
     T(200,145,'A: 11 (right)','tb','start','font-size:11.5px;fill:var(--ok)');
  return s;
}

var FIG_COT=fig(172,cotFig(),
  B('من غير خطوات، الموديل بيقفز للإجابة وممكن يغلط. مع الـ chain of thought بيكتب الخطوات الوسيطة، وكل خطوة بتبقى أسهل من المسألة كلها.',
    'Without steps the model jumps to an answer and may be wrong. With chain of thought it writes the intermediate steps, and each step is easier than the whole problem.'));

/* L11 fig: ladder of adaptation options */
function ladderFig(){
  var s='',N=[['prompting','cheap, no training'],['RAG','fresh or private facts'],['LoRA / PEFT','style, format, behavior'],['full fine-tune','new domain, lots of data']],i,y;
  for(i=0;i<4;i++){
    y=14+i*62;
    s+=RECT(14,y,140,36,i===0?'var(--okbg)':'var(--sf)',i===0?'var(--ok)':'var(--ac)',9,1.8)+T(84,y+23,N[i][0],'tb','middle','font-size:11.5px')+T(168,y+22,N[i][1],'tm','start','font-size:10.5px');
    if(i<3)s+=AL(84,y+36,84,y+61,'mu','mM');
  }
  s+=T(14,258,'start at the top; move down only if it fails','tm','start','font-size:10.5px');
  return s;
}

var FIG_LADDER=fig(270,ladderFig(),
  B('ابدأ بالأرخص (prompting) وانزل لتحت بس لما اللي فوق مايكفيش. كل خطوة بتزود التكلفة والتحكم.',
    'Start with the cheapest (prompting) and move down only when the option above is not enough. Each step adds cost and control.'));

/* ---------- Lecture content ---------- */
/* L11 fig: LoRA parameter count by target layers (7B-class shapes, r = 8, 32 layers) */
function l11CapFig(){
  var r=8,d=4096,ff=11008,L=32,s='';
  var lo=function(a,b){return r*(a+b);};
  var fmt=function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');};
  var attn=4*lo(d,d)*L, all=attn+3*lo(d,ff)*L;
  var rows=[['q, v',2*lo(d,d)*L,'var(--sf)','var(--mu)'],
            ['q, k, v, o (attention only)',attn,'var(--acs)','var(--ac)'],
            ['all linear (attention + MLP)',all,'var(--okbg)','var(--ok)']];
  s+=T(14,16,'LoRA parameters, r = 8, 32 layers','tm','start','font-size:10.5px');
  for(var i=0;i<rows.length;i++){
    var ly=38+i*46,w=rows[i][1]/all*200;
    s+=T(14,ly,rows[i][0],'','start','font-size:10.5px');
    s+=RECT(14,ly+6,w.toFixed(1),20,rows[i][2],rows[i][3],0,1.5);
    s+=T(14+w+6,ly+21,fmt(rows[i][1]),'tb','start','font-size:11px');
  }
  s+=T(14,172,'d = 4096, MLP width 11008, gated MLP (3 matrices)','tm','start','font-size:10px');
  return s;
}
var FIG_CAP=fig(184,l11CapFig(),
  B('عدد parameters في LoRA حسب الطبقات اللي بنطبّقها عليها: الـ MLP لوحدها أكبر من الـ attention.',
    'LoRA parameter count by the layers it is applied to: the MLP alone is larger than attention.'));

/* L11 fig: iterative magnitude pruning loop and the weights left after n rounds of 20% */
function l11PruneFig(){
  var s='',bx=[14,138,262],lab=['train','prune 20%','rewind'];
  for(var i=0;i<3;i++){
    s+=RECT(bx[i],14,84,32,i===1?'var(--nobg)':'var(--sf)',i===1?'var(--no)':'var(--ln)',8)+T(bx[i]+42,34,lab[i],'tb','middle','font-size:11px');
    if(i<2)s+=AR(bx[i]+84,30,bx[i+1],30,'ac','mA');
  }
  s+='<path d="M304 46 L304 62 L56 62 L56 48" style="fill:none;stroke:var(--ac);stroke-width:2;stroke-dasharray:5 4" marker-end="url(#mA)"/>';
  s+=T(180,78,'repeat','tm','middle','font-size:10px');
  s+=T(14,100,'weights left after n rounds','tm','start','font-size:10.5px');
  var ns=[0,1,5,10];
  for(var j=0;j<ns.length;j++){
    var p=100*Math.pow(0.8,ns[j]),y=108+j*22,w=p*2.2;
    s+=T(14,y+12,'n = '+ns[j],'','start','font-size:10.5px');
    s+=RECT(56,y,w.toFixed(1),14,j===3?'var(--okbg)':'var(--acs)',j===3?'var(--ok)':'var(--ac)',0,1.5);
    s+=T(56+w+6,y+12,(ns[j]===0?'100':p.toFixed(1).replace(/\.0$/,''))+'%','tb','start','font-size:11px');
  }
  return s;
}
var FIG_PRUNE=fig(204,l11PruneFig(),
  B('كل جولة بتشيل 20% من الأوزان الباقية، فالباقي بيقل بشكل أسّي.',
    'Each round removes 20% of the remaining weights, so what is left shrinks exponentially.'));

(window.LECS=window.LECS||[]).push(
{id:11,t:B("Fine-tuning الخفيف و Prompting","Parameter-Efficient Fine-Tuning & Prompting"),cards:[


{id:"l11-whypeft",t:B("ليه Parameter-Efficient Fine-Tuning؟","Why parameter-efficient fine-tuning?"),
 b:cat(B('<p>الـ fine-tuning الكامل بيحدّث كل الأوزان، وده غالي لتلات أسباب: <mark>الذاكرة</mark> (الـ gradients وحالات الـ optimizer بتتخزّن مع الأوزان)، <mark>التخزين</mark> (نسخة كاملة من الموديل لكل مهمة)، و<mark>الـ forgetting</mark> (تحديث كل حاجة بداتا قليلة ممكن يمسح معرفة الـ pretraining ويعمل overfitting).</p>'+
         '<p>مثال ذاكرة لموديل 7B parameter. الأوزان بدقة 16 bit: <code>7e9 * 2 bytes = 14 GB</code>. التدريب بـ Adam بدقة مختلطة بيحتاج تقريبًا <mark>16 byte لكل parameter</mark> (أوزان 2 + gradients 2 + نسخة fp32 وحالتين للـ Adam بـ 12):</p>'+
         '<div class="m">7e9 * 16 bytes = 112 GB   (من غير الـ activations)</div>',
         '<p>Full fine-tuning updates all weights, and that is expensive for three reasons: <mark>memory</mark> (the gradients and optimizer states are stored alongside the weights), <mark>storage</mark> (a full copy of the model per task), and <mark>forgetting</mark> (updating everything with little data can erase pretraining knowledge and overfit).</p>'+
         '<p>A memory example for a 7B-parameter model. The weights at 16-bit precision: <code>7e9 * 2 bytes = 14 GB</code>. Training with Adam in mixed precision needs roughly <mark>16 bytes per parameter</mark> (weights 2 + gradients 2 + an fp32 copy and two Adam states totaling 12):</p>'+
         '<div class="m">7e9 * 16 bytes = 112 GB   (without activations)</div>'),
       FIG_MEM,
       B('<p>الحل: <mark>PEFT</mark>. بنجمّد معظم الأوزان ونتدرّب على جزء صغير جدًا (غالبًا أقل من 1%). الـ gradients وحالات الـ optimizer بتتحسب للجزء الصغير ده بس، فالذاكرة بتقرّب من حجم الأوزان نفسها. والإضافة المتدرّبة صغيرة (ميجابايتات)، فنقدر نحتفظ بإضافة لكل مهمة على نفس الموديل الأساسي.</p>',
         '<p>The solution: <mark>PEFT</mark>. We freeze most of the weights and train a very small part (often under 1%). The gradients and optimizer states are computed only for that small part, so memory approaches the size of the weights alone. And the trained addition is small (megabytes), so we can keep one addition per task on the same base model.</p>')),
 q:[
   CQ("ليه تدريب Adam بيحتاج ذاكرة أكتر بكتير من حجم الأوزان؟","Why does Adam training need much more memory than the weights alone?",
      [["لأن الأوزان بتتكرر في كل batch","Because the weights are repeated in every batch"],["لأن الـ tokenizer بيكبّر الموديل","Because the tokenizer enlarges the model"],["لأنه بيخزّن كمان الـ gradients وحالات الـ optimizer ونسخة fp32","Because it also stores the gradients, the optimizer states and an fp32 copy"],["لأن الـ attention بيحتاج n × n","Because attention needs n × n"]],
      2,"حوالي 16 byte لكل parameter مقابل 2 byte للأوزان بدقة 16 bit.","About 16 bytes per parameter versus 2 bytes for the weights at 16-bit precision."),
   CQ("تدريب كامل بـ Adam لموديل 3B بحوالي 16 byte لكل parameter يحتاج تقريبًا كام؟","Full training of a 3B model with Adam at about 16 bytes per parameter needs roughly how much?",
   [["6 GB","6 GB"],["12 GB","12 GB"],["96 GB","96 GB"],["48 GB","48 GB"]],
   3,"3e9 * 16 bytes = 48 GB (من غير الـ activations).","3e9 * 16 bytes = 48 GB (without activations).")
 ],
 f:[
   CF("ليه محتاجين PEFT؟","Why do we need PEFT?",
      "عشان الـ fine-tuning الكامل غالي في الذاكرة (حوالي 16 byte لكل parameter) والتخزين (نسخة لكل مهمة) وبيعرّض للـ forgetting. PEFT بيجمّد الأوزان ويتدرّب على جزء صغير.","Because full fine-tuning is costly in memory (about 16 bytes per parameter) and storage (a copy per task) and risks forgetting. PEFT freezes the weights and trains a small part."),
   CF("كام byte لكل parameter في تدريب Adam بدقة مختلطة؟","How many bytes per parameter does Adam training in mixed precision need?",
   "حوالي 16: أوزان 2 + gradients 2 + نسخة fp32 وحالتين للـ Adam بـ 12.","About 16: weights 2 + gradients 2 + an fp32 copy and two Adam states totaling 12.")
 ],
 terms:[
   {t:B("Full fine-tuning","Full fine-tuning"),
   d:B("تحديث كل أوزان الموديل على المهمة الجديدة.","Updating all the model weights on the new task.")},
   {t:B("PEFT","PEFT"),
   d:B("Parameter-Efficient Fine-Tuning: بنجمّد معظم الأوزان ونتدرّب على جزء صغير جدًا منها.","Parameter-Efficient Fine-Tuning: we freeze most of the weights and train only a very small part.")},
   {t:B("Forgetting","Forgetting"),
   d:B("ضياع معرفة الـ pretraining لما نحدّث كل الأوزان بداتا قليلة.","Losing pretraining knowledge when all the weights are updated on little data.")}
 ]},

{id:"l11-lora",t:B("عائلات PEFT و LoRA","PEFT families and LoRA"),
 b:cat(B('<p>التقنيات بتنقسم لتلات عائلات:<br>• <mark>Additive</mark>: بنضيف parameters جديدة (adapters و soft prompts).<br>• <mark>Selective</mark>: نتدرّب على جزء من الموجود (زي الـ biases بس).<br>• <mark>Reparameterization</mark>: نعبّر عن التحديث بشكل صغير (LoRA).</p>'+
         '<p>فرضية <mark>LoRA</mark>: التحديث <code>delta W</code> اللي الـ fine-tuning بيعمله على مصفوفة وزن له <mark>rank منخفض</mark>. فبدل ما نتعلم <code>delta W</code> كاملة (d × k)، بنعبّر عنها بحاصل ضرب مصفوفتين صغيرتين:</p>'+
         '<div class="m">W\' = W + (alpha / r) * B A\nB: d x r     A: r x k     r much smaller than d, k</div>',
         '<p>The techniques fall into three families:<br>• <mark>Additive</mark>: we add new parameters (adapters and soft prompts).<br>• <mark>Selective</mark>: we train a subset of the existing ones (such as only the biases).<br>• <mark>Reparameterization</mark>: we express the update in a compact form (LoRA).</p>'+
         '<p>The <mark>LoRA</mark> hypothesis: the update <code>delta W</code> that fine-tuning makes to a weight matrix has a <mark>low rank</mark>. So instead of learning a full <code>delta W</code> (d × k), we express it as the product of two small matrices:</p>'+
         '<div class="m">W\' = W + (alpha / r) * B A\nB: d x r     A: r x k     r much smaller than d, k</div>'),
       FIG_LORA,
       B('<p>التهيئة: <code>A</code> عشوائية و <code>B</code> أصفار، فـ <code>B A = 0</code> في البداية والموديل بيبدأ <mark>مطابق للأصلي</mark> بالظبط. الـ <code>alpha / r</code> معامل scale. مثال: <code>alpha = 16</code> و <code>r = 8</code> يعني scale = 2.</p>',
         '<p>Initialization: <code>A</code> is random and <code>B</code> is zeros, so <code>B A = 0</code> at the start and the model begins <mark>identical to the original</mark>. The <code>alpha / r</code> factor is a scale. An example: <code>alpha = 16</code> and <code>r = 8</code> gives scale = 2.</p>')),
 q:[
   CQ("ليه في LoRA بنبدأ بـ B = 0؟","Why does LoRA start with B = 0?",
      [["عشان الموديل يبدأ مطابق للموديل الأصلي (delta W = 0)","So the model starts identical to the original (delta W = 0)"],["عشان نقلل عدد الـ parameters","To reduce the number of parameters"],["عشان نمنع الـ merge","To prevent merging"],["عشان A ما تتدرّبش","So A is not trained"]],
      0,"B A = 0 في البداية، فالتدريب يبدأ من نقطة الموديل المتدرّب مسبقًا من غير ما نبوّظه.","B A = 0 at the start, so training begins from the pretrained model without breaking it."),
   CQ("لو alpha = 32 و r = 4، كام الـ scale (alpha / r)؟","If alpha = 32 and r = 4, what is the scale (alpha / r)?",
   [["0.125","0.125"],["8","8"],["36","36"],["128","128"]],
   1,"32 / 4 = 8.","32 / 4 = 8.")
 ],
 f:[
   CF("إيه فكرة LoRA وإيه مميزاتها؟","What is the idea of LoRA and its advantages?",
      "نجمّد W ونتعلم تحديث بـ rank منخفض B A (حوالي 0.4% من parameters المصفوفة عند r = 8). ممكن ندمجه بعد التدريب من غير تأخير، ونبدّل adapters بين المهام.","Freeze W and learn a low-rank update B A (about 0.4% of the matrix parameters at r = 8). It can be merged after training with no delay, and adapters can be swapped between tasks."),
   CF("إيه عائلات الـ PEFT التلاتة؟","What are the three PEFT families?",
   "Additive: نضيف parameters جديدة (adapters وsoft prompts). Selective: نتدرّب على جزء من الموجود (زي الـ biases). Reparameterization: نعبّر عن التحديث بشكل صغير (LoRA).",
   "Additive: add new parameters (adapters and soft prompts). Selective: train a subset of the existing ones (such as the biases). Reparameterization: express the update in a compact form (LoRA).")
 ],
 terms:[
   {t:B("LoRA","LoRA"),
   d:B("Low-Rank Adaptation: بنجمّد W ونتعلم تحديث بحاصل ضرب مصفوفتين صغيرتين <code>B A</code>.","Low-Rank Adaptation: we freeze W and learn an update as the product of two small matrices <code>B A</code>.")},
   {t:B("Rank (r)","Rank (r)"),
   d:B("البُعد الصغير في <code>B</code> (d × r) و<code>A</code> (r × k). كل ما صغر قلّت الـ parameters.","The small dimension in <code>B</code> (d × r) and <code>A</code> (r × k). The smaller it is, the fewer the parameters.")},
   {t:B("PEFT families","PEFT families"),
   d:B("التلات عائلات: additive وselective وreparameterization.","The three families: additive, selective and reparameterization.")}
 ]},

{id:"l11-qlora",t:B("أرقام LoRA و Quantization و QLoRA","LoRA numbers, quantization and QLoRA"),
 b:cat(
       B('<p>مثال parameters: مصفوفة <code>4096 × 4096</code> و <code>r = 8</code>:</p>'+
         '<div class="m">full:  4096 * 4096        = 16,777,216\nLoRA:  8*4096 + 4096*8    =     65,536   (0.39%)</div>'+
         '<p>ولو طبقنا LoRA على q و v في 32 طبقة: <code>2 * 32 * 65,536 = 4,194,304</code> يعني حوالي 4.2 مليون parameter، حوالي 0.06% من موديل 7B (حوالي 8 MB بدقة 16 bit).</p>'+
         '<p>مميزات: بعد التدريب بنقدر <mark>ندمج</mark> <code>W + (alpha/r) B A</code> في مصفوفة واحدة فمفيش تأخير وقت الاستخدام، أو نسيبها منفصلة ونبدّل الـ adapters بين المهام. الـ r عادةً بين 8 و 64، وبنطبّق LoRA على مصفوفات الـ attention وغالبًا على باقي الطبقات الخطية كمان.</p>',
         '<p>A parameter example: a <code>4096 × 4096</code> matrix with <code>r = 8</code>:</p>'+
         '<div class="m">full:  4096 * 4096        = 16,777,216\nLoRA:  8*4096 + 4096*8    =     65,536   (0.39%)</div>'+
         '<p>And if we apply LoRA to q and v in 32 layers: <code>2 * 32 * 65,536 = 4,194,304</code>, about 4.2 million parameters, about 0.06% of a 7B model (about 8 MB at 16-bit precision).</p>'+
         '<p>Advantages: after training we can <mark>merge</mark> <code>W + (alpha/r) B A</code> into one matrix so there is no inference delay, or keep them separate and swap adapters between tasks. The r is usually between 8 and 64, and we apply LoRA to the attention matrices and often to the other linear layers as well.</p>'),
       FIG_QUANT,
       B('<p><mark>Quantization</mark> معناه نخزّن كل وزن بعدد bits أقل: 16 bit بياخد 2 byte، و8 bit بياخد 1، و4 bit بياخد 0.5. الأوزان بتتقرّب لمستويات قليلة مع scale لكل مجموعة صغيرة، فالتمن هو خطأ التقريب. موديل 7B بدقة 4 bit: <code>7e9 * 0.5 bytes = 3.5 GB</code>.</p>'+
         '<p>و<mark>QLoRA</mark>: الموديل الأساسي المتجمّد بيتخزّن بدقة 4 bit، وبنتدرّب LoRA بدقة أعلى فوقه. الورقة قدرت تعمل fine-tuning لموديل 65B على GPU واحد بذاكرة 48 GB.</p>',
         '<p><mark>Quantization</mark> stores each weight with fewer bits: 16-bit takes 2 bytes, 8-bit takes 1, and 4-bit takes 0.5. Weights are rounded to a few levels with a scale per small group, so the price is rounding error. A 7B model at 4-bit: <code>7e9 * 0.5 bytes = 3.5 GB</code>.</p>'+
         '<p>And <mark>QLoRA</mark>: the frozen base model is stored at 4-bit precision, and we train LoRA at higher precision on top. The paper managed to fine-tune a 65B model on a single GPU with 48 GB of memory.</p>')),
 q:[
   CQ("مصفوفة 1024 × 1024 و r = 4: كام parameter في LoRA (B و A)؟","For a 1024 × 1024 matrix with r = 4, how many LoRA parameters (B and A)?",
   [["1,048,576","1,048,576"],["4,096","4,096"],["8,192","8,192"],["16,384","16,384"]],
   2,"4*1024 + 1024*4 = 8,192.","4*1024 + 1024*4 = 8,192."),
CQ("إيه اللي بيتخزّن بدقة 4 bit في QLoRA؟","What is stored at 4-bit precision in QLoRA?",
   [["الـ adapters بتاعة LoRA بس","Only the LoRA adapters"],["الموديل الأساسي المتجمّد","The frozen base model"],["الـ gradients","The gradients"],["الـ prompt","The prompt"]],
   1,"الأساسي بيتخزّن بـ 4 bit، وLoRA بيتدرّب بدقة أعلى فوقه.","The base is stored at 4-bit, and LoRA is trained at higher precision on top of it.")
 ],
 f:[
   CF("إيه هو الـ quantization؟","What is quantization?",
   "نخزّن كل وزن بعدد bits أقل (8 أو 4 بدل 16) فالموديل يصغر، والتمن خطأ تقريب. موديل 7B بدقة 4 bit حوالي 3.5 GB.",
   "We store each weight with fewer bits (8 or 4 instead of 16), so the model shrinks, at the price of rounding error. A 7B model at 4-bit is about 3.5 GB."),
CF("إيه هو الـ QLoRA؟","What is QLoRA?",
   "موديل أساسي متجمّد بدقة 4 bit وفوقه LoRA بدقة أعلى. قدرت تضبط موديل 65B على GPU واحد بذاكرة 48 GB.",
   "A frozen 4-bit base model with LoRA trained at higher precision on top. It fine-tuned a 65B model on a single GPU with 48 GB of memory.")
 ],
 terms:[
   {t:B("Quantization","Quantization"),
 d:B("تخزين كل وزن بعدد bits أقل (8 أو 4 بدل 16) لتصغير الموديل، والتمن خطأ تقريب.","Storing each weight with fewer bits (8 or 4 instead of 16) to shrink the model, at the price of rounding error.")},
   {t:B("QLoRA","QLoRA"),
   d:B("LoRA فوق موديل أساسي متجمّد ومخزّن بدقة 4 bit.","LoRA on top of a frozen base model stored at 4-bit precision.")},
   {t:B("Merging (LoRA)","Merging (LoRA)"),
   d:B("دمج <code>W + (alpha/r) B A</code> في مصفوفة واحدة بعد التدريب، فمفيش تأخير وقت الاستخدام.","Folding <code>W + (alpha/r) B A</code> into one matrix after training, so there is no inference delay.")}
 ]},

{id:"l11-code-lora",t:B("طبقة LoRA في PyTorch","A LoRA layer in PyTorch"),
 b:cat(B('<p>طبقة LoRA بتلفّ طبقة خطية متدرّبة مسبقًا: الـ <code>W</code> المتجمّد وفرع صغير متدرّب <code>B A</code>. نفس الكلام اللي فات، دلوقتي ككود:</p>'+
         '<div class="m">import torch, torch.nn as nn\n\nclass LoRALinear(nn.Module):\n  def __init__(self, base, r=8, alpha=16):\n    super().__init__()\n    self.base = base      # W (+ bias)\n    base.requires_grad_(False)  # freeze\n    d_out, d_in = base.weight.shape\n    self.A = nn.Parameter(   # r x d_in\n        0.01 * torch.randn(r, d_in))\n    self.B = nn.Parameter(   # d_out x r\n        torch.zeros(d_out, r))   # B = 0\n    self.scale = alpha / r\n  def forward(self, x):   # (..., d_in)\n    low = (x @ self.A.T) @ self.B.T\n    return self.base(x) + self.scale*low</div>'+
         '<p>الـ <code>A</code> و <code>B</code> بس هما اللي بياخدوا gradients، و <code>B = 0</code> بيخلّي الخرج مساوي لخرج الأساسي في الخطوة صفر. لاحظ الترتيب <code>(x @ A.T) @ B.T</code>: بنصغّر x لـ r بُعد الأول (رخيص) وبعدين نرجّعه، فمش بنبني تحديث كامل d_out × d_in.</p>'+
         '<p>مثال: <code>nn.Linear(768, 3072)</code> مع <code>r = 8</code> و <code>alpha = 16</code> يعني scale = 2. الـ <code>A</code> فيها 8 × 768 = 6,144 والـ <code>B</code> فيها 3,072 × 8 = 24,576، فالمتدرّب 30,720 parameter مقابل 2,359,296 وزن متجمّد في W (غير الـ bias)، يعني حوالي 1.3% من W.</p>'+
         '<p><mark>غلطة شائعة:</mark> لو A و B الاتنين بدأوا أصفار، الـ gradient للاتنين صفر ومفيش حاجة هتتدرّب أبدًا.</p>',
         '<p>A LoRA layer wraps a pretrained linear layer: the frozen <code>W</code> plus a small trainable branch <code>B A</code>. The same idea as before, now as code:</p>'+
         '<div class="m">import torch, torch.nn as nn\n\nclass LoRALinear(nn.Module):\n  def __init__(self, base, r=8, alpha=16):\n    super().__init__()\n    self.base = base      # W (+ bias)\n    base.requires_grad_(False)  # freeze\n    d_out, d_in = base.weight.shape\n    self.A = nn.Parameter(   # r x d_in\n        0.01 * torch.randn(r, d_in))\n    self.B = nn.Parameter(   # d_out x r\n        torch.zeros(d_out, r))   # B = 0\n    self.scale = alpha / r\n  def forward(self, x):   # (..., d_in)\n    low = (x @ self.A.T) @ self.B.T\n    return self.base(x) + self.scale*low</div>'+
         '<p>Only <code>A</code> and <code>B</code> receive gradients, and <code>B = 0</code> makes the output equal the base output at step zero. Note the order <code>(x @ A.T) @ B.T</code>: we first project x down to r dimensions (cheap) and then back up, so we never build a full d_out × d_in update.</p>'+
         '<p>Example: <code>nn.Linear(768, 3072)</code> with <code>r = 8</code> and <code>alpha = 16</code> gives scale = 2. <code>A</code> has 8 × 768 = 6,144 and <code>B</code> has 3,072 × 8 = 24,576, so the trainable part is 30,720 parameters versus 2,359,296 frozen weights in W (not counting the bias), about 1.3% of W.</p>'+
         '<p><mark>Common mistake:</mark> if A and B both start at zero, both gradients are zero and nothing ever trains.</p>')),
 q:[
   CQ("ليه مش بنبدأ A و B الاتنين بأصفار؟","Why do we not start both A and B at zero?",
      [["عشان الـ gradient للاتنين هيبقى صفر ومفيش تعلم","Because both gradients would be zero and nothing would learn"],["عشان الـ scale هيبقى صفر","Because the scale would be zero"],["عشان الموديل مش هيقدر يتدمج بعد التدريب","Because the model could not be merged after training"],["عشان W هيتحدّث","Because W would be updated"]],
      0,"الـ gradient بتاع B بيعتمد على A، والـ gradient بتاع A بيعتمد على B. لو الاتنين صفر، الاتنين بيفضلوا صفر. فبنخلّي A عشوائية وB أصفار: B بتتعلم الأول وبعدها A.","The gradient of B depends on A, and the gradient of A depends on B. If both are zero, both stay zero. So A is random and B is zero: B learns first, then A."),
   CQ("طبقة LoRA حوالين nn.Linear(512, 2048) مع r = 4: كام parameter متدرّب؟","A LoRA layer around nn.Linear(512, 2048) with r = 4: how many trainable parameters?",
      [["10,240","10,240"],["1,048,576","1,048,576"],["2,560","2,560"],["4,096","4,096"]],
      0,"A: 4 × 512 = 2,048 و B: 2,048 × 4 = 8,192. المجموع 10,240 = r * (d_in + d_out).","A: 4 × 512 = 2,048 and B: 2,048 × 4 = 8,192. The total is 10,240 = r * (d_in + d_out).")
 ],
 f:[
   CF("إيه اللي بيتدرّب في طبقة LoRA بالكود؟","What is trained in a LoRA layer in code?",
      "A و B بس (requires_grad = True). الـ W والـ bias بتوع الطبقة الأساسية متجمّدين بـ requires_grad_(False).","Only A and B (requires_grad = True). The base layer W and bias are frozen with requires_grad_(False)."),
   CF("إيه شكل الـ forward في طبقة LoRA؟","What does the forward pass of a LoRA layer look like?",
      "base(x) + scale * (x @ A.T) @ B.T، مع scale = alpha / r.","base(x) + scale * (x @ A.T) @ B.T, with scale = alpha / r.")
 ],
 terms:[
   {t:B("LoRA scaling (alpha / r)","LoRA scaling (alpha / r)"),
    d:B("معامل بنضربه في فرع <code>B A</code> قبل ما يتجمع مع <code>W x</code>.","A factor that multiplies the <code>B A</code> branch before it is added to <code>W x</code>.")}
 ]},

{id:"l11-lora-capacity",t:B("امتى LoRA بتماشي الـ full fine-tuning؟","When does LoRA match full fine-tuning?"),
 b:cat(B('<p>LoRA بتتدرّب على parameters قليلة، فعندها <mark>capacity</mark> محدودة: كام معلومة جديدة الـ adapter يقدر يستوعبها. وهل بتماشي الـ full fine-tuning ولا لأ بيعتمد على كمية المعلومات اللي التدريب محتاج يخزّنها. التحليلات الحديثة (زي مدونة "LoRA Without Regret") بتوصف الأنماط دي:</p>'+
         '<p>• <mark>حجم الداتا</mark>: على داتا SFT صغيرة لمتوسطة، LoRA برتبة (rank) معقولة بتماشي الـ full fine-tuning. لو الداتا كبيرة مقارنة بحجم الـ adapter، الـ capacity بتخلص وLoRA بتتأخر.<br>'+
         '• <mark>الـ rank</mark>: r أكبر يعني capacity أكتر ويأخّر النقطة دي.<br>'+
         '• <mark>الطبقات</mark>: طبّق LoRA على كل الطبقات الخطية بما فيها الـ MLP. الـ attention لوحدها بتطلع أضعف، حتى لو زوّدنا r لحد ما نساوي عدد الـ parameters.<br>'+
         '• <mark>الـ RL</mark>: محتاج capacity أقل بكتير من SFT، لأن الإجابة بتاخد تقريبًا reward واحد (رقم) بدل label لكل token، فحتى r صغير ممكن يكفي.</p>',
         '<p>LoRA trains few parameters, so it has limited <mark>capacity</mark>: how much new information the adapter can absorb. Whether it matches full fine-tuning depends on how much information the training needs to store. Recent analyses (such as the "LoRA Without Regret" blog) describe these patterns:</p>'+
         '<p>• <mark>Data size</mark>: on small to medium SFT datasets, LoRA with a reasonable rank matches full fine-tuning. When the dataset is large compared to the adapter, capacity runs out and LoRA falls behind.<br>'+
         '• <mark>Rank</mark>: a higher r means more capacity and delays that point.<br>'+
         '• <mark>Layers</mark>: apply LoRA to all linear layers, including the MLP. Attention only comes out weaker, even when r is raised to match the parameter count.<br>'+
         '• <mark>RL</mark>: it needs much less capacity than SFT, because an answer earns roughly one scalar reward instead of a label for every token, so even a small r can be enough.</p>'),
       FIG_CAP,
       B('<p>ليه الطبقات مهمة؟ بأبعاد موديل 7B (d = 4096، عرض الـ MLP = 11008، 32 طبقة، r = 8، و MLP فيها 3 مصفوفات):</p>'+
         '<div class="m">q, v only:      4,194,304\nattention (4):  8,388,608\nall linear:    19,988,480</div>'+
         '<p>الـ MLP فيها حوالي تلتين أوزان كل طبقة، فتجاهلها معناه إن معظم الموديل من غير adapter.</p>'+
         '<p><mark>غلطة شائعة:</mark> نلوم LoRA لما تطلع أضعف. الأول راجع الـ rank والطبقات وحجم الداتا، لأن نقص الـ capacity هو السبب في أغلب الأحيان.</p>',
         '<p>Why do the layers matter? With 7B-class shapes (d = 4096, MLP width 11008, 32 layers, r = 8, and an MLP with 3 matrices):</p>'+
         '<div class="m">q, v only:      4,194,304\nattention (4):  8,388,608\nall linear:    19,988,480</div>'+
         '<p>The MLP holds about two thirds of the weights in each layer, so skipping it leaves most of the model without an adapter.</p>'+
         '<p><mark>Common mistake:</mark> blaming LoRA when it comes out weaker. First check the rank, the target layers and the data size, because missing capacity is often the cause.</p>')),
 q:[
   CQ("أنهي إعداد LoRA الأقرب إنه يماشي الـ full fine-tuning؟","Which LoRA setup is the most likely to match full fine-tuning?",
      [["r صغير جدًا على attention بس، على داتا ضخمة","A very small r on attention only, on a huge dataset"],["r معقول على كل الطبقات الخطية، على داتا SFT صغيرة لمتوسطة","A reasonable r on all linear layers, on a small to medium SFT dataset"],["LoRA على q بس مع نفس الداتا الضخمة","LoRA on q only with the same huge dataset"],["أي إعداد، لأن الـ rank مالوش تأثير","Any setup, because the rank has no effect"]],
      1,"الداتا الصغيرة لمتوسطة مش بتتخطى الـ capacity، وتغطية كل الطبقات الخطية (بالـ MLP) بتدّي capacity أكبر.","Small to medium data does not exceed the capacity, and covering all linear layers (MLP included) gives more capacity."),
   CQ("LoRA بـ r = 8 على q وk وv وo في 32 طبقة (d = 4096): كام parameter؟","LoRA with r = 8 on q, k, v and o in 32 layers (d = 4096): how many parameters?",
      [["4,194,304","4,194,304"],["8,388,608","8,388,608"],["19,988,480","19,988,480"],["2,097,152","2,097,152"]],
      1,"4 مصفوفات * 8 * (4096 + 4096) * 32 طبقة = 8,388,608.","4 matrices * 8 * (4096 + 4096) * 32 layers = 8,388,608.")
 ],
 f:[
   CF("امتى LoRA بتماشي الـ full fine-tuning؟","When does LoRA match full fine-tuning?",
      "لما الداتا صغيرة لمتوسطة، والـ rank معقول، وLoRA على كل الطبقات الخطية (مش attention بس). لو الداتا كبيرة جدًا مقارنة بالـ adapter، الـ capacity بتخلص.","When the data is small to medium, the rank is reasonable, and LoRA covers all linear layers (not only attention). If the data is very large compared to the adapter, capacity runs out."),
   CF("ليه الـ RL محتاج capacity أقل من SFT؟","Why does RL need less capacity than SFT?",
      "لأن الإجابة بتدّي reward واحد تقريبًا، أما في SFT فكل token ليه label، فمعلومات أقل بتتخزّن في كل خطوة.","Because an answer gives roughly one reward, while in SFT every token has a label, so less information is stored at each step.")
 ],
 terms:[
   {t:B("LoRA capacity","LoRA capacity"),
    d:B("كمية المعلومات الجديدة اللي الـ adapter يقدر يستوعبها. بتزيد بزيادة <code>r</code> وبتغطية طبقات أكتر.","How much new information the adapter can absorb. It grows with <code>r</code> and with covering more layers.")},
   {t:B("Target modules","Target modules"),
    d:B("المصفوفات اللي بنركّب عليها LoRA (مثلًا q وv، أو كل الطبقات الخطية).","The matrices we attach LoRA to (for example q and v, or all linear layers).")}
 ]},

{id:"l11-adapters",t:B("Adapters و Prefix و Prompt tuning","Adapters, prefix and prompt tuning"),
 b:cat(B('<p>غير LoRA فيه عائلة كبيرة من الطرق. أهمها:</p>'+
         '<p>• <mark>Adapters</mark>: طبقة صغيرة (bottleneck) بنحطها جوه كل block بعد الـ attention أو الـ FFN. بتصغّر البُعد من d لـ m وترجّعه، مع residual: <code>x + W_up(act(W_down x))</code>. بتضيف شوية تأخير وقت الاستخدام لأنها طبقات إضافية.<br>'+
         '• <mark>Prefix tuning</mark>: بنتعلم vectors بتتضاف قبل الـ keys والـ values في <b>كل</b> طبقة.<br>'+
         '• <mark>Prompt tuning</mark>: أبسط نسخة. بنتعلم k vectors (<mark>soft prompt</mark>) بتتحط قبل الـ embeddings بتاعة المدخل <b>مرة واحدة</b> في أول الموديل بس، والموديل كله متجمّد:</p>',
         '<p>Besides LoRA there is a large family of methods. The most important:</p>'+
         '<p>• <mark>Adapters</mark>: a small (bottleneck) layer placed inside each block after attention or the FFN. It shrinks the dimension from d to m and brings it back, with a residual: <code>x + W_up(act(W_down x))</code>. It adds some inference delay since it adds layers.<br>'+
         '• <mark>Prefix tuning</mark>: we learn vectors that are prepended to the keys and values in <b>every</b> layer.<br>'+
         '• <mark>Prompt tuning</mark>: the simplest version. We learn k vectors (a <mark>soft prompt</mark>) placed before the input embeddings <b>once</b> at the start of the model only, with the whole model frozen:</p>'),
       FIG_SOFT),
 q:[
   CQ("إيه اللي بيتدرّب في الـ prompt tuning؟","What is trained in prompt tuning?",
      [["كل أوزان الموديل","All the model weights"],["الـ attention بس","Only attention"],["الـ tokenizer","The tokenizer"],["k vectors متعلَّمة بتتحط قبل المدخل، والموديل متجمّد","k learned vectors placed before the input, with the model frozen"]],
      3,"الـ soft prompt هو الـ parameters الوحيدة المتدرّبة.","The soft prompt is the only trained set of parameters."),
   CQ("adapter بـ d = 1024 و bottleneck m = 32: كام parameter (من غير الـ biases)؟","An adapter with d = 1024 and bottleneck m = 32: how many parameters (without biases)?",
   [["32,768","32,768"],["65,536","65,536"],["1,048,576","1,048,576"],["1,024","1,024"]],
   1,"W_down (m × d) + W_up (d × m) = 2 * 1024 * 32 = 65,536.","W_down (m × d) + W_up (d × m) = 2 * 1024 * 32 = 65,536.")
 ],
 f:[
   CF("إيه الفرق بين adapters و prefix tuning و prompt tuning؟","How do adapters, prefix tuning and prompt tuning differ?",
      "Adapters: طبقات bottleneck صغيرة جوه الـ blocks. Prefix: vectors قبل الـ keys والـ values في كل طبقة. Prompt tuning: soft prompt عند المدخل بس.","Adapters: small bottleneck layers inside the blocks. Prefix: vectors before the keys and values in every layer. Prompt tuning: a soft prompt at the input only."),
   CF("إيه شكل الـ adapter؟","What does an adapter look like?",
   "<code>x + W_up(act(W_down x))</code>: bottleneck من d لـ m ويرجع لـ d مع residual. بيضيف شوية تأخير وقت الاستخدام.",
   "<code>x + W_up(act(W_down x))</code>: a bottleneck from d to m and back to d with a residual. It adds some inference delay.")
 ],
 terms:[
   {t:B("Adapter","Adapter"),
   d:B("طبقة bottleneck صغيرة جوه كل block بعد الـ attention أو الـ FFN، معاها residual.","A small bottleneck layer inside each block after attention or the FFN, with a residual connection.")},
   {t:B("Prefix tuning","Prefix tuning"),
   d:B("بنتعلم vectors بتتضاف قبل الـ keys والـ values في كل طبقة.","We learn vectors that are prepended to the keys and values in every layer.")},
   {t:B("Prompt tuning","Prompt tuning"),
   d:B("بنتعلم k vectors قبل الـ embeddings بتاعة المدخل مرة واحدة بس، والموديل متجمّد.","We learn k vectors before the input embeddings, once at the start only, with the model frozen.")},
   {t:B("Soft prompt","Soft prompt"),
   d:B("vectors متعلَّمة بالـ gradient descent بدل نص حقيقي (مقابل الـ hard prompt النصي).","Vectors learned by gradient descent instead of real text (as opposed to a text, or hard, prompt).")}
 ]},

{id:"l11-softprompt",t:B("Prompt tuning: أرقام ونتايج وطرق أصغر","Prompt tuning: numbers, results and smaller methods"),
 b:cat(
       B('<p>مثال: soft prompt من 20 vector في موديل بُعده 4096 هو <code>20 * 4096 = 81,920</code> parameter بس. والـ vectors دي مش كلمات حقيقية، هي أرقام متعلَّمة بالـ gradient descent (<mark>soft</mark> مقابل الـ prompt النصي <mark>hard</mark>).</p>'+
         '<p>نتيجة معروفة: الـ prompt tuning بيقرّب من أداء الـ fine-tuning الكامل لما الموديل يكبر (حوالي 10B وأكتر) لكنه بيضعف في الموديلات الصغيرة. عيوبه: الـ soft prompt مش مقروء للبشر، وبياخد مكان من طول السياق، وتدريبه أحيانًا غير مستقر.</p>'+
         '<p>وفيه طرق أصغر: <mark>BitFit</mark> بيدرّب الـ biases بس (حوالي 0.1% من الـ parameters)، و<mark>(IA)³</mark> بيتعلم vectors بتضرب (scale) في الـ keys والـ values والـ FFN. وفي الواقع LoRA هي الأكتر استخدامًا اليوم لأنها بسيطة وبتدمج من غير تأخير.</p>',
         '<p>An example: a soft prompt of 20 vectors in a model of dimension 4096 is only <code>20 * 4096 = 81,920</code> parameters. And these vectors are not real words; they are numbers learned by gradient descent (<mark>soft</mark>, as opposed to a text prompt, which is <mark>hard</mark>).</p>'+
         '<p>A known result: prompt tuning approaches the performance of full fine-tuning as the model grows (about 10B and beyond) but is weaker on small models. Its drawbacks: the soft prompt is not human-readable, it takes up space in the context length, and training is sometimes unstable.</p>'+
         '<p>There are smaller methods: <mark>BitFit</mark> trains only the biases (about 0.1% of the parameters), and <mark>(IA)³</mark> learns vectors that scale the keys, values and FFN. In practice LoRA is the most used today because it is simple and merges with no delay.</p>')),
 q:[
   CQ("soft prompt من 50 vector في موديل بُعده 2048: كام parameter؟","A soft prompt of 50 vectors in a model of dimension 2048: how many parameters?",
   [["102,400","102,400"],["2,048","2,048"],["50","50"],["4,096","4,096"]],
   0,"50 * 2048 = 102,400.","50 * 2048 = 102,400."),
CQ("امتى الـ prompt tuning بيقرّب من أداء الـ fine-tuning الكامل؟","When does prompt tuning approach the performance of full fine-tuning?",
   [["لما الموديل يكون صغير","When the model is small"],["لما الموديل يكبر (حوالي 10B وأكتر)","When the model grows (about 10B and beyond)"],["دايمًا بنفس الدرجة","Always to the same degree"],["أبدًا","Never"]],
   1,"النتيجة المعروفة إنه بيضعف في الموديلات الصغيرة ويقرّب في الكبيرة.","The known result is that it is weaker on small models and gets close on large ones.")
 ],
 f:[
   CF("إيه الـ soft prompt وإيه عيوبه؟","What is a soft prompt and what are its drawbacks?",
   "vectors متعلَّمة بالـ gradient descent قبل المدخل، مش كلمات حقيقية. عيوبه: مش مقروء للبشر، وبياخد من طول السياق، وتدريبه أحيانًا غير مستقر.",
   "Vectors learned by gradient descent placed before the input, not real words. Drawbacks: not human-readable, it uses context length, and training is sometimes unstable."),
CF("إيه الـ BitFit والـ (IA)³؟","What are BitFit and (IA)³?",
   "BitFit بيدرّب الـ biases بس (حوالي 0.1%). (IA)³ بيتعلم vectors بتضرب (scale) في الـ keys والـ values والـ FFN.",
   "BitFit trains only the biases (about 0.1%). (IA)³ learns vectors that scale the keys, values and FFN.")
 ],
 terms:[
   {t:B("BitFit","BitFit"),
   d:B("بيدرّب الـ biases بس (حوالي 0.1% من الـ parameters).","Trains only the biases (about 0.1% of the parameters).")},
   {t:B("(IA)³","(IA)³"),
   d:B("بيتعلم vectors بتضرب (scale) في الـ keys والـ values والـ FFN.","Learns vectors that scale the keys, values and FFN.")}
 ]},

{id:"l11-pruning",t:B("Pruning و Lottery Ticket Hypothesis","Pruning and the Lottery Ticket Hypothesis"),
 b:cat(B('<p>الـ <mark>pruning</mark> بيشيل الأوزان (أو الـ neurons أو الـ heads أو الطبقات) الأقل أهمية، على أمل إن الشبكة الأصغر تحتفظ بمعظم دقتها. أبسط شكل هو <mark>magnitude pruning</mark>: نصفّر الأوزان ذات أصغر <code>|w|</code>. الـ unstructured بيصفّر أوزان فردية، والـ structured بيشيل وحدات كاملة.</p>'+
         '<p>فرضية <mark>lottery ticket</mark> (Frankle وCarbin، 2019): الشبكة الكبيرة المبدوءة عشوائيًا جواها شبكة فرعية صغيرة ("winning ticket") لو اتدرّبت لوحدها من قيمها الأصلية بتماشي الشبكة الكاملة. طريقة إيجادها:</p>'+
         '<div class="m">1. درّب الشبكة الكاملة\n2. شيل أصغر 20% من الأوزان\n3. رجّع الباقي لقيمه الأصلية\n4. كرّر</div>',
         '<p><mark>Pruning</mark> removes the weights (or neurons, heads, layers) that matter least, hoping the smaller network keeps most of its accuracy. The simplest form is <mark>magnitude pruning</mark>: zero the weights with the smallest <code>|w|</code>. Unstructured pruning zeros individual weights, and structured pruning removes whole units.</p>'+
         '<p>The <mark>lottery ticket hypothesis</mark> (Frankle and Carbin, 2019): a large randomly initialized network contains a small subnetwork (a "winning ticket") that, trained alone from its original values, matches the full network. How to find it:</p>'+
         '<div class="m">1. train the full network\n2. remove the smallest 20% of weights\n3. rewind the rest to their original values\n4. repeat</div>'),
       FIG_PRUNE,
       B('<p>بعد n جولات، الباقي <code>0.8^n</code>: بعد 5 جولات 32.8%، وبعد 10 جولات 10.7%.</p>'+
         '<p><mark>علاقتها بالـ PEFT:</mark> الاتنين رهان إن parameters قليلة كفاية: LoRA بتتعلم تحديث صغير فوق W متجمّد، والـ pruning بيحتفظ بجزء متناثر من W. بس PEFT بيقلّل تكلفة التدريب، والـ pruning بيصغّر الموديل النهائي، ولإيجاد الـ ticket لازم نتدرّب كامل الأول.</p>'+
         '<p><mark>الحدود:</mark> الأصفار جوه مصفوفة dense مش بتوفّر حاجة من غير kernels للـ sparse، فالـ unstructured نادرًا بيسرّع الـ GPU. الأنماط الثابتة (زي 2:4، يعني صفرين من كل 4 أوزان) بتساعد أكتر. وفي الشبكات الكبيرة الرجوع للقيم الأصلية كتير بيفشل، فبيتم الرجوع لنقطة بدري في التدريب.</p>',
         '<p>After n rounds, what is left is <code>0.8^n</code>: 32.8% after 5 rounds and 10.7% after 10 rounds.</p>'+
         '<p><mark>Relation to PEFT:</mark> both bet that few parameters are enough: LoRA learns a small update on a frozen W, while pruning keeps a sparse part of W. But PEFT cuts the training cost, pruning shrinks the final model, and finding the ticket needs full training first.</p>'+
         '<p><mark>Limits:</mark> zeros inside a dense matrix save nothing without sparse kernels, so unstructured pruning rarely speeds up a GPU. Fixed patterns (such as 2:4, two zeros in every four weights) help more. And in large networks, rewinding to the original values often fails, so people rewind to an early point in training.</p>')),
 q:[
   CQ("إيه اللي بتقوله lottery ticket hypothesis؟","What does the lottery ticket hypothesis say?",
      [["أي شبكة صغيرة بتتدرّب أحسن من الكبيرة","Any small network trains better than a large one"],["الشبكة الكبيرة جواها شبكة فرعية صغيرة لو اتدرّبت لوحدها من قيمها الأصلية بتماشي الشبكة الكاملة","A large network contains a small subnetwork that, trained alone from its original values, matches the full network"],["نقدر نشيل أي أوزان من غير ما الدقة تتأثر","We can remove any weights without hurting accuracy"],["الأوزان الصفرية بتسرّع الموديل دايمًا","Zero weights always speed up the model"]],
      1,"الفرضية بتتكلم عن وجود subnetwork مناسبة لما نبدأها من قيمها الأصلية، مش عن إن أي pruning مجاني.","The hypothesis is about a suitable subnetwork existing when we start it from its original values, not about any pruning being free."),
   CQ("4 جولات pruning، كل جولة بتشيل 20% من الأوزان الباقية. كام % فاضل؟","4 rounds of pruning, each removing 20% of the remaining weights. What percent is left?",
      [["20%","20%"],["41%","41%"],["59%","59%"],["80%","80%"]],
      1,"0.8^4 = 0.4096، يعني حوالي 41%. (59% هي اللي اتشالت.)","0.8^4 = 0.4096, so about 41%. (59% is what was removed.)")
 ],
 f:[
   CF("إيه هي lottery ticket hypothesis؟","What is the lottery ticket hypothesis?",
      "الشبكة الكبيرة المبدوءة عشوائيًا جواها subnetwork صغيرة (winning ticket) لو اتدرّبت لوحدها من قيمها الأصلية بتماشي الشبكة الكاملة.","A large randomly initialized network contains a small subnetwork (a winning ticket) that, trained alone from its original values, matches the full network."),
   CF("ليه الـ pruning مش بيسرّع الموديل دايمًا؟","Why does pruning not always speed up the model?",
      "لأن الأصفار جوه مصفوفة dense بتتحسب برضه. محتاجين kernels للـ sparse أو نمط ثابت زي 2:4 أو structured pruning.","Because zeros inside a dense matrix are still computed. We need sparse kernels, a fixed pattern such as 2:4, or structured pruning.")
 ],
 terms:[
   {t:B("Pruning","Pruning"),
    d:B("شيل الأوزان أو الوحدات الأقل أهمية لتصغير الموديل.","Removing the least important weights or units to shrink the model.")},
   {t:B("Magnitude pruning","Magnitude pruning"),
    d:B("تصفير الأوزان اللي أصغر <code>|w|</code>.","Zeroing the weights with the smallest <code>|w|</code>.")},
   {t:B("Lottery ticket hypothesis","Lottery ticket hypothesis"),
    d:B("الشبكة الكبيرة جواها subnetwork صغيرة (winning ticket) لو اتدرّبت لوحدها من قيمها الأصلية بتماشي الكاملة.","A large network contains a small subnetwork (a winning ticket) that, trained alone from its original values, matches the full one.")},
   {t:B("Sparsity","Sparsity"),
    d:B("نسبة الأوزان اللي قيمتها صفر في الموديل.","The fraction of weights that are zero in the model.")}
 ]},

{id:"l11-prompt",t:B("هيكل الـ prompt","Anatomy of a prompt"),
 b:cat(B('<p>من غير أي تدريب، بنقدر نوجّه الموديل بالـ <mark>prompt</mark> بس. الـ prompt الكويس عادةً فيه:</p>',
         '<p>Without any training, we can steer the model with just the <mark>prompt</mark>. A good prompt usually contains:</p>'),
       FIG_PROMPT,
       B('<p>أمثلة على الفرق بين prompt ضعيف وقوي:</p>'+
         '<div class="m">weak:   Summarize this.\n\nstrong: Summarize the article below in 3 bullets\n        for a busy manager. Max 20 words each.\n        Article: """..."""</div>'+
         '<p>نصايح عملية:<br>• كن <mark>محدد</mark>: الجمهور والطول والشكل.<br>• استخدم <mark>delimiters</mark> (زي علامات تنصيص أو tags) لفصل التعليمات عن الداتا.<br>• حدّد <mark>شكل المخرج</mark> (قايمة أو JSON) عشان تقدر تعالجه بالكود.<br>• اختار أمثلة <mark>متنوعة وممثّلة</mark>، وراعي توازن الـ labels وترتيبها.<br>• للمهام اللي محتاجة إجابة ثابتة استخدم temperature منخفضة.</p>'+
         '<p>الـ prompting <mark>حساس</mark>: تغيير بسيط في الصياغة أو ترتيب الأمثلة ممكن يغيّر الدقة بشكل واضح. فاختبر على <mark>مجموعة تقييم صغيرة</mark> بدل ما تحكم من مثال واحد. وبعض الأبحاث لقت إن شكل الأمثلة وفضاء الـ labels المتاح بيأثروا أكتر من صحة كل label بالظبط، لكن النتيجة بتختلف حسب الموديل والمهمة.</p>',
         '<p>Examples of a weak versus a strong prompt:</p>'+
         '<div class="m">weak:   Summarize this.\n\nstrong: Summarize the article below in 3 bullets\n        for a busy manager. Max 20 words each.\n        Article: """..."""</div>'+
         '<p>Practical tips:<br>• Be <mark>specific</mark>: audience, length and format.<br>• Use <mark>delimiters</mark> (such as quotation marks or tags) to separate the instructions from the data.<br>• Specify the <mark>output format</mark> (a list or JSON) so you can process it with code.<br>• Choose <mark>diverse and representative</mark> examples, and mind the balance and order of labels.<br>• For tasks needing a stable answer use a low temperature.</p>'+
         '<p>Prompting is <mark>sensitive</mark>: a small change in wording or example order can noticeably change accuracy. So test on a <mark>small evaluation set</mark> instead of judging from a single example. And some studies found that the format of the examples and the available label space matter more than the exact correctness of each label, though results vary with the model and the task.</p>')),
 q:[
   CQ("أنهي جزء في الـ prompt بيحدد شكل الإجابة (زي JSON أو كلمة واحدة)؟","Which part of the prompt defines the shape of the answer (such as JSON or one word)?",
      [["الـ context","The context"],["الـ output format","The output format"],["الـ input","The input"],["الأمثلة بس","The examples only"]],
      1,"تحديد الشكل صراحةً بيخلّي المخرج ثابت وسهل المعالجة بالكود.","Specifying the format explicitly makes the output stable and easy to process in code."),
   CQ("ليه بنحط المقال أو الداتا جوه علامات تنصيص أو tags في الـ prompt؟","Why do we put the article or data inside quotation marks or tags in the prompt?",
   [["عشان الموديل يحفظه","So the model memorizes it"],["عشان نقلل الـ temperature","To lower the temperature"],["عشان نزوّد طول المخرج","To increase the output length"],["عشان نفصل التعليمات عن الداتا","To separate the instructions from the data"]],
   3,"الـ delimiters بتوضّح للموديل فين التعليمات وفين الداتا.","Delimiters make it clear to the model where the instructions end and the data begins.")
 ],
 f:[
   CF("إيه أجزاء الـ prompt الكويس وإزاي نختبره؟","What are the parts of a good prompt and how do we test it?",
      "تعليمات، سياق، أمثلة، مدخل، وشكل مخرج. بنختبره على مجموعة تقييم صغيرة لأن الصياغة وترتيب الأمثلة بيأثروا على الدقة.","An instruction, context, examples, input and output format. We test it on a small evaluation set because wording and example order affect accuracy."),
   CF("إيه نصايح الـ prompt العملية؟","What are the practical prompt tips?",
   "كن محدد (جمهور وطول وشكل)، واستخدم delimiters، وحدّد شكل المخرج، واختار أمثلة متنوعة، وtemperature منخفضة للإجابة الثابتة.",
   "Be specific (audience, length, format), use delimiters, specify the output format, choose diverse examples, and use a low temperature for stable answers.")
 ],
 terms:[
   {t:B("Delimiters","Delimiters"),
   d:B("علامات (تنصيص أو tags) بنفصل بيها التعليمات عن الداتا في الـ prompt.","Marks (quotation marks or tags) that separate the instructions from the data in the prompt.")},
   {t:B("Evaluation set","Evaluation set"),
   d:B("مجموعة صغيرة من الأمثلة بنقيس عليها دقة الـ prompt بدل ما نحكم من مثال واحد.","A small set of examples on which we measure the prompt's accuracy instead of judging from one example.")}
 ]},

{id:"l11-cot",t:B("Few-shot و Chain-of-thought","Few-shot examples and chain-of-thought"),
 b:cat(B('<p>في الـ <mark>few-shot</mark> بنحط k أمثلة محلولة في الـ prompt، و<mark>اختيار</mark> الأمثلة بيغيّر الدقة. اختار أمثلة <mark>متنوعة</mark> و<mark>ممثّلة</mark> للمدخلات الحقيقية وبنفس شكل مدخل الاختبار. وازن الـ labels: 4 أمثلة positive و0 negative بيدفعوا الموديل ناحية "positive". والترتيب كمان بيفرق، فاختبره.</p>'+
         '<p>الأقوى هو الاختيار الديناميكي <mark>dynamic selection</mark>: بنعمل embedding للمدخل ونسترجع أقرب k أمثلة له من مجموعة، بدل أمثلة ثابتة. وغلطة شائعة: أمثلة أكتر مش دايمًا أحسن، لأنها بتاكل من طول السياق. ابدأ بـ 3 لـ 5 وقِس.</p>'+
         '<p>المسائل اللي محتاجة خطوات (حساب، منطق) الموديل بيغلط فيها لو طلبنا الإجابة مباشرةً. الـ <mark>chain-of-thought (CoT)</mark>: نخليه يكتب <mark>الخطوات الوسيطة</mark> قبل الإجابة النهائية. فيه طريقتين: <mark>few-shot CoT</mark> (الأمثلة في الـ prompt فيها خطوات)، و<mark>zero-shot CoT</mark> (نضيف عبارة زي \"Let\'s think step by step\").</p>',
         '<p>In <mark>few-shot</mark> prompting we put k solved examples in the prompt, and <mark>which</mark> examples we pick changes the accuracy. Choose examples that are <mark>diverse</mark>, <mark>representative</mark> of real inputs, and in the same format as the test input. Keep the labels balanced: 4 positive examples and 0 negative ones push the model toward "positive". The order matters too, so test it.</p>'+
         '<p>A stronger option is <mark>dynamic selection</mark>: embed the test input and retrieve its k most similar examples from a pool, instead of fixed ones. A common mistake: more examples is not always better, since they use up context length. Start with 3 to 5 and measure.</p>'+
         '<p>Problems that need steps (arithmetic, logic) are where the model errs if we ask for the answer directly. <mark>Chain-of-thought (CoT)</mark>: we make it write the <mark>intermediate steps</mark> before the final answer. There are two ways: <mark>few-shot CoT</mark> (the examples in the prompt include steps), and <mark>zero-shot CoT</mark> (we add a phrase like \"Let\'s think step by step\").</p>'),
       FIG_COT),
 q:[
   CQ("أنهي مجموعة أمثلة few-shot أحسن لمهمة تصنيف مشاعر؟","Which few-shot example set is better for sentiment classification?",
   [["4 أمثلة كلها positive بنفس الصياغة","4 examples, all positive with the same wording"],["أمثلة متنوعة ومتوازنة بين positive و negative","Diverse examples balanced between positive and negative"],["أمثلة من مهمة تانية خالص","Examples from a completely different task"],["مثال واحد طويل جدًا","One very long example"]],
   1,"التنوع وتوازن الـ labels بيمنعوا انحياز الموديل لـ label واحد.","Diversity and label balance prevent the model from leaning toward one label."),
CQ("إيه العبارة اللي بتحوّل prompt لـ zero-shot CoT؟","Which phrase turns a prompt into zero-shot CoT?",
   [["Answer in one word","Answer in one word"],["Be brief","Be brief"],["Use JSON","Use JSON"],["Let's think step by step","Let's think step by step"]],
   3,"العبارة دي بتخلّي الموديل يكتب خطوات وسيطة من غير أي أمثلة.","This phrase makes the model write intermediate steps without any examples.")
 ],
 f:[
   CF("إيه هو الـ chain-of-thought وليه بيساعد؟","What is chain-of-thought and why does it help?",
      "نخلي الموديل يكتب خطوات وسيطة قبل الإجابة. بيساعد لأنه بيدي حساب أكتر، وبيخزّن النتايج في السياق، وبيقسّم المسألة. الفايدة أوضح في الموديلات الكبيرة.","We make the model write intermediate steps before the answer. It helps because it gives more computation, stores results in the context, and splits the problem. The benefit is clearer in large models."),
   CF("إيه هو الـ dynamic selection للأمثلة؟","What is dynamic example selection?",
   "نعمل embedding للمدخل ونسترجع أقرب k أمثلة له من مجموعة، بدل ما نستخدم أمثلة ثابتة لكل الطلبات.",
   "We embed the input and retrieve its k most similar examples from a pool, instead of using the same fixed examples for every request."),
CF("إيه الفرق بين few-shot CoT و zero-shot CoT؟","How do few-shot CoT and zero-shot CoT differ?",
   "Few-shot CoT: الأمثلة في الـ prompt فيها خطوات. Zero-shot CoT: نضيف عبارة زي Let's think step by step من غير أمثلة.",
   "Few-shot CoT: the examples in the prompt include steps. Zero-shot CoT: we add a phrase like Let's think step by step with no examples.")
 ],
 terms:[
   {t:B("Few-shot prompting","Few-shot prompting"),
 d:B("بنحط k أمثلة محلولة في الـ prompt قبل المدخل الحقيقي (في GPT-3 عادة من 10 لـ 100).","We put k solved examples in the prompt before the real input (usually 10 to 100 in GPT-3).")},
   {t:B("Dynamic selection","Dynamic selection"),
   d:B("بنسترجع أقرب k أمثلة للمدخل من مجموعة بدل أمثلة ثابتة.","We retrieve the k examples most similar to the input from a pool instead of fixed ones.")},
   {t:B("Chain-of-thought (CoT)","Chain-of-thought (CoT)"),
   d:B("بنخلي الموديل يكتب الخطوات الوسيطة قبل الإجابة النهائية.","We make the model write the intermediate steps before the final answer.")},
{t:B("Few-shot CoT","Few-shot CoT"),
 d:B("بنحط أمثلة فيها الخطوات كاملة قبل السؤال الحقيقي.","We put examples with full steps before the real question.")},
{t:B("Zero-shot CoT","Zero-shot CoT"),
 d:B("بنضيف جملة زي <code>Let's think step by step</code> للـ prompt عشان الموديل يكتب الخطوات.","We add a sentence such as <code>Let's think step by step</code> to the prompt so the model writes the steps.")}
 ]},

{id:"l11-cot-why",t:B("ليه الـ CoT بيشتغل و Self-consistency","Why CoT works, and self-consistency")

/* ---------- extra questions, flashcards and terms for the existing cards ---------- */,
 b:cat(
       B('<p>ليه بيشتغل؟ (1) كل token بيتولّد بحساب ثابت، فالخطوات بتدي الموديل <mark>حساب أكتر</mark> للمسألة. (2) النتايج الوسيطة بتتكتب في السياق فمش لازم يحتفظ بيها داخليًا. (3) كل خطوة أسهل من المسألة كلها. الفايدة ظهرت بوضوح في الموديلات الكبيرة، والموديلات الصغيرة ممكن تكتب خطوات سلسة لكن غلط.</p>'+
         '<p>الـ <mark>self-consistency</mark> بيزوّد الدقة: بنولّد عدة chains بـ temperature أعلى من صفر (طرق تفكير مختلفة)، وناخد <mark>الإجابة النهائية الأكتر تكرارًا</mark> (تصويت). مثال: 5 عينات أدّت الإجابات <code>[11, 11, 9, 11, 12]</code>، فالإجابة <code>11</code> بتكسب بـ 3 من 5 (60%). الفكرة إن الطرق الصح كتير بتوصل لنفس الإجابة، والغلط بيتشتت.</p>'+
         '<p>التكلفة: توليد أطول وأكتر (تأخير وفلوس). وتحفّظ مهم: الخطوات المكتوبة <mark>مش دايمًا بتعكس</mark> الحساب الحقيقي جوه الموديل (مشكلة الـ faithfulness اللي هنشوفها في محاضرة Interpretability). وهنكمل الموضوع ده في محاضرة Reasoning.</p>',
         '<p>Why does it work? (1) Each token is generated with a fixed amount of computation, so steps give the model <mark>more computation</mark> for the problem. (2) Intermediate results are written into the context so it need not hold them internally. (3) Each step is easier than the whole problem. The benefit appeared clearly in large models, and small models may write fluent but wrong steps.</p>'+
         '<p><mark>Self-consistency</mark> improves accuracy: we generate several chains with a temperature above zero (different ways of thinking), and take the <mark>most frequent final answer</mark> (a vote). An example: 5 samples gave the answers <code>[11, 11, 9, 11, 12]</code>, so <code>11</code> wins with 3 out of 5 (60%). The idea is that many correct paths reach the same answer, while wrong ones scatter.</p>'+
         '<p>The cost: longer and more generation (delay and money). And an important caveat: the written steps <mark>do not always reflect</mark> the actual computation inside the model (the faithfulness problem we will see in the Interpretability lecture). We continue this topic in the Reasoning lecture.</p>')),
 q:[
   CQ("إيه اللي بيعمله self-consistency؟","What does self-consistency do?",
      [["بيولّد chain واحدة بس بـ temperature صفر","It generates a single chain at temperature zero"],["بيدرّب الموديل على الإجابة الصح","It trains the model on the right answer"],["بيولّد عدة chains ويختار الإجابة النهائية الأكتر تكرارًا","It generates several chains and picks the most frequent final answer"],["بيحذف الخطوات الوسيطة","It deletes the intermediate steps"]],
      2,"التصويت على الإجابات بيقلّل تأثير الـ chains الغلط المتفرقة.","Voting over answers reduces the effect of scattered wrong chains."),
   CQ("5 عينات أدّت الإجابات [7, 7, 8, 7, 9]. إيه الإجابة بالـ self-consistency؟","Five samples gave the answers [7, 7, 8, 7, 9]. What is the self-consistency answer?",
   [["8","8"],["7","7"],["9","9"],["7.6 (المتوسط)","7.6 (the average)"]],
   1,"الإجابة 7 ظهرت 3 مرات من 5، فهي الأكتر تكرارًا.","The answer 7 appears 3 times out of 5, so it is the most frequent.")
 ],
 f:[
   CF("ليه الـ CoT بيشتغل؟","Why does CoT work?",
   "بيدي الموديل حساب أكتر (كل token بحساب ثابت)، وبيكتب النتايج الوسيطة في السياق، وكل خطوة أسهل من المسألة كلها.",
   "It gives the model more computation (each token costs a fixed amount), writes intermediate results into the context, and each step is easier than the whole problem."),
CF("إيه تحفّظ الـ CoT المهم؟","What is the important caveat of CoT?",
   "الخطوات المكتوبة مش دايمًا بتعكس الحساب الحقيقي جوه الموديل (faithfulness)، والتكلفة توليد أطول.",
   "The written steps do not always reflect the real computation inside the model (faithfulness), and the cost is longer generation.")
 ],
 terms:[
   {t:B("Self-consistency","Self-consistency"),
 d:B("بنولّد عدة chains بـ temperature أعلى من صفر ونختار الإجابة النهائية الأكتر تكرارًا.","We generate several chains with a temperature above zero and pick the most frequent final answer.")},
   {t:B("Faithfulness (CoT)","Faithfulness (CoT)"),
 d:B("هل الخطوات المكتوبة بتعكس الحساب الحقيقي جوه الموديل ولا لأ.","Whether the written steps reflect the real computation inside the model.")}
 ]},

{id:"l11-choose",t:B("نختار إيه: prompting ولا RAG ولا fine-tuning؟","Which to choose: prompting, RAG or fine-tuning?"),
 b:cat(B('<p>عندنا 4 مستويات لتخصيص الموديل، من الأرخص للأغلى:</p>',
         '<p>We have 4 levels of customizing a model, from the cheapest to the most expensive:</p>'),
       FIG_LADDER,
       B('<p>القاعدة: <mark>اتعرّف على المشكلة قبل ما تختار الحل.</mark></p>'+
         '<p>• <mark>Prompting</mark>: ابدأ بيه دايمًا مع مجموعة تقييم. سريع وبلا تدريب.<br>'+
         '• <mark>RAG</mark> (retrieval-augmented generation): لو المشكلة <mark>معرفة ناقصة أو متغيرة أو خاصة</mark> (مستندات الشركة، أخبار النهاردة)، بنجيب المقاطع المناسبة ونحطها في الـ prompt (هنفصّل ده في محاضرة Question Answering). الـ fine-tuning مش وسيلة موثوقة لحقن حقائق جديدة.<br>'+
         '• <mark>LoRA / PEFT</mark>: لو المشكلة <mark>سلوك</mark>: أسلوب ثابت، أو شكل مخرج معقد، أو لازم نقصّر prompt طويل.<br>'+
         '• <mark>Full fine-tuning أو continued pretraining</mark>: لو في domain جديد تمامًا (مثلًا لغة أو مجال متخصص) وعندك بيانات كتير وميزانية.</p>'+
         '<p>وهما بيتكاملوا: ممكن RAG مع موديل متعدّل بـ LoRA. مثال تكلفة: prompt فيه أمثلة بـ 2,000 token × مليون طلب = <code>2,000 * 1,000,000 = 2,000,000,000</code> يعني 2 مليار token إضافي في المدخل. موديل متعدّل بـ LoRA بـ prompt قصير ممكن يوفّر معظمهم، بس لازم نحسب تكلفة التدريب والصيانة كمان.</p>'+
         '<p>وخلّي بالك: أي تعديل بالتدريب لازم تقيّم بعده الأداء على المهام العامة، عشان تتأكد إنك ما عملتش forgetting.</p>',
         '<p>The rule: <mark>diagnose the problem before choosing the solution.</mark></p>'+
         '<p>• <mark>Prompting</mark>: always start here with an evaluation set. Fast and training-free.<br>'+
         '• <mark>RAG</mark> (retrieval-augmented generation): if the problem is <mark>missing, changing or private knowledge</mark> (company documents, today\'s news), we fetch the right passages and put them in the prompt (detailed in the Question Answering lecture). Fine-tuning is not a reliable way to inject new facts.<br>'+
         '• <mark>LoRA / PEFT</mark>: if the problem is <mark>behavior</mark>: a consistent style, a complex output format, or the need to shorten a long prompt.<br>'+
         '• <mark>Full fine-tuning or continued pretraining</mark>: for a completely new domain (such as a language or specialized field) when you have lots of data and budget.</p>'+
         '<p>They also complement each other: RAG with a LoRA-tuned model is possible. A cost example: a prompt with 2,000 tokens of examples × a million requests = <code>2,000 * 1,000,000 = 2,000,000,000</code>, which is 2 billion extra input tokens. A LoRA-tuned model with a short prompt may save most of them, but we must also count training and maintenance costs.</p>'+
         '<p>And note: after any training change, evaluate performance on general tasks to make sure you did not cause forgetting.</p>')),
 q:[
   CQ("شركة محتاجة إجابات مبنية على مستندات داخلية بتتغيّر كل يوم. أنسب حل؟","A company needs answers based on internal documents that change every day. What is the best fit?",
      [["RAG: نجيب المقاطع المناسبة ونحطها في الـ prompt","RAG: retrieve the relevant passages and put them in the prompt"],["Full fine-tuning كل يوم","Full fine-tuning every day"],["تقليل الـ temperature بس","Only lowering the temperature"],["زيادة الـ rank في LoRA","Increasing the rank in LoRA"]],
      0,"المعرفة المتغيرة والخاصة بتتحل بالاسترجاع وقت الطلب، مش بالتدريب المتكرر.","Changing and private knowledge is solved by retrieval at request time, not by repeated training."),
   CQ("prompt فيه أمثلة بـ 500 token × 100,000 طلب. كام token إضافي في المدخل؟","A prompt with 500 tokens of examples × 100,000 requests. How many extra input tokens?",
   [["500,000","500,000"],["5,000,000","5,000,000"],["50,000,000","50,000,000"],["500,000,000","500,000,000"]],
   2,"500 * 100,000 = 50,000,000.","500 * 100,000 = 50,000,000.")
 ],
 f:[
   CF("إمتى نستخدم prompting وإمتى RAG وإمتى LoRA وإمتى full fine-tuning؟","When do we use prompting, RAG, LoRA and full fine-tuning?",
      "Prompting أولًا. RAG لمعرفة ناقصة أو متغيرة. LoRA لسلوك وأسلوب وشكل مخرج ثابت. Full fine-tuning لـ domain جديد تمامًا مع بيانات وميزانية كبيرة.","Prompting first. RAG for missing or changing knowledge. LoRA for consistent behavior, style and output format. Full fine-tuning for a completely new domain with lots of data and budget."),
   CF("إزاي RAG وLoRA بيتكاملوا؟","How do RAG and LoRA complement each other?",
   "RAG بيجيب المعرفة المتغيرة أو الخاصة وقت الطلب، وLoRA بيظبط السلوك والأسلوب. ممكن نستخدمهم سوا على نفس الموديل.",
   "RAG supplies changing or private knowledge at request time, and LoRA tunes behavior and style. We can use them together on the same model."),
CF("إيه اللي لازم نعمله بعد أي تعديل بالتدريب؟","What must we do after any training change?",
   "نقيّم الأداء على المهام العامة عشان نتأكد إننا ما عملناش forgetting.",
   "Evaluate performance on general tasks to make sure we did not cause forgetting.")
 ],
 terms:[
   {t:B("RAG","RAG"),
 d:B("Retrieval-Augmented Generation: بنجيب المقاطع المناسبة من مصدر خارجي ونحطها في الـ prompt.","Retrieval-Augmented Generation: we fetch the relevant passages from an external source and put them in the prompt.")},
   {t:B("Continued pretraining","Continued pretraining"),
   d:B("نكمّل pretraining على داتا من domain جديد.","We continue pretraining on data from a new domain.")}
 ]},

{id:"l11-recap",t:B("Recap: ملخص المحاضرة 11","Recap: Lecture 11 in review"),
 b:B('<p><mark>5 نقاط تفتكرها:</mark></p>'+
     '<p>1. الـ fine-tuning الكامل محتاج حوالي 16 byte لكل parameter في الذاكرة (112 GB لموديل 7B) ونسخة لكل مهمة.<br>'+
     '2. PEFT بيجمّد الأساسي ويتدرّب على جزء صغير: additive (adapters وsoft prompts)، selective (BitFit)، reparameterization (LoRA).<br>'+
     '3. LoRA بيتعلم تحديث بـ rank منخفض B A، بيبدأ مطابق للأصلي (B = 0) وبيندمج من غير تأخير. وQLoRA بيضيف موديل أساسي بدقة 4 bit.<br>'+
     '4. الـ prompting حساس: حدّد شكل المخرج، واختار أمثلة متنوعة ومتوازنة، واستخدم chain-of-thought وself-consistency، واختبر على مجموعة تقييم.<br>'+
     '5. اختار بالتشخيص: prompting الأول، وRAG للمعرفة، وLoRA للسلوك، وfull fine-tuning لـ domain جديد.</p>'+
     '<p>أهم المعادلات:</p>'+
     '<div class="m">memory = 16 bytes * parameters\nh = W x + (alpha / r) B A x\nLoRA params = r * (d + k)</div>'+
     '<p>قبل المحاضرة اللي بعدها: اتأكد إنك تقدر تحسب الذاكرة وعدد الـ parameters، وتقول أنهي حل بيناسب أنهي مشكلة.</p>',
     '<p><mark>Five points to remember:</mark></p>'+
     '<p>1. Full fine-tuning needs about 16 bytes per parameter of memory (112 GB for a 7B model) and a copy per task.<br>'+
     '2. PEFT freezes the base and trains a small part: additive (adapters and soft prompts), selective (BitFit), reparameterization (LoRA).<br>'+
     '3. LoRA learns a low-rank update B A, starts identical to the original (B = 0) and merges with no delay. QLoRA adds a 4-bit base model.<br>'+
     '4. Prompting is sensitive: specify the output format, choose diverse and balanced examples, use chain-of-thought and self-consistency, and test on an evaluation set.<br>'+
     '5. Choose by diagnosis: prompting first, RAG for knowledge, LoRA for behavior, full fine-tuning for a new domain.</p>'+
     '<p>Key equations:</p>'+
     '<div class="m">memory = 16 bytes * parameters\nh = W x + (alpha / r) B A x\nLoRA params = r * (d + k)</div>'+
     '<p>Before the next lecture: make sure you can compute the memory and the parameter counts, and say which fix matches which problem.</p>'),
 q:[
   CQ("أنهي معادلة بتعبّر عن خرج طبقة LoRA؟","Which equation expresses the output of a LoRA layer?",
      [["h = W x * B A","h = W x * B A"],["h = (alpha / r) W x","h = (alpha / r) W x"],["h = W x + (alpha / r) B A x","h = W x + (alpha / r) B A x"],["h = B A x بس","h = B A x only"]],
      2,"المسار المتجمّد W x بيتجمع مع الفرع الصغير المتدرّب.","The frozen path W x is summed with the small trained branch."),
   CQ("جرّبت prompting كويس وفشل في الحفاظ على أسلوب ثابت. إيه الخطوة اللي بعدها؟","You tried prompting well and it fails to keep a consistent style. What is the next step?",
      [["RAG","RAG"],["LoRA / PEFT","LoRA / PEFT"],["Pretraining من الصفر","Pretraining from scratch"],["نزوّد الـ temperature","Increase the temperature"]],
      1,"المشكلة سلوك وأسلوب، وده مكان LoRA في السلم.","The problem is behavior and style, which is where LoRA sits on the ladder.")
 ],
 f:[
   CF("إيه أهم معادلات المحاضرة 11؟","What are the key equations of Lecture 11?",
      "الذاكرة = 16 byte * parameters. خرج LoRA: h = W x + (alpha / r) B A x. عدد parameters في LoRA = r * (d + k).",
      "Memory = 16 bytes * parameters. LoRA output: h = W x + (alpha / r) B A x. LoRA parameter count = r * (d + k)."),
   CF("إيه ترتيب الحلول من الأرخص للأغلى؟","What is the order of the solutions from cheapest to most expensive?",
      "Prompting، بعدين RAG، بعدين LoRA / PEFT، بعدين full fine-tuning. ننزل لتحت بس لما اللي فوق مايكفيش.",
      "Prompting, then RAG, then LoRA / PEFT, then full fine-tuning. We move down only when the option above is not enough.")
 ]}
]}
);

})();
