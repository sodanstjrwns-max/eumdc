/* ============================================
   이음치과 — Sub Page Scripts v2
   Cases (before visible, after login-gated), Blogs, Notices,
   User Auth, Nav user state, Region autocomplete, Dict auto-link
   ============================================ */
(function () {
  'use strict';

  var currentUser = null;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    checkUserAuth(function () {
      initNavUserState();
      initCasesPage();
      initCaseDetail();
      initBlogsPage();
      initBlogDetail();
      initNoticesPage();
      initNoticeDetail();
      initSignupPage();
      initLoginPage();
    });
  }

  // === User Auth Check ===
  function checkUserAuth(callback) {
    fetch('/api/user/check').then(function (r) { return r.json(); }).then(function (data) {
      if (data.authenticated && data.user) {
        currentUser = data.user;
      } else {
        currentUser = null;
      }
      callback();
    }).catch(function () {
      currentUser = null;
      callback();
    });
  }

  function initNavUserState() {
    var navUser = document.getElementById('navUser');
    var navAuth = document.getElementById('navAuth');
    if (!navUser || !navAuth) return;

    if (currentUser) {
      navUser.style.display = '';
      navAuth.style.display = 'none';
      var nameEl = document.getElementById('navUserName');
      if (nameEl) nameEl.textContent = currentUser.name + '님';

      var logoutBtn = document.getElementById('navLogoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          fetch('/api/user/logout', { method: 'POST' }).then(function () {
            window.location.reload();
          });
        });
      }
    } else {
      navUser.style.display = 'none';
      navAuth.style.display = '';
    }
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

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // === CASES LIST (before visible, after login-gated) ===
  function initCasesPage() {
    var grid = document.getElementById('casesGrid');
    if (!grid) return;

    var isLoggedIn = !!currentUser;
    var loginBanner = document.getElementById('loginGateBanner');

    // Show login gate banner if not logged in
    if (!isLoggedIn && loginBanner) {
      loginBanner.style.display = '';
    }

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
      if (category !== 'all') url += '&category=' + category;
      fetch(url).then(function (r) { return r.json(); }).then(function (data) {
        if (page === 1) grid.innerHTML = '';

        var items = data.cases || [];

        if (items.length === 0 && page === 1) {
          grid.innerHTML = '<div class="empty-state"><p>등록된 케이스가 없습니다.</p></div>';
        }

        items.forEach(function (c) {
          var beforeImg = c.pano_before || c.intra_before || '';
          var afterImg = c.pano_after || c.intra_after || '';
          var card = document.createElement('a');
          card.href = '/cases/' + c.id;
          card.className = 'case-card';
          card.setAttribute('data-hover', '');

          // Before image is ALWAYS visible
          var beforeHtml = '';
          if (beforeImg) {
            beforeHtml = '<div class="case-card-before"><img src="' + beforeImg + '" alt="Before" loading="lazy"/><div class="case-img-label">Before</div></div>';
          }

          // After image: blurred if not logged in
          var afterHtml = '';
          if (afterImg) {
            if (isLoggedIn) {
              afterHtml = '<div class="case-card-after"><img src="' + afterImg + '" alt="After" loading="lazy"/><div class="case-img-label after">After</div></div>';
            } else {
              afterHtml = '<div class="case-card-after blurred"><img src="' + afterImg + '" alt="After" loading="lazy"/><div class="case-img-label after">After</div>' +
                '<div class="blur-overlay"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>로그인 후 열람</span></div></div>';
            }
          }

          // No image fallback
          if (!beforeImg && !afterImg) {
            beforeHtml = '<div class="case-card-before"><div class="no-img">NO IMAGE</div></div>';
          }

          // Meta info line
          var metaParts = [];
          if (c.patient_age_group) metaParts.push(esc(c.patient_age_group));
          if (c.patient_gender) metaParts.push(c.patient_gender === 'M' ? '남성' : c.patient_gender === 'F' ? '여성' : esc(c.patient_gender));
          if (c.treatment_duration) metaParts.push(esc(c.treatment_duration));
          if (c.region_text) metaParts.push(esc(c.region_text));

          card.innerHTML =
            '<div class="case-card-images">' + beforeHtml + afterHtml + '</div>' +
            '<div class="case-card-body">' +
              '<span class="case-tag">' + categoryLabel(c.category) + '</span>' +
              '<h3>' + esc(c.title || '') + '</h3>' +
              (metaParts.length > 0 ? '<div class="case-patient-info">' + metaParts.join(' · ') + '</div>' : '') +
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

  // === CASE DETAIL (before visible, after login-gated) ===
  function initCaseDetail() {
    var el = document.getElementById('caseDetail');
    if (!el) return;

    var id = el.dataset.caseId;
    var isLoggedIn = !!currentUser;

    fetch('/api/cases/' + id).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (c) {
      // Build image pairs - only show non-empty slots
      var pairs = [];
      if (c.pano_before || c.pano_after) {
        pairs.push({ label: '파노라마', before: c.pano_before, after: c.pano_after });
      }
      if (c.intra_before || c.intra_after) {
        pairs.push({ label: '구내사진', before: c.intra_before, after: c.intra_after });
      }

      var html = '<div class="case-detail-header">' +
        '<span class="case-tag">' + categoryLabel(c.category) + '</span>' +
        '<h1>' + esc(c.title || '') + '</h1>';

      // Patient info
      var infoParts = [];
      if (c.patient_age_group) infoParts.push('<span class="detail-badge">' + esc(c.patient_age_group) + '</span>');
      if (c.patient_gender) infoParts.push('<span class="detail-badge">' + (c.patient_gender === 'M' ? '남성' : c.patient_gender === 'F' ? '여성' : esc(c.patient_gender)) + '</span>');
      if (c.treatment_duration) infoParts.push('<span class="detail-badge">' + esc(c.treatment_duration) + '</span>');
      if (c.region_text) infoParts.push('<span class="detail-badge">' + esc(c.region_text) + '</span>');
      if (c.doctor) infoParts.push('<span class="detail-badge doctor">' + esc(c.doctor.name) + ' ' + esc(c.doctor.title) + '</span>');

      if (infoParts.length > 0) {
        html += '<div class="case-detail-badges">' + infoParts.join('') + '</div>';
      }

      html += '<div class="case-meta"><span>' + formatDate(c.created_at) + '</span><span>조회 ' + (c.views || 0) + '</span></div>';
      html += '</div>';

      if (c.description) {
        html += '<div class="case-detail-desc"><p>' + c.description.replace(/\n/g, '<br/>') + '</p></div>';
      }

      // Show before/after pairs
      if (pairs.length > 0) {
        html += '<div class="case-detail-pairs">';
        pairs.forEach(function (pair) {
          html += '<div class="case-pair">';
          html += '<h3 class="case-pair-title">' + pair.label + '</h3>';
          html += '<div class="case-pair-images">';
          // Before - ALWAYS visible
          if (pair.before) {
            html += '<div class="case-pair-img"><div class="case-pair-label">Before</div><img src="' + pair.before + '" alt="' + pair.label + ' Before" loading="lazy" /></div>';
          }
          // After - blurred if not logged in
          if (pair.after) {
            if (isLoggedIn) {
              html += '<div class="case-pair-img"><div class="case-pair-label after">After</div><img src="' + pair.after + '" alt="' + pair.label + ' After" loading="lazy" /></div>';
            } else {
              html += '<div class="case-pair-img after-locked"><div class="case-pair-label after">After</div><img src="' + pair.after + '" alt="' + pair.label + ' After" loading="lazy" class="blurred-img" />' +
                '<div class="after-lock-overlay">' +
                  '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
                  '<p>로그인 후 열람 가능</p>' +
                  '<a href="/login?redirect=' + encodeURIComponent(window.location.pathname) + '" class="lock-login-btn">로그인</a>' +
                '</div></div>';
            }
          }
          html += '</div></div>';
        });
        html += '</div>';
      }

      // Dict auto-link in description
      el.innerHTML = html;
      autoLinkDictTerms(el.querySelector('.case-detail-desc'));

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

          var excerpt = (b.content || '').replace(/<[^>]*>/g, '').substring(0, 120);
          card.innerHTML =
            '<div class="blog-card-img">' +
              (b.thumbnail ? '<img src="' + b.thumbnail + '" alt="' + esc(b.title || '') + '" loading="lazy"/>' : '<div class="no-img">BLOG</div>') +
            '</div>' +
            '<div class="blog-card-body">' +
              '<h3>' + esc(b.title || '') + '</h3>' +
              '<p class="blog-excerpt">' + esc(excerpt) + '...</p>' +
              '<div class="blog-meta">' +
                (b.author_name ? '<span class="blog-author">' + esc(b.author_name) + '</span>' : '') +
                '<span>' + formatDate(b.created_at) + '</span><span>조회 ' + (b.views || 0) + '</span>' +
              '</div>' +
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

  // === BLOG DETAIL (SEO-optimized with inline images, dict auto-link) ===
  function initBlogDetail() {
    var el = document.getElementById('blogDetail');
    if (!el) return;
    var id = el.dataset.blogId;

    fetch('/api/blogs/' + id).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (b) {
      var html = '<article class="blog-article" itemscope itemtype="https://schema.org/BlogPosting">';

      html += '<header class="blog-article-header">' +
        '<h1 itemprop="headline">' + esc(b.title || '') + '</h1>' +
        '<div class="blog-article-meta">' +
          '<time datetime="' + (b.created_at || '') + '" itemprop="datePublished">' + formatDate(b.created_at) + '</time>' +
          (b.author_name ? '<span class="blog-author" itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">' + esc(b.author_name) + '</span></span>' : '<span itemprop="author" itemscope itemtype="https://schema.org/Person"><meta itemprop="name" content="이음치과의원" /></span>') +
          '<span class="blog-views">조회 ' + (b.views || 0) + '</span>' +
        '</div>' +
      '</header>';

      // Rich content
      if (b.content_html) {
        html += '<div class="blog-article-body" itemprop="articleBody">' + b.content_html + '</div>';
      } else {
        var paragraphs = (b.content || '').split('\n').filter(function(p) { return p.trim(); });
        var images = b.images || [];
        html += '<div class="blog-article-body" itemprop="articleBody">';

        if (images.length > 0 && paragraphs.length > 0) {
          var interval = Math.max(1, Math.floor(paragraphs.length / (images.length + 1)));
          var imgIdx = 0;
          paragraphs.forEach(function (p, i) {
            html += '<p>' + p + '</p>';
            if (imgIdx < images.length && (i + 1) % interval === 0) {
              html += '<figure class="blog-inline-figure"><img src="' + images[imgIdx].image_url + '" alt="' + esc(b.title || '') + ' - 이미지 ' + (imgIdx + 1) + '" loading="lazy" itemprop="image" /><figcaption>' + esc(b.title || '') + '</figcaption></figure>';
              imgIdx++;
            }
          });
          while (imgIdx < images.length) {
            html += '<figure class="blog-inline-figure"><img src="' + images[imgIdx].image_url + '" alt="' + esc(b.title || '') + ' - 이미지 ' + (imgIdx + 1) + '" loading="lazy" itemprop="image" /></figure>';
            imgIdx++;
          }
        } else {
          paragraphs.forEach(function (p) { html += '<p>' + p + '</p>'; });
          if (images.length > 0) {
            images.forEach(function (img, i) {
              html += '<figure class="blog-inline-figure"><img src="' + img.image_url + '" alt="' + esc(b.title || '') + ' - 이미지 ' + (i + 1) + '" loading="lazy" itemprop="image" /></figure>';
            });
          }
        }
        html += '</div>';
      }

      html += '<footer class="blog-article-footer">' +
        '<div class="blog-cta-box"><p>이음치과에서 상담받아 보세요</p><a href="tel:051-206-5888" class="blog-cta-btn">051-206-5888 전화 상담</a></div>' +
      '</footer></article>';

      el.innerHTML = html;
      autoLinkDictTerms(el.querySelector('.blog-article-body'));
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
              (n.thumbnail ? '<img src="' + n.thumbnail + '" class="notice-thumb" alt="" />' : '') +
              '<h3>' + esc(n.title || '') + '</h3>' +
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
      var imgHtml = '';
      if (n.images && n.images.length > 0) {
        imgHtml = '<div class="notice-images">';
        n.images.forEach(function (img) {
          imgHtml += '<img src="' + (img.image_url || img) + '" alt="" class="notice-detail-img" loading="lazy" />';
        });
        imgHtml += '</div>';
      }

      el.innerHTML =
        '<div class="notice-detail-header">' +
          (n.is_pinned ? '<span class="pin-badge">고정</span>' : '') +
          '<h1>' + esc(n.title || '') + '</h1>' +
          '<div class="notice-meta"><span>' + formatDate(n.created_at) + '</span><span>조회 ' + (n.views || 0) + '</span></div>' +
        '</div>' +
        imgHtml +
        '<div class="notice-detail-content">' + (n.content_html || ('<p>' + (n.content || '').replace(/\n/g, '<br/>') + '</p>')) + '</div>';
    }).catch(function () {
      el.innerHTML = '<div class="empty-state"><p>공지사항을 찾을 수 없습니다.</p></div>';
    });
  }

  // ========================================
  // DICTIONARY AUTO-LINK
  // ========================================
  var dictTermsCache = null;

  function autoLinkDictTerms(container) {
    if (!container) return;
    if (dictTermsCache) {
      applyDictLinks(container, dictTermsCache);
      return;
    }
    fetch('/api/dictionary/terms-index').then(function (r) { return r.json(); }).then(function (data) {
      dictTermsCache = data.terms || [];
      applyDictLinks(container, dictTermsCache);
    }).catch(function () { /* silently fail */ });
  }

  function applyDictLinks(container, terms) {
    if (!terms || terms.length === 0) return;
    // Sort by length desc so longer terms match first
    var sorted = terms.slice().sort(function (a, b) { return b.term.length - a.term.length; });
    var linked = {};

    // Walk text nodes in the container
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    var nodesToReplace = [];

    while (walker.nextNode()) {
      var node = walker.currentNode;
      var parent = node.parentNode;
      // Skip if already a link or heading
      if (parent.tagName === 'A' || parent.tagName === 'H1' || parent.tagName === 'H2' || parent.tagName === 'H3') continue;

      var text = node.textContent;
      var changed = false;
      var html = text;

      for (var i = 0; i < sorted.length && i < 50; i++) {
        var t = sorted[i];
        if (linked[t.term]) continue; // max 1 link per term
        var idx = html.indexOf(t.term);
        if (idx >= 0) {
          html = html.substring(0, idx) +
            '<a href="/dictionary/' + t.slug + '" class="dict-auto-link" title="' + esc(t.term) + ' - 치과 용어 사전">' + t.term + '</a>' +
            html.substring(idx + t.term.length);
          linked[t.term] = true;
          changed = true;
        }
      }

      if (changed) {
        nodesToReplace.push({ node: node, html: html });
      }
    }

    nodesToReplace.forEach(function (item) {
      var span = document.createElement('span');
      span.innerHTML = item.html;
      item.node.parentNode.replaceChild(span, item.node);
    });
  }

  // =============================================
  // SIGNUP PAGE
  // =============================================
  function initSignupPage() {
    var form = document.getElementById('signupForm');
    if (!form) return;

    if (currentUser) {
      window.location.href = '/cases';
      return;
    }

    var consentAll = document.getElementById('consentAll');
    var allChecks = form.querySelectorAll('.consent-check-input');
    var mktSubs = form.querySelectorAll('.consent-marketing-sub');

    if (consentAll) {
      consentAll.addEventListener('change', function () {
        var checked = this.checked;
        allChecks.forEach(function (cb) { cb.checked = checked; });
        mktSubs.forEach(function (cb) { cb.checked = checked; });
        toggleMarketingSub();
      });
    }

    allChecks.forEach(function (cb) {
      cb.addEventListener('change', function () {
        var allChecked = Array.from(allChecks).every(function (c) { return c.checked; }) &&
                         Array.from(mktSubs).every(function (c) { return c.checked; });
        if (consentAll) consentAll.checked = allChecked;
        toggleMarketingSub();
      });
    });

    var mktCheckbox = document.getElementById('consentMarketing');
    if (mktCheckbox) {
      mktCheckbox.addEventListener('change', toggleMarketingSub);
    }

    function toggleMarketingSub() {
      var sub = document.getElementById('marketingSub');
      if (sub && mktCheckbox) {
        sub.style.display = mktCheckbox.checked ? '' : 'none';
        if (!mktCheckbox.checked) {
          mktSubs.forEach(function (cb) { cb.checked = false; });
        }
      }
    }

    form.querySelectorAll('.consent-view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showConsentModal(btn.dataset.consent);
      });
    });

    var consentModal = document.getElementById('consentModal');
    var closeBtn = document.getElementById('consentModalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () { consentModal.style.display = 'none'; });
    }
    if (consentModal) {
      consentModal.addEventListener('click', function (e) {
        if (e.target === consentModal) consentModal.style.display = 'none';
      });
    }

    var phoneInput = document.getElementById('signupPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var v = this.value.replace(/[^0-9]/g, '');
        if (v.length > 3 && v.length <= 7) {
          this.value = v.slice(0, 3) + '-' + v.slice(3);
        } else if (v.length > 7) {
          this.value = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7, 11);
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl = document.getElementById('signupError');
      errorEl.style.display = 'none';

      var pw = document.getElementById('signupPw').value;
      var pw2 = document.getElementById('signupPw2').value;
      if (pw !== pw2) {
        errorEl.textContent = '비밀번호가 일치하지 않습니다.';
        errorEl.style.display = '';
        return;
      }

      var privacy = document.getElementById('consentPrivacy');
      var terms = document.getElementById('consentTerms');
      if (!privacy.checked || !terms.checked) {
        errorEl.textContent = '필수 동의항목에 모두 동의해주세요.';
        errorEl.style.display = '';
        return;
      }

      var gender = '';
      var genderInputs = form.querySelectorAll('input[name="gender"]');
      genderInputs.forEach(function (r) { if (r.checked) gender = r.value; });

      var payload = {
        name: document.getElementById('signupName').value.trim(),
        phone: document.getElementById('signupPhone').value,
        password: pw,
        email: document.getElementById('signupEmail').value.trim() || null,
        birth_date: document.getElementById('signupBirth').value || null,
        gender: gender,
        agree_privacy: privacy.checked,
        agree_terms: terms.checked,
        agree_marketing: document.getElementById('consentMarketing').checked,
        agree_marketing_sms: document.getElementById('consentSms').checked,
        agree_marketing_email: document.getElementById('consentEmailMkt').checked,
        agree_third_party: document.getElementById('consentThirdParty').checked,
      };

      var btn = document.getElementById('signupSubmitBtn');
      btn.disabled = true;
      btn.querySelector('span').textContent = '처리 중...';

      fetch('/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (res.ok) {
            window.location.href = '/cases';
          } else {
            errorEl.textContent = res.data.error || '회원가입에 실패했습니다.';
            errorEl.style.display = '';
            btn.disabled = false;
            btn.querySelector('span').textContent = '회원가입';
          }
        })
        .catch(function () {
          errorEl.textContent = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          errorEl.style.display = '';
          btn.disabled = false;
          btn.querySelector('span').textContent = '회원가입';
        });
    });
  }

  function showConsentModal(type) {
    var modal = document.getElementById('consentModal');
    var title = document.getElementById('consentModalTitle');
    var body = document.getElementById('consentModalBody');

    var contents = {
      privacy: {
        title: '개인정보 수집·이용 동의',
        html: '<h4>1. 수집 항목</h4><p>이름, 전화번호, 이메일(선택), 생년월일(선택), 성별(선택)</p>' +
          '<h4>2. 수집 목적</h4><p>회원 식별 및 서비스 제공, 비포애프터 케이스 열람 권한 관리, 예약 및 상담 안내</p>' +
          '<h4>3. 보유 기간</h4><p>회원 탈퇴 시까지 또는 수집 목적 달성 후 즉시 파기.</p>' +
          '<h4>4. 동의 거부권</h4><p>귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 항목에 대한 동의를 거부할 경우 회원가입이 제한될 수 있습니다.</p>'
      },
      terms: {
        title: '이용약관',
        html: '<h4>제1조 (목적)</h4><p>이 약관은 이음치과의원(이하 "병원")이 제공하는 웹사이트 서비스의 이용에 관한 조건과 절차를 규정합니다.</p>' +
          '<h4>제2조 (서비스 내용)</h4><p>병원은 비포애프터 케이스 열람, 블로그 콘텐츠 제공, 공지사항 안내, FAQ 제공 등의 온라인 정보 서비스를 제공합니다.</p>' +
          '<h4>제3조 (회원가입)</h4><p>서비스 이용을 위해 이름, 전화번호, 비밀번호를 등록하여 회원가입을 할 수 있습니다.</p>' +
          '<h4>제4조 (책임 제한)</h4><p>병원은 웹사이트에 게시된 정보의 정확성, 신뢰성에 대해 보증하지 않습니다. 의료 상담 및 치료 결정은 반드시 직접 내원하여 상담 후 진행해 주세요.</p>'
      },
      marketing: {
        title: '마케팅 활용 동의',
        html: '<h4>1. 수집 항목</h4><p>이름, 전화번호, 이메일</p>' +
          '<h4>2. 활용 목적</h4><p>이벤트, 프로모션 안내, 신규 서비스·진료 소식 안내</p>' +
          '<h4>3. 활용 방법</h4><p>SMS, 이메일, 카카오톡</p>' +
          '<h4>4. 동의 거부권</h4><p>마케팅 활용 동의는 선택사항이며, 동의하지 않아도 기본 서비스 이용이 가능합니다.</p>'
      },
      thirdparty: {
        title: '제3자 정보 제공 동의',
        html: '<h4>1. 제공받는 자</h4><p>이음치과의원 협력 의료기관</p>' +
          '<h4>2. 제공 항목</h4><p>이름, 전화번호</p>' +
          '<h4>3. 제공 목적</h4><p>협진 안내, 관련 의료 서비스 정보 제공</p>' +
          '<h4>4. 동의 거부권</h4><p>선택사항이며, 동의하지 않아도 기본 서비스 이용이 가능합니다.</p>'
      }
    };

    var c = contents[type];
    if (!c) return;
    title.textContent = c.title;
    body.innerHTML = c.html;
    modal.style.display = '';
  }

  // =============================================
  // LOGIN PAGE
  // =============================================
  function initLoginPage() {
    var form = document.getElementById('userLoginForm');
    if (!form) return;

    if (currentUser) {
      var params = new URLSearchParams(window.location.search);
      var redirect = params.get('redirect') || '/cases';
      window.location.href = redirect;
      return;
    }

    var phoneInput = document.getElementById('loginPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var v = this.value.replace(/[^0-9]/g, '');
        if (v.length > 3 && v.length <= 7) {
          this.value = v.slice(0, 3) + '-' + v.slice(3);
        } else if (v.length > 7) {
          this.value = v.slice(0, 3) + '-' + v.slice(3, 7) + '-' + v.slice(7, 11);
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl = document.getElementById('userLoginError');
      errorEl.style.display = 'none';

      var payload = {
        phone: document.getElementById('loginPhone').value,
        password: document.getElementById('loginPwUser').value
      };

      fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
        .then(function (res) {
          if (res.ok) {
            var params = new URLSearchParams(window.location.search);
            var redirect = params.get('redirect') || '/cases';
            window.location.href = redirect;
          } else {
            errorEl.textContent = res.data.error || '로그인에 실패했습니다.';
            errorEl.style.display = '';
          }
        })
        .catch(function () {
          errorEl.textContent = '서버 오류가 발생했습니다.';
          errorEl.style.display = '';
        });
    });
  }

})();
