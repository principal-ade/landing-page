/**
 * Prefix basePath for hand-written absolute links/assets.
 *
 * Next.js only applies `basePath` to `next/link`, the router, and `_next`
 * assets — plain `<a href="/…">` and `<img src="/…">` are left untouched. When
 * the site is served from a subpath (GitHub Pages project site), those need
 * prefixing manually. `NEXT_PUBLIC_BASE_PATH` is empty in local dev, so this is
 * a no-op there.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${BASE_PATH}${path}`;
}
