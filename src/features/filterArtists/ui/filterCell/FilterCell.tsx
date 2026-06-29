import type { ButtonHTMLAttributes, ReactNode } from 'react';

import clsx from 'clsx';

import styles from './FilterCell.module.scss'



interface FilterCellProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    isActiveCell: boolean;
}

function FilterCell({children, isActiveCell, ...props}: FilterCellProps) {
    return (
        <button className={clsx(styles.cell, isActiveCell && styles.active)} {...props}>
            <span>{children}</span>
        </button>
    );
}

export default FilterCell;