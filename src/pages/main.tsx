/** Main page JSX — STORY-DRIVEN REDESIGN v4
 *  Flow: Question → Insight → Aha → Therefore → Proof
 *  "Why is the dentist so scary?" → "Because you can't see" → "We show everything" → Trust
 */
export function mainPage() {
  return (
    <div id="app">
      {/* Skip to main content — Accessibility */}
      <a href="#section-hero" class="skip-link">본문 바로가기</a>

      {/* Custom Cursor */}
      <div class="cursor" id="cursor"></div>
      <div class="cursor-follower" id="cursorFollower"></div>

      {/* === NAVIGATION === */}
      <nav id="nav">
        <a href="/" class="nav-brand" data-hover>이음</a>
        <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" class="nav-booking" data-hover>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
          <span>네이버 예약</span>
        </a>
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
            <a href="/about" class="menu-link" data-hover data-index="01"><span>병원 소개</span></a>
            <a href="/doctors" class="menu-link" data-hover data-index="02"><span>의료진</span></a>
            <a href="/treatments" class="menu-link" data-hover data-index="03"><span>진료 안내</span></a>
            <a href="/cases" class="menu-link" data-hover data-index="04"><span>비포애프터</span></a>
            <a href="/blogs" class="menu-link" data-hover data-index="05"><span>블로그</span></a>
            <a href="/faq" class="menu-link" data-hover data-index="06"><span>자주 묻는 질문</span></a>
            <a href="/dictionary" class="menu-link" data-hover data-index="07"><span>백과사전</span></a>
            <a href="/visit" class="menu-link" data-hover data-index="08"><span>내원 안내</span></a>
            <a href="/notices" class="menu-link" data-hover data-index="09"><span>공지사항</span></a>
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

      {/* ═══════════════════════════════════════════════════
          ACT 1 — THE QUESTION (치과가 두려운 이유)
          Opening hook: 누구나 공감하는 질문으로 시작
          CINEMATIC: 파티클 필드 + 앰비언트 라이트 + 보케
      ═══════════════════════════════════════════════════ */}
      <section class="section story-hero" id="section-hero" aria-label="이음치과의원 소개">
        <div class="hero-bg">
          {/* Layer 0: Mesh blobs (deepest) */}
          <div class="hero-mesh" id="heroMesh" aria-hidden="true">
            <div class="mesh-blob mesh-blob-1"></div>
            <div class="mesh-blob mesh-blob-2"></div>
            <div class="mesh-blob mesh-blob-3"></div>
            <div class="mesh-blob mesh-blob-4"></div>
            <div class="mesh-blob mesh-blob-5"></div>
          </div>
          {/* Layer 1: Depth-of-field blur */}
          <div class="hero-depth-blur" aria-hidden="true"></div>
          {/* Layer 2: Canvas particle field (created by JS) */}
          <canvas id="heroCanvas" aria-hidden="true"></canvas>
          {/* Layer 2b: CSS particle fallback */}
          <div class="hero-particles" id="heroParticles" aria-hidden="true"></div>
          {/* Layer 3: Volumetric light leaks */}
          <div class="hero-light-leak hero-light-leak-1" aria-hidden="true"></div>
          <div class="hero-light-leak hero-light-leak-2" aria-hidden="true"></div>
          {/* Layer 4: Film grain */}
          <div class="grain" aria-hidden="true"></div>
          {/* Layer 5: Cinematic vignette */}
          <div class="hero-vignette" aria-hidden="true"></div>
          {/* Layer 6: Anamorphic flare */}
          <div class="hero-anamorphic" aria-hidden="true"></div>
        </div>
        <div class="hero-scan-line" id="heroScanLine" aria-hidden="true"></div>

        <div class="hero-content">
          <div class="hero-tag">
            <span class="tag-line" aria-hidden="true"></span>
            <span class="tag-text">EUM DENTAL CLINIC — BUSAN</span>
          </div>
          <h1 class="hero-title">
            <span class="title-line"><span class="title-word" data-split>치과가</span></span>
            <span class="title-line"><span class="title-word" data-split>그렇게도</span></span>
            <span class="title-line accent"><span class="title-word" data-split>두려운 이유</span></span>
          </h1>
          {/* Hero CTA */}
          <div class="hero-cta-wrap">
            <a href="tel:051-206-5888" class="hero-cta-btn" data-hover>
              <span>지금 상담하기</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>

          <div class="hero-bottom">
            <div class="hero-scroll-hint">
              <div class="scroll-line-wrap">
                <div class="scroll-line" id="scrollLine"></div>
              </div>
              <span>SCROLL TO DISCOVER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ACT 2 — THE NARRATIVE (스크롤 스토리텔링)
          CINEMATIC: 각 챕터마다 무드 라이팅 변화
          앰비언트 글로우, 포커스 빔, 타이포 블러 효과
      ═══════════════════════════════════════════════════ */}
      {/* ═══ CINEMATIC BLACKOUT OVERLAY — Dark-to-Light Transition ═══ */}
      <div class="blackout-overlay" id="blackoutOverlay" aria-hidden="true">
        <div class="blackout-particles" aria-hidden="true"></div>
        <div class="blackout-light-ring" aria-hidden="true"></div>
      </div>

      <section class="story-narrative" id="storyNarrative" aria-label="이음치과 이야기">
        {/* Cinematic ambient glow — dual layer follows scroll */}
        <div class="story-ambient-glow" id="storyGlow" aria-hidden="true"></div>
        <div class="story-ambient-pulse" id="storyPulse" aria-hidden="true"></div>

        {/* Chapter 1: 질문 — 공포의 원인 */}
        <div class="story-chapter" id="storyChapter1">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-orb chapter-orb-1"></div>
          </div>
          <div class="story-line" data-story="1">
            <span class="story-chapter-num" aria-hidden="true">01</span>
            <p class="story-text story-question">우리는 왜<br/>치과 치료가 그토록 두려울까요?</p>
          </div>
        </div>

        {/* Chapter 2: 인사이트 — 보이지 않기 때문 */}
        <div class="story-chapter" id="storyChapter2">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-orb chapter-orb-2"></div>
          </div>
          <div class="story-line" data-story="2">
            <p class="story-text story-solo">바로</p>
          </div>
          <div class="story-line" data-story="3">
            <p class="story-text story-emphasis">내 입 안에서 벌어지는 일이니까요.</p>
          </div>
        </div>

        {/* Chapter 3: 공감 — 보이지 않는 것의 공포 (VOLUMETRIC FOG) */}
        <div class="story-chapter story-chapter-dark" id="storyChapter3">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-fog" id="chapterFog"></div>
            <div class="chapter-fog-2" aria-hidden="true"></div>
          </div>
          <div class="story-line" data-story="4">
            <p class="story-text story-small">입 안은 보이지 않으니까요.</p>
          </div>
          <div class="story-line" data-story="5">
            <p class="story-text story-pause">맞습니다.</p>
          </div>
          <div class="story-line" data-story="6">
            <p class="story-text">우리는<br/><em>보이지 않는 것</em>을 두려워합니다.</p>
          </div>
          <div class="story-line" data-story="7">
            <p class="story-text story-whisper">귀신처럼요.</p>
          </div>
        </div>

        {/* Chapter 4: 전환 — 반대로 (어둠 → 빛) VOLUMETRIC LIGHT */}
        <div class="story-chapter story-chapter-turn" id="storyChapter4">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-light-cone" id="chapterLightCone" aria-hidden="true"></div>
            <div class="chapter-light-burst" id="chapterLightBurst"></div>
          </div>
          <div class="story-line" data-story="8">
            <p class="story-text story-turn">반대로,</p>
          </div>
          <div class="story-line" data-story="9">
            <p class="story-text">우리 입 안에서<br/><em>무슨 일이 벌어지는지</em> 알 수 있다면</p>
          </div>
          <div class="story-line" data-story="10">
            <p class="story-text story-emphasis">두려움은 사라집니다.</p>
          </div>
        </div>

        {/* Chapter 5: 결론 — 그래서 이음치과는 (GOD RAYS) */}
        <div class="story-chapter story-chapter-resolve" id="storyChapter5">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-rays" id="chapterRays"></div>
            <div class="chapter-rays-2" aria-hidden="true"></div>
          </div>
          <div class="story-line" data-story="11">
            <p class="story-text story-bridge">그래서 이음치과는</p>
          </div>
          <div class="story-line" data-story="12">
            <p class="story-text story-action"><em>충분히</em> 설명하고,</p>
          </div>
          <div class="story-line" data-story="13">
            <p class="story-text story-action">매 과정을 <em>보여드립니다.</em></p>
          </div>
        </div>

        {/* Chapter 6: 약속 — 신뢰를 잇습니다 (CLIMAX — AVATAR BIOLUMINESCENCE) */}
        <div class="story-chapter story-chapter-climax" id="storyChapter6">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-nebula" id="chapterNebula" aria-hidden="true"></div>
            <div class="chapter-aurora" id="chapterAurora"></div>
            <div class="chapter-aurora-2" aria-hidden="true"></div>
            <div class="chapter-stars" id="chapterStars"></div>
            <div class="chapter-stars-deep" aria-hidden="true"></div>
          </div>
          <div class="story-line" data-story="14">
            <p class="story-text story-bridge">그렇게 이음치과는</p>
          </div>
          <div class="story-line story-line-finale" data-story="15">
            <p class="story-text story-finale">신뢰를,<br/>잇습니다.</p>
            <div class="finale-glow" aria-hidden="true"></div>
            <div class="finale-ring" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ACT 3 — THE PROOF (증거)
          스토리 이후 증거를 순서대로 제시
      ═══════════════════════════════════════════════════ */}

      {/* Stats — 숫자로 보는 신뢰 */}
      <section class="story-stats" id="storyStats" aria-label="이음치과 성과">
        <div class="container-wide">
          <div class="story-stats-inner">
            <div class="hero-stat" data-reveal>
              <span class="hero-stat-num" data-count="387">0</span>
              <span class="hero-stat-unit">+</span>
              <span class="hero-stat-label">리뷰 수</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat" data-reveal>
              <span class="hero-stat-num" data-count="4.9">0</span>
              <span class="hero-stat-unit">★</span>
              <span class="hero-stat-label">네이버 평점</span>
            </div>
            <div class="hero-stat-divider"></div>
            <div class="hero-stat" data-reveal>
              <span class="hero-stat-num" data-count="8">0</span>
              <span class="hero-stat-unit">년</span>
              <span class="hero-stat-label">진료 경력</span>
            </div>
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

      {/* HOW WE PROVE IT — 3 Pillars */}
      <section class="section story-pillars" id="section-pillars" aria-label="이음치과의 증명 방식">
        <div class="container-wide">
          <div class="pillars-header">
            <span class="section-label">01 — HOW WE PROVE IT</span>
            <h2 class="pillars-title">우리가 신뢰를<br/><em>증명</em>하는 방법</h2>
            <p class="pillars-subtitle">이음치과는 말이 아닌 행동으로, 약속이 아닌 결과로 증명합니다.<br/>세 가지 원칙이 모든 진료의 출발점입니다.</p>
          </div>
          <div class="pillars-grid">
            <div class="pillar-card" data-reveal>
              <div class="pillar-num">01</div>
              <div class="pillar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></div>
              <h3>보여드립니다</h3>
              <p class="pillar-lead">말로만 설명하지 않습니다.</p>
              <p class="pillar-desc">CBCT와 구강스캐너로 촬영한 3D 영상을 모니터로 직접 보여드립니다. 어디가 어떻게 아프고, 왜 치료가 필요한지 — 환자분이 눈으로 확인하고 납득하실 때 비로소 치료를 시작합니다. "뭔지도 모르고 치료받았다"는 경험, 이음에서는 없습니다.</p>
              <ul class="pillar-details">
                <li>진료 전 3D 영상으로 상태 설명</li>
                <li>치료 계획을 환자와 함께 수립</li>
                <li>치료 과정마다 경과 사진 공유</li>
              </ul>
            </div>
            <div class="pillar-card" data-reveal>
              <div class="pillar-num">02</div>
              <div class="pillar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
              <h3>살립니다</h3>
              <p class="pillar-lead">임플란트보다 좋은 건 내 치아입니다.</p>
              <p class="pillar-desc">발치는 정말 방법이 없을 때의 마지막 선택이어야 합니다. 이음치과는 근관치료, 레진, 보철 등 가능한 모든 보존 치료를 먼저 검토하고, 자연치아를 최대한 살리는 방향으로 계획을 세웁니다. 당장은 느리더라도, 10년 후에도 후회 없는 치료를 약속합니다.</p>
              <ul class="pillar-details">
                <li>보존 치료 우선 — 발치는 최후 수단</li>
                <li>장기적 예후를 고려한 치료 설계</li>
                <li>과잉 진료 제로 원칙</li>
              </ul>
            </div>
            <div class="pillar-card" data-reveal>
              <div class="pillar-num">03</div>
              <div class="pillar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div>
              <h3>편안하게</h3>
              <p class="pillar-lead">두려움은 우리가 먼저 느낍니다.</p>
              <p class="pillar-desc">치과가 무서운 건 당연합니다. 그래서 이음치과는 모든 진료에 무통 마취를 기본으로 적용하고, 치료 중 통증이 느껴지면 즉시 멈춥니다. 진료실 입장부터 퇴원까지 — 불안하지 않도록 매 순간 세심하게 배려합니다.</p>
              <ul class="pillar-details">
                <li>무통 마취 기본 적용</li>
                <li>치료 중 통증 시 즉시 중단</li>
                <li>편안한 진료 환경 (음악, 조명, 쿠션)</li>
              </ul>
            </div>
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
            <span class="section-label">02 — SERVICES</span>
            <h2 class="services-title">진료 안내</h2>
            <p class="services-subtitle">충분한 설명과 확실한 결과. 이음치과가 자신 있는 진료 영역입니다.<br/>카드를 드래그하여 살펴보세요.</p>
          </div>
        </div>
        <div class="horizontal-wrap">
          <div class="horizontal-track" id="horizontalTrack">
            <div class="h-card h-card-intro"><div class="h-card-inner"><p class="h-intro-text">충분한 설명,<br/>확실한 결과로<br/><em>최선의 선택</em>을<br/>함께합니다.</p><p class="h-intro-sub">각 진료마다 디지털 장비 기반의<br/>정밀 진단을 기본으로 합니다.</p></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">01</span><h3 class="h-card-title">임플란트</h3><span class="h-card-badge">SIGNATURE</span><p class="h-card-desc">CBCT 3D 영상으로 뼈의 양·밀도·신경 위치를 정밀 분석하고, 원내 3D 프린터로 환자 맞춤 수술 가이드를 직접 제작합니다. 절개를 최소화하여 통증과 회복 기간을 단축합니다.</p><div class="h-card-features"><span><a href="/dictionary/digital-guide" class="term-link">원내 가이드</a> 제작</span><span><a href="/dictionary/cbct" class="term-link">CBCT</a> 정밀 진단</span><span><a href="/dictionary/digital-impression" class="term-link">디지털 인상</a></span><span>최고 수준 기공소</span></div><p class="h-card-patient-note">환자분 후기: "절개 없이 한 임플란트, 당일에 밥을 먹었어요."</p><div class="h-card-arrow">→</div><a href="/dictionary?service=implant" class="h-card-dict-link">임플란트 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">02</span><h3 class="h-card-title">심미보철</h3><span class="h-card-badge">RECOMMENDED</span><p class="h-card-desc">구강스캐너로 정밀 스캔 후, 자연치아와 구별이 불가능한 보철물을 맞춤 제작합니다. 라미네이트, 올세라믹 등 환자분의 얼굴형과 미소 라인에 맞는 최적의 솔루션을 제안합니다.</p><div class="h-card-features"><span><a href="/dictionary/laminate" class="term-link">라미네이트</a></span><span><a href="/dictionary/all-ceramic" class="term-link">올세라믹</a></span><span>정밀 색조 매칭</span><span>미소 라인 분석</span></div><p class="h-card-patient-note">자연치아 같은 투명도와 색감 — 주변에서 보철인 줄 몰라요.</p><div class="h-card-arrow">→</div><a href="/dictionary?service=aesthetic" class="h-card-dict-link">심미보철 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">03</span><h3 class="h-card-title">심미 레진</h3><p class="h-card-desc">치아 색상에 완벽히 맞춘 고급 레진으로 치아 삭제를 최소화하면서 당일에 치료를 마칩니다. 앞니 틈, 깨진 치아, 변색 부위 등을 자연스럽게 복원합니다.</p><div class="h-card-features"><span>자연 색상 매칭</span><span>최소 침습</span><span>당일 완료</span><span>앞니 심미 복원</span></div><p class="h-card-patient-note">가성비 최고 — 자연스러우면서 당일에 끝나는 치료.</p><div class="h-card-arrow">→</div><a href="/dictionary?service=resin" class="h-card-dict-link">레진 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">04</span><h3 class="h-card-title">턱관절</h3><p class="h-card-desc">턱 소리, 통증, 입 벌림 제한을 CBCT와 교합 분석으로 정밀 진단합니다. 물리치료와 맞춤 스플린트, 체계적 프로토콜로 근본 원인부터 해결합니다.</p><div class="h-card-features"><span>물리치료</span><span>교합 분석</span><span>맞춤 스플린트</span><span>체계적 프로토콜</span></div><p class="h-card-patient-note">턱 통증으로 잠을 못 잤는데, 치료 후 확실히 달라졌어요.</p><div class="h-card-arrow">→</div><a href="/dictionary?service=tmj" class="h-card-dict-link">턱관절 관련 용어 보기 →</a></div></div>
            <div class="h-card"><div class="h-card-inner"><span class="h-card-num">05</span><h3 class="h-card-title">일반진료</h3><p class="h-card-desc">충치, 신경치료, 사랑니, 잇몸치료, 스케일링 — 기본 진료에 가장 충실합니다. 아쿠아케어(드릴 없는 치료)와 니트람 근관치료 시스템으로 통증과 불안을 줄입니다.</p><div class="h-card-features"><span>충치 · 신경치료</span><span>사랑니 발치</span><span>잇몸 · 스케일링</span><span>무통 마취</span></div><p class="h-card-patient-note">기본을 잘하는 치과가 진짜 좋은 치과라는 걸 느꼈어요.</p><div class="h-card-arrow">→</div><a href="/dictionary?service=general" class="h-card-dict-link">일반진료 관련 용어 보기 →</a></div></div>
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
              <span class="section-label">03 — DIRECTOR</span>
              <h2 class="director-name-title" data-reveal>대표원장 <em>최효영</em></h2>
              <blockquote class="director-quote" data-reveal>"다른 사람들이 치과 이야기를 할 때<br/>정직하게 치료를 잘하는 병원이라며<br/>추천하는 곳을 만들고 싶습니다."</blockquote>
              <p class="director-philosophy" data-reveal>환자가 아파서 찾아오는 곳이 아니라, 건강할 때도 생각나는 치과. 이음치과가 지향하는 병원의 모습입니다. 모든 환자분을 가족처럼 대하고, 과잉 진료 없이 정직하게 — 그것이 이음의 철학입니다.</p>
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
            <span class="section-label">04 — PROMISE</span>
            <h2 class="promise-main-title">이음의<br/><em>약속</em></h2>
            <p class="promise-subtitle">환자분께 드리는 네 가지 약속입니다.<br/>진료실에서 벌어지는 모든 순간에 이 약속을 지킵니다.</p>
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
            <span class="section-label">05 — EQUIPMENT</span>
            <h2 class="equip-title">Digital<br/>Dentistry</h2>
            <p class="equip-subtitle">이음치과는 '최신 장비가 있다'는 것에 만족하지 않습니다.<br/>각 장비가 <em>환자에게 어떤 이점</em>을 주는지가 더 중요합니다.</p>
          </div>
          <div class="equip-grid">
            <div class="equip-item" data-reveal>
              <span class="equip-num">01</span>
              <h4>CBCT</h4>
              <p class="equip-name-en">Cone Beam CT</p>
              <p class="equip-desc">일반 X-ray로는 보이지 않는 구조를 3차원 입체 영상으로 진단합니다. 뼈의 양과 밀도, 신경 위치까지 정밀하게 파악하여 임플란트 수술의 안전성과 정확도를 높입니다.</p>
              <span class="equip-benefit">환자 이점: 정확한 진단 → 불필요한 절개 최소화</span>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">02</span>
              <h4>구강스캐너</h4>
              <p class="equip-name-en">Intraoral Scanner</p>
              <p class="equip-desc">기존의 불쾌한 본뜨기(인상재) 없이 디지털로 구강 내부를 정밀 스캔합니다. 보철물 제작 정확도가 올라가고, 환자분의 구역질과 불편함이 사라집니다.</p>
              <span class="equip-benefit">환자 이점: 본뜨기 불편 제거 + 보철 정밀도 향상</span>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">03</span>
              <h4>3D 프린터</h4>
              <p class="equip-name-en">3D Surgical Guide</p>
              <p class="equip-desc">환자 맞춤 임플란트 수술 가이드를 원내에서 직접 출력합니다. 외부 기공소에 의뢰하지 않아 시간이 단축되고, 가이드 수술로 절개를 최소화해 회복이 빨라집니다.</p>
              <span class="equip-benefit">환자 이점: 맞춤 가이드 → 빠른 회복 + 시간 단축</span>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">04</span>
              <h4>플라즈마 소독기</h4>
              <p class="equip-name-en">Plasma Sterilizer</p>
              <p class="equip-desc">과산화수소 플라즈마를 이용해 기구를 멸균합니다. 대학병원급 감염관리 시스템으로 교차감염 위험을 원천 차단하며, 열에 약한 기구까지 완벽하게 소독합니다.</p>
              <span class="equip-benefit">환자 이점: 대학병원급 위생 → 안심 진료</span>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">05</span>
              <h4>아쿠아케어</h4>
              <p class="equip-name-en">Aquacare</p>
              <p class="equip-desc">미세분말을 고압으로 분사하여 충치만 정밀하게 제거합니다. 드릴 없이 치료하므로 진동과 소음이 거의 없고, 건강한 치아 조직을 최대한 보존할 수 있습니다.</p>
              <span class="equip-benefit">환자 이점: 드릴 없는 치료 → 불안감 해소</span>
            </div>
            <div class="equip-item" data-reveal>
              <span class="equip-num">06</span>
              <h4>니트람</h4>
              <p class="equip-name-en">NiTram Endo System</p>
              <p class="equip-desc">니켈-티타늄 합금 파일을 이용한 정밀 근관치료(신경치료) 시스템입니다. 복잡한 치아 뿌리 형태에도 안전하게 적용되어 치료 성공률을 높이고 재치료를 줄입니다.</p>
              <span class="equip-benefit">환자 이점: 신경치료 성공률 향상 → 재치료 감소</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section class="section contact-big" id="section-contact" aria-label="연락처 및 오시는 길">
        <div class="contact-bg" aria-hidden="true"><div class="grain"></div></div>
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
      <footer class="footer-full" role="contentinfo">
        <div class="container-wide">
          <div class="footer-top-grid">
            <div class="footer-brand-col">
              <div class="footer-brand-big">이음</div>
              <p class="footer-tagline">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
              <div class="footer-sns">
                <a href="https://www.instagram.com/eum.dental/" target="_blank" rel="noopener" aria-label="이음치과 인스타그램">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                </a>
                <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" aria-label="이음치과 네이버 지도">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </a>
              </div>
            </div>
            <div class="footer-nav-col">
              <h4>진료</h4>
              <a href="/treatments">진료 안내</a>
              <a href="/doctors">의료진 소개</a>
              <a href="/cases">비포애프터</a>
              <a href="/faq">자주 묻는 질문</a>
            </div>
            <div class="footer-nav-col">
              <h4>콘텐츠</h4>
              <a href="/blogs">블로그</a>
              <a href="/dictionary">치과 백과사전</a>
              <a href="/notices">공지사항</a>
            </div>
            <div class="footer-nav-col">
              <h4>안내</h4>
              <a href="/about">병원 소개</a>
              <a href="/visit">내원 안내</a>
              <a href="tel:051-206-5888">전화 상담</a>
            </div>
          </div>
          <div class="footer-biz-info">
            <p>이음치과의원 | 대표원장: 최효영 | 사업자등록번호: 000-00-00000</p>
            <p>부산광역시 강서구 명지국제8로 265 2층 | TEL: 051-206-5888 | E-mail: hyogunim@gmail.com</p>
          </div>
          <div class="footer-bottom-bar">
            <span>&copy; <span id="footerYear">2025</span> 이음치과의원. All rights reserved.</span>
            <div class="footer-legal-links">
              <a href="/about">개인정보처리방침</a>
              <a href="/about">이용약관</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <a href="tel:051-206-5888" class="floating-call" id="floatingCall" data-hover>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </a>

      <script src="/static/app.js"></script>
      <script src="/static/gsap-init.js"></script>
      <script>{
        `document.getElementById('footerYear').textContent = new Date().getFullYear();`
      }</script>
    </div>
  )
}
