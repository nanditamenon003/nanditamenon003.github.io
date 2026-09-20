/* game.js — XP meter, levels, badges and the exploration tracker that unlocks the secret file.

   COUNTING RULE (applied everywhere — progress, secret unlock, XP, analytics "projects clicked"):
   the unit is a piece of WORK = a project window (Black Fungus, Instructor Aid) or one CARD inside a folder
   (Brand Alchemy, Marketing Bowl, Prodyssey, SIP, SIRP, GCL). Opening a folder window by itself earns a
   small amount of XP but does NOT count as exploring anything inside it.
   Explorable set = 8 works + the trash can = 9 items. */
(function () {
  'use strict';
  const NM = window.NM;
  const KEY = 'nm_game_v1';
  const MAX_XP = 100;
  const LEVELS = [0, 20, 45, 70, 100]; // XP thresholds for LV1..LV5

  const BADGES = [
    { id: 'firstboot', name: 'First Boot', desc: 'Booted Nandita.OS for the first time.', hint: 'Just enter the desktop.', sprite: 'star' },
    { id: 'curious', name: 'Curious Recruiter', desc: 'Asked the assistant 3 questions.', hint: 'Ask the Messages window three questions.', sprite: 'chat' },
    { id: 'deepdiver', name: 'Deep Diver', desc: 'Opened every project and case comp.', hint: 'Open both projects and all three case comps.', sprite: 'microscope' },
    { id: 'scout', name: 'Talent Scout', desc: 'Used Recruiter Mode to guide the tour.', hint: 'Tell the desktop what you are hiring for.', sprite: 'gear' },
    { id: 'papertrail', name: 'Paper Trail', desc: 'Downloaded the resume.', hint: 'Grab the CV.', sprite: 'pdf' },
    { id: 'datanerd', name: 'Data Nerd', desc: 'Opened the Activity Monitor.', hint: 'Look at how the site tracks itself.', sprite: 'monitor' },
    { id: 'behind', name: 'Behind the Scenes', desc: 'Read the AI build log.', hint: 'Find out how this was made.', sprite: 'terminal' },
    { id: 'archaeologist', name: 'Archaeologist', desc: 'Dug through the trash can.', hint: 'Not everything ends up in the trash…', sprite: 'trash' },
    { id: 'fullcoverage', name: 'Full Coverage', desc: 'Explored every piece of work and unlocked the secret file.', hint: 'Open every project, every folder card, and the trash.', sprite: 'secret' },
    { id: 'completionist', name: 'Completionist', desc: 'Filled the System Usage meter to 100%.', hint: 'Keep exploring until the bar is full.', sprite: 'trophy' },
  ];

  const EXPLORE_TARGETS = NM.data.WORKS.concat(['trash']);

  const fresh = () => ({ xp: 0, done: {}, badges: {}, explored: {}, secret: false });
  let S = Object.assign(fresh(), NM.store.get(KEY, {}));
  S.done = S.done || {}; S.badges = S.badges || {}; S.explored = S.explored || {};
  const save = () => NM.store.set(KEY, S);

  const levelOf = (xp) => { let l = 1; LEVELS.forEach((t, i) => { if (xp >= t) l = i + 1; }); return l; };

  function unlockBadge(id) {
    if (S.badges[id]) return;
    S.badges[id] = Date.now();
    save();
    const b = BADGES.find((x) => x.id === id);
    NM.emit('badge', b);
  }

  function checkBadges() {
    const n = (p) => Object.keys(S.done).filter((k) => k.indexOf(p) === 0).length;
    if (S.done.boot) unlockBadge('firstboot');
    if (n('ask:') >= 3) unlockBadge('curious');
    if (NM.data.PROJECTS.every((p) => S.explored[p])) unlockBadge('deepdiver');
    if (S.done['role:any']) unlockBadge('scout');
    if (S.done.cv) unlockBadge('papertrail');
    if (S.done['open:activity']) unlockBadge('datanerd');
    if (S.done['open:buildlog']) unlockBadge('behind');
    if (S.explored.trash) unlockBadge('archaeologist');
    if (S.secret) unlockBadge('fullcoverage');
    if (S.xp >= MAX_XP) unlockBadge('completionist');
  }

  function checkSecret() {
    if (S.secret) return;
    if (EXPLORE_TARGETS.every((t) => S.explored[t])) {
      S.secret = true;
      save();
      NM.emit('secret');
    }
  }

  function progress() {
    const projects = NM.data.PROJECTS.filter((p) => S.explored[p]).length;
    const done = EXPLORE_TARGETS.filter((t) => S.explored[t]).length;
    return { projects, projectsOf: NM.data.PROJECTS.length, done, total: EXPLORE_TARGETS.length };
  }

  NM.game = {
    BADGES,
    MAX_XP,
    LEVELS,
    get xp() { return S.xp; },
    get level() { return levelOf(S.xp); },
    get secret() { return S.secret; },
    hasBadge: (id) => !!S.badges[id],
    badgeTime: (id) => S.badges[id],
    isExplored: (id) => !!S.explored[id],
    // Award XP once per key (so refreshing/re-clicking can't farm the meter)
    award(key, xp) {
      if (S.done[key]) return false;
      S.done[key] = true;
      const before = levelOf(S.xp);
      const beforeXp = S.xp;
      S.xp = Math.min(MAX_XP, S.xp + xp);
      save();
      NM.emit('xp', { xp: S.xp, delta: S.xp - beforeXp, level: levelOf(S.xp), leveledUp: levelOf(S.xp) > before });
      checkBadges();
      return true;
    },
    markExplored(id) {
      if (EXPLORE_TARGETS.indexOf(id) === -1 || S.explored[id]) return;
      S.explored[id] = true;
      save();
      checkSecret(); // before the progress event, so listeners see the final state
      NM.emit('progress', progress());
      checkBadges();
    },
    progress,
    reset() {
      S = fresh();
      save();
      NM.emit('xp', { xp: 0, delta: 0, level: 1, leveledUp: false, reset: true });
      NM.emit('progress', progress());
      NM.emit('gamereset');
    },
    check: checkBadges,
  };
})();
