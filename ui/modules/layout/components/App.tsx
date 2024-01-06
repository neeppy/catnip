import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QueryTab, fetchAllTabs, useIsOverview } from '$module:tabs';
import { Tabs } from '$components';
import { Header } from './Header';
import { Overview } from './overview/Overview';

export const App = () => {
    const [currentOpenTab, setCurrentTab] = useState<string | null>(null);
    const isOverview = useIsOverview();
    const { data: tabs, isLoading: areTabsLoading } = useQuery({
        queryKey: ['tabs'],
        queryFn: fetchAllTabs,
        onSuccess: data => setCurrentTab(data[0]?.id ?? null),
    });

    if (!tabs) return null;

    return (
        <div className="h-screen w-screen flex flex-col relativ overflow-hidden">
            <Header/>
            <Tabs tab={currentOpenTab}>
                {isOverview ? (
                    <Overview tabs={tabs} />
                ) : tabs.map(tab => (
                    <Tabs.Content id={tab.id} key={tab.id} className="flex flex-col h-full">
                        <QueryTab {...tab} />
                    </Tabs.Content>
                ))}
            </Tabs>
        </div>
    );
};
