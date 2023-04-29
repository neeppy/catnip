const advancedDbNames = [
    'information_schema',
    'mysql',
    'performance_schema',
    'sys'
];

export async function getTablesList(connectionId: string, database?: string, isMultiDatabase?: boolean) {
    if (!connectionId) return [];
    if (!database && isMultiDatabase) return [];

    return interop.database.fetchTableNames(connectionId, database || '');
}

export async function getDatabaseList(connectionId: string, isAdvanced: boolean = false) {
    if (!connectionId) {
        return [];
    }

    const databases = await interop.connections.listDatabases(connectionId);

    if (!isAdvanced) {
        return databases.filter(db => !advancedDbNames.includes(db));
    }

    return databases;
}

export async function getTableColumns(connectionId: string, database: string, table: string) {
    return interop.database.fetchTableColumns(connectionId, database, table);
}

export async function getTableRows(connectionId: string, database: string | null, table: string) {
    return interop.database.fetchTableContent(connectionId, database, table);
}
