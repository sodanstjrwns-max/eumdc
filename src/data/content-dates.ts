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
