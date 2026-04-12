/** Main page JSX — REVOLUTIONARY REDESIGN v3 */
export function mainPage() {
  return (
    <div id="app">
      {/* Custom Cursor */}
      <div class="cursor" id="cursor"></div>
      <div class="cursor-follower" id="cursorFollower"></div>

      {/* === NAVIGATION === */}
      <nav id="nav">
        <a href="/" class="nav-brand" data-hover>이음</a>
        <div class="nav-center" id="navTime"></div>
        <button class="nav-menu-btn" id="menuBtn" data-hover>
          <span>MENU</span>
        </button>
        <div class="nav-progress" id="navProgress"></div>
      </nav>

      {/* Full Screen Menu */}
      <div id="fullMenu" class="full-menu">
        <div class="menu-overlay"></div>
        <div class="menu-content">
          <div class="menu-links">
            <a href="/#section-about" class="menu-link" data-hover data-index="01"><span>소개</span></a>
            <a href="/#section-services" class="menu-link" data-hover data-index="02"><span>진료</span></a>
            <a href="/cases" class="menu-link" data-hover data-index="03"><span>비포애프터</span></a>
            <a href="/blogs" class="menu-link" data-hover data-index="04"><span>블로그</span></a>
            <a href="/notices" class="menu-link" data-hover data-index="05"><span>공지사항</span></a>
            <a href="/faq" class="menu-link" data-hover data-index="06"><span>자주 묻는 질문</span></a>
            <a href="/dictionary" class="menu-link" data-hover data-index="07"><span>백과사전</span></a>
            <a href="/#section-director" class="menu-link" data-hover data-index="08"><span>의료진</span></a>
            <a href="/#section-contact" class="menu-link" data-hover data-index="09"><span>예약</span></a>
          </div>
          <div class="menu-footer">
            <div class="menu-footer-col">
              <span class="menu-label">LOCATION</span>
              <p>부산 강서구 명지국제8로 265</p>
            </div>
            <div class="menu-footer-col">
              <span class="menu-label">CONTACT</span>
              <p><a href="tel:051-206-5888">051-206-5888</a></p>
            </div>
            <div class="menu-footer-col">
              <span class="menu-label">HOURS</span>
              <p>월-목 12-21 / 토-일 10-17</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          HERO — Immersive Full-Screen
      ═══════════════════════════════════ */}
      <section class="section hero" id="section-hero" aria-label="이음치과의원 소개">
        <div class="hero-bg">
          <div class="hero-mesh" id="heroMesh" aria-hidden="true">
            <div class="mesh-blob mesh-blob-1"></div>
            <div class="mesh-blob mesh-blob-2"></div>
            <div class="mesh-blob mesh-blob-3"></div>
            <div class="mesh-blob mesh-blob-4"></div>
            <div class="mesh-blob mesh-blob-5"></div>
          </div>
          <div class="grain" aria-hidden="true"></div>
        </div>

        {/* Horizontal scan line effect */}
        <div class="hero-scan-line" id="heroScanLine" aria-hidden="true"></div>

        <div class="hero-content">
          <div class="hero-tag">
            <span class="tag-line" aria-hidden="true"></span>
            <span class="tag-text">EUM DENTAL CLINIC — BUSAN</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line"><span class="title-word" data-split>실력으로</span></span>
            <span class="title-line"><span class="title-word" data-split>신뢰를,</span></span>
            <span class="title-line accent"><span class="title-word" data-split>잇습니다.</span></span>
          </h1>

          {/* Hero Stats Counter */}
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="hero-stat-num" data-count="387">0</span>
              <span class="hero-stat-unit">+</span>
              <span class="hero-stat-label">리뷰 수</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-num" data-count="4.9">0</span>
              <span class="hero-stat-unit">★</span>
              <span class="hero-stat-label">네이버 평점</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat">
              <span class="hero-stat-num" data-count="8">0</span>
              <span class="hero-stat-unit">년</span>
              <span class="hero-stat-label">진료 경력</span>
            </div>
          </div>

          <div class="hero-bottom">
            <div class="hero-scroll-hint">
              <div class="scroll-line-wrap">
                <div class="scroll-line" id="scrollLine"></div>
              </div>
              <span>SCROLL TO EXPLORE</span>
            </div>
            <p class="hero-sub">환자의 불안을 확신으로 바꾸는 곳</p>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div class="marquee-band" aria-hidden="true">
        <div class="marquee-track">
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
        </div>
      </div>

      {/* GALLERY STRIP */}
      <div class="gallery-strip">
        <div class="gallery-track">
          <div class="gallery-item" data-hover><img src="/static/img/photo_7.jpg" alt="이음치과 접수" loading="lazy"/><div class="gallery-caption">RECEPTION</div></div>
          <div class="gallery-item" data-hover><img src="/static/img/photo_8.jpg" alt="이음치과 대기실" loading="lazy"/><div class="gallery-caption">WAITING</div></div>
          <div class="gallery-item" data-hover><img src="/static/img/photo_6.jpg" alt="이음치과 진료실" loading="lazy"/><div class="gallery-caption">TREATMENT</div></div>
          <div class="gallery-item" data-hover><img src="/static/img/photo_4.jpg" alt="이음치과 내부" loading="lazy"/><div class="gallery-caption">INTERIOR</div></div>
          <div class="gallery-item" data-hover><img src="/static/img/photo_9.jpg" alt="이음치과 편의공간" loading="lazy"/><div class="gallery-caption">AMENITY</div></div>
          <div class="gallery-item" data-hover><img src="/static/img/photo_1.jpg" alt="이음치과 로비" loading="lazy"/><div class="gallery-caption">LOBBY</div></div>
          <div class="gallery-item" aria-hidden="true"><img src="/static/img/photo_7.jpg" alt="" loading="lazy"/><div class="gallery-caption">RECEPTION</div></div>
          <div class="gallery-item" aria-hidden="true"><img src="/static/img/photo_8.jpg" alt="" loading="lazy"/><div class="gallery-caption">WAITING</div></div>
          <div class="gallery-item" aria-hidden="true"><img src="/static/img/photo_6.jpg" alt="" loading="lazy"/><div class="gallery-caption">TREATMENT</div></div>
          <div class="gallery-item" aria-hidden="true"><img src="/static/img/photo_4.jpg" alt="" loading="lazy"/><div class="gallery-caption">INTERIOR</div></div>
          <div class="gallery-item" aria-hidden="true"><img src="/static/img/photo_9.jpg" alt="" loading="lazy"/><div class="gallery-caption">AMENITY</div></div>
          <div class="gallery-item" aria-hidden="true"><img src="/static/img/photo_1.jpg" alt="" loading="lazy"/><div class="gallery-caption">LOBBY</div></div>
        </div>
      </div>

      {/* ABOUT — Manifesto */}
      <section class="section about-manifesto" id="section-about" aria-label="이음치과 소개">
        <div class="container-wide">
          <div class="manifesto-number">01</div>
          <div class="manifesto-text">
            <p class="reveal-text">모든 진료 과정에서</p>
            <p class="reveal-text">환자가 <em>충분히 이해</em>할 때까지 설명하고,</p>
            <p class="reveal-text">그 결과를 눈으로 <em>직접 증명</em>하여</p>
            <p class="reveal-text">환자의 <strong>불안</strong>을 <strong>확신</strong>으로 바꿉니다.</p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY — Split Screen */}
      <section class="section philosophy-split" id="section-philosophy">
        <div class="split-left">
          <div class="split-sticky">
            <span class="section-label">02 — PHILOSOPHY</span>
            <h2 class="split-title">우리가<br/><em>다른</em> 이유</h2>
          </div>
        </div>
        <div class="split-right">
          <div class="philosophy-card" data-reveal>
            <div class="card-num">01</div>
            <h3>투명성</h3>
            <p>모든 진료 과정을 환자가 충분히 이해할 때까지 설명합니다. 다른 병원에서 들은 진단이 궁금하시면, 솔직하게 세컨드 오피니언을 드립니다.</p>
          </div>
          <div class="philosophy-card" data-reveal>
            <div class="card-num">02</div>
            <h3>실력</h3>
            <p>진료 결과를 눈으로 직접 증명합니다. 디지털 가이드를 원내에서 직접 제작하고, 최고 수준의 기공소와 협업합니다.</p>
          </div>
          <div class="philosophy-card" data-reveal>
            <div class="card-num">03</div>
            <h3>신뢰</h3>
            <p>정직하게 치료를 잘하는 병원. 자신있게 추천할 수 있는 병원을 만듭니다.</p>
          </div>
        </div>
      </section>

      {/* MARQUEE 2 */}
      <div class="marquee-band dark" aria-hidden="true">
        <div class="marquee-track reverse">
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
        </div>
      </div>

      {/* SERVICES — Horizontal Scroll */}
      <section class="section services-horizontal" id="section-services" aria-label="이음치과 진료 안내">
        <div class="container-wide">
          <div class="services-header">
            <span class="section-label">03 — SERVICES</span>
            <h2 class="services-title">진료 안내</h2>
          </div>
        </div>
        <div class="horizontal-wrap">
          <div class="horizontal-track" id="horizontalTrack">
            <div class="h-card h-card-intro"><div class="h-card-inner"><p class="h-intro-text">충분한 설명,<br/>확실한 결과로<br/><em>최선의 선택</em>을<br/>함께합니다.</p></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">01</span><h3 class="h-card-title">임플란트</h3><span class="h-card-badge">SIGNATURE</span><p class="h-card-desc">원내 3D 프린터로 가이드를 직접 제작. CBCT와 구강스캐너 기반 정밀 진단.</p><div class="h-card-features"><span><a href="/dictionary/digital-guide" class="term-link">원내 가이드</a> 제작</span><span><a href="/dictionary/cbct" class="term-link">CBCT</a> 정밀 진단</span><span><a href="/dictionary/digital-impression" class="term-link">디지털 인상</a></span><span>최고 수준 기공소</span></div><div class="h-card-arrow">→</div><a href="/dictionary?service=implant" class="h-card-dict-link">임플란트 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">02</span><h3 class="h-card-title">심미보철</h3><span class="h-card-badge">RECOMMENDED</span><p class="h-card-desc">자연치아와 구별 불가한 정밀 보철로 아름다운 미소를 되찾아 드립니다.</p><div class="h-card-features"><span><a href="/dictionary/laminate" class="term-link">라미네이트</a></span><span><a href="/dictionary/all-ceramic" class="term-link">올세라믹</a></span><span>정밀 색조 매칭</span></div><div class="h-card-arrow">→</div><a href="/dictionary?service=aesthetic" class="h-card-dict-link">심미보철 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">03</span><h3 class="h-card-title">심미 레진</h3><p class="h-card-desc">자연치아 색상에 완벽히 맞춘 레진. 최소 삭제, 당일 치료.</p><div class="h-card-features"><span>자연 색상 매칭</span><span>최소 침습</span><span>당일 완료</span></div><div class="h-card-arrow">→</div><a href="/dictionary?service=resin" class="h-card-dict-link">레진 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">04</span><h3 class="h-card-title">턱관절</h3><p class="h-card-desc">턱관절 통증, 소리, 개구제한을 정밀 진단. 물리치료와 체계적 프로토콜.</p><div class="h-card-features"><span>물리치료</span><span>교합 분석</span><span>맞춤 스플린트</span></div><div class="h-card-arrow">→</div><a href="/dictionary?service=tmj" class="h-card-dict-link">턱관절 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">05</span><h3 class="h-card-title">일반진료</h3><p class="h-card-desc">충치, 신경치료, 사랑니, 잇몸치료, 스케일링. 기본에 충실하게.</p><div class="h-card-features"><span>충치 · 신경치료</span><span>사랑니 발치</span><span>잇몸 · 스케일링</span></div><div class="h-card-arrow">→</div><a href="/dictionary?service=general" class="h-card-dict-link">일반진료 관련 용어 보기 →</a></div></div>
          </div>
        </div>
      </section>

      {/* DIRECTOR */}
      <section class="section director-full" id="section-director" aria-label="대표원장 최효영 소개">
        <div class="container-wide">
          <div class="director-layout">
            <div class="director-visual">
              <div class="director-frame" data-hover>
                <img src="/static/img/photo_5.jpg" alt="이음치과의원 대표원장 최효영" class="director-photo" width="400" height="500" />
                <div class="frame-content">
                  <span class="frame-label">DIRECTOR</span>
                  <div class="frame-name">최효영</div>
                  <div class="frame-title">대표원장</div>
                </div>
              </div>
            </div>
            <div class="director-info">
              <span class="section-label">04 — DIRECTOR</span>
              <blockquote class="director-quote" data-reveal>"다른 사람들이 치과 이야기를 할 때<br/>정직하게 치료를 잘하는 병원이라며<br/>추천하는 곳을 만들고 싶습니다."</blockquote>
              <div class="credentials-grid">
                <div class="cred-block" data-reveal><h4>Education</h4><ul><li>강원대학교 치과대학 졸업</li></ul></div>
                <div class="cred-block" data-reveal><h4>Experience</h4><ul><li>전 사상연세비앤이치과병원 원장</li><li>전 다대치과의원 원장</li></ul></div>
                <div class="cred-block" data-reveal><h4>Membership</h4><ul><li>대한구강악면임플란트학회</li><li>대한치과보철학회</li><li>대한치과보존학회</li></ul></div>
                <div class="cred-block" data-reveal><h4>Training</h4><ul><li>Dentalbean Implant Course</li><li>Osstem Master · Oneguide Course</li><li>Doctor's Endo Seminar</li><li>Professional Expert Dentistry</li></ul></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISE — Our 4 Commitments */}
      <section class="section promise-section" id="section-promise" aria-label="이음치과의 약속">
        <div class="promise-bg" aria-hidden="true"><div class="grain"></div></div>
        <div class="container-wide">
          <div class="promise-header">
            <span class="section-label">05 — PROMISE</span>
            <h2 class="promise-main-title">이음의<br/><em>약속</em></h2>
          </div>
          <div class="promise-grid">
            <div class="promise-item" data-reveal data-num="01">
              <div class="promise-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></div>
              <div class="promise-content">
                <h3>투명한 진단</h3>
                <p class="promise-quote">"눈으로 확인해야 진짜 믿음입니다."</p>
                <p class="promise-desc">말로만 설명하지 않습니다. 디지털 장비로 상태를 직접 보여드리고, 납득하실 때 치료를 시작합니다.</p>
              </div>
            </div>
            <div class="promise-item" data-reveal data-num="02">
              <div class="promise-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
              <div class="promise-content">
                <h3>바른 진료</h3>
                <p class="promise-quote">"뽑기보다 살리기를 먼저 고민합니다."</p>
                <p class="promise-desc">임플란트보다 좋은 건 내 치아입니다. 발치는 더 이상 방법이 없을 때 권하는 마지막 선택이어야 합니다.</p>
              </div>
            </div>
            <div class="promise-item" data-reveal data-num="03">
              <div class="promise-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div>
              <div class="promise-content">
                <h3>공감 진료</h3>
                <p class="promise-quote">"불안함을 덜고 마음까지 편안하게."</p>
                <p class="promise-desc">치과가 두려운 마음을 잘 압니다. 무통 마취와 세심한 배려로 편안해지도록 돕겠습니다.</p>
              </div>
            </div>
            <div class="promise-item" data-reveal data-num="04">
              <div class="promise-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg></div>
              <div class="promise-content">
                <h3>열린 진료</h3>
                <p class="promise-quote">"당신의 일상이 끊기지 않도록."</p>
                <p class="promise-desc">아플 때 참지 마세요. 퇴근 후에도, 주말에도 이음치과의 불은 환자분 곁에 켜져 있습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section class="section equipment-minimal" id="section-equipment" aria-label="디지털 장비 안내">
        <div class="container-wide">
          <div class="equip-header">
            <span class="section-label">06 — EQUIPMENT</span>
            <h2 class="equip-title">Digital<br/>Dentistry</h2>
          </div>
          <div class="equip-grid">
            <div class="equip-item" data-reveal><span class="equip-num">01</span><h4>CBCT</h4><p>3차원 입체 영상 정밀 진단</p></div>
            <div class="equip-item" data-reveal><span class="equip-num">02</span><h4>구강스캐너</h4><p>디지털 인상 채득</p></div>
            <div class="equip-item" data-reveal><span class="equip-num">03</span><h4>3D 프린터</h4><p>원내 가이드 직접 제작</p></div>
            <div class="equip-item" data-reveal><span class="equip-num">04</span><h4>플라즈마 소독기</h4><p>최첨단 감염관리</p></div>
            <div class="equip-item" data-reveal><span class="equip-num">05</span><h4>아쿠아케어</h4><p>미세분말 최소침습 치료</p></div>
            <div class="equip-item" data-reveal><span class="equip-num">06</span><h4>니트람</h4><p>정밀 근관치료 시스템</p></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section class="section contact-big" id="section-contact" aria-label="연락처 및 오시는 길">
        <div class="contact-bg" aria-hidden="true"><div class="grain"></div></div>
        <div class="container-wide">
          <div class="contact-layout">
            <div class="contact-left">
              <span class="section-label light">07 — CONTACT</span>
              <a href="tel:051-206-5888" class="contact-phone-big" data-hover>
                <span class="phone-label">Call us</span>
                <span class="phone-number">051-206-5888</span>
              </a>
              <div class="contact-address">
                <p>부산광역시 강서구 명지국제8로 265 2층</p>
                <p>이음치과의원</p>
                <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" class="map-btn" data-hover>네이버 지도 →</a>
              </div>
            </div>
            <div class="contact-right">
              <div class="hours-minimal">
                <div class="hours-row"><span class="hours-day">MON—THU</span><span class="hours-time">12:00 — 21:00</span><span class="hours-note">break 16-17 / last 20:30</span></div>
                <div class="hours-row closed"><span class="hours-day">FRI</span><span class="hours-time">CLOSED</span><span class="hours-note">정기휴무</span></div>
                <div class="hours-row"><span class="hours-day">SAT—SUN</span><span class="hours-time">10:00 — 17:00</span><span class="hours-note">break 13-14 / last 16:30</span></div>
                <div class="hours-extra">공휴일 휴진 · 대체공휴일 진료</div>
              </div>
              <div class="transport-minimal">
                <div class="transport-item"><span class="transport-label">자차</span><p>네비 '이음치과의원' 검색 · 주차 2시간 지원<br/>건물 뒷편 주차장 (하이마트 옆)</p></div>
                <div class="transport-item"><span class="transport-label">버스</span><p>국민은행명지국제신도시지점 정류장<br/>강서구 8, 8-1, 21, 124 (도보 1분)</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer class="footer-minimal" role="contentinfo">
        <div class="container-wide">
          <div class="footer-top">
            <div class="footer-brand-big">이음</div>
            <p class="footer-tagline">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
          </div>
          <div class="footer-bottom-bar">
            <span>&copy; 2025 이음치과의원. 대표원장 최효영</span>
            <div class="footer-links">
              <a href="/faq">자주 묻는 질문</a>
              <a href="/dictionary">치과 백과사전</a>
              <a href="mailto:hyogunim@gmail.com">hyogunim@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <a href="tel:051-206-5888" class="floating-call" id="floatingCall" data-hover>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </a>

      <script src="/static/app.js"></script>
    </div>
  )
}
