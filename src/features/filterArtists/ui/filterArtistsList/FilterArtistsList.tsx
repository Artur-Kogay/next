'use client';

import { useAtom } from 'jotai';
import {useTranslations} from "next-intl";

import styles from './FilterArtistsList.module.scss';
import { selectedArtistCategoryAtom } from '../../../../shared';
import FilterCell from '../filterCell/FilterCell';


const MOCK_FILTERS = [
    { label: 'filterLinks.all', value: 'all' },
    { label: 'filterLinks.artists', value: 'artist' },
    { label: 'filterLinks.singers', value: 'singer' },
    { label: 'filterLinks.comedians', value: 'comedian' },
] as const;

function FilterArtistsList() {
    const [selectedCategory, setSelectedCategory] = useAtom(
        selectedArtistCategoryAtom
    );
    const localizer = useTranslations();

    return (
        <div className={styles.filterList}>
            {MOCK_FILTERS.map((filter) => {

                return (
                    <FilterCell
                        key={filter.value}
                        onClick={() => setSelectedCategory(filter.value)}
                        isActiveCell={selectedCategory === filter.value}
                    >
                        {localizer(filter.label)}
                    </FilterCell>
                );
            })}
        </div>
    );
}

export default FilterArtistsList;