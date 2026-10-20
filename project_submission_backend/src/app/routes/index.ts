import express from "express";
import { authRoute } from "../modules/auth/auth.routes";
import { submissionRoute } from "../modules/submission/submission.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/submission",
    route: submissionRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
