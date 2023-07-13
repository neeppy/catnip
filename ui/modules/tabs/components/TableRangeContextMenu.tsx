import { Item, Menu, Submenu } from 'react-contexify';
import { TABLE_RANGE_CONTEXT_MENU } from 'ui/modules/globals';

export function TableRangeContextMenu() {
    return (
        <Menu id={TABLE_RANGE_CONTEXT_MENU} theme="dark" animation="scale">
            <Submenu label="Copy as">
                <Item>JSON</Item>
                <Item>CSV</Item>
                <Item>SQL Insert</Item>
            </Submenu>
        </Menu>
    );
}