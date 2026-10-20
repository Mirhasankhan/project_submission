"use client";

import { persistor, store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
       <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <div>{children}</div>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default Providers;
