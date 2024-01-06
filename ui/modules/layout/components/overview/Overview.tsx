import { Tab } from '$module:tabs';
import { groupBy } from 'ramda';
import { useUngroupedConnectionsQuery } from '$module:connections';
import { AnyConnection } from 'common/models/Connection';
import { Tabs } from '$components';

interface OwnProps {
    tabs: Tab[];
}

export function Overview({ tabs }: OwnProps) {
    const { data: connections } = useUngroupedConnectionsQuery();
    const byConnection = groupBy(tab => tab.connectionId, tabs);

    if (!connections) return null;

    const mappedTabs = new Map<AnyConnection, Tab[]>();

    connections.forEach(conn => mappedTabs.set(conn, byConnection[conn.id]));

    return (
        <div className="flex w-screen h-screen">
            <div className="w-64 bg-base-300">
                <div className="flex flex-col items-center justify-center h-full">
                    {Array.from(mappedTabs.keys()).map(connection => (
                        <div key={connection.id}>
                            {connection.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1">
                <div className="flex flex-col items-center justify-center h-full">
                    {Array.from(mappedTabs).map(([connection, tabs]) => (
                        <div key={connection.id} className="flex gap-4 items-center justify-left w-full">
                            {tabs.map(tab => (
                                <Tabs.Header key={tab.id} id={tab.id} className="w-10 truncate">
                                    {tab.editorContent}
                                </Tabs.Header>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
