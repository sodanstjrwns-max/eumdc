import { subPageLayout } from './layout'
import { RegionInfo, TreatmentInfo, SEO_REGIONS_MAP, SEO_TREATMENTS_MAP } from '../data/seo-matrix'
import { CostInfo } from '../data/seo-cost-matrix'

/**
 * 💰 지역×진료×가격 매트릭스 페이지 (SSR)
 * URL: /regions/:region/:treatment/cost (예: /regions/myeongji/implant/cost)
 *
 * 🎯 타겟 키워드:
 *  - "{지역} {진료} 가격"
 *  - "{지역} {진료} 비용"
 *  - "{진료} 얼마"
 *  - "{진료} 보험 적용"
 *  - "{진료} 분할납부"
 *
 * ⚠️ 의료법: 정확 금액 표기 회피 → 범위·구성요소·가격결정요인 안내
 */
export function regionTreatmentCostPage(
  region: RegionInfo,
  treatment: TreatmentInfo,
  cost: CostInfo
) {
  const h1 = `${region.name} ${treatment.name} 가격·비용 안내`

  // 인근 지역 가격 페이지 (내부 링크)
  const nearbyRegions = region.nearbyAreas
    .map(slug => SEO_REGIONS_MAP[slug])
    .filter(Boolean)

  return subPageLayout('REGION_TREATMENT_COST', (
    <div class="page-region-treatment page-cost">

      {/* ───────── HERO ───────── */}
      <section class="rt-hero rt-hero-cost">
        <div class="container-wide">
          <nav class="rt-breadcrumb" aria-label="breadcrumb">
            <a href="/">홈</a>
            <span class="sep">›</span>
            <a href="/regions">지역별 진료</a>
            <span class="sep">›</span>
            <a href={`/regions/${region.slug}`}>{region.name}</a>
            <span class="sep">›</span>
            <a href={`/regions/${region.slug}/${treatment.slug}`}>{treatment.name}</a>
            <span class="sep">›</span>
            <span aria-current="page">가격·비용</span>
          </nav>

          <div class="rt-cost-badge">💰 가격·비용 안내</div>
          <h1 class="rt-h1">
            {region.name} {treatment.name} <span class="rt-h1-accent">가격·비용</span>
          </h1>
          <p class="rt-subtitle">
            정확한 비용은 진료 후 안내드리며, 본 페이지에서는 가격 결정 요인과 보험·분납 안내를 제공합니다.
          </p>

          <div class="rt-hero-meta">
            <div class="rt-hero-meta-item">
              <span class="rt-meta-label">단위</span>
              <strong>{cost.unit}</strong>
            </div>
            <div class="rt-hero-meta-item">
              <span class="rt-meta-label">보험 적용</span>
              <strong>{cost.insuranceCovered ? '✅ 일부 적용' : '❌ 비급여'}</strong>
            </div>
            <div class="rt-hero-meta-item">
              <span class="rt-meta-label">분할납부</span>
              <strong>{cost.installmentAvailable ? '✅ 가능' : '❌ 불가'}</strong>
            </div>
          </div>

          <div class="rt-hero-cta">
            <a href="tel:051-206-5888" class="treat-cta-btn primary">
              <i class="fa-solid fa-phone"></i> 정확한 비용 상담 (051-206-5888)
            </a>
            <a href="/visit" class="treat-cta-btn secondary">방문 상담 예약</a>
          </div>
        </div>
      </section>

      {/* ───────── 가격 결정 요인 ───────── */}
      <section class="rt-cost-factors">
        <div class="container-wide">
          <h2 class="rt-h2">{region.name} {treatment.name} 가격을 결정하는 요인</h2>
          <p class="rt-paragraph">
            <strong>{region.fullName}</strong>에서 {treatment.name} 비용은 아래 요인에 따라 달라집니다.
            정확한 견적은 정밀 진단 후 안내드립니다.
          </p>
          <div class="cost-factor-grid">
            {cost.factors.map((f, i) => (
              <div class="cost-factor-card">
                <div class="cost-factor-num">0{i + 1}</div>
                <h3 class="cost-factor-title">{f.factor}</h3>
                <p class="cost-factor-desc">{f.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 보험 안내 ───────── */}
      <section class="rt-cost-insurance">
        <div class="container-wide">
          <div class="cost-info-card">
            <h2 class="rt-h2">
              <i class="fa-solid fa-shield-heart"></i> {treatment.name} 건강보험 적용
            </h2>
            <p class="cost-info-body">{cost.insuranceNote}</p>
          </div>

          <div class="cost-info-card cost-info-card-secondary">
            <h2 class="rt-h2">
              <i class="fa-solid fa-credit-card"></i> 분할납부·카드 결제 안내
            </h2>
            <p class="cost-info-body">{cost.installmentNote}</p>
          </div>

          <div class="cost-info-card cost-info-card-tertiary">
            <h2 class="rt-h2">
              <i class="fa-solid fa-stethoscope"></i> 상담료
            </h2>
            <p class="cost-info-body">{cost.consultationFee}</p>
          </div>
        </div>
      </section>

      {/* ───────── 비용 절감 팁 ───────── */}
      <section class="rt-cost-tip">
        <div class="container-wide">
          <div class="cost-tip-box">
            <div class="cost-tip-icon">💡</div>
            <div class="cost-tip-content">
              <h2 class="rt-h2">{treatment.name} 비용을 합리적으로 진행하는 팁</h2>
              <p>{cost.beforeAfterTip}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 가격 관련 FAQ (자동 생성) ───────── */}
      <section class="rt-faq">
        <div class="container-wide">
          <h2 class="rt-h2">{region.name} {treatment.name} 가격 자주 묻는 질문</h2>
          <div class="rt-faq-list">
            <details class="rt-faq-item" open>
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">{region.name} {treatment.name} 가격은 얼마인가요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">
                  {cost.priceRange}. 정확한 비용은 정밀 진단 후 환자분의 구강 상태에 맞춰 안내드립니다.
                  051-206-5888로 전화 주시면 대략적인 가격대를 안내해드릴 수 있습니다.
                </p>
              </div>
            </details>

            <details class="rt-faq-item">
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">{treatment.name} 보험 적용이 되나요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">{cost.insuranceNote}</p>
              </div>
            </details>

            <details class="rt-faq-item">
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">{treatment.name} 분할납부가 가능한가요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">{cost.installmentNote}</p>
              </div>
            </details>

            <details class="rt-faq-item">
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">{treatment.name} 상담료가 따로 드나요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">{cost.consultationFee}</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ───────── 인근 지역 가격 페이지 ───────── */}
      {nearbyRegions.length > 0 && (
        <section class="rt-nearby">
          <div class="container-wide">
            <h2 class="rt-h2">{region.district} 인근 지역 {treatment.name} 가격</h2>
            <p class="rt-paragraph">아래 지역의 {treatment.name} 가격 안내도 참고하실 수 있습니다.</p>
            <div class="rt-nearby-grid">
              {nearbyRegions.map(nr => (
                <a class="rt-nearby-card" href={`/regions/${nr.slug}/${treatment.slug}/cost`}>
                  <strong>{nr.name} {treatment.name} 가격</strong>
                  <span>{nr.fullName}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── 진료 페이지로 돌아가기 ───────── */}
      <section class="rt-related">
        <div class="container-wide">
          <h2 class="rt-h2">{region.name} {treatment.name} 더 알아보기</h2>
          <div class="rt-related-grid">
            <a class="rt-related-card rt-related-card-primary" href={`/regions/${region.slug}/${treatment.slug}`}>
              <strong>{region.name} {treatment.name} 진료 안내</strong>
              <span>치료 과정·기간·차별점 자세히 보기</span>
            </a>
            <a class="rt-related-card" href={`/best/${region.slug}-${treatment.slug}`}>
              <strong>{region.name} {treatment.name} 잘하는 곳 비교</strong>
              <span>이음치과 추천 이유</span>
            </a>
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section class="rt-visit">
        <div class="container-wide">
          <div class="rt-final-cta">
            <a href="tel:051-206-5888" class="treat-cta-btn primary">
              지금 {region.name} {treatment.name} 가격 상담받기
            </a>
            <a href="/visit" class="treat-cta-btn secondary">
              방문 예약하기
            </a>
          </div>
        </div>
      </section>
    </div>
  ))
}
