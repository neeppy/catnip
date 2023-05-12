import { ComponentProps, useState } from 'react';
import { Button } from './Button';
import { Dropdown, DropdownProps } from './Dropdown';

interface SelectProps<T> extends DropdownProps<T> {
    scheme?: ComponentProps<typeof Button>['scheme'];
    triggerProps?: ComponentProps<typeof Button>;
    initialValue?: T;
}

export function Select<T = any>({
    initialValue,
    labelKey,
    scheme = 'transparent',
    triggerProps,
    value,
    onChange,
    ...dropdownProps
}: SelectProps<T>) {
    const [currentValue, setCurrentValue] = useState<T | null>(value ?? initialValue ?? null);

    const formatted = currentValue?.[labelKey] as string;

    return (
        <Dropdown labelKey={labelKey} value={currentValue as T} onChange={handleChange} {...dropdownProps}>
            <Dropdown.Trigger as={Button} scheme={scheme} {...triggerProps}>
                {formatted || 'Choose a value'}
            </Dropdown.Trigger>
        </Dropdown>
    );

    function handleChange(value: T) {
        if (currentValue !== value) {
            setCurrentValue(value);
            onChange?.(value);
        }
    }
}
