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

function _markdownToHtmlImpl(md: string, opts?: { autoToc?: boolean }): string {
  // 줄바꿈 정규화
  let text = md.replace(/\r\n?/g, '\n')

  // ═══ 자동 TOC 삽입 (옵션 B) ═══
  // - 호출자(최상위)에서만 적용. 재귀(콜아웃 내부)에선 건너뜀.
  // - 사용자가 [[TOC]]를 명시적으로 넣은 경우엔 자동 삽입하지 않음 (수동 우선)
  // - H2가 3개 이상일 때만 첫 H2 앞에 자동 삽입
  if (opts?.autoToc !== false) {
    const hasManualToc = /^\s*\[\[TOC\]\]\s*$/im.test(text)
    if (!hasManualToc) {
      const h2Count = (text.match(/^##\s+.+$/gm) || []).length
      if (h2Count >= 3) {
        // 첫 H2 라인 앞에 [[TOC]] 자동 삽입
        text = text.replace(/^(##\s+.+)$/m, '[[TOC]]\n\n$1')
      }
    }
  }

  // 코드 블록 (```...```) 임시 치환
  const codeBlocks: string[] = []
  text = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(`<pre class="md-code"><code>${escapeHtml(code.trim())}</code></pre>`)
    return `\u0000CODE${codeBlocks.length - 1}\u0000`
  })

  // YouTube 블록: :::youtube URL 또는 :::youtube URL | 캡션 :::
  // 단일 URL도 허용: :::youtube https://youtu.be/ID :::
  const embeds: string[] = []
  text = text.replace(/:::youtube\s+([\s\S]*?):::/gi, (_, body) => {
    const raw = String(body || '').trim()
    // "URL | 캡션" 분리
    const pipeIdx = raw.indexOf('|')
    const urlPart = (pipeIdx >= 0 ? raw.slice(0, pipeIdx) : raw).trim()
    const caption = pipeIdx >= 0 ? raw.slice(pipeIdx + 1).trim() : ''
    const vid = extractYouTubeId(urlPart)
    if (!vid) {
      // 잘못된 URL은 플레인 박스로 안내
      embeds.push(`<div class="md-youtube-error">⚠ 유튜브 URL을 인식하지 못했습니다: ${escapeHtml(urlPart)}</div>`)
    } else {
      const cap = caption
        ? `<figcaption class="md-yt-caption">${escapeHtml(caption)}</figcaption>`
        : ''
      embeds.push(
        `<figure class="md-yt"><div class="md-yt-frame"><iframe src="https://www.youtube-nocookie.com/embed/${escapeAttr(vid)}" title="YouTube 영상" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>${cap}</figure>`
      )
    }
    return `\u0000YT${embeds.length - 1}\u0000`
  })

  // 자동 감지: 한 줄 전체가 YouTube URL인 경우 자동 임베드
  text = text.replace(/^[ \t]*((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)[\w-]{6,}(?:[^\s]*)?)[ \t]*$/gm, (_, url) => {
    const vid = extractYouTubeId(url)
    if (!vid) return _
    embeds.push(
      `<figure class="md-yt"><div class="md-yt-frame"><iframe src="https://www.youtube-nocookie.com/embed/${escapeAttr(vid)}" title="YouTube 영상" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></figure>`
    )
    return `\u0000YT${embeds.length - 1}\u0000`
  })

  // 콜아웃 블록 (:::info / :::warn / :::tip / :::note ... :::) 임시 치환
  const callouts: string[] = []
  text = text.replace(/:::(info|warn|tip|note|success|danger)\s+([\s\S]*?):::/g, (_, kind, body) => {
    const icons: Record<string, string> = {
      info: 'ℹ', warn: '⚠', tip: '💡', note: '📝', success: '✅', danger: '🚫',
    }
    const inner = _markdownToHtmlImpl(body.trim(), { autoToc: false }) // 재귀: 콜아웃 안에 마크다운 허용 (TOC 중복 방지)
    callouts.push(
      `<div class="md-callout md-callout-${kind}"><div class="md-callout-icon" aria-hidden="true">${icons[kind] || 'ℹ'}</div><div class="md-callout-body">${inner}</div></div>`
    )
    return `\u0000CALLOUT${callouts.length - 1}\u0000`
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
  const headings: Array<{ level: number; text: string; slug: string }> = []

  // 헤딩 슬러그 중복 방지
  const usedSlugs = new Set<string>()
  function uniqueSlug(base: string): string {
    let s = base || 'section'
    let n = 1
    while (usedSlugs.has(s)) {
      n++
      s = `${base}-${n}`
    }
    usedSlugs.add(s)
    return s
  }

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // 빈 줄
    if (!trimmed) {
      out.push('')
      i++
      continue
    }

    // 목차 마커 [[TOC]] — 나중에 치환
    if (/^\[\[TOC\]\]$/i.test(trimmed)) {
      out.push('\u0000TOCMARKER\u0000')
      i++
      continue
    }

    // YT 플레이스홀더 (단독 라인) — 문단 감싸기 방지
    if (/^\u0000YT\d+\u0000$/.test(trimmed) || /^\u0000CALLOUT\d+\u0000$/.test(trimmed)) {
      out.push(trimmed)
      i++
      continue
    }

    // 헤딩 H4~H1 (SEO용 id 자동 생성)
    const hMatch = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (hMatch) {
      const level = hMatch[1].length
      const rawText = hMatch[2].trim()
      const content = inlineFormat(rawText)
      const slug = uniqueSlug(slugifyKoEn(stripMdInline(rawText)))
      headings.push({ level, text: stripMdInline(rawText), slug })
      out.push(`<h${level} class="md-h${level}" id="${slug}">${content}</h${level}>`)
      i++
      continue
    }

    // 구분선
    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      out.push('<hr class="md-hr"/>')
      i++
      continue
    }

    // 표 (GFM): | 헤더1 | 헤더2 |   다음줄이 |---|---| 형식이면
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && i + 1 < lines.length) {
      const next = (lines[i + 1] || '').trim()
      // 구분 라인: | --- | :---: | ---: | 등 허용
      if (/^\|[\s:|-]+\|$/.test(next) && /-/.test(next)) {
        const headerCells = parseTableRow(trimmed)
        const aligns = parseTableAligns(next)
        const bodyRows: string[][] = []
        i += 2 // 헤더 + 구분선 스킵
        while (
          i < lines.length &&
          lines[i].trim().startsWith('|') &&
          lines[i].trim().endsWith('|')
        ) {
          bodyRows.push(parseTableRow(lines[i].trim()))
          i++
        }
        // HTML 조립
        const thead =
          '<thead><tr>' +
          headerCells
            .map((c, idx) => `<th${aligns[idx] ? ` style="text-align:${aligns[idx]}"` : ''}>${inlineFormat(c)}</th>`)
            .join('') +
          '</tr></thead>'
        const tbody =
          '<tbody>' +
          bodyRows
            .map(
              row =>
                '<tr>' +
                row
                  .map(
                    (c, idx) =>
                      `<td${aligns[idx] ? ` style="text-align:${aligns[idx]}"` : ''}>${inlineFormat(c)}</td>`
                  )
                  .join('') +
                '</tr>'
            )
            .join('') +
          '</tbody>'
        out.push(`<div class="md-table-wrap"><table class="md-table">${thead}${tbody}</table></div>`)
        continue
      }
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

    // 체크박스 목록 (- [ ] / - [x])
    if (/^[-*+]\s+\[[ xX]\]\s+/.test(trimmed)) {
      const items: Array<{ checked: boolean; text: string }> = []
      while (i < lines.length && /^[-*+]\s+\[[ xX]\]\s+/.test(lines[i].trim())) {
        const m = lines[i].trim().match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/)!
        items.push({ checked: /[xX]/.test(m[1]), text: m[2] })
        i++
      }
      out.push(
        `<ul class="md-tasklist">${items
          .map(
            it =>
              `<li class="md-task${it.checked ? ' md-task-done' : ''}"><span class="md-task-check" aria-hidden="true">${it.checked ? '✓' : ''}</span><span class="md-task-text">${inlineFormat(it.text)}</span></li>`
          )
          .join('')}</ul>`
      )
      continue
    }

    // 순서 없는 리스트 (- , * , + )
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim()) && !/^[-*+]\s+\[[ xX]\]\s+/.test(lines[i].trim())) {
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
      !/^(#{1,4}\s|>|[-*+]\s|\d+\.\s|---|\*\*\*|___|\|)/.test(lines[i].trim()) &&
      !/^\u0000(YT|CALLOUT|TOCMARKER)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim())
      i++
    }
    if (para.length) {
      // 문단 내부 줄바꿈(엔터 1번)은 <br/>로 보존 — 빈 줄(엔터 2번)만 새 문단(<p>)으로 분리됨
      out.push(`<p class="md-p">${inlineFormat(para.join('<br/>'))}</p>`)
    }
  }

  let html = out.filter(l => l !== '').join('\n')

  // TOC 마커 치환
  if (html.includes('\u0000TOCMARKER\u0000')) {
    const toc = buildToc(headings)
    html = html.replace(/\u0000TOCMARKER\u0000/g, toc)
  }

  // 콜아웃/YouTube/코드블록/인라인코드 복원
  html = html.replace(/\u0000CALLOUT(\d+)\u0000/g, (_, idx) => callouts[+idx] || '')
  html = html.replace(/\u0000YT(\d+)\u0000/g, (_, idx) => embeds[+idx] || '')
  html = html.replace(/\u0000IC(\d+)\u0000/g, (_, idx) => inlineCodes[+idx] || '')
  html = html.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeBlocks[+idx] || '')

  // <p> 안에 embed/콜아웃이 잘못 들어가면 풀어주기 (<p><figure>... 방지)
  html = html.replace(/<p class="md-p">\s*(<figure class="md-yt">[\s\S]*?<\/figure>)\s*<\/p>/g, '$1')
  html = html.replace(/<p class="md-p">\s*(<div class="md-callout[\s\S]*?<\/div>)\s*<\/p>/g, '$1')

  return html
}

/** YouTube URL에서 videoId 추출 (다양한 포맷 지원) */
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const s = String(url).trim()
  // 포맷들:
  //  - https://www.youtube.com/watch?v=ID
  //  - https://youtu.be/ID
  //  - https://www.youtube.com/embed/ID
  //  - https://www.youtube.com/shorts/ID
  //  - https://www.youtube.com/v/ID
  //  - 그냥 ID만 (11자)
  const patterns = [
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([\w-]{6,})/i,
    /youtu\.be\/([\w-]{6,})/i,
    /^([\w-]{11})$/,
  ]
  for (const re of patterns) {
    const m = s.match(re)
    if (m && m[1]) {
      // 쿼리스트링 잔존 제거
      return m[1].split(/[?&#]/)[0]
    }
  }
  return null
}

/** 목차 HTML 생성 — 카드형 디자인, 접기/펼치기, 스크롤 스파이용 data 속성 포함 */
function buildToc(headings: Array<{ level: number; text: string; slug: string }>): string {
  if (!headings.length) return ''
  // H2, H3만 목차에 포함
  const items = headings.filter(h => h.level >= 2 && h.level <= 3)
  if (!items.length) return ''

  const h2Count = items.filter(h => h.level === 2).length

  let html =
    '<nav class="md-toc" aria-label="목차" data-toc>' +
    '<button type="button" class="md-toc-header" data-toc-toggle aria-expanded="true">' +
    '<span class="md-toc-icon" aria-hidden="true">📑</span>' +
    '<span class="md-toc-title">목차</span>' +
    `<span class="md-toc-count">${h2Count}개 항목</span>` +
    '<span class="md-toc-chevron" aria-hidden="true">▾</span>' +
    '</button>' +
    '<ol class="md-toc-list" data-toc-list>'

  let inSub = false
  let idx = 0
  for (const h of items) {
    if (h.level === 2) {
      if (inSub) {
        html += '</ol></li>'
        inSub = false
      }
      idx++
      html +=
        `<li class="md-toc-item md-toc-h2">` +
        `<a href="#${h.slug}" data-toc-link="${h.slug}">` +
        `<span class="md-toc-num">${idx}.</span>` +
        `<span class="md-toc-text">${escapeHtml(h.text)}</span>` +
        `</a>`
    } else {
      if (!inSub) {
        html += '<ol class="md-toc-sublist">'
        inSub = true
      }
      html +=
        `<li class="md-toc-item md-toc-h3">` +
        `<a href="#${h.slug}" data-toc-link="${h.slug}">` +
        `<span class="md-toc-text">${escapeHtml(h.text)}</span>` +
        `</a></li>`
    }
  }
  if (inSub) html += '</ol></li>'
  html += '</ol></nav>'
  return html
}

/** 마크다운 인라인 문법 제거 (목차/슬러그용 plain text) */
function stripMdInline(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/==([^=]+)==/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
}

/** 한글 + 영문 허용하는 슬러그 */
function slugifyKoEn(s: string): string {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[\s\u00A0]+/g, '-')
    .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ\-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'section'
}

/** 인라인 포맷 (굵게, 기울임, 하이라이트, 취소선, 링크, 이미지) */
function inlineFormat(s: string): string {
  // 이미지 ![alt](url) — 캡션 지원 (alt가 있으면 figure로 감쌈)
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    if (alt && alt.trim()) {
      return `<figure class="md-figure"><img src="${escapeAttr(url)}" alt="${escapeAttr(alt)}" class="md-img" loading="lazy"/><figcaption class="md-figcaption">${escapeHtml(alt)}</figcaption></figure>`
    }
    return `<img src="${escapeAttr(url)}" alt="" role="presentation" class="md-img" loading="lazy"/>`
  })
  // 링크 [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
    `<a href="${escapeAttr(url)}" class="md-link" ${url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${escapeHtml(text)}</a>`
  )
  // **굵게**
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
  // ==하이라이트==
  s = s.replace(/==([^=\n]+)==/g, '<mark class="md-mark">$1</mark>')
  // ~~취소선~~
  s = s.replace(/~~([^~\n]+)~~/g, '<del class="md-del">$1</del>')
  // *기울임*
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
  return s
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;')
}

/** 표 한 줄 파싱: "| a | b | c |" → ["a", "b", "c"] */
function parseTableRow(line: string): string[] {
  // 양끝 | 제거 후 | 로 split. escape된 \| 는 유지
  const inner = line.replace(/^\|/, '').replace(/\|$/, '')
  const cells: string[] = []
  let buf = ''
  let esc = false
  for (let j = 0; j < inner.length; j++) {
    const ch = inner[j]
    if (esc) {
      buf += ch
      esc = false
    } else if (ch === '\\') {
      esc = true
    } else if (ch === '|') {
      cells.push(buf.trim())
      buf = ''
    } else {
      buf += ch
    }
  }
  cells.push(buf.trim())
  return cells
}

/** 표 정렬 행 파싱: |:---|:---:|---:| → ['left', 'center', 'right'] */
function parseTableAligns(line: string): (string | null)[] {
  return parseTableRow(line).map(c => {
    const trimmed = c.trim()
    const starts = trimmed.startsWith(':')
    const ends = trimmed.endsWith(':')
    if (starts && ends) return 'center'
    if (ends) return 'right'
    if (starts) return 'left'
    return null
  })
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
