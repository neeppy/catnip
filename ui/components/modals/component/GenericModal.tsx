import { Modal, useModalRegistry } from 'ui/components/modals';
import classnames from 'classnames';
import { useBoolean } from 'ui/hooks';

const ANIMATION_DURATION = 200;

interface OwnProps {
    modal: Modal;
}

const optional = (check: boolean, value: any) => check ? value : undefined;

export default function GenericModal({ modal }: OwnProps) {
    const { boolean: isClosed, on: startCloseTransition } = useBoolean(false);
    const close = useModalRegistry(state => state.close);
    const { contentComponent: Component } = modal;

    const modalClassName = classnames([
        'fixed top-0 left-0 w-full h-full flex-center z-[10000]',
        'transition-all duration-200 animate-fade-in',
    ], { 'opacity-0': isClosed });

    const contentContainerClassName = classnames([
        'text-scene-default',
        'transition-transform duration-200 animate-scale-in-75',
    ], { 'scale-75': isClosed });

    function handleAnimatedModalClose() {
        startCloseTransition();

        setTimeout(() => close(modal.key), ANIMATION_DURATION);
    }

    const { closeOnBackdropClick } = modal.settings;

    return (
        <div key={modal.key} className={modalClassName}>
            <div className="absolute inset-0 bg-[#000a] z-[-1]" onClick={optional(closeOnBackdropClick, handleAnimatedModalClose)} />
            <div className={contentContainerClassName}>
                <Component {...modal.props} />
            </div>
        </div>
    );
}
