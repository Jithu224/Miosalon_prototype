const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(
  __dirname,
  'prototype_screenshots',
  'competitors'
);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
  // Zenoti pages
  {
    url: 'https://www.zenoti.com/features/payroll',
    filename: 'zenoti_payroll_1.png',
    label: 'Zenoti Payroll Feature Page',
  },
  {
    url: 'https://www.zenoti.com/features/staff-management',
    filename: 'zenoti_staff_management_1.png',
    label: 'Zenoti Staff Management Page',
  },
  {
    url: 'https://www.zenoti.com/platform/employee-performance-management/',
    filename: 'zenoti_commission_1.png',
    label: 'Zenoti Employee Performance / Commission Page',
  },
  {
    url: 'https://help.zenoti.com/en/employee-and-payroll/configure-commissions.html',
    filename: 'zenoti_commission_help_1.png',
    label: 'Zenoti Commission Configuration Help',
  },
  {
    url: 'https://help.zenoti.com/en/employee-and-payroll/onboard-and-set-up/set-up-payroll-plans-for-your-organization.html',
    filename: 'zenoti_payroll_setup_1.png',
    label: 'Zenoti Payroll Plans Setup Help',
  },
  {
    url: 'https://help.zenoti.com/en/articles/728807-configure-revenue-slabs-based-commissions-at-the-employee-level',
    filename: 'zenoti_revenue_slabs_1.png',
    label: 'Zenoti Revenue Slabs Commission Help',
  },

  // Vagaro pages
  {
    url: 'https://www.vagaro.com/pro/payroll',
    filename: 'vagaro_payroll_1.png',
    label: 'Vagaro Payroll Feature Page',
  },
  {
    url: 'https://support.vagaro.com/hc/en-us/articles/204347910-Configure-Your-Payroll-Settings',
    filename: 'vagaro_payroll_config_1.png',
    label: 'Vagaro Payroll Configuration Help',
  },
  {
    url: 'https://support.vagaro.com/hc/en-us/articles/21475957047323-Set-Up-Commissions-for-Services',
    filename: 'vagaro_commission_1.png',
    label: 'Vagaro Commission Setup for Services',
  },
  {
    url: 'https://support.vagaro.com/hc/en-us/articles/21476003547419-Set-Up-Commissions-for-Products',
    filename: 'vagaro_commission_products_1.png',
    label: 'Vagaro Commission Setup for Products',
  },
  {
    url: 'https://support.vagaro.com/hc/en-us/articles/360018855214-Run-a-Payroll-Report',
    filename: 'vagaro_payroll_report_1.png',
    label: 'Vagaro Run Payroll Report Help',
  },
  {
    url: 'https://support.vagaro.com/hc/en-us/articles/204347950-Specify-Deduct-Business-Costs-from-Payroll',
    filename: 'vagaro_deductions_1.png',
    label: 'Vagaro Business Cost Deductions Help',
  },
];

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900'],
    defaultViewport: { width: 1440, height: 900 },
  });

  for (const page of PAGES) {
    const tab = await browser.newPage();
    const outputPath = path.join(OUTPUT_DIR, page.filename);

    try {
      console.log(`Navigating to: ${page.label} (${page.url})`);
      await tab.goto(page.url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Wait a moment for any lazy-loaded content
      await new Promise((r) => setTimeout(r, 2000));

      // Dismiss cookie banners or popups if present
      try {
        const dismissSelectors = [
          '[aria-label="Close"]',
          '.cookie-banner button',
          '#onetrust-accept-btn-handler',
          '.cc-dismiss',
          '.cc-btn',
          'button[data-action="accept"]',
        ];
        for (const sel of dismissSelectors) {
          const btn = await tab.$(sel);
          if (btn) {
            await btn.click();
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      } catch (_) {
        // Ignore popup dismissal errors
      }

      // Take full-page screenshot
      await tab.screenshot({
        path: outputPath,
        fullPage: true,
      });

      console.log(`  -> Saved: ${page.filename}`);
    } catch (err) {
      console.error(`  -> FAILED (${page.label}): ${err.message}`);
    } finally {
      await tab.close();
    }
  }

  await browser.close();
  console.log('\nDone. Screenshots saved to:', OUTPUT_DIR);
})();
