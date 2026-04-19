import { chromium } from 'playwright';
const url = process.argv[2];
const out = process.argv[3];
const w = parseInt(process.argv[4] || '1440');
const h = parseInt(process.argv[5] || '900');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'commit', timeout: 10000 });
await page.waitForTimeout(6500);
await page.screenshot({ path: out, fullPage: false });
console.log('OK', out);
await browser.close();
