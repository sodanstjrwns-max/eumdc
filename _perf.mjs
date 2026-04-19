import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const t0 = Date.now();
await page.goto('https://eumdc.kr/', { waitUntil: 'load' });
const tLoad = Date.now() - t0;

const perf = await page.evaluate(() => {
  const t = performance.timing;
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  return {
    TTFB: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
    DCL: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
    Load: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
    FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime ? Math.round(paint.find(p => p.name === 'first-contentful-paint').startTime) : null,
  };
});

const sizes = await page.evaluate(() => {
  const entries = performance.getEntriesByType('resource');
  const total = entries.reduce((s, e) => s + (e.transferSize || 0), 0);
  const js = entries.filter(e => e.name.endsWith('.js')).reduce((s, e) => s + (e.transferSize || 0), 0);
  const css = entries.filter(e => e.name.endsWith('.css')).reduce((s, e) => s + (e.transferSize || 0), 0);
  const img = entries.filter(e => /\.(png|jpg|jpeg|webp|svg|gif)/.test(e.name)).reduce((s, e) => s + (e.transferSize || 0), 0);
  const font = entries.filter(e => /fonts|\.woff/.test(e.name)).reduce((s, e) => s + (e.transferSize || 0), 0);
  return { total, js, css, img, font, count: entries.length };
});

console.log('Performance:');
console.log(`  TTFB:        ${perf.TTFB} ms`);
console.log(`  FCP:         ${perf.FCP} ms`);
console.log(`  DCL:         ${perf.DCL} ms`);
console.log(`  Load:        ${perf.Load} ms (playwright measured ${tLoad} ms)`);
console.log('');
console.log(`Resource size:`);
console.log(`  Total:   ${(sizes.total/1024).toFixed(1)} KB (${sizes.count} files)`);
console.log(`  JS:      ${(sizes.js/1024).toFixed(1)} KB`);
console.log(`  CSS:     ${(sizes.css/1024).toFixed(1)} KB`);
console.log(`  Image:   ${(sizes.img/1024).toFixed(1)} KB`);
console.log(`  Font:    ${(sizes.font/1024).toFixed(1)} KB`);

await browser.close();
