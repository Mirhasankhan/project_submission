export type UserRole = "Student" | "Mentor";

export type SubmissionStatus = "Pending" | "Approved" | "Rejected";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthSuccessData {
  accessToken: string;
  id: string;
  role: UserRole;
  fullName: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface SubmissionStudent {
  id: string;
  fullName: string;
  email: string;
}

export interface SubmissionItem {
  id: string;
  projectName: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
  status: SubmissionStatus;
  studentId?: string;
  student?: SubmissionStudent;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
}

export interface SubmissionPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}

export interface SubmissionResponseData {
  submissions: SubmissionItem[];
  meta: SubmissionPaginationMeta;
}

export interface SubmissionQueryParams {
  search?: string;
  status?: SubmissionStatus;
  page?: number;
  limit?: number;
}

export interface CreateSubmissionPayload {
  projectName: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
}

export interface ApproveRejectPayload {
  submissionId: string;
  isApproved: boolean;
  rejectReason?: string;
}

export interface TLoginValues {
  email: string;
  password: string;
}

export interface TRegisterValues {
  fullName: string;
  email: string;
  password: string;
}
