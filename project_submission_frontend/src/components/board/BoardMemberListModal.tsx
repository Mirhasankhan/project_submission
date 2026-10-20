"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Users } from "lucide-react";
import { useState } from "react";
import {
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/redux/features/board/board.api";
import { toast } from "react-toastify";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dddrm7ep8/image/upload/v1781532954/y7gdxfkl9uznjt96cjea.png";

interface BoardMembersModalProps {
  members: any[];
  isEditAccess: boolean;
}

const BoardMembersModal = ({ members, isEditAccess }: BoardMembersModalProps) => {
  const [removeMember] = useRemoveMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    try {
      setRemovingMemberId(memberId);
      const response = await removeMember(memberId).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Member removed successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const handleUpdateRole = async (memberId: string) => {
    try {
      setUpdatingMemberId(memberId);
      const response = await updateMemberRole(memberId).unwrap();
      if (response?.success) {
        toast.success(response?.message || "Role updated successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update member role");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <Users size={13} className="text-primary" />
          View members
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            {members.length}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="bg-white !rounded-[8px] p-6 sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            People on this board
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex max-h-[360px] flex-col divide-y divide-gray-100 overflow-y-auto rounded-[6px] border border-gray-100">
          {members.map((member: any) => {
            const memberRole = (member.role || "VIEWER").toUpperCase();
            const isMemberOwner = memberRole === "OWNER";
            const isCurrentlyUpdating = updatingMemberId === member.id;
            const isCurrentlyRemoving = removingMemberId === member.id;

            return (
              <div
                key={member.id}
                className="flex min-w-0 items-center justify-between gap-3 bg-gray-50/60 px-3 py-2.5 first:rounded-t-md last:rounded-b-md"
              >
                <div className="flex min-w-0 items-center gap-2.5 flex-1">
                  <Image
                    height={32}
                    width={32}
                    src={member.user?.profileImage || DEFAULT_AVATAR}
                    alt={member.user?.fullName || "Board member"}
                    className="h-8 w-8 shrink-0 rounded-full border border-white object-cover shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-gray-900">
                      {member.user?.fullName || "Unnamed member"}
                    </p>
                    <p className="truncate text-[10px] text-gray-500">
                      {member.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Current Role Display */}
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${
                      isMemberOwner
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : memberRole === "EDITOR"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {memberRole}
                  </span>

                  {/* Change Role Button */}
                  {isEditAccess && !isMemberOwner && (
                    <button
                      type="button"
                      disabled={isCurrentlyUpdating || isCurrentlyRemoving}
                      onClick={() => handleUpdateRole(member.id)}
                      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCurrentlyUpdating ? (
                        <>
                          <Loader2 size={10} className="animate-spin text-primary" />
                          <span>Updating...</span>
                        </>
                      ) : memberRole === "VIEWER" ? (
                        "Change to EDITOR"
                      ) : (
                        "Change to VIEWER"
                      )}
                    </button>
                  )}

                  {/* Remove Member Button */}
                  {isEditAccess && !isMemberOwner && (
                    <button
                      type="button"
                      disabled={isCurrentlyRemoving || isCurrentlyUpdating}
                      onClick={() => handleRemoveMember(member.id)}
                      aria-label={`Remove ${member.user?.fullName || "board member"}`}
                      title="Remove member"
                      className="rounded p-1 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isCurrentlyRemoving ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {members.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-gray-500">
              No members have been added to this board yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BoardMembersModal;
