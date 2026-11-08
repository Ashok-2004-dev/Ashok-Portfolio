/* =====================================================
   script.js  -  makes the website interactive
   Parts: 1 theme · 2 menu · 3 active link · 4 scroll effects · 5 reveal · 6 typing
   7 count-up · 8 skills + constellation · 9 card glow · 10 copy email · 11 form · 12 year
   13 loader · 14 pointer effects · 15 identity card · 16 project explorer · 17 certificates
   18 music · 19 terminal · 20 easter eggs
   ===================================================== */
function find(selector) { return document.querySelector(selector); }
function findAll(selector) { return document.querySelectorAll(selector); }
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- 1. LIGHT / DARK THEME ---------- */
const root = document.documentElement;
function setTheme(name) {
  root.setAttribute("data-theme", name);
  try { localStorage.setItem("theme", name); } catch (e) {}
}
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
setTheme(savedTheme);
find("#theme").addEventListener("click", function () {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

/* ---------- 2. MOBILE MENU ---------- */
const burger = find("#burger");
const menu = find("#links");
function closeMenu() { menu.classList.remove("open"); burger.textContent = "☰"; burger.setAttribute("aria-expanded", "false"); }
burger.addEventListener("click", function () {
  const isOpen = menu.classList.toggle("open");
  burger.textContent = isOpen ? "✕" : "☰";
  burger.setAttribute("aria-expanded", String(isOpen));
});
findAll("#links a").forEach(function (link) { link.addEventListener("click", closeMenu); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

/* ---------- 3. HIGHLIGHT THE MENU ITEM OF THE SECTION YOU ARE READING ---------- */
const sectionWatcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      findAll("#links a").forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
findAll("main section").forEach(function (section) { sectionWatcher.observe(section); });

/* ---------- 4. SCROLL EFFECTS (one throttled handler: progress bar, timeline, parallax) ---------- */
let mouseY = 0, ticking = false;
const aurora = find(".aurora"), timeline = find(".timeline"), bar = find("#progress");
function onScroll() {
  ticking = false;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0) + "%";
  if (!calm) aurora.style.setProperty("--py", (-window.scrollY * 0.05 + mouseY) + "px");
  const r = timeline.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
  timeline.style.setProperty("--tl", p.toFixed(3));
}
function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", requestTick);
requestTick();

/* ---------- 5. FADE-IN WHEN SCROLLING ---------- */
const fadeWatcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) { entry.target.classList.add("show"); fadeWatcher.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
findAll("h2, .text, .facts, .skills-layout, .explorer, .timeline, .cert-grid, .tags, .filters, form.card").forEach(function (item) {
  item.classList.add("fade");
  fadeWatcher.observe(item);
});

/* ---------- 6. TYPING TEXT IN THE HOME SECTION ---------- */
const words = ["networking", "linux", "web-development", "cybersecurity-basics"];
let wordIndex = 0, letterCount = 0, deleting = false;
function typeLoop() {
  const word = words[wordIndex];
  find("#typed").textContent = word.slice(0, letterCount);
  if (!deleting && letterCount === word.length) { deleting = true; setTimeout(typeLoop, 1500); return; }
  if (deleting && letterCount === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; }
  letterCount += deleting ? -1 : 1;
  setTimeout(typeLoop, deleting ? 40 : 85);
}
if (calm) find("#typed").textContent = words[0]; else typeLoop();

/* ---------- 7. COUNT-UP NUMBERS ---------- */
findAll("[data-count]").forEach(function (box) {
  const finalNumber = Number(box.getAttribute("data-count"));
  if (calm) { box.textContent = finalNumber; return; }
  let current = 0;
  const timer = setInterval(function () {
    current++; box.textContent = current;
    if (current >= finalNumber) clearInterval(timer);
  }, 200);
});

/* ---------- 8. SKILLS SECTION + CONSTELLATION ----------
   CHANGE SKILLS HERE (name, color, level 1-5, label, text, tools) */
const skills = [
  { name: "Networking", color: "#8b5cf6", level: 3, label: "Developing",
    text: "Studying core networking concepts through my diploma and Cisco CCNA modules: Introduction to Networks, and Switching, Routing and Wireless Essentials.",
    tools: ["Network fundamentals", "Switching", "Routing", "Wireless"] },
  { name: "Linux and systems", color: "#34d399", level: 3, label: "Developing",
    text: "Working with Linux and the command line, supported by online courses in Linux and server administration.",
    tools: ["Linux", "Command line", "Server administration", "Computer hardware"] },
  { name: "Web development", color: "#38bdf8", level: 3, label: "Comfortable",
    text: "Building responsive, multi-page websites with HTML, CSS and JavaScript, including Events Hub.",
    tools: ["HTML", "CSS", "JavaScript"] },
  { name: "Programming", color: "#fbbf24", level: 3, label: "Developing",
    text: "Writing programs and small applications while strengthening problem-solving and logic.",
    tools: ["Python", "Java", "JavaScript", "Tkinter"] },
  { name: "Databases", color: "#a78bfa", level: 2, label: "Developing",
    text: "Learning how databases store data and support applications, using MySQL in my academic projects.",
    tools: ["MySQL", "Basic queries"] },
  { name: "Cybersecurity", color: "#f472b6", level: 1, label: "Basic",
    text: "At the foundation stage: learning security fundamentals, safe computing habits and the basics of securing networks and systems.",
    tools: ["Security fundamentals", "Safe computing", "Network security basics"] }
];

const skillButtons = find("#skillButtons"), skillDetail = find("#skillDetail"), svg = find("#constellation");
const NS = "http://www.w3.org/2000/svg", CX = 260, CY = 200;
function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
  if (parent) parent.appendChild(n);
  return n;
}
const stars = [];
(function buildConstellation() {
  const edges = el("g", {}, svg), nodes = el("g", {}, svg), toolsLayer = el("g", {}, svg);
  for (let i = 0; i < 40; i++) {                       // background stars (deterministic positions)
    const c = el("circle", { cx: (i * 137) % 520, cy: (i * 89 + 31) % 420, r: i % 3 ? 0.9 : 1.4, fill: "#9aa3c7", opacity: 0.5 }, svg);
    if (i % 4 === 0 && !calm) { c.setAttribute("class", "twinkle"); c.style.animationDelay = (i % 7) * 0.4 + "s"; }
  }
  svg.insertBefore(edges, svg.firstChild.nextSibling);
  skills.forEach(function (s, i) {
    const a = -Math.PI / 2 + i * (Math.PI * 2 / skills.length);
    s.x = CX + Math.cos(a) * 185; s.y = CY + Math.sin(a) * 135; s.angle = a;
    s.edge = el("line", { class: "edge", x1: CX, y1: CY, x2: s.x, y2: s.y }, edges);
    const g = el("g", { class: "star", tabindex: 0, role: "button", "aria-label": s.name + ", " + s.label, style: "color:" + s.color }, nodes);
    el("circle", { class: "ring", cx: s.x, cy: s.y, r: 12 + s.level * 3 + 8 }, g);
    el("circle", { class: "core", cx: s.x, cy: s.y, r: 7 + s.level * 3, fill: s.color }, g);
    el("text", { x: s.x, y: s.y + 30 + s.level * 3 }, g).textContent = s.name;
    g.addEventListener("click", function () { showSkill(i); });
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showSkill(i); } });
    stars.push(g);
  });
  const hub = el("g", {}, nodes);
  el("circle", { cx: CX, cy: CY, r: 26, fill: "url(#hubgrad)" }, hub);
  el("text", { x: CX, y: CY + 5, style: "font-weight:800;fill:#fff" }, hub).textContent = "AA";
  const defs = el("defs", {}, svg), gr = el("linearGradient", { id: "hubgrad" }, defs);
  el("stop", { offset: "0", "stop-color": "#8b5cf6" }, gr); el("stop", { offset: "1", "stop-color": "#22d3ee" }, gr);
  svg.appendChild(toolsLayer); svg.toolsLayer = toolsLayer;
})();

function showSkill(index) {
  const skill = skills[index];
  findAll("#skillButtons button").forEach(function (button, i) { button.classList.toggle("selected", i === index); });
  stars.forEach(function (g, i) { g.classList.toggle("sel", i === index); skills[i].edge.classList.toggle("on", i === index); });

  const layer = svg.toolsLayer; layer.textContent = "";               // one small star per tool around the chosen node
  skill.tools.forEach(function (t, k) {
    const spread = (k - (skill.tools.length - 1) / 2) * 0.55, a = skill.angle + spread, d = 62 + (k % 2) * 14;
    const x = skill.x + Math.cos(a) * d * (a === skill.angle ? 1 : 1), y = skill.y + Math.sin(a) * d * 0.8;
    el("line", { class: "edge on", x1: skill.x, y1: skill.y, x2: x, y2: y, "stroke-dasharray": "3 3" }, layer);
    const dot = el("circle", { class: "tool", cx: x, cy: y, r: 4 }, layer);
    el("title", {}, dot).textContent = t;
    requestAnimationFrame(function () { dot.classList.add("on"); });
  });

  let bars = "";
  for (let i = 0; i < 5; i++) bars += "<i></i>";
  let tags = "";
  skill.tools.forEach(function (tool) { tags += "<li>" + tool + "</li>"; });
  skillDetail.innerHTML = "<h3>" + skill.name + "</h3><p>" + skill.text + "</p>" +
    '<div class="level"><div class="meter">' + bars + "</div><b>" + skill.label + "</b></div>" +
    '<ul class="tags">' + tags + "</ul>";
  setTimeout(function () {
    skillDetail.querySelectorAll(".meter i").forEach(function (b, i) { if (i < skill.level) b.classList.add("on"); });
  }, 50);
}
skills.forEach(function (skill, index) {
  const button = document.createElement("button");
  button.type = "button"; button.textContent = skill.name;
  button.style.setProperty("--dot", skill.color);
  button.addEventListener("click", function () { showSkill(index); });
  skillButtons.appendChild(button);
});
showSkill(0);

/* ---------- 9. GLOW THAT FOLLOWS THE MOUSE ON CARDS ---------- */
document.addEventListener("pointermove", function (event) {
  const card = event.target.closest && event.target.closest(".card");
  if (!card) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty("--x", event.clientX - box.left + "px");
  card.style.setProperty("--y", event.clientY - box.top + "px");
}, { passive: true });

/* ---------- 10. COPY EMAIL BUTTON ---------- */
find("#copy").addEventListener("click", function () {
  const button = find("#copy"), email = "2004.ashokacharya@gmail.com";
  function done() { button.textContent = "Copied"; setTimeout(function () { button.textContent = "Copy email"; }, 1800); }
  function fallback() {
    const t = document.createElement("textarea"); t.value = email; t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); done(); } catch (e) { button.textContent = "Copy failed"; }
    t.remove();
  }
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(done, fallback); else fallback();
});

/* ---------- 11. CONTACT FORM ---------- */
find("#form").addEventListener("submit", function (event) {
  event.preventDefault();
  const form = event.target, message = find("#formMessage");
  let allFilled = true;
  form.querySelectorAll("input, textarea").forEach(function (field) {
    const empty = field.value.trim() === "";
    field.classList.toggle("error", empty);
    if (empty) allFilled = false;
  });
  if (!allFilled) { message.textContent = "Please fill in every field."; return; }
  const subject = encodeURIComponent("Portfolio message from " + form.name.value);
  const body = encodeURIComponent(form.message.value + "\n\nFrom: " + form.name.value + " (" + form.email.value + ")");
  window.location.href = "mailto:2004.ashokacharya@gmail.com?subject=" + subject + "&body=" + body;
  message.textContent = "Opening your email app. If nothing opens, use the email address above.";
});

/* ---------- 12. YEAR IN THE FOOTER ---------- */
find("#year").textContent = new Date().getFullYear();

/* ---------- 13. WELCOME SCREEN + HERO ENTRANCE ----------
   Shows a greeting for a few seconds, then fades into the page. The visitor can enter at once with the button
   (or with music: browsers only allow sound after a click, so the music button is what starts it). */
[...find(".hero-text").children].forEach(function (e, i) { e.style.setProperty("--i", i); });
(function () {
  const box = find("#loader"), hour = new Date().getHours();
  find("#wGreet").textContent = hour < 12 ? "Good morning, welcome" : hour < 18 ? "Good afternoon, welcome" : "Good evening, welcome";
  document.body.classList.add("welcoming");
  let gone = false, timer;
  function enter(withMusic) {
    if (gone) return; gone = true; clearTimeout(timer);
    box.classList.add("done");
    document.body.classList.remove("welcoming");
    document.body.classList.add("entered");
    window.scrollTo(0, 0);
    if (withMusic) music.play();
    setTimeout(function () { box.remove(); }, 900);
  }
  find("#wEnter").addEventListener("click", function () { enter(false); });
  find("#wMusic").addEventListener("click", function () { enter(true); });
  find("#wEnter").focus({ preventScroll: true });
  timer = setTimeout(function () { enter(false); }, calm ? 1500 : 6500);
})();

/* ---------- 13b. STAGGERED REVEAL OF LIST ITEMS + BACK-TO-TOP ---------- */
findAll(".cert-grid li, .timeline li, .tags li, .stats .card").forEach(function (item, i) {
  item.style.setProperty("--d", (i % 6) * 70 + "ms");
  item.classList.add("fade", "stagger");
  fadeWatcher.observe(item);
});
(function () {
  const btn = find("#backTop");
  addEventListener("scroll", function () { btn.classList.toggle("on", scrollY > 700); }, { passive: true });
  btn.addEventListener("click", function () { scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" }); });
})();

/* ---------- 14. POINTER EFFECTS: cursor light + subtle parallax (mouse devices only) ---------- */
if (finePointer && !calm) {
  const glow = find(".glow-cursor"); let gx = 0, gy = 0, queued = false;
  addEventListener("pointermove", function (e) {
    gx = e.clientX; gy = e.clientY; mouseY = (e.clientY / innerHeight - 0.5) * -24;
    aurora.style.setProperty("--px", ((e.clientX / innerWidth - 0.5) * -24) + "px");
    if (!queued) { queued = true; requestAnimationFrame(function () { glow.style.transform = "translate(" + gx + "px," + gy + "px)"; glow.classList.add("on"); queued = false; requestTick(); }); }
  }, { passive: true });
  document.addEventListener("pointerleave", function () { glow.classList.remove("on"); });
}

/* ---------- 15. IDENTITY CARD: tilt + flip ---------- */
(function () {
  const card = find("#idCard"), btn = find("#flipBtn");
  if (finePointer && !calm) {
    card.addEventListener("pointermove", function (e) {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", (x - 0.5) * 16 + "deg"); card.style.setProperty("--rx", (0.5 - y) * 14 + "deg");
      card.style.setProperty("--hx", x * 100 + "%"); card.style.setProperty("--hy", y * 100 + "%");
    });
    card.addEventListener("pointerleave", function () { card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg"); });
  }
  function flip() {
    const on = card.classList.toggle("flipped");
    btn.setAttribute("aria-pressed", String(on)); btn.textContent = on ? "Flip back" : "Flip card";
    find(".back").setAttribute("aria-hidden", String(!on)); find(".front").setAttribute("aria-hidden", String(on));
  }
  btn.addEventListener("click", flip);
  card.querySelector(".front").addEventListener("dblclick", flip);
})();

/* ---------- 16. PROJECT EXPLORER + FINDBACK TABS ---------- */
const explorer = find(".explorer");
function openProject(id) {
  findAll(".tree button").forEach(function (b) {
    const on = b.dataset.proj === id;
    b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on)); b.firstElementChild.textContent = on ? "▾" : "▸";
  });
  findAll(".project").forEach(function (p) { p.classList.toggle("on", p.id === id); });
}
explorer.classList.add("ready");
findAll(".tree button").forEach(function (b) { b.addEventListener("click", function () { openProject(b.dataset.proj); }); });
function openFindbackTab(id) {
  findAll(".tabs button").forEach(function (x) { x.classList.toggle("on", x.dataset.p === id); });
  findAll(".panel").forEach(function (p) { p.classList.toggle("on", p.id === id); });
}
findAll(".tabs button").forEach(function (b) { b.addEventListener("click", function () { openFindbackTab(b.dataset.p); }); });

/* ---------- 17. CERTIFICATE VAULT: filters, tilt, viewer, download ---------- */
(function () {
  const lb = find("#lb"); let current = 0, list = [];
  findAll(".filters button").forEach(function (b) {
    b.addEventListener("click", function () {
      findAll(".filters button").forEach(function (x) { x.classList.toggle("on", x === b); });
      findAll(".vault li").forEach(function (li) { li.hidden = b.dataset.f !== "all" && li.dataset.cat !== b.dataset.f; });
    });
  });
  function show(i) {
    current = (i + list.length) % list.length;
    const d = list[current].dataset, img = find("#lbImg");
    img.src = d.full; img.alt = d.title + " certificate";
    find("#lbInfo").textContent = d.title + " · " + d.by + " · " + d.date + (d.id ? " · " + d.id : "");
    const dl = find("#lbDl"); dl.href = d.pdf; dl.setAttribute("download", d.pdf.split("/").pop());
    const v = find("#lbVerify"); v.hidden = !d.verify; v.href = d.verify || "#";
  }
  findAll(".vault button.v").forEach(function (b) {
    if (finePointer && !calm) {
      b.addEventListener("pointermove", function (e) {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--ry", (e.clientX - r.left) / r.width * 10 - 5 + "deg");
        b.style.setProperty("--rx", 5 - (e.clientY - r.top) / r.height * 10 + "deg");
      });
      b.addEventListener("pointerleave", function () { b.style.setProperty("--rx", "0deg"); b.style.setProperty("--ry", "0deg"); });
    }
    b.addEventListener("click", function () {
      list = [...findAll(".vault li:not([hidden]) button.v")];
      show(list.indexOf(b)); lb.showModal();
    });
  });
  find("#lbPrev").addEventListener("click", function () { show(current - 1); });
  find("#lbNext").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(current - 1); if (e.key === "ArrowRight") show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.id === "lbClose") lb.close(); });
})();

/* ---------- 18. MUSIC PLAYER: "Neon Packets" ----------
   A tech / synthwave loop (drums, bass, arpeggio, pad) synthesised live with the Web Audio API.
   No audio file, so there is no licence issue. The page tries to start it on load; if the browser
   blocks that, the player waits for the play button. */
const music = (function () {
  const play = find("#mPlay"), mute = find("#mMute"), vol = find("#mVol"), bars = findAll(".bars i"), status = find("#mStatus");
  let ac, master, an, comp, delay, noiseBuf, sched, on = false, muted = false, step = 0, nextT = 0;
  const BPM = 100, S = 60 / BPM / 4;                                          // one 16th note
  const chords = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]];   // Am F C G
  const roots = [55, 43.65, 65.41, 49];
  const arp = [0, 1, 2, 1, 0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1];
  function out(node) { node.connect(comp); }
  function env(g, t, peak, dur, atk) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + (atk || 0.005)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
  function kick(t) { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12); env(g, t, 0.9, 0.28); o.connect(g); out(g); o.start(t); o.stop(t + 0.3); }
  function noise(t, dur, type, freq, peak) { const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = noiseBuf; f.type = type; f.frequency.value = freq; env(g, t, peak, dur); s.connect(f); f.connect(g); out(g); s.start(t); s.stop(t + dur + 0.02); }
  function bass(t, f) { const o = ac.createOscillator(), l = ac.createBiquadFilter(), g = ac.createGain(); o.type = "sawtooth"; o.frequency.value = f; l.type = "lowpass"; l.frequency.setValueAtTime(900, t); l.frequency.exponentialRampToValueAtTime(220, t + 0.2); env(g, t, 0.32, 0.22); o.connect(l); l.connect(g); out(g); o.start(t); o.stop(t + 0.25); }
  function lead(t, f) { const o = ac.createOscillator(), l = ac.createBiquadFilter(), g = ac.createGain(); o.type = "square"; o.frequency.value = f; l.type = "lowpass"; l.frequency.value = 2400; env(g, t, 0.07, 0.2); o.connect(l); l.connect(g); g.connect(delay); out(g); o.start(t); o.stop(t + 0.22); }
  function pad(t, notes) { notes.forEach(function (f) { const o = ac.createOscillator(), g = ac.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 0.6); g.gain.linearRampToValueAtTime(0.0001, t + S * 16); o.connect(g); out(g); o.start(t); o.stop(t + S * 16 + 0.05); }); }
  function tick(s, t) {
    const bar = Math.floor(s / 16) % 4, i = s % 16, ch = chords[bar];
    if (i % 4 === 0) kick(t);
    if (i === 4 || i === 12) noise(t, 0.16, "bandpass", 1800, 0.38);
    if (i % 2 === 1 || i === 2 || i === 10) noise(t, 0.04, "highpass", 7500, i % 4 === 2 ? 0.2 : 0.12);
    if (i % 2 === 0) bass(t, roots[bar] * (i % 8 === 6 ? 2 : 1));
    lead(t, ch[arp[i]] * 2);
    if (i === 0) pad(t, ch);
  }
  function loop() { while (nextT < ac.currentTime + 0.2) { tick(step, nextT); nextT += S; step = (step + 1) % 64; } }
  function build() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = muted ? 0 : vol.value;
    comp = ac.createDynamicsCompressor(); an = ac.createAnalyser(); an.fftSize = 64;
    delay = ac.createDelay(1); delay.delayTime.value = S * 3; const fb = ac.createGain(); fb.gain.value = 0.35; delay.connect(fb); fb.connect(delay); delay.connect(comp);
    comp.connect(master); master.connect(an); an.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  function viz() {
    if (!on) { bars.forEach(function (b) { b.style.height = "3px"; }); return; }
    const a = new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(a);
    bars.forEach(function (b, i) { b.style.height = 3 + a[i * 2 + 1] / 255 * 24 + "px"; });
    requestAnimationFrame(viz);
  }
  function ui() { play.textContent = on ? "❚❚" : "▶"; play.setAttribute("aria-label", on ? "Pause music" : "Play music"); status.textContent = on ? "Now playing" : "Synthwave, generated live"; }
  async function start() {
    if (!ac) build();
    await ac.resume();
    if (ac.state !== "running") throw new Error("blocked");
    if (!on) { on = true; step = 0; nextT = ac.currentTime + 0.08; loop(); sched = setInterval(loop, 40); viz(); }
    ui();
  }
  async function stop() { on = false; clearInterval(sched); if (ac) await ac.suspend(); viz(); ui(); }
  async function toggle() {
    try { if (on) await stop(); else await start(); }
    catch (e) { status.textContent = "Audio unavailable"; }
    return on;
  }
  play.addEventListener("click", toggle);
  vol.addEventListener("input", function () { if (master && !muted) master.gain.value = vol.value; });
  mute.addEventListener("click", function () { muted = !muted; if (master) master.gain.value = muted ? 0 : vol.value; mute.textContent = muted ? "🔇" : "🔊"; });
  document.addEventListener("visibilitychange", function () { if (!ac || !on) return; if (document.hidden) { clearInterval(sched); ac.suspend(); } else { ac.resume().then(function () { nextT = ac.currentTime + 0.08; sched = setInterval(loop, 40); }); } });
  // No autoplay: the welcome screen's "Enter with music" button (or the play button) starts it.
  return {
    toggle: toggle, isOn: function () { return on; },
    setVolume: function (v) { vol.value = Math.max(0, Math.min(0.8, v)); if (master && !muted) master.gain.value = vol.value; return Number(vol.value); },
    play: function () { return on ? Promise.resolve(true) : toggle(); }, pause: function () { return on ? toggle() : Promise.resolve(false); }
  };
})();

/* ---------- 19. DEVELOPER TERMINAL ---------- */
(function () {
  const out = find("#out"), inp = find("#cmd"), hist = []; let hi = 0, busy = Promise.resolve();
  const PS1 = "ashok@portfolio:~$";
  const certs = [...findAll(".vault button.v")].map(function (b) { return b.dataset.title + " (" + b.dataset.by.split(" · ")[0] + ", " + b.dataset.date + ")"; });
  function go(id) { setTimeout(function () { const t = find(id); if (t) t.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" }); }, 650); }
  const cmds = {
    help: function () { return "Commands:\n  help          show this list\n  home          go to the top of the page\n  about         who I am\n  skills        skill levels\n  projects      all projects\n  findback      FindBack case study\n  certificates  my six certificates\n  education     timeline\n  contact       how to reach me\n  music         toggle music (music on / off / up / down)\n  theme         switch light and dark (theme light / dark)\n  clear         clear the screen\nTry also: whoami"; },
    home: function () { go("#home"); return "Going to the home section."; },
    about: function () { go("#about"); return "Diploma student in Computer System and Networking at Jigme Namgyal Engineering College, Bhutan. Learning networking, Linux, web development, programming, databases and cybersecurity basics.\nGoals: network administration, system administration, IT support, software and web development, cybersecurity."; },
    whoami: function () { return "ashok@portfolio — learner · builder · aspiring IT professional"; },
    skills: function () { go("#skills"); return skills.map(function (s) { return "▸ " + s.name.padEnd(18) + "█".repeat(s.level) + "░".repeat(5 - s.level) + "  " + s.label + "  [" + s.tools.join(", ") + "]"; }).join("\n"); },
    projects: function () { openProject("proj-findback"); go("#projects"); return "▸ FindBack — Python Tkinter desktop app for lost and found items on campus\n▸ Events Hub — multi-page site (HTML · CSS · JavaScript)\n     github.com/Ashok-2004-dev/events_hub\n▸ E-Sports Management System — group mini project, in progress (HTML · CSS · Java · MySQL)\n▸ DrukHealth GO — hackathon project: GNH-based online hospital token system\nTip: type 'findback' for the case study."; },
    findback: function () { openProject("proj-findback"); go("#projects"); return "FindBack · Python · Tkinter · Desktop application\nA desktop system that helps students and staff report, search and manage lost and found items on campus.\n\nProblem   On a campus, lost belongings are hard to trace. Without one shared record, finders and owners rarely connect.\nSolution  FindBack keeps every report in one application, so items can be recorded, searched and followed until they are returned.\nFeatures  Record an item's name, category, location, date, description and status · Search reported items · Manage and update records\nWhy it helps  It makes tracking and returning misplaced belongings easier for both students and staff.\n\nSource code link will be added once the repository is public."; },
    education: function () { go("#education"); return "2025 – 2027  Diploma in Computer System and Networking, Jigme Namgyal Engineering College (studying)\n2022        Class XII, Yonten Kuenjung Academy (YKA), Phuentsholing — 75%"; },
    certificates: function () { go("#certificates"); return certs.map(function (c) { return "▸ " + c; }).join("\n"); },
    contact: function () { go("#contact"); return "Email:  2004.ashokacharya@gmail.com\nPhone:  +975 77458410\nGitHub: github.com/Ashok-2004-dev"; },
    theme: function (arg) {
      const now = root.getAttribute("data-theme"), next = arg === "light" || arg === "dark" ? arg : (now === "dark" ? "light" : "dark");
      setTheme(next); return "Theme: " + next;
    },
    music: async function (arg) {
      if (arg === "up" || arg === "down") return "Volume: " + Math.round(music.setVolume(Number(find("#mVol").value) + (arg === "up" ? 0.1 : -0.1)) / 0.8 * 100) + "%";
      if (arg === "on") await music.play(); else if (arg === "off") await music.pause(); else await music.toggle();
      return music.isOn() ? "Music: playing (Neon Packets, synthwave generated in your browser)" : "Music: off. If it did not start, your browser blocked audio. Press the play button.";
    },
    clear: function () { out.textContent = ""; return ""; },
    ls: function () { return "home  about  skills  projects  education  certificates  contact"; },
    sudo: function () { return "Nice try. Permission denied — but Ashok is open to learning opportunities. Type 'contact'."; },
    konami: function () { return "Konami code accepted. +30 lives."; },
    matrix: function () { window.dispatchEvent(new Event("matrix")); return "Wake up, visitor..."; }
  };
  function print(str, cls) {
    return new Promise(function (res) {
      const row = document.createElement("div"); if (cls) row.className = cls; out.appendChild(row);
      if (calm || str.length > 400) { row.textContent = str; out.scrollTop = out.scrollHeight; return res(); }
      let i = 0; (function t() { row.textContent = str.slice(0, i += 6); out.scrollTop = out.scrollHeight; if (i < str.length) setTimeout(t, 8); else res(); })();
    });
  }
  function run(line) {
    const parts = line.trim().toLowerCase().split(/\s+/), c = parts[0]; if (!c) return;
    hist.push(line); hi = hist.length;
    busy = busy.then(async function () {
      if (c !== "clear") await print(PS1 + " " + line, "c");
      const f = cmds[c], r = f ? await f(parts[1]) : "Command not found: " + c + ". Type 'help'.";
      if (r) await print(r, f ? "" : "err");
    });
  }
  find("#termForm").addEventListener("submit", function (e) { e.preventDefault(); run(inp.value); inp.value = ""; });
  inp.addEventListener("keydown", function (e) {
    if (e.key === "ArrowUp" && hi > 0) { e.preventDefault(); inp.value = hist[--hi]; }
    if (e.key === "ArrowDown") { e.preventDefault(); inp.value = hist[++hi] || ""; }
    if (e.key === "Tab") { e.preventDefault(); const m = Object.keys(cmds).filter(function (k) { return k.indexOf(inp.value.toLowerCase()) === 0; }); if (m.length === 1) inp.value = m[0]; }
    if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.textContent = ""; }
  });
  findAll(".chips button").forEach(function (b) { b.addEventListener("click", function () { run(b.textContent); }); });
  find(".term").addEventListener("click", function (e) { if (!e.target.closest("button, a") && !getSelection().toString()) inp.focus({ preventScroll: true }); });
  print("Welcome to Ashok's digital workspace.\nType 'help' or tap a command below.", "c");
  window.portfolioTerminal = { run: run };
})();

/* ---------- 20. EASTER EGGS ----------
   Konami code, five clicks on the logo, or the 'matrix' command: a short code rain. */
(function () {
  const cv = find("#matrix"), g = cv.getContext("2d"); let running = false;
  function rain() {
    if (running || calm) return; running = true;
    cv.width = innerWidth; cv.height = innerHeight; cv.classList.add("on");
    const cols = Math.floor(cv.width / 16), drops = Array.from({ length: cols }, function () { return Math.random() * -40; }), chars = "01<>/{}ASHOK=;$";
    const end = Date.now() + 4500;
    (function frame() {
      g.fillStyle = "rgba(4,5,11,.12)"; g.fillRect(0, 0, cv.width, cv.height); g.font = "14px monospace";
      drops.forEach(function (y, i) {
        g.fillStyle = i % 5 ? "#22d3ee" : "#8b5cf6"; g.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, y * 16);
        drops[i] = y * 16 > cv.height && Math.random() > 0.975 ? 0 : y + 1;
      });
      if (Date.now() < end) requestAnimationFrame(frame);
      else { cv.classList.remove("on"); setTimeout(function () { g.clearRect(0, 0, cv.width, cv.height); running = false; }, 700); }
    })();
  }
  window.addEventListener("matrix", rain);
  const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; let pos = 0;
  document.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    pos = e.key === seq[pos] ? pos + 1 : (e.key === seq[0] ? 1 : 0);
    if (pos === seq.length) { pos = 0; rain(); window.portfolioTerminal.run("konami"); }
  });
  let clicks = 0, t;
  find(".logo").addEventListener("click", function () { clicks++; clearTimeout(t); t = setTimeout(function () { clicks = 0; }, 1200); if (clicks === 5) { clicks = 0; rain(); } });
})();

/* ---------- 21. DIGITAL BACKGROUND: a live network ----------
   Nodes drift and link up; small data packets travel along the links, like traffic on a network.
   Capped at about 30 frames per second, paused when the tab is hidden, static for reduced motion. */
(function () {
  const cv = find("#net"), g = cv.getContext("2d"); let w, h, nodes = [], packets = [], mx = -999, my = -999, last = 0, raf;
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    w = innerWidth; h = innerHeight; cv.width = w * dpr; cv.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(26, Math.min(58, Math.round(w * h / 24000)));
    nodes = Array.from({ length: n }, function () { return { x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 1.2 + Math.random() * 1.6, p: Math.random() * 6 }; });
    packets = [];
  }
  function palette() { return root.getAttribute("data-theme") === "light" ? { link: "40,70,200", node: "70,60,200", pk: "8,145,178" } : { link: "99,140,255", node: "150,190,255", pk: "34,211,238" }; }
  function draw(now) {
    const c = palette(), D = 150;
    g.clearRect(0, 0, w, h);
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < -20) a.x = w + 20; else if (a.x > w + 20) a.x = -20;
      if (a.y < -20) a.y = h + 20; else if (a.y > h + 20) a.y = -20;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < D) { g.strokeStyle = "rgba(" + c.link + "," + ((1 - d / D) * 0.4).toFixed(3) + ")"; g.lineWidth = 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      }
      const m = Math.hypot(a.x - mx, a.y - my);
      if (m < 170) { g.strokeStyle = "rgba(" + c.pk + "," + ((1 - m / 170) * 0.5).toFixed(3) + ")"; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(mx, my); g.stroke(); }
      const pulse = 0.55 + 0.45 * Math.sin(now / 900 + a.p);
      g.fillStyle = "rgba(" + c.node + "," + (0.45 + pulse * 0.5).toFixed(2) + ")"; g.beginPath(); g.arc(a.x, a.y, a.r, 0, 6.283); g.fill();
    }
    if (packets.length < 16 && Math.random() < 0.12) {          // launch a packet along a random link
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      const near = nodes.filter(function (b) { const d = Math.hypot(a.x - b.x, a.y - b.y); return b !== a && d < D; });
      if (near.length) packets.push({ a: a, b: near[Math.floor(Math.random() * near.length)], t: 0, s: 0.012 + Math.random() * 0.012 });
    }
    packets = packets.filter(function (p) {
      p.t += p.s; if (p.t >= 1) return false;
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t, tx = p.a.x + (p.b.x - p.a.x) * Math.max(0, p.t - 0.12), ty = p.a.y + (p.b.y - p.a.y) * Math.max(0, p.t - 0.12);
      const grad = g.createLinearGradient(tx, ty, x, y); grad.addColorStop(0, "rgba(" + c.pk + ",0)"); grad.addColorStop(1, "rgba(" + c.pk + ",0.95)");
      g.strokeStyle = grad; g.lineWidth = 2; g.beginPath(); g.moveTo(tx, ty); g.lineTo(x, y); g.stroke();
      g.fillStyle = "rgba(" + c.pk + ",1)"; g.beginPath(); g.arc(x, y, 2.2, 0, 6.283); g.fill();
      return true;
    });
  }
  function frame(now) { raf = requestAnimationFrame(frame); if (now - last < 33) return; last = now; draw(now); }
  size(); draw(0);
  if (!calm) {
    raf = requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); });
    addEventListener("pointermove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
  }
  let rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { size(); if (calm) draw(0); }, 200); });
})();

/* ---------- 22. RUNNING STRIP: duplicate the posters once so the loop never shows a gap ---------- */
(function () {
  const set = find(".ticker-set"); if (!set) return;
  const copy = set.cloneNode(true);
  copy.setAttribute("aria-hidden", "true");
  copy.querySelectorAll("a").forEach(function (a) { a.tabIndex = -1; });
  set.parentNode.appendChild(copy);
})();
