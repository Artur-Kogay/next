'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

import { useBasket } from '@/entities/basket';
import {
  bakaiDataAtom,
  demirDataAtom,
  elsomDataAtom,
  isWebviewLoadingAtom,
  kicbDataAtom,
  kompanionDataAtom,
  megapayDataAtom,
  webviewTypeAtom,
} from '@/features/webview';
import { useRouter } from '@/shared/lib/i18n/navigation';
import { isAuthAtom } from '@/shared/model';
import { Loader } from '@/shared/ui';

import styles from './Checkout.module.scss';
import { FREE_METHOD, OTP_METHODS, type CheckoutProps } from './Checkout.types';
import {
  checkPhone,
  clearBasket,
  parseApiError,
  useApplyPromo,
  useCheckoutUser,
  useConfirmOtp,
  usePay,
} from '../../api/client';
import { CustomerInfo } from '../CustomerInfo/CustomerInfo';
import { OrderSummary } from '../OrderSummary/OrderSummary';
import { PaymentMethodList } from '../PaymentMethodList/PaymentMethodList';
import { PaymentResult } from '../PaymentResult/PaymentResult';

import type { Customer } from '../CustomerInfo/CustomerInfo.types';
import type { PaymentResultState } from '../PaymentResult/PaymentResult.types';

const EMPTY_CUSTOMER: Customer = { name: '', email: '', phone: '', birthday: '', gender: '' };

export const Checkout = ({ paymentMethods }: CheckoutProps) => {
  const t = useTranslations('checkout');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isAuth = useAtomValue(isAuthAtom);

  const webviewType = useAtomValue(webviewTypeAtom);
  const webviewLoading = useAtomValue(isWebviewLoadingAtom);
  const bakaiData = useAtomValue(bakaiDataAtom);
  const megapayData = useAtomValue(megapayDataAtom);
  const demirData = useAtomValue(demirDataAtom);
  const kicbData = useAtomValue(kicbDataAtom);
  const kompanionData = useAtomValue(kompanionDataAtom);
  const elsomData = useAtomValue(elsomDataAtom);

  const webviewPrefill = useMemo(() => {
    switch (webviewType) {
      case 'bakai':
        return bakaiData ? { phone: bakaiData.phone, name: '' } : null;
      case 'megapay':
        return megapayData ? { phone: megapayData.phone, name: megapayData.fullName } : null;
      case 'demir_webhook':
        return demirData ? { phone: demirData.phone, name: demirData.fullName } : null;
      case 'kicb_webhook':
        return kicbData ? { phone: kicbData.phone, name: kicbData.fullName } : null;
      case 'kompanion':
        return kompanionData ? { phone: kompanionData.phone, name: kompanionData.fullName } : null;
      case 'elsom':
        return elsomData
          ? {
              phone: elsomData.phone,
              name: [elsomData.lastName, elsomData.firstName, elsomData.middleName]
                .filter(Boolean)
                .join(' '),
            }
          : null;
      default:
        return null;
    }
  }, [webviewType, bakaiData, megapayData, demirData, kicbData, kompanionData, elsomData]);

  const { data: cart } = useBasket();
  const { data: user } = useCheckoutUser(mounted && isAuth);
  const pay = usePay();
  const applyPromo = useApplyPromo();
  const confirmOtp = useConfirmOtp();

  const basket = useMemo(() => cart?.basket ?? [], [cart]);
  const timer = cart?.timer ?? 0;
  const event = basket[0]?.event;
  const isFreeOrder = useMemo(() => basket.some((t) => t.event?.is_free), [basket]);

  const methods = useMemo(() => {
    if (isFreeOrder) return [{ ...FREE_METHOD, title: t('free') }];
    const enabled = paymentMethods.filter(
      (m) => m.is_enabled !== false && m.country?.is_enabled !== false,
    );
    if (webviewType) {
      const match = enabled.filter((m) => m.code === webviewType);
      if (match.length) return match;
    }
    return enabled;
  }, [paymentMethods, isFreeOrder, t, webviewType]);

  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [methodCode, setMethodCode] = useState('');
  const [promo, setPromo] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [result, setResult] = useState<PaymentResultState | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    setCustomer((prev) => ({
      name: prev.name || user.full_name,
      email: prev.email || user.email,
      phone: prev.phone || user.phone_number,
      birthday: prev.birthday || user.birthday,
      gender: prev.gender || user.gender.toLowerCase(),
    }));
  }, [user]);

  useEffect(() => {
    if (!webviewPrefill) return;
    setCustomer((prev) => ({
      ...prev,
      name: prev.name || webviewPrefill.name,
      phone: prev.phone || webviewPrefill.phone,
    }));
  }, [webviewPrefill]);

  useEffect(() => {
    if (webviewType && methods.some((m) => m.code === webviewType)) {
      setMethodCode(webviewType);
    }
  }, [webviewType, methods]);

  useEffect(() => {
    if (mounted && !webviewLoading && !isAuth) {
      router.replace('/auth?redirect=/basket/checkout');
    }
  }, [mounted, webviewLoading, isAuth, router]);

  useEffect(() => {
    if (mounted && isAuth && !result && cart && basket.length === 0) {
      router.replace('/');
    }
  }, [mounted, isAuth, result, cart, basket.length, router]);

  useEffect(() => {
    if (!methodCode && methods.length) setMethodCode(methods[0]!.code);
  }, [methods, methodCode]);

  const onCustomerChange = useCallback((patch: Partial<Customer>) => {
    setCustomer((prev) => ({ ...prev, ...patch }));
  }, []);

  const selectedMethod = useMemo(
    () => methods.find((m) => m.code === methodCode),
    [methods, methodCode],
  );

  const totals = useMemo(() => {
    const ticketsSum = basket.reduce((s, t) => s + t.price, 0);
    const serviceFeeSum = basket.reduce((s, t) => s + t.service_fee, 0);
    const itemDiscount = basket.reduce((s, t) => s + (t.discount || 0), 0);
    const discount = itemDiscount + promoDiscount;
    const total = Math.max(0, ticketsSum + serviceFeeSum - discount);
    return { ticketsSum, serviceFeeSum, discount, total, count: basket.length };
  }, [basket, promoDiscount]);

  const showName = event?.is_full_name !== false;
  const showEmail = !!event?.is_email;
  const showBirthday = !!event?.is_birthday;

  const onApplyPromo = useCallback(async () => {
    if (!promo.trim()) return;
    if (!selectedMethod) {
      toast.error(t('select-method-first'));
      return;
    }
    try {
      const discount = await applyPromo.mutateAsync({
        code: promo,
        paymentMethodCode: selectedMethod.code,
      });
      setPromoDiscount(discount);
      toast.success(t('promo-applied'));
    } catch {
      setPromoDiscount(0);
      toast.error(t('promo-invalid'));
    }
  }, [promo, selectedMethod, applyPromo, t]);

  const finish = useCallback(
    (orderNumber: string) => {
      void clearBasket();
      router.push(`/profile?orderNumber=${orderNumber}`);
    },
    [router],
  );

  const handlePayError = useCallback(
    (err: unknown, fallback: string) => {
      const { status, message } = parseApiError(err);
      if (status === 400) {
        toast.error(message || fallback);
        return;
      }
      void clearBasket();
      toast.error(message || t('pay-error'));
      router.push('/');
    },
    [router, t],
  );

  const onExpire = useCallback(() => {
    void clearBasket();
    toast.error(t('time-expired'));
    router.back();
  }, [router, t]);

  const onCancel = useCallback(() => {
    void clearBasket();
    router.push('/');
  }, [router]);

  const onPay = useCallback(async () => {
    if (!selectedMethod) {
      toast.error(t('select-method'));
      return;
    }
    if (showName && !customer.name.trim()) {
      toast.error(t('enter-name'));
      return;
    }
    if (showEmail && !customer.email.trim()) {
      toast.error(t('enter-email'));
      return;
    }
    if (showBirthday && (!customer.birthday || !customer.gender)) {
      toast.error(t('enter-birthday-gender'));
      return;
    }
    if (customer.phone.replace(/\D/g, '').length < 9) {
      toast.error(t('enter-valid-phone'));
      return;
    }

    const otpCfg = OTP_METHODS[selectedMethod.code];
    let otpName: string | undefined;
    if (otpCfg?.checkPhone) {
      const name = await checkPhone(selectedMethod.code, customer.phone);
      if (name === null) {
        toast.error(t('phone-not-registered'));
        return;
      }
      otpName = name || undefined;
    }

    try {
      const res = await pay.mutateAsync({
        paymentTypeCode: selectedMethod.code,
        data: {
          user_email: customer.email.trim(),
          phone_number: customer.phone,
          redirect_url:
            typeof window !== 'undefined'
              ? `${window.location.origin}/profile?orderNumber=`
              : undefined,
          ...(webviewType ? { type: 'webview' as const } : {}),
          user_info: {
            full_name: customer.name.trim(),
            birthday: showBirthday ? customer.birthday : '',
            gender: showBirthday ? customer.gender : '',
          },
        },
      });

      if (otpCfg) {
        setResult({
          kind: 'otp',
          code: selectedMethod.code,
          phone: res.otp_sent_phone || customer.phone,
          orderNumber: res.order_number,
          codeLength: otpCfg.codeLength,
          timer: otpCfg.timer,
          name: otpName,
        });
        return;
      }

      const redirectUrl = res.pay_data?.pay_url || res.redirect_url;
      if (redirectUrl) {
        setResult({ kind: 'redirecting' });
        window.location.href = redirectUrl;
        return;
      }
      const qr = res.qr_base64 || res.qr;
      if (qr) {
        setResult({ kind: 'qr', qr, orderNumber: res.order_number });
        return;
      }
      if (selectedMethod.code === 'free') {
        finish(res.order_number);
        return;
      }
      setResult({ kind: 'success', orderNumber: res.order_number });
    } catch (err) {
      handlePayError(err, t('pay-error-short'));
    }
  }, [
    selectedMethod,
    customer,
    showName,
    showEmail,
    showBirthday,
    pay,
    finish,
    handlePayError,
    t,
    webviewType,
  ]);

  const onConfirmOtp = useCallback(
    async (otp: string) => {
      if (result?.kind !== 'otp') return;
      if (otp.length < 4) {
        toast.error(t('enter-sms-code'));
        return;
      }
      try {
        await confirmOtp.mutateAsync({ code: result.code, otp, orderNumber: result.orderNumber });
        finish(result.orderNumber);
      } catch (err) {
        handlePayError(err, t('wrong-otp'));
      }
    },
    [result, confirmOtp, finish, handlePayError, t],
  );

  if (!mounted) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  if (result) {
    return (
      <div className={styles.center}>
        <PaymentResult
          state={result}
          onFinish={() => router.push('/profile')}
          onConfirmOtp={onConfirmOtp}
          confirmPending={confirmOtp.isPending}
          onExpire={onExpire}
          onCancel={onCancel}
        />
      </div>
    );
  }

  if (!cart || basket.length === 0) {
    return (
      <div className={styles.center}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <header className={styles.head}>
          <button type="button" className={styles.back} onClick={() => router.back()}>
            <ArrowLeft size={18} aria-hidden />
          </button>
          <h1 className={styles.title}>{t('title')}</h1>
        </header>

        <div className={styles.grid}>
          <div className={styles.main}>
            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>1</span>
                <h2 className={styles.cardTitle}>{t('contact-data')}</h2>
              </div>
              <CustomerInfo
                customer={customer}
                onChange={onCustomerChange}
                showName={showName}
                showEmail={showEmail}
                showBirthday={showBirthday}
              />
            </section>

            <section className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.step}>2</span>
                <h2 className={styles.cardTitle}>{t('payment-method')}</h2>
              </div>
              <PaymentMethodList methods={methods} selected={methodCode} onSelect={setMethodCode} />
            </section>
          </div>

          <OrderSummary
            basket={basket}
            timer={timer}
            totals={totals}
            promo={promo}
            onPromoChange={setPromo}
            onApplyPromo={onApplyPromo}
            promoPending={applyPromo.isPending}
            promoApplied={promoDiscount > 0}
            onPay={onPay}
            payPending={pay.isPending}
            payLabel={isFreeOrder ? t('get-tickets') : t('pay')}
          />
        </div>
      </div>
    </div>
  );
};
