/* Shared constants and helpers */
const W=44,H=32,TS=32,VW=15,VH=11,$=id=>document.getElementById(id),rnd=n=>Math.floor(Math.random()*n);
const hs=(x,y,s=0)=>{let h=(x*374761393+y*668265263+s*1274126177)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)%1000/1000};
const DV=[[0,1],[0,-1],[-1,0],[1,0]],SPX=8,SPY=27,SOL=[1,2,4,7];
const TIER=[{n:'Bronze',cx:18,cy:14,st:[20,10],tr:4,gs:0},{n:'Silver',cx:30,cy:4,st:[40,20],tr:6,gs:1},{n:'Gold',cx:4,cy:4,st:[80,40],tr:8,gs:2}];
