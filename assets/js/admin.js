/**
 * Florería Centenario — Admin / Owner Panel
 * Manages delivery availability settings stored in localStorage.
 */

const ADMIN_PASS_KEY = 'fc_admin_pass';
const DEFAULT_PASS   = 'centenario';

let avail = null;
let editingDate = null;

function checkAuth() {
  const stored = localStorage.getItem(ADMIN_PASS_KEY);
  const hash   = stored || btoa(DEFAULT_PASS);
  return hash === btoa(DEFAULT_PASS);
}

function login() {
  const val = document.getElementById('admin-pass').value;
  if (btoa(val) === (localStorage.getItem(ADMIN_PASS_KEY) || btoa(DEFAULT_PASS))) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').style.display    = 'block';
    initAdmin();
  } else {
    document.getElementById('login-error').textContent = 'Contraseña incorrecta. Inténtalo de nuevo.';
  }
}

function initAdmin() {
  avail = window.FC.loadAvailability();
  renderWeeklySchedule();
  renderBlockedDates();
  renderSpecialDates();
  renderSettings();
}

/* ── Weekly schedule ─────────────────────────────────────────── */
const DAY_NAMES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const DEFAULT_SLOTS_ALL = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

function renderWeeklySchedule() {
  const container = document.getElementById('weekly-schedule');
  container.innerHTML = '';

  for (let dow = 0; dow <= 6; dow++) {
    const day = avail.weeklySchedule[dow];
    const div = document.createElement('div');
    div.className = 'day-row' + (day.open ? '' : ' closed');
    div.innerHTML = `
      <div class="day-header">
        <label class="toggle-label">
          <input type="checkbox" ${day.open ? 'checked' : ''} onchange="toggleDay(${dow}, this.checked)">
          <span class="toggle-slider"></span>
          <span class="day-name">${DAY_NAMES[dow]}</span>
        </label>
        <span class="day-status">${day.open ? 'Disponible' : 'Cerrado'}</span>
      </div>
      ${day.open ? `
      <div class="slots-editor" id="slots-${dow}">
        <div class="slots-checkboxes">
          ${DEFAULT_SLOTS_ALL.map(s => {
            const [h,m] = s.split(':');
            const hr = parseInt(h);
            const lbl = `${hr>12?hr-12:hr}:${m} ${hr>=12?'PM':'AM'}`;
            return `
              <label class="slot-cb ${day.slots.includes(s) ? 'active' : ''}">
                <input type="checkbox" value="${s}" ${day.slots.includes(s)?'checked':''}
                  onchange="toggleSlot(${dow},'${s}',this.checked)">
                <span>${lbl}</span>
              </label>`;
          }).join('')}
        </div>
        <div style="margin-top:.8rem;display:flex;gap:.6rem;flex-wrap:wrap">
          <button class="admin-btn admin-btn-sm" onclick="selectAllSlots(${dow})">Todos</button>
          <button class="admin-btn admin-btn-sm admin-btn-outline" onclick="clearAllSlots(${dow})">Ninguno</button>
          <button class="admin-btn admin-btn-sm admin-btn-outline" onclick="setMorningSlots(${dow})">Mañana (9-14)</button>
          <button class="admin-btn admin-btn-sm admin-btn-outline" onclick="setAfternoonSlots(${dow})">Tarde (14-19)</button>
        </div>
      </div>` : ''}
    `;
    container.appendChild(div);
  }
}

function toggleDay(dow, open) {
  avail.weeklySchedule[dow].open = open;
  if (open && !avail.weeklySchedule[dow].slots.length) {
    avail.weeklySchedule[dow].slots = [...window.FC.DEFAULT_SCHEDULE[dow].slots];
  }
  window.FC.saveAvailability(avail);
  renderWeeklySchedule();
  showToast('Horario actualizado ✓');
}

function toggleSlot(dow, slot, checked) {
  const slots = avail.weeklySchedule[dow].slots;
  if (checked && !slots.includes(slot)) slots.push(slot);
  if (!checked) avail.weeklySchedule[dow].slots = slots.filter(s => s !== slot);
  avail.weeklySchedule[dow].slots.sort();
  window.FC.saveAvailability(avail);
  showToast('Horario actualizado ✓');
  document.querySelectorAll(`#slots-${dow} .slot-cb`).forEach(el => {
    const cb = el.querySelector('input');
    el.classList.toggle('active', cb.checked);
  });
}

function selectAllSlots(dow) {
  avail.weeklySchedule[dow].slots = [...DEFAULT_SLOTS_ALL];
  window.FC.saveAvailability(avail);
  renderWeeklySchedule();
  showToast('Todos los horarios seleccionados ✓');
}
function clearAllSlots(dow) {
  avail.weeklySchedule[dow].slots = [];
  window.FC.saveAvailability(avail);
  renderWeeklySchedule();
  showToast('Horarios eliminados');
}
function setMorningSlots(dow) {
  avail.weeklySchedule[dow].slots = ['09:00','10:00','11:00','12:00','13:00','14:00'];
  window.FC.saveAvailability(avail);
  renderWeeklySchedule();
  showToast('Horarios de mañana ✓');
}
function setAfternoonSlots(dow) {
  avail.weeklySchedule[dow].slots = ['14:00','15:00','16:00','17:00','18:00','19:00'];
  window.FC.saveAvailability(avail);
  renderWeeklySchedule();
  showToast('Horarios de tarde ✓');
}

/* ── Blocked dates ───────────────────────────────────────────── */
function renderBlockedDates() {
  const container = document.getElementById('blocked-dates-list');
  if (!avail.blockedDates.length) {
    container.innerHTML = '<p class="admin-empty">No hay fechas bloqueadas</p>';
    return;
  }
  container.innerHTML = avail.blockedDates.sort().map(ds => `
    <div class="date-chip">
      <span>${window.FC.formatDateLabel(ds)}</span>
      <button onclick="removeBlockedDate('${ds}')" aria-label="Eliminar">✕</button>
    </div>
  `).join('');
}

function addBlockedDate() {
  const input = document.getElementById('block-date-input');
  const ds = input.value;
  if (!ds) { alert('Por favor selecciona una fecha.'); return; }
  if (!avail.blockedDates.includes(ds)) {
    avail.blockedDates.push(ds);
    window.FC.saveAvailability(avail);
    renderBlockedDates();
    showToast(`Fecha bloqueada: ${ds} ✓`);
  }
  input.value = '';
}

function removeBlockedDate(ds) {
  avail.blockedDates = avail.blockedDates.filter(d => d !== ds);
  window.FC.saveAvailability(avail);
  renderBlockedDates();
  showToast('Fecha desbloqueada ✓');
}

/* ── Special date overrides ──────────────────────────────────── */
function renderSpecialDates() {
  const container = document.getElementById('special-dates-list');
  const dates = Object.keys(avail.specialDates).sort();
  if (!dates.length) {
    container.innerHTML = '<p class="admin-empty">No hay fechas especiales configuradas</p>';
    return;
  }
  container.innerHTML = dates.map(ds => {
    const sp = avail.specialDates[ds];
    return `
      <div class="date-chip ${sp.open ? '' : 'closed'}">
        <span>
          <strong>${ds}</strong> — ${sp.open ? `Abierto: ${sp.slots.join(', ')||'sin horarios'}` : 'Cerrado'}
        </span>
        <button onclick="removeSpecialDate('${ds}')" aria-label="Eliminar">✕</button>
      </div>`;
  }).join('');
}

function addSpecialDate() {
  const ds     = document.getElementById('special-date-input').value;
  const open   = document.getElementById('special-date-open').checked;
  const slotsRaw = document.getElementById('special-date-slots').value;

  if (!ds) { alert('Por favor selecciona una fecha.'); return; }

  const slots = slotsRaw.split(',')
    .map(s => s.trim())
    .filter(s => /^\d{2}:\d{2}$/.test(s));

  avail.specialDates[ds] = { open, slots };
  window.FC.saveAvailability(avail);
  renderSpecialDates();
  showToast(`Fecha especial configurada: ${ds} ✓`);

  document.getElementById('special-date-input').value = '';
  document.getElementById('special-date-slots').value = '';
}

function removeSpecialDate(ds) {
  delete avail.specialDates[ds];
  window.FC.saveAvailability(avail);
  renderSpecialDates();
  showToast('Fecha especial eliminada ✓');
}

/* ── Settings ────────────────────────────────────────────────── */
function renderSettings() {
  document.getElementById('setting-lead-hours').value  = avail.minLeadHours ?? 2;
  document.getElementById('setting-max-days').value    = avail.maxDaysAhead ?? 30;
  document.getElementById('setting-zone').value        = avail.deliveryZone ?? 'Hermosillo, Sonora';
}

function saveSettings() {
  avail.minLeadHours  = parseInt(document.getElementById('setting-lead-hours').value) || 2;
  avail.maxDaysAhead  = parseInt(document.getElementById('setting-max-days').value) || 30;
  avail.deliveryZone  = document.getElementById('setting-zone').value || 'Hermosillo, Sonora';
  window.FC.saveAvailability(avail);
  showToast('Configuración guardada ✓');
}

/* ── Change password ─────────────────────────────────────────── */
function changePassword() {
  const current = document.getElementById('cur-pass').value;
  const newPass  = document.getElementById('new-pass').value;
  const confirm  = document.getElementById('confirm-pass').value;

  if (btoa(current) !== (localStorage.getItem(ADMIN_PASS_KEY) || btoa(DEFAULT_PASS))) {
    alert('Contraseña actual incorrecta.'); return;
  }
  if (newPass.length < 6) { alert('La nueva contraseña debe tener al menos 6 caracteres.'); return; }
  if (newPass !== confirm) { alert('Las contraseñas no coinciden.'); return; }

  localStorage.setItem(ADMIN_PASS_KEY, btoa(newPass));
  showToast('Contraseña actualizada ✓');
  ['cur-pass','new-pass','confirm-pass'].forEach(id => document.getElementById(id).value = '');
}

/* ── Export / Import ─────────────────────────────────────────── */
function exportSettings() {
  const json = JSON.stringify(avail, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `floreria-centenario-disponibilidad-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Configuración exportada ✓');
}

function importSettings(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      avail = data;
      window.FC.saveAvailability(avail);
      renderWeeklySchedule();
      renderBlockedDates();
      renderSpecialDates();
      renderSettings();
      showToast('Configuración importada ✓');
    } catch {
      alert('Archivo inválido. Por favor usa un archivo JSON exportado desde este panel.');
    }
  };
  reader.readAsText(file);
}

function resetToDefault() {
  if (!confirm('¿Restaurar configuración predeterminada? Esto eliminará todos tus ajustes personalizados.')) return;
  avail = window.FC.getDefaultAvailability();
  window.FC.saveAvailability(avail);
  renderWeeklySchedule();
  renderBlockedDates();
  renderSpecialDates();
  renderSettings();
  showToast('Configuración restaurada ✓');
}

/* ── Toast ───────────────────────────────────────────────────── */
let toastTimeout;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Tabs ────────────────────────────────────────────────────── */
function showTab(tabId) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.admin-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === tabId);
  });
}

/* ── Init ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Auto-focus password field
  const passInput = document.getElementById('admin-pass');
  if (passInput) {
    passInput.focus();
    passInput.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
  }
});
