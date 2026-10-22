import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { submissionService } from "./submission.service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { submissionValidation } from "./submission.validation";

const submitNewProject = catchAsync(async (req: Request, res: Response) => {
  const result = await submissionService.submitNewProject(
    req.user.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
  });
});

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const query = submissionValidation.submissionQuerySchema.parse(req.query);
  const result = await submissionService.getAllSubmissions(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.data,
  });
});

const getStudentWiseSubmissions = catchAsync(
  async (req: Request, res: Response) => {
    const query = submissionValidation.submissionQuerySchema.parse(req.query);
    const result = await submissionService.getStudentWiseSubmissions(
      req.user.id,
      query,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result.data,
    });
  },
);

const approveRejectSubmission = catchAsync(
  async (req: Request, res: Response) => {
    const result = await submissionService.approveRejectSubmission(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
    });
  },
);



export const submissionController = {
  submitNewProject,
  getAllSubmissions,
  getStudentWiseSubmissions,
  approveRejectSubmission,

};
