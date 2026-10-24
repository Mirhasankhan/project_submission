"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/utils/Container";
import StudentDashboard from "@/components/submission/StudentDashboard";
import MentorDashboard from "@/components/submission/MentorDashboard";
import { JWTDecode } from "@/utils/jwt";

const HomePage = () => {
  const router = useRouter();
  const { token, decoded } = JWTDecode();

  useEffect(() => {
    if (!token || !decoded?.role) {
      router.replace("/auth/login");
    }
  }, [decoded?.role, router, token]);

  if (!token || !decoded?.role) {
    return null;
  }

  return (
    <main className="min-h-screen py-8 bg-slate-50/50">
      <Container>
        {decoded.role === "Mentor" ? <MentorDashboard /> : <StudentDashboard />}
      </Container>
    </main>
  );
};

export default HomePage;
