// assets/js/loader.js
const VERSION = '1.15';        // <-- tu changes juste ça

// Expose la version pour main.js si besoin
window.ASSET_VERSION = VERSION;

// Ajoute le CSS avec ?v
(function addCSS(){
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `assets/css/style.css?v=${VERSION}`;
  document.head.appendChild(link);
})();

// Ajoute le vrai main.js avec ?v
(function addMain(){
  const s = document.createElement('script');
  s.defer = true;
  s.src = `assets/js/main.js?v=${VERSION}`;
  document.head.appendChild(s);
})();

//Versioning
(function () {
  const VERSION = "1"; // ← tu changes ce chiffre quand tu veux

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = `assets/css/style.css?v=${VERSION}`;
  document.head.appendChild(css);

  const js = document.createElement("script");
  js.src = `assets/js/main.js?v=${VERSION}`;
  document.body.appendChild(js);
})();

