/**
 * 🚀 Google Indexing API 클라이언트 (Cloudflare Workers 호환)
 *
 * Node.js googleapis 라이브러리는 Workers 환경에서 동작하지 않으므로
 * Web Crypto API로 JWT를 직접 서명하여 OAuth2 토큰을 발급받습니다.
 *
 * 사용법:
 *   const result = await googleIndexingPing(env, url, 'URL_UPDATED')
 *
 * 환경변수: GOOGLE_INDEXING_SERVICE_ACCOUNT (서비스 계정 JSON 키 전체)
 *
 * Quota: 하루 200 URL (무료)
 * 응답속도: 일반적으로 1~3초 (구글 토큰 발급 + API 호출)
 */

interface ServiceAccountKey {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}

export type IndexingNotificationType = 'URL_UPDATED' | 'URL_DELETED'

export interface IndexingResult {
  success: boolean
  url: string
  notifyType: IndexingNotificationType
  status?: number
  error?: string
  notifyTime?: string  // Google 응답에 포함되는 알림 시각
}

/**
 * Base64URL 인코딩 (JWT용 — '+', '/', '=' 제거)
 */
function base64UrlEncode(input: string | Uint8Array): string {
  let b64: string
  if (typeof input === 'string') {
    b64 = btoa(unescape(encodeURIComponent(input)))
  } else {
    b64 = btoa(String.fromCharCode(...input))
  }
  return b64.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
}

/**
 * PEM 형식 private key를 Uint8Array(DER)로 변환
 * (Web Crypto API의 importKey는 DER만 받음)
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleaned = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '')
  const binary = atob(cleaned)
  const buffer = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i)
  }
  return buffer.buffer
}

/**
 * 서비스 계정 JSON 키로 OAuth2 access token 발급
 */
async function getAccessToken(serviceAccount: ServiceAccountKey): Promise<string> {
  const now = Math.floor(Date.now() / 1000)

  // 1) JWT 헤더
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: serviceAccount.private_key_id
  }

  // 2) JWT 페이로드 (Indexing API 스코프)
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600  // 1시간 유효
  }

  const headerB64 = base64UrlEncode(JSON.stringify(header))
  const payloadB64 = base64UrlEncode(JSON.stringify(payload))
  const signingInput = `${headerB64}.${payloadB64}`

  // 3) RSA-SHA256으로 서명 (Web Crypto API)
  const keyBuffer = pemToArrayBuffer(serviceAccount.private_key)
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  )

  const signatureB64 = base64UrlEncode(new Uint8Array(signature))
  const jwt = `${signingInput}.${signatureB64}`

  // 4) JWT를 access token으로 교환
  const tokenRes = await fetch(serviceAccount.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  })

  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    throw new Error(`Google OAuth token request failed (${tokenRes.status}): ${errText.slice(0, 300)}`)
  }

  const tokenData = await tokenRes.json() as { access_token?: string; error?: string; error_description?: string }
  if (!tokenData.access_token) {
    throw new Error(`No access_token in response: ${JSON.stringify(tokenData)}`)
  }

  return tokenData.access_token
}

/**
 * 서비스 계정 JSON을 환경변수에서 파싱
 */
function parseServiceAccount(rawJson: string | undefined): ServiceAccountKey | null {
  if (!rawJson) return null
  try {
    const parsed = JSON.parse(rawJson)
    if (!parsed.client_email || !parsed.private_key) {
      console.error('[GoogleIndexing] Invalid service account JSON (missing client_email or private_key)')
      return null
    }
    return parsed as ServiceAccountKey
  } catch (e) {
    console.error('[GoogleIndexing] Failed to parse service account JSON:', e)
    return null
  }
}

/**
 * 🎯 메인 함수: Google에 URL 색인 요청 ping
 *
 * @param env Cloudflare bindings (GOOGLE_INDEXING_SERVICE_ACCOUNT 환경변수 필요)
 * @param url 색인 요청할 URL (절대 URL)
 * @param notifyType 'URL_UPDATED' (신규/수정) 또는 'URL_DELETED' (삭제)
 */
export async function googleIndexingPing(
  env: any,
  url: string,
  notifyType: IndexingNotificationType = 'URL_UPDATED'
): Promise<IndexingResult> {
  const serviceAccount = parseServiceAccount(env?.GOOGLE_INDEXING_SERVICE_ACCOUNT)

  if (!serviceAccount) {
    return {
      success: false,
      url,
      notifyType,
      error: 'GOOGLE_INDEXING_SERVICE_ACCOUNT 환경변수가 설정되지 않았거나 형식이 올바르지 않습니다.'
    }
  }

  try {
    const accessToken = await getAccessToken(serviceAccount)

    const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, type: notifyType })
    })

    const data = await res.json() as any

    if (!res.ok) {
      return {
        success: false,
        url,
        notifyType,
        status: res.status,
        error: data?.error?.message || `HTTP ${res.status}`
      }
    }

    return {
      success: true,
      url,
      notifyType,
      status: res.status,
      notifyTime: data?.urlNotificationMetadata?.latestUpdate?.notifyTime
    }
  } catch (e: any) {
    return {
      success: false,
      url,
      notifyType,
      error: e?.message || String(e)
    }
  }
}

/**
 * 여러 URL 한번에 핑 (Google Indexing API는 batch 엔드포인트가 있지만 인증이 복잡하므로
 * 단순 병렬 Promise.all로 처리. Quota 하루 200이라 충분)
 */
export async function googleIndexingPingMany(
  env: any,
  urls: string[],
  notifyType: IndexingNotificationType = 'URL_UPDATED'
): Promise<IndexingResult[]> {
  const results = await Promise.all(
    urls.map(url => googleIndexingPing(env, url, notifyType))
  )
  return results
}

/**
 * Google Indexing API 설정 여부 확인 (UI에 상태 표시용)
 */
export function isGoogleIndexingConfigured(env: any): boolean {
  return !!parseServiceAccount(env?.GOOGLE_INDEXING_SERVICE_ACCOUNT)
}
