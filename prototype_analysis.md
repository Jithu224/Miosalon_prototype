# Salary Calculator Module - Prototype Analysis Report

**Date:** 2026-04-06
**Scope:** Salary Calculator module in MioSalon clone prototype
**Methodology:** Code review of all 7 source files + visual comparison against 20+ MioSalon screenshots

---

## 1. Executive Summary

The Salary Calculator module is a well-structured, feature-rich addition to the MioSalon clone prototype. It implements a complete salary lifecycle (Setup -> Calculate -> Review -> Approve -> Pay -> Payslip) across 4 pages and supporting components. The module correctly reuses shared components (PageWrapper, DataTable, Modal, Button, Badge, Avatar) and integrates with the existing staff and invoice stores for commission auto-calculation.

**Overall Assessment: 7.5/10**

The module scores well on functionality and calculation logic but has notable gaps in UI consistency with MioSalon's actual patterns, missing sub-features visible in MioSalon's staff/commission pages, and some edge-case handling issues in the calculation engine.

### Key Strengths
- Complete salary lifecycle with draft/approved/paid status flow
- Real commission auto-pull from invoice store
- Pro-rata calculation for mid-month joiners
- Advance recovery with automatic status tracking
- Attendance-based deductions with live preview
- CSV export and printable payslip

### Key Weaknesses
- UI patterns diverge from MioSalon in several areas (stat card styling, tab placement, navigation structure)
- Missing MioSalon features: commission profile tiers, target-based slabs, staff working hours, payroll history comparison
- No form validation beyond basic empty checks
- Hardcoded month default (`2026-04`) instead of dynamic current month
- No bulk approval/payment flow
- No undo/revert capability after approval

---

## 2. Feature Depth Analysis

### 2.1 Feature Comparison with MioSalon Modules

| Feature Area | MioSalon (from screenshots) | Prototype Implementation | Gap |
|---|---|---|---|
| **Commission Profiles** | Dedicated Commission Profile modal with: commission-by-range/percentage, completion criteria, qualifying days, "include tip amount" toggle, target tiers (Screenshot 138-142) | Simplified: uses staff.commissionType + staff.commissionRate from staff store, no tiered commission | **HIGH** - Missing tier-based commission slabs |
| **Staff Working Hours** | Attendance modal with daily working hours, add staff, date range (Screenshot 136) | Simple days present/absent/half-day counts; no hourly tracking | **MEDIUM** - No hourly granularity |
| **Target Tiers** | "Add Target Tier" button with quantity-based or percentage-based tiers, by-amount/by-count options (Screenshot 141) | IncentiveRule with regex condition parsing (`revenue > 50000`) | **HIGH** - Hardcoded regex vs. proper tier data model |
| **Staff Commission Assignment** | "Assign Staff Commission" modal with profile selector + staff picker (Screenshot 142) | Commission rate stored directly on Staff entity | **MEDIUM** - No reusable commission profiles |
| **Payroll Reports** | Reports module has tabs: Appointment & Sales, Membership, Campaign Performance, Feedback, Account Profit, Prepaid Balance, Packages, Expenses, Staff Reports (Screenshot 80, 85) | Single CSV export; no built-in reports page | **MEDIUM** - No payroll reports integration |
| **Expense Tracking** | Add Expense modal with category, denomination, payment mode, notes (Screenshot 120) | Not integrated; salary outflow not tracked as expense | **LOW** - Out of scope but would be nice |
| **Settings Sub-pages** | Settings > Point of Sale, Invoice Print, SMS Templates, Email, Cash Registry, Denomination settings (Screenshot 95, 100, 105, 110, 115) | Salary Setup is a standalone page, not under Settings | **LOW** - Design choice, acceptable |
| **Multi-branch Support** | Business Locations setting visible in Settings (Screenshot 95) | No multi-branch salary processing | **LOW** - Prototype scope |

### 2.2 Data Model Completeness

**File:** `src/types/salary.ts`

| Type | Assessment | Missing Fields |
|---|---|---|
| `SalaryProfile` | Good foundation | Missing: `commissionProfileId`, `overtimeRate`, `pfPercentage`, `esiPercentage`, `tdsPercentage`, `effectiveFrom` date |
| `SalaryAdvance` | Adequate | Missing: `approvedBy`, `recoverySchedule` (lump-sum vs. installment), `maxMonthlyDeduction` |
| `IncentiveRule` | Weak | Missing: proper tier structure (min/max ranges), `effectiveFrom`/`effectiveTo`, `isActive` flag |
| `AttendanceEntry` | Adequate | Missing: `overtime`, `lateComings`, `earlyGoings`, hourly breakdown |
| `SalaryRecord` | Good | Missing: `approvedBy`, `approvedAt`, `paidAt`, `paymentMode`, `transactionRef`, `remarks` |
| `CustomDeduction` | Adequate | Missing: `isRecurring` flag for auto-apply each month |

### 2.3 Missing Features (Prioritized)

| Priority | Feature | Impact |
|---|---|---|
| P0 | Commission profile tiers (matching Screenshot 138-141 slab structure) | Commission calculation accuracy |
| P0 | Form validation on salary setup (e.g., negative base salary, missing required fields) | Data integrity |
| P1 | Bulk approve/pay flow for multiple staff at once | Operational efficiency |
| P1 | Salary history comparison (month-over-month) | Reporting |
| P1 | Recurring deductions (PF, ESI auto-applied monthly) | Reduces manual work |
| P2 | Overtime calculation | Feature completeness |
| P2 | Tax (TDS) deduction support | Regulatory compliance |
| P2 | Integration with Reports module tabs | Navigation consistency |
| P3 | Multi-branch salary processing | Scalability |
| P3 | Salary revision history / audit trail | Compliance |

---

## 3. UI Consistency Analysis

### 3.1 Layout Pattern Comparison

| UI Element | MioSalon Pattern (from screenshots) | Prototype Implementation | Match? |
|---|---|---|---|
| **Sidebar** | Blue vertical sidebar with icon-only navigation, ~16 items visible (Screenshot 60, 95) | Blue sidebar (`bg-[#1e40af]`) with icon-only nav, 10 items | Partial - Color matches, fewer items |
| **Breadcrumbs** | "Settings > Point of Sale", "Settings > Staff" breadcrumb trails at top (Screenshot 100, 135) | No breadcrumbs; uses PageWrapper title + back button | **NO** - Missing breadcrumb navigation |
| **Top Tabs** | Horizontal tab bar with underline-style active indicator; used in Reports (Screenshot 80, 85) and Staff pages (Screenshot 135) | Uses `<Tabs>` component in detail page only; dashboard has no tabs | **PARTIAL** - Detail page OK, dashboard lacks tabs |
| **Stat Cards** | Dashboard uses colored background cards: blue, yellow, red, green with large numbers (Screenshot 60, 62) | Custom `SalaryStatCards` with colored borders and backgrounds (amber, blue, red, emerald) | **CLOSE** - Similar concept but different styling |
| **Data Tables** | White background, column headers in grey, alternating rows, search bar above (Screenshot 80, 85, 135) | Uses `DataTable` component with tanstack/react-table | **YES** - Matches well |
| **Modals** | Centered modal with title bar, X close, form fields, Cancel/Save buttons at bottom-right (Screenshot 120, 136, 140, 142, 160) | Uses `<Modal>` component with similar pattern | **YES** - Good match |
| **Form Fields** | Label above input, grey borders, consistent spacing (Screenshot 100, 120, 160) | Uses `<Input>` and `<Select>` components | **YES** - Consistent |
| **Action Buttons** | Primary blue button at top-right; "Save" in blue, "Cancel" in outline (Screenshot 100, 120, 160) | Matches: blue primary, outline secondary | **YES** - Good match |
| **Page Title** | Large title at top-left, often with subtitle (Screenshot 60, 80, 95) | Uses `PageWrapper` with title + subtitle | **YES** - Matches |

### 3.2 Specific UI Issues

**Issue 1: Stat Card Styling Mismatch**
- MioSalon (Screenshot 60): Uses **filled colored backgrounds** (solid blue, yellow, red, green) with white text
- Prototype (`SalaryStatCards.tsx`, line 24): Uses **light tinted backgrounds** with dark text (`bg-amber-50`, `bg-blue-50`)
- Impact: Visual inconsistency with dashboard
- File: `src/components/salary/SalaryStatCards.tsx`, lines 15-18

**Issue 2: Missing Breadcrumbs**
- MioSalon consistently shows breadcrumb navigation (e.g., "Settings > Staff", "Settings > Point of Sale")
- The salary sub-pages (Setup, Advances, Detail) only use a "Back" button
- Impact: Users lose context of where they are in the hierarchy
- Files: `src/app/salary-calculator/setup/page.tsx` line 221, `src/app/salary-calculator/advances/page.tsx` line 173

**Issue 3: Tab Structure on Dashboard**
- MioSalon Reports page (Screenshot 80, 85) uses a prominent horizontal tab bar for sub-sections
- MioSalon Staff page (Screenshot 135) uses tabs: Staff List, Unit List, Daily Working Hours, Business Closed Dates, Commission Profile, Staff Commission, Image Parlour, Product Stock
- Salary Calculator dashboard has no tabs; sub-sections (Setup, Advances) are buttons in the action bar
- Impact: Pattern inconsistency; users expect tab navigation
- File: `src/app/salary-calculator/page.tsx`, lines 221-228

**Issue 4: Sidebar Navigation Position**
- In MioSalon (Screenshot 60, 95), the sidebar items are roughly: Quick Sale, Appointments, Dashboard, Customers, Staff, Campaigns, Feedback, Online Booking, Settings
- Prototype inserts "Salary" between Staff and Campaigns (`src/lib/constants.ts`, line 20)
- Note: MioSalon does not appear to have a dedicated Salary Calculator sidebar item; salary/commission features are under Staff settings
- Impact: Navigation does not match original MioSalon; may confuse users expecting it under Staff or Settings
- File: `src/lib/constants.ts`, line 20

**Issue 5: Advances Page Stat Cards Use Different Component**
- Dashboard uses `SalaryStatCards` (custom component)
- Advances page (line 181-215) manually builds stat cards using `<Card>` with inline icon+text
- Impact: Two different stat card patterns within the same module
- File: `src/app/salary-calculator/advances/page.tsx`, lines 181-215

### 3.3 Color Scheme Consistency

| Color Usage | MioSalon | Prototype | Match? |
|---|---|---|---|
| Primary Blue | `#1e40af` sidebar, blue buttons/tabs | `#1e40af` sidebar, blue-500 focus rings | YES |
| Success/Paid | Green badges | `emerald` badges and net salary display | YES |
| Warning/Pending | Yellow/amber badges | `amber`/`warning` badges | YES |
| Error/Deductions | Red text | `red-600` for deductions | YES |
| Background | White with light grey borders | White with `slate-200` borders | YES |

---

## 4. Flow & Logic Analysis

### 4.1 User Journey Mapping

```
[Setup] --> [Calculate All] --> [Review Dashboard] --> [Click Staff Row] --> [Detail Page]
  |              |                                            |
  |              |                                     [Breakdown Tab]
  |              |                                     [Attendance Tab] --> Save --> Recalculate
  |              |                                     [Deductions Tab] --> Add/Remove --> Recalculate
  |              |                                     [Payslip Tab] --> Print/Download
  |              |                                            |
  |              |                                     [Approve] --> [Mark Paid]
  |              |
  +--- [Advances] --> Record Advance
```

**Assessment:** The primary flow is logical and complete. However:

### 4.2 Flow Issues

**Issue F1: Recalculate Resets Status to Draft (CRITICAL)**
- File: `src/store/useSalaryStore.ts`, line 256
- When `calculateSalary` is called, it always sets `status: 'draft'` (line 256)
- If a salary is already "approved" and user clicks Recalculate, it reverts to "draft"
- There is no confirmation dialog before overwriting an approved salary
- Risk: Approved salaries can be accidentally overwritten

**Issue F2: No Edit-in-Place for Salary Records**
- Users cannot manually adjust individual line items (e.g., override commission amount)
- They must go through: modify inputs -> recalculate -> review
- This is acceptable but MioSalon-like tools typically allow direct editing

**Issue F3: Advance Recovery Runs Every Calculation (MEDIUM)**
- File: `src/store/useSalaryStore.ts`, lines 272-283
- Every time salary is calculated, advance recovery amounts are re-applied
- If salary is calculated multiple times, the `deducted` field keeps incrementing
- Line 278: `newDeducted = a.deducted + recovery.amount` -- this is cumulative!
- **BUG:** Multiple recalculations will over-deduct advances

**Issue F4: Download PDF is Actually Just Print (LOW)**
- File: `src/app/salary-calculator/[staffId]/page.tsx`, lines 469-474
- Both "Print" and "Download PDF" buttons call `window.print()`
- No actual PDF generation (e.g., via html2canvas or jsPDF)

**Issue F5: Month Default is Hardcoded**
- File: `src/app/salary-calculator/page.tsx`, line 38: `useState('2026-04')`
- File: `src/app/salary-calculator/[staffId]/page.tsx`, line 60: fallback `'2026-04'`
- Should dynamically use current month: `new Date().toISOString().slice(0, 7)`

**Issue F6: No Confirmation Before Destructive Actions**
- "Calculate All" overwrites all existing draft/approved records without confirmation
- "Mark Paid" has no confirmation dialog
- "Approve" has no confirmation dialog

### 4.3 Edge Case Analysis

| Edge Case | Handled? | Details |
|---|---|---|
| Negative net salary (deductions > gross) | YES | `Math.max(0, grossSalary - totalDeductions)` at `salaryCalculation.ts:149` |
| Mid-month joiner | YES | `calculateProRataBase()` at `salaryCalculation.ts:20-38` |
| No salary profile configured | YES | Returns null from `calculateSalary`, shows error toast |
| Staff with no invoices (zero commission) | YES | Commission calculates to 0 |
| Commission-only pay structure | YES | Base salary set to 0 at `salaryCalculation.ts:121` |
| Fixed-only pay structure | YES | Commission set to 0 at `salaryCalculation.ts:122` |
| No attendance entry | PARTIAL | Defaults to 26 working days, 0 absences -- no deduction calculated but also no warning |
| Staff deactivated after calculation | NOT HANDLED | Deactivated staff still show in salary records; no archival |
| Custom pay cycle period | NOT HANDLED | `customPeriodStart`/`customPeriodEnd` fields exist in type but never used in calculation |
| Division by zero (0 working days) | YES | Guarded at `salaryCalculation.ts:45-46` |
| Concurrent recalculations | NOT HANDLED | No optimistic locking; Zustand persist could cause race conditions |
| Month with no invoices at all | YES | Revenue = 0, commission = 0 |

### 4.4 Commission Auto-Pull Logic Review

**File:** `src/store/useSalaryStore.ts`, lines 196-210

The commission auto-pull logic:
1. Gets all invoices from `useInvoiceStore`
2. Filters by `staffId`, `status === 'paid'`, and month prefix match on `createdAt`
3. Sums `inv.subtotal` for revenue, `inv.tip` for tips

**Issues found:**
- **Line 205:** `inv.createdAt.startsWith(month)` -- This assumes `createdAt` is in ISO format starting with "YYYY-MM". If the format differs, commission will be 0.
- **No product-vs-service distinction:** MioSalon's commission profiles (Screenshot 138-140) have "Include tip amount in calculation" toggle and differentiate by service type. The prototype lumps all invoice subtotals together.
- **staffId matching:** Assumes each invoice has a single `staffId`. MioSalon supports multiple staff per appointment (seen in booking modal, Screenshot 50). Multi-staff invoices would be missed or double-counted.

---

## 5. MioSalon Attribute Consistency Check

### 5.1 Navigation Placement

| Check | Status | Notes |
|---|---|---|
| Sidebar icon present | YES | Calculator icon at position 6 of 10 |
| Correct hierarchy | **NO** | MioSalon has salary/commission under Settings > Staff, not as a top-level sidebar item |
| Sub-page navigation | **PARTIAL** | Uses buttons instead of tabs/breadcrumbs |
| URL structure | YES | `/salary-calculator`, `/salary-calculator/setup`, `/salary-calculator/advances`, `/salary-calculator/[staffId]` |

### 5.2 Responsive Patterns

| Check | Status | Notes |
|---|---|---|
| Stat cards grid breakpoints | YES | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| Table horizontal scroll | NOT VERIFIED | DataTable component likely handles this |
| Button wrapping | YES | `flex-wrap` used on button bars |
| Modal responsiveness | DEPENDS | Modal component needs review |
| Print layout | YES | `@media print` CSS included in detail page |

### 5.3 Error States and Empty States

| State | Handled? | Implementation |
|---|---|---|
| No salary data for month | YES | EmptyState component with action buttons (page.tsx:252-268) |
| Staff not found | YES | EmptyState with back button ([staffId]/page.tsx:190-194) |
| Salary not yet calculated | YES | EmptyState with "Calculate Now" button ([staffId]/page.tsx:251-262) |
| No advances | YES | DataTable renders empty (implicit) |
| No custom deductions | YES | "No custom deductions" text ([staffId]/page.tsx:418) |
| No pending advances | YES | "No pending advances" text ([staffId]/page.tsx:459) |
| Loading/hydration state | YES | Skeleton placeholders with animate-pulse |
| API/calculation error | PARTIAL | Toast errors for missing profile, but no error boundaries |
| No configured staff | NOT HANDLED | "Calculate All" silently returns empty array; no warning |

---

## 6. Issues Found (Prioritized)

### Critical (P0)

| # | Issue | File | Line(s) | Description |
|---|---|---|---|---|
| 1 | Advance over-deduction bug | `src/store/useSalaryStore.ts` | 272-283 | Multiple recalculations cumulatively increase `deducted` amount beyond the original advance |
| 2 | Recalculate resets approved status | `src/store/useSalaryStore.ts` | 256 | No guard against overwriting approved/paid records |
| 3 | No form validation | `src/app/salary-calculator/setup/page.tsx` | 99-124 | Negative salary, empty fields, non-numeric input all accepted |

### High (P1)

| # | Issue | File | Line(s) | Description |
|---|---|---|---|---|
| 4 | Hardcoded month default | `src/app/salary-calculator/page.tsx` | 38 | Should use `new Date().toISOString().slice(0, 7)` |
| 5 | Missing breadcrumbs | All sub-pages | - | MioSalon pattern uses breadcrumb trails for nested pages |
| 6 | Commission model too simple | `src/lib/salaryCalculation.ts` | 4-17 | No tiered/slab commission matching MioSalon's Commission Profile feature |
| 7 | Download PDF is fake | `src/app/salary-calculator/[staffId]/page.tsx` | 472 | "Download PDF" just calls `window.print()` |
| 8 | No bulk approve/pay | `src/app/salary-calculator/page.tsx` | - | Dashboard table has no checkboxes or bulk action buttons |

### Medium (P2)

| # | Issue | File | Line(s) | Description |
|---|---|---|---|---|
| 9 | Inconsistent stat card patterns | `advances/page.tsx` vs `SalaryStatCards.tsx` | - | Two different stat card implementations within same module |
| 10 | No confirmation dialogs | `page.tsx`, `[staffId]/page.tsx` | Various | Calculate All, Approve, Mark Paid have no confirmation |
| 11 | Custom pay cycle not implemented | `src/lib/salaryCalculation.ts` | All | `customPeriodStart`/`customPeriodEnd` fields in type but unused |
| 12 | Navigation placement mismatch | `src/lib/constants.ts` | 20 | Salary is a top-level nav item; MioSalon has it under Staff/Settings |
| 13 | Tab structure on dashboard | `src/app/salary-calculator/page.tsx` | - | Should use tabs (Dashboard / Setup / Advances / Reports) like MioSalon Reports page |

### Low (P3)

| # | Issue | File | Line(s) | Description |
|---|---|---|---|---|
| 14 | Stat card colors don't match MioSalon dashboard | `SalaryStatCards.tsx` | 15-18 | Uses light tints instead of solid colored backgrounds |
| 15 | No salary revision audit trail | `src/types/salary.ts` | 60-74 | SalaryRecord lacks `approvedBy`, `approvedAt`, `paidAt` fields |
| 16 | No recurring deduction support | `src/types/salary.ts` | 34-38 | CustomDeduction lacks `isRecurring` flag |
| 17 | No attendance warning when missing | `src/store/useSalaryStore.ts` | 212-215 | Silently defaults to 26 working days with 0 absences |
| 18 | `replace('-', ' ')` only replaces first hyphen | `PayslipPreview.tsx` | 42-43 | Should use `.replaceAll('-', ' ')` or regex |

---

## 7. Recommendations (Prioritized)

### Immediate Fixes (Before Demo)

1. **Fix advance over-deduction bug** (Issue #1): In `calculateSalary()`, before applying advance recovery, reset deducted amounts or track what was already recovered for this specific salary calculation. Refactor lines 272-283 of `useSalaryStore.ts` to calculate recovery as an idempotent operation.

2. **Add status guard on recalculation** (Issue #2): Before overwriting a record, check if `existingRecord.status !== 'draft'` and either (a) show a confirmation, or (b) preserve the previous status, or (c) block recalculation for paid records.

3. **Fix hardcoded month** (Issue #4): Replace `useState('2026-04')` with `useState(() => new Date().toISOString().slice(0, 7))` in both `page.tsx` (line 38) and `[staffId]/page.tsx` (line 60 fallback).

4. **Add basic form validation** (Issue #3): In `handleSave()` of `setup/page.tsx`, validate that `baseSalary >= 0` for non-commission-only structures, and show error toasts for invalid input.

### Short-Term Improvements (1-2 Weeks)

5. **Add breadcrumb component**: Create a `Breadcrumb` component and add it to PageWrapper. Display: "Salary Calculator > Setup", "Salary Calculator > Advances", "Salary Calculator > [Staff Name]".

6. **Restructure dashboard with tabs**: Convert the dashboard to use tab navigation matching MioSalon's Reports page pattern: `Dashboard | Setup | Advances | History`. This eliminates the button-bar navigation and aligns with MioSalon's tab pattern.

7. **Add confirmation dialogs**: Wrap "Calculate All", "Approve", and "Mark Paid" actions with a confirmation modal. Use the existing `<Modal>` component.

8. **Unify stat card styling**: Extract a single `StatCard` primitive component and use it in both the dashboard and advances page. Match MioSalon's solid-color card style from the Dashboard screenshots.

9. **Add bulk operations**: Add checkbox column to the DataTable on the dashboard. Add "Approve Selected" and "Mark Paid Selected" buttons that appear when rows are checked.

### Medium-Term Enhancements (2-4 Weeks)

10. **Implement tiered commission profiles**: Create a `CommissionProfile` entity matching MioSalon's UI (Screenshot 138-141) with min/max revenue tiers, percentage/fixed-per-service options, and qualifying day requirements. Link to staff via `commissionProfileId`.

11. **Add payroll reports sub-page**: Create `/salary-calculator/reports` with month-over-month comparison, staff-wise breakdowns, and department totals. Integrate with the existing Reports module tab structure.

12. **Implement actual PDF generation**: Replace `window.print()` with a proper PDF library (e.g., `@react-pdf/renderer` or `html2canvas` + `jsPDF`) for the payslip download.

13. **Add recurring deductions**: Add `isRecurring` boolean to `CustomDeduction` type. During salary calculation, auto-apply recurring deductions from the previous month.

14. **Move navigation placement**: Consider moving the salary calculator under Settings or Staff as a sub-section, matching MioSalon's navigation hierarchy. Alternatively, keep it as a top-level item but document the deliberate deviation.

### Long-Term (Backlog)

15. Implement overtime and hourly tracking with integration to attendance
16. Add TDS/tax calculation support
17. Add multi-branch salary processing
18. Implement salary revision history and audit trail
19. Add payment integration (bank transfer, UPI) with transaction references
20. Build salary comparison charts and trend analytics

---

## Appendix: Files Reviewed

| File | Lines | Purpose |
|---|---|---|
| `src/app/salary-calculator/page.tsx` | 272 | Main dashboard with stat cards, DataTable, month selector |
| `src/app/salary-calculator/setup/page.tsx` | 322 | Staff salary profile configuration |
| `src/app/salary-calculator/advances/page.tsx` | 272 | Advance tracking and recording |
| `src/app/salary-calculator/[staffId]/page.tsx` | 493 | Individual staff salary detail with 4 tabs |
| `src/components/salary/PayslipPreview.tsx` | 119 | Printable payslip component |
| `src/components/salary/SalaryStatCards.tsx` | 36 | Dashboard stat cards |
| `src/components/salary/MonthSelector.tsx` | 24 | Month input selector |
| `src/store/useSalaryStore.ts` | 311 | Zustand store with calculation orchestration |
| `src/lib/salaryCalculation.ts` | 152 | Pure calculation functions |
| `src/lib/exportUtils.ts` | 43 | CSV export utility |
| `src/types/salary.ts` | 74 | TypeScript type definitions |
| `src/data/mockSalaryData.ts` | 365 | Mock data for 8 staff members |
| `src/lib/constants.ts` | 52 | Navigation items and app constants |
| `src/components/layout/Sidebar.tsx` | 51 | Sidebar navigation component |

## Appendix: Screenshots Referenced

| Screenshot | Content | Relevance |
|---|---|---|
| Screenshot (60), (62) | MioSalon Dashboard with stat cards | Stat card styling comparison |
| Screenshot (80), (85) | MioSalon Reports with tab navigation | Tab structure pattern |
| Screenshot (95) | MioSalon Settings page | Settings layout, breadcrumbs |
| Screenshot (100) | Invoice Print Settings | Settings sub-page form pattern |
| Screenshot (105) | SMS Templates | Settings sub-page list pattern |
| Screenshot (110) | Email settings | Settings sub-page form pattern |
| Screenshot (115) | Cash Registry / Denomination | Settings sub-page form pattern |
| Screenshot (120) | Add Expense modal | Modal form pattern |
| Screenshot (135) | Staff page with tabs | Tab navigation, DataTable pattern |
| Screenshot (136) | Attendance modal | Attendance data entry pattern |
| Screenshot (137) | Commission Profile list | Commission profile management |
| Screenshot (138-141) | Commission Profile form | Tiered commission configuration |
| Screenshot (142) | Assign Staff Commission | Commission assignment workflow |
| Screenshot (50) | New Booking modal | Complex form/modal pattern |
| Screenshot (160) | New Booking full page | Full-page form pattern |
| Screenshot (30), (35), (40) | Quick Sale / billing | Form layout, payment modes |
