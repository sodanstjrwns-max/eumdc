import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { HonoEnv } from '../types'

const auth = new Hono<HonoEnv>()

// === Fail-closed secret 취득 ===
// AUTH_SECRET 미설정 시 공개된 fallback 문자열로 서명하면 누구나 쿠키 위조 가능.
// 미설정이면 null을 반환해 인증을 전부 거부한다(fail-closed).
function getAuthSecret(env: { AUTH_SECRET?: string }): string | null {
  const s = env.AUTH_SECRET
  return s && s.length >= 16 ? s : null
}

// === 로그인 브루트포스 방어 (D1 기반, IP당 15분 윈도우 10회) ===
const LOGIN_MAX_ATTEMPTS = 10
const LOGIN_WINDOW_MS = 15 * 60 * 1000

async function checkLoginRateLimit(db: D1Database, ip: string): Promise<boolean> {
  try {
    await db.prepare(`CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, window_start INTEGER NOT NULL
    )`).run()
    const now = Date.now()
    const row = await db.prepare('SELECT count, window_start FROM login_attempts WHERE ip = ?')
      .bind(ip).first() as { count: number; window_start: number } | null
    if (!row || now - row.window_start > LOGIN_WINDOW_MS) {
      await db.prepare('INSERT OR REPLACE INTO login_attempts (ip, count, window_start) VALUES (?, 1, ?)')
        .bind(ip, now).run()
      return true
    }
    if (row.count >= LOGIN_MAX_ATTEMPTS) return false
    await db.prepare('UPDATE login_attempts SET count = count + 1 WHERE ip = ?').bind(ip).run()
    return true
  } catch {
    return true // rate limit 인프라 오류가 정상 로그인을 막지 않도록
  }
}

function clientIp(c: any): string {
  return c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

// === HMAC Token Utilities (Web Crypto API) ===
async function createHmacToken(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const sig = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
  return btoa(`${payload}.${sig}`)
}

async function verifyHmacToken(token: string, secret: string): Promise<string | null> {
  try {
    const decoded = atob(token)
    const lastDot = decoded.lastIndexOf('.')
    if (lastDot === -1) return null
    const payload = decoded.substring(0, lastDot)
    const sig = decoded.substring(lastDot + 1)
    
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )
    const sigBytes = new Uint8Array(sig.match(/.{2}/g)!.map(b => parseInt(b, 16)))
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload))
    return valid ? payload : null
  } catch {
    return null
  }
}

// Admin Login
auth.post('/api/admin/login', async (c) => {
  const { password } = await c.req.json()
  const secret = getAuthSecret(c.env)
  if (!secret || !c.env.ADMIN_PASSWORD) {
    return c.json({ error: '서버 인증 설정이 누락되었습니다. 관리자에게 문의하세요.' }, 503)
  }

  const ip = clientIp(c)
  const allowed = await checkLoginRateLimit(c.env.DB, ip)
  if (!allowed) {
    return c.json({ error: '로그인 시도가 너무 많습니다. 15분 후 다시 시도해주세요.' }, 429)
  }

  if (password === c.env.ADMIN_PASSWORD) {
    const payload = `eum-admin:${Date.now()}`
    const token = await createHmacToken(payload, secret)
    setCookie(c, 'eum_session', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    return c.json({ ok: true })
  }
  return c.json({ error: 'Invalid password' }, 401)
})

auth.post('/api/admin/logout', async (c) => {
  setCookie(c, 'eum_session', '', { path: '/', maxAge: 0 })
  return c.json({ ok: true })
})

auth.get('/api/admin/check', async (c) => {
  const session = getCookie(c, 'eum_session')
  if (!session) return c.json({ authenticated: false }, 401)

  const secret = getAuthSecret(c.env)
  if (!secret) return c.json({ authenticated: false }, 401)
  const payload = await verifyHmacToken(session, secret)
  if (payload && payload.startsWith('eum-admin:')) {
    return c.json({ authenticated: true })
  }
  return c.json({ authenticated: false }, 401)
})

export default auth

// Middleware for admin routes
export function requireAdmin() {
  return async (c: any, next: any) => {
    const session = getCookie(c, 'eum_session')
    if (!session) return c.json({ error: 'Unauthorized' }, 401)

    const secret = getAuthSecret(c.env)
    if (!secret) return c.json({ error: 'Unauthorized' }, 401)
    const payload = await verifyHmacToken(session, secret)
    if (!payload || !payload.startsWith('eum-admin:')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
  }
}

// Utility exports for user routes
export { createHmacToken, verifyHmacToken, getAuthSecret, checkLoginRateLimit, clientIp }
