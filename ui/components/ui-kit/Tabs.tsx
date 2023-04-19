import classnames from 'classnames';
import { ElementType, useState } from 'react';
import { Button } from 'ui-kit/Button';

interface Tab {
    key: string;
    label: string;
    component: ElementType;
    props?: any;
}

interface OwnProps {
    layout: 'vertical' | 'horizontal';
    tabs: Tab[];
}

export function Tabs({
    layout = 'horizontal',
    tabs = [],
}: OwnProps) {
    const [currentTab, setCurrentTab] = useState(0);

    const containerClass = classnames('flex', {
        'flex-col': layout === 'vertical'
    });

    const listClass = classnames('flex', {
        'flex-col border-r border-[#fff1]': layout === 'horizontal',
    });

    const contentClass = classnames('flex-1');

    const tabClass = (isActive: boolean) => classnames('text-right', {
        'bg-[#fff2] text-scene-default': isActive
    });

    return (
        <div className={containerClass}>
            <div className={listClass}>
                {tabs.map((tab, idx) => (
                    <Button
                        key={tab.key}
                        size="sm" shape="none" scheme="transparent" layout="none"
                        className={tabClass(idx === currentTab)}
                        onClick={() => setCurrentTab(idx)}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>
            <div className={contentClass}>
                {tabs.map((tab, idx) => (
                    <div key={tab.key} className={currentTab !== idx ? 'hidden' : ''}>
                        <tab.component {...tab.props} />
                    </div>
                ))}
            </div>
        </div>
    );
}
