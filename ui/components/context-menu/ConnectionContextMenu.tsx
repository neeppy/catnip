import { Item, Menu } from 'react-contexify';
import { CONNECTION_CONTEXT_MENU } from './types';
import { FaEdit, FaTrash } from 'react-icons/fa';

export function ConnectionContextMenu() {
    return (
        <Menu id={CONNECTION_CONTEXT_MENU} theme="dark" animation="scale" className="ml-4">
            <Item>
                <span className="inline-flex gap-3 items-center">
                    <FaEdit/>
                    Edit connection
                </span>
            </Item>
            <Item>
                <span className="inline-flex gap-3 items-center">
                    <FaTrash/>
                    Drop connection
                </span>
            </Item>
        </Menu>
    );
}
