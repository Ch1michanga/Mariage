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

  function whenNavReady(cb, tries = 0) {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    const backdrop = document.querySelector(".nav-backdrop");

    if (toggle && nav && backdrop) return cb(toggle, nav, backdrop);

    if (tries > 120) return;
    setTimeout(() => whenNavReady(cb, tries + 1), 100);
  }

  whenNavReady((toggle, nav, backdrop) => {
    const originalParent = nav.parentElement;
    const originalNext = nav.nextElementSibling; // null ok

    function setExpanded(v) {
      toggle.setAttribute("aria-expanded", v ? "true" : "false");
    }

    function openNav() {
      if (!isMobile()) return;
      document.body.classList.add("nav-open");
      backdrop.hidden = false;
      setExpanded(true);
    }

    function closeNav() {
      document.body.classList.remove("nav-open");
      backdrop.hidden = true;
      setExpanded(false);
    }

    function isOpen() {
      return document.body.classList.contains("nav-open");
    }

    function placeNavCorrectly() {
      if (isMobile()) {
        // iPhone Safari fix: menu et backdrop au niveau body
        if (nav.parentElement !== document.body) document.body.appendChild(nav);
        if (backdrop.parentElement !== document.body) document.body.appendChild(backdrop);
      } else {
        // Desktop: remettre la nav dans le header pour revoir les boutons
        if (nav.parentElement !== originalParent) {
          if (originalNext && originalNext.parentElement === originalParent) {
            originalParent.insertBefore(nav, originalNext);
          } else {
            originalParent.appendChild(nav);
          }
        }
        // Backdrop peut rester dans body mais on le cache
        closeNav();
      }
    }

    // Etat initial
    closeNav();
    placeNavCorrectly();

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      placeNavCorrectly();
      if (isOpen()) closeNav();
      else openNav();
    });

    toggle.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        placeNavCorrectly();
        if (isOpen()) closeNav();
        else openNav();
      },
      { passive: false }
    );

    backdrop.addEventListener("click", (e) => {
      e.preventDefault();
      closeNav();
    });

    // fermer au clic sur un lien (utile mobile)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) closeNav();
    });

    window.addEventListener("resize", () => {
      placeNavCorrectly();
    });
  });
});
