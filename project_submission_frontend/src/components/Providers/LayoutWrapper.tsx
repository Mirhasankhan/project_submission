"use client";

import { usePathname } from "next/navigation";
import Header from "../shared/Header";

const authRoutes = ["/auth/login", "/auth/register"];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {!isAuthRoute && <Header />}
      <div className="min-h-[calc(100vh-65px)] bg-slate-50/50">{children}</div>
    </>
  );
}