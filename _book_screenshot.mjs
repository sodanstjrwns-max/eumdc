import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/doctors/choi-hyoyoung', { waitUntil: 'networkidle' });
// 저서 섹션까지 스크롤
await page.evaluate(() => {
  const el = document.querySelector('.doctor-book-section');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/book-desktop.png', fullPage: false });

// 모바일
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mob = await mobCtx.newPage();
await mob.goto('https://eumdc.kr/doctors/choi-hyoyoung', { waitUntil: 'networkidle' });
await mob.evaluate(() => {
  const el = document.querySelector('.doctor-book-section');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await mob.waitForTimeout(1500);
await mob.screenshot({ path: '/tmp/book-mobile.png', fullPage: false });

console.log('Screenshots saved');
await browser.close();
