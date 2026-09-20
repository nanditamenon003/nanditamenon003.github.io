# Nandita Menon — Pixel Desktop Portfolio

A pastel, pixel-art macOS-style desktop portfolio. Plain HTML/CSS/JavaScript — **no build step, no framework, no API key.**

## Run it locally

Double-click `index.html`, or serve the folder (recommended):

```bash
python -m http.server 5173
```

Then open <http://localhost:5173>.

| URL | What it does |
|---|---|
| `/` | Landing card → boot screen → desktop |
| `/#desktop` | Skip the landing card and boot (handy for demos) |
| `/?reset` | Clear saved XP, badges, analytics and icon order (fresh start for a presentation) |

## Live site

**https://nanditamenon003.github.io** — served by GitHub Pages from the `main` branch, `/ (root)` of this repository. Every push to `main` redeploys in about a minute.

To change something: edit the files, then `git add -A`, `git commit -m "..."`, `git push`.

`option-b/` is an optional, untested example for a live-model assistant; the site does not use it.

## How it maps to the rubric

| Rubric block | Where it lives |
|---|---|
| AI-Assisted Creation (20) | `how_this_was_made.txt` (small terminal icon in the dock): workflow, 8-category checklist, before/after avatar slider, sound-pack player, decisions. Assets are AI-written procedural code: `js/sprites.js` (pixel maps), `js/sfx.js` (synthesised audio); the avatar was drawn by Claude-written Python/Pillow code |
| AI Agent & Personalization (10) | Messages window (`js/agent.js`, knowledge base in `js/data.js`) + Recruiter Mode (all 8 categories) |
| Analytics & Optimization (10) | Activity Monitor (`js/analytics.js`, `js/apps-os.js`): 8 metrics, pixel bar chart, question feed, Insights panel with an "Apply" button that re-orders the icons, demo-data toggle |
| Gamification & Engagement (10) | XP meter, 10 badges, "Explored X/9" progress pill, trash-can easter egg, unlockable secret file (`js/game.js`) |

### How exploration is counted

The unit is a **piece of work**: a project window (Black Fungus, Instructor Aid) or one **card** inside a folder (Brand Alchemy, Marketing Bowl, Prodyssey, SIP, SIRP, GCL) — 8 in total, plus the trash can = **9 explorable items**. Opening a folder window on its own counts for nothing (it earns 2 XP only). The same rule drives the progress pill, the secret-file unlock (9/9), XP (each work once), the Deep Diver badge (2 projects + 3 case comps) and the Activity Monitor's "projects clicked" (every card open is a click).

## File map

```
index.html            landing, boot, desktop and mobile shells
css/style.css         all styling (Press Start 2P = chrome only; Inter = all readable content)
js/core.js            helpers, safe localStorage, event bus
js/sprites.js         16x16 pixel maps → PNG at runtime; pixel cursors
js/sfx.js             8-bit sound pack (Web Audio) — muted by default
js/data.js            facts, recruiter roles, assistant knowledge base  ← edit content here
js/analytics.js       localStorage analytics + demo layer + insights
js/game.js            XP, levels, badges, exploration tracker
js/wm.js              window manager (drag, resize, minimise, zoom, Esc to close)
js/agent.js           prototype assistant (+ optional live-model switch)
js/apps.js            Black Fungus, Instructor Aid, and the Case Comps + Experience & Research folders
js/apps-os.js         About, Contact, Build Log, Trash, Recruiter Mode, Activity, Achievements
js/mobile.js          stacked layout below 768px
js/main.js            boot flow, desktop assembly, personalisation
assets/               photo, pixel avatars, resume PDF, and slides taken from the Prodyssey and Marketing Bowl decks
option-b/             OPTIONAL: example serverless proxy for a live model (untested)
```

## Editing content

- Facts and assistant answers: `js/data.js` (all numbers were checked against the source PDFs).
- Project window copy: `js/apps.js`.
- Resume: replace `assets/Nandita_Menon_Resume.pdf`.

## Notes worth knowing

- **Analytics are per-browser.** They live in `localStorage`; nothing is sent anywhere. "Load demo data" adds a simulated audience on top of live counts so the dashboard is populated in a 2-minute demo (it is labelled DEMO DATA on screen).
- **Sound is opt-in.** Muted on every visit; the speaker button in the menu bar turns it on.
- **The assistant is a prototype by design** (rule-based, grounded in the knowledge base). To try a live model, see `option-b/api/chat.js` — the API key must live in a server-side environment variable, never in the page.
- **Fonts** load from Google Fonts. If offline, the layout falls back to system fonts and stays usable.

