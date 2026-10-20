"use client";

import { Column } from "@/types/common";
import { Check, GripHorizontal, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import TaskCard from "./TaskCard";

interface BoardColumnProps {
  column: Column;
  columnIndex: number;
  isEditable: boolean;
  onUpdateColumnTitle: (columnId: string, newTitle: string) => Promise<boolean>;
  onDeleteColumn: (columnId: string) => void;
  onAddTask: (columnId: string, title: string) => Promise<boolean>;
  onUpdateTaskTitle: (taskId: string, newTitle: string) => Promise<boolean>;
  onDeleteTask: (taskId: string) => void;
  // Drag column handlers
  onColumnDragStart: (e: React.DragEvent, columnId: string, index: number) => void;
  onColumnDrop: (index: number) => void;
  // Drag task handlers
  onTaskDragStart: (e: React.DragEvent, taskId: string, columnId: string, index: number) => void;
  onTaskDropOnColumn: (targetColumnId: string, targetIndex?: number) => void;
}

const BoardColumn = ({
  column,
  columnIndex,
  isEditable,
  onUpdateColumnTitle,
  onDeleteColumn,
  onAddTask,
  onUpdateTaskTitle,
  onDeleteTask,
  onColumnDragStart,
  onColumnDrop,
  onTaskDragStart,
  onTaskDropOnColumn,
}: BoardColumnProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isSavingTitle, setIsSavingTitle] = useState(false);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  const [isDragOverColumn, setIsDragOverColumn] = useState(false);
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState<number | null>(null);

  const handleSaveTitle = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed === column.title) {
      setIsEditingTitle(false);
      setTitle(column.title);
      return;
    }
    setIsSavingTitle(true);
    const success = await onUpdateColumnTitle(column.id, trimmed);
    setIsSavingTitle(false);
    if (success) {
      setIsEditingTitle(false);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setTitle(column.title);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    setIsSubmittingTask(true);
    const success = await onAddTask(column.id, trimmed);
    setIsSubmittingTask(false);
    if (success) {
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  // Drag-and-drop column handling
  const handleColumnHeaderDragStart = (e: React.DragEvent) => {
    if (!isEditable || isEditingTitle) return;
    onColumnDragStart(e, column.id, columnIndex);
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    if (!isEditable) return;
    const isTask = e.dataTransfer.types.includes("task-drag");
    if (!isTask) {
      e.preventDefault();
    }
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    if (!isEditable) return;
    const isTask = e.dataTransfer.types.includes("task-drag");
    if (!isTask) {
      e.preventDefault();
      onColumnDrop(columnIndex);
    }
  };

  // Drag-and-drop task over this column
  const handleTaskAreaDragOver = (e: React.DragEvent) => {
    if (!isEditable) return;
    const isTask = e.dataTransfer.types.includes("task-drag");
    if (isTask) {
      e.preventDefault();
      setIsDragOverColumn(true);
    }
  };

  const handleTaskAreaDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the column element completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOverColumn(false);
      setDragOverTaskIndex(null);
    }
  };

  const handleTaskAreaDrop = (e: React.DragEvent) => {
    if (!isEditable) return;
    const isTask = e.dataTransfer.types.includes("task-drag");
    if (isTask) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverColumn(false);
      const targetIndex = dragOverTaskIndex !== null ? dragOverTaskIndex : column.tasks.length;
      setDragOverTaskIndex(null);
      onTaskDropOnColumn(column.id, targetIndex);
    }
  };

  return (
    <div
      onDragOver={handleColumnDragOver}
      onDrop={handleColumnDrop}
      className={`flex h-full min-h-[380px] max-h-[620px] w-full min-w-0 flex-col rounded-2xl border transition-all duration-200 ${
        isDragOverColumn
          ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/20"
          : "border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/60"
      }`}
    >
      {/* Column Header */}
      <div
        draggable={isEditable && !isEditingTitle}
        onDragStart={handleColumnHeaderDragStart}
        className={`flex items-center justify-between border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800 ${isEditable && !isEditingTitle ? "cursor-grab active:cursor-grabbing" : ""
          }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditable && (
            <GripHorizontal className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
          )}

          {isEditingTitle ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleTitleKeyDown}
                disabled={isSavingTitle}
                className="w-full rounded-[6px] border border-primary bg-white px-2 py-1 text-sm font-semibold "
              />
              <button
                type="button"
                disabled={isSavingTitle}
                onClick={handleSaveTitle}
                className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
              >
                {isSavingTitle ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                disabled={isSavingTitle}
                onClick={() => {
                  setIsEditingTitle(false);
                  setTitle(column.title);
                }}
                className="rounded p-1 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h3
                onDoubleClick={() => isEditable && setIsEditingTitle(true)}
                className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                title={column.title}
              >
                {column.title}
              </h3>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200/70 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {column.tasks.length}
              </span>
            </div>
          )}
        </div>

        {isEditable && !isEditingTitle && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              title="Edit column title"
              onClick={() => setIsEditingTitle(true)}
              className="rounded p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Delete column"
              onClick={() => onDeleteColumn(column.id)}
              className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Task List / Drop Zone */}
      <div
        onDragOver={handleTaskAreaDragOver}
        onDragLeave={handleTaskAreaDragLeave}
        onDrop={handleTaskAreaDrop}
        className="flex-1 space-y-2.5 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700"
      >
        {column.tasks.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            index={idx}
            columnId={column.id}
            isEditable={isEditable}
            onUpdateTitle={onUpdateTaskTitle}
            onDeleteTask={onDeleteTask}
            onTaskDragStart={onTaskDragStart}
            onTaskDragOver={(targetIdx) => {
              setDragOverTaskIndex(targetIdx);
            }}
            onTaskDrop={(targetIdx) => {
              onTaskDropOnColumn(column.id, targetIdx);
            }}
          />
        ))}

        {column.tasks.length === 0 && (
          <div
            className={`flex h-24 flex-col items-center justify-center rounded-xl border border-dashed text-xs text-zinc-400 transition-colors dark:text-zinc-500 ${isDragOverColumn
              ? "border-blue-400 bg-blue-50/60 dark:border-blue-600 dark:bg-blue-950/30"
              : "border-zinc-300/80 dark:border-zinc-800"
              }`}
          >
            {isDragOverColumn ? "Drop task here" : "No tasks yet"}
          </div>
        )}
      </div>

      {/* Column Footer: Add Task */}
      {isEditable && (
        <div className="border-t border-zinc-200/80 p-3 dark:border-zinc-800">
          {isAddingTask ? (
            <form onSubmit={handleCreateTask} className="space-y-2">
              <textarea
                autoFocus
                value={newTaskTitle}
                minLength={3}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreateTask(e);
                  } else if (e.key === "Escape") {
                    setIsAddingTask(false);
                    setNewTaskTitle("");
                  }
                }}
                disabled={isSubmittingTask}
                placeholder="Enter a task title..."
                rows={2}
                className="input-design"
              />
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmittingTask || !newTaskTitle.trim()}
                  className="inline-flex items-center gap-1.5 rounded-[9px] bg-primary px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
                >
                  {isSubmittingTask && <Loader2 className="h-3 w-3 animate-spin" />}
                  Add Task
                </button>
                <button
                  type="button"
                  disabled={isSubmittingTask}
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle("");
                  }}
                  className="rounded-[9px] px-2.5 py-1.5 text-xs font-medium text-zinc-600 "
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTask(true)}
              className="flex w-full items-center gap-2 rounded-xl py-2 px-3 text-sm font-medium text-zinc-600 transition  bg-primary/10"
            >
              <Plus className="h-4 w-4 text-primary" />
              Add Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BoardColumn;
