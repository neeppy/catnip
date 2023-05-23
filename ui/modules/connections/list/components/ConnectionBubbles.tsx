import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { shallow } from 'zustand/shallow';
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { themeState } from '$module:globals';
import { AnyConnection } from 'common/models/Connection';
import { randomColor } from 'ui/utils/random';
import { useConnections } from '../../state';
import { useConnectionOrder } from '../../list';
import { ConnectionGroup } from '../queries';
import { ConnectionBubble } from './ConnectionBubble';
import { ConnectionGroupBubble } from './ConnectionGroupBubble';

interface OwnProps {
    groups: ConnectionGroup[];
    connections: AnyConnection[];
    onActivate: (conn: AnyConnection) => Promise<void>;
}

export function ConnectionBubbles({ groups, connections, onActivate }: OwnProps) {
    const theme = useAtomValue(themeState);
    const [activeConnections, currentConnection] = useConnections(state => [state.activeConnections, state.currentActiveConnection], shallow);
    const [currentOrder, reorder] = useConnectionOrder(state => [state.order, state.reorder], shallow);
    const [currentDrag, setCurrentDrag] = useState<AnyConnection | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 150,
                tolerance: {
                    x: 10,
                    y: 10,
                }
            },
        })
    );

    const reorderedConnections = connections.slice()
        .sort((first, second) => {
            const ida = currentOrder.indexOf(first.id);
            const idb = currentOrder.indexOf(second.id);

            if (ida === -1) return 1;
            if (idb === -1) return -1;

            return ida - idb;
        });

    return (
        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="flex flex-col items-center gap-4">
                {groups.map(group => (
                    <ConnectionGroupBubble
                        key={group.id}
                        theme={theme}
                        group={group}
                        onActivate={onActivate}
                    />
                ))}
                <SortableContext items={currentOrder} strategy={verticalListSortingStrategy}>
                    {reorderedConnections.map(connection => (
                        <ConnectionBubble
                            key={connection.id}
                            color={randomColor(theme + connection.name)}
                            connection={connection}
                            onClick={() => {
                                console.log('clicked');
                                return onActivate(connection);
                            }}
                            hasFocus={currentConnection?.id === connection.id}
                            isActive={activeConnections.some(conn => conn.id === connection.id)}
                            isDragging={currentDrag?.id === connection.id}
                        />
                    ))}
                </SortableContext>
            </div>
            <DragOverlay>
                {currentDrag && (
                    <div
                        className="h-10 rounded-md opacity-75 scale-90 flex-center text-lg font-semibold text-white pointer-events-none"
                        style={{ backgroundColor: randomColor(theme + currentDrag.name) }}
                    >
                        {currentDrag.name.charAt(0).toUpperCase()}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );

    function handleDragStart(event: DragStartEvent) {
        setCurrentDrag(event.active.data.current?.connection as unknown as AnyConnection);
    }

    function handleDragEnd(event: DragEndEvent) {
        setCurrentDrag(null);

        if (event.over && event.over.data.current?.isGroup) {
            console.log('add to group', event.over.id, event.active.data.current);
        } else if (event.over && event.active.id !== event.over.id) {
            reorder(event.active.id as string, event.over.id as string);
        }
    }
}
