type NextFetchInit = RequestInit & {
  next?: { revalidate?: number };
};

const DEFAULT_REVALIDATE = 60 * 60;

export async function requestData<T>(
  input: RequestInfo,
  init?: NextFetchInit,
  options?: { revalidate?: number | false },
): Promise<T> {
  const revalidate =
    options?.revalidate === false
      ? undefined
      : (options?.revalidate ?? init?.next?.revalidate ?? DEFAULT_REVALIDATE);

  const response = await fetch(input, {
    ...init,
    cache: options?.revalidate === false ? "no-store" : init?.cache,
    next:
      options?.revalidate === false
        ? undefined
        : {
            ...init?.next,
            revalidate,
          },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Request failed (${response.status}): ${String(input)} ${text.slice(0, 200)}`,
    );
  }

  const data = await response.json();
  return data.data as T;
}
