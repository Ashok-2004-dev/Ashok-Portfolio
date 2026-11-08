# Ashok — The Digital Workspace

Personal portfolio of Ashok Acharya, upgraded from the original HTML, CSS and JavaScript site. All original text, skills, projects, education details, certificates and links are kept as they were; the upgrade changes design, layout, animation and functionality.

## Sections
Terminal, Home (with identity card), About Me, Technical Skills (constellation), Projects (explorer), Education (timeline), Certificates and Achievements, Contact.

## Features
- Welcome screen on opening the link: time-based greeting, animated logo, then it fades into the page (button to enter at once, or enter with music)
- Running strip of mini posters (certificates and projects) above the site, and small anime-style poster characters holding banners in Skills, Projects and Contact (original artwork, drawn in SVG)
- Smooth scroll-in animations with staggered cards, animated section headings and a back-to-top button
- Linux-style terminal at the top, prompt `ashok@portfolio:~$`. Commands: `help`, `home`, `about`, `skills`, `projects`, `findback`, `certificates`, `education`, `contact`, `music`, `theme`, `clear` (also `whoami`, `ls`). Up/Down arrows give history, Tab completes.
- Identity card that tilts with the pointer and flips to show details
- Skills constellation plus the original skill buttons and level meters (cybersecurity at basic level)
- Project explorer with the FindBack case study tabs (Problem, Solution, Features, Why it helps)
- Education timeline that fills as you scroll
- Certificate gallery with filters, full-size viewer (previous/next), verify links and PDF download
- Music player: "Neon Packets", a tech/synthwave loop (drums, bass, arpeggio, pad) generated in the browser with the Web Audio API, so there is no audio file and no licence issue. Music never starts by itself: choose "Enter with music" on the welcome screen or press play. Includes visualizer, volume and mute.
- Light and dark theme, copy-email button, contact form (opens your email app)
- Hidden extras for curious visitors

## Performance changes
- Removed the render-blocking Google Fonts request; the site uses system fonts
- Background is a light live network (drifting nodes with data packets travelling between them), capped at about 30 fps and paused when the tab is hidden
- Certificate previews are small lazy-loaded WebP images; one throttled scroll handler

## Folder structure
```text
Ashok-Portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
├── image/
│   └── profile.jpeg
└── certificates/     (6 original PDFs + their preview images)
```

## Run locally
Double-click `index.html` to open it in Chrome, Edge or Firefox. Do not use VS Code's built-in preview tab (it blocks local files). In VS Code, use the Live Server extension instead: right-click `index.html` and choose Open with Live Server. No build step, no dependencies.

## How to change things
- Colours: `style.css`, section 1
- Text and projects: `index.html`
- Skills and typed words: `script.js`, parts 6 and 8

## Deployment (GitHub Pages)
1. Create a repository and upload all files.
2. Settings → Pages → Branch `main`, folder `/ (root)` → Save.

## Projects
- Events Hub: https://github.com/Ashok-2004-dev/events_hub
- FindBack: Python Tkinter desktop app (source link to be added)
- E-Sports Management System: group academic mini project, in progress
- DrukHealth GO: hackathon project, a GNH-based online hospital token system for Bhutan

## Contact
Email: 2004.ashokacharya@gmail.com  
Phone: +975 77458410  
GitHub: https://github.com/Ashok-2004-dev
Facebook: https://www.facebook.com/share/19wjAB2tC5/
LinkedIn: coming soon
