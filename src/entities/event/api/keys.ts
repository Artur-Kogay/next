export const eventKeys = {
  all: ['events'] as const,
  popular: (locale: string) => [...eventKeys.all, 'popular', locale] as const,
  search: (locale: string, query: string) => [...eventKeys.all, 'search', locale, query] as const,
};
