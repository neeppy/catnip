import { useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { AnyTab, reorderTabs, TabHeader, useTabActivity } from '$module:tabs';
import { shallow } from 'zustand/shallow';
import { useContextMenu } from 'react-contexify';
import { TAB_CONTEXT_MENU } from '$module:globals';
import { equals } from 'ramda';

interface OwnProps {
    tabs: AnyTab[];
}

export function TabList({ tabs }: OwnProps) {
    const [currentConnectionTabs, setCurrentConnectionTabs] = useState(tabs || []);
    const [currentActiveTab, setCurrentTab] = useTabActivity(state => [state.currentActiveTab, state.setCurrentTab], shallow);
    const { show } = useContextMenu({ id: TAB_CONTEXT_MENU });
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: {
                    x: 10,
                    y: 10,
                }
            },
        })
    );

    useEffect(() => {
        if (!equals(currentConnectionTabs, tabs)) {
            console.log('new tabs', tabs);
            setCurrentConnectionTabs(tabs);
        }
    }, [tabs]);

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={tabs || []} strategy={horizontalListSortingStrategy}>
                {currentConnectionTabs.map(tab => (
                    <TabHeader
                        key={tab.id}
                        isActive={tab.id === currentActiveTab?.id}
                        tabId={tab.id}
                        connectionId={tab.connectionId}
                        label={tab.type === 'editor' ? tab.currentQuery : tab.currentTable}
                        onClick={() => setCurrentTab(tab)}
                        onContextMenu={event => show({ event, props: tab })}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { over, active } = event;

        if (over && over.id !== active.id) {
            const tab1 = currentConnectionTabs.find(tab => tab.id === active.id);
            const tab2 = currentConnectionTabs.find(tab => tab.id === over.id);

            if (!tab1 || !tab2) return;

            const fromIndex = currentConnectionTabs.indexOf(tab1);
            const toIndex = currentConnectionTabs.indexOf(tab2);

            setCurrentConnectionTabs(arrayMove(currentConnectionTabs, fromIndex, toIndex));
            await reorderTabs(tab1.connectionId, fromIndex, toIndex);
        }
    }
}
