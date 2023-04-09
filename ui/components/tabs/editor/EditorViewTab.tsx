import * as monaco from 'monaco-editor';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import classnames from 'classnames';
import { FaDatabase, FaPlay } from 'react-icons/fa';
import { BiCommand } from 'react-icons/bi';
import { BsShift } from 'react-icons/bs';
import { Button, DropdownSelect, KeyCombo } from 'ui-kit';
import Editor from 'ui-kit/editor';
import Spreadsheet from 'ui-kit/spreadsheet';
import useBoolean from 'ui/hooks/useBoolean';
import { appModeState } from 'ui/state/global';
import { EditorView, useTabActivity } from '../state';
import { getDatabaseList, runUserQuery, updateTabs } from '../queries';
import { getCurrentQueries } from './utils';

type Platform = 'win32' | 'darwin';

interface IMutationData {
    connectionId: string;
    database: string;
    query: string;
}

const commands = [
    {
        description: 'Run all script',
        keys: {
            win32: ['Ctrl', 'Enter'],
            darwin: [<BiCommand/>, 'Enter']
        },
    },
    {
        description: 'Run current query',
        keys: {
            win32: ['Ctrl', 'Shift', 'Enter'],
            darwin: [<BiCommand/>, <BsShift/>, 'Enter']
        },
    },
];

export function EditorViewTab(tab: EditorView) {
    const [isAdvanced] = useAtom(appModeState);
    const updateCurrentTab = useTabActivity(state => state.updateCurrentTabDetails);
    const { boolean: isEditorFocused, on, off } = useBoolean(true);

    const { data: databases } = useQuery<string[]>(['databases', tab.connectionId, isAdvanced], () => getDatabaseList(tab.connectionId, isAdvanced));
    const { data: queryResult, ...mutation } = useMutation({
        mutationKey: ['query', tab.connectionId, tab.currentDatabase, tab.currentQuery],
        mutationFn: (data: IMutationData) => runUserQuery(data.connectionId, data.database, data.query),
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
                <div className="flex items-center gap-2">
                    <FaDatabase/>
                    <DropdownSelect
                        placeholder="Choose a database"
                        initialValue={tab.currentDatabase}
                        options={dbOptions}
                    />
                </div>
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
                    <div className="absolute bottom-4 right-4 flex flex-col-reverse items-end gap-2">
                        {commands.slice().reverse().map(command => (
                            <KeyCombo
                                key={command.description}
                                description={command.description}
                                keys={command.keys[interop.platform as Platform]}
                            />
                        ))}
                    </div>
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
