import { Input, Typography } from 'ui/components/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from 'ui/components/ui-kit/Select';
import enum2opt from 'ui/utils/enum2opt';
import { ConnectionDriver } from 'common/models/Connection';
import { SectionTitle } from 'ui/components/connections/form/components/SectionTitle';

export const ConnectionDetailsSection = () => {
    const { register } = useFormContext();

    return (
        <div className="p-3">
            <SectionTitle className="">
                Connection details
            </SectionTitle>
            <div className="grid grid-cols-4 gap-5 p-6">
                <Input label="Connection Name" containerClassName="col-span-2" {...register('name')} />
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
                <Input label="Hostname" containerClassName="col-span-3" {...register('hostname')} />
                <Input label="Port" placeholder="3306" {...register('port')} />
            </div>
            <SectionTitle className="mt-5">
                Database Parameters
            </SectionTitle>
            <div className="grid grid-cols-4 gap-5 p-6">
                <Input label="Database Name" containerClassName="col-span-4" {...register('databaseName')} />
                <Input label="Username" containerClassName="col-span-2" {...register('username')} />
                <Input label="Password" type="password" containerClassName="col-span-2" {...register('password')} selectOnFocus />
            </div>
        </div>
    );
};
