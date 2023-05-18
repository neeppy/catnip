import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Button, ButtonProps } from './Button';
import classnames from 'classnames';

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
}

export function Tabs({ initial, children }: PropsWithChildren<OwnProps>) {
    const [currentTab, setCurrentTab] = useState<string>(initial || '');

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
}

function TabContent({ id, children }: PropsWithChildren<ContentProps>) {
    const ctx = useContext(Context);

    if (ctx.currentTab !== id) return null;

    return (
        <div className="animate-fade-in-left">
            {children}
        </div>
    );
}

Tabs.Header = TabHeader;
Tabs.Content = TabContent;
