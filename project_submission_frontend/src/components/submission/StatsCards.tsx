"use client";

import { SubmissionPaginationMeta } from "@/types";
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  Ellipsis,
} from "lucide-react";

interface StatsCardsProps {
  meta?: SubmissionPaginationMeta;
  isLoading?: boolean;
}

const StatsCards = ({ meta, isLoading }: StatsCardsProps) => {
  const total = meta?.totalCount ?? 0;
  const pending = meta?.totalPending ?? 0;
  const approved = meta?.totalApproved ?? 0;
  const rejected = meta?.totalRejected ?? 0;

  const cards = [
    {
      label: "Total Submissions",
      count: total,
      icon: FolderGit2,
    },
    {
      label: "Pending Review",
      count: pending,
      icon: Clock,
    },
    {
      label: "Approved",
      count: approved,
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      count: rejected,
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`text-left p-4 rounded-xl border border-slate-200 bg-white transition-shadow duration-200 hover:shadow-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 truncate">
                {isLoading ? (
                  <Ellipsis className="w-4 h-4 animate-pulse text-slate-300" />
                ) : (
                  <>{card.label}</>
                )}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-50`}>
                <Icon className={`w-4 h-4 text-slate-600`} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-bold tracking-tight text-slate-900`}
              >
                {isLoading ? (
                  <Ellipsis className="w-4 h-4 animate-pulse text-slate-300" />
                ) : (
                  <>{card.count}</>
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default StatsCards;
