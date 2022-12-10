import { Input } from 'ui/components/atoms';
import { useFormContext } from 'react-hook-form';
import { Select } from 'ui/components/atoms/Select';
import enum2opt from 'ui/utils/enum2opt';
import { ConnectionDriver } from 'common/models/Connection';

export const ConnectionDetailsSection = ({ }) => {
    const { register } = useFormContext();

    return (
        <>
            <Input label="Connection Name" {...register('name')} />
            <Select label="Database Type" options={enum2opt(ConnectionDriver)} />
            <div className="grid grid-cols-2 gap-5">
                <Input label="Hostname" {...register('hostname')} />
                <Input label="Port" {...register('port')} />
            </div>
        </>
    );
};
