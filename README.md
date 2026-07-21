# 이음치과의원 (eumdc)

부산 명지 이음치과의원 공식 홈페이지 — Hono + Cloudflare Pages + D1 + R2 기반 SSR 웹앱

## 🌐 Production URL
- **공식 도메인**: https://ieumdc.kr
- **최신 배포**: https://6b28b8cc.eumdc.pages.dev (2026-07-21 B안 콘텐츠 증량)

## 📚 2026-07-21 4차 증량: 용어사전 15개 추가 (누적 55개 완료)
- **대상(4차)**: 임플란트주위염/올온포/오버덴처/잇몸이식/드라이소켓/치아파절/치아우식(충치심화)/구강호흡/치실/전동칫솔/불소도포/CBCT/국소마취/턱근육보톡스/안면비대칭 — 시술·예방·장비 계열 롱테일 키워드
- **본문+FAQ 합산 3,000자+**: 각 용어 h3 섹션 6~8개 + 맞춤 FAQ 5개(가시 FAQ ↔ FAQPage JSON-LD 1:1), 전 15개 3000~3277자 검증 완료
- **마이그레이션**: 0121~0123(본문 3배치) + 0124~0125(탑업) — 로컬/원격 D1 적용, 실서비스 렌더링 검증 완료 (JSON-LD FAQ 5 = 가시 FAQ 5)
- **잔여**: ~164개 용어 미증량 (535~790자대) — 다음 배치 후보 / 지역 랜딩 증량도 대기

## 📚 2026-07-21 3차 증량: 용어사전 15개 추가 (누적 40개 완료)
- **대상(3차)**: 구취/시린이(지각과민)/구내염/이갈이/잇몸퇴축/수면치료(의식하진정)/금관/매복치/실란트/구강건조증/부정교합/치석/유지장치/턱관절클릭/치주질환 — 증상·예방 계열 롱테일 키워드
- **본문+FAQ 합산 3,000자+**: 각 용어 h3 섹션 6~8개 + 맞춤 FAQ 5개(가시 FAQ ↔ FAQPage JSON-LD 1:1)
- **마이그레이션**: 0115~0117(본문 3배치) + 0118~0120(탑업) — 로컬/원격 D1 적용, 실서비스 렌더링 검증 완료
- **잔여**: 179개 용어 미증량 (600~800자대) — 다음 배치 후보

## 📚 2026-07-21 B안: 용어사전 상위 25개 콘텐츠 증량 (씬 콘텐츠 해소)
- **대상**: 검색량 상위 25개 용어 (임플란트/사랑니/스케일링/신경치료/충치/라미네이트/크라운/레진/미백/지르코니아/치주염/골이식/브릿지/틀니/턱관절장애/교정/투명교정/발치/치은염/인레이/상악동거상술/온레이/이맥스/스플린트/골유착)
- **본문**: 각 용어 3,000자+ 구조화 HTML(h3 소제목 8~10개, 보험 안내·관리법·오해 바로잡기 등 실질 정보)
- **맞춤 FAQ**: `dict_terms.faqs` 컬럼(JSON) 신설 — 용어별 실제 환자 질문 5개, 페이지 가시 FAQ와 FAQPage JSON-LD 1:1 일치 (기존: 템플릿 3문항 복붙 → 도어웨이 판정 위험)
- **마이그레이션**: 0103(컬럼) + 0104~0108(1차 증량) + 0109~0113(2차 증량) + 0114(탑업) — 로컬/원격 D1 모두 적용 완료
- **코드**: `dictionary.tsx`/`index.tsx` 맞춤 FAQ 렌더링 (faqs 없는 용어는 generic 3문항 fallback)
- **updated_at 갱신** → sitemap-dictionary lastmod에 실제 반영 (구글 재크롤 신호)

## 🔧 2026-07-21 SEO 색인 부진 긴급 수정 (GSC 3개월 클릭 3회 진단)
- **가짜 lastmod 제거**: sitemap index/pages/matrix의 `lastmod`가 매 요청 `now()`로 찍히던 것을 D1 실제 `MAX(updated_at)` 기반으로 변경 — 구글이 사이트맵 신호를 무시하던 핵심 원인
- **pages.dev 중복 색인 차단**: `eumdc.pages.dev`/`ieumdc.pages.dev` → `ieumdc.kr` 301, 해시 프리뷰 URL(`*.pages.dev`)은 `X-Robots-Tag: noindex, nofollow`
- **빈 sitemap-news.xml 제거**: robots.txt와 sitemap index에서 삭제 (0건 뉴스 사이트맵)
- **배포 후 수동 조치 필요**: GSC 사이트맵 재제출 + 핵심 페이지 색인 요청, 백링크 확보(네이버 플레이스/카카오맵/디렉토리), 구 도메인(eumdc.kr) GSC 주소 변경 도구 확인

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

## 🔐 보안 하드닝 라운드 (2026-06-12)
프로젝트 전체 검토 후 보안·자산 개선:
- **AUTH_SECRET fail-closed**: `'fallback-secret'` 폴백 전면 제거 — 시크릿 미설정(16자 미만) 시 모든 인증을 거부(503/401). 공개 소스의 고정 문자열로 세션 쿠키를 위조할 수 있던 이론적 경로 차단. (admin auth.ts + user users.ts 전체)
- **로그인 브루트포스 방어**: D1 기반 IP rate limit — 15분 윈도우 10회 초과 시 429. 어드민 로그인 + 사용자 로그인 모두 적용. `login_attempts` 테이블 (migration 0102). 검증: 12연속 시도 → 9회째부터 429 확인.
- **예약 API 스팸 방어** (`/api/reservations`):
  - Honeypot `website` 필드 — 봇이 채우면 가짜 성공 응답 후 DB 저장 안 함 (검증 완료)
  - IP rate limit (15분 10회)
  - 입력 길이 제한 (name 50자 / message 2000자 / treatment_type 100자)
- **JSON-LD 이미지 WebP 통일**: seo.ts에 남아있던 photo_5/7/8 `.jpg` 참조 3곳 → `.webp` (구조화데이터-실파일 일치)
- **미사용 JPG 9장 삭제**: `public/static/img/photo_*.jpg` (~1.1MB) — 모든 참조가 WebP로 전환 완료되어 dist에서 제외

## 🤖 업로드 자동 최적화 (2026-06-12) — CWV 다이어트 영구 유지
관리자가 어떤 크기의 이미지를 올려도 자동으로 최적화되는 근본 해결:
- **클라이언트 자동 변환** (`admin.js optimizeImage`): 업로드 직전 Canvas로 최대 1600px 리사이즈 + WebP(quality 0.82) 변환. 검증: 5.7MB PNG → **20KB WebP** 자동 변환 확인.
  - 적용 범위: 단일 업로드(uploadFile), 다중 업로드(uploadMulti), Toast 에디터 본문 삽입(addImageBlobHook) 전부
  - 안전장치: GIF/SVG 통과(애니메이션·벡터 보존), 변환 결과가 원본보다 크면 원본 유지, 어떤 실패든 원본 업로드 폴백
- **서버 가드** (`upload.ts`): 8MB 초과 업로드 413 거부 (최적화 우회 방어)
- 이제 직원 교육 없이도 신규 이미지가 항상 수십~수백 KB 수준으로 유지됨

## ⚡ Core Web Vitals 2차 — R2 이미지 + GSAP 분리 (2026-06-12)
- **R2 이미지 전수 WebP 전환**: 블로그 썸네일·본문 인라인·blog_images·notice_images 등 38장 — 원본 PNG/JPG **48MB → WebP 3.7MB (-92%)**, 최대 1600px 리사이즈, quality 82. 원본은 R2에 보존(롤백 가능).
- **D1 참조 마이그레이션**: blogs(thumbnail/content/content_html), blog_images, notice_images, doctors, cases 전 컬럼 `.png/.jpg → .webp` 일괄 UPDATE. 전 발행 블로그 잔존 구참조 0건 검증 완료.
- **GSAP 홈 전용 분리**: gsap.min.js + ScrollTrigger(CDN ~130KB) + gsap-init.js(52KB)를 홈에서만 로드. 서브페이지는 app.js IntersectionObserver 리빌로 동작 (per-page **-180KB**).
- **폴링 가드**: gsap-init/scroll-perf-patch의 waitForGsap·waitForST에 5초 타임아웃 — GSAP 미로드 페이지 무한 setTimeout 제거.
- ~~운영 주의: 새 이미지 업로드 시 원본 저장~~ → **해결됨**: 업로드 자동 최적화 적용 (2026-06-12)

## ⚡ Core Web Vitals 튜닝 (2026-06-11)
LCP/CLS/전송 바이트 최적화 라운드:
- **폰트 다이어트**: Google Fonts `@import` 이중 로딩 제거(style.css/admin.css), Noto Sans KR weight 200·900 컷(미사용) → 8종→6종. `media="print" onload` 패턴으로 폰트 CSS 비차단 로딩 + noscript 폴백.
- **갤러리 이미지 WebP 전환**: photo_1~9 JPG(1.1MB) → 1200px WebP(356KB, **-68%**). 모든 `<img>`에 width/height 명시(CLS 0 방지) + `decoding="async"`.
- **CSS/JS 미니파이 빌드 스텝**: `scripts/minify-static.mjs` (esbuild, postbuild) — dist/static 901KB → 586KB(**-35%**). 소스는 가독성 유지.
- **스크립트 전부 defer**: app.js/sub.js/gsap-init.js 파서 차단 제거. 캐시버스팅 `?v=20260611b` 통일.
- **LCP 힌트**: 블로그 썸네일·의료진 프로필 히어로 이미지에 `fetchpriority="high"`.
- **`public/_headers`**: `/static/*` → `Cache-Control: public, max-age=31536000, immutable` (반복 방문 즉시 로드).
- **nav/footer 심볼**: 1017px PNG(28KB) → 112px WebP(8KB).

## 💰 SEO/AEO 가격 데이터 업그레이드 (2026-06-12)
가장 큰 AEO 공백이었던 "가격(수가) 데이터의 크롤러/AI 비가시성" 해소:
- **가격 SSR 전환**: 치료상세 페이지(`/treatments/:slug`)에 서버렌더 가격표 (`#treat-price-section`). 기존엔 클라이언트 fetch만 — AI/크롤러에 보이지 않았음.
- **Offer 스키마**: `parseKrwPrice()`로 "129만원"/"99~129만원" → KRW 숫자 파싱, schema.org `Offer`/`PriceSpecification`/`OfferCatalog` JSON-LD 출력 (치료상세 + /prices).
- **`/prices` 페이지 신설**: TL;DR 요약 박스 + 치료별 SSR 수가표(39항목) + 비용 FAQ(`<details>` SSR) + 유의사항. sitemap priority 0.9, 전역 메뉴·푸터 "비용 안내" 링크 (홈+서브 레이아웃).
- **.md 엔드포인트 확장** (AI 에이전트용, `X-Robots-Tag: noindex`): `/treatments/:slug.md` (개요+핵심정보+수가표+FAQ), `/prices.md` (전체 수가표), `/faq.md` (FAQ 112문항 전체).
- **llms.txt**: "진료 비용 요약" 섹션 + ⚠️ CBCT 진단 후 안내 문구 + .md 엔드포인트 목록. **llms-full.txt**: 수가표 전체 섹션 (만원 언급 0 → 32회).
- **버그픽스**: X-Robots-Tag 미들웨어가 라우트별 noindex를 덮어쓰던 문제 수정 (.md 중복 색인 방지 복원).

## 🤖 SEO/AEO 머신 업그레이드 (2026-06-11)
"보이는 콘텐츠 = 구조화 데이터" 원칙으로 클로킹 리스크를 제거하고, AI 검색엔진(AEO) 인용 가능성을 극대화:
- **① FAQ 페이지 진짜 SSR 전환**: 기존 `sr-only` 숨김 콘텐츠 + JS-only 렌더링(클로킹 오인 리스크) → `<details>` 기반 가시 SSR 콘텐츠가 기본. JS는 검색/필터 향상만 담당. 크롤러·AI·사용자가 100% 동일 콘텐츠를 봄.
- **② 홈페이지 가시 FAQ 섹션** (`#section-faq`): FAQPage JSON-LD 7문항과 1:1 일치하는 화면 FAQ 추가 (Google 리치결과 정책 — "JSON-LD 콘텐츠는 페이지에 보여야 함" 충족). 데이터 단일 소스: `seo.ts`의 `HOME_FAQS`.
- **③ 블로그 상세 AEO 강화**:
  - **TL;DR 핵심 요약 박스** (`.blog-tldr`) — 본문에서 핵심 문장 자동 추출, AI 검색·피처드 스니펫이 우선 인용하는 발췌 블록
  - **가시 브레드크럼** — BreadcrumbList JSON-LD와 일치
  - **관련 글 4개 내부링크** — 크롤 경로 + 체류시간 강화
  - **Speakable 스키마** — 제목+TL;DR을 음성/AI 발췌 대상으로 지정
- **④ 용어사전 상세**: 가시 FAQ 3문항과 1:1 일치하는 FAQPage JSON-LD 주입 + DefinedTerm에 `alternateName`(영문)·`inLanguage` 보강 → 219페이지 전체 리치결과 자격 확보.
- **⑤ AI 크롤러 전용 콘텐츠 레이어**:
  - `/llms-full.txt` — 진료·FAQ 100문항·의료진·최신 블로그 본문 전문 덤프 (llms.txt가 목차라면 이건 본문)
  - `/blogs/:slug.md` — 블로그 마크다운 원문 엔드포인트 (AI 에이전트 토큰 효율 수집, X-Robots-Tag: noindex로 중복 색인 방지)
  - robots.txt에 `LLMs-Full:` 라인 추가

## 🔗 색인 촉진: 내부링크 + 매트릭스 차별화 (2026-06-10)
GSC 진단 결과 "발견-색인안됨 270 → 0"(다이어트 성공)이나 "크롤링됨-색인안됨 41" 잔존. 두 가지 근본 원인 해결:
- **① 핵심 페이지 고립 해소**: 홈페이지에 지역×진료 내부링크 허브(`#section-region-hub`) 추가. 홈→`/regions/*` 링크 **0→28개**, 홈→`/treatments/*` **0→4개**. 구글 크롤러가 핵심 28매트릭스+4진료 페이지로 직접 진입 가능.
- **② 매트릭스 도배성 해소**: 28개 매트릭스 페이지(7지역×4진료)가 지역명만 다른 95.6% 동일 콘텐츠였음. GPT-5로 **지역별 고유 본문**(교통·생활권·거주특성 반영) 생성해 주입 → 페이지 유사도 **95.6%→76%**(본문만 비교 시 30%).
  - 데이터: `src/data/matrix-local-content.ts` (28개), 생성 스크립트: `scripts/gen-matrix-content.mjs`
  - 렌더: `region-treatment.tsx`의 `.rt-local` 섹션
- 📌 후속(원장님): GSC 사이트맵 재제출 + 주소변경(도메인 이전) 신고 확인 + 핵심 페이지 색인 요청.

## 📚 용어사전 콘텐츠 전면 강화 (2026-06-05)
GSC "Discovered – not indexed"에 묶여있던 용어사전 219페이지의 근본 원인(=빈약/도배성 본문) 해결:
- **문제**: `dict_terms.full_desc`가 용어당 평균 100자(한 문장)뿐 → 페이지 간 차별성 부족, 구글 색인 거부.
- **해결**: GPT-5 기반으로 **219개 용어 전체에 고유·구조화 HTML 본문 생성**.
  - 구조: 핵심 정의 단락 + `<h3>원리/특징` + `<h3>적응증/관련상황(목록)` + `<h3>알아두면 좋은 점`
  - 결과: `full_desc` 평균 길이 **100자 → 648자** (최소 535 / 최대 820), 본문 중복 0건, h3 구조 100% 적용.
- **적용 방식**: `migrations/0101_dict_rich_content.sql` (219 UPDATE문)을 D1 로컬·프로덕션에 직접 실행. 런타임 D1 조회라 재배포 불필요.
- 용어 페이지는 이미 `index, follow` + `sitemap-dictionary.xml`(219 URL)에 포함되어 있어, 본문만 보강하면 색인 가능성 대폭 상승.
- 생성 스크립트: `scripts/gen-dict-content.mjs` (재실행/이어받기 지원).

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
- **Last Updated**: 2026-06-12
