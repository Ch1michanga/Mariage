// assets/js/loader.js

const VERSION = "3.51"; // incrémente uniquement ce chiffre
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

// Injecter Header + Footer puis activer la nav
document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    loadPartial("partials/header.html", "site-header"),
    loadPartial("partials/footer.html", "site-footer"),
  ]).then(() => {
    setActiveNav();
    initMobileNav();
  });
});

function loadPartial(url, targetId) {
  const target = document.getElementById(targetId);
  if (!target) return Promise.resolve();

  return fetch(`${url}?v=${VERSION}`)
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

function setActiveNav() {
  const path = window.location.pathname;
  const currentFile =
    path.endsWith("/") || path === "" ? "index.html" : path.split("/").pop().toLowerCase();

  document.querySelectorAll(".nav-link[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href) return;

    const hrefFile = href.split("#")[0].split("?")[0].toLowerCase();

    a.classList.remove("is-active");
    a.removeAttribute("aria-current");

    if (hrefFile === currentFile) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const backdrop = document.querySelector(".nav-backdrop");

  if (!toggle || !nav || !backdrop) {
    console.warn("Nav elements missing: burger non initialisé");
    return;
  }

  function openNav() {
    document.body.classList.add("nav-open");
    backdrop.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    backdrop.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return document.body.classList.contains("nav-open");
  }

  // reset état
  backdrop.hidden = true;
  toggle.setAttribute("aria-expanded", "false");

  // éviter double binding si rechargement partiel
  if (toggle.dataset.bound === "1") return;
  toggle.dataset.bound = "1";

  toggle.addEventListener("click", () => {
    if (isOpen()) closeNav();
    else openNav();
  });

  backdrop.addEventListener("click", closeNav);

  document.querySelectorAll("#site-nav a").forEach(a => {
    a.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && isOpen()) closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && isOpen()) closeNav();
  });
}
