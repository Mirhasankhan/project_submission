"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";
import {
  useInviteMemberMutation,
  useUninvitedMembersQuery,
} from "@/redux/features/board/board.api";
import { toast } from "react-toastify";

const DEFAULT_AVATAR =
  "https://res.cloudinary.com/dddrm7ep8/image/upload/v1781532954/y7gdxfkl9uznjt96cjea.png";

type InviteRole = "VIEWER" | "EDITOR";

const InviteMemberModal = ({ boardId }: { boardId: string }) => {
  const { data: uninvitedMembers, isLoading } = useUninvitedMembersQuery(
    boardId,
    {
      skip: !boardId,
    },
  );
  const [inviteMember] = useInviteMemberMutation();
  const [open, setOpen] = useState(false);
  const [memberRoles, setMemberRoles] = useState<Record<string, InviteRole>>(
    {},
  );
  const [invitingMemberId, setInvitingMemberId] = useState<string | null>(null);
  const members = uninvitedMembers?.result ?? [];

  const handleInviteMember = async (memberId: string) => {
    setInvitingMemberId(memberId);

    try {
      const response = await inviteMember({
        boardId,
        memberId,
        role: memberRoles[memberId] || "VIEWER",
      }).unwrap();
     

      if (response?.success) {
        toast.success(response?.message || "Member invited successfully");
      }
    } finally {
      setInvitingMemberId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <Users size={13} className="text-primary" />
          Invite members          
        </button>
      </DialogTrigger>

      <DialogContent className="rounded-[9px] bg-white p-5 sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Invite a member
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Choose a role beside each member before inviting them.
          </p>
        </DialogHeader>

        <div className="mt-3 flex max-h-[320px] flex-col gap-2 overflow-y-auto">
          {isLoading && (
            <div className="py-8 text-center text-sm text-gray-500">
              Loading members...
            </div>
          )}

          {!isLoading && members.length === 0 && (
            <div className="rounded-[9px] border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
              Everyone is already a member of this board.
            </div>
          )}

          {!isLoading &&
            members.map((member: any) => {
              const isInvitingMember = invitingMemberId === member.id;
              const memberRole = memberRoles[member.id] || "VIEWER";

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-[9px] border border-gray-100 bg-gray-50/70 px-3 py-2"
                >
                  <Image
                    src={member.profileImage || DEFAULT_AVATAR}
                    alt={member.fullName || "Member"}
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {member.fullName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {member.email}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <select
                      value={memberRole}
                      onChange={(event) =>
                        setMemberRoles((currentRoles) => ({
                          ...currentRoles,
                          [member.id]: event.target.value as InviteRole,
                        }))
                      }
                      disabled={Boolean(invitingMemberId)}
                      aria-label={`Invite role for ${member.fullName || "member"}`}
                      className="h-8 rounded-[6px] border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 outline-none transition  disabled:cursor-not-allowed disabled:bg-gray-100"
                    >
                      <option value="VIEWER">Viewer</option>
                      <option value="EDITOR">Editor</option>
                    </select>
                    <button
                      type="button"
                      disabled={Boolean(invitingMemberId)}
                      onClick={() => handleInviteMember(member.id)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-primary px-2.5 text-xs font-semibold text-white transition  disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isInvitingMember && (
                        <Loader2 size={13} className="animate-spin" />
                      )}
                      {isInvitingMember ? "Inviting" : "Invite"}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberModal;
