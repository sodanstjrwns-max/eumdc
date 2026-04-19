import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// 시네마틱 엔진 disable 시도 — JS 자체를 끄고 HTML/CSS만 로드
await page.goto('https://eumdc.kr/', { waitUntil: 'domcontentloaded', timeout: 30000 });
// JS가 붙기 전에 book-section만 캡쳐 가능
await page.waitForSelector('#section-book', { timeout: 10000 });

// CSS가 이미 적용되어있을 테니, book 섹션만 추출해 단독 렌더링용 HTML로 저장
const bookHTML = await page.evaluate(() => {
  const el = document.querySelector('#section-book');
  return el ? el.outerHTML : '';
});

// 해당 요소를 fresh page에 단독 렌더링
const isolatedHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://eumdc.kr/static/style.css">
<style>body{margin:0;background:#fff;font-family:'Noto Sans KR',sans-serif}</style>
</head>
<body>${bookHTML}</body>
</html>`;

const page2 = await ctx.newPage();
await page2.setContent(isolatedHtml, { waitUntil: 'networkidle' });
await page2.waitForTimeout(1500);
await page2.screenshot({ path: '/tmp/book-main-iso-desktop.png', fullPage: true });

// Mobile
const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mobCtx.newPage();
await mpage.setContent(isolatedHtml, { waitUntil: 'networkidle' });
await mpage.waitForTimeout(1500);
await mpage.screenshot({ path: '/tmp/book-main-iso-mobile.png', fullPage: true });

console.log('Isolated screenshots saved');
await browser.close();
