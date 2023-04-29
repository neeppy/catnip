export async function runUserQuery(connectionId: string, query: string, database?: string) {
    return interop.database.runUserQuery(connectionId, database || '', query);
}
