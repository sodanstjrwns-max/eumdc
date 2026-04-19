import { chromium } from 'playwright';
const browser = await chromium.launch();
const m = await browser.newContext({
  viewport: { width: 390, height: 1000 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
});
const mp = await m.newPage();
await mp.goto('https://eumdc.kr', { waitUntil: 'domcontentloaded', timeout: 30000 });
await mp.waitForTimeout(4000);

// 모든 섹션 위치 먼저 찍어보기
const allSections = await mp.evaluate(() => {
  const sections = document.querySelectorAll('section, .marquee-band, .gallery-strip');
  return Array.from(sections).map(el => ({
    tag: el.tagName,
    cls: el.className.substring(0, 60),
    id: el.id,
    docTop: Math.round(el.getBoundingClientRect().top + window.scrollY),
    height: Math.round(el.getBoundingClientRect().height)
  })).filter(s => s.height > 100);
});
console.log('=== All sections ===');
allSections.forEach(s => console.log(`[${s.docTop}..${s.docTop + s.height}] ${s.tag}.${s.cls.substring(0,40)} #${s.id}`));

// Stats section element 직접 screenshot
const statsEl = await mp.$('.story-stats');
if (statsEl) {
  await statsEl.scrollIntoViewIfNeeded();
  await mp.waitForTimeout(2000);
  // 요소 자체만 크롭
  await statsEl.screenshot({ path: '/home/user/webapp/_audit/v6c_stats_element.png' });
  console.log('✓ stats element shot');
  
  const statsInfo = await statsEl.evaluate(el => {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      bgColor: cs.backgroundColor,
      viewport: { top: rect.top, height: rect.height, visible: rect.top < window.innerHeight && rect.bottom > 0 }
    };
  });
  console.log('Stats status:', JSON.stringify(statsInfo, null, 2));
}

// Gallery 요소 스크린샷
const galEl = await mp.$('.gallery-strip');
if (galEl) {
  await galEl.scrollIntoViewIfNeeded();
  await mp.waitForTimeout(2000);
  await galEl.screenshot({ path: '/home/user/webapp/_audit/v6c_gallery_element.png' });
  console.log('✓ gallery element shot');
}

await browser.close();
console.log('✅ done');
