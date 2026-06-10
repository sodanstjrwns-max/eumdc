import { subPageLayout } from './layout'
import { RegionInfo, TreatmentInfo, SEO_REGIONS_MAP, SEO_TREATMENTS } from '../data/seo-matrix'
import { MATRIX_LOCAL_CONTENT } from '../data/matrix-local-content'

/**
 * 🎯 지역×진료 매트릭스 페이지 (SSR 풍부 콘텐츠)
 * URL: /regions/:region/:treatment (예: /regions/myeongji/implant)
 *
 * 핵심 전략:
 *  - 모든 콘텐츠를 SSR로 즉시 렌더링 → 크롤러가 첫 요청에 색인 가능
 *  - H1에 "{지역명} {진료명}" 정확 매칭 → 검색어와 1:1 일치
 *  - H2/H3/FAQ로 의미 검색(semantic) 신호 강화
 *  - LSI 키워드 자연스럽게 본문에 분포
 *  - 인근 지역·관련 진료 내부 링크로 링크 주스 분산
 */
export function regionTreatmentPage(region: RegionInfo, treatment: TreatmentInfo) {
  const h1 = `${region.name} ${treatment.name}`
  const titleVariants = region.searchVariants.slice(0, 3).join('·')
  const treatmentVariants = treatment.searchVariants.slice(0, 4)

  // 지역×진료 고유 본문 (도배성 방지 — 페이지별 차별화 콘텐츠)
  const localContent = MATRIX_LOCAL_CONTENT[`${region.slug}__${treatment.slug}`]

  // 인근 지역에서 같은 진료 받기 (내부 링크)
  const nearbyRegions = region.nearbyAreas
    .map(slug => SEO_REGIONS_MAP[slug])
    .filter(Boolean)

  // 관련 진료 (같은 페이지 내 cross-link)
  const relatedTreatments = SEO_TREATMENTS
    .filter(t => t.slug !== treatment.slug && t.category === treatment.category)
    .slice(0, 3)

  return subPageLayout('REGION_TREATMENT', (
    <div class="page-region-treatment">

      {/* ───────── HERO: H1 정확 매칭 ───────── */}
      <section class="rt-hero">
        <div class="container-wide">
          <nav class="rt-breadcrumb" aria-label="breadcrumb">
            <a href="/">홈</a>
            <span class="sep">›</span>
            <a href="/regions">지역별 진료</a>
            <span class="sep">›</span>
            <a href={`/regions/${region.slug}`}>{region.name}</a>
            <span class="sep">›</span>
            <span aria-current="page">{treatment.name}</span>
          </nav>

          <h1 class="rt-h1">
            {region.name} <span class="rt-h1-accent">{treatment.name}</span>
          </h1>
          <p class="rt-subtitle">{treatment.shortBenefit}</p>

          <div class="rt-hero-meta">
            <div class="rt-hero-meta-item">
              <span class="rt-meta-label">진료 지역</span>
              <strong>{region.fullName}</strong>
            </div>
            <div class="rt-hero-meta-item">
              <span class="rt-meta-label">치료 기간</span>
              <strong>{treatment.duration}</strong>
            </div>
            <div class="rt-hero-meta-item">
              <span class="rt-meta-label">위치</span>
              <strong>{region.distance}</strong>
            </div>
          </div>

          <div class="rt-hero-cta">
            <a href="tel:051-206-5888" class="treat-cta-btn primary">
              <i class="fa-solid fa-phone"></i> 051-206-5888 전화상담
            </a>
            <a href="/visit" class="treat-cta-btn secondary">예약·방문 안내</a>
          </div>
        </div>
      </section>

      {/* ───────── INTRO: LSI 키워드 자연 분포 ───────── */}
      <section class="rt-intro">
        <div class="container-wide">
          <h2 class="rt-h2">{region.name}에서 {treatment.name} 진료 — 이음치과의원</h2>
          <p class="rt-paragraph">
            <strong>{region.fullName}</strong>에서 <strong>{treatment.name}</strong> 진료를 찾고 계신가요?
            이음치과의원은 {region.distance} 거리에 위치해 {region.name} 주민 분들이 부담 없이 내원하실 수 있는
            <strong> {treatment.name} 전문 치과</strong>입니다.
            {treatmentVariants[0]}·{treatmentVariants[1] || treatment.name}·{treatmentVariants[2] || treatment.name}
            {' '}등 다양한 키워드로 검색해 오시는 분들께 동일한 양질의 진료를 제공하며,
            {treatment.shortBenefit}.
          </p>

          <p class="rt-paragraph">
            이음치과의원은 <strong>통합치의학과 전문의</strong>가 직접 진단·치료를 진행하며,
            {region.searchVariants[1] || region.name} 지역 환자 분들께
            정확하고 근거 기반의 치료를 약속드립니다.
            특히 {region.name} 인근의 {nearbyRegions.map(r => r.name).join('·') || region.district} 지역에서도 많이 찾아주십니다.
          </p>
        </div>
      </section>

      {/* ───────── 지역 특화 콘텐츠 (페이지별 고유 본문) ───────── */}
      {localContent && (
        <section class="rt-local">
          <div class="container-wide">
            <div class="rt-local-content" dangerouslySetInnerHTML={{ __html: localContent }}></div>
          </div>
        </section>
      )}

      {/* ───────── 왜 이음치과? (E-E-A-T 신호) ───────── */}
      <section class="rt-why">
        <div class="container-wide">
          <h2 class="rt-h2">왜 {region.name}에서 {treatment.name}는 이음치과인가</h2>
          <div class="rt-why-grid">
            {treatment.whyChoose.map((item, i) => (
              <div class="rt-why-card">
                <div class="rt-why-num">0{i + 1}</div>
                <p class="rt-why-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 진료 프로세스 (HowTo 신호) ───────── */}
      <section class="rt-process">
        <div class="container-wide">
          <h2 class="rt-h2">{treatment.name} 진료 프로세스</h2>
          <ol class="rt-process-list">
            {treatment.processSteps.map((step, i) => (
              <li class="rt-process-item">
                <span class="rt-process-num">{i + 1}</span>
                <span class="rt-process-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── FAQ (FAQPage JSON-LD 대상) ───────── */}
      <section class="rt-faq">
        <div class="container-wide">
          <h2 class="rt-h2">{region.name} {treatment.name} 자주 묻는 질문</h2>
          <div class="rt-faq-list">
            {treatment.faqs.map((faq, i) => (
              <details class="rt-faq-item" open={i === 0}>
                <summary class="rt-faq-q">
                  <span class="rt-faq-q-icon">Q</span>
                  <span class="rt-faq-q-text">{faq.q}</span>
                </summary>
                <div class="rt-faq-a">
                  <span class="rt-faq-a-icon">A</span>
                  <p class="rt-faq-a-text">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 인근 지역 매트릭스 링크 (내부 링크) ───────── */}
      {nearbyRegions.length > 0 && (
        <section class="rt-nearby">
          <div class="container-wide">
            <h2 class="rt-h2">{region.district} 인근 지역 {treatment.name}</h2>
            <p class="rt-paragraph">아래 지역에서도 이음치과의원 {treatment.name} 진료를 받으실 수 있습니다.</p>
            <div class="rt-nearby-grid">
              {nearbyRegions.map(nr => (
                <a class="rt-nearby-card" href={`/regions/${nr.slug}/${treatment.slug}`}>
                  <strong>{nr.name} {treatment.name}</strong>
                  <span>{nr.fullName}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── 관련 진료 (cross-link) ───────── */}
      {relatedTreatments.length > 0 && (
        <section class="rt-related">
          <div class="container-wide">
            <h2 class="rt-h2">{region.name}에서 함께 받기 좋은 진료</h2>
            <div class="rt-related-grid">
              {relatedTreatments.map(rt => (
                <a class="rt-related-card" href={`/regions/${region.slug}/${rt.slug}`}>
                  <strong>{region.name} {rt.name}</strong>
                  <span>{rt.shortBenefit}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── 오시는 길 (LocalBusiness 보강) ───────── */}
      <section class="rt-visit">
        <div class="container-wide">
          <h2 class="rt-h2">{region.name}에서 이음치과 오시는 길</h2>
          <div class="rt-visit-grid">
            <div class="rt-visit-card">
              <h3>주소</h3>
              <p>부산 강서구 명지국제8로 265, 201호</p>
              <small>{region.name}에서 {region.distance}</small>
            </div>
            <div class="rt-visit-card">
              <h3>전화</h3>
              <p><a href="tel:051-206-5888">051-206-5888</a></p>
            </div>
            <div class="rt-visit-card">
              <h3>진료시간</h3>
              <p>월~목 10:00~21:00<br/>금 10:00~18:00<br/>토·일 10:00~14:00</p>
            </div>
            <div class="rt-visit-card">
              <h3>주차</h3>
              <p>2시간 무료 주차</p>
            </div>
          </div>
          <div class="rt-final-cta">
            <a href="tel:051-206-5888" class="treat-cta-btn primary">
              지금 {region.name} {treatment.name} 예약하기
            </a>
            <a href="https://naver.me/xQ04S3yK" target="_blank" rel="noopener" class="treat-cta-btn secondary">
              네이버 지도 보기
            </a>
          </div>
        </div>
      </section>
    </div>
  ))
}
