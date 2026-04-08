import { subPageLayout } from './layout'

export function loginPage() {
  return subPageLayout('로그인', (
    <div class="page-login">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">LOGIN</span>
          <h1 class="page-title">로그인</h1>
          <p class="page-subtitle">비포애프터 케이스 열람 등 이음치과 회원 전용 서비스를 이용하세요.</p>
        </div>
      </section>

      <section class="login-section">
        <div class="container-wide">
          <div class="login-page-card">
            <form id="userLoginForm" class="login-page-form" autocomplete="off">
              <div class="form-group">
                <label for="loginPhone">전화번호</label>
                <input type="tel" id="loginPhone" placeholder="010-1234-5678" required autocomplete="tel" />
              </div>
              <div class="form-group">
                <label for="loginPwUser">비밀번호</label>
                <input type="password" id="loginPwUser" placeholder="비밀번호 입력" required autocomplete="current-password" />
              </div>
              <p id="userLoginError" class="form-error" style="display:none"></p>
              <button type="submit" class="btn-signup">
                <span>로그인</span>
              </button>
              <p class="signup-login-link">아직 회원이 아니신가요? <a href="/signup">회원가입</a></p>
            </form>
          </div>
        </div>
      </section>
    </div>
  ))
}
