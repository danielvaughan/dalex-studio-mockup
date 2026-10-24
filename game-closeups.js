/* Game-style close-ups: native pixel text over painted room-object artwork. */
const closeupFont={
'A':['01110','10001','10001','11111','10001','10001','10001'],
'B':['11110','10001','10001','11110','10001','10001','11110'],
'C':['01111','10000','10000','10000','10000','10000','01111'],
'D':['11110','10001','10001','10001','10001','10001','11110'],
'E':['11111','10000','10000','11110','10000','10000','11111'],
'F':['11111','10000','10000','11110','10000','10000','10000'],
'G':['01111','10000','10000','10111','10001','10001','01111'],
'H':['10001','10001','10001','11111','10001','10001','10001'],
'I':['111','010','010','010','010','010','111'],
'J':['00111','00010','00010','00010','10010','10010','01100'],
'K':['10001','10010','10100','11000','10100','10010','10001'],
'L':['10000','10000','10000','10000','10000','10000','11111'],
'M':['10001','11011','10101','10101','10001','10001','10001'],
'N':['10001','11001','10101','10011','10001','10001','10001'],
'O':['01110','10001','10001','10001','10001','10001','01110'],
'P':['11110','10001','10001','11110','10000','10000','10000'],
'Q':['01110','10001','10001','10001','10101','10010','01101'],
'R':['11110','10001','10001','11110','10100','10010','10001'],
'S':['01111','10000','10000','01110','00001','00001','11110'],
'T':['11111','00100','00100','00100','00100','00100','00100'],
'U':['10001','10001','10001','10001','10001','10001','01110'],
'V':['10001','10001','10001','10001','10001','01010','00100'],
'W':['10001','10001','10001','10101','10101','10101','01010'],
'X':['10001','10001','01010','00100','01010','10001','10001'],
'Y':['10001','10001','01010','00100','00100','00100','00100'],
'Z':['11111','00001','00010','00100','01000','10000','11111'],
'0':['01110','10001','10011','10101','11001','10001','01110'],
'1':['010','110','010','010','010','010','111'],
'2':['01110','10001','00001','00010','00100','01000','11111'],
'3':['11110','00001','00001','01110','00001','00001','11110'],
'4':['00010','00110','01010','10010','11111','00010','00010'],
'5':['11111','10000','10000','11110','00001','00001','11110'],
'6':['01110','10000','10000','11110','10001','10001','01110'],
'7':['11111','00001','00010','00100','01000','01000','01000'],
'8':['01110','10001','10001','01110','10001','10001','01110'],
'9':['01110','10001','10001','01111','00001','00001','01110'],
',':['00','00','00','00','00','01','01','10'],
'.':['0','0','0','0','0','1','1'],':':['0','1','1','0','1','1','0'],
'-':['000','000','000','111','000','000','000'],
'/':['00001','00001','00010','00100','01000','10000','10000'],
'?':['01110','10001','00001','00010','00100','00000','00100'],
'!':['1','1','1','1','1','0','1'],
'>':['100','010','001','001','001','010','100'],
'%':['11001','11010','00100','01000','10110','00110','00000'],
"'":['1','1','0','0','0','0','0'],
'(':['01','10','10','10','10','10','01'],')':['10','01','01','01','01','01','10'],
' ':['000','000','000','000','000','000','000']};
function pixelWidth(t,s=1){return [...t.toUpperCase()].reduce((n,c)=>n+((closeupFont[c]||closeupFont['?'])[0].length+1)*s,0)}
function pixelText(c,t,x,y,color='#382716',s=1){c.fillStyle=color;for(const ch of t.toUpperCase()){const g=closeupFont[ch]||closeupFont['?'];g.forEach((row,dy)=>[...row].forEach((p,dx)=>{if(p==='1')c.fillRect(Math.round(x+dx*s),Math.round(y+dy*s),s,s)}));x+=(g[0].length+1)*s}}
function pixelWrap(c,t,x,y,width,color='#382716',s=1,lineHeight=12){let line='';for(const word of t.split(' ')){if(line&&pixelWidth(line+' '+word,s)>width){pixelText(c,line,x,y,color,s);y+=lineHeight;line=word}else line+=(line?' ':'')+word}if(line)pixelText(c,line,x,y,color,s);return y+lineHeight}
function pin(c,x,y){c.fillStyle='#422119';c.fillRect(x+1,y+2,7,7);c.fillStyle='#8d2a20';c.fillRect(x,y,6,6);c.fillStyle='#e96a42';c.fillRect(x+1,y,3,2)}
function paper(c,x,y,w,h,color){c.fillStyle='#48321e';c.fillRect(x+3,y+4,w,h);c.fillStyle=color;c.fillRect(x,y,w,h);c.fillStyle='#fff0c244';c.fillRect(x+1,y+1,w-2,2);c.fillStyle='#60422544';c.fillRect(x,y+h-2,w,2);for(let i=0;i<16;i++){const px=x+((i*43+11)%(w-4))+2,py=y+((i*29+7)%(h-4))+2;c.fillStyle='#806c3b18';c.fillRect(px,py,2,1)}}
const closeArt=new Image();closeArt.src='production-board-art.png';
const viewCanvases={};
for(const id of ['boardview','ticketview']){const cv=document.createElement('canvas');cv.width=640;cv.height=480;cv.setAttribute('aria-hidden','true');document.getElementById(id).prepend(cv);viewCanvases[id]=cv}
function gameFooter(c,ticket){
 c.fillStyle='#11170e';c.fillRect(0,400,640,80);c.fillStyle='#76613b';c.fillRect(0,400,640,3);c.fillStyle='#26251a';c.fillRect(0,403,640,20);
 pixelText(c,ticket?'Look at the milestone record':'Look at a milestone card',10,409,'#edcb83',1);
 const labels=ticket?['OPEN GITHUB','GO BACK','READ RECORD']:['LOOK AT','GO BACK','DEMO UPDATE'];
 labels.forEach((t,i)=>{const x=10+i*210;c.fillStyle='#25371c';c.fillRect(x,430,200,26);pixelText(c,t,x+(200-pixelWidth(t,2))/2,436,i===0?'#f8df91':'#8eb75a',2)});
 pixelText(c,'MO: '+(ticket?'The evidence tells us what comes next.':'Every card belongs to a real milestone.'),10,465,'#d4c5a0',1);
 pixelText(c,'DEMO',607,409,'#b6a17b',1);
}
function drawGameViews(){
 for(const id of ['boardview','ticketview']){
  const c=viewCanvases[id].getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,640,480);
  if(closeArt.complete&&closeArt.naturalWidth)c.drawImage(closeArt,0,0,640,400);else{c.fillStyle='#a67648';c.fillRect(0,0,640,400)}
  if(id==='boardview'){
   pixelText(c,'MILESTONES',289,16,'#3d2c13',1);
   const labels=['DESIGN','ASSETS','BUILD','VERIFY','PLAYTEST','SIGN-OFF','RELEASE','REVIEW'];
   labels.forEach((t,i)=>{const x=36+i*71;c.fillStyle='#714c2b';c.fillRect(x+69,49,1,245);paper(c,x,49,67,22,'#e4cc97');i===7?(pixelText(c,'MAGAZINE',x+10,52,'#3c2b1c'),pixelText(c,'REVIEW',x+16,62,'#3c2b1c')):pixelText(c,t,x+(67-pixelWidth(t))/2,57,'#3c2b1c',1)});
   let counts={};games.forEach((g,index)=>{const n=counts[g.stage]||0;counts[g.stage]=n+1;const x=36+g.stage*71,y=84+n*92;
    paper(c,x,y,65,82,({mm:'#eab989',ag:'#bfd1b9',tg:'#d8d59e'})[g.style]);pin(c,x+28,y+2);
    let next=pixelWrap(c,g.name,x+5,y+13,56,'#342b1d',1,10);
    pixelText(c,g.id,x+5,next+5,'#7b472c',2);
    pixelWrap(c,g.health,x+5,next+26,56,'#514129',1,10);
   });
   pixelText(c,'REVIEW',49,322,'#63462b',1);pixelText(c,'AIM >90%',49,333,'#63462b',1);
   pixelText(c,'RELEASE: GAME + MEDIA KIT',160,322,'#63462b');
   pixelText(c,'THEN INDEPENDENT MAGAZINE REVIEW',160,335,'#63462b');
   pixelText(c,'SAMPLE BOARD',476,328,'#63462b',1);
   gameFooter(c,false);
  }else{
   const g=games[selected];
   c.fillStyle='#1d140b55';c.fillRect(0,0,640,400);
   paper(c,62,38,516,330,'#c4a276');
   paper(c,75,49,490,306,'#e5d5aa');
   c.fillStyle='#544e3a';c.fillRect(268,32,105,21);c.fillStyle='#b4a37b';c.fillRect(274,32,93,15);c.fillStyle='#e6d8b1';c.fillRect(279,34,83,2);
   pixelText(c,'DALEX / MILESTONE RECORD',95,67,'#7a5734',1);
   pixelText(c,g.name,95,88,'#3d2c1b',2);
   let y=pixelWrap(c,g.id+' - '+g.title,95,111,447,'#6d482b',1,12);
   c.fillStyle='#b39b70';c.fillRect(95,141,447,1);
   [['STAGE',stages[g.stage]],['HEALTH',g.health],['REVIEW','No verified score in this demo']].forEach(([k,v],i)=>{pixelText(c,k,95,156+i*19,'#88613b');pixelText(c,v,165,156+i*19,'#3f321e')});
   c.fillStyle='#b39b70';c.fillRect(95,216,447,1);pixelText(c,'EVIDENCE / NEXT STEP',95,230,'#88613b');
   y=pixelWrap(c,g.evidence,95,248,438,'#3f321e',1,13);pixelWrap(c,g.next,95,y+7,438,'#3f321e',1,13);
   pixelText(c,'SAMPLE RECORD - READ ONLY',95,334,'#98764b');gameFooter(c,true);
  }
 }
}
const originalShow=show;show=function(name){originalShow(name);drawGameViews()};
const originalRender=render;render=function(){originalRender();drawGameViews()};
const originalTicket=drawTicket;drawTicket=function(){originalTicket();drawGameViews()};
closeArt.onload=drawGameViews;drawGameViews();

// Office and controls use the same native bitmap renderer as the close-ups.
const officeCanvas=document.createElement('canvas');officeCanvas.width=640;officeCanvas.height=480;officeCanvas.setAttribute('aria-hidden','true');document.getElementById('scene').prepend(officeCanvas);
const officeArt=new Image();officeArt.src='production-office-art.png?v=native1';
function drawOffice(){
 const c=officeCanvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#211912';c.fillRect(0,0,640,480);
 if(officeArt.complete&&officeArt.naturalWidth)c.drawImage(officeArt,0,0,640,400);
 paper(c,339,62,208,17,'#e4cca0');pixelText(c,'DALEX - MILESTONES',395,67,'#47321b');
 short.forEach((s,i)=>{const x=339+i*26;c.fillStyle='#71502c';c.fillRect(x+25,80,1,78);paper(c,x+1,82,24,13,'#e6cfa2');pixelText(c,s,x+(26-pixelWidth(s))/2,85,'#392d1c')});
 games.forEach((g,i)=>{const x=339+g.stage*26+3,y=i===0?103:128;paper(c,x,y,20,23,({mm:'#eab989',ag:'#bfd1b9',tg:'#d8d59e'})[g.style]);pixelText(c,g.code,x+3,y+4,'#3b2f20');pixelText(c,g.id,x+3,y+13,'#3b2f20')});
 c.fillStyle='#11170e';c.fillRect(0,400,640,80);c.fillStyle='#71613a';c.fillRect(0,400,640,3);c.fillStyle='#252318';c.fillRect(0,403,640,20);
 const sentence=document.getElementById('sentence').textContent.replace('…','...');pixelText(c,sentence,10,409,'#edcc88');
 document.querySelectorAll('.verb').forEach((b,i)=>{const x=7+(i%3)*113,y=426+Math.floor(i/3)*26;c.fillStyle=b.classList.contains('active')?'#33432a':'#203019';c.fillRect(x,y,110,23);pixelText(c,b.textContent,x+(110-pixelWidth(b.textContent,2))/2,y+5,b.classList.contains('active')?'#ffe69c':'#8cba59',2)});
 pixelText(c,'MO - PRODUCTION',350,428,'#f0d6a0');
 pixelWrap(c,document.getElementById('speech').textContent.replace(/[“”]/g,'').replace(/’/g,"'"),350,440,275,'#c4b492',1,10);
 pixelText(c,'ILLUSTRATIVE DATA',350,470,'#9e906f');
 c.fillStyle='#26351f';c.fillRect(548,463,83,14);pixelText(c,'DEMO UPDATE',555,467,'#c9d2ad');
}
const closeupsOnly=drawGameViews;drawGameViews=function(){closeupsOnly();drawOffice()};
new MutationObserver(()=>{drawOffice();drawFocus()}).observe(document.getElementById('controls'),{subtree:true,childList:true,characterData:true,attributes:true});
officeArt.onload=drawOffice;drawOffice();
document.getElementById('controls').append(document.getElementById('demo'));
let pixelHover=null;
function drawFocus(){
 const target=pixelHover||document.activeElement;
 if(!target||!target.matches('button,a')||!target.getClientRects().length)return;
 const screen=document.getElementById('screen').getBoundingClientRect(),r=target.getBoundingClientRect(),scale=screen.width/640;
 const canvas=view==='scene'?officeCanvas:viewCanvases[view];if(!canvas)return;
 const c=canvas.getContext('2d');c.strokeStyle='#ffdf8d';c.lineWidth=1;
 c.strokeRect(Math.floor((r.left-screen.left)/scale)+.5,Math.floor((r.top-screen.top)/scale)+.5,Math.floor(r.width/scale)-1,Math.floor(r.height/scale)-1);
}
const nativeViews=drawGameViews;drawGameViews=function(){nativeViews();drawFocus()};
for(const event of ['focusin','focusout'])document.getElementById('screen').addEventListener(event,()=>requestAnimationFrame(drawGameViews));
document.getElementById('screen').addEventListener('pointerover',e=>{pixelHover=e.target.closest('button,a');drawGameViews()});
document.getElementById('screen').addEventListener('pointerleave',()=>{pixelHover=null;drawGameViews()});
