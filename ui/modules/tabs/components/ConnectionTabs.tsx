import { useEffect } from 'react';
import classnames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { AllConnections, ConnectionDriver } from 'common/models/Connection';
import { getConnectionTabs, newTabContextMenuConfig, resumeTabActivity, useTabActivity } from '$module:tabs';
import { useConnections } from '$module:connections';
import { FaPlus } from '$components/icons';
import { DropdownMenu } from '$components';
import { TabList } from './TabList';

const DB_NAME_FIELDS: Record<ConnectionDriver, keyof AllConnections> = {
    [ConnectionDriver.MySQL]: 'databaseName',
    [ConnectionDriver.SQLite]: 'name'
};

export function ConnectionTabs() {
    const connection = useConnections(state => state.currentActiveConnection);
    const currentActiveTab = useTabActivity(state => state.currentActiveTab);

    const { data: tabs } = useQuery(['tabs', connection?.id], () => getConnectionTabs(connection!.id), {
        enabled: !!connection
    });

    useEffect(() => {
        if (connection && !currentActiveTab) {
            void resumeTabActivity(connection.id);
        }
    }, [connection]);

    if (!connection) {
        return null;
    }

    const tabContainerClass = classnames('flex gap-2 select-none z-20', {
        'ml-24': interop.platform === 'darwin'
    });

    const connectionDbKey = DB_NAME_FIELDS[connection.driver || ConnectionDriver.SQLite] as keyof typeof connection;

    const newTabProps = {
        connectionId: connection.id ?? '',
        databaseName: connection[connectionDbKey] ?? ''
    };

    return (
        <div className={tabContainerClass}>
            <TabList tabs={tabs || []} />
            {connection && (
                <DropdownMenu
                    className="self-center"
                    label={<FaPlus />}
                    triggerProps={{ size: 'sm' }}
                    options={newTabContextMenuConfig(newTabProps)}
                />
            )}
        </div>
    );
}
