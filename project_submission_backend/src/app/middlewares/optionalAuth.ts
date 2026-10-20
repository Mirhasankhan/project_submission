import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import httpStatus from "http-status";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import ApiError from "../../errors/ApiErrors";
import prisma from "../../shared/prisma";

const optionalAuth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const token = req.headers.authorization;

      // No token = continue as guest
      if (!token) {
        return next();
      }

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as Secret,
      );

      // Check role if roles are provided
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "Forbidden! You are not authorized",
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: verifiedUser.id },
        select: {
          id: true,
          role: true,         
        },
      });

      if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
      }

     

      req.user = verifiedUser;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default optionalAuth;