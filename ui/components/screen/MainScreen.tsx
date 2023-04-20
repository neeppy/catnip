import { EditorViewTab, EmptyTab, SingleDatabaseEditorTab, SingleDatabaseTableView, TableViewTab, useTabActivity } from 'ui/components/tabs';
import { useConnections } from 'ui/components/connections';
import { ConnectionDriver } from 'common/models/Connection';

const SCREEN_COMPONENTS: Record<string, any> = {
    [ConnectionDriver.SQLite]: {
        table: SingleDatabaseTableView,
        editor: SingleDatabaseEditorTab
    },
    default: {
        table: TableViewTab,
        editor: EditorViewTab
    }
};

export default function MainScreen() {
    const connection = useConnections(state => state.currentActiveConnection);
    const currentTab = useTabActivity(state => state.currentActiveTab);

    if (!connection || !currentTab) {
        return <EmptyTab/>;
    }

    const driverScreens = SCREEN_COMPONENTS[connection.driver] || SCREEN_COMPONENTS.default;
    const Component = driverScreens[currentTab.type] ?? EmptyTab;

    return (
        <Component key={currentTab?.id} {...currentTab} />
    );
}
