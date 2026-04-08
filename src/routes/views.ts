import type { HonoEnv } from '../types'

/**
 * 조회수 중복 방지 유틸리티
 * IP + User-Agent 해시를 기반으로 같은 날 동일 콘텐츠 재조회를 방지
 */
export async function incrementView(
  c: any,
  contentType: string,
  contentId: number | string,
  tableName: string
): Promise<boolean> {
  const db = c.env.DB as D1Database

  // 방문자 비식별 해시 생성 (IP + UA)
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  const ua = c.req.header('user-agent') || ''
  const raw = `${ip}:${ua}`
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(raw))
  const visitorHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)

  // 오늘 이미 조회했는지 확인
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const existing = await db.prepare(
    `SELECT id FROM view_logs 
     WHERE content_type = ? AND content_id = ? AND visitor_hash = ? 
     AND viewed_at >= ? 
     LIMIT 1`
  ).bind(contentType, contentId, visitorHash, today + 'T00:00:00').first()

  if (existing) {
    // 이미 오늘 조회 → views 증가 안 함
    return false
  }

  // 조회 기록 추가 + views 증가
  await db.prepare(
    'INSERT INTO view_logs (content_type, content_id, visitor_hash) VALUES (?, ?, ?)'
  ).bind(contentType, contentId, visitorHash).run()

  await db.prepare(
    `UPDATE ${tableName} SET views = views + 1 WHERE id = ?`
  ).bind(contentId).run()

  return true
}
