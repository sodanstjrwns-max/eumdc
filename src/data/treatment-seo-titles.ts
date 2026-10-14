/**
 * 진료 상세(/treatments/:slug) 제목 오버레이 (2026-10-14)
 * - 핵심 지역 키워드 "명지"를 제목 앞쪽에 둔다 (명지 하위 페이지와 함께 "명지 {진료}" 검색어 정렬).
 * - 의료광고 문제 표현(무통·통증 없는·최고·안전·전문·TMJ 전문) 을 제목·H1·설명에서 뺀다.
 * - D1 meta_title 을 덮어쓰는 코드 오버레이 — DB 마이그레이션 없이 되돌릴 수 있게 한 곳에 모았다.
 */
type SeoOverride = { meta_title: string; hero_title?: string; meta_description?: string }

export const TREATMENT_SEO_OVERRIDES: Record<string, SeoOverride> = {
  implant: { meta_title: '명지 임플란트 | 이음치과 CBCT·디지털 가이드 식립' },
  aesthetic: { meta_title: '명지 심미보철 | 이음치과 라미네이트·올세라믹·지르코니아' },
  laminate: { meta_title: '명지 라미네이트 | 이음치과 — 치아 색·모양·틈 개선 심미보철' },
  invisalign: { meta_title: '명지 투명교정 MEG Aligner | 이음치과 메가젠 디지털 투명교정' },
  orthodontics: { meta_title: '명지 치아교정 | 이음치과 — 투명교정·설측·클리피씨 맞춤 교정' },
  general: {
    meta_title: '명지 충치·신경치료 | 이음치과 고배율 확대경 보존 치료',
    hero_title: '자연치아를 살리는 정밀 충치·신경치료',
    meta_description: '명지 이음치과 충치·신경치료 — 디지털 엑스레이·구강카메라로 충치 범위를 확인하고 고배율 확대경으로 근관치료를 진행합니다. 치아 보존 우선 원칙. ☎ 051-206-5888'
  },
  periodontal: { meta_title: '명지 잇몸치료 | 이음치과 단계별 치주 치료·정기 관리' },
  resin: { meta_title: '명지 심미레진 | 이음치과 당일 치아색 수복' },
  tmj: { meta_title: '명지 턱관절 치료 | 이음치과 CBCT·교합 분석·스플린트' },
  'wisdom-tooth': {
    meta_title: '명지 사랑니 발치 | 이음치과 CBCT로 신경 위치 확인',
    hero_title: 'CBCT로 확인하고 계획하는 사랑니 발치',
    meta_description: '명지 이음치과 사랑니 발치 — CBCT 3D 진단으로 신경관 위치를 확인한 뒤 매복·수평 사랑니 발치를 계획합니다. ☎ 051-206-5888'
  },
  pediatric: { meta_title: '명지 소아·예방치과 | 이음치과 불소 도포·실란트·소아 충치' },
  prevention: {
    meta_title: '명지 스케일링·예방 | 이음치과 정기 검진·건강보험 스케일링',
    hero_title: '치료보다 먼저, 정기 검진과 스케일링'
  }
}

export function applyTreatmentSeoOverride<T extends Record<string, any>>(t: T): T {
  if (!t) return t
  const o = TREATMENT_SEO_OVERRIDES[t.slug]
  return o ? { ...t, ...o } : t
}
