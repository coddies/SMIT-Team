"use client";

// ============================================================
// Redux Provider — wraps the app tree with the store
// ============================================================

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { useEffect, useRef } from "react";
import { initSession } from "@/store/sessionSlice";

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.dispatch(initSession());
    }
  }, []);

  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionBootstrap>{children}</SessionBootstrap>
    </Provider>
  );
}
