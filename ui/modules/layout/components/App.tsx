import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryTab, fetchAllTabs } from '$module:tabs';
import { Tabs } from '$components';
import { Header } from './Header';

export const App = () => {
    const [currentOpenTab, setCurrentTab] = useState<string | null>(null);
    const { data: tabs, isLoading: areTabsLoading } = useQuery({
        queryKey: ['tabs'],
        queryFn: fetchAllTabs,
        onSuccess: data => setCurrentTab(data[0]?.id ?? null),
    });

    return (
        <div className="h-screen w-screen flex flex-col relativ overflow-hidden">
            <Tabs tab={currentOpenTab}>
                <Header>
                    <div className="flex gap-1 ml-1">
                        {tabs && tabs.map(tab => (
                            <Tabs.Header id={tab.id} key={tab.id} className="rounded-sm py-0.5 shadow-lg" activeClassName="bg-primary/50" inactiveClassName="bg-base-400">
                                {tab.id.substring(0, 8)}
                            </Tabs.Header>
                        ))}
                    </div>
                </Header>
                {tabs && tabs.map(tab => (
                    <Tabs.Content id={tab.id} key={tab.id} className="flex flex-col h-full">
                        <QueryTab {...tab} />
                    </Tabs.Content>
                ))}
            </Tabs>
        </div>
    );
};
