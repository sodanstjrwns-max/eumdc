/**
 * 칼럼(블로그)·비포애프터 SEO/AEO 공통 헬퍼 — PFWE-COLUMN-CASE-SEO.md (2026-10-03)
 *
 * - 블로그에는 카테고리 컬럼이 없어, 제목·본문의 진료 키워드로 관련 진료(treatments.slug)를 고른다.
 * - 비포애프터 category 값은 treatments.slug 와 같다(implant·aesthetic·resin·tmj·general …).
 * - 새 문장을 지어내지 않는다: 요약·FAQ·alt 는 모두 저장된 본문/필드에서만 만든다.
 */
import { SITE_URL } from '../seo'

/** 진료 slug ↔ 화면 이름 ↔ 본문 키워드 (DB treatments 표와 같은 slug) */
export const TOPICS: { slug: string; name: string; keywords: string[] }[] = [
  { slug: 'implant', name: '임플란트', keywords: ['임플란트', '발치 후', '뼈이식', '브릿지'] },
  { slug: 'aesthetic', name: '심미보철', keywords: ['심미보철', '크라운', '올세라믹', '지르코니아', '보철'] },
  { slug: 'laminate', name: '라미네이트', keywords: ['라미네이트'] },
  { slug: 'resin', name: '심미레진', keywords: ['레진', '블랙트라이앵글', '앞니 사이', '아말감'] },
  { slug: 'general', name: '충치·신경치료', keywords: ['충치', '신경치료', '치수염', '인레이', '온레이', '금이 갔', '크랙', '파절'] },
  { slug: 'periodontal', name: '잇몸치료', keywords: ['잇몸', '치주', '치은'] },
  { slug: 'wisdom-tooth', name: '사랑니 발치', keywords: ['사랑니'] },
  { slug: 'pediatric', name: '소아·예방치과', keywords: ['유치', '소아', '아기', '어린이', '영유아'] },
  { slug: 'prevention', name: '스케일링·예방', keywords: ['스케일링', '불소', '예방'] },
  { slug: 'tmj', name: '턱관절 치료', keywords: ['턱관절', 'TMJ', '이갈이'] },
  { slug: 'orthodontics', name: '치아교정', keywords: ['교정'] },
]

export const TOPIC_NAME: Record<string, string> = Object.fromEntries(TOPICS.map(t => [t.slug, t.name]))

function plain(s?: string | null): string {
  return String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
}

/** 제목(가중치 3)·본문 키워드 출현 수로 관련 진료 slug 를 점수순 반환 */
export function topicsForText(title?: string | null, body?: string | null, max = 2): string[] {
  const t = plain(title), b = plain(body)
  const scored = TOPICS.map(tp => {
    let s = 0
    for (const k of tp.keywords) {
      if (t.includes(k)) s += 3
      const n = b.split(k).length - 1
      s += Math.min(n, 10)
    }
    return { slug: tp.slug, s }
  }).filter(x => x.s >= 2).sort((a, b) => b.s - a.s)
  return scored.slice(0, max).map(x => x.slug)
}

export function htmlText(s: string): string {
  return String(s || '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

const QUESTION_END = /(\?|？|까요|나요|가요|인가요|을까|ㄹ까|할까|되나요|있나요|없나요|하나요|은요|는요)\s*[.!]?$/

/**
 * 렌더된 본문 HTML 의 질문형 <h3> + 다음 제목 전까지의 형제 요소 → FAQ.
 * 화면 문구 그대로(지어내지 않음). 답변 10자 미만·중복 질문은 제외.
 */
export function faqsFromArticleHtml(html: string, maxItems = 20, maxAnswer = 900): { question: string; answer: string }[] {
  const src = String(html || '')
  const out: { question: string; answer: string }[] = []
  const seen = new Set<string>()
  for (const m of src.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi)) {
    if (out.length >= maxItems) break
    const q = htmlText(m[1]).replace(/^(?:Q\s*\d*\s*[.:)]|질문\s*\d*\s*[.:)])\s*/i, '').trim()
    if (!q || q.length > 200 || !QUESTION_END.test(q) || seen.has(q)) continue
    let seg = src.slice((m.index || 0) + m[0].length)
    const next = seg.search(/<h[1-3][\s>]/i)
    if (next >= 0) seg = seg.slice(0, next)
    const stop = seg.search(/<hr\b|<p\b[^>]*>\s*※/i)
    if (stop >= 0) seg = seg.slice(0, stop)
    let a = htmlText(seg).replace(/^(?:A\s*\d*\s*[.:)]|답변\s*[.:)])\s*/i, '').trim()
    if (a.length < 10) continue
    if (a.length > maxAnswer) a = a.slice(0, maxAnswer).replace(/\s+\S*$/, '') + '…'
    seen.add(q)
    out.push({ question: q, answer: a })
  }
  return out
}

/**
 * 본문 이미지 정리: alt 가 비었거나 파일명(1.png 등)이면 `{제목} 관련 이미지 N`,
 * 첫 이미지(히어로가 없을 때)만 eager, 나머지 loading="lazy" + decoding="async".
 */
export function polishArticleImages(html: string, title: string, firstIsLcp = false): string {
  let n = 0
  return String(html || '').replace(/<img\b([^>]*?)\/?>/gi, (_m, attrs: string) => {
    n++
    let a = attrs
    const altM = a.match(/\balt\s*=\s*(["'])(.*?)\1/i)
    const alt = altM ? altM[2].trim() : ''
    const bad = !alt || /^[\w\-. ()]+\.(png|jpe?g|webp|gif|avif|heic)$/i.test(alt) || /^(image|img|사진|이미지)\s*\d*$/i.test(alt)
    const safeTitle = title.replace(/"/g, '&quot;')
    const newAlt = `${safeTitle} 관련 이미지 ${n}`
    if (bad) {
      a = altM ? a.replace(altM[0], `alt="${newAlt}"`) : `${a} alt="${newAlt}"`
    }
    const eager = firstIsLcp && n === 1
    if (!/\bloading\s*=/.test(a)) a += eager ? ' loading="eager"' : ' loading="lazy"'
    if (!/\bdecoding\s*=/.test(a)) a += ' decoding="async"'
    return `<img${a.startsWith(' ') ? '' : ' '}${a.trim()}>`
  })
}

/** 서버 페이지네이션 계산 */
export function paginate(total: number, rawPage: string | undefined, size: number) {
  const pages = Math.max(1, Math.ceil(total / size))
  const valid = rawPage === undefined || /^[1-9]\d*$/.test(rawPage)
  const page = valid && rawPage ? parseInt(rawPage, 10) : 1
  return { page, pages, size, offset: (page - 1) * size, valid: valid && page <= pages }
}

export function abs(u?: string | null): string | undefined {
  if (!u) return undefined
  return u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`
}

/** 의사 @id — 의료진 상세(/doctors/{slug})의 Person/Physician 노드와 같은 값 */
export function physicianId(slug?: string | null): string {
  return slug ? `${SITE_URL}/doctors/${slug}/#person` : `${SITE_URL}/#director`
}

/** JSON-LD 노드에서 @context 제거 (@graph 안에 넣을 때) */
export function node<T extends Record<string, any>>(o: T): Omit<T, '@context'> {
  const { ['@context']: _c, ...rest } = o
  return rest
}

/** YYYY-MM-DD (DB 'YYYY-MM-DD hh:mm:ss' → 날짜만). 값 없으면 undefined */
export function ymd(v?: string | null): string | undefined {
  const m = String(v || '').match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : undefined
}

/** DB UTC 'YYYY-MM-DD hh:mm:ss' → ISO 8601(+00:00). 값 없으면 undefined */
export function isoDateTime(v?: string | null): string | undefined {
  const m = String(v || '').match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/)
  if (m) return `${m[1]}T${m[2]}+00:00`
  return ymd(v)
}
