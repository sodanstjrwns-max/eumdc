import { jsxRenderer } from 'hono/jsx-renderer'
import { raw } from 'hono/html'
import { renderSeoHead, defaultSeo } from './seo'
import type { SeoMeta } from './seo'

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { seo?: SeoMeta }): Response | Promise<Response>
  }
}

export const renderer = jsxRenderer(({ children, seo }) => {
  const meta: SeoMeta = seo || defaultSeo
  const seoHead = renderSeoHead(meta)

  return (
    <html lang="ko" prefix="og: https://ogp.me/ns#">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#00306A" />
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

        {/* 폰트 preconnect + preload (CLS 방지) */}
        {/* 폰트: weight 다이어트 (Noto 200/900 제거) + 비차단 로딩 (LCP 개선) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
          media="print"
          onload="this.media='all'"
        />
        <noscript>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </noscript>

        {/* CSS — versioned to bust edge cache */}
        <link href="/static/style.css?v=20260611b" rel="stylesheet" />
        <link href="/static/style-patch.css?v=20261003a" rel="stylesheet" />

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
