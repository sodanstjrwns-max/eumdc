import { Hono } from 'hono'
import type { HonoEnv } from '../types'
import { incrementView } from './views'

const notices = new Hono<HonoEnv>()

// List notices (public)
notices.get('/api/notices', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM notices WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all()

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM notices WHERE is_published = 1'
  ).first()

  return c.json({ notices: results, total: (countResult as any)?.total || 0, page, limit })
})

// Get single notice + increment views
notices.get('/api/notices/:id', async (c) => {
  const id = c.req.param('id')
  await incrementView(c, 'notice', id, 'notices')
  const result = await c.env.DB.prepare('SELECT * FROM notices WHERE id = ?').bind(id).first()
  if (!result) return c.notFound()
  return c.json(result)
})

// Admin: list all
notices.get('/api/admin/notices', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM notices ORDER BY created_at DESC'
  ).all()
  return c.json({ notices: results })
})

// Create notice
notices.post('/api/admin/notices', async (c) => {
  const body = await c.req.json()
  const { title, content, is_pinned } = body

  const result = await c.env.DB.prepare(
    'INSERT INTO notices (title, content, is_pinned) VALUES (?, ?, ?)'
  ).bind(title || '', content || '', is_pinned ? 1 : 0).run()

  return c.json({ id: result.meta.last_row_id }, 201)
})

// Update notice
notices.put('/api/admin/notices/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { title, content, is_pinned, is_published } = body

  await c.env.DB.prepare(
    'UPDATE notices SET title=?, content=?, is_pinned=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).bind(title, content, is_pinned ? 1 : 0, is_published ?? 1, id).run()

  return c.json({ ok: true })
})

// Delete notice
notices.delete('/api/admin/notices/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default notices
