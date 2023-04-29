import { ConnectionDriver } from 'common/models/Connection';
import { EmptyTab, useTabActivity } from '$module:tabs';
import { useConnections } from '$module:connections';
import { EditorViewTab, SingleDatabaseEditorTab } from '$module:tabs/editor';
import { SingleDatabaseTableView, TableViewTab } from '$module:tabs/tables';

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

export function MainScreen() {
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
