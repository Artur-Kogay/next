import type { PaymentMethod } from '../../api/schemas';

export interface PaymentMethodListProps {
  methods: PaymentMethod[];
  selected: string;
  onSelect: (code: string) => void;
}
