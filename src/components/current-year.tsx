"use client";

export const CurrentYear = () => (
  <span suppressHydrationWarning>{new Date().getFullYear()}</span>
);
