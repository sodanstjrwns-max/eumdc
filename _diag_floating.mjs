import { chromium } from 'playwright';

const viewports = [
  { name: 'MOBILE', width: 390, height: 844 },
  { name: 'DESKTOP', width: 1440, height: 900 },
];

const browser = await chromium.launch();

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto('https://eumdc.kr', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Scroll a bit so floating is visible
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(800);

  const data = await page.evaluate(() => {
    const group = document.querySelector('.floating-cta-group');
    if (!group) return { error: 'no group' };
    const gs = getComputedStyle(group);
    const gr = group.getBoundingClientRect();
    const btns = Array.from(group.querySelectorAll('.floating-btn')).map((b) => {
      const s = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      return {
        cls: b.className,
        width: s.width,
        height: s.height,
        display: s.display,
        flexDirection: s.flexDirection,
        rectW: Math.round(r.width),
        rectH: Math.round(r.height),
        x: Math.round(r.left),
        y: Math.round(r.top),
        hasLabel: !!b.querySelector('.floating-btn-label'),
      };
    });
    return {
      groupClass: group.className,
      groupBottom: gs.bottom,
      groupRight: gs.right,
      groupDisplay: gs.display,
      groupFlexDir: gs.flexDirection,
      groupGap: gs.gap,
      groupZ: gs.zIndex,
      groupWidth: Math.round(gr.width),
      groupHeight: Math.round(gr.height),
      groupX: Math.round(gr.left),
      groupY: Math.round(gr.top),
      btns,
    };
  });
  console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
  console.log(JSON.stringify(data, null, 2));

  await page.screenshot({
    path: `_audit/floating_${vp.name.toLowerCase()}.png`,
    clip: { x: vp.width - 220, y: vp.height - 260, width: 220, height: 260 },
  });
  await ctx.close();
}
await browser.close();
console.log('\n✅ diag done');
