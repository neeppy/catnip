import classnames from 'classnames';
import { VscChromeClose } from 'react-icons/vsc';
import { closeTabs, EditorView, TableView } from 'ui/components/tabs';

interface OwnProps<T> {
    tab: T;
    onClick: () => Promise<unknown>;
}

export function TableTabHeader({ tab, onClick }: OwnProps<TableView>) {
    const tabClassName = classnames('flex items-center w-[168px] transition-colors px-2 py-1', {
        'text-[#fff6] hover:text-[#fffa] hover:bg-[#fff1]': !tab.isActive,
        'text-scene-default bg-accent-900': tab.isActive
    });

    function closeTab(event: any) {
        event.stopPropagation();

        return closeTabs(tab.connectionId, [tab.id]);
    }

    return (
        <div
            className={tabClassName}
            onClick={onClick}
        >
            <span className="flex flex-col flex-1 items-start justify-center text-left overflow-hidden">
                {tab.currentDatabase && tab.currentTable ? (
                    <>
                        <span className="text-2xs max-w-full truncate">{tab.currentDatabase}</span>
                        <span className="text-2xs max-w-full truncate">{tab.currentTable}</span>
                    </>
                ) : (
                    <span className="text-2xs">
                        (New Tab)
                    </span>
                )}
            </span>
            <button className="text-xs text-scene-default hover:bg-[#fff2] p-1 ml-2" onClick={closeTab}>
                <VscChromeClose/>
            </button>
        </div>
    );
}

export function EditorTabHeader({ tab, onClick }: OwnProps<EditorView>) {
    return (
        <div/>
    );
}
