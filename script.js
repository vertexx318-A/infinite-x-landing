// ---------- Supabase Lead Form ----------
const SUPABASE_URL = "https://lfhtxllbzqbtynsijuqv.supabase.co";
const SUPABASE_KEY = "sb_publishable_zjAqOWi_gh1Z9NZju2uBTA_obUYD2QA";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("lead-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");
const submitBtnSpan = submitBtn ? submitBtn.querySelector("span") : null;

function setBtnText(text) {
if (submitBtnSpan) { submitBtnSpan.textContent = text; } else if (submitBtn) { submitBtn.textContent = text; }
}

form.addEventListener("submit", async (e) => {
e.preventDefault();
submitBtn.disabled = true;
setBtnText("Submitting...");

const data = new FormData(form);
const payload = {
full_name: data.get("full_name"),
email: data.get("email"),
company: data.get("company"),
website: data.get("website"),
monthly_revenue: data.get("monthly_revenue"),
bottleneck: data.get("bottleneck")
};

const { error } = await supabaseClient.from("leads").insert([payload]);

if (error) {
status.textContent = "Something went wrong. Please try again or email us directly.";
submitBtn.disabled = false;
setBtnText("Secure Your Strategic Briefing");
} else {
form.innerHTML = "<p style='color:#00e0ff;font-weight:700;'>Received. Our strategy team will review your submission and follow up if there is an alignment.</p>";
status.textContent = "";
}
});

// ---------- Scroll Reveal (also drives split-text stagger via CSS) ----------
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
}
});
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Tilt + Glow Bento Cards ----------
document.querySelectorAll('.tilt-card').forEach(card => {
card.addEventListener('mousemove', (e) => {
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
const rotateX = ((y / rect.height) - 0.5) * -6;
const rotateY = ((x / rect.width) - 0.5) * 6;
card.style.transform = "perspective(700px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
card.style.setProperty('--mx', (x / rect.width) * 100 + '%');
card.style.setProperty('--my', (y / rect.height) * 100 + '%');
});
card.addEventListener('mouseleave', () => {
card.style.transform = 'perspective(700px) rotateX(0) rotateY(0)';
});
});

// ---------- Environment checks ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// ---------- Custom Magnetic Cursor ----------
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (finePointer && cursorDot && cursorRing) {
document.body.classList.add('cursor-active');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2, ringX = mouseX, ringY = mouseY;

window.addEventListener('mousemove', (e) => {
mouseX = e.clientX;
mouseY = e.clientY;
cursorDot.style.transform = "translate(" + mouseX + "px," + mouseY + "px) translate(-50%,-50%)";
});

function animateRing() {
ringX += (mouseX - ringX) * 0.18;
ringY += (mouseY - ringY) * 0.18;
cursorRing.style.transform = "translate(" + ringX + "px," + ringY + "px) translate(-50%,-50%)";
requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .magnetic, input, textarea').forEach(el => {
el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
});
}

// ---------- Magnetic Buttons ----------
if (finePointer) {
document.querySelectorAll('.magnetic').forEach(el => {
el.addEventListener('mousemove', (e) => {
const rect = el.getBoundingClientRect();
const x = e.clientX - rect.left - rect.width / 2;
const y = e.clientY - rect.top - rect.height / 2;
el.style.transform = "translate(" + (x * 0.3) + "px," + (y * 0.3) + "px)";
});
el.addEventListener('mouseleave', () => {
el.style.transform = 'translate(0,0)';
});
});
}

// ---------- Process Timeline Scroll-Linked Progress ----------
const phaseRow = document.querySelector('.phase-row');
const phaseTrackFill = document.getElementById('phase-track-fill');
if (phaseRow && phaseTrackFill) {
let ticking = false;
function updateTrack() {
const rect = phaseRow.getBoundingClientRect();
const vh = window.innerHeight;
const total = rect.height + vh * 0.6;
const passed = vh * 0.85 - rect.top;
let pct = (passed / total) * 100;
pct = Math.max(0, Math.min(100, pct));
phaseTrackFill.style.width = pct + '%';
ticking = false;
}
window.addEventListener('scroll', () => {
if (!ticking) {
requestAnimationFrame(updateTrack);
ticking = true;
}
});
updateTrack();
}

// ---------- Background Canvas: Gradient Mesh + Particles ----------
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let w, h, particles, blobs;
const colors = ["124,92,255", "0,224,255", "255,79,216"];

function resize() {
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function initScene() {
const density = reduceMotion ? 34000 : 20000;
const count = Math.floor((w * h) / density);
particles = [];
for (let i = 0; i < count; i++) {
particles.push({
x: Math.random() * w,
y: Math.random() * h,
r: Math.random() * 1.8 + 0.6,
vx: (Math.random() - 0.5) * 0.15,
vy: (Math.random() - 0.5) * 0.15,
a: Math.random() * 0.35 + 0.08,
c: colors[Math.floor(Math.random() * colors.length)]
});
}
blobs = [
{ x: w * 0.2, y: h * 0.25, r: Math.max(w, h) * 0.28, c: colors[0], t: 0 },
{ x: w * 0.8, y: h * 0.7, r: Math.max(w, h) * 0.24, c: colors[1], t: 2 },
{ x: w * 0.5, y: h * 0.5, r: Math.max(w, h) * 0.2, c: colors[2], t: 4 }
];
}
initScene();
window.addEventListener("resize", initScene);

let targetMx = 0, targetMy = 0, mx = 0, my = 0;
window.addEventListener('mousemove', (e) => {
targetMx = (e.clientX / w - 0.5);
targetMy = (e.clientY / h - 0.5);
});

function draw(time) {
ctx.clearRect(0, 0, w, h);

mx += (targetMx - mx) * 0.04;
my += (targetMy - my) * 0.04;

blobs.forEach((b, i) => {
const drift = reduceMotion ? 0 : Math.sin(time * 0.00012 + b.t) * 40;
const px = b.x + drift + mx * 60 * (i + 1);
const py = b.y + drift + my * 60 * (i + 1);
const grad = ctx.createRadialGradient(px, py, 0, px, py, b.r);
grad.addColorStop(0, "rgba(" + b.c + ",0.16)");
grad.addColorStop(1, "rgba(" + b.c + ",0)");
ctx.fillStyle = grad;
ctx.beginPath();
ctx.arc(px, py, b.r, 0, Math.PI * 2);
ctx.fill();
});

particles.forEach(p => {
if (!reduceMotion) {
p.x += p.vx;
p.y += p.vy;
if (p.x < 0) p.x = w;
if (p.x > w) p.x = 0;
if (p.y < 0) p.y = h;
if (p.y > h) p.y = 0;
}
ctx.beginPath();
ctx.arc(p.x + mx * 20, p.y + my * 20, p.r, 0, Math.PI * 2);
ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
ctx.fill();
});

requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
