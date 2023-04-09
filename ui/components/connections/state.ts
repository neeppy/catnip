import { Connection } from 'common/models/Connection';
import { create } from 'zustand';

interface UseConnections {
    currentActiveConnection: Connection | null;
    activeConnections: Connection[];
    setActiveConnection: (conn: Connection) => void;
}

export const useConnections = create<UseConnections>(set => ({
    currentActiveConnection: null,
    activeConnections: [],
    setActiveConnection: conn => set(prevState => ({
        currentActiveConnection: conn,
        activeConnections: [conn, ...prevState.activeConnections],
    })),
}));
