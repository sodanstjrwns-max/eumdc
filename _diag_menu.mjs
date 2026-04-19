import { chromium } from 'playwright';

const viewports = [
  { name: 'MOBILE', width: 390, height: 844 },
  { name: 'TABLET', width: 768, height: 1024 },
  { name: 'DESKTOP', width: 1440, height: 900 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  await page.goto('https://eumdc.kr', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // 메뉴 열기
  await page.click('#menuBtn');
  await page.waitForTimeout(1000);

  const data = await page.evaluate(() => {
    const menu = document.querySelector('.full-menu');
    const content = document.querySelector('.menu-content');
    const links = Array.from(document.querySelectorAll('.menu-link'));
    const cs = (el) => el ? getComputedStyle(el) : {};
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left), y: Math.round(r.top) };
    };
    return {
      viewportH: window.innerHeight,
      menuOpen: menu?.classList.contains('open'),
      contentPadding: cs(content).padding,
      contentOverflow: cs(content).overflow || cs(content).overflowY,
      linksCount: links.length,
      firstLink: links[0] ? {
        text: links[0].textContent.trim(),
        fontSize: cs(links[0]).fontSize,
        fontWeight: cs(links[0]).fontWeight,
        padding: cs(links[0]).padding,
        ...rect(links[0]),
      } : null,
      lastLink: links[links.length - 1] ? {
        text: links[links.length - 1].textContent.trim(),
        fontSize: cs(links[links.length - 1]).fontSize,
        ...rect(links[links.length - 1]),
      } : null,
      totalListHeight: links.length > 0 ? (links[links.length - 1].getBoundingClientRect().bottom - links[0].getBoundingClientRect().top) : 0,
    };
  });

  console.log(`\n=== ${vp.name} (${vp.width}×${vp.height}) ===`);
  console.log(JSON.stringify(data, null, 2));

  await page.screenshot({ path: `_audit/menu_${vp.name.toLowerCase()}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log('\n✅ done');
