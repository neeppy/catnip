import { EditorView, runUserQuery, updateTabs, useTabActivity } from 'ui/components/tabs';
import { useBoolean } from 'ui/hooks';
import { useMutation } from '@tanstack/react-query';
import classnames from 'classnames';
import { FaPlay } from 'react-icons/fa';
import { Button } from 'ui-kit';
import Editor from 'ui-kit/editor';
import { EditorCommands } from 'ui/components/tabs/components/EditorCommands';
import Spreadsheet from 'ui-kit/spreadsheet';
import * as monaco from 'monaco-editor';
import { getCurrentQueries } from 'ui/components/tabs/editor/utils';

interface IMutationData {
    connectionId: string;
    query: string;
}

export function SingleDatabaseEditorTab(tab: EditorView) {
    const updateCurrentTab = useTabActivity(state => state.updateCurrentTabDetails);
    const { boolean: isEditorFocused, on, off } = useBoolean(true);

    const { data: queryResult, ...mutation } = useMutation({
        mutationKey: ['query', tab.connectionId, tab.currentQuery],
        mutationFn: (data: IMutationData) => runUserQuery(data.connectionId, data.query),
    });

    const editorClasses = classnames('transition-all duration-200 relative', {
        'w-[30%]': !isEditorFocused,
        'w-[70%]': isEditorFocused
    });

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center gap-2 p-2 text-scene-default bg-scene-300 shadow-xl z-10">
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
            query: queriesToExecute[0],
        });

        await handleSave(query);
    }

    async function handleSubmit(query: string) {
        if (!tab.currentDatabase) return;

        mutation.mutate({
            connectionId: tab.connectionId,
            query
        });

        await handleSave(query);
    }
}
