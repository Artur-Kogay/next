'use client';

import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useAtomValue } from 'jotai';
import { IoClose } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { currency } from '@/shared/config';

import { useSectorSchemaHtml } from '../../api/client';
import { getEsboSeatTooltip, renderColorEsbo } from '../../lib/esbo-utils';
import { getSchemePlace } from '../../lib/schema-utils';
import { selectedColorAtom } from '../../model/atoms';
import { useEsboSeatToggle } from '../../model/useEsboSeatToggle';
import schemaStyles from '../Schema/Schema.module.scss';

import type { EsboPrice, EsboSeat } from '../../api/esbo-schemas';
import type { BasketItem, OrderSession } from '../../api/schemas';
import type { SectorState } from '../Schema/types';

interface SectorSchemaEsboModalProps {
  isOpen: boolean;
  sector: SectorState | undefined;
  item: OrderSession;
  basket: BasketItem[];
  esboSeats: EsboSeat[];
  esboPricing: EsboPrice[];
  onClose: () => void;
}

export function SectorSchemaEsboModal({
  isOpen,
  sector,
  item,
  basket,
  esboSeats,
  esboPricing,
  onClose,
}: SectorSchemaEsboModalProps) {
  const schemaRef = useRef<HTMLDivElement>(null);
  const selectedColor = useAtomValue(selectedColorAtom);
  const fetchSectorHtml = useSectorSchemaHtml();
  const toggle = useEsboSeatToggle(item, basket, esboSeats);

  const [loading, setLoading] = useState(false);
  const [sectorHtml, setSectorHtml] = useState('');

  useEffect(() => {
    if (!sector?.id || !isOpen) return;
    setLoading(true);
    const htmlPath = item.scheme?.sectors?.find((s) => s.sector_id === sector.id)?.html_path;
    if (!htmlPath) {
      setLoading(false);
      return;
    }
    void fetchSectorHtml(htmlPath).then((html) => {
      setSectorHtml(html);
      setLoading(false);
    });
  }, [sector?.id, isOpen, item.scheme?.sectors, fetchSectorHtml]);

  useEffect(() => {
    if (!sectorHtml) return;
    const colored = renderColorEsbo({
      esboSeats,
      pricing: esboPricing,
      selectedColor,
      basket,
      rawHtml: sectorHtml,
    });
    if (schemaRef.current) {
      schemaRef.current.innerHTML = colored;
    }
  }, [sectorHtml, basket, esboSeats, esboPricing, selectedColor]);

  const onClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const place = getSchemePlace(ev.target as Element);
      if (place) toggle(place);
    },
    [toggle],
  );

  if (!isOpen) return null;

  return (
    <div className={schemaStyles.sectorModal}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={schemaStyles.sectorOverlay} onClick={onClose} />
      <div className={schemaStyles.sectorContent}>
        <div className={schemaStyles.sectorHeader}>
          <span className={schemaStyles.sectorTitle}>
            {sector?.title?.startsWith('Сектор') ? sector.title : `Сектор ${sector?.title}`}
          </span>
          <button type="button" className={schemaStyles.sectorClose} onClick={onClose}>
            <IoClose size={28} />
          </button>
        </div>
        <div className={schemaStyles.sectorSchema}>
          {loading ? (
            <div className={schemaStyles.sectorLoading}>Загрузка...</div>
          ) : (
            <TransformWrapper minScale={0.8} initialScale={1} maxScale={8} centerOnInit>
              <TransformComponent
                wrapperStyle={{ height: '100%', width: '100%' }}
                contentStyle={{ height: '100%', width: '100%' }}
              >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div
                  onClick={onClick}
                  ref={schemaRef}
                  className="scheme-container-sector scheme-container"
                />
              </TransformComponent>
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
            </TransformWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
