import { DeepPartial, FormProvider, useForm } from 'react-hook-form';
import { PropsWithChildren } from 'react';
import { FormFieldsContext } from './context';

export * from './fields/Constant$';
export * from './fields/String$';
export * from './fields/Number$';
export * from './fields/Submit$';
export * from './fields/File$';

interface FormProps<T = any> {
    initialValues: DeepPartial<T>;
    config: Record<string, any> & {
        submit?: any;
    };
}

export function Form<T = any>({ initialValues, config, children }: PropsWithChildren<FormProps<T>>) {
    const form = useForm({
        mode: 'onBlur',
        defaultValues: initialValues
    });

    return (
        <FormFieldsContext.Provider value={config}>
            <FormProvider {...form}>
                {children}
            </FormProvider>
        </FormFieldsContext.Provider>
    );
}
