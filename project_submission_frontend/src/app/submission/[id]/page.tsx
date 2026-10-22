"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/utils/Container";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Github,
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import dayjs from "dayjs";
import { SubmissionItem } from "@/types";
import { useGetSubmissionQuery } from "@/redux/features/submission/submissionApi";

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading } = useGetSubmissionQuery(id);
  const submission: SubmissionItem | null =
    response?.result || response?.data || null;

  if (isLoading) {
    return null;
  }
  // If the submission is not found or not accessible
  if (!submission) {
    return (
      <main className="min-h-screen py-10 bg-slate-50/50">
        <Container>
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Submission Not Found
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              The project submission you are looking for doesn&apos;t exist or you don&apos;t have permission to review it.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const statusVariant =
    submission.status === "Approved"
      ? "approved"
      : submission.status === "Rejected"
        ? "rejected"
        : "pending";

  return (
    <main className="min-h-screen py-10 bg-slate-50/50">
      <Container>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back Navigation */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {submission.projectName}
                  </h1>
                  <Badge variant={statusVariant}>{submission.status}</Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Submitted on {dayjs(submission.createdAt).format("MMM D, YYYY [at] h:mm A")}
                    </span>
                  </div>

                  {submission.student && (
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{submission.student.fullName} ({submission.student.email})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Indicator Icon */}
              <div className="shrink-0">
                {submission.status === "Approved" && (
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
                {submission.status === "Rejected" && (
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <XCircle className="w-6 h-6" />
                  </div>
                )}
                {submission.status === "Pending" && (
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Project Description & Scope
              </h2>
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {submission.description}
              </div>
            </div>

            {/* Rejection / Feedback Alert */}
            {submission.status === "Rejected" && submission.rejectionReason && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800 space-y-1">
                  <p className="font-semibold text-rose-900 text-sm">
                    Mentor Feedback & Required Changes:
                  </p>
                  <p className="leading-relaxed whitespace-pre-line">
                    {submission.rejectionReason}
                  </p>
                </div>
              </div>
            )}

            {/* Submission Links */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-3">
                <a
                  href={submission.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-slate-700 hover:text-primary transition-colors bg-slate-100 px-3.5 py-2 rounded-lg"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href={submission.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-primary hover:bg-primary/20 transition-colors bg-primary/10 px-3.5 py-2 rounded-lg"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {submission.reviewedAt && (
                <span className="text-xs text-slate-400">
                  Reviewed on {dayjs(submission.reviewedAt).format("MMM D, YYYY")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
