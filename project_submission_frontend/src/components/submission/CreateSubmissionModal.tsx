"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubmitProjectMutation } from "@/redux/features/submission/submissionApi";
import { CreateSubmissionPayload } from "@/types";
import { toast } from "react-toastify";
import { Plus, FolderPlus, Github, Globe, FileText } from "lucide-react";

export default function CreateSubmissionModal() {
  const [open, setOpen] = useState(false);
  const [submitProject, { isLoading }] = useSubmitProjectMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSubmissionPayload>();

  const onSubmit: SubmitHandler<CreateSubmissionPayload> = async (formData) => {
    try {
      const response = await submitProject(formData).unwrap();
      toast.success(response.message || "Project submitted successfully!");
      reset();
      setOpen(false);
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.data?.message || err?.error || "Failed to submit project.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-medium">
          <Plus className="w-4 h-4" />
          <span>New Submission</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <FolderPlus className="w-5 h-5" />
            <DialogTitle className="text-xl">Submit New Project</DialogTitle>
          </div>
          <DialogDescription>
            Provide your project details, GitHub repository link, and live deployment URL.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div>
            <label className="label-design">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register("projectName", {
                required: "Project name is required",
                maxLength: {
                  value: 50,
                  message: "Project name cannot exceed 50 characters",
                },
              })}
              className="input-design"
              placeholder="e.g. E-Commerce Platform"
            />
            {errors.projectName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div>
            <label className="label-design flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Repository URL</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              {...register("repositoryUrl", {
                required: "Repository URL is required",
                maxLength: {
                  value: 100,
                  message: "Repository URL cannot exceed 100 characters",
                },
                validate: (value) => {
                  try {
                    const parsed = new URL(value);
                    const isGitHub =
                      parsed.protocol === "https:" &&
                      parsed.hostname === "github.com" &&
                      parsed.pathname.split("/").filter(Boolean).length >= 2;
                    return (
                      isGitHub ||
                      "Must be a valid GitHub repo link (e.g. https://github.com/user/repo)"
                    );
                  } catch {
                    return "Please enter a valid URL";
                  }
                },
              })}
              className="input-design"
              placeholder="https://github.com/username/repository"
            />
            {errors.repositoryUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.repositoryUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="label-design flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Live Deployment URL</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              {...register("liveUrl", {
                required: "Live URL is required",
                maxLength: {
                  value: 100,
                  message: "Live URL cannot exceed 100 characters",
                },
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: "Must be a valid URL starting with http:// or https://",
                },
              })}
              className="input-design"
              placeholder="https://your-project.vercel.app"
            />
            {errors.liveUrl && (
              <p className="text-red-500 text-xs mt-1">
                {errors.liveUrl.message}
              </p>
            )}
          </div>

          <div>
            <label className="label-design flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Project Description</span>
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              {...register("description", {
                required: "Project description is required",
                maxLength: {
                  value: 1000,
                  message: "Description cannot exceed 1000 characters",
                },
              })}
              className="input-design resize-y min-h-[90px]"
              placeholder="Brief overview of features, tech stack used, and key accomplishments..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 inline"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Project</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
