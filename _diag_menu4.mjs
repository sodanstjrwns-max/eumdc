import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr?_v=' + Date.now(), { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// menuBtn 찾고 상태 확인
const btnExists = await page.evaluate(() => !!document.getElementById('menuBtn'));
console.log('menuBtn exists:', btnExists);
await page.click('#menuBtn');
// 즉시 + 200ms + 600ms + 1500ms 시점 각각 측정
for (const t of [100, 500, 1000, 2000]) {
  await page.waitForTimeout(t === 100 ? 100 : (t - (t === 500 ? 100 : t === 1000 ? 500 : 1000)));
  const snap = await page.evaluate(() => {
    const menu = document.querySelector('.full-menu');
    return {
      open: menu.classList.contains('open'),
      clip: getComputedStyle(menu).clipPath,
      ariaHidden: menu.getAttribute('aria-hidden'),
    };
  });
  console.log(`@${t}ms:`, JSON.stringify(snap));
}
// 모든 .full-menu.open 룰의 clip-path 체크
const rules = await page.evaluate(() => {
  const menu = document.querySelector('.full-menu.open');
  if (!menu) return null;
  // getMatchedCSSRules는 deprecated지만 devtools protocol 대신 수동 확인
  const sheets = Array.from(document.styleSheets);
  const results = [];
  sheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      rules.forEach((r) => {
        if (r.selectorText && r.selectorText.includes('.full-menu.open') && !r.selectorText.includes('.menu-link')) {
          results.push({
            selector: r.selectorText,
            cssText: r.cssText.substring(0, 200),
            href: sheet.href ? sheet.href.split('/').slice(-1)[0] : 'inline',
          });
        }
        if (r.media) {
          const mediaRules = Array.from(r.cssRules || []);
          mediaRules.forEach((mr) => {
            if (mr.selectorText && mr.selectorText.includes('.full-menu.open') && !mr.selectorText.includes('.menu-link')) {
              results.push({
                selector: mr.selectorText,
                media: r.conditionText || r.media.mediaText,
                cssText: mr.cssText.substring(0, 200),
              });
            }
          });
        }
      });
    } catch (e) {}
  });
  return results;
});
console.log('\n.full-menu.open matching rules:');
console.log(JSON.stringify(rules, null, 2));
await browser.close();
