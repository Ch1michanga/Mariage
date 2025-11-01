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

  // Toggle mobile
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