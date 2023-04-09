import { shallow } from 'zustand/shallow';
import { FaPlus } from 'react-icons/fa';
import classnames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { useContextMenu } from 'react-contexify';
import { Button, Dropdown } from 'ui-kit';
import { createEmptyTableView, getConnectionTabs, resumeTabActivity, newTabContextMenuConfig, TabHeader, useTabActivity, AnyTab } from 'ui/components/tabs';
import { useConnections } from 'ui/components/connections';
import { TAB_CONTEXT_MENU } from 'ui/components/context-menu';
import { useEffect } from 'react';

export function TabList() {
    const connection = useConnections(state => state.currentActiveConnection);
    const [currentActiveTab, setCurrentTab] = useTabActivity(state => [state.currentActiveTab, state.setCurrentTab], shallow);
    const { show } = useContextMenu({ id: TAB_CONTEXT_MENU });
    const { data: tabs } = useQuery(['tabs', connection?.id], () => getConnectionTabs(connection!.id), {
        enabled: !!connection
    });

    useEffect(() => {
        if (connection && !currentActiveTab) {
            void resumeTabActivity();
        }
    }, [connection]);

    const tabContainerClass = classnames('flex gap-2 select-none', {
        'ml-24': interop.platform === 'darwin'
    });

    const newTabProps = {
        connectionId: connection?.id ?? '',
        databaseName: connection?.databaseName ?? ''
    };

    return (
        <div className={tabContainerClass}>
            {tabs?.map(tab => (
                <TabHeader
                    key={tab.id}
                    isActive={tab.id === currentActiveTab?.id}
                    tabId={tab.id}
                    connectionId={tab.connectionId}
                    labelTop={tab.currentDatabase}
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
        localStorage.setItem('activeTab', tab.id);
        setCurrentTab(tab);
    }

    async function onNewTab() {
        if (!connection) return;

        const tab = await createEmptyTableView(connection.id);

        setCurrentTab(tab);
    }
}
