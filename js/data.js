/* data.js — single source of truth for facts, recruiter roles and the AI assistant's knowledge base.
   Every number here was checked against the source PDFs (resume, SIP report, decks). Edit here, not in the UI code. */
(function () {
  'use strict';
  const NM = window.NM;

  const person = {
    name: 'Nandita Menon',
    tagline: 'Debugging my way from tech to brand strategy.',
    program: 'PGDM Media & Entertainment 2025–27 · WeSchool, Mumbai',
    email: 'nanditamenon2001@gmail.com',
    linkedin: 'https://www.linkedin.com/in/nandita-menon-977439205',
    linkedinShort: 'linkedin.com/in/nandita-menon-977439205',
    github: 'https://github.com/nanditamenon003',
    githubShort: 'github.com/nanditamenon003',
    resume: 'assets/Nandita_Menon_Resume.pdf',
  };

  /* The unit of "work" is the LEAF: a project window, or one card inside a folder.
     Opening a folder on its own counts for nothing; opening a card counts as that work.
     The same rule drives progress, the Glitch unlock, XP and the analytics "projects clicked" metric. */
  const works = {
    blackfungus: { label: 'Black Fungus Detection', parent: null },
    instructor: { label: 'Instructor Aid System', parent: null },
    brand: { label: 'Brand Alchemy', parent: 'casecomps' },
    bowl: { label: 'Marketing Bowl 3.0', parent: 'casecomps' },
    prodyssey: { label: 'Prodyssey', parent: 'casecomps' },
    sip: { label: 'SIP · Tommy Hilfiger', parent: 'experience' },
    sirp: { label: 'SIRP · AI & Privacy', parent: 'experience' },
    gcl: { label: 'GCL · ShastraVerse', parent: 'experience' },
  };
  const folders = {
    casecomps: { label: 'Case Comps', children: ['brand', 'bowl', 'prodyssey'] },
    experience: { label: 'Experience & Research', children: ['sip', 'sirp', 'gcl'] },
  };
  const WORKS = Object.keys(works);
  // "Projects & case comps" (Deep Diver badge): everything except the Experience & Research cards
  const PROJECTS = ['blackfungus', 'instructor', 'brand', 'bowl', 'prodyssey'];
  // The desktop icon a piece of work lives under
  const iconOf = (id) => (works[id] ? works[id].parent || id : id);

  // Recruiter Mode — the eight categories named in the assignment, mapped to real work
  const roles = {
    marketing: {
      label: 'Marketing', glyph: 'chat',
      glow: ['casecomps', 'experience'],
      why: 'Case Comps (Brand Alchemy, Marketing Bowl) + the Tommy Hilfiger SIP inside Experience',
      sticky: 'Sold ₹19L+ on a premium retail floor, then pitched brand strategy in national case competitions.',
      greeting: "Hiring for <b>Marketing</b>? Open <b>Case Comps</b> for <b>Brand Alchemy</b> (IMT Ghaziabad, 2nd Runner-Up) and <b>Marketing Bowl 3.0</b> (1st Runner-Up), then the Tommy Hilfiger internship in Experience — real consumer data, real sales floor.",
      chips: ['What did the CRM preview day prove?', 'Tell me about Brand Alchemy', 'What experience does Nandita have in advertising?'],
    },
    strategy: {
      label: 'Strategy', glyph: 'kanban',
      glow: ['casecomps', 'experience'],
      why: 'Case Comps (Prodyssey, Brand Alchemy) + the SIP analysis in Experience',
      sticky: 'Turns messy constraints into phased plans — from Bata’s backpacks to a COVID-hit 19-college textbook project.',
      greeting: "Hiring for <b>Strategy</b>? In <b>Case Comps</b>, <b>Prodyssey</b> (IIM Indore, National Finalist) is about re-planning under constraint; <b>Brand Alchemy</b> is about finding white space with market sizing and a phased rollout.",
      chips: ['Tell me about Prodyssey', 'How did Brand Alchemy size the market?', 'What projects demonstrate your leadership skills?'],
    },
    ai: {
      label: 'AI', glyph: 'monitor',
      glow: ['blackfungus', 'experience'],
      why: 'Black Fungus Detection + the SIRP research on explainable AI',
      sticky: 'Built deep-learning models, then researched how to make AI trustworthy.',
      greeting: "Hiring for <b>AI</b>? <b>Black Fungus Detection</b> is the build (five architectures compared; Inception V3 was the top performer at 98.87% train / 98.25% test); the <b>SIRP</b> in Experience is the research (39 studies on explainable AI and privacy).",
      chips: ['Show me your work related to AI.', 'Why did Inception V3 win?', 'What did the SIRP find?'],
    },
    creative: {
      label: 'Creative', glyph: 'star',
      glow: ['casecomps', 'about'],
      why: 'Case Comps (Brand Alchemy, Marketing Bowl branding) + About (game design & UX background)',
      sticky: 'Game-design and UX roots, brand-positioning instincts, pixel-perfect obsessions.',
      greeting: "Hiring for <b>Creative</b>? <b>Case Comps</b> shows brand positioning and personas (Brand Alchemy, Marketing Bowl); <b>About</b> covers the game-design and UX work at Ammachi Labs — and this whole desktop is the portfolio piece.",
      chips: ['Tell me about game design experience', 'Tell me about Brand Alchemy', 'How was this site made?'],
    },
    content: {
      label: 'Content', glyph: 'terminal',
      glow: ['experience', 'ama'],
      why: 'GCL project on AI in content creation + the assistant built into this site',
      sticky: 'Studied how AI reshapes content workflows — and co-designed PostGenie AI.',
      greeting: "Hiring for <b>Content</b>? The <b>GCL project</b> in Experience mapped a 6-stage AI content journey with 15+ practitioner interviews and proposed PostGenie AI; the <b>Messages</b> assistant on this desktop is a small example of AI-assisted content in action.",
      chips: ['Tell me about the GCL project', 'How was this site made?', 'What is PostGenie AI?'],
    },
    mediabuying: {
      label: 'Media Buying', glyph: 'trophy',
      glow: ['casecomps', 'experience'],
      why: 'Go-to-market work in Case Comps (Brand Alchemy, Marketing Bowl) + Google Ads certifications',
      sticky: 'Google Ads certified (Search, Display, Video) — I read a campaign like a funnel and a debugger.',
      greeting: "Hiring for <b>Media Buying</b>? Honest picture: Nandita is <b>Google Ads certified in Search, Display and Video</b> and has built go-to-market plans in two national competitions, but hasn't run an agency media desk yet.",
      chips: ['What experience does Nandita have in advertising?', 'Tell me about the tote bag go-to-market', 'What are the Google Ads certifications?'],
    },
    media: {
      label: 'Media', glyph: 'monitor',
      glow: ['activity', 'achievements'],
      why: 'This site: analytics and gamification in one build',
      sticky: 'Media & Entertainment PGDM with an engineer’s toolkit: AI, analytics, gamification.',
      greeting: "Hiring for <b>Media</b>? This site is the case study — open <b>Activity Monitor</b> for the analytics thinking and <b>Achievements</b> for the gamification.",
      chips: ['How was this site made?', 'How does the analytics work?', 'Tell me about the GCL project'],
    },
    xd: {
      label: 'Experience Design', glyph: 'gear',
      glow: ['instructor', 'achievements'],
      why: 'This portfolio (the OS metaphor and its game layer) + Instructor Aid System (UX for a real user)',
      sticky: 'I design experiences like systems — this desktop is the case study.',
      greeting: "Hiring for <b>Experience Design</b>? <b>Instructor Aid</b> started from a real user pain (a teacher tracking several classes); this desktop OS is a full experience-design exercise — a game-like interface with XP, badges and a hidden level.",
      chips: ['Tell me about Instructor Aid', 'How was this site made?', 'Tell me about game design experience'],
    },
  };
  const ROLE_ORDER = ['marketing', 'strategy', 'ai', 'creative', 'content', 'mediabuying', 'media', 'xd'];

  // Default suggested chips (three from the assignment + one story chip)
  const defaultChips = [
    'What experience does Nandita have in advertising?',
    'Show me your work related to AI.',
    'What projects demonstrate your leadership skills?',
    'Why hire a CS grad for brand strategy?',
  ];

  /* ---------- AI assistant knowledge base ----------
     keys: [phrase, weight]. A trailing * means "starts with". Highest total score wins.
     `a`: paragraphs; lines starting with "• " become bullets. `open`: windows to offer. `src`: where the facts come from. */
  const kb = [
    {
      id: 'greeting', title: 'Greeting', src: 'Built-in',
      keys: [['hi', 3], ['hello', 3], ['hey', 3], ['good morning', 3], ['good afternoon', 3], ['namaste', 3]],
      a: ["Hi! I'm the prototype AI assistant for Nandita's portfolio. Ask me anything a recruiter would ask — or tap a suggestion below."],
    },
    {
      id: 'about', title: 'Who is Nandita', src: 'Resume · One-minute intro',
      keys: [['who is nandita', 5], ['who are you', 4], ['about nandita', 5], ['tell me about yourself', 5], ['introduce', 3], ['background', 3], ['summary', 2], ['profile', 2], ['story', 2]],
      a: [
        "<b>Nandita Menon</b> is a PGDM Media & Entertainment student (2025–27) at WeSchool, Mumbai, with a B.Tech in Computer Science (Amrita, 2024).",
        "Her through-line is bridging two worlds: engineering logic and people-facing creativity. She's built deep-learning models, designed educational games for a government initiative, sold on a premium retail floor, and researched AI trust — then placed in national case competitions.",
      ],
      open: ['about'],
    },
    {
      id: 'experience', title: 'Work experience', src: 'Resume',
      keys: [['experience', 3], ['work history', 4], ['internships', 3], ['jobs', 3], ['employment', 3], ['career', 3], ['worked', 2]],
      a: [
        "Nandita's experience, newest first:",
        "• <b>Tommy Hilfiger (Arvind Fashions), Chennai — SIP, May–Jun 2026:</b> Customer Relationship Officer intern; 108.3% of her May sales target, CRM tele-clienteling, UPT/ATV/ASP analysis.",
        "• <b>Ammachi Labs — Game Design & UX intern, Apr–Sep 2022:</b> educational 2D games and Figma wireframes for the DIKSHA initiative.",
        "• <b>Verzeo — Blockchain & Web3 intern, Apr–Jun 2020:</b> decentralized-app concepts.",
        "Plus academic work: the SIRP research and the GCL project on AI in content creation.",
      ],
      open: ['experience', 'about'],
    },
    {
      id: 'whyhire', title: 'Why hire her', src: 'Synthesis of resume + projects',
      keys: [['why hire', 5], ['why should', 4], ['hire you', 4], ['hire her', 4], ['strength*', 3], ['unique', 3], ['stand out', 4], ['differentiat*', 3], ['cs grad', 5], ['engineer', 3], ['tech to brand', 5], ['switch', 2], ['transition', 3]],
      a: [
        "Because she can do the part most brand people can't — and the part most engineers won't:",
        "• <b>Technical proof:</b> benchmarked 5 deep-learning architectures and shipped a working diagnosis app.",
        "• <b>Commercial proof:</b> 108.3% of her May sales target and ₹19.25L+ over a 52-day Tommy Hilfiger internship.",
        "• <b>Strategy proof:</b> 2nd Runner-Up (Brand Alchemy), 1st Runner-Up (Marketing Bowl), National Finalist (Prodyssey).",
        "• <b>Judgement:</b> her SIRP research is about when AI personalization earns trust — and when it backfires.",
      ],
      open: ['sip', 'brand'],
    },
    {
      id: 'advertising', title: 'Advertising experience', src: 'Resume · Case decks · SIP',
      keys: [['advertis*', 5], ['ad campaign*', 4], ['campaign*', 3], ['creative brief', 3], ['promotion*', 2]],
      a: [
        "Straight answer: Nandita hasn't worked in an advertising agency yet — what she brings is the strategy-and-analytics side of it, with proof:",
        "• <b>Positioning & campaigns:</b> 1st Runner-Up at IIM Sirmaur Marketing Bowl 3.0 (go-to-market for a sustainable tote vs plastic bags) and 2nd Runner-Up at IMT Ghaziabad Brand Alchemy (Bata backpack strategy).",
        "• <b>Platforms:</b> Google Ads certified in Search, Display and Video (Skillshop).",
        "• <b>Consumer response:</b> 52 days on a Tommy Hilfiger sales floor, running CRM-led outreach and studying how promotions change basket size.",
        "• <b>Media context:</b> PGDM in Media & Entertainment; GCL project on AI in content creation for Digital Dogs.",
      ],
      open: ['brand', 'bowl', 'sip'],
    },
    {
      id: 'mediabuying', title: 'Media buying', src: 'Resume (certifications)',
      keys: [['media buying', 5], ['media plan*', 4], ['google ads', 5], ['ppc', 4], ['sem', 3], ['performance marketing', 4], ['ad spend', 3], ['skillshop', 4]],
      a: [
        "Nandita holds three Google Ads certifications from Skillshop — <b>Search, Display and Video</b> — and pairs them with go-to-market planning from two national competitions.",
        "To be upfront: she hasn't managed live ad budgets professionally. She'd be a fast, analytical junior on a media desk rather than a seasoned buyer.",
      ],
      open: ['brand'],
    },
    {
      id: 'marketing', title: 'Marketing & brand', src: 'Resume · Brand Alchemy · Marketing Bowl · SIP',
      keys: [['marketing', 4], ['brand*', 3], ['positioning', 4], ['go to market', 4], ['gtm', 4], ['consumer*', 3], ['digital marketing', 4], ['customer*', 2]],
      a: [
        "Marketing is the centre of gravity for her PGDM. Highlights:",
        "• <b>Brand Alchemy</b> — positioned affordable, durable backpacks for Bata (₹800–₹2,000), sized at ₹220–350 Cr obtainable market.",
        "• <b>Marketing Bowl 3.0</b> — brand + go-to-market for a tote bag as the sustainable alternative to plastic.",
        "• <b>Tommy Hilfiger SIP</b> — CRM clienteling data showing the basket premium came from customer segmentation, not discount depth.",
      ],
      open: ['brand', 'bowl', 'sip'],
    },
    {
      id: 'ai', title: 'AI work', src: 'Resume · Black Fungus deck · SIRP · GCL',
      keys: [['ai', 4], ['artificial intelligence', 5], ['machine learning', 4], ['deep learning', 4], ['ml', 3], ['llm*', 3], ['neural', 3], ['explainab*', 3], ['work related to ai', 6]],
      a: [
        "AI shows up in four places in Nandita's work:",
        "• <b>Build</b> — Black Fungus Detection: 5 deep-learning architectures compared; Inception V3 was the top performer (98.87% train / 98.25% test) and shipped as a Flask web app.",
        "• <b>Research</b> — SIRP: a systematic review of 39 studies on algorithmic transparency and explainable AI in the personalization–privacy paradox.",
        "• <b>Apply</b> — GCL: a 6-stage AI content journey from 15+ practitioner interviews, and the proposed PostGenie AI platform.",
        "• <b>Create</b> — this site: the avatar, icons and sound pack were all created with AI.",
      ],
      open: ['blackfungus', 'sirp', 'gcl'],
    },
    {
      id: 'leadership', title: 'Leadership', src: 'Resume (Responsibilities) · SIP · Prodyssey',
      keys: [['leadership', 5], ['lead*', 3], ['led', 4], ['manage*', 2], ['ownership', 3], ['initiative', 3], ['team player', 2], ['teamwork', 2], ['responsibilit*', 2]],
      a: [
        "Nandita's leadership shows up as ownership and initiative rather than titles:",
        "• <b>Guruvandana</b> — Senior Committee Member of WeSchool's industry-mentor engagement initiative.",
        "• <b>SIP 2026</b> — volunteer who managed on-ground operations and logistics for new-student registration.",
        "• <b>Tommy Hilfiger</b> — led CRM tele-clienteling to Silver/Gold/Platinum members for a members-only preview day.",
        "• <b>Prodyssey</b> — built the delivery schedule and ran task assignment in Jira across parallel workflows.",
      ],
      open: ['sip', 'prodyssey'],
    },
    {
      id: 'projects', title: 'Projects overview', src: 'Portfolio',
      keys: [['projects', 3], ['portfolio', 3], ['show me', 2], ['your work', 3], ['featured', 3], ['case studies', 3]],
      a: [
        "Two featured projects and two folders on the desktop:",
        "• <b>Black Fungus Detection</b> — deep learning; Inception V3 best of five models at 98.87% train / 98.25% test",
        "• <b>Instructor Aid System</b> — a desktop app for teachers",
        "• <b>Case Comps</b> — Marketing Bowl 3.0 (1st Runner-Up), Brand Alchemy (2nd Runner-Up), Prodyssey (National Finalist)",
        "• <b>Experience & Research</b> — the Tommy Hilfiger SIP, the SIRP on explainable AI, and the GCL project",
      ],
      open: ['blackfungus', 'instructor', 'casecomps', 'experience'],
    },
    {
      id: 'blackfungus', title: 'Black Fungus Detection', src: 'Black Fungus deck (results table)',
      keys: [['black fungus', 6], ['mucormycosis', 6], ['inception*', 5], ['tensorflow', 3], ['flask', 3], ['diagnos*', 3], ['health image', 4], ['overfit*', 4], ['mobilenet', 4], ['resnet*', 4]],
      a: [
        "Black Fungus Detection classifies mucormycosis from face and eye images — early detection matters clinically.",
        "She benchmarked five architectures. <b>Inception V3 was the top performer: 98.87% train / 98.25% test accuracy.</b> The others: ResNet-50 83% / 91.23%, MobileNet 99.18% / 73% (a classic overfit), DenseNet 72% / 73%, EfficientNet 59% / 60% (train / test).",
        "The winning model was deployed as a Flask web app (\"Health Image\"): upload an image, get an instant prediction. Stack: Python, TensorFlow, Keras, Flask.",
      ],
      open: ['blackfungus'],
    },
    {
      id: 'instructor', title: 'Instructor Aid System', src: 'Team Marin deck · Resume',
      keys: [['instructor', 5], ['aid system', 5], ['tkinter', 4], ['sqlite*', 4], ['matplotlib', 3], ['gradebook', 3], ['teacher*', 3], ['professor*', 3]],
      a: [
        "Instructor Aid System solves a real teacher problem: tracking student progress across multiple classes is a hassle.",
        "It's a Python desktop app (Tkinter, SQLite3, Matplotlib) with instructor login, multi-class management, mark entry, percentage calculation and auto-generated performance graphs. Nandita co-built it in a 5-person team and contributed the <b>Home Page, Create Account and Dashboard</b>, plus UML modelling.",
      ],
      open: ['instructor'],
    },
    {
      id: 'brand', title: 'Brand Alchemy', src: 'Brand Alchemy deck (Queen Bees)',
      keys: [['brand alchemy', 6], ['bata', 5], ['backpack*', 4], ['queen bees', 4], ['imt', 3], ['ghaziabad', 3], ['tam', 3], ['market siz*', 4], ['sam', 2], ['som', 2], ['white space', 4]],
      a: [
        "<b>Brand Alchemy</b> (IMT Ghaziabad, <b>2nd Runner-Up</b>, Team Queen Bees): Bata's footwear sales were almost flat (₹35,544 Cr vs ₹35,403 Cr, +0.4%) while India's backpack and travel-gear market grows 12–14% a year.",
        "The team proposed affordable, durable, branded backpacks (₹800–₹2,000) — a white space few branded players occupy — in four lines (School, Office, Daily/College, Travel). Sizing: ₹15,000 Cr TAM → ₹11,000–12,000 Cr SAM → ₹220–350 Cr SOM within three years, with an 18-month phased rollout.",
      ],
      open: ['brand'],
    },
    {
      id: 'prodyssey', title: 'Prodyssey', src: 'Prodyssey deck (Team Pro Pulse) · Resume',
      keys: [['prodyssey', 6], ['iim indore', 5], ['pro pulse', 4], ['jira', 4], ['confluence', 4], ['project management', 4], ['covid', 3], ['async*', 3], ['national finalist', 4], ['oer', 4], ['h5p', 4], ['textbook', 3], ['open educational', 4]],
      a: [
        "<b>Prodyssey</b> (IIM Indore, <b>National Finalist</b>, Team Pro Pulse) is a project-management crisis case: a 19-college Open Educational Resources textbook project (20 chapters, due August 2020) lost its two-day in-person content sprint to the March 2020 lockdown.",
        "The team's answer was <b>asynchronous agile development</b>: modular work with early quality checks, Jira and Confluence backed by short training videos, a week of H5P training for students, and contributors who couldn't write content moved onto a peer-review team.",
        "A spreadsheet <b>working model</b> then tested faculty numbers and efficiency — and found a scenario where the project still finishes on time with a 10% drop in faculty efficiency and fewer faculty.",
      ],
      open: ['prodyssey'],
    },
    {
      id: 'tote', title: 'Marketing Bowl · tote bag', src: 'Tote bag deck (Team PitchPerfect) · Resume',
      keys: [['tote*', 6], ['marketing bowl', 6], ['iim sirmaur', 5], ['sirmaur', 5], ['plastic', 4], ['pitchperfect', 4], ['sustainab*', 3], ['mrida', 4]],
      a: [
        "At <b>IIM Sirmaur's Marketing Bowl 3.0</b>, Team PitchPerfect finished <b>1st Runner-Up</b> with a go-to-market strategy positioning a cloth tote bag as the sustainable alternative to plastic bags.",
        "The deck builds a brand (मृदा) around \"Not just a bag, but a lifestyle choice\" — three pillars (sustainability, style & expression, convenience), three personas, a #CarryYourStory social campaign, and a retail partnership that offers a tote at the checkout counter (₹30, discounted from ₹60, vs a ₹5 plastic bag).",
      ],
      open: ['bowl'],
    },
    {
      id: 'sip', title: 'Tommy Hilfiger SIP', src: 'SIP report · Resume',
      keys: [['tommy*', 6], ['hilfiger', 6], ['sip', 4], ['internship*', 3], ['retail', 4], ['crm', 5], ['clienteling', 5], ['sales', 3], ['olabi', 4], ['eoss', 4], ['basket', 3], ['upt', 3], ['preview', 3], ['arvind', 3]],
      a: [
        "Nandita spent 52 days (May–June 2026) at the Tommy Hilfiger flagship in Express Avenue, Chennai (Arvind Fashions) — <b>108.3% of her individual May sales target, ₹19.25L+ generated</b>.",
        "Her SIP research compared a CRM-driven members-only preview with the public EOSS. The preview drove a store UPT of <b>3.7 vs a 2.54 baseline</b> — and a <i>higher</i> average selling price (₹4,186 vs ₹3,380) despite a shallower discount (40% vs 50%). Conclusion: the basket premium came from customer segmentation, not discount depth.",
      ],
      open: ['sip'],
    },
    {
      id: 'sirp', title: 'SIRP research', src: 'SIRP report',
      keys: [['sirp', 6], ['research', 4], ['privacy', 5], ['paradox', 5], ['transparency', 4], ['literature', 4], ['prisma', 5], ['tccm', 4], ['systematic', 3], ['paper', 3], ['personali*', 3]],
      a: [
        "The SIRP is a systematic literature review: <b>\"Algorithmic Transparency and Explainable AI in Resolving the Personalization–Privacy Paradox\"</b> — 39 ABDC-rated studies, PRISMA 2020, TCCM framework.",
        "Core finding: transparency helps only when it is specific, timely and paired with real user control; generic or one-off disclosure can backfire and increase the feeling of being watched. She proposes a six-point research agenda and practical design implications for privacy-respectful personalization.",
      ],
      open: ['sirp'],
    },
    {
      id: 'gcl', title: 'GCL · AI in content', src: 'Resume · Portfolio brief',
      keys: [['gcl', 6], ['global citizen', 5], ['shastraverse', 6], ['postgenie', 6], ['digital dogs', 6], ['content', 4], ['creator*', 3], ['nykaa', 3], ['nodwin', 3], ['jio', 3]],
      a: [
        "For the Global Citizen Leadership project (Nov 2025 – Apr 2026), Nandita's team studied how AI is reshaping content creation for <b>Digital Dogs Pvt. Ltd.</b>",
        "They mapped a 6-stage AI-powered content journey (discovery → ideation → creation → review → publishing → performance) through <b>15+ interviews</b> with creators and marketers from Nykaa, NODWIN Gaming and Jio Creative Labs, found fragmented workflows to be the key inefficiency, and proposed <b>PostGenie AI</b> — an end-to-end AI content co-creation platform.",
      ],
      open: ['gcl'],
    },
    {
      id: 'games', title: 'Game design & UX', src: 'Resume · One-minute intro',
      keys: [['game*', 5], ['gamif*', 4], ['unity', 4], ['ux', 4], ['figma', 4], ['ammachi', 5], ['diksha', 4], ['game jam', 5], ['design experience', 4], ['glitch', 4], ['club', 3]],
      a: [
        "Before management school, Nandita interned at <b>Ammachi Labs</b> (Apr–Sep 2022) as a Game Design & UX intern — designing educational 2D games that build cognitive skills in children, and creating wireframes and design flows in Figma for the DIKSHA initiative (Ministry of Education, Govt. of India).",
        "She also completed a C# Unity game-developer course (2021). At university she was part of <b>Glitch</b>, her college's game-development club: she took part in an International Unity Game Jam competition and helped organise the event at her college. This portfolio's XP system and badges are that instinct at work.",
      ],
      open: ['about'],
    },
    {
      id: 'skills', title: 'Skills & tools', src: 'Resume',
      keys: [['skill*', 4], ['tools', 3], ['tech stack', 4], ['python', 3], ['excel', 3], ['power bi', 4], ['powerbi', 4], ['sql', 3], ['mysql', 4], ['tableau', 3], ['html', 3], ['javascript', 2], ['programming', 3], ['coding', 3]],
      a: [
        "• <b>Analytics & AI:</b> Python, machine learning (TensorFlow, Keras), Excel, Power BI, MySQL; Tableau exposure via a KPMG sustainability certification",
        "• <b>Marketing:</b> digital marketing, Google Ads (Search, Display, Video), CRM clienteling",
        "• <b>Build & design:</b> HTML/CSS/JS, Flask, Tkinter, Figma, Unity/C# game design",
      ],
      open: ['about'],
    },
    {
      id: 'education', title: 'Education', src: 'Resume',
      keys: [['education', 5], ['degree', 4], ['college', 3], ['university', 3], ['qualification*', 4], ['cgpa', 4], ['gpa', 4], ['grades', 3], ['pgdm', 4], ['b tech', 4], ['btech', 4], ['school', 2], ['study', 2], ['studied', 2]],
      a: [
        "• <b>PGDM, Media & Entertainment (2025–27)</b> — S.P. Mandali's Prin. L. N. Welingkar Institute (WeSchool), Mumbai. 8.37/10 on the latest placement resume.",
        "• <b>B.Tech, Computer Science & Engineering (2024)</b> — Amrita Vishwa Vidyapeetham.",
      ],
      open: ['about'],
    },
    {
      id: 'certs', title: 'Certifications', src: 'Resume',
      keys: [['certif*', 5], ['course*', 3], ['kpmg', 4], ['udemy', 3], ['johns hopkins', 3], ['coursera', 2]],
      a: [
        "• Google Ads — Search, Display and Video (Skillshop)",
        "• KPMG India — 16-hour Sustainability Certification (ESG frameworks, Tableau)",
        "• HTML, CSS & JavaScript for Web Developers — Johns Hopkins (2020)",
        "• C for Everyone — UC (2023) · C# Unity Game Developer — Udemy (2021) · The Web Developer Bootcamp — Udemy (2025)",
      ],
    },
    {
      id: 'awards', title: 'Competitions & awards', src: 'Resume',
      keys: [['competition*', 5], ['award*', 4], ['achievement*', 4], ['won', 3], ['rank*', 3], ['finalist*', 4], ['runner*', 4], ['case comp*', 5], ['accolade*', 3]],
      a: [
        "Three national case competitions, all podium or final-round:",
        "• <b>IIM Sirmaur — Marketing Bowl 3.0:</b> 1st Runner-Up (tote bag go-to-market)",
        "• <b>IMT Ghaziabad — Brand Alchemy:</b> 2nd Runner-Up (Bata backpacks)",
        "• <b>IIM Indore — Prodyssey:</b> National Finalist (project delivery under COVID)",
      ],
      open: ['bowl', 'brand', 'prodyssey'],
    },
    {
      id: 'strategy', title: 'Strategy & analysis', src: 'Case decks · SIP',
      keys: [['strategy', 4], ['strategic', 4], ['consulting', 4], ['analysis', 3], ['analytical', 3], ['problem solving', 4], ['data driven', 3], ['insight*', 3]],
      a: [
        "Her strategy work follows one pattern: find the constraint, size the opportunity, phase the plan.",
        "• <b>Brand Alchemy</b> — flat core category → growth adjacency → TAM/SAM/SOM → 18-month rollout with capped downside (₹20–30 Cr test-and-scale).",
        "• <b>Prodyssey</b> — sudden constraint → asynchronous agile re-plan → a working model to test resourcing scenarios.",
        "• <b>SIP</b> — ran UPT/ATV/ASP analysis to separate the effect of clienteling from the effect of markdowns.",
      ],
      open: ['brand', 'prodyssey', 'sip'],
    },
    {
      id: 'analytics', title: 'How the analytics work', src: 'Site design',
      keys: [['analytics', 5], ['how does the analytics', 6], ['activity monitor', 6], ['tracking', 4], ['metrics', 4], ['dashboard', 3], ['localstorage', 5], ['data collect*', 4]],
      a: [
        "The Activity Monitor tracks eight metrics — visitors, windows viewed, time spent, project clicks (each project or folder card counts as its own piece of work), CV downloads, recruiter-mode selections, assistant questions and a ranked most-viewed list — and turns them into an Insights panel (e.g. \"most-clicked work → move its icon to the top-left\").",
        "Data lives in your browser's localStorage only; nothing is sent anywhere. A \"Load demo data\" toggle fills it for presentations.",
      ],
      open: ['activity'],
    },
    {
      id: 'site', title: 'How this site was made', src: 'Portfolio',
      keys: [['this site', 5], ['this website', 5], ['how was this', 6], ['how did you build', 5], ['how is this made', 5], ['built this', 4], ['made this', 4], ['ai assisted', 4], ['ai-assisted', 4], ['pixel art', 4], ['why is this', 4]],
      a: [
        "The desktop is a game-style interface — a nod to Nandita's game-development background — written in plain HTML, CSS and JavaScript.",
        "The avatar, icons and sound pack were created with AI: Claude wrote the code that draws the pixel art and synthesises the 8-bit sounds. Nandita directed the concept and checked every fact against her own documents. Want the full story? Ask her by email.",
      ],
      open: ['contact'],
    },
    {
      id: 'meta', title: 'About this assistant', src: 'Site design',
      keys: [['are you ai', 6], ['are you real', 6], ['are you a bot', 6], ['chatgpt', 3], ['claude', 3], ['how do you work', 6], ['prototype', 4], ['are you human', 5], ['how does this chat', 5], ['who built you', 5]],
      a: [
        "I'm a <b>prototype</b> assistant: rule-based intent matching over a hand-written knowledge base of Nandita's real background. That means I can't make things up — if I don't know, I'll say so.",
        "It's deliberately transparent (tap \"Why this answer?\" under any reply) — a design choice that echoes her SIRP research: explanations work when they're specific and in context. The code is structured so a live LLM behind a serverless proxy can be switched on later.",
      ],
    },
    {
      id: 'contact', title: 'Contact', src: 'Contact window',
      keys: [['contact', 5], ['email', 4], ['reach', 4], ['linkedin', 5], ['github', 5], ['connect', 3], ['get in touch', 5], ['talk to', 3], ['interview', 4], ['schedule', 3], ['call', 2]],
      a: [
        "Best way to reach Nandita:",
        "• Email — nanditamenon2001@gmail.com",
        "• LinkedIn — linkedin.com/in/nandita-menon-977439205",
        "• GitHub — github.com/nanditamenon003",
      ],
      open: ['contact'],
    },
    {
      id: 'resume', title: 'Resume', src: 'Portfolio',
      keys: [['resume', 6], ['cv', 6], ['curriculum', 4], ['download', 4]],
      a: ["Here's the one-page placement resume — one click, no exploring required."],
      actions: [{ type: 'cv' }],
    },
    {
      id: 'languages', title: 'Languages', src: 'Resume',
      keys: [['language*', 5], ['speak', 3], ['hindi', 3], ['malayalam', 3], ['tamil', 3], ['telugu', 3], ['multilingual', 3]],
      a: ["Nandita works in five languages: English, Hindi, Malayalam, Telugu and Tamil."],
    },
    {
      id: 'hobbies', title: 'Outside work', src: 'Resume · Nandita',
      keys: [['hobb*', 5], ['interests', 4], ['free time', 4], ['outside work', 5], ['for fun', 4], ['dance', 3], ['dancing', 3], ['reading', 3], ['personal life', 4], ['music', 3], ['cafe*', 3], ['cat*', 3], ['dog*', 3], ['pets', 3]],
      a: [
        "Music, dancing, reading and café hopping (she loves exploring new cafés). She also loves cats and dogs equally, and firmly refuses to pick a side in the cats-versus-dogs debate.",
        "And there's something hidden on this desktop for people who explore everything.",
      ],
    },
    {
      id: 'logistics', title: 'Availability & compensation', src: 'Not in knowledge base',
      keys: [['salary', 5], ['ctc', 5], ['compensation', 5], ['notice period', 5], ['available', 3], ['availability', 4], ['relocat*', 5], ['location', 3], ['joining', 4], ['when can', 3], ['expected pay', 4]],
      a: [
        "That's one for Nandita directly — a prototype shouldn't guess at availability, location or compensation. Email her at nanditamenon2001@gmail.com and she'll reply personally.",
      ],
      open: ['contact'],
    },
    {
      id: 'thanks', title: 'Thanks / goodbye', src: 'Built-in',
      keys: [['thanks', 4], ['thank you', 4], ['bye', 3], ['goodbye', 3], ['great', 1], ['cool', 1], ['awesome', 2]],
      a: ["Happy to help! If you'd like to talk to the human, the Contact window has everything. You can also explore the desktop — there's an XP meter up top and a few things hidden away."],
      open: ['contact'],
    },
  ];

  NM.data = { person, works, folders, WORKS, PROJECTS, iconOf, roles, ROLE_ORDER, defaultChips, kb };
})();
