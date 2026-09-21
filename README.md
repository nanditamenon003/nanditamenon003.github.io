# Nandita Menon — Pixel Desktop Portfolio

A pastel, pixel-art macOS-style desktop portfolio. Plain HTML/CSS/JavaScript — no build step, no framework, no API key.

**Live:** https://nanditamenon003.github.io (GitHub Pages, `main` branch, repository root)

## Run it locally

Double-click `index.html`, or serve the folder:

```bash
python -m http.server 5173
```

Then open <http://localhost:5173>.

| URL | What it does |
|---|---|
| `/` | Landing card → boot screen → desktop |
| `/#desktop` | Skip the landing card and boot |
| `/?reset` | Clear saved XP, badges, analytics and icon order (fresh start for a demo) |

## Updating the live site

Edit the files, then:

```bash
git add -A
git commit -m "describe the change"
git push
```

GitHub Pages redeploys in about a minute.

## File map

```
index.html            landing, boot, desktop and mobile shells
css/style.css         all styling (Press Start 2P = UI chrome only; Inter = everything readable)
js/core.js            helpers, safe localStorage, event bus
js/sprites.js         16x16 pixel maps → PNG at runtime; pixel cursors
js/sfx.js             8-bit sound pack (Web Audio) — muted by default
js/data.js            facts, recruiter roles, assistant knowledge base  ← edit content here
js/analytics.js       localStorage analytics + demo layer + insights
js/game.js            XP, levels, badges, exploration tracker
js/wm.js              window manager (drag, resize, minimise, zoom, Esc to close)
js/agent.js           prototype assistant (+ optional live-model switch)
js/apps.js            projects and the Case Comps + Experience & Research folders
js/apps-os.js         About, Contact, Recruiter Mode, Activity Monitor, Achievements
js/glitch.js          the hidden final-reward folder and its cards
js/mobile.js          stacked layout below 768px
js/main.js            boot flow, desktop assembly, personalisation
assets/               photo, pixel avatars, idle-animation sheet, resume PDF, deck slides, album photos
tools/                make_avatar_idle.py — regenerates assets/avatar_idle_sheet.png (needs Python + Pillow)
option-b/             optional, untested example proxy for a live-model assistant (not used by the site)
```

## Editing content

- Facts and assistant answers: `js/data.js`
- Project and folder windows: `js/apps.js`; the hidden folder: `js/glitch.js`
- Resume: replace `assets/Nandita_Menon_Resume.pdf`
- Album photos: put resized copies in `assets/album/` as `album-N.jpg` (about 840×1120) and `album-N-thumb.jpg` (300×400), then edit the list in `js/glitch.js`

## Notes

- Analytics live in the visitor's own browser (`localStorage`); nothing is sent anywhere.
- Sound is opt-in: muted on every visit, with a toggle in the menu bar.
- Fonts load from Google Fonts; offline, the layout falls back to system fonts.
