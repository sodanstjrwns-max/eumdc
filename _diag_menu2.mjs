import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.click('#menuBtn');
await page.waitForTimeout(1200);

const info = await page.evaluate(() => {
  const menu = document.querySelector('.full-menu');
  const overlay = document.querySelector('.menu-overlay');
  const content = document.querySelector('.menu-content');
  const links = Array.from(document.querySelectorAll('.menu-link'));
  const cs = (el) => el ? getComputedStyle(el) : null;
  const rect = (el) => el ? el.getBoundingClientRect() : null;
  return {
    menu: {
      open: menu.classList.contains('open'),
      zIndex: cs(menu).zIndex,
      bg: cs(menu).backgroundColor,
      clipPath: cs(menu).clipPath,
      bbox: rect(menu),
    },
    overlay: {
      zIndex: cs(overlay).zIndex,
      bg: cs(overlay).backgroundColor,
      opacity: cs(overlay).opacity,
      bbox: rect(overlay),
    },
    content: {
      zIndex: cs(content).zIndex,
      bbox: rect(content),
      visible: rect(content).width > 0 && rect(content).height > 0,
    },
    links: links.slice(0, 3).map(l => ({
      text: l.textContent.trim(),
      opacity: cs(l).opacity,
      transform: cs(l).transform,
      bbox: rect(l),
    })),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
