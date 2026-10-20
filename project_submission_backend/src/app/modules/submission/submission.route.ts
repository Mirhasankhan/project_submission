import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { submissionController } from "./submission.controller";
import { submissionValidation } from "./submission.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

//submit new project
router.post(
  "/",
  auth(UserRole.Student),
  validateRequest(submissionValidation.submissionSchema),
  submissionController.submitNewProject,
);

router.get(
  "/all",
  auth(UserRole.Mentor),
  validateRequest(submissionValidation.submissionQuerySchema),
  submissionController.getAllSubmissions,
);

router.get(
  "/mine",
  auth(UserRole.Student),
  validateRequest(submissionValidation.submissionQuerySchema),
  submissionController.getStudentWiseSubmissions,
);

router.patch(
  "/update-status",
  auth(UserRole.Mentor),
  validateRequest(submissionValidation.approveRejectSchema),
  submissionController.approveRejectSubmission,
);



export const submissionRoute = router;
