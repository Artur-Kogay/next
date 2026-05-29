import { type SessionListItem } from '../../api/schemas';

export interface EventCardProps {
  session: SessionListItem;
  priority?: boolean;
}
