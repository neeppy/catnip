import { useEffect, useRef } from 'react';
import { useBoolean, useSettings } from 'ui/hooks';
import { CellChange } from '.';

type PersistFn = () => void;

export function usePersistence(changes: CellChange[], doPersist: PersistFn) {
    const smartTimerRef = useRef<any>(null);
    const { settings } = useSettings();
    const { boolean: isManualEnabled, on: enableManualMode, off: disableManualMode } = useBoolean(false);
    const { boolean: isScheduled, on: startScheduledPersistTimer, off: stopScheduledPersistTimer } = useBoolean(false);

    useEffect(() => {
        if (changes.length === 0) {
            cancelScheduledPersistence();
            return;
        } else switch (settings.behaviour.persistence) {
            case 'auto':
                doPersist();
                return;

            case 'smart':
                if (!smartTimerRef.current) {
                    startScheduledPersistTimer();
                    smartTimerRef.current = setTimeout(doPersist, settings.behaviour.autoPersistDelay);
                } else if (!isManualEnabled && changes.length === 1) {
                    clearTimeout(smartTimerRef.current);
                    stopScheduledPersistTimer();

                    smartTimerRef.current = setTimeout(doPersist, settings.behaviour.autoPersistDelay);
                    setTimeout(startScheduledPersistTimer, 20);
                } else if (changes.length > 1) {
                    clearTimeout(smartTimerRef.current);
                    enableManualMode();
                    stopScheduledPersistTimer();
                }

                return;

            case 'manual':
                enableManualMode();
                return;
        }
    }, [changes]);

    function cancelScheduledPersistence() {
        clearTimeout(smartTimerRef.current);
        smartTimerRef.current = null;
        stopScheduledPersistTimer();
        disableManualMode();
    }

    return { isManualEnabled, isScheduled, cancelScheduledPersistence };
}
