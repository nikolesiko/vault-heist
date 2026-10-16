/* Game state and rules */
let t,traps,vaults,geese,npc,P,cam,coins=20,keys={},flash=0,msgT=0,dlgOpen=false,talk=0,clock=0,scanFx=null;
const solid=(x,y)=>x<0||y<0||x>=W||y>=H||SOL.includes(t[y][x])||(npc.x===x&&npc.y===y);
const hit=(x,y)=>{const h=.27,f=Math.floor;return solid(f(x-h),f(y-h))||solid(f(x+h),f(y-h))||solid(f(x-h),f(y+h))||solid(f(x+h),f(y+h))};
function say(m,sticky){const d=$('dlg');d.textContent=m;d.style.display='block';dlgOpen=!!sticky;msgT=sticky?0:clock+3.4}
function hideDlg(){$('dlg').style.display='none';dlgOpen=false}
function dirWord(dx,dy){const a=Math.atan2(dy,dx)*180/Math.PI,w=['east','south-east','south','south-west','west','north-west','north','north-east'];return w[(Math.round(a/45)+8)%8]}
function interact(){
  if(dlgOpen){hideDlg();return}
  if(Math.hypot(npc.x+.5-P.x,npc.y+.5-P.y)>1.9){say('Nobody to talk to here.');return}
  const L=['Welcome to Goose Town! Rob the vaults, but watch out: some of them are mirrors.',
    'Vaults: '+vaults.map(v=>v.name+' is '+Math.round(Math.hypot(v.x-npc.x,v.y-npc.y))+' tiles '+dirWord(v.x-npc.x,v.y-npc.y)).join(', ')+'.',
    'Press E to scan for traps. It costs 3 coins. Follow the dirt paths out of town to find the compounds.'];
  say(L[talk++%3],true)}
function scan(){
  if(dlgOpen)return;
  if(coins<3){say('You need 3 coins to scan.');return}
  coins-=3;let n=0;scanFx={x:P.x,y:P.y,t:0};
  traps.forEach(r=>{if(Math.hypot(r.x+.5-P.x,r.y+.5-P.y)<=4.5&&!r.rev){r.rev=true;n++}});
  say(n?'Scan revealed '+n+' trap'+(n>1?'s':'')+' nearby.':'Scan found nothing new nearby.')}
function stepOn(tx,ty){
  const tr=traps.find(r=>r.x===tx&&r.y===ty&&!r.hit);
  if(tr){tr.hit=tr.rev=true;flash=.3;
    if(tr.t==='rake'){P.slow=4;say('Rake to the face! You move slowly for a bit.')}
    else if(tr.t==='honey'){coins=Math.max(0,coins-5);P.x=SPX+.5;P.y=SPY+.5;P.lx=SPX;P.ly=SPY;P.vx=P.vy=0;say('Honeypot! Alarm! A 5 coin fine, and you wake up in town.')}
    else{P.stun=2;coins=Math.max(0,coins-2);say('That vault was a mirror. -2 coins and you are dazed.')}}
  const v=vaults.find(v=>v.x===tx&&v.y===ty&&!v.done);
  if(v){v.done=true;coins+=v.loot;flash=.3;say('You cracked the '+v.name+' vault! +'+v.loot+' coins.')}
}
function update(dt){
  clock+=dt;P.slow=Math.max(0,P.slow-dt);P.stun=Math.max(0,P.stun-dt);P.cd=Math.max(0,P.cd-dt);flash=Math.max(0,flash-dt);
  if(msgT&&clock>msgT){msgT=0;if(!dlgOpen)hideDlg()}
  if(scanFx){scanFx.t+=dt;if(scanFx.t>.7)scanFx=null}
  const ax=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),ay=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);
  if(ax&&!ay)P.dir=ax<0?2:3;else if(ay&&!ax)P.dir=ay<0?1:0;
  const L=Math.hypot(ax,ay)||1,sp=(P.stun>0||dlgOpen)?0:4.4*(P.slow>0?.5:1),k=Math.min(1,dt*12);
  P.vx+=(ax/L*sp-P.vx)*k;P.vy+=(ay/L*sp-P.vy)*k;
  const nx=P.x+P.vx*dt;if(!hit(nx,P.y))P.x=nx;else P.vx=0;
  const ny=P.y+P.vy*dt;if(!hit(P.x,ny))P.y=ny;else P.vy=0;
  const spd=Math.hypot(P.vx,P.vy);P.mv=spd>.5;P.ph+=spd*dt*2.6;
  const tx=Math.floor(P.x),ty=Math.floor(P.y);
  if(tx!==P.lx||ty!==P.ly){P.lx=tx;P.ly=ty;stepOn(tx,ty)}
  geese.forEach(o=>{o.cd-=dt;
    if(o.cd<=0){o.cd=.7+Math.random()*.7;if(Math.random()<.4)o.d=rnd(4);const gx=o.x+DV[o.d][0],gy=o.y+DV[o.d][1];
      if(!solid(gx,gy)&&t[gy][gx]!==4&&!geese.some(q=>q!==o&&q.x===gx&&q.y===gy)){o.x=gx;o.y=gy}else o.d=rnd(4)}
    const kk=Math.min(1,dt*3.2);o.mvg=Math.hypot(o.x+.5-o.fx,o.y+.5-o.fy)>.06;o.fx+=(o.x+.5-o.fx)*kk;o.fy+=(o.y+.5-o.fy)*kk;o.ph=(o.ph||0)+dt*9;
    if(P.cd<=0&&Math.hypot(o.fx-P.x,o.fy-P.y)<.8){P.cd=1.8;P.stun=.8;flash=.3;coins=Math.max(0,coins-3);P.vx=(P.x-o.fx)*9;P.vy=(P.y-o.fy)*9;say('HONK! A goose pecked you. -3 coins.')}});
  const tgx=Math.max(0,Math.min(W*TS-VW*TS,P.x*TS-VW*TS/2)),tgy=Math.max(0,Math.min(H*TS-VH*TS,P.y*TS-VH*TS/2)),kc=Math.min(1,dt*6);
  cam.x+=(tgx-cam.x)*kc;cam.y+=(tgy-cam.y)*kc;
  const open=vaults.filter(v=>!v.done);
  if(open.length){let bv=open[0],bd=1e9;open.forEach(v=>{const d=Math.hypot(v.x+.5-P.x,v.y+.5-P.y);if(d<bd){bd=d;bv=v}});
    $('near').textContent=bv.name+': '+Math.round(bd)+' tiles '+dirWord(bv.x+.5-P.x,bv.y+.5-P.y)}
  else $('near').textContent='All vaults cracked!';
  $('coins').textContent=coins+' coins';
}
