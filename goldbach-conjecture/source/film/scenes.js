// Goldbach's Conjecture: Two Mathematicians, Two Major Breakthroughs
const cw = (li, k) => capWords[li][k].t;
const EVEN = C.cyan, PRIME = C.amber, SEMI = C.green, RED = '#ff5a5a';
const SIEVE = (() => { const n = 6000, a = new Uint8Array(n).fill(1); a[0] = a[1] = 0; for (let i = 2; i * i < n; i++) if (a[i]) for (let j = i * i; j < n; j += i) a[j] = 0; return a; })();
const EV = { pop: [], whoosh: [], boom: [], bell: [], tick: [], sparkle: [] };

const T = {
  ver: LB(4), title: LB(5), chen: LB(6), chenEx: LB(10), chenLad: LB(12),
  helf: LB(15), helfEx: LB(20), helfPf: LB(21), stand: LB(24), ques: LB(28), qmark: TL[29].e + .25,
  time: LB(30), close: LB(32), end: LS(34) - .15,
};

// ------------------------------------------------------------ shared pieces
function bg(t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#030814'); g.addColorStop(1, o.warm ? '#1a1830' : '#0c2440');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const cs = 96, sc = t * 7, r0 = Math.floor(sc / cs), cols = Math.ceil(W / cs) + 1;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = font(500, 24, F.m);
  for (let r = 0; r <= Math.ceil(H / cs) + 1; r++) for (let c = 0; c < cols; c++) {
    const n = (r0 + r) * 20 + c + 1, x = c * cs + 48, y = r * cs - (sc % cs) + 20;
    const pr = SIEVE[n], tw = .5 + .5 * Math.sin(t * 1.3 + n * 1.7);
    let a = pr ? .16 + .14 * tw : .07, col = pr ? '255,190,90' : '140,190,255';
    if (o.even && n % 2 === 0) { a = .07 + .22 * o.even; col = '95,212,255'; }
    if (o.scan !== undefined) { const d = Math.abs(x - o.scan); if (d < 160) a += (pr ? .7 : .25) * (1 - d / 160); }
    ctx.fillStyle = `rgba(${col},${a * (o.dim === undefined ? 1 : o.dim)})`; ctx.fillText(n, x, y);
  }
  if (o.scan !== undefined) { const g2 = ctx.createLinearGradient(o.scan - 140, 0, o.scan + 140, 0); g2.addColorStop(0, 'rgba(95,212,255,0)'); g2.addColorStop(.5, 'rgba(95,212,255,.13)'); g2.addColorStop(1, 'rgba(95,212,255,0)'); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H); }
  const v = ctx.createRadialGradient(W / 2, H * .47, 80, W / 2, H * .47, W * .62); v.addColorStop(0, `rgba(4,10,22,${o.hole === undefined ? .78 : o.hole})`); v.addColorStop(1, 'rgba(4,10,22,0)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
function chipW(s, size) { ctx.font = font(800, size); return ctx.measureText(s).width + size * .8; }
function chip(s, cx, cy, size, col, a = 1, sc = 1, glow = 1) {
  if (a <= 0) return; const w = chipW(s, size), h = size * 1.5;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.globalAlpha = a;
  ctx.shadowColor = col; ctx.shadowBlur = 34 * glow; ctx.fillStyle = 'rgba(6,16,32,.92)'; rrect(-w / 2, -h / 2, w, h, size * .3); ctx.fill();
  ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.lineWidth = Math.max(2.5, size * .04); ctx.stroke();
  ctx.globalAlpha = a * .14; ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = a;
  txt(s, 0, size * .04, font(800, size), '#fff', 'center', 0, 'middle'); ctx.restore();
}
// Equation of tokens. item: {s, t0, col (chip) | op:true, from: index to fly out of}. Returns centre x of each token.
function eq(items, cx, cy, size, t, a = 1) {
  const gap = size * .3, ws = items.map(it => it.op ? (ctx.font = font(700, size), ctx.measureText(it.s).width) : chipW(it.s, size));
  const tot = ws.reduce((s, w) => s + w, 0) + gap * (items.length - 1); let x = cx - tot / 2; const xs = ws.map(w => { const c = x + w / 2; x += w + gap; return c; });
  items.forEach((it, i) => {
    const p = P(t, it.t0, it.t0 + .38); if (p <= 0) return;
    if (it.op) { ctx.save(); ctx.globalAlpha = a * p; txt(it.s, xs[i], cy + size * .04, font(700, size), 'rgba(235,245,255,.9)', 'center', 0, 'middle'); ctx.restore(); return; }
    let px = xs[i], py = cy; if (it.from !== undefined) { const e = E.o3(p); px = lerp(xs[it.from], xs[i], e); py = cy - Math.sin(e * Math.PI) * size * .5; }
    chip(it.s, px, py, size, it.col, a * clamp(p * 2), lerp(.6, 1, E.oBack(p)));
  });
  return xs;
}
function sup(base, s, cx, y, size, col, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.font = font(800, size); const bw = ctx.measureText(base).width; ctx.font = font(800, size * .5); const sw = ctx.measureText(s).width;
  const x = cx - (bw + sw) / 2; txt(base, x, y, font(800, size), col, 'left'); txt(s, x + bw + size * .03, y - size * .42, font(800, size * .5), col, 'left'); ctx.restore();
}
function label(s, x, y, a, col = 'rgba(200,225,255,.75)', size = 17, al = 'center') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; txt(s, x, y, font(600, size, F.m), col, al, 4); ctx.restore(); }
function portrait(cx, cy, w, h, a, col, name, sub, t, small) {
  if (a <= 0) return; const x = cx - w / 2, y = cy - h / 2;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 24 * (1 - E.o3(a)));
  ctx.shadowColor = col; ctx.shadowBlur = 40; const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#12294a'); g.addColorStop(1, '#070f1e');
  ctx.fillStyle = g; rrect(x, y, w, h, 18); ctx.fill(); ctx.shadowBlur = 0;
  ctx.save(); rrect(x, y, w, h, 18); ctx.clip();
  const im = document.getElementById(name.startsWith('CHEN') ? 'p1' : 'p2'); ctx.drawImage(im, x, y, w, h);
  const sg = ctx.createLinearGradient(0, y + h * .6, 0, y + h); sg.addColorStop(0, 'rgba(4,10,22,0)'); sg.addColorStop(1, 'rgba(4,10,22,.55)'); ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = a * .035; ctx.fillStyle = '#fff'; for (let yy = y + ((t * 30) % 8); yy < y + h; yy += 8) ctx.fillRect(x, yy, w, 2);
  ctx.restore(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 2.5; rrect(x, y, w, h, 18); ctx.stroke();
  txt(name, cx, y + h + (small ? 44 : 56), font(800, small ? 28 : 36), '#fff', 'center', 2);
  txt(sub, cx, y + h + (small ? 72 : 90), font(600, small ? 14 : 17, F.m), col, 'center', 3);
  ctx.restore();
}
function bigYear(s, x, y, t, t0, col) {
  const p = P(t, t0, t0 + .5); if (p <= 0) return; ctx.save(); ctx.globalAlpha = p;
  txt(s, x, y + 30 * (1 - E.o3(p)), font(900, 150), col, 'left', -2); ctx.restore();
}
function badge(s, cx, cy, col, t, t0, size = 34) {
  const p = P(t, t0, t0 + .3); if (p <= 0) return; ctx.font = font(900, size); ctx.letterSpacing = '4px'; const w = ctx.measureText(s).width + size * 1.3; ctx.letterSpacing = '0px';
  ctx.save(); ctx.translate(cx, cy); const sc = lerp(1.8, 1, E.oBack(p)); ctx.scale(sc, sc); ctx.globalAlpha = clamp(p * 2);
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 26; rrect(-w / 2, -size * .85, w, size * 1.7, size * .85); ctx.fill(); ctx.shadowBlur = 0;
  txt(s, 2, 2, font(900, size), '#04101e', 'center', 4, 'middle'); ctx.restore();
}

// ------------------------------------------------------------ CH 01 · the mystery
const evT0 = wt(0, 'even');
function sceneMystery(t) {
  bg(t, { even: P(t, evT0, evT0 + 1) * (1 - P(t, LB(2) - .4, LB(2) + .4)) });
  const aE = 1 - P(t, LB(2) - .35, LB(2));
  label('EVEN NUMBERS GREATER THAN 2', W / 2, 270, P(t, evT0, evT0 + .4) * aE, EVEN, 20);
  [4, 6, 8, 10, 12, 14, 16, 18].forEach((n, i) => { const t0 = evT0 + i * .14, p = P(t, t0, t0 + .35); chip('' + n, W / 2 + (i - 3.5) * 196, 400 + Math.sin(t * 1.6 + i) * 6, 74, EVEN, clamp(p * 2) * aE, lerp(.5, 1, E.oBack(p))); });
  // template
  const m = E.io(P(t, LB(2) - .35, LB(2) + .45)), ty = lerp(660, 235, m), ts = lerp(58, 44, m);
  eq([{ s: 'EVEN', col: EVEN, t0: LS(1) + .15 }, { s: '=', op: 1, t0: LS(1) + .5 }, { s: 'PRIME', col: PRIME, t0: wt(1, 'two') }, { s: '+', op: 1, t0: wt(1, 'two') + .2 }, { s: 'PRIME', col: PRIME, t0: wt(1, 'prime') + .15 }], W / 2, ty, ts, t);
  eq([{ s: '10', col: EVEN, t0: cw(2, 2) }, { s: '=', op: 1, t0: cw(2, 3) }, { s: '3', col: PRIME, t0: cw(2, 4), from: 0 }, { s: '+', op: 1, t0: cw(2, 5) }, { s: '7', col: PRIME, t0: cw(2, 6), from: 0 }], W / 2, 450, 112, t);
  eq([{ s: '28', col: EVEN, t0: cw(3, 1) }, { s: '=', op: 1, t0: cw(3, 2) }, { s: '11', col: PRIME, t0: cw(3, 3), from: 0 }, { s: '+', op: 1, t0: cw(3, 4) }, { s: '17', col: PRIME, t0: cw(3, 5), from: 0 }], W / 2, 690, 112, t);
}
const tUns = wt(4, 'unsolved');
function sceneVerify(t) {
  bg(t, { dim: .7 }); const u = t - T.ver, a = P(t, T.ver, T.ver + .4);
  const px = 230, py = 180, pw = 640, ph = 650; hudPanel(px, py, pw, ph, 'COMPUTER SEARCH · TESTING EVERY EVEN NUMBER', a);
  const k = Math.floor(7 * u + 7 * u * u), rows = 11;
  for (let j = 0; j < rows; j++) { const n = 4 + 2 * (k - (rows - 1) + j); if (n < 4) continue; let p = 2; while (!(SIEVE[p] && SIEVE[n - p])) p++;
    const y = py + 104 + j * 50, la = a * (.3 + .7 * j / (rows - 1));
    ctx.save(); ctx.globalAlpha = la; txt(n + '', px + 190, y, font(700, 30, F.m), EVEN, 'right'); txt('=', px + 230, y, font(500, 30, F.m), '#fff', 'center');
    txt(p + ' + ' + (n - p), px + 270, y, font(700, 30, F.m), PRIME, 'left'); txt('✓', px + pw - 70, y, font(800, 30), C.green, 'center'); ctx.restore(); }
  const rx = 1340, a2 = P(t, LS(4) + .5, LS(4) + 1);
  label('CHECKED BY COMPUTER UP TO', rx, 300, a2, 'rgba(200,225,255,.8)', 20);
  sup('4 × 10', '18', rx, 440, 132, '#fff', a2);
  label('NOT A SINGLE EXCEPTION FOUND', rx, 500, P(t, LS(4) + 1.1, LS(4) + 1.6), C.green, 20);
  ctx.fillStyle = `rgba(255,255,255,${.25 * a2})`; ctx.fillRect(rx - 260, 548, 520, 2);
  label('A PROOF FOR ALL OF THEM?', rx, 610, P(t, tUns - .9, tUns - .4), 'rgba(200,225,255,.8)', 20);
  stamp(t, tUns, rx, 720, 'UNSOLVED', RED, -.07, 76);
}
function titleCard(t, t0, end, sub) {
  const p = P(t, t0, t0 + .7), y = H * .44 + 20 * (1 - E.o3(p)); ctx.save(); ctx.globalAlpha = p * (end ? 1 - P(t, end - .3, end) : 1);
  txt('THE', W / 2, y - 132, font(600, 30, F.m), C.cyan2, 'center', 16);
  ctx.shadowColor = 'rgba(95,212,255,.6)'; ctx.shadowBlur = 40; txt('GOLDBACH CONJECTURE', W / 2, y, font(900, 124), '#fff', 'center', 4); ctx.shadowBlur = 0;
  ctx.fillStyle = PRIME; const lw = 560 * E.o3(P(t, t0 + .2, t0 + 1)); ctx.fillRect(W / 2 - lw / 2, y + 40, lw, 3);
  ctx.globalAlpha *= P(t, t0 + .5, t0 + 1); txt(sub, W / 2, y + 104, font(600, 22, F.m), 'rgba(215,235,255,.85)', 'center', 6); ctx.restore();
}
function sceneTitle(t) { bg(t, { hole: .6 }); titleCard(t, T.title + .1, 0, 'FIRST PROPOSED IN 1742 · CHRISTIAN GOLDBACH, IN A LETTER TO EULER'); }

// ------------------------------------------------------------ CH 02 · Chen Jingrun
const tNot = wt(12, 'not'), tClose = wt(13, 'remarkably'), tThm = wt(14, 'chen');
function sceneChen(t) {
  bg(t, { dim: .75 });
  portrait(350, 430, 380, 470, P(t, T.chen + .1, T.chen + .7), PRIME, 'CHEN JINGRUN', '1933 – 1996 · CHINA', t);
  const RX = 1230;
  if (t < T.chenEx + .2) { // statement
    const a = 1 - P(t, T.chenEx - .3, T.chenEx);
    ctx.save(); ctx.globalAlpha = a; bigYear('1973', 660, 300, t, wt(6, '1973'), 'rgba(255,179,64,.95)');
    label('A MAJOR BREAKTHROUGH', 1090, 232, P(t, wt(6, 'breakthrough') - .1, wt(6, 'breakthrough') + .3) * a, '#fff', 22, 'left');
    label('CHEN PROVED', 1090, 272, P(t, LS(7), LS(7) + .3) * a, C.cyan2, 18, 'left'); ctx.restore();
    const te = wt(7, 'even');
    chip('EVERY LARGE EVEN NUMBER', RX, 430, 46, EVEN, clamp(P(t, te, te + .35) * 2) * a, lerp(.6, 1, E.oBack(P(t, te, te + .35))));
    const tp = wt(8, 'prime'), ts = wt(9, 'at');
    const xs = eq([{ s: '=', op: 1, t0: LS(8) + .2 }, { s: 'A PRIME', col: PRIME, t0: tp }, { s: '+', op: 1, t0: LS(9) }, { s: '≤ 2 PRIME FACTORS', col: SEMI, t0: ts }], RX, 580, 46, t, a);
    label('p', xs[1], 668, P(t, tp + .3, tp + .6) * a, PRIME, 26);
    label('q   or   q₁ × q₂', xs[3], 668, P(t, ts + .5, ts + .9) * a, SEMI, 26);
  }
  if (t > T.chenEx - .1 && t < T.chenLad + .2) { // example
    const a = P(t, T.chenEx, T.chenEx + .2) * (1 - P(t, T.chenLad - .3, T.chenLad));
    label('FOR EXAMPLE', RX, 230, a, 'rgba(200,225,255,.8)', 20);
    const xs = eq([{ s: '100', col: EVEN, t0: cw(10, 2) }, { s: '=', op: 1, t0: cw(10, 3) }, { s: '23', col: PRIME, t0: cw(10, 4), from: 0 }, { s: '+', op: 1, t0: cw(10, 5) }, { s: '77', col: SEMI, t0: cw(10, 6), from: 0 }], RX, 370, 100, t, a);
    label('PRIME', xs[2], 480, P(t, cw(10, 4) + .4, cw(10, 4) + .7) * a, PRIME, 18);
    const t7 = cw(11, 1), p = E.o3(P(t, t7, t7 + .5));
    if (p > 0) { ctx.save(); ctx.globalAlpha = a * p; ctx.strokeStyle = SEMI; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xs[4], 450); ctx.lineTo(xs[4], 450 + 70 * p); ctx.stroke(); ctx.restore(); }
    const ys = eq([{ s: '7', col: PRIME, t0: cw(11, 3) }, { s: '×', op: 1, t0: cw(11, 4) }, { s: '11', col: PRIME, t0: cw(11, 5) }], xs[4] - 40, 590, 84, t, a);
    label('ONLY TWO PRIME FACTORS', xs[4] - 40, 700, P(t, cw(11, 5) + .35, cw(11, 5) + .7) * a, SEMI, 18);
  }
  if (t > T.chenLad - .1) { // the ladder: how close?
    const a = P(t, T.chenLad, T.chenLad + .4), x0 = 700, x1 = 1760, y = 470, xc = lerp(x0, x1, .8);
    label('HOW CLOSE?   “a + b”  =  (AT MOST a PRIME FACTORS) + (AT MOST b PRIME FACTORS)', RX, 250, a, 'rgba(200,225,255,.85)', 19);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.fillRect(x0, y - 3, x1 - x0, 6);
    const m = E.io(P(t, T.chenLad + .3, tClose + .5)), mx = lerp(x0, xc, m);
    const g = ctx.createLinearGradient(x0, 0, mx, 0); g.addColorStop(0, 'rgba(255,179,64,.2)'); g.addColorStop(1, PRIME); ctx.fillStyle = g; ctx.fillRect(x0, y - 3, mx - x0, 6);
    for (const [x, top, bot, col] of [[x0, '9 + 9', 'BRUN · 1920', '#cfe3ff'], [xc, '1 + 2', 'CHEN · 1973', PRIME], [x1, '1 + 1', 'GOLDBACH', EVEN]]) {
      const on = x === x0 ? 1 : x === xc ? P(t, tClose, tClose + .4) : P(t, tNot - .2, tNot + .2);
      ctx.globalAlpha = a * (.35 + .65 * on); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 11, 0, TAU); ctx.fill();
      txt(top, x, y - 50, font(900, 76), col, 'center'); txt(bot, x, y + 64, font(600, 21, F.m), col, 'center', 3);
    }
    ctx.globalAlpha = a; ctx.shadowColor = PRIME; ctx.shadowBlur = 30; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx, y, 9, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
    ctx.restore();
    label('NOT YET PROVED', x1 - 10, y + 100, P(t, tNot, tNot + .3) * a, RED, 18);
    const pc = P(t, tClose + .5, tClose + .9); if (pc > 0) { ctx.save(); ctx.globalAlpha = pc * a; ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 2.5; arrow(xc + 20, y + 142, x1 - 20, y + 142, 12); ctx.restore(); label('ONE STEP AWAY', (xc + x1) / 2, y + 182, pc * a, '#fff', 18); }
    const pt = P(t, tThm, tThm + .5); if (pt > 0) { ctx.save(); ctx.globalAlpha = pt; ctx.shadowColor = 'rgba(255,179,64,.7)'; ctx.shadowBlur = 36; txt('CHEN’S THEOREM', RX, 800 + 20 * (1 - E.o3(pt)), font(900, 92), '#fff', 'center', 4); ctx.restore(); }
  }
}

// ------------------------------------------------------------ CH 03 · Harald Helfgott
const tAna = wt(21, 'analysis'), tCom = wt(22, 'computer'), tDone = wt(23, 'complete');
function sceneHelf(t) {
  bg(t, { dim: .75 });
  portrait(1570, 430, 380, 470, P(t, wt(16, 'harald') - .5, wt(16, 'harald') + .1), EVEN, 'HARALD HELFGOTT', 'BORN 1977 · LIMA, PERU', t);
  const LX = 700;
  if (t < T.helfEx + .2) {
    const a = 1 - P(t, T.helfEx - .3, T.helfEx);
    ctx.save(); ctx.globalAlpha = a; label('ANOTHER BREAKTHROUGH', 164, 232, P(t, T.helf + .2, T.helf + .6) * a, '#fff', 22, 'left');
    bigYear('2013', 160, 380, t, wt(16, '2013'), 'rgba(95,212,255,.95)'); ctx.restore();
    const tw = wt(17, 'weak'), pw = P(t, tw, tw + .4);
    if (pw > 0) { ctx.save(); ctx.globalAlpha = pw * a; txt('THE WEAK GOLDBACH', 610, 290 + 14 * (1 - E.o3(pw)), font(900, 52), '#fff', 'left', 2); txt('CONJECTURE', 610, 348 + 14 * (1 - E.o3(pw)), font(900, 52), '#fff', 'left', 2); txt('PROVED', 612, 394, font(700, 22, F.m), C.green, 'left', 8); ctx.restore(); }
    const to = wt(18, 'odd'), t3 = wt(19, 'three');
    chip('EVERY ODD NUMBER > 5', LX, 520, 46, '#c9a6ff', clamp(P(t, to, to + .35) * 2) * a, lerp(.6, 1, E.oBack(P(t, to, to + .35))));
    eq([{ s: '=', op: 1, t0: LS(19) + .2 }, { s: 'PRIME', col: PRIME, t0: t3 }, { s: '+', op: 1, t0: t3 + .2 }, { s: 'PRIME', col: PRIME, t0: t3 + .3 }, { s: '+', op: 1, t0: t3 + .5 }, { s: 'PRIME', col: PRIME, t0: t3 + .6 }], LX, 665, 46, t, a);
  }
  if (t > T.helfEx - .1 && t < T.helfPf + .2) {
    const a = P(t, T.helfEx, T.helfEx + .2) * (1 - P(t, T.helfPf - .3, T.helfPf));
    label('FOR EXAMPLE', LX, 270, a, 'rgba(200,225,255,.8)', 20);
    const xs = eq([{ s: '17', col: '#c9a6ff', t0: cw(20, 2) }, { s: '=', op: 1, t0: cw(20, 3) }, { s: '5', col: PRIME, t0: cw(20, 4), from: 0 }, { s: '+', op: 1, t0: cw(20, 5) }, { s: '5', col: PRIME, t0: cw(20, 6), from: 0 }, { s: '+', op: 1, t0: cw(20, 7) }, { s: '7', col: PRIME, t0: cw(20, 8), from: 0 }], LX, 440, 104, t, a);
    label('THREE PRIMES', (xs[2] + xs[6]) / 2, 570, P(t, cw(20, 8) + .4, cw(20, 8) + .7) * a, PRIME, 20);
  }
  if (t > T.helfPf - .1) {
    const a = P(t, T.helfPf, T.helfPf + .4);
    // analysis panel: the circle method
    const aA = a * P(t, tAna - .6, tAna - .2); hudPanel(130, 180, 540, 510, 'MATHEMATICAL ANALYSIS', aA, PRIME);
    if (aA > 0) { const cx = 400, cy = 400, R = 130; ctx.save(); ctx.globalAlpha = aA; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(95,212,255,.35)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
      const sw = E.io(P(t, tAna - .3, tAna + 1.6)) * TAU; ctx.strokeStyle = PRIME; ctx.lineWidth = 9; ctx.shadowColor = PRIME; ctx.shadowBlur = 20;
      for (const [c, hw] of [[0, .3], [Math.PI, .22], [TAU / 3, .14], [2 * TAU / 3, .14], [Math.PI / 2, .1], [3 * Math.PI / 2, .1]]) if (sw > c) { ctx.beginPath(); ctx.arc(cx, cy, R, c - hw, Math.min(c + hw, sw + hw)); ctx.stroke(); }
      ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx + Math.cos(sw + t * .6) * R, cy + Math.sin(sw + t * .6) * R, 8, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(cx - R - 30, cy); ctx.lineTo(cx + R + 30, cy); ctx.moveTo(cx, cy - R - 30); ctx.lineTo(cx, cy + R + 30); ctx.stroke();
      txt('THE CIRCLE METHOD', cx, 608, font(800, 26), '#fff', 'center', 3); ctx.restore(); sup('COVERS ALL n ≥ 10', '27', cx, 652, 24, PRIME, aA); }
    // computer panel
    const aC = a * P(t, tCom - .5, tCom - .1); hudPanel(710, 180, 540, 510, 'COMPUTER VERIFICATION', aC, C.green);
    if (aC > 0) { ctx.save(); ctx.globalAlpha = aC; const nx = 20, ny = 12, cs = 23, ox = 980 - nx * cs / 2, oy = 250, fill = E.io2(P(t, tCom - .2, tDone - .3)) * nx * ny;
      for (let i = 0; i < nx * ny; i++) { const x = ox + (i % nx) * cs, y = oy + Math.floor(i / nx) * cs; const on = i < fill; ctx.fillStyle = on ? (i > fill - 6 ? '#fff' : 'rgba(125,255,176,.85)') : 'rgba(125,255,176,.12)'; ctx.fillRect(x + 2, y + 2, cs - 5, cs - 5); }
      txt('EVERY SMALLER n, CHECKED', 980, 608, font(800, 26), '#fff', 'center', 3); txt(Math.round(P(t, tCom - .2, tDone - .3) * 100) + '% ✓', 980, 652, font(700, 24, F.m), C.green, 'center', 3); ctx.restore(); }
    const pp = P(t, tAna + .2, tAna + .6) * a; if (pp > 0) { ctx.save(); ctx.globalAlpha = pp * P(t, tCom - .5, tCom); txt('+', 690, 450, font(800, 60), '#fff', 'center'); ctx.restore(); }
    stamp(t, tDone, 690, 775, 'WEAK GOLDBACH: SOLVED', C.green, -.03, 50);
  }
}

// ------------------------------------------------------------ CH 04 · the unfinished challenge
function row(t, t0, y, who, year, items, colr) {
  const p = P(t, t0, t0 + .5); if (p <= 0) return; const x = 200 - 60 * (1 - E.o3(p));
  ctx.save(); ctx.globalAlpha = p; ctx.fillStyle = 'rgba(6,16,32,.8)'; rrect(x, y - 82, 1520, 164, 18); ctx.fill(); ctx.strokeStyle = colr; ctx.globalAlpha = p * .55; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = p;
  ctx.fillStyle = colr; ctx.fillRect(x, y - 52, 6, 104);
  txt(who, x + 44, y + 2, font(800, 38), '#fff', 'left', 1); txt(year, x + 44, y + 38, font(600, 17, F.m), colr, 'left', 4); ctx.restore();
  eq(items.map(it => ({ ...it, t0: t0 + .25 })), 1010, y, 30, t, p);
}
const tC = wt(25, 'close'), tS = wt(26, 'solved'), tU = wt(27, 'unproven');
function sceneStand(t) {
  bg(t, { dim: .6 }); const a = P(t, T.stand, T.stand + .5);
  ctx.save(); ctx.globalAlpha = a; txt('WHERE DO WE STAND TODAY?', W / 2, 190, font(900, 56), '#fff', 'center', 6); ctx.restore();
  row(t, LS(25), 340, 'CHEN JINGRUN', '1973 · CHEN’S THEOREM', [{ s: 'EVEN', col: EVEN }, { s: '=', op: 1 }, { s: 'PRIME', col: PRIME }, { s: '+', op: 1 }, { s: '≤ 2 PRIME FACTORS', col: SEMI }], PRIME);
  badge('VERY CLOSE', 1555, 340, PRIME, t, tC, 30);
  row(t, LS(26), 530, 'HARALD HELFGOTT', '2013 · WEAK GOLDBACH', [{ s: 'ODD > 5', col: '#c9a6ff' }, { s: '=', op: 1 }, { s: 'PRIME', col: PRIME }, { s: '+', op: 1 }, { s: 'PRIME', col: PRIME }, { s: '+', op: 1 }, { s: 'PRIME', col: PRIME }], C.green);
  badge('SOLVED ✓', 1555, 530, C.green, t, tS, 30);
  row(t, LS(27), 720, 'GOLDBACH', '1742 · THE ORIGINAL', [{ s: 'EVEN > 2', col: EVEN }, { s: '=', op: 1 }, { s: 'PRIME', col: PRIME }, { s: '+', op: 1 }, { s: 'PRIME', col: PRIME }], RED);
  badge('UNPROVEN', 1555, 720, RED, t, tU, 30);
}
function qMark(t, t0, cx, cy, size) {
  const p = P(t, t0, t0 + .9); if (p <= 0) return; const pulse = 1 + .03 * Math.sin((t - t0) * 3);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(lerp(.7, 1, E.o3(p)) * pulse, lerp(.7, 1, E.o3(p)) * pulse); ctx.globalAlpha = p;
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, size * .9); g.addColorStop(0, 'rgba(255,179,64,.28)'); g.addColorStop(1, 'rgba(255,179,64,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-size, -size, size * 2, size * 2); ctx.globalCompositeOperation = 'source-over';
  ctx.shadowColor = PRIME; ctx.shadowBlur = 60; txt('?', 0, size * .05, font(900, size), '#fff', 'center', 0, 'middle'); ctx.restore();
}
function sceneQuestion(t) {
  const q = P(t, T.qmark, T.qmark + .8); bg(t, { even: .6, hole: lerp(.78, .55, q) });
  const a = 1 - q, p1 = P(t, LS(28), LS(28) + .5);
  ctx.save(); ctx.globalAlpha = p1 * a; ctx.translate(0, -30 * E.i2(q));
  txt('EVERY EVEN NUMBER', W / 2, 330 + 20 * (1 - E.o3(p1)), font(900, 118), '#fff', 'center', 3);
  const p2 = P(t, wt(28, 'greater'), wt(28, 'greater') + .4); ctx.globalAlpha = p2 * a; txt('GREATER THAN 2', W / 2, 430, font(700, 44, F.m), EVEN, 'center', 12); ctx.restore();
  const t2 = wt(29, 'written');
  eq([{ s: '=', op: 1, t0: wt(29, 'always') }, { s: 'PRIME', col: PRIME, t0: t2 }, { s: '+', op: 1, t0: t2 + .25 }, { s: 'PRIME', col: PRIME, t0: t2 + .4 }, { s: '?', op: 1, t0: wt(29, 'two') + .3 }], W / 2, 640 - 30 * E.i2(q), 104, t, a);
  qMark(t, T.qmark, W / 2, 480, 620);
}
const t280 = wt(30, '280'), tSea = wt(31, 'searching');
function sceneTime(t) {
  const sc = P(t, tSea - .2, T.close + .4); bg(t, { scan: sc > 0 ? lerp(-200, W + 200, (sc * 1.6) % 1) : undefined, dim: .9, hole: .7 });
  const a = P(t, T.time, T.time + .5), x0 = 250, x1 = 1670, y = 600, X = yr => lerp(x0, x1, (yr - 1742) / (2026 - 1742));
  const m = E.io2(P(t, t280 - .3, t280 + 2.2)), yrs = Math.round(280 * m);
  ctx.save(); ctx.globalAlpha = a; txt(yrs + (m >= 1 ? '+' : ''), W / 2, 380, font(900, 190), '#fff', 'center', -2); txt('YEARS WITHOUT A PROOF', W / 2, 444, font(600, 24, F.m), PRIME, 'center', 10);
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(x0, y - 2, x1 - x0, 4); const mx = lerp(x0, x1, m);
  const g = ctx.createLinearGradient(x0, 0, mx, 0); g.addColorStop(0, 'rgba(95,212,255,.25)'); g.addColorStop(1, EVEN); ctx.fillStyle = g; ctx.fillRect(x0, y - 3, mx - x0, 6);
  ctx.shadowColor = EVEN; ctx.shadowBlur = 26; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx, y, 9, 0, TAU); ctx.fill(); ctx.shadowBlur = 0;
  for (const [yr, name, col, up] of [[1742, 'GOLDBACH’S LETTER', '#fff', 0], [1973, 'CHEN', PRIME, 1], [2013, 'HELFGOTT', C.green, 0], [2026, 'TODAY', EVEN, 1]]) {
    const on = P(mx, X(yr) - 30, X(yr)); ctx.globalAlpha = a * (.3 + .7 * on); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X(yr), y, 8, 0, TAU); ctx.fill();
    ctx.fillRect(X(yr) - 1, up ? y - 60 : y + 12, 2, 48); txt(yr === 2026 ? 'TODAY' : yr + '', X(yr), up ? y - 100 : y + 100, font(900, 36), col, 'center');
    if (yr !== 2026) txt(name, X(yr), up ? y - 74 : y + 128, font(600, 15, F.m), col, 'center', 3);
  }
  ctx.restore();
  label('● STILL SEARCHING FOR THE ANSWER', W / 2, 800, P(t, tSea, tSea + .3) * (.55 + .45 * Math.sin(t * 6) ** 2), EVEN, 22);
}
const tTwo1 = wt(32, 'two'), tTwo2 = cw(32, 2), tOne = wt(33, 'one');
function sceneClose(t) {
  const e = P(t, T.end, T.end + .7); bg(t, { hole: .62 });
  if (e < 1) { ctx.save(); ctx.globalAlpha = 1 - e;
    const p1 = P(t, tTwo1, tTwo1 + .5);
    portrait(430, 370, 250, 310, p1 * (1 - e), PRIME, 'CHEN JINGRUN', '1973', t, 1); portrait(1490, 370, 250, 310, P(t, tTwo1 + .2, tTwo1 + .7) * (1 - e), EVEN, 'HARALD HELFGOTT', '2013', t, 1);
    for (const [x, s, col, d] of [[430, 'CHEN’S THEOREM', PRIME, 0], [1490, 'WEAK GOLDBACH ✓', C.green, .25]]) { const p = P(t, tTwo2 + d, tTwo2 + d + .35); chip(s, x, 700, 32, col, clamp(p * 2) * (1 - e), lerp(.6, 1, E.oBack(p))); }
    ctx.restore(); qMark(t, tOne, W / 2, 400, 430 * (1 - e * .999));
    label('ONE ENDURING MYSTERY', W / 2, 700, P(t, tOne + .2, tOne + .5) * (1 - e), '#fff', 22);
  }
  if (e > 0) { titleCard(t, T.end, 0, 'EVERY EVEN NUMBER > 2  =  PRIME + PRIME ?'); label('UNSOLVED SINCE 1742', W / 2, H * .44 + 170, P(t, T.end + 1, T.end + 1.5), PRIME, 20); }
}

// ------------------------------------------------------------ events for the score
EV.pop.push(...[0, 1, 2, 3, 4, 5, 6, 7].map(i => evT0 + i * .14), LS(1) + .15, wt(1, 'two'), wt(1, 'prime') + .15,
  cw(2, 2), cw(2, 4), cw(2, 6), cw(3, 1), cw(3, 3), cw(3, 5), wt(7, 'even'), wt(8, 'prime'), wt(9, 'at'),
  cw(10, 2), cw(10, 4), cw(10, 6), cw(11, 3), cw(11, 5), wt(18, 'odd'), wt(19, 'three'), wt(19, 'three') + .3, wt(19, 'three') + .6,
  cw(20, 2), cw(20, 4), cw(20, 6), cw(20, 8), LS(25), LS(26), LS(27), tC, tS, wt(29, 'written'), wt(29, 'written') + .4, tTwo1, tTwo2);
EV.whoosh.push(T.ver, T.title, T.chen, T.chenEx, T.chenLad, T.helf, T.helfEx, T.helfPf, T.stand, T.ques, T.time, T.close, T.end);
EV.boom.push(tUns, T.title + .1, tThm, tDone, tU, T.qmark, tOne, T.end + .1);
EV.bell.push(wt(6, '1973'), wt(16, '2013'), wt(17, 'weak'), tClose + .5, tS, T.qmark + .1, T.end + .2, t280 + 2.2);
EV.tick = { verify: [T.ver + .3, tUns], grid: [tCom - .2, tDone - .3], years: [t280 - .3, t280 + 2.2], scan: [tSea - .2, T.close] };
EV.marks = T;

window.FILM = {
  title: 'GOLDBACH', tag: 'GOLDBACH’S CONJECTURE',
  hotLines: [6, 7, 8, 9, 10, 11, 12, 13, 14, 25, 30, 32, 33],
  scenes: [{ start: 0, draw: sceneMystery }, { start: T.ver, draw: sceneVerify }, { start: T.title, draw: sceneTitle }, { start: T.chen, draw: sceneChen },
    { start: T.helf, draw: sceneHelf }, { start: T.stand, draw: sceneStand }, { start: T.ques, draw: sceneQuestion }, { start: T.time, draw: sceneTime }, { start: T.close, draw: sceneClose }],
  xfades: [[T.ver, .5], [T.title, .5], [T.chen, .6], [T.helf, .6], [T.stand, .6], [T.ques, .6], [T.time, .6], [T.close, .6]],
  chapters: [[0, '01', 'THE MYSTERY'], [T.chen, '02', 'CHEN JINGRUN · 1973'], [T.helf, '03', 'HARALD HELFGOTT · 2013'], [T.stand, '04', 'THE UNFINISHED CHALLENGE']],
  hits: [[tUns, 10, .4], [tDone, 10, .4], [tU, 12, .45]],
  flashes: [[T.chen, .3], [T.helf, .3], [T.stand, .3]],
  events: EV,
};
