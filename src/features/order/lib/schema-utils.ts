import type { OrderSession, BasketItem, OrderItem } from '../api/schemas';

export const isDarken = (color: string): boolean => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return brightness < 0.5;
};

export const getSchemePlace = (el: Element | null): Element | null => {
  if (!el) return null;

  if ((el.id || '').startsWith('seat_') || (el.id || '').startsWith('area_')) {
    return el;
  }

  let parentId = (el.parentNode as HTMLElement)?.id || '';
  if (parentId.startsWith('seat_') || parentId.startsWith('area_')) {
    return el.parentNode as Element;
  }

  parentId = ((el.parentNode as HTMLElement)?.parentNode as HTMLElement)?.id || '';
  if (parentId.startsWith('seat_') || parentId.startsWith('area_')) {
    return (el.parentNode as HTMLElement).parentNode as Element;
  }

  return null;
};

export const setSchemeSeatColor = (
  el: SVGGElement | null,
  color: string,
  selectedColor?: string,
): void => {
  if (!el) return;

  const colorSelected = !selectedColor || selectedColor === color;

  el.classList.value = 'enabled';
  el.querySelectorAll('.box').forEach((g) => {
    const box = g as SVGElement;
    box.style.fill = colorSelected ? color : 'transparent';
    box.style.stroke = colorSelected ? 'transparent' : color;
  });

  el.querySelectorAll('.text').forEach((g) => {
    const text = g as SVGElement;
    text.style.fill = colorSelected ? (isDarken(color) ? 'white' : 'black') : color;
  });
};

export const setSchemeAreaColor = (
  el: SVGGElement | null,
  color: string,
  selectedColor?: string,
): void => {
  if (!el) return;

  const colorSelected = !selectedColor || selectedColor === color;

  el.classList.value = 'enabled';
  el.querySelectorAll('.box').forEach((g) => {
    const box = g as SVGElement;
    box.style.fill = colorSelected ? color : 'rgba(0, 0, 0, .1)';
    box.style.strokeWidth = '0px';
  });

  el.querySelectorAll('.text').forEach((g) => {
    const text = g as SVGElement;
    text.style.fill = 'white';
  });
};

type RenderColorsParams = {
  currentSectorId?: string;
  selectedColor?: string;
  item: OrderSession;
  orderItems: OrderItem[];
  basket: BasketItem[];
  rawHtml: string;
};

export const renderColors = ({
  currentSectorId,
  selectedColor,
  item,
  orderItems,
  basket,
  rawHtml,
}: RenderColorsParams): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');
  const svg = doc.querySelector('svg');

  if (!item.scheme || !svg) return rawHtml;

  if (!currentSectorId || !currentSectorId.startsWith('sector')) {
    item.scheme.seats.forEach((seat) => {
      const el = svg.querySelector(`#${seat.html_id}`) as SVGGElement;
      if (el) {
        el.setAttribute('data-tooltip-id', 'seat-tooltip');
        setSchemeSeatColor(el, seat.color, selectedColor);
      }
    });

    item.scheme.areas.forEach((area) => {
      const el = svg.querySelector(`#${area.scheme_area.html_id}`) as SVGGElement;
      if (el) {
        el.setAttribute('data-tooltip-id', 'area-tooltip');
        setSchemeAreaColor(el, area.color, selectedColor);
        if (area.left_tickets_count === 0) {
          el.classList.value = 'disabled';
          el.querySelectorAll('.box').forEach((g) => {
            const box = g as SVGElement;
            box.style.fill = 'rgba(0,0,0,0.1)';
            box.style.strokeWidth = '0px';
          });
        }
      }
    });

    orderItems
      .filter((g) => g.ticket_seat_id && g.html_id)
      .forEach((g) => {
        const isInBasket = basket.find((b) => b.ticket_seat_id === g.ticket_seat_id);
        if (!isInBasket) {
          const el = svg.querySelector(`#${g.html_id}`);
          if (el) el.classList.value = 'disabled';
        }
      });

    basket.forEach((ticket) => {
      const seat = item.scheme!.seats.find((g) => g.id === ticket.ticket_seat_id);
      if (seat) {
        const el = svg.querySelector(`#${seat.html_id}`);
        if (el) el.classList.value = 'booked';
      }
    });
  } else {
    const sector = item.scheme.sectors.find((s) => s.sector_id === currentSectorId);
    if (!sector) return rawHtml;

    const schemeSeats = item.scheme.seats.filter((seat) => seat.scheme_sector_id === sector.id);

    schemeSeats.forEach((seat) => {
      const isInBasket = basket.find((b) => b.ticket_seat_id === seat.id);
      const el = svg.querySelector(`#${seat.html_id}`) as SVGGElement;
      if (el) {
        el.setAttribute('data-tooltip-id', 'seat-tooltip');
        if (isInBasket) {
          el.classList.value = 'booked';
        } else {
          setSchemeSeatColor(el, seat.color, selectedColor);
        }
      }
    });

    orderItems
      .filter((g) => g.scheme_sector_id === sector.id && g.ticket_seat_id && g.html_id)
      .forEach((g) => {
        const el = svg.querySelector(`#${g.html_id}`);
        if (el) {
          const isInBasket = basket.find((b) => b.id === g.id);
          el.classList.value = isInBasket ? 'booked' : 'disabled';
        }
      });

    item.scheme.areas.forEach((area) => {
      const el = svg.querySelector(`#${area.scheme_area.html_id}`) as SVGGElement;
      if (el) {
        el.setAttribute('data-tooltip-id', 'area-tooltip');
        setSchemeAreaColor(el, area.color, selectedColor);
        if (area.left_tickets_count === 0) {
          el.classList.value = 'disabled';
          el.querySelectorAll('.box').forEach((g) => {
            const box = g as SVGElement;
            box.style.fill = 'rgba(0,0,0,0.1)';
            box.style.strokeWidth = '0px';
          });
        }
      }
    });
  }

  return svg.outerHTML;
};

export const getTrueSectors = (item: OrderSession, rawHtml: string): string => {
  if (!item.scheme?.sectors?.length || !rawHtml) return rawHtml;

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'image/svg+xml');
  const sectorsGroup = doc.getElementById('sectors');
  if (!sectorsGroup) return rawHtml;

  const validSectorIds = item.scheme.sectors.map((s) => s.sector_id);

  for (const sector of sectorsGroup.children) {
    if (!validSectorIds.includes(sector.id)) {
      sector.setAttribute('class', 'disabledSector');
    }
  }

  return new XMLSerializer().serializeToString(doc);
};

export const hideSectorsWithoutPrice = (item: OrderSession, html: string): string => {
  if (!item.scheme?.sectors?.length || !item.scheme?.seats?.length) return html;

  const sectorsWithPriceIds = new Set(item.scheme.seats.map((seat) => seat.scheme_sector_id));

  const sectorsToDisable = item.scheme.sectors.filter(
    (sector) => !sectorsWithPriceIds.has(sector.id),
  );

  let modifiedHtml = html;
  for (const sector of sectorsToDisable) {
    const regex = new RegExp(`(<g[^>]*id="${sector.sector_id}"[^>]*)(class="[^"]*")?`, 'i');
    modifiedHtml = modifiedHtml.replace(regex, (_, gStart) => {
      return `${gStart} class="disabledSector"`;
    });
  }

  return modifiedHtml;
};

export const filterSectorsByColor = (
  item: OrderSession,
  orderItems: OrderItem[],
  selectedColor: string | null,
  rawHtml: string,
): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!item.scheme?.sectors?.length || !svg) return rawHtml;

  if (selectedColor) {
    const seats = item.scheme.seats.filter((seat) => seat.color === selectedColor);
    if (!seats.length) return svg.outerHTML;

    for (const sector of item.scheme.sectors) {
      const orderSectorItems = orderItems.filter((oi) => oi.scheme_sector_id === sector.id);
      const seatsWithoutOrders = seats.filter(
        (seat) => !orderSectorItems.find((oi) => oi.html_id === seat.html_id),
      );
      const hasAvailableSeat = seatsWithoutOrders.find(
        (seat) => Number(seat.scheme_sector_id) === sector.id,
      );

      if (!hasAvailableSeat) {
        const el = svg.querySelector(`#${sector.sector_id}`);
        if (el) el.classList.value = 'disabledSectorImportant';
      }
    }

    return svg.outerHTML;
  }

  for (const sector of item.scheme.sectors) {
    const sectorSeats = item.scheme.seats.filter(
      (seat) => Number(seat.scheme_sector_id) === sector.id,
    );
    const orderItemsSector = orderItems.filter((oi) => oi.scheme_sector_id === sector.id);
    const freeSeats = sectorSeats.filter(
      (seat) => !orderItemsSector.find((oi) => oi.html_id === seat.html_id),
    );

    if (freeSeats.length === 0) {
      const el = svg.querySelector(`#${sector.sector_id}`);
      if (el) el.classList.value = 'disabledSectorImportant';
    }
  }

  return svg.outerHTML;
};

export const normalizePrices = (
  item: OrderSession,
  orderItems: OrderItem[],
): { color: string; price: number }[] => {
  const p: { color: string; price: number }[] = [];

  if (!item.scheme) return p;

  item.scheme.areas.forEach((e) => {
    if (p.findIndex((g) => g.color === e.color) === -1) {
      p.push({ color: e.color, price: e.price });
    }
  });

  item.scheme.seats.forEach((e) => {
    if (item.scheme?.sectors?.length) {
      if (p.findIndex((g) => g.color === e.color) === -1) {
        p.push({ color: e.color, price: e.price });
      }
    } else {
      if (
        p.findIndex((g) => g.color === e.color) === -1 &&
        !orderItems?.find((oi) => oi.html_id === e.html_id)
      ) {
        p.push({ color: e.color, price: e.price });
      }
    }
  });

  return p.sort((a, b) => a.price - b.price);
};

export const generateTooltipText = (
  element: HTMLElement | null,
  item: OrderSession,
  sectorId?: string,
): string | null => {
  if (!element) return null;
  if (element.classList.contains('disabled')) return 'Занято';
  if (!item.scheme) return null;

  const sectorData = item.scheme.sectors.find((s) => s.sector_id === sectorId);
  const seatData = sectorData
    ? item.scheme.seats.find(
        (s) => s.html_id === element.id && s.scheme_sector_id === sectorData.id,
      )
    : item.scheme.seats.find((s) => s.html_id === element.id);

  const sector = element.getAttribute('data-sector');
  const row = element.getAttribute('data-row');
  const seat = element.getAttribute('data-seat');
  const type = element.getAttribute('data-type');
  const seatsCount = element.getAttribute('data-count');
  const price = seatData ? seatData.price.toLocaleString() : '';

  return `Сектор: ${sector}, ${type === 'table' ? 'Стол ' + row : 'Ряд ' + row}, ${
    type === 'table' ? 'Количество мест: ' + seatsCount : 'Место ' + seat
  }${price ? `, Цена: ${price}` : ''}`;
};

export const generateAreaTooltipText = (
  element: HTMLElement | null,
  areasCount?: Record<string, number>,
): string => {
  let leftTickets = '';
  if (areasCount && element?.id) {
    leftTickets = String(areasCount[element.id]);
  }
  return `Осталось мест: ${leftTickets}`;
};

export const hasMixedEventsInBasket = (basket: BasketItem[], eventId: number): boolean =>
  basket.length > 0 && basket.some((t) => t.event?.id !== eventId);

export const getClickedSector = (
  clicked: HTMLElement,
  item: OrderSession,
): { id: string; title: string } | null => {
  if (!item.scheme?.sectors?.length) return null;

  const id = clicked.parentElement?.id.startsWith('sector')
    ? clicked.parentElement.id
    : (clicked.parentElement?.parentElement?.id ?? '');

  if (!id.startsWith('sector')) return null;

  return {
    id,
    title: clicked.closest('g[id^="sector_"][data-title]')?.getAttribute('data-title') || '',
  };
};
