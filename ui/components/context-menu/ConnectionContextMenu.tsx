import { Item, ItemParams, Menu } from 'react-contexify';
import { CONNECTION_CONTEXT_MENU } from './types';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useModalRegistry } from 'ui/components/modals';
import ConnectionForm from 'ui/components/connections/form';

export function ConnectionContextMenu() {
    const openModal = useModalRegistry(state => state.open);

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
        openModal({
            key: 'connection-form',
            contentComponent: ConnectionForm,
            props: {
                initialValues: props
            },
        });
    }
}
