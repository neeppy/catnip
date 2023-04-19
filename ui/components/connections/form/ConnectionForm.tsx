import { FormProvider, useForm } from 'react-hook-form';
import { Connection } from 'common/models/Connection';
import { ConnectionDetailsSection, SSHTunnelSection } from './sections';
import { Button, Tabs, Typography } from 'ui-kit';
import { insertConnection } from './queries';
import { useAtom } from 'jotai';
import { appModeState } from 'ui/state/global';

const getTabs = (isAdvanced: boolean) => [
    {
        key: 'connection',
        label: 'Connection',
        component: ConnectionDetailsSection,
    },
    ...isAdvanced ? [{
        key: 'ssh',
        label: 'SSH',
        component: SSHTunnelSection,
    }] : [],
];

interface OwnProps {
    initialValues: Connection;
}

export const ConnectionForm = ({ initialValues }: OwnProps) => {
    const [isAdvanced] = useAtom(appModeState);
    const form = useForm<Connection>({
        mode: 'onBlur',
        defaultValues: initialValues,
    });

    const tabs = getTabs(isAdvanced);

    return (
        <div className="bg-scene-300 w-[48rem] rounded-xl shadow-xl">
            <FormProvider {...form}>
                <div className="flex flex-col">
                    <Typography as="h2" intent="h1" className="px-6 pt-6">
                        Add connection
                    </Typography>
                    <div className="p-6">
                        <Tabs layout="horizontal" tabs={tabs} />
                    </div>
                    <div className="flex justify-end items-center pb-6 pr-9">
                        <Button size="sm" onClick={form.handleSubmit(insertConnection)}>
                            Save connection
                        </Button>
                    </div>
                </div>
            </FormProvider>
        </div>
    );
};
