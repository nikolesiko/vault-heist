/* Canvas setup, sprites and all drawing code */
const C=$('c'),g=C.getContext('2d');C.width=VW*TS;C.height=VH*TS;
const bg=document.createElement('canvas');bg.width=W*TS;bg.height=H*TS;const b=bg.getContext('2d');
const treeSpr=[['#6fce5f','#1f6b34'],['#7ed957','#2a7a3a'],['#58b86a','#1a5f4a']].map((c,n)=>{
  const cv=document.createElement('canvas');cv.width=56;cv.height=64;const x=cv.getContext('2d');
  x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(28,59,17,5,0,0,7);x.fill();
  const tg=x.createLinearGradient(22,0,34,0);tg.addColorStop(0,'#8a5a2b');tg.addColorStop(1,'#5a3a1b');x.fillStyle=tg;x.fillRect(24,40,8,19);
  [[28,27,18],[16,33,13],[40,33,13],[28,14,13],[20,20,11],[37,21,11]].forEach(([px,py,r])=>{
    const gr=x.createRadialGradient(px-r*.35,py-r*.4,r*.1,px,py,r);gr.addColorStop(0,c[0]);gr.addColorStop(1,c[1]);
    x.fillStyle=gr;x.beginPath();x.arc(px,py,r,0,7);x.fill()});
  x.fillStyle='rgba(255,255,255,.18)';for(let i=0;i<6;i++){x.beginPath();x.arc(14+hs(i,n)*28,8+hs(n,i)*26,2+hs(i,i)*2,0,7);x.fill()}
  return cv});
function bake(){
  const nb=(i,j)=>t[j]&&t[j][i]!==undefined?t[j][i]:1;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){
    const v=t[j][i],x=i*TS,y=j*TS;
    if(v===2||v===4||v===5)continue;
    b.fillStyle=`hsl(${96+hs(i,j)*14},${40+hs(i,j,1)*10}%,${48+hs(i,j,2)*7}%)`;b.fillRect(x,y,TS,TS);
    b.strokeStyle='rgba(30,100,40,.3)';b.lineWidth=1.5;
    for(let n=0;n<4;n++){const bx=x+hs(i,j,n+3)*TS,by=y+hs(i,j,n+9)*TS;b.beginPath();b.moveTo(bx,by);b.lineTo(bx+1.5,by-4);b.stroke()}
  }
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){
    const v=t[j][i],x=i*TS,y=j*TS;
    if(v===2){const gr=b.createLinearGradient(0,y,0,y+TS);gr.addColorStop(0,'#46a0ff');gr.addColorStop(1,'#2b72d8');b.fillStyle=gr;b.fillRect(x,y,TS,TS);
      b.fillStyle='rgba(255,255,255,.4)';
      if(nb(i,j-1)!==2)b.fillRect(x,y,TS,4);if(nb(i,j+1)!==2)b.fillRect(x,y+TS-4,TS,4);if(nb(i-1,j)!==2)b.fillRect(x,y,4,TS);if(nb(i+1,j)!==2)b.fillRect(x+TS-4,y,4,TS)}
    else if(v===3){b.fillStyle=`hsl(36,40%,${66+hs(i,j)*8}%)`;b.fillRect(x,y,TS,TS);
      b.fillStyle='rgba(120,85,45,.28)';
      if(![3,5].includes(nb(i,j-1)))b.fillRect(x,y,TS,4);if(![3,5].includes(nb(i,j+1)))b.fillRect(x,y+TS-4,TS,4);
      if(![3,5].includes(nb(i-1,j)))b.fillRect(x,y,4,TS);if(![3,5].includes(nb(i+1,j)))b.fillRect(x+TS-4,y,4,TS);
      b.fillStyle='rgba(110,80,50,.35)';for(let n=0;n<4;n++){b.beginPath();b.ellipse(x+4+hs(i,j,n)*24,y+4+hs(i,j,n+5)*24,1.8,1.2,0,0,7);b.fill()}}
    else if(v===5){b.fillStyle=`hsl(255,18%,${74+hs(i,j)*6}%)`;b.fillRect(x,y,TS,TS);b.strokeStyle='rgba(80,70,120,.25)';b.lineWidth=1.5;b.strokeRect(x+.75,y+.75,TS-1.5,TS-1.5);
      if(hs(i,j,4)<.25){b.beginPath();b.moveTo(x+8,y+10);b.lineTo(x+14,y+16);b.lineTo(x+13,y+24);b.stroke()}}
    else if(v===6){[['#ff5d73',6,9],['#ffd23f',20,21],['#fff',22,8]].forEach(([c,fx,fy],n)=>{if(hs(i,j,n+20)<.8){
      b.fillStyle='#2e8a3a';b.fillRect(x+fx-.5,y+fy,1.5,6);b.fillStyle=c;b.beginPath();b.arc(x+fx,y+fy,3.2,0,7);b.fill();b.fillStyle='#ffd23f';b.beginPath();b.arc(x+fx,y+fy,1,0,7);b.fill()}})}
    else if(v===8){b.fillStyle='rgba(0,0,0,.2)';b.beginPath();b.ellipse(x+17,y+22,10,4,0,0,7);b.fill();
      const gr=b.createRadialGradient(x+13,y+14,2,x+16,y+18,12);gr.addColorStop(0,'#c9c9d6');gr.addColorStop(1,'#7d7d92');b.fillStyle=gr;b.beginPath();b.ellipse(x+16,y+18,10,7,0,0,7);b.fill()}
    else if(v===7){
      if(nb(i,j-1)!==7){b.fillStyle='#c4473a';b.fillRect(x,y,TS,TS);b.strokeStyle='#a33a30';b.lineWidth=2;for(let k=6;k<TS;k+=8){b.beginPath();b.moveTo(x,y+k);b.lineTo(x+TS,y+k);b.stroke()}
        b.fillStyle='rgba(0,0,0,.25)';b.fillRect(x,y+TS-4,TS,4)}
      else{b.fillStyle='#f3e8cb';b.fillRect(x,y,TS,TS);b.fillStyle='rgba(0,0,0,.12)';b.fillRect(x,y,TS,3);
        if(nb(i-1,j)===7&&nb(i+1,j)===7){b.fillStyle='#6b4a2e';b.beginPath();b.roundRect(x+7,y+4,18,TS-4,[8,8,0,0]);b.fill();b.fillStyle='#ffd23f';b.beginPath();b.arc(x+21,y+18,1.8,0,7);b.fill()}
        else{b.fillStyle='#8bc6ee';b.fillRect(x+8,y+7,16,13);b.strokeStyle='#6b4a2e';b.lineWidth=2;b.strokeRect(x+8,y+7,16,13);b.beginPath();b.moveTo(x+16,y+7);b.lineTo(x+16,y+20);b.stroke()}}}
    else if(v===4){b.fillStyle='#4a3578';b.fillRect(x,y,TS,TS);
      b.fillStyle='#6b4f9e';for(let r=0;r<3;r++){const off=r%2?8:0;for(let c=-1;c<3;c++)b.fillRect(x+c*16+off+1,y+r*9+4+1,14,7)}
      b.fillStyle='#9a7fd0';b.fillRect(x,y,TS,4);
      if(nb(i,j+1)===5){const gr=b.createLinearGradient(0,y+TS,0,y+TS+10);gr.addColorStop(0,'rgba(30,20,60,.45)');gr.addColorStop(1,'rgba(30,20,60,0)');b.fillStyle=gr;b.fillRect(x,y+TS,TS,10)}}
  }
}
function person(x,y,d,ph,mv,c){
  const sw=mv?Math.sin(ph)*4:0,bob=mv?Math.abs(Math.sin(ph))*1.6:0;
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x,y,10,4,0,0,7);g.fill();y-=bob;
  g.fillStyle=c.leg;g.fillRect(x-6,y-9,5,9+sw*.5);g.fillRect(x+1,y-9,5,9-sw*.5);
  g.fillStyle=c.body;g.fillRect(x-11,y-22+sw*.6,4,9);g.fillRect(x+7,y-22-sw*.6,4,9);
  g.beginPath();g.roundRect(x-8,y-24,16,15,5);g.fill();
  g.fillStyle=d===1?c.band:c.skin;g.beginPath();g.arc(x,y-31,8,0,7);g.fill();
  if(d!==1){g.fillStyle=c.band;g.beginPath();g.arc(x,y-31,8.3,Math.PI*1.02,Math.PI*1.98);g.fill();g.fillRect(x-8,y-33,16,3);
    g.fillStyle='#15152e';
    if(d===0){g.beginPath();g.arc(x-3,y-29,1.5,0,7);g.arc(x+3,y-29,1.5,0,7);g.fill()}
    else{g.beginPath();g.arc(x+(d===2?-4:4),y-29,1.5,0,7);g.fill()}}
  else{g.fillStyle=c.body;g.fillRect(x-1,y-36,2,5)}
}
function gooseD(x,y,fl,mv,ph){
  const s=fl?-1:1,bob=mv?Math.abs(Math.sin(ph))*1.5:0;
  g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x,y,9,3.5,0,0,7);g.fill();
  g.fillStyle='#ff9f1c';g.fillRect(x-3,y-6,2,6);g.fillRect(x+2,y-6,2,6);y-=bob;
  g.fillStyle='#e8e8ee';g.beginPath();g.moveTo(x-s*8,y-9);g.lineTo(x-s*15,y-14);g.lineTo(x-s*8,y-13);g.fill();
  g.fillStyle='#fff';g.beginPath();g.ellipse(x,y-10,10,6.5,0,0,7);g.fill();
  g.fillStyle='#d4d4de';g.beginPath();g.ellipse(x-s,y-9,6,3.5,0,0,7);g.fill();
  g.strokeStyle='#fff';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x+s*7,y-13);g.lineTo(x+s*9,y-21);g.stroke();
  g.fillStyle='#fff';g.beginPath();g.arc(x+s*10,y-23,4,0,7);g.fill();
  g.fillStyle='#ff9f1c';g.beginPath();g.moveTo(x+s*13.5,y-24);g.lineTo(x+s*19,y-22);g.lineTo(x+s*13.5,y-20.5);g.fill();
  g.fillStyle='#15152e';g.beginPath();g.arc(x+s*11,y-24,1,0,7);g.fill()}
function vaultD(x,y,done){
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+16,y+27,14,4,0,0,7);g.fill();
  const gr=g.createLinearGradient(x,y,x+32,y+28);gr.addColorStop(0,done?'#8a8a9c':'#ffe27a');gr.addColorStop(1,done?'#50506a':'#c9961c');
  g.fillStyle=gr;g.beginPath();g.roundRect(x+3,y+4,26,22,5);g.fill();
  g.fillStyle=done?'#40405a':'#8a6410';g.beginPath();g.roundRect(x+7,y+8,18,14,3);g.fill();
  g.fillStyle=done?'#6a6a82':'#ffd23f';g.beginPath();g.arc(x+16,y+15,4.5,0,7);g.fill();
  g.fillStyle=done?'#40405a':'#8a6410';g.fillRect(x+15,y+11,2,4);
  g.fillStyle='rgba(255,255,255,.4)';g.fillRect(x+5,y+6,10,2)}
function trapD(k,x,y){
  g.strokeStyle='rgba(255,93,115,.85)';g.lineWidth=2;g.setLineDash([4,3]);g.beginPath();g.arc(x+16,y+16,13,0,7);g.stroke();g.setLineDash([]);
  if(k==='rake'){g.strokeStyle='#8a5a2b';g.lineWidth=3;g.beginPath();g.moveTo(x+8,y+22);g.lineTo(x+22,y+10);g.stroke();g.fillStyle='#8a8a9c';g.fillRect(x+17,y+17,10,3);for(let i=0;i<4;i++)g.fillRect(x+17+i*3,y+19,1.5,5)}
  else if(k==='honey'){g.fillStyle='#ffc933';g.beginPath();g.ellipse(x+16,y+18,8,7,0,0,7);g.fill();g.fillStyle='#8a5a2b';g.fillRect(x+11,y+9,10,4)}
  else{g.fillStyle='#bff3ff';g.beginPath();g.ellipse(x+16,y+16,8,10,0,0,7);g.fill();g.fillStyle='#fff';g.fillRect(x+12,y+10,3,6)}}
function draw(){
  const cx=Math.round(cam.x),cy=Math.round(cam.y),i0=Math.floor(cx/TS),j0=Math.floor(cy/TS);
  g.drawImage(bg,cx,cy,VW*TS,VH*TS,0,0,VW*TS,VH*TS);
  g.strokeStyle='rgba(255,255,255,.38)';g.lineWidth=1.5;g.beginPath();
  const items=[];
  for(let j=j0;j<=j0+VH+1;j++)for(let i=i0-1;i<=i0+VW+1;i++){
    if(!t[j]||t[j][i]===undefined)continue;
    const v=t[j][i],x=i*TS-cx,y=j*TS-cy;
    if(v===2){const o=Math.sin(clock*1.6+i*1.3+j*.9)*5;g.moveTo(x+6+o,y+14);g.quadraticCurveTo(x+16+o,y+9,x+26+o,y+14)}
    else if(v===1)items.push({y:j+1,f:()=>g.drawImage(treeSpr[Math.floor(hs(i,j)*3)],x+16-28,y+TS-58)})}
  g.stroke();
  traps.forEach(r=>{const x=r.x*TS-cx,y=r.y*TS-cy;if(r.rev)trapD(r.t,x,y);else if(r.t==='decoy')vaultD(x,y,false)});
  vaults.forEach(v=>vaultD(v.x*TS-cx,v.y*TS-cy,v.done));
  items.push({y:npc.y+.9,f:()=>person((npc.x+.5)*TS-cx,(npc.y+.9)*TS-cy,0,0,false,{leg:'#444',body:'#ffd23f',skin:'#f2d7b6',band:'#7a4a1a'})});
  geese.forEach(o=>items.push({y:o.fy+.4,f:()=>gooseD(o.fx*TS-cx,(o.fy+.4)*TS-cy,o.d===2,o.mvg,o.ph)}));
  items.push({y:P.y,f:()=>{if(!(P.stun>0&&Math.floor(P.stun*10)%2))person(P.x*TS-cx,P.y*TS-cy,P.dir,P.ph,P.mv,{leg:'#1a1b3a',body:'#4b6bff',skin:'#f2d7b6',band:'#ff5d73'})}});
  items.sort((a,b2)=>a.y-b2.y).forEach(it=>it.f());
  if(scanFx){const r=scanFx.t/.7;g.strokeStyle=`rgba(255,210,63,${1-r})`;g.lineWidth=4;g.beginPath();g.arc(scanFx.x*TS-cx,scanFx.y*TS-cy,r*4.5*TS,0,7);g.stroke()}
  g.fillStyle='rgba(10,20,70,.07)';for(let n=0;n<3;n++){g.beginPath();g.ellipse((clock*14+n*260)%900-200,90+n*110,130,50,0,0,7);g.fill()}
  const vg=g.createRadialGradient(240,176,130,240,176,340);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,40,.32)');g.fillStyle=vg;g.fillRect(0,0,VW*TS,VH*TS);
  if(flash>0){g.fillStyle='rgba(255,93,115,.3)';g.fillRect(0,0,VW*TS,VH*TS)}
}
