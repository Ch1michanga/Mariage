// assets/js/main.js

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

onReady(() => {
  const MOBILE_MAX = 860;

  function isMobile() {
    return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
  }

  // Attend que le header injecté existe vraiment
  function whenNavReady(cb, tries = 0) {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    const backdrop = document.querySelector(".nav-backdrop");

    if (toggle && nav && backdrop) return cb(toggle, nav, backdrop);

    if (tries > 120) return; // stop après ~12s
    setTimeout(() => whenNavReady(cb, tries + 1), 100);
  }

  whenNavReady((toggle, nav, backdrop) => {
    // Fix iPhone Safari: sortir nav et backdrop du header sticky
    if (nav.parentElement !== document.body) document.body.appendChild(nav);
    if (backdrop.parentElement !== document.body) document.body.appendChild(backdrop);

    function setExpanded(v) {
      toggle.setAttribute("aria-expanded", v ? "true" : "false");
    }

    function openNav() {
      if (!isMobile()) return;
      document.body.classList.add("nav-open");
      nav.classList.add("is-open");
      backdrop.hidden = false;
      setExpanded(true);
    }

    function closeNav() {
      document.body.classList.remove("nav-open");
      nav.classList.remove("is-open");
      backdrop.hidden = true;
      setExpanded(false);
    }

    function isOpen() {
      return document.body.classList.contains("nav-open");
    }

    // Etat initial
    closeNav();

    // Click
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen()) closeNav();
      else openNav();
    });

    // Touch iOS
    toggle.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen()) closeNav();
        else openNav();
      },
      { passive: false }
    );

    // Backdrop
    backdrop.addEventListener("click", (e) => {
      e.preventDefault();
      closeNav();
    });

    // Liens dans le panneau
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    // Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) closeNav();
    });

    // Resize desktop
    window.addEventListener("resize", () => {
      if (!isMobile() && isOpen()) closeNav();
    });
  });
});
