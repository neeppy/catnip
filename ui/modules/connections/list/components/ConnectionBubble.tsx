import { MouseEvent } from 'react';
import { useAtomValue } from 'jotai';
import Color from 'color';
import classnames from 'classnames';
import { useContextMenu } from 'react-contexify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CONNECTION_CONTEXT_MENU } from '$module:globals';
import { sidebarExpansionState } from '$module:layout';
import { AnyConnection } from 'common/models/Connection';
import { Button } from '$components';
import { FaCheckCircle, FaTimes } from '$components/icons';
import { useBoolean } from 'ui/hooks';
import { useGrouping } from '../utils/useGrouping';
import { groupConnections } from '../queries';

interface OwnProps {
    connection: AnyConnection;
    color: string;
    hasFocus?: boolean;
    isActive?: boolean;
    isDragging?: boolean;
    onClick: () => Promise<void>;
}

export function ConnectionBubble({ connection, color, onClick, isActive, hasFocus, isDragging }: OwnProps) {
    const isMenuExpanded = useAtomValue(sidebarExpansionState);
    const { show } = useContextMenu({ id: CONNECTION_CONTEXT_MENU });
    const { boolean: hasConnectionError, on, off } = useBoolean(false);
    const { shouldAllowTransform, isGrouping } = useGrouping(connection.id, async (conn1, conn2) => {
        return groupConnections(conn1, conn2);
    });

    const { attributes, listeners, transform, active, setNodeRef } = useSortable({
        id: connection.id,
        data: { connection, isGrouping }
    });

    if (transform) {
        transform.scaleX = 1;
        transform.scaleY = 1;
    }

    const isAnyDragging = !!active;

    const bubbleClass = classnames('h-8 aspect-square flex-center relative rounded-md overflow-hidden text-white font-bold truncate transition-transform', {
        'scale-125': hasFocus,
    });

    const buttonClass = classnames('w-full transition-all text-left', {
        'opacity-0': isDragging,
        'scale-90': isGrouping && isMenuExpanded,
        'scale-75': isGrouping && !isMenuExpanded,
    });

    const textColor = Color(color).isLight() ? '#000' : '#fff';

    return (
        <Button
            scheme="transparent" size="custom" className={buttonClass}
            ref={setNodeRef}
            onClick={onBubbleClick}
            onContextMenu={event => handleContextMenu(event, connection)}
            style={{
                ...(shouldAllowTransform || isDragging) && {
                    transform: CSS.Transform.toString(transform)
                },
                transitionProperty: isDragging ? 'none' : isAnyDragging ? 'all' : 'none'
            }}
            {...attributes}
            {...listeners}
        >
            <div className="flex items-center gap-2">
                <div
                    className={bubbleClass}
                    style={{ backgroundColor: color, color: textColor }}
                >
                    {connection.name.charAt(0).toUpperCase()}
                    {isActive && (
                        <FaCheckCircle className={`absolute top-0.5 right-0.5 w-2 h-2 bg-[#0009] rounded-full ${hasFocus ? 'text-green-300' : 'text-yellow-200'}`} />
                    )}
                    {hasConnectionError && (
                        <FaTimes className="absolute top-0.5 right-0.5 w-3 h-3 text-red-400"/>
                    )}
                </div>
                {isMenuExpanded && (
                    <span className="flex-1 text-foreground-default animate-fade-in truncate">{connection.name}</span>
                )}
            </div>
        </Button>
    );

    async function onBubbleClick() {
        return onClick()
            .then(off)
            .catch(on);
    }

    function handleContextMenu(event: MouseEvent, connection: AnyConnection) {
        const { top, right } = event.currentTarget.getBoundingClientRect();

        show({
            event,
            props: connection,
            position: {
                x: right + 4,
                y: top
            }
        });
    }
}
