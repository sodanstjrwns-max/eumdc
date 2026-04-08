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

      {/* Login Gate Banner - shown to non-logged-in users */}
      <div class="login-gate-banner" id="loginGateBanner" style="display:none">
        <div class="container-wide">
          <div class="gate-content">
            <div class="gate-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div class="gate-text">
              <h3>회원 전용 콘텐츠입니다</h3>
              <p>비포애프터 사진은 환자 보호를 위해 로그인 후 열람하실 수 있습니다.</p>
            </div>
            <div class="gate-actions">
              <a href="/login" class="gate-btn-login">로그인</a>
              <a href="/signup" class="gate-btn-signup">회원가입</a>
            </div>
          </div>
        </div>
      </div>

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
