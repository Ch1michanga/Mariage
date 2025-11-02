// === Fond photos défilantes (ajout) ===
(function(){
  // Crée les calques de fond (photo + voile beige)
  const bgEl = document.createElement('div');
  bgEl.className = 'bg-slideshow';
  const overlayEl = document.createElement('div');
  overlayEl.className = 'bg-overlay';
  // On place le fond tout au début du <body>
  document.body.prepend(bgEl);
  document.body.prepend(overlayEl);

  // Liste des images (chemins fournis)
  const base = 'assets/img/backgrounds/';
  const names = [
    'IMG_20160713_175342.jpg',
    'Les_Domaines_de_Patras_Instagram-001-6.jpg',
    'Les_Domaines_de_Patras_Le_Domaine-001.jpg',
    'Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-162-1-scaled.jpg',
    'Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-165.jpeg',
    'Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-639-scaled-1593x896.jpg',
    'lac.jpg'
  ];
  const backgrounds = names.map(n => base + n).filter(Boolean);

  // Précharge pour des transitions sans flash
  const cache = [];
  backgrounds.forEach(src => { const i = new Image(); i.src = src; cache.push(i); });

  let current = 0;
  if (backgrounds.length > 0) {
    bgEl.style.backgroundImage = `url(${backgrounds[0]})`;
  }
  // Change l'image avec un léger fondu
  function changeBackground(){
    if (backgrounds.length < 2) return;
    bgEl.style.opacity = 0;
    setTimeout(()=>{
      current = (current + 1) % backgrounds.length;
      bgEl.style.backgroundImage = `url(${backgrounds[current]})`;
      bgEl.style.opacity = 1;
    }, 1000); // durée du fondu sortant (doit matcher la transition CSS)
  }
  setInterval(changeBackground, 30000); // 30 s
})();

// === Tes fonctions existantes ===

// Charge header/footer et active le menu mobile
async function includePartials(){
  const [h,f] = await Promise.all([
    fetch('partials/header.html').then(r=>r.text()),
    fetch('partials/footer.html').then(r=>r.text())
  ]);
  const header = document.createElement('div');
  header.innerHTML = h; document.body.prepend(header);
  const footer = document.createElement('div');
  footer.innerHTML = f; document.body.appendChild(footer);

  // Toggle mobile (restera caché en desktop via CSS)
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(toggle && links){
    toggle.addEventListener('click',()=>links.classList.toggle('open'));
  }
}
includePartials();

// Scroll doux pour ancres internes
document.addEventListener('click', (e)=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a) return; e.preventDefault();
  document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
});
