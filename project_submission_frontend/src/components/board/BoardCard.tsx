"use client";

import Image from "next/image";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dddrm7ep8/image/upload/v1781532954/y7gdxfkl9uznjt96cjea.png";

export type Role = "OWNER" | "EDITOR" | "VIEWER";

export type BoardMember = {
  user: {
    profileImage: string | null;
  };
};

export type Board = {
  id: string;
  title: string;
  description: string;
  members: BoardMember[];
};

const ROLE_CONFIG: Record<Role, { label: string; className: string }> = {
  OWNER: {
    label: "Owner",
    className: "bg-indigo-50 text-indigo-600",
  },
  EDITOR: {
    label: "Editor",
    className: "bg-emerald-50 text-emerald-600",
  },
  VIEWER: {
    label: "Viewer",
    className: "bg-gray-100 text-gray-600",
  },
};

const MAX_VISIBLE_AVATARS = 3;

export const BoardCard = ({
  role,
  board,
  onClick,
}: {
  role: Role;
  board: Board;
  onClick: () => void;
}) => {
  const roleConfig = ROLE_CONFIG[role];
  const members = board.members ?? [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_AVATARS);
  const extraCount = members.length - visibleMembers.length;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="relative flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <span
        className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-xs font-medium ${roleConfig.className}`}
      >
        {roleConfig.label}
      </span>

      <div className="pr-16">
        <h3 className="text-base font-semibold text-gray-900">
          {board.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {board.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
          {visibleMembers.map((m, idx) => (
            <Image
              key={idx}
              src={m.user?.profileImage || DEFAULT_AVATAR}
              alt="Member avatar"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full border-2 border-white object-cover"
            />
          ))}
          {extraCount > 0 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[11px] font-medium text-gray-600">
              +{extraCount}
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>
    </div>
  );
};

export const BoardCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
    <div className="h-4 w-24 rounded bg-gray-200" />
    <div className="mt-2 h-3 w-full rounded bg-gray-200" />
    <div className="mt-1 h-3 w-3/4 rounded bg-gray-200" />
    <div className="mt-6 flex items-center justify-between">
      <div className="flex -space-x-2">
        <div className="h-7 w-7 rounded-full border-2 border-white bg-gray-200" />
        <div className="h-7 w-7 rounded-full border-2 border-white bg-gray-200" />
      </div>
      <div className="h-3 w-16 rounded bg-gray-200" />
    </div>
  </div>
);