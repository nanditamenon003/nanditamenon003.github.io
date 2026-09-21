/* main.js — boot flow, desktop assembly, personalisation, gamification UI. */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;
  const D = NM.data;

  // Desktop: two projects + two folders on the left; Resume and About on the right.
  const LEFT_DEFAULT = ['blackfungus', 'instructor', 'casecomps', 'experience'];
  const RIGHT = ['resume', 'about'];
  const DOCK = ['ama', 'recruiter', 'activity', 'achievements', 'contact']; // the hidden Glitch folder joins the end of the dock once unlocked

  const META = {
    blackfungus: { label: 'Black Fungus Detection', sprite: 'microscope', tip: 'Deep learning · Inception V3: 98.87% train / 98.25% test' },
    instructor: { label: 'Instructor Aid System', sprite: 'gradebook', tip: 'A gradebook app for teachers' },
    casecomps: { label: 'Case Comps', sprite: 'podium', tip: 'Brand Alchemy · Marketing Bowl · Prodyssey' },
    experience: { label: 'Experience & Research', sprite: 'cabinet', tip: 'Internship, research & client work' },
    resume: { label: 'Resume.pdf', sprite: 'pdf', tip: 'Download the one-page CV' },
    about: { label: 'About_me.md', sprite: 'about', tip: 'The short story' },
    glitch: { label: 'Glitch', sprite: 'glitch', tip: 'You found the last level' },
    ama: { label: 'Messages', sprite: 'chat', tip: 'Ask me anything' },
    recruiter: { label: 'Recruiter Mode', sprite: 'gear', tip: 'What are you hiring for?' },
    activity: { label: 'Activity Monitor', sprite: 'monitor', tip: 'Live analytics' },
    achievements: { label: 'Achievements', sprite: 'trophy', tip: 'Badges & progress' },
    contact: { label: 'Contact', sprite: 'mail', tip: 'Email · LinkedIn · GitHub' },
  };
  NM.meta = META;

  // XP for opening a window that is NOT a piece of work (folders earn a token amount; their cards earn the real XP)
  const XP_ON_OPEN = { casecomps: 2, experience: 2, about: 3, contact: 3, activity: 5, achievements: 2, glitch: 10, ama: 2, recruiter: 2 };
  // XP for each piece of work, once
  const WORK_XP = { blackfungus: 8, instructor: 8, brand: 8, bowl: 8, prodyssey: 8, sip: 6, sirp: 6, gcl: 6 };

  let role = null;
  let built = false;

  /* ---------- window registry ---------- */
  Object.keys(NM.apps.defs).forEach((id) => {
    const d = NM.apps.defs[id];
    NM.wm.register(id, { title: d.title, w: d.w, h: d.h, cls: d.cls, build: (body, ctx) => d.content(body, ctx) });
  });

  /* ---------- global actions ---------- */
  NM.currentRole = () => role;

  NM.downloadCV = function (from) {
    const a = document.createElement('a');
    a.href = D.person.resume;
    a.download = 'Nandita_Menon_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    NM.analytics.track.cv();
    if (NM.game.award('cv', 8)) NM.toast({ title: 'Resume downloaded', body: '+8 XP · thanks for the interest!', sprite: 'pdf' });
    else NM.toast({ title: 'Resume downloaded', body: 'One page, straight to your Downloads.', sprite: 'pdf' });
    NM.sfx.play('chime');
  };

  // One piece of work was opened (a project window, or a card inside a folder).
  // This is the single place that feeds analytics "projects clicked", XP and exploration progress.
  NM.workOpened = function (id) {
    if (!D.works[id]) return;
    NM.analytics.track.work(id);
    NM.game.award('work:' + id, WORK_XP[id] || 6);
    NM.game.markExplored(id);
  };

  NM.openApp = async function (id) {
    if (NM.mobileActive) { NM.mobile.show(id); return; }
    if (id === 'resume') { NM.downloadCV('desktop'); return; }
    if (id === 'glitch' && !NM.game.glitch) return;
    // a card inside a folder (e.g. 'brand'): open its folder and show that card
    const w = D.works[id];
    if (w && w.parent) {
      if (NM.wm.isOpen(w.parent)) { NM.wm.open(w.parent); NM.emit('folder:show', { folder: w.parent, card: id }); }
      else NM.wm.open(w.parent, { card: id });
      return;
    }
    if (id === 'blackfungus' && !NM.wm.isOpen(id)) await NM.apps.scan();
    NM.wm.open(id);
  };

  NM.toast = function (o) {
    const box = $('#toasts');
    if (!box) return;
    const t = h('<div class="toast ' + (o.kind || '') + '" role="status"><span class="t-ico"></span><div><b></b><span class="t-body"></span></div></div>');
    if (o.sprite) $('.t-ico', t).appendChild(NM.sprites.img(o.sprite));
    $('b', t).textContent = o.title;
    $('.t-body', t).textContent = o.body || '';
    box.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, o.ms || 3800);
  };

  /* ---------- stage switching ---------- */
  function setStage(s) {
    document.body.dataset.stage = s;
    $('#landing').hidden = s !== 'landing';
    $('#boot').hidden = s !== 'boot';
    $('#desktop').hidden = s !== 'desktop';
    $('#mobile').hidden = s !== 'mobile';
  }

  /* ---------- clouds ---------- */
  function fillClouds(el, specs) {
    specs.forEach((s) => {
      const i = new Image();
      i.src = NM.sprites.url('cloud', 4);
      i.alt = '';
      i.className = 'cloud px';
      i.style.cssText = 'top:' + s.top + '%;width:' + s.w + 'px;opacity:' + s.o + ';animation-duration:' + s.d + 's;animation-delay:-' + s.delay + 's';
      el.appendChild(i);
    });
  }

  /* ---------- desktop icons ---------- */
  function makeIcon(id, cls) {
    const m = META[id];
    const b = h('<button type="button" class="dicon ' + (cls || '') + '" data-app="' + id + '" title="' + esc(m.tip) + '"><span class="dicon-img"></span><span class="dicon-label"></span><i class="tick" aria-hidden="true">✓</i></button>');
    $('.dicon-img', b).appendChild(NM.sprites.img(m.sprite));
    $('.dicon-label', b).textContent = m.label;
    b.setAttribute('aria-label', m.label + ' — ' + m.tip);
    b.addEventListener('click', () => { NM.sfx.play('click'); NM.openApp(id); });
    return b;
  }

  function renderLeft() {
    const saved = NM.store.get('nm_order', null);
    // ignore a saved order from an older layout
    const valid = saved && saved.length === LEFT_DEFAULT.length && LEFT_DEFAULT.every((id) => saved.indexOf(id) > -1);
    const order = valid ? saved : LEFT_DEFAULT;
    const col = $('#icons-left');
    col.innerHTML = '';
    order.forEach((id) => col.appendChild(makeIcon(id)));
  }

  function renderRight() {
    const col = $('#icons-right');
    col.innerHTML = '';
    RIGHT.forEach((id) => col.appendChild(makeIcon(id)));
  }

  function renderDock() {
    const dock = $('#dock');
    dock.innerHTML = '';
    DOCK.forEach((id) => dock.appendChild(makeDockItem(id)));
    if (NM.game.glitch) addGlitchDock(false);
  }

  function makeDockItem(id) {
    const m = META[id];
    const b = h('<button type="button" class="dock-item" data-app="' + id + '" aria-label="' + esc(m.label) + '"><span class="dock-tip"></span><span class="dock-img"></span><i class="run" aria-hidden="true"></i></button>');
    $('.dock-tip', b).textContent = m.label;
    $('.dock-img', b).appendChild(NM.sprites.img(m.sprite));
    b.title = m.tip;
    b.addEventListener('click', () => {
      NM.sfx.play('click');
      if (NM.wm.isOpen(id) && id !== 'blackfungus') NM.wm.toggleFromDock(id); else NM.openApp(id);
    });
    return b;
  }

  // The hidden Glitch folder: appears at the end of the dock (after a divider) once all 8 works are explored
  function addGlitchDock(fanfare) {
    const dock = $('#dock');
    if (!dock || $('[data-app="glitch"]', dock)) return;
    dock.appendChild(h('<i class="dock-sep glitch-sep" aria-hidden="true"></i>'));
    const b = makeDockItem('glitch');
    b.classList.add('glitchy');
    if (fanfare || !NM.game.hasBadge('glitchfound')) b.classList.add('fresh'); // pulses until first opened
    dock.appendChild(b);
    refreshRunning();
  }

  function removeGlitchDock() {
    $$('#dock .glitch-sep, #dock [data-app="glitch"]').forEach((e) => e.remove());
  }

  function refreshRunning() {
    $$('.dock-item, .dicon').forEach((el) => {
      const id = el.dataset.app;
      el.classList.toggle('running', NM.wm.isOpen(id));
    });
  }

  // A desktop icon shows a tick once everything behind it has been explored
  // (a project: itself; a folder: all of its cards).
  function refreshExploredTicks() {
    $$('.dicon').forEach((el) => {
      const id = el.dataset.app;
      const f = D.folders[id];
      const done = f ? f.children.every((c) => NM.game.isExplored(c)) : NM.game.isExplored(id);
      el.classList.toggle('done', done);
    });
  }

  /* ---------- clock, xp, progress ---------- */
  function tickClock() {
    const d = new Date();
    $('#mb-clock').textContent = d.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  }

  function paintXP(pop) {
    const xp = NM.game.xp, lv = NM.game.level;
    const bar = $('#xp-bar');
    if (!bar.childElementCount) for (let i = 0; i < 10; i++) bar.appendChild(document.createElement('i'));
    $$('i', bar).forEach((seg, i) => seg.classList.toggle('f', xp >= (i + 1) * 10 - 4));
    $('#xp-lv').textContent = lv >= 5 ? 'MAX' : 'LV' + lv;
    $('#xp-pct').textContent = Math.round((xp / NM.game.MAX_XP) * 100) + '%';
    if (pop) {
      const p = $('#xp-pop');
      p.textContent = '+' + pop;
      p.classList.remove('go'); void p.offsetWidth; p.classList.add('go');
    }
  }

  function paintProgress() {
    const pr = NM.game.progress();
    const pips = $('#quest-pips');
    pips.innerHTML = '';
    for (let i = 0; i < pr.total; i++) pips.appendChild(h('<i class="' + (i < pr.done ? 'f' : '') + '"></i>'));
    $('#quest-n').textContent = 'Explored ' + pr.done + '/' + pr.total;
    let hint = '';
    if (NM.game.glitch) hint = '★ Glitch unlocked';
    else if (pr.done === pr.total - 1) hint = 'one more…';
    $('#quest-hint').textContent = hint;
    $('#quest').title = pr.done + ' of ' + pr.total + ' explored. Every project and every folder card counts (a folder itself does not). Explore them all to unlock a final reward.';
    refreshExploredTicks();
  }

  NM.on('xp', (e) => {
    paintXP(e.delta);
    if (e.reset) return;
    if (e.leveledUp) {
      NM.sfx.play('levelup');
      NM.toast({ title: 'LEVEL UP!', body: e.level >= 5 ? 'System usage at MAX' : 'You reached level ' + e.level, sprite: 'star', kind: 'level' });
    }
  });
  NM.on('badge', (b) => {
    NM.sfx.play('chime');
    NM.toast({ title: 'Achievement unlocked', body: b.name + ' — ' + b.desc, sprite: b.sprite, kind: 'ach', ms: 4600 });
  });
  NM.on('progress', paintProgress);
  NM.on('glitch', () => {
    NM.sfx.play('unlock');
    addGlitchDock(true);
    paintProgress();
    NM.toast({ title: 'Glitch unlocked ★', body: 'A hidden folder just appeared at the end of the dock.', sprite: 'glitch', kind: 'ach', ms: 6500 });
    say('You explored everything. Something just appeared at the end of the dock…', 7500);
  });
  NM.on('gamereset', () => { removeGlitchDock(); if (NM.wm.isOpen('glitch')) NM.wm.close('glitch'); });

  /* ---------- personalisation (Recruiter Mode) ---------- */
  function setSticky(text) {
    const p = $('#sticky-text');
    p.classList.add('swap');
    setTimeout(() => { p.textContent = text; p.classList.remove('swap'); }, 170);
  }

  function applyGlow() {
    const r = role && D.roles[role];
    $$('.dicon, .dock-item').forEach((el) => {
      const id = el.dataset.app;
      const on = !!(r && r.glow.indexOf(id) > -1);
      el.classList.toggle('glow', on);
      // only desktop icons dim; the dock stays fully usable
      el.classList.toggle('dim', !!(r && !on && el.classList.contains('dicon') && id !== 'resume' && id !== 'about'));
    });
    const tag = $('#mb-mode');
    tag.hidden = !r;
    if (r) tag.textContent = 'Hiring: ' + r.label;
  }

  NM.personalize = function (cat) {
    role = cat && D.roles[cat] ? cat : null;
    if (role) {
      const r = D.roles[role];
      NM.analytics.track.recruiter(role);
      NM.game.award('role:any', 6);
      NM.game.award('role:' + role, 2);
      NM.agent.setRole(role);
      setSticky(r.sticky);
      say('Hiring for ' + r.label + '? The glowing icons are my best fit.', 6000);
      NM.sfx.play('chime');
    } else {
      NM.agent.clearRole();
      setSticky(D.person.tagline);
      NM.sfx.play('click');
    }
    if (built) applyGlow();
    if (NM.mobileActive && NM.mobile.applyRole) NM.mobile.applyRole(role);
  };

  // The "Apply" button in the Activity Monitor: {icons, cards} computed from click data
  NM.on('reorder', (plan) => {
    const order = plan.icons.filter((id) => LEFT_DEFAULT.indexOf(id) > -1);
    LEFT_DEFAULT.forEach((id) => { if (order.indexOf(id) === -1) order.push(id); });
    NM.store.set('nm_order', order);
    NM.store.set('nm_cardorder', plan.cards);
    renderLeft();
    applyGlow();
    refreshRunning();
    refreshExploredTicks();
    NM.toast({ title: 'Optimisation applied', body: META[order[0]].label + ' moved to the top-left icon slot; folder cards re-ordered by clicks (applies next time a folder opens).', sprite: 'star', ms: 5200 });
  });

  /* ---------- avatar ---------- */
  const HINTS = [
    'Psst — try Recruiter Mode in the dock.',
    'Stuck? Ask the assistant in Messages.',
    'Open every project and folder card — finishing them unlocks something.',
    'The speaker up top turns on 8-bit sound.',
    'The XP bar fills as you explore.',
  ];
  let hintN = 0, sayTimer = null;
  function say(text, ms) {
    const el = $('#avatar-say');
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => { el.hidden = true; }, ms || 5000);
  }

  /* ---------- sound toggle ---------- */
  function paintSound(on) {
    const b = $('#mb-sound');
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', on ? 'Sound is on. Turn off' : 'Sound is off. Turn on 8-bit sounds');
    $('#mb-sound-t').textContent = on ? 'SND ON' : 'SND OFF';
    b.classList.toggle('on', on);
  }
  NM.on('sound', paintSound);

  /* ---------- window events ---------- */
  NM.on('wm:open', (id) => {
    NM.analytics.track.windowOpen(id);
    if (XP_ON_OPEN[id]) NM.game.award('open:' + id, XP_ON_OPEN[id]);
    if (D.works[id]) NM.workOpened(id);     // a standalone project window (Black Fungus, Instructor Aid)
    if (id === 'glitch') { const gi = $('.dock-item[data-app="glitch"]'); if (gi) gi.classList.remove('fresh'); }
    refreshRunning();
  });
  NM.on('wm:close', refreshRunning);
  NM.on('wm:min', refreshRunning);
  NM.on('wm:focus', refreshRunning);

  /* ---------- build the desktop once ---------- */
  function buildDesktop() {
    if (built) return;
    built = true;
    fillClouds($('#desktop .clouds.far'), [
      { top: 12, w: 220, o: 0.55, d: 170, delay: 20 },
      { top: 34, w: 180, o: 0.45, d: 210, delay: 120 },
      { top: 58, w: 200, o: 0.5, d: 190, delay: 60 },
    ]);
    fillClouds($('#desktop .clouds.near'), [
      { top: 20, w: 330, o: 0.9, d: 110, delay: 40 },
      { top: 48, w: 380, o: 0.85, d: 140, delay: 95 },
      { top: 70, w: 300, o: 0.8, d: 125, delay: 10 },
    ]);
    $('.mb-logo').appendChild(NM.sprites.img('star'));
    renderLeft();
    renderRight();
    renderDock();
    paintXP();
    paintProgress();
    paintSound(NM.sfx.enabled);
    tickClock();
    setInterval(tickClock, 20000);
    refreshRunning();
    applyGlow();

    $('#mb-sound').addEventListener('click', () => NM.sfx.toggle());
    $('#mb-xp').addEventListener('click', () => NM.openApp('achievements'));
    $('#avatar-btn').addEventListener('click', () => { NM.sfx.play('click'); say(HINTS[hintN++ % HINTS.length], 5200); });

    // saved progress may already qualify for the Glitch folder (e.g. progress saved before this layout)
    NM.game.recheck();
  }

  /* ---------- boot ---------- */
  const BOOT_LINES = [
    '> compiling nandita.exe ...',
    '> debugging career.js ...... 0 errors, 2 warnings',
    '> warning: too many ideas per minute',
    '> linking tech + brand strategy',
    '> loading pixel assets (16x16)',
    '> system upgrade complete. welcome.',
  ];

  function runBoot() {
    return new Promise((resolve) => {
      setStage('boot');
      const log = $('#boot-log'), fill = $('#boot-fill');
      log.textContent = '';
      fill.style.width = '0%';
      let done = false, i = 0, timer;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        document.removeEventListener('keydown', finish);
        $('#boot').removeEventListener('click', finish);
        resolve();
      };
      document.addEventListener('keydown', finish);
      $('#boot').addEventListener('click', finish);
      $('#boot-skip').addEventListener('click', finish);
      NM.sfx.play('boot');
      const step = () => {
        if (done) return;
        if (i >= BOOT_LINES.length) { timer = setTimeout(finish, 260); return; }
        log.textContent += BOOT_LINES[i] + '\n';
        i++;
        fill.style.width = Math.round((i / BOOT_LINES.length) * 100) + '%';
        NM.sfx.play('tick');
        timer = setTimeout(step, NM.reducedMotion() ? 60 : 360);
      };
      step();
    });
  }

  function enterDesktop() {
    buildDesktop();
    setStage('desktop');
    NM.game.award('boot', 5);
    NM.sfx.play('open');
    setTimeout(() => { if (!NM.wm.openIds().length) say('Hi! Try Recruiter Mode in the dock — or just start clicking.', 7000); }, 3500);
  }

  async function start() {
    if (NM.isMobile()) {
      NM.mobileActive = true;
      NM.mobile.build();
      setStage('mobile');
      NM.game.award('boot', 5);
      window.scrollTo(0, 0);
      return;
    }
    $('#landing').classList.add('leaving');
    await NM.sleep(NM.reducedMotion() ? 0 : 220);
    await runBoot();
    enterDesktop();
    $('#landing').classList.remove('leaving');
  }

  /* ---------- landing wiring ---------- */
  function initLanding() {
    $('#enter').addEventListener('click', () => { NM.sfx.play('click'); start(); });
    $('#l-cv').addEventListener('click', () => NM.downloadCV('landing'));
    $('#l-in').addEventListener('click', () => NM.analytics.track.contact('linkedin'));
    $('#l-gh').addEventListener('click', () => NM.analytics.track.contact('github'));
    $('#l-em').addEventListener('click', () => NM.analytics.track.contact('email'));
    fillClouds($('#landing .clouds'), [
      { top: 8, w: 300, o: 0.8, d: 120, delay: 30 },
      { top: 40, w: 240, o: 0.6, d: 160, delay: 90 },
      { top: 76, w: 340, o: 0.7, d: 140, delay: 60 },
    ]);
  }

  function init() {
    // ?reset wipes saved progress/analytics so a presentation can start clean
    if (/[?&]reset\b/.test(location.search)) {
      ['nm_analytics_v1', 'nm_game_v1', 'nm_order', 'nm_cardorder'].forEach((k) => NM.store.remove(k));
      try { sessionStorage.removeItem('nm_counted'); } catch (e) { /* ignore */ }
      history.replaceState(null, '', location.pathname + location.hash);
      location.reload();
      return;
    }
    NM.sprites.installCursors();
    NM.analytics.init();
    initLanding();
    if (location.hash === '#desktop') { // dev / demo shortcut: skip landing and boot
      if (NM.isMobile()) start(); else enterDesktop();
    } else setStage('landing');
    // dev hook for quick verification from the console
    NM.debug = { sprites: NM.sprites.validate };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
