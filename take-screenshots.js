const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'https://mia-salon-prototype.vercel.app';
const OUTPUT_DIR = path.join(__dirname, 'prototype_screenshots');

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  { name: '01_salary_dashboard', url: '/salary-calculator' },
  { name: '02_salary_setup', url: '/salary-calculator/setup' },
  { name: '03_salary_advances', url: '/salary-calculator/advances' },
  { name: '04_salary_staff_ravi_breakdown', url: '/salary-calculator/staff-1?month=2026-04' },
  { name: '05_salary_staff_ravi_attendance', url: '/salary-calculator/staff-1?month=2026-04', tab: 'Attendance' },
  { name: '06_salary_staff_ravi_deductions', url: '/salary-calculator/staff-1?month=2026-04', tab: 'Deductions' },
  { name: '07_salary_staff_ravi_payslip', url: '/salary-calculator/staff-1?month=2026-04', tab: 'Payslip' },
  { name: '08_salary_staff_priya', url: '/salary-calculator/staff-2?month=2026-04' },
  { name: '09_main_dashboard', url: '/' },
  { name: '10_appointments', url: '/appointments' },
  { name: '11_quick_sale', url: '/quick-sale' },
  { name: '12_clients_list', url: '/clients' },
  { name: '13_staff_list', url: '/staff' },
  { name: '14_settings', url: '/settings' },
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

      if (item.tab) {
        const clicked = await page.evaluate((tabName) => {
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent.trim() === tabName) {
              btn.click();
              return true;
            }
          }
          return false;
        }, item.tab);
        if (clicked) await delay(1500);
      }

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
  console.log('\nAll screenshots saved to prototype_screenshots/');
})();
