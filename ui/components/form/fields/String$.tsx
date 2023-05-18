import { useFormContext } from 'react-hook-form';
import { Input, InputProps } from '../../Input';
import { useFormField } from 'ui/hooks/useFormField';

interface StringProps extends InputProps {
    name: string;
}

export function String$({ name, ...inputProps }: StringProps) {
    const form = useFormContext();
    const config = useFormField(name);

    return (
        <Input
            {...form.register(name)}
            {...config}
            {...inputProps}
        />
    );
}
