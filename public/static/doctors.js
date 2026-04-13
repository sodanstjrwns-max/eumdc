/* ============================================
   이음치과 — Doctors (의료진) Page Scripts
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initDoctorsList();
    initDoctorDetail();
  });

  // === 의료진 목록 ===
  function initDoctorsList() {
    var grid = document.getElementById('doctorsGrid');
    if (!grid) return;

    fetch('/api/doctors').then(function (r) { return r.json(); }).then(function (data) {
      var doctors = data.doctors || [];
      if (doctors.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>등록된 의료진이 없습니다.</p></div>';
        return;
      }

      var html = '';
      doctors.forEach(function (d) {
        var specs = safeJSON(d.specialties);
        html += '<a href="/doctors/' + d.slug + '" class="doctor-card" data-hover>';
        html += '<div class="doctor-card-photo">';
        if (d.photo) {
          html += '<img src="' + d.photo + '" alt="' + esc(d.name) + ' ' + esc(d.title || '') + '" loading="lazy"/>';
        } else {
          html += '<div class="doctor-card-initial">' + esc(d.name.charAt(0)) + '</div>';
        }
        html += '</div>';
        html += '<div class="doctor-card-info">';
        html += '<span class="doctor-card-title">' + esc(d.title || '원장') + '</span>';
        html += '<h3 class="doctor-card-name">' + esc(d.name) + '</h3>';
        if (d.name_en) html += '<span class="doctor-card-en">' + esc(d.name_en) + '</span>';
        if (specs.length > 0) {
          html += '<div class="doctor-card-specs">';
          specs.forEach(function (s) { html += '<span>' + esc(s) + '</span>'; });
          html += '</div>';
        }
        html += '</div>';
        html += '<span class="doctor-card-arrow">자세히 보기 →</span>';
        html += '</a>';
      });
      grid.innerHTML = html;
    });
  }

  // === 의료진 상세 ===
  function initDoctorDetail() {
    var el = document.getElementById('doctorDetailContent');
    if (!el) return;
    var slug = el.dataset.slug;

    fetch('/api/doctors/' + slug).then(function (r) {
      if (!r.ok) throw new Error('Not found');
      return r.json();
    }).then(function (data) {
      renderDoctorDetail(el, data);
    }).catch(function () {
      el.innerHTML = '<div class="container-wide"><div class="empty-state"><p>의료진 정보를 찾을 수 없습니다.</p></div></div>';
    });
  }

  function renderDoctorDetail(el, data) {
    var d = data.doctor;
    var treatments = data.treatments || [];
    var cases = data.cases || [];
    var education = safeJSON(d.education);
    var career = safeJSON(d.career);
    var certs = safeJSON(d.certifications);
    var memberships = safeJSON(d.memberships);
    var specs = safeJSON(d.specialties);

    var html = '';

    // Profile Section
    html += '<section class="doctor-profile"><div class="container-wide"><div class="doctor-profile-grid">';
    html += '<div class="doctor-profile-photo">';
    if (d.photo) {
      html += '<img src="' + d.photo + '" alt="' + esc(d.name) + ' ' + esc(d.title || '') + '"/>';
    } else {
      html += '<div class="doctor-profile-initial">' + esc(d.name.charAt(0)) + '</div>';
    }
    html += '</div>';

    html += '<div class="doctor-profile-info">';
    html += '<span class="doctor-profile-title">' + esc(d.title || '원장') + '</span>';
    html += '<h1 class="doctor-profile-name">' + esc(d.name) + '</h1>';
    if (d.name_en) html += '<span class="doctor-profile-en">' + esc(d.name_en) + '</span>';

    if (d.greeting) {
      html += '<blockquote class="doctor-greeting">"' + esc(d.greeting) + '"</blockquote>';
    }
    if (d.philosophy) {
      html += '<p class="doctor-philosophy">' + esc(d.philosophy) + '</p>';
    }

    if (specs.length > 0) {
      html += '<div class="doctor-spec-tags">';
      specs.forEach(function (s) { html += '<span class="spec-tag">' + esc(s) + '</span>'; });
      html += '</div>';
    }
    html += '</div></div></div></section>';

    // Credentials
    html += '<section class="doctor-credentials"><div class="container-wide">';
    html += '<div class="cred-grid">';

    if (education.length > 0) {
      html += '<div class="cred-block" data-reveal><h3>Education</h3><ul>';
      education.forEach(function (e) {
        html += '<li>' + (e.year ? '<span class="cred-year">' + e.year + '</span> ' : '') + esc(e.school || e.name || '') + (e.degree ? ' (' + esc(e.degree) + ')' : '') + '</li>';
      });
      html += '</ul></div>';
    }

    if (career.length > 0) {
      html += '<div class="cred-block" data-reveal><h3>Career</h3><ul>';
      career.forEach(function (e) {
        html += '<li>' + (e.year ? '<span class="cred-year">' + e.year + '</span> ' : '') + esc(e.org || '') + (e.role ? ' ' + esc(e.role) : '') + '</li>';
      });
      html += '</ul></div>';
    }

    if (memberships.length > 0) {
      html += '<div class="cred-block" data-reveal><h3>Membership</h3><ul>';
      memberships.forEach(function (m) {
        html += '<li>' + esc(m.org || m.name || m) + (m.role ? ' (' + esc(m.role) + ')' : '') + '</li>';
      });
      html += '</ul></div>';
    }

    if (certs.length > 0) {
      html += '<div class="cred-block" data-reveal><h3>Certification & Training</h3><ul>';
      certs.forEach(function (c) {
        html += '<li>' + esc(c.name || c) + (c.org ? ' (' + esc(c.org) + ')' : '') + '</li>';
      });
      html += '</ul></div>';
    }

    html += '</div></div></section>';

    // Treatments
    if (treatments.length > 0) {
      html += '<section class="doctor-treatments"><div class="container-wide">';
      html += '<h2 class="doctor-section-title">담당 진료</h2>';
      html += '<div class="doctor-treat-grid">';
      treatments.forEach(function (t) {
        html += '<a href="/treatments/' + t.slug + '" class="doctor-treat-card" data-hover>' +
          '<h4>' + esc(t.name) + '</h4>' +
          '<p>' + esc(t.short_desc || '') + '</p>' +
          (t.is_primary ? '<span class="primary-badge">주 담당</span>' : '') +
          '</a>';
      });
      html += '</div></div></section>';
    }

    // Cases
    if (cases.length > 0) {
      html += '<section class="doctor-cases"><div class="container-wide">';
      html += '<h2 class="doctor-section-title">담당 비포애프터</h2>';
      html += '<div class="doctor-cases-grid">';
      cases.forEach(function (c) {
        html += '<a href="/cases/' + c.id + '" class="treat-case-thumb" data-hover>' +
          (c.pano_after ? '<img src="' + c.pano_after + '" alt="' + esc(c.title || '') + '" loading="lazy"/>' : '<div class="no-img">CASE</div>') +
          '<span>' + esc(c.title || '') + '</span></a>';
      });
      html += '</div></div></section>';
    }

    // CTA
    html += '<section class="doctor-cta"><div class="container-wide">' +
      '<div class="treat-cta-card"><h3>' + esc(d.name) + ' ' + esc(d.title || '원장') + '에게 상담받아 보세요</h3>' +
      '<a href="tel:051-206-5888" class="treat-cta-btn primary">051-206-5888 전화 상담</a>' +
      '</div></div></section>';

    el.innerHTML = html;
    observeReveal();
  }

  function safeJSON(str) {
    if (!str) return [];
    if (typeof str === 'object') return Array.isArray(str) ? str : [];
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
