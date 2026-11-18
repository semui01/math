// THE NORTH STAR — 74 s explainer. Landscape-first layout (1920x1080).
const T = { s1: 0, s2: LB(3), s3: LB(7), s4: LB(11), s4b: LB(13), s5: LB(17), s6: LB(21), out: LB(24), end: DUR - 2.4 };
const GOLD = '#e8b65a', GOLD2 = '#ffd98a', PBLUE = '#8fc8ff';

// ---------------------------------------------------------------- precomputed assets
let STARS = [], STARS3 = [], NEB, GLOW = {}, PLATE_STARS = [], PL_POINTS = [];
function glowSprite(col) {
  const c = mkCanvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, col.replace('A', '1')); gr.addColorStop(.18, col.replace('A', '.55')); gr.addColorStop(.5, col.replace('A', '.12')); gr.addColorStop(1, col.replace('A', '0'));
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return c;
}
function initFilm() {
  const r = rng(11);
  const cols = ['#ffffff', '#dfe9ff', '#bcd4ff', '#fff1d6', '#ffd9a8'];
  for (let i = 0; i < 1500; i++) STARS.push({ x: r(), y: r(), m: Math.pow(r(), 4), c: cols[Math.floor(r() * cols.length)], ph: r() * 6.28 });
  const r3 = rng(23);
  for (let i = 0; i < 1100; i++) STARS3.push({ x: (r3() - .5) * 2.4, y: (r3() - .5) * 1.5, z: r3(), c: cols[Math.floor(r3() * 3)] });
  GLOW.w = glowSprite('rgba(255,255,255,A)'); GLOW.b = glowSprite('rgba(140,190,255,A)'); GLOW.g = glowSprite('rgba(255,200,110,A)'); GLOW.c = glowSprite('rgba(95,212,255,A)');
  // nebula / milky-way band
  NEB = mkCanvas(1200, 700); { const g = NEB.getContext('2d'), rn = rng(5);
    for (let i = 0; i < 260; i++) { const u = rn(), x = u * 1200, y = 350 + (u - .5) * -380 + (rn() - .5) * 230, rad = 40 + rn() * 140;
      const hue = rn() < .6 ? '70,110,190' : rn() < .5 ? '120,80,170' : '200,150,120';
      const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, `rgba(${hue},${.05 + rn() * .06})`); gr.addColorStop(1, `rgba(${hue},0)`); g.fillStyle = gr; g.fillRect(0, 0, 1200, 700); }
    for (let i = 0; i < 2500; i++) { const u = rn(), x = u * 1200, y = 350 + (u - .5) * -380 + (rn() - .5) * 160 * (rn() + .3); g.fillStyle = `rgba(230,236,255,${rn() * .5})`; g.fillRect(x, y, 1.2, 1.2); }
    g.globalCompositeOperation = 'destination-in'; const m = g.createRadialGradient(600, 350, 120, 600, 350, 600); m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = m; g.fillRect(0, 0, 1200, 700);
  }
  const rp = rng(31);
  for (let i = 0; i < 520; i++) { const a = rp() * TAU, d = Math.pow(rp(), .7); PLATE_STARS.push({ x: .5 + Math.cos(a) * d * .42 + (rp() - .5) * .25, y: .48 + Math.sin(a) * d * .3 + (rp() - .5) * .2, s: .6 + Math.pow(rp(), 3) * 4, v: rp() < .06, ph: rp() * 6.28, per: .6 + rp() * 1.2 }); }
  for (let i = 0; i < 26; i++) { const lp = .1 + rp() * 1.8; PL_POINTS.push({ x: lp, y: .25 + lp * .42 + (rp() - .5) * .12 }); }
}

// ---------------------------------------------------------------- shared drawing
function sky(top = '#01030a', bot = '#060e1e') { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function glow(x, y, r, spr = GLOW.w, a = 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(spr, x - r, y - r, r * 2, r * 2); ctx.restore(); }
function starfield(ox, oy, a, t, sc = 1, dens = 1) {
  ctx.save(); const SW = W * 1.3, SHh = H * 1.3;
  for (let i = 0; i < STARS.length * dens; i++) { const s = STARS[i];
    let x = ((s.x * SW + ox) % SW + SW) % SW - W * .15, y = ((s.y * SHh + oy) % SHh + SHh) % SHh - H * .15;
    x = W / 2 + (x - W / 2) * sc; y = H / 2 + (y - H / 2) * sc; if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
    const tw = .75 + .25 * Math.sin(t * 2.2 + s.ph), sz = (.7 + s.m * 2.6) * Math.sqrt(sc);
    ctx.globalAlpha = a * (.35 + .65 * s.m + .2) * tw; ctx.fillStyle = s.c; ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
    if (s.m > .45) glow(x, y, 10 + s.m * 16, GLOW.w, a * s.m * .7 * tw);
  }
  ctx.restore();
}
function nebula(ox, oy, a, sc = 1.7) { ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'lighter'; ctx.drawImage(NEB, ox, oy, 1200 * sc, 700 * sc); ctx.restore(); }
function bigStar(x, y, r, t, a = 1, col = GLOW.w, spikes = true) {
  if (a <= 0) return;
  glow(x, y, r * 6, GLOW.b, a * .35); glow(x, y, r * 2.6, col, a);
  if (spikes) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a * .7; ctx.translate(x, y); ctx.rotate(.12);
    for (let k = 0; k < 4; k++) { ctx.rotate(Math.PI / 2); const L = r * (7 + 1.2 * Math.sin(t * 1.7 + k));
      const g = ctx.createLinearGradient(0, 0, L, 0); g.addColorStop(0, 'rgba(230,240,255,.9)'); g.addColorStop(1, 'rgba(160,200,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -r * .12); ctx.lineTo(L, 0); ctx.lineTo(0, r * .12); ctx.fill(); }
    ctx.restore(); }
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * .35, 0, TAU); ctx.fill(); ctx.restore();
}
function label(s, x, y, size, col, a, align = 'left', ls = 3, w = 700, fam = F.m) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = 'rgba(0,0,0,.8)'; ctx.shadowBlur = 10; txt(s, x, y, font(w, size, fam), col, align, ls); ctx.restore(); }
function dashLine(x1, y1, x2, y2, col, a, w = 2, dash = [8, 8], prog = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, prog), lerp(y1, y2, prog)); ctx.stroke(); ctx.restore(); }
const fmt = n => Math.round(n).toLocaleString('en-US');

// Voyager 1, procedural. Faces left (dish toward Earth).
function voyager(x, y, s, rot, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineCap = 'round';
  // magnetometer boom (long, thin)
  ctx.strokeStyle = 'rgba(200,210,225,.55)'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(40, 30); ctx.lineTo(-180, 300); ctx.stroke();
  // RTG boom
  ctx.strokeStyle = '#8c8f96'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(50, 30); ctx.lineTo(205, 120); ctx.stroke();
  for (let k = 0; k < 3; k++) { const px = 140 + k * 26, py = 82 + k * 15; ctx.save(); ctx.translate(px, py); ctx.rotate(.52);
    const g = ctx.createLinearGradient(0, -10, 0, 10); g.addColorStop(0, '#d9d9db'); g.addColorStop(1, '#4b4d53'); ctx.fillStyle = g; rrect(-11, -10, 22, 20, 3); ctx.fill();
    ctx.strokeStyle = 'rgba(30,30,35,.6)'; ctx.lineWidth = 1; for (let f = -8; f <= 8; f += 4) { ctx.beginPath(); ctx.moveTo(-11, f); ctx.lineTo(11, f); ctx.stroke(); } ctx.restore(); }
  // science boom + scan platform
  ctx.strokeStyle = '#9a9ca3'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(50, -20); ctx.lineTo(190, -105); ctx.stroke();
  ctx.fillStyle = '#6d7078'; rrect(178, -128, 40, 30, 4); ctx.fill(); ctx.fillStyle = '#2a2c31'; ctx.beginPath(); ctx.arc(225, -112, 9, 0, TAU); ctx.fill();
  ctx.fillStyle = '#c9cbd0'; rrect(212, -100, 26, 12, 3); ctx.fill();
  // bus (gold foil decagon)
  const bg = ctx.createLinearGradient(10, -40, 90, 50); bg.addColorStop(0, '#fff0b8'); bg.addColorStop(.35, GOLD); bg.addColorStop(.7, '#9a6a22'); bg.addColorStop(1, '#5a3a10');
  ctx.fillStyle = bg; ctx.beginPath(); for (let k = 0; k < 10; k++) { const an = k / 10 * TAU; ctx.lineTo(55 + Math.cos(an) * 42, 5 + Math.sin(an) * 42); } ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,240,190,.35)'; ctx.lineWidth = 1; for (let k = 0; k < 9; k++) { ctx.beginPath(); ctx.moveTo(22 + k * 7, -30 + (k % 3) * 6); ctx.lineTo(28 + k * 7, 38 - (k % 2) * 8); ctx.stroke(); }
  // high-gain dish (seen at an angle)
  const dg = ctx.createLinearGradient(-30, -110, 20, 110); dg.addColorStop(0, '#ffffff'); dg.addColorStop(.5, '#cfd5de'); dg.addColorStop(1, '#5f6670');
  ctx.fillStyle = dg; ctx.beginPath(); ctx.ellipse(0, 0, 34, 118, 0, 0, TAU); ctx.fill();
  const ig = ctx.createRadialGradient(-6, -10, 4, 0, 0, 110); ig.addColorStop(0, '#f4f6fa'); ig.addColorStop(1, '#8a919c');
  ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(-4, 0, 26, 108, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 34, 118, 0, -1.9, -0.6); ctx.stroke();
  // feed struts + subreflector
  ctx.strokeStyle = '#b6bcc6'; ctx.lineWidth = 2; for (const yy of [-80, 0, 80]) { ctx.beginPath(); ctx.moveTo(-18, yy); ctx.lineTo(-62, 0); ctx.stroke(); }
  ctx.fillStyle = '#e9edf3'; ctx.beginPath(); ctx.ellipse(-64, 0, 6, 16, 0, 0, TAU); ctx.fill();
  ctx.restore();
}

// ================================================================ SHOT 1 · THE HOOK
function scene1(t) {
  sky('#010208', '#040a16');
  const pan = E.io(P(t, wt(2, 'look') - .1, T.s2 + .25)), py = pan * H * .8;
  nebula(-300 - t * 7, -120 + py * .3, .75);
  starfield(-t * 9, py * .35, 1, t);
  // pale blue dot with a faint scattered-sunlight band
  const ex = O(360, 200), ey = O(790, 1250) + py;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(ex, ey); ctx.rotate(-.35);
  const bnd = ctx.createLinearGradient(0, -60, 0, 60); bnd.addColorStop(0, 'rgba(180,140,110,0)'); bnd.addColorStop(.5, 'rgba(190,150,120,.10)'); bnd.addColorStop(1, 'rgba(180,140,110,0)');
  ctx.fillStyle = bnd; ctx.fillRect(-1400, -60, 2800, 120); ctx.restore();
  glow(ex, ey, 26, GLOW.b, .9); ctx.fillStyle = '#cfe6ff'; ctx.beginPath(); ctx.arc(ex, ey, 2.6, 0, TAU); ctx.fill();
  reticle(ex, ey, 22, t, 'EARTH', 'PALE BLUE DOT', vis(t, wt(1, 'travel'), T.s2 + 1, .5), PBLUE);
  // Voyager drifts and slowly dollies in
  const vx = O(1130 + t * 7, 430 + t * 3), vy = O(430, 680) + Math.sin(t * .6) * 8 + py, vs = O(1.05 + t * .018, .82 + t * .012);
  glow(vx + 40, vy, 260, GLOW.g, .08);
  voyager(vx, vy, vs, -.08 + Math.sin(t * .35) * .03, 1);
  reticle(vx + 30 * vs, vy, 150 * vs, t, 'VOYAGER 1', O('LAUNCHED 1977 · STILL TALKING', 'LAUNCHED 1977'), vis(t, 1.0, T.s2 + 1, .6), GOLD2);
  // one light-day measuring line
  const la = vis(t, wt(1, 'one') - .1, T.s2 + 1, .5), lp = E.o3(P(t, wt(1, 'one') - .1, wt(1, 'one') + .9));
  dashLine(ex + 20, ey - 10, vx - 80 * vs, vy + 30, 'rgba(155,231,255,.8)', la, 2, [6, 10], lp);
  if (la > 0) { const mx = lerp(ex, vx - 80 * vs, .5), my = lerp(ey - 10, vy + 30, .5); ctx.save(); ctx.translate(mx, my); ctx.rotate(Math.atan2(vy + 40 - ey, vx - 80 * vs - ex));
    label('1 LIGHT-DAY', 0, -16, 22, C.cyan2, la * P(t, wt(1, 'one') + .5, wt(1, 'one') + .9), 'center', 6, 800);
    label('49 YEARS OF TRAVEL', 0, 26, 15, 'rgba(230,242,255,.8)', la * P(t, wt(1, 'one') + .7, wt(1, 'one') + 1.1), 'center', 4, 500); ctx.restore(); }
  // the North Star rises into view
  const px = W / 2, pyS = lerp(-H * .35, H * O(.30, .28), pan);
  bigStar(px, pyS, 16 + pan * 6, t, P(t, wt(2, 'look'), wt(2, 'north')) * 1);
  const ta = vis(t, wt(2, 'north') + .1, T.s2 + .3, .5, .3);
  label('HOW FAR AWAY IS', W / 2, O(610, 900), 22, C.cyan2, ta, 'center', 12, 600);
  label('THE NORTH STAR?', W / 2, O(690, 975), O(76, 64), '#fff', ta, 'center', O(10, 6), 850, F.d);
}

// ================================================================ SHOT 2 · ONE LIGHT-DAY
const SX = O(240, 250), SY = O(520, 1330), KAU = O(108, 80), VA = O(-.10, -Math.PI / 2 + .3);
const pAU = au => KAU * Math.sqrt(au);
const angAU = au => VA + .55 * Math.exp(-au / 5.5);
const ptAU = au => [SX + Math.cos(angAU(au)) * pAU(au), SY + Math.sin(angAU(au)) * pAU(au)];
function yearToAU(y) { if (y < 1977.7) return 1; if (y < 1979.2) return lerp(1, 5.2, (y - 1977.7) / 1.5); if (y < 1980.9) return lerp(5.2, 9.5, (y - 1979.2) / 1.7); return 9.5 + (y - 1980.9) * 3.55; }
const PLANETS = [['EARTH', 1, PBLUE, 4], ['JUPITER', 5.2, '#e0b98a', 9], ['SATURN', 9.54, '#e8d39a', 8], ['URANUS', 19.2, '#9fe3e8', 6], ['NEPTUNE', 30.1, '#6f8fff', 6]];
function scene2(t) {
  sky('#02050c', '#050d1c');
  starfield(-t * 3 + 400, 120, .55, t, 1, .7);
  const yA = LS(3) + .2, yB = wt(4, 'away'), yp = E.io2(P(t, yA, yB)), year = lerp(1977.6, 2026.9, yp), vau = yearToAU(year);
  const z = lerp(5.2, 1, E.io(P(t, T.s2, yB + .2)));
  ctx.save(); ctx.translate(SX, SY); ctx.scale(z, z); ctx.translate(-SX, -SY);
  const lw = 1 / z;
  // sun
  glow(SX, SY, 120 / Math.sqrt(z), GLOW.g, .9); glow(SX, SY, 40 / Math.sqrt(z), GLOW.w, 1);
  // orbits + planets (planets sit on the flyby path for Jupiter & Saturn)
  for (const [nm, au, col, r] of PLANETS) {
    ctx.strokeStyle = 'rgba(140,190,255,.22)'; ctx.lineWidth = 1.5 * lw; ctx.beginPath(); ctx.arc(SX, SY, pAU(au), 0, TAU); ctx.stroke();
    const an = nm === 'EARTH' ? angAU(1) : nm === 'JUPITER' ? angAU(5.2) : nm === 'SATURN' ? angAU(9.54) : nm === 'URANUS' ? O(2.2, -2.9) : O(-2.5, .4);
    const x = SX + Math.cos(an) * pAU(au), y = SY + Math.sin(an) * pAU(au);
    glow(x, y, r * 3 * lw * Math.sqrt(z), GLOW.w, .25); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r * lw * Math.sqrt(z) * .8, 0, TAU); ctx.fill();
    const la = clamp(1 - Math.abs(Math.log(z * pAU(au) / 260)) * .9) * vis(t, T.s2 + .2, yB + 1.2, .5, .8);
    if (la > 0.02) { ctx.save(); ctx.translate(x, y); ctx.scale(lw, lw); label(nm, 0, -18, 14, 'rgba(220,235,255,.85)', la, 'center', 4, 600); ctx.restore(); }
  }
  // trajectory
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3 * lw; ctx.shadowColor = GOLD; ctx.shadowBlur = 12;
  ctx.beginPath(); for (let yy = 1977.6; yy <= year; yy += .05) { const [x, y] = ptAU(yearToAU(yy)); yy === 1977.6 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0;
  ctx.restore();
  const tr = (x, y) => [SX + (x - SX) * z, SY + (y - SY) * z];
  const [vx, vy] = tr(...ptAU(vau)), [ex, ey] = tr(...ptAU(1));
  glow(vx, vy, 30, GLOW.g, .9); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(vx, vy, 4, 0, TAU); ctx.fill();
  reticle(vx, vy, 26, t, 'VOYAGER 1', String(Math.floor(year)), vis(t, T.s2 + .3, T.s3 + 1, .4), GOLD2);
  // HUD: year + distance
  const ha = vis(t, LS(3), T.s3 + 1, .5);
  const HX = O(1390, 60), HY = O(120, 330), HY2 = O(400, 560);
  hudPanel(HX, HY, 440, 190, 'MISSION CLOCK', ha);
  if (ha > 0) { ctx.save(); ctx.globalAlpha = ha;
    txt('YEAR', HX + 30, HY + 70, font(500, 15, F.m), 'rgba(220,240,255,.6)', 'left', 4); txt(String(Math.floor(year)), HX + 30, HY + 116, font(800, 44), '#fff', 'left', 2);
    txt('DISTANCE', HX + 190, HY + 70, font(500, 15, F.m), 'rgba(220,240,255,.6)', 'left', 4); txt((vau * .1496).toFixed(1), HX + 190, HY + 116, font(800, 44), GOLD2, 'left', 1);
    txt('BILLION KM', HX + 190, HY + 148, font(600, 14, F.m), 'rgba(255,217,138,.8)', 'left', 4); ctx.restore(); }
  label('DISTANCES ON A SQUARE-ROOT SCALE', O(1830, 60), O(340, 790), 13, 'rgba(200,225,255,.45)', ha, O('right', 'left'), 3, 500);
  // dimension arrow under the path: 1 light-day
  const da = vis(t, wt(4, '25') - .2, T.s3 + 1, .5), dp = E.o3(P(t, wt(4, '25') - .2, wt(4, '25') + .6));
  if (da > 0) { ctx.save(); ctx.globalAlpha = da; ctx.strokeStyle = C.cyan2; ctx.fillStyle = C.cyan2; ctx.lineWidth = 2;
    if (!V) { const ay = 760, x2 = lerp(SX, vx, dp); arrow(SX, ay, x2, ay, 12); ctx.restore();
    label('25.9 BILLION KM  =  1 LIGHT-DAY', (SX + vx) / 2, ay + 44, 22, C.cyan2, da * P(t, wt(4, '25') + .3, wt(4, '25') + .7), 'center', 5, 800); }
    else { const ax = 960, y2 = lerp(SY, vy, dp); arrow(ax, SY, ax, y2, 12); ctx.restore();
      ctx.save(); ctx.translate(ax - 22, (SY + vy) / 2); ctx.rotate(-Math.PI / 2); label('25.9 BILLION KM  =  1 LIGHT-DAY', 0, 0, 22, C.cyan2, da * P(t, wt(4, '25') + .3, wt(4, '25') + .7), 'center', 5, 800); ctx.restore(); } }
  // radio pulse out (cyan) and back (amber), with a signal clock
  const o0 = wt(5, 'radio') - .1, o1 = wt(5, 'reach') + .1, r0 = LS(6) - .05, r1 = Math.min(wt(6, 'back') + .45, T.s3 - .1);
  const D = Math.hypot(vx - ex, vy - ey), ang = Math.atan2(vy - ey, vx - ex);
  function pulse(p, fromX, fromY, a0, col) { if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = col;
    for (let k = 0; k < 4; k++) { const rr = D * p - k * 18; if (rr < 4) continue; ctx.globalAlpha = (1 - k * .25) * .9; ctx.lineWidth = 4 - k * .7; ctx.beginPath(); ctx.arc(fromX, fromY, rr, a0 - .14, a0 + .14); ctx.stroke(); }
    ctx.restore(); }
  pulse(P(t, o0, o1), ex, ey, ang, C.cyan); pulse(P(t, r0, r1), vx, vy, ang + Math.PI, C.amber);
  for (const [tp, x, y, col] of [[o1, vx, vy, C.cyan], [r1, ex, ey, C.amber]]) { const q = P(t, tp, tp + .7); if (q > 0 && q < 1) { ctx.save(); ctx.globalAlpha = 1 - q; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 10 + q * 70, 0, TAU); ctx.stroke(); ctx.restore(); } }
  label('SIGNAL RECEIVED', vx, vy + O(70, -60), 16, C.cyan, vis(t, o1, r0 + .4, .1, .3), 'center', 4, 800);
  label('REPLY RECEIVED', ex + 10, ey + 64, 16, C.amber, vis(t, r1, T.s3 + 1, .1, .3), 'left', 4, 800);
  const ca = vis(t, o0 - .3, T.s3 + 1, .4), hrs = 24 * P(t, o0, o1) + 24 * P(t, r0, r1);
  hudPanel(HX, HY2, 440, 170, 'RADIO LIGHT-TIME', ca, t > r0 ? C.amber : C.cyan);
  if (ca > 0) { ctx.save(); ctx.globalAlpha = ca; const hh = Math.floor(hrs), mm = Math.floor((hrs - hh) * 60);
    txt(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, HX + 30, HY2 + 100, font(800, 60, F.m), t > r0 ? C.amber : C.cyan2, 'left', 2);
    txt('HOURS', HX + 260, HY2 + 96, font(600, 16, F.m), 'rgba(220,240,255,.6)', 'left', 4);
    txt(t > r0 + .2 ? 'ROUND TRIP · 48 H' : 'ONE WAY · 24 H', HX + 30, HY2 + 140, font(600, 15, F.m), 'rgba(220,240,255,.75)', 'left', 4); ctx.restore(); }
}

// ================================================================ SHOT 3 · THE POLARIS JUMP
const DC = [O(760, 660), O(470, 620)];
const DIPPER = [['POLARIS', -390, -210, 1.0], ['', -275, -150, .45], ['', -170, -70, .5], ['', -55, 10, .5], ['KOCHAB', 120, -40, .85], ['PHERKAD', 175, 95, .65], ['', 10, 125, .4]];
const DLINES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]];
function dipper(t, cx, cy, sc, a, lineP = 1, showPolaris = true) {
  const pts = DIPPER.map(([, x, y]) => [cx + x * sc, cy + y * sc]);
  if (a <= 0) return pts;
  ctx.save(); ctx.globalAlpha = a * .55; ctx.strokeStyle = C.cyan2; ctx.lineWidth = 1.6;
  DLINES.forEach(([i, j], k) => { const q = clamp(lineP * DLINES.length - k); if (q <= 0) return; const [x1, y1] = pts[i], [x2, y2] = pts[j]; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(lerp(x1, x2, q), lerp(y1, y2, q)); ctx.stroke(); });
  ctx.restore();
  DIPPER.forEach(([, , , m], i) => { const [x, y] = pts[i]; if (i === 0) { if (showPolaris) bigStar(x, y, 13 * Math.sqrt(sc), t, a); } else { glow(x, y, 14 + m * 22, GLOW.w, a * m); ctx.fillStyle = '#fff'; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, 2 + m * 2, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; } });
  return pts;
}
function travel(t) { return 9 * E.io(P(t, T.s3 - .1, wt(7, '447') - .2)); }
function scene3(t) {
  sky('#010309', '#040916');
  const hp = P(t, T.s3 - .1, wt(7, '447') - .2), speed = 4 * hp * (1 - hp); // 0..1
  // hyperspace star streaks
  const tr = travel(t), tr0 = travel(t - .06), f = W * .32;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let si = 0; si < 700; si++) { const s = STARS3[si]; const z = ((s.z - tr * .35) % 1 + 1) % 1 + .02, z0 = Math.min(1.1, z + (tr - tr0) * .35);
    const x = W / 2 + s.x / z * f * .5, y = H / 2 + s.y / z * f * .5, x0 = W / 2 + s.x / z0 * f * .5, y0 = H / 2 + s.y / z0 * f * .5;
    if (x < -50 || x > W + 50 || y < -50 || y > H + 50) continue;
    const b = clamp(1.4 - z) * (.5 + .5 * clamp(speed * 2 + .2)) * (1 - E.o3(P(t, wt(7, '447') - .6, wt(7, '447') + .3)));
    ctx.strokeStyle = s.c; ctx.globalAlpha = b * .6; ctx.lineWidth = clamp(1.5 / z, .8, 3.2); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y + .01); ctx.stroke(); }
  ctx.restore();
  // arrival: Little Dipper settles in
  const arr = E.o3(P(t, wt(7, '447') - .9, wt(7, '447') + .4));
  nebula(-500 + t * 3, -200, .6 * arr);
  starfield(t * 4, 0, arr * .9, t, 1, .8);
  const sc = (lerp(2.4, 1, arr) + (t - T.s3) * .008) * O(1, .95);
  const pts = dipper(t, DC[0], DC[1], sc, arr, P(t, wt(7, '447'), wt(7, '447') + 1.4));
  const [px, py] = pts[0];
  reticle(px, py, 40, t, 'POLARIS', 'α URSAE MINORIS', vis(t, wt(7, '447') + .3, T.s4 + 1, .5), C.cyan2);
  label('LITTLE DIPPER', pts[5][0] + 40, pts[5][1] + 50, 15, 'rgba(200,230,255,.6)', vis(t, wt(7, '447') + 1, LS(9), .5), 'left', 5, 500);
  // stat block
  const sa = vis(t, wt(7, '447') - .1, LS(9) + .2, .3, .4), x0 = O(1220, 130), Y0 = O(0, 620);
  if (sa > 0) {
    const n = 447 * E.o3(P(t, wt(7, '447') - .1, wt(7, '447') + .9));
    label(fmt(n), x0, Y0 + 410, 150, '#fff', sa, 'left', 2, 850, F.d);
    label('LIGHT-YEARS', x0 + 8, Y0 + 456, 24, C.cyan2, sa, 'left', 10, 700);
    const sb = sa * P(t, wt(8, 'eight') - .1, wt(8, 'eight') + .3);
    ctx.save(); ctx.globalAlpha = sb; ctx.fillStyle = 'rgba(155,231,255,.5)'; ctx.fillRect(x0 + 8, Y0 + 492, 520 * E.o3(P(t, wt(8, 'eight') - .1, wt(8, 'eight') + .5)), 2); ctx.restore();
    const my = 8e6 * E.o3(P(t, wt(8, 'eight') - .1, wt(8, 'eight') + 1.0));
    label(fmt(my), x0, Y0 + 574, 64, GOLD2, sb, 'left', 1, 850, F.d);
    label('YEARS BY VOYAGER', x0 + 6, Y0 + 610, 20, 'rgba(255,217,138,.9)', sb, 'left', 8, 700);
    label('VOYAGER SO FAR: 0.0006% OF THE WAY', x0 + 6, Y0 + 650, 14, 'rgba(220,240,255,.6)', sb * P(t, wt(8, 'trip'), wt(8, 'trip') + .4), 'left', 3, 500);
  }
  // the light in your eyes: a photon leaves Polaris in 1579
  const p0 = LS(9) - .1, p1 = T.s4 - .3, pp = E.io2(P(t, p0, p1)), la = vis(t, p0, T.s4 + .6, .3, .5);
  if (la > 0) {
    const tx = O(1500, 900), ty = O(760, 1380), hx = lerp(px, tx, pp), hy = lerp(py, ty, pp);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = la;
    const g = ctx.createLinearGradient(px, py, hx, hy); g.addColorStop(0, 'rgba(155,231,255,0)'); g.addColorStop(1, 'rgba(200,240,255,.85)');
    ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(hx, hy); ctx.stroke(); ctx.restore();
    glow(hx, hy, 40, GLOW.c, la); glow(hx, hy, 14, GLOW.w, la);
    const yr = Math.floor(lerp(1579, 2026, pp));
    const QX = O(1220, 280), QY = O(330, 940);
    hudPanel(QX, QY, 520, 230, 'STARLIGHT IN TRANSIT', la);
    ctx.save(); ctx.globalAlpha = la;
    txt('LEFT POLARIS', QX + 30, QY + 70, font(500, 15, F.m), 'rgba(220,240,255,.6)', 'left', 4); txt('1579', QX + 30, QY + 126, font(850, 56), C.cyan2, 'left', 2);
    txt('NOW', QX + 300, QY + 70, font(500, 15, F.m), 'rgba(220,240,255,.6)', 'left', 4); txt(String(yr), QX + 300, QY + 126, font(850, 56), '#fff', 'left', 2);
    const bx = QX + 30, bw = 460; ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fillRect(bx, QY + 164, bw, 4); ctx.fillStyle = C.cyan; ctx.fillRect(bx, QY + 164, bw * pp, 4);
    txt(pp > .97 ? 'ARRIVING IN YOUR EYE · TONIGHT' : 'TRAVELLING AT LIGHT SPEED', QX + 30, QY + 202, font(600, 14, F.m), 'rgba(220,240,255,.8)', 'left', 3); ctx.restore();
  }
}

// ================================================================ SHOT 4 · PARALLAX
function thumbScene(t) {
  sky('#030714', '#0d1a33');
  starfield(200, -100, .7, t, 1, .5);
  // distant skyline/hills
  ctx.fillStyle = '#050a14'; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, O(760, 1150) + fbm(x * .004 + 3) * 50); ctx.lineTo(W, H); ctx.fill();
  const tower = [O(1180, 760), O(700, 1090)]; ctx.fillStyle = '#050a14'; ctx.fillRect(tower[0] - 4, tower[1] - 140, 8, 160); glow(tower[0], tower[1] - 146, 18, GLOW.g, .7 + .3 * Math.sin(t * 4));
  // blink: alternate eyes
  const bt = t - (LS(11) + .4), eye = bt < 0 ? -1 : Math.floor(bt / .55) % 2, th = eye < 0 ? 0 : eye ? 1 : -1;
  const sm = bt < 0 ? 0 : (() => { const ph = (bt / .55) % 1; return E.o3(clamp(ph / .12)); })();
  const prev = eye < 0 ? 0 : eye ? -1 : 1, xo = lerp(prev, th, sm) * O(120, 100);
  const rise = E.o3(P(t, T.s4 + .1, T.s4 + 1.1)), cx = W / 2 + xo, top = lerp(H + 50, O(330, 680), rise);
  // thumb
  ctx.save(); const g = ctx.createLinearGradient(cx - 110, 0, cx + 110, 0); g.addColorStop(0, '#1a0f0c'); g.addColorStop(.55, '#3b261e'); g.addColorStop(.85, '#5b3b2c'); g.addColorStop(1, '#2a1914');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx - 105, H + 20); ctx.lineTo(cx - 100, top + 110); ctx.bezierCurveTo(cx - 100, top - 10, cx + 100, top - 10, cx + 100, top + 110); ctx.lineTo(cx + 115, H + 20); ctx.fill();
  ctx.fillStyle = 'rgba(160,120,105,.35)'; ctx.beginPath(); ctx.moveTo(cx - 62, top + 160); ctx.bezierCurveTo(cx - 62, top + 30, cx + 62, top + 30, cx + 62, top + 160); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,200,150,.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx + 100, top + 110); ctx.bezierCurveTo(cx + 100, top + 40, cx + 70, top + 8, cx + 30, top + 2); ctx.stroke();
  ctx.restore();
  // eye indicator
  const ia = vis(t, LS(11) + .3, T.s4b + .5, .3);
  const EYY = O(150, 330);
  if (ia > 0) for (const [k, s, x] of [[-1, 'LEFT EYE', O(750, 380)], [1, 'RIGHT EYE', O(1100, 700)]]) { const on = th === k; ctx.save(); ctx.globalAlpha = ia * (on ? 1 : .3);
    ctx.strokeStyle = on ? C.cyan : '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, EYY, 30, on ? 16 : 3, 0, 0, TAU); ctx.stroke();
    if (on) { ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(x, EYY, 7, 0, TAU); ctx.fill(); }
    txt(s, x, EYY + 50, font(700, 15, F.m), on ? C.cyan : '#fff', 'center', 4); ctx.restore(); }
  reticle(tower[0], tower[1] - 146, 22, t, 'FAR AWAY', 'BARELY MOVES', vis(t, LS(11) + 1.6, T.s4b + .5, .4), C.amber);
  callout(cx - 100, top + 140, O(-170, -150), O(-40, -170), 'NEAR = BIG SHIFT', 'THIS IS PARALLAX', vis(t, wt(12, 'geometry') - .2, T.s4b + .5, .6), C.cyan2, O(undefined, 0));
}
const OS = [O(560, 540), O(690, 830)], OR = 140, PZ = [O(600, 580), O(150, 300)];
function orbitScene(t) {
  sky('#02050d', '#071228');
  starfield(-300, 50, .45, t, 1, .5);
  // background stars far beyond Polaris
  // Earth moves from JAN (left) to JUL (right) via the bottom of its orbit
  const ep = E.io(P(t, wt(13, 'circles') - .2, wt(14, 'six') + .2)), an = Math.PI - ep * Math.PI * -1;
  const eA = Math.PI * (1 - ep) * -1 + Math.PI; // pi -> 0 going through +y (bottom)
  const ex = OS[0] + Math.cos(Math.PI * (1 - ep)) * OR, ey = OS[1] + Math.sin(Math.PI * (1 - ep)) * OR * 1; // sin(pi*(1-ep)) >= 0 -> bottom
  const J = [OS[0] - OR, OS[1]], Ju = [OS[0] + OR, OS[1]];
  const oa = vis(t, T.s4b, T.s5 + 1, .6);
  ctx.save(); ctx.globalAlpha = oa;
  ctx.strokeStyle = 'rgba(140,190,255,.35)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.arc(OS[0], OS[1], OR, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  glow(OS[0], OS[1], 90, GLOW.g, .9); glow(OS[0], OS[1], 30, GLOW.w, 1);
  txt('SUN', OS[0], OS[1] + 46, font(600, 14, F.m), 'rgba(255,220,160,.8)', 'center', 4);
  ctx.restore();
  // sightlines (extended past Polaris toward the background)
  const s1a = vis(t, wt(13, 'circles'), T.s5 + 1, .4), s2a = vis(t, wt(14, 'six') + .1, T.s5 + 1, .4);
  const ext = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  for (const [o, a, col] of [[J, s1a, C.cyan], [Ju, s2a, C.amber]]) { if (a <= 0) continue; const e2 = ext(o, PZ, 1.25);
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(PZ[0], PZ[1]); ctx.stroke();
    ctx.setLineDash([3, 7]); ctx.globalAlpha = a * .6; ctx.beginPath(); ctx.moveTo(PZ[0], PZ[1]); ctx.lineTo(e2[0], e2[1]); ctx.stroke(); ctx.restore(); }
  const tA = vis(t, wt(15, 'thin') - .2, T.s5 + 1, .5);
  if (tA > 0) { ctx.save(); ctx.globalAlpha = tA * .16; ctx.fillStyle = C.cyan2; ctx.beginPath(); ctx.moveTo(J[0], J[1]); ctx.lineTo(PZ[0], PZ[1]); ctx.lineTo(Ju[0], Ju[1]); ctx.fill(); ctx.restore();
    ctx.save(); ctx.globalAlpha = tA; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; const a1 = Math.atan2(J[1] - PZ[1], J[0] - PZ[0]), a2 = Math.atan2(Ju[1] - PZ[1], Ju[0] - PZ[0]); ctx.beginPath(); ctx.arc(PZ[0], PZ[1], 90, a2, a1); ctx.stroke(); ctx.restore();
    callout(PZ[0] - 14, PZ[1] + 90, -110, 40, 'PARALLAX ANGLE', 'REAL VALUE ≈ 0.0073 ARCSEC', tA, '#fff'); }
  // Earth markers
  for (const [p, s, a] of [[J, 'JANUARY', s1a], [Ju, 'JULY', s2a]]) if (a > 0) { ctx.save(); ctx.globalAlpha = a * .8; ctx.strokeStyle = PBLUE; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, TAU); ctx.stroke(); ctx.restore(); label(s, p[0] + (p === J ? -22 : 22), p[1] + 6, 14, PBLUE, a, p === J ? 'right' : 'left', 4, 700); }
  glow(ex, ey, 26, GLOW.b, oa); ctx.save(); ctx.globalAlpha = oa; ctx.fillStyle = PBLUE; ctx.beginPath(); ctx.arc(ex, ey, 7, 0, TAU); ctx.fill(); ctx.restore();
  label('6 MONTHS', OS[0], OS[1] + OR + 40, 16, C.cyan2, vis(t, wt(14, 'six'), T.s5 + 1, .3) , 'center', 5, 800);
  bigStar(PZ[0], PZ[1], 11, t, oa);
  label('POLARIS', PZ[0] - 30, PZ[1] - 24, 16, C.cyan2, oa, 'right', 5, 800);
  label('NOT TO SCALE', O(120, 60), O(560, 700), 13, 'rgba(220,240,255,.45)', oa, 'left', 4, 500);
  // right panel: telescope view, then the coin comparison
  const pa = vis(t, LS(13) + .4, T.s5 + 1, .5), X = O(1060, 60), Y = O(170, 1070), PW = O(740, 960), PH = O(470, 350);
  hudPanel(X, Y, PW, PH, 'TELESCOPE VIEW', pa);
  if (pa > 0) {
    ctx.save(); ctx.globalAlpha = pa; rrect(X + 20, Y + 50, PW - 40, PH - 70, 10); ctx.clip();
    const cA = P(t, wt(15, 'coin') - .3, wt(15, 'coin') + .3), vA = 1 - cA;
    if (vA > 0) { ctx.globalAlpha = pa * vA; const r = rng(77);
      for (let i = 0; i < 70; i++) { const x = X + 30 + r() * (PW - 60), y = Y + 60 + r() * (PH - 90), m = r(); ctx.fillStyle = '#fff'; ctx.globalAlpha = pa * vA * (.3 + m * .7); ctx.fillRect(x, y, 1.5 + m * 2, 1.5 + m * 2); }
      ctx.globalAlpha = pa * vA; const sx = X + PW / 2 + lerp(-110, 110, ep), sy = Y + PH / 2 + 10;
      dashLine(X + PW / 2 - 110, sy + 50, X + PW / 2 + 110, sy + 50, 'rgba(255,255,255,.5)', pa * vA * P(t, wt(14, 'six'), wt(14, 'six') + .5), 1.5, [4, 6]);
      label('JAN', X + PW / 2 - 110, sy + 80, 13, C.cyan, pa * vA, 'center', 4); label('JUL', X + PW / 2 + 110, sy + 80, 13, C.amber, pa * vA * P(t, wt(14, 'six'), wt(14, 'six') + .4), 'center', 4);
      bigStar(sx, sy, 9, t, pa * vA, GLOW.w, false);
      label('NEARBY STAR SHIFTS · BACKGROUND STAYS', X + PW / 2, Y + PH - 34, 14, 'rgba(220,240,255,.75)', pa * vA, 'center', 3, 600); }
    if (cA > 0) { ctx.globalAlpha = pa * cA; const cy = Y + O(250, 190);
      // coin
      const cx = X + 110, cr = 46; const cg = ctx.createRadialGradient(cx - 14, cy - 14, 4, cx, cy, cr); cg.addColorStop(0, '#fff3c4'); cg.addColorStop(.6, GOLD); cg.addColorStop(1, '#7a5418');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(255,240,200,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, cr - 7, 0, TAU); ctx.stroke();
      label('A COIN', cx, cy + 82, 15, GOLD2, pa * cA, 'center', 4, 700);
      // eye
      const ix = X + PW - 90; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ix, cy, 34, 18, 0, 0, TAU); ctx.stroke(); ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(ix, cy, 9, 0, TAU); ctx.fill();
      label('YOU', ix, cy + 82, 15, '#fff', pa * cA, 'center', 4, 700);
      const dp = E.o3(P(t, LS(16) - .2, LS(16) + .8));
      ctx.strokeStyle = C.cyan2; ctx.fillStyle = C.cyan2; ctx.lineWidth = 2; ctx.globalAlpha = pa * cA * clamp(dp * 3); arrow(cx + 60, cy - 90, lerp(cx + 60, ix - 50, dp), cy - 90, 12);
      ctx.globalAlpha = pa * cA * .7; ctx.strokeStyle = 'rgba(255,217,138,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx, cy - cr); ctx.lineTo(ix - 36, cy); ctx.lineTo(cx, cy + cr); ctx.stroke();
      label('700 KM', (cx + ix) / 2, cy - 112, 34, '#fff', pa * cA * P(t, LS(16), LS(16) + .4), 'center', 6, 850, F.d);
      label('SAME TINY ANGLE AS POLARIS SHIFTS', X + PW / 2, Y + PH - 34, 14, 'rgba(220,240,255,.75)', pa * cA * P(t, LS(16) + .4, LS(16) + .8), 'center', 3, 600); }
    ctx.restore();
  }
}

// ================================================================ SHOT 5 · LEAVITT'S LAW
const PZ5 = [O(1440, 540), O(400, 1040)], PER = 1.3; // on-screen beat period (sped up)
function polarisBeat(t) { const ph = ((t - T.s5) / PER) % 1; return Math.pow(.5 + .5 * Math.sin(ph * TAU - 1.2), 1.6); }
function scene5(t) {
  sky('#03060f', '#0a1428');
  starfield(100, 300, .35, t, 1, .4);
  // split divider
  const da = vis(t, LS(18) - .3, T.s6 + 1, .5);
  ctx.save(); ctx.globalAlpha = da * .5; ctx.fillStyle = C.cyan; const dq = E.o3(P(t, LS(18) - .3, LS(18) + .5)); V ? ctx.fillRect(60, 860, 960 * dq, 1.5) : ctx.fillRect(1000, 140, 1.5, 700 * dq); ctx.restore();
  // RIGHT: Polaris beating
  const b = polarisBeat(t), pa = vis(t, T.s5, T.s6 + 1, .5);
  bigStar(PZ5[0], PZ5[1], 14 + b * 10, t, pa * (.65 + .35 * b));
  glow(PZ5[0], PZ5[1], 140 + b * 90, GLOW.b, pa * (.15 + .25 * b));
  label('POLARIS', PZ5[0], PZ5[1] - O(120, 100), 18, C.cyan2, pa, 'center', 6, 800);
  callout(PZ5[0] + O(-30, 30), PZ5[1] + 20, O(-230, 120), O(-150, -220), 'STANDARD CANDLE', 'A STAR WITH A KNOWN WATTAGE', vis(t, wt(17, 'cosmic') - .1, LS(18) + .4, .6), GOLD2);
  // light curve
  const lx = O(1110, 210), ly = O(720, 1380), lw = 660, lh = O(120, 100), la = vis(t, T.s5 + .4, T.s6 + 1, .5);
  if (la > 0) { ctx.save(); ctx.globalAlpha = la;
    ctx.strokeStyle = 'rgba(155,231,255,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + lw, ly); ctx.stroke();
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 3; ctx.shadowColor = C.cyan; ctx.shadowBlur = 10; ctx.beginPath();
    for (let i = 0; i <= 160; i++) { const tt2 = t - 4 + i / 160 * 4; if (tt2 < T.s5) continue; const v = polarisBeat(tt2), x = lx + i / 160 * lw, y = ly - v * lh; ctx.lineTo(x, y); } ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(lx + lw, ly - b * lh, 6, 0, TAU); ctx.fill();
    txt('BRIGHTNESS', lx, ly - lh - 18, font(600, 13, F.m), 'rgba(220,240,255,.6)', 'left', 4);
    const day = (((t - T.s5) / PER) % 1) * 3.97;
    txt('PERIOD  3.97 DAYS', lx + lw, ly - lh - 18, font(800, 18, F.m), C.cyan2, 'right', 3);
    txt('DAY ' + day.toFixed(2), lx + lw, ly + 30, font(600, 14, F.m), 'rgba(220,240,255,.6)', 'right', 3);
    txt('SPED UP ~260,000×', lx, ly + 30, font(500, 12, F.m), 'rgba(220,240,255,.4)', 'left', 3);
    ctx.restore(); }
  // LEFT: archival glass plate
  const X = O(110, 60), Y = O(160, 300), PW = O(800, 960), PH = O(520, 520);
  const sl = E.o3(P(t, LS(18) - .3, LS(18) + .6)), pla = vis(t, LS(18) - .3, T.s6 + 1, .4);
  if (pla > 0) {
    const gp = P(t, wt(19, 'beat') - .2, wt(19, 'beat') + .5); // graph takes over
    ctx.save(); ctx.globalAlpha = pla; ctx.translate(-(1 - sl) * 300, 0);
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30;
    const g = ctx.createLinearGradient(X, Y, X + PW, Y + PH); g.addColorStop(0, '#d8d2bf'); g.addColorStop(1, '#a9a28c'); ctx.fillStyle = g; rrect(X, Y, PW, PH, 6); ctx.fill(); ctx.shadowBlur = 0;
    ctx.save(); rrect(X, Y, PW, PH, 6); ctx.clip();
    const dim = 1 - .78 * gp;
    for (const s of PLATE_STARS) { const x = X + s.x * PW, y = Y + s.y * (PH - 70); let sz = s.s;
      if (s.v && t > wt(19, 'pulsing')) sz *= 1 + .7 * Math.max(0, Math.sin((t - T.s5) / s.per * TAU + s.ph));
      ctx.globalAlpha = pla * dim * .85; ctx.fillStyle = '#1a1712'; ctx.beginPath(); ctx.arc(x, y, sz, 0, TAU); ctx.fill();
      if (s.v) { ctx.strokeStyle = 'rgba(40,40,120,.75)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.stroke(); } }
    ctx.globalAlpha = pla * dim; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.moveTo(X + 60 + k * 130, Y); ctx.lineTo(X + 20 + k * 140, Y + PH); ctx.stroke(); }
    ctx.fillStyle = 'rgba(20,18,14,.85)'; ctx.fillRect(X, Y + PH - 64, PW, 64);
    txt('HARVARD COLLEGE OBSERVATORY · SMALL MAGELLANIC CLOUD', X + 24, Y + PH - 36, font(600, 14, F.m), '#e9e2cc', 'left', 3);
    ctx.globalAlpha = pla * dim * P(t, wt(18, '1912') - .1, wt(18, '1912') + .4);
    txt('H. S. LEAVITT · 1912', X + 24, Y + PH - 14, font(700, 15, F.m), GOLD2, 'left', 4);
    txt('No. 1505', X + 560, Y + 210, 'italic 500 22px "DejaVu Serif",serif', 'rgba(30,30,110,.8)', 'left', 0);
    ctx.restore();
    // period–luminosity graph overlaid on the plate
    if (gp > 0) { ctx.globalAlpha = pla * gp; const gx = X + 90, gy = Y + PH - 100, gw = PW - 150, gh = PH - 160;
      ctx.fillStyle = 'rgba(4,12,24,.82)'; rrect(X, Y, PW, PH, 6); ctx.fill();
      ctx.strokeStyle = 'rgba(220,240,255,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(gx, gy - gh); ctx.lineTo(gx, gy); ctx.lineTo(gx + gw, gy); ctx.stroke();
      txt('PULSE PERIOD →', gx + gw, gy + 34, font(700, 15, F.m), 'rgba(220,240,255,.8)', 'right', 4);
      ctx.save(); ctx.translate(gx - 30, gy); ctx.rotate(-Math.PI / 2); txt('TRUE BRIGHTNESS →', 0, 0, font(700, 15, F.m), 'rgba(220,240,255,.8)', 'left', 4); ctx.restore();
      txt("LEAVITT'S LAW", gx + 10, gy - gh - 20, font(800, 22), '#fff', 'left', 4);
      PL_POINTS.forEach((p, i) => { const q = P(t, wt(19, 'beat') + i * .045, wt(19, 'beat') + i * .045 + .2); if (q <= 0) return; ctx.globalAlpha = pla * gp * q; ctx.fillStyle = C.cyan2; ctx.beginPath(); ctx.arc(gx + p.x / 2 * gw, gy - p.y * gh, 5 * E.oBack(q), 0, TAU); ctx.fill(); });
      const lp2 = E.io(P(t, wt(20, 'tied'), wt(20, 'true')));
      ctx.globalAlpha = pla * gp; ctx.strokeStyle = GOLD2; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx, gy - .25 * gh); ctx.lineTo(gx + lp2 * gw, gy - (.25 + lp2 * 2 * .42) * gh); ctx.stroke();
      const qa = P(t, wt(20, 'true'), wt(20, 'true') + .4);
      if (qa > 0) { const px = gx + .6 / 2 * gw, py = gy - (.25 + .6 * .42) * gh; ctx.globalAlpha = pla * gp * qa;
        dashLine(px, gy, px, py, C.cyan, pla * qa, 1.5, [4, 5]); dashLine(gx, py, px, py, C.cyan, pla * qa, 1.5, [4, 5]);
        ctx.globalAlpha = pla * qa; bigStar(px, py, 7, t, qa * pla, GLOW.w, false);
        txt('POLARIS · 3.97 DAYS', px + 22, py + 36, font(800, 16, F.m), C.cyan2, 'left', 3);
        txt('→ ≈ 1,260 × THE SUN', px + 22, py + 60, font(600, 15, F.m), '#fff', 'left', 3); }
    }
    ctx.restore();
  }
}

// ================================================================ SHOT 6 · INVERSE SQUARE + OUTRO
const SRC = [O(250, 110), O(430, 760)];
function scene6(t) {
  sky('#02050c', '#06101f');
  starfield(-200, 0, .4, t, 1, .45);
  const D = O(420, 290), base = O(52, 42);
  bigStar(SRC[0], SRC[1], 13, t, 1);
  label('POLARIS', SRC[0], SRC[1] - 70, 16, C.cyan2, 1, 'center', 5, 800);
  // planes at d, 2d, 3d drawn in light perspective
  const planes = [1, 2, 3].map(k => ({ k, x: SRC[0] + k * D, s: base * k, t0: T.s6 + .2 + (k - 1) * .55 }));
  const corners = p => { const sk = .35; return [[p.x - p.s * sk, SRC[1] - p.s], [p.x + p.s * sk, SRC[1] - p.s * .8], [p.x + p.s * sk, SRC[1] + p.s * 1.2], [p.x - p.s * sk, SRC[1] + p.s]]; };
  const p3 = planes[2], c3 = corners(p3), ra = P(t, T.s6, T.s6 + .8);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = ra * .12; ctx.fillStyle = C.cyan2;
  ctx.beginPath(); ctx.moveTo(SRC[0], SRC[1]); ctx.lineTo(c3[0][0], c3[0][1]); ctx.lineTo(c3[1][0], c3[1][1]); ctx.lineTo(c3[2][0], c3[2][1]); ctx.lineTo(c3[3][0], c3[3][1]); ctx.closePath(); ctx.fill();
  ctx.globalAlpha = ra * .5; ctx.strokeStyle = C.cyan2; ctx.lineWidth = 1.2; for (const c of c3) { ctx.beginPath(); ctx.moveTo(SRC[0], SRC[1]); ctx.lineTo(c[0], c[1]); ctx.stroke(); }
  // light particles flowing outward
  const r = rng(3); for (let i = 0; i < 160; i++) { const u = r(), v = r(), sp = .35 + r() * .2, q = ((t * sp + r()) % 1);
    const tx = lerp(lerp(c3[0][0], c3[1][0], u), lerp(c3[3][0], c3[2][0], u), v), ty = lerp(lerp(c3[0][1], c3[1][1], u), lerp(c3[3][1], c3[2][1], u), v);
    ctx.globalAlpha = ra * (1 - q) * .8; ctx.fillStyle = '#dff6ff'; ctx.fillRect(lerp(SRC[0], tx, q), lerp(SRC[1], ty, q), 2, 2); }
  ctx.restore();
  for (const p of planes) { const a = E.o3(P(t, p.t0, p.t0 + .5)) * vis(t, T.s6, T.out + .6, .1, .5); if (a <= 0) continue; const c = corners(p);
    ctx.save(); ctx.globalAlpha = a;
    // lit cell (first cell) to show brightness per cell = 1/k^2
    const cell = (i, j) => { const u0 = i / p.k, u1 = (i + 1) / p.k, v0 = j / p.k, v1 = (j + 1) / p.k; const pt = (u, v) => [lerp(lerp(c[0][0], c[1][0], u), lerp(c[3][0], c[2][0], u), v), lerp(lerp(c[0][1], c[1][1], u), lerp(c[3][1], c[2][1], u), v)];
      return [pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)]; };
    for (let i = 0; i < p.k; i++) for (let j = 0; j < p.k; j++) { const q = cell(i, j); ctx.fillStyle = `rgba(155,231,255,${.55 / (p.k * p.k)})`; ctx.beginPath(); q.forEach(([x, y], n) => n ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(155,231,255,.75)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    ctx.restore();
    const by = SRC[1] + p.s * 1.2 + 50;
    label(p.k === 1 ? 'd' : p.k + 'd', p.x, by, 26, '#fff', a, 'center', 2, 800, F.d);
    label(p.k === 1 ? '1×' : `1/${p.k * p.k}`, p.x, by + 36, 20, C.cyan2, a, 'center', 3, 800);
    label(p.k === 1 ? 'BRIGHTNESS' : 'AS BRIGHT', p.x, by + 60, 12, 'rgba(220,240,255,.6)', a, 'center', 3, 500); }
  // true vs apparent
  callout(SRC[0], SRC[1] + O(18, -18), O(40, 40), O(150, -230), 'TRUE BRIGHTNESS', 'FROM LEAVITT’S LAW', vis(t, wt(21, 'truly') - .2, T.out + .5, .5), GOLD2);
  const ex = O(1720, 540), ey = O(SRC[1], 1300), ea = vis(t, wt(22, 'dim') - .2, T.out + .5, .5);
  if (ea > 0) { ctx.save(); ctx.globalAlpha = ea; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ex, ey, 40, 21, 0, 0, TAU); ctx.stroke(); ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(ex, ey, 11, 0, TAU); ctx.fill(); ctx.restore();
    label('HOW DIM IT LOOKS', ex, ey - 60, 22, '#fff', ea, 'center', 3, 800, F.d); label('APPARENT BRIGHTNESS', ex, ey - 36, 13, 'rgba(220,240,255,.7)', ea, 'center', 4, 500); }
  // equation
  const qa = vis(t, wt(23, 'math') - .2, T.out + .5, .5);
  const MX = O(1240, 240), MY = O(120, 300);
  if (qa > 0) { hudPanel(MX, MY, 600, 170, 'THE MATH', qa, GOLD2);
    label('BRIGHTNESS ∝ 1 / d²', MX + 30, MY + 90, 36, '#fff', qa, 'left', 2, 800, F.d);
    label('→  d ≈ 447 LIGHT-YEARS', MX + 30, MY + 140, 24, GOLD2, qa * P(t, wt(23, 'distance') - .1, wt(23, 'distance') + .3), 'left', 3, 800); }
}
function stargazer(x, y, s, a) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#01030a';
  ctx.beginPath(); ctx.arc(0, -168, 15, 0, TAU); ctx.fill();                     // head (tilted up)
  ctx.beginPath(); ctx.moveTo(-17, -148); ctx.lineTo(17, -148); ctx.lineTo(22, -70); ctx.lineTo(14, 0); ctx.lineTo(4, 0); ctx.lineTo(0, -60); ctx.lineTo(-4, 0); ctx.lineTo(-14, 0); ctx.lineTo(-22, -70); ctx.closePath(); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = '#01030a'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(12, -140); ctx.lineTo(42, -180); ctx.lineTo(64, -222); ctx.stroke(); // arm pointing up
  ctx.beginPath(); ctx.moveTo(-12, -140); ctx.lineTo(-24, -95); ctx.stroke(); ctx.restore(); }
function outro(t) {
  const pb = E.io(P(t, T.out, DUR)), sc = lerp(1.35, 1, pb);
  ctx.save(); ctx.translate(W / 2, H * .75); ctx.scale(sc, sc); ctx.translate(-W / 2, -H * .75);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#010309'); g.addColorStop(.7, '#0a1a33'); g.addColorStop(1, '#16314d'); ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  nebula(-400, -300, .55); starfield(80, 40, 1, t, 1, 1);
  const pts = dipper(t, O(1080, 650), O(380, 560), O(.78, .72), 1, 1, false); const [px, py] = pts[0];
  bigStar(px, py, 12, t, 1);
  // a faint beam from Polaris down to the stargazer's eye
  const hx = O(820, 420), hy = O(860, 1300);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const bg = ctx.createLinearGradient(px, py, hx, hy - 170); bg.addColorStop(0, 'rgba(155,231,255,.35)'); bg.addColorStop(1, 'rgba(155,231,255,0)'); ctx.strokeStyle = bg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(hx, hy - 170); ctx.stroke(); ctx.restore();
  // hill
  ctx.fillStyle = '#01030a'; ctx.beginPath(); ctx.moveTo(-200, H + 200); ctx.lineTo(-200, 880); for (let x = -200; x <= W + 200; x += 30) ctx.lineTo(x, O(900, 1340) - Math.exp(-Math.pow((x - hx) / 520, 2)) * 60 + fbm(x * .006) * 14); ctx.lineTo(W + 200, H + 200); ctx.fill();
  stargazer(hx, hy - 4, 1, 1);
  ctx.restore();
  reticle(W / 2 + (px - W / 2) * sc, H * .75 + (py - H * .75) * sc, 34, t, 'POLARIS', '447 LY · LIGHT FROM 1579', vis(t, T.out + .6, DUR, .6), C.cyan2);
  // end card
  const ea = vis(t, T.end - .6, DUR + 1, .8);
  label('THE NORTH STAR', W / 2, O(650, 930), O(64, 60), '#fff', ea, 'center', O(14, 8), 850, F.d);
  label('447 LIGHT-YEARS  ·  NO SPACESHIP REQUIRED', W / 2, O(700, 980), O(18, 16), C.cyan2, ea * P(t, T.end - .2, T.end + .4), 'center', 6, 600);
}

window.FILM = {
  title: 'THE NORTH STAR',
  tag: 'VOYAGER 1 · POLARIS',
  hotLines: [7, 8, 10, 16],
  init: initFilm,
  scenes: [
    { start: T.s1, draw: scene1 }, { start: T.s2, draw: scene2 }, { start: T.s3, draw: scene3 },
    { start: T.s4, draw: thumbScene }, { start: T.s4b, draw: orbitScene }, { start: T.s5, draw: scene5 },
    { start: T.s6, draw: scene6 }, { start: T.out, draw: outro },
  ],
  xfades: [[T.s2, .5], [T.s4, .6], [T.s4b, .8], [T.s5, .7], [T.s6, .7], [T.out, 1.0]],
  chapters: [[0, '00', 'THE HOOK'], [T.s2, '01', 'ONE LIGHT-DAY'], [T.s3, '02', 'THE POLARIS JUMP'], [T.s4, '03', 'STELLAR PARALLAX'], [T.s5, '04', "LEAVITT'S LAW"], [T.s6, '05', 'INVERSE SQUARE']],
  hits: [[wt(7, '447') - .1, 10, .5], [T.s3, 6, .4]],
  flashes: [[T.s2, .3], [T.s3, .35], [wt(7, '447') - .15, .25], [T.s4, .3]],
  events: {
    whoosh: [T.s2, T.s3, T.s4, T.s4b, T.s5, T.s6, T.out],
    boom: [wt(7, '447') - .1, T.end - .6],
    sparkle: [wt(2, 'north'), wt(7, '447') + .3, T.out + .6],
    ret: [1.0, wt(1, 'travel'), T.s2 + .3, wt(7, '447') + .3],
    ticksYear: [LS(3) + .2, wt(4, 'away')],
    ticks447: [wt(7, '447') - .1, wt(7, '447') + .9],
    ticks8m: [wt(8, 'eight') - .1, wt(8, 'eight') + 1.0],
    pingOut: [wt(5, 'radio') - .1, wt(5, 'reach') + .1], pingBack: [LS(6) - .05, Math.min(wt(6, 'back') + .45, T.s3 - .1)],
    photon: [LS(9) - .1, T.s4 - .3],
    blinkFrom: [LS(11) + .4, T.s4b + .3],
    earth: [wt(13, 'circles') - .2, wt(14, 'six') + .2],
    coin: [wt(15, 'coin'), LS(16)],
    beatFrom: [T.s5, T.s6], beatPer: [PER],
    leavitt: [wt(18, '1912'), wt(19, 'beat'), wt(20, 'true')],
    planes: [T.s6 + .2, T.s6 + .75, T.s6 + 1.3],
    math: [wt(23, 'math'), wt(23, 'distance')],
    hit447: [wt(7, '447') - .1],
  },
};
