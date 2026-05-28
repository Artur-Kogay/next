'use client';

import { Tooltip } from 'react-tooltip';

import styles from './Schema.module.scss';
import { generateAreaTooltipText, generateTooltipText } from '../../lib/schema-utils';

import type { OrderSession } from '../../api/schemas';

export function SeatTooltip({ item, sectorId }: { item: OrderSession; sectorId?: string }) {
  return (
    <Tooltip
      id="seat-tooltip"
      className={styles.tooltip}
      render={({ activeAnchor }) => {
        const text = generateTooltipText(activeAnchor, item, sectorId);
        if (!text) return null;
        return <span className={styles.tooltipText}>{text}</span>;
      }}
    />
  );
}

export function AreaTooltip({ areasCount }: { areasCount: Record<string, number> }) {
  return (
    <Tooltip
      id="area-tooltip"
      className={styles.tooltip}
      render={({ activeAnchor }) => (
        <span className={styles.tooltipText}>
          {generateAreaTooltipText(activeAnchor, areasCount)}
        </span>
      )}
    />
  );
}

type SchemeTooltipsProps = {
  item: OrderSession;
  areasCount: Record<string, number>;
  showSeat: boolean;
};

export function SchemeTooltips({ item, areasCount, showSeat }: SchemeTooltipsProps) {
  return (
    <>
      {showSeat && <SeatTooltip item={item} />}
      <AreaTooltip areasCount={areasCount} />
    </>
  );
}
