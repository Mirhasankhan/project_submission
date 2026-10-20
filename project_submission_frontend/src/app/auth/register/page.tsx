"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { TLoginValues } from "@/types/common";
import Link from "next/link";
import { useRegisterRequestMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const [registerRequest, { isLoading }] = useRegisterRequestMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginValues>();

  const onSubmit: SubmitHandler<TLoginValues> = async (data) => {
    const formData = new FormData();
    const registerData = {
      fullName: data.fullName,
      email: data.email,
      password: data.password
    };
    formData.append("bodyData", JSON.stringify(formData));
    const response: any = await registerRequest(registerData);
    if (response.data) {
      localStorage.setItem("verify", data.email);
      router.push("/auth/verify-email");
      toast.success(response.data.message);
    } else {
      toast.error(response.error.data.message);
    }
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen flex items-center justify-center">

      <div className="w-full md:w-2/5 xl:w-1/3 shadow-md md:mx-auto mx-2 py-12 px-6 dark:text-white bg-white rounded-[16px]">
        <h1
          style={{
            fontFamily: "'Satisfy', cursive",
          }}        
          className="flex text-green-600 text-3xl font-bold items-center gap-2"
        >
          <span className="tracking-wide">Flowboard</span>
        </h1>

        <h1 className="text-sm text-gray-600">
          Sign up to to manage boards
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-[9px] py-6 bg-white"
        >
          <div className="mb-4">
            <label className="label-design pb-1">Full Name</label>
            <input
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="input-design"
              placeholder="Enter your fullname"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="label-design pb-1">Email</label>
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
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className="input-design"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className={`${isLoading ? "bg-primary/75" : "bg-primary"
              } text-white py-3 mt-3 w-full font-medium rounded-[4px]`}
          >
            {isLoading ? "Creating...." : "Create Account"}
          </button>
        </form>

        <div className="flex border-t pt-4 border-gray-200 text-gray-700 justify-center">
          <h1>Already have an account?</h1>
          <Link
            href="/auth/login"
            className="text-secondary hover:underline ml-1"
          >
            Login
          </Link>
        </div>      
      </div>
    </div>
  );
};

export default Register;
