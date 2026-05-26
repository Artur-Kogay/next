export const splitName = (full: string | null | undefined): { first: string; last: string } => {
  const parts = (full ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') };
};
