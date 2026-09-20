/* core.js — namespace, tiny helpers, safe storage, event bus */
(function () {
  'use strict';

  const NM = (window.NM = window.NM || {});

  NM.$ = (sel, root) => (root || document).querySelector(sel);
  NM.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // Build an element from an HTML string (content is all authored by us, never user input)
  NM.h = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  NM.esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // localStorage that never throws (private windows, blocked storage) and degrades to memory
  const mem = {};
  NM.store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) return JSON.parse(raw);
      } catch (e) { /* fall through */ }
      return key in mem ? mem[key] : fallback;
    },
    set(key, val) {
      mem[key] = val;
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* memory only */ }
    },
    remove(key) {
      delete mem[key];
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    },
  };
  NM.session = {
    get(key) { try { return sessionStorage.getItem(key); } catch (e) { return mem['s:' + key] || null; } },
    set(key, v) { mem['s:' + key] = v; try { sessionStorage.setItem(key, v); } catch (e) { /* ignore */ } },
  };

  // Event bus
  const handlers = {};
  NM.on = (evt, fn) => { (handlers[evt] = handlers[evt] || []).push(fn); };
  NM.emit = (evt, payload) => { (handlers[evt] || []).forEach((fn) => { try { fn(payload); } catch (e) { console.error(e); } }); };

  NM.isMobile = () => window.matchMedia('(max-width: 767px)').matches;
  NM.reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  NM.fmtTime = (secs) => {
    secs = Math.max(0, Math.round(secs));
    const m = Math.floor(secs / 60), s = secs % 60;
    return m + 'm ' + String(s).padStart(2, '0') + 's';
  };

  NM.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
})();
