import 'react-contexify/dist/ReactContexify.css';
import 'assets/context-menu.css';
import { ConnectionContextMenu } from './ConnectionContextMenu';
import { TabContextMenu } from './TabContextMenu';

export function AppContextMenu() {
    return (
        <>
            <ConnectionContextMenu/>
            <TabContextMenu/>
        </>
    );
}
