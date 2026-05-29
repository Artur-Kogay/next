'use client';

import { type SchemeTooltipsProps } from './SchemeTooltips.types';
import { AreaTooltip } from '../AreaTooltip/AreaTooltip';
import { SeatTooltip } from '../SeatTooltip/SeatTooltip';

export function SchemeTooltips({ item, areasCount, showSeat }: SchemeTooltipsProps) {
  return (
    <>
      {showSeat && <SeatTooltip item={item} />}
      <AreaTooltip areasCount={areasCount} />
    </>
  );
}
