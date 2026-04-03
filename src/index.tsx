import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div id="app">
      {/* Custom Cursor */}
      <div class="cursor" id="cursor"></div>
      <div class="cursor-follower" id="cursorFollower"></div>

      {/* Navigation */}
      <nav id="nav">
        <a href="#" class="nav-brand" data-hover>이음</a>
        <div class="nav-center" id="navTime"></div>
        <button class="nav-menu-btn" id="menuBtn" data-hover>
          <span>MENU</span>
        </button>
      </nav>

      {/* Full Screen Menu */}
      <div id="fullMenu" class="full-menu">
        <div class="menu-overlay"></div>
        <div class="menu-content">
          <div class="menu-links">
            <a href="#section-about" class="menu-link" data-hover data-index="01"><span data-text="소개">소개</span></a>
            <a href="#section-philosophy" class="menu-link" data-hover data-index="02"><span data-text="철학">철학</span></a>
            <a href="#section-services" class="menu-link" data-hover data-index="03"><span data-text="진료">진료</span></a>
            <a href="#section-director" class="menu-link" data-hover data-index="04"><span data-text="의료진">의료진</span></a>
            <a href="#section-equipment" class="menu-link" data-hover data-index="05"><span data-text="시설">시설</span></a>
            <a href="#section-contact" class="menu-link" data-hover data-index="06"><span data-text="예약">예약</span></a>
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

      {/* === SECTION 1: HERO === */}
      <section class="section hero" id="section-hero">
        <div class="hero-bg">
          <div class="hero-img" style="background-image:url('/static/img/photo_1.jpg')"></div>
          <div class="grain"></div>
        </div>
        <div class="hero-content">
          <div class="hero-tag">
            <span class="tag-line"></span>
            <span class="tag-text">EUM DENTAL CLINIC — BUSAN</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line"><span class="title-word" data-split>실력으로</span></span>
            <span class="title-line"><span class="title-word" data-split>신뢰를,</span></span>
            <span class="title-line accent"><span class="title-word" data-split>잇습니다.</span></span>
          </h1>
          <div class="hero-bottom">
            <div class="hero-scroll-hint">
              <div class="scroll-circle">
                <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="29" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/><circle cx="30" cy="30" r="29" fill="none" stroke="rgba(196,165,90,0.8)" stroke-width="0.5" stroke-dasharray="182.21" stroke-dashoffset="182.21" class="scroll-progress"/></svg>
              </div>
              <span>SCROLL</span>
            </div>
            <p class="hero-sub">환자의 불안을 확신으로 바꾸는 곳</p>
          </div>
        </div>
      </section>

      {/* === MARQUEE BAND === */}
      <div class="marquee-band">
        <div class="marquee-track">
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
          <span>TRANSPARENCY — SKILL — TRUST — 투명성 — 실력 — 신뢰 — EUM DENTAL — </span>
        </div>
      </div>

      {/* === CLINIC GALLERY STRIP === */}
      <div class="gallery-strip">
        <div class="gallery-track">
          <div class="gallery-item"><img src="/static/img/photo_7.jpg" alt="이음치과 접수" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_8.jpg" alt="이음치과 대기실" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_6.jpg" alt="이음치과 진료실" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_4.jpg" alt="이음치과 내부" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_9.jpg" alt="이음치과 편의공간" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_1.jpg" alt="이음치과 로비" loading="lazy" /></div>
          {/* duplicate for seamless loop */}
          <div class="gallery-item"><img src="/static/img/photo_7.jpg" alt="" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_8.jpg" alt="" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_6.jpg" alt="" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_4.jpg" alt="" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_9.jpg" alt="" loading="lazy" /></div>
          <div class="gallery-item"><img src="/static/img/photo_1.jpg" alt="" loading="lazy" /></div>
        </div>
      </div>

      {/* === SECTION 2: ABOUT (Manifesto Style) === */}
      <section class="section about-manifesto" id="section-about">
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

      {/* === SECTION 3: PHILOSOPHY (Split Screen) === */}
      <section class="section philosophy-split" id="section-philosophy">
        <div class="split-left">
          <div class="split-sticky">
            <span class="section-label">02 — PHILOSOPHY</span>
            <h2 class="split-title">
              우리가<br/>
              <em>다른</em> 이유
            </h2>
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
            <p>진료 결과를 눈으로 직접 증명합니다. 디지털 가이드를 원내에서 직접 제작하고, 최고 수준의 기공소와 협업합니다. 새로운 좋은 재료와 기술을 끊임없이 적용합니다.</p>
          </div>
          <div class="philosophy-card" data-reveal>
            <div class="card-num">03</div>
            <h3>신뢰</h3>
            <p>정직하게 치료를 잘하는 병원. 다른 사람에게 자신있게 추천할 수 있는 병원. 환자분들이 확신을 가지고 치료에 임할 수 있게 만드는 것이 이음의 약속입니다.</p>
          </div>
        </div>
      </section>

      {/* === MARQUEE BAND 2 === */}
      <div class="marquee-band dark">
        <div class="marquee-track reverse">
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
          <span>IMPLANT — AESTHETICS — TMJ — 임플란트 — 심미보철 — 턱관절 — DIGITAL DENTISTRY — </span>
        </div>
      </div>

      {/* === SECTION 4: SERVICES (Horizontal Scroll Gallery) === */}
      <section class="section services-horizontal" id="section-services">
        <div class="container-wide">
          <div class="services-header">
            <span class="section-label">03 — SERVICES</span>
            <h2 class="services-title">진료 안내</h2>
          </div>
        </div>
        <div class="horizontal-wrap">
          <div class="horizontal-track" id="horizontalTrack">
            <div class="h-card h-card-intro">
              <div class="h-card-inner">
                <p class="h-intro-text">충분한 설명,<br/>확실한 결과로<br/><em>최선의 선택</em>을<br/>함께합니다.</p>
              </div>
            </div>
            <div class="h-card" data-service="implant">
              <div class="h-card-inner">
                <span class="h-card-num">01</span>
                <h3 class="h-card-title">임플란트</h3>
                <span class="h-card-badge">SIGNATURE</span>
                <p class="h-card-desc">원내 3D 프린터로 가이드를 직접 제작. CBCT와 구강스캐너 기반 정밀 진단. 예측 가능한 결과를 위한 디지털 워크플로우.</p>
                <div class="h-card-features">
                  <span>원내 가이드 제작</span>
                  <span>CBCT 정밀 진단</span>
                  <span>디지털 인상</span>
                  <span>최고 수준 기공소</span>
                </div>
              </div>
            </div>
            <div class="h-card" data-service="aesthetic">
              <div class="h-card-inner">
                <span class="h-card-num">02</span>
                <h3 class="h-card-title">심미보철</h3>
                <span class="h-card-badge">RECOMMENDED</span>
                <p class="h-card-desc">앞니는 기능과 심미성 모두 중요합니다. 자연치아와 구별 불가한 정밀 보철로 아름다운 미소를 되찾아 드립니다.</p>
                <div class="h-card-features">
                  <span>라미네이트</span>
                  <span>올세라믹</span>
                  <span>정밀 색조 매칭</span>
                </div>
              </div>
            </div>
            <div class="h-card" data-service="resin">
              <div class="h-card-inner">
                <span class="h-card-num">03</span>
                <h3 class="h-card-title">심미 레진</h3>
                <p class="h-card-desc">자연치아 색상에 완벽히 맞춘 레진으로 심미적이고 자연스러운 수복. 최소 삭제, 당일 치료 가능.</p>
                <div class="h-card-features">
                  <span>자연 색상 매칭</span>
                  <span>최소 침습</span>
                  <span>당일 완료</span>
                </div>
              </div>
            </div>
            <div class="h-card" data-service="tmj">
              <div class="h-card-inner">
                <span class="h-card-num">04</span>
                <h3 class="h-card-title">턱관절</h3>
                <p class="h-card-desc">턱관절 통증, 소리, 개구제한을 정밀 진단. 물리치료와 체계적 치료 프로토콜.</p>
                <div class="h-card-features">
                  <span>물리치료</span>
                  <span>교합 분석</span>
                  <span>맞춤 스플린트</span>
                </div>
              </div>
            </div>
            <div class="h-card" data-service="general">
              <div class="h-card-inner">
                <span class="h-card-num">05</span>
                <h3 class="h-card-title">일반진료</h3>
                <p class="h-card-desc">충치, 신경치료, 사랑니, 잇몸치료, 스케일링. 기본에 충실하게, 꼼꼼하게.</p>
                <div class="h-card-features">
                  <span>충치 · 신경치료</span>
                  <span>사랑니 발치</span>
                  <span>잇몸 · 스케일링</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 5: DIRECTOR (Full Bleed) === */}
      <section class="section director-full" id="section-director">
        <div class="container-wide">
          <div class="director-layout">
            <div class="director-visual">
              <div class="director-frame">
                <img src="/static/img/photo_5.jpg" alt="최효영 원장" class="director-photo" />
                <div class="frame-content">
                  <span class="frame-label">DIRECTOR</span>
                  <div class="frame-name">최효영</div>
                  <div class="frame-title">대표원장</div>
                </div>
              </div>
            </div>
            <div class="director-info">
              <span class="section-label">04 — DIRECTOR</span>
              <blockquote class="director-quote" data-reveal>
                "다른 사람들이 치과 이야기를 할 때<br/>
                정직하게 치료를 잘하는 병원이라며<br/>
                추천하는 곳을 만들고 싶습니다."
              </blockquote>
              <div class="credentials-grid">
                <div class="cred-block" data-reveal>
                  <h4>Education</h4>
                  <ul>
                    <li>강원대학교 치과대학 졸업</li>
                  </ul>
                </div>
                <div class="cred-block" data-reveal>
                  <h4>Experience</h4>
                  <ul>
                    <li>전 사상연세비앤이치과병원 원장</li>
                    <li>전 다대치과의원 원장</li>
                  </ul>
                </div>
                <div class="cred-block" data-reveal>
                  <h4>Membership</h4>
                  <ul>
                    <li>대한구강악면임플란트학회</li>
                    <li>대한치과보철학회</li>
                    <li>대한치과보존학회</li>
                  </ul>
                </div>
                <div class="cred-block" data-reveal>
                  <h4>Training</h4>
                  <ul>
                    <li>Dentalbean Implant Course</li>
                    <li>Osstem Master · Oneguide Course</li>
                    <li>Doctor's Endo Seminar</li>
                    <li>Professional Expert Dentistry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === PHILOSOPHY IMAGE BREAK === */}
      <div class="image-break">
        <img src="/static/img/photo_6.jpg" alt="이음치과 진료실" loading="lazy" />
      </div>

      {/* === SECTION 6: EQUIPMENT (Minimal Grid) === */}
      <section class="section equipment-minimal" id="section-equipment">
        <div class="container-wide">
          <div class="equip-header">
            <span class="section-label">05 — EQUIPMENT</span>
            <h2 class="equip-title">Digital<br/>Dentistry</h2>
          </div>
          <div class="equip-grid">
            <div class="equip-item" data-reveal>
              <span class="equip-num">01</span>
              <h4>CBCT</h4>
              <p>3차원 입체 영상 정밀 진단</p>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">02</span>
              <h4>구강스캐너</h4>
              <p>디지털 인상 채득</p>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">03</span>
              <h4>3D 프린터</h4>
              <p>원내 가이드 직접 제작</p>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">04</span>
              <h4>플라즈마 소독기</h4>
              <p>최첨단 감염관리</p>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">05</span>
              <h4>아쿠아케어</h4>
              <p>미세분말 최소침습 치료</p>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">06</span>
              <h4>니트람</h4>
              <p>정밀 근관치료 시스템</p>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 7: CONTACT (Big Typography) === */}
      <section class="section contact-big" id="section-contact">
        <div class="contact-bg">
          <div class="grain"></div>
        </div>
        <div class="container-wide">
          <div class="contact-layout">
            <div class="contact-left">
              <span class="section-label light">06 — CONTACT</span>
              <a href="tel:051-206-5888" class="contact-phone-big" data-hover>
                <span class="phone-label">Call us</span>
                <span class="phone-number">051-206-5888</span>
              </a>
              <div class="contact-address">
                <p>부산광역시 강서구 명지국제8로 265 2층</p>
                <p>이음치과의원</p>
                <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" class="map-btn" data-hover>
                  네이버 지도 →
                </a>
              </div>
            </div>
            <div class="contact-right">
              <div class="hours-minimal">
                <div class="hours-row">
                  <span class="hours-day">MON—THU</span>
                  <span class="hours-time">12:00 — 21:00</span>
                  <span class="hours-note">break 16-17 / last 20:30</span>
                </div>
                <div class="hours-row closed">
                  <span class="hours-day">FRI</span>
                  <span class="hours-time">CLOSED</span>
                  <span class="hours-note">정기휴무</span>
                </div>
                <div class="hours-row">
                  <span class="hours-day">SAT—SUN</span>
                  <span class="hours-time">10:00 — 17:00</span>
                  <span class="hours-note">break 13-14 / last 16:30</span>
                </div>
                <div class="hours-extra">공휴일 휴진 · 대체공휴일 진료</div>
              </div>
              <div class="transport-minimal">
                <div class="transport-item">
                  <span class="transport-label">자차</span>
                  <p>네비 '이음치과의원' 검색 · 주차 2시간 지원<br/>건물 뒷편 주차장 (하이마트 옆)</p>
                </div>
                <div class="transport-item">
                  <span class="transport-label">버스</span>
                  <p>국민은행명지국제신도시지점 정류장<br/>강서구 8, 8-1, 21, 124 (도보 1분)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer class="footer-minimal">
        <div class="container-wide">
          <div class="footer-top">
            <div class="footer-brand-big">이음</div>
            <p class="footer-tagline">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
          </div>
          <div class="footer-bottom-bar">
            <span>&copy; 2025 이음치과의원. 대표원장 최효영</span>
            <span><a href="mailto:hyogunim@gmail.com">hyogunim@gmail.com</a></span>
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
})

export default app
