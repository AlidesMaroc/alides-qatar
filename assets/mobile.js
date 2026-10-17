/* Alides — mobile & accessibility layer (shared by qa.alides.org and fr.alides.org) */
(function () {
  'use strict';
  var FR = (document.documentElement.lang || '').toLowerCase().indexOf('fr') === 0;
  var T = FR
    ? { open: 'Ouvrir le menu', close: 'Fermer le menu', nav: 'Navigation', exp: 'Expertises', more: 'Afficher les ', cta: 'Échange confidentiel', call: 'Appeler', menu: 'Menu' }
    : { open: 'Open menu', close: 'Close menu', nav: 'Navigate', exp: 'Expertise', more: 'Show all ', cta: 'Request an introduction', call: 'Call', menu: 'Menu' };
  var phone = window.matchMedia('(max-width:760px)');
  var header = document.querySelector('header');
  var tel = document.querySelector('a[href^="tel:"]');
  var mail = document.querySelector('a[href^="mailto:"]');
  var onQatar = location.hostname.indexOf('qa.') === 0 || !!document.querySelector('.qa-mark');

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function addLink(parent, href, text, cls) {
    var a = el('a', { href: href }); a.textContent = text; if (cls) a.className = cls; parent.appendChild(a); return a;
  }

  /* ---------- 1. Mobile menu ---------- */
  var btn = header && header.querySelector('.burger');
  var panel = null, lastFocus = null;
  if (btn) {
    if (btn.tagName !== 'BUTTON') { // safety net if the markup was not updated
      var b = el('button', { type: 'button', 'class': 'burger' }, btn.innerHTML);
      btn.parentNode.replaceChild(b, btn); btn = b;
    }
    btn.setAttribute('aria-label', T.open);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'm-nav');

    panel = el('div', { id: 'm-nav', 'class': 'm-nav', role: 'dialog', 'aria-modal': 'true', 'aria-label': T.menu });
    var menuLinks = [].slice.call(header.querySelectorAll('.menu a'));
    var cta = null, seen = {};
    panel.appendChild(el('div', { 'class': 'm-group' }, T.nav));
    menuLinks.forEach(function (a) {
      if (a.classList.contains('cta') || a.classList.contains('req')) { cta = a; return; }
      seen[a.getAttribute('href')] = 1;
      addLink(panel, a.getAttribute('href'), a.textContent.trim());
    });
    if (onQatar) {
      if (!seen['/qatar/insights/'] && !seen['#insights']) addLink(panel, '/qatar/insights/', 'Insights');
      if (!seen['/qatar/about/']) addLink(panel, '/qatar/about/', 'The Partner');
      panel.appendChild(el('div', { 'class': 'm-group' }, T.exp));
      [['/qatar/executive-search-doha/', 'Executive Search in Qatar'],
       ['/qatar/board-advisory-qatar/', 'Board Advisory'],
       ['/qatar/ceo-succession-qatar/', 'CEO Succession'],
       ['/qatar/family-business-family-office-qatar/', 'Family Business & Family Office'],
       ['/qatar/qatarisation-leadership/', 'Qatarisation & Leadership'],
       ['/qatar/leadership-advisory-qatar/', 'Leadership Advisory']
      ].forEach(function (l) { if (location.pathname !== l[0]) addLink(panel, l[0], l[1], 'm-sub'); });
    }
    addLink(panel, cta ? cta.getAttribute('href') : (document.getElementById('contact') ? '#contact' : '/#contact'), T.cta, 'm-cta');
    if (tel || mail) {
      var c = el('div', { 'class': 'm-contact' });
      if (tel) addLink(c, tel.getAttribute('href'), tel.textContent.trim());
      if (mail) addLink(c, mail.getAttribute('href'), mail.textContent.trim());
      panel.appendChild(c);
    }
    document.body.appendChild(panel);

    var setOpen = function (open) {
      panel.classList.toggle('open', open);
      header.classList.toggle('m-open', open);
      document.body.classList.toggle('m-lock', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? T.close : T.open);
      if (open) { lastFocus = document.activeElement; var f = panel.querySelector('a'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 50); }
      else if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); }
      if (bar) bar.classList.remove('show');
    };
    btn.addEventListener('click', function () { setOpen(!panel.classList.contains('open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (!panel.classList.contains('open')) return;
      if (e.key === 'Escape') { setOpen(false); btn.focus(); }
      if (e.key === 'Tab') { // keep focus inside the menu
        var f = [btn].concat([].slice.call(panel.querySelectorAll('a'))), i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', function () {
      if (panel.classList.contains('open') && getComputedStyle(btn).display === 'none') setOpen(false);
    });
  }

  /* ---------- 2. Whole card clickable ---------- */
  var linkRe = /^(explore|read the (perspective|brief)|read more|discover|découvrir|lire la suite|en savoir plus)/i;
  [].forEach.call(document.querySelectorAll('main a, section a, article a'), function (a) {
    if (a.closest('header, footer, nav, .m-nav, form')) return;
    if (!linkRe.test((a.textContent || '').trim())) return;
    var card = a.parentElement;
    if (!card || !card.querySelector('h2, h3, h4')) return;
    if (card.querySelectorAll('a').length !== 1) return;
    card.classList.add('m-card'); a.classList.add('m-stretch');
  });

  /* ---------- 3. Contrast: gold text on light backgrounds becomes bronze ---------- */
  var GOLD = { 'rgb(198, 161, 87)': 1, 'rgb(216, 189, 131)': 1 };
  var cache = new WeakMap();
  function bgLight(node) { // true = light, false = dark/unknown (images, gradients)
    if (!node || node === document.documentElement) return true;
    if (cache.has(node)) return cache.get(node);
    var s = getComputedStyle(node), r;
    if (s.backgroundImage && s.backgroundImage !== 'none') r = false;
    else {
      var m = s.backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > 0.5)) {
        var L = m.slice(0, 3).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
        r = (0.2126 * L[0] + 0.7152 * L[1] + 0.0722 * L[2]) > 0.6;
      } else r = bgLight(node.parentElement);
    }
    cache.set(node, r); return r;
  }
  function fixContrast(root) {
    [].forEach.call((root || document.body).querySelectorAll('*'), function (n) {
      if (n.closest('header, .m-nav, .m-bar') || n.tagName === 'SCRIPT' || n.tagName === 'STYLE') return;
      var hasText = false;
      for (var i = 0; i < n.childNodes.length; i++) { var c = n.childNodes[i]; if (c.nodeType === 3 && c.textContent.trim()) { hasText = true; break; } }
      if (!hasText || !GOLD[getComputedStyle(n).color]) return;
      if (bgLight(n)) n.style.color = 'var(--bronze)';
    });
  }
  fixContrast();

  /* ---------- 4. Long lists: show the first items, then "Show all" (phones) ---------- */
  var LISTS = [['.singular .rhs', 3], ['.advise-grid', 3], ['.sit-grid', 4], ['.roles-grid', 4],
               ['.sit-list', 3], ['.dim-grid', 3], ['.out-grid', 3], ['.pf-list', 3]];
  if (phone.matches) {
    LISTS.forEach(function (cfg) {
      [].forEach.call(document.querySelectorAll(cfg[0]), function (box) {
        var items = [].filter.call(box.children, function (k) { return k.offsetHeight > 0; });
        if (items.length <= cfg[1] + 1) return;
        items.slice(cfg[1]).forEach(function (k) { k.classList.add('m-hide'); });
        box.classList.add('m-collapsed');
        var more = el('button', { type: 'button', 'class': 'm-more', 'aria-expanded': 'false' });
        more.textContent = T.more + items.length;
        more.addEventListener('click', function () {
          box.classList.remove('m-collapsed'); more.remove();
          var first = box.querySelector('.m-hide'); if (first) { first.setAttribute('tabindex', '-1'); first.focus({ preventScroll: true }); }
        });
        box.parentNode.insertBefore(more, box.nextSibling);
      });
    });
  }

  /* ---------- 5. Sticky contact bar (phones) ---------- */
  var bar = null;
  if (phone.matches && document.querySelector('footer')) {
    var contactHref = document.getElementById('contact') ? '#contact' : '/#contact';
    bar = el('div', { 'class': 'm-bar', role: 'region', 'aria-label': T.cta });
    addLink(bar, contactHref, T.cta, 'm-bar-cta');
    if (tel) {
      var t = addLink(bar, tel.getAttribute('href'), '', 'm-bar-tel');
      t.setAttribute('aria-label', T.call + ' ' + tel.textContent.trim());
      t.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 6.9 6.9l1.5-2.3L21 15.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>';
    }
    document.body.appendChild(bar);
    var blockers = [].slice.call(document.querySelectorAll('#contact, .cta-band, footer'));
    var visible = new Set();
    var update = function () {
      var show = window.scrollY > window.innerHeight * 0.8 && visible.size === 0 && !(panel && panel.classList.contains('open'));
      bar.classList.toggle('show', show);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
        update();
      });
      blockers.forEach(function (b) { io.observe(b); });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
})();
