/* ============================================
   이음치과 — Treatments (진료과목) Page Scripts
   ============================================ */
(function () {
  'use strict';

  var treatmentIcons = {
    implant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M8 6h8l-1 6h-6L8 6zM9 12l-0.5 6h7l-0.5-6"/></svg>',
    aesthetic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    tmj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="7"/><path d="M8.5 13.5s1.5 2 3.5 2 3.5-2 3.5-2"/><path d="M9 17l-2 5M15 17l2 5"/></svg>',
    resin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 2h6l2 6-5 14-5-14 2-6z"/></svg>',
    general: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4M12 16h.01"/></svg>',
    periodontal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 20V4h10v16"/><path d="M7 12h10"/></svg>',
    'wisdom-tooth': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
    pediatric: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 00-16 0"/></svg>',
    prevention: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>'
  };

  document.addEventListener('DOMContentLoaded', function () {
    initTreatmentsList();
    initTreatmentDetail();
  });

  // === 진료과목 목록 ===
  function initTreatmentsList() {
    var coreGrid = document.getElementById('treatCoreGrid');
    var stdGrid = document.getElementById('treatStandardGrid');
    if (!coreGrid && !stdGrid) return;

    fetch('/api/treatments').then(function (r) { return r.json(); }).then(function (data) {
      var items = data.treatments || [];
      var core = items.filter(function (t) { return t.category === 'core'; });
      var standard = items.filter(function (t) { return t.category !== 'core'; });

      if (coreGrid) renderTreatCards(coreGrid, core, true);
      if (stdGrid) renderTreatCards(stdGrid, standard, false);
    });
  }

  function renderTreatCards(container, items, isCore) {
    if (items.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>등록된 진료과목이 없습니다.</p></div>';
      return;
    }
    var html = '';
    items.forEach(function (t) {
      var icon = treatmentIcons[t.slug] || treatmentIcons.general;
      html += '<a href="/treatments/' + t.slug + '" class="treat-card' + (isCore ? ' core' : '') + '" data-hover>';
      html += '<div class="treat-card-icon">' + icon + '</div>';
      html += '<div class="treat-card-body">';
      html += '<h3 class="treat-card-name">' + esc(t.name) + '</h3>';
      if (t.name_en) html += '<span class="treat-card-en">' + esc(t.name_en) + '</span>';
      html += '<p class="treat-card-desc">' + esc(t.short_desc || '') + '</p>';
      html += '</div>';
      html += '<span class="treat-card-arrow">→</span>';
      html += '</a>';
    });
    container.innerHTML = html;
  }

  // === 진료과목 상세 ===
  function initTreatmentDetail() {
    var el = document.getElementById('treatDetailContent');
    if (!el) return;
    var slug = el.dataset.slug;

    fetch('/api/treatments/' + slug).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (data) {
      renderTreatmentDetail(data);
    }).catch(function () {
      el.innerHTML = '<div class="container-wide"><div class="empty-state"><p>진료과목을 찾을 수 없습니다.</p></div></div>';
    });
  }

  function renderTreatmentDetail(data) {
    var t = data.treatment;
    var faqs = data.faqs || [];
    var doctors = data.doctors || [];
    var dictTerms = data.dictTerms || [];
    var cases = data.cases || [];
    var prices = data.prices || [];

    // Hero
    var heroEl = document.getElementById('treatHeroContent');
    if (heroEl) {
      var icon = treatmentIcons[t.slug] || treatmentIcons.general;
      heroEl.innerHTML =
        '<div class="treat-hero-icon">' + icon + '</div>' +
        '<h1 class="treat-hero-title">' + esc(t.hero_title || t.name) + '</h1>' +
        (t.hero_subtitle ? '<p class="treat-hero-sub">' + esc(t.hero_subtitle) + '</p>' : '') +
        '<div class="treat-hero-badges">' +
          (t.duration ? '<span class="treat-badge">⏱ ' + esc(t.duration) + '</span>' : '') +
          (t.recovery ? '<span class="treat-badge">🔄 회복: ' + esc(t.recovery) + '</span>' : '') +
          (t.insurance_info ? '<span class="treat-badge">🏥 ' + esc(t.insurance_info) + '</span>' : '') +
        '</div>';
    }

    var contentEl = document.getElementById('treatDetailContent');
    var html = '';

    // Overview
    if (t.overview) {
      html += '<section class="treat-section"><div class="container-wide">' +
        '<h2 class="treat-section-title">진료 개요</h2>' +
        '<div class="treat-overview">' + t.overview + '</div>' +
        '</div></section>';
    }

    // Process Steps
    var steps = safeJSON(t.process_steps);
    if (steps.length > 0) {
      html += '<section class="treat-section bg-alt"><div class="container-wide">';
      html += '<h2 class="treat-section-title">치료 과정</h2>';
      html += '<div class="treat-steps">';
      steps.forEach(function (s, i) {
        html += '<div class="treat-step" data-reveal>' +
          '<div class="treat-step-num">' + String(i + 1).padStart(2, '0') + '</div>' +
          '<div class="treat-step-body"><h3>' + esc(s.title || '') + '</h3><p>' + esc(s.desc || '') + '</p></div></div>';
      });
      html += '</div></div></section>';
    }

    // Benefits
    var benefits = safeJSON(t.benefits);
    if (benefits.length > 0) {
      html += '<section class="treat-section"><div class="container-wide">';
      html += '<h2 class="treat-section-title">이음치과의 장점</h2>';
      html += '<div class="treat-benefits">';
      benefits.forEach(function (b) {
        html += '<div class="treat-benefit" data-reveal>' +
          '<h4>' + esc(b.title || '') + '</h4><p>' + esc(b.desc || '') + '</p></div>';
      });
      html += '</div></div></section>';
    }

    // Content Sections
    var sections = safeJSON(t.content_sections);
    sections.forEach(function (s) {
      html += '<section class="treat-section"><div class="container-wide">' +
        '<h2 class="treat-section-title">' + esc(s.title || '') + '</h2>' +
        '<div class="treat-content-block">' + (s.body || '') + '</div>' +
        '</div></section>';
    });

    // Prices
    if (prices.length > 0) {
      html += '<section class="treat-section bg-alt"><div class="container-wide">';
      html += '<h2 class="treat-section-title">수가 안내</h2>';
      html += '<div class="treat-price-table"><table><thead><tr><th>항목</th><th>비용</th><th>보험</th><th>비고</th></tr></thead><tbody>';
      prices.forEach(function (p) {
        html += '<tr><td>' + esc(p.item_name) + '</td><td class="price-val">' + esc(p.price_text || '-') + '</td>' +
          '<td>' + (p.insurance_covered ? '<span class="badge-ins">보험적용</span>' : '-') + '</td>' +
          '<td>' + esc(p.note || '') + '</td></tr>';
      });
      html += '</tbody></table></div>';
      html += '<p class="treat-price-note">※ 환자 상태에 따라 비용이 달라질 수 있습니다. 정확한 비용은 내원 상담 후 안내해 드립니다.</p>';
      html += '</div></section>';
    }

    // Doctors
    if (doctors.length > 0) {
      html += '<section class="treat-section"><div class="container-wide">';
      html += '<h2 class="treat-section-title">담당 의료진</h2>';
      html += '<div class="treat-doctors">';
      doctors.forEach(function (d) {
        var specs = safeJSON(d.specialties);
        html += '<a href="/doctors/' + d.slug + '" class="treat-doctor-card" data-hover>' +
          (d.photo ? '<img src="' + d.photo + '" alt="' + esc(d.name) + ' ' + esc(d.title || '') + '" loading="lazy"/>' : '<div class="treat-doctor-no-photo">' + esc(d.name.charAt(0)) + '</div>') +
          '<div class="treat-doctor-info">' +
          '<h4>' + esc(d.name) + ' <span>' + esc(d.title || '') + '</span></h4>' +
          (specs.length ? '<p>' + specs.map(esc).join(' · ') + '</p>' : '') +
          (d.is_primary ? '<span class="primary-badge">주 담당</span>' : '') +
          '</div></a>';
      });
      html += '</div></div></section>';
    }

    // FAQ
    if (faqs.length > 0) {
      html += '<section class="treat-section bg-alt"><div class="container-wide">';
      html += '<h2 class="treat-section-title">' + esc(t.name) + ' 자주 묻는 질문</h2>';
      html += '<div class="treat-faq-list">';
      faqs.forEach(function (f, i) {
        html += '<div class="treat-faq-item">' +
          '<button class="treat-faq-q" onclick="this.parentElement.classList.toggle(\'open\')">' +
          '<span class="treat-faq-num">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<span>Q. ' + esc(f.question) + '</span>' +
          '<span class="treat-faq-toggle">+</span></button>' +
          '<div class="treat-faq-a"><p>' + esc(f.answer).replace(/\\n/g, '<br>') + '</p></div></div>';
      });
      html += '</div></div></section>';
    }

    // Related Dictionary Terms
    if (dictTerms.length > 0) {
      html += '<section class="treat-section"><div class="container-wide">';
      html += '<h2 class="treat-section-title">관련 치과 용어</h2>';
      html += '<div class="treat-dict-grid">';
      dictTerms.forEach(function (d) {
        html += '<a href="/dictionary/' + d.slug + '" class="treat-dict-card" data-hover>' +
          '<h4>' + esc(d.term) + '</h4>' +
          (d.english ? '<span class="treat-dict-en">' + esc(d.english) + '</span>' : '') +
          '<p>' + esc((d.short_desc || '').substring(0, 60)) + '</p></a>';
      });
      html += '</div></div></section>';
    }

    // Related Cases
    if (cases.length > 0) {
      html += '<section class="treat-section bg-alt"><div class="container-wide">';
      html += '<h2 class="treat-section-title">관련 비포애프터</h2>';
      html += '<div class="treat-cases-grid">';
      cases.forEach(function (c) {
        html += '<a href="/cases/' + c.id + '" class="treat-case-thumb" data-hover>' +
          (c.pano_after ? '<img src="' + c.pano_after + '" alt="' + esc(c.title || '') + '" loading="lazy"/>' : '<div class="no-img">CASE</div>') +
          '<span>' + esc(c.title || '') + '</span></a>';
      });
      html += '</div>' +
        '<div class="text-center mt-2"><a href="/cases" class="treat-more-link">비포애프터 더보기 →</a></div>';
      html += '</div></section>';
    }

    // CTA
    html += '<section class="treat-section treat-cta-bottom"><div class="container-wide">' +
      '<div class="treat-cta-card">' +
      '<h3>' + (t.cta_text || esc(t.name) + ', 이음치과에서 상담받아 보세요') + '</h3>' +
      '<div class="treat-cta-actions">' +
      '<a href="tel:051-206-5888" class="treat-cta-btn primary">051-206-5888 전화 상담</a>' +
      '<a href="/faq" class="treat-cta-btn secondary">자주 묻는 질문</a>' +
      '</div></div></div></section>';

    contentEl.innerHTML = html;
    observeReveal();
  }

  function safeJSON(str) {
    if (!str) return [];
    if (typeof str === 'object') return str;
    try { return JSON.parse(str); } catch (e) { return []; }
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function observeReveal() {
    document.querySelectorAll('[data-reveal]:not(.visible)').forEach(function (el) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.05 });
      obs.observe(el);
    });
  }
})();
