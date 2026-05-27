import { subPageLayout } from './layout'

/** 진료과목 목록 페이지 */
export function treatmentsPage() {
  return subPageLayout('TREATMENTS', (
    <div class="page-treatments">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">TREATMENTS</span>
          <h1 class="page-title">진료 안내</h1>
          <p class="page-subtitle">이음치과의원의 전문 진료과목을 소개합니다. 투명한 설명, 확실한 결과.</p>
        </div>
      </section>

      <section class="treatments-overview">
        <div class="container-wide">
          {/* 핵심 진료 */}
          <div class="treat-category-section">
            <h2 class="treat-cat-title"><span class="treat-cat-badge core">SIGNATURE</span> 핵심 진료</h2>
            <div class="treat-grid core" id="treatCoreGrid">
              <div class="loading-spinner">불러오는 중...</div>
            </div>
          </div>

          {/* 일반 진료 */}
          <div class="treat-category-section">
            <h2 class="treat-cat-title"><span class="treat-cat-badge standard">GENERAL</span> 일반 진료</h2>
            <div class="treat-grid standard" id="treatStandardGrid">
              <div class="loading-spinner">불러오는 중...</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section class="treat-cta-section">
        <div class="container-wide">
          <div class="treat-cta-inner">
            <h3>어떤 진료가 필요한지 모르겠다면?</h3>
            <p>전화 한 통이면 친절하게 안내해 드립니다.</p>
            <div class="treat-cta-actions">
              <a href="tel:051-206-5888" class="treat-cta-btn primary">051-206-5888 전화 상담</a>
              <a href="/faq" class="treat-cta-btn secondary">자주 묻는 질문 보기</a>
            </div>
          </div>
        </div>
      </section>

      <script src="/static/treatments.js"></script>
    </div>
  ))
}

/** 진료과목 상세 페이지 (SSR-first for SEO) */
export function treatmentDetailPage(slug: string, treatmentName?: string, heroTitle?: string, treatment?: any) {
  // benefits / process_steps / content_sections는 JSON 문자열 → 안전 파싱
  const safeParse = (s: any): any[] => {
    if (!s) return []
    if (Array.isArray(s)) return s
    try { const r = typeof s === 'string' ? JSON.parse(s) : s; return Array.isArray(r) ? r : [] } catch { return [] }
  }
  const benefits = safeParse(treatment?.benefits)
  const processSteps = safeParse(treatment?.process_steps)
  const contentSections = safeParse(treatment?.content_sections)
  const subtitle = treatment?.hero_subtitle || treatment?.short_desc || ''
  const overview = treatment?.overview || ''

  return subPageLayout('TREATMENT', (
    <div class="page-treatment-detail">
      <section class="treat-detail-hero" id="treatHero">
        <div class="container-wide">
          <a href="/treatments" class="back-link" data-hover>← 전체 진료 보기</a>
          {treatmentName && <h1 class="treat-hero-title" id="ssrH1">{heroTitle || treatmentName}</h1>}
          {subtitle && <p class="treat-hero-subtitle" id="ssrSubtitle">{subtitle}</p>}
          <div class="treat-hero-content" id="treatHeroContent">
            {/* 메타 정보 SSR */}
            {(treatment?.duration || treatment?.recovery || treatment?.price_range) && (
              <div class="treat-hero-meta">
                {treatment?.duration && <span class="treat-meta-item"><strong>치료 시간</strong> {treatment.duration}</span>}
                {treatment?.recovery && <span class="treat-meta-item"><strong>회복 기간</strong> {treatment.recovery}</span>}
                {treatment?.price_range && <span class="treat-meta-item"><strong>비용 범위</strong> {treatment.price_range}</span>}
                {treatment?.insurance_info && <span class="treat-meta-item"><strong>보험</strong> {treatment.insurance_info}</span>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SSR 본문 — Googlebot이 즉시 읽을 수 있게 */}
      <div id="treatDetailContent" data-slug={slug}>
        {overview && (
          <section class="treat-section treat-overview">
            <div class="container-wide">
              <h2 class="treat-section-title">{treatmentName || '진료'} 개요</h2>
              <div class="treat-overview-body" dangerouslySetInnerHTML={{ __html: overview }}></div>
            </div>
          </section>
        )}

        {benefits.length > 0 && (
          <section class="treat-section treat-benefits">
            <div class="container-wide">
              <h2 class="treat-section-title">{treatmentName} 주요 장점</h2>
              <div class="treat-benefits-grid">
                {benefits.map((b: any) => (
                  <div class="treat-benefit-card">
                    {b.icon && <span class="treat-benefit-icon" aria-hidden="true">{b.icon}</span>}
                    <h3 class="treat-benefit-title">{b.title}</h3>
                    <p class="treat-benefit-desc">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {processSteps.length > 0 && (
          <section class="treat-section treat-process">
            <div class="container-wide">
              <h2 class="treat-section-title">{treatmentName} 진료 과정</h2>
              <ol class="treat-process-list">
                {processSteps.map((s: any, i: number) => (
                  <li class="treat-process-step">
                    <span class="treat-process-num">{String(i + 1).padStart(2, '0')}</span>
                    <div class="treat-process-body">
                      <h3 class="treat-process-title">{s.title || s.step || ''}</h3>
                      <p class="treat-process-desc">{s.desc || s.description || ''}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {contentSections.length > 0 && contentSections.map((sec: any) => (
          <section class="treat-section treat-extra">
            <div class="container-wide">
              {sec.title && <h2 class="treat-section-title">{sec.title}</h2>}
              {sec.body && <div class="treat-extra-body" dangerouslySetInnerHTML={{ __html: sec.body }}></div>}
              {sec.content && <div class="treat-extra-body" dangerouslySetInnerHTML={{ __html: sec.content }}></div>}
            </div>
          </section>
        ))}

        {treatment?.before_after_note && (
          <section class="treat-section treat-baf-note">
            <div class="container-wide">
              <h2 class="treat-section-title">치료 전후 안내</h2>
              <p class="treat-baf-text">{treatment.before_after_note}</p>
              <a href="/cases" class="treat-baf-link">실제 비포애프터 케이스 보기 →</a>
            </div>
          </section>
        )}

        {treatment?.warnings && (
          <section class="treat-section treat-warnings">
            <div class="container-wide">
              <h2 class="treat-section-title">진료 시 유의사항</h2>
              <div class="treat-warnings-body" dangerouslySetInnerHTML={{ __html: treatment.warnings }}></div>
            </div>
          </section>
        )}

        {/* 내부 링크 강화 */}
        <section class="treat-section treat-related-links">
          <div class="container-wide">
            <h2 class="treat-section-title">{treatmentName} 관련 안내</h2>
            <div class="treat-related-grid">
              <a href={`/regions/myeongji/${slug}`} class="treat-related-card">
                <strong>명지동 {treatmentName}</strong><span>지역 정보 →</span>
              </a>
              <a href={`/regions/myeongji/${slug}/cost`} class="treat-related-card">
                <strong>{treatmentName} 비용</strong><span>비용 안내 →</span>
              </a>
              <a href={`/best/myeongji-${slug}`} class="treat-related-card">
                <strong>{treatmentName} 잘하는 곳</strong><span>비교 가이드 →</span>
              </a>
              <a href="/cases" class="treat-related-card">
                <strong>비포애프터 케이스</strong><span>실제 결과 →</span>
              </a>
              <a href="/doctors" class="treat-related-card">
                <strong>의료진 소개</strong><span>전문의 보기 →</span>
              </a>
              <a href="/visit" class="treat-related-card">
                <strong>내원 안내</strong><span>오시는 길 →</span>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section class="treat-section treat-cta-bottom">
          <div class="container-wide">
            <div class="treat-cta-inner">
              <h3>{treatmentName}, 이음치과에서 시작하세요</h3>
              <p>{treatment?.cta_text || '정확한 진단과 친절한 상담을 약속드립니다.'}</p>
              <div class="treat-cta-actions">
                <a href="tel:051-206-5888" class="treat-cta-btn primary">051-206-5888 전화 상담</a>
                <a href="https://m.place.naver.com/hospital/2005922467/booking" target="_blank" rel="noopener" class="treat-cta-btn secondary">네이버 예약</a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <script src="/static/treatments.js"></script>
    </div>
  ))
}
