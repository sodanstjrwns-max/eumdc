import { subPageLayout } from './layout'

export function blogsPage() {
  return subPageLayout('BLOG', (
    <div class="page-blogs">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">BLOG</span>
          <h1 class="page-title">블로그</h1>
          <p class="page-subtitle">이음치과의 진료 이야기, 치과 상식, 그리고 일상을 전합니다.</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section class="page-grid-section">
        <div class="container-wide">
          <div class="blogs-grid" id="blogsGrid">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
          <div class="load-more-wrap" id="blogsLoadMore" style="display:none">
            <button class="btn-load-more" data-hover>더 보기</button>
          </div>
        </div>
      </section>
    </div>
  ))
}

export function blogDetailPage(id: string) {
  return subPageLayout('BLOG', (
    <div class="page-blog-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          <a href="/blogs" class="back-link" data-hover>← 목록으로</a>
        </div>
      </section>
      <section class="blog-detail-section">
        <div class="container-wide">
          <div id="blogDetail" data-blog-id={id}>
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>
    </div>
  ))
}
