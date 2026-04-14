/* ============================================
   이음치과 — GSAP Motion & Interaction v1
   ScrollTrigger reveals, staggered animations,
   text splits, parallax sections, magnetic buttons
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
    waitForGsap(initGsapAnimations);
  });

  function initGsapAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // === Global ScrollTrigger defaults ===
    ScrollTrigger.defaults({
      toggleActions: 'play none none none'
    });

    // === STORY NARRATIVE — Scroll-triggered text sequence ===
    initStoryNarrative();

    // === Reveal animations for [data-reveal] elements ===
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // === Staggered grid reveals ===
    var grids = ['.treat-grid', '.doctors-grid', '.cases-grid', '.regions-grid',
      '.region-treat-grid', '.region-case-grid', '.footer-top-grid'];

    grids.forEach(function (sel) {
      var grid = document.querySelector(sel);
      if (!grid) return;
      // Use MutationObserver to watch for dynamically loaded content
      var observer = new MutationObserver(function () {
        var children = grid.children;
        if (children.length > 0) {
          observer.disconnect();
          gsap.from(children, {
            scrollTrigger: {
              trigger: grid,
              start: 'top 80%',
              once: true
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
          });
        }
      });
      observer.observe(grid, { childList: true });
    });

    // === Page hero title split animation ===
    gsap.utils.toArray('.page-title, .hero-title').forEach(function (title) {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 90%',
          once: true
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // === Section labels ===
    gsap.utils.toArray('.section-label').forEach(function (label) {
      gsap.from(label, {
        scrollTrigger: {
          trigger: label,
          start: 'top 90%',
          once: true
        },
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });

    // === Parallax hero backgrounds ===
    gsap.utils.toArray('.page-hero-mini, .region-hero, .treat-detail-hero').forEach(function (hero) {
      gsap.to(hero, {
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        },
        backgroundPositionY: '30%',
        ease: 'none'
      });
    });

    // === Horizontal scroll sections (treatment cards on main page) ===
    var hScroll = document.querySelector('.services-track');
    if (hScroll && hScroll.parentElement) {
      var totalWidth = hScroll.scrollWidth - window.innerWidth;
      if (totalWidth > 0) {
        gsap.to(hScroll, {
          scrollTrigger: {
            trigger: hScroll.parentElement,
            start: 'top top',
            end: '+=' + totalWidth,
            scrub: 1,
            pin: true,
            anticipatePin: 1
          },
          x: -totalWidth,
          ease: 'none'
        });
      }
    }

    // === Fade-up for cards, FAQ items, blog cards, notice rows ===
    var cardSelectors = ['.case-card', '.blog-card', '.notice-row', '.faq-item',
      '.treat-cta-inner', '.region-info-card', '.value-card', '.equip-item'];
    
    cardSelectors.forEach(function (sel) {
      gsap.utils.toArray(sel).forEach(function (card, i) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true
          },
          y: 30,
          opacity: 0,
          duration: 0.5,
          delay: Math.min(i * 0.05, 0.3),
          ease: 'power2.out'
        });
      });
    });

    // === Magnetic effect on data-hover elements ===
    if (window.innerWidth > 1024) {
      document.querySelectorAll('[data-hover]').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          gsap.to(el, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
      });
    }

    // === Counter animations (overwrite vanilla version) ===
    gsap.utils.toArray('.stat-number').forEach(function (el) {
      var target = parseInt(el.dataset.count || el.textContent);
      if (isNaN(target)) return;
      var suffix = el.dataset.suffix || '';
      var obj = { val: 0 };
      gsap.to(obj, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(obj.val).toLocaleString() + suffix;
        }
      });
    });

    // === Smooth appearance for section headings ===
    gsap.utils.toArray('.section-heading, h2.treat-cat-title').forEach(function (h) {
      gsap.from(h, {
        scrollTrigger: { trigger: h, start: 'top 85%', once: true },
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out'
      });
    });

    // === Footer staggered reveal ===
    var footer = document.querySelector('.footer-full');
    if (footer) {
      var footerCols = footer.querySelectorAll('.footer-nav-col, .footer-brand-col');
      if (footerCols.length > 0) {
        gsap.from(footerCols, {
          scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    }

    // === Menu open animation ===
    var menuBtn = document.getElementById('menuBtn');
    var fullMenu = document.getElementById('fullMenu');
    if (menuBtn && fullMenu) {
      var menuLinks = fullMenu.querySelectorAll('.menu-link');
      menuBtn.addEventListener('click', function () {
        if (fullMenu.classList.contains('active')) {
          gsap.to(menuLinks, {
            y: -20,
            opacity: 0,
            stagger: 0.03,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: function () {
              fullMenu.classList.remove('active');
            }
          });
        } else {
          fullMenu.classList.add('active');
          gsap.fromTo(menuLinks, 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power3.out', delay: 0.2 }
          );
        }
      });
    }

    // === Scroll progress bar ===
    var progressBar = document.getElementById('scrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgress';
      progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#2563eb,#7c3aed);z-index:10000;transform-origin:left;transform:scaleX(0);';
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

    // === Marquee continuous animation ===
    gsap.utils.toArray('.marquee-track').forEach(function (track) {
      var w = track.scrollWidth / 2;
      gsap.to(track, {
        x: -w,
        duration: 30,
        ease: 'none',
        repeat: -1
      });
    });

    // === Image reveal (clip-path) ===
    gsap.utils.toArray('.gallery-item img, .blog-inline-figure img').forEach(function (img) {
      gsap.from(img, {
        scrollTrigger: { trigger: img, start: 'top 85%', once: true },
        clipPath: 'inset(100% 0 0 0)',
        duration: 1,
        ease: 'power3.out'
      });
    });

    console.log('[EUM] GSAP animations initialized');
  }

  // ═══════════════════════════════════════════
  // STORY NARRATIVE ENGINE
  // Each .story-line enters viewport → text becomes visible
  // with staggered, mood-appropriate timing
  // ═══════════════════════════════════════════
  function initStoryNarrative() {
    var storyLines = document.querySelectorAll('.story-line');
    if (!storyLines.length) return;

    storyLines.forEach(function (line) {
      var text = line.querySelector('.story-text');
      if (!text) return;

      var storyIndex = parseInt(line.dataset.story) || 0;

      // Determine timing based on story beat
      var duration = 0.9;
      var startPos = 'top 70%';
      var yOffset = 50;

      // Question beats — reveal sooner, bigger motion
      if (text.classList.contains('story-question')) {
        duration = 1.2;
        yOffset = 60;
        startPos = 'top 75%';
      }

      // Whisper/small — subtle entrance
      if (text.classList.contains('story-whisper') || text.classList.contains('story-small')) {
        duration = 1.0;
        yOffset = 20;
      }

      // Pause — quick snap
      if (text.classList.contains('story-pause')) {
        duration = 0.6;
        yOffset = 0;
      }

      // Turn — dramatic entrance
      if (text.classList.contains('story-turn')) {
        duration = 1.4;
        yOffset = 80;
      }

      // Finale — big reveal
      if (text.classList.contains('story-finale')) {
        duration = 1.5;
        yOffset = 100;
        startPos = 'top 65%';
      }

      ScrollTrigger.create({
        trigger: line,
        start: startPos,
        once: true,
        onEnter: function () {
          text.classList.add('visible');
          // GSAP enhancement on top of CSS transition
          gsap.fromTo(text, 
            { y: yOffset, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: duration, 
              ease: 'power3.out',
              clearProps: 'transform'
            }
          );
        }
      });
    });

    // === Climax chapter — background transition ===
    var climax = document.getElementById('storyChapter6');
    if (climax) {
      // Parallax-like effect on the finale text
      var finaleText = climax.querySelector('.story-finale');
      if (finaleText) {
        gsap.fromTo(finaleText, 
          { scale: 0.85 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: climax,
              start: 'top 80%',
              end: 'center center',
              scrub: 1
            },
            ease: 'none'
          }
        );
      }
    }

    // === Turn chapter — subtle bg color shift ===
    var turnChapter = document.getElementById('storyChapter4');
    if (turnChapter) {
      gsap.fromTo(turnChapter,
        { backgroundColor: 'rgba(245,247,250,0)' },
        {
          backgroundColor: 'rgba(245,247,250,1)',
          scrollTrigger: {
            trigger: turnChapter,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          },
          ease: 'none'
        }
      );
    }
  }
})();
