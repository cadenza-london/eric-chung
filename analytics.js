/* Cadenza London Music Academy: Google Analytics 4 with consent.
   - Loads on the live site only (cadenza-london.com), so previews don't count.
   - Consent Mode v2: analytics cookies stay off until the visitor taps Accept.
   - window.cadTrack(name, params) sends a conversion event from any page. */
(function () {
  var GA_ID = 'G-GF23CY7JQ1';
  var KEY = 'cadenza_cookie_consent';
  var LIVE = /(^|\.)cadenza-london\.com$/.test(location.hostname);

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var choice = getChoice();
  gtag('consent', 'default', {
    analytics_storage: choice === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'url_passthrough', false);
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  if (LIVE) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  window.cadTrack = function (name, params) {
    try { gtag('event', name, params || {}); } catch (e) {}
  };

  /* ---- click tracking for the actions that matter ---- */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var where = location.pathname;
    if (/(^|\/)booking\/?($|[?#])/.test(h) && !/\/booking\/?$/.test(where)) cadTrack('book_trial_click', { from_page: where });
    else if (/tr\.ee\/NGytIgMnOt/.test(h)) cadTrack('consultation_click', { from_page: where });
    else if (/^mailto:/i.test(h)) cadTrack('contact_click', { method: 'email', from_page: where });
    else if (/^tel:/i.test(h)) cadTrack('contact_click', { method: 'phone', from_page: where });
    else if (/wa\.me|whatsapp/i.test(h)) cadTrack('contact_click', { method: 'whatsapp', from_page: where });
    else if (/checkout\.stripe\.com|buy\.stripe\.com/.test(h)) cadTrack('begin_checkout', { from_page: where });
  }, true);

  /* ---- consent banner ---- */
  if (choice === 'granted' || choice === 'denied') return;

  function decide(v) {
    setChoice(v);
    gtag('consent', 'update', { analytics_storage: v });
    var b = document.getElementById('cad-consent');
    if (b) { b.classList.add('cad-hide'); setTimeout(function () { b.remove(); }, 260); }
  }

  function showBanner() {
    if (document.getElementById('cad-consent')) return;
    var css = document.createElement('style');
    css.textContent =
      '#cad-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483000;max-width:440px;margin:0 auto;' +
      'background:#FFFDF8;color:#4A4038;border:1px solid rgba(201,168,76,.45);border-radius:14px;' +
      'box-shadow:0 10px 34px rgba(90,70,40,.18);padding:16px 18px 14px;font:400 14px/1.55 Jost,system-ui,-apple-system,sans-serif;' +
      'transition:opacity .24s ease,transform .24s ease;transform:translateY(0);opacity:1}' +
      '#cad-consent.cad-hide{opacity:0;transform:translateY(12px)}' +
      '#cad-consent p{margin:0 0 12px}' +
      '#cad-consent b{color:#2E2620;font-weight:500}' +
      '#cad-consent .cad-row{display:flex;gap:8px}' +
      '#cad-consent button{flex:1;min-height:44px;border-radius:999px;font:500 13px/1 Jost,system-ui,sans-serif;letter-spacing:.06em;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}' +
      '#cad-consent .cad-yes{background:#C9A84C;color:#fff;border:1px solid #C9A84C}' +
      '#cad-consent .cad-no{background:transparent;color:#8A6D24;border:1px solid rgba(201,168,76,.6)}' +
      '#cad-consent button:active{transform:scale(.97)}' +
      '@media (max-width:600px){#cad-consent{bottom:calc(16px + env(safe-area-inset-bottom))}#cad-consent.cad-lift{bottom:calc(88px + env(safe-area-inset-bottom))}}' +
      '@media (prefers-reduced-motion:reduce){#cad-consent{transition:none}}';
    document.head.appendChild(css);
    var b = document.createElement('div');
    b.id = 'cad-consent';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie choice');
    if (document.querySelector('.sticky-cta')) b.classList.add('cad-lift');
    b.innerHTML =
      '<p><b>Cookies</b> · We use analytics cookies to see which pages help families find us. No ads, and nothing is sold. Is that OK?</p>' +
      '<div class="cad-row"><button type="button" class="cad-no">No thanks</button><button type="button" class="cad-yes">Accept</button></div>';
    b.querySelector('.cad-yes').addEventListener('click', function () { decide('granted'); });
    b.querySelector('.cad-no').addEventListener('click', function () { decide('denied'); });
    document.body.appendChild(b);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(showBanner, 900); });
  else setTimeout(showBanner, 900);
})();
