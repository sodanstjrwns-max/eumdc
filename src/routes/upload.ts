import { Hono } from 'hono'
import type { HonoEnv } from '../types'

const upload = new Hono<HonoEnv>()

// Upload image to R2
upload.post('/api/upload', async (c) => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File | null
  if (!file) return c.json({ error: 'No file' }, 400)

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif']
  if (!allowed.includes(ext)) return c.json({ error: 'Invalid file type' }, 400)

  const key = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buf = await file.arrayBuffer()

  await c.env.R2.put(key, buf, {
    httpMetadata: { contentType: file.type }
  })

  return c.json({ url: `/r2/${key}`, key })
})

// Multi upload
upload.post('/api/upload/multi', async (c) => {
  const formData = await c.req.formData()
  const files = formData.getAll('files') as File[]
  if (!files.length) return c.json({ error: 'No files' }, 400)

  const results = []
  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const key = `images/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const buf = await file.arrayBuffer()
    await c.env.R2.put(key, buf, {
      httpMetadata: { contentType: file.type }
    })
    results.push({ url: `/r2/${key}`, key, name: file.name })
  }

  return c.json({ files: results })
})

// Serve R2 image
upload.get('/r2/*', async (c) => {
  const key = c.req.path.replace('/r2/', '')
  const obj = await c.env.R2.get(key)
  if (!obj) return c.notFound()

  const headers = new Headers()
  headers.set('Content-Type', obj.httpMetadata?.contentType || 'image/jpeg')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  return new Response(obj.body, { headers })
})

// Delete R2 image
upload.delete('/api/upload', async (c) => {
  const { key } = await c.req.json()
  if (!key) return c.json({ error: 'No key' }, 400)
  await c.env.R2.delete(key)
  return c.json({ ok: true })
})

export default upload
