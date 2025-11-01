const FORM_ENDPOINT = 'YOUR_SCRIPT_URL_HERE'; // à remplacer après Apps Script

const form = document.getElementById('rsvp-form');
const statusBox = document.getElementById('rsvp-status');

function setStatus(type, msg){
  statusBox.className = `notice ${type}`;
  statusBox.textContent = msg;
}

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  setStatus('', 'Envoi en cours…');
  const data = Object.fromEntries(new FormData(form).entries());

  if(!data.nom || !data.email){
    setStatus('error', 'Merci d’indiquer au moins votre nom et votre email.');
    return;
  }
  try{
    const res = await fetch(FORM_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(!res.ok) throw new Error('HTTP '+res.status);
    const out = await res.json();
    if(out?.ok){
      setStatus('success', 'Merci ! Votre réponse a bien été enregistrée.');
      form.reset();
    }else{
      throw new Error(out?.message || 'Erreur inconnue');
    }
  }catch(err){
    setStatus('error', 'Oups, une erreur est survenue. Réessayez plus tard.');
    console.error(err);
  }
});