import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto('https://eumdc.kr/cases?v=' + Date.now(), { waitUntil: 'networkidle' });
// footer 스크롤
await p.evaluate(() => document.querySelector('footer.footer-full')?.scrollIntoView());
await p.waitForTimeout(1500);
const info = await p.evaluate(() => {
  const col = document.querySelector('.footer-nav-col');
  if (!col) return null;
  // 부모 체인 모두 opacity 검사
  let el = col;
  const chain = [];
  while (el && el.tagName !== 'HTML') {
    const s = getComputedStyle(el);
    chain.push({ tag: el.tagName.toLowerCase(), cls: el.className, op: s.opacity, vis: s.visibility, display: s.display });
    el = el.parentElement;
  }
  return chain;
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
