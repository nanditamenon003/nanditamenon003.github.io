/* apps-os.js — the "system" windows: About, Contact, Build Log, Trash, secret file,
   Messages (AI assistant), Recruiter Mode, Activity Monitor and Achievements. */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;
  const defs = NM.apps.defs;
  const { tabs, barRows } = NM.apps.helpers;
  const D = NM.data;

  const ago = (t) => {
    const s = Math.max(1, Math.round((Date.now() - t) / 1000));
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.round(s / 60) + 'm ago';
    if (s < 86400) return Math.round(s / 3600) + 'h ago';
    return Math.round(s / 86400) + 'd ago';
  };

  // before/after slider used in About and the Build Log
  function transformSlider(host) {
    host.innerHTML =
      '<div class="xf" style="--p:50%">' +
        '<img class="xf-a" src="assets/nandita_photo.jpg" alt="Real headshot of Nandita">' +
        '<div class="xf-b"><img class="px" src="assets/nandita_pixel_avatar.png" alt="AI-generated pixel avatar of Nandita"></div>' +
        '<span class="xf-l l1">REAL PHOTO</span><span class="xf-l l2">AI PIXEL SPRITE</span><i class="xf-line"></i>' +
      '</div>' +
      '<input type="range" min="0" max="100" value="50" class="xf-r" aria-label="Compare the real photo with the AI pixel avatar">';
    const xf = $('.xf', host), r = $('.xf-r', host);
    r.addEventListener('input', () => { xf.style.setProperty('--p', r.value + '%'); NM.sfx.play('tick'); });
  }

  /* ================= ABOUT ================= */
  defs.about = {
    title: 'About Nandita — README.md', sprite: 'about', w: 720, h: 620,
    content(root) {
      root.innerHTML =
        '<div class="doc">' +
          '<div class="about-top">' +
            '<figure class="about-photo"><img src="assets/nandita_photo.jpg" alt="Nandita Menon, smiling, in a navy blazer and pink collared shirt" width="200" height="267"></figure>' +
            '<div class="about-intro">' +
              '<div class="kicker">About · README.md</div>' +
              '<h2>Nandita Menon</h2>' +
              '<p class="lead">Computer-science engineer turned media &amp; brand strategist. I bridge logic and creativity — technology and people.</p>' +
              '<div class="chips"><span>PGDM Media &amp; Entertainment \'27</span><span>WeSchool, Mumbai</span><span>B.Tech CSE \'24</span></div>' +
            '</div>' +
          '</div>' +
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

  /* ================= BUILD LOG ================= */
  const SOUNDS = [['open', 'Window open'], ['close', 'Window close'], ['boot', 'Boot chime'], ['chime', 'Achievement'], ['levelup', 'Level-up'], ['flip', 'Page flip'], ['scan', 'Scanning'], ['trash', 'Trash']];

  defs.buildlog = {
    title: 'Terminal — how_this_was_made.txt', sprite: 'terminal', w: 760, h: 620, cls: 'term',
    content(root) {
      root.innerHTML = '<div class="term-head"><span>nandita@portfolio</span>:<span>~</span>$ cat how_this_was_made.txt</div><div class="term-tabs"></div>';
      const host = $('.term-tabs', root);
      tabs(host, [
        {
          id: 'workflow', label: 'workflow',
          html:
            '<div class="doc term-doc">' +
              '<h2>AI-created, human-directed</h2>' +
              '<p>This assignment grades the <i>creation process</i>, so it is documented here. The short version: Nandita set the concept, supplied the photograph and source documents, and made the decisions; Claude (Anthropic) wrote the code that produced every asset and the site itself; her documents were the source of truth for every fact.</p>' +
              '<ol class="moves">' +
                '<li><b>Direction.</b> The concept (a pixel-art macOS desktop), the palette taken from her blazer, the rubric mapping and the professional-first guardrails came from Nandita\'s written build brief.</li>' +
                '<li><b>Avatar.</b> Claude wrote Python/Pillow code that draws the sprite pixel by pixel, using her photograph as the visual reference. It is not the output of an image-generation model.</li>' +
                '<li><b>Icons, clouds, cursor and dock.</b> AI-written procedural code: each icon is a small pixel map that JavaScript renders to a crisp PNG when the page loads.</li>' +
                '<li><b>Sound pack.</b> AI-written Web Audio code synthesises every sound live in the browser. There are no audio files.</li>' +
                '<li><b>Copy &amp; story.</b> Microcopy, boot text and the assistant\'s answers were drafted by Claude and checked against her resume, decks and reports.</li>' +
                '<li><b>Review &amp; corrections.</b> Nandita reviewed the result and corrected it. Examples: every Black Fungus figure is taken from the deck\'s results table (Inception V3: 98.87% train / 98.25% test), and the Prodyssey card was rewritten from the real deck after a first draft built from her brief.</li>' +
              '</ol>' +
              '<div class="dec"><b>Why procedural code instead of image and audio generators?</b> It was a deliberate technique choice. Code gives exact control of a small palette, stays crisp at any size, needs no separate icon or sound files, is fully editable, raises no licensing questions, and every asset can be regenerated from a few lines. The assets are AI-created either way — the AI simply used code as its brush.</div>' +
              '<h3>Who did what</h3>' +
              '<table class="ttable"><thead><tr><th>Layer</th><th>AI-created</th><th>Human review</th><th>Human source / decision</th></tr></thead><tbody>' +
                '<tr><td>Concept, palette, rubric strategy</td><td></td><td></td><td>✓ Nandita\'s brief and decisions</td></tr>' +
                '<tr><td>Pixel avatar</td><td>✓ Claude (Python/Pillow, pixel by pixel)</td><td>✓ approved</td><td>✓ the photograph</td></tr>' +
                '<tr><td>Icons, clouds, dock, cursor</td><td>✓ Claude (procedural pixel maps)</td><td>✓ reviewed</td><td></td></tr>' +
                '<tr><td>Sound pack</td><td>✓ Claude (Web Audio synthesis)</td><td>✓ reviewed</td><td></td></tr>' +
                '<tr><td>Site code</td><td>✓ Claude Code</td><td>✓ tested</td><td></td></tr>' +
                '<tr><td>Project facts &amp; numbers</td><td></td><td>✓ checked</td><td>✓ her decks, reports, resume</td></tr>' +
                '<tr><td>Microcopy &amp; assistant answers</td><td>✓ drafted</td><td>✓ fact-checked</td><td></td></tr>' +
              '</tbody></table>' +
            '</div>',
        },
        {
          id: 'assets', label: 'assets',
          html:
            '<div class="doc term-doc"><h2>The eight AI-creation categories</h2>' +
            '<table class="ttable"><thead><tr><th>#</th><th>Category</th><th>Status</th><th>Where to see it</th></tr></thead><tbody>' +
              '<tr><td>1</td><td>AI avatar</td><td class="ok">✓ done</td><td>Desktop, chat, landing · drawn by Claude-written Python/Pillow code</td></tr>' +
              '<tr><td>2</td><td>AI image transformation</td><td class="ok">✓ done</td><td>Real photo → pixel sprite, slider below</td></tr>' +
              '<tr><td>3</td><td>AI hero visuals</td><td class="ok">✓ done</td><td>Every icon, cloud, dock item and cursor · procedural code</td></tr>' +
              '<tr><td>4</td><td>AI-assisted copywriting</td><td class="ok">✓ done</td><td>Boot text, badges, chat, empty states</td></tr>' +
              '<tr><td>5</td><td>AI-generated audio</td><td class="ok">✓ done</td><td>Sound pack below · synthesised by AI-written code</td></tr>' +
              '<tr><td>6</td><td>AI-assisted storytelling</td><td class="ok">✓ done</td><td>CS→brand arc told as OS upgrades</td></tr>' +
              '<tr><td>7</td><td>Multimodal content</td><td class="ok">✓ done</td><td>Text + image + audio + interaction + data</td></tr>' +
              '<tr><td>8</td><td>AI video</td><td class="no">– skipped</td><td>Optional; not included</td></tr>' +
            '</tbody></table>' +
            '<h3>Image transformation — before / after</h3><div class="xf-wrap small" id="bl-xf"></div>' +
            '<h3>8-bit sound pack <span class="fine">(synthesised live with the Web Audio API — no audio files)</span></h3><div class="snd" id="bl-snd"></div>' +
            '</div>',
          build(p) {
            transformSlider($('#bl-xf', p));
            const box = $('#bl-snd', p);
            SOUNDS.forEach(([id, label]) => {
              const b = h('<button class="pbtn small" type="button">▶ ' + esc(label) + '</button>');
              b.addEventListener('click', () => NM.sfx.preview(id));
              box.appendChild(b);
            });
          },
        },
        {
          id: 'decisions', label: 'decisions',
          html:
            '<div class="doc term-doc"><h2>Design decisions worth defending</h2>' +
            '<div class="dec"><b>Prototype assistant, not a live API call.</b> An API key in browser JavaScript can be copied by anyone and run up charges, and a static host can\'t hide it. The assignment asks for a prototype of the conversational and personalisation <i>logic</i> — so the assistant is intent-matching over a hand-written knowledge base: zero cost, works offline, can\'t fail on venue wifi, and can\'t invent facts. The code has a switch (<code>NM.config.agentEndpoint</code>) to route to a real model through a serverless proxy later, keeping the key server-side.</div>' +
            '<div class="dec"><b>Analytics in localStorage.</b> A static site has no database, so counts persist per browser. That\'s honest and private (nothing leaves the device); the "Load demo data" toggle exists so the dashboard is populated in a 2-minute presentation.</div>' +
            '<div class="dec"><b>Professional first.</b> A real-photo landing card loads before any pixel art; body copy is a readable sans-serif (the pixel font is UI chrome only); every project window leads with outcomes and metrics.</div>' +
            '<div class="dec"><b>Sound is opt-in; the intro is skippable.</b> Auto-playing audio and long intros cost recruiters\' goodwill.</div>' +
            '<div class="dec"><b>Transparent by design.</b> "Why this answer?" under each reply shows the matched intent and source — applying the findings of her own SIRP on explainable AI.</div>' +
            '<div class="dec"><b>Mobile fallback.</b> Below 768px the desktop metaphor becomes a stacked, tappable layout instead of a broken one.</div>' +
            '</div>',
        },
        {
          id: 'stack', label: 'stack',
          html:
            '<div class="doc term-doc"><h2>Under the hood</h2>' +
            '<div class="chips"><span>HTML</span><span>CSS</span><span>Vanilla JavaScript</span><span>Web Audio API</span><span>Canvas (sprite renderer)</span><span>localStorage</span><span>Press Start 2P</span><span>Inter</span></div>' +
            '<p>No frameworks and no build step. Every icon is a pixel map rendered to a crisp PNG when the page loads, and every sound is synthesised live — there are no icon or audio files. Hosting: GitHub Pages (static). Multimodal by design — text, image, audio and interaction, plus a live analytics layer.</p>' +
            '</div>',
        },
      ]);
    },
  };

  /* ================= TRASH ================= */
  defs.trash = {
    title: 'Trash — Rejected Concepts', sprite: 'trash', w: 560, h: 500,
    content(root) {
      root.innerHTML =
        '<div class="doc">' +
          '<div class="kicker">7 items · you found the trash can</div>' +
          '<h2>Rejected Concepts</h2>' +
          '<p class="lead">Every portfolio has a graveyard. Here\'s this one\'s. Click a file for the autopsy.</p>' +
          '<div class="trashlist" id="tl"></div>' +
          '<div class="fine">A mix of real detours and dramatic licence.</div>' +
        '</div>';
      const list = $('#tl', root);
      D.rejected.forEach((r) => {
        const row = h('<div class="trow"><button class="tfile" type="button"><span class="ti"></span><b></b></button><div class="tnote" hidden></div></div>');
        $('.ti', row).appendChild(NM.sprites.img('pdf'));
        $('b', row).textContent = r.file;
        const note = $('.tnote', row);
        note.innerHTML = '<span></span> <button class="pbtn small" type="button">Restore</button><em class="fine"></em>';
        $('span', note).textContent = r.note;
        $('button.pbtn', note).addEventListener('click', () => { $('em', note).textContent = ' Restore denied — it was rejected for a reason.'; NM.sfx.play('error'); });
        $('.tfile', row).addEventListener('click', () => { note.hidden = !note.hidden; NM.sfx.play('click'); });
        list.appendChild(row);
      });
    },
  };

  /* ================= SECRET ================= */
  defs.secret = {
    title: 'life_outside_work.txt', sprite: 'secret', w: 520, h: 470, cls: 'secretwin',
    content(root) {
      root.innerHTML =
        '<div class="doc">' +
          '<div class="kicker">★ Unlocked · you explored everything</div>' +
          '<h2>Life outside the résumé</h2>' +
          '<ul class="plain big">' +
            '<li><b>Dancing</b> — the original way I learned that rhythm and structure aren\'t opposites.</li>' +
            '<li><b>Reading</b> — usually whatever explains how people decide things.</li>' +
            '<li><b>Games</b> — a Unity/C# course in 2021, a game-dev club, and an international game jam. This portfolio is basically a game with a résumé inside.</li>' +
            '<li><b>Five languages</b> — English, Hindi, Malayalam, Telugu, Tamil. Hyderabad\'s pace, Kerala\'s roots.</li>' +
          '</ul>' +
          '<div class="callout tint">Thanks for going all the way. If something on this desktop made you curious, I\'d genuinely like to hear which part.</div>' +
          '<div class="row-actions"><a class="pbtn primary" href="mailto:' + D.person.email + '?subject=Found%20the%20secret%20file">Tell me which part &gt;</a></div>' +
        '</div>';
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
        $('#am-reset', wrap).addEventListener('click', () => { if (confirm('Reset the live analytics stored in this browser?')) { NM.analytics.reset(); NM.sfx.play('trash'); } });
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
              '<div><b>' + pr.done + ' of ' + pr.total + '</b> explored overall (every piece of work + the trash)' + (G.secret ? ' · <span class="ok">secret file unlocked ★</span>' : '') + '</div>' +
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
        if (rb) rb.addEventListener('click', () => { if (confirm('Reset XP, badges and exploration progress?')) { NM.game.reset(); NM.sfx.play('trash'); } });
      };
      render();
      ['xp', 'badge', 'progress', 'secret'].forEach((e) => NM.on(e, () => { if (root.isConnected) render(); }));
    },
  };
})();
