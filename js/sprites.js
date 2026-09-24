/* sprites.js — every icon on the desktop is a hand-authored pixel map, rendered to a crisp PNG at runtime.
   16x16 grids; each character is one pixel. No external image files needed. */
(function () {
  'use strict';
  const NM = window.NM;

  const PAL = {
    k: '#1A2442', // navy outline
    w: '#FFFFFF',
    c: '#FFF3E3', // cream
    p: '#FF8FB8', // pink
    q: '#FFC2DA', // light pink
    o: '#FFB27A', // peach
    y: '#FFD86B', // yellow
    Y: '#E9A93B', // deep yellow
    l: '#A996EE', // lavender
    L: '#DCD1FB', // light lavender
    m: '#7FE0B8', // mint
    e: '#3FBF8C', // green
    g: '#8C96B0', // grey
    G: '#D3D9E8', // light grey
    b: '#6BA6F2', // blue
    B: '#3559A8', // deep blue
    r: '#EF5F6B', // red
    n: '#9C6B45', // brown
    N: '#D9A574', // light brown
    t: '#2FD6C5', // teal
  };

  const DEFS = {
    // ---- desktop: projects ----
    microscope: [
      '......kkkk......',
      '.....kbbbbk.....',
      '.....kbwwbk.....',
      '.....kbbbbk.....',
      '......kGGk..kkk.',
      '......kGGk.kGGGk',
      '......kGGkkGGGk.',
      '......kBBkkGGk..',
      '.....kBBBBkGGk..',
      '.....kkkkkkGGk..',
      '..kkkkkkkkkGGk..',
      '..kwwwwwwwkGGk..',
      '..kkkkkkkkkGGk..',
      '.....kGGGGGGk...',
      '..kkkkkkkkkkkkk.',
      '..kgggggggggggk.',
    ],
    gradebook: [
      '..kkkkkkkkkkkk..',
      '.kllkkkkkkkkkkk.',
      '.kllkwwwwwwwwwk.',
      '.kllkwrrwwwwwwk.',
      '.kllkwrwrwrwwwk.',
      '.kllkwrrrrrrwwk.',
      '.kllkwrwrwrwwwk.',
      '.kllkwwwwwwwwwk.',
      '.kllkkkkkkkkkkk.',
      '.kllkGGGGGGGGGk.',
      '.kllkkkkkkkkkkk.',
      '.kllkGGGGGGGGGk.',
      '.kllkkkkkkkkkkk.',
      '.kllkGGGGGGGGGk.',
      '.kllkkkkkkkkkkk.',
      '..kkkkkkkkkkkk..',
    ],
    sneaker: [
      '................',
      '................',
      '.....kkkk.......',
      '.....kwwwkk.....',
      '....kkwyywkk....',
      '....kppwwwwkk...',
      '...kpppywywwkk..',
      '...kpppppwwwwkk.',
      '..kpppppppwwwwk.',
      '..kpppppppppwwk.',
      '.kppppppppppppk.',
      '.kwwwwwwwwwwwwk.',
      '.kkkkkkkkkkkkkk.',
      '.kggkggkggkggkk.',
      '................',
      '................',
    ],
    kanban: [
      '................',
      '.kkkkkkkkkkkkkk.',
      '.kpppkyyyykmmmk.',
      '.kkkkkkkkkkkkkk.',
      '.kLLLkLLLLkLLLk.',
      '.kwwwkwwwwkLLLk.',
      '.kwwwkLLLLkwwwk.',
      '.kLLLkwwwwkwwwk.',
      '.kwwwkwwwwkLLLk.',
      '.kwwwkLLLLkLLLk.',
      '.kLLLkLLLLkLLLk.',
      '.kkkkkkkkkkkkkk.',
      '...k........k...',
      '..kk........kk..',
      '................',
      '................',
    ],
    cabinet: [
      '................',
      '...kkkkkkkkkk...',
      '...kLLLLLLLLk...',
      '...kLwwwwwwLk...',
      '...kLLLkkLLLk...',
      '...kkkkkkkkkk...',
      '...kLLLLLLLLk...',
      '...kLwwwwwwLk...',
      '...kLLLkkLLLk...',
      '...kkkkkkkkkk...',
      '...kLLLLLLLLk...',
      '...kLwwwwwwLk...',
      '...kLLLkkLLLk...',
      '...kkkkkkkkkk...',
      '...kk......kk...',
      '................',
    ],
    podium: [
      '.......kk.......',
      '......kyyk......',
      '.....kyyyyk.....',
      '......kyyk......',
      '.......kk.......',
      '....kkkkkkkk....',
      '....kyyyyyyk....',
      '....kyywwyyk....',
      'kkkkkyywwyyk....',
      'kGGGkyyyyyyk....',
      'kGwGkyyyyyykkkkk',
      'kGGGkyyyyyykNNNk',
      'kGGGkyyyyyykNNNk',
      'kGGGkyyyyyykNNNk',
      'kkkkkkkkkkkkkkkk',
      '................',
    ],
    // ---- desktop: files ----
    pdf: [
      '...kkkkkkkkk....',
      '...kwwwwwwwkk...',
      '...kwwwwwwwkwk..',
      '...kwwwwwwwkkkk.',
      '...krrrrrrrrrrk.',
      '...krwrrwwrwwrk.',
      '...krwrrwrrwrrk.',
      '...krwwrwrrwwrk.',
      '...krwrrwrrwrrk.',
      '...krwrrwwrwrrk.',
      '...krrrrrrrrrrk.',
      '...kwwwwwwwwwwk.',
      '...kwkkkkkkkkwk.',
      '...kwwwwwwwwwwk.',
      '...kkkkkkkkkkkk.',
      '................',
    ],
    about: [
      '..kkkkkkkkkkkk..',
      '.kccccccccccccck',
      '.kcckkkkccccccck',
      '.kckppppkcckkkck',
      '.kckpkpkkcccccck',
      '.kckpppkccckkkck',
      '.kcckkkkccccccck',
      '.kckbbbbkcckkkck',
      '.kckbbbbkcccccck',
      '.kckbbbbkcckkkck',
      '.kcckkkkccccccck',
      '.kccccccccccccck',
      '..kkkkkkkkkkkk..',
      '................',
      '................',
      '................',
    ],
    terminal: [
      '................',
      '.kkkkkkkkkkkkkk.',
      '.kppkyykmmk...k.',
      '.kkkkkkkkkkkkkk.',
      '.kkeekkkkkkkkkk.',
      '.kkkeekkkkkkkkk.',
      '.kkeekkkeeeekkk.',
      '.kkkkkkkkkkkkkk.',
      '.kkeeeekkkkkkkk.',
      '.kkkkkkkkeekkkk.',
      '.kkeekkkkkkkkkk.',
      '.kkkkkkkkkkkkkk.',
      '.kkkkkkkkkkkkkk.',
      '.kkkkkkkkkkkkkk.',
      '.kkkkkkkkkkkkkk.',
      '.kkkkkkkkkkkkkk.',
    ],
    // a folder with a glitch: shifted rows and magenta/cyan colour fringes
    glitch: [
      '................',
      '.kkkkk..........',
      '.klllkkkkkkkkkk.',
      '.kLLLLLLLLLLLLk.',
      '.kLLLLLLpLLLLLk.',
      'tkLLLLLLLLLLLLkp',
      '.kLLLLLLLLLLLLk.',
      '..kLLLLLLLLLLLLk',
      '..kLLtttLLLLLLLk',
      '.kLLLLLLLLLLLLk.',
      '.kLLLLLLLLLpppk.',
      'kLLLLLLLLLLLLk..',
      '.kLLLLLLLLLLLLk.',
      '.kkkkkkkkkkkkkk.',
      '..t.........p...',
      '................',
    ],
    gamepad: [
      '................',
      '................',
      '................',
      '................',
      '..kkkkkkkkkkkk..',
      '.kllllllllllllk.',
      '.klllkllllllylk.',
      '.kllkkklllrlblk.',
      '.klllkllllllmlk.',
      '.kllllllllllllk.',
      '..kllllllllllk..',
      '..kllk....kllk..',
      '...kk......kk...',
      '................',
      '................',
      '................',
    ],
    headphones: [
      '................',
      '.....kkkkkk.....',
      '...kkGGGGGGkk...',
      '..kGGkkkkkkGGk..',
      '..kGkk....kkGk..',
      '.kGGk......kGGk.',
      '.kGk........kGk.',
      '.kGk........kGk.',
      '.kkkkk....kkkkk.',
      '.kppppk..kppppk.',
      '.kppppk..kppppk.',
      '.kppppk..kppppk.',
      '.kppppk..kppppk.',
      '.kkkkkk..kkkkkk.',
      '................',
      '................',
    ],
    coffee: [
      '................',
      '....k...k.......',
      '.....k...k......',
      '....k...k.......',
      '................',
      '..kkkkkkkkkk....',
      '..knnnnnnnnk....',
      '..kwwwwwwwwkkkk.',
      '..kwwwwwwwwkwwk.',
      '..kwwwwwwwwkwwk.',
      '..kwwwwwwwwkkk..',
      '...kwwwwwwk.....',
      '....kkkkkk......',
      '.kkkkkkkkkkkkk..',
      '..kGGGGGGGGGk...',
      '...kkkkkkkkk....',
    ],
    cat: [
      '................',
      '..kk........kk..',
      '..kpk......kpk..',
      '..kppk....kppk..',
      '..kooooooooook..',
      '..kookooookoook.',
      '..kooooppoooook.',
      '..kooookkoooook.',
      'k.kooooooooook.k',
      '...koooooooook..',
      '....kkkkkkkk....',
      '................',
      '................',
      '................',
      '................',
      '................',
    ],
    dog: [
      '................',
      '................',
      '....kkkkkkkk....',
      '..kkkNNNNNNkkk..',
      '.knnkNNNNNNknnk.',
      '.knnkNkNNkNknnk.',
      '.knnkNNNNNNknnk.',
      '.knnkNNkkNNknnk.',
      '..knkNNNNNNknk..',
      '..kkkNNppNNkkk..',
      '....kNNNNNNk....',
      '.....kkkkkk.....',
      '................',
      '................',
      '................',
      '................',
    ],
    photo: [
      '................',
      '................',
      '..kkkkkkkkkkkk..',
      '..kwwwwwwwwwwk..',
      '..kwbbbbbbbbwk..',
      '..kwbbbbbyybwk..',
      '..kwbbbbbyybwk..',
      '..kwbbeebbbbwk..',
      '..kwbeemmbbbwk..',
      '..kweemmmmmewk..',
      '..kweeeeeeeewk..',
      '..kwwwwwwwwwwk..',
      '..kkkkkkkkkkkk..',
      '................',
      '................',
      '................',
    ],
    // ---- dock ----
    chat: [
      '................',
      '..kkkkkkkkkkkk..',
      '.kppppppppppppk.',
      '.kppppppppppppk.',
      '.kpwwpwwpwwppk..',
      '.kpwwpwwpwwppk..',
      '.kppppppppppppk.',
      '.kppppppppppppk.',
      '..kkkkkkkkkkppk.',
      '.....kkkkkkkppk.',
      '.....kpk....kk..',
      '.....kk.........',
      '................',
      '................',
      '................',
      '................',
    ],
    gear: [
      '................',
      '.......kk.......',
      '...kk.kllk.kk...',
      '..klkkkllkkklk..',
      '...kllllllllk...',
      '....kllkkllk....',
      '.kkklkkLLkklkkk.',
      '.kllllkLLkllllk.',
      '.kllllkLLkllllk.',
      '.kkklkkLLkklkkk.',
      '....kllkkllk....',
      '...kllllllllk...',
      '..klkkkllkkklk..',
      '...kk.kllk.kk...',
      '.......kk.......',
      '................',
    ],
    monitor: [
      '................',
      '.kkkkkkkkkkkkkk.',
      '.kLLLLLLLLLLLLk.',
      '.kLLLLLLLLLLmLk.',
      '.kLLLLLLLLmmmLk.',
      '.kLLLLLmLmmmmLk.',
      '.kLLmLmmLmmmmLk.',
      '.kLLmLmmLmmmmLk.',
      '.kLmmLmmLmmmmLk.',
      '.kkkkkkkkkkkkkk.',
      '......kkkk......',
      '.....kGGGGk.....',
      '...kkkkkkkkkk...',
      '................',
      '................',
      '................',
    ],
    trophy: [
      '................',
      '..kkkkkkkkkkkk..',
      '.kykyyyyyyyykyk.',
      '.kykyywwyyyykyk.',
      '.kykyywyyyyykyk.',
      '..kkyyyyyyyykk..',
      '...kyyyyyyyyk...',
      '....kyyyyYYk....',
      '.....kyyYYk.....',
      '......kYYk......',
      '......kYYk......',
      '.....kYYYYk.....',
      '....kkkkkkkk....',
      '....knnnnnnk....',
      '....kkkkkkkk....',
      '................',
    ],
    arcade: [
      '....kkkkkkkk....',
      '...kppppppppk...',
      '...kpwwpwwpwk...',
      '..kkkkkkkkkkkk..',
      '..kBBBBBBBBBBk..',
      '..kBmmmmmmmmBk..',
      '..kBmmwmmwmmBk..',
      '..kBmmmmmmmmBk..',
      '..kBBBBBBBBBBk..',
      '..kllllllllllk..',
      '..klrlllyllllk..',
      '..kllllllllllk..',
      '..kkkkkkkkkkkk..',
      '..kBBBBBBBBBBk..',
      '..kBBBBBBBBBBk..',
      '..kkkkkkkkkkkk..',
    ],
    mail: [
      '................',
      '................',
      '.kkkkkkkkkkkkkk.',
      '.kwkqqqqqqqqkwk.',
      '.kwwkqqqqqqkwwk.',
      '.kwwwkqqqqkwwwk.',
      '.kwwwwkqqkwwwwk.',
      '.kwwwwwkkwwwwwk.',
      '.kwwwwwwwwwwwwk.',
      '.kwwwwwwwwwwwwk.',
      '.kkkkkkkkkkkkkk.',
      '................',
      '................',
      '................',
      '................',
      '................',
    ],
    star: [
      '................',
      '.......kk.......',
      '......kyyk......',
      '......kyyk......',
      '.kkkkkkyykkkkk..',
      '..kyyyyyyyyyyk..',
      '...kyyyyyyyyk...',
      '....kyyyyyyk....',
      '....kyyykyyk....',
      '...kyyyk.kyyk...',
      '...kyyk...kyyk..',
      '..kkkk.....kkk..',
      '................',
      '................',
      '................',
      '................',
    ],
    heart: [
      '................',
      '..kkk....kkk....',
      '.kpppk..kpppk...',
      '.kpwppkkppppk...',
      '.kppppppppppk...',
      '.kppppppppppk...',
      '..kppppppppk....',
      '...kppppppk.....',
      '....kppppk......',
      '.....kppk.......',
      '......kk........',
      '................',
      '................',
      '................',
      '................',
      '................',
    ],
    lock: [
      '................',
      '.....kkkkkk.....',
      '....kGGGGGGk....',
      '....kGkkkkGk....',
      '....kGk..kGk....',
      '..kkkkkkkkkkkk..',
      '..kyyyyyyyyyyk..',
      '..kyyyykkyyyyk..',
      '..kyyyykkyyyyk..',
      '..kyyyyykyyyyk..',
      '..kyyyyyyyyyyk..',
      '..kkkkkkkkkkkk..',
      '................',
      '................',
      '................',
      '................',
    ],
  };

  // Larger free-form maps
  const CLOUD = [
    '.........kkkk.........................',
    '.......kkwwwwkk.....kkkk..............',
    '.....kkwwwwwwwwkk.kkwwwwkk............',
    '...kkwwwwwwwwwwwwkwwwwwwwwkk..........',
    '..kwwwwwwwwwwwwwwwwwwwwwwwwwkkk.......',
    '.kwwwwwwwwwwwwwwwwwwwwwwwwwwwwwkk.....',
    'kwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk....',
    'kwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwkk..',
    '.kkwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk..',
    '...kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk..',
  ];
  const CURSOR = [
    'k...........',
    'kk..........',
    'kwk.........',
    'kwwk........',
    'kwwwk.......',
    'kwwwwk......',
    'kwwwwwk.....',
    'kwwwwwwk....',
    'kwwwwwwwk...',
    'kwwwwwkkkk..',
    'kwwkwwk.....',
    'kwk.kwwk....',
    'kk..kwwk....',
    'k....kwwk...',
    '.....kwwk...',
    '......kk....',
  ];
  const HAND = [
    '......kk........',
    '.....kwwk.......',
    '.....kwwk.......',
    '.....kwwk.......',
    '.....kwwkkk.....',
    '.....kwwkwwkkk..',
    '..kk.kwwkwwkwwk.',
    '.kwwkkwwwwwkwwkk',
    '.kwwwkwwwwwwwwwk',
    '..kwwwwwwwwwwwwk',
    '...kwwwwwwwwwwwk',
    '...kwwwwwwwwwwk.',
    '....kwwwwwwwwwk.',
    '....kwwwwwwwwk..',
    '.....kkkkkkkkk..',
    '................',
  ];

  const cache = {};

  function draw(map, scale) {
    const rows = map.length;
    const cols = Math.max.apply(null, map.map((r) => r.length));
    const cv = document.createElement('canvas');
    cv.width = cols * scale;
    cv.height = rows * scale;
    const ctx = cv.getContext('2d');
    map.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const c = row[x];
        if (c === '.' || c === ' ') continue;
        ctx.fillStyle = PAL[c] || '#f0f';
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    });
    return cv.toDataURL('image/png');
  }

  const S = (NM.sprites = {
    defs: DEFS,
    names: Object.keys(DEFS),
    url(name, scale) {
      scale = scale || 4;
      const key = name + '@' + scale;
      if (!cache[key]) {
        const map = name === 'cloud' ? CLOUD : name === 'cursor' ? CURSOR : name === 'hand' ? HAND : DEFS[name];
        if (!map) return '';
        cache[key] = draw(map, scale);
      }
      return cache[key];
    },
    // <img> that stays crisp at any CSS size
    img(name, cls, alt) {
      const i = new Image();
      i.src = S.url(name, 4);
      i.className = 'px ' + (cls || '');
      i.alt = alt || '';
      i.draggable = false;
      i.setAttribute('aria-hidden', alt ? 'false' : 'true');
      return i;
    },
    html(name, cls) {
      return '<img class="px ' + (cls || '') + '" src="' + S.url(name, 4) + '" alt="" aria-hidden="true" draggable="false">';
    },
    // Dev helper: reports any row that is not 16 pixels wide
    validate() {
      const bad = [];
      Object.keys(DEFS).forEach((n) => {
        if (DEFS[n].length !== 16) bad.push(n + ': ' + DEFS[n].length + ' rows');
        DEFS[n].forEach((r, i) => { if (r.length !== 16) bad.push(n + ' row ' + i + ' has ' + r.length); });
      });
      return bad;
    },
    installCursors() {
      const root = document.documentElement;
      root.style.setProperty('--cursor-default', 'url("' + S.url('cursor', 2) + '") 2 2, auto');
      root.style.setProperty('--cursor-pointer', 'url("' + S.url('hand', 2) + '") 10 2, pointer');
    },
  });
})();
