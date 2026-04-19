import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('https://eumdc.kr/cases?v=' + Date.now(), { waitUntil: 'networkidle' });
const info = await p.evaluate(() => {
  const cols = document.querySelectorAll('.footer-nav-col');
  return Array.from(cols).map(c => {
    const h4 = c.querySelector('h4');
    const s = getComputedStyle(c);
    const hs = h4 ? getComputedStyle(h4) : null;
    return { text: h4?.textContent, colOpacity: s.opacity, colVis: s.visibility, h4Color: hs?.color };
  });
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
