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

        {/* 파비콘 + PWA — 이음치과 로고 심볼 (치아 + 무한대) */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/static/favicon.svg?v=20260419c" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon-32.png?v=20260419c" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon-16.png?v=20260419c" />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png?v=20260419c" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/static/favicon.svg" color="#00306A" />

        {/* 폰트 preconnect + preload (CLS 방지) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@200;300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@200;300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* CSS — versioned to bust edge cache */}
        <link href="/static/style.css?v=20260423b" rel="stylesheet" />
        <link href="/static/style-patch.css?v=20260423b" rel="stylesheet" />

        {/* GSAP for advanced animations */}
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>

        {/* 동적 SEO 메타 + JSON-LD */}
        {raw(seoHead)}
      </head>
      <body>{children}</body>
    </html>
  )
})
