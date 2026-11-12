import { jsxRenderer } from 'hono/jsx-renderer'
import { raw } from 'hono/html'
import { renderSeoHead, defaultSeo } from './seo'
import type { SeoMeta } from './seo'

// 빌드 시 vite.config.ts 가 넣는 스타일시트 내용 해시 (?v= 캐시 버스팅)
declare const __STYLE_CSS_V__: string
declare const __STYLE_PATCH_CSS_V__: string
declare const __RENEW_CSS_V__: string
declare const __RENEW_HOME_CSS_V__: string

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { seo?: SeoMeta; bare?: boolean }): Response | Promise<Response>
  }
}

export const renderer = jsxRenderer(({ children, seo, bare }) => {
  const meta: SeoMeta = seo || defaultSeo
  const seoHead = renderSeoHead(meta)

  return (
    <html lang="ko" prefix="og: https://ogp.me/ns#">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#04142B" />
        <meta name="color-scheme" content="light" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="author" content="이음치과의원" />
        <meta name="publisher" content="이음치과의원" />

        {/* 파비콘 + PWA — 2026-10-14 승인 파비콘 (tools/favicons/out/eumdc) */}
        <link rel="icon" href="/favicon.ico?v=fav20261014" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png?v=fav20261014" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png?v=fav20261014" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=fav20261014" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=fav20261014" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" type="application/rss+xml" title="이음치과 블로그 RSS" href="/rss.xml" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />

        {/* 서체 (2026-11 리뉴얼): 제목 LINE Seed KR · 본문 Pretendard · 숫자/영문 Unbounded */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fonts-archive/LINESeedKR/LINESeedKR.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700&display=swap" />
        {/* 연출 on/off — 동작 줄이기 설정이면 rm (모든 내용이 펼쳐진 정적 화면) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add(matchMedia('(prefers-reduced-motion: reduce)').matches?'rm':'fx')" }} />

        {/* CSS — 내용 해시로 캐시 무효화. 홈(bare)은 새 스타일만, 하위 페이지는 기존 스타일 + 리뉴얼 테마 층 */}
        {bare ? (
          <>
            <link rel="preload" as="image" href="/static/img/photo_1.webp" />
            <link href={`/static/renew-home.css?v=${__RENEW_HOME_CSS_V__}`} rel="stylesheet" />
          </>
        ) : (
          <>
            <link href={`/static/style.css?v=${__STYLE_CSS_V__}`} rel="stylesheet" />
            <link href={`/static/style-patch.css?v=${__STYLE_PATCH_CSS_V__}`} rel="stylesheet" />
          </>
        )}
        <link href={`/static/renew.css?v=${__RENEW_CSS_V__}`} rel="stylesheet" />

        {/* GSAP은 홈(main.tsx)에서만 로드 — 서브페이지는 app.js IntersectionObserver로 충분 */}

        {/* 동적 SEO 메타 + JSON-LD */}
        {raw(seoHead)}
        {/* GA4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZF8ERCFZ6Q"></script>
        <script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-ZF8ERCFZ6Q',{anonymize_ip:true});" }} />
        <script dangerouslySetInnerHTML={{ __html: '(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","yc808lh5fe");' }} />
        <script defer src="https://pf-dashboard-2nt.pages.dev/beacon.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
})
