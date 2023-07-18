import { Button } from '$components';
import { FaInfoCircle } from '$components/icons';
import { useSettings } from 'ui/hooks';

interface OwnProps {
    clearChanges: VoidFn;
}

export function PersistenceCountdownToast({ clearChanges }: OwnProps) {
    const { settings } = useSettings();

    return (
        <div className="absolute bottom-10 right-10 w-96 h-12 bg-surface-400 flex items-center gap-2 p-2 rounded-sm">
            <FaInfoCircle className="text-xl" />
            <span className="mr-auto">Persisting...</span>
            <div className="absolute bottom-0 inset-x-0 h-1 rounded-full bg-surface-500">
                <div
                    className="absolute inset-y-0 left-0 bg-primary-500 animate-shrink"
                    style={{ animationDuration: `${settings.behaviour.autoPersistDelay}ms` }}
                />
            </div>
            <Button scheme="transparent" size="xs" onClick={clearChanges}>
                Undo
            </Button>
        </div>
    );
}
