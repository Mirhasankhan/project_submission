# Project Submission Portal — Backend API

A robust, scalable RESTful API built with **Express.js**, **TypeScript**, and **Prisma ORM** (PostgreSQL) for managing student project submissions and mentor evaluations. It features role-based access control, submission validation, automatic repository normalization, duplicate submission prevention, and real-time review statistics.

---

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Distinct roles for `Student` and `Mentor` enforced via JWT authentication middleware.
- **Project Submission Workflow:**
  - Students can submit project milestones including project title, GitHub repository URL, live application URL, and detailed description.
  - Automatic GitHub repository URL normalization to ensure consistency and prevent duplicate submissions.
  - Unique constraint validation ensuring students cannot re-submit duplicate project names or repositories.
- **Mentor Review & Evaluation:**
  - Mentors can view all student submissions with student details (name, email).
  - Ability to approve submissions or reject them with mandatory constructive feedback.
- **Search, Filtering & Pagination:**
  - Full-text search across project titles and descriptions.
  - Status filtering (`Pending`, `Approved`, `Rejected`).
  - Cursor-friendly page and limit pagination with total counts and categorized status statistics (`totalPending`, `totalApproved`, `totalRejected`, `totalCount`).
- **Security & Reliability:**
  - JWT-based authentication with bcrypt-hashed passwords.
  - API rate limiting to protect authentication and mutation endpoints from abuse.
  - Strict input validation powered by **Zod**.
  - Centralized global error handling with standardized JSON API responses.
- **Database Seeding:** Built-in seed script to quickly initialize default Mentor credentials for testing.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (v18 or v20+)
- **Language:** TypeScript
- **Framework:** Express.js (v4)
- **Database:** PostgreSQL
- **ORM:** Prisma ORM (v6)
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Validation:** Zod
- **Development Tooling:** `ts-node-dev`, `ts-node`, `typescript`

---

## 📁 Directory Structure

```
project_submission_backend/
├── prisma/
│   ├── schema.prisma          # Database schema (PostgreSQL & models)
│   └── seed.ts                # Database seeder (creates default mentor)
├── src/
│   ├── app/
│   │   ├── interfaces/        # Common Express and module interfaces
│   │   ├── middlewares/       # Auth guard, rate limiter, error handlers
│   │   ├── modules/
│   │   │   ├── auth/          # Auth routes, controllers, services, validation
│   │   │   └── submission/    # Submission routes, controllers, services, validation
│   │   └── routes/            # Centralized API router (`/api/v1`)
│   ├── config/                # Environment variables configuration
│   ├── errors/                # Custom API error classes
│   ├── helpers/               # JWT helper, query builder, pagination helper
│   ├── shared/                # Prisma client singleton, catchAsync, sendResponse
│   ├── app.ts                 # Express application setup & middleware
│   └── server.ts              # Server bootstrapper & listener
├── .env.example               # Template environment configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compiler configuration
└── README.md
```

---

## 📋 Prerequisites

Before running the backend, make sure you have installed:

- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or via cloud e.g., Supabase, Neon, Railway)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository & Navigate to Directory

```bash
cd project_submission_backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of `project_submission_backend` based on `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in your PostgreSQL database credentials and JWT secrets:

```env
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public"
PORT=4097
BACKEND_BASE_URL="http://localhost:4097"
CORS_ORIGINS="http://localhost:3000,https://project-submission-frontend-roan.vercel.app"
DEFAULT_MENTOR_EMAIL=mentor@example.com
MENTOR_PASSWORD=SecurePassword123!
BCRYPT_SALT_ROUNDS=12
JWT_SECRET="your-jwt-secret-key"
GEN_SALT=10
EXPIRES_IN=90d
REFRESH_TOKEN_PEPPER="your-refresh-token-pepper"
```

### 3a. Configure Supabase Database URLs

The backend uses Prisma with PostgreSQL. Supabase provides two connection URLs
that should be configured separately:

- `DATABASE_URL`: the pooled connection string used by the running application.
- `DIRECT_URL`: the direct database connection string used by Prisma for schema
  operations such as migrations and `db push`.

To get these values:

1. Create or open a project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Open **Connect** and select the **ORMs** or **Connection string** view.
3. Copy the pooled connection string into `DATABASE_URL` and the direct connection
   string into `DIRECT_URL`.
4. Replace the password placeholder with your database password if Supabase does
   not include it in the copied URL.

For a pooled Supabase URL, keep the parameters supplied by Supabase, including
`pgbouncer=true` when it is present. The direct URL normally uses the
`db.<project-ref>.supabase.co` host and port `5432`; do not use the pooler URL
for `DIRECT_URL`. URL-encode special characters in the database password (for
example, `@` becomes `%40`).

Never commit `.env` or share either connection string publicly. The `.env.example`
file contains placeholders only.

### 4. Push Database Schema & Generate Prisma Client

Sync the Prisma schema with your PostgreSQL database:

```bash
npx prisma db push
```

Generate the Prisma Client types:

```bash
npx prisma generate
```

### 5. Seed Initial Data (Default Mentor)

Run the seed script to create the initial Mentor account:

```bash
npx prisma db seed
```

This registers a mentor account with:
- **Email:** Value of `DEFAULT_MENTOR_EMAIL` (default: `mentor@example.com`)
- **Password:** Value of `MENTOR_PASSWORD`
- **Role:** `Mentor`

### 6. Start the Server

#### Development Mode (with hot-reload):
```bash
npm run dev
```

The server will be running at `http://localhost:4097`.

#### Production Build:
```bash
npm run build
npm start
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description | Default / Example |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | Runtime PostgreSQL connection string. With Supabase, use the pooled connection URL from **Connect**. | `postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | **Yes** | Direct PostgreSQL connection used by Prisma for schema operations. With Supabase, use the direct URL from **Connect**, normally on port `5432`. | `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres` |
| `PORT` | No | Port on which the API server runs | `4097` |
| `BACKEND_BASE_URL` | No | Base public URL of backend | `http://localhost:4097` |
| `CORS_ORIGINS` | **Yes** | Comma-separated list of frontend origins allowed to access the API. Do not add trailing slashes. | `http://localhost:3000,https://project-submission-frontend-roan.vercel.app` |
| `DEFAULT_MENTOR_EMAIL` | **Yes** | Seeded mentor's email address | `mentor@example.com` |
| `MENTOR_PASSWORD` | **Yes** | Seeded mentor's initial password | `SecurePassword123!` |
| `JWT_SECRET` | **Yes** | Secret key for signing JSON Web Tokens | `your-secret-key` |
| `GEN_SALT` | No | Salt rounds for hashing passwords | `10` |
| `EXPIRES_IN` | No | Access token expiration duration | `90d` |
| `BCRYPT_SALT_ROUNDS` | No | Additional bcrypt rounds for hashing | `12` |
| `REFRESH_TOKEN_PEPPER` | No | Pepper string for refresh token hashing | `custom-pepper-key` |

---

## 📡 API Endpoints Reference

All routes are prefixed with `/api/v1`.

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new student account |
| `POST` | `/api/v1/auth/login` | Public | Log in with email and password |
| `GET` | `/api/v1/auth/profile` | Authenticated | Retrieve authenticated user profile |

#### Request Examples:

**Register Student:**
```json
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

**Login:**
```json
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

**Successful Login Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "id": "uuid-here",
    "role": "Student",
    "fullName": "Jane Doe"
  }
}
```

---

### 2. Submissions (`/api/v1/submission`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/submission` | `Student` | Submit a new project |
| `GET` | `/api/v1/submission/mine` | `Student` | Get paginated list of student's own submissions |
| `GET` | `/api/v1/submission/all` | `Mentor` | Get paginated list of all student submissions |
| `PATCH` | `/api/v1/submission/update-status` | `Mentor` | Approve or reject a submission |

#### Request Examples:

**Create Submission (Student):**
```json
POST /api/v1/submission
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "projectName": "E-Commerce Microservices",
  "repositoryUrl": "https://github.com/janedoe/ecommerce-backend",
  "liveUrl": "https://ecommerce-demo.vercel.app",
  "description": "A comprehensive microservices platform with payment processing and inventory tracking."
}
```

**Query Submissions (Search & Filter):**
```http
GET /api/v1/submission/all?search=ecommerce&status=Pending&page=1&limit=10
Authorization: Bearer <mentorAccessToken>
```

**Approve Submission (Mentor):**
```json
PATCH /api/v1/submission/update-status
Authorization: Bearer <mentorAccessToken>
Content-Type: application/json

{
  "submissionId": "f7b11c92-38b4-4b5f-9721-a5dc406987f2",
  "isApproved": true
}
```

**Reject Submission (Mentor - Requires `rejectReason`):**
```json
PATCH /api/v1/submission/update-status
Authorization: Bearer <mentorAccessToken>
Content-Type: application/json

{
  "submissionId": "f7b11c92-38b4-4b5f-9721-a5dc406987f2",
  "isApproved": false,
  "rejectReason": "Missing unit test coverage and the live demo URL returns 404."
}
```

---

## 🗄️ Database Schema Summary

The database uses PostgreSQL managed by Prisma:

- **`User`**:
  - `id` (UUID, Primary Key)
  - `fullName` (String)
  - `email` (String, Unique)
  - `password` (Hashed String)
  - `role` (`Student` | `Mentor`, defaults to `Student`)
  - `createdAt`, `updatedAt`
- **`Submission`**:
  - `id` (UUID, Primary Key)
  - `projectName` (VarChar 50)
  - `repositoryUrl` (VarChar 100)
  - `normalizedRepo` (VarChar 100, sanitized lowercase URL for duplicate detection)
  - `liveUrl` (VarChar 100)
  - `description` (VarChar 1000)
  - `status` (`Pending` | `Approved` | `Rejected`, defaults to `Pending`)
  - `studentId` (Foreign Key to `User`)
  - `reviewedAt` (Nullable DateTime)
  - `rejectionReason` (Nullable VarChar 1000)
  - Unique compound indexes: `[studentId, projectName]` and `[studentId, normalizedRepo]`

---

## 🔧 Troubleshooting

### 1. `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`
- **Cause:** On Windows, a running Node process or dev server is locking the Prisma binary DLL during `npm install` or `prisma generate`.
- **Solution:**
  1. Stop any running dev servers (`Ctrl + C`).
  2. Kill any orphan node processes in PowerShell:
     ```powershell
     taskkill /F /IM node.exe
     ```
  3. Re-run:
     ```bash
     npx prisma generate
     ```

### 2. Database Connection Errors
- Ensure PostgreSQL is running on the host and port defined in `DATABASE_URL`.
- Verify credentials and make sure the database (`project_submission` or your target DB) has been created.
- Check firewall and network permissions if using a remote hosted database.

---

## 📜 License

This project is licensed under the ISC License.
