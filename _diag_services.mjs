import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// 카드에 nav-bound 핸들러가 붙었는지 확인
const info = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('.h-card:not(.h-card-intro)'));
  return cards.map((c) => ({
    title: c.querySelector('.h-card-title')?.textContent?.trim(),
    bound: c.dataset.navBound,
    href: c.dataset.href,
    role: c.getAttribute('role'),
    cursor: getComputedStyle(c).cursor,
  }));
});
console.log('CARDS BOUND:');
console.log(JSON.stringify(info, null, 2));

// 실제 임플란트 카드 클릭 → 이동 테스트
const beforeUrl = page.url();
// 카드로 스크롤
await page.evaluate(() => {
  const card = Array.from(document.querySelectorAll('.h-card-title'))
    .find((el) => el.textContent.trim() === '임플란트')?.closest('.h-card');
  if (card) card.scrollIntoView({ block: 'center' });
});
await page.waitForTimeout(800);
// 카드 안쪽의 빈 곳 클릭 (링크 아닌 곳)
await page.evaluate(() => {
  const card = Array.from(document.querySelectorAll('.h-card-title'))
    .find((el) => el.textContent.trim() === '임플란트')?.closest('.h-card');
  if (card) {
    const desc = card.querySelector('.h-card-desc');
    desc?.click();
  }
});
await page.waitForTimeout(2000);
const afterUrl = page.url();
console.log('\nBEFORE:', beforeUrl);
console.log('AFTER :', afterUrl);
console.log('NAVIGATED:', beforeUrl !== afterUrl ? '✅ YES' : '❌ NO');

await browser.close();
