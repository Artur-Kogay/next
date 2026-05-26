export type ProfileTab = 'orders' | 'profileData' | 'security' | 'notifications';

export const PROFILE_TABS: ProfileTab[] = ['orders', 'profileData', 'security', 'notifications'];

export const isProfileTab = (value: string | null | undefined): value is ProfileTab =>
  !!value && (PROFILE_TABS as string[]).includes(value);
