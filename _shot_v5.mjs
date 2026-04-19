import { chromium } from 'playwright';
import fs from 'fs';

const OUT = '/home/user/webapp/_audit';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Mobile iPhone 12
const m = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
});
const mp = await m.newPage();
await mp.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await mp.waitForTimeout(3000);
await mp.screenshot({ path: `${OUT}/v5_mobile_hero.png`, fullPage: false });
console.log('✓ mobile_hero');

await mp.evaluate(() => window.scrollTo(0, 700));
await mp.waitForTimeout(1500);
await mp.screenshot({ path: `${OUT}/v5_mobile_scroll1.png`, fullPage: false });

await mp.evaluate(() => window.scrollTo(0, 1400));
await mp.waitForTimeout(1500);
await mp.screenshot({ path: `${OUT}/v5_mobile_scroll2.png`, fullPage: false });

// Full page mobile
await mp.evaluate(() => window.scrollTo(0, 0));
await mp.waitForTimeout(1000);
await mp.screenshot({ path: `${OUT}/v5_mobile_full.png`, fullPage: true });
console.log('✓ mobile_full');

await m.close();

// Desktop
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await d.newPage();
await dp.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await dp.waitForTimeout(3000);
await dp.screenshot({ path: `${OUT}/v5_desktop_hero.png`, fullPage: false });
console.log('✓ desktop_hero');

await dp.evaluate(() => window.scrollTo(0, 1200));
await dp.waitForTimeout(1500);
await dp.screenshot({ path: `${OUT}/v5_desktop_scroll.png`, fullPage: false });

await d.close();
await browser.close();
console.log('✅ DONE');
