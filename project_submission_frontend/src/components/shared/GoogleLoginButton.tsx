"use client";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGoogleLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import Cookies from "js-cookie";
import { setUser } from "@/redux/features/auth/authSlice";

const GoogleLoginButton = () => {
  const router = useRouter();
  const [googleLogin] = useGoogleLoginMutation()
    const dispatch = useAppDispatch();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      console.log("Google ID Token:", idToken);

      if (!idToken) {
        toast.error("Google ID token is missing");
        return;
      }

      const payload = {
        idToken
      }

      const response = await googleLogin(payload)
      console.log(response)

      toast.success("Login successful");
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


    } catch (error: any) {
      console.error("Google login error:", error);

      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        toast.error("Google authentication failed");
      }}
    />
  );
};

export default GoogleLoginButton;