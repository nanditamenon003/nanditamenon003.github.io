/* apps.js — window contents for the four featured projects and the Experience & Research folder.
   Content leads with outcomes and metrics; bodies use a clean sans-serif (pixel font is chrome only). */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;

  const defs = {};
  NM.apps = { defs, helpers: {} };

  /* ---------- helpers ---------- */

  function tabs(root, list, opts) {
    opts = opts || {};
    const bar = h('<div class="tabs" role="tablist"></div>');
    const panels = h('<div class="tab-panels"></div>');
    const btns = {};
    const pans = {};
    list.forEach((t, i) => {
      const b = h('<button class="tab" role="tab" type="button"></button>');
      b.textContent = t.label;
      const p = h('<div class="tab-panel" role="tabpanel" hidden></div>');
      if (typeof t.html === 'string') p.innerHTML = t.html;
      btns[t.id] = b; pans[t.id] = p;
      b.addEventListener('click', () => show(t.id));
      bar.appendChild(b); panels.appendChild(p);
    });
    const built = {};
    function show(id, silent) {
      list.forEach((t) => {
        const on = t.id === id;
        btns[t.id].classList.toggle('on', on);
        btns[t.id].setAttribute('aria-selected', on);
        pans[t.id].hidden = !on;
      });
      const t = list.find((x) => x.id === id);
      if (t.build && !built[id]) { built[id] = true; t.build(pans[id]); }
      if (!silent) NM.sfx.play('click');
      if (opts.onShow) opts.onShow(id);
    }
    root.appendChild(bar); root.appendChild(panels);
    show(list[0].id, true);
    return { show, panels: pans };
  }

  // A paged "deck" — used by the case-competition windows. Flipping plays the page-flip sound.
  function deck(root, slides) {
    const wrap = h(
      '<div class="deck">' +
        '<div class="deck-stage" aria-live="polite"></div>' +
        '<div class="deck-nav">' +
          '<button class="pbtn small" type="button" data-d="-1" aria-label="Previous slide">‹ Prev</button>' +
          '<div class="deck-dots" role="tablist"></div>' +
          '<button class="pbtn small primary" type="button" data-d="1" aria-label="Next slide">Next ›</button>' +
        '</div>' +
      '</div>'
    );
    const stage = $('.deck-stage', wrap);
    const dots = $('.deck-dots', wrap);
    let i = 0;
    slides.forEach((s, n) => {
      const d = h('<button class="dot" type="button" role="tab"></button>');
      d.setAttribute('aria-label', 'Slide ' + (n + 1) + ': ' + s.title);
      d.addEventListener('click', () => go(n));
      dots.appendChild(d);
    });
    function go(n, silent) {
      n = Math.max(0, Math.min(slides.length - 1, n));
      if (n === i && stage.childElementCount && !silent) return;
      const dir = n >= i ? 1 : -1;
      i = n;
      stage.innerHTML = '';
      const sl = h('<article class="slide"></article>');
      sl.innerHTML = '<div class="slide-kicker">' + (i + 1) + ' / ' + slides.length + ' · ' + esc(slides[i].title) + '</div>' + slides[i].html;
      sl.classList.add(dir > 0 ? 'flip-in' : 'flip-back');
      stage.appendChild(sl);
      if (slides[i].after) slides[i].after(sl);
      $$('.dot', dots).forEach((d, k) => d.classList.toggle('on', k === i));
      $('[data-d="-1"]', wrap).disabled = i === 0;
      $('[data-d="1"]', wrap).disabled = i === slides.length - 1;
      if (!silent) NM.sfx.play('flip');
    }
    wrap.addEventListener('click', (e) => {
      const b = e.target.closest('[data-d]');
      if (b) go(i + Number(b.dataset.d));
    });
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    });
    root.appendChild(wrap);
    go(0, true);
    return { go };
  }

  const barRows = (rows, o) => {
    o = o || {};
    const max = o.max || Math.max.apply(null, rows.map((r) => r.v)) || 1;
    return rows.map((r) =>
      '<div class="brow' + (r.hi ? ' hi' : '') + '"><span class="bl">' + r.l + '</span>' +
      '<span class="bt"><span class="bf" style="width:' + Math.max(2, (r.v / max) * 100) + '%"></span></span>' +
      '<span class="bv">' + (o.fmt ? o.fmt(r.v) : r.v) + '</span></div>'
    ).join('');
  };
  NM.apps.helpers = { tabs, deck, barRows };

  // fake "scanning" beat before the Black Fungus window opens
  NM.apps.scan = function () {
    return new Promise((resolve) => {
      const ov = h(
        '<div class="scan" role="status" aria-live="polite">' +
          '<div class="scan-card"><div class="scan-face"><i></i><i></i></div>' +
          '<div class="scan-t">SCANNING<span class="blink">…</span></div>' +
          '<div class="scan-bar"><b></b></div><div class="scan-s">analysing mycelium patterns</div>' +
          '<button class="pbtn small" type="button">Skip</button></div>' +
        '</div>'
      );
      document.body.appendChild(ov);
      NM.sfx.play('scan');
      const bar = $('.scan-bar b', ov);
      const status = $('.scan-s', ov);
      const msgs = ['analysing mycelium patterns', 'comparing 5 architectures', 'Inception V3 best of 5 · 98.87% train / 98.25% test'];
      let done = false;
      const finish = () => { if (done) return; done = true; ov.classList.add('out'); setTimeout(() => { ov.remove(); resolve(); }, 160); };
      $('button', ov).addEventListener('click', finish);
      requestAnimationFrame(() => { bar.style.width = '100%'; });
      if (!NM.reducedMotion()) {
        setTimeout(() => { status.textContent = msgs[1]; }, 450);
        setTimeout(() => { status.textContent = msgs[2]; }, 900);
        setTimeout(finish, 1350);
      } else finish();
    });
  };

  /* ================= 1. BLACK FUNGUS ================= */
  const MODELS = [
    { l: 'Inception V3', train: 98.87, test: 98.25, hi: true },
    { l: 'ResNet-50', train: 83, test: 91.23 },
    { l: 'MobileNet', train: 99.18, test: 73 },
    { l: 'DenseNet', train: 72, test: 73 },
    { l: 'EfficientNet', train: 59, test: 60 },
  ];

  defs.blackfungus = {
    title: 'Black Fungus Detection', sprite: 'microscope', w: 700, h: 600,
    content(root) {
      root.innerHTML =
        '<div class="doc">' +
          '<div class="kicker">Project 01 · Deep learning · Team-7 · B.Tech CSE</div>' +
          '<h2>An AI that screens for black fungus (mucormycosis) from a face or eye photo</h2>' +
          '<div class="tiles">' +
            '<div class="tile big"><b>98.87% / 98.25%</b><span>Inception V3 train / test accuracy — the top performer of the 5 architectures compared</span></div>' +
            '<div class="tile"><b>5</b><span>deep-learning architectures benchmarked</span></div>' +
            '<div class="tile"><b>Web app</b><span>Flask front end: upload an image → instant prediction</span></div>' +
          '</div>' +
          '<p>Mucormycosis causes discolouration around the nose and eyes, blurred vision and breathing trouble — and early detection matters clinically. The project asks: can an image classifier flag it from ordinary face and eye photos, making screening more accessible and easing the load on clinicians?</p>' +
          '<div class="callout"><b>Best result:</b> <b>Inception V3 — 98.87% train / 98.25% test accuracy</b>, the best of five architectures compared (Inception V3, MobileNet, DenseNet, ResNet-50, EfficientNet). Picking the winner by how each model does on <i>unseen</i> test images is the real technical contribution.</div>' +
          '<h3>All five models, side by side</h3>' +
          '<div class="tscroll"><table class="rtable"><thead><tr><th>Model</th><th>Train accuracy</th><th>Test accuracy</th></tr></thead><tbody>' +
            MODELS.slice().sort((a, b) => b.test - a.test).map((m) =>
              '<tr' + (m.hi ? ' class="best"' : '') + '><td>' + m.l + (m.hi ? ' <span class="star">★ best</span>' : '') + '</td><td>' + m.train + '%</td><td>' + m.test + '%</td></tr>'
            ).join('') +
          '</tbody></table></div>' +
          '<div class="fine">Accuracy figures from the results table in the project deck.</div>' +
          '<div class="callout"><b>Why Inception V3 won:</b> MobileNet scored 99.18% on training data but only 73% on unseen test images — classic overfitting. Inception V3 kept both numbers high (98.87% train, 98.25% test), so it generalised.</div>' +
          '<h3>Visual comparison</h3>' +
          '<div class="seg" role="group" aria-label="Metric"><button class="on" data-m="test" type="button">Test accuracy</button><button data-m="train" type="button">Train accuracy</button></div>' +
          '<div class="bars" id="bf-bars"></div>' +
          '<h3>Pipeline</h3>' +
          '<ol class="steps"><li>Collect face &amp; eye images</li><li>Pre-process &amp; augment</li><li>Train 5 CNNs</li><li>Compare train/test accuracy</li><li>Deploy the best via Flask</li></ol>' +
          '<div class="note">Context: the published models cited in the deck\'s literature review report 96.4%–97.7% accuracy. This is a research prototype on a small dataset, not a clinical tool.</div>' +
          '<h3>Stack</h3><div class="chips"><span>Python</span><span>TensorFlow</span><span>Keras</span><span>Flask</span><span>PyCharm</span></div>' +
          '<div class="fine">Team-7 (4 members) · Project guide: Ms. Prathibhamol C.P. · B.Tech CSE, Amrita Vishwa Vidyapeetham · Dec 2022 – May 2023</div>' +
        '</div>';
      const bars = $('#bf-bars', root);
      function draw(mode) {
        const rows = MODELS.slice().sort((a, b) => b[mode] - a[mode]).map((m) => ({ l: m.l, v: m[mode], hi: m.hi }));
        bars.innerHTML = barRows(rows, { max: 100, fmt: (v) => v + '%' });
      }
      draw('test');
      $$('.seg button', root).forEach((b) => b.addEventListener('click', () => {
        $$('.seg button', root).forEach((x) => x.classList.toggle('on', x === b));
        draw(b.dataset.m);
        NM.sfx.play('click');
      }));
    },
  };

  /* ================= 2. INSTRUCTOR AID ================= */
  const STUDENTS = [
    { n: 'Aarav', m: [78, 84, 69, 91] },
    { n: 'Diya', m: [92, 88, 95, 90] },
    { n: 'Kabir', m: [61, 70, 58, 66] },
    { n: 'Meera', m: [85, 79, 88, 82] },
    { n: 'Rohan', m: [73, 65, 80, 77] },
  ];
  const SUBJECTS = ['Maths', 'Physics', 'CS', 'English'];

  defs.instructor = {
    title: 'Instructor Aid System', sprite: 'gradebook', w: 700, h: 610,
    content(root) {
      const t = tabs(root, [
        {
          id: 'case', label: 'Case file',
          html:
            '<div class="doc">' +
              '<div class="kicker">Project 02 · Desktop app · Team Marin · B.Tech CSE</div>' +
              '<h2>A gradebook that tracks every class a teacher runs — and graphs it for them</h2>' +
              '<div class="tiles">' +
                '<div class="tile big"><b>3</b><span>modules owned: Home Page · Create Account · Dashboard</span></div>' +
                '<div class="tile"><b>5</b><span>person team, UML-first design</span></div>' +
                '<div class="tile"><b>4</b><span>UML views: use-case · class · activity · ER</span></div>' +
              '</div>' +
              '<p><b>The problem:</b> it\'s a hassle for a professor to keep track of every student\'s progress across several classes. <b>The product:</b> log in, create classes, enter marks, and get percentages and performance graphs automatically.</p>' +
              '<h3>What it does</h3>' +
              '<ul class="ticks"><li><b>Instructor login &amp; accounts</b> — each teacher gets a private workspace</li><li><b>Multi-class management</b> — switch between classes from the dashboard</li><li><b>Mark entry &amp; percentage calculator</b> — per student, per subject</li><li><b>Auto-generated graphs</b> — class performance and individual student reports (Matplotlib)</li></ul>' +
              '<div class="callout"><b>Try it →</b> The “Live demo” tab recreates the app\'s dashboard and class profile (with sample students). Edit a mark and watch the percentages and chart update.</div>' +
              '<h3>Stack</h3><div class="chips"><span>Python</span><span>Tkinter</span><span>SQLite3</span><span>Matplotlib</span><span>PIL</span><span>Draw.io / Lucidchart</span></div>' +
              '<div class="fine">Team Marin: B Charan Sai, Satya Harthik S, G Srija, K Nitin Kumar, Nandita Menon · Aug – Oct 2021</div>' +
            '</div>',
        },
        {
          id: 'demo', label: 'Live demo',
          build(p) {
            p.innerHTML = '<div class="tk-wrap"><div class="tk" id="tk"></div><div class="fine center">Sample data — recreated for this portfolio, styled after the original Tkinter dashboard.</div></div>';
            const tk = $('#tk', p);
            const dash = () => {
              tk.innerHTML =
                '<div class="tk-title"><span>Dashboard-IAS</span><span>—&nbsp;&nbsp;☐&nbsp;&nbsp;✕</span></div>' +
                '<div class="tk-head">DashBoard</div>' +
                '<div class="tk-body">' +
                  '<button class="tk-btn tl" type="button" data-a="refresh">Refresh</button>' +
                  '<button class="tk-btn tr" type="button" data-a="signout">Sign Out</button>' +
                  '<button class="tk-btn ml" type="button" data-a="create">Create New Class</button>' +
                  '<div class="tk-info"><b>Your Name: Sample Instructor</b><b>Email: sample@school.edu</b><b>No. of classes: 4</b>' +
                  '<div class="tk-sel"><b>Select Class --&gt;&gt;&gt;</b><select aria-label="Select class"><option>12A</option><option>12B</option><option>11A</option><option>11B</option></select></div>' +
                  '<button class="tk-btn wide" type="button" data-a="proceed">Proceed</button></div>' +
                  '<div class="tk-toast" hidden></div>' +
                '</div>';
              $$('.tk-btn', tk).forEach((b) => b.addEventListener('click', () => {
                NM.sfx.play('click');
                if (b.dataset.a === 'proceed') profile($('select', tk).value);
                else { const to = $('.tk-toast', tk); to.textContent = b.dataset.a === 'refresh' ? 'Refreshed.' : 'Not in this demo — the real app writes this to SQLite.'; to.hidden = false; setTimeout(() => (to.hidden = true), 1400); }
              }));
            };
            const profile = (cls) => {
              const rows = STUDENTS.map((s, i) =>
                '<tr><td>' + s.n + '</td>' + s.m.map((v, j) => '<td><input type="number" min="0" max="100" value="' + v + '" data-i="' + i + '" data-j="' + j + '" aria-label="' + s.n + ' ' + SUBJECTS[j] + '"></td>').join('') + '<td class="pct" id="pct' + i + '"></td></tr>'
              ).join('');
              tk.innerHTML =
                '<div class="tk-title"><span>Class Profile-IAS · ' + esc(cls) + '</span><span>—&nbsp;&nbsp;☐&nbsp;&nbsp;✕</span></div>' +
                '<div class="tk-head">Class Profile · ' + esc(cls) + '</div>' +
                '<div class="tk-body prof">' +
                  '<table class="tk-table"><thead><tr><th>Student</th>' + SUBJECTS.map((s) => '<th>' + s + '</th>').join('') + '<th>%</th></tr></thead><tbody>' + rows + '</tbody></table>' +
                  '<div class="tk-graph" id="tkg"></div>' +
                  '<button class="tk-btn" type="button" data-a="back">◀ Back to dashboard</button>' +
                '</div>';
              const calc = () => {
                const totals = SUBJECTS.map(() => 0);
                STUDENTS.forEach((s, i) => {
                  let sum = 0;
                  $$('input[data-i="' + i + '"]', tk).forEach((inp) => {
                    const v = Math.max(0, Math.min(100, Number(inp.value) || 0));
                    sum += v; totals[Number(inp.dataset.j)] += v;
                  });
                  $('#pct' + i, tk).textContent = (sum / SUBJECTS.length).toFixed(1) + '%';
                });
                $('#tkg', tk).innerHTML = '<div class="tk-gt">Class average by subject</div>' + SUBJECTS.map((s, j) => {
                  const avg = totals[j] / STUDENTS.length;
                  return '<div class="tk-bar"><span>' + s + '</span><i style="height:' + avg + '%"></i><em>' + avg.toFixed(0) + '</em></div>';
                }).join('');
              };
              calc();
              $$('input', tk).forEach((inp) => inp.addEventListener('input', calc));
              $('[data-a="back"]', tk).addEventListener('click', () => { NM.sfx.play('click'); dash(); });
            };
            dash();
          },
        },
      ]);
      return t;
    },
  };

  /* ================= FOLDER WINDOWS (Case Comps + Experience & Research) =================
     A row of "files"; clicking one opens that piece of work underneath. Each file is its own unit of work:
     it counts once for analytics ("projects clicked"), XP and exploration progress. Opening the folder alone counts for nothing. */
  function folderWindow(root, ctx, o) {
    const order = (NM.store.get('nm_cardorder', {}) || {})[o.folder];
    const items = o.items.slice();
    if (order && order.length === items.length) items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    root.innerHTML =
      '<div class="doc">' +
        '<div class="kicker">' + esc(o.kicker) + '</div>' +
        '<h2>' + esc(o.title) + '</h2>' +
        '<p class="lead">' + esc(o.lead) + '</p>' +
        '<div class="files three"></div>' +
        '<div class="expdetail" aria-live="polite"></div>' +
      '</div>';
    const files = $('.files', root), detail = $('.expdetail', root);
    let current = null;

    function show(id) {
      const it = items.find((x) => x.id === id);
      if (!it || id === current) return;
      current = id;
      $$('.file', files).forEach((x) => x.classList.toggle('on', x.dataset.id === id));
      detail.innerHTML = '';
      it.render(detail);
      detail.classList.remove('rise'); void detail.offsetWidth; detail.classList.add('rise');
      detail.scrollIntoView({ behavior: NM.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      NM.sfx.play('flip');
      NM.analytics.track.windowOpen('card:' + id); // "pages viewed"
      // a piece of work feeds projects clicked + XP + exploration progress; other cards (e.g. Glitch) use their own hook
      if (NM.data.works[id]) NM.workOpened(id); else if (o.onCard) o.onCard(id);
    }

    items.forEach((it) => {
      const f = h('<button class="file" type="button"><span class="fi"></span><b></b><em></em><small></small></button>');
      f.dataset.id = it.id;
      $('.fi', f).appendChild(NM.sprites.img(it.sprite));
      $('b', f).textContent = it.title;
      $('em', f).textContent = it.tag;
      $('small', f).textContent = it.blurb;
      f.addEventListener('click', () => show(it.id));
      files.appendChild(f);
    });

    // the assistant / mobile layout can ask an already-open folder to show a card
    NM.on('folder:show', (e) => { if (root.isConnected && e.folder === o.folder) show(e.card); });
    if (ctx && ctx.card) show(ctx.card);
  }

  NM.apps.helpers.folderWindow = folderWindow;

  /* ================= 3. CASE COMPS ================= */
  const brandSlides = [
        {
          title: 'The result',
          html:
            '<div class="kicker">IMT Ghaziabad · Team Queen Bees</div>' +
            '<h2>2nd Runner-Up: turning Bata\'s flat footwear business into a backpack growth story</h2>' +
            '<div class="tiles"><div class="tile big"><b>₹220–350 Cr</b><span>obtainable market in 3 years (SOM)</span></div><div class="tile"><b>12–14%</b><span>CAGR of India\'s backpack &amp; travel-gear market</span></div><div class="tile"><b>18 mo</b><span>phased national rollout plan</span></div></div>' +
            '<p>The case asked teams to evaluate Bata across consumer persona, competitor positioning, supply-chain fit, financial performance and risk. Team Queen Bees (Swati Yadav, Himani Gera, Nandita Menon) found the growth adjacency hiding next to the core business.</p>',
        },
        {
          title: 'The problem',
          html:
            '<h2>A large, trusted business that has stopped growing</h2>' +
            '<div class="cmp"><div><span class="cv">₹35,544 Cr</span><span class="cl">FY25 net sales</span></div><div class="ca">vs</div><div><span class="cv">₹35,403 Cr</span><span class="cl">FY24 net sales</span></div><div class="cd">+0.4%</div></div>' +
            '<ul class="ticks"><li><b>Category concentration:</b> growth leans almost entirely on footwear; bags and accessories are under-scaled and under-promoted.</li><li><b>Squeezed core:</b> the below-₹1,000 footwear segment has shrunk from ~50% to ~30% of the market.</li><li><b>Shopper signal:</b> 70%+ of urban shoppers say they will pay more for durable, high-quality products.</li></ul>',
        },
        {
          title: 'The white space',
          html:
            '<h2>Size the prize: TAM → SAM → SOM</h2>' +
            '<div class="funnel">' +
              '<div class="fn f1"><b>₹15,000 Cr</b><span>TAM · India backpacks &amp; travel gear, growing 12–14% a year</span></div>' +
              '<div class="fn f2"><b>₹11,000–12,000 Cr</b><span>SAM · School ₹3–3.5k · College ₹2–2.5k · Office ₹2.5–3k · Travel ₹3.5–4k Cr</span></div>' +
              '<div class="fn f3"><b>₹220–350 Cr</b><span>SOM · in 3 yrs via 1,900 stores &amp; 35–40M annual store visits (upside ₹400–500 Cr with D2C)</span></div>' +
            '</div>',
        },
        {
          title: 'Positioning',
          html:
            '<h2>Own the empty quadrant: affordable <i>and</i> durable</h2>' +
            '<div class="map"><div class="ax ay">▲ DURABILITY</div><div class="ax ax2">PRICE ▶</div>' +
              '<div class="q gap"><b>★ Bata Move</b><span>affordable, durable, branded · ₹800–2,000 — few branded players compete here</span></div>' +
              '<div class="q"><b>Premium travel gear</b><span>strong quality, ₹3,000–10,000+</span></div>' +
              '<div class="q"><b>Unbranded local bags</b><span>₹300–700 · massive volume, low trust, weak margins</span></div>' +
              '<div class="q"><b>Stylish but pricey</b><span>not always built for Indian durability needs</span></div></div>' +
            '<div class="note">Price runs left → right, durability bottom → top. The top-left quadrant — high durability at a low price — is the gap.</div>',
        },
        {
          title: 'Four lines',
          html:
            '<h2>Four sub-lines, three personas</h2>' +
            '<div class="cards4">' +
              '<div class="mini"><b>Bata Move School</b><span>₹500–1,000</span><em>~265M students, 1–2 bags a year</em></div>' +
              '<div class="mini"><b>Bata Move Work</b><span>₹1,200–2,000</span><em>~120M office commuters · anti-theft, laptop sleeve</em></div>' +
              '<div class="mini"><b>Bata Move Day</b><span>₹800–1,500</span><em>~40M college students · trendy, multi-use</em></div>' +
              '<div class="mini"><b>Bata Move Travel</b><span>₹1,500–4,000</span><em>₹15,000 Cr luggage market, ~14% CAGR</em></div>' +
            '</div>' +
            '<div class="chips"><span>The School Mom · 30–45 · ₹1,000–1,500</span><span>The Urban Commuter · 24–35 · ₹2,000–3,000</span><span>The College Trendsetter · 17–24 · ₹1,200–1,800</span></div>',
        },
        {
          title: 'Rollout & numbers',
          html:
            '<h2>An 18-month plan with the maths behind it</h2>' +
            '<div class="tl3"><div><b>Months 1–3</b><span>Pilot in 300–400 COCO &amp; premium franchise stores (metros, Tier-1)</span></div><div><b>Months 4–9</b><span>Scale to 500+ franchises &amp; top 5,000 multi-brand outlets; enter Tier-2/3/4</span></div><div><b>Months 10–18</b><span>Omnichannel: Bata.in + Amazon, Flipkart, Myntra</span></div></div>' +
            '<div class="tiles"><div class="tile"><b>₹125 Cr</b><span>Year 1 (range ₹100–150 Cr)</span></div><div class="tile"><b>₹350 Cr</b><span>Year 2 (range ₹300–400 Cr)</span></div><div class="tile"><b>42–50%</b><span>gross margin, in line with footwear</span></div></div>' +
            '<div class="note">Break-even ≈ 2.1 lakh units (~5 bags per store per day across 1,200 stores). 3-year revenue CAGR ≈ 55–60%.</div>',
        },
        {
          title: 'Risk & guardrails',
          html:
            '<h2>Ambitious, but with a capped downside</h2>' +
            '<ul class="ticks"><li><b>Cap the bet:</b> ₹20–30 Cr initial investment vs Bata\'s ~₹100 Cr annual capex — a “test and scale” project.</li><li><b>Protect the master brand</b> (~70% of sales): launch under a sub-brand (“Bata Move” / “Bata Transit”) with digital-first storytelling and a Bata endorsement for trust.</li><li><b>Credibility first:</b> school partnerships and corporate laptop-bag programmes before experimental designs.</li><li><b>KPI gates:</b> break-even near ₹12–15 Cr category revenue and a 9–12 month payback; rationalise SKUs if KPIs are missed after 4–6 seasons.</li></ul>',
        },
  ];

  /* ---- Marketing Bowl 3.0 (tote bag deck) ---- */
  const bowlSlides = [
    {
      title: 'The result',
      html:
        '<div class="kicker">IIM Sirmaur · Marketing Bowl 3.0 · Team PitchPerfect</div>' +
        '<h2>1st Runner-Up: making the tote bag the everyday alternative to plastic</h2>' +
        '<div class="tiles"><div class="tile big"><b>1st</b><span>Runner-Up · IIM Sirmaur Marketing Bowl 3.0</span></div><div class="tile"><b>3</b><span>customer personas, from students to young professionals</span></div><div class="tile"><b>₹30 vs ₹5</b><span>tote (discounted from ₹60) vs single-use plastic at the counter</span></div></div>' +
        '<p>A go-to-market strategy positioning a cloth tote bag as the sustainable alternative to plastic bags. The brand, <b>मृदा</b>, promises <i>“Not just a bag, but a lifestyle choice.”</i></p>' +
        '<div class="fine">Team PitchPerfect: Chaitali Behrani, Jeslin Jiji, Nandita Menon, Neeraj Nair · Welingkar, Mumbai.</div>',
    },
    {
      title: 'Brand positioning',
      html:
        '<h2>“Not just a bag, but a lifestyle choice”</h2>' +
        '<ul class="ticks"><li><b>Sustainability</b> — eco-friendly materials, reusable, cuts plastic waste</li><li><b>Style &amp; personal expression</b> — stylish designs that represent your lifestyle</li><li><b>Convenience</b> — durable, washable, easy to carry</li></ul>' +
        '<div class="chips"><span>College</span><span>Grocery shopping</span><span>Travel</span><span>Fashion &amp; casual</span></div>' +
        '<img class="deckshot" src="assets/tote_brand_positioning.jpg" alt="Brand positioning slide from the Marketing Bowl deck: positioning statement, three pillars, consumer benefits and four segments" loading="lazy">',
    },
    {
      title: 'Target audience',
      html:
        '<h2>Three shoppers, one pain point: forgetting the bag</h2>' +
        '<div class="cards3">' +
          '<div class="mini"><b>The Conscious Student</b><span>18–24 · ₹150–400</span><em>Eco-aware Gen Z. Buys snacks, groceries, books. Often forgets reusable bags and ends up with plastic. Needs a lightweight, foldable, trendy bag that fits a backpack.</em></div>' +
          '<div class="mini"><b>The Everyday Shopper</b><span>28–45 · ₹200–500</span><em>Urban household buyer. Groceries, vegetables, pharmacy. Frequently pays for plastic bags on grocery runs. Needs strong, reusable, washable fabric.</em></div>' +
          '<div class="mini"><b>The Urban Convenience Seeker</b><span>23–35 · ₹300–700</span><em>Young professional. Lunch items, quick retail stops. Unplanned commute purchases lead to plastic. Needs a compact, foldable tote that fits a work bag.</em></div>' +
        '</div>',
    },
    {
      title: 'Marketing strategy',
      html:
        '<h2>Two moves: build the habit, remove the friction</h2>' +
        '<div class="cards4">' +
          '<div class="mini"><b>1 · Social campaign</b><span>#CarryYourStory</span><em>Users share what they carry and how their tote reflects their lifestyle — on Instagram, YouTube Shorts and TikTok. Goal: position totes as stylish everyday essentials, not just eco-friendly alternatives.</em></div>' +
          '<div class="mini"><b>2 · Retail partnership</b><span>₹5 plastic → ₹30 tote</span><em>Partner with supermarkets and grocery stores to offer the tote at the billing counter, at the exact moment a customer needs a bag (tote discounted from ₹60).</em></div>' +
        '</div>' +
        '<div class="callout"><b>Consumer insight:</b> most people buy plastic bags not by preference, but because they forgot to carry one.</div>' +
        '<div class="callout tint"><b>Make the switch.</b> Carry a tote bag when you step out · Say NO to plastic at checkout counters · Make sustainable &amp; conscious choices.</div>',
    },
  ];

  /* ---- Prodyssey: rewritten from the real deck ---- */
  // The OLD vs NEW workflow, redrawn from the deck's "Process comparison" slide (same nodes, same flow).
  const PC = { grey: '#BDB2AA', green: '#00C060', yellow: '#FFDE59', lav: '#E0AAF5', ink: '#1A2442', arrow: '#7A3B5C' };
  function pcNode(o) {
    const cx = o.x + o.w / 2, cy = o.y + o.h / 2, n = o.t.length, lh = 13;
    const shape = o.ellipse
      ? '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + o.w / 2 + '" ry="' + o.h / 2 + '" fill="' + o.fill + '" stroke="' + PC.ink + '" stroke-width="2"/>'
      : '<rect x="' + o.x + '" y="' + o.y + '" width="' + o.w + '" height="' + o.h + '" rx="' + (o.sq ? 3 : o.h / 2) + '" fill="' + o.fill + '" stroke="' + PC.ink + '" stroke-width="2"/>';
    const lines = o.t.map((s, i) => '<tspan x="' + cx + '" y="' + (cy - ((n - 1) * lh) / 2 + i * lh + 4) + '">' + s + '</tspan>').join('');
    return shape + '<text text-anchor="middle" font-size="11.5" font-weight="700" fill="' + PC.ink + '" font-family="Inter,system-ui,sans-serif">' + lines + '</text>';
  }
  const pcArrow = (id, x1, y1, x2, y2) => '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + PC.arrow + '" stroke-width="2.5" marker-end="url(#' + id + ')"/>';
  function pcSvg(kind) {
    const id = 'pc-ah-' + kind;
    const marker = '<defs><marker id="' + id + '" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="' + PC.arrow + '"/></marker></defs>';
    let body;
    if (kind === 'old') {
      body =
        pcArrow(id, 142, 53, 177, 53) + pcArrow(id, 235, 78, 235, 104) + pcArrow(id, 198, 160, 172, 184) +
        pcNode({ x: 30, y: 30, w: 110, h: 46, t: ['Peer Review'], fill: PC.grey }) +
        pcNode({ x: 180, y: 30, w: 110, h: 46, t: ['Student', 'Review'], fill: PC.grey }) +
        pcNode({ x: 173, y: 105, w: 124, h: 60, t: ['Batch', 'Creation'], fill: PC.yellow, ellipse: true }) +
        pcNode({ x: 345, y: 64, w: 110, h: 46, t: ['H5P', 'Training'], fill: PC.green }) +
        pcNode({ x: 18, y: 104, w: 116, h: 46, t: ['Remaining', 'Work'], fill: PC.lav, sq: true }) +
        pcNode({ x: 100, y: 186, w: 120, h: 46, t: ['H5P', 'Development'], fill: PC.green });
    } else {
      body =
        pcArrow(id, 142, 47, 187, 45) + pcArrow(id, 232, 68, 192, 102) + pcArrow(id, 217, 127, 267, 127) + pcArrow(id, 350, 160, 350, 179) +
        pcNode({ x: 20, y: 24, w: 120, h: 46, t: ['Content', 'Creation'], fill: PC.grey }) +
        pcNode({ x: 190, y: 20, w: 110, h: 46, t: ['Peer Review'], fill: PC.grey }) +
        pcNode({ x: 105, y: 104, w: 110, h: 46, t: ['Student', 'Review'], fill: PC.grey }) +
        pcNode({ x: 270, y: 98, w: 160, h: 58, t: ['Interactive Element', 'Development'], fill: PC.lav, sq: true }) +
        pcNode({ x: 290, y: 181, w: 120, h: 46, t: ['Slide &amp; Test'], fill: PC.green });
    }
    const label = kind === 'old'
      ? 'Old workflow: peer review, student review, batch creation, H5P development, with separate H5P training and remaining work'
      : 'New workflow: content creation, peer review, student review, interactive element development, slide and test';
    return '<svg class="pc-svg" viewBox="0 0 480 250" role="img" aria-label="' + label + '">' + marker + body + '</svg>';
  }

  const prodysseySlides = [
    {
      title: 'The result',
      html:
        '<div class="kicker">IIM Indore · Team Pro Pulse</div>' +
        '<h2>National Finalist: keeping a 19-college open-textbook project alive when the world shut down</h2>' +
        '<div class="tiles"><div class="tile big"><b>19</b><span>partner colleges building one open-access digital textbook</span></div><div class="tile"><b>20</b><span>chapters, plus interactive content and teaching materials</span></div><div class="tile"><b>Aug 2020</b><span>target completion, ready for Fall 2020 courses</span></div></div>' +
        '<p>The Open Educational Resources (OER) project had finished recruitment and content creation when it planned a two-day in-person sprint to finalise and integrate every chapter and interactive element. Then COVID-19 closed campuses and travel — and faculty, already moving their own teaching online, had little time to spare.</p>' +
        '<div class="callout"><b>The question:</b> postpone, cancel, or pivot to a virtual sprint — and if the last, how do you make it work?</div>',
    },
    {
      title: 'The crisis',
      html:
        '<h2>From on-track to lockdown in one month</h2>' +
        '<div class="cards4">' +
          '<div class="mini"><b>Before Jan 2020 · Planning</b><em>Secure partners, define scope, set the workflow for the 20-chapter build.</em></div>' +
          '<div class="mini"><b>Jan 2020 · Phases 1 &amp; 2</b><em>Outlining, resource assignment and foundational content.</em></div>' +
          '<div class="mini"><b>Mar 2020 · Phase 3</b><em>Content writing under way, heading for the August 2020 completion target.</em></div>' +
          '<div class="mini"><b>Mar 2020 · Crisis</b><em>Lockdown cancels the Phase 4 in-person content review and editing sprint.</em></div>' +
        '</div>',
    },
    {
      title: 'The problem',
      html:
        '<h2>Five challenges, one immovable deadline</h2>' +
        '<ul class="ticks"><li>No availability for two full-day sprints</li><li>No common time to synchronise across institutions</li><li>Personal and family constraints on contributors</li><li>Different platforms and software in use</li><li>Institutional withdrawal of support</li></ul>' +
        '<div class="chips"><span>Different calendars &amp; time zones</span><span>Low bandwidth in remote areas</span><span>H5P interactive-content training needed</span><span>Task management</span><span>No common software</span></div>' +
        '<div class="callout"><b>The dilemma:</b> can the plan be adapted rapidly for remote execution, or should the initiative be cancelled? Are contributors equipped to go virtual-only immediately — with content due for Fall 2020 and extreme uncertainty about who would be available?</div>',
    },
    {
      title: 'The solution',
      html:
        '<h2>Train, reassign, upskill, reinforce</h2>' +
        '<ol class="moves">' +
          '<li><b>Train on the tools.</b> Concise instructional videos on using Confluence and Jira for the project, made with the technical support team.</li>' +
          '<li><b>Reassign, don\'t stall.</b> Contributors unable or unwilling to write content, but willing to peer-review, move onto the review team.</li>' +
          '<li><b>Upskill students.</b> Students trained for a week in H5P interactive elements.</li>' +
          '<li><b>Call in reinforcements.</b> An official request to the Subject Matter Experts from Sontario College, who were due at the sprint, to help complete content tasks.</li>' +
        '</ol>' +
        '<img class="deckshot" src="assets/prodyssey_jira.jpg" alt="Screenshots from the deck: the Jira board and a Module 1 task with assignee and status updates" loading="lazy">' +
        '<div class="fine">From the deck: the Jira board and task assignment used to run the project.</div>',
    },
    {
      title: 'Old vs new workflow',
      html:
        '<h2>The process comparison: old vs new</h2>' +
        '<div class="ba pc" id="ba">' +
          '<div class="ba-layer after"><div class="ba-tag">NEW · asynchronous agile</div>' + pcSvg('new') +
            '<div class="pc-list good"><span>Flexible and parallel workflow</span><span>Continuous improvement with module-wise development</span><span>Better resource utilisation</span></div></div>' +
          '<div class="ba-layer before" id="ba-before"><div class="ba-tag">OLD · in-person sprint</div>' + pcSvg('old') +
            '<div class="pc-list bad"><span>Batch creation at the end of the day</span><span>2-day commitment</span><span>Time-consuming and sequential</span></div></div>' +
          '<div class="ba-line" id="ba-line"></div>' +
        '</div>' +
        '<div class="ba-ctl"><button class="pbtn small" type="button" data-v="100">Old</button>' +
          '<label class="ba-range">Drag to compare <span>old ⇄ new</span><input type="range" id="ba-r" min="0" max="100" value="50" aria-label="Compare the old and new workflow"></label>' +
          '<button class="pbtn small" type="button" data-v="0">New</button></div>' +
        '<div class="fine">Redrawn from the “Process comparison” slide in the Prodyssey deck.</div>',
      after(sl) {
        const r = $('#ba-r', sl), before = $('#ba-before', sl), line = $('#ba-line', sl);
        const set = () => {
          const v = Number(r.value);
          before.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
          line.style.left = v + '%';
        };
        let sweep = null;
        const stopSweep = () => { if (sweep) { clearInterval(sweep); sweep = null; } };
        r.addEventListener('input', () => { stopSweep(); set(); NM.sfx.play('tick'); });
        r.addEventListener('pointerdown', stopSweep);
        // "Old" shows the whole old workflow (slider fully right), "New" the whole new one
        $$('.ba-ctl [data-v]', sl).forEach((b) => b.addEventListener('click', () => { stopSweep(); r.value = b.dataset.v; set(); NM.sfx.play('flip'); }));
        set();
        // a gentle sweep so the interaction is discoverable
        if (!NM.reducedMotion()) {
          let v = 50, dir = 1, swept = false;
          sweep = setInterval(() => {
            v += dir * 3;
            if (v >= 80) dir = -1;
            if (v <= 20 && dir < 0) { dir = 1; swept = true; }
            r.value = v; set();
            if (swept && v >= 50) { stopSweep(); r.value = 50; set(); }
          }, 30);
        }
      },
    },
    {
      title: 'Asynchronous agile',
      html:
        '<h2>Asynchronous agile development</h2>' +
        '<ol class="moves">' +
          '<li><b>Early start.</b> Faculty begin content creation from Week 4 of Phase 3; any drop in faculty efficiency is balanced by a bigger workforce.</li>' +
          '<li><b>Modular work (the Deming principle).</b> Working in modules allows quality checks early, instead of waiting until the end of each chapter.</li>' +
          '<li><b>Best use of resources.</b> Modules are divided between teaching staff and student groups A and B; students and technical staff build the interactive elements, slide decks and tests — continuous improvement, less faculty workload.</li>' +
          '<li><b>Sprint division.</b> The work runs in sprints, and rework is done at the end of each sprint rather than stopping the process to fix things first.</li>' +
        '</ol>',
    },
    {
      title: 'Working model',
      html:
        '<h2>A working model to test the plan before committing</h2>' +
        '<p>The team built a spreadsheet model of the whole situation — number of faculty, workforce efficiency, working hours, modules per chapter, hours per activity — that returns the days needed to finish. Change a variable and the completion time moves, so decision-makers can adjust the plan with evidence.</p>' +
        '<img class="deckshot" src="assets/prodyssey_working_model.jpg" alt="The team\'s working-model spreadsheet from the deck, showing inputs such as modules, sprints and faculty, and the calculated completion time" loading="lazy">' +
        '<ul class="ticks"><li>A “module” is the minimum threshold of a variable, which exposes risks to the minimum viable product (MVP).</li><li>Trying different resource allocations per activity reveals the best configuration.</li></ul>' +
        '<div class="callout"><b>The finding:</b> an ideal scenario where the project completes on time — assuming a <b>10% drop in faculty efficiency</b>, unchanged efficiency for the rest of the workforce, and <b>fewer faculty</b> (allowing for internet-infrastructure issues and some unwilling to take part).</div>',
    },
    {
      title: 'Team & my part',
      html:
        '<h2>Team Pro Pulse</h2>' +
        '<div class="chips"><span>Pankaj Kukreja</span><span>Shubham Choudhary</span><span>Riya Mukesh Khanna</span><span>Diya Atul Trivedi</span><span>Atharva Sumedh Sarfare</span><span>Nandita Menon</span></div>' +
        '<div class="fine">Prin. L. N. Welingkar Institute of Management Development and Research, Mumbai.</div>' +
        '<div class="callout"><b>My part:</b> built the project delivery schedule and used Jira to manage task assignment and parallel workflows.</div>' +
        '<div class="note">Skills on show: project planning, dependency thinking, tool-led collaboration, scenario modelling.</div>',
    },
  ];

  defs.casecomps = {
    title: 'Case Comps', sprite: 'podium', w: 780, h: 660,
    content(root, ctx) {
      folderWindow(root, ctx, {
        folder: 'casecomps',
        kicker: 'Folder · 3 case competitions',
        title: 'Case competitions',
        lead: 'National case competitions, each with a full deck. Open a file to flip through it.',
        items: [
          { id: 'brand', sprite: 'sneaker', tag: 'IMT Ghaziabad · 2nd Runner-Up', title: 'Brand Alchemy', blurb: 'Bata backpack strategy · Team Queen Bees', render: (d) => deck(d, brandSlides) },
          { id: 'bowl', sprite: 'heart', tag: 'IIM Sirmaur · 1st Runner-Up', title: 'Marketing Bowl 3.0', blurb: 'Tote bag vs plastic · Team PitchPerfect', render: (d) => deck(d, bowlSlides) },
          { id: 'prodyssey', sprite: 'kanban', tag: 'IIM Indore · National Finalist', title: 'Prodyssey', blurb: 'Moving a 19-college textbook project online · Team Pro Pulse', render: (d) => deck(d, prodysseySlides) },
        ],
      });
    },
  };

  /* ================= 4. EXPERIENCE & RESEARCH (exactly three cards) ================= */
  const EXP = [
    {
      id: 'sip', sprite: 'pdf', tag: 'Internship · May–Jun 2026', title: 'SIP · Tommy Hilfiger',
      blurb: 'Customer Relationship Officer intern · Express Avenue, Chennai',
      html:
        '<div class="tiles"><div class="tile big"><b>108.3%</b><span>of her individual May sales target</span></div><div class="tile"><b>₹19.25L+</b><span>revenue generated in 52 days</span></div><div class="tile"><b>3.7 vs 2.54</b><span>UPT: CRM preview vs store baseline</span></div></div>' +
        '<p><b>Research question:</b> can CRM clienteling raise basket density — and can that lift be told apart from the effect of discounting? She compared a members-only CRM preview (24 Jun) with the public EOSS (26 Jun).</p>' +
        '<div class="chartcap">Average selling price per unit</div>' +
        '<div class="bars">' + barRows([{ l: 'CRM preview · max 40% off', v: 4186, hi: true }, { l: 'Public EOSS · max 50% off', v: 3380 }], { max: 4600, fmt: (v) => '₹' + v.toLocaleString('en-IN') }) + '</div>' +
        '<div class="callout"><b>The ASP inversion:</b> the day with the <i>shallower</i> discount sold at the <i>higher</i> price. The basket premium came from customer segmentation (pre-qualified Platinum members), not discount depth — a threshold discount (“spend ₹30,000 for 40% off”) then rewarded basket stacking.</div>' +
        '<ul class="ticks"><li>Ran CRM tele-clienteling via Olabi, segmenting Silver / Gold / Platinum members; ATV ₹15,506 on the preview day</li><li>Applied multi-buy look-building and checkout impulse-attachment to protect transaction value</li><li>Re-merchandised the floor size-wise before the public sale — supporting a record ₹11.03L store day (28 Jun)</li><li>Owned end-of-day financial reconciliation during high-volume sale periods</li></ul>' +
        '<details class="more"><summary>Read more: objectives, my cycles, recommendations</summary><div class="more-body">' +
          '<h4>Objectives</h4><ol class="moves compact"><li>Measure the impact of CRM tele-clienteling on UPT and ATV against the store baseline</li><li>Compare consultative look-building with the size-wise layout</li><li>Separate CRM-driven basket gains from general markdown effects</li></ol>' +
          '<h4>My individual cycles</h4>' +
          '<div class="tscroll"><table class="rtable left"><thead><tr><th>Cycle</th><th>Net sales</th><th>Target</th><th>Bills</th><th>Basket</th></tr></thead><tbody>' +
            '<tr><td>May · full price</td><td>₹10,82,654</td><td><b>108.3%</b> of ₹10L</td><td>93</td><td>UPT 2.6 vs store 2.52 · ATV ₹10,909</td></tr>' +
            '<tr><td>June · end-of-season sale</td><td>₹8,44,715</td><td>84.5%</td><td>—</td><td>UPT 1.9 · ASP ₹4,616 vs store ₹4,447</td></tr>' +
          '</tbody></table></div>' +
          '<p class="fine">In June, UPT dipped to 1.9 because the sale drove single-item markdown purchases — but my ASP still beat the store baseline.</p>' +
          '<h4>Store context</h4><ul class="ticks"><li>May: the store hit <b>105.5%</b> of its target</li><li>Record single-day store revenue: <b>₹11,02,793</b></li></ul>' +
          '<div class="callout"><b>Category insight:</b> kidswear was 16% of units but only 8% of value, yet grew <b>+24%</b> like-for-like — so the report recommends family-wardrobe cross-merchandising.</div>' +
          '<h4>Other recommendations</h4><ul class="ticks"><li><b>Multi-buy framework:</b> Buy 2 Get 10%, Buy 3 Get 20%</li><li><b>Checkout impulse attachments</b> to protect ATV</li><li><b>WhatsApp video fit consultations</b> to cut digital returns</li></ul>' +
          '<div class="note"><b>Limitations:</b> single store, observational design (association, not proof of causation), and a two-day sharpest comparison window. The report proposes a controlled multi-day comparison next.</div>' +
        '</div></details>',
    },
    {
      id: 'sirp', sprite: 'pdf', tag: 'Research · May–Jul 2026', title: 'SIRP · AI & Privacy',
      blurb: 'Systematic literature review on algorithmic transparency and explainable AI',
      html:
        '<div class="tiles"><div class="tile big"><b>39</b><span>ABDC-rated studies reviewed (PRISMA 2020)</span></div><div class="tile"><b>6</b><span>themes synthesised with the TCCM framework</span></div><div class="tile"><b>6</b><span>future-research directions proposed</span></div></div>' +
        '<p><b>Paper:</b> <i>Algorithmic Transparency and Explainable AI in Resolving the Personalization–Privacy Paradox.</i> The paradox: people want personalised experiences but are uneasy about the data they need.</p>' +
        '<div class="callout"><b>Core finding:</b> transparency is <i>necessary but not sufficient</i>. It builds trust when it is specific, timely and paired with real user control — and can backfire when disclosure is generic or one-off, making people feel more watched.</div>' +
        '<div class="callout tint"><b>Reflexive note:</b> this portfolio applies its own findings — the assistant explains <i>why</i> it answered (“Why this answer?”), and sound is opt-in, giving visitors control.</div>' +
        '<details class="more"><summary>Read more: questions, six themes, contribution, agenda</summary><div class="more-body">' +
          '<h4>Research questions</h4><ol class="moves compact"><li><b>RQ1:</b> how has research examined the role of transparency and explainable AI in the personalization–privacy paradox?</li><li><b>RQ2:</b> what gaps and future directions remain?</li></ol>' +
          '<h4>Six themes</h4><div class="themes">' + '<div class="theme">' + NM.sprites.html('cabinet') + '<span><i>A</i><b>Foundations of the paradox</b></span></div>' + '<div class="theme">' + NM.sprites.html('monitor') + '<span><i>B</i><b>Transparency as a fix — and its own paradoxes</b></span></div>' + '<div class="theme">' + NM.sprites.html('gear') + '<span><i>C</i><b>Explainable AI in personalization</b></span></div>' + '<div class="theme">' + NM.sprites.html('lock') + '<span><i>D</i><b>User control &amp; consent design</b></span></div>' + '<div class="theme">' + NM.sprites.html('chat') + '<span><i>E</i><b>Consumer responses: reactance &amp; trust</b></span></div>' + '<div class="theme">' + NM.sprites.html('pdf') + '<span><i>F</i><b>Regulation &amp; ethics (GDPR / DSA)</b></span></div>' + '</div>' +
          '<div class="callout"><b>Original contribution:</b> reconciled contradictory studies — Karwatzki (2017) found transparency had no effect on disclosure, while Cloarec (2024) found a positive one. Transparency works when it is <b>specific, timely and paired with real control</b>; it backfires when it is generic.</div>' +
          '<h4>Future research agenda</h4><ol class="moves compact"><li>Why transparency backfires</li><li>Measuring explainability</li><li>Long-term field studies</li><li>Cross-cultural and Indian evidence</li><li>When transparency intensifies the paradox</li><li>High-stakes and financial services</li></ol>' +
          '<div class="note"><b>Limitations:</b> Scopus only, a single reviewer, and a corpus heavy with 2025–26 studies.</div>' +
        '</div></details>',
    },
    {
      id: 'gcl', sprite: 'pdf', tag: 'Client project · Nov 2025–Apr 2026', title: 'GCL · ShastraVerse',
      blurb: 'PostGenie AI prototype + research for Digital Dogs Pvt. Ltd.',
      html:
        '<div class="kicker">The prototype</div>' +
        '<div class="tiles"><div class="tile big"><b>PostGenie AI</b><span>An AI-powered, end-to-end content co-creation platform — proposed and prototyped by our team</span></div><div class="tile"><b>1 platform</b><span>ideation, creation and planning in one place, instead of tool-hopping</span></div><div class="tile"><b>My role</b><span>Research Analyst &amp; Presenter</span></div></div>' +
        '<div class="row-actions"><a class="pbtn primary" href="https://post-genie-aimagic.lovable.app/" target="_blank" rel="noopener">Try the live prototype &gt;</a><span class="fine">Opens in a new tab</span></div>' +
        '<h3>App interface: from idea to post in seconds</h3>' +
        '<div class="phones">' +
          '<figure><img src="assets/postgenie-1-login.jpg" alt="PostGenie AI login screen: Welcome back, with email and password fields and Google sign-in" loading="lazy" width="400" height="866"><figcaption>Log in</figcaption></figure>' +
          '<figure><img src="assets/postgenie-2-home.jpg" alt="PostGenie AI home screen: What would you like to create today? with Create Post, Make Reel, Design Graphic and Plan Content options" loading="lazy" width="400" height="866"><figcaption>Home</figcaption></figure>' +
          '<figure><img src="assets/postgenie-3-brandkit.jpg" alt="PostGenie AI Brand Kit setup, step 1 of 5: brand name, tagline, niche and target audience" loading="lazy" width="400" height="866"><figcaption>Brand Kit setup</figcaption></figure>' +
          '<figure><img src="assets/postgenie-4-planner.jpg" alt="PostGenie AI Content Planner: a monthly calendar and an idea bank" loading="lazy" width="400" height="866"><figcaption>Content Planner</figcaption></figure>' +
        '</div>' +
        '<h3>What the prototype does</h3>' +
        '<ul class="ticks"><li><b>Create Post</b> — AI-powered caption and design</li><li><b>Make Reel</b> — script and video in minutes</li><li><b>Design Graphic</b> — templates and brand colours</li><li><b>Plan Content</b> — a calendar, content pillars and an idea bank</li><li><b>Brand Kit</b> — a 5-step setup so every post feels authentically yours</li></ul>' +
        '<div class="callout"><b>Core insight:</b> content success rests on strong hooks, storytelling, consistency and authenticity. AI boosts speed but still needs human input — which is why PostGenie AI is a controlled, hybrid tool rather than a one-click generator.</div>' +
        '<h3>Why not just Canva + ChatGPT?</h3>' +
        '<p>The creators we interviewed juggled separate tools: Canva, Figma and Adobe for design, ChatGPT and Claude for ideas and copy. PostGenie AI brings that into one place.</p>' +
        '<div class="tscroll"><table class="rtable vs"><thead><tr><th></th><th>Existing tools</th><th>PostGenie AI</th></tr></thead><tbody>' +
          '<tr><td>Workflow</td><td>Multiple separate tools for ideation, design and writing</td><td>One platform</td></tr>' +
          '<tr><td>Content</td><td>Limited: text or design, generated separately</td><td>Complete</td></tr>' +
          '<tr><td>Personalisation</td><td>Limited, often generic</td><td>Customised</td></tr>' +
          '<tr><td>Iteration</td><td>Mostly one-time output</td><td>Refined</td></tr>' +
          '<tr><td>Strategy</td><td>Weak</td><td>Strong</td></tr>' +
          '<tr><td>Authenticity</td><td>Artificial</td><td>Real</td></tr>' +
        '</tbody></table></div>' +
        '<div class="note"><b>Next steps (from the deck):</b> copyright-safe content, licensed assets and plagiarism checks · performance insights · social-platform integration · continuous testing and feedback.</div>' +
        '<h3>The research behind it</h3>' +
        '<div class="tiles"><div class="tile big"><b>15+</b><span>interviews: creators &amp; marketers at Nykaa, NODWIN Gaming, Jio Creative Labs</span></div><div class="tile"><b>6</b><span>stage AI-powered content journey</span></div><div class="tile"><b>1</b><span>client: Digital Dogs Pvt. Ltd.</span></div></div>' +
        '<p>For Digital Dogs Pvt. Ltd., a Mumbai content agency, the team studied how AI is reshaping content creation — mapping where AI fits into the content lifecycle, and where it doesn\'t yet.</p>' +
        '<div class="journey"><span>1<b>Discovery</b></span><span>2<b>Ideation</b></span><span>3<b>Creation</b></span><span>4<b>Review</b></span><span>5<b>Publishing</b></span><span>6<b>Performance</b></span></div>' +
        '<div class="callout"><b>Key insight:</b> fragmented workflows — content passing through many disconnected tools — were the biggest inefficiency across the lifecycle. That is the problem PostGenie AI is built to solve.</div>' +
        '<div class="fine">Team of six: Nandita Menon (Research Analyst &amp; Presenter), Pranjal Sankhla, Hrishi Rathod, Mrinal Baramwal, Tisha Patel, Revati Joshi · Global Citizen Leadership, WeSchool.</div>',
    },
  ];

  defs.experience = {
    title: 'Experience & Research', sprite: 'cabinet', w: 740, h: 640,
    content(root, ctx) {
      folderWindow(root, ctx, {
        folder: 'experience',
        kicker: 'Folder · 3 items',
        title: 'Internship, research and client work',
        lead: 'Open a file. Each one leads with the outcome.',
        items: EXP.map((c) => Object.assign({}, c, { render: (d) => { d.innerHTML = '<h3>' + esc(c.title) + '</h3>' + c.html; } })),
      });
    },
  };
})();
