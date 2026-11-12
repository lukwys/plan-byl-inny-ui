"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics/track-event";

const READ_THRESHOLD = 0.75;

type ReadingProgressProps = {
  targetId: string;
  slug: string;
};

export const ReadingProgress = ({ targetId, slug }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number>(null);
  const trackedRef = useRef(false);

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

      if (ratio >= READ_THRESHOLD && !trackedRef.current) {
        trackedRef.current = true;
        trackEvent("post-read", { slug });
      }
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
  }, [targetId, slug]);

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
