import { Modal, useModalRegistry } from 'ui/components/modals';
import classnames from 'classnames';
import { useBoolean } from 'ui/hooks';
import { VscChromeClose } from 'react-icons/vsc';
import { useLayoutEffect, useRef } from 'react';

const ANIMATION_DURATION = 200;

interface OwnProps {
    modal: Modal;
}

const optional = (check: boolean, value: any) => check ? value : undefined;

export default function GenericModal({ modal }: OwnProps) {
    const { boolean: isOpening, on: startOpenTransition, off: stopOpenTransition } = useBoolean(false);
    const { boolean: isClosing, on: startCloseTransition } = useBoolean(false);
    const close = useModalRegistry(state => state.close);
    const { contentComponent: Component } = modal;

    useLayoutEffect(() => {
        startOpenTransition();

        setTimeout(stopOpenTransition, ANIMATION_DURATION);
    }, []);

    const modalClassName = classnames([
        'fixed top-0 left-0 w-full h-full flex-center z-[10000]',
        'transition-all duration-200',
    ], {
        'animate-fade-in': isOpening,
        'opacity-0': isClosing
    });

    const contentContainerClassName = classnames([
        'relative text-scene-default max-h-[80%] overflow-y-auto',
        'transition-transform duration-200',
    ], {
        'animate-scale-in-75': isOpening,
        'scale-75': isClosing
    });

    function handleAnimatedModalClose() {
        startCloseTransition();

        setTimeout(() => close(modal.key), ANIMATION_DURATION);
    }

    const {
        closeOnBackdropClick,
        showCloseButton
    } = modal.settings;

    return (
        <div key={modal.key} role="dialog" className={modalClassName}>
            <div className="absolute inset-0 bg-[#000a] z-[-1]" onClick={optional(closeOnBackdropClick, handleAnimatedModalClose)} />
            <div className={contentContainerClassName}>
                {showCloseButton && (
                    <button className="absolute top-2 right-2" onClick={handleAnimatedModalClose}>
                        <VscChromeClose/>
                    </button>
                )}
                <Component {...modal.props} close={handleAnimatedModalClose} />
            </div>
        </div>
    );
}
