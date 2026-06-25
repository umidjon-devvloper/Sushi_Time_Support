import './style.css';
import { UI, FAQ, CONTACT, LANGS } from './content.js';

// ---- App state -------------------------------------------------------------
const state = {
  lang: detectLang(),
  category: 'all',
  query: '',
};

function detectLang() {
  const saved = localStorage.getItem('support_lang');
  if (saved && LANGS.includes(saved)) return saved;
  const nav = (navigator.language || 'tr').slice(0, 2);
  return LANGS.includes(nav) ? nav : 'tr';
}

// ---- Contact links ---------------------------------------------------------
const digits = (s) => s.replace(/[^\d]/g, '');
const links = {
  whatsapp: `https://wa.me/${digits(CONTACT.whatsapp)}`,
  phone: `tel:${digits(CONTACT.phone) ? '+' + digits(CONTACT.phone) : ''}`,
  email: `mailto:${CONTACT.email}`,
  telegram: `https://t.me/${CONTACT.telegram.replace('@', '')}`,
};

// ---- Render ----------------------------------------------------------------
const app = document.getElementById('app');

function render() {
  const t = UI[state.lang];
  document.documentElement.lang = state.lang;

  app.innerHTML = `
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="/">
          <span class="logo">🍣</span>
          <span>Sushi Time<small>${t.brandSub}</small></span>
        </a>
        <nav class="lang">
          ${LANGS.map((l) => `<button data-lang="${l}" class="${l === state.lang ? 'active' : ''}">${l.toUpperCase()}</button>`).join('')}
        </nav>
      </div>
    </header>

    <section class="hero">
      <div class="wrap">
        <span class="eyebrow">${t.eyebrow}</span>
        <h1>${t.heroTitle}</h1>
        <p>${t.heroSub}</p>
        <div class="search">
          <span class="icon">🔍</span>
          <input id="search" type="search" placeholder="${t.searchPlaceholder}" value="${escapeAttr(state.query)}" autocomplete="off" />
        </div>
      </div>
    </section>

    <main class="wrap">
      <section class="contact-grid">
        ${contactCard('💬', '#25D366', t.cWhatsApp, CONTACT.whatsapp, t.cWhatsAppHint, links.whatsapp, true)}
        ${contactCard('📞', 'var(--primary)', t.cPhone, CONTACT.phone, t.cPhoneHint, links.phone, false)}
        ${contactCard('✉️', 'var(--secondary)', t.cEmail, CONTACT.email, t.cEmailHint, links.email, false)}
        ${contactCard('✈️', '#229ED9', t.cTelegram, CONTACT.telegram, t.cTelegramHint, links.telegram, true)}
      </section>

      <section class="section">
        <h2>${t.faqTitle}</h2>
        <div class="sub">${t.faqSub}</div>
        <div class="faq-cats">
          ${faqCats(t)}
        </div>
        <div class="faq-list" id="faq-list">
          ${faqList(t)}
        </div>
      </section>

      <section class="section">
        <div class="info-grid">
          ${infoCard('🕙', t.infoHours, t.infoHoursVal)}
          ${infoCard('📍', t.infoArea, t.infoAreaVal)}
          ${infoCard('🚚', t.infoFree, t.infoFreeVal)}
        </div>
      </section>

      <section class="cta">
        <div>
          <h3>${t.ctaTitle}</h3>
          <p>${t.ctaSub}</p>
        </div>
        <a class="btn-primary" href="${links.whatsapp}" target="_blank" rel="noopener noreferrer">💬 ${t.ctaBtn}</a>
      </section>
    </main>

    <footer class="site-footer">
      <div class="wrap">
        <a class="brand" href="/">
          <span class="logo">🍣</span>
          <span>Sushi Time<small>${CONTACT.address}</small></span>
        </a>
        <div class="links">
          <a href="https://sushi-time-frontend.vercel.app/" target="_blank" rel="noopener">${t.fOrder}</a>
          <a href="https://sushi-time-frontend.vercel.app/menu" target="_blank" rel="noopener">${t.fMenu}</a>
          <a href="${links.telegram}" target="_blank" rel="noopener">${t.cTelegram}</a>
        </div>
        <small style="color:rgba(255,255,255,.55)">© ${YEAR} Sushi Time · ${t.footerRights}</small>
      </div>
    </footer>
  `;

  bindEvents();
}

// Build year without Date in the module top-level (kept simple/static-friendly).
const YEAR = new Date().getFullYear();

function contactCard(icon, color, label, value, hint, href, blank) {
  return `
    <a class="contact-card" href="${href}" ${blank ? 'target="_blank" rel="noopener noreferrer"' : ''}>
      <span class="ic" style="background:${color}">${icon}</span>
      <span class="label">${label}</span>
      <span class="value">${value}</span>
      <span class="hint">${hint}</span>
    </a>`;
}

function infoCard(icon, title, value) {
  return `
    <div class="info-card">
      <div class="ic">${icon}</div>
      <h3>${title}</h3>
      <p>${value}</p>
    </div>`;
}

function faqCats(t) {
  const cats = [
    ['all', t.catAll], ['orders', t.catOrders], ['delivery', t.catDelivery],
    ['payment', t.catPayment], ['account', t.catAccount],
  ];
  return cats
    .map(([key, lbl]) => `<button data-cat="${key}" class="${key === state.category ? 'active' : ''}">${lbl}</button>`)
    .join('');
}

function faqList(t) {
  const q = state.query.trim().toLowerCase();
  const items = FAQ.filter((item) => {
    const inCat = state.category === 'all' || item.cat === state.category;
    if (!inCat) return false;
    if (!q) return true;
    const blob = `${item[state.lang].q} ${item[state.lang].a}`.toLowerCase();
    return blob.includes(q);
  });

  if (!items.length) return `<div class="faq-empty">${t.noResults}</div>`;

  return items
    .map((item, i) => {
      const { q: question, a: answer } = item[state.lang];
      return `
        <div class="faq-item" data-idx="${i}">
          <button class="faq-q">
            <span>${question}</span>
            <span class="chev">⌄</span>
          </button>
          <div class="faq-a">${answer}</div>
        </div>`;
    })
    .join('');
}

// ---- Events ----------------------------------------------------------------
function bindEvents() {
  app.querySelectorAll('[data-lang]').forEach((b) =>
    b.addEventListener('click', () => {
      state.lang = b.dataset.lang;
      localStorage.setItem('support_lang', state.lang);
      render();
    })
  );

  app.querySelectorAll('[data-cat]').forEach((b) =>
    b.addEventListener('click', () => {
      state.category = b.dataset.cat;
      renderFaqOnly();
    })
  );

  const search = app.querySelector('#search');
  if (search) {
    search.addEventListener('input', (e) => {
      state.query = e.target.value;
      renderFaqOnly();
    });
    // keep focus + caret after a partial re-render
    search.addEventListener('blur', () => {}, { once: true });
  }

  bindFaqToggle();
}

// Re-render just the FAQ section so the search box keeps focus/caret.
function renderFaqOnly() {
  const t = UI[state.lang];
  const cats = app.querySelector('.faq-cats');
  const list = app.querySelector('#faq-list');
  if (cats) cats.innerHTML = faqCats(t);
  if (list) list.innerHTML = faqList(t);
  cats?.querySelectorAll('[data-cat]').forEach((b) =>
    b.addEventListener('click', () => {
      state.category = b.dataset.cat;
      renderFaqOnly();
    })
  );
  bindFaqToggle();
}

function bindFaqToggle() {
  app.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      app.querySelectorAll('.faq-item.open').forEach((o) => o.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

// ---- Utils -----------------------------------------------------------------
function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

render();
