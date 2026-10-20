"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApproveRejectSubmissionMutation } from "@/redux/features/submission/submissionApi";
import { SubmissionItem } from "@/types";
import { toast } from "react-toastify";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ApproveRejectModalProps {
  submission: SubmissionItem | null;
  mode: "approve" | "reject" | null;
  onClose: () => void;
}

export default function ApproveRejectModal({
  submission,
  mode,
  onClose,
}: ApproveRejectModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [approveRejectSubmission, { isLoading }] =
    useApproveRejectSubmissionMutation();

  if (!submission || !mode) return null;

  const isApprove = mode === "approve";

  const handleAction = async () => {
    if (!isApprove && !rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting this submission.");
      return;
    }

    try {
      const response = await approveRejectSubmission({
        submissionId: submission.id,
        isApproved: isApprove,
        rejectReason: isApprove ? undefined : rejectReason.trim(),
      }).unwrap();

      toast.success(
        response.message ||
          `Submission has been ${isApprove ? "approved" : "rejected"} successfully!`
      );
      setRejectReason("");
      onClose();
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.data?.message || err?.error || "Failed to update submission status.";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={Boolean(mode)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <DialogTitle className="text-xl">
              {isApprove ? "Approve Submission" : "Reject Submission"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isApprove
              ? `Are you sure you want to approve "${submission.projectName}" submitted by ${
                  submission.student?.fullName || "Student"
                }?`
              : `Specify the reasons why "${submission.projectName}" is being rejected so the student can rectify.`}
          </DialogDescription>
        </DialogHeader>

        {!isApprove && (
          <div className="space-y-2 py-2">
            <label className="label-design">
              Rejection Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="input-design resize-y min-h-[100px]"
              placeholder="Explain the required fixes, broken links, code quality issues, or missing criteria..."
            />
          </div>
        )}

        {isApprove && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Approving marks this milestone as successfully completed by the student.
            </span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={isApprove ? "success" : "destructive"}
            onClick={handleAction}
            disabled={isLoading}
            className="gap-2"
          >
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
                <span>Processing...</span>
              </>
            ) : isApprove ? (
              "Confirm Approval"
            ) : (
              "Confirm Rejection"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
