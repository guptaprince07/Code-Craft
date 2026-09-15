// ===== Code Craft — vanilla JS (no frameworks) =====

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const navLinksWrap = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const toastEl = document.getElementById('toast');

let toastTimer = null;

/* ---------- Page routing ---------- */
function goTo(pageId) {
  if (!document.getElementById(pageId)) return;

  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.nav === pageId);
  });

  navLinksWrap.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delegate clicks for anything with a data-nav attribute (links, buttons, cards)
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-nav]');
  if (!target) return;
  e.preventDefault();
  goTo(target.dataset.nav);
});

/* ---------- Mobile menu ---------- */
menuToggle.addEventListener('click', () => {
  navLinksWrap.classList.toggle('open');
});

/* ---------- Toast ---------- */
function showToast(message) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.classList.remove('hidden');
  requestAnimationFrame(() => {
    toastEl.style.opacity = '1';
  });
  toastTimer = setTimeout(() => {
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.classList.add('hidden'), 250);
  }, 2200);
}

/* ---------- Demo action buttons (Start Practice / Take Quiz) ---------- */
function demoAction(label) {
  showToast(`${label}: this feature is coming in the next phase.`);
}
window.demoAction = demoAction; // used by inline onclick handlers in the HTML

/* ---------- Login form (demo only — no backend) ---------- */
const loginForm = document.getElementById('loginForm');
const loginResult = document.getElementById('loginResult');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();

  loginResult.textContent = `Welcome, ${email}! (Demo login — authentication isn't wired up yet in this MVP.)`;
  loginResult.classList.remove('hidden');
  loginResult.classList.add('success');

  loginForm.reset();
  showToast('Logged in (demo)');
});

/* ---------- Register form (demo only — no backend) ---------- */
const registerForm = document.getElementById('registerForm');
const registerResult = document.getElementById('registerResult');

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;

  if (password !== confirm) {
    registerResult.textContent = 'Passwords do not match. Please try again.';
    registerResult.classList.remove('hidden');
    registerResult.classList.remove('success');
    return;
  }

  registerResult.textContent = `Account created for ${name}! (Demo signup — authentication isn't wired up yet in this MVP.)`;
  registerResult.classList.remove('hidden');
  registerResult.classList.add('success');

  registerForm.reset();
  showToast('Account created (demo)');

  setTimeout(() => goTo('login'), 1200);
});

/* ---------- Init ---------- */
goTo('home');
