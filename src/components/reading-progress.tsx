"use client";

import { useEffect, useRef, useState } from "react";

type ReadingProgressProps = {
  targetId: string;
};

export const ReadingProgress = ({ targetId }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    const measure = () => {
      frameRef.current = null;

      const { top, height } = target.getBoundingClientRect();
      const scrollable = height - window.innerHeight;

      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = -top;
      const ratio = Math.min(Math.max(scrolled / scrollable, 0), 1);
      setProgress(ratio);
    };

    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-main-red motion-safe:transition-transform motion-safe:duration-100"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};
