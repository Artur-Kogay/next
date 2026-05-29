'use client';

import { useState } from 'react';

import { ArrowLeft, Mail, Phone, UserRound } from 'lucide-react';

import { useRouter } from '@/shared/lib/i18n/navigation';

import styles from './Checkout.module.scss';
import { MOCK_BASKET, MOCK_TIMER, MOCK_TOTALS, type CheckoutProps } from './Checkout.types';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { PaymentMethodList } from '../PaymentMethodList/PaymentMethodList';

const noop = () => {};

export const Checkout = ({ paymentMethods }: CheckoutProps) => {
  const router = useRouter();
  const [methodCode, setMethodCode] = useState(paymentMethods[0]?.code ?? '');
  const [promo, setPromo] = useState('');

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <header className={styles.head}>
          <button type="button" className={styles.back} onClick={() => router.back()}>
            <ArrowLeft size={18} aria-hidden />
          </button>
          <h1 className={styles.title}>Оформление заказа</h1>
        </header>

        <div className={styles.grid}>
          <div className={styles.main}>
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <h2 className={styles.cardTitle}>Контактные данные</h2>
              </div>
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={styles.label}>Имя</span>
                  <div className={styles.inputWrap}>
                    <UserRound size={16} className={styles.inputIcon} aria-hidden />
                    <input className={styles.input} placeholder="Как к вам обращаться" />
                  </div>
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <div className={styles.inputWrap}>
                    <Mail size={16} className={styles.inputIcon} aria-hidden />
                    <input
                      className={styles.input}
                      type="email"
                      placeholder="Для отправки билетов"
                    />
                  </div>
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.label}>Телефон</span>
                  <div className={styles.inputWrap}>
                    <Phone size={16} className={styles.inputIcon} aria-hidden />
                    <input className={styles.input} type="tel" placeholder="+996 700 000 000" />
                  </div>
                </label>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>2</span>
                <h2 className={styles.cardTitle}>Способ оплаты</h2>
              </div>
              <PaymentMethodList
                methods={paymentMethods}
                selected={methodCode}
                onSelect={setMethodCode}
              />
            </section>
          </div>

          <OrderSummary
            basket={MOCK_BASKET}
            timer={MOCK_TIMER}
            totals={MOCK_TOTALS}
            promo={promo}
            onPromoChange={setPromo}
            onApplyPromo={noop}
            promoPending={false}
            promoApplied={false}
            onPay={noop}
            payPending={false}
            payLabel="Оплатить"
          />
        </div>
      </div>
    </div>
  );
};
