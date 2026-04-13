import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const app = new Hono<HonoEnv>()

// ─── 지역 자동완성 API ───
app.get('/api/regions/autocomplete', async (c) => {
  const q = (c.req.query('q') || '').trim()
  if (!q || q.length < 1) return c.json({ regions: [] })

  // "초지" → "안산시 상록구 초지동", "안산" → "안산시"
  const { results } = await c.env.DB.prepare(
    `SELECT id, sido, sigungu, dong, full_address
     FROM regions
     WHERE full_address LIKE ? OR dong LIKE ? OR sigungu LIKE ? OR sido LIKE ?
     ORDER BY full_address LIMIT 20`
  ).bind(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`).all()

  return c.json({ regions: results })
})

// ─── 지역 SEO 페이지 목록 ───
app.get('/api/seo-regions', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, slug, region_name, h1_title FROM seo_regions WHERE is_published = 1 ORDER BY region_name'
  ).all()
  return c.json({ regions: results })
})

// ─── 지역 SEO 페이지 상세 ───
app.get('/api/seo-regions/:slug', async (c) => {
  const slug = c.req.param('slug')
  const region = await c.env.DB.prepare(
    'SELECT * FROM seo_regions WHERE slug = ? AND is_published = 1'
  ).bind(slug).first()
  if (!region) return c.json({ error: 'Not found' }, 404)
  return c.json({ region })
})

export default app
