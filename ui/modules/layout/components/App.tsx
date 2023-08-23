import { useBoolean, useControlledEffect, useSettings } from 'ui/hooks';
import { createEmptyTableView, getConnectionTabs, resumeTabActivity } from '$module:tabs';
import { useConnections } from '$module:connections';
import storage from 'ui/utils/storage';
import { AnyConnection } from 'common/models/Connection';
import client from 'ui/utils/query';
import { Header } from './Header';
import { MainScreen } from './MainScreen';
import { Editor } from 'ui/components';
import classnames from 'classnames';

export const App = () => {
    const { settings, isFetched, isFetching } = useSettings();
    const { boolean: isEditorExpanded, on: expandEditor, off: collapseEditor } = useBoolean(false);

    useControlledEffect(() => {
        document.body.setAttribute('data-theme', settings.appearance.theme);
    }, !isFetching);

    useControlledEffect(() => {
        console.debug('[App] Settings Loaded', settings);

        if (settings.behaviour.newSessionActivity === 'restore') {
            const lastActiveConnection = localStorage.getItem('activeConnection');

            if (lastActiveConnection) {
                storage.connections.get(lastActiveConnection)
                    .then(connection => connection && loadInitialConnection(connection));
            }
        }

        postMessage({ payload: 'removeLoading' }, '*');
    }, isFetched);

    if (!isFetched) {
        return null;
    }

    const editorContainerClass = classnames('z-10 duration-200', {
        'h-96': isEditorExpanded,
        'h-12': !isEditorExpanded,
    });

    return (
        <div className="bg-accent h-screen w-screen flex flex-col relativ overflow-hidden">
            <Header />
            <div className="flex h-full overflow-hidden">
                <main className="bg-surface-300 flex-1 relative overflow-hidden flex-center">
                    <MainScreen/>
                </main>
            </div>
            <div className={editorContainerClass}>
                <Editor defaultValue="" onFocus={expandEditor} onBlur={collapseEditor} />
            </div>
        </div>
    );

    async function loadInitialConnection(connection: AnyConnection) {
        const [tabs] = await Promise.all([
            client.fetchQuery(['tabs', connection.id], () => getConnectionTabs(connection.id)),
            window.interop.connections.open(connection)
        ]);

        useConnections.getState().setActiveConnection(connection);

        if (tabs.length === 0) {
            await createEmptyTableView(connection.id);
        } else {
            await resumeTabActivity(connection.id);
        }

        localStorage.setItem('activeConnection', connection.id);
    }
};
