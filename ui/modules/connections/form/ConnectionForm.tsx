import { FormProvider, useForm } from 'react-hook-form';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { Button, Input, Tabs, Typography } from '$components';
import { insertConnection, updateConnection } from './queries';
import { useAtom } from 'jotai';
import { appModeState } from '$module:globals';
import { getMySQLTabsConfig } from './config/mysql.tabs.config';
import { getSQLiteTabs } from './config/sqlite.tabs.config';

interface OwnProps {
    initialValues?: AnyConnection;
}

const TabGetters = {
    [ConnectionDriver.MySQL]: getMySQLTabsConfig,
    [ConnectionDriver.SQLite]: getSQLiteTabs,
};

export const ConnectionForm = ({ initialValues }: OwnProps) => {
    const isEditMode = Boolean(initialValues);
    const [isAdvanced] = useAtom(appModeState);
    const form = useForm<AnyConnection>({
        mode: 'onBlur',
        defaultValues: initialValues || {
            driver: ConnectionDriver.MySQL,
        },
    });

    const driver = form.watch('driver');
    const tabs = TabGetters[driver](isAdvanced);

    return (
        <div className="bg-surface-400 w-[48rem] rounded-xl shadow-xl">
            <FormProvider {...form}>
                <div className="flex flex-col">
                    <Typography as="h2" intent="h1" className="px-6 pt-6">
                        Add connection
                    </Typography>
                    <div className="grid grid-cols-4 gap-5 p-6">
                        <Input label="Connection Name" className="col-span-2" {...form.register('name')} />
                    </div>
                    <div className="px-6">
                        <Tabs key={driver} layout="horizontal" tabs={tabs} />
                    </div>
                    <div className="flex justify-end items-center pb-6 pr-9">
                        <Button size="sm" onClick={form.handleSubmit(isEditMode ? updateConnection : insertConnection)}>
                            Save connection
                        </Button>
                    </div>
                </div>
            </FormProvider>
        </div>
    );
};
