/* ============================================
   이음치과 — 치과 용어 백과사전 Scripts
   ============================================ */
(function() {
  'use strict';

  // 현재 페이지 판별
  var path = location.pathname;
  if (path === '/dictionary') {
    initDictionaryList();
  } else if (path.startsWith('/dictionary/')) {
    var slug = path.replace('/dictionary/', '');
    initDictionaryDetail(slug);
  }

  // ═══════════════════════════════════════════
  // 목록 페이지
  // ═══════════════════════════════════════════
  function initDictionaryList() {
    var CATEGORY_ICONS = {
      'implant': '🦷', 'prosthetic': '👑', 'restorative': '🔧',
      'periodontal': '🩸', 'tmj-ortho': '🦴', 'pediatric': '👶',
      'oral-surgery': '🔪', 'digital': '💻', 'materials': '🧪',
      'general-anatomy': '📚'
    };

    var currentCategory = 'all';
    var currentChosung = '';
    var currentSearch = '';
    var currentPage = 1;
    var currentView = 'grid';
    var categories = [];
    var debounceTimer = null;

    // URL 파라미터 처리
    var params = new URLSearchParams(location.search);
    var initService = params.get('service');

    loadCategories().then(function() {
      if (initService) {
        loadTermsByService(initService);
      } else {
        loadTerms();
      }
    });
    bindEvents();

    function loadCategories() {
      return fetch('/api/dictionary/categories')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          categories = data.categories;
          renderCategories();
        })
        .catch(function(e) { console.error('Categories load error:', e); });
    }

    function renderCategories() {
      var list = document.getElementById('categoryList');
      if (!list) return;

      var html = '<button class="dict-cat-btn active" data-cat="all">' +
        '<span class="dict-cat-icon">📖</span>' +
        '<span class="dict-cat-name">전체</span>' +
        '<span class="dict-cat-count" id="catCountAll">-</span>' +
        '</button>';

      for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        html += '<button class="dict-cat-btn" data-cat="' + cat.slug + '">' +
          '<span class="dict-cat-icon">' + (CATEGORY_ICONS[cat.slug] || '📄') + '</span>' +
          '<span class="dict-cat-name">' + cat.name + '</span>' +
          '<span class="dict-cat-count" id="catCount-' + cat.slug + '">-</span>' +
          '</button>';
      }
      list.innerHTML = html;

      // 카테고리 클릭
      var buttons = list.querySelectorAll('.dict-cat-btn');
      for (var j = 0; j < buttons.length; j++) {
        buttons[j].addEventListener('click', function() {
          var allBtns = list.querySelectorAll('.dict-cat-btn');
          for (var k = 0; k < allBtns.length; k++) allBtns[k].classList.remove('active');
          this.classList.add('active');
          currentCategory = this.dataset.cat || 'all';
          currentPage = 1;
          loadTerms();
        });
      }
    }

    function bindEvents() {
      // 검색
      var input = document.getElementById('dictSearch');
      var clearBtn = document.getElementById('dictSearchClear');
      if (input) {
        input.addEventListener('input', function() {
          clearBtn.style.display = input.value ? 'block' : 'none';
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            currentSearch = input.value.trim();
            currentPage = 1;
            loadTerms();
          }, 300);
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          input.value = '';
          clearBtn.style.display = 'none';
          currentSearch = '';
          currentPage = 1;
          loadTerms();
        });
      }

      // 초성
      var chosungBar = document.getElementById('chosungBar');
      if (chosungBar) {
        chosungBar.addEventListener('click', function(e) {
          var btn = e.target.closest('.chosung-btn');
          if (!btn) return;
          var allBtns = document.querySelectorAll('.chosung-btn');
          for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].classList.remove('active');
            allBtns[i].setAttribute('aria-selected', 'false');
          }
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          var ch = btn.dataset.chosung || '';
          currentChosung = (ch === 'all') ? '' : ch;
          currentPage = 1;
          loadTerms();
        });
      }

      // 뷰 토글
      var viewBtns = document.querySelectorAll('.view-btn');
      for (var i = 0; i < viewBtns.length; i++) {
        viewBtns[i].addEventListener('click', function() {
          for (var j = 0; j < viewBtns.length; j++) viewBtns[j].classList.remove('active');
          this.classList.add('active');
          currentView = this.dataset.view || 'grid';
          var grid = document.getElementById('dictGrid');
          if (grid) grid.className = (currentView === 'list') ? 'dict-list' : 'dict-grid';
        });
      }
    }

    function loadTerms() {
      var grid = document.getElementById('dictGrid');
      var empty = document.getElementById('dictEmpty');
      var loading = document.getElementById('dictLoading');
      var pagination = document.getElementById('dictPagination');

      if (!grid) return;
      loading.style.display = 'flex';
      empty.style.display = 'none';
      grid.innerHTML = '';
      grid.appendChild(loading);

      var qp = new URLSearchParams();
      if (currentCategory !== 'all') qp.set('category', currentCategory);
      if (currentChosung && currentChosung !== 'ABC') qp.set('chosung', currentChosung);
      if (currentSearch) qp.set('search', currentSearch);
      qp.set('page', String(currentPage));
      qp.set('limit', '50');

      fetch('/api/dictionary?' + qp.toString())
        .then(function(res) { return res.json(); })
        .then(function(data) {
          loading.style.display = 'none';

          var rc = document.getElementById('resultCount');
          if (rc) rc.innerHTML = '검색 결과 <strong>' + data.total + '</strong>개 용어';

          if (!data.terms || data.terms.length === 0) {
            empty.style.display = 'flex';
            if (pagination) pagination.innerHTML = '';
            return;
          }

          var html = '';
          for (var i = 0; i < data.terms.length; i++) {
            html += renderTermCard(data.terms[i]);
          }
          grid.innerHTML = html;
          grid.className = (currentView === 'list') ? 'dict-list' : 'dict-grid';

          if (data.totalPages > 1 && pagination) {
            renderPagination(pagination, data.page, data.totalPages);
          } else if (pagination) {
            pagination.innerHTML = '';
          }
        })
        .catch(function(e) {
          loading.style.display = 'none';
          console.error('Terms load error:', e);
        });
    }

    function loadTermsByService(service) {
      var grid = document.getElementById('dictGrid');
      var loading = document.getElementById('dictLoading');
      if (!grid) return;
      loading.style.display = 'flex';
      grid.innerHTML = '';
      grid.appendChild(loading);

      var serviceNames = {
        'implant': '임플란트', 'aesthetic': '심미보철', 'resin': '심미레진',
        'tmj': '턱관절', 'general': '일반진료', 'tmj-ortho': '턱관절·교정'
      };

      fetch('/api/dictionary/service/' + service)
        .then(function(res) { return res.json(); })
        .then(function(data) {
          loading.style.display = 'none';
          var rc = document.getElementById('resultCount');
          if (rc) rc.innerHTML = '<strong>' + (serviceNames[service] || service) + '</strong> 관련 <strong>' + data.terms.length + '</strong>개 용어';

          var html = '';
          for (var i = 0; i < data.terms.length; i++) {
            html += renderTermCard(data.terms[i]);
          }
          grid.innerHTML = html;
          grid.className = (currentView === 'list') ? 'dict-list' : 'dict-grid';
        })
        .catch(function(e) { loading.style.display = 'none'; });
    }

    function renderTermCard(t) {
      var catColors = {
        'implant': '#0052CC', 'prosthetic': '#8B5CF6', 'restorative': '#059669',
        'periodontal': '#DC2626', 'tmj-ortho': '#EA580C', 'pediatric': '#2563EB',
        'oral-surgery': '#7C3AED', 'digital': '#0891B2', 'materials': '#4F46E5',
        'general-anatomy': '#6B7280'
      };
      var color = catColors[t.category_slug] || '#6B7280';

      return '<a href="/dictionary/' + t.slug + '" class="dict-card" data-service="' + t.related_service + '">' +
        '<div class="dict-card-header">' +
        '<span class="dict-card-cat" style="background:' + color + '15;color:' + color + '">' + escHtml(t.category_name) + '</span>' +
        '<span class="dict-card-views">' + (t.views || 0) + '회</span>' +
        '</div>' +
        '<h3 class="dict-card-term">' + highlight(t.term) + '</h3>' +
        (t.english ? '<p class="dict-card-en">' + highlight(t.english) + '</p>' : '') +
        '<p class="dict-card-desc">' + highlight(t.short_desc) + '</p>' +
        '<span class="dict-card-arrow">→</span>' +
        '</a>';
    }

    function highlight(text) {
      if (!currentSearch) return escHtml(text);
      var safe = currentSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp('(' + safe + ')', 'gi');
      return escHtml(text).replace(regex, '<mark>$1</mark>');
    }

    function escHtml(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderPagination(el, current, total) {
      var html = '';
      if (current > 1) html += '<button class="page-btn" data-page="' + (current - 1) + '">&laquo;</button>';
      for (var i = 1; i <= total; i++) {
        if (i === current) {
          html += '<button class="page-btn active">' + i + '</button>';
        } else if (Math.abs(i - current) <= 2 || i === 1 || i === total) {
          html += '<button class="page-btn" data-page="' + i + '">' + i + '</button>';
        } else if (Math.abs(i - current) === 3) {
          html += '<span class="page-dots">…</span>';
        }
      }
      if (current < total) html += '<button class="page-btn" data-page="' + (current + 1) + '">&raquo;</button>';
      el.innerHTML = html;

      var pageBtns = el.querySelectorAll('.page-btn[data-page]');
      for (var j = 0; j < pageBtns.length; j++) {
        pageBtns[j].addEventListener('click', function() {
          currentPage = parseInt(this.dataset.page || '1');
          loadTerms();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        });
      }
    }
  }

  // ═══════════════════════════════════════════
  // 상세 페이지
  // ═══════════════════════════════════════════
  function initDictionaryDetail(slug) {
    var SERVICE_MAP = {
      'implant': { name: '임플란트', url: '/#section-services' },
      'aesthetic': { name: '심미보철', url: '/#section-services' },
      'resin': { name: '심미레진', url: '/#section-services' },
      'tmj': { name: '턱관절', url: '/#section-services' },
      'general': { name: '일반진료', url: '/#section-services' },
      'tmj-ortho': { name: '턱관절·교정', url: '/#section-services' },
      'pediatric': { name: '소아·예방', url: '/#section-services' }
    };

    fetch('/api/dictionary/' + slug)
      .then(function(res) {
        if (!res.ok) { window.location.href = '/dictionary'; return null; }
        return res.json();
      })
      .then(function(data) {
        if (!data) return;
        render(data.term, data.related);
      })
      .catch(function(e) { console.error('Detail load error:', e); });

    function render(term, related) {
      // 브레드크럼
      var bc = document.getElementById('bcTerm');
      if (bc) bc.textContent = term.term;

      // 메인
      var main = document.getElementById('dictDetailMain');
      if (!main) return;
      var svc = SERVICE_MAP[term.related_service] || null;

      main.innerHTML =
        '<article class="dict-detail-article" itemscope itemtype="https://schema.org/DefinedTerm">' +
        '<div class="dict-detail-meta">' +
        '<span class="dict-detail-cat">' + escHtml(term.category_name) + '</span>' +
        '<span class="dict-detail-views">조회 ' + (term.views || 0) + '회</span>' +
        '</div>' +
        '<h1 class="dict-detail-term" itemprop="name">' + escHtml(term.term) + '</h1>' +
        '<div class="dict-detail-sub">' +
        (term.english ? '<span class="dict-detail-en" itemprop="alternateName">' + escHtml(term.english) + '</span>' : '') +
        (term.pronunciation ? '<span class="dict-detail-pron">[' + escHtml(term.pronunciation) + ']</span>' : '') +
        '</div>' +
        '<div class="dict-detail-short" itemprop="description">' + escHtml(term.short_desc) + '</div>' +
        '<div class="dict-detail-full">' +
        '<h2>상세 설명</h2>' +
        '<div class="dict-detail-full-text">' + escHtml(term.full_desc) + '</div>' +
        '</div>' +
        (svc ?
          '<div class="dict-detail-service">' +
          '<h2>이음치과 관련 진료</h2>' +
          '<a href="' + svc.url + '" class="dict-service-link">' +
          '<span class="dict-service-name">' + svc.name + '</span>' +
          '<span class="dict-service-arrow">진료 안내 보기 →</span>' +
          '</a>' +
          '<a href="/dictionary?service=' + term.related_service + '" class="dict-service-all">' +
          svc.name + ' 관련 용어 모두 보기 →' +
          '</a></div>' : '') +
        '<div class="dict-detail-share">' +
        '<button class="dict-share-btn" id="shareBtn">🔗 링크 복사</button>' +
        '</div>' +
        '</article>';

      // 공유 버튼
      var shareBtn = document.getElementById('shareBtn');
      if (shareBtn) {
        shareBtn.addEventListener('click', function() {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href).then(function() {
              alert('링크가 복사되었습니다!');
            });
          }
        });
      }

      // 사이드바
      var sidebar = document.getElementById('dictDetailSidebar');
      if (!sidebar) return;

      var relatedHtml = '';
      if (related && related.length) {
        relatedHtml = '<div class="dict-related"><h3>관련 용어</h3><ul class="dict-related-list">';
        for (var i = 0; i < related.length; i++) {
          var r = related[i];
          relatedHtml += '<li><a href="/dictionary/' + r.slug + '">' +
            '<strong>' + escHtml(r.term) + '</strong>' +
            (r.english ? '<small>' + escHtml(r.english) + '</small>' : '') +
            '<span>' + escHtml(r.short_desc) + '</span>' +
            '</a></li>';
        }
        relatedHtml += '</ul></div>';
      }

      sidebar.innerHTML = relatedHtml +
        '<div class="dict-sidebar-cta">' +
        '<h3>궁금한 점이 있으신가요?</h3>' +
        '<p>이음치과 전문 상담팀이 쉽게 설명해드립니다.</p>' +
        '<a href="tel:051-206-5888" class="dict-cta-mini">📞 051-206-5888</a>' +
        '</div>' +
        '<a href="/dictionary" class="dict-back-btn">← 백과사전으로 돌아가기</a>';
    }

    function escHtml(s) {
      if (!s) return '';
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }
})();
