/* wm.js — tiny window manager: draggable, resizable, stackable, minimise/maximise, keyboard-closable. */
(function () {
  'use strict';
  const NM = window.NM;

  const MENU_H = 34;
  const DOCK_H = 96;
  const registry = {};
  const open = {}; // id -> { el, minimized, prev }
  let zTop = 100;
  let cascade = 0;

  function desktopEl() { return NM.$('#desktop'); }

  function clampPos(el) {
    const vw = window.innerWidth, vh = window.innerHeight;
    let x = parseFloat(el.style.left) || 0;
    let y = parseFloat(el.style.top) || 0;
    const w = el.offsetWidth;
    x = Math.min(Math.max(x, 90 - w), vw - 90);
    y = Math.min(Math.max(y, MENU_H), vh - 44);
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function activate(id) {
    Object.keys(open).forEach((k) => open[k].el.classList.toggle('active', k === id));
    if (open[id]) {
      open[id].el.style.zIndex = ++zTop;
      NM.emit('wm:focus', id);
    }
  }

  function build(id) {
    const def = registry[id];
    const el = NM.h(
      '<section class="win" role="dialog" aria-label="' + NM.esc(def.title) + '" tabindex="-1">' +
        '<header class="win-bar">' +
          '<div class="win-btns">' +
            '<button class="wb wb-close" aria-label="Close ' + NM.esc(def.title) + '" title="Close"></button>' +
            '<button class="wb wb-min" aria-label="Minimise" title="Minimise"></button>' +
            '<button class="wb wb-max" aria-label="Zoom" title="Zoom"></button>' +
          '</div>' +
          '<div class="win-title">' + NM.esc(def.title) + '</div>' +
          '<div class="win-spacer"></div>' +
        '</header>' +
        '<div class="win-body"></div>' +
        '<div class="win-resize" aria-hidden="true"></div>' +
      '</section>'
    );
    if (def.cls) el.classList.add(def.cls);
    return el;
  }

  function place(el, def) {
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = Math.min(def.w || 560, vw - 24);
    const h = Math.min(def.h || 460, vh - MENU_H - DOCK_H + 6);
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    const off = (cascade++ % 5) * 26;
    let x = def.x != null ? def.x : (vw - w) / 2 + off - 52;
    let y = def.y != null ? def.y : MENU_H + 22 + off;
    x = Math.max(8, Math.min(x, vw - w - 8));
    y = Math.max(MENU_H + 4, Math.min(y, vh - h - DOCK_H + 30));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function wire(id, el) {
    const bar = NM.$('.win-bar', el);
    let drag = null;

    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.wb')) return;
      if (el.classList.contains('maxed')) return;
      activate(id);
      drag = { dx: e.clientX - el.offsetLeft, dy: e.clientY - el.offsetTop };
      bar.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
    });
    bar.addEventListener('pointermove', (e) => {
      if (!drag) return;
      el.style.left = e.clientX - drag.dx + 'px';
      el.style.top = e.clientY - drag.dy + 'px';
      clampPos(el);
    });
    const end = (e) => {
      if (!drag) return;
      drag = null;
      el.classList.remove('dragging');
      try { bar.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('.wb')) toggleMax(id); });

    // resize
    const grip = NM.$('.win-resize', el);
    let rs = null;
    grip.addEventListener('pointerdown', (e) => {
      activate(id);
      rs = { x: e.clientX, y: e.clientY, w: el.offsetWidth, h: el.offsetHeight };
      grip.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    grip.addEventListener('pointermove', (e) => {
      if (!rs) return;
      el.style.width = Math.max(320, rs.w + e.clientX - rs.x) + 'px';
      el.style.height = Math.max(220, rs.h + e.clientY - rs.y) + 'px';
    });
    const rend = () => { rs = null; };
    grip.addEventListener('pointerup', rend);
    grip.addEventListener('pointercancel', rend);

    el.addEventListener('pointerdown', () => { if (!el.classList.contains('active')) activate(id); }, true);
    el.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(id); } });

    NM.$('.wb-close', el).addEventListener('click', () => close(id));
    NM.$('.wb-min', el).addEventListener('click', () => minimize(id));
    NM.$('.wb-max', el).addEventListener('click', () => toggleMax(id));
  }

  function toggleMax(id) {
    const o = open[id];
    if (!o) return;
    const el = o.el;
    if (el.classList.contains('maxed')) {
      el.classList.remove('maxed');
      Object.assign(el.style, o.prev);
    } else {
      o.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
      el.classList.add('maxed');
      el.style.left = '8px';
      el.style.top = MENU_H + 6 + 'px';
      el.style.width = window.innerWidth - 16 + 'px';
      el.style.height = window.innerHeight - MENU_H - DOCK_H + 8 + 'px';
    }
    NM.sfx.play('click');
  }

  function minimize(id) {
    const o = open[id];
    if (!o) return;
    o.minimized = true;
    o.el.classList.add('minimized');
    o.el.classList.remove('active');
    NM.sfx.play('close');
    NM.emit('wm:min', id);
  }

  function restore(id) {
    const o = open[id];
    if (!o) return;
    o.minimized = false;
    o.el.classList.remove('minimized');
    activate(id);
    o.el.focus({ preventScroll: true });
  }

  function close(id) {
    const o = open[id];
    if (!o) return;
    const def = registry[id];
    o.el.classList.add('closing');
    NM.sfx.play('close');
    const done = () => {
      if (def.onClose) def.onClose(o.el);
      o.el.remove();
      delete open[id];
      // hand focus to the next window down
      const next = Object.keys(open).filter((k) => !open[k].minimized).sort((a, b) => open[b].el.style.zIndex - open[a].el.style.zIndex)[0];
      if (next) activate(next);
      NM.emit('wm:close', id);
    };
    if (NM.reducedMotion()) done(); else setTimeout(done, 140);
  }

  NM.wm = {
    register(id, def) { registry[id] = def; },
    isOpen: (id) => !!open[id],
    isMinimized: (id) => !!(open[id] && open[id].minimized),
    openIds: () => Object.keys(open),
    get(id) { return open[id] ? open[id].el : null; },
    close,
    minimize,
    open(id, opts) {
      const def = registry[id];
      if (!def) return null;
      if (open[id]) {
        if (open[id].minimized) restore(id); else { activate(id); open[id].el.focus({ preventScroll: true }); }
        NM.emit('wm:refocus', id);
        return open[id].el;
      }
      const el = build(id);
      place(el, def);
      el.style.zIndex = ++zTop;
      desktopEl().appendChild(el);
      open[id] = { el, minimized: false };
      def.build(NM.$('.win-body', el), Object.assign({ id, win: el }, opts || {}));
      wire(id, el);
      activate(id);
      requestAnimationFrame(() => el.classList.add('shown'));
      el.focus({ preventScroll: true });
      NM.sfx.play('open');
      NM.emit('wm:open', id);
      return el;
    },
    toggleFromDock(id) {
      if (open[id] && !open[id].minimized && open[id].el.classList.contains('active')) minimize(id);
      else NM.wm.open(id);
    },
    closeAll() { Object.keys(open).forEach((id) => { open[id].el.remove(); delete open[id]; NM.emit('wm:close', id); }); },
    MENU_H,
    DOCK_H,
  };

  window.addEventListener('resize', () => {
    Object.keys(open).forEach((id) => { if (!open[id].el.classList.contains('maxed')) clampPos(open[id].el); });
  });
})();
