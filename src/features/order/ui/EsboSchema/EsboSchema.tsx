'use client';

import { type MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { currency } from '@/shared/config';

import { SectorSchemaEsboModal } from './SectorSchemaEsboModal';
import { getEsboAreaTooltip, getEsboSeatTooltip, renderColorEsbo } from '../../lib/esbo-utils';
import { getSchemePlace } from '../../lib/schema-utils';
import { selectedColorAtom } from '../../model/atoms';
import { useEsboSeatToggle } from '../../model/useEsboSeatToggle';
import { PriceChips } from '../Schema/PriceChips';
import schemaStyles from '../Schema/Schema.module.scss';
import { SideButtons } from '../Schema/SideButtons';

import type { EsboPrice, EsboSeat } from '../../api/esbo-schemas';
import type { BasketItem, OrderSession } from '../../api/schemas';
import type { SectorState } from '../Schema/types';

interface EsboSchemaProps {
  item: OrderSession;
  schemaHtml: string;
  esboPricing: EsboPrice[];
  esboSeats: EsboSeat[];
  basket: BasketItem[];
}

export const EsboSchema = ({
  item,
  schemaHtml,
  esboPricing,
  esboSeats,
  basket,
}: EsboSchemaProps) => {
  const selectedColor = useAtomValue(selectedColorAtom);
  const toggle = useEsboSeatToggle(item, basket, esboSeats);

  const [currentSector, setCurrentSector] = useState<SectorState>();
  const [isSectorOpen, setIsSectorOpen] = useState(false);

  const prices = useMemo(
    () => esboPricing.map((p) => ({ color: p.color, price: p.price })),
    [esboPricing],
  );

  const processedHtml = useMemo(
    () =>
      renderColorEsbo({
        esboSeats,
        pricing: esboPricing,
        selectedColor,
        basket,
        rawHtml: schemaHtml,
      }),
    [esboSeats, esboPricing, selectedColor, basket, schemaHtml],
  );

  useEffect(() => {
    if (currentSector?.id) setIsSectorOpen(true);
  }, [currentSector]);

  const onClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const clicked = ev.target as HTMLElement;

      if (basket.length && basket.some((t) => t.event?.id !== item.event.id)) {
        toast.error('Вы не можете забронировать места из разных мероприятий');
        return;
      }

      if (item.scheme?.sectors?.length) {
        const id = clicked.parentElement?.id.startsWith('sector')
          ? clicked.parentElement.id
          : (clicked.parentElement?.parentElement?.id ?? '');

        if (id.startsWith('sector')) {
          setCurrentSector({
            id,
            title:
              clicked.closest('g[id^="sector_"][data-title]')?.getAttribute('data-title') || '',
          });
          return;
        }
      }

      const place = getSchemePlace(clicked);
      if (place) toggle(place);
    },
    [basket, item, toggle],
  );

  const closeSector = useCallback(() => {
    setIsSectorOpen(false);
    setCurrentSector(undefined);
  }, []);

  return (
    <>
      <PriceChips prices={prices} />

      <SectorSchemaEsboModal
        isOpen={isSectorOpen}
        sector={currentSector}
        item={item}
        basket={basket}
        esboSeats={esboSeats}
        esboPricing={esboPricing}
        onClose={closeSector}
      />

      <div className={schemaStyles.wrapper}>
        <TransformWrapper minScale={0.8} initialScale={1} maxScale={8} centerZoomedOut centerOnInit>
          <SideButtons />
          {!currentSector && (
            <Tooltip
              id="seat-tooltip"
              className={schemaStyles.tooltip}
              render={({ activeAnchor }) => {
                const text = getEsboSeatTooltip(
                  activeAnchor,
                  esboSeats,
                  esboPricing,
                  currency.label,
                );
                if (!text) return null;
                return <span className={schemaStyles.tooltipText}>{text}</span>;
              }}
            />
          )}
          <Tooltip
            id="area-tooltip"
            className={schemaStyles.tooltip}
            render={({ activeAnchor }) => (
              <span className={schemaStyles.tooltipText}>
                {getEsboAreaTooltip(activeAnchor, currency.label)}
              </span>
            )}
          />
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
