import { MouseEvent, useContext } from 'react';
import { VirtualItem } from '@tanstack/react-virtual';
import { DatabaseColumn } from 'common/models/Database';
import { Header } from './Header';
import { TableContext } from '../context';
import { isBetween } from '../utils';

interface ColumnHeaderProps {
    columns: DatabaseColumn[];
    height: number;
    leftPadding: number;
    items: VirtualItem[];
    spaceBefore: number;
    spaceAfter: number;
}

export function ColumnHeaders({ items, columns, height, leftPadding }: ColumnHeaderProps) {
    const { allRanges, range } = useContext(TableContext);
    const spaceBefore = items[0].start;

    const isActive = (index: number) => allRanges.some(range => isBetween(index, range.start.column, range.end.column));

    return (
        <div className="sticky left-0 top-0 flex z-10" style={{ height }}>
            {spaceBefore > leftPadding && (
                <div style={{ width: spaceBefore - leftPadding }} />
            )}
            {items.map(item => (
                <Header
                    key={item.key}
                    className="shadow-[inset_0_-1px_0_0]"
                    width={item.size}
                    text={columns[item.index]?.name ?? ''}
                    onClick={(event) => handleColumnSelection(event, item.index)}
                    active={isActive(item.index)}
                />
            ))}
        </div>
    );

    function handleColumnSelection(event: MouseEvent, column: number) {
        if (event.shiftKey) {
            range.expandCurrentRange(Infinity, column);
        } else {
            range.selectSingleRange(
                [0, column],
                [Infinity, column],
                event.ctrlKey || event.metaKey
            );
        }
    }
}
