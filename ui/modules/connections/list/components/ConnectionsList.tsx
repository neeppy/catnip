import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { DropdownMenu } from '$components';
import { FaFolder, FaPlus, SiMysql, SiSqlite } from '$components/icons';
import { useModalRegistry } from '$module:globals';
import { fetchGroupedConnections } from '../queries';
import { MySQLForm, SQLiteForm } from '../../form';
import { GroupConnectionList } from './GroupConnectionList';

interface OwnProps {
    focusedConnection: AnyConnection | null;
    focusOtherConnection: (connection: AnyConnection) => void;
}

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

export function ConnectionsList({
    focusedConnection,
    focusOtherConnection,
}: OwnProps) {
    const [loadingConnection, setLoadingConnection] = useState<string | null>(null);
    const { data } = useQuery(['connections', 'grouped'], fetchGroupedConnections);

    if (!data) return null;

    return (
        <div className="w-64 bg-base-300 p-4 flex flex-col shadow-right">
            <h3 className="text-lg">Saved connections</h3>
            <ul className="flex flex-col gap-4 mt-5 flex-1">
                <li className="text-sm">
                    <span className="flex gap-2 items-center select-none">
                        <FaFolder />
                        Ungrouped
                    </span>
                    <GroupConnectionList
                        selected={focusedConnection?.id ?? null}
                        loadingConnection={loadingConnection}
                        connections={data.connections}
                        onLaunch={establishConnection}
                    />
                </li>
                {data.groups.map(group => (
                    <li key={group.id} className="text-sm">
                        <span className="flex gap-2 items-center select-none">
                            <FaFolder />
                            {group.name}
                        </span>
                        <GroupConnectionList
                            selected={focusedConnection?.id ?? null}
                            loadingConnection={loadingConnection}
                            connections={group.connections}
                            onLaunch={establishConnection}
                        />
                    </li>
                ))}
            </ul>
            <div>
                <DropdownMenu
                    placement="topLeft"
                    className="mt-auto"
                    label={(
                        <>
                            <FaPlus />
                            Add Connection
                        </>
                    )}
                    triggerProps={{ className: 'w-full flex-center gap-2' }}
                    options={driverOptions}
                />
            </div>
        </div>
    );

    async function establishConnection(connection: AnyConnection, isActive?: boolean) {
        setLoadingConnection(connection.id);

        try {
            if (!isActive) {
                // todo: remove
                await new Promise(resolve => setTimeout(resolve, 1000));
                await interop.connections.open(connection);
            }

            focusOtherConnection(connection);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingConnection(null);
        }
    }
}
