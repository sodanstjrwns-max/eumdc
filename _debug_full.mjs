// 전체 디버그 — 병렬로 빠르게
const base = 'https://eumdc.kr'

// ═══════════════════════════════════════════
// 1. 전체 라우트 헬스체크 (25+)
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  1️⃣  전체 라우트 헬스체크')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const routes = [
  // 메인 페이지
  '/', '/about', '/doctors', '/treatments', '/visit', '/faq', '/cases', '/blogs', '/notices', '/dictionary',
  // 진료
  '/treatments/implant', '/treatments/aesthetic', '/treatments/resin', '/treatments/tmj', '/treatments/general',
  // 지역
  '/regions/myeongji',
  // SEO infra
  '/robots.txt', '/sitemap.xml', '/static/og-image.png',
  // 404 tests
  '/nonexistent-page', '/treatments/fake-slug',
  // 리다이렉트 체크
  '/treatments/prosthetics'
]

const results = await Promise.all(routes.map(async p => {
  const t0 = Date.now()
  try {
    const r = await fetch(base + p, { redirect: 'manual' })
    return { p, status: r.status, ms: Date.now() - t0, location: r.headers.get('location') }
  } catch(e) { return { p, status: 'ERR', ms: Date.now() - t0, err: e.message } }
}))

let okCount = 0, warnCount = 0, errCount = 0
for (const r of results) {
  const expectedFail = r.p.includes('nonexistent') || r.p.includes('fake-slug')
  const expected404 = expectedFail
  const isOk = r.status === 200 || (r.status === 301) || (expected404 && r.status === 404)
  const mark = isOk ? '✅' : (r.status >= 500 ? '❌' : '🟡')
  if (isOk) okCount++
  else if (r.status >= 500) errCount++
  else warnCount++
  const extra = r.location ? ` → ${r.location.replace(base, '')}` : ''
  console.log(`  ${mark} [${r.status}] ${r.ms}ms  ${r.p}${extra}`)
}
console.log(`\n  결과: ${okCount} OK / ${warnCount} 경고 / ${errCount} 오류`)

// ═══════════════════════════════════════════
// 2. 리소스 404 스캔 (홈페이지의 모든 링크 추출 후 체크)
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  2️⃣  홈페이지 리소스 404 스캔')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const home = await (await fetch(base)).text()
const assetMatches = [
  ...[...home.matchAll(/(?:src|href)="(\/static\/[^"]+)"/g)].map(m => m[1]),
  ...[...home.matchAll(/(?:src|href)="(\/api\/[^"]+)"/g)].map(m => m[1])
]
const unique = [...new Set(assetMatches)]
console.log(`  스캔 대상: ${unique.length}개 에셋\n`)

const assetResults = await Promise.all(unique.slice(0, 30).map(async a => {
  try {
    const r = await fetch(base + a, { method: 'HEAD' })
    return { a, status: r.status, size: r.headers.get('content-length') }
  } catch { return { a, status: 'ERR' } }
}))
let assetBad = 0
for (const r of assetResults) {
  if (r.status === 200) continue  // 성공은 생략
  console.log(`  ❌ [${r.status}] ${r.a}`)
  assetBad++
}
console.log(`  ${assetBad === 0 ? '✅ 전부 200 OK' : `❌ ${assetBad}개 오류`}`)

// ═══════════════════════════════════════════
// 3. 성능 메트릭
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  3️⃣  성능 메트릭')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

// 3회 측정 평균
const perfSamples = []
for (let i = 0; i < 3; i++) {
  const t0 = Date.now()
  const r = await fetch(base)
  const ttfb = Date.now() - t0
  const body = await r.text()
  const bytes = new TextEncoder().encode(body).length
  perfSamples.push({ ttfb, bytes, cf: r.headers.get('cf-cache-status'), server: r.headers.get('server') })
}
const avgTtfb = Math.round(perfSamples.reduce((a,b)=>a+b.ttfb,0)/perfSamples.length)
const avgBytes = Math.round(perfSamples[0].bytes/1024)
console.log(`  TTFB (3회 평균): ${avgTtfb}ms`)
console.log(`  HTML 크기: ${avgBytes}KB`)
console.log(`  CF-Cache: ${perfSamples.map(s=>s.cf).join(', ')}`)
console.log(`  Server: ${perfSamples[0].server}`)

// ═══════════════════════════════════════════
// 4. 응답 헤더 (보안/캐시)
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  4️⃣  보안·캐시 헤더')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const headerCheckRes = await fetch(base)
const interestingHeaders = [
  'content-type', 'content-encoding', 'cache-control',
  'strict-transport-security', 'x-content-type-options', 'x-frame-options',
  'referrer-policy', 'content-security-policy'
]
for (const h of interestingHeaders) {
  const v = headerCheckRes.headers.get(h)
  console.log(`  ${v ? '✅' : '⚠️ '} ${h}: ${v || '(없음)'}`)
}

// static asset caching
const staticRes = await fetch(base + '/static/og-image.png', { method: 'HEAD' })
console.log(`\n  정적자원 cache-control: ${staticRes.headers.get('cache-control') || '(없음)'}`)
console.log(`  정적자원 content-encoding: ${staticRes.headers.get('content-encoding') || '(없음)'}`)

// ═══════════════════════════════════════════
// 5. JSON-LD 스키마 모든 페이지 유효성
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  5️⃣  JSON-LD 스키마 유효성')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const schemaPaths = ['/', '/about', '/doctors', '/treatments', '/treatments/implant', '/faq', '/regions/myeongji']
for (const p of schemaPaths) {
  const h = await (await fetch(base + p)).text()
  const blocks = [...h.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
  const types = new Set()
  let broken = 0
  for (const [, raw] of blocks) {
    try {
      const d = JSON.parse(raw)
      const arr = Array.isArray(d) ? d : [d]
      for (const n of arr) {
        const t = n['@type']
        if (Array.isArray(t)) t.forEach(x=>types.add(x))
        else if (t) types.add(t)
      }
    } catch { broken++ }
  }
  console.log(`  ${broken ? '❌' : '✅'} ${p.padEnd(25)} ${blocks.length}개 블록 | 타입: ${[...types].join(', ')}`)
}

// ═══════════════════════════════════════════
// 6. Sitemap 내 전체 URL 유효성 (샘플 20개)
// ═══════════════════════════════════════════
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  6️⃣  Sitemap URL 유효성 (샘플)')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const sm = await (await fetch(base + '/sitemap.xml')).text()
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
console.log(`  전체 URL: ${urls.length}개`)
// 20개 랜덤 샘플
const sample = urls.sort(() => Math.random() - 0.5).slice(0, 20)
const sampleRes = await Promise.all(sample.map(async u => {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'manual' })
    return { u: u.replace(base, ''), status: r.status }
  } catch { return { u, status: 'ERR' } }
}))
let smBad = 0
for (const r of sampleRes) {
  if (r.status === 200) continue
  console.log(`  ❌ [${r.status}] ${r.u}`)
  smBad++
}
console.log(`  ${smBad === 0 ? '✅ 샘플 20개 전부 200 OK' : `❌ ${smBad}개 실패`}`)

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('  디버그 스캔 완료')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
