export const COLUMN_TYPES = {
    0x00: 'DECIMAL', // aka DECIMAL
    0x01: 'TINY', // aka TINYINT, 1 byte
    0x02: 'SHORT', // aka SMALLINT, 2 bytes
    0x03: 'LONG', // aka INT, 4 bytes
    0x04: 'FLOAT', // aka FLOAT, 4-8 bytes
    0x05: 'DOUBLE', // aka DOUBLE, 8 bytes
    0x06: 'NULL', // NULL (used for prepared statements, I think)
    0x07: 'TIMESTAMP', // aka TIMESTAMP
    0x08: 'LONGLONG', // aka BIGINT, 8 bytes
    0x09: 'INT24', // aka MEDIUMINT, 3 bytes
    0x0a: 'DATE', // aka DATE
    0x0b: 'TIME', // aka TIME
    0x0c: 'DATETIME', // aka DATETIME
    0x0d: 'YEAR', // aka YEAR, 1 byte (don't ask)
    0x0e: 'NEWDATE', // aka ?
    0x0f: 'VARCHAR', // aka VARCHAR (?)
    0x10: 'BIT', // aka BIT, 1-8 byte
    0xf5: 'JSON',
    0xf6: 'NEWDECIMAL', // aka DECIMAL
    0xf7: 'ENUM', // aka ENUM
    0xf8: 'SET', // aka SET
    0xf9: 'TINY_BLOB', // aka TINYBLOB, TINYTEXT
    0xfa: 'MEDIUM_BLOB', // aka MEDIUMBLOB, MEDIUMTEXT
    0xfb: 'LONG_BLOB', // aka LONGBLOG, LONGTEXT
    0xfc: 'BLOB', // aka BLOB, TEXT
    0xfd: 'VAR_STRING', // aka VARCHAR, VARBINARY
    0xfe: 'STRING', // aka CHAR, BINARY
    0xff: 'GEOMETRY' // aka GEOMETRY
} as const;
