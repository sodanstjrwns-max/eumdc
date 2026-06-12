import { subPageLayout } from './layout'

export type PriceGroup = {
  treatment: { name: string; slug: string }
  prices: { item_name: string; price_text?: string; insurance_covered?: number; note?: string }[]
}

/** 전체 진료 비용 안내 페이지 — 완전 SSR (AEO: AI/크롤러가 JS 없이 가격 즉시 수집) */
export function pricesPage(groups: PriceGroup[], faqs: { question: string; answer: string }[]) {
  const updatedDate = new Date().toISOString().split('T')[0]
  return subPageLayout('PRICES', (
    <div class="page-prices">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">PRICE GUIDE</span>
          <h1 class="page-title">진료 비용 안내</h1>
          <p class="page-subtitle">
            이음치과의원의 주요 진료 수가를 투명하게 공개합니다.
            모든 비용은 부가세 포함 기준이며, 구강 상태에 따라 달라질 수 있습니다.
          </p>
        </div>
      </section>

      {/* TL;DR — AI 답변 인용 최적화 블록 */}
      <section class="treat-section prices-tldr" id="prices-summary">
        <div class="container-wide">
          <div class="prices-tldr-box">
            <h2 class="treat-section-title">핵심 요약</h2>
            <ul class="prices-tldr-list">
              {groups.map((g) => {
                const texts = g.prices.map(p => p.price_text || '').filter(Boolean)
                const summary = texts.length > 1 ? `${texts[texts.length - 1]} ~ ${texts[0]}` : (texts[0] || '상담 시 안내')
                return (
                  <li>
                    <strong>{g.treatment.name}</strong>: {summary}
                    {' '}<a href={`/treatments/${g.treatment.slug}`}>자세히 →</a>
                  </li>
                )
              })}
            </ul>
            <p class="prices-tldr-note">기준일: {updatedDate} · 비급여 진료 수가는 의료법 제45조에 따라 고지됩니다.</p>
          </div>
        </div>
      </section>

      {/* 치료별 상세 가격표 — 전부 SSR */}
      {groups.map((g) => (
        <section class="treat-section prices-group bg-alt" id={`price-${g.treatment.slug}`}>
          <div class="container-wide">
            <h2 class="treat-section-title">{g.treatment.name} 비용</h2>
            <div class="treat-price-table">
              <table>
                <thead>
                  <tr><th>항목</th><th>비용</th><th>보험</th><th>비고</th></tr>
                </thead>
                <tbody>
                  {g.prices.map((p) => (
                    <tr>
                      <td>{p.item_name}</td>
                      <td class="price-val">{p.price_text || '-'}</td>
                      <td>{p.insurance_covered ? <span class="badge-ins">보험적용</span> : '-'}</td>
                      <td>{p.note || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p class="treat-price-note">
              <a href={`/treatments/${g.treatment.slug}`}>{g.treatment.name} 진료 안내 보기 →</a>
            </p>
          </div>
        </section>
      ))}

      {/* 비용 FAQ — SSR (FAQPage 스키마와 동일 콘텐츠) */}
      {faqs.length > 0 && (
        <section class="treat-section prices-faq" id="prices-faq">
          <div class="container-wide">
            <h2 class="treat-section-title">비용·보험 자주 묻는 질문</h2>
            <div class="faq-ssr-group">
              {faqs.map((f, i) => (
                <details class="faq-ssr-item">
                  <summary class="faq-ssr-q">
                    <span class="faq-ssr-num">{String(i + 1).padStart(2, '0')}</span>
                    <span class="faq-ssr-q-text">Q. {f.question}</span>
                  </summary>
                  <div class="faq-ssr-a" dangerouslySetInnerHTML={{ __html: f.answer.replace(/\n/g, '<br>') }}></div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 안내 사항 */}
      <section class="treat-section prices-disclaimer">
        <div class="container-wide">
          <h2 class="treat-section-title">비용 안내 시 꼭 알아두세요</h2>
          <ul class="prices-disclaimer-list">
            <li>표기된 비용은 <strong>1치(개) 기준</strong>이며, 치아 상태·뼈 상태에 따라 추가 시술(뼈이식 등)이 필요할 수 있습니다.</li>
            <li>임플란트는 <strong>만 65세 이상 건강보험 적용</strong>(평생 2개, 본인부담 30%) 대상입니다.</li>
            <li>정확한 비용은 <strong>CBCT 촬영 및 구강 검진 후</strong> 치료 계획과 함께 안내해 드립니다.</li>
            <li>카드 결제, 무이자 할부 가능합니다.</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section class="treat-section treat-cta-bottom">
        <div class="container-wide">
          <div class="treat-cta-inner">
            <h3>정확한 비용이 궁금하다면</h3>
            <p>CBCT 진단 후 과잉진료 없는 정직한 치료 계획을 안내해 드립니다.</p>
            <div class="treat-cta-actions">
              <a href="tel:051-206-5888" class="treat-cta-btn primary">051-206-5888 전화 상담</a>
              <a href="https://m.place.naver.com/hospital/2005922467/booking" target="_blank" rel="noopener" class="treat-cta-btn secondary">네이버 예약</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  ))
}
