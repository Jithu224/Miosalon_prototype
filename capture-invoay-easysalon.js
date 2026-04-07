const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'prototype_screenshots', 'competitors');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
  // Invoay pages
  {
    url: 'https://invoay.com/salon-management-software/',
    filename: 'invoay_staff_1.png',
    label: 'Invoay - Salon Management Software (Staff/Commission features)'
  },
  {
    url: 'https://invoay.com/software-features/',
    filename: 'invoay_commission_1.png',
    label: 'Invoay - Core Software Features'
  },
  {
    url: 'https://invoay.com/Blog/salon-staff-commission-payroll-management-india-invoay/',
    filename: 'invoay_commission_2.png',
    label: 'Invoay - Blog: Staff Commission & Payroll Management'
  },
  {
    url: 'https://invoay.com/backoffice/',
    filename: 'invoay_staff_2.png',
    label: 'Invoay - Backoffice (Payroll/ERP Module)'
  },
  {
    url: 'https://invoay.com/salon-software-india/',
    filename: 'invoay_staff_3.png',
    label: 'Invoay - Salon Software India (Features Overview)'
  },
  {
    url: 'https://invoay.com/my-salon-clinic-spa-software/',
    filename: 'invoay_commission_3.png',
    label: 'Invoay - My Salon/Clinic/Spa Software'
  },
  {
    url: 'https://invoay.com/pricing-rupees/',
    filename: 'invoay_pricing_1.png',
    label: 'Invoay - Pricing (INR)'
  },

  // EasySalon pages
  {
    url: 'https://easysalon.in/',
    filename: 'easysalon_staff_1.png',
    label: 'EasySalon - Homepage (All Features Overview)'
  },
  {
    url: 'https://easysalon.in/blog/the-benefits-of-using-salon-management-software-a-comprehensive-guide',
    filename: 'easysalon_commission_1.png',
    label: 'EasySalon - Blog: Benefits of Salon Management Software'
  },
  {
    url: 'https://easysalon.in/blog/offline-vs-%20online-salon-management-software',
    filename: 'easysalon_staff_2.png',
    label: 'EasySalon - Blog: Offline vs Online Salon Software'
  }
];

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  for (const page of pages) {
    console.log(`\nCapturing: ${page.label}`);
    console.log(`  URL: ${page.url}`);

    const tab = await browser.newPage();
    await tab.setViewport({ width: 1440, height: 900 });

    try {
      await tab.goto(page.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait a bit for lazy-loaded content
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Auto-scroll to trigger lazy loading
      await tab.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 100);
        });
      });

      // Wait for images to load after scrolling
      await new Promise(resolve => setTimeout(resolve, 1500));

      const filepath = path.join(OUTPUT_DIR, page.filename);
      await tab.screenshot({
        path: filepath,
        fullPage: true
      });

      console.log(`  Saved: ${filepath}`);
    } catch (err) {
      console.error(`  ERROR capturing ${page.url}: ${err.message}`);
    } finally {
      await tab.close();
    }
  }

  await browser.close();
  console.log('\nAll captures complete!');
  console.log(`Screenshots saved to: ${OUTPUT_DIR}`);
})();
