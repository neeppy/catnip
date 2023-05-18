import { Item, ItemParams, Menu } from 'react-contexify';
import { FaEdit, FaTrash } from '$components/icons';
import { useModalRegistry, CONNECTION_CONTEXT_MENU } from '$module:globals';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { MySQLForm, SQLiteForm } from '../form';

const driverComponent = {
    [ConnectionDriver.MySQL]: MySQLForm,
    [ConnectionDriver.SQLite]: SQLiteForm
};

export function ConnectionContextMenu() {
    const open = useModalRegistry(state => state.open);

    return (
        <Menu id={CONNECTION_CONTEXT_MENU} theme="dark" animation="scale" className="-translate-y-8">
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

    function openEditModal({ props }: ItemParams<AnyConnection>) {
        open(driverComponent[props!.driver], {
            type: 'drawer',
            props: { initialValues: props as any },
            settings: {
                placement: 'right'
            }
        });
    }
}
