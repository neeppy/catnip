import { DatabaseColumn } from 'common/models/Database';

export interface ReadOnlyCellProps {
    currentValue?: unknown;
    column: DatabaseColumn;
}

export interface EditableCellProps {
    column: DatabaseColumn;
    currentValue?: unknown;
    className?: string;
    onChange: (value: unknown) => void;
    disableEditing: () => void;
}
