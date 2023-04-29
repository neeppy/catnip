import { MouseEvent } from 'react';
import classnames from 'classnames';
import { VscChromeClose } from 'react-icons/vsc';
import { closeTabs } from '../queries';

interface TabProps {
    isActive: boolean;
    tabId: string;
    connectionId: string;
    labelTop: string | null;
    labelBottom: string | null;
    onClick: () => unknown;
    onContextMenu: (event: MouseEvent) => unknown;
}

export function TabHeader({ isActive, connectionId, tabId, labelTop, labelBottom, onClick, onContextMenu }: TabProps) {
    const tabClassName = classnames('flex items-center w-[168px] transition-colors px-2 py-1', {
        'text-[#fff6] hover:text-[#fffa] hover:bg-[#fff1]': !isActive,
        'text-primary-text bg-primary-200': isActive
    });

    function closeTab() {
        return closeTabs(connectionId, [tabId]);
    }

    return (
        <div className={tabClassName} onContextMenu={onContextMenu}>
            <div
                onClick={onClick}
                className="flex flex-col h-full flex-1 items-start justify-center text-left overflow-hidden"
            >
                {labelTop && labelBottom ? (
                    <>
                        <span className="text-2xs max-w-full truncate">{labelTop}</span>
                        <span className="text-2xs max-w-full truncate">{labelBottom}</span>
                    </>
                ) : (
                    <span className="text-2xs">
                        (Empty Tab)
                    </span>
                )}
            </div>
            <button className="text-xs text-scene-default hover:bg-[#fff2] p-1 ml-2" onClick={closeTab}>
                <VscChromeClose/>
            </button>
        </div>
    );
}
