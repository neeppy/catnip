import { AnyConnection } from 'common/models/Connection';
import { create } from 'zustand';

interface UseConnections {
    currentActiveConnection: AnyConnection | null;
    activeConnections: AnyConnection[];
    setActiveConnection: (conn: AnyConnection) => void;
}

export const useConnections = create<UseConnections>(set => ({
    currentActiveConnection: null,
    activeConnections: [],
    setActiveConnection: conn => set(prevState => ({
        currentActiveConnection: conn,
        activeConnections: [conn, ...prevState.activeConnections],
    })),
}));

interface UseActiveConnections {
    activeConnections: Map<string, AnyConnection>;
    markActive: (conn: AnyConnection) => void;
}

export const useActiveConnections = create<UseActiveConnections>(set => ({
    activeConnections: new Map([]),
    markActive: conn => set(prevState => ({
        activeConnections: prevState.activeConnections.set(conn.id, conn),
    })),
}));
