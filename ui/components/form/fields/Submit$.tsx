import { Button, ButtonProps } from '$components';
import { useFormContext } from 'react-hook-form';
import { useFormField } from 'ui/hooks/useFormField';

interface SubmitProps extends ButtonProps {
    label?: string;
    action: (form: any) => unknown;
}

export function Submit$({ action, label, ...buttonProps }: SubmitProps) {
    const form = useFormContext();
    const { label: configLabel, ...otherProps } = useFormField('submit');

    async function handleFormSubmission(data: any) {
        console.debug('[form] submit triggered; data:', data);

        try {
            await action?.(data);
        } catch (error: any) {
            console.debug('[form] submission failed; error:', error);
        }
    }

    return (
        <Button
            {...otherProps}
            {...buttonProps}
            onClick={form.handleSubmit(handleFormSubmission)}
        >
            {label || configLabel || 'Submit'}
        </Button>
    );
}
