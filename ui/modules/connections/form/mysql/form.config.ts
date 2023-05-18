import { MySQLConnection } from 'common/models/Connection';

const formConfig: FormConfig<MySQLConnection> = {
    name: {
        label: 'What should this connection be called?',
        placeholder: 'Connection Display Name'
    },
    hostname: {
        label: 'Hostname',
        placeholder: 'localhost',
    },
    port: {
        label: 'Port',
        placeholder: '3306',
    },
    databaseName: {
        label: 'Connect to a specific database?',
        placeholder: 'Database Name',
    },
    username: {
        label: 'Username',
        placeholder: 'root',
    },
    password: {
        type: 'password',
        label: 'Password',
        selectOnFocus: true,
    },
    'sshTunnelConfiguration.hostname': {
        label: 'Hostname',
        placeholder: 'localhost',
    },
    'sshTunnelConfiguration.port': {
        label: 'Port',
        placeholder: '3306',
    },
    'sshTunnelConfiguration.username': {
        label: 'Username',
        placeholder: 'root',
    },
    'sshTunnelConfiguration.password': {
        type: 'password',
        label: 'Password',
        selectOnFocus: true,
    },
    'sshTunnelConfiguration.jumpConfiguration.hostname': {
        label: 'Hostname',
        placeholder: 'localhost',
    },
    'sshTunnelConfiguration.jumpConfiguration.port': {
        label: 'Port',
        placeholder: '3306',
    },
    'sshTunnelConfiguration.jumpConfiguration.username': {
        label: 'Username',
        placeholder: 'root',
    },
    'sshTunnelConfiguration.jumpConfiguration.password': {
        type: 'password',
        label: 'Password',
        selectOnFocus: true,
    },
    submit: {
        label: 'Save Connection'
    }
};

export default formConfig;
