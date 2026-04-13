import { Hono } from 'hono'
import type { HonoEnv } from '../types'
import { incrementView } from './views'

const cases = new Hono<HonoEnv>()

// List cases (public) — with expanded filters
cases.get('/api/cases', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '12')
  const offset = (page - 1) * limit
  const category = c.req.query('category')
  const doctorId = c.req.query('doctor_id')
  const treatmentId = c.req.query('treatment_id')

  let where = 'WHERE is_published = 1'
  const binds: any[] = []
  if (category && category !== 'all') { where += ' AND category = ?'; binds.push(category) }
  if (doctorId) { where += ' AND doctor_id = ?'; binds.push(doctorId) }
  if (treatmentId) { where += ' AND treatment_id = ?'; binds.push(treatmentId) }

  const countStmt = binds.length
    ? c.env.DB.prepare(`SELECT COUNT(*) as total FROM cases ${where}`).bind(...binds)
    : c.env.DB.prepare(`SELECT COUNT(*) as total FROM cases ${where}`)
  const countResult = await countStmt.first() as any

  const dataBinds = [...binds, limit, offset]
  const { results } = await c.env.DB.prepare(
    `SELECT id, title, category, description, pano_before, pano_after, intra_before, intra_after,
      patient_age_group, patient_gender, region_text, doctor_id, treatment_duration, treatment_id,
      views, created_at
     FROM cases ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).bind(...dataBinds).all()

  return c.json({ cases: results, total: (countResult as any)?.total || 0, page, limit })
})

// Get single case + increment views
cases.get('/api/cases/:id', async (c) => {
  const id = c.req.param('id')
  await incrementView(c, 'case', id, 'cases')
  const result = await c.env.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(id).first()
  if (!result) return c.notFound()

  // Get doctor info if available
  const caseData = result as any
  let doctor = null
  if (caseData.doctor_id) {
    doctor = await c.env.DB.prepare('SELECT id, name, slug, title, photo FROM doctors WHERE id = ?').bind(caseData.doctor_id).first()
  }

  return c.json({ ...caseData, doctor })
})

// Admin: list all (incl unpublished)
cases.get('/api/admin/cases', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT c.*, d.name as doctor_name FROM cases c LEFT JOIN doctors d ON c.doctor_id = d.id ORDER BY c.created_at DESC'
  ).all()
  return c.json({ cases: results })
})

// Create case (with expanded fields)
cases.post('/api/admin/cases', async (c) => {
  const body = await c.req.json()
  const { title, category, description, pano_before, pano_after, intra_before, intra_after,
    patient_consent, patient_initials, treatment_date, tags,
    patient_age_group, patient_gender, region_text, doctor_id, treatment_duration, treatment_id } = body

  const result = await c.env.DB.prepare(
    `INSERT INTO cases (title, category, description, pano_before, pano_after, intra_before, intra_after,
      patient_consent, patient_initials, treatment_date, tags,
      patient_age_group, patient_gender, region_text, doctor_id, treatment_duration, treatment_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    title || '', category || 'implant', description || '',
    pano_before || null, pano_after || null,
    intra_before || null, intra_after || null,
    patient_consent ? 1 : 0, patient_initials || '', treatment_date || null,
    JSON.stringify(tags || []),
    patient_age_group || '', patient_gender || '', region_text || '',
    doctor_id || null, treatment_duration || '', treatment_id || null
  ).run()

  return c.json({ id: result.meta.last_row_id }, 201)
})

// Update case
cases.put('/api/admin/cases/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const { title, category, description, pano_before, pano_after, intra_before, intra_after, is_published,
    patient_consent, patient_initials, treatment_date, tags,
    patient_age_group, patient_gender, region_text, doctor_id, treatment_duration, treatment_id } = body

  await c.env.DB.prepare(
    `UPDATE cases SET title=?, category=?, description=?, pano_before=?, pano_after=?, intra_before=?, intra_after=?,
      patient_consent=?, patient_initials=?, treatment_date=?, tags=?,
      patient_age_group=?, patient_gender=?, region_text=?, doctor_id=?, treatment_duration=?, treatment_id=?,
      is_published=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).bind(
    title, category, description,
    pano_before || null, pano_after || null,
    intra_before || null, intra_after || null,
    patient_consent ? 1 : 0, patient_initials || '', treatment_date || null,
    JSON.stringify(tags || []),
    patient_age_group || '', patient_gender || '', region_text || '',
    doctor_id || null, treatment_duration || '', treatment_id || null,
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
