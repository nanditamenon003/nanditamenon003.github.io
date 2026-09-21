/* glitch.js — the hidden "Glitch" folder: the final reward, unlocked by exploring all 8 pieces of work.
   Three cards: the game-dev origin story, life outside work, and a Photos-style album. */
(function () {
  'use strict';
  const NM = window.NM;
  const { $, $$, h, esc } = NM;
  const defs = NM.apps.defs;
  const { folderWindow } = NM.apps.helpers;
  const D = NM.data;

  /* ---------- Card 1: the origin story ---------- */
  function renderOrigin(d) {
    d.innerHTML =
      '<div class="kicker">Origin story</div>' +
      '<h2>Glitch: where the game-dev instinct started</h2>' +
      '<p><b>Glitch</b> was my game development club during my undergrad. It is where I first learned that the quickest way to understand a system is to build a small, playable version of it — and then let people poke at it.</p>' +
      '<div class="tiles">' +
        '<div class="tile big"><b>Unity Game Jam</b><span>I took part in an International Unity Game Jam competition</span></div>' +
        '<div class="tile"><b>Organiser</b><span>I also helped organise the event at my college</span></div>' +
        '<div class="tile"><b>Carried on</b><span>Educational games for children at Ammachi Labs (2022)</span></div>' +
      '</div>' +
      '<p>A game jam means building a playable game against a tight deadline. Competing in one, and then helping to host it at my college, meant seeing it from both sides: as a builder and as an organiser.</p>' +
      '<div class="callout"><b>Why this portfolio looks like a game.</b> That background is the real reason this site is a pixel-art, game-like desktop instead of a conventional page. Game design taught me to treat a visitor like a player: give them a clear first step, reward curiosity, and hide something for the people who keep going. You just found it.</div>' +
      '<div class="chips"><span>Unity</span><span>C#</span><span>Game jam</span><span>Event organising</span><span>Game design</span></div>';
  }

  /* ---------- Card 2: life outside work ---------- */
  const LIFE = [
    { icons: ['headphones'], t: 'Music', d: 'I love listening to music. There is almost always something playing.' },
    { icons: ['coffee'], t: 'Café hopping', d: 'I enjoy exploring new cafés. Suggest one I have not tried and I am in.' },
    { icons: ['cat', 'dog'], t: 'Cats and dogs, equally', d: 'I love both, and I firmly refuse to pick a side in the cats-versus-dogs debate. Consider me a neutral party.' },
    { icons: ['star'], t: 'Dancing', d: 'A long-time favourite.' },
    { icons: ['gradebook'], t: 'Reading', d: 'Another long-time favourite.' },
    { icons: ['gamepad'], t: 'Games', d: 'A Unity/C# course in 2021, my college game-dev club, an international game jam — and this portfolio, which is basically a game with a résumé inside.' },
    { icons: ['chat'], t: 'Five languages', d: 'English, Hindi, Malayalam, Telugu and Tamil. Hyderabad’s pace, Kerala’s roots.' },
  ];

  function renderLife(d) {
    d.innerHTML =
      '<div class="kicker">Beyond the résumé</div>' +
      '<h2>Life outside work</h2>' +
      '<p class="lead">The short, unofficial version of me.</p>' +
      '<ul class="interests">' +
        LIFE.map((x) =>
          '<li><span class="int-ico' + (x.icons.length > 1 ? ' pair' : '') + '">' + x.icons.map((i) => NM.sprites.html(i)).join('') + '</span>' +
          '<span class="int-txt"><b>' + esc(x.t) + '</b><em>' + esc(x.d) + '</em></span></li>'
        ).join('') +
      '</ul>' +
      '<div class="callout tint">You made it to the last level. If something on this desktop made you curious, I would genuinely like to hear which part.</div>' +
      '<div class="row-actions"><a class="pbtn primary" href="mailto:' + D.person.email + '?subject=Found%20the%20Glitch">Tell me which part &gt;</a></div>';
  }

  /* ---------- Card 3: Photos-style album ---------- */
  const PHOTOS = [
    { cap: 'Café bench, four-legged company', alt: 'Nandita sitting on a wooden bench at a dog-friendly café, smiling down at a small black dog on her lap while a fluffy Pomeranian rests beside her' },
    { cap: 'Red walls, good mood', alt: 'Nandita smiling with her head tilted, wearing a blue floral top, in front of a glowing red wall with a neon sign' },
    { cap: 'Lap fully occupied', alt: 'Two kittens, one ginger and one black and white, curled up together on Nandita’s lap' },
    { cap: 'Saree day', alt: 'Nandita standing on a paved street in a cream and gold saree with a red blouse, eyes closed, smiling' },
  ].map((p, i) => Object.assign(p, { full: 'assets/album/album-' + (i + 1) + '.jpg', thumb: 'assets/album/album-' + (i + 1) + '-thumb.jpg' }));

  function renderAlbum(d) {
    d.innerHTML =
      '<div class="album" tabindex="-1">' +
        '<div class="album-bar"><span class="album-title">Photos</span><span class="album-count">Library · ' + PHOTOS.length + ' photos</span></div>' +
        '<div class="album-grid" role="list"></div>' +
        '<div class="album-view" hidden>' +
          '<div class="av-bar"><button type="button" class="pbtn small av-back">‹ Library</button><span class="av-cap" aria-live="polite"></span><span class="av-count"></span></div>' +
          '<div class="av-stage">' +
            '<button type="button" class="av-nav av-prev" aria-label="Previous photo">‹</button>' +
            '<img class="av-img" alt="" width="840" height="1120">' +
            '<button type="button" class="av-nav av-next" aria-label="Next photo">›</button>' +
          '</div>' +
          '<div class="fine av-hint">Use the arrow keys, the buttons, or swipe. Esc goes back to the library.</div>' +
        '</div>' +
      '</div>';
    const root = $('.album', d), grid = $('.album-grid', d), view = $('.album-view', d);
    const img = $('.av-img', d), cap = $('.av-cap', d), count = $('.av-count', d);
    const prev = $('.av-prev', d), next = $('.av-next', d);
    let cur = -1;

    PHOTOS.forEach((p, i) => {
      const b = h('<button type="button" class="ph" role="listitem"><img loading="lazy" width="300" height="400"><span class="ph-cap"></span></button>');
      const im = $('img', b);
      im.src = p.thumb; im.alt = p.alt;
      $('.ph-cap', b).textContent = p.cap;
      b.addEventListener('click', () => open(i));
      grid.appendChild(b);
    });

    function show(i) {
      cur = Math.max(0, Math.min(PHOTOS.length - 1, i));
      const p = PHOTOS[cur];
      img.src = p.full; img.alt = p.alt;
      cap.textContent = p.cap;
      count.textContent = (cur + 1) + ' / ' + PHOTOS.length;
      prev.disabled = cur === 0; next.disabled = cur === PHOTOS.length - 1;
      // warm the neighbours so paging feels instant
      [cur - 1, cur + 1].forEach((n) => { if (PHOTOS[n]) { const pre = new Image(); pre.src = PHOTOS[n].full; } });
    }
    function open(i) {
      grid.hidden = true; $('.album-bar', d).hidden = true; view.hidden = false;
      show(i); NM.sfx.play('flip');
      root.focus({ preventScroll: true });
      root.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
    function close() {
      view.hidden = true; grid.hidden = false; $('.album-bar', d).hidden = false;
      NM.sfx.play('click');
      const b = $$('.ph', grid)[cur]; if (b) b.focus({ preventScroll: true });
    }
    const go = (n) => { if (n >= 0 && n < PHOTOS.length && n !== cur) { show(n); NM.sfx.play('flip'); } };

    prev.addEventListener('click', () => go(cur - 1));
    next.addEventListener('click', () => go(cur + 1));
    $('.av-back', d).addEventListener('click', close);
    root.addEventListener('keydown', (e) => {
      if (view.hidden) return;
      if (e.key === 'ArrowRight') { go(cur + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { go(cur - 1); e.preventDefault(); }
      else if (e.key === 'Escape') { close(); e.stopPropagation(); } // back to the library instead of closing the window
    });
    // swipe on touch screens
    let sx = null;
    const stage = $('.av-stage', d);
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 45) go(dx < 0 ? cur + 1 : cur - 1);
    });
    stage.addEventListener('pointercancel', () => { sx = null; });
  }

  /* ---------- the folder window ---------- */
  defs.glitch = {
    title: 'Glitch', sprite: 'glitch', w: 780, h: 660, cls: 'glitchwin',
    content(root, ctx) {
      folderWindow(root, ctx, {
        folder: 'glitch',
        kicker: '★ Hidden folder · unlocked',
        title: 'You found the Glitch',
        lead: 'The last level: a few things that do not fit on a résumé.',
        items: [
          { id: 'glitch', sprite: 'gamepad', tag: 'Game dev club · undergrad', title: 'Glitch', blurb: 'Where the game-dev instinct started', render: renderOrigin },
          { id: 'life', sprite: 'heart', tag: 'Beyond the résumé', title: 'Life Outside Work', blurb: 'Music, cafés, cats, dogs and more', render: renderLife },
          { id: 'album', sprite: 'photo', tag: PHOTOS.length + ' photos', title: 'Photo Album', blurb: 'A few of my favourites', render: renderAlbum },
        ],
        // a reward, not "work": XP and a badge only, never part of the 8 that unlock it
        onCard: (id) => { NM.game.award('glitchcard:' + id, 3); },
      });
    },
  };
})();
