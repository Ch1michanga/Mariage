// Charge header/footer et active le menu mobile
async function includePartials() {
  try {
    const [h, f] = await Promise.all([
      fetch('partials/header.html').then(r => r.text()),
      fetch('partials/footer.html').then(r => r.text())
    ]);
    const header = document.createElement('div');
    header.innerHTML = h; document.body.prepend(header);
    const footer = document.createElement('div');
    footer.innerHTML = f; document.body.appendChild(footer);

    // Toggle mobile
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
  } catch (e) {
    console.error("Error loading partials:", e);
  }
}
includePartials();

// Slideshow Logic
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}, (() => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--hero-slide-interval')
    .trim();

  if (!v) return 5000;
  if (v.endsWith('ms')) return parseFloat(v);
  if (v.endsWith('s')) return parseFloat(v) * 1000;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 5000;
})());
}

// Scroll doux pour ancres internes
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return; e.preventDefault();
  document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });

});
