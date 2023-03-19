import { TableViewTab, EditorViewTab, EmptyTab } from 'ui/components/tabs';
import { ElementType } from 'react';
import { useActiveTab } from 'ui/hooks/useActiveTab';

const TAB_COMPONENTS = new Map(Object.entries({
    table: TableViewTab,
    editor: EditorViewTab,
    default: EmptyTab
}));

export default function MainScreen() {
    const currentTab = useActiveTab();

    const Component = TAB_COMPONENTS.get(currentTab?.type ?? 'default') as ElementType;

    return (
        <Component key={currentTab?.id} {...currentTab} />
    );
}
