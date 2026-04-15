/* ============================================
   이음치과의원 — IMMERSIVE INTERACTIVE v4
   ─────────────────────────────────────────
   ★ Micro-interactions (ripple, magnetic 3D,
     glass-light tracking, click feedback,
     button spring, scroll-velocity skew)
   ★ Scroll animations (parallax layers,
     smooth reveals, velocity blur, section
     transition morph, text split reveal)
   ★ Enhanced UX (scroll indicator, progress
     ring, section snap hints, smooth anchors)
   ============================================ */
(function () {
  'use strict';

  /* ── Utility ── */
  function lerp(a, b, n) { return a + (b - a) * n; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function mapRange(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
  }

  /* ── INIT ── */
  window.addEventListener('DOMContentLoaded', function () { initAll(); });
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAll, 0);
  }

  var _inited = false;
  function initAll() {
    if (_inited) return;
    _inited = true;

    initScrollTracker();
    initCursor();
    initMenu();
    initParallaxHero();
    initScrollReveals();
    initManifesto();
    initHorizontalScroll();
    init3DCards();
    initMagneticElements();
    initTextMask();
    initFloatingCall();
    initNavScrollProgress();
    initSmoothLinks();
    initImageBreakParallax();
    initSectionIndicator();
    initCounterAnimation();

    /* ★ NEW v4 SYSTEMS ★ */
    initButtonRipple();
    initGlassLightTracker();
    initScrollVelocitySkew();
    initSectionTransitions();
    initHoverSpring();
    initClickFeedback();
    initTextRevealOnScroll();
    initParallaxLayers();
    initScrollDirectionIndicator();
    initCardEntrance();
  }

  /* ═══════════════════════════════════════════
     SCROLL TRACKER — velocity, direction, %
     ═══════════════════════════════════════════ */
  var scroll = { y: 0, target: 0, velocity: 0, direction: 1, progress: 0 };
  var lastScrollTime = 0;

  function initScrollTracker() {
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var now = performance.now();
      var dt = Math.max(now - lastScrollTime, 1);
      lastScrollTime = now;

      scroll.target = window.scrollY;
      scroll.y = scroll.target;
      scroll.velocity = (scroll.target - lastY) / dt * 16; // normalize to ~60fps
      scroll.direction = scroll.target > lastY ? 1 : -1;
      scroll.progress = scroll.target / (document.documentElement.scrollHeight - window.innerHeight);
      lastY = scroll.target;
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     CUSTOM CURSOR — Enhanced with blur trail
     ═══════════════════════════════════════════ */
  function initCursor() {
    if (window.innerWidth < 1025) return;

    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    var mx = 0, my = 0, fx = 0, fy = 0;
    var targetScale = 1, cursorScale = 1;
    var cursorVx = 0, cursorVy = 0;
    var prevMx = 0, prevMy = 0;

    document.addEventListener('mousemove', function (e) {
      prevMx = mx; prevMy = my;
      mx = e.clientX;
      my = e.clientY;
      cursorVx = mx - prevMx;
      cursorVy = my - prevMy;
    });

    function followLoop() {
      fx = lerp(fx, mx, 0.12);
      fy = lerp(fy, my, 0.12);
      cursorScale = lerp(cursorScale, targetScale, 0.1);

      // Velocity-based stretch for cursor
      var speed = Math.sqrt(cursorVx * cursorVx + cursorVy * cursorVy);
      var stretch = clamp(speed * 0.008, 0, 0.3);
      var angle = Math.atan2(cursorVy, cursorVx) * 180 / Math.PI;

      cursor.style.transform = 'translate(-50%, -50%) translate(' + mx + 'px,' + my + 'px) rotate(' + angle + 'deg) scaleX(' + (1 + stretch) + ') scaleY(' + (1 - stretch * 0.5) + ')';
      follower.style.transform = 'translate(-50%, -50%) translate(' + fx + 'px,' + fy + 'px) scale(' + cursorScale + ')';

      // Fade velocity smoothly
      cursorVx *= 0.9;
      cursorVy *= 0.9;
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

  /* ═══════════════════════════════════════════
     FULL SCREEN MENU
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     HERO: 3D Mesh Gradient + Mouse Parallax
     ═══════════════════════════════════════════ */
  function initParallaxHero() {
    var mesh = document.getElementById('heroMesh');
    var heroContent = document.querySelector('.hero-content');
    var hero = document.querySelector('.hero');
    if (!mesh || !hero) return;

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

  /* ═══════════════════════════════════════════
     COUNTER ANIMATION — Elastic easing
     ═══════════════════════════════════════════ */
  function initCounterAnimation() {
    var statNums = document.querySelectorAll('.hero-stat-num');
    if (statNums.length === 0) return;

    var animated = false;

    function animateCounters() {
      if (animated) return;
      animated = true;

      statNums.forEach(function (el, index) {
        var target = el.getAttribute('data-count');
        var isFloat = target.indexOf('.') > -1;
        var targetNum = parseFloat(target);
        var duration = 2500 + index * 300; // stagger duration
        var startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var progress = Math.min(elapsed / duration, 1);
          // Elastic ease out for more punch
          var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress) * Math.cos((progress * 10 - 0.75) * (2 * Math.PI / 3));
          ease = clamp(ease, 0, 1);
          var current = targetNum * ease;

          if (isFloat) {
            el.textContent = current.toFixed(1);
          } else {
            el.textContent = Math.floor(current).toLocaleString();
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = isFloat ? targetNum.toFixed(1) : Math.floor(targetNum).toLocaleString();
            // Pop animation on complete
            el.style.transform = 'scale(1.15)';
            el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(function() {
              el.style.transform = 'scale(1)';
            }, 300);
          }
        }
        // Stagger start
        setTimeout(function() {
          requestAnimationFrame(step);
        }, index * 200);
      });
    }

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

  /* ═══════════════════════════════════════════
     SCROLL REVEALS (Fallback for non-GSAP pages)
     ═══════════════════════════════════════════ */
  function initScrollReveals() {
    setTimeout(function() {
      if (document.body.classList.contains('gsap-active')) return;
      _initScrollRevealsCore();
    }, 300);
  }

  function _initScrollRevealsCore() {
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

  /* ═══════════════════════════════════════════
     MANIFESTO TEXT REVEAL
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     HORIZONTAL SCROLL — Smooth momentum
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     3D CARD TILT — Enhanced with light + depth
     ═══════════════════════════════════════════ */
  function init3DCards() {
    if (window.innerWidth < 1025) return;

    document.querySelectorAll('.h-card:not(.h-card-intro), .philosophy-card, .equip-item, .promise-item, .pillar-card').forEach(function (card) {
      var cardShine = null;

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotateX = (y - 0.5) * -10;
        var rotateY = (x - 0.5) * 10;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px) scale(1.02)';
        card.style.transition = 'transform 0.1s ease';

        // Dynamic light reflection
        if (!cardShine) {
          cardShine = card.querySelector('.card-shine');
          if (!cardShine) {
            cardShine = document.createElement('div');
            cardShine.className = 'card-shine';
            card.appendChild(cardShine);
          }
        }
        cardShine.style.background = 'radial-gradient(ellipse at ' + (x * 100) + '% ' + (y * 100) + '%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 30%, transparent 70%)';
        cardShine.style.opacity = '1';

        // Edge glow
        var edgeX = Math.abs(x - 0.5) * 2;
        var edgeY = Math.abs(y - 0.5) * 2;
        var edgeGlow = Math.max(edgeX, edgeY);
        card.style.boxShadow = '0 ' + (20 + rotateX * 2) + 'px ' + (40 + edgeGlow * 20) + 'px rgba(15,27,45,' + (0.08 + edgeGlow * 0.06) + '), 0 0 ' + (edgeGlow * 30) + 'px rgba(42,90,143,' + (edgeGlow * 0.08) + ')';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease';
        card.style.boxShadow = '';
        if (cardShine) cardShine.style.opacity = '0';
      });
    });
  }

  /* ═══════════════════════════════════════════
     MAGNETIC ELEMENTS — 3D Enhanced
     ═══════════════════════════════════════════ */
  function initMagneticElements() {
    if (window.innerWidth < 1025) return;

    document.querySelectorAll('.nav-menu-btn, .map-btn, .floating-call, .hero-cta-btn, .nav-booking').forEach(function (el) {
      var maxDist = 40;

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) * 0.35;
        var dy = (e.clientY - cy) * 0.35;

        // Add subtle 3D rotation
        var rotX = (e.clientY - cy) * -0.08;
        var rotY = (e.clientX - cx) * 0.08;

        el.style.transform = 'translate(' + clamp(dx, -maxDist, maxDist) + 'px,' + clamp(dy, -maxDist, maxDist) + 'px) perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
        el.style.transition = 'transform 0.15s ease';
      });

      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  /* ═══════════════════════════════════════════
     TEXT MASK — Hero letter spacing on scroll
     ═══════════════════════════════════════════ */
  function initTextMask() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var titles = document.querySelectorAll('.title-word');
      titles.forEach(function (title) {
        if (scrolled < hero.offsetHeight) {
          title.style.letterSpacing = (scrolled * 0.005) + 'em';
        }
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     FLOATING CALL BUTTON
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     NAV SCROLL PROGRESS
     ═══════════════════════════════════════════ */
  function initNavScrollProgress() {
    var nav = document.getElementById('nav');
    var progressBar = document.getElementById('navProgress');
    if (!nav) return;

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

  /* ═══════════════════════════════════════════
     SMOOTH LINKS
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     IMAGE BREAK PARALLAX
     ═══════════════════════════════════════════ */
  function initImageBreakParallax() {
    var imageBreak = document.querySelector('.image-break');
    if (!imageBreak) return;
    var img = imageBreak.querySelector('img');
    if (!img) return;

    img.style.transform = 'scale(1.08)';
    img.style.transition = 'transform 0s';

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = imageBreak.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          var y = ((progress - 0.5) * -30).toFixed(2);
          img.style.transform = 'translate3d(0,' + y + 'px,0) scale(1.08)';
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════
     SECTION INDICATOR — Side dots
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     ★ NEW: BUTTON RIPPLE EFFECT
     ═══════════════════════════════════════════════ */
  function initButtonRipple() {
    var buttons = document.querySelectorAll('.hero-cta-btn, .nav-booking, .map-btn, .treat-cta-btn, .h-card, .pillar-card');

    buttons.forEach(function(btn) {
      btn.style.overflow = 'hidden';
      btn.style.position = btn.style.position || 'relative';

      btn.addEventListener('click', function(e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        var size = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = 'position:absolute;border-radius:50%;pointer-events:none;' +
          'width:' + size + 'px;height:' + size + 'px;' +
          'left:' + (e.clientX - rect.left - size/2) + 'px;' +
          'top:' + (e.clientY - rect.top - size/2) + 'px;' +
          'background:radial-gradient(circle, rgba(42,90,143,0.15) 0%, rgba(42,90,143,0.05) 40%, transparent 70%);' +
          'transform:scale(0);animation:rippleExpand 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;z-index:1;';
        btn.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 900);
      });
    });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: GLASS LIGHT TRACKER
     Track mouse position across glass elements,
     create dynamic light reflection
     ═══════════════════════════════════════════════ */
  function initGlassLightTracker() {
    if (window.innerWidth < 1025) return;

    // Global mouse tracking for glass sections
    var glassSections = document.querySelectorAll('.pillar-card, .promise-item, .equip-item, .h-card, .cred-block');

    glassSections.forEach(function(el) {
      el.addEventListener('mousemove', function(e) {
        var rect = el.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        el.style.setProperty('--glow-x', x + '%');
        el.style.setProperty('--glow-y', y + '%');
        el.classList.add('glass-active');
      });

      el.addEventListener('mouseleave', function() {
        el.classList.remove('glass-active');
      });
    });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: SCROLL VELOCITY SKEW
     Cards tilt slightly in scroll direction
     ═══════════════════════════════════════════════ */
  function initScrollVelocitySkew() {
    if (window.innerWidth < 1025) return;

    var cards = document.querySelectorAll('.pillar-card, .h-card, .equip-item, .promise-item');
    var currentSkew = 0;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function() {
        var targetSkew = clamp(scroll.velocity * 0.15, -3, 3);
        currentSkew = lerp(currentSkew, targetSkew, 0.1);

        if (Math.abs(currentSkew) > 0.05) {
          cards.forEach(function(card) {
            // Only apply if not being hovered (3D tilt takes priority)
            if (!card.matches(':hover')) {
              card.style.transform = 'skewY(' + currentSkew.toFixed(2) + 'deg)';
            }
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: SECTION TRANSITIONS
     Smooth color/opacity shift between sections
     ═══════════════════════════════════════════════ */
  function initSectionTransitions() {
    var sections = document.querySelectorAll('.section, .story-section, .dark-section');

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          // Apply to children with stagger
          var children = entry.target.querySelectorAll('[data-reveal], .pillar-card, .h-card, .equip-item, .promise-item');
          children.forEach(function(child, i) {
            child.style.transitionDelay = (i * 0.08) + 's';
          });
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(function(s) { observer.observe(s); });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: HOVER SPRING EFFECT
     Buttons bounce on hover with spring physics
     ═══════════════════════════════════════════════ */
  function initHoverSpring() {
    var springElements = document.querySelectorAll('.hero-cta-btn, .nav-booking, .map-btn, .treat-cta-btn, .tag-pill, .badge');

    springElements.forEach(function(el) {
      el.addEventListener('mouseenter', function() {
        el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = 'scale(1.05) translateY(-2px)';
      });

      el.addEventListener('mouseleave', function() {
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = 'scale(1) translateY(0)';
      });
    });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: CLICK FEEDBACK
     Visual + haptic-like feedback on click
     ═══════════════════════════════════════════════ */
  function initClickFeedback() {
    var clickables = document.querySelectorAll('a, button, .h-card, .pillar-card, .equip-item, .promise-item');

    clickables.forEach(function(el) {
      el.addEventListener('mousedown', function() {
        el.style.transition = 'transform 0.1s ease';
        el.style.transform = 'scale(0.97)';
      });

      el.addEventListener('mouseup', function() {
        el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = 'scale(1)';
      });

      el.addEventListener('mouseleave', function() {
        el.style.transform = '';
      });
    });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: TEXT REVEAL ON SCROLL
     Headings split and reveal character by character
     ═══════════════════════════════════════════════ */
  function initTextRevealOnScroll() {
    var headings = document.querySelectorAll('.pillars-title, .services-title, .equip-title, .promise-main-title');

    headings.forEach(function(heading) {
      if (heading.dataset.splitDone) return;
      heading.dataset.splitDone = 'true';

      // Don't split if has child elements like <em>
      if (heading.children.length > 0) return;

      var text = heading.textContent;
      heading.textContent = '';
      heading.setAttribute('aria-label', text);

      var chars = text.split('');
      chars.forEach(function(char, i) {
        var span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.className = 'char-reveal';
        span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(30px) rotateX(-40deg);' +
          'transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);transition-delay:' + (i * 0.03) + 's;';
        heading.appendChild(span);
      });

      var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          heading.querySelectorAll('.char-reveal').forEach(function(char) {
            char.style.opacity = '1';
            char.style.transform = 'translateY(0) rotateX(0deg)';
          });
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      observer.observe(heading);
    });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: PARALLAX LAYERS
     Multiple depth layers create depth illusion
     ═══════════════════════════════════════════════ */
  function initParallaxLayers() {
    var layers = [
      { sel: '.pillar-card:nth-child(1)', speed: 0.02 },
      { sel: '.pillar-card:nth-child(2)', speed: 0.04 },
      { sel: '.pillar-card:nth-child(3)', speed: 0.06 },
      { sel: '.equip-item:nth-child(odd)', speed: 0.03 },
      { sel: '.equip-item:nth-child(even)', speed: 0.05 },
      { sel: '.promise-item:nth-child(odd)', speed: 0.02 },
      { sel: '.promise-item:nth-child(even)', speed: 0.04 }
    ];

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function() {
        layers.forEach(function(layer) {
          var els = document.querySelectorAll(layer.sel);
          els.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              var center = rect.top + rect.height / 2;
              var offset = (center - window.innerHeight / 2) * layer.speed;
              // Only apply if not being hovered
              if (!el.matches(':hover')) {
                el.style.transform = 'translateY(' + offset.toFixed(1) + 'px)';
              }
            }
          });
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: SCROLL DIRECTION INDICATOR
     Shows up/down indicator on scroll pause
     ═══════════════════════════════════════════════ */
  function initScrollDirectionIndicator() {
    // The scroll progress bar is enough — add velocity-based opacity
    var progressBar = document.getElementById('scrollProgress') || document.getElementById('navProgress');
    if (!progressBar) return;

    var fadeTimeout;
    window.addEventListener('scroll', function() {
      progressBar.style.opacity = '1';
      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(function() {
        progressBar.style.opacity = '0.3';
      }, 1500);
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════
     ★ NEW: CARD ENTRANCE — Staggered theatrical
     ═══════════════════════════════════════════════ */
  function initCardEntrance() {
    var cardGroups = [
      { parent: '.pillars-grid', cards: '.pillar-card' },
      { parent: '.equip-grid', cards: '.equip-item' },
      { parent: '.promise-grid', cards: '.promise-item' }
    ];

    cardGroups.forEach(function(group) {
      var parent = document.querySelector(group.parent);
      if (!parent) return;
      var cards = parent.querySelectorAll(group.cards);
      if (cards.length === 0) return;

      // Set initial state
      cards.forEach(function(card, i) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(60px) scale(0.92)';
        card.style.transition = 'none';
      });

      var observer = new IntersectionObserver(function(entries) {
        if (entries[0].isIntersecting) {
          cards.forEach(function(card, i) {
            setTimeout(function() {
              card.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, i * 120);
          });
          observer.disconnect();
        }
      }, { threshold: 0.15 });
      observer.observe(parent);
    });
  }

})();
