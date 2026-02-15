// assets/js/main.js

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

onReady(() => {
  // -----------------------------
  // NAV : attendre que le header injecté existe
  // -----------------------------
  function whenNavReady(cb, tries = 0) {
    const ok =
      document.querySelector(".nav-toggle") &&
      document.querySelector("#site-nav") &&
      document.querySelector(".nav-backdrop") &&
      document.querySelectorAll(".nav-link").length > 0;

    if (ok) return cb();

    if (tries > 80) return; // stop après ~8s
    setTimeout(() => whenNavReady(cb, tries + 1), 100);
  }

  // -----------------------------
  // NAV : page active
  // -----------------------------
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

  // -----------------------------
  // NAV : burger mobile
  // -----------------------------
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    const backdrop = document.querySelector(".nav-backdrop");

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

    // sécurité: état initial
    backdrop.hidden = true;
    toggle.setAttribute("aria-expanded", "false");

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

  // attendre injection puis init
  whenNavReady(() => {
    setActiveNav();
    initMobileNav();
  });

  // -----------------------------
  // Scroll doux pour ancres internes
  // -----------------------------
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
  });

  // -----------------------------
  // Background slideshow global smooth + Ken Burns subtil
  // -----------------------------
  (function backgroundCrossfade() {
    const files = [
      "IMG_20160713_175342.jpg",
      "Les_Domaines_de_Patras_Instagram-001-6.jpg",
      "Les_Domaines_de_Patras_Le_Domaine-001.jpg",
      "Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-162-1-scaled.jpg",
      "Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-165.jpeg",
      "Mariage-Caroline-Guilhem-Photo-by-Jeremie-Hkb-639-scaled-1593x896.jpg",
      "lac.jpg"
    ];

    if (!files.length) return;

    const cssImages = files.map(f => `../img/backgrounds/${f}`);
    const preloadImages = files.map(f => `assets/img/backgrounds/${f}`);

    [preloadImages[0], preloadImages[1]].forEach(href => {
      if (!href) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
    });

    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    function restartKenBurns() {
      document.body.classList.remove("bg-kenburns");
      void document.body.offsetHeight;
      document.body.classList.add("bg-kenburns");
    }

    document.body.style.setProperty("--bg1", `url("${cssImages[0]}")`);
    document.body.style.setProperty("--bg2", `url("${cssImages[1 % cssImages.length]}")`);
    document.body.classList.remove("bg-fade");

    restartKenBurns();

    const totalMs = (() => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-slideshow-duration")
        .trim();
      if (!v) return 60000;
      if (v.endsWith("ms")) return parseFloat(v);
      if (v.endsWith("s")) return parseFloat(v) * 1000;
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 60000;
    })();

    const stepMs = Math.max(3500, Math.floor(totalMs / cssImages.length));

    let i = 1;
    let showSecond = false;

    setInterval(() => {
      i = (i + 1) % cssImages.length;

      if (showSecond) {
        document.body.style.setProperty("--bg1", `url("${cssImages[i]}")`);
        document.body.classList.remove("bg-fade");
      } else {
        document.body.style.setProperty("--bg2", `url("${cssImages[i]}")`);
        document.body.classList.add("bg-fade");
      }

      showSecond = !showSecond;
      restartKenBurns();
    }, stepMs);
  })();
});
