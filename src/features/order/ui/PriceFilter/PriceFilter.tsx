'use client';

import { useMemo } from 'react';

import { type PriceFilterProps } from './PriceFilter.types';
import { normalizePrices } from '../../lib/schema-utils';
import { PriceChips } from '../PriceChips/PriceChips';

export function PriceFilter({ item, orderItems }: PriceFilterProps) {
  const prices = useMemo(() => normalizePrices(item, orderItems), [item, orderItems]);

  return <PriceChips prices={prices} />;
}
