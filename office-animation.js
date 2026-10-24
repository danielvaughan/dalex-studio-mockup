/* Mockup-only small gestures sampled from the painted scene, not SCUMM costumes.
   Fixed integer coordinates keep desks, silhouettes and the board registered. */
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let officeMotion = !motionPreference.matches;
let officeTick = 0;
let speakingUntil = 0;
let speakingPerson = 'mo';
const motionButton = document.createElement('button');
motionButton.id = 'motion-toggle';
motionButton.type = 'button';
motionButton.style.cssText = 'position:absolute;left:448px;top:60px;width:94px;height:14px;padding:0;margin:0;opacity:0';
document.getElementById('controls').append(motionButton);
function motionLabel() {
 motionButton.textContent = officeMotion ? 'PAUSE MOTION' : 'PLAY MOTION';
 motionButton.setAttribute('aria-pressed', String(officeMotion));
 motionButton.setAttribute('aria-label', officeMotion ? 'Pause character animation (A)' : 'Play character animation (A)');
}
function toggleOfficeMotion() { officeMotion = !officeMotion; motionLabel(); drawGameViews(); }
motionButton.onclick = toggleOfficeMotion;
document.addEventListener('keydown', e => {
 if(e.key.toLowerCase() === 'a' && !e.repeat && !e.ctrlKey && !e.metaKey && !e.altKey) toggleOfficeMotion();
});
motionPreference.addEventListener('change', e => { officeMotion = !e.matches; motionLabel(); drawGameViews(); });
for (const name of ['mo', 'gareth']) document.getElementById(name).addEventListener('click', () => {
 speakingPerson = name; speakingUntil = performance.now() + 3200;
 if(name === 'gareth') document.getElementById('speech').textContent = 'Gareth: Just finishing this bit of code.';
 drawGameViews();
});
// Native reference surface: crops never sample high-resolution or previously animated pixels.
const gestureSource = document.createElement('canvas');
gestureSource.width = 640; gestureSource.height = 400;
let gestureReady = false;
function prepareGestures() {
 if(!officeArt.complete || !officeArt.naturalWidth) return;
 const c = gestureSource.getContext('2d'); c.imageSmoothingEnabled = false;
 c.drawImage(officeArt, 0, 0, 640, 400); gestureReady = true;
}
officeArt.addEventListener('load', prepareGestures); prepareGestures();
const stillOffice = drawOffice;
drawOffice = function() {
 stillOffice();
 const c = officeCanvas.getContext('2d'); c.imageSmoothingEnabled = false;
 if(officeMotion && gestureReady) {
  // Interior hand clusters move one native pixel; wrists and keyboard stay fixed.
  const tap = officeTick % 6;
  if(tap === 1 || tap === 4) c.drawImage(gestureSource, 135, 298, 11, 5, 135, 299, 11, 5);
  if(tap === 2 || tap === 5) c.drawImage(gestureSource, 150, 300, 10, 4, 150, 299, 10, 4);
  if(officeTick % 8 === 2) c.drawImage(gestureSource, 163, 201, 7, 3, 163, 202, 7, 3);
  // Brief, staggered eyelids over the painted eyes.
  if(officeTick % 37 === 0) { c.fillStyle='#be8060'; c.fillRect(132,239,3,1); c.fillRect(140,240,3,1); }
  if(officeTick % 43 === 12) { c.fillStyle='#cc9473'; c.fillRect(506,189,3,1); c.fillRect(516,189,3,1); }
  if(performance.now() < speakingUntil && officeTick % 3 !== 0) {
   c.fillStyle='#63372c';
   if(speakingPerson === 'mo') c.fillRect(510,199,4,2);
   else c.fillRect(135,250,3,2);
  }
 }
 c.fillStyle='#26351f'; c.fillRect(448,463,94,14);
 pixelText(c, officeMotion ? 'PAUSE MOTION' : 'PLAY MOTION', 453,467,'#c9d2ad');
};
motionLabel();
// Low-rate held poses mimic adventure animation; background tabs and close-ups do no work.
setInterval(() => {
 if(!officeMotion || document.hidden || view !== 'scene') return;
 officeTick++; drawOffice(); drawFocus();
}, 140);
drawGameViews();
