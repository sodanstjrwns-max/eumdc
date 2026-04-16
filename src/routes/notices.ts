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
    'SELECT id, title, content, thumbnail, is_pinned, views, created_at FROM notices WHERE is_published = 1 ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all()

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM notices WHERE is_published = 1'
  ).first()

  return c.json({ notices: results, total: (countResult as any)?.total || 0, page, limit })
})

// Get single notice + images + increment views
notices.get('/api/notices/:id', async (c) => {
  const id = c.req.param('id')
  await incrementView(c, 'notice', id, 'notices')
  const result = await c.env.DB.prepare('SELECT * FROM notices WHERE id = ?').bind(id).first()
  if (!result) return c.notFound()

  // Get notice images
  const { results: images } = await c.env.DB.prepare(
    'SELECT * FROM notice_images WHERE notice_id = ? ORDER BY sort_order'
  ).bind(id).all()

  return c.json({ ...(result as any), images })
})

// Admin: list all
notices.get('/api/admin/notices', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM notices ORDER BY created_at DESC'
  ).all()
  return c.json({ notices: results })
})

// Create notice (with thumbnail + images)
notices.post('/api/admin/notices', async (c) => {
  const body = await c.req.json()
  const { title, content, thumbnail, images } = body
  const is_pinned = body.is_pinned ?? body.pinned ?? 0

  // Generate content_html from content
  const contentHtml = (content || '').split('\n').filter((l: string) => l.trim()).map((l: string) => `<p>${l}</p>`).join('\n')

  const result = await c.env.DB.prepare(
    'INSERT INTO notices (title, content, content_html, thumbnail, is_pinned) VALUES (?, ?, ?, ?, ?)'
  ).bind(title || '', content || '', contentHtml, thumbnail || null, is_pinned ? 1 : 0).run()

  const noticeId = result.meta.last_row_id

  // Insert images
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await c.env.DB.prepare(
        'INSERT INTO notice_images (notice_id, image_url, sort_order) VALUES (?, ?, ?)'
      ).bind(noticeId, images[i], i).run()
    }
  }

  return c.json({ id: noticeId }, 201)
})

// Update notice (partial update supported)
notices.put('/api/admin/notices/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  // Fetch existing record for partial update
  const existing = await c.env.DB.prepare('SELECT * FROM notices WHERE id = ?').bind(id).first() as any
  if (!existing) return c.notFound()

  const title = body.title ?? existing.title
  const content = body.content ?? existing.content
  const is_pinned = body.is_pinned ?? body.pinned ?? existing.is_pinned
  const is_published = body.is_published ?? existing.is_published
  const thumbnail = body.thumbnail ?? existing.thumbnail

  const contentHtml = (content || '').split('\n').filter((l: string) => l.trim()).map((l: string) => `<p>${l}</p>`).join('\n')

  await c.env.DB.prepare(
    'UPDATE notices SET title=?, content=?, content_html=?, thumbnail=?, is_pinned=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).bind(title, content, contentHtml, thumbnail || null, is_pinned ? 1 : 0, is_published ?? 1, id).run()

  // Replace images if provided
  if (body.images !== undefined) {
    await c.env.DB.prepare('DELETE FROM notice_images WHERE notice_id = ?').bind(id).run()
    for (let i = 0; i < body.images.length; i++) {
      await c.env.DB.prepare(
        'INSERT INTO notice_images (notice_id, image_url, sort_order) VALUES (?, ?, ?)'
      ).bind(id, body.images[i], i).run()
    }
  }

  return c.json({ ok: true })
})

// Delete notice
notices.delete('/api/admin/notices/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM notice_images WHERE notice_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default notices
