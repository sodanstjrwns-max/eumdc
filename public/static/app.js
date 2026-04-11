/* ============================================
   이음치과의원 — ULTRA RADICAL INTERACTIVE
   Magnetic cursor, 3D cards, parallax,
   text distortion, scroll-driven cinema
   ============================================ */
(function () {
  'use strict';

  // RAF-based smooth value interpolation
  function lerp(a, b, n) { return a + (b - a) * n; }

  // === INIT ON LOAD ===
  window.addEventListener('DOMContentLoaded', function () {
    initAll();
  });

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
  }

  // === SMOOTH SCROLL (Lenis-like) ===
  var smoothScrollY = 0;
  var targetScrollY = 0;
  var scrollSpeed = 0;

  function initSmoothScroll() {
    // Track scroll speed for velocity effects
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

  // === CUSTOM CURSOR (Magnetic + Morphing) ===
  function initCursor() {
    if (window.innerWidth < 1025) return;

    var cursor = document.getElementById('cursor');
    var follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    var mx = 0, my = 0, fx = 0, fy = 0;
    var cursorScale = 1;
    var targetScale = 1;
    var isHovering = false;
    var cursorText = '';

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

    // Hover states with labels
    document.querySelectorAll('[data-hover]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        follower.classList.add('hover');
        targetScale = 2;
      });
      el.addEventListener('mouseleave', function () {
        follower.classList.remove('hover');
        follower.classList.remove('text-mode');
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

    // Drag cursor for horizontal scroll
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
      link.addEventListener('click', function () { closeMenu(); });
    });

    function closeMenu() {
      isOpen = false;
      menu.classList.remove('open');
      btn.querySelector('span').textContent = 'MENU';
      document.body.style.overflow = '';
    }

    // ESC key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  }

  // === HERO: Canvas Particle Network + Gradient ===
  function initParallaxHero() {
    var canvas = document.getElementById('heroCanvas');
    var heroContent = document.querySelector('.hero-content');
    var hero = document.querySelector('.hero');
    if (!canvas || !hero) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h;
    var mouseX = -1000, mouseY = -1000;
    var particles = [];
    var PARTICLE_COUNT = window.innerWidth > 768 ? 60 : 30;
    var CONNECT_DIST = window.innerWidth > 768 ? 160 : 120;
    var MOUSE_RADIUS = 200;
    var animId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function Particle() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.8 + 0.5;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      // Colour: mix of gold and blue-white
      var t = Math.random();
      if (t < 0.4) {
        this.color = '110,159,212';  // blue
      } else if (t < 0.7) {
        this.color = '177,150,97';   // gold
      } else {
        this.color = '200,210,225';  // silver-white
      }
    }

    Particle.prototype.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;
      if (this.y < 0) this.y = h;
      if (this.y > h) this.y = 0;

      // Mouse interaction — gentle repel
      var dx = this.x - mouseX;
      var dy = this.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        var force = (1 - dist / MOUSE_RADIUS) * 0.02;
        this.vx += dx * force;
        this.vy += dy * force;
        this.alpha = Math.min(1, this.baseAlpha + (1 - dist / MOUSE_RADIUS) * 0.5);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }

      // Dampen velocity
      this.vx *= 0.99;
      this.vy *= 0.99;
    };

    Particle.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ',' + this.alpha + ')';
      ctx.fill();
    };

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            var alpha = (1 - dist / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(110,159,212,' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Draw subtle grid lines
    function drawGrid() {
      var gridSize = 80;
      ctx.strokeStyle = 'rgba(110,159,212,0.03)';
      ctx.lineWidth = 0.5;
      for (var x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (var y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      drawGrid();
      for (var i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      drawConnections();
      for (var k = 0; k < particles.length; k++) {
        particles[k].draw();
      }
      animId = requestAnimationFrame(animate);
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
      }
      if (animId) cancelAnimationFrame(animId);
      animate();
    }

    init();

    // Mouse tracking
    if (window.innerWidth > 768) {
      hero.addEventListener('mousemove', function(e) {
        var rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      hero.addEventListener('mouseleave', function() {
        mouseX = -1000;
        mouseY = -1000;
      });
    }

    // Resize handler
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 200);
    });

    // Scroll parallax for content (keep existing behavior)
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var heroH = hero.offsetHeight;
      if (scrolled > heroH) return;
      var progress = scrolled / heroH;
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        heroContent.style.opacity = Math.max(0, 1 - progress * 1.5);
      }
      // Fade canvas on scroll
      if (canvas) {
        canvas.style.opacity = Math.max(0.1, 0.7 - progress * 0.6);
      }
    }, { passive: true });

    // Pause animation when hero is not visible
    var heroObserver = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        if (!animId) animate();
      } else {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    }, { threshold: 0.05 });
    heroObserver.observe(hero);
  }

  // === SCROLL REVEALS (with stagger) ===
  function initScrollReveals() {
    var elements = document.querySelectorAll('[data-reveal]');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Stagger siblings
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

  // === MANIFESTO TEXT REVEAL (Character-level) ===
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

  // === HORIZONTAL SCROLL (Enhanced with snap feel) ===
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

    // Mouse drag with momentum
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
      // Momentum scroll
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

    // Wheel -> horizontal scroll (smoother)
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

    // Touch support
    var touchStartX = 0;
    var touchScrollLeft = 0;
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

        // Shine effect
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

  // === TEXT MASK (reveal image through text) ===
  function initTextMask() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Scroll-driven title distortion
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      var titles = document.querySelectorAll('.title-word');
      titles.forEach(function (title, i) {
        var skew = Math.min(scrolled * 0.01 * (i + 1), 5);
        if (scrolled < hero.offsetHeight) {
          title.style.letterSpacing = (scrolled * 0.005) + 'em';
        }
      });
    }, { passive: true });
  }

  // === GALLERY PARALLAX (Speed Difference) ===
  function initGalleryParallax() {
    var strip = document.querySelector('.gallery-strip');
    if (!strip) return;

    var track = strip.querySelector('.gallery-track');
    var baseSpeed = parseFloat(getComputedStyle(track).animationDuration) || 40;

    // Speed up/slow down based on scroll velocity
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
    if (!nav) return;

    // Create progress bar
    var progressBar = document.createElement('div');
    progressBar.className = 'nav-progress';
    nav.appendChild(progressBar);

    window.addEventListener('scroll', function () {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = (window.scrollY / docHeight) * 100;
      progressBar.style.width = progress + '%';

      // Nav bg on scroll
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
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
    // Create indicator dots
    var sections = document.querySelectorAll('.section[id]');
    if (sections.length === 0) return;

    var indicator = document.createElement('div');
    indicator.className = 'section-indicator';
    var dots = [];

    sections.forEach(function (section, i) {
      var dot = document.createElement('div');
      dot.className = 'indicator-dot';
      dot.addEventListener('click', function () {
        section.scrollIntoView({ behavior: 'smooth' });
      });
      indicator.appendChild(dot);
      dots.push(dot);
    });

    document.body.appendChild(indicator);

    // Update active dot
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
