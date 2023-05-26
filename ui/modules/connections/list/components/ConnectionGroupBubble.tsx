import { MouseEvent } from 'react';
import { useAtomValue } from 'jotai';
import { DragOverEvent, useDndMonitor, useDroppable } from '@dnd-kit/core';
import { shallow } from 'zustand/shallow';
import classnames from 'classnames';
import { ShowContextMenuParams, useContextMenu } from 'react-contexify';
import Color from 'color';
import { sidebarExpansionState } from '$module:layout';
import { CONNECTION_CONTEXT_MENU, GROUP_CONTEXT_MENU } from '$module:globals';
import { Button, Dropdown } from '$components';
import { BsFillFolderSymlinkFill, FaPlus } from '$components/icons';
import { AnyConnection } from 'common/models/Connection';
import { useBoolean } from 'ui/hooks';
import { randomColor } from 'ui/utils/random';
import { useConnections } from '../../state';
import { ConnectionGroup } from '../queries';

interface OwnProps {
    theme: string;
    group: ConnectionGroup
    onActivate: (conn: AnyConnection) => void;
}

type ShowFn = (params: ShowContextMenuParams) => void;

const renderOption = (theme: string, activeConnection: AnyConnection | null, show: ShowFn) => (option: AnyConnection) => {
    const bgColor = randomColor(theme + option.name);
    const textColor = Color(bgColor).isLight() ? '#000' : '#fff';

    const isActive = option.id === activeConnection?.id;

    return (
        <div className="flex items-center gap-4 select-none" onContextMenu={handleContextMenu}>
            <div
                className="relative h-10 aspect-square overflow-hidden flex-center text-xl font-semibold rounded-md shadow-xl"
                style={{
                    backgroundColor: randomColor(theme + option.name),
                    color: textColor
                }}
            >
                {option.name.charAt(0).toUpperCase()}
                {isActive && (
                    <span className="absolute bottom-0 h-1 rounded-full shadow-top border-t border-black/25 inset-x-0 bg-green-300"/>
                )}
            </div>
            <span className="text-foreground-default">{option.name}</span>
        </div>
    );

    function handleContextMenu(event: MouseEvent) {
        show({
            event,
            id: CONNECTION_CONTEXT_MENU,
            props: option
        });
    }
};

export function ConnectionGroupBubble({ theme, group, onActivate }: OwnProps) {
    const isMenuExpanded = useAtomValue(sidebarExpansionState);
    const [activeConnections, currentConnection] = useConnections(state => [state.activeConnections, state.currentActiveConnection], shallow);
    const { boolean: isHoveringAdd, on: showAddIcon, off: hideAddIcon } = useBoolean(false);
    const { show } = useContextMenu();
    const { setNodeRef } = useDroppable({
        id: group.id,
        data: { isGroup: true }
    });

    useDndMonitor({
        onDragOver(event: DragOverEvent) {
            const { over, active } = event;

            if (over && over.id === group.id && over.id !== active.id) {
                showAddIcon();
            } else {
                hideAddIcon();
            }
        },
        onDragEnd() {
            isHoveringAdd && hideAddIcon();
        }
    });

    const focusedConnection = group.connections.find(conn => conn.id === currentConnection?.id);
    const isActive = activeConnections.some(activeConn => group.connections.some(conn => conn.id === activeConn.id));

    const bgColor = randomColor(theme + group.id);
    const darkenedBgColor = Color(bgColor).darken(0.3).toString();

    const triggerClass = classnames('h-8 w-full justify-start');

    const bubbleClass = classnames('relative h-8 aspect-square rounded-md flex-center', {
        'ring-[2px] ring-white/25': !!focusedConnection
    });

    return (
        <Dropdown
            value={null}
            uniqueKey="id" labelKey="name" options={group.connections}
            hideSearch={group.connections.length < 6}
            placement="rightTop"
            className="w-full"
            onChange={onActivate}
            containerRef={setNodeRef}
            renderOption={renderOption(theme, currentConnection, show)}
        >
            <Dropdown.Trigger as={Button} scheme="transparent" shape="square" size="custom" className={triggerClass} onContextMenu={handleContextMenu}>
                <div className="flex items-center gap-2">
                    <div className={bubbleClass}>
                        <BsFillFolderSymlinkFill className="text-2xl" style={{ color: darkenedBgColor }}/>
                        <span className="absolute -bottom-0.5 inset-x-0 text-2xs pointer-events-none" style={{ color: '#fffc' }}>
                            {group.name.substring(0, 2).toUpperCase()}
                        </span>
                        {isHoveringAdd && (
                            <span className="absolute flex-center inset-0 animate-scale-in bg-green-600 rounded-md pointer-events-none">
                                <FaPlus className="text-white"/>
                            </span>
                        )}
                    </div>
                    {isMenuExpanded && (
                        <div className="text-base">{group.name}</div>
                    )}
                </div>
            </Dropdown.Trigger>
        </Dropdown>
    );

    function handleContextMenu(event: MouseEvent) {
        show({
            event,
            id: GROUP_CONTEXT_MENU,
            props: group
        });
    }
}
