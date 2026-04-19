"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PreviewBanner() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-amber-400 px-4 py-2 text-sm font-medium text-amber-900">
      <span>Tryb podglądu — widzisz nieopublikowaną treść</span>
      <Link
        href={`/api/disable-preview?url=${encodeURIComponent(pathname)}`}
        className="rounded bg-amber-900 px-3 py-1 text-amber-50 hover:bg-amber-800 transition-colors"
      >
        Wyjdź z podglądu
      </Link>
    </div>
  );
}
