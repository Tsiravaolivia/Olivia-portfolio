const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

 $('#year').textContent = new Date().getFullYear();

/* Navbar + bouton retour haut */
const nav = $('#navbar');
const toTop = $('#toTop');

addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  toTop.classList.toggle('show', scrollY > 600);
}, { passive: true });

toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* Menu mobile */
const burger = $('#burger');
const links = $('#navLinks');

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.classList.toggle('active', open);
  document.body.classList.toggle('no-scroll', open);
  burger.setAttribute('aria-expanded', open);
});

 $$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  burger.classList.remove('active');
  document.body.classList.remove('no-scroll');
}));

/* Thème clair / sombre */
const rootEl = document.documentElement;
try {
  const saved = localStorage.getItem('theme');
  if (saved) rootEl.dataset.theme = saved;
} catch (e) {}

 $('#themeToggle').addEventListener('click', () => {
  rootEl.dataset.theme = rootEl.dataset.theme === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem('theme', rootEl.dataset.theme);
  } catch (e) {}
});

/* Apparition au défilement */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('visible');
    io.unobserve(e.target);
  }
}), { threshold: .15 });

 $$('.reveal').forEach(el => io.observe(el));

/* Barres de compétences animées */
const bio = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.style.width = e.target.dataset.level + '%';
    bio.unobserve(e.target);
  }
}), { threshold: .4 });

 $$('.bar-fill').forEach(el => bio.observe(el));

/* Section active dans le menu */
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    $$('#navLinks a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }
}), { rootMargin: '-40% 0px -55% 0px' });

['accueil', 'apropos', 'formations', 'competences', 'projets', 'interets', 'vision', 'contact'].forEach(id => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

/* Effet machine à écrire */
const phrases = [
  'Étudiante en Sciences, Technologies & Numérique',
  'Développeuse web en devenir',
  'Passionnée d\u2019innovation',
  'Créatrice de solutions à impact'
];
let pi = 0, ci = 0, del = false;
const typed = $('#typed');

(function tick() {
  const w = phrases[pi];
  ci += del ? -1 : 1;
  typed.textContent = w.slice(0, ci);
  let d = del ? 40 : 80;
  if (!del && ci === w.length) { d = 1900; del = true; }
  else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; d = 350; }
  setTimeout(tick, d);
})();

/* Toast pour liens non disponibles */
function showToast(msg) {
  const c = $('#toastContainer');
  const t = document.createElement('div');
  t.style.cssText = 'pointer-events:auto;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:.65rem 1.4rem;font-size:.88rem;font-weight:600;color:var(--ink);box-shadow:var(--shadow);opacity:0;transform:translateY(10px);transition:opacity .35s,transform .35s;white-space:nowrap';
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => {
    t.style.opacity = '1';
    t.style.transform = 'none';
  });
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    setTimeout(() => t.remove(), 350);
  }, 3000);
}