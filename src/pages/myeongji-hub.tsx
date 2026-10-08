/**
 * "명지 치과" 대표 키워드 허브 — /regions/myeongji (2026-10-08 지역 핵심 키워드 SEO)
 *
 * - URL 은 기존 지역 페이지 그대로 유지하고, 본문은 D1 seo_regions.content 대신 이 파일의 확인된 사실로 렌더한다
 *   (D1 본문에 '1층 직접 진입'·'6개 진료실'·'가장 먼저 도입' 등 확인되지 않은 문구가 있어 허브에서는 쓰지 않음).
 * - 사실 출처: src/seo.ts(주소·좌표·진료시간), src/pages/main.tsx(휴게·접수 마감·주차·버스),
 *   D1 doctors(대표원장 이력), D1 treatments(진료 목록). 새 정보를 지어내지 않는다.
 * - 화면 FAQ 와 FAQPage JSON-LD 는 MYEONGJI_HUB_FAQS 한 배열을 같이 쓴다 (1:1).
 * - region.js 를 싣지 않는다 (SSR H1·FAQ 를 클라이언트가 덮어쓰지 않도록).
 */
import { subPageLayout } from './layout'

export const MYEONGJI_HUB_PATH = '/regions/myeongji'
/** 허브 본문을 실제로 바꾼 날짜 (사이트맵 lastmod·dateModified·화면 검토일 공용, 고정값) */
export const MYEONGJI_HUB_UPDATED = '2026-10-08'
export const MYEONGJI_HUB_TITLE = '명지 치과 | 이음치과의원 — 명지국제신도시 명지국제8로 265'
export const MYEONGJI_HUB_H1 = '명지 치과, 이음치과의원'
export const MYEONGJI_HUB_DESC =
  '명지 치과 이음치과의원 — 부산 강서구 명지국제신도시 명지국제8로 265, 201호. 월~목 12~21시·토·일 10~17시 진료, 금요일 정기휴무, 건물 뒤 주차장 2시간 무료. 국민은행명지국제신도시지점 정류장 도보 1분. ☎ 051-206-5888'

export const MYEONGJI_HUB_ANSWER =
  '명지국제신도시에서 치과를 찾으신다면, 이음치과의원은 명지국제8로 265 건물 2층(201호)에 있습니다. 평일은 금요일을 제외한 월~목 낮 12시부터 밤 9시까지, 주말은 토·일 오전 10시부터 오후 5시까지 진료하며, 최효영 대표원장이 임플란트·심미보철·턱관절을 중심으로 일반 진료까지 직접 봅니다.'

export const MYEONGJI_HUB_FAQS: { question: string; answer: string }[] = [
  {
    question: '명지에서 금요일에 진료받을 수 있나요?',
    answer: '이음치과의원은 금요일이 정기휴무입니다. 대신 월~목은 밤 9시(접수 마감 20시 30분)까지, 토·일은 오후 5시(접수 마감 16시 30분)까지 진료하므로 퇴근 뒤나 주말에 예약해 주세요. 공휴일은 휴진하고 대체공휴일에는 진료합니다.'
  },
  {
    question: '퇴근하고 가면 몇 시까지 접수할 수 있나요?',
    answer: '월~목요일은 20시 30분까지 접수를 받습니다. 16시부터 17시까지는 휴게 시간이라 이 시간대 방문은 피해 주시고, 늦은 시간 진료는 미리 전화(051-206-5888)나 네이버 예약으로 자리를 잡아 두시면 기다림이 줄어듭니다.'
  },
  {
    question: '차로 가면 주차는 어디에 하나요?',
    answer: "내비게이션에 '이음치과의원'을 검색해 오시면 되고, 주차는 건물 뒤편 주차장(하이마트 옆)을 이용합니다. 진료 시 주차 2시간을 지원해 드립니다."
  },
  {
    question: '버스로는 어떻게 가나요?',
    answer: '국민은행명지국제신도시지점 정류장에서 내리시면 도보 1분 거리입니다. 강서구 8번, 8-1번, 21번, 124번 버스가 이 정류장에 섭니다.'
  },
  {
    question: '예약은 어떤 방법으로 하나요?',
    answer: '전화(051-206-5888), 네이버 예약, 카카오톡 상담 중 편한 방법을 쓰시면 됩니다. 처음 오시는 분은 통증 부위나 원하는 진료를 미리 알려 주시면 검사 순서를 맞춰 안내해 드립니다.'
  },
  {
    question: '명지오션시티나 신호동에서도 다니기 괜찮을까요?',
    answer: '네, 같은 강서구 생활권이라 진료받으러 오시기 어렵지 않습니다. 동네별 이동 경로와 진료 안내는 아래 명지오션시티·신호동·에코델타시티 등 인근 지역 페이지에서 따로 확인하실 수 있습니다.'
  }
]

const HUB_TREATMENTS: { slug: string; name: string; note: string }[] = [
  { slug: 'implant', name: '임플란트', note: 'CBCT·구강스캐너로 진단하고 디지털 가이드로 식립 위치를 계획' },
  { slug: 'aesthetic', name: '심미보철', note: '라미네이트·올세라믹·지르코니아 크라운' },
  { slug: 'laminate', name: '라미네이트', note: '앞니 색·모양·틈을 얇은 세라믹으로 개선' },
  { slug: 'resin', name: '심미레진', note: '치아색 레진으로 작은 충치·깨진 부위를 당일 수복' },
  { slug: 'general', name: '충치·신경치료', note: '자연치아를 최대한 살리는 보존 치료' },
  { slug: 'periodontal', name: '잇몸치료', note: '잇몸 출혈·붓기·치주염 관리' },
  { slug: 'wisdom-tooth', name: '사랑니 발치', note: 'CBCT로 신경 위치를 확인한 뒤 발치' },
  { slug: 'tmj', name: '턱관절 치료', note: '턱 소리·통증·이갈이, 스플린트' },
  { slug: 'invisalign', name: 'MEG Aligner 투명교정', note: '메가젠 디지털 투명교정' },
  { slug: 'orthodontics', name: '치아교정', note: '투명교정·설측·클리피씨 중 생활에 맞게 선택' },
  { slug: 'pediatric', name: '소아·예방치과', note: '아이 충치 예방과 치료' },
  { slug: 'prevention', name: '스케일링·예방', note: '정기 스케일링·검진' }
]

const HUB_NEARBY: { slug: string; name: string }[] = [
  { slug: 'myeongji-ocean', name: '명지오션시티' },
  { slug: 'sinho', name: '신호동' },
  { slug: 'eco-delta', name: '에코델타시티' },
  { slug: 'noksan', name: '녹산동' },
  { slug: 'gangseo', name: '부산 강서구' }
]

export function myeongjiHubPage() {
  return subPageLayout('REGION', (
    <div class="page-seo-region page-region-hub">
      <section class="region-hero" id="regionHero">
        <div class="container-wide">
          <nav class="breadcrumb" aria-label="브레드크럼">
            <a href="/">홈</a><span class="bc-sep">/</span><a href="/regions">지역별 안내</a><span class="bc-sep">/</span><span>명지 치과</span>
          </nav>
          <h1 class="page-title" id="ssrH1">{MYEONGJI_HUB_H1}</h1>
          <p class="region-hero-text" id="quick-answer">{MYEONGJI_HUB_ANSWER}</p>
          <div class="region-hero-meta">
            <span class="region-meta-item"><strong>위치</strong> 명지국제8로 265, 201호</span>
            <span class="region-meta-item"><strong>휴무</strong> 금요일·공휴일</span>
            <span class="region-meta-item"><strong>주차</strong> 건물 뒤 주차장 2시간</span>
            <span class="region-meta-item"><strong>전화</strong> <a href="tel:051-206-5888">051-206-5888</a></span>
          </div>
          <p class="region-hub-reviewed">감수 최효영 대표원장 · 최종 검토 {MYEONGJI_HUB_UPDATED}</p>
        </div>
      </section>

      <section class="region-content-section">
        <div class="container-wide">
          <h2 class="section-heading">명지국제신도시 어디에 있나요?</h2>
          <div class="region-content-body">
            <p>이음치과의원 주소는 <strong>부산광역시 강서구 명지국제8로 265, 201호(명지동)</strong>입니다. 명지국제신도시 명지국제8로에 있는 건물 2층이며, 건물에 엘리베이터가 있어 유모차나 거동이 불편한 분도 올라오실 수 있습니다.</p>
            <dl class="region-hub-spec">
              <dt>대중교통</dt><dd>국민은행명지국제신도시지점 정류장 하차 후 도보 1분 — 강서구 8번·8-1번·21번·124번</dd>
              <dt>자가용</dt><dd>내비게이션 '이음치과의원' 검색, 건물 뒤편 주차장(하이마트 옆) 이용, 주차 2시간 지원</dd>
              <dt>지도</dt><dd><a href="https://map.naver.com/p/entry/place/2005922467" target="_blank" rel="noopener">네이버 지도에서 이음치과의원 보기</a></dd>
              <dt>상세 안내</dt><dd><a href="/visit">내원 안내(오시는 길·진료시간·주차)</a></dd>
            </dl>
          </div>
        </div>
      </section>

      <section class="region-content-section">
        <div class="container-wide">
          <h2 class="section-heading">명지 이음치과 진료시간은 어떻게 되나요?</h2>
          <div class="region-content-body">
            <table class="region-hub-hours">
              <thead><tr><th>요일</th><th>진료</th><th>휴게</th><th>접수 마감</th></tr></thead>
              <tbody>
                <tr><td>월·화·수·목</td><td>12:00 – 21:00</td><td>16:00 – 17:00</td><td>20:30</td></tr>
                <tr><td>금</td><td colspan={3}>정기휴무</td></tr>
                <tr><td>토·일</td><td>10:00 – 17:00</td><td>13:00 – 14:00</td><td>16:30</td></tr>
              </tbody>
            </table>
            <p>공휴일은 휴진하고, 대체공휴일에는 진료합니다. 주 4일은 저녁 9시까지 진료하고 토·일에도 문을 열어, 평일 낮에 시간을 내기 어려운 분도 퇴근 뒤나 주말에 예약하실 수 있습니다.</p>
          </div>
        </div>
      </section>

      <section class="region-content-section">
        <div class="container-wide">
          <h2 class="section-heading">누가 진료하나요?</h2>
          <div class="region-content-body">
            <p><a href="/doctors/choi-hyoyoung"><strong>최효영 대표원장</strong></a>이 진료합니다. 강원대학교 치과대학 치의학과를 졸업(2021)했고, 사상연세비앤이치과병원과 다대치과의원에서 원장으로 진료한 뒤 명지국제신도시에 이음치과의원을 열었습니다. 주로 보는 분야는 임플란트·심미보철·턱관절이며, 환자 질문을 모은 교육용 소책자 『치과가 두렵지 않으면 좋겠습니다』를 직접 썼습니다.</p>
            <p>검진 때 CBCT 3D 영상과 구강 스캐너 데이터를 화면으로 함께 보면서 지금 상태와 선택지, 비용을 설명한 뒤 치료를 시작합니다. 항목별 비용은 <a href="/prices">비용 안내(수가표)</a>에 공개되어 있습니다.</p>
          </div>
        </div>
      </section>

      <section class="region-treatments" id="regionTreatments">
        <div class="container-wide">
          <h2 class="section-heading">명지 치과에서 받을 수 있는 진료</h2>
          <ul class="region-hub-treat-list">
            {HUB_TREATMENTS.map((t) => (
              <li><a href={`/treatments/${t.slug}`}><strong>{t.name}</strong></a> — {t.note}</li>
            ))}
          </ul>
          <p class="region-hub-matrix">
            명지동 기준 상세 안내: <a href="/regions/myeongji/implant">명지동 임플란트</a> · <a href="/regions/myeongji/invisalign">명지동 투명교정</a> · <a href="/regions/myeongji/laminate">명지동 라미네이트</a> · <a href="/regions/myeongji/orthodontics">명지동 치아교정</a>
          </p>
        </div>
      </section>

      <section class="region-content-section">
        <div class="container-wide">
          <h2 class="section-heading">처음 가면 어떤 순서로 진행되나요?</h2>
          <div class="region-content-body">
            <ol class="region-hub-steps">
              <li id="step-1"><strong>예약</strong> — 전화·네이버 예약·카카오톡 중 편한 방법으로 날짜를 잡습니다.</li>
              <li id="step-2"><strong>접수</strong> — 2층 접수처에서 접수하고 불편한 곳과 원하는 진료를 알려 주세요.</li>
              <li id="step-3"><strong>검사</strong> — 필요에 따라 CBCT 3D 촬영과 구강 스캔을 합니다.</li>
              <li id="step-4"><strong>설명</strong> — 촬영 영상을 함께 보며 원인, 치료 방법별 장단점, 기간과 비용을 안내합니다.</li>
              <li id="step-5"><strong>치료</strong> — 동의한 계획대로 진행하고, 당일 가능한 처치는 그날 마칩니다.</li>
              <li id="step-6"><strong>관리</strong> — 치료 후 주의사항을 안내하고 다음 검진 날짜를 잡습니다.</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="region-faq" id="regionFaq">
        <div class="container-wide">
          <h2 class="section-heading">명지 치과 자주 묻는 질문</h2>
          <div class="region-faq-list">
            {MYEONGJI_HUB_FAQS.map((f) => (
              <details class="region-faq-item">
                <summary><strong>{f.question}</strong></summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section class="region-nearby">
        <div class="container-wide">
          <h2 class="section-heading">명지 인근 지역 안내</h2>
          <div class="region-nearby-grid">
            {HUB_NEARBY.map((n) => <a href={`/regions/${n.slug}`} class="region-nearby-card">{n.name} 치과 안내</a>)}
            <a href="/regions" class="region-nearby-card">전체 진료 지역</a>
          </div>
        </div>
      </section>

      <section class="region-map">
        <div class="container-wide">
          <h2 class="section-heading">예약·문의</h2>
          <div class="region-cta">
            <a href="https://m.place.naver.com/hospital/2005922467/booking" target="_blank" rel="noopener" class="treat-cta-btn primary">네이버 예약</a>
            <a href="tel:051-206-5888" class="treat-cta-btn secondary">051-206-5888 전화</a>
            <a href="http://pf.kakao.com/_diyyn" target="_blank" rel="noopener" class="treat-cta-btn secondary">카카오톡 상담</a>
            <a href="https://map.naver.com/p/entry/place/2005922467" target="_blank" rel="noopener" class="treat-cta-btn secondary">네이버 지도</a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
.page-region-hub .breadcrumb{font-size:.85rem;opacity:.75;margin-bottom:12px}
.page-region-hub .breadcrumb a{color:inherit}
.page-region-hub .breadcrumb .bc-sep{margin:0 6px}
.region-hub-reviewed{font-size:.8rem;opacity:.7;margin-top:12px}
.region-hub-spec{display:grid;grid-template-columns:max-content 1fr;gap:8px 16px;margin:16px 0}
.region-hub-spec dt{font-weight:700}
.region-hub-spec dd{margin:0}
.region-hub-hours{width:100%;border-collapse:collapse;margin:8px 0 16px;font-size:.95rem}
.region-hub-hours th,.region-hub-hours td{border-bottom:1px solid rgba(15,27,45,.12);padding:10px 8px;text-align:left}
.region-hub-treat-list{list-style:none;padding:0;margin:0 0 16px;display:grid;gap:10px}
.region-hub-treat-list li{line-height:1.6}
.region-hub-steps{padding-left:1.4em;display:grid;gap:8px;line-height:1.7}
.region-hub-matrix{font-size:.95rem;line-height:1.8}
@media (max-width:640px){.region-hub-spec{grid-template-columns:1fr}.region-hub-hours{font-size:.85rem}}
` }} />
    </div>
  ))
}
