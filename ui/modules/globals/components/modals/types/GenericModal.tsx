import { useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Modal } from '$module:globals';
import { useModalAnimationState } from 'ui/hooks';
import { VscChromeClose } from '$components/icons';
import { Button } from '$components';

interface OwnProps {
    modal: Modal;
}

const optional = (check: boolean, value: any) => check ? value : undefined;

export default function GenericModal({ modal }: OwnProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [state, handleAnimatedClose] = useModalAnimationState(modal.key, 200);
    const { contentComponent: Component } = modal;

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    const modalClassName = classnames('relative w-screen h-screen flex-center z-[10000] bg-transparent text-base-content', {
        'animate-fade-in': state === 'opening',
        'animate-fade-out': state === 'closing'
    });

    const contentContainerClassName = classnames('relative text-foreground-default max-h-[80%]', {
        'animate-scale-in': state === 'opening',
        'animate-scale-out': state === 'closing'
    });

    const {
        closeOnBackdropClick,
        showCloseButton
    } = modal.settings;

    return (
        <dialog key={modal.key} id={modal.key} role="dialog" ref={dialogRef} className={modalClassName}>
            <div className="absolute inset-0 bg-base-100/80 z-[-1]" onClick={optional(closeOnBackdropClick && state === 'open', handleAnimatedClose)} />
            <div className={contentContainerClassName}>
                {showCloseButton && (
                    <Button scheme="transparent" className="absolute top-2 right-2 z-10" onClick={handleAnimatedClose}>
                        <VscChromeClose/>
                    </Button>
                )}
                <Component {...modal.props} close={handleAnimatedClose} />
            </div>
        </dialog>
    );
}
