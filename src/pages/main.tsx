/** 홈 — 2026-11 리뉴얼 "빛"
 *  어두운 첫 화면에서 빛이 병원을 비추고, 스크롤하면 화면 전체가 밝아지며 "신뢰를, 잇습니다"로 이어진다.
 *  이야기 순서(질문 → 통찰 → 전환 → 약속 → 증거)와 문구는 이전 홈과 같다.
 *  h1(.hero-title)·원장 인용(.director-quote)·#myeongji-cards·#section-faq 는 구조화 데이터와 연결돼 있으니 이름을 바꾸지 말 것.
 */
import { raw } from 'hono/html'
import { SEO_REGIONS_MAP, SEO_TREATMENTS_MAP, PRIORITY_REGION_SLUGS, PRIORITY_TREATMENT_SLUGS } from '../data/seo-matrix'
import { MYEONGJI_CORE, myeongjiCorePath, myeongjiCoreCardImage, myeongjiCoreName } from '../data/myeongji-core'
import { HOME_FAQS } from '../seo'
import { HOME_BODY } from './home-body'
import { rnNav, rnFooter } from './chrome'

declare const __RENEW_JS_V__: string
declare const __RENEW_HOME_JS_V__: string

const LOOP = 'M200,100 C260,20 380,20 380,100 C380,180 260,180 200,100 C140,20 20,20 20,100 C20,180 140,180 200,100Z'

export function mainPage() {
  return (
    <div id="app" class="rn rn-home">
      <a href="#top" class="rn-skip">본문 바로가기</a>

      <div class="intro" aria-hidden="true">
        <svg class="intro-loop" viewBox="0 0 400 200" fill="none"><path d={LOOP} pathLength="1" /></svg>
        <span class="intro-word">IEUM</span>
      </div>

      {rnNav(true)}

      <main id="top">
        {raw(HOME_BODY)}

        {/* 지역 안내 — 사진 카드 6개는 ItemList JSON-LD(#myeongji-cards)와 1:1 */}
        <section class="area" aria-label="우리 동네 진료 안내">
          <div class="wrap">
            <header class="sec-head">
              <p class="eyebrow">08 — AREA GUIDE</p>
              <h2 class="sec-h"><span class="l">우리 동네 진료 안내</span></h2>
              <p class="sec-p">명지국제신도시·강서구·김해 인근 지역별로 임플란트·투명교정·라미네이트·치아교정 안내를 확인하세요. 위치·진료시간·주차·버스는 <a href="/regions/myeongji">명지 치과 안내</a>에 한눈에 정리했습니다.</p>
            </header>
            <h3 class="area-sub" id="myeongji-cards">명지 치과 진료별 안내</h3>
            <div class="area-cards">
              {MYEONGJI_CORE.map((p, i) => (
                <a href={myeongjiCorePath(p.slug)} data-hover data-rise>
                  <img src={myeongjiCoreCardImage(p.slug)} alt={myeongjiCoreName(p)} loading="lazy" decoding="async" width="600" height="600" />
                  <small>{String(i + 1).padStart(2, '0')} · {p.tag}</small>
                  <b>{myeongjiCoreName(p)}</b>
                  <span>{p.line}</span>
                </a>
              ))}
            </div>
            <div class="area-links">
              {PRIORITY_TREATMENT_SLUGS.map((tSlug) => {
                const t = SEO_TREATMENTS_MAP[tSlug]
                if (!t) return null
                return (
                  <div>
                    <h3><a href={`/treatments/${t.slug}`}>{t.name}</a></h3>
                    <p class="area-benefit">{t.shortBenefit}</p>
                    {PRIORITY_REGION_SLUGS.map((rSlug) => {
                      const r = SEO_REGIONS_MAP[rSlug]
                      if (!r) return null
                      return <a href={`/regions/${r.slug}/${t.slug}`}>{r.name} {t.name}</a>
                    })}
                  </div>
                )
              })}
            </div>
            {/* 이전 홈 진료 카드에 있던 용어 링크 5개 유지 */}
            <p class="area-terms">자주 찾는 용어
              <a href="/dictionary/cbct">CBCT</a>
              <a href="/dictionary/digital-guide">디지털 가이드</a>
              <a href="/dictionary/digital-impression">디지털 인상</a>
              <a href="/dictionary/laminate">라미네이트</a>
              <a href="/dictionary/all-ceramic">올세라믹</a>
            </p>
            <p class="area-more">
              <a class="rn-btn rn-btn-navy" href="/treatments" data-hover>전체 진료 안내 →</a>
              <a class="rn-btn rn-btn-line" href="/dictionary" data-hover>치과 용어 백과사전 →</a>
            </p>
          </div>
        </section>

        {/* 가시 FAQ — JSON-LD FAQPage 와 1:1 */}
        <section class="faq" id="section-faq" aria-label="자주 묻는 질문">
          <div class="wrap faq-grid">
            <header class="sec-head">
              <p class="eyebrow">09 — FAQ</p>
              <h2 class="sec-h"><span class="l">자주 묻는</span><span class="l">질문</span></h2>
              <p class="sec-p">환자분들이 가장 많이 궁금해하시는 질문을 정리했습니다.</p>
              <a class="rn-btn rn-btn-navy" href="/faq" data-hover>전체 FAQ 보기 →</a>
            </header>
            <div class="faq-list">
              {HOME_FAQS.map((f, i) => (
                <details open={i === 0}>
                  <summary><span>{String(i + 1).padStart(2, '0')}</span>{f.question}</summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {rnFooter()}

      <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
      <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js" defer></script>
      <script src={`/static/renew.js?v=${__RENEW_JS_V__}`} defer></script>
      <script src={`/static/renew-home.js?v=${__RENEW_HOME_JS_V__}`} defer></script>
    </div>
  )
}
