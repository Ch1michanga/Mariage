// assets/js/loader.js

const VERSION = "3.11"; // incrémente uniquement ce chiffre

// Expose la version si besoin
window.ASSET_VERSION = VERSION;

// CSS
(function addCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `assets/css/style.css?v=${VERSION}`;
  document.head.appendChild(link);
})();

// JS principal
(function addMain() {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `assets/js/main.js?v=${VERSION}`;
  document.head.appendChild(script);
})();
