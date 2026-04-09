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
        <div class="nav-center">{title}</div>
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
            <a href="/cases" class="menu-link" data-hover data-index="01"><span data-text="비포애프터">비포애프터</span></a>
            <a href="/blogs" class="menu-link" data-hover data-index="02"><span data-text="블로그">블로그</span></a>
            <a href="/notices" class="menu-link" data-hover data-index="03"><span data-text="공지사항">공지사항</span></a>
            <a href="/faq" class="menu-link" data-hover data-index="04"><span data-text="자주 묻는 질문">자주 묻는 질문</span></a>
            <a href="/#section-services" class="menu-link" data-hover data-index="05"><span data-text="진료안내">진료안내</span></a>
            <a href="/#section-director" class="menu-link" data-hover data-index="06"><span data-text="의료진">의료진</span></a>
            <a href="/#section-contact" class="menu-link" data-hover data-index="07"><span data-text="예약">예약</span></a>
          </div>
          <div class="menu-footer">
            <div class="menu-footer-col">
              <span class="menu-label">LOCATION</span>
              <p>부산 강서구 명지국제8로 265</p>
            </div>
            <div class="menu-footer-col">
              <span class="menu-label">CONTACT</span>
              <p><a href="tel:051-206-5888">051-206-5888</a></p>
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
      <footer class="footer-minimal" role="contentinfo">
        <div class="container-wide">
          <div class="footer-top">
            <div class="footer-brand-big">이음</div>
            <p class="footer-tagline">실력으로 신뢰를, 신뢰로 마음까지 잇습니다.</p>
          </div>
          <div class="footer-bottom-bar">
            <span>&copy; 2025 이음치과의원. 대표원장 최효영</span>
            <span><a href="mailto:hyogunim@gmail.com">hyogunim@gmail.com</a></span>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <a href="tel:051-206-5888" class="floating-call visible" id="floatingCall" data-hover aria-label="이음치과 전화상담 051-206-5888">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </a>

      <script src="/static/app.js"></script>
      <script src="/static/sub.js"></script>
    </div>
  )
}
