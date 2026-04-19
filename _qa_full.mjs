import { chromium } from 'playwright';

const browser = await chromium.launch();
const results = { pass: [], fail: [] };

function log(ok, msg) {
  console.log(`${ok ? '✅' : '❌'} ${msg}`);
  (ok ? results.pass : results.fail).push(msg);
}

// ===== 1. Route 301 & 200 =====
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// prosthetics 301 redirect
const res1 = await page.goto('https://eumdc.kr/treatments/prosthetics', { waitUntil: 'domcontentloaded' });
log(page.url().endsWith('/aesthetic'), `prosthetics → aesthetic redirect: ${page.url()}`);
const title1 = await page.title();
log(title1.includes('심미보철') || title1.includes('Prosthetics') || title1.includes('심미'), `aesthetic title: ${title1}`);

const routes = [
  ['/', '이음치과의원'],
  ['/about', '병원 소개'],
  ['/doctors', '의료진'],
  ['/treatments', '진료'],
  ['/treatments/implant', '임플란트'],
  ['/treatments/aesthetic', '심미'],
  ['/treatments/resin', '심미레진'],
  ['/treatments/tmj', '턱관절'],
  ['/treatments/general', '충치'],
  ['/cases', '비포'],
  ['/blogs', '블로그'],
  ['/faq', 'FAQ'],
  ['/dictionary', '백과'],
  ['/notices', '공지']
];
for (const [p, expect] of routes) {
  const r = await page.goto(`https://eumdc.kr${p}`, { waitUntil: 'domcontentloaded' });
  const t = await page.title();
  log(r.status() === 200 && t.includes(expect), `${p} (200, title has "${expect}"): ${t.slice(0,40)}`);
}

// ===== 2. CTA link validity on home =====
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
const ctas = await page.evaluate(() => {
  const kakao = document.querySelector('a[href*="pf.kakao.com"]');
  const naver = document.querySelector('a[href*="place.naver.com"]');
  const tel = document.querySelector('a[href^="tel:"]');
  return {
    kakao: kakao?.getAttribute('href'),
    naver: naver?.getAttribute('href'),
    tel: tel?.getAttribute('href')
  };
});
log(ctas.kakao?.includes('pf.kakao.com'), `Kakao link: ${ctas.kakao}`);
log(ctas.naver?.includes('place.naver.com'), `Naver link: ${ctas.naver}`);
log(ctas.tel === 'tel:051-206-5888', `Phone link: ${ctas.tel}`);

// ===== 3. Service cards click =====
const cardTests = [
  ['임플란트', '/treatments/implant'],
  ['심미보철', '/treatments/aesthetic'],
  ['심미 레진', '/treatments/resin'],
  ['턱관절', '/treatments/tmj'],
  ['일반진료', '/treatments/general']
];
for (const [title, expectUrl] of cardTests) {
  await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
  // find card by title and extract data-href
  const href = await page.evaluate((t) => {
    const cards = Array.from(document.querySelectorAll('.h-card'));
    const card = cards.find(c => c.querySelector('.h-card-title')?.textContent?.trim() === t);
    return card?.dataset?.href || null;
  }, title);
  log(href === expectUrl, `Card "${title}" href: ${href} (expected ${expectUrl})`);
}

// ===== 4. Menu links on home =====
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
const menuHrefs = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.menu-link')).map(a => ({
    text: a.textContent?.trim().replace(/\s+/g,' ').slice(0, 20),
    href: a.getAttribute('href')
  }));
});
console.log('\nMenu links:');
for (const m of menuHrefs) {
  const valid = m.href && m.href.startsWith('/');
  log(valid, `Menu: ${m.text} → ${m.href}`);
}

// ===== 5. Floating buttons alignment mobile + desktop =====
async function checkFloating(vw, vh, isMobile) {
  const c = await browser.newContext({ viewport: { width: vw, height: vh }, isMobile });
  const p = await c.newPage();
  await p.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const data = await p.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.floating-cta-group .floating-btn'));
    return btns.map(b => {
      const r = b.getBoundingClientRect();
      return { cls: b.className, x: Math.round(r.x), w: Math.round(r.width) };
    });
  });
  const xs = data.map(d => d.x);
  const ws = data.map(d => d.w);
  const xConsistent = new Set(xs).size === 1;
  const wConsistent = new Set(ws).size === 1;
  log(xConsistent, `[${vw}px] Floating x aligned: ${JSON.stringify(xs)}`);
  log(wConsistent, `[${vw}px] Floating w uniform: ${JSON.stringify(ws)}`);
  await c.close();
}
await checkFloating(390, 844, true);
await checkFloating(768, 1024, false);
await checkFloating(1440, 900, false);

// ===== 6. Console errors across pages =====
const errors = [];
const page2 = await ctx.newPage();
page2.on('pageerror', e => errors.push(`[${page2.url()}] ${e.message}`));
page2.on('console', m => {
  if (m.type() === 'error' && !m.text().includes('cdn-cgi/rum')) {
    errors.push(`[console ${page2.url().split('/').pop()}] ${m.text().slice(0,100)}`);
  }
});
for (const [p] of routes.slice(0, 9)) {
  await page2.goto(`https://eumdc.kr${p}`, { waitUntil: 'networkidle', timeout: 20000 }).catch(()=>{});
  await page2.waitForTimeout(800);
}
console.log('\n=== Console errors (excluding RUM) ===');
log(errors.length === 0, errors.length ? errors.slice(0,8).join('\n') : 'No real errors');

await browser.close();

console.log(`\n═══════════════════════════════════`);
console.log(`✅ PASS: ${results.pass.length}`);
console.log(`❌ FAIL: ${results.fail.length}`);
if (results.fail.length) {
  console.log('\nFAILED:');
  results.fail.forEach(f => console.log(`  - ${f}`));
}
