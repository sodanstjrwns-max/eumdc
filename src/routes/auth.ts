import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { HonoEnv } from '../types'

const auth = new Hono<HonoEnv>()

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
  const secret = c.env.AUTH_SECRET || 'fallback-secret'
  
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
  
  const secret = c.env.AUTH_SECRET || 'fallback-secret'
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
    
    const secret = c.env.AUTH_SECRET || 'fallback-secret'
    const payload = await verifyHmacToken(session, secret)
    if (!payload || !payload.startsWith('eum-admin:')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
  }
}

// Utility exports for user routes
export { createHmacToken, verifyHmacToken }
