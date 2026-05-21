import { EventCard, type SessionListItem } from '@/entities/event';

import styles from './EventsSection.module.scss';

interface EventsSectionProps {
  title: string;
  sessions: SessionListItem[];
  anchorId?: string;
  priorityImages?: boolean;
}

export const EventsSection = ({
  title,
  sessions,
  anchorId,
  priorityImages = false,
}: EventsSectionProps) => {
  if (sessions.length === 0) return null;

  return (
    <section id={anchorId} className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>

      <div className={styles.grid}>
        {sessions.map((session, idx) => (
          <EventCard key={session.id} session={session} priority={priorityImages && idx < 4} />
        ))}
      </div>
    </section>
  );
};
