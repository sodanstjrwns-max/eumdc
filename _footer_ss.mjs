import { chromium } from 'playwright';

const browser = await chromium.launch();
const urls = [
  { name: 'desktop-home', url: 'https://eumdc.kr/', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-cases', url: 'https://eumdc.kr/cases', viewport: { width: 1440, height: 900 } },
  { name: 'mobile-home', url: 'https://eumdc.kr/', viewport: { width: 390, height: 844 } },
];

for (const { name, url, viewport } of urls) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto(url + '?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 30000 });
  const footer = await page.$('footer');
  if (footer) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await footer.screenshot({ path: `/tmp/footer_${name}.png` });
    console.log(`✓ ${name}`);
  } else {
    console.log(`✗ ${name} no footer`);
  }
  await ctx.close();
}
await browser.close();
