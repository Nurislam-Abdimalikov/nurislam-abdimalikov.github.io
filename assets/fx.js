/* Битва ниндзя — общие эффекты для всех страниц:
   искры на фоне (canvas), меню-бургер, тень шапки, появление блоков.
   Анимация уважает «Уменьшить движение» и ставится на паузу, когда вкладка скрыта. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var onMq = function (mq, fn) { if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn); };

  /* --- Шапка: тень при прокрутке --- */
  var hdr = document.querySelector('.hdr');
  var onScroll = function () { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Меню-бургер (на телефоне) --- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var setOpen = function (open) {
      doc.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', function (e) { e.stopPropagation(); setOpen(!doc.classList.contains('nav-open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) { if (doc.classList.contains('nav-open') && !nav.contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.classList.contains('nav-open')) { setOpen(false); burger.focus(); }
    });
    if (window.matchMedia) onMq(window.matchMedia('(min-width: 1000px)'), function (m) { if (m.matches) setOpen(false); });
  }

  /* --- Появление блоков при прокрутке --- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* --- Искры и угольки на фоне --- */
  var cv = document.getElementById('fx');
  if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var COLORS = [[255, 211, 77], [240, 138, 36], [127, 214, 255], [188, 157, 255], [255, 154, 132]];
  var WEIGHTS = [0.34, 0.24, 0.2, 0.12, 0.1];
  var sprites = COLORS.map(function (c) {
    var s = document.createElement('canvas'); s.width = s.height = 64;
    var g = s.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    var rgb = c[0] + ',' + c[1] + ',' + c[2];
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.16, 'rgba(' + rgb + ',0.95)');
    gr.addColorStop(0.42, 'rgba(' + rgb + ',0.28)');
    gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return s;
  });
  var W = 0, H = 0, parts = [], raf = 0, last = 0, running = false, timer = 0;
  var pick = function () { var x = Math.random(), i = 0; while (i < WEIGHTS.length - 1 && (x -= WEIGHTS[i]) > 0) i++; return i; };
  var spawn = function (p, init) {
    p.x = Math.random() * W;
    p.y = init ? Math.random() * H : H + 20 + Math.random() * 60;
    p.s = 3 + Math.random() * 9;
    p.vy = 12 + Math.random() * 38;
    p.vx = (Math.random() - 0.5) * 14;
    p.a = 0.3 + Math.random() * 0.55;
    p.c = pick();
    p.ph = Math.random() * 6.283;
    p.f = 0.6 + Math.random() * 2.2;
    p.spark = Math.random() < 0.08;
    if (p.spark) { p.vy *= 3.4; p.vx = (Math.random() - 0.5) * 140; p.s = 3 + Math.random() * 3; }
    return p;
  };
  var draw = function (t, dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (dt) {
        p.y -= p.vy * dt;
        p.x += (p.vx + Math.sin(t / 1000 * p.f + p.ph) * 12) * dt;
        if (p.y < -40 || p.x < -60 || p.x > W + 60) spawn(p, false);
      }
      ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(t / 1000 * p.f * 2.4 + p.ph)) * (dt ? 1 : 0.6);
      if (p.spark) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.atan2(-p.vy, p.vx));
        ctx.drawImage(sprites[p.c], -p.s * 3.5, -p.s / 2, p.s * 7, p.s);
        ctx.restore();
      } else ctx.drawImage(sprites[p.c], p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };
  var loop = function (t) {
    raf = requestAnimationFrame(loop);
    var dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    draw(t, dt);
  };
  var start = function () {
    if (running || reduce.matches || document.hidden) return;
    running = true; last = performance.now(); raf = requestAnimationFrame(loop);
  };
  var stop = function () { running = false; cancelAnimationFrame(raf); };
  var resize = function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(90, Math.max(22, (W * H) / 15000)));
    while (parts.length < n) parts.push(spawn({}, true));
    parts.length = n;
    if (!running) draw(performance.now(), 0);
  };
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(resize, 150); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  onMq(reduce, function () { if (reduce.matches) { stop(); draw(performance.now(), 0); } else start(); });
  resize();
  start();
})();
