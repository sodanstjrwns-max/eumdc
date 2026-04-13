import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const app = new Hono<HonoEnv>()

// ─── 의료진 목록 API ───
app.get('/api/doctors', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, name, name_en, slug, title, position, photo, specialties, sort_order
     FROM doctors WHERE is_published = 1 ORDER BY sort_order`
  ).all()
  return c.json({ doctors: results })
})

// ─── 의료진 상세 API ───
app.get('/api/doctors/:slug', async (c) => {
  const slug = c.req.param('slug')
  const doctor = await c.env.DB.prepare(
    'SELECT * FROM doctors WHERE slug = ? AND is_published = 1'
  ).bind(slug).first()
  if (!doctor) return c.json({ error: 'Not found' }, 404)

  // 담당 진료과목
  const { results: treatments } = await c.env.DB.prepare(
    `SELECT t.id, t.name, t.slug, t.icon, t.short_desc, dt.is_primary
     FROM treatments t JOIN doctor_treatments dt ON t.id = dt.treatment_id
     WHERE dt.doctor_id = ? AND t.is_published = 1
     ORDER BY dt.is_primary DESC, t.sort_order`
  ).bind(doctor.id).all()

  // 담당 비포애프터
  const { results: cases } = await c.env.DB.prepare(
    `SELECT id, title, category, pano_after, created_at
     FROM cases WHERE doctor_id = ? AND is_published = 1
     ORDER BY created_at DESC LIMIT 6`
  ).bind(doctor.id).all()

  return c.json({ doctor, treatments, cases })
})

// ─── Admin: 의료진 CRUD ───
app.get('/api/admin/doctors', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM doctors ORDER BY sort_order').all()
  return c.json({ doctors: results })
})

app.post('/api/admin/doctors', async (c) => {
  const body = await c.req.json()
  const { name, name_en, slug, title, position, photo, photo_full, greeting, philosophy,
    education, career, certifications, memberships, specialties, sort_order } = body
  const result = await c.env.DB.prepare(
    `INSERT INTO doctors (name, name_en, slug, title, position, photo, photo_full, greeting, philosophy,
      education, career, certifications, memberships, specialties, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    name, name_en || '', slug, title || '원장', position || '',
    photo || '', photo_full || '', greeting || '', philosophy || '',
    JSON.stringify(education || []), JSON.stringify(career || []),
    JSON.stringify(certifications || []), JSON.stringify(memberships || []),
    JSON.stringify(specialties || []), sort_order || 0
  ).run()
  return c.json({ id: result.meta.last_row_id }, 201)
})

app.put('/api/admin/doctors/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { name, name_en, slug, title, position, photo, photo_full, greeting, philosophy,
    education, career, certifications, memberships, specialties, sort_order, is_published } = body
  await c.env.DB.prepare(
    `UPDATE doctors SET name=?, name_en=?, slug=?, title=?, position=?, photo=?, photo_full=?,
      greeting=?, philosophy=?, education=?, career=?, certifications=?, memberships=?,
      specialties=?, sort_order=?, is_published=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    name, name_en || '', slug, title || '원장', position || '',
    photo || '', photo_full || '', greeting || '', philosophy || '',
    JSON.stringify(education || []), JSON.stringify(career || []),
    JSON.stringify(certifications || []), JSON.stringify(memberships || []),
    JSON.stringify(specialties || []), sort_order || 0, is_published ?? 1, id
  ).run()
  return c.json({ ok: true })
})

app.delete('/api/admin/doctors/:id', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('DELETE FROM doctor_treatments WHERE doctor_id = ?').bind(id).run()
  await c.env.DB.prepare('DELETE FROM doctors WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

export default app
