const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'https://mia-salon-prototype.vercel.app';
const OUTPUT_DIR = path.join(__dirname, 'prototype_screenshots');
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  // First visit dashboard and click Calculate All for March data
  { name: '15_salary_dashboard_march_data', url: '/salary-calculator', action: 'calculate-march' },
  { name: '16_salary_dashboard_with_data', url: '/salary-calculator', action: 'calculate-all' },
  { name: '17_salary_ravi_breakdown_with_data', url: '/salary-calculator/staff-1?month=2026-03', waitExtra: 1000 },
  { name: '18_salary_ravi_payslip_with_data', url: '/salary-calculator/staff-1?month=2026-03', tab: 'Payslip' },
  { name: '19_salary_ravi_deductions_with_data', url: '/salary-calculator/staff-1?month=2026-03', tab: 'Deductions' },
  { name: '20_salary_ravi_attendance_with_data', url: '/salary-calculator/staff-1?month=2026-03', tab: 'Attendance' },
  // Role switcher views
  { name: '21_salary_manager_view', url: '/salary-calculator', action: 'switch-manager' },
  { name: '22_salary_staff_view', url: '/salary-calculator', action: 'switch-staff' },
];

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  for (const item of PAGES) {
    try {
      console.log(`Capturing: ${item.name}`);
      await page.goto(`${BASE_URL}${item.url}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await delay(2500);

      if (item.action === 'calculate-march') {
        // Change month to March 2026 which has pre-calculated data
        await page.evaluate(() => {
          const monthInput = document.querySelector('input[type="month"]');
          if (monthInput) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(monthInput, '2026-03');
            monthInput.dispatchEvent(new Event('input', { bubbles: true }));
            monthInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
        await delay(2000);
      }

      if (item.action === 'calculate-all') {
        // Click Calculate All button
        const clicked = await page.evaluate(() => {
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent.includes('Calculate All')) {
              btn.click();
              return true;
            }
          }
          return false;
        });
        if (clicked) await delay(3000);
      }

      if (item.action === 'switch-manager') {
        await page.select('select', 'manager');
        await delay(2000);
      }

      if (item.action === 'switch-staff') {
        const selects = await page.$$('select');
        if (selects.length > 0) {
          await selects[0].select('staff');
          await delay(2000);
        }
      }

      if (item.tab) {
        await page.evaluate((tabName) => {
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent.trim() === tabName) { btn.click(); return; }
          }
        }, item.tab);
        await delay(1500);
      }

      if (item.waitExtra) await delay(item.waitExtra);

      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${item.name}.png`),
        fullPage: true,
      });
      console.log(`  done`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\nAll screenshots saved!');
})();
