import { OptionType } from 'ui-kit';
import { FaTable, FaTerminal } from 'react-icons/fa';
import { createEmptyEditorView, createEmptyTableView } from 'ui/components/tabs';

export const newTabContextMenuConfig = [
    {
        key: 'create.editor',
        label: 'Editor Tab',
        icon: FaTerminal,
        onClick: ({ props }) => createEmptyEditorView(props.connectionId, props.databaseName),
    },
    {
        key: 'create.table',
        label: 'Table Tab',
        icon: FaTable,
        onClick: ({ props }) => createEmptyTableView(props.connectionId, props.databaseName),
    }
] as OptionType[];
