/**
 * Content 처리 유틸 - 마크다운 HTML 변환 + 치과용어 자동링크
 * Cloudflare Workers Web API만 사용 (no Node.js deps)
 */

/** HTML 이스케이프 */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 간단하고 강력한 마크다운 → HTML 변환
 * 지원: H1~H4, **굵게**, *기울임*, 리스트, 링크, 이미지, 구분선, 인용, 코드
 */
export function markdownToHtml(md: string): string {
  if (!md) return ''
  try {
    return _markdownToHtmlImpl(md)
  } catch (e) {
    console.error('[markdownToHtml] failed:', e)
    // 실패 시 escape된 plain text로 반환
    return `<p class="md-p">${escapeHtml(String(md))}</p>`
  }
}

function _markdownToHtmlImpl(md: string): string {
  // 줄바꿈 정규화
  let text = md.replace(/\r\n?/g, '\n')

  // 코드 블록 (```...```) 임시 치환
  const codeBlocks: string[] = []
  text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(`<pre class="md-code"><code>${escapeHtml(code.trim())}</code></pre>`)
    return `\u0000CODE${codeBlocks.length - 1}\u0000`
  })

  // 인라인 코드 (`...`) 임시 치환
  const inlineCodes: string[] = []
  text = text.replace(/`([^`\n]+)`/g, (_, c) => {
    inlineCodes.push(`<code class="md-inline-code">${escapeHtml(c)}</code>`)
    return `\u0000IC${inlineCodes.length - 1}\u0000`
  })

  // 블록 파싱 (줄 단위)
  const lines = text.split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // 빈 줄
    if (!trimmed) {
      out.push('')
      i++
      continue
    }

    // 헤딩 H4~H1
    const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (hMatch) {
      const level = hMatch[1].length
      const content = inlineFormat(hMatch[2])
      out.push(`<h${level} class="md-h${level}">${content}</h${level}>`)
      i++
      continue
    }

    // 구분선
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      out.push('<hr class="md-hr"/>')
      i++
      continue
    }

    // 인용
    if (trimmed.startsWith('> ')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quote.push(lines[i].trim().substring(2))
        i++
      }
      out.push(`<blockquote class="md-quote">${quote.map(q => inlineFormat(q)).join('<br/>')}</blockquote>`)
      continue
    }

    // 순서 없는 리스트 (- , * , + )
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ''))
        i++
      }
      out.push(`<ul class="md-ul">${items.map(it => `<li>${inlineFormat(it)}</li>`).join('')}</ul>`)
      continue
    }

    // 순서 있는 리스트 (1. 2. 3.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''))
        i++
      }
      out.push(`<ol class="md-ol">${items.map(it => `<li>${inlineFormat(it)}</li>`).join('')}</ol>`)
      continue
    }

    // 일반 문단 - 연속된 비어있지 않은 줄 묶음
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>|[-*+]\s|\d+\.\s|---|\*\*\*|___)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim())
      i++
    }
    if (para.length) {
      out.push(`<p class="md-p">${inlineFormat(para.join(' '))}</p>`)
    }
  }

  let html = out.filter(l => l !== '').join('\n')

  // 코드블록/인라인코드 복원
  html = html.replace(/\u0000IC(\d+)\u0000/g, (_, idx) => inlineCodes[+idx] || '')
  html = html.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeBlocks[+idx] || '')

  return html
}

/** 인라인 포맷 (굵게, 기울임, 링크, 이미지) */
function inlineFormat(s: string): string {
  // 이미지 ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) =>
    `<img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" class="md-img" loading="lazy"/>`
  )
  // 링크 [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    `<a href="${escapeAttr(url)}" class="md-link" ${url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${escapeHtml(text)}</a>`
  )
  // **굵게**
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
  // *기울임*
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
  return s
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;')
}

/**
 * 치과 용어 자동 하이퍼링크
 * HTML 본문에서 용어를 찾아 <a href="/dictionary/:slug">로 감쌈
 * - 태그 안이나 이미 링크된 텍스트는 건들지 않음
 * - 용어당 처음 1회만 링크 (SEO 관점)
 */
export function linkDictionaryTerms(
  html: string,
  terms: Array<{ name: string; slug: string; aliases?: string | null }>
): string {
  if (!html || !terms || !terms.length) return html
  try {
    return _linkDictionaryTermsImpl(html, terms)
  } catch (e) {
    console.error('[linkDictionaryTerms] failed:', e)
    return html // 실패 시 원본 반환 (치명적 에러 방지)
  }
}

function _linkDictionaryTermsImpl(
  html: string,
  terms: Array<{ name: string; slug: string; aliases?: string | null }>
): string {
  if (!html || !terms.length) return html

  // 긴 이름부터 매칭 (부분일치 방지)
  const entries: Array<{ name: string; slug: string }> = []
  for (const t of terms) {
    entries.push({ name: t.name, slug: t.slug })
    // aliases는 JSON 문자열일 수 있음
    if (t.aliases) {
      try {
        const arr = typeof t.aliases === 'string' ? JSON.parse(t.aliases) : t.aliases
        if (Array.isArray(arr)) {
          for (const a of arr) if (a) entries.push({ name: String(a), slug: t.slug })
        }
      } catch {}
    }
  }
  entries.sort((a, b) => b.name.length - a.name.length)

  const linked = new Set<string>()

  // HTML을 토큰화: 태그는 skip, 텍스트만 치환
  let out = ''
  let rest = html
  const tagRe = /<[^>]+>/
  while (rest.length > 0) {
    const m = rest.match(tagRe)
    if (!m) {
      out += replaceInText(rest, entries, linked)
      break
    }
    const before = rest.slice(0, m.index!)
    const tag = m[0]
    out += replaceInText(before, entries, linked)

    // <a ...>...</a> 블록은 스킵
    if (/^<a[\s>]/i.test(tag)) {
      const closeIdx = rest.indexOf('</a>', m.index! + tag.length)
      if (closeIdx !== -1) {
        out += rest.slice(m.index!, closeIdx + 4)
        rest = rest.slice(closeIdx + 4)
        continue
      }
    }
    // <h1>~<h4>, <code>, <pre> 안도 스킵
    if (/^<(h[1-4]|code|pre)[\s>]/i.test(tag)) {
      const tagName = tag.match(/^<([a-zA-Z0-9]+)/)![1]
      const closeIdx = rest.toLowerCase().indexOf(`</${tagName.toLowerCase()}>`, m.index! + tag.length)
      if (closeIdx !== -1) {
        out += rest.slice(m.index!, closeIdx + tagName.length + 3)
        rest = rest.slice(closeIdx + tagName.length + 3)
        continue
      }
    }

    out += tag
    rest = rest.slice(m.index! + tag.length)
  }
  return out
}

function replaceInText(
  text: string,
  entries: Array<{ name: string; slug: string }>,
  linked: Set<string>
): string {
  if (!text) return text
  let result = text
  for (const e of entries) {
    if (linked.has(e.slug)) continue
    // 단어 경계는 한글이라 안 통함 → 간단히 첫 일치만 치환
    const idx = result.indexOf(e.name)
    if (idx !== -1) {
      result =
        result.slice(0, idx) +
        `<a href="/dictionary/${e.slug}" class="dict-link" title="${escapeAttr(e.name)} 용어 설명">${e.name}</a>` +
        result.slice(idx + e.name.length)
      linked.add(e.slug)
    }
  }
  return result
}
