import { BooleanPredicate, Item, ItemParams, Menu, Separator, Submenu } from 'react-contexify';
import { FaEdit, FaPlus, FaTrash } from '$components/icons';
import { useModalRegistry, CONNECTION_CONTEXT_MENU } from '$module:globals';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { MySQLForm, SQLiteForm } from '../../form';
import { ConnectionGroupForm } from './ConnectionGroupForm';
import { ungroupConnections } from '$module:connections';

const driverComponent = {
    [ConnectionDriver.MySQL]: MySQLForm,
    [ConnectionDriver.SQLite]: SQLiteForm
};

export function ConnectionContextMenu() {
    const open = useModalRegistry(state => state.open);

    function isRootLevel() {
        return function ({ props }) {
            return !Boolean(props?.groupId);
        } as BooleanPredicate;
    }

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
            <Item hidden={isRootLevel()} onClick={removeFromGroup}>
                Remove from group
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

    function openGroupModal({ props }: ItemParams<AnyConnection>) {
        open(ConnectionGroupForm);
    }

    function removeFromGroup({ props }: ItemParams<AnyConnection>) {
        if (!props) return;

        return ungroupConnections(props);
    }
}
