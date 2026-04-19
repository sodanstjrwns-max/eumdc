import { subPageLayout } from './layout'
import { markdownToHtml } from '../utils/content'

export function noticesPage(notices?: any[]) {
  const items = notices || []
  return subPageLayout('NOTICE', (
    <div class="page-notices">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">NOTICE</span>
          <h1 class="page-title">공지사항</h1>
          <p class="page-subtitle">이음치과의 소식과 안내사항을 확인하세요.</p>
        </div>
      </section>

      <section class="page-grid-section">
        <div class="container-wide">
          {items.length === 0 ? (
            <div class="empty-state"><p>등록된 공지사항이 없습니다.</p></div>
          ) : (
            <div class="notices-list" id="noticesList">
              {items.map((n: any) => (
                <article class={`notice-item${n.is_pinned ? ' pinned' : ''}`} data-reveal>
                  <a href={`/notices/${n.id}`} class="notice-item-link" data-hover>
                    {n.thumbnail && (
                      <div class="notice-item-thumb">
                        <img src={n.thumbnail} alt={n.title} loading="lazy" />
                      </div>
                    )}
                    <div class="notice-item-body">
                      <div class="notice-item-header">
                        {n.is_pinned ? <span class="notice-pin">📌 고정</span> : null}
                        <h2 class="notice-item-title">{n.title}</h2>
                      </div>
                      {n.content && (
                        <p class="notice-item-desc">
                          {stripPlain(n.content).substring(0, 100)}{stripPlain(n.content).length > 100 ? '…' : ''}
                        </p>
                      )}
                      <div class="notice-item-meta">
                        <span class="notice-date">{formatDate(n.created_at)}</span>
                        {typeof n.views === 'number' && (
                          <>
                            <span class="meta-dot">·</span>
                            <span class="notice-views">조회 {n.views}</span>
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

export function noticeDetailPage(id: string, notice?: any, images?: any[]) {
  if (!notice) {
    return subPageLayout('NOTICE', (
      <div class="page-notice-detail">
        <section class="page-hero-mini">
          <div class="container-wide">
            <a href="/notices" class="back-link" data-hover>← 목록으로</a>
          </div>
        </section>
        <section class="notice-detail-section">
          <div class="container-wide">
            <div class="empty-state">
              <h1>공지사항을 찾을 수 없습니다</h1>
              <a href="/notices" class="btn-primary">목록으로 돌아가기</a>
            </div>
          </div>
        </section>
      </div>
    ))
  }

  // content(마크다운 원본)가 있으면 우선 사용 — content_html이 구 버전 변환기로 저장된 경우가 있어 항상 재변환
  const contentHtml = notice.content
    ? markdownToHtml(notice.content)
    : (notice.content_html || '')

  return subPageLayout('NOTICE', (
    <div class="page-notice-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          <a href="/notices" class="back-link" data-hover>← 목록으로</a>
        </div>
      </section>
      <section class="notice-detail-section">
        <div class="container-wide">
          <article class="notice-article">
            <header class="notice-article-header">
              {notice.is_pinned ? <span class="notice-pin-badge">📌 고정 공지</span> : null}
              <h1 class="notice-article-title">{notice.title}</h1>
              <div class="notice-article-meta">
                <span class="meta-date">{formatDate(notice.created_at)}</span>
                {typeof notice.views === 'number' && (
                  <>
                    <span class="meta-dot">·</span>
                    <span class="meta-views">조회 {notice.views.toLocaleString()}</span>
                  </>
                )}
              </div>
            </header>

            {notice.thumbnail && (
              <figure class="notice-article-hero">
                <img src={notice.thumbnail} alt={notice.title} loading="eager" />
              </figure>
            )}

            <div class="notice-article-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />

            {images && images.length > 0 && (
              <div class="notice-article-gallery">
                {images.map((img: any, i: number) => (
                  <figure>
                    <img src={img.image_url} alt={`${notice.title} 이미지 ${i + 1}`} loading="lazy" />
                  </figure>
                ))}
              </div>
            )}

            <footer class="notice-article-footer">
              <a href="/notices" class="back-to-list">← 공지사항 목록으로</a>
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

function stripPlain(s: string): string {
  return String(s || '').replace(/[#*_`>]/g, '').replace(/\s+/g, ' ').trim()
}
