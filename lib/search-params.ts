/** Next.js App Router searchParam value shape. */
export type SearchParam = string | string[] | undefined;

/** Use the first value when duplicate query keys produce an array. */
export function searchParamString(value: SearchParam): string | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value[0] : value;
}
