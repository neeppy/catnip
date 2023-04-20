import { Item, ItemParams, Menu } from 'react-contexify';
import { CONNECTION_CONTEXT_MENU } from './types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useModalRegistry } from 'ui/components/modals';
import Connections from 'ui/components/connections';

export function ConnectionContextMenu() {
    const open = useModalRegistry(state => state.open);

    return (
        <Menu id={CONNECTION_CONTEXT_MENU} theme="dark" animation="scale" className="ml-4">
            <Item onClick={openEditModal}>
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

    function openEditModal({ props }: ItemParams) {
        open(Connections.Form, {
            props: { initialValues: props },
        });
    }
}
