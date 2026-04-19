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
  // 경력/학력/자격/학회 파싱 (JSON 배열 또는 줄바꿈 문자열)
  const career = parseList(doctor.career)
  const education = parseList(doctor.education)
  const certifications = parseList(doctor.certifications)
  const memberships = parseList(doctor.memberships)
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
                  <ul class="detail-list">
                    {education.map((item: string) => <li>{item}</li>)}
                  </ul>
                </div>
              )}
              {career.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">경력</h2>
                  <ul class="detail-list">
                    {career.map((item: string) => <li>{item}</li>)}
                  </ul>
                </div>
              )}
              {certifications.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">자격·면허</h2>
                  <ul class="detail-list">
                    {certifications.map((item: string) => <li>{item}</li>)}
                  </ul>
                </div>
              )}
              {memberships.length > 0 && (
                <div class="doctor-detail-block">
                  <h2 class="detail-heading">소속 학회</h2>
                  <ul class="detail-list">
                    {memberships.map((item: string) => <li>{item}</li>)}
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

function parseList(v: any): string[] {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean).map(String)
  if (typeof v === 'string') {
    const s = v.trim()
    if (s.startsWith('[')) {
      try { const arr = JSON.parse(s); return Array.isArray(arr) ? arr.filter(Boolean).map(String) : [] }
      catch { return [] }
    }
    return s.split(/\n+/).map(x => x.trim()).filter(Boolean)
  }
  return []
}
