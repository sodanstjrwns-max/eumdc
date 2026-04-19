import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' })
await page.waitForTimeout(5000)  // 애니메이션 확실히 끝나도록

const diag = await page.evaluate(() => {
  const results = {}
  // title element
  const title = document.querySelector('.hero-title')
  if (title) {
    const cs = getComputedStyle(title)
    results.title = {
      filter: cs.filter,
      webkitFilter: cs.webkitFilter,
      backdropFilter: cs.backdropFilter,
      textShadow: cs.textShadow,
      opacity: cs.opacity,
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      color: cs.color,
      WebkitTextStroke: cs.webkitTextStroke,
      WebkitTextFillColor: cs.webkitTextFillColor,
      textRendering: cs.textRendering,
      transform: cs.transform,
      willChange: cs.willChange
    }
    // 부모 체인 필터 추적
    const parents = []
    let el = title.parentElement
    while (el && el !== document.body) {
      const pcs = getComputedStyle(el)
      if (pcs.filter !== 'none' || pcs.backdropFilter !== 'none' || pcs.transform !== 'none' || pcs.opacity !== '1') {
        parents.push({
          tag: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : ''),
          filter: pcs.filter,
          backdropFilter: pcs.backdropFilter,
          transform: pcs.transform,
          opacity: pcs.opacity
        })
      }
      el = el.parentElement
    }
    results.parents = parents
    
    // 자식 span 체크
    const spans = title.querySelectorAll('.title-line')
    results.spans = [...spans].map(s => {
      const cs = getComputedStyle(s)
      return {
        text: s.textContent,
        filter: cs.filter,
        textShadow: cs.textShadow,
        opacity: cs.opacity,
        WebkitTextStroke: cs.webkitTextStroke,
        fontWeight: cs.fontWeight,
        fontSize: cs.fontSize
      }
    })
  }
  return results
})

console.log(JSON.stringify(diag, null, 2))
await browser.close()
