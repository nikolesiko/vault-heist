// Headless bug check + bot playthroughs. Run with: node tests/check.js
const fs = require('fs'), path = require('path');
const src = ['config', 'render', 'world', 'game'].map(f => fs.readFileSync(path.join(__dirname, '../js', f + '.js'), 'utf8')).join('\n');
const proxy = () => new Proxy(function () {}, { get: (t, k) => k === Symbol.toPrimitive ? () => 0 : proxy(), apply: () => proxy(), set: () => true });
const el = () => ({ style: {}, textContent: '', width: 0, height: 0, getContext: () => proxy(), onclick: null });
const els = {};
const doc = { getElementById: id => els[id] || (els[id] = el()), createElement: () => el(), querySelectorAll: () => [] };
const body = src + `
const R = { fails: [], notes: [] };
const fail = m => R.fails.length < 25 && R.fails.push(m);
const log = []; const _say = say; say = (m, s) => { log.push(m); _say(m, s); };
const key = (x, y) => x + ',' + y;
function path(a, b) {
  const q = [a], prev = { [key(...a)]: null };
  while (q.length) { const [x, y] = q.shift();
    if (x === b[0] && y === b[1]) { const p = []; let c = key(x, y); while (c) { p.unshift(c.split(',').map(Number)); c = prev[c]; } return p; }
    for (const [dx, dy] of DV) { const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (!(k in prev) && !solid(nx, ny)) { prev[k] = key(x, y); q.push([nx, ny]); } } }
  return null; }
const WORLDS = 150;
let tot = { traps: 0, decoys: 0, geese: 0, water: 0, trees: 0, walk: 0 };
for (let n = 0; n < WORLDS; n++) {
  gen();
  if (solid(SPX, SPY)) fail('world ' + n + ': spawn is solid');
  if (!DV.some(([dx, dy]) => !solid(npc.x + dx, npc.y + dy))) fail('world ' + n + ': NPC boxed in');
  if (t[npc.y][npc.x] === 3) fail('world ' + n + ': NPC stands on the path');
  const seen = new Set();
  vaults.forEach(v => { if (solid(v.x, v.y)) fail('world ' + n + ': vault inside a wall'); if (!path([SPX, SPY], [v.x, v.y])) fail('world ' + n + ': ' + v.name + ' vault unreachable from spawn'); });
  traps.forEach(r => { const k = key(r.x, r.y); if (seen.has(k)) fail('world ' + n + ': two traps share a tile'); seen.add(k); if (t[r.y][r.x] !== 5) fail('world ' + n + ': trap not on floor'); if (vaults.some(v => v.x === r.x && v.y === r.y)) fail('world ' + n + ': trap on vault'); });
  geese.forEach(o => { if (solid(o.x, o.y)) fail('world ' + n + ': goose inside solid tile'); });
  TIER.forEach((T, i) => { const c = traps.filter(r => r.x >= T.cx && r.x <= T.cx + 10 && r.y >= T.cy && r.y <= T.cy + 8); if (c.length < T.tr) fail('world ' + n + ': ' + T.n + ' has only ' + c.length + '/' + T.tr + ' traps'); if (!c.some(r => r.t === 'decoy')) fail('world ' + n + ': ' + T.n + ' has no decoy'); });
  tot.traps += traps.length; tot.decoys += traps.filter(r => r.t === 'decoy').length; tot.geese += geese.length;
  for (const row of t) for (const v of row) { if (v === 2) tot.water++; if (v === 1) tot.trees++; if (!SOL.includes(v)) tot.walk++; }
}
R.notes.push('Layout checks over ' + WORLDS + ' worlds done.');
// Bot playthroughs: walk spawn -> Bronze -> Silver -> Gold without scanning
const runs = []; let drawn = 0, crashes = 0, stuck = 0;
for (let n = 0; n < 60; n++) {
  gen(); coins = 20; clock = 0; log.length = 0; keys = {}; hideDlg();
  const res = { times: [], coins: [], honks: 0, rakes: 0, honey: 0, mirrors: 0, done: 0 };
  let T = 0, tgt = 0, wp = null, lastPos = [P.x, P.y], stillT = 0, startT = 0;
  try {
    for (let f = 0; f < 60 * 400 && tgt < 3; f++) {
      const dt = 1 / 60; T += dt;
      const v = vaults[tgt];
      if (!wp || !wp.length || f % 20 === 0) { wp = path([Math.floor(P.x), Math.floor(P.y)], [v.x, v.y]); if (wp && wp.length > 1) wp.shift(); }
      if (!wp) { fail('run ' + n + ': no path to vault ' + tgt); break; }
      let [wx, wy] = wp[0];
      if (Math.hypot(wx + .5 - P.x, wy + .5 - P.y) < .2 && wp.length > 1) wp.shift();
      [wx, wy] = wp[0];
      keys = { ArrowLeft: wx + .5 < P.x - .12, ArrowRight: wx + .5 > P.x + .12, ArrowUp: wy + .5 < P.y - .12, ArrowDown: wy + .5 > P.y + .12 };
      update(dt);
      if (!(P.x > 0 && P.y > 0 && isFinite(P.x + P.y))) { fail('run ' + n + ': bad position'); break; }
      if (coins < 0 || !isFinite(coins)) { fail('run ' + n + ': bad coins ' + coins); break; }
      if (f % 45 === 0) { draw(); drawn++; }
      if (Math.hypot(P.x - lastPos[0], P.y - lastPos[1]) < .02) stillT += dt; else { stillT = 0; lastPos = [P.x, P.y]; }
      if (stillT > 4 && P.stun <= 0) { stuck++; fail('run ' + n + ': bot stuck at ' + P.x.toFixed(1) + ',' + P.y.toFixed(1)); break; }
      if (v.done) { res.times.push(+(T - startT).toFixed(1)); res.coins.push(coins); startT = T; tgt++; wp = null; }
    }
  } catch (e) { crashes++; fail('run ' + n + ': exception ' + e.message); }
  res.honks = log.filter(m => m.startsWith('HONK')).length; res.rakes = log.filter(m => m.startsWith('Rake')).length;
  res.honey = log.filter(m => m.startsWith('Honeypot')).length; res.mirrors = log.filter(m => m.startsWith('That vault')).length;
  res.done = tgt; res.final = coins; runs.push(res);
}
const avg = a => a.length ? +(a.reduce((s, x) => s + x, 0) / a.length).toFixed(1) : 0;
const full = runs.filter(r => r.done === 3);
const out = {
  failures: R.fails, crashes, stuck, framesDrawn: drawn,
  avgPerWorld: Object.fromEntries(Object.entries(tot).map(([k, v]) => [k, Math.round(v / WORLDS)])),
  botRuns: runs.length, botCleared: full.length,
  avgSecondsPerVault: [0, 1, 2].map(i => avg(full.map(r => r.times[i]))),
  avgFinalCoins: avg(full.map(r => r.final)),
  avgHonks: avg(runs.map(r => r.honks)), avgRakes: avg(runs.map(r => r.rakes)), avgHoney: avg(runs.map(r => r.honey)), avgMirrors: avg(runs.map(r => r.mirrors)),
};
console.log(JSON.stringify(out, null, 1));
process.exitCode = R.fails.length || crashes ? 1 : 0;
`;
new Function('document', 'window', body)(doc, {});
