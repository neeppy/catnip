import { Combobox } from '@headlessui/react';
import { Button } from 'ui-kit/Button';
import classnames from 'classnames';
import { IOption } from './Select';
import { Fragment, useState } from 'react';
import { cva } from 'class-variance-authority';

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
            default: 'bg-scene-400 shadow-lg shadow-scene-200'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});

const getOptionClassName = cva('cursor-pointer', {
    variants: {
        variant: {
            default: 'text-scene-default text-xs py-1'
        },
        size: {
            sm: 'px-2 py-1',
            md: 'px-4 py-3'
        },
        active: {
            true: 'bg-scene-500',
            false: null
        },
        selected: {
            true: 'bg-scene-600 font-bold'
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
        'text-scene-default': !!currentValue,
        'text-scene-darker hover:text-scene-dark': !currentValue
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
