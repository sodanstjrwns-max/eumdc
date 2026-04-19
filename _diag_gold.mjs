import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await p.goto('https://eumdc.kr?bust=' + Date.now(), { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);

// 히어로 타이틀 안의 'em' 혹은 두려운이유 요소 찾기
const goldCheck = await p.evaluate(() => {
  const results = [];
  // 두려운 이유 후보
  const selectors = ['.hero-title em', '.hero-title .accent', '.hero-title span', 
    '.hero-sub', '.hero-sub em', '.hero-subtitle', '.hero-subtitle em',
    '.hero-proof-star', '.hero-stat-unit', '.nav-tagline-line',
    '.nav-brand::after', '.hero-title'];
  
  selectors.forEach(sel => {
    const els = document.querySelectorAll(sel);
    els.forEach((el, i) => {
      const cs = getComputedStyle(el);
      const col = cs.color;
      const bg = cs.backgroundImage;
      const fill = cs.webkitTextFillColor;
      if (col.includes('244') || bg.includes('244') || bg.includes('F4C8') || fill.includes('244') ||
          col.includes('168, 196') || bg.includes('168, 196')) {
        results.push({
          sel: `${sel}[${i}]`,
          text: el.textContent?.substring(0, 30),
          color: col,
          bg: bg.substring(0, 80),
          fill: fill,
          className: el.className
        });
      }
    });
  });
  
  // 전체 페이지에서 rgb(244, 200, 112) 가진 요소 찾기
  const all = document.querySelectorAll('*');
  let count = 0;
  all.forEach(el => {
    if (count > 10) return;
    const cs = getComputedStyle(el);
    if (cs.color === 'rgb(244, 200, 112)' || 
        cs.webkitTextFillColor === 'rgb(244, 200, 112)' ||
        cs.backgroundColor === 'rgb(244, 200, 112)') {
      results.push({
        scan: true,
        tag: el.tagName,
        className: el.className?.toString().substring(0, 50),
        text: el.textContent?.substring(0, 30),
        color: cs.color,
        fill: cs.webkitTextFillColor
      });
      count++;
    }
  });
  
  return results;
});
console.log(JSON.stringify(goldCheck, null, 2));
await b.close();
