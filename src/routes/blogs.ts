import { Hono } from 'hono'
import type { HonoEnv } from '../types'
import { incrementView } from './views'

const blogs = new Hono<HonoEnv>()

// List blogs (public)
blogs.get('/api/blogs', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '12')
  const offset = (page - 1) * limit

  const { results } = await c.env.DB.prepare(
    'SELECT id, title, content, thumbnail, meta_title, meta_description, slug, views, created_at FROM blogs WHERE is_published = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).bind(limit, offset).all()

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM blogs WHERE is_published = 1'
  ).first()

  return c.json({ blogs: results, total: (countResult as any)?.total || 0, page, limit })
})

// Get single blog + images + increment views
blogs.get('/api/blogs/:id', async (c) => {
  const id = c.req.param('id')
  await incrementView(c, 'blog', id, 'blogs')

  const blog = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first()
  if (!blog) return c.notFound()

  const { results: images } = await c.env.DB.prepare(
    'SELECT * FROM blog_images WHERE blog_id = ? ORDER BY sort_order'
  ).bind(id).all()

  return c.json({ ...blog, images })
})

// Admin: list all
blogs.get('/api/admin/blogs', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM blogs ORDER BY created_at DESC'
  ).all()
  return c.json({ blogs: results })
})

// Create blog (with SEO + rich content + author)
blogs.post('/api/admin/blogs', async (c) => {
  const body = await c.req.json()
  const { title, content, content_html, thumbnail, images, meta_title, meta_description, slug, author_name, doctor_id } = body

  const result = await c.env.DB.prepare(
    'INSERT INTO blogs (title, content, content_html, thumbnail, meta_title, meta_description, slug, author_name, doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    title || '', content || '', content_html || null,
    thumbnail || null, meta_title || null, meta_description || null, slug || null,
    author_name || '최효영', doctor_id || null
  ).run()

  const blogId = result.meta.last_row_id

  // Insert images
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await c.env.DB.prepare(
        'INSERT INTO blog_images (blog_id, image_url, sort_order) VALUES (?, ?, ?)'
      ).bind(blogId, images[i], i).run()
    }
  }

  return c.json({ id: blogId }, 201)
})

// Update blog (partial update supported)
blogs.put('/api/admin/blogs/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()

  // Fetch existing record for partial update
  const existing = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first() as any
  if (!existing) return c.notFound()

  const title = body.title ?? existing.title
  const content = body.content ?? existing.content
  const content_html = body.content_html ?? existing.content_html
  const thumbnail = body.thumbnail ?? existing.thumbnail
  const meta_title = body.meta_title ?? existing.meta_title
  const meta_description = body.meta_description ?? existing.meta_description
  const slug = body.slug ?? existing.slug
  const author_name = body.author_name ?? existing.author_name ?? '최효영'
  const doctor_id = body.doctor_id ?? existing.doctor_id
  const is_published = body.is_published ?? existing.is_published

  await c.env.DB.prepare(
    `UPDATE blogs SET title=?, content=?, content_html=?, thumbnail=?,
     meta_title=?, meta_description=?, slug=?, author_name=?, doctor_id=?,
     is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    title, content, content_html || null, thumbnail || null,
    meta_title || null, meta_description || null, slug || null,
    author_name || '최효영', doctor_id || null,
    is_published ?? 1, id
  ).run()

  // Replace images if provided
  if (body.images !== undefined) {
    await c.env.DB.prepare('DELETE FROM blog_images WHERE blog_id = ?').bind(id).run()
    for (let i = 0; i < body.images.length; i++) {
      await c.env.DB.prepare(
        'INSERT INTO blog_images (blog_id, image_url, sort_order) VALUES (?, ?, ?)'
      ).bind(id, body.images[i], i).run()
    }
  }

  return c.json({ ok: true })
})

// Delete blog
blogs.delete('/api/admin/blogs/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM blog_images WHERE blog_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM blogs WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default blogs
