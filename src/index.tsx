import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie } from 'hono/cookie'
import { renderer } from './renderer'
import type { HonoEnv } from './types'
import { verifyHmacToken } from './routes/auth'
import casesRoutes from './routes/cases'
import blogsRoutes from './routes/blogs'
import noticesRoutes from './routes/notices'
import uploadRoutes from './routes/upload'
import authRoutes, { requireAdmin } from './routes/auth'
import usersRoutes from './routes/users'
import faqRoutes from './routes/faq'
import reservationRoutes from './routes/reservations'
import dictionaryRoutes from './routes/dictionary'
import treatmentsRoutes from './routes/treatments'
import doctorsRoutes from './routes/doctors'
import regionsRoutes from './routes/regions'
import { mainPage } from './pages/main'
import { casesPage, caseDetailPage } from './pages/cases'
import { blogsPage, blogDetailPage } from './pages/blogs'
import { noticesPage, noticeDetailPage } from './pages/notices'
import { adminPage } from './pages/admin'
import { faqPage } from './pages/faq'
import { dictionaryPage, dictionaryDetailPage } from './pages/dictionary'
import { signupPage } from './pages/signup'
import { loginPage } from './pages/login'
import { treatmentsPage, treatmentDetailPage } from './pages/treatments'
import { doctorsPage, doctorDetailPage } from './pages/doctors'
import { missionPage, visitGuidePage } from './pages/about'
import { seoRegionPage, seoRegionListPage } from './pages/seo-region'
import {
  defaultSeo, localBusinessJsonLd, websiteJsonLd, breadcrumbJsonLd,
  faqPageJsonLd, blogPostingJsonLd, medicalWebPageJsonLd,
  caseDetailJsonLd, blogListJsonLd, personJsonLd, visitHowToJsonLd,
  speakableJsonLd, treatmentJsonLd, doctorJsonLd,
  SITE_URL, SITE_NAME
} from './seo'

const app = new Hono<HonoEnv>()

// === SEO: www → non-www 301 리다이렉트 ===
app.use('*', async (c, next) => {
  const url = new URL(c.req.url)
  if (url.hostname === 'www.eumdc.kr') {
    url.hostname = 'eumdc.kr'
    return c.redirect(url.toString(), 301)
  }
  await next()
})

// === 보안 + SEO 응답 헤더 ===
app.use('*', async (c, next) => {
  await next()
  // 보안 헤더
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'SAMEORIGIN')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  // SEO: 검색엔진이 X-Robots-Tag도 읽음
  if (!c.req.path.startsWith('/admin') && !c.req.path.startsWith('/api/')) {
    c.header('X-Robots-Tag', 'index, follow')
  }
})

app.use(renderer)
app.use('/api/*', cors())

// ═══════════════════════════════════════════
// 보안 & 성능 미들웨어 (모든 요청에 적용)
// ═══════════════════════════════════════════
app.use('*', async (c, next) => {
  await next()

  const path = c.req.path
  const status = c.res.status

  // 보안 헤더 (HTTPS 1년 강제, 클릭재킹 방어, MIME 스니핑 방어)
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'SAMEORIGIN')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), interest-cohort=()')

  // 캐시 전략 (Cloudflare Edge + Browser)
  if (path.startsWith('/api/')) {
    // API는 캐시 금지 (민감 데이터 가능)
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate')
  } else if (path === '/sitemap.xml' || path === '/robots.txt') {
    // SEO 인프라: 1시간 캐시
    c.header('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  } else if (path === '/cases' || path.startsWith('/cases/')) {
    // 비포애프터: 로그인 여부에 따라 응답이 달라짐 → 캐시 금지
    c.header('Cache-Control', 'private, no-store, no-cache, must-revalidate')
  } else if (status === 200 && c.req.method === 'GET') {
    // 공개 HTML 페이지: 브라우저 5분, CF 엣지 1시간 (stale-while-revalidate로 끊김 없음)
    c.header('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400')
  } else if (status === 404) {
    // 404는 짧게 캐시 (잘못된 URL이 계속 DB 호출하는 것 방지)
    c.header('Cache-Control', 'public, max-age=60, s-maxage=300')
  }
})

// === Auth routes (public, before admin middleware) ===
app.route('', authRoutes)
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
app.use('/api/admin/doctors', requireAdmin())
app.use('/api/admin/doctors/*', requireAdmin())

// === API routes (after admin middleware) ===
app.route('', usersRoutes)     // Contains /api/admin/users, /api/admin/stats (protected above)
app.route('', casesRoutes)
app.route('', blogsRoutes)
app.route('', noticesRoutes)
app.route('', faqRoutes)
app.route('', reservationRoutes)
app.route('', dictionaryRoutes)
app.route('', treatmentsRoutes)
app.route('', doctorsRoutes)
app.route('', regionsRoutes)

// ═══════════════════════════════════════════
// SEO/AEO OPTIMIZED PUBLIC PAGES
// ═══════════════════════════════════════════

// === 메인 페이지 ===
app.get('/', (c) => {
  return c.render(mainPage(), {
    seo: {
      title: '이음치과의원 | 부산 명지 임플란트·심미보철 전문',
      description: '부산 강서구 명지국제신도시 이음치과의원. CBCT·디지털 가이드 임플란트, 라미네이트·올세라믹 심미보철 전문. 충치·신경치료, 잇몸치료, 턱관절 등 일반진료까지 한 곳에서. 월~목 야간 21시, 토·일 주말 진료, 금요일 휴무. 네이버 평점 4.9★. ☎ 051-206-5888. 무료주차 2시간.',
      keywords: '이음치과, 부산치과, 명지치과, 임플란트, 심미보철, 라미네이트, 턱관절, TMJ, 최효영, 강서구치과, 명지국제신도시, 야간진료, 주말진료, 부산임플란트, 부산라미네이트',
      canonical: SITE_URL,
      ogUrl: SITE_URL,
      speakable: ['.hero-title', '.manifesto-text', '.director-quote'],
      jsonLd: [
        localBusinessJsonLd(),
        websiteJsonLd(),
        personJsonLd(),
        visitHowToJsonLd(),
        speakableJsonLd(SITE_URL, ['.hero-title', '.manifesto-text', '.director-quote']),
        // AEO 인라인 FAQ — AI 검색엔진이 바로 답변에 활용
        faqPageJsonLd([
          { question: '이음치과의원 위치가 어디인가요?', answer: '부산광역시 강서구 명지국제8로 265 2층에 위치해 있습니다. 명지국제신도시 중심부이며 주차 2시간 무료입니다.' },
          { question: '이음치과 진료시간이 어떻게 되나요?', answer: '월~목 12:00~21:00 (야간진료), 토·일 10:00~17:00, 금요일 정기휴무입니다.' },
          { question: '이음치과 임플란트 비용은 얼마인가요?', answer: '임플란트는 1본 기준 100만~350만원이며, 만 65세 이상은 건강보험 적용 시 본인부담 50~100만원입니다. 정확한 비용은 CBCT 3D 정밀 진단 후 안내드립니다.' },
          { question: '이음치과 대표원장은 누구인가요?', answer: '최효영 대표원장입니다. 강원대학교 치과대학 졸업, 대한구강악면임플란트학회·대한치과보철학회·대한치과보존학회 정회원으로 활동 중이며, 임플란트·심미보철 전문입니다.' },
          { question: '이음치과에서 주말 진료도 가능한가요?', answer: '네, 토요일과 일요일 모두 10:00~17:00 진료합니다. 주말에도 임플란트, 심미보철, 충치치료 등 모든 진료가 가능합니다.' },
          { question: '명지에서 임플란트 잘하는 치과 어디인가요?', answer: '이음치과의원은 CBCT 3D 정밀 진단, 구강스캐너, 원내 3D 프린터를 활용한 디지털 가이드 임플란트를 시행합니다. 절개를 최소화하여 통증과 회복기간을 단축합니다. 네이버 평점 4.9★, 리뷰 387+건입니다.' },
          { question: '이음치과 전화번호가 뭔가요?', answer: '051-206-5888입니다. 전화 예약 및 상담이 가능합니다.' }
        ])
      ]
    }
  })
})

// === 진료과목 목록 ===
app.get('/treatments', (c) => {
  return c.render(treatmentsPage(), {
    seo: {
      title: '진료 안내 | 이음치과 임플란트·심미보철·레진·일반진료·턱관절',
      description: '부산 명지 이음치과 진료과목 안내. CBCT·디지털 가이드 임플란트, 라미네이트·올세라믹 심미보철, 턱관절(TMJ), 심미레진, 충치·근관치료, 잇몸치료까지 전문의 시스템. 투명한 설명과 정직한 수가, 확실한 결과를 약속합니다.',
      keywords: '이음치과 진료, 임플란트, 심미보철, 턱관절, 심미레진, 충치치료, 신경치료, 잇몸치료, 소아치과, 부산치과 진료',
      canonical: `${SITE_URL}/treatments`,
      ogUrl: `${SITE_URL}/treatments`,
      jsonLd: [
        medicalWebPageJsonLd({ name: '이음치과 진료 안내', description: '이음치과의원의 전문 진료과목을 소개합니다.', url: '/treatments', specialty: 'Dentistry' }),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '진료 안내', url: '/treatments' }])
      ]
    }
  })
})

// === 진료과목 상세 ===
// 구 URL 호환: prosthetics → aesthetic (DB slug은 aesthetic)
const TREATMENT_SLUG_ALIASES: Record<string, string> = {
  'prosthetics': 'aesthetic',
}

app.get('/treatments/:slug', async (c) => {
  const rawSlug = c.req.param('slug')
  // 별칭 슬러그는 301 영구 리다이렉트
  if (TREATMENT_SLUG_ALIASES[rawSlug]) {
    return c.redirect(`/treatments/${TREATMENT_SLUG_ALIASES[rawSlug]}`, 301)
  }
  const slug = rawSlug
  const treatment = await c.env.DB.prepare(
    'SELECT * FROM treatments WHERE slug = ? AND is_published = 1'
  ).bind(slug).first() as any

  // 존재하지 않는 slug는 404로 응답 (soft 404 방지 - SEO 안전)
  if (!treatment) {
    c.status(404)
    return c.render(
      <div class="container py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-8">요청하신 진료 페이지를 찾을 수 없습니다.</p>
        <a href="/treatments" class="btn-primary">전체 진료 안내로 이동</a>
      </div>,
      {
        seo: {
          title: '진료를 찾을 수 없습니다 (404) | 이음치과의원',
          description: '요청하신 진료 페이지를 찾을 수 없습니다. 이음치과 전체 진료 안내를 확인해주세요.',
          canonical: `${SITE_URL}/treatments`,
          noindex: true
        }
      }
    )
  }

  const name = treatment.name
  const desc = treatment.meta_description || treatment.short_desc || `이음치과의원 ${name} 전문 진료 안내.`
  const metaTitle = treatment.meta_title || `${name} | 이음치과 전문 진료`

  // FAQ for schema
  let faqJsonLd = null
  if (treatment) {
    const { results: faqs } = await c.env.DB.prepare(
      'SELECT question, answer FROM treatment_faqs WHERE treatment_id = ? AND is_published = 1 ORDER BY sort_order'
    ).bind(treatment.id).all() as any
    if (faqs && faqs.length > 0) {
      faqJsonLd = faqPageJsonLd(faqs)
    }
  }

  return c.render(treatmentDetailPage(slug, name, treatment?.hero_title || name), {
    seo: {
      title: metaTitle,
      description: desc,
      keywords: treatment?.keywords || `${name}, 이음치과, 부산치과`,
      canonical: `${SITE_URL}/treatments/${slug}`,
      ogUrl: `${SITE_URL}/treatments/${slug}`,
      ogImage: treatment?.hero_image || undefined,
      jsonLd: [
        treatment ? treatmentJsonLd(treatment) : medicalWebPageJsonLd({ name, description: desc, url: `/treatments/${slug}` }),
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '진료 안내', url: '/treatments' },
          { name, url: `/treatments/${slug}` }
        ]),
        ...(faqJsonLd ? [faqJsonLd] : [])
      ]
    }
  })
})

// === 의료진 전체 ===
app.get('/doctors', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM doctors WHERE is_published = 1 ORDER BY sort_order, id'
  ).all() as any
  return c.render(doctorsPage(results || []), {
    seo: {
      title: '의료진 소개 | 이음치과 최효영 대표원장·전문 치과의사',
      description: '이음치과의원 의료진 소개. 강원대학교 치과대학 출신 최효영 대표원장이 임플란트·심미보철을 중심으로 충치·신경치료, 잇몸치료, 턱관절 등 CBCT·디지털 장비 기반의 정밀 진료를 제공합니다.',
      keywords: '이음치과 의료진, 최효영 원장, 부산치과 전문의, 임플란트 전문의, 치과의사',
      canonical: `${SITE_URL}/doctors`,
      ogUrl: `${SITE_URL}/doctors`,
      jsonLd: [
        medicalWebPageJsonLd({ name: '이음치과 의료진 소개', description: '이음치과의원의 전문 의료진을 소개합니다.', url: '/doctors' }),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '의료진 소개', url: '/doctors' }])
      ]
    }
  })
})

// === 의료진 상세 ===
app.get('/doctors/:slug', async (c) => {
  const slug = c.req.param('slug')
  const doctor = await c.env.DB.prepare(
    'SELECT * FROM doctors WHERE slug = ? AND is_published = 1'
  ).bind(slug).first() as any

  // 존재하지 않는 의료진 → 404
  if (!doctor) {
    c.status(404)
    return c.render(
      <div class="container py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-8">요청하신 의료진 페이지를 찾을 수 없습니다.</p>
        <a href="/doctors" class="btn-primary">의료진 목록으로 이동</a>
      </div>,
      {
        seo: {
          title: '의료진을 찾을 수 없습니다 (404) | 이음치과의원',
          description: '요청하신 의료진 페이지를 찾을 수 없습니다.',
          canonical: `${SITE_URL}/doctors`,
          noindex: true
        }
      }
    )
  }

  const name = doctor.name
  const title = doctor.title || '원장'

  return c.render(doctorDetailPage(slug, doctor), {
    seo: {
      title: `${name} ${title} | 이음치과의원 의료진`,
      description: doctor?.greeting || `이음치과의원 ${name} ${title}. 실력과 진심으로 진료합니다.`,
      keywords: `${name}, ${title}, 이음치과 의료진, 부산치과`,
      canonical: `${SITE_URL}/doctors/${slug}`,
      ogUrl: `${SITE_URL}/doctors/${slug}`,
      ogImage: doctor?.photo || undefined,
      jsonLd: [
        doctor ? doctorJsonLd(doctor) : {},
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '의료진 소개', url: '/doctors' },
          { name: `${name} ${title}`, url: `/doctors/${slug}` }
        ])
      ]
    }
  })
})

// === 병원 미션 ===
app.get('/about', (c) => {
  return c.render(missionPage(), {
    seo: {
      title: '병원 소개 | 이음치과의원 미션·가치·진료철학',
      description: '이음치과의원의 미션과 핵심 가치. CBCT, 구강스캐너, 3D 프린터 등 최첨단 디지털 장비와 청결한 감염관리 시스템. 투명성·실력·신뢰·공감의 네 가지 가치로 평생 주치의 진료를 실현합니다.',
      keywords: '이음치과 소개, 병원미션, 치과 철학, 디지털 치과, CBCT, 구강스캐너, 3D프린터, 부산치과',
      canonical: `${SITE_URL}/about`,
      ogUrl: `${SITE_URL}/about`,
      jsonLd: [
        localBusinessJsonLd(),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '병원 소개', url: '/about' }])
      ]
    }
  })
})

// === 내원 안내 ===
app.get('/visit', (c) => {
  return c.render(visitGuidePage(), {
    seo: {
      title: '내원 안내 | 이음치과 오시는길·진료시간·주차·수가표',
      description: '이음치과의원 오시는 길, 진료시간, 수가 안내. 부산 강서구 명지국제8로 265 2층. 주차 2시간 무료. ☎ 051-206-5888.',
      keywords: '이음치과 오시는 길, 이음치과 진료시간, 이음치과 주차, 이음치과 비용, 부산 명지 치과, 야간진료',
      canonical: `${SITE_URL}/visit`,
      ogUrl: `${SITE_URL}/visit`,
      jsonLd: [
        visitHowToJsonLd(),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '내원 안내', url: '/visit' }])
      ]
    }
  })
})

// === 사용자 로그인 여부 확인 헬퍼 ===
async function isUserLoggedIn(c: any): Promise<boolean> {
  const session = getCookie(c, 'eum_user')
  if (!session) return false
  const secret = c.env.AUTH_SECRET || 'fallback-secret'
  const payload = await verifyHmacToken(session, secret)
  if (!payload || !payload.startsWith('eum-user:')) return false
  try {
    const userId = parseInt(payload.split(':')[1])
    if (!userId) return false
    const user = await c.env.DB.prepare(
      'SELECT id FROM users WHERE id = ? AND is_active = 1'
    ).bind(userId).first()
    return !!user
  } catch {
    return false
  }
}

// === 비포애프터 목록 ===
app.get('/cases', async (c) => {
  const loggedIn = await isUserLoggedIn(c)
  const { results } = await c.env.DB.prepare(
    `SELECT id, title, category, description, pano_before, pano_after, intra_before, intra_after,
     patient_age_group, patient_gender, region_text, treatment_duration, views, created_at
     FROM cases WHERE is_published = 1 ORDER BY created_at DESC`
  ).all() as any
  // 비로그인: after 이미지 URL을 응답에서 제거 (HTML 소스/DevTools에서도 노출 방지)
  const safeResults = (results || []).map((r: any) => loggedIn ? r : ({
    ...r,
    pano_after: null,
    intra_after: null
  }))
  return c.render(casesPage(safeResults, loggedIn), {
    seo: {
      title: '비포애프터 | 이음치과 임플란트·라미네이트 치료 전후',
      description: '이음치과 실제 치료 비포애프터. 임플란트, 라미네이트·올세라믹 심미보철, 심미 레진, 턱관절(TMJ) 케이스별 치료 전후 사진을 확인하고 본인의 치료 결과를 미리 가늠해보세요.',
      keywords: '치과 비포애프터, 임플란트 전후사진, 심미보철 결과, 라미네이트 전후, 치아 성형 전후, 부산치과 치료사례',
      canonical: `${SITE_URL}/cases`,
      ogUrl: `${SITE_URL}/cases`,
      jsonLd: [
        medicalWebPageJsonLd({
          name: '비포애프터 치료 사례',
          description: '이음치과의원의 실제 치료 전후 사진 모음. 임플란트, 심미보철, 레진 수복 결과를 확인하세요.',
          url: '/cases', specialty: 'Dentistry'
        }),
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '비포애프터', url: '/cases' }])
      ]
    }
  })
})

// === 비포애프터 상세 (동적 SEO) ===
app.get('/cases/:id', async (c) => {
  const id = c.req.param('id')
  const loggedIn = await isUserLoggedIn(c)
  const caseData = await c.env.DB.prepare('SELECT * FROM cases WHERE id = ? AND is_published = 1').bind(id).first() as any
  // 비로그인 시 after 이미지 URL 제거 (HTML 소스 노출 방지)
  if (caseData && !loggedIn) {
    caseData.pano_after = null
    caseData.intra_after = null
  }

  // 존재하지 않는 case → 404
  if (!caseData) {
    c.status(404)
    return c.render(
      <div class="container py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-8">요청하신 비포애프터를 찾을 수 없습니다.</p>
        <a href="/cases" class="btn-primary">비포애프터 목록으로 이동</a>
      </div>,
      {
        seo: {
          title: '비포애프터를 찾을 수 없습니다 (404) | 이음치과의원',
          description: '요청하신 비포애프터 페이지를 찾을 수 없습니다.',
          canonical: `${SITE_URL}/cases`,
          noindex: true
        }
      }
    )
  }

  const doctor = caseData.doctor_id
    ? await c.env.DB.prepare('SELECT id, name, slug, title, photo, greeting FROM doctors WHERE id = ?').bind(caseData.doctor_id).first()
    : null
  const { results: dictTerms } = await c.env.DB.prepare(
    'SELECT term as name, slug FROM dict_terms WHERE is_published = 1 LIMIT 300'
  ).all() as any
  const title = caseData.title
  const desc = caseData.description?.substring(0, 160) || '이음치과의원의 치료 결과를 확인하세요.'
  const category = caseData.category || 'general'
  const categoryNames: Record<string, string> = {
    implant: '임플란트', aesthetic: '심미보철', resin: '심미레진',
    tmj: '턱관절', general: '일반진료'
  }

  return c.render(caseDetailPage(id, caseData, doctor, dictTerms || [], loggedIn), {
    seo: {
      title: `${title} | 이음치과 ${categoryNames[category] || ''} 비포애프터`,
      description: desc,
      keywords: `${categoryNames[category] || ''} 비포애프터, ${categoryNames[category] || ''} 전후사진, 치과 치료결과, 이음치과`,
      canonical: `${SITE_URL}/cases/${id}`,
      ogUrl: `${SITE_URL}/cases/${id}`,
      ogImage: loggedIn ? (caseData?.pano_after || caseData?.intra_after || undefined) : undefined,
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
app.get('/blogs', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, title, content, thumbnail, meta_title, meta_description, slug, author_name, views, created_at
     FROM blogs WHERE is_published = 1 ORDER BY created_at DESC`
  ).all() as any
  return c.render(blogsPage(results || []), {
    seo: {
      title: '치과 건강 블로그 | 이음치과 임플란트·심미보철·구강관리 정보',
      description: '이음치과 건강 블로그. 임플란트 수명, 심미보철 종류, 턱관절 통증, 충치 예방, 스케일링 주기 등 치과 전문 건강 정보를 최효영 대표원장이 직접 작성·감수합니다. 근거 기반 구강관리 가이드.',
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
  const idOrSlug = c.req.param('id')
  // id가 숫자면 id 검색, 아니면 slug 검색
  const isNumeric = /^\d+$/.test(idOrSlug)
  const blog = await (isNumeric
    ? c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(idOrSlug).first()
    : c.env.DB.prepare('SELECT * FROM blogs WHERE slug = ?').bind(idOrSlug).first()) as any

  // 존재하지 않는 블로그 글 → 404
  if (!blog) {
    c.status(404)
    return c.render(
      <div class="container py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-8">요청하신 블로그 글을 찾을 수 없습니다.</p>
        <a href="/blogs" class="btn-primary">블로그 목록으로 이동</a>
      </div>,
      {
        seo: {
          title: '블로그 글을 찾을 수 없습니다 (404) | 이음치과의원',
          description: '요청하신 블로그 페이지를 찾을 수 없습니다.',
          canonical: `${SITE_URL}/blogs`,
          noindex: true
        }
      }
    )
  }

  const { results: blogImages } = await c.env.DB.prepare('SELECT * FROM blog_images WHERE blog_id = ? ORDER BY sort_order').bind(blog.id).all() as any
  const { results: dictTerms } = await c.env.DB.prepare(
    'SELECT term as name, slug FROM dict_terms WHERE is_published = 1 LIMIT 300'
  ).all() as any
  const blogWithImages = { ...blog, images: blogImages || [] }
  const id = blog.id?.toString() || idOrSlug
  const title = blog.meta_title || blog.title
  const desc = blog.meta_description || blog.content?.substring(0, 160) || '이음치과의원 블로그'
  const slug = blog.slug || id

  return c.render(blogDetailPage(id, blogWithImages, dictTerms || []), {
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
          title, description: desc, slug,
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
app.get('/notices', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, title, content, thumbnail, is_pinned, views, created_at FROM notices
     WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC`
  ).all() as any
  return c.render(noticesPage(results || []), {
    seo: {
      title: '공지사항 | 이음치과 휴진·이벤트·진료 안내',
      description: '이음치과의원 최신 공지사항. 진료시간 변경, 휴진 일정, 공휴일 안내, 이벤트 및 프로모션, 병원 운영 정책 업데이트 등 환자분들께 꼭 필요한 소식을 실시간으로 전달드립니다.',
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

  // 존재하지 않는 공지 → 404
  if (!notice) {
    c.status(404)
    return c.render(
      <div class="container py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-8">요청하신 공지사항을 찾을 수 없습니다.</p>
        <a href="/notices" class="btn-primary">공지사항 목록으로 이동</a>
      </div>,
      {
        seo: {
          title: '공지사항을 찾을 수 없습니다 (404) | 이음치과의원',
          description: '요청하신 공지사항 페이지를 찾을 수 없습니다.',
          canonical: `${SITE_URL}/notices`,
          noindex: true
        }
      }
    )
  }

  const { results: noticeImages } = await c.env.DB.prepare('SELECT * FROM notice_images WHERE notice_id = ? ORDER BY sort_order').bind(id).all() as any
  const title = notice.title
  const desc = notice.content?.substring(0, 160) || '이음치과의원 공지사항'

  return c.render(noticeDetailPage(id, notice, noticeImages || []), {
    seo: {
      title: `${title} | 이음치과 공지사항`,
      description: desc,
      canonical: `${SITE_URL}/notices/${id}`,
      ogUrl: `${SITE_URL}/notices/${id}`,
      jsonLd: [
        {
          '@context': 'https://schema.org', '@type': 'Article',
          headline: title, description: desc,
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

// === FAQ ===
app.get('/faq', async (c) => {
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

  const grouped: Record<string, { name: string; faqs: typeof allFaqs }> = {}
  for (const faq of allFaqs) {
    if (!grouped[faq.category_slug]) {
      grouped[faq.category_slug] = { name: faq.category_name, faqs: [] }
    }
    grouped[faq.category_slug].faqs.push(faq)
  }

  const faqJsonLdData = faqPageJsonLd(allFaqs)

  return c.render(faqPage(grouped), {
    seo: {
      title: '자주 묻는 질문 FAQ | 이음치과 임플란트·비용·진료시간 답변',
      description: `이음치과의원 FAQ ${allFaqs.length}개 — 임플란트 비용, 시술 시간, 보험 적용, 턱관절 치료 등 자주 묻는 질문과 전문의 답변 총정리.`,
      keywords: '치과 FAQ, 임플란트 비용, 임플란트 시간, 치과 보험, 턱관절 치료, 부산치과 가격, 라미네이트 비용, 치과 주차, 야간진료치과, 이음치과 질문',
      canonical: `${SITE_URL}/faq`,
      ogUrl: `${SITE_URL}/faq`,
      speakable: ['.page-title', '.faq-q-text', '.faq-answer-inner'],
      jsonLd: [
        faqJsonLdData,
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '자주 묻는 질문', url: '/faq' }]),
        speakableJsonLd(`${SITE_URL}/faq`, ['.page-title', '.faq-group-title', '.faq-q-text'])
      ]
    }
  })
})

// === 치과 용어 백과사전 ===
app.get('/dictionary', async (c) => {
  const totalQ = await c.env.DB.prepare('SELECT COUNT(*) as total FROM dict_terms WHERE is_published = 1').first() as any
  const total = totalQ?.total || 219

  return c.render(dictionaryPage(), {
    seo: {
      title: `치과 용어 백과사전 (${total}개) | 이음치과 용어 사전`,
      description: `이음치과 치과 용어 ${total}개. 임플란트·보철·근관치료 등 전문 용어를 쉽게 설명합니다.`,
      keywords: '치과 용어, 치과 사전, 임플란트 용어, 치과 백과사전, 치과 상식, 치아 용어, 보철 용어, 근관치료, 이음치과, 부산치과',
      canonical: `${SITE_URL}/dictionary`,
      ogUrl: `${SITE_URL}/dictionary`,
      jsonLd: [
        {
          '@context': 'https://schema.org', '@type': 'DefinedTermSet',
          '@id': `${SITE_URL}/dictionary/#termset`,
          name: '이음치과 치과 용어 백과사전',
          description: `${total}개 치과 전문 용어를 알기 쉽게 정리한 백과사전입니다.`,
          url: `${SITE_URL}/dictionary`, inLanguage: 'ko-KR',
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
    `SELECT dt.*, dc.name as category_name FROM dict_terms dt JOIN dict_categories dc ON dt.category_id = dc.id WHERE dt.slug = ? AND dt.is_published = 1`
  ).bind(slug).first() as any

  // 존재하지 않는 용어 → 404
  if (!term) {
    c.status(404)
    return c.render(
      <div class="container py-20 text-center">
        <h1 class="text-4xl font-bold mb-4">404</h1>
        <p class="text-lg mb-8">요청하신 치과 용어를 찾을 수 없습니다.</p>
        <a href="/dictionary" class="btn-primary">용어 사전으로 이동</a>
      </div>,
      {
        seo: {
          title: '용어를 찾을 수 없습니다 (404) | 이음치과의원',
          description: '요청하신 치과 용어 페이지를 찾을 수 없습니다.',
          canonical: `${SITE_URL}/dictionary`,
          noindex: true
        }
      }
    )
  }

  const termName = term.term
  const termDesc = term.short_desc || '이음치과의원 치과 용어 백과사전'
  const termFull = term.full_desc || termDesc
  const termEn = term.english || ''
  const catName = term.category_name || ''

  return c.render(dictionaryDetailPage(slug), {
    seo: {
      title: `${termName} 뜻 | ${catName} 용어 — 이음치과 백과사전`,
      description: `${termName}${termEn ? ` (${termEn})` : ''} — ${termDesc.substring(0, 100)}. 이음치과 치과 용어 백과사전.`,
      keywords: `${termName}, ${termEn || ''}, ${catName}, 치과 용어, 치과 백과사전, 이음치과`,
      canonical: `${SITE_URL}/dictionary/${slug}`,
      ogUrl: `${SITE_URL}/dictionary/${slug}`,
      jsonLd: [
        {
          '@context': 'https://schema.org', '@type': 'DefinedTerm',
          name: termName, description: termFull,
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
      description: '이음치과의원 회원가입. 비포애프터 사진 열람, 예약 문의 등 회원 전용 서비스를 이용하세요.',
      canonical: `${SITE_URL}/signup`,
      ogUrl: `${SITE_URL}/signup`,
      noindex: true,
      jsonLd: [breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '회원가입', url: '/signup' }])]
    }
  })
})

app.get('/login', (c) => {
  return c.render(loginPage(), {
    seo: {
      title: '로그인 | 이음치과의원',
      description: '이음치과의원 로그인. 비포애프터 열람 등 회원 전용 서비스에 접속하세요.',
      canonical: `${SITE_URL}/login`,
      ogUrl: `${SITE_URL}/login`,
      noindex: true,
      jsonLd: [breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '로그인', url: '/login' }])]
    }
  })
})

// === 지역 SEO 랜딩 페이지 ===
app.get('/regions', (c) => {
  return c.render(seoRegionListPage(), {
    seo: {
      title: '지역별 치과 안내 | 이음치과의원',
      description: '부산 강서구·사하구 지역별 치과 안내. 명지국제신도시, 에코델타시티, 하단, 다대포 등 이음치과의원 진료 가능 지역과 대중교통·주차 정보, 지역 특화 진료 서비스를 확인하세요.',
      canonical: `${SITE_URL}/regions`,
      ogUrl: `${SITE_URL}/regions`,
      jsonLd: [
        breadcrumbJsonLd([{ name: '홈', url: '/' }, { name: '지역별 안내', url: '/regions' }])
      ]
    }
  })
})

app.get('/regions/:slug', async (c) => {
  const slug = c.req.param('slug')
  const region = await c.env.DB.prepare(
    'SELECT * FROM seo_regions WHERE slug = ? AND is_published = 1'
  ).bind(slug).first() as any

  const regionName = region?.region_name || '지역'
  const metaTitle = region?.meta_title || `${regionName} 치과 이음치과의원 | 임플란트·심미보철`
  const metaDesc = region?.meta_description || `${regionName} 근처 치과를 찾고 계신가요? 이음치과의원 임플란트·심미보철 전문, 일반진료까지 모두 가능. ☎ 051-206-5888`

  return c.render(seoRegionPage(slug, region?.h1_title || `${regionName} 치과 이음치과의원`), {
    seo: {
      title: metaTitle,
      description: metaDesc,
      keywords: `${regionName} 치과, ${regionName} 임플란트, ${regionName} 심미보철, 이음치과, 부산치과, 명지치과`,
      canonical: `${SITE_URL}/regions/${slug}`,
      ogUrl: `${SITE_URL}/regions/${slug}`,
      jsonLd: [
        localBusinessJsonLd(),
        breadcrumbJsonLd([
          { name: '홈', url: '/' },
          { name: '지역별 안내', url: '/regions' },
          { name: `${regionName} 치과`, url: `/regions/${slug}` }
        ])
      ]
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

# AI Crawlers (환영 — AEO 최적화)
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
User-agent: PerplexityBot
Allow: /
User-agent: Bytespider
Allow: /
User-agent: cohere-ai
Allow: /
User-agent: Meta-ExternalAgent
Allow: /
User-agent: Applebot-Extended
Allow: /
`)
})

app.get('/sitemap.xml', async (c) => {
  const now = new Date().toISOString().split('T')[0]

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
  const { results: treatments } = await c.env.DB.prepare(
    'SELECT slug, updated_at, name FROM treatments WHERE is_published = 1 ORDER BY sort_order'
  ).all() as any
  const { results: doctors } = await c.env.DB.prepare(
    'SELECT slug, updated_at, name FROM doctors WHERE is_published = 1 ORDER BY sort_order'
  ).all() as any
  const { results: seoRegions } = await c.env.DB.prepare(
    'SELECT slug, updated_at, region_name FROM seo_regions WHERE is_published = 1 ORDER BY region_name'
  ).all() as any

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- 정적 페이지 -->
  <url><loc>${SITE_URL}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${SITE_URL}/treatments</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/doctors</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/about</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${SITE_URL}/visit</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/faq</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${SITE_URL}/cases</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/blogs</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/dictionary</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${SITE_URL}/notices</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>
  <url><loc>${SITE_URL}/regions</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
`

  // 진료과목
  for (const t of (treatments || [])) {
    xml += `  <url><loc>${SITE_URL}/treatments/${t.slug}</loc><lastmod>${t.updated_at?.split(' ')[0] || now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`
  }

  // 의료진
  for (const d of (doctors || [])) {
    xml += `  <url><loc>${SITE_URL}/doctors/${d.slug}</loc><lastmod>${d.updated_at?.split(' ')[0] || now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`
  }

  // 블로그
  for (const b of (blogs || [])) {
    const date = b.updated_at?.split(' ')[0] || now
    const loc = `${SITE_URL}/blogs/${b.slug || b.id}`
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n`
    if (b.thumbnail) {
      xml += `    <image:image>\n      <image:loc>${b.thumbnail.startsWith('http') ? b.thumbnail : SITE_URL + b.thumbnail}</image:loc>\n      <image:title>${escXml(b.title || '블로그')}</image:title>\n    </image:image>\n`
    }
    xml += `  </url>\n`
  }

  for (const cs of (cases || [])) {
    const date = cs.updated_at?.split(' ')[0] || now
    xml += `  <url>\n    <loc>${SITE_URL}/cases/${cs.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n`
    if (cs.pano_after) {
      xml += `    <image:image>\n      <image:loc>${cs.pano_after.startsWith('http') ? cs.pano_after : SITE_URL + cs.pano_after}</image:loc>\n      <image:title>${escXml(cs.title || '비포애프터')}</image:title>\n    </image:image>\n`
    }
    xml += `  </url>\n`
  }

  for (const n of (notices || [])) {
    const date = n.updated_at?.split(' ')[0] || now
    xml += `  <url><loc>${SITE_URL}/notices/${n.id}</loc><lastmod>${date}</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`
  }

  // 지역 SEO 페이지
  for (const sr of (seoRegions || [])) {
    xml += `  <url><loc>${SITE_URL}/regions/${sr.slug}</loc><lastmod>${sr.updated_at?.split(' ')[0] || now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n`
  }

  for (const dt of (dictTerms || [])) {
    const date = dt.updated_at?.split(' ')[0] || now
    xml += `  <url><loc>${SITE_URL}/dictionary/${dt.slug}</loc><lastmod>${date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n`
  }

  xml += '</urlset>'

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=7200'
    }
  })
})

function escXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

// === 루트 경로 파비콘/매니페스트 (브라우저가 기본 요청하는 경로) ===
app.get('/favicon.ico', async (c) => {
  return c.redirect('/static/favicon.ico', 301)
})
app.get('/apple-touch-icon.png', async (c) => {
  return c.redirect('/static/apple-touch-icon.png', 301)
})
app.get('/apple-touch-icon-precomposed.png', async (c) => {
  return c.redirect('/static/apple-touch-icon.png', 301)
})
app.get('/manifest.json', async (c) => {
  return c.redirect('/static/manifest.json', 301)
})

// === 전역 에러 핸들러 (디버깅 + 사용자 친화적 500 페이지) ===
app.onError((err, c) => {
  console.error('[APP ERROR]', c.req.path, err?.stack || err)
  // API는 JSON
  if (c.req.path.startsWith('/api/') || c.req.path.startsWith('/r2/')) {
    return c.json({ error: 'Internal Server Error', path: c.req.path, message: err?.message }, 500)
  }
  c.status(500)
  return c.render(
    <div class="page-404">
      <section class="error-section">
        <div class="container-wide">
          <div class="error-inner">
            <span class="error-code">500</span>
            <h1 class="error-title">일시적인 오류가 발생했습니다</h1>
            <p class="error-desc">
              요청을 처리하는 중 예상치 못한 문제가 발생했습니다.<br/>
              잠시 후 다시 시도하시거나 아래 링크에서 다른 페이지를 방문해 주세요.
            </p>
            <div class="error-actions">
              <a href="/" class="btn-primary" data-hover>홈으로</a>
              <a href="javascript:history.back()" class="btn-secondary" data-hover>이전 페이지</a>
            </div>
            <div class="error-contact">
              <p>계속 문제가 발생한다면 전화로 문의해 주세요.</p>
              <a href="tel:0515555555" class="error-tel" data-hover>📞 051-555-5555</a>
            </div>
          </div>
        </div>
      </section>
    </div>,
    { seo: { title: '오류 | 이음치과의원', description: '일시적 오류', canonical: `${SITE_URL}${c.req.path}`, noindex: true } }
  )
})

// === 404 Not Found 페이지 (브랜드 디자인) ===
app.notFound(async (c) => {
  const path = c.req.path
  // API는 JSON 404
  if (path.startsWith('/api/') || path.startsWith('/r2/')) {
    return c.json({ error: 'Not Found', path }, 404)
  }
  c.status(404)
  // 페이지는 디자인된 404
  return c.render(
    <div class="page-404">
      <section class="error-section">
        <div class="container-wide">
          <div class="error-inner">
            <span class="error-code">404</span>
            <h1 class="error-title">페이지를 찾을 수 없습니다</h1>
            <p class="error-desc">
              요청하신 주소의 페이지가 존재하지 않거나, 삭제 또는 이동되었을 수 있습니다.<br/>
              아래 링크에서 원하시는 정보를 찾아보세요.
            </p>
            <div class="error-actions">
              <a href="/" class="btn-primary" data-hover>홈으로 돌아가기</a>
              <a href="/treatments" class="btn-secondary" data-hover>진료 안내</a>
              <a href="/visit" class="btn-secondary" data-hover>오시는 길</a>
            </div>
            <div class="error-quicklinks">
              <h2 class="quicklinks-heading">추천 페이지</h2>
              <div class="quicklinks-grid">
                <a href="/cases" data-hover>비포애프터 →</a>
                <a href="/blogs" data-hover>블로그 →</a>
                <a href="/doctors" data-hover>의료진 소개 →</a>
                <a href="/faq" data-hover>자주 묻는 질문 →</a>
                <a href="/dictionary" data-hover>치과 용어 사전 →</a>
                <a href="/notices" data-hover>공지사항 →</a>
              </div>
            </div>
            <div class="error-contact">
              <p>더 궁금하신 점은 전화로 문의해 주세요.</p>
              <a href="tel:0515555555" class="error-tel" data-hover>📞 051-555-5555</a>
            </div>
          </div>
        </div>
      </section>
    </div>,
    {
      seo: {
        title: '페이지를 찾을 수 없습니다 (404) | 이음치과의원',
        description: '요청하신 페이지를 찾을 수 없습니다. 이음치과의원 메인 페이지에서 원하시는 정보를 찾아보세요.',
        canonical: `${SITE_URL}${path}`,
        noindex: true
      }
    }
  )
})

export default app
