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

// Stats 섹션 위치 탐색
const statsPos = await mp.evaluate(() => {
  const el = document.querySelector('.story-stats');
  if (!el) return { error: 'no element' };
  const r = el.getBoundingClientRect();
  const docTop = r.top + window.scrollY;
  const nums = Array.from(document.querySelectorAll('.story-stats .hero-stat-num')).map(n => ({
    text: n.textContent,
    dataCount: n.getAttribute('data-count'),
    color: getComputedStyle(n).color,
    bgClip: getComputedStyle(n).webkitBackgroundClip || getComputedStyle(n).backgroundClip,
    fontSize: getComputedStyle(n).fontSize,
  }));
  const bg = getComputedStyle(el).background;
  return { docTop, height: r.height, numbers: nums, bg: bg.substring(0, 200) };
});
console.log('Stats info:', JSON.stringify(statsPos, null, 2));

// 명시적 스크롤 위치로 이동
if (statsPos.docTop) {
  await mp.evaluate((y) => window.scrollTo({ top: y - 100, behavior: 'instant' }), statsPos.docTop);
  await mp.waitForTimeout(3000);
  await mp.screenshot({ path: '/home/user/webapp/_audit/v6b_stats_real.png', fullPage: false });
}

// 갤러리도 확인
const galInfo = await mp.evaluate(() => {
  const el = document.querySelector('.gallery-strip');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { 
    docTop: r.top + window.scrollY, 
    scrollable: el.scrollWidth > el.clientWidth,
    overflowX: getComputedStyle(el).overflowX,
    touchAction: getComputedStyle(el).touchAction
  };
});
console.log('Gallery info:', JSON.stringify(galInfo, null, 2));

if (galInfo && galInfo.docTop) {
  await mp.evaluate((y) => window.scrollTo({ top: y - 150, behavior: 'instant' }), galInfo.docTop);
  await mp.waitForTimeout(2000);
  await mp.screenshot({ path: '/home/user/webapp/_audit/v6b_gallery_real.png', fullPage: false });
}

await browser.close();
console.log('✅ done');
