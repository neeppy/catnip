import { Item, Menu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { TABLE_CELL_CONTEXT_MENU } from 'ui/components/context-menu/types';

export function TableCellContextMenu() {
    return (
        <Menu id={TABLE_CELL_CONTEXT_MENU}>
            <Item>
                Test
            </Item>
        </Menu>
    );
}
