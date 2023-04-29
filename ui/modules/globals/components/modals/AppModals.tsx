import GenericModal from './types/GenericModal';
import { useModalRegistry } from '../../state';

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
