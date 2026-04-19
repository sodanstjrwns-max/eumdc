import { chromium } from 'playwright';
const b = await chromium.launch();

const p1 = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p1.goto('https://eumdc.kr?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await p1.waitForTimeout(2000);

// pillars-title 스크롤
await p1.evaluate(() => {
  const t = document.querySelector('.pillars-title');
  if (t) t.scrollIntoView({ block: 'center' });
});
await p1.waitForTimeout(3000);  // data-reveal 애니메이션 대기 길게

// 강제로 모든 data-reveal 요소를 visible로
await p1.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
  });
});
await p1.waitForTimeout(1000);
await p1.screenshot({ path: '/home/user/webapp/_audit/pillars_fix.png' });

await b.close();
console.log('✅ 완료');
