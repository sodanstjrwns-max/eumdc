import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const prices = new Hono<HonoEnv>()

// === ADMIN: 전체 수가 항목 + 진료과목 목록 ===
// 공개/비공개 상관없이 모두 반환 (편집용)
prices.get('/api/admin/prices', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT pg.*, t.name as treatment_name, t.slug as treatment_slug
    FROM price_guide pg
    LEFT JOIN treatments t ON pg.treatment_id = t.id
    ORDER BY t.sort_order, pg.sort_order, pg.id
  `).all()

  const { results: treatments } = await c.env.DB.prepare(
    'SELECT id, name, slug, sort_order FROM treatments ORDER BY sort_order'
  ).all()

  return c.json({ prices: results, treatments })
})

// === ADMIN: 수가 항목 생성 ===
prices.post('/api/admin/prices', async (c) => {
  const { treatment_id, item_name, price_text, insurance_covered, note, sort_order, is_published } =
    await c.req.json()

  if (!item_name || !String(item_name).trim()) {
    return c.json({ error: '항목명은 필수입니다.' }, 400)
  }

  const result = await c.env.DB.prepare(
    `INSERT INTO price_guide (treatment_id, item_name, price_text, insurance_covered, note, sort_order, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    treatment_id || null,
    String(item_name).trim(),
    price_text || '',
    insurance_covered ? 1 : 0,
    note || '',
    sort_order || 0,
    is_published === 0 || is_published === false ? 0 : 1
  ).run()

  return c.json({ id: result.meta.last_row_id }, 201)
})

// === ADMIN: 수가 항목 수정 ===
prices.put('/api/admin/prices/:id', async (c) => {
  const id = c.req.param('id')
  const { treatment_id, item_name, price_text, insurance_covered, note, sort_order, is_published } =
    await c.req.json()

  if (!item_name || !String(item_name).trim()) {
    return c.json({ error: '항목명은 필수입니다.' }, 400)
  }

  await c.env.DB.prepare(
    `UPDATE price_guide
     SET treatment_id=?, item_name=?, price_text=?, insurance_covered=?, note=?, sort_order=?, is_published=?
     WHERE id=?`
  ).bind(
    treatment_id || null,
    String(item_name).trim(),
    price_text || '',
    insurance_covered ? 1 : 0,
    note || '',
    sort_order || 0,
    is_published === 0 || is_published === false ? 0 : 1,
    id
  ).run()

  return c.json({ ok: true })
})

// === ADMIN: 공개/비공개 토글 ===
prices.patch('/api/admin/prices/:id/publish', async (c) => {
  const id = c.req.param('id')
  const { is_published } = await c.req.json()
  await c.env.DB.prepare(
    'UPDATE price_guide SET is_published=? WHERE id=?'
  ).bind(is_published ? 1 : 0, id).run()
  return c.json({ ok: true })
})

// === ADMIN: 수가 항목 삭제 ===
prices.delete('/api/admin/prices/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM price_guide WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default prices
