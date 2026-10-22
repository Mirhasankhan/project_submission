import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { UserRole } from "@/types";

export interface DecodedTokenPayload extends JwtPayload {
  id?: string;
  role?: UserRole;
  email?: string;
  fullName?: string;
}

export const JWTDecode = () => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedTokenPayload>(token);
        return { token, decoded };
      } catch (err) {
        console.error("Failed to decode JWT token:", err);
        return { token, decoded: null };
      }
    }
  }
  return { token: null, decoded: null };
};