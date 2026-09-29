/**
 * 얇은(thin) 상세 페이지 판정 — GSC "발견됨/크롤링됨-미색인" 정리용 (2026-09-29)
 *
 * 원칙 (PF Web Engine 2026-09-21 공통 규칙):
 *  - 항목 고유 본문(태그 제거·공백 제외 글자 수)이 기준 미만이면
 *    <meta name="robots" content="noindex, follow"> + X-Robots-Tag noindex + 사이트맵 제외.
 *  - 페이지와 내부 링크는 그대로 유지 → 원장이 본문을 보강하면 기준을 넘는 즉시 자동 색인 복귀.
 *
 * 2026-09-29 실측(원격 D1 읽기 전용):
 *  - 용어사전 219개: 고유 본문 381~545자 89개(4단 템플릿·FAQ 없음) / 1,395~1,835자 130개(FAQ 보유) — 800자 기준으로 명확히 갈림
 *  - 비포애프터 11건: 치료 설명 40~136자 (AFTER 사진은 회원 전용이라 비로그인 본문이 매우 짧음)
 *  - 공지 5건: 86~193자 (휴진·진료일정 안내)
 */

export const THIN_DICT_MIN_CHARS = 800
export const THIN_CASE_MIN_CHARS = 300
export const THIN_NOTICE_MIN_CHARS = 300

/** HTML/마크다운 → 화면에 보이는 글자 수 (태그·엔티티·공백 제외) */
export function visibleTextLength(s?: string | null): number {
  if (!s) return 0
  return String(s)
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/[#*_>`\-|]+/g, ' ')
    .replace(/\s+/g, '')
    .length
}

function faqTextLength(faqs?: string | null): number {
  if (!faqs) return 0
  try {
    const arr = JSON.parse(faqs)
    if (!Array.isArray(arr)) return 0
    return arr.reduce((n: number, f: any) => n + visibleTextLength(f?.q) + visibleTextLength(f?.a), 0)
  } catch { return 0 }
}

/** 용어사전: 짧은 설명 + 상세 설명 + FAQ 고유 본문 */
export function isThinDictTerm(t: { short_desc?: string | null; full_desc?: string | null; faqs?: string | null }): boolean {
  const len = visibleTextLength(t.short_desc) + visibleTextLength(t.full_desc) + faqTextLength(t.faqs)
  return len < THIN_DICT_MIN_CHARS
}

/** 비포애프터: 치료 설명(description) */
export function isThinCase(cs: { description?: string | null }): boolean {
  return visibleTextLength(cs.description) < THIN_CASE_MIN_CHARS
}

/** 공지: 본문(content_html 우선, 없으면 content) */
export function isThinNotice(n: { content?: string | null; content_html?: string | null }): boolean {
  return Math.max(visibleTextLength(n.content_html), visibleTextLength(n.content)) < THIN_NOTICE_MIN_CHARS
}

export const NOINDEX_FOLLOW = 'noindex, follow'
