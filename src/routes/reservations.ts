import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const reservations = new Hono<HonoEnv>()

// === PUBLIC: 예약 문의 접수 ===
reservations.post('/api/reservations', async (c) => {
  const body = await c.req.json()
  const { name, phone, treatment_type, preferred_date, preferred_time, message, user_id } = body

  if (!name || !phone) {
    return c.json({ error: '이름과 전화번호는 필수입니다.' }, 400)
  }

  const phoneClean = phone.replace(/[^0-9]/g, '')
  if (phoneClean.length < 10 || phoneClean.length > 11) {
    return c.json({ error: '올바른 전화번호를 입력해주세요.' }, 400)
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO reservations (name, phone, treatment_type, preferred_date, preferred_time, message, user_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    name, phoneClean,
    treatment_type || '',
    preferred_date || null,
    preferred_time || null,
    message || '',
    user_id || null
  ).run()

  return c.json({ ok: true, id: result.meta.last_row_id }, 201)
})

// === ADMIN: 예약 목록 ===
reservations.get('/api/admin/reservations', async (c) => {
  const status = c.req.query('status') || ''
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '30')
  const offset = (page - 1) * limit

  let sql = 'SELECT * FROM reservations'
  const params: any[] = []

  if (status) {
    sql += ' WHERE status = ?'
    params.push(status)
  }
  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)

  const stmt = c.env.DB.prepare(sql)
  const { results } = params.length > 2
    ? await stmt.bind(...params).all()
    : await stmt.bind(limit, offset).all()

  // Total count
  let countSql = 'SELECT COUNT(*) as total FROM reservations'
  const countParams: any[] = []
  if (status) {
    countSql += ' WHERE status = ?'
    countParams.push(status)
  }
  const countStmt = c.env.DB.prepare(countSql)
  const countResult = countParams.length > 0
    ? await countStmt.bind(...countParams).first()
    : await countStmt.first()

  return c.json({
    reservations: results,
    total: (countResult as any)?.total || 0,
    page, limit
  })
})

// === ADMIN: 예약 상태 변경 ===
reservations.put('/api/admin/reservations/:id', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()

  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
  if (!validStatuses.includes(status)) {
    return c.json({ error: '유효하지 않은 상태입니다.' }, 400)
  }

  await c.env.DB.prepare(
    'UPDATE reservations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
  ).bind(status, id).run()

  return c.json({ ok: true })
})

// === ADMIN: 예약 삭제 ===
reservations.delete('/api/admin/reservations/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM reservations WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default reservations
