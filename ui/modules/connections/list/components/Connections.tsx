import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import storage from '$storage';
import { DropdownMenu } from '$components';
import { FaPlus, SiMysql, SiSqlite } from '$components/icons';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { createEmptyTableView, getConnectionTabs, resumeTabActivity } from '$module:tabs';
import { useModalRegistry } from '$module:globals';
import { useConnections } from '../../state';
import { MySQLForm, SQLiteForm } from '../../form';
import { fetchGroupedConnections } from '../queries';
import { ConnectionBubbles } from './ConnectionBubbles';

const driverOptions = [
    {
        key: ConnectionDriver.MySQL,
        label: 'MySQL',
        icon: SiMysql,
        onClick: () => useModalRegistry.getState().open(MySQLForm, {
            type: 'drawer',
            settings: { placement: 'right' }
        })
    },
    {
        key: ConnectionDriver.SQLite,
        label: 'SQLite',
        icon: SiSqlite,
        onClick: () => useModalRegistry.getState().open(SQLiteForm, {
            type: 'drawer',
            settings: { placement: 'right' }
        })
    },
];

export function Connections() {
    const queryClient = useQueryClient();
    const setActiveConnection = useConnections(state => state.setActiveConnection);
    const { data } = useQuery(['connections', 'grouped'], fetchGroupedConnections);

    useEffect(() => {
        const lastActiveConnection = localStorage.getItem('activeConnection');

        if (lastActiveConnection) {
            storage.connections.get(lastActiveConnection)
                .then(connection => connection && onConnectionClick(connection));
        }
    }, []);

    return (
        <div className="flex flex-col h-full px-2 py-4 justify-start z-20">
            <ConnectionBubbles
                groups={data?.groups ?? []}
                connections={data?.connections ?? []}
                onActivate={onConnectionClick}
            />
            <DropdownMenu
                placement="topLeft"
                className="mt-auto"
                label={<FaPlus/>}
                triggerProps={{ className: 'w-full flex-center' }}
                options={driverOptions}
            />
        </div>
    );

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
