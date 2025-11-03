// === Fond photos défilantes sur toutes les pages ===
(function(){
  // Calques de fond (photo + voile beige)
  const bgEl = document.createElement('div');
  bgEl.className = 'bg-slideshow';
  const overlayEl = document.createElement('div');
  overlayEl.className = 'bg-overlay';

  // Styles inline (compat iOS: pas de 100vw/100vh)
  Object.assign(bgEl.style, {
    position:'fixed', inset:'0',
    zIndex:'0', display:'block',
    backgroundSize:'cover', backgroundPosition:'center', backgroundRepeat:'no-repeat',
    transition:'opacity 1s ease, background-image 0.6s ease-in-out', opacity:'1'
  });
  Object.assign(overlayEl.style, {
    position:'fixed', inset:'0',
    zIndex:'1', pointerEvents:'none'
    // le background est piloté par le CSS (.bg-overlay)
  });

  // Place les calques au tout début du <body>
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

  // Préchargement
  const cache = [];
  backgrounds.forEach(src => { const img = new Image(); img.src = src; cache.push(img); });

  // Affiche la première
  let current = 0;
  if (backgrounds.length) bgEl.style.backgroundImage = `url(${backgrounds[0]})`;

  // Changement toutes les 30s (fondu)
  function changeBackground(){
    if (backgrounds.length < 2) return;
    bgEl.style.opacity = '0';
    setTimeout(()=>{
      current = (current + 1) % backgrounds.length;
      bgEl.style.backgroundImage = `url(${backgrounds[current]})`;
      bgEl.style.opacity = '1';
    }, 1000);
  }
  setInterval(changeBackground, 30000);
})();

// === Partials header/footer + menu mobile ===
async function includePartials(){
  const [h,f] = await Promise.all([
    fetch('partials/header.html').then(r=>r.text()),
    fetch('partials/footer.html').then(r=>r.text())
  ]);

  // Insère header / footer (sans supprimer le burger)
  const headerWrap = document.createElement('div');
  headerWrap.innerHTML = h;
  document.body.prepend(headerWrap);

  const footerWrap = document.createElement('div');
  footerWrap.innerHTML = f;
  document.body.appendChild(footerWrap);

  // Sélecteurs du menu
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (toggle && links) {
    const toggleMenu = () => {
      const opened = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      // Empêche le scroll de fond quand le menu mobile est ouvert
      document.body.style.overflow = opened ? 'hidden' : '';
    };
    toggle.addEventListener('click', toggleMenu);
  }

  // Assure que le contenu passe bien devant le fond
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
