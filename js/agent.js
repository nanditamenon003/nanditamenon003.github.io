/* agent.js — "Ask Me Anything" prototype assistant.
   Option A (default): intent matching over a hand-written knowledge base. No API key, no network, cannot fail live.
   Option B (later): set NM.config.agentEndpoint to a serverless proxy URL; replies then come from a real LLM,
   and this prototype engine stays as the automatic fallback. See option-b/api/chat.js. */
(function () {
  'use strict';
  const NM = window.NM;

  NM.config = Object.assign({ agentEndpoint: null }, NM.config || {});

  const EXTRA_CHIPS = [
    'Tell me about the tote bag go-to-market',
    'How does the analytics work?',
    'Are you real AI?',
    'Download the resume',
    'What did the SIRP find?',
    'Tell me about game design experience',
  ];

  const APP_LABELS = {
    about: 'About Nandita', contact: 'Contact', activity: 'Activity Monitor',
    achievements: 'Achievements', recruiter: 'Recruiter Mode',
  };
  const labelFor = (id) => (NM.data.works[id] ? NM.data.works[id].label : NM.data.folders[id] ? NM.data.folders[id].label : APP_LABELS[id] || id);

  const norm = (s) => ' ' + String(s).toLowerCase().replace(/[^a-z0-9₹%+ ]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';

  function score(entry, q, tokens) {
    let total = 0;
    const hits = [];
    entry.keys.forEach((k) => {
      let phrase = k[0];
      const w = k[1];
      let hit = false;
      if (phrase.slice(-1) === '*') {
        const stem = phrase.slice(0, -1);
        hit = stem.indexOf(' ') > -1 ? q.indexOf(' ' + stem) > -1 : tokens.some((t) => t.indexOf(stem) === 0);
      } else if (phrase.indexOf(' ') > -1) {
        hit = q.indexOf(' ' + phrase + ' ') > -1;
      } else {
        hit = tokens.indexOf(phrase) > -1;
      }
      if (hit) { total += w; hits.push(phrase.replace('*', '')); }
    });
    return { total, hits };
  }

  function match(query) {
    const q = norm(query);
    const tokens = q.trim().split(' ');
    let best = null;
    NM.data.kb.forEach((entry) => {
      const s = score(entry, q, tokens);
      if (s.total > 0 && (!best || s.total > best.score)) best = { entry, score: s.total, hits: s.hits };
    });
    return best && best.score >= 3 ? best : null;
  }

  // ---- history is kept even when the window is closed, so Recruiter Mode can greet you ----
  const history = [];
  let mounted = null; // { log, chipsEl, refreshChips }
  const asked = {};
  let role = null;

  function chipPool() {
    const r = role && NM.data.roles[role];
    return (r ? r.chips : []).concat(NM.data.defaultChips, EXTRA_CHIPS);
  }
  function nextChips() {
    const seen = {};
    return chipPool().filter((c) => { if (asked[c] || seen[c]) return false; seen[c] = 1; return true; }).slice(0, 4);
  }

  function renderBot(msg) {
    const wrap = NM.h('<div class="msg bot"><img class="msg-av px" alt="" aria-hidden="true"><div class="bubble"></div></div>');
    NM.$('.msg-av', wrap).src = 'assets/nandita_pixel_avatar.png';
    const b = NM.$('.bubble', wrap);
    let list = null;
    msg.paras.forEach((p, i) => {
      let node;
      if (p.indexOf('• ') === 0) {
        if (!list) { list = document.createElement('ul'); b.appendChild(list); }
        node = document.createElement('li');
        node.innerHTML = p.slice(2);
        list.appendChild(node);
      } else {
        list = null;
        node = document.createElement('p');
        node.innerHTML = p;
        b.appendChild(node);
      }
      node.style.animationDelay = i * 90 + 'ms';
      node.classList.add('rise');
    });
    if (msg.open && msg.open.length) {
      const row = NM.h('<div class="msg-actions"></div>');
      msg.open.forEach((id) => {
        const btn = NM.h('<button class="pbtn small" type="button"></button>');
        btn.textContent = 'Open ' + labelFor(id) + ' >';
        btn.addEventListener('click', () => NM.openApp(id));
        row.appendChild(btn);
      });
      b.appendChild(row);
    }
    (msg.actions || []).forEach((a) => {
      if (a.type === 'cv') {
        const row = NM.h('<div class="msg-actions"></div>');
        const btn = NM.h('<button class="pbtn small primary" type="button">Download resume (PDF)</button>');
        btn.addEventListener('click', () => NM.downloadCV('assistant'));
        row.appendChild(btn);
        b.appendChild(row);
      }
    });
    if (msg.why) {
      const d = NM.h('<details class="why"><summary>Why this answer?</summary><div class="why-body"></div></details>');
      NM.$('.why-body', d).innerHTML = msg.why;
      b.appendChild(d);
    }
    return wrap;
  }

  function renderMe(text) {
    const wrap = NM.h('<div class="msg me"><div class="bubble"></div></div>');
    NM.$('.bubble', wrap).textContent = text;
    return wrap;
  }

  function scroll() { if (mounted) mounted.log.scrollTop = mounted.log.scrollHeight; }

  function pushMsg(msg) {
    history.push(msg);
    if (mounted) {
      mounted.log.appendChild(msg.who === 'me' ? renderMe(msg.text) : renderBot(msg));
      scroll();
    }
  }

  function whyHtml(m) {
    const conf = m.score >= 8 ? 'high' : m.score >= 5 ? 'medium' : 'low';
    return (
      '<b>Matched intent:</b> ' + NM.esc(m.entry.title) + ' <span class="conf ' + conf + '">' + conf + ' confidence</span><br>' +
      '<b>Keywords heard:</b> ' + m.hits.map(NM.esc).join(', ') + '<br>' +
      '<b>Facts sourced from:</b> ' + NM.esc(m.entry.src) + '<br>' +
      '<span class="fine">Prototype logic: rule-based intent matching over a hand-written knowledge base. It can only say what Nandita\'s documents support, and nothing you type leaves this browser.</span>'
    );
  }

  function fallback(q) {
    return {
      intent: 'unknown',
      paras: [
        "I'm a prototype, so I only know Nandita's portfolio topics — and I don't have a good answer for that one yet. (It's been logged in the Activity Monitor so it can become a new answer.)",
        'Try one of these instead:',
      ],
      open: [],
      why: '<b>Matched intent:</b> none (below confidence threshold)<br><span class="fine">Unmatched questions are logged locally so the knowledge base can be improved — the "Optimization" half of analytics.</span>',
    };
  }

  async function liveReply(q) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    try {
      const res = await fetch(NM.config.agentEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, role, history: history.slice(-6).map((m) => ({ who: m.who, text: m.text || (m.paras || []).join(' ') })) }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      if (!data.reply) throw new Error('empty');
      return { intent: 'live-llm', paras: [NM.esc(data.reply)], open: [], why: '<b>Source:</b> live model via serverless proxy (no key in the browser).' };
    } finally { clearTimeout(t); }
  }

  async function respond(q) {
    if (NM.config.agentEndpoint) {
      try { return await liveReply(q); } catch (e) { /* fall through to the prototype */ }
    }
    const m = match(q);
    if (!m) return fallback(q);
    return { intent: m.entry.id, paras: m.entry.a, open: m.entry.open || [], actions: m.entry.actions, why: whyHtml(m) };
  }

  async function ask(q) {
    q = String(q || '').trim().slice(0, 200);
    if (!q) return;
    asked[q] = true;
    pushMsg({ who: 'me', text: q });
    NM.sfx.play('send');
    refreshChips();
    // typing indicator
    let typing = null;
    if (mounted) {
      typing = NM.h('<div class="msg bot typing"><img class="msg-av px" alt="" aria-hidden="true"><div class="bubble"><span class="dots"><i></i><i></i><i></i></span></div></div>');
      NM.$('.msg-av', typing).src = 'assets/nandita_pixel_avatar.png';
      mounted.log.appendChild(typing);
      scroll();
    }
    const [reply] = await Promise.all([respond(q), NM.sleep(NM.reducedMotion() ? 0 : 520 + Math.random() * 380)]);
    if (typing) typing.remove();
    NM.analytics.track.question(q, reply.intent);
    const n = Object.keys(asked).length;
    NM.game.award('ask:' + Math.min(n, 5), 4);
    pushMsg(Object.assign({ who: 'bot' }, reply));
    NM.sfx.play('receive');
    if (reply.intent === 'unknown') {
      // show chips inline for graceful recovery
      refreshChips();
    }
  }

  function refreshChips() {
    if (!mounted) return;
    const el = mounted.chipsEl;
    el.innerHTML = '';
    nextChips().forEach((c) => {
      const b = NM.h('<button type="button" class="chip"></button>');
      b.textContent = c;
      b.addEventListener('click', () => ask(c));
      el.appendChild(b);
    });
  }

  function greeting() {
    const r = role && NM.data.roles[role];
    return {
      who: 'bot',
      paras: r
        ? [r.greeting]
        : ["Hi, I'm <b>Nandita's AI assistant</b> — a prototype grounded in her real resume, projects and research. Ask me anything a recruiter would, or tap a suggestion:"],
      open: [],
    };
  }

  function mount(root, opts) {
    opts = opts || {};
    const el = NM.h(
      '<div class="chat">' +
        '<div class="chat-head"><img class="px" alt="" aria-hidden="true">' +
          '<div><b>Nandita\'s Assistant</b><small><span class="online"></span>' + (NM.config.agentEndpoint ? 'live model' : 'prototype') + ' · answers only from her real background</small></div></div>' +
        '<div class="chat-log" role="log" aria-live="polite"></div>' +
        '<div class="chat-chips" aria-label="Suggested questions"></div>' +
        '<form class="chat-form" autocomplete="off"><input type="text" maxlength="200" aria-label="Ask a question" placeholder="Ask about experience, projects, skills…"><button class="pbtn primary" type="submit">Send</button></form>' +
      '</div>'
    );
    NM.$('.chat-head img', el).src = 'assets/nandita_pixel_avatar.png';
    root.appendChild(el);
    const log = NM.$('.chat-log', el);
    mounted = { log, chipsEl: NM.$('.chat-chips', el) };
    if (!history.length) history.push(greeting());
    history.forEach((m) => log.appendChild(m.who === 'me' ? renderMe(m.text) : renderBot(m)));
    refreshChips();
    scroll();
    const form = NM.$('.chat-form', el);
    const input = NM.$('input', el);
    form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; ask(v); });
    if (opts.focus !== false) setTimeout(() => input.focus({ preventScroll: true }), 60);
    return { unmount() { if (mounted && mounted.log === log) mounted = null; } };
  }

  NM.agent = {
    mount,
    ask,
    match,
    // Recruiter Mode calls this: the assistant greets with role-specific context
    setRole(cat) {
      role = cat;
      const r = NM.data.roles[cat];
      if (!r) return;
      pushMsg({ who: 'bot', paras: [r.greeting], open: [] });
      refreshChips();
    },
    clearRole() { role = null; refreshChips(); },
  };
})();

