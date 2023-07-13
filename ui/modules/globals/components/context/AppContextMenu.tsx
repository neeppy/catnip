import 'react-contexify/dist/ReactContexify.css';
import './styles.css';
import { ConnectionContextMenu, GroupContextMenu } from '$module:connections';
import { TabContextMenu, TableCellContextMenu, TableRangeContextMenu } from '$module:tabs';

export function AppContextMenu() {
    return (
        <>
            <ConnectionContextMenu/>
            <TabContextMenu/>
            <GroupContextMenu/>
            <TableCellContextMenu/>
            <TableRangeContextMenu/>
        </>
    );
}
