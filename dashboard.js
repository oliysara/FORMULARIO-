const login = document.getElementById('login');
const dashboard = document.getElementById('dashboard');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const loginMsg = document.getElementById('loginMsg');
const refreshBtn = document.getElementById('refreshBtn');
const stats = document.getElementById('stats');
const rows = document.getElementById('rows');
const allergyList = document.getElementById('allergyList');
const dashMsg = document.getElementById('dashMsg');
const search = document.getElementById('search');
let allData = [];

loginBtn.addEventListener('click', () => {
  if (password.value === DASHBOARD_PASSWORD) {
    login.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadData();
  } else {
    loginMsg.className = 'msg bad';
    loginMsg.textContent = 'Contraseña incorrecta.';
  }
});

password.addEventListener('keydown', (e) => { if (e.key === 'Enter') loginBtn.click(); });
refreshBtn.addEventListener('click', loadData);
search.addEventListener('input', () => render(allData));

async function loadData() {
  dashMsg.className = 'msg'; dashMsg.textContent = '';
  refreshBtn.disabled = true; refreshBtn.textContent = 'Actualizando...';
  try {
    const res = await fetch(`${SCRIPT_URL}?action=list&cache=${Date.now()}`);
    const json = await res.json();
    allData = json.rows || [];
    render(allData);
  } catch (err) {
    dashMsg.className = 'msg bad';
    dashMsg.textContent = 'No se pudieron cargar los datos. Revisa que Apps Script tenga doGet y esté implementado.';
  } finally {
    refreshBtn.disabled = false; refreshBtn.textContent = 'Actualizar datos';
  }
}

function render(data) {
  const q = search.value.trim().toLowerCase();
  const filtered = q ? data.filter(r => Object.values(r).join(' ').toLowerCase().includes(q)) : data;
  const count = (field, value) => data.filter(r => (r[field] || '').trim() === value).length;
  const allergies = data.filter(r => (r.tieneAlergia || '').trim().toLowerCase() === 'sí');

  stats.innerHTML = `
    <div class="stat"><b>${data.length}</b><span>👥 Invitados</span></div>
    <div class="stat"><b>${count('menu','Carne')}</b><span>🥩 Carne</span></div>
    <div class="stat"><b>${count('menu','Pescado')}</b><span>🐟 Pescado</span></div>
    <div class="stat"><b>${count('menu','Menú infantil')}</b><span>👶 Infantil</span></div>
    <div class="stat"><b>${allergies.length}</b><span>⚠️ Alergias</span></div>
  `;

  allergyList.innerHTML = allergies.length ? allergies.map(r => `
    <div class="listItem"><strong>${escapeHtml(r.nombre)}</strong><br><span>${escapeHtml(r.menu)} · ${escapeHtml(r.alergias || 'Sin detalle')}</span></div>
  `).join('') : '<p class="muted">No hay alergias registradas.</p>';

  rows.innerHTML = filtered.map(r => `
    <tr>
      <td>${escapeHtml(r.fecha)}</td><td>${escapeHtml(r.nombre)}</td><td>${escapeHtml(r.menu)}</td>
      <td>${escapeHtml(r.tieneAlergia)}</td><td>${escapeHtml(r.alergias)}</td><td>${escapeHtml(r.observaciones)}</td>
    </tr>
  `).join('');
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
