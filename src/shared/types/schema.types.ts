import type { BaseType } from './session.types';

export type SeatScheme = BaseType & {
  color: string;
  html_id: string;
  price: number;
  scheme_sector_id: number | null;
};

export type AreaSchema = {
  html_id: string;
  id: number;
  title: string;
};

export type Area = BaseType & {
  color: string;
  quantity: number | null;
  price: number;
  scheme_area: AreaSchema;
  left_tickets_count: number;
};

export type Sector = {
  id: number;
  title: string;
  hall_id: number;
  parent_id: number;
  html_path: string;
  sector_id: string;
  disabled: boolean;
};

export type Scheme = BaseType & {
  html_path: string;
  seats: SeatScheme[];
  areas: Area[];
  sectors: Sector[] | null;
};
