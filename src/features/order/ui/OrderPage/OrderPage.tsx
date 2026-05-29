'use client';

import { useMemo } from 'react';

import styles from './OrderPage.module.scss';
import { type OrderPageProps } from './OrderPage.types';
import { useBasket, useOrderItems } from '../../api/client';
import { EntryTickets } from '../EntryTickets/EntryTickets';
import { EventInfo } from '../EventInfo/EventInfo';
import { Schema } from '../Schema/Schema';

export const OrderPage = ({ item, schemaHtml }: OrderPageProps) => {
  const { data: cart } = useBasket();
  const { data: orderItems } = useOrderItems(item.slug);

  const basket = useMemo(() => cart?.basket ?? [], [cart]);
  const items = useMemo(() => orderItems ?? [], [orderItems]);

  const hasSchema = !!schemaHtml && !!item.scheme?.seats?.length;

  if (hasSchema) {
    return (
      <div className={styles.schemaWrapper}>
        <EventInfo item={item} />
        <Schema item={item} orderItems={items} schemaHtml={schemaHtml} basket={basket} />
      </div>
    );
  }

  return <EntryTickets item={item} basket={basket} />;
};
