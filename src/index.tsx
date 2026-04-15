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
app.use('/api/admin/doctors', requireAdmin())
app.use('/api/admin/doctors/*', requireAdmin())

// === API routes ===
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
      title: '이음치과의원 | 부산 명지 임플란트·심미보철·턱관절 전문',
      description: '부산 강서구 명지 이음치과의원. 임플란트·심미보철·턱관절(TMJ) 전문. 월-목 야간 21시, 토·일 진료. ☎ 051-206-5888. 주차 2시간 무료.',
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
          { question: '이음치과 대표원장은 누구인가요?', answer: '최효영 대표원장입니다. 강원대학교 치과대학 졸업, 대한구강악면임플란트학회·대한치과보철학회·대한치과보존학회 정회원으로 활동 중이며, 임플란트·심미보철·턱관절 전문입니다.' },
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
      title: '진료 안내 | 이음치과 임플란트·심미보철·턱관절',
      description: '이음치과의원 진료과목 안내. 임플란트, 심미보철, 턱관절, 심미레진, 충치·신경치료, 잇몸치료, 소아치과 등 전문 진료를 제공합니다.',
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
app.get('/treatments/:slug', async (c) => {
  const slug = c.req.param('slug')
  const treatment = await c.env.DB.prepare(
    'SELECT * FROM treatments WHERE slug = ? AND is_published = 1'
  ).bind(slug).first() as any

  const name = treatment?.name || '진료 안내'
  const desc = treatment?.meta_description || treatment?.short_desc || `이음치과의원 ${name} 전문 진료 안내.`
  const metaTitle = treatment?.meta_title || `${name} | 이음치과 전문 진료`

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

  return c.render(treatmentDetailPage(slug), {
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
app.get('/doctors', (c) => {
  return c.render(doctorsPage(), {
    seo: {
      title: '의료진 소개 | 이음치과의원 전문 치과의사',
      description: '이음치과의원 의료진 소개. 임플란트·심미보철·턱관절 전문 의료진이 정성을 다해 진료합니다.',
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

  const name = doctor?.name || '의료진'
  const title = doctor?.title || '원장'

  return c.render(doctorDetailPage(slug), {
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
      title: '병원 소개 | 이음치과의원 미션과 가치',
      description: '이음치과의원의 미션, 핵심 가치, 최첨단 디지털 장비, 병원 시설을 소개합니다. 투명성, 실력, 신뢰, 공감의 가치로 진료합니다.',
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
      title: '내원 안내 | 이음치과 오시는 길·진료시간·수가',
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

// === 비포애프터 목록 ===
app.get('/cases', (c) => {
  return c.render(casesPage(), {
    seo: {
      title: '비포애프터 | 이음치과 실제 치료 전후 사진',
      description: '이음치과의원의 임플란트·심미보철·레진·턱관절 치료 비포애프터 사진. 파노라마·구내 사진으로 치료 결과를 확인하세요.',
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
      title: '치과 건강 블로그 | 이음치과의원 구강관리 정보',
      description: '이음치과의원 블로그. 임플란트·심미보철·충치예방·잇몸관리 전문 건강 정보. 최효영 원장이 직접 작성하는 치과 가이드.',
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
app.get('/notices', (c) => {
  return c.render(noticesPage(), {
    seo: {
      title: '공지사항 | 이음치과의원 진료 안내·휴진·이벤트',
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
      title: '자주 묻는 질문 (FAQ) | 이음치과 임플란트·보험·비용',
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
      description: `이음치과 치과 용어 백과사전. ${total}개 전문 용어를 쉽게 설명합니다. 임플란트·보철·근관치료·잇몸·턱관절 카테고리별 정리.`,
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
    `SELECT dt.*, dc.name as category_name FROM dict_terms dt JOIN dict_categories dc ON dt.category_id = dc.id WHERE dt.slug = ?`
  ).bind(slug).first() as any

  const termName = term?.term || '치과 용어'
  const termDesc = term?.short_desc || '이음치과의원 치과 용어 백과사전'
  const termFull = term?.full_desc || termDesc
  const termEn = term?.english || ''
  const catName = term?.category_name || ''

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
      description: '이음치과의원 지역별 치과 안내. 부산 강서구 명지 일대 지역 맞춤 치과 진료 정보를 확인하세요.',
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
  const metaDesc = region?.meta_description || `${regionName} 근처 치과를 찾고 계신가요? 이음치과의원 임플란트·심미보철·턱관절 전문. ☎ 051-206-5888`

  return c.render(seoRegionPage(slug), {
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

export default app
