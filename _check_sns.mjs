import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/cases?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
const footer = await page.$('footer.footer-full');
await footer.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const info = await page.evaluate(() => {
  const sns = document.querySelectorAll('.footer-sns a');
  return Array.from(sns).map(a => {
    const s = getComputedStyle(a);
    return {
      w: s.width, h: s.height, border: s.border, bg: s.backgroundColor, radius: s.borderRadius, color: s.color,
    };
  });
});
console.log(JSON.stringify(info, null, 2));
// 클로즈업 스크린샷
const sns = await page.$('.footer-sns');
if (sns) await sns.screenshot({ path: '/tmp/footer_sns_close.png' });
await browser.close();
