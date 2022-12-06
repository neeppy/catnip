import { useQuery } from '@tanstack/react-query';
import { fetchConnections } from 'ui/data/connections';
import SideButton from 'ui/components/atoms/SideButton';
import ConnectionDrawer from 'ui/components/organisms/ConnectionDrawer';
import { useState } from 'react';

export default function Connections() {
    const { data, isLoading } = useQuery(['connections'], {
        queryFn: fetchConnections,
    });

    const [isOpen, toggleDrawer] = useState(false);

    return (
        <>
            <aside className="flex flex-col justify-start z-20">
                <div className="flex flex-col flex-1">
                    {data && !isLoading && data.length > 0 && data.map(connection => (
                        <button key={connection.id}>
                            {connection.displayName}
                        </button>
                    ))}
                </div>
                <SideButton className="bg-accent-500 m-1.5 mt-auto text-xl font-bold align-text-top" onClick={() => toggleDrawer(true)}>
                    +
                </SideButton>
                <ConnectionDrawer isOpen={isOpen} />
            </aside>
        </>
    );
}
