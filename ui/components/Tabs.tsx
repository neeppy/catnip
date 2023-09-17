import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { Button, ButtonProps } from './Button';

interface ContextType {
    currentTab: string;
    setCurrentTab: (tab: string) => void;
}

const Context = createContext<ContextType>({
    currentTab: '',
    setCurrentTab: () => null,
});

interface OwnProps {
    initial?: string;
    tab?: string | null;
}

export function Tabs({ initial, tab, children }: PropsWithChildren<OwnProps>) {
    const [currentTab, setCurrentTab] = useState<string>(initial || '');

    useEffect(() => {
        if (tab && tab !== currentTab) {
            setCurrentTab(tab || '');
        }
    }, [tab]);

    const ctx = useMemo(() => ({
        currentTab,
        setCurrentTab,
    }), [currentTab]);

    return (
        <Context.Provider value={ctx}>
            {children}
        </Context.Provider>
    );
}

interface HeaderProps extends Omit<ButtonProps, 'ref'> {
    id: string;
    className?: string;
    activeClassName?: string;
    inactiveClassName?: string;
}

function TabHeader({ id, className, activeClassName, inactiveClassName, ...rest }: HeaderProps) {
    const ctx = useContext(Context);

    const btnClass = classnames(className, {
        [activeClassName || '']: ctx.currentTab === id,
        [inactiveClassName || '']: ctx.currentTab !== id,
    });

    return (
        <Button
            shape="flat"
            scheme="custom"
            className={btnClass}
            onClick={() => ctx.setCurrentTab(id)} {...rest}
        />
    );
}

interface ContentProps {
    id: string;
    className?: string;
}

function TabContent({ id, className, children }: PropsWithChildren<ContentProps>) {
    const ctx = useContext(Context);

    const containerClass = classnames(className, {
        'animate-fade-in-left': ctx.currentTab === id,
        'hidden': ctx.currentTab !== id,
    });

    return (
        <div className={containerClass}>
            {children}
        </div>
    );
}

Tabs.Header = TabHeader;
Tabs.Content = TabContent;
