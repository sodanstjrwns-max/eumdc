export function adminPage() {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <title>이음치과 관리자</title>
        <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="/static/admin.css?v=20260423c" rel="stylesheet" />
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
                <div class="modal-card modal-xl editor-modal editor-modal-workspace">
                  {/* ── LEFT SIDEBAR: 작성된 글 목록 ── */}
                  <aside class="editor-sidebar" id="editorSidebar">
                    <div class="editor-sidebar-header">
                      <span class="editor-sidebar-title">📚 블로그 목록</span>
                      <button type="button" class="editor-sidebar-new" id="sidebarNewBlog" title="새 글 작성">+ 새 글</button>
                    </div>
                    <input
                      type="text"
                      class="editor-sidebar-search"
                      id="editorSidebarSearch"
                      placeholder="제목으로 검색…"
                    />
                    <div class="editor-sidebar-list" id="editorSidebarList">
                      <p class="editor-sidebar-empty">불러오는 중…</p>
                    </div>
                    <button type="button" class="editor-sidebar-toggle" id="editorSidebarToggle" aria-label="사이드바 접기">◀</button>
                  </aside>

                  {/* ── RIGHT MAIN: 에디터 ── */}
                  <div class="editor-main">
                  <div class="modal-header editor-modal-header">
                    <h3 id="blogModalTitle">새 블로그 글</h3>
                    <div class="editor-header-actions">
                      <span class="autosave-indicator" id="autosaveIndicator"></span>
                      <button type="button" class="editor-view-btn" data-view="split" title="편집+미리보기 (Ctrl+Shift+P)">⊞ 분할</button>
                      <button type="button" class="editor-view-btn" data-view="edit" title="편집만">✎ 편집</button>
                      <button type="button" class="editor-view-btn" data-view="preview" title="미리보기만">👁 미리보기</button>
                      <button class="modal-close" data-close="blogModal">&times;</button>
                    </div>
                  </div>

                  <form id="blogForm" class="admin-form editor-form">
                    <input type="hidden" id="blogId" />

                    {/* 제목 */}
                    <div class="form-group editor-title-group">
                      <input type="text" id="blogTitle" class="editor-title-input" placeholder="글 제목을 입력하세요 (SEO 메인 키워드 포함 권장)" required />
                      <span class="form-char-count" id="titleCount">0/60자</span>
                    </div>

                    {/* 메타 정보 1줄 요약 바 */}
                    <div class="editor-meta-bar">
                      <div class="editor-meta-field">
                        <label>작성자</label>
                        <select id="blogAuthor">
                          <option value="">자동 선택</option>
                        </select>
                      </div>
                      <div class="editor-meta-field">
                        <label>URL 슬러그</label>
                        <input type="text" id="blogSlug" placeholder="auto-generated" />
                      </div>
                      <button type="button" class="btn-seo-toggle" id="seoToggle">⚙ SEO 고급 ▼</button>
                    </div>

                    <div class="seo-fields" id="seoFields" style="display:none">
                      <div class="form-group">
                        <label>META 제목 <span class="field-hint">비워두면 글 제목 사용</span></label>
                        <input type="text" id="blogMetaTitle" placeholder="검색 결과에 표시될 제목" />
                      </div>
                      <div class="form-group">
                        <label>META 설명 <span class="field-hint">검색 결과 미리보기, 150자 이내</span></label>
                        <textarea id="blogMetaDesc" rows={2} placeholder="검색 결과에 보이는 미리보기 텍스트"></textarea>
                        <span class="form-char-count" id="metaDescCount">0/150자</span>
                      </div>
                    </div>

                    {/* 슈퍼 툴바 — 그룹별로 정리 */}
                    <div class="editor-supertoolbar" id="editorToolbar">
                      <div class="toolbar-group" data-group="heading">
                        <button type="button" class="toolbar-btn" data-cmd="h2" title="제목 H2 (Ctrl+2)"><b>H</b><sub>2</sub></button>
                        <button type="button" class="toolbar-btn" data-cmd="h3" title="소제목 H3 (Ctrl+3)"><b>H</b><sub>3</sub></button>
                        <button type="button" class="toolbar-btn" data-cmd="h4" title="소소제목 H4 (Ctrl+4)"><b>H</b><sub>4</sub></button>
                      </div>
                      <span class="toolbar-sep"></span>
                      <div class="toolbar-group" data-group="format">
                        <button type="button" class="toolbar-btn" data-cmd="bold" title="굵게 (Ctrl+B)"><b>B</b></button>
                        <button type="button" class="toolbar-btn" data-cmd="italic" title="기울임 (Ctrl+I)"><i>I</i></button>
                        <button type="button" class="toolbar-btn" data-cmd="strike" title="취소선"><s>S</s></button>
                        <button type="button" class="toolbar-btn" data-cmd="mark" title="형광펜 하이라이트"><span style="background:#fff3a0;padding:0 3px;border-radius:2px;color:#0f1b2d;">H</span></button>
                        <button type="button" class="toolbar-btn" data-cmd="code" title="인라인 코드"><code>{`<>`}</code></button>
                      </div>
                      <span class="toolbar-sep"></span>
                      <div class="toolbar-group" data-group="list">
                        <button type="button" class="toolbar-btn" data-cmd="ul" title="글머리 목록">• 목록</button>
                        <button type="button" class="toolbar-btn" data-cmd="ol" title="번호 목록">1. 목록</button>
                        <button type="button" class="toolbar-btn" data-cmd="task" title="체크박스 목록">☑ 체크</button>
                      </div>
                      <span class="toolbar-sep"></span>
                      <div class="toolbar-group" data-group="block">
                        <button type="button" class="toolbar-btn" data-cmd="quote" title="인용구">❝ 인용</button>
                        <button type="button" class="toolbar-btn" data-cmd="callout-info" title="정보 박스">ℹ 정보</button>
                        <button type="button" class="toolbar-btn" data-cmd="callout-warn" title="경고 박스">⚠ 주의</button>
                        <button type="button" class="toolbar-btn" data-cmd="callout-tip" title="팁 박스">💡 팁</button>
                      </div>
                      <span class="toolbar-sep"></span>
                      <div class="toolbar-group" data-group="insert">
                        <button type="button" class="toolbar-btn" data-cmd="link" title="링크 (Ctrl+K)">🔗 링크</button>
                        <button type="button" class="toolbar-btn" data-cmd="table" title="표 삽입">▦ 표</button>
                        <button type="button" class="toolbar-btn" data-cmd="img" title="이미지 업로드">📷 이미지</button>
                        <button type="button" class="toolbar-btn" data-cmd="youtube" title="유튜브 영상 삽입">▶ 유튜브</button>
                        <button type="button" class="toolbar-btn" data-cmd="hr" title="구분선">— 구분</button>
                        <button type="button" class="toolbar-btn" data-cmd="toc" title="목차 자동생성">☰ 목차</button>
                      </div>
                      <span class="toolbar-sep"></span>
                      <div class="toolbar-group" data-group="edit">
                        <button type="button" class="toolbar-btn" data-cmd="undo" title="되돌리기 (Ctrl+Z)">↶</button>
                        <button type="button" class="toolbar-btn" data-cmd="redo" title="다시실행 (Ctrl+Shift+Z)">↷</button>
                      </div>
                    </div>

                    {/* ═══ 스플릿 뷰: 편집 | 프리뷰 ═══ */}
                    <div class="editor-split" id="editorSplit" data-mode="split">
                      <div class="editor-pane editor-pane-edit">
                        <textarea id="blogContent" class="editor-textarea"
                          placeholder="# 제목은 상단 입력란에&#10;&#10;## 소제목을 활용하면 SEO에 유리합니다&#10;&#10;본문을 작성하세요. 우측 미리보기로 실시간 확인할 수 있습니다.&#10;&#10;- **굵게** 나 *기울임* 또는 ==형광펜== 표시&#10;- [링크](https://example.com)&#10;- `인라인 코드`&#10;&#10;> 인용구는 이렇게&#10;&#10;| 표 | 문법 |&#10;|---|---|&#10;| 지원 | 가능 |&#10;&#10;- [ ] 체크박스 목록&#10;- [x] 완료된 항목&#10;&#10;:::info 정보 박스도 됩니다 :::&#10;:::warn 주의 박스 :::&#10;:::tip 팁 박스 :::"></textarea>
                      </div>
                      <div class="editor-split-divider" aria-hidden="true"></div>
                      <div class="editor-pane editor-pane-preview" id="editorPreviewPane">
                        <div class="editor-preview-header">실시간 미리보기</div>
                        <div class="editor-preview" id="editorPreview">
                          <p class="editor-preview-empty">글을 작성하면 여기에 미리보기가 나타납니다.</p>
                        </div>
                      </div>
                    </div>

                    {/* 상태바: 글자수 · 단어수 · 읽는시간 · 자동저장 */}
                    <div class="editor-statusbar">
                      <span class="stat-item">📝 <b id="statChars">0</b>자</span>
                      <span class="stat-item">📖 약 <b id="statReadTime">1분</b> 읽기</span>
                      <span class="stat-item">🔤 <b id="statWords">0</b> 단어</span>
                      <span class="stat-item seo-score-item">
                        <span class="seo-dot" id="seoDot" data-score="neutral"></span>
                        SEO <b id="seoScoreText">-</b>
                      </span>
                      <span class="stat-item stat-push">⌨ Ctrl+B / Ctrl+I / Ctrl+K / Ctrl+S</span>
                    </div>

                    {/* 표 크기 선택 팝오버 */}
                    <div class="table-picker" id="tablePicker" style="display:none">
                      <div class="table-picker-card">
                        <div class="table-picker-header">
                          <span id="tablePickerSize">1 × 1</span>
                          <button type="button" class="table-picker-close" id="tablePickerClose">&times;</button>
                        </div>
                        <div class="table-picker-grid" id="tablePickerGrid"></div>
                        <p class="table-picker-hint">원하는 크기 위에서 클릭하세요 (최대 10×8)</p>
                      </div>
                    </div>

                    {/* 링크 삽입 다이얼로그 */}
                    <div class="link-dialog" id="linkDialog" style="display:none">
                      <div class="link-dialog-card">
                        <div class="link-dialog-header">
                          <span>🔗 링크 삽입</span>
                          <button type="button" class="link-dialog-close" id="linkDialogClose">&times;</button>
                        </div>
                        <div class="link-dialog-body">
                          <label>표시 텍스트</label>
                          <input type="text" id="linkDialogText" placeholder="예: 이음치과 홈" />
                          <label>URL</label>
                          <input type="url" id="linkDialogUrl" placeholder="https://..." />
                          <div class="link-dialog-actions">
                            <button type="button" class="btn-secondary" id="linkDialogCancel">취소</button>
                            <button type="button" class="btn-primary" id="linkDialogInsert">삽입</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 이미지 드롭존 */}
                    <div class="form-group editor-dropzone-group">
                      <label>📁 사진 업로드 <span class="field-hint">드래그/붙여넣기/클릭 — 마크다운 삽입</span></label>
                      <div class="dropzone" id="blogDropzone">
                        <div class="dropzone-msg">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <p>여기에 이미지를 드래그하거나 클릭</p>
                          <span>JPG · PNG · WebP (최대 10장) — 본문 커서 위치에 자동 삽입</span>
                        </div>
                        <input type="file" id="blogFiles" accept="image/*" multiple style="display:none" />
                      </div>
                      <div class="blog-preview-grid" id="blogPreviewGrid"></div>
                    </div>

                    <div class="form-actions editor-actions">
                      <button type="button" class="btn-ghost" id="clearDraftBtn" title="자동저장된 초안 삭제">🗑 초안 삭제</button>
                      <div class="editor-actions-right">
                        <button type="button" class="btn-secondary" data-close="blogModal">취소</button>
                        <button type="submit" class="btn-primary" id="blogSaveBtn">💾 저장</button>
                      </div>
                    </div>
                  </form>
                  </div>
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

        <script src="/static/admin.js?v=20260423c"></script>
      </body>
    </html>
  )
}
