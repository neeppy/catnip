import { Input } from 'ui/components/ui-kit';
import { Controller, useFormContext } from 'react-hook-form';
import { Select } from 'ui/components/ui-kit/Select';
import enum2opt from 'ui/utils/enum2opt';
import { ConnectionDriver } from 'common/models/Connection';

export const ConnectionDetailsSection = () => {
    const { register } = useFormContext();

    return (
        <>
            <div className="grid grid-cols-4 gap-5">
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
            <Input label="Username" {...register('username')} />
            <Input label="Password" type="password" {...register('password')} />
        </>
    );
};
