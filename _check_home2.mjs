import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });

// 직접 footer 위치로 scroll 점프
await page.evaluate(() => {
  const footer = document.querySelector('footer.footer-full');
  footer?.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const footer = document.querySelector('footer.footer-full');
  const rect = footer.getBoundingClientRect();
  return { scrollY: window.scrollY, vpH: window.innerHeight, footerY: rect.y, footerH: rect.height };
});
console.log(JSON.stringify(info, null, 2));
// 전체 뷰포트 스크린샷
await page.screenshot({ path: '/tmp/home_footer_viewport.png', fullPage: false });
await browser.close();
