/* ============================================
   이음치과 — Sub Page Scripts
   Cases, Blogs, Notices data loading
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initCasesPage();
    initCaseDetail();
    initBlogsPage();
    initBlogDetail();
    initNoticesPage();
    initNoticeDetail();
  }

  // === Helpers ===
  function formatDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    return dt.getFullYear() + '.' + String(dt.getMonth() + 1).padStart(2, '0') + '.' + String(dt.getDate()).padStart(2, '0');
  }

  function categoryLabel(cat) {
    var map = { implant: '임플란트', aesthetic: '심미보철', resin: '심미 레진', tmj: '턱관절', general: '일반진료' };
    return map[cat] || cat;
  }

  // === CASES LIST ===
  function initCasesPage() {
    var grid = document.getElementById('casesGrid');
    if (!grid) return;

    var page = 1;
    var category = 'all';
    var loading = false;

    // Filter buttons
    var filterBar = document.getElementById('caseFilter');
    if (filterBar) {
      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        category = btn.dataset.cat;
        page = 1;
        grid.innerHTML = '<div class="loading-spinner">불러오는 중...</div>';
        loadCases();
      });
    }

    function loadCases() {
      if (loading) return;
      loading = true;
      var url = '/api/cases?page=' + page + '&limit=12';
      fetch(url).then(function (r) { return r.json(); }).then(function (data) {
        if (page === 1) grid.innerHTML = '';

        var items = data.cases || [];
        if (category !== 'all') {
          items = items.filter(function (c) { return c.category === category; });
        }

        if (items.length === 0 && page === 1) {
          grid.innerHTML = '<div class="empty-state"><p>등록된 케이스가 없습니다.</p></div>';
        }

        items.forEach(function (c) {
          var thumb = c.pano_before || c.intra_before || c.pano_after || c.intra_after || '';
          var card = document.createElement('a');
          card.href = '/cases/' + c.id;
          card.className = 'case-card';
          card.setAttribute('data-hover', '');
          card.innerHTML =
            '<div class="case-card-img">' +
              (thumb ? '<img src="' + thumb + '" alt="" loading="lazy"/>' : '<div class="no-img">NO IMAGE</div>') +
            '</div>' +
            '<div class="case-card-body">' +
              '<span class="case-tag">' + categoryLabel(c.category) + '</span>' +
              '<h3>' + (c.title || '') + '</h3>' +
              '<div class="case-meta"><span>' + formatDate(c.created_at) + '</span><span>조회 ' + (c.views || 0) + '</span></div>' +
            '</div>';
          grid.appendChild(card);
        });

        var loadMoreBtn = document.getElementById('casesLoadMore');
        if (loadMoreBtn) {
          loadMoreBtn.style.display = (data.total > page * 12) ? '' : 'none';
        }
        loading = false;
      }).catch(function () { loading = false; });
    }

    var loadMoreBtn = document.getElementById('casesLoadMore');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () { page++; loadCases(); });
    }

    loadCases();
  }

  // === CASE DETAIL ===
  function initCaseDetail() {
    var el = document.getElementById('caseDetail');
    if (!el) return;
    var id = el.dataset.caseId;

    fetch('/api/cases/' + id).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (c) {
      var images = [];
      if (c.pano_before) images.push({ label: '파노라마 (전)', url: c.pano_before });
      if (c.pano_after) images.push({ label: '파노라마 (후)', url: c.pano_after });
      if (c.intra_before) images.push({ label: '구내사진 (전)', url: c.intra_before });
      if (c.intra_after) images.push({ label: '구내사진 (후)', url: c.intra_after });

      var html = '<div class="case-detail-header">' +
        '<span class="case-tag">' + categoryLabel(c.category) + '</span>' +
        '<h1>' + (c.title || '') + '</h1>' +
        '<div class="case-meta"><span>' + formatDate(c.created_at) + '</span><span>조회 ' + (c.views || 0) + '</span></div>' +
      '</div>';

      if (c.description) {
        html += '<div class="case-detail-desc"><p>' + c.description.replace(/\n/g, '<br/>') + '</p></div>';
      }

      if (images.length > 0) {
        html += '<div class="case-detail-images" style="grid-template-columns: repeat(' + Math.min(images.length, 2) + ', 1fr)">';
        images.forEach(function (img) {
          html += '<div class="case-detail-img-wrap">' +
            '<div class="case-detail-img-label">' + img.label + '</div>' +
            '<img src="' + img.url + '" alt="' + img.label + '" loading="lazy" />' +
          '</div>';
        });
        html += '</div>';
      }

      el.innerHTML = html;
    }).catch(function () {
      el.innerHTML = '<div class="empty-state"><p>케이스를 찾을 수 없습니다.</p></div>';
    });
  }

  // === BLOGS LIST ===
  function initBlogsPage() {
    var grid = document.getElementById('blogsGrid');
    if (!grid) return;

    var page = 1;
    var loading = false;

    function loadBlogs() {
      if (loading) return;
      loading = true;
      fetch('/api/blogs?page=' + page + '&limit=12').then(function (r) { return r.json(); }).then(function (data) {
        if (page === 1) grid.innerHTML = '';

        var items = data.blogs || [];
        if (items.length === 0 && page === 1) {
          grid.innerHTML = '<div class="empty-state"><p>등록된 블로그 글이 없습니다.</p></div>';
        }

        items.forEach(function (b) {
          var card = document.createElement('a');
          card.href = '/blogs/' + b.id;
          card.className = 'blog-card';
          card.setAttribute('data-hover', '');
          card.innerHTML =
            '<div class="blog-card-img">' +
              (b.thumbnail ? '<img src="' + b.thumbnail + '" alt="" loading="lazy"/>' : '<div class="no-img">BLOG</div>') +
            '</div>' +
            '<div class="blog-card-body">' +
              '<h3>' + (b.title || '') + '</h3>' +
              '<p class="blog-excerpt">' + (b.content || '').substring(0, 100) + '...</p>' +
              '<div class="blog-meta"><span>' + formatDate(b.created_at) + '</span><span>조회 ' + (b.views || 0) + '</span></div>' +
            '</div>';
          grid.appendChild(card);
        });

        var loadMoreBtn = document.getElementById('blogsLoadMore');
        if (loadMoreBtn) {
          loadMoreBtn.style.display = (data.total > page * 12) ? '' : 'none';
        }
        loading = false;
      }).catch(function () { loading = false; });
    }

    var loadMoreBtn = document.getElementById('blogsLoadMore');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () { page++; loadBlogs(); });
    }

    loadBlogs();
  }

  // === BLOG DETAIL ===
  function initBlogDetail() {
    var el = document.getElementById('blogDetail');
    if (!el) return;
    var id = el.dataset.blogId;

    fetch('/api/blogs/' + id).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (b) {
      var html = '<div class="blog-detail-header">' +
        '<h1>' + (b.title || '') + '</h1>' +
        '<div class="blog-meta"><span>' + formatDate(b.created_at) + '</span><span>조회 ' + (b.views || 0) + '</span></div>' +
      '</div>';

      if (b.content) {
        html += '<div class="blog-detail-content"><p>' + b.content.replace(/\n/g, '<br/>') + '</p></div>';
      }

      if (b.images && b.images.length > 0) {
        html += '<div class="blog-detail-images">';
        b.images.forEach(function (img) {
          html += '<div class="blog-detail-img"><img src="' + img.image_url + '" alt="" loading="lazy" /></div>';
        });
        html += '</div>';
      }

      el.innerHTML = html;
    }).catch(function () {
      el.innerHTML = '<div class="empty-state"><p>글을 찾을 수 없습니다.</p></div>';
    });
  }

  // === NOTICES LIST ===
  function initNoticesPage() {
    var list = document.getElementById('noticesList');
    if (!list) return;

    var page = 1;
    var loading = false;

    function loadNotices() {
      if (loading) return;
      loading = true;
      fetch('/api/notices?page=' + page + '&limit=20').then(function (r) { return r.json(); }).then(function (data) {
        if (page === 1) list.innerHTML = '';

        var items = data.notices || [];
        if (items.length === 0 && page === 1) {
          list.innerHTML = '<div class="empty-state"><p>등록된 공지사항이 없습니다.</p></div>';
        }

        items.forEach(function (n) {
          var row = document.createElement('a');
          row.href = '/notices/' + n.id;
          row.className = 'notice-row' + (n.is_pinned ? ' pinned' : '');
          row.setAttribute('data-hover', '');
          row.innerHTML =
            '<div class="notice-row-left">' +
              (n.is_pinned ? '<span class="pin-badge">고정</span>' : '') +
              '<h3>' + (n.title || '') + '</h3>' +
            '</div>' +
            '<div class="notice-row-right">' +
              '<span>' + formatDate(n.created_at) + '</span>' +
              '<span>조회 ' + (n.views || 0) + '</span>' +
            '</div>';
          list.appendChild(row);
        });

        var loadMoreBtn = document.getElementById('noticesLoadMore');
        if (loadMoreBtn) {
          loadMoreBtn.style.display = (data.total > page * 20) ? '' : 'none';
        }
        loading = false;
      }).catch(function () { loading = false; });
    }

    var loadMoreBtn = document.getElementById('noticesLoadMore');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () { page++; loadNotices(); });
    }

    loadNotices();
  }

  // === NOTICE DETAIL ===
  function initNoticeDetail() {
    var el = document.getElementById('noticeDetail');
    if (!el) return;
    var id = el.dataset.noticeId;

    fetch('/api/notices/' + id).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (n) {
      el.innerHTML =
        '<div class="notice-detail-header">' +
          (n.is_pinned ? '<span class="pin-badge">고정</span>' : '') +
          '<h1>' + (n.title || '') + '</h1>' +
          '<div class="notice-meta"><span>' + formatDate(n.created_at) + '</span><span>조회 ' + (n.views || 0) + '</span></div>' +
        '</div>' +
        '<div class="notice-detail-content"><p>' + (n.content || '').replace(/\n/g, '<br/>') + '</p></div>';
    }).catch(function () {
      el.innerHTML = '<div class="empty-state"><p>공지사항을 찾을 수 없습니다.</p></div>';
    });
  }

})();
