"use client";

import { useState } from "react";
import { useGetAllSubmissionsQuery } from "@/redux/features/submission/submissionApi";
import { SubmissionItem, SubmissionStatus } from "@/types";
import StatsCards from "./StatsCards";
import ApproveRejectModal from "./ApproveRejectModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Github,
  ExternalLink, 
  AlertCircle,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  User, 
} from "lucide-react";
import dayjs from "dayjs";

export default function MentorDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "ALL">(
    "ALL"
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  // Selected submission for review modal
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionItem | null>(null);
  const [reviewMode, setReviewMode] = useState<"approve" | "reject" | null>(
    null
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    const handler = setTimeout(() => {
      setDebouncedSearch(value);
    }, 350);
    return () => clearTimeout(handler);
  };

  const queryParams = {
    search: debouncedSearch.trim() || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    page,
    limit,
  };

  const { data: response, isLoading, isFetching } =
    useGetAllSubmissionsQuery(queryParams);

  const submissionData = response?.result || response?.data;
  const submissions: SubmissionItem[] = submissionData?.submissions || [];
  const meta = submissionData?.meta;

  const handleStatusSelect = (status: SubmissionStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1);
  };

  const openApprove = (submission: SubmissionItem) => {
    setSelectedSubmission(submission);
    setReviewMode("approve");
  };

  const openReject = (submission: SubmissionItem) => {
    setSelectedSubmission(submission);
    setReviewMode("reject");
  };

  const closeReviewModal = () => {
    setSelectedSubmission(null);
    setReviewMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Title & Role Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Mentor Review Dashboard
            </h1>
            <Badge variant="secondary" className="text-xs">
              Mentor View
            </Badge>
          </div>
          <p className="text-sm text-slate-500">
            Review student submissions, evaluate code repositories, and provide constructive feedback.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards
        meta={meta}
        activeStatus={statusFilter}
        onStatusSelect={handleStatusSelect}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input using .input-design */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by project name or description..."
            className="input-design pl-9"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:inline" />
          {(["ALL", "Pending", "Approved", "Rejected"] as const).map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusSelect(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-primary text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status === "ALL" ? "All Submissions" : status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {isLoading || isFetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-pulse space-y-3"
              >
                <div className="h-5 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              No submissions found
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              {debouncedSearch || statusFilter !== "ALL"
                ? "No student submissions matched your search or filter."
                : "No student submissions have been made yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => {
              const statusVariant =
                submission.status === "Approved"
                  ? "approved"
                  : submission.status === "Rejected"
                  ? "rejected"
                  : "pending";

              return (
                <div
                  key={submission.id}
                  className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 shadow-sm hover:shadow transition-shadow space-y-4"
                >
                  {/* Top Bar: Student info & Submission status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {submission.projectName}
                      </h3>
                      <Badge variant={statusVariant}>{submission.status}</Badge>
                    </div>

                    {/* Student Identity Pill */}
                    {submission.student && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{submission.student.fullName}</span>
                        <span className="text-slate-400">
                          ({submission.student.email})
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {submission.description}
                  </p>

                  {/* Rejection Reason Display if Rejected */}
                  {submission.status === "Rejected" &&
                    submission.rejectionReason && (
                      <div className="bg-rose-50 border border-rose-200/80 rounded-lg p-3.5 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-rose-800">
                          <p className="font-semibold text-rose-900">
                            Rejection Feedback Provided:
                          </p>
                          <p className="mt-0.5 whitespace-pre-line">
                            {submission.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Footer Bar: Repos, Live links, and Mentor Review Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <a
                        href={submission.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-primary transition-colors bg-slate-100/80 px-2.5 py-1.5 rounded-md"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code Repository</span>
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

                      <span className="text-slate-400 hidden sm:inline ml-2">
                        Submitted:{" "}
                        {dayjs(submission.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>

                    {/* Pending Review Actions */}
                    {submission.status === "Pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => openApprove(submission)}
                          className="gap-1.5 text-xs font-semibold"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => openReject(submission)}
                          className="gap-1.5 text-xs font-semibold"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </Button>
                      </div>
                    ) : (
                      submission.reviewedAt && (
                        <span className="text-slate-400">
                          Reviewed:{" "}
                          {dayjs(submission.reviewedAt).format("MMM D, YYYY")}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPage > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 bg-white px-4 py-3 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-semibold">{meta.page}</span> of{" "}
            <span className="font-semibold">{meta.totalPage}</span> (
            {meta.total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="gap-1 text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPage}
              onClick={() => setPage((prev) => prev + 1)}
              className="gap-1 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Review Modal for Approval or Rejection with mandatory reason */}
      <ApproveRejectModal
        submission={selectedSubmission}
        mode={reviewMode}
        onClose={closeReviewModal}
      />
    </div>
  );
}
