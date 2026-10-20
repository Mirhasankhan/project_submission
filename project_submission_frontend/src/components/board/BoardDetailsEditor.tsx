"use client";

import { useUpdateBoardMutation } from "@/redux/features/board/board.api";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

type BoardDetailsEditorProps = {
  boardId: string;
  title: string;
  description: string;
  role?: string;
};

const BoardDetailsEditor = ({
  boardId,
  title: initialTitle,
  description: initialDescription,
  role,
}: BoardDetailsEditorProps) => {
  const [updateBoard, { isLoading: isUpdating }] = useUpdateBoardMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const isEditAccess = role === "OWNER" || role === "EDITOR";

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  const handleCancelEdit = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setIsEditing(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Board title is required");
      return;
    }

    try {
      const response = await updateBoard({
        boardId,
        title: title.trim(),
        description: description.trim(),
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Board updated successfully");
        setIsEditing(false);
      }
    } catch {
      toast.error("Failed to update board");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-w-0 flex-1">
      {isEditing ? (
        <div className="max-w-2xl space-y-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Board title"
            className="input-design "
            autoFocus
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            aria-label="Board description"
            rows={2}
            className="input-design"
          />
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-primary px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <h1 className="truncate text-2xl font-bold">{initialTitle}</h1>
            {isEditAccess && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit board details"
                title="Edit board details"
                className="rounded-[6px] p-1.5 text-gray-400 transition"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>
          <p className="mt-1 text-muted-foreground">{initialDescription}</p>
        </>
      )}
      <p className="mt-1 text-sm">
        Role: <span className="font-medium">{role}</span>
      </p>
    </form>
  );
};

export default BoardDetailsEditor;
