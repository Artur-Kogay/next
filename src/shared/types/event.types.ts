import type { BaseType } from './session.types';
import type { Theater } from './theater.types';

export type Event = BaseType & {
  title: string;
  image_path?: string;
  is_popular?: boolean;
  organization_id?: number;
  theater?: Theater;
  age_restriction?: string;
  description?: string;
  duration?: string;
  is_active: 'ACTIVE' | 'COMPLETED' | 'AWAITING_CLARIFICATION';
  is_free?: boolean;
  outer_event_id?: string;
  is_email: boolean;
  is_full_name: boolean;
  is_birthday: boolean;
};
