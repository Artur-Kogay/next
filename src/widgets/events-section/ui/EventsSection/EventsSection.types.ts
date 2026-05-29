import { type SessionListItem } from '@/entities/event';

export interface EventsSectionProps {
  title: string;
  sessions: SessionListItem[];
  anchorId?: string;
  priorityImages?: boolean;
}
