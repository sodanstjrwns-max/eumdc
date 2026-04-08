export function adminPage() {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>이음치과 관리자</title>
        <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="/static/admin.css" rel="stylesheet" />
      </head>
      <body>
        <div id="adminApp">
          {/* Login Screen */}
          <div id="loginScreen" class="admin-login">
            <div class="login-card">
              <div class="login-brand">이음</div>
              <h2>관리자 로그인</h2>
              <form id="loginForm">
                <input type="password" id="loginPw" placeholder="비밀번호 입력" autocomplete="current-password" />
                <button type="submit">로그인</button>
                <p id="loginError" class="error-msg" style="display:none">비밀번호가 올바르지 않습니다</p>
              </form>
            </div>
          </div>

          {/* Admin Dashboard */}
          <div id="dashboard" style="display:none">
            <header class="admin-header">
              <a href="/" class="admin-brand">이음 관리자</a>
              <nav class="admin-nav">
                <button class="admin-tab active" data-tab="cases">비포애프터</button>
                <button class="admin-tab" data-tab="blogs">블로그</button>
                <button class="admin-tab" data-tab="notices">공지사항</button>
                <button class="admin-tab" data-tab="faq">FAQ</button>
              </nav>
              <button id="logoutBtn" class="admin-logout">로그아웃</button>
            </header>

            {/* ===== CASES TAB ===== */}
            <div class="admin-panel active" id="panel-cases">
              <div class="panel-header">
                <h2>비포애프터 관리</h2>
                <button class="btn-primary" id="newCaseBtn">+ 새 케이스</button>
              </div>
              <div class="admin-list" id="casesList"></div>

              {/* Case Form Modal */}
              <div class="modal-overlay" id="caseModal" style="display:none">
                <div class="modal-card">
                  <div class="modal-header">
                    <h3 id="caseModalTitle">새 케이스 등록</h3>
                    <button class="modal-close" data-close="caseModal">&times;</button>
                  </div>
                  <form id="caseForm" class="admin-form">
                    <input type="hidden" id="caseId" />
                    <div class="form-group">
                      <label>제목</label>
                      <input type="text" id="caseTitle" placeholder="예: 임플란트 2개 식립 케이스" required />
                    </div>
                    <div class="form-group">
                      <label>카테고리</label>
                      <select id="caseCategory">
                        <option value="implant">임플란트</option>
                        <option value="aesthetic">심미보철</option>
                        <option value="resin">심미 레진</option>
                        <option value="tmj">턱관절</option>
                        <option value="general">일반진료</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>설명</label>
                      <textarea id="caseDesc" rows={3} placeholder="케이스에 대한 간단한 설명"></textarea>
                    </div>
                    <div class="form-group">
                      <label>이미지 업로드 (올린 칸만 보임)</label>
                      <div class="case-images-grid">
                        <div class="case-img-slot" data-slot="pano_before">
                          <div class="img-slot-label">파노라마 (전)</div>
                          <div class="img-slot-preview" id="preview-pano_before"></div>
                          <input type="file" accept="image/*" data-target="pano_before" class="case-file-input" />
                          <input type="hidden" id="val-pano_before" />
                        </div>
                        <div class="case-img-slot" data-slot="pano_after">
                          <div class="img-slot-label">파노라마 (후)</div>
                          <div class="img-slot-preview" id="preview-pano_after"></div>
                          <input type="file" accept="image/*" data-target="pano_after" class="case-file-input" />
                          <input type="hidden" id="val-pano_after" />
                        </div>
                        <div class="case-img-slot" data-slot="intra_before">
                          <div class="img-slot-label">구내사진 (전)</div>
                          <div class="img-slot-preview" id="preview-intra_before"></div>
                          <input type="file" accept="image/*" data-target="intra_before" class="case-file-input" />
                          <input type="hidden" id="val-intra_before" />
                        </div>
                        <div class="case-img-slot" data-slot="intra_after">
                          <div class="img-slot-label">구내사진 (후)</div>
                          <div class="img-slot-preview" id="preview-intra_after"></div>
                          <input type="file" accept="image/*" data-target="intra_after" class="case-file-input" />
                          <input type="hidden" id="val-intra_after" />
                        </div>
                      </div>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" data-close="caseModal">취소</button>
                      <button type="submit" class="btn-primary">저장</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ===== BLOGS TAB ===== */}
            <div class="admin-panel" id="panel-blogs">
              <div class="panel-header">
                <h2>블로그 관리</h2>
                <button class="btn-primary" id="newBlogBtn">+ 새 글</button>
              </div>
              <div class="admin-list" id="blogsList"></div>

              {/* Blog Form Modal */}
              <div class="modal-overlay" id="blogModal" style="display:none">
                <div class="modal-card modal-large">
                  <div class="modal-header">
                    <h3 id="blogModalTitle">새 블로그 글</h3>
                    <button class="modal-close" data-close="blogModal">&times;</button>
                  </div>
                  <form id="blogForm" class="admin-form">
                    <input type="hidden" id="blogId" />
                    <div class="form-group">
                      <label>제목</label>
                      <input type="text" id="blogTitle" placeholder="블로그 제목" required />
                    </div>
                    <div class="form-group">
                      <label>본문</label>
                      <textarea id="blogContent" rows={8} placeholder="내용을 입력하세요"></textarea>
                    </div>
                    <div class="form-group">
                      <label>사진 업로드 (드래그 앤 드롭)</label>
                      <div class="dropzone" id="blogDropzone">
                        <div class="dropzone-msg">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <p>여기에 이미지를 드래그하거나 클릭하세요</p>
                          <span>JPG, PNG, WebP (최대 10장)</span>
                        </div>
                        <input type="file" id="blogFiles" accept="image/*" multiple style="display:none" />
                      </div>
                      <div class="blog-preview-grid" id="blogPreviewGrid"></div>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" data-close="blogModal">취소</button>
                      <button type="submit" class="btn-primary">저장</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ===== FAQ TAB ===== */}
            <div class="admin-panel" id="panel-faq">
              <div class="panel-header">
                <h2>FAQ 관리</h2>
                <button class="btn-primary" id="newFaqBtn">+ 새 FAQ</button>
              </div>
              <div class="admin-list" id="faqList"></div>

              {/* FAQ Form Modal */}
              <div class="modal-overlay" id="faqModal" style="display:none">
                <div class="modal-card">
                  <div class="modal-header">
                    <h3 id="faqModalTitle">새 FAQ 등록</h3>
                    <button class="modal-close" data-close="faqModal">&times;</button>
                  </div>
                  <form id="faqForm" class="admin-form">
                    <input type="hidden" id="faqId" />
                    <div class="form-group">
                      <label>카테고리</label>
                      <select id="faqCategory"></select>
                    </div>
                    <div class="form-group">
                      <label>질문</label>
                      <input type="text" id="faqQuestion" placeholder="자주 묻는 질문을 입력하세요" required />
                    </div>
                    <div class="form-group">
                      <label>답변</label>
                      <textarea id="faqAnswer" rows={5} placeholder="답변을 입력하세요" required></textarea>
                    </div>
                    <div class="form-group">
                      <label>정렬 순서</label>
                      <input type="number" id="faqSortOrder" value="0" min="0" />
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" data-close="faqModal">취소</button>
                      <button type="submit" class="btn-primary">저장</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ===== NOTICES TAB ===== */}
            <div class="admin-panel" id="panel-notices">
              <div class="panel-header">
                <h2>공지사항 관리</h2>
                <button class="btn-primary" id="newNoticeBtn">+ 새 공지</button>
              </div>
              <div class="admin-list" id="noticesList2"></div>

              {/* Notice Form Modal */}
              <div class="modal-overlay" id="noticeModal" style="display:none">
                <div class="modal-card">
                  <div class="modal-header">
                    <h3 id="noticeModalTitle">새 공지사항</h3>
                    <button class="modal-close" data-close="noticeModal">&times;</button>
                  </div>
                  <form id="noticeForm" class="admin-form">
                    <input type="hidden" id="noticeId" />
                    <div class="form-group">
                      <label>제목</label>
                      <input type="text" id="noticeTitle" placeholder="공지 제목" required />
                    </div>
                    <div class="form-group">
                      <label>내용</label>
                      <textarea id="noticeContent" rows={6} placeholder="공지 내용을 입력하세요"></textarea>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="noticePinned" />
                        상단 고정
                      </label>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" data-close="noticeModal">취소</button>
                      <button type="submit" class="btn-primary">저장</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <script src="/static/admin.js"></script>
      </body>
    </html>
  )
}
