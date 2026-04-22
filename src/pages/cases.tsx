import { subPageLayout } from './layout'
import { markdownToHtml, linkDictionaryTerms } from '../utils/content'

const CATEGORY_NAMES: Record<string, string> = {
  implant: '임플란트',
  aesthetic: '심미보철',
  resin: '심미레진',
  tmj: '턱관절',
  general: '일반진료',
  periodontal: '잇몸치료',
  'wisdom-tooth': '사랑니',
  pediatric: '소아',
  prevention: '예방'
}

export function casesPage(cases?: any[], isLoggedIn: boolean = false) {
  const items = cases || []
  return subPageLayout('BEFORE & AFTER', (
    <div class="page-cases">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">BEFORE & AFTER</span>
          <h1 class="page-title">비포애프터</h1>
          <p class="page-subtitle">이음치과의 실제 치료 결과를 확인하세요. 눈으로 직접 증명합니다.</p>
        </div>
      </section>

      {!isLoggedIn && (
        <div class="login-gate-banner" id="loginGateBanner">
          <div class="container-wide">
            <div class="gate-content">
              <div class="gate-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="gate-text">
                <h3>AFTER 사진은 회원 전용입니다</h3>
                <p>의료법에 따라 치료 후(AFTER) 사진은 로그인하신 회원에게만 공개됩니다. 로그인 또는 회원가입 후 열람하세요.</p>
              </div>
              <div class="gate-actions">
                <a href="/login" class="gate-btn-login">로그인</a>
                <a href="/signup" class="gate-btn-signup">회원가입</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <section class="page-filter">
        <div class="container-wide">
          <div class="filter-bar" id="caseFilter">
            <button class="filter-btn active" data-cat="all">전체</button>
            <button class="filter-btn" data-cat="implant">임플란트</button>
            <button class="filter-btn" data-cat="aesthetic">심미보철</button>
            <button class="filter-btn" data-cat="resin">심미 레진</button>
            <button class="filter-btn" data-cat="tmj">턱관절</button>
            <button class="filter-btn" data-cat="general">일반진료</button>
          </div>
        </div>
      </section>

      <section class="page-grid-section">
        <div class="container-wide">
          {items.length === 0 ? (
            <div class="empty-state">
              <p>준비된 비포애프터 사례를 곧 공개합니다.<br/>실제 치료 결과가 궁금하시다면 직접 문의해 주세요.</p>
              <div class="empty-state-cta-row">
                <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" class="empty-state-cta primary">카카오톡으로 사례 문의 →</a>
                <a href="https://m.place.naver.com/hospital/2005922467/booking" target="_blank" rel="noopener" class="empty-state-cta naver">네이버 예약 →</a>
                <a href="tel:051-206-5888" class="empty-state-cta secondary">전화로 상담 ☎</a>
              </div>
            </div>
          ) : (
            <div class="cases-grid" id="casesGrid">
              {items.map((cs: any) => (
                <article class="case-card" data-cat={cs.category}>
                  <a href={`/cases/${cs.id}`} class="case-card-link" data-hover>
                    <div class="case-card-hero">
                      {cs.pano_before || cs.intra_before ? (
                        <img class="case-hero-img" src={cs.pano_before || cs.intra_before} alt={`${cs.title} Before`} loading="lazy" />
                      ) : <div class="case-thumb-placeholder">No Image</div>}
                      <span class="case-hero-label">BEFORE</span>
                      {isLoggedIn ? (
                        (cs.pano_after || cs.intra_after) && (
                          <div class="case-hero-after">
                            <img src={cs.pano_after || cs.intra_after} alt={`${cs.title} After`} loading="lazy" />
                            <span class="case-hero-after-label">AFTER</span>
                          </div>
                        )
                      ) : (
                        <div class="case-hero-lock" aria-label="AFTER는 회원 전용">
                          <svg class="lock-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <span>AFTER 회원공개</span>
                        </div>
                      )}
                    </div>
                    <div class="case-card-body">
                      <span class="case-card-category">{CATEGORY_NAMES[cs.category] || cs.category}</span>
                      <h2 class="case-card-title">{cs.title}</h2>
                      {cs.description && (
                        <p class="case-card-desc">{cs.description.substring(0, 70)}{cs.description.length > 70 ? '…' : ''}</p>
                      )}
                      {(cs.patient_age_group || cs.patient_gender || cs.treatment_duration) && (
                        <div class="case-card-meta">
                          {cs.patient_age_group && (
                            <span class="case-meta-chip">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              {cs.patient_age_group}
                            </span>
                          )}
                          {cs.patient_gender && (
                            <span class="case-meta-chip">
                              {cs.patient_gender === 'M' || cs.patient_gender === '남' ? '남성' : cs.patient_gender === 'F' || cs.patient_gender === '여' ? '여성' : cs.patient_gender}
                            </span>
                          )}
                          {cs.treatment_duration && (
                            <span class="case-meta-chip accent">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              {cs.treatment_duration}
                            </span>
                          )}
                        </div>
                      )}
                      <span class="case-card-cta">자세히 보기 →</span>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  ))
}

export function caseDetailPage(
  id: string,
  caseData?: any,
  doctor?: any,
  dictTerms?: Array<{ name: string; slug: string; aliases?: string | null }>,
  isLoggedIn: boolean = false
) {
  if (!caseData) {
    return subPageLayout('CASE DETAIL', (
      <div class="page-case-detail">
        <section class="page-hero-mini">
          <div class="container-wide">
            <a href="/cases" class="back-link" data-hover>← 목록으로</a>
          </div>
        </section>
        <section class="case-detail-section">
          <div class="container-wide">
            <div class="empty-state">
              <h1>케이스를 찾을 수 없습니다</h1>
              <a href="/cases" class="btn-primary">목록으로 돌아가기</a>
            </div>
          </div>
        </section>
      </div>
    ))
  }

  let descHtml = markdownToHtml(caseData.description || '')
  if (dictTerms && dictTerms.length > 0) {
    descHtml = linkDictionaryTerms(descHtml, dictTerms)
  }

  const lockedAfter = (
    <div class="compare-lock">
      <svg class="lock-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <div class="lock-title">회원 전용 콘텐츠</div>
      <p class="lock-desc">의료법에 따라 AFTER 사진은 로그인하신 회원에게만 공개됩니다.</p>
      <div class="lock-actions">
        <a href="/login" class="gate-btn-login">로그인</a>
        <a href="/signup" class="gate-btn-signup">회원가입</a>
      </div>
    </div>
  )

  return subPageLayout('CASE DETAIL', (
    <div class="page-case-detail">
      <section class="page-hero-mini">
        <div class="container-wide">
          <a href="/cases" class="back-link" data-hover>← 목록으로</a>
        </div>
      </section>

      {!isLoggedIn && (
        <div class="login-gate-banner" id="loginGateBanner">
          <div class="container-wide">
            <div class="gate-content">
              <div class="gate-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="gate-text">
                <h3>AFTER 사진은 회원 전용입니다</h3>
                <p>BEFORE 사진과 치료 내용은 모두에게 공개됩니다. AFTER 결과 사진은 로그인 후 열람하세요.</p>
              </div>
              <div class="gate-actions">
                <a href="/login" class="gate-btn-login">로그인</a>
                <a href="/signup" class="gate-btn-signup">회원가입</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <section class="case-detail-section">
        <div class="container-wide">
          <article class="case-article">
            <header class="case-article-header">
              <span class="case-article-category">{CATEGORY_NAMES[caseData.category] || caseData.category}</span>
              <h1 class="case-article-title">{caseData.title}</h1>
              <div class="case-article-meta">
                {caseData.patient_age_group && <span class="meta-chip">{caseData.patient_age_group}</span>}
                {caseData.patient_gender && <span class="meta-chip">{caseData.patient_gender}</span>}
                {caseData.region_text && <span class="meta-chip">{caseData.region_text}</span>}
                {caseData.treatment_duration && <span class="meta-chip">치료 {caseData.treatment_duration}</span>}
                {caseData.patient_consent ? <span class="meta-chip consent">✓ 환자 동의</span> : null}
              </div>
            </header>

            {/* 비포애프터 비교 이미지 */}
            <div class="case-compare-grid">
              {(caseData.pano_before || caseData.pano_after || !isLoggedIn) && caseData.pano_before && (
                <div class="compare-set">
                  <h2 class="compare-title">파노라마 X-ray</h2>
                  <div class="compare-pair">
                    <figure class="compare-item">
                      <span class="compare-label">BEFORE</span>
                      {caseData.pano_before ? (
                        <img src={caseData.pano_before} alt={`${caseData.title} 파노라마 비포`} loading="eager" />
                      ) : <div class="compare-placeholder">No Image</div>}
                    </figure>
                    <figure class={`compare-item${!isLoggedIn ? ' locked' : ''}`}>
                      <span class="compare-label after">AFTER</span>
                      {isLoggedIn ? (
                        caseData.pano_after ? (
                          <img src={caseData.pano_after} alt={`${caseData.title} 파노라마 애프터`} loading="eager" />
                        ) : <div class="compare-placeholder">No Image</div>
                      ) : lockedAfter}
                    </figure>
                  </div>
                </div>
              )}
              {(caseData.intra_before || caseData.intra_after || !isLoggedIn) && caseData.intra_before && (
                <div class="compare-set">
                  <h2 class="compare-title">구강 사진</h2>
                  <div class="compare-pair">
                    <figure class="compare-item">
                      <span class="compare-label">BEFORE</span>
                      {caseData.intra_before ? (
                        <img src={caseData.intra_before} alt={`${caseData.title} 구강 비포`} loading="lazy" />
                      ) : <div class="compare-placeholder">No Image</div>}
                    </figure>
                    <figure class={`compare-item${!isLoggedIn ? ' locked' : ''}`}>
                      <span class="compare-label after">AFTER</span>
                      {isLoggedIn ? (
                        caseData.intra_after ? (
                          <img src={caseData.intra_after} alt={`${caseData.title} 구강 애프터`} loading="lazy" />
                        ) : <div class="compare-placeholder">No Image</div>
                      ) : lockedAfter}
                    </figure>
                  </div>
                </div>
              )}
            </div>

            {/* 치료 내용 */}
            {caseData.description && (
              <section class="case-article-body">
                <h2 class="section-heading">치료 경과</h2>
                <div class="rich-content" dangerouslySetInnerHTML={{ __html: descHtml }} />
              </section>
            )}

            {/* 담당의 */}
            {doctor && (
              <section class="case-doctor-card">
                <h2 class="section-heading">담당 의료진</h2>
                <div class="doctor-card">
                  {doctor.photo && (
                    <div class="doctor-card-photo">
                      <img src={doctor.photo} alt={`${doctor.name} ${doctor.title || '원장'}`} loading="lazy" />
                    </div>
                  )}
                  <div class="doctor-card-info">
                    <h3 class="doctor-card-name">
                      <a href={`/doctors/${doctor.slug}`} data-hover>{doctor.name}</a>
                      <span class="doctor-card-title">{doctor.title || '원장'}</span>
                    </h3>
                    {doctor.greeting && <p class="doctor-card-greeting">{doctor.greeting.substring(0, 120)}{doctor.greeting.length > 120 ? '…' : ''}</p>}
                    <a href={`/doctors/${doctor.slug}`} class="doctor-card-more">프로필 자세히 보기 →</a>
                  </div>
                </div>
              </section>
            )}

            <footer class="case-article-footer">
              <p class="case-disclaimer">
                ※ 본 케이스는 환자의 동의를 받아 공개되었으며, 개인 정보 보호를 위해 식별 가능한 정보는 제외하였습니다.
                치료 결과는 개인의 구강 상태·생활 습관·관리 방법에 따라 달라질 수 있습니다.
              </p>
              <a href="/cases" class="back-to-list">← 비포애프터 목록으로</a>
            </footer>
          </article>
        </div>
      </section>
    </div>
  ))
}
