import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://eumdc.kr/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);  // wait for animations

const data = await page.evaluate(() => {
  // Detailed inspection of hero-title children (SplitText)
  const title = document.querySelector('.hero-title');
  const children = title ? Array.from(title.children).map(c => {
    const cs = getComputedStyle(c);
    return {
      tag: c.tagName,
      cls: c.className?.slice(0, 30) || '',
      filter: cs.filter,
      opacity: cs.opacity,
      transform: cs.transform.slice(0, 50),
      text: c.textContent?.slice(0, 15)
    };
  }) : [];
  const titlePseudoBefore = title ? getComputedStyle(title, '::before').filter : null;
  const titlePseudoAfter = title ? getComputedStyle(title, '::after').filter : null;

  // Check hero-cta-wrap children
  const ctaWrap = document.querySelector('.hero-cta-wrap');
  const ctaCs = ctaWrap ? getComputedStyle(ctaWrap) : null;
  const ctaChildren = ctaWrap ? Array.from(ctaWrap.children).map(c => {
    const cs = getComputedStyle(c);
    return {
      tag: c.tagName,
      cls: c.className?.slice(0, 40) || '',
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display,
      transform: cs.transform.slice(0, 40),
      href: c.getAttribute('href')
    };
  }) : [];

  return {
    heroTitle: {
      childCount: children.length,
      sampleChildren: children.slice(0, 5),
      pseudoBefore: titlePseudoBefore,
      pseudoAfter: titlePseudoAfter
    },
    heroCta: {
      parentOpacity: ctaCs?.opacity,
      parentTransform: ctaCs?.transform.slice(0, 50),
      parentDisplay: ctaCs?.display,
      children: ctaChildren
    }
  };
});
console.log(JSON.stringify(data, null, 2));

await browser.close();
