/* 이음치과 홈 (2026-11 리뉴얼) — 연출. 공통 동작은 renew.js */
(function () {
  var html = document.documentElement
  var $ = function (s, r) { return (r || document).querySelector(s) }
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) }
  if (html.classList.contains('fx') && (!window.gsap || !window.ScrollTrigger)) { html.classList.remove('fx'); html.classList.add('rm') }
  var FX = html.classList.contains('fx')

  if (!FX) return

  gsap.registerPlugin(ScrollTrigger)
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches

  /* ── 관성 스크롤 ── */
  var lenis = null
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true }); window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(function (t) { lenis.raf(t * 1000) })
    gsap.ticker.lagSmoothing(0)
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href'); if (id.length < 2) return
        var el = $(id); if (!el) return
        e.preventDefault(); lenis.scrollTo(el, { offset: id === '#top' ? 0 : -10, duration: 1.6 })
      })
    })
  }

  /* ══════════ 1. 무대 ══════════ */
  var pin = $('.stage-pin'), light = $('#light'), ring = $('#ring'), stage = $('#stage')
  var L = { x: innerWidth * .68, y: innerHeight * .4, px: null, py: null, k: 0, g: 0, moved: false }
  var W = innerWidth, H = innerHeight

  function alignHero() {
    var dh = $('.beat-hero'), lh = $('.light-hero'); if (!dh || !lh) return
    var pr = pin.getBoundingClientRect()
    ;['.tag', '.hero-h'].forEach(function (s) {
      var a = $(s, dh).getBoundingClientRect(), b = $(s, lh)
      b.style.cssText = 'position:absolute;margin:0;left:' + (a.left - pr.left) + 'px;top:' + (a.top - pr.top) + 'px;width:' + a.width + 'px'
    })
    lh.style.padding = '0'
  }
  function size() { W = innerWidth; H = pin.offsetHeight || innerHeight; alignHero() }
  size(); addEventListener('resize', size)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { alignHero(); ScrollTrigger.refresh() })

  function setPointer(x, y) { L.px = x; L.py = y; L.moved = true }
  addEventListener('mousemove', function (e) { setPointer(e.clientX, e.clientY) })
  pin.addEventListener('touchstart', function (e) { var t = e.touches[0]; setPointer(t.clientX, t.clientY) }, { passive: true })
  pin.addEventListener('touchmove', function (e) { var t = e.touches[0]; setPointer(t.clientX, t.clientY) }, { passive: true })
  pin.addEventListener('touchend', function () { L.moved = false }, { passive: true })

  var stageOn = true, wasFull = false, litNow = false
  gsap.ticker.add(function (time) {
    if (!stageOn) return
    var tx, ty
    if (L.moved && L.px != null) { tx = L.px; ty = L.py }
    else { tx = W * (.62 + .2 * Math.sin(time * .55)); ty = H * (.4 + .17 * Math.sin(time * .83 + 1)) }
    L.x += (tx - L.x) * .12; L.y += (ty - L.y) * .12
    var k = L.k, kk = Math.sqrt(k)
    var cx = L.x + (W / 2 - L.x) * kk, cy = L.y + (H / 2 - L.y) * kk
    var base = Math.max(64, Math.min(150, W * .095)) * (1 + .05 * Math.sin(time * 2.2)) * L.g
    var r = base + k * Math.hypot(W, H) * .62
    var full = k >= .999
    if (full !== wasFull) { light.classList.toggle('full', full); wasFull = full }
    if (!full) {
      pin.style.setProperty('--lx', cx.toFixed(1) + 'px'); pin.style.setProperty('--ly', cy.toFixed(1) + 'px'); pin.style.setProperty('--lr', r.toFixed(1) + 'px')
      ring.style.transform = 'translate(' + (cx - r).toFixed(1) + 'px,' + (cy - r).toFixed(1) + 'px)'
      ring.style.width = ring.style.height = (r * 2).toFixed(1) + 'px'
    }
    ring.style.opacity = Math.max(0, 1 - k * 2.2)
    if ((k > .5) !== litNow) { litNow = k > .5; nav.classList.toggle('rn-lit', litNow) }
  })

  var nav = $('#rnNav'), dock = $('.rn-dock')
  ;['d1', 'd2', 'd3', 'd4'].forEach(function (n) {
    var c = $('.dark [data-beat="' + n + '"]').cloneNode(true)
    c.classList.add('clone'); c.setAttribute('aria-hidden', 'true'); light.insertBefore(c, $('.light-veil'))
  })
  var tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: 'bottom bottom', scrub: .7,
      onToggle: function (s) { stageOn = s.isActive || s.progress === 0 },
      onUpdate: function (s) { if (dock) dock.classList.toggle('show', s.progress > .08) }
    }
  })
  function beat(name, at, hold, last) {
    $$('[data-beat="' + name + '"]').forEach(function (el) { beat1(el, at, hold, last) })
  }
  function beat1(el, at, hold, last) {
    var ls = $$('.l', el), no = $('.no', el)
    tl.set(el, { autoAlpha: 1 }, at)
    if (no) tl.fromTo(no, { opacity: 0 }, { opacity: .55, duration: 2 }, at)
    tl.fromTo(ls, { opacity: 0, yPercent: 70, rotateX: -35 }, { opacity: function (i, t) { return t.classList.contains('whisper') ? .5 : t.classList.contains('sm') ? .7 : 1 }, yPercent: 0, rotateX: 0, duration: 3, stagger: .9, transformOrigin: '50% 100%' }, at)
    if (!last) {
      var out = at + 3 + (ls.length - 1) * .9 + hold
      tl.to(el, { autoAlpha: 0, y: -70, duration: 2.4, ease: 'power2.in' }, out)
      tl.set(el, { y: 0 }, out + 2.5)
    }
  }
  tl.to('#stageBar', { scaleX: 1, duration: 100, ease: 'none' }, 0)
  tl.to('.scroll-hint', { opacity: 0, duration: 3 }, 2)
  tl.to('.beat-hero', { autoAlpha: 0, y: -90, duration: 4, ease: 'power2.in' }, 5)
  tl.to('.light-hero', { autoAlpha: 0, y: -90, duration: 4, ease: 'power2.in' }, 5)
  beat('d1', 10, 4)
  beat('d2', 21, 4)
  beat('d3', 34, 4)
  beat('d4', 48, 20)
  tl.to(L, { k: 1, duration: 13, ease: 'power2.in' }, 51)
  tl.to('.light-veil', { opacity: 1, duration: 8, ease: 'none' }, 56)
  tl.to('.light-photo', { scale: 1, duration: 13, ease: 'none' }, 51)
  beat('l1', 62, 5)
  beat('l2', 76, 3.4)
  beat('l3', 87.5, 0, true)
  tl.to('.loop-a', { strokeDashoffset: 0, duration: 11, ease: 'power1.inOut' }, 87)
  tl.to('.loop-b', { strokeDashoffset: 0, duration: 9, ease: 'power1.inOut' }, 89.5)

  /* ── 인트로 ── */
  var intro = gsap.timeline()
  intro.to('.intro-loop path', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
    .to('.intro', { yPercent: -100, duration: .95, ease: 'power4.inOut' }, '+=.1')
    .from('.beat-hero .hero-h .l', { yPercent: 60, opacity: 0, duration: 1.2, stagger: .1, ease: 'power4.out' }, '-=.45')
    .from('.beat-hero .tag, .hero-side > *', { y: 24, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out' }, '-=.9')
    .to(L, { g: 1, duration: 1.4, ease: 'elastic.out(1,.6)' }, '-=.9')
    .set('.intro', { display: 'none' })

  /* ── 내비: 무대 밖에서는 흰 바, 내릴 땐 숨김 ── */
  ScrollTrigger.create({
    trigger: stage, start: 'bottom top+=80', onEnter: function () { nav.classList.add('rn-solid') }, onLeaveBack: function () { nav.classList.remove('rn-solid') }
  })
  /* ── 낱말 채우기 ── */
  $$('[data-fill]').forEach(function (el) {
    $$('.l', el).forEach(function (l) {
      l.innerHTML = l.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>' }).join(' ')
    })
    var ws = $$('.w', el)
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: true,
      onUpdate: function (s) { var n = Math.round(s.progress * ws.length); ws.forEach(function (w, i) { w.classList.toggle('on', i < n) }) }
    })
  })

  /* ── 등장 ── */
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 90%', once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: .09, ease: 'power4.out', overwrite: true }) }
  })
  $$('.sec-h, .equip-h, .book-h, .doc-name').forEach(function (h) {
    gsap.from($$('.l', h).length ? $$('.l', h) : h, { yPercent: 55, opacity: 0, duration: 1.2, stagger: .1, ease: 'power4.out', scrollTrigger: { trigger: h, start: 'top 88%', once: true } })
  })

  /* ── 쌓이는 카드 ── */
  var cards = $$('.card')
  cards.forEach(function (c, i) {
    var img = $('.card-img img', c)
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } })
    if (cards[i + 1]) gsap.to(c, { scale: .93 - (cards.length - 2 - i) * .02, ease: 'none', scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top+=120', scrub: true } })
  })

  /* ── 띠 ── */
  gsap.to('[data-band]', { xPercent: -33.333, ease: 'none', scrollTrigger: { trigger: '.band', start: 'top bottom', end: 'bottom top', scrub: .6 } })

  /* ── 진료 가로 무대 (PC) ── */
  var mm = gsap.matchMedia()
  mm.add('(min-width: 901px)', function () {
    var svc = $('.svc'), track = $('#svcTrack'), now = $('#svcNow')
    var dist = function () { return Math.max(0, track.scrollWidth - innerWidth) }
    var setH = function () { svc.style.height = (innerHeight + dist() * 1.05) + 'px' }
    setH()
    ScrollTrigger.addEventListener('refreshInit', setH)
    var tw = gsap.to(track, {
      x: function () { return -dist() }, ease: 'none',
      scrollTrigger: {
        trigger: svc, start: 'top top', end: 'bottom bottom', scrub: .6, invalidateOnRefresh: true,
        onUpdate: function (s) { now.textContent = '0' + Math.min(5, 1 + Math.floor(s.progress * 5)) }
      }
    })
    $$('.sv', track).forEach(function (c, i) {
      gsap.from(c, { y: 90 + i * 14, opacity: 0, rotate: 3, duration: 1.2, ease: 'power4.out', delay: i * .06, scrollTrigger: { trigger: svc, start: 'top 55%', once: true } })
    })
    return function () { ScrollTrigger.removeEventListener('refreshInit', setH); svc.style.height = ''; tw.kill() }
  })
  $$('.sv').forEach(function (c) {
    c.addEventListener('mousemove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px') })
  })

  /* ── 원장: 리본·책 ── */
  gsap.fromTo('.doc-loop', { xPercent: -12, rotate: -8 }, { xPercent: 12, rotate: 6, ease: 'none', scrollTrigger: { trigger: '.doc-photo', start: 'top bottom', end: 'bottom top', scrub: true } })
  $$('[data-tilt]').forEach(function (b) {
    var img = $('img', b)
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
      img.style.transform = 'rotateY(' + (-14 + x * 26) + 'deg) rotateX(' + (3 - y * 16) + 'deg)'
    })
    b.addEventListener('mouseleave', function () { img.style.transform = '' })
  })
  gsap.fromTo('.book-cover', { y: 60 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } })

  /* ── 시간표 막대 ── */
  gsap.from('.bar .open', { scaleX: 0, duration: 1.4, ease: 'power4.out', stagger: .12, scrollTrigger: { trigger: '.hours', start: 'top 78%', once: true } })
  gsap.from('.hours', { y: 80, opacity: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.hours', start: 'top 90%', once: true } })

  /* ── 공간 사진 시차 ── */
  $$('[data-par]').forEach(function (f) {
    var v = +f.getAttribute('data-par') * (innerWidth < 760 ? .4 : 1)
    gsap.fromTo(f, { y: v }, { y: -v, ease: 'none', scrollTrigger: { trigger: '.space-grid', start: 'top bottom', end: 'bottom top', scrub: true } })
  })

  /* ── 전화번호 ── */
  gsap.from('.rn-tel .l', { yPercent: 80, opacity: 0, duration: 1.3, stagger: .12, ease: 'power4.out', scrollTrigger: { trigger: '.rn-tel', start: 'top 88%', once: true } })

  addEventListener('load', function () { alignHero(); ScrollTrigger.refresh() })
})()
