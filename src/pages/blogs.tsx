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
              <p>등록된 블로그 글이 없습니다.</p>
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

export function blogDetailPage(
  id: string,
  blog?: any,
  dictTerms?: Array<{ name: string; slug: string; aliases?: string | null }>
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

  return subPageLayout('BLOG', (
    <div class="page-blog-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          <a href="/blogs" class="back-link" data-hover>← 목록으로</a>
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
                <img src={blog.thumbnail} alt={blog.title} loading="eager" />
              </figure>
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
                <span class="share-label">공유</span>
                <a
                  href={`https://twitter.com/intent/tweet?url=https://eumdc.kr/blogs/${blog.slug || blog.id}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank" rel="noopener" class="share-btn"
                >X</a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://eumdc.kr/blogs/${blog.slug || blog.id}`}
                  target="_blank" rel="noopener" class="share-btn"
                >Facebook</a>
              </div>
              <a href="/blogs" class="back-to-list">← 블로그 목록으로</a>
            </footer>
          </article>
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
