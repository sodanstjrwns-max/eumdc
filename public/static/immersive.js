/* 이음치과 메인 스크롤 몰입 연출 — 기존 시네마틱 엔진(gsap-init.js)을 보완하는 얇은 층
   - 기존 엔진이 맡는 히어로·이야기·암전·필러·진료·원장·약속·장비 섹션은 건드리지 않는다
   - 이 층은 관성 스크롤 + 아직 움직임이 없던 저서 표지·연락처·지역 안내·FAQ 만 맡는다
   - 주제: '잇다' — 선이 이어지고, 숫자가 한 자씩 이어 붙고, 카드가 사슬처럼 이어 들어옴
   - 글자는 모두 HTML에 그대로(크롤러·AEO 영향 없음), 동작 줄이기면 아무것도 하지 않음 */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  // gsap-init.js(DOMContentLoaded)가 먼저 자리를 잡은 뒤 시작
  function boot() { setTimeout(start, 220); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  function start() {
  var root = document.documentElement;
  root.classList.add('mx');
  var mobile = matchMedia('(max-width: 767px)').matches;
  var fine = matchMedia('(pointer: fine)').matches;

  // 1) 관성 스크롤 — 마우스·트랙패드 + 표준 모드만 (터치는 기본 스크롤)
  var lenis = null;
  if (fine && window.Lenis && document.compatMode === 'CSS1Compat') {
    // 진료 가로 트랙은 휠을 가로로 바꾸는 기존 동작을 그대로 쓰도록 Lenis 가 손대지 않게
    document.querySelectorAll('.services-horizontal').forEach(function (s) { s.setAttribute('data-lenis-prevent-wheel', ''); });
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        lenis.scrollTo(target, { offset: -72 });
      }, true);
    });
  }

  // ── 엔진: 화면에 들어오면 한 번 재생, 빠르게 지나쳐도 끝 상태 보장
  var TIMING = ['duration', 'ease', 'stagger', 'delay'];
  var claimed = [];
  function claim(list) { gsap.utils.toArray(list).forEach(function (el) { claimed.push(el); }); }
  function isClaimed(el) { return claimed.some(function (c) { return c === el || c.contains(el) || el.contains(c); }); }
  function enter(targets, vars, trigger, startAt) {
    targets = gsap.utils.toArray(targets);
    if (!targets.length) return null;
    claim(targets);
    var from = {}, to = { opacity: 1, x: 0, y: 0, xPercent: 0, yPercent: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, paused: true,
      onStart: function () { gsap.set(targets, { transition: 'none' }); },
      onComplete: function () { gsap.set(targets, { clearProps: 'opacity,transform,transition,clipPath' }); } };
    Object.keys(vars).forEach(function (k) { (TIMING.indexOf(k) > -1 ? to : from)[k] = vars[k]; });
    if ('clipPath' in from) to.clipPath = 'inset(0% 0% 0% 0%)';
    var tw = gsap.fromTo(targets, from, to);
    var item = { tw: tw, el: trigger || targets[0] };
    pending.push(item);
    ScrollTrigger.create({ trigger: item.el, start: startAt || 'top 88%', once: true, onEnter: function () { play(item); } });
    return tw;
  }
  // 재생 + 탭이 숨겨져 프레임이 멈춰도 끝 상태 보장
  var pending = [];
  function play(item) {
    var i = pending.indexOf(item);
    if (i > -1) pending.splice(i, 1);
    if (item.tw.progress() > 0) return;
    item.tw.play();
    setTimeout(function () { if (item.tw.progress() < 1) item.tw.progress(1); }, (item.tw.totalDuration() + 0.6) * 1000);
  }
  // 한 번에 건너뛴 구간(앵커 이동·빠른 점프)은 콜백이 생략될 수 있으므로 화면 위·안에 있는 대기 연출을 모두 재생
  function sweep() {
    pending.slice().forEach(function (it) { if (it.el.getBoundingClientRect().top < innerHeight * 0.92) play(it); });
  }
  ScrollTrigger.addEventListener('scrollEnd', sweep);
  function splitWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var parts = node.textContent.split(/(\s+)/);
      if (parts.join('').trim() === '') return;
      var frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
        var w = document.createElement('span'); w.className = 'mx-w';
        var i = document.createElement('span'); i.className = 'mx-wi'; i.textContent = p;
        w.appendChild(i); frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    return el.querySelectorAll('.mx-wi');
  }
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return gsap.utils.toArray((ctx || document).querySelectorAll(sel)); };
  function scrub(target, from, to, st) {
    claim(target);
    return gsap.fromTo(target, from, Object.assign({ ease: 'none', scrollTrigger: Object.assign({ scrub: true }, st) }, to));
  }
  // 사진 시차: CSS translate 속성만 움직여 기존 hover 확대(transform)와 겹치지 않게
  function drift(img, box, amt) {
    if (!img || !box) return;
    box.classList.add('mx-par');
    gsap.fromTo(img, { translate: '0 ' + (-amt) + '%' }, { translate: '0 ' + amt + '%', ease: 'none',
      scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // 한 글자씩 감싸기 (전화번호 등 짧은 글)
  function splitChars(el) {
    var t = el.textContent;
    el.textContent = '';
    var out = [];
    Array.prototype.forEach.call(t, function (ch) {
      var w = document.createElement('span'); w.className = 'mx-w';
      var i = document.createElement('span'); i.className = 'mx-wi'; i.textContent = ch;
      w.appendChild(i); el.appendChild(w); out.push(i);
    });
    el.setAttribute('aria-label', t);
    return out;
  }

  // ── 원장 저서: 표지가 비스듬히 누운 책에서 정면으로 돌아섬 (카드 등장은 기존 엔진 그대로)
  var cover = $('.director-book-cover-wrap');
  if (cover) {
    scrub(cover, { rotateY: mobile ? -14 : -32, rotateX: 6, transformPerspective: 1100, transformOrigin: '0% 50%' },
      { rotateY: 0, rotateX: 0 }, { trigger: cover, start: 'top 95%', end: 'center 55%' });
  }

  // ── 연락처(마지막 막): 큰 전화번호가 한 자씩 이어 붙고, 진료시간 줄은 선이 그어지듯 왼쪽부터
  var contact = $('#section-contact');
  if (contact) {
    var num = $('.phone-number', contact);
    if (num) enter(splitChars(num), { yPercent: 115, duration: 0.9, ease: 'power4.out', stagger: 0.035 }, num, 'top 88%');
    var lbl = $('.phone-label', contact);
    if (lbl) enter(lbl, { y: 12, opacity: 0, duration: 0.8, ease: 'power3.out' }, lbl, 'top 90%');
    enter($$('.contact-address > p', contact), { y: 22, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, $('.contact-address', contact), 'top 90%');
    enter($$('.contact-actions > a', contact), { y: 18, scale: 0.9, opacity: 0, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.08 }, $('.contact-actions', contact), 'top 94%');
    var rows = $$('.hours-row', contact);
    if (rows.length) enter(rows, { clipPath: 'inset(0% 100% 0% 0%)', duration: 1, ease: 'power3.inOut', stagger: 0.12 }, rows[0], 'top 88%');
    enter($$('.hours-extra, .transport-item', contact), { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, $('.hours-extra', contact) || contact, 'top 92%');
    var cbg = $('.contact-bg', contact);
    if (cbg) scrub(cbg, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12 }, { trigger: contact, start: 'top bottom', end: 'bottom top' });
  }

  // ── 우리 동네 진료 안내: 제목 낱말, 사진 카드는 사슬처럼 앞 카드에 이어 들어오고, 지역 칩은 왼쪽부터 톡톡
  var hub = $('#section-region-hub');
  if (hub) {
    var ht = $('.region-hub-title', hub);
    if (ht) enter(splitWords(ht), { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.05 }, ht, 'top 88%');
    enter($$('.region-hub-sub, .mj-home-heading', hub), { y: 18, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, $('.region-hub-sub', hub) || hub, 'top 90%');
    var mj = $$('.mj-card-grid > li', hub);
    if (mj.length) enter(mj, { x: mobile ? 0 : -46, y: mobile ? 36 : 26, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.09 }, mj[0], 'top 88%');
    $$('.mj-card-img', hub).forEach(function (b) { drift($('img', b), b, 4); });
    $$('.region-hub-block', hub).forEach(function (blk) {
      var h3 = $('.region-hub-treatment', blk);
      if (h3) enter(h3, { x: -24, opacity: 0, duration: 0.8, ease: 'power3.out' }, blk, 'top 90%');
      var pills = $$('.region-hub-links > li', blk);
      if (pills.length) enter(pills, { y: 12, scale: 0.88, opacity: 0, duration: 0.55, ease: 'back.out(1.6)', stagger: 0.025, delay: 0.15 }, blk, 'top 90%');
    });
    enter($$('.region-hub-more > a', hub), { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, $('.region-hub-more', hub) || hub, 'top 95%');
  }

  // ── 자주 묻는 질문: 제목 낱말, 질문은 번호가 먼저 걸리고 글이 이어서
  var faq = $('#section-faq');
  if (faq) {
    var ft = $('.home-faq-title', faq);
    if (ft) enter(splitWords(ft), { yPercent: 110, duration: 1, ease: 'power4.out', stagger: 0.05 }, ft, 'top 88%');
    var fs = $('.home-faq-sub', faq);
    if (fs) enter(fs, { y: 16, opacity: 0, duration: 0.9, ease: 'power3.out' }, fs, 'top 90%');
    var items = $$('.home-faq-item', faq);
    if (items.length) {
      enter(items, { x: mobile ? 0 : -30, y: mobile ? 24 : 0, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, items[0], 'top 90%');
      enter($$('.home-faq-num', faq), { scale: 0.4, opacity: 0, duration: 0.6, ease: 'back.out(2.2)', stagger: 0.07, delay: 0.2 }, items[0], 'top 90%');
    }
    var fm = $('.home-faq-more a', faq);
    if (fm) enter(fm, { y: 14, opacity: 0, duration: 0.8, ease: 'power3.out' }, fm, 'top 95%');
  }

  // 주소에 #앵커가 있으면 — 트리거 계산이 브라우저의 앵커 이동을 끊으므로 다시 그 자리로
  var touched = false;
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, function () { touched = true; }, { once: true, passive: true }); });
  function toHash() {
    var id = location.hash;
    if (touched) return;
    if (id.length < 2) return;
    var t; try { t = document.querySelector(decodeURIComponent(id)); } catch (e) { return; }
    if (!t) return;
    var y = t.getBoundingClientRect().top + window.pageYOffset - 72;
    if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
  }
  ScrollTrigger.refresh();
  toHash();
  sweep();
  // 이미지가 늦게 로드되면 위치 다시 계산
  window.addEventListener('load', function () { ScrollTrigger.refresh(); toHash(); sweep(); });
  }
})();
