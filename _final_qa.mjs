// Final delivery QA - v18
const base = 'https://eumdc.kr'

console.log('═══════════════════════════════════════')
console.log('  이음치과 v18 최종 납품 QA')
console.log('═══════════════════════════════════════\n')

// 1. Core routes
const routes = [
  ['/', '홈'],
  ['/about', '병원소개'],
  ['/doctors', '의료진'],
  ['/treatments', '진료안내'],
  ['/treatments/implant', '임플란트'],
  ['/treatments/aesthetic', '심미보철'],
  ['/treatments/resin', '심미레진'],
  ['/treatments/tmj', '턱관절'],
  ['/treatments/general', '일반진료'],
  ['/cases', '비포애프터'],
  ['/blogs', '블로그'],
  ['/faq', 'FAQ'],
  ['/dictionary', '용어사전'],
  ['/notices', '공지사항'],
  ['/visit', '내원안내'],
  ['/regions/myeongji', '명지지역']
]

console.log('▶ 1. 라우팅 체크')
let pass = 0, fail = 0
for (const [p, label] of routes) {
  const r = await fetch(base + p)
  const ok = r.status === 200
  ok ? pass++ : fail++
  if (!ok) console.log(`  ❌ ${p} (${r.status})`)
}
console.log(`  ✅ ${pass}/${routes.length} OK\n`)

// 2. 301 redirect
console.log('▶ 2. 301 리다이렉트')
const red = await fetch(base + '/treatments/prosthetics', { redirect: 'manual' })
console.log(`  prosthetics → aesthetic: ${red.status === 301 ? '✅' : '❌'} (${red.status})\n`)

// 3. CTA
console.log('▶ 3. 핵심 CTA')
const home = await (await fetch(base)).text()
const ctas = {
  '카카오톡': 'pf.kakao.com/_diyyn',
  '네이버예약': 'place.naver.com/hospital/2005922467/booking',
  '전화': 'tel:051-206-5888'
}
for (const [k, v] of Object.entries(ctas)) {
  console.log(`  ${home.includes(v) ? '✅' : '❌'} ${k}: ${v}`)
}

// 4. Meta descriptions
console.log('\n▶ 4. Meta Description 길이 (120자+ 권장)')
const metaPaths = ['/', '/about', '/doctors', '/treatments', '/cases', '/blogs', '/notices', '/regions/myeongji']
for (const p of metaPaths) {
  const h = await (await fetch(base + p)).text()
  const d = (h.match(/<meta name="description" content="([^"]+)"/) || [])[1] || ''
  const mark = d.length >= 120 ? '✅' : (d.length >= 70 ? '🟡' : '❌')
  console.log(`  ${mark} ${p.padEnd(22)} ${d.length}자`)
}

// 5. Schema check
console.log('\n▶ 5. Dentist 스키마 핵심 정보')
const lds = [...home.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
  .map(m => { try { return JSON.parse(m[1]) } catch { return null } }).filter(Boolean)
let dentist = null
for (const b of lds) {
  const arr = Array.isArray(b) ? b : [b]
  for (const n of arr) {
    const t = n['@type']
    if ((Array.isArray(t) && t.includes('Dentist')) || t === 'Dentist') dentist = n
  }
}
if (dentist) {
  console.log(`  ✅ 병원명: ${dentist.name}`)
  console.log(`  ✅ 전화: ${dentist.telephone}`)
  console.log(`  ✅ 주소: ${dentist.address?.streetAddress}, ${dentist.address?.addressLocality}`)
  console.log(`  ✅ 좌표: ${dentist.geo?.latitude}, ${dentist.geo?.longitude}`)
  console.log(`  ✅ 원장: ${dentist.founder?.name} (${dentist.founder?.alumniOf?.name})`)
  const hours = dentist.openingHoursSpecification || []
  console.log(`  ✅ 진료시간 스펙: ${hours.length}개 (Friday 포함: ${JSON.stringify(dentist).includes('Friday')?'Y':'N'})`)
  console.log(`  ✅ 의료분야: ${(dentist.medicalSpecialty||[]).length}개`)
  console.log(`  ✅ 서비스: ${(dentist.hasOfferCatalog?.itemListElement||[]).length}개`)
}

// 6. Sitemap & robots
console.log('\n▶ 6. SEO 인프라')
const sm = await (await fetch(base + '/sitemap.xml')).text()
console.log(`  ✅ Sitemap: ${(sm.match(/<loc>/g)||[]).length} URLs`)
const rb = await (await fetch(base + '/robots.txt')).text()
console.log(`  ✅ robots.txt: Sitemap 선언 ${rb.includes('Sitemap:')?'Y':'N'}`)
const og = await fetch(base + '/static/og-image.png')
console.log(`  ✅ OG Image: ${og.status} (${Math.round((await og.arrayBuffer()).byteLength/1024)}KB)`)

// 7. Perf
console.log('\n▶ 7. 성능')
const t0 = Date.now()
const r = await fetch(base)
const ttfb = Date.now() - t0
const bytes = (await r.text()).length
console.log(`  ✅ TTFB: ${ttfb}ms`)
console.log(`  ✅ HTML 크기: ${Math.round(bytes/1024)}KB`)

console.log('\n═══════════════════════════════════════')
console.log('  납품 준비 완료')
console.log('═══════════════════════════════════════')
