# 🛡️ WARRIOR — Defence Mock Examination Portal

> **Next-Generation Computer-Based Test (CBT) & Analytics Platform for UPSC CDS & IAF AFCAT Aspirants and NCC Cadets.**

---

## 📖 Overview

**WARRIOR** is a full-featured, realistic Computer-Based Test (CBT) examination simulator and administrative command portal tailored specifically for defence examination aspirants. It replicates the exact examination atmosphere, navigation palette, timing constraints, and negative marking schemes mandated by the **Union Public Service Commission (UPSC CDS)** and the **Indian Air Force (IAF AFCAT)**.

---

## ⚡ Key Highlights & Features

### 👨‍✈️ Cadet Examination Portal
- **Realistic CBT Examination Interface**:
  - Fullscreen exam mode with countdown timer and automated submission on expiry.
  - Interactive Question Palette with real-time status color coding:
    - 🟩 Answered
    - 🟨 Marked for Review
    - 🟪 Answered & Marked for Review
    - ⬜ Not Visited / Not Answered
  - Section-switching (e.g., General Knowledge, English, Elementary Mathematics, Military Aptitude).
  - Clear response, mark for review, and instant navigation.
- **Detailed Scorecard & Answer Review**:
  - Instant calculation of total score, accuracy percentage, time spent, correct, incorrect, and unattempted counts.
  - Official marking rules:
    - **UPSC CDS**: Standard positive marks with $-0.33$ penalty for incorrect answers.
    - **IAF AFCAT**: $+3$ marks for correct, $-1$ penalty for incorrect answers.
  - Question-by-question review with official keys and step-by-step explanations.
- **Cadet Performance & Analytics**:
  - Score progression timeline across all completed attempts.
  - Sectional & subject-wise strengths/weaknesses charts (via Recharts).
  - National Leaderboard with cadet ranks, scores, and accuracy badges.
- **Cadet Account & Registration**:
  - Self-service cadet registration issuing official Cadet IDs (`NCC2026xxxx`).
  - Profile management and test attempt history.

### 🎖️ Officer Admin Command Portal
- **Real-Time Live Activity Monitor**:
  - Live cadet examination telemetry: track ongoing sessions, online status, tests in progress, and active question index.
  - Ability for administrators to remotely terminate active sessions.
- **Question Bank & Paper Management**:
  - Comprehensive question bank categorized by exam stream (CDS / AFCAT), subject, difficulty, and year.
  - Create new mock tests with custom time limits, marks, and negative marking rules.
  - Add single questions or bulk upload via spreadsheet parser.
- **Cadet Management & Dataset Importer**:
  - Search, filter, inspect, and manage enrolled cadets.
  - Import cadet datasets directly via **CSV / Excel (.xlsx, .xls)**.
- **System Settings & Access Control**:
  - Centralized exam toggles, platform configurations, and audit logging.

---

## 🔐 Default Access Credentials

### Officer Admin Portal
* **Login URL**: 
* **Primary Admin**:
  * **Admin ID**: 
  * **Password**: 
* **Alternate Admin**:
  * **Admin ID**: 
  * **Password**: 

### Cadet Candidate Portal
* **Login URL**: 
* **Default Cadet IDs**: 
* **Default Password**: 

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Dev Server** | [Vite 5](https://vitejs.dev/) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) with custom defence military color palette |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts & Visualizations** | [Recharts](https://recharts.org/) |
| **Spreadsheet Processing** | [SheetJS (xlsx)](https://docs.sheetjs.com/) |
| **Celebration FX** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Persistence** | LocalStorage state persistence with mock datasets |

---

## 📁 Project Directory Structure

```text
d:\test\
├── public/                     # Static assets, logos, and redirect rules
│   ├── assets/                 # Brand logos and banners
│   └── _redirects              # SPA routing redirects for deployment (Netlify/Cloudflare)
├── src/
│   ├── assets/                 # Application images & icons
│   ├── components/
│   │   ├── analytics/          # Recharts performance & score progress charts
│   │   ├── common/             # Navbar, Sidebar, Topbar, Footer, Breadcrumbs
│   │   ├── examination/        # CBT Exam Engine: QuestionPalette, Timer, ExamHeader
│   │   └── questionBank/       # Question card list, filters, question viewer
│   ├── context/
│   │   ├── AuthContext.tsx     # Cadet & Admin authentication state and sessions
│   │   ├── DataContext.tsx     # Tests, questions, submissions, and telemetry data
│   │   ├── ExamContext.tsx     # Active CBT exam timer, answers, review state
│   │   └── ToastContext.tsx    # Toast notification alerts
│   ├── data/                   # Default mock datasets (tests, questions, cadets)
│   ├── layouts/                # PublicLayout, CadetLayout, AdminLayout
│   ├── pages/
│   │   ├── admin/              # Admin dashboard, activity monitor, question management
│   │   ├── cadet/              # Cadet dashboard, live CBT exam, results, leaderboard
│   │   └── public/             # Landing page, cadet & admin login pages
│   ├── types/                  # Shared TypeScript interfaces & models
│   ├── utils/                  # Storage service, formatters, dataset parser
│   ├── App.tsx                 # Master routes configuration
│   └── main.tsx                # Application entry point
├── package.json                # Dependencies and build scripts
├── tailwind.config.js          # Military navy & gold theme configuration
└── tsconfig.json               # TypeScript compiler options
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or later recommended)
- **npm** (or `yarn` / `pnpm`)

### Installation
1. Clone or open the repository:
   ```bash
   cd d:\test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🎯 Examination Rules Implemented

| Examination | Stream | Marking Scheme | Penalty for Incorrect |
| :--- | :--- | :--- | :--- |
| **UPSC CDS** | IMA / INA / AFA | $+1$ per question | $-0.33$ marks (1/3rd negative) |
| **UPSC CDS** | OTA (Non-Tech) | $+1$ per question | $-0.33$ marks (1/3rd negative) |
| **IAF AFCAT** | Flying & Ground Duty | $+3$ per question | $-1.00$ mark negative |

---

## 📄 License

This project is developed for educational, training, and examination simulation purposes.
All rights reserved © WARRIOR Defence Mock Test Platform.
