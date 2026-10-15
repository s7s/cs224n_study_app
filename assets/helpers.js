/* Shared helpers and SVG figure builders, used by every lecture file. Loaded before the lecture files. */

var B=function(ar,en){return {ar:ar,en:en};};

function mkr(id,col){return '<marker id="'+id+'" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" style="fill:'+col+'"/></marker>';}

var DEFS='<defs>'+mkr('mA','var(--ac)')+mkr('mM','var(--mu)')+mkr('mG','var(--ok)')+mkr('mN','var(--no)')+'</defs>';

function T(x,y,s,cls,anc,st){return '<text x="'+x+'" y="'+y+'" class="t'+(cls?' '+cls:'')+'" text-anchor="'+(anc||'start')+'"'+(st?' style="'+st+'"':'')+'>'+s+'</text>';}

function AR(x1,y1,x2,y2,c,m,dash){
  var L=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)),ux=(x2-x1)/L,uy=(y2-y1)/L;
  var a=x1+ux*7,b=y1+uy*7,e=x2-ux*8,f=y2-uy*8;
  return '<line x1="'+a.toFixed(1)+'" y1="'+b.toFixed(1)+'" x2="'+e.toFixed(1)+'" y2="'+f.toFixed(1)+'" style="stroke:var(--'+c+');stroke-width:2.2;'+(dash?'stroke-dasharray:5 4;':'')+'" marker-end="url(#'+m+')"/>';
}

function DOT(x,y,col,r){return '<circle cx="'+x+'" cy="'+y+'" r="'+(r||5)+'" style="fill:var(--'+col+')"/>';}

function fig(h,inner,cap){
  var mk=function(c){var al=c.replace(/<[^>]*>/g,'').replace(/"/g,'&quot;');return '<figure class="fig"><svg viewBox="0 0 360 '+h+'" role="img" aria-label="'+al+'">'+DEFS+inner+'</svg><figcaption>'+c+'</figcaption></figure>';};
  return B(mk(cap.ar),mk(cap.en));
}

function cat(){var a='',e='';for(var i=0;i<arguments.length;i++){var p=arguments[i];a+=p.ar;e+=p.en;}return B(a,e);}

/* Figure 1: one-hot vectors */
function cells(y,hot){
  var s='';
  for(var i=0;i<12;i++){
    var x=24+i*26,h=(i===hot);
    s+='<rect x="'+x+'" y="'+y+'" width="22" height="22" rx="4" style="fill:'+(h?'var(--ac)':'var(--sf)')+';stroke:var(--ln);stroke-width:1.5"/>'+
       T(x+11,y+15.5,h?'1':'0',h?'tb':'tm','middle',h?'fill:var(--bg)':'');
  }
  return s;
}

/* Figure 2: embedding map */
function pt(x,y,label,col){return DOT(x,y,col)+T(x+9,y+4,label);}

function ell(cx,cy,rx,ry,col){return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" style="fill:none;stroke:var(--'+col+');stroke-width:1.5;stroke-dasharray:4 4"/>';}

function AL(x1,y1,x2,y2,c,m,dash){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="stroke:var(--'+c+');stroke-width:2;'+(dash?'stroke-dasharray:5 4;':'')+'" marker-end="url(#'+m+')"/>';}

function RECT(x,y,w,h,fill,stroke,r,sw){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||0)+'" style="fill:'+fill+';stroke:'+(stroke||'none')+';stroke-width:'+(sw||1.5)+'"/>';}

function CQ(qa,qe,opts,a,wa,we){return {q:B(qa,qe),o:opts.map(function(p){return B(p[0],p[1]);}),a:a,w:B(wa,we)};}

function CF(qa,qe,aa,ae){return {q:B(qa,qe),a:B(aa,ae)};}

function ARC(xh,xd,h,lab,c,m,y0,dir,lb){
  var x1=xh+(xd>xh?8:-8),mx=(x1+xd)/2,cy=y0-dir*h,peak=y0-dir*h/2;
  var ly=(dir>0&&!lb)?peak-5:peak+14;
  return '<path d="M'+x1+' '+y0+' Q'+mx+' '+cy+' '+xd+' '+(y0-dir*3)+'" style="fill:none;stroke:var(--'+c+');stroke-width:1.9" marker-end="url(#'+m+')"/>'+
         (lab?T(mx,ly,lab,'tm','middle','font-size:11px'):'');
}

/* A card's q (quiz) and f (flashcard) may each be a single object or an array of objects. asList() normalizes both to an array. */
function asList(x){return x==null?[]:(Array.isArray(x)?x:[x]);}
