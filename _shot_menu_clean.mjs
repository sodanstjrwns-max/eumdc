import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: {width:1440,height:900} });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr?_v=' + Date.now(), { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.click('#menuBtn');
// 훨씬 더 오래 기다림 (모든 애니메이션 완료 후)
await page.waitForTimeout(4000);
await page.screenshot({ path: '_audit/menu_clean_desktop.png', fullPage: false });

// blur 값 측정
const blur = await page.evaluate(() => {
  const link = document.querySelector('.menu-link');
  return {
    filter: getComputedStyle(link).filter,
    transform: getComputedStyle(link).transform,
    opacity: getComputedStyle(link).opacity,
  };
});
console.log(JSON.stringify(blur, null, 2));
await browser.close();
