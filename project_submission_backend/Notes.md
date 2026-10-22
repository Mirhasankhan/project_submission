# Frontend Form Field Specs & Backend Integration Notes

This document specifies the form field requirements, validation rules, backend data consumption, and business constraints for all user-facing forms in the **Project Submission Portal**. System-managed fields (`id`, `createdAt`, `updatedAt`, `normalizedRepo`, `studentId`) are automatically handled by the backend.

---

## 1. Student Registration Form

- **Endpoint:** `POST /api/v1/auth/register`
- **Access:** Public
- **Rate Limit:** 3 requests per 1-minute window
- **Target Role:** Registers users with role `Student`

| Field | Type | Required | Input / Widget | Validation & Notes |
|---|---|---|---|---|
| `fullName` | string | **Yes** | Text input | Minimum 1 character. Trims whitespace. |
| `email` | string | **Yes** | Email input | Must be a valid email format. Backend checks uniqueness (returns `409 Conflict: User already exists, please login instead`). |
| `password` | string | **Yes** | Password input | Minimum 6 characters. Hashed server-side with `bcrypt` (10 rounds). |

**Backend Response Payload:**
```json
{
  "statusCode": 201,
  "success": true,
  "message": "Registered successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "id": "uuid-v4-string",
    "role": "Student",
    "fullName": "Student Name"
  }
}
```

---

## 2. User Login Form

- **Endpoint:** `POST /api/v1/auth/login`
- **Access:** Public
- **Rate Limit:** 3 requests per 1-minute window
- **Target Roles:** Both `Student` and `Mentor`

| Field | Type | Required | Input / Widget | Validation & Notes |
|---|---|---|---|---|
| `email` | string | **Yes** | Email input | Valid email format. Backend returns `404 Not Found: Invalid credentials` if user does not exist. |
| `password` | string | **Yes** | Password input | Backend returns `403 Forbidden: Invalid credentials` if password does not match bcrypt hash. |

**Backend Response Payload:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "id": "uuid-v4-string",
    "role": "Student | Mentor",
    "fullName": "User Name"
  }
}
```

---

## 3. Project Submission Form

- **Endpoint:** `POST /api/v1/submission`
- **Access:** `Student` role required (`Authorization: Bearer <accessToken>`)
- **Rate Limit:** 3 requests per 1-minute window

| Field | Type | Required | Input / Widget | Validation & Notes |
|---|---|---|---|---|
| `projectName` | string | **Yes** | Text input | 1 to 50 characters. Must be unique per student (returns `409 Conflict` if the student already submitted a project with this name). |
| `repositoryUrl` | string | **Yes** | URL input | Valid GitHub URL (e.g., `https://github.com/owner/repo`). Max 100 characters. Backend normalizes this URL and enforces uniqueness per student. |
| `liveUrl` | string | **Yes** | URL input | Valid URL starting with `http://` or `https://`. Max 100 characters. |
| `description` | string | **Yes** | Textarea | 1 to 1000 characters. Project summary, architecture, and technology stack. |

### Backend Normalization & Duplicate Prevention Logic:
- **Repository Normalization:** The backend trims trailing slashes, strips `.git` suffixes (case-insensitive), and converts the repository URL to lowercase (`normalizedRepo`).
- **Uniqueness Check:** The backend executes a compound query:
  ```typescript
  prisma.submission.findFirst({
    where: {
      studentId,
      OR: [{ projectName: payload.projectName.trim() }, { normalizedRepo }],
    },
  });
  ```
- **Rejection on Duplicate:** If a match is found, backend returns:
  `409 Conflict: A submission with this project name or repository already exists`.
- **Default Status:** New submissions automatically start in status `Pending`.

---

## 4. Mentor Review Form (Approve / Reject Modal)

- **Endpoint:** `PATCH /api/v1/submission/update-status`
- **Access:** `Mentor` role required (`Authorization: Bearer <accessToken>`)
- **Rate Limit:** 3 requests per 1-minute window

| Field | Type | Required | Input / Widget | Validation & Notes |
|---|---|---|---|---|
| `submissionId` | string (UUID) | **Yes** | Hidden input / parameter | Must be a valid UUID. The submission must currently be in `Pending` status. |
| `isApproved` | boolean | **Yes** | Action button toggle | `true` for approval, `false` for rejection. |
| `rejectReason` | string | **Conditional** | Textarea | **Required when `isApproved` is `false`**. Optional when `isApproved` is `true`. Stored as `rejectionReason` in the database. |

### Business Rules & Constraints:
1. **Mandatory Reason on Rejection:** If `isApproved === false` and `rejectReason` is missing or empty, the backend returns:
   `400 Bad Request: Reject reason is required when rejecting a submission`.
2. **One-Time Review Protection:** The backend only permits updating submissions where `status === "Pending"`. If already processed, it returns:
   `404 Not Found: Submission not found or already processed`.
3. **Timestamping:** Setting approval or rejection updates `reviewedAt = new Date()`.
4. **Reason Cleanup:** Approving a submission sets `rejectionReason = null`.

---

## 5. Submission Query, Filter & Pagination Specs

- **Student Endpoint:** `GET /api/v1/submission/mine`
- **Mentor Endpoint:** `GET /api/v1/submission/all`
- **Access:** Student token for `/mine`, Mentor token for `/all`

### Query Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `search` | string | No | `undefined` | Case-insensitive search matching against `projectName` or `description`. |
| `status` | enum | No | `undefined` | Filter by exact status: `Pending`, `Approved`, or `Rejected`. |
| `page` | number | No | `1` | Page number (integer $\ge 1$). |
| `limit` | number | No | `10` | Items per page (integer between `1` and `100`). |

### Response Schema & Aggregated Metrics

Both endpoints return data wrapped in the standard response envelope:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Submissions retrieved successfully",
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "projectName": "E-Commerce App",
        "repositoryUrl": "https://github.com/user/ecommerce",
        "liveUrl": "https://ecommerce.vercel.app",
        "description": "Full-stack store built with Next.js and Prisma.",
        "status": "Pending",
        "reviewedAt": null,
        "rejectionReason": null,
        "createdAt": "2026-10-22T04:20:00.000Z",
        "student": {
          "id": "uuid",
          "fullName": "Student Name",
          "email": "student@example.com"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalCount": 24,
      "totalPage": 3,
      "totalPending": 12,
      "totalApproved": 9,
      "totalRejected": 3
    }
  }
}
```

> **Note:**
> - `student` object is populated on mentor requests (`/submission/all`), omitted on student requests (`/submission/mine`).
> - The status counts (`totalPending`, `totalApproved`, `totalRejected`) in `meta` provide instant counters for dashboard stat cards without requiring additional requests.

---

## 6. Cross-Form & UI Dependencies

- **Role Routing:**
  - After login, inspect `data.role`.
  - `role === "Mentor"` -> Render `MentorDashboard` (`/api/v1/submission/all`).
  - `role === "Student"` -> Render `StudentDashboard` (`/api/v1/submission/mine`).
- **Debounced Search:**
  - The search input on both dashboards uses a 350ms debounce before dispatching the query to prevent redundant API calls.
- **Cache Invalidation:**
  - Submitting a project invalidates the `Submissions` tag in RTK Query, instantly refreshing `getMySubmissions`.
  - Approving or rejecting a project invalidates the `Submissions` tag, instantly updating `getAllSubmissions`.
- **Error Handling:**
  - Form validation errors are shown inline beneath each field using `errors.<fieldName>.message`.
  - Server errors (e.g., duplicate repo, 429 rate limit exceeded, 403 invalid credentials) are caught and displayed via toast notifications.