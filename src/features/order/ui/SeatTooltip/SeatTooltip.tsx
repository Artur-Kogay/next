'use client';

import { Tooltip } from 'react-tooltip';

import styles from './SeatTooltip.module.scss';
import { type SeatTooltipProps } from './SeatTooltip.types';
import { generateTooltipText } from '../../lib/schema-utils';

export function SeatTooltip({ item, sectorId }: SeatTooltipProps) {
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
