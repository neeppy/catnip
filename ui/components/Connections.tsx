import { useQuery } from '@tanstack/react-query';
import ConnectionDrawer, { fetchConnections } from 'ui/components/connections/form';
import useBoolean from 'ui/hooks/useBoolean';
import { Button } from 'ui-kit';
import { Connection, ConnectionDriver } from 'common/models/Connection';

const CONNECTION_DRIVER_LOGOS = {
    [ConnectionDriver.MySQL]: '/mysql.svg',
};

// @todo - the sidebar version of this will be dropped
export default function Connections() {
    const { data, isLoading } = useQuery(['connections'], {
        queryFn: fetchConnections
    });

    const { boolean: isOpen, on, off } = useBoolean(false);

    async function onConnectionClick(connection: Connection) {
        const tables = await window.interop.connections.open(connection);

        console.log(tables);
    }

    return (
        <>
            <aside className="flex flex-col justify-start z-20">
                <div className="flex flex-col flex-1">
                    {data && !isLoading && data.length > 0 && data.map(connection => (
                        <button key={connection.id} onClick={() => onConnectionClick(connection)}>
                            <img src={CONNECTION_DRIVER_LOGOS[connection.driver]} alt="" />
                        </button>
                    ))}
                </div>
                <Button scheme="accent" shape="square" size="none" className="m-1.5 mt-auto font-bold" onClick={on}>
                    +
                </Button>
            </aside>
            <ConnectionDrawer isOpen={isOpen} onClose={off}/>
        </>
    );
}
