// assets/js/rsvp.js

const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwWsOFd3js3FoM-MXs69YDpFO3LOEMINWNDB3f6_ksRspTWwRHTq4OCBBn6JAr8-QIhcw/exec";

const form = document.getElementById("rsvp-form");
const statusBox = document.getElementById("rsvp-status");

function setStatus(type, msg) {
  statusBox.className = `notice ${type || ""}`.trim();
  statusBox.textContent = msg;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("", "Envoi en cours…");

  const fd = new FormData(form);

  // Validation minimale
  const nom = (fd.get("nom") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();

  if (!nom || !email) {
    setStatus("error", "Merci d’indiquer au moins votre nom et votre email.");
    return;
  }

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: new URLSearchParams(fd) // IMPORTANT: envoi en x-www-form-urlencoded
    });

    const text = await res.text();
    let out;
    try {
      out = JSON.parse(text);
    } catch {
      out = null;
    }

    if (!res.ok) throw new Error("HTTP " + res.status);
    if (!out?.ok) throw new Error(out?.message || text || "Erreur inconnue");

    setStatus("success", "Merci ! Votre réponse a bien été enregistrée.");
    form.reset();
  } catch (err) {
    setStatus("error", "Oups, une erreur est survenue. Réessayez plus tard.");
    console.error(err);
  }
});
