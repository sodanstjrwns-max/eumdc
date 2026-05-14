// =============================================
// IndexNow 자동 핑 시스템
// Bing, Yandex, Seznam 즉시 인덱싱 트리거 (Google은 사이트맵 lastmod로 처리)
// 발행/수정 시 자동 호출
// =============================================

// IndexNow API 키 — 사이트 루트에 ${KEY}.txt 파일로 노출해야 인증됨
// 32~64자 hex 문자열, 한 번 정하면 변경 비권장
export const INDEXNOW_KEY = '7a4e9c2b3f1d8e6a5c0b9d2e4f6a8c1b3d5e7f9a2c4b6d8e0f1a3c5b7d9e2f4a'

// IndexNow 엔드포인트 (Bing이 대표 — 한 번 핑하면 Yandex 등에 전파됨)
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'

export interface IndexNowResult {
  success: boolean
  status?: number
  message?: string
  urlList: string[]
}

/**
 * 단일 또는 다중 URL을 IndexNow로 핑
 * @param urls 인덱싱 요청할 URL 배열 (절대 URL, 최대 10,000개)
 * @param host 호스트명 (e.g., 'ieumdc.kr')
 */
export async function pingIndexNow(
  urls: string[],
  host: string = 'ieumdc.kr'
): Promise<IndexNowResult> {
  if (!urls || urls.length === 0) {
    return { success: false, message: 'No URLs provided', urlList: [] }
  }
  // URL 정규화 (https 보장, host 일치 확인)
  const cleanUrls = urls
    .map(u => u.startsWith('http') ? u : `https://${host}${u.startsWith('/') ? u : '/' + u}`)
    .filter(u => u.includes(host))
  if (cleanUrls.length === 0) {
    return { success: false, message: 'No valid URLs after filtering', urlList: [] }
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
        urlList: cleanUrls
      })
    })
    // IndexNow는 200/202 = 성공, 422 = 키 검증 실패, 429 = 너무 많은 요청
    return {
      success: res.status === 200 || res.status === 202,
      status: res.status,
      message: res.statusText,
      urlList: cleanUrls
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'fetch failed',
      urlList: cleanUrls
    }
  }
}

/**
 * 신규/수정 콘텐츠 발행 시 자동 핑 (블로그/케이스/공지)
 * - 본인 URL + sitemap URL 같이 핑
 * - 실패해도 발행 자체는 막지 않음 (백그라운드 실행)
 */
export async function autoPingOnPublish(
  contentUrl: string,
  host: string = 'ieumdc.kr'
): Promise<IndexNowResult> {
  const urls = [
    contentUrl,
    `https://${host}/sitemap.xml`,
    `https://${host}/`
  ]
  return pingIndexNow(urls, host)
}
