import {atom} from 'jotai'
import {IPaymentDataGatewayAtom} from '../types/IPaymentDataGatewayAtom'

export const paymentDataGatewayAtom = atom<IPaymentDataGatewayAtom>({
    id: 0,
    size: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    count: 1,
    price: '',
})