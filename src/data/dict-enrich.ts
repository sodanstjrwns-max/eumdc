/**
 * 용어사전 보강 오버레이 (2026-10-08 지역 핵심 키워드 SEO — "허접한 걸 살리는" 방향)
 *
 * 배경: 79fab5b(2026-09-29)에서 고유 본문 800자 미만 용어 89개를 noindex·사이트맵 제외했다.
 * 본문은 D1(dict_terms)에 있지만 원격 D1 은 쓰지 않는 원칙이라, 보강 본문을 레포 데이터 파일
 * (dict-enrich-content.ts)로 두고 렌더·사이트맵 단계에서 D1 행 위에 덮어쓴다.
 *  - full_desc / faqs 를 보강본으로 교체 → isThinDictTerm(800자) 기준을 넘어 자동으로 index·사이트맵 복귀.
 *  - updated_at 은 보강 실제 날짜(고정값). new Date() 사용 금지.
 *  - 원장이 관리자에서 D1 본문을 더 길게(보강본보다) 고치면 D1 쪽이 우선한다.
 *  - 동의어 중복 용어는 301 로 대표 용어에 합친다 (DICT_ALIASES).
 */
import { DICT_ENRICH_CONTENT } from './dict-enrich-content'
import { visibleTextLength } from '../utils/thin-content'

export const DICT_ENRICH_DATE = '2026-10-08'

export type DictEnrich = {
  type: string
  html: string
  faqs: { q: string; a: string }[]
  see: string[]
  tx: string[]
}

/** 동의어·중복 용어 → 대표 용어 slug (301). 대표 쪽을 충실히 보강한다. */
export const DICT_ALIASES: Record<string, string> = {
  'provisional': 'temporary-crown',       // 프로비저널 = 임시 보철
  'jaw-joint': 'tmj-joint',               // 악관절 = 측두하악관절
  'digital-panoramic': 'panoramic-xray',  // 디지털 파노라마 = 파노라마
}

/** SQL NOT IN 용 (목록·자동완성·관련 용어에서 별칭 제외) */
export const DICT_ALIAS_SQL_LIST = Object.keys(DICT_ALIASES).map((s) => `'${s}'`).join(',')

export function getDictEnrich(slug: string): DictEnrich | undefined {
  return DICT_ENRICH_CONTENT[slug]
}

function faqsLen(faqs?: string | null): number {
  try {
    const a = JSON.parse(faqs || '')
    return Array.isArray(a) ? a.reduce((n: number, f: any) => n + visibleTextLength(f?.q) + visibleTextLength(f?.a), 0) : 0
  } catch { return 0 }
}

/** D1 용어 행에 보강본을 덮어쓴 새 객체 (보강본이 없거나 D1 쪽이 더 길면 원본 그대로) */
export function applyDictEnrich<T extends Record<string, any>>(term: T): T & { _enrich?: DictEnrich } {
  if (!term) return term
  const e = getDictEnrich(term.slug)
  if (!e) return term
  const dbLen = visibleTextLength(term.full_desc) + faqsLen(term.faqs)
  const enLen = visibleTextLength(e.html) + e.faqs.reduce((n, f) => n + visibleTextLength(f.q) + visibleTextLength(f.a), 0)
  if (dbLen >= enLen) return term
  return {
    ...term,
    full_desc: e.html,
    faqs: JSON.stringify(e.faqs),
    updated_at: `${DICT_ENRICH_DATE} 00:00:00`,
    _enrich: e,
  }
}
