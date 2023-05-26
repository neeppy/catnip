import 'react-contexify/dist/ReactContexify.css';
import './styles.css';
import { ConnectionContextMenu, GroupContextMenu } from '$module:connections';
import { TabContextMenu } from '$module:tabs';

export function AppContextMenu() {
    return (
        <>
            <ConnectionContextMenu/>
            <TabContextMenu/>
            <GroupContextMenu/>
        </>
    );
}
