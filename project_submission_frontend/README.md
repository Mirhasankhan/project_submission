# Project Submission Portal — Frontend Client

A modern, responsive web application built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**. The portal connects students and mentors in an academic or training environment: students can submit project assignments and track evaluations, while mentors can inspect student repositories, evaluate live applications, and approve or reject submissions with structured feedback.

---

## 🚀 Key Features

- **Dynamic Role-Based Dashboards:**
  - **Student View:**
    - Live statistical metrics (Total Submissions, Pending Review, Approved, Rejected).
    - New submission modal with real-time validation (project title, GitHub repo format, live demo link, description).
    - Real-time submission timeline with approval badges and detailed mentor feedback.
    - Search submissions and filter by review status.
  - **Mentor View:**
    - Unified review queue displaying all incoming student projects.
    - View student information (name, email) and submission metadata.
    - One-click access to code repositories and live project URLs.
    - Approval and Rejection modal with mandatory constructive feedback for rejections.
- **Search & Debounced Filtering:**
  - Real-time search across project names and descriptions with debounced input optimization.
  - Status filter dropdown (`Pending`, `Approved`, `Rejected`, `All Submissions`).
- **Form Validation & Robust Inputs:**
  - Powered by **React Hook Form** and **Zod**.
  - Enforces GitHub repository URL constraints (`https://github.com/owner/repo`).
- **State Management & Data Caching:**
  - **Redux Toolkit** and **RTK Query** with automated cache tag invalidation (`Submissions`, `Auth`).
  - Persistent auth tokens stored in cookies and synced across SSR and client layers.
- **Route Protection & Security:**
  - Next.js Edge Middleware guarding authenticated routes and redirecting unauthenticated users.
  - Server-Side Rendering (SSR) verification for user profile and role switching on the homepage.
- **Modern UI & Micro-Interactions:**
  - Styled with **Tailwind CSS**, **Radix UI** primitives, and **Lucide React** icons.
  - Interactive toast notifications powered by **Sonner**.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components & Icons:** Radix UI (`Dialog`, `Select`, `Checkbox`), Lucide React
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & Redux Persist
- **Data Fetching:** RTK Query & Axios
- **Form Management:** React Hook Form & Zod
- **Notifications:** Sonner
- **Date Formatting:** Day.js & date-fns

---

## 📁 Directory Structure

```
project_submission_frontend/
├── public/                    # Static assets & favicon
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── auth/              # Authentication pages (/login, /register)
│   │   ├── submission/        # Submission details view (/[id])
│   │   ├── layout.tsx         # Root application layout & provider wrapping
│   │   ├── page.tsx           # Home page (SSR role routing: Student vs Mentor)
│   │   ├── loading.tsx        # Fallback loading skeleton
│   │   └── not-found.tsx      # Custom 404 page
│   ├── components/
│   │   ├── auth/              # LoginForm & RegisterForm
│   │   ├── shared/            # Header, CustomPagination, SignOut, Skeleton
│   │   ├── submission/        # StudentDashboard, MentorDashboard, SubmissionCard,
│   │   │                      # CreateSubmissionModal, ApproveRejectModal, StatsCards
│   │   └── ui/                # Radix UI primitives & custom styled components
│   ├── redux/
│   │   ├── api/               # RTK Query baseApi configuration
│   │   ├── features/          # Auth and submission API slices
│   │   ├── store.ts           # Redux store & persist setup
│   │   └── hooks.ts           # Typed useAppDispatch & useAppSelector
│   ├── types/                 # TypeScript interfaces and shared types
│   ├── utils/                 # Helper utilities, cookies, and container layouts
│   └── middleware.ts          # Edge middleware for route protection
├── .env.example               # Example frontend environment variables
├── package.json               # Dependencies and build scripts
├── tailwind.config.js         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md
```

---

## 📋 Prerequisites

Before starting the frontend application, ensure you have:

- [Node.js](https://nodejs.org/) (v18.x or v20.x+)
- [npm](https://www.npmjs.com/) (or yarn / pnpm)
- The **Backend API** running locally on port `4097` (or remote backend URL)

---

## ⚙️ How to Run Locally

### 1. Navigate to the Frontend Directory

```bash
cd project_submission_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` or `.env.local` file by copying the example:

```bash
cp .env.example .env.local
```

Configure your backend API base URL:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:4097/api/v1
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_BASE_URL` | **Yes** | Base URL pointing to the Express backend `/api/v1` route prefix | `http://localhost:4097/api/v1` |

---

## 📜 Available NPM Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack on `http://localhost:3000` |
| `npm run build` | Compiles and builds the production application bundle |
| `npm run start` | Runs the compiled production build on port `3060` (`http://localhost:3060`) |
| `npm run lint` | Runs ESLint to check for code issues and syntax errors |

---

## 👥 Testing Accounts & Workflow

### 1. Student Workflow
1. Navigate to `http://localhost:3000/auth/register`.
2. Create an account with your name, email, and password.
3. Once logged in, click **"New Submission"** on the dashboard.
4. Provide:
   - **Project Name** (e.g. `Portfolio Website`)
   - **GitHub Repository URL** (e.g. `https://github.com/yourusername/portfolio`)
   - **Live URL** (e.g. `https://portfolio.vercel.app`)
   - **Description** (Project summary and technologies used)
5. View your project card with live status: `Pending`.

### 2. Mentor Workflow
1. Log in at `http://localhost:3000/auth/login` using the seeded mentor credentials:
   - **Email:** `mentor@example.com` (or the configured `DEFAULT_MENTOR_EMAIL` in backend `.env`)
   - **Password:** The password configured in your backend `.env` (seeded via `npx prisma db seed`)
2. As a mentor, you will see the **Mentor Review Dashboard**.
3. Inspect student submissions, click to open repository links and live URLs.
4. Click **"Approve"** to approve the submission, or **"Reject"** to reject with mandatory feedback.
5. The student's dashboard will automatically reflect the updated review status and feedback.

---

## 🔧 Troubleshooting

- **API Requests Failing (`ERR_CONNECTION_REFUSED` / Network Error):**
  - Verify that the backend server is running and accessible at `http://localhost:4097`.
  - Check that `NEXT_PUBLIC_BASE_URL` in `.env.local` or `.env` is set to `http://localhost:4097/api/v1`.
  - Ensure the backend's CORS origin includes `http://localhost:3000`.
- **Redirected to Login Unexpectedly:**
  - Authentication tokens are stored in browser cookies (`token` / `accessToken`). If your session expired or backend secrets changed, clear cookies and log in again.
- **Validation Error on Repository URL:**
  - Make sure the URL begins with `https://github.com/` and contains both an owner and repository name (e.g., `https://github.com/username/project`).

---

## 📜 License

This project is licensed under the ISC License.
