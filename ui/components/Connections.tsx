import { useQuery } from '@tanstack/react-query';
import { fetchConnections } from 'ui/data/connections';
import ConnectionDrawer from 'ui/components/organisms/ConnectionDrawer';
import useBoolean from 'ui/hooks/useBoolean';
import { Typography, Button } from 'ui/components/atoms';
import { ConnectionForm } from 'ui/components/organisms/ConnectionForm';

export default function Connections() {
    const { data, isLoading } = useQuery(['connections'], {
        queryFn: fetchConnections
    });

    const { boolean: isOpen, on, off } = useBoolean(false);

    return (
        <>
            <aside className="flex flex-col justify-start z-20">
                <div className="flex flex-col flex-1">
                    {data && !isLoading && data.length > 0 && data.map(connection => (
                        <button key={connection.id}>
                            {connection.name}
                        </button>
                    ))}
                </div>
                <Button scheme="accent" shape="square" size="none" className="m-1.5 mt-auto font-bold" onClick={on}>
                    +
                </Button>
            </aside>
            <ConnectionDrawer isOpen={isOpen} onClose={off}>
                <Typography as="h2" intent="h1">
                    Add connection
                </Typography>
                <ConnectionForm/>
            </ConnectionDrawer>
        </>
    );
}
