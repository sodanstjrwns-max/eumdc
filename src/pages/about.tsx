import { subPageLayout } from './layout'

/** 병원 미션 페이지 */
export function missionPage() {
  return subPageLayout('MISSION', (
    <div class="page-mission">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">ABOUT US</span>
          <h1 class="page-title">이음의 미션</h1>
          <p class="page-subtitle">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
        </div>
      </section>

      {/* Mission Statement */}
      <section class="mission-statement">
        <div class="container-wide">
          <div class="mission-manifesto" data-reveal>
            <div class="mission-quote-mark">"</div>
            <p class="mission-big-text">
              환자의 <em>불안</em>을 <em>확신</em>으로 바꾸고,<br/>
              이 곳이 <strong>정직하게 치료를 잘하는 병원</strong>이라며<br/>
              자신있게 추천할 수 있는 곳을 만듭니다.
            </p>
            <p class="mission-author">— 대표원장 최효영</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section class="mission-values">
        <div class="container-wide">
          <h2 class="mission-section-title">우리의 가치</h2>
          <div class="values-grid">
            <div class="value-card" data-reveal>
              <div class="value-num">01</div>
              <h3>투명성</h3>
              <p>모든 진료 과정을 환자가 충분히 이해할 때까지 설명합니다. 디지털 장비로 상태를 직접 보여드리고, 세컨드 오피니언도 솔직하게 드립니다.</p>
            </div>
            <div class="value-card" data-reveal>
              <div class="value-num">02</div>
              <h3>실력</h3>
              <p>진료 결과를 눈으로 직접 증명합니다. CBCT, 구강스캐너, 3D프린터 등 최첨단 디지털 장비와 최고 수준의 기공소 협업으로 정밀한 결과를 만듭니다.</p>
            </div>
            <div class="value-card" data-reveal>
              <div class="value-num">03</div>
              <h3>신뢰</h3>
              <p>필요 없는 치료는 권하지 않습니다. 발치보다 보존을 먼저 고민하고, 환자의 입장에서 최선의 선택을 함께합니다.</p>
            </div>
            <div class="value-card" data-reveal>
              <div class="value-num">04</div>
              <h3>공감</h3>
              <p>치과가 두려운 마음을 잘 압니다. 무통 마취와 세심한 배려로 편안해지도록 돕겠습니다. 퇴근 후에도, 주말에도 이음의 문은 열려 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment / Digital Dentistry */}
      <section class="mission-equipment">
        <div class="container-wide">
          <h2 class="mission-section-title">Digital Dentistry</h2>
          <p class="mission-equip-desc">이음치과는 최첨단 디지털 장비로 정밀한 진단과 치료를 제공합니다.</p>
          <div class="equip-showcase">
            <div class="equip-card" data-reveal>
              <div class="equip-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="24" r="18"/><path d="M24 12v24M12 24h24"/></svg>
              </div>
              <h4>CBCT</h4>
              <p>3차원 입체 영상으로 정밀 진단. 뼈의 상태, 신경 위치까지 정확히 파악합니다.</p>
            </div>
            <div class="equip-card" data-reveal>
              <div class="equip-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="12" width="32" height="24" rx="4"/><path d="M20 24h8M24 20v8"/></svg>
              </div>
              <h4>구강스캐너</h4>
              <p>디지털 인상 채득으로 기존 본뜨기의 불편함 없이 정밀한 데이터를 얻습니다.</p>
            </div>
            <div class="equip-card" data-reveal>
              <div class="equip-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 8l8 8-8 8M24 16h16v24H8V16"/></svg>
              </div>
              <h4>3D 프린터</h4>
              <p>원내에서 가이드를 직접 제작. 수술의 정확도와 안전성을 높입니다.</p>
            </div>
            <div class="equip-card" data-reveal>
              <div class="equip-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 12h24v24H12z"/><circle cx="24" cy="24" r="6"/></svg>
              </div>
              <h4>플라즈마 소독기</h4>
              <p>최첨단 감염관리 시스템으로 안전한 진료 환경을 유지합니다.</p>
            </div>
            <div class="equip-card" data-reveal>
              <div class="equip-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="24" cy="20" r="12"/><path d="M18 36h12"/></svg>
              </div>
              <h4>아쿠아케어</h4>
              <p>미세분말로 치아를 최소한으로 삭제하는 최소침습 치료 장비입니다.</p>
            </div>
            <div class="equip-card" data-reveal>
              <div class="equip-icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M24 8v32M16 16l8-8 8 8M16 32l8 8 8-8"/></svg>
              </div>
              <h4>니트람</h4>
              <p>정밀 근관치료 시스템. 복잡한 신경치료도 안전하고 정확하게 진행합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section class="mission-gallery">
        <div class="container-wide">
          <h2 class="mission-section-title">병원 둘러보기</h2>
          <div class="gallery-masonry">
            <div class="gallery-masonry-item" data-reveal><img src="/static/img/photo_7.jpg" alt="이음치과 접수 공간" loading="lazy" /><span>RECEPTION</span></div>
            <div class="gallery-masonry-item" data-reveal><img src="/static/img/photo_8.jpg" alt="이음치과 대기실" loading="lazy" /><span>WAITING AREA</span></div>
            <div class="gallery-masonry-item" data-reveal><img src="/static/img/photo_6.jpg" alt="이음치과 진료실" loading="lazy" /><span>TREATMENT ROOM</span></div>
            <div class="gallery-masonry-item" data-reveal><img src="/static/img/photo_4.jpg" alt="이음치과 내부" loading="lazy" /><span>INTERIOR</span></div>
            <div class="gallery-masonry-item" data-reveal><img src="/static/img/photo_9.jpg" alt="이음치과 편의공간" loading="lazy" /><span>AMENITY</span></div>
            <div class="gallery-masonry-item" data-reveal><img src="/static/img/photo_1.jpg" alt="이음치과 로비" loading="lazy" /><span>LOBBY</span></div>
          </div>
        </div>
      </section>
    </div>
  ))
}

/** 내원 안내 페이지 (오시는 길, 진료시간, 수가 안내) */
export function visitGuidePage() {
  return subPageLayout('VISIT GUIDE', (
    <div class="page-visit-guide">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">VISIT GUIDE</span>
          <h1 class="page-title">내원 안내</h1>
          <p class="page-subtitle">이음치과의원 오시는 길, 진료시간, 수가 안내입니다.</p>
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <section class="visit-tabs">
        <div class="container-wide">
          <div class="visit-tab-bar" id="visitTabBar">
            <button class="visit-tab active" data-tab="location">오시는 길</button>
            <button class="visit-tab" data-tab="hours">진료시간</button>
            <button class="visit-tab" data-tab="price">수가 안내</button>
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section class="visit-section" id="tabLocation">
        <div class="container-wide">
          <div class="visit-location-grid">
            <div class="visit-map-wrap">
              <div class="visit-map-placeholder" id="visitMap">
                <div class="map-static">
                  <div class="map-pin">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <p class="map-address">부산광역시 강서구 명지국제8로 265 2층</p>
                  <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" class="map-naver-btn">네이버 지도로 보기 →</a>
                </div>
              </div>
            </div>
            <div class="visit-info-cards">
              <div class="visit-info-card">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                  주소
                </h3>
                <p>부산광역시 강서구 명지국제8로 265 2층<br/>이음치과의원</p>
              </div>
              <div class="visit-info-card">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3"/></svg>
                  전화
                </h3>
                <p><a href="tel:051-206-5888" class="visit-phone-link">051-206-5888</a></p>
              </div>
              <div class="visit-info-card">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01M15 9h.01M8 14s1.5 2 4 2 4-2 4-2"/></svg>
                  자차 이용 시
                </h3>
                <p>네비게이션 '이음치과의원' 검색<br/>건물 뒷편 주차장 (하이마트 옆)<br/><strong>주차 2시간 무료 지원</strong></p>
              </div>
              <div class="visit-info-card">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3H7a2 2 0 00-2 2v14l7-3 7 3V5a2 2 0 00-2-2z"/></svg>
                  대중교통
                </h3>
                <p>국민은행명지국제신도시지점 정류장 하차<br/>강서구 8, 8-1, 21, 124번 (도보 1분)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 진료시간 */}
      <section class="visit-section" id="tabHours" style="display:none">
        <div class="container-wide">
          <div class="hours-table-wrap">
            <table class="hours-table">
              <thead>
                <tr><th>요일</th><th>진료시간</th><th>점심시간</th><th>비고</th></tr>
              </thead>
              <tbody>
                <tr><td>월요일</td><td>12:00 — 21:00</td><td>16:00 — 17:00</td><td>마지막 접수 20:30</td></tr>
                <tr><td>화요일</td><td>12:00 — 21:00</td><td>16:00 — 17:00</td><td>마지막 접수 20:30</td></tr>
                <tr><td>수요일</td><td>12:00 — 21:00</td><td>16:00 — 17:00</td><td>마지막 접수 20:30</td></tr>
                <tr><td>목요일</td><td>12:00 — 21:00</td><td>16:00 — 17:00</td><td>마지막 접수 20:30</td></tr>
                <tr class="closed"><td>금요일</td><td colspan={3}>정기 휴무</td></tr>
                <tr><td>토요일</td><td>10:00 — 17:00</td><td>13:00 — 14:00</td><td>마지막 접수 16:30</td></tr>
                <tr><td>일요일</td><td>10:00 — 17:00</td><td>13:00 — 14:00</td><td>마지막 접수 16:30</td></tr>
              </tbody>
            </table>
            <div class="hours-notice">
              <p>※ 공휴일은 휴진입니다. 대체공휴일은 정상 진료합니다.</p>
              <p>※ 응급 상황 시 전화 문의 부탁드립니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 수가 안내 */}
      <section class="visit-section" id="tabPrice" style="display:none">
        <div class="container-wide">
          <div id="priceGuideContent">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
          <div class="price-notice">
            <p>※ 위 금액은 참고용이며, 환자 상태에 따라 달라질 수 있습니다.</p>
            <p>※ 정확한 비용은 내원 후 상담을 통해 안내해 드립니다.</p>
            <p>※ 건강보험 적용 항목은 본인부담금만 표시됩니다.</p>
          </div>
        </div>
      </section>

      <script src="/static/visit.js"></script>
    </div>
  ))
}
