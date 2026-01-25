// assets/js/main.js

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

onReady(() => {
  // Charge header/footer et active le menu mobile
  (async function includePartials() {
    try {
      const [h, f] = await Promise.all([
        fetch("partials/header.html").then(r => r.text()),
        fetch("partials/footer.html").then(r => r.text())
      ]);

      const header = document.createElement("div");
      header.innerHTML = h;
      document.body.prepend(header);

      const footer = document.createElement("div");
      footer.innerHTML = f;
      document.body.appendChild(footer);

      const toggle = document.querySelector(".nav-toggle");
      const links = document.querySelector(".nav-links");
      if (toggle && links) {
        toggle.addEventListener("click", () => links.classList.toggle("open"));
      }

      const path = window.location.pathname;
      const currentFile =
        path.endsWith("/") || path === "" ? "index.html" : path.split("/").pop().toLowerCase();

      document.querySelectorAll(".nav-links a[href]").forEach(a => {
        const href = a.getAttribute("href");
        if (!href) return;
        const hrefFile = href.split("#")[0].split("?")[0].toLowerCase();
        if (hrefFile === currentFile) a.classList.add("active");
      });
    } catch (e) {
      console.error("Error loading partials:", e);
    }
  })();

  // Scroll doux pour ancres internes
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    document.querySelector(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth" });
  });

  // Background slideshow global smooth
  (function backgroundCrossfade() {
    // Noms de fichiers
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

    // 1) Chemins pour le CSS (résolus depuis assets/css/style.css)
    const cssImages = files.map(f => `../img/backgrounds/${f}`);

    // 2) Chemins pour le préchargement (résolus depuis les pages HTML)
    const preloadImages = files.map(f => `assets/img/backgrounds/${f}`);

    // Précharge
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Initialise les 2 couches
    document.body.style.setProperty("--bg1", `url("${cssImages[0]}")`);
    document.body.style.setProperty("--bg2", `url("${cssImages[1 % cssImages.length]}")`);
    document.body.classList.remove("bg-fade");

    // Durée totale
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
    }, stepMs);
  })();
});
