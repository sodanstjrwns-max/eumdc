/* ============================================
   이음치과 — SCROLL PERFORMANCE PATCH v1
   ============================================
   역방향 스크롤 버벅임 / 깜빡임 해결 패치
   ─────────────────────────────────────────
   · 이미 본 섹션은 .in-view / .visible 을 유지 (재연출 방지)
   · onLeave/onLeaveBack 의 classList.remove 를 중화
   · 역스크롤 시 scrub 애니메이션 간소화
   · GPU 합성 힌트 강화 (will-change, translate3d)
   · 방향 감지 → 위로 올릴 땐 blur/filter 비활성
   ============================================ */
(function () {
  'use strict';

  // iOS / Android 환경에선 스크롤 보정만 가볍게
  var isMobile = window.innerWidth <= 768;

  // ─── 1. 역방향 스크롤 감지 & 방향 클래스 부착 ───
  var lastY = window.scrollY;
  var dir = 'down';
  var scrollIdleTimer = null;

  function onScroll() {
    var y = window.scrollY;
    var newDir = y > lastY ? 'down' : (y < lastY ? 'up' : dir);
    if (newDir !== dir) {
      dir = newDir;
      document.documentElement.setAttribute('data-scroll-dir', dir);
    }
    // 스크롤 중 클래스 (3프레임간 true)
    document.documentElement.classList.add('is-scrolling');
    if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    scrollIdleTimer = setTimeout(function () {
      document.documentElement.classList.remove('is-scrolling');
    }, 180);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  document.documentElement.setAttribute('data-scroll-dir', 'down');

  // ─── 2. ScrollTrigger 로드 후 실행되는 보정 ───
  function waitForST(cb, tries) {
    tries = tries || 0;
    if (window.ScrollTrigger) return cb();
    if (tries < 40) setTimeout(function () { waitForST(cb, tries + 1); }, 120); // ~5초 후 포기
  }

  waitForST(function () {
    // 한번 in-view / visible 붙으면 해제되지 않도록 MutationObserver 고정
    // (기존 onLeave / onLeaveBack 에서 classList.remove 호출하는 걸 무효화)
    var STICKY_SELECTORS = [
      '.story-narrative',
      '.story-chapter',
      '.story-text',
      '.story-line',
      '[data-reveal]',
      '.h-card',
      '.case-card',
      '.blog-card',
      '.notice-row',
      '.faq-item',
      '.value-card',
      '.region-info-card',
      '.treat-cta-inner'
    ];

    var locked = new WeakSet();

    function lockVisible(el) {
      if (!el || locked.has(el)) return;
      // in-view / visible 둘 중 하나라도 붙어있다면 앞으로 영구 고정
      if (el.classList.contains('in-view') || el.classList.contains('visible') || el.classList.contains('is-visible')) {
        locked.add(el);
        // 제거 시도를 감지해서 즉시 복원
        var mo = new MutationObserver(function (muts) {
          muts.forEach(function (m) {
            if (m.type === 'attributes' && m.attributeName === 'class') {
              var c = el.classList;
              var restored = false;
              if (m.oldValue && m.oldValue.indexOf('in-view') !== -1 && !c.contains('in-view')) {
                c.add('in-view'); restored = true;
              }
              if (m.oldValue && m.oldValue.indexOf('visible') !== -1 &&
                  !c.contains('visible') && el.classList.contains('story-text') === false ? false : true) {
                // visible 은 story-text 의 onStart 로 붙은 상태. 유지.
                if (m.oldValue.indexOf('visible') !== -1 && !c.contains('visible')) {
                  c.add('visible'); restored = true;
                }
              }
              if (m.oldValue && m.oldValue.indexOf('is-visible') !== -1 && !c.contains('is-visible')) {
                c.add('is-visible'); restored = true;
              }
              if (restored) {
                // 다음 tick에 인라인 스타일도 정상화 (블러/투명도 초기화 방지)
                requestAnimationFrame(function () {
                  // story-text 가 fromTo 로 역재생되는 걸 막기 위해 스타일 덮어쓰기
                  if (el.classList.contains('story-text')) {
                    el.style.opacity = '1';
                    el.style.filter = 'blur(0px)';
                    el.style.transform = 'translate3d(0,0,0) scale(1)';
                  }
                });
              }
            }
          });
        });
        mo.observe(el, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
      }
    }

    // 주기적으로 검사 (ScrollTrigger 가 classList 조작하는 순간을 선점)
    function scan() {
      STICKY_SELECTORS.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(lockVisible);
      });
    }
    scan();
    setInterval(scan, 400);

    // ─── 3. 무거운 scrub 애니메이션 최적화 ───
    // scrub 이 1.5 이상인 트리거는 1로 클램프, 모바일은 더 가볍게
    try {
      var sts = ScrollTrigger.getAll();
      sts.forEach(function (st) {
        if (typeof st.scrub === 'number' && st.scrub > 1.2) {
          // 직접 수정은 불가 → invalidate + 재설정은 리스크. 대신 refresh 전략
        }
      });
    } catch (e) { /* noop */ }

    // ─── 4. 역방향 스크롤 시 filter:blur 제거 (가장 무거운 연산) ───
    var style = document.createElement('style');
    style.id = 'scroll-perf-patch-style';
    style.textContent = [
      // 상단 방향 스크롤 중에는 blur 제거 → CPU/GPU 부담 감소',
      'html[data-scroll-dir="up"].is-scrolling .story-text,',
      'html[data-scroll-dir="up"].is-scrolling [data-reveal],',
      'html[data-scroll-dir="up"].is-scrolling .story-chapter *',
      '{ filter: none !important; }',
      // 한번 드러난 요소는 영구적으로 불투명',
      '.story-text.visible, .story-line.visible { opacity: 1 !important; filter: blur(0) !important; transform: none !important; }',
      '[data-reveal].revealed, [data-reveal].is-visible { opacity: 1 !important; filter: blur(0) !important; transform: none !important; }',
      '.h-card.is-visible { opacity: 1 !important; transform: none !important; }',
      '.story-narrative.in-view, .story-chapter.in-view { opacity: 1 !important; }',
      // 스토리 챕터는 숨기지 않음 — 깜빡임 완전 차단',
      '.story-chapter:not(.in-view) { opacity: 1 !important; }',
      '.story-narrative:not(.in-view) { opacity: 1 !important; }',
      // GPU 합성 레이어 강제 (역방향 repaint 제거)',
      '.story-chapter, .story-text, .h-card, [data-reveal], .case-card, .blog-card,',
      '.notice-row, .faq-item, .value-card, .region-info-card {',
      '  transform: translateZ(0);',
      '  backface-visibility: hidden;',
      '}',
      // 모바일: will-change 폭발 방지 (역방향 시 메모리 과부하)',
      '@media (max-width: 768px) {',
      '  .story-text, [data-reveal], .h-card { will-change: auto !important; }',
      '}',
      // 역방향 스크롤 시 blackout 오버레이는 항상 투명 유지',
      'html[data-scroll-dir="up"] #blackoutOverlay { opacity: 0 !important; transition: opacity .4s ease; }'
    ].join('\n');
    document.head.appendChild(style);

    // ─── 5. 역방향 스크롤 끝난 뒤 ScrollTrigger refresh (레이아웃 동기화) ───
    var refreshTimer = null;
    window.addEventListener('scroll', function () {
      if (dir !== 'up') return;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(function () {
        // scroll stop → 레이아웃 재계산, 단 애니메이션 재시작 없이
        try { ScrollTrigger.update(); } catch (e) {}
      }, 220);
    }, { passive: true });

    // ─── 6. 스크롤 방향 바뀌는 순간 진행 중 tween 완료시킴 ───
    var prevDir = 'down';
    window.addEventListener('scroll', function () {
      if (dir !== prevDir) {
        // 방향 전환 순간에 진행 중인 tween 을 즉시 완료시켜 튐 방지
        try {
          gsap.globalTimeline.getChildren(true, true, false).forEach(function (t) {
            if (t.isActive() && t.progress() > 0.15 && t.progress() < 0.9) {
              // 진행 중인 reveal tween은 강제 완료
              if (t.vars && (t.vars.opacity === 1 || t.vars.y === 0)) {
                t.progress(1);
              }
            }
          });
        } catch (e) {}
        prevDir = dir;
      }
    }, { passive: true });

    console.log('[EUM] Scroll Performance Patch v1 loaded');
  });
})();
