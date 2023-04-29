import { useEffect } from 'react';
import { shallow } from 'zustand/shallow';
import { FaPlus } from 'react-icons/fa';
import classnames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { useContextMenu } from 'react-contexify';
import { AllConnections, ConnectionDriver } from 'common/models/Connection';
import { Button, Dropdown } from '$components';
import { AnyTab, createEmptyTableView, getConnectionTabs, newTabContextMenuConfig, resumeTabActivity, TabHeader, useTabActivity } from '$module:tabs';
import { isMultiDatabaseConnection, useConnections } from '$module:connections';
import { TAB_CONTEXT_MENU } from '$module:globals';

const DB_NAME_FIELDS: Record<ConnectionDriver, keyof AllConnections> = {
    [ConnectionDriver.MySQL]: 'databaseName',
    [ConnectionDriver.SQLite]: 'name'
};

export function TabList() {
    const connection = useConnections(state => state.currentActiveConnection);
    const [currentActiveTab, setCurrentTab] = useTabActivity(state => [state.currentActiveTab, state.setCurrentTab], shallow);
    const { show } = useContextMenu({ id: TAB_CONTEXT_MENU });
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

    const isMultiDatabase = isMultiDatabaseConnection(connection);
    const tabContainerClass = classnames('flex gap-2 select-none', {
        'ml-24': interop.platform === 'darwin'
    });

    const connectionDbKey = DB_NAME_FIELDS[connection.driver || ConnectionDriver.SQLite] as keyof typeof connection;

    const newTabProps = {
        connectionId: connection.id ?? '',
        databaseName: connection[connectionDbKey] ?? ''
    };

    return (
        <div className={tabContainerClass}>
            {tabs?.map(tab => (
                <TabHeader
                    key={tab.id}
                    isActive={tab.id === currentActiveTab?.id}
                    tabId={tab.id}
                    connectionId={tab.connectionId}
                    labelTop={isMultiDatabase ? tab.currentDatabase : connection.name}
                    labelBottom={tab.type === 'editor' ? tab.currentQuery : tab.currentTable}
                    onClick={() => setActiveTab(tab)}
                    onContextMenu={event => show({ event, props: tab })}
                />
            )) ?? []}
            {connection && (
                <Dropdown options={newTabContextMenuConfig} dropdownData={newTabProps} trigger={(
                    <Button size="sm" shape="square" className="self-center rounded-md text-xs" onClick={onNewTab}>
                        <FaPlus/>
                    </Button>
                )}/>
            )}
        </div>
    );

    function setActiveTab(tab: AnyTab) {
        setCurrentTab(tab);
    }

    async function onNewTab() {
        if (!connection) return;

        const tab = await createEmptyTableView(connection.id);

        setCurrentTab(tab);
    }
}
