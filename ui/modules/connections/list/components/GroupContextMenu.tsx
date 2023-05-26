import { Item, ItemParams, Menu } from 'react-contexify';
import { GROUP_CONTEXT_MENU } from '$module:globals';
import { FaTrash } from '$components/icons';
import { ConnectionGroup, deleteGroup } from '../queries';

export function GroupContextMenu() {
    return (
        <Menu id={GROUP_CONTEXT_MENU} theme="dark" animation="scale">
            <Item onClick={handleGroupSplit}>
                <span className="inline-flex gap-3 items-center">
                    <FaTrash/>
                    Split group
                </span>
            </Item>
        </Menu>
    );

    function handleGroupSplit({ props }: ItemParams<ConnectionGroup>) {
        if (!props) {
            console.debug('[Context Menu] handleGroupSplit was not passed a ConnectionGroup as props.');
            return;
        }

        return deleteGroup(props.id);
    }
}
