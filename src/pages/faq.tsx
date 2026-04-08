export function faqPage() {
  return (
    <div class="sub-page faq-page">
      <div class="sub-page-content">
        <div class="container-wide">
          {/* Header */}
          <div class="page-hero-mini">
            <span class="section-label">FAQ</span>
            <h1 class="page-title">자주 묻는 질문</h1>
            <p class="page-subtitle">궁금한 점이 있으신가요? 아래에서 답을 찾아보세요.</p>
          </div>

          {/* Search */}
          <div class="faq-search-wrap">
            <div class="faq-search-box">
              <svg class="faq-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" id="faqSearch" class="faq-search-input" placeholder="임플란트, 비용, 주차 등 키워드로 검색하세요" autocomplete="off" />
              <button id="faqSearchClear" class="faq-search-clear" style="display:none">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div id="faqSearchCount" class="faq-search-count"></div>
          </div>

          {/* Category Filter */}
          <div class="faq-category-bar" id="faqCategoryBar">
            <button class="faq-cat-btn active" data-cat="all">
              <span class="faq-cat-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </span>
              <span>전체</span>
            </button>
          </div>

          {/* FAQ Content */}
          <div id="faqContent" class="faq-content">
            <div class="loading-spinner">불러오는 중...</div>
          </div>

          {/* CTA Banner */}
          <div class="faq-cta-banner">
            <div class="faq-cta-inner">
              <div class="faq-cta-text">
                <h3>원하시는 답을 찾지 못하셨나요?</h3>
                <p>전화 상담이나 카카오톡으로 편하게 문의해 주세요.</p>
              </div>
              <div class="faq-cta-actions">
                <a href="tel:051-206-5888" class="faq-cta-btn primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  전화 상담
                </a>
                <a href="tel:010-2210-4464" class="faq-cta-btn secondary">카카오톡 문의</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: FAQ_SCRIPT }} />
    </div>
  )
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
