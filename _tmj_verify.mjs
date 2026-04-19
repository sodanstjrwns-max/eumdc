const base = 'https://eumdc.kr'

console.log('=== TMJ 이동 검증 ===\n')

// 1. DB API
const tlist = await (await fetch(base + '/api/treatments')).json()
console.log('▶ API /api/treatments 순서:')
for (const t of (tlist.treatments || tlist.data || tlist)) {
  console.log(`  ${t.sort_order}. ${t.slug.padEnd(12)} [${t.category}] ${t.name}`)
}

// 2. 홈 카드 순서
const home = await (await fetch(base)).text()
const cards = [...home.matchAll(/<span class="h-card-num">(\d+)<\/span><h3 class="h-card-title">([^<]+)<\/h3>/g)]
console.log('\n▶ 홈 화면 메인 카드:')
for (const [, num, title] of cards) {
  console.log(`  ${num}. ${title}`)
}

// 3. 스키마 서비스 순서
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
console.log('\n▶ 스키마 hasOfferCatalog 순서:')
for (const o of (dentist?.hasOfferCatalog?.itemListElement || [])) {
  console.log(`  - ${o.itemOffered?.name}`)
}

// 4. 홈 타이틀/디스크립션
const title = (home.match(/<title>([^<]+)<\/title>/) || [])[1] || ''
const desc = (home.match(/<meta name="description" content="([^"]+)"/) || [])[1] || ''
console.log('\n▶ 홈 메타:')
console.log(`  title: ${title}`)
console.log(`  desc:  ${desc}`)

// 5. TMJ 페이지 여전히 살아있는지
const tmjPage = await fetch(base + '/treatments/tmj')
console.log(`\n▶ /treatments/tmj: ${tmjPage.status === 200 ? '✅ 200 OK (페이지 유지)' : '❌ ' + tmjPage.status}`)
