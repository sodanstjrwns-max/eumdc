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

/** 진료과목 상세 페이지 */
export function treatmentDetailPage(slug: string, treatmentName?: string, heroTitle?: string) {
  return subPageLayout('TREATMENT', (
    <div class="page-treatment-detail">
      <section class="treat-detail-hero" id="treatHero">
        <div class="container-wide">
          <a href="/treatments" class="back-link" data-hover>← 전체 진료 보기</a>
          {/* SSR H1 for SEO crawlers — JS replaces with full hero content */}
          {treatmentName && <h1 class="treat-hero-title" id="ssrH1">{heroTitle || treatmentName}</h1>}
          <div class="treat-hero-content" id="treatHeroContent">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>

      <div id="treatDetailContent" data-slug={slug}>
        <div class="loading-spinner">불러오는 중...</div>
      </div>

      <script src="/static/treatments.js"></script>
    </div>
  ))
}
