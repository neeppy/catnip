import { useFormContext } from 'react-hook-form';
import classnames from 'classnames';
import { Button, Input } from '$components';
import { useFormField } from 'ui/hooks/useFormField';

interface OwnProps {
    name: string;
    inputClassName?: string;
    buttonClassName?: string;
}

export function File$({ name, inputClassName, buttonClassName }: OwnProps) {
    const { register, setValue } = useFormContext();
    const { input, button } = useFormField(name);

    const inputClass = classnames('col-span-3', inputClassName);
    const buttonClass = classnames('', buttonClassName);

    return (
        <div className="grid grid-cols-4 gap-5 p-6 items-end">
            <Input 
                className={inputClass} 
                {...input} 
                {...register(name)}
            />
            <Button 
                size="md" scheme="transparent" 
                className={buttonClass} 
                {...button} 
                onClick={browseFileSystem}
            >
                Browse...
            </Button>
        </div>
    );

    async function browseFileSystem() {
        const path = await interop.control.fileSystemSearch();

        path && setValue(name, path);
    }
}
