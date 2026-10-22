import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@/utils/Container";
import StudentDashboard from "@/components/submission/StudentDashboard";
import MentorDashboard from "@/components/submission/MentorDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | ProjectHub",
  description: "View and manage academic project submissions and mentor evaluations.",
};

export const dynamic = "force-dynamic";

async function getUserProfile(token: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4097/api/v1";

  try {
    const res = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.result || data.data;
  } catch (error) {
    console.error("SSR profile fetch error:", error);
    return null;
  }
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  const user = await getUserProfile(token);

  // If token is invalid or expired, redirect to login
  if (!user) {
    redirect("/auth/login");
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
