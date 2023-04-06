import { useAtom } from 'jotai';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ConnectionDrawer, { fetchConnections } from 'ui/components/connections/form';
import useBoolean from 'ui/hooks/useBoolean';
import { Button } from 'ui-kit';
import { Connection } from 'common/models/Connection';
import { randomColor } from 'ui/utils/random';
import { activeConnection, createEmptyTableView, getConnectionTabs } from 'ui/components/tabs';

export default function Connections() {
    const queryClient = useQueryClient();
    const [, setActiveConnection] = useAtom(activeConnection);
    const { boolean: isOpen, on, off } = useBoolean(false);
    const { data, isLoading } = useQuery(['connections'], fetchConnections);

    async function onConnectionClick(connection: Connection) {
        const [tabs] = await Promise.all([
            queryClient.fetchQuery(['tabs', connection.id], () => getConnectionTabs(connection.id)),
            window.interop.connections.open(connection)
        ]);

        setActiveConnection(connection);

        if (tabs.length === 0) {
            await createEmptyTableView(connection.id, connection.databaseName);
            await queryClient.refetchQueries(['tabs', connection.id]);
        }
    }

    return (
        <>
            <aside className="flex h-[2.5rem] px-2 justify-start items-center z-20 py-1">
                <div className="flex items-center gap-4">
                    {data && !isLoading && data.length > 0 && data.map(connection => (
                        <Button
                            key={connection.id}
                            shape="round" size="sm" scheme="none"
                            className="w-7 h-7"
                            style={{ backgroundColor: randomColor(connection.name) }}
                            onClick={() => onConnectionClick(connection)}
                        >
                            <span className="text-scene-default font-bold">
                                {connection.name.charAt(0).toUpperCase()}
                            </span>
                        </Button>
                    ))}
                </div>
                <Button scheme="accent" size="sm" className="ml-auto font-bold w-7 h-7" onClick={on}>
                    +
                </Button>
            </aside>
            <ConnectionDrawer isOpen={isOpen} onClose={off}/>
        </>
    );
}
