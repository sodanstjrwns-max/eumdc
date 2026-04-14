/* ============================================
   이음치과 — CINEMATIC MOTION ENGINE v2
   ============================================
   AVATAR-LEVEL VISUAL DESIGN
   ─────────────────────────────────────────
   Canvas Particle System · Scroll-synced Depth
   Volumetric Light · Parallax Layers
   Per-chapter Mood Lighting · Text Split Reveals
   Scrub-based Camera · Bioluminescent FX
   ============================================ */
(function () {
  'use strict';

  function waitForGsap(cb) {
    if (window.gsap && window.ScrollTrigger) {
      cb();
    } else {
      setTimeout(function () { waitForGsap(cb); }, 100);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    waitForGsap(initCinematicEngine);
  });

  function initCinematicEngine() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.defaults({
      toggleActions: 'play none none none'
    });

    // ═══ SYSTEMS INIT ═══
    initHeroCanvasParticles();
    initHeroParallaxDepth();
    initStoryNarrative();
    initGenericReveals();
    initHorizontalScroll();
    initCardAnimations();
    initMagneticHover();
    initMenuAnimation();
    initScrollProgress();
    initMarquee();
    initImageReveal();
    initFooterReveal();
    initPillarCardMouseTrack();

    console.log('[EUM] Cinematic Engine v2 initialized');
  }

  // ═══════════════════════════════════════════════════
  // HERO — CANVAS PARTICLE SYSTEM
  // 50+ floating particles with depth, glow, and drift
  // ═══════════════════════════════════════════════════
  function initHeroCanvasParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var PARTICLE_COUNT = 60;
    var animId;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    }

    function createParticles() {
      particles = [];
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        var depth = Math.random();
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: 0.5 + depth * 2,
          depth: depth,
          alpha: 0.1 + depth * 0.4,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.1 - Math.random() * 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.015,
          hue: 200 + Math.random() * 30 // blue range
        });
      }
    }

    function draw() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Wrap around
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        var pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        // Glow layer
        var glowRadius = p.radius * (3 + p.depth * 4);
        var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        glow.addColorStop(0, 'hsla(' + p.hue + ', 50%, 75%, ' + (pulseAlpha * 0.3) + ')');
        glow.addColorStop(1, 'hsla(' + p.hue + ', 50%, 75%, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = 'hsla(' + p.hue + ', 40%, 90%, ' + pulseAlpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    // Only run when hero is visible
    var heroSection = document.getElementById('section-hero');
    if (heroSection) {
      resize();
      createParticles();

      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: function() { draw(); },
        onLeave: function() { cancelAnimationFrame(animId); },
        onEnterBack: function() { draw(); },
        onLeaveBack: function() { cancelAnimationFrame(animId); }
      });

      // Start immediately if hero is visible
      draw();

      var resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          resize();
          createParticles();
        }, 200);
      });
    }

    // Hide CSS fallback when canvas works
    var cssParticles = document.getElementById('heroParticles');
    if (cssParticles) cssParticles.style.display = 'none';
  }

  // ═══════════════════════════════════════════════════
  // HERO — PARALLAX DEPTH LAYERS
  // Multi-speed parallax on hero elements
  // ═══════════════════════════════════════════════════
  function initHeroParallaxDepth() {
    var hero = document.getElementById('section-hero');
    if (!hero) return;

    var heroContent = hero.querySelector('.hero-content');
    var heroMesh = document.getElementById('heroMesh');
    var leaks = hero.querySelectorAll('.hero-light-leak');
    var scan = document.getElementById('heroScanLine');

    // Content moves up faster for parallax depth
    if (heroContent) {
      gsap.to(heroContent, {
        y: -120,
        opacity: 0.3,
        filter: 'blur(3px)',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        },
        ease: 'none'
      });
    }

    // Mesh moves slowly for depth
    if (heroMesh) {
      gsap.to(heroMesh, {
        y: 60,
        scale: 1.1,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        },
        ease: 'none'
      });
    }

    // Light leaks move at different speeds
    leaks.forEach(function(leak, i) {
      gsap.to(leak, {
        y: 40 + i * 20,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1 + i
        },
        ease: 'none'
      });
    });

    // Scan line fades on scroll
    if (scan) {
      gsap.to(scan, {
        opacity: 0,
        scrollTrigger: {
          trigger: hero,
          start: '20% top',
          end: '60% top',
          scrub: 1
        },
        ease: 'none'
      });
    }
  }

  // ═══════════════════════════════════════════════════
  // STORY NARRATIVE — CINEMATIC MOTION ENGINE
  // ═══════════════════════════════════════════════════
  function initStoryNarrative() {
    var storyLines = document.querySelectorAll('.story-line');
    var storyNarrative = document.getElementById('storyNarrative');
    if (!storyLines.length || !storyNarrative) return;

    // --- Narrative in-view toggle ---
    ScrollTrigger.create({
      trigger: storyNarrative,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: function() { storyNarrative.classList.add('in-view'); },
      onLeave: function() { storyNarrative.classList.remove('in-view'); },
      onEnterBack: function() { storyNarrative.classList.add('in-view'); },
      onLeaveBack: function() { storyNarrative.classList.remove('in-view'); }
    });

    // --- Chapter in-view toggles ---
    document.querySelectorAll('.story-chapter').forEach(function(ch) {
      ScrollTrigger.create({
        trigger: ch,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: function() { ch.classList.add('in-view'); },
        onLeave: function() { ch.classList.remove('in-view'); },
        onEnterBack: function() { ch.classList.add('in-view'); },
        onLeaveBack: function() { ch.classList.remove('in-view'); }
      });
    });

    // --- Per-line cinematic reveals (AVATAR LEVEL) ---
    storyLines.forEach(function (line) {
      var text = line.querySelector('.story-text');
      if (!text) return;

      // Enhanced motion config per mood
      var cfg = { dur: 1.2, y: 60, start: 'top 68%', ease: 'power3.out', blur: 10, scale: 1 };

      if (text.classList.contains('story-question')) {
        cfg = { dur: 1.6, y: 80, start: 'top 72%', ease: 'power4.out', blur: 15, scale: 0.96 };
      } else if (text.classList.contains('story-solo')) {
        cfg = { dur: 2.0, y: 0, start: 'top 65%', ease: 'expo.out', blur: 0, scale: 0.6, letterSpacing: true };
      } else if (text.classList.contains('story-small')) {
        cfg = { dur: 1.4, y: 30, start: 'top 70%', ease: 'power2.out', blur: 6 };
      } else if (text.classList.contains('story-pause')) {
        cfg = { dur: 0.6, y: 0, start: 'top 65%', ease: 'power4.out', blur: 0, scale: 1.2, snapBack: true };
      } else if (text.classList.contains('story-whisper')) {
        cfg = { dur: 2.5, y: 0, start: 'top 65%', ease: 'power1.out', blur: 20, opacity: 0.6, scale: 1.05 };
      } else if (text.classList.contains('story-turn')) {
        cfg = { dur: 2.0, y: 120, start: 'top 70%', ease: 'expo.out', blur: 25, rotX: 10, scale: 0.9 };
      } else if (text.classList.contains('story-bridge')) {
        cfg = { dur: 1.2, y: 25, start: 'top 68%', ease: 'power2.out', blur: 5 };
      } else if (text.classList.contains('story-action')) {
        cfg = { dur: 1.4, y: 70, start: 'top 68%', ease: 'power3.out', blur: 12 };
      } else if (text.classList.contains('story-emphasis')) {
        cfg = { dur: 1.5, y: 65, start: 'top 68%', ease: 'power3.out', blur: 12 };
      } else if (text.classList.contains('story-finale')) {
        cfg = { dur: 2.5, y: 150, start: 'top 60%', ease: 'expo.out', blur: 30, scale: 0.5, finale: true };
      }

      var fromVars = {
        y: cfg.y,
        opacity: 0,
        filter: 'blur(' + cfg.blur + 'px)',
        scale: cfg.scale || 1,
        willChange: 'transform, opacity, filter'
      };

      var toVars = {
        y: 0, opacity: cfg.opacity || 1, filter: 'blur(0px)', scale: 1,
        duration: cfg.dur, ease: cfg.ease,
        onStart: function() {
          text.classList.add('visible');
        }
      };

      if (cfg.rotX) { fromVars.rotationX = cfg.rotX; toVars.rotationX = 0; }

      // Snap-back: overshoot then settle (for "맞습니다" pause effect)
      if (cfg.snapBack) {
        toVars.ease = 'back.out(2)';
        toVars.onComplete = function() {
          gsap.to(text, { scale: 1, duration: 0.4, ease: 'power2.out' });
        };
      }

      // Finale: extra dramatic with staggered elements
      if (cfg.finale) {
        toVars.onComplete = function() {
          // Pulse effect after landing
          gsap.to(text, {
            textShadow: '0 0 60px rgba(42,90,143,0.6), 0 0 120px rgba(42,90,143,0.3), 0 0 240px rgba(27,58,92,0.15)',
            duration: 2,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: -1
          });
        };
      }

      ScrollTrigger.create({
        trigger: line,
        start: cfg.start,
        once: true,
        onEnter: function () {
          gsap.fromTo(text, fromVars, toVars);
        }
      });
    });

    // --- Chapter number parallax (giant watermark) ---
    document.querySelectorAll('.story-chapter-num').forEach(function(num) {
      var chapter = num.closest('.story-chapter');
      if (!chapter) return;
      gsap.fromTo(num,
        { y: 80, opacity: 0 },
        {
          y: -80, opacity: 1,
          scrollTrigger: {
            trigger: chapter,
            start: 'top bottom', end: 'bottom top', scrub: 3
          },
          ease: 'none'
        }
      );
    });

    // --- Dark chapter (ch3) — progressive darkening + fog depth ---
    var ch3 = document.getElementById('storyChapter3');
    if (ch3) {
      gsap.fromTo(ch3,
        { '--chapter-darkness': 0 },
        {
          '--chapter-darkness': 1,
          scrollTrigger: { trigger: ch3, start: 'top 50%', end: 'bottom 50%', scrub: 1 },
          ease: 'none'
        }
      );

      // Fog parallax
      var fog = document.getElementById('chapterFog');
      if (fog) {
        gsap.to(fog, {
          x: '5%', y: '-3%',
          scrollTrigger: { trigger: ch3, start: 'top bottom', end: 'bottom top', scrub: 2 },
          ease: 'none'
        });
      }
    }

    // --- Turn chapter (ch4) — volumetric light beam + cone ---
    var lightBurst = document.getElementById('chapterLightBurst');
    var lightCone = document.getElementById('chapterLightCone');
    if (lightBurst) {
      gsap.fromTo(lightBurst,
        { height: '0%', opacity: 0 },
        {
          height: '100%', opacity: 0.8,
          scrollTrigger: {
            trigger: document.getElementById('storyChapter4'),
            start: 'top 60%', end: 'center center', scrub: 1.5
          },
          ease: 'none'
        }
      );
    }
    if (lightCone) {
      gsap.fromTo(lightCone,
        { width: '0%', opacity: 0 },
        {
          width: '100%', opacity: 0.8,
          scrollTrigger: {
            trigger: document.getElementById('storyChapter4'),
            start: 'top 50%', end: '60% center', scrub: 2
          },
          ease: 'none'
        }
      );
    }

    // --- Resolve chapter (ch5) — god rays rotation scrub ---
    var rays = document.getElementById('chapterRays');
    if (rays) {
      gsap.fromTo(rays,
        { opacity: 0, rotation: -5 },
        {
          opacity: 1, rotation: 5,
          scrollTrigger: {
            trigger: document.getElementById('storyChapter5'),
            start: 'top 70%', end: 'bottom 30%', scrub: 2
          },
          ease: 'none'
        }
      );
    }

    // --- Climax (ch6) — full cinematic treatment ---
    var ch6 = document.getElementById('storyChapter6');
    if (ch6) {
      // Aurora intensity ramp with movement
      var aurora = document.getElementById('chapterAurora');
      if (aurora) {
        gsap.fromTo(aurora,
          { opacity: 0.15, scale: 0.9 },
          {
            opacity: 1, scale: 1.1,
            scrollTrigger: {
              trigger: ch6, start: 'top 60%', end: 'bottom 40%', scrub: 2
            },
            ease: 'none'
          }
        );
      }

      // Nebula pulse
      var nebula = document.getElementById('chapterNebula');
      if (nebula) {
        gsap.fromTo(nebula,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 0.8, scale: 1.1,
            scrollTrigger: {
              trigger: ch6, start: 'top 70%', end: 'center center', scrub: 2
            },
            ease: 'none'
          }
        );
      }

      // Stars parallax (different depth layers)
      var stars = document.getElementById('chapterStars');
      if (stars) {
        gsap.to(stars, {
          y: -40,
          scrollTrigger: { trigger: ch6, start: 'top bottom', end: 'bottom top', scrub: 1 },
          ease: 'none'
        });
      }
    }

    // --- Parallax depth on chapter orbs ---
    document.querySelectorAll('.chapter-orb').forEach(function(orb) {
      gsap.to(orb, {
        y: -100,
        scrollTrigger: {
          trigger: orb.closest('.story-chapter'),
          start: 'top bottom', end: 'bottom top', scrub: 2.5
        },
        ease: 'none'
      });
    });

    // --- Ambient glow position tracking ---
    var ambientGlow = document.getElementById('storyGlow');
    if (ambientGlow) {
      gsap.to(ambientGlow, {
        y: function() { return -storyNarrative.offsetHeight * 0.3; },
        scrollTrigger: {
          trigger: storyNarrative,
          start: 'top bottom', end: 'bottom top', scrub: 3
        },
        ease: 'none'
      });
    }

    // --- Ambient pulse secondary layer ---
    var ambientPulse = document.getElementById('storyPulse');
    if (ambientPulse) {
      gsap.to(ambientPulse, {
        y: function() { return -storyNarrative.offsetHeight * 0.2; },
        scrollTrigger: {
          trigger: storyNarrative,
          start: 'top bottom', end: 'bottom top', scrub: 4
        },
        ease: 'none'
      });
    }
  }

  // ═══════════════════════════════════════════════════
  // GENERIC REVEALS — Enhanced with stagger + blur
  // ═══════════════════════════════════════════════════
  function initGenericReveals() {
    // Data-reveal elements with blur-in effect
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        y: 60,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 1.2,
        ease: 'power3.out'
      });
    });

    // Staggered grid reveals
    var grids = ['.treat-grid', '.doctors-grid', '.cases-grid', '.regions-grid',
      '.region-treat-grid', '.region-case-grid'];
    grids.forEach(function (sel) {
      var grid = document.querySelector(sel);
      if (!grid) return;
      var observer = new MutationObserver(function () {
        var children = grid.children;
        if (children.length > 0) {
          observer.disconnect();
          gsap.from(children, {
            scrollTrigger: { trigger: grid, start: 'top 80%', once: true },
            y: 50,
            opacity: 0,
            filter: 'blur(3px)',
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
          });
        }
      });
      observer.observe(grid, { childList: true });
    });

    // Hero title
    gsap.utils.toArray('.page-title, .hero-title').forEach(function (title) {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: 'top 90%', once: true },
        y: 40,
        opacity: 0,
        filter: 'blur(5px)',
        duration: 1.0,
        ease: 'power3.out'
      });
    });

    // Section labels — slide in with line
    gsap.utils.toArray('.section-label').forEach(function (label) {
      gsap.from(label, {
        scrollTrigger: { trigger: label, start: 'top 90%', once: true },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Section headings
    gsap.utils.toArray('.section-heading, h2.treat-cat-title, .services-title, .equip-title, .promise-main-title, .pillars-title').forEach(function (h) {
      gsap.from(h, {
        scrollTrigger: { trigger: h, start: 'top 85%', once: true },
        y: 30,
        opacity: 0,
        filter: 'blur(3px)',
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // Counter animations
    gsap.utils.toArray('.hero-stat-num').forEach(function (el) {
      var target = parseFloat(el.dataset.count || el.textContent);
      if (isNaN(target)) return;
      var isFloat = target % 1 !== 0;
      var obj = { val: 0 };
      gsap.to(obj, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        val: target,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // HORIZONTAL SCROLL SECTIONS
  // ═══════════════════════════════════════════════════
  function initHorizontalScroll() {
    var hTrack = document.getElementById('horizontalTrack');
    if (!hTrack || !hTrack.parentElement) return;

    var totalWidth = hTrack.scrollWidth - window.innerWidth;
    if (totalWidth > 0) {
      gsap.to(hTrack, {
        scrollTrigger: {
          trigger: hTrack.parentElement,
          start: 'top top',
          end: '+=' + totalWidth,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1
        },
        x: -totalWidth,
        ease: 'none'
      });
    }

    // Stagger cards as they enter viewport
    var cards = hTrack.querySelectorAll('.h-card');
    cards.forEach(function(card, i) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'left 90%',
          end: 'left 50%',
          scrub: 1,
          containerAnimation: gsap.getById && gsap.getById('hScroll') || undefined
        },
        opacity: 0.5,
        y: 20,
        duration: 0.5
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // CARD ANIMATIONS — Cinematic fade-up
  // ═══════════════════════════════════════════════════
  function initCardAnimations() {
    var cardSelectors = ['.case-card', '.blog-card', '.notice-row', '.faq-item',
      '.treat-cta-inner', '.region-info-card', '.value-card', '.equip-item',
      '.promise-item', '.cred-block'];

    cardSelectors.forEach(function (sel) {
      gsap.utils.toArray(sel).forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          y: 40,
          opacity: 0,
          filter: 'blur(2px)',
          duration: 0.7,
          delay: Math.min(i * 0.06, 0.3),
          ease: 'power3.out'
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // MAGNETIC HOVER — Enhanced with 3D tilt
  // ═══════════════════════════════════════════════════
  function initMagneticHover() {
    if (window.innerWidth <= 1024) return;

    document.querySelectorAll('[data-hover]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(el, { scale: 1.03, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { scale: 1, duration: 0.4, ease: 'power2.out' });
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // PILLAR CARD MOUSE TRACKING (spotlight follow)
  // ═══════════════════════════════════════════════════
  function initPillarCardMouseTrack() {
    if (window.innerWidth <= 1024) return;

    document.querySelectorAll('.pillar-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // MENU ANIMATION — Cinematic open/close
  // ═══════════════════════════════════════════════════
  function initMenuAnimation() {
    var menuBtn = document.getElementById('menuBtn');
    var fullMenu = document.getElementById('fullMenu');
    if (!menuBtn || !fullMenu) return;

    var menuLinks = fullMenu.querySelectorAll('.menu-link');
    var menuFooter = fullMenu.querySelectorAll('.menu-footer-col');

    menuBtn.addEventListener('click', function () {
      if (fullMenu.classList.contains('active')) {
        // Close
        gsap.to(menuLinks, {
          y: -30,
          opacity: 0,
          filter: 'blur(4px)',
          stagger: 0.03,
          duration: 0.3,
          ease: 'power2.in'
        });
        gsap.to(menuFooter, {
          y: -15, opacity: 0,
          duration: 0.2,
          delay: 0.1,
          onComplete: function () { fullMenu.classList.remove('active'); }
        });
      } else {
        // Open
        fullMenu.classList.add('active');
        gsap.fromTo(menuLinks,
          { y: 50, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.6, ease: 'power3.out', delay: 0.25 }
        );
        gsap.fromTo(menuFooter,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.5 }
        );
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // SCROLL PROGRESS BAR — Gradient
  // ═══════════════════════════════════════════════════
  function initScrollProgress() {
    var progressBar = document.getElementById('scrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgress';
      progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--gold),var(--cta-bright));z-index:10000;transform-origin:left;transform:scaleX(0);will-change:transform;';
      document.body.appendChild(progressBar);
    }
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });
  }

  // ═══════════════════════════════════════════════════
  // MARQUEE — Smooth infinite scroll
  // ═══════════════════════════════════════════════════
  function initMarquee() {
    gsap.utils.toArray('.marquee-track').forEach(function (track) {
      var isReverse = track.classList.contains('reverse');
      var w = track.scrollWidth / 2;
      gsap.to(track, {
        x: isReverse ? w : -w,
        duration: isReverse ? 35 : 30,
        ease: 'none',
        repeat: -1
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // IMAGE REVEAL — Cinematic clip-path
  // ═══════════════════════════════════════════════════
  function initImageReveal() {
    gsap.utils.toArray('.gallery-item img, .blog-inline-figure img').forEach(function (img) {
      gsap.from(img, {
        scrollTrigger: { trigger: img, start: 'top 85%', once: true },
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'power3.out'
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // FOOTER — Staggered reveal
  // ═══════════════════════════════════════════════════
  function initFooterReveal() {
    var footer = document.querySelector('.footer-full');
    if (!footer) return;

    var cols = footer.querySelectorAll('.footer-nav-col, .footer-brand-col');
    if (cols.length > 0) {
      gsap.from(cols, {
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
        y: 40,
        opacity: 0,
        filter: 'blur(3px)',
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  }
})();
