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

interface ApproveRejectModalProps {
  submission: SubmissionItem | null;
  mode: "approve" | "reject" | null;
  onClose: () => void;
}

const ApproveRejectModal = ({
  submission,
  mode,
  onClose,
}: ApproveRejectModalProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");
  const [approveRejectSubmission, { isLoading }] =
    useApproveRejectSubmissionMutation();

  if (!submission || !mode) return null;

  const isApprove = mode === "approve";

  const handleAction = async () => {
    if (!isApprove && !rejectReason.trim()) {
      setRejectReasonError("This field is required.");
      return;
    }

    setRejectReasonError("");

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
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (e.target.value.trim()) setRejectReasonError("");
              }}
              aria-invalid={Boolean(rejectReasonError)}
              aria-describedby={
                rejectReasonError ? "rejection-reason-error" : undefined
              }
              className={`input-design resize-y min-h-[100px] ${
                rejectReasonError ? "border-rose-500 focus:border-rose-500" : ""
              }`}
              placeholder="Explain the required fixes, broken links, code quality issues, or missing criteria..."
            />
            {rejectReasonError && (
              <p
                id="rejection-reason-error"
                className="text-xs pt-0 mt-0 text-rose-600"
              >
                {rejectReasonError}
              </p>
            )}
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

export default ApproveRejectModal;
