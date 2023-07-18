import { createContext } from 'react';
import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import { useCollection } from 'ui/hooks';
import { Range, useRangeCollection } from './useRangeCollection';
import { CellChange } from '.';

interface TableContext {
    rows: DatabaseRow[];
    columns: DatabaseColumn[];
    allRanges: Range[];
    allChanges: CellChange[];
    change: ReturnType<typeof useCollection<CellChange>>['1'];
    range: ReturnType<typeof useRangeCollection>['1'];
}

export const TableContext = createContext<TableContext>({
    rows: [],
    columns: [],
    allRanges: [],
    allChanges: [],
    change: {
        push: () => null,
        drop: () => null,
        update: () => null,
        clear: () => null,
    },
    range: {
        create: () => null,
        update: () => null,
        reset: () => null,
        selectSingleCell: () => null,
        selectSingleRange: () => null,
        expandCurrentRange: () => null,
    },
});
