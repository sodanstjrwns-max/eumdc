/**
 * 🔥 통합 자동 색인 시스템 (Google + Bing + Yandex 3대 검색엔진 병렬 핑)
 *
 * 콘텐츠 발행/수정 시 호출:
 *  - Google Indexing API → 1시간 내 크롤링 보장
 *  - IndexNow (Bing/Yandex/Seznam) → 24-48시간 내 색인
 *
 * 두 API는 병렬 실행되며, 한 쪽 실패가 다른 쪽에 영향 주지 않음.
 */

import { pingIndexNow, IndexNowResult } from './indexnow'
import {
  googleIndexingPing,
  IndexingResult,
  isGoogleIndexingConfigured
} from './google-indexing'

export interface AutoIndexResult {
  /** Google Indexing API 결과 (서비스 계정 미설정 시 success=false + 설명 메시지) */
  google: IndexingResult & { configured: boolean }
  /** IndexNow (Bing/Yandex) 결과 */
  indexnow: IndexNowResult
  /** 둘 중 하나라도 성공했는지 */
  anySuccess: boolean
  /** 색인 요청한 콘텐츠 URL */
  url: string
}

/**
 * 🎯 메인 함수: 콘텐츠 발행 시 모든 검색엔진에 동시 핑
 *
 * @param env Cloudflare bindings
 * @param contentUrl 발행/수정된 콘텐츠 절대 URL
 * @param host 호스트명 (기본: ieumdc.kr)
 */
export async function autoIndexOnPublish(
  env: any,
  contentUrl: string,
  host: string = 'ieumdc.kr'
): Promise<AutoIndexResult> {
  const configured = isGoogleIndexingConfigured(env)

  // 🚀 Google + IndexNow 병렬 실행 (한쪽 실패가 다른쪽 막지 않음)
  const [googleResult, indexnowResult] = await Promise.all([
    // Google Indexing API (1시간 내 크롤 보장)
    configured
      ? googleIndexingPing(env, contentUrl, 'URL_UPDATED').catch(e => ({
          success: false,
          url: contentUrl,
          notifyType: 'URL_UPDATED' as const,
          error: e?.message || String(e)
        }))
      : Promise.resolve({
          success: false,
          url: contentUrl,
          notifyType: 'URL_UPDATED' as const,
          error: 'Google Indexing API 미설정 (GOOGLE_INDEXING_SERVICE_ACCOUNT 환경변수 필요)'
        }),

    // IndexNow (Bing/Yandex)
    pingIndexNow(
      [contentUrl, `https://${host}/sitemap.xml`, `https://${host}/`],
      host
    ).catch(e => ({
      success: false,
      message: e?.message || String(e),
      urlList: [contentUrl]
    }))
  ])

  return {
    google: { ...googleResult, configured },
    indexnow: indexnowResult,
    anySuccess: googleResult.success || indexnowResult.success,
    url: contentUrl
  }
}

/**
 * 콘텐츠 삭제 시 Google에 URL_DELETED 알림
 * (IndexNow는 삭제 알림 미지원 — sitemap 갱신으로 자연 정리됨)
 */
export async function autoIndexOnDelete(
  env: any,
  contentUrl: string
): Promise<{ google: IndexingResult & { configured: boolean } }> {
  const configured = isGoogleIndexingConfigured(env)

  if (!configured) {
    return {
      google: {
        success: false,
        url: contentUrl,
        notifyType: 'URL_DELETED',
        error: 'Google Indexing API 미설정',
        configured: false
      }
    }
  }

  const result = await googleIndexingPing(env, contentUrl, 'URL_DELETED').catch(e => ({
    success: false,
    url: contentUrl,
    notifyType: 'URL_DELETED' as const,
    error: e?.message || String(e)
  }))

  return { google: { ...result, configured } }
}
