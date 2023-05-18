import { FaTable, FaTerminal } from '$components/icons';
import { createEmptyEditorView, createEmptyTableView } from '$module:tabs';

export const newTabContextMenuConfig = ({ connectionId, databaseName }: any) => [
    {
        key: 'create.editor',
        label: 'Editor Tab',
        icon: FaTerminal,
        onClick: () => createEmptyEditorView(connectionId, databaseName),
    },
    {
        key: 'create.table',
        label: 'Table Tab',
        icon: FaTable,
        onClick: () => createEmptyTableView(connectionId, databaseName),
    }
];
