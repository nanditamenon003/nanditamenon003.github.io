/* sfx.js — 8-bit sound pack synthesised live with the Web Audio API (no audio files).
   Muted by default; the visitor opts in with the speaker toggle in the menu bar. */
(function () {
  'use strict';
  const NM = window.NM;

  let ctx = null;
  let master = null;
  let enabled = false;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    return ctx;
  }

  function tone(freq, dur, opts) {
    opts = opts || {};
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + (opts.when || 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = opts.type || 'square';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
    const vol = opts.vol == null ? 0.07 : opts.vol;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function noise(dur, opts) {
    opts = opts || {};
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + (opts.when || 0);
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = opts.freq || 2600;
    const g = c.createGain();
    g.gain.value = opts.vol || 0.12;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }

  function seq(notes, step, opts) {
    notes.forEach((n, i) => tone(n, opts && opts.len ? opts.len : step * 1.4, Object.assign({}, opts, { when: i * step })));
  }

  const SOUNDS = {
    click() { tone(880, 0.05, { vol: 0.05 }); },
    open() { seq([523, 784], 0.06, { vol: 0.06 }); },
    close() { seq([784, 523], 0.06, { vol: 0.05 }); },
    chime() { seq([988, 1319, 1568], 0.09, { type: 'triangle', vol: 0.09, len: 0.22 }); },
    levelup() { seq([523, 659, 784, 1047, 1319, 1568], 0.075, { vol: 0.07, len: 0.14 }); },
    boot() { seq([262, 330, 392, 523], 0.11, { vol: 0.06 }); tone(659, 0.35, { when: 0.5, vol: 0.05 }); tone(784, 0.35, { when: 0.5, vol: 0.05 }); },
    flip() { noise(0.09, { freq: 3200, vol: 0.14 }); noise(0.07, { freq: 1800, vol: 0.08, when: 0.08 }); },
    scan() { for (let i = 0; i < 6; i++) tone(i % 2 ? 660 : 440, 0.09, { when: i * 0.2, vol: 0.05 }); },
    send() { tone(660, 0.05, { vol: 0.05 }); tone(990, 0.07, { when: 0.05, vol: 0.05 }); },
    receive() { tone(740, 0.06, { vol: 0.05, type: 'triangle' }); tone(587, 0.08, { when: 0.06, vol: 0.05, type: 'triangle' }); },
    error() { tone(220, 0.14, { type: 'sawtooth', vol: 0.05, slideTo: 140 }); },
    reset() { tone(300, 0.09, { type: 'sawtooth', vol: 0.05, slideTo: 90 }); noise(0.12, { freq: 900, vol: 0.1, when: 0.05 }); },
    unlock() { seq([392, 523, 659, 784, 988, 1175, 1568], 0.08, { type: 'triangle', vol: 0.08, len: 0.2 }); },
    tick() { tone(1400, 0.025, { vol: 0.025 }); },
    // Career Match — deliberately quiet
    mflip() { noise(0.05, { freq: 2600, vol: 0.06 }); tone(700, 0.03, { vol: 0.025 }); },
    mmatch() { seq([784, 1047], 0.07, { type: 'triangle', vol: 0.06, len: 0.16 }); },
    mmiss() { tone(150, 0.16, { type: 'sawtooth', vol: 0.04, slideTo: 105 }); },
    mcombo(n) { const b = 440 * Math.pow(1.122, Math.min(n || 2, 8) - 2); seq([b, b * 1.26, b * 1.5, b * 2], 0.055, { type: 'triangle', vol: 0.055, len: 0.13 }); },
    mlife() { seq([440, 349, 262, 196], 0.09, { type: 'sawtooth', vol: 0.04, len: 0.14 }); },
    mwin() { seq([523, 659, 784, 1047, 784, 1047, 1319], 0.1, { type: 'triangle', vol: 0.06, len: 0.18 }); },
  };
  // minimum gap (ms) between repeats of the same sound, so rapid clicking never turns into noise
  const GAP = { mflip: 70, mmatch: 150, mmiss: 200, mcombo: 250, mlife: 400, mwin: 1500, tick: 300 };
  const last = {};

  NM.sfx = {
    get enabled() { return enabled; },
    play(name, arg) {
      if (!enabled || !SOUNDS[name]) return;
      if (GAP[name]) { const now = performance.now(); if (now - (last[name] || 0) < GAP[name]) return; last[name] = now; }
      try { if (ctx && ctx.state === 'suspended') ctx.resume(); SOUNDS[name](arg); } catch (e) { /* audio is optional */ }
    },
    set(on) {
      enabled = !!on;
      NM.store.set('nm_sound', enabled);
      if (enabled) {
        const c = ensure();
        if (c && c.state === 'suspended') c.resume();
        SOUNDS.click();
      }
      NM.emit('sound', enabled);
    },
    toggle() { NM.sfx.set(!enabled); },
  };
  // Note: sound state is intentionally NOT restored as "on" from storage — a classroom or
  // office should never get a surprise audio blast. The visitor must opt in each visit.
})();
