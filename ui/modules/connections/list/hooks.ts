import { useQuery } from '@tanstack/react-query';
import { fetchConnections } from './queries';

export function useUngroupedConnectionsQuery() {
    return useQuery({
        queryKey: ['connections'],
        queryFn: fetchConnections,
    });
}
