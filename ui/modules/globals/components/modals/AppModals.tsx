import GenericModal from './types/GenericModal';
import GenericDrawer from './types/GenericDrawer';
import { useModalRegistry } from '../../state';

const ModalComponent = {
    modal: GenericModal,
    drawer: GenericDrawer,
} as const;

export function AppModals() {
    const registry = useModalRegistry(state => state.registry);

    return (
        <>
            {registry.map(modal => {
                const Modal = ModalComponent[modal.type];

                return (
                    <Modal key={modal.key} modal={modal}/>
                );
            })}
        </>
    );
}
