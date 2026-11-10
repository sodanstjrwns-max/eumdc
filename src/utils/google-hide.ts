/**
 * 구글 전용 검색 제외 (2026-11-10)
 *
 * 배경: 구글이 사이트 단위 판정으로 홈 한 장만 색인하고 있다(직접 조치·기술 오류 없음,
 *       백과·지역 조합을 대량 공개한 뒤 전체 탈락). 방문의 대부분은 네이버에서 오고 그 다수가 백과로 들어온다.
 *       → 대량 생성 구역을 "구글 크롤러에게만" 검색 제외해, 구글이 보는 사이트를 병원 핵심 페이지로 줄여 재평가를 받는다.
 *
 * 방식: 요청 User-Agent 가 구글 크롤러(Googlebot · Google-InspectionTool)이고, 경로가 아래 대상 구역이며,
 *       응답이 200 HTML 일 때만 응답 헤더 X-Robots-Tag 를 `googlebot: noindex` 로 바꾼다.
 *       (src/index.tsx 맨 바깥 미들웨어 한 곳에서 처리)
 *
 * 지킬 것:
 *  - 네이버(Yeti)·Bing·일반 브라우저·AI 봇 응답은 헤더·본문 모두 그대로다. HTML 메타 태그·robots.txt·sitemap·canonical 을 건드리지 않는다.
 *  - Google-Extended · GoogleOther · AdsBot-Google · Mediapartners-Google 은 대상이 아니다.
 *  - 301·404 등 200 이 아닌 응답, HTML 이 아닌 응답(.md·xml)에는 붙이지 않는다.
 *  - 이 사이트는 HTML 을 엣지 캐시(caches.default·KV)에 저장하지 않는다. 나중에 HTML 캐시를 넣는다면
 *    이 헤더가 저장본에 들어가지 않도록 캐시에서 꺼낸 뒤 요청마다 붙여야 한다.
 *
 * 되돌리는 방법: isGoogleHiddenPath 가 항상 false 를 돌려주게 하면 끝(첫 줄에 `return false`).
 */
import { MYEONGJI_CORE_MAP } from '../data/myeongji-core'

/** 구글 크롤러에게만 내보내는 X-Robots-Tag 값 */
export const GOOGLE_HIDE_ROBOTS_TAG = 'googlebot: noindex'

/** 구글 검색 크롤러 판정 — UA 에 Googlebot 또는 Google-InspectionTool (대소문자 무시) */
export function isGoogleCrawler(userAgent?: string | null): boolean {
  return !!userAgent && /googlebot|google-inspectiontool/i.test(userAgent)
}

// 남기는 주 지역 허브 (병원 소재지)
const KEEP_REGION_HUBS = new Set(['myeongji'])
// near-me 변형 묶음 (src/pages/near-me.tsx 한 템플릿의 4가지 변형)
const NEAR_ME_PATHS = new Set(['/near-me', '/open-now', '/weekend-dental', '/night-dental'])

/**
 * 구글에만 가리는 경로인지 판정한다.
 *
 * 가린다:
 *  - /dictionary, /dictionary/*                 치과 용어 백과(목록 포함)
 *  - /regions                                   지역 30곳 목록
 *  - /regions/:지역                             주 지역 허브(/regions/myeongji)를 뺀 지역 페이지
 *  - /regions/:지역/:진료                       지역×진료 조합 (아래 명지 핵심 6쪽 제외)
 *  - /regions/:지역/:진료/cost, /best, /best/*  가격·추천 조합(이미 noindex 인 묶음)
 *  - /near-me, /open-now, /weekend-dental, /night-dental
 *
 * 남긴다(여기서 false):
 *  - 홈, /treatments*, /doctors*, /prices, /about, /visit, /faq, /notices*, /cases*
 *  - /blogs* — 글이 전부 D1(관리자 발행)에서 오고 레포 시드가 없어 일괄 생성분을 구분할 수 없음
 *  - /regions/myeongji — 주 지역 허브
 *  - /regions/myeongji/{implant·invisalign·laminate·orthodontics·general·periodontal}
 *    — 소재지×핵심 진료, 고유 제목·사진·본문으로 따로 만든 "명지 핵심 6쪽"(src/data/myeongji-core.ts). 애매해서 남김.
 *      가리려면 아래 `MYEONGJI_CORE_MAP` 조건을 지우면 된다.
 */
export function isGoogleHiddenPath(rawPath: string): boolean {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath

  if (path === '/dictionary' || path.startsWith('/dictionary/')) return true
  if (path === '/best' || path.startsWith('/best/')) return true
  if (NEAR_ME_PATHS.has(path)) return true

  if (path === '/regions') return true
  if (path.startsWith('/regions/')) {
    const seg = path.slice('/regions/'.length).split('/')
    if (seg.length === 1) return !KEEP_REGION_HUBS.has(seg[0])
    if (seg.length === 2) return !(seg[0] === 'myeongji' && Object.prototype.hasOwnProperty.call(MYEONGJI_CORE_MAP, seg[1]))
    return true // /regions/:지역/:진료/cost 등
  }

  return false
}
