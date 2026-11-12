// app.js 내용 해시 (vite.config.ts define)
declare const __APP_JS_V__: string
declare const __SUB_JS_V__: string
declare const __SCROLL_PERF_JS_V__: string
declare const __RENEW_JS_V__: string
import { rnNav, rnFooter } from './chrome'

/** 하위 페이지 틀: 공통 내비 + 본문 + 공통 바닥 (2026-11 리뉴얼 — 내비·푸터·고정 버튼은 chrome.tsx) */
export function subPageLayout(title: string, children: any) {
  return (
    <div id="app" class="sub-page">
      {rnNav(false)}

      {/* Page Content */}
      <main class="sub-page-content" role="main">
        {children}
      </main>

      {rnFooter()}

      {/* 서브페이지: GSAP/gsap-init 미로드 — app.js IntersectionObserver 리빌로 충분 (-180KB) */}
      <script src={`/static/renew.js?v=${__RENEW_JS_V__}`} defer></script>
      <script src={`/static/app.js?v=${__APP_JS_V__}`} defer></script>
      <script src={`/static/sub.js?v=${__SUB_JS_V__}`} defer></script>
      <script src={`/static/scroll-perf-patch.js?v=${__SCROLL_PERF_JS_V__}`} defer></script>
    </div>
  )
}
