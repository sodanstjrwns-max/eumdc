import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const faq = new Hono<HonoEnv>()

// === PUBLIC: List categories ===
faq.get('/api/faq/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM faq_categories ORDER BY sort_order'
  ).all()
  return c.json({ categories: results })
})

// === PUBLIC: List FAQs (optionally by category) ===
faq.get('/api/faq', async (c) => {
  const category = c.req.query('category')
  const search = c.req.query('search')

  let sql = `
    SELECT f.*, fc.name as category_name, fc.slug as category_slug, fc.icon as category_icon
    FROM faqs f
    JOIN faq_categories fc ON f.category_id = fc.id
    WHERE f.is_published = 1
  `
  const params: any[] = []

  if (category && category !== 'all') {
    sql += ' AND fc.slug = ?'
    params.push(category)
  }

  if (search) {
    sql += ' AND (f.question LIKE ? OR f.answer LIKE ?)'
    params.push(`%${search}%`, `%${search}%`)
  }

  sql += ' ORDER BY fc.sort_order, f.sort_order'

  const stmt = c.env.DB.prepare(sql)
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()

  // Group by category
  const grouped: Record<string, { category: any; faqs: any[] }> = {}
  for (const item of results as any[]) {
    const slug = item.category_slug
    if (!grouped[slug]) {
      grouped[slug] = {
        category: {
          id: item.category_id,
          name: item.category_name,
          slug: item.category_slug,
          icon: item.category_icon
        },
        faqs: []
      }
    }
    grouped[slug].faqs.push({
      id: item.id,
      question: item.question,
      answer: item.answer,
      views: item.views,
      sort_order: item.sort_order
    })
  }

  return c.json({
    groups: Object.values(grouped),
    total: (results as any[]).length
  })
})

// === PUBLIC: Increment FAQ view (중복 방지) ===
faq.post('/api/faq/:id/view', async (c) => {
  const id = c.req.param('id')
  const { incrementView } = await import('./views')
  await incrementView(c, 'faq', id, 'faqs')
  return c.json({ ok: true })
})

// === ADMIN: List all FAQs ===
faq.get('/api/admin/faq', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT f.*, fc.name as category_name, fc.slug as category_slug
    FROM faqs f
    JOIN faq_categories fc ON f.category_id = fc.id
    ORDER BY fc.sort_order, f.sort_order
  `).all()

  const { results: categories } = await c.env.DB.prepare(
    'SELECT * FROM faq_categories ORDER BY sort_order'
  ).all()

  return c.json({ faqs: results, categories })
})

// === ADMIN: Create FAQ ===
faq.post('/api/admin/faq', async (c) => {
  const { category_id, question, answer, sort_order } = await c.req.json()

  const result = await c.env.DB.prepare(
    'INSERT INTO faqs (category_id, question, answer, sort_order) VALUES (?, ?, ?, ?)'
  ).bind(category_id, question, answer, sort_order || 0).run()

  return c.json({ id: result.meta.last_row_id }, 201)
})

// === ADMIN: Update FAQ ===
faq.put('/api/admin/faq/:id', async (c) => {
  const id = c.req.param('id')
  const { category_id, question, answer, sort_order, is_published } = await c.req.json()

  await c.env.DB.prepare(
    `UPDATE faqs SET category_id=?, question=?, answer=?, sort_order=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(category_id, question, answer, sort_order || 0, is_published ?? 1, id).run()

  return c.json({ ok: true })
})

// === ADMIN: Delete FAQ ===
faq.delete('/api/admin/faq/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM faqs WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

// === ADMIN: Create category ===
faq.post('/api/admin/faq/categories', async (c) => {
  const { name, slug, icon, sort_order } = await c.req.json()
  const result = await c.env.DB.prepare(
    'INSERT INTO faq_categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)'
  ).bind(name, slug, icon || '', sort_order || 0).run()
  return c.json({ id: result.meta.last_row_id }, 201)
})

// === ADMIN: Delete category ===
faq.delete('/api/admin/faq/categories/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM faq_categories WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default faq
