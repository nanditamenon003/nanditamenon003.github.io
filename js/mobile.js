/* mobile.js — below 768px the desktop metaphor becomes a stacked, tappable layout
   (same content, same analytics, same gamification — just no windows to drag). */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;
  const D = NM.data;

  const CARDS = [
    ['blackfungus', 'Deep learning · Inception V3: 98.87% train / 98.25% test'],
    ['instructor', 'A gradebook app for teachers'],
    ['casecomps', 'Brand Alchemy · Marketing Bowl · Prodyssey'],
    ['experience', 'Internship, research & client work'],
    ['about', 'The short story'],
    ['buildlog', 'How the AI workflow made this site'],
    ['activity', 'Live analytics & insights'],
    ['trash', 'Rejected concepts'],
  ];
  const SECRET_CARD = ['secret', 'You explored everything'];
  const LABELS = {
    blackfungus: 'Black Fungus Detection', instructor: 'Instructor Aid System', casecomps: 'Case Comps',
    experience: 'Experience & Research', about: 'About Nandita', buildlog: 'how_this_was_made.txt', activity: 'Activity Monitor',
    trash: 'Trash', secret: 'life_outside_work.txt',
  };
  const SPRITES = { blackfungus: 'microscope', instructor: 'gradebook', casecomps: 'podium', experience: 'cabinet', about: 'about', buildlog: 'terminal', activity: 'monitor', trash: 'trash', secret: 'secret' };

  let root = null;
  const opened = {};

  function expand(id, scroll, ctx) {
    const card = $('.m-card[data-app="' + id + '"]', root);
    if (!card) return false;
    const body = $('.m-card-b', card);
    const btn = $('.m-card-h', card);
    const open = btn.getAttribute('aria-expanded') === 'true';
    if (open && !scroll) {
      btn.setAttribute('aria-expanded', 'false');
      body.hidden = true;
      return true;
    }
    btn.setAttribute('aria-expanded', 'true');
    body.hidden = false;
    if (!opened[id]) {
      opened[id] = true;
      if (id === 'blackfungus') NM.apps.scan().then(() => {});
      NM.apps.defs[id].content(body, ctx);
      if (id === 'buildlog') body.classList.add('term');
    }
    NM.emit('wm:open', id);
    NM.sfx.play('open');
    if (scroll) setTimeout(() => card.scrollIntoView({ behavior: NM.reducedMotion() ? 'auto' : 'smooth', block: 'start' }), 60);
    return true;
  }

  function build() {
    root = $('#mobile');
    const P = D.person;
    root.innerHTML =
      '<header class="m-head"><img class="px" src="assets/nandita_pixel_avatar.png" alt="">' +
        '<div class="m-id"><b>Nandita Menon</b><span>' + esc(P.tagline) + '</span></div>' +
        '<button type="button" class="m-snd" id="m-snd" aria-pressed="false" aria-label="Turn on 8-bit sound">♪</button>' +
        '<span class="m-stats"><span class="m-xp" id="m-xp">LV1 · 0%</span><span class="m-prog" id="m-prog" title="Every project and every folder card counts; something is hidden">Explored 0/9</span></span></header>' +
      '<section class="m-sec m-hero">' +
        '<div class="plabel">PORTFOLIO.EXE</div>' +
        '<p>Computer-science engineer turned media &amp; brand strategist. PGDM Media &amp; Entertainment \'27, WeSchool Mumbai.</p>' +
        '<div class="m-actions"><button class="pbtn primary" type="button" id="m-cv">Resume PDF</button>' +
          '<a class="pbtn" href="' + P.linkedin + '" target="_blank" rel="noopener" data-k="linkedin">LinkedIn</a>' +
          '<a class="pbtn" href="' + P.github + '" target="_blank" rel="noopener" data-k="github">GitHub</a>' +
          '<a class="pbtn" href="mailto:' + P.email + '" data-k="email">Email</a></div>' +
        '<p class="fine">This is the compact view. Open the link on a laptop for the full pixel-art desktop.</p>' +
      '</section>' +
      '<section class="m-sec m-role"><h2>What are you hiring for?</h2><div class="m-chips" id="m-chips"></div><p class="rolewhy" id="m-why" aria-live="polite"></p></section>' +
      '<section class="m-sec"><h2>Work &amp; more</h2><div class="m-cards" id="m-cards"></div></section>' +
      '<section class="m-sec" id="m-ask"><h2>Ask me anything</h2><div class="m-chatbox" id="m-chat"></div></section>' +
      '<section class="m-sec" id="m-contact"><h2>Contact</h2><div id="m-contact-b"></div></section>' +
      '<footer class="m-foot">Built with AI assistance · <button type="button" class="linkbtn" id="m-log">how this was made</button></footer>';

    const cards = $('#m-cards', root);
    const makeCard = (id, sub) => {
      const c = h('<article class="m-card" data-app="' + id + '"><button type="button" class="m-card-h" aria-expanded="false"><span class="mi"></span><span class="mt"><b></b><em></em></span><i aria-hidden="true">+</i></button><div class="m-card-b" hidden></div></article>');
      $('.mi', c).appendChild(NM.sprites.img(SPRITES[id]));
      $('b', c).textContent = LABELS[id];
      $('em', c).textContent = sub;
      $('.m-card-h', c).addEventListener('click', () => {
        expand(id, false);
        const isOpen = $('.m-card-h', c).getAttribute('aria-expanded') === 'true';
        $('i', c).textContent = isOpen ? '–' : '+';
      });
      cards.appendChild(c);
    };
    CARDS.forEach(([id, sub]) => makeCard(id, sub));
    // the secret file appears once everything has been explored (same rule as the desktop)
    const addSecret = () => { if (!$('.m-card[data-app="secret"]', root)) makeCard(SECRET_CARD[0], SECRET_CARD[1]); };
    if (NM.game.secret) addSecret();
    NM.on('secret', () => { addSecret(); const c = $('.m-card[data-app="secret"]', root); if (c) c.classList.add('sparkle'); });

    const chips = $('#m-chips', root);
    D.ROLE_ORDER.forEach((k) => {
      const b = h('<button type="button" class="chip" data-r="' + k + '"></button>');
      b.textContent = D.roles[k].label;
      b.addEventListener('click', () => NM.personalize(NM.currentRole() === k ? null : k));
      chips.appendChild(b);
    });

    NM.agent.mount($('#m-chat', root), { focus: false });
    // contact block reuses the desktop window content
    NM.apps.defs.contact.content($('#m-contact-b', root));

    $('#m-cv', root).addEventListener('click', () => NM.downloadCV('mobile'));
    $$('.m-actions a', root).forEach((a) => a.addEventListener('click', () => NM.analytics.track.contact(a.dataset.k)));
    $('#m-log', root).addEventListener('click', () => show('buildlog'));
    $('#m-snd', root).addEventListener('click', () => NM.sfx.toggle());

    const paintXp = () => { $('#m-xp', root).textContent = (NM.game.level >= 5 ? 'MAX' : 'LV' + NM.game.level) + ' · ' + Math.round((NM.game.xp / NM.game.MAX_XP) * 100) + '%'; };
    const paintProg = () => { const p = NM.game.progress(); $('#m-prog', root).textContent = 'Explored ' + p.done + '/' + p.total; };
    NM.on('xp', paintXp);
    NM.on('progress', paintProg);
    paintProg();
    NM.on('sound', (on) => { const b = $('#m-snd', root); b.setAttribute('aria-pressed', on); b.classList.toggle('on', on); });
    paintXp();
  }

  function applyRole(role) {
    const r = role && D.roles[role];
    $$('.m-chips .chip', root).forEach((c) => c.classList.toggle('on', c.dataset.r === role));
    $('#m-why', root).innerHTML = r ? '<b>Tailored for ' + esc(r.label) + ':</b> ' + esc(r.why) + '.' : '';
    $$('.m-card', root).forEach((c) => {
      const on = !!(r && r.glow.indexOf(c.dataset.app) > -1);
      c.classList.toggle('glow', on);
      c.classList.toggle('dim', !!(r && !on && c.dataset.app !== 'secret' && c.dataset.app !== 'about'));
    });
    if (r) {
      // float the two best-fit cards to the top of the list
      const list = $('#m-cards', root);
      r.glow.slice().reverse().forEach((id) => { const c = $('.m-card[data-app="' + id + '"]', root); if (c) list.prepend(c); });
    }
  }

  function show(id) {
    if (id === 'ama') { $('#m-ask', root).scrollIntoView({ behavior: 'smooth' }); return; }
    if (id === 'contact') { $('#m-contact', root).scrollIntoView({ behavior: 'smooth' }); return; }
    if (id === 'recruiter') { $('.m-role', root).scrollIntoView({ behavior: 'smooth' }); return; }
    if (id === 'resume') { NM.downloadCV('mobile'); return; }
    // a card inside a folder: expand the folder card, then show that card
    const w = NM.data.works[id];
    if (w && w.parent) {
      const first = !opened[w.parent];
      expand(w.parent, true, { card: id });
      if (!first) NM.emit('folder:show', { folder: w.parent, card: id });
      return;
    }
    if (!expand(id, true)) $('.m-cards', root).scrollIntoView({ behavior: 'smooth' });
  }

  NM.mobile = { build, show, applyRole };
})();
