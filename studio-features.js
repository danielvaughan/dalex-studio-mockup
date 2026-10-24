/* Native-pixel UI extensions. JSSpeccy is a browser prototype, not a SCUMM opcode. */
const shelfCovers = cassetteLibrary.map(g => {const i=new Image();i.src=g.cover;i.onload=()=>drawGameViews();return i});
const percyArt=new Image();percyArt.src='sprites/percy-strip.png';
const propSprites={};
for(const name of ['ledger-closed','ledger-open','cassette-case','cassette-tape','microvitec-cub']){const i=new Image();i.src='sprites/'+name+'.png';i.onload=()=>drawGameViews();propSprites[name]=i}
function spriteReady(i){return i.complete&&i.naturalWidth}
let ledgerPage=0, ledgerStale=false, chosenCassette=0, emulator=null, emulatorAPI=null;
let playerStatus='SELECT A CASSETTE', playerFrames=0, soundEnabled=true, restartArmed=false, loadingToken=0;
const heldGameKeys=new Map();
const playerHost=document.createElement('div');
playerHost.style.cssText='position:fixed;left:-10000px;top:0;width:320px;height:240px;opacity:0;pointer-events:none';
playerHost.setAttribute('aria-hidden','true');document.body.append(playerHost);
const featureControls={};
function hotspot(parent,id,label,x,y,w,h,fn){
 const b=document.createElement('button');b.id=id;b.textContent=label;b.setAttribute('aria-label',label);
 b.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:0;z-index:4;padding:0;border:0`;
 b.onclick=fn;parent.append(b);return b;
}
for(const id of ['libraryview','playerview','ledgerview','percyview']){
 const section=document.createElement('section');section.id=id;section.className='view hidden';section.setAttribute('aria-label',id.replace('view',''));
 const cv=document.createElement('canvas');cv.width=640;cv.height=480;cv.setAttribute('aria-hidden','true');section.append(cv);
 document.getElementById('screen').append(section);viewCanvases[id]=cv;featureControls[id]=section;
}
function releaseGameKeys(){if(!emulator)return;for(const e of heldGameKeys.values())emulator.keyboardHandler.keyupHandler(e);heldGameKeys.clear()}
function pauseGame(){releaseGameKeys();if(emulator)emulator.pause()}
const baseShow=show;
show=function(name){
 if(view==='playerview' && name!=='playerview'){pauseGame();restartArmed=false}
 baseShow(name);
 for(const id of Object.keys(featureControls))document.getElementById(id).classList.toggle('hidden',id!==name);
 drawGameViews();
};
function openFeature(name){show(name);featureControls[name].querySelector('button')?.focus()}
hotspot(document.getElementById('scene'),'cassette-shelf','Look at the cassette shelf',214,91,82,63,()=>openFeature('libraryview'));
hotspot(document.getElementById('scene'),'accounts-ledger','Open Ken\'s accounts ledger',224,318,64,40,()=>openFeature('ledgerview'));
hotspot(document.getElementById('scene'),'computer-screen','Look at the game monitor',132,169,37,30,()=>startCassette(chosenCassette));
const percyButton=hotspot(document.getElementById('scene'),'percy-cat','Look at Percy the office cat',340,355,35,30,()=>openFeature('percyview'));
cassetteLibrary.forEach((g,i)=>hotspot(featureControls.libraryview,'cassette-'+g.id,'Play '+g.title,51+i*184,68,164,278,()=>startCassette(i)));
hotspot(featureControls.libraryview,'library-back','Go back to office',222,430,196,28,()=>show('scene'));
hotspot(featureControls.ledgerview,'ledger-prev','Previous ledger page',10,430,150,28,()=>{ledgerPage=(ledgerPage+3)%4;drawGameViews()});
hotspot(featureControls.ledgerview,'ledger-back','Go back to office',170,430,140,28,()=>show('scene'));
hotspot(featureControls.ledgerview,'ledger-next','Next ledger page',320,430,150,28,()=>{ledgerPage=(ledgerPage+1)%4;drawGameViews()});
hotspot(featureControls.ledgerview,'ledger-stale','Toggle stale sample data',480,430,150,28,()=>{ledgerStale=!ledgerStale;drawGameViews()});
hotspot(featureControls.percyview,'percy-back','Go back to office',222,430,196,28,()=>show('scene'));
hotspot(featureControls.playerview,'player-toggle','Play or pause game',10,430,146,28,()=>{restartArmed=false;if(playerStatus.startsWith('LOAD ERROR')){startCassette(chosenCassette,true)}else if(emulator){if(emulator.isRunning)pauseGame();else{emulator.start();applySound()}}else startCassette(chosenCassette);drawGameViews()});
hotspot(featureControls.playerview,'player-sound','Toggle game sound',168,430,146,28,()=>{soundEnabled=!soundEnabled;applySound();drawGameViews()});
hotspot(featureControls.playerview,'player-restart','Restart game: click twice to confirm',326,430,146,28,()=>{if(restartArmed)startCassette(chosenCassette,true);else{restartArmed=true;drawGameViews()}});
hotspot(featureControls.playerview,'player-back','Go back to cassettes',484,430,146,28,()=>openFeature('libraryview'));
function applySound(){if(!emulator?.isRunning)return;if(soundEnabled){if(!emulator.audioHandler.isActive)emulator.audioHandler.start()}else if(emulator.audioHandler.isActive)emulator.audioHandler.stop()}
window.alert=message=>{playerStatus='LOAD ERROR - '+String(message).slice(0,65);pauseGame();drawGameViews()};
async function startCassette(index,force=false){
 const same=chosenCassette===index;chosenCassette=index;restartArmed=false;show('playerview');
 if(same && emulator && !force){emulator.start();applySound();return}
 const token=++loadingToken;pauseGame();emulatorAPI?.exit();emulator=null;emulatorAPI=null;playerFrames=0;playerStatus='LOADING TAPE...';drawGameViews();
 const g=cassetteLibrary[index];
 try{
  if(location.protocol==='file:')throw new Error('Open the hosted demo to play');
  const response=await fetch(g.tape);if(!response.ok)throw new Error('Tape unavailable');
  const bytes=await response.arrayBuffer();const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
  if(hash!==g.sha256)throw new Error('Tape hash mismatch');if(token!==loadingToken)return;
  playerHost.replaceChildren();
  emulatorAPI=JSSpeccy(playerHost,{machine:128,zoom:1,autoLoadTapes:true,autoStart:true,openUrl:g.tape,uiEnabled:false,sandbox:true});
  emulator=window.__zxEmu;
  const instance=emulator;
  instance.worker.addEventListener('message',e=>{
   if(instance!==emulator)return;
   if(e.data.message==='frameCompleted'){playerFrames++;if(playerFrames>100)playerStatus='PLAYABLE GAME';if(view!=='playerview'||document.hidden)pauseGame();else if(!soundEnabled&&instance.audioHandler.isActive)instance.audioHandler.stop()}
  });
 }catch(e){playerStatus='LOAD ERROR: '+e.message;drawGameViews()}
}
for(const kind of ['keydown','keyup'])document.addEventListener(kind,e=>{
 if(view!=='playerview'){
  if(kind==='keydown'&&e.key==='Escape'&&Object.keys(featureControls).includes(view)){e.preventDefault();e.stopImmediatePropagation();show('scene')}
  return;
 }
 if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(kind==='keydown')openFeature('libraryview');return}
 if(e.key==='Tab'||e.metaKey||e.ctrlKey)return;
 // Space/Enter on a focused UI button remain navigation actions, not Spectrum keys.
 if((e.key===' '||e.key==='Enter')&&document.activeElement?.tagName==='BUTTON')return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!emulator?.isRunning)return;
 if(kind==='keydown'){heldGameKeys.set(e.code,e);emulator.keyboardHandler.keydownHandler(e)}
 else{heldGameKeys.delete(e.code);emulator.keyboardHandler.keyupHandler(e)}
},true);
addEventListener('blur',()=>{pauseGame();drawGameViews()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseGame()});
// Clicking the picture restores game input after operating the native controls.
hotspot(featureControls.playerview,'player-picture','Focus Spectrum keyboard controls',30,79,320,240,()=>{document.activeElement?.blur();playerHost.blur()});
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
function footer(c,title,buttons){
 rect(c,0,400,640,80,'#11170e');rect(c,0,400,640,3,'#76613b');pixelText(c,title,10,410,'#e8cc94');
 buttons.forEach(([label,x,w])=>{rect(c,x,430,w,28,'#283b21');pixelText(c,label,x+(w-pixelWidth(label,2))/2,438,'#a6c976',2)});
 pixelText(c,'DALEX SOFTWARE / 1987',10,468,'#a99a77');
}
function roomBase(c){c.imageSmoothingEnabled=false;rect(c,0,0,640,480,'#2c1d14');if(officeArt.complete&&officeArt.naturalWidth)c.drawImage(officeArt,0,0,640,400);rect(c,0,0,640,400,'#130e09b8')}
function drawLibrary(c){
 roomBase(c);paper(c,22,16,596,374,'#8b5835');paper(c,36,25,568,28,'#dbc28b');pixelText(c,'DALEX CASSETTE LIBRARY',158,32,'#3b2b1e',2);
 cassetteLibrary.forEach((g,i)=>{const x=51+i*184;const shell=propSprites['cassette-case'];if(spriteReady(shell))c.drawImage(shell,2,9,20,29,x+10,75,140,203);const art=shelfCovers[i];
  if(art.complete&&art.naturalWidth)c.drawImage(art,x+17,96,105,161);
  else pixelText(c,'ART PENDING',x+20,170,'#dbc28b');
  rect(c,x+6,284,152,29,'#d9c597');pixelText(c,g.title,x+12,290,'#392b1c');pixelText(c,g.milestone+' / 128K / PLAY',x+12,301,'#5e4931');
  pixelText(c,'KIT '+g.sha256.slice(0,8),x+17,334,'#ead5a8');
 });
 rect(c,35,351,572,10,'#ba854c');rect(c,35,361,572,5,'#4e301e');pixelText(c,'ARCHIVED MILESTONE BUILDS - CLICK A CASSETTE',103,377,'#e5c891');
 footer(c,'LOOK AT A CASSETTE - ORIGINAL MEDIA-KIT ART',[['GO BACK',222,196]]);
}
function drawPlayer(c){
 roomBase(c);const g=cassetteLibrary[chosenCassette];
 const monitor=propSprites['microvitec-cub'];if(spriteReady(monitor))c.drawImage(monitor,10,49,360,304);else rect(c,10,49,360,304,'#242420');
 if(emulator?.canvas)c.drawImage(emulator.canvas,30,79,320,240);else pixelWrap(c,playerStatus,45,180,280,'#c4d69a',1,13);
 pixelText(c,'MICROVITEC CUB / 14-INCH RGB',30,360,'#e0c997');
 paper(c,384,44,240,340,'#decda3');pixelWrap(c,g.title,398,59,214,'#40301e',2,19);
 pixelText(c,g.milestone+' / '+g.sha256.slice(0,8),398,106,'#795638');pixelText(c,'KEYBOARD CONTROLS',398,126,'#795638');
 let y=143;g.controls.slice(0,9).forEach(([key,meaning])=>{pixelText(c,key,398,y,'#463522');y=pixelWrap(c,meaning,398,y+10,207,'#79613f',1,10)+5});
 pixelText(c,'ESC: BACK TO CASSETTES',398,365,'#604b2c');
 pixelWrap(c,playerStatus,30,373,331,'#e0c997',1,11);
 pixelText(c,g.id==='tiger-gorilla'?'TITLE: 2 KEYBOARD, THEN SPACE':'TITLE: SPACE TO START',30,385,'#c7b387');
 footer(c,emulator?.isRunning?'PLAYING - CLICK PICTURE TO FOCUS KEYS':'PAUSED / USE PLAY TO RESUME',[[emulator?.isRunning?'PAUSE':'PLAY',10,146],[soundEnabled?'SOUND ON':'SOUND OFF',168,146],[restartArmed?'CONFIRM?':'RESTART',326,146],['BACK',484,146]]);
}
const ledgerNames=['SUMMARY','BY GAME','BY MODEL','RECENT WORK'];
function drawLedger(c){
 roomBase(c);paper(c,32,22,576,360,'#6b4429');paper(c,43,30,552,342,'#e0cea3');rect(c,72,32,1,337,'#b97962');
 for(let y=93;y<355;y+=23)rect(c,52,y,532,1,'#a89c7866');
 pixelText(c,"KEN'S ACCOUNTS",93,47,'#4c3522',2);pixelText(c,ledgerNames[ledgerPage]+' / PAGE '+(ledgerPage+1)+' OF 4',93,72,'#7a5835');
 const pages=[
 [['SAMPLE FIGURES - API ESTIMATE','USD'],['PRICED TOTAL','124.80'],['TODAY','18.60'],['LAST HOUR','2.40'],['UNPRICED USAGE','12,400 TOKENS'],['GBP RATE','NOT PROVIDED'],['BASIS','LIST-PRICE EQUIVALENT'],['PRICING DATE','24 OCT 2026 / SAMPLE']],
 [['GAME / SCOPE','ESTIMATE USD'],['MOWER MAYHEM','52.40'],['ANTIGRAVITY','38.20'],['TIGER GORILLA','24.60'],['UNATTRIBUTED','9.60'],['KNOWN SUBTOTAL','124.80'],['UNKNOWN COSTS','NOT INCLUDED']],
 [['MODEL / VENDOR','ESTIMATE USD'],['CLOUD TEXT / SAMPLE A','86.40'],['CLOUD ART / SAMPLE B','38.40'],['UNKNOWN MODEL','UNPRICED'],['LOCAL MODELS','NO API FEE'],['POWER / HARDWARE','NOT MEASURED'],['ACTUAL BILLS','NOT CONNECTED']],
 [['WORK / SAMPLE SESSION','ESTIMATE USD'],['10:20  CAMPAIGN BUILD','4.20'],['09:55  SPRITE REVIEW','1.80'],['09:30  GAME VERIFICATION','2.40'],['OWNER DIRECTIVE','DEMO RECORD ONLY'],['COST NOTICES','NOT INVOICES'],['TOTAL COVERAGE','PARTIAL / SAMPLE']]
 ];
 pages[ledgerPage].forEach(([a,b],i)=>{pixelText(c,a,86,104+i*23,'#54402a');pixelText(c,b,420,104+i*23,'#54402a')});
 pixelText(c,ledgerStale?'STALE SAMPLE - LAST UPDATE 10 MIN AGO':'SAMPLE DATA - NOT YOUR PRIVATE ACCOUNTS',86,319,ledgerStale?'#983e2b':'#795c38');
 pixelText(c,'ESTIMATES ARE NOT PAYMENTS OR INVOICES',86,343,'#795c38');
 footer(c,'LOOK AT THE ACCOUNTS - READ ONLY',[['PREV',10,150],['BACK',170,140],['NEXT',320,150],[ledgerStale?'FRESH':'STALE',480,150]]);
}
function drawPercy(c){
 roomBase(c);paper(c,95,45,450,300,'#dec89b');pixelText(c,'PERCY',230,65,'#4b3420',3);
 if(percyArt.complete&&percyArt.naturalWidth)c.drawImage(percyArt,160,0,40,32,126,111,120,96);
 pixelWrap(c,'Dark face and paws. Pale green-gold eyes. Warm-monitor inspector.',260,123,250,'#503b26',1,15);
 pixelWrap(c,'MRRP? Percy has found a warm spot near the computers.',130,225,380,'#503b26',2,20);
 pixelText(c,'CAT SOUNDS ONLY. NO HUMAN DIALOGUE.',130,315,'#876640');footer(c,'LOOK AT PERCY',[['GO BACK',222,196]]);
}
const beforeFeatureOffice=drawOffice;
drawOffice=function(){
 beforeFeatureOffice();const c=officeCanvas.getContext('2d');c.imageSmoothingEnabled=false;
 // Registered cassette shelf and ledger painted at native size over existing furniture.
 rect(c,214,91,82,63,'#39261a');rect(c,214,145,82,8,'#9a6336');
 cassetteLibrary.forEach((g,i)=>{const x=218+i*24;const shell=propSprites['cassette-case'];if(spriteReady(shell))c.drawImage(shell,x,104,24,40);const art=shelfCovers[i];if(spriteReady(art))c.drawImage(art,x+4,116,13,21)});
 const ledger=propSprites[pixelHover?.id==='accounts-ledger'?'ledger-open':'ledger-closed'];if(spriteReady(ledger))c.drawImage(ledger,224,318,64,40);
 const tape=propSprites['cassette-tape'];if(spriteReady(tape))c.drawImage(tape,492,342,56,32);
 if(emulator?.canvas){c.drawImage(emulator.canvas,136,174,24,18)}
 const step=officeMotion?officeTick%140:50;
 const walking=step<25||(step>=70&&step<95),left=step>=70;
 const x=step<25?330+step*2:step<70?378:step<95?378-(step-70)*2:330;
 const frame=walking?Math.floor(step/2)%4:(step%32===0?5:step>110?6:4);
 if(spriteReady(percyArt)){c.save();if(left&&walking){c.translate(x+40,0);c.scale(-1,1);c.drawImage(percyArt,frame*40,0,40,32,0,352,40,32)}else c.drawImage(percyArt,frame*40,0,40,32,x,352,40,32);c.restore()}
 percyButton.style.left=x+'px';percyButton.style.top='352px';percyButton.style.width='40px';percyButton.style.height='32px';

};
const beforeFeatureViews=drawGameViews;
drawGameViews=function(){beforeFeatureViews();
 const draws={libraryview:drawLibrary,playerview:drawPlayer,ledgerview:drawLedger,percyview:drawPercy};
 if(draws[view]){const c=viewCanvases[view].getContext('2d');c.imageSmoothingEnabled=false;draws[view](c);drawFocus()}
};
setInterval(()=>{if(view==='playerview'&&!document.hidden)drawGameViews()},40);
percyArt.onload=drawGameViews;drawGameViews();
