import Link from "next/link";
import { getPageHref } from "@/lib/posts/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const getVisiblePages = (current: number, total: number) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
};

const linkClass = "transition-colors hover:text-main-red-hover";

export const Pagination = ({ currentPage, totalPages, basePath }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Paginacja"
      className="mt-16 flex items-center justify-between gap-4 border-t border-neutral-200 pt-6 font-dm-sans text-sm"
    >
      <div className="w-20">
        {currentPage > 1 && (
          <Link href={getPageHref(basePath, currentPage - 1)} className={linkClass}>
            Nowsze
          </Link>
        )}
      </div>
      <ol className="flex items-center gap-1">
        {pages.map((page, index) => (
          <li key={page} className="flex items-center gap-1">
            {index > 0 && page - pages[index - 1] > 1 && (
              <span aria-hidden="true" className="px-1 text-neutral-400">
                …
              </span>
            )}
            {page === currentPage ? (
              <span
                aria-current="page"
                className="flex h-9 min-w-9 items-center justify-center rounded-full bg-main-red px-3 text-white"
              >
                {page}
              </span>
            ) : (
              <Link
                href={getPageHref(basePath, page)}
                aria-label={`Strona ${page}`}
                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 ${linkClass}`}
              >
                {page}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <div className="w-20 text-right">
        {currentPage < totalPages && (
          <Link href={getPageHref(basePath, currentPage + 1)} className={linkClass}>
            Starsze
          </Link>
        )}
      </div>
    </nav>
  );
};
