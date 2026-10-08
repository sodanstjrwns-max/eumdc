/**
 * "명지 치과" 허브(/regions/myeongji)로 보내는 내부 링크 공용 문구 (2026-10-08 허브 내부 링크 몰아주기)
 *
 * - 앵커 텍스트는 대표 키워드 "명지 치과" 그대로, nofollow 없음.
 * - 한 페이지에 허브 링크는 최대 2개(전역 푸터 1 + 본문 1). 허브 자신에는 넣지 않는다.
 * - 블로그 문장은 글마다 똑같지 않도록 slug 해시로 4개 문형 중 하나를 고정 선택한다.
 * - 문장에는 레포에 이미 있는 사실(진료 시간·위치·주차·버스 안내가 허브에 정리됨)만 쓴다.
 */
export const HUB_PATH = '/regions/myeongji'
export const HUB_ANCHOR = '명지 치과'

/** 문자열 → 0 이상 정수 (djb2). 같은 slug 는 항상 같은 문형 */
export function slugHash(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

/** 블로그 본문 끝 지역 안내 문장: [앞, 뒤] — 가운데에 허브 링크가 들어간다 */
const BLOG_LINES: [string, string][] = [
  ['이음치과의원은 ', '를 찾는 명지국제신도시·명지동 주민분들께 진료 시간과 찾아오는 길을 한 페이지에 정리해 안내합니다.'],
  ['이 글의 내용으로 상담을 받아 보고 싶으시다면, ', ' 안내 페이지에서 이음치과의원의 위치·주차·버스 정보를 먼저 확인해 보세요.'],
  ['명지 주민분들이 퇴근 뒤나 주말에 들르실 수 있도록, ', ' 안내에 이음치과의원의 요일별 진료 시간과 접수 마감 시각을 모아 두었습니다.'],
  ['가까운 ', '를 알아보고 계신 강서구 명지 이웃분들은 이음치과의원 진료 안내에서 의료진과 주요 진료를 함께 보실 수 있습니다.']
]

export function blogHubLine(slug: string): [string, string] {
  return BLOG_LINES[slugHash(slug || '') % BLOG_LINES.length]
}

/** 본문 HTML 에 이미 허브 링크가 있는지 (있으면 추가 블록 생략 → 페이지당 2개 이하 유지) */
export function htmlHasHubLink(html: string): boolean {
  return /href=["'](?:https?:\/\/(?:www\.)?ieumdc\.kr)?\/regions\/myeongji\/?["'#?]/i.test(html || '')
}
