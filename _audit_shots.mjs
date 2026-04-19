import { chromium } from 'playwright';
const browser = await chromium.launch();

const pages = ['/', '/about', '/doctors', '/treatments', '/treatments/implant',
               '/treatments/aesthetic', '/treatments/resin', '/treatments/tmj',
               '/treatments/general', '/cases', '/blogs', '/faq', '/dictionary',
               '/notices', '/visit'];

async function shoot(vw, vh, isMobile, label) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile });
  const page = await ctx.newPage();
  for (const p of pages) {
    const slug = p === '/' ? 'home' : p.replace(/\//g, '_').replace(/^_/,'');
    try {
      await page.goto(`https://eumdc.kr${p}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `_audit/final/${label}_${slug}.png`, fullPage: false });
      console.log(`✅ ${label} ${p}`);
    } catch (e) {
      console.log(`❌ ${label} ${p}: ${e.message.slice(0,40)}`);
    }
  }
  await ctx.close();
}

await shoot(390, 844, true, 'mobile');
await shoot(1440, 900, false, 'desktop');
await browser.close();
console.log('Done');
