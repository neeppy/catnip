import { BooleanPredicate, Item, Menu, Separator, Submenu } from 'react-contexify';
import { useQuery } from '@tanstack/react-query';
import { FaTable, FaTerminal } from '$components/icons';
import { TAB_CONTEXT_MENU } from '$module:globals';
import { fetchConnections } from '$module:connections/list';
import { AnyTab } from '$module:tabs';

export function TabContextMenu() {
    const { data: connections } = useQuery(['connections'], fetchConnections);

    function isHidden(type: AnyTab['type']) {
        return function ({ props }) {
            const tab = props as AnyTab;

            return tab.type === type;
        } as BooleanPredicate;
    }

    return (
        <Menu id={TAB_CONTEXT_MENU} theme="dark" animation="scale">
            <Item hidden={isHidden('editor')}>
                <span className="inline-flex gap-3 items-center">
                    <FaTerminal/>
                    <span>
                        Change to <b>Editor</b> tab
                    </span>
                </span>
            </Item>
            <Item hidden={isHidden('table')}>
                <span className="inline-flex gap-3 items-center">
                    <FaTable/>
                    <span>
                        Change to <b>Table</b> tab
                    </span>
                </span>
            </Item>
            <Separator/>
            <Item>
                Close tab
            </Item>
            <Item>
                Close all except this tab
            </Item>
            <Separator/>
            <Item>
                Duplicate tab
            </Item>
            <Submenu label="Duplicate in connection" disabled={!connections}>
                {connections?.map(connection => (
                    <Item key={connection.id}>
                        {connection.name}
                    </Item>
                ))}
            </Submenu>
        </Menu>
    );
}
