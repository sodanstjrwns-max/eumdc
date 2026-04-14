/** Main page JSX — STORY-DRIVEN REDESIGN v4
 *  Flow: Question → Insight → Aha → Therefore → Proof
 *  "Why is the dentist so scary?" → "Because you can't see" → "We show everything" → Trust
 */
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
            <p class="story-text story-question">치과가 그렇게도 두려운 장소인 이유는<br/>무엇일까요?</p>
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
            <p class="story-text story-emphasis">내 입안에서 일어나는 일이기 때문입니다.</p>
          </div>
        </div>

        {/* Chapter 3: 공감 — 보이지 않는 것의 공포 (VOLUMETRIC FOG) */}
        <div class="story-chapter story-chapter-dark" id="storyChapter3">
          <div class="chapter-bg-fx" aria-hidden="true">
            <div class="chapter-fog" id="chapterFog"></div>
            <div class="chapter-fog-2" aria-hidden="true"></div>
          </div>
          <div class="story-line" data-story="4">
            <p class="story-text story-small">입 안은 보이지 않죠.</p>
          </div>
          <div class="story-line" data-story="5">
            <p class="story-text story-pause">맞습니다.</p>
          </div>
          <div class="story-line" data-story="6">
            <p class="story-text">우리는<br/><em>보이지 않는 것</em>을 무서워합니다.</p>
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
            <p class="story-text">우리 입안에서<br/><em>무슨 일이 일어나는지</em>를 알면</p>
          </div>
          <div class="story-line" data-story="10">
            <p class="story-text story-emphasis">공포의 대부분을 해결할 수 있습니다.</p>
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
          </div>
          <div class="pillars-grid">
            <div class="pillar-card" data-reveal>
              <div class="pillar-num">01</div>
              <div class="pillar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></div>
              <h3>보여드립니다</h3>
              <p>말로만 설명하지 않습니다. 디지털 장비로 환자의 상태를 직접 보여드리고, 납득하실 때 치료를 시작합니다.</p>
            </div>
            <div class="pillar-card" data-reveal>
              <div class="pillar-num">02</div>
              <div class="pillar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div>
              <h3>살립니다</h3>
              <p>임플란트보다 좋은 건 내 치아입니다. 발치는 더 이상 방법이 없을 때 권하는 마지막 선택이어야 합니다.</p>
            </div>
            <div class="pillar-card" data-reveal>
              <div class="pillar-num">03</div>
              <div class="pillar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div>
              <h3>편안하게</h3>
              <p>치과가 두려운 마음을 잘 압니다. 무통 마취와 세심한 배려로 공포가 아닌 안심을 느끼도록 돕겠습니다.</p>
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
              <span class="section-label">03 — DIRECTOR</span>
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
            <span class="section-label">04 — PROMISE</span>
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
            <span class="section-label">05 — EQUIPMENT</span>
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
            <span>&copy; 2025 이음치과의원. All rights reserved.</span>
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
    </div>
  )
}
