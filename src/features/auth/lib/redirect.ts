const SAFE_REDIRECT_RE = /^\/(?!\/)/;

export const sanitizeRedirect = (value: string | null): string => {
  if (!value) return '/';
  if (!SAFE_REDIRECT_RE.test(value)) return '/';
  return value;
};
