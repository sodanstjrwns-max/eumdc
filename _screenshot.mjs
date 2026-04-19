import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.BASE || 'http://localhost:3000';
const OUT = '/home/user/webapp/_audit';
fs.mkdirSync(OUT, { recursive: true });

const target = process.argv[2] || 'all';

const ALL = [
  { name: 'home',       path: '/' },
  { name: 'doctors',    path: '/doctors' },
  { name: 'treatments', path: '/treatments' },
  { name: 'cases',      path: '/cases' },
  { name: 'faq',        path: '/faq' },
  { name: 'about',      path: '/about' },
];
const pages = target === 'all' ? ALL : ALL.filter(p => p.name === target);

const viewports = [
  { tag: 'desktop', width: 1440, height: 900 },
  { tag: 'mobile',  width: 390,  height: 844, isMobile: true, dpr: 2 },
];

const browser = await chromium.launch();
for (const v of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: v.dpr || 1,
    userAgent: v.isMobile
      ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
      : undefined,
  });
  const page = await ctx.newPage();
  for (const p of pages) {
    try {
      await page.goto(BASE + p.path, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1500);
      // Above-the-fold first
      await page.screenshot({ path: `${OUT}/${p.name}_${v.tag}_atf.png`, fullPage: false });
      console.log('ATF', p.name, v.tag);
    } catch (e) {
      console.log('FAIL', p.path, v.tag, e.message);
    }
  }
  await ctx.close();
}
await browser.close();
console.log('DONE');
