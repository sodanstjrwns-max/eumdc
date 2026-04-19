import { chromium } from 'playwright';

const browser = await chromium.launch();

// Desktop
const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const pageD = await ctxD.newPage();
await pageD.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await pageD.click('#menuBtn');
await pageD.waitForTimeout(2000);
await pageD.screenshot({ path: '_audit/v16_menu_desktop_final.png' });

// Mobile  
const ctxM = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const pageM = await ctxM.newPage();
await pageM.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await pageM.click('#menuBtn');
await pageM.waitForTimeout(2000);
await pageM.screenshot({ path: '_audit/v16_menu_mobile_final.png' });

// Metrics
const metrics = await pageD.evaluate(() => {
  const links = document.querySelectorAll('.menu-link');
  const first = links[0];
  const cs = getComputedStyle(first);
  return {
    fontSize: cs.fontSize,
    fontWeight: cs.fontWeight,
    letterSpacing: cs.letterSpacing,
    linkCount: links.length,
    firstText: first?.textContent?.trim()
  };
});
console.log(JSON.stringify(metrics, null, 2));

await browser.close();
