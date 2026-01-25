// Charge header/footer et active le menu mobile
async function includePartials() {
  try {
    const [h, f] = await Promise.all([
      fetch('partials/header.html').then(r => r.text()),
      fetch('partials/footer.html').then(r => r.text())
    ]);

    const header = document.createElement('div');
    header.innerHTML = h;
    document.body.prepend(header);

    const footer = document.createElement('div');
    footer.innerHTML = f;
    document.body.appendChild(footer);

    // Toggle mobile
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }

    // Met en évidence la page active dans le menu (après injection du header)
    const path = window.location.pathname;
    const currentFile = (path.endsWith('/') || path === '') ? 'index.html' : path.split('/').pop().toLowerCase();

    document.querySelectorAll('.nav-links a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;

      const hrefFile = href.split('#')[0].split('?')[0].toLowerCase();
      if (hrefFile === currentFile) a.classList.add('active');
    });

  } catch (e) {
    console.error('Error loading partials:', e);
  }
}
includePartials();


// Slideshow Logic (home) - conserve si tu as encore des .slide dans index.html
(function () {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  const intervalMs = (() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--hero-slide-interval')
      .trim();
    if (!v) return 5000;
    if (v.endsWith('ms')) return parseFloat(v);
    if (v.endsWith('s')) return parseFloat(v) * 1000;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 5000;
  })();

  let currentSlide = 0;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, intervalMs);
})();


// Background slideshow global (toutes les pages) - crossfade smooth
(function () {
  const images = [
    'assets/img/backgrounds/IMG_20160713_175342.jpg',
    'assets/img/backgrounds/Les_Domaines_de_Patras_Instagram-001-6.jpg',
    'assets/img/backgrounds/Les_Domaines_de_Patras_Le_Domaine-001.jpg',
    'assets/img/backgrounds/Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-162-1-scaled.jpg',
    'assets/img/backgrounds/Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-165.jpeg',
    'assets/img/backgrounds/Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-639-scaled-1593x896.jpg',
    'assets/img/backgrounds/lac.jpg'
  ];

  if (!images.length) return;

  // Crée une règle CSS qui force ::before et ::after à utiliser 2 variables
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    body::before { background-image: var(--bg1); transition: opacity 1.2s ease-in-out; }
    body::after  { background-image: var(--bg2); transition: opacity 1.2s ease-in-out; }
    body.bg-fade::before { opacity: 0; }
    body.bg-fade::after  { opacity: 1; }
  `;
  document.head.appendChild(styleTag);

  // On initialise les 2 couches
  let i = 0;
  document.body.style.setProperty('--bg1', `url("${images[0]}")`);
  document.body.style.setProperty('--bg2', `url("${images[1 % images.length]}")`);

  // Assure que les opacités de base sont correctes
  document.body.classList.remove('bg-fade');

  // Durée totale et intervalle par image
  const totalMs = (() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg-slideshow-duration')
      .trim();
    if (!v) return 60000;
    if (v.endsWith('ms')) return parseFloat(v);
    if (v.endsWith('s')) return parseFloat(v) * 1000;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 60000;
  })();

  const stepMs = Math.max(3000, Math.floor(totalMs / images.length));

  // Précharge pour éviter les flashes et les sauts
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let showSecond = false;

  setInterval(() => {
    i = (i + 1) % images.length;

    if (showSecond) {
      // On met la prochaine image dans bg1, et on fade vers bg1
      document.body.style.setProperty('--bg1', `url("${images[i]}")`);
      document.body.classList.remove('bg-fade');
    } else {
      // On met la prochaine image dans bg2, et on fade vers bg2
      document.body.style.setProperty('--bg2', `url("${images[i]}")`);
      document.body.classList.add('bg-fade');
    }

    showSecond = !showSecond;
  }, stepMs);
})();


// Scroll doux pour ancres internes
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
});
