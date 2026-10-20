"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { TRegisterValues } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { FolderGit2, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterValues>();

  const onSubmit: SubmitHandler<TRegisterValues> = async (formData) => {
    try {
      const response = await registerUser(formData).unwrap();
      const authData = response.result || response.data;

      if (authData?.accessToken) {
        toast.success(response.message || "Account created successfully!");

        dispatch(
          setUser({
            id: authData.id,
            name: authData.fullName,
            email: formData.email,
            role: authData.role,
            token: authData.accessToken,
          })
        );

        Cookies.set("token", authData.accessToken, { expires: 7 });
        Cookies.set("accessToken", authData.accessToken, { expires: 7 });

        router.push("/");
      } else {
        toast.success(response.message || "Registration successful! Please login.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.data?.message || err?.error || "Registration failed. Try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
            <FolderGit2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create Student Account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Submit and track your academic project milestones
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-200/80 rounded-2xl sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label-design">Full Name</label>
              <input
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Full name must be at least 2 characters",
                  },
                })}
                className="input-design"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-design">Email Address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className="input-design"
                placeholder="student@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="label-design">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                className="input-design"
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-[8px] shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all mt-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 inline"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <UserPlus className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
