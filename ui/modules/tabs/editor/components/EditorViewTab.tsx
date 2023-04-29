import * as monaco from 'monaco-editor';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import classnames from 'classnames';
import { FaDatabase, FaPlay } from 'react-icons/fa';
import { ConnectionDriver } from 'common/models/Connection';
import { Button, DropdownSelect, Spreadsheet, Editor } from '$components';
import { useBoolean } from 'ui/hooks';
import { appModeState } from '$module:globals';
import { useConnections } from '$module:connections';
import { getDatabaseList } from '$module:tabs/tables';
import { EditorView, updateTabs, useTabActivity } from '$module:tabs';
import { runUserQuery } from '../queries';
import { getCurrentQueries } from '../utils';
import { EditorCommands } from './EditorCommands';

interface IMutationData {
    connectionId: string;
    database: string;
    query: string;
}

export function EditorViewTab(tab: EditorView) {
    const connection = useConnections(state => state.currentActiveConnection!);
    const [isAdvanced] = useAtom(appModeState);
    const updateCurrentTab = useTabActivity(state => state.updateCurrentTabDetails);
    const { boolean: isEditorFocused, on, off } = useBoolean(true);

    const { data: databases } = useQuery<string[]>(['databases', tab.connectionId, isAdvanced], () => getDatabaseList(tab.connectionId, isAdvanced));
    const { data: queryResult, ...mutation } = useMutation({
        mutationKey: ['query', tab.connectionId, tab.currentDatabase, tab.currentQuery],
        mutationFn: (data: IMutationData) => runUserQuery(data.connectionId, data.query, data.database),
    });

    const editorClasses = classnames('transition-all duration-200 relative', {
        'w-[30%]': !isEditorFocused,
        'w-[70%]': isEditorFocused
    });

    const dbOptions = databases?.map(db => ({
        label: db,
        value: db,
    })) ?? [];

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center gap-2 p-2 text-scene-default bg-scene-300 shadow-xl z-10">
                {connection.driver !== ConnectionDriver.SQLite && (
                    <div className="flex items-center gap-2">
                        <FaDatabase/>
                        <DropdownSelect
                            placeholder="Choose a database"
                            initialValue={tab.currentDatabase}
                            options={dbOptions}
                        />
                    </div>
                )}
                <Button size="sm" shape="square" className="ml-auto rounded-md" onClick={handleSubmitByButton}>
                    <FaPlay/>
                </Button>
            </div>
            <div className="flex flex-1">
                <div className={editorClasses}>
                    <Editor
                        defaultValue={tab.currentQuery ?? ''}
                        onFocus={on}
                        onBlur={off}
                        onSave={handleSave}
                        onPartialSubmit={handlePartialSubmit}
                        onSubmit={handleSubmit}
                    />
                    <EditorCommands/>
                </div>
                <div className="flex-1 empty:w-0 duration-200 transition-all p-4 overflow-auto">
                    {queryResult && (
                        <Spreadsheet columns={queryResult.columns} rows={queryResult.rows}/>
                    )}
                </div>
            </div>
        </div>
    );

    async function handleSubmitByButton() {
        const [activeEditor] = monaco.editor.getEditors();

        return handleSubmit(activeEditor.getValue());
    }

    async function handleSave(query: string) {
        if (query === tab.currentQuery) return;

        updateCurrentTab({
            ...tab,
            currentQuery: query
        });

        await updateTabs([{
            ...tab,
            currentQuery: query
        }]);
    }

    async function handlePartialSubmit(query: string, selection: monaco.Selection | null) {
        if (!tab.currentDatabase) return;

        const queriesToExecute = getCurrentQueries(query, selection);

        mutation.mutate({
            connectionId: tab.connectionId,
            database: tab.currentDatabase,
            query: queriesToExecute[0],
        });

        await handleSave(query);
    }

    async function handleSubmit(query: string) {
        if (!tab.currentDatabase) return;

        mutation.mutate({
            connectionId: tab.connectionId,
            database: tab.currentDatabase,
            query
        });

        await handleSave(query);
    }
}
