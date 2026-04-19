import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const data = await page.evaluate(() => {
  const hero = document.querySelector('.hero-title, .hero h1, [class*="hero"]');
  const all = [];
  document.querySelectorAll('.hero, .hero-title, .hero-subtitle, .hero-cta, .hero-cta-wrap, .hero-text, .hero-inner').forEach(el => {
    const cs = getComputedStyle(el);
    all.push({
      cls: el.className.slice(0, 40),
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      filter: cs.filter,
      transform: cs.transform.slice(0, 40),
      textContent: el.textContent?.slice(0, 30)
    });
  });
  return all;
});
console.log(JSON.stringify(data, null, 2));

await browser.close();
