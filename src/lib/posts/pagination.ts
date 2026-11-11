export const FIRST_PAGE_SIZE = 5;
export const PAGE_SIZE = 6;

export const getPageRange = (page: number) =>
  page === 1
    ? { start: 0, limit: FIRST_PAGE_SIZE }
    : { start: FIRST_PAGE_SIZE + (page - 2) * PAGE_SIZE, limit: PAGE_SIZE };

export const getTotalPages = (totalPosts: number) =>
  totalPosts <= FIRST_PAGE_SIZE
    ? 1
    : 1 + Math.ceil((totalPosts - FIRST_PAGE_SIZE) / PAGE_SIZE);

export const parsePageParam = (value: string) => {
  if (!/^\d+$/.test(value)) return null;
  const page = Number(value);
  return page >= 1 ? page : null;
};

export const getPageHref = (basePath: string, page: number) =>
  page === 1 ? basePath || "/" : `${basePath}/strona/${page}`;
