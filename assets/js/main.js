// === Fond photos défilantes sur toutes les pages ===
(function(){
  // Calques de fond (photo + voile beige)
  const bgEl = document.createElement('div');
  bgEl.className = 'bg-slideshow';
  const overlayEl = document.createElement('div');
  overlayEl.className = 'bg-overlay';

  // Styles inline critiques (plein écran même si CSS en cache)
  Object.assign(bgEl.style, {
    position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
    width: '100vw', height: '100vh', zIndex: '0', display: 'block',
    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    transition: 'opacity 1s ease, background-image 0.6s ease-in-out', opacity: '1'
  });
  Object.assign(overlayEl.style, {
    position: 'fixed', top: '0', left: '0', right: '0', bottom: '0',
    width: '100vw', height: '100vh', zIndex: '1',
    background: 'rgba(245,237,227,0.85)', pointerEvents: 'none'
  });

  // Place les calques au tout début du <body> (derrière le contenu)
  document.body.prepend(bgEl);
  document.body.prepend(overlayEl);

  // Liste d'images
  const base = 'assets/img/backgrounds/';
  const backgrounds = [
    base + 'IMG_20160713_175342.jpg',
    base + 'Les_Domaines_de_Patras_Instagram-001-6.jpg',
    base + 'Les_Domaines_de_Patras_Le_Domaine-001.jpg',
    base + 'Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-162-1-scaled.jpg',
    base + 'Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-165.jpeg',
    base + 'Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-639-scaled-1593x896.jpg',
    base + 'lac.jpg'
  ];

  // Préchargement (transition fluide)
  const cache = [];
  backgrounds.forEach(src => { const img = new Image(); img.src = src; cache.push(img); });

  // Affiche la première
  let current = 0;
  if (backgrounds.length) {
    bgEl.style.backgroundImage = `url(${backgrounds[0]})`;
  }

  // Changement toutes les 30s (fondu)
  function changeBackground(){
    if (backgrounds.length < 2) return;
    bgEl.style.opacity = '0';
    setTimeout(()=>{
      current = (current + 1) % backgrounds.length;
      bgEl.style.backgroundImage = `url(${backgrounds[current]})`;
      bgEl.style.opacity = '1';
    }, 1000); // doit matcher la transition CSS (opacity 1s)
  }
  setInterval(changeBackground, 30000);
})();

async function includePartials(){
  const [h,f] = await Promise.all([
    fetch('partials/header.html').then(r=>r.text()),
    fetch('partials/footer.html').then(r=>r.text())
  ]);

  const header = document.createElement('div');
  header.innerHTML = h;

  // NEW: retire le burger du fragment avant insertion
  header.querySelectorAll('button.nav-toggle[aria-label="Ouvrir le menu"]').forEach(btn => btn.remove());

  document.body.prepend(header);

  const footer = document.createElement('div');
  footer.innerHTML = f;
  document.body.appendChild(footer);

  // NEW: si tu as un “links” mobile, protège ce bloc (toggle peut ne plus exister)
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', ()=> links.classList.toggle('open'));
  }

  document.querySelectorAll('header, main, footer').forEach(el=>{
    el.style.position = 'relative';
    el.style.zIndex = '2';
  });
}
includePartials();

// === Scroll doux pour ancres internes ===
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  e.preventDefault();
  document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
});

