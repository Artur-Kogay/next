'use client';

import { useMemo } from 'react';

import { PriceChips } from './PriceChips';
import { normalizePrices } from '../../lib/schema-utils';

import type { OrderItem, OrderSession } from '../../api/schemas';

export function PriceFilter({ item, orderItems }: { item: OrderSession; orderItems: OrderItem[] }) {
  const prices = useMemo(() => normalizePrices(item, orderItems), [item, orderItems]);

  return <PriceChips prices={prices} />;
}
