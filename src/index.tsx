import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <div id="page-wrapper">
      {/* Preloader */}
      <div id="preloader">
        <div class="preloader-inner">
          <div class="preloader-logo">이음</div>
          <div class="preloader-bar"><div class="preloader-fill"></div></div>
        </div>
      </div>

      {/* Navigation */}
      <nav id="navbar">
        <div class="nav-inner">
          <a href="#hero" class="nav-logo">
            <span class="logo-eum">이음</span>
            <span class="logo-dental">치과의원</span>
          </a>
          <div class="nav-links" id="navLinks">
            <a href="#about" class="nav-link">소개</a>
            <a href="#director" class="nav-link">의료진</a>
            <a href="#services" class="nav-link">진료안내</a>
            <a href="#equipment" class="nav-link">시설·장비</a>
            <a href="#hours" class="nav-link">진료시간</a>
            <a href="#location" class="nav-link">오시는 길</a>
            <a href="tel:051-206-5888" class="nav-cta">예약문의</a>
          </div>
          <button class="nav-toggle" id="navToggle" aria-label="메뉴">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div id="mobileMenu" class="mobile-menu">
        <div class="mobile-menu-inner">
          <a href="#about" class="mobile-link">소개</a>
          <a href="#director" class="mobile-link">의료진</a>
          <a href="#services" class="mobile-link">진료안내</a>
          <a href="#equipment" class="mobile-link">시설·장비</a>
          <a href="#hours" class="mobile-link">진료시간</a>
          <a href="#location" class="mobile-link">오시는 길</a>
          <div class="mobile-menu-footer">
            <a href="tel:051-206-5888" class="mobile-cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              051-206-5888
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" class="hero-section">
        <div class="hero-bg-pattern"></div>
        <div class="hero-content">
          <div class="hero-badge" data-animate="fade-up">
            <span>EUM DENTAL CLINIC</span>
          </div>
          <h1 class="hero-title" data-animate="fade-up" data-delay="100">
            <span class="hero-line">실력으로 신뢰를,</span>
            <span class="hero-line">신뢰로 마음까지</span>
            <span class="hero-line hero-accent">잇습니다.</span>
          </h1>
          <p class="hero-desc" data-animate="fade-up" data-delay="200">
            모든 진료 과정에서 환자가 충분히 이해할 때까지 설명하고,<br />
            그 결과를 눈으로 직접 증명하여 불안을 확신으로 바꿉니다.
          </p>
          <div class="hero-actions" data-animate="fade-up" data-delay="300">
            <a href="tel:051-206-5888" class="btn-primary">
              <span>진료 예약</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="#about" class="btn-secondary">
              <span>더 알아보기</span>
            </a>
          </div>
          <div class="hero-info-strip" data-animate="fade-up" data-delay="400">
            <div class="info-item">
              <span class="info-label">위치</span>
              <span class="info-value">부산 명지국제신도시</span>
            </div>
            <div class="info-divider"></div>
            <div class="info-item">
              <span class="info-label">전화</span>
              <span class="info-value">051-206-5888</span>
            </div>
            <div class="info-divider"></div>
            <div class="info-item">
              <span class="info-label">일·토·일 진료</span>
              <span class="info-value">금요일 정기휴무</span>
            </div>
          </div>
        </div>
        <div class="hero-scroll-indicator">
          <div class="scroll-line"></div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* About Section */}
      <section id="about" class="section about-section">
        <div class="container">
          <div class="section-grid about-grid">
            <div class="about-left" data-animate="fade-right">
              <span class="section-number">01</span>
              <h2 class="section-title">
                환자의 불안을<br />
                <em>확신으로</em> 바꾸는 곳
              </h2>
              <div class="about-philosophy">
                <p>
                  이음치과의원은 '잇다'라는 의미를 담아, 환자와 의료진 사이의 
                  <strong>투명한 소통</strong>과 <strong>확실한 결과</strong>로 
                  진정한 신뢰를 만들어갑니다.
                </p>
                <p>
                  페이닥터 생활을 하면서 소신껏 진료하지 못하던 부분, 항상 새로운 좋은 
                  재료들을 시도하고 싶었던 욕심으로 이음치과를 개원하게 되었습니다.
                  환자분들이 확신을 가지고 최선의 선택을 하고 있다는 생각을 가진 채로 
                  치료에 임할 수 있도록 하는 것, 그것이 이음치과의 목표입니다.
                </p>
              </div>
            </div>
            <div class="about-right" data-animate="fade-left">
              <div class="about-values">
                <div class="value-card">
                  <div class="value-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </div>
                  <h3>투명성</h3>
                  <p>모든 진료 과정을 환자가 충분히 이해할 때까지 설명합니다. 궁금한 점은 언제든 물어보세요.</p>
                </div>
                <div class="value-card">
                  <div class="value-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <h3>실력</h3>
                  <p>진료 결과를 눈으로 직접 증명합니다. 최고 수준의 기공소와 협업하여 최선의 결과를 만듭니다.</p>
                </div>
                <div class="value-card">
                  <div class="value-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                  <h3>신뢰</h3>
                  <p>정직하게 치료를 잘하는 병원, 다른 사람에게 자신있게 추천할 수 있는 병원을 만듭니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Director Section */}
      <section id="director" class="section director-section">
        <div class="container">
          <div class="section-grid director-grid">
            <div class="director-photo-area" data-animate="fade-right">
              <div class="director-photo-frame">
                <div class="photo-placeholder">
                  <div class="placeholder-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <span>원장 프로필 사진</span>
                </div>
              </div>
              <div class="director-name-badge">
                <span class="badge-title">대표원장</span>
                <span class="badge-name">최효영</span>
              </div>
            </div>
            <div class="director-info-area" data-animate="fade-left">
              <span class="section-number">02</span>
              <h2 class="section-title">
                의료진 소개
              </h2>
              <div class="director-quote">
                <blockquote>
                  "환자분들이 치과 이야기를 할 때, 정직하게 치료를 잘하는 병원이라면서 추천하는 곳. 그런 병원을 만들고 싶습니다."
                </blockquote>
              </div>
              <div class="director-credentials">
                <h4>학력 및 경력</h4>
                <ul>
                  <li>강원대학교 치과대학 졸업</li>
                  <li>전 사상연세비앤이치과병원 원장</li>
                  <li>전 다대치과의원 원장</li>
                </ul>
                <h4>학회 활동</h4>
                <ul>
                  <li>대한구강악면임플란트학회 회원</li>
                  <li>대한치과보철학회 회원</li>
                  <li>대한치과보존학회 회원</li>
                </ul>
                <h4>수료 과정</h4>
                <ul>
                  <li>Dentalbean Implant Course 수료</li>
                  <li>Osstem Implant Master Course 수료</li>
                  <li>Osstem Oneguide Course 수료</li>
                  <li>Doctor's Endo Seminar 수료</li>
                  <li>Professional Training Course for Expert Dentistry 수료</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" class="section services-section">
        <div class="container">
          <div class="section-header" data-animate="fade-up">
            <span class="section-number">03</span>
            <h2 class="section-title-center">
              진료 안내
            </h2>
            <p class="section-subtitle">충분한 설명과 확실한 결과로, 최선의 선택을 함께합니다</p>
          </div>
          
          <div class="services-grid" data-animate="fade-up" data-delay="100">
            {/* Implant */}
            <div class="service-card service-featured">
              <div class="service-card-inner">
                <div class="service-number">01</div>
                <div class="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <rect x="9" y="1" width="6" height="6" rx="1"/>
                    <rect x="9" y="9" width="6" height="4" rx="0.5"/>
                    <path d="M10 13 L10 22 M14 13 L14 22" stroke-width="1.5"/>
                    <path d="M8 15 L16 15 M8.5 18 L15.5 18 M9 21 L15 21"/>
                  </svg>
                </div>
                <h3>임플란트</h3>
                <p class="service-highlight">대표 진료</p>
                <p>디지털 가이드를 원내에서 직접 제작하여 정밀한 식립 위치를 설계합니다. CBCT와 구강스캐너 기반의 정확한 진단으로 안전하고 예측 가능한 임플란트 치료를 제공합니다.</p>
                <ul class="service-features">
                  <li>원내 가이드 제작 (3D 프린터)</li>
                  <li>CBCT 기반 정밀 진단</li>
                  <li>구강스캐너 디지털 인상</li>
                  <li>최고 수준 기공소 협업</li>
                </ul>
              </div>
            </div>

            {/* Aesthetic */}
            <div class="service-card">
              <div class="service-card-inner">
                <div class="service-number">02</div>
                <div class="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9z"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <rect x="8" y="8" width="2" height="3" rx="1"/>
                    <rect x="14" y="8" width="2" height="3" rx="1"/>
                  </svg>
                </div>
                <h3>앞니 심미보철</h3>
                <p class="service-highlight">추천 진료</p>
                <p>앞니는 기능뿐 아니라 심미성이 중요합니다. 자연치아와 구별하기 어려운 정밀한 보철물로 아름다운 미소를 되찾아 드립니다.</p>
                <ul class="service-features">
                  <li>라미네이트 / 올세라믹</li>
                  <li>정밀 색조 매칭</li>
                  <li>디지털 스마일 디자인</li>
                </ul>
              </div>
            </div>

            {/* Resin */}
            <div class="service-card">
              <div class="service-card-inner">
                <div class="service-number">03</div>
                <div class="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3>심미 레진</h3>
                <p>충치 치료나 치아 손상 시, 자연치아 색상에 맞춘 레진으로 심미적이고 자연스러운 수복을 진행합니다.</p>
                <ul class="service-features">
                  <li>자연치아 색상 매칭</li>
                  <li>최소 삭제</li>
                  <li>당일 치료 가능</li>
                </ul>
              </div>
            </div>

            {/* TMJ */}
            <div class="service-card">
              <div class="service-card-inner">
                <div class="service-number">04</div>
                <div class="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12h8M12 8v8"/>
                  </svg>
                </div>
                <h3>턱관절 치료</h3>
                <p>턱관절 통증, 소리, 개구제한 등의 증상을 정밀하게 진단하고 물리치료와 함께 체계적으로 치료합니다.</p>
                <ul class="service-features">
                  <li>턱관절 물리치료</li>
                  <li>교합 분석 및 조정</li>
                  <li>맞춤 스플린트</li>
                </ul>
              </div>
            </div>

            {/* General */}
            <div class="service-card">
              <div class="service-card-inner">
                <div class="service-number">05</div>
                <div class="service-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </div>
                <h3>일반진료</h3>
                <p>충치, 신경치료, 사랑니 발치, 잇몸치료, 스케일링 등 기본에 충실한 일반 진료를 꼼꼼하게 진행합니다.</p>
                <ul class="service-features">
                  <li>충치 / 신경치료</li>
                  <li>사랑니 발치</li>
                  <li>잇몸치료 / 스케일링</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section id="equipment" class="section equipment-section">
        <div class="container">
          <div class="section-header" data-animate="fade-up">
            <span class="section-number">04</span>
            <h2 class="section-title-center">시설 · 장비</h2>
            <p class="section-subtitle">정확한 진단과 안전한 진료를 위한 최신 장비를 갖추고 있습니다</p>
          </div>
          <div class="equipment-grid" data-animate="fade-up" data-delay="100">
            <div class="equip-card">
              <div class="equip-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <h4>CBCT</h4>
              <p>3D 입체 영상으로 정밀한 구강 구조 분석</p>
            </div>
            <div class="equip-card">
              <div class="equip-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h4>구강스캐너</h4>
              <p>디지털 인상 채득으로 정확하고 편안한 진료</p>
            </div>
            <div class="equip-card">
              <div class="equip-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              </div>
              <h4>3D 프린터</h4>
              <p>원내 가이드 직접 제작으로 정밀한 임플란트</p>
            </div>
            <div class="equip-card">
              <div class="equip-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4>플라즈마 소독기</h4>
              <p>최첨단 감염관리 시스템 운영</p>
            </div>
            <div class="equip-card">
              <div class="equip-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <h4>아쿠아케어</h4>
              <p>미세분말로 치아 손상 최소화한 충치 치료</p>
            </div>
            <div class="equip-card">
              <div class="equip-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h4>니트람</h4>
              <p>정밀한 근관 치료를 위한 전문 장비</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hours + Location Section */}
      <section id="hours" class="section hours-section">
        <div class="container">
          <div class="section-header" data-animate="fade-up">
            <span class="section-number">05</span>
            <h2 class="section-title-center">진료 시간</h2>
          </div>
          <div class="hours-grid" data-animate="fade-up" data-delay="100">
            <div class="hours-table-wrap">
              <table class="hours-table">
                <thead>
                  <tr>
                    <th>요일</th>
                    <th>진료시간</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="day">월 — 목</td>
                    <td>12:00 — 21:00</td>
                    <td>
                      <span class="hours-note">휴게 16:00~17:00</span>
                      <span class="hours-note">접수마감 20:30</span>
                    </td>
                  </tr>
                  <tr class="row-holiday">
                    <td class="day">금요일</td>
                    <td colspan="2">
                      <span class="closed-badge">정기휴무</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="day">토 · 일</td>
                    <td>10:00 — 17:00</td>
                    <td>
                      <span class="hours-note">휴게 13:00~14:00</span>
                      <span class="hours-note">접수마감 16:30</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="hours-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>공휴일 휴진 · 대체공휴일 진료</span>
              </div>
            </div>
            <div class="hours-contact">
              <div class="contact-card">
                <h4>진료 예약</h4>
                <a href="tel:051-206-5888" class="contact-phone">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  051-206-5888
                </a>
                <p class="contact-desc">전화로 편하게 예약하실 수 있습니다</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" class="section location-section">
        <div class="container">
          <div class="section-header" data-animate="fade-up">
            <span class="section-number">06</span>
            <h2 class="section-title-center">오시는 길</h2>
          </div>
          <div class="location-content" data-animate="fade-up" data-delay="100">
            <div class="map-container">
              <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener noreferrer" class="map-link" title="네이버 지도에서 이음치과의원 보기">
                <div class="map-placeholder">
                  <div class="map-pin">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <p class="map-address">부산광역시 강서구 명지국제8로 265</p>
                  <span class="map-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    네이버 지도에서 보기
                  </span>
                </div>
              </a>
            </div>
            <div class="location-details">
              <div class="location-address">
                <div class="loc-item">
                  <div class="loc-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h4>주소</h4>
                    <p>부산광역시 강서구 명지국제8로 265 2층<br />이음치과의원</p>
                    <span class="loc-sub">국민은행 맞은편에 위치합니다</span>
                  </div>
                </div>
              </div>

              <div class="transport-info">
                <div class="transport-block">
                  <div class="transport-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 3 20 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="13.5" cy="18.5" r="2.5"/></svg>
                    자차 이용 시
                  </div>
                  <p>내비게이션에 <strong>'이음치과의원'</strong> 검색<br />
                  주차 2시간 지원 (건물 뒷편 주차장 입구, 하이마트 주차장 옆)</p>
                  <span class="transport-note">※ 토요일 오전에는 주차장이 혼잡하오니 대중교통 이용을 추천드립니다</span>
                </div>
                <div class="transport-block">
                  <div class="transport-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    대중교통 이용 시
                  </div>
                  <p><strong>국민은행명지국제신도시지점 정류장</strong><br />
                  강서구 8, 8-1, 21, 124번 (하차 후 도보 1분, 50m)</p>
                  <p><strong>에코누비버스 (에코델타시티 방면)</strong><br />
                  강서 8-1, 15-1번 (하차 후 도보 1분, 50m)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="section cta-section">
        <div class="container">
          <div class="cta-content" data-animate="fade-up">
            <h2>충분한 설명, 확실한 결과.<br />이음치과가 함께합니다.</h2>
            <p>궁금한 점이 있으시면 언제든 편하게 문의해 주세요.</p>
            <div class="cta-actions">
              <a href="tel:051-206-5888" class="btn-primary btn-large">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>051-206-5888</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo">
                <span class="logo-eum">이음</span>
                <span class="logo-dental">치과의원</span>
              </div>
              <p class="footer-slogan">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
            </div>
            <div class="footer-info">
              <div class="footer-col">
                <h5>진료문의</h5>
                <p><a href="tel:051-206-5888">051-206-5888</a></p>
                <p><a href="mailto:hyogunim@gmail.com">hyogunim@gmail.com</a></p>
              </div>
              <div class="footer-col">
                <h5>위치</h5>
                <p>부산광역시 강서구 명지국제8로 265 2층</p>
              </div>
              <div class="footer-col">
                <h5>진료시간</h5>
                <p>월-목 12:00-21:00</p>
                <p>토-일 10:00-17:00</p>
                <p>금요일 정기휴무</p>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2025 이음치과의원. All rights reserved. 대표원장 최효영</p>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <div class="floating-cta" id="floatingCta">
        <a href="tel:051-206-5888" class="float-btn" aria-label="전화 예약">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>예약문의</span>
        </a>
      </div>

      <script src="/static/app.js"></script>
    </div>
  )
})

export default app
