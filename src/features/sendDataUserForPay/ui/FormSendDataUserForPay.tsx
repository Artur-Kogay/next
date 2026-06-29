'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import {useAtom} from "jotai";
import {useTranslations} from "next-intl";
import { useForm, Controller } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';

import {paymentDataGatewayAtom} from "@/entities/payment";
import {LabelInput} from "@/shared/ui";

import {type ISendDataUserForPaySchema, sendDataUserForPaySchema} from "../lib";
import styles from './FormSendDataUserForPay.module.scss'

function FormSendDataUserForPay() {
    const localizer = useTranslations()
    const [paymentDataGateway, setPaymentDataGateway] = useAtom(paymentDataGatewayAtom)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ISendDataUserForPaySchema>({
        resolver: zodResolver(sendDataUserForPaySchema),
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            email: '',
        },
    });

    const onSubmit = (data: ISendDataUserForPaySchema) => {
        setPaymentDataGateway({...paymentDataGateway, ...data})
    };

    console.log("FORM RENDER")

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            id={'payment-form'}
        >
            <LabelInput
                label={localizer('fullName')}
                placeholder="Иванов Иван Иванович"
                {...register('fullName')}
                error={errors.fullName?.message}
            />

            <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                    <PatternFormat
                        customInput={LabelInput}
                        label={localizer('phoneNumber')}
                        placeholder="+996 555 123 456"
                        error={errors.phoneNumber?.message}
                        format="+996 ### ### ###"
                        mask="_"
                        allowEmptyFormatting
                        value={field.value}
                        onValueChange={(values) => {
                            field.onChange(values.value);
                        }}
                    />
                )}
            />

            <LabelInput
                label="Email"
                type="email"
                placeholder="example@mail.com"
                {...register('email')}
                error={errors.email?.message}
            />
        </form>
    );
}

export default FormSendDataUserForPay;