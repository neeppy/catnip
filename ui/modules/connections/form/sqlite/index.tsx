import { ConnectionDriver, SQLiteConnection } from 'common/models/Connection';
import { Constant$, Form, String$, Submit$ } from '$components/form';
import { Typography } from '$components';
import formConfig from './form.config';
import { ConnectionDetailsSection } from './tabs/ConnectionDetailsSection';
import { insertConnection, updateConnection } from '$module:connections';
import { useQueryClient } from '@tanstack/react-query';

interface OwnProps {
    initialValues: Partial<SQLiteConnection>;
    close: () => void;
}

export function SQLiteForm({ initialValues, close }: OwnProps) {
    const queryClient = useQueryClient();

    async function handleSubmit(data: SQLiteConnection) {
        const saveConnection = initialValues ? updateConnection : insertConnection;

        await saveConnection(data);
        await queryClient.refetchQueries(['connections']);

        close();
    }

    return (
        <Form initialValues={initialValues} config={formConfig}>
            <div className="flex flex-col bg-surface-400 w-[32rem] h-full shadow-xl p-4 pt-6">
                <Typography as="h1" intent="h1" className="mb-8">
                    Connect to SQLite Database
                </Typography>
                <Constant$ name="driver" value={ConnectionDriver.SQLite} />
                <ConnectionDetailsSection />
                <div className="mt-auto">
                    <String$ name="name" />
                </div>
                <div className="mt-7 flex justify-end">
                    <Submit$ action={handleSubmit} />
                </div>
            </div>
        </Form>
    );
}
