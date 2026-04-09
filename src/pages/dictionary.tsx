// =============================================
// 치과 용어 백과사전 — 목록 페이지
// 초성 검색, 카테고리 필터, 키워드 검색
// =============================================

/** 백과사전 메인 페이지 */
export function dictionaryPage() {
  return (
    <div class="sub-page dict-page">
      {/* ─── 헤더 ─── */}
      <header class="sub-hero dict-hero">
        <div class="sub-hero-inner">
          <nav class="breadcrumb" aria-label="브레드크럼">
            <a href="/">홈</a><span class="bc-sep">/</span><span>치과 용어 백과사전</span>
          </nav>
          <h1 class="page-title">치과 용어 백과사전</h1>
          <p class="page-subtitle">이음치과가 알려드리는 <strong>219개</strong> 치과 용어.<br/>모르는 용어를 검색하고, 진료와 연결하세요.</p>
          
          {/* 검색 바 */}
          <div class="dict-search-wrap">
            <div class="dict-search-bar">
              <svg class="dict-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" id="dictSearch" placeholder="용어명, 영문명 또는 설명으로 검색..." autocomplete="off" />
              <button id="dictSearchClear" class="dict-search-clear" style="display:none">&times;</button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── 초성 바 ─── */}
      <section class="dict-chosung-section">
        <div class="dict-container">
          <div class="dict-chosung-bar" id="chosungBar" role="tablist" aria-label="초성 필터">
            <button class="chosung-btn active" data-chosung="all" role="tab" aria-selected="true">전체</button>
            {['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].map(ch => (
              <button class="chosung-btn" data-chosung={ch} role="tab" aria-selected="false">{ch}</button>
            ))}
            <button class="chosung-btn" data-chosung="ABC" role="tab" aria-selected="false">ABC</button>
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
                  <span class="dict-cat-count" id="catCountAll">219</span>
                </button>
                {/* 카테고리 버튼은 JS로 동적 생성 */}
              </div>
            </aside>

            {/* 메인 콘텐츠 */}
            <main class="dict-content">
              <div class="dict-toolbar">
                <div class="dict-result-count" id="resultCount">전체 <strong>219</strong>개 용어</div>
                <div class="dict-view-toggle">
                  <button class="view-btn active" data-view="grid" title="카드형">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                  </button>
                  <button class="view-btn" data-view="list" title="리스트형">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1"/><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="3" y="18" width="18" height="2" rx="1"/></svg>
                  </button>
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
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#adb5bd" stroke-width="1.5">
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
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                전화 상담
              </a>
              <a href="https://pf.kakao.com/_xgxkExj/chat" target="_blank" class="dict-cta-btn kakao">
                카카오톡 상담
              </a>
            </div>
          </div>
        </div>
      </section>

      <script>{`(${DICT_SCRIPT})()`}</script>
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
              {/* 관련 용어, CTA 등 JS로 동적 생성 */}
            </aside>
          </div>
        </div>
      </section>

      <script>{`(${DICT_DETAIL_SCRIPT})("${slug}")`}</script>
    </div>
  )
}

// =============================================
// 클라이언트 JS: 목록 페이지
// =============================================
const DICT_SCRIPT = function () {
  const CATEGORY_ICONS: Record<string, string> = {
    'implant': '🦷', 'prosthetic': '👑', 'restorative': '🔧',
    'periodontal': '🩸', 'tmj-ortho': '🦴', 'pediatric': '👶',
    'oral-surgery': '🔪', 'digital': '💻', 'materials': '🧪',
    'general-anatomy': '📚'
  }

  let currentCategory = 'all'
  let currentChosung = ''
  let currentSearch = ''
  let currentPage = 1
  let currentView = 'grid'
  let categories: any[] = []
  let debounceTimer: any = null

  async function init() {
    // 카테고리 로드
    try {
      const res = await fetch('/api/dictionary/categories')
      const data = await res.json()
      categories = data.categories
      renderCategories()
    } catch (e) { console.error('Categories load error:', e) }

    // 초기 데이터 로드
    loadTerms()

    // 이벤트 바인딩
    bindEvents()

    // URL 파라미터 처리
    const params = new URLSearchParams(location.search)
    const svc = params.get('service')
    if (svc) {
      currentCategory = 'all'
      currentSearch = ''
      loadTermsByService(svc)
      return
    }
  }

  function renderCategories() {
    const list = document.getElementById('categoryList')!
    let html = `<button class="dict-cat-btn active" data-cat="all">
      <span class="dict-cat-icon">📖</span>
      <span class="dict-cat-name">전체</span>
      <span class="dict-cat-count" id="catCountAll">-</span>
    </button>`

    for (const cat of categories) {
      html += `<button class="dict-cat-btn" data-cat="${cat.slug}">
        <span class="dict-cat-icon">${CATEGORY_ICONS[cat.slug] || '📄'}</span>
        <span class="dict-cat-name">${cat.name}</span>
        <span class="dict-cat-count" id="catCount-${cat.slug}">-</span>
      </button>`
    }
    list.innerHTML = html

    // 카테고리 클릭
    list.querySelectorAll('.dict-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        list.querySelectorAll('.dict-cat-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        currentCategory = (btn as HTMLElement).dataset.cat || 'all'
        currentPage = 1
        loadTerms()
      })
    })
  }

  function bindEvents() {
    // 검색
    const input = document.getElementById('dictSearch') as HTMLInputElement
    const clearBtn = document.getElementById('dictSearchClear')!
    input.addEventListener('input', () => {
      clearBtn.style.display = input.value ? 'block' : 'none'
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        currentSearch = input.value.trim()
        currentPage = 1
        loadTerms()
      }, 300)
    })
    clearBtn.addEventListener('click', () => {
      input.value = ''
      clearBtn.style.display = 'none'
      currentSearch = ''
      currentPage = 1
      loadTerms()
    })

    // 초성
    document.getElementById('chosungBar')!.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest('.chosung-btn') as HTMLElement
      if (!btn) return
      document.querySelectorAll('.chosung-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false') })
      btn.classList.add('active')
      btn.setAttribute('aria-selected', 'true')
      const ch = btn.dataset.chosung || ''
      currentChosung = ch === 'all' ? '' : ch
      currentPage = 1
      loadTerms()
    })

    // 뷰 토글
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        currentView = (btn as HTMLElement).dataset.view || 'grid'
        const grid = document.getElementById('dictGrid')!
        grid.className = currentView === 'list' ? 'dict-list' : 'dict-grid'
      })
    })
  }

  async function loadTerms() {
    const grid = document.getElementById('dictGrid')!
    const empty = document.getElementById('dictEmpty')!
    const loading = document.getElementById('dictLoading')!
    const pagination = document.getElementById('dictPagination')!

    loading.style.display = 'flex'
    empty.style.display = 'none'
    grid.innerHTML = ''
    grid.appendChild(loading)

    const params = new URLSearchParams()
    if (currentCategory !== 'all') params.set('category', currentCategory)
    if (currentChosung === 'ABC') {
      // ABC = 영어로 시작하는 용어
      params.set('search', '')
    } else if (currentChosung) {
      params.set('chosung', currentChosung)
    }
    if (currentSearch) params.set('search', currentSearch)
    params.set('page', String(currentPage))
    params.set('limit', '50')

    try {
      const res = await fetch(`/api/dictionary?${params}`)
      const data = await res.json()
      loading.style.display = 'none'

      // 결과 카운트
      document.getElementById('resultCount')!.innerHTML =
        `검색 결과 <strong>${data.total}</strong>개 용어`

      if (!data.terms || data.terms.length === 0) {
        empty.style.display = 'flex'
        pagination.innerHTML = ''
        return
      }

      grid.innerHTML = data.terms.map((t: any) => renderTermCard(t)).join('')
      grid.className = currentView === 'list' ? 'dict-list' : 'dict-grid'

      // 페이지네이션
      if (data.totalPages > 1) {
        renderPagination(pagination, data.page, data.totalPages)
      } else {
        pagination.innerHTML = ''
      }

    } catch (e) {
      loading.style.display = 'none'
      console.error('Terms load error:', e)
    }
  }

  async function loadTermsByService(service: string) {
    const grid = document.getElementById('dictGrid')!
    const loading = document.getElementById('dictLoading')!
    loading.style.display = 'flex'
    grid.innerHTML = ''
    grid.appendChild(loading)

    try {
      const res = await fetch(`/api/dictionary/service/${service}`)
      const data = await res.json()
      loading.style.display = 'none'

      document.getElementById('resultCount')!.innerHTML =
        `<strong>${serviceNameMap(service)}</strong> 관련 <strong>${data.terms.length}</strong>개 용어`

      grid.innerHTML = data.terms.map((t: any) => renderTermCard(t)).join('')
      grid.className = currentView === 'list' ? 'dict-list' : 'dict-grid'
    } catch (e) {
      loading.style.display = 'none'
    }
  }

  function serviceNameMap(s: string) {
    const m: Record<string, string> = { 'implant': '임플란트', 'aesthetic': '심미보철', 'resin': '심미레진', 'tmj': '턱관절', 'general': '일반진료', 'tmj-ortho': '턱관절·교정' }
    return m[s] || s
  }

  function renderTermCard(t: any) {
    const catColor = getCategoryColor(t.category_slug)
    return `<a href="/dictionary/${t.slug}" class="dict-card" data-service="${t.related_service}">
      <div class="dict-card-header">
        <span class="dict-card-cat" style="background:${catColor}15;color:${catColor}">${t.category_name}</span>
        <span class="dict-card-views">${t.views || 0}회</span>
      </div>
      <h3 class="dict-card-term">${highlightSearch(t.term)}</h3>
      ${t.english ? `<p class="dict-card-en">${highlightSearch(t.english)}</p>` : ''}
      <p class="dict-card-desc">${highlightSearch(t.short_desc)}</p>
      <span class="dict-card-arrow">→</span>
    </a>`
  }

  function highlightSearch(text: string) {
    if (!currentSearch) return text
    const regex = new RegExp(`(${currentSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }

  function getCategoryColor(slug: string) {
    const colors: Record<string, string> = {
      'implant': '#0052CC', 'prosthetic': '#8B5CF6', 'restorative': '#059669',
      'periodontal': '#DC2626', 'tmj-ortho': '#EA580C', 'pediatric': '#2563EB',
      'oral-surgery': '#7C3AED', 'digital': '#0891B2', 'materials': '#4F46E5',
      'general-anatomy': '#6B7280'
    }
    return colors[slug] || '#6B7280'
  }

  function renderPagination(el: HTMLElement, current: number, total: number) {
    let html = ''
    if (current > 1) html += `<button class="page-btn" data-page="${current - 1}">&laquo;</button>`
    for (let i = 1; i <= total; i++) {
      if (i === current) {
        html += `<button class="page-btn active">${i}</button>`
      } else if (Math.abs(i - current) <= 2 || i === 1 || i === total) {
        html += `<button class="page-btn" data-page="${i}">${i}</button>`
      } else if (Math.abs(i - current) === 3) {
        html += `<span class="page-dots">…</span>`
      }
    }
    if (current < total) html += `<button class="page-btn" data-page="${current + 1}">&raquo;</button>`
    el.innerHTML = html

    el.querySelectorAll('.page-btn[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt((btn as HTMLElement).dataset.page || '1')
        loadTerms()
        window.scrollTo({ top: 300, behavior: 'smooth' })
      })
    })
  }

  init()
}

// =============================================
// 클라이언트 JS: 상세 페이지
// =============================================
const DICT_DETAIL_SCRIPT = function (slug: string) {
  const SERVICE_MAP: Record<string, { name: string; url: string }> = {
    'implant': { name: '임플란트', url: '/#section-services' },
    'aesthetic': { name: '심미보철', url: '/#section-services' },
    'resin': { name: '심미레진', url: '/#section-services' },
    'tmj': { name: '턱관절', url: '/#section-services' },
    'general': { name: '일반진료', url: '/#section-services' },
    'tmj-ortho': { name: '턱관절·교정', url: '/#section-services' },
    'pediatric': { name: '소아·예방', url: '/#section-services' }
  }

  async function init() {
    try {
      const res = await fetch(`/api/dictionary/${slug}`)
      if (!res.ok) { window.location.href = '/dictionary'; return }
      const data = await res.json()
      render(data.term, data.related)
    } catch (e) {
      console.error('Detail load error:', e)
    }
  }

  function render(term: any, related: any[]) {
    // 브레드크럼
    document.getElementById('bcTerm')!.textContent = term.term

    // 메인
    const main = document.getElementById('dictDetailMain')!
    const svc = SERVICE_MAP[term.related_service] || null

    main.innerHTML = `
      <article class="dict-detail-article" itemscope itemtype="https://schema.org/DefinedTerm">
        <div class="dict-detail-meta">
          <span class="dict-detail-cat">${term.category_name}</span>
          <span class="dict-detail-views">조회 ${term.views || 0}회</span>
        </div>
        
        <h1 class="dict-detail-term" itemprop="name">${term.term}</h1>
        
        <div class="dict-detail-sub">
          ${term.english ? `<span class="dict-detail-en" itemprop="alternateName">${term.english}</span>` : ''}
          ${term.pronunciation ? `<span class="dict-detail-pron">[${term.pronunciation}]</span>` : ''}
        </div>

        <div class="dict-detail-short" itemprop="description">
          ${term.short_desc}
        </div>

        <div class="dict-detail-full">
          <h2>상세 설명</h2>
          <div class="dict-detail-full-text">
            ${term.full_desc}
          </div>
        </div>

        ${svc ? `
        <div class="dict-detail-service">
          <h2>이음치과 관련 진료</h2>
          <a href="${svc.url}" class="dict-service-link">
            <span class="dict-service-name">${svc.name}</span>
            <span class="dict-service-arrow">진료 안내 보기 →</span>
          </a>
          <a href="/dictionary?service=${term.related_service}" class="dict-service-all">
            ${svc.name} 관련 용어 모두 보기 →
          </a>
        </div>` : ''}

        <div class="dict-detail-share">
          <button onclick="navigator.clipboard.writeText(location.href).then(()=>alert('링크가 복사되었습니다!'))" class="dict-share-btn">
            🔗 링크 복사
          </button>
        </div>
      </article>
    `

    // 사이드바
    const sidebar = document.getElementById('dictDetailSidebar')!
    let relatedHtml = ''
    if (related && related.length) {
      relatedHtml = `<div class="dict-related">
        <h3>관련 용어</h3>
        <ul class="dict-related-list">
          ${related.map((r: any) => `
            <li><a href="/dictionary/${r.slug}">
              <strong>${r.term}</strong>
              ${r.english ? `<small>${r.english}</small>` : ''}
              <span>${r.short_desc}</span>
            </a></li>
          `).join('')}
        </ul>
      </div>`
    }

    sidebar.innerHTML = `
      ${relatedHtml}
      <div class="dict-sidebar-cta">
        <h3>궁금한 점이 있으신가요?</h3>
        <p>이음치과 전문 상담팀이 쉽게 설명해드립니다.</p>
        <a href="tel:051-206-5888" class="dict-cta-mini">📞 051-206-5888</a>
      </div>
      <a href="/dictionary" class="dict-back-btn">← 백과사전으로 돌아가기</a>
    `
  }

  init()
}
