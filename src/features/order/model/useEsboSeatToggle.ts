'use client';

import { useCallback } from 'react';

import { useAddToBasket, useRemoveFromBasket } from '../api/client';

import type { EsboSeat } from '../api/esbo-schemas';
import type { BasketItem, OrderSession } from '../api/schemas';

export function useEsboSeatToggle(item: OrderSession, basket: BasketItem[], esboSeats: EsboSeat[]) {
  const addToBasket = useAddToBasket();
  const removeFromBasket = useRemoveFromBasket();

  return useCallback(
    (place: Element) => {
      if (place.id.startsWith('seat_')) {
        const sector = place.getAttribute('data-sector');
        const row = place.getAttribute('data-row');
        const seat = place.getAttribute('data-seat');
        const seatData = esboSeats.find(
          (s) => s.seat_number === seat && s.row_number === row && s.sector_name === sector,
        );
        if (!seatData) return;

        const exists = basket.some((b) => b.outer_id === seatData.outer_id);
        if (exists) {
          removeFromBasket.mutate(seatData.outer_id);
          return;
        }

        if (!place.classList.contains('disabledEsbo')) {
          addToBasket.mutate({
            event_id: item.event.id,
            session_id: item.id,
            ticket_id: seatData.outer_id,
          });
        }
        return;
      }

      if (place.id.startsWith('area_')) {
        const sectorId = Number(place.getAttribute('data-sector'));
        if (!sectorId) return;
        addToBasket.mutate({
          event_id: item.event.id,
          session_id: item.id,
          sector_id: sectorId,
        });
      }
    },
    [item, basket, esboSeats, addToBasket, removeFromBasket],
  );
}
