"use client";

import { useProfileQuery } from "@/redux/features/auth/authApi";
import Container from "@/utils/Container";
import StudentDashboard from "@/components/submission/StudentDashboard";
import MentorDashboard from "@/components/submission/MentorDashboard";


export default function HomePage() {
  const { data: profileResponse, isLoading } = useProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const user = profileResponse?.result || profileResponse?.data;

  if (isLoading) {
    return (
      <main className="min-h-screen py-8">
        <Container>
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white rounded-xl border border-slate-200" />
              ))}
            </div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 mt-6" />
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 bg-slate-50/50">
      <Container>
        {user?.role === "Mentor" ? (
          <MentorDashboard />
        ) : (
          <StudentDashboard />
        )}
      </Container>
    </main>
  );
}
