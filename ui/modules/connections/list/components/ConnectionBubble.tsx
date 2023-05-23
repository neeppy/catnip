import { MouseEvent } from 'react';
import { useContextMenu } from 'react-contexify';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Color from 'color';
import classnames from 'classnames';
import { CONNECTION_CONTEXT_MENU } from '$module:globals';
import { AnyConnection } from 'common/models/Connection';
import { Button } from '$components';
import { FaTimes } from '$components/icons';
import { useBoolean } from 'ui/hooks';
import { useGrouping } from '../utils/useGrouping';
import { groupConnections } from '$module:connections/list';

interface OwnProps {
    connection: AnyConnection;
    color: string;
    hasFocus?: boolean;
    isActive?: boolean;
    isDragging?: boolean;
    onClick: () => Promise<void>;
}

export function ConnectionBubble({ connection, color, onClick, isActive, hasFocus, isDragging }: OwnProps) {
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

    const activeBubbleClass = classnames('absolute bottom-0 h-1 rounded-full shadow-top border-t border-black/25', {
        'inset-x-0 bg-green-300': isActive,
        'hidden': !isActive || hasConnectionError
    });

    const buttonClass = classnames('h-10 overflow-hidden text-white font-bold', {
        'ring-[2px] ring-white/50': hasFocus
    });

    const textColor = Color(color).isLight() ? '#000' : '#fff';

    return (
        <Button
            key={connection.id}
            ref={setNodeRef}
            shape="square" scheme="custom"
            className={buttonClass}
            style={{
                backgroundColor: color,
                color: textColor,
                opacity: isDragging ? '0' : '1',
                ...isGrouping && {
                    scale: '0.75'
                },
                ...(shouldAllowTransform || isDragging) && {
                    transform: CSS.Transform.toString(transform)
                },
                transitionProperty: isDragging ? 'none' : isAnyDragging ? 'all' : 'none'
            }}
            onClick={onBubbleClick}
            onContextMenu={event => handleContextMenu(event, connection)}
            {...attributes}
            {...listeners}
        >
            {connection.name.charAt(0).toUpperCase()}
            <span className={activeBubbleClass}/>
            {hasConnectionError && (
                <FaTimes className="absolute top-0.5 right-0.5 w-3 h-3 text-red-400"/>
            )}
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
