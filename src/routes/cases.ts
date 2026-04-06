import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const cases = new Hono<HonoEnv>()

// List cases (public)
cases.get('/api/cases', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '12')
  const offset = (page - 1) * limit

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM cases WHERE is_published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all()

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM cases WHERE is_published = 1'
  ).first()

  return c.json({ cases: results, total: (countResult as any)?.total || 0, page, limit })
})

// Get single case + increment views
cases.get('/api/cases/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('UPDATE cases SET views = views + 1 WHERE id = ?').bind(id).run()
  const result = await c.env.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(id).first()
  if (!result) return c.notFound()
  return c.json(result)
})

// Admin: list all (incl unpublished)
cases.get('/api/admin/cases', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM cases ORDER BY created_at DESC'
  ).all()
  return c.json({ cases: results })
})

// Create case
cases.post('/api/admin/cases', async (c) => {
  const body = await c.req.json()
  const { title, category, description, pano_before, pano_after, intra_before, intra_after } = body

  const result = await c.env.DB.prepare(
    `INSERT INTO cases (title, category, description, pano_before, pano_after, intra_before, intra_after)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    title || '', category || 'implant', description || '',
    pano_before || null, pano_after || null,
    intra_before || null, intra_after || null
  ).run()

  return c.json({ id: result.meta.last_row_id }, 201)
})

// Update case
cases.put('/api/admin/cases/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { title, category, description, pano_before, pano_after, intra_before, intra_after, is_published } = body

  await c.env.DB.prepare(
    `UPDATE cases SET title=?, category=?, description=?, pano_before=?, pano_after=?, intra_before=?, intra_after=?, is_published=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).bind(
    title, category, description,
    pano_before || null, pano_after || null,
    intra_before || null, intra_after || null,
    is_published ?? 1, id
  ).run()

  return c.json({ ok: true })
})

// Delete case
cases.delete('/api/admin/cases/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM cases WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default cases
