/* ═══════════════════════════════════════════════════
   UMMS — Urban Mobility Management System
   app.js  |  All interactive logic
═══════════════════════════════════════════════════ */

/* ════════════════════════════════
   NAVIGATION
════════════════════════════════ */
const PAGES = {
  dashboard : 'Dashboard',
  journey   : 'Journey Planner',
  tickets   : 'My Tickets',
  rewards   : 'Eco Rewards',
  analytics : 'Analytics',
  account   : 'My Account',
  audit     : 'Audit Log',
};

function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      // deactivate all
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
      // activate selected
      item.classList.add('active');
      const page = item.dataset.page;
      const section = document.getElementById('page-' + page);
      if (section) section.classList.add('active');
      document.getElementById('topbar-title').textContent = PAGES[page] || page;
    });
  });
}

/* ════════════════════════════════
   TRANSACTION TABLE
════════════════════════════════ */
const TX_DATA = [
  { id: 'TXN-8821', user: 'John D.',  route: 'Central → Tech Park',  mode: '🚇', amount: '₹42', status: 'completed' },
  { id: 'TXN-8820', user: 'Priya S.', route: 'Airport → Downtown',   mode: '🚌', amount: '₹85', status: 'completed' },
  { id: 'TXN-8819', user: 'Arjun M.', route: 'Lake → Suburb',        mode: '🚲', amount: '₹22', status: 'completed' },
  { id: 'TXN-8818', user: 'Sara K.',  route: 'Metro Line 2',          mode: '🚇', amount: '₹38', status: 'failed'    },
  { id: 'TXN-8817', user: 'Rahul T.', route: 'Tech Hub Loop',         mode: '🛴', amount: '₹18', status: 'completed' },
  { id: 'TXN-8816', user: 'Meera R.', route: 'South → North',         mode: '🚌', amount: '₹30', status: 'pending'   },
];

function renderTransactions() {
  const tbody = document.getElementById('tx-table-body');
  if (!tbody) return;

  tbody.innerHTML = TX_DATA.map(tx => {
    const badgeClass =
      tx.status === 'completed' ? 'badge-green' :
      tx.status === 'failed'    ? 'badge-red'   : 'badge-amber';

    return `
      <tr>
        <td class="mono small">${tx.id}</td>
        <td>${tx.user}</td>
        <td>${tx.route}</td>
        <td class="mode-cell">${tx.mode}</td>
        <td class="amount-cell">${tx.amount}</td>
        <td><span class="badge ${badgeClass}">${tx.status.toUpperCase()}</span></td>
      </tr>`;
  }).join('');
}

/* ════════════════════════════════
   JOURNEY PLANNER
════════════════════════════════ */
function planJourney() {
  const origin = document.getElementById('j-origin').value.trim() || 'Origin';
  const dest   = document.getElementById('j-dest').value.trim()   || 'Destination';
  const body   = document.getElementById('route-body');
  const badge  = document.getElementById('route-badge');

  if (!body) return;

  body.innerHTML = `
    <div class="route-summary">
      <div class="route-summary-item">
        <div class="rs-label">TOTAL FARE</div>
        <div class="rs-value accent">₹68</div>
      </div>
      <div class="route-summary-item">
        <div class="rs-label">DURATION</div>
        <div class="rs-value">42 min</div>
      </div>
      <div class="route-summary-item">
        <div class="rs-label">ECO POINTS</div>
        <div class="rs-value accent3">+18</div>
      </div>
    </div>

    <div class="route-steps">
      <div class="route-step">
        <div class="route-step-icon">📍</div>
        <div class="route-step-info">
          <div class="route-step-title">${escHtml(origin)}</div>
          <div class="route-step-sub">DEPARTURE POINT</div>
        </div>
        <div class="route-step-time">14:30</div>
      </div>
      <div class="route-step">
        <div class="route-step-icon">🚇</div>
        <div class="route-step-info">
          <div class="route-step-title">Metro Line 2</div>
          <div class="route-step-sub">CENTRAL → TECH PARK · 8 STOPS · ₹42</div>
        </div>
        <div class="route-step-time">28 min</div>
      </div>
      <div class="route-step">
        <div class="route-step-icon">🚲</div>
        <div class="route-step-info">
          <div class="route-step-title">Bike Share Station 14</div>
          <div class="route-step-sub">TECH PARK → DESTINATION · 2.1KM · ₹26</div>
        </div>
        <div class="route-step-time">14 min</div>
      </div>
      <div class="route-step">
        <div class="route-step-icon">🏁</div>
        <div class="route-step-info">
          <div class="route-step-title">${escHtml(dest)}</div>
          <div class="route-step-sub">ARRIVAL</div>
        </div>
        <div class="route-step-time">15:12</div>
      </div>
    </div>

    <button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="bookJourney()">
      Book This Journey
    </button>`;

  if (badge) badge.style.display = 'inline-flex';
}

function bookJourney() {
  showNotif('✅ Journey booked! Tickets added to your wallet.');
}

/* ════════════════════════════════
   PAYMENT & TICKETS
════════════════════════════════ */
function purchaseTicket() {
  showNotif('💳 Payment processed! Ticket confirmed.');
}

function selectPayment(el) {
  document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
}

/* ════════════════════════════════
   ACCOUNT TABS
════════════════════════════════ */
const ACCOUNT_TABS = ['tab-profile', 'tab-payment', 'tab-prefs', 'tab-security'];

function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ACCOUNT_TABS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === tabId) ? 'block' : 'none';
  });
}

/* ════════════════════════════════
   AUDIT LOG
════════════════════════════════ */
const AUDIT_ENTRIES = [
  { action: 'PAYMENT — TXN-8821 processed ₹42',     time: '23 Mar 14:32', color: 'var(--accent3)' },
  { action: 'LOGIN — User authenticated via 2FA',    time: '23 Mar 08:42', color: 'var(--accent)'  },
  { action: 'BOOKING — Journey JRN-4421 created',    time: '23 Mar 08:43', color: 'var(--accent)'  },
  { action: 'PAYMENT — TXN-8818 failed (declined)',  time: '23 Mar 11:15', color: 'var(--accent2)' },
  { action: 'REWARD — 18 eco-points credited',       time: '23 Mar 14:33', color: 'var(--accent3)' },
  { action: 'ADMIN — Fare policy updated Line 2',    time: '22 Mar 16:00', color: 'var(--accent4)' },
  { action: 'PAYMENT — TXN-8817 processed ₹18',     time: '22 Mar 12:20', color: 'var(--accent3)' },
  { action: 'LOGIN — Password changed successfully', time: '21 Mar 09:00', color: 'var(--accent4)' },
];

function renderAuditLog() {
  const list = document.getElementById('audit-list');
  if (!list) return;

  list.innerHTML = AUDIT_ENTRIES.map((e, i) => `
    <div class="audit-entry">
      <div class="audit-dot" style="background:${e.color}"></div>
      <div>
        <div class="audit-action">${e.action}</div>
        <div class="audit-time">${e.time} · REC-${1000 + i}</div>
      </div>
    </div>`).join('');
}

/* ════════════════════════════════
   NOTIFICATION TOAST
════════════════════════════════ */
function showNotif(msg) {
  const n = document.getElementById('notif');
  if (!n) return;
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3500);
}

/* ════════════════════════════════
   UTILITY
════════════════════════════════ */
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function initDateTime() {
  const el = document.getElementById('j-time');
  if (el) el.value = new Date().toISOString().slice(0, 16);
}

/* ════════════════════════════════
   BOOT
════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderTransactions();
  renderAuditLog();
  initDateTime();
});
