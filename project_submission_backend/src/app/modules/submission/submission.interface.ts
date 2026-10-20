import { SubmissionStatus } from "@prisma/client";
import exp from "constants";

export interface SubmissionPayload {
  projectName: string;
  description: string;
  liveUrl: string;
  repositoryUrl: string;
}

export interface ApproveRejectPayload {
  submissionId: string;
  isApproved: boolean;
  rejectReason?: string;
}

export interface SubmissionQuery {
  search?: string;
  status?: SubmissionStatus;
  page?: number;
  limit?: number;
};
