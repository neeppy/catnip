import { MouseEvent, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContextMenu } from 'react-contexify';
import { AnyConnection } from 'common/models/Connection';
import { Button } from '$components';
import { randomColor } from 'ui/utils/random';
import { createEmptyTableView, getConnectionTabs, resumeTabActivity } from '$module:tabs';
import { useModalRegistry, CONNECTION_CONTEXT_MENU } from '$module:globals';
import { useConnections } from '../state';
import ConnectionForm, { fetchConnections } from '../form';
import storage from '$storage';

export function Connections() {
    const queryClient = useQueryClient();
    const open = useModalRegistry(state => state.open);
    const setActiveConnection = useConnections(state => state.setActiveConnection);
    const { data, isLoading } = useQuery(['connections'], fetchConnections);
    const { show } = useContextMenu({ id: CONNECTION_CONTEXT_MENU });

    useEffect(() => {
        const lastActiveConnection = localStorage.getItem('activeConnection');

        if (lastActiveConnection) {
            storage.connections.get(lastActiveConnection)
                .then(connection => connection && onConnectionClick(connection));
        }
    }, []);

    return (
        <>
            <footer className="flex h-[2.5rem] px-2 justify-start items-center z-20 py-1">
                <div className="flex items-center gap-4">
                    {data && !isLoading && data.length > 0 && data.map(connection => (
                        <Button
                            key={connection.id}
                            shape="round" size="sm" scheme="none"
                            className="w-7 h-7"
                            style={{ backgroundColor: randomColor(connection.name) }}
                            onClick={() => onConnectionClick(connection)}
                            onContextMenu={event => handleContextMenu(event, connection)}
                        >
                            <span className="text-scene-default font-bold">
                                {connection.name.charAt(0).toUpperCase()}
                            </span>
                        </Button>
                    ))}
                </div>
                <Button scheme="accent" size="sm" className="ml-auto font-bold w-7 h-7" onClick={openModalForm}>
                    +
                </Button>
            </footer>
        </>
    );

    function openModalForm() {
        open(ConnectionForm);
    }

    function handleContextMenu(event: MouseEvent, connection: AnyConnection) {
        show({ event, props: connection });
    }

    async function onConnectionClick(connection: AnyConnection) {
        const [tabs] = await Promise.all([
            queryClient.fetchQuery(['tabs', connection.id], () => getConnectionTabs(connection.id)),
            window.interop.connections.open(connection)
        ]);

        setActiveConnection(connection);

        if (tabs.length === 0) {
            await createEmptyTableView(connection.id);
        } else {
            await resumeTabActivity(connection.id);
        }

        localStorage.setItem('activeConnection', connection.id);
    }
}
