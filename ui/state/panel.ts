import { create } from 'zustand';
import { Connection } from 'common/models/Connection';
import { DatabaseRow } from 'common/models/Database';

interface PanelState {
    currentDatabase?: string | null;
    currentTable?: string | null;
    currentRows?: DatabaseRow[];
    tableNames?: string[];
    connect: (initialState: Partial<ConnectedPanelState>) => void;
    updateConnectionData: (state: Partial<ConnectedPanelState>) => void;
}

interface ConnectedPanelState extends PanelState {
    isConnected: true;
    connection: Connection;
    databaseNames: string[];
}

interface DisconnectedState extends PanelState {
    isConnected: false;
    connection: null;
    databaseNames: [];
}

const useMainPanel = create<ConnectedPanelState | DisconnectedState>(set => ({
    isConnected: false,
    connection: null,
    databaseNames: [],
    connect: (panel) => set({ isConnected: true, ...panel }),
    updateConnectionData: (panel) => set({ ...panel }),
}));

export default useMainPanel;
