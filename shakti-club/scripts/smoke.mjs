/* Browser smoke test: drives every major interaction of the dealer app and
   admin panel against a running server and saves screenshots to ./screenshots.

   Usage:
     npm run build && npx vite preview --port 4173 &
     node scripts/smoke.mjs [baseUrl]        (default http://localhost:4173)
*/
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const base = process.argv[2] || 'http://localhost:4173';
const out = new URL('../screenshots', import.meta.url).pathname;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const errors = [];

// ---- dealer app (phone viewport) ----
const page = await browser.newPage({ viewport: { width: 428, height: 908 } });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800); // let the SP count-up finish
await page.screenshot({ path: out + '/01-home.png' });

// scratch card: open, rub, collect
await page.getByText('Scratch & win').first().click();
await page.waitForTimeout(500);
const box = await page.locator('canvas').boundingBox();
await page.mouse.move(box.x + 20, box.y + 40);
await page.mouse.down();
for (let i = 0; i < 40; i++) {
  await page.mouse.move(box.x + 20 + (i % 10) * 24, box.y + 30 + Math.floor(i / 10) * 30, { steps: 2 });
}
await page.mouse.up();
await page.waitForTimeout(600);
await page.screenshot({ path: out + '/02-scratch-revealed.png' });
await page.getByText('Collect 250 SP').click();
await page.waitForTimeout(700);

// catalogue: add to PO, open cart, place order
await page.getByText('Catalogue', { exact: true }).last().click();
await page.waitForTimeout(400);
await page.screenshot({ path: out + '/03-catalogue.png' });
await page.getByText('Add to PO').first().click();
await page.getByText('Add to PO').first().click();
await page.waitForTimeout(400);
await page.locator('text=/pcs · ₹/').first().click(); // cart FAB
await page.waitForTimeout(500);
await page.screenshot({ path: out + '/04-cart.png' });
await page.getByText('Send order request').click();
await page.waitForTimeout(600);
await page.screenshot({ path: out + '/05-order-placed.png' });
await page.getByText('Track in Orders').click();
await page.waitForTimeout(500);
await page.screenshot({ path: out + '/06-orders.png' });

// scan simulator
await page.getByText('Delivered? Scan cartons').click();
await page.waitForTimeout(400);
await page.getByText('Simulate a carton scan').click();
await page.waitForTimeout(400);
await page.screenshot({ path: out + '/07-scan.png' });

// leaderboard tabs
await page.getByText('Home', { exact: true }).last().click();
await page.waitForTimeout(300);
await page.getByText('View', { exact: true }).click();
await page.waitForTimeout(400);
await page.getByText('Punjab state').click();
await page.waitForTimeout(300);
await page.screenshot({ path: out + '/08-leaderboard-state.png' });

// rewards + redeem
await page.getByText('Rewards', { exact: true }).last().click();
await page.waitForTimeout(300);
await page.getByText('Redeem', { exact: true }).nth(1).click(); // ₹1,000 credit note
await page.waitForTimeout(400);
await page.screenshot({ path: out + '/09-redeem-dialog.png' });
await page.getByText('Redeem', { exact: true }).last().click(); // confirm
await page.waitForTimeout(600);
await page.screenshot({ path: out + '/10-rewards-after.png' });

// language toggle: cycle to Hindi from the home header chip
await page.getByText('Home', { exact: true }).last().click();
await page.waitForTimeout(300);
await page.getByText('EN', { exact: true }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: out + '/11-home-hindi.png' });
await page.getByText('खाता').last().click();
await page.waitForTimeout(300);
await page.screenshot({ path: out + '/12-ledger-hi.png' });
await page.getByText('और', { exact: true }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: out + '/13-more.png' });

// login flow
await page.goto(base + '/?login#/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: out + '/14-login.png' });
await page.getByText('Get OTP').click();
await page.waitForTimeout(400);
await page.getByText('Verify & enter the Club').click();
await page.waitForTimeout(1600);
await page.screenshot({ path: out + '/15-after-login.png' });

// ---- admin panel (desktop viewport) ----
const admin = await browser.newPage({ viewport: { width: 1440, height: 960 } });
admin.on('pageerror', (e) => errors.push('admin pageerror: ' + e.message));
await admin.goto(base + '/#/admin', { waitUntil: 'networkidle' });
await admin.waitForTimeout(1200);
await admin.screenshot({ path: out + '/20-admin-dashboard.png' });
await admin.getByText('Dealers & KYC').first().click();
await admin.waitForTimeout(300);
await admin.getByText('Approve', { exact: true }).first().click();
await admin.waitForTimeout(400);
await admin.screenshot({ path: out + '/21-admin-dealers.png' });
await admin.getByText('Missions', { exact: true }).click();
await admin.waitForTimeout(300);
await admin.getByText('Payment', { exact: true }).click();
await admin.waitForTimeout(200);
await admin.screenshot({ path: out + '/22-admin-missions.png' });
await admin.getByText('Reconciliation').first().click();
await admin.waitForTimeout(300);
await admin.getByText('Release SP').first().click();
await admin.waitForTimeout(400);
await admin.screenshot({ path: out + '/23-admin-recon.png' });

// cap-breach scenario
await admin.goto(base + '/?scenario=cap-breach#/admin', { waitUntil: 'networkidle' });
await admin.waitForTimeout(800);
await admin.screenshot({ path: out + '/24-admin-capbreach.png' });

console.log('Screenshots written to', out);
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await browser.close();
process.exit(errors.length ? 1 : 0);
