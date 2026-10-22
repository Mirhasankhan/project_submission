"use client";

import { SubmissionItem } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Github,
  User,
  XCircle,
} from "lucide-react";
import dayjs from "dayjs";

interface SubmissionCardProps {
  submission: SubmissionItem;
  role: "student" | "mentor";
  onApprove?: (submission: SubmissionItem) => void;
  onReject?: (submission: SubmissionItem) => void;
}

export default function SubmissionCard({
  submission,
  role,
  onApprove,
  onReject,
}: SubmissionCardProps) {
  const isMentor = role === "mentor";
  const statusVariant =
    submission.status === "Approved"
      ? "approved"
      : submission.status === "Rejected"
        ? "rejected"
        : "pending";

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-sm hover:shadow transition-shadow space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            {submission.projectName}
          </h3>
          <Badge variant={statusVariant}>{submission.status}</Badge>
        </div>

        {isMentor && submission.student ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{submission.student.fullName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Submitted on {dayjs(submission.createdAt).format("MMM D, YYYY")}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
        {submission.description}
      </p>

      {submission.status === "Rejected" && submission.rejectionReason && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-lg p-3.5 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800">
            <p className="font-semibold text-rose-900">
              {isMentor
                ? "Rejection Feedback Provided:"
                : "Rejection Feedback:"}
            </p>
            <p className="mt-0.5 whitespace-pre-line">
              {submission.rejectionReason}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2.5">
          <a
            href={submission.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-primary transition-colors bg-slate-100/80 px-2.5 py-1.5 rounded-md"
          >
            <Github className="w-3.5 h-3.5" />
            <span>{isMentor ? "Code Repository" : "Repository"}</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={submission.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline bg-primary/10 px-2.5 py-1.5 rounded-md"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </a>
          <Link
            href={`/submission/${submission.id}`}
            className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-2.5 py-1.5 rounded-md"
          >
            <span>Review Page</span>
          </Link>
          {isMentor && (
            <span className="text-slate-400 hidden sm:inline ml-2">
              Submitted: {dayjs(submission.createdAt).format("MMM D, YYYY")}
            </span>
          )}
        </div>

        {isMentor && submission.status === "Pending" ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => onApprove?.(submission)}
              className="gap-1.5 text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onReject?.(submission)}
              className="gap-1.5 text-xs font-semibold"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </Button>
          </div>
        ) : submission.reviewedAt ? (
          <span className="text-slate-400">
            {isMentor ? "Reviewed: " : "Reviewed on "}
            {dayjs(submission.reviewedAt).format("MMM D, YYYY")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
