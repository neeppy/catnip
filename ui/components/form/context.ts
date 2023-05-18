import { createContext } from 'react';

interface FormConfig {
    [key: string]: Record<string, unknown>;
}

export const FormFieldsContext = createContext<FormConfig>({});
