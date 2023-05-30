import { ComponentType, Ref } from 'react';
import { DatabaseColumn, QueryField } from 'common/models/Database';
import { ConnectionDriver } from 'common/models/Connection';
import { StringCell } from './StringCell';
import { EnumCell } from './EnumCell';
import { NumberCell } from './NumberCell';
import { DateTimeCell } from './DateTimeCell';

const COLUMN_TYPES = {
    [ConnectionDriver.MySQL]: {
        string: ['varchar', 'char', 'nvarchar'],
        number: ['tinyint', 'smallint', 'int', 'bigint'],
        enum: ['enum'],
        date: ['date', 'datetime'],
    },
    [ConnectionDriver.SQLite]: {
        string: ['varchar', 'char'],
        number: ['integer', 'real'],
        enum: [],
        date: ['datetime'],
    }
};

const getColumnTypesMatchingType = (type: keyof typeof COLUMN_TYPES[ConnectionDriver]) =>
    Object.keys(COLUMN_TYPES).flatMap(driver => COLUMN_TYPES[driver as keyof typeof COLUMN_TYPES][type]);

const CellTypes = [
    {
        types: getColumnTypesMatchingType('string'),
        Component: StringCell,
    },
    {
        types: getColumnTypesMatchingType('number'),
        Component: NumberCell,
    },
    {
        types: getColumnTypesMatchingType('enum'),
        Component: EnumCell,
    },
    {
        types: getColumnTypesMatchingType('date'),
        Component: DateTimeCell,
    }
];

export interface CellProps {
    column: DatabaseColumn;
    currentValue: unknown;
    isEditable: boolean;
    onChange: (value: unknown) => void;
    disableEditing: () => void;
    className?: string;
    inputRef: Ref<HTMLInputElement>;
}

export function useCellComponent(column: DatabaseColumn | QueryField): ComponentType<CellProps> {
    const { Component } = CellTypes.find(cellComponent => cellComponent.types.includes(column.type.toLowerCase())) || { Component: StringCell };

    if (!Component) {
        console.error('Expected a cell component for column', column);
        throw new Error(`Expected a cell component for column ${column.name}`);
    }

    return Component;
}
