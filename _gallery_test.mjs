import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
await p.goto('https://eumdc.kr?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2000);
await p.evaluate(() => {
  const g = document.querySelector('.gallery-strip');
  if (g) g.scrollIntoView({ block: 'center' });
});
await p.waitForTimeout(1000);

const before = await p.evaluate(() => {
  const g = document.querySelector('.gallery-strip');
  const t = document.querySelector('.gallery-track');
  return {
    scrollLeft: g?.scrollLeft,
    overflowX: getComputedStyle(g).overflowX,
    touchAction: getComputedStyle(g).touchAction,
    animation: getComputedStyle(t).animation.substring(0, 30),
    trackWidth: t?.scrollWidth,
    containerWidth: g?.clientWidth
  };
});
console.log('BEFORE:', JSON.stringify(before, null, 2));

// 스와이프 시뮬레이션
await p.evaluate(() => {
  const g = document.querySelector('.gallery-strip');
  if (g) g.scrollBy({ left: 300, behavior: 'smooth' });
});
await p.waitForTimeout(1200);

const after = await p.evaluate(() => {
  const g = document.querySelector('.gallery-strip');
  return { scrollLeft: g?.scrollLeft };
});
console.log('AFTER swipe:', JSON.stringify(after));
console.log('✅ Swipe working:', after.scrollLeft > 0);

const el = await p.$('.gallery-strip');
if (el) await el.screenshot({ path: '/home/user/webapp/_audit/v9_gallery.png' });
await b.close();
