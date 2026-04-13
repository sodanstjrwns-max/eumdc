# 이음치과의원 웹사이트 (Eum Dental Clinic)

## Project Overview
- **Name**: eum-dental
- **Goal**: 부산 강서구 명지 이음치과의원의 SEO/AEO 최적화 종합 웹사이트
- **Stack**: Hono + TypeScript + Cloudflare Pages + D1 + R2
- **Design**: Dark theme, GSAP interactive motion, responsive

## URLs
- **Sandbox**: https://3000-iccn9mgndswaqvt3ffm6e-ecea8f22.sandbox.novita.ai
- **Production**: https://eum-dental.pages.dev

## Completed Features

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | 메인 페이지 - 히어로, 마퀴, 갤러리, 원장소개, 장비, 연락처 |
| `/treatments` | 진료과목 목록 (핵심 3 + 일반 6) |
| `/treatments/:slug` | 진료과목 상세 (FAQ 포함, SEO 스키마) |
| `/doctors` | 의료진 전체 소개 |
| `/doctors/:slug` | 의료진 개별 상세 |
| `/about` | 병원 미션/가치/장비/시설 |
| `/visit` | 내원 안내 (길찾기, 진료시간, 수가) |
| `/cases` | 비포애프터 (Before 공개, After 로그인 필요) |
| `/cases/:id` | 케이스 상세 (환자정보, 담당의, 지역, 기간) |
| `/blogs` | 블로그 목록 |
| `/blogs/:id` | 블로그 상세 (저자, SEO 스키마) |
| `/notices` | 공지사항 (고정 공지, 썸네일) |
| `/notices/:id` | 공지 상세 (이미지 포함) |
| `/faq` | FAQ 통합 페이지 (180+ FAQ, 카테고리/검색) |
| `/dictionary` | 치과 용어 백과사전 (219+ 용어) |
| `/dictionary/:slug` | 용어 상세 |
| `/regions` | 지역별 SEO 랜딩 목록 |
| `/regions/:slug` | 지역별 SEO 랜딩 상세 |
| `/signup` | 회원가입 (개인정보/마케팅 동의, 이메일+전화) |
| `/login` | 로그인 |
| `/admin` | 관리자 대시보드 |

### SEO/AEO
- Perfect meta tags (Title <= 60자, Description <= 160자)
- Canonical URLs, Open Graph, Twitter Card
- JSON-LD: LocalBusiness, Person, WebSite, FAQPage, BlogPosting, MedicalWebPage, DefinedTermSet, HowTo, Speakable, BreadcrumbList
- robots.txt + dynamic sitemap.xml
- Regional SEO landing pages
- AI crawler friendly (GPTBot, ClaudeBot, ChatGPT-User)

### Design & Motion
- GSAP ScrollTrigger animations
- Scroll progress bar
- Parallax effects, staggered grid reveals
- Custom cursor (desktop), magnetic buttons
- Text split animations, counter animations
- Image clip-path reveal on scroll

### Admin CRUD
- Dashboard (통계: 회원수, 가입추이, 마케팅동의, 조회수)
- Cases CRUD (4 이미지, 환자정보, 지역 자동완성, 담당의, 치료기간)
- Blogs CRUD (SEO 제목/설명/슬러그, 마크다운 에디터, 드래그앤드롭 이미지, 저자 선택)
- Notices CRUD (고정 공지, 이미지 업로드, 썸네일)
- FAQ CRUD (카테고리별)
- Users 관리 (동의항목 표시)

### Data Architecture
- **D1 Database**: users, cases, blogs, notices, faqs, dict_terms, treatments, doctors, regions, seo_regions, view_logs, reservations, notice_images, blog_images, treatment_faqs
- **R2 Storage**: Image uploads
- **Dictionary Auto-Link**: Blog/Case 본문에서 치과 용어 자동 하이퍼링크

## Tech Stack
- Hono 4.x (Cloudflare Pages)
- TypeScript, JSX (server-rendered)
- D1 SQLite + R2 Object Storage
- GSAP 3.12 (ScrollTrigger)
- Noto Sans KR + Playfair Display
- Custom CSS (no framework, dark theme)

## Deployment
- **Platform**: Cloudflare Pages
- **Build**: `npm run build` -> `dist/_worker.js`
- **Deploy**: `npm run deploy`
- **DB Migrations**: `wrangler d1 migrations apply eum-dental-db --local`
