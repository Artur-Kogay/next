'use client';

import { type MouseEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useAtomValue } from 'jotai';
import { IoClose } from 'react-icons/io5';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import styles from './SectorSchemaModal.module.scss';
import { type SectorSchemaModalProps } from './SectorSchemaModal.types';
import { useSectorSchemaHtml } from '../../api/client';
import { getSchemePlace, renderColors } from '../../lib/schema-utils';
import { selectedColorAtom } from '../../model/atoms';
import { useSeatToggle } from '../../model/useSeatToggle';
import { SeatTooltip } from '../SeatTooltip/SeatTooltip';

export function SectorSchemaModal({
  isOpen,
  sector,
  item,
  basket,
  orderItems,
  onClose,
}: SectorSchemaModalProps) {
  const schemaRef = useRef<HTMLDivElement>(null);
  const selectedColor = useAtomValue(selectedColorAtom);
  const fetchSectorHtml = useSectorSchemaHtml();
  const toggleSeat = useSeatToggle(item, basket, orderItems);

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
    if (!sectorHtml || !sector?.id) return;

    const colored = renderColors({
      currentSectorId: sector.id,
      item,
      basket,
      orderItems,
      selectedColor,
      rawHtml: sectorHtml,
    });

    if (schemaRef.current) {
      schemaRef.current.innerHTML = colored;
    }
  }, [sectorHtml, basket, item, orderItems, sector?.id, selectedColor]);

  const onClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const place = getSchemePlace(ev.target as Element);
      if (!place || !place.id.startsWith('seat_')) return;

      const sectorDbId = item.scheme?.sectors.find((s) => s.sector_id === sector?.id)?.id;
      toggleSeat(place, sectorDbId);
    },
    [item.scheme?.sectors, sector?.id, toggleSeat],
  );

  if (!isOpen) return null;

  return (
    <div className={styles.sectorModal}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className={styles.sectorOverlay} onClick={onClose} />
      <div className={styles.sectorContent}>
        <div className={styles.sectorHeader}>
          <span className={styles.sectorTitle}>
            {sector?.title?.startsWith('Сектор') ? sector.title : `Сектор ${sector?.title}`}
          </span>
          <button type="button" className={styles.sectorClose} onClick={onClose}>
            <IoClose size={28} />
          </button>
        </div>
        <div className={styles.sectorSchema}>
          {loading ? (
            <div className={styles.sectorLoading}>Загрузка...</div>
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
              <SeatTooltip item={item} sectorId={sector?.id} />
            </TransformWrapper>
          )}
        </div>
      </div>
    </div>
  );
}
