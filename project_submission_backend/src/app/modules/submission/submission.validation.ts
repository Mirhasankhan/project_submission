import { z } from "zod";

const submissionSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(50, "Project name must not exceed 50 characters"),
  repositoryUrl: z
    .string()
    .trim()
    .url("Please provide a valid repository URL")
    .max(100, "Repository URL must not exceed 100 characters")
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);

        return (
          parsedUrl.protocol === "https:" &&
          parsedUrl.hostname === "github.com" &&
          parsedUrl.pathname.split("/").filter(Boolean).length >= 2
        );
      } catch {
        return false;
      }
    }, "Please provide a valid GitHub repository URL"),

  liveUrl: z
    .string()
    .trim()
    .url("Please provide a valid live URL")
    .max(100, "Live URL must not exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Project description is required")
    .max(1000, "Description must not exceed 1000 characters"),
});

const submissionQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const approveRejectSchema = z.object({
  submissionId: z.string().uuid("Invalid submission ID"),
  isApproved: z.boolean(),
  rejectReason: z.string().optional(),
});

export const submissionValidation = {
  submissionSchema,
  submissionQuerySchema,
  approveRejectSchema,
};
