'use client';

import { useMemo } from 'react';

import { useBasket } from '../../api/client';
import { EsboSchema } from '../EsboSchema/EsboSchema';
import { EventInfo } from '../EventInfo/EventInfo';
import styles from '../OrderPage/OrderPage.module.scss';

import type { EsboPrice, EsboSeat } from '../../api/esbo-schemas';
import type { OrderSession } from '../../api/schemas';

interface EsboOrderPageProps {
  item: OrderSession;
  schemaHtml: string;
  esboPricing: EsboPrice[];
  esboSeats: EsboSeat[];
}

export const EsboOrderPage = ({ item, schemaHtml, esboPricing, esboSeats }: EsboOrderPageProps) => {
  const { data: cart } = useBasket();
  const basket = useMemo(() => cart?.basket ?? [], [cart]);

  return (
    <div className={styles.schemaWrapper}>
      <EventInfo item={item} />
      <EsboSchema
        item={item}
        schemaHtml={schemaHtml}
        esboPricing={esboPricing}
        esboSeats={esboSeats}
        basket={basket}
      />
    </div>
  );
};
