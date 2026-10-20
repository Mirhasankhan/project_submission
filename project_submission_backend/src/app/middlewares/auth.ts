
import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config";
import ApiError from "../../errors/ApiErrors";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import prisma from "../../shared/prisma";

const auth = (...roles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const match = authHeader?.match(/^Bearer\s+(\S+)$/i);
      const token = match?.[1];

      if (!token) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Authentication required",
        );
      }

      const payload: unknown = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret,
      );

      if (
        typeof payload !== "object" ||
        payload === null ||
        !("id" in payload) ||
        typeof payload.id !== "string" ||
        !payload.id
      ) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Invalid authentication token",
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: payload.id },
        select: {
          id: true,
          role: true,
        },
      });

      if (!existingUser) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Invalid authentication credentials",
        );
      }

      if (roles.length && !roles.includes(existingUser.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this resource",
        );
      }

      req.user = {
        id: existingUser.id,
        role: existingUser.role,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
