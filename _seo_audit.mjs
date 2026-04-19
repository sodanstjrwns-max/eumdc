import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const pages = ['/', '/about', '/doctors', '/treatments', '/treatments/implant',
               '/regions/myeongji', '/visit', '/faq'];

console.log('=== HEADING HIERARCHY + IMG ALT + A11Y ===\n');
for (const p of pages) {
  await page.goto(`https://eumdc.kr${p}`, { waitUntil: 'networkidle', timeout: 20000 });
  const data = await page.evaluate(() => {
    const h1 = document.querySelectorAll('h1').length;
    const h2 = document.querySelectorAll('h2').length;
    const h3 = document.querySelectorAll('h3').length;
    const imgs = Array.from(document.querySelectorAll('img'));
    const imgWithoutAlt = imgs.filter(i => !i.alt || i.alt.trim() === '').length;
    const links = Array.from(document.querySelectorAll('a'));
    const linksNoText = links.filter(a => !a.textContent?.trim() && !a.getAttribute('aria-label')).length;
    const title = document.title;
    const descEl = document.querySelector('meta[name="description"]');
    const desc = descEl?.getAttribute('content') || '';
    const ogImg = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    return {
      h1, h2, h3,
      imgTotal: imgs.length,
      imgWithoutAlt,
      linksNoText,
      titleLen: title.length,
      descLen: desc.length,
      titleSample: title,
      ogImg
    };
  });
  const h1Status = data.h1 === 1 ? '✅' : data.h1 === 0 ? '❌ NO H1' : `⚠️ ${data.h1} H1s`;
  const altStatus = data.imgWithoutAlt === 0 ? '✅' : `⚠️ ${data.imgWithoutAlt}/${data.imgTotal}`;
  const titleStatus = data.titleLen >= 30 && data.titleLen <= 70 ? '✅' : `⚠️ ${data.titleLen}`;
  const descStatus = data.descLen >= 120 && data.descLen <= 170 ? '✅' : `⚠️ ${data.descLen}`;
  console.log(`${p}`);
  console.log(`  H1: ${h1Status}  H2: ${data.h2}  H3: ${data.h3}`);
  console.log(`  IMG alt: ${altStatus}  Links w/o text: ${data.linksNoText === 0 ? '✅' : '⚠️ '+data.linksNoText}`);
  console.log(`  Title len: ${titleStatus} (${data.titleLen}char)  Desc len: ${descStatus} (${data.descLen}char)`);
  console.log('');
}

// OG image check
console.log('=== OG IMAGE CHECK ===');
const og = await fetch('https://eumdc.kr/static/og-image.png', { method: 'HEAD' });
console.log(`og-image.png: ${og.status}, size: ${og.headers.get('content-length')} bytes`);

await browser.close();
