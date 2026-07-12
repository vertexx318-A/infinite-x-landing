const SUPABASE_URL = "https://lfhtxllbzqbtynsijuqv.supabase.co";
const SUPABASE_KEY = "sb_publishable_zjAqOWi_gh1Z9NZju2uBTA_obUYD2QA";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById("lead-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
e.preventDefault();
submitBtn.disabled = true;
submitBtn.textContent = "Submitting...";

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
submitBtn.textContent = "Secure Your Strategic Briefing";
} else {
form.innerHTML = "<p style='color:#d4ff3f;font-weight:700;'>Received. Our strategy team will review your submission and follow up if there is an alignment.</p>";
status.textContent = "";
}
});

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let w, h, particles;

function resize() {
w = canvas.width = window.innerWidth;
h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function initParticles() {
particles = [];
const count = Math.floor((w * h) / 22000);
for (let i = 0; i < count; i++) {
particles.push({
x: Math.random() * w,
y: Math.random() * h,
r: Math.random() * 1.6 + 0.4,
vx: (Math.random() - 0.5) * 0.15,
vy: (Math.random() - 0.5) * 0.15,
a: Math.random() * 0.5 + 0.1
});
}
}
initParticles();

function draw() {
ctx.clearRect(0, 0, w, h);
const grad = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.35, Math.max(w, h) * 0.6);
grad.addColorStop(0, "rgba(124,92,255,0.12)");
grad.addColorStop(1, "rgba(6,6,7,0)");
ctx.fillStyle = grad;
ctx.fillRect(0, 0, w, h);

particles.forEach(p => {
p.x += p.vx;
p.y += p.vy;
if (p.x < 0) p.x = w;
if (p.x > w) p.x = 0;
if (p.y < 0) p.y = h;
if (p.y > h) p.y = 0;
ctx.beginPath();
ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
ctx.fillStyle = "rgba(212,255,63," + p.a + ")";
ctx.fill();
});

requestAnimationFrame(draw);
}
draw();
