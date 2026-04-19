import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto('https://eumdc.kr?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2500);

// 1. 히어로 + 상단
await p.screenshot({ path: '/home/user/webapp/_audit/mist_01_hero.png' });

// 2. Story 스크롤 (두려운 이유)
await p.evaluate(() => window.scrollTo(0, 2000));
await p.waitForTimeout(1500);
await p.screenshot({ path: '/home/user/webapp/_audit/mist_02_story.png' });

// 3. Stats 섹션
await p.evaluate(() => {
  const s = document.querySelector('.story-stats');
  if (s) s.scrollIntoView({ block: 'center' });
});
await p.waitForTimeout(2500);
await p.screenshot({ path: '/home/user/webapp/_audit/mist_03_stats.png' });

// 4. Pillars (신뢰의 네 가지 기둥)
await p.evaluate(() => {
  const s = document.querySelector('.story-pillars');
  if (s) s.scrollIntoView({ block: 'start' });
});
await p.waitForTimeout(1500);
await p.screenshot({ path: '/home/user/webapp/_audit/mist_04_pillars.png' });

console.log('✅ 4장 촬영 완료');
await b.close();
