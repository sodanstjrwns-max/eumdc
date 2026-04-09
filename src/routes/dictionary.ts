import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const app = new Hono<HonoEnv>()

// ─── 카테고리 목록 ───
app.get('/api/dictionary/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM dict_categories ORDER BY sort_order'
  ).all()

  // 카테고리별 용어 수 가져오기
  const { results: counts } = await c.env.DB.prepare(
    `SELECT dc.slug, COUNT(dt.id) as count
     FROM dict_categories dc
     LEFT JOIN dict_terms dt ON dc.id = dt.category_id AND dt.is_published = 1
     GROUP BY dc.id
     ORDER BY dc.sort_order`
  ).all()

  const countMap: Record<string, number> = {}
  for (const row of counts as any[]) {
    countMap[row.slug] = row.count
  }

  return c.json({ categories: results, counts: countMap })
})

// ─── 용어 목록 (카테고리, 초성, 검색, 정렬) ───
app.get('/api/dictionary', async (c) => {
  const category = c.req.query('category') || 'all'
  const chosung = c.req.query('chosung') || ''
  const search = c.req.query('search') || ''
  const service = c.req.query('service') || ''
  const sort = c.req.query('sort') || 'term'
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit

  let where = 'dt.is_published = 1'
  const params: any[] = []

  if (category && category !== 'all') {
    where += ' AND dc.slug = ?'
    params.push(category)
  }

  if (chosung) {
    where += ' AND dt.chosung = ?'
    params.push(chosung)
  }

  if (search) {
    where += ' AND (dt.term LIKE ? OR dt.english LIKE ? OR dt.short_desc LIKE ?)'
    const s = `%${search}%`
    params.push(s, s, s)
  }

  if (service) {
    where += ' AND dt.related_service = ?'
    params.push(service)
  }

  // 총 개수
  const countQ = await c.env.DB.prepare(
    `SELECT COUNT(*) as total FROM dict_terms dt JOIN dict_categories dc ON dt.category_id = dc.id WHERE ${where}`
  ).bind(...params).first() as any

  // 정렬
  let orderBy = 'dt.term COLLATE NOCASE'
  if (sort === 'popular') orderBy = 'dt.views DESC, dt.term COLLATE NOCASE'
  else if (sort === 'latest') orderBy = 'dt.created_at DESC, dt.term COLLATE NOCASE'

  // 용어 목록
  const dataParams = [...params, limit, offset]
  const { results } = await c.env.DB.prepare(
    `SELECT dt.id, dt.term, dt.slug, dt.english, dt.pronunciation, dt.short_desc, dt.chosung, dt.related_service, dt.views,
            dc.name as category_name, dc.slug as category_slug, dc.icon as category_icon
     FROM dict_terms dt
     JOIN dict_categories dc ON dt.category_id = dc.id
     WHERE ${where}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`
  ).bind(...dataParams).all()

  return c.json({
    terms: results,
    total: countQ?.total || 0,
    page,
    limit,
    totalPages: Math.ceil((countQ?.total || 0) / limit)
  })
})

// ─── 용어 상세 (slug 기반) ───
app.get('/api/dictionary/:slug', async (c) => {
  const slug = c.req.param('slug')
  
  // 예약어 체크 — stats, service, search 등 API 경로와 충돌 방지
  if (['stats', 'service', 'search', 'categories'].includes(slug)) {
    return c.json({ error: 'Invalid slug' }, 400)
  }

  const term = await c.env.DB.prepare(
    `SELECT dt.*, dc.name as category_name, dc.slug as category_slug, dc.icon as category_icon
     FROM dict_terms dt
     JOIN dict_categories dc ON dt.category_id = dc.id
     WHERE dt.slug = ? AND dt.is_published = 1`
  ).bind(slug).first()

  if (!term) {
    return c.json({ error: 'Term not found' }, 404)
  }

  // 같은 카테고리의 관련 용어 (현재 용어 제외, 최대 6개)
  const { results: related } = await c.env.DB.prepare(
    `SELECT id, term, slug, short_desc, english FROM dict_terms
     WHERE category_id = ? AND id != ? AND is_published = 1
     ORDER BY RANDOM() LIMIT 6`
  ).bind((term as any).category_id, (term as any).id).all()

  // 조회수 증가
  await c.env.DB.prepare(
    'UPDATE dict_terms SET views = views + 1 WHERE slug = ?'
  ).bind(slug).run()

  return c.json({ term, related })
})

// ─── 진료 서비스별 관련 용어 ───
app.get('/api/dictionary/service/:service', async (c) => {
  const service = c.req.param('service')
  const { results } = await c.env.DB.prepare(
    `SELECT dt.id, dt.term, dt.slug, dt.short_desc, dt.english, dc.name as category_name
     FROM dict_terms dt
     JOIN dict_categories dc ON dt.category_id = dc.id
     WHERE dt.related_service = ? AND dt.is_published = 1
     ORDER BY dt.term COLLATE NOCASE`
  ).bind(service).all()

  return c.json({ terms: results, service })
})

// ─── 초성 통계 ───
app.get('/api/dictionary/stats/chosung', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT chosung, COUNT(*) as count FROM dict_terms
     WHERE is_published = 1
     GROUP BY chosung ORDER BY chosung`
  ).all()

  return c.json({ stats: results })
})

// ─── 전체 통계 ───
app.get('/api/dictionary/stats/overview', async (c) => {
  const totalQ = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM dict_terms WHERE is_published = 1'
  ).first() as any

  const catQ = await c.env.DB.prepare(
    'SELECT COUNT(*) as total FROM dict_categories'
  ).first() as any

  const popularQ = await c.env.DB.prepare(
    'SELECT term FROM dict_terms WHERE is_published = 1 ORDER BY views DESC LIMIT 1'
  ).first() as any

  return c.json({
    totalTerms: totalQ?.total || 0,
    totalCategories: catQ?.total || 0,
    popularTerm: popularQ?.term || '—'
  })
})

// ─── 자동완성 검색 ───
app.get('/api/dictionary/search/autocomplete', async (c) => {
  const q = c.req.query('q') || ''
  if (q.length < 1) return c.json({ results: [] })

  const s = `%${q}%`
  const { results } = await c.env.DB.prepare(
    `SELECT dt.term, dt.slug, dt.english, dc.name as category_name
     FROM dict_terms dt
     JOIN dict_categories dc ON dt.category_id = dc.id
     WHERE dt.is_published = 1 AND (dt.term LIKE ? OR dt.english LIKE ?)
     ORDER BY CASE WHEN dt.term LIKE ? THEN 0 ELSE 1 END, dt.views DESC
     LIMIT 8`
  ).bind(s, s, `${q}%`).all()

  return c.json({ results })
})

export default app
