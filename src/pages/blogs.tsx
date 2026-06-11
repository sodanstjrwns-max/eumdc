import { subPageLayout } from './layout'
import { markdownToHtml, linkDictionaryTerms, escapeHtml } from '../utils/content'

export function blogsPage(blogs?: any[]) {
  const items = blogs || []
  return subPageLayout('BLOG', (
    <div class="page-blogs">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">BLOG</span>
          <h1 class="page-title">블로그</h1>
          <p class="page-subtitle">이음치과의 진료 이야기, 치과 상식, 그리고 일상을 전합니다.</p>
        </div>
      </section>

      <section class="page-grid-section">
        <div class="container-wide">
          {items.length === 0 ? (
            <div class="empty-state">
              <p>첫 블로그 글을 준비하고 있습니다.<br/>치과 상식·진료 이야기를 곧 연재합니다.</p>
              <div class="empty-state-cta-row">
                <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" class="empty-state-cta primary">카카오톡 문의 →</a>
                <a href="https://m.place.naver.com/hospital/2005922467/booking" target="_blank" rel="noopener" class="empty-state-cta naver">네이버 예약 →</a>
                <a href="tel:051-206-5888" class="empty-state-cta secondary">전화 상담 ☎</a>
              </div>
            </div>
          ) : (
            <div class="blogs-grid" id="blogsGrid">
              {items.map((b: any) => (
                <article class="blog-card" data-reveal>
                  <a href={`/blogs/${b.slug || b.id}`} class="blog-card-link" data-hover>
                    <div class="blog-card-thumb">
                      {b.thumbnail ? (
                        <img src={b.thumbnail} alt={b.title} loading="lazy" />
                      ) : (
                        <div class="blog-card-thumb-placeholder">
                          <span>이음치과</span>
                        </div>
                      )}
                    </div>
                    <div class="blog-card-body">
                      <h2 class="blog-card-title">{b.title}</h2>
                      {b.meta_description && (
                        <p class="blog-card-desc">{b.meta_description}</p>
                      )}
                      <div class="blog-card-meta">
                        <span class="blog-card-author">{b.author_name || '최효영'}</span>
                        <span class="blog-card-dot">·</span>
                        <span class="blog-card-date">{formatDate(b.created_at)}</span>
                        {typeof b.views === 'number' && (
                          <>
                            <span class="blog-card-dot">·</span>
                            <span class="blog-card-views">조회 {b.views}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  ))
}

/** 본문에서 TL;DR 핵심 요약 문장 추출 (AEO — AI 답변 인용 최적화) */
function extractKeySentences(content?: string, max = 3): string[] {
  if (!content) return []
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+>]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^안녕하세요[^.!?]*[.!?]\s*/, '')
  const sentences = text.split(/(?<=[.!?다요])\s+/).filter(s => s.length >= 20 && s.length <= 150)
  return sentences.slice(0, max)
}

export function blogDetailPage(
  id: string,
  blog?: any,
  dictTerms?: Array<{ name: string; slug: string; aliases?: string | null }>,
  relatedBlogs?: any[]
) {
  if (!blog) {
    return subPageLayout('BLOG', (
      <div class="page-blog-detail">
        <section class="page-hero-mini">
          <div class="container-wide">
            <a href="/blogs" class="back-link" data-hover>← 목록으로</a>
          </div>
        </section>
        <section class="blog-detail-section">
          <div class="container-wide">
            <div class="empty-state">
              <h1>글을 찾을 수 없습니다</h1>
              <p>삭제되었거나 비공개 처리된 글일 수 있습니다.</p>
              <a href="/blogs" class="btn-primary">목록으로 돌아가기</a>
            </div>
          </div>
        </section>
      </div>
    ))
  }

  // 마크다운 → HTML 변환 (content_html 있으면 우선)
  let contentHtml = blog.content_html || markdownToHtml(blog.content || '')
  // 치과용어 자동링크
  if (dictTerms && dictTerms.length > 0) {
    contentHtml = linkDictionaryTerms(contentHtml, dictTerms)
  }
  // TL;DR 핵심 요약 (AEO — AI 검색엔진이 우선 인용하는 발췌 가능 블록)
  const keySentences = extractKeySentences(blog.content)

  return subPageLayout('BLOG', (
    <div class="page-blog-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          {/* 가시 브레드크럼 — BreadcrumbList JSON-LD와 일치 (리치결과 + 크롤 경로) */}
          <nav class="breadcrumb blog-breadcrumb" aria-label="브레드크럼">
            <a href="/">홈</a><span class="bc-sep">/</span><a href="/blogs">블로그</a><span class="bc-sep">/</span><span>{blog.title}</span>
          </nav>
        </div>
      </section>
      <section class="blog-detail-section">
        <div class="container-wide">
          <article class="blog-article">
            <header class="blog-article-header">
              <h1 class="blog-article-title">{blog.title}</h1>
              <div class="blog-article-meta">
                <span class="meta-author">
                  <i class="meta-icon">✍️</i>
                  {blog.author_name || '최효영 원장'}
                </span>
                <span class="meta-dot">·</span>
                <span class="meta-date">{formatDate(blog.created_at)}</span>
                {typeof blog.views === 'number' && (
                  <>
                    <span class="meta-dot">·</span>
                    <span class="meta-views">조회 {blog.views.toLocaleString()}</span>
                  </>
                )}
              </div>
            </header>

            {blog.thumbnail && (
              <figure class="blog-article-hero">
                <img src={blog.thumbnail} alt={blog.title} loading="eager" fetchpriority="high" decoding="async" />
              </figure>
            )}

            {/* TL;DR 핵심 요약 — AEO: AI 검색·피처드 스니펫이 우선 인용하는 블록 */}
            {keySentences.length >= 2 && (
              <aside class="blog-tldr" id="blog-key-summary" aria-label="핵심 요약">
                <h2 class="blog-tldr-title">핵심 요약</h2>
                <ul class="blog-tldr-list">
                  {keySentences.map(s => <li>{s}</li>)}
                </ul>
              </aside>
            )}

            <div class="blog-article-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />

            {blog.images && Array.isArray(blog.images) && blog.images.length > 0 && (
              <div class="blog-article-gallery">
                {blog.images.map((img: any, i: number) => (
                  <figure>
                    <img src={img.image_url || img} alt={`${blog.title} - 이미지 ${i + 1}`} loading="lazy" />
                  </figure>
                ))}
              </div>
            )}

            <footer class="blog-article-footer">
              <div class="share-box">
                <span class="share-label">SHARE</span>
                <a
                  href={`https://twitter.com/intent/tweet?url=https://ieumdc.kr/blogs/${blog.slug || blog.id}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank" rel="noopener" class="share-btn" aria-label="X(트위터)로 공유"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://ieumdc.kr/blogs/${blog.slug || blog.id}`}
                  target="_blank" rel="noopener" class="share-btn" aria-label="페이스북으로 공유"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a
                  href={`https://share.kakao.com/link?url=https://ieumdc.kr/blogs/${blog.slug || blog.id}`}
                  target="_blank" rel="noopener" class="share-btn" aria-label="카카오톡으로 공유"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.21 4.65 6.6-.15.56-.96 3.56-.99 3.78 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.83.55.08 1.13.12 1.73.12 5.52 0 10-3.58 10-7.92C22 6.58 17.52 3 12 3z"/></svg>
                </a>
              </div>
              <a href="/blogs" class="back-to-list">← 블로그 목록으로</a>
            </footer>
          </article>

          {/* 관련 글 — 내부링크 강화 (크롤 경로 + 체류시간) */}
          {relatedBlogs && relatedBlogs.length > 0 && (
            <section class="blog-related" aria-label="관련 글">
              <h2 class="blog-related-title">함께 보면 좋은 글</h2>
              <div class="blog-related-grid">
                {relatedBlogs.map((rb: any) => (
                  <a href={`/blogs/${rb.slug || rb.id}`} class="blog-related-card">
                    <div class="blog-related-thumb">
                      {rb.thumbnail
                        ? <img src={rb.thumbnail} alt={rb.title} loading="lazy" />
                        : <div class="blog-related-thumb-ph"><span>이음치과</span></div>}
                    </div>
                    <h3 class="blog-related-card-title">{rb.title}</h3>
                    <span class="blog-related-date">{formatDate(rb.created_at)}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  ))
}

function formatDate(s?: string): string {
  if (!s) return ''
  try {
    const d = new Date(s.replace(' ', 'T'))
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return s.split(' ')[0] || s
  }
}
