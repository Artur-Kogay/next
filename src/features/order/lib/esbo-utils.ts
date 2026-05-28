import { isDarken } from './schema-utils';

import type { EsboPrice, EsboSeat } from '../api/esbo-schemas';
import type { BasketItem } from '../api/schemas';

export const setSchemeSeatColorEsbo = (
  el: Element | null,
  color: string,
  selectedColor?: string,
): void => {
  if (!el) return;
  const colorSelected = !selectedColor || selectedColor === color;
  if (color === '#b5b5b5') return;

  el.classList.value = 'enabled';

  el.querySelectorAll('path').forEach((g) => {
    const box = g as SVGElement;
    box.style.fill = colorSelected ? color : 'white';
    box.style.stroke = colorSelected ? 'white' : color;
  });

  el.querySelectorAll('rect').forEach((g) => {
    const box = g as SVGElement;
    box.style.fill = colorSelected ? color : 'white';
    box.style.stroke = colorSelected ? 'white' : color;
  });

  el.querySelectorAll('.text').forEach((g) => {
    const text = g as SVGElement;
    text.style.fill = colorSelected ? (isDarken(color) ? 'white' : 'black') : color;
  });
};

type RenderEsboParams = {
  selectedColor?: string;
  esboSeats: EsboSeat[];
  pricing: EsboPrice[];
  basket: BasketItem[];
  rawHtml: string;
};

const seatSelector = (s: { sector_name: string; row_number: string; seat_number: string }) =>
  `[data-sector="${s.sector_name}"][data-row="${s.row_number}"][data-seat="${s.seat_number}"]`;

export const renderColorEsbo = ({
  selectedColor,
  basket,
  pricing,
  esboSeats,
  rawHtml,
}: RenderEsboParams): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  const svg = doc.querySelector('svg');
  if (!svg) return rawHtml;

  const orderedSeats = esboSeats.filter(
    (s) => [2, 3, 7].includes(s.ticket_status_id) && !basket.find((b) => b.outer_id === s.outer_id),
  );

  esboSeats
    .filter((s) => !orderedSeats.includes(s))
    .forEach((g) => {
      const el = svg.querySelector(seatSelector(g));
      if (!el) return;
      el.setAttribute('data-tooltip-id', 'seat-tooltip');
      const color = pricing.find((p) => p.tarifName === g.tarif_name)?.color || '#b5b5b5';
      setSchemeSeatColorEsbo(el, color, selectedColor);
    });

  orderedSeats.forEach((g) => {
    const el = svg.querySelector(seatSelector(g));
    if (el) el.classList.value = 'disabledEsbo';
  });

  svg
    .querySelector('#areas')
    ?.querySelectorAll('g')
    .forEach((area) => {
      const sectorId = area.getAttribute('data-sector');
      if (!sectorId) return;
      const seat = esboSeats.find((s) => s.sector_id === Number(sectorId));
      if (!seat) return;
      area.setAttribute('data-tooltip-id', 'area-tooltip');
      const price = pricing.find((p) => p.id === seat.tarif_id);
      if (price) {
        area.setAttribute('data-price', String(price.price));
        setSchemeSeatColorEsbo(area, price.color, selectedColor);
      }
    });

  basket.forEach((ticket) => {
    const seat = esboSeats.find((s) => s.outer_id === ticket.outer_id);
    if (!seat) return;
    const el = svg.querySelector(seatSelector(seat));
    if (el) el.classList.value = 'booked';
  });

  return svg.outerHTML;
};

export const getEsboAreaTooltip = (el: HTMLElement | null, currencyLabel: string): string => {
  const price = el?.getAttribute('data-price');
  return price ? `${Number(price).toLocaleString()} ${currencyLabel}` : '';
};

export const getEsboSeatTooltip = (
  el: HTMLElement | null,
  esboSeats: EsboSeat[],
  pricing: EsboPrice[],
  currencyLabel: string,
): string | null => {
  if (!el) return null;
  if (el.classList.contains('disabledEsbo')) return 'Занято';

  const sector = el.getAttribute('data-sector');
  const row = el.getAttribute('data-row');
  const seat = el.getAttribute('data-seat');
  const seatData = esboSeats.find(
    (s) => s.sector_name === sector && s.row_number === row && s.seat_number === seat,
  );
  const price = seatData
    ? pricing.find((p) => p.tarifName === seatData.tarif_name)?.price
    : undefined;

  return `Сектор: ${sector}, Ряд ${row}, Место ${seat}${
    price ? `, Цена: ${price.toLocaleString()} ${currencyLabel}` : ''
  }`;
};
