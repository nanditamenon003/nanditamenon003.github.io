/* analytics.js — client-side analytics. Static site = no database, so everything is stored in
   localStorage (per browser). A "demo data" layer is added ON TOP of live counts for presentations. */
(function () {
  'use strict';
  const NM = window.NM;
  const KEY = 'nm_analytics_v1';

  const blank = () => ({
    visitors: 0,
    windowViews: {},   // every window/app open, by id
    projectClicks: {}, // the 5 "work" icons
    cv: 0,
    recruiter: {},     // by category
    questions: [],     // {q, intent, t}
    totalSeconds: 0,
    demo: false,
    contact: {},
    game: { plays: 0, wins: 0, best: {}, combo5: 0 }, // Career Match
  });

  let S = Object.assign(blank(), NM.store.get(KEY, {}));
  S.windowViews = S.windowViews || {};
  S.projectClicks = S.projectClicks || {};
  S.recruiter = S.recruiter || {};
  S.questions = S.questions || [];
  S.contact = S.contact || {};
  S.game = Object.assign({ plays: 0, wins: 0, best: {}, combo5: 0 }, S.game || {});

  // ---- simulated audience for the class demo (clearly labelled in the UI) ----
  const DEMO = {
    visitors: 47,
    windowViews: { casecomps: 58, experience: 44, blackfungus: 33, instructor: 17, ama: 52, recruiter: 29, about: 26, contact: 19, activity: 9, achievements: 12, glitch: 6 },
    // per piece of work (a project window or one folder card)
    projectClicks: { brand: 41, blackfungus: 33, sip: 27, prodyssey: 24, bowl: 19, instructor: 17, sirp: 15, gcl: 12 },
    cv: 14,
    recruiter: { marketing: 9, strategy: 6, ai: 5, content: 3, creative: 2, media: 2, xd: 1, mediabuying: 1 },
    totalSeconds: 47 * 176,
    questions: [
      { q: 'What experience does Nandita have in advertising?', intent: 'advertising', min: 6 },
      { q: 'Show me your work related to AI.', intent: 'ai', min: 14 },
      { q: 'What projects demonstrate your leadership skills?', intent: 'leadership', min: 22 },
      { q: 'Tell me about the Tommy Hilfiger internship', intent: 'sip', min: 35 },
      { q: 'is she good with data / power bi?', intent: 'skills', min: 51 },
      { q: 'how did you size the bata backpack market', intent: 'brand', min: 78 },
      { q: 'Why hire a CS grad for brand strategy?', intent: 'whyhire', min: 95 },
      { q: 'any experience in content creation', intent: 'gcl', min: 130 },
      { q: 'what is the accuracy of the fungus model', intent: 'blackfungus', min: 172 },
      { q: 'download cv', intent: 'resume', min: 210 },
      { q: 'do you have google ads certifications', intent: 'mediabuying', min: 265 },
      { q: 'What did the CRM preview day prove?', intent: 'sip', min: 320 },
      { q: 'how was this website built?', intent: 'site', min: 410 },
      { q: 'Tell me about game design experience', intent: 'games', min: 520 },
    ],
  };

  let dirty = false;
  function save() { NM.store.set(KEY, S); dirty = false; }
  function changed() { dirty = true; save(); NM.emit('analytics', view()); }

  // ---- session tracking ----
  let sessionSeconds = 0;
  function startSession() {
    if (!NM.session.get('nm_counted')) {
      NM.session.set('nm_counted', '1');
      S.visitors += 1;
      save();
    }
    setInterval(() => {
      if (document.hidden) return;
      sessionSeconds += 1;
      S.totalSeconds += 1;
      if (sessionSeconds % 5 === 0) save();
      NM.emit('tick', sessionSeconds);
    }, 1000);
    window.addEventListener('pagehide', save);
  }

  // ---- tracking calls ----
  const track = {
    // any window / app / card view ("pages viewed")
    windowOpen(id) {
      S.windowViews[id] = (S.windowViews[id] || 0) + 1;
      changed();
    },
    // one piece of work opened (a project window OR a card inside a folder) — "projects clicked"
    work(id) {
      S.projectClicks[id] = (S.projectClicks[id] || 0) + 1;
      changed();
    },
    cv() { S.cv += 1; changed(); },
    recruiter(cat) { S.recruiter[cat] = (S.recruiter[cat] || 0) + 1; changed(); },
    question(q, intent) {
      S.questions.unshift({ q: String(q).slice(0, 200), intent: intent || 'unknown', t: Date.now() });
      S.questions = S.questions.slice(0, 200);
      changed();
    },
    contact(kind) { S.contact[kind] = (S.contact[kind] || 0) + 1; changed(); },
    // Career Match: plays, wins, best score per difficulty, 5-combos
    game(kind, d) {
      const g = S.game; d = d || {};
      if (kind === 'play') g.plays += 1;
      else if (kind === 'combo5') g.combo5 += 1;
      else if (kind === 'end') {
        if (d.win) g.wins += 1;
        if (d.score > (g.best[d.diff] || 0)) g.best[d.diff] = d.score;
      }
      changed();
    },
  };

  const sum = (o) => Object.keys(o).reduce((a, k) => a + o[k], 0);
  const merge = (a, b) => { const o = Object.assign({}, a); Object.keys(b).forEach((k) => { o[k] = (o[k] || 0) + b[k]; }); return o; };

  function view() {
    const demo = S.demo;
    const windowViews = demo ? merge(DEMO.windowViews, S.windowViews) : S.windowViews;
    const projectClicks = demo ? merge(DEMO.projectClicks, S.projectClicks) : S.projectClicks;
    const recruiter = demo ? merge(DEMO.recruiter, S.recruiter) : S.recruiter;
    const now = Date.now();
    const demoQs = DEMO.questions.map((d) => ({ q: d.q, intent: d.intent, t: now - d.min * 60000, demo: true }));
    const questions = demo ? S.questions.concat(demoQs) : S.questions.slice();
    const visitors = (demo ? DEMO.visitors : 0) + S.visitors;
    const totalSeconds = (demo ? DEMO.totalSeconds : 0) + S.totalSeconds;
    const ranked = NM.data.WORKS
      .map((id) => ({ id, n: projectClicks[id] || 0 }))
      .sort((a, b) => b.n - a.n);
    return {
      demo,
      visitors,
      windowsOpened: sum(windowViews),
      windowViews,
      totalSeconds,
      avgSeconds: visitors ? totalSeconds / visitors : 0,
      sessionSeconds,
      projectClicks,
      ranked,
      cv: (demo ? DEMO.cv : 0) + S.cv,
      recruiter,
      recruiterTotal: sum(recruiter),
      questions,
      questionTotal: questions.length,
      game: S.game,
    };
  }

  // ---- "Optimization": turn the numbers into decisions ----
  function insights() {
    const v = view();
    const out = [];
    const labelOf = (id) => (NM.data.works[id] ? NM.data.works[id].label : id);
    const totalClicks = sum(v.projectClicks);

    if (totalClicks >= 3) {
      const top = v.ranked[0];
      const low = v.ranked[v.ranked.length - 1];
      const parent = NM.data.works[top.id].parent;
      out.push({
        icon: 'star',
        text: parent
          ? '<b>' + labelOf(top.id) + '</b> has the most clicks (' + top.n + ') → move its folder, <b>' + NM.data.folders[parent].label + '</b>, to the top-left icon slot and list the card first.'
          : '<b>' + labelOf(top.id) + '</b> has the most clicks (' + top.n + ') → move it to the top-left icon position.',
        action: { label: 'Apply', type: 'reorder' },
      });
      if (low.n < top.n) {
        out.push({ icon: 'lock', text: '<b>' + labelOf(low.id) + '</b> gets the least attention (' + low.n + ') → put its headline metric in the card title so the value shows before the click.' });
      }
    }
    if (v.visitors >= 3) {
      const rate = Math.round((v.cv / v.visitors) * 100);
      out.push({
        icon: 'pdf',
        text: rate < 30
          ? 'Only <b>' + rate + '%</b> of visitors download the CV → add a Resume button to the assistant\'s first reply and the menu bar.'
          : '<b>' + rate + '%</b> of visitors download the CV — strong intent. Keep the resume one click away from every screen.',
      });
    }
    if (v.recruiterTotal >= 3) {
      const top = Object.keys(v.recruiter).sort((a, b) => v.recruiter[b] - v.recruiter[a])[0];
      const r = NM.data.roles[top];
      if (r) out.push({ icon: 'gear', text: 'Most recruiters say they\'re hiring for <b>' + r.label + '</b> (' + v.recruiter[top] + ') → make it the default sticky note and first suggested chips.' });
    }
    if (v.questionTotal >= 3) {
      const counts = {};
      v.questions.forEach((x) => { counts[x.intent] = (counts[x.intent] || 0) + 1; });
      const ranked = Object.keys(counts).filter((k) => k !== 'unknown').sort((a, b) => counts[b] - counts[a]);
      if (ranked.length) {
        const entry = NM.data.kb.find((k) => k.id === ranked[0]);
        out.push({ icon: 'chat', text: 'Top question theme: <b>' + (entry ? entry.title : ranked[0]) + '</b> (' + counts[ranked[0]] + '×) → promote it to a suggested chip.' });
      }
      const missed = counts.unknown || 0;
      if (missed) out.push({ icon: 'chat', text: '<b>' + missed + '</b> question' + (missed > 1 ? 's' : '') + ' hit the fallback → read them in the feed and add knowledge-base entries.' });
    }
    if (v.visitors >= 1 && v.avgSeconds > 0) {
      out.push({
        icon: 'monitor',
        text: v.avgSeconds < 90
          ? 'Average visit is <b>' + NM.fmtTime(v.avgSeconds) + '</b> → strengthen the first-window hook (recruiter mode prompt on boot).'
          : 'Average visit is <b>' + NM.fmtTime(v.avgSeconds) + '</b> — long enough to explore ~' + Math.max(2, Math.round(v.windowsOpened / v.visitors)) + ' windows each. The desktop metaphor is holding attention.',
      });
    }
    return out;
  }

  // The concrete change behind the "Apply" button: order desktop icons by the clicks their work earns
  // (a folder = the sum of its cards) and order the cards inside each folder by clicks.
  function plan() {
    const v = view();
    const iconClicks = {};
    v.ranked.forEach((r) => { const ic = NM.data.iconOf(r.id); iconClicks[ic] = (iconClicks[ic] || 0) + r.n; });
    const icons = Object.keys(iconClicks).sort((a, b) => iconClicks[b] - iconClicks[a]);
    const cards = {};
    Object.keys(NM.data.folders).forEach((f) => {
      cards[f] = NM.data.folders[f].children.slice().sort((a, b) => (v.projectClicks[b] || 0) - (v.projectClicks[a] || 0));
    });
    return { icons, cards };
  }

  NM.analytics = {
    init: startSession,
    track,
    view,
    insights,
    plan,
    isDemo: () => S.demo,
    setDemo(on) { S.demo = !!on; changed(); },
    reset() {
      const demo = S.demo;
      S = blank();
      S.demo = demo;
      S.visitors = 1; // this visit still counts
      changed();
    },
  };
})();
