import Modal from 'react-modal';
import { Typography } from 'ui/components/ui-kit';
import { ConnectionForm } from 'ui/components/connections/form/ConnectionForm';
import { Scrollbars } from 'react-custom-scrollbars-2';

interface OwnProps {
    isOpen: boolean;
    onClose: () => unknown;
}

Modal.setAppElement('#root');

export function ConnectionDrawer({ isOpen, onClose }: OwnProps) {
    const modalRoot = document.getElementById('modals-root');

    if (!modalRoot) {
        return null;
    }

    return (
        <Modal
            isOpen={isOpen}
            shouldCloseOnEsc
            onRequestClose={onClose}
            parentSelector={() => modalRoot}
            overlayClassName="absolute inset-0 bg-white bg-opacity-10"
            className="absolute left-0 top-0 w-[26rem] h-full bg-surface-100 p-6 animate-slide-in-left overflow-y-auto"
        >
            <Scrollbars autoHide autoHideDuration={200}>
                <Typography as="h2" intent="h1">
                    Add connection
                </Typography>
                <ConnectionForm/>
            </Scrollbars>
        </Modal>
    );
}
