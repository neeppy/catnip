import { FormProvider, useForm } from 'react-hook-form';
import { Connection } from 'common/models/Connection';
import { ConnectionDetailsSection, SSHTunnelSection } from './sections';
import { Collapse } from 'ui-kit/Collapse';

export const ConnectionForm = ({}) => {
    const form = useForm<Connection>({ mode: 'onBlur' });

    return (
        <FormProvider {...form}>
            <div className="flex flex-col gap-5 mt-5">
                <ConnectionDetailsSection/>
                <Collapse title="SSH Tunnel Configuration" className="mt-5">
                    <SSHTunnelSection name="sshTunnelConfiguration"/>
                    <Collapse title="Jump Server Configuration" className="mt-10 w-full">
                        <SSHTunnelSection name="sshTunnelConfiguration.jumpConfiguration"/>
                    </Collapse>
                </Collapse>
            </div>
        </FormProvider>
    );
};
