import { Item, ItemParams, Menu, Separator, Submenu } from 'react-contexify';
import { FaEdit, FaPlus, FaTrash } from '$components/icons';
import { useModalRegistry, CONNECTION_CONTEXT_MENU } from '$module:globals';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { MySQLForm, SQLiteForm } from '../form';
import { ConnectionGroupForm } from '$module:connections/list/components/ConnectionGroupForm';

const driverComponent = {
    [ConnectionDriver.MySQL]: MySQLForm,
    [ConnectionDriver.SQLite]: SQLiteForm
};

export function ConnectionContextMenu() {
    const open = useModalRegistry(state => state.open);

    return (
        <Menu id={CONNECTION_CONTEXT_MENU} theme="dark" animation="scale">
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
            <Separator/>
            <Submenu label="Add to group">
                <Item onClick={openGroupModal}>
                    <span className="inline-flex gap-3 items-center">
                        <FaPlus/>
                        New Group...
                    </span>
                </Item>
            </Submenu>
        </Menu>
    );

    function openEditModal({ props }: ItemParams<AnyConnection>) {
        open(driverComponent[props!.driver], {
            type: 'drawer',
            props: { initialValues: props as any },
            settings: {
                placement: 'right'
            }
        });
    }

    function openGroupModal({ props }: ItemParams<AnyConnection>) {
        open(ConnectionGroupForm);
    }
}
