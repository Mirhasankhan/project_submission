import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { UserRole } from "@/types";

export interface AuthState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  token: string | null;
}

const initialState: AuthState = {
  id: null,
  name: null,
  email: null,
  role: null,
  token: null,
};

export interface SetUserPayload {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: UserRole | null;
  token?: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { id, name, email, role, token } = action.payload;
      if (id !== undefined) state.id = id;
      if (name !== undefined) state.name = name;
      if (email !== undefined) state.email = email;
      if (role !== undefined) state.role = role;
      if (token !== undefined) state.token = token;
    },
    logOut: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentUser = (state: RootState) => state.auth;
export const useCurrentToken = (state: RootState) => state.auth.token;
export const useCurrentRole = (state: RootState) => state.auth.role;
