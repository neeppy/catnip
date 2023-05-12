import { FormProvider, useForm } from 'react-hook-form';
import { ConnectionDriver, MySQLConnection } from 'common/models/Connection';
import { Constant } from '$components/form';

interface OwnProps {
    initialValues: Partial<MySQLConnection>;
}

export function MySQLForm({ initialValues }: OwnProps) {
    const form = useForm<MySQLConnection>({
        defaultValues: initialValues
    });

    return (
        <div className="bg-surface-400 w-[48rem] rounded-xl shadow-xl">
            <FormProvider {...form}>
                <Constant name="driver" value={ConnectionDriver.MySQL} />
            </FormProvider>
        </div>
    );
}
