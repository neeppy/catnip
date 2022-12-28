import { useFormContext } from 'react-hook-form';
import { Input } from 'ui-kit';

interface OwnProps {
    name: string;
}

export function SSHTunnelSection({ name }: OwnProps) {
    const { register } = useFormContext();

    return (
        <div className="grid grid-cols-4 gap-5">
            <Input
                {...register(`${name}.hostname`)}
                label="Hostname"
                placeholder="example.com"
                containerClassName="col-span-3"
            />
            <Input
                {...register(`${name}.port`)}
                label="Port"
                placeholder="22"
            />
            <Input
                {...register(`${name}.username`)}
                label="Username"
                containerClassName="col-span-4"
            />
            <Input
                {...register(`${name}.password`)}
                label="Password"
                containerClassName="col-span-4"
            />
        </div>
    );
}
