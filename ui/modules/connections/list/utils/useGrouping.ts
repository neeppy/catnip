import { DragEndEvent, DragMoveEvent, useDndMonitor } from '@dnd-kit/core';
import { AnyConnection } from 'common/models/Connection';
import { useBoolean } from 'ui/hooks';
import { debounce } from 'ui/utils/functions';

type GroupFunction = (conn1: AnyConnection, conn2: AnyConnection) => void;

export function useGrouping(connectionId: string, callback: GroupFunction) {
    const { boolean: shouldAllowTransform, on: allowTransform, off: disallowTransform } = useBoolean(false);
    const { boolean: isGrouping, on: enableGrouping, off: disableGrouping } = useBoolean(false);

    useDndMonitor({
        onDragMove: debounce(1, (event: DragMoveEvent) => {
            const { over, active } = event;

            if (over && over.data.current?.isGroup) return;

            // if another bubble is hovering THIS bubble
            if (over && over.id === connectionId && over.id !== active.id) {
                const { top, bottom, height } = over.rect;
                const { initial, translated } = active.rect.current;

                if (!initial || !translated) return;

                // if the dragging bubble was ABOVE this one
                if (initial.top < top) {
                    const firstQuarter = top + 0.25 * height;

                    if (translated.top > firstQuarter) {
                        allowTransform();
                        disableGrouping();
                    } else {
                        disallowTransform();
                        enableGrouping();
                    }
                } else {
                    const firstQuarter = bottom - 0.25 * height;

                    if (translated.bottom < firstQuarter) {
                        allowTransform();
                        disableGrouping();
                    } else {
                        disallowTransform();
                        enableGrouping();
                    }
                }
            } else if (!over || over.id !== connectionId) {
                disableGrouping();
            }
        }),
        onDragEnd(event: DragEndEvent) {
            if (!event.over) return;
            if (event.over.id === event.active.id) return;
            if (event.over.id !== connectionId) return;
            if (!event.over.data.current || !event.over.data.current.isGrouping) return;

            const firstConnection =  event.active.data.current?.connection as unknown as AnyConnection;
            const secondConnection = event.over.data.current.connection as unknown as AnyConnection;

            callback(firstConnection, secondConnection);
        }
    });

    return { shouldAllowTransform, isGrouping } as const;
}
