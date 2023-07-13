import { Item, ItemParams, Menu, Submenu } from 'react-contexify';
import { TABLE_CELL_CONTEXT_MENU } from '$module:globals';
import { FaEdit } from '$components/icons';

export function TableCellContextMenu() {
    return (
        <Menu id={TABLE_CELL_CONTEXT_MENU} theme="dark" animation="scale">
            <Item onClick={onEditClick}>
                <span className="inline-flex gap-3 items-center">
                    <FaEdit/>
                    <span>
                        Edit Cell
                    </span>
                </span>
            </Item>
            <Submenu label="Set value">
                <Item hidden={({ props }) => props.column.isNullable} onClick={setNull}>
                    Set&nbsp;<b>NULL</b>
                </Item>
            </Submenu>
        </Menu>
    );

    function onEditClick({ props }: ItemParams) {
        props?.enableEditing();
    }

    function setNull({ props }: ItemParams) {
        props?.setCellValue(null);
    }
}
