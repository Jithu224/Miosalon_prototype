# Salary Calculator Module — Agent Review Report

**Date:** 2026-04-07
**Review Method:** 3 parallel review agents analyzing all source files + PRD
**Agents:** Owner Flow Analysis | Manager+Staff Flow Analysis | Calculation Logic + Edge Cases

---

## Executive Summary

The Salary Calculator module implements a complete salary lifecycle (Setup → Calculate → Review → Approve → Pay → Payslip) with role-based access for Owner, Manager, and Staff. However, the review uncovered **5 critical calculation bugs**, **3 critical access control gaps**, **14 missing PRD features**, and **5 data integrity concerns**. The most impactful finding is that the **mock data does not match the PRD's Ravi example** — the expected net salary of ₹26,937 is impossible to produce from the current mock invoices (actual: ₹7,782).

**Overall Score: 6.5/10** (down from 7.5 in previous review due to deeper analysis)

**PRD Compliance: 5 fully implemented, 7 partial, 1 missing (out of 13 Must-Have FRs)**

---

## 1. PRD Compliance — Must-Have Features (FR-01 to FR-13)

| ID | Feature | Status | Evidence |
|---|---|---|---|
| FR-01 | Staff Salary Profile Setup | **PARTIAL** | `setup/page.tsx` — employment type, base salary, pay cycle, bank details. Missing: join date not in form, custom period dates have no UI |
| FR-02 | Pay Structure Selection | **IMPLEMENTED** | Select: fixed-only/fixed-commission/commission-only/daily-wage. Base salary hidden for commission-only |
| FR-03 | Commission Auto-Pull | **IMPLEMENTED** | Auto-pulls from invoice store. Gap: no tiered commission, no service-vs-product split, single flat rate |
| FR-04 | Incentive/Bonus Config | **PARTIAL** | Store + calculation logic exists for 3 bonus types. **BUT: No UI screen to configure rules** — only mock data. Target bonus regex auto-qualifies on malformed conditions |
| FR-05 | Salary Advance Tracking | **PARTIAL** | Full advance CRUD, balance tracking, deferred recovery on "Mark Paid". Missing: no partial deduction control, no recovery cap (PRD says 50% of gross max) |
| FR-06 | Attendance-Based Deduction | **IMPLEMENTED** | Manual days present/absent/half-days. Formula correct. Auto-recalculates on save. Gap: no validation days add up |
| FR-07 | Custom Deduction Field | **IMPLEMENTED** | Add/remove deductions with label+amount. Auto-recalculates on change. Gap: cannot edit existing deductions |
| FR-08 | Salary Calculation Engine | **IMPLEMENTED** | `calculateFullSalary()` computes correct formula. <3 seconds for all staff |
| FR-09 | Monthly Salary Summary | **IMPLEMENTED** | Dashboard with stat cards + DataTable showing all staff with sortable columns |
| FR-10 | Payslip Generation | **PARTIAL** | PayslipPreview component renders correctly. Missing: "Download PDF" is fake (window.print), no attendance summary, no pay period dates, no logo |
| FR-11 | Bulk Payslip Generation | **MISSING** | No bulk payslip feature anywhere. Must visit each staff individually |
| FR-12 | Export to Excel/PDF | **PARTIAL** | CSV export works. No Excel (.xlsx) or PDF format. No per-staff detail export |
| FR-13 | Pay Period Config | **PARTIAL** | `payCycle` field exists (monthly/custom). Custom period UI fields defined in type but never exposed in form |

**Compliance Rate: 5 fully implemented, 7 partial, 1 missing = 38% fully implemented**

---

## 2. Critical Bugs Found

### Bug 1: No Tiered/Per-Service Commission (CRITICAL)
**File:** `src/lib/salaryCalculation.ts` lines 4-17
**Issue:** Uses a single flat `commissionRate` from the staff record. The PRD requires different rates per service type (15% haircuts, 20% colorings, 10% products).
**Impact:** Commission amounts will be incorrect for any staff with mixed service types.

### Bug 2: Target Bonus Auto-Qualifies on Missing Condition (CRITICAL)
**File:** `src/lib/salaryCalculation.ts` line 65
**Issue:** If `IncentiveRule.type === 'target-bonus'` but `condition` is undefined or doesn't match the regex, the function falls through to `return true` — bonus is always awarded.
**Impact:** Staff may receive unearned bonuses.

### Bug 3: No Advance Recovery Cap (CRITICAL)
**File:** `src/lib/salaryCalculation.ts` line 131
**Issue:** `calculateAdvanceRecovery(pendingAdvances)` is called without `maxRecovery` parameter. The PRD says cap at 50% of gross salary.
**Impact:** An advance of ₹50,000 would consume the entire gross salary, leaving net at ₹0.

### Bug 4: Recalculation Overwrites Approved Salary Amounts (CRITICAL)
**File:** `src/store/useSalaryStore.ts` lines 262-289
**Issue:** When recalculating an approved/paid salary, the `status` is preserved but all financial amounts (base, commission, deductions, net) are overwritten.
**Impact:** Approved salaries can be silently changed without re-approval.

### Bug 5: Mock Data Doesn't Match PRD Example (CRITICAL)
**Files:** `src/data/mockSalaryData.ts`, `src/store/useInvoiceStore.ts`
**Issue:** The PRD expects Ravi's net to be ₹26,937. The mock invoices only produce ₹795 commission (vs PRD's ₹18,800), resulting in net ₹7,782.
**Root cause:** Mock invoices have only ₹5,300 revenue for Ravi vs the PRD's implied ₹125,000+.

---

## 3. Access Control Gaps

### Gap 1: Setup Page Has No Permission Checks
**File:** `src/app/salary-calculator/setup/page.tsx`
**Issue:** Any role (including Staff) can navigate directly to `/salary-calculator/setup` and view/edit all salary profiles. No role check exists anywhere in the page.

### Gap 2: Advances Page Has No Permission Checks
**File:** `src/app/salary-calculator/advances/page.tsx`
**Issue:** Any role can navigate to `/salary-calculator/advances`, view all staff advances, and record new ones. No `canRecordAdvances` check on the page itself.

### Gap 3: Staff Can View Other Staff's Salary via URL
**File:** `src/app/salary-calculator/[staffId]/page.tsx` line 61
**Issue:** `staffId` comes from URL params, not the role store. Staff role user can type `/salary-calculator/staff-2` and see that person's full salary detail, breakdown, and payslip.

### Gap 4: Empty States Show Unauthorized Buttons
**Files:** `page.tsx` lines 279-296, `[staffId]/page.tsx` lines 270-281
**Issue:** "Go to Setup" and "Calculate All/Now" buttons appear in empty states regardless of role permissions.

---

## 4. User Flow Analysis by Role

### Owner (Priya) — MOSTLY COMPLETE
| Flow | Status | Gap |
|------|--------|-----|
| Configure salary profiles | Works | No validation for negative salary (partially fixed) |
| Calculate all salaries | Works | Recalculates approved salaries without warning |
| Review individual staff | Works | — |
| Edit deductions → auto-recalculate | Works | — |
| Edit attendance → auto-recalculate | Works | — |
| Approve salary | Works | No confirmation before approve (fixed with ConfirmDialog) |
| Mark as paid → advance recovery | Works | — |
| View/print payslip | Works | "Download PDF" is fake (just window.print) |
| Export CSV | Works | — |

### Manager (Deepak) — PARTIAL
| Flow | Status | Gap |
|------|--------|-----|
| View all staff salaries | Works | — |
| Calculate salaries | Works | — |
| Record advances | Works via URL | Advances page has no role guard |
| Edit attendance/deductions | Works | — |
| Submit for owner approval | **MISSING** | No "Submit" button; PRD requires explicit submission step |
| Cannot approve/pay | Correctly blocked | — |
| Cannot access Setup | Blocked on dashboard | **Can access via direct URL** |

### Staff (Ravi) — PARTIAL
| Flow | Status | Gap |
|------|--------|-----|
| See only own salary | Works on dashboard | **Can see others via URL manipulation** |
| View breakdown | Works (read-only) | — |
| View payslip | Works | — |
| Print payslip | Works | — |
| Cannot edit anything | Works in UI | — |
| Real-time daily earnings | **MISSING** | PRD goal: "Know exactly how much I'll earn THIS month" |
| Per-service commission detail | **MISSING** | Only shows total commission, not per-haircut breakdown |

---

## 5. Calculation Logic Issues

### Formula Verification (Ravi, April 2026)
| Component | PRD Expects | Code Produces | Match? |
|---|---|---|---|
| Base Salary | ₹12,000 | ₹12,000 | YES |
| Commission | ₹18,800 | ₹795 | **NO** — mock invoices too small |
| Attendance Bonus | ₹1,000 | ₹0 | **NO** — Ravi has 2 absences in mock data |
| Tips | ₹1,200 | ₹550 | **NO** — mock invoices have less tips |
| Gross | ₹33,000 | ₹13,845 | **NO** |
| Net | ₹26,937 | ₹7,782 | **NO** |

**Root cause:** Mock data and PRD example describe different scenarios. The calculation engine itself is correct — the inputs are wrong.

### Edge Cases (PRD Section 8.6)
| Edge Case | Handled? |
|---|---|
| Negative net salary (deductions > gross) | PARTIAL — floors to 0, no warning/carry-forward |
| Mid-month joiner (pro-rata) | PARTIAL — calendar/working days mix |
| Mid-month exit | NOT IMPLEMENTED |
| Zero commission month | WORKS |
| Commission-only with zero | WORKS |
| Multiple advances | WORKS |
| Advance exceeds salary | NOT IMPLEMENTED — no cap |
| Attendance data missing | NOT IMPLEMENTED — silently defaults |
| Discount → commission impact | NOT IMPLEMENTED — not configurable |
| Salary revision mid-month | NOT IMPLEMENTED |
| Paid leave distinction | NOT IMPLEMENTED |
| Duplicate calculation | PARTIAL — amounts overwritten for approved |
| Rounding | NOT PER PRD — rounds per component, not at final level |

---

## 6. Data Integrity Concerns

1. **No cascading cleanup** — deleting a staff member leaves orphaned salary profiles, advances, attendance, deductions, and records in the salary store
2. **Zustand persist rehydration race** — cross-store reads (`useInvoiceStore.getState()`) during early app lifecycle may return stale mock data before localStorage rehydration completes
3. **Pro-rata mixes calendar days with working days** — numerator uses calendar days from join date, denominator uses working days count
4. **Custom bonuses apply perpetually** — "Festival Bonus" has no expiry; applies every month
5. **Invoice date attribution** — uses `createdAt` not `paidAt`; an invoice created March 31 but paid April 2 is attributed to March

---

## 6b. Additional Issues from Owner Flow Agent

### Approval Flow Gaps
| # | Issue | Severity |
|---|-------|----------|
| 1 | **No edit lock after approval** — deductions/attendance can still be changed on approved/paid records. PRD says "approved salary is locked" | CRITICAL |
| 2 | **Can skip approval** — Mark Paid available directly from Draft status (PRD: Draft → Submitted → Approved → Paid) | HIGH |
| 3 | **No "Submitted" status** — PRD FR-15 has Draft → Submitted → Approved → Paid; prototype skips Submitted | MEDIUM |
| 4 | **Recalculating paid salary** changes amounts silently — mismatches what was actually paid to staff | HIGH |

### Missing UI Screens
| # | Screen | Impact |
|---|--------|--------|
| 1 | **Incentive Rules management page** — store CRUD exists but NO UI to add/edit/delete incentive rules | HIGH — FR-04 is unusable without this |
| 2 | **Bulk payslip generation** — no button or screen exists anywhere | HIGH — FR-11 completely missing |
| 3 | **Custom pay cycle date selector** — "Custom" option in dropdown reveals nothing | MEDIUM |

### Payslip Missing Fields (vs PRD Example)
| Field | PRD Shows | Prototype Shows |
|-------|-----------|-----------------|
| Pay period date range | "01 Apr — 30 Apr 2026" | Month name only |
| Attendance summary | "Working Days: 26 \| Present: 24 \| Absent: 2" | Not shown |
| Salon logo | Yes | Not shown |
| Service-wise commission | "80 haircuts × ₹500 × 15% = ₹6,000" | Total commission only |

### Data Validation Gaps
| # | Issue |
|---|-------|
| 1 | Attendance days don't validate: present + absent + halfDays could exceed totalWorkingDays |
| 2 | No warning when net salary hits ₹0 from excessive deductions |
| 3 | Cannot edit existing custom deductions — must delete and re-add |
| 4 | Commission rate not configurable from Setup page — lives in separate Staff module with no link |

---

## 7. Prioritized Recommendations

### P0 — Fix Before Demo
1. **Fix mock invoice data** to match PRD's Ravi example (add more invoices for staff-1 totaling ~₹125K revenue)
2. **Add page-level role guards** on Setup, Advances, and Detail pages (redirect or show "Access Denied" for unauthorized roles)
3. **Fix target-bonus auto-qualification bug** — return false instead of true for missing/malformed conditions
4. **Add advance recovery cap** — pass `grossSalary * 0.5` as `maxRecovery` parameter
5. **Block recalculation for approved/paid records** — show confirmation or block entirely

### P1 — Next Sprint
6. Implement per-service commission tiers (matching MioSalon's Commission Profile feature)
7. Add "Submit for Approval" workflow for Manager role
8. Add staffId validation on detail page (staff can only view their own)
9. Fix empty state buttons to respect role permissions
10. Implement bulk payslip generation (FR-11)

### P2 — Backlog
11. Add paid leave distinction in attendance
12. Implement mid-month exit / final settlement
13. Add daily wage calculation logic
14. Implement salary revision history
15. Add real-time daily earnings view for staff
16. Implement per-service commission breakdown for staff transparency
17. Replace window.print() with actual PDF generation
18. Fix rounding to apply only at final net level per PRD

---

## Appendix: Files Reviewed

| File | Lines | Agent |
|---|---|---|
| `src/app/salary-calculator/page.tsx` | 272 | Agent 1 + 2 |
| `src/app/salary-calculator/setup/page.tsx` | 322 | Agent 1 + 2 |
| `src/app/salary-calculator/advances/page.tsx` | 272 | Agent 2 |
| `src/app/salary-calculator/[staffId]/page.tsx` | 530+ | Agent 1 + 2 |
| `src/store/useSalaryStore.ts` | 311 | Agent 1 + 2 + 3 |
| `src/lib/salaryCalculation.ts` | 152 | Agent 3 |
| `src/store/useRoleStore.ts` | 58 | Agent 2 |
| `src/components/salary/PayslipPreview.tsx` | 119 | Agent 1 |
| `src/data/mockSalaryData.ts` | 365 | Agent 3 |
| `src/types/salary.ts` | 74 | Agent 3 |
| `src/store/useInvoiceStore.ts` | 117 | Agent 3 |
| `src/store/useStaffStore.ts` | — | Agent 3 |
| `src/data/mockStaff.ts` | — | Agent 3 |
| `src/components/layout/Header.tsx` | 115 | Agent 2 |
| `PRD_salon_staff_salary_calculator.md` | 1586 | Agent 1 + 3 |
