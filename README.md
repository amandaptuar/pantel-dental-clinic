# Patil Dental Clinic & Implant Center - CRM & Practice Management System

> **Contact & Support:** +91 95796 49009  
> **Platform:** Windows, Android & Web (Progressive Web Application)  
> **Architecture:** Hybrid Cloud (Supabase PostgreSQL) + 100% Offline Resilience (LocalStorage / IndexedDB)  
> **Languages:** English & मराठी (Marathi) Bilingual  

---

## 🌟 Comprehensive Features Included

### 1. Multi-User Role-Based Accounts (3 Clinic Accounts)
- **Dr. Anand Patil** (Admin / Chief Dental Surgeon & Implantologist - MDS)
- **Dr. Neha Patil** (Associate Dental Surgeon - Pediatric & Orthodontics)
- **Pooja Salunkhe** (Receptionist, Patient Care & Billing Coordinator)
- Instant account switcher with role badges and PIN security.

### 2. Patient Registration & Unique ID Generation
- Auto-generated Patient ID: `PDC-YYYY-XXX` (e.g. `PDC-2025-001`)
- Complete demographics: Name, Age, Gender, Phone (+91), Email, Address, Occupation, Blood Group
- Medical history alerts: Diabetes, Hypertension, Bleeding disorders, Cardiac conditions, Asthma, Pregnancy, and specific drug allergies (Penicillin, NSAIDs, Local Anesthetics)
- Emergency contact name, relation, and phone number.

### 3. Interactive Adult & Pediatric Dental Charts
- **Adult Arch (32 teeth)**: FDI 11-48 notation and Universal 1-32 mapping.
- **Pediatric Arch (20 milk teeth)**: FDI 51-85 notation and A-T mapping.
- **Tooth & Surface-Wise Charting**:
  - Occlusal (O), Mesial (M), Distal (D), Buccal/Facial (B), Lingual/Palatal (L)
- **Color-Coded Status Overlays**:
  - Sound / Healthy (White)
  - Caries / Decay (Red)
  - Filled / Restoration (Blue)
  - Missing Teeth (Dark Gray with 'X')
  - Root Canal (RCT) (Purple with root fill indicator)
  - Crown & Bridge (Amber / Golden Cap)
  - Extraction Needed (Dashed Red Outline)
  - Dental Implant (Cyan with titanium fixture graphic)
- Click any tooth for surface toggling, tooth-specific clinical history notes, and 1-click **Add to Treatment Plan**.

### 4. Specialized Treatment Modules
- **RCT / Re-RCT Records**:
  - Canal tracking: MB1, MB2, DB, Palatal, Mesial, Distal
  - Working length in millimeters (mm), Reference anatomical points, Master Apical File (MAF)
  - Irrigation protocol (NaOCl + EDTA ultrasonic activation), Biocompatible Sealers (Bio-ceramic CeraSeal / AH Plus), Post & Core type
- **Crown & Bridge Records**:
  - Materials: Monolithic Zirconia, Layered Zirconia, E.max Lithium Disilicate, PFM, Full Metal
  - VITA Classical & Bleach Shade Guide (A1, A2, A3, BL2, etc.)
  - Lab name, Prep date, Impression sent date, Lab due date, Try-in date, Cementation date, and Cement agent (RelyX U200, GIC Type I)
- **Veneers & Smile Designing**:
  - Pre-op shade vs Target bleach shade
  - Mockup approval dates, 1:1 anterior macro photography logs
- **Clear Aligners & Full Mouth Rehabilitation (FMR)**:
  - Upper / Lower tray staging and count, wear interval (10-14 days), IPR records (mm), Composite attachments
  - FMR: Occlusal Vertical Dimension (OVD) freeway space, Centric relation, Deprogramming jig status.

### 5. Diagnosis & Treatment Planning
- Tooth-wise procedure itemization with cost estimation
- Status tracking: Planned, In Progress, Completed
- **1-Click "Create Invoice from Plan"**: Automatically converts completed treatments into patient invoices.

### 6. Clinical Notes
- Structured clinical daily logs: Chief Complaint (C/C), On-Examination (O/E), Treatment Performed Today, and Next Visit Plan.

### 7. Bilingual Consent Forms & USB Biometric Fingerprint Scanner
- **Dual Language**: **मराठी (Marathi)** & **English**
- **Treatment-Wise Templates**:
  1. General Dental Examination & Treatment
  2. Root Canal Treatment (RCT / Re-RCT)
  3. Tooth Extraction & Minor Oral Surgery (Impacted Wisdom Teeth)
  4. Dental Implants
  5. Orthodontics & Clear Aligners
  6. Crowns, Bridges & Smile Designing (Veneers)
- **USB Biometric Fingerprint Scanner**:
  - Real-time USB scanner simulation & WebAuthn hook (compatible with Mantra MFS100, Morpho, Startek, Digital Persona)
  - Real-time fingerprint touch sensor pulse animation with quality rating and cryptographic scan ID.
- **Digital Touch / Mouse Signature Pad**:
  - Patient or guardian can sign using finger on mobile/tablet screens or mouse on PC.
- **Legally Binding PDF Generation**:
  - Official clinic header (+91 95796 49009), bilingual legal risks, verified biometric badge, and signatures.

### 8. Appointment Management & 6-Month Preventive Recall
- Daily agenda, upcoming appointments, and full calendar view
- Clinic OPD shifts: Morning 10:00 AM - 2:00 PM & Evening 5:00 PM - 9:00 PM
- Scheduled holidays and clinic closures manager
- **6-Month Preventive Recall Tracker**:
  - Automatic recall flagging for patients 6 months post-treatment for routine prophylaxis and scaling.
  - 1-Click WhatsApp invite for 6-month checkup.

### 9. Automatic Invoicing, Treatment Billing & Partial Payments
- Treatment-wise itemization, discounts, and tax
- Advance and partial payments recording (Cash, UPI / GPay, Card, Bank Transfer)
- Pending balance due tracking
- **1-Click WhatsApp Pending Bill Reminder** with clinic direct UPI ID (`9579649009@upi`)
- Printable PDF Invoice generator with receipts history.

### 10. Lab Charges & Prosthetic Orders Section
- Lab order tracking to external dental laboratories (Sai Precision Dental Lab, SmileCraft Aesthetic Studio, Global Dental Prosthetics, etc.)
- Work type, shade, due date, delivery status (Sent, In Progress, Received, Delivered)
- Lab charge calculation and payment tracking (Pending vs Paid to Lab).

### 11. Digital e-Prescriptions (Rx)
- Built-in Dental Medicine Database (Augmentin 625, Amox 500, Metrogyl 400, Zerodol-SP, Ketorol-DT, Chymoral Forte, Pan-D, Hexidine 0.2% mouthwash, Dologel CT, etc.)
- Dosage, Frequency (1-0-1, 1-1-1, 1-0-0, 0-0-1, SOS), Duration, and Food Timing
- **Marathi & English toggle**: "जेवणानंतर घ्यावे", "सकाळी उपाशीपोटी", "कोमट पाण्यात मीठ टाकून गुळण्या कराव्यात"
- Instant printable PDF Rx letterhead with doctor's registration number and signature line.
- 1-Click WhatsApp prescription notification.

### 12. Cloud Sync (Supabase) + Local Backup & Data Export
- Direct Supabase PostgreSQL URL and Anon Key configuration modal
- Complete Database SQL Schema migration script (ready to copy and run in Supabase SQL editor)
- **Local Backup**: Download full clinic database as JSON and restore anytime
- **CSV Export**: Patients, Invoices, Appointments, and Lab Orders exported to Excel/CSV.

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
pnpm install
# or
npm install

# 2. Start local development server
pnpm dev
# or
npm run dev

# 3. Build production bundle
pnpm run build
```

---

## ☁️ Supabase Cloud Database Setup (Optional 2-Minute Setup)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. In the Patil Dental Clinic CRM, click the **Database / Cloud** icon in the header, go to the **Database SQL Schema** tab, and click **Copy SQL Script**.
4. Paste and click **Run** in Supabase SQL Editor. All 12 tables and security policies are created immediately.
5. In the CRM, enter your **Project URL** and **Anon Public Key** in the Cloud Settings modal and click **Save & Enable**.
