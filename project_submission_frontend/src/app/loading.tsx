import Container from "@/utils/Container";

export default function Loading() {
  return (
    <main className="min-h-screen py-8 bg-slate-50/50">
      <Container>
        <div className="space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
            <div className="space-y-2">
              <div className="h-8 bg-slate-200 rounded-lg w-48" />
              <div className="h-4 bg-slate-100 rounded w-80" />
            </div>
            <div className="h-10 bg-slate-200 rounded-lg w-36" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded w-20" />
                  <div className="h-7 w-7 bg-slate-100 rounded-lg" />
                </div>
                <div className="h-7 bg-slate-200 rounded w-12" />
              </div>
            ))}
          </div>

          {/* Filter Bar Skeleton */}
          <div className="h-16 bg-white rounded-xl border border-slate-200" />

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-44 bg-white rounded-xl border border-slate-200"
              />
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
