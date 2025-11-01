const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx27TlMfIeYc4NqD6Ojj7NjaTd2ksUuwjSRABscFWAi4LjZQhhzsOiy2JDE90FY3SJB2A/exec';

const form = document.getElementById('rsvp-form');
const statusBox = document.getElementById('rsvp-status');

function setStatus(type, msg){
  statusBox.className = `notice ${type}`;
  statusBox.textContent = msg;
}

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  setStatus('', 'Envoi en cours…');

  const fd = new FormData(form);
  // Convertir en x-www-form-urlencoded pour éviter le preflight CORS
  const params = new URLSearchParams();
  for (const [k,v] of fd.entries()) params.append(k, v);

  // Validation minimale
  if(!params.get('nom') || !params.get('email')){
    setStatus('error', 'Merci d’indiquer au moins votre nom et votre email.');
    return;
  }

  try{
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      // IMPORTANT : ne PAS fixer Content-Type manuellement -> le navigateur mettra
      // application/x-www-form-urlencoded par défaut pour URLSearchParams
      body: params
    });
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.getContentText?.() || (await res.text?.()) || '';
    // On tente JSON d'abord, sinon on considère ok si 200
    let out = null;
    try { out = JSON.parse(text); } catch(_) {}
    if (out?.ok || res.ok){
      setStatus('success', 'Merci ! Votre réponse a bien été enregistrée.');
      form.reset();
    } else {
      throw new Error(out?.message || 'Erreur inconnue');
    }
  }catch(err){
    setStatus('error', 'Erreur réseau : ' + String(err));
    console.error(err);
  }
});
