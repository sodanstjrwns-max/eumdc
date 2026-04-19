import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle', timeout: 30000 });

// 시네마틱 엔진/Lenis 강제 disable & reveal 요소 강제 표시
await page.evaluate(() => {
  // Lenis / GSAP 해제
  if (window.lenis) window.lenis.destroy();
  // reveal 요소 모두 표시
  document.querySelectorAll('[data-reveal], .reveal, [data-hover]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
    el.classList.add('is-visible', 'revealed');
  });
  // 본문 스크롤 허용
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
});

// 섹션 위치로 스크롤
await page.evaluate(() => {
  const el = document.querySelector('#section-book');
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, y);
  }
});
await page.waitForTimeout(2500);
await page.screenshot({ path: '/tmp/book-final-desktop.png', fullPage: false });

// Mobile
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mobCtx.newPage();
await mpage.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await mpage.evaluate(() => {
  if (window.lenis) window.lenis.destroy();
  document.querySelectorAll('[data-reveal], .reveal, [data-hover]').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  });
  document.documentElement.style.overflow = 'auto';
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
});
await mpage.evaluate(() => {
  const el = document.querySelector('#section-book');
  if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
});
await mpage.waitForTimeout(2500);
await mpage.screenshot({ path: '/tmp/book-final-mobile.png', fullPage: false });

console.log('Done');
await browser.close();
