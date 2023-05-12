import { useFormContext } from 'react-hook-form';
import { Input, InputProps } from '../Input';

interface StringProps extends InputProps {
    name: string;
}

export function String({ name, ...inputProps }: StringProps) {
    const form = useFormContext();

    return (
        <Input
            {...form.register(name)}
            {...inputProps}
        />
    );
}
