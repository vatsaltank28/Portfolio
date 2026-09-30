// Single source of content. Everything here comes from the résumé, the portfolio PRD and the
// live sites themselves. Do not add metrics, clients, users or features that were not built.

// Disclaimers shown wherever these projects appear.
export const notes = {
  bbc: 'Not sold. Made professionally for a campaign.',
  nacl: 'Still under development, in talks with the client.',
}

export const links = {
  github: 'https://github.com/vatsaltank28',
  linkedin: 'https://www.linkedin.com/in/vatsal-tank-979a4328b',
  email: 'vatsaltank28@gmail.com',
  resume: 'https://vatsaltankresume.tiiny.site/',
  resumePdf: '/Vatsal_Tank_Resume.pdf',
  instagram: 'https://www.instagram.com/_echoverse.lyrics',
  arViewer: 'https://ar-product-viewer--vatsaltank28.replit.app/',
}

export const proof = [
  { k: 'Build', body: 'Full-stack apps, interactive websites and realtime products.', shot: '/shots/hd/nacl.webp' },
  { k: 'Design', body: 'UI/UX, Figma, interaction and visual systems.' },
  { k: 'Explore', body: 'AI tools, 3D on the web and product experiments.' },
  { k: 'Ship', body: 'Live on Netlify, GitHub Pages and a real client domain.', video: '/media/mixculturepizzeria-loop.mp4', shot: '/media/mixculturepizzeria.jpg' },
]

export const projects = [
  {
    slug: 'livevote',
    gallery: ['/shots/g/livevote-1.webp', '/shots/g/livevote-2.webp', '/shots/g/livevote-3.webp', '/shots/g/livevote-4.webp'],
    usage: ["Host opens a room and gets a six-character code", "Students join from their phones with that code", "Host puts a presenter on stage and opens voting", "Everyone scores 1 to 10; the host locks the vote", "Leaderboard, podium and Excel export update live"],
    title: 'LiveVote',
    kicker: 'Realtime classroom scoring',
    status: 'Product, completed',
    category: 'Full Stack',
    color: '#c6ff3d',
    shot: '/media/livevote.jpg',
    video: '/media/livevote.mp4',
    loop: '/media/livevote-loop.mp4',
    tint: true,
    summary: 'Hosts open a room, participants join with a code and score presentations 1 to 10 in real time.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Supabase Realtime', 'SheetJS', 'Framer Motion'],
    role: 'Designed and built the full product end to end: interface, data model and realtime layer.',
    problem: 'Scoring classroom presentations by hand is slow, opaque and hard to tabulate afterwards.',
    solution: 'A room-based web app where every participant scores from their own device, and results aggregate live for the host.',
    features: [
      'Host creates a room; participants join using a code',
      'Real-time 1-10 scoring with a host-controlled vote lifecycle and vote locking',
      'Participant presence and tracking',
      'Dynamic leaderboards, podium views and sorting modes',
      'Presenter breakdown and Excel export with multiple report scopes',
    ],
    architecture: [
      ['Frontend', 'React + TypeScript + Vite'],
      ['Backend', 'Supabase'],
      ['Realtime', 'Supabase Realtime'],
      ['Database', 'PostgreSQL'],
      ['Reporting', 'SheetJS'],
    ],
    challenges: ['Keeping participant and voting state synchronized across every connected device while the host controls the lifecycle.'],
    github: 'https://github.com/vatsaltank28',
  },
  {
    slug: 'nacl',
    gallery: ['/shots/g/nacl-1.webp', '/shots/g/nacl-2.webp', '/shots/g/nacl-3.webp', '/shots/g/nacl-4.webp'],
    usage: ["Pick a city hub: Bangalore, Mumbai or Coimbatore", "Browse curated movement experiences", "Book a pass and pay securely with Stripe", "Find it later under My Passes", "Get event alerts and join the WhatsApp community"],
    title: 'NaCl',
    kicker: 'Movement community platform',
    status: 'In development',
    note: notes.nacl,
    category: 'Full Stack',
    color: '#ff6a3d',
    shot: '/shots/hd/nacl.webp',
    summary: 'A community hub for curated movement experiences across Bangalore, Mumbai and Coimbatore.',
    tech: ['Next.js 15', 'TypeScript', 'React', 'Tailwind CSS', 'MongoDB', 'Mongoose', 'NextAuth', 'JWT', 'Stripe', 'Supabase', 'Three.js', 'React Three Fiber', 'GSAP'],
    role: 'Building the platform full stack: auth, data, payments, admin tooling and the interactive front end.',
    problem: 'A movement community needed one place to discover experiences, book passes and stay connected between events.',
    solution: 'A platform with experience listings, pass booking, city hubs, event alerts and a path into the WhatsApp community.',
    features: [
      'Experience discovery with city-hub filtering',
      'Pass booking and a My Passes area',
      'Event alerts: immediate or weekly digest',
      'Stripe payments, webhooks and order-state management',
      'Interactive motion and 3D touches on the front end',
    ],
    architecture: [
      ['Framework', 'Next.js 15 + TypeScript'],
      ['Data', 'MongoDB + Mongoose'],
      ['Media', 'Supabase storage'],
      ['Auth', 'NextAuth + JWT'],
      ['Payments', 'Stripe + webhooks'],
    ],
    challenges: ['Keeping order state consistent between Stripe webhooks and the database.', 'Adding motion without slowing the booking flow.'],
    live: 'https://naclcollective.netlify.app/',
    github: 'https://github.com/vatsaltank28/Nacl_community_stories',
  },
  {
    slug: 'mixculture',
    gallery: ['/shots/g/mixculture-1.webp', '/shots/g/mixculture-2.webp', '/shots/g/mixculture-3.webp', '/shots/g/mixculture-4.webp'],
    usage: ["Land on the story and signature deep-dish pizzas", "Browse the full menu by category", "Read reviews and the gallery", "Reserve a table, call or message on WhatsApp", "Order online through Zomato or Swiggy"],
    title: 'MixCulture',
    kicker: 'Pizzeria, client website',
    status: 'Live, client',
    category: 'Client',
    color: '#e8412c',
    shot: '/shots/hd/mixculture.webp',
    video: '/media/mixculturepizzeria.mp4',
    loop: '/media/mixculturepizzeria-loop.mp4',
    poster: '/media/mixculturepizzeria.jpg',
    summary: 'The live website for a deep-dish pizzeria in Vile Parle, Mumbai. Real client, real domain.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive UI/UX'],
    role: 'Designed and developed the website for the client.',
    problem: 'The restaurant needed a web presence that tells its story and drives people to order, call or reserve.',
    solution: 'A responsive site covering menu, brand story, reviews, galleries, location and ordering calls to action.',
    features: [
      'Menu presentation and brand storytelling',
      'Reviews and galleries',
      'Reserve, call and WhatsApp shortcuts',
      'Online-ordering calls to action',
      'Responsive layouts across devices',
    ],
    architecture: [['Stack', 'HTML, CSS, JavaScript'], ['Focus', 'Responsive UI/UX'], ['Status', 'Live in production']],
    challenges: ['Delivering a polished, consistent experience on every screen size.'],
    live: 'https://mixculturepizzeria.com/',
  },
  {
    slug: 'smartattendance',
    gallery: ['/shots/g/attendance-1.webp', '/shots/g/attendance-2.webp', '/shots/g/attendance-3.webp'],
    usage: ["Create a class and add subjects", "Photograph the paper roll sheet", "AI reads names in roll order into a roster", "Mark a lecture in under a minute", "Export a formatted Excel report with absentees flagged"],
    title: 'SmartAttendance',
    kicker: 'AI attendance for faculty',
    status: 'Live prototype',
    category: 'AI',
    color: '#19c37d',
    shot: '/shots/hd/attendance.webp',
    summary: 'Digitize paper attendance sheets with AI, mark a lecture fast and export formatted Excel reports.',
    tech: ['React', 'Google AI Studio', 'Gemini', 'Excel export'],
    role: 'Designed and built the app.',
    problem: 'Faculty re-type paper attendance into spreadsheets by hand, lecture after lecture.',
    solution: 'Photograph a roster, let AI digitize it, mark attendance in one screen and export the report.',
    features: [
      'Digitize a roster from a photo',
      'Class, subject and session management',
      'Per-student attendance percentages and search',
      'Auto-formatted Excel exports with absentees flagged',
    ],
    architecture: [['Build', 'Google AI Studio'], ['AI', 'Roster digitization'], ['Output', 'Excel reports']],
    challenges: ['Making AI-read rosters reliable enough that faculty trust them without re-checking.'],
    live: 'https://smartattendance101.netlify.app/',
  },
  {
    slug: 'inventory',
    usage: ["Sign in; passwords are stored as SHA-256 hashes", "Add items and suppliers to the SQLite store", "Search instantly through a BST index", "Stock moves through FIFO queues; undo with a stack", "Supplier-item links are modelled as a graph"],
    title: 'Inventory',
    kicker: 'Management system',
    status: 'Academic, completed',
    category: 'Python / DSA',
    color: '#3dd9ff',
    summary: 'A desktop inventory system where the data structures are the point: BSTs, queues, stacks and graphs.',
    tech: ['Python', 'PyQt6', 'SQLite', 'Data Structures'],
    role: 'Built the application, its data layer and the underlying data-structure implementations.',
    problem: 'Apply classic data structures to a real, database-backed desktop workflow.',
    solution: 'A PyQt6 app with authentication, search and stock management backed by SQLite.',
    features: [
      'Authentication with SHA-256 password hashing',
      'BST indexing, binary search and dictionary lookup',
      'Undo stacks and FIFO stock queues',
      'Supplier-item graph relationships and linked lists',
    ],
    architecture: [['UI', 'PyQt6'], ['Storage', 'SQLite'], ['Core', 'BST, queue, stack, graph, linked list']],
    challenges: ['Keeping in-memory structures consistent with the database.'],
    github: 'https://github.com/vatsaltank28/Inventory_Management_System',
  },
  {
    slug: 'debrief',
    usage: ["Capture a conversation or session", "AI turns it into structured notes", "Notes are categorised automatically", "Review, edit and keep what matters", "Each prototype iteration refined this loop"],
    title: 'Debrief',
    kicker: 'AI note-taking product',
    status: 'Prototype',
    category: 'AI',
    color: '#ffd23d',
    summary: 'An AI note-taking and productivity product, shaped through several prototype iterations.',
    tech: ['React', 'AI'],
    role: 'Product design and prototyping across multiple iterations.',
    problem: 'Turning conversations and sessions into useful, structured notes without manual effort.',
    solution: 'An evolving prototype. Each iteration refined the concept rather than starting over.',
    features: ['Idea, prototype, feedback, iteration', 'Several repositories consolidated into one product story'],
    architecture: [['Status', 'Concept / prototype'], ['Approach', 'Iterative product development']],
    challenges: ['Finding the right product shape through iteration.'],
    github: 'https://github.com/vatsaltank28',
  },
]

// Live sites shown as full-bleed screenshots in the "on the web" gallery.
export const liveWork = [
  { t: 'NaCl Collective', d: 'Movement community, bookings and city hubs', shot: '/shots/hd/nacl.webp', url: 'https://naclcollective.netlify.app/', slug: 'nacl', note: notes.nacl },
  { t: 'MixCulture Pizzeria', d: 'Client website, live in Mumbai', shot: '/shots/hd/mixculture.webp', loop: '/media/mixculturepizzeria-loop.mp4', url: 'https://mixculturepizzeria.com/', slug: 'mixculture' },
  { t: 'SmartAttendance', d: 'AI roster digitization and Excel reports', shot: '/shots/hd/attendance.webp', url: 'https://smartattendance101.netlify.app/', slug: 'smartattendance' },
  { t: 'AI Segregator', d: 'Excel approval segregator, fully client-side', shot: '/shots/hd/segregator.webp', url: 'https://ai-seggregator.vercel.app/', usage: ['Upload any Excel or CSV sheet', 'It detects names, phone numbers and approval status', 'Bulk-edit rows by type', 'Export a clean, colour-coded Excel file'] },
  { t: 'British Brewing Co.', d: 'Hospitality website concept, Lower Parel', note: notes.bbc, shot: '/shots/hd/bbc.webp', url: 'https://vatsaltank28.github.io/British-Brewing-Company/', gallery: ['/shots/g/bbc-1.webp', '/shots/g/bbc-3.webp', '/shots/g/bbc-4.webp', '/shots/g/bbc-5.webp'] },
]

export const archive = [
  { t: 'LiveVote', c: 'Full Stack', s: 'Product' },
  { t: 'NaCl Collective', c: 'Full Stack', s: 'In development', note: notes.nacl, url: 'https://naclcollective.netlify.app/' },
  { t: 'SmartAttendance', c: 'AI', s: 'Live', url: 'https://smartattendance101.netlify.app/' },
  { t: 'Debrief', c: 'AI', s: 'Prototype' },
  { t: 'AgriNova AI', c: 'AI', s: 'Prototype' },
  { t: 'MixCulture Pizzeria', c: 'Client', s: 'Live', url: 'https://mixculturepizzeria.com/' },
  { t: 'British Brewing Company', c: 'Web', s: 'Campaign', note: notes.bbc, url: 'https://vatsaltank28.github.io/British-Brewing-Company/' },
  { t: 'AI Segregator', c: 'AI', s: 'Live', url: 'https://ai-seggregator.vercel.app/' },
  { t: 'AR Product Viewer', c: 'Experimental', s: 'Experiment', url: 'https://ar-product-viewer--vatsaltank28.replit.app/' },
  { t: 'Echoverse Lyrics', c: 'Creative', s: 'Instagram', url: 'https://www.instagram.com/_echoverse.lyrics' },
  { t: 'Pizzaverse', c: 'Web', s: 'Project' },
  { t: 'Culture-Pizzeria', c: 'Web', s: 'Project' },
  { t: 'Inventory Management System', c: 'Python / DSA', s: 'Academic', url: 'https://github.com/vatsaltank28/Inventory_Management_System' },
  { t: 'Library Management System', c: 'Python / DSA', s: 'Academic', url: 'https://github.com/vatsaltank28/library_management_system' },
  { t: 'To-Do Scheduler', c: 'Web', s: 'Project' },
  { t: 'Hospital Website UI', c: 'UI / UX', s: 'Design' },
]

export const skills = [
  { g: 'Languages', items: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'] },
  { g: 'Frontend', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS'], used: 'LiveVote, NaCl, Debrief' },
  { g: 'Backend / Data', items: ['Next.js APIs', 'REST APIs', 'MongoDB', 'Mongoose', 'PostgreSQL', 'Supabase', 'SQLite'], used: 'LiveVote, NaCl, Inventory' },
  { g: 'Realtime / Payments', items: ['Supabase Realtime', 'Stripe', 'Stripe Webhooks'], used: 'LiveVote, NaCl' },
  { g: '3D / Motion', items: ['Three.js', 'React Three Fiber', 'Drei', 'GSAP', 'Framer Motion'], used: 'NaCl, this portfolio' },
  { g: 'AI', items: ['Google AI Studio', 'Gemini', 'Prompted workflows'], used: 'SmartAttendance, Debrief' },
  { g: 'CS Fundamentals', items: ['Data Structures', 'Algorithms', 'OOP', 'Databases'], used: 'Inventory, Library MS' },
  { g: 'Design & Tools', items: ['Figma', 'UI/UX', 'Responsive Design', 'Git', 'GitHub', 'Vercel', 'Netlify'], used: 'MixCulture, BBC concept' },
]

export const journey = [
  { t: 'First websites', d: 'Tribute pages and HTML/CSS experiments', tag: 'HTML · CSS' },
  { t: 'Frontend experiments', d: 'Interaction, layout and CSS craft', tag: 'Layout · Motion' },
  { t: 'Python and DSA', d: 'Inventory and Library Management Systems', tag: 'Python · SQLite' },
  { t: 'Client work', d: 'MixCulture Pizzeria goes live', tag: 'Live client', img: '/shots/hd/mixculture.webp' },
  { t: 'Product prototypes', d: 'Debrief, AgriNova AI, NACL prototypes', tag: 'AI · Product' },
  { t: 'Full-stack platforms', d: 'NaCl Collective, in development with the client', tag: 'Next.js · Stripe', img: '/shots/hd/nacl.webp' },
  { t: 'Realtime and AI', d: 'LiveVote and SmartAttendance', tag: 'Supabase · Gemini', img: '/media/livevote.jpg' },
  { t: 'Now', d: 'Still shipping, still iterating', tag: 'In progress' },
]

export const achievements = [
  ['94.62', 'MHT-CET 2025 percentile'],
  ['30', 'Public repositories on GitHub'],
  ['5', 'Sites live on the web'],
  ['3', "Horizon'26 Hackathon, Hyphen 2.0 Ideathon, AIML Quiz Mania"],
]

export const stack = ['React', 'Next.js', 'TypeScript', 'Supabase', 'MongoDB', 'Stripe', 'Three.js', 'GSAP', 'Python', 'PyQt6', 'Figma', 'Tailwind CSS']

export const repos = [
  { n: 'Nacl_community_stories', u: 'https://github.com/vatsaltank28/Nacl_community_stories', d: 'NaCl Collective platform: Next.js, Stripe, MongoDB' },
  { n: 'Inventory_Management_System', u: 'https://github.com/vatsaltank28/Inventory_Management_System', d: 'PyQt6 + SQLite, built on classic data structures' },
  { n: 'library_management_system', u: 'https://github.com/vatsaltank28/library_management_system', d: 'Python library system, DSA practice' },
  { n: 'British-Brewing-Company', u: 'https://github.com/vatsaltank28/British-Brewing-Company', d: 'Hospitality website concept for a campaign. Not sold.' },
  { n: 'All 30 repositories', u: 'https://github.com/vatsaltank28', d: 'Everything else on my GitHub profile' },
]

// Icons for the skills loop, served by simpleicons.org (slug, label)
export const skillLogos = [
  ['react', 'React'], ['nextdotjs', 'Next.js'], ['typescript', 'TypeScript'], ['javascript', 'JavaScript'], ['python', 'Python'],
  ['supabase', 'Supabase'], ['mongodb', 'MongoDB'], ['postgresql', 'PostgreSQL'], ['stripe', 'Stripe'], ['threedotjs', 'Three.js'],
  ['greensock', 'GSAP'], ['tailwindcss', 'Tailwind CSS'], ['vite', 'Vite'], ['figma', 'Figma'], ['git', 'Git'], ['sqlite', 'SQLite'],
  ['qt', 'PyQt6'], ['netlify', 'Netlify'], ['vercel', 'Vercel'], ['googlegemini', 'Gemini'],
]
