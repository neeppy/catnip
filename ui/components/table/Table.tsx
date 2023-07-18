import { DatabaseColumn, DatabaseRow } from 'common/models/Database';
import { Row } from './components/Row';
import { ColumnHeaders } from './components/ColumnHeaders';
import { RowHeaders } from './components/RowHeaders';
import { Cell } from './components/cells/Cell';
import { useVirtualGrid } from './useVirtualGrid';

export interface TableProps {
    columns: Array<DatabaseColumn>;
    rows: DatabaseRow[];
    onPersist?: (changes: Change[]) => unknown;
}

export interface Change {
    row: Record<string, any>;
    column: string;
    value: any;
}

const ROW_HEADER_WIDTH = 60;
const ROW_HEIGHT = 40;

export function Table({
    rows,
    columns,
}: TableProps) {
    const { containerRef, virtual, spacing } = useVirtualGrid({
        rows: rows.length,
        columns: columns.length,
        verticalPaddingStart: ROW_HEIGHT,
        horizontalPaddingStart: ROW_HEADER_WIDTH,
        getRowSize: () => ROW_HEIGHT,
        getColumnSize: (idx: number) => columns[idx].name.length * 10 + 20,
    });

    return (
        <div className="w-full h-full relative overflow-auto text-foreground-default" ref={containerRef}>
            <div
                className="grid relative"
                style={{
                    width: virtual.columns.getTotalSize(),
                    height: virtual.rows.getTotalSize(),
                    gridTemplateColumns: `${ROW_HEADER_WIDTH}px 1fr`,
                    gridTemplateRows: `${ROW_HEIGHT}px 1fr`,
                }}
            >
                <div className="bg-surface-600 sticky top-0 left-0 z-20 shadow-[inset_-1px_-1px_0_0] shadow-surface-800" style={{ width: ROW_HEADER_WIDTH, height: ROW_HEIGHT }}/>
                <ColumnHeaders
                    columns={columns}
                    height={ROW_HEIGHT}
                    leftPadding={ROW_HEADER_WIDTH}
                    items={virtual.columns.getVirtualItems()}
                    spaceAfter={spacing.after}
                    spaceBefore={spacing.before}
                />
                <div className="col-span-2 flex items-start justify-start">
                    <RowHeaders width={ROW_HEADER_WIDTH} height={ROW_HEIGHT} items={virtual.rows.getVirtualItems()} />
                    <div className="flex flex-col">
                        <div style={{ height: virtual.rows.getVirtualItems()[0].start - ROW_HEIGHT }} />
                        {virtual.rows.getVirtualItems().map(row => (
                            <Row
                                key={row.key}
                                metadata={row}
                                containerRef={virtual.rows.measureElement}
                                spaceBefore={spacing.before}
                                spaceAfter={spacing.after}
                            >
                                {virtual.columns.getVirtualItems().map(column => (
                                    <Cell
                                        key={String(row.key) + String(column.key)}
                                        row={row.index}
                                        column={column.index}
                                        width={column.size}
                                        height={row.size}
                                        scrollToElement={scrollToElement}
                                    />
                                ))}
                            </Row>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    function scrollToElement(row: number, column: number) {
        if (row < 4) {
            virtual.rows.scrollToOffset(0);
        } else if (row > rows.length - 5) {
            virtual.rows.scrollToOffset(virtual.rows.getTotalSize());
        } else {
            virtual.rows.scrollToIndex(row - 5);
        }

        if (column < 3) {
            virtual.columns.scrollToOffset(0);
        } else if (column > columns.length - 4) {
            virtual.columns.scrollToOffset(virtual.columns.getTotalSize());
        } else {
            virtual.columns.scrollToIndex(column - 1);
        }
    }
}
