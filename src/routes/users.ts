import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { HonoEnv } from '../types'
import { createHmacToken, verifyHmacToken } from './auth'

const users = new Hono<HonoEnv>()

// === Simple password hashing (Web Crypto API compatible) ===
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'eum-dental-salt-2025')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password)
  return computed === hash
}

// === User Registration ===
users.post('/api/user/register', async (c) => {
  const body = await c.req.json()
  const { name, phone, password, email, birth_date, gender,
    agree_privacy, agree_terms, agree_marketing,
    agree_marketing_sms, agree_marketing_email, agree_third_party,
    referral_source } = body

  // Validate required fields
  if (!name || !phone || !password) {
    return c.json({ error: '이름, 전화번호, 비밀번호는 필수입니다.' }, 400)
  }
  if (!agree_privacy || !agree_terms) {
    return c.json({ error: '개인정보 수집·이용 동의와 이용약관 동의는 필수입니다.' }, 400)
  }

  // Phone format validation
  const phoneClean = phone.replace(/[^0-9]/g, '')
  if (phoneClean.length < 10 || phoneClean.length > 11) {
    return c.json({ error: '올바른 전화번호를 입력해주세요.' }, 400)
  }

  // Password length
  if (password.length < 6) {
    return c.json({ error: '비밀번호는 6자 이상이어야 합니다.' }, 400)
  }

  // Check duplicate phone
  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE phone = ?'
  ).bind(phoneClean).first()
  if (existing) {
    return c.json({ error: '이미 가입된 전화번호입니다.' }, 400)
  }

  const pwHash = await hashPassword(password)
  const hasMarketing = agree_marketing ? 1 : 0

  const result = await c.env.DB.prepare(
    `INSERT INTO users (name, phone, password_hash, email, birth_date, gender,
      agree_privacy, agree_terms, agree_marketing,
      agree_marketing_sms, agree_marketing_email, agree_third_party,
      marketing_agreed_at, referral_source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    name, phoneClean, pwHash, email || null, birth_date || null, gender || '',
    agree_privacy ? 1 : 0, agree_terms ? 1 : 0, hasMarketing,
    agree_marketing_sms ? 1 : 0, agree_marketing_email ? 1 : 0, agree_third_party ? 1 : 0,
    hasMarketing ? new Date().toISOString() : null,
    referral_source || ''
  ).run()

  // Auto-login after registration (HMAC signed token)
  const userId = result.meta.last_row_id
  const secret = c.env.AUTH_SECRET || 'fallback-secret'
  const token = await createHmacToken(`eum-user:${userId}:${Date.now()}`, secret)
  setCookie(c, 'eum_user', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  })

  return c.json({ ok: true, id: userId, name }, 201)
})

// === User Login ===
users.post('/api/user/login', async (c) => {
  const { phone, password } = await c.req.json()
  if (!phone || !password) {
    return c.json({ error: '전화번호와 비밀번호를 입력해주세요.' }, 400)
  }

  const phoneClean = phone.replace(/[^0-9]/g, '')
  const user = await c.env.DB.prepare(
    'SELECT id, name, phone, password_hash, is_active FROM users WHERE phone = ?'
  ).bind(phoneClean).first() as any

  if (!user || !user.is_active) {
    return c.json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다.' }, 401)
  }

  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) {
    return c.json({ error: '전화번호 또는 비밀번호가 올바르지 않습니다.' }, 401)
  }

  // Update last_login
  await c.env.DB.prepare(
    'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(user.id).run()

  const secret = c.env.AUTH_SECRET || 'fallback-secret'
  const token = await createHmacToken(`eum-user:${user.id}:${Date.now()}`, secret)
  setCookie(c, 'eum_user', token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 30
  })

  return c.json({ ok: true, user: { id: user.id, name: user.name, phone: user.phone } })
})

// === User Logout ===
users.post('/api/user/logout', async (c) => {
  setCookie(c, 'eum_user', '', { path: '/', maxAge: 0 })
  return c.json({ ok: true })
})

// === Check Auth (public) ===
users.get('/api/user/check', async (c) => {
  const session = getCookie(c, 'eum_user')
  if (!session) return c.json({ authenticated: false })
  
  const secret = c.env.AUTH_SECRET || 'fallback-secret'
  const payload = await verifyHmacToken(session, secret)
  if (!payload) return c.json({ authenticated: false })
  
  try {
    if (payload.startsWith('eum-user:')) {
      const parts = payload.split(':')
      const userId = parseInt(parts[1])
      const user = await c.env.DB.prepare(
        'SELECT id, name, phone FROM users WHERE id = ? AND is_active = 1'
      ).bind(userId).first()
      if (user) {
        return c.json({ authenticated: true, user })
      }
    }
  } catch {}
  return c.json({ authenticated: false })
})

// === Admin: List users ===
users.get('/api/admin/users', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '30')
  const offset = (page - 1) * limit

  const { results } = await c.env.DB.prepare(
    `SELECT id, name, phone, email, gender, birth_date, role,
            agree_marketing, agree_marketing_sms, agree_marketing_email,
            agree_third_party, marketing_agreed_at, referral_source,
            is_active, last_login_at, created_at
     FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(limit, offset).all()

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM users'
  ).first()

  return c.json({ users: results, total: (countResult as any)?.total || 0, page, limit })
})

// === Admin: User stats ===
users.get('/api/admin/stats', async (c) => {
  const totalUsers = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users').first() as any
  const marketingUsers = await c.env.DB.prepare('SELECT COUNT(*) as c FROM users WHERE agree_marketing = 1').first() as any
  const totalCases = await c.env.DB.prepare('SELECT COUNT(*) as c FROM cases').first() as any
  const totalBlogs = await c.env.DB.prepare('SELECT COUNT(*) as c FROM blogs').first() as any
  const totalNotices = await c.env.DB.prepare('SELECT COUNT(*) as c FROM notices').first() as any
  const totalFaqs = await c.env.DB.prepare('SELECT COUNT(*) as c FROM faqs').first() as any
  const totalReservations = await c.env.DB.prepare("SELECT COUNT(*) as c FROM reservations WHERE status = 'pending'").first() as any
  const totalViews = await c.env.DB.prepare('SELECT SUM(views) as c FROM cases').first() as any
  const blogViews = await c.env.DB.prepare('SELECT SUM(views) as c FROM blogs').first() as any
  const faqViews = await c.env.DB.prepare('SELECT SUM(views) as c FROM faqs').first() as any

  // Recent registrations (last 7 days)
  const recentUsers = await c.env.DB.prepare(
    "SELECT COUNT(*) as c FROM users WHERE created_at >= datetime('now', '-7 days')"
  ).first() as any

  return c.json({
    users: totalUsers?.c || 0,
    users_marketing: marketingUsers?.c || 0,
    users_recent_7d: recentUsers?.c || 0,
    cases: totalCases?.c || 0,
    blogs: totalBlogs?.c || 0,
    notices: totalNotices?.c || 0,
    faqs: totalFaqs?.c || 0,
    reservations_pending: totalReservations?.c || 0,
    case_views: totalViews?.c || 0,
    blog_views: blogViews?.c || 0,
    faq_views: faqViews?.c || 0
  })
})

export default users
