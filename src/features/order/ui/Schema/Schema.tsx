'use client';

import { type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { PriceFilter } from './PriceFilter';
import styles from './Schema.module.scss';
import { SchemeTooltips } from './SchemeTooltips';
import { SectorSchemaModal } from './SectorSchemaModal';
import { SideButtons } from './SideButtons';
import { useAddToBasket } from '../../api/client';
import {
  filterSectorsByColor,
  getSchemePlace,
  getTrueSectors,
  hideSectorsWithoutPrice,
  renderColors,
} from '../../lib/schema-utils';
import { selectedColorAtom } from '../../model/atoms';
import { useSeatToggle } from '../../model/useSeatToggle';

import type { SectorState } from './types';
import type { BasketItem, OrderItem, OrderSession } from '../../api/schemas';

type SchemaProps = {
  item: OrderSession;
  orderItems: OrderItem[];
  schemaHtml: string;
  basket: BasketItem[];
};

export const Schema = ({ item, orderItems, schemaHtml, basket }: SchemaProps) => {
  const selectedColor = useAtomValue(selectedColorAtom);
  const addToBasket = useAddToBasket();
  const toggleSeat = useSeatToggle(item, basket, orderItems);

  const [currentSector, setCurrentSector] = useState<SectorState>();
  const [isSectorOpen, setIsSectorOpen] = useState(false);
  const [areasCount, setAreasCount] = useState<Record<string, number>>({});

  const processedHtml = useMemo(() => {
    if (!item || !orderItems) return schemaHtml;

    let html = renderColors({
      item,
      orderItems,
      selectedColor,
      basket,
      currentSectorId: currentSector?.id,
      rawHtml: schemaHtml,
    });

    if (item.scheme?.sectors?.length) {
      html = getTrueSectors(item, html);
      html = hideSectorsWithoutPrice(item, html);
      html = filterSectorsByColor(item, orderItems, selectedColor || null, html);
    }

    return html;
  }, [item, orderItems, selectedColor, basket, currentSector?.id, schemaHtml]);

  useEffect(() => {
    if (currentSector?.id) setIsSectorOpen(true);
  }, [currentSector]);

  useEffect(() => {
    if (!item?.scheme) return;
    const counts: Record<string, number> = {};
    item.scheme.areas.forEach((area) => {
      counts[area.scheme_area.html_id] = area.left_tickets_count;
    });
    setAreasCount(counts);
  }, [item]);

  const addArea = useCallback(
    (place: Element) => {
      if (areasCount[place.id] === 0) {
        toast.error('Места в этой зоне закончились');
        return;
      }
      const area = item.scheme?.areas.find((a) => a.scheme_area.html_id === place.id);
      if (!area) return;

      if (
        item.max_tickets_per_customer &&
        basket.filter((t) => t.event?.id === item.event.id).length >= item.max_tickets_per_customer
      ) {
        toast.error(`Лимит на покупку ${item.max_tickets_per_customer} билетов!`);
        return;
      }

      addToBasket.mutate({ event_id: item.event.id, session_id: item.id, ticket_area_id: area.id });
      setAreasCount((prev) => ({ ...prev, [place.id]: (prev[place.id] ?? 0) - 1 }));
    },
    [areasCount, item, basket, addToBasket],
  );

  const onClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const clickedItem = ev.target as HTMLElement;

      if (basket.length && basket.some((t) => t.event?.id !== item.event.id)) {
        toast.error('Вы не можете забронировать места из разных мероприятий');
        return;
      }

      if (item.scheme?.sectors?.length) {
        const id = clickedItem.parentElement?.id.startsWith('sector')
          ? clickedItem.parentElement.id
          : (clickedItem.parentElement?.parentElement?.id ?? '');

        if (id.startsWith('sector')) {
          setCurrentSector({
            id,
            title:
              clickedItem.closest('g[id^="sector_"][data-title]')?.getAttribute('data-title') || '',
          });
          return;
        }
      }

      const place = getSchemePlace(clickedItem);
      if (!place) return;

      if (place.id.startsWith('seat_')) {
        toggleSeat(place);
      } else if (place.id.startsWith('area_')) {
        addArea(place);
      }
    },
    [basket, item, toggleSeat, addArea],
  );

  const closeSector = useCallback(() => {
    setIsSectorOpen(false);
    setCurrentSector(undefined);
  }, []);

  return (
    <>
      <PriceFilter item={item} orderItems={orderItems} />

      <SectorSchemaModal
        isOpen={isSectorOpen}
        sector={currentSector}
        item={item}
        basket={basket}
        orderItems={orderItems}
        onClose={closeSector}
      />

      <div className={styles.wrapper}>
        <TransformWrapper minScale={0.8} initialScale={1} maxScale={8} centerZoomedOut centerOnInit>
          <SideButtons />
          <SchemeTooltips item={item} areasCount={areasCount} showSeat={!currentSector} />
          <TransformComponent
            wrapperStyle={{ height: '100%', width: '100%' }}
            contentStyle={{ height: '100%', width: '100%' }}
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div
              onClick={onClick}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
              className="scheme-container"
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </>
  );
};
