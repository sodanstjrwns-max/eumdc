import { chromium } from 'playwright';
const browser = await chromium.launch();

// Desktop
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const el = document.querySelector('#section-book');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/main-book-desktop.png', fullPage: false });

// Mobile
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mob = await mobCtx.newPage();
await mob.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await mob.evaluate(() => {
  const el = document.querySelector('#section-book');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await mob.waitForTimeout(2000);
await mob.screenshot({ path: '/tmp/main-book-mobile.png', fullPage: false });

console.log('Screenshots saved');
await browser.close();
