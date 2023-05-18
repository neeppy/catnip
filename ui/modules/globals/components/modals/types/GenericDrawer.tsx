import classnames from 'classnames';
import { Dialog } from '@headlessui/react';
import { cva } from 'class-variance-authority';
import { Button } from '$components';
import { VscChromeClose } from '$components/icons';
import { Modal } from '$module:globals';
import { useModalAnimationState } from 'ui/hooks';

interface OwnProps {
    modal: Modal;
}

const optional = (check: boolean, value: any) => check ? value : undefined;

const getDrawerClass = cva('', {
    variants: {
        placement: {
            top: 'top-0 inset-x-0',
            left: 'left-0 inset-y-0',
            right: 'right-0 inset-y-0',
            bottom: 'bottom-0 inset-x-0',
        },
        state: {
            opening: '',
            open: '',
            closing: '',
        },
    },
    compoundVariants: [
        {
            placement: 'top',
            state: 'opening',
            className: 'animate-slide-in-top',
        },
        {
            placement: 'left',
            state: 'opening',
            className: 'animate-slide-in-left',
        },
        {
            placement: 'right',
            state: 'opening',
            className: 'animate-slide-in-right',
        },
        {
            placement: 'bottom',
            state: 'opening',
            className: 'animate-slide-in-bottom',
        },
        {
            placement: 'top',
            state: 'closing',
            className: 'animate-slide-out-top',
        },
        {
            placement: 'left',
            state: 'closing',
            className: 'animate-slide-out-left',
        },
        {
            placement: 'right',
            state: 'closing',
            className: 'animate-slide-out-right',
        },
        {
            placement: 'bottom',
            state: 'closing',
            className: 'animate-slide-out-bottom',
        },
    ]
});

export default function GenericDrawer({ modal }: OwnProps) {
    const [state, handleAnimatedClose] = useModalAnimationState(modal.key, 200);
    const { contentComponent: Component } = modal;

    const {
        placement,
        closeOnBackdropClick,
        showCloseButton
    } = modal.settings;

    const modalClassName = classnames('fixed top-0 left-0 w-full h-full z-[10000]', {
        'animate-fade-in': state === 'opening',
        'animate-fade-out': state === 'closing'
    });

    const contentContainerClassName = classnames('absolute text-foreground-default', getDrawerClass({ placement, state }));

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
