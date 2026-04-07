const puppeteer = require('puppeteer');
const path = require('path');

const BASE_URL = 'https://mia-salon-prototype.vercel.app';
const OUTPUT_DIR = path.join(__dirname, 'prototype_screenshots', 'V1_prd_screenshots');
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// All screens needed for PRD Sections 9, 10, 11
const SCREENS = [
  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 1: First-Time Salary Setup (Owner)
  // ═══════════════════════════════════════════════════════════════
  { name: 'J1_01_dashboard_empty_state', url: '/salary-calculator', desc: 'Owner lands on empty salary dashboard' },
  { name: 'J1_02_setup_page_staff_list', url: '/salary-calculator/setup', desc: 'Setup page showing all staff with Configure buttons' },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 2: Monthly Salary Calculation (Owner)
  // ═══════════════════════════════════════════════════════════════
  { name: 'J2_01_dashboard_with_controls', url: '/salary-calculator', desc: 'Dashboard with Calculate All, month selector, staff dropdown', action: 'set-march' },
  { name: 'J2_02_dashboard_after_calculate', url: '/salary-calculator', desc: 'Dashboard showing calculated salaries for all staff', action: 'set-march' },
  { name: 'J2_03_dashboard_stat_cards', url: '/salary-calculator', desc: 'Stat cards: Total Outflow, Commissions, Deductions, Staff Count', action: 'set-march' },
  { name: 'J2_04_month_over_month', url: '/salary-calculator', desc: 'Month-over-month comparison table', action: 'set-march', scrollTo: 'bottom' },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 3: Individual Staff Review (Owner → Ravi)
  // ═══════════════════════════════════════════════════════════════
  { name: 'J3_01_ravi_breakdown_tab', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Ravi salary breakdown: earnings + deductions + net' },
  { name: 'J3_02_ravi_daily_weekly', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Daily & weekly salary breakdown table', scrollTo: 'bottom' },
  { name: 'J3_03_ravi_attendance_tab', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Attendance tab with days input + deduction preview', tab: 'Attendance' },
  { name: 'J3_04_ravi_deductions_tab', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Deductions tab: custom deductions + advance recovery', tab: 'Deductions' },
  { name: 'J3_05_ravi_payslip_tab', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Payslip preview with attendance summary', tab: 'Payslip' },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 4: Approval Workflow (Owner)
  // ═══════════════════════════════════════════════════════════════
  { name: 'J4_01_draft_status_actions', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Draft status with Approve + Mark Paid buttons' },
  // Note: Approve confirmation dialog would need clicking the button

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 5: Advance Tracking
  // ═══════════════════════════════════════════════════════════════
  { name: 'J5_01_advances_page', url: '/salary-calculator/advances', desc: 'Advances page: stat cards + advance ledger' },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 6: Incentive Rules Management
  // ═══════════════════════════════════════════════════════════════
  { name: 'J6_01_incentives_page', url: '/salary-calculator/incentives', desc: 'Incentive rules list with Add Rule button' },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 7: Bulk Payslips
  // ═══════════════════════════════════════════════════════════════
  { name: 'J7_01_bulk_payslips', url: '/salary-calculator/bulk-payslips?month=2026-03', desc: 'All staff payslips stacked for printing' },

  // ═══════════════════════════════════════════════════════════════
  // JOURNEY 8: Export
  // ═══════════════════════════════════════════════════════════════
  // CSV export is triggered by button click, no separate page

  // ═══════════════════════════════════════════════════════════════
  // SECTION 10: Different Users & Their Screens
  // ═══════════════════════════════════════════════════════════════

  // Owner View (Priya)
  { name: 'S10_01_owner_dashboard', url: '/salary-calculator', desc: 'Owner (Priya) full dashboard view', action: 'role-owner' },
  { name: 'S10_02_owner_setup_access', url: '/salary-calculator/setup', desc: 'Owner can access Setup page' },
  { name: 'S10_03_owner_advances_access', url: '/salary-calculator/advances', desc: 'Owner can access Advances + Record button' },
  { name: 'S10_04_owner_staff_detail', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Owner sees Approve + Mark Paid buttons' },
  { name: 'S10_05_owner_incentives', url: '/salary-calculator/incentives', desc: 'Owner can manage incentive rules' },

  // Manager View (Deepak)
  { name: 'S10_06_manager_dashboard', url: '/salary-calculator', desc: 'Manager dashboard with green banner', action: 'role-manager' },
  { name: 'S10_07_manager_staff_detail', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Manager sees Submit for Approval (no Approve/Pay)', action: 'role-manager' },
  { name: 'S10_08_manager_setup_denied', url: '/salary-calculator/setup', desc: 'Manager gets Access Denied on Setup', action: 'role-manager' },

  // Staff View (Ravi)
  { name: 'S10_09_staff_dashboard', url: '/salary-calculator', desc: 'Staff sees only own salary — "My Salary" title', action: 'role-staff' },
  { name: 'S10_10_staff_own_detail', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Staff views own breakdown (read-only)', action: 'role-staff' },
  { name: 'S10_11_staff_payslip', url: '/salary-calculator/staff-1?month=2026-03', desc: 'Staff can view own payslip', action: 'role-staff', tab: 'Payslip' },
  { name: 'S10_12_staff_other_denied', url: '/salary-calculator/staff-2?month=2026-03', desc: 'Staff blocked from viewing other staff', action: 'role-staff' },

  // ═══════════════════════════════════════════════════════════════
  // ADDITIONAL: Other Salary Pages with Data (Priya view)
  // ═══════════════════════════════════════════════════════════════
  { name: 'J3_06_priya_breakdown', url: '/salary-calculator/staff-2?month=2026-03', desc: 'Priya Sharma salary breakdown' },
  { name: 'J3_07_amit_breakdown', url: '/salary-calculator/staff-3?month=2026-03', desc: 'Amit Patel salary breakdown' },
  { name: 'J3_08_deepak_breakdown', url: '/salary-calculator/staff-6?month=2026-03', desc: 'Deepak Singh (therapist) salary breakdown' },
  { name: 'J3_09_arun_breakdown', url: '/salary-calculator/staff-7?month=2026-03', desc: 'Arun Mehta (manager, fixed-only) salary breakdown' },

  // ═══════════════════════════════════════════════════════════════
  // EDIT LOCK STATE
  // ═══════════════════════════════════════════════════════════════
  // Would need an approved record to show the lock banner
];

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  for (const item of SCREENS) {
    try {
      console.log(`[${item.name}] ${item.desc}`);

      // Navigate
      await page.goto(`${BASE_URL}${item.url}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await delay(2500);

      // Handle role switching via header dropdown
      if (item.action === 'role-owner') {
        await page.evaluate(() => {
          const selects = document.querySelectorAll('select');
          for (const s of selects) {
            const opts = Array.from(s.options).map(o => o.value);
            if (opts.includes('owner')) { s.value = 'owner'; s.dispatchEvent(new Event('change', { bubbles: true })); break; }
          }
        });
        await delay(1500);
      }
      if (item.action === 'role-manager') {
        await page.evaluate(() => {
          const selects = document.querySelectorAll('select');
          for (const s of selects) {
            const opts = Array.from(s.options).map(o => o.value);
            if (opts.includes('manager')) { s.value = 'manager'; s.dispatchEvent(new Event('change', { bubbles: true })); break; }
          }
        });
        await delay(1500);
      }
      if (item.action === 'role-staff') {
        await page.evaluate(() => {
          const selects = document.querySelectorAll('select');
          for (const s of selects) {
            const opts = Array.from(s.options).map(o => o.value);
            if (opts.includes('staff')) { s.value = 'staff'; s.dispatchEvent(new Event('change', { bubbles: true })); break; }
          }
        });
        await delay(1500);
      }

      // Handle month switching
      if (item.action === 'set-march') {
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

      // Click tab if specified
      if (item.tab) {
        await page.evaluate((tabName) => {
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent.trim() === tabName) { btn.click(); return; }
          }
        }, item.tab);
        await delay(1500);
      }

      // Scroll if needed
      if (item.scrollTo === 'bottom') {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await delay(1000);
      }

      // Take screenshot
      await page.screenshot({
        path: path.join(OUTPUT_DIR, `${item.name}.png`),
        fullPage: item.scrollTo !== 'bottom',
      });
      console.log(`  ✓ saved`);
    } catch (err) {
      console.error(`  ✗ FAILED: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! ${SCREENS.length} screenshots saved to prototype_screenshots/V1_prd_screenshots/`);
})();
