import { ComponentType, ElementType } from 'react';
import { create } from 'zustand';

type PropsOf<T> = T extends ComponentType<infer P> ? P : never;
type AnyComponent = ComponentType<any>;

type ModalType = 'modal' | 'drawer';

interface ModalSettings {
    placement: 'top' | 'left' | 'bottom' | 'right';
    closeOnBackdropClick: boolean;
    showCloseButton: boolean;
}

export interface Modal {
    key: string;
    contentComponent: ElementType;
    type: ModalType;
    settings: ModalSettings;
    props: any;
}

interface OpenModal<T = any> {
    key?: string;
    type?: ModalType;
    settings?: Partial<ModalSettings>;
    props?: Omit<T, 'close'>;
}

interface ModalState {
    registry: Modal[];
    open: <T extends AnyComponent>(contentComponent: T, params?: OpenModal<PropsOf<T>>) => void;
    close: (key: string) => void;
}

const defaultModalSettings: ModalSettings = {
    placement: 'left',
    closeOnBackdropClick: true,
    showCloseButton: true,
};

export const useModalRegistry = create<ModalState>(set => ({
    registry: [],
    open: (contentComponent, params) => set(prevState => ({
        registry: [
            ...prevState.registry,
            {
                contentComponent,
                ...params,
                key: params?.key || Math.random().toString(36),
                type: params?.type || 'modal',
                settings: {
                    ...defaultModalSettings,
                    ...params?.settings,
                },
                props: params?.props || {},
            },
        ]
    })),
    close: key => set(prevState => ({ registry: prevState.registry.filter(modal => modal.key !== key) })),
}));
