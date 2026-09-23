/* apps-os.js — the "system" windows: About, Contact, Messages (AI assistant), Recruiter Mode,
   Activity Monitor and Achievements. */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;
  const defs = NM.apps.defs;
  const { barRows } = NM.apps.helpers;
  const D = NM.data;

  const ago = (t) => {
    const s = Math.max(1, Math.round((Date.now() - t) / 1000));
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.round(s / 60) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    return Math.round(s / 86400) + 'd ago';
  };

  /* ================= ABOUT (tabbed, macOS "About This Mac" style) ================= */
  const JOURNEY = [
    {
      year: '2020–24', title: 'BTech Computer Science',
      teaser: 'Machine learning models and desktop applications in class — and on the side, Glitch, my college\'s game-dev club, and an international Unity game jam.',
      full: 'I studied Computer Science at Amrita, building machine learning models and full desktop applications for coursework. Outside class I found my real classroom in Glitch, our game-development club — I competed in an International Unity Game Jam and later helped organise the same event for the next batch. It\'s where I first learned that the fastest way to understand a system is to build a small, playable version of it.',
    },
    {
      year: '2024', title: 'The pivot',
      teaser: 'Somewhere between building systems and watching people use them, my curiosity shifted — from how something works to why people choose it at all.',
      full: 'Somewhere in my final year I noticed I was more curious about why people chose one product over another than about the architecture running underneath it. Every feature I shipped raised a question no engineering course could answer: what actually makes someone care? That question is what sent me looking for a business degree instead of a job offer.',
    },
    {
      year: '2025', title: 'PGDM at WeSchool',
      teaser: 'A PGDM in Media &amp; Entertainment at WeSchool, Mumbai — brand strategy, consumer research, and a crash course in marketing I\'d never formally studied.',
      full: 'I joined WeSchool\'s PGDM in Media &amp; Entertainment to formally study what had been pulling at me: brand strategy, consumer research and marketing. It\'s given me frameworks for the instinct I already had, and put me in national case competitions that forced me to think fast under pressure. Two years in, it still feels like the right pivot.',
    },
    {
      year: '2026', title: 'Tommy Hilfiger internship',
      teaser: 'Two months on a premium retail floor — CRM-led clienteling, tele-outreach to loyalty members, and ₹19.25L in personal sales.',
      full: 'For my summer internship I worked the floor at Tommy Hilfiger, Express Avenue — real customers, real targets, real pressure. I ran CRM-driven clienteling, calling loyalty members ahead of sale days, and closed ₹19.25L+ in personal sales over 52 days, hitting 108.3% of my May target. It\'s the closest I\'ve come to watching a brand strategy work in real time, one transaction at a time.',
    },
    {
      year: '2025–26', title: 'Case competitions',
      teaser: 'IMT Ghaziabad, 2nd Runner-Up. IIM Indore, National Finalist. Two different problems, the same instinct: find the constraint, then find the opportunity inside it.',
      full: 'Case competitions became my testing ground for everything I was learning. At IMT Ghaziabad\'s Brand Alchemy, our team placed 2nd Runner-Up proposing a new backpack line for Bata; at IIM Indore\'s Prodyssey, we made the National Finals redesigning a 19-college project under COVID-era constraints. Different industries, same habit: find the constraint first, then the opportunity hiding inside it.',
    },
    {
      year: 'Now', title: 'Now',
      teaser: 'Bringing the technical side back in — building this very site, pixel by pixel, as proof the two halves were never really separate.',
      full: 'Right now I\'m pulling the technical half of my story back into the marketing half — this portfolio is the clearest example, a pixel-art desktop I built myself rather than a template I filled in. It\'s a small argument for what I actually believe: that the best brand thinking still benefits from knowing how the system underneath it works. I\'m still looking for where that combination is most useful next.',
    },
  ];

  function aboutOverviewHtml() {
    return '<div class="doc">' +
      '<div class="about-photos">' +
        '<figure><img src="assets/nandita_photo.jpg" alt="Nandita Menon, smiling, in a navy blazer and pink collared shirt" width="84" height="112"><figcaption>the real one</figcaption></figure>' +
        '<figure><img class="px" src="assets/nandita_pixel_avatar.png" alt="Pixel-art avatar of Nandita Menon" width="84" height="112"><figcaption>the 8-bit one</figcaption></figure>' +
      '</div>' +
      '<div class="kicker">About · README.md</div>' +
      '<h2>Nandita Menon</h2>' +
      '<p class="lead">Computer-science engineer turned media &amp; brand strategist. I bridge logic and creativity — technology and people.</p>' +
      '<div class="chips"><span>PGDM Media &amp; Entertainment \'27</span><span>WeSchool, Mumbai</span><span>B.Tech CSE \'24</span></div>' +
      '<p>Hyderabad\'s pace and Kerala\'s roots taught me early that the best ideas sit between two worlds. I studied Computer Science, which gave me a strong base in logical thinking — but I kept gravitating to the creative, people-facing side of technology: a game-development club, an international game jam, and an internship designing educational games for children under a government initiative.</p>' +
      '<p>That instinct pulled me toward management. At WeSchool I\'ve kept testing it from different angles: selling and doing CRM on a premium retail floor, researching how transparency builds (or breaks) trust in AI, and mapping AI in content creation for a media client — alongside national case competitions that taught me to think on my feet.</p>' +
      '<h3>System upgrade log</h3>' +
      '<ol class="upgrades">' +
        '<li><b>2020</b><span>v1.0 · Blockchain &amp; Web3 intern at Verzeo — first decentralised-app concepts</span></li>' +
        '<li><b>2021</b><span>v1.1 · C# Unity game developer; co-built the Instructor Aid System</span></li>' +
        '<li><b>2022</b><span>v1.2 · Game Design &amp; UX intern at Ammachi Labs (DIKSHA initiative, Figma)</span></li>' +
        '<li><b>2023</b><span>v1.3 · Black Fungus Detection: 5 architectures compared, Inception V3 best at 98.87% train / 98.25% test</span></li>' +
        '<li><b>2024</b><span>v1.9 · B.Tech Computer Science &amp; Engineering, Amrita — logic engine installed</span></li>' +
        '<li><b>2025</b><span>v2.0 · <em>Major upgrade:</em> PGDM Media &amp; Entertainment, WeSchool</span></li>' +
        '<li><b>2026</b><span>v2.1 · Patches: Tommy Hilfiger SIP, SIRP on explainable AI, GCL with Digital Dogs</span></li>' +
      '</ol>' +
      '<div class="cols2">' +
        '<div><h3>Skills</h3><div class="chips"><span>Digital marketing</span><span>AI &amp; analytics</span><span>Python</span><span>Machine learning</span><span>Excel</span><span>Power BI</span><span>MySQL</span><span>HTML/CSS/JS</span><span>Game design</span></div>' +
        '<h3>Languages</h3><div class="chips"><span>English</span><span>Hindi</span><span>Malayalam</span><span>Telugu</span><span>Tamil</span></div></div>' +
        '<div><h3>Certifications</h3><ul class="plain"><li>Google Ads — Search, Display, Video</li><li>KPMG India — Sustainability (16 hrs)</li><li>Johns Hopkins — HTML, CSS &amp; JS (2020)</li><li>UC — C for Everyone (2023)</li><li>Udemy — C# Unity Game Developer (2021)</li><li>Udemy — Web Developer Bootcamp (2025)</li></ul></div>' +
      '</div>' +
      '<h3>Also</h3><ul class="plain"><li>Senior Committee Member, Guruvandana — WeSchool\'s industry-mentor engagement initiative</li><li>SIP 2026 volunteer — on-ground operations for new-student registration</li></ul>' +
    '</div>';
  }

  function aboutJourneyHtml() {
    return '<div class="doc">' +
      '<div class="kicker">About · Journey</div>' +
      '<h2>How I got here</h2>' +
      '<p class="lead">Click a row to read more.</p>' +
      '<ol class="jline" id="about-journey">' +
        JOURNEY.map((j, i) =>
          '<li class="jrow" data-i="' + i + '">' +
            '<button class="jhead" type="button" aria-expanded="false">' +
              '<span class="jyear">' + esc(j.year) + '</span>' +
              '<span class="jmain"><b>' + esc(j.title) + '</b><em>' + j.teaser + '</em></span>' +
              '<i class="jchev" aria-hidden="true">+</i>' +
            '</button>' +
            '<div class="jbody"><p>' + j.full + '</p></div>' +
          '</li>'
        ).join('') +
      '</ol>' +
    '</div>';
  }

  function aboutToolkitHtml() {
    const group = (icon, name, skills, note) =>
      '<div class="tkit-group"><div class="tkit-h">' + NM.sprites.html(icon) + '<b>' + name + '</b></div>' +
      '<div class="chips">' + skills.map((s) => '<span>' + s + '</span>').join('') + '</div>' +
      '<p class="tkit-note">' + note + '</p></div>';
    return '<div class="doc">' +
      '<div class="kicker">About · Toolkit</div>' +
      '<h2>What I actually use</h2>' +
      '<div class="tkit">' +
        group('monitor', 'Technical', ['Python', 'Machine learning', 'MySQL', 'HTML/CSS/JS'], 'I use these to build things myself — this site\'s pixel engine, the Black Fungus models, quick data pulls when a hunch needs numbers behind it.') +
        group('chat', 'Marketing', ['Digital marketing', 'AI &amp; analytics', 'Power BI', 'Excel'], 'Where strategy meets execution — sizing a market, reading a dashboard, and turning both into a plan a retail floor can actually run.') +
        group('gamepad', 'Creative', ['Game design'], 'The instinct that started it all: prototyping fast, testing with real people, and not being precious about the first draft.') +
      '</div>' +
    '</div>';
  }

  function aboutCurrentlyHtml() {
    return '<div class="doc">' +
      '<div class="kicker">About · Currently</div>' +
      '<h2>Right now</h2>' +
      '<p>I\'m deep in a stretch of learning by doing — most of what\'s in this portfolio (the pixel art, the tiny animations, the AI assistant) I picked up while building it, one stubborn bug at a time. Outside of that, I\'m still chasing the thread from my SIRP research: how AI can be personal without being invasive, and what that means for brands I might someday work with.</p>' +
      '<p>I\'m almost always reading something that explains how people decide things, and almost always listening to something in the background — music is a constant, not a mood. On weekends you\'ll usually find me café hopping somewhere new in the city; I like judging a place by its coffee and its playlist in equal measure.</p>' +
      '<p>And if you ask me to choose between cats and dogs, I won\'t. I love both, equally and without apology — anyone who makes me pick clearly hasn\'t met enough of either.</p>' +
    '</div>';
  }

  defs.about = {
    title: 'About Nandita — README.md', sprite: 'about', w: 720, h: 620,
    content(root) {
      NM.apps.helpers.tabs(root, [
        { id: 'overview', label: 'Overview', html: aboutOverviewHtml() },
        {
          id: 'journey', label: 'Journey', html: aboutJourneyHtml(),
          build(panel) {
            const rows = $$('.jrow', panel);
            rows.forEach((row) => {
              const head = $('.jhead', row);
              head.addEventListener('click', () => {
                const open = row.classList.toggle('open');
                head.setAttribute('aria-expanded', open);
                NM.sfx.play('click');
              });
            });
            if ('IntersectionObserver' in window) {
              const io = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                  if (!entry.isIntersecting) return;
                  const row = entry.target;
                  const i = Number(row.dataset.i) || 0;
                  setTimeout(() => row.classList.add('in'), i * 90);
                  io.unobserve(row);
                });
              }, { threshold: 0.15 });
              rows.forEach((row) => io.observe(row));
            } else {
              rows.forEach((row) => row.classList.add('in'));
            }
          },
        },
        { id: 'toolkit', label: 'Toolkit', html: aboutToolkitHtml() },
        { id: 'currently', label: 'Currently', html: aboutCurrentlyHtml() },
      ]);
    },
  };

  /* ================= CONTACT ================= */
  defs.contact = {
    title: 'Contact', sprite: 'mail', w: 520, h: 470,
    content(root) {
      const P = D.person;
      root.innerHTML =
        '<div class="doc">' +
          '<div class="kicker">Say hello</div>' +
          '<h2>Let\'s talk about what you\'re building</h2>' +
          '<p>Email is fastest. I\'m happy to walk through any project on this desktop — including the numbers behind it.</p>' +
          '<div class="clinks">' +
            '<a class="clink" data-k="email" href="mailto:' + P.email + '"><span class="ci"></span><b>Email</b><em>' + P.email + '</em></a>' +
            '<a class="clink" data-k="linkedin" href="' + P.linkedin + '" target="_blank" rel="noopener"><span class="ci li">in</span><b>LinkedIn</b><em>' + P.linkedinShort + '</em></a>' +
            '<a class="clink" data-k="github" href="' + P.github + '" target="_blank" rel="noopener"><span class="ci gh">{ }</span><b>GitHub</b><em>' + P.githubShort + '</em></a>' +
            '<button class="clink" data-k="cv" type="button"><span class="ci pd"></span><b>Resume (PDF)</b><em>One page · direct download</em></button>' +
          '</div>' +
          '<div class="row-actions"><button class="pbtn" id="copy-mail" type="button">Copy email address</button><span class="fine" id="copy-msg" aria-live="polite"></span></div>' +
        '</div>';
      $('.clink[data-k="email"] .ci', root).appendChild(NM.sprites.img('mail'));
      $('.clink[data-k="cv"] .ci', root).appendChild(NM.sprites.img('pdf'));
      $$('.clink', root).forEach((a) => a.addEventListener('click', () => {
        NM.sfx.play('click');
        if (a.dataset.k === 'cv') NM.downloadCV('contact');
        else NM.analytics.track.contact(a.dataset.k);
      }));
      $('#copy-mail', root).addEventListener('click', async () => {
        const msg = $('#copy-msg', root);
        try { await navigator.clipboard.writeText(P.email); msg.textContent = 'Copied ✓'; } catch (e) { msg.textContent = P.email; }
        NM.analytics.track.contact('copy-email');
        NM.sfx.play('chime');
      });
    },
  };

  /* ================= MESSAGES (AI assistant) ================= */
  defs.ama = {
    title: 'Messages — Ask Me Anything', sprite: 'chat', w: 480, h: 590, cls: 'chatwin',
    content(root) {
      const c = NM.agent.mount(root);
      const obs = new MutationObserver(() => { if (!root.isConnected) { c.unmount(); obs.disconnect(); } });
      obs.observe(document.body, { childList: true, subtree: true });
    },
  };

  /* ================= RECRUITER MODE ================= */
  defs.recruiter = {
    title: 'System Preferences — Recruiter Mode', sprite: 'gear', w: 640, h: 560,
    content(root) {
      root.innerHTML =
        '<div class="doc prefs">' +
          '<div class="kicker">Personalisation</div>' +
          '<h2>What are you hiring for?</h2>' +
          '<p class="lead">Pick a role. The two most relevant icons will glow, the sticky note rewrites itself, and the assistant will greet you with role-specific context.</p>' +
          '<div class="roles" id="roles" role="radiogroup" aria-label="Role category"></div>' +
          '<div class="rolewhy" id="rolewhy" aria-live="polite"></div>' +
          '<div class="row-actions"><button class="pbtn" id="role-reset" type="button">Show everything</button></div>' +
        '</div>';
      const grid = $('#roles', root), why = $('#rolewhy', root);
      const paint = () => {
        const cur = NM.currentRole();
        $$('.role', grid).forEach((b) => { const on = b.dataset.r === cur; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
        why.innerHTML = cur
          ? '<b>Tailored for ' + esc(D.roles[cur].label) + ':</b> ' + esc(D.roles[cur].why) + '. Look for the glowing icons on the desktop — and ask the assistant anything.'
          : '<span class="fine">No role selected — the desktop is showing everything.</span>';
      };
      D.ROLE_ORDER.forEach((k) => {
        const r = D.roles[k];
        const b = h('<button class="role" type="button" role="radio" aria-checked="false"><span class="ri"></span><b></b></button>');
        b.dataset.r = k;
        $('.ri', b).appendChild(NM.sprites.img(r.glyph));
        $('b', b).textContent = r.label;
        b.addEventListener('click', () => { NM.personalize(k); paint(); });
        grid.appendChild(b);
      });
      $('#role-reset', root).addEventListener('click', () => { NM.personalize(null); paint(); });
      paint();
    },
  };

  /* ================= ACTIVITY MONITOR ================= */
  defs.activity = {
    title: 'Activity Monitor', sprite: 'monitor', w: 780, h: 640,
    content(root) {
      const wrap = h('<div class="doc am"></div>');
      root.appendChild(wrap);
      const render = () => {
        if (!root.isConnected) return;
        const top = root.scrollTop;
        const v = NM.analytics.view();
        const totalClicks = Object.keys(v.projectClicks).reduce((a, k) => a + v.projectClicks[k], 0);
        const best = v.ranked[0] && v.ranked[0].n ? NM.data.works[v.ranked[0].id].label : '—';
        const roleRows = D.ROLE_ORDER.map((k) => ({ l: D.roles[k].label, v: v.recruiter[k] || 0 }));
        const ins = NM.analytics.insights();
        wrap.innerHTML =
          '<div class="am-top"><div><div class="kicker">Analytics &amp; optimisation</div><h2>Live activity' + (v.demo ? ' <span class="demo-tag">DEMO DATA</span>' : '') + '</h2></div>' +
            '<label class="switch"><input type="checkbox" id="am-demo" ' + (v.demo ? 'checked' : '') + '><span class="knob"></span><span class="sl">Load demo data</span></label></div>' +
          '<div class="kpis">' +
            '<div class="kpi"><em>1 · Visitors</em><b>' + v.visitors + '</b><span>visits in this dataset</span></div>' +
            '<div class="kpi"><em>2 · Windows viewed</em><b>' + v.windowsOpened + '</b><span>windows &amp; apps opened</span></div>' +
            '<div class="kpi"><em>3 · Time spent</em><b id="am-live">' + NM.fmtTime(v.sessionSeconds) + '</b><span>this visit · avg ' + NM.fmtTime(v.avgSeconds) + '</span></div>' +
            '<div class="kpi"><em>4 · Projects clicked</em><b>' + totalClicks + '</b><span>across ' + NM.data.WORKS.length + ' pieces of work</span></div>' +
            '<div class="kpi"><em>5 · CV downloads</em><b>' + v.cv + '</b><span>' + (v.visitors ? Math.round((v.cv / v.visitors) * 100) : 0) + '% of visitors</span></div>' +
            '<div class="kpi"><em>6 · Recruiter interactions</em><b>' + v.recruiterTotal + '</b><span>mode selections</span></div>' +
            '<div class="kpi"><em>7 · Assistant questions</em><b>' + v.questionTotal + '</b><span>logged verbatim</span></div>' +
            '<div class="kpi"><em>8 · Most-viewed work</em><b class="sm">' + esc(best) + '</b><span>ranked below</span></div>' +
          '</div>' +
          '<div class="am-cols">' +
            '<section><h3>Most-viewed work · ranked</h3><div class="bars rank">' +
              barRows(v.ranked.map((r, i) => { const w = NM.data.works[r.id]; return { l: '#' + (i + 1) + ' ' + w.label + (w.parent ? ' <span class="fine">· ' + NM.data.folders[w.parent].label + '</span>' : ''), v: r.n, hi: i === 0 && r.n > 0 }; }), { max: Math.max(1, v.ranked[0].n) }) +
            '</div></section>' +
            '<section><h3>Hiring for · recruiter mode</h3><div class="bars">' +
              barRows(roleRows, { max: Math.max(1, Math.max.apply(null, roleRows.map((r) => r.v))) }) +
            '</div></section>' +
          '</div>' +
          '<h3>Assistant question feed</h3>' +
          '<div class="feed" role="log">' +
            (v.questions.length
              ? v.questions.slice(0, 40).map((x) => '<div class="fq' + (x.demo ? ' demo' : '') + '"><span class="ft">' + ago(x.t) + '</span><span class="fx">' + esc(x.q) + '</span><span class="fi2">' + esc(x.intent) + '</span></div>').join('')
              : '<div class="empty">No questions yet — ask the assistant something and it will appear here.</div>') +
          '</div>' +
          '<h3>Insights → what the data would change</h3>' +
          '<div class="insights" id="ins">' +
            (ins.length ? ins.map((i, n) => '<div class="ins"><span class="ii">' + NM.sprites.html(i.icon) + '</span><p>' + i.text + '</p>' + (i.action ? '<button class="pbtn small primary" data-n="' + n + '" type="button">' + i.action.label + '</button>' : '') + '</div>').join('') : '<div class="empty">Not enough data yet. Open a few windows, ask a question — or switch on demo data.</div>') +
          '</div>' +
          '<div class="am-foot"><span class="fine">Stored in this browser\'s localStorage only — nothing is sent anywhere. Demo rows are simulated.</span><button class="pbtn small" id="am-reset" type="button">Reset live data</button></div>';
        root.scrollTop = top;
        $('#am-demo', wrap).addEventListener('change', (e) => { NM.analytics.setDemo(e.target.checked); NM.sfx.play('click'); });
        $('#am-reset', wrap).addEventListener('click', () => { if (confirm('Reset the live analytics stored in this browser?')) { NM.analytics.reset(); NM.sfx.play('reset'); } });
        $$('.ins button', wrap).forEach((b) => b.addEventListener('click', () => {
          const a = ins[Number(b.dataset.n)].action;
          if (a.type === 'reorder') { NM.emit('reorder', NM.analytics.plan()); b.textContent = 'Applied ✓'; b.disabled = true; NM.sfx.play('chime'); }
        }));
      };
      render();
      let last = 0;
      NM.on('analytics', () => { if (root.isConnected) render(); });
      NM.on('tick', (s) => { const el = $('#am-live', wrap); if (el && root.isConnected) el.textContent = NM.fmtTime(s); last = s; });
      NM.on('gamereset', () => {});
    },
  };

  /* ================= ACHIEVEMENTS ================= */
  defs.achievements = {
    title: 'Achievements', sprite: 'trophy', w: 600, h: 560,
    content(root) {
      const render = () => {
        if (!root.isConnected) return;
        const G = NM.game, pr = G.progress();
        const pct = Math.round((G.xp / G.MAX_XP) * 100);
        root.innerHTML =
          '<div class="doc">' +
            '<div class="kicker">System usage</div>' +
            '<h2>Level ' + G.level + (G.level >= 5 ? ' · MAX' : '') + ' <span class="pctbig">' + pct + '%</span></h2>' +
            '<div class="xpbar big" aria-label="Experience ' + pct + ' percent">' + Array.from({ length: 20 }, (_, i) => '<i class="' + (i < Math.round(pct / 5) ? 'f' : '') + '"></i>').join('') + '</div>' +
            '<div class="prog">' +
              '<div><b>' + pr.projects + ' of ' + pr.projectsOf + '</b> projects &amp; case comps explored</div>' +
              '<div><b>' + pr.done + ' of ' + pr.total + '</b> pieces of work explored' + (G.glitch ? ' · <span class="ok">final reward unlocked ★</span>' : ' · explore them all for a final reward') + '</div>' +
            '</div>' +
            '<div class="badges">' +
              G.BADGES.map((b) => {
                const on = G.hasBadge(b.id);
                return '<div class="badge' + (on ? ' on' : '') + '"><span class="bi">' + NM.sprites.html(on ? b.sprite : 'lock') + '</span><b>' + esc(on ? b.name : '???') + '</b><em>' + esc(on ? b.desc : b.hint) + '</em></div>';
              }).join('') +
            '</div>' +
            '<div class="am-foot"><span class="fine">Progress is saved in this browser.</span><button class="pbtn small" id="g-reset" type="button">Reset progress</button></div>' +
          '</div>';
        const rb = $('#g-reset', root);
        if (rb) rb.addEventListener('click', () => { if (confirm('Reset XP, badges and exploration progress?')) { NM.game.reset(); NM.sfx.play('reset'); } });
      };
      render();
      ['xp', 'badge', 'progress', 'glitch'].forEach((e) => NM.on(e, () => { if (root.isConnected) render(); }));
    },
  };
})();
