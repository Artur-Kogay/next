import type { ProfileTab } from '../../model/tabs';

export interface ProfileMobileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export const ORDER: ProfileTab[] = ['orders', 'profileData'];
