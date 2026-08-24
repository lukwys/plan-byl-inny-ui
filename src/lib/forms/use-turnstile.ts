"use client";

import { useEffect, useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { TURNSTILE_SITE_KEY } from "@/config/turnstile";

type ActionState = {
  success: boolean;
  error?: string;
};

export const useTurnstile = (state: ActionState) => {
  const [token, setToken] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const widgetRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    const tokenWasSpent =
      state.success || (!!state.error && state.error !== "VALIDATION_FAILED");

    if (tokenWasSpent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken("");
      widgetRef.current?.reset();
    }
  }, [state]);

  return {
    token,
    isMounted,
    formProps: {
      onFocus: () => setIsMounted(true),
    },
    turnstileProps: {
      ref: widgetRef,
      siteKey: TURNSTILE_SITE_KEY ?? "",
      onSuccess: setToken,
      onExpire: () => setToken(""),
      onError: () => setToken(""),
    },
  };
};
