/**
 * Florería Centenario — Main Application
 */

/* ── Loader ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => loader.remove(), 900);
    }
  }, 1800);
});

/* ── Petals ──────────────────────────────────────────────────── */
function createPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const colors = [
    '#f9c8d4','#f5aabf','#fde8e0','#f8d5c2','#fff0f3',
    '#fce4ec','#f8bbd0','#ffd7df','#ffe4cc','#fffbe0',
    '#ffffff','#faeef0','#e8f0e8','#d4e8d4'
  ];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const sz  = 8 + Math.random() * 20;
    const col = colors[Math.floor(Math.random() * colors.length)];
    const shapes = ['50% 0','50% 50% 0 50%','50% 0 50% 0','30% 70% 70% 30%'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const drift = (Math.random() - 0.5) * 280;
    const rot   = Math.random() * 360;
    const dur   = 9 + Math.random() * 14;
    const del   = Math.random() * 20;
    p.style.cssText = [
      `left:${Math.random()*100}%`,
      `width:${sz}px`,
      `height:${sz * (1.4 + Math.random() * 0.6)}px`,
      `background:${col}`,
      `border-radius:${shape}`,
      `--drift:${drift}px`,
      `--rot:${rot}deg`,
      `animation:petalFall ${dur}s ${del}s linear infinite`,
      `opacity:${0.5 + Math.random() * 0.5}`,
      `filter:blur(${Math.random() * 0.6}px)`,
    ].join(';');
    canvas.appendChild(p);
  }
}

/* ── Scroll-triggered Reveals ────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Navbar ─────────────────────────────────────────────────── */
function initNavbar() {
  const nav  = document.getElementById('navbar');
  const btn  = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btn && menu) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ── Back to Top ─────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Smooth anchor links ─────────────────────────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ORDER MODAL
   ══════════════════════════════════════════════════════════════ */

const PRODUCTS = {
  ramos: {
    name: 'Ramos de Flores',
    desc: 'Hermosos ramos con flores frescas de temporada',
    emoji: '💐',
    colorOptions: [
      { id: 'mixtos',   label: 'Mixtos',         icon: '🌈' },
      { id: 'rojos',    label: 'Rojos y rosas',  icon: '🌹' },
      { id: 'blancos',  label: 'Blancos',         icon: '🤍' },
      { id: 'calidos',  label: 'Cálidos',         icon: '🌻' },
      { id: 'violetas', label: 'Morados/Violetas',icon: '💜' },
      { id: 'sorpresa', label: 'Sorpréndeme',    icon: '✨' },
    ],
  },
  rosas: {
    name: 'Arreglos de Rosas',
    desc: 'Elegantes arreglos de rosas frescas',
    emoji: '🌹',
    colorOptions: [
      { id: 'rojas',    label: 'Rosas Rojas',    icon: '🌹' },
      { id: 'rosas',    label: 'Rosas Rosas',    icon: '🌸' },
      { id: 'blancas',  label: 'Rosas Blancas',  icon: '🤍' },
      { id: 'amarillas',label: 'Rosas Amarillas', icon: '💛' },
      { id: 'mixtas',   label: 'Mixtas',         icon: '🎨' },
    ],
    sizeOptions: [
      { id: '6',   label: '6 rosas',    icon: '6' },
      { id: '12',  label: '12 rosas',   icon: '12' },
      { id: '18',  label: '18 rosas',   icon: '18' },
      { id: '24',  label: '24 rosas',   icon: '24' },
      { id: '50',  label: '50 rosas',   icon: '50' },
      { id: '100', label: '100 rosas',  icon: '💯' },
    ],
  },
  exoticas: {
    name: 'Orquídeas, Tulipanes & Girasoles',
    desc: 'Flores exóticas y de temporada',
    emoji: '🌺',
    colorOptions: [
      { id: 'orquideas',  label: 'Orquídeas',   icon: '🌸' },
      { id: 'tulipanes',  label: 'Tulipanes',   icon: '🌷' },
      { id: 'girasoles',  label: 'Girasoles',   icon: '🌻' },
      { id: 'mezcla',     label: 'Mezcla',      icon: '💐' },
    ],
  },
  globos: {
    name: 'Arreglos con Globos',
    desc: 'Arreglos florales con globos personalizados',
    emoji: '🎈',
    colorOptions: [
      { id: 'cumple',  label: 'Cumpleaños',   icon: '🎂' },
      { id: 'amor',    label: 'Amor/Aniversario', icon: '❤️' },
      { id: 'bebe',    label: 'Baby Shower',  icon: '👶' },
      { id: 'grad',    label: 'Graduación',   icon: '🎓' },
      { id: 'otro',    label: 'Otro',         icon: '🎀' },
    ],
  },
  coronas: {
    name: 'Coronas Fúnebres',
    desc: 'Arreglos fúnebres con respeto y dignidad',
    emoji: '🕊️',
    colorOptions: [
      { id: 'blancos',  label: 'Solo blancos', icon: '🤍' },
      { id: 'suaves',   label: 'Tonos suaves', icon: '🌸' },
      { id: 'mixtos',   label: 'Mixtos',       icon: '💐' },
    ],
  },
  eventos: {
    name: 'Decoración de Eventos',
    desc: 'Decoraciones para bodas, quinceañeras y más',
    emoji: '✨',
    colorOptions: [
      { id: 'boda',    label: 'Boda',         icon: '💍' },
      { id: 'xv',      label: 'Quinceañera',  icon: '👑' },
      { id: 'cumple',  label: 'Cumpleaños',   icon: '🎂' },
      { id: 'baby',    label: 'Baby Shower',  icon: '🍼' },
      { id: 'grad',    label: 'Graduación',   icon: '🎓' },
      { id: 'corp',    label: 'Corporativo',  icon: '🏢' },
    ],
  },
};

const EXTRAS = [
  { id: 'globo',     label: 'Globo personalizado', price: '+$100', icon: '🎈' },
  { id: 'choco',     label: 'Caja de chocolates',  price: '+$80',  icon: '🍫' },
  { id: 'jarron',    label: 'Jarrón de cristal',   price: '+$150', icon: '🏺' },
  { id: 'canasta',   label: 'Canasta',             price: '+$120', icon: '🧺' },
  { id: 'peluche',   label: 'Peluche',             price: '+$100', icon: '🧸' },
  { id: 'tarjeta',   label: 'Tarjeta impresa',     price: 'Gratis',icon: '💌' },
];

const SIZES = [
  { id: 'pequeno', label: 'Pequeño',    desc: '5-8 tallos' },
  { id: 'mediano', label: 'Mediano',    desc: '10-15 tallos' },
  { id: 'grande',  label: 'Grande',     desc: '20+ tallos' },
  { id: 'xl',      label: 'Extra Grande', desc: 'Majestuoso' },
];

const WA_NUMBERS = ['+526622022284', '+526623480000'];
const WA_PRIMARY = WA_NUMBERS[0];

let order = {};
let currentStep = 1;
const TOTAL_STEPS = 4;

function openOrderModal(productKey) {
  const prod = PRODUCTS[productKey];
  if (!prod) return;

  order = {
    productKey,
    productName: prod.name,
    size: '',
    color: '',
    extras: [],
    message: '',
    specialInstructions: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
  };

  currentStep = 1;
  renderModal(prod);

  const overlay = document.getElementById('order-modal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  const overlay = document.getElementById('order-modal');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderModal(prod) {
  document.getElementById('modal-product-title').textContent = prod.name;
  renderStep1(prod);
  renderProgress();
  showStep(1);
}

function renderStep1(prod) {
  const container = document.getElementById('step1-content');
  const hasSizes = prod.sizeOptions || SIZES;
  const sizes = prod.sizeOptions || SIZES;

  container.innerHTML = `
    <div class="form-group">
      <label class="form-label">Producto seleccionado</label>
      <div style="background:var(--cream);border-radius:var(--r);padding:1rem;display:flex;gap:.8rem;align-items:center">
        <span style="font-size:2rem">${prod.emoji}</span>
        <div>
          <strong style="display:block;color:var(--text-dark)">${prod.name}</strong>
          <span style="font-size:var(--fs-xs);color:var(--text-light)">${prod.desc}</span>
        </div>
      </div>
    </div>

    ${prod.productKey !== 'eventos' ? `
    <div class="form-group">
      <label class="form-label">Tamaño</label>
      <div class="options-grid" id="size-options">
        ${sizes.map(s => `
          <label class="option-card" data-size="${s.id}">
            <input type="radio" name="size" value="${s.id}">
            <div class="opt-icon">${s.icon || '📦'}</div>
            <div class="opt-label">${s.label}</div>
            <div class="opt-price">${s.desc || ''}</div>
          </label>
        `).join('')}
      </div>
    </div>` : ''}

    <div class="form-group">
      <label class="form-label">${prod.productKey === 'globos' ? 'Ocasión' : prod.productKey === 'coronas' ? 'Colores' : 'Colores / Tipo'}</label>
      <div class="options-grid" id="color-options">
        ${prod.colorOptions.map(c => `
          <label class="option-card" data-color="${c.id}">
            <input type="radio" name="color" value="${c.id}">
            <div class="opt-icon">${c.icon}</div>
            <div class="opt-label">${c.label}</div>
          </label>
        `).join('')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Mensaje en tarjeta <span>(opcional, máx. 120 caracteres)</span></label>
      <textarea class="form-textarea" id="card-message" maxlength="120" placeholder="Ej: Te amo mucho, feliz cumpleaños 🌹" rows="2"
        oninput="order.message=this.value"></textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Extras <span>(opcional)</span></label>
      <div class="extras-grid">
        ${EXTRAS.map(ex => `
          <label class="extra-check" data-extra="${ex.id}">
            <input type="checkbox" value="${ex.id}" onchange="toggleExtra('${ex.id}',this.checked)">
            <div class="extra-info">
              <strong>${ex.icon} ${ex.label}</strong>
              <span>${ex.price}</span>
            </div>
          </label>
        `).join('')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Instrucciones especiales <span>(opcional)</span></label>
      <textarea class="form-textarea" id="special-instructions" rows="2"
        placeholder="Ej: Sin crisantemos, por favor, o cualquier detalle especial"
        oninput="order.specialInstructions=this.value"></textarea>
    </div>
  `;

  // Bind option card clicks
  container.querySelectorAll('[data-size]').forEach(el => {
    el.addEventListener('click', () => {
      container.querySelectorAll('[data-size]').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      order.size = el.dataset.size;
    });
  });
  container.querySelectorAll('[data-color]').forEach(el => {
    el.addEventListener('click', () => {
      container.querySelectorAll('[data-color]').forEach(e => e.classList.remove('selected'));
      el.classList.add('selected');
      order.color = el.dataset.color;
    });
  });
  container.querySelectorAll('.extra-check').forEach(el => {
    el.addEventListener('click', () => el.classList.toggle('checked', el.querySelector('input').checked));
  });
}

function toggleExtra(id, checked) {
  if (checked) {
    if (!order.extras.includes(id)) order.extras.push(id);
  } else {
    order.extras = order.extras.filter(e => e !== id);
  }
}

/* ── Step 2: Delivery schedule ───────────────────────────────── */
let calYear, calMonth;

function renderStep2() {
  const avail = window.FC ? window.FC.loadAvailability() : null;
  const today = new Date();
  calYear  = today.getFullYear();
  calMonth = today.getMonth();

  const container = document.getElementById('step2-content');
  container.innerHTML = `
    <p style="color:var(--text-mid);font-size:var(--fs-sm);margin-bottom:1.5rem">
      Selecciona la fecha y horario para tu entrega. Solo mostramos los días disponibles.
    </p>
    <div class="calendar-wrap">
      <div class="calendar-nav">
        <button class="cal-nav-btn" onclick="changeCalMonth(-1)" aria-label="Mes anterior">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span class="cal-month" id="cal-month-label"></span>
        <button class="cal-nav-btn" onclick="changeCalMonth(1)" aria-label="Mes siguiente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
      <div class="cal-grid" id="cal-grid"></div>
    </div>
    <div class="time-slots" id="time-slots-wrap" style="display:none">
      <h4>Selecciona horario de entrega:</h4>
      <div class="slots-grid" id="slots-grid"></div>
    </div>
  `;
  renderCalendar(avail);
}

function changeCalMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  const avail = window.FC ? window.FC.loadAvailability() : null;
  renderCalendar(avail);
}

function renderCalendar(avail) {
  const monthLabel = document.getElementById('cal-month-label');
  const grid       = document.getElementById('cal-grid');
  if (!monthLabel || !grid) return;

  const today = new Date();
  today.setHours(0,0,0,0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + (avail?.maxDaysAhead ?? 30));

  const d = new Date(calYear, calMonth, 1);
  monthLabel.textContent = d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

  const dayNames = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const firstDow = d.getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  grid.innerHTML = dayNames.map(n => `<div class="cal-day-name">${n}</div>`).join('');

  for (let i = 0; i < firstDow; i++) {
    grid.insertAdjacentHTML('beforeend', `<div class="cal-day empty"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(calYear, calMonth, day);
    date.setHours(0,0,0,0);
    const ds = window.FC ? window.FC.toDateStr(date) : date.toISOString().slice(0,10);
    const isToday = date.getTime() === today.getTime();
    const isPast  = date < today;
    const isFar   = date > maxDate;
    const isUnavail = avail ? !window.FC.isDateAvailable(avail, ds) : false;
    const isSelected = order.date === ds;

    let cls = 'cal-day';
    if (isToday)   cls += ' today';
    if (isPast)    cls += ' past';
    if (isFar)     cls += ' disabled';
    if (isUnavail && !isPast && !isFar) cls += ' unavailable';
    if (isSelected) cls += ' selected';

    const clickable = !isPast && !isFar && !isUnavail;
    grid.insertAdjacentHTML('beforeend',
      `<div class="${cls}" ${clickable ? `onclick="selectDate('${ds}')"` : ''}>${day}</div>`
    );
  }
}

function selectDate(ds) {
  order.date = ds;
  order.time = '';

  // Update calendar
  document.querySelectorAll('.cal-day.selected').forEach(e => e.classList.remove('selected'));
  document.querySelectorAll('.cal-day').forEach(el => {
    if (el.getAttribute('onclick')?.includes(ds)) el.classList.add('selected');
  });

  // Show time slots
  const avail = window.FC ? window.FC.loadAvailability() : null;
  const slots = avail ? window.FC.getSlotsForDate(avail, ds) : getDefaultSlots(ds);
  renderTimeSlots(slots);
}

function getDefaultSlots(ds) {
  const d = new Date(ds + 'T12:00:00');
  const dow = d.getDay();
  if (dow === 0) return [];
  if (dow === 6) return ['09:00','10:00','11:00','12:00','13:00','14:00'];
  return ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
}

function renderTimeSlots(slots) {
  const wrap  = document.getElementById('time-slots-wrap');
  const grid  = document.getElementById('slots-grid');
  if (!wrap || !grid) return;

  if (!slots.length) {
    wrap.innerHTML = '<p style="color:var(--rose-dark);font-size:var(--fs-sm);margin-top:1rem">No hay horarios disponibles para este día. Por favor elige otra fecha.</p>';
    wrap.style.display = 'block';
    return;
  }

  wrap.style.display = 'block';
  grid.innerHTML = slots.map(s => {
    const [h, m] = s.split(':');
    const hr = parseInt(h);
    const label = `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
    return `<div class="time-slot${order.time === s ? ' selected' : ''}" onclick="selectTime('${s}','${label}')">${label}</div>`;
  }).join('');
}

function selectTime(val, label) {
  order.time = val;
  order.timeLabel = label;
  document.querySelectorAll('.time-slot').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('onclick')?.includes(val));
  });
}

/* ── Step 3: Customer info ───────────────────────────────────── */
function renderStep3() {
  const container = document.getElementById('step3-content');
  container.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Tu nombre completo</label>
        <input class="form-input" type="text" placeholder="Ej: María González"
          value="${order.name||''}" oninput="order.name=this.value">
      </div>
      <div class="form-group">
        <label class="form-label">Tu número de teléfono</label>
        <input class="form-input" type="tel" placeholder="662-123-4567"
          value="${order.phone||''}" oninput="order.phone=this.value">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Dirección de entrega</label>
      <input class="form-input" type="text" placeholder="Calle, número y referencias"
        value="${order.address||''}" oninput="order.address=this.value">
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Colonia</label>
        <input class="form-input" type="text" placeholder="Ej: Col. Centro"
          value="${order.neighborhood||''}" oninput="order.neighborhood=this.value">
      </div>
      <div class="form-group">
        <label class="form-label">Ciudad</label>
        <input class="form-input" type="text" value="Hermosillo, Sonora" readonly style="background:var(--cream);cursor:not-allowed">
      </div>
    </div>
    <div class="form-group" style="background:rgba(184,149,106,.08);border:1px solid var(--champagne);border-radius:var(--r);padding:1rem">
      <p style="font-size:var(--fs-xs);color:var(--text-mid);line-height:1.6">
        ℹ️ Tu pedido se confirmará vía WhatsApp. Nuestro equipo te contactará para coordinar el pago y confirmar todos los detalles de tu arreglo.
      </p>
    </div>
  `;
}

/* ── Step 4: Summary & WhatsApp ──────────────────────────────── */
function renderStep4() {
  const container = document.getElementById('step4-content');
  const prod = PRODUCTS[order.productKey];

  const extrasLabel = order.extras.length
    ? order.extras.map(id => EXTRAS.find(e => e.id === id)?.label).filter(Boolean).join(', ')
    : 'Ninguno';

  const sizeLabel = order.size
    ? (prod.sizeOptions || SIZES).find(s => s.id === order.size)?.label || order.size
    : '—';

  const colorLabel = order.color
    ? prod.colorOptions.find(c => c.id === order.color)?.label || order.color
    : '—';

  const dateLabel = order.date
    ? window.FC ? window.FC.formatDateLabel(order.date) : order.date
    : '—';

  const waMsg = buildWhatsAppMessage(prod, sizeLabel, colorLabel, extrasLabel, dateLabel);

  container.innerHTML = `
    <p style="color:var(--text-mid);font-size:var(--fs-sm);margin-bottom:1.5rem">
      Revisa tu pedido y luego presiona el botón para enviarlo por WhatsApp. Nuestro equipo te responderá en minutos.
    </p>
    <div class="order-summary">
      ${[
        ['Producto',         `${prod.emoji} ${prod.name}`],
        ['Tamaño',           sizeLabel],
        ['Colores / Tipo',   colorLabel],
        ['Mensaje',          order.message || '—'],
        ['Extras',           extrasLabel],
        ['Instrucciones',    order.specialInstructions || '—'],
        ['Fecha de entrega', dateLabel],
        ['Horario',          order.timeLabel || order.time || '—'],
        ['Dirección',        order.address ? `${order.address}, ${order.neighborhood}, Hermosillo` : '—'],
        ['Nombre',           order.name || '—'],
        ['Teléfono',         order.phone || '—'],
      ].map(([l,v]) => `
        <div class="summary-row">
          <span class="summary-label">${l}</span>
          <span class="summary-value">${v}</span>
        </div>
      `).join('')}
    </div>
    <div class="wa-preview">
      <h4>📱 Mensaje que se enviará por WhatsApp:</h4>
      <pre id="wa-preview-text">${escHtml(waMsg)}</pre>
    </div>
  `;
}

function buildWhatsAppMessage(prod, sizeLabel, colorLabel, extrasLabel, dateLabel) {
  return [
    `¡Hola Florería Centenario! 🌸`,
    ``,
    `Me gustaría hacer el siguiente pedido:`,
    ``,
    `🌺 *PRODUCTO:* ${prod.name}`,
    `📏 *TAMAÑO:* ${sizeLabel}`,
    `🎨 *COLORES / TIPO:* ${colorLabel}`,
    order.message ? `💌 *MENSAJE EN TARJETA:* "${order.message}"` : null,
    order.extras.length ? `🎁 *EXTRAS:* ${extrasLabel}` : null,
    order.specialInstructions ? `📝 *INSTRUCCIONES:* ${order.specialInstructions}` : null,
    ``,
    `📅 *FECHA DE ENTREGA:* ${dateLabel}`,
    `⏰ *HORARIO:* ${order.timeLabel || order.time || '—'}`,
    `📍 *DIRECCIÓN:* ${order.address ? `${order.address}, ${order.neighborhood}, Hermosillo, Son.` : '—'}`,
    ``,
    `👤 *NOMBRE:* ${order.name || '—'}`,
    `📱 *TELÉFONO:* ${order.phone || '—'}`,
    ``,
    `¡Muchas gracias! 🌺`,
  ].filter(l => l !== null).join('\n');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ── Step navigation ─────────────────────────────────────────── */
function showStep(n) {
  currentStep = n;
  document.querySelectorAll('.modal-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
  });
  renderProgress();

  const backBtn  = document.getElementById('modal-back');
  const nextBtn  = document.getElementById('modal-next');
  const sendBtn  = document.getElementById('modal-send');
  if (backBtn) backBtn.style.display = n > 1 ? 'flex' : 'none';
  if (nextBtn) nextBtn.style.display = n < TOTAL_STEPS ? 'inline-flex' : 'none';
  if (sendBtn) sendBtn.style.display = n === TOTAL_STEPS ? 'inline-flex' : 'none';

  if (n === 2) renderStep2();
  if (n === 3) renderStep3();
  if (n === 4) renderStep4();
}

function renderProgress() {
  document.querySelectorAll('.step-circle').forEach((el, i) => {
    el.classList.remove('active', 'done');
    if (i + 1 < currentStep) el.classList.add('done');
    else if (i + 1 === currentStep) el.classList.add('active');
  });
  document.querySelectorAll('.step-line').forEach((el, i) => {
    el.classList.toggle('done', i + 1 < currentStep);
  });
}

function goNext() {
  if (currentStep === 1) {
    if (!order.color) { alert('Por favor selecciona un color o tipo.'); return; }
  }
  if (currentStep === 2) {
    if (!order.date) { alert('Por favor selecciona una fecha de entrega.'); return; }
    if (!order.time) { alert('Por favor selecciona un horario de entrega.'); return; }
  }
  if (currentStep === 3) {
    if (!order.name.trim())  { alert('Por favor ingresa tu nombre.'); return; }
    if (!order.phone.trim()) { alert('Por favor ingresa tu teléfono.'); return; }
    if (!order.address.trim()) { alert('Por favor ingresa la dirección de entrega.'); return; }
  }
  if (currentStep < TOTAL_STEPS) showStep(currentStep + 1);
}

function goBack() {
  if (currentStep > 1) showStep(currentStep - 1);
}

function sendViaWhatsApp() {
  const prod = PRODUCTS[order.productKey];
  const sizeLabel  = order.size  ? (prod.sizeOptions||SIZES).find(s=>s.id===order.size)?.label||order.size : '—';
  const colorLabel = order.color ? prod.colorOptions.find(c=>c.id===order.color)?.label||order.color : '—';
  const extrasLabel = order.extras.length ? order.extras.map(id=>EXTRAS.find(e=>e.id===id)?.label).filter(Boolean).join(', ') : 'Ninguno';
  const dateLabel  = order.date ? (window.FC ? window.FC.formatDateLabel(order.date) : order.date) : '—';
  const msg = buildWhatsAppMessage(prod, sizeLabel, colorLabel, extrasLabel, dateLabel);
  const url = `https://wa.me/${WA_PRIMARY.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeOrderModal();
}

/* ── Quick WhatsApp ──────────────────────────────────────────── */
function openWhatsApp(msg) {
  const text = msg || '¡Hola! Me gustaría hacer un pedido de flores. ¿Me pueden ayudar? 🌸';
  window.open(`https://wa.me/${WA_PRIMARY.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(text)}`, '_blank');
}

/* ── DOM Ready ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  initReveal();
  initNavbar();
  initBackToTop();
  initSmoothLinks();

  // Modal close
  const overlay = document.getElementById('order-modal');
  if (overlay) {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeOrderModal(); });
  }

  // Option cards product key injection
  document.querySelectorAll('[data-order-product]').forEach(btn => {
    btn.addEventListener('click', () => openOrderModal(btn.dataset.orderProduct));
  });
});
