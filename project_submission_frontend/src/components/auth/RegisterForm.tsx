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

export default function RegisterForm() {
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
      const authData = response.result;

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

        router.push("/");
      } else {
        toast.success(response.message || "Account created successfully!");
        
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage =
        err?.data?.message || err?.error || "Registration failed. Try again.";
      toast.error(errorMessage);
    }
  };

  return (
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
            placeholder="Enter your full name"
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
            placeholder="Enter your email address"
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
            placeholder="Enter your password"
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
          className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-[8px] shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all mt-2 cursor-pointer"
        >
          {isLoading ? (
            <>              
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>                 
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
  );
}
