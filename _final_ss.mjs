import { chromium } from 'playwright';
const browser = await chromium.launch();
for (const { name, url, vp } of [
  { name: 'desktop-cases', url: 'https://eumdc.kr/cases', vp: { width: 1440, height: 900 } },
  { name: 'desktop-blogs', url: 'https://eumdc.kr/blogs', vp: { width: 1440, height: 900 } },
  { name: 'tablet-cases', url: 'https://eumdc.kr/cases', vp: { width: 800, height: 1000 } },
  { name: 'mobile-cases', url: 'https://eumdc.kr/cases', vp: { width: 390, height: 844 } },
]) {
  const ctx = await browser.newContext({ viewport: vp });
  const p = await ctx.newPage();
  await p.goto(url + '?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
  const footer = await p.$('footer.footer-full');
  if (footer) {
    await footer.scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    await footer.screenshot({ path: `/tmp/ftr_${name}.png` });
    console.log(`✓ ${name}`);
  }
  await ctx.close();
}
await browser.close();
