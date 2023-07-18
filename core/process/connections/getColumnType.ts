import { ConnectionDriver } from 'common/models/Connection';
import { ColumnType } from 'common/models/Database';

const COLUMN_TYPE_MAP = {
    [ConnectionDriver.MySQL]: {
        [ColumnType.Boolean]: ['bit(1)', 'tinyint(1)'],
        [ColumnType.String]: ['varchar', 'char', 'nvarchar'],
        [ColumnType.Number]: ['tinyint', 'smallint', 'int', 'bigint', 'decimal', 'numeric'],
        [ColumnType.Enum]: ['enum'],
        [ColumnType.Date]: ['date'],
        [ColumnType.DateTime]: ['datetime', 'timestamp'],
        [ColumnType.Text]: ['text'],
    },
    [ConnectionDriver.SQLite]: {
        [ColumnType.String]: ['varchar', 'char', 'nvarchar'],
        [ColumnType.Number]: ['integer', 'real', 'numeric'],
        [ColumnType.Enum]: [],
        [ColumnType.Date]: ['date'],
        [ColumnType.DateTime]: ['datetime'],
        [ColumnType.Text]: ['text'],
        [ColumnType.Boolean]: [],
    }
};

export function getColumnType(driver: ConnectionDriver, rawType: string): ColumnType {
    const driverTypes = COLUMN_TYPE_MAP[driver];

    const type = Object.keys(driverTypes)
        .find(type => driverTypes[type].some(sqlColumnType => rawType.toLowerCase().includes(sqlColumnType)));

    if (!type) {
        throw new Error(`Cell has an invalid type: "${rawType}". Using driver "${driver}".`);
    }

    return type as ColumnType;
}
