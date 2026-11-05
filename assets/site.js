/* Битва ниндзя — логика главной страницы:
   языки RU/EN, кнопки магазинов, выбор ниндзя, телефон со скриншотами,
   счётчики, галерея с просмотром (Esc / стрелки / свайп), FAQ.
   Тексты: русские — прямо в index.html, английские — в блоке <script id="nb-data">. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var DATA = JSON.parse(document.getElementById('nb-data').textContent);
  var STORE = {
    gp: typeof GOOGLE_PLAY_URL === 'string' ? GOOGLE_PLAY_URL.trim() : '',
    as: typeof APP_STORE_URL === 'string' ? APP_STORE_URL.trim() : ''
  };
  var HEROES = DATA.heroes, SHOTS = DATA.shots, UI = DATA.ui;

  /* Русские тексты берём со страницы, английские — из DATA.en */
  var RU = { docTitle: document.title };
  $$('[data-i18n]').forEach(function (el) { RU[el.getAttribute('data-i18n')] = el.innerHTML; });
  var eachAttr = function (el, fn) {
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var i = pair.indexOf(':'); if (i > 0) fn(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    });
  };
  $$('[data-i18n-attr]').forEach(function (el) { eachAttr(el, function (a, k) { RU[k] = el.getAttribute(a); }); });
  var DICT = { ru: RU, en: DATA.en };
  var lang = 'ru';
  var tr = function (k) { var v = DICT[lang][k]; return v != null ? v : RU[k]; };
  var ui = function (k) { return UI[lang][k]; };

  /* ---------- Кнопки магазинов ---------- */
  function stores() {
    $$('[data-store]').forEach(function (a) {
      var id = a.getAttribute('data-store'), url = STORE[id], small = $('small', a);
      if (url) {
        a.href = url; a.rel = 'noopener'; a.classList.remove('soon'); a.removeAttribute('aria-disabled');
        small.textContent = ui(id === 'gp' ? 'gpGet' : 'asGet');
      } else {
        a.removeAttribute('href'); a.classList.add('soon'); a.setAttribute('aria-disabled', 'true');
        small.textContent = ui('soonTo');
      }
    });
  }

  /* ---------- Телефон: смена скриншотов ---------- */
  var phoneImgs = $$('.screen img'), dots = $$('.dots i');
  var phoneReady = false, pIdx = 0, phoneVisible = true;
  function phoneSrc() {
    phoneImgs.forEach(function (img, i) {
      if (i > 0 && !phoneReady) return;
      var n = img.getAttribute('data-phone');
      img.srcset = 'assets/shots/' + lang + '/' + n + '.jpg 720w, assets/shots/' + lang + '/md/' + n + '.jpg 1280w';
      img.src = 'assets/shots/' + lang + '/md/' + n + '.jpg';
    });
  }
  function phoneShow(i) {
    phoneImgs[pIdx].classList.remove('on'); if (dots[pIdx]) dots[pIdx].classList.remove('on');
    pIdx = i;
    phoneImgs[pIdx].classList.add('on'); if (dots[pIdx]) dots[pIdx].classList.add('on');
  }
  function phoneTick() {
    if (document.hidden || !phoneVisible || !phoneReady) return;
    var next = (pIdx + 1) % phoneImgs.length, im = phoneImgs[next];
    if (im.complete && im.naturalWidth) phoneShow(next);
  }
  if ('IntersectionObserver' in window && phoneImgs.length) {
    new IntersectionObserver(function (en) { phoneVisible = en[0].isIntersecting; }).observe($('.phone'));
  }

  /* ---------- Выбор ниндзя ---------- */
  var tabs = $$('.tab'), show = $('#show'), cur = 0;
  function renderHero(i, animate) {
    var h = HEROES[i], tx = h[lang];
    cur = i;
    tabs.forEach(function (b, j) {
      var on = j === i;
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      $('.tab-name', b).textContent = HEROES[j][lang].n;
    });
    show.setAttribute('aria-labelledby', tabs[i].id);
    show.style.setProperty('--c', h.c); show.style.setProperty('--c2', h.c2);
    var img = $('#showImg');
    var src = 'assets/heroes/' + h.id + '.png';
    if (img.getAttribute('src') !== src) img.setAttribute('src', src);
    img.alt = tx.n;
    $('#showName').textContent = tx.n;
    $('#showElem').textContent = tx.e;
    $('#showUlt').textContent = tx.u;
    $('#showUltText').textContent = tx.t;
    $('#showUltIco').setAttribute('src', 'assets/icons/' + h.ico + '.png');
    var names = [tr('stPow'), tr('stSpd'), tr('stDef')];
    $$('.bar', show).forEach(function (bar, k) {
      var v = h.st[k], segs = $$('i', bar);
      bar.setAttribute('aria-label', names[k] + ': ' + v + ' ' + ui('of') + ' 5');
      if (animate && !reduce.matches) {
        segs.forEach(function (s) { s.classList.remove('on'); });
        requestAnimationFrame(function () { requestAnimationFrame(function () { segs.forEach(function (s, n) { s.classList.toggle('on', n < v); }); }); });
      } else segs.forEach(function (s, n) { s.classList.toggle('on', n < v); });
    });
    var un = $('#showUnlock');
    var pill = function (ico, text) { return '<span class="pill"><img src="assets/icons/' + ico + '.png" alt="" width="28" height="28">' + text + '</span>'; };
    un.innerHTML = h.price
      ? pill('coin', h.price + ' ' + ui('coins')) + pill('lock', ui('after') + ' ' + h.lvl)
      : pill('check', ui('free'));
    if (animate && !reduce.matches && img.animate) {
      img.animate([{ opacity: 0, transform: 'translateY(24px) scale(.86)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,1.4,.4,1)' });
      $('.show-info').animate([{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' });
    }
  }
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { if (i !== cur) renderHero(i, true); });
    b.addEventListener('keydown', function (e) {
      var j = null, n = tabs.length;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (cur + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (cur - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j !== null) { e.preventDefault(); renderHero(j, true); tabs[j].focus(); }
    });
  });

  /* ---------- Счётчики 30 / 5 / 6 / 90 ---------- */
  var counters = $$('[data-count]');
  if (!reduce.matches && 'IntersectionObserver' in window) {
    counters.forEach(function (el) { el.textContent = '0'; });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, end = +el.getAttribute('data-count'), t0 = performance.now(), dur = 1300;
        var step = function (t) {
          var p = Math.min(1, (t - t0) / dur);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(step); else el.classList.add('pop');
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Галерея и просмотр ---------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  var lbOpen = false, lbIndex = 0, lbTrigger = null;
  var shotUrl = function (n, kind) { return 'assets/shots/' + lang + '/' + (kind ? kind + '/' : '') + n + '.jpg'; };
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  function showLb(i, dir) {
    var len = SHOTS.length;
    lbIndex = (i % len + len) % len;
    var n = SHOTS[lbIndex], wantLang = lang;
    lbImg.src = shotUrl(n, '');
    var full = new Image();
    full.onload = function () { if (lbOpen && SHOTS[lbIndex] === n && lang === wantLang) lbImg.src = full.src; };
    full.src = shotUrl(n, 'full');
    var cap = tr('c' + (lbIndex + 1));
    lbImg.alt = cap;
    lbCap.innerHTML = '<b>' + pad2(lbIndex + 1) + '</b><span>' + cap + '</span>';
    lbCount.textContent = (lbIndex + 1) + ' / ' + len;
    if (dir && !reduce.matches && lbImg.animate) {
      lbImg.animate([{ opacity: 0.2, transform: 'translateX(' + (dir * 46) + 'px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.2,1.2,.4,1)' });
    }
    [lbIndex + 1, lbIndex - 1].forEach(function (k) { var im = new Image(); im.src = shotUrl(SHOTS[(k % len + len) % len], 'full'); });
  }
  function openLb(i, trigger) {
    lbTrigger = trigger || null; lbOpen = true;
    showLb(i, 0);
    lb.classList.add('open'); lb.removeAttribute('aria-hidden');
    document.documentElement.classList.add('lb-lock');
    setTimeout(function () { $('#lbClose').focus(); }, 40);
  }
  function closeLb() {
    if (!lbOpen) return;
    lbOpen = false; lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('lb-lock');
    if (lbTrigger) lbTrigger.focus();
  }
  $$('.shot-btn').forEach(function (b, i) { b.addEventListener('click', function () { openLb(i, b); }); });
  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { showLb(lbIndex - 1, -1); });
  $('#lbNext').addEventListener('click', function () { showLb(lbIndex + 1, 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage') || e.target.classList.contains('lb-fig')) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lbOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); showLb(lbIndex - 1, -1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); showLb(lbIndex + 1, 1); }
    else if (e.key === 'Tab') {
      var f = $$('button', lb), first = f[0], lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      else if (!lb.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });
  var sx = 0, sy = 0, sid = null;
  lb.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') return; sid = e.pointerId; sx = e.clientX; sy = e.clientY; });
  lb.addEventListener('pointercancel', function () { sid = null; });
  lb.addEventListener('pointerup', function (e) {
    if (e.pointerId !== sid) return; sid = null;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) showLb(lbIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5) closeLb();
  });

  /* ---------- FAQ ---------- */
  $$('.qa .q').forEach(function (q) {
    q.addEventListener('click', function () {
      var qa = q.closest('.qa'), open = !qa.classList.contains('open');
      qa.classList.toggle('open', open); q.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Подсветка пункта меню ---------- */
  var links = $$('#nav a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) spy.observe(s); });
    var top = document.getElementById('top'); if (top) spy.observe(top);
  }

  /* ---------- Язык ---------- */
  function setLang(l, save) {
    lang = l === 'en' ? 'en' : 'ru';
    var d = DICT[lang], root = document.documentElement;
    root.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var v = d[el.getAttribute('data-i18n')]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-attr]').forEach(function (el) { eachAttr(el, function (a, k) { var v = d[k]; if (v != null) el.setAttribute(a, v); }); });
    document.title = d.docTitle || RU.docTitle;
    $$('img[data-logo]').forEach(function (img) { img.src = 'assets/img/logo-' + lang + '.png'; });
    $$('[data-pp]').forEach(function (a) { a.href = 'privacy-policy-' + lang + '.html'; });
    $$('img[data-shot]').forEach(function (img) { img.src = shotUrl(img.getAttribute('data-shot'), ''); });
    phoneSrc();
    $$('.lang').forEach(function (box) {
      box.setAttribute('data-active', lang);
      $$('button', box).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    });
    stores();
    renderHero(cur, false);
    if (lbOpen) showLb(lbIndex, 0); else { lbCap.innerHTML = ''; lbImg.removeAttribute('src'); lbImg.alt = ''; }
    if (save) {
      try { localStorage.setItem('lang', lang); } catch (e) { /* приватный режим */ }
      if (window.URL && window.history && history.replaceState) {
        var u = new URL(location.href);
        if (u.searchParams.has('lang')) { u.searchParams.set('lang', lang); history.replaceState(null, '', u.toString()); }
      }
    }
    root.classList.remove('i18n-wait');
  }
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { if (b.getAttribute('data-lang') !== lang) setLang(b.getAttribute('data-lang'), true); }); });

  var q = null; try { q = new URLSearchParams(location.search).get('lang'); } catch (e) { /* старый браузер */ }
  var saved = null; try { saved = localStorage.getItem('lang'); } catch (e) { /* приватный режим */ }
  var auto = /^(ru|ky|kk|uz|be|tg)/i.test(navigator.language || '') ? 'ru' : 'en';
  var fromUrl = q === 'en' || q === 'ru';
  setLang(fromUrl ? q : (saved === 'en' || saved === 'ru' ? saved : auto), fromUrl);

  window.addEventListener('load', function () {
    phoneReady = true; phoneSrc();
    HEROES.forEach(function (h) { var im = new Image(); im.src = 'assets/heroes/' + h.id + '.png'; });
    if (!reduce.matches && phoneImgs.length > 1) setInterval(phoneTick, 3600);
  });
})();
