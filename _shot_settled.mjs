import { chromium } from 'playwright';
const browser = await chromium.launch();

for (const [vw, vh, label, mobile] of [[1440, 900, 'desktop', false], [390, 844, 'mobile', true]]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile: mobile });
  const page = await ctx.newPage();
  await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);  // 5초 대기 - 애니메이션 완료
  await page.screenshot({ path: `_audit/final/${label}_home_settled.png` });
  await ctx.close();
  console.log(`${label} done`);
}
await browser.close();
