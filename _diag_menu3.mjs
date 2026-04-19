import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr?_v=' + Date.now(), { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.click('#menuBtn');
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const menu = document.querySelector('.full-menu');
  const overlay = document.querySelector('.menu-overlay');
  const cs = getComputedStyle(menu);
  const cso = getComputedStyle(overlay);
  return {
    menuBg: cs.backgroundColor,
    menuBgImage: cs.backgroundImage,
    overlayBg: cso.backgroundColor,
    overlayOpacity: cso.opacity,
    overlayPos: cso.position,
    menuPos: cs.position,
    menuClip: cs.clipPath,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: '_audit/menu_desktop_v161.png', fullPage: false });
await browser.close();
