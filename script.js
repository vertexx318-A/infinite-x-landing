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
    form.innerHTML = '<p style="color:#0fae8a;font-weight:700;">Received. Our strategy team will review your submission and follow up if there is an alignment.</p>';
    status.textContent = "";
  }
});

// ---------- Scroll Reveal ----------
const revealEls = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Tilt Cards ----------
document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    card.style.transform = "perspective(700px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(0)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ---------- Environment checks ----------
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

// ---------- Mobile Nav Toggle ----------
const navToggle = document.getElementById("nav-toggle");
const navLinksEl = document.getElementById("nav-links");
if (navToggle && navLinksEl) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinksEl.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  navLinksEl.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      navLinksEl.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
// ---------- Custom Cursor ----------
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

if (finePointer && cursorDot && cursorRing) {
  document.body.classList.add("cursor-active");
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2, ringX = mouseX, ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
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

  document.querySelectorAll("a, button, .magnetic, input, textarea, select").forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-hover"));
  });
}

// ---------- Magnetic Buttons ----------
if (finePointer) {
  document.querySelectorAll(".magnetic").forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = "translate(" + (x * 0.25) + "px," + (y * 0.25) + "px)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0,0)";
    });
  });
}

// ---------- Count-up Stats ----------
const statNums = document.querySelectorAll(".stat-num");
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = "1";
      const target = parseInt(entry.target.getAttribute("data-count"), 10);
      const duration = reduceMotion ? 0 : 1200;
      const start = performance.now();
      function tick(now) {
        const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        entry.target.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  });
}, { threshold: 0.4 });
statNums.forEach(el => statObserver.observe(el));
// ---------- 3D Wireframe Globe ----------
(function () {
  const canvas = document.getElementById("globe-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let size = 0;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();
    size = Math.min(rect.width, rect.height, 380);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  const N = 140;
  const points = [];
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    points.push({
      x: Math.sin(phi) * Math.cos(theta),
      y: Math.sin(phi) * Math.sin(theta),
      z: Math.cos(phi)
    });
  }

  let rotY = 0, rotX = 0.4, targetTiltX = 0, targetTiltY = 0;
  const heroVisual = canvas.closest(".hero-visual");
  if (heroVisual) {
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      targetTiltY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targetTiltX = ((e.clientY - rect.top) / rect.height - 0.5) * -0.6;
    });
    heroVisual.addEventListener("mouseleave", () => { targetTiltX = 0; targetTiltY = 0; });
  }

  function project(p) {
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const x = p.x * cosY - p.z * sinY;
    const z = p.x * sinY + p.z * cosY;
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const y2 = p.y * cosX - z * sinX;
    const z2 = p.y * sinX + z * cosX;
    const scale = size * 0.42;
    const persp = 1 / (2 - z2);
    return { sx: size / 2 + x * scale * persp, sy: size / 2 + y2 * scale * persp, z: z2, persp: persp };
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    if (!reduceMotion) {
      rotY += 0.0022;
      rotX += (0.4 + targetTiltX * 0.6 - rotX) * 0.02;
    }
    const proj = points.map(project);
    for (let i = 0; i < proj.length; i++) {
      for (let j = i + 1; j < proj.length; j++) {
        const dx = points[i].x - points[j].x, dy = points[i].y - points[j].y, dz = points[i].z - points[j].z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 0.32) {
          const avgZ = (proj[i].z + proj[j].z) / 2;
          const alpha = Math.max(0, (avgZ + 1) / 2) * 0.22;
          if (alpha <= 0.01) continue;
          ctx.strokeStyle = "rgba(34,201,161," + alpha + ")";
          ctx.beginPath();
          ctx.moveTo(proj[i].sx, proj[i].sy);
          ctx.lineTo(proj[j].sx, proj[j].sy);
          ctx.stroke();
        }
      }
    }
    proj.forEach(p => {
      const alpha = Math.max(0.18, (p.z + 1) / 2);
      const r = Math.max(1, 2.6 * p.persp);
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(47,111,237," + alpha + ")";
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
// ---------- Background Canvas: Subtle Particle Field ----------
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let w, h, particles;
const colors = ["34,201,161", "47,111,237", "11,27,61"];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function initParticles() {
  particles = [];
  const density = reduceMotion ? 60000 : 32000;
  const count = Math.floor((w * h) / density);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.25 + 0.05,
      c: colors[Math.floor(Math.random() * colors.length)]
    });
  }
}
initParticles();
window.addEventListener("resize", initParticles);

function draw() {
  ctx.clearRect(0, 0, w, h);
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
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(" + p.c + "," + p.a + ")";
    ctx.fill();
  });
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// ---------- Nav Scroll Spy ----------
const navLinks = document.querySelectorAll(".nav-links a");
const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
window.addEventListener("scroll", () => {
  let current = sections[0];
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top < 140) current = sec;
  });
  navLinks.forEach(a => {
    a.classList.toggle("active", document.querySelector(a.getAttribute("href")) === current);
  });
});
