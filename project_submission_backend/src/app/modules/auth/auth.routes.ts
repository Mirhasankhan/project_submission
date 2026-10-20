import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

//register student
router.post(
  "/register",
  validateRequest(authValidation.registrationSchema),
  authController.registerStudent,
);

//login user
router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.loginUser,
);

//get profile
router.get(
  "/profile",
  auth(),
  authController.getProfile,
);



export const authRoute = router;
