// =============================================
// 치과 용어 백과사전 — 목록 + 상세 페이지  (Premium v2)
// 초성 검색, 카테고리 필터, 정렬, 자동완성, 통계
// =============================================

/** 백과사전 메인 페이지 */
export function dictionaryPage() {
  return (
    <div class="sub-page dict-page">
      {/* ─── 히어로 ─── */}
      <header class="sub-hero dict-hero">
        <div class="sub-hero-inner">
          <nav class="breadcrumb" aria-label="브레드크럼">
            <a href="/">홈</a><span class="bc-sep">/</span><span>치과 용어 백과사전</span>
          </nav>
          <h1 class="page-title">치과 용어 백과사전</h1>
          <p class="page-subtitle">이음치과가 알려드리는 치과 전문 용어.<br/>모르는 용어를 검색하고, 진료와 연결하세요.</p>
          
          {/* 통계 배지 */}
          <div class="dict-stats-row" id="dictStats">
            <div class="dict-stat-badge">
              <div class="dict-stat-icon">📖</div>
              <div>
                <div class="dict-stat-label">총 용어</div>
                <div class="dict-stat-value" id="statTotal">—</div>
              </div>
            </div>
            <div class="dict-stat-badge">
              <div class="dict-stat-icon">📂</div>
              <div>
                <div class="dict-stat-label">카테고리</div>
                <div class="dict-stat-value" id="statCategories">—</div>
              </div>
            </div>
            <div class="dict-stat-badge">
              <div class="dict-stat-icon">🔥</div>
              <div>
                <div class="dict-stat-label">인기 용어</div>
                <div class="dict-stat-value" id="statPopular">—</div>
              </div>
            </div>
          </div>

          {/* 검색 바 */}
          <div class="dict-search-wrap">
            <div class="dict-search-bar" id="dictSearchBar">
              <svg class="dict-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" id="dictSearch" placeholder="용어명, 영문명 또는 설명으로 검색..." autocomplete="off" />
              <button id="dictSearchClear" class="dict-search-clear" style="display:none">&times;</button>
              {/* 자동완성 드롭다운 */}
              <div class="dict-autocomplete" id="dictAutocomplete"></div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 초성 + 정렬 바 ─── */}
      <section class="dict-chosung-section" id="chosungSection">
        <div class="dict-container">
          <div class="dict-chosung-row">
            <div class="dict-chosung-bar" id="chosungBar" role="tablist" aria-label="초성 필터">
              <button class="chosung-btn active" data-chosung="all" role="tab" aria-selected="true">전체</button>
              {['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].map(ch => (
                <button class="chosung-btn" data-chosung={ch} role="tab" aria-selected="false">{ch}</button>
              ))}
              <button class="chosung-btn" data-chosung="ABC" role="tab" aria-selected="false">A-Z</button>
            </div>
            <div class="dict-sort-wrap">
              <select class="dict-sort-select" id="dictSort" aria-label="정렬 기준">
                <option value="term">가나다순</option>
                <option value="popular">인기순</option>
                <option value="latest">최신순</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 카테고리 + 목록 ─── */}
      <section class="dict-main-section">
        <div class="dict-container">
          <div class="dict-layout">
            {/* 사이드바 카테고리 */}
            <aside class="dict-sidebar" id="dictSidebar">
              <div class="dict-sidebar-title">카테고리</div>
              <div class="dict-category-list" id="categoryList">
                <button class="dict-cat-btn active" data-cat="all">
                  <span class="dict-cat-icon">📖</span>
                  <span class="dict-cat-name">전체</span>
                  <span class="dict-cat-count" id="catCountAll">—</span>
                </button>
              </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main class="dict-content">
              <div class="dict-toolbar">
                <div class="dict-result-count" id="resultCount">검색 결과 <strong>—</strong>개 용어</div>
                <div class="dict-toolbar-actions">
                  <div class="dict-view-toggle">
                    <button class="view-btn active" data-view="grid" title="카드형">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                    </button>
                    <button class="view-btn" data-view="list" title="리스트형">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 용어 카드 그리드 */}
              <div class="dict-grid" id="dictGrid">
                <div class="dict-loading" id="dictLoading">
                  <div class="dict-spinner"></div>
                  <p>용어를 불러오는 중...</p>
                </div>
              </div>

              {/* 빈 결과 */}
              <div class="dict-empty" id="dictEmpty" style="display:none">
                <svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" stroke-width="1">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <p>검색 결과가 없습니다</p>
                <span>다른 키워드로 검색해 보세요</span>
              </div>

              {/* 페이지네이션 */}
              <div class="dict-pagination" id="dictPagination"></div>
            </main>
          </div>
        </div>
      </section>

      {/* ─── CTA 배너 ─── */}
      <section class="dict-cta">
        <div class="dict-container">
          <div class="dict-cta-inner">
            <div class="dict-cta-text">
              <h3>용어가 어려우셨나요?</h3>
              <p>이음치과 전문 상담팀이 쉽고 친절하게 설명해드립니다.</p>
            </div>
            <div class="dict-cta-actions">
              <a href="tel:051-206-5888" class="dict-cta-btn phone">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                전화 상담
              </a>
              <a href="https://pf.kakao.com/_xgxkExj/chat" target="_blank" class="dict-cta-btn kakao">
                카카오톡 상담
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 토스트 알림 */}
      <div class="dict-toast" id="dictToast"></div>

      <script src="/static/dictionary.js"></script>
    </div>
  )
}

/** 백과사전 상세 페이지 */
export function dictionaryDetailPage(slug: string) {
  return (
    <div class="sub-page dict-detail-page">
      <header class="sub-hero dict-hero dict-hero-compact">
        <div class="sub-hero-inner">
          <nav class="breadcrumb" aria-label="브레드크럼">
            <a href="/">홈</a><span class="bc-sep">/</span><a href="/dictionary">치과 용어 백과사전</a><span class="bc-sep">/</span><span id="bcTerm">...</span>
          </nav>
        </div>
      </header>

      <section class="dict-detail-section">
        <div class="dict-container">
          <div class="dict-detail-layout">
            <main class="dict-detail-main" id="dictDetailMain">
              <div class="dict-loading" id="dictDetailLoading">
                <div class="dict-spinner"></div>
                <p>용어를 불러오는 중...</p>
              </div>
            </main>

            <aside class="dict-detail-sidebar" id="dictDetailSidebar">
            </aside>
          </div>
        </div>
      </section>

      {/* 토스트 알림 */}
      <div class="dict-toast" id="dictToast"></div>

      <script src="/static/dictionary.js"></script>
    </div>
  )
}
