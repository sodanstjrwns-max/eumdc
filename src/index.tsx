import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import type { HonoEnv } from './types'
import casesRoutes from './routes/cases'
import blogsRoutes from './routes/blogs'
import noticesRoutes from './routes/notices'
import uploadRoutes from './routes/upload'
import authRoutes, { requireAdmin } from './routes/auth'
import usersRoutes from './routes/users'
import faqRoutes from './routes/faq'
import reservationRoutes from './routes/reservations'
import dictionaryRoutes from './routes/dictionary'
import { mainPage } from './pages/main'
import { casesPage, caseDetailPage } from './pages/cases'
import { blogsPage, blogDetailPage } from './pages/blogs'
import { noticesPage, noticeDetailPage } from './pages/notices'
import { adminPage } from './pages/admin'
import { faqPage } from './pages/faq'
import { dictionaryPage, dictionaryDetailPage } from './pages/dictionary'
import { signupPage } from './pages/signup'
import { loginPage } from './pages/login'
import {
  defaultSeo, localBusinessJsonLd, websiteJsonLd, breadcrumbJsonLd,
  faqPageJsonLd, blogPostingJsonLd, medicalWebPageJsonLd,
  caseDetailJsonLd, blogListJsonLd, personJsonLd, visitHowToJsonLd,
  speakableJsonLd,
  SITE_URL, SITE_NAME
} from './seo'

const app = new Hono<HonoEnv>()

app.use(renderer)
app.use('/api/*', cors())

// === Auth routes ===
app.route('', authRoutes)
app.route('', usersRoutes)
app.route('', uploadRoutes)

// === Admin auth middleware ===
app.use('/api/admin/cases/*', requireAdmin())
app.use('/api/admin/cases', requireAdmin())
app.use('/api/admin/blogs/*', requireAdmin())
app.use('/api/admin/blogs', requireAdmin())
app.use('/api/admin/notices/*', requireAdmin())
app.use('/api/admin/notices', requireAdmin())
app.use('/api/admin/faq/*', requireAdmin())
app.use('/api/admin/faq', requireAdmin())
app.use('/api/admin/users', requireAdmin())
app.use('/api/admin/users/*', requireAdmin())
app.use('/api/admin/stats', requireAdmin())
app.use('/api/admin/reservations', requireAdmin())
app.use('/api/admin/reservations/*', requireAdmin())

// === API routes ===
app.route('', casesRoutes)
app.route('', blogsRoutes)
app.route('', noticesRoutes)
app.route('', faqRoutes)
app.route('', reservationRoutes)
app.route('', dictionaryRoutes)

// ═══════════════════════════════════════════
// SEO/AEO OPTIMIZED PUBLIC PAGES
// ═══════════════════════════════════════════

// === 메인 페이지 ===
app.get('/', (c) => {
  return c.render(mainPage(), {
    seo: {
      title: '이음치과의원 | 부산 명지 임플란트·심미보철·턱관절 전문 — 야간·주말진료',
      description: '부산 강서구 명지 이음치과의원 - 실력으로 신뢰를, 신뢰로 마음까지 잇습니다. 임플란트, 심미보철, 심미레진, 턱관절(TMJ) 전문. 월-목 야간 21시, 토·일 진료. ☎ 051-206-5888. 주차 2시간 무료.',
      keywords: '이음치과, 부산치과, 명지치과, 임플란트, 심미보철, 라미네이트, 턱관절, TMJ, 최효영, 강서구치과, 명지국제신도시, 야간진료, 주말진료, 부산임플란트, 부산라미네이트',
      canonical: SITE_URL,
      ogUrl: SITE_URL,
      speakable: ['.hero-title', '.manifesto-text', '.director-quote'],
      jsonLd: [
        localBusinessJsonLd(),
        websiteJsonLd(),
        personJsonLd(),
        visitHowToJsonLd(),
        speakableJsonLd(SITE_URL, ['.hero-title', '.manifesto-text', '.director-quote'])
      ]
    }
  })
})

// === 비포애프터 목록 ===
app.get('/cases', (c) => {
  return c.render(casesPage(), {
    seo: {
      title: '비포애프터 | 이음치과의원 실제 치료 전후 사진',
      description: '이음치과의원의 실제 임플란트, 심미보철, 레진, 턱관절 치료 비포애프터 사진을 확인하세요. 파노라마·구내 사진으로 눈에 보이는 치료 결과를 증명합니다.',
      keywords: '치과 비포애프터, 임플란트 전후사진, 심미보철 결과, 라미네이트 전후, 치아 성형 전후, 부산치과 치료사례',
      canonical: `${SITE_URL}/cases`,
      ogUrl: `${SITE_URL}/cases`,
      jsonLd: [
        medicalWebPageJsonLd({
          name: '비포애프터 치료 사례',
          description: '이음치과의원의 실제 치료 전후 사진 모음. 임플란트, 심미보철, 레진 수복 결과를 확인하세요.',
          url: '/cases',
          specialty: 'Dentistry'
        }),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '비포애프터', url: '/cases' }])
      ]
    }
  })
})

// === 비포애프터 상세 (동적 SEO) ===
app.get('/cases/:id', async (c) => {
  const id = c.req.param('id')
  const caseData = await c.env.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(id).first() as any
  const title = caseData?.title || '비포애프터 상세'
  const desc = caseData?.description?.substring(0, 160) || '이음치과의원의 치료 결과를 확인하세요.'
  const category = caseData?.category || 'general'
  const categoryNames: Record<string, string> = {
    implant: '임플란트', aesthetic: '심미보철', resin: '심미레진',
    tmj: '턱관절', general: '일반진료'
  }

  return c.render(caseDetailPage(id), {
    seo: {
      title: `${title} | 이음치과 ${categoryNames[category] || ''} 비포애프터`,
      description: desc,
      keywords: `${categoryNames[category] || ''} 비포애프터, ${categoryNames[category] || ''} 전후사진, 치과 치료결과, 이음치과`,
      canonical: `${SITE_URL}/cases/${id}`,
      ogUrl: `${SITE_URL}/cases/${id}`,
      ogImage: caseData?.pano_after || caseData?.intra_after || undefined,
      jsonLd: [
        caseData ? caseDetailJsonLd({
          id: caseData.id, title, category,
          description: caseData.description,
          pano_before: caseData.pano_before, pano_after: caseData.pano_after,
          intra_before: caseData.intra_before, intra_after: caseData.intra_after,
          treatment_date: caseData.treatment_date, created_at: caseData.created_at
        }) : medicalWebPageJsonLd({ name: title, description: desc, url: `/cases/${id}` }),
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '비포애프터', url: '/cases' },
          { name: title, url: `/cases/${id}` }
        ])
      ]
    }
  })
})

// === 블로그 목록 ===
app.get('/blogs', (c) => {
  return c.render(blogsPage(), {
    seo: {
      title: '치과 건강 블로그 | 이음치과의원 — 임플란트·보철·구강관리 정보',
      description: '이음치과의원 블로그 - 임플란트, 심미보철, 충치 예방, 잇몸 관리 등 전문 치과 건강 정보. 최효영 원장이 직접 작성하는 치과 건강 가이드.',
      keywords: '치과 블로그, 임플란트 정보, 치아 건강, 치과 상식, 구강 관리, 이음치과 블로그, 부산치과 정보',
      canonical: `${SITE_URL}/blogs`,
      ogUrl: `${SITE_URL}/blogs`,
      jsonLd: [
        blogListJsonLd(),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '블로그', url: '/blogs' }])
      ]
    }
  })
})

// === 블로그 상세 (동적 SEO + BlogPosting 스키마) ===
app.get('/blogs/:id', async (c) => {
  const id = c.req.param('id')
  const blog = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first() as any
  const title = blog?.meta_title || blog?.title || '블로그 글'
  const desc = blog?.meta_description || blog?.content?.substring(0, 160) || '이음치과의원 블로그'
  const slug = blog?.slug || id

  return c.render(blogDetailPage(id), {
    seo: {
      title: `${title} | 이음치과 블로그`,
      description: desc,
      keywords: '치과 건강정보, 이음치과 블로그, 부산치과',
      canonical: `${SITE_URL}/blogs/${slug}`,
      ogType: 'article',
      ogUrl: `${SITE_URL}/blogs/${slug}`,
      ogImage: blog?.thumbnail || undefined,
      ogArticle: {
        publishedTime: blog?.created_at,
        modifiedTime: blog?.updated_at || blog?.created_at,
        author: blog?.author_name || '최효영',
        section: '치과 건강',
        tags: ['치과', '이음치과', '부산치과', '건강정보']
      },
      jsonLd: [
        blogPostingJsonLd({
          title, description: desc,
          slug,
          content: blog?.content,
          thumbnail: blog?.thumbnail,
          created_at: blog?.created_at || new Date().toISOString(),
          updated_at: blog?.updated_at,
          author: blog?.author_name || '최효영'
        }),
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '블로그', url: '/blogs' },
          { name: title, url: `/blogs/${slug}` }
        ])
      ]
    }
  })
})

// === 공지사항 목록 ===
app.get('/notices', (c) => {
  return c.render(noticesPage(), {
    seo: {
      title: '공지사항 | 이음치과의원 — 진료 안내·휴진·이벤트',
      description: '이음치과의원의 진료 안내, 휴진 일정, 이벤트 등 최신 공지사항을 확인하세요.',
      canonical: `${SITE_URL}/notices`,
      ogUrl: `${SITE_URL}/notices`,
      jsonLd: [
        { '@context': 'https://schema.org', '@type': 'CollectionPage', name: '이음치과 공지사항', url: `${SITE_URL}/notices`, isPartOf: { '@id': `${SITE_URL}/#website` } },
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '공지사항', url: '/notices' }])
      ]
    }
  })
})

// === 공지사항 상세 ===
app.get('/notices/:id', async (c) => {
  const id = c.req.param('id')
  const notice = await c.env.DB.prepare('SELECT * FROM notices WHERE id = ?').bind(id).first() as any
  const title = notice?.title || '공지사항'
  const desc = notice?.content?.substring(0, 160) || '이음치과의원 공지사항'

  return c.render(noticeDetailPage(id), {
    seo: {
      title: `${title} | 이음치과 공지사항`,
      description: desc,
      canonical: `${SITE_URL}/notices/${id}`,
      ogUrl: `${SITE_URL}/notices/${id}`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: desc,
          datePublished: notice?.created_at,
          dateModified: notice?.updated_at || notice?.created_at,
          author: { '@type': 'Organization', name: SITE_NAME },
          publisher: { '@type': 'Organization', name: SITE_NAME },
          mainEntityOfPage: `${SITE_URL}/notices/${id}`
        },
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '공지사항', url: '/notices' },
          { name: title, url: `/notices/${id}` }
        ])
      ]
    }
  })
})

// ═══════════════════════════════════════════
// FAQ 페이지 — AEO 핵심! 서버사이드 FAQPage + 카테고리별 스키마
// ═══════════════════════════════════════════
app.get('/faq', async (c) => {
  // DB에서 FAQ 데이터 조회하여 서버사이드 JSON-LD + noscript 렌더링
  const { results } = await c.env.DB.prepare(
    `SELECT f.id, f.question, f.answer, fc.name as category_name, fc.slug as category_slug
     FROM faqs f JOIN faq_categories fc ON f.category_id = fc.id
     WHERE f.is_published = 1
     ORDER BY fc.sort_order, f.sort_order`
  ).all() as any

  const allFaqs = (results || []).map((r: any) => ({
    id: r.id, question: r.question, answer: r.answer,
    category_name: r.category_name, category_slug: r.category_slug
  }))

  // 카테고리별 그룹핑 (서버사이드 noscript 렌더링용)
  const grouped: Record<string, { name: string; faqs: typeof allFaqs }> = {}
  for (const faq of allFaqs) {
    if (!grouped[faq.category_slug]) {
      grouped[faq.category_slug] = { name: faq.category_name, faqs: [] }
    }
    grouped[faq.category_slug].faqs.push(faq)
  }

  // 전체 FAQ JSON-LD
  const faqJsonLd = faqPageJsonLd(allFaqs)

  return c.render(faqPage(grouped), {
    seo: {
      title: '자주 묻는 질문 (FAQ) | 이음치과의원 — 임플란트 비용·보험·시술 총정리',
      description: `이음치과의원 FAQ ${allFaqs.length}개 총정리 — 임플란트 비용은 얼마인가요? 시술 시간은? 보험 적용되나요? 턱관절 치료법은? 진료시간·주차·예약 방법까지, 환자분들이 가장 궁금해하시는 질문과 전문의 답변을 한곳에 모았습니다.`,
      keywords: '치과 FAQ, 임플란트 비용, 임플란트 시간, 치과 보험, 턱관절 치료, 부산치과 가격, 라미네이트 비용, 치과 주차, 야간진료치과, 이음치과 질문',
      canonical: `${SITE_URL}/faq`,
      ogUrl: `${SITE_URL}/faq`,
      speakable: ['.page-title', '.faq-q-text', '.faq-answer-inner'],
      jsonLd: [
        faqJsonLd,
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '자주 묻는 질문', url: '/faq' }]),
        speakableJsonLd(`${SITE_URL}/faq`, ['.page-title', '.faq-group-title', '.faq-q-text'])
      ]
    }
  })
})

// ═══════════════════════════════════════════
// 치과 용어 백과사전
// ═══════════════════════════════════════════
app.get('/dictionary', async (c) => {
  const totalQ = await c.env.DB.prepare('SELECT COUNT(*) as total FROM dict_terms WHERE is_published = 1').first() as any
  const total = totalQ?.total || 219

  return c.render(dictionaryPage(), {
    seo: {
      title: `치과 용어 백과사전 (${total}개) | 이음치과의원 — 임플란트·보철·치주 용어 총정리`,
      description: `이음치과의원이 알려드리는 치과 용어 백과사전. ${total}개 치과 전문 용어를 쉽고 친절하게 설명합니다. 임플란트, 심미보철, 근관치료, 잇몸, 턱관절 등 카테고리별 정리.`,
      keywords: '치과 용어, 치과 사전, 임플란트 용어, 치과 백과사전, 치과 상식, 치아 용어, 보철 용어, 근관치료, 이음치과, 부산치과',
      canonical: `${SITE_URL}/dictionary`,
      ogUrl: `${SITE_URL}/dictionary`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          '@id': `${SITE_URL}/dictionary/#termset`,
          name: '이음치과 치과 용어 백과사전',
          description: `${total}개 치과 전문 용어를 알기 쉽게 정리한 백과사전입니다.`,
          url: `${SITE_URL}/dictionary`,
          inLanguage: 'ko-KR',
          publisher: { '@id': `${SITE_URL}/#organization` },
          isPartOf: { '@id': `${SITE_URL}/#website` }
        },
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '치과 용어 백과사전', url: '/dictionary' }])
      ]
    }
  })
})

app.get('/dictionary/:slug', async (c) => {
  const slug = c.req.param('slug')
  const term = await c.env.DB.prepare(
    `SELECT dt.*, dc.name as category_name FROM dict_terms dt JOIN dict_categories dc ON dt.category_id = dc.id WHERE dt.slug = ?`
  ).bind(slug).first() as any

  const termName = term?.term || '치과 용어'
  const termDesc = term?.short_desc || '이음치과의원 치과 용어 백과사전'
  const termFull = term?.full_desc || termDesc
  const termEn = term?.english || ''
  const catName = term?.category_name || ''

  return c.render(dictionaryDetailPage(slug), {
    seo: {
      title: `${termName} 뜻 | ${catName} — 이음치과 치과 용어 백과사전`,
      description: `${termName}${termEn ? ` (${termEn})` : ''} — ${termDesc}. 이음치과의원이 쉽게 설명하는 치과 백과사전.`,
      keywords: `${termName}, ${termEn || ''}, ${catName}, 치과 용어, 치과 백과사전, 이음치과`,
      canonical: `${SITE_URL}/dictionary/${slug}`,
      ogUrl: `${SITE_URL}/dictionary/${slug}`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: termName,
          description: termFull,
          inDefinedTermSet: { '@id': `${SITE_URL}/dictionary/#termset` },
          url: `${SITE_URL}/dictionary/${slug}`
        },
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '치과 용어 백과사전', url: '/dictionary' },
          { name: termName, url: `/dictionary/${slug}` }
        ])
      ]
    }
  })
})

// === 회원가입 / 로그인 ===
app.get('/signup', (c) => {
  return c.render(signupPage(), {
    seo: {
      title: '회원가입 | 이음치과의원',
      description: '이음치과의원 회원가입 - 비포애프터 사진 열람, 예약 문의 등 회원 전용 서비스를 이용하세요.',
      noindex: true
    }
  })
})

app.get('/login', (c) => {
  return c.render(loginPage(), {
    seo: {
      title: '로그인 | 이음치과의원',
      description: '이음치과의원 로그인',
      noindex: true
    }
  })
})

// === Admin Page ===
app.get('/admin', (c) => c.html(adminPage()))

// ═══════════════════════════════════════════
// robots.txt + sitemap.xml (SEO 필수)
// ═══════════════════════════════════════════
app.get('/robots.txt', (c) => {
  return c.text(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /login
Disallow: /signup

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Yandex
User-agent: Yandex
Crawl-delay: 2

# AI Crawlers (환영)
User-agent: GPTBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: ClaudeBot
Allow: /
`)
})

app.get('/sitemap.xml', async (c) => {
  const now = new Date().toISOString().split('T')[0]

  // 동적 콘텐츠 URL
  const { results: blogs } = await c.env.DB.prepare(
    'SELECT id, slug, updated_at, thumbnail FROM blogs WHERE is_published = 1 ORDER BY created_at DESC LIMIT 200'
  ).all() as any
  const { results: cases } = await c.env.DB.prepare(
    'SELECT id, updated_at, pano_after, title FROM cases WHERE is_published = 1 ORDER BY created_at DESC LIMIT 200'
  ).all() as any
  const { results: notices } = await c.env.DB.prepare(
    'SELECT id, updated_at FROM notices WHERE is_published = 1 ORDER BY created_at DESC LIMIT 100'
  ).all() as any
  const { results: dictTerms } = await c.env.DB.prepare(
    'SELECT slug, updated_at, term FROM dict_terms WHERE is_published = 1 ORDER BY term LIMIT 500'
  ).all() as any

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- 정적 페이지 -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="ko" href="${SITE_URL}"/>
    <image:image>
      <image:loc>${SITE_URL}/static/img/photo_1.jpg</image:loc>
      <image:title>이음치과의원 외관</image:title>
    </image:image>
  </url>
  <url>
    <loc>${SITE_URL}/faq</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cases</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blogs</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/dictionary</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/notices</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`

  // 동적 블로그
  for (const b of (blogs || [])) {
    const date = b.updated_at?.split(' ')[0] || now
    const loc = `${SITE_URL}/blogs/${b.slug || b.id}`
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n`
    if (b.thumbnail) {
      xml += `    <image:image>\n      <image:loc>${b.thumbnail.startsWith('http') ? b.thumbnail : SITE_URL + b.thumbnail}</image:loc>\n      <image:title>${escXml(b.title || '블로그')}</image:title>\n    </image:image>\n`
    }
    xml += `  </url>\n`
  }

  // 동적 케이스
  for (const cs of (cases || [])) {
    const date = cs.updated_at?.split(' ')[0] || now
    xml += `  <url>\n    <loc>${SITE_URL}/cases/${cs.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n`
    if (cs.pano_after) {
      xml += `    <image:image>\n      <image:loc>${cs.pano_after.startsWith('http') ? cs.pano_after : SITE_URL + cs.pano_after}</image:loc>\n      <image:title>${escXml(cs.title || '비포애프터')}</image:title>\n    </image:image>\n`
    }
    xml += `  </url>\n`
  }

  // 동적 공지
  for (const n of (notices || [])) {
    const date = n.updated_at?.split(' ')[0] || now
    xml += `  <url>\n    <loc>${SITE_URL}/notices/${n.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`
  }

  // 백과사전 용어
  for (const dt of (dictTerms || [])) {
    const date = dt.updated_at?.split(' ')[0] || now
    xml += `  <url>\n    <loc>${SITE_URL}/dictionary/${dt.slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`
  }

  xml += '</urlset>'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200'
    }
  })
})

// XML 이스케이프
function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export default app
