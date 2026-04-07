# Zenoti vs Vagaro: Payroll & Commission Feature Analysis

> Research date: 2026-04-06

---

## 1. Zenoti (Enterprise Tier -- $225+/month)

### 1.1 Commission Setup

**Three-level hierarchy (highest priority wins):**

| Level | Scope | Typical use |
|-------|-------|-------------|
| Item level | Per-service / per-product | Override for premium services |
| Employee level | Individual employee | Star performers with custom deals |
| Job level | Entire job role (e.g. "Senior Stylist") | Uniform baseline |

*Priority rule:* Item > Employee > Job. If an item-level commission exists it overrides everything below it.

**Commission types supported:**
- **Flat amount** -- fixed dollar/rupee per service or product
- **Percentage of revenue** -- single % on closed invoice value
- **Revenue-slab (tiered)** -- multiple slabs (e.g. 0-500 = 10%, 501-1000 = 15%, 1001+ = 20%)
  - Two calculation modes:
    1. **Highest qualified** -- the entire revenue earns the rate of the highest slab reached (good for aggressive incentives)
    2. **Cumulative (graduated)** -- each portion of revenue earns the rate of its own slab (more granular, incremental reward)
- **Tenure-based commission** -- commission % increases with employee tenure at the company
- **Membership commissions** -- separate slab config for membership sales

**Revenue slab edge case:** When revenue exceeds the maximum configured slab, commission is calculated only up to the last slab ceiling; the excess earns zero commission (configurable).

**Commission calculated on:** Closed invoices only (full payment received).

### 1.2 Salary / Payroll Calculation

- **Zenoti Integrated Payroll (ZIP):** Full payroll engine built into the platform
- Payroll plans configured at the organization level; assigned to employees
- Supports salary, hourly, and commission-only pay structures
- Auto-calculates: base pay + commissions + tips + overtime - deductions - taxes = net pay
- Pay periods: weekly, bi-weekly, semi-monthly, monthly
- Tax filing: federal + state compliance handled automatically (US-focused)
- **Payroll hours calculation** can be based on:
  - Actual check-in / check-out times
  - Scheduled hours
  - A combination of scheduled + actual hours

### 1.3 Payslip / Pay Statement

- Generated through the **Payroll Register Report**
- Breakdown columns: Gross Earnings, Taxes (employee + employer), Benefits (employee + employer), Other Deductions, Net Pay
- Exportable as CSV / XLSX with itemized columns for each deduction type
- Employees can view their payslips through the self-service dashboard

### 1.4 Staff Self-Service

- **My Dashboard** accessible from appointment view, queue view, or top-right initials menu
- Shows: monthly tasks, schedule, upcoming appointments, and payroll details
- Real-time earnings visibility: commissions, tips, KPIs
- Reduces payroll-related disputes by giving transparent access

### 1.5 Deductions Supported

- Federal and state income tax
- Health insurance (employee + employer contributions)
- Retirement / 401(k) plans (employee + employer contributions)
- Custom deduction types
- Pre-tax and post-tax deduction handling

### 1.6 Attendance -> Payroll Integration

- **Check-in methods:** Biometric (fingerprint), PIN, mobile check-in
- Real-time attendance logging; syncs directly with payroll
- Tracks: expected vs actual check-in/check-out, breaks, leave, shift compliance
- **Employee Attendance Details Report** shows day-by-day attendance with expected vs actual hours
- Attendance data feeds directly into payroll hours calculation

---

## 2. Vagaro (Mid-market -- $30-85/month + $34/month payroll add-on)

### 2.1 Commission Setup

**Commission structures per category:**

| Category | Options |
|----------|---------|
| Services | Tiered by revenue OR flat % per service |
| Products | Tiered by revenue OR fixed amount per product sold |
| Classes | Tiered by revenue OR per-class commission |

**Tiered commission by revenue:**
- Default tab when configuring commissions
- Add tiers with: top range value + commission % (or flat amount) per employee
- Example: $0-500 at 20%, $501-1000 at 25%, $1001+ at 30%
- Supports per-employee customization within the same tier structure

**Business cost deductions from commissions:**
- Toggle: "Deduct Service/Class/Add-on Cost" -- commission calculated on profit, not gross
- Toggle: "Deduct Product Cost" -- same for retail
- Toggle: "Deduct Membership Discount from Commission" -- commission based on amount actually paid
- Formula: Commission = (Price Charged - Business Cost) x Commission %
- Example: $50 service with $10 cost at 30% = ($50-$10) x 30% = $12

### 2.2 Salary / Payroll Calculation

- **Vagaro Payroll** powered by Gusto (third-party integration)
- Additional cost: $34/month + $6/employee/month
- Pay structures: hourly, salary, commission-only, or hybrid
- Hourly: employees select a role when clocking in; pay rate tied to role
- Supports overtime calculations
- Automatic tax filing: federal, state, local taxes
- Year-end forms (W-2, 1099) generated automatically
- Pay periods: weekly, bi-weekly, semi-monthly, monthly

### 2.3 Payslip / Payroll Report

**Desktop view:** Table format showing per-employee:
- Regular and overtime pay rate + hours worked
- Total sales and commission amounts
- Rent collected
- Tips
- Taxes and other deductions
- Reimbursements and benefits
- Net payroll due

**Mobile view:** Card-based layout per employee:
- Employee name + photo
- Hourly rate, hours worked
- Business cost, gross sales
- Commission total
- **Payroll Due** row at bottom = total owed

**Payroll History Report:** Historical lookup of all past payroll runs, filterable by date range.

### 2.4 Staff Self-Service

- Employees access their profile > Payroll tab
- Can view and download: paystubs, tax forms (W-2, 1099), other documents
- Time off request flow:
  - Request from Employee Profile ("+ Add Time Off") or directly from calendar
  - Shows: current balance, requested hours, remaining balance after approval
  - Status tracking: pending / approved / denied
- Update personal information (address, bank details, etc.)

### 2.5 Deductions Supported

- Federal, state, and local income tax (automatic via Gusto)
- Business cost deductions from commissions (service cost, product cost)
- Membership discount deductions
- Rent collection (booth rent model)
- Custom payroll deductions

### 2.6 Attendance -> Payroll Integration

- **Clock-in methods:** Manual entry, employee card swipe, QR code scan (via Pay Desk / PayPro / barcode scanner)
- All clock-in/out entries sync directly to payroll reporting
- **Time Card Report:** Shows daily clock-in/out times + total hours per employee
- Flags missing clock-out entries for admin review
- Role-based clock-in: employee selects job role at clock-in, pay rate adjusts accordingly
- Automatic hourly pay calculation based on logged hours

---

## 3. Feature Comparison Matrix

| Feature | Zenoti | Vagaro |
|---------|--------|--------|
| **Pricing** | $225+/mo (all-in) | $30-85/mo + $34/mo payroll |
| **Commission tiers/slabs** | Yes -- revenue slabs with cumulative or highest-qualified | Yes -- tiered by revenue |
| **Commission levels** | 3 levels (item/employee/job) with priority | Per-category (service/product/class) |
| **Flat + % commission** | Both supported | Both supported |
| **Tenure-based commission** | Yes | No |
| **Membership commission** | Dedicated slab config | Basic (deduct discount toggle) |
| **Business cost deduction** | Via payroll config | Per-toggle (service/product/membership) |
| **Payroll engine** | Built-in (ZIP) | Third-party (Gusto) |
| **Tax filing** | Automatic (federal + state) | Automatic (federal + state + local) |
| **Payslip format** | Register report (table + export) | Table (desktop) + Cards (mobile) |
| **Staff self-service** | My Dashboard (earnings, KPIs, schedule) | Profile > Payroll tab (paystubs, PTO) |
| **Attendance methods** | Biometric, PIN, mobile | Card swipe, QR, manual |
| **Attendance -> payroll** | Direct sync (actual or scheduled hours) | Direct sync via time cards |
| **Overtime** | Supported | Supported |
| **Mobile payroll view** | Via app dashboard | Card-based layout |
| **Role-based pay rates** | Via job-level config | Clock-in role selection |

---

## 4. UI Patterns Worth Noting

### Zenoti UI Patterns
1. **Three-level commission hierarchy** with clear priority override -- reduces config confusion for large chains
2. **Cumulative vs highest-qualified toggle** on revenue slabs -- powerful for different incentive models
3. **My Dashboard** as a single pane for employee: schedule + earnings + KPIs in one view
4. **Payroll Register Report** with CSV/XLSX export that separates EE vs ER contributions -- useful for accountants
5. **Biometric check-in** integration provides tamper-proof attendance

### Vagaro UI Patterns
1. **Card-based payroll view on mobile** -- clean, scannable, one card per employee showing all pay components
2. **Business cost toggle pattern** -- simple on/off switches for "deduct service cost", "deduct product cost", "deduct membership discount" -- very intuitive
3. **Tiered commission table** with "+Add" button to add tiers inline -- low-friction configuration
4. **Role-based clock-in** -- employee picks their role at clock-in and pay rate auto-adjusts; elegant for multi-role staff
5. **Gusto integration** means tax/compliance is handled by a specialist payroll provider -- less maintenance burden

---

## 5. What MioSalon Can Learn

### From Zenoti:
1. **Revenue slab commission with dual calculation modes** (cumulative vs highest-qualified) -- this is a powerful differentiator that many salon owners ask for
2. **Three-level commission hierarchy** (item > employee > job) -- provides flexibility without overwhelming small salon owners if defaults are set at job level
3. **Tenure-based commission** -- automatic loyalty reward for long-serving staff; reduces turnover
4. **Real-time earnings dashboard** for employees -- transparency reduces disputes

### From Vagaro:
1. **Business cost deduction toggles** -- dead simple UX; salon owners understand "deduct product cost from commission" as a toggle much better than a formula
2. **Mobile card-based payroll view** -- essential for salon owners who manage payroll on the go
3. **Role-based clock-in** -- many salon staff wear multiple hats (stylist + receptionist); pay should reflect current role
4. **Gusto-style payroll partnership** -- rather than building full tax/compliance in-house, partner with a local payroll provider for tax filing

### Recommended MioSalon Approach:
1. Support **tiered/slab commissions** with both cumulative and flat modes (like Zenoti)
2. Use **toggle-based business cost deductions** (like Vagaro) for simplicity
3. Build a **mobile-first payroll card view** (like Vagaro) for owner convenience
4. Provide **employee self-service earnings view** (like Zenoti) to reduce admin queries
5. Keep commission configuration at **two levels** (employee + service/product) to avoid over-complexity for the mid-market
6. Integrate **attendance directly into payroll** with support for QR/PIN check-in

---

## Sources

### Zenoti
- [Configure Commissions (Help Center)](https://help.zenoti.com/en/employee-and-payroll/configure-commissions.html)
- [Revenue Slabs Based Commissions at Employee Level](https://help.zenoti.com/en/articles/728807-configure-revenue-slabs-based-commissions-at-the-employee-level)
- [Employee Commissions Overview](https://help.zenoti.com/en/configuration/employee-configurations/configure-commissions/employee-commissions.html)
- [Set Up Payroll Plans](https://help.zenoti.com/en/employee-and-payroll/onboard-and-set-up/set-up-payroll-plans-for-your-organization.html)
- [Zenoti Integrated Payroll Overview](https://help.zenoti.com/en/zenoti-integrated-payroll/getting-started-with-zenoti-integrated-payroll/zenoti-integrated-payroll-overview.html)
- [Employee Payroll Summary v2 Report](https://help.zenoti.com/en/employee-and-payroll/employee-related-manager-tasks/employee-payroll-summary-v2-report.html)
- [View Your Dashboard](https://help.zenoti.com/en/employee-and-payroll/other-tasks/view-your-dashboard.html)
- [Set Up Tenure Commission](https://help.zenoti.com/en/employee-and-payroll/set-up-tenure-commission.html)
- [Employee Check-in and Checkout](https://help.zenoti.com/en/admin/employee-check-in-and-checkout.html)
- [Employee Performance Management](https://www.zenoti.com/platform/employee-performance-management/)

### Vagaro
- [Configure Your Payroll Settings](https://support.vagaro.com/hc/en-us/articles/204347910-Configure-Your-Payroll-Settings)
- [Set Up Commissions for Services](https://support.vagaro.com/hc/en-us/articles/21475957047323-Set-Up-Commissions-for-Services)
- [Set Up Commissions for Products](https://support.vagaro.com/hc/en-us/articles/21476003547419-Set-Up-Commissions-for-Products)
- [Run a Payroll Report](https://support.vagaro.com/hc/en-us/articles/360018855214-Run-a-Payroll-Report)
- [Deduct Business Costs from Payroll](https://support.vagaro.com/hc/en-us/articles/204347950-Specify-Deduct-Business-Costs-from-Payroll)
- [Payroll History Report](https://support.vagaro.com/hc/en-us/articles/115003990314-Payroll-History-Report)
- [Set Up Hourly Pay Rates](https://support.vagaro.com/hc/en-us/articles/21476003590299-Set-Up-Hourly-Pay-Rates)
- [Clock In and Out with Timecards](https://support.vagaro.com/hc/en-us/articles/204347510-Clock-In-and-Out-with-Timecards)
- [Vagaro Payroll (Feature Page)](https://www.vagaro.com/pro/payroll)
- [Vagaro Payroll FAQ](https://support.vagaro.com/hc/en-us/articles/34800129419675-Vagaro-Payroll-FAQ)
