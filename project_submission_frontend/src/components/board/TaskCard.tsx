"use client";

import { Task } from "@/types/common";
import { Check, GripVertical, Loader2, Pencil, Trash2, X } from "lucide-react";
import React, { useState } from "react";

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  isEditable: boolean;
  onUpdateTitle: (taskId: string, newTitle: string) => Promise<boolean>;
  onDeleteTask: (taskId: string) => void;
  onTaskDragStart: (e: React.DragEvent, taskId: string, columnId: string, index: number) => void;
  onTaskDragOver: (targetIndex: number) => void;
  onTaskDrop: (targetIndex: number) => void;
}

const TaskCard = ({
  task,
  index,
  columnId,
  isEditable,
  onUpdateTitle,
  onDeleteTask,
  onTaskDragStart,
  onTaskDragOver,
  onTaskDrop,
}: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }
    setIsSaving(true);
    const success = await onUpdateTitle(task.id, trimmed);
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isTop = e.clientY < midY;
    onTaskDragOver(isTop ? index : index + 1);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditable) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const isTop = e.clientY < midY;
    const targetIdx = isTop ? index : index + 1;
    onTaskDrop(targetIdx);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        draggable={isEditable && !isEditing}
        onDragStart={(e) => onTaskDragStart(e, task.id, columnId, index)}
        className={`group relative rounded-xl border border-zinc-200/80 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 ${
          isEditable && !isEditing ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              className="w-full rounded-[9px] border border-primary bg-transparent px-2.5 py-1.5 text-sm "
            />
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                }}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-medium text-white"
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              {isEditable && (
                <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300 group-hover:text-zinc-400 dark:text-zinc-600 dark:group-hover:text-zinc-400" />
              )}
              <p
                onDoubleClick={() => isEditable && setIsEditing(true)}
                className="break-words text-sm font-medium text-zinc-800 dark:text-zinc-200"
              >
                {task.title}
              </p>
            </div>

            {isEditable && (
              <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  type="button"
                  title="Edit task"
                  onClick={() => setIsEditing(true)}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Delete task"
                  onClick={() => onDeleteTask(task.id)}
                  className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
