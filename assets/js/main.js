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
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#site-nav");
    const backdrop = document.querySelector(".nav-backdrop");

    if (header && toggle && nav && backdrop) return cb(header, toggle, nav, backdrop);

    if (tries > 200) return;
    setTimeout(() => whenNavReady(cb, tries + 1), 50);
  }

  function setActiveNav() {
    const path = window.location.pathname;
    const currentFile =
      path.endsWith("/") || path === "" ? "index.html" : path.split("/").pop().toLowerCase();

    document.querySelectorAll(".nav-link[href]").forEach((a) => {
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

  whenNavReady((header, toggle, nav, backdrop) => {
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

    function placeDesktop() {
      // Force le menu EXACTEMENT dans le header, juste après le bouton burger
      if (nav.parentElement !== header) {
        toggle.insertAdjacentElement("afterend", nav);
      } else {
        // même si déjà dans header, on garantit l ordre (burger puis nav)
        const next = toggle.nextElementSibling;
        if (next !== nav) toggle.insertAdjacentElement("afterend", nav);
      }
      closeNav();
    }

    function placeMobile() {
      // iPhone Safari: menu + backdrop au niveau body
      if (nav.parentElement !== document.body) document.body.appendChild(nav);
      if (backdrop.parentElement !== document.body) document.body.appendChild(backdrop);
    }

    function syncPlacement() {
      if (isMobile()) placeMobile();
      else placeDesktop();
    }

    setActiveNav();
    closeNav();
    syncPlacement();

    // re sync après injection tardive
    setTimeout(syncPlacement, 0);
    setTimeout(syncPlacement, 250);

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      syncPlacement();
      if (isOpen()) closeNav();
      else openNav();
    });

    toggle.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        syncPlacement();
        if (isOpen()) closeNav();
        else openNav();
      },
      { passive: false }
    );

    backdrop.addEventListener("click", (e) => {
      e.preventDefault();
      closeNav();
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeNav());
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) closeNav();
    });

    window.addEventListener("resize", () => {
      syncPlacement();
    });
  });
});
