/** Sub-page layout wrapper: nav + content + footer + floating CTA */
export function subPageLayout(title: string, children: any) {
  return (
    <div id="app" class="sub-page">
      {/* Custom Cursor */}
      <div class="cursor" id="cursor"></div>
      <div class="cursor-follower" id="cursorFollower"></div>

      {/* Navigation */}
      <nav id="nav" class="scrolled" role="navigation" aria-label="서브페이지 네비게이션">
        <a href="/" class="nav-brand" data-hover>이음</a>
        <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" class="nav-booking" data-hover>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
          <span>네이버 예약</span>
        </a>
        <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" class="nav-kakao" data-hover>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.21 4.65 6.6-.15.56-.96 3.56-.99 3.78 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.83.55.08 1.13.12 1.73.12 5.52 0 10-3.58 10-7.92C22 6.58 17.52 3 12 3z"/></svg>
          <span>카카오 상담</span>
        </a>
        <div class="nav-right">
          {/* User auth state indicator */}
          <div class="nav-user" id="navUser" style="display:none">
            <span class="nav-user-name" id="navUserName"></span>
            <button class="nav-user-logout" id="navLogoutBtn" data-hover>로그아웃</button>
          </div>
          <div class="nav-auth" id="navAuth" style="display:none">
            <a href="/login" class="nav-login-btn" data-hover>로그인</a>
          </div>
          <button class="nav-menu-btn" id="menuBtn" data-hover>
            <span>MENU</span>
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div id="fullMenu" class="full-menu">
        <div class="menu-overlay"></div>
        <div class="menu-content">
          <div class="menu-links">
            <a href="/" class="menu-link" data-hover data-index="00"><span data-text="홈">홈</span></a>
            <a href="/about" class="menu-link" data-hover data-index="01"><span data-text="병원 소개">병원 소개</span></a>
            <a href="/doctors" class="menu-link" data-hover data-index="02"><span data-text="의료진">의료진</span></a>
            <a href="/treatments" class="menu-link" data-hover data-index="03"><span data-text="진료 안내">진료 안내</span></a>
            <a href="/cases" class="menu-link" data-hover data-index="04"><span data-text="비포애프터">비포애프터</span></a>
            <a href="/blogs" class="menu-link" data-hover data-index="05"><span data-text="블로그">블로그</span></a>
            <a href="/faq" class="menu-link" data-hover data-index="06"><span data-text="자주 묻는 질문">자주 묻는 질문</span></a>
            <a href="/dictionary" class="menu-link" data-hover data-index="07"><span data-text="백과사전">백과사전</span></a>
            <a href="/visit" class="menu-link" data-hover data-index="08"><span data-text="내원 안내">내원 안내</span></a>
            <a href="/notices" class="menu-link" data-hover data-index="09"><span data-text="공지사항">공지사항</span></a>
          </div>
          <div class="menu-footer">
            <div class="menu-footer-col">
              <span class="menu-label">LOCATION</span>
              <p>부산 강서구 명지국제8로 265</p>
            </div>
            <div class="menu-footer-col">
              <span class="menu-label">CONTACT</span>
              <p><a href="tel:051-206-5888">051-206-5888</a></p>
              <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" class="menu-kakao-link">카카오톡 상담 →</a>
            </div>
            <div class="menu-footer-col">
              <span class="menu-label">HOURS</span>
              <p>월-목 12-21 / 토-일 10-17</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main class="sub-page-content" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer class="footer-full" role="contentinfo">
        <div class="container-wide">
          <div class="footer-top-grid">
            <div class="footer-brand-col">
              <div class="footer-brand-big">이음</div>
              <p class="footer-tagline">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
              <div class="footer-sns">
                <a href="https://www.instagram.com/eum.dental/" target="_blank" rel="noopener" aria-label="인스타그램">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                </a>
                <a href="https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90" target="_blank" rel="noopener" aria-label="네이버 지도">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </a>
                <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" aria-label="카카오톡 상담" class="footer-sns-kakao">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.21 4.65 6.6-.15.56-.96 3.56-.99 3.78 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.83.55.08 1.13.12 1.73.12 5.52 0 10-3.58 10-7.92C22 6.58 17.52 3 12 3z"/></svg>
                </a>
              </div>
            </div>
            <div class="footer-nav-col">
              <h4>진료</h4>
              <a href="/treatments">진료 안내</a>
              <a href="/doctors">의료진 소개</a>
              <a href="/cases">비포애프터</a>
            </div>
            <div class="footer-nav-col">
              <h4>콘텐츠</h4>
              <a href="/blogs">블로그</a>
              <a href="/dictionary">백과사전</a>
              <a href="/notices">공지사항</a>
            </div>
            <div class="footer-nav-col">
              <h4>안내</h4>
              <a href="/about">병원 소개</a>
              <a href="/visit">내원 안내</a>
              <a href="tel:051-206-5888">전화 상담</a>
              <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener">카카오톡 상담</a>
            </div>
          </div>
          <div class="footer-biz-info">
            <p>이음치과의원 | 대표원장: 최효영 | 부산광역시 강서구 명지국제8로 265 2층 | TEL: 051-206-5888</p>
          </div>
          <div class="footer-bottom-bar">
            <span>&copy; 2025 이음치과의원. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Floating CTA Group */}
      <div class="floating-cta-group visible" id="floatingCtaGroup">
        <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" class="floating-btn floating-kakao" data-hover aria-label="카카오톡 상담">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.86 5.21 4.65 6.6-.15.56-.96 3.56-.99 3.78 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.83.55.08 1.13.12 1.73.12 5.52 0 10-3.58 10-7.92C22 6.58 17.52 3 12 3z"/></svg>
        </a>
        <a href="tel:051-206-5888" class="floating-btn floating-call visible" id="floatingCall" data-hover aria-label="전화 상담">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </a>
      </div>

      <script src="/static/app.js"></script>
      <script src="/static/sub.js"></script>
      <script src="/static/gsap-init.js"></script>
    </div>
  )
}
