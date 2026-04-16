/* ============================================
   이음치과 — CINEMATIC MOTION ENGINE v4
   ============================================
   IMMERSIVE SCROLL EXPERIENCE
   ─────────────────────────────────────────
   Canvas Particle System · Multi-layer Parallax
   Volumetric Light · Text Split Reveals
   Scroll-Velocity Effects · Section Morphing
   Smooth Counters · Stagger Orchestration
   Glass Shimmer · Card Choreography
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

    document.body.classList.add('gsap-active');

    ScrollTrigger.defaults({
      toggleActions: 'play none none none'
    });

    // Respect prefers-reduced-motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.story-text, [data-reveal]').forEach(function(el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      console.log('[EUM] Reduced motion mode — animations disabled');
      return;
    }

    // ═══ MOBILE DETECTION ═══
    var isMobile = window.innerWidth <= 768;
    var isTablet = window.innerWidth <= 1024 && !isMobile;

    // ═══ CORE SYSTEMS ═══
    if (!isMobile) {
      initHeroCanvasParticles(); // Skip canvas particles on mobile (GPU heavy)
    }
    initHeroCTA();
    if (!isMobile) {
      initHeroParallaxDepth(); // Skip parallax on mobile (scroll jank)
    }
    initStoryNarrative();
    initCinematicBlackout();
    initGenericReveals();
    initHorizontalScroll();
    initCardAnimations();
    if (!isMobile) {
      initMagneticHover(); // No hover on touch devices
    }
    initMenuAnimation();
    initScrollProgress();
    initMarquee();
    initImageReveal();
    initFooterReveal();
    if (!isMobile) {
      initPillarCardMouseTrack(); // Mouse-only feature
    }

    // ═══ ★ NEW v4 SYSTEMS ═══
    if (!isMobile) {
      initSectionColorMorph(); // Expensive GPU operation
      initScrollVelocityBlur(); // Desktop-only visual
      initGlassShimmerOnScroll(); // Glass effects desktop
      initParallaxDepthCards(); // Heavy transforms
    }
    initSplitTextReveal();
    initCardChoreography();
    initNavMicroInteraction();
    initStatsBounce();
    if (!isMobile) {
      initSectionDividers();
    }

    console.log('[EUM] Cinematic Engine v4 initialized' + (isMobile ? ' (mobile-lite)' : ''));
  }

  // ═══════════════════════════════════════════════════
  // HERO — CANVAS PARTICLE SYSTEM
  // ═══════════════════════════════════════════════════
  function initHeroCanvasParticles() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var PARTICLE_COUNT = 60;
    var animId;
    var mouseX = 0.5, mouseY = 0.5;

    // Mouse interaction with particles
    var hero = canvas.parentElement;
    if (hero && window.innerWidth > 768) {
      hero.addEventListener('mousemove', function(e) {
        var rect = hero.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width;
        mouseY = (e.clientY - rect.top) / rect.height;
      });
    }

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
          radius: 0.5 + depth * 2.5,
          depth: depth,
          alpha: 0.1 + depth * 0.5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.1 - Math.random() * 0.3,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.015,
          hue: 200 + Math.random() * 30
        });
      }
    }

    function draw() {
      var w = canvas.width / dpr;
      var h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse attraction — particles drift toward cursor
        var attractX = (mouseX * w - p.x) * 0.0003 * p.depth;
        var attractY = (mouseY * h - p.y) * 0.0003 * p.depth;

        p.x += p.vx + attractX;
        p.y += p.vy + attractY;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        var pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        // Glow layer
        var glowRadius = p.radius * (3 + p.depth * 5);
        var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        glow.addColorStop(0, 'hsla(' + p.hue + ', 50%, 75%, ' + (pulseAlpha * 0.35) + ')');
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

    var cssParticles = document.getElementById('heroParticles');
    if (cssParticles) cssParticles.style.display = 'none';
  }

  // ═══════════════════════════════════════════════════
  // HERO CTA — Enhanced pulse + glow
  // ═══════════════════════════════════════════════════
  function initHeroCTA() {
    var cta = document.querySelector('.hero-cta-btn');
    if (!cta) return;

    // Breathing glow
    gsap.fromTo(cta,
      { boxShadow: '0 0 0 0 rgba(42,90,143,0)' },
      {
        boxShadow: '0 0 0 12px rgba(42,90,143,0.12), 0 0 30px rgba(42,90,143,0.08)',
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 4
      }
    );
  }

  // ═══════════════════════════════════════════════════
  // HERO — PARALLAX DEPTH LAYERS
  // ═══════════════════════════════════════════════════
  function initHeroParallaxDepth() {
    var hero = document.getElementById('section-hero');
    if (!hero) return;

    var heroContent = hero.querySelector('.hero-content');
    var heroMesh = document.getElementById('heroMesh');
    var leaks = hero.querySelectorAll('.hero-light-leak');
    var scan = document.getElementById('heroScanLine');

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

    ScrollTrigger.create({
      trigger: storyNarrative,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: function() { storyNarrative.classList.add('in-view'); },
      onLeave: function() { storyNarrative.classList.remove('in-view'); },
      onEnterBack: function() { storyNarrative.classList.add('in-view'); },
      onLeaveBack: function() { storyNarrative.classList.remove('in-view'); }
    });

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

    // Per-line cinematic reveals
    storyLines.forEach(function (line) {
      var text = line.querySelector('.story-text');
      if (!text) return;

      var cfg = { dur: 1.2, y: 60, start: 'top 68%', ease: 'power3.out', blur: 10, scale: 1 };

      if (text.classList.contains('story-question')) {
        cfg = { dur: 1.8, y: 80, start: 'top 72%', ease: 'power4.out', blur: 18, scale: 0.96 };
      } else if (text.classList.contains('story-solo')) {
        cfg = { dur: 2.0, y: 0, start: 'top 65%', ease: 'expo.out', blur: 0, scale: 0.6, letterSpacing: true };
      } else if (text.classList.contains('story-small')) {
        cfg = { dur: 1.4, y: 30, start: 'top 70%', ease: 'power2.out', blur: 6 };
      } else if (text.classList.contains('story-pause')) {
        cfg = { dur: 0.6, y: 0, start: 'top 65%', ease: 'power4.out', blur: 0, scale: 1.2, snapBack: true };
      } else if (text.classList.contains('story-whisper')) {
        cfg = { dur: 2.5, y: 0, start: 'top 65%', ease: 'power1.out', blur: 20, opacity: 0.6, scale: 1.05 };
      } else if (text.classList.contains('story-turn')) {
        cfg = { dur: 2.5, y: 140, start: 'top 70%', ease: 'expo.out', blur: 30, rotX: 12, scale: 0.85 };
      } else if (text.classList.contains('story-bridge')) {
        cfg = { dur: 1.2, y: 25, start: 'top 68%', ease: 'power2.out', blur: 5 };
      } else if (text.classList.contains('story-action')) {
        cfg = { dur: 1.4, y: 70, start: 'top 68%', ease: 'power3.out', blur: 12 };
      } else if (text.classList.contains('story-emphasis')) {
        cfg = { dur: 1.5, y: 65, start: 'top 68%', ease: 'power3.out', blur: 12 };
      } else if (text.classList.contains('story-finale')) {
        cfg = { dur: 3.0, y: 180, start: 'top 60%', ease: 'expo.out', blur: 35, scale: 0.4, finale: true };
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
        onStart: function() { text.classList.add('visible'); }
      };

      if (cfg.rotX) { fromVars.rotationX = cfg.rotX; toVars.rotationX = 0; }

      if (cfg.snapBack) {
        toVars.ease = 'back.out(2)';
        toVars.onComplete = function() {
          gsap.to(text, { scale: 1, duration: 0.4, ease: 'power2.out' });
        };
      }

      if (cfg.finale) {
        toVars.onComplete = function() {
          gsap.to(text, {
            textShadow: '0 0 50px rgba(42,90,143,0.7), 0 0 100px rgba(42,90,143,0.4), 0 0 200px rgba(42,90,143,0.2), 0 0 400px rgba(27,58,92,0.1)',
            duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1
          });
          gsap.to(text, {
            scale: 1.02, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1
          });
        };
      }

      ScrollTrigger.create({
        trigger: line,
        start: cfg.start,
        once: true,
        onEnter: function () { gsap.fromTo(text, fromVars, toVars); }
      });
    });

    // Chapter number parallax
    document.querySelectorAll('.story-chapter-num').forEach(function(num) {
      var chapter = num.closest('.story-chapter');
      if (!chapter) return;
      gsap.fromTo(num,
        { y: 80, opacity: 0 },
        {
          y: -80, opacity: 1,
          scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: 3 },
          ease: 'none'
        }
      );
    });

    // Dark chapter (ch3)
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

      var fog = document.getElementById('chapterFog');
      if (fog) {
        gsap.to(fog, {
          x: '5%', y: '-4%', scale: 1.08,
          scrollTrigger: { trigger: ch3, start: 'top bottom', end: 'bottom top', scrub: 2.5 },
          ease: 'none'
        });
      }
      var fog2 = ch3.querySelector('.chapter-fog-2');
      if (fog2) {
        gsap.to(fog2, {
          x: '-4%', y: '3%', scale: 1.05,
          scrollTrigger: { trigger: ch3, start: 'top bottom', end: 'bottom top', scrub: 3.5 },
          ease: 'none'
        });
      }
    }

    // Turn chapter (ch4) — volumetric light
    var ch4El = document.getElementById('storyChapter4');
    var lightBurst = document.getElementById('chapterLightBurst');
    var lightCone = document.getElementById('chapterLightCone');
    if (lightBurst && ch4El) {
      gsap.fromTo(lightBurst,
        { height: '0%', opacity: 0, filter: 'blur(8px)' },
        {
          height: '100%', opacity: 0.85, filter: 'blur(0px)',
          scrollTrigger: { trigger: ch4El, start: 'top 60%', end: 'center center', scrub: 1.5 },
          ease: 'none'
        }
      );
    }
    if (lightCone && ch4El) {
      gsap.fromTo(lightCone,
        { width: '0%', opacity: 0 },
        {
          width: '100%', opacity: 0.9,
          scrollTrigger: { trigger: ch4El, start: 'top 50%', end: '60% center', scrub: 2 },
          ease: 'none'
        }
      );
    }

    // Resolve (ch5) — god rays
    var rays = document.getElementById('chapterRays');
    if (rays) {
      gsap.fromTo(rays,
        { opacity: 0, rotation: -5 },
        {
          opacity: 1, rotation: 5,
          scrollTrigger: { trigger: document.getElementById('storyChapter5'), start: 'top 70%', end: 'bottom 30%', scrub: 2 },
          ease: 'none'
        }
      );
    }

    // Climax (ch6)
    var ch6 = document.getElementById('storyChapter6');
    if (ch6) {
      var aurora = document.getElementById('chapterAurora');
      if (aurora) {
        gsap.fromTo(aurora,
          { opacity: 0.15, scale: 0.9 },
          {
            opacity: 1, scale: 1.1,
            scrollTrigger: { trigger: ch6, start: 'top 60%', end: 'bottom 40%', scrub: 2 },
            ease: 'none'
          }
        );
      }
      var nebula = document.getElementById('chapterNebula');
      if (nebula) {
        gsap.fromTo(nebula,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 0.8, scale: 1.1,
            scrollTrigger: { trigger: ch6, start: 'top 70%', end: 'center center', scrub: 2 },
            ease: 'none'
          }
        );
      }
      var stars = document.getElementById('chapterStars');
      if (stars) {
        gsap.to(stars, {
          y: -40,
          scrollTrigger: { trigger: ch6, start: 'top bottom', end: 'bottom top', scrub: 1 },
          ease: 'none'
        });
      }
    }

    // Chapter orbs parallax
    document.querySelectorAll('.chapter-orb').forEach(function(orb) {
      gsap.to(orb, {
        y: -100,
        scrollTrigger: { trigger: orb.closest('.story-chapter'), start: 'top bottom', end: 'bottom top', scrub: 2.5 },
        ease: 'none'
      });
    });

    // Ambient glow
    var ambientGlow = document.getElementById('storyGlow');
    if (ambientGlow) {
      gsap.to(ambientGlow, {
        y: function() { return -storyNarrative.offsetHeight * 0.3; },
        scrollTrigger: { trigger: storyNarrative, start: 'top bottom', end: 'bottom top', scrub: 3 },
        ease: 'none'
      });
    }
    var ambientPulse = document.getElementById('storyPulse');
    if (ambientPulse) {
      gsap.to(ambientPulse, {
        y: function() { return -storyNarrative.offsetHeight * 0.2; },
        scrollTrigger: { trigger: storyNarrative, start: 'top bottom', end: 'bottom top', scrub: 4 },
        ease: 'none'
      });
    }
  }

  // ═══════════════════════════════════════════════════
  // CINEMATIC BLACKOUT — Dark → Light Transition v2
  // ═══════════════════════════════════════════════════
  function initCinematicBlackout() {
    var overlay = document.getElementById('blackoutOverlay');
    var ch3 = document.getElementById('storyChapter3');
    var ch4 = document.getElementById('storyChapter4');
    if (!overlay || !ch3 || !ch4) return;

    var particles = overlay.querySelector('.blackout-particles');

    var blackoutTL = gsap.timeline({
      scrollTrigger: {
        trigger: ch3,
        start: 'top 65%',
        end: 'bottom 25%',
        scrub: 1.5,
        onLeave: function() { gsap.set(overlay, { opacity: 1 }); },
        onEnterBack: function() { gsap.set(overlay, { opacity: 1 }); }
      }
    });

    blackoutTL
      .fromTo(overlay, { opacity: 0 }, { opacity: 0.4, ease: 'power1.in', duration: 0.4 })
      .to(overlay, { opacity: 0.75, ease: 'power2.in', duration: 0.3 })
      .to(overlay, { opacity: 1, ease: 'power3.in', duration: 0.3 });

    if (particles) {
      gsap.fromTo(particles,
        { opacity: 0.3 },
        {
          opacity: 0.9, scale: 1.05,
          scrollTrigger: { trigger: ch3, start: 'top 50%', end: 'bottom 30%', scrub: 2 },
          ease: 'none'
        }
      );
    }

    ScrollTrigger.create({
      trigger: ch4,
      start: 'top 70%',
      end: 'top 20%',
      scrub: false,
      once: false,
      onEnter: function() {
        overlay.classList.add('light-burst');
        gsap.to(overlay, {
          opacity: 0, duration: 2.5, ease: 'power2.out', delay: 0.1,
          onComplete: function() { overlay.classList.remove('light-burst'); }
        });
        if (particles) gsap.to(particles, { opacity: 0, duration: 0.8, ease: 'power3.in' });
      },
      onEnterBack: function() {
        gsap.to(overlay, { opacity: 1, duration: 1.8, ease: 'power2.inOut' });
        if (particles) gsap.to(particles, { opacity: 0.7, duration: 1.2 });
      },
      onLeaveBack: function() { gsap.set(overlay, { opacity: 1 }); }
    });

    ScrollTrigger.create({
      trigger: ch4,
      start: 'center center',
      onEnter: function() { gsap.to(overlay, { opacity: 0, duration: 0.5, overwrite: true }); }
    });

    console.log('[EUM] Cinematic Blackout v2 initialized');
  }

  // ═══════════════════════════════════════════════════
  // GENERIC REVEALS — Enhanced orchestration
  // ═══════════════════════════════════════════════════
  function initGenericReveals() {
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        // Already in viewport — animate immediately without hiding first
        gsap.fromTo(el,
          { y: 20, opacity: 0, filter: 'blur(2px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
        );
      } else {
        gsap.set(el, { opacity: 0, y: 40, filter: 'blur(4px)' });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: function() {
            gsap.to(el, {
              opacity: 1, y: 0, filter: 'blur(0px)',
              duration: 1.0, ease: 'power3.out'
            });
          }
        });
      }
    });

    // Staggered grid reveals — CSS-first approach for dynamic content
    // Uses CSS classes instead of GSAP fromTo to prevent flash-of-invisible-content
    var grids = ['.treat-grid', '.doctors-grid', '.cases-grid', '.regions-grid',
      '.region-treat-grid', '.region-case-grid', '.regionsGrid'];
    grids.forEach(function (sel) {
      var allGrids = document.querySelectorAll(sel);
      allGrids.forEach(function(grid) {
        var observer = new MutationObserver(function () {
          var children = Array.from(grid.children);
          if (children.length > 0) {
            observer.disconnect();
            // Safe approach: set children visible immediately, then animate with class
            children.forEach(function(child, i) {
              child.style.opacity = '0';
              child.style.transform = 'translateY(24px)';
              child.style.transition = 'none';
            });
            // Force reflow
            void grid.offsetHeight;
            // Now animate each child with stagger delay
            children.forEach(function(child, i) {
              child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              child.style.transitionDelay = (i * 0.07) + 's';
              // Use rAF to ensure the transition fires properly
              requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                });
              });
            });
            // Cleanup inline styles after animation completes
            setTimeout(function() {
              children.forEach(function(child) {
                child.style.transition = '';
                child.style.transitionDelay = '';
                child.style.opacity = '';
                child.style.transform = '';
              });
            }, 800 + children.length * 70);
          }
        });
        observer.observe(grid, { childList: true });
      });
    });

    // Title reveals — skip if already visible in viewport
    gsap.utils.toArray('.page-title, .hero-title').forEach(function (title) {
      var rect = title.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Already visible — animate immediately
        gsap.fromTo(title,
          { y: 30, opacity: 0, filter: 'blur(4px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
        );
      } else {
        gsap.from(title, {
          scrollTrigger: { trigger: title, start: 'top 90%', once: true },
          y: 60, opacity: 0, filter: 'blur(8px)', scale: 0.95,
          duration: 1.2, ease: 'power3.out'
        });
      }
    });

    // Section labels — immediate if visible
    gsap.utils.toArray('.section-label').forEach(function (label) {
      var rect = label.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        gsap.fromTo(label,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );
      } else {
        gsap.from(label, {
          scrollTrigger: { trigger: label, start: 'top 90%', once: true },
          x: -40, opacity: 0, duration: 0.9, ease: 'power3.out'
        });
      }
    });

    // Section headings — immediate if visible (no blur on static elements)
    gsap.utils.toArray('.section-heading, h2.treat-cat-title').forEach(function (h) {
      var rect = h.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Already visible — just ensure it's fully shown, no flash
        gsap.set(h, { opacity: 1, y: 0, filter: 'none' });
      } else {
        gsap.from(h, {
          scrollTrigger: { trigger: h, start: 'top 85%', once: true },
          y: 30, opacity: 0,
          duration: 0.8, ease: 'power3.out'
        });
      }
    });

    // Counter — elastic snap
    gsap.utils.toArray('.hero-stat-num').forEach(function (el) {
      var target = parseFloat(el.dataset.count || el.textContent);
      if (isNaN(target)) return;
      var isFloat = target % 1 !== 0;
      var obj = { val: 0 };
      gsap.to(obj, {
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        val: target, duration: 2.5, ease: 'power2.out',
        onUpdate: function () {
          el.textContent = isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString();
        },
        onComplete: function() {
          // Pop scale on complete
          gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // HORIZONTAL SCROLL — GSAP pin
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

    // Stagger cards
    var cards = hTrack.querySelectorAll('.h-card');
    cards.forEach(function(card, i) {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'left 90%', end: 'left 50%', scrub: 1,
          containerAnimation: gsap.getById && gsap.getById('hScroll') || undefined
        },
        opacity: 0.5, y: 20, duration: 0.5
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // CARD ANIMATIONS — Choreographed
  // ═══════════════════════════════════════════════════
  function initCardAnimations() {
    var cardSelectors = ['.case-card', '.blog-card', '.notice-row', '.faq-item',
      '.treat-cta-inner', '.region-info-card', '.value-card'];

    cardSelectors.forEach(function (sel) {
      gsap.utils.toArray(sel).forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          y: 50, opacity: 0, filter: 'blur(3px)', scale: 0.96,
          duration: 0.8, delay: Math.min(i * 0.08, 0.4),
          ease: 'power3.out'
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // MAGNETIC HOVER — Scale with tilt
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
  // PILLAR CARD MOUSE TRACKING
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
  // MENU ANIMATION
  // ═══════════════════════════════════════════════════
  function initMenuAnimation() {
    var fullMenu = document.getElementById('fullMenu');
    if (!fullMenu) return;

    var menuLinks = fullMenu.querySelectorAll('.menu-link');
    var menuFooter = fullMenu.querySelectorAll('.menu-footer-col');

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'class') {
          if (fullMenu.classList.contains('open')) {
            gsap.fromTo(menuLinks,
              { y: 50, opacity: 0, filter: 'blur(6px)' },
              { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.06, duration: 0.6, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo(menuFooter,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.45 }
            );
          }
        }
      });
    });
    observer.observe(fullMenu, { attributes: true });
  }

  // ═══════════════════════════════════════════════════
  // SCROLL PROGRESS BAR
  // ═══════════════════════════════════════════════════
  function initScrollProgress() {
    var progressBar = document.getElementById('scrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgress';
      progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,var(--gold),var(--cta-bright),var(--gold));z-index:10000;transform-origin:left;transform:scaleX(0);will-change:transform;transition:opacity 0.5s ease;';
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
  // MARQUEE
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
  // IMAGE REVEAL — Clip-path
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
  // FOOTER REVEAL
  // ═══════════════════════════════════════════════════
  function initFooterReveal() {
    var footer = document.querySelector('.footer-full');
    if (!footer) return;

    var cols = footer.querySelectorAll('.footer-nav-col, .footer-brand-col');
    if (cols.length > 0) {
      gsap.from(cols, {
        scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
        y: 40, opacity: 0, filter: 'blur(3px)',
        stagger: 0.12, duration: 0.8, ease: 'power3.out'
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: SECTION COLOR MORPH
  // Nav background shifts subtly based on section theme
  // ═══════════════════════════════════════════════════════
  function initSectionColorMorph() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    // Dark sections get special nav treatment
    document.querySelectorAll('.dark-section, .story-section').forEach(function(section) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80px',
        end: 'bottom 80px',
        onEnter: function() { nav.classList.add('nav-dark-zone'); },
        onLeave: function() { nav.classList.remove('nav-dark-zone'); },
        onEnterBack: function() { nav.classList.add('nav-dark-zone'); },
        onLeaveBack: function() { nav.classList.remove('nav-dark-zone'); }
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: SCROLL VELOCITY BLUR
  // Fast scrolling = subtle motion blur on elements
  // ═══════════════════════════════════════════════════════
  function initScrollVelocityBlur() {
    if (window.innerWidth < 1025) return;

    var blurElements = document.querySelectorAll('.section-heading, .pillars-title, .services-title, .equip-title, .promise-main-title');
    var currentBlur = 0;
    var ticking = false;
    var lastScroll = window.scrollY;

    window.addEventListener('scroll', function() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(function() {
        var velocity = Math.abs(window.scrollY - lastScroll);
        lastScroll = window.scrollY;
        var targetBlur = Math.min(velocity * 0.06, 3);
        currentBlur += (targetBlur - currentBlur) * 0.15;

        if (currentBlur > 0.1) {
          blurElements.forEach(function(el) {
            el.style.filter = 'blur(' + currentBlur.toFixed(1) + 'px)';
          });
        } else {
          blurElements.forEach(function(el) {
            el.style.filter = '';
          });
        }
        ticking = false;
      });
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: SPLIT TEXT REVEAL (GSAP-powered)
  // Section titles reveal word by word with spring ease
  // ═══════════════════════════════════════════════════════
  function initSplitTextReveal() {
    var titles = document.querySelectorAll('.services-title, .equip-title, .promise-main-title');

    titles.forEach(function(title) {
      if (title.dataset.gsapSplit) return;
      title.dataset.gsapSplit = 'true';

      // Skip if has child elements
      if (title.children.length > 0) return;

      var text = title.textContent;
      title.textContent = '';
      title.setAttribute('aria-label', text);

      var words = text.split(/(\s+)/);
      words.forEach(function(word) {
        if (/^\s+$/.test(word)) {
          title.appendChild(document.createTextNode(' '));
          return;
        }
        var span = document.createElement('span');
        span.textContent = word;
        span.className = 'gsap-word';
        span.style.cssText = 'display:inline-block;will-change:transform,opacity;';
        title.appendChild(span);
      });

      var wordSpans = title.querySelectorAll('.gsap-word');
      gsap.set(wordSpans, { opacity: 0, y: 50, rotationX: -30, filter: 'blur(6px)' });

      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        once: true,
        onEnter: function() {
          gsap.to(wordSpans, {
            opacity: 1, y: 0, rotationX: 0, filter: 'blur(0px)',
            duration: 0.8, stagger: 0.06,
            ease: 'back.out(1.5)'
          });
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: CARD CHOREOGRAPHY
  // Cards enter with orchestrated multi-property animation
  // ═══════════════════════════════════════════════════════
  function initCardChoreography() {
    // Pillar cards — cascade from left
    var pillarGrid = document.querySelector('.pillars-grid');
    if (pillarGrid) {
      var pillars = pillarGrid.querySelectorAll('.pillar-card');
      gsap.set(pillars, { opacity: 0, x: -60, y: 40, rotationY: -15, scale: 0.9, filter: 'blur(6px)' });

      ScrollTrigger.create({
        trigger: pillarGrid,
        start: 'top 75%',
        once: true,
        onEnter: function() {
          gsap.to(pillars, {
            opacity: 1, x: 0, y: 0, rotationY: 0, scale: 1, filter: 'blur(0px)',
            duration: 1.0, stagger: 0.15,
            ease: 'power3.out'
          });
        }
      });
    }

    // Equipment cards — stagger from bottom with rotation
    var equipGrid = document.querySelector('.equip-grid');
    if (equipGrid) {
      var equips = equipGrid.querySelectorAll('.equip-item');
      gsap.set(equips, { opacity: 0, y: 80, scale: 0.85, filter: 'blur(5px)' });

      ScrollTrigger.create({
        trigger: equipGrid,
        start: 'top 75%',
        once: true,
        onEnter: function() {
          gsap.to(equips, {
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
            duration: 0.9, stagger: { each: 0.1, from: 'start' },
            ease: 'back.out(1.2)'
          });
        }
      });
    }

    // Promise cards — expand from center
    var promiseGrid = document.querySelector('.promise-grid');
    if (promiseGrid) {
      var promises = promiseGrid.querySelectorAll('.promise-item');
      gsap.set(promises, { opacity: 0, scale: 0.7, y: 50, filter: 'blur(8px)' });

      ScrollTrigger.create({
        trigger: promiseGrid,
        start: 'top 75%',
        once: true,
        onEnter: function() {
          gsap.to(promises, {
            opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
            duration: 1.0, stagger: { each: 0.12, from: 'center' },
            ease: 'back.out(1.4)'
          });
        }
      });
    }

    // Credential blocks — slide from right
    var credBlocks = document.querySelectorAll('.cred-block');
    if (credBlocks.length) {
      gsap.set(credBlocks, { opacity: 0, x: 50, filter: 'blur(4px)' });
      credBlocks.forEach(function(block, i) {
        ScrollTrigger.create({
          trigger: block,
          start: 'top 85%',
          once: true,
          onEnter: function() {
            gsap.to(block, {
              opacity: 1, x: 0, filter: 'blur(0px)',
              duration: 0.8, delay: i * 0.1,
              ease: 'power3.out'
            });
          }
        });
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: GLASS SHIMMER ON SCROLL
  // Glassmorphism elements get a traveling light shimmer
  // as user scrolls past them
  // ═══════════════════════════════════════════════════════
  function initGlassShimmerOnScroll() {
    var glassElements = document.querySelectorAll('.pillar-card, .h-card, .equip-item, .promise-item');

    glassElements.forEach(function(el) {
      // Create shimmer overlay
      var shimmer = document.createElement('div');
      shimmer.className = 'glass-shimmer';
      shimmer.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit;overflow:hidden;z-index:2;';

      var shimmerLine = document.createElement('div');
      shimmerLine.style.cssText = 'position:absolute;top:0;left:-100%;width:60%;height:100%;' +
        'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),rgba(255,255,255,0.25),rgba(255,255,255,0.15),transparent);' +
        'transform:skewX(-20deg);transition:none;pointer-events:none;';
      shimmer.appendChild(shimmerLine);
      el.style.position = el.style.position || 'relative';
      el.appendChild(shimmer);

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        once: true,
        onEnter: function() {
          // Animate shimmer across on enter
          gsap.fromTo(shimmerLine,
            { left: '-100%' },
            { left: '200%', duration: 1.2, ease: 'power2.inOut', delay: 0.2 }
          );
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: PARALLAX DEPTH CARDS
  // Cards at different depths move at different scroll speeds
  // ═══════════════════════════════════════════════════════
  function initParallaxDepthCards() {
    // Section backgrounds move at slower speed = depth
    var sectionBgs = [
      { sel: '.story-pillars', speed: 0.03 },
      { sel: '.equipment-minimal', speed: 0.04 },
      { sel: '.promise-section', speed: 0.03 }
    ];

    sectionBgs.forEach(function(cfg) {
      var section = document.querySelector(cfg.sel);
      if (!section) return;

      // Find decorative bg elements
      var bgEl = section.querySelector('::before') || section;
      gsap.to(section, {
        backgroundPositionY: function() { return '30%'; },
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        },
        ease: 'none'
      });
    });

    // Director photo parallax
    var directorPhoto = document.querySelector('.director-photo');
    if (directorPhoto) {
      gsap.to(directorPhoto, {
        y: -30,
        scrollTrigger: {
          trigger: directorPhoto.closest('.director-full'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2
        },
        ease: 'none'
      });
    }
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: NAV MICRO-INTERACTION
  // Nav items have smooth hover underline animation
  // ═══════════════════════════════════════════════════════
  function initNavMicroInteraction() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    // Scroll-based nav transparency/blur
    var lastScroll = 0;
    var navHidden = false;

    window.addEventListener('scroll', function() {
      var current = window.scrollY;
      var direction = current > lastScroll ? 'down' : 'up';

      // Hide nav when scrolling down fast, show on scroll up
      if (direction === 'down' && current > 300 && !navHidden) {
        gsap.to(nav, { y: -10, duration: 0.3, ease: 'power2.out' });
        navHidden = true;
      } else if (direction === 'up' && navHidden) {
        gsap.to(nav, { y: 0, duration: 0.3, ease: 'power2.out' });
        navHidden = false;
      }

      lastScroll = current;
    }, { passive: true });
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: STATS BOUNCE
  // Numbers in stats bounce on scroll-in with elastic ease
  // ═══════════════════════════════════════════════════════
  function initStatsBounce() {
    var statLabels = document.querySelectorAll('.hero-stat-label, .hero-stat-suffix');
    if (!statLabels.length) return;

    statLabels.forEach(function(label, i) {
      gsap.from(label, {
        scrollTrigger: { trigger: label, start: 'top 85%', once: true },
        y: 20, opacity: 0,
        duration: 0.6, delay: 0.3 + i * 0.1,
        ease: 'back.out(2)'
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  // ★ NEW: SECTION DIVIDERS
  // Animated horizontal lines between sections
  // ═══════════════════════════════════════════════════════
  function initSectionDividers() {
    // Find all section boundaries and animate decorative elements
    var sectionHeaders = document.querySelectorAll('.section-label');

    sectionHeaders.forEach(function(label) {
      var line = label.querySelector('.label-line');
      if (line) {
        gsap.from(line, {
          scrollTrigger: { trigger: label, start: 'top 85%', once: true },
          scaleX: 0, transformOrigin: 'left center',
          duration: 0.8, ease: 'power3.out'
        });
      }
    });

    // Tag lines in hero
    var tagLines = document.querySelectorAll('.tag-line');
    tagLines.forEach(function(line) {
      gsap.from(line, {
        scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        scaleX: 0, transformOrigin: 'left center',
        duration: 1.0, ease: 'power3.out'
      });
    });
  }

})();
