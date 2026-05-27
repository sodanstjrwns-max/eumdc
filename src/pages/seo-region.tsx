import { subPageLayout } from './layout'

/** 지역 SEO 랜딩 페이지 — SSR-first */
export function seoRegionPage(
  slug: string,
  h1Title?: string,
  region?: any,
  regionMatrix?: any,
  treatments?: any[],
  nearbyAreas?: string[]
) {
  const safeParse = (s: any): any[] => {
    if (!s) return []
    if (Array.isArray(s)) return s
    try { const r = typeof s === 'string' ? JSON.parse(s) : s; return Array.isArray(r) ? r : [] } catch { return [] }
  }
  const regionName = region?.region_name || regionMatrix?.name || '지역'
  const heroText = region?.hero_text || ''
  const content = region?.content || ''
  const nearby = nearbyAreas || safeParse(region?.nearby_areas)
  const treats = treatments || []
  const distance = regionMatrix?.distance || ''
  const transportInfo = regionMatrix?.transport || ''

  return subPageLayout('REGION', (
    <div class="page-seo-region">
      <section class="region-hero" id="regionHero">
        <div class="container-wide">
          {h1Title && <h1 class="page-title" id="ssrH1">{h1Title}</h1>}
          {heroText && <p class="region-hero-text">{heroText}</p>}
          <div class="region-hero-meta">
            {distance && <span class="region-meta-item"><strong>거리</strong> {distance}</span>}
            {transportInfo && <span class="region-meta-item"><strong>교통</strong> {transportInfo}</span>}
            <span class="region-meta-item"><strong>주차</strong> 2시간 무료</span>
            <span class="region-meta-item"><strong>전화</strong> <a href="tel:051-206-5888">051-206-5888</a></span>
          </div>
          <div id="regionHeroContent" data-slug={slug}></div>
        </div>
      </section>

      {content && (
        <section class="region-content-section">
          <div class="container-wide">
            <h2 class="section-heading">{regionName}에서 이음치과 선택해야 하는 이유</h2>
            <div class="region-content-body" dangerouslySetInnerHTML={{ __html: content }}></div>
          </div>
        </section>
      )}

      <section class="region-treatments" id="regionTreatments">
        <div class="container-wide">
          <h2 class="section-heading">{regionName}에서 받을 수 있는 주요 진료</h2>
          <div class="region-treat-grid" id="regionTreatGrid">
            {treats.length > 0 ? treats.slice(0, 9).map((t: any) => (
              <a href={`/regions/${slug}/${t.slug}`} class="region-treat-card">
                <h3 class="region-treat-name">{regionName} {t.name}</h3>
                <p class="region-treat-desc">{t.short_desc || `${regionName} 거주민을 위한 ${t.name} 전문 진료입니다.`}</p>
                <div class="region-treat-links">
                  <a href={`/regions/${slug}/${t.slug}`}>정보 →</a>
                  <a href={`/regions/${slug}/${t.slug}/cost`}>비용 →</a>
                  <a href={`/best/${slug}-${t.slug}`}>잘하는 곳 →</a>
                </div>
              </a>
            )) : null}
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section class="region-nearby">
          <div class="container-wide">
            <h2 class="section-heading">{regionName} 인근 지역</h2>
            <div class="region-nearby-grid">
              {nearby.map((n: any) => {
                const name = typeof n === 'string' ? n : (n.name || '')
                const nslug = typeof n === 'string' ? '' : (n.slug || '')
                if (nslug) {
                  return <a href={`/regions/${nslug}`} class="region-nearby-card">{name}</a>
                }
                return <span class="region-nearby-card">{name}</span>
              })}
            </div>
          </div>
        </section>
      )}

      <section class="region-cases" id="regionCases">
        <div class="container-wide">
          <h2 class="section-heading">{regionName} 실제 치료 사례</h2>
          <div class="region-case-grid" id="regionCaseGrid"></div>
        </div>
      </section>

      <section class="region-faq" id="regionFaq">
        <div class="container-wide">
          <h2 class="section-heading">{regionName} 치과 자주 묻는 질문</h2>
          <div class="region-faq-list" id="regionFaqList">
            <details class="region-faq-item">
              <summary><strong>{regionName}에서 이음치과까지 어떻게 가나요?</strong></summary>
              <p>{distance ? `이음치과는 ${regionName}에서 ${distance} 거리에 있습니다. ` : ''}{transportInfo || '명지국제8로 265, 201호에 위치하며 대중교통과 자차 모두 편리합니다.'} 주차는 2시간 무료입니다.</p>
            </details>
            <details class="region-faq-item">
              <summary><strong>{regionName} 거주민도 이음치과 진료가 가능한가요?</strong></summary>
              <p>네, 이음치과는 {regionName}을 포함한 부산 강서구·사하구 전 지역 환자분들을 진료하고 있습니다. 예약은 ☎ 051-206-5888 또는 네이버 예약으로 가능합니다.</p>
            </details>
            <details class="region-faq-item">
              <summary><strong>{regionName} 치과 중 이음치과는 어떤 점이 다른가요?</strong></summary>
              <p>이음치과의원은 CBCT 3D 진단, 디지털 가이드 임플란트, 인비절라인 다이아몬드 제공자, 글로우네이트 라미네이트 전문 진료를 제공합니다. {regionName} 거주민의 통원 편의를 고려한 진료 동선과 야간진료를 운영합니다.</p>
            </details>
          </div>
        </div>
      </section>

      <section class="region-map">
        <div class="container-wide">
          <h2 class="section-heading">오시는 길</h2>
          <div class="region-info-grid">
            <div class="region-info-card">
              <h3>주소</h3>
              <p>부산 강서구 명지국제8로 265, 201호 (명지동)</p>
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
