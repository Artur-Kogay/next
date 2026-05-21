import type { BaseType } from './session.types';

export type Theater = {
  address: TheaterAddress;
  title: string;
  region: TheaterRegion;
  theater_type: TheaterType;
};

export type TheaterAddress = BaseType & {
  title: string;
  location_lat?: number;
  location_lng?: number;
};

export type TheaterRegion = BaseType & {
  title: string;
};

export type TheaterType = BaseType & {
  title: string;
};
