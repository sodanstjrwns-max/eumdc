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
              <p>이음치과의원은 CBCT 3D 진단, 디지털 가이드 임플란트, MEG Aligner 투명교정, 라미네이트·올세라믹 심미보철 전문 진료를 제공합니다. {regionName} 거주민의 통원 편의를 고려한 진료 동선과 야간진료를 운영합니다.</p>
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

/** 지역 SEO 목록 페이지 — SSR-first 30개 지역 카드 + 구별 그룹화 */
export function seoRegionListPage(regionsByDistrict?: Record<string, any[]>) {
  const groups = regionsByDistrict || {}
  const districtOrder = ['강서구', '사하구', '사상구', '북구', '김해시']
  const orderedDistricts = districtOrder.filter(d => groups[d] && groups[d].length > 0)

  return subPageLayout('REGIONS', (
    <div class="page-seo-regions-list">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">LOCAL SEO</span>
          <h1 class="page-title" id="ssrH1">부산 강서구 명지국제신도시 이음치과 진료 지역 안내</h1>
          <p class="page-subtitle">
            <strong>이음치과의원</strong>은 부산광역시 강서구 명지국제신도시를 중심으로
            강서구·사하구·사상구·북구·김해시 등 <strong>30개 지역 거주민</strong>을 위한
            <strong>임플란트·투명교정·라미네이트·치아교정</strong> 전문 디지털 치과입니다.
            가까운 지역에서 이음치과를 찾으세요.
          </p>
        </div>
      </section>

      {/* SSR 본문 인트로 — 크롤러용 풍부 텍스트 */}
      <section class="regions-intro-section">
        <div class="container-wide">
          <div class="regions-intro-box">
            <h2 class="section-title">왜 이음치과를 찾는 30개 지역이 있을까요?</h2>
            <p>
              이음치과의원은 <strong>부산광역시 강서구 명지국제신도시 명지국제8로 265</strong>에 위치한
              디지털 치과입니다. CBCT·디지털 가이디드 서저리·MEG Aligner 투명교정·라미네이트 심미보철 등
              부산 전역에서 보기 드문 진료 시스템을 갖추고 있어, 명지신도시 외에도 강서구 전역(녹산·신호·에코델타시티·대저·지사),
              낙동강 건너 사하구(하단·다대포·신평·괴정), 사상구(사상·감전·주례), 북구(덕천·화명·구포·금곡),
              김해시(장유·삼계·진영·봉림)에서 자차 6~30분 거리로 찾아오십니다.
            </p>
            <ul class="regions-intro-features">
              <li><strong>4대 핵심 진료</strong> — 임플란트, 투명교정, 라미네이트, 치아교정</li>
              <li><strong>주말진료 운영</strong> — 토·일 10시~17시 운영으로 직장인·학부모님 편의 제공</li>
              <li><strong>2시간 무료 주차</strong> — 자차 방문 거주민 편의 보장</li>
              <li><strong>김해공항 인접</strong> — 김해·진영·삼계 권역 25~30분</li>
              <li><strong>토탈 케어 6개 진료실</strong> — 가족 단위 동시 진료 가능</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 구·시별 그룹 SSR 렌더링 */}
      {orderedDistricts.length > 0 ? (
        <section class="regions-list-section">
          <div class="container-wide">
            {orderedDistricts.map(district => (
              <div class="region-district-block" key={district}>
                <h2 class="region-district-title">
                  <i class="ri-map-pin-line"></i> {district} 진료 지역
                  <span class="region-district-count">({groups[district].length}곳)</span>
                </h2>
                <div class="regions-grid">
                  {groups[district].map((r: any) => (
                    <a href={`/regions/${r.slug}`} class="region-card-ssr" key={r.slug}>
                      <div class="region-card-name">{r.region_name}</div>
                      {r.hero_text && (
                        <div class="region-card-desc">
                          {r.hero_text.length > 80 ? r.hero_text.slice(0, 80) + '…' : r.hero_text}
                        </div>
                      )}
                      <div class="region-card-cta">
                        <span>{r.region_name} 치과 보기</span>
                        <i class="ri-arrow-right-line"></i>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section class="regions-list-section">
          <div class="container-wide">
            <div class="regions-grid" id="regionsGrid">
              <div class="loading-spinner">불러오는 중...</div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section class="regions-cta-section">
        <div class="container-wide">
          <div class="regions-cta-box">
            <h2>이 지역에 살고 계신가요? 이음치과의원이 함께합니다</h2>
            <p>
              찾으시는 지역이 위 목록에 없어도 괜찮습니다. 부산·경남 전역에서 거주민이 찾아오는
              이음치과의원입니다. 진료 상담 후 가장 가까운 경로와 무료 주차를 안내해드립니다.
            </p>
            <div class="regions-cta-buttons">
              <a href="tel:051-206-5888" class="btn btn-primary"><i class="ri-phone-line"></i> 051-206-5888 전화 예약</a>
              <a href="/booking" class="btn btn-outline"><i class="ri-calendar-check-line"></i> 온라인 예약</a>
            </div>
          </div>
        </div>
      </section>

      <script src="/static/region.js"></script>
    </div>
  ))
}
