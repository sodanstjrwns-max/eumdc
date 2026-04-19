import { chromium } from 'playwright';
const browser = await chromium.launch();
const m = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
});
const mp = await m.newPage();
await mp.goto('https://eumdc.kr', { waitUntil: 'networkidle', timeout: 30000 });
await mp.waitForTimeout(3000);

// 스크롤해서 stats 섹션까지
await mp.evaluate(() => {
  const el = document.querySelector('.story-stats');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await mp.waitForTimeout(2500);
await mp.screenshot({ path: '/home/user/webapp/_audit/v6_stats.png', fullPage: false });

// 스크롤해서 gallery 섹션까지
await mp.evaluate(() => {
  const el = document.querySelector('.gallery-strip');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await mp.waitForTimeout(2500);
await mp.screenshot({ path: '/home/user/webapp/_audit/v6_gallery.png', fullPage: false });

// 갤러리 터치 스크롤 테스트
const galleryBox = await mp.evaluate(() => {
  const el = document.querySelector('.gallery-strip');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width/2, y: r.y + r.height/2, scrollable: el.scrollWidth > el.clientWidth };
});
console.log('Gallery scrollable:', galleryBox);

if (galleryBox && galleryBox.scrollable) {
  // 실제 스와이프
  await mp.touchscreen.tap(galleryBox.x, galleryBox.y);
  await mp.waitForTimeout(500);
  await mp.evaluate(() => {
    const el = document.querySelector('.gallery-strip');
    el.scrollBy({ left: 250, behavior: 'smooth' });
  });
  await mp.waitForTimeout(1500);
  await mp.screenshot({ path: '/home/user/webapp/_audit/v6_gallery_scrolled.png', fullPage: false });
}

await browser.close();
console.log('✅ v6 shots done');
