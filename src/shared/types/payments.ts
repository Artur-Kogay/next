export type PaymentCoutry = {
  id: number;
  is_enabled: boolean;
};

export type PaymentMethod = {
  code?: string;
  country?: PaymentCoutry;
  id?: number;
  image_path?: string;
  is_enabled?: boolean;
  title?: string;
};
