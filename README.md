# 이음치과의원 (eumdc)

부산 명지 이음치과의원 공식 홈페이지 — Hono + Cloudflare Pages + D1 + R2 기반 SSR 웹앱

## 🌐 Production URL
- **공식 도메인**: https://ieumdc.kr
- **최신 배포**: https://f46953de.ieumdc.pages.dev

## ✅ 현재 완료된 기능

### 콘텐츠 관리
- ✅ **블로그** — 리스트/상세 SSR, Markdown→HTML, H1, 용어사전 자동링크, SEO 메타/JSON-LD
- ✅ **케이스(비포&애프터)** — 리스트/필터/상세 SSR, 비포/애프터 이미지(파노/구강), 담당의 카드
- ✅ **공지사항** — 리스트/상세 SSR, 고정핀, 썸네일
- ✅ **의료진** — 전체 프로필, 학력/경력/자격, Markdown 인사말
- ✅ **용어사전** — 한글 초성 인덱스, 검색, 카테고리 필터
- ✅ **치료과목** — 치료별 담당의/가격 가이드/관련용어
- ✅ **FAQ** — 카테고리별 그룹핑
- ✅ **지역 SEO 랜딩** — `seo_regions` 기반

### 콘텐츠 시딩(실제 데이터)
- 블로그 10건(id 6~15): 임플란트 수술 전 팁, 라미네이트 vs 올세라믹, 턱관절 딱소리, 스케일링 주기, 충치 단계, 소아치과, 미백, 잇몸출혈, 임플란트 10년 관리, 치과공포증
- 케이스 5건(id 8~12): 하악 구치부 임플란트 3본, 상악 전치부 라미네이트, 상악 좌측 단일 임플란트, 전치부 올세라믹, 사랑니 4개 동시 발치
- 공지 2건(id 6~7): 2026년 5월 연휴 진료, 네이버 예약 오픈

### 기술 요소
- ✅ SSR 렌더링(Hono JSX)
- ✅ Cloudflare D1 (SQLite) + R2(이미지)
- ✅ Markdown → HTML 변환(`utils/content.ts`)
- ✅ 용어사전 자동링크(regex 안전처리, 특수문자 escape)
- ✅ SEO: meta, OpenGraph, Twitter, JSON-LD(Article/MedicalClinic/MedicalProcedure)
- ✅ Sitemap `/sitemap.xml`, robots `/robots.txt`
- ✅ Favicon/Apple-touch-icon/Manifest
- ✅ 404 페이지 브랜드 디자인
- ✅ 어드민 `/admin` (세션 쿠키 기반)

### 📱 모바일 시네마틱 반응형 (2026-04-19 추가)
- **히어로**: 제목 타이포그래피 모바일 최적화(clamp), CTA 풀사이즈 버튼
- **스토리 챕터**: 모바일 글자 크기/간격 재조정, 과도한 blur 효과 off로 프레임 드랍 방지
- **가로 스크롤 섹션**: 모바일에서 GSAP pin 비활성화 → 네이티브 스와이프 + scroll-snap
- **풀메뉴**: 모바일 폰트·패딩 재조정
- **서브페이지**: 케이스/블로그/공지/의료진 리스트 1열, 카드·필터바 가로스와이프
- **상세페이지**: 비포&애프터 단일 칼럼, 이미지 풀너비, 본문 1rem/1.8 가독성
- **어드민**: 탭 가로스크롤, 데이터 행 2단 그리드, 모달 바텀시트 스타일, iOS 자동확대 방지(16px 폰트)
- **터치**: hover 제거, `:active` 피드백, tap-area 40px+

## 🗂 데이터 모델 / 스토리지
- **Cloudflare D1** (`eumdc-production`): blogs, cases, notices, doctors, treatments, dict_terms/categories, faqs, users, seo_regions, admin sessions
- **Cloudflare R2**: 업로드 이미지 (`/r2/images/*` 경로)
- **데이터 흐름**: 사용자 → Hono 라우트 → D1 쿼리 → JSX SSR → Cloudflare Edge

## 🔐 주요 진입 URI

| 경로 | 설명 |
|---|---|
| `/` | 메인 (시네마틱 히어로 + 스토리 챕터) |
| `/about` | 병원 소개 |
| `/treatments` · `/treatments/:slug` | 치료과목 |
| `/doctors` · `/doctors/:slug` | 의료진 |
| `/cases` · `/cases/:id` | 비포&애프터 |
| `/blogs` · `/blogs/:idOrSlug` | 블로그 |
| `/notices` · `/notices/:id` | 공지 |
| `/dictionary` · `/dictionary/:slug` | 용어사전 |
| `/faq` | 자주 묻는 질문 |
| `/contact` · `/visit` | 오시는 길/예약 |
| `/admin` | 관리자(로그인 필요) |
| `/sitemap.xml` · `/robots.txt` · `/manifest.json` | SEO |

## 🚧 추후 개발 제안
- Core Web Vitals 튜닝(LCP/CLS 개선: 폰트 swap, 이미지 lazy + width/height)
- 블로그 페이징 / 카테고리 필터
- 상담 예약 폼 → 관리자 알림 연동
- 콘텐츠 내 이미지 자동 WebP 변환(R2 업로드시)
- 사용자 로그인 및 비포&애프터 로그인 게이트 활성화
- 다국어(일본어/영어) 지원

## 🛠 개발
```bash
npm install
npm run build
npm run deploy:prod  # wrangler pages deploy dist --project-name eumdc
```

로컬 개발:
```bash
pm2 start ecosystem.config.cjs
```

## 🎯 SEO 정밀 다이어트 (2026-06-04)
GSC "Discovered – currently not indexed" 270페이지(도배성/중복 도어웨이 페이지) 정리:
- **색인 대상 축소**: 사이트맵 URL ~700 → ~304개. 매트릭스는 우선조합 **7지역 × 4진료 = 28페이지**만 색인.
  - 우선 지역: `myeongji, myeongji-ocean, gangseo, noksan, sinho, eco-delta, jangyu`
  - 우선 진료: `implant, invisalign, laminate, orthodontics`
- **noindex 처리 (HTML `<meta name="robots" content="noindex, nofollow">`)**:
  - 비우선 매트릭스 페이지 (우선조합 외 모든 `/regions/:r/:t`)
  - 전체 가격 페이지 (`/regions/:r/:t/cost`, 135개)
  - 전체 추천/비교 페이지 (`/best/:slug`, 135개) + `/best` 목록
- **사이트맵 정리**: `sitemap-cost.xml`, `sitemap-best.xml`을 빈 urlset으로 변경하고 마스터 인덱스(`sitemap.xml`) 및 `robots.txt`에서 제거. `sitemap-matrix.xml`은 28개 우선 URL만 출력.
- 우선조합 28페이지는 `index, follow`로 정상 색인 유지.
- 📌 후속 권장: GSC에서 sitemap 재제출 + 핵심 28페이지 색인 요청. (`sitemap-dictionary.xml`이 219 URL로 남아있어 향후 추가 다이어트 후보.)

## 📦 배포
- **Platform**: Cloudflare Pages (project: `eumdc`)
- **Status**: ✅ Active
- **Stack**: Hono 4 + Vite 6 + TypeScript + TailwindCSS(CDN) + GSAP(CDN) + Cloudflare D1/R2
- **Last Updated**: 2026-06-04
