import { chromium } from 'playwright';
const browser = await chromium.launch();

// Desktop — fullPage로 찍어서 섹션 위치 찾기
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// section-book 위치 직접 검사
const rect = await page.evaluate(() => {
  const el = document.querySelector('#section-book');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height, visible: !!el };
});
console.log('Book section position:', rect);

// 스크롤 강제로 해당 위치로
if (rect) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), rect.top);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/main-book-desktop2.png', fullPage: false });
}

// Mobile
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mob = await mobCtx.newPage();
await mob.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await mob.waitForTimeout(1500);

const mobRect = await mob.evaluate(() => {
  const el = document.querySelector('#section-book');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
});
if (mobRect) {
  await mob.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), mobRect.top);
  await mob.waitForTimeout(2000);
  await mob.screenshot({ path: '/tmp/main-book-mobile2.png', fullPage: false });
}

await browser.close();
