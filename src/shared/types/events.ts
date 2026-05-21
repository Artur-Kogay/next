import type { Banner } from './banners';

export type PopularEventDetails = {
  id: number;
  image_path: string;
  is_free: boolean;
  title: string;
  is_pinned: boolean;
};

export type CategoriesWithSessions = {
  banners: Banner[];
  id: number;
  last_sessions: Session[];
  title: string;
  slug: string;
};

export type Session = {
  date_time: string;
  event: {
    id: number;
    image_path: string;
    is_free: boolean;
    title: string;
    is_pinned: boolean;
  };
  id: number;
  is_informational: boolean;
  left_tickets_count: number;
  max_tickets_per_customer: number;
  min_price: number;
  slug: string;
  theater: {
    id: number;
    title: string;
  };
};

export type PopularEvents = {
  event: PopularEventDetails;
  id: number;
  is_informational: boolean;
  left_tickets_count: number;
  max_tickets_per_customer: number;
  min_price: number;
  slug: string;
  theater: {
    id: number;
    title: string;
  };
  date_time: string;
};
