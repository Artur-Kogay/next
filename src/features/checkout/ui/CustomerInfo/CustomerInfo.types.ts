export interface Customer {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
}

export interface CustomerInfoProps {
  customer: Customer;
  onChange: (patch: Partial<Customer>) => void;
  showName: boolean;
  showEmail: boolean;
  showBirthday: boolean;
}
