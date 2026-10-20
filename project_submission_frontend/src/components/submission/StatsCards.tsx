"use client";

import { SubmissionPaginationMeta, SubmissionStatus } from "@/types";
import { FolderGit2, Clock, CheckCircle2, XCircle } from "lucide-react";

interface StatsCardsProps {
  meta?: SubmissionPaginationMeta;
  activeStatus?: SubmissionStatus | "ALL";
  onStatusSelect: (status: SubmissionStatus | "ALL") => void;
}

export default function StatsCards({
  meta,
  activeStatus = "ALL",
  onStatusSelect,
}: StatsCardsProps) {
  const total = meta?.total ?? 0;
  const pending = meta?.totalPending ?? 0;
  const approved = meta?.totalApproved ?? 0;
  const rejected = meta?.totalRejected ?? 0;

  const cards = [
    {
      label: "Total Submissions",
      count: total,
      status: "ALL" as const,
      icon: FolderGit2,
      textColor: "text-slate-900",
      bgColor: "bg-slate-50",
      activeRing: "ring-2 ring-primary border-primary",
      borderColor: "border-slate-200",
      iconColor: "text-slate-600",
    },
    {
      label: "Pending Review",
      count: pending,
      status: "Pending" as const,
      icon: Clock,
      textColor: "text-amber-800",
      bgColor: "bg-amber-50/60",
      activeRing: "ring-2 ring-amber-500 border-amber-500",
      borderColor: "border-amber-200/80",
      iconColor: "text-amber-600",
    },
    {
      label: "Approved",
      count: approved,
      status: "Approved" as const,
      icon: CheckCircle2,
      textColor: "text-emerald-800",
      bgColor: "bg-emerald-50/60",
      activeRing: "ring-2 ring-emerald-500 border-emerald-500",
      borderColor: "border-emerald-200/80",
      iconColor: "text-emerald-600",
    },
    {
      label: "Rejected",
      count: rejected,
      status: "Rejected" as const,
      icon: XCircle,
      textColor: "text-rose-800",
      bgColor: "bg-rose-50/60",
      activeRing: "ring-2 ring-rose-500 border-rose-500",
      borderColor: "border-rose-200/80",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatus === card.status;

        return (
          <button
            key={card.label}
            type="button"
            onClick={() => onStatusSelect(card.status)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 bg-white hover:shadow-sm ${
              isActive
                ? card.activeRing
                : `${card.borderColor} hover:border-slate-300`
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold tracking-tight ${card.textColor}`}>
                {card.count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
