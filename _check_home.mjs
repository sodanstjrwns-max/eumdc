import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
// 끝까지 스크롤
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
// footer-full 내부의 footer-brand-big 확인
const info = await page.evaluate(() => {
  const footer = document.querySelector('footer.footer-full');
  if (!footer) return { exists: false };
  const rect = footer.getBoundingClientRect();
  const brand = footer.querySelector('.footer-brand-big');
  const brandStyle = brand ? getComputedStyle(brand) : null;
  const brandRect = brand ? brand.getBoundingClientRect() : null;
  return {
    exists: true,
    rect: { y: rect.y, h: rect.height, w: rect.width },
    brandText: brand?.textContent,
    brandColor: brandStyle?.color,
    brandSize: brandStyle?.fontSize,
    brandOpacity: brandStyle?.opacity,
    brandRect: brandRect ? { x: brandRect.x, y: brandRect.y, w: brandRect.width, h: brandRect.height } : null,
    footerBg: getComputedStyle(footer).backgroundColor,
  };
});
console.log(JSON.stringify(info, null, 2));
await footer_scroll_and_ss(page);
async function footer_scroll_and_ss(p) {
  const el = await p.$('footer.footer-full');
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(800);
    await el.screenshot({ path: '/tmp/footer_home_full.png' });
  }
}
await browser.close();
