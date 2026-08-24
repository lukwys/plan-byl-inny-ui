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
  const widgetRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    const tokenWasSpent =
      state.success || (!!state.error && state.error !== "VALIDATION_FAILED");

    if (tokenWasSpent) {
      // The widget is an external system holding the only copy of the token,
      // so React state has to follow it here rather than derive the value.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken("");
      widgetRef.current?.reset();
    }
  }, [state]);

  return {
    token,
    turnstileProps: {
      ref: widgetRef,
      siteKey: TURNSTILE_SITE_KEY ?? "",
      onSuccess: setToken,
      onExpire: () => setToken(""),
      onError: () => setToken(""),
    },
  };
};
