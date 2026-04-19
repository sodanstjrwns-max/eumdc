import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
// anchor hash로 직접 접근
await page.goto('https://eumdc.kr/#section-book', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000); // 시네마틱 애니메이션 완료 대기
await page.screenshot({ path: '/tmp/book-anchor-desktop.png', fullPage: false });

const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mobCtx.newPage();
await mpage.goto('https://eumdc.kr/#section-book', { waitUntil: 'networkidle' });
await mpage.waitForTimeout(5000);
await mpage.screenshot({ path: '/tmp/book-anchor-mobile.png', fullPage: false });

console.log('Done');
await browser.close();
