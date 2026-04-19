import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto('https://eumdc.kr?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2000);
// scroll to stats
await p.evaluate(() => {
  const s = document.querySelector('.story-stats');
  if (s) s.scrollIntoView({ block: 'center' });
});
await p.waitForTimeout(1500);

const diag = await p.evaluate(() => {
  const nums = document.querySelectorAll('.story-stats .hero-stat-num');
  return Array.from(nums).map(n => {
    const cs = getComputedStyle(n);
    const rect = n.getBoundingClientRect();
    return {
      text: n.textContent,
      innerHTML: n.innerHTML.substring(0, 100),
      color: cs.color,
      bgImage: cs.backgroundImage.substring(0, 80),
      bgClip: cs.backgroundClip || cs.webkitBackgroundClip,
      webkitTextFillColor: cs.webkitTextFillColor,
      fontSize: cs.fontSize,
      display: cs.display,
      visibility: cs.visibility,
      opacity: cs.opacity,
      filter: cs.filter,
      w: rect.width, h: rect.height,
      x: rect.x, y: rect.y
    };
  });
});
console.log(JSON.stringify(diag, null, 2));

// element-level screenshot
const el = await p.$('.story-stats');
if (el) await el.screenshot({ path: '/home/user/webapp/_audit/v9_stats_only.png' });
await b.close();
