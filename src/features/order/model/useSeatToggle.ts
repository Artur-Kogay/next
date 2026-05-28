'use client';

import { useCallback } from 'react';

import toast from 'react-hot-toast';

import { useAddToBasket, useRemoveFromBasket } from '../api/client';
import { setSchemeSeatColor } from '../lib/schema-utils';

import type { BasketItem, OrderItem, OrderSession } from '../api/schemas';

export function useSeatToggle(item: OrderSession, basket: BasketItem[], orderItems: OrderItem[]) {
  const addToBasket = useAddToBasket();
  const removeFromBasket = useRemoveFromBasket();

  return useCallback(
    (place: Element, sectorDbId?: number) => {
      if (!item.scheme) return;

      const seat = sectorDbId
        ? item.scheme.seats.find((s) => s.html_id === place.id && s.scheme_sector_id === sectorDbId)
        : item.scheme.seats.find((s) => s.html_id === place.id);
      if (!seat) return;

      if (basket.length) {
        const isFree = !!item.event?.is_free;
        const haveIsFree = !!basket.find((t) => t.event?.is_free);
        if (isFree !== haveIsFree) {
          toast.error('Очистите корзину и добавьте билет');
          return;
        }
      }

      const exists = basket.some((t) => t.ticket_seat_id === seat.id);
      if (exists) {
        const basketSeat = basket.find((t) => t.ticket_seat_id === seat.id);
        if (basketSeat) {
          removeFromBasket.mutate(basketSeat.id);
          setSchemeSeatColor(place as SVGGElement, seat.color);
        }
        return;
      }

      const enabled = sectorDbId
        ? !orderItems.some(
            (oi) => oi.html_id === seat.html_id && oi.scheme_sector_id === sectorDbId,
          )
        : !orderItems.some((oi) => oi.html_id === seat.html_id);
      if (!enabled) return;

      if (
        item.max_tickets_per_customer &&
        basket.filter((t) => t.event?.id === item.event.id).length >= item.max_tickets_per_customer
      ) {
        toast.error(`Лимит на покупку ${item.max_tickets_per_customer} билетов!`);
        return;
      }

      addToBasket.mutate({
        event_id: item.event.id,
        session_id: item.id,
        ticket_seat_id: seat.id,
      });
    },
    [item, basket, orderItems, addToBasket, removeFromBasket],
  );
}
