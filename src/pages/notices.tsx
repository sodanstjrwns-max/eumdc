import { subPageLayout } from './layout'

export function noticesPage() {
  return subPageLayout('NOTICE', (
    <div class="page-notices">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">NOTICE</span>
          <h1 class="page-title">공지사항</h1>
          <p class="page-subtitle">이음치과의 소식과 안내사항을 확인하세요.</p>
        </div>
      </section>

      {/* Notices List */}
      <section class="page-grid-section">
        <div class="container-wide">
          <div class="notices-list" id="noticesList">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
          <div class="load-more-wrap" id="noticesLoadMore" style="display:none">
            <button class="btn-load-more" data-hover>더 보기</button>
          </div>
        </div>
      </section>
    </div>
  ))
}

export function noticeDetailPage(id: string) {
  return subPageLayout('NOTICE', (
    <div class="page-notice-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          <a href="/notices" class="back-link" data-hover>← 목록으로</a>
        </div>
      </section>
      <section class="notice-detail-section">
        <div class="container-wide">
          <div id="noticeDetail" data-notice-id={id}>
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>
    </div>
  ))
}
