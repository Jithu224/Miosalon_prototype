# Invoay vs EasySalon: Staff Commission & Payroll Feature Analysis

> Research date: April 2026
> Purpose: Competitive analysis for MioSalon salary/commission module

---

## 1. INVOAY (India Market Leader)

**Pricing:** Rs 1,199/user/month
**Scale:** 7,000+ premium salons across India
**Platform:** Web + iOS + Android + Windows apps
**Website:** https://invoay.com

### Commission Setup

| Feature | Details |
|---------|---------|
| **Smart Slabs** | Sliding-scale commission rules (e.g., 10% up to Rs 50,000 sales, 15% after that) |
| **Per-Service Rates** | Different commission % per service category |
| **Product Commissions** | Separate commission tracks for retail product upsells |
| **Role-Based Rules** | Custom commission tiers for Junior vs. Senior stylists |
| **Category Separation** | Independent rules for Services vs. Products |
| **Auto-Calculation** | Real-time commission calculation as bills are generated |
| **Package/Membership** | Auto-calculates incentive on packages and membership wallet services |

### Staff Mobile App & Commission Visibility

| Feature | Details |
|---------|---------|
| **Daily Earnings Check** | Staff can verify earned commission on their own mobile app at any time |
| **Real-Time Transparency** | Commission updates as services are billed - no month-end surprises |
| **Performance Metrics** | Staff Performance Reports visible via app |
| **Dispute Prevention** | Digital system where staff can verify earnings daily |

### Attendance & Shift Management

| Feature | Details |
|---------|---------|
| **Biometric Check-in** | Integrated biometric attendance system |
| **Mobile Check-in** | Alternative to biometric - mobile-based attendance logging |
| **Shift Management** | Schedule staff shifts with clear visibility |
| **Real-Time Tracking** | Track attendance in real-time across all locations |
| **Multi-Location** | Attendance tracking across multiple salon branches |

### Deductions & Leave

| Feature | Details |
|---------|---------|
| **Unapproved Leave Auto-Deduction** | Automatic salary deduction for unapproved leaves |
| **Leave Management** | Manage leave requests and absences |
| **Overtime Adjustments** | Overtime calculations factored into payroll |
| **Service Late Penalties** | Penalties when stylists keep clients waiting |

### Payroll & Payslip

| Feature | Details |
|---------|---------|
| **Automated Salary Calculation** | End-to-end automated monthly payroll processing |
| **Commission Integration** | Commissions + incentives auto-added to salary |
| **Attendance Integration** | Shift data directly feeds into salary computation |
| **Check Printing** | Print salary checks directly from the system |
| **Timely Disbursal** | Streamlined payroll for on-time salary payments |
| **Compliance Management** | General compliance management mentioned (specifics not detailed) |

### Compliance Features

| Feature | Details |
|---------|---------|
| **GST Compliance** | GST-compliant invoicing and automated accounting reports |
| **PF/ESI** | Not explicitly documented in public-facing materials |
| **TDS** | Not explicitly documented |

### Backoffice ERP Module (invoay.com/backoffice/)

Invoay has a separate Backoffice ERP system at erp.invoay.com that handles:
- Payroll disbursement linked to staff performance records
- Integrated attendance and shift data for salary computation
- Employee management across single-location and multi-chain businesses
- Commission/incentive reports on sales and redemptions

---

## 2. EASYSALON (India-Focused)

**Pricing:** Rs 3,125/month (approx; ~$450/year per some sources)
**Scale:** 400+ beauty industry professionals, 7 countries, 150+ cities in India
**Platform:** Cloud-based, WhatsApp-integrated
**Website:** https://easysalon.in

### Commission Setup

| Feature | Details |
|---------|---------|
| **Customizable Rules** | Commission rules linked to billing, services & attendance |
| **Auto-Calculation** | Automatic commission calculation for service providers |
| **Billing Integration** | Payouts directly linked to billing data |
| **Multi-Branch** | Commission rules work across branches |
| **Staff Incentives** | Built into the Smart Billing module |
| **Discount Controls** | Discount authorization to prevent revenue leakage |

### Staff Management

| Feature | Details |
|---------|---------|
| **Smart Staff Allocation** | Intelligent assignment of staff to appointments |
| **Role-Based Access** | Different access levels for different staff roles |
| **Multi-Branch Staff** | Centralized staff management across franchise locations |
| **Performance Reports** | Clear reports on staff performance |

### Attendance Features

| Feature | Details |
|---------|---------|
| **QR Code Check-in** | Instant check-in via QR codes |
| **Secure Link Check-in** | Alternative check-in via secure links |
| **Live Updates** | Real-time attendance status |
| **Tamper-Proof** | Tamper-proof attendance tracking |
| **Billing Integration** | Attendance data feeds into payroll/commission |

### Payroll

| Feature | Details |
|---------|---------|
| **Automated Processing** | Automates commission or salary processing |
| **Attendance-Linked** | Payouts linked to attendance data |
| **Service-Linked** | Payouts linked to services performed |
| **Error Reduction** | Designed to reduce manual calculation errors |
| **Multi-Branch Reports** | Payroll reports across multiple locations |

### Compliance & Deductions

| Feature | Details |
|---------|---------|
| **GST/VAT** | Automatic GST/VAT on invoices |
| **PF/ESI** | Not explicitly documented |
| **Payslip Generation** | Not explicitly documented |
| **Leave Deductions** | Not explicitly documented (likely handled via attendance link) |

### Unique Differentiators

- **WhatsApp-First:** WhatsApp invoices, reminders, booking integration
- **QR Portal:** Public QR portal for each salon branch (e.g., offers, memberships)
- **Free Website:** Includes free website integration for online appointments
- **Auto-Renewals:** Membership auto-renewal for recurring revenue

---

## 3. FEATURE COMPARISON TABLE

| Feature | Invoay | EasySalon |
|---------|--------|-----------|
| **Pricing** | Rs 1,199/user/month | ~Rs 3,125/month |
| **Scale** | 7,000+ salons | 400+ professionals |
| **Commission Slabs** | Yes (sliding scale) | Customizable rules |
| **Per-Service Commission** | Yes (by category) | Yes (linked to billing) |
| **Product Commission** | Yes (separate track) | Not explicitly stated |
| **Staff Mobile App** | Yes (iOS/Android/Windows) | Cloud-based (browser) |
| **Daily Commission Visibility** | Yes (real-time in app) | Via reports |
| **Biometric Attendance** | Yes | No (QR/Link based) |
| **Mobile Check-in** | Yes | Yes (QR + secure links) |
| **Leave Auto-Deduction** | Yes (unapproved leaves) | Attendance-linked |
| **Late Penalties** | Yes (service late penalties) | Not documented |
| **Payslip Generation** | Yes (check printing) | Not documented |
| **Payroll Automation** | Full (salary + commission + attendance) | Yes (billing + attendance linked) |
| **Multi-Branch** | Yes | Yes (centralized) |
| **GST Compliance** | Yes | Yes (GST/VAT) |
| **PF/ESI** | Not documented | Not documented |
| **WhatsApp Integration** | Yes | Yes (core differentiator) |
| **Backoffice ERP** | Yes (separate erp.invoay.com) | Not documented |
| **Role-Based Rules** | Junior/Senior tiers | Role-based access |

---

## 4. UI PATTERNS OBSERVED

### Invoay UI Patterns
1. **Separation of POS and Backoffice:** Invoay runs the salon POS (SimplePOS) separately from the ERP/Backoffice (erp.invoay.com). Payroll lives in the backoffice module.
2. **Staff-Facing Mobile App:** Dedicated app where staff see their own commission, attendance, and performance data - this transparency model is a key selling point.
3. **Smart Slab Configuration:** Commission rules are set up as sliding scales with breakpoints (e.g., Rs 50K threshold), supporting different tiers by role and by service/product category.
4. **Integrated Dashboard:** Performance metrics, attendance, and commission data displayed in dashboards accessible to both owners and staff (with role-appropriate views).
5. **Feature Pages:** Invoay organizes features by use case (salon, spa, clinic) with dedicated landing pages per city - strong SEO strategy.

### EasySalon UI Patterns
1. **WhatsApp-Centric:** Everything flows through WhatsApp - invoices, reminders, bookings. This is a uniquely Indian approach leveraging the dominant messaging platform.
2. **QR-Based Interactions:** Client check-in and public portals are QR-code driven, reducing friction.
3. **All-in-One Homepage:** Features are presented on a single scrolling page rather than separate feature pages.
4. **Branch-First Architecture:** Multi-branch management is core to the product, not an add-on.
5. **Simpler Commission Model:** Compared to Invoay's smart slabs, EasySalon appears to take a simpler approach linking commissions directly to billing events.

---

## 5. WHAT MIOSALON CAN LEARN

### From Invoay:
1. **Smart Slab Commission System:** The sliding-scale commission with role-based tiers (Junior/Senior) and category separation (Services/Products) is a must-have for Indian salons. This is the single most important payroll feature.
2. **Staff-Facing Transparency:** Staff mobile app with real-time commission visibility prevents disputes and increases trust. Staff should be able to check earnings daily, not just at month-end.
3. **Biometric + Mobile Attendance:** Dual attendance options (biometric for in-salon, mobile for flexibility) covers all use cases.
4. **Service Late Penalties:** A unique Indian market feature - penalizing stylists for keeping clients waiting. This drives service quality.
5. **Backoffice Separation:** Keeping payroll/ERP separate from POS prevents screen clutter and role confusion.
6. **Unapproved Leave Auto-Deduction:** Automatic salary deduction for unapproved absences saves owner time and enforces discipline.

### From EasySalon:
1. **WhatsApp-Native Payslips:** Consider sending payslips/commission summaries via WhatsApp - this is where Indian salon staff actually check messages.
2. **QR-Based Attendance:** Simpler than biometric, lower cost, tamper-proof. Good for smaller salons that can't afford biometric hardware.
3. **Billing-Linked Commissions:** Direct link between billing events and commission calculation ensures accuracy and real-time updates.
4. **Multi-Branch Commission Rules:** Centralized commission rule management across branches prevents inconsistency.

### Gaps Both Competitors Leave Open (Opportunities for MioSalon):
1. **PF/ESI Compliance:** Neither competitor explicitly documents PF/ESI auto-calculation. This is a major compliance requirement for salons with 10+ employees in India.
2. **TDS Management:** No documented TDS deduction for contract stylists.
3. **Detailed Payslip Templates:** While Invoay mentions check printing, neither shows detailed payslip templates with full breakdown (basic + HRA + commission + deductions).
4. **Advance Salary Tracking:** Neither competitor documents salary advance management with EMI-style recovery.
5. **Staff Loan Management:** No mention of staff loans/advances with automatic monthly deduction.
6. **Commission Dispute Resolution:** Neither documents a formal dispute resolution workflow.
7. **Performance-Based Bonus Tiers:** Beyond commission slabs, automatic bonus triggers based on monthly/quarterly targets.
8. **Staff Onboarding Workflow:** Document collection, skill certification tracking, probation period commission rules.

---

## 6. KEY URLS REFERENCED

### Invoay
- Homepage: https://invoay.com/
- Features: https://invoay.com/software-features/
- Salon Management: https://invoay.com/salon-management-software/
- Backoffice ERP: https://invoay.com/backoffice/
- Staff Commission Blog: https://invoay.com/Blog/salon-staff-commission-payroll-management-india-invoay/
- Pricing: https://invoay.com/pricing-rupees/
- Salon Software India: https://invoay.com/salon-software-india/
- My Salon/Clinic/Spa: https://invoay.com/my-salon-clinic-spa-software/

### EasySalon
- Homepage: https://easysalon.in/
- Blog (Benefits): https://easysalon.in/blog/the-benefits-of-using-salon-management-software-a-comprehensive-guide
- Blog (Offline vs Online): https://easysalon.in/blog/offline-vs-%20online-salon-management-software

---

*Screenshots captured via Puppeteer script: capture-invoay-easysalon.js*
*Run with: `node capture-invoay-easysalon.js` from the project root*
