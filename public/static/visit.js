/* ============================================
   이음치과 — Visit Guide (내원안내) Page Scripts
   ============================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initVisitTabs();
    initPriceGuide();
  });

  function initVisitTabs() {
    var tabBar = document.getElementById('visitTabBar');
    if (!tabBar) return;

    tabBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.visit-tab');
      if (!btn) return;

      tabBar.querySelectorAll('.visit-tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var tab = btn.dataset.tab;
      document.getElementById('tabLocation').style.display = tab === 'location' ? '' : 'none';
      document.getElementById('tabHours').style.display = tab === 'hours' ? '' : 'none';
      document.getElementById('tabPrice').style.display = tab === 'price' ? '' : 'none';
    });
  }

  function initPriceGuide() {
    var el = document.getElementById('priceGuideContent');
    if (!el) return;

    fetch('/api/prices').then(function (r) { return r.json(); }).then(function (data) {
      var prices = data.prices || [];
      if (prices.length === 0) {
        el.innerHTML = '<div class="empty-state"><p>수가 정보를 준비 중입니다.</p></div>';
        return;
      }

      // Group by treatment — 엑셀에 가격 있는 진료만 표시
      // treatment_id가 NULL인 항목은 "구강관리" 그룹으로 묶음
      var groups = {};
      prices.forEach(function (p) {
        var key = p.treatment_slug || 'oral-care';
        if (!groups[key]) {
          groups[key] = {
            name: p.treatment_name || '구강관리',
            icon: p.treatment_icon || '',
            items: []
          };
        }
        groups[key].items.push(p);
      });

      var html = '';
      Object.keys(groups).forEach(function (key) {
        var g = groups[key];
        html += '<div class="price-group">';
        html += '<h3 class="price-group-title">' + esc(g.name) + '</h3>';
        html += '<table class="price-table"><thead><tr><th>항목</th><th>비용 (비급여)</th><th>비고</th></tr></thead><tbody>';
        g.items.forEach(function (p) {
          html += '<tr>' +
            '<td>' + esc(p.item_name) + '</td>' +
            '<td class="price-val">' + esc(p.price_text || '-') + '</td>' +
            '<td class="price-note">' + esc(p.note || '') + '</td>' +
            '</tr>';
        });
        html += '</tbody></table></div>';
      });

      el.innerHTML = html;
    }).catch(function () {
      el.innerHTML = '<div class="empty-state"><p>수가 정보를 불러올 수 없습니다.</p></div>';
    });
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
