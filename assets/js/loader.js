// assets/js/loader.js

const VERSION = "3.32"; // incrémente uniquement ce chiffre
window.ASSET_VERSION = VERSION;

// -----------------------------
// Charger le CSS
// -----------------------------
(function addCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `assets/css/style.css?v=${VERSION}`;
  document.head.appendChild(link);
})();

// -----------------------------
// Charger le JS principal
// -----------------------------
(function addMain() {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `assets/js/main.js?v=${VERSION}`;
  document.head.appendChild(script);
})();

// -----------------------------
// Injecter Header + Footer
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadPartial("partials/header.html", "site-header");
  loadPartial("partials/footer.html", "site-footer");
});

function loadPartial(url, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  fetch(`${url}?v=${VERSION}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur chargement ${url}`);
      return res.text();
    })
    .then(html => {
      target.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
    });
}
