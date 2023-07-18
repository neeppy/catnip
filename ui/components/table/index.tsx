import { useEffect, useMemo, useRef } from 'react';
import { useBoolean, useCollection } from 'ui/hooks';
import { Table, TableProps } from './Table';
import { TableContext } from './context';
import { DndWrapper } from './components/DndWrapper';
import { Changes } from './components/Changes';
import { PersistenceCountdownToast } from './components/PersistenceCountdownToast';
import { useRangeCollection } from './useRangeCollection';
import { usePersistence } from './usePersistence';

export interface CellChange {
    rowIndex: number;
    column: string;
    oldValue: unknown;
    newValue: unknown;
}

export interface Change {
    row: Record<string, any>;
    column: string;
    value: any;
}

function TableWrapper({ rows, columns, onPersist }: TableProps) {
    const [allRanges, range] = useRangeCollection();
    const [allChanges, change] = useCollection<CellChange>();
    const { isManualEnabled, isScheduled, cancelScheduledPersistence } = usePersistence(allChanges, handlePersist);

    const contextValue = useMemo(() => ({
        rows,
        columns,
        allRanges,
        range,
        allChanges,
        change,
    }), [rows, columns, allChanges, allRanges]);

    return (
        <TableContext.Provider value={contextValue}>
            <DndWrapper>
                <div className="w-full h-full relative">
                    <Table rows={rows} columns={columns} />
                    {isManualEnabled && (
                        <div className="absolute right-10 bottom-10">
                            <Changes changes={allChanges} onPersist={handlePersist} />
                        </div>
                    )}
                    {isScheduled && (
                        <PersistenceCountdownToast clearChanges={clearChanges} />
                    )}
                </div>
            </DndWrapper>
        </TableContext.Provider>
    );

    async function handlePersist() {
        const mappedChanges: Change[] = allChanges.map(change => ({
            row: rows[change.rowIndex - 1],
            column: change.column,
            value: change.newValue,
        }));

        await onPersist?.(mappedChanges);
        clearChanges();
    }

    function clearChanges() {
        change.clear();
        cancelScheduledPersistence();
    }
}

export { TableWrapper as Table };
