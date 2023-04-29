export * from './state';
export * from './form';
export * from './utils';
export * from './list/ConnectionContextMenu';

import { Connections as ConnectionsList } from './list/Connections';
import { ConnectionForm } from './form/ConnectionForm';

const Connections = {
    List: ConnectionsList,
    Form: ConnectionForm
};

export default Connections;
