import { MouseEvent, ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import classnames from 'classnames';
import { VscChromeClose } from '$components/icons';
import { closeTabs } from '../queries';

interface TabProps {
    isActive: boolean;
    tabId: string;
    connectionId: string;
    label: ReactNode;
    onClick: () => unknown;
    onContextMenu: (event: MouseEvent) => unknown;
}

export function TabHeader({ isActive, connectionId, tabId, label, onClick, onContextMenu }: TabProps) {
    const { attributes, listeners, setNodeRef, transform, active, transition } = useSortable({ id: tabId });

    const isDragging = active && active.id === tabId;
    const isAnyDragging = !!active;

    const tabClassName = classnames('flex items-center w-[168px] transition-colors px-2 py-1 rounded-sm', {
        'text-foreground-subtlest hover:text-foreground-subtle hover:bg-transparent-400 active:bg-surface-400': !isActive,
        'text-primary-text bg-primary-200': isActive,
        'z-[1000]': isDragging,
    });

    function closeTab() {
        return closeTabs(connectionId, [tabId]);
    }

    return (
        <div
            ref={setNodeRef}
            className={tabClassName}
            onContextMenu={onContextMenu}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: isDragging ? 'none' : isAnyDragging ? transition : 'none',
            }}
            {...attributes}
            {...listeners}
        >
            <div
                onClick={onClick}
                className="flex flex-col h-full flex-1 items-start justify-center text-left overflow-hidden"
            >
                <span className="text-xs max-w-full truncate">
                    {label || '(Empty Tab)'}
                </span>
            </div>
            <button className="text-xs hover:bg-[#fff2] p-1 ml-2" onClick={closeTab}>
                <VscChromeClose/>
            </button>
        </div>
    );
}
