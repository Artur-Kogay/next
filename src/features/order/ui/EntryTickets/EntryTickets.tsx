'use client';

import styles from './EntryTickets.module.scss';
import { type EntryTicketsProps } from './EntryTickets.types';
import { TicketCard } from '../TicketCard/TicketCard';

export const EntryTickets = ({ item, basket }: EntryTicketsProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.eventTitle}>{item.event.title}</h1>
        <p className={styles.subtitle}>Выберите билеты</p>
      </div>
      <div className={styles.grid}>
        {item.ticket_types
          .filter((t) => t.quantity > 0)
          .map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} item={item} basket={basket} />
          ))}
      </div>
    </div>
  );
};
