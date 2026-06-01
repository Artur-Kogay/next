'use client';

import { useMemo } from 'react';

import styles from './EsboOrderPage.module.scss';
import { type EsboOrderPageProps } from './EsboOrderPage.types';
import { useBasket } from '../../api/client';
import { CheckoutCta } from '../CheckoutCta/CheckoutCta';
import { EsboSchema } from '../EsboSchema/EsboSchema';
import { EventInfo } from '../EventInfo/EventInfo';

export const EsboOrderPage = ({ item, schemaHtml, esboPricing, esboSeats }: EsboOrderPageProps) => {
  const { data: cart } = useBasket();
  const basket = useMemo(() => cart?.basket ?? [], [cart]);

  return (
    <>
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
      <CheckoutCta />
    </>
  );
};
