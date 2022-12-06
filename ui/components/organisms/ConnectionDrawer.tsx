import Modal from 'react-modal';
import { PropsWithChildren } from 'react';

interface OwnProps {
    isOpen: boolean;
}

Modal.setAppElement('#root');

export default function ConnectionDrawer({ isOpen, children }: PropsWithChildren<OwnProps>) {
    const modalRoot = document.getElementById('modals-root');

    if (!modalRoot) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen} shouldCloseOnEsc
            parentSelector={() => modalRoot}
            overlayClassName="absolute inset-0 bg-white bg-opacity-10 animate-fade-in-transparent"
            className="absolute left-0 top-0 w-96 h-full bg-scene-300 animate-slide-in-left"
        >
            {children}
        </Modal>
    );
}
