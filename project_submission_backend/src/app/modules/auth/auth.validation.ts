import { z } from "zod";

const registrationSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});

export const authValidation = {
  registrationSchema,
  loginSchema,
};
