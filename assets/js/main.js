// assets/js/main.js

function onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

onReady(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const backdrop = document.querySelector(".nav-backdrop");

  if (!toggle || !nav || !backdrop) return;

  const MOBILE_MAX = 860;

  function isMobile() {
    return window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;
  }

  // Fix iPhone Safari
  // If nav or backdrop are inside a sticky header with backdrop filter,
  // position fixed can behave incorrectly. Move them to body.
  if (nav.parentElement !== document.body) {
    document.body.appendChild(nav);
  }
  if (backdrop.parentElement !== document.body) {
    document.body.appendChild(backdrop);
  }

  function openNav() {
    if (!isMobile()) return;
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    backdrop.hidden = false;
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    backdrop.hidden = true;
  }

  function isOpen() {
    return document.body.classList.contains("nav-open");
  }

  // Initial state
  closeNav();

  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen()) closeNav();
    else openNav();
  });

  // iOS sometimes needs touchstart to feel instant
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
    if (!isMobile() && isOpen()) closeNav();
  });
});
