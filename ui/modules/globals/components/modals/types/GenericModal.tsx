import { Dialog } from '@headlessui/react';
import { VscChromeClose } from 'react-icons/vsc';
import classnames from 'classnames';
import { Modal } from '$module:globals';
import { useModalAnimationState } from 'ui/hooks';
import { Button } from '$components';

interface OwnProps {
    modal: Modal;
}

const optional = (check: boolean, value: any) => check ? value : undefined;

export default function GenericModal({ modal }: OwnProps) {
    const [state, handleAnimatedClose] = useModalAnimationState(modal.key, 200);
    const { contentComponent: Component } = modal;

    const modalClassName = classnames('fixed top-0 left-0 w-full h-full flex-center z-[10000]', {
        'animate-fade-in': state === 'opening',
        'animate-fade-out': state === 'closing'
    });

    const contentContainerClassName = classnames('relative text-foreground-default max-h-[80%] overflow-y-auto', {
        'animate-scale-in': state === 'opening',
        'animate-scale-out': state === 'closing'
    });

    const {
        closeOnBackdropClick,
        showCloseButton
    } = modal.settings;

    return (
        <Dialog open onClose={handleAnimatedClose} key={modal.key} role="dialog" className={modalClassName}>
            <Dialog.Overlay className="absolute inset-0 bg-[#000a] z-[-1]" onClick={optional(closeOnBackdropClick && state === 'open', handleAnimatedClose)} />
            <div className={contentContainerClassName}>
                {showCloseButton && (
                    <Button scheme="transparent" className="absolute top-2 right-2" onClick={handleAnimatedClose}>
                        <VscChromeClose/>
                    </Button>
                )}
                <Component {...modal.props} close={handleAnimatedClose} />
            </div>
        </Dialog>
    );
}
