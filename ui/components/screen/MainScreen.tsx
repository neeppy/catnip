import { TableViewTab, EditorViewTab, EmptyTab, useTabActivity } from 'ui/components/tabs';
import { ElementType } from 'react';

const TAB_COMPONENTS = new Map(Object.entries({
    table: TableViewTab,
    editor: EditorViewTab,
    default: EmptyTab
}));

export default function MainScreen() {
    const currentTab = useTabActivity(state => state.currentActiveTab);

    const Component = TAB_COMPONENTS.get(currentTab?.type ?? 'default') as ElementType;

    return (
        <Component key={currentTab?.id} {...currentTab} />
    );
}
