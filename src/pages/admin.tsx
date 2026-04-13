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
                <button class="admin-tab active" data-tab="dashboard">대시보드</button>
                <button class="admin-tab" data-tab="cases">비포애프터</button>
                <button class="admin-tab" data-tab="blogs">블로그</button>
                <button class="admin-tab" data-tab="notices">공지사항</button>
                <button class="admin-tab" data-tab="faq">FAQ</button>
                <button class="admin-tab" data-tab="users">회원관리</button>
              </nav>
              <button id="logoutBtn" class="admin-logout">로그아웃</button>
            </header>

            {/* ===== DASHBOARD TAB ===== */}
            <div class="admin-panel active" id="panel-dashboard">
              <div class="panel-header">
                <h2>대시보드</h2>
              </div>
              <div class="stats-grid" id="statsGrid">
                <div class="stat-card">
                  <div class="stat-icon">👤</div>
                  <div class="stat-info">
                    <span class="stat-value" id="statUsers">-</span>
                    <span class="stat-label">총 회원수</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📈</div>
                  <div class="stat-info">
                    <span class="stat-value" id="statRecent">-</span>
                    <span class="stat-label">최근 7일 가입</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📣</div>
                  <div class="stat-info">
                    <span class="stat-value" id="statMarketing">-</span>
                    <span class="stat-label">마케팅 동의</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📷</div>
                  <div class="stat-info">
                    <span class="stat-value" id="statCases">-</span>
                    <span class="stat-label">비포애프터</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📝</div>
                  <div class="stat-info">
                    <span class="stat-value" id="statBlogs">-</span>
                    <span class="stat-label">블로그 글</span>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">👁</div>
                  <div class="stat-info">
                    <span class="stat-value" id="statViews">-</span>
                    <span class="stat-label">총 조회수</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== CASES TAB ===== */}
            <div class="admin-panel" id="panel-cases">
              <div class="panel-header">
                <h2>비포애프터 관리</h2>
                <button class="btn-primary" id="newCaseBtn">+ 새 케이스</button>
              </div>
              <div class="admin-list" id="casesList"></div>

              {/* Case Form Modal — Expanded */}
              <div class="modal-overlay" id="caseModal" style="display:none">
                <div class="modal-card modal-large">
                  <div class="modal-header">
                    <h3 id="caseModalTitle">새 케이스 등록</h3>
                    <button class="modal-close" data-close="caseModal">&times;</button>
                  </div>
                  <form id="caseForm" class="admin-form">
                    <input type="hidden" id="caseId" />
                    <div class="form-row-2">
                      <div class="form-group">
                        <label>제목 (SEO 키워드 포함 권장)</label>
                        <input type="text" id="caseTitle" placeholder="예: 상악 임플란트 2개 식립" required />
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
                    </div>

                    <div class="form-group">
                      <label>설명</label>
                      <textarea id="caseDesc" rows={3} placeholder="케이스에 대한 간단한 설명 (SEO 설명으로도 활용됩니다)"></textarea>
                    </div>

                    {/* Expanded patient/treatment fields */}
                    <div class="form-section-title">환자 및 치료 정보</div>
                    <div class="form-row-3">
                      <div class="form-group">
                        <label>환자 연령대</label>
                        <select id="caseAgeGroup">
                          <option value="">선택 안함</option>
                          <option value="10대">10대</option>
                          <option value="20대">20대</option>
                          <option value="30대">30대</option>
                          <option value="40대">40대</option>
                          <option value="50대">50대</option>
                          <option value="60대">60대</option>
                          <option value="70대 이상">70대 이상</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>환자 성별</label>
                        <select id="caseGender">
                          <option value="">선택 안함</option>
                          <option value="M">남성</option>
                          <option value="F">여성</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>치료 기간</label>
                        <input type="text" id="caseDuration" placeholder="예: 3개월, 6개월" />
                      </div>
                    </div>

                    <div class="form-row-2">
                      <div class="form-group">
                        <label>담당 의료진</label>
                        <select id="caseDoctorId">
                          <option value="">선택 안함</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label>지역 (SEO 지역키워드)</label>
                        <div class="region-autocomplete-wrap">
                          <input type="text" id="caseRegionInput" placeholder="동 이름 입력 (예: 초지, 명지)" autocomplete="off" />
                          <div class="region-suggestions" id="regionSuggestions" style="display:none"></div>
                          <input type="hidden" id="caseRegionText" />
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label>이미지 업로드 (올린 칸만 사이트에 표시됩니다)</label>
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

              {/* Blog Form Modal (SEO enhanced) */}
              <div class="modal-overlay" id="blogModal" style="display:none">
                <div class="modal-card modal-large">
                  <div class="modal-header">
                    <h3 id="blogModalTitle">새 블로그 글</h3>
                    <button class="modal-close" data-close="blogModal">&times;</button>
                  </div>
                  <form id="blogForm" class="admin-form">
                    <input type="hidden" id="blogId" />

                    {/* SEO Fields */}
                    <div class="form-group">
                      <label>제목 (H1 - SEO 메인 키워드 포함 권장)</label>
                      <input type="text" id="blogTitle" placeholder="예: 부산 명지 임플란트 비용과 치료 과정 A to Z" required />
                      <span class="form-char-count" id="titleCount">0/60자</span>
                    </div>

                    <div class="seo-toggle">
                      <button type="button" class="btn-seo-toggle" id="seoToggle">SEO 설정 ▼</button>
                    </div>
                    <div class="seo-fields" id="seoFields" style="display:none">
                      <div class="form-group">
                        <label>META 제목 (검색 결과 제목, 비워두면 제목 사용)</label>
                        <input type="text" id="blogMetaTitle" placeholder="검색 결과에 표시될 제목" />
                      </div>
                      <div class="form-group">
                        <label>META 설명 (검색 결과 미리보기, 150자 이내)</label>
                        <textarea id="blogMetaDesc" rows={2} placeholder="검색 결과에 보이는 미리보기 텍스트"></textarea>
                        <span class="form-char-count" id="metaDescCount">0/150자</span>
                      </div>
                      <div class="form-group">
                        <label>URL 슬러그 (영문, 비워두면 자동생성)</label>
                        <input type="text" id="blogSlug" placeholder="busan-myeongji-implant-cost" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label>작성자</label>
                      <select id="blogAuthor">
                        <option value="">자동 (의료진 목록에서 선택)</option>
                      </select>
                    </div>

                    {/* Rich Content Editor */}
                    <div class="form-group">
                      <label>본문 (H2, H3 소제목 활용 + 이미지 삽입 권장)</label>
                      <div class="editor-toolbar" id="editorToolbar">
                        <button type="button" class="toolbar-btn" data-cmd="h2" title="H2 소제목">H2</button>
                        <button type="button" class="toolbar-btn" data-cmd="h3" title="H3 소제목">H3</button>
                        <button type="button" class="toolbar-btn" data-cmd="bold" title="굵게">B</button>
                        <button type="button" class="toolbar-btn" data-cmd="ul" title="목록">• 목록</button>
                        <button type="button" class="toolbar-btn" data-cmd="img" title="이미지 삽입">📷 이미지</button>
                        <button type="button" class="toolbar-btn" data-cmd="hr" title="구분선">—</button>
                      </div>
                      <textarea id="blogContent" rows={12} placeholder="## 소제목을 활용하면 SEO에 유리합니다&#10;&#10;본문 내용을 작성하세요.&#10;&#10;마크다운 문법을 지원합니다:&#10;## H2 소제목&#10;### H3 소제목&#10;**굵게** 표시&#10;- 목록 항목"></textarea>
                      <span class="editor-help">마크다운 문법 지원: ## H2, ### H3, **굵게**, - 목록</span>
                    </div>

                    <div class="form-group">
                      <label>사진 업로드 (드래그 앤 드롭, 글 중간에 삽입됨)</label>
                      <div class="dropzone" id="blogDropzone">
                        <div class="dropzone-msg">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <p>여기에 이미지를 드래그하거나 클릭하세요</p>
                          <span>JPG, PNG, WebP (최대 10장, 본문 중간에 자동 배치)</span>
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
                      <label>이미지 업로드 (공지 본문에 삽입됩니다)</label>
                      <div class="dropzone dropzone-sm" id="noticeDropzone">
                        <div class="dropzone-msg"><p>이미지를 드래그하거나 클릭하세요</p></div>
                        <input type="file" id="noticeFiles" accept="image/*" multiple style="display:none" />
                      </div>
                      <div class="blog-preview-grid" id="noticePreviewGrid"></div>
                    </div>
                    <div class="form-row-2">
                      <div class="form-group">
                        <label class="checkbox-label">
                          <input type="checkbox" id="noticePinned" />
                          상단 고정 (메인 공지)
                        </label>
                      </div>
                      <div class="form-group">
                        <label>썸네일 (목록에 표시)</label>
                        <div class="notice-thumb-upload">
                          <div id="noticeThumbPreview" class="img-slot-preview"></div>
                          <input type="file" id="noticeThumbFile" accept="image/*" style="display:none" />
                          <button type="button" class="btn-sm" id="noticeThumbBtn">선택</button>
                          <input type="hidden" id="noticeThumbVal" />
                        </div>
                      </div>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" data-close="noticeModal">취소</button>
                      <button type="submit" class="btn-primary">저장</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ===== USERS TAB ===== */}
            <div class="admin-panel" id="panel-users">
              <div class="panel-header">
                <h2>회원 관리</h2>
                <span class="panel-count" id="usersCount"></span>
              </div>
              <div class="admin-list" id="usersList"></div>
              <div class="load-more-wrap" id="usersLoadMore" style="display:none">
                <button class="btn-secondary" id="usersLoadMoreBtn">더 보기</button>
              </div>
            </div>
          </div>
        </div>

        <script src="/static/admin.js"></script>
      </body>
    </html>
  )
}
