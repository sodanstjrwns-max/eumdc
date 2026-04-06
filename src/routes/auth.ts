import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { HonoEnv } from '../types'

const auth = new Hono<HonoEnv>()

// Simple session-based auth
auth.post('/api/admin/login', async (c) => {
  const { password } = await c.req.json()
  if (password === c.env.ADMIN_PASSWORD) {
    // Simple token: base64 of password + timestamp
    const token = btoa(`eum-admin:${Date.now()}`)
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
  try {
    const decoded = atob(session)
    if (decoded.startsWith('eum-admin:')) {
      return c.json({ authenticated: true })
    }
  } catch {}
  return c.json({ authenticated: false }, 401)
})

export default auth

// Middleware for admin routes
export function requireAdmin() {
  return async (c: any, next: any) => {
    const session = getCookie(c, 'eum_session')
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    try {
      const decoded = atob(session)
      if (!decoded.startsWith('eum-admin:')) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
    } catch {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    await next()
  }
}
