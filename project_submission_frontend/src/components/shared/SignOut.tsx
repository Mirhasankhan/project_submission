"use client";

import { logOut } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut } from "lucide-react";

const SignOut = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(logOut());
    Cookies.remove("token");
    router.push("/auth/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-[8px] hover:bg-rose-100 transition-colors"
      title="Sign Out"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  );
};

export default SignOut;
