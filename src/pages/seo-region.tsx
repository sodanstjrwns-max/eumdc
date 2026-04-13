import { subPageLayout } from './layout'

/** 지역 SEO 랜딩 페이지 — 동적 */
export function seoRegionPage(slug: string) {
  return subPageLayout('REGION', (
    <div class="page-seo-region">
      <section class="region-hero" id="regionHero">
        <div class="container-wide">
          <div id="regionHeroContent" data-slug={slug}>
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>

      <section class="region-treatments" id="regionTreatments">
        <div class="container-wide">
          <h2 class="section-heading">이음치과 주요 진료</h2>
          <div class="region-treat-grid" id="regionTreatGrid"></div>
        </div>
      </section>

      <section class="region-cases" id="regionCases">
        <div class="container-wide">
          <h2 class="section-heading">실제 치료 사례</h2>
          <div class="region-case-grid" id="regionCaseGrid"></div>
        </div>
      </section>

      <section class="region-faq" id="regionFaq">
        <div class="container-wide">
          <h2 class="section-heading">자주 묻는 질문</h2>
          <div class="region-faq-list" id="regionFaqList"></div>
        </div>
      </section>

      <section class="region-map">
        <div class="container-wide">
          <h2 class="section-heading">오시는 길</h2>
          <div class="region-info-grid">
            <div class="region-info-card">
              <h3>주소</h3>
              <p>부산 강서구 명지국제8로 265 2층</p>
            </div>
            <div class="region-info-card">
              <h3>전화</h3>
              <p><a href="tel:051-206-5888">051-206-5888</a></p>
            </div>
            <div class="region-info-card">
              <h3>진료시간</h3>
              <p>월~목 10:00-21:00<br/>금 10:00-18:00<br/>토·일 10:00-14:00</p>
            </div>
            <div class="region-info-card">
              <h3>주차</h3>
              <p>2시간 무료 주차</p>
            </div>
          </div>
          <div class="region-cta">
            <a href="tel:051-206-5888" class="treat-cta-btn primary">지금 예약하기</a>
            <a href="https://naver.me/xQ04S3yK" target="_blank" rel="noopener" class="treat-cta-btn secondary">네이버 지도 보기</a>
          </div>
        </div>
      </section>

      <script src="/static/region.js"></script>
    </div>
  ))
}

/** 지역 SEO 목록 페이지 */
export function seoRegionListPage() {
  return subPageLayout('REGIONS', (
    <div class="page-seo-regions-list">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">LOCAL SEO</span>
          <h1 class="page-title">지역별 치과 안내</h1>
          <p class="page-subtitle">가까운 지역에서 이음치과를 찾으세요.</p>
        </div>
      </section>
      <section class="regions-list-section">
        <div class="container-wide">
          <div class="regions-grid" id="regionsGrid">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>
      <script src="/static/region.js"></script>
    </div>
  ))
}
