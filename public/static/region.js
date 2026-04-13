/* SEO Region Landing Pages */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    initRegionDetail();
    initRegionsList();
  });

  function initRegionDetail() {
    var el = document.getElementById('regionHeroContent');
    if (!el) return;
    var slug = el.dataset.slug;

    fetch('/api/seo-regions/' + slug).then(function (r) { return r.json(); }).then(function (data) {
      var region = data.region;
      if (!region) {
        el.innerHTML = '<p>지역 정보를 찾을 수 없습니다.</p>';
        return;
      }

      el.innerHTML =
        '<span class="section-label light">' + (region.region_name || '') + '</span>' +
        '<h1 class="page-title">' + (region.h1_title || region.region_name + ' 치과 이음치과의원') + '</h1>' +
        '<p class="page-subtitle">' + (region.hero_text || region.meta_description || '') + '</p>';

      // Content section
      if (region.content) {
        var contentEl = document.createElement('section');
        contentEl.className = 'region-content';
        contentEl.innerHTML = '<div class="container-wide"><div class="region-content-body">' + region.content + '</div></div>';
        el.closest('.region-hero').insertAdjacentElement('afterend', contentEl);
      }

      // Load treatments
      loadRegionTreatments(region.target_treatments);
      // Load nearby info
      if (region.nearby_areas) {
        var nearby = document.createElement('div');
        nearby.className = 'region-nearby';
        nearby.innerHTML = '<p class="nearby-label">인근 지역:</p><p>' + region.nearby_areas + '</p>';
        el.appendChild(nearby);
      }
    }).catch(function () {
      el.innerHTML = '<p>데이터를 불러오는 중 오류가 발생했습니다.</p>';
    });

    // Load cases
    fetch('/api/cases?limit=4').then(function (r) { return r.json(); }).then(function (data) {
      var grid = document.getElementById('regionCaseGrid');
      if (!grid) return;
      var cases = data.cases || [];
      if (cases.length === 0) {
        grid.innerHTML = '<p class="empty-text">등록된 사례가 없습니다.</p>';
        return;
      }
      grid.innerHTML = '';
      cases.forEach(function (c) {
        var img = c.pano_before || c.intra_before || '';
        var card = document.createElement('a');
        card.href = '/cases/' + c.id;
        card.className = 'region-case-card';
        card.innerHTML = (img ? '<img src="' + img + '" alt="' + (c.title || '') + '" loading="lazy" />' : '') +
          '<div class="card-body"><h4>' + (c.title || '') + '</h4></div>';
        grid.appendChild(card);
      });
    });

    // Load FAQ
    fetch('/api/faq?category=all&limit=5').then(function (r) { return r.json(); }).then(function (data) {
      var list = document.getElementById('regionFaqList');
      if (!list) return;
      var faqs = data.faqs || [];
      list.innerHTML = '';
      faqs.forEach(function (f) {
        var item = document.createElement('details');
        item.className = 'region-faq-item';
        item.innerHTML = '<summary>' + (f.question || '') + '</summary><div class="faq-answer">' + (f.answer || '') + '</div>';
        list.appendChild(item);
      });
    }).catch(function () {});
  }

  function loadRegionTreatments(targetTreatments) {
    fetch('/api/treatments').then(function (r) { return r.json(); }).then(function (data) {
      var grid = document.getElementById('regionTreatGrid');
      if (!grid) return;
      var treatments = data.treatments || [];
      grid.innerHTML = '';
      treatments.slice(0, 6).forEach(function (t) {
        var card = document.createElement('a');
        card.href = '/treatments/' + t.slug;
        card.className = 'region-treat-card';
        card.innerHTML = '<div class="treat-icon">' + (t.icon || '🦷') + '</div><h4>' + t.name + '</h4><p>' + (t.short_desc || '') + '</p>';
        grid.appendChild(card);
      });
    });
  }

  function initRegionsList() {
    var grid = document.getElementById('regionsGrid');
    if (!grid || document.getElementById('regionHeroContent')) return;

    fetch('/api/seo-regions').then(function (r) { return r.json(); }).then(function (data) {
      var regions = data.regions || [];
      if (regions.length === 0) {
        grid.innerHTML = '<p class="empty-text">등록된 지역 페이지가 없습니다.</p>';
        return;
      }
      grid.innerHTML = '';
      regions.forEach(function (r) {
        var card = document.createElement('a');
        card.href = '/regions/' + r.slug;
        card.className = 'region-list-card';
        card.setAttribute('data-hover', '');
        card.innerHTML = '<h3>' + (r.h1_title || r.region_name) + '</h3><p>' + r.region_name + ' 치과 안내</p>';
        grid.appendChild(card);
      });
    });
  }
})();
