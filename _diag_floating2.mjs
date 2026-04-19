import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 1000));
await page.waitForTimeout(1500);

const out = await page.evaluate(() => {
  const group = document.querySelector('.floating-cta-group');
  const gs = getComputedStyle(group);
  const btns = Array.from(group.querySelectorAll('.floating-btn'));
  return {
    group: {
      alignItems: gs.alignItems,
      justifyContent: gs.justifyContent,
      width: gs.width,
    },
    btns: btns.map((b) => {
      const s = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      return {
        cls: b.className,
        padding: s.padding,
        margin: s.margin,
        borderWidth: s.borderWidth,
        boxSizing: s.boxSizing,
        outline: s.outline,
        position: s.position,
        left: s.left,
        right: s.right,
        transform: s.transform,
        alignSelf: s.alignSelf,
        rectX: Math.round(r.left * 100) / 100,
        rectRight: Math.round(r.right * 100) / 100,
        offsetW: b.offsetWidth,
      };
    }),
  };
});
console.log(JSON.stringify(out, null, 2));
await browser.close();
