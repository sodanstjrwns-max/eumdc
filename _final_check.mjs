import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Capture errors and warnings
const errors = [];
const warnings = [];
const failedRequests = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => {
  if (m.type() === 'error') errors.push(`[console] ${m.text()}`);
  else if (m.type() === 'warning') warnings.push(`[warn] ${m.text()}`);
});
page.on('requestfailed', r => failedRequests.push(`${r.url()} - ${r.failure()?.errorText}`));

const routes = [
  '/', '/about', '/doctors', '/treatments', '/cases', '/blogs',
  '/faq', '/dictionary', '/notices',
  '/treatments/implant', '/treatments/prosthetics', '/treatments/resin',
  '/treatments/tmj', '/treatments/general'
];

console.log('=== ROUTE STATUS CHECK ===');
for (const route of routes) {
  try {
    const res = await page.goto(`https://eumdc.kr${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const title = await page.title();
    console.log(`${res.status()} ${route.padEnd(30)} → ${title.slice(0,50)}`);
  } catch (e) {
    console.log(`ERR ${route.padEnd(30)} → ${e.message.slice(0,60)}`);
  }
}

console.log('\n=== PAGE ERRORS ===');
console.log(errors.length ? errors.slice(0,20).join('\n') : '✅ No JS errors');

console.log('\n=== FAILED REQUESTS ===');
console.log(failedRequests.length ? failedRequests.slice(0,20).join('\n') : '✅ All assets loaded');

console.log('\n=== WARNINGS (top 10) ===');
console.log(warnings.slice(0,10).join('\n') || '✅ No warnings');

await browser.close();
