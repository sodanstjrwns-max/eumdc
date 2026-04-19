import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const vp of [{n:'mobile',w:390,h:844},{n:'tablet',w:768,h:1024},{n:'desktop',w:1440,h:900}]) {
  const ctx = await browser.newContext({ viewport: {width:vp.w,height:vp.h} });
  const page = await ctx.newPage();
  await page.goto('https://eumdc.kr?_v=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.click('#menuBtn');
  // 애니메이션 완료 대기
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `_audit/menu_final_${vp.n}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log('✅ final shots done');
