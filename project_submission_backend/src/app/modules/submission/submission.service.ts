import { SubmissionStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../../helpers/queryBuilder";
import {
  ApproveRejectPayload,
  SubmissionPayload,
  SubmissionQuery,
} from "./submission.interface";

const submitNewProject = async (
  studentId: string,
  payload: SubmissionPayload,
) => {
  const normalizedRepo = payload.repositoryUrl
    .trim()
    .replace(/\/+$/, "")
    .replace(/\.git$/i, "")
    .toLowerCase();

  const existingSubmission = await prisma.submission.findFirst({
    where: {
      studentId,
      OR: [{ projectName: payload.projectName.trim() }, { normalizedRepo }],
    },
    select: {
      id: true,
    },
  });

  if (existingSubmission) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "A submission with this project name or repository already exists",
    );
  }

  await prisma.submission.create({
    data: {
      projectName: payload.projectName.trim(),
      description: payload.description,
      studentId,
      liveUrl: payload.liveUrl,
      repositoryUrl: payload.repositoryUrl,
      normalizedRepo,
    },
  });

  return {
    message: "Project submitted successfully",
  };
};

const getAllSubmissions = async (query?: SubmissionQuery) => {
  const queryBuilder = new QueryBuilder(prisma.submission, query);

  const response = queryBuilder
    .search(["projectName", "description"])
    .filter({
      exacts: ["status"],
    })
    .sortBy({ createdAt: "desc" })
    .paginate()
    .include({
      student: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    })
    .omit({
      updatedAt: true,
      normalizedRepo: true,
      studentId: true,
    });

  const [submissions, pagination, totalPending, totalApproved, totalRejected] =
    await Promise.all([
      response.execute(),
      response.countTotal(),
      prisma.submission.count({ where: { status: "Pending" } }),
      prisma.submission.count({ where: { status: "Approved" } }),
      prisma.submission.count({ where: { status: "Rejected" } }),
    ]);

  return {
    message: "Submissions retrieved successfully",
    data: {
      submissions,
      meta: {
        ...pagination,
        totalPending,
        totalApproved,
        totalRejected,
      },
    },
  };
};

const getStudentWiseSubmissions = async (
  studentId: string,
  query?: SubmissionQuery,
) => {
  const queryBuilder = new QueryBuilder(prisma.submission, query);

  const response = queryBuilder
    .search(["projectName", "description"])
    .filter({
      exacts: ["status"],
    })
    .rawFilter({
      studentId,
    })
    .sortBy({ createdAt: "desc" })
    .paginate()
    .omit({
      updatedAt: true,
      normalizedRepo: true,
      studentId: true,
    });

  const [submissions, pagination, totalPending, totalApproved, totalRejected] =
    await Promise.all([
      response.execute(),
      response.countTotal(),
      prisma.submission.count({ where: { status: "Pending", studentId } }),
      prisma.submission.count({ where: { status: "Approved", studentId } }),
      prisma.submission.count({ where: { status: "Rejected", studentId } }),
    ]);

  return {
    message: "My Submissions retrieved successfully",
    data: {
      submissions,
      meta: {
        ...pagination,
        totalPending,
        totalApproved,
        totalRejected,
      },
    },
  };
};

const approveRejectSubmission = async (payload: ApproveRejectPayload) => {
  const { submissionId, isApproved, rejectReason } = payload;

  if (!isApproved && !rejectReason) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Reject reason is required when rejecting a submission",
    );
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId, status: SubmissionStatus.Pending },
  });

  if (!submission) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Submission not found or already processed",
    );
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: isApproved
        ? SubmissionStatus.Approved
        : SubmissionStatus.Rejected,
      reviewedAt: new Date(),
      rejectionReason: isApproved ? null : rejectReason,
    },
  });

  return {
    message:
      "Submission has been " +
      (isApproved ? "approved" : "rejected") +
      " successfully",
  };
};

export const submissionService = {
  submitNewProject,
  getAllSubmissions,
  getStudentWiseSubmissions,
  approveRejectSubmission,
};
