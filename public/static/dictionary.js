/* ============================================
   이음치과 — 치과 용어 백과사전 Scripts (Premium v2)
   자동완성, 정렬, 애니메이션, 토스트
   ============================================ */
(function() {
  'use strict';

  var path = location.pathname;
  if (path === '/dictionary') {
    initDictionaryList();
  } else if (path.startsWith('/dictionary/')) {
    var slug = path.replace('/dictionary/', '');
    if (slug) initDictionaryDetail(slug);
  }

  // ═══════════════════════════════════════════
  // 유틸리티
  // ═══════════════════════════════════════════
  function escHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showToast(msg) {
    var toast = document.getElementById('dictToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2500);
  }

  var SERVICE_NAMES = {
    'implant': '임플란트', 'aesthetic': '심미보철', 'resin': '심미레진',
    'tmj': '턱관절', 'general': '일반진료', 'tmj-ortho': '턱관절·교정',
    'pediatric': '소아·예방'
  };

  var CATEGORY_ICONS = {
    'implant': '🦷', 'prosthetic': '👑', 'restorative': '🔧',
    'periodontal': '🩸', 'tmj-ortho': '🦴', 'pediatric': '👶',
    'oral-surgery': '🔪', 'digital': '💻', 'materials': '🧪',
    'general-anatomy': '📚'
  };

  var CAT_COLORS = {
    'implant': '#3B82F6', 'prosthetic': '#8B5CF6', 'restorative': '#10B981',
    'periodontal': '#EF4444', 'tmj-ortho': '#F59E0B', 'pediatric': '#06B6D4',
    'oral-surgery': '#7C3AED', 'digital': '#0891B2', 'materials': '#6366F1',
    'general-anatomy': '#64748B'
  };

  // ═══════════════════════════════════════════
  // 목록 페이지
  // ═══════════════════════════════════════════
  function initDictionaryList() {
    var currentCategory = 'all';
    var currentChosung = '';
    var currentSearch = '';
    var currentSort = 'term';
    var currentPage = 1;
    var currentView = 'grid';
    var categories = [];
    var chosungStats = {};
    var debounceTimer = null;
    var acDebounce = null;
    var acIndex = -1;

    // URL 파라미터 처리
    var params = new URLSearchParams(location.search);
    var initService = params.get('service');

    // 초기화
    Promise.all([loadCategories(), loadChosungStats(), loadOverviewStats()])
      .then(function() {
        if (initService) {
          loadTermsByService(initService);
        } else {
          loadTerms();
        }
      });
    bindEvents();

    // ─── 카테고리 ───
    function loadCategories() {
      return fetch('/api/dictionary/categories')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          categories = data.categories;
          var counts = data.counts || {};
          renderCategories(counts);
        })
        .catch(function(e) { console.error('Categories:', e); });
    }

    function renderCategories(counts) {
      var list = document.getElementById('categoryList');
      if (!list) return;

      var totalCount = 0;
      for (var key in counts) totalCount += counts[key];

      var html = '<button class="dict-cat-btn active" data-cat="all">' +
        '<span class="dict-cat-icon">📖</span>' +
        '<span class="dict-cat-name">전체</span>' +
        '<span class="dict-cat-count">' + totalCount + '</span>' +
        '</button>';

      for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        var cnt = counts[cat.slug] || 0;
        html += '<button class="dict-cat-btn" data-cat="' + cat.slug + '">' +
          '<span class="dict-cat-icon">' + (CATEGORY_ICONS[cat.slug] || '📄') + '</span>' +
          '<span class="dict-cat-name">' + escHtml(cat.name) + '</span>' +
          '<span class="dict-cat-count">' + cnt + '</span>' +
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

    // ─── 초성 통계 ───
    function loadChosungStats() {
      return fetch('/api/dictionary/stats/chosung')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          chosungStats = {};
          for (var i = 0; i < data.stats.length; i++) {
            chosungStats[data.stats[i].chosung] = data.stats[i].count;
          }
          updateChosungCounts();
        })
        .catch(function() {});
    }

    function updateChosungCounts() {
      var btns = document.querySelectorAll('.chosung-btn[data-chosung]');
      for (var i = 0; i < btns.length; i++) {
        var ch = btns[i].dataset.chosung;
        if (ch === 'all' || ch === 'ABC') continue;
        var cnt = chosungStats[ch] || 0;
        // 카운트 뱃지가 없으면 추가
        var badge = btns[i].querySelector('.chosung-count');
        if (!badge && cnt > 0) {
          badge = document.createElement('span');
          badge.className = 'chosung-count';
          btns[i].appendChild(badge);
        }
        if (badge) badge.textContent = cnt;
      }
    }

    // ─── 전체 통계 ───
    function loadOverviewStats() {
      return fetch('/api/dictionary/stats/overview')
        .then(function(res) { return res.json(); })
        .then(function(data) {
          var el1 = document.getElementById('statTotal');
          var el2 = document.getElementById('statCategories');
          var el3 = document.getElementById('statPopular');
          if (el1) el1.textContent = data.totalTerms;
          if (el2) el2.textContent = data.totalCategories;
          if (el3) el3.textContent = data.popularTerm;
        })
        .catch(function() {});
    }

    // ─── 이벤트 바인딩 ───
    function bindEvents() {
      // 검색
      var input = document.getElementById('dictSearch');
      var clearBtn = document.getElementById('dictSearchClear');
      if (input) {
        input.addEventListener('input', function() {
          clearBtn.style.display = input.value ? 'flex' : 'none';
          // 자동완성
          clearTimeout(acDebounce);
          acDebounce = setTimeout(function() {
            if (input.value.trim().length >= 1) {
              fetchAutocomplete(input.value.trim());
            } else {
              hideAutocomplete();
            }
          }, 200);
          // 검색 실행
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            currentSearch = input.value.trim();
            currentPage = 1;
            loadTerms();
          }, 400);
        });

        input.addEventListener('keydown', function(e) {
          var ac = document.getElementById('dictAutocomplete');
          var items = ac ? ac.querySelectorAll('.dict-ac-item') : [];
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            acIndex = Math.min(acIndex + 1, items.length - 1);
            updateAcHighlight(items);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            acIndex = Math.max(acIndex - 1, -1);
            updateAcHighlight(items);
          } else if (e.key === 'Enter' && acIndex >= 0 && items[acIndex]) {
            e.preventDefault();
            window.location.href = items[acIndex].getAttribute('href');
          } else if (e.key === 'Escape') {
            hideAutocomplete();
          }
        });

        input.addEventListener('focus', function() {
          if (input.value.trim().length >= 1) {
            fetchAutocomplete(input.value.trim());
          }
        });
      }
      if (clearBtn) {
        clearBtn.addEventListener('click', function() {
          input.value = '';
          clearBtn.style.display = 'none';
          currentSearch = '';
          currentPage = 1;
          hideAutocomplete();
          loadTerms();
          input.focus();
        });
      }

      // 자동완성 외부 클릭시 닫기
      document.addEventListener('click', function(e) {
        var bar = document.getElementById('dictSearchBar');
        if (bar && !bar.contains(e.target)) hideAutocomplete();
      });

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

      // 정렬
      var sortSelect = document.getElementById('dictSort');
      if (sortSelect) {
        sortSelect.addEventListener('change', function() {
          currentSort = this.value;
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

      // 스크롤 시 초성바 그림자
      var chosungSection = document.getElementById('chosungSection');
      if (chosungSection) {
        var lastScroll = 0;
        window.addEventListener('scroll', function() {
          var s = window.scrollY;
          if (s > 300) {
            chosungSection.classList.add('scrolled');
          } else {
            chosungSection.classList.remove('scrolled');
          }
          lastScroll = s;
        }, { passive: true });
      }
    }

    // ─── 자동완성 ───
    function fetchAutocomplete(q) {
      fetch('/api/dictionary/search/autocomplete?q=' + encodeURIComponent(q))
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (!data.results || data.results.length === 0) { hideAutocomplete(); return; }
          var ac = document.getElementById('dictAutocomplete');
          if (!ac) return;
          acIndex = -1;
          var html = '';
          for (var i = 0; i < data.results.length; i++) {
            var r = data.results[i];
            html += '<a href="/dictionary/' + r.slug + '" class="dict-ac-item">' +
              '<span class="dict-ac-term">' + highlightMatch(r.term, q) + '</span>' +
              (r.english ? '<span class="dict-ac-en">' + escHtml(r.english) + '</span>' : '') +
              '<span class="dict-ac-cat">' + escHtml(r.category_name) + '</span>' +
              '</a>';
          }
          ac.innerHTML = html;
          ac.classList.add('show');
        })
        .catch(function() { hideAutocomplete(); });
    }

    function hideAutocomplete() {
      var ac = document.getElementById('dictAutocomplete');
      if (ac) { ac.classList.remove('show'); acIndex = -1; }
    }

    function updateAcHighlight(items) {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.toggle('active', i === acIndex);
      }
    }

    function highlightMatch(text, query) {
      var safe = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp('(' + safe + ')', 'gi');
      return escHtml(text).replace(regex, '<mark>$1</mark>');
    }

    // ─── 용어 로드 ───
    function loadTerms() {
      var grid = document.getElementById('dictGrid');
      var empty = document.getElementById('dictEmpty');
      var loading = document.getElementById('dictLoading');
      var pagination = document.getElementById('dictPagination');

      if (!grid) return;
      if (loading) loading.style.display = 'flex';
      if (empty) empty.style.display = 'none';
      grid.innerHTML = '';
      if (loading) grid.appendChild(loading);

      var qp = new URLSearchParams();
      if (currentCategory !== 'all') qp.set('category', currentCategory);
      if (currentChosung && currentChosung !== 'ABC') qp.set('chosung', currentChosung);
      if (currentChosung === 'ABC') qp.set('chosung', 'ABC');
      if (currentSearch) qp.set('search', currentSearch);
      if (currentSort !== 'term') qp.set('sort', currentSort);
      qp.set('page', String(currentPage));
      qp.set('limit', '50');

      fetch('/api/dictionary?' + qp.toString())
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (loading) loading.style.display = 'none';

          var rc = document.getElementById('resultCount');
          if (rc) rc.innerHTML = '검색 결과 <strong>' + data.total + '</strong>개 용어';

          if (!data.terms || data.terms.length === 0) {
            if (empty) empty.style.display = 'flex';
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
          if (loading) loading.style.display = 'none';
          console.error('Terms:', e);
        });
    }

    function loadTermsByService(service) {
      var grid = document.getElementById('dictGrid');
      var loading = document.getElementById('dictLoading');
      if (!grid) return;
      if (loading) loading.style.display = 'flex';
      grid.innerHTML = '';
      if (loading) grid.appendChild(loading);

      fetch('/api/dictionary/service/' + service)
        .then(function(res) { return res.json(); })
        .then(function(data) {
          if (loading) loading.style.display = 'none';
          var rc = document.getElementById('resultCount');
          if (rc) rc.innerHTML = '<strong>' + (SERVICE_NAMES[service] || service) + '</strong> 관련 <strong>' + data.terms.length + '</strong>개 용어';

          var html = '';
          for (var i = 0; i < data.terms.length; i++) {
            html += renderTermCard(data.terms[i]);
          }
          grid.innerHTML = html;
          grid.className = (currentView === 'list') ? 'dict-list' : 'dict-grid';
        })
        .catch(function(e) { if (loading) loading.style.display = 'none'; });
    }

    // ─── 카드 렌더링 ───
    function renderTermCard(t) {
      var color = CAT_COLORS[t.category_slug] || '#64748B';
      var svcName = SERVICE_NAMES[t.related_service] || '';

      return '<a href="/dictionary/' + t.slug + '" class="dict-card" data-service="' + (t.related_service || '') + '">' +
        '<div class="dict-card-header">' +
        '<span class="dict-card-cat" style="background:' + color + '12;color:' + color + ';border:1px solid ' + color + '25">' + escHtml(t.category_name) + '</span>' +
        '<span class="dict-card-views">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
        (t.views || 0) +
        '</span>' +
        '</div>' +
        '<h3 class="dict-card-term">' + highlight(t.term) + '</h3>' +
        (t.english ? '<p class="dict-card-en">' + highlight(t.english) + '</p>' : '') +
        '<p class="dict-card-desc">' + highlight(t.short_desc) + '</p>' +
        (svcName ? '<div class="dict-card-footer"><span class="dict-card-service-tag">' + escHtml(svcName) + '</span><span class="dict-card-arrow">&rarr;</span></div>' :
        '<div class="dict-card-footer"><span></span><span class="dict-card-arrow">&rarr;</span></div>') +
        '</a>';
    }

    function highlight(text) {
      if (!currentSearch) return escHtml(text);
      return highlightMatch(text, currentSearch);
    }

    // ─── 페이지네이션 ───
    function renderPagination(el, current, total) {
      var html = '';
      if (current > 1) {
        html += '<button class="page-btn" data-page="' + (current - 1) + '">&lsaquo;</button>';
      }
      
      var start = Math.max(1, current - 2);
      var end = Math.min(total, current + 2);
      
      if (start > 1) {
        html += '<button class="page-btn" data-page="1">1</button>';
        if (start > 2) html += '<span class="page-dots">&hellip;</span>';
      }

      for (var i = start; i <= end; i++) {
        if (i === current) {
          html += '<button class="page-btn active">' + i + '</button>';
        } else {
          html += '<button class="page-btn" data-page="' + i + '">' + i + '</button>';
        }
      }

      if (end < total) {
        if (end < total - 1) html += '<span class="page-dots">&hellip;</span>';
        html += '<button class="page-btn" data-page="' + total + '">' + total + '</button>';
      }

      if (current < total) {
        html += '<button class="page-btn" data-page="' + (current + 1) + '">&rsaquo;</button>';
      }

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
      .catch(function(e) { console.error('Detail:', e); });

    function render(term, related) {
      // 브레드크럼
      var bc = document.getElementById('bcTerm');
      if (bc) bc.textContent = term.term;

      // H1 태그 업데이트 (SEO — 페이지당 1개)
      var h1 = document.getElementById('dictDetailH1');
      if (h1) h1.textContent = term.term + ' 뜻 — 이음치과 치과 용어 백과사전';

      // 페이지 타이틀 업데이트
      document.title = term.term + ' 뜻 | ' + (term.english || term.term) + ' — 이음치과 치과 용어 백과사전';

      // 메인
      var main = document.getElementById('dictDetailMain');
      if (!main) return;
      var svc = SERVICE_MAP[term.related_service] || null;

      main.innerHTML =
        '<article class="dict-detail-article" itemscope itemtype="https://schema.org/DefinedTerm">' +
        '<div class="dict-detail-meta">' +
        '<span class="dict-detail-cat">' + escHtml(term.category_name) + '</span>' +
        '<span class="dict-detail-views">' +
        '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
        '조회 ' + (term.views || 0) + '회</span>' +
        '</div>' +
        '<h2 class="dict-detail-term" itemprop="name">' + escHtml(term.term) + '</h2>' +
        '<div class="dict-detail-sub">' +
        (term.english ? '<span class="dict-detail-en" itemprop="alternateName">' + escHtml(term.english) + '</span>' : '') +
        (term.pronunciation ? '<span class="dict-detail-pron">' + escHtml(term.pronunciation) + '</span>' : '') +
        '</div>' +
        '<div class="dict-detail-short" itemprop="description">' + escHtml(term.short_desc) + '</div>' +
        '<div class="dict-detail-full">' +
        '<h2>상세 설명</h2>' +
        '<div class="dict-detail-full-text">' + formatDescription(term.full_desc) + '</div>' +
        '</div>' +
        (svc ?
          '<div class="dict-detail-service">' +
          '<h2>이음치과 관련 진료</h2>' +
          '<a href="' + svc.url + '" class="dict-service-link">' +
          '<span class="dict-service-name">' + svc.name + ' 진료 안내</span>' +
          '<span class="dict-service-arrow">&rarr;</span>' +
          '</a>' +
          '<a href="/dictionary?service=' + term.related_service + '" class="dict-service-all">' +
          svc.name + ' 관련 용어 모두 보기 &rarr;' +
          '</a></div>' : '') +
        '<div class="dict-detail-actions">' +
        '<button class="dict-share-btn" id="shareBtn">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' +
        '링크 복사</button>' +
        '<a href="/dictionary" class="dict-share-btn">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
        '목록으로</a>' +
        '</div>' +
        '</article>';

      // 공유 버튼
      var shareBtn = document.getElementById('shareBtn');
      if (shareBtn) {
        shareBtn.addEventListener('click', function() {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href).then(function() {
              showToast('링크가 복사되었습니다!');
            });
          }
        });
      }

      // 사이드바
      var sidebar = document.getElementById('dictDetailSidebar');
      if (!sidebar) return;

      var relatedHtml = '';
      if (related && related.length) {
        relatedHtml = '<div class="dict-related"><h3>같은 카테고리 용어</h3><ul class="dict-related-list">';
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
        '<p>이음치과 전문 상담팀이<br/>쉽게 설명해드립니다.</p>' +
        '<a href="tel:051-206-5888" class="dict-cta-mini">📞 051-206-5888</a>' +
        '</div>' +
        '<a href="/dictionary" class="dict-back-btn">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>' +
        '백과사전으로 돌아가기</a>';
    }

    function formatDescription(desc) {
      if (!desc) return '';
      // 문장 단위로 구분하되 HTML 이스케이프 후 단락 처리
      var escaped = escHtml(desc);
      // 마침표+공백 뒤에 줄바꿈 추가 (가독성)
      return escaped.replace(/\.\s+/g, '.<br/><br/>');
    }
  }
})();
