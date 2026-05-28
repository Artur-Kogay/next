'use client';

import { FaMinus, FaPlus } from 'react-icons/fa6';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useControls } from 'react-zoom-pan-pinch';

import { useRouter } from '@/shared/lib/i18n/navigation';

import styles from './Schema.module.scss';

export function SideButtons() {
  const router = useRouter();
  const { zoomIn, zoomOut } = useControls();

  return (
    <div className={styles.sideButtons}>
      <button type="button" className={styles.sideBtn} onClick={() => router.back()}>
        <RiArrowGoBackFill />
      </button>
      <button type="button" className={styles.sideBtn} onClick={() => zoomIn()}>
        <FaPlus />
      </button>
      <button type="button" className={styles.sideBtn} onClick={() => zoomOut()}>
        <FaMinus />
      </button>
    </div>
  );
}
