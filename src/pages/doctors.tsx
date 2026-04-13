import { subPageLayout } from './layout'

/** 의료진 전체 소개 페이지 */
export function doctorsPage() {
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
          <div id="doctorsGrid" class="doctors-grid">
            <div class="loading-spinner">불러오는 중...</div>
          </div>
        </div>
      </section>

      <script src="/static/doctors.js"></script>
    </div>
  ))
}

/** 의료진 개별 상세 페이지 */
export function doctorDetailPage(slug: string) {
  return subPageLayout('DOCTOR', (
    <div class="page-doctor-detail">
      <section class="page-hero-mini compact">
        <div class="container-wide">
          <a href="/doctors" class="back-link" data-hover>← 전체 의료진 보기</a>
        </div>
      </section>

      <div id="doctorDetailContent" data-slug={slug}>
        <div class="loading-spinner">불러오는 중...</div>
      </div>

      <script src="/static/doctors.js"></script>
    </div>
  ))
}
