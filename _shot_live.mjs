import { chromium } from 'playwright';
const browser = await chromium.launch();
const m = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
});
const mp = await m.newPage();
await mp.goto('https://eumdc.kr', { waitUntil: 'networkidle', timeout: 30000 });
await mp.waitForTimeout(3000);
await mp.screenshot({ path: '/home/user/webapp/_audit/LIVE_mobile_hero.png', fullPage: false });

const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await d.newPage();
await dp.goto('https://eumdc.kr', { waitUntil: 'networkidle', timeout: 30000 });
await dp.waitForTimeout(3000);
await dp.screenshot({ path: '/home/user/webapp/_audit/LIVE_desktop_hero.png', fullPage: false });

await browser.close();
console.log('✅ LIVE shots saved');
