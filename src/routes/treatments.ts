import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const app = new Hono<HonoEnv>()

// ─── 진료과목 목록 API ───
app.get('/api/treatments', async (c) => {
  const category = c.req.query('category') || 'all'
  let query = 'SELECT id, name, name_en, slug, icon, category, short_desc, sort_order, views FROM treatments WHERE is_published = 1'
  const binds: any[] = []
  if (category !== 'all') {
    query += ' AND category = ?'
    binds.push(category)
  }
  query += ' ORDER BY sort_order'
  const stmt = binds.length ? c.env.DB.prepare(query).bind(...binds) : c.env.DB.prepare(query)
  const { results } = await stmt.all()
  return c.json({ treatments: results })
})

// ─── 진료과목 상세 API ───
app.get('/api/treatments/:slug', async (c) => {
  const slug = c.req.param('slug')
  const treatment = await c.env.DB.prepare(
    'SELECT * FROM treatments WHERE slug = ? AND is_published = 1'
  ).bind(slug).first()
  if (!treatment) return c.json({ error: 'Not found' }, 404)

  // FAQ
  const { results: faqs } = await c.env.DB.prepare(
    'SELECT id, question, answer, sort_order FROM treatment_faqs WHERE treatment_id = ? AND is_published = 1 ORDER BY sort_order'
  ).bind(treatment.id).all()

  // 담당 의료진
  const { results: doctors } = await c.env.DB.prepare(
    `SELECT d.id, d.name, d.slug, d.title, d.photo, d.specialties, dt.is_primary
     FROM doctors d JOIN doctor_treatments dt ON d.id = dt.doctor_id
     WHERE dt.treatment_id = ? AND d.is_published = 1
     ORDER BY dt.is_primary DESC, d.sort_order`
  ).bind(treatment.id).all()

  // 관련 백과사전 용어
  const serviceSlugMap: Record<string, string> = {
    'implant': 'implant', 'aesthetic': 'aesthetic', 'tmj': 'tmj',
    'resin': 'resin', 'general': 'general', 'periodontal': 'periodontal',
    'wisdom-tooth': 'general', 'pediatric': 'pediatric', 'prevention': 'general'
  }
  const serviceKey = serviceSlugMap[slug as string] || slug
  const { results: dictTerms } = await c.env.DB.prepare(
    'SELECT id, term, slug, english, short_desc FROM dict_terms WHERE related_service = ? AND is_published = 1 ORDER BY term LIMIT 12'
  ).bind(serviceKey).all()

  // 관련 비포애프터
  const { results: cases } = await c.env.DB.prepare(
    'SELECT id, title, category, pano_after, treatment_date FROM cases WHERE treatment_id = ? AND is_published = 1 ORDER BY created_at DESC LIMIT 6'
  ).bind(treatment.id).all()

  // 수가
  const { results: prices } = await c.env.DB.prepare(
    'SELECT item_name, price_text, insurance_covered, note FROM price_guide WHERE treatment_id = ? AND is_published = 1 ORDER BY sort_order'
  ).bind(treatment.id).all()

  // 조회수 증가
  await c.env.DB.prepare('UPDATE treatments SET views = views + 1 WHERE id = ?').bind(treatment.id).run()

  return c.json({ treatment, faqs, doctors, dictTerms, cases, prices })
})

// ─── 수가 안내 전체 API ───
app.get('/api/prices', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT pg.*, t.name as treatment_name, t.slug as treatment_slug, t.icon as treatment_icon
     FROM price_guide pg
     LEFT JOIN treatments t ON pg.treatment_id = t.id
     WHERE pg.is_published = 1
     ORDER BY t.sort_order, pg.sort_order`
  ).all()
  return c.json({ prices: results })
})

export default app
