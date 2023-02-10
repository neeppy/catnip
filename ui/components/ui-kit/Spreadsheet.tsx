import ReactSpreadsheet, { ColumnIndicatorProps } from 'react-spreadsheet';
import { DatabaseRow } from 'common/models/Database';
import 'ui/assets/grid.css';

interface OwnProps {
    rows: DatabaseRow[];
}

function ColumnIndicator({ label, column, onSelect }: ColumnIndicatorProps) {
    function handleContextMenu(event: any) {
        event.preventDefault();
    }

    return (
        <th className="Spreadsheet__header" onClick={() => onSelect(column, false)} onContextMenu={handleContextMenu}>
            {label}
        </th>
    );
};

export function Spreadsheet({ rows }: OwnProps) {
    const columns = Object.keys(rows[0] ?? {});
    const dataToRender = rows.map(row => {
        return columns.map(column => ({
            value: row[column] ?? ''
        }));
    });

    function handleSelect(points: any) {
        console.log(points);
    }

    return (
        <ReactSpreadsheet
            data={dataToRender}
            columnLabels={columns}
            onSelect={handleSelect}
            ColumnIndicator={ColumnIndicator}
        />
    );
}
