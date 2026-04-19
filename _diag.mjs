import { chromium } from 'playwright';
const browser = await chromium.launch();
const m = await browser.newContext({
  viewport: { width: 390, height: 1000 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mp = await m.newPage();
await mp.goto('https://eumdc.kr', { waitUntil: 'domcontentloaded', timeout: 30000 });
await mp.waitForTimeout(4000);

const diag = await mp.evaluate(() => {
  const stats = document.querySelector('.story-stats');
  const inner = document.querySelector('.story-stats-inner');
  const items = document.querySelectorAll('.story-stats .hero-stat');
  
  return {
    statsRect: stats ? { w: stats.offsetWidth, h: stats.offsetHeight, display: getComputedStyle(stats).display } : null,
    innerRect: inner ? { 
      w: inner.offsetWidth, 
      h: inner.offsetHeight, 
      display: getComputedStyle(inner).display,
      visibility: getComputedStyle(inner).visibility,
      opacity: getComputedStyle(inner).opacity,
      childCount: inner.children.length,
      html: inner.outerHTML.substring(0, 500)
    } : null,
    items: Array.from(items).map(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        opacity: cs.opacity,
        visibility: cs.visibility,
        display: cs.display,
        transform: cs.transform,
        content: el.textContent.replace(/\s+/g, ' ').substring(0, 100)
      };
    }),
    statsParent: stats ? stats.parentElement.className : null,
  };
});
console.log(JSON.stringify(diag, null, 2));

await browser.close();
