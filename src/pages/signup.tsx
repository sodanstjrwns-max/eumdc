import { subPageLayout } from './layout'

export function signupPage() {
  return subPageLayout('회원가입', (
    <div class="page-signup">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">SIGN UP</span>
          <h1 class="page-title">회원가입</h1>
          <p class="page-subtitle">이음치과 회원이 되시면 비포애프터 케이스를 확인하실 수 있습니다.</p>
        </div>
      </section>

      <section class="signup-section">
        <div class="container-wide">
          <div class="signup-card">
            <form id="signupForm" class="signup-form" autocomplete="off">
              {/* 기본정보 */}
              <div class="form-section">
                <h3 class="form-section-title">기본 정보</h3>

                <div class="form-group">
                  <label for="signupName">이름 <span class="required">*</span></label>
                  <input type="text" id="signupName" placeholder="홍길동" required autocomplete="name" />
                </div>

                <div class="form-group">
                  <label for="signupPhone">전화번호 <span class="required">*</span></label>
                  <input type="tel" id="signupPhone" placeholder="010-1234-5678" required autocomplete="tel" />
                  <span class="form-hint">로그인 시 아이디로 사용됩니다</span>
                </div>

                <div class="form-group">
                  <label for="signupPw">비밀번호 <span class="required">*</span></label>
                  <input type="password" id="signupPw" placeholder="6자 이상" required minlength={6} autocomplete="new-password" />
                </div>

                <div class="form-group">
                  <label for="signupPw2">비밀번호 확인 <span class="required">*</span></label>
                  <input type="password" id="signupPw2" placeholder="비밀번호 재입력" required minlength={6} autocomplete="new-password" />
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <label for="signupEmail">이메일</label>
                    <input type="email" id="signupEmail" placeholder="example@email.com" autocomplete="email" />
                  </div>
                  <div class="form-group">
                    <label for="signupBirth">생년월일</label>
                    <input type="date" id="signupBirth" />
                  </div>
                </div>

                <div class="form-group">
                  <label>성별</label>
                  <div class="radio-group">
                    <label class="radio-label"><input type="radio" name="gender" value="" checked /> 선택안함</label>
                    <label class="radio-label"><input type="radio" name="gender" value="M" /> 남성</label>
                    <label class="radio-label"><input type="radio" name="gender" value="F" /> 여성</label>
                  </div>
                </div>
              </div>

              {/* 동의 항목 */}
              <div class="form-section">
                <h3 class="form-section-title">약관 동의</h3>

                <div class="consent-all">
                  <label class="consent-label consent-all-label">
                    <input type="checkbox" id="consentAll" />
                    <span class="consent-check"></span>
                    <span>전체 동의합니다</span>
                  </label>
                </div>

                <div class="consent-divider"></div>

                <div class="consent-item">
                  <label class="consent-label">
                    <input type="checkbox" id="consentPrivacy" class="consent-check-input" required />
                    <span class="consent-check"></span>
                    <span><em class="consent-required">[필수]</em> 개인정보 수집·이용 동의</span>
                  </label>
                  <button type="button" class="consent-view-btn" data-consent="privacy">내용 보기</button>
                </div>

                <div class="consent-item">
                  <label class="consent-label">
                    <input type="checkbox" id="consentTerms" class="consent-check-input" required />
                    <span class="consent-check"></span>
                    <span><em class="consent-required">[필수]</em> 이용약관 동의</span>
                  </label>
                  <button type="button" class="consent-view-btn" data-consent="terms">내용 보기</button>
                </div>

                <div class="consent-item">
                  <label class="consent-label">
                    <input type="checkbox" id="consentMarketing" class="consent-check-input" />
                    <span class="consent-check"></span>
                    <span><em class="consent-optional">[선택]</em> 마케팅 활용 동의</span>
                  </label>
                  <button type="button" class="consent-view-btn" data-consent="marketing">내용 보기</button>
                </div>

                <div class="consent-sub" id="marketingSub" style="display:none">
                  <label class="consent-label consent-sub-label">
                    <input type="checkbox" id="consentSms" class="consent-marketing-sub" />
                    <span class="consent-check sm"></span>
                    <span>SMS 수신 동의</span>
                  </label>
                  <label class="consent-label consent-sub-label">
                    <input type="checkbox" id="consentEmailMkt" class="consent-marketing-sub" />
                    <span class="consent-check sm"></span>
                    <span>이메일 수신 동의</span>
                  </label>
                </div>

                <div class="consent-item">
                  <label class="consent-label">
                    <input type="checkbox" id="consentThirdParty" class="consent-check-input" />
                    <span class="consent-check"></span>
                    <span><em class="consent-optional">[선택]</em> 제3자 정보 제공 동의</span>
                  </label>
                  <button type="button" class="consent-view-btn" data-consent="thirdparty">내용 보기</button>
                </div>
              </div>

              {/* 동의 내용 모달 */}
              <div class="consent-modal" id="consentModal" style="display:none">
                <div class="consent-modal-card">
                  <div class="consent-modal-header">
                    <h3 id="consentModalTitle">약관 내용</h3>
                    <button type="button" class="consent-modal-close" id="consentModalClose">&times;</button>
                  </div>
                  <div class="consent-modal-body" id="consentModalBody"></div>
                </div>
              </div>

              <p id="signupError" class="form-error" style="display:none"></p>

              <button type="submit" class="btn-signup" id="signupSubmitBtn">
                <span>회원가입</span>
              </button>

              <p class="signup-login-link">이미 회원이신가요? <a href="/login">로그인</a></p>
            </form>
          </div>
        </div>
      </section>
    </div>
  ))
}
