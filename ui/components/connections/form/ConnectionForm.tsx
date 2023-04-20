import { Controller, FormProvider, useForm } from 'react-hook-form';
import { AnyConnection, ConnectionDriver } from 'common/models/Connection';
import { Button, Input, Select, Tabs, Typography } from 'ui-kit';
import { insertConnection, updateConnection } from './queries';
import { useAtom } from 'jotai';
import { appModeState } from 'ui/state/global';
import { getMySQLTabsConfig } from './config/mysql.tabs.config';
import { getSQLiteTabs } from './config/sqlite.tabs.config';
import enum2opt from 'ui/utils/enum2opt';

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
        <div className="bg-scene-300 w-[48rem] rounded-xl shadow-xl">
            <FormProvider {...form}>
                <div className="flex flex-col">
                    <Typography as="h2" intent="h1" className="px-6 pt-6">
                        Add connection
                    </Typography>
                    <div className="grid grid-cols-4 gap-5 p-6">
                        <Input label="Connection Name" containerClassName="col-span-2" {...form.register('name')} />
                        <Controller
                            name="driver"
                            render={({ field }) => (
                                <Select
                                    label="Driver"
                                    containerClassName="col-span-2"
                                    options={enum2opt(ConnectionDriver)}
                                    {...field}
                                />
                            )}
                        />
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
