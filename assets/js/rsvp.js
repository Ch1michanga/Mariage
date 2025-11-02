const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxIA4f206tWFaNA4OMEaVLVfpCpuDonydjv4IL8RaK99v3cS9-DtQqWMIKMnIiwdu3NUA/exec';

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
  // convertir en x-www-form-urlencoded pour éviter le preflight CORS
  const params = new URLSearchParams();
  for (const [k,v] of fd.entries()) params.append(k, v);

  if(!params.get('nom') || !params.get('email')){
    setStatus('error', 'Merci d’indiquer au moins votre nom et votre email.');
    return;
  }

  try{
    const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: params });
    const text = await res.text();
    let out = null; try { out = JSON.parse(text); } catch(_){}
    if (res.ok && out?.ok === true && out?.written === true){
      setStatus('success', 'Merci ! Votre réponse a bien été enregistrée.');
      form.reset();
    } else {
      throw new Error('Réponse invalide: ' + (text || res.status));
    }
  }catch(err){
    setStatus('error', 'Erreur réseau : ' + String(err));
    console.error(err);
  }
});

