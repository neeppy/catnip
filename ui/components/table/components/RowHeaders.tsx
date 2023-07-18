import { MouseEvent, useContext } from 'react';
import { VirtualItem } from '@tanstack/react-virtual';
import { TableContext } from '../context';
import { isBetween } from '../utils';
import { Header } from './Header';

interface RowHeadersProps {
    width: number;
    height: number;
    items: VirtualItem[];
}

export function RowHeaders({ items, width, height }: RowHeadersProps) {
    const { allRanges, range } = useContext(TableContext);

    const isActive = (index: number) => allRanges.some(range => isBetween(index, range.start.row, range.end.row));

    return (
        <div className="z-10 sticky left-0 top-0 h-full" style={{ width }}>
            {items.map(item => (
                <Header
                    key={item.key}
                    className="absolute bg-gradient-to-r inset-x-0 top-0 shadow-[inset_-1px_0_0_0]"
                    style={{ transform: `translateY(${item.start - height}px)` }}
                    width={width}
                    height={item.size}
                    text={String(item.index + 1)}
                    onClick={event => handleRowSelection(event, item.index)}
                    active={isActive(item.index)}
                />
            ))}
        </div>
    );

    function handleRowSelection(event: MouseEvent, row: number) {
        if (event.shiftKey) {
            range.expandCurrentRange(row, Infinity);
        } else {
            range.selectSingleRange(
                [row, 0],
                [row, Infinity],
                event.ctrlKey || event.metaKey
            );
        }
    }
}
