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
    form.innerHTML = "<p style='color:#7c5cff;font-weight:700;'>Received. Our strategy team will review your submission and follow up if there is an alignment.</p>";
    status.textContent = "";
  }
});

const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = "perspective(600px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
  });
});

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let w, h, particles;
const colors = ["124,92,255", "0,194,255", "255,79,216"];

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
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.35 + 0.08,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}
initParticles();

function draw() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = w;
    if (p.x > w) p.x = 0;
    if (p.y < 0) p.y = h;
    if (p.y > h) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
draw();
