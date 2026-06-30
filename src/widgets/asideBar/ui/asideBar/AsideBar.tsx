'use client';

import { type Dispatch, type SetStateAction } from 'react';

import Image from 'next/image';

import { ReceiptText, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IoClose } from 'react-icons/io5';

import { FormSendDataUserForPay } from '@/features/sendDataUserForPay';
import { calculateTotalPrice } from '@/shared/utils';

import styles from './AsideBar.module.scss';

interface AsideBarProps {
  productName: string;
  productCount: string | number;
  productPrice: string | number;
  productSize?: string;
  setIsAsideOpen: Dispatch<SetStateAction<boolean>>;
  isAsideOpen: boolean;
}

const AsideBar = ({
  productName,
  productPrice,
  productCount,
  productSize,
  setIsAsideOpen,
  isAsideOpen,
}: AsideBarProps) => {
  const localizer = useTranslations();
  const onClose = () => setIsAsideOpen(false);

  return (
    <>
      <button
        className={`${styles.overlay} ${isAsideOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />

      <aside
        className={`${styles.panel} ${isAsideOpen ? styles.panelOpen : ''}`}
        aria-hidden={!isAsideOpen}
      >
        <div className={styles.header}>
          <div className={styles.header__top}>
            <h2>{localizer('checkoutTitle')}</h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="close">
              <IoClose size={24} />
            </button>
          </div>

          <h4>{localizer('checkoutSubtitle')}</h4>

          <div className={styles.productInfo}>
            <Image
              src={'/images/ex8.jpg'}
              alt={'product image'}
              width={100}
              height={100}
              priority
            />
            <div className={styles.productInfo_textInfo}>
              <h4>{productName}</h4>
              <p>
                {productPrice} {localizer('som')}
              </p>
              <div>
                <p>
                  {localizer('sizes')}: {productSize}
                </p>
                <p>
                  {localizer('count')}: {productCount}шт.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className={styles.form}>
          <div className={styles.form_title}>
            <UserRound size={18} color={'lab(79.2667 9.96342 51.0155)'} />
            <h2>{localizer('contactDetails')}</h2>
          </div>
          <div className={styles.body}>
            <FormSendDataUserForPay />
          </div>
        </section>

        <div className={styles.footer}>
          <div className={styles.footer_price}>
            <div>
              <ReceiptText size={18} color={'lab(79.2667 9.96342 51.0155)'} />
              <h3>{localizer('totalToPay')}</h3>
            </div>
            <h2>
              {calculateTotalPrice(productCount, productPrice)} {localizer('som')}
            </h2>
          </div>
          <div className={styles.footer_btns}>
            <button className={styles.payBtn} form={'payment-form'}>
              {localizer('pay')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AsideBar;
