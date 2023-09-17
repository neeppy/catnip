import { useState } from 'react';
import classnames from 'classnames';
import { AnyConnection } from 'common/models/Connection';
import { ModalGenericProps } from '$module:globals';
import { ConnectionsList } from './ConnectionsList';
import { TablesList } from './TablesList';

export function ConnectionDrawer({ close }: ModalGenericProps) {
    const [focusedConnection, setFocusedConnection] = useState<AnyConnection | null>(null);

    const drawerClass = classnames('flex duration-200 h-full', {
        'w-64': focusedConnection === null,
        'w-128': focusedConnection !== null,
    });

    return (
        <div className={drawerClass}>
            <ConnectionsList
                focusedConnection={focusedConnection}
                focusOtherConnection={setFocusedConnection}
            />
            {focusedConnection !== null && (
                <TablesList focusedConnection={focusedConnection} close={close} />
            )}
        </div>
    );
}
