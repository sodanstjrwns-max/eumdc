// =============================================
// SEO/AEO 통합 유틸리티
// 구조화 데이터(JSON-LD), 메타태그, OpenGraph, Twitter Card,
// Naver 웹마스터, Speakable, HowTo, 리뷰, Service 스키마
// =============================================

export const SITE_URL = 'https://ieumdc.kr'
export const SITE_NAME = '이음치과의원'
export const SITE_NAME_EN = 'Eum Dental Clinic'
const DEFAULT_IMAGE = `${SITE_URL}/static/og-image.jpg`
const LOGO_URL = `${SITE_URL}/static/favicon.svg`
const PHONE = '+82-51-206-5888'
const PHONE_DISPLAY = '051-206-5888'
const EMAIL = 'hyogunim@gmail.com'
const ADDRESS_FULL = '부산광역시 강서구 명지국제8로 265, 201호 (명지동)'
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
  title: '이음치과의원 | 부산 명지 임플란트·심미보철 전문',
  description: '부산 강서구 명지 이음치과의원. 임플란트·심미보철 전문. 충치·신경치료·잇몸치료·턱관절·소아 등 일반진료까지. 월-목 야간 21시, 토·일 진료. ☎ 051-206-5888',
  keywords: '이음치과, 부산치과, 명지치과, 임플란트, 심미보철, 라미네이트, 최효영, 강서구치과, 명지국제신도시치과, 야간진료, 주말진료, 턱관절, 일반진료',
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
    description: '부산 명지 이음치과의원 - 임플란트, 심미보철 전문. 충치·잇몸·턱관절 등 일반진료까지. 투명한 진료, 확실한 결과.',
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
      streetAddress: '명지국제8로 265, 201호',
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
      // 금요일 정기휴무: Google 공식 가이드에 따라 opens=closes=00:00으로 명시
      // (누락 시 "정보 없음"으로 오인될 수 있음)
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '00:00', closes: '00:00' },
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
        serviceOffer('일반진료', '충치, 신경치료, 사랑니 발치, 잇몸치료, 스케일링.'),
        serviceOffer('턱관절 치료', '턱관절 통증, 이갈이, 스플린트. 체계적 치료 프로토콜.')
      ]
    },
    availableService: [
      medicalService('임플란트', '디지털 가이드 기반 정밀 임플란트'),
      medicalService('심미보철', '라미네이트, 올세라믹, 지르코니아 크라운'),
      medicalService('심미레진', '자연치아색 레진 충전 및 수복'),
      medicalService('일반진료', '충치, 신경치료, 사랑니, 스케일링'),
      medicalService('턱관절 치료', '턱관절 통증, 이갈이, 스플린트')
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
      'https://www.instagram.com/ieumdental/'
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
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#director`,
    name: '최효영',
    jobTitle: '대표원장',
    description: '이음치과의원 대표원장. 강원대학교 치과대학 치의학과 졸업(2021). 임플란트, 심미보철 전문.',
    image: `${SITE_URL}/static/img/photo_5.jpg`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: '강원대학교 치과대학' },
    worksFor: { '@type': 'Dentist', name: SITE_NAME, '@id': `${SITE_URL}/#organization` },
    knowsAbout: ['임플란트', '심미보철', '턱관절치료', '디지털치과', '보존치료'],
    // 저서 — E-E-A-T (Expertise & Authoritativeness) 강화
    hasOccupation: {
      '@type': 'Occupation',
      name: '치과의사',
      occupationalCategory: 'Dentist'
    },
    workExample: {
      '@type': 'Book',
      name: '치과가 두렵지 않으면 좋겠습니다',
      alternateName: '설명으로 안심하고, 실력으로 다시 찾는 치과의 기록',
      author: { '@type': 'Person', name: '최효영' },
      publisher: { '@type': 'Organization', name: SITE_NAME },
      inLanguage: 'ko',
      image: `${SITE_URL}/static/book-cover.jpg`,
      abstract: '진료실에서 매일 듣는 환자들의 질문과 불안에서 시작된 책. 칫솔 선택부터 임플란트 후 관리까지 치과에서 마주치는 주제를 쉽고 솔직하게 풀어낸 환자 교육용 소량 제작본입니다.',
      bookFormat: 'Paperback'
    }
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

/** 블로그 본문(마크다운/HTML)에서 첫 이미지 URL 추출 */
export function extractFirstImageFromContent(content?: string): string | null {
  if (!content) return null
  // 마크다운: ![alt](url) — Genspark blob/일반 URL 모두 매칭
  const md = content.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/)
  if (md && md[1]) return md[1]
  // HTML: <img src="...">
  const html = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+|\/[^"']+)["']/i)
  if (html && html[1]) return html[1]
  return null
}

/** 블로그 본문에서 FAQ 섹션의 Q/A 자동 추출 (## FAQ 또는 ### FAQ 섹션 + **Q. ...** 패턴) */
export function extractFaqsFromBlogContent(content?: string): { question: string; answer: string }[] {
  if (!content) return []
  // ## FAQ 섹션 시작점 찾기 (## 또는 ### FAQ / 자주 묻는 질문)
  const faqSectionMatch = content.match(/(?:^|\n)#{1,4}\s*(?:FAQ|자주\s*묻는\s*질문)[^\n]*\n([\s\S]*?)(?:\n#{1,4}\s|$)/i)
  if (!faqSectionMatch) return []
  const section = faqSectionMatch[1]
  const faqs: { question: string; answer: string }[] = []
  // **Q. 질문** 패턴 또는 Q. 질문 패턴 → 다음 Q. 또는 *** 또는 끝까지가 답변
  // 패턴: **Q. 텍스트?** \n 답변 \n*** \n**Q. ...
  const qaPattern = /(?:^|\n)\s*(?:\*\*)?Q[\.\:\s]+([^\n*]+?)(?:\*\*)?\s*\n+([\s\S]+?)(?=\n\s*(?:\*\*)?Q[\.\:]|\n\s*\*\*\*|\n#{1,4}\s|$)/g
  let m
  while ((m = qaPattern.exec(section)) !== null) {
    const q = m[1].replace(/[\*]+/g, '').trim().replace(/\?+$/, '?')
    const aRaw = m[2].replace(/^\*\*\*\s*$/gm, '').trim()
    // 답변에서 마크다운 링크/볼드 제거 (텍스트만)
    const a = aRaw
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, ' ')
      .trim()
      .substring(0, 500)
    if (q && a && q.length > 2 && a.length > 5) {
      faqs.push({ question: q, answer: a })
    }
  }
  return faqs
}

export function blogPostingJsonLd(blog: {
  title: string; description: string; slug?: string;
  content?: string; thumbnail?: string; created_at: string;
  updated_at?: string; author?: string; tags?: string[];
}) {
  // 썸네일 없으면 본문 첫 이미지를 폴백으로 사용
  const fallbackImage = extractFirstImageFromContent(blog.content)
  const imageSrc = blog.thumbnail || fallbackImage || ''
  const finalImage = imageSrc
    ? (imageSrc.startsWith('http') ? imageSrc : `${SITE_URL}${imageSrc}`)
    : DEFAULT_IMAGE
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description,
    image: finalImage,
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
      { name: '내원 및 접수', text: '부산 강서구 명지국제8로 265, 201호 (명지동)에 내원하여 접수합니다. 주차 2시간 무료입니다.' },
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

  // --- 검색엔진 사이트 소유권 인증 ---
  html += `<meta name="google-site-verification" content="sz8apFFBP5tqry8ZqPd6drUjkyr3tipqvqu0VTNA1rg" />\n`
  html += `<meta name="naver-site-verification" content="82a495e634029728f579425712aba45b6359087e" />\n`

  // --- 한국 검색엔진 최적화 ---
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

// ═══════════════════════════════════════════
// 12. 진료과목 상세 스키마
// ═══════════════════════════════════════════

export function treatmentJsonLd(treatment: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: treatment.name,
    description: treatment.meta_description || treatment.short_desc || `이음치과의원 ${treatment.name} 전문 진료`,
    url: `${SITE_URL}/treatments/${treatment.slug}`,
    specialty: treatment.name,
    image: treatment.hero_image ? (treatment.hero_image.startsWith('http') ? treatment.hero_image : `${SITE_URL}${treatment.hero_image}`) : DEFAULT_IMAGE,
    lastReviewed: treatment.updated_at || new Date().toISOString().split('T')[0],
    reviewedBy: { '@id': `${SITE_URL}/#director` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: {
      '@type': 'MedicalProcedure',
      name: treatment.name,
      description: treatment.short_desc || '',
      bodyLocation: '구강',
      ...(treatment.duration ? { estimatedTime: treatment.duration } : {})
    },
    mainContentOfPage: {
      '@type': 'WebPageElement',
      cssSelector: '.treat-detail-hero, .treat-section'
    },
    inLanguage: 'ko-KR'
  }
}

// ═══════════════════════════════════════════
// 13. 의료진 상세 스키마
// ═══════════════════════════════════════════

export function doctorJsonLd(doctor: any) {
  const specs = typeof doctor.specialties === 'string'
    ? (() => { try { return JSON.parse(doctor.specialties) } catch { return [] } })()
    : doctor.specialties || []

  const edu = typeof doctor.education === 'string'
    ? (() => { try { return JSON.parse(doctor.education) } catch { return [] } })()
    : doctor.education || []

  const membershipsArr = typeof doctor.memberships === 'string'
    ? (() => { try { return JSON.parse(doctor.memberships) } catch { return [] } })()
    : doctor.memberships || []

  return {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Physician'],
    '@id': `${SITE_URL}/doctors/${doctor.slug}/#person`,
    name: doctor.name,
    jobTitle: doctor.title || '원장',
    description: doctor.greeting || `이음치과의원 ${doctor.name} ${doctor.title || '원장'}`,
    image: doctor.photo ? (doctor.photo.startsWith('http') ? doctor.photo : `${SITE_URL}${doctor.photo}`) : undefined,
    url: `${SITE_URL}/doctors/${doctor.slug}`,
    worksFor: { '@type': 'Dentist', name: SITE_NAME, '@id': `${SITE_URL}/#organization` },
    knowsAbout: specs,
    medicalSpecialty: specs.length > 0 ? specs : ['Dentistry'],
    ...(specs.length > 0 ? {
      availableService: specs.map((s: any) => ({
        '@type': 'MedicalProcedure',
        name: typeof s === 'string' ? s : (s.name || ''),
        bodyLocation: '구강'
      })).filter((x: any) => x.name)
    } : {}),
    ...(edu.length > 0 ? {
      alumniOf: edu.map((e: any) => ({ '@type': 'CollegeOrUniversity', name: e.school || e.name || '' }))
    } : {}),
    ...(membershipsArr.length > 0 ? {
      memberOf: membershipsArr.map((m: any) => ({
        '@type': 'Organization', name: typeof m === 'string' ? m : (m.org || m.name || '')
      }))
    } : {}),
    // 저서 (최효영 원장 전용) — E-E-A-T 권위성 강화
    ...(doctor.slug === 'choi-hyoyoung' ? {
      workExample: {
        '@type': 'Book',
        name: '치과가 두렵지 않으면 좋겠습니다',
        alternateName: '설명으로 안심하고, 실력으로 다시 찾는 치과의 기록',
        author: { '@type': 'Person', name: doctor.name },
        publisher: { '@type': 'Organization', name: SITE_NAME },
        inLanguage: 'ko',
        image: `${SITE_URL}/static/book-cover.jpg`,
        abstract: '진료실에서 매일 듣는 환자들의 질문과 불안에서 시작된 책. 칫솔 선택부터 임플란트 후 관리까지 치과에서 마주치는 주제를 쉽고 솔직하게 풀어낸 환자 교육용 소량 제작본입니다.',
        bookFormat: 'Paperback'
      }
    } : {})
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// ═══════════════════════════════════════════════════════════════
// SEO 자동 최적화 헬퍼 (콘텐츠 발행 시 자동 주입)
// ═══════════════════════════════════════════════════════════════

/** 마크다운/HTML 본문에서 SEO friendly description 자동 생성 (160자 내) */
export function autoGenerateDescription(content?: string, fallback?: string): string {
  if (!content) return fallback || '이음치과의원 - 부산 강서구 명지동 임플란트·심미보철·교정 전문 치과'
  let text = content
    // 코드 블록 / 인라인 코드 제거
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    // HTML 태그 제거
    .replace(/<[^>]+>/g, ' ')
    // 마크다운 이미지 제거 (alt 텍스트만 남김)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // 마크다운 링크 제거 (텍스트만 남김)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 마크다운 강조/볼드/이탤릭 제거
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // 마크다운 헤더 제거
    .replace(/^#{1,6}\s+/gm, '')
    // 마크다운 인용(>), 수평선(---, ***), 리스트 마커 제거
    .replace(/^\s*>\s*/gm, '')
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // 특수 토큰 제거 ([[TOC]], {{anchor}})
    .replace(/\[\[[^\]]+\]\]/g, '')
    .replace(/\{\{[^}]+\}\}/g, '')
    // HTML 엔티티 디코딩
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    // 다중 공백/개행 → 단일 공백
    .replace(/\s+/g, ' ')
    .trim()
  // 첫 의미 문장 찾기 (인사말 제외)
  text = text.replace(/^안녕하세요[^.!?]*[.!?]\s*/, '')
  text = text.replace(/^부산\s*강서구\s*명지동\s*이음치과\s*대표원장[^.!?]*[.!?]\s*/, '')
  if (text.length < 30) text = fallback || text
  // 160자 컷 (마지막 단어 잘리지 않게)
  if (text.length > 160) {
    text = text.substring(0, 157)
    const lastSpace = text.lastIndexOf(' ')
    if (lastSpace > 100) text = text.substring(0, lastSpace)
    text += '...'
  }
  return text || (fallback || '이음치과의원 - 부산 강서구 명지동 치과')
}

// 진료/지역/브랜드 키워드 사전 (LSI 키워드 매핑)
const SEO_KEYWORD_DICT = {
  // 핵심 진료 (원장님 지시: 임플란트, 인비절라인, 라미네이트, 글로우네이트, 치아교정)
  treatments: [
    '임플란트', '인비절라인', '라미네이트', '글로우네이트', '치아교정',
    '심미보철', '심미레진', '레진', '크라운', '신경치료',
    '잇몸치료', '잇몸병', '발치', '사랑니', '치주치료',
    '틀니', '브릿지', '치아미백', '치석제거', '스케일링',
    '턱관절', '구강검진', '소아치과', '예방치과',
    '디지털가이드', '네비게이션 임플란트', '즉시식립', '뼈이식',
    '투명교정', '설측교정', '클리피씨', '데이몬교정'
  ],
  // 지역 키워드
  regions: [
    '명지동', '부산', '강서구', '부산광역시',
    '명지국제신도시', '명지오션시티', '명지국제', '명지신도시',
    '하단', '엄궁', '낙동남로', '진해', '녹산',
    '에코델타시티', '에코델타', '신호동', '가락동', '대저동'
  ],
  // 의료/조건 키워드
  conditions: [
    '충치', '치아우식', '치은염', '치주염', '풍치', '시린이',
    '치아파절', '치아균열', '치아결손', '부정교합', '돌출입',
    '구취', '입냄새', '치아변색', '치아흔들림'
  ],
  // 브랜드/페르소나
  brand: [
    '이음치과', '최효영', '강선화', '이음치과의원',
    '서울대학교 치과병원', 'CBCT', '3D 프린터', '구강스캐너'
  ]
}

/** 본문/제목에서 SEO 키워드 자동 추출 (빈도 기반 + 우선순위) */
export function extractSeoKeywords(opts: {
  title?: string
  content?: string
  category?: string
  region?: string
  maxKeywords?: number
  baseKeywords?: string[]
}): string[] {
  const max = opts.maxKeywords || 10
  const haystack = `${opts.title || ''} ${opts.content || ''} ${opts.category || ''} ${opts.region || ''}`.toLowerCase()
  const found = new Set<string>(opts.baseKeywords || [])

  // 1. 명시적 카테고리/지역 우선
  if (opts.region) found.add(opts.region)
  if (opts.category) found.add(opts.category)

  // 2. 진료 키워드 (본문에 등장하면 자동 추가)
  for (const kw of SEO_KEYWORD_DICT.treatments) {
    if (haystack.includes(kw.toLowerCase())) found.add(kw)
  }
  // 3. 지역 키워드
  for (const kw of SEO_KEYWORD_DICT.regions) {
    if (haystack.includes(kw.toLowerCase())) found.add(kw)
  }
  // 4. 조건/증상 키워드
  for (const kw of SEO_KEYWORD_DICT.conditions) {
    if (haystack.includes(kw.toLowerCase())) found.add(kw)
  }
  // 5. 브랜드 (항상)
  found.add('이음치과')
  found.add('명지동 치과')

  // 6. 최대 N개로 자름 (진료 키워드 우선)
  const arr = Array.from(found)
  // 핵심 진료가 앞으로 오게 정렬
  const priorityKw = ['임플란트', '인비절라인', '라미네이트', '글로우네이트', '치아교정']
  arr.sort((a, b) => {
    const aP = priorityKw.indexOf(a)
    const bP = priorityKw.indexOf(b)
    if (aP !== -1 && bP === -1) return -1
    if (aP === -1 && bP !== -1) return 1
    if (aP !== -1 && bP !== -1) return aP - bP
    return 0
  })
  return arr.slice(0, max)
}

/** SEO friendly 키워드 문자열 생성 (쉼표 구분, 최대 10개) */
export function autoGenerateKeywords(opts: {
  title?: string
  content?: string
  category?: string
  region?: string
  baseKeywords?: string[]
}): string {
  const kws = extractSeoKeywords({ ...opts, maxKeywords: 10 })
  // 핵심 진료 키워드 5개가 모두 누락되면 강제 추가 (메모리 지시)
  const mustHave = ['임플란트', '인비절라인', '라미네이트', '글로우네이트', '치아교정']
  const haveAny = mustHave.some(k => kws.includes(k))
  if (!haveAny) {
    // 본문에 진료 키워드 없으면 기본 5개 중 첫 2개만 추가
    kws.push('임플란트', '치아교정')
  }
  return Array.from(new Set(kws)).slice(0, 12).join(', ')
}

/** SEO friendly title 생성 (지역+키워드 자동 보강) */
export function enhanceTitle(opts: {
  baseTitle: string
  category?: string
  region?: string
  suffix?: string
  maxLength?: number
}): string {
  const max = opts.maxLength || 60
  let title = opts.baseTitle.trim()
  // 이미 지역명 있으면 그대로
  const hasRegion = /명지동|부산|강서구|명지국제/.test(title)
  if (!hasRegion && opts.region && title.length + opts.region.length + 3 < max) {
    title = `${opts.region} ${title}`
  }
  const suffix = opts.suffix || '| 이음치과'
  const full = `${title} ${suffix}`
  if (full.length <= max) return full
  // 너무 길면 suffix만 짧게
  return `${title} | 이음치과`
}

/** MedicalCondition JSON-LD 자동 생성 (본문에서 의료 용어 감지 시) */
export function autoMedicalConditionJsonLd(content?: string): any[] {
  if (!content) return []
  const conditions: any[] = []
  const conditionMap: Record<string, { name: string; alt?: string; code?: string }> = {
    '충치': { name: '충치', alt: '치아우식증', code: 'K02' },
    '치아우식': { name: '치아우식증', alt: '충치', code: 'K02' },
    '잇몸병': { name: '치주질환', alt: '잇몸병', code: 'K05' },
    '치주염': { name: '치주염', alt: '잇몸병', code: 'K05.3' },
    '치은염': { name: '치은염', alt: '잇몸염증', code: 'K05.0' },
    '부정교합': { name: '부정교합', alt: '치아 부정렬', code: 'K07' },
    '치아파절': { name: '치아파절', alt: '치아 깨짐', code: 'S02.5' },
    '치아결손': { name: '치아결손', alt: '치아 상실' },
    '시린이': { name: '상아질 과민증', alt: '시린이' },
    '구취': { name: '구취', alt: '입냄새', code: 'R19.6' }
  }
  const text = content.toLowerCase()
  for (const [key, info] of Object.entries(conditionMap)) {
    if (text.includes(key.toLowerCase())) {
      conditions.push({
        '@context': 'https://schema.org',
        '@type': 'MedicalCondition',
        name: info.name,
        alternateName: info.alt,
        ...(info.code ? { code: { '@type': 'MedicalCode', codeValue: info.code, codingSystem: 'ICD-10' } } : {})
      })
    }
  }
  return conditions.slice(0, 3) // 최대 3개
}

/** Cases (비포애프터) description 자동 생성 — 카테고리/지역/시술명 조합 */
export function autoGenerateCaseDescription(caseData: {
  title: string
  description?: string
  category?: string
  treatment_date?: string
}): string {
  const categoryNames: Record<string, string> = {
    implant: '임플란트', aesthetic: '심미보철', resin: '심미레진',
    tmj: '턱관절 치료', general: '일반진료', orthodontic: '치아교정'
  }
  const catName = categoryNames[caseData.category || 'general'] || '치과 치료'
  if (caseData.description && caseData.description.length > 50) {
    // 기존 description 사용 + 키워드 보강
    const desc = caseData.description.substring(0, 130).trim()
    return `${desc} | 부산 명지동 이음치과 ${catName} 비포애프터, 실제 치료 결과 사진과 함께 확인하세요.`
  }
  return `부산 명지동 이음치과 ${catName} 비포애프터 - ${caseData.title}. 실제 치료 전후 사진과 디지털 진단(CBCT, 구강스캐너) 결과로 정확하고 안전한 치료 과정을 확인하세요.`
}

