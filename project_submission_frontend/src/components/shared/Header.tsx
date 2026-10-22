"use client";

import Container from "@/utils/Container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfileQuery } from "@/redux/features/auth/authApi";
import { FolderGit2, ShieldCheck, GraduationCap, LayoutDashboard, Trophy, BookOpen, LogIn } from "lucide-react";
import SignOut from "./SignOut";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";

const Header = () => {
  const pathname = usePathname();
  const { data: profileResponse, isLoading } = useProfileQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });
  const currentUser = useAppSelector(useCurrentUser);

  const profileUser = profileResponse?.result || profileResponse?.data;
  const user =
    profileUser ||
    (currentUser.token && currentUser.name
      ? {
          id: currentUser.id || "",
          fullName: currentUser.name,
          email: currentUser.email || "",
          role: currentUser.role || "Student",
        }
      : null);

  const navLinks = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Showcase", href: "/showcase", icon: Trophy },
    { label: "Guidelines", href: "/guidelines", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
      <Container>
        <div className="flex justify-between items-center py-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-primary hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FolderGit2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-gray-900">
                  ProjectHub
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  Submission & Review Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Info & Sign Out or Sign In */}
          <div className="flex items-center gap-3">
            {isLoading && !user ? (
              <div className="flex items-center gap-2.5 animate-pulse">
                <div className="h-9 w-9 rounded-full bg-gray-200" />
                <div className="hidden sm:block space-y-1.5">
                  <div className="h-3.5 w-20 rounded bg-gray-200" />
                  <div className="h-2.5 w-28 rounded bg-gray-200" />
                </div>
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg border border-gray-100 bg-gray-50">
                  <div className="hidden sm:block text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-gray-900 leading-none">
                        {user.fullName}
                      </p>
                      <Badge
                        variant={user.role === "Mentor" ? "secondary" : "default"}
                        className="text-[10px] py-0 px-1.5 h-4 gap-0.5"
                      >
                        {user.role === "Mentor" ? (
                          <ShieldCheck className="w-2.5 h-2.5 inline" />
                        ) : (
                          <GraduationCap className="w-2.5 h-2.5 inline" />
                        )}
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate max-w-[150px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <SignOut />
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
