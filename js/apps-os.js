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

  // Bio typewriter — plays once per page session, on the About window's first open only
  let aboutBioTyped = false;
  function typeInto(el, text, speed) {
    return new Promise((resolve) => {
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      el.appendChild(cursor);
      (function step() {
        if (i < text.length) {
          cursor.insertAdjacentText('beforebegin', text.charAt(i));
          i++;
          setTimeout(step, speed);
        } else {
          setTimeout(() => { cursor.remove(); resolve(); }, 500);
        }
      })();
    });
  }

  /* ================= ABOUT ================= */
  const ABOUT_BIO1 = "Hyderabad's pace and Kerala's roots taught me early that the best ideas sit between two worlds. I studied Computer Science, which gave me a strong base in logical thinking — but I kept gravitating to the creative, people-facing side of technology: a game-development club, an international game jam, and an internship designing educational games for children under a government initiative.";
  const ABOUT_BIO2 = "That instinct pulled me toward management. At WeSchool I've kept testing it from different angles: selling and doing CRM on a premium retail floor, researching how transparency builds (or breaks) trust in AI, and mapping AI in content creation for a media client — alongside national case competitions that taught me to think on my feet.";

  defs.about = {
    title: 'About Nandita — README.md', sprite: 'about', w: 720, h: 620,
    content(root) {
      const skillRow = (name, pct) => '<div class="skrow"><span>' + name + '</span><span class="skbar"><span class="skfill" data-w="' + pct + '"></span></span></div>';
      root.innerHTML =
        '<div class="doc">' +
          '<div class="about-top">' +
            '<figure class="about-photo">' +
              '<div class="photo-toggle" id="about-toggle" tabindex="0" role="button" aria-label="Compare the real photo and the pixel avatar">' +
                '<img class="ph-real" src="assets/nandita_photo.jpg" alt="Nandita Menon, smiling, in a navy blazer and pink collared shirt" width="200" height="267">' +
                '<img class="ph-pixel px" src="assets/nandita_pixel_avatar.png" alt="Pixel-art avatar of Nandita Menon" width="200" height="267">' +
              '</div>' +
              '<div class="photo-label" id="about-photo-label" aria-live="polite">the real one</div>' +
            '</figure>' +
            '<div class="about-intro">' +
              '<div class="kicker">About · README.md</div>' +
              '<h2>Nandita Menon</h2>' +
              '<p class="lead">Computer-science engineer turned media &amp; brand strategist. I bridge logic and creativity — technology and people.</p>' +
              '<div class="chips"><span>PGDM Media &amp; Entertainment \'27</span><span>WeSchool, Mumbai</span><span>B.Tech CSE \'24</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="tiles stats4">' +
            '<div class="tile big"><span class="stat-ico">' + NM.sprites.html('gear') + '</span><b>CS Engineer → Brand Strategist</b></div>' +
            '<div class="tile"><span class="stat-ico">' + NM.sprites.html('trophy') + '</span><b>2</b><span>case comp wins</span></div>' +
            '<div class="tile"><span class="stat-ico">' + NM.sprites.html('star') + '</span><b>₹19.25L</b><span>sales closed</span></div>' +
            '<div class="tile"><span class="stat-ico">' + NM.sprites.html('pdf') + '</span><b>39</b><span>papers reviewed</span></div>' +
          '</div>' +
          '<div class="bio-type"><p id="bio-p1"></p><p id="bio-p2"></p></div>' +
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
            '<div><h3>Skills</h3><div class="skilltree" id="about-skills">' +
              '<div class="skbranch"><i class="skbranch-t">Technical</i>' + skillRow('Python', 82) + skillRow('Machine learning', 75) + skillRow('MySQL', 68) + skillRow('HTML/CSS/JS', 78) + '</div>' +
              '<div class="skbranch"><i class="skbranch-t">Marketing</i>' + skillRow('Digital marketing', 88) + skillRow('AI &amp; analytics', 80) + skillRow('Power BI', 76) + skillRow('Excel', 85) + '</div>' +
              '<div class="skbranch"><i class="skbranch-t">Creative</i>' + skillRow('Game design', 65) + '</div>' +
            '</div>' +
            '<h3>Languages</h3><div class="chips"><span>English</span><span>Hindi</span><span>Malayalam</span><span>Telugu</span><span>Tamil</span></div></div>' +
            '<div><h3>Certifications</h3><ul class="plain"><li>Google Ads — Search, Display, Video</li><li>KPMG India — Sustainability (16 hrs)</li><li>Johns Hopkins — HTML, CSS &amp; JS (2020)</li><li>UC — C for Everyone (2023)</li><li>Udemy — C# Unity Game Developer (2021)</li><li>Udemy — Web Developer Bootcamp (2025)</li></ul></div>' +
          '</div>' +
          '<h3>Also</h3><ul class="plain"><li>Senior Committee Member, Guruvandana — WeSchool\'s industry-mentor engagement initiative</li><li>SIP 2026 volunteer — on-ground operations for new-student registration</li></ul>' +
        '</div>';

      const toggle = $('#about-toggle', root), label = $('#about-photo-label', root);
      const setPhoto = (on) => { toggle.classList.toggle('flipped', on); label.textContent = on ? 'the 8-bit one' : 'the real one'; };
      if (matchMedia('(hover: hover)').matches) {
        toggle.addEventListener('mouseenter', () => setPhoto(true));
        toggle.addEventListener('mouseleave', () => setPhoto(false));
        toggle.addEventListener('focus', () => setPhoto(true));
        toggle.addEventListener('blur', () => setPhoto(false));
      } else {
        toggle.addEventListener('click', () => setPhoto(!toggle.classList.contains('flipped')));
      }
      toggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPhoto(!toggle.classList.contains('flipped')); } });

      requestAnimationFrame(() => requestAnimationFrame(() => {
        $$('.skfill', root).forEach((el) => { el.style.width = el.dataset.w + '%'; });
      }));

      const p1 = $('#bio-p1', root), p2 = $('#bio-p2', root);
      if (aboutBioTyped) {
        p1.textContent = ABOUT_BIO1;
        p2.textContent = ABOUT_BIO2;
      } else {
        aboutBioTyped = true;
        (async () => { await typeInto(p1, ABOUT_BIO1, 12); await typeInto(p2, ABOUT_BIO2, 12); })();
      }
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
