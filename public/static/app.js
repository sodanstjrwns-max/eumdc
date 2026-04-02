/* ============================================
   이음치과의원 — Radical Interactive Scripts
   Custom cursor, horizontal scroll, reveals
   ============================================ */
(function () {
  'use strict';

  // === LOADER ===
  var counter = document.getElementById('loaderCounter');
  var fill = document.getElementById('loaderFill');
  var loader = document.getElementById('loader');
  var count = 0;

  function animateLoader() {
    if (count <= 100) {
      counter.textContent = count;
      fill.style.width = count + '%';
      count += Math.ceil(Math.random() * 4);
      if (count > 100) count = 100;
      requestAnimationFrame(function () {
        setTimeout(animateLoader, 15);
      });
    } else {
      counter.textContent = '100';
      fill.style.width = '100%';
      setTimeout(function () {
        loader.classList.add('done');
        initAll();
      }, 400);
    }
  }

  window.addEventListener('load', function () {
    setTimeout(animateLoader, 200);
  });

  // Fallback
  setTimeout(function () {
    if (!loader.classList.contains('done')) {
      counter.textContent = '100';
      fill.style.width = '100%';
      loader.classList.add('done');
      initAll();
    }
  }, 4000);

  function initAll() {
    initCursor();
    initMenu();
    initScrollReveals();
    initManifesto();
    initHorizontalScroll();
    initFloatingCall();
    initNavTime();
    initSmoothLinks();
  }

  // === CUSTOM CURSOR ===
  function initCursor() {
    if (window.innerWidth < 1025) return;

    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursorFollower');
    var mx = 0, my = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });

    function followLoop() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(followLoop);
    }
    followLoop();

    // Hover states
    document.querySelectorAll('[data-hover], a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        follower.classList.remove('hover');
      });
    });
  }

  // === FULL SCREEN MENU ===
  function initMenu() {
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('fullMenu');
    var isOpen = false;

    btn.addEventListener('click', function () {
      isOpen = !isOpen;
      if (isOpen) {
        menu.classList.add('open');
        btn.querySelector('span').textContent = 'CLOSE';
        document.body.style.overflow = 'hidden';
      } else {
        closeMenu();
      }
    });

    menu.querySelectorAll('.menu-link').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    function closeMenu() {
      isOpen = false;
      menu.classList.remove('open');
      btn.querySelector('span').textContent = 'MENU';
      document.body.style.overflow = '';
    }
  }

  // === SCROLL REVEALS (Intersection Observer) ===
  function initScrollReveals() {
    var elements = document.querySelectorAll('[data-reveal]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // === MANIFESTO TEXT REVEAL ===
  function initManifesto() {
    var lines = document.querySelectorAll('.reveal-text');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' });

    lines.forEach(function (line) { observer.observe(line); });
  }

  // === HORIZONTAL SCROLL ===
  function initHorizontalScroll() {
    var track = document.getElementById('horizontalTrack');
    if (!track) return;

    var section = track.closest('.services-horizontal');
    var isDragging = false;
    var startX = 0;
    var scrollLeft = 0;

    // Mouse drag
    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.parentElement.scrollLeft;
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
      track.style.cursor = '';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.5;
      track.parentElement.scrollLeft = scrollLeft - walk;
    });

    // Make horizontal-wrap scrollable
    var wrap = track.parentElement;
    wrap.style.overflowX = 'auto';
    wrap.style.scrollbarWidth = 'none';
    wrap.style.msOverflowStyle = 'none';

    // Wheel -> horizontal scroll
    section.addEventListener('wheel', function (e) {
      var maxScroll = wrap.scrollWidth - wrap.clientWidth;
      if (maxScroll <= 0) return;

      var atStart = wrap.scrollLeft <= 0;
      var atEnd = wrap.scrollLeft >= maxScroll - 2;

      if (e.deltaY > 0 && !atEnd) {
        e.preventDefault();
        wrap.scrollLeft += e.deltaY * 1.2;
      } else if (e.deltaY < 0 && !atStart) {
        e.preventDefault();
        wrap.scrollLeft += e.deltaY * 1.2;
      }
    }, { passive: false });
  }

  // === FLOATING CALL ===
  function initFloatingCall() {
    var btn = document.getElementById('floatingCall');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // === NAV TIME ===
  function initNavTime() {
    var el = document.getElementById('navTime');
    if (!el) return;

    function update() {
      var now = new Date();
      var h = String(now.getHours()).padStart(2, '0');
      var m = String(now.getMinutes()).padStart(2, '0');
      var s = String(now.getSeconds()).padStart(2, '0');
      el.textContent = 'BUSAN ' + h + ':' + m + ':' + s;
    }
    update();
    setInterval(update, 1000);
  }

  // === SMOOTH SCROLL FOR LINKS ===
  function initSmoothLinks() {
    document.querySelectorAll('a[href^="#section-"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

})();
