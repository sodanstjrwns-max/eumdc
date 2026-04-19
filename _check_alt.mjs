import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });

const missingAlt = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('img'))
    .filter(i => !i.alt || i.alt.trim() === '')
    .map(i => ({
      src: i.src.replace('https://eumdc.kr', ''),
      cls: i.className?.slice(0, 40),
      parentCls: i.parentElement?.className?.slice(0, 40) || ''
    }));
});
console.log(JSON.stringify(missingAlt, null, 2));
await browser.close();
