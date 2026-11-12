/** 2026-11 리뉴얼 공통 틀 — 내비 · 전체 메뉴 · 바닥(연락처+푸터) · 모바일 고정 바
 *  홈과 하위 페이지가 같은 마크업을 쓴다. 스타일 /static/renew.css, 동작 /static/renew.js (클래스는 전부 rn- 접두사)
 */
const NAVER_BOOKING = 'https://m.place.naver.com/hospital/2005922467/booking'
const NAVER_PLACE = 'https://m.place.naver.com/hospital/2005922467'
const KAKAO = 'http://pf.kakao.com/_diyyn'

const MENU: [string, string][] = [
  ['/', '홈'],
  ['/about', '병원 소개'],
  ['/doctors', '의료진'],
  ['/treatments', '진료 안내'],
  ['/cases', '비포애프터'],
  ['/prices', '비용 안내'],
  ['/blogs', '블로그'],
  ['/faq', '자주 묻는 질문'],
  ['/dictionary', '백과사전'],
  ['/visit', '내원 안내'],
  ['/notices', '공지사항'],
]

export function rnNav(home: boolean) {
  return (
    <>
      <div class="rn-dot" aria-hidden="true"></div>
      <header class={`rn rn-nav${home ? '' : ' rn-solid rn-sub'}`} id="rnNav">
        <a class="rn-brand" href="/" aria-label="이음치과의원 홈" data-hover>
          <img class="rn-sym rn-sym-c" src="/static/images/symbol-240.png" alt="이음치과의원 로고" width="30" height="33" />
          <img class="rn-sym rn-sym-w" src="/static/images/symbol-white.png" alt="" width="30" height="33" />
          <span class="rn-name">이음치과</span>
          <span class="rn-name-sub">IEUM · MYEONGJI</span>
        </a>
        <nav class="rn-links" aria-label="주요 메뉴">
          <a href="/about" data-hover>병원 소개</a>
          <a href="/doctors" data-hover>의료진</a>
          <a href="/treatments" data-hover>진료 안내</a>
          <a href="/prices" data-hover>비용 안내</a>
          <a href="/visit" data-hover>내원 안내</a>
        </nav>
        <div class="rn-cta">
          <span class="rn-live" id="rnLive"><i></i><b>월–금 12–21 · 토 10–17</b></span>
          {/* 로그인 상태 표시 — sub.js 가 display 를 켠다 (하위 페이지) */}
          <div class="rn-user" id="navUser" style="display:none">
            <span id="navUserName"></span>
            <button id="navLogoutBtn" type="button" data-hover>로그아웃</button>
          </div>
          <div class="rn-user" id="navAuth" style="display:none">
            <a href="/login" data-hover>로그인</a>
          </div>
          <a class="rn-btn rn-btn-s rn-btn-mint" href={NAVER_BOOKING} target="_blank" rel="noopener" data-hover>네이버 예약</a>
          <button class="rn-burger" id="rnMenuBtn" type="button" aria-label="전체 메뉴 열기" aria-expanded="false" aria-controls="rnMenu" data-hover>
            <i></i><i></i>
          </button>
        </div>
      </header>

      <div class="rn rn-menu" id="rnMenu" aria-hidden="true">
        <div class="rn-menu-in">
          <nav class="rn-menu-links" aria-label="전체 메뉴">
            {MENU.map(([href, label], i) => (
              <a href={href} data-hover><small>{String(i).padStart(2, '0')}</small><span>{label}</span></a>
            ))}
          </nav>
          <div class="rn-menu-side">
            <div><h3>LOCATION</h3><p>부산 강서구 명지국제8로 265, 201호</p></div>
            <div><h3>HOURS</h3><p>월–금 12:00–21:00<br />토 10:00–17:00 · 일 휴무</p></div>
            <div>
              <h3>CONTACT</h3>
              <p><a href="tel:051-206-5888">051-206-5888</a></p>
              <p><a href={KAKAO} target="_blank" rel="noopener">카카오톡 상담 →</a></p>
              <p><a href={NAVER_BOOKING} target="_blank" rel="noopener">네이버 예약 →</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export function rnFooter() {
  return (
    <>
      <section class="rn rn-visit" id="visit" aria-label="오시는 길·예약">
        <div class="rn-wrap">
          <p class="rn-eyebrow">CONTACT</p>
          <a class="rn-tel" href="tel:051-206-5888" data-hover aria-label="전화 051-206-5888"><span class="l">051</span><span class="l">206</span><span class="l rn-mint">5888</span></a>
          <div class="rn-visit-grid">
            <div><h3>주소</h3><p>부산광역시 강서구 명지국제8로 265, 201호 (명지동)<br />이음치과의원</p></div>
            <div><h3>자차</h3><p>네비 ‘이음치과의원’ 검색 · 주차 2시간 지원<br />건물 뒷편 주차장 (하이마트 옆)</p></div>
            <div><h3>버스</h3><p>국민은행명지국제신도시지점 정류장<br />강서구 8, 8-1, 21, 124 (도보 1분)</p></div>
            <div><h3>진료 시간</h3><p>월–금 12:00–21:00 · 토 10:00–17:00<br />일요일·공휴일 휴진 (대체공휴일 진료)</p></div>
          </div>
          <div class="rn-visit-cta">
            <a class="rn-btn rn-btn-mint rn-btn-l" href={NAVER_BOOKING} target="_blank" rel="noopener" data-hover>네이버 예약 →</a>
            <a class="rn-btn rn-btn-kakao rn-btn-l" href={KAKAO} target="_blank" rel="noopener" data-hover>카카오톡 상담 →</a>
            <a class="rn-btn rn-btn-line rn-btn-l" href={NAVER_PLACE} target="_blank" rel="noopener" data-hover>네이버 지도 →</a>
          </div>
        </div>
        <footer class="rn-foot" role="contentinfo">
          <div class="rn-wrap">
            <div class="rn-foot-top">
              <img src="/static/images/symbol-white.png" alt="" width="34" height="38" loading="lazy" />
              <b>이음치과</b>
              <span>실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</span>
            </div>
            <div class="rn-foot-cols">
              <div><h4>진료</h4><a href="/treatments">진료 안내</a><a href="/prices">비용 안내</a><a href="/doctors">의료진 소개</a><a href="/cases">비포애프터</a><a href="/faq">자주 묻는 질문</a></div>
              <div><h4>콘텐츠</h4><a href="/blogs">블로그</a><a href="/dictionary">치과 백과사전</a><a href="/notices">공지사항</a></div>
              <div><h4>안내</h4><a href="/about">병원 소개</a><a href="/visit">내원 안내</a><a href="/regions/myeongji">명지 치과</a><a href="https://www.instagram.com/ieumdental/" target="_blank" rel="noopener">인스타그램</a></div>
            </div>
            <p class="rn-foot-biz">이음치과의원 · 대표원장 최효영 · 사업자등록번호 624-45-01223<br />부산광역시 강서구 명지국제8로 265, 201호 (명지동) · TEL 051-206-5888</p>
            <p class="rn-foot-copy">
              <span>&copy; 2025 이음치과의원. All rights reserved.</span>
              <a href="/about">개인정보처리방침</a><a href="/about">이용약관</a>
            </p>
          </div>
        </footer>
      </section>

      <nav class="rn rn-dock" aria-label="빠른 상담">
        <a href={KAKAO} target="_blank" rel="noopener">카카오</a>
        <a href={NAVER_BOOKING} target="_blank" rel="noopener" class="on">예약</a>
        <a href="tel:051-206-5888">전화</a>
      </nav>
    </>
  )
}
