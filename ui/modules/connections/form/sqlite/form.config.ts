import { SQLiteConnection } from 'common/models/Connection';

const formConfig: FormConfig<SQLiteConnection> = {
    name: {
        label: 'What should this connection be called?',
        placeholder: 'Connection Display Name'
    },
    path: {
        input: {
            label: 'SQLite Database Path',
        }
    },
    submit: {
        label: 'Save Connection'
    }
};

export default formConfig;
