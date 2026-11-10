// ============================================================
// AI 검색용 병원 사실 블록 — /llms.txt · /llms-full.txt 맨 위 "## 병원 정보" (2026-11-10 SEO·AEO 정비 1차)
// 값은 전부 레포에 이미 있는 상수·D1 공개 데이터에서만 가져온다 (추측·새 문구 금지).
//   - 이름·주소·전화: src/seo.ts 상수
//   - 진료 시간·휴게·접수 마감·휴진·정류장: src/pages/myeongji-hub.tsx 진료시간 표·오시는 길, src/seo.ts openingHoursSpecification
//   - 진료 분야·의료진·진료비: D1 공개 행(is_published = 1) — 관리자에서 숨긴 값은 쿼리에서 이미 빠져 있다
// ============================================================
import { SITE_URL, SITE_NAME, SITE_NAME_EN, PHONE_DISPLAY, ADDRESS_FULL } from '../seo'
import { PRICES_DATE } from './content-dates'

/** 진료 시간·휴진 정보의 기준일 — 원장 요청으로 진료 시간을 바꿔 사이트 전체에 반영한 날(커밋 8c05574). 시간이 다시 바뀌면 같이 고칠 것 */
export const CLINIC_FACTS_DATE = '2026-10-30'

const HOURS_LINE =
  '월~금 12:00–21:00 (야간 진료, 휴게 16:00–17:00, 접수 마감 20:30) / 토 10:00–17:00 (휴게 13:00–14:00, 접수 마감 16:30) / 일요일·공휴일 휴진 (대체공휴일은 진료)'
const NEAREST_STOP = '국민은행명지국제신도시지점 정류장(강서구 8·8-1·21·124번) 하차 후 도보 1분'
const NAVER_BOOKING_URL = 'https://m.place.naver.com/hospital/2005922467/booking'
const KAKAO_CHANNEL_URL = 'http://pf.kakao.com/_diyyn'

type FactsInput = {
  treatments?: { name?: string }[]
  doctors?: { name?: string; title?: string; specialties?: any }[]
  /** price_guide 공개 행 (진료 정렬순 → 항목 정렬순) */
  prices?: { t_name?: string; item_name?: string; price_text?: string; insurance_covered?: number; note?: string }[]
}

function parseList(v: any): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string' && x)
  if (typeof v === 'string' && v.trim().startsWith('[')) {
    try { const a = JSON.parse(v); return Array.isArray(a) ? a.filter((x) => typeof x === 'string' && x) : [] } catch { return [] }
  }
  return []
}

/** 주요 비급여 진료비 — 진료별 앞 항목부터 돌아가며 최대 6줄, 공개된 값 그대로 */
export function keyPriceLines(prices: FactsInput['prices'], max = 6): string[] {
  const groups: { name: string; rows: NonNullable<FactsInput['prices']> }[] = []
  for (const p of prices || []) {
    if (!p || p.insurance_covered || !p.item_name || !String(p.price_text || '').trim()) continue
    const key = p.t_name || ''
    let g = groups.find((x) => x.name === key)
    if (!g) { g = { name: key, rows: [] }; groups.push(g) }
    g.rows.push(p)
  }
  const picked: { gi: number; ri: number }[] = []
  for (let round = 0; picked.length < max; round++) {
    let added = false
    for (let gi = 0; gi < groups.length && picked.length < max; gi++) {
      if (groups[gi].rows[round]) { picked.push({ gi, ri: round }); added = true }
    }
    if (!added) break
  }
  picked.sort((a, b) => a.gi - b.gi || a.ri - b.ri)
  return picked.map(({ gi, ri }) => {
    const p = groups[gi].rows[ri]
    return `${p.item_name}: ${String(p.price_text).trim()}${p.note ? ` (${p.note})` : ''}`
  })
}

export function clinicFactsBlock(input: FactsInput): string {
  const lines: string[] = ['## 병원 정보', '']
  lines.push(`- 이름: ${SITE_NAME} (${SITE_NAME_EN})`)
  const fields = (input.treatments || []).map((t) => (t?.name || '').trim()).filter(Boolean)
  if (fields.length) lines.push(`- 진료 분야: ${fields.join(', ')}`)
  lines.push(`- 주소: ${ADDRESS_FULL} / 가까운 정류장: ${NEAREST_STOP}`)
  lines.push(`- 전화: ${PHONE_DISPLAY}`)
  lines.push(`- 진료 시간: ${HOURS_LINE}`)
  const docs = (input.doctors || []).filter((d) => d?.name).map((d) => {
    const specs = parseList(d.specialties)
    return `${d.name}(${d.title || '원장'}${specs.length ? ` · ${specs.join('·')}` : ''})`
  })
  if (docs.length) lines.push(`- 의료진: ${docs.join(', ')}`)
  lines.push(`- 예약: 네이버 예약 ${NAVER_BOOKING_URL} / 카카오톡 채널 ${KAKAO_CHANNEL_URL} / 전화 ${PHONE_DISPLAY}`)
  lines.push(`- 진료 안내: ${SITE_URL}/treatments / 비용 안내: ${SITE_URL}/prices / 의료진: ${SITE_URL}/doctors / 지역 안내(허브): ${SITE_URL}/regions/myeongji / 자주 묻는 질문: ${SITE_URL}/faq`)
  const priceLines = keyPriceLines(input.prices)
  if (priceLines.length >= 3) {
    lines.push(`- 주요 비급여 진료비 (기준일 ${PRICES_DATE}, 전체 수가표: ${SITE_URL}/prices):`)
    for (const l of priceLines) lines.push(`  - ${l}`)
  }
  lines.push(`- 최종 확인일: ${CLINIC_FACTS_DATE} (진료 시간 변경 반영일)`)
  return lines.join('\n') + '\n'
}
