/* ═══════════════════════════════════════════════════
   CHRISTOPHER MUTURI — PORTFOLIO v5
   script.js
═══════════════════════════════════════════════════ */

/* ── MOBILE DETECTION ──────────────────────────── */
const isMobile = () => window.innerWidth <= 768;

/* ── GLOWY CURSOR TRACKING (desktop only) ──────── */
document.addEventListener('pointermove', ({ x, y }) => {
  document.documentElement.style.setProperty('--x', x.toFixed(2));
  document.documentElement.style.setProperty('--y', y.toFixed(2));
  document.documentElement.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
  document.documentElement.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
});

/* ── BB8 DARK / LIGHT TOGGLE ───────────────────── */
document.getElementById('themeToggle').addEventListener('change', function () {
  document.body.classList.toggle('light', this.checked);
});

/* ── PANEL NAVIGATION ──────────────────────────── */
const track   = document.getElementById('scroll-track');
const panels  = document.querySelectorAll('.panel');
const dots    = document.querySelectorAll('.nav-dot');
const navBtns = document.querySelectorAll('.nav-btn');
let currentPanel = 0;

function scrollToPanel(idx) {
  idx = Math.max(0, Math.min(panels.length - 1, idx));

  if (isMobile()) {
    /* On mobile: panels stack vertically, scroll the BODY/HTML */
    const target = panels[idx];
    const headerH = document.querySelector('header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;
    window.scrollTo({ top, behavior: 'smooth' });
  } else {
    /* Desktop: horizontal snap scroll on #scroll-track */
    track.scrollTo({ left: idx * window.innerWidth, behavior: 'smooth' });
  }
  updateNav(idx);
}

function updateNav(idx) {
  currentPanel = idx;
  dots.forEach((d, i)    => d.classList.toggle('active', i === idx));
  navBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
}

/* Desktop: watch horizontal scroll on track */
track.addEventListener('scroll', () => {
  if (isMobile()) return;
  const idx = Math.round(track.scrollLeft / window.innerWidth);
  if (idx !== currentPanel) {
    updateNav(idx);
    if (idx === 1 && !skillsAnimated) animateSkills();
  }
}, { passive: true });

/* Mobile: watch vertical scroll on window */
window.addEventListener('scroll', () => {
  if (!isMobile()) return;
  const headerH = document.querySelector('header').offsetHeight;
  let closest = 0, minDist = Infinity;
  panels.forEach((p, i) => {
    const dist = Math.abs(p.getBoundingClientRect().top - headerH);
    if (dist < minDist) { minDist = dist; closest = i; }
  });
  if (closest !== currentPanel) {
    updateNav(closest);
    if (closest === 1 && !skillsAnimated) animateSkills();
  }
}, { passive: true });

/* Keyboard arrows (desktop) */
document.addEventListener('keydown', e => {
  if (isMobile()) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') scrollToPanel(currentPanel + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   scrollToPanel(currentPanel - 1);
});

/* Resize: snap back to current panel on desktop */
window.addEventListener('resize', () => {
  if (!isMobile()) {
    track.scrollTo({ left: currentPanel * window.innerWidth, behavior: 'auto' });
  }
});

/* ── TYPING EFFECT ─────────────────────────────── */
const roles = ['Web Developer.', 'IT Specialist.', 'UI Designer.', 'Problem Solver.'];
let ri = 0, ci = 0, deleting = false;

function type() {
  const el   = document.getElementById('typed-role');
  const word = roles[ri];
  if (!deleting) {
    el.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1600); return; }
  } else {
    el.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 55 : 100);
}
type();

/* ── SKILL BAR ANIMATION ───────────────────────── */
let skillsAnimated = false;
function animateSkills() {
  skillsAnimated = true;
  document.querySelectorAll('.skill-fill').forEach(b => {
    b.style.width = b.dataset.w + '%';
  });
}

/* ── PROJECT SLIDER ────────────────────────────── */
const slide = document.getElementById('projectSlide');
document.getElementById('nextBtn').addEventListener('click', () => {
  slide.appendChild(slide.querySelector('.slide-item'));
});
document.getElementById('prevBtn').addEventListener('click', () => {
  const items = slide.querySelectorAll('.slide-item');
  slide.prepend(items[items.length - 1]);
});

/* Swipe support on mobile for slider */
let touchStartX = 0;
slide.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
slide.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) slide.appendChild(slide.querySelector('.slide-item'));
    else { const items = slide.querySelectorAll('.slide-item'); slide.prepend(items[items.length - 1]); }
  }
}, { passive: true });

/* ── CV DOWNLOAD ───────────────────────────────── */
function downloadCV() {
  if (typeof CV_B64 === 'undefined') { alert('CV not available.'); return; }
  const b   = atob(CV_B64);
  const arr = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) arr[i] = b.charCodeAt(i);
  const blob = new Blob([arr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const link = document.createElement('a');
  link.href     = URL.createObjectURL(blob);
  link.download = 'Christopher_Muturi_Murimi_CV.docx';
  link.click();
}
document.getElementById('cv-nav').addEventListener('click', downloadCV);
document.getElementById('cv-contact').addEventListener('click', downloadCV);

/* ── CONTACT FORM ──────────────────────────────── */
function submitForm() {
  const n  = document.getElementById('fname').value.trim();
  const em = document.getElementById('femail').value.trim();
  const m  = document.getElementById('fmsg').value.trim();
  if (!n || !em || !m) { alert('Please fill in all fields.'); return; }
  const btn = document.querySelector('.form-submit');
  btn.innerHTML = '✓ Sent!';
  btn.style.background = 'linear-gradient(135deg,#00c9a7,#00c8ff)';
  setTimeout(() => {
    btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane" style="margin-left:5px;"></i>';
    btn.style.background = '';
    document.getElementById('fname').value  = '';
    document.getElementById('femail').value = '';
    document.getElementById('fmsg').value   = '';
  }, 2500);
  alert('Thanks ' + n + '! Christopher will reply to ' + em + ' shortly.');
}