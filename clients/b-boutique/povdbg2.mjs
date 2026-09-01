import { chromium } from '@playwright/test';
const exe = `${process.env.PLAYWRIGHT_BROWSERS_PATH}/chromium`;
const b = await chromium.launch({ executablePath: exe });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
await p.mouse.move(400,300); await p.waitForTimeout(2000);
const geo = await p.evaluate(() => {
  const r = document.querySelector('[aria-labelledby="pov-heading"]').getBoundingClientRect();
  return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height) };
});
for (const f of [0, 0.5, 0.8, 0.9, 0.95, 1.0, 1.05]) {
  const y = Math.round(geo.top + (geo.h - 900) * f);
  // bypass Lenis: set scrollTop directly and wait for it to settle
  await p.evaluate((yy) => { document.documentElement.scrollTop = yy; }, y);
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    want: Math.round(window.scrollY),
    prog: +(window.__pov?.get() ?? -1).toFixed(4),
    sec: +(+getComputedStyle(document.querySelector('[aria-labelledby="pov-heading"] p:last-of-type')).opacity).toFixed(2),
  }));
  console.log(`asked ${String(y).padStart(5)}  actual ${String(r.want).padStart(5)}  progress ${String(r.prog).padStart(7)}  secOpacity ${r.sec}`);
}
await b.close();
