import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import rateLimiter from "../../middlewares/rateLimiter";

const router = express.Router();

//register student
router.post(
  "/register",
  rateLimiter(1, 3),
  validateRequest(authValidation.registrationSchema),
  authController.registerStudent,
);

//login user
router.post(
  "/login",
  rateLimiter(1, 3),
  validateRequest(authValidation.loginSchema),
  authController.loginUser,
);

//get profile
router.get("/profile", auth(), authController.getProfile);

export const authRoute = router;
