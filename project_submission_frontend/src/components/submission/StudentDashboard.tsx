"use client";

import { useState } from "react";
import { useGetMySubmissionsQuery } from "@/redux/features/submission/submissionApi";
import { SubmissionItem, SubmissionStatus } from "@/types";
import CreateSubmissionModal from "./CreateSubmissionModal";
import StatsCards from "./StatsCards";
import { Badge } from "@/components/ui/badge";
import CustomPagination from "@/components/shared/CustomPagination";
import {
  Search,
  Github,
  ExternalLink,
  Calendar,
  AlertCircle,
  Inbox,
  Filter,
} from "lucide-react";
import dayjs from "dayjs";

export default function StudentDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  // Search input change with debounce timer
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
    // Simple debounce
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

  const {
    data: response,
    isLoading,   
  } = useGetMySubmissionsQuery(queryParams);

  const submissionData = response?.result || response?.data;
  const submissions: SubmissionItem[] = submissionData?.submissions || [];
  const meta = submissionData?.meta;

  const handleStatusSelect = (status: SubmissionStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Title & Submit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Submissions
          </h1>
          <p className="text-sm text-slate-500">
            Submit assignments, view review statuses, and track feedback.
          </p>
        </div>
        <CreateSubmissionModal />
      </div>

      {/* Stats Overview */}
      <StatsCards meta={meta} />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input using .input-design */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by project name or description..."
            className="input-design !pl-10"
          />
        </div>

        {/* Status Filter Select */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <label htmlFor="submission-status" className="sr-only">
            Filter submissions by status
          </label>
          <select
            id="submission-status"
            value={statusFilter}
            onChange={(event) =>
              handleStatusSelect(event.target.value as SubmissionStatus | "ALL")
            }
            className="input-design min-w-[170px] py-2 text-sm"
          >
            <option value="ALL">All Submissions</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
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
                ? "No submissions matched your search or status filter. Try clearing the filters."
                : "You have not submitted any projects yet. Click 'New Submission' to submit your first milestone!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        {submission.projectName}
                      </h3>
                      <Badge variant={statusVariant}>{submission.status}</Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        Submitted on{" "}
                        {dayjs(submission.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {submission.description}
                  </p>

                  {/* Rejection Feedback Banner */}
                  {submission.status === "Rejected" &&
                    submission.rejectionReason && (
                      <div className="bg-rose-50 border border-rose-200/80 rounded-lg p-3.5 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-rose-800">
                          <p className="font-semibold text-rose-900">
                            Rejection Feedback:
                          </p>
                          <p className="mt-0.5 whitespace-pre-line">
                            {submission.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}

                  {/* Links & Meta Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <a
                        href={submission.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-primary transition-colors bg-slate-100/80 px-2.5 py-1.5 rounded-md"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository</span>
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
                    </div>

                    {submission.reviewedAt && (
                      <span className="text-slate-400">
                        Reviewed on{" "}
                        {dayjs(submission.reviewedAt).format("MMM D, YYYY")}
                      </span>
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
        <div className="flex justify-end">
          <CustomPagination
            page={page}
            setPage={setPage}
            totalPage={meta.totalPage}
          />
        </div>
      )}
    </div>
  );
}
