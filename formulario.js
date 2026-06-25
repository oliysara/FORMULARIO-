const form = document.getElementById('weddingForm');
const btn = document.getElementById('submitBtn');
const msg = document.getElementById('msg');
const alergiaBox = document.getElementById('alergiaBox');
const alergias = document.getElementById('alergias');
const thanks = document.getElementById('thanks');

document.querySelectorAll('input[name="tieneAlergia"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const selected = document.querySelector('input[name="tieneAlergia"]:checked');
    const show = selected && selected.value === 'Sí';
    alergiaBox.classList.toggle('hidden', !show);
    alergias.required = show;
    if (!show) alergias.value = '';
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.className = 'msg'; msg.textContent = '';
  btn.disabled = true; btn.textContent = 'Enviando...';

  const data = new FormData(form);
  data.append('action', 'save');

  try {
    await fetch(SCRIPT_URL, { method: 'POST', body: data, mode: 'no-cors' });
    form.style.display = 'none';
    thanks.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    msg.className = 'msg bad';
    msg.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
  } finally {
    btn.disabled = false; btn.textContent = 'Enviar respuesta';
  }
});
