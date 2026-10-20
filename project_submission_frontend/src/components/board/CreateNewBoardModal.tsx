"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateNewBoardMutation } from "@/redux/features/board/board.api";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createBoardSchema = z.object({
  title: z.string().trim().min(1, "Board title is required"),
  description: z.string().trim().optional(),
});

type CreateBoardFormValues = z.infer<typeof createBoardSchema>;

const CreateBoardModal = () => {
  const [open, setOpen] = useState(false);
  const [createBoard, { isLoading }] = useCreateNewBoardMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateBoardFormValues>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const title = watch("title");
  const description = watch("description");

  const isDisabled = isLoading || !title?.trim() || !description?.trim();

  const onSubmit = async (values: CreateBoardFormValues) => {
    try {
      const response = await createBoard(values).unwrap();
      console.log(response);
      reset();
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isLoading) {
      setOpen(nextOpen);
      if (!nextOpen) reset();
    }
  };

  return (
    <Dialog  open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="px-3 flex items-center gap-1 py-2 rounded-[6px] bg-primary text-white font-medium hover:bg-primary/90 transition">
          <Plus size={17}></Plus>  Create Board
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px]  bg-white !rounded-[8px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create new board
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-sm font-medium">
              Board title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Q4 Roadmap"
              className="input-design"
              disabled={isLoading}
              minLength={3}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="What's this board about?"
              className="input-design resize-none"
              disabled={isLoading}
              minLength={6}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="px-4 py-2 rounded-[6px] font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isDisabled}
              className={`px-4 py-2 rounded-[6px] font-medium text-white transition ${isDisabled
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
                }`}
            >
              {isLoading ? "Creating..." : "Create board"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardModal;