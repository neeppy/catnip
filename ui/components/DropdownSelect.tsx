import { Fragment, useState } from 'react';
import { cva } from 'class-variance-authority';
import { Combobox } from '@headlessui/react';
import classnames from 'classnames';
import { Button } from './Button';
import { IOption } from './Select';

interface OwnProps {
    placeholder?: string;
    initialValue?: string | null;
    options: IOption[];
    onChange?: (value: string) => void;
    format?: (value: string) => string;
}

const getDropdownClassName = cva('rounded-md animate-slide-fade-bottom overflow-hidden absolute top-14 max-h-64 min-w-[10rem] overflow-y-auto z-10', {
    variants: {
        variant: {
            default: 'bg-surface-600 shadow-lg shadow-surface-200'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

const getOptionClassName = cva('cursor-pointer', {
    variants: {
        variant: {
            default: 'text-foreground-default text-xs py-1'
        },
        size: {
            sm: 'px-2 py-1',
            md: 'px-4 py-3'
        },
        active: {
            true: 'bg-transparent-400',
            false: null
        },
        selected: {
            true: 'bg-transparent-300 font-bold'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'md'
    }
});

export function DropdownSelect({
    placeholder,
    initialValue,
    options = [],
    onChange,
    format,
}: OwnProps) {
    const [currentValue, setCurrentValue] = useState(initialValue ?? null);

    function handleValueChange(value: string) {
        if (value === currentValue) return;

        console.debug('Dropdown value change:', currentValue, '=>', value);

        if (typeof onChange === 'function') {
            onChange(value);
        }

        setCurrentValue(value);
    }

    const currentLabel = options.find(opt => opt.value === currentValue)?.label;
    const rawDisplayValue = currentLabel || currentValue || placeholder || 'Dropdown';

    const formattedDisplayValue = format?.(rawDisplayValue) ?? rawDisplayValue;

    const placeholderClassName = classnames({
        'text-foreground-default': !!currentValue,
        'text-foreground-subtlest hover:text-foreground-subtle': !currentValue
    });

    return (
        <Combobox value={currentValue} onChange={handleValueChange}>
            <div className="relative">
                <Combobox.Button as={Button} size="sm" scheme="transparent">
                    <span className={placeholderClassName}>
                        {formattedDisplayValue}
                    </span>
                </Combobox.Button>
                <Combobox.Options className={getDropdownClassName({})}>
                    {options.map(option => (
                        <Combobox.Option key={option.value} value={option.value} as={Fragment}>
                            {({ active, selected }) => (
                                <li className={getOptionClassName({ active, selected })}>
                                    {option.label}
                                </li>
                            )}
                        </Combobox.Option>
                    ))}
                </Combobox.Options>
            </div>
        </Combobox>
    );
}
