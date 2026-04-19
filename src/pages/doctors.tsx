import { subPageLayout } from './layout'
import { markdownToHtml } from '../utils/content'

export function doctorsPage(doctors?: any[]) {
  const items = doctors || []
  return subPageLayout('DOCTORS', (
    <div class="page-doctors">
      <section class="page-hero-mini">
        <div class="container-wide">
          <span class="section-label light">DOCTORS</span>
          <h1 class="page-title">의료진 소개</h1>
          <p class="page-subtitle">이음치과의원의 전문 의료진을 소개합니다. 실력과 진심으로 진료합니다.</p>
        </div>
      </section>

      <section class="doctors-grid-section">
        <div class="container-wide">
          {items.length === 0 ? (
            <div class="empty-state"><p>등록된 의료진이 없습니다.</p></div>
          ) : (
            <div class="doctors-grid">
              {items.map((d: any) => (
                <article class="doctor-grid-item" data-reveal>
                  <a href={`/doctors/${d.slug}`} class="doctor-grid-link" data-hover>
                    <div class="doctor-grid-photo">
                      {d.photo ? (
                        <img src={d.photo} alt={`${d.name} ${d.title || ''}`} loading="lazy" />
                      ) : (
                        <div class="doctor-photo-placeholder">
                          <span>{d.name?.charAt(0) || 'D'}</span>
                        </div>
                      )}
                    </div>
                    <div class="doctor-grid-info">
                      <h2 class="doctor-grid-name">
                        {d.name} <span class="doctor-grid-title">{d.title || '원장'}</span>
                      </h2>
                      {d.position && <p class="doctor-grid-specialty">{d.position}</p>}
                      {d.greeting && (
                        <p class="doctor-grid-greeting">
                          {d.greeting.substring(0, 100)}{d.greeting.length > 100 ? '…' : ''}
                        </p>
                      )}
                      {(() => {
                        const specs = parseList(d.specialties)
                        return specs.length > 0 ? (
                          <div class="doctor-grid-tags">
                            {specs.slice(0, 4).map((s: string) => <span class="doctor-grid-tag">{s}</span>)}
                          </div>
                        ) : null
                      })()}
                      <span class="doctor-grid-more">프로필 자세히 →</span>
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

export function doctorDetailPage(slug: string, doctor?: any) {
  if (!doctor) {
    return subPageLayout('DOCTOR', (
      <div class="page-doctor-detail">
        <section class="page-hero-mini compact">
          <div class="container-wide">
            <a href="/doctors" class="back-link" data-hover>← 전체 의료진 보기</a>
          </div>
        </section>
        <div class="empty-state">
          <h1>의료진 정보를 찾을 수 없습니다</h1>
          <a href="/doctors" class="btn-primary">목록으로 돌아가기</a>
        </div>
      </div>
    ))
  }

  const greetingHtml = markdownToHtml(doctor.greeting || '')
  const philosophyHtml = doctor.philosophy ? markdownToHtml(doctor.philosophy) : ''
  // 경력/학력/자격/학회 파싱 — 객체 배열 또는 문자열 배열 둘 다 지원
  const career = parseItems(doctor.career)
  const education = parseItems(doctor.education)
  const certifications = parseItems(doctor.certifications)
  const memberships = parseItems(doctor.memberships)
  const specialties = parseList(doctor.specialty_list || doctor.specialties)

  return subPageLayout('DOCTOR', (
    <div class="page-doctor-detail">
      <section class="page-hero-mini compact">
        <div class="container-wide">
          <a href="/doctors" class="back-link" data-hover>← 전체 의료진 보기</a>
        </div>
      </section>

      <section class="doctor-profile-hero">
        <div class="container-wide">
          <div class="doctor-profile-grid">
            <div class="doctor-profile-photo">
              {doctor.photo ? (
                <img src={doctor.photo} alt={`${doctor.name} ${doctor.title || '원장'}`} loading="eager" />
              ) : (
                <div class="doctor-photo-placeholder large">
                  <span>{doctor.name?.charAt(0) || 'D'}</span>
                </div>
              )}
            </div>
            <div class="doctor-profile-meta">
              <span class="section-label light">DOCTOR PROFILE</span>
              <h1 class="doctor-profile-name">
                {doctor.name}
                <span class="doctor-profile-title">{doctor.title || '원장'}</span>
              </h1>
              {doctor.position && <p class="doctor-profile-specialty">{doctor.position}</p>}
              {doctor.name_en && <p class="doctor-profile-name-en">{doctor.name_en}</p>}
              {specialties.length > 0 && (
                <div class="doctor-profile-tags">
                  {specialties.map((s: string) => <span class="doctor-tag">{s}</span>)}
                </div>
              )}
              {doctor.greeting && (
                <div class="doctor-profile-greeting rich-content" dangerouslySetInnerHTML={{ __html: greetingHtml }} />
              )}
              {philosophyHtml && (
                <div class="doctor-profile-philosophy rich-content" dangerouslySetInnerHTML={{ __html: philosophyHtml }} />
              )}
            </div>
          </div>
        </div>
      </section>

      {(education.length > 0 || career.length > 0 || certifications.length > 0 || memberships.length > 0) && (
        <section class="doctor-profile-details">
          <div class="container-wide">
            <div class="doctor-details-grid">
              {education.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">학력</h2>
                  <ul class="timeline-list">
                    {education.map((it: any) => (
                      <li class="timeline-item">
                        {it.year && <span class="timeline-year">{it.year}</span>}
                        <div class="timeline-body">
                          {it.school && <div class="timeline-primary">{it.school}</div>}
                          {it.degree && <div class="timeline-sub">{it.degree}</div>}
                          {!it.school && !it.degree && it._raw && <div class="timeline-primary">{it._raw}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {career.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">경력</h2>
                  <ul class="timeline-list">
                    {career.map((it: any) => (
                      <li class="timeline-item">
                        {it.year && <span class="timeline-year">{it.year}</span>}
                        <div class="timeline-body">
                          {it.org && <div class="timeline-primary">{it.org}</div>}
                          {it.role && <div class="timeline-sub">{it.role}</div>}
                          {!it.org && !it.role && it._raw && <div class="timeline-primary">{it._raw}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {certifications.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">자격·면허</h2>
                  <ul class="timeline-list">
                    {certifications.map((it: any) => (
                      <li class="timeline-item">
                        {it.year && <span class="timeline-year">{it.year}</span>}
                        <div class="timeline-body">
                          {it.name && <div class="timeline-primary">{it.name}</div>}
                          {it.org && <div class="timeline-sub">{it.org}</div>}
                          {!it.name && !it.org && it._raw && <div class="timeline-primary">{it._raw}</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {memberships.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">소속 학회</h2>
                  <ul class="membership-list">
                    {memberships.map((it: any) => (
                      <li class="membership-item">
                        <span class="membership-org">{it.org || it._raw}</span>
                        {it.role && <span class="membership-role">{it.role}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  ))
}

/** 단순 문자열 배열 파서 (specialties 등) */
function parseList(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean).map(x => typeof x === 'string' ? x : String(x))
  if (typeof v === 'string') {
    const s = v.trim()
    if (s.startsWith('[')) {
      try {
        const arr = JSON.parse(s)
        return Array.isArray(arr) ? arr.filter(Boolean).map(x => typeof x === 'string' ? x : String(x)) : []
      } catch { return [] }
    }
    return s.split(/\n+/).map(x => x.trim()).filter(Boolean)
  }
  return []
}

/** 객체 배열 파서 (education, career, certifications, memberships)
 *  각 항목은 그대로 객체로 반환, 문자열이면 {_raw: string}으로 래핑 */
function parseItems(v: any): any[] {
  if (!v) return []
  let arr: any[] = []
  if (Array.isArray(v)) {
    arr = v
  } else if (typeof v === 'string') {
    const s = v.trim()
    if (s.startsWith('[')) {
      try { const parsed = JSON.parse(s); if (Array.isArray(parsed)) arr = parsed }
      catch { arr = s.split(/\n+/).map(x => x.trim()).filter(Boolean) }
    } else {
      arr = s.split(/\n+/).map(x => x.trim()).filter(Boolean)
    }
  }
  return arr
    .filter((x: any) => x !== null && x !== undefined && x !== '')
    .map((x: any) => typeof x === 'string' ? { _raw: x } : x)
}
