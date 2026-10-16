/* World generation (no drawing) */
function reach(a,b2){const q=[a],seen=new Set([a+'']);
  while(q.length){const [x,y]=q.shift();if(x===b2[0]&&y===b2[1])return true;
    for(const [dx,dy] of DV){const nx=x+dx,ny=y+dy,k=nx+','+ny;
      if(!seen.has(k)&&t[ny]&&t[ny][nx]!==undefined&&!SOL.includes(t[ny][nx])){seen.add(k);q.push([nx,ny])}}}
  return false}
function gen(){
  t=Array.from({length:H},()=>Array(W).fill(0));traps=[];vaults=[];geese=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const r=Math.random();
    if(x<2||y<2||x>=W-2||y>=H-2||r<.12)t[y][x]=1;else if(r<.19)t[y][x]=6;else if(r<.22)t[y][x]=8}
  const lx=26+rnd(6),ly=21+rnd(3);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if((x-lx)**2/30+(y-ly)**2/12<1)t[y][x]=2;
  const fill=(x0,y0,x1,y1,v)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)t[y][x]=v};
  fill(3,21,15,29,0);fill(3,26,15,26,3);fill(8,21,8,29,3);fill(4,23,6,24,7);fill(11,23,13,24,7);
  [[3,28],[5,28],[13,28],[14,22]].forEach(([x,y])=>t[y][x]=6);
  const carve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if([0,1,2,6,8].includes(t[y][x]))t[y][x]=3};
  TIER.forEach(T=>{
    const {cx,cy}=T,x1=cx+10,y1=cy+8;let vx;
    fill(cx-1,cy-1,x1+1,y1+2,0);
    for(let n=0;n<40;n++){
      fill(cx,cy,x1,y1,4);fill(cx+1,cy+1,x1-1,y1-1,5);t[y1][cx+5]=5;
      for(let k=0;k<9;k++){const x=cx+2+rnd(7),y=cy+2+rnd(5);if(x!==cx+5)t[y][x]=4}
      vx=cx+2+rnd(7);t[cy+1][vx]=5;if(reach([cx+5,y1],[vx,cy+1]))break}
    const free=[];
    for(let y=cy+1;y<y1;y++)for(let x=cx+1;x<x1;x++)if(t[y][x]===5&&!(x===vx&&y===cy+1)&&!(x===cx+5&&y>=y1-1))free.push([x,y]);
    free.sort(()=>Math.random()-.5);
    free.splice(0,T.tr).forEach(([x,y],i)=>traps.push({x,y,t:i===0?'decoy':['rake','honey','decoy'][rnd(3)],rev:false,hit:false}));
    free.splice(0,T.gs).forEach(([x,y])=>geese.push({x,y,fx:x+.5,fy:y+.5,d:rnd(4),cd:0}));
    vaults.push({x:vx,y:cy+1,name:T.n,loot:T.st[0]+rnd(T.st[1]),done:false});
    carve(cx+5,y1+1,cx+5,26);carve(Math.min(cx+5,15),26,Math.max(cx+5,15),26);
  });
  for(let n=0;n<6;){const x=2+rnd(W-4),y=2+rnd(H-4);
    if(t[y][x]===0&&Math.hypot(x-SPX,y-SPY)>9){geese.push({x,y,fx:x+.5,fy:y+.5,d:rnd(4),cd:0});n++}}
  npc={x:10,y:25};
  P={x:SPX+.5,y:SPY+.5,vx:0,vy:0,dir:1,ph:0,mv:false,slow:0,stun:0,cd:0,lx:SPX,ly:SPY};
  cam={x:P.x*TS-VW*TS/2,y:P.y*TS-VH*TS/2};
  }
