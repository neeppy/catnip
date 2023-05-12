import { useFormContext } from 'react-hook-form';
import { SectionTitle } from '$module:connections/form/components/SectionTitle';
import { Input } from '$components';

export function ConnectionDetailsSection() {
    const { register } = useFormContext();

    return (
        <div className="p-3">
            <SectionTitle className="">
                Connection Details
            </SectionTitle>
            <div className="grid grid-cols-4 gap-5 p-6">
                <Input label="Hostname" className="col-span-3" {...register('hostname')} />
                <Input label="Port" placeholder="3306" {...register('port')} />
            </div>
            <SectionTitle className="mt-5">
                Database Parameters
            </SectionTitle>
            <div className="grid grid-cols-4 gap-5 p-6">
                <Input label="Database Name" className="col-span-4" {...register('databaseName')} />
                <Input label="Username" className="col-span-2" {...register('username')} />
                <Input label="Password" type="password" className="col-span-2" {...register('password')} selectOnFocus />
            </div>
        </div>
    );
}

