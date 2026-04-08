/* ============================================
   이음치과 — Admin Dashboard Scripts
   Login, Cases CRUD, Blog CRUD, Notices CRUD, FAQ CRUD
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    checkAuth();
    initLogin();
    initLogout();
    initTabs();
    initModals();
    initCasesAdmin();
    initBlogsAdmin();
    initNoticesAdmin();
    initFaqAdmin();
  }

  // === AUTH ===
  function checkAuth() {
    fetch('/api/admin/check').then(function (r) {
      if (r.ok) {
        showDashboard();
      } else {
        showLogin();
      }
    }).catch(function () { showLogin(); });
  }

  function showLogin() {
    document.getElementById('loginScreen').style.display = '';
    document.getElementById('dashboard').style.display = 'none';
  }

  function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = '';
    loadCases();
    loadBlogs();
    loadNotices();
    loadFaq();
  }

  function initLogin() {
    var form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = document.getElementById('loginPw').value;
      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw })
      }).then(function (r) {
        if (r.ok) {
          showDashboard();
        } else {
          document.getElementById('loginError').style.display = '';
        }
      });
    });
  }

  function initLogout() {
    var btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      fetch('/api/admin/logout', { method: 'POST' }).then(function () { showLogin(); });
    });
  }

  // === TABS ===
  function initTabs() {
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('active'); });
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
      });
    });
  }

  // === MODALS ===
  function initModals() {
    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.getElementById(btn.dataset.close).style.display = 'none';
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) overlay.style.display = 'none';
      });
    });
  }

  // === Upload helper ===
  function uploadFile(file) {
    var fd = new FormData();
    fd.append('file', file);
    return fetch('/api/upload', { method: 'POST', body: fd }).then(function (r) { return r.json(); });
  }

  function uploadMulti(files) {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }
    return fetch('/api/upload/multi', { method: 'POST', body: fd }).then(function (r) { return r.json(); });
  }

  function formatDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    return dt.getFullYear() + '.' + String(dt.getMonth() + 1).padStart(2, '0') + '.' + String(dt.getDate()).padStart(2, '0');
  }

  function categoryLabel(cat) {
    var map = { implant: '임플란트', aesthetic: '심미보철', resin: '심미 레진', tmj: '턱관절', general: '일반진료' };
    return map[cat] || cat;
  }

  // =============================
  // CASES ADMIN
  // =============================
  function initCasesAdmin() {
    // New case button
    document.getElementById('newCaseBtn').addEventListener('click', function () {
      document.getElementById('caseModalTitle').textContent = '새 케이스 등록';
      document.getElementById('caseForm').reset();
      document.getElementById('caseId').value = '';
      clearCasePreviews();
      document.getElementById('caseModal').style.display = '';
    });

    // File inputs
    document.querySelectorAll('.case-file-input').forEach(function (input) {
      input.addEventListener('change', function () {
        if (!this.files[0]) return;
        var target = this.dataset.target;
        var preview = document.getElementById('preview-' + target);
        uploadFile(this.files[0]).then(function (data) {
          document.getElementById('val-' + target).value = data.url;
          preview.innerHTML = '<img src="' + data.url + '" /><button type="button" class="remove-img" onclick="this.parentElement.innerHTML=\'\';document.getElementById(\'val-' + target + '\').value=\'\'">&times;</button>';
        });
      });
    });

    // Form submit
    document.getElementById('caseForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('caseId').value;
      var payload = {
        title: document.getElementById('caseTitle').value,
        category: document.getElementById('caseCategory').value,
        description: document.getElementById('caseDesc').value,
        pano_before: document.getElementById('val-pano_before').value || null,
        pano_after: document.getElementById('val-pano_after').value || null,
        intra_before: document.getElementById('val-intra_before').value || null,
        intra_after: document.getElementById('val-intra_after').value || null,
      };

      var url = id ? '/api/admin/cases/' + id : '/api/admin/cases';
      var method = id ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function () {
        document.getElementById('caseModal').style.display = 'none';
        loadCases();
      });
    });
  }

  function clearCasePreviews() {
    ['pano_before', 'pano_after', 'intra_before', 'intra_after'].forEach(function (s) {
      document.getElementById('preview-' + s).innerHTML = '';
      document.getElementById('val-' + s).value = '';
    });
  }

  function loadCases() {
    fetch('/api/admin/cases').then(function (r) { return r.json(); }).then(function (data) {
      var list = document.getElementById('casesList');
      if (!data.cases || data.cases.length === 0) {
        list.innerHTML = '<div class="admin-empty">등록된 케이스가 없습니다</div>';
        return;
      }
      list.innerHTML = '';
      data.cases.forEach(function (c) {
        var thumb = c.pano_before || c.intra_before || '';
        var row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML =
          '<div class="admin-row-thumb">' + (thumb ? '<img src="' + thumb + '"/>' : '') + '</div>' +
          '<div class="admin-row-info">' +
            '<h4>' + (c.title || '(제목 없음)') + '</h4>' +
            '<span class="admin-tag">' + categoryLabel(c.category) + '</span>' +
            '<span class="admin-meta">조회 ' + (c.views || 0) + ' · ' + formatDate(c.created_at) + '</span>' +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button class="btn-edit" data-edit-case="' + c.id + '">수정</button>' +
            '<button class="btn-delete" data-del-case="' + c.id + '">삭제</button>' +
          '</div>';
        list.appendChild(row);
      });

      // Edit buttons
      list.querySelectorAll('[data-edit-case]').forEach(function (btn) {
        btn.addEventListener('click', function () { editCase(btn.dataset.editCase, data.cases); });
      });

      // Delete buttons
      list.querySelectorAll('[data-del-case]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('이 케이스를 삭제하시겠습니까?')) return;
          fetch('/api/admin/cases/' + btn.dataset.delCase, { method: 'DELETE' }).then(function () { loadCases(); });
        });
      });
    });
  }

  function editCase(id, allCases) {
    var c = allCases.find(function (x) { return x.id == id; });
    if (!c) return;
    document.getElementById('caseModalTitle').textContent = '케이스 수정';
    document.getElementById('caseId').value = c.id;
    document.getElementById('caseTitle').value = c.title || '';
    document.getElementById('caseCategory').value = c.category || 'implant';
    document.getElementById('caseDesc').value = c.description || '';

    ['pano_before', 'pano_after', 'intra_before', 'intra_after'].forEach(function (s) {
      var val = c[s] || '';
      document.getElementById('val-' + s).value = val;
      var preview = document.getElementById('preview-' + s);
      if (val) {
        preview.innerHTML = '<img src="' + val + '" /><button type="button" class="remove-img" onclick="this.parentElement.innerHTML=\'\';document.getElementById(\'val-' + s + '\').value=\'\'">&times;</button>';
      } else {
        preview.innerHTML = '';
      }
    });

    document.getElementById('caseModal').style.display = '';
  }

  // =============================
  // BLOGS ADMIN
  // =============================
  var blogImages = [];

  function initBlogsAdmin() {
    document.getElementById('newBlogBtn').addEventListener('click', function () {
      document.getElementById('blogModalTitle').textContent = '새 블로그 글';
      document.getElementById('blogForm').reset();
      document.getElementById('blogId').value = '';
      blogImages = [];
      renderBlogPreviews();
      document.getElementById('blogModal').style.display = '';
    });

    // Dropzone
    var dz = document.getElementById('blogDropzone');
    var fileInput = document.getElementById('blogFiles');

    dz.addEventListener('click', function () { fileInput.click(); });
    dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('dragover'); });
    dz.addEventListener('dragleave', function () { dz.classList.remove('dragover'); });
    dz.addEventListener('drop', function (e) {
      e.preventDefault();
      dz.classList.remove('dragover');
      handleBlogFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', function () { handleBlogFiles(this.files); this.value = ''; });

    // Form submit
    document.getElementById('blogForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('blogId').value;
      var payload = {
        title: document.getElementById('blogTitle').value,
        content: document.getElementById('blogContent').value,
        thumbnail: blogImages.length > 0 ? blogImages[0] : null,
        images: blogImages
      };

      var url = id ? '/api/admin/blogs/' + id : '/api/admin/blogs';
      var method = id ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function () {
        document.getElementById('blogModal').style.display = 'none';
        loadBlogs();
      });
    });
  }

  function handleBlogFiles(files) {
    if (!files || files.length === 0) return;
    var arr = Array.from(files);
    if (blogImages.length + arr.length > 10) {
      alert('최대 10장까지 업로드 가능합니다');
      return;
    }

    uploadMulti(arr).then(function (data) {
      data.files.forEach(function (f) { blogImages.push(f.url); });
      renderBlogPreviews();
    });
  }

  function renderBlogPreviews() {
    var grid = document.getElementById('blogPreviewGrid');
    grid.innerHTML = '';
    blogImages.forEach(function (url, i) {
      var item = document.createElement('div');
      item.className = 'blog-preview-item';
      item.innerHTML = '<img src="' + url + '" />' +
        '<button type="button" class="remove-img" data-remove-blog="' + i + '">&times;</button>' +
        (i === 0 ? '<span class="thumb-badge">썸네일</span>' : '');
      grid.appendChild(item);
    });
    grid.querySelectorAll('[data-remove-blog]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        blogImages.splice(parseInt(btn.dataset.removeBlog), 1);
        renderBlogPreviews();
      });
    });
  }

  function loadBlogs() {
    fetch('/api/admin/blogs').then(function (r) { return r.json(); }).then(function (data) {
      var list = document.getElementById('blogsList');
      if (!data.blogs || data.blogs.length === 0) {
        list.innerHTML = '<div class="admin-empty">등록된 블로그 글이 없습니다</div>';
        return;
      }
      list.innerHTML = '';
      data.blogs.forEach(function (b) {
        var row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML =
          '<div class="admin-row-thumb">' + (b.thumbnail ? '<img src="' + b.thumbnail + '"/>' : '') + '</div>' +
          '<div class="admin-row-info">' +
            '<h4>' + (b.title || '(제목 없음)') + '</h4>' +
            '<span class="admin-meta">조회 ' + (b.views || 0) + ' · ' + formatDate(b.created_at) + '</span>' +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button class="btn-edit" data-edit-blog="' + b.id + '">수정</button>' +
            '<button class="btn-delete" data-del-blog="' + b.id + '">삭제</button>' +
          '</div>';
        list.appendChild(row);
      });

      list.querySelectorAll('[data-edit-blog]').forEach(function (btn) {
        btn.addEventListener('click', function () { editBlog(btn.dataset.editBlog); });
      });

      list.querySelectorAll('[data-del-blog]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('이 글을 삭제하시겠습니까?')) return;
          fetch('/api/admin/blogs/' + btn.dataset.delBlog, { method: 'DELETE' }).then(function () { loadBlogs(); });
        });
      });
    });
  }

  function editBlog(id) {
    fetch('/api/blogs/' + id).then(function (r) { return r.json(); }).then(function (b) {
      document.getElementById('blogModalTitle').textContent = '블로그 수정';
      document.getElementById('blogId').value = b.id;
      document.getElementById('blogTitle').value = b.title || '';
      document.getElementById('blogContent').value = b.content || '';
      blogImages = (b.images || []).map(function (img) { return img.image_url; });
      renderBlogPreviews();
      document.getElementById('blogModal').style.display = '';
    });
  }

  // =============================
  // NOTICES ADMIN
  // =============================
  function initNoticesAdmin() {
    document.getElementById('newNoticeBtn').addEventListener('click', function () {
      document.getElementById('noticeModalTitle').textContent = '새 공지사항';
      document.getElementById('noticeForm').reset();
      document.getElementById('noticeId').value = '';
      document.getElementById('noticeModal').style.display = '';
    });

    document.getElementById('noticeForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('noticeId').value;
      var payload = {
        title: document.getElementById('noticeTitle').value,
        content: document.getElementById('noticeContent').value,
        is_pinned: document.getElementById('noticePinned').checked
      };

      var url = id ? '/api/admin/notices/' + id : '/api/admin/notices';
      var method = id ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function () {
        document.getElementById('noticeModal').style.display = 'none';
        loadNotices();
      });
    });
  }

  function loadNotices() {
    fetch('/api/admin/notices').then(function (r) { return r.json(); }).then(function (data) {
      var list = document.getElementById('noticesList2');
      if (!data.notices || data.notices.length === 0) {
        list.innerHTML = '<div class="admin-empty">등록된 공지사항이 없습니다</div>';
        return;
      }
      list.innerHTML = '';
      data.notices.forEach(function (n) {
        var row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML =
          '<div class="admin-row-info">' +
            (n.is_pinned ? '<span class="admin-pin">📌</span>' : '') +
            '<h4>' + (n.title || '(제목 없음)') + '</h4>' +
            '<span class="admin-meta">조회 ' + (n.views || 0) + ' · ' + formatDate(n.created_at) + '</span>' +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button class="btn-edit" data-edit-notice="' + n.id + '">수정</button>' +
            '<button class="btn-delete" data-del-notice="' + n.id + '">삭제</button>' +
          '</div>';
        list.appendChild(row);
      });

      list.querySelectorAll('[data-edit-notice]').forEach(function (btn) {
        btn.addEventListener('click', function () { editNotice(btn.dataset.editNotice, data.notices); });
      });

      list.querySelectorAll('[data-del-notice]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('이 공지를 삭제하시겠습니까?')) return;
          fetch('/api/admin/notices/' + btn.dataset.delNotice, { method: 'DELETE' }).then(function () { loadNotices(); });
        });
      });
    });
  }

  function editNotice(id, allNotices) {
    var n = allNotices.find(function (x) { return x.id == id; });
    if (!n) return;
    document.getElementById('noticeModalTitle').textContent = '공지 수정';
    document.getElementById('noticeId').value = n.id;
    document.getElementById('noticeTitle').value = n.title || '';
    document.getElementById('noticeContent').value = n.content || '';
    document.getElementById('noticePinned').checked = !!n.is_pinned;
    document.getElementById('noticeModal').style.display = '';
  }

  // =============================
  // FAQ ADMIN
  // =============================
  var faqCategories = [];

  function initFaqAdmin() {
    document.getElementById('newFaqBtn').addEventListener('click', function () {
      document.getElementById('faqModalTitle').textContent = '새 FAQ 등록';
      document.getElementById('faqForm').reset();
      document.getElementById('faqId').value = '';
      document.getElementById('faqSortOrder').value = '0';
      document.getElementById('faqModal').style.display = '';
    });

    document.getElementById('faqForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var id = document.getElementById('faqId').value;
      var payload = {
        category_id: parseInt(document.getElementById('faqCategory').value),
        question: document.getElementById('faqQuestion').value,
        answer: document.getElementById('faqAnswer').value,
        sort_order: parseInt(document.getElementById('faqSortOrder').value) || 0
      };

      var url = id ? '/api/admin/faq/' + id : '/api/admin/faq';
      var method = id ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function () {
        document.getElementById('faqModal').style.display = 'none';
        loadFaq();
      });
    });
  }

  function loadFaq() {
    fetch('/api/admin/faq').then(function (r) { return r.json(); }).then(function (data) {
      faqCategories = data.categories || [];
      populateFaqCategorySelect();

      var list = document.getElementById('faqList');
      if (!data.faqs || data.faqs.length === 0) {
        list.innerHTML = '<div class="admin-empty">등록된 FAQ가 없습니다</div>';
        return;
      }

      var grouped = {};
      data.faqs.forEach(function (f) {
        var cat = f.category_name || '미분류';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(f);
      });

      list.innerHTML = '';
      Object.keys(grouped).forEach(function (catName) {
        var catHeader = document.createElement('div');
        catHeader.className = 'admin-section-header';
        catHeader.innerHTML = '<h3>' + catName + ' <span class="admin-meta">(' + grouped[catName].length + ')</span></h3>';
        list.appendChild(catHeader);

        grouped[catName].forEach(function (f) {
          var row = document.createElement('div');
          row.className = 'admin-row';
          row.innerHTML =
            '<div class="admin-row-info" style="flex:1">' +
              '<h4>Q. ' + (f.question || '') + '</h4>' +
              '<span class="admin-meta">조회 ' + (f.views || 0) + ' \u00b7 순서 ' + f.sort_order + '</span>' +
            '</div>' +
            '<div class="admin-row-actions">' +
              '<button class="btn-edit" data-edit-faq="' + f.id + '">수정</button>' +
              '<button class="btn-delete" data-del-faq="' + f.id + '">삭제</button>' +
            '</div>';
          list.appendChild(row);
        });
      });

      list.querySelectorAll('[data-edit-faq]').forEach(function (btn) {
        btn.addEventListener('click', function () { editFaq(btn.dataset.editFaq, data.faqs); });
      });

      list.querySelectorAll('[data-del-faq]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('이 FAQ를 삭제하시겠습니까?')) return;
          fetch('/api/admin/faq/' + btn.dataset.delFaq, { method: 'DELETE' }).then(function () { loadFaq(); });
        });
      });
    });
  }

  function populateFaqCategorySelect() {
    var sel = document.getElementById('faqCategory');
    sel.innerHTML = '';
    faqCategories.forEach(function (cat) {
      var opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.name;
      sel.appendChild(opt);
    });
  }

  function editFaq(id, allFaqs) {
    var f = allFaqs.find(function (x) { return x.id == id; });
    if (!f) return;
    document.getElementById('faqModalTitle').textContent = 'FAQ 수정';
    document.getElementById('faqId').value = f.id;
    document.getElementById('faqCategory').value = f.category_id;
    document.getElementById('faqQuestion').value = f.question || '';
    document.getElementById('faqAnswer').value = f.answer || '';
    document.getElementById('faqSortOrder').value = f.sort_order || 0;
    document.getElementById('faqModal').style.display = '';
  }

})();
