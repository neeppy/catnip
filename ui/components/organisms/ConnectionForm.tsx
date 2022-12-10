import { FormProvider, useForm } from 'react-hook-form';
import { Connection } from 'common/models/Connection';
import { ConnectionDetailsSection } from 'ui/components/molecules/connection-form';

export const ConnectionForm = ({}) => {
    const form = useForm<Connection>({ mode: 'onBlur' });

    return (
        <FormProvider {...form}>
            <div className="flex flex-col gap-5 mt-5">
                <ConnectionDetailsSection/>
            </div>
        </FormProvider>
    );
};
