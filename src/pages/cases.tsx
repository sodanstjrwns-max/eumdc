import { subPageLayout } from './layout'

export function casesPage() {
  return subPageLayout('BEFORE & AFTER', (
    <div class="page-cases">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">BEFORE & AFTER</span>
          <h1 class="page-title">비포애프터</h1>
          <p class="page-subtitle">이음치과의 실제 치료 결과를 확인하세요. 눈으로 직접 증명합니다.</p>
        </div>
      </section>

      {/* Filter */}
      <section class="page-filter">
        <div class="container-wide">
          <div class="filter-bar" id="caseFilter">
            <button class="filter-btn active" data-cat="all">전체</button>
            <button class="filter-btn" data-cat="implant">임플란트</button>
            <button class="filter-btn" data-cat="aesthetic">심미보철</button>
            <button class="filter-btn" data-cat="resin">심미 레진</button>
            <button class="filter-btn" data-cat="tmj">턱관절</button>
            <button class="filter-btn" data-cat="general">일반진료</button>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section class="page-grid-section">
        <div class="container-wide">
          <div class="cases-grid" id="casesGrid">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
          <div class="load-more-wrap" id="casesLoadMore" style="display:none">
            <button class="btn-load-more" data-hover>더 보기</button>
          </div>
        </div>
      </section>
    </div>
  ))
}

export function caseDetailPage(id: string) {
  return subPageLayout('CASE DETAIL', (
    <div class="page-case-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          <a href="/cases" class="back-link" data-hover>← 목록으로</a>
        </div>
      </section>
      <section class="case-detail-section">
        <div class="container-wide">
          <div id="caseDetail" data-case-id={id}>
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>
    </div>
  ))
}
