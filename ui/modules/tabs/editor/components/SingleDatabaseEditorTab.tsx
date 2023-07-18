import * as monaco from 'monaco-editor';
import { useMutation } from '@tanstack/react-query';
import classnames from 'classnames';
import { FaPlay } from '$components/icons';
import { Button, Editor, Change, Table } from '$components';
import { EditorView, updateTab } from '$module:tabs';
import { getCurrentQueries } from '../utils';
import { EditorCommands } from './EditorCommands';
import { runUserQuery } from '../queries';

interface IMutationData {
    connectionId: string;
    query: string;
}

export function SingleDatabaseEditorTab(tab: EditorView) {
    const { data: queryResult, ...mutation } = useMutation({
        mutationKey: ['query', tab.connectionId, tab.currentQuery],
        mutationFn: (data: IMutationData) => runUserQuery(data.connectionId, data.query),
    });

    const editorClasses = classnames('transition-all h-full duration-200 relative shadow-right', {
        'w-1/3': queryResult,
        'w-2/3': !queryResult,
    });

    return (
        <div className="flex flex-col bg-surface-400 w-full h-full">
            <div className="h-12 flex items-center gap-2 px-2 text-foreground-default bg-surface-500 shadow-xl z-10">
                <Button shape="square" className="ml-auto rounded-md" onClick={handleSubmitByButton}>
                    <FaPlay/>
                </Button>
            </div>
            <div className="flex flex-1">
                <div className={editorClasses}>
                    <Editor
                        defaultValue={tab.currentQuery ?? ''}
                        onSave={handleSave}
                        onPartialSubmit={handlePartialSubmit}
                        onSubmit={handleSubmit}
                    />
                    <EditorCommands/>
                </div>
                <div className="relative flex-1">
                    <div className="absolute inset-4">
                        {queryResult && (
                            <Table {...queryResult} onPersist={handleManualCellChangePersist} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    async function handleManualCellChangePersist(changes: Change[]) {
        console.log('persisting changes', changes);
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
            query: queriesToExecute[0],
        });

        await handleSave(query);
    }

    async function handleSubmit(query: string) {
        if (!tab.currentDatabase) return;

        await mutation.mutateAsync({
            connectionId: tab.connectionId,
            query
        });

        await handleSave(query);
    }
}
