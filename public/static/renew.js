/* 이음치과 2026-11 리뉴얼 — 공통 틀 동작 (모든 페이지) */
(function () {
  var d = document, html = d.documentElement
  var $ = function (s, r) { return (r || d).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)) }
  var nav = $('#rnNav'), menu = $('#rnMenu'), btn = $('#rnMenuBtn')

  /* ── 전체 메뉴 ── */
  if (nav && menu && btn) {
    var open = false
    var set = function (v) {
      open = v
      menu.classList.toggle('rn-on', v); nav.classList.toggle('rn-open', v)
      menu.setAttribute('aria-hidden', v ? 'false' : 'true'); btn.setAttribute('aria-expanded', v ? 'true' : 'false')
      btn.setAttribute('aria-label', v ? '전체 메뉴 닫기' : '전체 메뉴 열기')
      html.style.overflow = v ? 'hidden' : ''
      if (window.__lenis) { v ? window.__lenis.stop() : window.__lenis.start() }
    }
    btn.addEventListener('click', function () { set(!open) })
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) set(false) })
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { set(false) }) })
  }

  /* ── 현재 위치 표시 ── */
  var path = location.pathname.replace(/\/$/, '') || '/'
  $$('.rn-links a').forEach(function (a) {
    var h = a.getAttribute('href')
    if (h !== '/' && (path === h || path.indexOf(h + '/') === 0)) a.setAttribute('aria-current', 'page')
  })

  /* ── 내릴 땐 숨기고 올릴 땐 보이는 내비 ── */
  if (nav) {
    var lastY = window.scrollY, tick = false
    addEventListener('scroll', function () {
      if (tick) return; tick = true
      requestAnimationFrame(function () {
        var y = window.scrollY
        if (!nav.classList.contains('rn-open')) {
          if (y > lastY + 6 && y > 240 && nav.classList.contains('rn-solid')) nav.classList.add('rn-hide')
          else if (y < lastY - 6 || y < 240) nav.classList.remove('rn-hide')
        }
        lastY = y; tick = false
      })
    }, { passive: true })
  }

  /* ── 지금 진료 중? (한국 시간 기준, 공휴일은 판단하지 않음) ── */
  ;(function () {
    var st = $('#hState'), ck = $('#hClock'), nv = $('#rnLive')
    if (!st && !ck && !nv) return
    function run() {
      var parts = {}
      try {
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value })
      } catch (e) { return }
      var h = +parts.hour % 24, m = +parts.minute, t = h + m / 60, day = parts.weekday
      var key = day === 'Sun' ? 'sun' : day === 'Sat' ? 'sat' : 'wk'
      var S = { wk: [12, 16, 17, 21], sat: [10, 13, 14, 17] }[key]
      var cls = '', long = '', short = ''
      var hh = function (x) { return (x < 10 ? '0' : '') + x + ':00' }
      if (!S) { long = '오늘은 정기휴무'; short = '오늘 휴진' }
      else if (t < S[0]) { long = '진료 전 · ' + hh(S[0]) + '부터'; short = hh(S[0]) + ' 진료 시작' }
      else if (t < S[1]) { cls = 'is-open'; long = '지금 진료 중'; short = '진료 중 · ' + hh(S[3]) + '까지' }
      else if (t < S[2]) { cls = 'is-break'; long = '휴게 시간 · ' + hh(S[2]) + '부터'; short = '휴게 · ' + hh(S[2]) + ' 재개' }
      else if (t < S[3]) { cls = 'is-open'; long = '지금 진료 중'; short = '진료 중 · ' + hh(S[3]) + '까지' }
      else { long = '오늘 진료 종료'; short = '오늘 진료 종료' }
      if (st) { st.className = 'hours-state ' + cls; st.querySelector('b').textContent = long }
      if (nv) { nv.className = 'rn-live ' + cls; nv.querySelector('b').textContent = short }
      if (ck) ck.textContent = (h < 10 ? '0' : '') + h + ':' + parts.minute
      $$('.row[data-day]').forEach(function (r) {
        var on = r.getAttribute('data-day') === key
        r.classList.toggle('today', on)
        if (on) { var b = r.querySelector('.bar'); if (b) b.style.setProperty('--n', Math.max(0, Math.min(100, (t - 9) / 12 * 100)) + '%') }
      })
    }
    run(); setInterval(run, 20000)
  })()

  var fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches
  var FX = html.classList.contains('fx')

  /* ── 커서 점 ── */
  var dot = $('.rn-dot')
  if (dot && fine && FX) {
    var tx = -100, ty = -100, x = -100, y = -100, on = false
    addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; if (!on) { on = true; x = tx; y = ty; loop() } }, { passive: true })
    var loop = function () { x += (tx - x) * .28; y += (ty - y) * .28; dot.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; requestAnimationFrame(loop) }
    d.addEventListener('mouseover', function (e) { dot.classList.toggle('big', !!(e.target.closest && e.target.closest('[data-hover],a,button,summary'))) })
  }

  /* ── 하위 페이지 머리 구역: 빛이 커서를 따라옴 (터치 기기는 천천히 떠다님) ── */
  var heroes = $$('.sub-page .page-hero-mini, .sub-page .sub-hero, .sub-page .near-hero, .sub-page .rn-hero')
  if (heroes.length && FX) {
    heroes.forEach(function (hero) {
      if (fine) {
        hero.addEventListener('mousemove', function (e) {
          var r = hero.getBoundingClientRect()
          hero.style.setProperty('--gx', (e.clientX - r.left) + 'px'); hero.style.setProperty('--gy', (e.clientY - r.top) + 'px')
        }, { passive: true })
      } else {
        var t0 = performance.now()
        var drift = function (now) {
          var r = hero.getBoundingClientRect()
          if (r.bottom > 0 && r.top < innerHeight) {
            var t = (now - t0) / 1000
            hero.style.setProperty('--gx', (62 + 22 * Math.sin(t * .5)) + '%'); hero.style.setProperty('--gy', (40 + 22 * Math.sin(t * .8 + 1)) + '%')
          }
          requestAnimationFrame(drift)
        }
        requestAnimationFrame(drift)
      }
    })
  }
})()

/* ── 하위 페이지 본문: 스크롤 등장 ── */
;(function () {
  var html = document.documentElement
  if (!html.classList.contains('fx') || !('IntersectionObserver' in window)) return
  var main = document.querySelector('.sub-page .sub-page-content'); if (!main) return
  var SEL = '.mission-section-title,.treat-section-title,.rt-h2,.section-heading,.near-h2,.dict-section-title,.treat-cat-title,.mission-big-text,' +
    '.value-card,.equip-card,.gallery-masonry-item,.treat-card,.treat-benefit,.treat-step,.treat-dict-card,.treat-price-table,.price-group,.hours-table-wrap,.best-table-wrap,' +
    '.visit-info-card,.rt-why-card,.rt-related-card,.rt-nearby-card,.rt-visit-card,.rt-process-item,.cost-factor-card,.cost-info-card,.near-loc-card,.near-region-card,.near-treatment-card,.near-hour-card,' +
    '.region-card-ssr,.region-nearby-card,.mj-card,.doctor-grid-item,.doctor-detail-block,.doctor-book-wrap,.tx-answer-box,.prices-tldr-box,' +
    '.treat-cta-inner,.treat-cta-card,.rt-final-cta,.region-cta,.near-cta-box,.regions-cta-box,.faq-cta-inner,.dict-cta-inner,.faq-group,.login-page-card'
  var vh = window.innerHeight
  var els = Array.prototype.slice.call(main.querySelectorAll(SEL)).filter(function (el) { return el.getBoundingClientRect().top > vh * .92 })
  if (!els.length) return
  els.forEach(function (el) { el.classList.add('rn-rise') })
  var io = new IntersectionObserver(function (entries) {
    var batch = entries.filter(function (e) { return e.isIntersecting })
    batch.forEach(function (e, i) {
      e.target.style.setProperty('--rn-d', Math.min(i, 6) * .07 + 's')
      e.target.classList.add('rn-in'); io.unobserve(e.target)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: .01 })
  els.forEach(function (el) { io.observe(el) })
  /* 안전장치: 인쇄·탭 복귀 등으로 관찰이 안 된 요소도 3.5초 뒤엔 보이게 */
  setTimeout(function () { els.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('rn-in') }) }, 3500)
})()
