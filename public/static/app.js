/* ============================================
   이음치과의원 — REVOLUTIONARY INTERACTIVE v3
   Counter animations, immersive scroll,
   3D cards, magnetic cursor, parallax cinema
   ============================================ */
(function () {
  'use strict';

  function lerp(a, b, n) { return a + (b - a) * n; }

  // === INIT ON LOAD ===
  window.addEventListener('DOMContentLoaded', function () { initAll(); });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAll, 0);
  }

  var _inited = false;
  function initAll() {
    if (_inited) return;
    _inited = true;
    initSmoothScroll();
    initCursor();
    initMenu();
    initParallaxHero();
    initScrollReveals();
    initManifesto();
    initHorizontalScroll();
    init3DCards();
    initMagneticElements();
    initTextMask();
    initGalleryParallax();
    initFloatingCall();
    initNavTime();
    initNavScrollProgress();
    initSmoothLinks();
    initImageBreakParallax();
    initSectionIndicator();
    initCounterAnimation();
  }

  // === SMOOTH SCROLL ===
  var smoothScrollY = 0;
  var targetScrollY = 0;
  var scrollSpeed = 0;

  function initSmoothScroll() {
    var lastScroll = window.scrollY;
    window.addEventListener('scroll', function () {
      targetScrollY = window.scrollY;
      scrollSpeed = targetScrollY - lastScroll;
      lastScroll = targetScrollY;
    }, { passive: true });

    function smoothLoop() {
      smoothScrollY = lerp(smoothScrollY, targetScrollY, 0.1);
      requestAnimationFrame(smoothLoop);
    }
    smoothLoop();
  }

  // === CUSTOM CURSOR ===
  function initCursor() {
    if (window.innerWidth < 1025) return;

    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    var mx = 0, my = 0, fx = 0, fy = 0;
    var targetScale = 1, cursorScale = 1;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function followLoop() {
      fx = lerp(fx, mx, 0.15);
      fy = lerp(fy, my, 0.15);
      cursorScale = lerp(cursorScale, targetScale, 0.12);

      cursor.style.transform = 'translate(-50%, -50%) translate(' + mx + 'px,' + my + 'px)';
      follower.style.transform = 'translate(-50%, -50%) translate(' + fx + 'px,' + fy + 'px) scale(' + cursorScale + ')';
      requestAnimationFrame(followLoop);
    }
    followLoop();

    // Hover states
    document.querySelectorAll('[data-hover]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        follower.classList.add('hover');
        targetScale = 2;
      });
      el.addEventListener('mouseleave', function () {
        follower.classList.remove('hover', 'text-mode');
        follower.innerHTML = '';
        targetScale = 1;
      });
    });

    document.querySelectorAll('a, button').forEach(function (el) {
      if (el.hasAttribute('data-hover')) return;
      el.addEventListener('mouseenter', function () {
        targetScale = 1.5;
        follower.classList.add('link-hover');
      });
      el.addEventListener('mouseleave', function () {
        targetScale = 1;
        follower.classList.remove('link-hover');
      });
    });

    // Drag cursor
    document.querySelectorAll('.horizontal-wrap').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        follower.classList.add('drag-mode');
        follower.innerHTML = '<span class="cursor-label">DRAG</span>';
        targetScale = 2.5;
      });
      el.addEventListener('mouseleave', function () {
        follower.classList.remove('drag-mode');
        follower.innerHTML = '';
        targetScale = 1;
      });
    });

    // View cursor for images
    document.querySelectorAll('.gallery-item, .director-frame, .image-break').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        follower.classList.add('text-mode');
        follower.innerHTML = '<span class="cursor-label">VIEW</span>';
        targetScale = 2.5;
      });
      el.addEventListener('mouseleave', function () {
        follower.classList.remove('text-mode');
        follower.innerHTML = '';
        targetScale = 1;
      });
    });
  }

  // === FULL SCREEN MENU ===
  function initMenu() {
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('fullMenu');
    if (!btn || !menu) return;
    var isOpen = false;

    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'fullMenu');
    menu.setAttribute('aria-hidden', 'true');

    btn.addEventListener('click', function () {
      isOpen = !isOpen;
      if (isOpen) {
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        btn.querySelector('span').textContent = 'CLOSE';
        btn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        // Focus first link for keyboard navigation
        var firstLink = menu.querySelector('.menu-link');
        if (firstLink) setTimeout(function() { firstLink.focus(); }, 400);
      } else {
        closeMenu();
      }
    });

    menu.querySelectorAll('.menu-link').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(); });
    });

    function closeMenu() {
      isOpen = false;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      btn.querySelector('span').textContent = 'MENU';
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      btn.focus();
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  }

  // === HERO: 3D Mesh Gradient ===
  function initParallaxHero() {
    var mesh = document.getElementById('heroMesh');
    var heroContent = document.querySelector('.hero-content');
    var hero = document.querySelector('.hero');
    if (!mesh || !hero) return;

    // Mouse parallax
    if (window.innerWidth > 768) {
      var mx = 0, my = 0, cx = 0, cy = 0;

      hero.addEventListener('mousemove', function(e) {
        var rect = hero.getBoundingClientRect();
        mx = (e.clientX - rect.left) / rect.width - 0.5;
        my = (e.clientY - rect.top) / rect.height - 0.5;
      });

      hero.addEventListener('mouseleave', function() {
        mx = 0; my = 0;
      });

      (function meshLoop() {
        cx = lerp(cx, mx, 0.025);
        cy = lerp(cy, my, 0.025);
        mesh.style.transform = 'translate(' + (cx * -25) + 'px,' + (cy * -18) + 'px)';
        if (heroContent) {
          heroContent.style.marginLeft = (cx * 8) + 'px';
        }
        requestAnimationFrame(meshLoop);
      })();
    }

    // Scroll fade
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var heroH = hero.offsetHeight;
      if (scrolled > heroH) return;
      var progress = scrolled / heroH;
      mesh.style.opacity = Math.max(0.1, 0.6 - progress * 0.5);
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - progress * 1.5);
      }
    }, { passive: true });
  }

  // === COUNTER ANIMATION ===
  function initCounterAnimation() {
    var statNums = document.querySelectorAll('.hero-stat-num');
    if (statNums.length === 0) return;

    var animated = false;

    function animateCounters() {
      if (animated) return;
      animated = true;

      statNums.forEach(function (el) {
        var target = el.getAttribute('data-count');
        var isFloat = target.indexOf('.') > -1;
        var targetNum = parseFloat(target);
        var duration = 2000;
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          var ease = 1 - Math.pow(1 - progress, 3);
          var current = targetNum * ease;

          if (isFloat) {
            el.textContent = current.toFixed(1);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            if (isFloat) {
              el.textContent = targetNum.toFixed(1);
            } else {
              el.textContent = Math.floor(targetNum).toLocaleString();
            }
          }
        }
        requestAnimationFrame(step);
      });
    }

    // Trigger when hero stats become visible
    var statsEl = document.querySelector('.hero-stats');
    if (statsEl) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(statsEl);
    }
  }

  // === SCROLL REVEALS ===
  function initScrollReveals() {
    var elements = document.querySelectorAll('[data-reveal]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var parent = entry.target.parentElement;
          var siblings = parent.querySelectorAll('[data-reveal]');
          var idx = Array.from(siblings).indexOf(entry.target);
          entry.target.style.transitionDelay = (idx * 0.1) + 's';
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

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
    var wrap = track.parentElement;
    var isDragging = false;
    var startX = 0;
    var scrollLeft = 0;
    var velocity = 0;
    var lastX = 0;
    var momentum = null;

    wrap.style.overflowX = 'auto';
    wrap.style.scrollbarWidth = 'none';
    wrap.style.msOverflowStyle = 'none';

    track.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;
      scrollLeft = wrap.scrollLeft;
      lastX = e.pageX;
      velocity = 0;
      if (momentum) cancelAnimationFrame(momentum);
      track.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = '';
      function decelerate() {
        if (Math.abs(velocity) < 0.5) return;
        velocity *= 0.95;
        wrap.scrollLeft -= velocity;
        momentum = requestAnimationFrame(decelerate);
      }
      decelerate();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      e.preventDefault();
      velocity = e.pageX - lastX;
      lastX = e.pageX;
      var x = e.pageX - startX;
      wrap.scrollLeft = scrollLeft - x;
    });

    section.addEventListener('wheel', function (e) {
      var maxScroll = wrap.scrollWidth - wrap.clientWidth;
      if (maxScroll <= 0) return;
      var atStart = wrap.scrollLeft <= 0;
      var atEnd = wrap.scrollLeft >= maxScroll - 2;

      if (e.deltaY > 0 && !atEnd) {
        e.preventDefault();
        wrap.scrollLeft += Math.abs(e.deltaY) * 2;
      } else if (e.deltaY < 0 && !atStart) {
        e.preventDefault();
        wrap.scrollLeft += e.deltaY * 2;
      }
    }, { passive: false });

    // Touch
    var touchStartX = 0, touchScrollLeft = 0;
    wrap.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = wrap.scrollLeft;
    }, { passive: true });

    wrap.addEventListener('touchmove', function (e) {
      var x = e.touches[0].pageX - touchStartX;
      wrap.scrollLeft = touchScrollLeft - x;
    }, { passive: true });
  }

  // === 3D CARD TILT ===
  function init3DCards() {
    if (window.innerWidth < 1025) return;

    document.querySelectorAll('.h-card:not(.h-card-intro), .philosophy-card, .equip-item, .promise-item').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateX = (y - 0.5) * -8;
        var rotateY = (x - 0.5) * 8;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        card.style.transition = 'transform 0.1s ease';

        var shine = card.querySelector('.card-shine');
        if (!shine) {
          shine = document.createElement('div');
          shine.className = 'card-shine';
          card.appendChild(shine);
        }
        shine.style.background = 'radial-gradient(circle at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(110,159,212,0.06), transparent 60%)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        var shine = card.querySelector('.card-shine');
        if (shine) shine.style.background = 'transparent';
      });
    });
  }

  // === MAGNETIC ELEMENTS ===
  function initMagneticElements() {
    if (window.innerWidth < 1025) return;

    document.querySelectorAll('.nav-menu-btn, .map-btn, .floating-call').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.3;
        var dy = (e.clientY - cy) * 0.3;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
      el.addEventListener('mouseenter', function () {
        el.style.transition = 'transform 0.15s ease';
      });
    });
  }

  // === TEXT MASK ===
  function initTextMask() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var titles = document.querySelectorAll('.title-word');
      titles.forEach(function (title, i) {
        if (scrolled < hero.offsetHeight) {
          title.style.letterSpacing = (scrolled * 0.005) + 'em';
        }
      });
    }, { passive: true });
  }

  // === GALLERY PARALLAX ===
  function initGalleryParallax() {
    var strip = document.querySelector('.gallery-strip');
    if (!strip) return;

    var track = strip.querySelector('.gallery-track');
    var baseSpeed = parseFloat(getComputedStyle(track).animationDuration) || 40;

    window.addEventListener('scroll', function () {
      var newDuration = Math.max(15, baseSpeed - Math.abs(scrollSpeed) * 0.5);
      track.style.animationDuration = newDuration + 's';
    }, { passive: true });
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

  // === NAV SCROLL PROGRESS ===
  function initNavScrollProgress() {
    var nav = document.getElementById('nav');
    var progressBar = document.getElementById('navProgress');
    if (!nav) return;

    // Create progress bar if not in HTML
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'nav-progress';
      progressBar.id = 'navProgress';
      nav.appendChild(progressBar);
    }

    window.addEventListener('scroll', function () {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (window.scrollY / docHeight) * 100;
      progressBar.style.width = progress + '%';

      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // === SMOOTH LINKS ===
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

  // === IMAGE BREAK PARALLAX ===
  function initImageBreakParallax() {
    var imageBreak = document.querySelector('.image-break');
    if (!imageBreak) return;
    var img = imageBreak.querySelector('img');
    if (!img) return;

    window.addEventListener('scroll', function () {
      var rect = imageBreak.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      img.style.transform = 'translateY(' + ((progress - 0.5) * -60) + 'px) scale(1.1)';
    }, { passive: true });
  }

  // === SECTION INDICATOR ===
  function initSectionIndicator() {
    var sections = document.querySelectorAll('.section[id]');
    if (sections.length === 0) return;

    var indicator = document.createElement('div');
    indicator.className = 'section-indicator';
    var dots = [];

    sections.forEach(function (section) {
      var dot = document.createElement('div');
      dot.className = 'indicator-dot';
      dot.addEventListener('click', function () {
        section.scrollIntoView({ behavior: 'smooth' });
      });
      indicator.appendChild(dot);
      dots.push(dot);
    });

    document.body.appendChild(indicator);

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = Array.from(sections).indexOf(entry.target);
          dots.forEach(function (d, i) {
            d.classList.toggle('active', i === idx);
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

})();
