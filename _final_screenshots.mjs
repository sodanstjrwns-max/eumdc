import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
mkdirSync('_audit/v20', { recursive: true })

const browser = await chromium.launch()
const sites = ['https://eumdc.kr/', 'https://eumdc.kr/treatments', 'https://eumdc.kr/about']

for (const url of sites) {
  const slug = url.replace('https://eumdc.kr/', '').replace(/\//g, '_') || 'home'
  
  // Desktop
  const cDesk = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const pDesk = await cDesk.newPage()
  const consoleErr = []
  pDesk.on('pageerror', e => consoleErr.push(`PAGEERROR: ${e.message}`))
  pDesk.on('console', msg => { if (msg.type() === 'error') consoleErr.push(`ERROR: ${msg.text()}`) })
  await pDesk.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await pDesk.waitForTimeout(3500)
  await pDesk.screenshot({ path: `_audit/v20/desktop_${slug}.png`, fullPage: false })
  console.log(`desktop ${slug}: ${consoleErr.length ? '❌ ' + consoleErr.join(', ') : '✅ no errors'}`)
  await cDesk.close()

  // Mobile
  const cMob = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 3 })
  const pMob = await cMob.newPage()
  const consoleErrM = []
  pMob.on('pageerror', e => consoleErrM.push(`PAGEERROR: ${e.message}`))
  pMob.on('console', msg => { if (msg.type() === 'error') consoleErrM.push(`ERROR: ${msg.text()}`) })
  await pMob.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await pMob.waitForTimeout(3500)
  await pMob.screenshot({ path: `_audit/v20/mobile_${slug}.png`, fullPage: false })
  console.log(`mobile  ${slug}: ${consoleErrM.length ? '❌ ' + consoleErrM.join(', ') : '✅ no errors'}`)
  await cMob.close()
}

await browser.close()
console.log('done')
