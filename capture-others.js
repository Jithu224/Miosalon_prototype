const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'prototype_screenshots', 'competitors');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const PAGES = [
  // GlossGenius
  {
    name: 'glossgenius_payroll_1',
    url: 'https://glossgenius.com/payroll',
    description: 'GlossGenius Payroll landing page',
  },
  {
    name: 'glossgenius_commission_1',
    url: 'https://glossgenius.com/glossgeniuspayroll',
    description: 'GlossGenius Payroll details page',
  },
  {
    name: 'glossgenius_staff_1',
    url: 'https://glossgenius.com/salon-management-software-for-teams',
    description: 'GlossGenius Staff Management page',
  },
  {
    name: 'glossgenius_pricing_1',
    url: 'https://glossgenius.com/pricing',
    description: 'GlossGenius Pricing page',
  },
  {
    name: 'glossgenius_features_1',
    url: 'https://glossgenius.com/for-team-owners',
    description: 'GlossGenius For Team Owners page',
  },

  // SalonBoost
  {
    name: 'salonboost_features_1',
    url: 'https://salonboost.online/',
    description: 'SalonBoost home page',
  },
  {
    name: 'salonboost_payroll_1',
    url: 'https://salonboost.online/staff-attendance-payroll',
    description: 'SalonBoost Staff Attendance & Payroll page',
  },
  {
    name: 'salonboost_compare_1',
    url: 'https://salonboost.online/compare-salon-softwares',
    description: 'SalonBoost Comparison page',
  },
  {
    name: 'salonboost_salon_software_1',
    url: 'https://salonboost.online/salon-software',
    description: 'SalonBoost Salon Software features page',
  },

  // Dingg
  {
    name: 'dingg_staff_1',
    url: 'https://dingg.app/features/salon-staff-management-software',
    description: 'Dingg Staff Management page',
  },
  {
    name: 'dingg_features_1',
    url: 'https://dingg.app/all-in-one-salon-management-software',
    description: 'Dingg All-in-One features page',
  },
  {
    name: 'dingg_home_1',
    url: 'https://dingg.app/',
    description: 'Dingg home page',
  },
  {
    name: 'dingg_payroll_1',
    url: 'https://dingg.app/blogs/payroll-pain-points-solved-why-dinggs-integrated-salon-payroll-software-outshines-standalone-tools',
    description: 'Dingg Payroll blog page',
  },

  // Salonist
  {
    name: 'salonist_commission_1',
    url: 'https://salonist.io/features/employee',
    description: 'Salonist Employee Management page',
  },
  {
    name: 'salonist_home_1',
    url: 'https://salonist.io/',
    description: 'Salonist home page',
  },
];

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
    ],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // Set a realistic user-agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
  );

  const results = [];

  for (const item of PAGES) {
    const filePath = path.join(OUTPUT_DIR, `${item.name}.png`);
    try {
      console.log(`\nCapturing: ${item.name}`);
      console.log(`  URL: ${item.url}`);

      await page.goto(item.url, {
        waitUntil: 'networkidle2',
        timeout: 45000,
      });
      await delay(3000);

      // Scroll down to trigger lazy-loaded content
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= document.body.scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 150);
          // Safety timeout
          setTimeout(() => {
            clearInterval(timer);
            resolve();
          }, 8000);
        });
        // Scroll back to top
        window.scrollTo(0, 0);
      });

      await delay(2000);

      // Try to dismiss cookie banners / popups
      await page.evaluate(() => {
        const selectors = [
          '[class*="cookie"] button',
          '[class*="consent"] button',
          '[class*="popup"] button[class*="close"]',
          '[class*="modal"] button[class*="close"]',
          'button[aria-label="Close"]',
          'button[aria-label="close"]',
        ];
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            el.click();
            break;
          }
        }
      });

      await delay(500);

      await page.screenshot({
        path: filePath,
        fullPage: true,
      });

      console.log(`  Saved: ${item.name}.png`);
      results.push({ name: item.name, status: 'success', file: filePath });
    } catch (err) {
      console.error(`  FAILED: ${item.name} - ${err.message}`);
      results.push({ name: item.name, status: 'failed', error: err.message });

      // Try a viewport-only screenshot as fallback
      try {
        await page.screenshot({
          path: filePath,
          fullPage: false,
        });
        console.log(`  Saved viewport-only fallback: ${item.name}.png`);
        results[results.length - 1].status = 'partial';
      } catch (e2) {
        // ignore
      }
    }
  }

  await browser.close();

  // Print summary
  console.log('\n=== CAPTURE SUMMARY ===');
  const succeeded = results.filter((r) => r.status === 'success' || r.status === 'partial');
  const failed = results.filter((r) => r.status === 'failed');
  console.log(`Total: ${results.length} | Success: ${succeeded.length} | Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.log('Failed pages:');
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.error}`));
  }
  console.log('\nAll screenshots saved to:', OUTPUT_DIR);
})();
