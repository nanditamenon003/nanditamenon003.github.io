/* progress.js — makes the exploration bar legible: a live "N / 8 explored" count, a padlock that opens at 100%,
   a checklist tooltip (hover on desktop, tap-to-open popover on touch) and milestone toasts at 25/50/75/100%.
   Shared by the desktop pill (#quest) and the mobile header (#m-prog). */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, h, esc } = NM;
  const D = NM.data;

  /* ---------- pixel padlock (8x9 grid, drawn as SVG rects so it stays crisp) ---------- */
  const PADLOCK = {
    locked: ['..####..', '.##..##.', '.#....#.', '.#....#.', '########', '#bbbbbb#', '#bbkkbb#', '#bbkkbb#', '########'],
    open: ['..####..', '.##..##.', '.#......', '.#......', '########', '#bbbbbb#', '#bbkkbb#', '#bbkkbb#', '########'],
  };
  const PIXEL_CLASS = { '#': 'n', b: 'b', k: 'k' };
  function padlockSvg(open) {
    let rects = '';
    PADLOCK[open ? 'open' : 'locked'].forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const c = row.charAt(x);
        if (c === '.') { x++; continue; }
        let e = x;
        while (e < row.length && row.charAt(e) === c) e++;
        rects += '<rect class="' + PIXEL_CLASS[c] + '" x="' + x + '" y="' + y + '" width="' + (e - x) + '" height="1"/>';
        x = e;
      }
    });
    return '<svg class="padlock' + (open ? ' open' : '') + '" viewBox="0 0 8 9" width="16" height="18" shape-rendering="crispEdges" aria-hidden="true">' + rects + '</svg>';
  }

  /* ---------- milestone toasts: one at a time, each fires once per session ---------- */
  const MILESTONES = [
    { at: 25, text: '25% explored — keep going, there\'s a hidden folder somewhere', sprite: 'star' },
    { at: 50, text: 'Halfway there — something unlocks at 100%', sprite: 'star' },
    { at: 75, text: '75% — almost there, one or two left', sprite: 'star' },
    { at: 100, text: '100% — Glitch unlocked. Go find it.', sprite: 'glitch' },
  ];
  const pct = () => { const p = NM.game.progress(); return p.total ? (p.done / p.total) * 100 : 0; };
  let fired = {};
  // milestones already passed before this session started (saved progress) don't replay
  function baseline() {
    fired = {};
    const c = pct();
    MILESTONES.forEach((m) => { if (c >= m.at) fired[m.at] = true; });
  }
  baseline();

  const queue = [];
  let showing = false;
  let wrap = null;
  function next() {
    const m = queue.shift();
    if (!m) { showing = false; return; }
    showing = true;
    if (!wrap) { wrap = h('<div class="ms-wrap" aria-live="polite"></div>'); document.body.appendChild(wrap); }
    const el = h('<div class="ms-toast" role="status"><div class="ms-bar"><i></i><i></i><span>SYSTEM</span></div><div class="ms-body"><span class="ms-ico"></span><span class="ms-txt"></span></div></div>');
    $('.ms-ico', el).appendChild(NM.sprites.img(m.sprite));
    $('.ms-txt', el).textContent = m.text;
    wrap.appendChild(el);
    NM.sfx.play('chime');
    requestAnimationFrame(() => el.classList.add('in'));
    setTimeout(() => {
      el.classList.remove('in');
      setTimeout(() => { el.remove(); next(); }, 350);
    }, 3000);
  }
  function checkMilestones() {
    const c = pct();
    MILESTONES.forEach((m) => { if (c >= m.at && !fired[m.at]) { fired[m.at] = true; queue.push(m); } });
    if (!showing) next();
  }
  NM.on('progress', checkMilestones);
  NM.on('gamereset', () => { queue.length = 0; baseline(); });

  /* ---------- the bar itself: count, padlock, checklist popover ---------- */
  // host: the pill; o: { pips, lock, count (selectors inside host), place: 'up' | 'down', unlockedTip }
  function mount(host, o) {
    const pips = $(o.pips, host), lock = $(o.lock, host), count = $(o.count, host);
    const pop = h('<div class="qpop ' + o.place + '" role="dialog" aria-label="What is left to explore"></div>');
    host.appendChild(pop);
    const canHover = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    let open = false, pinned = false, tipTimer = 0, lastDone = NM.game.progress().done;

    function renderList() {
      const p = NM.game.progress();
      const groups = [{ label: 'Projects', ids: D.WORKS.filter((id) => !D.works[id].parent) }];
      Object.keys(D.folders).forEach((f) => groups.push({ label: D.folders[f].label, ids: D.folders[f].children }));
      let html = '<div class="qpop-h"><b>' + p.done + ' of ' + p.total + ' explored</b><span>' + (canHover ? 'click' : 'tap') + ' one to open it</span></div>';
      groups.forEach((g) => {
        html += '<div class="qpop-g"><em>' + esc(g.label) + '</em>';
        g.ids.forEach((id) => {
          const done = NM.game.isExplored(id);
          html += '<button type="button" class="qi ' + (done ? 'done' : 'todo') + '" data-id="' + id + '"><i class="ck" aria-hidden="true">' + (done ? '✓' : '') + '</i><span>' + esc(D.works[id].label) + '</span></button>';
        });
        html += '</div>';
      });
      html += '<div class="qpop-f">' + (NM.game.glitch ? esc(o.unlockedTip) : 'Every project and every folder card counts — a folder on its own doesn\'t. Explore all ' + p.total + ' to unlock a final reward.') + '</div>';
      pop.innerHTML = html;
    }

    function paint() {
      const p = NM.game.progress();
      const gained = p.done > lastDone;
      lastDone = p.done;
      pips.innerHTML = '';
      for (let i = 0; i < p.total; i++) pips.appendChild(h('<i class="' + (i < p.done ? 'f' : '') + (gained && i === p.done - 1 ? ' new' : '') + '"></i>'));
      if (gained) { host.classList.remove('gain'); void host.offsetWidth; host.classList.add('gain'); setTimeout(() => host.classList.remove('gain'), 1200); }
      count.textContent = 'PORTFOLIO EXPLORED — ' + p.done + '/' + p.total;
      const unlocked = NM.game.glitch;
      lock.innerHTML = padlockSvg(unlocked) + '<span class="lock-tip" role="tooltip">' + esc(unlocked ? o.unlockedTip : 'Explore everything to unlock') + '</span>';
      lock.classList.toggle('unlocked', unlocked);
      lock.setAttribute('aria-label', unlocked ? 'Unlocked' : 'Locked. Explore everything to unlock');
      if (open) renderList();
    }

    function hideTip() { lock.classList.remove('tip-on'); clearTimeout(tipTimer); }
    function showTip() { lock.classList.add('tip-on'); clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, 2600); }
    function setOpen(v, pin) {
      const was = open;
      open = v;
      pinned = v ? (pin || pinned) : false;
      if (v === was) return;
      host.classList.toggle('open', v);
      host.setAttribute('aria-expanded', String(v));
      if (v) { renderList(); hideTip(); }
    }
    function openItem(id) {
      const w = D.works[id];
      // on the stacked mobile layout folder cards live inside their folder's card
      NM.openApp(NM.mobileActive && w && w.parent ? w.parent : id);
    }

    host.addEventListener('click', (e) => {
      const item = e.target.closest('.qi');
      if (item) { NM.sfx.play('click'); setOpen(false); openItem(item.dataset.id); return; }
      if (e.target.closest('.qpop')) return;
      if (e.target.closest('.quest-lock')) { setOpen(false); showTip(); return; }
      if (open && pinned) setOpen(false);
      else { NM.sfx.play('click'); setOpen(true, true); }
    });
    host.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) { setOpen(false); host.focus(); }
      else if ((e.key === 'Enter' || e.key === ' ') && e.target === host) { e.preventDefault(); host.click(); }
    });
    document.addEventListener('click', (e) => { if (pinned && !host.contains(e.target)) setOpen(false); });
    if (canHover) {
      host.addEventListener('mouseover', (e) => { if (!pinned) setOpen(!e.target.closest('.quest-lock')); });
      host.addEventListener('mouseleave', () => { if (!pinned) setOpen(false); });
    }

    NM.on('progress', paint);
    NM.on('glitch', paint);
    paint();
    return { paint };
  }

  NM.progressUI = { mount, padlockSvg };
})();
