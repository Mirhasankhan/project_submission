"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/utils/Container";
import StudentDashboard from "@/components/submission/StudentDashboard";
import MentorDashboard from "@/components/submission/MentorDashboard";
import { useProfileQuery } from "@/redux/features/auth/authApi";

const HomePage = () => {
  const router = useRouter();
  const { data: profileResponse, isLoading, isError } = useProfileQuery();
  const user = profileResponse?.result || profileResponse?.data;

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/auth/login");
    }
  }, [isError, isLoading, router, user]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen py-8 bg-slate-50/50">
      <Container>
        {user.role === "Mentor" ? <MentorDashboard /> : <StudentDashboard />}
      </Container>
    </main>
  );
};

export default HomePage;
