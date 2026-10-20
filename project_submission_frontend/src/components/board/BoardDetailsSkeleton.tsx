import Container from "@/utils/Container";
import { Skeleton } from "@/components/ui/skeleton";

export const BoardDetailsSkeleton = () => {
  return (
    <Container>
      {/* Board Header Skeleton */}
      <div className="lg:flex items-start justify-between gap-4 border-b py-4">
        <div className="space-y-2 flex-1 max-w-lg">
          <Skeleton className="h-8 w-48 rounded-[9px]" />
          <Skeleton className="h-4 w-72 rounded-[6px]" />
        </div>

        <div className="flex items-center gap-2 shrink-0 mt-4 lg:mt-0">
          <Skeleton className="h-9 w-28 rounded-[6px]" />
          <Skeleton className="h-9 w-32 rounded-[6px]" />
        </div>
      </div>

      {/* Board Columns Skeleton */}
      <div className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {[1, 2, 3, 4].map((col) => (
            <div
              key={col}
              className="flex min-h-[420px] w-full flex-col rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              {/* Column Header Skeleton */}
              <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-5 w-6 rounded-full" />
                </div>
                <Skeleton className="h-4 w-4 rounded" />
              </div>

              {/* Tasks Skeleton */}
              <div className="mt-3 flex flex-col gap-2.5 flex-1">
                <div className="rounded-xl border border-zinc-200/60 bg-white p-3.5 shadow-sm space-y-2 dark:border-zinc-800 dark:bg-zinc-950">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-12 rounded" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200/60 bg-white p-3.5 shadow-sm space-y-2 dark:border-zinc-800 dark:bg-zinc-950">
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </div>

                {col % 2 === 1 && (
                  <div className="rounded-xl border border-zinc-200/60 bg-white p-3.5 shadow-sm space-y-2 dark:border-zinc-800 dark:bg-zinc-950">
                    <Skeleton className="h-4 w-2/3 rounded" />
                    <Skeleton className="h-3 w-1/3 rounded" />
                  </div>
                )}
              </div>

              {/* Add Task Skeleton */}
              <Skeleton className="h-9 w-full rounded-[9px] mt-3" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default BoardDetailsSkeleton;
