/* match.js — "Career Match": a memory game dressed as classic Windows Solitaire.
   Match each project card to its outcome. Three levels, a countdown, three lives, combos, and the
   signature Solitaire cascade on a win. All sound is synthesised in sfx.js and respects the mute toggle. */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;
  const defs = NM.apps.defs;
  const KEY = 'nm_match_v1';

  // project -> outcome (the 8 requested pairs, plus two more real ones so Hard (5x4) has 10 pairs)
  const PAIRS = [
    { id: 'blackfungus', name: 'Black Fungus', icon: 'microscope', stat: '98.87%', sub: 'accuracy', note: 'Black Fungus Detection: five CNN architectures compared — Inception V3 won at 98.87% train / 98.25% test.' },
    { id: 'brand', name: 'Brand Alchemy', icon: 'sneaker', stat: '2nd', sub: 'Runner-Up · IMT Ghaziabad', note: 'Brand Alchemy: a Bata backpack strategy that placed 2nd Runner-Up at IMT Ghaziabad.' },
    { id: 'prodyssey', name: 'Prodyssey', icon: 'kanban', stat: 'Finalist', sub: 'National · IIM Indore', note: 'Prodyssey: moved a 19-college textbook project online — National Finalist at IIM Indore.' },
    { id: 'tommy', name: 'Tommy Hilfiger', icon: 'star', stat: '₹19.25L', sub: 'in sales', note: 'Tommy Hilfiger SIP: ₹19.25L+ in personal sales, 108.3% of her May target.' },
    { id: 'sirp', name: 'SIRP', icon: 'lock', stat: '39', sub: 'papers reviewed', note: 'SIRP: a review of 39 studies on explainable AI and the personalisation–privacy paradox.' },
    { id: 'gcl', name: 'GCL', icon: 'chat', stat: 'PostGenie AI', sub: 'prototype', note: 'GCL: a content-creation study for Digital Dogs that ended in the PostGenie AI prototype.' },
    { id: 'instructor', name: 'Instructor Aid', icon: 'gradebook', stat: 'Python', sub: 'desktop app', note: 'Instructor Aid System: a Python desktop gradebook built around a teacher\'s real workflow.' },
    { id: 'glitch', name: 'Glitch', icon: 'gamepad', stat: 'Unity', sub: 'Game Jam', note: 'Glitch: the college game-dev club — including an International Unity Game Jam.' },
    { id: 'bowl', name: 'Marketing Bowl', icon: 'heart', stat: '1st', sub: 'Runner-Up · IIM Sirmaur', note: 'Marketing Bowl 3.0: a tote-bag go-to-market that took 1st Runner-Up at IIM Sirmaur.' },
    { id: 'ammachi', name: 'Ammachi Labs', icon: 'terminal', stat: 'DIKSHA', sub: 'game design & UX', note: 'Ammachi Labs: game design and UX for children under the government DIKSHA initiative.' },
  ];
  const DIFF = {
    easy: { label: 'Easy', cols: 4, rows: 3, sec: 9 },
    normal: { label: 'Normal', cols: 4, rows: 4, sec: 8 },
    hard: { label: 'Hard', cols: 5, rows: 4, sec: 7 },
  };
  const LEVEL_TIME = [1, 0.85, 0.7]; // clock shrinks each level
  const LEVEL_BONUS = [2000, 2000, 1500]; // ms won back per match
  const LEVEL_PEEK = [900, 750, 600]; // ms a wrong pair stays face-up
  const RANKS = ['Intern', 'Analyst', 'Strategist', 'Hire Her'];
  const SPARK = ['#ffffff', '#cfefff', '#8fd0ff', '#5fb3ff', '#9dffc6', '#5fe39a'];

  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const mmss = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); };

  /* ---------- tiny pixel art: card-back tile, felt tile, hearts ---------- */
  let backUrl = '', feltUrl = '';
  function makeTiles() {
    if (backUrl) return;
    const tile = (w, hgt, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = hgt; const x = c.getContext('2d'); for (let py = 0; py < hgt; py++) for (let px = 0; px < w; px++) { const col = fn(px, py); if (col) { x.fillStyle = col; x.fillRect(px, py, 1, 1); } } return c.toDataURL('image/png'); };
    backUrl = tile(8, 8, (x, y) => {
      if ((x + y) % 8 === 0 || (x - y + 8) % 8 === 0) return '#8fb0ff';
      if (x === 4 && y === 4) return '#ffffff';
      return (x + y) % 2 ? '#2a4db5' : '#2547ab';
    });
    feltUrl = tile(4, 4, (x, y) => ((x * 3 + y * 5) % 7 === 0 ? '#0c7a3c' : (x + y * 2) % 5 === 0 ? '#08602f' : '#0a6d35'));
  }
  const HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
  function heartSvg(full) {
    let r = '';
    HEART.forEach((row, y) => { for (let x = 0; x < row.length; x++) if (row.charAt(x) === '#') r += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>'; });
    return '<svg class="gm-heart' + (full ? ' full' : '') + '" viewBox="0 0 7 6" width="17" height="15" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }

  /* ---------- persistence ---------- */
  const load = () => Object.assign({ best: {}, plays: 0 }, NM.store.get(KEY, {}));
  const persist = (s) => NM.store.set(KEY, s);

  let active = null; // only one game instance may exist

  function create(root) {
    makeTiles();
    const mobile = !!root.closest('.m-card');
    const G = {};
    const D = { dead: false, raf: 0, timers: new Set(), particles: [], casc: null, last: 0 };
    let store = load();

    root.innerHTML =
      '<div class="gm' + (mobile ? ' mob' : '') + '">' +
        '<div class="gm-felt" style="background-image:url(' + feltUrl + ')">' +
          '<div class="gm-timer" aria-hidden="true"><i></i></div>' +
          '<div class="gm-board" role="group" aria-label="Cards"></div>' +
          '<canvas class="gm-fx" aria-hidden="true"></canvas>' +
          '<div class="gm-float" aria-hidden="true"></div>' +
          '<div class="gm-note" aria-live="polite"></div>' +
          '<div class="gm-over"></div>' +
        '</div>' +
        '<div class="gm-status" role="status"><span class="gs-cell gs-score">Score: 0</span><span class="gs-cell gs-time">Time: 0:00</span><span class="gs-cell gs-lives"></span><span class="gs-cell gs-lvl">Level 1</span></div>' +
      '</div>';
    const gm = $('.gm', root), felt = $('.gm-felt', root), board = $('.gm-board', root), fx = $('.gm-fx', root);
    const over = $('.gm-over', root), noteEl = $('.gm-note', root), floatEl = $('.gm-float', root), timerEl = $('.gm-timer', root), timerFill = $('.gm-timer i', root);
    const sScore = $('.gs-score', root), sTime = $('.gs-time', root), sLives = $('.gs-lives', root), sLvl = $('.gs-lvl', root);
    const fctx = fx.getContext('2d');

    /* ----- helpers ----- */
    const later = (fn, ms) => { const id = setTimeout(() => { D.timers.delete(id); if (!D.dead) fn(); }, ms); D.timers.add(id); return id; };
    const clearTimers = () => { D.timers.forEach(clearTimeout); D.timers.clear(); };
    const isActive = () => document.visibilityState === 'visible' && root.isConnected && root.getClientRects().length > 0 && getComputedStyle(root).visibility !== 'hidden';
    const say = (t) => { noteEl.textContent = t; noteEl.classList.toggle('on', !!t); };

    function paintLives() { let s = ''; for (let i = 0; i < 3; i++) s += heartSvg(i < G.lives); sLives.innerHTML = s; }
    function paintStatus() {
      sLvl.textContent = G.cfg ? 'Level ' + (G.level + 1) + '/3 · ' + G.cfg.label : 'Career Match';
      paintLives();
    }
    function floatText(text, cls) {
      const el = h('<div class="gm-ft ' + (cls || '') + '"></div>');
      el.textContent = text;
      floatEl.appendChild(el);
      setTimeout(() => el.remove(), 1100);
    }
    function sparkles(el) {
      const r = el.getBoundingClientRect(), f = felt.getBoundingClientRect();
      const cx = r.left - f.left + r.width / 2, cy = r.top - f.top + r.height / 2;
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2, sp = 1.2 + Math.random() * 3.2;
        D.particles.push({ x: cx + (Math.random() - 0.5) * r.width * 0.6, y: cy + (Math.random() - 0.5) * r.height * 0.6, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2, life: 0, max: 520 + Math.random() * 380, s: 3 + Math.floor(Math.random() * 3), c: SPARK[(Math.random() * SPARK.length) | 0] });
      }
    }

    /* ----- card DOM ----- */
    function faceHtml(p, type) {
      if (type === 'project') {
        const corner = '<span class="gf-rank"><b>' + esc(p.name) + '</b>' + NM.sprites.html(p.icon) + '</span>';
        return '<div class="gf-corner tl">' + corner + '</div><div class="gf-pip">♦</div><div class="gf-corner br">' + corner + '</div>';
      }
      const k = Math.min(0.17, 0.86 / Math.max.apply(null, p.stat.split(' ').map((s) => s.length))).toFixed(3);
      return '<div class="gf-suit tl">♠</div><div class="gf-mid"><b style="font-size:calc(var(--cw) * ' + k + ')">' + esc(p.stat) + '</b><em>' + esc(p.sub) + '</em></div><div class="gf-suit br">♠</div>';
    }
    function cardEl(c, i) {
      const el = h('<div class="gcard down" data-i="' + i + '" role="button" tabindex="0" aria-label="Face-down card"><div class="gc-lift"><div class="gc-in"><div class="gc-face gc-back" style="background-image:url(' + backUrl + ')"></div><div class="gc-face gc-front ' + c.type + '">' + faceHtml(c.p, c.type) + '</div></div></div></div>');
      el.addEventListener('click', () => flip(i));
      el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(i); } });
      return el;
    }

    function layout() {
      const W = felt.clientWidth, H = felt.clientHeight;
      if (!W || !H) return;
      if (fx.width !== W || fx.height !== H) { fx.width = W; fx.height = H; }
      if (D.casc) { D.casc.cv.width = W; D.casc.cv.height = H; }
      if (!G.cfg) return;
      const { cols, rows } = G.cfg;
      const small = W < 420, gap = small ? 4 : 10;
      const aw = W - (small ? 14 : 28) - gap * (cols - 1), ah = H - 22 - 40 - gap * (rows - 1);
      const cw = Math.max(40, Math.floor(Math.min(aw / cols, (ah / rows) * (5 / 7))));
      board.style.setProperty('--cols', cols);
      board.style.setProperty('--cw', cw + 'px');
      board.style.setProperty('--ch', Math.round(cw * 1.4) + 'px');
      board.style.setProperty('--gap', gap + 'px');
    }
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(layout); ro.observe(felt); }

    /* ----- run / level lifecycle ----- */
    function freshRun(diff) {
      clearTimers();
      D.particles.length = 0;
      if (D.casc) { D.casc.cv.remove(); D.casc = null; }
      floatEl.innerHTML = ''; say('');
      Object.assign(G, { diff, base: DIFF[diff], level: 0, score: 0, shown: 0, lives: 3, lostLife: false, combo: 0, bestCombo: 0, missStreak: 0, attempts: 0, hits: 0, elapsed: 0, levelsCleared: 0, state: 'menu', busy: false, flipped: [], cards: [], cfg: null, timeLeft: 0, timeMax: 0, lastSec: -1 });
    }
    function startRun(diff) {
      freshRun(diff);
      store.plays += 1; persist(store);
      NM.analytics.track.game('play', { diff });
      startLevel(0);
    }
    function startLevel(n) {
      clearTimers();
      over.innerHTML = '';
      const base = DIFF[G.diff];
      G.level = n;
      G.cfg = base;
      G.pairsTotal = (base.cols * base.rows) / 2;
      G.matched = 0; G.combo = 0; G.missStreak = 0; G.busy = false; G.flipped = []; G.state = 'dealing';
      G.timeMax = Math.round((G.pairsTotal * base.sec + 15) * LEVEL_TIME[n]) * 1000;
      G.timeLeft = G.timeMax; G.lastSec = -1;
      const pick = shuffle(PAIRS).slice(0, G.pairsTotal);
      let cards = [];
      pick.forEach((p) => { cards.push({ p, type: 'project', pair: p.id }); cards.push({ p, type: 'outcome', pair: p.id }); });
      cards = shuffle(cards);
      board.innerHTML = '';
      say('');
      G.cards = cards.map((c, i) => Object.assign(c, { up: false, matched: false, el: cardEl(c, i) }));
      G.cards.forEach((c) => board.appendChild(c.el));
      paintStatus();
      layout();
      // deal one card at a time from the top of the table
      const f = felt.getBoundingClientRect();
      const deckX = f.left + f.width / 2, deckY = f.top - 60;
      G.cards.forEach((c, i) => {
        const r = c.el.getBoundingClientRect();
        c.el.style.setProperty('--dx', Math.round(deckX - (r.left + r.width / 2)) + 'px');
        c.el.style.setProperty('--dy', Math.round(deckY - (r.top + r.height / 2)) + 'px');
        c.el.style.setProperty('--rot', Math.round((Math.random() - 0.5) * 50) + 'deg');
        c.el.style.animationDelay = i * 70 + 'ms';
        c.el.classList.add('dealing');
      });
      later(() => {
        G.cards.forEach((c) => { c.el.classList.remove('dealing'); c.el.style.animationDelay = ''; });
        G.state = 'playing'; G.lastResolve = performance.now();
      }, G.cards.length * 70 + 560);
    }

    function flip(i) {
      if (G.state !== 'playing' || G.busy) return;
      const c = G.cards[i];
      if (!c || c.matched || c.up || G.flipped.length >= 2) return;
      c.up = true;
      c.el.classList.add('flipped');
      c.el.classList.remove('down');
      c.el.setAttribute('aria-label', c.type === 'project' ? c.p.name : c.p.stat + ' ' + c.p.sub);
      NM.sfx.play('mflip');
      G.flipped.push(c);
      if (G.flipped.length === 2) resolve();
    }

    function resolve() {
      G.busy = true;
      const a = G.flipped[0], b = G.flipped[1];
      G.attempts += 1;
      const now = performance.now();
      if (a.pair === b.pair) {
        const took = (now - G.lastResolve) / 1000;
        G.lastResolve = now;
        G.combo += 1; G.hits += 1; G.matched += 1; G.missStreak = 0;
        G.bestCombo = Math.max(G.bestCombo, G.combo);
        const speed = took <= 3 ? 50 : took <= 6 ? 20 : 0;
        G.score += (100 + speed) * Math.min(G.combo, 8);
        G.timeLeft = Math.min(G.timeMax, G.timeLeft + LEVEL_BONUS[G.level]);
        if (G.combo === 5) { NM.game.award('match:combo5', 0); NM.analytics.track.game('combo5'); }
        later(() => {
          a.el.classList.add('hit'); b.el.classList.add('hit');
          sparkles(a.el); sparkles(b.el);
          if (G.combo >= 2) { NM.sfx.play('mcombo', G.combo); floatText('COMBO x' + G.combo + '!', 'combo'); } else NM.sfx.play('mmatch');
          if (speed) floatText('+' + speed + ' SPEED', 'speed');
          say(a.p.note);
        }, 380);
        later(() => {
          a.matched = b.matched = true;
          a.el.classList.add('gone'); b.el.classList.add('gone');
          G.flipped = []; G.busy = false;
          if (G.matched === G.pairsTotal) levelClear();
        }, 760);
        later(() => { if (noteEl.textContent === a.p.note) say(''); }, 3200);
      } else {
        G.combo = 0; G.missStreak += 1; G.lastResolve = now;
        later(() => {
          a.el.classList.add('shake'); b.el.classList.add('shake');
          NM.sfx.play('mmiss');
          if (G.missStreak >= 2) { G.missStreak = 0; loseLife(); }
        }, 420);
        later(() => {
          a.el.classList.remove('shake', 'flipped'); b.el.classList.remove('shake', 'flipped');
          a.el.classList.add('down'); b.el.classList.add('down');
          a.up = b.up = false;
          a.el.setAttribute('aria-label', 'Face-down card'); b.el.setAttribute('aria-label', 'Face-down card');
          G.flipped = []; G.busy = false;
          if (G.lives <= 0) endRun('lives');
        }, 420 + LEVEL_PEEK[G.level]);
      }
    }

    function loseLife() {
      G.lives -= 1; G.lostLife = true;
      NM.sfx.play('mlife');
      paintLives();
      gm.classList.remove('shake'); void gm.offsetWidth; gm.classList.add('shake');
      setTimeout(() => gm.classList.remove('shake'), 480);
    }

    function levelClear() {
      G.state = 'between';
      const bonus = Math.round(G.timeLeft / 1000) * 5 + G.lives * 100;
      G.score += bonus; G.levelsCleared += 1;
      NM.game.award('match:L' + G.levelsCleared, 2 + G.levelsCleared);
      floatText('LEVEL CLEAR +' + bonus, 'combo');
      if (G.level < 2) {
        later(() => levelCard(G.level + 1), 1000);
      } else {
        later(winRun, 700);
      }
    }
    function levelCard(n) {
      over.innerHTML = '<div class="gm-levelcard"><b>LEVEL ' + (n + 1) + '</b><span>' + (n === 1 ? 'Shorter clock. Faster flip-backs.' : 'Final round. Make it count.') + '</span></div>';
      later(() => startLevel(n), 1800);
    }

    /* ----- win: the Solitaire cascade ----- */
    function faceOnCanvas(c, x, y, w, hh) {
      const cx = D.casc.ctx;
      cx.save();
      cx.translate(x, y);
      cx.fillStyle = '#fbf8ee'; cx.strokeStyle = '#2b2b35'; cx.lineWidth = 1.5;
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(0.5, 0.5, w - 1, hh - 1, 6); else cx.rect(0.5, 0.5, w - 1, hh - 1);
      cx.fill(); cx.stroke();
      cx.textBaseline = 'top';
      if (c.type === 'project') {
        cx.fillStyle = '#b3212d';
        cx.font = '700 ' + Math.round(w * 0.14) + 'px Inter, sans-serif';
        cx.fillText(c.p.name.split(' ')[0], 6, 6);
        cx.imageSmoothingEnabled = false;
        const img = D.casc.imgs[c.p.icon];
        if (img && img.complete) cx.drawImage(img, 6, 6 + w * 0.2, w * 0.3, w * 0.3);
        cx.font = Math.round(w * 0.5) + 'px sans-serif';
        cx.globalAlpha = 0.18; cx.fillText('♦', w * 0.3, hh * 0.32); cx.globalAlpha = 1;
      } else {
        cx.fillStyle = '#16162a';
        const words = c.p.stat.split(' ');
        const px = Math.min(0.17 * w, (0.86 * w) / Math.max.apply(null, words.map((s) => s.length)));
        cx.font = Math.round(px) + 'px "Press Start 2P", monospace';
        cx.textAlign = 'center';
        words.forEach((wd, i) => cx.fillText(wd, w / 2, hh * 0.38 + i * px * 1.3));
        cx.textAlign = 'left';
        cx.font = '600 ' + Math.round(w * 0.11) + 'px Inter, sans-serif';
        cx.fillText('♠', 6, 5);
      }
      cx.restore();
    }
    function winRun() {
      G.state = 'cascade';
      NM.sfx.play('mwin');
      const f = felt.getBoundingClientRect();
      const cv = document.createElement('canvas');
      cv.className = 'gm-casc'; cv.width = felt.clientWidth; cv.height = felt.clientHeight;
      felt.appendChild(cv);
      const imgs = {};
      G.cards.forEach((c) => { if (!imgs[c.p.icon]) { const im = new Image(); im.src = NM.sprites.url(c.p.icon, 4); imgs[c.p.icon] = im; } });
      const list = shuffle(G.cards).map((c, i) => {
        const r = c.el.getBoundingClientRect();
        return { c, x: r.left - f.left, y: r.top - f.top, w: r.width, h: r.height, vx: (Math.random() < 0.5 ? -1 : 1) * (1.4 + Math.random() * 2.4), vy: -2 - Math.random() * 3, at: i * 170, on: false };
      });
      D.casc = { cv, ctx: cv.getContext('2d'), list, t: 0, imgs, finished: false };
      cv.addEventListener('click', () => { if (D.casc && !D.casc.finished) D.casc.t = 1e9; });
    }
    function stepCascade(dt) {
      const C = D.casc;
      C.t += dt;
      let alive = 0;
      const k = dt / 16.67;
      C.list.forEach((o) => {
        if (!o.on) { if (C.t >= o.at) o.on = true; else { alive++; return; } }
        if (o.gone) return;
        o.vy += 0.5 * k;
        o.x += o.vx * k; o.y += o.vy * k;
        const floor = felt.clientHeight - o.h;
        if (o.y > floor) { o.y = floor; o.vy = -o.vy * 0.82; if (Math.abs(o.vy) < 0.8) o.vy = -0.9; }
        if (o.x < -o.w - 4 || o.x > felt.clientWidth + 4) { o.gone = true; return; }
        alive++;
        faceOnCanvas(o.c, Math.round(o.x), Math.round(o.y), o.w, o.h);
      });
      if (!C.finished && (alive === 0 || C.t > 7000)) {
        C.finished = true;
        later(() => endRun('win'), 450);
      }
    }

    /* ----- end ----- */
    function endRun(reason) {
      if (G.state === 'end') return;
      const win = reason === 'win';
      clearTimers();
      G.state = 'end';
      const prev = store.best[G.diff] || 0;
      const newBest = G.score > prev;
      if (newBest) { store.best[G.diff] = G.score; persist(store); }
      if (win) {
        if (G.diff === 'easy') NM.game.award('match:easy', 0);
        if (G.diff === 'hard') NM.game.award('match:hard', 0);
        if (!G.lostLife) NM.game.award('match:flawless', 0);
      }
      NM.analytics.track.game('end', { diff: G.diff, score: G.score, win, levels: G.levelsCleared });
      const acc = G.attempts ? Math.round((G.hits / G.attempts) * 100) : 0;
      const rank = RANKS[Math.min(3, G.levelsCleared)];
      const head = win ? 'YOU\'RE HIRED!' : reason === 'time' ? 'TIME\'S UP' : 'OUT OF HEARTS';
      over.innerHTML =
        '<div class="gm-dlg" role="dialog" aria-label="Game over"><div class="gm-dlg-bar"><span>Career Match — Results</span></div><div class="gm-dlg-body">' +
          '<h2 class="gm-title">' + head + '</h2>' +
          (newBest ? '<div class="gm-newbest">NEW BEST!</div>' : '') +
          '<div class="gm-rank">Rank: <b>' + rank + '</b></div>' +
          '<dl class="gm-stats"><dt>Score</dt><dd>' + G.score + '</dd><dt>Time played</dt><dd>' + mmss(G.elapsed) + '</dd><dt>Accuracy</dt><dd>' + acc + '%</dd><dt>Best (' + G.base.label + ')</dt><dd>' + (store.best[G.diff] || 0) + '</dd></dl>' +
          '<div class="gm-btns"><button type="button" class="wbtn def" data-a="again">Play Again</button><button type="button" class="wbtn" data-a="menu">Menu</button></div>' +
        '</div></div>';
      $('[data-a=again]', over).addEventListener('click', () => { NM.sfx.play('click'); startRun(G.diff); });
      $('[data-a=menu]', over).addEventListener('click', () => { NM.sfx.play('click'); showMenu(); });
      $('[data-a=again]', over).focus();
    }

    /* ----- start screen ----- */
    function showMenu(diff) {
      freshRun(diff || (G.diff) || 'normal');
      if (D.casc) { D.casc.cv.remove(); D.casc = null; }
      board.innerHTML = ''; G.cfg = null;
      let sel = G.diff;
      const bestLine = () => 'Best score (' + DIFF[sel].label + '): <b>' + (store.best[sel] || 0) + '</b>';
      over.innerHTML =
        '<div class="gm-dlg" role="dialog" aria-label="Career Match"><div class="gm-dlg-bar"><span>Career Match</span></div><div class="gm-dlg-body">' +
          '<h2 class="gm-title">CAREER MATCH</h2>' +
          '<p class="gm-how">Flip two cards and match each <b class="red">project ♦</b> to its <b>outcome ♠</b>. Chain matches for combos and be quick for bonus points. Two misses in a row cost a heart. Clear three levels to get hired.</p>' +
          '<div class="gm-diff" role="radiogroup" aria-label="Difficulty">' +
            Object.keys(DIFF).map((k) => '<button type="button" class="wbtn' + (k === sel ? ' on' : '') + '" role="radio" aria-checked="' + (k === sel) + '" data-d="' + k + '">' + DIFF[k].label + '<small>' + DIFF[k].cols + '×' + DIFF[k].rows + '</small></button>').join('') +
          '</div>' +
          '<p class="gm-best">' + bestLine() + '</p>' +
          '<div class="gm-btns"><button type="button" class="wbtn def" data-a="deal">Deal</button></div>' +
        '</div></div>';
      $$('.gm-diff .wbtn', over).forEach((b) => b.addEventListener('click', () => {
        sel = b.dataset.d; G.diff = sel;
        $$('.gm-diff .wbtn', over).forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on); });
        $('.gm-best', over).innerHTML = bestLine();
        NM.sfx.play('click');
      }));
      $('[data-a=deal]', over).addEventListener('click', () => { NM.sfx.play('click'); startRun(sel); });
      paintStatus();
    }

    /* ----- one loop: clock, score count-up, particles, cascade ----- */
    function frame(t) {
      if (D.dead) return;
      if (!root.isConnected) { destroy(); return; }
      D.raf = requestAnimationFrame(frame);
      const dt = Math.min(100, D.last ? t - D.last : 16);
      D.last = t;
      const live = isActive();
      if (live && G.state === 'playing') {
        G.timeLeft -= dt; G.elapsed += dt;
        if (G.timeLeft <= 0) { G.timeLeft = 0; endRun('time'); }
        const sec = Math.ceil(G.timeLeft / 1000);
        if (sec !== G.lastSec) { G.lastSec = sec; if (sec <= 10 && sec > 0) NM.sfx.play('tick'); }
      }
      if (G.cfg && G.state !== 'menu') {
        const frac = G.timeMax ? Math.max(0, G.timeLeft / G.timeMax) : 0;
        timerFill.style.width = (frac * 100).toFixed(1) + '%';
        const secLeft = G.timeLeft / 1000;
        timerEl.classList.toggle('red', secLeft <= 10 && G.state === 'playing');
        timerEl.classList.toggle('amber', secLeft > 10 && (secLeft <= 20 || frac < 0.35));
        sTime.textContent = 'Time: ' + mmss(G.timeLeft);
      } else { timerFill.style.width = '0'; sTime.textContent = 'Time: 0:00'; timerEl.className = 'gm-timer'; }
      // score counts up smoothly
      if (G.shown !== G.score) { G.shown += (G.score - G.shown) * Math.min(1, dt / 140); if (Math.abs(G.score - G.shown) < 1) G.shown = G.score; }
      sScore.textContent = 'Score: ' + Math.round(G.shown || 0);
      // particles
      if (D.particles.length || D.hadParticles) {
        fctx.clearRect(0, 0, fx.width, fx.height);
        D.hadParticles = D.particles.length > 0;
        D.particles = D.particles.filter((p) => {
          p.life += dt;
          if (p.life >= p.max) return false;
          p.vy += 0.06 * (dt / 16.67); p.x += p.vx * (dt / 16.67); p.y += p.vy * (dt / 16.67);
          fctx.globalAlpha = 1 - p.life / p.max;
          fctx.fillStyle = p.c;
          fctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
          return true;
        });
        fctx.globalAlpha = 1;
      }
      if (D.casc && !D.casc.finished) stepCascade(dt);
    }

    function destroy() {
      if (D.dead) return;
      D.dead = true;
      cancelAnimationFrame(D.raf);
      clearTimers();
      if (ro) ro.disconnect();
      if (active && active.destroy === destroy) active = null;
    }

    freshRun('normal');
    showMenu('normal');
    D.raf = requestAnimationFrame(frame);
    setTimeout(layout, 0);
    return { destroy, flip, G, startRun, endRun, showMenu };
  }

  defs.match = {
    title: 'Career Match', sprite: 'arcade', w: 720, h: 640, cls: 'gamewin',
    content(root) {
      if (active) active.destroy();
      active = create(root);
    },
  };
  // read-only peek for automated checks
  NM.match = { get game() { return active; } };
})();
