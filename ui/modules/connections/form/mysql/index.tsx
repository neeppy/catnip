import { useAtomValue } from 'jotai';
import classnames from 'classnames';
import { ConnectionDriver, MySQLConnection } from 'common/models/Connection';
import { Constant$, Form, String$, Submit$ } from '$components/form';
import { Tabs, Typography } from '$components';
import { appModeState } from 'ui/modules/globals';
import formConfig from './form.config';
import { ConnectionDetailsSection } from './tabs/ConnectionDetailsSection';
import { SSHTunnelSection } from './tabs/SSHTunnelSection';
import { insertConnection, updateConnection } from '$module:connections';
import { useQueryClient } from '@tanstack/react-query';

interface OwnProps {
    initialValues: Partial<MySQLConnection>;
    close: () => void;
}

export function MySQLForm({ initialValues, close }: OwnProps) {
    const queryClient = useQueryClient();
    const isAdvanced = useAtomValue(appModeState);

    async function handleSubmit(data: MySQLConnection) {
        const saveConnection = initialValues ? updateConnection : insertConnection;

        await saveConnection(data);
        await queryClient.refetchQueries(['connections']);

        close();
    }

    const tabHeaderClass = classnames('border-r-8 rounded-l-md translate-x-2 py-4');

    const inactiveHeaderClass = classnames('bg-base-200 hover:bg-base-300 border-base-500');
    const activeHeaderClass = classnames('bg-base-500 border-primary');

    return (
        <Form initialValues={initialValues} config={formConfig}>
            <Tabs initial="connection">
                <div className="flex flex-col gap-1 absolute right-[100%] top-16">
                    <Tabs.Header id="connection" className={tabHeaderClass} inactiveClassName={inactiveHeaderClass} activeClassName={activeHeaderClass}>
                        Connection Details
                    </Tabs.Header>
                    {isAdvanced && (
                        <Tabs.Header id="ssh" className={tabHeaderClass} inactiveClassName={inactiveHeaderClass} activeClassName={activeHeaderClass}>
                            SSH Tunneling
                        </Tabs.Header>
                    )}
                </div>
                <div className="flex flex-col bg-base-200 w-[32rem] h-full shadow-xl pt-6">
                    <Typography as="h1" intent="h1" className="ml-4 mb-8">
                        Connect to MySQL Database
                    </Typography>
                    <Constant$ name="driver" value={ConnectionDriver.MySQL} />
                    <div className="overflow-y-auto px-4">
                        <Tabs.Content id="connection">
                            <ConnectionDetailsSection/>
                        </Tabs.Content>
                        <Tabs.Content id="ssh">
                            <SSHTunnelSection/>
                        </Tabs.Content>
                    </div>
                    <div className="mt-auto p-4 pt-8 z-10">
                        <String$ name="name" />
                        <div className="mt-7 flex justify-end">
                            <Submit$ action={handleSubmit} />
                        </div>
                    </div>
                </div>
            </Tabs>
        </Form>
    );
}
