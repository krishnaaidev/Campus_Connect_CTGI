# CampusConnect CTGI — Smart Student & Campus Management Portal

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.4-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**CampusConnect** is a comprehensive, responsive college portal built for **CT Group of Institutions (CTGI)**. It integrates academic management, attendance tracking with target goal calculations, examination schedules, fee ledgers, corporate placement drives, hostel management, digital student identity cards with verifiable QR codes, and a dedicated mobile camera QR scanner for gatekeepers and campus security.

---

## 🚀 Live Production Deployment

- **Firebase Hosting Live Site:** [https://campus-connect-ctgi.web.app](https://campus-connect-ctgi.web.app)
- **Firebase Alternative Domain:** [https://campus-connect-ctgi.firebaseapp.com](https://campus-connect-ctgi.firebaseapp.com)
- **GitHub Repository:** [https://github.com/krishnaaidev/Campus_Connect_CTGI](https://github.com/krishnaaidev/Campus_Connect_CTGI)

---

## 🌟 Key Product Features

### 1. Dual Approval Engine for Hosteller Gate Passes & Leave
- **Mandatory Dual Approval:** Outing passes and extended home leave requests for resident hostellers require formal approval from **both** the designated Department Academic Authority (Class Incharge / HOD / HOI) **and** the assigned Hostel Warden before a valid pass is issued.
- **Immediate Rejection Propagation:** Rejection with remarks by either authority immediately marks the request `REJECTED` and notifies the student.
- **State Machine:** `PENDING_BOTH` ➔ `PENDING_WARDEN` / `PENDING_ACADEMIC` ➔ `APPROVED` ➔ `EXIT_RECORDED` ➔ `RETURN_RECORDED`.

### 2. Day Scholar 2:00 PM (14:00) IST Policy Rule
- Standard day-scholar outing requests must be submitted **before 2:00 PM IST** on normal working days (Monday–Friday).
- Submissions at or after 2:00 PM are automatically flagged as **Late Requests**, prominently displaying a warning notice and requiring supervisor sign-off. Late requests are never auto-approved.

### 3. Dedicated Mobile Apps for Gatekeeper & Security Guard
- **Gatekeeper Mobile App (`GatekeeperScanner`):**
  - Live device camera QR scanner powered by HTML5-QRCode.
  - High-contrast visual `ALLOW` (Vibrant Green) / `DENY` (Crimson) states with accessible cues.
  - Data minimization: Shows only minimum necessary student details (Photo, Name, Roll No, Valid Time Window, Destination).
  - One-tap buttons: **"Record Gate Exit"** and **"Record Gate Return"**.
  - Prevents replay attacks, duplicate exits, and invalid returns.
  - Manual pass number search fallback for offline or damaged camera situations.
- **Security Guard Mobile App (`SecurityGuardView`):**
  - Field pass spot check and verification.
  - Fast Security Incident Logging (Category, Location, Description, Student ID, Audit reference).
  - Emergency contact hotlines (Security Control, Medical Dispensary, Chief Warden).

### 4. 14 Role-Specific Dashboards & 1-Click Demo Switcher
An interactive **Demo Persona Switcher** is pinned at the top of the interface allowing instant switching among all 14 personas:

| # | Role Persona | Key Capabilities & Views |
|---|--------------|--------------------------|
| 1 | **Student (Hosteller)** | Attendance calculator, Digital ID, Gate pass & Leave forms, Hostel complaints, Fees |
| 2 | **Student (Day Scholar)** | Academic dashboard, Day scholar outing form with 2:00 PM cutoff banner, Transport info |
| 3 | **Gatekeeper** | Dedicated camera QR pass scanner, ALLOW/DENY screen, exit/return event logger |
| 4 | **Security Guard** | Spot pass verification, incident reporting desk, emergency dispatch |
| 5 | **Hostel Warden** | Hosteller approval queue, residents outside campus monitor, room maintenance |
| 6 | **Class Incharge** | Academic pass sign-off, class attendance register, marks overview |
| 7 | **HOD (Computer Science)** | Departmental overview, escalated approvals, faculty workload |
| 8 | **Head of Institution (HOI)** | Institutional clearances, academic governance |
| 9 | **Fee Collection Staff** | Student fee ledger, record payments (UPI/DD/Online/Cash), receipt generation, reconciliation |
| 10 | **DRCC Staff** | Student welfare queue, document verification, scholarship support |
| 11 | **Dean Student Welfare** | Confidential grievance handling, anti-ragging oversight, welfare requests |
| 12 | **Campus Director** | Executive cockpit: student body count, attendance %, fee collection rate, active gate outings |
| 13 | **Other Directors** | Directorate of Academic Affairs & research analytics |
| 14 | **Placement Cell** | Corporate recruitment drives, student eligibility, interview rounds |
| 15 | **Administrator** | User accounts & roles management, institutional policy configuration, system audit trail |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React icons
- **Build Tool:** Vite 6 with optimized chunk splitting
- **Authentication & Cloud:** Firebase Auth (Email/Password), Firebase Hosting
- **QR Engine:** `qrcode` for digital pass & student ID generation, `html5-qrcode` for real-time mobile camera scanning
- **Storage:** Local & session persistent hybrid store with institutional mock data and full audit logging
- **Default Timezone:** `Asia/Kolkata` (IST) with live clock synchronization

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krishnaaidev/Campus_Connect_CTGI.git
   cd Campus_Connect_CTGI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run automated test suite:**
   ```bash
   npm test
   ```

6. **Create production build:**
   ```bash
   npm run build
   ```

---

## 📱 Mobile & PWA Testing

The application is responsive and touch-friendly for all screen sizes:
- iPhone SE (375px), iPhone 14/15/16 Pro (393px), Pixel 7/8 (412px), iPads/Tablets (768px - 1024px), and Desktop (1280px+).
- **PWA Installation:** Includes `manifest.json` and responsive viewport meta tags (`viewport-fit=cover`) so it can be added to the mobile home screen as a standalone application.

---

## 🔒 Security & Data Minimization

- **No Passwords in Plaintext:** Uses Firebase Authentication with industry-standard hashing.
- **Signed Opaque QR Tokens:** QR codes do not embed student passwords, banking credentials, or unnecessary personal contact data.
- **Server-Side Validation:** Pass status, expiry windows, duplicate exits, and cancellations are verified on the backend/engine.
- **Audit Trail:** Sensitive actions (approvals, rejections, payments, gate check-outs, policy modifications) generate auditable logs with actor, timestamp, and entity ID.

---

## 📜 Institutional Configuration & Policies

All policies can be adjusted by the Administrator in the **Admin Settings** tab:
- **Default Working Hours:** Monday–Friday, 9:00 AM – 4:30 PM IST
- **Day Scholar Pass Deadline:** 14:00 (2:00 PM IST)
- **Hosteller Evening Curfew:** 19:30 (7:30 PM IST)
- **Hosteller Dual Approval:** Enabled by default

---

## 👨‍💻 Developed for

**CT Group of Institutions (CTGI)**  
Shahpur & Maqsudan Campuses, Jalandhar, Punjab, India  
*Approved by AICTE & PCI • Affiliated to IKGPTU*
