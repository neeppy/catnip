import { useModalRegistry } from 'ui/components/modals/state';
import GenericModal from 'ui/components/modals/component/GenericModal';

export function AppModals() {
    const registry = useModalRegistry(state => state.registry);

    return (
        <>
            {registry.map(modal => (
                <GenericModal key={modal.key} modal={modal} />
            ))}
        </>
    );
}
