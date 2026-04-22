/* ============================================
   이음치과 — Admin Dashboard Scripts v2
   Dashboard Stats, Cases (expanded), Blog (SEO + author),
   Notices (images + thumbnail), FAQ, Users CRUD,
   Region autocomplete
   ============================================ */
(function () {
  'use strict';

  var doctors = [];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    checkAuth();
    initLogin();
    initLogout();
    initTabs();
    initModals();
    loadDoctors(function () {
      initCasesAdmin();
      initBlogsAdmin();
      initNoticesAdmin();
      initFaqAdmin();
      initUsersAdmin();
      initRegionAutocomplete();
    });
  }

  // === Load doctors for dropdowns ===
  function loadDoctors(callback) {
    fetch('/api/doctors').then(function (r) { return r.json(); }).then(function (data) {
      doctors = data.doctors || [];
      // Populate case doctor select
      var caseSel = document.getElementById('caseDoctorId');
      if (caseSel) {
        doctors.forEach(function (d) {
          var opt = document.createElement('option');
          opt.value = d.id;
          opt.textContent = d.name + ' ' + d.title;
          caseSel.appendChild(opt);
        });
      }
      // Populate blog author select
      var blogSel = document.getElementById('blogAuthor');
      if (blogSel) {
        doctors.forEach(function (d) {
          var opt = document.createElement('option');
          opt.value = d.name;
          opt.textContent = d.name + ' ' + d.title;
          blogSel.appendChild(opt);
        });
      }
      callback();
    }).catch(function () { callback(); });
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
    loadStats();
    loadCases();
    loadBlogs();
    loadNotices();
    loadFaq();
    loadUsers();
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

  // === Upload helpers ===
  // 업로드 진행 중인 파일 카운터 (폼 저장 시 대기 용도)
  window.__uploadingCount = 0;

  function uploadFile(file) {
    window.__uploadingCount++;
    var fd = new FormData();
    fd.append('file', file);
    return fetch('/api/upload', { method: 'POST', body: fd })
      .then(function (r) {
        if (!r.ok) throw new Error('업로드 실패 (HTTP ' + r.status + ')');
        return r.json();
      })
      .then(function (data) {
        if (!data || !data.url) throw new Error('업로드 응답 오류');
        return data;
      })
      .finally(function () {
        window.__uploadingCount = Math.max(0, window.__uploadingCount - 1);
      });
  }

  function uploadMulti(files) {
    window.__uploadingCount++;
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }
    return fetch('/api/upload/multi', { method: 'POST', body: fd })
      .then(function (r) {
        if (!r.ok) throw new Error('업로드 실패 (HTTP ' + r.status + ')');
        return r.json();
      })
      .finally(function () {
        window.__uploadingCount = Math.max(0, window.__uploadingCount - 1);
      });
  }

  // 모든 업로드가 끝날 때까지 대기 (폼 저장 직전 호출)
  function waitForUploads() {
    return new Promise(function (resolve) {
      if (window.__uploadingCount === 0) return resolve();
      var checkInterval = setInterval(function () {
        if (window.__uploadingCount === 0) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      // 최대 60초 타임아웃
      setTimeout(function () {
        clearInterval(checkInterval);
        resolve();
      }, 60000);
    });
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
  // REGION AUTOCOMPLETE
  // =============================
  function initRegionAutocomplete() {
    var input = document.getElementById('caseRegionInput');
    var suggestions = document.getElementById('regionSuggestions');
    var hiddenField = document.getElementById('caseRegionText');
    if (!input || !suggestions) return;

    var debounceTimer = null;

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var q = input.value.trim();
      if (q.length < 1) {
        suggestions.style.display = 'none';
        return;
      }
      debounceTimer = setTimeout(function () {
        fetch('/api/regions/autocomplete?q=' + encodeURIComponent(q))
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var regions = data.regions || [];
            if (regions.length === 0) {
              suggestions.style.display = 'none';
              return;
            }
            suggestions.innerHTML = '';
            regions.forEach(function (r) {
              var item = document.createElement('div');
              item.className = 'region-suggestion-item';
              item.textContent = r.full_address;
              item.addEventListener('click', function () {
                input.value = r.full_address;
                hiddenField.value = r.full_address;
                suggestions.style.display = 'none';
              });
              suggestions.appendChild(item);
            });
            suggestions.style.display = '';
          });
      }, 200);
    });

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!suggestions.contains(e.target) && e.target !== input) {
        suggestions.style.display = 'none';
      }
    });

    // Allow manual entry (fallback if no suggestion picked)
    input.addEventListener('change', function () {
      hiddenField.value = input.value;
    });
  }

  // =============================
  // DASHBOARD STATS
  // =============================
  function loadStats() {
    fetch('/api/admin/stats').then(function (r) { return r.json(); }).then(function (s) {
      document.getElementById('statUsers').textContent = s.users || 0;
      document.getElementById('statRecent').textContent = s.users_recent_7d || 0;
      document.getElementById('statMarketing').textContent = s.users_marketing || 0;
      document.getElementById('statCases').textContent = s.cases || 0;
      document.getElementById('statBlogs').textContent = s.blogs || 0;
      document.getElementById('statViews').textContent = ((s.case_views || 0) + (s.blog_views || 0)).toLocaleString();
    }).catch(function () {});
  }

  // =============================
  // CASES ADMIN (Expanded fields)
  // =============================
  function initCasesAdmin() {
    document.getElementById('newCaseBtn').addEventListener('click', function () {
      document.getElementById('caseModalTitle').textContent = '새 케이스 등록';
      document.getElementById('caseForm').reset();
      document.getElementById('caseId').value = '';
      document.getElementById('caseRegionInput').value = '';
      document.getElementById('caseRegionText').value = '';
      clearCasePreviews();
      document.getElementById('caseModal').style.display = '';
    });

    // File inputs - 업로드 진행상태 표시 + 에러처리
    document.querySelectorAll('.case-file-input').forEach(function (input) {
      input.addEventListener('change', function () {
        if (!this.files[0]) return;
        var target = this.dataset.target;
        var preview = document.getElementById('preview-' + target);
        // 업로드 시작: 로딩 UI 표시
        preview.innerHTML = '<div class="upload-loading"><span class="spinner"></span><span>업로드 중…</span></div>';
        var fileInput = this;
        uploadFile(this.files[0])
          .then(function (data) {
            document.getElementById('val-' + target).value = data.url;
            preview.innerHTML = '<img src="' + data.url + '" /><button type="button" class="remove-img" onclick="this.parentElement.innerHTML=\'\';document.getElementById(\'val-' + target + '\').value=\'\'">&times;</button>';
          })
          .catch(function (err) {
            preview.innerHTML = '<div class="upload-error">❌ 업로드 실패<br><small>' + (err.message || '다시 시도해주세요') + '</small></div>';
            fileInput.value = '';
            alert('사진 업로드에 실패했습니다: ' + (err.message || '네트워크 오류') + '\n다시 시도해주세요.');
          });
      });
    });

    // Form submit with expanded fields - 업로드 완료 대기 + 검증 + 에러처리
    document.getElementById('caseForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = this.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';

      // 업로드 중이면 대기 안내
      if (window.__uploadingCount > 0) {
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '업로드 완료 대기 중…'; }
      }

      waitForUploads().then(function () {
        var id = document.getElementById('caseId').value;
        var payload = {
          title: document.getElementById('caseTitle').value,
          category: document.getElementById('caseCategory').value,
          description: document.getElementById('caseDesc').value,
          pano_before: document.getElementById('val-pano_before').value || null,
          pano_after: document.getElementById('val-pano_after').value || null,
          intra_before: document.getElementById('val-intra_before').value || null,
          intra_after: document.getElementById('val-intra_after').value || null,
          patient_age_group: document.getElementById('caseAgeGroup').value || '',
          patient_gender: document.getElementById('caseGender').value || '',
          treatment_duration: document.getElementById('caseDuration').value || '',
          doctor_id: document.getElementById('caseDoctorId').value || null,
          region_text: document.getElementById('caseRegionText').value || document.getElementById('caseRegionInput').value || '',
        };

        // 제목 검증
        if (!payload.title || !payload.title.trim()) {
          alert('제목을 입력해주세요.');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
          return;
        }

        // 이미지가 하나도 없으면 경고 (저장은 가능)
        var hasImage = payload.pano_before || payload.pano_after || payload.intra_before || payload.intra_after;
        if (!hasImage && !id) {
          if (!confirm('사진이 등록되지 않았습니다. 그래도 저장하시겠습니까?')) {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            return;
          }
        }

        var url = id ? '/api/admin/cases/' + id : '/api/admin/cases';
        var method = id ? 'PUT' : 'POST';

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '저장 중…'; }

        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (r) {
            if (!r.ok) throw new Error('저장 실패 (HTTP ' + r.status + ')');
            return r.json();
          })
          .then(function () {
            document.getElementById('caseModal').style.display = 'none';
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            loadCases();
            loadStats();
            // 성공 피드백
            showToast('✅ 케이스가 저장되었습니다');
          })
          .catch(function (err) {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            alert('저장 실패: ' + (err.message || '알 수 없는 오류') + '\n\n입력한 내용은 유지되니 다시 시도해주세요.');
          });
      });
    });
  }

  // Toast 알림 (성공/실패 피드백)
  function showToast(msg) {
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#1b3a5c;color:#fff;padding:14px 24px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:99999;font-weight:500;font-size:14px;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.style.transition = 'opacity 0.3s'; toast.style.opacity = '0'; }, 2500);
    setTimeout(function() { toast.remove(); }, 3000);
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
        var imgCount = [c.pano_before, c.pano_after, c.intra_before, c.intra_after].filter(Boolean).length;

        var metaParts = [];
        if (c.patient_age_group) metaParts.push(c.patient_age_group);
        if (c.patient_gender) metaParts.push(c.patient_gender === 'M' ? '남' : c.patient_gender === 'F' ? '여' : c.patient_gender);
        if (c.doctor_name) metaParts.push(c.doctor_name);
        if (c.region_text) metaParts.push(c.region_text);

        var row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML =
          '<div class="admin-row-thumb">' + (thumb ? '<img src="' + thumb + '"/>' : '') + '</div>' +
          '<div class="admin-row-info">' +
            '<h4>' + (c.title || '(제목 없음)') + '</h4>' +
            '<span class="admin-tag">' + categoryLabel(c.category) + '</span>' +
            '<span class="admin-meta">사진 ' + imgCount + '장 · 조회 ' + (c.views || 0) + ' · ' + formatDate(c.created_at) + '</span>' +
            (metaParts.length > 0 ? '<span class="admin-meta">' + metaParts.join(' · ') + '</span>' : '') +
          '</div>' +
          '<div class="admin-row-actions">' +
            '<button class="btn-edit" data-edit-case="' + c.id + '">수정</button>' +
            '<button class="btn-delete" data-del-case="' + c.id + '">삭제</button>' +
          '</div>';
        list.appendChild(row);
      });

      list.querySelectorAll('[data-edit-case]').forEach(function (btn) {
        btn.addEventListener('click', function () { editCase(btn.dataset.editCase, data.cases); });
      });

      list.querySelectorAll('[data-del-case]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!confirm('이 케이스를 삭제하시겠습니까?')) return;
          fetch('/api/admin/cases/' + btn.dataset.delCase, { method: 'DELETE' }).then(function () { loadCases(); loadStats(); });
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
    document.getElementById('caseAgeGroup').value = c.patient_age_group || '';
    document.getElementById('caseGender').value = c.patient_gender || '';
    document.getElementById('caseDuration').value = c.treatment_duration || '';
    document.getElementById('caseDoctorId').value = c.doctor_id || '';
    document.getElementById('caseRegionInput').value = c.region_text || '';
    document.getElementById('caseRegionText').value = c.region_text || '';

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
  // BLOGS ADMIN (SEO Enhanced + Author)
  // =============================
  var blogImages = [];

  function initBlogsAdmin() {
    document.getElementById('newBlogBtn').addEventListener('click', function () {
      document.getElementById('blogModalTitle').textContent = '새 블로그 글';
      document.getElementById('blogForm').reset();
      document.getElementById('blogId').value = '';
      blogImages = [];
      renderBlogPreviews();
      updateCharCounts();
      document.getElementById('seoFields').style.display = 'none';
      document.getElementById('blogModal').style.display = '';
    });

    // SEO toggle
    var seoToggle = document.getElementById('seoToggle');
    if (seoToggle) {
      seoToggle.addEventListener('click', function () {
        var fields = document.getElementById('seoFields');
        var isHidden = fields.style.display === 'none';
        fields.style.display = isHidden ? '' : 'none';
        seoToggle.textContent = isHidden ? 'SEO 설정 ▲' : 'SEO 설정 ▼';
      });
    }

    // Char counts
    var titleInput = document.getElementById('blogTitle');
    var metaDescInput = document.getElementById('blogMetaDesc');
    if (titleInput) titleInput.addEventListener('input', updateCharCounts);
    if (metaDescInput) metaDescInput.addEventListener('input', updateCharCounts);

    // Editor toolbar
    var toolbar = document.getElementById('editorToolbar');
    if (toolbar) {
      toolbar.addEventListener('click', function (e) {
        var btn = e.target.closest('.toolbar-btn');
        if (!btn) return;
        var cmd = btn.dataset.cmd;
        var textarea = document.getElementById('blogContent');
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        var text = textarea.value;
        var selected = text.substring(start, end);

        var insert = '';
        switch (cmd) {
          case 'h2': insert = '\n## ' + (selected || '소제목을 입력하세요') + '\n'; break;
          case 'h3': insert = '\n### ' + (selected || '하위 제목') + '\n'; break;
          case 'bold': insert = '**' + (selected || '굵은 텍스트') + '**'; break;
          case 'ul': insert = '\n- ' + (selected || '목록 항목') + '\n'; break;
          case 'img':
            var fileInput = document.getElementById('blogFiles');
            if (fileInput) fileInput.click();
            return;
          case 'hr': insert = '\n---\n'; break;
        }

        textarea.value = text.substring(0, start) + insert + text.substring(end);
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + insert.length;
      });
    }

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
      var submitBtn = this.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (window.__uploadingCount > 0 && submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '업로드 완료 대기 중…';
      }

      waitForUploads().then(function () {
        var id = document.getElementById('blogId').value;

        var rawContent = document.getElementById('blogContent').value;
        var contentHtml = markdownToHtml(rawContent);

        var authorSel = document.getElementById('blogAuthor');
        var authorName = authorSel ? authorSel.value : '';
        var doctorId = null;
        if (authorName) {
          var found = doctors.find(function (d) { return d.name === authorName; });
          if (found) doctorId = found.id;
        }

        var payload = {
          title: document.getElementById('blogTitle').value,
          content: rawContent,
          content_html: contentHtml,
          thumbnail: blogImages.length > 0 ? blogImages[0] : null,
          images: blogImages,
          meta_title: document.getElementById('blogMetaTitle').value || null,
          meta_description: document.getElementById('blogMetaDesc').value || null,
          slug: document.getElementById('blogSlug').value || null,
          author_name: authorName || '최효영',
          doctor_id: doctorId
        };

        if (!payload.title || !payload.title.trim()) {
          alert('제목을 입력해주세요.');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
          return;
        }

        var url = id ? '/api/admin/blogs/' + id : '/api/admin/blogs';
        var method = id ? 'PUT' : 'POST';

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '저장 중…'; }

        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (r) {
            if (!r.ok) throw new Error('저장 실패 (HTTP ' + r.status + ')');
            return r.json();
          })
          .then(function () {
            document.getElementById('blogModal').style.display = 'none';
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            loadBlogs();
            loadStats();
            showToast('✅ 블로그가 저장되었습니다');
          })
          .catch(function (err) {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            alert('저장 실패: ' + (err.message || '알 수 없는 오류'));
          });
      });
    });
  }

  function updateCharCounts() {
    var titleInput = document.getElementById('blogTitle');
    var metaDescInput = document.getElementById('blogMetaDesc');
    var titleCount = document.getElementById('titleCount');
    var metaDescCount = document.getElementById('metaDescCount');

    if (titleInput && titleCount) {
      var len = titleInput.value.length;
      titleCount.textContent = len + '/60자';
      titleCount.style.color = len > 60 ? '#e74c3c' : '';
    }
    if (metaDescInput && metaDescCount) {
      var len2 = metaDescInput.value.length;
      metaDescCount.textContent = len2 + '/150자';
      metaDescCount.style.color = len2 > 150 ? '#e74c3c' : '';
    }
  }

  function markdownToHtml(md) {
    if (!md) return '';
    var html = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^---$/gm, '<hr/>')
      .replace(/^- (.+)$/gm, '<li>$1</li>');

    html = html.replace(/(<li>.*<\/li>\n?)+/g, function (match) {
      return '<ul>' + match + '</ul>';
    });

    var lines = html.split('\n');
    var result = [];
    lines.forEach(function (line) {
      var trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<hr') || trimmed.startsWith('<li')) {
        result.push(trimmed);
      } else {
        result.push('<p>' + trimmed + '</p>');
      }
    });

    return result.join('\n');
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
        (i === 0 ? '<span class="thumb-badge">썸네일</span>' : '<span class="img-order-badge">' + (i + 1) + '</span>');
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
            '<span class="admin-meta">' +
              (b.author_name ? b.author_name + ' · ' : '') +
              '조회 ' + (b.views || 0) + ' · ' + formatDate(b.created_at) +
              (b.slug ? ' · /' + b.slug : '') + '</span>' +
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
          fetch('/api/admin/blogs/' + btn.dataset.delBlog, { method: 'DELETE' }).then(function () { loadBlogs(); loadStats(); });
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
      document.getElementById('blogMetaTitle').value = b.meta_title || '';
      document.getElementById('blogMetaDesc').value = b.meta_description || '';
      document.getElementById('blogSlug').value = b.slug || '';
      var authorSel = document.getElementById('blogAuthor');
      if (authorSel) authorSel.value = b.author_name || '';
      blogImages = (b.images || []).map(function (img) { return img.image_url; });
      renderBlogPreviews();
      updateCharCounts();
      document.getElementById('blogModal').style.display = '';
    });
  }

  // =============================
  // NOTICES ADMIN (with images + thumbnail)
  // =============================
  var noticeImages = [];

  function initNoticesAdmin() {
    document.getElementById('newNoticeBtn').addEventListener('click', function () {
      document.getElementById('noticeModalTitle').textContent = '새 공지사항';
      document.getElementById('noticeForm').reset();
      document.getElementById('noticeId').value = '';
      document.getElementById('noticeThumbVal').value = '';
      document.getElementById('noticeThumbPreview').innerHTML = '';
      noticeImages = [];
      renderNoticePreviews();
      document.getElementById('noticeModal').style.display = '';
    });

    // Thumbnail upload
    var thumbBtn = document.getElementById('noticeThumbBtn');
    var thumbFile = document.getElementById('noticeThumbFile');
    if (thumbBtn && thumbFile) {
      thumbBtn.addEventListener('click', function () { thumbFile.click(); });
      thumbFile.addEventListener('change', function () {
        if (!this.files[0]) return;
        uploadFile(this.files[0]).then(function (data) {
          document.getElementById('noticeThumbVal').value = data.url;
          document.getElementById('noticeThumbPreview').innerHTML = '<img src="' + data.url + '" />';
        });
      });
    }

    // Image dropzone
    var dz = document.getElementById('noticeDropzone');
    var fileInput = document.getElementById('noticeFiles');
    if (dz && fileInput) {
      dz.addEventListener('click', function () { fileInput.click(); });
      dz.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('dragover'); });
      dz.addEventListener('dragleave', function () { dz.classList.remove('dragover'); });
      dz.addEventListener('drop', function (e) {
        e.preventDefault();
        dz.classList.remove('dragover');
        handleNoticeFiles(e.dataTransfer.files);
      });
      fileInput.addEventListener('change', function () { handleNoticeFiles(this.files); this.value = ''; });
    }

    document.getElementById('noticeForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = this.querySelector('button[type="submit"]');
      var originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (window.__uploadingCount > 0 && submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '업로드 완료 대기 중…';
      }

      waitForUploads().then(function () {
        var id = document.getElementById('noticeId').value;
        var payload = {
          title: document.getElementById('noticeTitle').value,
          content: document.getElementById('noticeContent').value,
          is_pinned: document.getElementById('noticePinned').checked,
          thumbnail: document.getElementById('noticeThumbVal').value || null,
          images: noticeImages
        };

        if (!payload.title || !payload.title.trim()) {
          alert('제목을 입력해주세요.');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
          return;
        }

        var url = id ? '/api/admin/notices/' + id : '/api/admin/notices';
        var method = id ? 'PUT' : 'POST';

        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '저장 중…'; }

        fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (r) {
            if (!r.ok) throw new Error('저장 실패 (HTTP ' + r.status + ')');
            return r.json();
          })
          .then(function () {
            document.getElementById('noticeModal').style.display = 'none';
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            loadNotices();
            loadStats();
            showToast('✅ 공지사항이 저장되었습니다');
          })
          .catch(function (err) {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText; }
            alert('저장 실패: ' + (err.message || '알 수 없는 오류'));
          });
      });
    });
  }

  function handleNoticeFiles(files) {
    if (!files || files.length === 0) return;
    var arr = Array.from(files);
    uploadMulti(arr).then(function (data) {
      data.files.forEach(function (f) { noticeImages.push(f.url); });
      renderNoticePreviews();
    });
  }

  function renderNoticePreviews() {
    var grid = document.getElementById('noticePreviewGrid');
    if (!grid) return;
    grid.innerHTML = '';
    noticeImages.forEach(function (url, i) {
      var item = document.createElement('div');
      item.className = 'blog-preview-item';
      item.innerHTML = '<img src="' + url + '" /><button type="button" class="remove-img" data-remove-notice="' + i + '">&times;</button>';
      grid.appendChild(item);
    });
    grid.querySelectorAll('[data-remove-notice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        noticeImages.splice(parseInt(btn.dataset.removeNotice), 1);
        renderNoticePreviews();
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
          '<div class="admin-row-thumb">' + (n.thumbnail ? '<img src="' + n.thumbnail + '"/>' : '') + '</div>' +
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
          fetch('/api/admin/notices/' + btn.dataset.delNotice, { method: 'DELETE' }).then(function () { loadNotices(); loadStats(); });
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
    document.getElementById('noticeThumbVal').value = n.thumbnail || '';
    document.getElementById('noticeThumbPreview').innerHTML = n.thumbnail ? '<img src="' + n.thumbnail + '" />' : '';
    noticeImages = [];
    renderNoticePreviews();
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

  // =============================
  // USERS ADMIN
  // =============================
  var usersPage = 1;

  function initUsersAdmin() {
    var loadMoreBtn = document.getElementById('usersLoadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function () {
        usersPage++;
        loadUsers(true);
      });
    }
  }

  function loadUsers(append) {
    fetch('/api/admin/users?page=' + usersPage + '&limit=30').then(function (r) { return r.json(); }).then(function (data) {
      var list = document.getElementById('usersList');
      var countEl = document.getElementById('usersCount');

      if (countEl) countEl.textContent = '총 ' + (data.total || 0) + '명';

      if (!data.users || data.users.length === 0) {
        if (!append) list.innerHTML = '<div class="admin-empty">가입한 회원이 없습니다</div>';
        return;
      }

      if (!append) list.innerHTML = '';

      data.users.forEach(function (u) {
        var row = document.createElement('div');
        row.className = 'admin-row';
        row.innerHTML =
          '<div class="admin-row-info" style="flex:1">' +
            '<h4>' + (u.name || '') + ' <span class="admin-meta">' + formatPhone(u.phone) + '</span></h4>' +
            '<span class="admin-meta">' +
              (u.email ? u.email + ' · ' : '') +
              '가입 ' + formatDate(u.created_at) +
              (u.last_login_at ? ' · 최근 로그인 ' + formatDate(u.last_login_at) : '') +
            '</span>' +
            '<div class="user-consent-tags">' +
              (u.agree_marketing ? '<span class="consent-tag marketing">마케팅 ✓</span>' : '') +
              (u.agree_marketing_sms ? '<span class="consent-tag">SMS ✓</span>' : '') +
              (u.agree_marketing_email ? '<span class="consent-tag">이메일 ✓</span>' : '') +
              (u.agree_third_party ? '<span class="consent-tag">제3자 ✓</span>' : '') +
            '</div>' +
          '</div>';
        list.appendChild(row);
      });

      var loadMore = document.getElementById('usersLoadMore');
      if (loadMore) {
        loadMore.style.display = (data.total > usersPage * 30) ? '' : 'none';
      }
    }).catch(function () {});
  }

  function formatPhone(phone) {
    if (!phone) return '';
    if (phone.length === 11) return phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7);
    if (phone.length === 10) return phone.slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6);
    return phone;
  }

})();
