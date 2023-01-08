import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Connection } from 'common/models/Connection';
import { ConnectionDetailsSection, SSHTunnelSection } from './sections';
import { Button, Collapse, Typography } from 'ui-kit';
import { insertConnection } from './queries';

export const ConnectionForm = ({}) => {
    const id = useId();
    const form = useForm<Connection>({
        mode: 'onBlur',
    });

    return (
        <FormProvider {...form}>
            <div className="flex flex-col h-full">
                <Typography as="h2" intent="h1" className="px-6 pt-6">
                    Add connection
                </Typography>
                <div className="flex flex-1 flex-col gap-5 mt-5 p-6">
                    <input type="hidden" name="id" value={id} />
                    <ConnectionDetailsSection/>
                    <Collapse title="SSH Tunnel Configuration" className="mt-5">
                        <SSHTunnelSection name="sshTunnelConfiguration"/>
                        <Collapse title="Jump Server Configuration" className="mt-10 w-full">
                            <SSHTunnelSection name="sshTunnelConfiguration.jumpConfiguration"/>
                        </Collapse>
                    </Collapse>
                </div>
                <div className="flex justify-end items-center mt-5 p-6">
                    <Button onClick={form.handleSubmit(insertConnection)}>
                        Save connection
                    </Button>
                </div>
            </div>
        </FormProvider>
    );
};
