import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 980 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto('file://' + join(__dirname, 'dashboard.html'));
await page.waitForLoadState('networkidle');
await page.waitForTimeout(800);
await page.screenshot({ path: join(__dirname, 'dashboard.png'), fullPage: true });
await browser.close();
console.log('OK');
