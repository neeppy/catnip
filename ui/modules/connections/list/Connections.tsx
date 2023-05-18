import { MouseEvent, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContextMenu } from 'react-contexify';
import { FaPlus, SiMysql, SiSqlite } from '$components/icons';
import { useAtomValue } from 'jotai';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { Button } from '$components';
import { randomColor } from 'ui/utils/random';
import { createEmptyTableView, getConnectionTabs, resumeTabActivity } from '$module:tabs';
import { CONNECTION_CONTEXT_MENU, themeState, useModalRegistry } from '$module:globals';
import storage from '$storage';
import { DropdownMenu } from 'ui/components/DropdownMenu';
import { useConnections } from '../state';
import { fetchConnections } from '../form';
import { MySQLForm, SQLiteForm } from '../form';

const driverOptions = [
    {
        key: ConnectionDriver.MySQL,
        label: 'MySQL',
        icon: SiMysql,
        onClick: () => useModalRegistry.getState().open(MySQLForm, {
            type: 'drawer',
            settings: { placement: 'right' },
        })
    },
    {
        key: ConnectionDriver.SQLite,
        label: 'SQLite',
        icon: SiSqlite,
        onClick: () => useModalRegistry.getState().open(SQLiteForm, {
            type: 'drawer',
            settings: { placement: 'right' },
        })
    }
];

export function Connections() {
    const theme = useAtomValue(themeState);
    const queryClient = useQueryClient();
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
                            shape="round" size="sm" scheme="custom"
                            className="w-7 h-7"
                            style={{ backgroundColor: randomColor(theme + connection.name) }}
                            onClick={() => onConnectionClick(connection)}
                            onContextMenu={event => handleContextMenu(event, connection)}
                        >
                            <span className="text-white font-bold">
                                {connection.name.charAt(0).toUpperCase()}
                            </span>
                        </Button>
                    ))}
                </div>
                <DropdownMenu
                    placement="topRight"
                    className="ml-auto"
                    label={<FaPlus />}
                    triggerProps={{ size: 'sm' }}
                    options={driverOptions}
                />
            </footer>
        </>
    );

    function handleContextMenu(event: MouseEvent, connection: AnyConnection) {
        const { top, right } = event.currentTarget.getBoundingClientRect();

        show({
            event,
            props: connection,
            position: {
                x: right + 4,
                y: top
            }
        });
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
