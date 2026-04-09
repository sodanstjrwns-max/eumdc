// =============================================
// SEO/AEO 통합 유틸리티
// 구조화 데이터(JSON-LD), 메타태그, OpenGraph, Twitter Card,
// Naver 웹마스터, Speakable, HowTo, 리뷰, Service 스키마
// =============================================

export const SITE_URL = 'https://eum-dental.pages.dev'
export const SITE_NAME = '이음치과의원'
export const SITE_NAME_EN = 'Eum Dental Clinic'
const DEFAULT_IMAGE = `${SITE_URL}/static/img/photo_1.jpg`
const LOGO_URL = `${SITE_URL}/static/favicon.svg`
const PHONE = '+82-51-206-5888'
const PHONE_DISPLAY = '051-206-5888'
const EMAIL = 'hyogunim@gmail.com'
const ADDRESS_FULL = '부산광역시 강서구 명지국제8로 265 2층'
const NAVER_MAP_URL = 'https://map.naver.com/p/search/%EC%9D%B4%EC%9D%8C%EC%B9%98%EA%B3%BC%EC%9D%98%EC%9B%90'

// ─── SeoMeta 인터페이스 ───
export interface SeoMeta {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogType?: string        // website | article | profile
  ogImage?: string
  ogUrl?: string
  ogArticle?: {          // article 타입일 때 추가 메타
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  noindex?: boolean
  jsonLd?: object | object[]
  // AEO 전용
  speakable?: string[]   // CSS 선택자 배열 (구글 스피커블)
}

/** 기본 SEO 메타 */
export const defaultSeo: SeoMeta = {
  title: '이음치과의원 | 부산 명지 임플란트·심미보철·턱관절 전문',
  description: '부산 강서구 명지 이음치과의원 - 실력으로 신뢰를, 신뢰로 마음까지 잇습니다. 임플란트, 심미보철, 심미레진, 턱관절(TMJ) 전문 진료. 월-목 야간진료 21시, 토·일 진료. 051-206-5888',
  keywords: '이음치과, 부산치과, 명지치과, 임플란트, 심미보철, 라미네이트, 턱관절, 최효영, 강서구치과, 명지국제신도시치과, 야간진료, 주말진료',
  ogType: 'website',
  ogImage: DEFAULT_IMAGE,
}

// ═══════════════════════════════════════════
// 1. 핵심 Entity 스키마 (Google Knowledge Graph)
// ═══════════════════════════════════════════

/** Organization + Dentist + MedicalOrganization 복합 (메인 엔티티) */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Dentist', 'MedicalOrganization', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    description: '부산 명지 이음치과의원 - 임플란트, 심미보철, 턱관절 전문. 투명한 진료, 확실한 결과.',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 512,
      height: 512
    },
    image: [
      DEFAULT_IMAGE,
      `${SITE_URL}/static/img/photo_7.jpg`,
      `${SITE_URL}/static/img/photo_8.jpg`
    ],
    telephone: PHONE,
    email: EMAIL,
    priceRange: '$$',
    currenciesAccepted: 'KRW',
    paymentAccepted: '카드, 현금, 무이자 할부',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '명지국제8로 265 2층',
      addressLocality: '부산광역시',
      addressRegion: '강서구',
      postalCode: '46726',
      addressCountry: 'KR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 35.0944,
      longitude: 128.9347
    },
    hasMap: NAVER_MAP_URL,
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '12:00', closes: '21:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday', 'Sunday'], opens: '10:00', closes: '17:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '00:00', closes: '00:00', description: '정기휴무' }
    ],
    // 대표원장 (Person)
    founder: personJsonLd(),
    employee: [personJsonLd()],
    // 진료 과목
    medicalSpecialty: [
      'Implantology', 'Prosthodontics', 'TemporomandibularJointDisorder',
      'CosmeticDentistry', 'GeneralDentistry', 'PediatricDentistry'
    ],
    // 제공 서비스
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '이음치과 진료 안내',
      itemListElement: [
        serviceOffer('임플란트', '디지털 가이드 기반 정밀 임플란트. CBCT와 구강스캐너 3D 진단. 원내 가이드 직접 제작.'),
        serviceOffer('심미보철', '라미네이트, 올세라믹, 지르코니아 크라운. 자연치아와 구별 불가한 정밀 보철.'),
        serviceOffer('심미레진', '자연치아 색상에 맞춘 레진 수복. 최소 삭제, 당일 완료.'),
        serviceOffer('턱관절 치료', '턱관절 통증, 이갈이, 스플린트. 체계적 치료 프로토콜.'),
        serviceOffer('일반진료', '충치, 신경치료, 사랑니 발치, 잇몸치료, 스케일링.')
      ]
    },
    availableService: [
      medicalService('임플란트', '디지털 가이드 기반 정밀 임플란트'),
      medicalService('심미보철', '라미네이트, 올세라믹, 지르코니아 크라운'),
      medicalService('심미레진', '자연치아색 레진 충전 및 수복'),
      medicalService('턱관절 치료', '턱관절 통증, 이갈이, 스플린트'),
      medicalService('일반진료', '충치, 신경치료, 사랑니, 스케일링')
    ],
    // 리뷰 통합 (AEO - AI가 "평판" 참고)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '387',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: [
      NAVER_MAP_URL,
      'https://www.instagram.com/eum.dental/'
    ],
    // 접근성
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: '무료 주차 (2시간)', value: true },
      { '@type': 'LocationFeatureSpecification', name: '야간 진료', value: true },
      { '@type': 'LocationFeatureSpecification', name: '주말 진료', value: true },
      { '@type': 'LocationFeatureSpecification', name: '엘리베이터', value: true }
    ],
    // 키워드 (내부 분류용)
    keywords: '이음치과, 부산임플란트, 명지치과, 부산심미보철, 부산턱관절, 강서구치과, 야간진료치과, 주말진료치과'
  }
}

/** Person 스키마 (대표원장) */
export function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': `${SITE_URL}/#director`,
    name: '최효영',
    jobTitle: '대표원장',
    description: '이음치과의원 대표원장. 강원대학교 치과대학 졸업. 임플란트, 심미보철, 턱관절 전문.',
    image: `${SITE_URL}/static/img/photo_5.jpg`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: '강원대학교 치과대학' },
    worksFor: { '@type': 'Dentist', name: SITE_NAME, '@id': `${SITE_URL}/#organization` },
    memberOf: [
      { '@type': 'Organization', name: '대한구강악면임플란트학회' },
      { '@type': 'Organization', name: '대한치과보철학회' },
      { '@type': 'Organization', name: '대한치과보존학회' }
    ],
    knowsAbout: ['임플란트', '심미보철', '턱관절치료', '디지털치과']
  }
}

function serviceOffer(name: string, desc: string) {
  return {
    '@type': 'Offer',
    itemOffered: {
      '@type': 'MedicalProcedure',
      name,
      description: desc,
      howPerformed: '전문 치과의사가 최첨단 디지털 장비를 이용하여 시술합니다.',
      bodyLocation: '구강'
    }
  }
}

function medicalService(name: string, desc: string) {
  return {
    '@type': 'MedicalProcedure',
    name,
    description: desc,
    procedureType: 'http://schema.org/NoninvasiveProcedure'
  }
}

// ═══════════════════════════════════════════
// 2. WebSite + SearchAction (사이트 검색)
// ═══════════════════════════════════════════

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/faq?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

// ═══════════════════════════════════════════
// 3. BreadcrumbList
// ═══════════════════════════════════════════

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    }))
  }
}

// ═══════════════════════════════════════════
// 4. FAQPage (AEO 핵심! — AI 검색 엔진 직접 파싱)
// ═══════════════════════════════════════════

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq/#faqpage`,
    name: '이음치과의원 자주 묻는 질문 (FAQ)',
    description: `이음치과의원에서 환자분들이 가장 많이 궁금해하시는 질문 ${faqs.length}개와 답변을 정리했습니다.`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    })),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ko-KR'
  }
}

/** 카테고리별 분할 FAQ JSON-LD (AEO 강화 - 개별 카테고리 인식) */
export function faqCategoryJsonLd(categoryName: string, faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: `${categoryName} FAQ - ${SITE_NAME}`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  }
}

// ═══════════════════════════════════════════
// 5. BlogPosting (블로그 상세)
// ═══════════════════════════════════════════

export function blogPostingJsonLd(blog: {
  title: string; description: string; slug?: string;
  content?: string; thumbnail?: string; created_at: string;
  updated_at?: string; author?: string; tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: blog.thumbnail
      ? (blog.thumbnail.startsWith('http') ? blog.thumbnail : `${SITE_URL}${blog.thumbnail}`)
      : DEFAULT_IMAGE,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    wordCount: blog.content ? blog.content.length : undefined,
    author: {
      '@type': 'Person',
      name: blog.author || '최효영',
      url: `${SITE_URL}/#director`
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blogs/${blog.slug || ''}`
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'ko-KR',
    keywords: blog.tags?.join(', ') || '치과, 이음치과, 부산치과'
  }
}

// ═══════════════════════════════════════════
// 6. Blog 목록 (CollectionPage)
// ═══════════════════════════════════════════

export function blogListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '이음치과 블로그',
    description: '이음치과의원의 전문 치과 건강 정보, 치료 사례, 구강 관리 팁.',
    url: `${SITE_URL}/blogs`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ko-KR'
  }
}

// ═══════════════════════════════════════════
// 7. MedicalWebPage (의료 콘텐츠)
// ═══════════════════════════════════════════

export function medicalWebPageJsonLd(page: {
  name: string; description: string; url: string; specialty?: string;
  image?: string; lastReviewed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: page.name,
    description: page.description,
    url: `${SITE_URL}${page.url}`,
    specialty: page.specialty || undefined,
    image: page.image ? (page.image.startsWith('http') ? page.image : `${SITE_URL}${page.image}`) : DEFAULT_IMAGE,
    lastReviewed: page.lastReviewed || new Date().toISOString().split('T')[0],
    reviewedBy: { '@id': `${SITE_URL}/#director` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'ko-KR'
  }
}

// ═══════════════════════════════════════════
// 8. 비포애프터 케이스 상세 스키마
// ═══════════════════════════════════════════

const categoryKrMap: Record<string, string> = {
  implant: '임플란트', aesthetic: '심미보철', resin: '심미레진',
  tmj: '턱관절', general: '일반진료'
}

export function caseDetailJsonLd(caseData: {
  id: number; title: string; category: string; description?: string;
  pano_before?: string; pano_after?: string;
  intra_before?: string; intra_after?: string;
  treatment_date?: string; created_at?: string;
}) {
  const images = [caseData.pano_before, caseData.pano_after, caseData.intra_before, caseData.intra_after]
    .filter(Boolean)
    .map(img => img!.startsWith('http') ? img! : `${SITE_URL}${img}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: caseData.title,
    description: caseData.description || `${categoryKrMap[caseData.category] || caseData.category} 치료 비포애프터 사례`,
    url: `${SITE_URL}/cases/${caseData.id}`,
    specialty: categoryKrMap[caseData.category] || caseData.category,
    image: images.length > 0 ? images : DEFAULT_IMAGE,
    datePublished: caseData.created_at || new Date().toISOString(),
    lastReviewed: caseData.treatment_date || caseData.created_at || new Date().toISOString().split('T')[0],
    reviewedBy: { '@id': `${SITE_URL}/#director` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: {
      '@type': 'MedicalProcedure',
      name: categoryKrMap[caseData.category] || caseData.category,
      bodyLocation: '구강'
    },
    inLanguage: 'ko-KR'
  }
}

// ═══════════════════════════════════════════
// 9. HowTo 스키마 (AEO 강화 - "~하는 방법" 검색)
// ═══════════════════════════════════════════

export function howToJsonLd(data: {
  name: string; description: string;
  totalTime?: string; // ISO 8601 (PT30M)
  steps: { name: string; text: string; image?: string }[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    totalTime: data.totalTime,
    step: data.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      image: s.image ? (s.image.startsWith('http') ? s.image : `${SITE_URL}${s.image}`) : undefined
    }))
  }
}

/** 이음치과 내원 프로세스 HowTo (메인 페이지용) */
export function visitHowToJsonLd() {
  return howToJsonLd({
    name: '이음치과의원 내원 및 진료 과정',
    description: '이음치과의원에서 첫 내원부터 치료 완료까지의 진료 과정을 안내합니다.',
    totalTime: 'PT60M',
    steps: [
      { name: '전화 예약', text: '051-206-5888로 전화하여 원하시는 날짜와 시간에 예약합니다. 카카오톡 예약도 가능합니다.' },
      { name: '내원 및 접수', text: '부산 강서구 명지국제8로 265 2층에 내원하여 접수합니다. 주차 2시간 무료입니다.' },
      { name: '정밀 검진', text: 'CBCT 3D 영상, 구강 스캐너 등 디지털 장비로 정밀 검진을 진행합니다.' },
      { name: '상담 및 치료 계획', text: '검진 결과를 영상으로 직접 보여드리며 충분히 설명합니다. 치료 계획과 비용을 투명하게 안내합니다.' },
      { name: '치료 진행', text: '동의하신 치료 계획에 따라 최소 침습, 최대 보존 원칙으로 진료를 진행합니다.' },
      { name: '사후 관리', text: '치료 후 주의사항을 안내하고, 정기 검진 일정을 잡아 체계적으로 관리합니다.' }
    ]
  })
}

// ═══════════════════════════════════════════
// 10. Speakable 스키마 (AEO — 음성 검색 최적화)
// ═══════════════════════════════════════════

export function speakableJsonLd(url: string, selectors: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selectors
    }
  }
}

// ═══════════════════════════════════════════
// 11. 메타 태그 HTML 생성
// ═══════════════════════════════════════════

export function renderSeoHead(meta: SeoMeta): string {
  const m = { ...defaultSeo, ...meta }
  const jsonLdArray = Array.isArray(m.jsonLd) ? m.jsonLd : m.jsonLd ? [m.jsonLd] : []

  // OG 이미지 절대 URL 처리
  const ogImage = m.ogImage
    ? (m.ogImage.startsWith('http') ? m.ogImage : `${SITE_URL}${m.ogImage}`)
    : DEFAULT_IMAGE

  let html = ''

  // --- 기본 메타 ---
  html += `<title>${esc(m.title)}</title>\n`
  html += `<meta name="description" content="${esc(m.description)}" />\n`
  if (m.keywords) html += `<meta name="keywords" content="${esc(m.keywords)}" />\n`
  if (m.canonical) html += `<link rel="canonical" href="${m.canonical}" />\n`

  // Robots
  if (m.noindex) {
    html += '<meta name="robots" content="noindex, nofollow" />\n'
  } else {
    html += '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />\n'
  }

  // --- Open Graph ---
  html += `<meta property="og:site_name" content="${SITE_NAME}" />\n`
  html += `<meta property="og:type" content="${m.ogType || 'website'}" />\n`
  html += `<meta property="og:title" content="${esc(m.title)}" />\n`
  html += `<meta property="og:description" content="${esc(m.description)}" />\n`
  html += `<meta property="og:image" content="${ogImage}" />\n`
  html += `<meta property="og:image:width" content="1200" />\n`
  html += `<meta property="og:image:height" content="630" />\n`
  if (m.ogUrl) html += `<meta property="og:url" content="${m.ogUrl}" />\n`
  html += `<meta property="og:locale" content="ko_KR" />\n`

  // article 추가 메타
  if (m.ogType === 'article' && m.ogArticle) {
    if (m.ogArticle.publishedTime) html += `<meta property="article:published_time" content="${m.ogArticle.publishedTime}" />\n`
    if (m.ogArticle.modifiedTime) html += `<meta property="article:modified_time" content="${m.ogArticle.modifiedTime}" />\n`
    if (m.ogArticle.author) html += `<meta property="article:author" content="${esc(m.ogArticle.author)}" />\n`
    if (m.ogArticle.section) html += `<meta property="article:section" content="${esc(m.ogArticle.section)}" />\n`
    if (m.ogArticle.tags) {
      m.ogArticle.tags.forEach(tag => {
        html += `<meta property="article:tag" content="${esc(tag)}" />\n`
      })
    }
  }

  // --- Twitter Card ---
  html += `<meta name="twitter:card" content="summary_large_image" />\n`
  html += `<meta name="twitter:title" content="${esc(m.title)}" />\n`
  html += `<meta name="twitter:description" content="${esc(m.description)}" />\n`
  html += `<meta name="twitter:image" content="${ogImage}" />\n`

  // --- 한국 검색엔진 최적화 ---
  html += `<meta name="naver-site-verification" content="" />\n`
  html += `<meta http-equiv="Content-Language" content="ko" />\n`
  html += `<meta name="geo.region" content="KR-26" />\n`
  html += `<meta name="geo.placename" content="부산광역시 강서구" />\n`
  html += `<meta name="geo.position" content="35.0944;128.9347" />\n`
  html += `<meta name="ICBM" content="35.0944, 128.9347" />\n`

  // --- 모바일 앱 배너 (선택) ---
  html += `<meta name="mobile-web-app-capable" content="yes" />\n`
  html += `<meta name="apple-mobile-web-app-title" content="${SITE_NAME}" />\n`

  // --- JSON-LD ---
  jsonLdArray.forEach(ld => {
    html += `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n`
  })

  return html
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
