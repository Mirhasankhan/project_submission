"use client";

import { useState } from "react";
import { useGetAllSubmissionsQuery } from "@/redux/features/submission/submissionApi";
import { SubmissionItem, SubmissionStatus } from "@/types";
import StatsCards from "./StatsCards";
import ApproveRejectModal from "./ApproveRejectModal";
import CustomPagination from "@/components/shared/CustomPagination";
import SubmissionCard from "./SubmissionCard";
import {
  Search,
  Inbox,
  Filter,
} from "lucide-react";

export default function MentorDashboard() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "ALL">(
    "ALL",
  );
  const [page, setPage] = useState(1);
  const limit = 6;

  // Selected submission for review modal
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionItem | null>(null);
  const [reviewMode, setReviewMode] = useState<"approve" | "reject" | null>(
    null,
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

  const {
    data: response,
    isLoading,  
  } = useGetAllSubmissionsQuery(queryParams);

 
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Mentor Review Dashboard
            </h1>         
         
          <p className="text-sm text-slate-500">
            Review student submissions, evaluate code repositories, and provide
            constructive feedback.
          </p>
        </div>
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
          <label htmlFor="mentor-submission-status" className="sr-only">
            Filter submissions by status
          </label>
          <select
            id="mentor-submission-status"
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
        {isLoading? (
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
                ? "No student submissions matched your search or filter."
                : "No student submissions have been made yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                role="mentor"
                onApprove={openApprove}
                onReject={openReject}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPage > 1 && (
        <div className="flex justify-end ">
          <CustomPagination
            page={page}
            setPage={setPage}
            totalPage={meta.totalPage}
          />
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
