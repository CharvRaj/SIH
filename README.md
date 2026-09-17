# MoSPI Adaptive Learning Platform (Ministry of Statistics and Programme Implementation)

An enterprise-grade, government-compliant, adaptive capacity-building and employee learning platform built for the **Ministry of Statistics and Programme Implementation (MoSPI)** in alignment with **Mission Karmayogi** (National Programme for Civil Services Capacity Building).

---

## 🏛️ Platform Highlights

1. **Official Indian Government Design & Themes**:
   - Deep Navy/Government Blue (`#1e3a5f`), Saffron & Green accents, National Emblem integration, bilingual toggle (English / हिन्दी).
   - Fully switchable **Light / Dark Theme** with contrast compliance and accessible typography.
2. **Role-Based Architecture**:
   - **Employee / Cadre Officer Dashboard** (ISS & SSS Officers, FOD, NAD, ESD, CPD).
   - **HR & Training Division Dashboard** (National Statistical Systems Training Academy - NASA).
   - **Super Admin Dashboard** (Ministry System Health, Audit Logs, iGOT Integration status).
3. **Comprehensive 20-Page Suite**:
   - `LandingPage.jsx`: Hero, features, statistical domains, Mission Karmayogi overview, FAQ accordion, footer.
   - `LoginPage.jsx` / `RegisterPage.jsx` / `ForgotPasswordPage.jsx`: Official authentication with 1-click Demo Persona access.
   - `EmployeeDashboard.jsx`: Progress stats, learning path, upcoming meetings, assigned tasks.
   - `HRDashboard.jsx`: Cadre stats, department performance charts, employee table, Add Employee modal, CSV/Excel import.
   - `AdminDashboard.jsx`: System status, 12 stat cards, trend charts, iGOT sync, quick actions.
   - `OnboardingPage.jsx`: 4-step cadre induction (Personal, Employment, Competencies, Interests).
   - `AssessmentPage.jsx`: Full-screen assessment player with timer, question palette, review tags, and instant scoring.
   - `SkillGapPage.jsx`: Radar charts and bar comparisons against Ministry benchmarks.
   - `LearningPathPage.jsx`: Milestone-based adaptive progression for SSS/ISS cadres.
   - `CoursesPage.jsx`: Official iGOT Karmayogi catalog with filtering, search, and enrollment.
   - `WeeklyReportsPage.jsx`: Weekly activity log submissions, supervisor reviews, and CSV downloads.
   - `MeetingsPage.jsx`: Ministry sync sessions, NIC VC integration, and ICS calendar exports.
   - `TasksPage.jsx`: Action items and reporting obligations with priority filtering and status toggles.
   - `PerformancePage.jsx`: Continuous evaluation charts, APAR dossier history, and competency index.
   - `EmployeeDetailPage.jsx`: **Full 11-Tab Officer Dossier** (Overview, Assessments, Skill Gap, Learning Path, Weekly Reports, Meetings, Tasks, APAR, Documents, Activity Log, Cadre Admin).
   - `NotificationsPage.jsx`: Ministry circulars, announcements, and priority alerts.
   - `SettingsPage.jsx`: Profile, 2FA security, alert preferences, and admin iGOT API gateway configuration.
   - `ChatbotPage.jsx`: **MoSPI Sahayak** AI Assistant tuned for CPI, IIP, GDP, and NSS sampling methodologies.

---

## 🔑 Default Credentials

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Officer (Employee)** | `rajesh.sharma@mospi.gov.in` | `Officer@123` | Employee Dashboard, Assessments, Learning Path |
| **HR Administrator** | `hr@mospi.gov.in` | `Hr@123` | HR Dashboard, Cadre Management, CSV Import |
| **Super Administrator** | `admin@mospi.gov.in` | `Admin@123` | Super Admin Dashboard, System Config, Audit Logs |

*(Quick 1-click persona buttons are also available directly on the login screen!)*

---

## 🚀 Getting Started

### 1. Client (Frontend)
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Server (Backend API)
MongoDB Connection URI: `mongodb://localhost:27017/SIH` (Database: `SIH`)

```bash
cd server
npm install
npm run seed     # Seeds SIH database with realistic MoSPI officers & courses
npm start        # Starts Express server on http://localhost:5000
```

---

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS v3, Recharts, Lucide Icons, i18next (EN / HI), jsPDF, xlsx.
- **Backend**: Node.js, Express, Mongoose (MongoDB), JWT, Bcryptjs, Multer, Helmet, Morgan.
- **Standards**: WCAG 2.1 AA accessible, responsive across mobile, tablet, and desktop viewports.
