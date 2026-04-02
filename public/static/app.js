/* ============================================
   이음치과의원 - Interactive Scripts
   ============================================ */

(function () {
  'use strict';

  // === Preloader ===
  window.addEventListener('load', function () {
    setTimeout(function () {
      var preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.classList.add('loaded');
        // Start animations after preloader
        setTimeout(initScrollAnimations, 300);
      }
    }, 1800);
  });

  // === Navigation Scroll ===
  var navbar = document.getElementById('navbar');
  var lastScrollY = 0;

  function handleNavScroll() {
    var scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // === Mobile Menu ===
  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    var mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // === Smooth Scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // === Scroll Animations (Intersection Observer) ===
  function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var delay = entry.target.getAttribute('data-delay') || 0;
              setTimeout(function () {
                entry.target.classList.add('animated');
              }, parseInt(delay));
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show all
      elements.forEach(function (el) {
        el.classList.add('animated');
      });
    }
  }

  // === Floating CTA ===
  var floatingCta = document.getElementById('floatingCta');

  function handleFloatingCta() {
    if (window.scrollY > 600) {
      floatingCta.classList.add('visible');
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  if (floatingCta) {
    window.addEventListener('scroll', handleFloatingCta, { passive: true });
  }

  // === Active Nav Link Highlighting ===
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-link');

  function highlightNav() {
    var scrollPos = window.scrollY + 150;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinksAll.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // === Parallax-like subtle hero effect ===
  var heroBg = document.querySelector('.hero-bg-pattern');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
      }
    }, { passive: true });
  }

  // === Handle preloader skip on fast connections ===
  if (document.readyState === 'complete') {
    setTimeout(function () {
      var preloader = document.getElementById('preloader');
      if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        setTimeout(initScrollAnimations, 300);
      }
    }, 2000);
  }

})();
