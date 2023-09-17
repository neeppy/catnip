import classnames from 'classnames';
import { shallow } from 'zustand/shallow';
import { AnyConnection } from 'common/models/Connection';
import { FaChevronRight } from '$components/icons';
import { useActiveConnections } from '../../state';

interface OwnProps {
    connections: AnyConnection[];
    selected: string | null;
    loadingConnection: string | null;
    onLaunch?: (connection: AnyConnection, isActive?: boolean) => void;
}

const itemClass = (id: string, selected: string, disabled: boolean) => classnames('flex w-full items-center py-1 px-2 rounded-sm duration-200 select-none', {
    'bg-transparent-200': id === selected,
    'cursor-not-allowed': disabled,
    'cursor-pointer focus:bg-transparent-200 hover:bg-transparent-400': !disabled,
});

export function GroupConnectionList({
    selected,
    connections,
    loadingConnection,
    onLaunch,
}: OwnProps) {
    const { activeConnections, markActive } = useActiveConnections(state => state, shallow);

    const isAnyConnectionLoading = loadingConnection !== null;

    return (
        <ul className="flex flex-col gap-1 pt-2 pl-6">
            {connections.map(connection => (
                <li key={connection.id} className='w-full'>
                    <button
                        disabled={isAnyConnectionLoading}
                        className={itemClass(connection.id, selected ?? '', isAnyConnectionLoading)}
                        onDoubleClick={() => onDoubleClick(connection)}
                    >
                        {connection.name}
                        {loadingConnection === connection.id && (
                            <div className="loading loading-spinner loading-xs ml-auto" />
                        )}
                        {activeConnections.has(connection.id) && (
                            <FaChevronRight className="ml-auto"/>
                        )}
                    </button>
                </li>
            ))}
        </ul>
    );

    async function onDoubleClick(connection: AnyConnection) {
        if (isAnyConnectionLoading) return;

        await onLaunch?.(connection, activeConnections.has(connection.id));

        markActive(connection);
    }
}
