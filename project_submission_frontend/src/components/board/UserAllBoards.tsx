"use client";

import { useRouter } from "next/navigation";
import { useUserAllBoardsQuery } from "@/redux/features/board/board.api";
import { BoardCard, BoardCardSkeleton } from "./BoardCard";
import CreateBoardModal from "./CreateNewBoardModal";
import { LayoutDashboard } from "lucide-react";

const UserAllBoards = () => {
  const router = useRouter();
  const { data, isLoading, error } = useUserAllBoardsQuery("", {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <BoardCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center my-6">
        <p className="text-sm font-medium text-red-600">
          Failed to load boards. Please check your connection and try again.
        </p>
      </div>
    );
  }

  const boards = data?.result ?? [];

  if (boards.length === 0) {
    return (
      <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 px-6 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <LayoutDashboard className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">
          No boards found
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-zinc-400">
          You don&apos;t have any boards yet. Create your first board to start organizing and collaborating on your tasks.
        </p>
        <div className="mt-6">
          <CreateBoardModal />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {boards.map(({ role, board }: any) => (
        <BoardCard
          key={board.id}
          role={role}
          board={board}
          onClick={() => router.push(`/board/${board.id}`)}
        />
      ))}
    </div>
  );
};

export default UserAllBoards;

