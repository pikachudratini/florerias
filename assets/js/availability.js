/**
 * Florería Centenario — Availability Module
 * Shared between the storefront and admin panel.
 * Stores owner-configured delivery availability in localStorage.
 */

const AVAIL_KEY = 'fc_availability_v1';

// Default business hours: Mon–Fri 9–19, Sat–Sun 9–15
const DEFAULT_SCHEDULE = {
  0: { open: false, slots: [] },                               // Sunday
  1: { open: true,  slots: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'] },
  2: { open: true,  slots: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'] },
  3: { open: true,  slots: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'] },
  4: { open: true,  slots: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'] },
  5: { open: true,  slots: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'] },
  6: { open: true,  slots: ['09:00','10:00','11:00','12:00','13:00','14:00'] },  // Saturday
};

function loadAvailability() {
  try {
    const raw = localStorage.getItem(AVAIL_KEY);
    if (!raw) return getDefaultAvailability();
    return JSON.parse(raw);
  } catch {
    return getDefaultAvailability();
  }
}

function saveAvailability(data) {
  localStorage.setItem(AVAIL_KEY, JSON.stringify(data));
}

function getDefaultAvailability() {
  return {
    weeklySchedule: { ...DEFAULT_SCHEDULE },
    blockedDates: [],     // ['YYYY-MM-DD', ...]
    specialDates: {},     // {'YYYY-MM-DD': {open:true, slots:[...]}}
    minLeadHours: 2,      // Min hours before desired delivery
    maxDaysAhead: 30,     // How far in advance customers can schedule
    deliveryZone: 'Hermosillo, Sonora',
  };
}

function isDateAvailable(avail, dateStr) {
  // dateStr = 'YYYY-MM-DD'
  if (avail.blockedDates.includes(dateStr)) return false;
  if (avail.specialDates[dateStr]) return avail.specialDates[dateStr].open;
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay();
  return avail.weeklySchedule[dow]?.open ?? false;
}

function getSlotsForDate(avail, dateStr) {
  if (avail.blockedDates.includes(dateStr)) return [];
  if (avail.specialDates[dateStr]) return avail.specialDates[dateStr].slots || [];
  const d = new Date(dateStr + 'T12:00:00');
  const dow = d.getDay();
  return avail.weeklySchedule[dow]?.slots ?? [];
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

// Export for use by both app.js and admin.js
window.FC = window.FC || {};
Object.assign(window.FC, {
  loadAvailability,
  saveAvailability,
  getDefaultAvailability,
  isDateAvailable,
  getSlotsForDate,
  formatDateLabel,
  toDateStr,
  DEFAULT_SCHEDULE,
});
