export const readStringParam = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";
