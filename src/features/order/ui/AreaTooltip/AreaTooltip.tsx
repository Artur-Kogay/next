'use client';

import { Tooltip } from 'react-tooltip';

import styles from './AreaTooltip.module.scss';
import { type AreaTooltipProps } from './AreaTooltip.types';
import { generateAreaTooltipText } from '../../lib/schema-utils';

export function AreaTooltip({ areasCount }: AreaTooltipProps) {
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
