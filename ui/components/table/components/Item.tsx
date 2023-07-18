import { VirtualItem } from '@tanstack/react-virtual';
import { useContext } from 'react';
import { TableContext } from '../context';
import { Header } from './Header';
import { Cell } from './cells/Cell';

interface ItemProps {
    metadata: VirtualItem;
    type: 'cell' | 'row' | 'column';
    row: number;
    column: number;
}

export function Item({ type, metadata, ...rest }: ItemProps) {
    const { columns } = useContext(TableContext);

    const colName = columns.at(rest.column)?.name ?? '';

    if (type === 'column') return (
        <Header width={metadata.size} text={colName} />
    ); else return (
        <Cell width={metadata.size} {...rest} />
    );
}
