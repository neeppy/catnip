import { useContext } from 'react';
import { FormFieldsContext } from '$components/form/context';

export function useFormField(name: string): any {
    const config = useContext(FormFieldsContext);

    return config?.[name] || {};
}
