interface RequestOptions extends Omit<RequestInit, "next"> {
  revalidate?: number | false;
}

const DEFAULT_REVALIDATE = 3600;

export async function requestData<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { revalidate, ...fetchOptions } = options;

  const revalidateValue =
    revalidate === false ? undefined : (revalidate ?? DEFAULT_REVALIDATE);

  const response = await fetch(`${path}`, {
    ...fetchOptions,
    cache: revalidate === false ? "no-store" : undefined,
    next:
      revalidateValue !== undefined
        ? { revalidate: revalidateValue }
        : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "No error body");
    throw new Error(
      `[API Error] ${response.status} | ${path} | ${errorBody.slice(0, 150)}`,
    );
  }

  const result = await response.json();

  return result?.data as T;
}
