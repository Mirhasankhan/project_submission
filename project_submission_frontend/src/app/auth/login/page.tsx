"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { TLoginValues } from "@/types/common";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginValues>();

  const onSubmit: SubmitHandler<TLoginValues> = async (data) => {
    try {
      const response: any = await loginUser(data);
     

      if (response.data?.result?.accessToken) {
        toast.success("Login Successful");

        router.push("/");
        dispatch(
          setUser({
            name: response.data.result.fullName,
            email: response.data.result.email,
            role: response.data.result.role,
            token: response.data.result?.accessToken,
          })
        );
        Cookies.set("token", response.data?.result?.accessToken);
      } else if (response.error) {
        toast.error(response.error.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred.");
    } finally {
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">
      <div className="w-full md:w-2/5 xl:w-1/3 2xl:w-1/4 shadow-md mx-2 md:mx-auto py-12 px-6 dark:text-white bg-white rounded-[10px]">
        <div className="flex flex-col items-center">
          <h1
            style={{
              fontFamily: "'Satisfy', cursive",
            }}          
            className="flex text-green-600 text-3xl font-bold items-center gap-2"
          >
            <span className="tracking-wide">Flowboard</span>
          </h1>        
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[9px] py-6 bg-white"
        >
          <div className="mb-4">
            <label className="label-design pb-1">Email Address</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="input-design"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="label-design pb-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="input-design"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <div className="flex justify-between items-center py-3">
            <Link
              href="/auth/reset-password"
              className="text-secondary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="text-[#FFF] py-2 font-semibold rounded-[4px] w-full bg-primary"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 inline mr-2"
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
                Signing in...
              </>
            ) : (
              <>Sign In</>
            )}
          </button>
        </form>
        <GoogleLoginButton></GoogleLoginButton>

        <div className="text-center text-gray-700 pt-4">
          Dont have an account?
          <Link href="/auth/register" className="text-secondary hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
