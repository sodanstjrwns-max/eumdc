import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const vp of [{n:'mobile',w:390,h:844},{n:'desktop',w:1440,h:900}]) {
  const ctx = await browser.newContext({ viewport: {width:vp.w,height:vp.h} });
  const page = await ctx.newPage();
  await page.goto('https://eumdc.kr', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `_audit/v15_floating_${vp.n}.png`,
    clip: { x: vp.w-200, y: vp.h-240, width: 200, height: 240 }});
  await ctx.close();
}
await browser.close();
console.log('✅ shots');
