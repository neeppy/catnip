import { VscChromeMinimize, VscChromeMaximize, VscChromeClose } from 'react-icons/vsc';
import { useAtom } from 'jotai';
import classnames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { FaPlus } from 'react-icons/fa';
import { Button } from 'ui/components/ui-kit';
import { appModeState } from 'ui/state/global';
import {
    activeConnection,
    AnyTab, createEmptyTableView,
    EditorTabHeader,
    getConnectionTabs,
    TableTabHeader,
    updateTabs
} from 'ui/components/tabs';
import { useActiveTab } from 'ui/hooks/useActiveTab';

export function Header() {
    const [isAdvancedMode, setAdvancedMode] = useAtom(appModeState);
    const [connection] = useAtom(activeConnection);
    const activeTab = useActiveTab();
    const { data: tabs } = useQuery(['tabs', connection?.id], () => getConnectionTabs(connection!.id), {
        enabled: !!connection
    });

    function toggleAppMode() {
        setAdvancedMode(prev => !prev);
    }

    async function changeActiveTab(tab: AnyTab) {
        if (!activeTab) return;
        if (tab.id === activeTab.id) return;

        await updateTabs([
            { ...activeTab, isActive: false },
            { ...tab, isActive: true }
        ]);
    }

    async function onNewTab() {
        if (!connection) return;

        await createEmptyTableView(connection.id);

        if (activeTab) {
            await updateTabs([{ ...activeTab, isActive: false }]);
        }
    }

    const tabContainerClass = classnames('flex gap-2 select-none', {
        'ml-24': interop.platform === 'darwin',
    });

    return (
        <header id="title-bar" className="flex pl-4 h-[2.5rem]">
            <div className={tabContainerClass}>
                {tabs?.map(tab => tab.type === 'table' ? (
                    <TableTabHeader key={tab.id} tab={tab} onClick={() => changeActiveTab(tab)} />
                ) : (
                    <EditorTabHeader key={tab.id} tab={tab} onClick={() => changeActiveTab(tab)} />
                ))}
                {connection && (
                    <Button size="sm" shape="square" className="self-center rounded-md text-xs" onClick={onNewTab}>
                        <FaPlus/>
                    </Button>
                )}
            </div>
            <Button scheme={isAdvancedMode ? 'accent' : 'ghost-accent'} size="sm" className="px-2 ml-auto mr-4 text-xs self-center" onClick={toggleAppMode}>
                {isAdvancedMode ? 'Advanced View' : 'Simplified View'}
            </Button>
            {interop.platform === 'win32' && (
                <>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-[#fff1] ml-6" onClick={interop.control.minimize}>
                        <VscChromeMinimize/>
                    </button>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-[#fff1]" onClick={interop.control.maximize}>
                        <VscChromeMaximize/>
                    </button>
                    <button className="text-scene-default flex-center aspect-square h-full hover:bg-red-500" onClick={interop.control.close}>
                        <VscChromeClose/>
                    </button>
                </>
            )}
        </header>
    );
}
