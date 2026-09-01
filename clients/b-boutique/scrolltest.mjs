import { chromium } from '@playwright/test';
const exe = `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium`;
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
// motion layer is gated behind idle/interaction — nudge it
await p.mouse.move(700, 400);
await p.evaluate(() => window.scrollBy(0, 1));
await p.waitForTimeout(2500);

const read = () => p.evaluate(() => {
  const sec = document.querySelector('#rails');
  const track = sec?.querySelector('ul');
  const t = track ? getComputedStyle(track).transform : 'none';
  const m = t !== 'none' ? new DOMMatrixReadOnly(t) : null;
  return {
    x: m ? Math.round(m.m41) : 0,
    secTop: Math.round(sec.getBoundingClientRect().top),
    pinned: !!document.querySelector('.pin-spacer'),
    scrollY: Math.round(window.scrollY),
  };
});

console.log('progressive scroll through the pinned section:');
for (const y of [0, 900, 1400, 1900, 2400, 2900, 3400, 3900, 4400]) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(700);
  const r = await read();
  console.log(`  scrollY ${String(r.scrollY).padStart(4)}  sectionTop ${String(r.secTop).padStart(5)}  trackX ${String(r.x).padStart(6)}  pinSpacer ${r.pinned}`);
}
console.log('\nhorizontal page overflow:', await p.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth));
await b.close();
