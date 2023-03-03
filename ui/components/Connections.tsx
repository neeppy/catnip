import { useQuery } from '@tanstack/react-query';
import ConnectionDrawer, { fetchConnections } from 'ui/components/connections/form';
import useBoolean from 'ui/hooks/useBoolean';
import { Button } from 'ui-kit';
import { Connection } from 'common/models/Connection';
import useMainPanel from 'ui/state/panel';
import { randomColor } from 'ui/utils/random';

// @todo - the sidebar version of this will be dropped
export default function Connections() {
    const initialiseMainPanel = useMainPanel(state => state.connect);
    const { data, isLoading } = useQuery(['connections'], {
        queryFn: fetchConnections
    });

    const { boolean: isOpen, on, off } = useBoolean(false);

    async function onConnectionClick(connection: Connection) {
        const metadata = await window.interop.connections.open(connection);

        initialiseMainPanel({
            connection,
            databaseNames: metadata.databases,
            tableNames: metadata.tables,
            currentDatabase: connection.databaseName,
        });
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
