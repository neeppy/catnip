import { useFormContext } from 'react-hook-form';
import { useFormField } from 'ui/hooks/useFormField';
import { Input, InputProps } from '$components';

interface NumberProps extends InputProps {
    name: string;
}

export function Number$({ name, ...inputProps }: NumberProps) {
    const form = useFormContext();
    const config = useFormField(name);

    return (
        <Input
            type="number"
            {...form.register(name, {
                valueAsNumber: true
            })}
            {...config}
            {...inputProps}
        />
    );
}
