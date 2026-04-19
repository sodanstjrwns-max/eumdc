// Final SEO/GEO verification
const base = 'https://eumdc.kr'
const paths = ['/', '/about', '/doctors', '/treatments', '/visit', '/regions/myeongji', '/faq']

console.log('=== SEO Final Audit ===\n')
for (const p of paths) {
  const r = await fetch(base + p)
  const html = await r.text()
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || ''
  const desc = (html.match(/<meta name="description" content="([^"]+)"/) || [])[1] || ''
  const ogImg = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1] || ''
  console.log(`${p}`)
  console.log(`  title: ${title.length}ch | ${title.substring(0, 50)}${title.length>50?'...':''}`)
  console.log(`  desc:  ${desc.length}ch | ${desc.substring(0, 70)}${desc.length>70?'...':''}`)
  console.log(`  og:    ${ogImg ? 'OK' : 'MISSING'}`)
  console.log()
}

// Dentist schema check (doctor alma mater + Friday)
const homeHtml = await (await fetch(base)).text()
const ldBlocks = [...homeHtml.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map(m => {
  try { return JSON.parse(m[1]) } catch { return null }
}).filter(Boolean)

let dentist = null
for (const b of ldBlocks) {
  const arr = Array.isArray(b) ? b : [b]
  for (const node of arr) {
    const t = node['@type']
    if ((Array.isArray(t) && t.includes('Dentist')) || t === 'Dentist') dentist = node
  }
}

if (dentist) {
  console.log('=== Dentist Schema ===')
  const founder = dentist.founder
  const alma = founder?.alumniOf
  const almaName = Array.isArray(alma) ? alma.map(a=>a.name).join(', ') : (alma?.name || 'none')
  console.log(`Founder: ${founder?.name || 'none'}`)
  console.log(`AlmaMater: ${almaName}`)
  const hours = dentist.openingHoursSpecification || []
  const days = hours.map(h => `${Array.isArray(h.dayOfWeek)?h.dayOfWeek.join('/'):h.dayOfWeek}: ${h.opens}-${h.closes}`)
  console.log(`Hours: ${days.join(' | ')}`)
}

// Friday schema
const hasFriday = JSON.stringify(dentist||{}).includes('Friday')
console.log(`Friday in schema: ${hasFriday ? '✅ YES' : '❌ NO'}`)

// sitemap
const sm = await (await fetch(base + '/sitemap.xml')).text()
const urls = (sm.match(/<loc>/g) || []).length
console.log(`\nSitemap URLs: ${urls}`)

// robots
const robots = await (await fetch(base + '/robots.txt')).text()
console.log(`robots.txt: ${robots.includes('Sitemap:') ? '✅' : '❌'}`)
