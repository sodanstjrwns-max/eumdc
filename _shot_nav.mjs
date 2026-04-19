import { chromium } from 'playwright';
const b = await chromium.launch();

// 모바일
const p1 = await b.newPage({ viewport: { width: 390, height: 200 }, deviceScaleFactor: 2 });
await p1.goto('https://eumdc.kr?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await p1.waitForTimeout(1500);
const nav1 = await p1.$('#nav');
if (nav1) await nav1.screenshot({ path: '/home/user/webapp/_audit/v10_nav_mobile.png' });

const mobileCheck = await p1.evaluate(() => {
  const booking = document.querySelector('#nav .nav-booking');
  const kakao = document.querySelector('#nav .nav-kakao');
  return {
    booking: booking ? getComputedStyle(booking).display : 'not-found',
    kakao: kakao ? getComputedStyle(kakao).display : 'not-found'
  };
});
console.log('MOBILE:', JSON.stringify(mobileCheck));

// 데스크톱
const p2 = await b.newPage({ viewport: { width: 1440, height: 200 }, deviceScaleFactor: 2 });
await p2.goto('https://eumdc.kr?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
await p2.waitForTimeout(1500);
const nav2 = await p2.$('#nav');
if (nav2) await nav2.screenshot({ path: '/home/user/webapp/_audit/v10_nav_desktop.png' });

const desktopCheck = await p2.evaluate(() => {
  const booking = document.querySelector('#nav .nav-booking');
  const kakao = document.querySelector('#nav .nav-kakao');
  return {
    booking: booking ? getComputedStyle(booking).display : 'not-found',
    kakao: kakao ? getComputedStyle(kakao).display : 'not-found'
  };
});
console.log('DESKTOP:', JSON.stringify(desktopCheck));

await b.close();
