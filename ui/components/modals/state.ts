import { ElementType } from 'react';
import { create } from 'zustand';

export enum ModalType {
    Modal = 'modal',
}

interface ModalSettings {
    closeOnBackdropClick: boolean;
}

export interface Modal {
    key: string;
    contentComponent: ElementType;
    type: ModalType;
    settings: ModalSettings;
    props: any;
}

interface OpenModal {
    key: string;
    contentComponent: ElementType;
    type?: ModalType;
    settings?: Partial<ModalSettings>;
    props?: any;
}

interface ModalState {
    registry: Modal[];
    open: (modal: OpenModal) => void;
    close: (key: string) => void;
}

const defaultModalSettings: ModalSettings = {
    closeOnBackdropClick: true
};

export const useModalRegistry = create<ModalState>(set => ({
    registry: [],
    open: modal => set(prevState => ({
        registry: [
            ...prevState.registry,
            {
                ...modal,
                type: modal.type || ModalType.Modal,
                settings: {
                    ...defaultModalSettings,
                    ...modal.settings,
                },
                props: modal.props || {},
            },
        ]
    })),
    close: key => set(prevState => ({ registry: prevState.registry.filter(modal => modal.key !== key) })),
}));
