/* Input and main loop */
addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();
  if(k==='e'&&!keys.e)scan();if((k===' '||k==='Enter')&&!keys[k])interact();keys[k]=true});
addEventListener('blur',()=>{keys={}});
addEventListener('keyup',e=>{keys[e.key.length===1?e.key.toLowerCase():e.key]=false});
document.querySelectorAll('#pad button').forEach(bt=>{const k=bt.dataset.k;
  bt.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>bt.addEventListener(ev,()=>keys[k]=false))});
$('bA').onclick=interact;$('bE').onclick=scan;
$('bN').onclick=()=>{gen();bake();hideDlg();say('A new world appears. Talk to the guide with Space.')};
gen();bake();say('Welcome! Walk with the arrow keys or WASD. Find the guide in the yellow shirt and press Space.',true);
let last=performance.now();
(function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;update(dt);draw();requestAnimationFrame(loop)})(last);
