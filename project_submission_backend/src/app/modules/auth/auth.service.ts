import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { ILoginPayload, IRegisterPayload } from "./auth.interface";

const registerStudentIntoDB = async (payload: IRegisterPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists, please login instead");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const newUser = await prisma.user.create({
    data: {
      email: payload.email,
      fullName: payload.fullName,
      password: hashedPassword,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    message: "Registered successfully",
    data: {
      accessToken,
      id: newUser.id,
      role: newUser.role,
      fullName: newUser.fullName,
    },
  };
};

//login user
const loginUserIntoDB = async (payload: ILoginPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(403, "Invalid credentials");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    message: "Logged in successfully",
    data: {
      accessToken,
      id: user.id,
      role: user.role,
      fullName: user.fullName,
    },
  };
};

const getProfileFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return {
    message: "Profile fetched successfully",
    data: user,
  };
};

export const authService = {
  registerStudentIntoDB,
  loginUserIntoDB,
  getProfileFromDB,
};
