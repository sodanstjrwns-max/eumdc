// ============================================================
// 수가표 기준일 (/prices 화면 '기준일', WebPage.lastReviewed, /prices.md '기준일')
// 값 = 수가 데이터(migrations/0020_price_guide_from_excel.sql, 엑셀 원본 기반 전면 재구성)의
//      마지막 커밋 날짜. vite.config.ts 가 빌드 시 git log 로 계산해 __PRICES_DATE__ 로 주입한다.
//      얕은 클론·git 없음 → 아래 폴백(2026-09-29 산출값).
// ※ new Date() 로 오늘 날짜를 채우지 않는다 (2026-09-29 SEO/AEO 감사).
// ※ 관리자 수가 탭(D1 price_guide)에는 수정 시각 컬럼이 없어 편집이 자동 반영되지 않는다 —
//    수가를 크게 바꾸면 이 폴백 또는 데이터 파일 커밋으로 날짜를 갱신할 것.
// ============================================================
declare const __PRICES_DATE__: string

const PRICES_DATE_FALLBACK = '2026-04-19'

export const PRICES_DATE: string =
  (typeof __PRICES_DATE__ !== 'undefined' && /^\d{4}-\d{2}-\d{2}$/.test(__PRICES_DATE__) && __PRICES_DATE__) ||
  PRICES_DATE_FALLBACK

// ============================================================
// 지역×진료 추천 페이지(/best/:slug) Article datePublished·dateModified
// 게시일 = src/pages/region-treatment-best.tsx 최초 커밋 날짜,
// 수정일 = 그 템플릿 + src/data/seo-matrix.ts(지역·진료 데이터) 마지막 커밋 날짜.
// vite.config.ts 가 빌드 시 __BEST_PUBLISHED_DATE__ / __BEST_MODIFIED_DATE__ 로 주입, 폴백은 2026-09-29 산출값.
// ※ 예전엔 datePublished 가 new Date() (매일 오늘) 였다 (2026-09-29 교정).
// ============================================================
declare const __BEST_PUBLISHED_DATE__: string
declare const __BEST_MODIFIED_DATE__: string

const isYmd = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

export const BEST_PUBLISHED_DATE: string =
  (typeof __BEST_PUBLISHED_DATE__ !== 'undefined' && isYmd(__BEST_PUBLISHED_DATE__) && __BEST_PUBLISHED_DATE__) ||
  '2026-05-26'

export const BEST_MODIFIED_DATE: string =
  (typeof __BEST_MODIFIED_DATE__ !== 'undefined' && isYmd(__BEST_MODIFIED_DATE__) && __BEST_MODIFIED_DATE__) ||
  '2026-08-18'
