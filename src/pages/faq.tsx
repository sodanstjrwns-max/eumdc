type FaqGroup = Record<string, { name: string; faqs: { id: number; question: string; answer: string; category_name: string; category_slug: string }[] }>

export function faqPage(serverGroups?: FaqGroup) {
  // 서버사이드 noscript용 FAQ HTML 생성 (크롤러/AI가 JS 없이 읽는 콘텐츠)
  const noscriptHtml = serverGroups ? Object.entries(serverGroups).map(([slug, group]) => {
    const faqItems = group.faqs.map((f, i) =>
      `<div class="faq-item-static" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">` +
      `<h3 itemprop="name">Q${i + 1}. ${escHtml(f.question)}</h3>` +
      `<div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">` +
      `<p itemprop="text">${escHtml(f.answer)}</p>` +
      `</div></div>`
    ).join('')
    return `<section><h2>${escHtml(group.name)} (${group.faqs.length}개)</h2>${faqItems}</section>`
  }).join('') : ''

  const totalCount = serverGroups
    ? Object.values(serverGroups).reduce((sum, g) => sum + g.faqs.length, 0)
    : 0

  return (
    <div class="sub-page faq-page" itemscope itemtype="https://schema.org/FAQPage">
      <div class="sub-page-content">
        <div class="container-wide">
          {/* Header */}
          <div class="page-hero-mini">
            <span class="section-label">FAQ</span>
            <h1 class="page-title" itemprop="name">자주 묻는 질문</h1>
            <p class="page-subtitle">
              이음치과의원에서 환자분들이 가장 많이 궁금해하시는 질문{totalCount > 0 ? ` ${totalCount}개` : ''}와 답변을 모았습니다.
            </p>
          </div>

          {/* Search */}
          <div class="faq-search-wrap" role="search" aria-label="FAQ 검색">
            <div class="faq-search-box">
              <svg class="faq-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="search" id="faqSearch" class="faq-search-input" placeholder="임플란트, 비용, 주차 등 키워드로 검색하세요" autocomplete="off" aria-label="FAQ 키워드 검색" />
              <button id="faqSearchClear" class="faq-search-clear" style="display:none" aria-label="검색어 지우기">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div id="faqSearchCount" class="faq-search-count" role="status" aria-live="polite"></div>
          </div>

          {/* Category Filter */}
          <div class="faq-category-bar" id="faqCategoryBar" role="tablist" aria-label="FAQ 카테고리 필터">
            <button class="faq-cat-btn active" data-cat="all" role="tab" aria-selected="true">
              <span class="faq-cat-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </span>
              <span>전체</span>
            </button>
          </div>

          {/* FAQ Content (JS로 동적 렌더링) */}
          <div id="faqContent" class="faq-content" role="tabpanel">
            <div class="loading-spinner" aria-label="불러오는 중">불러오는 중...</div>
          </div>

          {/* 서버사이드 렌더링 (크롤러/AI용 — JS 비활성 시 표시) */}
          {noscriptHtml && (
            <noscript>
              <div class="faq-ssr-content" dangerouslySetInnerHTML={{ __html: noscriptHtml }} />
            </noscript>
          )}

          {/* 숨겨진 시맨틱 FAQ (JS 활성이어도 크롤러가 읽는 콘텐츠) */}
          {serverGroups && (
            <div class="sr-only" aria-hidden="true" id="faqSsrData">
              {Object.entries(serverGroups).map(([slug, group]) => (
                <div key={slug}>
                  <h2>{group.name}</h2>
                  {group.faqs.map(f => (
                    <div key={f.id} itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                      <h3 itemprop="name">{f.question}</h3>
                      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                        <p itemprop="text">{f.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* CTA Banner */}
          <div class="faq-cta-banner">
            <div class="faq-cta-inner">
              <div class="faq-cta-text">
                <h3>원하시는 답을 찾지 못하셨나요?</h3>
                <p>전화 상담이나 카카오톡으로 편하게 문의해 주세요.</p>
              </div>
              <div class="faq-cta-actions">
                <a href="tel:051-206-5888" class="faq-cta-btn primary" aria-label="이음치과 전화 상담 051-206-5888">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  전화 상담
                </a>
                <a href="tel:010-2210-4464" class="faq-cta-btn secondary" aria-label="카카오톡 문의">카카오톡 문의</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: FAQ_SCRIPT }} />
    </div>
  )
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const FAQ_SCRIPT = `
(function() {
  var currentCat = 'all';
  var allData = null;
  var openItems = {};

  var categoryIcons = {
    implant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M8 6h8l-1 6h-6L8 6zM9 12l-0.5 6h7l-0.5-6"/></svg>',
    aesthetic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    resin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2h6l2 6-5 14-5-14 2-6z"/></svg>',
    tmj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="7"/><path d="M8.5 13.5s1.5 2 3.5 2 3.5-2 3.5-2"/><path d="M9 17l-2 5M15 17l2 5"/></svg>',
    general: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4M12 16h.01"/></svg>',
    cost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    visit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    pediatric: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/></svg>'
  };

  function init() {
    fetch('/api/faq?category=all')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        allData = data;
        buildCategoryButtons(data.groups);
        renderFAQs(data.groups);
      });

    document.getElementById('faqSearch').addEventListener('input', debounce(onSearch, 300));
    document.getElementById('faqSearchClear').addEventListener('click', clearSearch);
  }

  function buildCategoryButtons(groups) {
    var bar = document.getElementById('faqCategoryBar');
    groups.forEach(function(g) {
      var btn = document.createElement('button');
      btn.className = 'faq-cat-btn';
      btn.setAttribute('data-cat', g.category.slug);
      btn.innerHTML = '<span class="faq-cat-icon">' + (categoryIcons[g.category.slug] || '') + '</span><span>' + g.category.name + '</span><span class="faq-cat-count">' + g.faqs.length + '</span>';
      btn.addEventListener('click', function() {
        currentCat = g.category.slug;
        bar.querySelectorAll('.faq-cat-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterAndRender();
      });
      bar.appendChild(btn);
    });

    bar.querySelector('[data-cat="all"]').addEventListener('click', function() {
      currentCat = 'all';
      bar.querySelectorAll('.faq-cat-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      filterAndRender();
    });
  }

  function filterAndRender() {
    if (!allData) return;
    var search = document.getElementById('faqSearch').value.trim().toLowerCase();
    var filtered = allData.groups.map(function(g) {
      if (currentCat !== 'all' && g.category.slug !== currentCat) return null;
      var faqs = g.faqs;
      if (search) {
        faqs = faqs.filter(function(f) {
          return f.question.toLowerCase().indexOf(search) !== -1 || f.answer.toLowerCase().indexOf(search) !== -1;
        });
      }
      if (faqs.length === 0) return null;
      return { category: g.category, faqs: faqs };
    }).filter(Boolean);

    renderFAQs(filtered);
    var total = filtered.reduce(function(s, g) { return s + g.faqs.length; }, 0);
    var countEl = document.getElementById('faqSearchCount');
    if (search) {
      countEl.textContent = '"' + search + '" 검색 결과: ' + total + '건';
      countEl.style.display = 'block';
    } else {
      countEl.style.display = 'none';
    }
  }

  function renderFAQs(groups) {
    var container = document.getElementById('faqContent');
    if (!groups || groups.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>검색 결과가 없습니다.</p></div>';
      return;
    }

    var html = '';
    groups.forEach(function(g) {
      html += '<div class="faq-group" data-reveal>';
      html += '<div class="faq-group-header">';
      html += '<div class="faq-group-icon">' + (categoryIcons[g.category.slug] || '') + '</div>';
      html += '<div class="faq-group-title-wrap">';
      html += '<h2 class="faq-group-title">' + g.category.name + '</h2>';
      html += '<span class="faq-group-count">' + g.faqs.length + '개 질문</span>';
      html += '</div>';
      html += '</div>';
      html += '<div class="faq-list">';

      g.faqs.forEach(function(f, idx) {
        var isOpen = openItems['faq-' + f.id];
        html += '<div class="faq-item' + (isOpen ? ' open' : '') + '" data-id="' + f.id + '">';
        html += '<button class="faq-question" onclick="toggleFAQ(this)">';
        html += '<span class="faq-q-num">' + String(idx + 1).padStart(2, '0') + '</span>';
        html += '<span class="faq-q-text">Q. ' + highlightSearch(f.question) + '</span>';
        html += '<span class="faq-q-toggle"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></span>';
        html += '</button>';
        html += '<div class="faq-answer" style="' + (isOpen ? '' : 'max-height:0;opacity:0;') + '">';
        html += '<div class="faq-answer-inner">' + formatAnswer(highlightSearch(f.answer)) + '</div>';
        html += '</div>';
        html += '</div>';
      });

      html += '</div></div>';
    });

    container.innerHTML = html;
    observeReveal();
  }

  function formatAnswer(text) {
    return text.replace(/\\n/g, '<br>');
  }

  function highlightSearch(text) {
    var search = document.getElementById('faqSearch').value.trim();
    if (!search) return text;
    var regex = new RegExp('(' + search.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\\\$&') + ')', 'gi');
    return text.replace(regex, '<mark class="faq-highlight">$1</mark>');
  }

  window.toggleFAQ = function(btn) {
    var item = btn.closest('.faq-item');
    var id = item.getAttribute('data-id');
    var answer = item.querySelector('.faq-answer');
    var isOpen = item.classList.contains('open');

    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = '0';
      answer.style.opacity = '0';
      delete openItems['faq-' + id];
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      answer.style.opacity = '1';
      openItems['faq-' + id] = true;
      // Track view
      fetch('/api/faq/' + id + '/view', { method: 'POST' });
    }
  };

  function onSearch() {
    var val = document.getElementById('faqSearch').value.trim();
    document.getElementById('faqSearchClear').style.display = val ? 'flex' : 'none';
    filterAndRender();
  }

  function clearSearch() {
    document.getElementById('faqSearch').value = '';
    document.getElementById('faqSearchClear').style.display = 'none';
    document.getElementById('faqSearchCount').style.display = 'none';
    filterAndRender();
  }

  function debounce(fn, ms) {
    var t;
    return function() {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  function observeReveal() {
    document.querySelectorAll('.faq-group[data-reveal]:not(.visible)').forEach(function(el) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`
