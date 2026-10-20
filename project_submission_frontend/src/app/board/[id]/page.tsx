"use client";

import BoardMembersModal from "@/components/board/BoardMemberListModal";
import BoardDetailsEditor from "@/components/board/BoardDetailsEditor";
import InviteMemberModal from "@/components/board/InviteMemberModal";
import { useBoardDetailsQuery } from "@/redux/features/board/board.api";
import Container from "@/utils/Container";
import { useParams } from "next/navigation";
import AllColumnsForBoard from "@/components/board/AllColumnsForBoard";
import BoardDetailsSkeleton from "@/components/board/BoardDetailsSkeleton";

const BoardDetailsPage = () => {
  const { id } = useParams();
  const { data: board, isLoading } = useBoardDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const boardDetails = board?.result?.board;
  const role = board?.result?.role;
  const isEditAccess = role === "OWNER" || role === "EDITOR";

  if (isLoading) {
    return <BoardDetailsSkeleton />;
  }

  return (
    <Container>
      <div className="md:flex items-center justify-between gap-4 border-b py-4">
        <BoardDetailsEditor
          boardId={boardDetails?.id || ""}
          title={boardDetails?.title || ""}
          description={boardDetails?.description || ""}
          role={role}
        />

        <div className="flex items-center gap-2 shrink-0">
          <BoardMembersModal
            members={board?.result?.board?.members || []}
            isEditAccess={isEditAccess}
          />
          {(role === "OWNER" || role === "EDITOR") && (
            <InviteMemberModal boardId={board?.result?.board?.id} />
          )}
        </div>
      </div>
      <AllColumnsForBoard board={board} />
    </Container>
  );
};

export default BoardDetailsPage;
