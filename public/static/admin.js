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
    fetch('/api/admin/check', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) {
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
      fetch('/api/admin/logout', { method: 'POST', cache: 'no-store' }).then(function () { showLogin(); });
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
    fetch('/api/admin/stats', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (s) {
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
    fetch('/api/admin/cases', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (data) {
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

  // 에디터 상태
  var blogUndoStack = [];
  var blogRedoStack = [];
  var blogUndoTimer = null;
  var blogAutosaveTimer = null;
  var blogPreviewTimer = null;
  var BLOG_DRAFT_KEY = 'ieum_blog_draft_v1';

  function openNewBlogModal() {
    document.getElementById('blogModalTitle').textContent = '새 블로그 글';
    document.getElementById('blogForm').reset();
    document.getElementById('blogId').value = '';
    blogImages = [];
    blogUndoStack = [];
    blogRedoStack = [];
    renderBlogPreviews();
    updateCharCounts();
    document.getElementById('seoFields').style.display = 'none';
    document.getElementById('blogModal').style.display = '';
    // 사이드바 active 초기화
    renderEditorSidebar(
      (document.getElementById('editorSidebarSearch') || {}).value || ''
    );
    // 초안 복원 여부 물어보기
    tryRestoreDraft();
    setTimeout(function () {
      updatePreview();
      updateStatusBar();
      setEditorViewMode('split');
    }, 50);
  }

  function initBlogsAdmin() {
    document.getElementById('newBlogBtn').addEventListener('click', openNewBlogModal);

    // 사이드바 + 새 글 버튼
    var sidebarNewBtn = document.getElementById('sidebarNewBlog');
    if (sidebarNewBtn) sidebarNewBtn.addEventListener('click', openNewBlogModal);

    // 사이드바 검색
    var sidebarSearch = document.getElementById('editorSidebarSearch');
    if (sidebarSearch) {
      sidebarSearch.addEventListener('input', function () {
        renderEditorSidebar(sidebarSearch.value);
      });
    }

    // 사이드바 접기 토글
    var sidebarToggle = document.getElementById('editorSidebarToggle');
    var sidebar = document.getElementById('editorSidebar');
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', function () {
        // 모바일은 expanded 토글, 데스크탑은 collapsed 토글
        if (window.matchMedia('(max-width: 900px)').matches) {
          sidebar.classList.toggle('expanded');
        } else {
          sidebar.classList.toggle('collapsed');
        }
      });
    }

    // SEO toggle
    var seoToggle = document.getElementById('seoToggle');
    if (seoToggle) {
      seoToggle.addEventListener('click', function () {
        var fields = document.getElementById('seoFields');
        var isHidden = fields.style.display === 'none';
        fields.style.display = isHidden ? '' : 'none';
        seoToggle.textContent = isHidden ? '⚙ SEO 고급 ▲' : '⚙ SEO 고급 ▼';
      });
    }

    // 뷰 모드 전환 (분할 / 편집만 / 미리보기만)
    document.querySelectorAll('.editor-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setEditorViewMode(btn.dataset.view);
      });
    });

    // 초안 삭제 버튼
    var clearDraftBtn = document.getElementById('clearDraftBtn');
    if (clearDraftBtn) {
      clearDraftBtn.addEventListener('click', function () {
        if (!confirm('자동저장된 초안을 삭제할까요?')) return;
        try { localStorage.removeItem(BLOG_DRAFT_KEY); } catch (e) {}
        setAutosaveLabel('초안 삭제됨', 'warn');
      });
    }

    // Char counts
    var titleInput = document.getElementById('blogTitle');
    var metaDescInput = document.getElementById('blogMetaDesc');
    if (titleInput) titleInput.addEventListener('input', function () { updateCharCounts(); scheduleAutosave(); updateSeoScore(); });
    if (metaDescInput) metaDescInput.addEventListener('input', function () { updateCharCounts(); scheduleAutosave(); updateSeoScore(); });
    var slugInput = document.getElementById('blogSlug');
    if (slugInput) slugInput.addEventListener('input', scheduleAutosave);

    // Editor toolbar
    var toolbar = document.getElementById('editorToolbar');
    if (toolbar) {
      toolbar.addEventListener('click', function (e) {
        var btn = e.target.closest('.toolbar-btn');
        if (!btn) return;
        var cmd = btn.dataset.cmd;
        runEditorCommand(cmd, btn);
      });
    }

    // 본문 변경 감지 — 라이브 프리뷰 + 자동저장 + 상태바 + 언두 스냅샷
    var contentArea = document.getElementById('blogContent');
    if (contentArea) {
      // 최초 스냅샷
      pushUndoSnapshot(contentArea.value);

      contentArea.addEventListener('input', function () {
        schedulePreview();
        updateStatusBar();
        scheduleAutosave();
        scheduleUndoSnapshot();
        updateSeoScore();
      });

      // 키보드 단축키
      contentArea.addEventListener('keydown', function (e) {
        handleEditorShortcut(e, contentArea);
      });

      // 붙여넣기 이미지 지원
      contentArea.addEventListener('paste', function (e) {
        if (!e.clipboardData || !e.clipboardData.items) return;
        var items = e.clipboardData.items;
        var imageFiles = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].type && items[i].type.indexOf('image/') === 0) {
            var f = items[i].getAsFile();
            if (f) imageFiles.push(f);
          }
        }
        if (imageFiles.length > 0) {
          e.preventDefault();
          handleBlogFiles(imageFiles);
        }
      });

      // 탭 들여쓰기 지원 (Tab/Shift+Tab)
      contentArea.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          var ta = contentArea;
          var s = ta.selectionStart, ed = ta.selectionEnd;
          if (e.shiftKey) {
            // 이전 줄 시작에서 공백/탭 2개까지 제거
            var before = ta.value.substring(0, s).replace(/( {1,2}|\t)$/, '');
            ta.value = before + ta.value.substring(s);
            ta.selectionStart = ta.selectionEnd = before.length;
          } else {
            ta.value = ta.value.substring(0, s) + '  ' + ta.value.substring(ed);
            ta.selectionStart = ta.selectionEnd = s + 2;
          }
          schedulePreview();
        }
      });
    }

    // 링크 다이얼로그
    initLinkDialog();

    // editBlog 등 외부에서 호출할 수 있도록 노출
    window.__blogEditor = {
      updatePreview: updatePreview,
      updateStatusBar: updateStatusBar,
      updateSeoScore: updateSeoScore,
      setEditorViewMode: setEditorViewMode,
      pushUndoSnapshot: pushUndoSnapshot
    };

    // ─── 에디터 커맨드 실행기 ───
    function runEditorCommand(cmd, btn) {
      var textarea = document.getElementById('blogContent');
      if (!textarea) return;
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var text = textarea.value;
      var selected = text.substring(start, end);

      // 특수 커맨드 (insert 문자열이 아닌 액션)
      if (cmd === 'table') { openTablePicker(btn, textarea, start, end); return; }
      if (cmd === 'img') { var fi = document.getElementById('blogFiles'); if (fi) fi.click(); return; }
      if (cmd === 'link') { openLinkDialog(textarea, start, end, selected); return; }
      if (cmd === 'youtube') { openYoutubeDialog(textarea, start, end, selected); return; }
      if (cmd === 'undo') { doUndo(); return; }
      if (cmd === 'redo') { doRedo(); return; }
      if (cmd === 'toc') {
        insertAtCursor(textarea, '\n\n[[TOC]]\n\n');
        return;
      }

      var insert = '';
      var cursorShift = null; // null이면 insert.length 뒤
      switch (cmd) {
        case 'h2': insert = '\n## ' + (selected || '소제목') + '\n'; break;
        case 'h3': insert = '\n### ' + (selected || '하위 제목') + '\n'; break;
        case 'h4': insert = '\n#### ' + (selected || '세부 제목') + '\n'; break;
        case 'bold': insert = '**' + (selected || '굵은 텍스트') + '**'; break;
        case 'italic': insert = '*' + (selected || '기울임') + '*'; break;
        case 'strike': insert = '~~' + (selected || '취소선') + '~~'; break;
        case 'mark': insert = '==' + (selected || '형광펜') + '=='; break;
        case 'code': insert = '`' + (selected || '코드') + '`'; break;
        case 'ul': insert = '\n- ' + (selected || '목록 항목') + '\n'; break;
        case 'ol': insert = '\n1. ' + (selected || '첫 번째 항목') + '\n2. 두 번째 항목\n'; break;
        case 'task': insert = '\n- [ ] ' + (selected || '할 일') + '\n'; break;
        case 'quote': insert = '\n> ' + (selected || '인용문') + '\n'; break;
        case 'callout-info': insert = '\n:::info\n' + (selected || '알아두면 좋은 정보를 여기에 적으세요.') + '\n:::\n'; break;
        case 'callout-warn': insert = '\n:::warn\n' + (selected || '주의해야 할 내용을 적어주세요.') + '\n:::\n'; break;
        case 'callout-tip': insert = '\n:::tip\n' + (selected || '유용한 팁이나 조언을 적어주세요.') + '\n:::\n'; break;
        case 'hr': insert = '\n---\n'; break;
      }
      if (!insert) return;

      insertAtCursor(textarea, insert, start, end);
    }

    function insertAtCursor(textarea, insert, start, end) {
      if (typeof start === 'undefined') start = textarea.selectionStart;
      if (typeof end === 'undefined') end = textarea.selectionEnd;
      pushUndoSnapshot(textarea.value);
      var text = textarea.value;
      textarea.value = text.substring(0, start) + insert + text.substring(end);
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + insert.length;
      schedulePreview();
      updateStatusBar();
      scheduleAutosave();
      updateSeoScore();
    }

    // ─── 키보드 단축키 ───
    function handleEditorShortcut(e, textarea) {
      var isMac = /Mac/.test(navigator.platform);
      var mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      var key = (e.key || '').toLowerCase();

      // Ctrl+S — 저장
      if (key === 's') {
        e.preventDefault();
        var saveBtn = document.getElementById('blogSaveBtn');
        if (saveBtn) saveBtn.click();
        return;
      }
      // Ctrl+Z — 언두
      if (key === 'z' && !e.shiftKey) { e.preventDefault(); doUndo(); return; }
      // Ctrl+Shift+Z (or Ctrl+Y) — 리두
      if ((key === 'z' && e.shiftKey) || key === 'y') { e.preventDefault(); doRedo(); return; }
      // Ctrl+B — 굵게
      if (key === 'b') { e.preventDefault(); runEditorCommand('bold'); return; }
      // Ctrl+I — 기울임
      if (key === 'i') { e.preventDefault(); runEditorCommand('italic'); return; }
      // Ctrl+K — 링크
      if (key === 'k') { e.preventDefault(); runEditorCommand('link'); return; }
      // Ctrl+2/3/4 — 헤딩
      if (key === '2') { e.preventDefault(); runEditorCommand('h2'); return; }
      if (key === '3') { e.preventDefault(); runEditorCommand('h3'); return; }
      if (key === '4') { e.preventDefault(); runEditorCommand('h4'); return; }
      // Ctrl+Shift+P — 분할 뷰 토글
      if (key === 'p' && e.shiftKey) {
        e.preventDefault();
        var split = document.getElementById('editorSplit');
        var mode = split ? split.dataset.mode : 'split';
        setEditorViewMode(mode === 'split' ? 'edit' : 'split');
      }
    }

    // ─── 언두/리두 ───
    function pushUndoSnapshot(value) {
      if (blogUndoStack.length && blogUndoStack[blogUndoStack.length - 1] === value) return;
      blogUndoStack.push(value);
      if (blogUndoStack.length > 50) blogUndoStack.shift();
      blogRedoStack = [];
    }
    function scheduleUndoSnapshot() {
      clearTimeout(blogUndoTimer);
      blogUndoTimer = setTimeout(function () {
        var ta = document.getElementById('blogContent');
        if (ta) pushUndoSnapshot(ta.value);
      }, 600);
    }
    function doUndo() {
      var ta = document.getElementById('blogContent');
      if (!ta || blogUndoStack.length < 2) return;
      var current = blogUndoStack.pop();
      blogRedoStack.push(current);
      var prev = blogUndoStack[blogUndoStack.length - 1];
      ta.value = prev;
      schedulePreview();
      updateStatusBar();
    }
    function doRedo() {
      var ta = document.getElementById('blogContent');
      if (!ta || !blogRedoStack.length) return;
      var next = blogRedoStack.pop();
      blogUndoStack.push(next);
      ta.value = next;
      schedulePreview();
      updateStatusBar();
    }

    // ─── 라이브 프리뷰 ───
    function schedulePreview() {
      clearTimeout(blogPreviewTimer);
      blogPreviewTimer = setTimeout(updatePreview, 180);
    }
    function updatePreview() {
      var ta = document.getElementById('blogContent');
      var preview = document.getElementById('editorPreview');
      if (!ta || !preview) return;
      var raw = ta.value || '';
      if (!raw.trim()) {
        preview.innerHTML = '<p class="editor-preview-empty">글을 작성하면 여기에 미리보기가 나타납니다.</p>';
        return;
      }
      try {
        preview.innerHTML = markdownToHtml(raw);
        // 프리뷰 내 표에 드래그 핸들 + 드롭존 부착
        attachTableRowDragHandles(preview, ta);
      } catch (err) {
        preview.innerHTML = '<p class="editor-preview-error">미리보기 오류: ' + (err && err.message ? err.message : err) + '</p>';
      }
    }

    // ─── 표 행 드래그 재정렬 ───
    // 프리뷰 내 각 <tbody> <tr> 앞에 ⋮⋮ 핸들을 삽입, 드롭 시
    // textarea의 해당 표 블록에서 markdown 행 순서를 재작성한다.
    function attachTableRowDragHandles(previewEl, textarea) {
      var tables = previewEl.querySelectorAll('.md-table-wrap .md-table');
      tables.forEach(function (table, tableIndex) {
        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));
        rows.forEach(function (tr, rowIdx) {
          // 첫 칸에 드래그 핸들 삽입 (최초 1회만)
          if (tr.querySelector('.row-drag-handle')) return;
          var handle = document.createElement('td');
          handle.className = 'row-drag-handle';
          handle.setAttribute('draggable', 'true');
          handle.setAttribute('title', '드래그해서 행 순서를 바꿉니다');
          handle.innerHTML = '<span aria-hidden="true">⋮⋮</span>';
          tr.insertBefore(handle, tr.firstChild);

          tr.dataset.tableIndex = tableIndex;
          tr.dataset.rowIndex = rowIdx;

          handle.addEventListener('dragstart', function (e) {
            tr.classList.add('row-dragging');
            if (e.dataTransfer) {
              e.dataTransfer.effectAllowed = 'move';
              // Firefox 드래그 필수
              e.dataTransfer.setData('text/plain', 'row-' + tableIndex + '-' + rowIdx);
            }
            window.__dragRowCtx = { tableIndex: tableIndex, fromRow: rowIdx, tbody: tbody };
          });
          handle.addEventListener('dragend', function () {
            tr.classList.remove('row-dragging');
            tbody.querySelectorAll('.row-drop-target').forEach(function (x) { x.classList.remove('row-drop-target'); });
          });

          tr.addEventListener('dragover', function (e) {
            var ctx = window.__dragRowCtx;
            if (!ctx || ctx.tbody !== tbody) return;
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
            tbody.querySelectorAll('.row-drop-target').forEach(function (x) { x.classList.remove('row-drop-target'); });
            tr.classList.add('row-drop-target');
          });
          tr.addEventListener('dragleave', function () { tr.classList.remove('row-drop-target'); });

          tr.addEventListener('drop', function (e) {
            var ctx = window.__dragRowCtx;
            if (!ctx || ctx.tbody !== tbody) return;
            e.preventDefault();
            tr.classList.remove('row-drop-target');
            var fromIdx = ctx.fromRow;
            var toIdx = parseInt(tr.dataset.rowIndex, 10);
            if (isNaN(fromIdx) || isNaN(toIdx) || fromIdx === toIdx) return;
            reorderMarkdownTableRow(textarea, tableIndex, fromIdx, toIdx);
            window.__dragRowCtx = null;
          });
        });
      });
    }

    // textarea 원본 markdown의 N번째 표에서 행을 이동시킴
    function reorderMarkdownTableRow(textarea, tableIndex, fromIdx, toIdx) {
      var raw = textarea.value || '';
      var lines = raw.split('\n');

      // 모든 표 블록의 [시작라인, 끝라인, 데이터행 시작] 을 수집
      // 표 = 연속된 |...| 라인 그룹 중, 2번째 라인이 |---|... 형식
      var tables = [];
      var idx = 0;
      while (idx < lines.length) {
        var t = lines[idx].trim();
        if (t.charAt(0) === '|' && t.charAt(t.length - 1) === '|' && idx + 1 < lines.length) {
          var next = (lines[idx + 1] || '').trim();
          if (/^\|[\s:|-]+\|$/.test(next) && /-/.test(next)) {
            // 표 시작
            var start = idx;
            var dataStart = idx + 2;
            var end = dataStart;
            while (end < lines.length) {
              var lt = lines[end].trim();
              if (lt.charAt(0) === '|' && lt.charAt(lt.length - 1) === '|') end++;
              else break;
            }
            tables.push({ start: start, dataStart: dataStart, end: end });
            idx = end;
            continue;
          }
        }
        idx++;
      }

      if (tableIndex < 0 || tableIndex >= tables.length) return;
      var tbl = tables[tableIndex];
      var dataRows = lines.slice(tbl.dataStart, tbl.end);
      if (fromIdx < 0 || fromIdx >= dataRows.length || toIdx < 0 || toIdx >= dataRows.length) return;

      // 배열 재정렬 (splice 이동)
      var moved = dataRows.splice(fromIdx, 1)[0];
      dataRows.splice(toIdx, 0, moved);

      var newLines = lines.slice(0, tbl.dataStart).concat(dataRows).concat(lines.slice(tbl.end));
      pushUndoSnapshot(textarea.value);
      textarea.value = newLines.join('\n');
      schedulePreview();
      updateStatusBar();
      scheduleAutosave();
      showToast('📦 행 순서가 바뀌었습니다');
    }

    // ─── 뷰 모드 ───
    function setEditorViewMode(mode) {
      var split = document.getElementById('editorSplit');
      if (!split) return;
      split.dataset.mode = mode;
      document.querySelectorAll('.editor-view-btn').forEach(function (b) {
        if (b.dataset.view === mode) b.classList.add('active');
        else b.classList.remove('active');
      });
    }

    // ─── 상태바: 글자수, 단어수, 읽는 시간 ───
    function updateStatusBar() {
      var ta = document.getElementById('blogContent');
      if (!ta) return;
      var raw = ta.value || '';
      var chars = raw.length;
      var words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
      // 한국어는 평균 분당 500자, 이미지는 12초 추가
      var imgCount = (raw.match(/!\[[^\]]*\]\([^)]+\)/g) || []).length;
      var minutes = Math.max(1, Math.ceil(chars / 500 + imgCount * 0.2));
      var setText = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
      setText('statChars', chars.toLocaleString());
      setText('statWords', words.toLocaleString());
      setText('statReadTime', minutes + '분');
    }

    // ─── SEO 점수 (휴리스틱) ───
    function updateSeoScore() {
      var title = (document.getElementById('blogTitle') || {}).value || '';
      var desc = (document.getElementById('blogMetaDesc') || {}).value || '';
      var body = (document.getElementById('blogContent') || {}).value || '';
      var score = 0, total = 6;
      if (title.length >= 15 && title.length <= 60) score++;
      if (desc.length >= 70 && desc.length <= 150) score++;
      if (/^##\s/m.test(body)) score++;                       // H2 하나 이상
      if (body.length >= 500) score++;                         // 본문 500자 이상
      if (/!\[[^\]]*\]\([^)]+\)/.test(body)) score++;          // 이미지 1개 이상
      if (/\[[^\]]+\]\([^)]+\)/.test(body)) score++;           // 링크 1개 이상
      var dot = document.getElementById('seoDot');
      var txt = document.getElementById('seoScoreText');
      var rating;
      if (score >= 5) rating = { label: '우수', cls: 'good' };
      else if (score >= 3) rating = { label: '양호', cls: 'ok' };
      else rating = { label: '부족', cls: 'bad' };
      if (dot) dot.setAttribute('data-score', rating.cls);
      if (txt) txt.textContent = rating.label + ' (' + score + '/' + total + ')';
    }

    // ─── 자동저장 (localStorage) ───
    function scheduleAutosave() {
      clearTimeout(blogAutosaveTimer);
      setAutosaveLabel('저장 중…', 'saving');
      blogAutosaveTimer = setTimeout(doAutosave, 800);
    }
    function doAutosave() {
      try {
        var data = {
          id: (document.getElementById('blogId') || {}).value || '',
          title: (document.getElementById('blogTitle') || {}).value || '',
          content: (document.getElementById('blogContent') || {}).value || '',
          meta_title: (document.getElementById('blogMetaTitle') || {}).value || '',
          meta_description: (document.getElementById('blogMetaDesc') || {}).value || '',
          slug: (document.getElementById('blogSlug') || {}).value || '',
          author: (document.getElementById('blogAuthor') || {}).value || '',
          images: blogImages,
          savedAt: Date.now()
        };
        if (!data.title && !data.content) {
          setAutosaveLabel('', '');
          return;
        }
        localStorage.setItem(BLOG_DRAFT_KEY, JSON.stringify(data));
        var t = new Date();
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        setAutosaveLabel('자동저장됨 ' + pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds()), 'saved');
      } catch (e) {
        setAutosaveLabel('자동저장 실패', 'warn');
      }
    }
    function setAutosaveLabel(text, state) {
      var el = document.getElementById('autosaveIndicator');
      if (!el) return;
      el.textContent = text || '';
      el.setAttribute('data-state', state || '');
    }
    function tryRestoreDraft() {
      try {
        var raw = localStorage.getItem(BLOG_DRAFT_KEY);
        if (!raw) return;
        var d = JSON.parse(raw);
        if (!d || (!d.title && !d.content)) return;
        // 편집 중인 글이 아닌 '새 글' 상태에서만 복원 제안
        var curId = (document.getElementById('blogId') || {}).value || '';
        if (curId) return;
        var age = Math.round((Date.now() - (d.savedAt || 0)) / 60000);
        var label = age < 1 ? '방금 전' : (age < 60 ? age + '분 전' : (Math.floor(age / 60) + '시간 전'));
        if (!confirm('📝 ' + label + '에 자동저장된 초안이 있습니다.\n\n제목: ' + (d.title || '(없음)') + '\n\n이어서 작성할까요?\n(취소하면 새 글로 시작합니다)')) {
          localStorage.removeItem(BLOG_DRAFT_KEY);
          return;
        }
        if (d.title) document.getElementById('blogTitle').value = d.title;
        if (d.content) document.getElementById('blogContent').value = d.content;
        if (d.meta_title) document.getElementById('blogMetaTitle').value = d.meta_title;
        if (d.meta_description) document.getElementById('blogMetaDesc').value = d.meta_description;
        if (d.slug) document.getElementById('blogSlug').value = d.slug;
        if (d.images) blogImages = d.images.slice();
        renderBlogPreviews();
        updateCharCounts();
        setAutosaveLabel('초안 복원됨', 'saved');
      } catch (e) {}
    }

    // ─── 링크 삽입 다이얼로그 ───
    function initLinkDialog() {
      var cancelBtn = document.getElementById('linkDialogCancel');
      var closeBtn = document.getElementById('linkDialogClose');
      var insertBtn = document.getElementById('linkDialogInsert');
      if (cancelBtn) cancelBtn.addEventListener('click', closeLinkDialog);
      if (closeBtn) closeBtn.addEventListener('click', closeLinkDialog);
      if (insertBtn) insertBtn.addEventListener('click', commitLinkDialog);
    }
    var _linkCtx = null;
    function openLinkDialog(textarea, start, end, selected) {
      _linkCtx = { textarea: textarea, start: start, end: end };
      var dlg = document.getElementById('linkDialog');
      if (!dlg) return;
      var tIn = document.getElementById('linkDialogText');
      var uIn = document.getElementById('linkDialogUrl');
      if (tIn) tIn.value = selected || '';
      if (uIn) uIn.value = 'https://';
      dlg.style.display = 'flex';
      setTimeout(function () { (uIn || tIn).focus(); }, 50);
    }
    function closeLinkDialog() {
      var dlg = document.getElementById('linkDialog');
      if (dlg) dlg.style.display = 'none';
      _linkCtx = null;
    }
    function commitLinkDialog() {
      if (!_linkCtx) return;
      var text = (document.getElementById('linkDialogText') || {}).value || '';
      var url = (document.getElementById('linkDialogUrl') || {}).value || '';
      if (!url || url === 'https://') { alert('URL을 입력해주세요'); return; }
      var md = '[' + (text || url) + '](' + url + ')';
      var ta = _linkCtx.textarea, s = _linkCtx.start, e = _linkCtx.end;
      insertAtCursor(ta, md, s, e);
      closeLinkDialog();
    }

    // ─── YouTube 삽입 다이얼로그 ───
    function openYoutubeDialog(textarea, start, end, selected) {
      var url = window.prompt(
        '유튜브 URL을 붙여넣으세요\n\n예) https://youtu.be/dQw4w9WgXcQ\n예) https://www.youtube.com/watch?v=dQw4w9WgXcQ\n예) https://www.youtube.com/shorts/ABC123',
        selected && /youtu/.test(selected) ? selected : ''
      );
      if (!url) return;
      var vid = extractYouTubeId(url);
      if (!vid) {
        alert('❌ 유튜브 URL을 인식하지 못했어요.\nwatch?v=, youtu.be/, shorts/, embed/ 형식을 지원합니다.');
        return;
      }
      var caption = window.prompt('영상 설명(캡션)을 넣고 싶으면 입력하세요.\n(원장 특강, 환자 후기, 시술 영상 등 — 비워도 됩니다)', '');
      var md = '\n\n:::youtube https://www.youtube.com/watch?v=' + vid
        + (caption ? ' | ' + caption : '')
        + '\n:::\n\n';
      insertAtCursor(textarea, md, start, end);
    }

    function extractYouTubeId(url) {
      if (!url) return null;
      var s = String(url).trim();
      var patterns = [
        /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([\w-]{6,})/i,
        /youtu\.be\/([\w-]{6,})/i,
        /^([\w-]{11})$/
      ];
      for (var i = 0; i < patterns.length; i++) {
        var m = s.match(patterns[i]);
        if (m && m[1]) return m[1].split(/[?&#]/)[0];
      }
      return null;
    }
    // 외부 스코프에서도 쓰도록 노출
    window.__extractYouTubeId = extractYouTubeId;

    // ─── 표 크기 피커 ───
    function openTablePicker(anchorBtn, textarea, start, end) {
      var picker = document.getElementById('tablePicker');
      var grid = document.getElementById('tablePickerGrid');
      var sizeLabel = document.getElementById('tablePickerSize');
      var closeBtn = document.getElementById('tablePickerClose');
      if (!picker || !grid) return;

      var MAX_COLS = 10;
      var MAX_ROWS = 8;

      // 그리드 셀 빌드 (최초 한 번만)
      if (!grid.dataset.built) {
        for (var r = 1; r <= MAX_ROWS; r++) {
          for (var c = 1; c <= MAX_COLS; c++) {
            var cell = document.createElement('div');
            cell.className = 'table-picker-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            grid.appendChild(cell);
          }
        }
        grid.dataset.built = '1';
      }

      // 위치: 버튼 아래
      var rect = anchorBtn.getBoundingClientRect();
      picker.style.display = 'block';
      picker.style.position = 'fixed';
      picker.style.top = (rect.bottom + 6) + 'px';
      picker.style.left = rect.left + 'px';
      picker.style.zIndex = '10000';

      var currentRow = 1, currentCol = 1;

      function highlight(r, c) {
        currentRow = r; currentCol = c;
        sizeLabel.textContent = c + ' × ' + r;
        var cells = grid.querySelectorAll('.table-picker-cell');
        cells.forEach(function (cell) {
          var cr = parseInt(cell.dataset.row, 10);
          var cc = parseInt(cell.dataset.col, 10);
          if (cr <= r && cc <= c) cell.classList.add('hot');
          else cell.classList.remove('hot');
        });
      }

      function onMouseOver(e) {
        var cell = e.target.closest('.table-picker-cell');
        if (!cell) return;
        highlight(parseInt(cell.dataset.row, 10), parseInt(cell.dataset.col, 10));
      }

      function onClick(e) {
        var cell = e.target.closest('.table-picker-cell');
        if (!cell) return;
        var rows = parseInt(cell.dataset.row, 10);
        var cols = parseInt(cell.dataset.col, 10);
        insertTableMarkdown(textarea, start, end, rows, cols);
        close();
      }

      function onKey(e) {
        if (e.key === 'Escape') close();
      }

      function onDocClick(e) {
        if (!picker.contains(e.target) && e.target !== anchorBtn) close();
      }

      function close() {
        picker.style.display = 'none';
        grid.removeEventListener('mouseover', onMouseOver);
        grid.removeEventListener('click', onClick);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onDocClick);
        var cells = grid.querySelectorAll('.table-picker-cell.hot');
        cells.forEach(function (c) { c.classList.remove('hot'); });
      }

      closeBtn.onclick = close;
      grid.addEventListener('mouseover', onMouseOver);
      grid.addEventListener('click', onClick);
      document.addEventListener('keydown', onKey);
      // 다음 tick에 바인딩(현재 클릭 이벤트가 닫아버리는 것 방지)
      setTimeout(function () { document.addEventListener('click', onDocClick); }, 0);

      highlight(1, 1);
    }

    function insertTableMarkdown(textarea, start, end, rows, cols) {
      // 예: rows=3, cols=2 → 헤더 1줄 + 데이터 2줄 (총 3줄)
      var header = '|';
      var sep = '|';
      for (var c = 0; c < cols; c++) {
        header += ' 제목 ' + (c + 1) + ' |';
        sep += ' --- |';
      }
      var bodyLines = [];
      var dataRows = Math.max(1, rows - 1); // 최소 1개 데이터 행
      for (var r = 0; r < dataRows; r++) {
        var line = '|';
        for (var c2 = 0; c2 < cols; c2++) line += '   |';
        bodyLines.push(line);
      }
      var block = '\n' + header + '\n' + sep + '\n' + bodyLines.join('\n') + '\n';

      var text = textarea.value;
      textarea.value = text.substring(0, start) + block + text.substring(end);
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + block.length;
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
            // 저장 성공 시 자동저장 초안 삭제
            try { localStorage.removeItem(BLOG_DRAFT_KEY); } catch (e) {}
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

  // ──────────────────────────────────────────────────────────────
  // 클라이언트 마크다운 파서 (라이브 프리뷰 + 저장 시 content_html 생성용)
  // 서버(content.ts)의 markdownToHtml과 출력을 맞춤:
  //  - 헤딩 H2~H4 (id 자동)
  //  - 인용(>) / 수평선(---)
  //  - 리스트(-, 1.), 체크박스(- [ ]/[x])
  //  - GFM 표(|...|---|), 코드블록(```), 인라인 코드(`)
  //  - 콜아웃 :::info/warn/tip:::, 목차 [[TOC]]
  //  - 인라인: **굵게**, *기울임*, ==형광==, ~~취소~~, [링크], ![이미지]
  // ──────────────────────────────────────────────────────────────
  function markdownToHtml(md) {
    if (!md) return '';
    try { return _mdParse(md); }
    catch (e) { return '<p>' + _esc(md) + '</p>'; }
  }

  function _esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function _escAttr(s) { return String(s || '').replace(/"/g, '&quot;'); }
  function _stripInline(s) {
    return String(s || '')
      .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/==([^=]+)==/g, '$1').replace(/~~([^~]+)~~/g, '$1');
  }
  function _slug(s) {
    return (s || '').toLowerCase().trim()
      .replace(/[\s\u00A0]+/g, '-')
      .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ\-]+/g, '')
      .replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'section';
  }
  function _inline(s) {
    // 이미지
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (_, alt, url) {
      if (alt && alt.trim()) return '<figure class="md-figure"><img src="' + _escAttr(url) + '" alt="' + _escAttr(alt) + '" class="md-img" loading="lazy"/><figcaption class="md-figcaption">' + _esc(alt) + '</figcaption></figure>';
      return '<img src="' + _escAttr(url) + '" alt="" class="md-img" loading="lazy"/>';
    });
    // 링크
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, t, u) {
      var ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + _escAttr(u) + '" class="md-link"' + ext + '>' + _esc(t) + '</a>';
    });
    // **굵게**
    s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
    // ==하이라이트==
    s = s.replace(/==([^=\n]+)==/g, '<mark class="md-mark">$1</mark>');
    // ~~취소선~~
    s = s.replace(/~~([^~\n]+)~~/g, '<del class="md-del">$1</del>');
    // *기울임*
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    return s;
  }
  function _tableRow(line) {
    var inner = line.replace(/^\|/, '').replace(/\|$/, '');
    var cells = [], buf = '', esc = false;
    for (var j = 0; j < inner.length; j++) {
      var ch = inner[j];
      if (esc) { buf += ch; esc = false; }
      else if (ch === '\\') esc = true;
      else if (ch === '|') { cells.push(buf.trim()); buf = ''; }
      else buf += ch;
    }
    cells.push(buf.trim());
    return cells;
  }
  function _tableAligns(line) {
    return _tableRow(line).map(function (c) {
      var t = c.trim(), s = t.indexOf(':') === 0, e = t.lastIndexOf(':') === t.length - 1 && t.length > 0;
      if (s && e) return 'center'; if (e) return 'right'; if (s) return 'left'; return null;
    });
  }
  function _mdParse(md) {
    var text = md.replace(/\r\n/g, '\n');

    // 코드블록 치환
    var codeBlocks = [];
    text = text.replace(/```([\w]*)\n([\s\S]*?)```/g, function (_, lang, code) {
      codeBlocks.push('<pre class="md-pre"><code class="md-code' + (lang ? ' lang-' + _esc(lang) : '') + '">' + _esc(code) + '</code></pre>');
      return '\u0000CODE' + (codeBlocks.length - 1) + '\u0000';
    });

    // YouTube 블록 치환
    var embeds = [];
    var _ytId = (window.__extractYouTubeId) || function (u) {
      var m;
      if ((m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/))([\w-]{6,})/i))) return m[1].split(/[?&#]/)[0];
      if ((m = u.match(/youtu\.be\/([\w-]{6,})/i))) return m[1].split(/[?&#]/)[0];
      if ((m = u.match(/^([\w-]{11})$/))) return m[1];
      return null;
    };
    text = text.replace(/:::youtube\s+([\s\S]*?):::/gi, function (_, body) {
      var raw = String(body || '').trim();
      var pipeIdx = raw.indexOf('|');
      var urlPart = (pipeIdx >= 0 ? raw.slice(0, pipeIdx) : raw).trim();
      var caption = pipeIdx >= 0 ? raw.slice(pipeIdx + 1).trim() : '';
      var vid = _ytId(urlPart);
      if (!vid) {
        embeds.push('<div class="md-youtube-error">⚠ 유튜브 URL을 인식하지 못했습니다: ' + _esc(urlPart) + '</div>');
      } else {
        var cap = caption ? '<figcaption class="md-yt-caption">' + _esc(caption) + '</figcaption>' : '';
        embeds.push('<figure class="md-yt"><div class="md-yt-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + _escAttr(vid) + '" title="YouTube 영상" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>' + cap + '</figure>');
      }
      return '\u0000YT' + (embeds.length - 1) + '\u0000';
    });
    // 라인 단독 YouTube URL → 자동 임베드
    text = text.replace(/^[ \t]*((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)[\w-]{6,}(?:[^\s]*)?)[ \t]*$/gm, function (whole, url) {
      var vid = _ytId(url);
      if (!vid) return whole;
      embeds.push('<figure class="md-yt"><div class="md-yt-frame"><iframe src="https://www.youtube-nocookie.com/embed/' + _escAttr(vid) + '" title="YouTube 영상" loading="lazy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></figure>');
      return '\u0000YT' + (embeds.length - 1) + '\u0000';
    });

    // 콜아웃 치환 (재귀)
    var callouts = [];
    text = text.replace(/:::(info|warn|tip|note|success|danger)\s+([\s\S]*?):::/g, function (_, kind, body) {
      var icons = { info: 'ℹ', warn: '⚠', tip: '💡', note: '📝', success: '✅', danger: '🚫' };
      var inner = _mdParse(body.trim());
      callouts.push('<div class="md-callout md-callout-' + kind + '"><div class="md-callout-icon" aria-hidden="true">' + (icons[kind] || 'ℹ') + '</div><div class="md-callout-body">' + inner + '</div></div>');
      return '\u0000CALLOUT' + (callouts.length - 1) + '\u0000';
    });

    // 인라인 코드 치환
    var inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, function (_, c) {
      inlineCodes.push('<code class="md-inline-code">' + _esc(c) + '</code>');
      return '\u0000IC' + (inlineCodes.length - 1) + '\u0000';
    });

    var lines = text.split('\n'), out = [], i = 0, headings = [];
    var used = {};
    function uniq(base) {
      var s = base || 'section', n = 1;
      while (used[s]) { n++; s = base + '-' + n; }
      used[s] = 1; return s;
    }

    while (i < lines.length) {
      var line = lines[i], tr = line.trim();
      if (!tr) { i++; continue; }
      if (/^(---|\*\*\*|___)$/.test(tr)) { out.push('<hr class="md-hr"/>'); i++; continue; }
      if (/^\[\[TOC\]\]$/i.test(tr)) { out.push('\u0000TOCMARKER\u0000'); i++; continue; }
      // YT / CALLOUT 플레이스홀더 단독 라인 — 문단 감싸기 방지
      if (/^\u0000(YT|CALLOUT)\d+\u0000$/.test(tr)) { out.push(tr); i++; continue; }
      var hm = tr.match(/^(#{1,4})\s+(.+)$/);
      if (hm) {
        var lvl = hm[1].length, raw = hm[2].trim();
        var slug = uniq(_slug(_stripInline(raw)));
        headings.push({ level: lvl, text: _stripInline(raw), slug: slug });
        out.push('<h' + lvl + ' class="md-h' + lvl + '" id="' + slug + '">' + _inline(raw) + '</h' + lvl + '>');
        i++; continue;
      }
      // 표
      if (tr.charAt(0) === '|' && tr.charAt(tr.length - 1) === '|' && i + 1 < lines.length) {
        var nxt = (lines[i + 1] || '').trim();
        if (/^\|[\s:|-]+\|$/.test(nxt) && /-/.test(nxt)) {
          var head = _tableRow(tr), al = _tableAligns(nxt), bodyRows = [];
          i += 2;
          while (i < lines.length && lines[i].trim().charAt(0) === '|' && lines[i].trim().charAt(lines[i].trim().length - 1) === '|') {
            bodyRows.push(_tableRow(lines[i].trim())); i++;
          }
          var thead = '<thead><tr>' + head.map(function (c, idx) {
            return '<th' + (al[idx] ? ' style="text-align:' + al[idx] + '"' : '') + '>' + _inline(c) + '</th>';
          }).join('') + '</tr></thead>';
          var tbody = '<tbody>' + bodyRows.map(function (r) {
            return '<tr>' + r.map(function (c, idx) {
              return '<td' + (al[idx] ? ' style="text-align:' + al[idx] + '"' : '') + '>' + _inline(c) + '</td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody>';
          out.push('<div class="md-table-wrap"><table class="md-table">' + thead + tbody + '</table></div>');
          continue;
        }
      }
      // 인용
      if (tr.indexOf('> ') === 0) {
        var q = [];
        while (i < lines.length && lines[i].trim().indexOf('> ') === 0) { q.push(lines[i].trim().slice(2)); i++; }
        out.push('<blockquote class="md-blockquote">' + _inline(q.join(' ')) + '</blockquote>');
        continue;
      }
      // 체크박스 리스트
      if (/^[-*+]\s+\[[ xX]\]\s+/.test(tr)) {
        var items = [];
        while (i < lines.length && /^[-*+]\s+\[[ xX]\]\s+/.test(lines[i].trim())) {
          var m = lines[i].trim().match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
          items.push({ checked: /[xX]/.test(m[1]), text: m[2] }); i++;
        }
        out.push('<ul class="md-tasklist">' + items.map(function (it) {
          return '<li class="md-task' + (it.checked ? ' md-task-done' : '') + '"><span class="md-task-check" aria-hidden="true">' + (it.checked ? '✓' : '') + '</span><span class="md-task-text">' + _inline(it.text) + '</span></li>';
        }).join('') + '</ul>');
        continue;
      }
      // 무순서 리스트
      if (/^[-*+]\s+/.test(tr)) {
        var arr = [];
        while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim()) && !/^[-*+]\s+\[[ xX]\]\s+/.test(lines[i].trim())) {
          arr.push(lines[i].trim().replace(/^[-*+]\s+/, '')); i++;
        }
        out.push('<ul class="md-ul">' + arr.map(function (it) { return '<li>' + _inline(it) + '</li>'; }).join('') + '</ul>');
        continue;
      }
      // 순서 리스트
      if (/^\d+\.\s+/.test(tr)) {
        var arr2 = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          arr2.push(lines[i].trim().replace(/^\d+\.\s+/, '')); i++;
        }
        out.push('<ol class="md-ol">' + arr2.map(function (it) { return '<li>' + _inline(it) + '</li>'; }).join('') + '</ol>');
        continue;
      }
      // 일반 문단
      var para = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^(#{1,4}\s|>|[-*+]\s|\d+\.\s|---|\*\*\*|___|\|)/.test(lines[i].trim()) &&
        !/^\u0000(YT|CALLOUT|TOCMARKER)/.test(lines[i].trim())
      ) {
        para.push(lines[i].trim()); i++;
      }
      if (para.length) out.push('<p class="md-p">' + _inline(para.join(' ')) + '</p>');
    }

    var html = out.filter(function (l) { return l !== ''; }).join('\n');

    // 목차 생성
    if (html.indexOf('\u0000TOCMARKER\u0000') !== -1) {
      var toc = '';
      var tocItems = headings.filter(function (h) { return h.level >= 2 && h.level <= 3; });
      if (tocItems.length) {
        toc = '<nav class="md-toc" aria-label="목차"><div class="md-toc-title">목차</div><ol class="md-toc-list">';
        var inSub = false;
        tocItems.forEach(function (h) {
          if (h.level === 2) {
            if (inSub) { toc += '</ol></li>'; inSub = false; }
            toc += '<li class="md-toc-item md-toc-h2"><a href="#' + h.slug + '">' + _esc(h.text) + '</a>';
          } else {
            if (!inSub) { toc += '<ol class="md-toc-sublist">'; inSub = true; }
            toc += '<li class="md-toc-item md-toc-h3"><a href="#' + h.slug + '">' + _esc(h.text) + '</a></li>';
          }
        });
        if (inSub) toc += '</ol></li>';
        toc += '</ol></nav>';
      }
      html = html.replace(/\u0000TOCMARKER\u0000/g, toc);
    }

    html = html.replace(/\u0000CALLOUT(\d+)\u0000/g, function (_, idx) { return callouts[+idx] || ''; });
    html = html.replace(/\u0000YT(\d+)\u0000/g, function (_, idx) { return embeds[+idx] || ''; });
    html = html.replace(/\u0000IC(\d+)\u0000/g, function (_, idx) { return inlineCodes[+idx] || ''; });
    html = html.replace(/\u0000CODE(\d+)\u0000/g, function (_, idx) { return codeBlocks[+idx] || ''; });

    // <p> 안에 figure/callout이 잘못 들어가면 풀어주기
    html = html.replace(/<p class="md-p">\s*(<figure class="md-yt">[\s\S]*?<\/figure>)\s*<\/p>/g, '$1');
    html = html.replace(/<p class="md-p">\s*(<div class="md-callout[\s\S]*?<\/div>)\s*<\/p>/g, '$1');

    return html;
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

  // 사이드바용: 전체 글 캐시
  var __blogsCache = [];

  function loadBlogs() {
    fetch('/api/admin/blogs', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (data) {
      __blogsCache = data.blogs || [];

      var list = document.getElementById('blogsList');
      if (!__blogsCache.length) {
        list.innerHTML = '<div class="admin-empty">등록된 블로그 글이 없습니다</div>';
        renderEditorSidebar('');
        return;
      }
      list.innerHTML = '';
      __blogsCache.forEach(function (b) {
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

      // 에디터 모달 좌측 사이드바도 갱신
      renderEditorSidebar('');
    });
  }

  // ─── 에디터 사이드바 렌더링 ───
  function renderEditorSidebar(searchQuery) {
    var listEl = document.getElementById('editorSidebarList');
    if (!listEl) return;
    var q = (searchQuery || '').trim().toLowerCase();
    var filtered = q ? __blogsCache.filter(function (b) {
      return (b.title || '').toLowerCase().indexOf(q) !== -1;
    }) : __blogsCache;

    if (!filtered.length) {
      listEl.innerHTML = '<p class="editor-sidebar-empty">' + (q ? '검색 결과가 없습니다' : '작성된 글이 없습니다') + '</p>';
      return;
    }

    var currentId = document.getElementById('blogId') ? document.getElementById('blogId').value : '';
    var html = '';
    filtered.forEach(function (b) {
      var active = String(b.id) === String(currentId) ? ' active' : '';
      var title = (b.title || '(제목 없음)').replace(/[<>&]/g, function (m) {
        return m === '<' ? '&lt;' : m === '>' ? '&gt;' : '&amp;';
      });
      html += '<div class="editor-sidebar-item' + active + '" data-sidebar-blog="' + b.id + '">' +
        '<span class="editor-sidebar-item-title">' + title + '</span>' +
        '<span class="editor-sidebar-item-meta">' +
          '<span>👁 ' + (b.views || 0) + '</span>' +
          '<span class="dot">·</span>' +
          '<span>' + formatDate(b.created_at) + '</span>' +
        '</span>' +
      '</div>';
    });
    listEl.innerHTML = html;

    listEl.querySelectorAll('[data-sidebar-blog]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.dataset.sidebarBlog;
        editBlog(id);
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
      blogUndoStack = [];
      blogRedoStack = [];
      renderBlogPreviews();
      updateCharCounts();
      document.getElementById('blogModal').style.display = '';

      // 사이드바 active 표시
      var listEl = document.getElementById('editorSidebarList');
      if (listEl) {
        listEl.querySelectorAll('.editor-sidebar-item').forEach(function (el) {
          el.classList.toggle('active', String(el.dataset.sidebarBlog) === String(b.id));
        });
        // 모바일에선 사이드바 접기
        if (window.matchMedia('(max-width: 900px)').matches) {
          var sb = document.getElementById('editorSidebar');
          if (sb) sb.classList.remove('expanded');
        }
      }

      setTimeout(function () {
        if (window.__blogEditor) {
          window.__blogEditor.pushUndoSnapshot(document.getElementById('blogContent').value);
          window.__blogEditor.updatePreview();
          window.__blogEditor.updateStatusBar();
          window.__blogEditor.updateSeoScore();
          window.__blogEditor.setEditorViewMode('split');
        }
      }, 50);
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
    fetch('/api/admin/notices', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (data) {
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
    fetch('/api/admin/faq', { cache: 'no-store', credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (data) {
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
