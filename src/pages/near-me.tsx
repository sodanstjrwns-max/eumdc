import { subPageLayout } from './layout'
import { SEO_REGIONS, SEO_TREATMENTS, PRIORITY_TREATMENT_SLUGS } from '../data/seo-matrix'

/**
 * 📱 "Near Me" 모바일 검색 최적화 페이지
 * URL: /near-me, /open-now, /weekend-dental
 *
 * 🎯 타겟 키워드:
 *  - "내 근처 치과", "가까운 치과"
 *  - "지금 여는 치과", "오늘 진료하는 치과"
 *  - "야간 치과", "주말 진료 치과"
 *  - "일요일 진료 치과"
 *  - "{지역} 야간진료"
 */

type NearMeVariant = 'near-me' | 'open-now' | 'weekend' | 'night'

export function nearMePage(variant: NearMeVariant = 'near-me') {
  const config = {
    'near-me': {
      h1: '내 근처 치과 — 부산 강서구 명지 이음치과의원',
      headline: '가까운 치과 찾고 계신가요?',
      subtitle: '명지국제신도시·강서구·김해 인근에서 가장 가까운 치과를 안내드립니다.',
      badge: '📍 위치 기반 안내',
      keywordHints: ['내 근처 치과', '가까운 치과', '근처 치과 추천', '주변 치과', '근처 임플란트', '근처 교정치과']
    },
    'open-now': {
      h1: '지금 여는 치과 — 야간·당일 진료 이음치과의원',
      headline: '지금 진료 가능한 치과 찾으시나요?',
      subtitle: '평일 야간 21시까지, 주말도 진료합니다. 당일 예약·당일 진료 가능.',
      badge: '🟢 지금 진료 중',
      keywordHints: ['지금 여는 치과', '지금 진료하는 치과', '오늘 여는 치과', '당일 진료 치과', '야간 치과 명지', '늦게까지 하는 치과']
    },
    'weekend': {
      h1: '주말 진료 치과 — 토·일요일 진료 이음치과의원',
      headline: '주말에도 진료받을 수 있는 치과',
      subtitle: '토요일·일요일 모두 진료합니다. 평일에 시간 내기 힘드신 분들께 추천.',
      badge: '📅 토·일 진료',
      keywordHints: ['주말 진료 치과', '토요일 진료 치과', '일요일 진료 치과', '주말 치과 명지', '주말 임플란트', '주말 응급 치과']
    },
    'night': {
      h1: '야간 진료 치과 — 평일 21시까지 이음치과의원',
      headline: '퇴근 후에도 진료받을 수 있는 야간 치과',
      subtitle: '월~목 21시까지 진료. 직장인·자영업자분들이 부담 없이 오실 수 있습니다.',
      badge: '🌙 야간 21시까지',
      keywordHints: ['야간 진료 치과', '늦게까지 하는 치과', '저녁 진료 치과', '명지 야간 치과', '강서구 야간 치과', '퇴근 후 치과']
    }
  }[variant]

  // 진료시간 정보
  const hours = [
    { day: '월·화·수·목', time: '10:00 ~ 21:00', highlight: variant === 'night' },
    { day: '금', time: '휴진' },
    { day: '토', time: '10:00 ~ 14:00', highlight: variant === 'weekend' },
    { day: '일', time: '10:00 ~ 14:00', highlight: variant === 'weekend' }
  ]

  // 핵심 진료 (5대)
  const coreTreatments = PRIORITY_TREATMENT_SLUGS
    .map(slug => SEO_TREATMENTS.find(t => t.slug === slug))
    .filter(Boolean) as typeof SEO_TREATMENTS

  // 명지·강서구 우선 노출
  const priorityRegions = SEO_REGIONS.filter(r =>
    ['myeongji', 'myeongji-ocean', 'gangseo', 'noksan', 'sinho', 'eco-delta'].includes(r.slug)
  )

  return subPageLayout('NEAR_ME', (
    <div class="page-near-me">

      {/* ───────── HERO ───────── */}
      <section class="near-hero">
        <div class="container-wide">
          <div class="near-badge">{config.badge}</div>
          <h1 class="near-h1">{config.headline}</h1>
          <p class="near-subtitle">{config.subtitle}</p>

          <div class="near-cta-row">
            <a href="tel:051-206-5888" class="near-cta-primary">
              <i class="fa-solid fa-phone-volume"></i>
              <div>
                <strong>지금 전화</strong>
                <small>051-206-5888</small>
              </div>
            </a>
            <a href="https://m.place.naver.com/hospital/2005922467/booking" target="_blank" rel="noopener" class="near-cta-secondary">
              <i class="fa-solid fa-calendar-check"></i>
              <div>
                <strong>네이버 예약</strong>
                <small>지금 즉시</small>
              </div>
            </a>
            <a href="https://naver.me/xQ04S3yK" target="_blank" rel="noopener" class="near-cta-secondary">
              <i class="fa-solid fa-location-dot"></i>
              <div>
                <strong>길찾기</strong>
                <small>네이버 지도</small>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ───────── 진료시간 ───────── */}
      <section class="near-hours">
        <div class="container-wide">
          <h2 class="near-h2">📅 진료시간 안내</h2>
          <div class="near-hours-grid">
            {hours.map(h => (
              <div class={`near-hour-card ${h.highlight ? 'near-hour-highlight' : ''}`}>
                <div class="near-hour-day">{h.day}</div>
                <div class="near-hour-time">{h.time}</div>
              </div>
            ))}
          </div>
          <p class="near-hours-note">
            ⚠️ 점심시간(13:00 ~ 14:00) 진료 불가 · 공휴일 휴진 · 응급은 전화 문의
          </p>
        </div>
      </section>

      {/* ───────── 위치 + 거리 ───────── */}
      <section class="near-location">
        <div class="container-wide">
          <h2 class="near-h2">📍 이음치과의원 위치</h2>
          <div class="near-loc-grid">
            <div class="near-loc-card">
              <h3>주소</h3>
              <p><strong>부산 강서구 명지국제8로 265, 201호</strong></p>
              <small>명지국제신도시 중심</small>
            </div>
            <div class="near-loc-card">
              <h3>전화</h3>
              <p><a href="tel:051-206-5888"><strong>051-206-5888</strong></a></p>
              <small>예약·문의·길 안내</small>
            </div>
            <div class="near-loc-card">
              <h3>주차</h3>
              <p><strong>2시간 무료 주차</strong></p>
              <small>지하 주차장 이용 가능</small>
            </div>
            <div class="near-loc-card">
              <h3>대중교통</h3>
              <p><strong>도보 5분 이내</strong></p>
              <small>버스정류장 인접</small>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 지역별 거리 안내 ───────── */}
      <section class="near-regions">
        <div class="container-wide">
          <h2 class="near-h2">🚗 인근 지역에서 이음치과까지 거리</h2>
          <div class="near-region-grid">
            {priorityRegions.map(r => (
              <a href={`/regions/${r.slug}`} class="near-region-card">
                <strong>{r.name}</strong>
                <span>{r.distance}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 핵심 진료 ───────── */}
      <section class="near-treatments">
        <div class="container-wide">
          <h2 class="near-h2">🦷 이음치과 핵심 진료</h2>
          <div class="near-treatment-grid">
            {coreTreatments.map(t => (
              <a href={`/regions/myeongji/${t.slug}`} class="near-treatment-card">
                <strong>{t.name}</strong>
                <span>{t.shortBenefit}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── AEO FAQ ───────── */}
      <section class="near-faq">
        <div class="container-wide">
          <h2 class="near-h2">자주 묻는 질문</h2>
          <div class="rt-faq-list" data-speakable="true">
            <details class="rt-faq-item" open>
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">지금 진료받을 수 있나요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">
                  월~목 10시~21시, 토·일 10시~14시 진료 중입니다. 금요일과 공휴일은 휴진입니다.
                  지금 진료 가능 여부는 051-206-5888로 전화 주시면 즉시 안내드립니다.
                </p>
              </div>
            </details>

            <details class="rt-faq-item">
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">예약 없이 방문해도 되나요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">
                  예약 환자분 우선 진료로 대기시간이 길어질 수 있어 전화 예약을 권장드립니다.
                  급한 통증·외상은 도착 전 전화로 알려주시면 우선 처치 가능합니다.
                </p>
              </div>
            </details>

            <details class="rt-faq-item">
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">주말·야간 진료도 동일한 진료를 받을 수 있나요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">
                  네, 주말·야간 진료도 평일과 동일하게 통합치의학과 전문의가 진료합니다.
                  CBCT·디지털 스캐너 등 진단 장비도 모두 동일하게 사용 가능합니다.
                </p>
              </div>
            </details>

            <details class="rt-faq-item">
              <summary class="rt-faq-q">
                <span class="rt-faq-q-icon">Q</span>
                <span class="rt-faq-q-text">차로 오면 주차는 어디에 하나요?</span>
              </summary>
              <div class="rt-faq-a">
                <span class="rt-faq-a-icon">A</span>
                <p class="rt-faq-a-text">
                  건물 지하주차장 이용 가능하며 2시간 무료 주차가 제공됩니다.
                  진료 시간이 길어질 경우 추가 할인 안내 가능합니다.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ───────── 최종 CTA ───────── */}
      <section class="near-final-cta">
        <div class="container-wide">
          <div class="near-cta-box">
            <h2>지금 바로 연결하세요</h2>
            <p>전화 한 통이면 진료 예약 끝. 평일 야간·주말도 진료합니다.</p>
            <a href="tel:051-206-5888" class="treat-cta-btn primary">
              <i class="fa-solid fa-phone"></i> 051-206-5888 전화 예약
            </a>
          </div>
        </div>
      </section>

      {/* SEO 추가 키워드 (시각적 비노출, AI/크롤러용) */}
      <section class="near-keywords" aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden">
        <h2>관련 검색어</h2>
        <ul>
          {config.keywordHints.map(k => <li>{k}</li>)}
        </ul>
      </section>
    </div>
  ))
}
