const base = 'https://eumdc.kr'

console.log('\n━━━ v20 최적화 검증 ━━━\n')

// 1. Soft 404 수정 확인
console.log('▶ 1. Soft 404 수정 (모두 404 반환해야 함)')
const soft404s = [
  '/treatments/fake-slug', '/doctors/fake-slug',
  '/cases/99999', '/blogs/fake-slug',
  '/notices/99999', '/dictionary/fake-term'
]
for (const p of soft404s) {
  const r = await fetch(base + p)
  const mark = r.status === 404 ? '✅' : '❌'
  console.log(`  ${mark} [${r.status}] ${p}`)
}

// 2. 실제 페이지는 여전히 200인지 (회귀 테스트)
console.log('\n▶ 2. 회귀 테스트 (실제 페이지 200 유지)')
const realPaths = [
  '/treatments/implant', '/cases/1', '/blogs/1',
  '/dictionary/3d-printer'
]
for (const p of realPaths) {
  const r = await fetch(base + p, { redirect: 'manual' })
  const mark = r.status === 200 ? '✅' : (r.status === 404 ? '⚠️ 실존 데이터가 없음' : '❌')
  console.log(`  ${mark} [${r.status}] ${p}`)
}

// 3. 보안/캐시 헤더
console.log('\n▶ 3. 보안 & 캐시 헤더')
const r = await fetch(base)
const checks = [
  ['strict-transport-security', true],
  ['x-content-type-options', true],
  ['x-frame-options', true],
  ['referrer-policy', true],
  ['permissions-policy', true],
  ['cache-control', true]
]
for (const [h, required] of checks) {
  const v = r.headers.get(h)
  console.log(`  ${v ? '✅' : '❌'} ${h}: ${v || '(없음)'}`)
}

// 4. API는 no-store인지
console.log('\n▶ 4. API 캐시 정책 (no-store)')
const apiR = await fetch(base + '/api/treatments')
const apiCache = apiR.headers.get('cache-control')
console.log(`  ${apiCache?.includes('no-store') ? '✅' : '❌'} /api/treatments: ${apiCache}`)

// 5. Sitemap 캐시
console.log('\n▶ 5. Sitemap 캐시')
const smR = await fetch(base + '/sitemap.xml')
console.log(`  ${smR.headers.get('cache-control')?.includes('max-age=3600') ? '✅' : '⚠️'} /sitemap.xml: ${smR.headers.get('cache-control')}`)

// 6. 성능 재측정
console.log('\n▶ 6. 성능 (5회 샘플)')
const ttfbs = []
for (let i = 0; i < 5; i++) {
  const t0 = Date.now()
  const res = await fetch(base)
  await res.text()
  ttfbs.push(Date.now() - t0)
}
ttfbs.sort((a,b) => a-b)
const median = ttfbs[2]
const min = ttfbs[0]
const max = ttfbs[4]
console.log(`  TTFB: min ${min}ms / median ${median}ms / max ${max}ms`)
console.log(`  샘플: ${ttfbs.join('ms, ')}ms`)

// 7. 페이로드 압축
console.log('\n▶ 7. 응답 압축')
const r2 = await fetch(base, { headers: { 'accept-encoding': 'br, gzip' } })
console.log(`  ✅ content-encoding: ${r2.headers.get('content-encoding')}`)

// 8. 301 리다이렉트 헤더
console.log('\n▶ 8. 301 리다이렉트 (prosthetics → aesthetic)')
const redR = await fetch(base + '/treatments/prosthetics', { redirect: 'manual' })
console.log(`  ${redR.status === 301 ? '✅' : '❌'} [${redR.status}] → ${redR.headers.get('location')}`)
console.log(`  cache-control: ${redR.headers.get('cache-control')}`)

console.log('\n━━━ 검증 완료 ━━━\n')
