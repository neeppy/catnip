import * as monaco from 'monaco-editor';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import classnames from 'classnames';
import { FaDatabase, FaPlay } from '$components/icons';
import { Button, Editor, Select, Table, Change } from '$components';
import { useBoolean } from 'ui/hooks';
import { appModeState } from '$module:globals';
import { getDatabaseList } from '$module:tabs/tables';
import { EditorView, updateTab } from '$module:tabs';
import { runUserQuery } from '../queries';
import { getCurrentQueries } from '../utils';
import { EditorCommands } from './EditorCommands';

interface IMutationData {
    connectionId: string;
    database: string;
    query: string;
}

export function EditorViewTab(tab: EditorView) {
    const [isAdvanced] = useAtom(appModeState);
    const { boolean: isEditorFocused, on, off } = useBoolean(true);

    const { data: databases } = useQuery<string[]>(['databases', tab.connectionId, isAdvanced], () => getDatabaseList(tab.connectionId, isAdvanced));
    const { data: queryResult, ...mutation } = useMutation({
        mutationKey: ['query', tab.connectionId, tab.currentDatabase, tab.currentQuery],
        mutationFn: (data: IMutationData) => runUserQuery(data.connectionId, data.query, data.database)
    });

    const editorClasses = classnames('transition-all h-full duration-200 relative shadow-right', {
        'w-1/3': queryResult,
        'w-2/3': !queryResult
    });

    const dbOptions = databases?.map(db => ({
        label: db,
        value: db
    })) ?? [];

    const initialDatabase = dbOptions.find(option => option.value === tab.currentDatabase);

    return (
        <div className="flex flex-col bg-surface-400 w-full h-full">
            <div className="flex h-12 items-center gap-2 px-2 text-foreground-default bg-surface-500 shadow-xl z-10">
                {dbOptions.length > 0 && (
                    <div className="flex items-center gap-2">
                        <FaDatabase/>
                        <Select
                            uniqueKey="value"
                            initialValue={initialDatabase}
                            labelKey="label"
                            options={dbOptions ?? []}
                            onChange={({ value }) => onDatabaseChange(value)}
                        />
                    </div>
                )}
                <Button shape="square" className="ml-auto rounded-md" onClick={handleSubmitByButton}>
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
                <div className="relative flex-1">
                    <div className="absolute inset-4">
                        {queryResult && (
                            <Table {...queryResult} onPersist={doPersist} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    async function doPersist(changes: Change[]) {
        console.log('persisting', changes);
    }

    async function onDatabaseChange(database: string) {
        await updateTab({ ...tab, currentDatabase: database });
    }

    async function handleSubmitByButton() {
        const [activeEditor] = monaco.editor.getEditors();

        return handleSubmit(activeEditor.getValue());
    }

    async function handleSave(query: string) {
        if (query === tab.currentQuery) return;

        await updateTab({ ...tab, currentQuery: query });
    }

    async function handlePartialSubmit(query: string, selection: monaco.Selection | null) {
        if (!tab.currentDatabase) return;

        const queriesToExecute = getCurrentQueries(query, selection);

        mutation.mutate({
            connectionId: tab.connectionId,
            database: tab.currentDatabase,
            query: queriesToExecute[0]
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
